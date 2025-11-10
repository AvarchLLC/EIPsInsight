import React from 'react';
import AllLayout from "@/components/Layout";
import SearchByTitle from '@/components/SearchByTitle';
import { useScrollSpy } from '@/hooks/useScrollSpy';
import CloseableAdCard from "@/components/CloseableAdCard";
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
                <CloseableAdCard />
              </Box>
              
              <SearchByTitle defaultQuery=''/>
            </AllLayout>
        </>
    );
};

export default Authors;