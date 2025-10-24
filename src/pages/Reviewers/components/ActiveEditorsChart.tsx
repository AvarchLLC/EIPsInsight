import React, { useMemo } from 'react';
import {
  Box,
  Flex,
  Heading,
  Spinner,
  Text,
  useColorModeValue,
  VStack,
  HStack,
  Badge,
} from '@chakra-ui/react';
import dynamic from 'next/dynamic';
import CopyLink from '@/components/CopyLink';

const Line = dynamic(() => import('@ant-design/plots').then((mod) => mod.Line), {
  ssr: false,
  loading: () => (
    <Flex justify="center" align="center" height="400px">
      <Spinner size="xl" />
    </Flex>
  ),
});

interface ChartDataItem {
  reviewer: string;
  repo: string;
  value: number;
}

interface ActiveEditorsChartProps {
  chartData: ChartDataItem[];
  loading: boolean;
  reviewerColors: { [key: string]: string };
}

const ActiveEditorsChart: React.FC<ActiveEditorsChartProps> = ({
  chartData,
  loading,
  reviewerColors,
}) => {
  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const headingColor = useColorModeValue('blue.600', 'blue.300');

  // Calculate totals for each reviewer across all repos
  const reviewerTotals = useMemo(() => {
    const totals: { [key: string]: number } = {};
    chartData.forEach((item) => {
      totals[item.reviewer] = (totals[item.reviewer] || 0) + item.value;
    });
    return Object.entries(totals)
      .sort((a, b) => b[1] - a[1])
      .map(([reviewer, total]) => ({ reviewer, total }));
  }, [chartData]);

  // Group data by repo for multi-line chart
  const lineChartData = useMemo(() => {
    // Transform data for line chart showing reviewer performance across repos
    return chartData.map((item) => ({
      reviewer: item.reviewer,
      repo: item.repo,
      value: item.value,
    }));
  }, [chartData]);

  const lineConfig = useMemo(() => ({
    data: lineChartData,
    xField: 'repo',
    yField: 'value',
    seriesField: 'reviewer',
    color: (datum: any) => reviewerColors[datum.reviewer] || '#1890FF',
    lineStyle: {
      lineWidth: 3,
    },
    point: {
      size: 5,
      shape: 'circle',
      style: {
        fill: 'white',
        stroke: '#1890FF',
        lineWidth: 2,
      },
    },
    xAxis: {
      title: {
        text: 'Repository Type',
        style: { fontSize: 14, fontWeight: 'bold' as const },
      },
    },
    yAxis: {
      title: {
        text: 'Number of PRs Reviewed',
        style: { fontSize: 14, fontWeight: 'bold' as const },
      },
    },
    tooltip: {
      formatter: (datum: any) => ({
        name: `${datum.reviewer} - ${datum.repo}`,
        value: `${datum.value} PRs`,
      }),
    },
    legend: {
      position: 'top' as const,
      itemName: { style: { fontSize: 12 } },
    },
    smooth: true,
  }), [lineChartData, reviewerColors]);

  return (
    <Box
      bg={bg}
      borderRadius="lg"
      borderWidth="1px"
      borderColor={borderColor}
      p={6}
      mt={8}
      boxShadow="md"
    >
      <Heading as="h3" size="lg" mb={4} fontWeight="bold" color={headingColor}>
        Active Editors PR Reviews in Each Repository
        <CopyLink link="https://eipsinsight.com/Reviewers#Speciality" />
      </Heading>

      {/* Reviewer Totals Summary */}
      <Box mb={6} p={4} bg={useColorModeValue('blue.50', 'gray.700')} borderRadius="md">
        <Heading size="sm" mb={3} color={headingColor}>
          Total Reviews by Editor
        </Heading>
        <Flex flexWrap="wrap" gap={3}>
          {reviewerTotals.map((item, index) => (
            <HStack
              key={item.reviewer}
              p={2}
              px={4}
              bg={bg}
              borderRadius="full"
              borderWidth="1px"
              borderColor={borderColor}
              spacing={2}
            >
              <Badge colorScheme="blue" fontSize="sm">
                #{index + 1}
              </Badge>
              <Text fontWeight="medium">{item.reviewer}</Text>
              <Badge colorScheme="green" fontSize="md">
                {item.total}
              </Badge>
            </HStack>
          ))}
        </Flex>
      </Box>

      {/* Line Chart */}
      {loading ? (
        <Flex justify="center" align="center" height="400px">
          <Spinner size="xl" />
        </Flex>
      ) : (
        <Box height="500px">
          <Line {...lineConfig} />
        </Box>
      )}
    </Box>
  );
};

export default ActiveEditorsChart;
