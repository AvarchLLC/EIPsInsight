import type { NextApiRequest, NextApiResponse } from "next";
import { MongoClient } from "mongodb";

const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEB";

async function sendDiscordNotification(feedbackData: any) {
  try {
    const embed = {
      title: "🔔 New Feedback Received",
      description: `User feedback: **${feedbackData.type === 'like' ? '👍 Like' : '👎 Dislike'}**`,
      color: feedbackData.type === 'like' ? 0x00ff00 : 0xff0000, // Green for like, red for dislike
      fields: [
        {
          name: "📊 Type",
          value: feedbackData.type === 'like' ? "👍 Positive" : "👎 Negative",
          inline: true
        },
        {
          name: "🌐 Page",
          value: feedbackData.page || "Unknown",
          inline: true
        },
        {
          name: "🕒 Time",
          value: new Date().toLocaleString(),
          inline: true
        },
        {
          name: "🌍 User Agent",
          value: feedbackData.userAgent ? feedbackData.userAgent.substring(0, 100) + "..." : "Unknown",
          inline: false
        }
      ],
      footer: {
        text: "EIPs Insight Feedback System",
        icon_url: "https://ethereum.org/static/6b935ac0e6194247347855dc3d328e83/6ed5f/ethereum-icon-purple.png"
      },
      timestamp: new Date().toISOString()
    };

    await fetch(DISCORD_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        embeds: [embed]
      }),
    });
  } catch (error) {
    console.error("Discord webhook failed:", error);
    // Don't fail the main request if Discord fails
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ message: string }>
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { type, page, comment } = req.body;

  if (!["like", "dislike"].includes(type)) {
    return res.status(400).json({ message: "Invalid type" });
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    return res.status(500).json({ message: "MongoDB URI not configured" });
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db("test");

    // Get additional metadata
    const userAgent = req.headers['user-agent'] || 'Unknown';
    const referer = req.headers.referer || page || 'Unknown';
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'Unknown';

    const feedbackData = {
      type,
      page: referer,
      comment: comment || null,
      userAgent,
      ip: Array.isArray(ip) ? ip[0] : ip,
      createdAt: new Date(),
    };

    // Insert into MongoDB
    await db.collection("feedbacks").insertOne(feedbackData);

    // Send Discord notification
    await sendDiscordNotification(feedbackData);

    res.status(201).json({ message: "Feedback recorded" });
  } catch (e) {
    console.error("MongoDB error:", e);
    res.status(500).json({ message: "Server error" });
  } finally {
    await client.close();
  }
}
