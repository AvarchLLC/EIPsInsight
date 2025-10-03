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
          message: `You are an expert Ethereum developer and technical writer. Analyze EIP ${eipNo} and create a comprehensive, well-structured summary.

**Instructions:**
- Write 100-150 words in a clear, professional tone
- Structure your response with clear sections
- Use technical terms accurately but explain complex concepts
- Focus on practical implications for the Ethereum ecosystem

**Please cover:**
1. **Purpose**: What specific problem or limitation does this EIP address?
2. **Technical Approach**: What are the key mechanisms, changes, or implementations proposed?
3. **Benefits & Impact**: How will this improve Ethereum for developers, users, or the network?
4. **Significance**: Why is this EIP important for Ethereum's development?

Use proper formatting with section headers. Be informative and precise.

---
EIP ${eipNo} Content:
${content}`,
          temperature: 0.4,
          chat_history: [],
          connectors: [],
        }),
      });

      const data = await response.json();

      if (response.ok) {
        let summary = data.text || "No summary available.";
        
        // Clean up and format the summary
        summary = summary
          .trim()
          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Convert **text** to <strong>text</strong>
          .replace(/\n\n/g, '</p><p>') // Convert double newlines to paragraphs
          .replace(/^\d+\.\s+\*\*(.*?)\*\*:\s*/gm, '<strong>$1:</strong> ') // Format numbered sections
          .replace(/^(Purpose|Key Changes|Impact):\s*/gm, '<strong>$1:</strong> '); // Format section headers
        
        // Wrap in paragraph tags if not already formatted
        if (!summary.includes('<p>') && !summary.includes('<strong>')) {
          summary = `<p>${summary}</p>`;
        } else if (!summary.startsWith('<p>') && !summary.startsWith('<strong>')) {
          summary = `<p>${summary}</p>`;
        }
        
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

