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
//         setData(jsonData.erc);
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
//          "/erctable"
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
//         {`ERC - [${data.length}]`}
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
  Text,
  useColorModeValue,
  Spinner,
  SimpleGrid,
} from "@chakra-ui/react";
import axios from "axios";
import NextLink from "next/link";
import DateTime from "@/components/DateTime";

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

const ERCStatusDonut = () => {
  const [data, setData] = useState<EIP[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/new/all");
        const json = await res.json();
        setData(json.erc);
      } catch (err) {
        console.error("Error loading ERC data:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const colorsByStatus = [
    "rgb(255, 159, 64)", // Final
    "rgb(255, 99, 255)", // Draft
    "rgb(54, 162, 235)", // Review
    "rgb(153, 102, 255)", // Last Call
    "rgb(255, 99, 132)", // Living
    "rgb(255, 205, 86)", // Stagnant
    "rgb(75, 192, 192)", // Withdrawn
  ];

  const descriptionsByStatus: Record<string, string> = {
    Final: "Final ERCs are approved and adopted into Ethereum standards.",
    Draft: "Draft ERCs are under discussion and subject to change.",
    Review: "Review ERCs are being evaluated by the community.",
    "Last Call": "Last Call ERCs are nearing final approval.",
    Living: "Living ERCs are maintained and continually updated.",
    Stagnant: "Stagnant ERCs have not seen recent activity.",
    Withdrawn: "Withdrawn ERCs were retracted by their authors.",
  };

  const chartData = useMemo(() => {
    const total = data.length || 1;
    const statuses = Object.keys(descriptionsByStatus);
    return statuses.map((status, i) => {
      const count = data.filter(item => item.status === status).length;
      const percent = ((count / total) * 100).toFixed(1);
      return {
        status,
        count,
        percent,
        color: colorsByStatus[i % colorsByStatus.length],
        description: descriptionsByStatus[status],
      };
    });
  }, [data]);

  const downloadData = () => {
    const header = "Repo,EIP,Title,Author,Status,Type,Category,Discussion,Created at,Deadline,Link\n";
    const csv = header + data.map(d => {
      const url = d.repo === "eip" ? `https://eipsinsight.com/eips/eip-${d.eip}` :
        d.repo === "erc" ? `https://eipsinsight.com/ercs/erc-${d.eip}` :
          `https://eipsinsight.com/rips/rip-${d.eip}`;
      const deadline = d.deadline || "";
      return `"${d.repo}","${d.eip}","${d.title.replace(/"/g, '""')}","${d.author.replace(/"/g, '""')}","${d.status}","${d.type}","${d.category}","${d.discussion}","${d.created}","${deadline}","${url}"`;
    }).join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "erc_data.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownload = async () => {
    try {
      downloadData();
      await axios.post("/api/DownloadCounter");
    } catch (error) {
      console.error("Download counter error:", error);
    }
  };

  const bg = useColorModeValue("#f6f6f7", "#171923");
  const cardBg = useColorModeValue("white", "#1A202C");
  const textColor = useColorModeValue("gray.700", "gray.200");

  return (
    <Box
      borderRadius="2xl"
      p={{ base: 4, md: 6 }}
      minH="600px"
      boxShadow="md"
      _hover={{ border: "1px solid", borderColor: "#30A0E0" }}
    >

      {isLoading ? (
        <Flex justify="center" align="center" minH="300px">
          <Spinner size="xl" />
        </Flex>
      ) : (
        <SimpleGrid columns={{ base: 1, sm: 2, md: 2, lg: 4 }} spacing={6}>
          {chartData.map(({ status, count, percent, description, color }) => (
            <Box
              key={status}
              bg={cardBg}
              border="1px solid"
              borderColor="gray.200"
              borderRadius="2xl"
              p={5}
              boxShadow="lg"
              _hover={{ borderColor: color }}
              transition="all 0.3s ease"
            >
              <Text fontSize="md" fontWeight="bold" color={color}>
                {status}
              </Text>
              <Text fontSize="2xl" fontWeight="extrabold" color={textColor}>
                {count} ({percent}%)
              </Text>
              <Text fontSize="sm" mt={2} color="gray.500">
                {description}
              </Text>
            </Box>
          ))}
          <Box
            p={6}
            borderRadius="2xl"
            bg={cardBg}
            boxShadow="xl"
            border="1px solid"
            borderColor="gray.200"
            transition="all 0.3s ease"
            _hover={{ borderColor: "#30A0E0", boxShadow: "2xl" }}
          >
            <Text fontSize={{ base: "24px", sm: "24px", md: "26px", lg: "28px" }} color="#30A0E0" fontWeight="semibold" mb={1}>
              All ERCs
            </Text>
            <Text fontSize={{ base: "20px", sm: "20px", md: "22px", lg: "24px" }} fontWeight="extrabold" color={textColor}>
              {data.length}{" "}
              <Text as="span" fontSize={{ base: "18px", sm: "18px", md: "20px", lg: "22px" }}>
                (100%)
              </Text>
            </Text>
            <Text fontSize={{ base: "16px", sm: "16px", md: "18px", lg: "20px" }} mt={2} color="gray.500">
              Total number of ERCs across all types.
            </Text>
          </Box>
        </SimpleGrid>
      )}

      <Box overflowX={{ base: "auto", md: "visible" }} mt={6}>
        <DateTime />
      </Box>
    </Box>
  );
};

export default ERCStatusDonut;

