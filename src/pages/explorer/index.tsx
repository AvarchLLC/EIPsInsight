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

        {/* Flex container to align RecentBlocks and RecentTransactions one on top of the other */}
        <Flex
          direction="column" // Stack components vertically
          align="center" // Align content to the center
          justify="center" // Center content vertically if needed
          gap={4} // Add some gap between the blocks
          mt={8} // Margin top for spacing
          maxWidth="1500px" // Limit the max width to 1000px
          mx="auto" // Center the content horizontally
          p={4} // Optional padding to avoid content touching edges
        >
          {/* Recent Blocks Component */}
          <Box
            width="100%" // Ensure it takes up full width within the max container
            minWidth="300px" // Set a minimum width to avoid shrinking too small
          >
            <RecentBlocks />
          </Box>

          {/* Recent Transactions Component */}
          <Box
            width="100%" // Ensure it takes up full width within the max container
            minWidth="300px" // Set a minimum width to avoid shrinking too small
          >
            <RecentTransactions />
          </Box>
        </Flex>
      </AllLayout>
    </>
  );
};

export default Authors;
