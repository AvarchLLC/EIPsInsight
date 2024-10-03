import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Box, useColorModeValue, Spinner } from "@chakra-ui/react";
import { useWindowSize } from "react-use";
import DateTime from "@/components/DateTime";
import { motion } from "framer-motion";

const getCat = (cat: string) => {
  switch (cat) {
    case "Standards Track" ||
      "Standard Track" ||
      "Standards Track (Core, Networking, Interface, ERC)" ||
      "Standard" ||
      "Process" ||
      "Core" ||
      "core":
      return "Core";
    case "RIP":
      return "RIPs";
    case "ERC":
      return "ERCs";
    case "Networking":
      return "Networking";
    case "Interface":
      return "Interface";
    case "Meta":
      return "Meta";
    case "Informational":
      return "Informational";
    default:
      return "Core";
  }
};

function getMonthName(month: number): string {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return months[month - 1];
}

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
    eips:any[];
  }[];
}

interface FormattedEIP {
  category: string;
  date: string;
  value: number;
}

const categoryColors: string[] = [
  "rgb(255, 99, 132)",
  "rgb(255, 159, 64)",
  "rgb(255, 205, 86)",
  "rgb(75, 192, 192)",
  "rgb(54, 162, 235)",
  "rgb(153, 102, 255)",
  "rgb(255, 99, 255)",
  "rgb(50, 205, 50)",
  "rgb(255, 255,255)",
  "rgb(255, 0, 0)",
  "rgb(0, 128, 0)",
];
const categoryBorder: string[] = [
  "rgba(255, 99, 132, 0.2)",
  "rgba(255, 159, 64, 0.2)",
  "rgba(255, 205, 86, 0.2)",
  "rgba(75, 192, 192, 0.2)",
  "rgba(54, 162, 235, 0.2)",
  "rgba(153, 102, 255, 0.2)",
  "rgba(255, 99, 255, 0.2)",
  "rgba(50, 205, 50, 0.2)",
  "rgba(255, 0, 0, 0.2)",
  "rgba(0, 128, 0, 0.2)",
];

interface AreaCProps {
  status: string;
}
interface APIResponse {
  eip: EIP[];
  erc: EIP[];
  rip: EIP[];
}

const StackedColumnChart: React.FC<AreaCProps> = ({ status }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<EIP[]>([]);
  const windowSize = useWindowSize();
  const bg = useColorModeValue("#f6f6f7", "#171923");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/new/graphsv2`);
        const jsonData = await response.json();
        console.log("rip data:",jsonData.rip);
        setData(jsonData.eip.concat(jsonData.erc.concat(jsonData.rip)));
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const [isChartReady, setIsChartReady] = useState(false);

  useEffect(() => {
    setIsChartReady(true);
  }, []);
  
  const removeDuplicatesFromEips = (eips: any[]) => {
    const seen = new Set();
    
    return eips.filter((eip) => {
      if (!seen.has(eip.eip)) {
        seen.add(eip.eip); // Track seen eip numbers
        return true;
      }
      return false; // Filter out duplicates
    });
  };
  
  let filteredData = data.filter((item) => item.status === status);

  const transformedData = filteredData.flatMap((item) => {
    console.log(item); // Log each item
    return item.eips.map((eip) => ({
      category: getCat(eip.category),
      year: `${getMonthName(eip.month)} ${eip.year.toString()}`,
      value:removeDuplicatesFromEips(eip.eips).length
    }));
  });
  
  const categories = [
    "Core",
    "Networking",
    "Interface",
    "Meta",
    "Informational",
    "ERCs",
    "RIPs",
  ];
  
  categories.forEach((category) => {
    const hasCategory = transformedData.some((entry) => entry.category === category);
  
    if (!hasCategory) {
      transformedData.push({
        category: category,
        year: "2024", 
        value: 0,     
      });
    }
  });
  

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  transformedData.sort((a, b) => {
    const [aMonth, aYear] = a.year.split(" ");
    const [bMonth, bYear] = b.year.split(" ");

    if (aYear !== bYear) {
      return parseInt(aYear, 10) - parseInt(bYear, 10);
    }
    return months.indexOf(aMonth) - months.indexOf(bMonth);
  });

  const Area = dynamic(
    () => import("@ant-design/plots").then((item) => item.Column),
    {
      ssr: false,
    }
  );

  const chartWidth = windowSize.width
    ? Math.min(windowSize.width * 0.6, 500)
    : "100%";
  const chartHeight = windowSize.height
    ? Math.min(windowSize.height * 0.6, 500)
    : "100%";

  const config = {
    data: transformedData,
    xField: "year",
    yField: "value",
    color: categoryColors,
    seriesField: "category",
    isGroup: true,
    columnStyle: {
      radius: [20, 20, 0, 0],
    },
    areaStyle: { fillOpacity: 0.6 },
    slider: {
      start: 0,
      end: 1,
    },
    legend: { position: "top-right" as const },
    smooth: true,
    label: {
      position: "middle",
      style: {
        fill: "#FFFFFF",
        opacity: 0.6,
      },
    } as any,
  };

  return (
    <>
      {isLoading ? (
        <>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            className="h-full"
          >
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Your loader component */}
              <Spinner />
            </motion.div>
          </Box>
        </>
      ) : (
        <Box bgColor={bg} padding={"2rem"} borderRadius={"0.55rem"}>
          <Area {...config} />
          <Box className={"w-full"}>
            <DateTime />
          </Box>
        </Box>
      )}
    </>
  );
};

export default StackedColumnChart;
