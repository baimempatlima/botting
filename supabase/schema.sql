-- ============================================================
-- Wedding Invitation — Supabase Schema
-- Run this in Supabase SQL Editor (Dashboard > SQL Editor > New Query)
-- ============================================================

-- Enable UUID extension (already enabled on Supabase by default)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─── TABLE: guests ───────────────────────────────────────────
-- Daftar tamu undangan yang sudah dimasukkan oleh admin
-- Setiap tamu mendapat slug unik untuk link personal
CREATE TABLE IF NOT EXISTS public.guests (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name           TEXT NOT NULL,
  phone          TEXT,
  category       TEXT CHECK (category IN ('keluarga', 'teman', 'kantor', 'lainnya')) DEFAULT 'lainnya',
  slug           TEXT UNIQUE, -- misal: "pak-hasan" → /?to=pak-hasan
  estimated_pax  INTEGER DEFAULT 1,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast slug lookup (used on every page open)
CREATE INDEX IF NOT EXISTS guests_slug_idx ON public.guests (slug);

-- ─── TABLE: rsvp ─────────────────────────────────────────────
-- Response dari tamu (baik dari link personal maupun tamu umum)
CREATE TABLE IF NOT EXISTS public.rsvp (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guest_id    UUID REFERENCES public.guests (id) ON DELETE SET NULL, -- nullable: tamu umum tanpa link
  name        TEXT NOT NULL,
  attendance  TEXT NOT NULL CHECK (attendance IN ('hadir', 'tidak_hadir', 'ragu')),
  pax         INTEGER DEFAULT 1 CHECK (pax >= 1 AND pax <= 20),
  message     TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Index for latest messages (used in ucapan list)
CREATE INDEX IF NOT EXISTS rsvp_created_at_idx ON public.rsvp (created_at DESC);

-- ─── ROW LEVEL SECURITY ──────────────────────────────────────
ALTER TABLE public.guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rsvp   ENABLE ROW LEVEL SECURITY;

-- Public: anyone can INSERT into rsvp (submit form)
DROP POLICY IF EXISTS "rsvp_public_insert" ON public.rsvp;
CREATE POLICY "rsvp_public_insert"
  ON public.rsvp FOR INSERT
  TO anon
  WITH CHECK (true);

-- Public: anyone can SELECT rsvp (to see ucapan)
DROP POLICY IF EXISTS "rsvp_public_select" ON public.rsvp;
CREATE POLICY "rsvp_public_select"
  ON public.rsvp FOR SELECT
  TO anon
  USING (true);

-- Public: can read guests by slug only (for auto-fill name)
DROP POLICY IF EXISTS "guests_public_read_by_slug" ON public.guests;
CREATE POLICY "guests_public_read_by_slug"
  ON public.guests FOR SELECT
  TO anon
  USING (slug IS NOT NULL);

-- Admin (authenticated) has full access
DROP POLICY IF EXISTS "guests_admin_all" ON public.guests;
CREATE POLICY "guests_admin_all"
  ON public.guests FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "rsvp_admin_all" ON public.rsvp;
CREATE POLICY "rsvp_admin_all"
  ON public.rsvp FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);


-- ═══════════════════════════════════════════════════════════════
-- DYNAMIC CONTENT TABLES (managed via Admin Dashboard)
-- ═══════════════════════════════════════════════════════════════

-- ─── TABLE: settings ─────────────────────────────────────────
-- Key-value store for global wedding settings
CREATE TABLE IF NOT EXISTS public.settings (
  key    TEXT PRIMARY KEY,
  value  TEXT NOT NULL
);

-- Seed defaults
INSERT INTO public.settings (key, value) VALUES
  ('wedding_date', '2026-12-12T08:00:00+08:00'),
  ('groom_name', 'Andi Muhammad Fadhil'),
  ('bride_name', 'Tenri Ajeng Pratiwi')
ON CONFLICT (key) DO NOTHING;

-- ─── TABLE: prosesi ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.prosesi (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  subtitle    TEXT,
  event_date  TEXT,
  event_time  TEXT,
  description TEXT,
  sort_order  INTEGER DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─── TABLE: couple_profiles ──────────────────────────────────
CREATE TABLE IF NOT EXISTS public.couple_profiles (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role         TEXT NOT NULL CHECK (role IN ('pria', 'wanita')),
  name         TEXT NOT NULL,
  father_name  TEXT,
  mother_name  TEXT,
  birth_order  TEXT,
  photo_url    TEXT,
  instagram    TEXT,
  facebook     TEXT
);

-- ─── TABLE: event_locations ──────────────────────────────────
CREATE TABLE IF NOT EXISTS public.event_locations (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label          TEXT NOT NULL,
  event_date     TEXT,
  time_start     TEXT,
  time_end       TEXT,
  time_display   TEXT,
  venue_name     TEXT,
  address        TEXT,
  city           TEXT,
  map_embed_url  TEXT,
  map_direct_url TEXT,
  sort_order     INTEGER DEFAULT 0
);

-- ─── TABLE: gallery_photos ───────────────────────────────────
CREATE TABLE IF NOT EXISTS public.gallery_photos (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  src         TEXT NOT NULL,
  title       TEXT,
  description TEXT,
  span_class  TEXT DEFAULT '',
  sort_order  INTEGER DEFAULT 0
);

-- ─── TABLE: bank_accounts ────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.bank_accounts (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bank_name       TEXT NOT NULL,
  account_number  TEXT NOT NULL,
  account_holder  TEXT NOT NULL,
  qris_url        TEXT,
  sort_order      INTEGER DEFAULT 0
);

-- ─── RLS for new tables ──────────────────────────────────────
ALTER TABLE public.settings        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prosesi         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.couple_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_photos  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bank_accounts   ENABLE ROW LEVEL SECURITY;

-- Public read for all content tables (needed by frontend)
DROP POLICY IF EXISTS "settings_public_read"        ON public.settings;
CREATE POLICY "settings_public_read"        ON public.settings        FOR SELECT TO anon USING (true);

DROP POLICY IF EXISTS "prosesi_public_read"         ON public.prosesi;
CREATE POLICY "prosesi_public_read"         ON public.prosesi         FOR SELECT TO anon USING (true);

DROP POLICY IF EXISTS "couple_profiles_public_read" ON public.couple_profiles;
CREATE POLICY "couple_profiles_public_read" ON public.couple_profiles FOR SELECT TO anon USING (true);

DROP POLICY IF EXISTS "event_locations_public_read" ON public.event_locations;
CREATE POLICY "event_locations_public_read" ON public.event_locations FOR SELECT TO anon USING (true);

DROP POLICY IF EXISTS "gallery_photos_public_read"  ON public.gallery_photos;
CREATE POLICY "gallery_photos_public_read"  ON public.gallery_photos  FOR SELECT TO anon USING (true);

DROP POLICY IF EXISTS "bank_accounts_public_read"   ON public.bank_accounts;
CREATE POLICY "bank_accounts_public_read"   ON public.bank_accounts   FOR SELECT TO anon USING (true);

-- Admin full access
DROP POLICY IF EXISTS "settings_admin"        ON public.settings;
CREATE POLICY "settings_admin"        ON public.settings        FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "prosesi_admin"         ON public.prosesi;
CREATE POLICY "prosesi_admin"         ON public.prosesi         FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "couple_profiles_admin" ON public.couple_profiles;
CREATE POLICY "couple_profiles_admin" ON public.couple_profiles FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "event_locations_admin" ON public.event_locations;
CREATE POLICY "event_locations_admin" ON public.event_locations FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "gallery_photos_admin"  ON public.gallery_photos;
CREATE POLICY "gallery_photos_admin"  ON public.gallery_photos  FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "bank_accounts_admin"   ON public.bank_accounts;
CREATE POLICY "bank_accounts_admin"   ON public.bank_accounts   FOR ALL TO authenticated USING (true) WITH CHECK (true);


-- ─── SEED: sample guest data (opsional, hapus jika tidak perlu) ──
-- INSERT INTO public.guests (name, phone, category, slug, estimated_pax) VALUES
--   ('Pak Hasan Basri',     '081234567890', 'keluarga', 'pak-hasan',   2),
--   ('Keluarga Daeng Naba', '082345678901', 'keluarga', 'daeng-naba',  4),
--   ('Tim Marketing Kantor','083456789012', 'kantor',   'tim-kantor',  6);
