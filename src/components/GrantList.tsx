import React from 'react';
import {
  Box,
  VStack,
  SimpleGrid,
  HStack,
  Image,
  Text,
  Badge,
  Tag,
  Button,
  Link as ChakraLink,
  useColorModeValue,
  Heading,
  Icon,
} from '@chakra-ui/react';
import { FaExternalLinkAlt, FaAward } from 'react-icons/fa';
import NLink from 'next/link';

type Grant = {
  id: string;
  title: string;
  organization: string;
  amount?: string;
  status?: string;
  startDate?: string;
  impact?: string;
  logo?: string;
  logoWhite?: string;
  tags: string[];
  link?: string;
};

const grants: Grant[] = [
  {
    id: 'ef-esp',
    title: 'EF ESP Allocation Q2 2025',
    organization: 'Ecosystem Support Program',
    amount: '$20,000',
    status: 'Awarded',
    startDate: '2024',
    impact:
      'Funds help maintain data pipelines, improve charts and analytics, and keep EIPsInsight open-source and community driven.',
    logo: '/EF-ESP-logo.svg',
    logoWhite: '/EF-ESP-logo-white-text.svg',
    link: 'https://blog.ethereum.org/2025/07/23/allocation-q2-25',
    tags: ['Infrastructure', 'Open Source'],
  },
  {
    id: 'gg23',
    title: 'Gitcoin Grants Round 23 (GG23)',
    organization: 'Gitcoin',
    amount: '$220.14',
    status: 'Completed',
    startDate: '2024',
    impact:
      'Community contribution received through Gitcoin Grants Round 23 to support continued open-source development and maintenance.',
    logo: '/Gitcoin-logo-.jpg',
    tags: ['Community'],
    link: 'https://docs.google.com/spreadsheets/d/1v7eYS2MZtUZ4VeubQ4rN4ZNeWbFc2Os2xjNAmOOHcmg/edit?gid=0#gid=0',
  },
  {
    id: 'asia-round',
    title: 'Gitcoin Grants Round 21 (Asia)',
    organization: 'Gitcoin',
    amount: '$57.22',
    status: 'Completed',
    startDate: 'Aug 7, 2024',
    impact:
      "This round (Gitcoin Grants Round 21) is the 21st round of donations for Gitcoin, focusing on ecosystem and community-driven initiatives.",
    logo: '/Gitcoin-logo-.jpg',
    tags: ['Community', 'Asia', 'Inclusion'],
  },
  {
    id: 'gg18-core',
    title: 'Gitcoin Grants Round 18 (Core)',
    organization: 'Gitcoin',
    amount: '$248',
    status: 'Completed',
    startDate: 'Aug 1, 2023',
    impact:
      'Gitcoin Grants Round 18 (Core) covers four core categories: Web3 Open Source Software, Web3 Community & Education, Climate Solutions, and Ethereum infrastructure.',
    logo: '/Gitcoin-logo-.jpg',
    tags: ['Community', 'Network'],
  },
];

const getTier = (amountStr?: string) => {
  if (!amountStr) return 'Community';
  const numeric = parseFloat(amountStr.replace(/[^0-9.]/g, ''));
  if (Number.isNaN(numeric)) return 'Community';
  // Updated thresholds: Significant >= $20,000; Moderate >= $2,000; Small < $2,000
  if (numeric >= 20000) return 'Significant';
  if (numeric >= 2000) return 'Moderate';
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

export default function GrantList() {
  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.700', 'gray.300');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Box
      bg={cardBg}
      p={{ base: 4, md: 6 }}
      borderRadius="lg"
      borderWidth="1px"
      borderColor={borderColor}
      boxShadow={useColorModeValue('sm', 'md')}
    >
      <HStack spacing={3} mb={6}>
        <Icon as={FaAward} boxSize={8} color={useColorModeValue('purple.500', 'purple.400')} />
        <Heading 
          as="h2" 
          fontSize={{ base: "2xl", md: "3xl" }} 
          color={textColor}
          fontWeight="800"
          letterSpacing="tight"
        >
          Grants & Funding
        </Heading>
      </HStack>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={3}>
        {grants.map((grant) => (
          <Box
            key={grant.id}
            bg={useColorModeValue('white', 'gray.700')}
            p={4}
            borderRadius="md"
            borderWidth="1px"
            borderColor={borderColor}
            boxShadow={useColorModeValue('sm', 'md')}
            transition="all 0.2s ease"
            _hover={{
              boxShadow: useColorModeValue('md', 'lg'),
              borderColor: useColorModeValue('blue.400', 'blue.500'),
            }}
          >
            <VStack align="start" spacing={3}>
              <HStack justify="space-between" w="full">
                <HStack spacing={2}>
                  {grant.logo && <Image src={grant.logo} alt={grant.organization} h={8} objectFit="contain" />}
                  <Text fontSize="md" fontWeight="600" color={textColor}>
                    {grant.organization}
                  </Text>
                </HStack>
                {
                  (() => {
                    const tier = getTier(grant.amount);
                    if (tier === 'Significant' || tier === 'Small') {
                      return (
                        <ChakraLink as={NLink} href="/donate" _hover={{ textDecoration: 'none' }}>
                          <Badge as="span" colorScheme={tierColor(tier)} variant="subtle" px={3} py={1} cursor="pointer">
                            {tier}
                          </Badge>
                        </ChakraLink>
                      );
                    }
                    return (
                      <Badge colorScheme={tierColor(tier)} variant="subtle">
                        {tier}
                      </Badge>
                    );
                  })()
                }
              </HStack>

              <Text fontSize="sm" fontWeight="600" color={textColor}>
                {grant.title}
              </Text>
              {grant.impact && (
                <Text fontSize="xs" color={textColor} lineHeight="short" noOfLines={3}>
                  {grant.impact}
                </Text>
              )}
              <HStack spacing={1} flexWrap="wrap">
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
                  size="xs"
                  variant="outline"
                  colorScheme="blue"
                  rightIcon={<FaExternalLinkAlt size={10} />}
                  w="full"
                >
                  Learn More
                </Button>
              )}
            </VStack>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
}
