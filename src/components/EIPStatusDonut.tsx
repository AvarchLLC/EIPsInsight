// import React, { useEffect, useState } from "react";
// import { Box, Icon, useColorModeValue, Text, Spinner, Button, Flex, Heading } from "@chakra-ui/react";
// import DateTime from "@/components/DateTime";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
// } from "chart.js";
// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend
// );
// import dynamic from "next/dynamic";
// import axios from "axios";
// import NextLink from "next/link";

// interface EIP {
//   _id: string;
//   eip: string;
//   title: string;
//   author: string;
//   status: string;
//   type: string;
//   category: string;
//   created: string;
//   discussion: string;
//   deadline: string;
//   requires: string;
//   repo:string;
//   unique_ID: number;
//   __v: number;
// } 

// const EIPStatusDonut = () => {
//   const [data, setData] = useState<EIP[]>([]);
//   const [isReady, setIsReady] = useState(false);
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await fetch(`/api/new/all`);
//         const jsonData = await response.json();
//         setData(jsonData.eip);
//         setIsReady(true);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     };

//     fetchData();
//   }, []);

//   const dat = [
//     {
//       status: "Final",
//       value: data.filter((item) => item.status === "Final").length,
//     },
//     {
//       status: "Draft",
//       value: data.filter((item) => item.status === "Draft").length,
//     },
//     {
//       status: "Review",
//       value: data.filter((item) => item.status === "Review").length,
//     },
//     {
//       status: "Last Call",
//       value: data.filter((item) => item.status === "Last Call").length,
//     },
//     {
//       status: "Living",
//       value: data.filter((item) => item.status === "Living").length,
//     },
//     {
//       status: "Stagnant",
//       value: data.filter((item) => item.status === "Stagnant").length,
//     },
//     {
//       status: "Withdrawn",
//       value: data.filter((item) => item.status === "Withdrawn").length,
//     },
//   ];
//   const Area = dynamic(
//     () => import("@ant-design/plots").then((item) => item.Pie),
//     {
//       ssr: false,
//     }
//   );

//   const categoryColors: string[] = [
//     "rgb(255, 99, 132)",
//     "rgb(255, 159, 64)",
//     "rgb(255, 205, 86)",
//     "rgb(75, 192, 192)",
//     "rgb(54, 162, 235)",
//     "rgb(153, 102, 255)",
//     "rgb(255, 99, 255)",
//     "rgb(50, 205, 50)",
//     "rgb(255, 0, 0)",
//     "rgb(0, 128, 0)",
//   ];
//   const categoryBorder: string[] = [
//     "rgba(255, 99, 132, 0.2)",
//     "rgba(255, 159, 64, 0.2)",
//     "rgba(255, 205, 86, 0.2)",
//     "rgba(75, 192, 192, 0.2)",
//     "rgba(54, 162, 235, 0.2)",
//     "rgba(153, 102, 255, 0.2)",
//     "rgba(255, 99, 255, 0.2)",
//     "rgba(50, 205, 50, 0.2)",
//     "rgba(255, 0, 0, 0.2)",
//     "rgba(0, 128, 0, 0.2)",
//   ];

//   const config = {
//     appendPadding: 10,
//     data: dat,
//     angleField: "value",
//     colorField: "status",
//     radius: 1,
//     innerRadius: 0.5,
//     legend: { position: "top" as const },
//     label: {
//       type: "inner",
//       offset: "-50%",
//       content: "{value}",
//       style: {
//         textAlign: "center",
//         fontSize: 14,
//       },
//     },
//     interactions: [{ type: "element-selected" }, { type: "element-active" }],
//     statistic: {
//       title: false as const,
//       content: {
//         style: {
//           whiteSpace: "pre-wrap",
//           overflow: "hidden",
//           textOverflow: "ellipsis",
//         },
//       },
//     },
//   };

//   const downloadData = () => {
//     // Convert the data to CSV format
//     const header = "Repo, EIP, Title, Author, Status, Type, Category, Discussion, Created at, Deadline, Link\n";

// // Prepare the CSV content
// const csvContent = header
//     + data.map(({ repo, eip, title, author, discussion, status, type, category, created, deadline }) => {
//         // Generate the correct URL based on the repo type
//         const url = repo === "eip"
//             ? `https://eipsinsight.com/eips/eip-${eip}`
//             : repo === "erc"
//             ? `https://eipsinsight.com/ercs/erc-${eip}`
//             : `https://eipsinsight.com/rips/rip-${eip}`;

//         // Handle the 'deadline' field, use empty string if not available
//         const deadlineValue = deadline || "";

//         // Wrap title, author, discussion, and status in double quotes to handle commas
//         return `"${repo}","${eip}","${title.replace(/"/g, '""')}","${author.replace(/"/g, '""')}","${status.replace(/"/g, '""')}","${type.replace(/"/g, '""')}","${category.replace(/"/g, '""')}","${discussion.replace(/"/g, '""')}","${created.replace(/"/g, '""')}","${deadlineValue.replace(/"/g, '""')}","${url}"`;
//     }).join("\n");

  
//     // Create a Blob with the CSV content
//     const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    
//     // Create a URL for the Blob
//     const url = URL.createObjectURL(blob);
    
//     // Create an anchor tag to trigger the download
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = "data.csv";  // File name
//     a.click();
    
//     // Clean up the URL object
//     URL.revokeObjectURL(url);
//   };
  
//   const bg = useColorModeValue("#f6f6f7", "#171923");
//   const headingColor = useColorModeValue('black', 'white');
//   return (
//     <>
//       <Box
//         bg={bg}
//         borderRadius="0.55rem"
//         minHeight="605px"
//         _hover={{
//           border: "1px",
//           borderColor: "#30A0E0",
//         }}
//       >
//         <br/>
//         <Flex justifyContent="space-between" alignItems="center" paddingX="1rem">
//           <Heading size="md" color={headingColor}>
//           <NextLink
//       href={
//          "/eiptable"
//       }
//     >
//       <Text
//         fontSize="xl"
//         fontWeight="bold"
//         color="#30A0E0"
//         className="text-left"
//         paddingLeft={4}
//         display="flex"
//         flexDirection="column"
//       >
//         {`EIP - [${data.length}]`}
//       </Text>
//     </NextLink>
//           </Heading>
//           {/* Assuming a download option exists for the yearly data as well */}
//           <Button colorScheme="blue"  fontSize={{ base: "0.6rem", md: "md" }} onClick={async () => {
//     try {
//       // Trigger the CSV conversion and download
//       downloadData();

//       // Trigger the API call
//       await axios.post("/api/DownloadCounter");
//     } catch (error) {
//       console.error("Error triggering download counter:", error);
//     }
//   }}>
//             Download CSV
//           </Button>
//         </Flex>
//         <Area {...config} />
//         <Box className={"w-full"}>
//           <DateTime />
//         </Box>
//       </Box>

//     </>
//   );
// };

// export default EIPStatusDonut;

"use client";
import React, { useEffect, useState, useMemo } from "react";
import {
  Box,
  Button,
  Flex,
  Heading,
  Text,
  useColorModeValue,
  Spinner,
} from "@chakra-ui/react";
import axios from "axios";
import dynamic from "next/dynamic";
import NextLink from "next/link";
import DateTime from "@/components/DateTime";

// Dynamic import of Pie chart from @ant-design/plots
const Pie = dynamic(() => import("@ant-design/plots").then((mod) => mod.Pie), {
  ssr: false,
});

// Type definition for EIP data
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
  repo: string;
  unique_ID: number;
  __v: number;
}

const EIPStatusDonut = () => {
  const [data, setData] = useState<EIP[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch data from API on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/new/all");
        const json = await response.json();
        setData(json.eip);
      } catch (error) {
        console.error("Error fetching EIP data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Prepare chart data based on status counts
  const chartData = useMemo(() => {
    const statuses = [
      "Final",
      "Draft",
      "Review",
      "Last Call",
      "Living",
      "Stagnant",
      "Withdrawn",
    ];

    return statuses.map((status) => ({
      status,
      value: data.filter((item) => item.status === status).length,
    }));
  }, [data]);

  // Chart color scheme
  const categoryColors = [
    "#4F46E5",
    "#0EA5E9",
    "#14B8A6",
    "#22C55E",
    "#EAB308",
    "#F97316",
    "#EF4444",
    "#EC4899",
    "#A855F7",
    "#64748B",
  ];

  // Pie chart config
  const config = {
  data: chartData,
  angleField: "value",
  colorField: "status",
  radius: 1,
  innerRadius: 0.6,
  appendPadding: 16,
  legend: {
    position: "bottom" as const,
    itemName: { style: { fontSize: 12 } },
    flipPage: false,
  },
  label: {
    type: "spider",
    labelHeight: 20,
    content: "{name}: {value}",
    style: { fontSize: 12 },
  },
  interactions: [{ type: "element-selected" }, { type: "element-active" }],
  statistic: undefined, // ✅ or just remove this line
  color: categoryColors,
};


  // CSV download logic
  const downloadData = () => {
    const header =
      "Repo,EIP,Title,Author,Status,Type,Category,Discussion,Created at,Deadline,Link\n";

    const csvContent =
      header +
      data
        .map(
          ({
            repo,
            eip,
            title,
            author,
            discussion,
            status,
            type,
            category,
            created,
            deadline,
          }) => {
            const url =
              repo === "eip"
                ? `https://eipsinsight.com/eips/eip-${eip}`
                : repo === "erc"
                ? `https://eipsinsight.com/ercs/erc-${eip}`
                : `https://eipsinsight.com/rips/rip-${eip}`;
            const deadlineValue = deadline || "";
            return `"${repo}","${eip}","${title.replace(/"/g, '""')}","${author.replace(
              /"/g,
              '""'
            )}","${status.replace(/"/g, '""')}","${type.replace(
              /"/g,
              '""'
            )}","${category.replace(/"/g, '""')}","${discussion.replace(
              /"/g,
              '""'
            )}","${created.replace(/"/g, '""')}","${deadlineValue.replace(
              /"/g,
              '""'
            )}","${url}"`;
          }
        )
        .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "eip_data.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownload = async () => {
    try {
      downloadData();
      await axios.post("/api/DownloadCounter");
    } catch (err) {
      console.error("Error triggering download counter:", err);
    }
  };

  const bg = useColorModeValue("#f6f6f7", "#171923");
  const headingColor = useColorModeValue("black", "white");
  
return (
  <Box
    bg={bg}
    borderRadius="0.75rem"
    p={{ base: 3, sm: 4, md: 6 }}
    w="full"
    minH={{ base: "500px", md: "600px" }}
    boxShadow="sm"
    _hover={{ border: "1px", borderColor: "#30A0E0" }}
  >
    {/* Header: Title & Download Button */}
    <Flex
      direction={{ base: "column", sm: "row" }}
      justify="space-between"
      align={{ base: "flex-start", sm: "center" }}
      gap={{ base: 2, sm: 3 }}
      flexWrap="wrap"
    >
      <NextLink href="/eiptable" passHref>
        <Text
          fontSize={{ base: "md", sm: "lg", md: "2xl" }}
          fontWeight="bold"
          color="#30A0E0"
          cursor="pointer"
          _hover={{ textDecoration: "underline" }}
        >
          {`EIP - [${data.length}]`}
        </Text>
      </NextLink>

      <Button
        onClick={handleDownload}
        colorScheme="blue"
        fontSize={{ base: "xs", sm: "sm", md: "md" }}
        px={{ base: 3, sm: 5 }}
        py={{ base: 2 }}
      >
        Download CSV
      </Button>
    </Flex>

    {/* Chart Area */}
    <Box mt={6} w="full" minH={{ base: "250px", sm: "350px", md: "400px" }}>
      {isLoading ? (
        <Flex justify="center" align="center" minH="inherit">
          <Spinner size="xl" />
        </Flex>
      ) : (
        <Box w="full" maxW="100%" overflowX="auto">
          <Pie {...config} />
        </Box>
      )}
    </Box>

    {/* DateTime Footer */}
    <Box w="full" pt={{ base: 4, sm: 6 }}>
      <DateTime />
    </Box>
  </Box>
);
};
export default EIPStatusDonut;
