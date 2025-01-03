import React, { useEffect, useState } from "react";
import { Box, Grid, Text, useColorModeValue, Flex, Button } from "@chakra-ui/react";
import { motion } from "framer-motion";
import StatusColumnChart from "@/components/StatusColumnChart";
import AreaC from "@/components/AreaStatus";
import NextLink from "next/link";
import StatusChart from "@/components/StatusColumnChart";
import DateTime from "./DateTime";
import dynamic from "next/dynamic";
const getStatus = (status: string) => {
  switch (status) {
    case "Last Call":
      return "LastCall";
    default:
      return status;
  }
};

interface StatusChartData {
  statusChanges: [
    {
      eip: string;
      lastStatus: string;
      eipTitle: string;
      eipCategory: string;
    }
  ];
  year: number;
}

interface EIP {
  _id: string;
  eip: string;
  title: string;
  author: string;
  status: string;
  type: string;
  category: string;
  created: string;
  discussion: string;
  deadline: string;
  requires: string;
  unique_ID: number;
  __v: number;
}

const ERCStatusGraph = () => {
  const bg = useColorModeValue("#f6f6f7", "#171923");

  const [data, setData] = useState<EIP[]>([]); // Set initial state as an empty array
  const [graphData, setGraphData] = useState<StatusChartData[]>([]); // Set initial state as an empty array
  const [isLoading, setIsLoading] = useState(true); // Loader state
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/new/all`);
        console.log(response);
        const jsonData = await response.json();
        setData(jsonData.erc);
        setIsLoading(false); // Set loader state to false after data is fetched
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false); // Set loader state to false even if an error occurs
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/new/final-status-by-year`);
        const jsonData = await response.json();
        setData(jsonData);
        setGraphData(jsonData.erc);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const transformedData = graphData
    .flatMap((item) =>
      item.statusChanges.map((change) => ({
        status: getStatus(change.lastStatus),
        year: item.year,
        value: 1,
      }))
    )
    .sort((a, b) => a.year - b.year);

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

  const Area = dynamic(
    () => import("@ant-design/plots").then((item) => item.Column),
    {
      ssr: false,
    }
  );

  const config = {
    data: transformedData,
    xField: "year",
    yField: "value",
    color: categoryColors,
    seriesField: "status",
    isStack: true,
    areaStyle: { fillOpacity: 0.6 },
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

  const handleDownloadCSV = (data: StatusChartData[]) => {
    // Convert data to CSV
    const csvContent = [
      ["Year", "EIP", "Last Status", "EIP Title", "EIP Category", "Link"], // Headers
      ...data.flatMap((item) =>
        item.statusChanges.map((statusChange) => [
          item.year,
          statusChange.eip,
          statusChange.lastStatus,
          statusChange.eipTitle,
          statusChange.eipCategory,
          `https://eipsinsight.com/ercs/erc-${statusChange.eip}`,
        ])
      ),
    ].map((row) => row.join(","))
      .join("\n");
  
    // Create a Blob and trigger download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "status_chart_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <Box className="h-full" bg={bg} paddingY={4} paddingX={6} borderRadius={"0.55rem"}>
      <Flex justifyContent="space-between" alignItems="center" marginBottom="1rem">
        <NextLink href={"/riptable"}>
          <Text fontSize="3xl" fontWeight="bold" color="#30A0E0">
            ERC (Progress Over the Years) - [{data.length}]
          </Text>
        </NextLink>
        <Button
          colorScheme="blue"
          fontSize={{ base: "0.6rem", md: "md" }}
          onClick={() => handleDownloadCSV(graphData)}
        >
          Download CSV
        </Button>
      </Flex>
      <Area {...config} />
      <Box className={"w-full"}>
          <DateTime />
        </Box>
    </Box>
    </>
  );
};

export default ERCStatusGraph;
