import {
  Box,
  Flex,
  Heading,
  Text,
  HStack,
  VStack,
  Badge,
  Icon,
  useColorModeValue
} from "@chakra-ui/react";
import { FaClock, FaRegClock } from 'react-icons/fa';
import React, { useState, useEffect, useLayoutEffect } from "react";
import dynamic from "next/dynamic";
import CopyLink from "@/components/CopyLink";
import axios from "axios";
import type { PieConfig } from '@ant-design/plots';

const Column = dynamic(() => import("@ant-design/plots").then(mod => mod.Column), { ssr: false });
const Pie = dynamic(() => import('@ant-design/plots').then(mod => mod.Pie), { ssr: false });

type PR = {
  repo: string;
  prNumber: number;
  key: string;
  tag: string;
  prTitle: string;
  created_at: Date;
  closed_at: Date | null;
  merged_at: Date | null;
  reviewDate: Date | null;
};

interface ChartDataItem {
  _id: string;
  category: string;
  monthYear: string;
  type: 'Created' | 'Merged' | 'Closed' | 'Open' | 'Review';
  count: number;
  eips: number;
  ercs: number;
  rips: number;
}

interface ReviewEntry {
  repo: string;
  prNumber: number;
  prTitle: string;
  created_at: string;  // ISO date string
  closed_at: string | null;
  merged_at: string | null;
  reviewDate: string;  // ISO date string
  reviewComment: string;
}

interface ReviewerReviews {
  [reviewerName: string]: ReviewEntry[];
}

const ERCsPRChart: React.FC = () => {
  const bg = useColorModeValue("#f6f6f7", "#171923");
  const [selectedRepo, setSelectedRepo] = useState<string>('ERCs');
  const [recentPRs, setRecentPRs] = useState<PR[]>([]);
  const [editorReviews, setEditorReviews] = useState<ReviewerReviews>({});
  const [data, setData] = useState<{
    PRs: { [key: string]: { created: PR[], closed: PR[], merged: PR[], open: PR[], review: PR[] } };
  }>({ PRs: {} });
  const [activeTab, setActiveTab] = useState<'PRs' | 'Issues'>('PRs');
  const [sliderValue, setSliderValue] = useState<number>(0);
  const [chartdata, setchartData] = useState<ChartDataItem[] | undefined>([]);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [loading2, setLoading2] = useState<boolean>(false);
  const [loading3, setLoading3] = useState<boolean>(false);
  const [downloaddata, setdownloadData] = useState<{
    PRs: { [key: string]: { created: PR[], closed: PR[], merged: PR[], open: PR[], review: PR[] } };
  }>({ PRs: {} });
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [showCategory, setShowCategory] = useState<{ [key: string]: boolean }>({
    created: true,
    closed: true,
    merged: true,
    open: true,
    review: true
  });

  useEffect(() => {
  const fetchRecentPRs = async () => {
    try {
      const response = await axios.get('/api/ercsrecentactivity');
      setRecentPRs(response.data);
    } catch (error) {
      console.error('Error fetching recent PRs:', error);
    }
  };

  fetchRecentPRs();
  const intervalId = setInterval(fetchRecentPRs, 5 * 60 * 1000);

  return () => clearInterval(intervalId);
}, []);

useEffect(() => {
  const fetchRecentPRs = async () => {
    try {
      const response = await axios.get('/api/ercseditorsactivity');
      setEditorReviews(response.data);
      console.log("editors data - erc:",response.data);
    } catch (error) {
      console.error('Error fetching recent PRs:', error);
    }
  };

  fetchRecentPRs();
  const intervalId = setInterval(fetchRecentPRs, 5 * 60 * 1000);

  return () => clearInterval(intervalId);
}, []);

const hasReviews = Object.keys(editorReviews).some(reviewer => editorReviews[reviewer].length > 0);

const allReviews = Object.entries(editorReviews)
  .flatMap(([reviewer, reviews]) =>
    reviews.map((review) => ({ ...review, reviewer }))
  )
  .sort((a, b) => new Date(b.reviewDate).getTime() - new Date(a.reviewDate).getTime());



const donutData = Object.entries(editorReviews)
    .filter(([_, reviews]) => reviews.length > 0)
    .map(([name, reviews]) => ({
      type: name,
      value: reviews.length,
    }));

  const config: PieConfig = {
  data: donutData,
  angleField: 'value',
  colorField: 'type',
  radius: 1,
  innerRadius: 0.6,
  interactions: [{ type: 'element-active' }],
  label: {
    type: 'inner',
    offset: '-50%',
    content: '{value}', // shows the value inside the segment
    style: {
      fill: '#fff',
      fontSize: 14,
      fontWeight: 'bold',
      textAlign: 'center',
    },
  },
  legend: {
    position: 'right',
  },
};



  const fetchEndpoint = () => {
    const baseUrl = '/api/AnalyticsCharts';
    const tabPath = activeTab === 'PRs' ? 'prs' : 'issues';
    const repoPath = selectedRepo.toLowerCase();
    const endpoint = `${baseUrl}/${tabPath}/${repoPath}`;

    return endpoint;
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const endpoint = fetchEndpoint();
        const response = await axios.get(endpoint);
        setchartData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeTab, selectedRepo]);

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(prev => prev === category ? null : category);
    setShowCategory({
      created: category === 'created',
      open: category === 'open',
      closed: category === 'closed',
      merged: category === 'merged',
      review: category === 'review'
    });
  };

  const getYears = () => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 10 }, (_, i) => currentYear - i);
  };

  const getMonths = () => [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedYear || !selectedMonth) return;

      setLoading2(true);

      const key = `${selectedYear}-${String(getMonths().indexOf(selectedMonth) + 1).padStart(2, '0')}`;
      const endpoint = `/api/AnalyticsData/prs/${selectedRepo.toLowerCase()}/${key}`;

      try {
        const response = await fetch(endpoint);
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const result = await response.json();

        const formattedData = result.reduce((acc: any, item: any) => {
          const { monthYear, value } = item;
          const { created, closed, merged, open, review } = value;

          if (!acc.PRs[monthYear]) {
            acc.PRs[monthYear] = { created: [], closed: [], merged: [], open: [], review: [] };
          }
          acc.PRs[monthYear].created = created || [];
          acc.PRs[monthYear].closed = closed || [];
          acc.PRs[monthYear].merged = merged || [];
          acc.PRs[monthYear].open = open || [];
          acc.PRs[monthYear].review = review || [];

          return acc;
        }, { PRs: {}, Issues: {} });

        setData(formattedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading2(false);
      }
    };

    fetchData();
  }, [selectedRepo, selectedYear, selectedMonth, activeTab]);

  useEffect(() => {
    const fetchData2 = async () => {
      setLoading3(true);
      const endpoint = `/api/AnalyticsData/prs/${selectedRepo.toLowerCase()}`;

      try {
        const response = await fetch(endpoint);
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const result = await response.json();

        const formattedData = result.reduce((acc: any, item: any) => {
          const { monthYear, value } = item;
          const { created = [], closed = [], merged = [], open = [], review = [] } = value;

          if (!acc.PRs[monthYear]) {
            acc.PRs[monthYear] = { created: [], closed: [], merged: [], open: [], review: [] };
          }
          acc.PRs[monthYear].created.push(...created);
          acc.PRs[monthYear].closed.push(...closed);
          acc.PRs[monthYear].merged.push(...merged);
          acc.PRs[monthYear].open.push(...open);
          acc.PRs[monthYear].review.push(...review);

          return acc;
        }, { PRs: {}, Issues: {} });

        setdownloadData(formattedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading3(false);
      }
    };

    fetchData2();
  }, [activeTab, selectedRepo]);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleDownload = () => {
    // Implement your download logic here
    console.log("Downloading data...");
  };

  const renderChart = () => {
    const transformedData = Array.isArray(chartdata)
      ? chartdata.reduce<{
        [key: string]: { [key: string]: number };
      }>((acc, { monthYear, type, count }) => {
        if (showCategory[type.toLowerCase()]) {
          if (!acc[monthYear]) {
            acc[monthYear] = {};
          }
          acc[monthYear][type] = (acc[monthYear][type] || 0) + count;
        }
        return acc;
      }, {})
      : {};

    const finalTransformedData = Object.keys(transformedData || {}).flatMap(monthYear => {
      const entry = transformedData[monthYear];
      return [
        ...(showCategory.created ? [{ monthYear, type: 'Created', count: entry.Created ?? 0 }] : []),
        ...(showCategory.merged ? [{ monthYear, type: 'Merged', count: -(entry.Merged ?? 0) }] : []),
        ...(showCategory.closed ? [{ monthYear, type: 'Closed', count: -(entry.Closed ?? 0) }] : []),
        ...(showCategory.open ? [{ monthYear, type: 'Open', count: entry.Open ?? 0 }] : []),
      ];
    });

    const sortedData = finalTransformedData.sort((a, b) => a.monthYear.localeCompare(b.monthYear));

    const config = {
  data: sortedData,
  xField: 'monthYear',
  yField: 'count',
  seriesField: 'type',
  isStack: true, // ✅ Use stacked layout instead of grouped
  color: (datum: { type?: string }) => {
    switch (datum.type) {
      case 'Closed': return '#ff4d4d';
      case 'Merged': return '#4caf50';
      case 'Created': return '#2196f3';
      case 'Open': return '#ffa500';
      case 'Review': return '#9c27b0';
      default: return '#cccccc';
    }
  },
  slider: {
    start: sliderValue,
    end: 1,
    step: 0.01,
    min: 0,
    max: 1,
    onChange: (value: any) => setSliderValue(value),
  },
  legend: {
    position: 'top-right' as const,
  },
  tooltip: {
    showTitle: true,
    title: 'PR Details',
    fields: ['monthYear', 'type', 'count'],
    formatter: (datum: any) => {
      return {
        name: datum.type,
        value: `${datum.count} PRs`,
      };
    },
  },
  columnStyle: {
    radius: [0, 0, 0, 0],
  },
  marginRatio: 0.1,
  dodgePadding: 2,
  interactions: [
    {
      type: 'element-active',
      cfg: {
        style: {
          fillOpacity: 0.8,
        },
      },
    },
  ],
};


    return <Column {...config} />;
  };


  return (
    <>
  {/* Row 1: Chart and Recently Closed/Merged */}
  <Flex
    direction={{ base: "column", md: "row" }}
    gap={4}
    ml="4rem"
    mr="2rem"
    mb="2rem"
    id="ERC Activity"
  >
    {/* ERCs Activity Chart */}
    <Box
      bgColor={bg}
      padding="1rem"
      borderRadius="0.55rem"
      flex={1}
      minW="300px"
    >
      <Flex align="center" mb="1rem">
        <FaClock style={{ marginRight: "0.5rem" }} />
        <Heading color={useColorModeValue("#3182CE", "blue.300")} size="md">
          ERCs Activity
        </Heading>
      </Flex>
      {renderChart()}
    </Box>

    {/* Recently Closed/Merged PRs */}
    <Box
      bgColor={bg}
      padding="1rem"
      borderRadius="0.55rem"
      flex={1}
      minW="300px"
    >
      <Flex align="center" mb="1rem">
        <FaClock style={{ marginRight: "0.5rem" }} />
        <Heading color={useColorModeValue("#3182CE", "blue.300")} size="md">
          Recently Closed/Merged PRs
        </Heading>
      </Flex>
      <Box maxH="400px" overflowY="auto">
        <VStack align="stretch" spacing={4}>
          {recentPRs.map((pr) => {
            const status = pr.merged_at ? "Merged" : "Closed";
            const statusColor = pr.merged_at ? "purple" : "red";
            const date = pr.merged_at || pr.closed_at;

            return (
              <a
                key={pr.prNumber}
                href={`https://github.com/ethereum/ERCs/pull/${pr.prNumber}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Box
                  p={4}
                  bg={useColorModeValue("white", "gray.800")}
                  borderRadius="xl"
                  boxShadow="sm"
                  _hover={{ boxShadow: "md" }}
                >
                  <HStack justify="space-between" wrap="wrap">
                    <HStack spacing={2} wrap="wrap">
                      <Badge colorScheme="blue" px={2} py={1} borderRadius="full">
                        #{pr.prNumber}
                      </Badge>
                      <Badge colorScheme={statusColor} px={2} py={1} borderRadius="full">
                        {status}
                      </Badge>
                    </HStack>
                    <HStack spacing={2} align="center">
                      <Icon as={FaRegClock} fontSize="sm" />
                      <Text fontSize="xs" color="gray.500">
                        {date ? new Date(date).toLocaleString(undefined, {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                          hour12: false
                        }) : "N/A"}
                      </Text>
                    </HStack>
                  </HStack>
                  <Box mt={2}>
                    <Text fontSize="md" fontWeight="semibold" color={useColorModeValue("gray.800", "white")}>
                      {pr.prTitle}
                    </Text>
                  </Box>
                </Box>
              </a>
            );
          })}
        </VStack>
      </Box>
    </Box>
  </Flex>

  {/* Row 2: Donut Chart and Editor Reviews */}
  <Flex
    direction={{ base: "column", md: "row" }}
    gap={4}
    ml="4rem"
    mr="2rem"
    mb="2rem"
  >
    {/* Donut Chart */}
    <Box
      bgColor={bg}
      padding="1rem"
      borderRadius="0.55rem"
      flex={1}
      minW="300px"
    >
      <Flex align="center" mb="1rem">
        <FaClock style={{ marginRight: "0.5rem" }} />
        <Heading color={useColorModeValue("#3182CE", "blue.300")} size="md">
          Review Activity (Last 24 Hours)
        </Heading>
      </Flex>
      {!hasReviews ? (
        <Text color="gray.500">No reviews in last 24 hours</Text>
      ) : (
        <Pie {...config} />
      )}
    </Box>

    {/* Editor Reviews Table */}
    <Box
      bgColor={bg}
      padding="1rem"
      borderRadius="0.55rem"
      flex={1}
      minW="300px"
    >
      <Flex align="center" mb="1rem">
        <FaClock style={{ marginRight: "0.5rem" }} />
        <Heading color={useColorModeValue("#3182CE", "blue.300")} size="md">
          Editor Reviews(Last 24 Hours)
        </Heading>
      </Flex>
      {!hasReviews && (
        <Text color="gray.500">No reviews in last 24 hours</Text>
      )
      }
      {hasReviews && (
        <Box maxH="400px" overflowY="auto">
          <VStack align="stretch" spacing={4}>
            
                  {allReviews.map((pr) => {
                    const status = pr.merged_at ? "Merged" : "Closed";
                    const statusColor = pr.merged_at ? "purple" : "red";
                    const date = pr.reviewDate;

                    return (
                      <a
                        key={pr.prNumber}
                        href={`https://github.com/ethereum/ERCs/pull/${pr.prNumber}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Box
                          p={4}
                          bg={useColorModeValue("white", "gray.800")}
                          borderRadius="xl"
                          boxShadow="sm"
                          _hover={{ boxShadow: "md" }}
                          mb={2}
                        >
                          <HStack justify="space-between" wrap="wrap">
                            <HStack spacing={2} wrap="wrap">
                              <Badge colorScheme="blue" px={2} py={1} borderRadius="full">
                                #{pr.prNumber}
                              </Badge>
                              <Badge colorScheme={statusColor} px={2} py={1} borderRadius="full">
                                {status}
                              </Badge>
                              <Badge colorScheme="teal" px={2} py={1} borderRadius="full">
                                Reviewer:{pr.reviewer}
                              </Badge>
                            </HStack>
                            <HStack spacing={2} align="center">
                              <Icon as={FaRegClock} fontSize="sm" />
                              <Text fontSize="xs" color="gray.500">
                                {date ? new Date(date).toLocaleString(undefined, {
                                  year: 'numeric',
                                  month: '2-digit',
                                  day: '2-digit',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                  second: '2-digit',
                                  hour12: false
                                }) : "N/A"}
                              </Text>
                            </HStack>
                          </HStack>
                          <Box mt={2}>
                            <Text fontSize="md" fontWeight="semibold" color={useColorModeValue("gray.800", "white")}>
                              {pr.prTitle}
                            </Text>
                          </Box>
                        </Box>
                      </a>
                    );
                  })}
                
          </VStack>
        </Box>
      )}
    </Box>
  </Flex>
</>


  );
};

export default ERCsPRChart;