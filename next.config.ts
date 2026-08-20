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
  // ✅ إضافة رؤوس التخزين المؤقت (لتحسين الأداء وتقليل أوقات التحميل)
  async headers() {
    return [
      {
        source: '/:path*', // ينطبق على جميع الصفحات
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, stale-while-revalidate=86400',
          },
        ],
      },
    ];
  },
};

export default nextConfig;