import React from 'react';
import AllLayout from "@/components/Layout";
import SearchByPrOrIssue from '@/components/SearchByPrOrIssue';
import { useScrollSpy } from '@/hooks/useScrollSpy';
import CloseableAdCard from "@/components/CloseableAdCard";
import { Box } from "@chakra-ui/react";

const Authors: React.FC = () => {
    useScrollSpy([
  "Search PR/ISSUE",
]);

    return (
        <>
            <AllLayout> 
                {/* EtherWorld Advertisement */}
                <Box my={6} width="100%">
                  <CloseableAdCard />
                </Box>
                
                <SearchByPrOrIssue defaultQuery=''/>
            </AllLayout>
        </>
    );
};

export default Authors;