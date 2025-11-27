import { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import AllLayout from '@/components/Layout';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Text,
  Alert,
  AlertIcon,
  Container,
  useColorModeValue,
  Icon,
  InputGroup,
  InputLeftElement,
} from '@chakra-ui/react';
import { LockIcon, EmailIcon, ArrowBackIcon } from '@chakra-ui/icons';
import { FaUser } from 'react-icons/fa';

export default function AdminLogin() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  useEffect(() => {
    setMounted(true);
    // Check if already logged in
    fetch('/api/admin/auth/session')
      .then(res => {
        if (res.ok) {
          router.push('/admin/dashboard');
        }
      })
      .catch(() => {});
  }, [router]);

  if (!mounted) {
    return null;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        router.push('/admin/dashboard');
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AllLayout>
      <Container maxW="md" py={20}>
        <VStack spacing={4}>
          {/* Back to Site Link */}
          <Link href="/" passHref>
            <Button
              as="a"
              variant="ghost"
              size="sm"
              leftIcon={<ArrowBackIcon />}
            >
              Back to Site
            </Button>
          </Link>

          <Box
            bg={bgColor}
            p={8}
            borderRadius="xl"
            boxShadow="2xl"
            border="1px"
            borderColor={borderColor}
            w="full"
          >
            <VStack spacing={6} align="stretch">
              {/* Header */}
              <VStack spacing={2}>
                <Box
                  bg="blue.500"
                  p={3}
                  borderRadius="full"
                  mb={2}
                >
                  <Icon as={LockIcon} boxSize={6} color="white" />
                </Box>
                <Heading size="lg">Blog Admin</Heading>
                <Text color="gray.600" fontSize="sm">
                  Sign in to manage blog posts
                </Text>
              </VStack>

            {/* Error Alert */}
            {error && (
              <Alert status="error" borderRadius="md">
                <AlertIcon />
                {error}
              </Alert>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit}>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Username</FormLabel>
                  <InputGroup>
                    <InputLeftElement>
                      <Icon as={FaUser} color="gray.400" />
                    </InputLeftElement>
                    <Input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter your username"
                    />
                  </InputGroup>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Password</FormLabel>
                  <InputGroup>
                    <InputLeftElement>
                      <LockIcon color="gray.400" />
                    </InputLeftElement>
                    <Input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                    />
                  </InputGroup>
                </FormControl>

                <Button
                  type="submit"
                  colorScheme="blue"
                  width="full"
                  size="lg"
                  isLoading={loading}
                  loadingText="Signing in..."
                >
                  Sign In
                </Button>
              </VStack>
            </form>
          </VStack>
        </Box>
        </VStack>
      </Container>
    </AllLayout>
  );
}
