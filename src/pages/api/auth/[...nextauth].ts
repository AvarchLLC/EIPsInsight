import NextAuth, { type NextAuthOptions, type User } from "next-auth";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import { connectToDatabase } from '@/lib/mongodb';
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { SiweMessage } from "siwe";
import bcrypt from "bcryptjs";
import type { Adapter } from "next-auth/adapters";
import type { JWT } from "next-auth/jwt";
import type { Session } from "next-auth";

// Type definitions
interface CustomUser extends User {
  password?: string;
  tier?: string;
  image?: string | null;
  walletAddress?: string | null;
}

interface NonceDocument {
  walletAddress: string;
  nonce: string;
  expiresAt: Date;
}

// Constants
const NONCE_EXPIRATION_MINUTES = 5;
const DEFAULT_USER_TIER = "Free";

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(connectToDatabase()) as Adapter,

  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "email@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<CustomUser | null> {
        if (!credentials) return null;

        const client = await connectToDatabase();
        const db = client.db();
        const usersCollection = db.collection("users");

        const user = await usersCollection.findOne({ email: credentials.email });

        if (user) {
          const isValid = await bcrypt.compare(credentials.password, user.password);
          if (isValid) {
            return { 
              id: user._id.toString(), 
              email: user.email, 
              name: user.name,
              image: user.image || null,
              tier: user.tier || DEFAULT_USER_TIER
            };
          }
        }
        return null;
      },
    }),

    // Sign-In with Ethereum Provider
    CredentialsProvider({
      name: "Ethereum",
      credentials: {
        message: {
          label: "Message",
          type: "text",
          placeholder: "0x0",
        },
        signature: {
          label: "Signature",
          type: "text",
          placeholder: "0x0",
        },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.message) {
            throw new Error("SIWE message is required");
          }
          if (!credentials?.signature) {
            throw new Error("SIWE signature is required");
          }

          const siweMessage = new SiweMessage(credentials.message);
          const fields = await siweMessage.validate(credentials.signature);

          // Validate message expiration
          if (fields.expirationTime && new Date(fields.expirationTime) < new Date()) {
            throw new Error("Message expired");
          }

          // Validate domain
          const appDomain = process.env.NEXTAUTH_URL?.replace(/https?:\/\//, '').split(':')[0];
          if (fields.domain !== appDomain) {
            throw new Error(`Invalid domain: ${fields.domain}`);
          }

          // Validate nonce
          const isValidNonce = await validateNonce(fields.address, fields.nonce);
          if (!isValidNonce) {
            throw new Error("Invalid nonce");
          }

          const client = await connectToDatabase();
          const db = client.db();
          const usersCollection = db.collection("users");

          // Normalize wallet address to lowercase
          const walletAddress = fields.address.toLowerCase();

          // Check if user exists with this wallet address
          let user = await usersCollection.findOne({ walletAddress });

          if (!user) {
            // Create new user if doesn't exist
            const result = await usersCollection.insertOne({
              walletAddress,
              name: walletAddress,
              email: null,
              image: null,
              password: null,
              tier: DEFAULT_USER_TIER,
              createdAt: new Date(),
              updatedAt: new Date(),
            });

            user = {
              _id: result.insertedId,
              walletAddress,
              name: walletAddress,
              email: null,
              image: null,
              password: null,
              tier: DEFAULT_USER_TIER,
            };
          }

          return {
            id: user._id.toString(),
            name: user.name || walletAddress,
            email: user.email,
            image: user.image,
            walletAddress,
            tier: user.tier || DEFAULT_USER_TIER,
          };
        } catch (e) {
          console.error("Ethereum signin error:", e);
          return null;
        }
      },
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  secret: process.env.NEXTAUTH_SECRET,

  pages: {
    signIn: "/signin",
    signOut: "/",
    error: "/auth/error",
    verifyRequest: "/auth/verify-request",
    newUser: "/",
  },

  // Add this to your existing authOptions
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // Initial sign in
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.image = user.image;
        token.tier = user.tier || DEFAULT_USER_TIER;
        token.walletAddress = user.walletAddress;
      }
      
      // Manual session update trigger
      if (trigger === "update") {
        return { ...token, ...session };
      }
      
      return token;
    },
    
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.image = token.image as string | null | undefined;
        session.user.tier = token.tier as string || DEFAULT_USER_TIER;
        session.user.walletAddress = token.walletAddress as string | undefined;
      }
      return session;
    },
  },

  events: {
    async createUser({ user }: { user: CustomUser }) {
      const client = await connectToDatabase();
      const db = client.db();
      await db.collection("users").updateOne(
        { email: user.email },
        { 
          $set: { 
            tier: DEFAULT_USER_TIER,
            updatedAt: new Date()
          } 
        }
      );
    },
  }
};

// Nonce management functions
async function generateNonce(walletAddress: string): Promise<string> {
  const client = await connectToDatabase();
  const db = client.db();
  const nonceCollection = db.collection<NonceDocument>("nonces");

  // Generate new nonce
  const nonce = Math.floor(Math.random() * 1000000).toString();
  const expiresAt = new Date(Date.now() + NONCE_EXPIRATION_MINUTES * 60 * 1000);

  await nonceCollection.updateOne(
    { walletAddress },
    { $set: { nonce, expiresAt } },
    { upsert: true }
  );

  return nonce;
}

async function validateNonce(walletAddress: string, nonce: string): Promise<boolean> {
  const client = await connectToDatabase();
  const db = client.db();
  const nonceCollection = db.collection<NonceDocument>("nonces");

  // Find and delete the nonce
  const result = await nonceCollection.findOneAndDelete({
    walletAddress,
    nonce,
    expiresAt: { $gt: new Date() } // Only valid if not expired
  });

  return !!result.value;
}

// Export nonce generation for API routes
export async function getSiweNonce(walletAddress: string): Promise<string> {
  return generateNonce(walletAddress.toLowerCase());
}

export default NextAuth(authOptions);