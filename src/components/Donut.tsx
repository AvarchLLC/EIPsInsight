import React, { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Box, useColorModeValue } from '@chakra-ui/react';
import { motion } from 'framer-motion';

ChartJS.register(ArcElement, Tooltip, Legend);

interface EIP {
  _id: string;
  eip: number;
  title: string;
  author: string;
  status: string;
  type: string;
  category: string;
  created: string;
  requires: any[]; // Adjust the type based on the actual data structure
  last_call_deadline: string;
}

const DoughnutChart = () => {
  const [data, setData] = useState<EIP[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/alleips`);
        const jsonData = await response.json();
        setData(jsonData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const coreCount = data?.filter(item => item.category === 'Core').length;
  const ercCount = data?.filter(item => item.category === 'ERC').length;
  const networkingCount = data?.filter(item => item.category === 'Networking').length;
  const interfaceCount = data?.filter(item => item.category === 'Interface').length;

  const chartData = {
    labels: ['Core', 'ERC', 'Networking', 'Interface'],
    datasets: [
      {
        data: [coreCount, ercCount, networkingCount, interfaceCount],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(255, 159, 64, 0.2)',
          'rgba(201, 203, 207, 0.2)'
        ],
        borderColor: [
          'rgb(255, 99, 132)',
          'rgb(75, 192, 192)',
          'rgb(255, 159, 64)',
          'rgb(201, 203, 207)'
        ],
        borderWidth: 1
      }
    ]
  };


  const bg = useColorModeValue("#f6f6f7", "#171923");

  return (
    <Box
      bgColor={bg}
      marginTop={'2rem'}
      paddingX="0.5rem"
      borderRadius="0.55rem"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      height={400}
      overflowX="auto"
      _hover={{
        border: '1px',
        borderColor: '#30A0E0',
      }}
      as={motion.div}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 } as any}
      className="hover: cursor-pointer ease-in duration-200"
    >
     <Box width="60%" maxWidth={500} maxHeight={500} className='md:px-10 px-5'> <Doughnut data={chartData} options={{
          maintainAspectRatio: true, // Set it to false if you want to disable maintaining aspect ratio
          responsive: true,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                usePointStyle: true,
                padding: 8,
              },
            },
          },
     }} /> </Box>
      
    </Box>
  );
};

export default DoughnutChart;
