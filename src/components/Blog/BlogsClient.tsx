"use client";

import { Box, Heading, Text, SimpleGrid, Flex, Icon, Badge, Avatar, Container, VStack, HStack, useColorModeValue } from '@chakra-ui/react';
import Link from 'next/link';
import { Calendar, Clock, User, ArrowRight, Tag, BookOpen, TrendingUp, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import AllLayout from '@/components/Layout';

const MotionBox = motion(Box);
const MotionFlex = motion(Flex);

interface Post {
  slug: string;
  frontmatter: {
    title: string;
    author: string;
    date: Date;
    image?: string;
    category?: string;
    avatar?: string;
    role?: string;
  };
  content: string;
}

export default function BlogsClient({ posts }: { posts: Post[] }) {
  const bgGradient = useColorModeValue(
    'linear(to-b, gray.50, white)',
    'linear(to-b, gray.900, black)'
  );

  const heroBg = useColorModeValue(
    'linear(to-br, blue.500, purple.600)',
    'linear(to-br, blue.900, purple.900)'
  );

  const cardBg = useColorModeValue('white', 'gray.800');
  const cardBorder = useColorModeValue('gray.100', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'white');
  const mutedColor = useColorModeValue('gray.500', 'gray.400');
  const hoverBorder = useColorModeValue('blue.300', 'blue.500');

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  // Convert dates properly if they are strings (sometimes nextjs serializes them)
  const safeDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <AllLayout>
      <Box minH="100vh" bgGradient={bgGradient} w="100%" overflowX="hidden" pb={12}>
        {/* Compact Hero Section */}
        <Box position="relative" overflow="hidden" bgGradient={heroBg} w="100%" borderRadius={{ base: "none", md: "0 0 2rem 2rem" }} shadow="md">
          <Box position="absolute" inset="0" opacity="0.05">
            <Box w="100%" h="100%" bgImage="repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px)" />
          </Box>
          <Container maxW="7xl" py={{ base: 8, md: 10 }} position="relative" zIndex={1}>
            <VStack spacing={4} textAlign="center">
              <Badge colorScheme="whiteAlpha" bg="whiteAlpha.200" px={3} py={1} borderRadius="full" backdropFilter="blur(5px)" border="1px solid" borderColor="whiteAlpha.300" display="flex" alignItems="center" gap={2} w="fit-content">
                <Icon as={BookOpen} w={3.5} h={3.5} color="white" /> <Text fontSize="xs" fontWeight="bold" color="white" textTransform="uppercase" letterSpacing="widest">Knowledge Hub</Text>
              </Badge>
              <Heading as="h1" fontSize={{ base: '3xl', md: '5xl' }} fontWeight="black" color="white" letterSpacing="tight">
                EIPsInsight Blog
              </Heading>
              <Text fontSize={{ base: 'md', md: 'lg' }} color="whiteAlpha.800" maxW="2xl" fontWeight="medium">
                Deep dives into Ethereum Improvement Proposals, protocol upgrades, and blockchain innovation.
              </Text>
            </VStack>
          </Container>
        </Box>

        <Container maxW="7xl" pt={8} px={{ base: 4, md: 6, lg: 8 }}>
          {/* Stats Bar */}
          <SimpleGrid columns={{ base: 2, md: 3 }} spacing={4} mb={10}>
            {[
              { icon: BookOpen, label: 'Articles', value: posts.length, color: 'blue' },
              { icon: User, label: 'Contributors', value: new Set(posts.map(p => p.frontmatter.author)).size, color: 'green' },
              { icon: Clock, label: 'Read Hours', value: Math.ceil(posts.reduce((acc, p) => acc + (p.content.split(' ').length / 200), 0)), color: 'purple' },
            ].map((stat, idx) => (
              <Flex key={idx} bg={cardBg} p={4} borderRadius="xl" shadow="sm" border="1px" borderColor={cardBorder} align="center" gap={3}>
                <Flex p={2} bg={`${stat.color}.100`} color={`${stat.color}.600`} borderRadius="lg">
                  <Icon as={stat.icon} w={5} h={5} />
                </Flex>
                <Box>
                  <Text fontSize="xl" fontWeight="bold" color={textColor} lineHeight="1">{stat.value}</Text>
                  <Text fontSize="xs" color={mutedColor} fontWeight="medium">{stat.label}</Text>
                </Box>
              </Flex>
            ))}
          </SimpleGrid>

          <MotionBox variants={containerVariants} initial="hidden" animate="show">
            {/* Featured Post */}
            {posts.length > 0 && (
              <MotionBox variants={itemVariants} mb={10}>
                <Link href={`/Blogs/${posts[0].slug}`} style={{ display: 'block' }}>
                  <Flex direction={{ base: 'column', lg: 'row' }} bg={cardBg} borderRadius="2xl" overflow="hidden" shadow="md" border="1px" borderColor={cardBorder} transition="all 0.3s" _hover={{ shadow: 'xl', borderColor: hoverBorder, transform: 'translateY(-2px)' }} role="group">
                    <Box w={{ base: '100%', lg: '50%' }} h={{ base: '48', lg: 'auto' }} position="relative" overflow="hidden">
                      {posts[0].frontmatter.image ? (
                        <Box as="img" src={posts[0].frontmatter.image} w="100%" h="100%" objectFit="cover" transition="transform 0.5s" _groupHover={{ transform: 'scale(1.05)' }} />
                      ) : (
                        <Flex w="100%" h="100%" bgGradient="linear(to-br, blue.400, purple.500)" align="center" justify="center">
                          <Icon as={Tag} w={12} h={12} color="whiteAlpha.400" />
                        </Flex>
                      )}
                      <Badge position="absolute" top={4} left={4} px={3} py={1} bg="white" color="gray.800" fontSize="xs" fontWeight="bold" borderRadius="full" shadow="sm">
                        ✨ Featured
                      </Badge>
                    </Box>
                    <Flex direction="column" justify="center" p={{ base: 6, lg: 8 }} w={{ base: '100%', lg: '50%' }}>
                      <HStack spacing={4} mb={3} fontSize="xs" color={mutedColor} fontWeight="medium" textTransform="uppercase" letterSpacing="wide">
                        <Flex align="center" gap={1.5}><Icon as={Calendar} w={3.5} h={3.5} /> {safeDate(posts[0].frontmatter.date)}</Flex>
                        <Flex align="center" gap={1.5}><Icon as={Clock} w={3.5} h={3.5} /> {Math.ceil(posts[0].content.split(' ').length / 200)} min read</Flex>
                      </HStack>
                      <Heading as="h2" fontSize={{ base: 'xl', md: '3xl' }} fontWeight="bold" color={textColor} mb={3} lineHeight="shorter" transition="color 0.2s" _groupHover={{ color: 'blue.500' }}>
                        {posts[0].frontmatter.title}
                      </Heading>
                      <Text color={mutedColor} mb={6} fontSize="sm" noOfLines={3} lineHeight="relaxed">
                        {posts[0].content.substring(0, 200)}...
                      </Text>
                      <Flex align="center" justify="space-between" mt="auto">
                        <Flex align="center" gap={3}>
                          <Avatar src={(posts[0].frontmatter as any).avatar} name={posts[0].frontmatter.author} size="sm" border="2px solid" borderColor="blue.100" />
                          <Box>
                            <Text fontSize="sm" fontWeight="semibold" color={textColor} lineHeight="1">{posts[0].frontmatter.author}</Text>
                            {(posts[0].frontmatter as any).role && <Text fontSize="xs" color={mutedColor} mt={0.5}>{(posts[0].frontmatter as any).role}</Text>}
                          </Box>
                        </Flex>
                        <Flex align="center" gap={1} color="blue.500" fontSize="sm" fontWeight="bold" transition="transform 0.2s" _groupHover={{ transform: 'translateX(4px)' }}>
                          Read <Icon as={ChevronRight} w={4} h={4} />
                        </Flex>
                      </Flex>
                    </Flex>
                  </Flex>
                </Link>
              </MotionBox>
            )}

            {/* All Posts Grid */}
            <Box mb={10}>
              <Flex align="center" gap={3} mb={6}>
                <Box w={1.5} h={6} bg="blue.500" borderRadius="full" />
                <Heading as="h3" size="lg" color={textColor} fontWeight="bold">Latest Articles</Heading>
              </Flex>
              <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} spacing={6}>
                {posts.slice(1).map((post) => (
                  <MotionBox key={post.slug} variants={itemVariants} h="100%">
                    <Link href={`/Blogs/${post.slug}`} style={{ display: 'block', height: '100%' }}>
                      <Flex direction="column" h="100%" bg={cardBg} borderRadius="xl" overflow="hidden" shadow="sm" border="1px" borderColor={cardBorder} transition="all 0.3s" _hover={{ shadow: 'md', borderColor: hoverBorder, transform: 'translateY(-2px)' }} role="group">
                        <Box h="44" position="relative" overflow="hidden" borderBottom="1px" borderColor={cardBorder}>
                          {post.frontmatter.image ? (
                            <Box as="img" src={post.frontmatter.image} w="100%" h="100%" objectFit="cover" transition="transform 0.5s" _groupHover={{ transform: 'scale(1.05)' }} />
                          ) : (
                            <Flex w="100%" h="100%" bgGradient="linear(to-br, gray.100, gray.200)" _dark={{ bgGradient: 'linear(to-br, gray.700, gray.800)' }} align="center" justify="center">
                              <Icon as={BookOpen} w={8} h={8} color="gray.400" />
                            </Flex>
                          )}
                          {(post.frontmatter as any).category && (
                            <Badge position="absolute" top={3} left={3} px={2} py={0.5} bg="whiteAlpha.900" backdropFilter="blur(4px)" color="blue.600" fontSize="2xs" fontWeight="bold" borderRadius="md" textTransform="uppercase">
                              {(post.frontmatter as any).category}
                            </Badge>
                          )}
                        </Box>
                        <Flex direction="column" p={5} flex="1">
                          <HStack spacing={3} mb={3} fontSize="xs" color={mutedColor} fontWeight="medium">
                            <Flex align="center" gap={1}><Icon as={Calendar} w={3.5} h={3.5} /> {safeDate(post.frontmatter.date)}</Flex>
                            <Flex align="center" gap={1}><Icon as={Clock} w={3.5} h={3.5} /> {Math.ceil(post.content.split(' ').length / 200)} min</Flex>
                          </HStack>
                          <Heading as="h3" fontSize="lg" fontWeight="bold" color={textColor} mb={2} lineHeight="tight" noOfLines={2} transition="color 0.2s" _groupHover={{ color: 'blue.500' }}>
                            {post.frontmatter.title}
                          </Heading>
                          <Text color={mutedColor} fontSize="sm" mb={4} noOfLines={3} flex="1">
                            {post.content.substring(0, 150)}...
                          </Text>
                          <Flex align="center" pt={4} borderTop="1px" borderColor={cardBorder} justify="space-between">
                            <Flex align="center" gap={2}>
                              <Avatar src={(post.frontmatter as any).avatar} name={post.frontmatter.author} size="xs" />
                              <Text fontSize="xs" fontWeight="semibold" color={textColor} isTruncated maxW="120px">
                                {post.frontmatter.author}
                              </Text>
                            </Flex>
                            <Icon as={ArrowRight} w={4} h={4} color="gray.300" transition="all 0.2s" _groupHover={{ color: 'blue.500', transform: 'translateX(2px)' }} />
                          </Flex>
                        </Flex>
                      </Flex>
                    </Link>
                  </MotionBox>
                ))}
              </SimpleGrid>
            </Box>
          </MotionBox>
        </Container>
      </Box>
    </AllLayout>
  );
}
