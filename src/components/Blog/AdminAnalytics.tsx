"use client";

import { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Grid,
  GridItem,
  useColorModeValue,
  Badge,
  Progress,
  Divider,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Icon,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from '@chakra-ui/react';
import {
  FaEye,
  FaArrowUp,
  FaArrowDown,
  FaComment,
  FaDownload,
  FaUsers,
  FaTrophy,
  FaChartLine,
} from 'react-icons/fa';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

interface AdminAnalyticsProps {
  blogSlug: string;
}

interface AnalyticsData {
  total_views: number;
  unique_views: number;
  upvotes: number;
  downvotes: number;
  comments: number;
  downloads: number;
  net_score: number;
  engagement_rate: number;
  view_trend: number;
  top_referrers: Array<{ source: string; count: number }>;
  hourly_views: Array<{ hour: number; count: number }>;
  user_breakdown: {
    logged_in: number;
    anonymous: number;
  };
}

function StatCard({
  label,
  value,
  icon,
  trend,
  colorScheme = 'blue',
}: {
  label: string;
  value: number | string;
  icon: any;
  trend?: number;
  colorScheme?: string;
}) {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <MotionBox
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Box
        bg={bgColor}
        borderWidth="1px"
        borderColor={borderColor}
        borderRadius="xl"
        p={6}
        boxShadow="md"
      >
        <Stat>
          <HStack justify="space-between" mb={3}>
            <Icon as={icon} boxSize={6} color={`${colorScheme}.500`} />
            {trend !== undefined && (
              <Badge colorScheme={trend > 0 ? 'green' : 'red'}>
                <HStack spacing={1}>
                  <StatArrow type={trend > 0 ? 'increase' : 'decrease'} />
                  <Text>{Math.abs(trend)}%</Text>
                </HStack>
              </Badge>
            )}
          </HStack>
          <StatNumber fontSize="3xl" fontWeight="bold">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </StatNumber>
          <StatLabel fontSize="sm" color="gray.500" mt={2}>
            {label}
          </StatLabel>
        </Stat>
      </Box>
    </MotionBox>
  );
}

export default function AdminAnalytics({ blogSlug }: AdminAnalyticsProps) {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  useEffect(() => {
    fetchAnalytics();
  }, [blogSlug]);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(`/api/admin/blogs/${blogSlug}/analytics`);
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || !analytics) {
    return (
      <Box p={6} textAlign="center">
        <Text>Loading analytics...</Text>
      </Box>
    );
  }

  const engagementScore = Math.round(
    ((analytics.upvotes + analytics.comments * 2) / analytics.unique_views) * 100
  );

  return (
    <Box
      bg={bgColor}
      borderWidth="1px"
      borderColor={borderColor}
      borderRadius="xl"
      p={6}
      mt={6}
    >
      <VStack align="stretch" spacing={6}>
        {/* Header */}
        <HStack justify="space-between">
          <HStack>
            <Icon as={FaChartLine} boxSize={6} color="purple.500" />
            <Text fontSize="2xl" fontWeight="bold">
              Admin Analytics
            </Text>
          </HStack>
          <Badge colorScheme="purple" fontSize="md" px={3} py={1}>
            Admin Only
          </Badge>
        </HStack>

        <Divider />

        {/* Main Stats Grid */}
        <Grid templateColumns="repeat(auto-fit, minmax(200px, 1fr))" gap={4}>
          <GridItem>
            <StatCard
              label="Total Views"
              value={analytics.total_views}
              icon={FaEye}
              trend={analytics.view_trend}
              colorScheme="blue"
            />
          </GridItem>
          <GridItem>
            <StatCard
              label="Unique Visitors"
              value={analytics.unique_views}
              icon={FaUsers}
              colorScheme="green"
            />
          </GridItem>
          <GridItem>
            <StatCard
              label="Upvotes"
              value={analytics.upvotes}
              icon={FaArrowUp}
              colorScheme="green"
            />
          </GridItem>
          <GridItem>
            <StatCard
              label="Downvotes"
              value={analytics.downvotes}
              icon={FaArrowDown}
              colorScheme="red"
            />
          </GridItem>
          <GridItem>
            <StatCard
              label="Comments"
              value={analytics.comments}
              icon={FaComment}
              colorScheme="purple"
            />
          </GridItem>
          <GridItem>
            <StatCard
              label="Downloads"
              value={analytics.downloads}
              icon={FaDownload}
              colorScheme="orange"
            />
          </GridItem>
        </Grid>

        {/* Performance Metrics */}
        <Box
          bg={useColorModeValue('gray.50', 'gray.700')}
          p={6}
          borderRadius="lg"
        >
          <VStack align="stretch" spacing={4}>
            <Text fontSize="lg" fontWeight="semibold">
              Performance Metrics
            </Text>

            {/* Net Score */}
            <Box>
              <HStack justify="space-between" mb={2}>
                <Text fontSize="sm">Net Vote Score</Text>
                <Badge
                  colorScheme={analytics.net_score > 0 ? 'green' : 'red'}
                  fontSize="md"
                >
                  {analytics.net_score > 0 ? '+' : ''}
                  {analytics.net_score}
                </Badge>
              </HStack>
              <Progress
                value={Math.abs(analytics.net_score)}
                max={Math.max(analytics.upvotes, analytics.downvotes) || 1}
                colorScheme={analytics.net_score > 0 ? 'green' : 'red'}
                size="sm"
                borderRadius="full"
              />
            </Box>

            {/* Engagement Rate */}
            <Box>
              <HStack justify="space-between" mb={2}>
                <Text fontSize="sm">Engagement Score</Text>
                <Badge colorScheme="purple" fontSize="md">
                  {engagementScore}%
                </Badge>
              </HStack>
              <Progress
                value={engagementScore}
                max={100}
                colorScheme="purple"
                size="sm"
                borderRadius="full"
              />
            </Box>

            {/* Comment Rate */}
            <Box>
              <HStack justify="space-between" mb={2}>
                <Text fontSize="sm">Comment Rate</Text>
                <Text fontSize="sm" fontWeight="semibold">
                  {((analytics.comments / analytics.unique_views) * 100).toFixed(1)}%
                </Text>
              </HStack>
              <Progress
                value={(analytics.comments / analytics.unique_views) * 100}
                max={100}
                colorScheme="blue"
                size="sm"
                borderRadius="full"
              />
            </Box>
          </VStack>
        </Box>

        {/* Tabs for detailed data */}
        <Tabs variant="enclosed" colorScheme="blue">
          <TabList>
            <Tab>Traffic Sources</Tab>
            <Tab>User Breakdown</Tab>
            <Tab>Hourly Views</Tab>
          </TabList>

          <TabPanels>
            {/* Traffic Sources */}
            <TabPanel>
              <Table size="sm">
                <Thead>
                  <Tr>
                    <Th>Referrer</Th>
                    <Th isNumeric>Views</Th>
                    <Th isNumeric>%</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {analytics.top_referrers.map((ref, i) => (
                    <Tr key={i}>
                      <Td>{ref.source || 'Direct'}</Td>
                      <Td isNumeric>{ref.count}</Td>
                      <Td isNumeric>
                        {((ref.count / analytics.total_views) * 100).toFixed(1)}%
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TabPanel>

            {/* User Breakdown */}
            <TabPanel>
              <VStack spacing={4}>
                <HStack width="full" justify="space-between">
                  <Text>Logged In Users</Text>
                  <Badge colorScheme="green" fontSize="lg">
                    {analytics.user_breakdown.logged_in}
                  </Badge>
                </HStack>
                <Progress
                  value={analytics.user_breakdown.logged_in}
                  max={analytics.unique_views}
                  colorScheme="green"
                  size="md"
                  width="full"
                />

                <HStack width="full" justify="space-between">
                  <Text>Anonymous Users</Text>
                  <Badge colorScheme="gray" fontSize="lg">
                    {analytics.user_breakdown.anonymous}
                  </Badge>
                </HStack>
                <Progress
                  value={analytics.user_breakdown.anonymous}
                  max={analytics.unique_views}
                  colorScheme="gray"
                  size="md"
                  width="full"
                />
              </VStack>
            </TabPanel>

            {/* Hourly Views */}
            <TabPanel>
              <VStack spacing={2} align="stretch">
                {analytics.hourly_views.map((hourData) => (
                  <HStack key={hourData.hour} justify="space-between">
                    <Text fontSize="sm" width="80px">
                      {hourData.hour}:00
                    </Text>
                    <Progress
                      value={hourData.count}
                      max={Math.max(...analytics.hourly_views.map((h) => h.count))}
                      flex={1}
                      size="sm"
                      colorScheme="blue"
                    />
                    <Text fontSize="sm" width="60px" textAlign="right">
                      {hourData.count}
                    </Text>
                  </HStack>
                ))}
              </VStack>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </VStack>
    </Box>
  );
}
