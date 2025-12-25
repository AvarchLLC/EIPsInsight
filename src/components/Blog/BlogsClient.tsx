"use client";

import { Box, Heading, Text, SimpleGrid, Flex, Icon, Badge, Avatar, Container, VStack, HStack, useColorModeValue } from '@chakra-ui/react';
import Link from 'next/link';
import { Calendar, Clock, User, ArrowRight, Tag, BookOpen, TrendingUp } from 'lucide-react';
import AllLayout from '@/components/Layout';

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
    'linear(to-br, gray.50, blue.50, purple.50)',
    'linear(to-br, gray.900, gray.800, gray.900)'
  );
  
  const heroBg = useColorModeValue(
    'linear(to-br, blue.600, purple.600, indigo.700)',
    'linear(to-br, blue.900, purple.900, indigo.900)'
  );

  const cardBg = useColorModeValue('white', 'gray.800');
  const cardBorder = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.900', 'white');
  const mutedColor = useColorModeValue('gray.600', 'gray.400');
  const hoverBorder = useColorModeValue('blue.300', 'blue.600');

  return (
    <AllLayout>
    <Box minH="100vh" bgGradient={bgGradient} w="100%" overflowX="hidden">
      {/* Hero Section */}
      <Box position="relative" overflow="hidden" bgGradient={heroBg} w="100%">
        <Box position="absolute" inset="0" opacity="0.1">
          <Box
            w="100%"
            h="100%"
            bgImage="repeating-linear-gradient(0deg, transparent, transparent 19px, rgba(255,255,255,0.1) 19px, rgba(255,255,255,0.1) 20px)"
          />
        </Box>
        <Container maxW="7xl" py={{ base: 8, md: 16 }} position="relative">
          <VStack spacing={4} textAlign="center">
            <Flex
              align="center"
              gap={2}
              px={4}
              py={2}
              bg="whiteAlpha.200"
              backdropFilter="blur(10px)"
              borderRadius="full"
              border="1px solid"
              borderColor="whiteAlpha.300"
            >
              <Icon as={BookOpen} w={4} h={4} color={useColorModeValue('blue.600', 'white')} />
              <Text fontSize="sm" fontWeight="medium" color={useColorModeValue('blue.600', 'white')}>
                Knowledge Hub
              </Text>
            </Flex>
            
            <Heading
              as="h1"
              fontSize={{ base: '4xl', md: '6xl', lg: '7xl' }}
              fontWeight="extrabold"
              color={useColorModeValue('gray.900', 'white')}
              letterSpacing="tight"
            >
              EIPsInsight{' '}
              <Box as="span" bgGradient="linear(to-r, yellow.300, orange.300)" bgClip="text">
                Blog
              </Box>
            </Heading>
            
            <Text
              fontSize={{ base: 'lg', md: 'xl', lg: '2xl' }}
              color={useColorModeValue('gray.700', 'blue.100')}
              maxW="3xl"
              fontWeight="light"
            >
              Deep dives into Ethereum Improvement Proposals, protocol upgrades, and blockchain innovation
            </Text>
            
            <HStack spacing={6} color={useColorModeValue('gray.600', 'whiteAlpha.800')} mt={4}>
              <Flex align="center" gap={2}>
                <Icon as={TrendingUp} w={5} h={5} />
                <Text fontSize="sm" fontWeight="medium">Expert Insights</Text>
              </Flex>
              <Box w="1" h="1" bg="whiteAlpha.500" borderRadius="full" />
              <Flex align="center" gap={2}>
                <Icon as={Tag} w={5} h={5} />
                <Text fontSize="sm" fontWeight="medium">Technical Deep Dives</Text>
              </Flex>
            </HStack>
          </VStack>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxW="full" py={8} px={{ base: 4, md: 6, lg: 8 }}>
        {/* Stats Bar */}
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} mb={8}>
          <Box
            bg={cardBg}
            borderRadius="2xl"
            p={6}
            shadow="lg"
            border="1px"
            borderColor={useColorModeValue('blue.100', 'blue.800')}
            transition="all 0.3s"
            _hover={{ shadow: '2xl', transform: 'scale(1.05)' }}
          >
            <Flex align="center" gap={4}>
              <Flex
                p={3}
                bgGradient="linear(to-br, blue.500, indigo.600)"
                borderRadius="xl"
                shadow="lg"
              >
                <Icon as={Tag} w={6} h={6} color={useColorModeValue('white', 'white')} />
              </Flex>
              <Box>
                <Text fontSize="3xl" fontWeight="bold" bgGradient="linear(to-r, blue.600, indigo.600)" bgClip="text">
                  {posts.length}
                </Text>
                <Text fontSize="sm" color={mutedColor} fontWeight="medium">
                  Total Articles
                </Text>
              </Box>
            </Flex>
          </Box>

          <Box
            bg={cardBg}
            borderRadius="2xl"
            p={6}
            shadow="lg"
            border="1px"
            borderColor={useColorModeValue('green.100', 'green.800')}
            transition="all 0.3s"
            _hover={{ shadow: '2xl', transform: 'scale(1.05)' }}
          >
            <Flex align="center" gap={4}>
              <Flex
                p={3}
                bgGradient="linear(to-br, green.500, emerald.600)"
                borderRadius="xl"
                shadow="lg"
              >
                <Icon as={User} w={6} h={6} color={useColorModeValue('white', 'white')} />
              </Flex>
              <Box>
                <Text fontSize="3xl" fontWeight="bold" bgGradient="linear(to-r, green.600, emerald.600)" bgClip="text">
                  {new Set(posts.map(p => p.frontmatter.author)).size}
                </Text>
                <Text fontSize="sm" color={mutedColor} fontWeight="medium">
                  Contributors
                </Text>
              </Box>
            </Flex>
          </Box>

          <Box
            bg={cardBg}
            borderRadius="2xl"
            p={6}
            shadow="lg"
            border="1px"
            borderColor={useColorModeValue('purple.100', 'purple.800')}
            transition="all 0.3s"
            _hover={{ shadow: '2xl', transform: 'scale(1.05)' }}
          >
            <Flex align="center" gap={4}>
              <Flex
                p={3}
                bgGradient="linear(to-br, purple.500, pink.600)"
                borderRadius="xl"
                shadow="lg"
              >
                <Icon as={Clock} w={6} h={6} color={useColorModeValue('white', 'white')} />
              </Flex>
              <Box>
                <Text fontSize="3xl" fontWeight="bold" bgGradient="linear(to-r, purple.600, pink.600)" bgClip="text">
                  {Math.ceil(posts.reduce((acc, p) => acc + (p.content.split(' ').length / 200), 0))}
                </Text>
                <Text fontSize="sm" color={mutedColor} fontWeight="medium">
                  Hours of Content
                </Text>
              </Box>
            </Flex>
          </Box>
        </SimpleGrid>

        {/* Featured Post */}
        {posts.length > 0 && (
          <Box mb={8}>
            <Flex align="center" gap={3} mb={6}>
              <Box
                w="1.5"
                h="10"
                bgGradient="linear(to-b, blue.600, indigo.600, purple.600)"
                borderRadius="full"
                shadow="lg"
              />
              <Heading as="h2" size="xl" color={textColor}>
                Featured Article
              </Heading>
            </Flex>
            
            <Link href={`/Blogs/${posts[0].slug}`} style={{ display: 'block' }}>
              <Box
                bg={cardBg}
                borderRadius="3xl"
                overflow="hidden"
                shadow="2xl"
                border="1px"
                borderColor={cardBorder}
                transition="all 0.5s"
                _hover={{
                  shadow: '2xl',
                  transform: 'translateY(-12px)',
                  borderColor: hoverBorder,
                }}
              >
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={0}>
                  <Box position="relative" h={{ base: '80', md: 'auto' }} overflow="hidden">
                    {posts[0].frontmatter.image ? (
                      <Box
                        as="img"
                        src={posts[0].frontmatter.image}
                        alt={posts[0].frontmatter.title}
                        w="100%"
                        h="100%"
                        objectFit="cover"
                        transition="transform 0.5s"
                        _groupHover={{ transform: 'scale(1.1)' }}
                      />
                    ) : (
                      <Flex
                        w="100%"
                        h="100%"
                        bgGradient="linear(to-br, blue.500, indigo.600)"
                        align="center"
                        justify="center"
                      >
                        <Icon as={Tag} w={24} h={24} color="whiteAlpha.200" />
                      </Flex>
                    )}
                    <Badge
                      position="absolute"
                      top={4}
                      left={4}
                      px={5}
                      py={2.5}
                      bgGradient="linear(to-r, yellow.400, orange.500)"
                      color="white"
                      fontSize="sm"
                      fontWeight="bold"
                      borderRadius="full"
                      shadow="lg"
                    >
                      <Flex align="center" gap={2}>
                        <Box w="2" h="2" bg="white" borderRadius="full" animation="pulse 2s infinite" />
                        Featured
                      </Flex>
                    </Badge>
                  </Box>
                  
                  <Box p={{ base: 6, md: 8 }} display="flex" flexDirection="column" justifyContent="center">
                    <HStack spacing={3} mb={3} fontSize="sm" color={mutedColor}>
                      <Flex align="center" gap={2}>
                        <Icon as={Calendar} w={4} h={4} />
                        <Text>
                          {posts[0].frontmatter.date.toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </Text>
                      </Flex>
                      <Flex align="center" gap={2}>
                        <Icon as={Clock} w={4} h={4} />
                        <Text>{Math.ceil(posts[0].content.split(' ').length / 200)} min read</Text>
                      </Flex>
                    </HStack>
                    
                    <Heading
                      as="h2"
                      fontSize={{ base: '2xl', md: '3xl', lg: '4xl' }}
                      fontWeight="bold"
                      color={textColor}
                      mb={3}
                      transition="color 0.3s"
                      _groupHover={{ color: useColorModeValue('blue.600', 'blue.400') }}
                    >
                      {posts[0].frontmatter.title}
                    </Heading>
                    
                    <Text color={mutedColor} mb={4} fontSize="lg" noOfLines={3}>
                      {posts[0].content.substring(0, 200)}...
                    </Text>
                    
                    <Flex align="center" gap={3}>
                      <Flex align="center" gap={2}>
                        {(posts[0].frontmatter as any).avatar ? (
                          <Avatar
                            src={(posts[0].frontmatter as any).avatar}
                            name={posts[0].frontmatter.author}
                            size="md"
                            border="2px"
                            borderColor="blue.500"
                          />
                        ) : (
                          <Avatar
                            name={posts[0].frontmatter.author}
                            size="md"
                            bg="linear-gradient(to bottom right, var(--chakra-colors-blue-500), var(--chakra-colors-indigo-600))"
                            color="white"
                          />
                        )}
                        <Box>
                          <Text fontWeight="semibold" color={textColor}>
                            {posts[0].frontmatter.author}
                          </Text>
                          {(posts[0].frontmatter as any).role && (
                            <Text fontSize="sm" color={mutedColor}>
                              {(posts[0].frontmatter as any).role}
                            </Text>
                          )}
                        </Box>
                      </Flex>
                      <Flex ml="auto" align="center" gap={2} color={useColorModeValue('blue.600', 'blue.400')} fontWeight="semibold">
                        Read More <Icon as={ArrowRight} w={5} h={5} />
                      </Flex>
                    </Flex>
                  </Box>
                </SimpleGrid>
              </Box>
            </Link>
          </Box>
        )}

        {/* All Posts Grid */}
        <Box mt={8}>
          <Flex align="center" gap={2} mb={4}>
            <Box
              w="1.5"
              h="10"
              bgGradient="linear(to-b, blue.600, indigo.600, purple.600)"
              borderRadius="full"
              shadow="lg"
            />
            <Heading as="h2" size="xl" color={textColor}>
              All Articles
            </Heading>
          </Flex>
          
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
            {posts.slice(1).map((post) => (
              <Link key={post.slug} href={`/Blogs/${post.slug}`} style={{ display: 'block', height: '100%' }}>
                <Box
                  h="100%"
                  bg={cardBg}
                  borderRadius="2xl"
                  overflow="hidden"
                  shadow="lg"
                  border="1px"
                  borderColor={cardBorder}
                  transition="all 0.3s"
                  display="flex"
                  flexDirection="column"
                  _hover={{
                    shadow: '2xl',
                    transform: 'translateY(-8px)',
                    borderColor: hoverBorder,
                  }}
                >
                  <Box position="relative" h="56" overflow="hidden">
                    {post.frontmatter.image ? (
                      <Box
                        as="img"
                        src={post.frontmatter.image}
                        alt={post.frontmatter.title}
                        w="100%"
                        h="100%"
                        objectFit="cover"
                        transition="transform 0.5s"
                        _groupHover={{ transform: 'scale(1.1)' }}
                      />
                    ) : (
                      <Flex
                        w="100%"
                        h="100%"
                        bgGradient="linear(to-br, blue.500, indigo.600)"
                        align="center"
                        justify="center"
                      >
                        <Icon as={Tag} w={16} h={16} color="whiteAlpha.200" />
                      </Flex>
                    )}
                    {(post.frontmatter as any).category && (
                      <Badge
                        position="absolute"
                        top={3}
                        left={3}
                        px={3}
                        py={1}
                        bg={useColorModeValue('whiteAlpha.900', 'blackAlpha.900')}
                        backdropFilter="blur(10px)"
                        color={useColorModeValue('blue.600', 'blue.400')}
                        fontSize="xs"
                        fontWeight="semibold"
                        borderRadius="full"
                      >
                        {(post.frontmatter as any).category}
                      </Badge>
                    )}
                  </Box>
                  
                  <Box p={4} flex="1" display="flex" flexDirection="column">
                    <HStack spacing={2} mb={2} fontSize="sm" color={mutedColor}>
                      <Flex align="center" gap={1}>
                        <Icon as={Calendar} w={4} h={4} />
                        <Text>
                          {post.frontmatter.date.toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </Text>
                      </Flex>
                      <Text>•</Text>
                      <Flex align="center" gap={1}>
                        <Icon as={Clock} w={4} h={4} />
                        <Text>{Math.ceil(post.content.split(' ').length / 200)} min</Text>
                      </Flex>
                    </HStack>
                    
                    <Heading
                      as="h3"
                      size="md"
                      fontWeight="bold"
                      color={textColor}
                      mb={2}
                      transition="color 0.3s"
                      noOfLines={2}
                      _groupHover={{ color: useColorModeValue('blue.600', 'blue.400') }}
                    >
                      {post.frontmatter.title}
                    </Heading>
                    
                    <Text color={mutedColor} mb={3} flex="1" noOfLines={3}>
                      {post.content.substring(0, 150)}...
                    </Text>
                    
                    <Flex align="center" gap={2} pt={2} borderTop="1px" borderColor={cardBorder}>
                      {(post.frontmatter as any).avatar ? (
                        <Avatar
                          src={(post.frontmatter as any).avatar}
                          name={post.frontmatter.author}
                          size="sm"
                          border="2px"
                          borderColor="blue.500"
                        />
                      ) : (
                        <Avatar
                          name={post.frontmatter.author}
                          size="sm"
                          bg="linear-gradient(to bottom right, var(--chakra-colors-blue-500), var(--chakra-colors-indigo-600))"
                          color="white"
                        />
                      )}
                      <Box flex="1" minW="0">
                        <Text fontWeight="semibold" color={textColor} isTruncated>
                          {post.frontmatter.author}
                        </Text>
                        {(post.frontmatter as any).role && (
                          <Text fontSize={{ base: 'sm', md: 'md' }} color={mutedColor} mb={2} noOfLines={3}>
                            {(post.frontmatter as any).role}
                          </Text>
                        )}
                      </Box>
                      <Icon as={ArrowRight} w={5} h={5} color={useColorModeValue('blue.600', 'blue.400')} />
                    </Flex>
                  </Box>
                </Box>
              </Link>
            ))}
          </SimpleGrid>
        </Box>

        {/* CTA Section */}
        <Box
          mt={12}
          position="relative"
          overflow="hidden"
          bgGradient={heroBg}
          borderRadius="3xl"
          p={8}
          textAlign="center"
          shadow="2xl"
        >
          <Box position="absolute" inset="0" opacity="0.1">
            <Box
              w="100%"
              h="100%"
              bgImage="repeating-linear-gradient(0deg, transparent, transparent 19px, rgba(255,255,255,0.1) 19px, rgba(255,255,255,0.1) 20px)"
            />
          </Box>
          <Box position="relative" zIndex="10">
            <Heading as="h2" fontSize={{ base: '2xl', md: '4xl' }} fontWeight="bold" color="white" mb={4}>
              Want to Contribute?
            </Heading>
            <Text fontSize="xl" color="blue.100" mb={8} maxW="2xl" mx="auto">
              Share your insights about Ethereum Improvement Proposals with the community
            </Text>
            <Link href="/contact">
              <Flex
                as="button"
                display="inline-flex"
                align="center"
                gap={2}
                bg="white"
                color="blue.600"
                px={8}
                py={4}
                borderRadius="full"
                fontWeight="bold"
                shadow="lg"
                transition="all 0.3s"
                _hover={{ bg: 'blue.50', shadow: 'xl', transform: 'scale(1.05)' }}
              >
                Get in Touch <Icon as={ArrowRight} w={5} h={5} />
              </Flex>
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
    </AllLayout>
  );
}
