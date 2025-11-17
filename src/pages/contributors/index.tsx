import React, { useState, useEffect } from 'react';
import {
  Box, Heading, Text, Flex, Badge, VStack, HStack, Select, Button,
  useColorModeValue, Spinner, Alert, AlertIcon, Input, InputGroup,
  InputLeftElement, Link, Avatar, SimpleGrid, Card, CardBody, Icon,
  Menu, MenuButton, MenuList, MenuItem, Divider, Container, Stat,
  StatLabel, StatNumber, StatHelpText, Collapse, IconButton,
} from '@chakra-ui/react';
import { SearchIcon, ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import { FiGitCommit, FiGitPullRequest, FiMessageSquare, FiAlertCircle, FiEye, FiTrendingUp, FiUsers } from 'react-icons/fi';
import Head from 'next/head';
import NextLink from 'next/link';
import AllLayout from '@/components/Layout';
import axios from 'axios';

interface Contributor {
  username: string;
  name?: string;
  avatarUrl?: string;
  totals?: {
    commits: number;
    prsOpened: number;
    prsMerged: number;
    reviews: number;
    comments: number;
    issuesOpened: number;
    activityScore: number;
  };
  repos?: Array<{ name: string; commits: number; prs: number; reviews: number }>;
  activityStatus?: string;
  lastActivityDate?: string;
}

const ContributorsPage: React.FC = () => {
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [repoFilter, setRepoFilter] = useState('');
  const [sortBy, setSortBy] = useState('activityScore');
  const [sortOrder, setSortOrder] = useState('desc');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPrevPage, setHasPrevPage] = useState(false);
  const [showFAQ, setShowFAQ] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalContributors, setTotalContributors] = useState(0);

  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const mutedColor = useColorModeValue('gray.600', 'gray.400');

  useEffect(() => {
    fetchContributors();
  }, [page, searchQuery, repoFilter, sortBy, sortOrder]);

  const fetchContributors = async () => {
    setLoading(true);
    setError(null);
    try {
      const params: any = {
        page,
        limit: 24,
        sortBy,
        order: sortOrder,
      };

      if (searchQuery) params.search = searchQuery;
      if (repoFilter) params.repo = repoFilter;

      const response = await axios.get('/api/contributors', { params });
      
      // Handle empty or invalid response
      if (!response.data || !response.data.data) {
        setContributors([]);
        setError('No data available from the server');
        return;
      }
      
      setContributors(response.data.data || []);
      setTotalPages(response.data.pagination?.totalPages || 1);
      setHasNextPage(response.data.pagination?.hasNextPage || false);
      setHasPrevPage(response.data.pagination?.hasPrevPage || false);
      setTotalContributors(response.data.pagination?.totalCount || 0);
    } catch (error: any) {
      console.error('Failed to fetch contributors:', error);
      setError(error.response?.data?.message || 'Failed to load contributors. Please try again later.');
      setContributors([]);
    } finally {
      setLoading(false);
    }
  };

  const getActivityBadge = (status?: string) => {
    if (!status) return <Badge colorScheme="gray" fontSize="sm" px={3} py={1}>Unknown</Badge>;
    const colors: Record<string, string> = {
      Active: 'green',
      Occasional: 'yellow',
      Dormant: 'red',
    };
    return (
      <Badge 
        colorScheme={colors[status] || 'gray'} 
        fontSize="sm" 
        px={3} 
        py={1}
        borderRadius="full"
        fontWeight="semibold"
      >
        {status === 'Active' ? '🟢 Active' : status === 'Occasional' ? '🟡 Occasional' : '🔴 Dormant'}
      </Badge>
    );
  };

  const getRepoColor = (repo: string) => {
    if (repo === 'EIPs') return 'blue';
    if (repo === 'ERCs') return 'purple';
    if (repo === 'RIPs') return 'orange';
    return 'gray';
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setPage(1);
  };

  const handleRepoFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRepoFilter(e.target.value);
    setPage(1);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
    setPage(1);
  };

  const handleOrderToggle = () => {
    setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
    setPage(1);
  };

  return (
    <AllLayout>
      <Head>
        <title>Contributors - EIPs Insight</title>
        <meta name="description" content="Explore contributors to EIPs, ERCs, and RIPs" />
      </Head>

      <Box bg={bgColor} minH="100vh" py={8} px={4}>
        <Container maxW="7xl">
          {/* Header */}
          <VStack spacing={6} align="stretch" mb={8}>
            <Flex justify="space-between" align="center" wrap="wrap" gap={4}>
              <Box>
                <Heading size="2xl" mb={2} bgGradient="linear(to-r, blue.400, purple.500)" bgClip="text">
                  🌟 Contributors
                </Heading>
                <Text color={mutedColor} fontSize="lg">
                  Discover and explore contributors to Ethereum proposals
                </Text>
              </Box>
              <Link as={NextLink} href="/contributors/rankings">
                <Button colorScheme="blue" size="lg" leftIcon={<Icon as={FiTrendingUp} />}>
                  View Rankings
                </Button>
              </Link>
            </Flex>

            {/* Stats Summary */}
            {totalContributors > 0 && (
              <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                <Card bg={cardBg}>
                  <CardBody>
                    <Stat>
                      <StatLabel>
                        <Icon as={FiUsers} mr={2} color="blue.500" />
                        Total Contributors
                      </StatLabel>
                      <StatNumber>{totalContributors}</StatNumber>
                      <StatHelpText>Across all repositories</StatHelpText>
                    </Stat>
                  </CardBody>
                </Card>
                <Card bg={cardBg}>
                  <CardBody>
                    <Stat>
                      <StatLabel>Current Page</StatLabel>
                      <StatNumber>{page} of {totalPages}</StatNumber>
                      <StatHelpText>Showing {contributors.length} contributors</StatHelpText>
                    </Stat>
                  </CardBody>
                </Card>
                <Card bg={cardBg}>
                  <CardBody>
                    <Stat>
                      <StatLabel>Active Filter</StatLabel>
                      <StatNumber fontSize="lg">{repoFilter || 'All Repos'}</StatNumber>
                      <StatHelpText>Repository filter</StatHelpText>
                    </Stat>
                  </CardBody>
                </Card>
              </SimpleGrid>
            )}

            {/* FAQ Section */}
            <Card bg={cardBg} borderWidth="2px" borderColor={useColorModeValue('blue.200', 'blue.600')}>
              <CardBody>
                <Flex justify="space-between" align="center" cursor="pointer" onClick={() => setShowFAQ(!showFAQ)}>
                  <Heading size="md" color={useColorModeValue('blue.700', 'blue.300')}>
                    📚 Frequently Asked Questions
                  </Heading>
                  <IconButton
                    icon={showFAQ ? <ChevronUpIcon boxSize={5} /> : <ChevronDownIcon boxSize={5} />}
                    variant="ghost"
                    colorScheme="blue"
                    aria-label="Toggle FAQ"
                    size="sm"
                  />
                </Flex>
                <Collapse in={showFAQ} animateOpacity>
                  <VStack align="stretch" spacing={3} mt={4}>
                    <Box p={3} bg={useColorModeValue('blue.50', 'gray.700')} borderRadius="md" borderLeftWidth="3px" borderLeftColor="blue.500">
                      <Heading size="sm" mb={2}>💡 What is this page?</Heading>
                      <Text fontSize="sm" color={mutedColor}>
                        This page displays all contributors to Ethereum Improvement Proposals (EIPs), Ethereum Request for Comments (ERCs), and RollUp Improvement Proposals (RIPs). You can search, filter, and sort contributors based on their activity.
                      </Text>
                    </Box>
                    <Box p={3} bg={useColorModeValue('purple.50', 'gray.700')} borderRadius="md" borderLeftWidth="3px" borderLeftColor="purple.500">
                      <Heading size="sm" mb={2}>🔍 How do I find a specific contributor?</Heading>
                      <Text fontSize="sm" color={mutedColor}>
                        Use the search bar to find contributors by username or name. You can also filter by repository (EIPs, ERCs, RIPs) and sort by different metrics like activity score, commits, PRs, or reviews.
                      </Text>
                    </Box>
                    <Box p={3} bg={useColorModeValue('green.50', 'gray.700')} borderRadius="md" borderLeftWidth="3px" borderLeftColor="green.500">
                      <Heading size="sm" mb={2}>📊 What do the numbers mean?</Heading>
                      <Text fontSize="sm" color={mutedColor}>
                        Each contributor card shows their commits, pull requests, reviews, and comments. Click on any contributor to view their detailed profile with activity trends and repository contributions.
                      </Text>
                    </Box>
                    <Box p={3} bg={useColorModeValue('orange.50', 'gray.700')} borderRadius="md" borderLeftWidth="3px" borderLeftColor="orange.500">
                      <Heading size="sm" mb={2}>⚙️ How is the data updated?</Heading>
                      <Text fontSize="sm" color={mutedColor}>
                        The contributor data is automatically updated every 24 hours. Activity scores are calculated based on commits, pull requests, reviews, and other contributions across all repositories.
                      </Text>
                    </Box>
                  </VStack>
                </Collapse>
              </CardBody>
            </Card>

            {/* Filters */}
            <Card bg={cardBg}>
              <CardBody>
                <VStack spacing={4} align="stretch">
                  <HStack spacing={4} wrap="wrap">
                    {/* Search */}
                    <InputGroup maxW="md" flex={1}>
                      <InputLeftElement pointerEvents="none">
                        <SearchIcon color="gray.300" />
                      </InputLeftElement>
                      <Input
                        placeholder="Search by username or name..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                      />
                    </InputGroup>

                    {/* Repo Filter */}
                    <Select
                      maxW="200px"
                      value={repoFilter}
                      onChange={handleRepoFilterChange}
                    >
                      <option value="">All Repositories</option>
                      <option value="EIPs">EIPs</option>
                      <option value="ERCs">ERCs</option>
                      <option value="RIPs">RIPs</option>
                    </Select>

                    {/* Sort */}
                    <Select maxW="200px" value={sortBy} onChange={handleSortChange}>
                      <option value="activityScore">Activity Score</option>
                      <option value="commits">Commits</option>
                      <option value="prs">Pull Requests</option>
                      <option value="reviews">Reviews</option>
                    </Select>

                    {/* Order Toggle */}
                    <Button onClick={handleOrderToggle}>
                      {sortOrder === 'desc' ? '↓ Desc' : '↑ Asc'}
                    </Button>
                  </HStack>
                </VStack>
              </CardBody>
            </Card>
          </VStack>

          {/* Loading State */}
          {loading && (
            <Flex justify="center" align="center" minH="400px">
              <Spinner size="xl" />
            </Flex>
          )}

          {/* Contributors Grid */}
          {!loading && contributors.length > 0 && (
            <>
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} spacing={6}>
                {contributors.map((contributor) => (
                  <Link
                    key={contributor.username}
                    as={NextLink}
                    href={`/contributors/${contributor.username}`}
                    _hover={{ textDecoration: 'none' }}
                  >
                    <Card
                      bg={cardBg}
                      borderWidth="2px"
                      borderColor="transparent"
                      _hover={{
                        transform: 'translateY(-8px)',
                        shadow: 'xl',
                        borderColor: 'blue.400',
                        bgGradient: useColorModeValue(
                          'linear(to-br, blue.50, purple.50)',
                          'linear(to-br, gray.700, gray.800)'
                        ),
                      }}
                      transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                      h="full"
                      position="relative"
                      overflow="hidden"
                    >
                      {/* Gradient Overlay on Hover */}
                      <Box
                        position="absolute"
                        top="0"
                        left="0"
                        right="0"
                        height="4px"
                        bgGradient="linear(to-r, blue.400, purple.500)"
                        opacity={0}
                        _groupHover={{ opacity: 1 }}
                        transition="opacity 0.3s"
                      />
                      <CardBody pt={6}>
                        <VStack spacing={4} align="stretch">
                          <Flex align="center" justify="space-between">
                            <Box position="relative">
                              <Avatar
                                src={contributor.avatarUrl}
                                name={contributor.username}
                                size="xl"
                                borderWidth="3px"
                                borderColor={useColorModeValue('white', 'gray.700')}
                                shadow="md"
                              />
                              {/* Activity Score Badge */}
                              {contributor.totals?.activityScore && contributor.totals.activityScore > 0 && (
                                <Badge
                                  position="absolute"
                                  bottom="-2"
                                  right="-2"
                                  colorScheme="yellow"
                                  borderRadius="full"
                                  px={2}
                                  fontSize="xs"
                                  fontWeight="bold"
                                >
                                  {contributor.totals.activityScore}
                                </Badge>
                              )}
                            </Box>
                            {getActivityBadge(contributor.activityStatus)}
                          </Flex>

                          <Box>
                            <Text fontWeight="bold" fontSize="xl" noOfLines={1} mb={1}>
                              {contributor.name || contributor.username}
                            </Text>
                            <Text color={mutedColor} fontSize="sm" noOfLines={1}>
                              @{contributor.username}
                            </Text>
                          </Box>

                          <Divider borderColor={useColorModeValue('gray.300', 'gray.600')} />

                          <SimpleGrid columns={2} spacing={3}>
                            <Box
                              p={3}
                              borderRadius="md"
                              bg={useColorModeValue('purple.50', 'purple.900')}
                              borderWidth="1px"
                              borderColor={useColorModeValue('purple.200', 'purple.700')}
                            >
                              <VStack spacing={1}>
                                <Icon as={FiGitCommit} color="purple.500" boxSize={5} />
                                <Text fontSize="xs" color={mutedColor}>Commits</Text>
                                <Text fontWeight="bold" fontSize="lg" color="purple.600">
                                  {contributor.totals?.commits || 0}
                                </Text>
                              </VStack>
                            </Box>

                            <Box
                              p={3}
                              borderRadius="md"
                              bg={useColorModeValue('blue.50', 'blue.900')}
                              borderWidth="1px"
                              borderColor={useColorModeValue('blue.200', 'blue.700')}
                            >
                              <VStack spacing={1}>
                                <Icon as={FiGitPullRequest} color="blue.500" boxSize={5} />
                                <Text fontSize="xs" color={mutedColor}>PRs</Text>
                                <Text fontWeight="bold" fontSize="lg" color="blue.600">
                                  {contributor.totals?.prsOpened || 0}
                                </Text>
                              </VStack>
                            </Box>

                            <Box
                              p={3}
                              borderRadius="md"
                              bg={useColorModeValue('green.50', 'green.900')}
                              borderWidth="1px"
                              borderColor={useColorModeValue('green.200', 'green.700')}
                            >
                              <VStack spacing={1}>
                                <Icon as={FiEye} color="green.500" boxSize={5} />
                                <Text fontSize="xs" color={mutedColor}>Reviews</Text>
                                <Text fontWeight="bold" fontSize="lg" color="green.600">
                                  {contributor.totals?.reviews || 0}
                                </Text>
                              </VStack>
                            </Box>

                            <Box
                              p={3}
                              borderRadius="md"
                              bg={useColorModeValue('orange.50', 'orange.900')}
                              borderWidth="1px"
                              borderColor={useColorModeValue('orange.200', 'orange.700')}
                            >
                              <VStack spacing={1}>
                                <Icon as={FiMessageSquare} color="orange.500" boxSize={5} />
                                <Text fontSize="xs" color={mutedColor}>Comments</Text>
                                <Text fontWeight="bold" fontSize="lg" color="orange.600">
                                  {contributor.totals?.comments || 0}
                                </Text>
                              </VStack>
                            </Box>
                          </SimpleGrid>

                          {contributor.repos && contributor.repos.length > 0 && (
                            <>
                              <Divider borderColor={useColorModeValue('gray.300', 'gray.600')} />
                              <HStack spacing={2} wrap="wrap" justify="center">
                                {contributor.repos.map((repo) => (
                                  <Badge 
                                    key={repo.name} 
                                    colorScheme={getRepoColor(repo.name)}
                                    fontSize="xs"
                                    px={2}
                                    py={1}
                                    borderRadius="md"
                                    fontWeight="semibold"
                                  >
                                    {repo.name}
                                  </Badge>
                                ))}
                              </HStack>
                            </>
                          )}
                        </VStack>
                      </CardBody>
                    </Card>
                  </Link>
                ))}
              </SimpleGrid>

              {/* Pagination */}
              <Flex justify="center" align="center" gap={4} mt={8}>
                <Button
                  onClick={() => setPage(page - 1)}
                  isDisabled={!hasPrevPage}
                >
                  Previous
                </Button>
                <Text>
                  Page {page} of {totalPages}
                </Text>
                <Button
                  onClick={() => setPage(page + 1)}
                  isDisabled={!hasNextPage}
                >
                  Next
                </Button>
              </Flex>
            </>
          )}

          {/* Error State */}
          {!loading && error && (
            <Alert status="error" borderRadius="md" mb={4}>
              <AlertIcon />
              <Box flex="1">
                <Text fontWeight="bold">Error Loading Contributors</Text>
                <Text fontSize="sm">{error}</Text>
              </Box>
              <Button size="sm" onClick={fetchContributors} colorScheme="red" variant="outline">
                Retry
              </Button>
            </Alert>
          )}

          {/* Empty State */}
          {!loading && !error && contributors.length === 0 && (
            <Card bg={cardBg} p={8} textAlign="center">
              <CardBody>
                <Icon as={FiUsers} boxSize={16} color={mutedColor} mb={4} />
                <Heading size="lg" mb={2} color={mutedColor}>No Contributors Found</Heading>
                <Text color={mutedColor} mb={4}>
                  {searchQuery || repoFilter
                    ? 'Try adjusting your search or filter criteria'
                    : 'No contributor data available at the moment'}
                </Text>
                {(searchQuery || repoFilter) && (
                  <Button
                    onClick={() => {
                      setSearchQuery('');
                      setRepoFilter('');
                      setPage(1);
                    }}
                    colorScheme="blue"
                  >
                    Clear Filters
                  </Button>
                )}
              </CardBody>
            </Card>
          )}
        </Container>
      </Box>
    </AllLayout>
  );
};

export default ContributorsPage;
