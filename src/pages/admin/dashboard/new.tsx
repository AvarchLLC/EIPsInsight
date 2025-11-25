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
} from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { FaImage, FaEye, FaEdit } from 'react-icons/fa';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function NewBlogPost() {
  const router = useRouter();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
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

  useEffect(() => {
    setMounted(true);
    checkAuth();
  }, []);

  if (!mounted) {
    return null;
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleTitleChange = (title: string) => {
    setFormData({
      ...formData,
      title,
      slug: generateSlug(title),
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
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

  const handleSubmit = async (e: FormEvent, publish = false) => {
    e.preventDefault();
    setLoading(true);

    try {
      const tagsArray = formData.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      const response = await fetch('/api/admin/blogs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          tags: tagsArray,
          published: publish,
        }),
      });

      if (response.ok) {
        toast({
          title: publish ? 'Blog published!' : 'Draft saved!',
          status: 'success',
          duration: 3000,
        });
        router.push('/admin/dashboard');
      } else {
        const data = await response.json();
        toast({
          title: 'Error',
          description: data.error || 'Failed to save blog',
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
      setLoading(false);
    }
  };

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
              <Heading size="lg">Create New Blog Post</Heading>
            </HStack>
          </HStack>

          <form onSubmit={(e) => handleSubmit(e, false)}>
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
                      onChange={(e) => handleTitleChange(e.target.value)}
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
                  isLoading={loading}
                >
                  Save as Draft
                </Button>
                <Button
                  colorScheme="blue"
                  isLoading={loading}
                  onClick={(e) => handleSubmit(e, true)}
                >
                  Publish
                </Button>
              </HStack>
            </VStack>
          </form>
        </VStack>
      </Container>
    </AllLayout>
  );
}
