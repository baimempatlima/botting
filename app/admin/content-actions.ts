'use server';

import { supabaseAdmin } from '@/lib/supabase-admin';
import type { Prosesi, CoupleProfileData, EventLocation, GalleryPhoto, BankAccount } from '@/lib/types';

// ─── Settings ─────────────────────────────────────────────────
export async function updateSettingAction(key: string, value: string): Promise<{ error?: string }> {
  const { error } = await supabaseAdmin.from('settings').upsert({ key, value }, { onConflict: 'key' });
  return error ? { error: error.message } : {};
}

export async function getSettingsAction(): Promise<Record<string, string>> {
  const { data } = await supabaseAdmin.from('settings').select('key, value');
  const obj: Record<string, string> = {};
  (data ?? []).forEach((r: { key: string; value: string }) => { obj[r.key] = r.value; });
  return obj;
}

// ─── Prosesi ──────────────────────────────────────────────────
export async function getProsesiAction(): Promise<Prosesi[]> {
  const { data } = await supabaseAdmin.from('prosesi').select('*').order('sort_order');
  return (data ?? []) as Prosesi[];
}

export async function upsertProsesiAction(item: Partial<Prosesi> & { name: string }): Promise<{ error?: string }> {
  if (item.id) {
    const { error } = await supabaseAdmin.from('prosesi').update(item).eq('id', item.id);
    return error ? { error: error.message } : {};
  }
  const { error } = await supabaseAdmin.from('prosesi').insert(item);
  return error ? { error: error.message } : {};
}

export async function deleteProsesiAction(id: string): Promise<{ error?: string }> {
  const { error } = await supabaseAdmin.from('prosesi').delete().eq('id', id);
  return error ? { error: error.message } : {};
}

// ─── Couple Profiles ──────────────────────────────────────────
export async function getCoupleAction(): Promise<CoupleProfileData[]> {
  const { data } = await supabaseAdmin.from('couple_profiles').select('*');
  return (data ?? []) as CoupleProfileData[];
}

export async function upsertCoupleAction(item: Partial<CoupleProfileData> & { name: string; role: string }): Promise<{ error?: string }> {
  if (item.id) {
    const { error } = await supabaseAdmin.from('couple_profiles').update(item).eq('id', item.id);
    return error ? { error: error.message } : {};
  }
  const { error } = await supabaseAdmin.from('couple_profiles').insert(item);
  return error ? { error: error.message } : {};
}

// ─── Event Locations ──────────────────────────────────────────
export async function getLocationsAction(): Promise<EventLocation[]> {
  const { data } = await supabaseAdmin.from('event_locations').select('*').order('sort_order');
  return (data ?? []) as EventLocation[];
}

export async function upsertLocationAction(item: Partial<EventLocation> & { label: string }): Promise<{ error?: string }> {
  if (item.id) {
    const { error } = await supabaseAdmin.from('event_locations').update(item).eq('id', item.id);
    return error ? { error: error.message } : {};
  }
  const { error } = await supabaseAdmin.from('event_locations').insert(item);
  return error ? { error: error.message } : {};
}

export async function deleteLocationAction(id: string): Promise<{ error?: string }> {
  const { error } = await supabaseAdmin.from('event_locations').delete().eq('id', id);
  return error ? { error: error.message } : {};
}

// ─── Gallery ──────────────────────────────────────────────────
export async function getGalleryAction(): Promise<GalleryPhoto[]> {
  const { data } = await supabaseAdmin.from('gallery_photos').select('*').order('sort_order');
  return (data ?? []) as GalleryPhoto[];
}

export async function upsertPhotoAction(item: Partial<GalleryPhoto> & { src: string }): Promise<{ error?: string }> {
  if (item.id) {
    const { error } = await supabaseAdmin.from('gallery_photos').update(item).eq('id', item.id);
    return error ? { error: error.message } : {};
  }
  const { error } = await supabaseAdmin.from('gallery_photos').insert(item);
  return error ? { error: error.message } : {};
}

export async function deletePhotoAction(id: string): Promise<{ error?: string }> {
  const { error } = await supabaseAdmin.from('gallery_photos').delete().eq('id', id);
  return error ? { error: error.message } : {};
}

// ─── Bank Accounts ────────────────────────────────────────────
export async function getBanksAction(): Promise<BankAccount[]> {
  const { data } = await supabaseAdmin.from('bank_accounts').select('*').order('sort_order');
  return (data ?? []) as BankAccount[];
}

export async function upsertBankAction(item: Partial<BankAccount> & { bank_name: string; account_number: string; account_holder: string }): Promise<{ error?: string }> {
  if (item.id) {
    const { error } = await supabaseAdmin.from('bank_accounts').update(item).eq('id', item.id);
    return error ? { error: error.message } : {};
  }
  const { error } = await supabaseAdmin.from('bank_accounts').insert(item);
  return error ? { error: error.message } : {};
}

export async function deleteBankAction(id: string): Promise<{ error?: string }> {
  const { error } = await supabaseAdmin.from('bank_accounts').delete().eq('id', id);
  return error ? { error: error.message } : {};
}
