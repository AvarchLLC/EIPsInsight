import { NextRequest, NextResponse } from 'next/server';
import { authenticateAdmin, createAdminToken, setAdminSession } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    const session = await authenticateAdmin(username, password);

    if (!session) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const token = await createAdminToken(session);
    await setAdminSession(token);

    return NextResponse.json({
      success: true,
      user: {
        username: session.username,
        email: session.email,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
