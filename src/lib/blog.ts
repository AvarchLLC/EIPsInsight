import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { z } from "zod";
// import "server-only";

const POSTS_DIRECTORY = path.join(process.cwd(), "src", "blogs");

// Frontmatter schema
const frontmatterSchema = z
  .object({
    title: z.string(),
    author: z.string(),
    date: z.coerce.date(),
    image: z.string().url().optional(),
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
 * Gets all blog posts with frontmatter and content
 */
export async function getAllPosts() {
  const postsDirectory = path.join(process.cwd(), "blogs");
  const files = await fs.promises.readdir(postsDirectory);

  // Filter only .md files and process each file
  const posts = files
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
  .filter((post): post is NonNullable<typeof post> => post !== null) // ✅ Tells TS the type is now non-null
  .sort(
    (a, b) => b.frontmatter.date.getTime() - a.frontmatter.date.getTime()
  );


  return posts;
}

/**
 * Gets a single blog post by slug
 * @param slug The post slug (filename without extension)
 * @throws {PostNotFoundError} When the post with the given slug doesn't exist
 * @throws {FrontmatterValidationError} When the post's frontmatter is invalid
 */
export async function getPostBySlug(slug: string) {
  const filename = `${slug}.md`;
  return readPostFromFile(filename);
}