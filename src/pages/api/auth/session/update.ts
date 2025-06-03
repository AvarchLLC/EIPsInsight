import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "PUT") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const session = await getServerSession(req, res, authOptions);
  
  if (!session) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  try {
    // This will trigger the JWT callback with trigger: "update"
    const updatedSession = await getServerSession(req, res, {
      ...authOptions,
      callbacks: {
        ...authOptions.callbacks,
        async session(params) {
          const newSession = await authOptions.callbacks?.session?.(params) || params.session;
          return {
            ...newSession,
            user: {
              ...newSession.user,
              ...req.body, // Apply updates from request body
            }
          };
        },
      },
    });

    return res.status(200).json(updatedSession);
  } catch (error) {
    console.error("Session update error:", error);
    return res.status(500).json({ error: "Failed to update session" });
  }
}