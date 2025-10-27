import React from 'react';
import {
  Box,
  Heading,
  Text,
  SimpleGrid,
  VStack,
  HStack,
  Image,
  Tag,
  useColorModeValue,
  Badge,
  Divider,
  Button,
  Link as ChakraLink,
} from '@chakra-ui/react';
import { FaExternalLinkAlt, FaCheckCircle } from 'react-icons/fa';

const grants = [
  {
    id: 'esp',
    title: 'Ecosystem Support Program (ESP)',
    organization: 'Ethereum Foundation',
    amount: '$20,000',
    status: 'Awarded',
    startDate: '2024',
    impact: 'Funds help maintain data pipelines, improve charts and analytics, and keep EIPsInsight open-source and community driven.',
    logo: '/EF-ESP-logo.svg',
    logoWhite: '/EF-ESP-logo-white-text.svg',
    link: 'https://esp.ethereum.org/',
    tags: ['Infrastructure', 'Open Source']
  },
  {
    id: 'gg18-core',
    title: 'Gitcoin Grants Round 18 (Core)',
    organization: 'Gitcoin',
    amount: '$248',
    status: 'Completed',
    startDate: 'Aug 1, 2023',
    impact: 'Community-driven funding supporting projects aligned with Gitcoin DAO mission, focusing on community impact and sustainability.',
    logo: '/Gitcoin-logo-.jpg',
    tags: ['Community', 'Network']
  },
  {
    id: 'asia-round',
    title: 'Gitcoin Grants Round 21 (Asia)',
    organization: 'Gitcoin',
    amount: '$57.22',
    status: 'Completed',
    startDate: 'Aug 7, 2024',
    impact: 'Focus on inclusion across Asian languages and developer communities, expanding EIPsInsight\'s global reach.',
    logo: '/Gitcoin-logo-.jpg',
    tags: ['Community', 'Asia', 'Inclusion']
  },
  {
    id: 'octant',
    title: 'Octant Funding',
    organization: 'Octant',
    amount: 'Community Allocation',
    status: 'Completed',
    startDate: '2024',
    impact: 'Web3 infrastructure improvements and open-source tooling development, enhancing platform capabilities.',
    logo: '/octant.png',
    tags: ['Infrastructure', 'Web3']
  }
];

export default function FundingDetails() {
  const cardBg = useColorModeValue('white', '#2d3748');
  const textColor = useColorModeValue('gray.700', 'gray.200');
  const borderColor = useColorModeValue('gray.200', '#4a5568');
  const logoSrc = useColorModeValue('/EF-ESP-logo.svg', '/EF-ESP-logo-white-text.svg');
  
  // Enhanced dark mode visibility
  const getBorderStyle = () => useColorModeValue('1px solid rgba(2,6,23,0.04)', '2px solid rgba(74,85,104,0.8)');
  const getShadowStyle = () => useColorModeValue('0 6px 18px rgba(2,6,23,0.03)', '0 10px 30px rgba(0,0,0,0.4)');
  const getHoverShadowStyle = () => useColorModeValue('0 8px 25px rgba(2,6,23,0.08)', '0 15px 40px rgba(0,0,0,0.6)');

  const totalFunding = grants.reduce((sum, grant) => {
    const amount = grant.amount.replace(/[^0-9.]/g, '');
    return sum + (amount ? parseFloat(amount) : 0);
  }, 0);

  return (
    <VStack spacing={8} align="stretch">
      {/* Funding Overview */}
      <Box
        bg={cardBg}
        p={6}
        borderRadius="xl"
        border={useColorModeValue('1px solid rgba(2,6,23,0.04)', '1px solid rgba(255,255,255,0.04)')}
        boxShadow={useColorModeValue('0 6px 18px rgba(2,6,23,0.03)', '0 8px 24px rgba(2,6,23,0.6)')}
      >
        <HStack justify="space-between" align="start" mb={4}>
          <VStack align="start" spacing={2}>
            <Text fontSize="sm" fontWeight="600" color={textColor} opacity={0.8}>
              Total Funding Secured
            </Text>
            <Text fontSize="3xl" fontWeight="bold" color={useColorModeValue('#30A0E0', '#4FD1FF')}>
              ${totalFunding.toLocaleString()}+
            </Text>
          </VStack>
          <Badge colorScheme="green" variant="subtle" px={3} py={1}>
            <HStack spacing={1}>
              <FaCheckCircle size={12} />
              <Text fontSize="sm">Active Project</Text>
            </HStack>
          </Badge>
        </HStack>
        
        <Text color={textColor} fontSize="md" lineHeight="tall">
          EIPsInsight is an open-source public good supported by grants and community funding. 
          These contributions help maintain our data infrastructure, develop new features, and keep 
          the platform free and accessible to the Ethereum community.
        </Text>
      </Box>

      {/* Grant Details */}
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
        {grants.map((grant) => (
          <Box
            key={grant.id}
            bg={cardBg}
            p={6}
            borderRadius="xl"
            border={useColorModeValue('1px solid rgba(2,6,23,0.04)', '1px solid rgba(255,255,255,0.04)')}
            boxShadow={useColorModeValue('0 6px 18px rgba(2,6,23,0.03)', '0 8px 24px rgba(2,6,23,0.6)')}
            transition="transform 180ms, box-shadow 180ms"
            _hover={{
              transform: 'translateY(-2px)',
              boxShadow: useColorModeValue('0 8px 25px rgba(2,6,23,0.08)', '0 12px 32px rgba(2,6,23,0.8)')
            }}
          >
            <VStack align="start" spacing={4}>
              {/* Header */}
              <HStack justify="space-between" w="full">
                <HStack spacing={3}>
                  <Image 
                    src={grant.id === 'esp' ? logoSrc : grant.logo} 
                    alt={grant.organization}
                    h={10}
                    objectFit="contain"
                  />
                  <VStack align="start" spacing={0}>
                    <Text fontSize="lg" fontWeight="bold" color={textColor}>
                      {grant.organization}
                    </Text>
                    <Text fontSize="sm" color={textColor} opacity={0.7}>
                      {grant.startDate}
                    </Text>
                  </VStack>
                </HStack>
                <VStack align="end" spacing={1}>
                  <Text fontSize="xl" fontWeight="bold" color={useColorModeValue('#30A0E0', '#4FD1FF')}>
                    {grant.amount}
                  </Text>
                  <Badge 
                    colorScheme={grant.status === 'Awarded' ? 'green' : 'blue'} 
                    variant="subtle"
                  >
                    {grant.status}
                  </Badge>
                </VStack>
              </HStack>

              <Divider />

              {/* Content */}
              <VStack align="start" spacing={3} w="full">
                <Text fontSize="md" fontWeight="semibold" color={textColor}>
                  {grant.title}
                </Text>
                
                <Text fontSize="sm" color={textColor} lineHeight="tall">
                  {grant.impact}
                </Text>

                <HStack spacing={2} flexWrap="wrap">
                  {grant.tags.map((tag) => (
                    <Tag key={tag} size="sm" variant="subtle" colorScheme="blue">
                      {tag}
                    </Tag>
                  ))}
                </HStack>

                {grant.link && (
                  <Button
                    as={ChakraLink}
                    href={grant.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    size="sm"
                    variant="outline"
                    colorScheme="blue"
                    rightIcon={<FaExternalLinkAlt size={12} />}
                  >
                    Learn More
                  </Button>
                )}
              </VStack>
            </VStack>
          </Box>
        ))}
      </SimpleGrid>

      {/* Call to Action */}
      <Box
        bg={cardBg}
        p={6}
        borderRadius="xl"
        border={useColorModeValue('1px solid rgba(2,6,23,0.04)', '1px solid rgba(255,255,255,0.04)')}
        boxShadow={useColorModeValue('0 6px 18px rgba(2,6,23,0.03)', '0 8px 24px rgba(2,6,23,0.6)')}
        textAlign="center"
      >
        <VStack spacing={4}>
          <Heading size="md" color={textColor}>
            Support EIPsInsight
          </Heading>
          <Text color={textColor} maxW="2xl">
            Interested in supporting the project? We welcome contributions, partnerships, 
            and funding opportunities that help us continue building tools for the Ethereum community.
          </Text>
          <HStack spacing={4}>
            <Button
              as={ChakraLink}
              href="https://github.com/AvarchLLC/EIPsInsight"
              target="_blank"
              rel="noopener noreferrer"
              colorScheme="blue"
              variant="outline"
            >
              Open GitHub Issue
            </Button>
            <Button
              as={ChakraLink}
              href="mailto:team@avarch.org"
              colorScheme="blue"
            >
              Contact Team
            </Button>
            <Button
              as={ChakraLink}
              href="https://discord.gg/tUXgfV822C"
              target="_blank"
              rel="noopener noreferrer"
              colorScheme="blue"
              variant="outline"
            >
              Join Us
            </Button>
            
          </HStack>
        </VStack>
      </Box>
    </VStack>
  );
}