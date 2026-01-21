import React, { useState } from 'react';
import {
  Box,
  Grid,
  Heading,
  Text,
  useColorModeValue,
  Avatar,
  Badge,
  Flex,
  VStack,
  HStack,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  Tooltip,
} from '@chakra-ui/react';
import { FiDownload, FiAward } from 'react-icons/fi';
import { CSVLink } from 'react-csv';
import axios from 'axios';

interface EditorLeaderboardProps {
  data: any;
  timePeriod: string;
  repository: string;
}

const EditorLeaderboard: React.FC<EditorLeaderboardProps> = ({
  data,
  timePeriod,
  repository,
}) => {
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const headerColor = useColorModeValue('#2b6cb0', '#4FD1FF');
  const [csvData, setCsvData] = useState([]);
  const [loading, setLoading] = useState(false);

  const editors = data?.editors || [];
  const reviewers = data?.reviewers || [];

  const handleDownload = async (isReviewer: boolean) => {
    try {
      setLoading(true);
      const dataToExport = isReviewer ? reviewers : editors;
      const csvFormated = dataToExport.map((person: any, index: number) => ({
        Rank: index + 1,
        Name: person.name,
        'Total Reviews': person.totalReviews,
        'EIPs': person.eips || 0,
        'ERCs': person.ercs || 0,
        'RIPs': person.rips || 0,
        'Avg Response Time (hours)': person.avgResponseTime,
        'Approval Rate (%)': person.approvalRate,
        'Last Activity': person.lastActivity,
      }));
      setCsvData(csvFormated as any);
      await axios.post('/api/DownloadCounter');
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderLeaderboardCard = (person: any, index: number, isReviewer: boolean) => {
    const rankColors = ['yellow.400', 'gray.300', 'orange.400'];
    const rankColor = index < 3 ? rankColors[index] : 'blue.400';

    return (
      <Box
        key={person.name}
        bg={cardBg}
        p={4}
        borderRadius="lg"
        borderWidth="1px"
        borderColor={borderColor}
        transition="all 0.2s"
        _hover={{ transform: 'translateY(-2px)', shadow: 'md' }}
      >
        <Flex align="center" gap={4}>
          <Badge
            fontSize="xl"
            colorScheme={index < 3 ? (index === 0 ? 'yellow' : index === 1 ? 'gray' : 'orange') : 'blue'}
            borderRadius="full"
            px={3}
            py={1}
          >
            #{index + 1}
          </Badge>
          <Avatar
            size="md"
            name={person.name}
            src={`https://github.com/${person.name}.png?size=100`}
          />
          <VStack align="start" spacing={0} flex={1}>
            <Text fontWeight="bold" fontSize="lg">
              {person.name}
            </Text>
            <Text fontSize="sm" color="gray.500">
              {person.totalReviews} reviews
            </Text>
          </VStack>
          <VStack align="end" spacing={1}>
            <Badge colorScheme="green">{person.approvalRate}% approval</Badge>
            <Text fontSize="xs" color="gray.500">
              {person.avgResponseTime}h avg response
            </Text>
          </VStack>
        </Flex>
      </Box>
    );
  };

  return (
    <Grid templateColumns={{ base: '1fr', lg: 'repeat(2, 1fr)' }} gap={6}>
      {/* Editors Leaderboard */}
      <Box>
        <Flex justify="space-between" align="center" mb={4}>
          <Heading size="lg" fontWeight="bold" color={headerColor}>
            Top Editors
          </Heading>
          <CSVLink
            data={csvData}
            filename={`editors-leaderboard-${timePeriod}.csv`}
            onClick={() => handleDownload(false)}
          >
            <Button
              size="sm"
              leftIcon={<FiDownload />}
              colorScheme="blue"
              isLoading={loading}
            >
              CSV
            </Button>
          </CSVLink>
        </Flex>
        <VStack spacing={3} align="stretch">
          {editors.slice(0, 10).map((editor: any, index: number) =>
            renderLeaderboardCard(editor, index, false)
          )}
        </VStack>
      </Box>

      {/* Reviewers Leaderboard */}
      <Box>
        <Flex justify="space-between" align="center" mb={4}>
          <Heading size="lg" fontWeight="bold" color={headerColor}>
            Top Reviewers
          </Heading>
          <CSVLink
            data={csvData}
            filename={`reviewers-leaderboard-${timePeriod}.csv`}
            onClick={() => handleDownload(true)}
          >
            <Button
              size="sm"
              leftIcon={<FiDownload />}
              colorScheme="blue"
              isLoading={loading}
            >
              CSV
            </Button>
          </CSVLink>
        </Flex>
        <VStack spacing={3} align="stretch">
          {reviewers.slice(0, 10).map((reviewer: any, index: number) =>
            renderLeaderboardCard(reviewer, index, true)
          )}
        </VStack>
      </Box>
    </Grid>
  );
};

export default EditorLeaderboard;
