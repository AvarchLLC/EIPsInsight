import React from 'react';
import { Box, Heading, Flex, Image, useColorModeValue, VStack, Link as ChakraLink, HStack, Icon } from '@chakra-ui/react';
import { FaHandshake } from 'react-icons/fa';

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
    <Box
      bg={cardBg}
      p={{ base: 4, md: 6 }}
      borderRadius="lg"
      borderWidth="1px"
      borderColor={useColorModeValue('gray.200', 'gray.700')}
      boxShadow={useColorModeValue('sm', 'md')}
    >
      <VStack spacing={4} align="stretch">
        <HStack spacing={3}>
          <Icon as={FaHandshake} boxSize={8} color={useColorModeValue('blue.500', 'blue.400')} />
          <Heading
            as="h2"
            fontSize={{ base: '2xl', md: '3xl' }}
            color={useColorModeValue('gray.900', 'white')}
            fontWeight="800"
            textAlign="left"
            letterSpacing="tight"
          >
            Our Partners
          </Heading>
        </HStack>

        <Flex
          justify="center"
          align="center"
          gap={4}
          wrap="wrap"
        >
          {partners.map((partner, index) => (
            <ChakraLink 
              key={partner.name}
              href={partner.url} 
              isExternal 
              _hover={{ textDecoration: 'none' }}
            >
              <Box
                p={2}
                borderRadius="md"
                bg={useColorModeValue('white', 'gray.700')}
                borderWidth="1px"
                borderColor={useColorModeValue('gray.200', 'gray.600')}
                boxShadow={useColorModeValue('sm', 'md')}
                _hover={{
                  borderColor: useColorModeValue('blue.400', 'blue.500'),
                  boxShadow: useColorModeValue('md', 'lg'),
                }}
                transition="all 0.2s ease"
              >
                <Image
                  src={partner.gif}
                  alt={`${partner.name} logo`}
                  boxSize={{ base: "120px", md: "150px" }}
                  objectFit="contain"
                  fallbackSrc="/logos/octant.svg"
                />
              </Box>
            </ChakraLink>
          ))}
        </Flex>
      </VStack>
    </Box>
  );
};

export default Partners;
