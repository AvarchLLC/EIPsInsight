import React, { useState, useEffect } from 'react';
import {
  Box, Heading, Text, Flex, Badge, VStack, HStack, Select, Button,
  useColorModeValue, Spinner, Alert, AlertIcon, Table, Thead, Tbody,
  Tr, Th, Td, Card, CardBody, CardHeader, Icon, Link, Breadcrumb,
  BreadcrumbItem, BreadcrumbLink, SimpleGrid, IconButton, Tooltip,
  Stat, StatLabel, StatNumber, StatHelpText,
} from '@chakra-ui/react';
import {
  FiGitCommit, FiGitPullRequest, FiMessageSquare,
  FiAlertCircle, FiEye, FiDownload, FiExternalLink, FiChevronRight,
  FiFilter, FiCalendar,
} from 'react-icons/fi';
import Head from 'next/head';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import AllLayout from '@/components/Layout';
import axios from 'axios';

interface Activity {
  type: string;
  repo: string;
  number?: number;
  url: string;
  timestamp: string;
  metadata?: {
    title?: string;
    message?: string;
    state?: string;
    author?: string;
    [key: string]: any;
  };
}

const ActivityDetailPage: React.FC = () => {
  const router = useRouter();
  const { username, activityType } = router.query;

  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [repo, setRepo] = useState('');
  const [period, setPeriod] = useState<'all' | 'weekly' | 'monthly'>('all');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<any>(null);

  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const mutedColor = useColorModeValue('gray.600', 'gray.400');

  useEffect(() => {
    if (username && activityType) {
      // Initialize from URL query on first load
      if (router.isReady) {
        if (router.query.repo && typeof router.query.repo === 'string') {
          setRepo(router.query.repo);
        }
        if (router.query.period && typeof router.query.period === 'string') {
          setPeriod(router.query.period as 'all' | 'weekly' | 'monthly');
        }
      }
    }
  }, [router.isReady, router.query.repo, router.query.period]);

  useEffect(() => {
    if (username && activityType) {
      fetchActivities();
    }
  }, [username, activityType, page, repo, period, sortOrder]);

  const fetchActivities = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`/api/contributors/${username}/activities/${activityType}`, {
        params: { page, limit: 100, repo: repo || undefined, period, sortOrder },
      });
      
      if (!response.data || !response.data.data) {
        setError('No activity data available');
        setActivities([]);
        return;
      }
      
      setActivities(response.data.data || []);
      setTotal(response.data.pagination?.total || 0);
      setHasMore(response.data.pagination?.hasNextPage || false);
      setStats(response.data.stats || null);
    } catch (error: any) {
      console.error('Failed to fetch activities:', error);
      setError(error.response?.data?.message || 'Failed to load activity data');
      setActivities([]);
    } finally {
      setLoading(false);
    }
  };

  const downloadCSV = () => {
    window.open(
      `/api/contributors/${username}/activities/${activityType}?format=csv&repo=${repo || ''}&period=${period}&sortOrder=${sortOrder}`,
      '_blank'
    );
  };

  const getPeriodLabel = (p: string) => {
    const labels: Record<string, string> = {
      all: 'All Time',
      weekly: 'Last 7 Days',
      monthly: 'Last 30 Days',
    };
    return labels[p] || p;
  };

  const getActivityIcon = (type: string) => {
    const icons: Record<string, any> = {
      commits: FiGitCommit,
      prs: FiGitPullRequest,
      reviews: FiEye,
      comments: FiMessageSquare,
      issues: FiAlertCircle,
    };
    return icons[type] || FiGitCommit;
  };

  const getActivityColor = (type: string) => {
    const colors: Record<string, string> = {
      commits: 'blue',
      prs: 'green',
      reviews: 'purple',
      comments: 'orange',
      issues: 'red',
    };
    return colors[type] || 'gray';
  };

  const getActivityTitle = (type: string) => {
    const titles: Record<string, string> = {
      commits: 'Commits',
      prs: 'Pull Requests',
      reviews: 'Code Reviews',
      comments: 'Comments',
      issues: 'Issues',
    };
    return titles[type as string] || type;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getRepoColor = (repo: string) => {
    const colors: Record<string, string> = {
      EIPs: 'blue',
      ERCs: 'green',
      RIPs: 'purple',
    };
    return colors[repo] || 'gray';
  };

  if (loading && page === 1) {
    return (
      <AllLayout>
        <Flex justify="center" align="center" minH="100vh">
          <Spinner size="xl" />
        </Flex>
      </AllLayout>
    );
  }

  const ActivityIcon = getActivityIcon(activityType as string);

  return (
    <AllLayout>
      <Head>
        <title>{getActivityTitle(activityType as string)} - {username} | EIP Insights</title>
      </Head>

      <Box bg={bgColor} minH="100vh" py={8}>
        <Box maxW="7xl" mx="auto" px={4}>
          {/* Breadcrumb */}
          <Breadcrumb
            spacing={2}
            separator={<Icon as={FiChevronRight} color={mutedColor} />}
            mb={6}
          >
            <BreadcrumbItem>
              <BreadcrumbLink as={NextLink} href="/contributors">
                Contributors
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink as={NextLink} href={`/contributors/${username}`}>
                {username}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem isCurrentPage>
              <BreadcrumbLink>{getActivityTitle(activityType as string)}</BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>

          {/* Header */}
          <Card bg={cardBg} mb={6} overflow="hidden">
            <CardHeader bgGradient={`linear(to-r, ${getActivityColor(activityType as string)}.500, ${getActivityColor(activityType as string)}.700)`} py={6}>
              <Flex justify="space-between" align="center" wrap="wrap" gap={4}>
                <HStack spacing={4}>
                  <Icon as={ActivityIcon} boxSize={10} color="white" />
                  <VStack align="start" spacing={1}>
                    <Heading size="xl" color="white">{getActivityTitle(activityType as string)}</Heading>
                    <Text color="whiteAlpha.900" fontSize="lg">
                      by <Text as="span" fontWeight="bold">{username}</Text>
                    </Text>
                  </VStack>
                </HStack>
                <HStack>
                  <Badge bg="whiteAlpha.300" color="white" fontSize="xl" px={4} py={2} borderRadius="lg">
                    {total} {total === 1 ? 'activity' : 'activities'}
                  </Badge>
                  {period !== 'all' && (
                    <Badge bg="whiteAlpha.200" color="white" fontSize="md" px={3} py={1} borderRadius="lg">
                      {getPeriodLabel(period)}
                    </Badge>
                  )}
                  <Tooltip label="Download CSV">
                    <IconButton
                      aria-label="Download CSV"
                      icon={<FiDownload />}
                      onClick={downloadCSV}
                      colorScheme="whiteAlpha"
                      variant="solid"
                      size="lg"
                    />
                  </Tooltip>
                </HStack>
              </Flex>
            </CardHeader>
          </Card>

          {/* Stats Summary */}
          {stats && (
            <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4} mb={6}>
              <Card bg={cardBg} borderWidth="2px" borderColor={`${getActivityColor(activityType as string)}.200`}>
                <CardBody>
                  <Stat>
                    <StatLabel fontSize="sm">Total Count</StatLabel>
                    <StatNumber fontSize="3xl" color={`${getActivityColor(activityType as string)}.600`}>
                      {stats.total || total}
                    </StatNumber>
                    <StatHelpText>All time</StatHelpText>
                  </Stat>
                </CardBody>
              </Card>
              <Card bg={cardBg}>
                <CardBody>
                  <Stat>
                    <StatLabel fontSize="sm">This Month</StatLabel>
                    <StatNumber fontSize="3xl">{stats.thisMonth || 0}</StatNumber>
                    <StatHelpText>Last 30 days</StatHelpText>
                  </Stat>
                </CardBody>
              </Card>
              <Card bg={cardBg}>
                <CardBody>
                  <Stat>
                    <StatLabel fontSize="sm">This Week</StatLabel>
                    <StatNumber fontSize="3xl">{stats.thisWeek || 0}</StatNumber>
                    <StatHelpText>Last 7 days</StatHelpText>
                  </Stat>
                </CardBody>
              </Card>
              <Card bg={cardBg}>
                <CardBody>
                  <Stat>
                    <StatLabel fontSize="sm">Avg/Month</StatLabel>
                    <StatNumber fontSize="3xl">{stats.avgPerMonth || 0}</StatNumber>
                    <StatHelpText>Average</StatHelpText>
                  </Stat>
                </CardBody>
              </Card>
            </SimpleGrid>
          )}

          {/* Filters */}
          <Card bg={cardBg} mb={6} borderWidth="2px" borderColor={borderColor}>
            <CardHeader>
              <Heading size="md">
                <Icon as={FiFilter} mr={2} />
                Advanced Filters & Analytics
              </Heading>
            </CardHeader>
            <CardBody>
              <SimpleGrid columns={{ base: 1, md: 4 }} spacing={4}>
                <Box>
                  <Text fontSize="sm" mb={2} fontWeight="semibold" color={mutedColor}>
                    Repository
                  </Text>
                  <Select
                    value={repo}
                    onChange={(e) => {
                      setRepo(e.target.value);
                      setPage(1);
                    }}
                    placeholder="All Repositories"
                    size="lg"
                  >
                    <option value="EIPs">📜 EIPs</option>
                    <option value="ERCs">🎨 ERCs</option>
                    <option value="RIPs">⚡ RIPs</option>
                  </Select>
                </Box>

                <Box>
                  <Text fontSize="sm" mb={2} fontWeight="semibold" color={mutedColor}>
                    Time Period
                  </Text>
                  <Select
                    value={period}
                    onChange={(e) => {
                      setPeriod(e.target.value as any);
                      setPage(1);
                    }}
                    size="lg"
                  >
                    <option value="all">All Time</option>
                    <option value="monthly">Last 30 Days</option>
                    <option value="weekly">Last 7 Days</option>
                  </Select>
                </Box>

                <Box>
                  <Text fontSize="sm" mb={2} fontWeight="semibold" color={mutedColor}>
                    Sort Order
                  </Text>
                  <Select
                    value={sortOrder}
                    onChange={(e) => {
                      setSortOrder(e.target.value as 'asc' | 'desc');
                      setPage(1);
                    }}
                    size="lg"
                  >
                    <option value="desc">⬇️ Newest First</option>
                    <option value="asc">⬆️ Oldest First</option>
                  </Select>
                </Box>

                <Box>
                  <Text fontSize="sm" mb={2} fontWeight="semibold" color={mutedColor}>Showing</Text>
                  <Text fontSize="3xl" fontWeight="bold" color={`${getActivityColor(activityType as string)}.600`}>
                    {activities.length} / {total}
                  </Text>
                  <Text fontSize="xs" color={mutedColor}>activities found</Text>
                </Box>
              </SimpleGrid>
            </CardBody>
          </Card>

          {/* Error State */}
          {error && (
            <Alert status="error" borderRadius="md" mb={6}>
              <AlertIcon />
              <Box flex="1">
                <Text fontWeight="bold">Error Loading Activities</Text>
                <Text fontSize="sm">{error}</Text>
              </Box>
              <Button size="sm" onClick={fetchActivities} colorScheme="red" variant="outline">
                Retry
              </Button>
            </Alert>
          )}

          {/* Activities Table */}
          <Card bg={cardBg}>
            <CardBody overflowX="auto">
              {activities.length === 0 ? (
                <Alert status="info">
                  <AlertIcon />
                  No {getActivityTitle(activityType as string).toLowerCase()} found
                  {repo && ` in ${repo} repository`}.
                </Alert>
              ) : (
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>Date</Th>
                      <Th>Repository</Th>
                      {(activityType === 'prs' || activityType === 'issues') && <Th>Number</Th>}
                      <Th>Details</Th>
                      <Th>Link</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {activities.map((activity, index) => (
                      <Tr key={index} _hover={{ bg: useColorModeValue('gray.50', 'gray.700') }}>
                        <Td>
                          <Text fontSize="sm" fontWeight="medium">
                            {formatDate(activity.timestamp)}
                          </Text>
                        </Td>
                        <Td>
                          <Badge colorScheme={getRepoColor(activity.repo)}>
                            {activity.repo}
                          </Badge>
                        </Td>
                        {(activityType === 'prs' || activityType === 'issues') && (
                          <Td>
                            <Badge variant="outline">
                              #{activity.number}
                            </Badge>
                          </Td>
                        )}
                        <Td maxW="400px">
                          <Text noOfLines={2} fontSize="sm">
                            {activity.metadata?.title || activity.metadata?.message || 'No details available'}
                          </Text>
                          {activity.metadata?.state && (
                            <Badge
                              mt={1}
                              colorScheme={activity.metadata.state === 'open' ? 'green' : 'purple'}
                              size="sm"
                            >
                              {activity.metadata.state}
                            </Badge>
                          )}
                        </Td>
                        <Td>
                          {activity.url && (
                            <Link href={activity.url} isExternal>
                              <Button
                                size="sm"
                                rightIcon={<FiExternalLink />}
                                variant="ghost"
                                colorScheme="blue"
                              >
                                View
                              </Button>
                            </Link>
                          )}
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              )}
            </CardBody>
          </Card>

          {/* Pagination */}
          {total > 100 && (
            <Card bg={cardBg} mt={6}>
              <CardBody>
                <Flex justify="space-between" align="center" wrap="wrap" gap={4}>
                  <Button
                    onClick={() => setPage(page - 1)}
                    isDisabled={page === 1}
                    colorScheme="blue"
                    variant="outline"
                    size="lg"
                    leftIcon={<Text>⬅️</Text>}
                  >
                    Previous
                  </Button>
                  <VStack spacing={1}>
                    <Text fontSize="xl" fontWeight="bold">
                      Page {page} of {Math.ceil(total / 100)}
                    </Text>
                    <Text fontSize="sm" color={mutedColor}>
                      {activities.length} items on this page
                    </Text>
                  </VStack>
                  <Button
                    onClick={() => setPage(page + 1)}
                    isDisabled={!hasMore}
                    colorScheme="blue"
                    variant="outline"
                    size="lg"
                    rightIcon={<Text>➡️</Text>}
                  >
                    Next
                  </Button>
                </Flex>
              </CardBody>
            </Card>
          )}
        </Box>
      </Box>
    </AllLayout>
  );
};

export default ActivityDetailPage;
