-- ============================================================
-- DUMMY DATA UNTUK PREVIEW WEBSITE
-- ============================================================

-- 1. settings
INSERT INTO public.settings (key, value) VALUES
  ('wedding_date', '2026-08-03T08:00:00+08:00'),
  ('groom_name', 'Amir'),
  ('bride_name', 'Warda')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- Bersihkan data lama (agar tidak duplicate saat di-run berkali-kali)
DELETE FROM public.prosesi;
DELETE FROM public.couple_profiles;
DELETE FROM public.event_locations;
DELETE FROM public.gallery_photos;
DELETE FROM public.bank_accounts;
DELETE FROM public.guests;

-- 2. prosesi
INSERT INTO public.prosesi (name, subtitle, event_date, event_time, description, sort_order) VALUES
  ('Mappettuada', 'Lamaran & Penentuan Hari', 'Minggu, 12 Juli 2026', '10:00 WITA - Selesai', 'Momen pertemuan dua keluarga besar untuk saling mengenal dan menentukan hari baik pernikahan.', 1),
  ('Mappacci', 'Malam Pacar', 'Minggu, 2 Agustus 2026', '19:00 WITA - Selesai', 'Malam penyucian diri calon pengantin dengan menggunakan daun pacar, diiringi doa restu dari keluarga.', 2);

-- 3. couple_profiles
INSERT INTO public.couple_profiles (role, name, father_name, mother_name, birth_order, photo_url, instagram, facebook) VALUES
  ('pria', 'Amir, S.T.', 'Bpk. H. Syamsuddin', 'Ibu Hj. Rosmiati', 'Putra Kedua', '/images/groom.jpg', '@amir_st', 'Amir'),
  ('wanita', 'Warda, S.Pd.', 'Bpk. H. Abdurrahman', 'Ibu Hj. Siti Aminah', 'Putri Pertama', '/images/bride.jpg', '@warda', 'Warda');

-- 4. event_locations
INSERT INTO public.event_locations (label, event_date, time_start, time_end, time_display, venue_name, address, city, map_embed_url, map_direct_url, sort_order) VALUES
  ('Akad Nikah', 'Senin, 3 Agustus 2026', '08:00', '10:00', '08:00 WITA - 10:00 WITA', 'Masjid Raya', 'Jl. Masjid Raya No.1, Kec. Bontoala', 'Kota Makassar, Sulawesi Selatan', 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15894.50284242699!2d119.4184649!3d-5.1352569!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dbf02ae2b2dc587%3A0xc3f58a74b0cc106e!2sMasjid%20Raya%20Makassar!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid', 'https://maps.app.goo.gl/eK3hFyF1T3VaXqNs9', 1),
  ('Resepsi Pernikahan', 'Senin, 3 Agustus 2026', '11:00', '14:00', '11:00 WITA - Selesai', 'Gedung Pertemuan', 'Jl. Urip Sumoharjo', 'Kota Makassar, Sulawesi Selatan', 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15894.50284242699!2d119.4184649!3d-5.1352569!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dbf02ae2b2dc587%3A0xc3f58a74b0cc106e!2sMasjid%20Raya%20Makassar!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid', 'https://maps.app.goo.gl/eK3hFyF1T3VaXqNs9', 2);

-- 5. gallery_photos
INSERT INTO public.gallery_photos (src, title, description, span_class, sort_order) VALUES
  ('/images/cover.jpg', 'Prewedding 1', 'Momen indah', 'md:col-span-2 md:row-span-2', 1),
  ('/images/hero.jpg', 'Prewedding 2', 'Baju Adat', '', 2),
  ('/images/cover.jpg', 'Prewedding 3', 'Kebersamaan', '', 3);

-- 6. bank_accounts
INSERT INTO public.bank_accounts (bank_name, account_number, account_holder, sort_order) VALUES
  ('BCA', '1234567890', 'Amir', 1),
  ('Mandiri', '0987654321', 'Warda', 2);

-- 7. guests
INSERT INTO public.guests (name, phone, category, slug, estimated_pax) VALUES
  ('Bapak Presiden', '08111111111', 'keluarga', 'bapak-presiden', 2),
  ('Keluarga Besar', '08222222222', 'keluarga', 'keluarga-besar', 4);
