/** Runtime environment / feature flags. */

export const DEMO_MODE =
  (process.env.NEXT_PUBLIC_DEMO_MODE ?? "true").toLowerCase() !== "false";

/** Base URL for the Next.js route-handler backend. Empty = same origin. */
export const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "";

export const API_PREFIX = "/api/v1";
