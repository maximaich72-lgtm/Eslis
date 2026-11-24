interface R2ObjectBody {
  body: ReadableStream;
  httpEtag?: string;
  httpMetadata?: {
    contentType?: string;
    cacheControl?: string;
  };
}

interface R2BucketBinding {
  get: (key: string) => Promise<R2ObjectBody | null>;
}

interface Env {
  IMAGES_BUCKET?: R2BucketBinding;
  BUCKET?: R2BucketBinding;
}

interface PagesContext {
  env: Env;
  params: {
    key?: string | string[];
  };
}

export async function onRequestGet(context: PagesContext): Promise<Response> {
  const { env, params } = context;
  const bucket = env.IMAGES_BUCKET || env.BUCKET;

  if (!bucket) {
    return new Response('R2 bucket binding not configured', { status: 501 });
  }

  const rawKey = Array.isArray(params.key) ? params.key.join('/') : params.key;
  if (!rawKey) {
    return new Response('Missing image key', { status: 400 });
  }

  const key = decodeURIComponent(rawKey);
  const object = await bucket.get(key);

  if (!object) {
    return new Response('Image not found', { status: 404 });
  }

  const headers = new Headers();
  headers.set('Content-Type', object.httpMetadata?.contentType || 'image/jpeg');
  headers.set(
    'Cache-Control',
    object.httpMetadata?.cacheControl || 'public, max-age=31536000, immutable'
  );
  if (object.httpEtag) {
    headers.set('ETag', object.httpEtag);
  }

  return new Response(object.body, {
    status: 200,
    headers,
  });
}
