import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Clear NextAuth cookies using Set-Cookie headers
    const cookiesToClear = [
      'next-auth.session-token',
      'next-auth.csrf-token',
      'next-auth.callback-url',
      '__Secure-next-auth.session-token',
      '__Secure-next-auth.csrf-token',
      '__Secure-next-auth.callback-url'
    ];

    // Set cookies to expire in the past to clear them
    const expiredDate = new Date(0).toUTCString();
    
    cookiesToClear.forEach(cookieName => {
      res.setHeader('Set-Cookie', [
        `${cookieName}=; Path=/; Expires=${expiredDate}; HttpOnly`,
        `${cookieName}=; Path=/; Expires=${expiredDate}; Domain=localhost; HttpOnly`,
        `${cookieName}=; Path=/; Expires=${expiredDate}; SameSite=Lax`,
      ]);
    });

    return res.status(200).json({ 
      message: 'Authentication cookies cleared successfully',
      clearedCookies: cookiesToClear
    });

  } catch (error) {
    console.error('Error clearing auth cookies:', error);
    return res.status(500).json({ error: 'Failed to clear authentication cookies' });
  }
}