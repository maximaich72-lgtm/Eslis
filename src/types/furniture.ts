export type FurnitureCategory = 'Sofas' | 'Chairs' | 'Bedroom' | 'Storage' | 'Dining';

export interface FurnitureItem {
  id: string;
  slotNumber: string;
  title: string;
  category: FurnitureCategory;
  priceKes: number;
  dimensions: string;
  material: string;
  description: string;
  imageUrl: string;
  inStock: boolean;
  featured: boolean;
  quantityOnHand: number;
  updatedAt: string;
}

export interface RoomLookbook {
  id: string;
  label: string;
  title: string;
  location: string;
  featuredPiece: string;
  imageUrl: string;
}

export interface SocialLinksConfig {
  instagramHandle: string;
  instagramUrl: string;
  facebookBrandHandle: string;
  facebookBrandUrl: string;
  facebookFounderHandle: string;
  facebookFounderUrl: string;
  xHandle: string;
  xUrl: string;
  whatsappDisplay: string;
  whatsappNumber: string;
}

export interface SiteMediaConfig {
  heroImageUrl: string;
  heroTagline: string;
  heroSubTagline: string;
  craftSpotlightTitle: string;
  craftSpotlightMaterial: string;
  craftSpotlightImageUrl: string;
  rooms: RoomLookbook[];
  socials: SocialLinksConfig;
}

export interface SaleRecord {
  id: string;
  itemTitle: string;
  quantity: number;
  totalKes: number;
  branch: string;
  channel: 'Showroom' | 'WhatsApp' | 'Web Bag';
  createdAt: string;
}

export interface CartItem {
  item: FurnitureItem;
  quantity: number;
}

export interface ShowroomBranch {
  id: string;
  name: string;
  landmark: string;
  hours: string;
  phone: string;
}
