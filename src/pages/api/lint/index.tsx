// pages/api/lint.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { lint } from 'eipw-lint-js';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { template } = req.body;  // Expecting a POST request with the markdown template
    
    try {
      // Split template into lines for linting
      const templateLines = template.split("\n");
      
      // Lint the template and await results
      const lintResults = await lint(templateLines);

      // Log the linting result for debugging
      console.log('Lint Results:', lintResults);

      if (lintResults.errors && lintResults.errors.length > 0) {
        return res.status(400).json({ errors: lintResults.errors });
      }

      // Return a success response if no lint errors
      return res.status(200).json({ message: "No lint errors." });
    } catch (error) {
      // Log the error for debugging
      console.error('Linting Error:', error);
      return res.status(500).json({ error: 'Error linting template' });
    }
  }

  // If not a POST request
  return res.status(405).json({ error: 'Method Not Allowed' });
}
