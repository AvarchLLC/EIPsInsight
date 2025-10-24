import React, { useMemo } from 'react';
import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spinner,
  useColorModeValue,
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { FiFilter } from 'react-icons/fi';
import { AiOutlineClose } from 'react-icons/ai';
import dynamic from 'next/dynamic';
import CopyLink from '@/components/CopyLink';

const Scatter = dynamic(() => import('@ant-design/plots').then((mod) => mod.Scatter), {
  ssr: false,
  loading: () => (
    <Flex justify="center" align="center" height="400px">
      <Spinner size="xl" />
    </Flex>
  ),
});

interface ReviewActivityTimelineProps {
  activityData: any[];
  loading: boolean;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  selectedStartYear: string;
  selectedStartMonth: string;
  selectedEndYear: string;
  selectedEndMonth: string;
  setSelectedStartYear: (year: string) => void;
  setSelectedStartMonth: (month: string) => void;
  setSelectedEndYear: (year: string) => void;
  setSelectedEndMonth: (month: string) => void;
  reviewerColors: { [key: string]: string };
}

const ReviewActivityTimeline: React.FC<ReviewActivityTimelineProps> = ({
  activityData,
  loading,
  showFilters,
  setShowFilters,
  selectedStartYear,
  selectedStartMonth,
  selectedEndYear,
  selectedEndMonth,
  setSelectedStartYear,
  setSelectedStartMonth,
  setSelectedEndYear,
  setSelectedEndMonth,
  reviewerColors,
}) => {
  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const headingColor = useColorModeValue('blue.600', 'blue.300');

  const months = [
    { name: 'Jan', value: '01' },
    { name: 'Feb', value: '02' },
    { name: 'Mar', value: '03' },
    { name: 'Apr', value: '04' },
    { name: 'May', value: '05' },
    { name: 'Jun', value: '06' },
    { name: 'Jul', value: '07' },
    { name: 'Aug', value: '08' },
    { name: 'Sep', value: '09' },
    { name: 'Oct', value: '10' },
    { name: 'Nov', value: '11' },
    { name: 'Dec', value: '12' },
  ];

  const years = Array.from({ length: 2025 - 2015 + 1 }, (_, i) => (2025 - i).toString());

  // Memoize the scatter config to prevent unnecessary re-renders
  const scatterConfig = useMemo(() => ({
    data: activityData,
    xField: 'timeIn24Hour',
    yField: 'reviewer',
    colorField: 'reviewer',
    size: 6,
    shape: 'circle',
    pointStyle: ({ reviewer }: any) => ({
      fill: reviewerColors[reviewer] || '#000',
      fillOpacity: 0.7,
      stroke: '#fff',
      lineWidth: 1,
    }),
    xAxis: {
      title: {
        text: 'Time of Day (24-hour format)',
        style: { fontSize: 14, fontWeight: 'bold' as const},
      },
      tickCount: 12,
      label: {
        formatter: (val: string) => {
          const hour = parseInt(val.split(':')[0]);
          return hour % 2 === 0 ? `${hour}:00` : '';
        },
      },
    },
    yAxis: {
      title: {
        text: 'Contributor/Editor',
        style: { fontSize: 14, fontWeight: 'bold' as const },
      },
    },
    tooltip: {
      showTitle: false,
      formatter: (datum: any) => ({
        name: datum.reviewer,
        value: `Review at ${datum.timeIn24Hour}`,
      }),
    },
    legend: {
      position: 'top' as const,
      itemName: { style: { fontSize: 11 } },
    },
    animation: false, // Disable animation for better performance
  }), [activityData, reviewerColors]);

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
      <Flex justifyContent="space-between" alignItems="center" mb={4} flexWrap="wrap" gap={4}>
        <Heading as="h3" size="lg" fontWeight="bold" color={headingColor}>
          Review Activity Timeline (Time of Day Analysis)
          <CopyLink link="https://eipsinsight.com/Reviewers#ActivityTimeline" />
        </Heading>
        <Button
          colorScheme="blue"
          onClick={() => setShowFilters(!showFilters)}
          leftIcon={showFilters ? <AiOutlineClose /> : <FiFilter />}
          size="md"
        >
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </Button>
      </Flex>

      {showFilters && (
        <Box bg={useColorModeValue('blue.50', 'gray.700')} borderRadius="md" p={4} mb={4}>
          <Flex flexDirection={{ base: 'column', md: 'row' }} gap={4}>
            {/* Start Date */}
            <Box flex={1}>
              <Heading size="sm" mb={2} color="black">
                Start Date
              </Heading>
              <HStack>
                <Menu>
                  <MenuButton as={Button} rightIcon={<ChevronDownIcon />} colorScheme="blue" size="sm">
                    {selectedStartYear || 'Year'}
                  </MenuButton>
                  <MenuList maxH="200px" overflowY="auto">
                    {years.map((year) => (
                      <MenuItem key={year} onClick={() => setSelectedStartYear(year)}>
                        {year}
                      </MenuItem>
                    ))}
                  </MenuList>
                </Menu>
                <Menu>
                  <MenuButton as={Button} rightIcon={<ChevronDownIcon />} colorScheme="blue" size="sm">
                    {months.find((m) => m.value === selectedStartMonth)?.name || 'Month'}
                  </MenuButton>
                  <MenuList maxH="200px" overflowY="auto">
                    {months.map((month) => (
                      <MenuItem key={month.value} onClick={() => setSelectedStartMonth(month.value)}>
                        {month.name}
                      </MenuItem>
                    ))}
                  </MenuList>
                </Menu>
              </HStack>
            </Box>

            {/* End Date */}
            <Box flex={1}>
              <Heading size="sm" mb={2} color="black">
                End Date
              </Heading>
              <HStack>
                <Menu>
                  <MenuButton as={Button} rightIcon={<ChevronDownIcon />} colorScheme="blue" size="sm">
                    {selectedEndYear || 'Year'}
                  </MenuButton>
                  <MenuList maxH="200px" overflowY="auto">
                    {years.map((year) => (
                      <MenuItem key={year} onClick={() => setSelectedEndYear(year)}>
                        {year}
                      </MenuItem>
                    ))}
                  </MenuList>
                </Menu>
                <Menu>
                  <MenuButton as={Button} rightIcon={<ChevronDownIcon />} colorScheme="blue" size="sm">
                    {months.find((m) => m.value === selectedEndMonth)?.name || 'Month'}
                  </MenuButton>
                  <MenuList maxH="200px" overflowY="auto">
                    {months.map((month) => (
                      <MenuItem key={month.value} onClick={() => setSelectedEndMonth(month.value)}>
                        {month.name}
                      </MenuItem>
                    ))}
                  </MenuList>
                </Menu>
              </HStack>
            </Box>
          </Flex>
        </Box>
      )}

      {loading ? (
        <Flex justify="center" align="center" height="400px">
          <Spinner size="xl" />
        </Flex>
      ) : (
        <Box height="500px">
          <Scatter {...scatterConfig} />
        </Box>
      )}
    </Box>
  );
};

export default ReviewActivityTimeline;
