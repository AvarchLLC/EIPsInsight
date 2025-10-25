import React, { useMemo, useState } from 'react';
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
  IconButton,
  Collapse,
} from '@chakra-ui/react';
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import dynamic from 'next/dynamic';
import CopyLink from '@/components/CopyLink';

const Column = dynamic(() => import('@ant-design/plots').then((mod) => mod.Column), {
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
  const [showTotals, setShowTotals] = useState(false);
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

  // Transform data for stacked bar chart
  const stackedBarConfig = useMemo(() => ({
    data: chartData,
    xField: 'reviewer',
    yField: 'value',
    seriesField: 'repo',
    isStack: true,
    color: ['#1890FF', '#52C41A', '#FF4D4F'],
    label: {
      position: 'middle' as const,
      layout: [
        { type: 'interval-adjust-position' },
        { type: 'interval-hide-overlap' },
        { type: 'adjust-color' },
      ],
    },
    xAxis: {
      label: {
        autoRotate: false,
        autoHide: true,
        style: {
          fontSize: 11,
        },
      },
    },
    yAxis: {
      title: {
        text: 'Number of Reviews',
        style: { fontSize: 13, fontWeight: 'bold' as const },
      },
      grid: {
        line: {
          style: {
            stroke: '#E5E7EB',
            lineWidth: 1,
            lineDash: [4, 4],
          },
        },
      },
    },
    tooltip: {
      customContent: (title: string, items: any[]) => {
        if (!items || items.length === 0) return '';
        
        const total = items.reduce((sum, item) => sum + (Number(item.value) || 0), 0);
        
        return `
          <div style="padding: 12px; background: white; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.15);">
            <div style="font-weight: bold; margin-bottom: 8px; font-size: 14px; color: #1f2937;">${title}</div>
            <div style="margin-bottom: 8px; padding: 6px; background: #f3f4f6; border-radius: 4px;">
              <span style="font-weight: 600; color: #4b5563;">Total Reviews: </span>
              <span style="font-weight: bold; color: #2563eb; font-size: 15px;">${total}</span>
            </div>
            ${items.map(item => `
              <div style="display: flex; justify-content: space-between; align-items: center; margin: 4px 0;">
                <span style="display: flex; align-items: center;">
                  <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: ${item.color}; margin-right: 8px;"></span>
                  <span style="color: #374151;">${item.name}</span>
                </span>
                <span style="font-weight: 600; margin-left: 12px; color: #1f2937;">${item.value}</span>
              </div>
            `).join('')}
          </div>
        `;
      },
    },
    legend: {
      position: 'top-right' as const,
      itemName: { 
        style: { 
          fontSize: 12,
          fontWeight: 500,
        } 
      },
    },
  }), [chartData]);

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
      <Heading 
        as="h3" 
        size="lg" 
        mb={4} 
        fontWeight="bold" 
        color={headingColor}
        bgGradient="linear(to-r, blue.400, purple.500)"
        bgClip="text"
      >
        📊 Repository-wise Review Distribution
        <CopyLink link="https://eipsinsight.com/Reviewers#Speciality" />
      </Heading>
      <Text fontSize="sm" color="gray.500" mb={4}>
        Total contributions by each editor/reviewer across EIPs, ERCs, and RIPs repositories
      </Text>

      {/* Collapsible Reviewer Totals Summary */}
      <Box mb={4}>
        <Flex 
          align="center" 
          cursor="pointer" 
          onClick={() => setShowTotals(!showTotals)}
          p={3}
          bg={useColorModeValue('blue.50', 'gray.700')}
          borderRadius="md"
          _hover={{ bg: useColorModeValue('blue.100', 'gray.600') }}
          transition="background 0.2s"
        >
          <Heading size="sm" flex={1} color={headingColor}>
            Total Reviews by Editor
          </Heading>
          <IconButton
            aria-label="Toggle totals"
            icon={showTotals ? <ChevronUpIcon /> : <ChevronDownIcon />}
            size="sm"
            variant="ghost"
          />
        </Flex>
        <Collapse in={showTotals} animateOpacity>
          <Box p={4} bg={useColorModeValue('blue.50', 'gray.700')} borderRadius="md" mt={2}>
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
        </Collapse>
      </Box>

      {/* Stacked Bar Chart */}
      {loading ? (
        <Flex justify="center" align="center" height="400px">
          <Spinner size="xl" />
        </Flex>
      ) : (
        <Box height="500px">
          <Column {...stackedBarConfig} />
        </Box>
      )}
    </Box>
  );
};

export default ActiveEditorsChart;
