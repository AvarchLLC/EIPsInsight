import { useEffect } from 'react';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { Box, Container, VStack, Heading, Text, Button, Alert, AlertIcon, Spinner } from '@chakra-ui/react';

export default function ResetAuthPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const clearAuthData = () => {
    // Clear localStorage
    if (typeof window !== 'undefined') {
      localStorage.clear();
      sessionStorage.clear();
      
      // Clear cookies by setting them to expire
      document.cookie.split(";").forEach(function(c) { 
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
      });
    }
  };

  const handleReset = async () => {
    try {
      // Sign out first
      await signOut({ redirect: false });
      
      // Clear local data
      clearAuthData();
      
      // Redirect to home
      router.push('/');
    } catch (error) {
      console.error('Error during reset:', error);
      // Force clear and redirect anyway
      clearAuthData();
      window.location.href = '/';
    }
  };

  useEffect(() => {
    // Auto-clear if there's a JWT error in URL params
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('error') === 'JWTSessionError') {
      handleReset();
    }
  }, []);

  if (status === 'loading') {
    return (
      <Container maxW="md" py={20}>
        <VStack spacing={4}>
          <Spinner size="xl" />
          <Text>Checking authentication status...</Text>
        </VStack>
      </Container>
    );
  }

  return (
    <Container maxW="md" py={20}>
      <VStack spacing={8} textAlign="center">
        <Box>
          <Heading size="xl" color="blue.500" mb={4}>
            Reset Authentication
          </Heading>
          <Text fontSize="lg" color="gray.600">
            Clear all authentication data and start fresh
          </Text>
        </Box>

        <Alert status="info" borderRadius="md">
          <AlertIcon />
          <Box textAlign="left">
            <Text fontWeight="semibold">Authentication Issues?</Text>
            <Text fontSize="sm" mt={1}>
              If you're experiencing JWT decryption errors or session issues, 
              this tool will clear all authentication data and reset your session.
            </Text>
          </Box>
        </Alert>

        {session ? (
          <Box p={4} bg="green.50" borderRadius="md" w="full">
            <Text fontWeight="semibold" color="green.700" mb={2}>
              Currently signed in as:
            </Text>
            <Text>{session.user?.name || session.user?.email}</Text>
            <Text fontSize="sm" color="gray.600">
              Role: {session.user?.role || 'user'}
            </Text>
          </Box>
        ) : (
          <Box p={4} bg="gray.50" borderRadius="md" w="full">
            <Text color="gray.600">
              No active session found
            </Text>
          </Box>
        )}

        <VStack spacing={4} w="full">
          <Button colorScheme="red" onClick={handleReset} size="lg">
            Clear All Auth Data
          </Button>
          
          <Button variant="ghost" onClick={() => router.push('/')}>
            Go Home
          </Button>
        </VStack>

        <Box p={4} bg="yellow.50" borderRadius="md" fontSize="sm" color="gray.700">
          <Text fontWeight="semibold" mb={2}>What this does:</Text>
          <VStack spacing={1} align="start" fontSize="xs">
            <Text>• Signs you out of your current session</Text>
            <Text>• Clears browser localStorage and sessionStorage</Text>
            <Text>• Removes authentication cookies</Text>
            <Text>• Redirects to the home page</Text>
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
}