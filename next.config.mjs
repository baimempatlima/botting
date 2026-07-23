/** @type {import('next').NextConfig} */
const nextConfig = {
  // Masukkan konfigurasi yang Anda butuhkan di sini (misalnya konfigurasi gambar Supabase sebelumnya)
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'obwlmuyvcrzbhjbwrxca', // Ganti dengan ID project Supabase Anda (jika pakai)
      },
    ],
  },
};

// Gunakan 'export default' untuk file berakhiran .mjs
export default nextConfig;
