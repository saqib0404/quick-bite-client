import "./src/env";

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "www.yummytummyaarthi.com" },
      { protocol: "https", hostname: "cdn.apartmenttherapy.info" },
      { protocol: "https", hostname: "i0.wp.com" },
      { protocol: "https", hostname: "imgbb.com" },
    ]
  },
}

export default nextConfig;
