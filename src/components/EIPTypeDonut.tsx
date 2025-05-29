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

//   const dat2 = [
//     {
//       status: "Core",
//       value: data.filter((item) => item.type === "Standards Track" && item.category === "Core" && item.repo==="eip").length,
//     },
//       {
//         status: "Networking",
//         value: data.filter((item) => getCat(item.category) === "Networking").length,
//       },
//       {
//         status: "Interface",
//         value: data.filter((item) => getCat(item.category) === "Interface").length,
//       },
//       {
//         status: "Informational",
//         value: data.filter((item) => getCat(item.category) === "Informational").length,
//       },
//       {
//         status: "Meta",
//         value: data.filter((item) => getCat(item.category) === "Meta").length,
//       },

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
//     data: dat2,
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
//         <Flex justifyContent="space-between" alignItems="center" marginBottom="0.5rem" paddingX="1rem">
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

// import React, { useEffect, useState } from "react";
// import {
//   Box,
//   Button,
//   Flex,
//   Heading,
//   Spinner,
//   Text,
//   useColorModeValue,
// } from "@chakra-ui/react";
// import dynamic from "next/dynamic";
// import axios from "axios";
// import NextLink from "next/link";
// import DateTime from "@/components/DateTime";

// const Pie = dynamic(() => import("@ant-design/plots").then(mod => mod.Pie), {
//   ssr: false,
// });

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
//   repo: string;
//   unique_ID: number;
//   __v: number;
// }

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

//   const dat2 = [
//     {
//       status: "Core",
//       value: data.filter((item) => item.type === "Standards Track" && item.category === "Core" && item.repo === "eip")
//         .length,
//     },
//     {
//       status: "Networking",
//       value: data.filter((item) => getCat(item.category) === "Networking")
//         .length,
//     },
//     {
//       status: "Interface",
//       value: data.filter((item) => getCat(item.category) === "Interface")
//         .length,
//     },
//     {
//       status: "Informational",
//       value: data.filter((item) => getCat(item.category) === "Informational")
//         .length,
//     },
//     {
//       status: "Meta",
//       value: data.filter((item) => getCat(item.category) === "Meta").length,
//     },
//   ];

//   const config = {
//     data: dat2,
//     angleField: "value",
//     colorField: "status",
//     radius: 1,
//     innerRadius: 0.6,
//     label: {
//       type: "outer",
//       content: "{name} {percentage}",
//     },
//     legend: {
//       position: "bottom" as const,
//       flipPage: false,
//     },
//     interactions: [{ type: "element-active" }],
//     responsive: true,
//     padding: [20, 0, 50, 0],
//     color: [
//       "#0070f3",
//       "#00bcd4",
//       "#8bc34a",
//       "#ffc107",
//       "#e91e63",
//       "#9c27b0",
//     ],
//     statistic: {
//       title: false as const,
//       content: {
//         style: {
//           fontSize: "14px", // ✅ Fix applied here
//         },
//       },
//     },
//   };


//   const downloadData = () => {
//     const header =
//       "Repo, EIP, Title, Author, Status, Type, Category, Discussion, Created at, Deadline, Link\n";

//     const csvContent =
//       header +
//       data
//         .map(
//           ({
//             repo,
//             eip,
//             title,
//             author,
//             discussion,
//             status,
//             type,
//             category,
//             created,
//             deadline,
//           }) => {
//             const url =
//               repo === "eip"
//                 ? `https://eipsinsight.com/eips/eip-${eip}`
//                 : repo === "erc"
//                   ? `https://eipsinsight.com/ercs/erc-${eip}`
//                   : `https://eipsinsight.com/rips/rip-${eip}`;
//             const deadlineValue = deadline || "";
//             return `"${repo}","${eip}","${title.replace(/"/g, '""')}","${author.replace(
//               /"/g,
//               '""'
//             )}","${status.replace(/"/g, '""')}","${type.replace(
//               /"/g,
//               '""'
//             )}","${category.replace(/"/g, '""')}","${discussion.replace(
//               /"/g,
//               '""'
//             )}","${created.replace(/"/g, '""')}","${deadlineValue.replace(
//               /"/g,
//               '""'
//             )}","${url}"`;
//           }
//         )
//         .join("\n");

//     const blob = new Blob([csvContent], {
//       type: "text/csv;charset=utf-8;",
//     });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = "eip_data.csv";
//     a.click();
//     URL.revokeObjectURL(url);
//   };

//   const bg = useColorModeValue("#f9f9fb", "#1a202c");
//   const headingColor = useColorModeValue("black", "white");

//   return (
//     <Box
//       bg={bg}
//       borderRadius="lg"
//       p={{ base: 4, md: 6 }}
//       minHeight={{ base: "auto", md: "650px" }}
//       width="100%"
//       overflow="hidden"
//     >
//       <Flex
//         direction={{ base: "column", md: "row" }}
//         justifyContent="space-between"
//         alignItems={{ base: "flex-start", md: "center" }}
//         gap={3}
//         mb={4}
//       >
//         <NextLink href="/eiptable" passHref>
//           <Text
//             fontSize={{ base: "lg", md: "xl" }}
//             fontWeight="bold"
//             color="#30A0E0"
//             cursor="pointer"
//             _hover={{ textDecoration: "underline" }}
//           >
//             {`EIP - [${data.length}]`}
//           </Text>
//         </NextLink>

//         <Button
//           size={{ base: "sm", md: "md" }}
//           colorScheme="blue"
//           onClick={async () => {
//             try {
//               downloadData();
//               await axios.post("/api/DownloadCounter");
//             } catch (error) {
//               console.error("Error triggering download counter:", error);
//             }
//           }}
//         >
//           Download CSV
//         </Button>
//       </Flex>

//       {!isReady ? (
//         <Flex justify="center" align="center" minH="300px">
//           <Spinner size="xl" />
//         </Flex>
//       ) : (
//         <Pie {...config} />
//       )}

//       <Box mt={6}>
//         <DateTime />
//       </Box>
//     </Box>
//   );
// };

// export default EIPStatusDonut;

"use client";
import React, { useEffect, useState, useMemo } from "react";
import {
  Box,
  Flex,
  Text,
  Spinner,
  SimpleGrid,
  useColorModeValue,
} from "@chakra-ui/react";
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

const colorsByType = [
  "#f579ba", // Core
  "#3ed59e", // Networking
  "#68aafa", // Interface
  "#fbc22f", // Meta
  "#ac91fa", // Informational
];

const EIPTypeDonut = () => {
  const [data, setData] = useState<EIP[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  const normalizeCategory = (cat: string) => {
    switch (cat) {
      case "Standards Track":
      case "Standard Track":
      case "Standards Track (Core, Networking, Interface, ERC)":
      case "Standard":
      case "Core":
      case "core":
        return "Core";
      case "ERC":
        return "ERCs";
      case "RIP":
        return "RIPs";
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

  const chartData = useMemo(() => {
    const total = data.length || 1;
    const types = [
      "Core",
      "Networking",
      "Interface",
      "Meta",
      "Informational",
    ];
    return types.map((type, i) => {
      const count = data.filter((item) => normalizeCategory(item.category) === type).length;
      const percent = ((count / total) * 100).toFixed(1);
      return {
        type,
        count,
        percent,
        color: colorsByType[i % colorsByType.length],
        description: `EIPs categorized as ${type}.`,
      };
    });
  }, [data]);

  const bg = useColorModeValue("#f6f6f7", "#171923");
  const cardBg = useColorModeValue("white", "#1A202C");
  const textColor = useColorModeValue("gray.700", "gray.200");

  return (
    <Box
      borderRadius="2xl"
      p={{ base: 3, sm: 4, md: 6 }}
      w="full"
      minH={{ base: "400px", md: "500px" }}
      boxShadow="md"
      _hover={{ border: "1px", borderColor: "#30A0E0" }}
    >
      <Box mt={6}>
        {isLoading ? (
          <Flex justify="center" align="center" minH="300px">
            <Spinner size="xl" />
          </Flex>
        ) : (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
            {chartData.map(({ type, count, percent, description, color }) => (
              <Box
                key={type}
                p={6}
                borderRadius="2xl"
                bg={cardBg}
                boxShadow="xl"
                border="1px solid"
                borderColor="gray.200"
                transition="all 0.3s ease"
                _hover={{ borderColor: color, boxShadow: "2xl" }}
              >
                <Text fontSize="sm" color={color} fontWeight="semibold" mb={1}>
                  {type}
                </Text>
                <Text fontSize="3xl" fontWeight="extrabold" color={textColor}>
                  {count}{" "}
                  <Text as="span" fontSize="md">
                    ({percent}%)
                  </Text>
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
              <Text fontSize="sm" color="#30A0E0" fontWeight="semibold" mb={1}>
                All EIPs
              </Text>
              <Text fontSize="3xl" fontWeight="extrabold" color={textColor}>
                {data.length}{" "}
                <Text as="span" fontSize="md">
                  (100%)
                </Text>
              </Text>
              <Text fontSize="sm" mt={2} color="gray.500">
                Total number of EIPs across all categories.
              </Text>
            </Box>
          </SimpleGrid>
        )}
      </Box>

      <Box w="full" pt={{ base: 4, sm: 6 }}>
        <DateTime />
      </Box>
    </Box>
  );
};

export default EIPTypeDonut;
