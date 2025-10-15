import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Grid,
  GridItem,
  Card,
  CardHeader,
  CardBody,
  Flex,
  Badge,
  Avatar,
  VStack,
  HStack,
  Select,
  Button,
  useColorModeValue,
  Spinner,
  Alert,
  AlertIcon,
  Tab,
  Tabs,
  TabList,
  TabPanel,
  TabPanels,
  useToast,
} from '@chakra-ui/react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { DownloadIcon, CalendarIcon, StarIcon } from '@chakra-ui/icons';
import Head from 'next/head';
import { motion } from 'framer-motion';

// Import new enhanced chart components
import CommitsTimelineChart from '@/components/contributors/CommitsTimelineChart';
import TopContributorsLeaderboard from '@/components/contributors/TopContributorsLeaderboard';
import CommitsAggregationChart from '@/components/contributors/CommitsAggregationChart';
import ContributorsActivityHeatmap from '@/components/contributors/ContributorsActivityHeatmap';
import ContributorsComparisonRadar from '@/components/contributors/ContributorsComparisonRadar';
import SuperEnhancedStatsCards from '@/components/contributors/SuperEnhancedStatsCards';
import ContributorsLoadingState from '@/components/contributors/ContributorsLoadingState';
import ContributorsGrowthChart from '@/components/contributors/ContributorsGrowthChart';
import ContributorsPageFooter from '@/components/contributors/ContributorsPageFooter';
import AllLayout from '@/components/Layout';

interface Contributor {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  name?: string;
  company?: string;
  blog?: string;
  location?: string;
  bio?: string;
  public_repos: number;
  followers: number;
  following: number;
  total_commits: number;
  total_additions: number;
  total_deletions: number;
  first_commit_date?: Date;
  last_commit_date?: Date;
  weeks: Array<{
    week: Date;
    additions: number;
    deletions: number;
    commits: number;
  }>;
  avg_commits_per_week: number;
  max_commits_in_week: number;
  active_weeks_count: number;
  contribution_streak: number;
  days_since_last_commit: number;
  recent_commits: Array<{
    sha: string;
    message: string;
    date: Date;
    url?: string;
  }>;
  repository: string;
  rank: number;
  contribution_percentage: number;
  impact_score: number;
  contributor_type: 'core' | 'regular' | 'occasional' | 'one-time';
  last_updated: Date;
  data_completeness: number;
}

interface RepoStats {
  repository: string;
  total_contributors: number;
  total_commits: number;
  total_additions: number;
  total_deletions: number;
  repository_age_days: number;
  avg_commits_per_day: number;
  contributor_distribution: {
    core_contributors: number;
    regular_contributors: number;
    occasional_contributors: number;
    one_time_contributors: number;
    bus_factor: number;
  };
  top_contributors: Array<{
    login: string;
    commits: number;
    additions: number;
    deletions: number;
    rank: number;
    contribution_percentage: number;
    first_commit: Date;
    last_commit: Date;
  }>;
  weekly_activity: Array<{
    week: Date;
    total_commits: number;
    total_additions: number;
    total_deletions: number;
    active_contributors: number;
    new_contributors?: number;
    avg_commit_size: number;
  }>;
  monthly_trends: Array<{
    month: string;
    commits: number;
    contributors: number;
    new_contributors: number;
    additions: number;
    deletions: number;
    net_change: number;
  }>;
  collaboration_score: number;
  contributor_retention: number;
  growth_trend: string;
  health_score: number;
  summary_text: string;
  last_updated: Date;
}

const MotionBox = motion(Box);

const ContributorsPage: React.FC = () => {
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [repoStats, setRepoStats] = useState<RepoStats[]>([]);
  const [selectedRepo, setSelectedRepo] = useState<string>('EIPs');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<string>('all');
  
  const toast = useToast();
  
  // Color mode values
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.800', 'white');
  const mutedColor = useColorModeValue('gray.600', 'gray.400');
  const cardBg = useColorModeValue('white', 'gray.700');
  
  // Chart colors
  const colors = ['#4299E1', '#48BB78', '#ED8936', '#9F7AEA', '#38B2AC', '#F56565', '#D69E2E'];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch contributors and repo stats in parallel
      const [contributorsResponse, repoStatsResponse] = await Promise.all([
        fetch('/api/contributors'),
        fetch('/api/repository-stats')
      ]);
      
      if (!contributorsResponse.ok || !repoStatsResponse.ok) {
        throw new Error('Failed to fetch data');
      }
      
      const contributorsData = await contributorsResponse.json();
      const repoStatsData = await repoStatsResponse.json();
      
      // Handle both direct array and wrapped response formats
      setContributors(Array.isArray(contributorsData) ? contributorsData : contributorsData.data || []);
      setRepoStats(Array.isArray(repoStatsData) ? repoStatsData : [repoStatsData]);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
      toast({
        title: 'Error fetching data',
        description: 'Could not load contributor statistics',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  // Get current repo stats
  const currentRepoStats = repoStats.find(stats => stats.repository === selectedRepo);
  
  // Get contributors for selected repository
  const repoContributors = contributors.filter(c => c.repository === selectedRepo);
  
  // Get top contributors
  const topContributors = repoContributors
    .sort((a, b) => b.total_commits - a.total_commits)
    .slice(0, 10);

  // Prepare weekly activity data for charts
  const weeklyData = currentRepoStats?.weekly_activity
    ?.slice(-26) // Last 26 weeks
    ?.map(week => ({
      week: new Date(week.week).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      commits: week.total_commits,
      additions: week.total_additions,
      deletions: week.total_deletions,
      contributors: week.active_contributors,
    })) || [];

  // Prepare top contributors data for bar chart
  const topContributorsChartData = topContributors.map(contributor => ({
    name: contributor.login,
    commits: contributor.total_commits,
    additions: contributor.total_additions,
    deletions: contributor.total_deletions,
  }));

  // Repository distribution pie chart data
  const repoDistribution = repoStats.map(stats => ({
    name: stats.repository,
    value: stats.total_contributors,
  }));

  const downloadCSV = () => {
    const csvData = [
      ['Repository', 'Contributor', 'Rank', 'Commits', 'Additions', 'Deletions', 'Last Updated'],
      ...repoContributors.map(c => [
        c.repository,
        c.login,
        c.rank,
        c.total_commits,
        c.total_additions,
        c.total_deletions,
        new Date(c.last_updated).toISOString(),
      ])
    ];
    
    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedRepo}-contributors-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <Container maxW="container.xl" py={8}>
        <ContributorsLoadingState />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxW="container.xl" py={8}>
        <Alert status="error" borderRadius="md">
          <AlertIcon />
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <>
    <AllLayout>
      <Head>
        <title>Contributors Dashboard - EIPs Insight</title>
        <meta name="description" content="Comprehensive analytics for Ethereum EIP contributors" />
      </Head>
      
      <Box w="full" py={8} px={4} bg={useColorModeValue('gray.50', 'gray.900')}>
        <VStack spacing={10} align="stretch" maxW="1600px" mx="auto">
          {/* Enhanced Header */}
          <MotionBox
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Box
              bg={`linear-gradient(135deg, ${useColorModeValue('blue.50', 'blue.900')} 0%, ${useColorModeValue('purple.50', 'purple.900')} 100%)`}
              borderRadius="2xl"
              p={8}
              mb={8}
              border="1px solid"
              borderColor={borderColor}
              position="relative"
              overflow="hidden"
            >
              {/* Background Decoration */}
              <Box
                position="absolute"
                top="-50px"
                right="-50px"
                width="200px"
                height="200px"
                borderRadius="full"
                bg={useColorModeValue('blue.100', 'blue.800')}
                opacity={0.3}
              />
              <Box
                position="absolute"
                bottom="-30px"
                left="-30px"
                width="150px"
                height="150px"
                borderRadius="full"
                bg={useColorModeValue('purple.100', 'purple.800')}
                opacity={0.3}
              />

              <Flex justify="space-between" align="center" position="relative" zIndex={1}>
                <VStack align="start" spacing={3}>
                  <HStack spacing={3}>
                    <Text fontSize="4xl">🏆</Text>
                    <VStack align="start" spacing={1}>
                      <Heading size="2xl" color="blue.500" fontWeight="bold">
                        Contributors Analytics
                      </Heading>
                      <Text color={mutedColor} fontSize="lg" fontWeight="medium">
                        Comprehensive insights for Ethereum ecosystem contributors
                      </Text>
                    </VStack>
                  </HStack>
                  
                  <HStack spacing={4} wrap="wrap">
                    <Badge colorScheme="blue" variant="subtle" px={3} py={1} borderRadius="full">
                      📊 Interactive Charts
                    </Badge>
                    <Badge colorScheme="green" variant="subtle" px={3} py={1} borderRadius="full">
                      📈 Real-time Data
                    </Badge>
                    <Badge colorScheme="purple" variant="subtle" px={3} py={1} borderRadius="full">
                      🎯 Advanced Analytics
                    </Badge>
                  </HStack>
                </VStack>
                
                <VStack spacing={4} align="end">
                  <HStack spacing={4}>
                    <Box>
                      <Text fontSize="sm" fontWeight="bold" color={textColor} mb={2}>
                        Repository:
                      </Text>
                      <Select
                        value={selectedRepo}
                        onChange={(e) => setSelectedRepo(e.target.value)}
                        minW="200px"
                        bg={cardBg}
                        borderColor={borderColor}
                        borderRadius="lg"
                        shadow="md"
                        _hover={{ borderColor: 'blue.400' }}
                        _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px var(--chakra-colors-blue-500)' }}
                      >
                        <option value="EIPs">📜 EIPs Repository</option>
                        <option value="ERCs">🔗 ERCs Repository</option>
                        <option value="RIPs">⚡ RIPs Repository</option>
                      </Select>
                    </Box>
                  </HStack>
                  
                  <HStack spacing={3}>
                    <Button
                      leftIcon={<DownloadIcon />}
                      colorScheme="blue"
                      variant="solid"
                      onClick={downloadCSV}
                      shadow="md"
                      _hover={{ transform: 'translateY(-2px)', shadow: 'lg' }}
                      transition="all 0.2s"
                    >
                      Export Data
                    </Button>
                    <Button
                      leftIcon={<StarIcon />}
                      colorScheme="purple"
                      variant="outline"
                      onClick={() => window.open(
                        selectedRepo === 'EIPs' ? 'https://github.com/ethereum/EIPs' :
                        selectedRepo === 'ERCs' ? 'https://github.com/ethereum/ERCs' :
                        'https://github.com/ethereum/RIPs',
                        '_blank'
                      )}
                      shadow="md"
                      _hover={{ transform: 'translateY(-2px)', shadow: 'lg' }}
                      transition="all 0.2s"
                    >
                      View on GitHub
                    </Button>
                  </HStack>
                </VStack>
              </Flex>
            </Box>
          </MotionBox>

          {/* Enhanced Summary Stats */}
          {currentRepoStats && (
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <SuperEnhancedStatsCards 
                repoStats={currentRepoStats}
                selectedRepo={selectedRepo}
              />
            </MotionBox>
          )}

          {/* Enhanced Charts Section */}
          <Box
            bg={cardBg}
            borderRadius="2xl"
            border="1px solid"
            borderColor={borderColor}
            shadow="xl"
            overflow="hidden"
          >
            <Tabs variant="enclosed" colorScheme="blue" w="full">
            <TabList>
              <Tab>📈 Timeline Analytics</Tab>
              <Tab>🏆 Leaderboard</Tab>
              <Tab>📊 Activity Patterns</Tab>
              <Tab>📈 Growth Analytics</Tab>
              <Tab>🎯 Comparison Radar</Tab>
              <Tab>🗂️ Contributor Rankings</Tab>
            </TabList>

            <TabPanels>
              {/* Timeline Analytics */}
              <TabPanel p={6} mt={0}>
                <Box w="full" maxW="100%" overflow="hidden">
                  <VStack spacing={8} align="stretch" w="full">
                  {/* Interactive Commits Timeline with DataZoom */}
                  <CommitsTimelineChart 
                    data={weeklyData.map(item => ({
                      date: item.week,
                      commits: item.commits || 0,
                      additions: item.additions || 0,
                      deletions: item.deletions || 0,
                      contributors: item.contributors || 0
                    }))}
                    title={`${selectedRepo} - Interactive Commits Timeline`}
                  />
                  
                  {/* Aggregation Chart with Time Period Controls */}
                  <CommitsAggregationChart
                    data={weeklyData.map(item => ({
                      date: item.week,
                      commits: item.commits || 0,
                      additions: item.additions || 0,
                      deletions: item.deletions || 0,
                      contributors: item.contributors || 0
                    }))}
                    title={`${selectedRepo} - Commits Aggregation Analysis`}
                  />
                  </VStack>
                </Box>
              </TabPanel>

              {/* Enhanced Leaderboard */}
              <TabPanel p={6} mt={0}>
                <Box w="full" maxW="100%" overflow="hidden">
                <TopContributorsLeaderboard
                  contributors={repoContributors}
                  title={`${selectedRepo} - Top Contributors Leaderboard`}
                  showCount={20}
                />
                </Box>
              </TabPanel>

              {/* Activity Patterns */}
              <TabPanel p={6} mt={0}>
                <Box w="full" maxW="100%" overflow="hidden">
                  <VStack spacing={8} align="stretch" w="full">
                  {/* GitHub-style Activity Heatmap */}
                  <ContributorsActivityHeatmap
                    contributors={repoContributors.map(contributor => ({
                      ...contributor,
                      weeks: contributor.weeks || []
                    }))}
                    title={`${selectedRepo} - Contributors Activity Heatmap`}
                    showTopN={15}
                  />
                  
                  {/* Original Repository Stats for Legacy Support */}
                  <Grid templateColumns="1fr 1fr" gap={6}>
                    <Card bg={cardBg} borderColor={borderColor} shadow="lg" borderRadius="xl">
                      <CardHeader>
                        <Heading size="md" color="blue.500">Repository Stats Comparison</Heading>
                        <Text color={mutedColor} fontSize="sm">
                          Compare metrics across all repositories
                        </Text>
                      </CardHeader>
                      <CardBody>
                        <Box h="300px">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={repoStats}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="repository" />
                              <YAxis />
                              <Tooltip />
                              <Legend />
                              <Bar dataKey="total_commits" fill="#4299E1" name="Commits" radius={[4, 4, 0, 0]} />
                              <Bar dataKey="total_contributors" fill="#48BB78" name="Contributors" radius={[4, 4, 0, 0]} />
                            </BarChart>
                          </ResponsiveContainer>
                        </Box>
                      </CardBody>
                    </Card>

                    <Card bg={cardBg} borderColor={borderColor} shadow="lg" borderRadius="xl">
                      <CardHeader>
                        <Heading size="md" color="blue.500">Quick Stats</Heading>
                        <Text color={mutedColor} fontSize="sm">
                          Key metrics at a glance
                        </Text>
                      </CardHeader>
                      <CardBody>
                        <VStack spacing={4} align="stretch">
                          <Stat>
                            <StatLabel>Average Commits per Contributor</StatLabel>
                            <StatNumber color="blue.500">
                              {currentRepoStats ? Math.round(currentRepoStats.total_commits / currentRepoStats.total_contributors) : 0}
                            </StatNumber>
                          </Stat>
                          <Stat>
                            <StatLabel>Lines Changed per Commit</StatLabel>
                            <StatNumber color="green.500">
                              {currentRepoStats ? Math.round((currentRepoStats.total_additions + currentRepoStats.total_deletions) / currentRepoStats.total_commits) : 0}
                            </StatNumber>
                          </Stat>
                          <Stat>
                            <StatLabel>Net Code Growth</StatLabel>
                            <StatNumber color="orange.500">
                              {currentRepoStats ? (currentRepoStats.total_additions - currentRepoStats.total_deletions).toLocaleString() : 0}
                            </StatNumber>
                          </Stat>
                        </VStack>
                      </CardBody>
                    </Card>
                  </Grid>
                  </VStack>
                </Box>
              </TabPanel>

              {/* Growth Analytics */}
              <TabPanel p={6} mt={0}>
                <Box w="full" maxW="100%" overflow="hidden">
                <ContributorsGrowthChart
                  contributors={repoContributors}
                  title={`${selectedRepo} - Contributor Growth & Retention Analysis`}
                />
                </Box>
              </TabPanel>

              {/* Comparison Radar */}
              <TabPanel p={6} mt={0}>
                <Box w="full" maxW="100%" overflow="hidden">
                <ContributorsComparisonRadar
                  contributors={repoContributors}
                  title={`${selectedRepo} - Multi-Dimensional Contributor Analysis`}
                />
                </Box>
              </TabPanel>

              {/* Enhanced Contributor Rankings */}
              <TabPanel p={6} mt={0}>
                <Box w="full" maxW="100%" overflow="hidden">
                <Card bg={cardBg} borderColor={borderColor} shadow="lg" borderRadius="xl">
                  <CardHeader>
                    <Heading size="md" color="blue.500">All Contributors - {selectedRepo}</Heading>
                    <Text color={mutedColor} fontSize="sm">
                      Complete ranking of contributors in {selectedRepo} repository with enhanced visuals
                    </Text>
                  </CardHeader>
                  <CardBody>
                    <Grid templateColumns="repeat(auto-fill, minmax(320px, 1fr))" gap={6}>
                      {repoContributors.map((contributor, index) => {
                        const getRankColor = (rank: number) => {
                          if (rank === 1) return 'gold';
                          if (rank === 2) return 'gray';
                          if (rank === 3) return 'orange';
                          if (rank <= 10) return 'blue';
                          return 'gray';
                        };

                        const getRankEmoji = (rank: number) => {
                          if (rank === 1) return '🥇';
                          if (rank === 2) return '🥈';
                          if (rank === 3) return '🥉';
                          if (rank <= 10) return '🏆';
                          return '🎖️';
                        };

                        return (
                          <Box
                            key={contributor.login}
                            p={5}
                            border="2px"
                            borderColor={borderColor}
                            borderRadius="xl"
                            bg={cardBg}
                            _hover={{ 
                              borderColor: `${getRankColor(contributor.rank)}.400`, 
                              shadow: 'xl',
                              transform: 'translateY(-4px)'
                            }}
                            transition="all 0.3s ease"
                            position="relative"
                            overflow="hidden"
                          >
                            {/* Rank Badge */}
                            <Badge
                              position="absolute"
                              top={2}
                              right={2}
                              colorScheme={getRankColor(contributor.rank)}
                              fontSize="xs"
                              px={2}
                              py={1}
                              borderRadius="full"
                            >
                              #{contributor.rank}
                            </Badge>

                            <VStack spacing={4} align="center">
                              <HStack spacing={3}>
                                <Text fontSize="2xl">{getRankEmoji(contributor.rank)}</Text>
                                <Avatar 
                                  size="lg" 
                                  src={contributor.avatar_url}
                                  border="3px solid"
                                  borderColor={`${getRankColor(contributor.rank)}.400`}
                                />
                                <VStack align="start" spacing={0}>
                                  <Text fontWeight="bold" fontSize="lg">
                                    {contributor.login}
                                  </Text>
                                  <Text fontSize="sm" color={mutedColor}>
                                    @{contributor.login}
                                  </Text>
                                </VStack>
                              </HStack>
                              
                              <Grid templateColumns="repeat(3, 1fr)" gap={4} width="100%">
                                <VStack spacing={1}>
                                  <Text fontSize="xl" fontWeight="bold" color="blue.500">
                                    {contributor.total_commits.toLocaleString()}
                                  </Text>
                                  <Text fontSize="xs" color={mutedColor} textAlign="center">
                                    Commits
                                  </Text>
                                </VStack>
                                <VStack spacing={1}>
                                  <Text fontSize="lg" fontWeight="bold" color="green.500">
                                    +{contributor.total_additions.toLocaleString()}
                                  </Text>
                                  <Text fontSize="xs" color={mutedColor} textAlign="center">
                                    Additions
                                  </Text>
                                </VStack>
                                <VStack spacing={1}>
                                  <Text fontSize="lg" fontWeight="bold" color="red.500">
                                    -{contributor.total_deletions.toLocaleString()}
                                  </Text>
                                  <Text fontSize="xs" color={mutedColor} textAlign="center">
                                    Deletions
                                  </Text>
                                </VStack>
                              </Grid>

                              <Button
                                size="sm"
                                colorScheme={getRankColor(contributor.rank)}
                                variant="outline"
                                width="100%"
                                leftIcon={<StarIcon />}
                                onClick={() => window.open(`https://github.com/${contributor.login}`, '_blank')}
                              >
                                View GitHub Profile
                              </Button>
                            </VStack>
                          </Box>
                        );
                      })}
                    </Grid>
                  </CardBody>
                </Card>
                </Box>
              </TabPanel>
            </TabPanels>
            </Tabs>
          </Box>

          {/* Enhanced Footer Section */}
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <ContributorsPageFooter
              selectedRepo={selectedRepo}
              totalContributors={currentRepoStats?.total_contributors || repoContributors.length}
              lastUpdated={currentRepoStats?.last_updated}
            />
          </MotionBox>

          {/* Summary Section */}
          {currentRepoStats?.summary_text && (
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card bg={cardBg} borderColor={borderColor} shadow="lg" borderRadius="xl">
                <CardHeader>
                  <Heading size="md" color="blue.500">💡 Insights Summary</Heading>
                </CardHeader>
                <CardBody>
                  <Text fontSize="lg" color={textColor} lineHeight="tall">
                    {currentRepoStats.summary_text}
                  </Text>
                </CardBody>
              </Card>
            </MotionBox>
          )}
        </VStack>
      </Box>
      </AllLayout>
    </>
  );
};

export default ContributorsPage;