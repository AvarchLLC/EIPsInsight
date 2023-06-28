import { mockEIP } from '@/data/eipdata';
import AreaChart from '@ant-design/plots/es/components/area';
import { Box, Text, useColorModeValue } from '@chakra-ui/react';
import dynamic from 'next/dynamic';
const Area = dynamic(() => import('@ant-design/plots').then(({ Area }) => Area), { ssr: false });
import React from 'react';
import FlexBetween from './FlexBetween';

const categoryColors: string[] = ['#F1F2B5', '#E9D660', '#E2B40A', '#D9A90E', '#7C6B62', '#2B3045'];

const AreaC = ( { status }: { status: string } ) => {
  const data1 = mockEIP;
  const filteredData = data1.filter((item: { status: string; category: string }) => item.status === status);

  const mappedData: { [key: string]: { category: string; date: string; value: number } } = filteredData.reduce(
    (acc: { [key: string]: { category: string; date: string; value: number } }, item: { created: string; category: string }) => {
      const createdDate = new Date(item.created);
      const monthYear = `${createdDate.toLocaleString('en-US', { month: 'long' })} ${createdDate.getFullYear()}`;

      const key = `${item.category}-${monthYear}`;

      if (acc.hasOwnProperty(key)) {
        acc[key].value++;
      } else {
        acc[key] = { category: item.category, date: monthYear, value: 1 };
      }

      return acc;
    },
    {}
  );

  const dataa = Object.values(mappedData).sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateA.getTime() - dateB.getTime();
  });

  const config = {
    data: dataa,
    xField: 'date',
    yField: 'value',
    color: 'category',
    xAxis: {
      range: [0, 1],
      tickCount: 5,
    },
    fill: 'l(270) 0:#ffffff 0.5:#da77f2 1:#862e9c',
    shadowColor: '#862e9c',
    line: {
      color: '#862e9c',
    },
    columnStyle: {
      radius: [20, 20, 0, 0],
    },
    slider: {
      start: 0.1,
      end: 0.9,
    },
  };
  const bg = useColorModeValue("#f6f6f7", "#171923");
  return (
    <Box
    bgColor={bg}
    marginTop={"6"}
    paddingEnd={"6"}
    p="1rem 1rem"
    borderRadius="0.55rem"
    overflowX="auto"
    _hover={{
      border: "1px",
      borderColor: "#10b981",
    }}
    className="hover: cursor-pointer ease-in duration-200">
            <FlexBetween>
<Text fontSize="xl" fontWeight={"bold"} color={"#10b981"} marginEnd={"6"}>
  {`Status : ${status}`}
</Text>
</FlexBetween>
<Box>
      <Area {...config} /></Box>
</Box>
  );
};

export default AreaC;
