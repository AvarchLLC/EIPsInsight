// src/app/Blogs/[slug]/page.tsx
import Link from 'next/link';
import { ArrowLeftIcon } from 'lucide-react';
import { getPostBySlug, PostNotFoundError } from '@/lib/blog';
import { notFound } from 'next/navigation';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import { ScrollToHashOnLoad } from '@/components/ScrollToHashOnLoad';
import { Box,Image as ChakraImage, } from '@chakra-ui/react';

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
      <div className='flex flex-col w-full max-w-9xl mx-auto mt-12 px-4'>
        <Link href='/resources' className='text-blue-600 hover:text-blue-700'>
          <div className='flex items-center gap-2'>
            <ArrowLeftIcon className='w-4 h-4' />
            <span>Back to all blogs</span>
          </div>
        </Link>

        {frontmatter.image && (
          <div className="w-full mt-6 overflow-hidden rounded-lg">
            {/* <Image
              src={frontmatter.image}
              alt={frontmatter.title}
              layout="responsive"
              width={900} 
              height={450} 
              className="rounded-lg object-cover"
            /> */}
            <Box
                display="flex"
                justifyContent="center"
                my={6}
                px={2}
              >
                <Box
                  border="2px solid teal"
                  borderRadius="lg"
                  overflow="hidden"
                  width={{ base: '100%', sm: '90%', md: '80%', lg: '70%' }}
                  height={{ base: '200px', sm: '300px', md: '350px' }} // Fixed window height
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  bg="gray.50" // Optional background
                >
                  <ChakraImage
                    src={frontmatter.image}
                    alt={frontmatter.title}
                    width="100%"
                    height="100%"
                    objectFit="contain"
                  />
                </Box>
              </Box>
          </div>
        )}

        <div className='w-full mt-6'>
          {(frontmatter as any).category && (
            <div className="mb-4">
              <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 text-sm font-semibold rounded-full">
                {(frontmatter as any).category}
              </span>
            </div>
          )}
          
          <h1 className='text-5xl font-bold mb-4'>{frontmatter.title}</h1>
          
          {/* Author Info with Avatar */}
          <div className='flex items-center gap-4 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700'>
            {(frontmatter as any).avatar ? (
              <img
                src={(frontmatter as any).avatar}
                alt={frontmatter.author}
                className="w-14 h-14 rounded-full border-2 border-blue-500"
              />
            ) : (
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-xl">
                {frontmatter.author.charAt(0)}
              </div>
            )}
            <div className='flex-1'>
              <p className='font-semibold text-lg text-gray-900 dark:text-white'>
                {frontmatter.author}
              </p>
              {(frontmatter as any).role && (
                <p className='text-sm text-gray-600 dark:text-gray-400'>
                  {(frontmatter as any).role}
                </p>
              )}
              <p className='text-sm text-gray-500 dark:text-gray-400 mt-1'>
                {frontmatter.date.toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          </div>

          {/* Tags */}
          {(frontmatter as any).tags && (frontmatter as any).tags.length > 0 && (
            <div className='flex flex-wrap gap-2 mb-6'>
              {(frontmatter as any).tags.map((tag: string, index: number) => (
                <span 
                  key={index}
                  className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
          
          <ScrollToHashOnLoad />
          <div className='text-justify prose prose-lg dark:prose-invert max-w-none'>
            <MarkdownRenderer markdown={content} />
          </div>
        </div>
      </div>
    </div>
  );
}