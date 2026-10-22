/** Runtime environment / feature flags. */

export const DEMO_MODE =
  (
    process.env.NEXT_PUBLIC_DEMO_MODE ??
    process.env.DEMO_MODE ??
    "false"
  ).toLowerCase() === "true";

/**
 * Base URL for the Arthaya backend on Render.
 * Supports both private Vercel variables (BACKEND_URL, API_BASE)
 * and public variables (NEXT_PUBLIC_API_BASE, NEXT_PUBLIC_BACKEND_URL).
 */
export const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE ??
  process.env.NEXT_PUBLIC_BACKEND_URL ??
  process.env.BACKEND_URL ??
  process.env.API_BASE ??
  "https://arthaya-backend-1xdm.onrender.com";

export const API_PREFIX = "/api/v1";
