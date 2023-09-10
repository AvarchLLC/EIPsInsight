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
import NextLink from "next/link";



interface EIP {
    _id: string;
    eip: string;
    title: string;
    author: string;
    status: string;
    type: string;
    category: string;
    created: string;
    discussion: string;
    deadline: string;
    requires: string;
    unique_ID: number;
    __v: number;
}

const Status = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState<EIP[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`/api/alleips`);
                const jsonData = await response.json();
                setData(jsonData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

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
                    <Text fontSize="3xl" fontWeight="bold" color="#30A0E0">
                        Draft - <NextLink href={`/tableStatus/Draft`}> [ {data.filter((item) => item.status === 'Draft').length} ]</NextLink>
                    </Text>
                    <Grid templateColumns="repeat(2, 1fr)" gap={6} paddingBottom={8}>


                        <StackedColumnChart status={'Draft'}/>


                        <CBoxStatus status={'Draft'}/>
                    </Grid>

                    <Text fontSize="3xl" fontWeight="bold" color="#30A0E0">
                        Review - <NextLink href={`/tableStatus/Review`}> [ {data.filter((item) => item.status === 'Review').length} ]</NextLink>
                    </Text>
                    <Grid templateColumns="repeat(2, 1fr)" gap={6} paddingBottom={8}>


                        <StackedColumnChart status={'Review'}/>


                        <CBoxStatus status={'Review'}/>
                    </Grid>

                    <Text fontSize="3xl" fontWeight="bold" color="#30A0E0">
                        Last Call -<NextLink href={`/tableStatus/LastCall`}> [ {data.filter((item) => item.status === 'Last Call').length} ] </NextLink>
                    </Text>
                    <Grid templateColumns="repeat(2, 1fr)" gap={6} paddingBottom={8}>


                        <StackedColumnChart status={'Last Call'}/>


                        <CBoxStatus status={'Last Call'}/>
                    </Grid>

                    <Text fontSize="3xl" fontWeight="bold" color="#30A0E0">
                        Living -<NextLink href={`/tableStatus/Living`}> [ {data.filter((item) => item.status === 'Living').length} ]</NextLink>
                    </Text>
                    <Grid templateColumns="repeat(2, 1fr)" gap={6} paddingBottom={8}>
                    
              
                    <StackedColumnChart status={'Living'}/>
                        
                    <CBoxStatus status={'Living'}/>
                        
                    </Grid>

                    <Text fontSize="3xl" fontWeight="bold" color="#30A0E0">
                        Final -<NextLink href={`/tableStatus/Final`}> [ {data.filter((item) => item.status === 'Final').length} ] </NextLink>
                    </Text>

                    <Grid templateColumns="repeat(2, 1fr)" gap={6} paddingBottom={8}>
                        <StackedColumnChart status={'Final'}/>
                        

                        <CBoxStatus status={'Final'}/>
                    </Grid>

                    <Text fontSize="3xl" fontWeight="bold" color="#30A0E0">
                        Stagnant -<NextLink href={`/tableStatus/Stagnant`}> [ {data.filter((item) => item.status === 'Stagnant').length} ] </NextLink>
                    </Text>

                    <Grid templateColumns="repeat(2, 1fr)" gap={6} paddingBottom={8}>
                        <StackedColumnChart status={'Stagnant'}/>


                        <CBoxStatus status={'Stagnant'}/>
                    </Grid>

                    <Text fontSize="3xl" fontWeight="bold" color="#30A0E0">
                        Withdrawn -<NextLink href={`/tableStatus/Withdrawn`}> [ {data.filter((item) => item.status === 'Withdrawn').length} ] </NextLink>
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

                  <Text fontSize="3xl" fontWeight="bold" color="#30A0E0">
                      Draft - <NextLink href={`/tableStatus/Draft`}> [ {data.filter((item) => item.status === 'Draft').length} ]</NextLink>
                  </Text>

                  <Box>
                      <StackedColumnChart status='Draft'/>
                      <CBoxStatus status={'Draft'}/>
                  </Box>

                  <Text fontSize="3xl" fontWeight="bold" color="#30A0E0">
                      Review - <NextLink href={`/tableStatus/Review`}> [ {data.filter((item) => item.status === 'Review').length} ]</NextLink>
                  </Text>

                  <Box>
                      <StackedColumnChart status='Review'/>
                      <CBoxStatus status={'Review'}/>
                  </Box>

                  <Text fontSize="3xl" fontWeight="bold" color="#30A0E0">
                      Last Call -<NextLink href={`/tableStatus/LastCall`}> [ {data.filter((item) => item.status === 'Last Call').length} ] </NextLink>
                  </Text>

                  <Box>
                      <StackedColumnChart status='Last Call'/>
                      <CBoxStatus status={'Last Call'}/>
                  </Box>

                  <Text fontSize="3xl" fontWeight="bold" color="#30A0E0">
                      Living -<NextLink href={`/tableStatus/Living`}> [ {data.filter((item) => item.status === 'Living').length} ]</NextLink>
                  </Text>

                  <Box>
                      <StackedColumnChart status='Living'/>
                      <CBoxStatus status={'Living'}/>
                  </Box>

                  <Text fontSize="3xl" fontWeight="bold" color="#30A0E0">
                      Stagnant -<NextLink href={`/tableStatus/Stagnant`}> [ {data.filter((item) => item.status === 'Stagnant').length} ] </NextLink>
                  </Text>

                  <Box>
                  <StackedColumnChart status='Stagnant'/>
                      <CBoxStatus status={'Stagnant'}/>
                  </Box>

                  <Text fontSize="3xl" fontWeight="bold" color="#30A0E0">
                      Withdrawn -<NextLink href={`/tableStatus/Withdrawn`}> [ {data.filter((item) => item.status === 'Withdrawn').length} ] </NextLink>
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