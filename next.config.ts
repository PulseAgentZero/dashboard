import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Standalone output produces a minimal server.js + no node_modules dependency.
  // Required for the self-hosted Docker image.
  output: process.env.NEXT_BUILD_STANDALONE === "1" ? "standalone" : undefined,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: '**',
      },
      {
        protocol: "https",
        hostname: "plus.unsplash.com",
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
      }
    ],
  },
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;