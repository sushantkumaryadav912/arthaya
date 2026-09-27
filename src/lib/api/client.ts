import { API_BASE, API_PREFIX } from "@/lib/utils/env";

/**
 * Thin fetch wrapper for the Next.js route-handler backend.
 * Used only when DEMO_MODE is false; in demo mode the api modules read
 * directly from the mock repositories.
 */
export async function apiGet<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${API_PREFIX}${path}`, {
    ...init,
    headers: { Accept: "application/json", ...(init?.headers ?? {}) },
    cache: "no-store",
  });
  if (!res.ok) {
    throw new ApiError(`Request failed: ${path}`, res.status);
  }
  const body = (await res.json()) as { data: T } | T;
  return (body as { data: T }).data ?? (body as T);
}

export async function apiSend<T>(
  path: string,
  method: "POST" | "DELETE" | "PUT",
  payload?: unknown,
): Promise<T> {
  const res = await fetch(`${API_BASE}${API_PREFIX}${path}`, {
    method,
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: payload ? JSON.stringify(payload) : undefined,
  });
  if (!res.ok) throw new ApiError(`Request failed: ${path}`, res.status);
  const body = (await res.json()) as { data: T } | T;
  return (body as { data: T }).data ?? (body as T);
}

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}
