import React from 'react';
import {
  Box,
  Heading,
  Text,
  Grid,
  GridItem,
  VStack,
  Icon,
  SimpleGrid,
  useColorModeValue,
  Button,
  HStack,
  Image,
  Stack,
  Tooltip,
  Flex,
  Container,
} from '@chakra-ui/react';
import { FaHeart } from 'react-icons/fa';

export default function AboutFunding() {
  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.700', 'gray.200');
  const linkColor = useColorModeValue('blue.500', 'blue.300');
  const logoSrc = useColorModeValue('/EF-ESP-logo.svg','/EF-ESP-logo-white-text.svg');
  // donation UI removed for now — channels are informational until live

  return (
    <Box as="section" py={{ base: 6, md: 12 }}>
      <Box maxW="7xl" mx="auto" px={{ base: 4, md: 6 }}>
        <Box
          bg={cardBg}
          borderRadius="xl"
          p={{ base: 4, md: 8 }}
          border={useColorModeValue('1px solid rgba(2,6,23,0.04)','1px solid rgba(255,255,255,0.04)')}
          boxShadow={useColorModeValue('0 6px 18px rgba(2,6,23,0.03)','0 8px 24px rgba(2,6,23,0.6)')}
          style={{ backdropFilter: useColorModeValue('','saturate(180%) blur(6px)') }}
          transition="transform 180ms, box-shadow 180ms"
        >
          <Grid templateColumns={{ base: '1fr', md: '3fr 1fr' }} gap={6} alignItems="flex-start">
            <GridItem>
              <VStack align="start" spacing={4}>
                <Heading as="h2" size="lg" color={textColor}>Funding</Heading>
                <Text color={textColor} fontSize="md" maxW={{ md: '60ch' }}>
                  EIPs Insight is an open-source public good. We receive support from grants and community sponsors for hosting, development, and outreach. Below are organizations that have supported the project.
                </Text>
                <Box width="100%">
                  <Text fontSize="sm" fontWeight="600" color={textColor} mb={3}>Supported by</Text>
                  <Box bg={useColorModeValue('gray.50','transparent')} p={3} borderRadius="md" border={useColorModeValue('1px solid rgba(2,6,23,0.03)','1px solid rgba(255,255,255,0.02)')}>
                    <SimpleGrid columns={{ base: 1, sm: 3 }} spacing={4} alignItems="center">
                      <Box textAlign="center">
                        <a href="https://ethereum.org/" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', cursor: 'pointer' }}>
                          <Image src={logoSrc} alt="Ecosystem Support Program" h={{ base: 10, md: 14 }} mx="auto" transition="transform 160ms" _hover={{ transform: 'translateY(-4px)' }} />
                        </a>
                        <Text fontSize="xs" color={useColorModeValue('gray.600','gray.400')} mt={2}>Ecosystem Support</Text>
                      </Box>

                      <Box textAlign="center">
                        <a href="https://octant.app/" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', cursor: 'pointer' }}>
                          <Image src="/octant.png" alt="Octant" h={{ base: 10, md: 14 }} mx="auto" />
                        </a>
                        <Text fontSize="xs" color={useColorModeValue('gray.600','gray.400')} mt={2}>Octant</Text>
                      </Box>

                      <Box textAlign="center">
                        <a href="https://gitcoin.co/" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', cursor: 'pointer' }}>
                          <Image src="/Gitcoin-logo-.jpg" alt="Gitcoin" h={{ base: 10, md: 14 }} mx="auto" />
                        </a>
                        <Text fontSize="xs" color={useColorModeValue('gray.600','gray.400')} mt={2}>Gitcoin</Text>
                      </Box>
                    </SimpleGrid>
                  </Box>

                  <Box mt={4}>
                    <Text fontSize="sm" color={textColor}>Interested in supporting the project? <a href="/contact" style={{ color: linkColor }}>Become a sponsor</a> or open a discussion on GitHub.</Text>
                  </Box>
                </Box>
              </VStack>
            </GridItem>

            <GridItem>
              <Box p={4} borderRadius="md" bg={useColorModeValue('gray.50','transparent')} border={useColorModeValue('1px solid rgba(2,6,23,0.03)','1px solid rgba(255,255,255,0.02)')}>
                <Stack spacing={3} align="stretch">
                  <Flex align="center" justify="space-between">
                    <Text fontWeight="600">Support & Acknowledgements</Text>
                    <Tooltip label="Organizations and community supporters" aria-label="Supported by tooltip">
                      <Icon as={FaHeart} color="red.400" />
                    </Tooltip>
                  </Flex>

                  <Text color={textColor} fontSize="sm">We are grateful to the organizations and community members who have supported EIPs Insight. The logos above acknowledge past and present support.</Text>

                  <VStack spacing={2} pt={2}>
                    <a href="https://gap.karmahq.xyz/project/eipsinsight" target="_blank" rel="noopener noreferrer" style={{ width: '100%' }}>
                      <Button variant="outline" width="100%" _hover={{ transform: 'translateY(-3px)' }} transition="transform 150ms">
                        <Image src="/logos/karma.svg" alt="karma" boxSize="18px" mr={3} />
                        Karma (project page)
                      </Button>
                    </a>
                    <a href="https://giveth.io/project/eipsinsight" target="_blank" rel="noopener noreferrer" style={{ width: '100%' }}>
                      <Button colorScheme="green" width="100%" _hover={{ transform: 'translateY(-3px)' }} transition="transform 150ms">
                        <Image src="/logos/giveth.svg" alt="giveth" boxSize="18px" mr={3} />
                        Donate via Giveth
                      </Button>
                    </a>
                    <a href="https://discuss.octant.app/t/eipsinsight-analytics-for-ethereum-improvement-proposals/659" target="_blank" rel="noopener noreferrer" style={{ width: '100%' }}>
                      <Button colorScheme="cyan" width="100%" _hover={{ transform: 'translateY(-3px)' }} transition="transform 150ms">
                        <Image src="/logos/octant.svg" alt="octant" boxSize="18px" mr={3} />
                        Octant discussion
                      </Button>
                    </a>
                  </VStack>

                  <Text fontSize="xs" color={useColorModeValue('gray.600','gray.400')}>Note: Karma shows project details and past funding; it is informational, not a direct payment checkout.</Text>
                </Stack>
              </Box>
            </GridItem>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
}

