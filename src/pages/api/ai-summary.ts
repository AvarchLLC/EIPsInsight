import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { eipNo, content } = req.body;

  if (!content || !eipNo) {
    return res.status(400).json({ error: "Missing eipNo or content" });
  }

  try {
    const response = await fetch("https://api.cohere.ai/v1/chat", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.COHERE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "command-r-plus",
        message: `Summarize EIP ${eipNo} in 40–50 words:\n\n${content}`,
        temperature: 0.3,
        chat_history: [],
        connectors: [],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Cohere API error:", data);
      return res.status(500).json({ error: data.message || "Cohere API error." });
    }

    const summary = data.text || "No summary available.";
    res.status(200).json({ summary });
  } catch (error) {
    console.error("Fetch error:", error);
    res.status(500).json({ error: "Failed to generate summary." });
  }
}

