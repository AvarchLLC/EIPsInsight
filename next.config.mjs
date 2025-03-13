import createMDXPlugin from "@next/mdx";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import remarkHighlight from "remark-highlight.js";

// MDX plugin for handling .mdx files
const withMDX = createMDXPlugin({
  extension: /\.mdx$/,
  options: {
    providerImportSource: "@mdx-js/react",
    rehypePlugins: [],
    remarkPlugins: [remarkGfm, remarkHighlight],
  },
});

// MD plugin for handling .md files
const withMarkdown = createMDXPlugin({
  extension: /\.md$/,
  options: {
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

    // Add the redirects method here
    async redirects() {
      return [
        // Redirect lowercase 'reviewers' to properly cased 'Reviewers', only if the pathname is not already correct
        {
          source: '/reviewers',
          destination: '/Reviewers',
          permanent: true,
          has: [{ type: 'header', key: 'x-original-path', value: '/reviewers' }]
        },
        {
          source: '/REVIEWERS',
          destination: '/Reviewers',
          permanent: true,
          has: [{ type: 'header', key: 'x-original-path', value: '/REVIEWERS' }]
        },
        {
          source: '/analytics',
          destination: '/Analytics',
          permanent: true,
          has: [{ type: 'header', key: 'x-original-path', value: '/analytics' }]
        },
        {
          source: '/ANALYTICS',
          destination: '/Analytics',
          permanent: true,
          has: [{ type: 'header', key: 'x-original-path', value: '/ANALYTICS' }]
        },
        {
          source: '/BOARDS',
          destination: '/boards',
          permanent: true,
          has: [{ type: 'header', key: 'x-original-path', value: '/BOARDS' }]
        },
      ];
    }
  })
);

export default nextConfig;
