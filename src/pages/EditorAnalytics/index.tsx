import React, { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  Heading,
  Text,
  useColorModeValue,
  Select,
  HStack,
  VStack,
  Grid,
  Spinner,
  Button,
  Input,
  Badge,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from '@chakra-ui/react';
import { FiUsers, FiTrendingUp, FiActivity, FiDownload, FiCalendar } from 'react-icons/fi';
import AllLayout from '@/components/Layout';
import AnimatedHeader from '@/components/AnimatedHeader';
import EditorLeaderboard from '@/components/editorAnalytics/EditorLeaderboard';
import EditorFrequencyChart from '@/components/editorAnalytics/EditorFrequencyChart';
import EditorActivityTimeline from '@/components/editorAnalytics/EditorActivityTimeline';
import EditorComparisonTable from '@/components/editorAnalytics/EditorComparisonTable';
import EditorMetricsCards from '@/components/editorAnalytics/EditorMetricsCards';
import EditorContributionHeatmap from '@/components/editorAnalytics/EditorContributionHeatmap';
import EditorReviewVelocity from '@/components/editorAnalytics/EditorReviewVelocity';
import PRsReviewedChart from '@/components/editorAnalytics/PRsReviewedChart';
import RepositoryDistributionChart from '@/components/editorAnalytics/RepositoryDistributionChart';
import EditorReviewerRepoGrid from '@/components/editorAnalytics/EditorReviewerRepoGrid';
import axios from 'axios';

export default function EditorAnalytics() {
  const bg = useColorModeValue('#f6f6f7', '#171923');
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  // State
  const [timePeriod, setTimePeriod] = useState<'all' | 'week' | 'month' | 'year' | 'custom'>('all');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [selectedRepo, setSelectedRepo] = useState<'all' | 'eips' | 'ercs' | 'rips'>('all');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetchAnalyticsData();
  }, [timePeriod, selectedRepo, customStartDate, customEndDate]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        period: timePeriod,
        repo: selectedRepo,
      });

      if (timePeriod === 'custom' && customStartDate && customEndDate) {
        params.append('startDate', customStartDate);
        params.append('endDate', customEndDate);
      }

      const response = await axios.get(`/api/editorAnalytics?${params}`);
      setData(response.data);
    } catch (error) {
      console.error('Failed to fetch editor analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const faqItems = [
    {
      question: 'What is Editor Analytics?',
      answer:
        'A comprehensive dashboard showing detailed insights about EIP/ERC editors and reviewers, including review frequency, activity patterns, contribution metrics, and performance over time.',
    },
    {
      question: 'How is the data collected?',
      answer:
        'Data is aggregated from GitHub PR reviews, comments, merges, and editor activities across EIPs, ERCs, and RIPs repositories. It updates every 24 hours to reflect the latest contributions.',
    },
    {
      question: 'What metrics are shown?',
      answer:
        'Metrics include total reviews, review frequency, response time, approval rate, activity velocity, contribution heatmaps, editor comparisons, and detailed timelines with filterable periods.',
    },
    {
      question: 'Can I export the data?',
      answer:
        'Yes! Each section includes CSV export functionality with detailed metadata including timestamps, review types, PR numbers, and comprehensive editor statistics.',
    },
  ];

  return (
    <AllLayout>
      <Box bg={bg} minH="100vh">
        <Box px={{ base: 4, md: 6 }} pt={{ base: 4, md: 6 }}>
          {/* Header */}
          <AnimatedHeader
            title="Editor & Reviewer Analytics"
            description="Comprehensive insights and analytics for EIP/ERC editors and reviewers. Track performance, review patterns, contribution metrics, and activity trends across all repositories."
            faqItems={faqItems}
          />

          {/* Filters */}
          <Flex
            direction={{ base: 'column', md: 'row' }}
            gap={4}
            mb={6}
            p={{ base: 4, md: 5 }}
            bg={cardBg}
            borderRadius="lg"
            borderWidth="1px"
            borderColor={borderColor}
          >
            <VStack align="stretch" flex={1} spacing={2}>
              <Text fontSize="sm" fontWeight="semibold" color={useColorModeValue('#2b6cb0', '#4FD1FF')}>
                Time Period
              </Text>
              <Select
                value={timePeriod}
                onChange={(e) => setTimePeriod(e.target.value as any)}
                size="md"
              >
                <option value="all">All Time</option>
                <option value="week">Last 7 Days</option>
                <option value="month">Last 30 Days</option>
                <option value="year">Last Year</option>
                <option value="custom">Custom Range</option>
              </Select>
            </VStack>

            {timePeriod === 'custom' && (
              <>
                <VStack align="stretch" flex={1} spacing={2}>
                  <Text fontSize="sm" fontWeight="semibold" color={useColorModeValue('#2b6cb0', '#4FD1FF')}>
                    Start Date
                  </Text>
                  <Input
                    type="date"
                    value={customStartDate}
                    onChange={(e) => setCustomStartDate(e.target.value)}
                    size="md"
                  />
                </VStack>
                <VStack align="stretch" flex={1} spacing={2}>
                  <Text fontSize="sm" fontWeight="semibold" color={useColorModeValue('#2b6cb0', '#4FD1FF')}>
                    End Date
                  </Text>
                  <Input
                    type="date"
                    value={customEndDate}
                    onChange={(e) => setCustomEndDate(e.target.value)}
                    size="md"
                  />
                </VStack>
              </>
            )}

            <VStack align="stretch" flex={1} spacing={2}>
              <Text fontSize="sm" fontWeight="semibold" color={useColorModeValue('#2b6cb0', '#4FD1FF')}>
                Repository
              </Text>
              <Select
                value={selectedRepo}
                onChange={(e) => setSelectedRepo(e.target.value as any)}
                size="md"
              >
                <option value="all">All Repositories</option>
                <option value="eips">EIPs</option>
                <option value="ercs">ERCs</option>
                <option value="rips">RIPs</option>
              </Select>
            </VStack>
          </Flex>

          {loading ? (
            <Flex justify="center" align="center" minH="400px">
              <Spinner size="xl" color={useColorModeValue('#2b6cb0', '#4FD1FF')} />
            </Flex>
          ) : (
            <>
              {/* Key Metrics Cards */}
              <EditorMetricsCards data={data} />

              {/* Main Content Tabs */}
              <Tabs mt={6} colorScheme="blue">
                <TabList>
                  <Tab fontWeight="semibold">Overview</Tab>
                  <Tab fontWeight="semibold">Leaderboards</Tab>
                  <Tab fontWeight="semibold">Frequency & Trends</Tab>
                  <Tab fontWeight="semibold">Activity Timeline</Tab>
                  <Tab fontWeight="semibold">Repository Distribution</Tab>
                  <Tab fontWeight="semibold">Detailed Comparison</Tab>
                </TabList>

                <TabPanels>
                  {/* Overview Tab */}
                  <TabPanel px={0}>
                    <VStack spacing={6} align="stretch">
                      <EditorLeaderboard
                        data={data}
                        timePeriod={timePeriod}
                        repository={selectedRepo}
                      />
                      <PRsReviewedChart
                        data={data}
                        timePeriod={timePeriod}
                      />
                    </VStack>
                  </TabPanel>

                  {/* Leaderboards Tab */}
                  <TabPanel px={0}>
                    <EditorLeaderboard
                      data={data}
                      timePeriod={timePeriod}
                      repository={selectedRepo}
                    />
                  </TabPanel>

                  {/* Frequency & Trends Tab */}
                  <TabPanel px={0}>
                    <VStack spacing={6} align="stretch">
                      <EditorFrequencyChart
                        data={data}
                        timePeriod={timePeriod}
                      />
                      <EditorReviewVelocity
                        data={data}
                        timePeriod={timePeriod}
                      />
                      <EditorContributionHeatmap
                        data={data}
                      />
                    </VStack>
                  </TabPanel>

                  {/* Activity Timeline Tab */}
                  <TabPanel px={0}>
                    <EditorActivityTimeline
                      data={data}
                      timePeriod={timePeriod}
                    />
                  </TabPanel>

                  {/* Repository Distribution Tab */}
                  <TabPanel px={0}>
                    <VStack spacing={6} align="stretch">
                      <RepositoryDistributionChart
                        chartData={data?.repositoryDistribution || []}
                        loading={false}
                      />
                      <EditorReviewerRepoGrid
                        editorsData={data?.editorsRepoData || []}
                        reviewersData={data?.reviewersRepoData || []}
                      />
                    </VStack>
                  </TabPanel>

                  {/* Detailed Comparison Tab */}
                  <TabPanel px={0}>
                    <EditorComparisonTable
                      data={data}
                      timePeriod={timePeriod}
                      repository={selectedRepo}
                    />
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </>
          )}
        </Box>
      </Box>
    </AllLayout>
  );
}
