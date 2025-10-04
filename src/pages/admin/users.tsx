import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  VStack,
  HStack,
  Heading,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Badge,
  Select,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  useToast,
  Spinner,
  Alert,
  AlertIcon,
  FormControl,
  FormLabel,
  Switch,
} from '@chakra-ui/react';
import { withAuth } from '@/components/auth/WithAuth';
import { useState as useReactState } from 'react';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  tier: string;
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
  stats: {
    blogsCreated: number;
    feedbackGiven: number;
  };
}

interface UserManagementResponse {
  users: User[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

function AdminPanel() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 0 });
  
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  useEffect(() => {
    fetchUsers();
  }, [page, search, roleFilter]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        search,
        role: roleFilter,
        sortBy: 'createdAt',
        sortOrder: 'desc'
      });

      const response = await fetch(`/api/admin/users?${params}`);
      const data: UserManagementResponse = await response.json();
      
      if (response.ok) {
        setUsers(data.users);
        setPagination(data.pagination);
      } else {
        throw new Error((data as any).error || 'Failed to fetch users');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch users',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (userId: string, updates: Partial<User>) => {
    try {
      const response = await fetch(`/api/admin/users?userId=${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      const data = await response.json();
      
      if (response.ok) {
        toast({
          title: 'Success',
          description: 'User updated successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        fetchUsers();
        onClose();
      } else {
        throw new Error(data.error || 'Failed to update user');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update user',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const deleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      const response = await fetch(`/api/admin/users?userId=${userId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'User deleted successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        fetchUsers();
      } else {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete user');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete user',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    onOpen();
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'red';
      case 'moderator': return 'purple';
      case 'premium_user': return 'blue';
      default: return 'gray';
    }
  };

  const getTierBadgeColor = (tier: string) => {
    switch (tier) {
      case 'Enterprise': return 'purple';
      case 'Premium': return 'blue';
      case 'Pro': return 'green';
      default: return 'gray';
    }
  };

  return (
    <Container maxW="7xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Box>
          <Heading size="xl" mb={2}>Admin Panel</Heading>
          <Text color="gray.600">Manage users and system settings</Text>
        </Box>

        <Alert status="warning">
          <AlertIcon />
          Admin access: Handle user data responsibly and in accordance with privacy policies.
        </Alert>

        {/* Filters */}
        <HStack spacing={4} flexWrap="wrap">
          <Input
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            maxW="300px"
          />
          <Select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            maxW="200px"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="moderator">Moderator</option>
            <option value="premium_user">Premium User</option>
            <option value="user">User</option>
          </Select>
          <Button onClick={fetchUsers} isLoading={loading}>
            Refresh
          </Button>
        </HStack>

        {/* Users Table */}
        <Box overflowX="auto">
          {loading ? (
            <Box textAlign="center" py={8}>
              <Spinner size="xl" />
            </Box>
          ) : (
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Name</Th>
                  <Th>Email</Th>
                  <Th>Role</Th>
                  <Th>Tier</Th>
                  <Th>Status</Th>
                  <Th>Blogs</Th>
                  <Th>Feedback</Th>
                  <Th>Joined</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {users.map((user) => (
                  <Tr key={user._id}>
                    <Td fontWeight="medium">{user.name}</Td>
                    <Td>{user.email}</Td>
                    <Td>
                      <Badge colorScheme={getRoleBadgeColor(user.role)}>
                        {user.role}
                      </Badge>
                    </Td>
                    <Td>
                      <Badge colorScheme={getTierBadgeColor(user.tier)}>
                        {user.tier}
                      </Badge>
                    </Td>
                    <Td>
                      <VStack spacing={1} align="start">
                        <Badge colorScheme={user.isActive ? 'green' : 'red'}>
                          {user.isActive ? 'Active' : 'Suspended'}
                        </Badge>
                        {user.isVerified && (
                          <Badge colorScheme="blue" size="sm">Verified</Badge>
                        )}
                      </VStack>
                    </Td>
                    <Td>{user.stats?.blogsCreated || 0}</Td>
                    <Td>{user.stats?.feedbackGiven || 0}</Td>
                    <Td>{new Date(user.createdAt).toLocaleDateString()}</Td>
                    <Td>
                      <HStack>
                        <Button size="sm" onClick={() => handleEditUser(user)}>
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          colorScheme="red"
                          variant="outline"
                          onClick={() => deleteUser(user._id)}
                        >
                          Delete
                        </Button>
                      </HStack>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          )}
        </Box>

        {/* Pagination */}
        <HStack justify="center" spacing={4}>
          <Button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            isDisabled={page <= 1}
          >
            Previous
          </Button>
          <Text>
            Page {pagination.page} of {pagination.pages} ({pagination.total} total)
          </Text>
          <Button
            onClick={() => setPage(p => p + 1)}
            isDisabled={page >= pagination.pages}
          >
            Next
          </Button>
        </HStack>

        {/* Edit User Modal */}
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Edit User</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {selectedUser && (
                <VStack spacing={4}>
                  <FormControl>
                    <FormLabel>Role</FormLabel>
                    <Select
                      value={selectedUser.role}
                      onChange={(e) => setSelectedUser({ ...selectedUser, role: e.target.value })}
                    >
                      <option value="user">User</option>
                      <option value="premium_user">Premium User</option>
                      <option value="moderator">Moderator</option>
                      <option value="admin">Admin</option>
                    </Select>
                  </FormControl>

                  <FormControl>
                    <FormLabel>Tier</FormLabel>
                    <Select
                      value={selectedUser.tier}
                      onChange={(e) => setSelectedUser({ ...selectedUser, tier: e.target.value })}
                    >
                      <option value="Free">Free</option>
                      <option value="Pro">Pro</option>
                      <option value="Premium">Premium</option>
                      <option value="Enterprise">Enterprise</option>
                    </Select>
                  </FormControl>

                  <FormControl display="flex" alignItems="center">
                    <FormLabel mb="0">Active Status</FormLabel>
                    <Switch
                      isChecked={selectedUser.isActive}
                      onChange={(e) => setSelectedUser({ ...selectedUser, isActive: e.target.checked })}
                    />
                  </FormControl>

                  <FormControl display="flex" alignItems="center">
                    <FormLabel mb="0">Verified</FormLabel>
                    <Switch
                      isChecked={selectedUser.isVerified}
                      onChange={(e) => setSelectedUser({ ...selectedUser, isVerified: e.target.checked })}
                    />
                  </FormControl>
                </VStack>
              )}
            </ModalBody>

            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onClose}>
                Cancel
              </Button>
              <Button
                colorScheme="blue"
                onClick={() => selectedUser && updateUser(selectedUser._id, selectedUser)}
              >
                Save Changes
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </VStack>
    </Container>
  );
}

export default withAuth({
  children: <AdminPanel />,
  requiredRole: 'admin',
  requireAuth: true
});