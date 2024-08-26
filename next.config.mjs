import createMDXPlugin from "@next/mdx";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import remarkHighlight from "remark-highlight.js";

const withMDX = createMDXPlugin({
  extension: /\.mdx$/,
  options: {
    // These options apply to .mdx fles only
    providerImportSource: "@mdx-js/react",
    rehypePlugins: [],
    remarkPlugins: [remarkGfm, remarkHighlight],
  },
});

const withMarkdown = createMDXPlugin({
  extension: /\.md$/,
  options: {
    // These options apply to .md fles only
    providerImportSource: "@mdx-js/react",
    rehypePlugins: [],
    remarkPlugins: [remarkGfm, remarkHighlight],
  },
});

const nextConfig = withMDX(
  withMarkdown({
    compiler: {
      styledComponents: true,
    },
    pageExtensions: ["mdx", "md", "tsx", "ts"],
    poweredByHeader: false,
    reactStrictMode: false,
    trailingSlash: false,
  })
);

export default nextConfig;