import React from 'react';
import { useRouter } from 'next/router'; // Import useRouter hook
import AllLayout from '@/components/Layout';
import Author from '@/components/Author';
import CloseableAdCard from "@/components/CloseableAdCard";
import { Box } from "@chakra-ui/react";

const Authors: React.FC = () => {
    const router = useRouter();
    const { name } = router.query; // Extract 'name' from the URL query parameters

    // Ensure 'name' is defined and cast to a string for safe use
    const authorName = typeof name === 'string' ? name : '';

    return (
        <>
            <AllLayout>
                {/* EtherWorld Advertisement */}
                <Box my={6} width="100%">
                  {/* <CloseableAdCard /> */}
                </Box>
                
                <Author defaultQuery={authorName} />
            </AllLayout>
        </>
    );
};

export default Authors;
