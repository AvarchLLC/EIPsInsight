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
        // Pectra redirects (all case variations)
        { source: '/pectra', destination: '/upgrade', permanent: true },
        { source: '/Pectra', destination: '/upgrade', permanent: true },
        { source: '/PEctra', destination: '/upgrade', permanent: true },
        { source: '/PECtra', destination: '/upgrade', permanent: true },
        { source: '/PECTra', destination: '/upgrade', permanent: true },
        { source: '/PECTRa', destination: '/upgrade', permanent: true },
        { source: '/PECTRA', destination: '/upgrade', permanent: true },
    
        // Reviewers redirects
        { source: '/reviewers', destination: '/Reviewers', permanent: true },
        { source: '/REVIEWERS', destination: '/Reviewers', permanent: true },
    
        // Analytics redirects
        { source: '/analytics', destination: '/Analytics', permanent: true },
        { source: '/ANalytics', destination: '/Analytics', permanent: true },
        { source: '/ANAlytics', destination: '/Analytics', permanent: true },
        { source: '/ANALytics', destination: '/Analytics', permanent: true },
        { source: '/ANALYtics', destination: '/Analytics', permanent: true },
        { source: '/ANALYTics', destination: '/Analytics', permanent: true },
        { source: '/ANALYTIcs', destination: '/Analytics', permanent: true },
        { source: '/ANALYTICs', destination: '/Analytics', permanent: true },
        { source: '/ANALYTICS', destination: '/Analytics', permanent: true },
    
        // Boards redirects
        { source: '/BOARDS', destination: '/boards', permanent: true },
        { source: '/BOARDs', destination: '/boards', permanent: true },
        { source: '/BOARds', destination: '/boards', permanent: true },
        { source: '/BOArds', destination: '/boards', permanent: true },
        { source: '/BOards', destination: '/boards', permanent: true },
        { source: '/Boards', destination: '/boards', permanent: true },
    
        // Proposal Builder redirects
        { source: '/PROPOSALBUILDER', destination: '/proposalbuilder', permanent: true }
      ];
    }
  })
);

export default nextConfig;