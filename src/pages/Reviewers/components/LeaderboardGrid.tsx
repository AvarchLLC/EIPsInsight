import React, { useState } from 'react';
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
} from '@chakra-ui/react';
import { CSVLink } from 'react-csv';
import CopyLink from '@/components/CopyLink';

interface LeaderboardItem {
  reviewer: string;
  count: number;
}

interface LeaderboardGridProps {
  title: string;
  data: LeaderboardItem[];
  csvData: any[];
  csvFilename: string;
  onDownloadCSV: () => void;
  loading?: boolean;
  copyLink?: string;
}

const LeaderboardGrid: React.FC<LeaderboardGridProps> = ({
  title,
  data,
  csvData,
  csvFilename,
  onDownloadCSV,
  loading = false,
  copyLink,
}) => {
  const [showAll, setShowAll] = useState(false);
  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const hoverBg = useColorModeValue('blue.50', 'blue.900');

  const displayedData = showAll ? data : data.slice(0, 1);
  const hasMore = data.length > 1;

  return (
    <Box
      bg={bg}
      borderRadius="lg"
      borderWidth="1px"
      borderColor={borderColor}
      p={6}
      boxShadow="md"
      width="100%"
    >
      <Flex justifyContent="space-between" alignItems="center" mb={4}>
        <Heading size="md" color="blue.500">
          {title}
          {copyLink && <CopyLink link={copyLink} />}
        </Heading>
        <CSVLink
          data={csvData?.length ? csvData : []}
          filename={csvFilename}
          onClick={onDownloadCSV}
        >
          <Button size="sm" colorScheme="blue" isLoading={loading}>
            Download CSV
          </Button>
        </CSVLink>
      </Flex>

      <VStack spacing={3} align="stretch">
        {displayedData.map((item, index) => (
          <Box
            key={item.reviewer}
            p={4}
            borderRadius="md"
            borderWidth="1px"
            borderColor={borderColor}
            bg={index === 0 && !showAll ? useColorModeValue('blue.50', 'blue.900') : 'transparent'}
            transition="all 0.2s"
            _hover={{ bg: hoverBg, transform: 'translateY(-2px)', boxShadow: 'md' }}
          >
            <Flex justifyContent="space-between" alignItems="center">
              <HStack spacing={4}>
                <Badge
                  fontSize="lg"
                  colorScheme={index === 0 ? 'yellow' : index === 1 ? 'gray' : 'orange'}
                  borderRadius="full"
                  px={3}
                  py={1}
                >
                  #{(showAll ? 0 : 0) + index + 1}
                </Badge>
                <Avatar
                  size="md"
                  name={item.reviewer}
                  src={`https://github.com/${item.reviewer}.png?size=40`}
                />
                <VStack align="start" spacing={0}>
                  <Text fontWeight="bold" fontSize="lg">
                    {item.reviewer}
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    GitHub Contributor
                  </Text>
                </VStack>
              </HStack>
              <VStack align="end" spacing={0}>
                <Text fontSize="2xl" fontWeight="bold" color="blue.500">
                  {item.count}
                </Text>
                <Text fontSize="sm" color="gray.500">
                  reviews
                </Text>
              </VStack>
            </Flex>
          </Box>
        ))}
      </VStack>

      {hasMore && (
        <Button
          mt={4}
          width="full"
          variant="outline"
          colorScheme="blue"
          onClick={() => setShowAll(!showAll)}
        >
          {showAll ? 'Show Less' : `View More (${data.length - 1} more)`}
        </Button>
      )}
    </Box>
  );
};

export default LeaderboardGrid;
