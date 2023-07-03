
import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Header from '@/components/Header';
import { Box, Grid } from '@chakra-ui/react';
import CustomBox from '@/components/CustomBox';
import { PieC } from '@/components/PieC';
import AllLayout from '@/components/Layout';
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

  return (
    <AllLayout>
      <Box className="ml-40 mr-40 pl-10 pr-10 mt-10">
        <Header title={getMonthName(Number(month))} subtitle={year} />
        <Grid templateColumns="repeat(2, 1fr)" gap={6}>
          <CustomBox data={data} />
          <PieC data={data} status='Final'/>
        </Grid>
        <Grid templateColumns="repeat(2, 1fr)" gap={6}>
          <PieC data={data} status='Review'/>
          <PieC data={data} status='Living'/>
        </Grid>
        <Grid templateColumns="repeat(2, 1fr)" gap={6}>
          <PieC data={data} status='Stagnant'/>
          <PieC data={data} status='Draft'/>
        </Grid>
        <Grid templateColumns="repeat(2, 1fr)" gap={6}>
          <PieC data={data} status='Last Call'/>
          <PieC data={data} status='Withdrawn'/>
        </Grid>
      </Box>
    </AllLayout>
  );
};

export default Month;
