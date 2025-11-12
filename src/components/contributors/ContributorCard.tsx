import React from 'react';
import {
  Card,
  CardBody,
  VStack,
  HStack,
  Flex,
  Avatar,
  Text,
  Badge,
  SimpleGrid,
  Box,
  Button,
  Link,
  Divider,
  Wrap,
  WrapItem,
  Tooltip,
  useColorModeValue,
} from '@chakra-ui/react';
import { ExternalLinkIcon } from '@chakra-ui/icons';

interface ContributorCardProps {
  contributor: {
    username: string;
    name?: string;
    avatarUrl?: string;
    company?: string;
    expertise: string[];
    totals: {
      activityScore: number;
      commits: number;
      prsMerged: number;
      reviews: number;
      comments: number;
    };
    repos: Array<{
      name: string;
      commits: number;
    }>;
    activityStatus: string;
    risingStarIndex?: number;
  };
}

const ContributorCard: React.FC<ContributorCardProps> = ({ contributor }) => {
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const mutedColor = useColorModeValue('gray.600', 'gray.400');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'green';
      case 'Occasional': return 'yellow';
      case 'Dormant': return 'red';
      default: return 'gray';
    }
  };

  return (
    <Card
      bg={cardBg}
      borderColor={borderColor}
      shadow="md"
      borderRadius="xl"
      _hover={{ shadow: 'xl', transform: 'translateY(-4px)' }}
      transition="all 0.3s"
      h="full"
    >
      <CardBody>
        <VStack spacing={4} align="stretch">
          
          {/* Header */}
          <Flex justify="space-between" align="start">
            <HStack spacing={3}>
              <Tooltip label={`View ${contributor.username}'s GitHub profile`} hasArrow>
                <Avatar
                  size="lg"
                  src={contributor.avatarUrl}
                  name={contributor.username}
                  cursor="pointer"
                  onClick={() => window.open(`https://github.com/${contributor.username}`, '_blank')}
                />
              </Tooltip>
              <VStack align="start" spacing={0}>
                <Text fontWeight="bold" fontSize="lg">
                  {contributor.name || contributor.username}
                </Text>
                <Link
                  href={`https://github.com/${contributor.username}`}
                  isExternal
                  fontSize="sm"
                  color="blue.500"
                  _hover={{ textDecoration: 'underline' }}
                >
                  @{contributor.username}
                </Link>
                {contributor.company && (
                  <Text fontSize="xs" color={mutedColor}>
                    {contributor.company}
                  </Text>
                )}
              </VStack>
            </HStack>
            <Tooltip label={`${contributor.activityStatus} contributor - based on recent 90-day activity`} hasArrow>
              <Badge colorScheme={getStatusColor(contributor.activityStatus)} fontSize="xs">
                {contributor.activityStatus}
              </Badge>
            </Tooltip>
          </Flex>

          <Divider />

          {/* Metrics */}
          <SimpleGrid columns={2} spacing={3}>
            <Tooltip label="Weighted score based on all contributions" hasArrow>
              <Box>
                <Text fontSize="xs" color={mutedColor}>Activity Score</Text>
                <Text fontSize="xl" fontWeight="bold" color="blue.500">
                  {contributor.totals.activityScore.toFixed(1)}
                </Text>
              </Box>
            </Tooltip>
            
            <Tooltip label="Total commits across all repositories" hasArrow>
              <Box>
                <Text fontSize="xs" color={mutedColor}>Commits</Text>
                <Text fontSize="xl" fontWeight="bold">
                  {contributor.totals.commits}
                </Text>
              </Box>
            </Tooltip>
            
            <Tooltip label="Pull requests successfully merged" hasArrow>
              <Box>
                <Text fontSize="xs" color={mutedColor}>PRs Merged</Text>
                <Text fontSize="xl" fontWeight="bold" color="green.500">
                  {contributor.totals.prsMerged}
                </Text>
              </Box>
            </Tooltip>
            
            <Tooltip label="Code reviews performed" hasArrow>
              <Box>
                <Text fontSize="xs" color={mutedColor}>Reviews</Text>
                <Text fontSize="xl" fontWeight="bold" color="purple.500">
                  {contributor.totals.reviews}
                </Text>
              </Box>
            </Tooltip>
          </SimpleGrid>

          {/* Repositories */}
          {contributor.repos && contributor.repos.length > 0 && (
            <Box>
              <Text fontSize="xs" color={mutedColor} mb={2}>Contributing to:</Text>
              <Wrap>
                {contributor.repos.map(repo => (
                  <WrapItem key={repo.name}>
                    <Tooltip label={`${repo.commits} commits in ${repo.name}`} hasArrow>
                      <Badge colorScheme="blue" variant="subtle" fontSize="xs">
                        {repo.name.replace('ethereum/', '')} ({repo.commits})
                      </Badge>
                    </Tooltip>
                  </WrapItem>
                ))}
              </Wrap>
            </Box>
          )}

          {/* Expertise */}
          {contributor.expertise && contributor.expertise.length > 0 && (
            <Box>
              <Text fontSize="xs" color={mutedColor} mb={2}>Expertise:</Text>
              <Wrap>
                {contributor.expertise.slice(0, 3).map(exp => (
                  <WrapItem key={exp}>
                    <Badge colorScheme="purple" variant="subtle" fontSize="xs">
                      {exp}
                    </Badge>
                  </WrapItem>
                ))}
              </Wrap>
            </Box>
          )}

          {/* Rising Star */}
          {contributor.risingStarIndex && contributor.risingStarIndex > 0 && (
            <Tooltip label="This contributor is showing rapid growth!" hasArrow>
              <Badge colorScheme="yellow" variant="solid" fontSize="sm">
                ⭐ Rising Star
              </Badge>
            </Tooltip>
          )}

          {/* Action Button */}
          <Button
            as={Link}
            href={`https://github.com/${contributor.username}`}
            target="_blank"
            size="sm"
            colorScheme="blue"
            variant="outline"
            rightIcon={<ExternalLinkIcon />}
            _hover={{ textDecoration: 'none' }}
          >
            View GitHub Profile
          </Button>
        </VStack>
      </CardBody>
    </Card>
  );
};

export default ContributorCard;
