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
      const properCaseRoutes = ['Reviewers', 'Analytics', 'Boards', 'proposalbuilder', 'home', 'pectra', 'all', 'eip', 'erc', 'rip', 'authors', 'SearchEip', 'SearchEipTitle', 'SearchPRSandISSUES', 'resources', ]; // Add more as needed
    
      return properCaseRoutes.flatMap(properPath => {
        const lowerPath = properPath.toLowerCase();
        const upperPath = properPath.toUpperCase();
        
        return [
          // Redirect lowercase version
          {
            source: `/${lowerPath}`,
            destination: `/${properPath}`,
            permanent: true,
            has: [{ type: 'header', key: 'x-original-path', value: `/${lowerPath}` }]
          },
          // Redirect uppercase version (if different from lowercase)
          ...(upperPath !== lowerPath ? [{
            source: `/${upperPath}`,
            destination: `/${properPath}`,
            permanent: true,
            has: [{ type: 'header', key: 'x-original-path', value: `/${upperPath}` }]
          }] : []),
          // Redirect mixed case version (if different from both)
          ...(properPath !== lowerPath && properPath !== upperPath ? [{
            source: `/${properPath}`,
            destination: `/${properPath}`,
            permanent: true,
            has: [{ type: 'header', key: 'x-original-path', value: `/${properPath}` }]
          }] : [])
        ];
      });
    }
  })
);

export default nextConfig;
