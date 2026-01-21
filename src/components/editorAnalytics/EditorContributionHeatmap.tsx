import React, { useMemo } from 'react';
import {
  Box,
  Heading,
  Text,
  useColorModeValue,
  Flex,
  Spinner,
} from '@chakra-ui/react';
import dynamic from 'next/dynamic';

const Heatmap = dynamic(() => import('@ant-design/plots').then((mod) => mod.Heatmap), {
  ssr: false,
  loading: () => (
    <Flex justify="center" align="center" height="400px">
      <Spinner size="xl" />
    </Flex>
  ),
});

interface EditorContributionHeatmapProps {
  data: any;
}

const EditorContributionHeatmap: React.FC<EditorContributionHeatmapProps> = ({ data }) => {
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const headerColor = useColorModeValue('#2b6cb0', '#4FD1FF');

  const heatmapData = data?.heatmapData || [];

  const config = useMemo(() => ({
    data: heatmapData,
    xField: 'dayOfWeek',
    yField: 'editor',
    colorField: 'reviews',
    color: ['#BAE7FF', '#1890FF', '#0050B3'],
    meta: {
      dayOfWeek: {
        type: 'cat' as const,
        values: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      },
    },
    label: {
      style: {
        fill: '#fff',
        shadowBlur: 2,
        shadowColor: 'rgba(0, 0, 0, .45)',
      },
    },
    xAxis: {
      title: {
        text: 'Day of Week',
        style: { fontSize: 13, fontWeight: 'bold' as const },
      },
    },
    yAxis: {
      title: {
        text: 'Editor/Reviewer',
        style: { fontSize: 13, fontWeight: 'bold' as const },
      },
    },
  }), [heatmapData]);

  return (
    <Box
      bg={cardBg}
      p={{ base: 4, md: 5 }}
      borderRadius="lg"
      borderWidth="1px"
      borderColor={borderColor}
    >
      <Box mb={4}>
        <Heading size="lg" fontWeight="bold" color={headerColor}>
          Activity Heatmap
        </Heading>
        <Text fontSize="sm" color="gray.500" mt={1}>
          Review activity patterns by day of week
        </Text>
      </Box>
      <Box height="400px">
        <Heatmap {...config} />
      </Box>
    </Box>
  );
};

export default EditorContributionHeatmap;
