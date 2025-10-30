import { getAllPosts } from '@/lib/blog';
import Link from 'next/link';
import { Calendar, Clock, User, ArrowRight, Tag } from 'lucide-react';
import Image from 'next/image';

export const metadata = {
  title: 'Blog | EIPsInsight',
  description: 'Explore in-depth articles about Ethereum Improvement Proposals, blockchain technology, and the latest developments in the Ethereum ecosystem.',
};

export default async function BlogsPage() {
  const posts = await getAllPosts();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-blue-800 dark:to-indigo-900">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight">
              EIPsInsight Blog
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Deep dives into Ethereum Improvement Proposals, protocol upgrades, and blockchain innovation
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-xl">
                <Tag className="w-6 h-6 text-blue-600 dark:text-blue-300" />
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{posts.length}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Articles</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-xl">
                <User className="w-6 h-6 text-green-600 dark:text-green-300" />
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {new Set(posts.map(p => p.frontmatter.author)).size}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Contributors</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-xl">
                <Clock className="w-6 h-6 text-purple-600 dark:text-purple-300" />
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {Math.ceil(posts.reduce((acc, p) => acc + (p.content.split(' ').length / 200), 0))}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Hours of Content</p>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Post */}
        {posts.length > 0 && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-3">
              <span className="w-1 h-8 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-full" />
              Featured Article
            </h2>
            <Link href={`/Blogs/${posts[0].slug}`} className="group block">
              <div className="relative bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-700 hover:shadow-3xl transition-all duration-300 hover:-translate-y-2">
                <div className="grid md:grid-cols-2 gap-0">
                  <div className="relative h-80 md:h-auto overflow-hidden">
                    {posts[0].frontmatter.image ? (
                      <img
                        src={posts[0].frontmatter.image}
                        alt={posts[0].frontmatter.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                        <Tag className="w-24 h-24 text-white/20" />
                      </div>
                    )}
                    <div className="absolute top-4 left-4">
                      <span className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-full shadow-lg">
                        Featured
                      </span>
                    </div>
                  </div>
                  <div className="p-8 md:p-12 flex flex-col justify-center">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Calendar className="w-4 h-4" />
                        {posts[0].frontmatter.date.toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Clock className="w-4 h-4" />
                        {Math.ceil(posts[0].content.split(' ').length / 200)} min read
                      </div>
                    </div>
                    <h3 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {posts[0].frontmatter.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6 line-clamp-3 text-lg">
                      {posts[0].content.substring(0, 200)}...
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-3">
                        {(posts[0].frontmatter as any).avatar ? (
                          <img
                            src={(posts[0].frontmatter as any).avatar}
                            alt={posts[0].frontmatter.author}
                            className="w-12 h-12 rounded-full border-2 border-blue-500"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-lg">
                            {posts[0].frontmatter.author.charAt(0)}
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {posts[0].frontmatter.author}
                          </p>
                          {(posts[0].frontmatter as any).role && (
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {(posts[0].frontmatter as any).role}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="ml-auto">
                        <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold group-hover:gap-4 transition-all">
                          Read More <ArrowRight className="w-5 h-5" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* All Posts Grid */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-3">
            <span className="w-1 h-8 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-full" />
            All Articles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.slice(1).map((post) => (
              <Link
                key={post.slug}
                href={`/Blogs/${post.slug}`}
                className="group block h-full"
              >
                <article className="h-full bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 flex flex-col">
                  <div className="relative h-56 overflow-hidden">
                    {post.frontmatter.image ? (
                      <img
                        src={post.frontmatter.image}
                        alt={post.frontmatter.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                        <Tag className="w-16 h-16 text-white/20" />
                      </div>
                    )}
                    {(post.frontmatter as any).category && (
                      <div className="absolute top-3 left-3">
                        <span className="px-3 py-1 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-blue-600 dark:text-blue-400 text-xs font-semibold rounded-full">
                          {(post.frontmatter as any).category}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center gap-3 mb-3 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {post.frontmatter.date.toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </div>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {Math.ceil(post.content.split(' ').length / 200)} min
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                      {post.frontmatter.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3 flex-1">
                      {post.content.substring(0, 150)}...
                    </p>
                    <div className="flex items-center gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                      {(post.frontmatter as any).avatar ? (
                        <img
                          src={(post.frontmatter as any).avatar}
                          alt={post.frontmatter.author}
                          className="w-10 h-10 rounded-full border-2 border-blue-500"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold">
                          {post.frontmatter.author.charAt(0)}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 dark:text-white truncate">
                          {post.frontmatter.author}
                        </p>
                        {(post.frontmatter as any).role && (
                          <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                            {(post.frontmatter as any).role}
                          </p>
                        )}
                      </div>
                      <ArrowRight className="w-5 h-5 text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-blue-800 dark:to-indigo-900 rounded-3xl p-12 text-center shadow-2xl">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Want to Contribute?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Share your insights about Ethereum Improvement Proposals with the community
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-4 rounded-full font-semibold hover:bg-blue-50 transition-colors shadow-lg hover:shadow-xl"
          >
            Get in Touch <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
