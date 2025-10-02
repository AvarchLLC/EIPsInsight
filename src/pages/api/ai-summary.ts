import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { eipNo, content } = req.body;

  if (!content || !eipNo) {
    return res.status(400).json({ error: "Missing eipNo or content" });
  }

  // List of supported models in order of preference
  // Updated Jan 2025: Using command-a-03-2025 as primary model
  // Fallback to older supported models if needed
  const supportedModels = [
    "command-a-03-2025",      // Most performant, 256k context, best for RAG
    "command-r-plus-08-2024", // Backup option
    "command-r-08-2024"       // Final fallback
  ];

  let lastError: any = null;

  for (const model of supportedModels) {
    try {
      const response = await fetch("https://api.cohere.ai/v1/chat", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.COHERE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          message: `Summarize EIP ${eipNo} in 40–50 words:\n\n${content}`,
          temperature: 0.3,
          chat_history: [],
          connectors: [],
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const summary = data.text || "No summary available.";
        return res.status(200).json({ summary });
      } else {
        lastError = data;
        console.warn(`Model ${model} failed:`, data.message);
        
        // If it's a model deprecation error, try next model
        if (data.message?.includes("removed") || data.message?.includes("deprecated")) {
          continue;
        }
        
        // For other errors, return immediately
        return res.status(500).json({ error: data.message || "Cohere API error." });
      }
    } catch (error) {
      lastError = error;
      console.error(`Error with model ${model}:`, error);
      continue;
    }
  }

  // If all models failed
  console.error("All models failed. Last error:", lastError);
  return res.status(500).json({ 
    error: "Failed to generate summary with any available model. Please try again later." 
  });
}

