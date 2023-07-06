import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Box, Button, Spinner } from '@chakra-ui/react';
import { DownloadIcon } from '@chakra-ui/icons';

import AllLayout from '@/components/Layout';
import FlexBetween from '@/components/FlexBetween';
import Header from '@/components/Header';
import Table from '@/components/Table';

const All = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulating a loading delay
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    // Cleanup function
    return () => clearTimeout(timeout);
  }, []);

  return (
    <AllLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box className="ml-40 mr-40 pl-10 pr-10 mt-10 mb-20">
          <FlexBetween>
            <Header title="All EIPs" subtitle="Your Roadway to All" />
            <Box>
              <Button
                colorScheme="green"
                variant="outline"
                fontSize="14px"
                fontWeight="bold"
                padding="10px 20px"
              >
                <DownloadIcon marginEnd={1.5} />
                Download Reports
              </Button>
            </Box>
          </FlexBetween>
          <Table />
        </Box>
      </motion.div>
    </AllLayout>
  );
};

export default All;
