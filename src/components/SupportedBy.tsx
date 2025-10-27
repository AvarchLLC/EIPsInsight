import React from 'react';
import {
  Box,
  Text,
  SimpleGrid,
  Image,
  useColorModeValue,
  Container,
} from '@chakra-ui/react';
import Header from './Header';

export default function SupportedBy() {
  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.700', 'gray.200');
  const logoSrc = useColorModeValue('/EF-ESP-logo.svg', '/EF-ESP-logo-white-text.svg');

  return (
    <Box as="section" py={{ base: 6, md: 8 }} id="supported-by">
      <Container maxW="7xl">
        <Box
          bg={cardBg}
          borderRadius="xl"
          p={{ base: 6, md: 8 }}
          border={useColorModeValue('1px solid rgba(2,6,23,0.04)', '1px solid rgba(255,255,255,0.04)')}
          boxShadow={useColorModeValue('0 6px 18px rgba(2,6,23,0.03)', '0 8px 24px rgba(2,6,23,0.6)')}
          style={{ backdropFilter: useColorModeValue('', 'saturate(180%) blur(6px)') }}
          transition="transform 180ms, box-shadow 180ms"
          _hover={{
            transform: 'translateY(-2px)',
            boxShadow: useColorModeValue('0 8px 25px rgba(2,6,23,0.08)', '0 12px 32px rgba(2,6,23,0.8)')
          }}
        >
          <Header
            title="Supported by"
            subtitle="Community"
            description="Organizations and community members who support EIPs Insight as an open-source public good."
            sectionId="supported-by"
          />
          <SimpleGrid columns={{ base: 1, sm: 3 }} spacing={10} alignItems="center">
            <Box textAlign="center">
              <Box
                as="a"
                href="https://ethereum.org/"
                target="_blank"
                rel="noopener noreferrer"
                display="inline-block"
                cursor="pointer"
                p={4}
                borderRadius="xl"
                bg={useColorModeValue('gray.50', 'gray.700')}
                border="1px solid"
                borderColor={useColorModeValue('gray.200', 'gray.600')}
                transition="all 300ms ease"
                _hover={{
                  transform: 'translateY(-6px) scale(1.02)',
                  boxShadow: useColorModeValue('0 10px 25px rgba(0,0,0,0.1)', '0 10px 25px rgba(0,0,0,0.3)'),
                  borderColor: useColorModeValue('#30A0E0', '#4FD1FF')
                }}
              >
                <Image
                  src={logoSrc}
                  alt="Ecosystem Support Program"
                  h={{ base: 14, md: 18 }}
                  mx="auto"
                  transition="all 200ms ease"
                />
                <Text
                  fontSize="sm"
                  color={useColorModeValue('gray.700', 'gray.300')}
                  mt={3}
                  fontWeight="semibold"
                >
                  Ecosystem Support
                </Text>
              </Box>
            </Box>

            <Box textAlign="center">
              <Box
                as="a"
                href="https://octant.app/"
                target="_blank"
                rel="noopener noreferrer"
                display="inline-block"
                cursor="pointer"
                p={4}
                borderRadius="xl"
                bg={useColorModeValue('gray.50', 'gray.700')}
                border="1px solid"
                borderColor={useColorModeValue('gray.200', 'gray.600')}
                transition="all 300ms ease"
                _hover={{
                  transform: 'translateY(-6px) scale(1.02)',
                  boxShadow: useColorModeValue('0 10px 25px rgba(0,0,0,0.1)', '0 10px 25px rgba(0,0,0,0.3)'),
                  borderColor: useColorModeValue('#30A0E0', '#4FD1FF')
                }}
              >
                <Image
                  src="/octant.png"
                  alt="Octant"
                  h={{ base: 14, md: 18 }}
                  mx="auto"
                  transition="all 200ms ease"
                />
                <Text
                  fontSize="sm"
                  color={useColorModeValue('gray.700', 'gray.300')}
                  mt={3}
                  fontWeight="semibold"
                >
                  Octant
                </Text>
              </Box>
            </Box>

            <Box textAlign="center">
              <Box
                as="a"
                href="https://gitcoin.co/"
                target="_blank"
                rel="noopener noreferrer"
                display="inline-block"
                cursor="pointer"
                p={4}
                borderRadius="xl"
                bg={useColorModeValue('gray.50', 'gray.700')}
                border="1px solid"
                borderColor={useColorModeValue('gray.200', 'gray.600')}
                transition="all 300ms ease"
                _hover={{
                  transform: 'translateY(-6px) scale(1.02)',
                  boxShadow: useColorModeValue('0 10px 25px rgba(0,0,0,0.1)', '0 10px 25px rgba(0,0,0,0.3)'),
                  borderColor: useColorModeValue('#30A0E0', '#4FD1FF')
                }}
              >
                <Image
                  src="/Gitcoin-logo-.jpg"
                  alt="Gitcoin"
                  h={{ base: 14, md: 18 }}
                  mx="auto"
                  transition="all 200ms ease"
                />
                <Text
                  fontSize="sm"
                  color={useColorModeValue('gray.700', 'gray.300')}
                  mt={3}
                  fontWeight="semibold"
                >
                  Gitcoin
                </Text>
              </Box>
            </Box>
          </SimpleGrid>

          <Box mt={6} textAlign="center">
            <Text
              fontSize="sm"
              color={textColor}
              opacity={0.8}
            >
              Interested in supporting the project?{' '}
              <Text
                as="a"
                href="/about#funding"
                color={useColorModeValue('blue.500', 'blue.300')}
                fontWeight="medium"
                _hover={{ textDecoration: 'underline' }}
              >
                Learn more about funding
              </Text>
            </Text>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}