import React from 'react';
import {
  Box,
  Text,
  Image,
  useColorModeValue,
  SimpleGrid,
  Link,
  VStack,
  Button,
  Icon,
  HStack,
} from '@chakra-ui/react';
import { FiExternalLink, FiHeart } from 'react-icons/fi';
import { motion } from 'framer-motion';
import Header from './Header';

const MotionBox = motion(Box);

export default function SupportedBy() {
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderCol = useColorModeValue('gray.200', 'gray.700');
  const supporterCardBg = useColorModeValue('white', 'gray.750');
  const supporterCardHoverBg = useColorModeValue('gray.50', 'gray.700');
  const logoSrc = useColorModeValue('/ESP_square.png', '/ESP_square.png');
  const gitcoinSrc = useColorModeValue('/gitcoin-square.png', '/gitcoin-square.png');

  const supporters = [
    {
      name: 'Ecosystem Support',
      logo: logoSrc,
      url: 'https://ethereum.org/',
      description: 'Ethereum Foundation ESP',
      gradient: 'linear(135deg, #667eea 0%, #764ba2 100%)',
    },
    {
      name: 'Gitcoin',
      logo: gitcoinSrc,
      url: 'https://gitcoin.co/',
      description: 'Community Grants',
      gradient: 'linear(135deg, #0fdb8b 0%, #06ce77 100%)',
    },
  ];

  return (
    <Box
      as="section"
      id="supported-by"
      bg={cardBg}
      borderRadius="xl"
      boxShadow="sm"
      border="1px solid"
      borderColor={borderCol}
      p={{ base: 6, md: 8 }}
      mb={8}
      position="relative"
      overflow="hidden"
    >
      {/* Background Gradient Accent */}
      <Box
        position="absolute"
        top="0"
        left="0"
        right="0"
        height="4px"
        bgGradient="linear(90deg, #667eea 0%, #764ba2 50%, #0fdb8b 100%)"
        opacity={0.8}
      />

      {/* Header */}
      <Header
        title="Supported by"
        subtitle=""
        description=""
        sectionId="supported-by"
      />

      {/* Supporters Grid */}
      <SimpleGrid
        columns={{ base: 1, md: 2 }}
        spacing={6}
        mt={6}
      >
        {supporters.map((supporter, index) => (
          <MotionBox
            key={supporter.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Link
              href={supporter.url}
              isExternal
              _hover={{ textDecoration: 'none' }}
            >
              <Box
                bg={supporterCardBg}
                borderRadius="xl"
                border="2px solid"
                borderColor={useColorModeValue('gray.200', 'gray.600')}
                p={6}
                transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                position="relative"
                overflow="hidden"
                role="group"
                _hover={{
                  transform: 'translateY(-4px)',
                  borderColor: useColorModeValue('blue.400', 'blue.500'),
                  boxShadow: useColorModeValue(
                    '0 12px 40px rgba(102, 126, 234, 0.15)',
                    '0 12px 40px rgba(102, 126, 234, 0.3)'
                  ),
                }}
              >
                {/* Gradient Bar on Top */}
                <Box
                  position="absolute"
                  top={0}
                  left={0}
                  right={0}
                  height="3px"
                  bgGradient={supporter.gradient}
                  opacity={0}
                  _groupHover={{ opacity: 1 }}
                  transition="opacity 0.3s"
                />

                {/* Content */}
                <VStack spacing={4} align="center">
                  {/* Logo with Glow Effect */}
                  <Box position="relative">
                    <Box
                      position="absolute"
                      top="50%"
                      left="50%"
                      transform="translate(-50%, -50%)"
                      width="140%"
                      height="140%"
                      bgGradient={supporter.gradient}
                      opacity={0}
                      filter="blur(20px)"
                      borderRadius="full"
                      _groupHover={{ opacity: 0.2 }}
                      transition="opacity 0.5s"
                    />
                    <Image
                      src={supporter.logo}
                      alt={supporter.name}
                      h={{ base: 24, md: 28, lg: 32 }}
                      w={{ base: 24, md: 28, lg: 32 }}
                      borderRadius="xl"
                      objectFit="cover"
                      boxShadow="lg"
                      transition="all 0.3s"
                      _groupHover={{
                        transform: 'scale(1.05) rotate(2deg)',
                      }}
                    />
                  </Box>

                  {/* Text Content */}
                  <VStack spacing={1} textAlign="center">
                    <HStack spacing={2}>
                      <Text
                        fontSize={{ base: 'xl', md: '2xl' }}
                        fontWeight="700"
                        bgGradient={supporter.gradient}
                        bgClip="text"
                        letterSpacing="-0.02em"
                      >
                        {supporter.name}
                      </Text>
                      <Icon
                        as={FiExternalLink}
                        boxSize={4}
                        color={useColorModeValue('gray.500', 'gray.400')}
                        opacity={0}
                        _groupHover={{ opacity: 1 }}
                        transition="opacity 0.3s"
                      />
                    </HStack>
                    <Text
                      fontSize="sm"
                      color={useColorModeValue('gray.600', 'gray.400')}
                      fontWeight="500"
                    >
                      {supporter.description}
                    </Text>
                  </VStack>
                </VStack>

                {/* Subtle Background Pattern */}
                <Box
                  position="absolute"
                  bottom="-20px"
                  right="-20px"
                  width="100px"
                  height="100px"
                  bgGradient={supporter.gradient}
                  opacity={0.03}
                  borderRadius="full"
                  _groupHover={{ opacity: 0.06 }}
                  transition="opacity 0.5s"
                />
              </Box>
            </Link>
          </MotionBox>
        ))}
      </SimpleGrid>

      {/* Support CTA */}
      <Box mt={8} textAlign="center">
        <Link href="/donate" _hover={{ textDecoration: 'none' }}>
          <Button
            size="lg"
            colorScheme="blue"
            bgGradient="linear(135deg, #667eea 0%, #764ba2 100%)"
            color="white"
            _hover={{
              bgGradient: 'linear(135deg, #5568d3 0%, #6a3f92 100%)',
              transform: 'translateY(-2px)',
              boxShadow: 'xl',
            }}
            _active={{
              transform: 'translateY(0)',
            }}
            transition="all 0.2s"
            leftIcon={<Icon as={FiHeart} />}
            borderRadius="xl"
            px={8}
            py={6}
            fontWeight="700"
            fontSize="md"
          >
            Support Our Mission
          </Button>
        </Link>
        <Text
          mt={3}
          fontSize="sm"
          color={useColorModeValue('gray.600', 'gray.400')}
        >
          Help us maintain this free and open-source platform
        </Text>
      </Box>
    </Box>
  );
}