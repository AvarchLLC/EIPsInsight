import React, { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Box, useColorModeValue } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import dynamic from "next/dynamic";
const Pie = dynamic(
  (): any => import("@ant-design/plots").then((item) => item.Pie),
  {
    ssr: false,
  }
) as any;

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

interface PieChartData {
  status: string;
  value: number;
}

interface DonutTypeProps {
    status: string;
  }

const DonutStatus: React.FC<DonutTypeProps>= ({ status }) => {
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

  const coreCount = data.filter(item => item.status === status && item.category === 'Core').length;
  const ercCount = data.filter(item => item.status === status && item.category === 'ERC').length;
  const networkingCount = data.filter(item => item.status === status && item.category === 'Networking').length;
  const interfaceCount = data.filter(item => item.status === status && item.category === 'Interface').length;
  const metaCount = data.filter(item => item.status === status && item.type === 'Meta').length;
  const informationalCount = data.filter(item => item.status === status && item.type === 'Informational').length;
  const total = coreCount+ercCount+networkingCount+ interfaceCount+metaCount+informationalCount;
  const pieChartData: PieChartData[] = [
    {
      status : "Core",
      value: coreCount
    },
    {
      status : "ERC",
      value: ercCount
    },
    {
      status : "Networking",
      value: networkingCount
    },
    {
      status : "Interface",
      value: interfaceCount
    },
    {
      status : "Meta",
      value: metaCount
    },
    {
      status : "Informational",
      value: informationalCount
    }
  ]
  const config = {
    appendPadding: 10,
    data: pieChartData,
    angleField: "value",
    colorField: "status",
    radius: 1,
    innerRadius: 0.5,
    label: {
      type: "inner",
      offset: "-50%",
      content: "{value}",
      style: {
        textAlign: "center",
        fontSize: 14
      }
    },
    interactions: [{ type: "element-selected" }, { type: "element-active" }],
    statistic: {
      title: false as const,
      content: {
        style: {
          whiteSpace: "pre-wrap",
          overflow: "hidden",
          textOverflow: "ellipsis"
        },
        formatter: function formatter() {
          return `EIPS : ${total}`;
        }
      }
    }
  };
  

  const chartData = {
    labels: ['Core', 'ERC', 'Networking', 'Interface', "Meta", "Informational"],
    datasets: [
      {
        data: [coreCount, ercCount, networkingCount, interfaceCount, metaCount, informationalCount],
        backgroundColor: [
            'rgba(255, 99, 132, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(255, 159, 64, 0.6)',
            'rgba(201, 203, 207, 0.6)',
            'rgba(255, 205, 86, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(153, 102, 255, 0.6)',
          ],
          borderColor: [
            'rgb(255, 99, 132)',
            'rgb(75, 192, 192)',
            'rgb(255, 159, 64)',
            'rgb(201, 203, 207)',
            'rgb(255, 205, 86)',
            'rgb(54, 162, 235)',
            'rgb(153, 102, 255)',
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
      p="0.5rem"
      borderRadius="0.35rem"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      height={400}
      overflowX="auto"
      _hover={{
        border: '1px',
        borderColor: '#10b981',
      }}
      as={motion.div}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 } as any}
      className="hover: cursor-pointer ease-in duration-200"
    >
     
<Pie {...config}/> </Box>
      
  );
};

export default DonutStatus;
