// // // import React, { useEffect, useState } from "react";
// // // import { Box, Icon, useColorModeValue, Text, Spinner, Button, Flex, Heading } from "@chakra-ui/react";
// // // import DateTime from "@/components/DateTime";
// // // import {
// // //   Chart as ChartJS,
// // //   CategoryScale,
// // //   LinearScale,
// // //   BarElement,
// // //   Title,
// // //   Tooltip,
// // //   Legend,
// // // } from "chart.js";
// // // ChartJS.register(
// // //   CategoryScale,
// // //   LinearScale,
// // //   BarElement,
// // //   Title,
// // //   Tooltip,
// // //   Legend
// // // );
// // // import dynamic from "next/dynamic";
// // // import axios from "axios";
// // // import NextLink from "next/link";

// // // interface EIP {
// // //   _id: string;
// // //   eip: string;
// // //   title: string;
// // //   author: string;
// // //   status: string;
// // //   type: string;
// // //   category: string;
// // //   created: string;
// // //   discussion: string;
// // //   deadline: string;
// // //   requires: string;
// // //   repo:string;
// // //   unique_ID: number;
// // //   __v: number;
// // // }

// // // const getCat = (cat: string) => {
// // //     switch (cat) {
// // //       case "Standards Track" ||
// // //         "Standard Track" ||
// // //         "Standards Track (Core, Networking, Interface, ERC)" ||
// // //         "Standard" ||
// // //         "Process" ||
// // //         "Core" ||
// // //         "core":
// // //         return "Core";
// // //       case "ERC":
// // //         return "ERCs";
// // //       case "RIP":
// // //         return "RIPs";
// // //       case "Networking":
// // //         return "Networking";
// // //       case "Interface":
// // //         return "Interface";
// // //       case "Meta":
// // //         return "Meta";
// // //       case "Informational":
// // //         return "Informational";
// // //       case "RRC":
// // //         return "RRCs";
// // //       default:
// // //         return "Core";
// // //     }
// // //   };

// // // const EIPStatusDonut = () => {
// // //   const [data, setData] = useState<EIP[]>([]);
// // //   const [isReady, setIsReady] = useState(false);
// // //   useEffect(() => {
// // //     const fetchData = async () => {
// // //       try {
// // //         const response = await fetch(`/api/new/all`);
// // //         const jsonData = await response.json();
// // //         setData(jsonData.rip);
// // //         console.log(jsonData);
// // //         console.log("rip data:",jsonData.rip);
// // //         setIsReady(true);
// // //       } catch (error) {
// // //         console.error("Error fetching data:", error);
// // //       }
// // //     };

// // //     fetchData();
// // //   }, []);

// // //   const dat2 = [
// // //     {
// // //       status: "Core",
// // //       value: data.filter((item) => item.type === "Standards Track" && item.category === "Core" && item.repo==="rip").length,
// // //     },
// // //       {
// // //         status: "Networking",
// // //         value: data.filter((item) => getCat(item.category) === "Networking").length,
// // //       },
// // //       {
// // //         status: "Interface",
// // //         value: data.filter((item) => getCat(item.category) === "Interface").length,
// // //       },
// // //       {
// // //         status: "Informational",
// // //         value: data.filter((item) => getCat(item.category) === "Informational").length,
// // //       },
// // //       {
// // //         status: "Meta",
// // //         value: data.filter((item) => getCat(item.category) === "Meta").length,
// // //       },
// // //       {
// // //         status: "RIPs",
// // //         value: data.filter((item) => getCat(item.category) === "RIPs").length,
// // //       },
// // //       {
// // //         status: "RRCs",
// // //         value: data.filter((item) => getCat(item.category) === "RRCs").length,
// // //       },

// // //   ].filter((item) => item.value > 0);



// // //   const Area = dynamic(
// // //     () => import("@ant-design/plots").then((item) => item.Pie),
// // //     {
// // //       ssr: false,
// // //     }
// // //   );

// // //   const categoryColors: string[] = [
// // //     "rgb(255, 99, 132)",
// // //     "rgb(255, 159, 64)",
// // //     "rgb(255, 205, 86)",
// // //     "rgb(75, 192, 192)",
// // //     "rgb(54, 162, 235)",
// // //     "rgb(153, 102, 255)",
// // //     "rgb(255, 99, 255)",
// // //     "rgb(50, 205, 50)",
// // //     "rgb(255, 0, 0)",
// // //     "rgb(0, 128, 0)",
// // //   ];
// // //   const categoryBorder: string[] = [
// // //     "rgba(255, 99, 132, 0.2)",
// // //     "rgba(255, 159, 64, 0.2)",
// // //     "rgba(255, 205, 86, 0.2)",
// // //     "rgba(75, 192, 192, 0.2)",
// // //     "rgba(54, 162, 235, 0.2)",
// // //     "rgba(153, 102, 255, 0.2)",
// // //     "rgba(255, 99, 255, 0.2)",
// // //     "rgba(50, 205, 50, 0.2)",
// // //     "rgba(255, 0, 0, 0.2)",
// // //     "rgba(0, 128, 0, 0.2)",
// // //   ];
// // //   console.log(data);

// // //   const config = {
// // //     appendPadding: 10,
// // //     data: dat2,
// // //     angleField: "value",
// // //     colorField: "status",
// // //     radius: 1,
// // //     innerRadius: 0.5,
// // //     legend: { position: "top" as const },
// // //     label: {
// // //       type: "inner",
// // //       offset: "-50%",
// // //       content: "{value}",
// // //       style: {
// // //         textAlign: "center",
// // //         fontSize: 14,
// // //       },
// // //     },
// // //     interactions: [{ type: "element-selected" }, { type: "element-active" }],
// // //     statistic: {
// // //       title: false as const,
// // //       content: {
// // //         style: {
// // //           whiteSpace: "pre-wrap",
// // //           overflow: "hidden",
// // //           textOverflow: "ellipsis",
// // //         },
// // //       },
// // //     },
// // //   };

// // //   const downloadData = () => {
// // //     // Convert the data to CSV format
// // //     const header = "Repo, EIP, Title, Author, Status, Type, Category, Discussion, Created at, Deadline, Link\n";

// // // // Prepare the CSV content
// // // const csvContent = header
// // //     + data.map(({ repo, eip, title, author, discussion, status, type, category, created, deadline }) => {
// // //         // Generate the correct URL based on the repo type
// // //         const url = repo === "eip"
// // //             ? `https://eipsinsight.com/eips/eip-${eip}`
// // //             : repo === "erc"
// // //             ? `https://eipsinsight.com/ercs/erc-${eip}`
// // //             : `https://eipsinsight.com/rips/rip-${eip}`;

// // //         // Handle the 'deadline' field, use empty string if not available
// // //         const deadlineValue = deadline || "";

// // //         // Wrap title, author, discussion, and status in double quotes to handle commas
// // //         return `"${repo}","${eip}","${title.replace(/"/g, '""')}","${author.replace(/"/g, '""')}","${status.replace(/"/g, '""')}","${type.replace(/"/g, '""')}","${category.replace(/"/g, '""')}","${discussion.replace(/"/g, '""')}","${created.replace(/"/g, '""')}","${deadlineValue.replace(/"/g, '""')}","${url}"`;
// // //     }).join("\n");


// // //     // Create a Blob with the CSV content
// // //     const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

// // //     // Create a URL for the Blob
// // //     const url = URL.createObjectURL(blob);

// // //     // Create an anchor tag to trigger the download
// // //     const a = document.createElement("a");
// // //     a.href = url;
// // //     a.download = "data.csv";  // File name
// // //     a.click();

// // //     // Clean up the URL object
// // //     URL.revokeObjectURL(url);
// // //   };

// // //   const bg = useColorModeValue("#f6f6f7", "#171923");
// // //   const headingColor = useColorModeValue('black', 'white');
// // //   return (
// // //     <>
// // //       <Box
// // //         bg={bg}
// // //         borderRadius="0.55rem"
// // //         minHeight="605px"
// // //         _hover={{
// // //           border: "1px",
// // //           borderColor: "#30A0E0",
// // //         }}
// // //       >
// // //         <br/>
// // //         <Flex justifyContent="space-between" alignItems="center" marginBottom="0.5rem" paddingX="1rem">
// // //           <Heading size="md" color={headingColor}>
// // //           <NextLink
// // //       href={
// // //          "/riptable"
// // //       }
// // //     >
// // //       <Text
// // //         fontSize="2xl"
// // //         fontWeight="bold"
// // //         color="#30A0E0"
// // //         className="text-left"
// // //         paddingLeft={4}
// // //         display="flex"
// // //         flexDirection="column"
// // //       >
// // //         {`RIP - [${data.length}]`}
// // //       </Text>
// // //     </NextLink>
// // //           </Heading>
// // //           {/* Assuming a download option exists for the yearly data as well */}
// // //           <Button colorScheme="blue"  fontSize={{ base: "0.6rem", md: "md" }} onClick={async () => {
// // //     try {
// // //       // Trigger the CSV conversion and download
// // //       downloadData();

// // //       // Trigger the API call
// // //       await axios.post("/api/DownloadCounter");
// // //     } catch (error) {
// // //       console.error("Error triggering download counter:", error);
// // //     }
// // //   }}>
// // //             Download CSV
// // //           </Button>
// // //         </Flex>
// // //         <Area {...config} />
// // //         <Box className={"w-full"}>
// // //           <DateTime />
// // //         </Box>
// // //       </Box>

// // //     </>
// // //   );
// // // };

// // // export default EIPStatusDonut;

// // "use client";
// // import React, { useEffect, useMemo, useState } from "react";
// // import {
// //   Box,
// //   Flex,
// //   Text,
// //   Spinner,
// //   useColorModeValue,
// //   Button,
// // } from "@chakra-ui/react";
// // import DateTime from "@/components/DateTime";
// // import axios from "axios";

// // interface EIP {
// //   _id: string;
// //   eip: string;
// //   title: string;
// //   author: string;
// //   status: string;
// //   type: string;
// //   category: string;
// //   created: string;
// //   discussion: string;
// //   deadline: string;
// //   requires: string;
// //   repo: string;
// //   unique_ID: number;
// //   __v: number;
// // }

// // const types = ["Core", "Networking", "Interface", "Meta", "Informational"];
// // const typeColors = ["#30A0E0", "#3ed59e", "#fbc22f", "#f579ba", "#68aafa"];

// // const EIPStatusDonut = () => {
// //   const [data, setData] = useState<EIP[]>([]);
// //   const [isLoading, setIsLoading] = useState(true);

// //   useEffect(() => {
// //     const fetchData = async () => {
// //       try {
// //         const res = await fetch("/api/new/all");
// //         const json = await res.json();
// //         setData(json.erc); // ERCs only
// //       } catch (error) {
// //         console.error("Error fetching ERC data:", error);
// //       } finally {
// //         setIsLoading(false);
// //       }
// //     };
// //     fetchData();
// //   }, []);

// //   const filteredTypeData = useMemo(() => {
// //     const total = data.length || 1;
// //     return types
// //       .map((type, i) => {
// //         const count = data.filter((item) => item.type === type).length;
// //         if (count === 0) return null;
// //         const percent = ((count / total) * 100).toFixed(1);
// //         return {
// //           type,
// //           count,
// //           percent,
// //           color: typeColors[i % typeColors.length],
// //           description: `ERCs categorized as ${type}.`,
// //         };
// //       })
// //       .filter(Boolean) as {
// //         type: string;
// //         count: number;
// //         percent: string;
// //         color: string;
// //         description: string;
// //       }[];
// //   }, [data]);

// //   const bg = useColorModeValue("#f6f6f7", "#171923");
// //   const cardBg = useColorModeValue("white", "#1A202C");
// //   const textColor = useColorModeValue("gray.700", "gray.200");

// //   const downloadData = () => {
// //     const header = "Repo, EIP, Title, Author, Status, Type, Category, Discussion, Created at, Deadline, Link\n";
// //     const csvContent = header + data.map(({ repo, eip, title, author, discussion, status, type, category, created, deadline }) => {
// //       const url = repo === "eip"
// //         ? `https://eipsinsight.com/eips/eip-${eip}`
// //         : repo === "erc"
// //           ? `https://eipsinsight.com/ercs/erc-${eip}`
// //           : `https://eipsinsight.com/rips/rip-${eip}`;
// //       const deadlineValue = deadline || "";
// //       return `"${repo}","${eip}","${title.replace(/"/g, '""')}","${author.replace(/"/g, '""')}","${status.replace(/"/g, '""')}","${type.replace(/"/g, '""')}","${category.replace(/"/g, '""')}","${discussion.replace(/"/g, '""')}","${created.replace(/"/g, '""')}","${deadlineValue.replace(/"/g, '""')}","${url}"`;
// //     }).join("\n");

// //     const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
// //     const url = URL.createObjectURL(blob);
// //     const a = document.createElement("a");
// //     a.href = url;
// //     a.download = "erc_data.csv";
// //     a.click();
// //     URL.revokeObjectURL(url);
// //   };

// //   return (
// //     <Box
// //       bg={bg}
// //       borderRadius="0.55rem"
// //       minHeight="605px"
// //       padding="1rem"
// //       _hover={{ border: "1px solid", borderColor: "#30A0E0" }}
// //     >
// //       <Flex justifyContent="space-between" alignItems="center" mb="1rem">
// //         <Text fontSize="2xl" fontWeight="bold" color="#30A0E0">
// //           ERC - [{data.length}]
// //         </Text>
// //         <Button
// //           colorScheme="blue"
// //           fontSize={{ base: "0.6rem", md: "md" }}
// //           onClick={async () => {
// //             try {
// //               downloadData();
// //               await axios.post("/api/DownloadCounter");
// //             } catch (error) {
// //               console.error("Error downloading:", error);
// //             }
// //           }}
// //         >
// //           Download CSV
// //         </Button>
// //       </Flex>

// //       {isLoading ? (
// //         <Flex justify="center" align="center" h="300px">
// //           <Spinner size="xl" />
// //         </Flex>
// //       ) : (
// //         <Flex
// //           wrap="wrap"
// //           gap={6}
// //           justify="flex-start"
// //           align="flex-start"
// //           width="100%"
// //         >
// //           <Box
// //             bg={cardBg}
// //             borderRadius="lg"
// //             p={4}
// //             w={{ base: "100%", md: "45%", lg: "30%" }}
// //             border="1px solid"
// //             borderColor="#30A0E0"
// //           >
// //             <Text fontSize="xl" fontWeight="bold" color="#30A0E0">
// //               All ERCs
// //             </Text>
// //             <Text fontSize="3xl" fontWeight="bold" mt={2} color={textColor}>
// //               {data.length}
// //             </Text>
// //             <Text fontSize="sm" color="gray.500">
// //               Total ERC Proposals
// //             </Text>
// //           </Box>

// //           {filteredTypeData.map((item) => (
// //             <Box
// //               key={item.type}
// //               bg={cardBg}
// //               borderRadius="lg"
// //               p={4}
// //               w={{ base: "100%", md: "45%", lg: "30%" }}
// //               border="1px solid"
// //               borderColor={item.color}
// //             >
// //               <Text fontSize="xl" fontWeight="bold" color={item.color}>
// //                 {item.type}
// //               </Text>
// //               <Text fontSize="3xl" fontWeight="bold" mt={2} color={textColor}>
// //                 {item.count} ({item.percent}%)
// //               </Text>
// //               <Text fontSize="sm" color="gray.500">
// //                 {item.description}
// //               </Text>
// //             </Box>
// //           ))}
// //         </Flex>
// //       )}

// //       <Box mt={6}>
// //         <DateTime />
// //       </Box>
// //     </Box>
// //   );
// // };

// // export default EIPStatusDonut;

// "use client";
// import React, { useEffect, useMemo, useState } from "react";
// import {
//   Box,
//   Flex,
//   Text,
//   Spinner,
//   useColorModeValue,
//   Button,
//   Heading,
//   Grid,
// } from "@chakra-ui/react";
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
//   created: string;
//   discussion: string;
//   deadline: string;
//   requires: string;
//   repo: string;
//   unique_ID: number;
//   __v: number;
// }

// const categories = ["Core", "Networking", "Interface", "Meta", "Informational", "RIPs", "RRCs"];
// const colors = ["#30A0E0", "#3ed59e", "#fbc22f", "#f579ba", "#68aafa", "#f97316", "#4ade80"];
// const categoryDescriptions: Record<string, string> = {
//   Core: "Includes protocol-level changes impacting consensus or networking.",
//   Networking: "Covers improvements and proposals in Ethereum networking stack.",
//   Interface: "Relates to APIs and user-facing interface changes.",
//   Meta: "Process-oriented proposals or ecosystem-wide initiatives.",
//   Informational: "Provides general information or guidelines; not enforceable.",
//   RIPs: "Rollup Improvement Proposals aimed at scaling and modularity.",
//   RRCs: "Rollup-specific proposals tailored for particular ecosystems.",
// };

// const getCat = (cat: string): string => {
//   switch (cat) {
//     case "Standards Track":
//     case "Standard Track":
//     case "Standards Track (Core, Networking, Interface, ERC)":
//     case "Standard":
//     case "Process":
//     case "Core":
//     case "core":
//       return "Core";
//     case "ERC":
//       return "ERCs";
//     case "RIP":
//       return "RIPs";
//     case "Networking":
//       return "Networking";
//     case "Interface":
//       return "Interface";
//     case "Meta":
//       return "Meta";
//     case "Informational":
//       return "Informational";
//     case "RRC":
//       return "RRCs";
//     default:
//       return "Core";
//   }
// };

// const RIPTypeDonut = () => {
//   const [data, setData] = useState<EIP[]>([]);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await fetch("/api/new/all");
//         const jsonData = await response.json();
//         setData(jsonData.rip);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     fetchData();
//   }, []);

//   const filteredCategoryData = useMemo(() => {
//     const total = data.length || 1;
//     return categories
//       .map((category, index) => {
//         const count = data.filter((item) => getCat(item.category) === category).length;
//         if (count === 0) return null;
//         return {
//           category,
//           count,
//           percent: ((count / total) * 100).toFixed(1),
//           color: colors[index % colors.length],
//         };
//       })
//       .filter(Boolean) as { category: string; count: number; percent: string; color: string }[];
//   }, [data]);


//   const bg = useColorModeValue("#f6f6f7", "#171923");
//   const cardBg = useColorModeValue("white", "#1A202C");
//   const textColor = useColorModeValue("gray.700", "gray.200");

//   const downloadData = () => {
//     const header = "Repo, EIP, Title, Author, Status, Type, Category, Discussion, Created at, Deadline, Link\n";
//     const csvContent = header +
//       data.map(({ repo, eip, title, author, discussion, status, type, category, created, deadline }) => {
//         const url = `https://eipsinsight.com/rips/rip-${eip}`;
//         const deadlineValue = deadline || "";
//         return `"${repo}","${eip}","${title.replace(/"/g, '""')}","${author.replace(/"/g, '""')}","${status.replace(/"/g, '""')}","${type.replace(/"/g, '""')}","${category.replace(/"/g, '""')}","${discussion.replace(/"/g, '""')}","${created.replace(/"/g, '""')}","${deadlineValue.replace(/"/g, '""')}","${url}"`;
//       }).join("\n");

//     const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = "rip_data.csv";
//     a.click();
//     URL.revokeObjectURL(url);
//     axios.post("/api/DownloadCounter").catch(console.error);
//   };

// return (
//   <Box bg={bg} borderRadius="md" p={6} boxShadow="md">

//     {isLoading ? (
//       <Flex justifyContent="center" alignItems="center" minHeight="200px">
//         <Spinner size="xl" />
//       </Flex>
//     ) : (
//       <Grid
//         templateColumns={{ base: "repeat(1, 1fr)", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }}
//         gap={6}
//         mt={4}
//       >
//         {filteredCategoryData.map(({ category, count, percent, color }) => (
//           <Box
//             key={category}
//             bg={cardBg}
//             p={4}
//             borderRadius="md"
//             boxShadow="sm"
//             borderLeftWidth="6px"
//             borderLeftColor={color}
//           >
//             <Text fontWeight="bold" fontSize="lg" color={textColor}>
//               {category}
//             </Text>
//             <Text color={textColor}>
//               {count} ({percent}%)
//             </Text>
//           </Box>
//         ))}
//       </Grid>
//     )}

//     <Box mt={6}>
//       <DateTime />
//     </Box>
//   </Box>
// );

// };

// export default RIPTypeDonut;


"use client";
import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Flex,
  Text,
  Spinner,
  useColorModeValue,
  Button,
} from "@chakra-ui/react";
import DateTime from "@/components/DateTime";
import axios from "axios";

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

const categories = ["Core", "Networking", "Interface", "Meta", "Informational", "RIPs", "RRCs"];
const colors = ["rgb(255, 99, 132)", //meta
  "rgb(255, 159, 64)", //core
  "rgb(255, 205, 86)", //interface
  "rgb(75, 192, 192)", //networking
  "rgb(54, 162, 235)", //informational
  "rgb(255, 99, 255)", //rips
  "rgb(50, 205, 50)", //rrc's
];
const categoryDescriptions: Record<string, string> = {
  Core: "Includes protocol-level changes impacting consensus or networking.",
  Networking: "Covers improvements and proposals in Ethereum networking stack.",
  Interface: "Relates to APIs and user-facing interface changes.",
  Meta: "Process-oriented proposals or ecosystem-wide initiatives.",
  Informational: "Provides general information or guidelines; not enforceable.",
  RIPs: "Rollup Improvement Proposals aimed at scaling and modularity.",
  RRCs: "Rollup-specific proposals tailored for particular ecosystems.",
};

const getCat = (cat: string): string => {
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
    case "RRC":
      return "RRCs";
    default:
      return "Core";
  }
};

const RIPTypeDonut = () => {
  const [data, setData] = useState<EIP[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/new/all");
        const jsonData = await response.json();
        setData(jsonData.rip);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredCategoryData = useMemo(() => {
    const total = data.length || 1;
    return categories
      .map((category, index) => {
        const count = data.filter((item) => getCat(item.category) === category).length;
        if (count === 0) return null;
        return {
          category,
          count,
          percent: ((count / total) * 100).toFixed(1),
          color: colors[index % colors.length],
          description: categoryDescriptions[category] || "",
        };
      })
      .filter(Boolean) as {
        category: string;
        count: number;
        percent: string;
        color: string;
        description: string;
      }[];
  }, [data]);

  // Include the "All RIPs" card only if data exists
  const showAllCard = data.length > 0;

  // Determine grid layout based on number of cards to show (filtered + all card)
  const itemCount = filteredCategoryData.length + (showAllCard ? 1 : 0);

  // Calculate grid template columns and rows depending on itemCount for no leftover space
  let gridTemplateColumns = "";
  let gridTemplateRows = "";
  let gridGap = "24px";

  if (itemCount === 1) {
    gridTemplateColumns = "1fr";
  } else if (itemCount === 2) {
    gridTemplateColumns = "repeat(2, 1fr)";
  } else if (itemCount === 3) {
    gridTemplateColumns = "repeat(3, 1fr)";
  } else if (itemCount === 4) {
    gridTemplateColumns = "repeat(2, 1fr)";
    gridTemplateRows = "repeat(2, auto)";
  } else if (itemCount === 5) {
    // For 5 items: 3 columns in first row, 2 columns second row
    gridTemplateColumns = "repeat(3, 1fr)";
    gridTemplateRows = "auto auto";
  } else {
    // fallback for >5 (just 3 columns)
    gridTemplateColumns = "repeat(3, 1fr)";
  }

  const bg = useColorModeValue("#f6f6f7", "#171923");
  const cardBg = useColorModeValue("white", "#1A202C");
  const textColor = useColorModeValue("gray.700", "gray.200");

  const downloadData = () => {
    const header = "Repo, EIP, Title, Author, Status, Type, Category, Discussion, Created at, Deadline, Link\n";
    const csvContent = header +
      data.map(({ repo, eip, title, author, discussion, status, type, category, created, deadline }) => {
        const url = `https://eipsinsight.com/rips/rip-${eip}`;
        const deadlineValue = deadline || "";
        return `"${repo}","${eip}","${title.replace(/"/g, '""')}","${author.replace(/"/g, '""')}","${status.replace(/"/g, '""')}","${type.replace(/"/g, '""')}","${category.replace(/"/g, '""')}","${discussion.replace(/"/g, '""')}","${created.replace(/"/g, '""')}","${deadlineValue.replace(/"/g, '""')}","${url}"`;
      }).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "rip_data.csv";
    a.click();
    URL.revokeObjectURL(url);
    axios.post("/api/DownloadCounter").catch(console.error);
  };

  return (
    <Box
      borderRadius="2xl"
      p={{ base: 3, sm: 4, md: 6 }}
      w="full"
      minH={isLoading ? { base: "400px", md: "500px" } : "auto"}
      boxShadow="md"
      _hover={{ border: "1px", borderColor: "#30A0E0" }}
    >
      {isLoading ? (
        <Flex justify="center" align="center" minH="300px">
          <Spinner size="xl" />
        </Flex>
      ) : (
        <Box
          display="grid"
          gridTemplateColumns={gridTemplateColumns}
          gridTemplateRows={gridTemplateRows || "auto"}
          gap={gridGap}
          w="full"
        >
          {filteredCategoryData.map(({ category, count, percent, description, color }, index) => {
            // For 5 items total, make the 4th card span 2 columns
            const shouldSpan = itemCount === 5 && index === 3;

            return (
              <Box
                key={category}
                p={6}
                borderRadius="2xl"
                bg={cardBg}
                boxShadow="xl"
                border="1px solid"
                borderColor="gray.200"
                transition="all 0.3s ease"
                _hover={{ borderColor: color, boxShadow: "2xl" }}
                gridColumn={shouldSpan ? "span 2" : undefined}
                gridRow={itemCount === 5 && index >= 3 ? "2" : undefined}
              >
                <Text fontSize="sm" color={color} fontWeight="semibold" mb={1}>
                  {category}
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
            );
          })}
          {showAllCard && (
            <Box
              p={6}
              borderRadius="2xl"
              bg={cardBg}
              boxShadow="xl"
              border="1px solid"
              borderColor="gray.200"
              transition="all 0.3s ease"
              _hover={{ borderColor: "#30A0E0", boxShadow: "2xl" }}
              gridColumn={itemCount === 5 ? "span 2" : undefined}
              gridRow={itemCount === 5 ? "2" : undefined}
            >
              <Text fontSize={{ base: "24px", sm: "24px", md: "26px", lg: "28px" }} color="#30A0E0" fontWeight="semibold" mb={1}>
                All RIPs
              </Text>
              <Text fontSize={{ base: "20px", sm: "20px", md: "22px", lg: "24px" }} fontWeight="extrabold" color={textColor}>
                {data.length}{" "}
                <Text as="span" fontSize={{ base: "18px", sm: "18px", md: "20px", lg: "22px" }}>
                  (100%)
                </Text>
              </Text>
              <Text fontSize={{ base: "16px", sm: "16px", md: "18px", lg: "20px" }} mt={2} color="gray.500">
                Total number of RIPs across all statuses.
              </Text>
            </Box>
          )}
        </Box>
      )}

      <Box w="full" pt={{ base: 4, sm: 6 }}>
        <DateTime />
      </Box>
    </Box>
  );
};

export default RIPTypeDonut;