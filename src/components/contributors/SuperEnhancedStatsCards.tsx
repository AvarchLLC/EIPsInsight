import React from 'react';
import {
  Box,
  Card,
  CardHeader,
  CardBody,
  Heading,
  Text,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Grid,
  VStack,
  HStack,
  Icon,
  useColorModeValue,
  Progress,
  Badge,
  Flex,
  CircularProgress,
  CircularProgressLabel,
  Tooltip,
  Divider
} from '@chakra-ui/react';
import { 
  CalendarIcon, 
  StarIcon, 
  EditIcon, 
  AddIcon, 
  MinusIcon,
  TimeIcon,
  CheckCircleIcon,
} from '@chakra-ui/icons';
import { 
  FaCode, 
  FaUsers, 
  FaGitAlt, 
  FaTrophy, 
  FaChartLine, 
  FaShieldAlt,
  FaBus,
  FaHeart,
  FaRocket,
  FaFire
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import { TrendingDownIcon, TrendingUpIcon } from 'lucide-react';

interface RepoStats {
  repository: string;
  total_contributors: number;
  total_commits: number;
  total_additions: number;
  total_deletions: number;
  repository_age_days: number;
  avg_commits_per_day: number;
  contributor_distribution: {
    core_contributors: number;
    regular_contributors: number;
    occasional_contributors: number;
    one_time_contributors: number;
    bus_factor: number;
  };
  collaboration_score: number;
  contributor_retention: number;
  growth_trend: string;
  health_score: number;
  last_updated: Date;
}

interface SuperEnhancedStatsCardsProps {
  repoStats: RepoStats;
  selectedRepo: string;
}

const MotionCard = motion(Card);

const SuperEnhancedStatsCards: React.FC<SuperEnhancedStatsCardsProps> = ({
  repoStats,
  selectedRepo
}) => {
  const bg = useColorModeValue('white', 'gray.800');
  const cardBg = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const mutedColor = useColorModeValue('gray.600', 'gray.400');
  const textColor = useColorModeValue('gray.800', 'white');

  // Main metrics configuration
  const mainMetrics = [
    {
      label: 'Total Contributors',
      value: repoStats.total_contributors,
      icon: FaUsers,
      color: 'blue',
      bgGradient: 'linear(to-br, blue.400, blue.600)',
      description: 'Active developers',
      formatValue: (val: number) => val.toLocaleString(),
      subMetric: `${Math.round((repoStats.contributor_distribution.core_contributors / repoStats.total_contributors) * 100)}% core`
    },
    {
      label: 'Total Commits',
      value: repoStats.total_commits,
      icon: FaGitAlt,
      color: 'green',
      bgGradient: 'linear(to-br, green.400, green.600)',
      description: 'Code contributions',
      formatValue: (val: number) => val.toLocaleString(),
      subMetric: `${repoStats.avg_commits_per_day?.toFixed(1) || '0'}/day avg`
    },
    {
      label: 'Repository Health',
      value: repoStats.health_score,
      icon: FaShieldAlt,
      color: repoStats.health_score > 80 ? 'green' : repoStats.health_score > 60 ? 'orange' : 'red',
      bgGradient: repoStats.health_score > 80 
        ? 'linear(to-br, green.400, green.600)'
        : repoStats.health_score > 60 
        ? 'linear(to-br, orange.400, orange.600)'
        : 'linear(to-br, red.400, red.600)',
      description: 'Overall health',
      formatValue: (val: number) => `${val}/100`,
      subMetric: repoStats.growth_trend
    },
    {
      label: 'Code Changes',
      value: repoStats.total_additions + repoStats.total_deletions,
      icon: FaCode,
      color: 'purple',
      bgGradient: 'linear(to-br, purple.400, purple.600)',
      description: 'Total lines changed',
      formatValue: (val: number) => {
        if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`;
        if (val >= 1000) return `${(val / 1000).toFixed(1)}K`;
        return val.toLocaleString();
      },
      subMetric: `+${repoStats.total_additions.toLocaleString()} / -${repoStats.total_deletions.toLocaleString()}`
    }
  ];

  // Advanced insights
  const busFactor = repoStats.contributor_distribution.bus_factor;
  const retentionRate = repoStats.contributor_retention;
  const collaborationScore = repoStats.collaboration_score;
  const repositoryAge = Math.floor(repoStats.repository_age_days / 365);

  return (
    <VStack spacing={8} align="stretch">
      {/* Main Metrics Grid */}
      <Grid templateColumns="repeat(auto-fit, minmax(300px, 1fr))" gap={6}>
        {mainMetrics.map((metric, index) => (
          <MotionCard
            key={metric.label}
            bg={cardBg}
            borderColor={borderColor}
            borderWidth="1px"
            borderRadius="2xl"
            shadow="xl"
            overflow="hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            _hover={{
              transform: 'translateY(-8px)',
              shadow: '2xl'
            }}
            position="relative"
          >
            {/* Background Pattern */}
            <Box
              position="absolute"
              top="0"
              right="0"
              width="120px"
              height="120px"
              opacity={0.1}
              bgGradient={metric.bgGradient}
              borderRadius="full"
              transform="translate(30%, -30%)"
            />
            
            <CardBody p={6} position="relative" zIndex={1}>
              <Flex justify="space-between" align="flex-start">
                <VStack align="start" spacing={4} flex={1}>
                  <HStack spacing={3}>
                    <Box
                      p={3}
                      bgGradient={metric.bgGradient}
                      borderRadius="xl"
                      color="white"
                    >
                      <Icon as={metric.icon} boxSize={6} />
                    </Box>
                    <VStack align="start" spacing={0}>
                      <Text fontSize="sm" fontWeight="medium" color={mutedColor}>
                        {metric.label}
                      </Text>
                      <Text fontSize="2xl" fontWeight="bold" color={textColor}>
                        {metric.formatValue(metric.value)}
                      </Text>
                    </VStack>
                  </HStack>
                  
                  <VStack align="start" spacing={2} w="full">
                    <Text fontSize="sm" color={mutedColor}>
                      {metric.description}
                    </Text>
                    {metric.subMetric && (
                      <Badge colorScheme={metric.color} variant="subtle" px={3} py={1}>
                        {metric.subMetric}
                      </Badge>
                    )}
                    <Progress
                      value={metric.label === 'Repository Health' ? metric.value : 
                             Math.min((metric.value / Math.max(...mainMetrics.map(m => m.value))) * 100, 100)}
                      colorScheme={metric.color}
                      size="sm"
                      borderRadius="full"
                      w="full"
                    />
                  </VStack>
                </VStack>
              </Flex>
            </CardBody>
          </MotionCard>
        ))}
      </Grid>

      {/* Advanced Analytics Dashboard */}
      <Grid templateColumns="repeat(auto-fit, minmax(280px, 1fr))" gap={6}>
        {/* Bus Factor */}
        <Card bg={cardBg} borderRadius="xl" shadow="lg" borderWidth="1px" borderColor={borderColor}>
          <CardBody p={6}>
            <VStack spacing={4}>
              <HStack justify="space-between" w="full">
                <VStack align="start" spacing={1}>
                  <HStack>
                    <Icon as={FaBus} color="red.500" />
                    <Text fontSize="sm" fontWeight="bold" color={textColor}>
                      Bus Factor
                    </Text>
                  </HStack>
                  <Text fontSize="xs" color={mutedColor}>
                    Key contributors risk
                  </Text>
                </VStack>
                <CircularProgress 
                  value={Math.min((busFactor / 10) * 100, 100)} 
                  color={busFactor > 5 ? "green.400" : busFactor > 3 ? "orange.400" : "red.400"}
                  size="60px"
                >
                  <CircularProgressLabel fontSize="sm" fontWeight="bold">
                    {busFactor}
                  </CircularProgressLabel>
                </CircularProgress>
              </HStack>
              <Text fontSize="xs" color={mutedColor} textAlign="center">
                {busFactor > 5 ? "Healthy distribution" : busFactor > 3 ? "Moderate risk" : "High risk"}
              </Text>
            </VStack>
          </CardBody>
        </Card>

        {/* Contributor Retention */}
        <Card bg={cardBg} borderRadius="xl" shadow="lg" borderWidth="1px" borderColor={borderColor}>
          <CardBody p={6}>
            <VStack spacing={4}>
              <HStack justify="space-between" w="full">
                <VStack align="start" spacing={1}>
                  <HStack>
                    <Icon as={FaHeart} color="pink.500" />
                    <Text fontSize="sm" fontWeight="bold" color={textColor}>
                      Retention Rate
                    </Text>
                  </HStack>
                  <Text fontSize="xs" color={mutedColor}>
                    Active contributors
                  </Text>
                </VStack>
                <CircularProgress 
                  value={retentionRate} 
                  color={retentionRate > 60 ? "green.400" : retentionRate > 40 ? "orange.400" : "red.400"}
                  size="60px"
                >
                  <CircularProgressLabel fontSize="sm" fontWeight="bold">
                    {retentionRate}%
                  </CircularProgressLabel>
                </CircularProgress>
              </HStack>
              <Text fontSize="xs" color={mutedColor} textAlign="center">
                Active in last 6 months
              </Text>
            </VStack>
          </CardBody>
        </Card>

        {/* Collaboration Score */}
        <Card bg={cardBg} borderRadius="xl" shadow="lg" borderWidth="1px" borderColor={borderColor}>
          <CardBody p={6}>
            <VStack spacing={4}>
              <HStack justify="space-between" w="full">
                <VStack align="start" spacing={1}>
                  <HStack>
                    <Icon as={FaRocket} color="blue.500" />
                    <Text fontSize="sm" fontWeight="bold" color={textColor}>
                      Collaboration
                    </Text>
                  </HStack>
                  <Text fontSize="xs" color={mutedColor}>
                    Team engagement
                  </Text>
                </VStack>
                <CircularProgress 
                  value={collaborationScore} 
                  color={collaborationScore > 70 ? "green.400" : collaborationScore > 50 ? "orange.400" : "red.400"}
                  size="60px"
                >
                  <CircularProgressLabel fontSize="sm" fontWeight="bold">
                    {collaborationScore}%
                  </CircularProgressLabel>
                </CircularProgress>
              </HStack>
              <Text fontSize="xs" color={mutedColor} textAlign="center">
                Regular contributor ratio
              </Text>
            </VStack>
          </CardBody>
        </Card>

        {/* Repository Age & Activity */}
        <Card bg={cardBg} borderRadius="xl" shadow="lg" borderWidth="1px" borderColor={borderColor}>
          <CardBody p={6}>
            <VStack spacing={4}>
              <HStack justify="space-between" w="full">
                <VStack align="start" spacing={1}>
                  <HStack>
                    <Icon as={FaFire} color="orange.500" />
                    <Text fontSize="sm" fontWeight="bold" color={textColor}>
                      Repository Age
                    </Text>
                  </HStack>
                  <Text fontSize="xs" color={mutedColor}>
                    Years of development
                  </Text>
                </VStack>
                <VStack align="end" spacing={0}>
                  <Text fontSize="2xl" fontWeight="bold" color="orange.500">
                    {repositoryAge}
                  </Text>
                  <Text fontSize="xs" color={mutedColor}>
                    years
                  </Text>
                </VStack>
              </HStack>
              <Progress
                value={Math.min(repositoryAge * 10, 100)}
                colorScheme="orange"
                size="sm"
                borderRadius="full"
                w="full"
              />
            </VStack>
          </CardBody>
        </Card>
      </Grid>

      {/* Contributor Distribution Breakdown */}
      <Card bg={cardBg} borderRadius="xl" shadow="lg" borderWidth="1px" borderColor={borderColor}>
        <CardHeader>
          <HStack justify="space-between">
            <VStack align="start" spacing={1}>
              <Heading size="md" color="blue.500">
                📊 Contributor Distribution Analysis
              </Heading>
              <Text color={mutedColor} fontSize="sm">
                Breakdown of contributor engagement levels
              </Text>
            </VStack>
            <Badge colorScheme="blue" variant="subtle" px={3} py={2} borderRadius="lg">
              {selectedRepo} Repository
            </Badge>
          </HStack>
        </CardHeader>
        <CardBody>
          <Grid templateColumns="repeat(auto-fit, minmax(200px, 1fr))" gap={6}>
            <VStack spacing={3}>
              <HStack>
                <Icon as={FaTrophy} color="gold" />
                <Text fontWeight="bold" color="orange.500">Core Contributors</Text>
              </HStack>
              <Text fontSize="3xl" fontWeight="bold" color="orange.500">
                {repoStats.contributor_distribution.core_contributors}
              </Text>
              <Text fontSize="sm" color={mutedColor} textAlign="center">
                {">"}10% of total commits
              </Text>
              <Progress 
                value={(repoStats.contributor_distribution.core_contributors / repoStats.total_contributors) * 100}
                colorScheme="orange"
                size="lg"
                borderRadius="full"
                w="full"
              />
            </VStack>

            <VStack spacing={3}>
              <HStack>
                <Icon as={FaChartLine} color="blue.500" />
                <Text fontWeight="bold" color="blue.500">Regular Contributors</Text>
              </HStack>
              <Text fontSize="3xl" fontWeight="bold" color="blue.500">
                {repoStats.contributor_distribution.regular_contributors}
              </Text>
              <Text fontSize="sm" color={mutedColor} textAlign="center">
                1-10% of total commits
              </Text>
              <Progress 
                value={(repoStats.contributor_distribution.regular_contributors / repoStats.total_contributors) * 100}
                colorScheme="blue"
                size="lg"
                borderRadius="full"
                w="full"
              />
            </VStack>

            <VStack spacing={3}>
              <HStack>
                <Icon as={FaUsers} color="green.500" />
                <Text fontWeight="bold" color="green.500">Occasional</Text>
              </HStack>
              <Text fontSize="3xl" fontWeight="bold" color="green.500">
                {repoStats.contributor_distribution.occasional_contributors}
              </Text>
              <Text fontSize="sm" color={mutedColor} textAlign="center">
                Multiple commits, {"<"}1%
              </Text>
              <Progress 
                value={(repoStats.contributor_distribution.occasional_contributors / repoStats.total_contributors) * 100}
                colorScheme="green"
                size="lg"
                borderRadius="full"
                w="full"
              />
            </VStack>

            <VStack spacing={3}>
              <HStack>
                <Icon as={StarIcon} color="purple.500" />
                <Text fontWeight="bold" color="purple.500">One-time</Text>
              </HStack>
              <Text fontSize="3xl" fontWeight="bold" color="purple.500">
                {repoStats.contributor_distribution.one_time_contributors}
              </Text>
              <Text fontSize="sm" color={mutedColor} textAlign="center">
                Single commit only
              </Text>
              <Progress 
                value={(repoStats.contributor_distribution.one_time_contributors / repoStats.total_contributors) * 100}
                colorScheme="purple"
                size="lg"
                borderRadius="full"
                w="full"
              />
            </VStack>
          </Grid>

          <Divider my={6} />
          
          <VStack spacing={3}>
            <Text fontSize="lg" fontWeight="bold" color={textColor}>
              📈 Growth Trend: {repoStats.growth_trend === 'growing' ? '📈 Growing' : 
                                 repoStats.growth_trend === 'declining' ? '📉 Declining' : '➡️ Stable'}
            </Text>
            <HStack spacing={6}>
              <Stat textAlign="center">
                <StatLabel>Health Score</StatLabel>
                <StatNumber color={repoStats.health_score > 80 ? "green.500" : 
                                  repoStats.health_score > 60 ? "orange.500" : "red.500"}>
                  {repoStats.health_score}/100
                </StatNumber>
              </Stat>
              <Stat textAlign="center">
                <StatLabel>Last Updated</StatLabel>
                <StatNumber fontSize="lg" color="blue.500">
                  {new Date(repoStats.last_updated).toLocaleDateString()}
                </StatNumber>
              </Stat>
            </HStack>
          </VStack>
        </CardBody>
      </Card>
    </VStack>
  );
};

export default SuperEnhancedStatsCards;