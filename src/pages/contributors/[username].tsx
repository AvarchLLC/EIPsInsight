import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import {
  Box, Heading, Text, Flex, Badge, VStack, HStack, useColorModeValue,
  Spinner, Alert, AlertIcon, Avatar, Card, CardBody, CardHeader, SimpleGrid,
  Stat, StatLabel, StatNumber, StatHelpText, Icon, Tabs, TabList, Tab,
  TabPanels, TabPanel, Divider, Button, Select,
} from '@chakra-ui/react';
import {
  FiGitCommit, FiGitPullRequest, FiMessageSquare, FiAlertCircle,
  FiEye, FiAward, FiTrendingUp, FiCalendar,
} from 'react-icons/fi';
import Head from 'next/head';
import { useRouter } from 'next/router';
import AllLayout from '@/components/Layout';
import axios from 'axios';
import { format } from 'date-fns';

const Line = dynamic(() => import('@ant-design/plots').then(mod => mod.Line), { ssr: false });
const Column = dynamic(() => import('@ant-design/plots').then(mod => mod.Column), { ssr: false });
const Pie = dynamic(() => import('@ant-design/plots').then(mod => mod.Pie), { ssr: false });

interface Contributor {
  username: string;
  name?: string;
  avatarUrl?: string;
  email?: string;
  company?: string;
  bio?: string;
  totals?: {
    commits: number;
    prsOpened: number;
    prsMerged: number;
    reviews: number;
    comments: number;
    issuesOpened: number;
    activityScore: number;
  };
  repos?: Array<{
    name: string;
    commits: number;
    prs: number;
    reviews: number;
    filesChanged: number;
  }>;
  activityStatus?: string;
  lastActivityDate?: string;
  firstContributionDate?: string;
  risingStarIndex?: number;
  expertise?: string[];
  languageBreakdown?: Record<string, number>;
  avgResponseTime?: string;
  rank?: number;
  snapshots?: Array<{
    date: string;
    totals: any;
    metrics: any;
  }>;
}

interface TimelineItem {
  date: string;
  items: Array<{
    type: string;
    count: number;
    date: string;
  }>;
}

const ContributorProfile: React.FC = () => {
  const router = useRouter();
  const { username } = router.query;

  const [contributor, setContributor] = useState<Contributor | null>(null);
  const [timeline, setTimeline] = useState<TimelineItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [timelineLoading, setTimelineLoading] = useState(false);
  const [timelinePage, setTimelinePage] = useState(1);
  const [timelineHasMore, setTimelineHasMore] = useState(false);
  const [timelineTypeFilter, setTimelineTypeFilter] = useState<string>('');
  const [timelineRepoFilter, setTimelineRepoFilter] = useState<string>('');
  const [timelineSort, setTimelineSort] = useState<'asc' | 'desc'>('desc');

  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const mutedColor = useColorModeValue('gray.600', 'gray.400');

  useEffect(() => {
    if (username && typeof username === 'string') {
      fetchContributor();
      // fetchTimeline is only needed for pagination, initial data comes from fetchContributor
    }
  }, [username]);

  const fetchContributor = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/contributors/${username}`);
      setContributor(response.data);
      // Set timeline from contributor data
      if (response.data.timeline && response.data.timeline.length > 0) {
        console.log('Timeline loaded:', response.data.timeline.length, 'items');
        console.log('Sample timeline item:', response.data.timeline[0]);
        setTimeline(response.data.timeline);
        setTimelineHasMore(response.data.timeline.length >= 50); // Assume more if we have 50+
      } else {
        console.log('No timeline data in response');
      }
    } catch (error) {
      console.error('Failed to fetch contributor:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTimeline = async (page = 1) => {
    setTimelineLoading(true);
    try {
      const response = await axios.get(`/api/contributors/${username}/timeline`, {
        params: { page, limit: 30 },
      });
      if (page === 1) {
        setTimeline(response.data.timeline);
      } else {
        setTimeline([...timeline, ...response.data.timeline]);
      }
      setTimelineHasMore(response.data.pagination.hasNextPage);
      setTimelinePage(page);
    } catch (error) {
      console.error('Failed to fetch timeline:', error);
    } finally {
      setTimelineLoading(false);
    }
  };

  const getActivityBadge = (status?: string) => {
    if (!status) return <Badge colorScheme="gray" fontSize="md">Unknown</Badge>;
    const colors: Record<string, string> = {
      Active: 'green',
      Occasional: 'yellow',
      Dormant: 'red',
    };
    return <Badge colorScheme={colors[status] || 'gray'} fontSize="md">{status}</Badge>;
  };

  // Prepare chart data
  const getMonthlyActivityData = () => {
    if (!contributor?.snapshots) return [];
    return contributor.snapshots.map((snapshot) => ({
      date: format(new Date(snapshot.date), 'MMM dd'),
      value: (snapshot.totals?.commits || 0) + (snapshot.totals?.prsOpened || 0) + (snapshot.totals?.reviews || 0),
      type: 'Activity',
    }));
  };

  const getRepoDistributionData = () => {
    // Calculate from timeline if repos not available
    if (contributor?.repos && contributor.repos.length > 0) {
      return contributor.repos.map((repo) => ({
        type: repo.name,
        value: (repo.commits || 0) + (repo.prs || 0) + (repo.reviews || 0),
      }));
    }
    
    // Fallback: calculate from timeline
    if (!timeline || timeline.length === 0) return [];
    
    const repoStats: Record<string, number> = {};
    timeline.forEach((item: any) => {
      if (item.repo) {
        repoStats[item.repo] = (repoStats[item.repo] || 0) + 1;
      }
    });
    
    return Object.entries(repoStats).map(([name, count]) => ({
      type: name,
      value: count,
    }));
  };

  const getActivityBreakdownData = () => {
    if (!contributor?.totals) return [];
    return [
      { type: 'Commits', value: contributor.totals.commits || 0 },
      { type: 'PRs', value: contributor.totals.prsOpened || 0 },
      { type: 'Reviews', value: contributor.totals.reviews || 0 },
      { type: 'Comments', value: contributor.totals.comments || 0 },
      { type: 'Issues', value: contributor.totals.issuesOpened || 0 },
    ];
  };

  // Calculate repository breakdown from timeline
  const getRepositoryBreakdown = () => {
    if (contributor?.repos && contributor.repos.length > 0) {
      return contributor.repos;
    }
    
    // Calculate from timeline
    if (!timeline || timeline.length === 0) return [];
    
    const repoStats: Record<string, any> = {};
    timeline.forEach((item: any) => {
      if (item.repo) {
        if (!repoStats[item.repo]) {
          repoStats[item.repo] = { name: item.repo, commits: 0, prs: 0, reviews: 0, comments: 0, issues: 0 };
        }
        
        if (item.type === 'commit') repoStats[item.repo].commits++;
        else if (item.type === 'pr') repoStats[item.repo].prs++;
        else if (item.type === 'review') repoStats[item.repo].reviews++;
        else if (item.type === 'comment') repoStats[item.repo].comments++;
        else if (item.type === 'issue') repoStats[item.repo].issues++;
      }
    });
    
    return Object.values(repoStats);
  };

  // Get filtered and sorted timeline
  const getFilteredTimeline = () => {
    let filtered = [...timeline];
    console.log('Filtering timeline:', {
      total: timeline.length,
      typeFilter: timelineTypeFilter,
      repoFilter: timelineRepoFilter,
      sort: timelineSort
    });
    
    // Filter by type
    if (timelineTypeFilter) {
      const beforeFilter = filtered.length;
      filtered = filtered.filter((item: any) => item.type === timelineTypeFilter);
      console.log(`Type filter '${timelineTypeFilter}': ${beforeFilter} -> ${filtered.length}`);
    }
    
    // Filter by repo
    if (timelineRepoFilter) {
      const beforeFilter = filtered.length;
      filtered = filtered.filter((item: any) => item.repo === timelineRepoFilter);
      console.log(`Repo filter '${timelineRepoFilter}': ${beforeFilter} -> ${filtered.length}`);
    }
    
    // Sort
    filtered.sort((a: any, b: any) => {
      const dateA = new Date(a.timestamp || a.date).getTime();
      const dateB = new Date(b.timestamp || b.date).getTime();
      return timelineSort === 'desc' ? dateB - dateA : dateA - dateB;
    });
    
    console.log('Final filtered count:', filtered.length);
    return filtered;
  };

  // Get unique repos from timeline
  const getUniqueRepos = () => {
    const repos = new Set<string>();
    timeline.forEach((item: any) => {
      if (item.repo) repos.add(item.repo);
    });
    return Array.from(repos);
  };

  // Get unique types from timeline
  const getUniqueTypes = () => {
    const types = new Set<string>();
    timeline.forEach((item: any) => {
      if (item.type) types.add(item.type);
    });
    return Array.from(types);
  };

  if (loading) {
    return (
      <AllLayout>
        <Flex justify="center" align="center" minH="100vh">
          <Spinner size="xl" />
        </Flex>
      </AllLayout>
    );
  }

  if (!contributor) {
    return (
      <AllLayout>
        <Box maxW="7xl" mx="auto" py={8} px={4}>
          <Alert status="error">
            <AlertIcon />
            Contributor not found
          </Alert>
        </Box>
      </AllLayout>
    );
  }

  return (
    <AllLayout>
      <Head>
        <title>{contributor.name || contributor.username} - Contributor Profile</title>
        <meta name="description" content={`Profile of ${contributor.name || contributor.username}`} />
      </Head>

      <Box bg={bgColor} minH="100vh" py={8} px={4}>
        <Box maxW="7xl" mx="auto">
          {/* Profile Header */}
          <Card bg={cardBg} mb={6}>
            <CardBody>
              <Flex direction={{ base: 'column', md: 'row' }} gap={6} align="center">
                <Avatar
                  src={contributor.avatarUrl}
                  name={contributor.username}
                  size="2xl"
                />
                <VStack align={{ base: 'center', md: 'start' }} flex={1} spacing={3}>
                  <Box textAlign={{ base: 'center', md: 'left' }}>
                    <Heading size="xl">{contributor.name || contributor.username}</Heading>
                    <Text color={mutedColor} fontSize="lg">@{contributor.username}</Text>
                  </Box>
                  <HStack spacing={4} wrap="wrap" justify={{ base: 'center', md: 'start' }}>
                    {getActivityBadge(contributor.activityStatus)}
                    {contributor.rank && (
                      <Badge colorScheme="purple" fontSize="md">
                        <Icon as={FiAward} mr={1} />
                        Rank #{contributor.rank}
                      </Badge>
                    )}
                    {contributor.risingStarIndex && contributor.risingStarIndex > 0 && (
                      <Badge colorScheme="yellow" fontSize="md">
                        <Icon as={FiTrendingUp} mr={1} />
                        Rising Star
                      </Badge>
                    )}
                  </HStack>
                  {contributor.bio && (
                    <Text color={mutedColor}>{contributor.bio}</Text>
                  )}
                  {contributor.company && (
                    <Text fontSize="sm" color={mutedColor}>🏢 {contributor.company}</Text>
                  )}
                  <HStack spacing={4} fontSize="sm" color={mutedColor}>
                    {contributor.firstContributionDate && (
                      <Text>
                        <Icon as={FiCalendar} mr={1} />
                        Joined {format(new Date(contributor.firstContributionDate), 'MMM yyyy')}
                      </Text>
                    )}
                    {contributor.lastActivityDate && (
                      <Text>
                        Last active {format(new Date(contributor.lastActivityDate), 'MMM dd, yyyy')}
                      </Text>
                    )}
                  </HStack>
                </VStack>
              </Flex>
            </CardBody>
          </Card>

          {/* Stats Grid */}
          <SimpleGrid columns={{ base: 2, md: 3, lg: 6 }} spacing={4} mb={6}>
            <Card bg={cardBg} as={NextLink} href={`/contributors/${contributor.username}/commits`} cursor="pointer" _hover={{ transform: 'translateY(-2px)', shadow: 'md' }} transition="all 0.2s">
              <CardBody>
                <Stat>
                  <StatLabel>
                    <HStack>
                      <Icon as={FiGitCommit} color="purple.500" />
                      <Text>Commits</Text>
                    </HStack>
                  </StatLabel>
                  <StatNumber color="blue.500">{contributor.totals?.commits || 0}</StatNumber>
                </Stat>
              </CardBody>
            </Card>

            <Card bg={cardBg} as={NextLink} href={`/contributors/${contributor.username}/prs`} cursor="pointer" _hover={{ transform: 'translateY(-2px)', shadow: 'md' }} transition="all 0.2s">
              <CardBody>
                <Stat>
                  <StatLabel>
                    <HStack>
                      <Icon as={FiGitPullRequest} color="blue.500" />
                      <Text>PRs</Text>
                    </HStack>
                  </StatLabel>
                  <StatNumber color="blue.500">{contributor.totals?.prsOpened || 0}</StatNumber>
                  <StatHelpText>{contributor.totals?.prsMerged || 0} merged</StatHelpText>
                </Stat>
              </CardBody>
            </Card>

            <Card bg={cardBg} as={NextLink} href={`/contributors/${contributor.username}/reviews`} cursor="pointer" _hover={{ transform: 'translateY(-2px)', shadow: 'md' }} transition="all 0.2s">
              <CardBody>
                <Stat>
                  <StatLabel>
                    <HStack>
                      <Icon as={FiEye} color="green.500" />
                      <Text>Reviews</Text>
                    </HStack>
                  </StatLabel>
                  <StatNumber color="blue.500">{contributor.totals?.reviews || 0}</StatNumber>
                </Stat>
              </CardBody>
            </Card>

            <Card bg={cardBg} as={NextLink} href={`/contributors/${contributor.username}/comments`} cursor="pointer" _hover={{ transform: 'translateY(-2px)', shadow: 'md' }} transition="all 0.2s">
              <CardBody>
                <Stat>
                  <StatLabel>
                    <HStack>
                      <Icon as={FiMessageSquare} color="orange.500" />
                      <Text>Comments</Text>
                    </HStack>
                  </StatLabel>
                  <StatNumber color="blue.500">{contributor.totals?.comments || 0}</StatNumber>
                </Stat>
              </CardBody>
            </Card>

            <Card bg={cardBg} as={NextLink} href={`/contributors/${contributor.username}/issues`} cursor="pointer" _hover={{ transform: 'translateY(-2px)', shadow: 'md' }} transition="all 0.2s">
              <CardBody>
                <Stat>
                  <StatLabel>
                    <HStack>
                      <Icon as={FiAlertCircle} color="red.500" />
                      <Text>Issues</Text>
                    </HStack>
                  </StatLabel>
                  <StatNumber color="blue.500">{contributor.totals?.issuesOpened || 0}</StatNumber>
                </Stat>
              </CardBody>
            </Card>

            <Card bg={cardBg}>
              <CardBody>
                <Stat>
                  <StatLabel>
                    <HStack>
                      <Icon as={FiAward} color="yellow.500" />
                      <Text>Score</Text>
                    </HStack>
                  </StatLabel>
                  <StatNumber>{contributor.totals?.activityScore || 0}</StatNumber>
                </Stat>
              </CardBody>
            </Card>
          </SimpleGrid>

          {/* Tabs */}
          <Tabs colorScheme="blue">
            <TabList>
              <Tab>Charts</Tab>
              <Tab>Repositories</Tab>
              <Tab>Timeline</Tab>
            </TabList>

            <TabPanels>
              {/* Charts Tab */}
              <TabPanel>
                <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
                  <Card bg={cardBg}>
                    <CardHeader>
                      <Heading size="md">Activity Breakdown</Heading>
                    </CardHeader>
                    <CardBody>
                      <Box h="300px">
                        <Pie
                          data={getActivityBreakdownData()}
                          angleField="value"
                          colorField="type"
                          radius={0.8}
                          label={{
                            type: 'outer',
                            content: '{name} {percentage}',
                          }}
                        />
                      </Box>
                    </CardBody>
                  </Card>

                  <Card bg={cardBg}>
                    <CardHeader>
                      <Heading size="md">Repository Distribution</Heading>
                    </CardHeader>
                    <CardBody>
                      <Box h="300px">
                        <Column
                          data={getRepoDistributionData()}
                          xField="type"
                          yField="value"
                          label={{
                            position: 'top',
                          }}
                        />
                      </Box>
                    </CardBody>
                  </Card>

                  {contributor.snapshots && contributor.snapshots.length > 0 && (
                    <Card bg={cardBg} gridColumn={{ lg: '1 / -1' }}>
                      <CardHeader>
                        <Heading size="md">Activity Over Time</Heading>
                      </CardHeader>
                      <CardBody>
                        <Box h="300px">
                          <Line
                            data={getMonthlyActivityData()}
                            xField="date"
                            yField="value"
                            seriesField="type"
                            smooth
                          />
                        </Box>
                      </CardBody>
                    </Card>
                  )}
                </SimpleGrid>
              </TabPanel>

              {/* Repositories Tab */}
              <TabPanel>
                {getRepositoryBreakdown().length > 0 ? (
                  <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
                    {getRepositoryBreakdown().map((repo) => (
                      <Card key={repo.name} bg={cardBg} borderWidth="1px" borderColor={borderColor}>
                        <CardBody>
                          <VStack align="stretch" spacing={3}>
                            <HStack justify="space-between">
                              <Heading size="md">{repo.name}</Heading>
                              <Badge colorScheme="blue" fontSize="sm">
                                {(repo.commits || 0) + (repo.prs || 0) + (repo.reviews || 0) + (repo.comments || 0) + (repo.issues || 0)} total
                              </Badge>
                            </HStack>
                            <Divider />
                            <VStack align="stretch" spacing={2}>
                              {repo.commits > 0 && (
                                <HStack justify="space-between">
                                  <HStack>
                                    <Icon as={FiGitCommit} color="purple.500" />
                                    <Text fontSize="sm">Commits</Text>
                                  </HStack>
                                  <Badge colorScheme="purple">{repo.commits}</Badge>
                                </HStack>
                              )}
                              {repo.prs > 0 && (
                                <HStack justify="space-between">
                                  <HStack>
                                    <Icon as={FiGitPullRequest} color="blue.500" />
                                    <Text fontSize="sm">Pull Requests</Text>
                                  </HStack>
                                  <Badge colorScheme="blue">{repo.prs}</Badge>
                                </HStack>
                              )}
                              {repo.reviews > 0 && (
                                <HStack justify="space-between">
                                  <HStack>
                                    <Icon as={FiEye} color="green.500" />
                                    <Text fontSize="sm">Reviews</Text>
                                  </HStack>
                                  <Badge colorScheme="green">{repo.reviews}</Badge>
                                </HStack>
                              )}
                              {repo.comments > 0 && (
                                <HStack justify="space-between">
                                  <HStack>
                                    <Icon as={FiMessageSquare} color="orange.500" />
                                    <Text fontSize="sm">Comments</Text>
                                  </HStack>
                                  <Badge colorScheme="orange">{repo.comments}</Badge>
                                </HStack>
                              )}
                              {repo.issues > 0 && (
                                <HStack justify="space-between">
                                  <HStack>
                                    <Icon as={FiAlertCircle} color="red.500" />
                                    <Text fontSize="sm">Issues</Text>
                                  </HStack>
                                  <Badge colorScheme="red">{repo.issues}</Badge>
                                </HStack>
                              )}
                            </VStack>
                          </VStack>
                        </CardBody>
                      </Card>
                    ))}
                  </SimpleGrid>
                ) : (
                  <Alert status="info">
                    <AlertIcon />
                    No repository data available
                  </Alert>
                )}
              </TabPanel>

              {/* Timeline Tab */}
              <TabPanel>
                {/* Timeline Filters */}
                <Card bg={cardBg} mb={4}>
                  <CardBody>
                    <HStack justify="space-between" mb={4}>
                      <Heading size="sm">Timeline Filters</Heading>
                      <HStack>
                        <Badge colorScheme="gray" fontSize="sm">
                          {timeline.length} total
                        </Badge>
                        <Badge colorScheme="blue" fontSize="sm">
                          {getFilteredTimeline().length} shown
                        </Badge>
                      </HStack>
                    </HStack>
                    <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                      <Box>
                        <Text fontSize="sm" mb={2} fontWeight="semibold">Filter by Type</Text>
                        <Select
                          value={timelineTypeFilter}
                          onChange={(e) => setTimelineTypeFilter(e.target.value)}
                          placeholder={`All Types (${getUniqueTypes().length})`}
                        >
                          {getUniqueTypes().map((type) => (
                            <option key={type} value={type}>
                              {type.charAt(0).toUpperCase() + type.slice(1)}
                            </option>
                          ))}
                        </Select>
                      </Box>
                      
                      <Box>
                        <Text fontSize="sm" mb={2} fontWeight="semibold">Filter by Repository</Text>
                        <Select
                          value={timelineRepoFilter}
                          onChange={(e) => setTimelineRepoFilter(e.target.value)}
                          placeholder="All Repositories"
                        >
                          {getUniqueRepos().map((repo) => (
                            <option key={repo} value={repo}>{repo}</option>
                          ))}
                        </Select>
                      </Box>
                      
                      <Box>
                        <Text fontSize="sm" mb={2} fontWeight="semibold">Sort Order</Text>
                        <Select
                          value={timelineSort}
                          onChange={(e) => setTimelineSort(e.target.value as 'asc' | 'desc')}
                        >
                          <option value="desc">Newest First</option>
                          <option value="asc">Oldest First</option>
                        </Select>
                      </Box>
                    </SimpleGrid>
                    
                    {(timelineTypeFilter || timelineRepoFilter) && (
                      <Button
                        mt={3}
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setTimelineTypeFilter('');
                          setTimelineRepoFilter('');
                        }}
                      >
                        Clear Filters
                      </Button>
                    )}
                  </CardBody>
                </Card>

                <VStack spacing={4} align="stretch">
                  {getFilteredTimeline().length > 0 ? (
                    getFilteredTimeline().map((item, index) => {
                    const date = item.timestamp || item.date;
                    const typeColors: Record<string, string> = {
                      commit: 'purple',
                      pr: 'blue',
                      review: 'green',
                      comment: 'orange',
                      issue: 'red',
                    };
                    
                    return (
                      <Card key={index} bg={cardBg} borderWidth="1px" borderColor={borderColor} _hover={{ shadow: 'md', transform: 'translateY(-2px)', transition: 'all 0.2s' }}>
                        <CardBody>
                          <VStack align="stretch" spacing={3}>
                            <HStack justify="space-between" wrap="wrap">
                              <HStack spacing={2}>
                                <Badge colorScheme={typeColors[item.type] || 'gray'} fontSize="xs" px={2}>
                                  {item.type.toUpperCase()}
                                </Badge>
                                {item.repo && (
                                  <Badge colorScheme="cyan" variant="outline" fontSize="xs">
                                    {item.repo}
                                  </Badge>
                                )}
                                {item.number && (
                                  <Badge colorScheme="gray" variant="subtle" fontSize="xs">
                                    #{item.number}
                                  </Badge>
                                )}
                              </HStack>
                              <Text fontSize="xs" color={mutedColor} fontWeight="medium">
                                {date ? format(new Date(date), 'MMM dd, yyyy • HH:mm') : 'Unknown date'}
                              </Text>
                            </HStack>
                            
                            <Divider />
                            
                            {/* PR Title */}
                            {item.metadata?.prTitle && (
                              <Box>
                                <Text fontSize="md" fontWeight="semibold" mb={1}>
                                  {item.metadata.prTitle}
                                </Text>
                                {item.metadata.state && (
                                  <Badge 
                                    colorScheme={
                                      item.metadata.state === 'APPROVED' ? 'green' :
                                      item.metadata.state === 'CHANGES_REQUESTED' ? 'orange' :
                                      item.metadata.state === 'COMMENTED' ? 'blue' : 'gray'
                                    }
                                    fontSize="xs"
                                  >
                                    {item.metadata.state}
                                  </Badge>
                                )}
                              </Box>
                            )}
                            
                            {/* Commit Message */}
                            {item.metadata?.commitMessage && (
                              <Text fontSize="sm" color={mutedColor} noOfLines={2}>
                                {item.metadata.commitMessage}
                              </Text>
                            )}
                            
                            {/* Issue Title */}
                            {item.metadata?.issueTitle && (
                              <Text fontSize="md" fontWeight="semibold">
                                {item.metadata.issueTitle}
                              </Text>
                            )}
                            
                            {/* Review Body */}
                            {item.metadata?.body && item.metadata.body.trim() && (
                              <Text fontSize="sm" color={mutedColor} noOfLines={3} fontStyle="italic">
                                "{item.metadata.body}"
                              </Text>
                            )}
                            
                            {/* EIP Number */}
                            {item.metadata?.eipNumber && (
                              <HStack>
                                <Text fontSize="sm" fontWeight="medium">EIP:</Text>
                                <Badge colorScheme="purple">{item.metadata.eipNumber}</Badge>
                              </HStack>
                            )}
                            
                            {/* GitHub Link */}
                            {item.url && (
                              <Button
                                as="a"
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                size="sm"
                                colorScheme="blue"
                                variant="outline"
                                leftIcon={<Icon as={FiTrendingUp} />}
                                _hover={{ transform: 'scale(1.02)' }}
                              >
                                View on GitHub
                              </Button>
                            )}
                          </VStack>
                        </CardBody>
                      </Card>
                    );
                  })
                  ) : (
                    <Alert status="info">
                      <AlertIcon />
                      No timeline activities found. Try changing the filters.
                    </Alert>
                  )}

                  {timelineHasMore && getFilteredTimeline().length > 0 && (
                    <Button
                      onClick={() => fetchTimeline(timelinePage + 1)}
                      isLoading={timelineLoading}
                      colorScheme="blue"
                    >
                      Load More
                    </Button>
                  )}
                </VStack>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Box>
    </AllLayout>
  );
};

export default ContributorProfile;
