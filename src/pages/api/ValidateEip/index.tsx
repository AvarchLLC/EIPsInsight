import { NextApiRequest, NextApiResponse } from "next";
import * as eipw from "eipw-lint-js";
import fs from "fs";
import path from "path";

interface ValidationRequest {
  markdownContent: string;
}

interface ValidationResponse {
  success: boolean;
  messages?: Array<{ level: string; message: string }>;
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ValidationResponse>
) {
  if (req.method === "POST") {
    const { markdownContent }: ValidationRequest = req.body;

    if (!markdownContent) {
      return res.status(400).json({ success: false, error: "Markdown content is required" });
    }

    try {
      // Create a temporary file to store the markdown content
      const tempDir = path.join(process.cwd(), "temp");
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir);
      }

      const tempFilePath = path.join(tempDir, "temp_eip.md");
      fs.writeFileSync(tempFilePath, markdownContent);

      // Define linting options
      const options = {
        deny: [],
        warn: [],
        allow: [],
      };

      // Run the linting tool on the temporary file
      const result = await eipw.lint([tempFilePath], options);

      // Delete the temporary file after linting
      fs.unlinkSync(tempFilePath);

      // Check for errors or warnings
      let hasErrors = false;
      const messages: Array<{ level: string; message: string }> = [];
      for (let snippet of result) {
        const formatted = eipw.format(snippet);
        messages.push({ level: snippet.level, message: formatted });

        if (snippet.level === "Error") {
          hasErrors = true;
        }
      }

      if (hasErrors) {
        return res.status(400).json({ success: false, messages });
      } else {
        return res.status(200).json({ success: true, messages });
      }
    } catch (error) {
      console.error("Error during validation:", error);
      return res.status(500).json({ success: false, error: "Validation failed" });
    }
  } else {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }
}