import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Box, useColorModeValue, Spinner } from '@chakra-ui/react';
import { useWindowSize } from 'react-use';

const getCat= (cat: string) => {
    switch (cat) {
        case "Standards Track" || "Standard Track" || "Standards Track (Core, Networking, Interface, ERC)" || "Standard" || "Process" || "Core" || "core":
            return "Core";
        case "ERC":
            return "ERC";
        case "Networking":
            return "Networking";
        case "Interface":
            return "Interface";
        case "Meta":
            return "Meta";
        case "Informational":
            return "Informational";
        default:
            return "Core"
    }
}

const getStatus = (status: string) => {
  switch (status) {
    case "Draft":
      return "Draft";
    case "Final" || "Accepted" || "Superseded":
      return "Final";
    case "Last Call":
      return "Last Call";
    case "Withdrawn" || "Abandoned" || "Rejected":
      return "Withdrawn";
    case "Review":
      return "Review";
    case "Living" || "Active":
      return "Living";
    case "Stagnant":
      return "Stagnant";
    default:
      return "Final";
  }
};

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

  interface MappedDataItem {
    category: string;
    date: string;
    value: number;
  }
  
  interface EIP {
    status: string;
    eips: {
      status: string;
      month: number;
      year: number;
      date: string;
      count: number;
      category: string;
      type:string;
    }[];
  }
  
  interface FormattedEIP {
    category: string;
    date: string;
    value: number;
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
    status: string;
  }

  const StackedColumnChart : React.FC<AreaCProps> = ( {status} ) => {
    const [data, setData] = useState<EIP[]>([]);
    const windowSize = useWindowSize();
    const bg = useColorModeValue("#f6f6f7", "#171923");
    
  
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

    
  
    const filteredData = data.filter((item) =>
    item.eips.some((eip) => eip.category === status)
);
  
    const transformedData = filteredData.flatMap((item) =>
      item.eips.map((eip) => ({
        year: eip.year.toString(),
        value: eip.count,
        status: getStatus(item.status)
      }))
    );

    console.log(transformedData)
  
    const Area = dynamic(() => import('@ant-design/plots').then((item) => item.Column), {
      ssr: false,
    });
  
    const chartWidth = windowSize.width ? Math.min(windowSize.width * 0.6, 500) : '100%';
    const chartHeight = windowSize.height ? Math.min(windowSize.height * 0.6, 500) : '100%';
  
    const config = {
      data: transformedData,
      xField: 'year',
      yField: 'value',
      color: categoryColors,
      seriesField: 'status',
      isStack: true,
      areaStyle: { fillOpacity: 0.6 },
      legend: { position: 'top-right' as const },
      smooth: true,
      label: {
        position: 'middle',
        style: {
          fill: '#FFFFFF',
          opacity: 0.6,
        },
      } as any,
    };

    return (
      <Box boxSize={"xs"}
           paddingX={'1rem'}
           overflowX={'hidden'}

      >

        <Area {...config}/>
      </Box>
        

    );
  };
  
  export default StackedColumnChart;