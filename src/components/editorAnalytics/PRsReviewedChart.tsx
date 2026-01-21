import React, { useMemo } from 'react';
import {
  Box,
  Heading,
  Text,
  useColorModeValue,
  Flex,
  Button,
  Spinner,
} from '@chakra-ui/react';
import { FiDownload } from 'react-icons/fi';
import dynamic from 'next/dynamic';
import { CSVLink } from 'react-csv';
import CopyLink from '@/components/CopyLink';

const Line = dynamic(() => import('@ant-design/plots').then((mod) => mod.Line), {
  ssr: false,
  loading: () => (
    <Flex justify="center" align="center" height="400px">
      <Spinner size="xl" />
    </Flex>
  ),
});

interface PRsReviewedChartProps {
  data: any;
  timePeriod: string;
}

const PRsReviewedChart: React.FC<PRsReviewedChartProps> = ({
  data,
  timePeriod,
}) => {
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const headerColor = useColorModeValue('#2b6cb0', '#4FD1FF');

  const monthlyData = data?.monthlyPRsReviewed || [];

  const config = useMemo(() => ({
    data: monthlyData,
    xField: 'monthYear',
    yField: 'count',
    seriesField: 'reviewer',
    smooth: true,
    animation: {
      appear: {
        animation: 'path-in',
        duration: 1000,
      },
    },
    lineStyle: {
      lineWidth: 2,
    },
    point: {
      size: 4,
      shape: 'circle',
    },
    xAxis: {
      label: {
        autoRotate: false,
        autoHide: true,
      },
      title: {
        text: 'Month',
        style: { fontSize: 14, fontWeight: 'bold' as const },
      },
    },
    yAxis: {
      title: {
        text: 'Number of PRs Reviewed',
        style: { fontSize: 14, fontWeight: 'bold' as const },
      },
    },
    legend: {
      position: 'top' as const,
      layout: 'horizontal' as const,
      itemName: {
        style: { fontSize: 12 },
      },
    },
    tooltip: {
      shared: true,
      showCrosshairs: true,
    },
  }), [monthlyData]);

  const csvData = monthlyData.map((item: any) => ({
    'Month': item.monthYear,
    'Reviewer': item.reviewer,
    'PRs Reviewed': item.count,
  }));

  return (
    <Box
      bg={cardBg}
      p={{ base: 4, md: 5 }}
      borderRadius="lg"
      borderWidth="1px"
      borderColor={borderColor}
      mt={{ base: 4, md: 6 }}
    >
      <Flex justify="space-between" align="center" mb={4} flexWrap="wrap" gap={2}>
        <Box>
          <Heading 
            as="h4" 
            size="lg" 
            fontWeight="bold" 
            color={headerColor}
          >
            PRs Reviewed (Monthly)
            <CopyLink link="https://eipsinsight.com/EditorAnalytics#Monthly" />
          </Heading>
          <Text fontSize="sm" color="gray.500" mt={1}>
            Monthly pull request review activity by editors and reviewers
          </Text>
        </Box>
        <CSVLink data={csvData} filename={`prs-reviewed-monthly-${timePeriod}.csv`}>
          <Button size="sm" leftIcon={<FiDownload />} colorScheme="blue">
            Export CSV
          </Button>
        </CSVLink>
      </Flex>
      <Box height="450px">
        <Line {...config} />
      </Box>
    </Box>
  );
};

export default PRsReviewedChart;
