// import React, { useEffect, useState } from "react";
// import dynamic from "next/dynamic";
// import { Box, useColorModeValue, Spinner, Text,Button, Flex, Heading } from "@chakra-ui/react";
// import { motion } from "framer-motion";
// import DateTime from "@/components/DateTime";
// import NextLink from "next/link";
// import axios from "axios";

// const getCat = (cat: string) => {
//   switch (cat) {
//     case "Standards Track":
//     case "Standard Track":
//     case "Standards Track (Core, Networking, Interface, ERC)":
//     case "Standard":
//     case "Process":
//     case "Core":
//     case "core":
//       return "Core";
//     case "RIP":
//       return "RIPs";
//     case "ERC":
//       return "ERCs";
//     case "Networking":
//       return "Networking";
//     case "Interface":
//       return "Interface";
//     case "Meta":
//       return "Meta";
//     case "Informational":
//       return "Informational";
//     default:
//       return "Core";
//   }
// };

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
//     category: string;
//     year: number;
//     value: number;
//   }

//   const transformedData = data.reduce<TransformedData[]>((acc, item) => {
//     const year = new Date(item.created).getFullYear();
//     const category = getCat(item.category);

//     // Check if a record for the same category and year already exists
//     const existingEntry = acc.find((entry) => entry.year === year && entry.category === category);

//     if (existingEntry) {
//       // If it exists, increment the value
//       existingEntry.value += 1;
//     } else {
//       // Otherwise, create a new entry
//       acc.push({
//         category: category,
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
//     seriesField: "category",
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
//       // Trigger the CSV conversion and download
//       downloadData();

//       // Trigger the API call
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
//       // height={400}
//       overflowX="auto"     // Enable horizontal scrolling if necessary
//       overflowY="hidden"
//       as={motion.div}
//       // padding={"2 rem"}
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
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import DateTime from "@/components/DateTime";
import NextLink from "next/link";
import axios from "axios";

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
  "rgb(255, 99, 132)", //meta
  "rgb(255, 159, 64)", //core
  "rgb(255, 205, 86)", //interface
  "rgb(75, 192, 192)", //networking
  "rgb(54, 162, 235)", //informational
];

interface ChartProps {
  type: string;
}

const AllChart: React.FC<ChartProps> = ({ type }) => {
  const [data, setData] = useState<EIP[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const bg = useColorModeValue("#f9fafb", "#1a202c");

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
                item.status = "Draft"; // Update the status
            }
        });        
          setData(jsonData.rip);
        } else if (type === "Total") {
          setData(jsonData.eip?.concat(jsonData.erc?.concat(jsonData.rip)));
        } else {
          setData(jsonData.eip?.concat(jsonData.erc?.concat(jsonData.rip)));
        }
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching:", err);
      }
    };
    fetchData();
  }, [type]);

  const transformedData = data.reduce<{
    [key: string]: { category: string; year: number; value: number };
  }>((acc, item) => {
    const year = new Date(item.created).getFullYear();
    const category = getCat(item.category);
    const key = `${category}-${year}`;
    if (!acc[key]) {
      acc[key] = { category, year, value: 0 };
    }
    acc[key].value += 1;
    return acc;
  }, {});

  const chartData = Object.values(transformedData);

  const Area = dynamic(() => import("@ant-design/plots").then((mod) => mod.Column), {
    ssr: false,
  });

  const config = {
    data: chartData,
    xField: "year",
    yField: "value",
    seriesField: "category",
    isStack: true,
    color: categoryColors,
    smooth: true,
    legend: { position: "bottom-right" as const },
    interactions: [{ type: "element-active" }],
    slider: { start: 0, end: 1 },
    areaStyle: { fillOpacity: 0.7 },
  };

  const downloadData = () => {
    const header = "Repo,EIP,Title,Author,Status,Type,Category,Discussion,Created,Deadline,Link\n";
    const csv = data
      .map(({ repo, eip, title, author, status, type, category, discussion, created, deadline }) => {
        const url =
          repo === "eip"
            ? `https://eipsinsight.com/eips/eip-${eip}`
            : repo === "erc"
              ? `https://eipsinsight.com/ercs/erc-${eip}`
              : `https://eipsinsight.com/rips/rip-${eip}`;
        return `"${repo}","${eip}","${title.replace(/"/g, '""')}","${author.replace(/"/g, '""')}","${status}","${type}","${category}","${discussion}","${created}","${deadline || ""}","${url}"`;
      })
      .join("\n");
    const blob = new Blob([header + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "eip_data.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      {isLoading ? (
        <Box display="flex" justifyContent="center" alignItems="center" h="300px">
          <Spinner size="xl" color="blue.400" />
        </Box>
      ) : (
        <Box
          bgColor={bg}
          borderRadius="xl"
          boxShadow="lg"
          p={4}
          mb={6}
          h="full"
          _hover={{ border: "1px solid", borderColor: "blue.400" }}
        >
          <Flex justify="space-between" align="center" mb={4}>
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
              passHref
            >
              <Text
                fontSize={["md", "lg", "xl"]}
                fontWeight="bold"
                color="blue.500"
                cursor="pointer"
              >
                {type === "Total"
                  ? `Total Ethereum Proposals - [${data.length}]`
                  : `${type} - [${data.length}]`}
              </Text>
            </NextLink>
            <Button
              size="sm"
              bg="#40E0D0"
              color="white"
              _hover={{ bg: "#30c9c9" }}
              _active={{ bg: "#1fb8b8" }}
              onClick={async () => {
                try {
                  downloadData();
                  await axios.post("/api/DownloadCounter");
                } catch (err) {
                  console.error("Download error:", err);
                }
              }}
            >
              Download CSV
            </Button>
          </Flex>

          <Box as={motion.div} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
            <Box w="100%" overflowX="auto">
              <Area {...config} />
            </Box>
          </Box>
        </Box>
      )}
    </>
  );
};

export default AllChart;
