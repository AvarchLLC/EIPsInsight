import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

// PATCH /api/blogs/comments/[id] - Update a comment
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { content, user_id } = body;

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

    // Get existing comment
    const { data: comment, error: commentError } = await supabaseAdmin
      .from('blog_comments')
      .select('*')
      .eq('id', params.id)
      .single();

    if (commentError || !comment) {
      return NextResponse.json(
        { error: 'Comment not found' },
        { status: 404 }
      );
    }

    // Verify user owns the comment
    if (comment.user_id !== user_id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Update comment
    const { data: updatedComment, error: updateError } = await supabaseAdmin
      .from('blog_comments')
      .update({
        content: content.trim(),
        is_edited: true,
        edited_at: new Date().toISOString(),
      })
      .eq('id', params.id)
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

    if (updateError) {
      return NextResponse.json(
        { error: updateError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      comment: updatedComment,
      message: 'Comment updated successfully',
    });
  } catch (error) {
    console.error('Error updating comment:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/blogs/comments/[id] - Delete a comment
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('user_id');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 400 }
      );
    }

    // Get existing comment
    const { data: comment, error: commentError } = await supabaseAdmin
      .from('blog_comments')
      .select('*')
      .eq('id', params.id)
      .single();

    if (commentError || !comment) {
      return NextResponse.json(
        { error: 'Comment not found' },
        { status: 404 }
      );
    }

    // Verify user owns the comment or is admin
    if (comment.user_id !== userId) {
      // Check if user is admin
      const { data: admin } = await supabaseAdmin
        .from('admin_users')
        .select('id')
        .eq('id', userId)
        .single();

      if (!admin) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 403 }
        );
      }
    }

    // Soft delete - mark as deleted instead of removing
    const { error: deleteError } = await supabaseAdmin
      .from('blog_comments')
      .update({
        is_deleted: true,
        content: '[deleted]',
      })
      .eq('id', params.id);

    if (deleteError) {
      return NextResponse.json(
        { error: deleteError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Comment deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting comment:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
