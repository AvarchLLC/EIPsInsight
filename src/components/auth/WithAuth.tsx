import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, ReactNode } from 'react';
import { Box, Spinner, Text, VStack, Alert, AlertIcon, Button } from '@chakra-ui/react';

export type UserRole = 'admin' | 'moderator' | 'premium_user' | 'user';

interface WithAuthProps {
  children: ReactNode;
  requiredRole?: UserRole;
  requireAuth?: boolean;
  fallback?: ReactNode;
}

const roleHierarchy = {
  admin: 4,
  moderator: 3,
  premium_user: 2,
  user: 1,
};

function hasPermission(userRole: string | undefined, requiredRole: UserRole): boolean {
  if (!userRole) return false;
  
  const userLevel = roleHierarchy[userRole as UserRole] || 0;
  const requiredLevel = roleHierarchy[requiredRole] || 1;
  
  return userLevel >= requiredLevel;
}

export function withAuth({
  children,
  requiredRole,
  requireAuth = false,
  fallback
}: WithAuthProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;

    if (requireAuth && !session) {
      router.push('/auth/signin?callbackUrl=' + encodeURIComponent(router.asPath));
      return;
    }

    if (requiredRole && !hasPermission(session?.user?.role, requiredRole)) {
      router.push('/auth/unauthorized');
      return;
    }

    // Check if user is active
    if (session?.user && session.user.isActive === false) {
      router.push('/auth/suspended');
      return;
    }
  }, [session, status, router, requireAuth, requiredRole]);

  if (status === 'loading') {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minH="200px">
        <VStack spacing={4}>
          <Spinner size="xl" color="blue.500" />
          <Text>Loading...</Text>
        </VStack>
      </Box>
    );
  }

  if (requireAuth && !session) {
    return fallback || (
      <Box p={8}>
        <Alert status="warning">
          <AlertIcon />
          You need to be signed in to access this page.
          <Button ml={4} size="sm" onClick={() => router.push('/auth/signin')}>
            Sign In
          </Button>
        </Alert>
      </Box>
    );
  }

  if (requiredRole && !hasPermission(session?.user?.role, requiredRole)) {
    return fallback || (
      <Box p={8}>
        <Alert status="error">
          <AlertIcon />
          You don't have permission to access this page. Required role: {requiredRole}
          {session?.user?.role && (
            <Text ml={2}>Your role: {session.user.role}</Text>
          )}
        </Alert>
      </Box>
    );
  }

  if (session?.user && session.user.isActive === false) {
    return (
      <Box p={8}>
        <Alert status="error">
          <AlertIcon />
          Your account has been suspended. Please contact support.
        </Alert>
      </Box>
    );
  }

  return <>{children}</>;
}

// Higher-order component wrapper
export function WithAuth(Component: React.ComponentType<any>) {
  return function AuthenticatedComponent(props: any & WithAuthProps) {
    const { requiredRole, requireAuth = true, fallback, ...componentProps } = props;
    
    return withAuth({
      children: <Component {...componentProps} />,
      requiredRole,
      requireAuth,
      fallback
    });
  };
}

// Permission checking hooks
export function usePermissions() {
  const { data: session } = useSession();
  
  return {
    isAdmin: session?.user?.role === 'admin',
    isModerator: ['admin', 'moderator'].includes(session?.user?.role || ''),
    isPremium: ['admin', 'moderator', 'premium_user'].includes(session?.user?.role || ''),
    isUser: !!session?.user,
    hasRole: (role: UserRole) => hasPermission(session?.user?.role, role),
    canPerform: (permission: string) => {
      // This would integrate with your permission system from the store
      return true; // Placeholder
    }
  };
}

// Component-level permission wrapper
export function PermissionGate({ 
  children, 
  requiredRole, 
  fallback = null 
}: { 
  children: ReactNode; 
  requiredRole: UserRole; 
  fallback?: ReactNode; 
}) {
  const { data: session } = useSession();
  
  if (!hasPermission(session?.user?.role, requiredRole)) {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
}

export default withAuth;