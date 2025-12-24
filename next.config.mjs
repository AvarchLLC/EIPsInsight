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

    images: {
      domains: ['hackmd.io', 'etherworld.co'],
      unoptimized: true, // Required for Chakra UI Image components with static assets
      remotePatterns: [
        {
          protocol: 'https',
          hostname: '**',
        },
      ],
    },

    webpack: (config, { isServer }) => {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
        ignored: ['**/node_modules', '**/.git', '**/.next'],
      };
      return config;
    },

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
      ];
    }
  })
);

export default nextConfig;