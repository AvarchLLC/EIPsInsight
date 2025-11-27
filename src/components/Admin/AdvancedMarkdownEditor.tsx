'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Box,
  Button,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  VStack,
  HStack,
  Text,
  Badge,
  Divider,
  useColorModeValue,
  Icon,
  Textarea,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Code,
  List,
  ListItem,
  Link as ChakraLink,
} from '@chakra-ui/react';
import { FaEdit, FaEye, FaImage, FaClock, FaList } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

interface ToC {
  id: string;
  text: string;
  level: number;
}

interface AdvancedMarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  onImageUpload?: (file: File) => Promise<string>;
  placeholder?: string;
}

export default function AdvancedMarkdownEditor({
  value,
  onChange,
  onImageUpload,
  placeholder = 'Write your blog content in Markdown...',
}: AdvancedMarkdownEditorProps) {
  const [uploading, setUploading] = useState(false);
  const [toc, setToc] = useState<ToC[]>([]);
  const [readingTime, setReadingTime] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const tocBgColor = useColorModeValue('gray.50', 'gray.700');

  // Calculate reading time and generate ToC
  useEffect(() => {
    // Calculate reading time (average 200 words per minute)
    const words = value.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / 200);
    setReadingTime(minutes);

    // Generate Table of Contents
    const headingRegex = /^(#{1,6})\s+(.+)$/gm;
    const headings: ToC[] = [];
    let match;

    while ((match = headingRegex.exec(value)) !== null) {
      const level = match[1].length;
      const text = match[2].trim();
      const id = text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      
      headings.push({ id, text, level });
    }

    setToc(headings);
  }, [value]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onImageUpload) return;

    setUploading(true);
    try {
      const url = await onImageUpload(file);
      const imageMarkdown = `\n![${file.name}](${url})\n`;
      onChange(value + imageMarkdown);
    } catch (error) {
      console.error('Image upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  const insertMarkdown = (before: string, after: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const newText =
      value.substring(0, start) +
      before +
      selectedText +
      after +
      value.substring(end);

    onChange(newText);

    // Reset cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + before.length,
        start + before.length + selectedText.length
      );
    }, 0);
  };

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(`preview-${id}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <VStack spacing={4} align="stretch">
      {/* Toolbar */}
      <Box
        p={3}
        bg={bgColor}
        borderRadius="md"
        borderWidth="1px"
        borderColor={borderColor}
      >
        <HStack spacing={2} wrap="wrap">
          <Button
            size="sm"
            leftIcon={<FaImage />}
            isLoading={uploading}
            onClick={() => document.getElementById('md-image-upload')?.click()}
          >
            Image
          </Button>
          <input
            id="md-image-upload"
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleImageUpload}
          />
          <Divider orientation="vertical" h="20px" />
          <Button size="sm" onClick={() => insertMarkdown('**', '**')}>
            Bold
          </Button>
          <Button size="sm" onClick={() => insertMarkdown('*', '*')}>
            Italic
          </Button>
          <Button size="sm" onClick={() => insertMarkdown('~~', '~~')}>
            Strike
          </Button>
          <Divider orientation="vertical" h="20px" />
          <Button size="sm" onClick={() => insertMarkdown('# ', '')}>
            H1
          </Button>
          <Button size="sm" onClick={() => insertMarkdown('## ', '')}>
            H2
          </Button>
          <Button size="sm" onClick={() => insertMarkdown('### ', '')}>
            H3
          </Button>
          <Divider orientation="vertical" h="20px" />
          <Button size="sm" onClick={() => insertMarkdown('[', '](url)')}>
            Link
          </Button>
          <Button size="sm" onClick={() => insertMarkdown('`', '`')}>
            Code
          </Button>
          <Button size="sm" onClick={() => insertMarkdown('```\n', '\n```')}>
            Block
          </Button>
          <Divider orientation="vertical" h="20px" />
          <HStack spacing={2}>
            <Icon as={FaClock} color="gray.500" />
            <Text fontSize="sm" color="gray.600">
              {readingTime} min read
            </Text>
          </HStack>
          {toc.length > 0 && (
            <>
              <Divider orientation="vertical" h="20px" />
              <Badge colorScheme="blue">
                <HStack spacing={1}>
                  <Icon as={FaList} boxSize={3} />
                  <Text>{toc.length} headings</Text>
                </HStack>
              </Badge>
            </>
          )}
        </HStack>
      </Box>

      {/* Editor and Preview Tabs */}
      <Tabs variant="enclosed" colorScheme="blue">
        <TabList>
          <Tab>
            <HStack>
              <Icon as={FaEdit} />
              <Text>Write</Text>
            </HStack>
          </Tab>
          <Tab>
            <HStack>
              <Icon as={FaEye} />
              <Text>Preview</Text>
            </HStack>
          </Tab>
        </TabList>

        <TabPanels>
          {/* Write Tab */}
          <TabPanel px={0}>
            <Textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              minH="500px"
              fontFamily="monospace"
              fontSize="sm"
              resize="vertical"
            />
          </TabPanel>

          {/* Preview Tab */}
          <TabPanel px={0}>
            <HStack align="start" spacing={4}>
              {/* Table of Contents Sidebar */}
              {toc.length > 0 && (
                <Box
                  w="250px"
                  position="sticky"
                  top="20px"
                  display={{ base: 'none', md: 'block' }}
                >
                  <Accordion allowToggle defaultIndex={[0]}>
                    <AccordionItem border="none">
                      <AccordionButton
                        bg={tocBgColor}
                        borderRadius="md"
                        _hover={{ bg: useColorModeValue('gray.100', 'gray.600') }}
                      >
                        <Box flex="1" textAlign="left" fontWeight="semibold">
                          <HStack>
                            <Icon as={FaList} />
                            <Text>Table of Contents</Text>
                          </HStack>
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>
                      <AccordionPanel pb={4}>
                        <List spacing={2}>
                          {toc.map((heading, index) => (
                            <ListItem
                              key={index}
                              pl={(heading.level - 1) * 4}
                              fontSize={heading.level === 1 ? 'sm' : 'xs'}
                              fontWeight={heading.level === 1 ? 'semibold' : 'normal'}
                            >
                              <ChakraLink
                                color="blue.500"
                                onClick={() => scrollToHeading(heading.id)}
                                _hover={{ textDecoration: 'underline', cursor: 'pointer' }}
                              >
                                {heading.text}
                              </ChakraLink>
                            </ListItem>
                          ))}
                        </List>
                      </AccordionPanel>
                    </AccordionItem>
                  </Accordion>
                </Box>
              )}

              {/* Preview Content */}
              <Box
                flex={1}
                minH="500px"
                p={6}
                borderWidth="1px"
                borderRadius="md"
                borderColor={borderColor}
                className="markdown-preview"
                sx={{
                  '& h1, & h2, & h3, & h4, & h5, & h6': {
                    scrollMarginTop: '80px',
                  },
                  '& h1': {
                    fontSize: '2xl',
                    fontWeight: 'bold',
                    mt: 6,
                    mb: 4,
                  },
                  '& h2': {
                    fontSize: 'xl',
                    fontWeight: 'bold',
                    mt: 5,
                    mb: 3,
                  },
                  '& h3': {
                    fontSize: 'lg',
                    fontWeight: 'semibold',
                    mt: 4,
                    mb: 2,
                  },
                  '& p': {
                    mb: 3,
                    lineHeight: '1.7',
                  },
                  '& code': {
                    bg: useColorModeValue('gray.100', 'gray.700'),
                    px: 1,
                    py: 0.5,
                    borderRadius: 'sm',
                    fontSize: 'sm',
                  },
                  '& pre': {
                    bg: useColorModeValue('gray.900', 'gray.900'),
                    p: 4,
                    borderRadius: 'md',
                    overflow: 'auto',
                    my: 4,
                  },
                  '& pre code': {
                    bg: 'transparent',
                    color: 'white',
                  },
                  '& ul, & ol': {
                    ml: 4,
                    mb: 3,
                  },
                  '& li': {
                    mb: 1,
                  },
                  '& blockquote': {
                    borderLeftWidth: '4px',
                    borderLeftColor: 'blue.500',
                    pl: 4,
                    py: 2,
                    my: 4,
                    fontStyle: 'italic',
                    bg: useColorModeValue('blue.50', 'blue.900'),
                  },
                  '& img': {
                    maxW: '100%',
                    borderRadius: 'md',
                    my: 4,
                  },
                  '& table': {
                    width: '100%',
                    borderCollapse: 'collapse',
                    my: 4,
                  },
                  '& th, & td': {
                    border: '1px solid',
                    borderColor: borderColor,
                    px: 3,
                    py: 2,
                  },
                  '& th': {
                    bg: tocBgColor,
                    fontWeight: 'semibold',
                  },
                  '& a': {
                    color: 'blue.500',
                    textDecoration: 'underline',
                  },
                }}
              >
                {value ? (
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw as any]}
                    components={{
                      h1: ({ node, ...props }) => {
                        const id = props.children?.toString()
                          .toLowerCase()
                          .replace(/[^a-z0-9]+/g, '-')
                          .replace(/(^-|-$)/g, '');
                        return <h1 id={`preview-${id}`} {...props} />;
                      },
                      h2: ({ node, ...props }) => {
                        const id = props.children?.toString()
                          .toLowerCase()
                          .replace(/[^a-z0-9]+/g, '-')
                          .replace(/(^-|-$)/g, '');
                        return <h2 id={`preview-${id}`} {...props} />;
                      },
                      h3: ({ node, ...props }) => {
                        const id = props.children?.toString()
                          .toLowerCase()
                          .replace(/[^a-z0-9]+/g, '-')
                          .replace(/(^-|-$)/g, '');
                        return <h3 id={`preview-${id}`} {...props} />;
                      },
                    }}
                  >
                    {value}
                  </ReactMarkdown>
                ) : (
                  <Text color="gray.500">Nothing to preview yet...</Text>
                )}
              </Box>
            </HStack>
          </TabPanel>
        </TabPanels>
      </Tabs>

      {/* Markdown Help */}
      <Accordion allowToggle>
        <AccordionItem>
          <AccordionButton>
            <Box flex="1" textAlign="left">
              <Text fontSize="sm" fontWeight="medium">
                Markdown Guide
              </Text>
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel pb={4}>
            <VStack align="stretch" spacing={2} fontSize="sm">
              <HStack>
                <Code># H1</Code>
                <Text color="gray.600">Main heading</Text>
              </HStack>
              <HStack>
                <Code>## H2</Code>
                <Text color="gray.600">Subheading</Text>
              </HStack>
              <HStack>
                <Code>**bold**</Code>
                <Text color="gray.600">Bold text</Text>
              </HStack>
              <HStack>
                <Code>*italic*</Code>
                <Text color="gray.600">Italic text</Text>
              </HStack>
              <HStack>
                <Code>[link](url)</Code>
                <Text color="gray.600">Hyperlink</Text>
              </HStack>
              <HStack>
                <Code>![alt](image)</Code>
                <Text color="gray.600">Image</Text>
              </HStack>
              <HStack>
                <Code>`code`</Code>
                <Text color="gray.600">Inline code</Text>
              </HStack>
              <HStack>
                <Code>```language```</Code>
                <Text color="gray.600">Code block</Text>
              </HStack>
              <HStack>
                <Code>- item</Code>
                <Text color="gray.600">List item</Text>
              </HStack>
              <HStack>
                <Code>&gt; quote</Code>
                <Text color="gray.600">Blockquote</Text>
              </HStack>
            </VStack>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </VStack>
  );
}
