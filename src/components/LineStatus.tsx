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
import { motion } from 'framer-motion';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface EIP {
  created: string;
  status: string;
  category: string;
}

interface GroupedEips {
  [key: string]: EIP[];
}

interface Counts {
  [key: string]: number;
}
interface TabProps {
    cat: string;
  }
  
const LineStatus: React.FC<TabProps> = ({cat }) => {
  const groupedEips: GroupedEips = {};
  for (const eip of mockEIP) {
    const createdDate = eip.created.slice(0, 7); // Extract yyyy-mm from the 'created' date
    if (createdDate in groupedEips) {
      groupedEips[createdDate].push(eip);
    } else {
      groupedEips[createdDate] = [eip];
    }
  }

  const LivingCounts: Counts = {};
  const Final: Counts = {};
  const Review: Counts = {};
  const LastCall: Counts = {};
  const Stagnant: Counts = {};
  const Withdrawn: Counts = {};
  const Draft: Counts = {};

  for (const key in groupedEips) {
    const eips = groupedEips[key];
    const finalEips = eips?.filter((eip) => eip.status && eip.category===cat );
    const reviewEips = eips?.filter((eip) => eip.status  && eip.category===cat );
    const lastCallEips = eips?.filter((eip) => eip.status && eip.category===cat );
    const stagnantEips = eips?.filter((eip) => eip.status  && eip.category===cat );
    const withdrawnEips = eips?.filter((eip) => eip.status  && eip.category===cat );
    const livingEips = eips?.filter((eip) => eip.status  && eip.category===cat );
    const draftEips = eips?.filter((eip) => eip.status && eip.category===cat );
    LivingCounts[key] = livingEips.length;
    Final[key] = finalEips.length;
    Review[key] = reviewEips.length;
    LastCall[key] = lastCallEips.length;
    Stagnant[key] = stagnantEips.length;
    Withdrawn[key] = withdrawnEips.length;
    Draft[key] = draftEips.length;
  }

  const data = {
    labels: Object.keys(LivingCounts),
    datasets: [
      {
        label: 'Living',
        data: Object.values(LivingCounts),
        fill: true,
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.1,
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
      },
      {
        label: 'Final',
        data: Object.values(Final),
        fill: true,
        borderColor: 'rgb(255, 159, 64)',
        tension: 0.1,
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
      },
      {
        label: 'Review',
        data: Object.values(Review),
        fill: true,
        borderColor: 'rgb(255, 205, 86)',
        tension: 0.1,
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
      },
      {
        label: 'Last Call',
        data: Object.values(LastCall),
        fill: true,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
      },
      {
        label: 'Stagnant',
        data: Object.values(Stagnant),
        fill: true,
        borderColor: 'rgb(201, 203, 207)',
        tension: 0.1,
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
      },
      {
        label: 'Withdrawn',
        data: Object.values(Withdrawn),
        fill: true,
        borderColor: 'rgb(153, 102, 255)',
        tension: 0.1,
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
      },
    ],
  };

  const bg = useColorModeValue('#f6f6f7', '#171923');

  return (
    <Box
      bgColor={bg}
      marginTop={'12'}
      p="2rem 2rem"
      borderRadius="0.55rem"
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
      <Line data={data} />
    </Box>
  );
};

export default LineStatus;
