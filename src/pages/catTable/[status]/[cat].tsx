import React from 'react'
import AllLayout from "@/components/Layout";
import { Box, Button } from '@chakra-ui/react'
import FlexBetween from '@/components/FlexBetween'
import Header from '@/components/Header'
import { DownloadIcon } from '@chakra-ui/icons'
import TableCatStat from '@/components/TableCatStat'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion';
import LoaderComponent from '@/components/Loader';
import { usePathname } from 'next/navigation';
import axios from 'axios';

const StatTab = () => {
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname()?.split("/");
  

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
      {isLoading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <LoaderComponent />
          </motion.div>
        </Box>
      ) : pathname && pathname?.length >= 4 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
          <Box className="ml-40 mr-40 pl-10 pr-10 mt-10 mb-20">
            <FlexBetween>
              <Header title={pathname[2]} subtitle={pathname[3]} description={""} />
              <Box>
                <Button colorScheme="blue" variant="outline" fontSize={'14px'} fontWeight={'bold'} 
                onClick={async () => {
                  try {
                    await axios.post("/api/DownloadCounter");
                  } catch (error) {
                    console.error("Error triggering download counter:", error);
                  }
                }}
                padding={'10px 20px'}>
                  <DownloadIcon marginEnd={'1.5'} />
                  Download Reports
                </Button>
              </Box>
            </FlexBetween>
            <TableCatStat cat={pathname[2]} status={pathname[3]} />
          </Box>
        </motion.div>
      ) : (
        <div>Invalid URL</div>
      )}
    </AllLayout>
  )
}

export default StatTab