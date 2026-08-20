import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
      },
    ],
  },
  // ✅ إضافة إعادة التوجيه من الصفحة الرئيسية إلى اللغة الإنجليزية
  async redirects() {
    return [
      {
        source: '/',
        destination: '/en',
        permanent: true, // يجعل هذا التوجيه دائماً (301)
      },
    ];
  },
};

export default nextConfig;