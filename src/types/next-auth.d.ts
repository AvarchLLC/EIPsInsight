// types/next-auth.d.ts
import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  /**
   * Extends the built-in session types
   */
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      password?: string;
      tier?: string;
      walletAddress?: string | null;
    } & DefaultSession["user"];
  }

  /**
   * Extends the built-in user types
   */
  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    password?: string;
    tier?: string;
    walletAddress?: string | null;
  }
}

declare module "next-auth/jwt" {
  /** 
   * Extends the built-in JWT types
   */
  interface JWT {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    password?: string;
    tier?: string;
    walletAddress?: string | null;
  }
}