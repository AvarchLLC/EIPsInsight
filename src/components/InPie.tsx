import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Box, Card, CardFooter, CardHeader, Stack, StackDivider, Text, Divider, useColorModeValue } from '@chakra-ui/react';
import FlexBetween from './FlexBetween';
import { motion } from 'framer-motion';
import LoaderComponent from './Loader';
import dynamic from "next/dynamic";
import DateTime from "@/components/DateTime";
import NextLink from "next/link";
import {usePathname} from "next/navigation";
const Pie = dynamic(
  (): any => import("@ant-design/plots").then((item) => item.Pie),
  {
    ssr: false,
  }
) as any;
interface CustomBoxProps {
  status: string;
  data: {
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
  }[];
  year: string;
  month: string;
}

interface DataItem {
  cat: string;
  value: number;
}

interface TransformedDataItem {
  cat: string;
  value: number;
}

interface TransformedDataResult {
  transformedData: TransformedDataItem[];
  sum: number;
}

function transformAndAddUp(data: DataItem[]): TransformedDataResult {
  const transformedData: { [key: string]: number } = {};
  let sum = 0;

  data?.forEach(item => {
    const { cat, value } = item;
    if (transformedData[cat]) {
      transformedData[cat] += value;
    } else {
      transformedData[cat] = value;
    }
    sum += value;
  });

  const result: TransformedDataItem[] = Object.entries(transformedData)?.map(([cat, value]) => ({ cat, value }));
  return { transformedData: result, sum };
}

export const PieC: React.FC<CustomBoxProps> = ({ data, status , year, month}) => {
  const objs :any = []
  const transformedData: { [key: string]: number } = data?.reduce((result: { [key: string]: number }, obj) => {
    
    if (obj._id === status) {
      
    
      obj.statusChanges?.forEach((statusChange) => {
        objs.push({ cat : statusChange.category, value:1})
        result[statusChange.category] = obj.count;
      });
    }
    return result;
  }, {});
  console.log(transformedData)

  const tdata = transformAndAddUp(objs)
  const bg = useColorModeValue('#f6f6f7', '#171923');
  const config = {
    appendPadding: 10,
    data: tdata.transformedData,
    angleField: "value",
    colorField: "cat",
    radius: 1,
    innerRadius: 0.5,
    legend: { position: 'top' as const },
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
      }
    }
  };

  if (data?.length === 0) {
    return (
      <Box
        bgColor={bg}
        marginTop={'2rem'}
        p="0.5rem"
        borderRadius="0.35rem"
        overflowX="auto"
        _hover={{
          border: '1px',
          borderColor: '#30A0E0',
        }}
        className="hover: cursor-pointer ease-in duration-200"
      >
        <LoaderComponent/>
      </Box>
    );
  }

  if (Object.values(transformedData)?.reduce((total, value) => total + value, 0) === 0) {
    return (
        <Box
        bgColor={bg}
        marginTop={'2rem'}
        marginBottom={'2rem'}
        p="0.5rem"
        borderRadius="0.35rem"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        height={500}
        overflowX="auto"
        _hover={{
          border: '1px',
          borderColor: '#30A0E0',
        }}
        className="hover: cursor-pointer ease-in duration-200"
      >
        <Text textAlign="left" fontSize="lg" fontWeight="bold" color="#30A0E0" paddingTop="1rem">
          {status} : {Object.values(transformedData)?.reduce((total, value) => total + value, 0)}
        </Text>
        <Divider mt="1rem" mb="1rem" />
      </Box>
    )
  }

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
      height={500}
      overflowX="auto"
      overflowY="auto"
      _hover={{
        border: '1px',
        borderColor: '#30A0E0',
      }}
      as={motion.div}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 } as any}
      className="hover:ease-in duration-200 overflow-y-hidden" // Change the class name to control overflow
    >
      <Box className={'w-full'}>
      <NextLink href={`/tableinsights/${year}/${month}/${status}`}>
        <Text textAlign="center" fontSize={['md', 'lg']} fontWeight="bold" color="#30A0E0" paddingTop="1rem">
          {status} : {tdata.sum}
        </Text>
      </NextLink>
      </Box>
      <Divider mt="1rem" mb="1rem" />
      <Box width="60%" maxWidth={500} maxHeight={400}>
      <Pie {...config}/>
      </Box>
      <Box className={'w-full'}>
        <DateTime />
      </Box>
    </Box>
  );
};
