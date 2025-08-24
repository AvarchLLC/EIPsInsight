'use client';

import { Box, Heading, Text, Button, VStack, Icon, useColorModeValue } from '@chakra-ui/react';
import { WarningIcon, RepeatIcon } from '@chakra-ui/icons';

export default function Error502() {
  const cardBg = useColorModeValue('white', 'gray.900');
  const accent = useColorModeValue('#4299e1', '#63b3ed');
  const textColor = useColorModeValue('gray.700', 'gray.200');
  const gradientBg = useColorModeValue(
    'linear-gradient(90deg, #ebf8ff 0%, #bee3f8 100%)',
    'linear-gradient(90deg, #2a4365 0%, #2c5282 100%)'
  );

  const handleReload = () => {
    window.location.reload();
  };

  return (
    <Box
      bg={gradientBg}
      minHeight="100vh"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      px={4}
      w="100vw"
      m={0}
    >
      <Box
        bg={cardBg}
        borderRadius="2xl"
        boxShadow="2xl"
        py={{ base: 10, md: 16 }}
        px={{ base: 6, md: 20 }}
        w="100%"
        maxW="600px"
        textAlign="center"
        border="1px solid"
        borderColor={useColorModeValue('gray.200', 'gray.700')}
      >
        <VStack spacing={8}>
          <Icon as={WarningIcon} boxSize={16} color={accent} />
          <Heading size="2xl" color={accent}>
            502 Bad Gateway
          </Heading>
          <Text fontSize="xl" color={textColor} fontWeight="semibold">
            Our server is currently under maintenance or experiencing high load.
          </Text>
          <Text fontSize="md" color={textColor} opacity={0.85}>
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
