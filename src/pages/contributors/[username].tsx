import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import {
  Box, Heading, Text, Flex, Badge, VStack, HStack, useColorModeValue,
  Spinner, Alert, AlertIcon, Avatar, Card, CardBody, CardHeader, SimpleGrid,
  Stat, StatLabel, StatNumber, StatHelpText, Icon, Tabs, TabList, Tab,
  TabPanels, TabPanel, Divider, Button, Select, Container, Tooltip,
  Progress, Grid, GridItem, Collapse, IconButton, Link,
} from '@chakra-ui/react';
import { ChevronUpIcon, ChevronDownIcon } from '@chakra-ui/icons';
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
  const [showFAQ, setShowFAQ] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    setError(null);
    try {
      const response = await axios.get(`/api/contributors/${username}`);
      
      // Validate response data
      if (!response.data) {
        setError('No contributor data available');
        setContributor(null);
        return;
      }
      
      setContributor(response.data);
    } catch (error: any) {
      console.error('Failed to fetch contributor:', error);
      setError(error.response?.data?.message || 'Failed to load contributor profile. Please try again later.');
      setContributor(null);
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
    
    return filtered.slice(0, 100); // Show up to 100 activities
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

  if (!contributor && !loading) {
    return (
      <AllLayout>
        <Container maxW="container.xl" py={8}>
          <Alert status="error" borderRadius="md">
            <AlertIcon />
            <Box flex="1">
              <Text fontWeight="bold">Contributor Not Found</Text>
              <Text fontSize="sm">{error || 'The contributor profile you are looking for does not exist.'}</Text>
            </Box>
            <Button size="sm" onClick={fetchContributor} colorScheme="red" variant="outline" ml={4}>
              Retry
            </Button>
          </Alert>
          <Button as={NextLink} href="/contributors" mt={4} colorScheme="blue">
            ← Back to Contributors
          </Button>
        </Container>
      </AllLayout>
    );
  }

  // Safety check for TypeScript
  if (!contributor) {
    return null;
  }

  return (
    <AllLayout>
      <Head>
        <title>{contributor.name || contributor.username} - Contributor Profile | EIPsInsight</title>
        <meta name="description" content={`Profile and contributions of ${contributor.name || contributor.username}`} />
      </Head>

      <Box bg={bgColor} minH="100vh" py={8}>
        <Container maxW="container.xl">
          {/* Back Button */}
          <Button as={NextLink} href="/contributors" mb={4} variant="ghost" leftIcon={<Text>←</Text>}>
            Back to Contributors
          </Button>

          {/* FAQ Section */}
          <Card bg={cardBg} mb={6} borderWidth="2px" borderColor={useColorModeValue('blue.200', 'blue.600')}>
            <CardBody>
              <Flex justify="space-between" align="center" cursor="pointer" onClick={() => setShowFAQ(!showFAQ)}>
                <Heading size="md" color={useColorModeValue('blue.700', 'blue.300')}>
                  📚 Profile Information
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
                      This is the detailed profile of {contributor?.name || contributor?.username}, showing all their contributions across EIPs, ERCs, and RIPs repositories including commits, pull requests, reviews, and activity trends.
                    </Text>
                  </Box>
                  <Box p={3} bg={useColorModeValue('purple.50', 'gray.700')} borderRadius="md" borderLeftWidth="3px" borderLeftColor="purple.500">
                    <Heading size="sm" mb={2}>📊 Understanding the Stats</Heading>
                    <Text fontSize="sm" color={mutedColor}>
                      The stat cards show total contributions: commits (code changes), pull requests (proposed changes), reviews (code reviews), comments (discussions), issues (reported problems), and an overall activity score.
                    </Text>
                  </Box>
                  <Box p={3} bg={useColorModeValue('green.50', 'gray.700')} borderRadius="md" borderLeftWidth="3px" borderLeftColor="green.500">
                    <Heading size="sm" mb={2}>📈 Activity Trends</Heading>
                    <Text fontSize="sm" color={mutedColor}>
                      Charts visualize contribution patterns over time, repository distribution showing where they contribute most, and activity breakdown by type. Use filters to view specific repositories or activity types.
                    </Text>
                  </Box>
                  <Box p={3} bg={useColorModeValue('orange.50', 'gray.700')} borderRadius="md" borderLeftWidth="3px" borderLeftColor="orange.500">
                    <Heading size="sm" mb={2}>⚙️ Data Updates</Heading>
                    <Text fontSize="sm" color={mutedColor}>
                      Profile data is automatically synchronized every 24 hours from GitHub. Activity scores and trends reflect real-time contribution metrics across all tracked repositories.
                    </Text>
                  </Box>
                </VStack>
              </Collapse>
            </CardBody>
          </Card>

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

          {/* Stats Cards - Clickable Analytics */}
          <SimpleGrid columns={{ base: 2, md: 3, lg: 6 }} spacing={4} mb={6}>
            <Link
              as={NextLink}
              href={`/contributors/${contributor.username}/commits?period=all`}
              _hover={{ textDecoration: 'none' }}
            >
              <Card
                bg={cardBg}
                cursor="pointer"
                _hover={{ 
                  transform: 'translateY(-8px)', 
                  shadow: 'xl', 
                  borderColor: 'purple.500',
                  bgGradient: useColorModeValue('linear(to-br, purple.50, blue.50)', 'linear(to-br, purple.900, blue.900)')
                }}
                transition="all 0.3s"
                borderWidth="2px"
                borderColor="transparent"
                position="relative"
                overflow="hidden"
              >
                <Box position="absolute" top={0} right={0} p={2} opacity={0.3}>
                  <Icon as={FiGitCommit} boxSize={12} color="purple.300" />
                </Box>
                <CardBody position="relative">
                  <Stat>
                    <StatLabel>
                      <Icon as={FiGitCommit} color="purple.500" mr={2} />
                      Commits
                    </StatLabel>
                    <StatNumber fontSize="3xl" color="purple.600">{contributor.totals?.commits || 0}</StatNumber>
                    <StatHelpText>👉 View Details</StatHelpText>
                  </Stat>
                </CardBody>
              </Card>
            </Link>

            <Link
              as={NextLink}
              href={`/contributors/${contributor.username}/prs?period=all`}
              _hover={{ textDecoration: 'none' }}
            >
              <Card
                bg={cardBg}
                cursor="pointer"
                _hover={{ 
                  transform: 'translateY(-8px)', 
                  shadow: 'xl', 
                  borderColor: 'blue.500',
                  bgGradient: useColorModeValue('linear(to-br, blue.50, cyan.50)', 'linear(to-br, blue.900, cyan.900)')
                }}
                transition="all 0.3s"
                borderWidth="2px"
                borderColor="transparent"
                position="relative"
                overflow="hidden"
              >
                <Box position="absolute" top={0} right={0} p={2} opacity={0.3}>
                  <Icon as={FiGitPullRequest} boxSize={12} color="blue.300" />
                </Box>
                <CardBody position="relative">
                  <Stat>
                    <StatLabel>
                      <Icon as={FiGitPullRequest} color="blue.500" mr={2} />
                      Pull Requests
                    </StatLabel>
                    <StatNumber fontSize="3xl" color="blue.600">{contributor.totals?.prsOpened || 0}</StatNumber>
                    <StatHelpText>👉 View Details</StatHelpText>
                  </Stat>
                </CardBody>
              </Card>
            </Link>

            <Link
              as={NextLink}
              href={`/contributors/${contributor.username}/reviews?period=all`}
              _hover={{ textDecoration: 'none' }}
            >
              <Card
                bg={cardBg}
                cursor="pointer"
                _hover={{ 
                  transform: 'translateY(-8px)', 
                  shadow: 'xl', 
                  borderColor: 'green.500',
                  bgGradient: useColorModeValue('linear(to-br, green.50, teal.50)', 'linear(to-br, green.900, teal.900)')
                }}
                transition="all 0.3s"
                borderWidth="2px"
                borderColor="transparent"
                position="relative"
                overflow="hidden"
              >
                <Box position="absolute" top={0} right={0} p={2} opacity={0.3}>
                  <Icon as={FiEye} boxSize={12} color="green.300" />
                </Box>
                <CardBody position="relative">
                  <Stat>
                    <StatLabel>
                      <Icon as={FiEye} color="green.500" mr={2} />
                      Reviews
                    </StatLabel>
                    <StatNumber fontSize="3xl" color="green.600">{contributor.totals?.reviews || 0}</StatNumber>
                    <StatHelpText>👉 View Details</StatHelpText>
                  </Stat>
                </CardBody>
              </Card>
            </Link>

            <Link
              as={NextLink}
              href={`/contributors/${contributor.username}/comments?period=all`}
              _hover={{ textDecoration: 'none' }}
            >
              <Card
                bg={cardBg}
                cursor="pointer"
                _hover={{ 
                  transform: 'translateY(-8px)', 
                  shadow: 'xl', 
                  borderColor: 'orange.500',
                  bgGradient: useColorModeValue('linear(to-br, orange.50, yellow.50)', 'linear(to-br, orange.900, yellow.900)')
                }}
                transition="all 0.3s"
                borderWidth="2px"
                borderColor="transparent"
                position="relative"
                overflow="hidden"
              >
                <Box position="absolute" top={0} right={0} p={2} opacity={0.3}>
                  <Icon as={FiMessageSquare} boxSize={12} color="orange.300" />
                </Box>
                <CardBody position="relative">
                  <Stat>
                    <StatLabel>
                      <Icon as={FiMessageSquare} color="orange.500" mr={2} />
                      Comments
                    </StatLabel>
                    <StatNumber fontSize="3xl" color="orange.600">{contributor.totals?.comments || 0}</StatNumber>
                    <StatHelpText>👉 View Details</StatHelpText>
                  </Stat>
                </CardBody>
              </Card>
            </Link>

            <Link
              as={NextLink}
              href={`/contributors/${contributor.username}/issues?period=all`}
              _hover={{ textDecoration: 'none' }}
            >
              <Card
                bg={cardBg}
                cursor="pointer"
                _hover={{ 
                  transform: 'translateY(-8px)', 
                  shadow: 'xl', 
                  borderColor: 'red.500',
                  bgGradient: useColorModeValue('linear(to-br, red.50, pink.50)', 'linear(to-br, red.900, pink.900)')
                }}
                transition="all 0.3s"
                borderWidth="2px"
                borderColor="transparent"
                position="relative"
                overflow="hidden"
              >
                <Box position="absolute" top={0} right={0} p={2} opacity={0.3}>
                  <Icon as={FiAlertCircle} boxSize={12} color="red.300" />
                </Box>
                <CardBody position="relative">
                  <Stat>
                    <StatLabel>
                      <Icon as={FiAlertCircle} color="red.500" mr={2} />
                      Issues
                    </StatLabel>
                    <StatNumber fontSize="3xl" color="red.600">{contributor.totals?.issuesOpened || 0}</StatNumber>
                    <StatHelpText>👉 View Details</StatHelpText>
                  </Stat>
                </CardBody>
              </Card>
            </Link>

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

          {/* Overall Activity Timeline */}
          {contributor.timeline && contributor.timeline.length > 0 && (
            <Card bg={cardBg} overflow="hidden">
              <CardHeader bgGradient="linear(to-r, blue.500, purple.600)" py={6}>
                <Flex justify="space-between" align="center" wrap="wrap" gap={4}>
                  <VStack align="flex-start" spacing={1}>
                    <Heading size="lg" color="white">
                      📅 Overall Activity Timeline
                    </Heading>
                    <Text color="whiteAlpha.900" fontSize="sm">
                      Complete contribution history
                    </Text>
                  </VStack>
                  <HStack>
                    <Select
                      value={repoFilter}
                      onChange={(e) => setRepoFilter(e.target.value)}
                      maxW="200px"
                      size="sm"
                      bg="white"
                      color="gray.800"
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
                      bg="white"
                      color="gray.800"
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
              <CardBody p={6}>
                <VStack align="stretch" spacing={0} position="relative">
                  {/* Vertical Timeline Line */}
                  <Box
                    position="absolute"
                    left="30px"
                    top="0"
                    bottom="0"
                    width="2px"
                    bgGradient="linear(to-b, blue.400, purple.400)"
                    zIndex={0}
                  />
                  
                  {getFilteredTimeline().map((activity, index) => (
                    <Flex key={index} position="relative" pb={6} _last={{ pb: 0 }}>
                      {/* Timeline Dot */}
                      <Box
                        position="absolute"
                        left="22px"
                        top="6px"
                        width="18px"
                        height="18px"
                        borderRadius="full"
                        bg={cardBg}
                        borderWidth="3px"
                        borderColor={getRepoColor(activity.repo) + '.500'}
                        zIndex={1}
                        boxShadow="0 0 0 4px"
                        sx={{
                          boxShadowColor: useColorModeValue('white', 'gray.800'),
                        }}
                      />
                      
                      {/* Timeline Content */}
                      <Box ml="60px" flex={1}>
                        <Card
                          variant="outline"
                          borderLeftWidth="4px"
                          borderLeftColor={getRepoColor(activity.repo) + '.500'}
                          _hover={{
                            shadow: 'md',
                            transform: 'translateX(4px)',
                            borderLeftColor: getRepoColor(activity.repo) + '.600',
                          }}
                          transition="all 0.2s"
                          bg={useColorModeValue(
                            activity.type === 'pr' ? 'blue.50' :
                            activity.type === 'commit' ? 'purple.50' :
                            activity.type === 'review' ? 'green.50' :
                            activity.type === 'comment' ? 'orange.50' :
                            'gray.50',
                            'gray.700'
                          )}
                        >
                          <CardBody>
                            <Flex justify="space-between" align="flex-start" gap={4}>
                              <HStack align="flex-start" flex={1} spacing={3}>
                                <Icon
                                  as={getActivityIcon(activity.type)}
                                  boxSize={6}
                                  color={getRepoColor(activity.repo) + '.600'}
                                  mt={0.5}
                                />
                                <VStack align="flex-start" spacing={2} flex={1}>
                                  <HStack wrap="wrap">
                                    <Badge 
                                      colorScheme={getRepoColor(activity.repo)} 
                                      fontSize="sm"
                                      px={2}
                                      py={0.5}
                                      borderRadius="md"
                                    >
                                      {activity.repo}
                                    </Badge>
                                    <Badge 
                                      variant="subtle"
                                      colorScheme="gray"
                                      fontSize="xs"
                                      textTransform="capitalize"
                                    >
                                      {activity.type}
                                    </Badge>
                                    {activity.number && (
                                      <Badge variant="outline" colorScheme="blue" fontSize="xs">
                                        #{activity.number}
                                      </Badge>
                                    )}
                                  </HStack>
                                  <Text fontSize="md" fontWeight="medium" lineHeight="1.5">
                                    {activity.metadata?.title || activity.metadata?.message || 'Activity'}
                                  </Text>
                                  <HStack fontSize="xs" color={mutedColor}>
                                    <Icon as={FiCalendar} />
                                    <Text>
                                      {format(new Date(activity.timestamp), 'MMM dd, yyyy · HH:mm')}
                                    </Text>
                                  </HStack>
                                </VStack>
                              </HStack>
                              {activity.url && (
                                <Button
                                  as="a"
                                  href={activity.url}
                                  target="_blank"
                                  size="sm"
                                  colorScheme="blue"
                                  variant="outline"
                                  leftIcon={<Text>🔗</Text>}
                                  flexShrink={0}
                                >
                                  View
                                </Button>
                              )}
                            </Flex>
                          </CardBody>
                        </Card>
                      </Box>
                    </Flex>
                  ))}
                </VStack>
                
                {/* Show more indicator */}
                {contributor.timeline.length > 100 && (
                  <Box textAlign="center" mt={6} pt={6} borderTopWidth="1px" borderColor={borderColor}>
                    <Text color={mutedColor} fontSize="sm" mb={2}>
                      Showing first 100 activities · Total: {contributor.timeline.length} activities
                    </Text>
                    <Text color={mutedColor} fontSize="xs">
                      Use filters above to refine results
                    </Text>
                  </Box>
                )}
              </CardBody>
            </Card>
          )}
        </Container>
      </Box>
    </AllLayout>
  );
};

export default ContributorProfile;
