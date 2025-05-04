  import React from 'react';
  import { Box, Link, List, ListItem, Heading } from '@chakra-ui/react';
  import { useTableOfContents } from '@/hooks/useTableOfContents';
  import { useActiveSection } from '@/hooks/useActiveSection';

  const TableOfContents: React.FC = () => {
    const toc = useTableOfContents();
    const activeId = useActiveSection();

    return (
      <Box
        as="nav"
        position="sticky"
        top="4rem"
        width="250px"
        display={{ base: 'none', md: 'block' }}
        p={6}
        bg="gray.50"
        borderRadius="md"
        boxShadow="lg"
        border="1px solid"
        borderColor="gray.200"
      >
        <Heading size="md" mb={4} color="blue.600">
          Table of Contents
        </Heading>
        <List spacing={4}>
          {toc.map((item) => (
            <ListItem key={item.id}>
              <Link
                href={`#${item.id}`}
                color={activeId === item.id ? 'blue.800' : 'blue.500'}
                fontWeight={activeId === item.id ? 'bold' : 'medium'}
                _hover={{
                  textDecoration: 'underline',
                }}
              >
                {item.text}
              </Link>
            </ListItem>
          ))}
        </List>
      </Box>
    );
  };

  export default TableOfContents;
