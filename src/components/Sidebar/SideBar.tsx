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
import { useActiveSection } from './useActiveSection'; // Make sure this path is correct

export default function Sidebar() {
  
  const { isCollapsed, toggleSidebar, sections } = useSidebar();
  const { colorMode } = useColorMode();

  const sidebarWidth = useBreakpointValue({
    base: '60px',
    md: isCollapsed ? '60px' : '220px',
  });

  const activeSectionId = useActiveSection(sections.map((s) => s.id));

  const handleScroll = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <Flex
      direction="column"
      bg={colorMode === 'dark' ? 'gray.900' : 'gray.100'}
      color={colorMode === 'dark' ? 'white' : 'black'}
      minH="100vh"
      width={sidebarWidth}
      transition="width 0.2s ease"
      position="fixed"
      zIndex="999"
      display={{ base: 'none', md: 'flex' }}
      shadow="md"
    >
      <IconButton
        aria-label="Toggle Sidebar"
        icon={<FiMenu />}
        onClick={toggleSidebar}
        m={2}
        alignSelf="flex-end"
        size="sm"
        variant="ghost"
        colorScheme={colorMode === 'dark' ? 'whiteAlpha' : 'blackAlpha'}
      />
      <VStack spacing={2} align="stretch" mt={4} px={2}>
        {sections.map((section) => {
          const isActive = section.id === activeSectionId;
          return (
            <Tooltip
              key={section.id}
              label={section.label}
              placement="right"
              isDisabled={!isCollapsed}
              hasArrow
              openDelay={300}
            >
              <Flex
                align="center"
                p={2}
                borderRadius="md"
                transition="background 0.2s"
                bg={isActive ? (colorMode === 'dark' ? 'gray.700' : 'gray.300') : 'transparent'}
                _hover={{
                  bg: colorMode === 'dark' ? 'gray.700' : 'gray.300',
                  cursor: 'pointer',
                }}
                onClick={() => handleScroll(section.id)}
              >
                <Box as={section.icon} boxSize={5} />
                {!isCollapsed && (
                  <Box ml={3} fontWeight={isActive ? 'bold' : 'normal'}>
                    {section.label}
                  </Box>
                )}
              </Flex>
            </Tooltip>
          );
        })}
      </VStack>
    </Flex>
  );
}
