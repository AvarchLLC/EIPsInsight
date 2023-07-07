import React from 'react';
import AllLayout from "@/components/Layout";
import Header from '@/components/Header';
import { Box, Grid, Text } from '@chakra-ui/react';
import CBox from "@/components/CBox";
import Donut from "@/components/Donut"
import DonutType from "@/components/DonutType"
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion';
import LoaderComponent from '@/components/Loader';
const Type = () => {
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
                <Box className="ml-40 mr-40 pl-10 pr-10 mt-10 mb-40">
                    <Header title="Type - Category" subtitle="Your Roadway to Type and Category"></Header>
                    <Text fontSize="3xl" fontWeight="bold" color="#4267B2">
                        Standard Track
                    </Text>
                    <Grid templateColumns="repeat(2, 1fr)" gap={8} paddingBottom={8}>
                    <CBox/>
                    <Donut/>
                    </Grid>
                    <Grid templateColumns="repeat(2, 1fr)" gap={8}>
                        <Box>
                        <Text fontSize="3xl" fontWeight="bold" color="#4267B2">
                        Meta
                    </Text>
                    <DonutType type={'Meta'}/>
                        </Box>
                        <Box>
                        <Text fontSize="3xl" fontWeight="bold" color="#4267B2">
                        Informational
                    </Text>
                    <DonutType type={'Informational'}/>
                        </Box>
                        
                    </Grid>
                </Box>
                </motion.div>
        )}
            </AllLayout>
        
    );
};

export default Type;