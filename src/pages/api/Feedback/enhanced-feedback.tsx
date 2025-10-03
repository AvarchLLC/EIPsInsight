import type { NextApiRequest, NextApiResponse } from "next";
import { MongoClient } from "mongodb";

const DISCORD_WEBHOOK_URL = "https://discord.com/api/webhooks/1423745692366672044/65Y9iEFzVKFBN0cXbZWmEYOAV5kqAiX0wuYLlh4KjyXAtS5JlCN6uSV954NfDK-DUjEV";

interface FeedbackData {
  rating: 'positive' | 'neutral' | 'negative';
  comment?: string;
  page: string;
  timestamp: string;
}

async function sendDiscordNotification(feedbackData: any) {
  try {
    // Map ratings to emojis and colors
    const ratingMap: Record<string, { emoji: string; color: number; text: string }> = {
      'positive': { emoji: '👍', color: 0x00ff00, text: 'Positive' },
      'neutral': { emoji: '😐', color: 0xffaa00, text: 'Neutral' },
      'negative': { emoji: '👎', color: 0xff0000, text: 'Negative' }
    };

    const rating = ratingMap[feedbackData.rating] || ratingMap['neutral'];

    const embed = {
      title: `${rating.emoji} New Enhanced Feedback Received`,
      description: feedbackData.comment ? 
        `**Rating:** ${rating.text}\n**Comment:** "${feedbackData.comment}"` :
        `**Rating:** ${rating.text}`,
      color: rating.color,
      fields: [
        {
          name: "📊 Rating",
          value: `${rating.emoji} ${rating.text}`,
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
        }
      ],
      footer: {
        text: "EIPs Insight Enhanced Feedback System",
        icon_url: "https://ethereum.org/static/6b935ac0e6194247347855dc3d328e83/6ed5f/ethereum-icon-purple.png"
      },
      timestamp: new Date().toISOString()
    };

    // Add comment field if present
    if (feedbackData.comment) {
      embed.fields.push({
        name: "💬 Comment",
        value: feedbackData.comment.length > 100 ? 
          feedbackData.comment.substring(0, 100) + "..." : 
          feedbackData.comment,
        inline: false
      });
    }

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

  const { rating, comment, page, timestamp }: FeedbackData = req.body;

  // Validate required fields
  if (!rating || !['positive', 'neutral', 'negative'].includes(rating)) {
    return res.status(400).json({ message: "Invalid rating" });
  }

  if (!page || !timestamp) {
    return res.status(400).json({ message: "Missing required fields" });
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
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'Unknown';

    const feedbackRecord = {
      rating,
      comment: comment || null,
      page,
      timestamp: new Date(timestamp),
      createdAt: new Date(),
      userAgent,
      ip: Array.isArray(ip) ? ip[0] : ip,
    };

    // Store enhanced feedback data
    await db.collection("enhanced_feedbacks").insertOne(feedbackRecord);

    // Send Discord notification
    await sendDiscordNotification(feedbackRecord);

    res.status(201).json({ message: "Feedback recorded successfully" });
  } catch (e) {
    console.error("MongoDB error:", e);
    res.status(500).json({ message: "Server error" });
  } finally {
    await client.close();
  }
}
