import { 
    Box, 
    IconButton, 
    Tooltip, 
    Drawer, 
    DrawerOverlay, 
    DrawerContent, 
    DrawerCloseButton, 
    DrawerHeader, 
    DrawerBody, 
    List, 
    ListItem, 
    Link, 
    Text,
    useDisclosure,
    useColorModeValue,
    Flex,
    Badge
  } from '@chakra-ui/react';
  import { FiBookmark } from 'react-icons/fi';
  import { useBookmarks } from './BookmarkContext';
  
  const BookmarkFloater = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { bookmarks, toggleBookmark } = useBookmarks();
  
    const headingColorLight = "#333";
    const headingColorDark = "#F5F5F5";
    const headingBgGradientLight = "linear(to-r, #30A0E0, #ffffff)";
    const headingBgGradientDark = "linear(to-r, #30A0E0, #F5F5F5)";
  
    const removeBookmark = (url: string) => {
      toggleBookmark(url, ''); // Title isn't needed for removal
    };
  
    return (
      <>
        <Box
          zIndex="1000"
          borderRadius="50%"
        >
          <Tooltip label="View Bookmarks" placement="left">
            <IconButton
              aria-label="Bookmarks"
              icon={<FiBookmark />}
              size="lg"
              colorScheme="teal"
              borderRadius="50%"
              onClick={onOpen}
              sx={{
                boxShadow: `
                  0 5px 15px rgba(0, 0, 0, 0.3),
                  0 10px 30px rgba(0, 0, 0, 0.2),
                  inset 0 -3px 5px rgba(255, 255, 255, 0.2)
                `,
                transform: 'perspective(500px) translateZ(20px)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                bgGradient: useColorModeValue(headingBgGradientLight, headingBgGradientDark),
                color: useColorModeValue(headingColorLight, headingColorDark),
                _hover: {
                  transform: 'perspective(500px) translateZ(30px)',
                  boxShadow: `
                    0 8px 20px rgba(0, 0, 0, 0.4),
                    0 15px 40px rgba(0, 0, 0, 0.3),
                    inset 0 -5px 10px rgba(255, 255, 255, 0.3)
                  `,
                },
              }}
            />
          </Tooltip>
        </Box>
  
        <Drawer
          isOpen={isOpen}
          placement="right"
          onClose={onClose}
          size="md"
        >
          <DrawerOverlay bg="blackAlpha.600" />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader
              bgGradient={useColorModeValue(headingBgGradientLight, headingBgGradientDark)}
              color={useColorModeValue(headingColorLight, headingColorDark)}
            >
              <Flex align="center">
                <FiBookmark style={{ marginRight: '10px' }} />
                Saved Bookmarks
                <Badge ml={2} colorScheme="teal">
                  {bookmarks?.length}
                </Badge>
              </Flex>
            </DrawerHeader>
            <DrawerBody>
              {bookmarks?.length === 0 ? (
                <Text mt={4} color="gray.500">
                  No bookmarks saved yet. Click the bookmark icon on any page to save it.
                </Text>
              ) : (
                <List spacing={3} mt={4}>
                  {bookmarks?.map((bookmark, index) => (
                    <ListItem 
                      key={index}
                      p={3}
                      borderRadius="md"
                      _hover={{ bg: useColorModeValue('gray.100', 'gray.700') }}
                    >
                      <Flex justify="space-between" align="center">
                        <Link href={bookmark.url} isExternal flex="1">
                          <Text fontWeight="bold">{bookmark.title}</Text>
                          <Text fontSize="sm" color="gray.500" isTruncated>
                            {bookmark.url}
                          </Text>
                        </Link>
                        <IconButton
                          aria-label="Remove bookmark"
                          icon={<FiBookmark />}
                          size="sm"
                          colorScheme="red"
                          variant="ghost"
                          onClick={() => removeBookmark(bookmark.url)}
                        />
                      </Flex>
                    </ListItem>
                  ))}
                </List>
              )}
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </>
    );
  };
  
  export default BookmarkFloater;