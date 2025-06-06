// import React, { useEffect, useState } from "react";
// import dynamic from "next/dynamic";
// import { Box, useColorModeValue, Spinner, Text,Button, Flex, Heading } from "@chakra-ui/react";
// import { motion } from "framer-motion";
// import DateTime from "@/components/DateTime";
// import NextLink from "next/link";
// import axios from "axios";

// interface EIP {
//   _id: string;
//   eip: string;
//   title: string;
//   author: string;
//   status: string;
//   type: string;
//   category: string;
//   created: Date;
//   discussion: string;
//   deadline: string;
//   requires: string;
//   repo:string;
//   unique_ID: number;
//   __v: number;
// }


// const categoryColors: string[] = [
//   "rgb(255, 99, 132)",
//   "rgb(255, 159, 64)",
//   "rgb(255, 205, 86)",
//   "rgb(75, 192, 192)",
//   "rgb(54, 162, 235)",
//   "rgb(153, 102, 255)",
//   "rgb(255, 99, 255)",
//   "rgb(50, 205, 50)",
//   "rgb(255, 0, 0)",
//   "rgb(0, 128, 0)",
// ];


// interface ChartProps {
//   type: string;
// } 

// const AllChart: React.FC<ChartProps> = ({ type }) => {
//   const [data, setData] = useState<EIP[]>([]);
//   const bg = useColorModeValue("#f6f6f7", "#171923");
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await fetch(`/api/new/all`);
//         let jsonData = await response.json();
//         if (type === "EIP") {
//           setData(jsonData.eip);
//         } else if (type === "ERC") {
//           setData(jsonData.erc);
//         } else if (type === "RIP") {
//           jsonData.rip.forEach((item: EIP) => {
//             if (item.eip === "7859") {
//                 item.status = "Draft"; // Update the status
//             }
//         });        
//           setData(jsonData.rip);
//         } else if (type === "Total") {
//           setData(jsonData.eip.concat(jsonData.erc.concat(jsonData.rip)));
//         } else {
//           setData(jsonData.eip.concat(jsonData.erc.concat(jsonData.rip)));
//         }
//         setIsLoading(false);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     };

//     fetchData();
//   }, []);

//   interface TransformedData {
//     status: string;
//     year: number;
//     value: number;
//   }

//   const transformedData = data.reduce<TransformedData[]>((acc, item) => {
//     const year = new Date(item.created).getFullYear();
//     const status = item.status;

//     // Check if a record for the same category and year already exists
//     const existingEntry = acc.find((entry) => entry.year === year && entry.status === status);

//     if (existingEntry) {
//       // If it exists, increment the value
//       existingEntry.value += 1;
//     } else {
//       // Otherwise, create a new entry
//       acc.push({
//         status: status,
//         year: year,
//         value: 1,
//       });
//     }

//     return acc;
//   }, []);





//   const Area = dynamic(
//     () => import("@ant-design/plots").then((item) => item.Column),
//     {
//       ssr: false,
//     }
//   );

//   console.log(transformedData);

//   const config = {
//     data: transformedData,
//     xField: "year",
//     yField: "value",
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
//     slider: {
//       start: 0,
//       end: 1,
//   },
//     color: categoryColors,
//     seriesField: "status",
//     isStack: true,
//     areaStyle: { fillOpacity: 0.6 },
//     legend: { position: "top-right" as const },
//     smooth: true,

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
//         return `"${repo}","${eip}","${title.replace(/"/g, '""')}","${author.replace(/"/g, '""')}","${status.replace(/"/g, '""')}","${type.replace(/"/g, '""')}","${category.replace(/"/g, '""')}","${discussion.replace(/"/g, '""')}","${created}","${deadlineValue.replace(/"/g, '""')}","${url}"`;
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


//   return (
//     <>
//       {isLoading ? ( // Show loader while data is loading
//         <Box
//           display="flex"
//           justifyContent="center"
//           alignItems="center"
//           height="200px"
//         >
//           <Spinner />
//         </Box>
//       ) : (
//         <>
//   <Box
//     bgColor={bg}
//     paddingX="0.5rem"
//     borderRadius="0.55rem"
//     minHeight="605px"
//     _hover={{
//       border: "1px",
//       borderColor: "#30A0E0",
//     }}
//   >


//     {/* Flex container to place the Text and Button on opposite ends */}
//     <Flex justifyContent="space-between" alignItems="center" paddingX="1rem" marginBottom="1rem">
//     <NextLink
//       href={
//         type === "ERC"
//           ? "/erctable"
//           : type === "EIP"
//           ? "/eiptable"
//           : type === "RIP"
//           ? "/riptable"
//           : "/alltable"
//       }
//     >
//       <Text
//         fontSize="xl"
//         fontWeight="bold"
//         color="#30A0E0"
//         className="text-left"
//         paddingY={4}
//         paddingLeft={4}
//         display="flex"
//         flexDirection="column"
//       >
//         {type === 'Total'
//           ? `Total Ethereum Proposals - [${data.length}]`
//           : `${type} - [${data.length}]`}
//       </Text>
//     </NextLink>
//       <Button colorScheme="blue"  fontSize={{ base: "0.6rem", md: "md" }} onClick={async () => {
//     try {
//       downloadData();
//       await axios.post("/api/DownloadCounter");
//     } catch (error) {
//       console.error("Error triggering download counter:", error);
//     }
//   }}>
//         Download CSV
//       </Button>
//     </Flex>

//     <Box
//       width={"100%"}       // Make the container full width
//       minWidth={"100px"}  // Set a minimum width
//       overflowX="auto"     // Enable horizontal scrolling if necessary
//       overflowY="hidden"
//       as={motion.div}
//       initial={{ opacity: 0, y: -20 }}
//       animate={{ opacity: 1, y: 0 }}
//     >
//       <Area {...config} />
//      <Box className={"w-full"}>
//           <DateTime />
//         </Box>
//     </Box>
//   </Box>
// </>

//       )}
//     </>
//   );
// };

// export default AllChart;

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import {
  Box,
  useColorModeValue,
  Spinner,
  Text,
  Button,
  Flex,
  Heading,
  useBreakpointValue,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import DateTime from "@/components/DateTime";
import NextLink from "next/link";
import axios from "axios";

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
  repo: string;
  unique_ID: number;
  __v: number;
}
const categoryColors: string[] = [
  "rgb(255, 99, 132)", //living
  "rgb(255, 159, 64)", //final
  "rgb(255, 205, 86)", //stagant
  "rgb(75, 192, 192)", //withdrawn
  "rgb(54, 162, 235)", //review
  "rgb(153, 102, 255)", //last call
  "rgb(255, 99, 255)", //Draft

];

interface ChartProps {
  type: string;
}

const AllChart: React.FC<ChartProps> = ({ type }) => {
  const [data, setData] = useState<EIP[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const bg = useColorModeValue("#f6f6f7", "#1A202C");

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
          jsonData.rip?.forEach((item: EIP) => {
            if (item.eip === "7859") {
              item.status = "Draft";
            }
          });
          setData(jsonData.rip);
        } else {
          setData([...jsonData.eip, ...jsonData.erc, ...jsonData.rip]);
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  interface TransformedData {
    status: string;
    year: number;
    value: number;
  }

  const transformedData = data.reduce<TransformedData[]>((acc, item) => {
    const year = new Date(item.created).getFullYear();
    const status = item.status;

    const existing = acc.find((d) => d.year === year && d.status === status);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ year, status, value: 1 });
    }

    return acc;
  }, []);

  const Area = dynamic(() => import("@ant-design/plots").then((mod) => mod.Column), {
    ssr: false,
  });

  const config = {
    data: transformedData,
    xField: "year",
    yField: "value",
    interactions: [{ type: "element-selected" }, { type: "element-active" }],
    statistic: {
      title: false as const,
      content: {
        style: {
          fontSize: "14px",
          whiteSpace: "pre-wrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        },
      },
    },
    slider: {
      start: 0,
      end: 1,
    },
    color: categoryColors,
    seriesField: "status",
    isStack: true,
    areaStyle: { fillOpacity: 0.6 },
    legend: { position: "bottom-right" as const },
    smooth: true,
  };

  const downloadData = () => {
    const header = "Repo,EIP,Title,Author,Status,Type,Category,Discussion,Created at,Deadline,Link\n";

    const csvContent =
      header +
      data
        .map(
          ({ repo, eip, title, author, discussion, status, type, category, created, deadline }) => {
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
            )}","${status.replace(/"/g, '""')}","${type.replace(/"/g, '""')}","${category.replace(
              /"/g,
              '""'
            )}","${discussion.replace(/"/g, '""')}","${created}","${deadlineValue.replace(
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
    a.download = "data.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return isLoading ? (
    <Flex justify="center" align="center" minHeight="300px">
      <Spinner size="xl" />
    </Flex>
  ) : (
    <Box
      bg={bg}
      p={{ base: 3, md: 6 }}
      borderRadius="lg"
      shadow="md"
      width="100%"
      height="full"
      overflowX="hidden"
      _hover={{ borderColor: "#30A0E0", borderWidth: "1px" }}
    >
      <Flex
        justify="space-between"
        align="center"
        wrap="wrap"
        gap={4}
        mb={4}
        px={{ base: 2, md: 4 }}
      >
        <NextLink
          href={
            type === "ERC"
              ? "/erctable"
              : type === "EIP"
                ? "/eiptable"
                : type === "RIP"
                  ? "/riptable"
                  : "/alltable"
          }
        >
          <Text
            fontSize={{ base: "md", md: "xl" }}
            fontWeight="bold"
            color="#40E0D0"
            cursor="pointer"
          >
            {type === "Total"
              ? `Total Ethereum Proposals - [${data.length}]`
              : `${type} - [${data.length}]`}
          </Text>
        </NextLink>

        <Button
          bg="#40E0D0"
          color="white"
          _hover={{ bg: "#30c9c9" }}
          _active={{ bg: "#1fb8b8" }}
          fontSize={{ base: "xs", md: "sm" }}
          onClick={async () => {
            try {
              downloadData();
              await axios.post("/api/DownloadCounter");
            } catch (error) {
              console.error("Error triggering download counter:", error);
            }
          }}
        >
          Download CSV
        </Button>
      </Flex>

      <Box
        as={motion.div}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        overflowX="auto"
      >
        <Box minW="320px" maxW="100%">
          <Area {...config} />
        </Box>
      </Box>
    </Box>
  );
};

export default AllChart;
