import React from 'react';
import AllLayout from "@/components/Layout";;
import Header from '@/components/Header';
import { Box } from '@chakra-ui/react';


const Status = () => {
    return (
        <div>
            <AllLayout>
                <Box className="ml-40 mr-40 pl-10 pr-10 mt-10">
                    <Header title="Status" subtitle="Your Roadway to Status"></Header>
                    hello from status page
                </Box>
            </AllLayout>
        </div>
    );
};

export default Status;