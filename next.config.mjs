/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'plus.unsplash.com',
      },
    ],
    // Serve WebP/AVIF for modern browsers — smaller files, same quality
    formats: ['image/avif', 'image/webp'],
    // Cache optimized images for 7 days (default is 60s — way too short)
    minimumCacheTTL: 604800,
    // Match actual breakpoints used in the UI
    deviceSizes: [640, 768, 1024, 1280, 1600],
    imageSizes: [80, 200, 400, 600, 800],
  },
};

export default nextConfig;
