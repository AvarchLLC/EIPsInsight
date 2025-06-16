// pages/api/user/me.ts
import { connectToDatabase } from "@/lib/mongodb";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const email = req.query.email as string;

    if (!email) return res.status(400).json({ error: "Missing email" });

    const client = await connectToDatabase();
    const db = client.db("eipsinsight");

    const user = await db.collection("users").findOne({ email });

    if (!user) return res.status(404).json({ error: "User not found" });

    return res.status(200).json({
      email: user.email,
      name: user.name,
      tier: user.tier,
    });
  } catch (err) {
    console.error("❌ Failed to get user:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
