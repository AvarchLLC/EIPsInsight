import React, { useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';
import { mockEIP } from '@/data/eipdata';

import { Box, useColorModeValue } from '@chakra-ui/react';
  
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  )

const LineChart = ({}) => {
  const groupedEips = {};


  for (const eip of mockEIP) {
    const createdDate = eip.created.slice(0, 7); // Extract yyyy-mm from the 'created' date
    if (createdDate in groupedEips) {
      groupedEips[createdDate].push(eip);
    } else {
      groupedEips[createdDate] = [eip];
    }
  }
  const stagnantCounts = {};
  for (const key in groupedEips) {
    const eips = groupedEips[key];
    const stagnantEips = eips.filter(eip => eip.status === "Final");
    stagnantCounts[key] = stagnantEips.length;
  }
  console.log(stagnantCounts)
  const data = {
    labels: Object.keys(stagnantCounts),
    datasets: [
      {
        label: 'Living',
        data: Object.values(stagnantCounts),
        fill: true,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };
  const bg = useColorModeValue("#f6f6f7", "#171923");

  return (
    <Box
    bgColor={bg}
    marginTop={"12"}
    marginLeft={""}
    p="1rem 1rem"
    borderRadius="0.55rem"
    overflowX="auto"
    _hover={{
      border: "1px",
      borderColor: "#10b981",
    }}
    className="ml-40 mr-40 pl-10 pr-10 mt-10 hover: cursor-pointer ease-in duration-200"
  >
  <Line data={data} />
  </Box>
  
  );
};

export default LineChart;
