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

const LineChart: React.FC = () => {
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
  const ERCCounts: Counts = {};
  const NetCounts: Counts = {};
  const InterCounts: Counts = {};
  const MetaCounts: Counts = {};
  const InfoCounts: Counts = {};

  for (const key in groupedEips) {
    const eips = groupedEips[key];
    const livingEips = eips?.filter((eip) => eip.status === 'Final' && eip.category === 'Core');
    const ercEips = eips?.filter((eip) => eip.status === 'Final' && eip.category === 'ERC');
    const NetEips = eips?.filter((eip) => eip.status === 'Final' && eip.category === 'Networking');
    const InterEips = eips?.filter((eip) => eip.status === 'Final' && eip.category === 'Interface');
    const MetaEips = eips?.filter((eip) => eip.status === 'Final' && eip.category === 'Meta');
    const InfoEips = eips?.filter((eip) => eip.status === 'Final' && eip.category === 'Informational');
    LivingCounts[key] = livingEips?.length;
    ERCCounts[key] = ercEips?.length;
    NetCounts[key] = NetEips?.length;
    InterCounts[key] = InterEips?.length;
    MetaCounts[key] = MetaEips?.length;
    InfoCounts[key] = InfoEips?.length;
  }

  const data = {
    labels: Object.keys(LivingCounts),
    datasets: [
      {
        label: 'Core',
        data: Object.values(LivingCounts),
        fill: true,
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.1,
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
      },
      {
        label: 'ERC',
        data: Object.values(ERCCounts),
        fill: true,
        borderColor: 'rgb(255, 159, 64)',
        tension: 0.1,
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
      },
      {
        label: 'Networking',
        data: Object.values(NetCounts),
        fill: true,
        borderColor: 'rgb(255, 205, 86)',
        tension: 0.1,
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
      },
      {
        label: 'Interference',
        data: Object.values(InterCounts),
        fill: true,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
      },
      {
        label: 'Meta',
        data: Object.values(MetaCounts),
        fill: true,
        borderColor: 'rgb(201, 203, 207)',
        tension: 0.1,
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
      },
      {
        label: 'Informational',
        data: Object.values(InfoCounts),
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

export default LineChart;
