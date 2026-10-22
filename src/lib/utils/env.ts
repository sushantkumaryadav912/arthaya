/**
 * Runtime environment, API endpoints, and dynamic Demo vs Real Session configuration.
 *
 * POLICY:
 * - Only login via demo credentials ("analyst@arthaya.ai" / Demo Access) triggers demo data.
 * - All other accounts (registered institutional users, custom emails, Google OAuth, GitHub OAuth)
 *   trigger real data from the live backend (https://arthaya-backend-1xdm.onrender.com).
 */

export const DEMO_EMAIL = "analyst@arthaya.ai";

/**
 * Base URL for the Arthaya backend on Render.
 */
export const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE ??
  process.env.NEXT_PUBLIC_BACKEND_URL ??
  process.env.BACKEND_URL ??
  process.env.API_BASE ??
  "https://arthaya-backend-1xdm.onrender.com";

export const API_PREFIX = "/api/v1";

/**
 * Synchronous client-side check to determine if the active session is a demo account.
 * Checks localStorage, user profile, and cookies.
 */
export function isDemoSession(): boolean {
  if (typeof window !== "undefined") {
    try {
      // 1. Direct explicit flag in localStorage
      const isDemoFlag = localStorage.getItem("arthaya:is_demo");
      if (isDemoFlag === "true") return true;
      if (isDemoFlag === "false") return false;

      // 2. User profile object check
      const userRaw = localStorage.getItem("arthaya:user");
      if (userRaw) {
        const u = JSON.parse(userRaw);
        if (u.isDemo === true || u.email?.trim().toLowerCase() === DEMO_EMAIL) {
          return true;
        }
        if (u.isDemo === false || (u.email && u.email.trim().toLowerCase() !== DEMO_EMAIL)) {
          return false;
        }
      }

      // 3. Document cookie check
      const match = document.cookie.match(/(?:^|;\s*)arthaya_demo=([^;]+)/);
      if (match) {
        return match[1] === "true";
      }
    } catch {
      // safe fallback to real mode
    }
    return false;
  }

  return false;
}

/**
 * Universal async check for Server Components, Route Handlers, and client environments.
 * Reads Next.js request cookies on the server and localStorage in the browser.
 */
export async function isDemoSessionAsync(): Promise<boolean> {
  if (typeof window !== "undefined") {
    return isDemoSession();
  }

  // Server-side (React Server Component or API Route)
  try {
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    const demoCookie = cookieStore.get("arthaya_demo");
    if (demoCookie?.value === "true") return true;
    if (demoCookie?.value === "false") return false;

    // If only arthaya_token is present, inspect payload email
    const tokenCookie = cookieStore.get("arthaya_token");
    if (tokenCookie?.value) {
      try {
        const parts = tokenCookie.value.split(".");
        if (parts.length === 3) {
          const decoded = Buffer.from(parts[1], "base64url").toString("utf-8");
          const payload = JSON.parse(decoded);
          if (payload.email && payload.email.trim().toLowerCase() === DEMO_EMAIL) {
            return true;
          }
          return false;
        }
      } catch {
        // fallback
      }
    }
  } catch {
    // Outside request scope or during static generation
  }

  return false;
}

/**
 * Legacy constant alias for components that import DEMO_MODE directly.
 * Defaults to false so real data is preferred unless demo session is explicitly active.
 */
export const DEMO_MODE =
  (
    process.env.NEXT_PUBLIC_DEMO_MODE ??
    process.env.DEMO_MODE ??
    "false"
  ).toLowerCase() === "true";
