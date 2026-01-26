import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_DUCK_DATE: process.env.DUCK_DATE,
  },
};

export default nextConfig;
