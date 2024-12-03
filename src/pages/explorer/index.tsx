import React from 'react';
import TransactionSearch from '@/components/SearchTransaction';
import AllLayout from '@/components/Layout';
import RecentBlocks from '@/components/MostRecentBlocks';
import RecentTransactions from '@/components/MostRecentTransactions';
import { Box, Flex } from '@chakra-ui/react';

const Authors: React.FC = () => {
  return (
    <>
      <AllLayout>
        <TransactionSearch />

        {/* Flex container to align RecentBlocks and RecentTransactions side by side */}
        <Flex
          direction={{ base: 'column', md: 'row' }} // Stack on small screens, side by side on medium and larger screens
          justify="space-between" 
          gap={4} // Add some gap between the blocks
          mt={8} // Margin top for spacing
        >
          {/* Recent Blocks Component */}
          <Box flex="1">
            <RecentBlocks />
          </Box>

          {/* Recent Transactions Component */}
          <Box flex="1">
            <RecentTransactions />
          </Box>
        </Flex>
      </AllLayout>
    </>
  );
};

export default Authors;
