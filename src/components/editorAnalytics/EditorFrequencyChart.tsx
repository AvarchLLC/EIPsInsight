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

const Line = dynamic(() => import('@ant-design/plots').then((mod) => mod.Line), {
  ssr: false,
  loading: () => (
    <Flex justify="center" align="center" height="400px">
      <Spinner size="xl" />
    </Flex>
  ),
});

interface EditorFrequencyChartProps {
  data: any;
  timePeriod: string;
}

const EditorFrequencyChart: React.FC<EditorFrequencyChartProps> = ({
  data,
  timePeriod,
}) => {
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const headerColor = useColorModeValue('#2b6cb0', '#4FD1FF');

  const frequencyData = data?.frequencyData || [];

  const config = useMemo(() => ({
    data: frequencyData,
    xField: 'date',
    yField: 'reviews',
    seriesField: 'editor',
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
        text: 'Date',
        style: { fontSize: 14, fontWeight: 'bold' as const },
      },
    },
    yAxis: {
      title: {
        text: 'Number of Reviews',
        style: { fontSize: 14, fontWeight: 'bold' as const },
      },
    },
    legend: {
      position: 'top-right' as const,
    },
    tooltip: {
      shared: true,
      showCrosshairs: true,
    },
  }), [frequencyData]);

  const csvData = frequencyData.map((item: any) => ({
    Date: item.date,
    Editor: item.editor,
    Reviews: item.reviews,
    'Avg Response Time (hours)': item.avgResponseTime,
  }));

  return (
    <Box
      bg={cardBg}
      p={{ base: 4, md: 5 }}
      borderRadius="lg"
      borderWidth="1px"
      borderColor={borderColor}
    >
      <Flex justify="space-between" align="center" mb={4}>
        <Box>
          <Heading size="lg" fontWeight="bold" color={headerColor}>
            Review Frequency Over Time
          </Heading>
          <Text fontSize="sm" color="gray.500" mt={1}>
            Track review activity patterns and trends
          </Text>
        </Box>
        <CSVLink data={csvData} filename={`review-frequency-${timePeriod}.csv`}>
          <Button size="sm" leftIcon={<FiDownload />} colorScheme="blue">
            Export
          </Button>
        </CSVLink>
      </Flex>
      <Box height="400px">
        <Line {...config} />
      </Box>
    </Box>
  );
};

export default EditorFrequencyChart;
