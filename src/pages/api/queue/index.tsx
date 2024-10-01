import type { NextApiRequest, NextApiResponse } from 'next';
import { exec } from 'child_process';
import path from 'path';

// Define the handler function
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('API route hit');  // Log when the API route is hit

  const rustCommand = 'cargo run';  // Command to run the Rust app
  const rustProjectPath = path.resolve('C:/Users/Viwin/OneDrive/Desktop/EIP-Board');
  const GITHUB_REPOSITORY="ethereum/ERCs"

  // Set environment variables, including GITHUB_TOKEN from Next.js env
  const envVars = { GITHUB_TOKEN: process.env.ACCESS_TOKEN,GITHUB_REPOSITORY:GITHUB_REPOSITORY, ...process.env };

  // Execute the Rust command with the necessary environment variables
  exec(rustCommand, { cwd: rustProjectPath, env: envVars }, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing Rust command: ${error.message}`);
      res.status(500).json({ error: 'Error executing Rust command' });
      return;
    }

    // Extract URLs from stdout (if applicable)
    const urlPattern = /<a href="([^"]+)">/g;
    const urls: string[] = [];
    let match: RegExpExecArray | null;

    while ((match = urlPattern.exec(stdout)) !== null) {
      urls.push(match[1]);
    }

    // Respond with extracted URLs or an empty array if none were found
    res.status(200).json({ urls });
  });
}
