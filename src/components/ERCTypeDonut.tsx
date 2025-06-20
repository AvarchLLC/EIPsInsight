// // import React, { useEffect, useState } from "react";
// // import { Box, Icon, useColorModeValue, Text, Spinner, Button, Flex, Heading } from "@chakra-ui/react";
// // import DateTime from "@/components/DateTime";
// // import {
// //   Chart as ChartJS,
// //   CategoryScale,
// //   LinearScale,
// //   BarElement,
// //   Title,
// //   Tooltip,
// //   Legend,
// // } from "chart.js";
// // ChartJS.register(
// //   CategoryScale,
// //   LinearScale,
// //   BarElement,
// //   Title,
// //   Tooltip,
// //   Legend
// // );
// // import dynamic from "next/dynamic";
// // import axios from "axios";
// // import NextLink from "next/link";

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
// //   repo:string;
// //   unique_ID: number;
// //   __v: number;
// // }

// // const getCat = (cat: string) => {
// //     switch (cat) {
// //       case "Standards Track" ||
// //         "Standard Track" ||
// //         "Standards Track (Core, Networking, Interface, ERC)" ||
// //         "Standard" ||
// //         "Process" ||
// //         "Core" ||
// //         "core":
// //         return "Core";
// //       case "ERC":
// //         return "ERCs";
// //       case "RIP":
// //         return "RIPs";
// //       case "Networking":
// //         return "Networking";
// //       case "Interface":
// //         return "Interface";
// //       case "Meta":
// //         return "Meta";
// //       case "Informational":
// //         return "Informational";
// //       default:
// //         return "Core";
// //     }
// //   };

// // const EIPStatusDonut = () => {
// //   const [data, setData] = useState<EIP[]>([]);
// //   const [isReady, setIsReady] = useState(false);
// //   useEffect(() => {
// //     const fetchData = async () => {
// //       try {
// //         const response = await fetch(`/api/new/all`);
// //         const jsonData = await response.json();
// //         setData(jsonData.erc);
// //         setIsReady(true);
// //       } catch (error) {
// //         console.error("Error fetching data:", error);
// //       }
// //     };

// //     fetchData();
// //   }, []);

// //   const dat = [
// //     {
// //       status: "Final",
// //       value: data.filter((item) => item.status === "Final").length,
// //     },
// //     {
// //       status: "Draft",
// //       value: data.filter((item) => item.status === "Draft").length,
// //     },
// //     {
// //       status: "Review",
// //       value: data.filter((item) => item.status === "Review").length,
// //     },
// //     {
// //       status: "Last Call",
// //       value: data.filter((item) => item.status === "Last Call").length,
// //     },
// //     {
// //       status: "Living",
// //       value: data.filter((item) => item.status === "Living").length,
// //     },
// //     {
// //       status: "Stagnant",
// //       value: data.filter((item) => item.status === "Stagnant").length,
// //     },
// //     {
// //       status: "Withdrawn",
// //       value: data.filter((item) => item.status === "Withdrawn").length,
// //     },
// //   ];

// //   const dat2 = [

// //       {
// //         status: "Meta",
// //         value: data.filter((item) => getCat(item.category) === "Meta").length,
// //       },
// //       {
// //         status: "ERC",
// //         value: data.filter((item) => getCat(item.category) === "ERCs").length,
// //       },

// //   ];

// //   const Area = dynamic(
// //     () => import("@ant-design/plots").then((item) => item.Pie),
// //     {
// //       ssr: false,
// //     }
// //   );

// //   const categoryColors: string[] = [
// //     "rgb(255, 99, 132)",
// //     "rgb(255, 159, 64)",
// //     "rgb(255, 205, 86)",
// //     "rgb(75, 192, 192)",
// //     "rgb(54, 162, 235)",
// //     "rgb(153, 102, 255)",
// //     "rgb(255, 99, 255)",
// //     "rgb(50, 205, 50)",
// //     "rgb(255, 0, 0)",
// //     "rgb(0, 128, 0)",
// //   ];
// //   const categoryBorder: string[] = [
// //     "rgba(255, 99, 132, 0.2)",
// //     "rgba(255, 159, 64, 0.2)",
// //     "rgba(255, 205, 86, 0.2)",
// //     "rgba(75, 192, 192, 0.2)",
// //     "rgba(54, 162, 235, 0.2)",
// //     "rgba(153, 102, 255, 0.2)",
// //     "rgba(255, 99, 255, 0.2)",
// //     "rgba(50, 205, 50, 0.2)",
// //     "rgba(255, 0, 0, 0.2)",
// //     "rgba(0, 128, 0, 0.2)",
// //   ];

// //   const config = {
// //     appendPadding: 10,
// //     data: dat2,
// //     angleField: "value",
// //     colorField: "status",
// //     radius: 1,
// //     innerRadius: 0.5,
// //     legend: { position: "top" as const },
// //     label: {
// //       type: "inner",
// //       offset: "-50%",
// //       content: "{value}",
// //       style: {
// //         textAlign: "center",
// //         fontSize: 14,
// //       },
// //     },
// //     interactions: [{ type: "element-selected" }, { type: "element-active" }],
// //     statistic: {
// //       title: false as const,
// //       content: {
// //         style: {
// //           whiteSpace: "pre-wrap",
// //           overflow: "hidden",
// //           textOverflow: "ellipsis",
// //         },
// //       },
// //     },
// //   };

// //   const downloadData = () => {
// //     // Convert the data to CSV format
// //     const header = "Repo, EIP, Title, Author, Status, Type, Category, Discussion, Created at, Deadline, Link\n";

// // // Prepare the CSV content
// // const csvContent = header
// //     + data.map(({ repo, eip, title, author, discussion, status, type, category, created, deadline }) => {
// //         // Generate the correct URL based on the repo type
// //         const url = repo === "eip"
// //             ? `https://eipsinsight.com/eips/eip-${eip}`
// //             : repo === "erc"
// //             ? `https://eipsinsight.com/ercs/erc-${eip}`
// //             : `https://eipsinsight.com/rips/rip-${eip}`;

// //         // Handle the 'deadline' field, use empty string if not available
// //         const deadlineValue = deadline || "";

// //         // Wrap title, author, discussion, and status in double quotes to handle commas
// //         return `"${repo}","${eip}","${title.replace(/"/g, '""')}","${author.replace(/"/g, '""')}","${status.replace(/"/g, '""')}","${type.replace(/"/g, '""')}","${category.replace(/"/g, '""')}","${discussion.replace(/"/g, '""')}","${created.replace(/"/g, '""')}","${deadlineValue.replace(/"/g, '""')}","${url}"`;
// //     }).join("\n");


// //     // Create a Blob with the CSV content
// //     const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

// //     // Create a URL for the Blob
// //     const url = URL.createObjectURL(blob);

// //     // Create an anchor tag to trigger the download
// //     const a = document.createElement("a");
// //     a.href = url;
// //     a.download = "data.csv";  // File name
// //     a.click();

// //     // Clean up the URL object
// //     URL.revokeObjectURL(url);
// //   };

// //   const bg = useColorModeValue("#f6f6f7", "#171923");
// //   const headingColor = useColorModeValue('black', 'white');
// //   return (
// //     <>
// //       <Box
// //         bg={bg}
// //         borderRadius="0.55rem"
// //         minHeight="605px"
// //         _hover={{
// //           border: "1px",
// //           borderColor: "#30A0E0",
// //         }}
// //       >
// //         <br/>
// //         <Flex justifyContent="space-between" alignItems="center" marginBottom="0.5rem" paddingX="1rem">
// //           <Heading size="md" color={headingColor}>
// //           <NextLink
// //       href={
// //          "/erctable"
// //       }
// //     >
// //       <Text
// //         fontSize="xl"
// //         fontWeight="bold"
// //         color="#30A0E0"
// //         className="text-left"
// //         paddingLeft={4}
// //         display="flex"
// //         flexDirection="column"
// //       >
// //         {`ERC - [${data.length}]`}
// //       </Text>
// //     </NextLink>
// //           </Heading>
// //           {/* Assuming a download option exists for the yearly data as well */}
// //           <Button colorScheme="blue"  fontSize={{ base: "0.6rem", md: "md" }} onClick={async () => {
// //     try {
// //       // Trigger the CSV conversion and download
// //       downloadData();

// //       // Trigger the API call
// //       await axios.post("/api/DownloadCounter");
// //     } catch (error) {
// //       console.error("Error triggering download counter:", error);
// //     }
// //   }}>
// //             Download CSV
// //           </Button>
// //         </Flex>
// //         <Area {...config} />
// //         <Box className={"w-full"}>
// //           <DateTime />
// //         </Box>
// //       </Box>

// //     </>
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
//   SimpleGrid,
//   useColorModeValue,
//   Button,
// } from "@chakra-ui/react";
// import DateTime from "@/components/DateTime";
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

// const types = ["Core", "Networking", "Interface", "Meta", "Informational"];

// const typeColors = [
//   "#30A0E0", "#3ed59e", "#fbc22f", "#f579ba", "#68aafa",
// ];

// const EIPStatusDonut = () => {
//   const [data, setData] = useState<EIP[]>([]);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const res = await fetch("/api/new/all");
//         const json = await res.json();
//         setData(json.erc); // specifically ERCs
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     fetchData();
//   }, []);

//   const typeData = useMemo(() => {
//     const total = data.length || 1;
//     return types.map((type, i) => {
//       const count = data.filter((item) => item.type === type).length;
//       const percent = ((count / total) * 100).toFixed(1);
//       return {
//         type,
//         count,
//         percent,
//         color: typeColors[i % typeColors.length],
//         description: `ERCs categorized as ${type}.`,
//       };
//     });
//   }, [data]);

//   const bg = useColorModeValue("#f6f6f7", "#171923");
//   const cardBg = useColorModeValue("white", "#1A202C");
//   const textColor = useColorModeValue("gray.700", "gray.200");

//   const downloadData = async () => {
//     const header = "Repo, EIP, Title, Author, Status, Type, Category, Discussion, Created at, Deadline, Link\n";
//     const csvContent = header + data.map(({ repo, eip, title, author, discussion, status, type, category, created, deadline }) => {
//       const url = `https://eipsinsight.com/${repo}s/${repo}-${eip}`;
//       return `"${repo}","${eip}","${title.replace(/"/g, '""')}","${author.replace(/"/g, '""')}","${status}","${type}","${category}","${discussion}","${created}","${deadline || ""}","${url}"`;
//     }).join("\n");

//     const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = "erc-type-data.csv";
//     a.click();
//     URL.revokeObjectURL(url);

//     await axios.post("/api/DownloadCounter");
//   };

//   return (
//     <Box
//       borderRadius="2xl"
//       p={{ base: 3, sm: 4, md: 6 }}
//       w="full"
//       minH={{ base: "400px", md: "500px" }}
//       boxShadow="md"
//       bg={bg}
//       _hover={{ border: "1px", borderColor: "#30A0E0" }}
//     >
//       <Flex justify="space-between" align="center" mb={4}>
//         <Text fontSize="2xl" fontWeight="bold" color="#30A0E0">
//           ERC Type Overview [{data.length}]
//         </Text>
//         <Button size="sm" colorScheme="blue" onClick={downloadData}>
//           Download CSV
//         </Button>
//       </Flex>

//       {isLoading ? (
//         <Flex justify="center" align="center" minH="300px">
//           <Spinner size="xl" />
//         </Flex>
//       ) : (
//         <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
//           {typeData.map(({ type, count, percent, description, color }) => (
//             <Box
//               key={type}
//               p={6}
//               borderRadius="2xl"
//               bg={cardBg}
//               boxShadow="xl"
//               border="1px solid"
//               borderColor="gray.200"
//               transition="all 0.3s ease"
//               _hover={{ borderColor: color, boxShadow: "2xl" }}
//             >
//               <Text fontSize="sm" color={color} fontWeight="semibold" mb={1}>
//                 {type}
//               </Text>
//               <Text fontSize="3xl" fontWeight="extrabold" color={textColor}>
//                 {count}{" "}
//                 <Text as="span" fontSize="md">
//                   ({percent}%)
//                 </Text>
//               </Text>
//               <Text fontSize="sm" mt={2} color="gray.500">
//                 {description}
//               </Text>
//             </Box>
//           ))}
//           <Box
//             p={6}
//             borderRadius="2xl"
//             bg={cardBg}
//             boxShadow="xl"
//             border="1px solid"
//             borderColor="gray.200"
//             transition="all 0.3s ease"
//             _hover={{ borderColor: "#30A0E0", boxShadow: "2xl" }}
//           >
//             <Text fontSize="sm" color="#30A0E0" fontWeight="semibold" mb={1}>
//               All ERCs
//             </Text>
//             <Text fontSize="3xl" fontWeight="extrabold" color={textColor}>
//               {data.length}{" "}
//               <Text as="span" fontSize="md">
//                 (100%)
//               </Text>
//             </Text>
//             <Text fontSize="sm" mt={2} color="gray.500">
//               Total number of ERCs across all types.
//             </Text>
//           </Box>
//         </SimpleGrid>
//       )}

//       <Box w="full" pt={{ base: 4, sm: 6 }}>
//         <DateTime />
//       </Box>
//     </Box>
//   );
// };

// export default EIPStatusDonut;

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

const types = ["Core", "Networking", "Interface", "Meta", "Informational"];

const typeColors = [
  "rgb(255, 159, 64)", // Core
  "rgb(75, 192, 192)", // Networking
  "rgb(255, 205, 86)", // Interface
  "rgb(255, 99, 132)", // Meta
  "rgb(54, 162, 235)",  // Informational
];

const EIPStatusDonut = () => {
  const [data, setData] = useState<EIP[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/new/all");
        const json = await res.json();
        setData(json.erc); // specifically ERCs
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredTypeData = useMemo(() => {
    const total = data.length || 1;
    // map and filter by count > 0
    return types
      .map((type, i) => {
        const count = data.filter((item) => item.type === type).length;
        if (count === 0) return null; // filter later
        const percent = ((count / total) * 100).toFixed(1);
        return {
          type,
          count,
          percent,
          color: typeColors[i % typeColors.length],
          description: `ERCs categorized as ${type}.`,
        };
      })
      .filter(Boolean) as {
        type: string;
        count: number;
        percent: string;
        color: string;
        description: string;
      }[];
  }, [data]);

  // Include the "All ERCs" card only if data exists
  const showAllCard = data.length > 0;

  // Determine grid layout based on number of cards to show (filtered + all card)
  const itemCount = filteredTypeData.length + (showAllCard ? 1 : 0);

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
    // We'll set explicit grid areas to avoid leftover space
    gridTemplateColumns = "repeat(3, 1fr)";
    gridTemplateRows = "auto auto";
  } else {
    // fallback for >5 (just 3 columns)
    gridTemplateColumns = "repeat(3, 1fr)";
  }

  const bg = useColorModeValue("#f6f6f7", "#171923");
  const cardBg = useColorModeValue("white", "#1A202C");
  const textColor = useColorModeValue("gray.700", "gray.200");

  const downloadData = async () => {
    const header =
      "Repo, EIP, Title, Author, Status, Type, Category, Discussion, Created at, Deadline, Link\n";
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
            const url = `https://eipsinsight.com/${repo}s/${repo}-${eip}`;
            return `"${repo}","${eip}","${title.replace(
              /"/g,
              '""'
            )}","${author.replace(/"/g, '""')}","${status}","${type}","${category}","${discussion}","${created}","${deadline || ""
              }","${url}"`;
          }
        )
        .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "erc-type-data.csv";
    a.click();
    URL.revokeObjectURL(url);

    await axios.post("/api/DownloadCounter");
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
      {/* <Flex justify="space-between" align="center" mb={4}>
        <Text fontSize="2xl" fontWeight="bold" color="#30A0E0">
          ERC Type Overview [{data.length}]
        </Text>
        <Button size="sm" colorScheme="blue" onClick={downloadData}>
          Download CSV
        </Button>
      </Flex> */}

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
          {filteredTypeData.map(({ type, count, percent, description, color }) => (
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
          )}
        </Box>
      )}

      <Box w="full" pt={{ base: 4, sm: 6 }}>
        <DateTime />
      </Box>
    </Box>
  );
};

export default EIPStatusDonut;
