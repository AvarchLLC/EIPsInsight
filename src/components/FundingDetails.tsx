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
import { FaExternalLinkAlt } from 'react-icons/fa';

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

  // Helper to convert an amount string into a human tier label.
  const getTier = (amountStr: string) => {
    if (!amountStr) return 'Community';
    const numeric = parseFloat(amountStr.replace(/[^0-9.]/g, ''));
    if (Number.isNaN(numeric)) return 'Community';
    if (numeric >= 10000) return 'Significant';
    if (numeric >= 500) return 'Moderate';
    return 'Small';
  };

  const tierColor = (tier: string) => {
    switch (tier) {
      case 'Significant':
        return 'purple';
      case 'Moderate':
        return 'blue';
      case 'Small':
        return 'cyan';
      default:
        return 'gray';
    }
  };

  return (
    <VStack spacing={4} align="stretch">
      {/* Funding overview removed as requested. */}

      {/* Grant details moved to a dedicated GrantList component */}

      {/* Call to Action (no internal container) */}
      <VStack spacing={2} align="center">
        <Heading size="sm" color={textColor} textAlign="center">
          Support EIPsInsight
        </Heading>
        <Text color={textColor} maxW="2xl" fontSize="xs" mb={0} textAlign="center">
          Interested in supporting the project? We welcome contributions, partnerships,
          and funding opportunities that help us continue building tools for the Ethereum community.
        </Text>
        <HStack spacing={2}>
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
          <Button
            as={ChakraLink}
            href="/donate"
            colorScheme="pink"
            variant="outline"
          >
            Donate
          </Button>
        </HStack>
      </VStack>
    </VStack>
  );
}