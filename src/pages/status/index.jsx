import React from 'react';
import AllLayout from "@/components/Layout";
import Header from '@/components/Header';
import { Box, Grid, Text } from '@chakra-ui/react';
import CBoxStatus from "@/components/CBoxStatus";
import Donut from "@/components/Donut"
import DonutStatus from "@/components/DonutStatus"
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion';
import LoaderComponent from '@/components/Loader';

const Status = () => {
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
                <Box className="ml-40 mr-40 pl-10 pr-10 mt-10 mb-20">
                    <Header title="Status" subtitle="Your Roadway to Status"></Header>
                    <Text fontSize="3xl" fontWeight="bold" color="#A020F0">
                        Living
                    </Text>
                    <Grid templateColumns="repeat(2, 1fr)" gap={6} paddingBottom={8}>
                    
              
                    <DonutStatus status={'Living'}/>
                        
                    <CBoxStatus status={'Living'}/>
                        
                    </Grid>
                    <Text fontSize="3xl" fontWeight="bold" color="#A020F0">
                        Final
                    </Text>
                    <Grid templateColumns="repeat(2, 1fr)" gap={6} paddingBottom={8}>
                    
    
                    <DonutStatus status={'Final'}/>
                        

                        <CBoxStatus status={'Final'}/>
                    </Grid>
                    <Text fontSize="3xl" fontWeight="bold" color="#A020F0">
                        Last Call
                    </Text>
                    <Grid templateColumns="repeat(2, 1fr)" gap={6} paddingBottom={8}>
                    

                    <DonutStatus status={'Last Call'}/>
                        
     
                        <CBoxStatus status={'Last Call'}/>
                    </Grid>
                    <Text fontSize="3xl" fontWeight="bold" color="#A020F0">
                        Review
                    </Text>
                    <Grid templateColumns="repeat(2, 1fr)" gap={6} paddingBottom={8}>
                    
           
                    <DonutStatus status={'Review'}/>
                        

                        <CBoxStatus status={'Review'}/>
                    </Grid>
                    <Text fontSize="3xl" fontWeight="bold" color="#A020F0">
                        Draft
                    </Text>
                    <Grid templateColumns="repeat(2, 1fr)" gap={6} paddingBottom={8}>
                   

                    <DonutStatus status={'Draft'}/>
                       

                        <CBoxStatus status={'Draft'}/>
                    </Grid>
                    <Text fontSize="3xl" fontWeight="bold" color="#A020F0">
                        Withdrawn
                    </Text>
                    <Grid templateColumns="repeat(2, 1fr)" gap={6} paddingBottom={8}>

                    <DonutStatus status={'Withdrawn'}/>
                
                        <CBoxStatus status={'Withdrawn'}/>
                    </Grid>
                </Box>
                </motion.div>
        )}
            </AllLayout>
        
    );
};

export default Status;