import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        hostname: "xotk1fk5qe.ufs.sh",
      },
      {
        hostname: "sfk1jl710t.ufs.sh",
      },
      {
        hostname: "avatars.githubusercontent.com",
      },
    ],
  },
};

export default nextConfig;
