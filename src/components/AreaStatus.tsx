import { Box, useColorModeValue, Spinner } from '@chakra-ui/react';
import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';

interface AreaProps {
  data: MappedDataItem[];
  xField: string;
  yField: string;
  color: string[];
  seriesField: string;
  xAxis: {
    range: number[];
    tickCount: number;
  };
  areaStyle: {
    fillOpacity: number;
  };
  legend: {
    position: string;
  };
  smooth: boolean;
}

const Area = dynamic(
    (): any => import('@ant-design/plots').then((item) => item.Area),
    {
      ssr: false,
    }
  ) as React.ComponentType<AreaProps>;

interface MappedDataItem {
  status: string;
  date: string;
  value: number;
}

interface EIP {
  status: string;
  eips: {
    category: string;
    month: number;
    year: number;
    date: string;
    count: number;
  }[];
}

interface FormattedEIP {
  status: string;
  date: string;
  value: number;
}

function getMonthName(month: number): string {
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  return months[month - 1];
}

const categoryColors: string[] = [
  'rgb(255, 99, 132)',
  'rgb(255, 159, 64)',
  'rgb(255, 205, 86)',
  'rgb(75, 192, 192)',
  'rgb(54, 162, 235)',
  'rgb(153, 102, 255)',
  'rgb(255, 99, 255)',
  'rgb(50, 205, 50)',
  'rgb(255, 0, 0)',
  'rgb(0, 128, 0)',
];
const categoryBorder: string[] = [
  'rgba(255, 99, 132, 0.2)',
  'rgba(255, 159, 64, 0.2)',
  'rgba(255, 205, 86, 0.2)',
  'rgba(75, 192, 192, 0.2)',
  'rgba(54, 162, 235, 0.2)',
  'rgba(153, 102, 255, 0.2)',
  'rgba(255, 99, 255, 0.2)',
  'rgba(50, 205, 50, 0.2)',
  'rgba(255, 0, 0, 0.2)',
  'rgba(0, 128, 0, 0.2)',
];
interface AreaCProps {
    category: string;
  }
  const AreaStatus: React.FC<AreaCProps> = ({ category }) => {
  const [data, setData] = useState<EIP[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/graphs`);
        const jsonData = await response.json();
        setData(jsonData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const [isChartReady, setIsChartReady] = useState(false);

  useEffect(() => {
    setIsChartReady(true);
  }, []);

  const transformedData = data.reduce<FormattedEIP[]>((result, item) => {
    const coreEips = item.eips.filter((eip) => eip.category === category);
    const groupedByDate: { [key: string]: FormattedEIP } = coreEips.reduce((grouped, eip) => {
      const date = new Date(eip.year, eip.month - 1);
      const monthName = getMonthName(eip.month);
      const formattedDate = `${monthName} ${eip.year}`;
      if (!grouped[formattedDate]) {
        grouped[formattedDate] = {
          status: item.status,
          date: formattedDate,
          value: 0,
        };
      }
      grouped[formattedDate].value += eip.count;
      return grouped;
    }, {} as { [key: string]: FormattedEIP }); // Add index signature for groupedByDate
  
    return result.concat(Object.values(groupedByDate));
  }, []);

  const filteredData: FormattedEIP[] = transformedData;

  const config = {
    data: filteredData,
    xField: 'date',
    yField: 'value',
    color: categoryColors,
    seriesField: 'status',
    xAxis: {
      range: [0, 1],
      tickCount: 5,
    },
    areaStyle: { fillOpacity: 0.6 },
    legend: { position: 'top-right' },
    smooth: true,
    slider: {
      start: 0.1,
      end: 0.9,
    },
  };

  const bg = useColorModeValue('#f6f6f7', '#171923');

  return (
    <Box
      bgColor={bg}
      marginTop="6"
      paddingEnd="6"
      p="1rem 1rem"
      borderRadius="0.55rem"
      overflowX="auto"
      _hover={{
        border: '1px',
        borderColor: '#10b981',
      }}
      className="hover: cursor-pointer ease-in duration-200"
    >
      {isChartReady ? (
        <Area {...config} />
      ) : (
        <Box display="flex" justifyContent="center" alignItems="center" height="200px">
          <Spinner size="xl" color="green.500" />
        </Box>
      )}
    </Box>
  );
};

export default AreaStatus;