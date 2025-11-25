import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Client for browser/client-side operations
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server client with service role for admin operations (use only server-side)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Type definitions for our database tables
export interface TableOfContents {
  id: string;
  text: string;
  level: number;
  children?: TableOfContents[];
}

export interface Blog {
  id: string;
  slug: string;
  title: string;
  content: string;
  summary?: string;
  author: string;
  author_avatar?: string;
  author_role?: string;
  category?: string;
  tags?: string[];
  image?: string;
  reading_time?: number;
  // SEO Metadata
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string[];
  // Additional Metadata
  featured?: boolean;
  allow_comments?: boolean;
  table_of_contents?: TableOfContents[];
  // Publishing
  published: boolean;
  created_at: string;
  updated_at: string;
  published_at?: string;
  created_by: string;
}

export interface BlogImage {
  id: string;
  blog_id: string;
  image_url: string;
  storage_path: string;
  alt_text?: string;
  created_at: string;
}

export interface AdminUser {
  id: string;
  username: string;
  email: string;
  created_at: string;
  updated_at: string;
}
