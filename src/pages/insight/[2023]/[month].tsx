
import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Header from '@/components/Header';
import { Box, Grid } from '@chakra-ui/react';
import CustomBox from '@/components/CustomBox';
import { PieC } from '@/components/PieC';
import AllLayout from '@/components/Layout';
import { motion } from 'framer-motion';
import LoaderComponent from '@/components/Loader';
interface StatusChange {
  _id: string;
  count: number;
  statusChanges: {
    [key: string]: any; // Add index signature here
    _id: string;
    eip: string;
    fromStatus: string;
    toStatus: string;
    title: string;
    status: string;
    author: string;
    created: string;
    changeDate: string;
    type: string;
    category: string;
    discussion: string;
    deadline: string;
    requires: string;
    pr: number;
    changedDay: number;
    changedMonth: number;
    changedYear: number;
    createdMonth: number;
    createdYear: number;
    __v: number;
  }[];
}

function getMonthName(monthNumber: number): string {
  const date = new Date();
  date.setMonth(monthNumber - 1); // Subtract 1 since months are zero-based in JavaScript
  const monthName = date.toLocaleString('default', { month: 'long' });
  return monthName;
}

const Month = () => {
  const [data, setData] = useState<StatusChange[]>([]); // Set initial state as an empty array
  const path = usePathname();
  let year = '';
  let month = '';

  if (path) {
    const pathParts = path.split('/');
    year = pathParts[2];
    month = pathParts[3];
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/statusChanges/${year}/${month}`);
        const jsonData = await response.json();
        setData(jsonData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [year, month]);

  console.log(data);
  const [isLoading, setIsLoading] = useState(true);

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
      <Box className="ml-40 mr-40 pl-10 pr-10 mt-10 mb-20">
        <Header title={getMonthName(Number(month))} subtitle={year} />
        <Grid templateColumns="repeat(2, 1fr)" gap={6}>
          <CustomBox data={data} />
          <PieC data={data} status='Final'/>
        </Grid>
        <Grid templateColumns="1fr 1fr 1fr" gap={6}>
        <PieC data={data} status='Review'/>
          <PieC data={data} status='Living'/>
          <PieC data={data} status='Stagnant'/>
        </Grid>

        <Grid templateColumns="1fr 1fr 1fr" gap={6}>
          <PieC data={data} status='Draft'/>
          <PieC data={data} status='Last Call'/>
          <PieC data={data} status='Withdrawn'/>
          </Grid>

      </Box>
      </motion.div>
      )}
    </AllLayout>
  );
};

export default Month;
