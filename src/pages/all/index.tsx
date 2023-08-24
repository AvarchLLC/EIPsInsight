import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Box, Button, Spinner } from '@chakra-ui/react';
import { DownloadIcon } from '@chakra-ui/icons';

import AllLayout from '@/components/Layout';
import FlexBetween from '@/components/FlexBetween';
import Header from '@/components/Header';
import Table from '@/components/Table';
import AreaC from '@/components/AreaC';
import LoaderComponent from '@/components/Loader';
import Banner from "@/components/NewsBanner";
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

const All = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<EIP[]>([]); // Set initial state as an empty array
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/alleips`);
        console.log(response);
        const jsonData = await response.json();
        setData(jsonData);
        setIsLoading(false); // Set loader state to false after data is fetched
      } catch (error) {
        console.error('Error fetching data:', error);
        setIsLoading(false); // Set loader state to false even if an error occurs
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
            paddingBottom={{lg:'10', sm: '10',base: '10'}}
            marginX={{lg:"40",md:'2', sm: '2', base: '2'}}
            paddingX={{lg:"10",md:'5', sm:'5',base:'5'}}
            marginTop={{lg:"10",md:'5', sm:'5',base:'5'}}
        >
          <FlexBetween>
            <Header title={`All EIPs - [ ${data.length} ]`} subtitle="Your Roadway to All" />
            <Box>
              <Button
                  colorScheme="blue"
                  variant="outline"
                  fontSize={{lg:'14px',md:'12px', sm:'12px',base:'10px'}}
                  fontWeight={'bold'}
                  padding={{lg:'10px 20px',md:'5px 10px', sm:'5px 10px',base:'5px 10px'}}
              >
                <DownloadIcon marginEnd={'1.5'} />
                Download Reports
              </Button>
            </Box>
          </FlexBetween>
          <Table />
          <AreaC/>
        </Box>
      </motion.div>
      )}
    </AllLayout>
  );
};

export default All;
