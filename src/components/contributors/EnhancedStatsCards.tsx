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
  StatArrow,
  Grid,
  VStack,
  HStack,
  Icon,
  useColorModeValue,
  Progress,
  Badge,
  Flex
} from '@chakra-ui/react';
import { 
  CalendarIcon, 
  StarIcon, 
  EditIcon, 
  AddIcon, 
  MinusIcon,
  TimeIcon,
  CheckCircleIcon
} from '@chakra-ui/icons';
import { FaCode, FaUsers, FaGitAlt, FaTrophy } from 'react-icons/fa';
import { motion } from 'framer-motion';

interface RepoStats {
  repository: string;
  total_contributors: number;
  total_commits: number;
  total_additions: number;
  total_deletions: number;
  last_updated: Date;
}

interface EnhancedStatsCardsProps {
  repoStats: RepoStats;
  selectedRepo: string;
}

const MotionCard = motion(Card);

const EnhancedStatsCards: React.FC<EnhancedStatsCardsProps> = ({
  repoStats,
  selectedRepo
}) => {
  const bg = useColorModeValue('white', 'gray.800');
  const cardBg = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const mutedColor = useColorModeValue('gray.600', 'gray.400');

  const statsConfig = [
    {
      label: 'Total Contributors',
      value: repoStats.total_contributors,
      icon: FaUsers,
      color: 'blue',
      bgGradient: 'linear(to-r, blue.400, blue.600)',
      description: 'Active developers',
      formatValue: (val: number) => val.toLocaleString()
    },
    {
      label: 'Total Commits',
      value: repoStats.total_commits,
      icon: FaGitAlt,
      color: 'green',
      bgGradient: 'linear(to-r, green.400, green.600)',
      description: 'Code contributions',
      formatValue: (val: number) => val.toLocaleString()
    },
    {
      label: 'Lines Added',
      value: repoStats.total_additions,
      icon: AddIcon,
      color: 'orange',
      bgGradient: 'linear(to-r, orange.400, orange.600)',
      description: 'Code expansion',
      formatValue: (val: number) => `+${val.toLocaleString()}`
    },
    {
      label: 'Lines Removed',
      value: repoStats.total_deletions,
      icon: MinusIcon,
      color: 'red',
      bgGradient: 'linear(to-r, red.400, red.600)',
      description: 'Code cleanup',
      formatValue: (val: number) => `-${val.toLocaleString()}`
    }
  ];

  // Calculate derived metrics
  const netCodeChange = repoStats.total_additions - repoStats.total_deletions;
  const avgCommitsPerContributor = Math.round(repoStats.total_commits / repoStats.total_contributors);
  const codeChangeRatio = repoStats.total_deletions > 0 ? (repoStats.total_additions / repoStats.total_deletions).toFixed(2) : '∞';

  return (
    <VStack spacing={6} align="stretch">
      {/* Main Stats Grid */}
      <Grid templateColumns="repeat(auto-fit, minmax(280px, 1fr))" gap={6}>
        {statsConfig.map((stat, index) => (
          <MotionCard
            key={stat.label}
            bg={cardBg}
            borderColor={borderColor}
            borderWidth="1px"
            borderRadius="xl"
            shadow="lg"
            overflow="hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            _hover={{
              transform: 'translateY(-4px)',
              shadow: 'xl'
            }}
          >
            <CardBody p={0}>
              <Box
                bgGradient={stat.bgGradient}
                p={4}
                color="white"
              >
                <HStack justify="space-between">
                  <VStack align="start" spacing={0}>
                    <Text fontSize="sm" fontWeight="medium" opacity={0.9}>
                      {stat.label}
                    </Text>
                    <Text fontSize="2xl" fontWeight="bold">
                      {stat.formatValue(stat.value)}
                    </Text>
                  </VStack>
                  <Box
                    p={3}
                    bg="whiteAlpha.200"
                    borderRadius="full"
                  >
                    <Icon as={stat.icon} boxSize={6} />
                  </Box>
                </HStack>
              </Box>
              <Box p={4}>
                <Text fontSize="sm" color={mutedColor}>
                  {stat.description}
                </Text>
                <Progress
                  value={Math.min((stat.value / Math.max(...statsConfig.map(s => s.value))) * 100, 100)}
                  colorScheme={stat.color}
                  size="sm"
                  mt={2}
                  borderRadius="full"
                />
              </Box>
            </CardBody>
          </MotionCard>
        ))}
      </Grid>

      {/* Derived Metrics */}
      <Grid templateColumns="repeat(auto-fit, minmax(250px, 1fr))" gap={4}>
        <Card bg={cardBg} borderColor={borderColor} borderWidth="1px" borderRadius="lg" shadow="md">
          <CardBody>
            <Stat>
              <StatLabel>
                <HStack>
                  <Icon as={FaTrophy} color="yellow.500" />
                  <Text>Avg Commits per Contributor</Text>
                </HStack>
              </StatLabel>
              <StatNumber color="blue.500" fontSize="xl">
                {avgCommitsPerContributor}
              </StatNumber>
              <StatHelpText>
                Productivity metric
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card bg={cardBg} borderColor={borderColor} borderWidth="1px" borderRadius="lg" shadow="md">
          <CardBody>
            <Stat>
              <StatLabel>
                <HStack>
                  <Icon as={FaCode} color="green.500" />
                  <Text>Net Code Growth</Text>
                </HStack>
              </StatLabel>
              <StatNumber color={netCodeChange > 0 ? "green.500" : "red.500"} fontSize="xl">
                {netCodeChange > 0 ? '+' : ''}{netCodeChange.toLocaleString()}
              </StatNumber>
              <StatHelpText>
                <StatArrow type={netCodeChange > 0 ? 'increase' : 'decrease'} />
                Lines of code
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card bg={cardBg} borderColor={borderColor} borderWidth="1px" borderRadius="lg" shadow="md">
          <CardBody>
            <Stat>
              <StatLabel>
                <HStack>
                  <Icon as={EditIcon} color="purple.500" />
                  <Text>Code Change Ratio</Text>
                </HStack>
              </StatLabel>
              <StatNumber color="purple.500" fontSize="xl">
                {codeChangeRatio}:1
              </StatNumber>
              <StatHelpText>
                Additions to deletions
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card bg={cardBg} borderColor={borderColor} borderWidth="1px" borderRadius="lg" shadow="md">
          <CardBody>
            <Stat>
              <StatLabel>
                <HStack>
                  <Icon as={TimeIcon} color="teal.500" />
                  <Text>Last Updated</Text>
                </HStack>
              </StatLabel>
              <StatNumber fontSize="lg" color="teal.500">
                {new Date(repoStats.last_updated).toLocaleDateString()}
              </StatNumber>
              <StatHelpText>
                <Icon as={CheckCircleIcon} color="green.500" mr={1} />
                Data current
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>
      </Grid>

      {/* Repository Badge */}
      <Card bg={cardBg} borderColor={borderColor} borderWidth="1px" borderRadius="lg" shadow="md">
        <CardBody>
          <Flex justify="center" align="center" direction="column" p={4}>
            <Badge
              colorScheme="blue"
              fontSize="lg"
              px={4}
              py={2}
              borderRadius="full"
              mb={2}
            >
              📊 {selectedRepo} Repository Analytics
            </Badge>
            <Text color={mutedColor} textAlign="center" fontSize="sm">
              Comprehensive statistics for the {selectedRepo} repository showing contributor activity,
              code changes, and development trends over time.
            </Text>
          </Flex>
        </CardBody>
      </Card>
    </VStack>
  );
};

export default EnhancedStatsCards;