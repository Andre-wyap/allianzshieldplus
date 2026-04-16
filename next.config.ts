import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Required for @cloudflare/next-on-pages:
  // All server-side rendering happens at the edge, so we must not use
  // any Node.js-only APIs outside of lib/hmac.ts (Web Crypto) and the
  // route handlers that already declare `export const runtime = "edge"`.
};

export default nextConfig;
