// src/app/Blogs/[slug]/page.tsx
import Link from 'next/link';
import { ArrowLeftIcon } from 'lucide-react';
import Image from 'next/image';
import { getPostBySlug, PostNotFoundError } from '@/lib/blog';
import { notFound } from 'next/navigation';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import { ScrollToHashOnLoad } from '@/components/ScrollToHashOnLoad';

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  let post;
  try {
    post = await getPostBySlug(slug);
  } catch (error) {
    if (error instanceof PostNotFoundError) {
      notFound();
    }
    throw error;
  }

  const { frontmatter, content } = post;

  // console.log("content data:", content);

  return (
    <div className='flex flex-col min-h-screen'>
      <div className='flex flex-col w-full max-w-7xl mx-auto mt-12 px-4'>
        <Link href='/resources' className='text-blue-600 hover:text-blue-700'>
          <div className='flex items-center gap-2'>
            <ArrowLeftIcon className='w-4 h-4' />
            <span>Back to all blogs</span>
          </div>
        </Link>

        {frontmatter.image && (
          <div className="w-full mt-6 overflow-hidden rounded-lg">
            <Image
              src={frontmatter.image}
              alt={frontmatter.title}
              layout="responsive"
              width={900} // image aspect ratio base
              height={450} // adjust based on your desired ratio
              className="rounded-lg object-cover"
            />
          </div>
        )}

        <div className='w-full mt-6'>
          <h1 className='text-5xl font-bold mb-2'>{frontmatter.title}</h1>
          <p className='text-sm text-gray-500 mb-6'>
            Written by {frontmatter.author} on {frontmatter.date.toLocaleDateString()}
          </p>
          <ScrollToHashOnLoad />
          <MarkdownRenderer markdown={content} />
        </div>
      </div>
    </div>
  );
}
