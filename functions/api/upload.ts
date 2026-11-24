interface R2PutOptions {
  httpMetadata?: {
    contentType?: string;
    cacheControl?: string;
  };
}

interface R2BucketBinding {
  put: (
    key: string,
    value: ArrayBuffer | ReadableStream | string,
    options?: R2PutOptions
  ) => Promise<unknown>;
}

interface Env {
  IMAGES_BUCKET?: R2BucketBinding;
  BUCKET?: R2BucketBinding;
  ADMIN_PASSWORD?: string;
}

interface PagesContext {
  request: Request;
  env: Env;
}

const MAX_UPLOAD_BYTES = 10 * 1024 * 1024; // 10 MB

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
    },
  });
}

export async function onRequestPost(context: PagesContext): Promise<Response> {
  const { request, env } = context;
  const expectedPassword = env.ADMIN_PASSWORD || '2026';
  const providedPassword = request.headers.get('x-admin-password') || '';

  if (!providedPassword || providedPassword !== expectedPassword) {
    return jsonResponse({ error: 'Unauthorized admin upload request.' }, 401);
  }

  const bucket = env.IMAGES_BUCKET || env.BUCKET;
  if (!bucket) {
    return jsonResponse(
      { error: 'Cloudflare R2 bucket binding (IMAGES_BUCKET or BUCKET) is not configured.' },
      501
    );
  }

  const contentType = request.headers.get('content-type') || '';
  if (!contentType.includes('multipart/form-data')) {
    return jsonResponse({ error: 'Expected multipart/form-data upload.' }, 400);
  }

  const formData = await request.formData();
  const fileEntry = formData.get('file');

  if (!fileEntry || typeof fileEntry === 'string') {
    return jsonResponse({ error: 'Missing image file field.' }, 400);
  }

  const file = fileEntry as File;
  if (!file.type.startsWith('image/')) {
    return jsonResponse({ error: 'Only image files are permitted.' }, 400);
  }

  if (file.size <= 0 || file.size > MAX_UPLOAD_BYTES) {
    return jsonResponse({ error: 'Image must be between 1 byte and 10 MB.' }, 400);
  }

  const sanitizedName = file.name
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 64);
  const key = `eslis-${Date.now()}-${sanitizedName || 'image.jpg'}`;

  await bucket.put(key, await file.arrayBuffer(), {
    httpMetadata: {
      contentType: file.type,
      cacheControl: 'public, max-age=31536000, immutable',
    },
  });

  return jsonResponse(
    {
      ok: true,
      key,
      url: `/api/images/${encodeURIComponent(key)}`,
    },
    201
  );
}
