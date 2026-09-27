/**
 * Authentication abstraction — Cognito-ready. NO fake auth logic here.
 * The concrete provider (e.g. Amazon Cognito) is wired later; these methods
 * currently throw "not configured" so the UI never pretends a user is signed in.
 */

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
}

export interface AuthProvider {
  signIn(email: string, password: string): Promise<AuthUser>;
  signUp(email: string, password: string, name?: string): Promise<void>;
  forgotPassword(email: string): Promise<void>;
  signOut(): Promise<void>;
  getCurrentUser(): Promise<AuthUser | null>;
}

class UnconfiguredAuthProvider implements AuthProvider {
  private notConfigured(): never {
    throw new Error(
      "Authentication is not configured. Connect Amazon Cognito (or another provider) to enable sign-in.",
    );
  }
  async signIn(): Promise<AuthUser> {
    this.notConfigured();
  }
  async signUp(): Promise<void> {
    this.notConfigured();
  }
  async forgotPassword(): Promise<void> {
    this.notConfigured();
  }
  async signOut(): Promise<void> {
    /* no-op until configured */
  }
  async getCurrentUser(): Promise<AuthUser | null> {
    return null;
  }
}

export const authService: AuthProvider = new UnconfiguredAuthProvider();
