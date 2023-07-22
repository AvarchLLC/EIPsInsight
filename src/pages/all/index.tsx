import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Box, Button, Spinner } from '@chakra-ui/react';
import { DownloadIcon } from '@chakra-ui/icons';

import AllLayout from '@/components/Layout';
import FlexBetween from '@/components/FlexBetween';
import Header from '@/components/Header';
import Table from '@/components/Table';
import AreaC from '@/components/AreaC';
import LoaderComponent from '@/components/Loader';

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
            {isLoading ? ( // Check if the data is still loading
        // Show loader if data is loading
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100vh"
        >
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Your loader component */}
            <LoaderComponent />
          </motion.div>
        </Box>
      ) : (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box
            paddingBottom={{md:'10', base: '10'}}
            marginX={{md:"40", base: '2'}}
            paddingX={{md:"10", base:'5'}}
            marginTop={{md:"10", base:'5'}}
        >
          <FlexBetween>
            <Header title="All EIPs" subtitle="Your Roadway to All" />
            <Box>
              <Button
                colorScheme="green"
                variant="outline"
                fontSize={{md:'14px', base:'10px'}}
                fontWeight={'bold'}
                padding={{md:'10px 20px', base:'5px 10px'}}
              >
                <DownloadIcon marginEnd={1.5} />
                Download Reports
              </Button>
            </Box>
          </FlexBetween>
          <Table />
          <AreaC/>
        </Box>
      </motion.div>
      )}
    </AllLayout>
  );
};

export default All;
