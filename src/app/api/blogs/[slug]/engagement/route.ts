import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/blogs/[slug]/engagement - Get engagement stats for a blog
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('user_id');

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

    // Try to get from materialized view first (faster)
    const { data: stats } = await supabaseAdmin
      .from('blog_stats')
      .select('view_count, upvote_count, download_count, comment_count')
      .eq('blog_id', blog.id)
      .single();

    let hasUserUpvoted = false;
    if (userId) {
      const { data: upvote } = await supabaseAdmin
        .from('blog_engagement')
        .select('id')
        .eq('blog_id', blog.id)
        .eq('user_id', userId)
        .eq('engagement_type', 'upvote')
        .single();

      hasUserUpvoted = !!upvote;
    }

    return NextResponse.json({
      view_count: stats?.view_count || 0,
      upvote_count: stats?.upvote_count || 0,
      download_count: stats?.download_count || 0,
      comment_count: stats?.comment_count || 0,
      has_user_upvoted: hasUserUpvoted,
    });
  } catch (error) {
    console.error('Error fetching engagement:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/blogs/[slug]/engagement - Track engagement (view, upvote, downvote, download)
export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const body = await request.json();
    const { type, user_id } = body;

    // Validate engagement type
    if (!['view', 'upvote', 'downvote', 'download'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid engagement type' },
        { status: 400 }
      );
    }

    // Only downloads require authentication
    if (type === 'download' && !user_id) {
      return NextResponse.json(
        { error: 'Authentication required for downloads' },
        { status: 401 }
      );
    }

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

    // Get client metadata
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown';
    const userAgent = request.headers.get('user-agent');
    const referrer = request.headers.get('referer');

    if (type === 'view') {
      // Track view (allow duplicates, we'll filter in analytics)
      const { error: viewError } = await supabaseAdmin
        .from('blog_engagement')
        .insert({
          blog_id: blog.id,
          user_id: user_id || null,
          engagement_type: 'view',
          ip_address: ip,
          user_agent: userAgent,
          referrer,
        });

      if (viewError) {
        console.error('Error tracking view:', viewError);
      }

      return NextResponse.json({ success: true, type: 'view' });
    }

    if (type === 'upvote') {
      // Check if user/anonymous already upvoted
      let existingUpvoteQuery = supabaseAdmin
        .from('blog_engagement')
        .select('id')
        .eq('blog_id', blog.id)
        .eq('engagement_type', 'upvote');
      
      if (user_id) {
        existingUpvoteQuery = existingUpvoteQuery.eq('user_id', user_id);
      } else {
        existingUpvoteQuery = existingUpvoteQuery
          .eq('ip_address', ip)
          .eq('user_agent', userAgent);
      }
      
      const { data: existingUpvote } = await existingUpvoteQuery.single();

      // Remove any existing downvote first
      if (user_id) {
        await supabaseAdmin
          .from('blog_engagement')
          .delete()
          .eq('blog_id', blog.id)
          .eq('user_id', user_id)
          .eq('engagement_type', 'downvote');
      } else {
        await supabaseAdmin
          .from('blog_engagement')
          .delete()
          .eq('blog_id', blog.id)
          .eq('ip_address', ip)
          .eq('user_agent', userAgent)
          .eq('engagement_type', 'downvote');
      }

      if (existingUpvote) {
        // Remove upvote (toggle)
        await supabaseAdmin
          .from('blog_engagement')
          .delete()
          .eq('id', existingUpvote.id);

        return NextResponse.json({
          success: true,
          type: 'upvote',
          action: 'removed',
          upvoted: false,
        });
      } else {
        // Add upvote
        const { error: upvoteError } = await supabaseAdmin
          .from('blog_engagement')
          .insert({
            blog_id: blog.id,
            user_id: user_id || null,
            engagement_type: 'upvote',
            ip_address: ip,
            user_agent: userAgent,
            referrer,
          });

        if (upvoteError) {
          return NextResponse.json(
            { error: upvoteError.message },
            { status: 500 }
          );
        }

        return NextResponse.json({
          success: true,
          type: 'upvote',
          action: 'added',
          upvoted: true,
        });
      }
    }

    if (type === 'downvote') {
      // Check if user/anonymous already downvoted
      let existingDownvoteQuery = supabaseAdmin
        .from('blog_engagement')
        .select('id')
        .eq('blog_id', blog.id)
        .eq('engagement_type', 'downvote');
      
      if (user_id) {
        existingDownvoteQuery = existingDownvoteQuery.eq('user_id', user_id);
      } else {
        existingDownvoteQuery = existingDownvoteQuery
          .eq('ip_address', ip)
          .eq('user_agent', userAgent);
      }
      
      const { data: existingDownvote } = await existingDownvoteQuery.single();

      // Remove any existing upvote first
      if (user_id) {
        await supabaseAdmin
          .from('blog_engagement')
          .delete()
          .eq('blog_id', blog.id)
          .eq('user_id', user_id)
          .eq('engagement_type', 'upvote');
      } else {
        await supabaseAdmin
          .from('blog_engagement')
          .delete()
          .eq('blog_id', blog.id)
          .eq('ip_address', ip)
          .eq('user_agent', userAgent)
          .eq('engagement_type', 'upvote');
      }

      if (existingDownvote) {
        // Remove downvote (toggle)
        await supabaseAdmin
          .from('blog_engagement')
          .delete()
          .eq('id', existingDownvote.id);

        return NextResponse.json({
          success: true,
          type: 'downvote',
          action: 'removed',
          downvoted: false,
        });
      } else {
        // Add downvote
        const { error: downvoteError } = await supabaseAdmin
          .from('blog_engagement')
          .insert({
            blog_id: blog.id,
            user_id: user_id || null,
            engagement_type: 'downvote',
            ip_address: ip,
            user_agent: userAgent,
            referrer,
          });

        if (downvoteError) {
          return NextResponse.json(
            { error: downvoteError.message },
            { status: 500 }
          );
        }

        return NextResponse.json({
          success: true,
          type: 'downvote',
          action: 'added',
          downvoted: true,
        });
      }
    }

    if (type === 'download') {
      // Track download
      const { error: downloadError } = await supabaseAdmin
        .from('blog_engagement')
        .insert({
          blog_id: blog.id,
          user_id,
          engagement_type: 'download',
          ip_address: ip,
          user_agent: userAgent,
          referrer,
        });

      if (downloadError) {
        console.error('Error tracking download:', downloadError);
      }

      return NextResponse.json({ success: true, type: 'download' });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error tracking engagement:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
