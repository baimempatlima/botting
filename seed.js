const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Manually parse .env.local
const envPath = path.join(__dirname, '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    let value = match[2] ? match[2].trim() : '';
    // remove quotes if any
    if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
    if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
    env[match[1]] = value;
  }
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  console.log("Seeding database...");

  // 1. Settings
  await supabase.from('settings').upsert([
    { key: 'wedding_date', value: '2026-08-03T08:00:00+08:00' },
    { key: 'groom_name', value: 'Amir' },
    { key: 'bride_name', value: 'Warda' }
  ]);

  // Hapus data lama (karena ini dummy data seed)
  await supabase.from('prosesi').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('couple_profiles').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('event_locations').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('gallery_photos').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('bank_accounts').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('guests').delete().neq('id', '00000000-0000-0000-0000-000000000000');

  // 2. Prosesi
  await supabase.from('prosesi').insert([
    {
      name: 'Mappettuada',
      subtitle: 'Lamaran & Penentuan Hari',
      event_date: 'Minggu, 12 Juli 2026',
      event_time: '10:00 WITA - Selesai',
      description: 'Momen pertemuan dua keluarga besar untuk saling mengenal dan menentukan hari baik pernikahan.',
      sort_order: 1
    },
    {
      name: 'Mappacci',
      subtitle: 'Malam Pacar',
      event_date: 'Minggu, 2 Agustus 2026',
      event_time: '19:00 WITA - Selesai',
      description: 'Malam penyucian diri calon pengantin dengan menggunakan daun pacar, diiringi doa restu dari keluarga.',
      sort_order: 2
    }
  ]);

  // 3. Couple Profiles
  await supabase.from('couple_profiles').insert([
    {
      role: 'pria',
      name: 'Amiruddin, S.T.',
      father_name: 'Bpk. H. Syamsuddin',
      mother_name: 'Ibu Hj. Rosmiati',
      birth_order: 'Putra Kedua',
      photo_url: '/images/groom.jpg',
      instagram: '@amiruddin_st',
      facebook: 'Amiruddin'
    },
    {
      role: 'wanita',
      name: 'Wardatul Jannah, S.Pd.',
      father_name: 'Bpk. H. Abdurrahman',
      mother_name: 'Ibu Hj. Siti Aminah',
      birth_order: 'Putri Pertama',
      photo_url: '/images/bride.jpg',
      instagram: '@wardatuljannah',
      facebook: 'Wardatul Jannah'
    }
  ]);

  // 4. Event Locations
  await supabase.from('event_locations').insert([
    {
      label: 'Akad Nikah',
      event_date: 'Senin, 3 Agustus 2026',
      time_start: '08:00',
      time_end: '10:00',
      time_display: '08:00 WITA - 10:00 WITA',
      venue_name: 'Masjid Raya',
      address: 'Jl. Masjid Raya No.1, Kec. Bontoala',
      city: 'Kota Makassar, Sulawesi Selatan',
      map_embed_url: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15894.50284242699!2d119.4184649!3d-5.1352569!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dbf02ae2b2dc587%3A0xc3f58a74b0cc106e!2sMasjid%20Raya%20Makassar!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid',
      map_direct_url: 'https://maps.app.goo.gl/eK3hFyF1T3VaXqNs9',
      sort_order: 1
    },
    {
      label: 'Resepsi Pernikahan',
      event_date: 'Senin, 3 Agustus 2026',
      time_start: '11:00',
      time_end: '14:00',
      time_display: '11:00 WITA - Selesai',
      venue_name: 'Gedung Manunggal Mini',
      address: 'Jl. Urip Sumoharjo, Sinrijala, Kec. Panakkukang',
      city: 'Kota Makassar, Sulawesi Selatan',
      map_embed_url: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15894.50284242699!2d119.4184649!3d-5.1352569!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dbf02ae2b2dc587%3A0xc3f58a74b0cc106e!2sMasjid%20Raya%20Makassar!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid',
      map_direct_url: 'https://maps.app.goo.gl/eK3hFyF1T3VaXqNs9',
      sort_order: 2
    }
  ]);

  // 5. Gallery Photos
  await supabase.from('gallery_photos').insert([
    { src: '/images/cover.jpg', title: 'Prewedding 1', description: 'Momen indah', span_class: 'md:col-span-2 md:row-span-2', sort_order: 1 },
    { src: '/images/hero.jpg', title: 'Prewedding 2', description: 'Baju Adat', span_class: '', sort_order: 2 },
    { src: '/images/cover.jpg', title: 'Prewedding 3', description: 'Kebersamaan', span_class: '', sort_order: 3 }
  ]);

  // 6. Bank Accounts
  await supabase.from('bank_accounts').insert([
    { bank_name: 'BCA', account_number: '1234567890', account_holder: 'Amiruddin', sort_order: 1 },
    { bank_name: 'Mandiri', account_number: '0987654321', account_holder: 'Wardatul Jannah', sort_order: 2 }
  ]);

  // 7. Guests
  await supabase.from('guests').insert([
    { name: 'Bapak Presiden', phone: '08111111111', category: 'keluarga', slug: 'bapak-presiden', estimated_pax: 2 },
    { name: 'Keluarga Besar', phone: '08222222222', category: 'keluarga', slug: 'keluarga-besar', estimated_pax: 4 }
  ]);

  console.log("Seeding complete!");
}

seed().catch(console.error);
