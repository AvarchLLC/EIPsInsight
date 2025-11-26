import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { z } from "zod";
import { supabaseAdmin, Blog as DBBlog } from "./supabase";
// import "server-only";

const POSTS_DIRECTORY = path.join(process.cwd(), "src", "blogs");

// Frontmatter schema
const frontmatterSchema = z
  .object({
    title: z.string(),
    author: z.string(),
    date: z.coerce.date(),
    image: z.string().url().optional(),
    avatar: z.string().url().optional(),
    role: z.string().optional(),
    // Extended author metadata
    authorAvatar: z.string().url().optional(),
    authorBio: z.string().optional(),
    authorTwitter: z.string().optional(),
    authorLinkedin: z.string().optional(),
    authorGithub: z.string().optional(),
    summaryPoints: z.array(z.string()).optional(),
    // Blog metadata
    category: z.string().optional(),
    tags: z.array(z.string()).optional(),
    readTime: z.number().optional(),
  })
  .passthrough(); // Allow additional properties

export type BlogPostFrontmatter = z.infer<typeof frontmatterSchema>;

/**
 * Custom error class for when a post is not found
 */
export class PostNotFoundError extends Error {
  constructor(public slug: string) {
    super(`Post with slug "${slug}" not found`);
    this.name = "PostNotFoundError";
  }
}

/**
 * Custom error class for when frontmatter validation fails
 */
export class FrontmatterValidationError extends Error {
  constructor(
    public slug: string,
    public override cause: z.ZodError<z.input<typeof frontmatterSchema>>
  ) {
    super(`Invalid frontmatter in post "${slug}"`);
    this.name = "FrontmatterValidationError";
  }
}

/**
 * Reads and validates a blog post from a filename
 * @param filename The filename of the blog post (with .md extension)
 * @param postsDirectory The directory containing blog posts
 * @throws {PostNotFoundError} When the post file doesn't exist
 * @throws {FrontmatterValidationError} When the post's frontmatter is invalid
 */
export function readPostFromFile(filename: string, postsDirectory = POSTS_DIRECTORY) {
  const slug = filename.replace(/\.md$/, "");
  const filePath = path.join(postsDirectory, filename);

  let fileContents;
  try {
    fileContents = fs.readFileSync(filePath, "utf-8");
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      throw new PostNotFoundError(slug);
    }
    throw error;
  }

  const { data, content } = matter(fileContents);

  // Validate frontmatter
  const validatedMatter = frontmatterSchema.safeParse(data);
  if (!validatedMatter.success) {
    throw new FrontmatterValidationError(slug, validatedMatter.error);
  }

  return {
    slug,
    filename,
    frontmatter: validatedMatter.data,
    content,
  };
}

/**
 * Convert database blog to frontmatter format
 */
function convertDBBlogToPost(blog: DBBlog) {
  return {
    slug: blog.slug,
    filename: `${blog.slug}.md`,
    frontmatter: {
      title: blog.title,
      author: blog.author,
      date: new Date(blog.published_at || blog.created_at),
      image: blog.image,
      avatar: blog.author_avatar,
      authorAvatar: blog.author_avatar,
      role: blog.author_role,
      authorBio: blog.author_bio,
      authorTwitter: blog.author_twitter,
      authorLinkedin: blog.author_linkedin,
      authorGithub: blog.author_github,
      summaryPoints: blog.summary_points,
      category: blog.category,
      tags: blog.tags,
    },
    content: blog.content,
  };
}

/**
 * Gets all blog posts with frontmatter and content (from both static files and database)
 */
export async function getAllPosts() {
  const postsDirectory = path.join(process.cwd(), "src", "blogs");
  
  // Get static file posts
  const files = await fs.promises.readdir(postsDirectory);
  const staticPosts = files
    .filter((filename) => filename.endsWith(".md"))
    .map((filename) => {
      try {
        return readPostFromFile(filename, postsDirectory);
      } catch (error) {
        if (error instanceof FrontmatterValidationError) {
          console.warn(error.message);
          return null;
        }
        throw error;
      }
    })
    .filter((post): post is NonNullable<typeof post> => post !== null);

  // Get database posts (only published ones)
  let dbPosts: ReturnType<typeof convertDBBlogToPost>[] = [];
  try {
    const { data: blogs, error } = await supabaseAdmin
      .from('blogs')
      .select('*')
      .eq('published', true)
      .order('published_at', { ascending: false });

    if (!error && blogs) {
      dbPosts = blogs.map(convertDBBlogToPost);
    }
  } catch (error) {
    console.error('Error fetching database blogs:', error);
  }

  // Combine and sort by date
  const allPosts = [...staticPosts, ...dbPosts].sort(
    (a, b) => b.frontmatter.date.getTime() - a.frontmatter.date.getTime()
  );

  return allPosts;
}

/**
 * Gets a single blog post by slug (checks database first, then static files)
 * @param slug The post slug (filename without extension)
 * @throws {PostNotFoundError} When the post with the given slug doesn't exist
 * @throws {FrontmatterValidationError} When the post's frontmatter is invalid
 */
export async function getPostBySlug(slug: string) {
  // Try database first
  try {
    const { data: blog, error } = await supabaseAdmin
      .from('blogs')
      .select('*')
      .eq('slug', slug)
      .eq('published', true)
      .single();

    if (!error && blog) {
      return convertDBBlogToPost(blog);
    }
  } catch (error) {
    // If not in database, try static files
    console.log('Blog not found in database, trying static files');
  }

  // Fall back to static file
  const filename = `${slug}.md`;
  return readPostFromFile(filename);
}