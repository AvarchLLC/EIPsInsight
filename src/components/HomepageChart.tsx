import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Box, useColorModeValue, Spinner, Text } from "@chakra-ui/react";
import { useWindowSize } from "react-use";
import { motion } from "framer-motion";
import DateTime from "@/components/DateTime";
import Dashboard from "./Dashboard";
import NextLink from "next/link";


const getCat = (cat: string) => {
  switch (cat) {
    case "Standards Track":
    case "Standard Track":
    case "Standards Track (Core, Networking, Interface, ERC)":
    case "Standard":
    case "Process":
    case "Core":
    case "core":
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
  _id: string;
  eip: string;
  title: string;
  author: string;
  status: string;
  type: string;
  category: string;
  created: Date;
  discussion: string;
  deadline: string;
  requires: string;
  repo:string;
  unique_ID: number;
  __v: number;
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

interface APIResponse {
  eip: EIP[];
  erc: EIP[];
  rip: EIP[];
}

interface ChartProps {
  type: string;
}

const AllChart: React.FC<ChartProps> = ({ type }) => {
  const [data, setData] = useState<EIP[]>([]);
  const bg = useColorModeValue("#f6f6f7", "#171923");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/new/all`);
        const jsonData = await response.json();
        if (type === "EIP") {
          setData(jsonData.eip);
        } else if (type === "ERC") {
          setData(jsonData.erc);
        } else if (type === "RIP") {
          setData(jsonData.rip);
        } else if (type === "Total") {
          setData(jsonData.eip?.concat(jsonData.erc?.concat(jsonData.rip)));
        } else {
          setData(jsonData.eip?.concat(jsonData.erc?.concat(jsonData.rip)));
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const transformedData = data.flatMap((item) => {
    const year = new Date(item.created).getFullYear();
  
    if (item.repo === 'rip') {
      // If the repo is 'rip', set category to 'rip'
      return {
        category: 'RIPs',
        year: year,
        value: 1,
      };
    } else {
      // For non-rip items, apply getCat function
      return {
        category: getCat(item.category),
        year: year,
        value: 1,
      };
    }
  });
  


  const Area = dynamic(
    () => import("@ant-design/plots").then((item) => item.Column),
    {
      ssr: false,
    }
  );

  // const config = {
  //   data: transformedData,
  //   xField: "year",
  //   yField: "value",
  //   color: categoryColors,
  //   seriesField: "category",
  //   isStack: true,
  //   areaStyle: { fillOpacity: 0.6 },
  //   legend: { position: "top-right" as const },
  //   smooth: true,
  //   // label: {
  //   //   position: "middle",
  //   //   style: {
  //   //     fill: "#FFFFFF",
  //   //     opacity: 0.6,
  //   //   },
  //   // } as any,
  // };

  const config = {
    data: transformedData, // Ensure sortedData matches the expected type
    xField: "year",
    yField: "value",
    color: categoryColors,
    seriesField: "category", // Field for series grouping
    isStack: true, // Grouping behavior
    // columnStyle: {
    //   radius: [20, 20, 0, 0], // Rounded corners
    // },
    slider: {
      start: 0, // Start of the slider
      end: 1, // End of the slider
    },
    legend: { position: "top-right" as const }, // Legend position
    smooth: true, // Smooth transition
  };

  return (
    <>
      {isLoading ? ( // Show loader while data is loading
        <Box
          // display="flex"
          // justifyContent="center"
          // alignItems="center"
          // height="200px"
        >
          <Spinner />
        </Box>
      ) : (
        <>
            <Box mt={8}>
              <Area {...config} />
              <Box className={"w-full"}>
                <DateTime />
             </Box>
            </Box>
        </>
      )}
    </>
  );
};

export default AllChart;
