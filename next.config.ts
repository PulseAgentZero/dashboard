import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Standalone output produces a minimal server.js + no node_modules dependency.
  // Required for the bundled chideraozigbo488/entivia Docker image build.
  output: process.env.NEXT_BUILD_STANDALONE === "1" ? "standalone" : undefined,
  transpilePackages: ["recharts"],
  async redirects() {
    return [
      {
        source: "/docs/hosting/frontend",
        destination: "/docs/hosting/self-hosted",
        permanent: true,
      },
    ];
  },
  // docs.entivia.online short paths → /docs/* : see src/proxy.ts (host rewrite).
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