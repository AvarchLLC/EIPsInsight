import React, { useEffect, useState } from "react";
import { Box, Icon, useColorModeValue, Text, Spinner, Button, Flex, Heading } from "@chakra-ui/react";
import DateTime from "@/components/DateTime";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);
import dynamic from "next/dynamic";
import axios from "axios";
import NextLink from "next/link";

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
  repo:string;
  unique_ID: number;
  __v: number;
} 

const EIPStatusDonut = () => {
  const [data, setData] = useState<EIP[]>([]);
  const [isReady, setIsReady] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/new/all`);
        let jsonData = await response.json();
        jsonData.rip.forEach((item: EIP) => {
          if (item.eip === "7859") {
              item.status = "Draft"; 
          }
      });
      
        setData(jsonData.rip);
        console.log("rip donut data:", jsonData.rip);
        setIsReady(true);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const dat = [
    {
      status: "Final",
      value: data.filter((item) => item.status === "Final").length,
    },
    {
      status: "Draft",
      value: data.filter((item) => item.status === "Draft").length,
    },
    {
      status: "Review",
      value: data.filter((item) => item.status === "Review").length,
    },
    {
      status: "Last Call",
      value: data.filter((item) => item.status === "Last Call").length,
    },
    {
      status: "Living",
      value: data.filter((item) => item.status === "Living").length,
    },
    {
      status: "Stagnant",
      value: data.filter((item) => item.status === "Stagnant").length,
    },
    {
      status: "Withdrawn",
      value: data.filter((item) => item.status === "Withdrawn").length,
    },
   
  ].filter((item) => item.value > 0);
  const Area = dynamic(
    () => import("@ant-design/plots").then((item) => item.Pie),
    {
      ssr: false,
    }
  );

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

  const config = {
    appendPadding: 10,
    data: dat,
    angleField: "value",
    colorField: "status",
    radius: 1,
    innerRadius: 0.5,
    legend: { position: "top" as const },
    label: {
      type: "inner",
      offset: "-50%",
      content: "{value}",
      style: {
        textAlign: "center",
        fontSize: 14,
      },
    },
    interactions: [{ type: "element-selected" }, { type: "element-active" }],
    statistic: {
      title: false as const,
      content: {
        style: {
          whiteSpace: "pre-wrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        },
      },
    },
  };

  const downloadData = () => {
    // Convert the data to CSV format
    const header = "Repo, EIP, Title, Author, Status, Type, Category, Discussion, Created at, Deadline, Link\n";

// Prepare the CSV content
const csvContent = header
    + data.map(({ repo, eip, title, author, discussion, status, type, category, created, deadline }) => {
        // Generate the correct URL based on the repo type
        const url = repo === "eip"
            ? `https://eipsinsight.com/eips/eip-${eip}`
            : repo === "erc"
            ? `https://eipsinsight.com/ercs/erc-${eip}`
            : `https://eipsinsight.com/rips/rip-${eip}`;

        // Handle the 'deadline' field, use empty string if not available
        const deadlineValue = deadline || "";

        // Wrap title, author, discussion, and status in double quotes to handle commas
        return `"${repo}","${eip}","${title.replace(/"/g, '""')}","${author.replace(/"/g, '""')}","${status.replace(/"/g, '""')}","${type.replace(/"/g, '""')}","${category.replace(/"/g, '""')}","${discussion.replace(/"/g, '""')}","${created.replace(/"/g, '""')}","${deadlineValue.replace(/"/g, '""')}","${url}"`;
    }).join("\n");

  
    // Create a Blob with the CSV content
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    
    // Create a URL for the Blob
    const url = URL.createObjectURL(blob);
    
    // Create an anchor tag to trigger the download
    const a = document.createElement("a");
    a.href = url;
    a.download = "data.csv";  // File name
    a.click();
    
    // Clean up the URL object
    URL.revokeObjectURL(url);
  };
  
  const bg = useColorModeValue("#f6f6f7", "#171923");
  const headingColor = useColorModeValue('black', 'white');
  return (
    <>
      <Box
        bg={bg}
        borderRadius="0.55rem"
        minHeight="605px"
        _hover={{
          border: "1px",
          borderColor: "#30A0E0",
        }}
      >
        <br/>
        <Flex justifyContent="space-between" alignItems="center" paddingX="1rem">
          <Heading size="md" color={headingColor}>
          <NextLink
      href={
         "/riptable"
      }
    >
      <Text
        fontSize="xl"
        fontWeight="bold"
        color="#30A0E0"
        className="text-left"
        paddingLeft={4}
        display="flex"
        flexDirection="column"
      >
        {`RIP - [${data.length}]`}
      </Text>
    </NextLink>
          </Heading>
          {/* Assuming a download option exists for the yearly data as well */}
          <Button colorScheme="blue"  fontSize={{ base: "0.6rem", md: "md" }} onClick={async () => {
    try {
      // Trigger the CSV conversion and download
      downloadData();

      // Trigger the API call
      await axios.post("/api/DownloadCounter");
    } catch (error) {
      console.error("Error triggering download counter:", error);
    }
  }}>
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

export default EIPStatusDonut;
