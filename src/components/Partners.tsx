import React from 'react';
import { Box, Container, Heading, Text, SimpleGrid, Image, useColorModeValue, Stack, Link as ChakraLink } from '@chakra-ui/react';

const Partners: React.FC = () => {
  const cardBg = useColorModeValue('white', '#2d3748');
  const logoFallback = '/logos/octant.svg';

  return (
    <Container maxW="7xl" py={4} id="partners">
      <Box
        className="section-container"
        bg={cardBg}
        p={{ base: 6, md: 8 }}
        borderRadius="xl"
        border={useColorModeValue('1px solid rgba(2,6,23,0.04)', '1px solid rgba(255,255,255,0.04)')}
        boxShadow={useColorModeValue('0 6px 18px rgba(2,6,23,0.03)', '0 8px 24px rgba(2,6,23,0.6)')}
      >
        <Heading
          as="h2"
          fontSize={{ base: '2xl', md: '3xl', lg: '3xl' }}
          className="gradient-text"
          mb={4}
          fontWeight="bold"
          textAlign="left"
        >
          Partners
        </Heading>

        <Text fontSize="sm" color={useColorModeValue('gray.600', 'gray.300')} mb={4}>
          Ecosystems tier
        </Text>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
          {/* Simple partner card: logo + name */}
          <Box
            bg={useColorModeValue('gray.50', '#1f2937')}
            borderRadius="md"
            p={6}
            textAlign="center"
            border={useColorModeValue('1px solid rgba(2,6,23,0.04)', '1px solid rgba(255,255,255,0.04)')}
            minH="160px"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <ChakraLink href="https://etherworld.co" isExternal _hover={{ textDecoration: 'none' }}>
              <Stack spacing={3} align="center">
                <Image
                  src={"https://etherworld.co/favicon.ico"}
                  alt="EtherWorld logo"
                  boxSize="56px"
                  objectFit="contain"
                  fallbackSrc={logoFallback}
                />
                <Text fontWeight="bold">EtherWorld</Text>
              </Stack>
            </ChakraLink>
          </Box>
        </SimpleGrid>
      </Box>
    </Container>
  );
};

export default Partners;
