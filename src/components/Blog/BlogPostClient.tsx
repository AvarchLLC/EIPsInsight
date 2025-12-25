"use client";

import { Box, Container, Heading, Text, Flex, Icon, Badge, Avatar, VStack, HStack, useColorModeValue, Divider, Image as ChakraImage } from '@chakra-ui/react';
import Link from 'next/link';
import { ArrowLeft, Clock, Calendar, Tag as TagIcon } from 'lucide-react';
import { FaTwitter, FaLinkedin, FaGithub } from 'react-icons/fa';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import { ScrollToHashOnLoad } from '@/components/ScrollToHashOnLoad';
import dynamic from 'next/dynamic';
import AllLayout from '@/components/Layout';

const EngagementBar = dynamic(() => import('@/components/Blog/EngagementBar'), { ssr: false });
const CommentsSection = dynamic(() => import('@/components/Blog/CommentsSection'), { ssr: false });

interface BlogPostClientProps {
  slug: string;
  frontmatter: any;
  content: string;
}

export default function BlogPostClient({ slug, frontmatter, content }: BlogPostClientProps) {
  const bgGradient = useColorModeValue(
    'linear(to-br, gray.50, blue.50, purple.50)',
    'linear(to-br, gray.900, gray.800, gray.900)'
  );
  
  const cardBg = useColorModeValue('white', 'gray.800');
  const cardBorder = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.900', 'white');
  const mutedColor = useColorModeValue('gray.600', 'gray.400');
  const linkColor = useColorModeValue('blue.600', 'blue.400');
  const dividerColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <AllLayout>
    <Box minH="100vh" bgGradient={bgGradient} w="100%" overflowX="hidden">
      <Container maxW="full" py={8} px={{ base: 2, sm: 4, md: 6 }}>
        {/* Back Button */}
        <Link href='/Blogs'>
          <Flex
            as="button"
            align="center"
            gap={2}
            color={linkColor}
            fontWeight="medium"
            mb={8}
            transition="all 0.2s"
            _hover={{ gap: 3 }}
          >
            <Icon as={ArrowLeft} w={4} h={4} />
            <Text>Back to all blogs</Text>
          </Flex>
        </Link>

        {/* Featured Image */}
        {frontmatter.image && (
          <Flex justify="center" mb={8}>
            <Box
              overflow="hidden"
              borderRadius="2xl"
              shadow="2xl"
              border="4px"
              borderColor={useColorModeValue('blue.100', 'blue.900')}
              maxW={{ base: '100%', sm: '80%', md: '60%', lg: '50%' }}
            >
              <ChakraImage
                src={frontmatter.image}
                alt={frontmatter.title}
                w="100%"
                h="auto"
                objectFit="cover"
              />
            </Box>
          </Flex>
        )}

        {/* Main Article Card */}
        <Box
          bg={cardBg}
          borderRadius="3xl"
          shadow="xl"
          border="1px"
          borderColor={cardBorder}
          p={{ base: 6, sm: 8, md: 12 }}
        >
          {/* Category Badge */}
          {frontmatter.category && (
            <Badge
              mb={6}
              px={4}
              py={2}
              bgGradient="linear(to-r, blue.500, indigo.600)"
              color="white"
              fontSize="sm"
              fontWeight="bold"
              borderRadius="full"
              shadow="lg"
              display="inline-flex"
              alignItems="center"
              gap={2}
            >
              <Icon as={TagIcon} w={4} h={4} />
              {frontmatter.category}
            </Badge>
          )}

          {/* Title */}
          <Heading
            as="h1"
            fontSize={{ base: '3xl', sm: '4xl', md: '5xl', lg: '6xl' }}
            fontWeight="extrabold"
            mb={6}
            bgGradient={useColorModeValue(
              'linear(to-r, gray.900, gray.700)',
              'linear(to-r, white, gray.300)'
            )}
            bgClip="text"
            lineHeight="tight"
          >
            {frontmatter.title}
          </Heading>

          {/* Meta Info Bar */}
          <HStack spacing={4} mb={6} fontSize="sm" color={mutedColor} flexWrap="wrap">
            <Flex align="center" gap={2}>
              <Icon as={Calendar} w={4} h={4} />
              <Text>
                {frontmatter.date.toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </Text>
            </Flex>
            <Text color={useColorModeValue('gray.300', 'gray.600')}>•</Text>
            <Flex align="center" gap={2}>
              <Icon as={Clock} w={4} h={4} />
              <Text>5 min read</Text>
            </Flex>
          </HStack>

          {/* Author Info */}
          <Box mb={8} pb={8} borderBottom="2px" borderColor={dividerColor}>
            <Flex align="center" gap={4} mb={4}>
              {frontmatter.authorAvatar || frontmatter.avatar ? (
                <Avatar
                  src={frontmatter.authorAvatar || frontmatter.avatar}
                  name={frontmatter.author}
                  size="lg"
                  border="4px"
                  borderColor="blue.500"
                  shadow="lg"
                />
              ) : (
                <Avatar
                  name={frontmatter.author}
                  size="lg"
                  bg="linear-gradient(to bottom right, var(--chakra-colors-blue-500), var(--chakra-colors-purple-600))"
                  color="white"
                  fontWeight="bold"
                  shadow="lg"
                />
              )}
              <Box flex="1">
                <Text fontWeight="bold" fontSize="xl" color={textColor}>
                  {frontmatter.author}
                </Text>
                {(frontmatter.authorBio || frontmatter.role) && (
                  <Text fontSize="sm" color={mutedColor} mt={1} noOfLines={2}>
                    {frontmatter.authorBio || frontmatter.role}
                  </Text>
                )}
              </Box>
            </Flex>

            {/* Social Links */}
            {(frontmatter.authorTwitter || frontmatter.authorLinkedin || frontmatter.authorGithub) && (
              <HStack spacing={3} mt={4} flexWrap="wrap">
                {frontmatter.authorTwitter && (
                  <Link href={frontmatter.authorTwitter} target="_blank" rel="noopener noreferrer">
                    <Flex
                      as="button"
                      align="center"
                      gap={2}
                      px={4}
                      py={2}
                      bgGradient="linear(to-r, blue.500, blue.600)"
                      color="white"
                      borderRadius="full"
                      fontSize="sm"
                      fontWeight="semibold"
                      shadow="md"
                      transition="all 0.3s"
                      _hover={{
                        bgGradient: 'linear(to-r, blue.600, blue.700)',
                        shadow: 'lg',
                        transform: 'scale(1.05)',
                      }}
                    >
                      <Icon as={FaTwitter} w={4} h={4} />
                      <Text>Twitter</Text>
                    </Flex>
                  </Link>
                )}
                {frontmatter.authorLinkedin && (
                  <Link href={frontmatter.authorLinkedin} target="_blank" rel="noopener noreferrer">
                    <Flex
                      as="button"
                      align="center"
                      gap={2}
                      px={4}
                      py={2}
                      bgGradient="linear(to-r, blue.700, blue.800)"
                      color="white"
                      borderRadius="full"
                      fontSize="sm"
                      fontWeight="semibold"
                      shadow="md"
                      transition="all 0.3s"
                      _hover={{
                        bgGradient: 'linear(to-r, blue.800, blue.900)',
                        shadow: 'lg',
                        transform: 'scale(1.05)',
                      }}
                    >
                      <Icon as={FaLinkedin} w={4} h={4} />
                      <Text>LinkedIn</Text>
                    </Flex>
                  </Link>
                )}
                {frontmatter.authorGithub && (
                  <Link href={frontmatter.authorGithub} target="_blank" rel="noopener noreferrer">
                    <Flex
                      as="button"
                      align="center"
                      gap={2}
                      px={4}
                      py={2}
                      bgGradient="linear(to-r, gray.700, gray.800)"
                      color="white"
                      borderRadius="full"
                      fontSize="sm"
                      fontWeight="semibold"
                      shadow="md"
                      transition="all 0.3s"
                      _hover={{
                        bgGradient: 'linear(to-r, gray.800, gray.900)',
                        shadow: 'lg',
                        transform: 'scale(1.05)',
                      }}
                    >
                      <Icon as={FaGithub} w={4} h={4} />
                      <Text>GitHub</Text>
                    </Flex>
                  </Link>
                )}
              </HStack>
            )}
          </Box>

          {/* Tags */}
          {frontmatter.tags && frontmatter.tags.length > 0 && (
            <HStack spacing={2} mb={8} flexWrap="wrap">
              {frontmatter.tags.map((tag: string, index: number) => (
                <Badge
                  key={index}
                  px={4}
                  py={2}
                  bg={useColorModeValue('gray.100', 'gray.700')}
                  color={useColorModeValue('gray.700', 'gray.300')}
                  fontSize="sm"
                  fontWeight="medium"
                  borderRadius="full"
                  border="1px"
                  borderColor={useColorModeValue('gray.300', 'gray.600')}
                  transition="all 0.2s"
                  _hover={{
                    borderColor: useColorModeValue('blue.400', 'blue.500'),
                  }}
                >
                  #{tag}
                </Badge>
              ))}
            </HStack>
          )}

          {/* Engagement Bar */}
          <Box
            mb={8}
            p={4}
            bgGradient={useColorModeValue(
              'linear(to-r, blue.50, indigo.50)',
              'linear(to-r, gray.900, gray.800)'
            )}
            borderRadius="xl"
            border="1px"
            borderColor={useColorModeValue('blue.200', 'gray.700')}
          >
            <EngagementBar slug={slug} userId={undefined} />
          </Box>

          <ScrollToHashOnLoad />

          {/* Article Content */}
          <Box
            className="prose prose-lg dark:prose-invert max-w-none"
            sx={{
              '& h1, & h2, & h3, & h4, & h5, & h6': {
                fontWeight: 'bold',
                color: textColor,
              },
              '& p': {
                color: useColorModeValue('gray.700', 'gray.300'),
              },
              '& a': {
                color: linkColor,
              },
              '& strong': {
                color: textColor,
              },
              '& code': {
                color: linkColor,
              },
            }}
          >
            <MarkdownRenderer markdown={content} />
          </Box>

          {/* Comments Section */}
          <Box mt={16} pt={8} borderTop="2px" borderColor={dividerColor}>
            <Flex align="center" gap={3} mb={6}>
              <Box
                w="1.5"
                h="8"
                bgGradient="linear(to-b, blue.600, indigo.600, purple.600)"
                borderRadius="full"
                shadow="lg"
              />
              <Heading as="h2" size="lg" color={textColor}>
                Comments
              </Heading>
            </Flex>
            <CommentsSection blogSlug={slug} userId={undefined} isAdmin={false} />
          </Box>
        </Box>
      </Container>
    </Box>
    </AllLayout>
  );
}
