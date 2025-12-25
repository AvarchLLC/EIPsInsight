import { GetStaticProps, GetStaticPaths } from 'next';
import { getPostBySlug, getAllPosts } from '@/lib/blog';
import BlogPostClient from '@/components/Blog/BlogPostClient';

interface BlogPostPageProps {
  slug: string;
  frontmatter: any;
  content: string;
}

export default function BlogPostPage({ slug, frontmatter, content }: BlogPostPageProps) {
  // Convert date string back to Date object
  const frontmatterWithDate = {
    ...frontmatter,
    date: new Date(frontmatter.date),
  };

  return <BlogPostClient slug={slug} frontmatter={frontmatterWithDate} content={content} />;
}

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getAllPosts();
  
  const paths = posts.map(post => ({
    params: { slug: post.slug },
  }));

  return {
    paths,
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug as string;

  try {
    const post = await getPostBySlug(slug);

    // Serialize date for JSON
    const serializedFrontmatter = {
      ...post.frontmatter,
      date: post.frontmatter.date.toISOString(),
    };

    return {
      props: {
        slug,
        frontmatter: serializedFrontmatter,
        content: post.content,
      },
      revalidate: 3600, // Revalidate every hour
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
};
