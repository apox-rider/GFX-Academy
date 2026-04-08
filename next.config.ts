import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Supabase Edge Functions use Deno which isn't compiled by Next.js
  // These functions are deployed separately to Supabase
};

export default nextConfig;
