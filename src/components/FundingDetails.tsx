import React from 'react';
import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  useColorModeValue,
  Button,
  Link as ChakraLink,
  Icon,
} from '@chakra-ui/react';
import { FaHeart } from 'react-icons/fa';

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

  return (
    <Box
      bg={cardBg}
      p={{ base: 4, md: 6 }}
      borderRadius="lg"
      borderWidth="1px"
      borderColor={borderColor}
      boxShadow={useColorModeValue('sm', 'md')}
    >
      <VStack spacing={4} align="center">
        <HStack spacing={3}>
          <Icon as={FaHeart} boxSize={7} color={useColorModeValue('pink.500', 'pink.400')} />
          <Heading 
            fontSize={{ base: "xl", md: "2xl" }} 
            color={textColor} 
            textAlign="center"
            fontWeight="700"
            letterSpacing="tight"
          >
            Support EIPsInsight
          </Heading>
        </HStack>
        <Text color={textColor} fontSize="sm" textAlign="center">
          We welcome contributions, partnerships, and funding opportunities.
        </Text>
        <HStack spacing={2} flexWrap="wrap" justify="center">
          <Button
            as={ChakraLink}
            href="https://github.com/AvarchLLC/EIPsInsight"
            target="_blank"
            rel="noopener noreferrer"
            size="sm"
            colorScheme="blue"
            variant="outline"
          >
            GitHub
          </Button>
          <Button
            as={ChakraLink}
            href="mailto:team@avarch.org"
            size="sm"
            colorScheme="blue"
          >
            Contact
          </Button>
          <Button
            as={ChakraLink}
            href="https://discord.gg/tUXgfV822C"
            target="_blank"
            rel="noopener noreferrer"
            size="sm"
            colorScheme="blue"
            variant="outline"
          >
            Discord
          </Button>
          <Button
            as={ChakraLink}
            href="/donate"
            size="sm"
            colorScheme="pink"
            variant="outline"
          >
            Donate
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
}