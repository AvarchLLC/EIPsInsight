import React, { useState } from 'react';
import {
  Box,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Text,
  HStack,
  VStack,
  Badge,
  IconButton,
  useColorModeValue,
  useToast,
  Button,
  Tooltip,
  Flex,
  Spinner,
} from '@chakra-ui/react';
import { 
  ChevronDownIcon, 
  SettingsIcon, 
  EditIcon, 
  ExternalLinkIcon,
  RepeatIcon 
} from '@chakra-ui/icons';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useUserStore } from '@/stores/userStore';
import { User, LogOut, Shield, Zap, UserCheck } from 'react-feather';
import { Crown } from 'lucide-react';
interface UserAvatarMenuProps {
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  variant?: 'compact' | 'expanded';
}

export default function UserAvatarMenu({ 
  size = 'md', 
  showLabel = true, 
  variant = 'expanded' 
}: UserAvatarMenuProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const toast = useToast();
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Enhanced user store integration
  const { user, setUser, clearUser } = useUserStore();

  // Color mode values
  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');
  const badgeColorScheme = useColorModeValue('blue', 'blue');

  const handleRefresh = async () => {
    if (!session?.user) return;
    
    setIsRefreshing(true);
    try {
      const response = await fetch('/api/user/profile');
      const data = await response.json();
      
      if (response.ok && data.user) {
        // Update the user store with fresh data
        setUser(data.user);
        
        toast({
          title: 'Profile refreshed',
          description: 'Your profile data has been updated',
          status: 'success',
          duration: 2000,
          isClosable: true,
        });
      } else {
        throw new Error(data.error || 'Failed to refresh profile');
      }
    } catch (error) {
      toast({
        title: 'Refresh failed',
        description: 'Could not fetch latest profile data',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleSignOut = async () => {
    try {
      clearUser();
      await signOut({ redirect: false });
      
      toast({
        title: 'Signed out successfully',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
      
      router.push('/');
    } catch (error) {
      toast({
        title: 'Sign out failed',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const getRoleIcon = (role?: string) => {
    switch (role) {
      case 'admin':
        return <Shield size={14} />;
      case 'moderator':
        return <UserCheck size={14} />;
      case 'premium_user':
        return <Crown size={14} />;
      default:
        return <User size={14} />;
    }
  };

  const getRoleBadgeColor = (role?: string) => {
    switch (role) {
      case 'admin':
        return 'red';
      case 'moderator':
        return 'purple';
      case 'premium_user':
        return 'blue';
      default:
        return 'gray';
    }
  };

  const getTierBadgeColor = (tier?: string) => {
    switch (tier) {
      case 'Enterprise':
        return 'purple';
      case 'Premium':
        return 'blue';
      case 'Pro':
        return 'green';
      default:
        return 'gray';
    }
  };

  // Loading state
  if (status === 'loading') {
    return (
      <Box p={2}>
        <Spinner size={size} color="blue.500" />
      </Box>
    );
  }

  // Not authenticated state
  if (!session?.user) {
    return (
      <Button
        size={size}
        colorScheme="blue"
        variant="solid"
        onClick={() => signIn()}
        leftIcon={<User size={16} />}
      >
        Sign In
      </Button>
    );
  }

  // Get user data from session or store
  const userData = user || session.user;

  if (variant === 'compact') {
    return (
      <Menu>
        <MenuButton as={Box} cursor="pointer">
          <Tooltip label={`${userData.name} (${userData.role})`} placement="bottom">
            <Avatar
              size={size}
              name={userData.name || userData.email || 'User'}
              src={userData.image || undefined}
              border="2px solid"
              borderColor={borderColor}
              _hover={{ borderColor: 'blue.500' }}
              transition="all 0.2s"
            />
          </Tooltip>
        </MenuButton>
        <MenuList bg={bg} borderColor={borderColor} boxShadow="xl">
          <MenuItem icon={<User size={16} />} onClick={() => router.push('/profile')}>
            Profile
          </MenuItem>
          <MenuItem icon={<SettingsIcon />} onClick={() => router.push('/settings')}>
            Settings
          </MenuItem>
          <MenuDivider />
          <MenuItem icon={<LogOut size={16} />} onClick={handleSignOut}>
            Sign Out
          </MenuItem>
        </MenuList>
      </Menu>
    );
  }

  return (
    <Menu>
      <MenuButton
        as={Button}
        variant="ghost"
        size={size}
        rightIcon={<ChevronDownIcon />}
        _hover={{ bg: hoverBg }}
        _active={{ bg: hoverBg }}
        p={2}
      >
        <HStack spacing={3}>
          <Avatar
            size={size === 'lg' ? 'md' : 'sm'}
            name={userData.name || userData.email || 'User'}
            src={userData.image || undefined}
            border="2px solid"
            borderColor={borderColor}
          />
          
          {showLabel && (
            <VStack spacing={0} align="start" maxW="150px">
              <Text
                fontSize="sm"
                fontWeight="semibold"
                isTruncated
                color={useColorModeValue('gray.800', 'white')}
              >
                {userData.name || userData.email || 'User'}
              </Text>
              <HStack spacing={1}>
                <Badge
                  colorScheme={getRoleBadgeColor(userData.role)}
                  size="xs"
                  variant="subtle"
                >
                  <HStack spacing={1}>
                    {getRoleIcon(userData.role)}
                    <Text fontSize="xs">{userData.role || 'user'}</Text>
                  </HStack>
                </Badge>
                <Badge
                  colorScheme={getTierBadgeColor(userData.tier)}
                  size="xs"
                  variant="outline"
                >
                  {userData.tier || 'Free'}
                </Badge>
              </HStack>
            </VStack>
          )}
        </HStack>
      </MenuButton>

      <MenuList bg={bg} borderColor={borderColor} boxShadow="xl" minW="280px">
        {/* User Info Header */}
        <Box p={4}>
          <HStack spacing={3}>
            <Avatar
              size="md"
              name={userData.name || userData.email || 'User'}
              src={userData.image || undefined}
              border="2px solid"
              borderColor={borderColor}
            />
            <VStack align="start" spacing={1} flex={1}>
              <Text fontWeight="bold" fontSize="md" isTruncated>
                {userData.name || 'User'}
              </Text>
              <Text fontSize="sm" color="gray.500" isTruncated>
                {userData.email}
              </Text>
              <HStack spacing={2}>
                <Badge
                  colorScheme={getRoleBadgeColor(userData.role)}
                  size="sm"
                  variant="subtle"
                >
                  <HStack spacing={1}>
                    {getRoleIcon(userData.role)}
                    <Text>{userData.role || 'user'}</Text>
                  </HStack>
                </Badge>
                <Badge
                  colorScheme={getTierBadgeColor(userData.tier)}
                  size="sm"
                  variant="outline"
                >
                  <HStack spacing={1}>
                    <Zap size={12} />
                    <Text>{userData.tier || 'Free'}</Text>
                  </HStack>
                </Badge>
              </HStack>
            </VStack>
            <IconButton
              aria-label="Refresh profile"
              icon={isRefreshing ? <Spinner size="sm" /> : <RepeatIcon />}
              size="sm"
              variant="ghost"
              onClick={handleRefresh}
              isLoading={isRefreshing}
            />
          </HStack>
        </Box>

        <MenuDivider />

        {/* Menu Items */}
        <MenuItem 
          icon={<User size={16} />} 
          onClick={() => router.push('/profile')}
          _hover={{ bg: hoverBg }}
        >
          <VStack align="start" spacing={0}>
            <Text>Profile</Text>
            <Text fontSize="xs" color="gray.500">
              Manage your account
            </Text>
          </VStack>
        </MenuItem>

        <MenuItem 
          icon={<SettingsIcon />} 
          onClick={() => router.push('/settings')}
          _hover={{ bg: hoverBg }}
        >
          <VStack align="start" spacing={0}>
            <Text>Settings</Text>
            <Text fontSize="xs" color="gray.500">
              Preferences & privacy
            </Text>
          </VStack>
        </MenuItem>

        {/* Admin/Moderator Menu Items */}
        {(userData.role === 'admin' || userData.role === 'moderator') && (
          <>
            <MenuDivider />
            <MenuItem 
              icon={<Shield size={16} />} 
              onClick={() => router.push('/admin')}
              _hover={{ bg: hoverBg }}
            >
              <VStack align="start" spacing={0}>
                <Text>Admin Panel</Text>
                <Text fontSize="xs" color="gray.500">
                  Manage users & system
                </Text>
              </VStack>
            </MenuItem>
          </>
        )}

        {/* Premium Features */}
        {userData.tier !== 'Free' && (
          <>
            <MenuDivider />
            <MenuItem 
              icon={<Crown size={16} />} 
              onClick={() => router.push('/premium')}
              _hover={{ bg: hoverBg }}
            >
              <VStack align="start" spacing={0}>
                <Text>Premium Features</Text>
                <Text fontSize="xs" color="gray.500">
                  Advanced tools & analytics
                </Text>
              </VStack>
            </MenuItem>
          </>
        )}

        <MenuDivider />

        {/* Sign Out */}
        <MenuItem 
          icon={<LogOut size={16} />} 
          onClick={handleSignOut}
          _hover={{ bg: 'red.50', color: 'red.600' }}
          color="red.500"
        >
          <Text>Sign Out</Text>
        </MenuItem>
      </MenuList>
    </Menu>
  );
}