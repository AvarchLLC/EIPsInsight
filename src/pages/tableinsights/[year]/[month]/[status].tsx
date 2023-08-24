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
import InsightTable from '@/components/InsightTable';

const getStatus = (status: string) => {
  switch (status) {
    case "LastCall":
      return "Last Call";
    default:
      return status;
  }
};

const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

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

const Insi = () => {
  const [isLoading, setIsLoading] = useState(true);
  const path = usePathname();
  const [isResEmpty, setIsResEmpty] = useState(false);
  const [data, setData] = useState<StatusChange[]>([]); // Set initial state as an empty array

  let year = '';
  let month = '';
  let status = '';

  if (path) {
      const pathParts = path.split('/');
      year = pathParts[2];
      month = pathParts[3];
      status = pathParts[4];
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

useEffect(() => {
    if(data.length === 0){
        setIsResEmpty(true);
    }
    else{
        setIsResEmpty(false);
    }
})
  return (
    <AllLayout>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
          <Box className="ml-40 mr-40 pl-10 pr-10 mt-10 mb-20">
            <FlexBetween>
              <Header title={`${monthNames[Number(month)-1]} - ${year}`} subtitle={getStatus(status)} />
              <Box>
                <Button colorScheme="blue" variant="outline" fontSize={'14px'} fontWeight={'bold'} padding={'10px 20px'}>
                  <DownloadIcon marginEnd={'1.5'} />
                  Download Reports
                </Button>
              </Box>
            </FlexBetween>
            <InsightTable year={year} month={month} status={status}/>
          </Box>
        </motion.div>
    </AllLayout>
  )
}

export default Insi