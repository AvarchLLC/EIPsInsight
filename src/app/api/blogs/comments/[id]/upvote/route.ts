import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

// POST /api/blogs/comments/[id]/upvote - Toggle upvote on a comment
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { user_id } = body;

    if (!user_id) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 401 }
      );
    }

    // Verify comment exists
    const { data: comment, error: commentError } = await supabaseAdmin
      .from('blog_comments')
      .select('id')
      .eq('id', params.id)
      .eq('is_deleted', false)
      .single();

    if (commentError || !comment) {
      return NextResponse.json(
        { error: 'Comment not found' },
        { status: 404 }
      );
    }

    // Check if user already upvoted
    const { data: existingUpvote } = await supabaseAdmin
      .from('comment_upvotes')
      .select('id')
      .eq('comment_id', params.id)
      .eq('user_id', user_id)
      .single();

    if (existingUpvote) {
      // Remove upvote (toggle off)
      const { error: deleteError } = await supabaseAdmin
        .from('comment_upvotes')
        .delete()
        .eq('id', existingUpvote.id);

      if (deleteError) {
        return NextResponse.json(
          { error: deleteError.message },
          { status: 500 }
        );
      }

      // Get updated count
      const { count } = await supabaseAdmin
        .from('comment_upvotes')
        .select('id', { count: 'exact', head: true })
        .eq('comment_id', params.id);

      return NextResponse.json({
        success: true,
        upvoted: false,
        upvote_count: count || 0,
      });
    } else {
      // Add upvote (toggle on)
      const { error: insertError } = await supabaseAdmin
        .from('comment_upvotes')
        .insert({
          comment_id: params.id,
          user_id,
        });

      if (insertError) {
        return NextResponse.json(
          { error: insertError.message },
          { status: 500 }
        );
      }

      // Get updated count
      const { count } = await supabaseAdmin
        .from('comment_upvotes')
        .select('id', { count: 'exact', head: true })
        .eq('comment_id', params.id);

      return NextResponse.json({
        success: true,
        upvoted: true,
        upvote_count: count || 0,
      });
    }
  } catch (error) {
    console.error('Error toggling comment upvote:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET /api/blogs/comments/[id]/upvote - Get upvote status and count
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('user_id');

    // Get total upvote count
    const { count } = await supabaseAdmin
      .from('comment_upvotes')
      .select('id', { count: 'exact', head: true })
      .eq('comment_id', params.id);

    let hasUserUpvoted = false;
    if (userId) {
      const { data: upvote } = await supabaseAdmin
        .from('comment_upvotes')
        .select('id')
        .eq('comment_id', params.id)
        .eq('user_id', userId)
        .single();

      hasUserUpvoted = !!upvote;
    }

    return NextResponse.json({
      upvote_count: count || 0,
      has_user_upvoted: hasUserUpvoted,
    });
  } catch (error) {
    console.error('Error fetching upvote status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
