import { GetStaticProps } from 'next';
import { getAllPosts } from '@/lib/blog';
import BlogsClient from '@/components/Blog/BlogsClient';

interface BlogsPageProps {
  posts: Array<{
    slug: string;
    frontmatter: {
      title: string;
      author: string;
      date: string;
      image?: string;
      category?: string;
      avatar?: string;
      role?: string;
    };
    content: string;
  }>;
}

export default function BlogsPage({ posts }: BlogsPageProps) {
  // Convert date strings back to Date objects
  const postsWithDates = posts.map(post => ({
    ...post,
    frontmatter: {
      ...post.frontmatter,
      date: new Date(post.frontmatter.date),
    },
  }));

  return <BlogsClient posts={postsWithDates} />;
}

export const getStaticProps: GetStaticProps = async () => {
  const posts = await getAllPosts();

  // Serialize dates for JSON
  const serializedPosts = posts.map(post => ({
    ...post,
    frontmatter: {
      ...post.frontmatter,
      date: post.frontmatter.date.toISOString(),
    },
  }));

  return {
    props: {
      posts: serializedPosts,
    },
    revalidate: 3600, // Revalidate every hour
  };
};
