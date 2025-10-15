import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  Box,
  Container,
  Heading,
  Text,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Grid,
  GridItem,
  Card,
  CardHeader,
  CardBody,
  Flex,
  Badge,
  Avatar,
  VStack,
  HStack,
  Button,
  useColorModeValue,
  Spinner,
  Alert,
  AlertIcon,
  Link,
  Divider,
} from '@chakra-ui/react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
} from 'recharts';
import { ExternalLinkIcon, CalendarIcon } from '@chakra-ui/icons';
import Head from 'next/head';
import { motion } from 'framer-motion';

interface Contributor {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  total_commits: number;
  total_additions: number;
  total_deletions: number;
  weeks: Array<{
    week: string;
    additions: number;
    deletions: number;
    commits: number;
  }>;
  repository: string;
  last_updated: string;
  rank: number;
}

const MotionBox = motion(Box);

const ContributorProfilePage: React.FC = () => {
  const router = useRouter();
  const { username } = router.query;
  
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Color mode values
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.800', 'white');
  const mutedColor = useColorModeValue('gray.600', 'gray.400');
  const cardBg = useColorModeValue('white', 'gray.700');

  useEffect(() => {
    if (username) {
      fetchContributorData();
    }
  }, [username]);

  const fetchContributorData = async () => {
    try {
      setLoading(true);
      
      const response = await fetch('/api/contributors');
      if (!response.ok) {
        throw new Error('Failed to fetch contributor data');
      }
      
      const data = await response.json();
      
      // Handle both direct array and wrapped response formats
      const contributorsArray = Array.isArray(data) ? data : data.data || [];
      
      // Filter contributors for this username
      const userContributions = contributorsArray.filter((c: Contributor) => c.login === username);
      setContributors(userContributions);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minH="50vh">
        <VStack>
          <Spinner size="xl" color="blue.500" />
          <Text>Loading contributor profile...</Text>
        </VStack>
      </Box>
    );
  }

  if (error || contributors.length === 0) {
    return (
      <Container maxW="container.xl" py={8}>
        <Alert status="error" borderRadius="md">
          <AlertIcon />
          {error || `Contributor "${username}" not found`}
        </Alert>
      </Container>
    );
  }

  const primaryContributor = contributors[0];
  const totalContributions = contributors.reduce((sum, c) => ({
    commits: sum.commits + c.total_commits,
    additions: sum.additions + c.total_additions,
    deletions: sum.deletions + c.total_deletions,
  }), { commits: 0, additions: 0, deletions: 0 });

  // Prepare weekly activity data
  const allWeeks = new Map();
  contributors.forEach(contributor => {
    contributor.weeks.forEach(week => {
      const weekKey = week.week;
      if (!allWeeks.has(weekKey)) {
        allWeeks.set(weekKey, {
          week: new Date(week.week).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          commits: 0,
          additions: 0,
          deletions: 0,
        });
      }
      const existing = allWeeks.get(weekKey);
      existing.commits += week.commits;
      existing.additions += week.additions;
      existing.deletions += week.deletions;
    });
  });

  const weeklyData = Array.from(allWeeks.values())
    .sort((a, b) => new Date(a.week).getTime() - new Date(b.week).getTime())
    .slice(-26); // Last 26 weeks

  // Repository breakdown
  const repoBreakdown = contributors.map(c => ({
    repository: c.repository,
    commits: c.total_commits,
    additions: c.total_additions,
    deletions: c.total_deletions,
    rank: c.rank,
  }));

  return (
    <>
      <Head>
        <title>{username} - Contributor Profile - EIPs Insight</title>
        <meta name="description" content={`Detailed contribution statistics for ${username}`} />
      </Head>
      
      <Container maxW="container.xl" py={8}>
        <VStack spacing={8} align="stretch">
          {/* Header */}
          <MotionBox
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card bg={cardBg} borderColor={borderColor}>
              <CardBody>
                <Flex direction={{ base: 'column', md: 'row' }} align="center" gap={6}>
                  <Avatar size="2xl" src={primaryContributor.avatar_url} />
                  
                  <VStack align={{ base: 'center', md: 'start' }} spacing={4} flex="1">
                    <VStack align={{ base: 'center', md: 'start' }} spacing={2}>
                      <Heading size="xl">{username}</Heading>
                      <HStack>
                        <Badge colorScheme="blue" fontSize="md" px={3} py={1}>
                          Ethereum Contributor
                        </Badge>
                        <Link href={primaryContributor.html_url} isExternal>
                          <Button size="sm" leftIcon={<ExternalLinkIcon />} variant="outline">
                            GitHub Profile
                          </Button>
                        </Link>
                      </HStack>
                    </VStack>
                    
                    <Grid templateColumns="repeat(auto-fit, minmax(150px, 1fr))" gap={4} w="100%">
                      <Stat textAlign={{ base: 'center', md: 'left' }}>
                        <StatLabel>Total Commits</StatLabel>
                        <StatNumber color="blue.500">{totalContributions.commits}</StatNumber>
                      </Stat>
                      <Stat textAlign={{ base: 'center', md: 'left' }}>
                        <StatLabel>Total Additions</StatLabel>
                        <StatNumber color="green.500">+{totalContributions.additions.toLocaleString()}</StatNumber>
                      </Stat>
                      <Stat textAlign={{ base: 'center', md: 'left' }}>
                        <StatLabel>Total Deletions</StatLabel>
                        <StatNumber color="red.500">-{totalContributions.deletions.toLocaleString()}</StatNumber>
                      </Stat>
                      <Stat textAlign={{ base: 'center', md: 'left' }}>
                        <StatLabel>Repositories</StatLabel>
                        <StatNumber>{contributors.length}</StatNumber>
                      </Stat>
                    </Grid>
                  </VStack>
                </Flex>
              </CardBody>
            </Card>
          </MotionBox>

          {/* Repository Breakdown */}
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card bg={cardBg} borderColor={borderColor}>
              <CardHeader>
                <Heading size="md">Repository Contributions</Heading>
                <Text color={mutedColor} fontSize="sm">
                  Breakdown by repository with ranking
                </Text>
              </CardHeader>
              <CardBody>
                <Grid templateColumns="repeat(auto-fit, minmax(300px, 1fr))" gap={6}>
                  {repoBreakdown.map((repo) => (
                    <Box
                      key={repo.repository}
                      p={4}
                      border="1px"
                      borderColor={borderColor}
                      borderRadius="md"
                      _hover={{ borderColor: 'blue.500', shadow: 'md' }}
                      transition="all 0.2s"
                    >
                      <VStack align="start" spacing={3}>
                        <HStack justify="space-between" w="100%">
                          <Heading size="sm" color="blue.500">
                            {repo.repository}
                          </Heading>
                          <Badge colorScheme="blue">
                            Rank #{repo.rank}
                          </Badge>
                        </HStack>
                        
                        <Divider />
                        
                        <Grid templateColumns="repeat(3, 1fr)" gap={4} w="100%">
                          <VStack>
                            <Text fontSize="sm" color={mutedColor}>Commits</Text>
                            <Text fontWeight="bold">{repo.commits}</Text>
                          </VStack>
                          <VStack>
                            <Text fontSize="sm" color={mutedColor}>Additions</Text>
                            <Text fontWeight="bold" color="green.500">
                              +{repo.additions.toLocaleString()}
                            </Text>
                          </VStack>
                          <VStack>
                            <Text fontSize="sm" color={mutedColor}>Deletions</Text>
                            <Text fontWeight="bold" color="red.500">
                              -{repo.deletions.toLocaleString()}
                            </Text>
                          </VStack>
                        </Grid>
                      </VStack>
                    </Box>
                  ))}
                </Grid>
              </CardBody>
            </Card>
          </MotionBox>

          {/* Activity Charts */}
          <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={6}>
            {/* Weekly Activity Timeline */}
            <MotionBox
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card bg={cardBg} borderColor={borderColor}>
                <CardHeader>
                  <Heading size="md">Weekly Activity (Last 26 Weeks)</Heading>
                  <Text color={mutedColor} fontSize="sm">
                    Commits over time
                  </Text>
                </CardHeader>
                <CardBody>
                  <Box h="300px">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={weeklyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="week" />
                        <YAxis />
                        <Tooltip />
                        <Line
                          type="monotone"
                          dataKey="commits"
                          stroke="#4299E1"
                          strokeWidth={3}
                          dot={{ fill: '#4299E1', strokeWidth: 2, r: 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </Box>
                </CardBody>
              </Card>
            </MotionBox>

            {/* Code Changes Timeline */}
            <MotionBox
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card bg={cardBg} borderColor={borderColor}>
                <CardHeader>
                  <Heading size="md">Code Changes</Heading>
                  <Text color={mutedColor} fontSize="sm">
                    Additions and deletions over time
                  </Text>
                </CardHeader>
                <CardBody>
                  <Box h="300px">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={weeklyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="week" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Area
                          type="monotone"
                          dataKey="additions"
                          stackId="1"
                          stroke="#48BB78"
                          fill="#48BB78"
                          fillOpacity={0.6}
                        />
                        <Area
                          type="monotone"
                          dataKey="deletions"
                          stackId="2"
                          stroke="#ED8936"
                          fill="#ED8936"
                          fillOpacity={0.6}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </Box>
                </CardBody>
              </Card>
            </MotionBox>
          </Grid>

          {/* Repository Comparison Chart */}
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card bg={cardBg} borderColor={borderColor}>
              <CardHeader>
                <Heading size="md">Repository Comparison</Heading>
                <Text color={mutedColor} fontSize="sm">
                  Contributions across different repositories
                </Text>
              </CardHeader>
              <CardBody>
                <Box h="300px">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={repoBreakdown}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="repository" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="commits" fill="#4299E1" name="Commits" />
                      <Bar dataKey="additions" fill="#48BB78" name="Additions" />
                      <Bar dataKey="deletions" fill="#ED8936" name="Deletions" />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </CardBody>
            </Card>
          </MotionBox>

          {/* Summary */}
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Card bg={cardBg} borderColor={borderColor}>
              <CardHeader>
                <Heading size="md">Summary</Heading>
              </CardHeader>
              <CardBody>
                <Text fontSize="lg" color={textColor}>
                  <strong>{username}</strong> has made significant contributions to the Ethereum ecosystem 
                  with <strong>{totalContributions.commits} commits</strong> across{' '}
                  <strong>{contributors.length} repository{contributors.length > 1 ? 'ies' : 'y'}</strong>. 
                  Their contributions include <strong>{totalContributions.additions.toLocaleString()} additions</strong> and{' '}
                  <strong>{totalContributions.deletions.toLocaleString()} deletions</strong>, showing active 
                  participation in Ethereum protocol development.
                </Text>
                
                <Text mt={4} color={mutedColor}>
                  <CalendarIcon mr={2} />
                  Last updated: {new Date(primaryContributor.last_updated).toLocaleDateString()}
                </Text>
              </CardBody>
            </Card>
          </MotionBox>
        </VStack>
      </Container>
    </>
  );
};

export default ContributorProfilePage;