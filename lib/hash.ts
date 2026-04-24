// Senang Pay hash utilities — Edge runtime compatible (Web Crypto API)
//
// Senang Pay supports two hash types (set in dashboard → Settings → Profile):
//   SHA256 (default/recommended): HMAC-SHA256(key=secretKey, message=secretKey+...params)
//   MD5 (legacy): md5(secretKey+...params)
//
// This module implements SHA256. If your dashboard is set to MD5, use lib/md5.ts instead.

export async function hmacSha256Hex(key: string, message: string): Promise<string> {
  const enc = new TextEncoder();
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    enc.encode(key),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", cryptoKey, enc.encode(message));
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
