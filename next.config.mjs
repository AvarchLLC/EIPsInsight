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
          source: '/pectra',
          destination: '/upgrade',
          permanent: true,
          has: [{ type: 'header', key: 'x-original-path', value: '/pectra' }]
        },
        {
          source: '/Pectra',
          destination: '/upgrade',
          permanent: true,
          has: [{ type: 'header', key: 'x-original-path', value: '/Pectra' }]
        },
        {
          source: '/PEctra',
          destination: '/upgrade',
          permanent: true,
          has: [{ type: 'header', key: 'x-original-path', value: '/PEctra' }]
        },
        {
          source: '/PECtra',
          destination: '/upgrade',
          permanent: true,
          has: [{ type: 'header', key: 'x-original-path', value: '/PECtra' }]
        },
        {
          source: '/PECTra',
          destination: '/upgrade',
          permanent: true,
          has: [{ type: 'header', key: 'x-original-path', value: '/PECTra' }]
        },
        {
          source: '/PECTRa',
          destination: '/upgrade',
          permanent: true,
          has: [{ type: 'header', key: 'x-original-path', value: '/PECTRa' }]
        },
        {
          source: '/PECTRA',
          destination: '/upgrade',
          permanent: true,
          has: [{ type: 'header', key: 'x-original-path', value: '/PECTRS' }]
        },
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
          source: '/ANalytics',
          destination: '/Analytics',
          permanent: true,
          has: [{ type: 'header', key: 'x-original-path', value: '/ANalytics' }]
        },
        {
          source: '/ANAlytics',
          destination: '/Analytics',
          permanent: true,
          has: [{ type: 'header', key: 'x-original-path', value: '/ANAlytics' }]
        },
        {
          source: '/ANALytics',
          destination: '/Analytics',
          permanent: true,
          has: [{ type: 'header', key: 'x-original-path', value: '/ANALytics' }]
        },
        {
          source: '/ANALYtics',
          destination: '/Analytics',
          permanent: true,
          has: [{ type: 'header', key: 'x-original-path', value: '/ANALYtics' }]
        },
        {
          source: '/ANALYTics',
          destination: '/Analytics',
          permanent: true,
          has: [{ type: 'header', key: 'x-original-path', value: '/ANALYTics' }]
        },
        {
          source: '/ANALYTIcs',
          destination: '/Analytics',
          permanent: true,
          has: [{ type: 'header', key: 'x-original-path', value: '/ANALYTIcs' }]
        },
        {
          source: '/ANALYTICs',
          destination: '/Analytics',
          permanent: true,
          has: [{ type: 'header', key: 'x-original-path', value: '/ANALYTICs' }]
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
        {
          source: '/BOARDs',
          destination: '/boards',
          permanent: true,
          has: [{ type: 'header', key: 'x-original-path', value: '/BOARDs' }]
        },
        {
          source: '/BOARds',
          destination: '/boards',
          permanent: true,
          has: [{ type: 'header', key: 'x-original-path', value: '/BOARds' }]
        },
        {
          source: '/BOArds',
          destination: '/boards',
          permanent: true,
          has: [{ type: 'header', key: 'x-original-path', value: '/BOArds' }]
        },
        {
          source: '/BOards',
          destination: '/boards',
          permanent: true,
          has: [{ type: 'header', key: 'x-original-path', value: '/BOards' }]
        },
        {
          source: '/Boards',
          destination: '/boards',
          permanent: true,
          has: [{ type: 'header', key: 'x-original-path', value: '/Boards' }]
        },
        {
          source: '/PROPOSALBUILDER',
          destination: '/proposalbuilder',
          permanent: true,
          has: [{ type: 'header', key: 'x-original-path', value: '/PROPOSALBUILDER' }]
        },
      ];
    }
  })
);

export default nextConfig;