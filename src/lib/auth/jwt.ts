/**
 * Standard Web-Crypto based JSON Web Token (HS256) implementation.
 * Compatible with Edge Runtime (Next.js middleware), Node.js API handlers, and browser runtimes.
 */

export interface JwtPayload {
  sub: string;
  email: string;
  name?: string;
  role: string;
  iat?: number;
  exp?: number;
}

const DEFAULT_SECRET = "arthaya-autonomous-agentic-jwt-secret-key-2026-financial-intel";
export const AUTH_COOKIE_NAME = "arthaya_token";

function getSecretKey(): string {
  return process.env.JWT_SECRET || process.env.NEXT_PUBLIC_JWT_SECRET || DEFAULT_SECRET;
}

function base64UrlEncode(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function base64UrlDecode(str: string): Uint8Array {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) {
    base64 += "=";
  }
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

/**
 * Sign a payload into an HS256 JWT token.
 */
export async function signJwt(
  payload: Omit<JwtPayload, "iat" | "exp">,
  expiresInSeconds = 7 * 24 * 3600,
): Promise<string> {
  const enc = new TextEncoder();
  const secret = getSecretKey();
  const now = Math.floor(Date.now() / 1000);

  const fullPayload: JwtPayload = {
    ...payload,
    iat: now,
    exp: now + expiresInSeconds,
  };

  const header = { alg: "HS256", typ: "JWT" };
  const hEnc = base64UrlEncode(enc.encode(JSON.stringify(header)));
  const pEnc = base64UrlEncode(enc.encode(JSON.stringify(fullPayload)));
  const msg = `${hEnc}.${pEnc}`;

  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );

  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(msg));
  const sigEnc = base64UrlEncode(new Uint8Array(sig));

  return `${msg}.${sigEnc}`;
}

/**
 * Verify a JWT token and return the payload if valid and not expired.
 */
export async function verifyJwt(token: string): Promise<JwtPayload | null> {
  if (!token || typeof token !== "string") return null;
  const parts = token.trim().split(".");
  if (parts.length !== 3) return null;

  const [h, p, s] = parts;
  const msg = `${h}.${p}`;
  const enc = new TextEncoder();
  const secret = getSecretKey();

  try {
    const key = await crypto.subtle.importKey(
      "raw",
      enc.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"],
    );

    const isValid = await crypto.subtle.verify(
      "HMAC",
      key,
      base64UrlDecode(s) as unknown as BufferSource,
      enc.encode(msg),
    );

    if (!isValid) return null;

    const payloadRaw = new TextDecoder().decode(base64UrlDecode(p));
    const payload = JSON.parse(payloadRaw) as JwtPayload;

    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      return null; // Expired token
    }

    return payload;
  } catch {
    return null;
  }
}

/**
 * Helper to extract token from Authorization header or cookie.
 */
export function extractToken(authHeader?: string | null, cookieValue?: string | null): string | null {
  if (authHeader && authHeader.toLowerCase().startsWith("bearer ")) {
    const t = authHeader.slice(7).trim();
    if (t) return t;
  }
  if (cookieValue && cookieValue.trim()) {
    return cookieValue.trim();
  }
  return null;
}
