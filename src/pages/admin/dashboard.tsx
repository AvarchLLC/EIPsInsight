import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import AllLayout from '@/components/Layout';
import {
  Box,
  Button,
  Container,
  Heading,
  HStack,
  VStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  IconButton,
  useToast,
  Spinner,
  Text,
  Flex,
  Stat,
  StatLabel,
  StatNumber,
  StatGroup,
  StatHelpText,
  StatArrow,
  useColorModeValue,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Grid,
  SimpleGrid,
  Avatar,
  Checkbox,
  Divider,
  Tooltip,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Progress,
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon, AddIcon, ViewIcon, SearchIcon, ChevronDownIcon, DownloadIcon, StarIcon } from '@chakra-ui/icons';
import { FaFileAlt, FaEye, FaEyeSlash, FaSignOutAlt, FaFilter, FaDatabase, FaFile, FaClock, FaCheckCircle, FaExclamationTriangle, FaChartLine, FaCalendar, FaTag, FaStar } from 'react-icons/fa';

interface Blog {
  id: string;
  slug: string;
  title: string;
  author: string;
  category?: string;
  published: boolean;
  created_at: string;
  updated_at: string;
  isStatic?: boolean;
  summary?: string;
  reading_time?: number;
  featured?: boolean;
  tags?: string[];
}

export default function AdminDashboard() {
  const router = useRouter();
  const toast = useToast();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [mounted, setMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft'>('all');
  const [viewMode, setViewMode] = useState<'all' | 'database' | 'static'>('all');
  const [selectedBlogs, setSelectedBlogs] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'author'>('date');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [analytics, setAnalytics] = useState({
    totalViews: 0,
    avgReadingTime: 0,
    recentActivity: 0,
  });

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/admin/auth/session');
      if (!response.ok) {
        router.push('/admin/login');
        return;
      }
      const data = await response.json();
      setUser(data.user);
    } catch (error) {
      router.push('/admin/login');
    }
  };

  const fetchBlogs = async () => {
    try {
      const [dbResponse, staticResponse] = await Promise.all([
        fetch('/api/admin/blogs'),
        fetch('/api/admin/blogs/static')
      ]);
      
      const dbBlogs = dbResponse.ok ? (await dbResponse.json()).blogs : [];
      const staticBlogs = staticResponse.ok ? (await staticResponse.json()).posts : [];
      
      const allBlogs = [...dbBlogs, ...staticBlogs].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      
      setBlogs(allBlogs);
    } catch (error) {
      console.error('Failed to fetch blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth/logout', { method: 'POST' });
      router.push('/admin/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return;

    try {
      const response = await fetch(`/api/admin/blogs/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast({
          title: 'Blog deleted',
          status: 'success',
          duration: 3000,
        });
        fetchBlogs();
      } else {
        toast({
          title: 'Delete failed',
          status: 'error',
          duration: 3000,
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete blog',
        status: 'error',
        duration: 3000,
      });
    }
  };

  useEffect(() => {
    setMounted(true);
    checkAuth();
    fetchBlogs();
  }, []);

  if (!mounted) {
    return null;
  }

  // Advanced filter and search with view mode
  const filteredBlogs = blogs.filter(blog => {
    const matchesSearch = 
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.summary?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = 
      filterStatus === 'all' ||
      (filterStatus === 'published' && blog.published) ||
      (filterStatus === 'draft' && !blog.published);
    
    const matchesViewMode = 
      viewMode === 'all' ||
      (viewMode === 'database' && !blog.isStatic) ||
      (viewMode === 'static' && blog.isStatic);
    
    return matchesSearch && matchesFilter && matchesViewMode;
  });

  // Sort blogs
  const sortedBlogs = [...filteredBlogs].sort((a, b) => {
    switch (sortBy) {
      case 'title':
        return a.title.localeCompare(b.title);
      case 'author':
        return a.author.localeCompare(b.author);
      case 'date':
      default:
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
  });

  const databaseBlogs = blogs.filter(b => !b.isStatic);
  const staticBlogs = blogs.filter(b => b.isStatic);
  const featuredBlogs = blogs.filter(b => b.featured);

  if (loading) {
    return (
      <AllLayout>
        <Container maxW="container.xl" py={10}>
          <Flex justify="center" align="center" minH="50vh">
            <Spinner size="xl" color="blue.500" thickness="4px" />
          </Flex>
        </Container>
      </AllLayout>
    );
  }

  return (
    <AllLayout>
      <Container maxW="container.xl" py={8}>
        <VStack spacing={6} align="stretch">
          {/* Header */}
          <Flex justify="space-between" align="center" wrap="wrap" gap={4}>
            <Box>
              <Heading size="lg">Blog Admin Dashboard</Heading>
              {user && (
                <Text color="gray.600" fontSize="sm" mt={1}>
                  Welcome, {user.email}
                </Text>
              )}
            </Box>
            <HStack spacing={3}>
              <Link href="/Blogs" passHref>
                <Button as="a" leftIcon={<ViewIcon />} variant="outline">
                  View Site
                </Button>
              </Link>
              <Button
                leftIcon={<Icon as={FaSignOutAlt} />}
                colorScheme="red"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </HStack>
          </Flex>

          {/* Enhanced Stats Grid */}
          <SimpleGrid columns={{ base: 2, md: 4, lg: 6 }} spacing={4}>
            <Stat
              bg={bgColor}
              p={4}
              borderRadius="xl"
              boxShadow="md"
              border="1px"
              borderColor={borderColor}
            >
              <StatLabel fontSize="xs">Total Blogs</StatLabel>
              <StatNumber fontSize="2xl">{blogs.length}</StatNumber>
              <StatHelpText>
                <Icon as={FaFileAlt} color="blue.500" mr={1} />
                All content
              </StatHelpText>
            </Stat>

            <Stat
              bg={bgColor}
              p={4}
              borderRadius="xl"
              boxShadow="md"
              border="1px"
              borderColor={borderColor}
            >
              <StatLabel fontSize="xs">Database</StatLabel>
              <StatNumber fontSize="2xl" color="purple.500">
                {databaseBlogs.length}
              </StatNumber>
              <StatHelpText>
                <Icon as={FaDatabase} color="purple.500" mr={1} />
                Editable
              </StatHelpText>
            </Stat>

            <Stat
              bg={bgColor}
              p={4}
              borderRadius="xl"
              boxShadow="md"
              border="1px"
              borderColor={borderColor}
            >
              <StatLabel fontSize="xs">Static Files</StatLabel>
              <StatNumber fontSize="2xl" color="gray.500">
                {staticBlogs.length}
              </StatNumber>
              <StatHelpText>
                <Icon as={FaFile} color="gray.500" mr={1} />
                Read-only
              </StatHelpText>
            </Stat>

            <Stat
              bg={bgColor}
              p={4}
              borderRadius="xl"
              boxShadow="md"
              border="1px"
              borderColor={borderColor}
            >
              <StatLabel fontSize="xs">Published</StatLabel>
              <StatNumber fontSize="2xl" color="green.500">
                {blogs.filter((b) => b.published).length}
              </StatNumber>
              <StatHelpText>
                <Icon as={FaCheckCircle} color="green.500" mr={1} />
                Live now
              </StatHelpText>
            </Stat>

            <Stat
              bg={bgColor}
              p={4}
              borderRadius="xl"
              boxShadow="md"
              border="1px"
              borderColor={borderColor}
            >
              <StatLabel fontSize="xs">Drafts</StatLabel>
              <StatNumber fontSize="2xl" color="orange.500">
                {blogs.filter((b) => !b.published).length}
              </StatNumber>
              <StatHelpText>
                <Icon as={FaExclamationTriangle} color="orange.500" mr={1} />
                Pending
              </StatHelpText>
            </Stat>

            <Stat
              bg={bgColor}
              p={4}
              borderRadius="xl"
              boxShadow="md"
              border="1px"
              borderColor={borderColor}
            >
              <StatLabel fontSize="xs">Featured</StatLabel>
              <StatNumber fontSize="2xl" color="yellow.500">
                {featuredBlogs.length}
              </StatNumber>
              <StatHelpText>
                <Icon as={FaStar} color="yellow.500" mr={1} />
                Highlighted
              </StatHelpText>
            </Stat>
          </SimpleGrid>

          {/* Search and Filter Bar */}
          <Box
            bg={bgColor}
            p={4}
            borderRadius="xl"
            boxShadow="md"
            border="1px"
            borderColor={borderColor}
          >
            <VStack spacing={4} align="stretch">
              <Flex gap={4} wrap="wrap" align="center" justify="space-between">
                <InputGroup maxW="500px" flex={1}>
                  <InputLeftElement>
                    <SearchIcon color="gray.400" />
                  </InputLeftElement>
                  <Input
                    placeholder="Search by title, author, slug, summary..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    size="md"
                  />
                </InputGroup>
                
                <HStack spacing={3} wrap="wrap">
                  <Menu>
                    <MenuButton
                      as={Button}
                      rightIcon={<ChevronDownIcon />}
                      leftIcon={<Icon as={FaFilter} />}
                      size="md"
                      variant="outline"
                    >
                      {filterStatus === 'all' ? 'All Status' : filterStatus === 'published' ? 'Published' : 'Drafts'}
                    </MenuButton>
                    <MenuList>
                      <MenuItem icon={<FaFileAlt />} onClick={() => setFilterStatus('all')}>
                        All Status
                      </MenuItem>
                      <MenuItem icon={<FaCheckCircle />} onClick={() => setFilterStatus('published')}>
                        Published Only
                      </MenuItem>
                      <MenuItem icon={<FaExclamationTriangle />} onClick={() => setFilterStatus('draft')}>
                        Drafts Only
                      </MenuItem>
                    </MenuList>
                  </Menu>

                  <Menu>
                    <MenuButton
                      as={Button}
                      rightIcon={<ChevronDownIcon />}
                      size="md"
                      variant="outline"
                    >
                      Sort: {sortBy === 'date' ? 'Date' : sortBy === 'title' ? 'Title' : 'Author'}
                    </MenuButton>
                    <MenuList>
                      <MenuItem icon={<FaCalendar />} onClick={() => setSortBy('date')}>
                        By Date
                      </MenuItem>
                      <MenuItem icon={<FaFileAlt />} onClick={() => setSortBy('title')}>
                        By Title
                      </MenuItem>
                      <MenuItem icon={<FaTag />} onClick={() => setSortBy('author')}>
                        By Author
                      </MenuItem>
                    </MenuList>
                  </Menu>
                  
                  <Link href="/admin/dashboard/new" passHref>
                    <Button as="a" leftIcon={<AddIcon />} colorScheme="blue" size="md">
                      New Blog
                    </Button>
                  </Link>
                </HStack>
              </Flex>

              {/* Quick View Mode Tabs */}
              <HStack spacing={2}>
                <Button
                  size="sm"
                  variant={viewMode === 'all' ? 'solid' : 'ghost'}
                  colorScheme={viewMode === 'all' ? 'blue' : 'gray'}
                  leftIcon={<Icon as={FaFileAlt} />}
                  onClick={() => setViewMode('all')}
                >
                  All ({blogs.length})
                </Button>
                <Button
                  size="sm"
                  variant={viewMode === 'database' ? 'solid' : 'ghost'}
                  colorScheme={viewMode === 'database' ? 'purple' : 'gray'}
                  leftIcon={<Icon as={FaDatabase} />}
                  onClick={() => setViewMode('database')}
                >
                  Database ({databaseBlogs.length})
                </Button>
                <Button
                  size="sm"
                  variant={viewMode === 'static' ? 'solid' : 'ghost'}
                  colorScheme={viewMode === 'static' ? 'gray' : 'gray'}
                  leftIcon={<Icon as={FaFile} />}
                  onClick={() => setViewMode('static')}
                >
                  Static ({staticBlogs.length})
                </Button>
              </HStack>
            </VStack>
          </Box>

          {/* Results Count & Info */}
          <Flex justify="space-between" align="center" wrap="wrap" gap={2}>
            <HStack>
              <Heading size="md">
                Blog Posts ({sortedBlogs.length})
              </Heading>
              {(searchTerm || filterStatus !== 'all' || viewMode !== 'all') && (
                <Badge colorScheme="blue">Filtered</Badge>
              )}
            </HStack>
            <HStack spacing={4} fontSize="sm" color="gray.600">
              {searchTerm && (
                <Text>
                  Showing {sortedBlogs.length} of {blogs.length} total
                </Text>
              )}
              <Text>
                {viewMode === 'all' ? 'All Sources' : viewMode === 'database' ? 'Database Only' : 'Static Only'}
              </Text>
            </HStack>
          </Flex>

          {/* Blogs Table */}
          <Box
            bg={bgColor}
            borderRadius="xl"
            boxShadow="md"
            border="1px"
            borderColor={borderColor}
            overflowX="auto"
          >
            {sortedBlogs.length === 0 ? (
              <Box p={10} textAlign="center">
                <VStack spacing={3}>
                  <Icon as={FaFileAlt} boxSize={12} color="gray.400" />
                  <Text color="gray.500" fontWeight="medium" fontSize="lg">
                    {searchTerm || filterStatus !== 'all' || viewMode !== 'all'
                      ? 'No blogs match your filters'
                      : 'No blog posts yet. Create your first one!'}
                  </Text>
                  {(searchTerm || filterStatus !== 'all' || viewMode !== 'all') && (
                    <Button
                      size="sm"
                      variant="outline"
                      colorScheme="blue"
                      onClick={() => {
                        setSearchTerm('');
                        setFilterStatus('all');
                        setViewMode('all');
                      }}
                    >
                      Clear all filters
                    </Button>
                  )}
                </VStack>
              </Box>
            ) : (
              <Table variant="simple" size="md">
                <Thead>
                  <Tr>
                    <Th>Title</Th>
                    <Th>Author</Th>
                    <Th>Type</Th>
                    <Th>Category</Th>
                    <Th>Status</Th>
                    <Th>Reading</Th>
                    <Th>Date</Th>
                    <Th isNumeric>Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {sortedBlogs.map((blog) => (
                    <Tr key={blog.id} _hover={{ bg: useColorModeValue('gray.50', 'gray.700') }}>
                      <Td>
                        <VStack align="start" spacing={1}>
                          <HStack spacing={2}>
                            {blog.featured && (
                              <Tooltip label="Featured">
                                <Icon as={StarIcon} color="yellow.500" boxSize={4} />
                              </Tooltip>
                            )}
                            <Text fontWeight="medium" fontSize="sm">{blog.title}</Text>
                          </HStack>
                          <Text fontSize="xs" color="gray.500">
                            {blog.slug}
                          </Text>
                          {blog.summary && (
                            <Text fontSize="xs" color="gray.400" noOfLines={1}>
                              {blog.summary}
                            </Text>
                          )}
                        </VStack>
                      </Td>
                      <Td>
                        <Text fontSize="sm">{blog.author}</Text>
                      </Td>
                      <Td>
                        <Badge
                          colorScheme={blog.isStatic ? 'gray' : 'purple'}
                          fontSize="xs"
                          variant="subtle"
                        >
                          {blog.isStatic ? 'Static' : 'Database'}
                        </Badge>
                      </Td>
                      <Td>
                        {blog.category && (
                          <Badge colorScheme="blue" fontSize="xs">{blog.category}</Badge>
                        )}
                      </Td>
                      <Td>
                        <Badge
                          colorScheme={blog.published ? 'green' : 'orange'}
                          fontSize="xs"
                          variant="subtle"
                        >
                          {blog.published ? 'Published' : 'Draft'}
                        </Badge>
                      </Td>
                      <Td>
                        {blog.reading_time ? (
                          <HStack spacing={1}>
                            <Icon as={FaClock} boxSize={3} color="gray.500" />
                            <Text fontSize="xs">{blog.reading_time} min</Text>
                          </HStack>
                        ) : (
                          <Text fontSize="xs" color="gray.400">—</Text>
                        )}
                      </Td>
                      <Td>
                        <Text fontSize="xs" color="gray.600">
                          {new Date(blog.created_at).toLocaleDateString()}
                        </Text>
                      </Td>
                      <Td isNumeric>
                        <HStack justify="flex-end" spacing={2}>
                          {blog.isStatic ? (
                            <>
                              <Link href={`/Blogs/${blog.slug}`} passHref>
                                <IconButton
                                  as="a"
                                  aria-label="View"
                                  icon={<ViewIcon />}
                                  size="sm"
                                  colorScheme="blue"
                                  variant="ghost"
                                  target="_blank"
                                />
                              </Link>
                              <Text fontSize="xs" color="gray.500" fontStyle="italic">
                                Read-only
                              </Text>
                            </>
                          ) : (
                            <>
                              <Link href={`/admin/dashboard/edit/${blog.id}`} passHref>
                                <IconButton
                                  as="a"
                                  aria-label="Edit"
                                  icon={<EditIcon />}
                                  size="sm"
                                  colorScheme="blue"
                                  variant="ghost"
                                />
                              </Link>
                              <IconButton
                                aria-label="Delete"
                                icon={<DeleteIcon />}
                                size="sm"
                                colorScheme="red"
                                variant="ghost"
                                onClick={() => handleDelete(blog.id)}
                              />
                            </>
                          )}
                        </HStack>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            )}
          </Box>
        </VStack>
      </Container>
    </AllLayout>
  );
}
