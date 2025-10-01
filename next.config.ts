import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ['next/font/google'],
  },
  // Disable font optimization for Turbopack compatibility
  optimizeFonts: false,
};

export default nextConfig;
