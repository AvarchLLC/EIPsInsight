import React, { useState, useEffect } from 'react';
import {
  Box, Heading, Text, Flex, Badge, VStack, HStack, Select, Button,
  useColorModeValue, Spinner, Alert, AlertIcon, Avatar, SimpleGrid,
  Card, CardBody, CardHeader, Icon, Tabs, TabList, Tab, TabPanels,
  TabPanel, Table, Thead, Tbody, Tr, Th, Td, Link,
} from '@chakra-ui/react';
import {
  FiAward, FiGitCommit, FiGitPullRequest, FiMessageSquare,
  FiAlertCircle, FiEye, FiTrendingUp,
} from 'react-icons/fi';
import Head from 'next/head';
import NextLink from 'next/link';
import AllLayout from '@/components/Layout';
import axios from 'axios';

interface RankingItem {
  rank: number;
  username: string;
  name?: string;
  avatarUrl?: string;
  score?: number;
  commits?: number;
  prs?: number;
  prsOpened?: number;
  prsMerged?: number;
  reviews?: number;
  comments?: number;
  issues?: number;
  activityStatus?: string;
  totals?: any;
  avgResponseTime?: string;
}

interface Rankings {
  overall: RankingItem[];
  commits: RankingItem[];
  prs: RankingItem[];
  reviews: RankingItem[];
  comments: RankingItem[];
  issues: RankingItem[];
  eips: RankingItem[];
  ercs: RankingItem[];
  rips: RankingItem[];
}

const RankingsPage: React.FC = () => {
  const [rankings, setRankings] = useState<Rankings | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<'all' | 'weekly' | 'monthly'>('all');
  const [activeMode, setActiveMode] = useState<keyof Rankings>('overall');
  const [error, setError] = useState<string | null>(null);

  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const mutedColor = useColorModeValue('gray.600', 'gray.400');

  useEffect(() => {
    fetchRankings();
  }, [period]);

  const fetchRankings = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('/api/rankings', {
        params: { period, limit: 100 },
      });
      
      if (!response.data || !response.data.rankings) {
        setError('No ranking data available');
        setRankings(null);
        return;
      }
      
      setRankings(response.data.rankings);
    } catch (error: any) {
      console.error('Failed to fetch rankings:', error);
      setError(error.response?.data?.message || 'Failed to load rankings data');
      setRankings(null);
    } finally {
      setLoading(false);
    }
  };

  const getMedalIcon = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return null;
  };

  const getRankColor = (rank: number) => {
    if (rank === 1) return 'yellow.500';
    if (rank === 2) return 'gray.400';
    if (rank === 3) return 'orange.500';
    return mutedColor;
  };

  const renderRankingTable = (data: RankingItem[], mode: string) => {
    console.log(`[Frontend] Rendering ${mode} table with ${data?.length || 0} items`);
    if (data && data.length > 0) {
      console.log(`[Frontend] Sample ${mode} item:`, data[0]);
    } else {
      console.log(`[Frontend] No data for ${mode}!`);
    }
    
    if (!data || data.length === 0) {
      return (
        <Alert status="info">
          <AlertIcon />
          No data available for this ranking mode.
        </Alert>
      );
    }

    return (
      <Card bg={cardBg}>
        <CardBody overflowX="auto">
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Rank</Th>
                <Th>Contributor</Th>
                {mode === 'overall' && (
                  <>
                    <Th isNumeric>Score</Th>
                    <Th isNumeric>Commits</Th>
                    <Th isNumeric>PRs</Th>
                    <Th isNumeric>Reviews</Th>
                  </>
                )}
                {mode === 'commits' && <Th isNumeric>Commits</Th>}
                {mode === 'prs' && (
                  <>
                    <Th isNumeric>PRs Opened</Th>
                    <Th isNumeric>PRs Merged</Th>
                  </>
                )}
                {mode === 'reviews' && (
                  <>
                    <Th isNumeric>Reviews</Th>
                    <Th>Avg Response</Th>
                  </>
                )}
                {mode === 'comments' && <Th isNumeric>Comments</Th>}
                {mode === 'issues' && <Th isNumeric>Issues</Th>}
                {(mode === 'eips' || mode === 'ercs' || mode === 'rips') && (
                  <>
                    <Th isNumeric>Commits</Th>
                    <Th isNumeric>PRs</Th>
                    <Th isNumeric>Reviews</Th>
                  </>
                )}
                <Th>Status</Th>
              </Tr>
            </Thead>
            <Tbody>
              {data.map((item) => (
                <Tr
                  key={item.username}
                  _hover={{ bg: useColorModeValue('gray.50', 'gray.700') }}
                >
                  <Td>
                    <HStack>
                      <Text
                        fontSize="xl"
                        fontWeight="bold"
                        color={getRankColor(item.rank)}
                      >
                        {getMedalIcon(item.rank) || `#${item.rank}`}
                      </Text>
                    </HStack>
                  </Td>
                  <Td>
                    <Link as={NextLink} href={`/contributors/${item.username}`}>
                      <HStack>
                        <Avatar
                          src={item.avatarUrl}
                          name={item.username}
                          size="sm"
                        />
                        <VStack align="start" spacing={0}>
                          <Text fontWeight="bold">
                            {item.name || item.username}
                          </Text>
                          <Text fontSize="xs" color={mutedColor}>
                            @{item.username}
                          </Text>
                        </VStack>
                      </HStack>
                    </Link>
                  </Td>

                  {mode === 'overall' && (
                    <>
                      <Td isNumeric fontWeight="bold">{item.score}</Td>
                      <Td isNumeric>
                        <Link
                          as={NextLink}
                          href={`/contributors/${item.username}/commits?period=${period}`}
                          color="blue.500"
                          _hover={{ textDecoration: 'underline' }}
                        >
                          {item.totals?.commits || 0}
                        </Link>
                      </Td>
                      <Td isNumeric>
                        <Link
                          as={NextLink}
                          href={`/contributors/${item.username}/prs?period=${period}`}
                          color="blue.500"
                          _hover={{ textDecoration: 'underline' }}
                        >
                          {item.totals?.prsOpened || 0}
                        </Link>
                      </Td>
                      <Td isNumeric>
                        <Link
                          as={NextLink}
                          href={`/contributors/${item.username}/reviews?period=${period}`}
                          color="blue.500"
                          _hover={{ textDecoration: 'underline' }}
                        >
                          {item.totals?.reviews || 0}
                        </Link>
                      </Td>
                    </>
                  )}

                  {mode === 'commits' && (
                    <Td isNumeric>
                      <Link
                        as={NextLink}
                        href={`/contributors/${item.username}/commits?period=${period}`}
                        color="blue.500"
                        fontWeight="semibold"
                        _hover={{ textDecoration: 'underline' }}
                      >
                        {item.commits || 0}
                      </Link>
                    </Td>
                  )}

                  {mode === 'prs' && (
                    <>
                      <Td isNumeric>
                        <Link
                          as={NextLink}
                          href={`/contributors/${item.username}/prs?period=${period}`}
                          color="blue.500"
                          fontWeight="semibold"
                          _hover={{ textDecoration: 'underline' }}
                        >
                          {item.prsOpened || item.prs || 0}
                        </Link>
                      </Td>
                      <Td isNumeric>{item.prsMerged || 0}</Td>
                    </>
                  )}

                  {mode === 'reviews' && (
                    <>
                      <Td isNumeric>
                        <Link
                          as={NextLink}
                          href={`/contributors/${item.username}/reviews?period=${period}`}
                          color="blue.500"
                          fontWeight="semibold"
                          _hover={{ textDecoration: 'underline' }}
                        >
                          {item.reviews || 0}
                        </Link>
                      </Td>
                      <Td>{item.avgResponseTime || 'N/A'}</Td>
                    </>
                  )}

                  {mode === 'comments' && (
                    <Td isNumeric>
                      <Link
                        as={NextLink}
                        href={`/contributors/${item.username}/comments?period=${period}`}
                        color="blue.500"
                        fontWeight="semibold"
                        _hover={{ textDecoration: 'underline' }}
                      >
                        {item.comments || 0}
                      </Link>
                    </Td>
                  )}

                  {mode === 'issues' && (
                    <Td isNumeric>
                      <Link
                        as={NextLink}
                        href={`/contributors/${item.username}/issues?period=${period}`}
                        color="blue.500"
                        fontWeight="semibold"
                        _hover={{ textDecoration: 'underline' }}
                      >
                        {item.issues || 0}
                      </Link>
                    </Td>
                  )}

                  {(mode === 'eips' || mode === 'ercs' || mode === 'rips') && (
                    <>
                      <Td isNumeric>
                        <Link
                          as={NextLink}
                          href={`/contributors/${item.username}/commits?repo=${mode.toUpperCase()}&period=${period}`}
                          color="blue.500"
                          _hover={{ textDecoration: 'underline' }}
                        >
                          {item.commits || 0}
                        </Link>
                      </Td>
                      <Td isNumeric>
                        <Link
                          as={NextLink}
                          href={`/contributors/${item.username}/prs?repo=${mode.toUpperCase()}&period=${period}`}
                          color="blue.500"
                          _hover={{ textDecoration: 'underline' }}
                        >
                          {item.prs || item.prsOpened || 0}
                        </Link>
                      </Td>
                      <Td isNumeric>
                        <Link
                          as={NextLink}
                          href={`/contributors/${item.username}/reviews?repo=${mode.toUpperCase()}&period=${period}`}
                          color="blue.500"
                          _hover={{ textDecoration: 'underline' }}
                        >
                          {item.reviews || 0}
                        </Link>
                      </Td>
                    </>
                  )}

                  <Td>
                    {item.activityStatus && (
                      <Badge
                        colorScheme={
                          item.activityStatus === 'Active'
                            ? 'green'
                            : item.activityStatus === 'Occasional'
                            ? 'yellow'
                            : 'red'
                        }
                      >
                        {item.activityStatus}
                      </Badge>
                    )}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </CardBody>
      </Card>
    );
  };

  const renderTopCards = (data: RankingItem[], mode: string) => {
    const top3 = data?.slice(0, 3) || [];
    if (top3.length === 0) return null;

    return (
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={6}>
        {top3.map((item, index) => (
          <Link
            key={item.username}
            as={NextLink}
            href={`/contributors/${item.username}`}
            _hover={{ textDecoration: 'none' }}
          >
            <Card
              bg={cardBg}
              borderWidth="2px"
              borderColor={
                index === 0
                  ? 'yellow.400'
                  : index === 1
                  ? 'gray.400'
                  : 'orange.400'
              }
              _hover={{
                transform: 'translateY(-4px)',
                shadow: 'xl',
              }}
              transition="all 0.2s"
              h="full"
            >
              <CardBody>
                <VStack spacing={4}>
                  <Text fontSize="4xl">{getMedalIcon(item.rank)}</Text>
                  <Avatar
                    src={item.avatarUrl}
                    name={item.username}
                    size="xl"
                  />
                  <VStack spacing={1}>
                    <Text fontWeight="bold" fontSize="xl">
                      {item.name || item.username}
                    </Text>
                    <Text color={mutedColor} fontSize="sm">
                      @{item.username}
                    </Text>
                  </VStack>

                  {mode === 'overall' && item.score && (
                    <Badge colorScheme="blue" fontSize="lg" px={3} py={1}>
                      Score: {item.score}
                    </Badge>
                  )}
                  {mode === 'commits' && item.commits && (
                    <Badge colorScheme="purple" fontSize="lg" px={3} py={1}>
                      {item.commits} commits
                    </Badge>
                  )}
                  {mode === 'prs' && item.prsOpened && (
                    <Badge colorScheme="blue" fontSize="lg" px={3} py={1}>
                      {item.prsOpened} PRs
                    </Badge>
                  )}
                  {mode === 'reviews' && item.reviews && (
                    <Badge colorScheme="green" fontSize="lg" px={3} py={1}>
                      {item.reviews} reviews
                    </Badge>
                  )}
                  {mode === 'comments' && item.comments && (
                    <Badge colorScheme="orange" fontSize="lg" px={3} py={1}>
                      {item.comments} comments
                    </Badge>
                  )}
                  {mode === 'issues' && item.issues && (
                    <Badge colorScheme="red" fontSize="lg" px={3} py={1}>
                      {item.issues} issues
                    </Badge>
                  )}

                  {item.activityStatus && (
                    <Badge
                      colorScheme={
                        item.activityStatus === 'Active'
                          ? 'green'
                          : item.activityStatus === 'Occasional'
                          ? 'yellow'
                          : 'red'
                      }
                    >
                      {item.activityStatus}
                    </Badge>
                  )}
                </VStack>
              </CardBody>
            </Card>
          </Link>
        ))}
      </SimpleGrid>
    );
  };

  return (
    <AllLayout>
      <Head>
        <title>Rankings - Contributors</title>
        <meta name="description" content="Top contributors rankings" />
      </Head>

      <Box bg={bgColor} minH="100vh" py={8} px={4}>
        <Box maxW="7xl" mx="auto">
          {/* Header */}
          <VStack spacing={6} align="stretch" mb={8}>
            <Card bg={cardBg} overflow="hidden">
              <CardHeader bgGradient="linear(to-r, yellow.500, orange.600)" py={8}>
                <Flex justify="space-between" align="center" wrap="wrap" gap={4}>
                  <VStack align="flex-start" spacing={2}>
                    <Heading size="2xl" color="white">
                      🏆 Contributor Rankings
                    </Heading>
                    <Text color="whiteAlpha.900" fontSize="lg">
                      Discover top contributors across all categories
                    </Text>
                  </VStack>

                  <HStack>
                    <Select
                      value={period}
                      onChange={(e) => setPeriod(e.target.value as any)}
                      maxW="250px"
                      size="lg"
                      bg="whiteAlpha.300"
                      color="white"
                      borderColor="whiteAlpha.400"
                      _hover={{ bg: 'whiteAlpha.400' }}
                    >
                      <option value="all" style={{ color: 'black' }}>⌛ All Time</option>
                      <option value="monthly" style={{ color: 'black' }}>📅 Monthly</option>
                      <option value="weekly" style={{ color: 'black' }}>📆 Weekly</option>
                    </Select>
                    <Link as={NextLink} href="/contributors">
                      <Button colorScheme="whiteAlpha" size="lg" variant="solid">
                        View All Contributors
                      </Button>
                    </Link>
                  </HStack>
                </Flex>
              </CardHeader>
            </Card>
          </VStack>

          {/* Loading State */}
          {loading && (
            <Flex justify="center" align="center" minH="400px">
              <VStack spacing={4}>
                <Spinner size="xl" thickness="4px" speed="0.65s" color="blue.500" />
                <Text color={mutedColor} fontSize="lg">Loading rankings...</Text>
              </VStack>
            </Flex>
          )}

          {/* Error State */}
          {!loading && error && (
            <Alert status="error" borderRadius="md">
              <AlertIcon />
              <Box flex="1">
                <Text fontWeight="bold">Error Loading Rankings</Text>
                <Text fontSize="sm">{error}</Text>
              </Box>
              <Button size="sm" onClick={fetchRankings} colorScheme="red" variant="outline">
                Retry
              </Button>
            </Alert>
          )}

          {/* Rankings Tabs */}
          {!loading && rankings && (
            <Tabs
              colorScheme="blue"
              onChange={(index) => {
                const modes: (keyof Rankings)[] = [
                  'overall',
                  'commits',
                  'prs',
                  'reviews',
                  'comments',
                  'issues',
                  'eips',
                  'ercs',
                  'rips',
                ];
                setActiveMode(modes[index]);
              }}
            >
              <TabList overflowX="auto" overflowY="hidden">
                <Tab>
                  <Icon as={FiTrendingUp} mr={2} />
                  Overall
                </Tab>
                <Tab>
                  <Icon as={FiGitCommit} mr={2} />
                  Commits
                </Tab>
                <Tab>
                  <Icon as={FiGitPullRequest} mr={2} />
                  Pull Requests
                </Tab>
                <Tab>
                  <Icon as={FiEye} mr={2} />
                  Reviews
                </Tab>
                <Tab>
                  <Icon as={FiMessageSquare} mr={2} />
                  Comments
                </Tab>
                <Tab>
                  <Icon as={FiAlertCircle} mr={2} />
                  Issues
                </Tab>
                <Tab>📜 EIPs</Tab>
                <Tab>🎨 ERCs</Tab>
                <Tab>⚡ RIPs</Tab>
              </TabList>

              <TabPanels>
                <TabPanel>
                  {renderTopCards(rankings.overall, 'overall')}
                  {renderRankingTable(rankings.overall, 'overall')}
                </TabPanel>
                <TabPanel>
                  {renderTopCards(rankings.commits, 'commits')}
                  {renderRankingTable(rankings.commits, 'commits')}
                </TabPanel>
                <TabPanel>
                  {renderTopCards(rankings.prs, 'prs')}
                  {renderRankingTable(rankings.prs, 'prs')}
                </TabPanel>
                <TabPanel>
                  {renderTopCards(rankings.reviews, 'reviews')}
                  {renderRankingTable(rankings.reviews, 'reviews')}
                </TabPanel>
                <TabPanel>
                  {renderTopCards(rankings.comments, 'comments')}
                  {renderRankingTable(rankings.comments, 'comments')}
                </TabPanel>
                <TabPanel>
                  {renderTopCards(rankings.issues, 'issues')}
                  {renderRankingTable(rankings.issues, 'issues')}
                </TabPanel>
                <TabPanel>
                  {renderTopCards(rankings.eips, 'eips')}
                  {renderRankingTable(rankings.eips, 'eips')}
                </TabPanel>
                <TabPanel>
                  {renderTopCards(rankings.ercs, 'ercs')}
                  {renderRankingTable(rankings.ercs, 'ercs')}
                </TabPanel>
                <TabPanel>
                  {renderTopCards(rankings.rips, 'rips')}
                  {renderRankingTable(rankings.rips, 'rips')}
                </TabPanel>
              </TabPanels>
            </Tabs>
          )}
        </Box>
      </Box>
    </AllLayout>
  );
};

export default RankingsPage;
