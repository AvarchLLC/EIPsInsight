import React, { useState } from 'react';
import Head from 'next/head';
import NextLink from 'next/link';

import {
  Flex,
  Icon,
  Heading,
  Text,
  Link as ChakraLink,
  HStack,
  Badge,
  Grid,
  GridItem,
  Box,
  Tag,
  Tooltip,
  useColorModeValue,
  IconButton,
  Collapse,
  Stack,
  Button,
  Container,
  VStack,
  SimpleGrid,
  Divider,
  useClipboard,
  InputGroup,
  Input,
  InputRightElement,
  Image,
} from '@chakra-ui/react';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import { FaHeart, FaRegCopy, FaInfoCircle, FaEthereum, FaShieldAlt, FaUsers, FaRocket, FaAward, FaHandshake, FaCodeBranch } from 'react-icons/fa';
import Partners from '@/components/Partners';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// --- Types ---
// ...existing code...

// ...existing code...

// Hero Section (reduced vertical space)
const DonateHero: React.FC = () => (
  <Flex
    direction="column"
    align="center"
    justify="center"
    minH="180px"
    bgGradient="linear(to-r, #6a93f7, #7b4fc9)"
    color="white"
    px={{ base: 4, md: 0 }}
    py={{ base: 6, md: 8 }}
  >
    <Icon as={FaHeart} boxSize={8} color="pink.300" mb={2} />
    <Heading as="h1" size="xl" fontWeight="bold" mb={1}>
      Support EIPs Insight
    </Heading>
    <Text fontSize="md" maxW="2xl" textAlign="center" mb={2}>
      Your contributions help maintain open-source analytics for Ethereum Improvement Proposals, keeping the ecosystem transparent and accessible for everyone.
    </Text>
    <HStack spacing={2}>
      <Badge px={2} py={0.5} colorScheme="pink" fontWeight="semibold" fontSize="sm">
        <Icon as={FaUsers} mr={1} /> COMMUNITY DRIVEN
      </Badge>
      <Badge px={2} py={0.5} colorScheme="blue" fontWeight="semibold" fontSize="sm">
        <Icon as={FaCodeBranch} mr={1} /> OPEN SOURCE
      </Badge>
    </HStack>
  </Flex>
);

// ...existing code...

// --- Types ---
type FundingLink = { label: string; url: string };
type FundingData = {
  source: string;
  program: string;
  tier: string;
  amount: string;
  currency: string;
  year: string;
  type: string;
  restriction: string;
  status: string;
  links: FundingLink[];
  impact: string;
  proof: string[];
};

// --- Sample data ---
const fundingData: FundingData[] = [
  {
    source: 'Ethereum Foundation',
    program: 'EF ESP Allocation Q2 2025',
    tier: 'Significant',
    amount: 'N/A',
    currency: 'USD',
    year: '2025',
    type: 'Infrastructure',
    restriction: 'Open Source',
    status: 'Completed',
    links: [
      { label: 'ESP Announcement', url: 'https://blog.ethereum.org/2025/07/23/allocation-q2-25' }
    ],
    impact: 'Funds help maintain data pipelines, improve charts and analytics, and keep EIPsInsight open-source and community driven.',
    proof: ['Significant'],
  },
  {
    source: 'Gitcoin',
    program: 'Gitcoin Grants Round 23 (GG23)',
    tier: 'Small',
    amount: 'N/A',
    currency: 'USD',
    year: '2025',
    type: 'Community',
    restriction: 'Open Source',
    status: 'Completed',
    links: [
      { label: 'GG23 Announcement', url: 'https://docs.google.com/spreadsheets/d/1v7eYS2MZtUZ4VeubQ4rN4ZNeWbFc2Os2xjNAmOOHcmg/edit?gid=0#gid=0' }
    ],
    impact: 'Community contribution received through Gitcoin Grants Round 23 to support continued open-source development and maintenance.',
    proof: ['Small'],
  },
  {
    source: 'Gitcoin',
    program: 'Gitcoin Grants Round 21 (Asia)',
    tier: 'Small',
    amount: 'N/A',
    currency: 'USD',
    year: '2024',
    type: 'Community',
    restriction: 'Asia, Inclusion',
    status: 'Completed',
    links: [
      { label: 'GG21 Asia Announcement', url: 'https://gap.karmahq.xyz/project/eipsinsight/funding/0xa2fbabfd41c8a58fc9c9530f71d6db265ec280bb1574dd1baf8252d5d5f170fd/milestones-and-updates' }
    ],
    impact: 'This round (Gitcoin Grants Round 21) is the 21st round of donations for Gitcoin, focusing on ecosystem and community-driven initiatives.',
    proof: ['Small'],
  },
  {
    source: 'Gitcoin',
    program: 'Gitcoin Grants Round 18 (Core)',
    tier: 'Small',
    amount: 'N/A',
    currency: 'USD',
    year: '2023',
    type: 'Community',
    restriction: 'Community Impact',
    status: 'Completed',
    links: [
      { label: 'GG18 Core Announcement', url: 'https://gap.karmahq.xyz/project/eipsinsight/funding/0xa2fbabfd41c8a58fc9c9530f71d6db265ec280bb1574dd1baf8252d5d5f170fd/milestones-and-updates' }
    ],
    impact: 'Gitcoin Grants Round 18 (Core) covers four core categories: Web3 Open Source Software, Web3 Community & Education, Climate Solutions, and Ethereum infrastructure.',
    proof: ['Small'],
  },
];

const tierLegend = [
  { label: 'Significant', range: 'Above $15,000', color: 'purple', tooltip: 'Significant support, updated annually.' },
  { label: 'Major', range: '$8,000–$15,000', color: 'blue', tooltip: 'Major grants, updated annually.' },
  { label: 'Standard', range: '$2,000–$8,000', color: 'green', tooltip: 'Standard support, updated quarterly.' },
  { label: 'Micro', range: 'Below $2,000', color: 'gray', tooltip: 'Micro contributions, updated monthly.' },
];

// --- Components ---
function TierLegend() {
  return (
    <Box w="full">
      <Text
        fontSize="lg"
        fontWeight="semibold"
        mb={3}
        color={useColorModeValue('gray.800', 'gray.100')}
        textAlign="left"
      >
        Funding Tiers
      </Text>
      <HStack spacing={3} align="center" wrap="wrap">
        {tierLegend.map((t) => (
          <Tooltip key={t.label} label={t.tooltip} hasArrow placement="top">
            <Tag
              size="md"
              colorScheme={t.color}
              borderRadius="full"
              px={3}
              py={1}
              display="flex"
              alignItems="center"
              gap={2}
            >
              <Box boxSize="14px" bg={useColorModeValue('gray.200', 'gray.700')} borderRadius="full" />
              <Box fontSize="sm" fontWeight="semibold">{t.label}</Box>
              <Box as="span" fontSize="xs" color={useColorModeValue('gray.600', 'gray.400')} ml={2}>
                {t.range}
              </Box>
            </Tag>
          </Tooltip>
        ))}
      </HStack>
    </Box>
  );
}


// Funding/Grant Card (reusable for each program)
function FundingProgramCard({ title, significance, rounds, badgeColor, icon, className }: {
  title: string;
  significance: string;
  rounds: Array<{ round: string; year: string; description: string; tags?: string[]; link?: string }>;
  badgeColor: string;
  icon?: any;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <Box
      bg={useColorModeValue('white', 'gray.900')}
      p={{ base: 4, md: 6 }}
      borderRadius="lg"
      boxShadow="sm"
      border="1px solid"
      borderColor={useColorModeValue('gray.200', 'gray.700')}
      transition="all 0.2s"
      _hover={{ transform: 'translateY(-2px)', boxShadow: 'md' }}
      mb={4}
      w="full"
      className={`funding-program-card ${className || ''}`}
    >
      <Flex align="center" justify="space-between" mb={2} className="card-header">
        <Flex align="center" gap={3}>
          <HStack spacing={3} align="center">
            <Heading as="h4" size="md" mb={0} className="program-title" textAlign="left">{title}</Heading>
            <Tag
              colorScheme={badgeColor}
              borderRadius="full"
              px={3}
              py={1}
              fontWeight="semibold"
              fontSize="xs"
              className="significance-badge"
            >
              {significance}
            </Tag>
          </HStack>
        </Flex>

        <IconButton
          aria-label={open ? 'Collapse details' : 'Expand details'}
          icon={open ? <ChevronUpIcon /> : <ChevronDownIcon />}
          onClick={() => setOpen((v) => !v)}
          variant="ghost"
          size="sm"
          rounded="full"
          colorScheme={badgeColor}
          _hover={{ bg: `${badgeColor}.50` }}
          className="toggle-arrow"
        />
      </Flex>

      <Collapse in={open} animateOpacity className="card-body">
        <Stack spacing={4} align="start" mt={4}>
          {rounds.map((grant, idx) => (
            <Box key={idx} py={2} px={0} w="full" className="grant-round">
              <Box>
                <HStack justify="space-between" w="full" align="start">
                  <Text fontWeight="semibold" fontSize="md" color={useColorModeValue('gray.800', 'gray.100')} className="grant-title">{grant.round}</Text>
                  <Badge colorScheme="blue" px={2} py={0.5} borderRadius="full" fontSize="xs" className="grant-year">{grant.year}</Badge>
                </HStack>
                <Text fontSize="sm" color={useColorModeValue('gray.700', 'gray.300')} mt={2} lineHeight="1.5" className="grant-description">{grant.description}</Text>
                {grant.tags && (
                  <HStack spacing={2} mt={2} className="grant-tags">
                    {grant.tags.map((tag, i) => (
                      <Tag key={i} colorScheme="blue" size="sm" borderRadius="full" px={2} py={0.5}>{tag}</Tag>
                    ))}
                  </HStack>
                )}
                {grant.link && (
                  <Box mt={3}>
                    <ChakraLink href={grant.link} isExternal _hover={{ textDecoration: 'none' }}>
                      <Button as="span" size="sm" variant="outline" colorScheme="blue" rounded="md">View Details</Button>
                    </ChakraLink>
                  </Box>
                )}
              </Box>
            </Box>
          ))}
        </Stack>
      </Collapse>
    </Box>
  );
}

export default function DonatePage(): JSX.Element {
  const cardBg = useColorModeValue('white', '#1f2937');
  const sectionBg = useColorModeValue('gray.50', 'gray.900');
  const textColor = useColorModeValue('gray.800', 'gray.100');
  const accent = useColorModeValue('#30A0E0', '#4FD1FF');
  const borderColor = useColorModeValue('blue.100', 'blue.400');
  const gradientBg = useColorModeValue(
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #2d3748 0%, #1a202c 100%)'
  );

  const address = '0x2A505a987cB41A2e2c235D851e3d74Fa24206229';
  const { hasCopied, onCopy } = useClipboard(address);
  const [selectedNetwork, setSelectedNetwork] = useState('Ethereum');

  const networks = [
    { name: 'Ethereum', tip: 'Mainnet, ERC-20 compatible', icon: FaEthereum },
  ];

  return (
    <>
      <Head>
        <title>Donate, EIPs Insight</title>
        <meta name="description" content="Support EIPsInsight, open-source analytics for EIPs, ERCs and RIPs." />
      </Head>

      <Navbar />

      {/* Hero Section */}
      <Box
        bg={gradientBg}
        color="white"
        py={{ base: 1, md: 2 }}
        px={{ base: 0, md: 1 }}
        position="relative"
        overflow="hidden"
      >
        <Container maxW="6xl" position="relative" zIndex={1}>
          <VStack spacing={1} textAlign="center">
            <Icon as={FaHeart} boxSize={{ base: 6, md: 8 }} color="pink.300" />
            <Heading
              as="h1"
              size={{ base: "md", md: "lg" }}
              fontWeight="bold"
              lineHeight="1.05"
              mb={0}
            >
              Support EIPs Insight
            </Heading>
            <Text
              fontSize={{ base: "sm", md: "md" }}
              maxW="xl"
              opacity={0.9}
              lineHeight="1.3"
              mb={0}
            >
              Your contributions help maintain open-source analytics for Ethereum Improvement Proposals,
              keeping the ecosystem transparent and accessible for everyone.
            </Text>
            <HStack spacing={1} pt={1}>
              <Badge colorScheme="pink" px={1.5} py={0.5} borderRadius="full" fontSize="xs">
                <Icon as={FaUsers} mr={0.5} />
                Community Driven
              </Badge>
              <Badge colorScheme="blue" px={1.5} py={0.5} borderRadius="full" fontSize="xs">
                <Icon as={FaShieldAlt} mr={0.5} />
                Open Source
              </Badge>
            </HStack>
          </VStack>
        </Container>
      </Box>

  <Box as="main" py={{ base: 2, md: 4 }} px={{ base: 1, md: 2 }} bg={sectionBg}>
        <Container maxW="6xl" px={0}>
          <Stack spacing={3}>
            {/* Donation Section */}
            <Container maxW="6xl" px={0} py={1}
              bg={cardBg}
              borderRadius="xl"
              border="1px solid"
              borderColor={useColorModeValue('gray.200', 'gray.700')}
              boxShadow="md"
              p={{ base: 2, md: 3 }}
              mb={0.5}
            >
              <Box
                bg={useColorModeValue('gray.100', 'gray.800')}
                borderRadius="md"
                p={4}
                w="full"
                display="flex"
                flexDirection="column"
                alignItems="stretch"
                gap={4}
              >
                <Heading as="h2" size="lg" color={accent} mb={2} textAlign="left">
                  Donate Crypto
                </Heading>
                <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={4} w="full">
                  <Box
                    bg={cardBg}
                    p={{ base: 3, md: 4 }}
                    borderRadius="xl"
                    boxShadow="md"
                    border="none"
                    transition="all 0.3s"
                    _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
                  >
                    <VStack spacing={3} align="stretch">
                      <HStack spacing={3} align="center">
                        <Icon as={FaHeart} color="pink.400" boxSize={7} />
                        <Heading as="h3" size="lg" color={accent}>
                          Send Crypto
                        </Heading>
                      </HStack>
                      <Text color={textColor} lineHeight="1.6">
                        Your support keeps EIPs Insight free, open-source, and continuously improved.
                        Funds are used for infrastructure, data pipelines, and community features.
                      </Text>
                      <Divider />
                      <Box>
                        <Text fontWeight="semibold" mb={3} color={textColor}>
                          Select Network
                        </Text>
                        <SimpleGrid columns={{ base: 2, md: 4 }} spacing={3}>
                          {networks.map((net) => (
                            <Tooltip key={net.name} label={net.tip} hasArrow>
                              <Button
                                size="md"
                                rounded="xl"
                                variant={selectedNetwork === net.name ? 'solid' : 'outline'}
                                colorScheme="blue"
                                onClick={() => setSelectedNetwork(net.name)}
                                leftIcon={<Icon as={net.icon} />}
                                _hover={{ transform: 'scale(1.05)' }}
                                transition="all 0.2s"
                              >
                                {net.name}
                              </Button>
                            </Tooltip>
                          ))}
                        </SimpleGrid>
                      </Box>
                      <Box>
                        <Text fontWeight="semibold" mb={3} color={textColor}>
                          Wallet Address
                        </Text>
                        <InputGroup size="lg" borderRadius="xl" boxShadow="sm">
                          <Input
                            value={address}
                            isReadOnly
                            fontFamily="mono"
                            fontSize="sm"
                            border="1px solid"
                            borderColor={useColorModeValue('gray.300', 'gray.600')}
                            bg={useColorModeValue('gray.50', 'gray.800')}
                            px={4}
                            py={3}
                            _focus={{ borderColor: accent }}
                          />
                          <InputRightElement width="4.5rem">
                            <Tooltip label={hasCopied ? 'Copied!' : 'Copy address'} hasArrow>
                              <IconButton
                                aria-label="Copy address"
                                icon={<FaRegCopy />}
                                onClick={onCopy}
                                size="md"
                                rounded="xl"
                                variant="solid"
                                colorScheme={hasCopied ? 'green' : 'blue'}
                                _hover={{ transform: 'scale(1.1)' }}
                                transition="all 0.2s"
                              />
                            </Tooltip>
                          </InputRightElement>
                        </InputGroup>
                        <Text fontSize="xs" color="gray.500" mt={2}>
                          All networks use the same address — please confirm network/token compatibility before sending.
                        </Text>
                      </Box>
                    </VStack>
                  </Box>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    bg={cardBg}
                    p={{ base: 3, md: 4 }}
                    borderRadius="xl"
                    boxShadow="md"
                    border="none"
                    transition="all 0.3s"
                    _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
                  >
                    <VStack spacing={2} textAlign="center">
                      <Heading as="h3" size="lg" color={accent}>
                        Scan to Donate
                      </Heading>
                      <Box
                        p={4}
                        bg={useColorModeValue('gray.50', 'gray.800')}
                        borderRadius="xl"
                        border="2px solid"
                        borderColor={borderColor}
                      >
                        <Image
                          src="/qr.png"
                          alt="QR Code"
                          boxSize={{ base: '200px', md: '240px' }}
                          objectFit="contain"
                        />
                      </Box>
                      <VStack spacing={2}>
                        <Text fontFamily="mono" fontSize="sm" color={textColor} fontWeight="semibold">
                          {address}
                        </Text>
                        <Badge colorScheme="blue" px={3} py={1} borderRadius="full" fontSize="sm">
                          {selectedNetwork}
                        </Badge>
                      </VStack>
                    </VStack>
                  </Box>
                </SimpleGrid>
              </Box>
            </Container>

            {/* Partners Section */}
            <Container maxW="6xl" px={0} py={1}
              bg={cardBg}
              borderRadius="xl"
              border="1px solid"
              borderColor={useColorModeValue('gray.200', 'gray.700')}
              boxShadow="md"
              p={{ base: 2, md: 3 }}
              mb={0.5}
            >
              <Box
                bg={useColorModeValue('gray.100', 'gray.800')}
                borderRadius="md"
                p={4}
                w="full"
                display="flex"
                flexDirection="column"
                alignItems="stretch"
                gap={4}
              >
                <HStack align="center" spacing={3}>
                  <Icon as={FaHandshake} color={accent} boxSize={8} />
                  <Heading as="h2" size="lg" color={accent} mb={0}>
                    Our Partners
                  </Heading>
                </HStack>
                <Text fontSize="md" color={textColor} maxW="3xl">
                  EIPs Insight is supported by a growing community of organizations and contributors who share our vision for transparent and accessible Ethereum governance.
                </Text>
                <Box w="full">
                  <Partners />
                </Box>
              </Box>
            </Container>

            {/* Funding & Support Section */}
            <Container maxW="6xl" px={0} py={1}
              bg={cardBg}
              borderRadius="xl"
              border="1px solid"
              borderColor={useColorModeValue('gray.200', 'gray.700')}
              boxShadow="md"
              p={{ base: 2, md: 3 }}
              mb={0.5}
            >
              <Box
                bg={useColorModeValue('gray.100', 'gray.800')}
                borderRadius="md"
                p={4}
                w="full"
                display="flex"
                flexDirection="column"
                alignItems="stretch"
                gap={4}
              >
                <Heading as="h2" size="lg" color={accent} mb={1}>
                  Funding & Support
                </Heading>
                <Text fontSize="md" color={textColor} maxW="3xl" mb={1}>
                  We transparently publish every material contribution that sustains our public-goods work. Your support enables us to maintain and improve EIPs Insight for the entire community.
                </Text>
                <Box w="full" mb={1}>
                  <TierLegend />
                </Box>
                <Box w="full">
                  <FundingProgramCard
                    title="Ecosystem Support program"
                    significance="Significant"
                    badgeColor="purple"
                    icon={FaRocket}
                    rounds={[{
                      round: 'EF ESP Allocation Q2 2025',
                      year: '2025',
                      description: 'Funds help maintain data pipelines, improve charts and analytics, and keep EIPsInsight open-source and community driven.',
                      tags: ['Infrastructure', 'Open Source'],
                      link: 'https://blog.ethereum.org/2025/07/23/allocation-q2-25',
                    }]}
                    className="ef-esp-card"
                  />
                </Box>
                <Box w="full">
                  <FundingProgramCard
                    title="Gitcoin Grants Program"
                    significance="Small"
                    badgeColor="gray"
                    icon={FaUsers}
                    rounds={[
                      {
                        round: 'Gitcoin Grants Round 23 (GG23)',
                        year: '2025',
                        description: 'Community contribution received through Gitcoin Grants Round 23 to support continued open-source development and maintenance.',
                        link: 'https://docs.google.com/spreadsheets/d/1v7eYS2MZtUZ4VeubQ4rN4ZNeWbFc2Os2xjNAmOOHcmg/edit?gid=0#gid=0',
                      },
                      {
                        round: 'Gitcoin Grants Round 21 (Asia)',
                        year: '2024',
                        description: 'This round (Gitcoin Grants Round 21) is the 21st round of donations for Gitcoin, focusing on ecosystem and community-driven initiatives.',
                        link: 'https://gap.karmahq.xyz/project/eipsinsight/funding/0xa2fbabfd41c8a58fc9c9530f71d6db265ec280bb1574dd1baf8252d5d5f170fd/milestones-and-updates',
                      },
                      {
                        round: 'Gitcoin Grants Round 18 (Core)',
                        year: '2023',
                        description: 'Gitcoin Grants Round 18 (Core) covers four core categories: Web3 Open Source Software, Web3 Community & Education, Climate Solutions, and Ethereum infrastructure.',
                        link: 'https://gap.karmahq.xyz/project/eipsinsight/funding/0xa2fbabfd41c8a58fc9c9530f71d6db265ec280bb1574dd1baf8252d5d5f170fd/milestones-and-updates',
                      },
                    ]}
                    className="gitcoin-grants-card"
                  />
                </Box>
              </Box>
            </Container>
          </Stack>
        </Container>
      </Box>

      {/* Footer */}
      <Box mt={8}>
        <Footer />
      </Box>
    </>
  );
}
