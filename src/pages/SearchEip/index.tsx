import React from 'react';
import EtherWorldAdCard from "@/components/EtherWorldAdCard";
import AllLayout from "@/components/Layout";
import SearchByEip from '@/components/SearchByEIP';
import { useScrollSpy } from '@/hooks/useScrollSpy';
import { Box } from "@chakra-ui/react";

const Authors: React.FC = () => {
    useScrollSpy([
  "Search EIP",
]);

    return (
        <>
            <AllLayout>
                <SearchByEip defaultQuery=''/>
                
                {/* EtherWorld Advertisement */}
                <Box my={6} mx={{ lg: "40", md: "2", sm: "2", base: "2" }} px={{ lg: "10", md: "5", sm: "5", base: "5" }}>
                    <EtherWorldAdCard />
                </Box>
            </AllLayout>
        </>
    );
};

export default Authors;