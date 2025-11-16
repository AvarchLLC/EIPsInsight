import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import {
  Box, Heading, Text, Flex, Badge, VStack, HStack, useColorModeValue,
  Spinner, Alert, AlertIcon, Avatar, Card, CardBody, CardHeader, SimpleGrid,
  Stat, StatLabel, StatNumber, StatHelpText, Icon, Tabs, TabList, Tab,
  TabPanels, TabPanel, Divider, Button, Select, Container, Tooltip,
  Progress, Grid, GridItem,
} from '@chakra-ui/react';
import {
  FiGitCommit, FiGitPullRequest, FiMessageSquare, FiAlertCircle,
  FiEye, FiAward, FiTrendingUp, FiCalendar, FiMapPin, FiBriefcase,
  FiMail, FiGithub,
} from 'react-icons/fi';
import Head from 'next/head';
import NextLink from 'next/link';
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
  repos?: Array<{ name: string; commits: number; prs: number; reviews: number }>;
  activityStatus?: string;
  lastActivityDate?: string;
  firstContributionDate?: string;
  risingStarIndex?: number;
  expertise?: string[];
  languageBreakdown?: Record<string, number>;
  avgResponseTime?: number;
  rank?: number;
  timeline?: Array<{
    type: string;
    repo: string;
    timestamp: string;
    number?: number;
    url?: string;
    metadata?: any;
  }>;
  snapshots?: Array<{
    date: string;
    commits: number;
    prs: number;
    reviews: number;
  }>;
}

const ContributorProfile: React.FC = () => {
  const router = useRouter();
  const { username } = router.query;
  
  const [contributor, setContributor] = useState<Contributor | null>(null);
  const [loading, setLoading] = useState(true);
  const [repoFilter, setRepoFilter] = useState('');
  const [timelineFilter, setTimelineFilter] = useState('all');

  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const mutedColor = useColorModeValue('gray.600', 'gray.400');
  const accentColor = useColorModeValue('blue.500', 'blue.300');

  useEffect(() => {
    if (username) {
      fetchContributor();
    }
  }, [username]);

  const fetchContributor = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/contributors/${username}`);
      setContributor(response.data);
    } catch (error) {
      console.error('Failed to fetch contributor:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status?: string) => {
    if (!status) return 'gray';
    if (status === 'Active') return 'green';
    if (status === 'Inactive') return 'red';
    return 'orange';
  };

  const getRepoColor = (repo: string) => {
    if (repo === 'EIPs') return 'blue';
    if (repo === 'ERCs') return 'purple';
    if (repo === 'RIPs') return 'orange';
    return 'gray';
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'commit': return FiGitCommit;
      case 'pr': return FiGitPullRequest;
      case 'review': return FiEye;
      case 'comment': return FiMessageSquare;
      case 'issue': return FiAlertCircle;
      default: return FiGitCommit;
    }
  };

  const prepareActivityTrendData = () => {
    if (!contributor?.snapshots || contributor.snapshots.length === 0) return [];
    
    return contributor.snapshots.map(snapshot => ({
      date: format(new Date(snapshot.date), 'MMM dd'),
      commits: snapshot.commits || 0,
      prs: snapshot.prs || 0,
      reviews: snapshot.reviews || 0,
    }));
  };

  const prepareRepoDistribution = () => {
    if (!contributor?.repos) return [];
    
    return contributor.repos.map(repo => ({
      repo: repo.name,
      value: repo.commits + repo.prs + repo.reviews,
    }));
  };

  const prepareActivityBreakdown = () => {
    if (!contributor?.totals) return [];
    
    return [
      { type: 'Commits', value: contributor.totals.commits },
      { type: 'Pull Requests', value: contributor.totals.prsOpened },
      { type: 'Reviews', value: contributor.totals.reviews },
      { type: 'Comments', value: contributor.totals.comments },
      { type: 'Issues', value: contributor.totals.issuesOpened },
    ].filter(item => item.value > 0);
  };

  const getFilteredTimeline = () => {
    if (!contributor?.timeline) return [];
    
    let filtered = [...contributor.timeline];
    
    if (repoFilter) {
      filtered = filtered.filter(item => item.repo === repoFilter);
    }
    
    if (timelineFilter !== 'all') {
      filtered = filtered.filter(item => item.type === timelineFilter);
    }
    
    return filtered.slice(0, 20); // Show only recent 20 activities
  };

  if (loading) {
    return (
      <AllLayout>
        <Flex justify="center" align="center" minH="60vh">
          <Spinner size="xl" color={accentColor} thickness="4px" />
        </Flex>
      </AllLayout>
    );
  }

  if (!contributor) {
    return (
      <AllLayout>
        <Container maxW="container.xl" py={8}>
          <Alert status="error" borderRadius="md">
            <AlertIcon />
            Contributor not found
          </Alert>
        </Container>
      </AllLayout>
    );
  }

  return (
    <AllLayout>
      <Head>
        <title>{contributor.name || contributor.username} - Contributor Profile | EIPsInsight</title>
        <meta name="description" content={`Profile and contributions of ${contributor.name || contributor.username}`} />
      </Head>

      <Box bg={bgColor} minH="100vh" py={8}>
        <Container maxW="container.xl">
          {/* Header Section with Avatar and Basic Info */}
          <Card bg={cardBg} mb={6} overflow="hidden">
            <CardBody>
              <Flex direction={{ base: 'column', md: 'row' }} gap={6} align={{ base: 'center', md: 'flex-start' }}>
                {/* Avatar */}
                <Avatar
                  size="2xl"
                  name={contributor.name || contributor.username}
                  src={contributor.avatarUrl}
                  border="4px solid"
                  borderColor={accentColor}
                />

                {/* Info */}
                <VStack align={{ base: 'center', md: 'flex-start' }} flex={1} spacing={3}>
                  <Box textAlign={{ base: 'center', md: 'left' }}>
                    <Flex align="center" gap={3} justify={{ base: 'center', md: 'flex-start' }} wrap="wrap">
                      <Heading size="xl">{contributor.name || contributor.username}</Heading>
                      {contributor.rank && (
                        <Tooltip label="Overall Rank">
                          <Badge colorScheme="yellow" fontSize="lg" px={3} py={1}>
                            <Icon as={FiAward} mr={1} />
                            #{contributor.rank}
                          </Badge>
                        </Tooltip>
                      )}
                      {contributor.activityStatus && (
                        <Badge colorScheme={getStatusColor(contributor.activityStatus)} fontSize="md" px={3} py={1}>
                          {contributor.activityStatus}
                        </Badge>
                      )}
                    </Flex>
                    
                    <Text color={mutedColor} fontSize="lg" mt={1}>
                      @{contributor.username}
                    </Text>
                  </Box>

                  {contributor.bio && (
                    <Text color={mutedColor} maxW="600px" textAlign={{ base: 'center', md: 'left' }}>
                      {contributor.bio}
                    </Text>
                  )}

                  {/* Meta Info */}
                  <HStack spacing={4} wrap="wrap" justify={{ base: 'center', md: 'flex-start' }}>
                    {contributor.company && (
                      <HStack color={mutedColor}>
                        <Icon as={FiBriefcase} />
                        <Text fontSize="sm">{contributor.company}</Text>
                      </HStack>
                    )}
                    {contributor.email && (
                      <HStack color={mutedColor}>
                        <Icon as={FiMail} />
                        <Text fontSize="sm">{contributor.email}</Text>
                      </HStack>
                    )}
                    {contributor.firstContributionDate && (
                      <HStack color={mutedColor}>
                        <Icon as={FiCalendar} />
                        <Text fontSize="sm">
                          Joined {format(new Date(contributor.firstContributionDate), 'MMM yyyy')}
                        </Text>
                      </HStack>
                    )}
                  </HStack>

                  {/* Expertise Tags */}
                  {contributor.expertise && contributor.expertise.length > 0 && (
                    <Flex gap={2} wrap="wrap" justify={{ base: 'center', md: 'flex-start' }}>
                      {contributor.expertise.map(skill => (
                        <Badge key={skill} colorScheme="purple" fontSize="sm">
                          {skill}
                        </Badge>
                      ))}
                    </Flex>
                  )}
                </VStack>
              </Flex>
            </CardBody>
          </Card>

          {/* Stats Cards - Clickable */}
          <SimpleGrid columns={{ base: 2, md: 3, lg: 6 }} spacing={4} mb={6}>
            <Card
              as={NextLink}
              href={`/contributors/${contributor.username}/commits?period=all`}
              bg={cardBg}
              cursor="pointer"
              _hover={{ transform: 'translateY(-4px)', shadow: 'lg', borderColor: accentColor }}
              transition="all 0.2s"
              borderWidth="2px"
              borderColor="transparent"
            >
              <CardBody>
                <Stat>
                  <StatLabel>
                    <Icon as={FiGitCommit} color="purple.500" mr={2} />
                    Commits
                  </StatLabel>
                  <StatNumber fontSize="2xl">{contributor.totals?.commits || 0}</StatNumber>
                  <StatHelpText>All repositories</StatHelpText>
                </Stat>
              </CardBody>
            </Card>

            <Card
              as={NextLink}
              href={`/contributors/${contributor.username}/prs?period=all`}
              bg={cardBg}
              cursor="pointer"
              _hover={{ transform: 'translateY(-4px)', shadow: 'lg', borderColor: accentColor }}
              transition="all 0.2s"
              borderWidth="2px"
              borderColor="transparent"
            >
              <CardBody>
                <Stat>
                  <StatLabel>
                    <Icon as={FiGitPullRequest} color="blue.500" mr={2} />
                    Pull Requests
                  </StatLabel>
                  <StatNumber fontSize="2xl">{contributor.totals?.prsOpened || 0}</StatNumber>
                  <StatHelpText>Opened</StatHelpText>
                </Stat>
              </CardBody>
            </Card>

            <Card
              as={NextLink}
              href={`/contributors/${contributor.username}/reviews?period=all`}
              bg={cardBg}
              cursor="pointer"
              _hover={{ transform: 'translateY(-4px)', shadow: 'lg', borderColor: accentColor }}
              transition="all 0.2s"
              borderWidth="2px"
              borderColor="transparent"
            >
              <CardBody>
                <Stat>
                  <StatLabel>
                    <Icon as={FiEye} color="green.500" mr={2} />
                    Reviews
                  </StatLabel>
                  <StatNumber fontSize="2xl">{contributor.totals?.reviews || 0}</StatNumber>
                  <StatHelpText>Code reviews</StatHelpText>
                </Stat>
              </CardBody>
            </Card>

            <Card
              as={NextLink}
              href={`/contributors/${contributor.username}/comments?period=all`}
              bg={cardBg}
              cursor="pointer"
              _hover={{ transform: 'translateY(-4px)', shadow: 'lg', borderColor: accentColor }}
              transition="all 0.2s"
              borderWidth="2px"
              borderColor="transparent"
            >
              <CardBody>
                <Stat>
                  <StatLabel>
                    <Icon as={FiMessageSquare} color="orange.500" mr={2} />
                    Comments
                  </StatLabel>
                  <StatNumber fontSize="2xl">{contributor.totals?.comments || 0}</StatNumber>
                  <StatHelpText>Discussions</StatHelpText>
                </Stat>
              </CardBody>
            </Card>

            <Card
              as={NextLink}
              href={`/contributors/${contributor.username}/issues?period=all`}
              bg={cardBg}
              cursor="pointer"
              _hover={{ transform: 'translateY(-4px)', shadow: 'lg', borderColor: accentColor }}
              transition="all 0.2s"
              borderWidth="2px"
              borderColor="transparent"
            >
              <CardBody>
                <Stat>
                  <StatLabel>
                    <Icon as={FiAlertCircle} color="red.500" mr={2} />
                    Issues
                  </StatLabel>
                  <StatNumber fontSize="2xl">{contributor.totals?.issuesOpened || 0}</StatNumber>
                  <StatHelpText>Opened</StatHelpText>
                </Stat>
              </CardBody>
            </Card>

            <Card bg={cardBg} borderWidth="2px" borderColor={accentColor}>
              <CardBody>
                <Stat>
                  <StatLabel>
                    <Icon as={FiTrendingUp} color="yellow.500" mr={2} />
                    Activity Score
                  </StatLabel>
                  <StatNumber fontSize="2xl">{contributor.totals?.activityScore || 0}</StatNumber>
                  <StatHelpText>Overall impact</StatHelpText>
                </Stat>
              </CardBody>
            </Card>
          </SimpleGrid>

          {/* Repository Contributions */}
          {contributor.repos && contributor.repos.length > 0 && (
            <Card bg={cardBg} mb={6}>
              <CardHeader>
                <Heading size="md">Repository Contributions</Heading>
              </CardHeader>
              <CardBody>
                <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={4}>
                  {contributor.repos.map(repo => (
                    <Card key={repo.name} variant="outline">
                      <CardBody>
                        <VStack align="stretch" spacing={2}>
                          <Badge colorScheme={getRepoColor(repo.name)} fontSize="md" w="fit-content">
                            {repo.name}
                          </Badge>
                          <Divider />
                          <HStack justify="space-between">
                            <Text fontSize="sm" color={mutedColor}>Commits</Text>
                            <Text fontWeight="bold">{repo.commits}</Text>
                          </HStack>
                          <HStack justify="space-between">
                            <Text fontSize="sm" color={mutedColor}>PRs</Text>
                            <Text fontWeight="bold">{repo.prs}</Text>
                          </HStack>
                          <HStack justify="space-between">
                            <Text fontSize="sm" color={mutedColor}>Reviews</Text>
                            <Text fontWeight="bold">{repo.reviews}</Text>
                          </HStack>
                        </VStack>
                      </CardBody>
                    </Card>
                  ))}
                </Grid>
              </CardBody>
            </Card>
          )}

          {/* Charts Section */}
          <Grid templateColumns={{ base: '1fr', lg: 'repeat(2, 1fr)' }} gap={6} mb={6}>
            {/* Activity Breakdown */}
            {prepareActivityBreakdown().length > 0 && (
              <Card bg={cardBg}>
                <CardHeader>
                  <Heading size="md">Activity Breakdown</Heading>
                </CardHeader>
                <CardBody>
                  <Box h="300px">
                    <Pie
                      data={prepareActivityBreakdown()}
                      angleField="value"
                      colorField="type"
                      radius={0.8}
                      label={{
                        type: 'outer',
                        content: '{name} {percentage}',
                      }}
                      interactions={[{ type: 'element-active' }]}
                    />
                  </Box>
                </CardBody>
              </Card>
            )}

            {/* Repository Distribution */}
            {prepareRepoDistribution().length > 0 && (
              <Card bg={cardBg}>
                <CardHeader>
                  <Heading size="md">Repository Distribution</Heading>
                </CardHeader>
                <CardBody>
                  <Box h="300px">
                    <Column
                      data={prepareRepoDistribution()}
                      xField="repo"
                      yField="value"
                      seriesField="repo"
                      color={['#3182CE', '#805AD5', '#DD6B20']}
                      label={{
                        position: 'top',
                        style: { fill: '#666' },
                      }}
                    />
                  </Box>
                </CardBody>
              </Card>
            )}
          </Grid>

          {/* Activity Trend */}
          {prepareActivityTrendData().length > 0 && (
            <Card bg={cardBg} mb={6}>
              <CardHeader>
                <Heading size="md">Activity Trend (Last 90 Days)</Heading>
              </CardHeader>
              <CardBody>
                <Box h="400px">
                  <Line
                    data={prepareActivityTrendData().flatMap(d => [
                      { date: d.date, value: d.commits, category: 'Commits' },
                      { date: d.date, value: d.prs, category: 'PRs' },
                      { date: d.date, value: d.reviews, category: 'Reviews' },
                    ])}
                    xField="date"
                    yField="value"
                    seriesField="category"
                    smooth
                    animation={{ appear: { animation: 'path-in', duration: 1000 } }}
                  />
                </Box>
              </CardBody>
            </Card>
          )}

          {/* Recent Activity Timeline */}
          {contributor.timeline && contributor.timeline.length > 0 && (
            <Card bg={cardBg}>
              <CardHeader>
                <Flex justify="space-between" align="center" wrap="wrap" gap={4}>
                  <Heading size="md">Recent Activity</Heading>
                  <HStack>
                    <Select
                      value={repoFilter}
                      onChange={(e) => setRepoFilter(e.target.value)}
                      maxW="200px"
                      size="sm"
                    >
                      <option value="">All Repos</option>
                      <option value="EIPs">EIPs</option>
                      <option value="ERCs">ERCs</option>
                      <option value="RIPs">RIPs</option>
                    </Select>
                    <Select
                      value={timelineFilter}
                      onChange={(e) => setTimelineFilter(e.target.value)}
                      maxW="200px"
                      size="sm"
                    >
                      <option value="all">All Types</option>
                      <option value="commit">Commits</option>
                      <option value="pr">Pull Requests</option>
                      <option value="review">Reviews</option>
                      <option value="comment">Comments</option>
                      <option value="issue">Issues</option>
                    </Select>
                  </HStack>
                </Flex>
              </CardHeader>
              <CardBody>
                <VStack align="stretch" spacing={3}>
                  {getFilteredTimeline().map((activity, index) => (
                    <Card key={index} variant="outline" size="sm">
                      <CardBody>
                        <Flex justify="space-between" align="flex-start">
                          <HStack align="flex-start" flex={1}>
                            <Icon
                              as={getActivityIcon(activity.type)}
                              boxSize={5}
                              color={accentColor}
                              mt={1}
                            />
                            <VStack align="flex-start" spacing={1} flex={1}>
                              <HStack>
                                <Badge colorScheme={getRepoColor(activity.repo)}>
                                  {activity.repo}
                                </Badge>
                                <Text fontSize="sm" color={mutedColor} textTransform="capitalize">
                                  {activity.type}
                                </Text>
                                {activity.number && (
                                  <Badge variant="outline">#{activity.number}</Badge>
                                )}
                              </HStack>
                              <Text fontSize="sm">
                                {activity.metadata?.title || activity.metadata?.message || 'Activity'}
                              </Text>
                              <Text fontSize="xs" color={mutedColor}>
                                {format(new Date(activity.timestamp), 'MMM dd, yyyy HH:mm')}
                              </Text>
                            </VStack>
                          </HStack>
                          {activity.url && (
                            <Button
                              as="a"
                              href={activity.url}
                              target="_blank"
                              size="sm"
                              variant="ghost"
                              colorScheme="blue"
                            >
                              View
                            </Button>
                          )}
                        </Flex>
                      </CardBody>
                    </Card>
                  ))}
                </VStack>
              </CardBody>
            </Card>
          )}
        </Container>
      </Box>
    </AllLayout>
  );
};

export default ContributorProfile;
