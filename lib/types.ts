// ─── Shared TypeScript types for dynamic wedding content ─────

export interface WeddingSettings {
  wedding_date: string;
  groom_name: string;
  bride_name: string;
  [key: string]: string;
}

export interface Prosesi {
  id: string;
  name: string;
  subtitle?: string;
  event_date?: string;
  event_time?: string;
  description?: string;
  sort_order: number;
}

export interface CoupleProfileData {
  id: string;
  role: 'pria' | 'wanita';
  name: string;
  father_name?: string;
  mother_name?: string;
  birth_order?: string;
  photo_url?: string;
  instagram?: string;
  facebook?: string;
}

export interface EventLocation {
  id: string;
  label: string;
  event_date?: string;
  time_start?: string;
  time_end?: string;
  time_display?: string;
  venue_name?: string;
  address?: string;
  city?: string;
  map_embed_url?: string;
  map_direct_url?: string;
  sort_order: number;
}

export interface GalleryPhoto {
  id: string;
  src: string;
  title?: string;
  description?: string;
  span_class?: string;
  sort_order: number;
}

export interface BankAccount {
  id: string;
  bank_name: string;
  account_number: string;
  account_holder: string;
  qris_url?: string;
  sort_order: number;
}

// Bundle all data for the frontend page
export interface WeddingPageData {
  settings: WeddingSettings;
  prosesi: Prosesi[];
  couple: CoupleProfileData[];
  locations: EventLocation[];
  gallery: GalleryPhoto[];
  banks: BankAccount[];
}
