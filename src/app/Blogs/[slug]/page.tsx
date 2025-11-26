// src/app/Blogs/[slug]/page.tsx
import Link from 'next/link';
import { ArrowLeftIcon } from 'lucide-react';
import { FaTwitter, FaLinkedin, FaGithub } from 'react-icons/fa';
import { getPostBySlug, PostNotFoundError } from '@/lib/blog';
import { notFound } from 'next/navigation';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import { ScrollToHashOnLoad } from '@/components/ScrollToHashOnLoad';
import { Box,Image as ChakraImage, } from '@chakra-ui/react';
import dynamic from 'next/dynamic';

const EngagementBar = dynamic(() => import('@/components/Blog/EngagementBar'), { ssr: false });
const CommentsSection = dynamic(() => import('@/components/Blog/CommentsSection'), { ssr: false });

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
          <div className='mb-6 pb-6 border-b border-gray-200 dark:border-gray-700'>
            <div className='flex items-center gap-4 mb-4'>
              {(frontmatter as any).authorAvatar || (frontmatter as any).avatar ? (
                <img
                  src={(frontmatter as any).authorAvatar || (frontmatter as any).avatar}
                  alt={frontmatter.author}
                  className="w-16 h-16 rounded-full border-2 border-blue-500 object-cover"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-xl">
                  {frontmatter.author.charAt(0)}
                </div>
              )}
              <div className='flex-1'>
                <p className='font-semibold text-xl text-gray-900 dark:text-white'>
                  {frontmatter.author}
                </p>
                {((frontmatter as any).authorBio || (frontmatter as any).role) && (
                  <p className='text-sm text-gray-600 dark:text-gray-400 mt-1'>
                    {(frontmatter as any).authorBio || (frontmatter as any).role}
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
            
            {/* Social Links */}
            {((frontmatter as any).authorTwitter || (frontmatter as any).authorLinkedin || (frontmatter as any).authorGithub) && (
              <div className='flex gap-3 mt-3'>
                {(frontmatter as any).authorTwitter && (
                  <a
                    href={(frontmatter as any).authorTwitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full text-sm hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                  >
                    <FaTwitter className="w-4 h-4" />
                    <span>Twitter</span>
                  </a>
                )}
                {(frontmatter as any).authorLinkedin && (
                  <a
                    href={(frontmatter as any).authorLinkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-sm hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                  >
                    <FaLinkedin className="w-4 h-4" />
                    <span>LinkedIn</span>
                  </a>
                )}
                {(frontmatter as any).authorGithub && (
                  <a
                    href={(frontmatter as any).authorGithub}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    <FaGithub className="w-4 h-4" />
                    <span>GitHub</span>
                  </a>
                )}
              </div>
            )}
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

          {/* Engagement Bar */}
          <div className='mb-6'>
            <EngagementBar 
              slug={slug} 
              userId={undefined}
            />
          </div>
          
          <ScrollToHashOnLoad />
          <div className='text-justify prose prose-lg dark:prose-invert max-w-none'>
            <MarkdownRenderer markdown={content} />
          </div>

          {/* Comments Section */}
          <div className='mt-12'>
            <CommentsSection 
              blogSlug={slug}
              userId={undefined}
              isAdmin={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
}