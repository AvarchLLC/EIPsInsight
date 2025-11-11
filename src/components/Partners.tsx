import React from 'react';
import { Box, Container, Heading, Text, Flex, Image, useColorModeValue, VStack, Link as ChakraLink } from '@chakra-ui/react';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

const Partners: React.FC = () => {
  const cardBg = useColorModeValue('white', '#2d3748');

  const partners = [
    {
      name: 'EtherWorld',
      gif: '/EtherWorld-gif.gif',
      url: 'https://etherworld.co',
    },
    {
      name: 'ECH',
      gif: '/ECH-gif.gif', 
      url: '#',
    }
  ];

  return (
    <>
      <style jsx>{`
        .gradient-text {
          background: linear-gradient(135deg, #30A0E0 0%, #4FD1FF 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>
      <Container maxW="7xl" py={4} id="partners">
      <Box
        className="section-container"
        bg={cardBg}
        p={{ base: 6, md: 8 }}
        borderRadius="xl"
        border={useColorModeValue('1px solid rgba(2,6,23,0.04)', '1px solid rgba(255,255,255,0.04)')}
        boxShadow={useColorModeValue('0 6px 18px rgba(2,6,23,0.03)', '0 8px 24px rgba(2,6,23,0.6)')}
      >
        <VStack spacing={8} align="stretch">
          {/* Clean Header */}
          <VStack spacing={2} align="flex-start">
            <Heading
              as="h2"
              fontSize={{ base: '2xl', md: '3xl' }}
              className="gradient-text"
              fontWeight="600"
              textAlign="left"
            >
              Partners
            </Heading>
            <Text 
              fontSize="sm" 
              color={useColorModeValue('gray.600', 'gray.400')}
            >
              Ecosystem collaborators
            </Text>
          </VStack>

          {/* Partners Display */}
          <Flex
            justify="center"
            align="flex-start"
            gap={{ base: 8, md: 12 }}
            wrap="wrap"
          >
            {partners.map((partner, index) => (
              <MotionBox
                key={partner.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                whileHover={{ y: -4 }}
              >
                <ChakraLink 
                  href={partner.url} 
                  isExternal 
                  _hover={{ textDecoration: 'none' }}
                >
                  {/* Partner container with larger GIF */}
                  <Box
                    p={2}
                    borderRadius="xl"
                    bg={useColorModeValue('white', 'gray.800')}
                    border="1px solid"
                    borderColor={useColorModeValue('gray.200', 'gray.600')}
                    boxShadow={useColorModeValue('0 4px 12px rgba(0,0,0,0.05)', '0 4px 12px rgba(0,0,0,0.2)')}
                    _hover={{
                      borderColor: useColorModeValue('blue.300', 'blue.400'),
                      boxShadow: useColorModeValue('0 8px 25px rgba(59, 130, 246, 0.15)', '0 8px 25px rgba(59, 130, 246, 0.25)'),
                      transform: 'translateY(-2px)'
                    }}
                    transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                  >
                    <Image
                      src={partner.gif}
                      alt={`${partner.name} logo`}
                      boxSize={{ base: "200px", md: "240px", lg: "280px" }}
                      objectFit="contain"
                      fallbackSrc="/logos/octant.svg"
                    />
                  </Box>
                </ChakraLink>
              </MotionBox>
            ))}
          </Flex>
        </VStack>
      </Box>
    </Container>
    </>
  );
};

export default Partners;
