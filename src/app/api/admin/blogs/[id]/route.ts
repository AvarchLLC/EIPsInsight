import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';

// GET single blog by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAdminSession();
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const { data: blog, error } = await supabaseAdmin
      .from('blogs')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw error;
    }

    if (!blog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }

    return NextResponse.json({ blog });
  } catch (error) {
    console.error('Error fetching blog:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog' },
      { status: 500 }
    );
  }
}

// PUT update blog
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAdminSession();
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    
    const {
      slug,
      title,
      content,
      author,
      author_avatar,
      author_role,
      category,
      tags,
      image,
      published,
    } = body;

    // Get current blog to check if it exists and if published status changed
    const { data: currentBlog } = await supabaseAdmin
      .from('blogs')
      .select('published')
      .eq('id', id)
      .single();

    if (!currentBlog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }

    const updateData: any = {
      slug,
      title,
      content,
      author,
      author_avatar,
      author_role,
      category,
      tags,
      image,
      published,
    };

    // If changing from unpublished to published, set published_at
    if (published && !currentBlog.published) {
      updateData.published_at = new Date().toISOString();
    }

    const { data: blog, error } = await supabaseAdmin
      .from('blogs')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ blog });
  } catch (error) {
    console.error('Error updating blog:', error);
    return NextResponse.json(
      { error: 'Failed to update blog' },
      { status: 500 }
    );
  }
}

// DELETE blog
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAdminSession();
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const { error } = await supabaseAdmin
      .from('blogs')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting blog:', error);
    return NextResponse.json(
      { error: 'Failed to delete blog' },
      { status: 500 }
    );
  }
}
