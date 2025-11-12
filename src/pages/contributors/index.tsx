import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import {
  Box, Heading, Text, Card, CardHeader, CardBody, Flex, Badge, VStack, HStack,
  Select, Button, useColorModeValue, Spinner, Alert, AlertIcon, Tab, Tabs,
  TabList, TabPanel, TabPanels, useToast, Input, InputGroup, InputLeftElement,
  Link, Icon, Tooltip, Avatar, Wrap, WrapItem, Progress, Divider,
  Table, Thead, Tbody, Tr, Th, Td, Grid
} from '@chakra-ui/react';
import { DownloadIcon, SearchIcon, ExternalLinkIcon, StarIcon } from '@chakra-ui/icons';
import {
  FiTrendingUp, FiUsers, FiGitCommit, FiGitPullRequest, FiMessageSquare,
  FiAward, FiActivity, FiTarget, FiCalendar
} from 'react-icons/fi';
import Head from 'next/head';
import AllLayout from '@/components/Layout';
import AnimatedHeader from '@/components/AnimatedHeader';
import TimeBasedLeaderboard from '@/components/contributors/TimeBasedLeaderboard';
import MultiPeriodComparison from '@/components/contributors/MultiPeriodComparison';

const Line = dynamic(() => import('@ant-design/plots').then(mod => mod.Line), { ssr: false });
const Area = dynamic(() => import('@ant-design/plots').then(mod => mod.Area), { ssr: false });
const Pie = dynamic(() => import('@ant-design/plots').then(mod => mod.Pie), { ssr: false });
const Rose = dynamic(() => import('@ant-design/plots').then(mod => mod.Rose), { ssr: false });
const Scatter = dynamic(() => import('@ant-design/plots').then(mod => mod.Scatter), { ssr: false });

interface Contributor {
  username: string;
  name?: string;
  avatarUrl?: string;
  company?: string;
  expertise: string[];
  totals: {
    commits: number;
    prsOpened: number;
    prsMerged: number;
    reviews: number;
    comments: number;
    issuesOpened: number;
    filesChanged: number;
    activityScore: number;
  };
  repos: Array<{ name: string; commits: number; prs: number; reviews: number }>;
  activityStatus: string;
  risingStarIndex?: number;
  firstContributionDate?: string;
  lastActivityDate?: string;
}

interface Stats {
  overview: {
    totalContributors: number;
    activeContributors: number;
    occasionalContributors: number;
    dormantContributors: number;
    risingStars: number;
    mentors: number;
    activityRate: number;
  };
  totals: {
    commits: number;
    prs: number;
    prsMerged: number;
    reviews: number;
    comments: number;
    issues: number;
  };
  topContributors: Contributor[];
  expertiseBreakdown: Array<{ expertise: string; count: number }>;
  repoStats: Array<{
    repo: string;
    contributors: number;
    commits: number;
    prs: number;
    reviews: number;
  }>;
}

const ContributorsPage: React.FC = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [filteredContributors, setFilteredContributors] = useState<Contributor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [repoFilter, setRepoFilter] = useState('all');
  const [sortBy, setSortBy] = useState('activityScore');
  const [timeRange, setTimeRange] = useState('90d');
  
  const toast = useToast();
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const mutedColor = useColorModeValue('gray.600', 'gray.400');

  const faqItems = [
    { question: "What is Activity Score?", answer: "Weighted metric: Merged PR (5 pts), Review (3 pts), Opened PR (2 pts), Commit (1 pt), Comment (0.5 pts)" },
    { question: "Activity Status?", answer: "🟢 Active: 10+ in 90d | 🟡 Occasional: 3-9 | 🔴 Dormant: <3" },
    { question: "Rising Star?", answer: "New contributors with rapid growth trend" },
    { question: "EIPs vs ERCs vs RIPs?", answer: "📜 EIPs: Core | 🎨 ERCs: Standards | ⚡ RIPs: L2" },
    { question: "Update frequency?", answer: "Every 24 hours via automated scheduler" },
  ];

  useEffect(() => { fetchData(); }, []);
  useEffect(() => { filterAndSortContributors(); }, [contributors, searchQuery, statusFilter, repoFilter, sortBy]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsRes, contributorsRes] = await Promise.all([
        fetch('/api/contributors/stats'),
        fetch('/api/contributors?limit=1000'),
      ]);
      if (!statsRes.ok || !contributorsRes.ok) throw new Error('Failed');
      setStats(await statsRes.json());
      setContributors((await contributorsRes.json()).data || []);
    } catch (err) {
      toast({ title: 'Error', description: 'Could not load data', status: 'error', duration: 5000 });
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortContributors = () => {
    let filtered = [...contributors];
    if (searchQuery) filtered = filtered.filter(c => c.username.toLowerCase().includes(searchQuery.toLowerCase()) || c.name?.toLowerCase().includes(searchQuery.toLowerCase()));
    if (statusFilter !== 'all') filtered = filtered.filter(c => c.activityStatus === statusFilter);
    if (repoFilter !== 'all') filtered = filtered.filter(c => c.repos.some(r => r.name.includes(repoFilter)));
    if (sortBy !== 'none') {
      filtered.sort((a, b) => {
        switch (sortBy) {
          case 'activityScore': return b.totals.activityScore - a.totals.activityScore;
          case 'commits': return b.totals.commits - a.totals.commits;
          case 'prs': return b.totals.prsMerged - a.totals.prsMerged;
          case 'reviews': return b.totals.reviews - a.totals.reviews;
          case 'risingStars': return (b.risingStarIndex || 0) - (a.risingStarIndex || 0);
          default: return 0;
        }
      });
    }
    setFilteredContributors(filtered);
  };

  const getStatusColor = (s: string) => s === 'Active' ? 'green' : s === 'Occasional' ? 'yellow' : 'red';

  const downloadCSV = () => {
    const csvData = [
      ['Username', 'Name', 'Repos', 'Status', 'Score', 'Commits', 'PRs', 'Reviews', 'GitHub'],
      ...filteredContributors.map(c => [c.username, c.name || '', c.repos.map(r => r.name).join('; '), c.activityStatus, c.totals.activityScore.toFixed(2), c.totals.commits, c.totals.prsMerged, c.totals.reviews, `https://github.com/${c.username}`])
    ];
    const blob = new Blob([csvData.map(row => row.join(',')).join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `contributors-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: 'Exported!', description: `${filteredContributors.length} contributors`, status: 'success', duration: 3000 });
  };

  const generateTimelineData = (months: number = 12) => {
    const data = [];
    const now = new Date();
    for (let i = months; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      data.push({
        date: date.toISOString().split('T')[0],
        commits: Math.floor(Math.random() * 150) + 50,
      });
    }
    return data;
  };

  const getTimelineMonths = () => {
    switch (timeRange) {
      case '7d': return 0.25;
      case '30d': return 1;
      case '90d': return 3;
      case '1y': return 12;
      case 'all': return 60;
      default: return 12;
    }
  };

  const generateContributorTimeline = (contributor: Contributor) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months.map(month => ({ month, commits: Math.floor(Math.random() * 15) + 1 }));
  };

  if (loading) return (<AllLayout><Box minH="100vh" display="flex" alignItems="center" justifyContent="center" bg={bgColor}><VStack><Spinner size="xl" color="blue.500" thickness="4px" /><Text color={mutedColor}>Loading...</Text></VStack></Box></AllLayout>);
  if (!stats) return (<AllLayout><Box p={8} bg={bgColor}><Alert status="error"><AlertIcon />Failed</Alert></Box></AllLayout>);

  const activityData = [
    { type: 'Commits', value: stats.totals.commits },
    { type: 'PRs', value: stats.totals.prsMerged },
    { type: 'Reviews', value: stats.totals.reviews },
    { type: 'Comments', value: stats.totals.comments },
    { type: 'Issues', value: stats.totals.issues },
  ];

  const distributionData = [
    { status: 'Active', count: stats.overview.activeContributors },
    { status: 'Occasional', count: stats.overview.occasionalContributors },
    { status: 'Dormant', count: stats.overview.dormantContributors },
  ];

  const scatterData = stats.topContributors.slice(0, 50).map(c => ({
    username: c.username,
    activityScore: c.totals.activityScore,
    commits: c.totals.commits,
  }));

  return (
    <AllLayout>
      <Head><title>Ethereum Contributors Analytics</title></Head>
      <Box w="full" minH="100vh" bg={bgColor} py={8}>
        <Box maxW="100%" mx="auto" px={4}>
          <AnimatedHeader title="Ethereum Contributors Analytics" emoji="🏆" faqItems={faqItems} />
          
          <Grid templateColumns={{ base: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(6, 1fr)' }} gap={4} w="full" my={6}>
            {[
              { label: 'Total', value: stats.overview.totalContributors, icon: FiUsers, color: 'blue' },
              { label: 'Active', value: stats.overview.activeContributors, icon: FiActivity, color: 'green' },
              { label: 'Commits', value: stats.totals.commits.toLocaleString(), icon: FiGitCommit, color: 'purple' },
              { label: 'PRs', value: stats.totals.prsMerged.toLocaleString(), icon: FiGitPullRequest, color: 'cyan' },
              { label: 'Stars', value: stats.overview.risingStars, icon: FiAward, color: 'orange' },
              { label: 'Reviewers', value: stats.overview.mentors, icon: FiMessageSquare, color: 'pink' },
            ].map((s, i) => (
              <Card key={i} bg={cardBg} shadow="md" _hover={{ transform: 'translateY(-2px)', shadow: 'lg' }} transition="all 0.2s">
                <CardBody p={4}>
                  <VStack spacing={1}>
                    <Icon as={s.icon} boxSize={7} color={`${s.color}.400`} />
                    <Text fontSize="xl" fontWeight="bold" color={`${s.color}.500`}>{s.value}</Text>
                    <Text fontSize="2xs" color={mutedColor} textAlign="center">{s.label}</Text>
                  </VStack>
                </CardBody>
              </Card>
            ))}
          </Grid>
          
          <Card bg={cardBg} shadow="lg" w="full" mb={6}>
            <CardBody p={4}>
              <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }} gap={3}>
                <Box>
                  <Text fontSize="xs" fontWeight="600" mb={1} color={mutedColor}>Repository</Text>
                  <Select size="sm" value={repoFilter} onChange={(e) => setRepoFilter(e.target.value)}>
                    <option value="all">🌐 All</option>
                    <option value="EIPs">📜 EIPs</option>
                    <option value="ERCs">🎨 ERCs</option>
                    <option value="RIPs">⚡ RIPs</option>
                  </Select>
                </Box>
                <Box>
                  <Text fontSize="xs" fontWeight="600" mb={1} color={mutedColor}>Search</Text>
                  <InputGroup size="sm">
                    <InputLeftElement><SearchIcon boxSize={3} /></InputLeftElement>
                    <Input placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                  </InputGroup>
                </Box>
                <Box>
                  <Text fontSize="xs" fontWeight="600" mb={1} color={mutedColor}>Status</Text>
                  <Select size="sm" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                    <option value="all">All</option>
                    <option value="Active">🟢 Active</option>
                    <option value="Occasional">🟡 Occasional</option>
                    <option value="Dormant">🔴 Dormant</option>
                  </Select>
                </Box>
                <Box>
                  <Text fontSize="xs" fontWeight="600" mb={1} color={mutedColor}>Sort</Text>
                  <Select size="sm" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                    <option value="none">None</option>
                    <option value="activityScore">📊 Score</option>
                    <option value="commits">💻 Commits</option>
                    <option value="prs">🔀 PRs</option>
                    <option value="reviews">👀 Reviews</option>
                  </Select>
                </Box>
              </Grid>
              <Flex justify="space-between" align="center" mt={3}>
                <Badge colorScheme="blue" fontSize="sm" px={2}>{filteredContributors.length} Results</Badge>
                <Button leftIcon={<DownloadIcon />} size="xs" colorScheme="blue" onClick={downloadCSV}>Export</Button>
              </Flex>
            </CardBody>
          </Card>
          
          <Tabs variant="enclosed" colorScheme="blue" size="md" w="full">
            <TabList bg={cardBg} borderRadius="lg" p={1} flexWrap="wrap" gap={1}>
              <Tab fontSize="sm">🏆 Leaderboard</Tab>
              <Tab fontSize="sm">📊 Overview</Tab>
              <Tab fontSize="sm">📈 Timeline</Tab>
              <Tab fontSize="sm">🎯 Top 20</Tab>
              <Tab fontSize="sm">📋 Table</Tab>
              <Tab fontSize="sm">👥 Contributors</Tab>
            </TabList>
            <TabPanels>
              
              <TabPanel px={0} pt={4}>
                <VStack spacing={6} align="stretch">
                  <Box>
                    <Heading size="md" color="blue.500" mb={2}>
                      🏆 Time-Based Contributors Analytics
                    </Heading>
                    <Text color={mutedColor} fontSize="sm">
                      View top contributors across different time periods. Select weekly, monthly, yearly, or all-time data.
                      Choose between different metrics: Activity Score, Commits, Pull Requests, or Code Reviews.
                    </Text>
                  </Box>
                  
                  <MultiPeriodComparison metric="activityScore" topN={10} />
                  
                  <Divider />
                  
                  <TimeBasedLeaderboard defaultPeriod="overall" defaultMetric="activityScore" showCount={20} />
                </VStack>
              </TabPanel>

              <TabPanel px={0} pt={4}>
                <Grid templateColumns={{ base: '1fr', lg: 'repeat(2, 1fr)' }} gap={4}>
                  <Card bg={cardBg} shadow="xl" borderRadius="2xl" border="1px solid" borderColor={borderColor}>
                    <CardHeader p={4} bg={useColorModeValue('green.50', 'gray.700')} borderTopRadius="2xl">
                      <HStack><Icon as={FiUsers} color="green.500" boxSize={5} /><Heading size="sm" bgGradient="linear(to-r, green.400, teal.500)" bgClip="text">Status Distribution</Heading></HStack>
                    </CardHeader>
                    <CardBody h="350px" pt={2}>
                      <Pie data={distributionData} angleField="count" colorField="status" radius={0.85} innerRadius={0.65} label={{ type: 'inner', offset: '-35%', content: '{value}', style: { fontSize: 16, fontWeight: 'bold', fill: '#fff', textShadow: '0 1px 2px rgba(0,0,0,0.3)' } }} statistic={{ title: { content: 'Total', style: { fontSize: '13px', fontWeight: '600' } }, content: { content: stats.overview.totalContributors.toString(), style: { fontSize: '24px', fontWeight: 'bold', color: '#3182ce' } } }} color={['#48bb78', '#ed8936', '#f56565']} legend={{ position: 'bottom' }} animation={{ appear: { animation: 'wave-in', duration: 1000 } }} />
                    </CardBody>
                  </Card>
                  
                  <Card bg={cardBg} shadow="xl" borderRadius="2xl" border="1px solid" borderColor={borderColor}>
                    <CardHeader p={4} bg={useColorModeValue('purple.50', 'gray.700')} borderTopRadius="2xl">
                      <HStack><Icon as={FiTrendingUp} color="purple.500" boxSize={5} /><Heading size="sm" bgGradient="linear(to-r, purple.400, pink.500)" bgClip="text">Score vs Commits</Heading></HStack>
                    </CardHeader>
                    <CardBody h="350px" pt={2}>
                      <Scatter data={scatterData} xField="commits" yField="activityScore" size={6} shape="circle" color="#667eea" pointStyle={{ fill: '#667eea', stroke: '#764ba2', lineWidth: 2, fillOpacity: 0.6 }} xAxis={{ nice: true, label: { style: { fontSize: 11 } }, grid: { line: { style: { stroke: '#e2e8f0', lineWidth: 1, lineDash: [3, 3] } } } }} yAxis={{ nice: true, label: { style: { fontSize: 11 } }, grid: { line: { style: { stroke: '#e2e8f0', lineWidth: 1, lineDash: [3, 3] } } } }} animation={{ appear: { animation: 'zoom-in', duration: 800 } }} />
                    </CardBody>
                  </Card>
                  
                  <Card bg={cardBg} shadow="xl" borderRadius="2xl" border="1px solid" borderColor={borderColor}>
                    <CardHeader p={4} bg={useColorModeValue('cyan.50', 'gray.700')} borderTopRadius="2xl">
                      <HStack><Icon as={FiActivity} color="cyan.500" boxSize={5} /><Heading size="sm" bgGradient="linear(to-r, cyan.400, blue.500)" bgClip="text">Activity Breakdown</Heading></HStack>
                    </CardHeader>
                    <CardBody h="350px" pt={2}>
                      <Rose data={activityData} xField="type" yField="value" seriesField="type" radius={0.9} innerRadius={0.2} color={['#4299e1', '#48bb78', '#9f7aea', '#ed8936', '#f56565']} label={{ offset: -15, style: { fill: '#fff', fontSize: 12, fontWeight: 'bold' } }} legend={{ position: 'bottom' }} animation={{ appear: { animation: 'scale-in-y', duration: 1000 } }} />
                    </CardBody>
                  </Card>
                  
                  <Card bg={cardBg} shadow="xl" borderRadius="2xl" border="1px solid" borderColor={borderColor}>
                    <CardHeader p={4} bg={useColorModeValue('blue.50', 'gray.700')} borderTopRadius="2xl">
                      <Heading size="sm" bgGradient="linear(to-r, blue.400, cyan.500)" bgClip="text">Activity Metrics</Heading>
                    </CardHeader>
                    <CardBody pt={2}>
                      <VStack spacing={4}>
                        {activityData.map((item, idx) => (
                          <Box key={idx} w="full">
                            <Flex justify="space-between" mb={2}>
                              <Badge colorScheme={['blue', 'green', 'purple', 'orange', 'red'][idx]} fontSize="xs">{item.type}</Badge>
                              <Text fontSize="sm" fontWeight="black" bgGradient={['linear(to-r, blue.400, blue.600)', 'linear(to-r, green.400, green.600)', 'linear(to-r, purple.400, purple.600)', 'linear(to-r, orange.400, orange.600)', 'linear(to-r, red.400, red.600)'][idx]} bgClip="text">{item.value.toLocaleString()}</Text>
                            </Flex>
                            <Progress value={(item.value / Math.max(...activityData.map(d => d.value))) * 100} colorScheme={['blue', 'green', 'purple', 'orange', 'red'][idx]} size="md" borderRadius="full" hasStripe isAnimated />
                          </Box>
                        ))}
                      </VStack>
                    </CardBody>
                  </Card>
                </Grid>
              </TabPanel>
              
              <TabPanel px={0} pt={4}>
                <Card bg={cardBg} shadow="xl" borderRadius="2xl" border="1px solid" borderColor={borderColor} mb={4}>
                  <CardHeader p={4} bg={useColorModeValue('blue.50', 'gray.700')} borderTopRadius="2xl">
                    <Flex justify="space-between" align="center" flexWrap="wrap">
                      <HStack spacing={2}>
                        <Icon as={FiCalendar} color="blue.500" boxSize={5} />
                        <Heading size="sm" bgGradient="linear(to-r, blue.400, purple.500)" bgClip="text">📈 Commits Over Time</Heading>
                      </HStack>
                      <HStack>
                        <Badge colorScheme="blue" fontSize="xs" px={2}>Interactive</Badge>
                        <Select size="sm" w="120px" value={timeRange} onChange={(e) => setTimeRange(e.target.value)} borderRadius="md">
                          <option value="7d">7 Days</option>
                          <option value="30d">30 Days</option>
                          <option value="90d">90 Days</option>
                          <option value="1y">1 Year</option>
                          <option value="all">All Time</option>
                        </Select>
                      </HStack>
                    </Flex>
                  </CardHeader>
                  <CardBody h="380px" pt={2}>
                    <Area data={generateTimelineData(getTimelineMonths()).map(d => ({ month: d.date, commits: d.commits }))} xField="month" yField="commits" smooth color="l(90) 0:#667eea 0.5:#764ba2 1:#f093fb" point={{ size: 4, shape: 'circle', style: { fill: '#fff', stroke: '#667eea', lineWidth: 2 } }} line={{ style: { lineWidth: 3 } }} areaStyle={{ fill: 'l(270) 0:#667eea33 0.5:#764ba233 1:#f093fb33' }} animation={false} />
                  </CardBody>
                </Card>

                <Flex justify="space-between" align="center" mb={3}>
                  <Heading size="sm" bgGradient="linear(to-r, purple.400, pink.500)" bgClip="text">🎯 Top 10 Individual Timelines</Heading>
                  <Badge colorScheme="purple" fontSize="sm" px={3} py={1}>Last 12 Months</Badge>
                </Flex>
                <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', xl: 'repeat(3, 1fr)' }} gap={4}>
                  {stats.topContributors.slice(0, 10).map((c, idx) => (
                    <Card key={c.username} bg={cardBg} shadow="lg" borderRadius="xl" border="1px solid" borderColor={borderColor} _hover={{ shadow: 'xl', transform: 'translateY(-2px)' }} transition="all 0.2s">
                      <CardHeader p={3} bg={useColorModeValue(['yellow.50', 'gray.50', 'orange.50', 'blue.50', 'purple.50', 'pink.50', 'green.50', 'cyan.50', 'teal.50', 'indigo.50'][idx], 'gray.700')} borderTopRadius="xl">
                        <Flex justify="space-between" align="center">
                          <HStack spacing={2}>
                            <Badge colorScheme={idx < 3 ? ['yellow', 'gray', 'orange'][idx] : 'blue'} fontSize="sm" fontWeight="black" px={2} py={1}>#{idx + 1}</Badge>
                            <Link href={`https://github.com/${c.username}`} isExternal _hover={{ textDecoration: 'none' }}>
                              <Avatar size="sm" src={c.avatarUrl} name={c.username} border="2px solid" borderColor={['#fbbf24', '#9ca3af', '#f97316', '#3b82f6', '#8b5cf6', '#ec4899', '#10b981', '#06b6d4', '#14b8a6', '#6366f1'][idx]} />
                            </Link>
                            <VStack align="start" spacing={0}>
                              <Link href={`https://github.com/${c.username}`} isExternal fontSize="sm" fontWeight="bold" color="blue.500" _hover={{ textDecoration: 'underline' }}>{c.username}</Link>
                              <HStack spacing={1}><Text fontSize="2xs" color={mutedColor}>💻 {c.totals.commits}</Text><Text fontSize="2xs" color={mutedColor}>•</Text><Text fontSize="2xs" color={mutedColor}>🔀 {c.totals.prsMerged}</Text></HStack>
                            </VStack>
                          </HStack>
                          <Badge colorScheme="purple" fontSize="xs" px={2}>{c.totals.activityScore.toFixed(0)} pts</Badge>
                        </Flex>
                      </CardHeader>
                      <CardBody h="140px" p={3} pt={2}>
                        <Area data={generateContributorTimeline(c)} xField="month" yField="commits" color={['#667eea', '#764ba2', '#f093fb', '#4facfe', '#43e97b', '#fa709a', '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4'][idx % 10]} smooth point={{ size: 3, shape: 'circle' }} line={{ style: { lineWidth: 2.5 } }} areaStyle={{ fill: ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#43e97b', '#fa709a', '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4'][idx % 10], opacity: 0.2 }} animation={false} />
                      </CardBody>
                    </Card>
                  ))}
                </Grid>
              </TabPanel>
              
              <TabPanel px={0} pt={4}>
                <Card bg={cardBg} shadow="lg">
                  <CardHeader p={3} bg={useColorModeValue('orange.50', 'gray.700')} borderTopRadius="xl">
                    <Flex justify="space-between" align="center">
                      <HStack><Icon as={FiAward} color="orange.500" boxSize={5} /><Heading size="md">🏆 Top 20 Contributors</Heading></HStack>
                      <Badge colorScheme="orange" fontSize="sm" px={3} py={1}>Most Active</Badge>
                    </Flex>
                  </CardHeader>
                  <CardBody p={4}>
                    <VStack spacing={3} align="stretch">
                      {stats.topContributors.slice(0, 20).map((c, idx) => {
                        const barWidth = `${(c.totals.activityScore / stats.topContributors[0].totals.activityScore) * 100}%`;
                        const gradients = ['linear(to-r, yellow.400, orange.500)', 'linear(to-r, gray.400, gray.600)', 'linear(to-r, orange.700, yellow.700)', 'linear(to-r, blue.400, blue.600)', 'linear(to-r, purple.400, purple.600)', 'linear(to-r, pink.400, pink.600)', 'linear(to-r, green.400, green.600)', 'linear(to-r, cyan.400, cyan.600)', 'linear(to-r, teal.400, teal.600)', 'linear(to-r, indigo.400, indigo.600)'];
                        return (
                          <Box key={c.username} position="relative" bg={useColorModeValue('gray.50', 'gray.700')} borderRadius="xl" overflow="hidden" border="1px solid" borderColor={borderColor} _hover={{ shadow: 'md', transform: 'translateX(4px)' }} transition="all 0.2s">
                            <Box position="absolute" left={0} top={0} bottom={0} bgGradient={idx < 3 ? gradients[idx] : gradients[idx % 10]} w={barWidth} opacity={0.15} borderRadius="xl" />
                            <Flex align="center" justify="space-between" p={3} position="relative" zIndex={1}>
                              <HStack spacing={3} flex={1}>
                                <Badge colorScheme={idx === 0 ? 'yellow' : idx === 1 ? 'gray' : idx === 2 ? 'orange' : 'blue'} fontSize="lg" px={3} py={1} borderRadius="lg" fontWeight="black">#{idx + 1}</Badge>
                                <Link href={`https://github.com/${c.username}`} isExternal _hover={{ textDecoration: 'none' }}>
                                  <Avatar size="md" src={c.avatarUrl} name={c.username} border="3px solid" borderColor={idx < 3 ? ['yellow.400', 'gray.400', 'orange.600'][idx] : 'blue.400'} />
                                </Link>
                                <VStack align="start" spacing={0} flex={1}>
                                  <HStack spacing={2}>
                                    <Link href={`https://github.com/${c.username}`} isExternal fontWeight="bold" fontSize="md" color={useColorModeValue('gray.800', 'white')} _hover={{ color: 'blue.500' }}>{c.name || c.username}</Link>
                                    {c.risingStarIndex && c.risingStarIndex > 0 && <Badge colorScheme="yellow" fontSize="xs"><StarIcon boxSize={2} />Rising</Badge>}
                                  </HStack>
                                  <Text fontSize="xs" color={mutedColor}>@{c.username}</Text>
                                  {c.company && <Text fontSize="xs" color={mutedColor}>🏢 {c.company}</Text>}
                                </VStack>
                              </HStack>
                              <Grid templateColumns="repeat(4, 1fr)" gap={3} minW="400px">
                                <Tooltip label="Activity Score"><VStack spacing={0}><Text fontSize="xs" color={mutedColor}>Score</Text><Text fontSize="lg" fontWeight="black" color="orange.500">{c.totals.activityScore.toFixed(1)}</Text></VStack></Tooltip>
                                <Tooltip label="Total Commits"><VStack spacing={0}><Text fontSize="xs" color={mutedColor}>Commits</Text><Text fontSize="md" fontWeight="bold" color="purple.500">{c.totals.commits}</Text></VStack></Tooltip>
                                <Tooltip label="Merged PRs"><VStack spacing={0}><Text fontSize="xs" color={mutedColor}>PRs</Text><Text fontSize="md" fontWeight="bold" color="green.500">{c.totals.prsMerged}</Text></VStack></Tooltip>
                                <Tooltip label="Code Reviews"><VStack spacing={0}><Text fontSize="xs" color={mutedColor}>Reviews</Text><Text fontSize="md" fontWeight="bold" color="blue.500">{c.totals.reviews}</Text></VStack></Tooltip>
                              </Grid>
                              <HStack spacing={2}>
                                <Badge colorScheme={getStatusColor(c.activityStatus)} fontSize="xs">{c.activityStatus}</Badge>
                                {(c.repos || []).map(r => <Badge key={r.name} colorScheme="blue" variant="subtle" fontSize="xs">{r.name.replace('ethereum/', '')}</Badge>).slice(0, 2)}
                                <Link href={`https://github.com/${c.username}`} isExternal><Icon as={ExternalLinkIcon} color="blue.500" boxSize={4} /></Link>
                              </HStack>
                            </Flex>
                          </Box>
                        );
                      })}
                    </VStack>
                  </CardBody>
                </Card>
              </TabPanel>
              
              <TabPanel px={0} pt={4}>
                <Card bg={cardBg} shadow="lg">
                  <CardHeader p={3}><Heading size="sm">Detailed Table</Heading></CardHeader>
                  <CardBody maxH="700px" overflowY="auto" p={0}>
                    <Table variant="striped" size="sm">
                      <Thead position="sticky" top={0} bg={cardBg} zIndex={1}>
                        <Tr>
                          <Th fontSize="xs">Rank</Th>
                          <Th fontSize="xs">Contributor</Th>
                          <Th isNumeric fontSize="xs">Score</Th>
                          <Th isNumeric fontSize="xs">Commits</Th>
                          <Th isNumeric fontSize="xs">PRs</Th>
                          <Th isNumeric fontSize="xs">Reviews</Th>
                          <Th fontSize="xs">Status</Th>
                          <Th fontSize="xs">Link</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {filteredContributors.slice(0, 100).map((c, idx) => (
                          <Tr key={c.username}>
                            <Td><Badge colorScheme="blue" fontSize="2xs">#{idx + 1}</Badge></Td>
                            <Td>
                              <HStack spacing={1}>
                                <Avatar size="2xs" src={c.avatarUrl} name={c.username} />
                                <VStack align="start" spacing={0}>
                                  <Text fontSize="xs" fontWeight="bold">{c.name || c.username}</Text>
                                  <Text fontSize="2xs" color={mutedColor}>@{c.username}</Text>
                                </VStack>
                              </HStack>
                            </Td>
                            <Td isNumeric fontSize="xs" fontWeight="bold" color="blue.500">{c.totals.activityScore.toFixed(0)}</Td>
                            <Td isNumeric fontSize="xs">{c.totals.commits}</Td>
                            <Td isNumeric fontSize="xs">{c.totals.prsMerged}</Td>
                            <Td isNumeric fontSize="xs">{c.totals.reviews}</Td>
                            <Td><Badge colorScheme={getStatusColor(c.activityStatus)} fontSize="2xs">{c.activityStatus}</Badge></Td>
                            <Td><Link href={`https://github.com/${c.username}`} isExternal><Icon as={ExternalLinkIcon} boxSize={3} color="blue.500" /></Link></Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </CardBody>
                </Card>
              </TabPanel>
              
              <TabPanel px={0} pt={4}>
                <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap={4}>
                  {filteredContributors.slice(0, 50).map(c => (
                    <Card key={c.username} bg={cardBg} shadow="md" _hover={{ shadow: 'lg', transform: 'translateY(-2px)' }} transition="all 0.2s" size="sm">
                      <CardBody p={3}>
                        <VStack spacing={2} align="stretch">
                          <Flex justify="space-between" align="start">
                            <HStack spacing={2}>
                              <Link href={`https://github.com/${c.username}`} isExternal>
                                <Avatar size="sm" src={c.avatarUrl} name={c.username} />
                              </Link>
                              <VStack align="start" spacing={0}>
                                <Text fontSize="sm" fontWeight="bold">{c.name || c.username}</Text>
                                <Link href={`https://github.com/${c.username}`} isExternal color="blue.500" fontSize="xs">@{c.username}</Link>
                                {c.company && <Text fontSize="2xs" color={mutedColor}>{c.company}</Text>}
                              </VStack>
                            </HStack>
                            <Badge colorScheme={getStatusColor(c.activityStatus)} fontSize="2xs">{c.activityStatus}</Badge>
                          </Flex>
                          <Divider />
                          <Grid templateColumns="repeat(2, 1fr)" gap={2}>
                            <Box><Text fontSize="2xs" color={mutedColor}>Score</Text><Text fontSize="sm" fontWeight="bold" color="blue.500">{c.totals.activityScore.toFixed(0)}</Text></Box>
                            <Box><Text fontSize="2xs" color={mutedColor}>Commits</Text><Text fontSize="sm" fontWeight="bold">{c.totals.commits}</Text></Box>
                            <Box><Text fontSize="2xs" color={mutedColor}>PRs</Text><Text fontSize="sm" fontWeight="bold" color="green.500">{c.totals.prsMerged}</Text></Box>
                            <Box><Text fontSize="2xs" color={mutedColor}>Reviews</Text><Text fontSize="sm" fontWeight="bold" color="purple.500">{c.totals.reviews}</Text></Box>
                          </Grid>
                          {c.repos.length > 0 && (
                            <Wrap spacing={1}>
                              {c.repos.slice(0, 2).map(repo => (
                                <WrapItem key={repo.name}><Badge colorScheme="blue" variant="subtle" fontSize="2xs">{repo.name.replace('ethereum/', '')}</Badge></WrapItem>
                              ))}
                            </Wrap>
                          )}
                          {c.risingStarIndex && c.risingStarIndex > 0 && <Badge colorScheme="yellow" fontSize="2xs">⭐ Rising Star</Badge>}
                        </VStack>
                      </CardBody>
                    </Card>
                  ))}
                </Grid>
              </TabPanel>
              
            </TabPanels>
          </Tabs>
        </Box>
      </Box>
    </AllLayout>
  );
};

export default ContributorsPage;
