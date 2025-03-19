import NextAuth from "next-auth";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import { connectToDatabase } from '@/lib/mongodb'; // Use named export
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export default NextAuth({
  // Use the MongoDB adapter
  adapter: MongoDBAdapter(connectToDatabase()), // Call the function to get the promise

  // Configure authentication providers
  providers: [
    // GitHub OAuth
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),

    // Google OAuth
    GoogleProvider({
      clientId: process.env.GOOGLE_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string,
    }),

    // Email/Password (Normal Login)
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "email@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null;

        // Connect to MongoDB
        const client = await connectToDatabase() // Use the clientPromise directly
        const db = client.db(); // Access the database
        const usersCollection = db.collection("users");

        // Find the user by email
        const user = await usersCollection.findOne({ email: credentials.email });

        if (user) {
          // Compare the hashed password
          const isValid = await bcrypt.compare(credentials.password, user.password);
          if (isValid) {
            return { id: user._id.toString(), email: user.email, name: user.name };
          }
        }

        // If user not found or password is invalid
        return null;
      },
    }),
  ],

  // Session configuration
  session: {
    strategy: "jwt",
  },

  // Secret for signing tokens
  secret: process.env.NEXTAUTH_SECRET,

  // Customize pages (optional)
  pages: {
    signIn: "/auth/signin", // Custom sign-in page
  },

  // Callbacks (optional)
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        // Assign `token.id` to `session.user.id` (not `session.user.name`)
        session.user.name = token.id as string; // Cast `token.id` to a string
      }
      return session;
    },
  },
});