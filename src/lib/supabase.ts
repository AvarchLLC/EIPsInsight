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
  // Extended Author Metadata
  author_bio?: string;
  author_twitter?: string;
  author_linkedin?: string;
  author_github?: string;
  summary_points?: string[];
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

// User type (for commenting and engagement)
export interface User {
  id: string;
  email: string;
  username: string;
  display_name?: string;
  avatar_url?: string;
  bio?: string;
  twitter_handle?: string;
  github_handle?: string;
  linkedin_url?: string;
  is_verified: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  last_login_at?: string;
}

// Blog Comment type
export interface BlogComment {
  id: string;
  blog_id: string;
  user_id: string;
  parent_comment_id?: string;
  content: string;
  is_edited: boolean;
  is_deleted: boolean;
  is_flagged: boolean;
  moderation_note?: string;
  created_at: string;
  updated_at: string;
  edited_at?: string;
  // Populated fields (from joins)
  user?: User;
  upvote_count?: number;
  replies?: BlogComment[];
}

// Comment Upvote type
export interface CommentUpvote {
  id: string;
  comment_id: string;
  user_id: string;
  created_at: string;
}

// Blog Engagement type
export interface BlogEngagement {
  id: string;
  blog_id: string;
  user_id?: string;
  engagement_type: 'view' | 'upvote' | 'download';
  ip_address?: string;
  user_agent?: string;
  referrer?: string;
  created_at: string;
}

// Blog Stats type (from materialized view)
export interface BlogStats {
  blog_id: string;
  slug: string;
  title: string;
  view_count: number;
  upvote_count: number;
  download_count: number;
  comment_count: number;
  published_at?: string;
  created_at: string;
}

// Extended Blog with Stats
export interface BlogWithStats extends Blog {
  view_count?: number;
  upvote_count?: number;
  download_count?: number;
  comment_count?: number;
  has_user_upvoted?: boolean;
}
