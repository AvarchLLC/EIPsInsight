import React, { useState, useEffect } from 'react';
import {
  Box, Card, CardHeader, CardBody, Heading, Text, VStack, HStack,
  Badge, useColorModeValue, Spinner, Alert, AlertIcon, Grid,
  Avatar, Link, Select, Flex, Icon, Divider
} from '@chakra-ui/react';
import { FiTrendingUp, FiTrendingDown, FiMinus } from 'react-icons/fi';

interface PeriodData {
  period: string;
  label: string;
  data: any[];
  loading: boolean;
  error: string | null;
}

interface MultiPeriodComparisonProps {
  metric?: string;
  topN?: number;
}

const MultiPeriodComparison: React.FC<MultiPeriodComparisonProps> = ({
  metric = 'activityScore',
  topN = 10
}) => {
  const [periods, setPeriods] = useState<PeriodData[]>([
    { period: 'weekly', label: 'Weekly', data: [], loading: true, error: null },
    { period: 'monthly', label: 'Monthly', data: [], loading: true, error: null },
    { period: 'yearly', label: 'Yearly', data: [], loading: true, error: null },
    { period: 'overall', label: 'All Time', data: [], loading: true, error: null },
  ]);

  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const mutedColor = useColorModeValue('gray.600', 'gray.400');

  useEffect(() => {
    fetchAllPeriods();
  }, [metric, topN]);

  const fetchAllPeriods = async () => {
    const fetchPromises = periods.map(async (period) => {
      try {
        const response = await fetch(
          `/api/contributors/analytics?period=${period.period}&metric=${metric}&limit=${topN}`
        );
        if (!response.ok) throw new Error('Failed to fetch');
        const result = await response.json();
        return {
          ...period,
          data: result.leaderboard,
          loading: false,
          error: null
        };
      } catch (err) {
        return {
          ...period,
          data: [],
          loading: false,
          error: err instanceof Error ? err.message : 'Error'
        };
      }
    });

    const results = await Promise.all(fetchPromises);
    setPeriods(results);
  };

  const getMetricLabel = (metricType: string) => {
    const labels: Record<string, string> = {
      activityScore: 'Activity Score',
      commits: 'Commits',
      prs: 'Pull Requests',
      reviews: 'Code Reviews'
    };
    return labels[metricType] || 'Score';
  };

  const getTrendIcon = (username: string, periodIndex: number) => {
    if (periodIndex === 0) return null; // No comparison for first period
    
    const currentData = periods[periodIndex].data;
    const prevData = periods[periodIndex - 1].data;
    
    const currentRank = currentData.findIndex(c => c.username === username);
    const prevRank = prevData.findIndex(c => c.username === username);
    
    if (currentRank === -1 || prevRank === -1) return null;
    
    if (currentRank < prevRank) {
      return <Icon as={FiTrendingUp} color="green.500" boxSize={3} />;
    } else if (currentRank > prevRank) {
      return <Icon as={FiTrendingDown} color="red.500" boxSize={3} />;
    }
    return <Icon as={FiMinus} color="gray.500" boxSize={3} />;
  };

  const formatValue = (value: number) => {
    if (metric === 'activityScore') {
      return value.toFixed(1);
    }
    return value.toLocaleString();
  };

  return (
    <Card bg={cardBg} shadow="xl" borderRadius="2xl" border="1px solid" borderColor={borderColor}>
      <CardHeader p={4}>
        <VStack align="stretch" spacing={3}>
          <Heading size="md" color="purple.500">
            📊 Multi-Period Comparison
          </Heading>
          <Text fontSize="sm" color={mutedColor}>
            Top {topN} contributors across different time periods - {getMetricLabel(metric)}
          </Text>
        </VStack>
      </CardHeader>

      <CardBody p={4}>
        <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', xl: 'repeat(4, 1fr)' }} gap={4}>
          {periods.map((period, periodIndex) => (
            <Card
              key={period.period}
              bg={useColorModeValue('gray.50', 'gray.700')}
              borderRadius="xl"
              overflow="hidden"
            >
              <CardHeader p={3} bg={useColorModeValue(['blue.50', 'green.50', 'purple.50', 'orange.50'][periodIndex], 'gray.600')}>
                <Heading size="sm" textAlign="center">
                  {period.label}
                </Heading>
              </CardHeader>
              <CardBody p={3}>
                {period.loading ? (
                  <VStack py={8}>
                    <Spinner size="md" color="blue.500" />
                    <Text fontSize="xs" color={mutedColor}>Loading...</Text>
                  </VStack>
                ) : period.error ? (
                  <Alert status="error" size="sm" borderRadius="md">
                    <AlertIcon />
                    Error
                  </Alert>
                ) : (
                  <VStack spacing={2} align="stretch">
                    {period.data.slice(0, topN).map((contributor, idx) => (
                      <Box
                        key={contributor.username}
                        p={2}
                        bg={cardBg}
                        borderRadius="lg"
                        border="1px solid"
                        borderColor={borderColor}
                        _hover={{ borderColor: ['yellow.400', 'gray.400', 'orange.400'][idx] || 'blue.400' }}
                        transition="all 0.2s"
                      >
                        <Flex align="center" justify="space-between">
                          <HStack spacing={2} flex={1}>
                            <Badge
                              colorScheme={idx === 0 ? 'yellow' : idx === 1 ? 'gray' : idx === 2 ? 'orange' : 'blue'}
                              fontSize="xs"
                              minW="24px"
                              textAlign="center"
                            >
                              {idx + 1}
                            </Badge>
                            <Avatar
                              size="xs"
                              src={contributor.avatarUrl}
                              name={contributor.username}
                            />
                            <VStack align="start" spacing={0} flex={1}>
                              <Link
                                href={`https://github.com/${contributor.username}`}
                                isExternal
                                fontSize="xs"
                                fontWeight="bold"
                                noOfLines={1}
                                maxW="100px"
                                _hover={{ color: 'blue.500' }}
                              >
                                {contributor.username}
                              </Link>
                              <Text fontSize="2xs" color={mutedColor}>
                                {formatValue(contributor.value)}
                              </Text>
                            </VStack>
                          </HStack>
                          {getTrendIcon(contributor.username, periodIndex)}
                        </Flex>
                      </Box>
                    ))}
                  </VStack>
                )}
              </CardBody>
            </Card>
          ))}
        </Grid>

        <Box mt={4} p={3} bg={useColorModeValue('blue.50', 'gray.700')} borderRadius="lg">
          <HStack spacing={4} fontSize="xs" color={mutedColor} justify="center" flexWrap="wrap">
            <HStack>
              <Icon as={FiTrendingUp} color="green.500" />
              <Text>Rank improved</Text>
            </HStack>
            <HStack>
              <Icon as={FiTrendingDown} color="red.500" />
              <Text>Rank declined</Text>
            </HStack>
            <HStack>
              <Icon as={FiMinus} color="gray.500" />
              <Text>No change</Text>
            </HStack>
          </HStack>
        </Box>
      </CardBody>
    </Card>
  );
};

export default MultiPeriodComparison;
