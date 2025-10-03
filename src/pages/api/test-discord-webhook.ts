import type { NextApiRequest, NextApiResponse } from "next";

const DISCORD_WEBHOOK_URL = "https://discord.com/api/webhooks/1423745692366672044/65Y9iEFzVKFBN0cXbZWmEYOAV5kqAiX0wuYLlh4KjyXAtS5JlCN6uSV954NfDK-DUjEV";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const embed = {
      title: "🧪 Test Notification",
      description: "Testing the Discord webhook integration for EIPs Insight feedback system",
      color: 0x00ff00,
      fields: [
        {
          name: "📊 Status",
          value: "✅ Webhook Working",
          inline: true
        },
        {
          name: "🕒 Time",
          value: new Date().toLocaleString(),
          inline: true
        }
      ],
      footer: {
        text: "EIPs Insight Feedback System Test",
        icon_url: "https://ethereum.org/static/6b935ac0e6194247347855dc3d328e83/6ed5f/ethereum-icon-purple.png"
      },
      timestamp: new Date().toISOString()
    };

    const response = await fetch(DISCORD_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: "🔔 **EIPs Insight Feedback System Test**",
        embeds: [embed]
      }),
    });

    if (!response.ok) {
      throw new Error(`Discord webhook failed: ${response.status} ${response.statusText}`);
    }

    res.status(200).json({ 
      message: "Test webhook sent successfully!",
      webhookResponse: response.status 
    });

  } catch (error) {
    console.error("Discord webhook test failed:", error);
    res.status(500).json({ 
      message: "Webhook test failed", 
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
}