import React from 'react';
import { Heading, Text, Box, Flex, Image, useColorModeValue, VStack } from '@chakra-ui/react';

export default function AboutHeader() {
  const mainHeadingColor = useColorModeValue("#30A0E0", "#4FD1FF");
  const textColor = useColorModeValue("gray.700", "gray.200");
  const bgGradient = useColorModeValue(
    "linear(to-r, blue.50, purple.50)",
    "linear(to-r, gray.800, gray.900)"
  );

  return (
    <Box
      bgGradient={bgGradient}
      borderRadius="2xl"
      p={8}
      mb={10}
      boxShadow="xl"
      position="relative"
      overflow="hidden"
      _before={{
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        bg: "rgba(255,255,255,0.1)",
        borderRadius: "2xl",
      }}
    >
      <VStack spacing={6} align="center" position="relative" zIndex={1}>
        <Flex justify="center" align="center" direction={{ base: 'column', md: 'row' }} gap={8}>
          <Box
            bg="white"
            borderRadius="full"
            p={2}
            boxShadow="lg"
            _dark={{ bg: "gray.700" }}
          >
            <Image
              src="/EIPsInsightsDark.gif"
              alt="EIPs Insight Logo"
              boxSize="100px"
              borderRadius="full"
              objectFit="cover"
            />
          </Box>
          <VStack align={{ base: 'center', md: 'start' }} spacing={3}>
            <Heading
              as="h1"
              size="3xl"
              fontWeight="extrabold"
              letterSpacing="tight"
              color={mainHeadingColor}
              textAlign={{ base: 'center', md: 'left' }}
            >
              EIPs Insight
            </Heading>
            <Text
              fontSize="xl"
              color={textColor}
              maxW="lg"
              textAlign={{ base: 'center', md: 'left' }}
              lineHeight="tall"
            >
              The next-generation dashboard for Ethereum proposals. Explore, analyze, and contribute to the future of Ethereum with real-time analytics, beautiful charts, and a vibrant community.
            </Text>
          </VStack>
        </Flex>
      </VStack>
    </Box>
  );
}
