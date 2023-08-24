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
import StackedColumnChart from '@/components/StackedBarChart';
import {PieC} from "@/components/InPie";
import AreaC from '@/components/AreaStatus';
import Banner from "@/components/NewsBanner";

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
                <Box
                    hideBelow={'lg'}
                    paddingBottom={{lg:'10', sm: '10',base: '10'}}
                    marginX={{lg:"40",md:'2', sm: '2', base: '2'}}
                    paddingX={{lg:"10",md:'5', sm:'5',base:'5'}}
                    marginTop={{lg:"10",md:'5', sm:'5',base:'5'}}
                >
                    <Header title="Status" subtitle="Your Roadway to Status"></Header>
                    <Box paddingY={'8'}>
                        <Text fontSize="3xl" fontWeight="bold" color="#A020F0">
                            Draft vs Final
                        </Text>
                        <AreaC />
                    </Box>
                    <Text fontSize="3xl" fontWeight="bold" color="#A020F0">
                        Draft
                    </Text>
                    <Grid templateColumns="repeat(2, 1fr)" gap={6} paddingBottom={8}>


                        <StackedColumnChart status={'Draft'}/>


                        <CBoxStatus status={'Draft'}/>
                    </Grid>

                    <Text fontSize="3xl" fontWeight="bold" color="#A020F0">
                        Review
                    </Text>
                    <Grid templateColumns="repeat(2, 1fr)" gap={6} paddingBottom={8}>


                        <StackedColumnChart status={'Review'}/>


                        <CBoxStatus status={'Review'}/>
                    </Grid>

                    <Text fontSize="3xl" fontWeight="bold" color="#A020F0">
                        Last Call
                    </Text>
                    <Grid templateColumns="repeat(2, 1fr)" gap={6} paddingBottom={8}>


                        <StackedColumnChart status={'Last Call'}/>


                        <CBoxStatus status={'Last Call'}/>
                    </Grid>

                    <Text fontSize="3xl" fontWeight="bold" color="#A020F0" paddingTop={'8'}>
                        Living
                    </Text>
                    <Grid templateColumns="repeat(2, 1fr)" gap={6} paddingBottom={8}>
                    
              
                    <StackedColumnChart status={'Living'}/>
                        
                    <CBoxStatus status={'Living'}/>
                        
                    </Grid>

                    <Text fontSize="3xl" fontWeight="bold" color="#A020F0">
                        Final
                    </Text>
                    <Grid templateColumns="repeat(2, 1fr)" gap={6} paddingBottom={8}>
                    
    
                    <StackedColumnChart status={'Final'}/>
                        

                        <CBoxStatus status={'Final'}/>
                    </Grid>

                    <Text fontSize="3xl" fontWeight="bold" color="#A020F0">
                        Withdrawn
                    </Text>
                    <Grid templateColumns="repeat(2, 1fr)" gap={6} paddingBottom={8}>

                    <StackedColumnChart status={'Withdrawn'}/>
                
                        <CBoxStatus status={'Withdrawn'}/>
                    </Grid>
                </Box>

              <Box
                  display={{lg:'none',md:"block"}}
                  paddingBottom={{lg:'10', sm: '10',base: '10'}}
                  marginX={{lg:"40",md:'2', sm: '2', base: '2'}}
                  paddingX={{lg:"10",md:'5', sm:'5',base:'5'}}
                  marginTop={{lg:"10",md:'5', sm:'5',base:'5'}}
              >

                  <Header title="Status" subtitle="Your Roadway to Status"></Header>

                  <Text fontSize="xl" fontWeight="bold" color="#A020F0" paddingTop={'8'}>
                      Draft vs Final
                  </Text>

                  <AreaC />

                  <Text fontSize="xl" fontWeight="bold" color="#A020F0" paddingTop={'8'}>
                      Draft
                  </Text>

                  <Box>
                      <StackedColumnChart status='Draft'/>
                      <CBoxStatus status={'Draft'}/>
                  </Box>

                  <Text fontSize="xl" fontWeight="bold" color="#A020F0" paddingTop={'8'}>
                      Review
                  </Text>

                  <Box>
                      <StackedColumnChart status='Review'/>
                      <CBoxStatus status={'Review'}/>
                  </Box>

                  <Text fontSize="xl" fontWeight="bold" color="#A020F0" paddingTop={'8'}>
                      Last Call
                  </Text>

                  <Box>
                      <StackedColumnChart status='Last Call'/>
                      <CBoxStatus status={'Last Call'}/>
                  </Box>

                  <Text fontSize="xl" fontWeight="bold" color="#A020F0" paddingTop={'8'}>
                      Living
                  </Text>

                  <Box>
                      <StackedColumnChart status='Living'/>
                      <CBoxStatus status={'Living'}/>
                  </Box>

                  <Text fontSize="xl" fontWeight="bold" color="#A020F0" paddingTop={'8'}>
                      Final
                  </Text>

                  <Box>
                  <StackedColumnChart status='Final'/>
                      <CBoxStatus status={'Final'}/>
                  </Box>

                  <Text fontSize="xl" fontWeight="bold" color="#A020F0" paddingTop={'8'}>
                      Withdrawn
                  </Text>

                  <Box>
                  <StackedColumnChart status='Withdrawn'/>
                      <CBoxStatus status={'Withdrawn'}/>
                  </Box>
              </Box>

                </motion.div>
        )}
            </AllLayout>
        
    );
};

export default Status;