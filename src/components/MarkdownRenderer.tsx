'use client';

import {
  Heading,
  Text,
  Link as ChakraLink,
  Code,
  Divider,
  Image as ChakraImage,
  UnorderedList,
  OrderedList,
  ListItem,
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Td,
  Th,
} from '@chakra-ui/react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { CodeBlock } from './Codehelper'; // adjust if needed
import NextLink from 'next/link';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import { ReactNode } from 'react';
// import { Heading } from '@chakra-ui/react';
import slugify from 'slugify';

type HeadingProps = {
  children: ReactNode[];
};

// Modify the createHeadingRenderer function in your MarkdownRenderer
const normalizeId = (text: string) => {
  return text
    .toLowerCase()
    .replace(/&/g, 'and')     // Replace "&" with "and"
    .replace(/\?/g, '')       // Remove "?"
    .replace(/\s+/g, '-')     // Spaces to hyphens
    .replace(/[^\w-]/g, '')   // Remove non-word chars
    .replace(/-+/g, '-')      // Collapse multiple hyphens
    .replace(/^-|-$/g, '');    // Trim hyphens
};

const createHeadingRenderer = (level: number) => {
  return ({ children }: HeadingProps) => {
    const text = children
      .map((child: any) => (typeof child === 'string' ? child : child.props?.children || ''))
      .join('');
    
    const id = normalizeId(text);

    return (
      <Heading
        as={`h${level}` as any}
        id={id}
        size={['2xl', 'xl', 'lg', 'md', 'sm', 'xs'][level - 1]}
        my={4}
        scrollMarginTop="100px"
      >
        {children}
      </Heading>
    );
  };
};




const getCoreProps = (props: any) =>
  props['data-sourcepos'] ? { 'data-sourcepos': props['data-sourcepos'] } : {};

export default function MarkdownRenderer({ markdown }: { markdown: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw, rehypeSanitize]}
      components={{
        p: ({ children }) => <Text mb={2}>{children}</Text>,
        em: ({ children }) => <Text as="em">{children}</Text>,
        del: ({ children }) => <Text as="del">{children}</Text>,
        blockquote: ({ children }) => (
          <Code as="blockquote" p={2} rounded="lg">
            {children}
          </Code>
        ),
        code: ({ children, className }) => {
          const isMultiLine = String(children).includes('\n');

          if (!isMultiLine) {
            return (
              <Code mt={1} p={1} rounded="lg">
                {children}
              </Code>
            );
          }

          const match = /language-(\w+)/.exec(className || '');
          const language = match ? match[1] : 'javascript';

          return (
            <Box
              position="relative"
              w={{ base: '100%', sm: '600px', md: '800px', lg: '1000px', xl: '1200px' }}
              maxW="100%"
              overflowX="auto"
              borderRadius="lg"
              p={5}
              mx="auto"
              textAlign="left"
            >
              <CodeBlock language={language}>{String(children)}</CodeBlock>
            </Box>
          );
        },
        hr: () => <Divider my={4} />,
        // a: ({ href = '', children }) => {
        //   const isHashLink = href.startsWith('#');

        //   if (isHashLink) {
        //     return (
        //       <ChakraLink href={href} color="blue.400">
        //         {children}
        //       </ChakraLink>
        //     );
        //   }

        //   return (
        //     <ChakraLink as={NextLink} href={href} color="blue.500" isExternal>
        //       {children}
        //     </ChakraLink>
        //   );
        // },
        a: ({ href = '', children }) => {
          if (href.startsWith('#')) {
            const normalizedHref = '#' + normalizeId(href.slice(1));
            return (
              <ChakraLink 
                href={normalizedHref}
                color="blue.400"
                onClick={(e) => {
                  e.preventDefault();
                  const element = document.getElementById(normalizedHref.slice(1));
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    window.history.pushState(null, '', normalizedHref);
                  }
                }}
              >
                {children}
              </ChakraLink>
            );
          }
          // ... rest of your external link handling
        },
        img: ({ src = '', alt = '' }) => (
          <ChakraImage src={src} alt={alt} my={4} mx="auto" />
        ),
        ul: ({ children, ...props }) => (
          <UnorderedList spacing={2} pl={4} {...getCoreProps(props)}>
            {children}
          </UnorderedList>
        ),
        ol: ({ children, ...props }) => (
          <OrderedList spacing={2} pl={4} {...getCoreProps(props)}>
            {children}
          </OrderedList>
        ),
        li: ({ children, ...props }) => (
          <ListItem {...getCoreProps(props)}>{children}</ListItem>
        ),
         h1: createHeadingRenderer(1),
        h2: createHeadingRenderer(2),
        h3: createHeadingRenderer(3),
        h4: createHeadingRenderer(4),
        h5: createHeadingRenderer(5),
        h6: createHeadingRenderer(6),
        table: ({ children }) => (
          <Box overflowX="auto" my={4}>
            <Table variant="simple" border="1px solid" borderColor="gray.200">
              {children}
            </Table>
          </Box>
        ),
        thead: ({ children }) => (
          <Thead borderBottom="2px solid" borderColor="gray.500">
            {children}
          </Thead>
        ),
        tbody: Tbody,
        tr: ({ children }) => (
          <Tr borderBottom="1px solid" borderColor="gray.300">
            {children}
          </Tr>
        ),
        td: ({ children }) => (
          <Td border="1px solid" borderColor="gray.300" p={3}>
            {children}
          </Td>
        ),
        th: ({ children }) => (
          <Th border="1px solid" borderColor="gray.300" p={3}>
            {children}
          </Th>
        ),
      }}
    >
      {markdown}
    </ReactMarkdown>
  );
}
