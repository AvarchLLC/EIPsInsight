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

const Column = dynamic(() => import('@ant-design/plots').then((mod) => mod.Column), {
  ssr: false,
  loading: () => (
    <Flex justify="center" align="center" height="350px">
      <Spinner size="xl" />
    </Flex>
  ),
});

interface EditorReviewVelocityProps {
  data: any;
  timePeriod: string;
}

const EditorReviewVelocity: React.FC<EditorReviewVelocityProps> = ({
  data,
  timePeriod,
}) => {
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const headerColor = useColorModeValue('#2b6cb0', '#4FD1FF');

  const velocityData = data?.velocityData || [];

  const config = useMemo(() => ({
    data: velocityData,
    xField: 'editor',
    yField: 'velocity',
    seriesField: 'period',
    isGroup: true,
    columnStyle: {
      radius: [4, 4, 0, 0],
    },
    color: ['#5B8FF9', '#5AD8A6', '#F6BD16'],
    label: {
      position: 'top' as const,
      style: {
        fill: '#000000',
        opacity: 0.6,
        fontSize: 10,
      },
    },
    xAxis: {
      label: {
        autoRotate: false,
        autoHide: true,
      },
    },
    yAxis: {
      title: {
        text: 'Reviews per Day',
        style: { fontSize: 13, fontWeight: 'bold' as const },
      },
    },
    legend: {
      position: 'top-right' as const,
    },
  }), [velocityData]);

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
          Review Velocity Comparison
        </Heading>
        <Text fontSize="sm" color="gray.500" mt={1}>
          Average reviews per day across different time periods
        </Text>
      </Box>
      <Box height="350px">
        <Column {...config} />
      </Box>
    </Box>
  );
};

export default EditorReviewVelocity;
