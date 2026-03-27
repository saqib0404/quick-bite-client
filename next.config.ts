import "./src/env";

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "www.yummytummyaarthi.com" },
      { protocol: "https", hostname: "cdn.apartmenttherapy.info" },
      { protocol: "https", hostname: "i0.wp.com" },
      { protocol: "https", hostname: "imgbb.com" },
      { protocol: "https", hostname: "i.ibb.co.com" },
    ],
    minimumCacheTTL: 60,
    formats: ["image/avif", "image/webp"],
  },
  async rewrites() {
    return [
      {
        source: "/api/auth/:path*",
        destination: `${process.env.BACKEND_URL}/api/auth/:path*`,
      },
    ];
  },
}

export default nextConfig;
