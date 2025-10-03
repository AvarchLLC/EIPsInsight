import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Badge,
  Button,
  useColorModeValue,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  SimpleGrid,
  Card,
  CardHeader,
  CardBody,
  IconButton,
  Tooltip,
  Flex,
  Select,
  Input
} from '@chakra-ui/react';
import { 
  FaThumbsUp, 
  FaThumbsDown, 
  FaUsers, 
  FaChartLine,
  FaRedo,
  FaDownload,
  FaFilter,
  FaCalendarAlt
} from 'react-icons/fa';
import AllLayout from '@/components/Layout';

interface Feedback {
  _id: string;
  type: 'like' | 'dislike';
  page: string;
  comment?: string;
  userAgent: string;
  ip: string;
  createdAt: string;
}

interface FeedbackStats {
  total: number;
  likes: number;
  dislikes: number;
  likePercentage: number;
}

interface FeedbackResponse {
  feedbacks: Feedback[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    limit: number;
  };
  stats: FeedbackStats;
}

const FeedbackDashboard = () => {
  const [data, setData] = useState<FeedbackResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterType, setFilterType] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('');

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const fetchFeedback = async (page = 1) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/Feedback/getAllFeedback?page=${page}&limit=50`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch feedback data');
      }
      
      const result = await response.json();
      setData(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedback(currentPage);
  }, [currentPage]);

  const handleRefresh = () => {
    fetchFeedback(currentPage);
  };

  const exportToCSV = () => {
    if (!data?.feedbacks) return;
    
    const csvContent = [
      'Type,Page,Comment,User Agent,IP,Created At',
      ...data.feedbacks.map(f => 
        `${f.type},"${f.page || 'N/A'}","${f.comment || 'N/A'}","${f.userAgent}","${f.ip}","${f.createdAt}"`
      )
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `feedback-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getPageName = (url: string) => {
    if (!url || url === 'Unknown') return 'Unknown';
    try {
      const pathname = new URL(url).pathname;
      return pathname.split('/').pop() || pathname;
    } catch {
      return url.substring(0, 50) + (url.length > 50 ? '...' : '');
    }
  };

  if (loading && !data) {
    return (
      <AllLayout>
        <Container maxW="container.xl" py={8}>
          <VStack spacing={8}>
            <Heading>Feedback Dashboard</Heading>
            <Spinner size="xl" />
          </VStack>
        </Container>
      </AllLayout>
    );
  }

  if (error) {
    return (
      <AllLayout>
        <Container maxW="container.xl" py={8}>
          <Alert status="error">
            <AlertIcon />
            <AlertTitle>Error loading feedback data:</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </Container>
      </AllLayout>
    );
  }

  return (
    <AllLayout>
      <Container maxW="container.xl" py={8}>
        <VStack spacing={6}>
          {/* Header */}
          <Flex justify="space-between" align="center" width="100%">
            <VStack align="start" spacing={1}>
              <Heading size="lg">📊 Feedback Dashboard</Heading>
              <Text color="gray.600">Monitor user feedback and engagement</Text>
            </VStack>
            <HStack>
              <Tooltip label="Export to CSV">
                <IconButton
                  aria-label="Export"
                  icon={<FaDownload />}
                  onClick={exportToCSV}
                  colorScheme="blue"
                  variant="outline"
                />
              </Tooltip>
              <Tooltip label="Test Discord Webhook">
                <Button
                  leftIcon={<FaCalendarAlt />}
                  onClick={async () => {
                    try {
                      const res = await fetch('/api/test-discord-webhook', { method: 'POST' });
                      const data = await res.json();
                      alert(res.ok ? '✅ Discord webhook test successful!' : `❌ Test failed: ${data.message}`);
                    } catch (err) {
                      alert('❌ Test failed: Network error');
                    }
                  }}
                  colorScheme="purple"
                  size="sm"
                  variant="outline"
                >
                  Test Discord
                </Button>
              </Tooltip>
              <Tooltip label="Refresh Data">
                <IconButton
                  aria-label="Refresh"
                  icon={<FaRedo />}
                  onClick={handleRefresh}
                  isLoading={loading}
                  colorScheme="green"
                />
              </Tooltip>
            </HStack>
          </Flex>

          {/* Statistics Cards */}
          {data?.stats && (
            <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4} width="100%">
              <Card>
                <CardBody>
                  <Stat>
                    <HStack>
                      <Box color="blue.500">
                        <FaUsers size={20} />
                      </Box>
                      <StatLabel>Total Feedback</StatLabel>
                    </HStack>
                    <StatNumber>{data.stats.total}</StatNumber>
                    <StatHelpText>All time</StatHelpText>
                  </Stat>
                </CardBody>
              </Card>

              <Card>
                <CardBody>
                  <Stat>
                    <HStack>
                      <Box color="green.500">
                        <FaThumbsUp size={20} />
                      </Box>
                      <StatLabel>Likes</StatLabel>
                    </HStack>
                    <StatNumber>{data.stats.likes}</StatNumber>
                    <StatHelpText>{data.stats.likePercentage}% positive</StatHelpText>
                  </Stat>
                </CardBody>
              </Card>

              <Card>
                <CardBody>
                  <Stat>
                    <HStack>
                      <Box color="red.500">
                        <FaThumbsDown size={20} />
                      </Box>
                      <StatLabel>Dislikes</StatLabel>
                    </HStack>
                    <StatNumber>{data.stats.dislikes}</StatNumber>
                    <StatHelpText>{100 - data.stats.likePercentage}% negative</StatHelpText>
                  </Stat>
                </CardBody>
              </Card>

              <Card>
                <CardBody>
                  <Stat>
                    <HStack>
                      <Box color="purple.500">
                        <FaChartLine size={20} />
                      </Box>
                      <StatLabel>Satisfaction</StatLabel>
                    </HStack>
                    <StatNumber>
                      {data.stats.likePercentage}%
                    </StatNumber>
                    <StatHelpText>
                      <Badge colorScheme={data.stats.likePercentage > 70 ? 'green' : data.stats.likePercentage > 50 ? 'yellow' : 'red'}>
                        {data.stats.likePercentage > 70 ? 'Excellent' : data.stats.likePercentage > 50 ? 'Good' : 'Needs Improvement'}
                      </Badge>
                    </StatHelpText>
                  </Stat>
                </CardBody>
              </Card>
            </SimpleGrid>
          )}

          {/* Filters */}
          <Card width="100%">
            <CardHeader>
              <Heading size="md">🔍 Filters</Heading>
            </CardHeader>
            <CardBody>
              <HStack spacing={4}>
                <Select value={filterType} onChange={(e) => setFilterType(e.target.value)} maxW="200px">
                  <option value="all">All Feedback</option>
                  <option value="like">👍 Likes Only</option>
                  <option value="dislike">👎 Dislikes Only</option>
                </Select>
                <Input
                  placeholder="Filter by date (YYYY-MM-DD)"
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  maxW="200px"
                />
              </HStack>
            </CardBody>
          </Card>

          {/* Feedback Table */}
          <Card width="100%">
            <CardHeader>
              <HStack justify="space-between">
                <Heading size="md">📝 Recent Feedback</Heading>
                <Text fontSize="sm" color="gray.500">
                  Page {data?.pagination.currentPage} of {data?.pagination.totalPages} 
                  ({data?.pagination.totalCount} total)
                </Text>
              </HStack>
            </CardHeader>
            <CardBody>
              <Box overflowX="auto">
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>Type</Th>
                      <Th>Page</Th>
                      <Th>Comment</Th>
                      <Th>User Agent</Th>
                      <Th>IP</Th>
                      <Th>Date</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {data?.feedbacks
                      .filter(f => filterType === 'all' || f.type === filterType)
                      .filter(f => !dateFilter || f.createdAt.startsWith(dateFilter))
                      .map((feedback) => (
                      <Tr key={feedback._id}>
                        <Td>
                          <Badge 
                            colorScheme={feedback.type === 'like' ? 'green' : 'red'}
                            variant="solid"
                          >
                            {feedback.type === 'like' ? '👍 Like' : '👎 Dislike'}
                          </Badge>
                        </Td>
                        <Td>
                          <Tooltip label={feedback.page}>
                            <Text fontSize="sm" noOfLines={1} maxW="200px">
                              {getPageName(feedback.page)}
                            </Text>
                          </Tooltip>
                        </Td>
                        <Td>
                          <Text fontSize="sm" noOfLines={2} maxW="150px">
                            {feedback.comment || '-'}
                          </Text>
                        </Td>
                        <Td>
                          <Tooltip label={feedback.userAgent}>
                            <Text fontSize="xs" noOfLines={1} maxW="150px">
                              {feedback.userAgent.substring(0, 30)}...
                            </Text>
                          </Tooltip>
                        </Td>
                        <Td fontSize="sm">{feedback.ip}</Td>
                        <Td fontSize="sm">{formatDate(feedback.createdAt)}</Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Box>

              {/* Pagination */}
              {data?.pagination && data.pagination.totalPages > 1 && (
                <HStack justify="center" mt={4}>
                  <Button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    size="sm"
                  >
                    Previous
                  </Button>
                  <Text fontSize="sm">
                    Page {currentPage} of {data.pagination.totalPages}
                  </Text>
                  <Button
                    onClick={() => setCurrentPage(prev => Math.min(data.pagination.totalPages, prev + 1))}
                    disabled={currentPage === data.pagination.totalPages}
                    size="sm"
                  >
                    Next
                  </Button>
                </HStack>
              )}
            </CardBody>
          </Card>
        </VStack>
      </Container>
    </AllLayout>
  );
};

export default FeedbackDashboard;