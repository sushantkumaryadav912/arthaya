/** Runtime environment / feature flags. */

export const DEMO_MODE =
  (process.env.NEXT_PUBLIC_DEMO_MODE ?? "false").toLowerCase() === "true";

/** Base URL for the Arthaya backend on Render. */
export const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE ?? "https://arthaya-backend-1xdm.onrender.com";

export const API_PREFIX = "/api/v1";

