import { getPostBySlug, PostNotFoundError } from '@/lib/blog';
import { notFound } from 'next/navigation';
import { extractHeadingsFromMarkdown } from '@/utils/toc';
import BlogPostView from './BlogPostView';

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  let post;
  try {
    post = await getPostBySlug(slug);
  } catch (error) {
    if (error instanceof PostNotFoundError) notFound();
    throw error;
  }
  const { frontmatter, content } = post;

  // Do NOT use hooks here! Only synchronous JS.
  const headings = extractHeadingsFromMarkdown(content);
  const summaryPoints = frontmatter.summaryPoints || [];

  return (
    <BlogPostView
      frontmatter={frontmatter}
      content={content}
      headings={headings}
      summaryPoints={summaryPoints}
    />
  );
}
