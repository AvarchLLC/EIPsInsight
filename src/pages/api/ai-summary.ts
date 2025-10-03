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
          message: `Analyze EIP ${eipNo} and create a concise, well-structured summary in 80-120 words.

**Format your response with these sections:**

**Purpose**
What problem does this EIP solve? (1-2 sentences)

**Technical Approach** 
Key changes or mechanisms introduced (2-3 key points)

**Impact**
How it benefits developers, users, or the network (1-2 sentences)

**Significance**
Why this EIP matters for Ethereum (1 sentence)

Keep it concise, technical but accessible. Use bullet points for multiple items.

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
        
        // Clean up and format the summary for better presentation
        summary = summary
          .trim()
          // Remove redundant headers and markdown-style formatting
          .replace(/^###\s*/gm, '') // Remove ### headers
          .replace(/^\*\*(.+?)\*\*$/gm, '<h4 class="font-semibold text-blue-400 mt-4 mb-2">$1</h4>') // Convert **Header** to styled headers
          .replace(/\*\*(.*?)\*\*/g, '<strong class="text-blue-300">$1</strong>') // Convert **text** to colored strong
          .replace(/^\d+\.\s+\*\*(.*?)\*\*:\s*/gm, '<div class="ml-4 mb-2"><strong class="text-green-400">$1:</strong> ') // Format numbered sections
          .replace(/^-\s+\*\*(.*?)\*\*:\s*/gm, '<div class="ml-4 mb-1"><strong class="text-purple-400">$1:</strong> ') // Format bullet points
          .replace(/\n\n/g, '</div></p><p class="mb-3">') // Convert double newlines to paragraphs with spacing
          .replace(/\n/g, ' ') // Convert single newlines to spaces
          .replace(/^(Purpose|Technical Approach|Benefits & Impact|Significance):\s*/gm, '<h4 class="font-semibold text-blue-400 mt-4 mb-2">$1</h4><p class="mb-3">'); // Format main section headers
        
        // Ensure proper structure
        if (!summary.startsWith('<h4>') && !summary.startsWith('<p>')) {
          summary = `<p class="mb-3">${summary}</p>`;
        }
        
        // Clean up any malformed tags
        summary = summary
          .replace(/<\/div><\/p>/g, '</div>')
          .replace(/<p class="mb-3"><\/p>/g, '')
          .replace(/\s+/g, ' ') // Clean up multiple spaces
          .trim();
        
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

