import { mockEIP } from "@/data/eipdata";
import {
  Box,
  Text,
  useColorModeValue,
  useColorMode,
  Select,
  Spinner,
} from "@chakra-ui/react";

import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import FlexBetween from "./FlexBetween";
import LoaderComponent from "./Loader";
import DateTime from "./DateTime";

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
  legend: any; // Adjust the type based on the actual props required by the library
  smooth: boolean;
}

const Area = dynamic(
  (): any => import("@ant-design/plots").then((item) => item.Area),
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
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return months[month - 1];
}

interface APIResponse {
  eip: EIP[];
  erc: EIP[];
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

interface AreaCProps {
  type: string;
}

const AreaStatus: React.FC<AreaCProps> = ({ type }) => {
  const [data, setData] = useState<APIResponse>();

  const [typeData, setTypeData] = useState<EIP[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/new/graphsv2`);
        const jsonData = await response.json();
        setData(jsonData);
        if (type === "EIPs" && jsonData.eip) {
          setTypeData(
            jsonData.eip.filter((item: any) => item.category !== "ERCs")
          );
        } else if (type === "ERCs" && jsonData.erc) {
          setTypeData(jsonData.erc);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (type === "EIPs") {
      setTypeData(data?.eip || []);
    } else if (type === "ERCs") {
      setTypeData(data?.erc || []);
    }
  });

  const [isChartReady, setIsChartReady] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [isLoading, setIsLoading] = useState(true); // Add isLoading state

  useEffect(() => {
    setIsLoading(true); // Set isLoading to true before rendering chart
    setTimeout(() => {
      setIsLoading(false); // Set isLoading to false after a small delay (simulating chart rendering)
    }, 1000);
  }, [selectedStatus]);

  useEffect(() => {
    setIsChartReady(true);
  }, []); // Trigger initial render

  const formattedData = typeData.reduce((acc: FormattedEIP[], item: EIP) => {
    if (item.status === "Final" || item.status === "Draft") {
      const formattedEIPs: FormattedEIP[] = item.eips.map((eip) => ({
        status: item.status,
        date: `${getMonthName(eip.month)} ${eip.year}`,
        value: eip.count,
      }));
      acc.push(...formattedEIPs);
    }
    return acc;
  }, []);

  const filteredData: FormattedEIP[] = formattedData;

  const config = {
    data: formattedData,
    xField: "date",
    yField: "value",
    color: categoryColors,
    seriesField: "status",
    xAxis: {
      range: [0, 1],
      tickCount: 5,
    },
    areaStyle: { fillOpacity: 0.6 },
    legend: { position: "top-right" },
    line: {
      visible: false, // Set line visibility to false to remove the points and make the graph non-pointy
    },
    smooth: true, // Set smooth to true to create a smooth curve
    slider: {
      start: 0,
      end: 1,
    },
  };

  const bg = useColorModeValue("#f6f6f7", "#171923");

  return (
    <Box
      bgColor={bg}
      marginTop="6"
      paddingEnd="6"
      p="1rem 1rem"
      borderRadius="0.55rem"
      overflowX="auto"
      _hover={{
        border: "1px",
        borderColor: "#30A0E0",
      }}
      className="hover: cursor-pointer ease-in duration-200"
    >
      <Box>
        {isLoading ? (
          // Show loading spinner while chart is rendering
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="200px"
          >
            <Spinner />
          </Box>
        ) : (
          // Show chart when it's ready
          <Area {...config} />
        )}
      </Box>
      <Box className={"w-full"}>
        <DateTime />
      </Box>
    </Box>
  );
};

export default AreaStatus;
