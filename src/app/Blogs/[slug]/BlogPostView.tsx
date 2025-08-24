"use client";
import {
  Box, Button, Flex, Image as ChakraImage, useColorModeValue,
  Avatar, Text, VStack, HStack, IconButton, UnorderedList, ListItem
} from '@chakra-ui/react';
import Link from 'next/link';
import { ArrowLeftIcon } from 'lucide-react';
import { FaTwitter, FaLinkedin, FaGithub, FaRegHeart, FaRegLightbulb, FaRegSmile } from 'react-icons/fa';
import BorderedImage from '@/components/BorderImage';
import { ScrollToHashOnLoad } from '@/components/ScrollToHashOnLoad';
import MarkdownRenderer from '@/components/MarkdownRenderer';

function AuthorBio({ frontmatter }: { frontmatter: any }) {
  return (
    <Box
      display={{ base: 'none', lg: 'flex' }}
      flexDirection="column"
      alignItems="center"
      borderWidth="1px"
      borderRadius="lg"
      p={4}
      mb={6}
      boxShadow="md"
      width="100%"
      bg={useColorModeValue('white', 'gray.800')}
    >
      <Avatar src={frontmatter.authorAvatar} size="xl" mb={2} name={frontmatter.author} />
      <Text fontWeight="bold" mt={2}>{frontmatter.author}</Text>
      {frontmatter.authorTitle && (
        <Text fontSize="sm" color="gray.500">{frontmatter.authorTitle}</Text>
      )}
      <HStack spacing={3} mt={2}>
        {frontmatter.authorTwitter && (
          <Link href={frontmatter.authorTwitter} target="_blank"><FaTwitter /></Link>
        )}
        {frontmatter.authorLinkedin && (
          <Link href={frontmatter.authorLinkedin} target="_blank"><FaLinkedin /></Link>
        )}
        {frontmatter.authorGithub && (
          <Link href={frontmatter.authorGithub} target="_blank"><FaGithub /></Link>
        )}
      </HStack>
      {frontmatter.authorBio && (
        <Text mt={2} fontSize="sm" textAlign="center" color="gray.600">{frontmatter.authorBio}</Text>
      )}
    </Box>
  );
}

function TableOfContents({ headings }: { headings: Array<{ text: string, id: string, depth: number }> }) {
  if (!headings || headings.length === 0) return null;
  return (
    <Box borderWidth="1px" borderRadius="lg" p={4} mb={4} bg={useColorModeValue('white', 'gray.800')}>
      <Text fontWeight="semibold" mb={2}>Table of Contents</Text>
      <UnorderedList spacing={1}>
        {headings.map(({ text, id, depth }) =>
          <ListItem key={id} ml={depth * 2}>
            <a href={`#${id}`} className="hover:underline">{text}</a>
          </ListItem>
        )}
      </UnorderedList>
    </Box>
  );
}

function StickySummary({ summaryPoints }: { summaryPoints: string[] }) {
  if (!summaryPoints?.length) return null;
  return (
    <Box
      position="sticky"
      top="100px"
      alignSelf="flex-start"
      p={4}
      borderWidth="1px"
      borderRadius="lg"
      bg={useColorModeValue('white', 'gray.800')}
      boxShadow="sm"
      minWidth="250px"
      maxWidth="300px"
      mb={8}
    >
      <Text fontWeight="bold" fontSize="lg" mb={2}>Quick Summary</Text>
      <UnorderedList fontSize="sm" spacing={1}>
        {summaryPoints.map((point, i) => <ListItem key={i}>{point}</ListItem>)}
      </UnorderedList>
    </Box>
  );
}

function ReactionsBar() {
  // Handle state as needed (out of scope here)
  return (
    <HStack spacing={2} mt={8} mb={2}>
      <IconButton aria-label="Like" icon={<FaRegHeart />} variant="ghost" size="md" />
      <IconButton aria-label="Insight" icon={<FaRegLightbulb />} variant="ghost" size="md" />
      <IconButton aria-label="Smile" icon={<FaRegSmile />} variant="ghost" size="md" />
      <Box flex="1" />
      <Button as="a"
        leftIcon={<FaTwitter />} href="#" // Build a share url
        variant="outline" size="sm">
        Share
      </Button>
    </HStack>
  );
}

export default function BlogPostView({
  frontmatter,
  content,
  headings,
  summaryPoints,
}: {
  frontmatter: any,
  content: string,
  headings: Array<{ text: string, id: string, depth: number }>,
  summaryPoints: string[]
}) {
  const borderColor = useColorModeValue('teal.400', 'teal.600');
  const bg = useColorModeValue('gray.50', 'gray.900');
  const mainTextColor = useColorModeValue('gray.800', 'gray.200');
  const headingTextColor = useColorModeValue('gray.900', 'gray.100');
  const subTextColor = useColorModeValue('gray.500', 'gray.400');

  return (

    <Box minH="100vh" bg={bg} width="100vw" overflowX="hidden">
      <Flex
        width="100vw"
        minH="100vh"
        align="flex-start"
        gap={8}
        px={{ base: 0, sm: 0, md: 6, lg: 12, xl: 24 }}
        py={{ base: 0, md: 10 }}
      >
        {/* Left Sidebar */}
        <Box
          as="aside"
          display={{ base: "none", lg: "block" }}
          w="260px"
          flexShrink={0}
          height="100vh"
          position="sticky"
          top="0"
        >
          <AuthorBio frontmatter={frontmatter} />
          <TableOfContents headings={headings} />
        </Box>

        {/* Main content */}
        <Box as="main" flex="1" minW={0} maxW="900px" mx="auto" py={8}>
          <Link href="/resources" className="flex items-center gap-1 font-medium mb-4" style={{ color: useColorModeValue('#319795', '#81e6d9') }}>
            <ArrowLeftIcon className="w-4 h-4" />
            <span className="text-sm">Back to all blogs</span>
          </Link>
          {frontmatter.image && (
            <BorderedImage src={frontmatter.image} alt={frontmatter.title} borderColor={borderColor} />
          )}
          <article>
            <header>
              <h1
                style={{
                  color: headingTextColor,
                  fontSize: '2rem',
                  fontWeight: 600,
                  marginBottom: '0.25rem'
                }}
              >
                {frontmatter.title}
              </h1>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  gap: '0.5rem',
                  fontSize: '0.95rem',
                  color: subTextColor,
                  marginTop: '0.25rem',
                  marginBottom: '1.5rem'
                }}
              >
                <span>
                  By <span style={{ fontWeight: 500, color: mainTextColor }}>{frontmatter.author}</span>
                </span>
                <span>&#8226;</span>
                <span>{frontmatter.date?.toLocaleDateString?.() ?? frontmatter.date}</span>
              </div>
            </header>
            <ScrollToHashOnLoad />
            <section
              style={{
                color: mainTextColor,
                fontSize: '1.15rem',
                lineHeight: '1.8',
                marginBottom: '2rem'
              }}
            >
              <MarkdownRenderer markdown={content} />
            </section>
          </article>
          <ReactionsBar />
        </Box>

        {/* Right sticky summary (XL and up) */}
        <Box
          as="aside"
          display={{ base: 'none', xl: 'block' }}
          w="300px"
          flexShrink={0}
          height="100vh"
          position="sticky"
          top="0"
        >
          <StickySummary summaryPoints={summaryPoints} />
        </Box>
      </Flex>
    </Box>
  );
}