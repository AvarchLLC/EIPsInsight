// pages/api/lint.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { lint } from 'eipw-lint-js';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { template } = req.body;  
    try {
      
      const templateLines = template.split("\n");
      
      const lintResults = await lint(templateLines);

      console.log('Lint Results:', lintResults);

      if (lintResults.errors && lintResults.errors?.length > 0) {
        return res.status(400).json({ errors: lintResults.errors });
      }

      return res.status(200).json({ message: "No lint errors." });
    } catch (error) {
      
      console.error('Linting Error:', error);
      return res.status(500).json({ error: 'Error linting template' });
    }
  }

 
  return res.status(405).json({ error: 'Method Not Allowed' });
}
