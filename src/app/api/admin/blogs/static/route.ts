import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import { getAllPosts } from '@/lib/blog';

// GET all posts including static ones
export async function GET() {
  try {
    const session = await getAdminSession();
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get all posts (static + database)
    const allPosts = await getAllPosts();
    
    // Transform to consistent format
    const posts = allPosts.map((post) => ({
      slug: post.slug,
      title: post.frontmatter.title,
      author: post.frontmatter.author,
      category: post.frontmatter.category,
      published: true, // Static posts are always published
      created_at: post.frontmatter.date.toISOString(),
      updated_at: post.frontmatter.date.toISOString(),
      isStatic: true, // Mark as static
      id: post.slug, // Use slug as ID for static posts
    }));

    return NextResponse.json({ posts });
  } catch (error) {
    console.error('Error fetching all posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}
