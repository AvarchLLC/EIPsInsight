import './polyfills'; // Load polyfills for older Node.js versions
import { supabaseAdmin } from './supabase';
import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const JWT_SECRET = new TextEncoder().encode(
  process.env.ADMIN_JWT_SECRET || 'fallback-secret-change-in-production'
);

export interface AdminSession {
  userId: string;
  username: string;
  email: string;
}

/**
 * Create an admin user (use this once to create your first admin)
 */
export async function createAdminUser(username: string, email: string, password: string) {
  const passwordHash = await bcrypt.hash(password, 10);
  
  const { data, error } = await supabaseAdmin
    .from('admin_users')
    .insert([
      {
        username,
        email,
        password_hash: passwordHash,
      },
    ])
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create admin user: ${error.message}`);
  }

  return data;
}

/**
 * Authenticate admin user with username and password
 */
export async function authenticateAdmin(username: string, password: string): Promise<AdminSession | null> {
  const { data: user, error } = await supabaseAdmin
    .from('admin_users')
    .select('id, username, email, password_hash')
    .eq('username', username)
    .single();

  if (error || !user) {
    return null;
  }

  const isValidPassword = await bcrypt.compare(password, user.password_hash);
  
  if (!isValidPassword) {
    return null;
  }

  return {
    userId: user.id,
    username: user.username,
    email: user.email,
  };
}

/**
 * Create JWT token for admin session
 */
export async function createAdminToken(session: AdminSession): Promise<string> {
  const token = await new SignJWT({ 
    userId: session.userId,
    username: session.username,
    email: session.email,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d') // Token expires in 7 days
    .sign(JWT_SECRET);

  return token;
}

/**
 * Verify JWT token and return admin session
 */
export async function verifyAdminToken(token: string): Promise<AdminSession | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    
    return {
      userId: payload.userId as string,
      username: payload.username as string,
      email: payload.email as string,
    };
  } catch (error) {
    return null;
  }
}

/**
 * Get current admin session from cookies
 */
export async function getAdminSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;

  if (!token) {
    return null;
  }

  return verifyAdminToken(token);
}

/**
 * Set admin session cookie
 */
export async function setAdminSession(token: string) {
  const cookieStore = await cookies();
  cookieStore.set('admin_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });
}

/**
 * Clear admin session cookie
 */
export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete('admin_token');
}
