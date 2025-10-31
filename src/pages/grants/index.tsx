import React from 'react'
import {
  Container,
  SimpleGrid,
  Heading,
  Text,
  Box,
  HStack,
  Button,
  Tag,
  VStack,
  Link as ChakraLink,
} from '@chakra-ui/react'
import GrantCard from '@/components/GrantCard'
import NextLink from 'next/link'

const grants = [
  {
    id: 'gg18-core',
    title: 'GG18 Core',
    tags: ['Community', 'Gitcoin', 'Network', 'Optimism'],
    amount: '$248',
    startDate: 'Aug 1, 2023',
    overview: '',
    milestones: 'Completed',
    impact: 'Projects aligned with Gitcoin DAO mission; community impact and sustainability.',
    description: '',
    // Logo placed in public/ as provided by user
    logo: '/Gitcoin-logo-.jpg',
  },
  {
    id: 'asia-round',
    title: 'Asia Round (GG21 Asia Round)',
    tags: ['Community', 'Gitcoin', 'Network', 'Optimism'],
    amount: '$57.22',
    startDate: 'Aug 7, 2024',
    overview: '',
    milestones: 'Completed',
    impact: 'Focus on inclusion across Asian languages and developer communities.',
    description: '',
    // use Gitcoin branding if needed (file available as GitCoinLogo.png)
    // use Gitcoin branding (prefer the provided Gitcoin-logo-.jpg file)
    logo: '/Gitcoin-logo-.jpg',
  },
  {
    id: 'octant',
    title: 'Octant',
    tags: ['OSS', 'Infrastructure'],
    amount: '',
    startDate: '',
    overview: '',
    milestones: 'Completed',
    impact: 'Web3 infra improvements and open-source tooling.',
    description: '',
    logo: '/octant.png',
  },
  {
    id: 'esp',
  title: 'Ecosystem Support Program (ESP)',
    tags: ['ESP'],
    amount: '$20,000 (Awarded)',
    startDate: '',
    overview: '',
    milestones: 'Completed',
    impact:
      'Funds help maintain data pipelines, improve charts and analytics, and keep EIPsInsight open-source and community driven.',
    description: '',
    // Prefer ESP-specific logo if present; fall back to EF.png
    logo: '/EF-ESP-logo-white-text.svg',
    awarded: true,
    externalLink: 'https://esp.ethereum.org/'
  },
]

const GrantsPage = () => {
  return (
    <Container maxW="7xl" py={10}>
      <VStack spacing={4} align="start" mb={6}>
        <Heading>EIPsInsight — Grants</Heading>
        <Text color="gray.600">
          EIPsInsight gratefully acknowledges funding that keeps this project
          running. Below are active rounds, awarded grants, and opportunities.
        </Text>
        {/* ESP will be shown inline in the grants grid below (logo + Awarded tag) */}
      </VStack>

      <SimpleGrid columns={[1, 2]} spacing={6}>
        {grants.map((g) => (
          <GrantCard key={g.id} grant={g} />
        ))}
      </SimpleGrid>

      <Box mt={8}>
        <Heading size="md" mb={3}>
          How to apply / contribute
        </Heading>
        <Text color="gray.600" mb={3}>
          If you'd like to propose a feature, request funding, or collaborate on
          data improvements, please open an issue on our GitHub repository or
          reach out to the team via the contact links in the footer.
        </Text>
        <HStack spacing={3}>
          <Button
            as={NextLink}
            href="https://github.com/AyuShetty/EIPsInsight/issues"
            target="_blank"
            rel="noopener noreferrer"
            colorScheme="teal"
          >
            Open a GitHub issue
          </Button>
          <Button as={ChakraLink} href="mailto:hello@eipsinsight.org">
            Contact team
          </Button>
        </HStack>
      </Box>
    </Container>
  )
}

export default GrantsPage
