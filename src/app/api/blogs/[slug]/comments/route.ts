import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/blogs/[slug]/comments - Get all comments for a blog
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    // Get blog by slug
    const { data: blog, error: blogError } = await supabaseAdmin
      .from('blogs')
      .select('id')
      .eq('slug', params.slug)
      .eq('published', true)
      .single();

    if (blogError || !blog) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      );
    }

    // Get comments with user info and upvote counts
    const { data: comments, error: commentsError } = await supabaseAdmin
      .from('blog_comments')
      .select(`
        *,
        user:users!blog_comments_user_id_fkey (
          id,
          username,
          display_name,
          avatar_url
        )
      `)
      .eq('blog_id', blog.id)
      .eq('is_deleted', false)
      .order('created_at', { ascending: false });

    if (commentsError) {
      return NextResponse.json(
        { error: commentsError.message },
        { status: 500 }
      );
    }

    // Get upvote counts for each comment
    const commentsWithUpvotes = await Promise.all(
      (comments || []).map(async (comment) => {
        const { data: upvotes } = await supabaseAdmin
          .from('comment_upvotes')
          .select('id', { count: 'exact' })
          .eq('comment_id', comment.id);

        return {
          ...comment,
          upvote_count: upvotes?.length || 0,
        };
      })
    );

    // Organize comments into a tree structure (parent -> children)
    const commentMap = new Map();
    const rootComments: any[] = [];

    commentsWithUpvotes.forEach((comment) => {
      commentMap.set(comment.id, { ...comment, replies: [] });
    });

    commentsWithUpvotes.forEach((comment) => {
      if (comment.parent_comment_id) {
        const parent = commentMap.get(comment.parent_comment_id);
        if (parent) {
          parent.replies.push(commentMap.get(comment.id));
        }
      } else {
        rootComments.push(commentMap.get(comment.id));
      }
    });

    return NextResponse.json({
      comments: rootComments,
      total: commentsWithUpvotes.length,
    });
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/blogs/[slug]/comments - Create a new comment
export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const body = await request.json();
    const { content, user_id, parent_comment_id } = body;

    // Validate input
    if (!content || !user_id) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (content.trim().length < 3) {
      return NextResponse.json(
        { error: 'Comment must be at least 3 characters' },
        { status: 400 }
      );
    }

    if (content.length > 5000) {
      return NextResponse.json(
        { error: 'Comment must be less than 5000 characters' },
        { status: 400 }
      );
    }

    // Get blog by slug
    const { data: blog, error: blogError } = await supabaseAdmin
      .from('blogs')
      .select('id, allow_comments')
      .eq('slug', params.slug)
      .eq('published', true)
      .single();

    if (blogError || !blog) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      );
    }

    if (blog.allow_comments === false) {
      return NextResponse.json(
        { error: 'Comments are disabled for this blog' },
        { status: 403 }
      );
    }

    // Verify user exists
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select('id, is_active')
      .eq('id', user_id)
      .single();

    if (userError || !user || !user.is_active) {
      return NextResponse.json(
        { error: 'Invalid or inactive user' },
        { status: 403 }
      );
    }

    // If parent comment is specified, verify it exists
    if (parent_comment_id) {
      const { data: parentComment } = await supabaseAdmin
        .from('blog_comments')
        .select('id')
        .eq('id', parent_comment_id)
        .eq('blog_id', blog.id)
        .single();

      if (!parentComment) {
        return NextResponse.json(
          { error: 'Parent comment not found' },
          { status: 404 }
        );
      }
    }

    // Create comment
    const { data: comment, error: commentError } = await supabaseAdmin
      .from('blog_comments')
      .insert({
        blog_id: blog.id,
        user_id,
        content: content.trim(),
        parent_comment_id: parent_comment_id || null,
      })
      .select(`
        *,
        user:users!blog_comments_user_id_fkey (
          id,
          username,
          display_name,
          avatar_url
        )
      `)
      .single();

    if (commentError) {
      return NextResponse.json(
        { error: commentError.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { comment, message: 'Comment posted successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
