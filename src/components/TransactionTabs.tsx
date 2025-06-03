import { Tabs, TabList, Tab, TabPanels, TabPanel, Box, Text, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

interface TransactionTabsProps {
  transactions: Record<string, any[]>; // Object with transaction arrays by type
}

export const TransactionTabs: React.FC<TransactionTabsProps> = ({ transactions }) => {
  // Chakra UI color mode values
  const tabBg = useColorModeValue('gray.100', 'gray.700');
  const tabSelectedBg = 'linear-gradient(145deg, #1e3c72, #2a5298)'; // Techno blue gradient
  const tabColor = useColorModeValue('gray.800', 'white');
  const tabSelectedColor = 'white';
  const panelBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  return (
    <Tabs variant="unstyled">
      <TabList>
        {['All', '0', '1', '2', '3', '4']?.map((tab, index) => (
          <Tab
            key={index}
            px={6}
            py={3}
            mx={1}
            borderRadius="md"
            bg={tabBg}
            color={tabColor}
            _selected={{
              bg: tabSelectedBg,
              color: tabSelectedColor,
              boxShadow: 'md',
            }}
            _hover={{
              bg: 'gray.200',
              transform: 'translateY(-2px)',
              transition: 'transform 0.2s',
            }}
          >
            {tab}
          </Tab>
        ))}
      </TabList>

      <TabPanels mt={4}>
        <TabPanel>
          <Box borderRadius="lg" borderWidth="1px" borderColor={borderColor} bg={panelBg} p={4}>
            {transactions.all?.map((tx, index) => (
              <Box
                key={index}
                p={3}
                borderBottom="1px solid"
                borderColor={borderColor}
                _last={{ borderBottom: 'none' }}
                _hover={{ bg: 'gray.50', transform: 'translateX(4px)', transition: 'transform 0.2s' }}
              >
                <Text fontWeight="semibold">Hash: {tx.hash}</Text>
              </Box>
            ))}
          </Box>
        </TabPanel>
        {[0, 1, 2, 3, 4]?.map((type) => (
          <TabPanel key={type}>
            <Box borderRadius="lg" borderWidth="1px" borderColor={borderColor} bg={panelBg} p={4}>
              {transactions[type]?.length > 0 ? (
                transactions[type]?.map((tx, index) => (
                  <Box
                    key={index}
                    p={3}
                    borderBottom="1px solid"
                    borderColor={borderColor}
                    _last={{ borderBottom: 'none' }}
                    _hover={{ bg: 'gray.50', transform: 'translateX(4px)', transition: 'transform 0.2s' }}
                  >
                    <Text fontWeight="semibold">Hash: {tx.hash}</Text>
                  </Box>
                ))
              ) : (
                <Text color="gray.500">No transactions of this type</Text>
              )}
            </Box>
          </TabPanel>
        ))}
      </TabPanels>
    </Tabs>
  );
};