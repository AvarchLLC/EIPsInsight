// import React, { useState, useEffect } from "react";
// import {
//   Badge,
//   Box,
//   Link,
//   Table,
//   TableContainer,
//   Tbody,
//   Td,
//   Text,
//   Th,
//   Thead,
//   Tr,
//   Wrap,
//   WrapItem,
//   useColorModeValue,
//   Select,
//   Button,
// } from "@chakra-ui/react";
// import { motion } from "framer-motion";
// import DateTime from "@/components/DateTime";
// import { DownloadIcon } from "@chakra-ui/icons";
// import { Spinner } from "@chakra-ui/react";
// import axios from "axios";

// interface EIP {
//   _id: string;
//   eip: string;
//   fromStatus: string;
//   toStatus: string;
//   title: string;
//   status: string;
//   author: string;
//   created: string;
//   changeDate: string;
//   type: string;
//   category: string;
//   discussion: string;
//   deadline: string;
//   requires: string;
//   pr: number;
//   changedDay: number;
//   changedMonth: number;
//   changedYear: number;
//   createdMonth: number;
//   createdYear: number;
//   __v: number;
// }

// interface EIPGroup {
//   category: string;
//   month: number;
//   year: number;
//   date: string;
//   count: number;
//   eips: EIP[];
// }

// interface APIResponse {
//   status: string;
//   eips: EIPGroup[];
// }

// interface Data {
//   eip: APIResponse[];
//   erc: APIResponse[];
//   rip: APIResponse[];
// }

// interface CBoxProps {
//   dataset: Data;
//   status: string;
//   type: string;
// }

// const getStatus = (status: string) => {
//   switch (status) {
//     case "Draft":
//       return "Draft";
//     case "Final":
//     case "Accepted":
//     case "Superseded":
//       return "Final";
//     case "Last Call":
//       return "Last Call";
//     case "Withdrawn":
//     case "Abandoned":
//     case "Rejected":
//       return "Withdrawn";
//     case "Review":
//       return "Review";
//     case "Living":
//     case "Active":
//       return "Living";
//     case "Stagnant":
//       return "Stagnant";
//     default:
//       return "Final";
//   }
// };

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

// const CBoxStatus: React.FC<CBoxProps> = ({ dataset,status, type }) => {
//   const [data, setData] = useState<Data>();
//   const [selectedYear, setSelectedYear] = useState<number>(2025);
//   const [isLoading, setIsLoading] = useState(true);
//   const [typeData, setTypeData] = useState<APIResponse[]>([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const jsonData = dataset;
//         setData(jsonData);
//         if (type === "EIPs" && jsonData.eip) {
//           setTypeData(
//             jsonData.eip.filter(
//               (item: any) =>
//                 item.category !== getCat("ERC") && item.category !== "ERCs"
//             )
//           );
//         } else if (type === "ERCs" && jsonData.erc) {
//           setTypeData(jsonData.erc);
//         }
//         setIsLoading(false);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     };

//     fetchData();
//   }, [dataset]);

//   useEffect(() => {
//     if (type === "EIPs") {
//       setTypeData(data?.eip || []);
//     } else if (type === "ERCs") {
//       setTypeData(data?.erc || []);
//     }
//   });

//   const statusData = typeData.filter(
//     (item) => item.status === getStatus(status)
//   );
//   const yearData = statusData
//     .flatMap((item) => item.eips)
//     .filter((item) => item.year === selectedYear);

//   const result: { [key: string]: number } = {};

//   yearData
//     .filter((item) => item.category !== "ERC")
//     .forEach((item) => {
//       item.eips.forEach((item) => {
//         if (
//           (item.type === "Standards Track" ||
//             item.type === "Standard Track" ||
//             item.type == "Standard" ||
//             item.type == "Core" ||
//             item.type == "Process" ||
//             item.type ==
//               "Standards Track (Core, Networking, Interface, ERC)") &&
//           item.status === getStatus(status)
//         ) {
//           if (item.category === "Core") {
//             result["Standard - Core"] = (result["Standard - Core"] || 0) + 1;
//           }
//           //  else if (item.category === "ERC") {
//           //   result["Standard - ERC"] = (result["Standard - ERC"] || 0) + 1;
//           // }
//           else if (item.category === "Networking") {
//             result["Standard - Networking"] =
//               (result["Standard - Networking"] || 0) + 1;
//           } else if (item.category === "Interface") {
//             result["Standard - Interface"] =
//               (result["Standard - Interface"] || 0) + 1;
//           } else {
//             result["Standard - Core"] = (result["Standard - Core"] || 0) + 1;
//           }
//         } else if (item.type === "Meta" && item.status === getStatus(status)) {
//           result["Meta"] = (result["Meta"] || 0) + 1;
//         } else if (
//           item.type === "Informational" &&
//           item.status === getStatus(status)
//         ) {
//           result["Informational"] = (result["Informational"] || 0) + 1;
//         }
//       });
//     });

//   const convertAndDownloadCSV = () => {
//     if (yearData && yearData.length > 0) {
//       // Define the columns you want to drop
//       const columnsToDrop = [
//         "_id",
//         "fromStatus",
//         "toStatus",
//         // "changeDate",
//         // "type",
//         // "discussion",
//         "requires",
//         "changedDay",
//         "changedMonth",
//         "changedYear",
//         "createdMonth",
//         "deadline",
//         "createdYear",
//         "__v",
//       ];

//       // Create CSV headers
//       const headers =
//         Object.keys(yearData[0].eips[0])
//           .filter((column) => !columnsToDrop.includes(column))
//           .join(",") + "\n";

//       // Convert data to CSV rows
//       const csvRows = yearData.map((item) => {
//         const values = item.eips.map((eip) => {
//           // Filter out the columns you want to drop
//           const filteredValues = Object.values(eip)
//             .filter(
//               (value, index) => !columnsToDrop.includes(Object.keys(eip)[index])
//             )
//             .map((value) => {
//               // Ensure values with commas are enclosed in double quotes
//               if (typeof value === "string" && value.includes(",")) {
//                 return `"${value}"`;
//               }
//               return value;
//             });

//           return filteredValues.join(",");
//         });

//         return values.join("\n");
//       });

//       // Combine headers and rows
//       const csvContent = headers + csvRows.join("\n");

//       // Trigger CSV download
//       const blob = new Blob([csvContent], { type: "text/csv" });
//       const url = window.URL.createObjectURL(blob);
//       const a = document.createElement("a");
//       a.style.display = "none";

//       a.download = `${status}_${selectedYear}.csv`;

//       document.body.appendChild(a);
//       a.href = url;
//       a.click();
//       window.URL.revokeObjectURL(url);
//     }
//   };

//   const numRows = typeData.length + 4;
// const rowHeight = 40; // Assuming each row has a height of 40px
// const maxHeight = `${numRows * rowHeight}px`;
// const rows = [];
// const standardTrackKeys = [];

// var total = 0;
// for (const key in result) {
//   total = total + result[key];
// }
// for (const key in result) {
//   let percentage = ((result[key] * 100) / total).toFixed(2);
//   if (key.startsWith("Standard")) {
//     standardTrackKeys.push(key);
//   } else {
//     rows.push(
//       <Tr key={key}>
//         <Td
//           style={{
//             wordWrap: 'break-word',  // Allow word wrapping
//             overflowWrap: 'break-word', // For better wrapping behavior across browsers
//             whiteSpace: 'normal', // Enable text wrapping
//             minWidth: '120px', // Ensures it wraps correctly
//           }}
//           className="break-all"  // Force word break for long strings
//         >
//           <Wrap>
//             <WrapItem>
//               <Badge colorScheme="pink">{key}</Badge>
//             </WrapItem>
//           </Wrap>
//         </Td>
//         <Td
//           style={{
//             wordWrap: 'break-word',
//             overflowWrap: 'break-word',
//             minWidth: '100px',
//           }}
//           className={"ml-20 text-blue-400"}
//         >
//           {result[key]}
//         </Td>
//         <Td
//           style={{
//             wordWrap: 'break-word',
//             overflowWrap: 'break-word',
//             minWidth: '150px',
//           }}
//           className={"ml-10 text-blue-400"}
//         >
//           {percentage}%
//         </Td>
//       </Tr>
//     );
//   }
// }

// standardTrackKeys.sort();

// for (const key of standardTrackKeys) {
//   let percentage = ((result[key] * 100) / total).toFixed(2);
//   rows.unshift(
//     <Tr key={key}>
//       <Td
//         style={{
//           wordWrap: 'break-word',  // Allow word wrapping
//           overflowWrap: 'break-word', // For better wrapping behavior across browsers
//           whiteSpace: 'normal', // Enable text wrapping
//           minWidth: '120px', // Ensures it wraps correctly
//         }}
//         className="break-all"
//       >
//         <Wrap>
//           <WrapItem>
//             <Badge colorScheme="blue">{key}</Badge>
//           </WrapItem>
//         </Wrap>
//       </Td>
//       <Td
//         style={{
//           wordWrap: 'break-word',
//           overflowWrap: 'break-word',
//           minWidth: '100px',
//         }}
//         className={"ml-20 text-blue-400"}
//       >
//         {result[key]}
//       </Td>
//       <Td
//         style={{
//           wordWrap: 'break-word',
//           overflowWrap: 'break-word',
//           minWidth: '150px',
//         }}
//         className={"ml-10 text-blue-400"}
//       >
//         {percentage}%
//       </Td>
//     </Tr>
//   );
// }



//   const currentYear = new Date().getFullYear();
//   const years = Array.from(
//     new Array(currentYear - 2014),
//     (val, index) => index + 2015
//   ).reverse();
//   const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
//     setSelectedYear(parseInt(event.target.value));
//   };

//   const bg = useColorModeValue("#f6f6f7", "gray.700");

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
//         <Box
//           bgColor={bg}
//           // marginTop={"2rem"}
//           p="1rem 1rem"
//           borderRadius="0.55rem"
//           overflowX="auto"
//           _hover={{
//             border: "1px",
//             borderColor: "#30A0E0",
//           }}
//           maxH={maxHeight}
//           as={motion.div}
//           minHeight="600px"
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5 } as any}
//           className="ease-in duration-200"
//         >
//           <Box className={"flex w-full gap-10"}>
//             <Select
//               variant="outline"
//               placeholder="Select Option"
//               value={selectedYear}
//               onChange={handleYearChange}
//               className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
//               size="md"
//             >
//               {years.map((item) => (
//                 <option value={`${item}`} key={item}>
//                   {item}
//                 </option>
//               ))}
//             </Select>

//             <Box>
//               <Button
//                 colorScheme="blue"
//                 variant="outline"
//                 fontSize={"14px"}
//                 fontWeight={"bold"}
//                 padding={"8px 20px"}
//                 onClick={async () => {
//                   try {
//                     // Trigger the CSV conversion and download
//                     convertAndDownloadCSV();

//                     // Trigger the API call
//                     await axios.post("/api/DownloadCounter");
//                   } catch (error) {
//                     console.error("Error triggering download counter:", error);
//                   }
//                 }}
//               >
//                 <DownloadIcon marginEnd={"1.5"} />
//                 Download Reports
//               </Button>
//             </Box>
//           </Box>

//           <TableContainer>
//   <Table variant="simple" minW="50%" maxW="100%" layout="auto">
//     <Thead>
//       <Tr>
//         <Th
//           style={{
//             wordWrap: 'break-word',
//             minWidth: '120px',
//             paddingLeft: '10px', // Adding padding for spacing
//             paddingRight: '10px', // Adding padding for spacing
//           }}
//         >
//           Type - Category
//         </Th>
//         <Th
//           style={{
//             wordWrap: 'break-word',
//             minWidth: '100px',
//             paddingLeft: '10px', // Padding to ensure separation
//             paddingRight: '10px', // Padding to ensure separation
//           }}
//         >
//           Numbers
//         </Th>
//         <Th
//           style={{
//             wordWrap: 'break-word',
//             minWidth: '150px',
//             paddingLeft: '10px', // Padding to ensure separation
//             paddingRight: '10px', // Padding to ensure separation
//           }}
//         >
//           Percentage
//         </Th>
//       </Tr>
//     </Thead>
//     <Tbody>
//       {rows}
//     </Tbody>
//   </Table>
// </TableContainer>


//           <Box className="flex justify-center w-full text-center">
//             <Text
//               fontSize="xl"
//               fontWeight="bold"
//               color="#30A0E0"
//               marginRight="6"
//               style={{ wordWrap: 'break-word' }}
//             >
//               Total: {total}
//             </Text>
//           </Box>

//           <Box className={"w-full"}>
//             <DateTime />
//           </Box>
//         </Box>
//       )}
//     </>
//   );
// };

// export default CBoxStatus;

import React, { useState, useEffect } from "react";
import {
  Badge,
  Box,
  Link,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  Wrap,
  WrapItem,
  useColorModeValue,
  Select,
  Button,
  Stack,
  Spinner,
  useToast
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import DateTime from "@/components/DateTime";
import { DownloadIcon } from "@chakra-ui/icons";
import axios from "axios";


interface EIP {
  _id: string;
  eip: string;
  fromStatus: string;
  toStatus: string;
  title: string;
  status: string;
  author: string;
  created: string;
  changeDate: string;
  type: string;
  category: string;
  discussion: string;
  deadline: string;
  requires: string;
  pr: number;
  changedDay: number;
  changedMonth: number;
  changedYear: number;
  createdMonth: number;
  createdYear: number;
  __v: number;
}

interface EIPGroup {
  category: string;
  month: number;
  year: number;
  date: string;
  count: number;
  eips: EIP[];
}

interface APIResponse {
  status: string;
  eips: EIPGroup[];
}

interface Data {
  eip: APIResponse[];
  erc: APIResponse[];
  rip: APIResponse[];
}

interface CBoxProps {
  dataset: Data;
  status: string;
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

const CBoxStatus: React.FC<CBoxProps> = ({ dataset, status, type }) => {
  const [data, setData] = useState<Data>();
  const [selectedYear, setSelectedYear] = useState<number>(2025);
  const [isLoading, setIsLoading] = useState(true);
  const [typeData, setTypeData] = useState<APIResponse[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const jsonData = dataset;
        setData(jsonData);
        if (type === "EIPs" && jsonData.eip) {
          setTypeData(
            jsonData.eip.filter(
              (item: any) =>
                item.category !== getCat("ERC") && item.category !== "ERCs"
            )
          );
        } else if (type === "ERCs" && jsonData.erc) {
          setTypeData(jsonData.erc);
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [dataset, type]);

  useEffect(() => {
    if (type === "EIPs") {
      setTypeData(data?.eip || []);
    } else if (type === "ERCs") {
      setTypeData(data?.erc || []);
    }
  }, [data, type]);
  
  const statusData = typeData.filter(
    (item) => item.status === getStatus(status)
  );

  const yearData = statusData
    .flatMap((item) => item.eips)
    .filter((item) => item.year === selectedYear);

  const result: { [key: string]: number } = {};

  yearData
    .filter((item) => item.category !== "ERC")
    .forEach((item) => {
      item.eips.forEach((item) => {
        if (
          (item.type === "Standards Track" ||
            item.type === "Standard Track" ||
            item.type === "Standard" ||
            item.type === "Core" ||
            item.type === "Process" ||
            item.type ===
            "Standards Track (Core, Networking, Interface, ERC)") &&
          item.status === getStatus(status)
        ) {
          if (item.category === "Core") {
            result["Standard - Core"] = (result["Standard - Core"] || 0) + 1;
          } else if (item.category === "Networking") {
            result["Standard - Networking"] =
              (result["Standard - Networking"] || 0) + 1;
          } else if (item.category === "Interface") {
            result["Standard - Interface"] =
              (result["Standard - Interface"] || 0) + 1;
          } else {
            result["Standard - Core"] = (result["Standard - Core"] || 0) + 1;
          }
        } else if (item.type === "Meta" && item.status === getStatus(status)) {
          result["Meta"] = (result["Meta"] || 0) + 1;
        } else if (
          item.type === "Informational" &&
          item.status === getStatus(status)
        ) {
          result["Informational"] = (result["Informational"] || 0) + 1;
        }
      });
    });

  const convertAndDownloadCSV = () => {
    if (yearData && yearData.length > 0) {
      const columnsToDrop = [
        "_id",
        "fromStatus",
        "toStatus",
        "requires",
        "changedDay",
        "changedMonth",
        "changedYear",
        "createdMonth",
        "deadline",
        "createdYear",
        "__v",
      ];

      const headers =
        Object.keys(yearData[0].eips[0])
          .filter((column) => !columnsToDrop.includes(column))
          .join(",") + "\n";

      const csvRows = yearData.map((item) => {
        const values = item.eips.map((eip) => {
          const filteredValues = Object.entries(eip)
            .filter(([key]) => !columnsToDrop.includes(key))
            .map(([_, value]) => {
              if (typeof value === "string" && value.includes(",")) {
                return `"${value}"`;
              }
              return value;
            });
          return filteredValues.join(",");
        });
        return values.join("\n");
      });

      const csvContent = headers + csvRows.join("\n");

      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";

      a.download = `${status}_${selectedYear}.csv`;

      document.body.appendChild(a);
      a.href = url;
      a.click();
      window.URL.revokeObjectURL(url);
    }
  };

  const total = Object.values(result).reduce((a, b) => a + b, 0);

  const standardTrackKeys: string[] = [];
  const otherKeys: string[] = [];

  for (const key in result) {
    if (key.startsWith("Standard")) {
      standardTrackKeys.push(key);
    } else {
      otherKeys.push(key);
    }
  }

  standardTrackKeys.sort();

  const rows = [
    ...standardTrackKeys,
    ...otherKeys,
  ].map((key) => {
    const percentage = total ? ((result[key] * 100) / total).toFixed(2) : "0.00";
    return (
      <Tr key={key}>
        <Td
          whiteSpace="normal"
          minW={{ base: "120px", md: "150px" }}
          wordBreak="break-word"
        >
          <Wrap>
            <WrapItem>
              <Badge colorScheme={key.startsWith("Standard") ? "blue" : "pink"}>
                {key}
              </Badge>
            </WrapItem>
          </Wrap>
        </Td>
        <Td
          color="blue.400"
          minW={{ base: "80px", md: "100px" }}
          textAlign="center"
          fontWeight="semibold"
        >
          {result[key]}
        </Td>
        <Td
          color="blue.400"
          minW={{ base: "100px", md: "150px" }}
          textAlign="center"
          fontWeight="semibold"
        >
          {percentage}%
        </Td>
      </Tr>
    );
  });

  const currentYear = new Date().getFullYear();
  const years = Array.from(
    new Array(currentYear - 2014),
    (val, index) => index + 2015
  ).reverse();

  const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear(parseInt(event.target.value));
  };

  const bg = useColorModeValue("gray.50", "gray.800");

  return (
    <>
      {isLoading ? (
        < Stack align="center" justify="center" minH="100px" py={10}>
          <Spinner size="lg" />
          <Text fontSize="lg" fontWeight="medium" mt={2}>
            Loading data...
          </Text>
        </Stack>
      ) : (
        <Box
          bg={bg}
          px={{ base: 4, md: 8 }}
          py={{ base: 6, md: 8 }}
          borderRadius="lg"
          boxShadow="lg"
          w="100%"
          overflowX="auto"
        >
          <Stack
            direction={{ base: "column", md: "row" }}
            justify="space-between"
            align="center"
            mb={6}
            spacing={{ base: 4, md: 6 }}
            flexWrap="wrap"
          >
            <Text
              fontSize={{ base: "xl", md: "2xl" }}
              fontWeight="bold"
              whiteSpace="nowrap"
            >
              {type} Status:{" "}
              <Badge
                fontSize="1em"
                colorScheme={
                  status === "Final"
                    ? "green"
                    : status === "Draft"
                      ? "yellow"
                      : status === "Withdrawn"
                        ? "red"
                        : "blue"
                }
                ml={2}
                px={3}
                py={1}
                borderRadius="md"
              >
                {status}
              </Badge>
            </Text>

            <Stack
              direction={{ base: "column", sm: "row" }}
              spacing={4}
              align="center"
            >
              <Select
                size="md"
                value={selectedYear}
                onChange={handleYearChange}
                maxW="150px"
                aria-label="Select Year"
                variant="outline"
              >
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </Select>

              <Button
                size="lg"
                colorScheme="blue"
                onClick={convertAndDownloadCSV}
                aria-label="Download CSV"
                fontSize="2xs"
              >
                Download CSV
              </Button>
            </Stack>
          </Stack>

          <TableContainer>
            <Table
              size="md"
              variant="striped"
              colorScheme="blue"
              whiteSpace="normal"
            >
              <Thead>
                <Tr>
                  <Th fontSize="md">Category</Th>
                  <Th fontSize="md" isNumeric>
                    Count
                  </Th>
                  <Th fontSize="md" isNumeric>
                    %
                  </Th>
                </Tr>
              </Thead>
              <Tbody>{rows}</Tbody>
            </Table>
          </TableContainer>
        </Box>

      )}
    </>
  );
};

export default CBoxStatus;