/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Peringatan: Ini akan membuat build berhasil meskipun ada error ESLint.
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig
