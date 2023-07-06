import React from 'react';
import AllLayout from "@/components/Layout";
import Header from '@/components/Header';
import { Box, Grid, Text } from '@chakra-ui/react';
import CBox from "@/components/CBox";
import Donut from "@/components/Donut"
import DonutType from "@/components/DonutType"
const Type = () => {
    return (
        <div>
            <AllLayout>
                <Box className="ml-40 mr-40 pl-10 pr-10 mt-10 mb-40">
                    <Header title="Type - Category" subtitle="Your Roadway to Type and Category"></Header>
                    <Text fontSize="3xl" fontWeight="bold" color="#4267B2">
                        Standard Track
                    </Text>
                    <Grid templateColumns="repeat(2, 1fr)" gap={8} paddingBottom={8}>
                        <CBox />
                        <Donut />
                    </Grid>
                    <Grid templateColumns="repeat(2, 1fr)" gap={8}>
                        <Box>
                            <Text fontSize="3xl" fontWeight="bold" color="#4267B2">
                                Meta
                            </Text>
                            <DonutType type={'Meta'} />
                        </Box>
                        <Box>
                            <Text fontSize="3xl" fontWeight="bold" color="#4267B2">
                                Informational
                            </Text>
                            <DonutType type={'Informational'} />
                        </Box>

                    </Grid>
                </Box>
            </AllLayout>
        </div>
    );
};

export default Type;