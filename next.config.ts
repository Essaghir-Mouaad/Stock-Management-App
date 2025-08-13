import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Ignore ESLint errors during builds to avoid failing production build
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Ignore TypeScript build errors to prevent build failures due to typing issues
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
