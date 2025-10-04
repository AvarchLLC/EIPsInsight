import { Box, Container, VStack, Heading, Text, Button, Alert, AlertIcon } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useSession, signIn } from 'next-auth/react';

export default function UnauthorizedPage() {
  const router = useRouter();
  const { data: session } = useSession();

  return (
    <Container maxW="md" py={20}>
      <VStack spacing={8} textAlign="center">
        <Box>
          <Heading size="xl" color="red.500" mb={4}>
            Access Denied
          </Heading>
          <Text fontSize="lg" color="gray.600">
            You don't have permission to access this page.
          </Text>
        </Box>

        <Alert status="error" borderRadius="md">
          <AlertIcon />
          <Box>
            <Text fontWeight="semibold">Insufficient Permissions</Text>
            <Text fontSize="sm">
              {session?.user ? 
                `Your current role (${session.user.role}) doesn't have access to this resource.` :
                'Please sign in to access this page.'
              }
            </Text>
          </Box>
        </Alert>

        <VStack spacing={4} w="full">
          {!session?.user ? (
            <Button colorScheme="blue" onClick={() => signIn()}>
              Sign In
            </Button>
          ) : (
            <Button variant="outline" onClick={() => router.push('/profile')}>
              View Profile
            </Button>
          )}
          
          <Button variant="ghost" onClick={() => router.push('/')}>
            Go Home
          </Button>
        </VStack>
      </VStack>
    </Container>
  );
}