import React from 'react';
import AllLayout from "@/components/Layout";;
import Header from '@/components/Header';
import { Box } from '@chakra-ui/react';

const Type = () => {
    return (
        <div>
            <AllLayout>
                <Box className="ml-40 mr-40 pl-10 pr-10 mt-10">
                    <Header title="Type - Category" subtitle="Your Roadway to Type and Category"></Header>
                    hello from type page
                </Box>
            </AllLayout>
        </div>
    );
};

export default Type;