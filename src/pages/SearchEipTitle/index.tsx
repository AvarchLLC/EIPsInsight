import React from 'react';
import AllLayout from "@/components/Layout";
import SearchByTitle from '@/components/SearchByTitle';
import { useScrollSpy } from '@/hooks/useScrollSpy';
import EtherWorldAdCard from "@/components/EtherWorldAdCard";
import { Box } from "@chakra-ui/react";

const Authors: React.FC = () => {
    useScrollSpy([
  "Search EIP Title",
]);

    return (
        <>
            <AllLayout>
              {/* EtherWorld Advertisement */}
              <Box my={6} width="100%">
                <EtherWorldAdCard />
              </Box>
              
              <SearchByTitle defaultQuery=''/>
            </AllLayout>
        </>
    );
};

export default Authors;