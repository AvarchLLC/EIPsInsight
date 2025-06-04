// // interface AreaCProps {
// //   type: string;
// // }

// // const AreaStatus: React.FC<AreaCProps> = ({ type }) => {
// //   const [data, setData] = useState<APIResponse>();

// //   const [typeData, setTypeData] = useState<EIP[]>([]);

// //   useEffect(() => {
// //     const fetchData = async () => {
// //       try {
// //         const response = await fetch(`/api/new/graphsv2`);
// //         const jsonData = await response.json();
// //         setData(jsonData);
// //         if (type === "EIPs" && jsonData.eip) {
// //           setTypeData(
// //             jsonData.eip.filter((item: any) => item.category !== "ERCs")
// //           );
// //         } else if (type === "ERCs" && jsonData.erc) {
// //           setTypeData(jsonData.erc);
// //         }
// //       } catch (error) {
// //         console.error("Error fetching data:", error);
// //       }
// //     };

// //     fetchData();
// //   }, []);

// //   useEffect(() => {
// //     if (type === "EIPs") {
// //       setTypeData(data?.eip || []);
// //     } else if (type === "ERCs") {
// //       setTypeData(data?.erc || []);
// //     }
// //   });


// import React, { useEffect, useState } from "react";
// import dynamic from "next/dynamic";
// import { Flex, Heading, Button,Box, useColorModeValue, Spinner } from "@chakra-ui/react";
// import { useWindowSize } from "react-use";
// import DateTime from "@/components/DateTime";
// import { motion } from "framer-motion";
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
//     status: string;
//     eips: {
//       status: string;
//       month: number;
//       year: number;
//       date: string;
//       count: number;
//       category: string;
//       eips:any[];
//     }[];
//   }

// function getMonthName(month: number): string {
//   const months = [
//     "Jan", "Feb", "Mar", "Apr", "May", "Jun",
//     "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
//   ];
//   return months[month - 1];
// }

// interface AreaCProps {
//   type: string;
// }

// const AreaStatus: React.FC<AreaCProps> = ({ type }) => {
//   const [isLoading, setIsLoading] = useState(true);
//   const [data, setData] = useState<EIP[]>([]);
//   const windowSize = useWindowSize();
//   const bg = useColorModeValue("#f6f6f7", "#171923");

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await fetch(`/api/new/graphsv2`);
//         const jsonData = await response.json();
//         setData(jsonData.eip.concat(jsonData.erc.concat(jsonData.rip)));
//         if (type === "EIPs" && jsonData.eip) {
//           setData(
//           jsonData.eip.filter((item: any) => item.category !== "ERCs")
//         );
//         } else if (type === "ERCs" && jsonData.erc) {
//           setData(jsonData.erc);
//         }
//         else{
//           setData(jsonData.rip)
//         }
//         setIsLoading(false);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     };
//     fetchData();
//   }, []);

//   const removeDuplicatesFromEips = (eips: any[]) => {
//     const seen = new Set();
//     return eips.filter((eip) => {
//       if (!seen.has(eip.eip)) {
//         seen.add(eip.eip);
//         return true;
//       }
//       return false;
//     });
//   };

//   type DataItem = {
//     status: string;
//     category: string;
//     year: string;
//     value: number;
//   };

//   type TransformedItem = {
//     status: string;
//     year: string;
//     value: number;
//   };

//   const consolidateData = (data: DataItem[]): TransformedItem[] => {
//     const result: { [key: string]: TransformedItem } = {};
//     data.forEach((item) => {
//       const key = `${item.status}-${item.year}`;
//       if (result[key]) {
//         result[key].value += item.value;
//       } else {
//         result[key] = { status: item.status, year: item.year, value: item.value };
//       }
//     });
//     return Object.values(result);
//   };
//   const status1="Draft";
//   const status2="Final";
//   let filteredData = data.filter((item) => item.status === status1);
//   let filteredData2 = data.filter((item) => item.status === status2);
//   const combinedFilteredData = [...filteredData, ...filteredData2];

//   const transformedData = combinedFilteredData.flatMap((item) => {
//     return item.eips.map((eip) => ({
//       status: item.status,
//       category: getCat(eip.category),
//       year: `${getMonthName(eip.month)} ${eip.year}`,
//       value: removeDuplicatesFromEips(eip.eips).length,
//     }));
//   });

//   const finalData = consolidateData(transformedData);

//   finalData.sort((a, b) => {
//     const months = [
//         "Jan", "Feb", "Mar", "Apr", "May", "Jun",
//         "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
//       ];
//     const [aMonth, aYear] = a.year.split(" ");
//     const [bMonth, bYear] = b.year.split(" ");
//     return parseInt(aYear, 10) - parseInt(bYear, 10) || 
//            months.indexOf(aMonth) - months.indexOf(bMonth);
//   });

//   const downloadData = () => {
//     // Filter data based on the selected status
//     let filteredData = data.filter((item) => item.status === status1);
//     let filteredData2 = data.filter((item) => item.status === status2);
//     const combinedFilteredData = [...filteredData, ...filteredData2];
    
//     // Transform the filtered data to get the necessary details
//     const transformedData = combinedFilteredData.flatMap((item) => {
//       const status = item.status;
//       return item.eips.flatMap((eip) => {
//           const category = getCat(eip.category);
//           const year = eip.year.toString(); 
//           const month=getMonthName(eip.month);
//           const uniqueEips = removeDuplicatesFromEips(eip.eips); 
//           return uniqueEips.map(({ eip }) => ({
//               status,         
//               category,       
//               year,           
//               month,
//               eip,           
//           }));
//       });
//   });
  

//     // Define the CSV header
//     const header = "Status,Category,Year,Month,EIP\n";
  
//     // Prepare the CSV content
//     const csvContent = "data:text/csv;charset=utf-8,"
//         + header
//         + transformedData.map(({ status,category, year,month, eip }) => {
//             return `${status},${category},${year},${month},${eip}`; // Each EIP on a separate line
//         }).join("\n");
  
//     // Check the generated CSV content before download
//     console.log("CSV Content:", csvContent);
  
//     // Encode the CSV content for downloading
//     const encodedUri = encodeURI(csvContent);
//     const link = document.createElement("a");
//     link.setAttribute("href", encodedUri);
//     link.setAttribute("download", `DraftvsFinal.csv`); 
//     document.body.appendChild(link); 
//     link.click();
//     document.body.removeChild(link);
// };

//   const Area = dynamic(() => import("@ant-design/plots").then((item) => item.Column), { ssr: false });

//   const config = {
//     data: finalData,
//     xField: "year",
//     yField: "value",
//     seriesField: "status",
//     isGroup: true,
//     columnStyle: {
//       radius: [20, 20, 0, 0],
//     },
//     areaStyle: { fillOpacity: 0.6 },
//     slider: { start: 0, end: 1 },
//     legend: { position: "top-right" as const },
//     smooth: true,
//   };

//   const headingColor = useColorModeValue('black', 'white');

//   return (
//     <>
//       {isLoading ? (
//         <Box display="flex" justifyContent="center" alignItems="center" className="h-full">
//           <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
//             <Spinner />
//           </motion.div>
//         </Box>
//       ) : (
//         <Box bgColor={bg} padding={"2rem"} borderRadius={"0.55rem"}>
//           <Flex justifyContent="space-between" alignItems="center" marginBottom="0.5rem">
//           <Heading size="md" color={headingColor}>
//             {`Draft vs Final`}
//           </Heading>
//           {/* Assuming a download option exists for the yearly data as well */}
//           <Button colorScheme="blue" onClick={async () => {
//     try {
//       // Trigger the CSV conversion and download
//       downloadData();

//       // Trigger the API call
//       await axios.post("/api/DownloadCounter");
//     } catch (error) {
//       console.error("Error triggering download counter:", error);
//     }
//   }}>Download CSV</Button>
//         </Flex>
//           <Area {...config} />
//           <Box className={"w-full"}>
//             <DateTime />
//           </Box>
//         </Box>
//       )}
//     </>
//   );
// };

// export default AreaStatus;

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import {
  Flex,
  Heading,
  Button,
  Box,
  useColorModeValue,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useWindowSize } from "react-use";
import DateTime from "@/components/DateTime";
import { motion } from "framer-motion";
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
  status: string;
  eips: {
    status: string;
    month: number;
    year: number;
    date: string;
    count: number;
    category: string;
    eips: any[];
  }[];
}

function getMonthName(month: number): string {
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  return months[month - 1];
}

interface AreaCProps {
  type: string;
}

const AreaStatus: React.FC<AreaCProps> = ({ type }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<EIP[]>([]);
  const windowSize = useWindowSize();
  const bg = useColorModeValue("white", "gray.800");
  const boxShadow = useColorModeValue(
    "0 8px 24px rgba(0, 0, 0, 0.1)",
    "0 8px 24px rgba(255, 255, 255, 0.05)"
  );
  const headingColor = useColorModeValue("gray.700", "gray.100");
  const buttonBg = useColorModeValue("blue.600", "blue.400");
  const buttonHoverBg = useColorModeValue("blue.700", "blue.500");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/new/graphsv2`);
        const jsonData = await response.json();
        setData(jsonData.eip?.concat(jsonData.erc?.concat(jsonData.rip)));
        if (type === "EIPs" && jsonData.eip) {
          setData(jsonData.eip.filter((item: any) => item.category !== "ERCs"));
        } else if (type === "ERCs" && jsonData.erc) {
          setData(jsonData.erc);
        } else {
          setData(jsonData.rip);
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [type]);

  const removeDuplicatesFromEips = (eips: any[]) => {
    const seen = new Set();
    return eips?.filter((eip) => {
      if (!seen.has(eip.eip)) {
        seen.add(eip.eip);
        return true;
      }
      return false;
    });
  };

  type DataItem = {
    status: string;
    category: string;
    year: string;
    value: number;
  };

  type TransformedItem = {
    status: string;
    year: string;
    value: number;
  };

  const consolidateData = (data: DataItem[]): TransformedItem[] => {
    const result: { [key: string]: TransformedItem } = {};
    data?.forEach((item) => {
      const key = `${item.status}-${item.year}`;
      if (result[key]) {
        result[key].value += item.value;
      } else {
        result[key] = { status: item.status, year: item.year, value: item.value };
      }
    });
    return Object.values(result);
  };

  const status1 = "Draft";
  const status2 = "Final";
  let filteredData = data.filter((item) => item.status === status1);
  let filteredData2 = data.filter((item) => item.status === status2);
  const combinedFilteredData = [...filteredData, ...filteredData2];

  const transformedData = combinedFilteredData.flatMap((item) => {
    return item.eips?.map((eip) => ({
      status: item.status,
      category: getCat(eip.category),
      year: `${getMonthName(eip.month)} ${eip.year}`,
      value: removeDuplicatesFromEips(eip.eips)?.length,
    }));
  });

  const finalData = consolidateData(transformedData);

  finalData.sort((a, b) => {
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];
    const [aMonth, aYear] = a.year.split(" ");
    const [bMonth, bYear] = b.year.split(" ");
    return (
      parseInt(aYear, 10) - parseInt(bYear, 10) ||
      months.indexOf(aMonth) - months.indexOf(bMonth)
    );
  });

  const downloadData = () => {
    let filteredData = data.filter((item) => item.status === status1);
    let filteredData2 = data.filter((item) => item.status === status2);
    const combinedFilteredData = [...filteredData, ...filteredData2];

    const transformedData = combinedFilteredData.flatMap((item) => {
      const status = item.status;
      return item.eips.flatMap((eip) => {
        const category = getCat(eip.category);
        const year = eip.year.toString();
        const month = getMonthName(eip.month);
        const uniqueEips = removeDuplicatesFromEips(eip.eips);
        return uniqueEips.map(({ eip }) => ({
          status,
          category,
          year,
          month,
          eip,
        }));
      });
    });

    const header = "Status,Category,Year,Month,EIP\n";

    const csvContent =
      "data:text/csv;charset=utf-8," +
      header +
      transformedData
        .map(({ status, category, year, month, eip }) => {
          return `${status},${category},${year},${month},${eip}`;
        })
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `DraftvsFinal.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const Area = dynamic(
    () => import("@ant-design/plots").then((item) => item.Column),
    { ssr: false }
  );

  const config = {
    data: finalData,
    xField: "year",
    yField: "value",
    seriesField: "status",
    isGroup: true,
    columnStyle: {
      radius: [12, 12, 0, 0],
    },
    areaStyle: { fillOpacity: 0.7 },
    slider: { start: 0, end: 1 },
    legend: { position: "top-right" as const },
    smooth: true,
  };

  return (
    <>
      {isLoading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minH="250px"
          w="100%"
        >
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          >
            <Spinner size="xl" thickness="4px" color={buttonBg} />
          </motion.div>
        </Box>
      ) : (
        <Box
          bg={bg}
          p={{ base: "1.5rem", md: "2.5rem" }}
          borderRadius="lg"
          boxShadow={boxShadow}
          maxW="100%"
          overflowX="auto"
        >
          <Flex
            justifyContent="space-between"
            alignItems="center"
            mb={{ base: 4, md: 6 }}
            flexDirection={{ base: "column", md: "row" }}
            gap={{ base: 3, md: 0 }}
          >
            <Heading
              size={{ base: "md", md: "lg" }}
              color={headingColor}
              textAlign={{ base: "center", md: "left" }}
            >
              Draft vs Final
            </Heading>
            <Button
              bg={buttonBg}
              color="white"
              _hover={{ bg: buttonHoverBg }}
              size={{ base: "md", md: "lg" }}
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
            w="100%"
            minH={{ base: "300px", md: "450px" }}
            maxH="600px"
            overflowX="auto"
            mb={{ base: 6, md: 8 }}
          >
            <Area {...config} />
          </Box>

          <Stack align="center" mt={4}>
            <DateTime />
            <Text
              fontSize="sm"
              color={useColorModeValue("gray.500", "gray.400")}
              mt={2}
              textAlign="center"
              maxW="400px"
              userSelect="none"
            >
              Data visualization of Draft vs Final EIPs over months with detailed
              grouping and filtering.
            </Text>
          </Stack>
        </Box>
      )}
    </>
  );
};

export default AreaStatus;
