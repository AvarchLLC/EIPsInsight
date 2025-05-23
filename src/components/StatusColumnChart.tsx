import React, { useEffect, useState } from "react";
import { useWindowSize } from "react-use";
import { Box, useColorModeValue, Button, Flex, Heading } from "@chakra-ui/react";
import dynamic from "next/dynamic";
import axios from "axios";

interface StatusChart {
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

interface APIResponse {
  eip: StatusChart[];
  erc: StatusChart[];
}

interface AreaCProps {
  category: string;
  type: string;
}

const getStatus = (status: string) => {
  switch (status) {
    case "Draft":
      return "Draft";
    case "Final":
    case "Accepted":
    case "Superseded":
      return "Final";
    case "Last Call":
      return "Last Call";
    case "Withdrawn":
    case "Abandoned":
    case "Rejected":
      return "Withdrawn";
    case "Review":
      return "Review";
    case "Living":
    case "Active":
      return "Living";
    case "Stagnant":
      return "Stagnant";
    default:
      return "Final";
  }
};

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
      return "Core";
  }
};

const StatusChart: React.FC<AreaCProps> = ({ category, type }) => {
  const [data, setData] = useState<APIResponse>();
  const [typeData, setTypeData] = useState<StatusChart[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/new/final-status-by-year`);
        const jsonData = await response.json();
        setData(jsonData);
        console.log("chart data", jsonData);
        setTypeData(jsonData.eip);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);



  const windowSize = useWindowSize();
  const bg = useColorModeValue("#f6f6f7", "#171923");

  const filteredData = typeData.map((item) => ({
    year: item.year,
    statusChanges: item.statusChanges.filter(
      (x) => getCat(x.eipCategory) === category
    ),
  }));

  const transformedData = filteredData.flatMap((item) =>
    item.statusChanges.map((change) => ({
      status: getStatus(change.lastStatus),
      year: item.year,
      value: 1,
    }))
  );

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
    legend: { position: "bottom-right" as const },
    smooth: true,
    label: {
      position: "middle",
      content: (originData: any) => {
        return originData.value >= 3 ? `${originData.value}` : '';
      },
      style: {
        fill: "#FFFFFF",
        opacity: 0.9,
        fontWeight: "600",
        fontSize: 12,
      },
    } as any,
  };

  const downloadData = () => {
    // Define the eipCategory you want to filter by
    const targetCategory = category; // Replace with the desired category value

    // Transform the typeData to get the necessary details
    const transformedData = typeData.flatMap(({ statusChanges, year }) => {
      return statusChanges
        .filter(({ eipCategory }) => eipCategory === targetCategory) // Filter by eipCategory
        .map(({ eip, lastStatus, eipTitle, eipCategory }) => ({
          eip,
          lastStatus,
          eipTitle,
          eipCategory,
          year: year.toString(), // Convert year to string
        }));
    });

    // Define the CSV header
    const header = "EIP,Last Status,EIP Title,EIP Category,Year,Link\n";

    // Prepare the CSV content
    const csvContent =
      "data:text/csv;charset=utf-8," +
      header +
      transformedData
        .map(({ eip, lastStatus, eipTitle, eipCategory, year }) => {
          return `${eip},${lastStatus},${eipTitle},${eipCategory},${year},${eipCategory === "ERC"
            ? `https://eipsinsight.com/ercs/erc-${eip}`
            : type === "EIPs"
              ? `https://eipsinsight.com/eips/eip-${eip}`
              : `https://eipsinsight.com/rips/rip-${eip}`
            }`;
        }).join("\n");

    // Check the generated CSV content before download
    console.log("CSV Content:", csvContent);

    // Encode the CSV content for downloading
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "StatusChart.csv"); // Set the filename here
    document.body.appendChild(link); // Required for Firefox
    link.click();
    document.body.removeChild(link);
  };

  const headingColor = useColorModeValue('black', 'white');
  const chartHeight = Math.min(400, windowSize.height * 0.6);


  return (
    <>
      <Flex justifyContent="space-between" alignItems="center" mb="0.5rem" width="100%">
        <Heading size="md" color={headingColor}>
          {category}
        </Heading>
        <Button colorScheme="blue"
          onClick={async () => {
            try {
              // Trigger the CSV conversion and download
              downloadData();

              // Trigger the API call
              await axios.post("/api/DownloadCounter");
            } catch (error) {
              console.error("Error triggering download counter:", error);
            }
          }}
        >
          Download CSV
        </Button>
      </Flex>
      <Box width="100%" height={`${chartHeight}px`}>
        <Area {...config} height={chartHeight} />
      </Box>

    </>
  );


};

export default StatusChart;
