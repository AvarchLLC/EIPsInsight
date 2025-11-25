import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Box, Spinner, Flex } from '@chakra-ui/react';

const AdminRedirect: React.FC = () => {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkAuthAndRedirect = async () => {
      try {
        // Check if user has valid admin session
        const response = await fetch('/api/admin/auth/session');
        
        if (response.ok) {
          // User is authenticated, redirect to dashboard
          router.replace('/admin/dashboard');
        } else {
          // User is not authenticated, redirect to login
          router.replace('/admin/login');
        }
      } catch (error) {
        // On error, redirect to login
        router.replace('/admin/login');
      } finally {
        setChecking(false);
      }
    };

    checkAuthAndRedirect();
  }, [router]);

  // Show loading spinner while checking
  return (
    <Flex minH="100vh" align="center" justify="center">
      <Box textAlign="center">
        <Spinner size="xl" color="blue.500" thickness="4px" />
      </Box>
    </Flex>
  );
};

export default AdminRedirect;
