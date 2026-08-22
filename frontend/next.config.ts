import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // @ts-ignore
  allowedDevOrigins: ['192.168.80.30'],
  async rewrites() {
    return [];
  },
};

export default nextConfig;
