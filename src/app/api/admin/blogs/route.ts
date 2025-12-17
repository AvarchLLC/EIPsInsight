import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';

// GET all blogs (admin can see unpublished)
export async function GET(request: NextRequest) {
  try {
    const session = await getAdminSession();
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: blogs, error } = await supabaseAdmin
      .from('blogs')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json({ blogs });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blogs' },
      { status: 500 }
    );
  }
}

// POST create new blog
export async function POST(request: NextRequest) {
  try {
    const session = await getAdminSession();
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      slug,
      title,
      content,
      author,
      author_avatar,
      author_role,
      author_bio,
      author_twitter,
      author_linkedin,
      author_github,
      category,
      tags,
      image,
      published,
    } = body;

    // Validate required fields
    if (!slug || !title || !content || !author) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const { data: existingBlog } = await supabaseAdmin
      .from('blogs')
      .select('slug')
      .eq('slug', slug)
      .single();

    if (existingBlog) {
      return NextResponse.json(
        { error: 'A blog with this slug already exists' },
        { status: 400 }
      );
    }

    const { data: blog, error } = await supabaseAdmin
      .from('blogs')
      .insert([
        {
          slug,
          title,
          content,
          author,
          author_avatar,
          author_role,
          author_bio,
          author_twitter,
          author_linkedin,
          author_github,
          category,
          tags,
          image,
          published: published || false,
          published_at: published ? new Date().toISOString() : null,
          created_by: session.userId,
        },
      ])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ blog }, { status: 201 });
  } catch (error) {
    console.error('Error creating blog:', error);
    return NextResponse.json(
      { error: 'Failed to create blog' },
      { status: 500 }
    );
  }
}
