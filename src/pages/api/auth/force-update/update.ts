import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  
  if (!session) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  try {
    // This forces NextAuth to refresh the session
    const newSession = await getServerSession(req, res, authOptions);
    
    return res.status(200).json(newSession);
  } catch (error) {
    console.error("Force update error:", error);
    return res.status(500).json({ error: "Failed to force update" });
  }
}