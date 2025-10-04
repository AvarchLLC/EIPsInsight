import { Box, Container, VStack, Heading, Text, Button, Alert, AlertIcon } from '@chakra-ui/react';
import { useRouter } from 'next/router';

export default function SuspendedPage() {
  const router = useRouter();

  return (
    <Container maxW="md" py={20}>
      <VStack spacing={8} textAlign="center">
        <Box>
          <Heading size="xl" color="red.500" mb={4}>
            Account Suspended
          </Heading>
          <Text fontSize="lg" color="gray.600">
            Your account has been temporarily suspended.
          </Text>
        </Box>

        <Alert status="error" borderRadius="md">
          <AlertIcon />
          <Box textAlign="left">
            <Text fontWeight="semibold">Account Status: Suspended</Text>
            <Text fontSize="sm" mt={1}>
              Your account access has been restricted due to policy violations or security concerns.
              Please contact support for assistance.
            </Text>
          </Box>
        </Alert>

        <VStack spacing={4} w="full">
          <Button colorScheme="blue" as="a" href="mailto:support@eipsinsight.com">
            Contact Support
          </Button>
          
          <Button variant="ghost" onClick={() => router.push('/')}>
            Go Home
          </Button>
        </VStack>

        <Box p={4} bg="gray.50" borderRadius="md" fontSize="sm" color="gray.600">
          <Text fontWeight="semibold" mb={2}>Need Help?</Text>
          <Text>
            If you believe this is an error, please reach out to our support team with your account details.
            We typically respond within 24 hours.
          </Text>
        </Box>
      </VStack>
    </Container>
  );
}