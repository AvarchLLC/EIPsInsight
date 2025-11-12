import React, { useState, useEffect } from 'react';
import {
  Box, Card, CardHeader, CardBody, Heading, Text, Avatar, HStack, VStack,
  Badge, useColorModeValue, Button, Flex, Grid, Select, Spinner,
  Alert, AlertIcon, Tooltip, Progress, Link, Icon, Divider, Tabs,
  TabList, Tab, TabPanels, TabPanel
} from '@chakra-ui/react';
import { StarIcon, ExternalLinkIcon } from '@chakra-ui/icons';
import { FiTrendingUp, FiAward, FiActivity, FiCalendar } from 'react-icons/fi';

interface Contributor {
  rank: number;
  username: string;
  name?: string;
  avatarUrl?: string;
  company?: string;
  value: number;
  activityStatus?: string;
  risingStarIndex?: number;
  totals?: {
    activityScore: number;
    commits: number;
    prsMerged: number;
    reviews: number;
  };
  periodData?: {
    activityScore: number;
    commits: number;
    prs: number;
    reviews: number;
  };
}

interface LeaderboardData {
  period: string;
  metric: string;
  timeRange: {
    start: string;
    end: string;
    label: string;
  };
  leaderboard: Contributor[];
  stats: {
    totalContributors: number;
    topScore: number;
    avgScore: number;
  };
  generatedAt: string;
}

interface TimeBasedLeaderboardProps {
  defaultPeriod?: string;
  defaultMetric?: string;
  showCount?: number;
}

const TimeBasedLeaderboard: React.FC<TimeBasedLeaderboardProps> = ({
  defaultPeriod = 'overall',
  defaultMetric = 'activityScore',
  showCount = 20
}) => {
  const [period, setPeriod] = useState(defaultPeriod);
  const [metric, setMetric] = useState(defaultMetric);
  const [data, setData] = useState<LeaderboardData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const mutedColor = useColorModeValue('gray.600', 'gray.400');
  const highlightBg = useColorModeValue('blue.50', 'gray.700');

  const periodOptions = [
    { value: 'weekly', label: '📅 Weekly (7 days)', icon: FiCalendar },
    { value: 'monthly', label: '📆 Monthly (30 days)', icon: FiCalendar },
    { value: 'yearly', label: '🗓️ Yearly (365 days)', icon: FiCalendar },
    { value: 'overall', label: '🌍 All Time', icon: FiActivity },
  ];

  const metricOptions = [
    { value: 'activityScore', label: '📊 Activity Score', color: 'blue' },
    { value: 'commits', label: '💻 Commits', color: 'purple' },
    { value: 'prs', label: '🔀 Pull Requests', color: 'green' },
    { value: 'reviews', label: '👀 Code Reviews', color: 'orange' },
  ];

  useEffect(() => {
    fetchLeaderboard();
  }, [period, metric]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `/api/contributors/analytics?period=${period}&metric=${metric}&limit=${showCount}`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch leaderboard');
      }
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'Active': return 'green';
      case 'Occasional': return 'yellow';
      case 'Dormant': return 'red';
      default: return 'gray';
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return '🏆';
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return 'yellow';
      case 2: return 'gray';
      case 3: return 'orange';
      default: return 'blue';
    }
  };

  const formatValue = (value: number, metricType: string) => {
    if (metricType === 'activityScore') {
      return value.toFixed(1);
    }
    return value.toLocaleString();
  };

  const getMetricLabel = (metricType: string) => {
    const option = metricOptions.find(m => m.value === metricType);
    return option?.label || 'Score';
  };

  const getCurrentMetricColor = () => {
    const option = metricOptions.find(m => m.value === metric);
    return option?.color || 'blue';
  };

  if (loading) {
    return (
      <Card bg={cardBg} shadow="lg" borderRadius="xl">
        <CardBody py={12}>
          <VStack spacing={4}>
            <Spinner size="xl" color="blue.500" thickness="4px" />
            <Text color={mutedColor}>Loading leaderboard...</Text>
          </VStack>
        </CardBody>
      </Card>
    );
  }

  if (error) {
    return (
      <Card bg={cardBg} shadow="lg" borderRadius="xl">
        <CardBody>
          <Alert status="error" borderRadius="lg">
            <AlertIcon />
            {error}
          </Alert>
        </CardBody>
      </Card>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <Card bg={cardBg} shadow="xl" borderRadius="2xl" border="1px solid" borderColor={borderColor}>
      <CardHeader p={4} bg={highlightBg} borderTopRadius="2xl">
        <VStack align="stretch" spacing={4}>
          <Flex justify="space-between" align="center" flexWrap="wrap" gap={3}>
            <HStack spacing={2}>
              <Icon as={FiAward} boxSize={6} color={`${getCurrentMetricColor()}.500`} />
              <Heading size="md" bgGradient={`linear(to-r, ${getCurrentMetricColor()}.400, ${getCurrentMetricColor()}.600)`} bgClip="text">
                Contributors Leaderboard
              </Heading>
            </HStack>
            <Badge colorScheme={getCurrentMetricColor()} fontSize="sm" px={3} py={1}>
              {data.timeRange.label}
            </Badge>
          </Flex>

          <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={3}>
            <Box>
              <Text fontSize="xs" fontWeight="600" mb={2} color={mutedColor}>
                Time Period
              </Text>
              <Select
                size="sm"
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                borderRadius="lg"
                bg={cardBg}
              >
                {periodOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </Select>
            </Box>
            <Box>
              <Text fontSize="xs" fontWeight="600" mb={2} color={mutedColor}>
                Metric
              </Text>
              <Select
                size="sm"
                value={metric}
                onChange={(e) => setMetric(e.target.value)}
                borderRadius="lg"
                bg={cardBg}
              >
                {metricOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </Select>
            </Box>
          </Grid>

          <Grid templateColumns="repeat(3, 1fr)" gap={3}>
            <Box p={3} bg={cardBg} borderRadius="lg" textAlign="center">
              <Text fontSize="xs" color={mutedColor}>Contributors</Text>
              <Text fontSize="xl" fontWeight="bold" color="blue.500">
                {data.stats.totalContributors}
              </Text>
            </Box>
            <Box p={3} bg={cardBg} borderRadius="lg" textAlign="center">
              <Text fontSize="xs" color={mutedColor}>Top Score</Text>
              <Text fontSize="xl" fontWeight="bold" color="green.500">
                {formatValue(data.stats.topScore, metric)}
              </Text>
            </Box>
            <Box p={3} bg={cardBg} borderRadius="lg" textAlign="center">
              <Text fontSize="xs" color={mutedColor}>Average</Text>
              <Text fontSize="xl" fontWeight="bold" color="purple.500">
                {formatValue(data.stats.avgScore, metric)}
              </Text>
            </Box>
          </Grid>
        </VStack>
      </CardHeader>

      <CardBody p={4}>
        <VStack spacing={3} align="stretch">
          {data.leaderboard.map((contributor, idx) => {
            const barWidth = data.stats.topScore > 0 
              ? `${(contributor.value / data.stats.topScore) * 100}%` 
              : '0%';
            const gradients = [
              'linear(to-r, yellow.400, orange.500)',
              'linear(to-r, gray.400, gray.600)',
              'linear(to-r, orange.700, yellow.700)',
              'linear(to-r, blue.400, blue.600)',
              'linear(to-r, purple.400, purple.600)',
            ];

            return (
              <Box
                key={contributor.username}
                position="relative"
                bg={useColorModeValue('gray.50', 'gray.700')}
                borderRadius="xl"
                overflow="hidden"
                border="1px solid"
                borderColor={borderColor}
                _hover={{ shadow: 'md', transform: 'translateX(4px)' }}
                transition="all 0.2s"
              >
                <Box
                  position="absolute"
                  left={0}
                  top={0}
                  bottom={0}
                  bgGradient={idx < 3 ? gradients[idx] : gradients[idx % 5]}
                  w={barWidth}
                  opacity={0.15}
                  borderRadius="xl"
                />
                <Flex align="center" justify="space-between" p={3} position="relative" zIndex={1}>
                  <HStack spacing={3} flex={1}>
                    <Badge
                      colorScheme={getRankColor(contributor.rank)}
                      fontSize="md"
                      px={3}
                      py={1}
                      borderRadius="lg"
                      fontWeight="black"
                      minW="50px"
                      textAlign="center"
                    >
                      {getRankIcon(contributor.rank)} {contributor.rank}
                    </Badge>
                    <Link href={`https://github.com/${contributor.username}`} isExternal _hover={{ textDecoration: 'none' }}>
                      <Avatar
                        size="md"
                        src={contributor.avatarUrl}
                        name={contributor.username}
                        border="3px solid"
                        borderColor={idx < 3 ? [`yellow.400`, `gray.400`, `orange.600`][idx] : 'blue.400'}
                      />
                    </Link>
                    <VStack align="start" spacing={0} flex={1}>
                      <HStack spacing={2}>
                        <Link
                          href={`https://github.com/${contributor.username}`}
                          isExternal
                          fontWeight="bold"
                          fontSize="md"
                          color={useColorModeValue('gray.800', 'white')}
                          _hover={{ color: 'blue.500' }}
                        >
                          {contributor.name || contributor.username}
                        </Link>
                        {contributor.risingStarIndex && contributor.risingStarIndex > 0 && (
                          <Badge colorScheme="yellow" fontSize="xs">
                            <StarIcon boxSize={2} /> Rising
                          </Badge>
                        )}
                      </HStack>
                      <Text fontSize="xs" color={mutedColor}>@{contributor.username}</Text>
                      {contributor.company && (
                        <Text fontSize="xs" color={mutedColor}>🏢 {contributor.company}</Text>
                      )}
                    </VStack>
                  </HStack>
                  
                  <VStack spacing={1} minW="120px" align="end">
                    <Text fontSize="2xl" fontWeight="black" color={`${getCurrentMetricColor()}.500`}>
                      {formatValue(contributor.value, metric)}
                    </Text>
                    <Text fontSize="xs" color={mutedColor}>{getMetricLabel(metric)}</Text>
                    {contributor.activityStatus && (
                      <Badge colorScheme={getStatusColor(contributor.activityStatus)} fontSize="xs">
                        {contributor.activityStatus}
                      </Badge>
                    )}
                  </VStack>

                  <Link href={`https://github.com/${contributor.username}`} isExternal ml={3}>
                    <Icon as={ExternalLinkIcon} color="blue.500" boxSize={4} />
                  </Link>
                </Flex>
              </Box>
            );
          })}
        </VStack>

        {data.leaderboard.length === 0 && (
          <Alert status="info" borderRadius="lg">
            <AlertIcon />
            No data available for the selected time period and metric.
          </Alert>
        )}

        <Text fontSize="xs" color={mutedColor} mt={4} textAlign="center">
          Last updated: {new Date(data.generatedAt).toLocaleString()}
        </Text>
      </CardBody>
    </Card>
  );
};

export default TimeBasedLeaderboard;
