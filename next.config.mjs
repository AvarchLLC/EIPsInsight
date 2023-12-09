// import remarkGfm from "remark-gfm";
// import remarkHighlight from "remark-highlight.js";
// import createMDX from "@next/mdx";

// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   // Configure `pageExtensions`` to include MDX files
//   pageExtensions: ["js", "jsx", "mdx", "ts", "tsx"],
//   // Optionally, add any other Next.js config below
// };

// const withMDX = createMDX({
//   // Add markdown plugins here, as desired
//   options: {
//     remarkPlugins: [remarkGfm, remarkHighlight],
//     rehypePlugins: [],
//   },
// });

// // Merge MDX config with Next.js config

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
    // reactStrictMode: true,
    trailingSlash: false,
  })
);

export default nextConfig;
// export default withMDX(nextConfig);
