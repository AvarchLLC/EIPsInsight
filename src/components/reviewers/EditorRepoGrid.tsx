import React, { useState, useMemo } from 'react';
import {
  Box,
  Button,
  Flex,
  Grid,
  Heading,
  Text,
  useColorModeValue,
  Avatar,
  Badge,
  HStack,
  VStack,
  Progress,
  ButtonGroup,
  IconButton,
  Tooltip,
  Spinner,
} from '@chakra-ui/react';
import { BsListUl, BsGraphUp } from 'react-icons/bs';
import dynamic from 'next/dynamic';

const Line = dynamic(() => import('@ant-design/plots').then((mod) => mod.Line), {
  ssr: false,
  loading: () => (
    <Flex justify="center" align="center" height="400px">
      <Spinner size="xl" />
    </Flex>
  ),
});

interface EditorData {
  reviewer: string;
  eips: number;
  ercs: number;
  rips: number;
  total: number;
  timeSeriesData?: Array<{
    monthYear: string;
    repo: string;
    count: number;
  }>;
}

interface EditorRepoGridProps {
  editorsData: EditorData[];
  reviewersData: EditorData[];
}

const EditorRepoGrid: React.FC<EditorRepoGridProps> = ({
  editorsData,
  reviewersData,
}) => {
  const [showAllEditors, setShowAllEditors] = useState(false);
  const [showAllReviewers, setShowAllReviewers] = useState(false);
  const [editorsViewMode, setEditorsViewMode] = useState<'cards' | 'chart'>('cards');
  const [reviewersViewMode, setReviewersViewMode] = useState<'cards' | 'chart'>('cards');
  
  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const headingColor = useColorModeValue('blue.600', 'blue.300');
  const cardBg = useColorModeValue('gray.50', 'gray.700');

  const displayedEditors = showAllEditors ? editorsData : editorsData.slice(0, 3);
  const displayedReviewers = showAllReviewers ? reviewersData : reviewersData.slice(0, 3);

  // Prepare line chart data for editors
  const editorsLineData = useMemo(() => {
    const data: any[] = [];
    editorsData.forEach(editor => {
      data.push({ reviewer: editor.reviewer, repo: 'EIPs', value: editor.eips });
      data.push({ reviewer: editor.reviewer, repo: 'ERCs', value: editor.ercs });
      data.push({ reviewer: editor.reviewer, repo: 'RIPs', value: editor.rips });
    });
    return data;
  }, [editorsData]);

  // Prepare line chart data for reviewers
  const reviewersLineData = useMemo(() => {
    const data: any[] = [];
    reviewersData.forEach(reviewer => {
      data.push({ reviewer: reviewer.reviewer, repo: 'EIPs', value: reviewer.eips });
      data.push({ reviewer: reviewer.reviewer, repo: 'ERCs', value: reviewer.ercs });
      data.push({ reviewer: reviewer.reviewer, repo: 'RIPs', value: reviewer.rips });
    });
    return data;
  }, [reviewersData]);

  const lineChartConfig = (data: any[]) => ({
    data,
    xField: 'reviewer',
    yField: 'value',
    seriesField: 'repo',
    color: ['#1890FF', '#52C41A', '#FF4D4F'],
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
        style: { fontSize: 11 },
      },
    },
    yAxis: {
      title: {
        text: 'Number of Reviews',
        style: { fontSize: 13, fontWeight: 'bold' as const },
      },
    },
    legend: {
      position: 'top-right' as const,
    },
    smooth: true,
    animation: false,
  });

  const renderCard = (item: EditorData) => {
    const maxValue = item.total;
    
    // Prepare line chart config for this card
    const cardLineConfig = item.timeSeriesData ? {
      data: item.timeSeriesData,
      xField: 'monthYear',
      yField: 'count',
      seriesField: 'repo',
      color: ['#1890FF', '#52C41A', '#FF4D4F'],
      lineStyle: {
        lineWidth: 2,
      },
      point: {
        size: 3,
        shape: 'circle',
      },
      xAxis: {
        label: {
          autoRotate: true,
          autoHide: true,
          style: { fontSize: 9 },
        },
      },
      yAxis: {
        label: {
          style: { fontSize: 10 },
        },
      },
      legend: {
        position: 'top' as const,
        itemName: { 
          style: { fontSize: 10 } 
        },
      },
      smooth: true,
      animation: false,
      height: 150,
    } : null;
    
    return (
      <Box
        key={item.reviewer}
        bg={bg}
        borderRadius="lg"
        borderWidth="1px"
        borderColor={borderColor}
        p={5}
        boxShadow="sm"
        transition="all 0.2s"
        _hover={{ boxShadow: 'lg', transform: 'translateY(-2px)' }}
      >
        <Flex align="center" mb={4}>
          <Avatar
            size="md"
            name={item.reviewer}
            src={`https://github.com/${item.reviewer}.png?size=40`}
            mr={3}
          />
          <VStack align="start" spacing={0} flex={1}>
            <Text fontWeight="bold" fontSize="lg">
              {item.reviewer}
            </Text>
            <Badge colorScheme="blue" fontSize="sm">
              {item.total} total reviews
            </Badge>
          </VStack>
        </Flex>

        {/* Time Series Line Chart */}
        {cardLineConfig && (
          <Box mb={4} p={2} bg={cardBg} borderRadius="md">
            <Text fontSize="xs" fontWeight="semibold" mb={2} color="gray.600">
              Monthly Review Trend
            </Text>
            <Line {...cardLineConfig} />
          </Box>
        )}

        <VStack spacing={3} align="stretch">
          {/* EIPs */}
          <Box>
            <Flex justify="space-between" mb={1}>
              <HStack>
                <Badge colorScheme="blue" fontSize="xs">EIPs</Badge>
                <Text fontSize="sm" fontWeight="medium">{item.eips}</Text>
              </HStack>
              <Text fontSize="xs" color="gray.500">
                {maxValue > 0 ? Math.round((item.eips / maxValue) * 100) : 0}%
              </Text>
            </Flex>
            <Progress 
              value={maxValue > 0 ? (item.eips / maxValue) * 100 : 0} 
              size="sm" 
              colorScheme="blue" 
              borderRadius="full"
            />
          </Box>

          {/* ERCs */}
          <Box>
            <Flex justify="space-between" mb={1}>
              <HStack>
                <Badge colorScheme="green" fontSize="xs">ERCs</Badge>
                <Text fontSize="sm" fontWeight="medium">{item.ercs}</Text>
              </HStack>
              <Text fontSize="xs" color="gray.500">
                {maxValue > 0 ? Math.round((item.ercs / maxValue) * 100) : 0}%
              </Text>
            </Flex>
            <Progress 
              value={maxValue > 0 ? (item.ercs / maxValue) * 100 : 0} 
              size="sm" 
              colorScheme="green" 
              borderRadius="full"
            />
          </Box>

          {/* RIPs */}
          <Box>
            <Flex justify="space-between" mb={1}>
              <HStack>
                <Badge colorScheme="red" fontSize="xs">RIPs</Badge>
                <Text fontSize="sm" fontWeight="medium">{item.rips}</Text>
              </HStack>
              <Text fontSize="xs" color="gray.500">
                {maxValue > 0 ? Math.round((item.rips / maxValue) * 100) : 0}%
              </Text>
            </Flex>
            <Progress 
              value={maxValue > 0 ? (item.rips / maxValue) * 100 : 0} 
              size="sm" 
              colorScheme="red" 
              borderRadius="full"
            />
          </Box>
        </VStack>
      </Box>
    );
  };

  return (
    <Box>
      {/* Editors Section */}
      <Box mb={8}>
        <Flex justify="space-between" align="center" mb={4} flexWrap="wrap" gap={2}>
          <Heading
            as="h3"
            size="lg"
            fontWeight="bold"
            color={headingColor}
          >
            Editors Repository Distribution
          </Heading>
          <ButtonGroup size="sm" isAttached variant="outline">
            <Tooltip label="Card View">
              <IconButton
                aria-label="Card view"
                icon={<BsListUl />}
                onClick={() => setEditorsViewMode('cards')}
                colorScheme={editorsViewMode === 'cards' ? 'blue' : 'gray'}
                variant={editorsViewMode === 'cards' ? 'solid' : 'outline'}
              />
            </Tooltip>
            <Tooltip label="Line Chart View">
              <IconButton
                aria-label="Chart view"
                icon={<BsGraphUp />}
                onClick={() => setEditorsViewMode('chart')}
                colorScheme={editorsViewMode === 'chart' ? 'blue' : 'gray'}
                variant={editorsViewMode === 'chart' ? 'solid' : 'outline'}
              />
            </Tooltip>
          </ButtonGroup>
        </Flex>

        {editorsViewMode === 'cards' ? (
          <>
            <Grid
              templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }}
              gap={4}
              mb={4}
            >
              {displayedEditors.map(renderCard)}
            </Grid>
            {editorsData.length > 3 && (
              <Flex justify="center">
                <Button
                  colorScheme="blue"
                  variant="outline"
                  onClick={() => setShowAllEditors(!showAllEditors)}
                  size="md"
                >
                  {showAllEditors ? 'Show Less' : `See More (${editorsData.length - 3} more)`}
                </Button>
              </Flex>
            )}
          </>
        ) : (
          <Box 
            bg={bg} 
            p={6} 
            borderRadius="lg" 
            borderWidth="1px" 
            borderColor={borderColor}
            boxShadow="sm"
          >
            <Line {...lineChartConfig(editorsLineData)} />
          </Box>
        )}
      </Box>

      {/* Reviewers Section */}
      <Box>
        <Flex justify="space-between" align="center" mb={4} flexWrap="wrap" gap={2}>
          <Heading
            as="h3"
            size="lg"
            fontWeight="bold"
            color={headingColor}
          >
            Reviewers Repository Distribution
          </Heading>
          <ButtonGroup size="sm" isAttached variant="outline">
            <Tooltip label="Card View">
              <IconButton
                aria-label="Card view"
                icon={<BsListUl />}
                onClick={() => setReviewersViewMode('cards')}
                colorScheme={reviewersViewMode === 'cards' ? 'blue' : 'gray'}
                variant={reviewersViewMode === 'cards' ? 'solid' : 'outline'}
              />
            </Tooltip>
            <Tooltip label="Line Chart View">
              <IconButton
                aria-label="Chart view"
                icon={<BsGraphUp />}
                onClick={() => setReviewersViewMode('chart')}
                colorScheme={reviewersViewMode === 'chart' ? 'blue' : 'gray'}
                variant={reviewersViewMode === 'chart' ? 'solid' : 'outline'}
              />
            </Tooltip>
          </ButtonGroup>
        </Flex>

        {reviewersViewMode === 'cards' ? (
          <>
            <Grid
              templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }}
              gap={4}
              mb={4}
            >
              {displayedReviewers.map(renderCard)}
            </Grid>
            {reviewersData.length > 3 && (
              <Flex justify="center">
                <Button
                  colorScheme="blue"
                  variant="outline"
                  onClick={() => setShowAllReviewers(!showAllReviewers)}
                  size="md"
                >
                  {reviewersViewMode ? 'Show Less' : `See More (${reviewersData.length - 3} more)`}
                </Button>
              </Flex>
            )}
          </>
        ) : (
          <Box 
            bg={bg} 
            p={6} 
            borderRadius="lg" 
            borderWidth="1px" 
            borderColor={borderColor}
            boxShadow="sm"
          >
            <Line {...lineChartConfig(reviewersLineData)} />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default EditorRepoGrid;
