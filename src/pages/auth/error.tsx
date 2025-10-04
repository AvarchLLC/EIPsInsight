import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { signOut } from 'next-auth/react';
import { 
  Box, 
  Container, 
  VStack, 
  Heading, 
  Text, 
  Button, 
  Alert, 
  AlertIcon, 
  Code,
  Divider
} from '@chakra-ui/react';

export default function AuthError() {
  const router = useRouter();
  const [isClearing, setIsClearing] = useState(false);
  const { error } = router.query;

  const getErrorMessage = (errorType: string) => {
    switch (errorType) {
      case 'JWTSessionError':
        return {
          title: 'Session Decryption Error',
          description: 'There was an issue with your authentication session. This usually happens when the authentication secret changes or sessions become corrupted.',
          action: 'Clear Session Data'
        };
      case 'Signin':
        return {
          title: 'Sign In Error',
          description: 'There was an error during the sign-in process.',
          action: 'Try Again'
        };
      case 'Callback':
        return {
          title: 'Callback Error',
          description: 'An error occurred during the authentication callback.',
          action: 'Retry Authentication'
        };
      default:
        return {
          title: 'Authentication Error',
          description: 'An unknown authentication error occurred.',
          action: 'Reset Session'
        };
    }
  };

  const clearAuthData = async () => {
    setIsClearing(true);
    try {
      // Call server-side clear session API
      await fetch('/api/auth/clear-session', {
        method: 'POST',
      });

      // Sign out client-side
      await signOut({ redirect: false });

      // Clear localStorage and sessionStorage
      if (typeof window !== 'undefined') {
        localStorage.clear();
        sessionStorage.clear();
      }

      // Redirect to home after clearing
      setTimeout(() => {
        router.push('/');
      }, 1000);

    } catch (error) {
      console.error('Error clearing auth data:', error);
      // Force redirect even if clearing fails
      router.push('/');
    } finally {
      setIsClearing(false);
    }
  };

  useEffect(() => {
    // Auto-clear for JWT errors
    if (error === 'JWTSessionError') {
      const autoFixTimer = setTimeout(() => {
        clearAuthData();
      }, 3000); // Auto-fix after 3 seconds

      return () => clearTimeout(autoFixTimer);
    }
  }, [error]);

  const errorInfo = getErrorMessage(error as string);

  return (
    <Container maxW="lg" py={20}>
      <VStack spacing={8} textAlign="center">
        <Box>
          <Heading size="xl" color="red.500" mb={4}>
            {errorInfo.title}
          </Heading>
          <Text fontSize="lg" color="gray.600">
            {errorInfo.description}
          </Text>
        </Box>

        {error && (
          <Alert status="error" borderRadius="md">
            <AlertIcon />
            <Box textAlign="left" w="full">
              <Text fontWeight="semibold">Error Code:</Text>
              <Code colorScheme="red" fontSize="sm">
                {error}
              </Code>
            </Box>
          </Alert>
        )}

        {error === 'JWTSessionError' && (
          <Alert status="info" borderRadius="md">
            <AlertIcon />
            <Box textAlign="left">
              <Text fontWeight="semibold">Automatic Fix in Progress</Text>
              <Text fontSize="sm" mt={1}>
                We're automatically clearing your session data to resolve this issue. 
                You'll be redirected to the home page shortly.
              </Text>
            </Box>
          </Alert>
        )}

        <Divider />

        <VStack spacing={4} w="full">
          <Button 
            colorScheme="blue" 
            onClick={clearAuthData}
            isLoading={isClearing}
            loadingText="Clearing Session..."
            size="lg"
          >
            {errorInfo.action}
          </Button>

          <Button 
            variant="outline" 
            onClick={() => router.push('/auth/signin')}
            isDisabled={isClearing}
          >
            Try Signing In Again
          </Button>

          <Button 
            variant="ghost" 
            onClick={() => router.push('/')}
            isDisabled={isClearing}
          >
            Go Home
          </Button>
        </VStack>

        <Box p={4} bg="gray.50" borderRadius="md" fontSize="sm" color="gray.600">
          <Text fontWeight="semibold" mb={2}>Still having issues?</Text>
          <VStack spacing={1} align="start" fontSize="xs">
            <Text>1. Clear your browser cookies and cache</Text>
            <Text>2. Try using an incognito/private browsing window</Text>
            <Text>3. Restart your browser</Text>
            <Text>4. Contact support if the problem persists</Text>
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
}