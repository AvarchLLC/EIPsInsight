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
      role?: string;
      walletAddress?: string | null;
      isVerified?: boolean;
      isActive?: boolean;
      profile?: {
        bio?: string;
        website?: string;
        twitter?: string;
        github?: string;
        linkedin?: string;
        location?: string;
        company?: string;
        isPublic: boolean;
        joinedAt: Date;
        lastActive: Date;
      };
      stats?: {
        blogsCreated: number;
        feedbackGiven: number;
        lastLogin: Date;
      };
      settings?: {
        emailNotifications: boolean;
        theme: 'light' | 'dark' | 'system';
        language: string;
      };
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
    role?: string;
    walletAddress?: string | null;
    isVerified?: boolean;
    isActive?: boolean;
    profile?: {
      bio?: string;
      website?: string;
      twitter?: string;
      github?: string;
      linkedin?: string;
      location?: string;
      company?: string;
      isPublic: boolean;
      joinedAt: Date;
      lastActive: Date;
    };
    stats?: {
      blogsCreated: number;
      feedbackGiven: number;
      lastLogin: Date;
    };
    settings?: {
      emailNotifications: boolean;
      theme: 'light' | 'dark' | 'system';
      language: string;
    };
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
    role?: string;
    walletAddress?: string | null;
    isVerified?: boolean;
    isActive?: boolean;
    profile?: {
      bio?: string;
      website?: string;
      twitter?: string;
      github?: string;
      linkedin?: string;
      location?: string;
      company?: string;
      isPublic: boolean;
      joinedAt: Date;
      lastActive: Date;
    };
    stats?: {
      blogsCreated: number;
      feedbackGiven: number;
      lastLogin: Date;
    };
    settings?: {
      emailNotifications: boolean;
      theme: 'light' | 'dark' | 'system';
      language: string;
    };
  }
}