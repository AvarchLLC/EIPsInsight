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

const getCoreProps = (props: any) =>
  props['data-sourcepos'] ? { 'data-sourcepos': props['data-sourcepos'] } : {};

export default function MarkdownRenderer({ markdown }: { markdown: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
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
        a: ({ href = '', children }) => (
          <ChakraLink as={NextLink} href={href} color="blue.500" isExternal>
            {children}
          </ChakraLink>
        ),
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
        h1: ({ children, ...props }) => (
          <Heading my={4} as="h1" size="2xl" {...getCoreProps(props)}>
            {children}
          </Heading>
        ),
        h2: ({ children, ...props }) => (
          <Heading my={4} as="h2" size="xl" {...getCoreProps(props)}>
            {children}
          </Heading>
        ),
        h3: ({ children, ...props }) => (
          <Heading my={4} as="h3" size="lg" {...getCoreProps(props)}>
            {children}
          </Heading>
        ),
        h4: ({ children, ...props }) => (
          <Heading my={4} as="h4" size="md" {...getCoreProps(props)}>
            {children}
          </Heading>
        ),
        h5: ({ children, ...props }) => (
          <Heading my={4} as="h5" size="sm" {...getCoreProps(props)}>
            {children}
          </Heading>
        ),
        h6: ({ children, ...props }) => (
          <Heading my={4} as="h6" size="xs" {...getCoreProps(props)}>
            {children}
          </Heading>
        ),
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
