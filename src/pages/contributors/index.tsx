import React, { useState, useEffect } from 'react';
import {
  Box, Heading, Text, Flex, Badge, VStack, HStack, Select, Button,
  useColorModeValue, Spinner, Alert, AlertIcon, Input, InputGroup,
  InputLeftElement, Link, Avatar, SimpleGrid, Card, CardBody, Icon,
  Menu, MenuButton, MenuList, MenuItem, Divider,
} from '@chakra-ui/react';
import { SearchIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { FiGitCommit, FiGitPullRequest, FiMessageSquare, FiAlertCircle, FiEye } from 'react-icons/fi';
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

  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const mutedColor = useColorModeValue('gray.600', 'gray.400');

  useEffect(() => {
    fetchContributors();
  }, [page, searchQuery, repoFilter, sortBy, sortOrder]);

  const fetchContributors = async () => {
    setLoading(true);
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
      setContributors(response.data.data);
      setTotalPages(response.data.pagination.totalPages);
      setHasNextPage(response.data.pagination.hasNextPage);
      setHasPrevPage(response.data.pagination.hasPrevPage);
    } catch (error) {
      console.error('Failed to fetch contributors:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActivityBadge = (status?: string) => {
    if (!status) return <Badge colorScheme="gray">Unknown</Badge>;
    const colors: Record<string, string> = {
      Active: 'green',
      Occasional: 'yellow',
      Dormant: 'red',
    };
    return <Badge colorScheme={colors[status] || 'gray'}>{status}</Badge>;
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
        <Box maxW="7xl" mx="auto">
          {/* Header */}
          <VStack spacing={6} align="stretch" mb={8}>
            <Flex justify="space-between" align="center" wrap="wrap" gap={4}>
              <Box>
                <Heading size="xl" mb={2}>Contributors</Heading>
                <Text color={mutedColor}>
                  Discover and explore contributors to Ethereum proposals
                </Text>
              </Box>
              <Link as={NextLink} href="/contributors/rankings">
                <Button colorScheme="blue" size="lg">
                  View Rankings
                </Button>
              </Link>
            </Flex>

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
                      borderWidth="1px"
                      borderColor={borderColor}
                      _hover={{
                        transform: 'translateY(-4px)',
                        shadow: 'lg',
                        borderColor: 'blue.400',
                      }}
                      transition="all 0.2s"
                      h="full"
                    >
                      <CardBody>
                        <VStack spacing={4} align="stretch">
                          <Flex align="center" justify="space-between">
                            <Avatar
                              src={contributor.avatarUrl}
                              name={contributor.username}
                              size="lg"
                            />
                            {getActivityBadge(contributor.activityStatus)}
                          </Flex>

                          <Box>
                            <Text fontWeight="bold" fontSize="lg" noOfLines={1}>
                              {contributor.name || contributor.username}
                            </Text>
                            <Text color={mutedColor} fontSize="sm" noOfLines={1}>
                              @{contributor.username}
                            </Text>
                          </Box>

                          <Divider />

                          <VStack spacing={2} align="stretch">
                            <HStack justify="space-between">
                              <HStack>
                                <Icon as={FiGitCommit} color="purple.500" />
                                <Text fontSize="sm">Commits</Text>
                              </HStack>
                              <Link
                                as={NextLink}
                                href={`/contributors/${contributor.username}/commits?period=all`}
                                fontWeight="bold"
                                color="blue.500"
                                _hover={{ textDecoration: 'underline' }}
                              >
                                {contributor.totals?.commits || 0}
                              </Link>
                            </HStack>

                            <HStack justify="space-between">
                              <HStack>
                                <Icon as={FiGitPullRequest} color="blue.500" />
                                <Text fontSize="sm">PRs</Text>
                              </HStack>
                              <Link
                                as={NextLink}
                                href={`/contributors/${contributor.username}/prs?period=all`}
                                fontWeight="bold"
                                color="blue.500"
                                _hover={{ textDecoration: 'underline' }}
                              >
                                {contributor.totals?.prsOpened || 0}
                              </Link>
                            </HStack>

                            <HStack justify="space-between">
                              <HStack>
                                <Icon as={FiEye} color="green.500" />
                                <Text fontSize="sm">Reviews</Text>
                              </HStack>
                              <Link
                                as={NextLink}
                                href={`/contributors/${contributor.username}/reviews?period=all`}
                                fontWeight="bold"
                                color="blue.500"
                                _hover={{ textDecoration: 'underline' }}
                              >
                                {contributor.totals?.reviews || 0}
                              </Link>
                            </HStack>

                            <HStack justify="space-between">
                              <HStack>
                                <Icon as={FiMessageSquare} color="orange.500" />
                                <Text fontSize="sm">Comments</Text>
                              </HStack>
                              <Link
                                as={NextLink}
                                href={`/contributors/${contributor.username}/comments?period=all`}
                                fontWeight="bold"
                                color="blue.500"
                                _hover={{ textDecoration: 'underline' }}
                              >
                                {contributor.totals?.comments || 0}
                              </Link>
                            </HStack>
                          </VStack>

                          {contributor.repos && contributor.repos.length > 0 && (
                            <Flex gap={1} wrap="wrap">
                              {contributor.repos.map((repo) => (
                                <Badge key={repo.name} colorScheme="blue" fontSize="xs">
                                  {repo.name}
                                </Badge>
                              ))}
                            </Flex>
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

          {/* Empty State */}
          {!loading && contributors.length === 0 && (
            <Alert status="info">
              <AlertIcon />
              No contributors found. Try adjusting your filters.
            </Alert>
          )}
        </Box>
      </Box>
    </AllLayout>
  );
};

export default ContributorsPage;
