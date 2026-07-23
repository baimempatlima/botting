import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ─── TypeScript types matching schema ───────────────────────

export type GuestCategory = 'keluarga' | 'teman' | 'kantor' | 'lainnya';
export type AttendanceStatus = 'hadir' | 'tidak_hadir' | 'ragu';

export interface Guest {
  id: string;
  name: string;
  phone?: string;
  category: GuestCategory;
  slug: string;
  estimated_pax: number;
  created_at: string;
}

export interface RsvpEntry {
  id: string;
  guest_id?: string;
  name: string;
  attendance: AttendanceStatus;
  pax: number;
  message?: string;
  created_at: string;
}

export type RsvpInsert = Omit<RsvpEntry, 'id' | 'created_at'>;

// ─── Helper: submit RSVP ────────────────────────────────────
export async function submitRsvp(data: RsvpInsert) {
  const { error } = await supabase.from('rsvp').insert(data);
  if (error) throw new Error(error.message);
}

// ─── Helper: fetch recent messages (ucapan) ─────────────────
export async function fetchMessages(limit = 20): Promise<RsvpEntry[]> {
  const { data, error } = await supabase
    .from('rsvp')
    .select('id, name, attendance, pax, message, created_at')
    .not('message', 'is', null)
    .neq('message', '')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw new Error(error.message);
  return (data ?? []) as RsvpEntry[];
}

// ─── Helper: lookup guest by slug ───────────────────────────
export async function getGuestBySlug(slug: string): Promise<Guest | null> {
  const { data } = await supabase
    .from('guests')
    .select('*')
    .eq('slug', slug)
    .single();
  return data as Guest | null;
}
