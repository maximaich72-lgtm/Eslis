import {
  DEFAULT_FURNITURE_ITEMS,
  DEFAULT_SALES,
  DEFAULT_SITE_MEDIA,
} from '../data/defaultCatalog';
import { FurnitureItem, SaleRecord, SiteMediaConfig } from '../types/furniture';

const STORAGE_KEYS = {
  ITEMS: 'eslis_furniture_items_v1',
  MEDIA: 'eslis_site_media_v1',
  SALES: 'eslis_sales_records_v1',
} as const;

function safeRead<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function safeWrite<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.warn('Storage write skipped:', err);
  }
}

export interface UploadResult {
  url: string;
  storage: 'r2' | 'local-fallback';
  key?: string;
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to read image file.'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read image file.'));
    reader.readAsDataURL(file);
  });
}

export const storageService = {
  async uploadImage(file: File, adminPassword: string): Promise<UploadResult> {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'x-admin-password': adminPassword,
        },
        body: formData,
      });

      if (res.status === 401 || res.status === 403) {
        const errBody = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(errBody.error || 'Admin password rejected by upload endpoint.');
      }

      if (res.ok) {
        const data = (await res.json()) as { url?: string; key?: string };
        if (data.url) {
          return {
            url: data.url,
            storage: 'r2',
            key: data.key,
          };
        }
      }
    } catch (err) {
      if (err instanceof Error && err.message.includes('password')) {
        throw err;
      }
      // Local dev fallback when Cloudflare Pages / R2 binding is not attached
    }

    const dataUrl = await readFileAsDataUrl(file);
    return {
      url: dataUrl,
      storage: 'local-fallback',
    };
  },

  async getItems(): Promise<FurnitureItem[]> {
    // Future Cloudflare D1 endpoint: const res = await fetch('/api/items');
    const items = safeRead<FurnitureItem[]>(STORAGE_KEYS.ITEMS, DEFAULT_FURNITURE_ITEMS);
    return items.length > 0 ? items : DEFAULT_FURNITURE_ITEMS;
  },

  async saveItem(item: FurnitureItem): Promise<FurnitureItem[]> {
    const current = await this.getItems();
    const exists = current.some((entry) => entry.id === item.id);
    const updatedItem = { ...item, updatedAt: new Date().toISOString() };
    const next = exists
      ? current.map((entry) => (entry.id === item.id ? updatedItem : entry))
      : [...current, updatedItem];
    safeWrite(STORAGE_KEYS.ITEMS, next);
    return next;
  },

  async deleteItem(id: string): Promise<FurnitureItem[]> {
    const current = await this.getItems();
    const next = current
      .filter((entry) => entry.id !== id)
      .map((entry, idx) => ({
        ...entry,
        slotNumber: String(idx + 1).padStart(2, '0'),
      }));
    safeWrite(STORAGE_KEYS.ITEMS, next);
    return next;
  },

  async getSiteMedia(): Promise<SiteMediaConfig> {
    const saved = safeRead<Partial<SiteMediaConfig>>(STORAGE_KEYS.MEDIA, DEFAULT_SITE_MEDIA);
    return {
      ...DEFAULT_SITE_MEDIA,
      ...saved,
      rooms: saved.rooms && saved.rooms.length > 0 ? saved.rooms : DEFAULT_SITE_MEDIA.rooms,
      socials: {
        ...DEFAULT_SITE_MEDIA.socials,
        ...(saved.socials || {}),
      },
    };
  },

  async saveSiteMedia(config: SiteMediaConfig): Promise<SiteMediaConfig> {
    safeWrite(STORAGE_KEYS.MEDIA, config);
    return config;
  },

  async getSales(): Promise<SaleRecord[]> {
    return safeRead<SaleRecord[]>(STORAGE_KEYS.SALES, DEFAULT_SALES);
  },

  async recordSale(sale: Omit<SaleRecord, 'id' | 'createdAt'>): Promise<SaleRecord[]> {
    const current = await this.getSales();
    const entry: SaleRecord = {
      ...sale,
      id: `sale-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    const next = [entry, ...current];
    safeWrite(STORAGE_KEYS.SALES, next);
    return next;
  },

  async resetAll(): Promise<{
    items: FurnitureItem[];
    media: SiteMediaConfig;
    sales: SaleRecord[];
  }> {
    safeWrite(STORAGE_KEYS.ITEMS, DEFAULT_FURNITURE_ITEMS);
    safeWrite(STORAGE_KEYS.MEDIA, DEFAULT_SITE_MEDIA);
    safeWrite(STORAGE_KEYS.SALES, DEFAULT_SALES);
    return {
      items: DEFAULT_FURNITURE_ITEMS,
      media: DEFAULT_SITE_MEDIA,
      sales: DEFAULT_SALES,
    };
  },
};

export function formatKes(amount: number): string {
  return `KES ${Math.round(amount).toLocaleString('en-KE')}`;
}
