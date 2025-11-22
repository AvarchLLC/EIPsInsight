import React from 'react';
import {
  Box,
  Text,
  Image,
  useColorModeValue,
  Flex,
  Button,
} from '@chakra-ui/react';
import Header from './Header';

export default function SupportedBy() {
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderCol = useColorModeValue('gray.200', 'gray.700');
  const nameColor = useColorModeValue('gray.900', 'white');
  const logoSrc = useColorModeValue('/ESP_square.png', '/ESP_square.png');
  const gitcoinSrc = useColorModeValue('/gitcoin-square.png', '/gitcoin-square.png');

  return (
    <Box as="section" id="supported-by" py={{ base: 8, md: 12 }}>
      <Box
        bg={cardBg}
        borderRadius="xl"
        boxShadow="sm"
        border="1px solid"
        borderColor={borderCol}
        p={{ base: 6, md: 10 }}
        mb={8}
        maxWidth="100%"
        mx="auto"
        transition="box-shadow 0.2s"
        className="supportedby-card"
      >
        <Header
          title="Supported by"
          subtitle=""
          description=""
          sectionId="supported-by"
        />
        <Flex
          direction={{ base: 'column', md: 'row' }}
          align="center"
          justify="center"
          gap={{ base: 12, md: 20 }}
          mt={{ base: 2, md: 4 }}
          wrap="wrap"
          className="supportedby-list"
        >
          {/* Ecosystem Support */}
          <Box
            as="a"
            href="https://ethereum.org/"
            target="_blank"
            rel="noopener noreferrer"
            display="flex"
            flexDir="column"
            alignItems="center"
            textAlign="center"
            transition="transform 0.22s, box-shadow 0.22s"
            _hover={{
              transform: 'scale(1.10)',
              boxShadow: useColorModeValue('0 16px 40px rgba(2,6,23,0.12)', '0 20px 48px rgba(2,6,23,0.45)'),
            }}
            px={{ base: 2, md: 4 }}
            py={2}
            className="supportedby-item"
          >
            <Image
              src={logoSrc}
              alt="Ecosystem Support Program"
              h={{ base: 32, md: 40, lg: 48 }}
              w={{ base: 32, md: 40, lg: 48 }}
              mb={4}
              borderRadius="xl"
              boxShadow="lg"
              transition="inherit"
              className="supportedby-logo"
            />
            <Text
              fontSize={{ base: 'xl', md: '2xl', lg: '2xl' }}
              color={nameColor}
              fontWeight="bold"
              mt={2}
              textAlign="center"
              className="supportedby-name"
              letterSpacing="-0.5px"
            >
              Ecosystem Support
            </Text>
          </Box>

          {/* Gitcoin */}
          <Box
            as="a"
            href="https://gitcoin.co/"
            target="_blank"
            rel="noopener noreferrer"
            display="flex"
            flexDir="column"
            alignItems="center"
            textAlign="center"
            transition="transform 0.22s, box-shadow 0.22s"
            _hover={{
              transform: 'scale(1.10)',
              boxShadow: useColorModeValue('0 16px 40px rgba(2,6,23,0.12)', '0 20px 48px rgba(2,6,23,0.45)'),
            }}
            px={{ base: 2, md: 4 }}
            py={2}
            className="supportedby-item"
          >
            <Image
              src={gitcoinSrc}
              alt="Gitcoin"
              h={{ base: 32, md: 40, lg: 48 }}
              w={{ base: 32, md: 40, lg: 48 }}
              mb={4}
              borderRadius="xl"
              boxShadow="lg"
              transition="inherit"
              className="supportedby-logo"
            />
            <Text
              fontSize={{ base: 'xl', md: '2xl', lg: '2xl' }}
              color={nameColor}
              fontWeight="bold"
              mt={2}
              textAlign="center"
              className="supportedby-name"
              letterSpacing="-0.5px"
            >
              Gitcoin
            </Text>
          </Box>
        </Flex>
        <Box mt={{ base: 10, md: 12 }} textAlign="center">
          <Button
            as="a"
            href="/donate"
            colorScheme="blue"
            size="lg"
            fontWeight="bold"
            borderRadius="xl"
            px={8}
            py={6}
            className="supportedby-learnmore"
          >
            Learn More
          </Button>
        </Box>
      </Box>
    </Box>
  );
}