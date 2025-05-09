'use client';
import {
  Box,
  Flex,
  IconButton,
  VStack,
  Tooltip,
  useColorMode,
  useBreakpointValue,
} from '@chakra-ui/react';
import { FiMenu } from 'react-icons/fi';
import { useSidebar } from './SideBarContext';

export default function Sidebar() {
  const { isCollapsed, toggleSidebar, sections } = useSidebar();
  const { colorMode, toggleColorMode } = useColorMode(); // Hook for color mode
  const handleScroll = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const sidebarWidth = useBreakpointValue({ base: '60px', md: isCollapsed ? '60px' : '200px' });

  return (
    <Flex
      direction="column"
      bg={colorMode === 'dark' ? 'gray.800' : 'gray.100'} // Light and dark background
      color={colorMode === 'dark' ? 'white' : 'black'} // Text color based on color mode
      minH="100vh"
      width={sidebarWidth}
      transition="width 0.2s ease"
      position="fixed"
      zIndex="999"
    >
      <IconButton
        aria-label="Toggle Sidebar"
        icon={<FiMenu />}
        onClick={toggleSidebar}
        m="2"
        alignSelf="flex-end"
        size="sm"
        variant="ghost"
        colorScheme={colorMode === 'dark' ? 'whiteAlpha' : 'blackAlpha'} // Icon button color scheme
      />
      <VStack spacing={4} align="stretch" mt={4}>
        {sections.map((section) => (
          <Tooltip
            key={section.id}
            label={section.label}
            placement="right"
            isDisabled={!isCollapsed}
          >
            <Flex
              align="center"
              p={2}
              mx={2}
              borderRadius="md"
              _hover={{
                bg: colorMode === 'dark' ? 'gray.700' : 'gray.300', // Hover background color
                cursor: 'pointer',
              }}
              onClick={() => handleScroll(section.id)}
            >
              <section.icon />
              {!isCollapsed && <Box ml={2}>{section.label}</Box>}
            </Flex>
          </Tooltip>
        ))}
      </VStack>
    </Flex>
  );
}
