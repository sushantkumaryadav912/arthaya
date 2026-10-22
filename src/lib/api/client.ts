import { API_BASE, API_PREFIX } from "@/lib/utils/env";

const TOKEN_KEY = "arthaya:token";
const USER_KEY = "arthaya:user";

export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  const local = localStorage.getItem(TOKEN_KEY);
  if (local) return local;

  const match = document.cookie.match(/(?:^|;\s*)arthaya_token=([^;]+)/);
  if (match) return decodeURIComponent(match[1]);

  return null;
}

export async function ensureToken(): Promise<string | null> {
  let token = getStoredToken();
  if (token) return token;

  // Auto-acquire dev-login token if in browser runtime
  if (typeof window !== "undefined") {
    try {
      const res = await fetch(`${API_BASE}${API_PREFIX}/auth/dev-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "analyst@arthaya.ai",
          name: "Arthaya Quantitative Analyst",
          role: "analyst",
        }),
      });
      if (res.ok) {
        const data = await res.json();
        token = data.access_token || data.token;
        if (token) {
          localStorage.setItem(TOKEN_KEY, token);
          if (data.user) {
            localStorage.setItem(USER_KEY, JSON.stringify(data.user));
          }
          document.cookie = `arthaya_token=${encodeURIComponent(token)}; path=/; max-age=${7 * 86400}; SameSite=Lax`;
          return token;
        }
      }
    } catch (err) {
      console.warn("Could not automatically acquire backend token:", err);
    }
  }

  return null;
}

/**
 * Robust fetch wrapper for live backend requests.
 * Attaches JWT Bearer authentication and automatically unwraps response bodies.
 */
export async function apiGet<T>(path: string, init?: RequestInit): Promise<T> {
  let token = getStoredToken();
  if (!token) {
    token = await ensureToken();
  }

  const buildHeaders = (authToken: string | null) => ({
    Accept: "application/json",
    ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
    ...(init?.headers as Record<string, string> | undefined),
  });

  let res = await fetch(`${API_BASE}${API_PREFIX}${path}`, {
    ...init,
    headers: buildHeaders(token),
    cache: "no-store",
  });

  // If 401 Unauthorized, attempt token renewal once
  if (res.status === 401 && typeof window !== "undefined") {
    localStorage.removeItem(TOKEN_KEY);
    const refreshed = await ensureToken();
    if (refreshed) {
      res = await fetch(`${API_BASE}${API_PREFIX}${path}`, {
        ...init,
        headers: buildHeaders(refreshed),
        cache: "no-store",
      });
    }
  }

  if (!res.ok) {
    throw new ApiError(`Request failed: ${path}`, res.status);
  }

  const body = (await res.json()) as { data?: T } | T;
  if (typeof body === "object" && body !== null && "data" in body && (body as { data?: T }).data !== undefined) {
    return (body as { data: T }).data;
  }
  return body as T;
}

export async function apiSend<T>(
  path: string,
  method: "POST" | "DELETE" | "PUT",
  payload?: unknown,
  init?: RequestInit,
): Promise<T> {
  let token = getStoredToken();
  if (!token) {
    token = await ensureToken();
  }

  const buildHeaders = (authToken: string | null) => ({
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
    ...(init?.headers as Record<string, string> | undefined),
  });

  let res = await fetch(`${API_BASE}${API_PREFIX}${path}`, {
    ...init,
    method,
    headers: buildHeaders(token),
    body: payload ? JSON.stringify(payload) : undefined,
  });

  if (res.status === 401 && typeof window !== "undefined") {
    localStorage.removeItem(TOKEN_KEY);
    const refreshed = await ensureToken();
    if (refreshed) {
      res = await fetch(`${API_BASE}${API_PREFIX}${path}`, {
        ...init,
        method,
        headers: buildHeaders(refreshed),
        body: payload ? JSON.stringify(payload) : undefined,
      });
    }
  }

  if (!res.ok) throw new ApiError(`Request failed: ${path}`, res.status);

  const body = (await res.json()) as { data?: T } | T;
  if (typeof body === "object" && body !== null && "data" in body && (body as { data?: T }).data !== undefined) {
    return (body as { data: T }).data;
  }
  return body as T;
}

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}
