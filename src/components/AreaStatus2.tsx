import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Box, useColorModeValue, Spinner } from "@chakra-ui/react";
import { useWindowSize } from "react-use";
import DateTime from "@/components/DateTime";
import { motion } from "framer-motion";

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

function getMonthName(month: number): string {
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  return months[month - 1];
}

const StackedColumnChart: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<EIP[]>([]);
  const windowSize = useWindowSize();
  const bg = useColorModeValue("#f6f6f7", "#171923");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/new/graphsv2`);
        const jsonData = await response.json();
        setData(jsonData.eip.concat(jsonData.erc.concat(jsonData.rip)));
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const removeDuplicatesFromEips = (eips: any[]) => {
    const seen = new Set();
    return eips.filter((eip) => {
      if (!seen.has(eip.eip)) {
        seen.add(eip.eip);
        return true;
      }
      return false;
    });
  };

  type DataItem = {
    status: string;
    category: string;
    year: string;
    value: number;
  };

  type TransformedItem = {
    status: string;
    year: string;
    value: number;
  };

  const consolidateData = (data: DataItem[]): TransformedItem[] => {
    const result: { [key: string]: TransformedItem } = {};
    data.forEach((item) => {
      const key = `${item.status}-${item.year}`;
      if (result[key]) {
        result[key].value += item.value;
      } else {
        result[key] = { status: item.status, year: item.year, value: item.value };
      }
    });
    return Object.values(result);
  };
  const status1="Draft";
  const status2="Final";
  let filteredData = data.filter((item) => item.status === status1);
  let filteredData2 = data.filter((item) => item.status === status2);
  const combinedFilteredData = [...filteredData, ...filteredData2];

  const transformedData = combinedFilteredData.flatMap((item) => {
    return item.eips.map((eip) => ({
      status: item.status,
      category: getCat(eip.category),
      year: `${getMonthName(eip.month)} ${eip.year}`,
      value: removeDuplicatesFromEips(eip.eips).length,
    }));
  });

  const finalData = consolidateData(transformedData);

  finalData.sort((a, b) => {
    const months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
      ];
    const [aMonth, aYear] = a.year.split(" ");
    const [bMonth, bYear] = b.year.split(" ");
    return parseInt(aYear, 10) - parseInt(bYear, 10) || 
           months.indexOf(aMonth) - months.indexOf(bMonth);
  });

  const Area = dynamic(() => import("@ant-design/plots").then((item) => item.Column), { ssr: false });

  const config = {
    data: finalData,
    xField: "year",
    yField: "value",
    seriesField: "status",
    isGroup: true,
    columnStyle: {
      radius: [20, 20, 0, 0],
    },
    areaStyle: { fillOpacity: 0.6 },
    slider: { start: 0, end: 1 },
    legend: { position: "top-right" as const },
    smooth: true,
  };

  return (
    <>
      {isLoading ? (
        <Box display="flex" justifyContent="center" alignItems="center" className="h-full">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Spinner />
          </motion.div>
        </Box>
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
