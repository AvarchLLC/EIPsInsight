import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/router';
import AllLayout from '@/components/Layout';
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  VStack,
  Heading,
  HStack,
  useToast,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Badge,
  useColorModeValue,
  Text,
  IconButton,
  Spinner,
  Flex,
} from '@chakra-ui/react';
import { ArrowBackIcon, DeleteIcon } from '@chakra-ui/icons';
import { FaImage, FaEye, FaEdit } from 'react-icons/fa';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function EditBlogPost() {
  const router = useRouter();
  const { id } = router.query;
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [mounted, setMounted] = useState(false);

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    author: '',
    authorAvatar: '',
    authorRole: '',
    category: '',
    tags: '',
    image: '',
    content: '',
    published: false,
  });

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/admin/auth/session');
      if (!response.ok) {
        router.push('/admin/login');
      }
    } catch (error) {
      router.push('/admin/login');
    }
  };

  const fetchBlog = async () => {
    try {
      const response = await fetch(`/api/admin/blogs/${id}`);
      if (response.ok) {
        const data = await response.json();
        const blog = data.blog;
        setFormData({
          title: blog.title,
          slug: blog.slug,
          author: blog.author,
          authorAvatar: blog.author_avatar || '',
          authorRole: blog.author_role || '',
          category: blog.category || '',
          tags: blog.tags?.join(', ') || '',
          image: blog.image || '',
          content: blog.content,
          published: blog.published,
        });
      } else {
        toast({
          title: 'Failed to load blog',
          status: 'error',
          duration: 3000,
        });
        router.push('/admin/dashboard');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch blog',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    if (id) {
      checkAuth();
      fetchBlog();
    }
  }, [id]);

  if (!mounted) {
    return null;
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formDataObj = new FormData();
      formDataObj.append('file', file);
      formDataObj.append('blogId', id as string);

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formDataObj,
      });

      if (response.ok) {
        const data = await response.json();
        const imageUrl = `![${file.name}](${data.url})`;
        setFormData((prev) => ({
          ...prev,
          content: prev.content + '\n' + imageUrl,
        }));
        toast({
          title: 'Image uploaded',
          status: 'success',
          duration: 2000,
        });
      }
    } catch (error) {
      toast({
        title: 'Upload failed',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: FormEvent, publish?: boolean) => {
    e.preventDefault();
    setSaving(true);

    try {
      const tagsArray = formData.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      const response = await fetch(`/api/admin/blogs/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          tags: tagsArray,
          published: publish !== undefined ? publish : formData.published,
        }),
      });

      if (response.ok) {
        toast({
          title: 'Blog updated successfully!',
          status: 'success',
          duration: 3000,
        });
        router.push('/admin/dashboard');
      } else {
        const data = await response.json();
        toast({
          title: 'Error',
          description: data.error || 'Failed to update blog',
          status: 'error',
          duration: 3000,
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Network error',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
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
        router.push('/admin/dashboard');
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

  if (loading) {
    return (
      <AllLayout>
        <Container maxW="container.xl" py={10}>
          <Flex justify="center" align="center" minH="50vh">
            <Spinner size="xl" color="blue.500" />
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
          <HStack justify="space-between">
            <HStack>
              <Link href="/admin/dashboard" passHref>
                <IconButton
                  as="a"
                  aria-label="Back"
                  icon={<ArrowBackIcon />}
                  variant="ghost"
                />
              </Link>
              <Box>
                <Heading size="lg">Edit Blog Post</Heading>
                <HStack mt={1}>
                  <Badge colorScheme={formData.published ? 'green' : 'orange'}>
                    {formData.published ? 'Published' : 'Draft'}
                  </Badge>
                </HStack>
              </Box>
            </HStack>
            <Button
              leftIcon={<DeleteIcon />}
              colorScheme="red"
              variant="outline"
              onClick={handleDelete}
            >
              Delete
            </Button>
          </HStack>

          <form onSubmit={handleSubmit}>
            <VStack spacing={6} align="stretch">
              {/* Blog Details */}
              <Box
                bg={bgColor}
                p={6}
                borderRadius="xl"
                boxShadow="md"
                border="1px"
                borderColor={borderColor}
              >
                <VStack spacing={4}>
                  <FormControl isRequired>
                    <FormLabel>Title</FormLabel>
                    <Input
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      placeholder="Enter blog title"
                      size="lg"
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>Slug</FormLabel>
                    <Input
                      value={formData.slug}
                      onChange={(e) =>
                        setFormData({ ...formData, slug: e.target.value })
                      }
                      placeholder="url-friendly-slug"
                    />
                  </FormControl>

                  <HStack spacing={4} width="100%">
                    <FormControl isRequired flex={1}>
                      <FormLabel>Author</FormLabel>
                      <Input
                        value={formData.author}
                        onChange={(e) =>
                          setFormData({ ...formData, author: e.target.value })
                        }
                        placeholder="Author name"
                      />
                    </FormControl>

                    <FormControl flex={1}>
                      <FormLabel>Author Role</FormLabel>
                      <Input
                        value={formData.authorRole}
                        onChange={(e) =>
                          setFormData({ ...formData, authorRole: e.target.value })
                        }
                        placeholder="e.g., Editor"
                      />
                    </FormControl>
                  </HStack>

                  <FormControl>
                    <FormLabel>Author Avatar URL</FormLabel>
                    <Input
                      value={formData.authorAvatar}
                      onChange={(e) =>
                        setFormData({ ...formData, authorAvatar: e.target.value })
                      }
                      placeholder="https://..."
                    />
                  </FormControl>

                  <HStack spacing={4} width="100%">
                    <FormControl flex={1}>
                      <FormLabel>Category</FormLabel>
                      <Input
                        value={formData.category}
                        onChange={(e) =>
                          setFormData({ ...formData, category: e.target.value })
                        }
                        placeholder="e.g., Tutorial"
                      />
                    </FormControl>

                    <FormControl flex={1}>
                      <FormLabel>Tags (comma separated)</FormLabel>
                      <Input
                        value={formData.tags}
                        onChange={(e) =>
                          setFormData({ ...formData, tags: e.target.value })
                        }
                        placeholder="ethereum, eip, blockchain"
                      />
                    </FormControl>
                  </HStack>

                  <FormControl>
                    <FormLabel>Featured Image URL</FormLabel>
                    <Input
                      value={formData.image}
                      onChange={(e) =>
                        setFormData({ ...formData, image: e.target.value })
                      }
                      placeholder="https://..."
                    />
                  </FormControl>
                </VStack>
              </Box>

              {/* Content Editor */}
              <Box
                bg={bgColor}
                p={6}
                borderRadius="xl"
                boxShadow="md"
                border="1px"
                borderColor={borderColor}
              >
                <VStack spacing={4} align="stretch">
                  <HStack justify="space-between">
                    <FormLabel mb={0}>Content</FormLabel>
                    <Button
                      size="sm"
                      leftIcon={<FaImage />}
                      isLoading={uploading}
                      onClick={() => document.getElementById('image-upload')?.click()}
                    >
                      Upload Image
                    </Button>
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={handleImageUpload}
                    />
                  </HStack>

                  <Tabs>
                    <TabList>
                      <Tab>
                        <FaEdit style={{ marginRight: 8 }} />
                        Write
                      </Tab>
                      <Tab>
                        <FaEye style={{ marginRight: 8 }} />
                        Preview
                      </Tab>
                    </TabList>

                    <TabPanels>
                      <TabPanel px={0}>
                        <Textarea
                          value={formData.content}
                          onChange={(e) =>
                            setFormData({ ...formData, content: e.target.value })
                          }
                          placeholder="Write your blog content in Markdown..."
                          minH="400px"
                          fontFamily="monospace"
                        />
                      </TabPanel>
                      <TabPanel px={0}>
                        <Box
                          minH="400px"
                          p={4}
                          borderWidth="1px"
                          borderRadius="md"
                          className="markdown-preview"
                        >
                          {formData.content ? (
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                              {formData.content}
                            </ReactMarkdown>
                          ) : (
                            <Text color="gray.500">Nothing to preview yet...</Text>
                          )}
                        </Box>
                      </TabPanel>
                    </TabPanels>
                  </Tabs>
                </VStack>
              </Box>

              {/* Actions */}
              <HStack justify="flex-end" spacing={4}>
                <Link href="/admin/dashboard" passHref>
                  <Button as="a" variant="outline">
                    Cancel
                  </Button>
                </Link>
                <Button
                  type="submit"
                  colorScheme="gray"
                  isLoading={saving}
                >
                  Update
                </Button>
                {!formData.published && (
                  <Button
                    colorScheme="blue"
                    isLoading={saving}
                    onClick={(e) => handleSubmit(e, true)}
                  >
                    Publish
                  </Button>
                )}
                {formData.published && (
                  <Button
                    colorScheme="orange"
                    isLoading={saving}
                    onClick={(e) => handleSubmit(e, false)}
                  >
                    Unpublish
                  </Button>
                )}
              </HStack>
            </VStack>
          </form>
        </VStack>
      </Container>
    </AllLayout>
  );
}
