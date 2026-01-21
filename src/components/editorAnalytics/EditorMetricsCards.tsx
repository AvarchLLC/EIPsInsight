import React from 'react';
import {
  Box,
  Grid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  useColorModeValue,
  Flex,
  Icon,
} from '@chakra-ui/react';
import { FiUsers, FiCheckCircle, FiClock, FiTrendingUp } from 'react-icons/fi';

interface EditorMetricsCardsProps {
  data: any;
}

const EditorMetricsCards: React.FC<EditorMetricsCardsProps> = ({ data }) => {
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const iconBg = useColorModeValue('blue.50', 'blue.900');
  const iconColor = useColorModeValue('#2b6cb0', '#4FD1FF');

  const metrics = [
    {
      label: 'Total Editors/Reviewers',
      value: data?.totalEditors || 0,
      change: data?.editorGrowth || 0,
      icon: FiUsers,
      color: 'blue',
    },
    {
      label: 'Total Reviews',
      value: data?.totalReviews || 0,
      change: data?.reviewGrowth || 0,
      icon: FiCheckCircle,
      color: 'green',
    },
    {
      label: 'Avg Response Time',
      value: data?.avgResponseTime || '0h',
      change: data?.responseTimeChange || 0,
      icon: FiClock,
      color: 'orange',
      isTime: true,
    },
    {
      label: 'Activity Velocity',
      value: data?.activityVelocity || 0,
      change: data?.velocityChange || 0,
      icon: FiTrendingUp,
      color: 'purple',
      suffix: '/day',
    },
  ];

  return (
    <Grid
      templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }}
      gap={4}
      mb={6}
    >
      {metrics.map((metric, index) => (
        <Box
          key={index}
          bg={cardBg}
          p={{ base: 4, md: 5 }}
          borderRadius="lg"
          borderWidth="1px"
          borderColor={borderColor}
          transition="all 0.2s"
          _hover={{ transform: 'translateY(-2px)' }}
        >
          <Flex justify="space-between" align="flex-start" mb={3}>
            <Stat>
              <StatLabel fontSize="sm" color="gray.500">
                {metric.label}
              </StatLabel>
              <StatNumber fontSize="2xl" fontWeight="bold" color={iconColor}>
                {metric.value}{metric.suffix || ''}
              </StatNumber>
              {metric.change !== 0 && (
                <StatHelpText mb={0}>
                  <StatArrow type={metric.change > 0 ? 'increase' : 'decrease'} />
                  {Math.abs(metric.change)}%
                </StatHelpText>
              )}
            </Stat>
            <Flex
              bg={iconBg}
              p={3}
              borderRadius="lg"
              align="center"
              justify="center"
            >
              <Icon as={metric.icon} boxSize={6} color={iconColor} />
            </Flex>
          </Flex>
        </Box>
      ))}
    </Grid>
  );
};

export default EditorMetricsCards;
