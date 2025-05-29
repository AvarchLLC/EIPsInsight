// // // // // import {
// // // // //   Box,
// // // // //   Text,
// // // // //   useColorModeValue,
// // // // //   Wrap,
// // // // //   WrapItem,
// // // // //   Badge,
// // // // //   Link,

// // // // // } from "@chakra-ui/react";
// // // // // import React, { useEffect, useState, useMemo } from "react";
// // // // // import { motion } from "framer-motion";
// // // // // import { DownloadIcon } from "@chakra-ui/icons";
// // // // // import { CCardBody, CSmartTable } from "@coreui/react-pro";

// // // // // interface EIP {
// // // // //   _id: string;
// // // // //   eip: string;
// // // // //   title: string;
// // // // //   author: string;
// // // // //   status: string;
// // // // //   type: string;
// // // // //   category: string;
// // // // //   created: string;
// // // // //   discussion: string;
// // // // //   deadline: string;
// // // // //   requires: string;
// // // // //   repo:string;
// // // // //   unique_ID: number;
// // // // //   __v: number;
// // // // // }

// // // // // interface AreaCProps {
// // // // //   dataset: EIP[];
// // // // //   status:string;
// // // // //   cat:string;
// // // // // }

// // // // // import "@coreui/coreui/dist/css/coreui.min.css";
// // // // // interface TabProps {
// // // // //   cat: string;
// // // // // }

// // // // // interface TableProps {
// // // // //   cat: string;
// // // // //   // repo:string;
// // // // //   status: string;
// // // // // }

// // // // // const CatTable: React.FC<AreaCProps> =  ({ cat, dataset, status }) => {
// // // // //   const [data, setData] = useState<EIP[]>([]);
// // // // //   const [isLoading, setIsLoading] = useState(true);
// // // // //   const [isDarkMode, setIsDarkMode] = useState(false);
// // // // //   useEffect(() => {
// // // // //     setInterval(() => {
// // // // //       setIsLoading(false);
// // // // //     }, 2000);
// // // // //   });

// // // // //   console.log(dataset);
// // // // //   console.log(status);
// // // // //   console.log(cat);

// // // // //   const factorAuthor = (data: any) => {
// // // // //     let list = data.split(",");
// // // // //     for (let i = 0; i < list.length; i++) {
// // // // //       list[i] = list[i].split(" ");
// // // // //     }
// // // // //     if (list[list.length - 1][list[list.length - 1].length - 1] === "al.") {
// // // // //       list.pop();
// // // // //     }
// // // // //     return list;
// // // // //   };

// // // // //   useEffect(() => {
// // // // //     const fetchData = async () => {
// // // // //       try {
// // // // //         // const response = await fetch(`/api/new/all`);
// // // // //         // const jsonData = await response.json();
// // // // //         setData(dataset);
// // // // //         console.log("dataset:",dataset)
// // // // //         setIsLoading(false); // Set isLoading to false after data is fetched
// // // // //       } catch (error) {
// // // // //         console.error("Error fetching data:", error);
// // // // //         setIsLoading(false); // Set isLoading to false if there's an error
// // // // //       }
// // // // //     };
// // // // //     fetchData();
// // // // //   }, []);

// // // // //   useEffect(() => {
// // // // //     if (bg === "#f6f6f7") {
// // // // //       setIsDarkMode(false);
// // // // //     } else {
// // // // //       setIsDarkMode(true);
// // // // //     }
// // // // //   });

// // // // //   const filteredData = dataset
// // // // //     .filter((item) => (cat === "All" || item.category === cat) && item.status === status)
// // // // //     .map((item) => {
// // // // //       const { eip, title, author, repo, type, category, status, deadline } = item;
// // // // //       return {
// // // // //         eip,
// // // // //         title,
// // // // //         author,
// // // // //         repo,
// // // // //         type,
// // // // //         category,
// // // // //         status,
// // // // //         deadline,
// // // // //       };
// // // // //     });

// // // // //     console.log(" test filtered data:",filteredData);

// // // // //   const bg = useColorModeValue("#f6f6f7", "#171923");

// // // // //   return (
// // // // //     <>
// // // // //       {filteredData.length > 0 ? (
// // // // //         <Box
// // // // //           bgColor={bg}
// // // // //           marginTop={"2"}
// // // // //           p="1rem 1rem"
// // // // //           borderRadius="0.55rem"
// // // // //           _hover={{
// // // // //             border: "1px",
// // // // //             borderColor: "#30A0E0",
// // // // //           }}
// // // // //           as={motion.div}
// // // // //           initial={{ opacity: 0, y: -20 }}
// // // // //           animate={{ opacity: 1, y: 0 }}
// // // // //           transition={{ duration: 0.5 } as any}
// // // // //           className=" ease-in duration-200 z-0"
// // // // //         >
// // // // //           <CCardBody>
// // // // //             <>
// // // // //               <h2 className="text-blue-400 font-semibold text-4xl">
// // // // //                 {" "}
// // // // //                 {status}
// // // // //               </h2>
// // // // //               <CSmartTable
// // // // //                 items={filteredData.sort(
// // // // //                   (a, b) => parseInt(a["eip"]) - parseInt(b["eip"])
// // // // //                 )}
// // // // //                 activePage={1}
// // // // //                 clickableRows
// // // // //                 columnFilter
// // // // //                 columnSorter
// // // // //                 itemsPerPage={5}
// // // // //                 pagination
// // // // //                 paginationProps={{
// // // // //                   pages: Math.ceil(filteredData.length / 5), // Calculate the number of pages based on the items and items per page
// // // // //                   style: {
// // // // //                     display: 'flex',
// // // // //                     flexWrap: 'wrap', // Allow pagination to wrap in smaller screens
// // // // //                     justifyContent: 'center',
// // // // //                     gap: '8px', // Space between pagination items
// // // // //                     padding: '10px',
// // // // //                   },
// // // // //                 }}
// // // // //                 tableProps={{
// // // // //                   hover: true,
// // // // //                   responsive: true,
// // // // //                   style: {
// // // // //                     borderRadius: "0.55rem", // Add rounded corners
// // // // //                     overflow: "hidden",      // Ensure the border-radius is applied cleanly
// // // // //                   },
// // // // //                 }}
// // // // //                 columns={[
// // // // //                   {
// // // // //                     key: 'repo',
// // // // //                     label: 'Repo',
// // // // //                     _style: {
// // // // //                       backgroundColor: isDarkMode ? '#2D3748' : '#F7FAFC',
// // // // //                       color: isDarkMode ? 'white' : 'black',
// // // // //                       fontWeight: 'bold',
// // // // //                     }
// // // // //                   },
// // // // //                   {
// // // // //                     key: 'eip',
// // // // //                     label: 'EIP',
// // // // //                     _style: {
// // // // //                       backgroundColor: isDarkMode ? '#2D3748' : '#F7FAFC',
// // // // //                       color: isDarkMode ? 'white' : 'black',
// // // // //                       fontWeight: 'bold',
// // // // //                     }
// // // // //                   },
// // // // //                   {
// // // // //                     key: 'title',
// // // // //                     label: 'Title',
// // // // //                     _style: {
// // // // //                       backgroundColor: isDarkMode ? '#2D3748' : '#F7FAFC',
// // // // //                       color: isDarkMode ? 'white' : 'black',
// // // // //                       fontWeight: 'bold',
// // // // //                     }
// // // // //                   },
// // // // //                   {
// // // // //                     key: 'author',
// // // // //                     label: 'Author',
// // // // //                     _style: {
// // // // //                       backgroundColor: isDarkMode ? '#2D3748' : '#F7FAFC',
// // // // //                       color: isDarkMode ? 'white' : 'black',
// // // // //                       fontWeight: 'bold',
// // // // //                     }
// // // // //                   },
// // // // //                   {
// // // // //                     key: 'type',
// // // // //                     label: 'Type',
// // // // //                     _style: {
// // // // //                       backgroundColor: isDarkMode ? '#2D3748' : '#F7FAFC',
// // // // //                       color: isDarkMode ? 'white' : 'black',
// // // // //                       fontWeight: 'bold',
// // // // //                     }
// // // // //                   },
// // // // //                   {
// // // // //                     key: 'category',
// // // // //                     label: 'category',
// // // // //                     _style: {
// // // // //                       backgroundColor: isDarkMode ? '#2D3748' : '#F7FAFC',
// // // // //                       color: isDarkMode ? 'white' : 'black',
// // // // //                       fontWeight: 'bold',
// // // // //                     }
// // // // //                   },
// // // // //                   {
// // // // //                     key: 'status',
// // // // //                     label: 'status',
// // // // //                     _style: {
// // // // //                       backgroundColor: isDarkMode ? '#2D3748' : '#F7FAFC',
// // // // //                       color: isDarkMode ? 'white' : 'black',
// // // // //                       fontWeight: 'bold',
// // // // //                     }
// // // // //                   },
// // // // //                   ...(status === "Last Call" ? [ // Conditionally add the deadline column
// // // // //                     {
// // // // //                       key: 'deadline',
// // // // //                       label: 'Deadline',
// // // // //                       _style: {
// // // // //                         backgroundColor: isDarkMode ? '#2D3748' : '#F7FAFC',
// // // // //                         color: isDarkMode ? 'white' : 'black',
// // // // //                         fontWeight: 'bold',
// // // // //                         padding: '12px',
// // // // //                         borderTopRightRadius: "0.55rem", // Add border radius to the last column
// // // // //                       }
// // // // //                     }
// // // // //                   ] : [])
// // // // //                   ]}
// // // // //                 scopedColumns={{
// // // // //                   repo: (item: any) => (
// // // // //                     <td key={item.repo} style={{ backgroundColor: isDarkMode ? '#2D3748' : '#F7FAFC' }}>
// // // // //                       <Link href={`/${cat === "ERC" || item.repo==='erc' ? "ercs/erc" : item.repo==='rip'? "rips/rip" : "eips/eip"}-${item.eip}`}>
// // // // //                         <Wrap>
// // // // //                           <WrapItem>
// // // // //                             <Badge colorScheme={getStatusColor(item.status)}>
// // // // //                               {item.repo}
// // // // //                             </Badge>
// // // // //                           </WrapItem>
// // // // //                         </Wrap>
// // // // //                       </Link>
// // // // //                     </td>
// // // // //                   ),
// // // // //                   eip: (item: any) => (
// // // // //                     <td key={item.eip} style={{ backgroundColor: isDarkMode ? '#2D3748' : '#F7FAFC' }}>
// // // // //                       <Link href={`/${cat === "ERC" || item.repo==='erc' ? "ercs/erc" : item.repo==='rip' ? "rips/rip" : "eips/eip"}-${item.eip}`}>
// // // // //                         <Wrap>
// // // // //                           <WrapItem>
// // // // //                             <Badge colorScheme={getStatusColor(item.status)}>
// // // // //                               {item.eip}
// // // // //                             </Badge>
// // // // //                           </WrapItem>
// // // // //                         </Wrap>
// // // // //                       </Link>
// // // // //                     </td>
// // // // //                   ),
// // // // //                   title: (item: any) => (
// // // // //                     <td
// // // // //                       key={item.eip}
// // // // //                       style={{ fontWeight: "bold", height: "100%",  backgroundColor: isDarkMode ? '#2D3748' : '#F7FAFC' }}
// // // // //                       className="hover:text-[#1c7ed6]"
// // // // //                     >
// // // // //                       <Link
// // // // //                         href={`/${cat === "ERC" || item.repo==='erc' ? "ercs/erc" : item.repo==='rip' ? "rips/rip" : "eips/eip"}-${item.eip}`}
// // // // //                         className={
// // // // //                           isDarkMode
// // // // //                             ? "hover:text-[#1c7ed6] text-[13px] text-white"
// // // // //                             : "hover:text-[#1c7ed6] text-[13px] text-black"
// // // // //                         }
// // // // //                       >
// // // // //                         {item.title}
// // // // //                       </Link>
// // // // //                     </td>
// // // // //                   ),
// // // // //                   author: (it: any) => (
// // // // //                     <td key={it.author} style={{ backgroundColor: isDarkMode ? '#2D3748' : '#F7FAFC' }}>
// // // // //                       <div>
// // // // //                         {factorAuthor(it.author).map(
// // // // //                           (item: any, index: any) => {
// // // // //                             let t = item[item.length - 1].substring(
// // // // //                               1,
// // // // //                               item[item.length - 1].length - 1
// // // // //                             );
// // // // //                             return (
// // // // //                               <Wrap key={index}>
// // // // //                                 <WrapItem>
// // // // //                                   <Link
// // // // //                                     href={`${
// // // // //                                       item[item.length - 1].substring(
// // // // //                                         item[item.length - 1].length - 1
// // // // //                                       ) === ">"
// // // // //                                         ? "mailto:" + t
// // // // //                                         : "https://github.com/" + t.substring(1)
// // // // //                                     }`}
// // // // //                                     target="_blank"
// // // // //                                     className={
// // // // //                                       isDarkMode
// // // // //                                         ? "hover:text-[#1c7ed6] text-[13px] text-white"
// // // // //                                         : "hover:text-[#1c7ed6] text-[13px] text-black"
// // // // //                                     }
// // // // //                                   >
// // // // //                                     {item}
// // // // //                                   </Link>
// // // // //                                 </WrapItem>
// // // // //                               </Wrap>
// // // // //                             );
// // // // //                           }
// // // // //                         )}
// // // // //                       </div>
// // // // //                     </td>
// // // // //                   ),
// // // // //                   type: (item: any) => (
// // // // //                     <td
// // // // //                       key={item.eip}
// // // // //                       className={isDarkMode ? "text-white" : "text-black"}
// // // // //                       style={{ backgroundColor: isDarkMode ? '#2D3748' : '#F7FAFC' }}
// // // // //                     >
// // // // //                       {item.type}
// // // // //                     </td>
// // // // //                   ),
// // // // //                   category: (item: any) => (
// // // // //                     <td
// // // // //                       key={item.eip}
// // // // //                       className={isDarkMode ? "text-white" : "text-black"}
// // // // //                       style={{ backgroundColor: isDarkMode ? '#2D3748' : '#F7FAFC' }}
// // // // //                     >
// // // // //                       {item.category}
// // // // //                     </td>
// // // // //                   ),
// // // // //                   status: (item: any) => (
// // // // //                     <td key={item.eip} style={{ backgroundColor: isDarkMode ? '#2D3748' : '#F7FAFC' }}>
// // // // //                       <Wrap>
// // // // //                         <WrapItem>
// // // // //                           <Badge colorScheme={getStatusColor(item.status)}>
// // // // //                             {item.status}
// // // // //                           </Badge>
// // // // //                         </WrapItem>
// // // // //                       </Wrap>
// // // // //                     </td>
// // // // //                   ),
// // // // //                   ...(status === "Last Call" ? { // Conditionally add the deadline column renderer
// // // // //                     deadline: (item: any) => (
// // // // //                       <td key={item.eip} style={{ backgroundColor: isDarkMode ? '#2D3748' : '#F7FAFC' }}>
// // // // //                         <div className={isDarkMode ? "text-white" : "text-black"}>
// // // // //                           {item.deadline || "N/A"}
// // // // //                         </div>
// // // // //                       </td>
// // // // //                     )
// // // // //                   } : {})
// // // // //                 }}

// // // // //               />
// // // // //             </>
// // // // //           </CCardBody>
// // // // //         </Box>
// // // // //       ) : (
// // // // //         <></>
// // // // //       )}
// // // // //     </>
// // // // //   );
// // // // // };

// // // // // const getStatusColor = (status: string) => {
// // // // //   switch (status) {
// // // // //     case "Living":
// // // // //       return "blue";
// // // // //     case "Final":
// // // // //       return "blue";
// // // // //     case "Stagnant":
// // // // //       return "purple";
// // // // //     case "Draft":
// // // // //       return "orange";
// // // // //     case "Withdrawn":
// // // // //       return "red";
// // // // //     case "Last Call":
// // // // //       return "yellow";
// // // // //     default:
// // // // //       return "gray";
// // // // //   }
// // // // // };

// // // // // export default CatTable;


// // // // import {
// // // //   Box,
// // // //   Text,
// // // //   useColorModeValue,
// // // //   Badge,
// // // //   Link,
// // // //   VStack,
// // // //   HStack,
// // // //   SimpleGrid,
// // // //   Wrap,
// // // //   WrapItem,
// // // //   Divider,
// // // //   Icon,
// // // // } from "@chakra-ui/react";
// // // // import React, { useEffect, useState } from "react";
// // // // import { motion } from "framer-motion";
// // // // import { FaRegClock } from "react-icons/fa";

// // // // interface EIP {
// // // //   _id: string;
// // // //   eip: string;
// // // //   title: string;
// // // //   author: string;
// // // //   status: string;
// // // //   type: string;
// // // //   category: string;
// // // //   created: string;
// // // //   discussion: string;
// // // //   deadline: string;
// // // //   requires: string;
// // // //   repo: string;
// // // //   unique_ID: number;
// // // //   __v: number;
// // // // }

// // // // interface AreaCProps {
// // // //   dataset: EIP[];
// // // //   status: string;
// // // //   cat: string;
// // // // }

// // // // const CatTable: React.FC<AreaCProps> = ({ cat, dataset, status }) => {
// // // //   const [isDarkMode, setIsDarkMode] = useState(false);
// // // //   const MotionBox = motion(Box);

// // // //   const bg = useColorModeValue("#f6f6f7", "#171923");

// // // //   useEffect(() => {
// // // //     if (bg === "#f6f6f7") setIsDarkMode(false);
// // // //     else setIsDarkMode(true);
// // // //   }, [bg]);

// // // //   const filteredData = dataset
// // // //     .filter((item) => (cat === "All" || item.category === cat) && item.status === status)
// // // //     .map(({ eip, title, author, repo, type, category, status, deadline, created }) => ({
// // // //       eip,
// // // //       title,
// // // //       author,
// // // //       repo,
// // // //       type,
// // // //       category,
// // // //       status,
// // // //       deadline,
// // // //       created,
// // // //     }));

// // // //   const factorAuthor = (data: string): string[][] => {
// // // //     const list: string[][] = data.split(",").map((author) => author.trim().split(" "));
// // // //     if (list[list.length - 1][list[list.length - 1].length - 1] === "al.") {
// // // //       list.pop();
// // // //     }
// // // //     return list;
// // // //   };


// // // //   const getStatusColor = (status: string) => {
// // // //     switch (status) {
// // // //       case "Living":
// // // //       case "Final":
// // // //         return "blue";
// // // //       case "Stagnant":
// // // //         return "purple";
// // // //       case "Draft":
// // // //         return "orange";
// // // //       case "Withdrawn":
// // // //         return "red";
// // // //       case "Last Call":
// // // //         return "yellow";
// // // //       default:
// // // //         return "gray";
// // // //     }
// // // //   };

// // // //   return (
// // // //     <>
// // // //       {filteredData.length > 0 && (
// // // //         <MotionBox
// // // //           bgColor={bg}
// // // //           p={4}
// // // //           mt={4}
// // // //           borderRadius="md"
// // // //           initial={{ opacity: 0, y: -20 }}
// // // //           animate={{ opacity: 1, y: 0 }}
// // // //           transition={{ duration: 0.5 }}
// // // //         >

// // // //           <Text fontSize="2xl" fontWeight="bold" color="blue.400" mb={4}>
// // // //             {status}
// // // //           </Text>

// // // //           <VStack spacing={4} align="stretch">
// // // //             {filteredData
// // // //               .sort((a, b) => parseInt(a.eip) - parseInt(b.eip))
// // // //               .map((item, idx) => (
// // // //                 <Box
// // // //                   key={idx}
// // // //                   p={4}
// // // //                   bg={useColorModeValue("white", "gray.800")}
// // // //                   borderRadius="md"
// // // //                   boxShadow="sm"
// // // //                   _hover={{ boxShadow: "md" }}
// // // //                 >
// // // //                   <HStack justify="space-between" wrap="wrap">
// // // //                     <HStack spacing={2} wrap="wrap">
// // // //                       <Badge colorScheme={getStatusColor(item.status)}>{item.repo}</Badge>
// // // //                       <Badge colorScheme={getStatusColor(item.status)}>EIP-{item.eip}</Badge>
// // // //                       <Badge>{item.type}</Badge>
// // // //                       <Badge>{item.category}</Badge>
// // // //                     </HStack>

// // // //                     <HStack spacing={2} align="center">
// // // //                       <Icon as={FaRegClock} />
// // // //                       <Text fontSize="sm">{item.created || "Unknown"}</Text>
// // // //                     </HStack>
// // // //                   </HStack>

// // // //                   <Box mt={2}>
// // // //                     <Link
// // // //                       href={`/${cat === "ERC" || item.repo === "erc" ? "ercs/erc" : item.repo === "rip" ? "rips/rip" : "eips/eip"}-${item.eip}`}
// // // //                       fontWeight="semibold"
// // // //                       fontSize="md"
// // // //                       _hover={{ color: "blue.500" }}
// // // //                     >
// // // //                       {item.title}
// // // //                     </Link>
// // // //                   </Box>

// // // //                   <Box mt={2}>
// // // //                     <Text fontSize="sm" fontWeight="bold" mb={1}>
// // // //                       Authors:
// // // //                     </Text>
// // // //                     {factorAuthor(item.author).map((a, i) => {
// // // //                       const t = a[a.length - 1]?.substring(1, a[a.length - 1].length - 1);
// // // //                       return (
// // // //                         <Wrap key={i}>
// // // //                           <WrapItem>
// // // //                             <Link
// // // //                               href={
// // // //                                 a[a.length - 1].endsWith(">")
// // // //                                   ? `mailto:${t}`
// // // //                                   : `https://github.com/${t?.substring(1)}`
// // // //                               }
// // // //                               target="_blank"
// // // //                               fontSize="sm"
// // // //                               _hover={{ color: "blue.400" }}
// // // //                             >
// // // //                               {a.join(" ")}
// // // //                             </Link>
// // // //                           </WrapItem>
// // // //                         </Wrap>
// // // //                       );
// // // //                     })}
// // // //                   </Box>

// // // //                   {status === "Last Call" && (
// // // //                     <Box mt={2}>
// // // //                       <Text fontSize="sm" fontWeight="bold">
// // // //                         Deadline:{" "}
// // // //                         <Text as="span" fontWeight="normal">
// // // //                           {item.deadline || "N/A"}
// // // //                         </Text>
// // // //                       </Text>
// // // //                     </Box>
// // // //                   )}
// // // //                 </Box>
// // // //               ))}
// // // //           </VStack>
// // // //         </MotionBox>
// // // //       )}
// // // //     </>
// // // //   );
// // // // };

// // // // export default CatTable;

// // // import {
// // //   Box,
// // //   Text,
// // //   useColorModeValue,
// // //   Badge,
// // //   Link,
// // //   VStack,
// // //   HStack,
// // //   Wrap,
// // //   WrapItem,
// // //   Icon,
// // //   Button,
// // //   SimpleGrid,
// // // } from "@chakra-ui/react";
// // // import React, { useEffect, useState } from "react";
// // // import { motion } from "framer-motion";
// // // import { FaRegClock } from "react-icons/fa";

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
// // //   repo: string;
// // //   unique_ID: number;
// // //   __v: number;
// // // }

// // // interface AreaCProps {
// // //   dataset: EIP[];
// // //   status: string;
// // //   cat: string;
// // // }

// // // const CatTable: React.FC<AreaCProps> = ({ cat, dataset, status }) => {
// // //   const MotionBox = motion(Box);
// // //   const bg = useColorModeValue("#f6f6f7", "#171923");
// // //   const [currentPage, setCurrentPage] = useState(1);
// // //   const itemsPerPage = 5;

// // //   const filteredData = dataset
// // //     .filter((item) => (cat === "All" || item.category === cat) && item.status === status)
// // //     .sort((a, b) => parseInt(a.eip) - parseInt(b.eip));

// // //   const paginatedData = filteredData.slice(
// // //     (currentPage - 1) * itemsPerPage,
// // //     currentPage * itemsPerPage
// // //   );

// // //   const totalPages = Math.ceil(filteredData.length / itemsPerPage);

// // //   const factorAuthor = (data: string): string[][] => {
// // //     const list: string[][] = data.split(",").map((author) => author.trim().split(" "));
// // //     if (list[list.length - 1][list[list.length - 1].length - 1] === "al.") {
// // //       list.pop();
// // //     }
// // //     return list;
// // //   };

// // //   const getColorByType = (type: string): string => {
// // //     switch (type) {
// // //       case "ERC":
// // //         return "green";
// // //       case "Meta":
// // //         return "teal";
// // //       case "Core":
// // //         return "purple";
// // //       default:
// // //         return "gray";
// // //     }
// // //   };

// // //   const getColorByCategory = (cat: string): string => {
// // //     switch (cat) {
// // //       case "Networking":
// // //         return "orange";
// // //       case "Interface":
// // //         return "cyan";
// // //       case "Wallet":
// // //         return "pink";
// // //       default:
// // //         return "gray";
// // //     }
// // //   };

// // //   return (
// // //     <>
// // //       {filteredData.length > 0 && (
// // //         <MotionBox
// // //           bgColor={bg}
// // //           p={6}
// // //           borderRadius="2xl"
// // //           boxShadow="lg"
// // //           initial={{ opacity: 0, y: 10 }}
// // //           animate={{ opacity: 1, y: 0 }}
// // //           transition={{ duration: 0.3 }}
// // //         >

// // //           <Text fontSize="2xl" fontWeight="bold" color="blue.400" mb={4}>
// // //             {status}
// // //           </Text>

// // //           <VStack spacing={4} align="stretch">
// // //             {paginatedData.map((item, idx) => (
// // //               <Box
// // //                 key={idx}
// // //                 p={4}
// // //                 bg={useColorModeValue("white", "gray.800")}
// // //                 borderRadius="md"
// // //                 boxShadow="sm"
// // //                 _hover={{ boxShadow: "md" }}
// // //               >
// // //                 <HStack justify="space-between" wrap="wrap">
// // //                   <HStack spacing={2} wrap="wrap">
// // //                     <Badge colorScheme="blue">#{item.eip}</Badge>
// // //                     <Badge colorScheme={getColorByType(item.type)}>{item.type}</Badge>
// // //                     <Badge colorScheme={getColorByCategory(item.category)}>{item.category}</Badge>
// // //                   </HStack>

// // //                   <HStack spacing={2} align="center">
// // //                     <Icon as={FaRegClock} />
// // //                     <Text fontSize="sm">{item.created?.split("T")[0]}</Text>
// // //                   </HStack>
// // //                 </HStack>

// // //                 <Box mt={2}>
// // //                   <Link
// // //                     href={`/${cat === "ERC" || item.repo === "erc" ? "ercs/erc" : item.repo === "rip" ? "rips/rip" : "eips/eip"}-${item.eip}`}
// // //                     fontWeight="semibold"
// // //                     fontSize="md"
// // //                     _hover={{ color: "blue.500" }}
// // //                   >
// // //                     {item.title}
// // //                   </Link>
// // //                 </Box>

// // //                 <Box mt={2}>
// // //                   <Text fontSize="sm" fontWeight="bold" mb={1}>
// // //                     Authors:
// // //                   </Text>
// // //                   <Wrap spacing="1"> {/* tighter spacing between buttons */}
// // //                     {factorAuthor(item.author).map((a, i) => {
// // //                       const last = a[a.length - 1];
// // //                       const text = a.join(" ");
// // //                       const trimmed = last?.replace(/[<>]/g, "").trim();

// // //                       let href = "#";
// // //                       if (/^[\w.-]+@gmail\.com$/.test(trimmed)) {
// // //                         href = `mailto:${trimmed}`;
// // //                       } else if (/^@?[\w-]+$/.test(trimmed)) {
// // //                         const githubUser = trimmed.replace(/^@/, "");
// // //                         href = `https://github.com/${githubUser}`;
// // //                       }

// // //                       return (
// // //                         <WrapItem key={i}>
// // //                           <Button
// // //                             as={Link}
// // //                             href={href}
// // //                             target="_blank"
// // //                             size="xs" // smaller size
// // //                             fontSize="xs" // optional: smaller text
// // //                             px={2} // tighter horizontal padding
// // //                             py={1} // tighter vertical padding
// // //                             variant="outline"
// // //                             colorScheme="blue"
// // //                           >
// // //                             {text}
// // //                           </Button>
// // //                         </WrapItem>
// // //                       );
// // //                     })}
// // //                   </Wrap>
// // //                 </Box>

// // //                 {status === "Last Call" && (
// // //                   <Box mt={2}>
// // //                     <Text fontSize="sm" fontWeight="bold">
// // //                       Deadline: <Text as="span" fontWeight="normal">{item.deadline || "N/A"}</Text>
// // //                     </Text>
// // //                   </Box>
// // //                 )}
// // //               </Box>
// // //             ))}

// // //             <HStack justify="center" mt={4}>
// // //               <Button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} isDisabled={currentPage === 1}>
// // //                 Prev
// // //               </Button>
// // //               <Text>{currentPage} / {totalPages}</Text>
// // //               <Button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} isDisabled={currentPage === totalPages}>
// // //                 Next
// // //               </Button>
// // //             </HStack>
// // //           </VStack>
// // //         </MotionBox>
// // //       )}
// // //     </>
// // //   );
// // // };

// // // export default CatTable;

// // import {
// //   Box,
// //   Text,
// //   useColorModeValue,
// //   Badge,
// //   Link,
// //   VStack,
// //   HStack,
// //   Wrap,
// //   WrapItem,
// //   Icon,
// //   Button,
// // } from "@chakra-ui/react";
// // import React, { useEffect, useState } from "react";
// // import { motion } from "framer-motion";
// // import { FaRegClock } from "react-icons/fa";

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

// // interface AreaCProps {
// //   dataset: EIP[];
// //   status: string;
// //   cat: string;
// // }

// // const CatTable: React.FC<AreaCProps> = ({ cat, dataset, status }) => {
// //   const MotionBox = motion(Box);
// //   const bg = useColorModeValue("#f6f6f7", "#171923");
// //   const [currentPage, setCurrentPage] = useState(1);
// //   const itemsPerPage = 5;

// //   const filteredData = dataset
// //     .filter((item) => (cat === "All" || item.category === cat) && item.status === status)
// //     .sort((a, b) => parseInt(a.eip) - parseInt(b.eip));

// //   const paginatedData = filteredData.slice(
// //     (currentPage - 1) * itemsPerPage,
// //     currentPage * itemsPerPage
// //   );

// //   const totalPages = Math.ceil(filteredData.length / itemsPerPage);

// //   const factorAuthor = (data: string): string[][] => {
// //     const list: string[][] = data.split(",").map((author) => author.trim().split(" "));
// //     if (list[list.length - 1][list[list.length - 1].length - 1] === "al.") {
// //       list.pop();
// //     }
// //     return list;
// //   };

// //   const getColorByType = (type: string): string => {
// //     switch (type) {
// //       case "ERC":
// //         return "blue";
// //       case "Meta":
// //         return "teal";
// //       case "Core":
// //         return "purple";
// //       default:
// //         return "gray";
// //     }
// //   };

// //   return (
// //     <>
// //       {filteredData.length > 0 && (
// //         <MotionBox
// //           bgColor={bg}
// //           p={6}
// //           borderRadius="2xl"
// //           boxShadow="lg"
// //           initial={{ opacity: 0, y: 10 }}
// //           animate={{ opacity: 1, y: 0 }}
// //           transition={{ duration: 0.3 }}
// //         >
// //           <Text fontSize="2xl" fontWeight="bold" color="blue.400" mb={4}>
// //             {status}
// //           </Text>

// //           <VStack spacing={4} align="stretch">
// //             {paginatedData.map((item, idx) => (
// //               <Box
// //                 key={idx}
// //                 p={4}
// //                 bg={useColorModeValue("white", "gray.800")}
// //                 borderRadius="xl"
// //                 boxShadow="sm"
// //                 _hover={{ boxShadow: "md" }}
// //               >
// //                 <HStack justify="space-between" wrap="wrap">
// //                   <HStack spacing={2} wrap="wrap">
// //                     <Badge colorScheme="blue" px={2} py={1} borderRadius="md">
// //                       eip-{item.eip}
// //                     </Badge>
// //                     <Badge colorScheme={getColorByType(item.type)}>{item.type}</Badge>
// //                     <Badge variant="subtle" colorScheme="gray">{item.category}</Badge>
// //                   </HStack>

// //                   <HStack spacing={2} align="center">
// //                     <Icon as={FaRegClock} fontSize="sm" />
// //                     <Text fontSize="xs" color="gray.500">{item.created?.split("T")[0]}</Text>
// //                   </HStack>
// //                 </HStack>

// //                 <Box mt={1}>
// //                   <Link
// //                     href={`/${cat === "ERC" || item.repo === "erc" ? "ercs/erc" : item.repo === "rip" ? "rips/rip" : "eips/eip"}-${item.eip}`}
// //                     fontWeight="semibold"
// //                     fontSize="md"
// //                     color={useColorModeValue("gray.800", "white")}
// //                     _hover={{ color: "blue.400" }}
// //                   >
// //                     {item.title}
// //                   </Link>
// //                 </Box>

// //                 <HStack mt={2} align="center" wrap="wrap">
// //                   <Text fontSize="xs" fontWeight="bold" color="gray.500" mr={2}>By:</Text>
// //                   <Wrap spacing={1}>
// //                     {factorAuthor(item.author).map((a, i) => {
// //                       const last = a[a.length - 1];
// //                       const text = a.join(" ");
// //                       const trimmed = last?.replace(/[<>]/g, "").trim();

// //                       let href = "#";
// //                       if (/^[\w.-]+@gmail\.com$/.test(trimmed)) {
// //                         href = `mailto:${trimmed}`;
// //                       } else if (/^@?[\w-]+$/.test(trimmed)) {
// //                         const githubUser = trimmed.replace(/^@/, "");
// //                         href = `https://github.com/${githubUser}`;
// //                       }

// //                       return (
// //                         <WrapItem key={i}>
// //                           <Link
// //                             href={href}
// //                             target="_blank"
// //                             fontSize="xs"
// //                             color="blue.400"
// //                             _hover={{ textDecoration: "underline" }}
// //                           >
// //                             {text}
// //                           </Link>
// //                         </WrapItem>
// //                       );
// //                     })}
// //                   </Wrap>
// //                 </HStack>

// //                 {status === "Last Call" && (
// //                   <Box mt={2}>
// //                     <Text fontSize="sm" fontWeight="bold">
// //                       Deadline: <Text as="span" fontWeight="normal">{item.deadline || "N/A"}</Text>
// //                     </Text>
// //                   </Box>
// //                 )}
// //               </Box>
// //             ))}

// //             <HStack justify="center" mt={4}>
// //               <Button size="sm" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} isDisabled={currentPage === 1}>
// //                 Prev
// //               </Button>
// //               <Text fontSize="sm">{currentPage} / {totalPages}</Text>
// //               <Button size="sm" onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} isDisabled={currentPage === totalPages}>
// //                 Next
// //               </Button>
// //             </HStack>
// //           </VStack>
// //         </MotionBox>
// //       )}
// //     </>
// //   );
// // };

// // export default CatTable;

// import {
//   Box,
//   Text,
//   useColorModeValue,
//   Badge,
//   Link,
//   VStack,
//   HStack,
//   Wrap,
//   WrapItem,
//   Icon,
//   Button,
// } from "@chakra-ui/react";
// import React, { useState } from "react";
// import { motion } from "framer-motion";
// import { FaRegClock } from "react-icons/fa";

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

// interface AreaCProps {
//   dataset: EIP[];
//   status: string;
//   cat: string;
// }

// const CatTable: React.FC<AreaCProps> = ({ cat, dataset, status }) => {
//   const MotionBox = motion(Box);
//   const bg = useColorModeValue("#f6f6f7", "#171923");
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 5;

//   const filteredData = dataset
//     .filter((item) => (cat === "All" || item.category === cat) && item.status === status)
//     .sort((a, b) => parseInt(a.eip) - parseInt(b.eip));

//   const paginatedData = filteredData.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage
//   );

//   const totalPages = Math.ceil(filteredData.length / itemsPerPage);

//   const getColorByType = (type: string): string => {
//     const key = type.toLowerCase();
//     if (key.includes("erc")) return "blue";
//     if (key.includes("meta")) return "teal";
//     if (key.includes("core")) return "purple";
//     if (key.includes("interface")) return "orange";
//     if (key.includes("networking")) return "yellow";
//     if (key.includes("informational")) return "cyan";
//     if (key.includes("standards") || key.includes("standards track")) return "green";
//     if (key.includes("living")) return "pink";
//     if (key.includes("withdrawn")) return "red";
//     if (key.includes("stagnant")) return "gray";
//     if (key.includes("lastcall") || key.includes("last call")) return "red";
//     if (key.includes("review")) return "orange";
//     if (key.includes("final")) return "green";
//     if (key.includes("draft")) return "purple";
//     return "gray";
//   };

//   const factorAuthor = (data: string): { name: string; href: string }[] => {
//     const list = data.split(",").map((author) => author.trim());
//     return list.map((entry) => {
//       const nameMatch = entry.match(/^([^(<]+?)(?:\s*\(([^)]+)\)|\s*<([^>]+)>)?$/);
//       const name = nameMatch?.[1]?.trim() || entry;
//       const identifier = nameMatch?.[2] || nameMatch?.[3] || "";
//       let href = "#";

//       if (/^[\w.-]+@[\w.-]+\.[\w]{2,}$/.test(identifier)) {
//         href = `mailto:${identifier}`;
//       } else if (identifier) {
//         const username = identifier.replace(/^@/, "");
//         href = `https://github.com/${username}`;
//       }

//       return { name, href };
//     });
//   };

//   return (
//     <>
//       {filteredData.length > 0 && (
//         <MotionBox
//           bgColor={bg}
//           p={6}
//           borderRadius="2xl"
//           boxShadow="lg"
//           initial={{ opacity: 0, y: 10 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.3 }}
//         >
//           <Text fontSize="2xl" fontWeight="bold" color="blue.400" mb={4}>
//             {status}
//           </Text>

//           <VStack spacing={4} align="stretch">
//             {paginatedData.map((item, idx) => (
//               <Box
//                 key={idx}
//                 p={4}
//                 bg={useColorModeValue("white", "gray.800")}
//                 borderRadius="xl"
//                 boxShadow="sm"
//                 _hover={{ boxShadow: "md" }}
//               >
//                 <HStack justify="space-between" wrap="wrap">
//                   <HStack spacing={2} wrap="wrap">
//                     <Badge colorScheme="blue" px={2} py={1} borderRadius="full">
//                       eip-{item.eip}
//                     </Badge>
//                     <Badge colorScheme={getColorByType(item.type)} borderRadius="full" fontSize="2xs">
//                       {item.type}
//                     </Badge>
//                     <Badge colorScheme={getColorByType(item.category)} variant="subtle" borderRadius="full" fontSize="2xs">
//                       {item.category}
//                     </Badge>

//                   </HStack>

//                   <HStack spacing={2} align="center">
//                     <Icon as={FaRegClock} fontSize="sm" />
//                     <Text fontSize="xs" color="gray.500">
//                       {item.created?.split("T")[0]}
//                     </Text>
//                   </HStack>
//                 </HStack>

//                 <Box mt={1}>
//                   <Link
//                     href={`/${cat === "ERC" || item.repo === "erc" ? "ercs/erc" : item.repo === "rip" ? "rips/rip" : "eips/eip"}-${item.eip}`}
//                     fontWeight="semibold"
//                     fontSize="md"
//                     color={useColorModeValue("gray.800", "white")}
//                     _hover={{ color: "blue.400" }}
//                   >
//                     {item.title}
//                   </Link>
//                 </Box>

//                 <HStack mt={2} align="center" wrap="wrap">
//                   <Text fontSize="xs" fontWeight="bold" color="gray.500" mr={2}>
//                     By:
//                   </Text>
//                   <Wrap spacing={1}>
//                     {factorAuthor(item.author).map((a, i) => (
//                       <WrapItem key={i}>
//                         <Link
//                           href={a.href}
//                           target="_blank"
//                           fontSize="xs"
//                           color="gray.600"
//                           _hover={{ textDecoration: "underline", color: "blue.400" }}
//                         >
//                           {a.name}
//                         </Link>
//                       </WrapItem>
//                     ))}
//                   </Wrap>
//                 </HStack>

//                 {status.toLowerCase() === "last call" && (
//                   <Box mt={2}>
//                     <Text fontSize="sm" fontWeight="bold">
//                       Deadline:{" "}
//                       <Text as="span" fontWeight="normal">
//                         {item.deadline || "N/A"}
//                       </Text>
//                     </Text>
//                   </Box>
//                 )}
//               </Box>
//             ))}

//           </VStack>
//         </MotionBox>
//       )}
//     </>
//   );
// };

// export default CatTable;

import {
  Box,
  Text,
  useColorModeValue,
  Badge,
  Link,
  VStack,
  HStack,
  Wrap,
  WrapItem,
  Icon,
  useToast,
  Button,
  Stack
} from "@chakra-ui/react";
import React from "react";
import { motion } from "framer-motion";
import { FaRegClock } from "react-icons/fa";

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

interface AreaCProps {
  dataset: EIP[];
  status: string;
  cat: string;
}

const CatTable: React.FC<AreaCProps> = ({ cat, dataset, status }) => {
  const MotionBox = motion(Box);
  const bg = useColorModeValue("#f6f6f7", "#171923");
  const toast = useToast();

  const filteredData = dataset
    .filter((item) => (cat === "All" || item.category === cat) && (status === "All" || item.status === status))
    .sort((a, b) => parseInt(b.eip) - parseInt(a.eip));


  const getColorByType = (type: string): string => {
    const key = type.toLowerCase();
    if (key.includes("meta") || key.includes("living")) return "rgb(255, 99, 132)";        // meta - living
    if (key.includes("core") || key.includes("final")) return "rgb(255, 159, 64)";         // core - final
    if (key.includes("interface") || key.includes("stagnant")) return "rgb(255, 205, 86)"; // interface - stagnant
    if (key.includes("networking") || key.includes("withdrawn")) return "rgb(75, 192, 192)"; // networking - withdrawn
    if (key.includes("informational") || key.includes("review")) return "rgb(54, 162, 235)"; // informational - review
    if (key.includes("erc") || key.toLowerCase().includes("lastcall") || key.toLowerCase().includes("last call")) return "rgb(153, 102, 255)"; // ercs - lastcall
    if (key.includes("rip") || key.includes("draft")) return "rgb(255, 99, 255)"; // rips - draft
    if (key.includes("standards") || key.includes("standards track")) return "green";
    return "gray";
  };

  const factorAuthor = (data: string): { name: string; href: string }[] => {
    const list = data.split(",").map((author) => author.trim());
    return list.map((entry) => {
      const nameMatch = entry.match(/^([^(<]+?)(?:\s*\(([^)]+)\)|\s*<([^>]+)>)?$/);
      const name = nameMatch?.[1]?.trim() || entry;
      const identifier = nameMatch?.[2] || nameMatch?.[3] || "";
      let href = "#";

      if (/^[\w.-]+@[\w.-]+\.[\w]{2,}$/.test(identifier)) {
        href = `mailto:${identifier}`;
      } else if (identifier) {
        const username = identifier.replace(/^@/, "");
        href = `https://github.com/${username}`;
      }

      return { name, href };
    });
  };

  // CSV Download function
  const downloadCSV = () => {
    if (!filteredData.length) {
      toast({
        title: "No data to export",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Exclude fields we don't want in CSV
    const excludedFields = [
      "_id",
      "__v",
      "requires",
      "discussion",
      "repo",
      "unique_ID",
    ];

    // CSV headers (keys minus excluded)
    const headers = Object.keys(filteredData[0]).filter(
      (key) => !excludedFields.includes(key)
    );

    // Build CSV string
    const csvRows = [
      headers.join(","), // header row
      ...filteredData.map((item) =>
        headers
          .map((field) => {
            const val = (item as any)[field];
            if (typeof val === "string" && val.includes(",")) {
              return `"${val.replace(/"/g, '""')}"`; // Escape double quotes
            }
            return val ?? "";
          })
          .join(",")
      ),
    ];

    const csvContent = csvRows.join("\n");

    // Create download link & click
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `EIP_CatTable_${cat}_${status}_${new Date()
      .toISOString()
      .split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "CSV downloaded",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <>
      {filteredData.length > 0 && (
        <MotionBox
          bgColor={bg}
          p={6}
          borderRadius="2xl"
          boxShadow="lg"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Header + Download Button */}
          <Stack direction="row" justify="space-between" align="center" mb={4}>
            <Text fontSize="2xl" fontWeight="bold" color="blue.400">
              {status}
            </Text>
            <Button size="sm" colorScheme="blue" onClick={downloadCSV} cursor="pointer">
              Download CSV
            </Button>
          </Stack>

          <Box
            maxH="500px"
            overflowY="auto"
            pr={2}
            sx={{
              "&::-webkit-scrollbar": {
                width: "6px",
              },
              "&::-webkit-scrollbar-thumb": {
                background: useColorModeValue("#cbd5e0", "#4A5568"),
                borderRadius: "12px",
              },
              "&::-webkit-scrollbar-track": {
                background: "transparent",
              },
            }}
          >
            <VStack spacing={4} align="stretch">
              {filteredData.map((item, idx) => (
                <Box
                  key={idx}
                  p={4}
                  bg={useColorModeValue("white", "gray.800")}
                  borderRadius="xl"
                  boxShadow="sm"
                  _hover={{ boxShadow: "md" }}
                >
                  <HStack justify="space-between" wrap="wrap">
                    <HStack spacing={2} wrap="wrap">
                      <Badge colorScheme="blue" px={2} py={1} borderRadius="full">
                        eip-{item.eip}
                      </Badge>
                      <Badge colorScheme={getColorByType(item.type)} borderRadius="full" fontSize="2xs">
                        {item.type}
                      </Badge>
                      <Badge colorScheme={getColorByType(item.category)} variant="subtle" borderRadius="full" fontSize="2xs">
                        {item.category}
                      </Badge>
                    </HStack>

                    <HStack spacing={2} align="center">
                      <Icon as={FaRegClock} fontSize="sm" />
                      <Text fontSize="xs" color="gray.500">
                        {item.created?.split("T")[0]}
                      </Text>
                    </HStack>
                  </HStack>

                  <Box mt={1}>
                    <Link
                      href={`/${cat === "ERC" || item.repo === "erc" ? "ercs/erc" : item.repo === "rip" ? "rips/rip" : "eips/eip"}-${item.eip}`}
                      fontWeight="semibold"
                      fontSize="md"
                      color={useColorModeValue("gray.800", "white")}
                      _hover={{ color: "blue.400" }}
                    >
                      {item.title}
                    </Link>
                  </Box>

                  <HStack mt={2} align="center" wrap="wrap">
                    <Text fontSize="xs" fontWeight="bold" color="gray.500" mr={2}>
                      By:
                    </Text>
                    <Wrap spacing={1}>
                      {factorAuthor(item.author).map((a, i) => (
                        <WrapItem key={i}>
                          <Link
                            href={a.href}
                            target="_blank"
                            fontSize="xs"
                            color="gray.600"
                            _hover={{ textDecoration: "underline", color: "blue.400" }}
                          >
                            {a.name}
                          </Link>
                        </WrapItem>
                      ))}
                    </Wrap>
                  </HStack>

                  {status.toLowerCase() === "last call" && (
                    <Box mt={2}>
                      <Text fontSize="sm" fontWeight="bold">
                        Deadline:{" "}
                        <Text as="span" fontWeight="normal">
                          {item.deadline || "N/A"}
                        </Text>
                      </Text>
                    </Box>
                  )}
                </Box>
              ))}
            </VStack>
          </Box>
        </MotionBox>
      )}
    </>
  );
};

export default CatTable;
