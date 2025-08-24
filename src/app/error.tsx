'use client';

import { Box, Heading, Text, Button, VStack, Icon, useColorModeValue } from '@chakra-ui/react';
import { WarningIcon, RepeatIcon } from '@chakra-ui/icons';

export default function Error502() {
  const cardBg = useColorModeValue('white', 'gray.900');
  const accent = useColorModeValue('#4299e1', '#63b3ed');
  const textColor = useColorModeValue('gray.700', 'gray.200');

  const handleReload = () => {
    window.location.reload();
  };

  return (
    <Box minH="100vh" bg={useColorModeValue('gray.50', 'gray.800')} display="flex" alignItems="center" justifyContent="center" px={4}>
      <Box
        bg={cardBg}
        borderRadius="2xl"
        boxShadow="lg"
        p={{ base: 6, md: 10 }}
        maxW="md"
        w="100%"
        textAlign="center"
        border="1px solid"
        borderColor={useColorModeValue('gray.200', 'gray.700')}
      >
        <VStack spacing={6}>
          <Icon as={WarningIcon} boxSize={12} color={accent} />
          <Heading size="lg" color={accent}>
            502 Bad Gateway
          </Heading>
          <Text fontSize="lg" color={textColor} fontWeight="medium">
            Our server is currently under maintenance or experiencing high load.
          </Text>
          <Text fontSize="md" color={textColor} opacity={0.8}>
            Please check back in a few minutes.<br />
            If the issue persists, contact support or try refreshing the page.
          </Text>
          <Button
            leftIcon={<RepeatIcon />}
            colorScheme="blue"
            variant="solid"
            size="lg"
            borderRadius="md"
            onClick={handleReload}
          >
            Retry
          </Button>
        </VStack>
      </Box>
    </Box>
  );
}