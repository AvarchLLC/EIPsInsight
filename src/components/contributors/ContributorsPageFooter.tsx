import React from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Link,
  Icon,
  useColorModeValue,
  Divider,
  Badge,
  Button
} from '@chakra-ui/react';
import { 
  ExternalLinkIcon, 
  InfoIcon,
  StarIcon,
  ViewIcon
} from '@chakra-ui/icons';
import { FaGithub, FaChartLine, FaUsers } from 'react-icons/fa';

interface ContributorsPageFooterProps {
  selectedRepo: string;
  totalContributors?: number;
  lastUpdated?: Date;
}

const ContributorsPageFooter: React.FC<ContributorsPageFooterProps> = ({
  selectedRepo,
  totalContributors = 0,
  lastUpdated
}) => {
  const bg = useColorModeValue('gray.50', 'gray.900');
  const textColor = useColorModeValue('gray.700', 'gray.300');
  const mutedColor = useColorModeValue('gray.500', 'gray.400');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const getRepoUrl = (repo: string) => {
    switch (repo.toLowerCase()) {
      case 'eips':
        return 'https://github.com/ethereum/EIPs';
      case 'ercs':
        return 'https://github.com/ethereum/ERCs';
      case 'rips':
        return 'https://github.com/ethereum/RIPs';
      default:
        return 'https://github.com/ethereum/EIPs';
    }
  };

  return (
    <Box
      bg={bg}
      borderTop="1px solid"
      borderColor={borderColor}
      borderRadius="lg"
      p={6}
      mt={8}
    >
      <VStack spacing={4} align="stretch">
        <HStack justify="space-between" align="center" wrap="wrap">
          <HStack spacing={6}>
            <VStack align="start" spacing={1}>
              <HStack>
                <Icon as={FaUsers} color="blue.500" />
                <Text fontSize="sm" fontWeight="bold" color={textColor}>
                  Contributors Tracked
                </Text>
              </HStack>
              <Badge colorScheme="blue" fontSize="md" px={2} py={1}>
                {totalContributors.toLocaleString()}
              </Badge>
            </VStack>

            <VStack align="start" spacing={1}>
              <HStack>
                <Icon as={FaChartLine} color="green.500" />
                <Text fontSize="sm" fontWeight="bold" color={textColor}>
                  Repository
                </Text>
              </HStack>
              <Badge colorScheme="green" fontSize="md" px={2} py={1}>
                {selectedRepo}
              </Badge>
            </VStack>

            {lastUpdated && (
              <VStack align="start" spacing={1}>
                <HStack>
                  <Icon as={InfoIcon} color="orange.500" />
                  <Text fontSize="sm" fontWeight="bold" color={textColor}>
                    Last Updated
                  </Text>
                </HStack>
                <Text fontSize="sm" color={mutedColor}>
                  {new Date(lastUpdated).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </Text>
              </VStack>
            )}
          </HStack>

          <VStack spacing={2} align="end">
            <Button
              as={Link}
              href={getRepoUrl(selectedRepo)}
              isExternal
              size="sm"
              leftIcon={<Icon as={FaGithub} />}
              rightIcon={<ExternalLinkIcon />}
              colorScheme="blue"
              variant="outline"
              _hover={{ textDecoration: 'none' }}
            >
              View {selectedRepo} on GitHub
            </Button>
          </VStack>
        </HStack>

        <Divider />

        <HStack justify="space-between" align="center" wrap="wrap">
          <VStack align="start" spacing={1}>
            <Text fontSize="sm" fontWeight="bold" color={textColor}>
              📊 EIPs Insight - Contributors Analytics
            </Text>
            <Text fontSize="xs" color={mutedColor}>
              Comprehensive contributor analytics for Ethereum ecosystem repositories.
              Data includes commits, code changes, activity patterns, and growth metrics.
            </Text>
          </VStack>

          <HStack spacing={4}>
            <HStack spacing={1}>
              <Icon as={ViewIcon} color="blue.400" boxSize={4} />
              <Text fontSize="xs" color={mutedColor}>
                Real-time data
              </Text>
            </HStack>
            <HStack spacing={1}>
              <Icon as={StarIcon} color="yellow.400" boxSize={4} />
              <Text fontSize="xs" color={mutedColor}>
                Interactive charts
              </Text>
            </HStack>
          </HStack>
        </HStack>

        <Box textAlign="center">
          <Text fontSize="xs" color={mutedColor}>
            Built with ❤️ for the Ethereum community • 
            <Link href="https://eipsinsight.com" isExternal color="blue.500" ml={1}>
              EIPsInsight.com
            </Link>
          </Text>
        </Box>
      </VStack>
    </Box>
  );
};

export default ContributorsPageFooter;