import { supabase } from './supabase';
import type { WeddingPageData, WeddingSettings, Prosesi, CoupleProfileData, EventLocation, GalleryPhoto, BankAccount } from './types';

export async function fetchWeddingData(): Promise<WeddingPageData> {
  const [sRes, pRes, cRes, lRes, gRes, bRes] = await Promise.all([
    supabase.from('settings').select('key, value'),
    supabase.from('prosesi').select('*').order('sort_order'),
    supabase.from('couple_profiles').select('*'),
    supabase.from('event_locations').select('*').order('sort_order'),
    supabase.from('gallery_photos').select('*').order('sort_order'),
    supabase.from('bank_accounts').select('*').order('sort_order'),
  ]);

  // Convert settings rows to object
  const settings: WeddingSettings = { wedding_date: '2026-12-12T08:00:00+08:00', groom_name: 'Andi', bride_name: 'Tenri' };
  (sRes.data ?? []).forEach((r: { key: string; value: string }) => { settings[r.key] = r.value; });

  return {
    settings,
    prosesi:   (pRes.data ?? []) as Prosesi[],
    couple:    (cRes.data ?? []) as CoupleProfileData[],
    locations: (lRes.data ?? []) as EventLocation[],
    gallery:   (gRes.data ?? []) as GalleryPhoto[],
    banks:     (bRes.data ?? []) as BankAccount[],
  };
}
