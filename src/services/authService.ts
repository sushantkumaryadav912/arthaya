/**
 * JWT Authentication Provider for Arthaya.
 * Communicates with backend /api/v1/auth/* endpoints, maintains auth state in
 * cookies and localStorage, and provides token validation.
 */

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  role?: string;
}

export interface ValidateResult {
  valid: boolean;
  authorized: boolean;
  user: AuthUser | null;
}

export interface AuthProvider {
  signIn(email: string, password: string): Promise<AuthUser>;
  signUp(email: string, password: string, name?: string): Promise<AuthUser>;
  forgotPassword(email: string): Promise<void>;
  signOut(): Promise<void>;
  getCurrentUser(): Promise<AuthUser | null>;
  validateToken(): Promise<ValidateResult>;
  getToken(): string | null;
}

const TOKEN_KEY = "arthaya:token";
const USER_KEY = "arthaya:user";

class JwtAuthProvider implements AuthProvider {
  getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(TOKEN_KEY);
  }

  async signIn(email: string, password: string): Promise<AuthUser> {
    const res = await fetch("/api/v1/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      throw new Error(data.error || "Failed to sign in.");
    }

    if (typeof window !== "undefined") {
      localStorage.setItem(TOKEN_KEY, data.token);
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    }

    return data.user as AuthUser;
  }

  async signUp(email: string, password: string, name?: string): Promise<AuthUser> {
    const res = await fetch("/api/v1/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name }),
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      throw new Error(data.error || "Failed to register account.");
    }

    if (typeof window !== "undefined") {
      localStorage.setItem(TOKEN_KEY, data.token);
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    }

    return data.user as AuthUser;
  }

  async forgotPassword(email: string): Promise<void> {
    if (!email || !email.includes("@")) {
      throw new Error("Please enter a valid email address.");
    }
    // Simulation for password recovery in demo platform
    await new Promise((resolve) => setTimeout(resolve, 600));
  }

  async signOut(): Promise<void> {
    try {
      await fetch("/api/v1/auth/logout", { method: "POST" });
    } catch {
      // Safe fallback
    }

    if (typeof window !== "undefined") {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      // Clear cookie explicitly in case server header was blocked
      document.cookie = "arthaya_token=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
  }

  async getCurrentUser(): Promise<AuthUser | null> {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as AuthUser;
    } catch {
      return null;
    }
  }

  async validateToken(): Promise<ValidateResult> {
    const token = this.getToken();

    try {
      const res = await fetch("/api/v1/auth/validate", {
        method: "GET",
        headers: {
          Accept: "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        cache: "no-store",
      });

      if (!res.ok) {
        if (typeof window !== "undefined") {
          localStorage.removeItem(TOKEN_KEY);
          localStorage.removeItem(USER_KEY);
        }
        return { valid: false, authorized: false, user: null };
      }

      const data = await res.json();

      if (data.valid && data.authorized) {
        if (typeof window !== "undefined" && data.user) {
          localStorage.setItem(USER_KEY, JSON.stringify(data.user));
        }
        return { valid: true, authorized: true, user: data.user as AuthUser };
      }

      return { valid: false, authorized: false, user: null };
    } catch {
      return { valid: false, authorized: false, user: null };
    }
  }
}

export const authService: AuthProvider = new JwtAuthProvider();
