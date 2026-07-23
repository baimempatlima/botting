'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabase-admin';
import type { Guest, RsvpEntry } from '@/lib/supabase';

// ─── Slug generator ───────────────────────────────────────────
function generateSlug(name: string): string {
  const base = name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 28);
  return base;
}

// ─── Auth actions ─────────────────────────────────────────────
export async function loginAction(password: string): Promise<{ error?: string }> {
  if (password !== process.env.ADMIN_PASSWORD) {
    return { error: 'Password salah. Coba lagi.' };
  }
  cookies().set('admin_session', 'authenticated', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24, // 24 jam
    path: '/',
  });
  redirect('/admin');
}

export async function logoutAction(): Promise<void> {
  cookies().delete('admin_session');
  redirect('/admin');
}

// ─── Guest actions ────────────────────────────────────────────
export interface AddGuestInput {
  name: string;
  phone: string;
  category: string;
  estimated_pax: number;
}

export async function addGuestAction(
  data: AddGuestInput
): Promise<{ error?: string; slug?: string }> {
  const slug = generateSlug(data.name);
  const { error } = await supabaseAdmin.from('guests').insert({
    name: data.name.trim(),
    phone: data.phone.trim() || null,
    category: data.category,
    estimated_pax: data.estimated_pax,
    slug,
  });
  if (error) return { error: error.message };
  return { slug };
}

export interface CsvRow {
  name: string;
  phone: string;
  category: string;
  estimated_pax: number;
}

export async function bulkImportAction(
  rows: CsvRow[]
): Promise<{ error?: string; count?: number }> {
  const records = rows.map((r) => ({
    name: r.name.trim(),
    phone: r.phone?.trim() || null,
    category: r.category?.trim() || 'lainnya',
    estimated_pax: Number(r.estimated_pax) || 1,
    slug: generateSlug(r.name),
  }));
  const { error } = await supabaseAdmin.from('guests').insert(records);
  if (error) return { error: error.message };
  return { count: records.length };
}

export async function deleteGuestAction(
  id: string
): Promise<{ error?: string }> {
  const { error } = await supabaseAdmin.from('guests').delete().eq('id', id);
  if (error) return { error: error.message };
  return {};
}

export async function getGuestsAction(): Promise<Guest[]> {
  const { data, error } = await supabaseAdmin
    .from('guests')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) return [];
  return (data ?? []) as Guest[];
}

// ─── RSVP actions ─────────────────────────────────────────────
export async function getRsvpAction(): Promise<RsvpEntry[]> {
  const { data, error } = await supabaseAdmin
    .from('rsvp')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) return [];
  return (data ?? []) as RsvpEntry[];
}
