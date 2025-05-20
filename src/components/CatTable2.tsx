// import {
//     Box,
//     Text,
//     useColorModeValue,
//     Wrap,
//     WrapItem,
//     Badge,
//     Link,
//   } from "@chakra-ui/react";
//   import React, { useEffect, useState, useMemo } from "react";
//   import { motion } from "framer-motion";


//   import { CCardBody, CSmartTable } from "@coreui/react-pro";

//   interface EIP {
//     _id: string;
//     eip: string;
//     title: string;
//     author: string;
//     status: string;
//     type: string;
//     category: string;
//     created: string;
//     discussion: string;
//     deadline: string;
//     requires: string;
//     repo:string;
//     unique_ID: number;
//     __v: number;
//   }

//   interface AreaCProps {
//     dataset: EIP[];
//     status:string;
//     cat:string;
//   }

//   import "@coreui/coreui/dist/css/coreui.min.css";


//   const StatusTable: React.FC<AreaCProps> =  ({ cat, dataset, status }) => {
//     const [data, setData] = useState<EIP[]>([]);
//     const [isLoading, setIsLoading] = useState(true);
//     const [isDarkMode, setIsDarkMode] = useState(false);
//     useEffect(() => {
//       setInterval(() => {
//         setIsLoading(false);
//       }, 2000);
//     });
//     console.log(dataset);
//     console.log(status);
//     console.log(cat);

//     const factorAuthor = (data: any) => {
//       let list = data.split(",");
//       for (let i = 0; i < list.length; i++) {
//         list[i] = list[i].split(" ");
//       }
//       if (list[list.length - 1][list[list.length - 1].length - 1] === "al.") {
//         list.pop();
//       }
//       return list;
//     };

//     useEffect(() => {
//       const fetchData = async () => {
//         try {
//           // const response = await fetch(`/api/new/all`);
//           // const jsonData = await response.json();
//           setData(dataset);
//           setIsLoading(false); // Set isLoading to false after data is fetched
//         } catch (error) {
//           console.error("Error fetching data:", error);
//           setIsLoading(false); // Set isLoading to false if there's an error
//         }
//       };
//       fetchData();
//     }, []);

//     useEffect(() => {
//       if (bg === "#f6f6f7") {
//         setIsDarkMode(false);
//       } else {
//         setIsDarkMode(true);
//       }
//     });

//     const filteredData = dataset
//       .filter((item) => (cat === "All" || item.category === cat) && item.category === status)
//       .map((item) => {
//         const { eip, title, author, repo, type, category, status } = item;
//       return {
//         eip,
//         title,
//         author,
//         repo,
//         type,
//         category,
//         status,
//       };
//       });

//       console.log(" test filtered data:",filteredData);

//     const bg = useColorModeValue("#f6f6f7", "#171923");

//     return (
//       <>
//         {filteredData.length > 0 ? (
//           <Box
//             bgColor={bg}
//             marginTop={"2"}
//             p="1rem 1rem"
//             borderRadius="0.55rem"
//             _hover={{
//               border: "1px",
//               borderColor: "#30A0E0",
//             }}
//             as={motion.div}
//             initial={{ opacity: 0, y: -20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5 } as any}
//             className=" ease-in duration-200 z-0"
//           >
//             <CCardBody>
//               <>
//                 <h2 className="text-blue-400 font-semibold text-4xl">
//                   {" "}
//                   {status}
//                 </h2>
//                 <CSmartTable
//                   items={filteredData.sort(
//                     (a, b) => parseInt(a["eip"]) - parseInt(b["eip"])
//                   )}
//                   activePage={1}
//                   clickableRows
//                   columnFilter
//                   columnSorter
//                   itemsPerPage={5}
//                   pagination
//                   paginationProps={{
//                     pages: Math.ceil(filteredData.length / 5), // Calculate the number of pages based on the items and items per page
//                     style: {
//                       display: 'flex',
//                       flexWrap: 'wrap', // Allow pagination to wrap in smaller screens
//                       justifyContent: 'center',
//                       gap: '8px', // Space between pagination items
//                       padding: '10px',
//                     },
//                   }}
//                   tableProps={{
//                     hover: true,
//                     responsive: true,
//                     style: {
//                       borderRadius: "0.55rem", // Add rounded corners
//                       overflow: "hidden",      // Ensure the border-radius is applied cleanly
//                     },
//                   }}
//                   columns={[

//                     {
//                       key: 'eip',
//                       label: 'EIP',
//                       _style: {
//                         backgroundColor: isDarkMode ? '#2D3748' : '#F7FAFC',
//                         color: isDarkMode ? 'white' : 'black',
//                         fontWeight: 'bold',
//                       }
//                     },
//                     {
//                       key: 'title',
//                       label: 'Title',
//                       _style: {
//                         backgroundColor: isDarkMode ? '#2D3748' : '#F7FAFC',
//                         color: isDarkMode ? 'white' : 'black',
//                         fontWeight: 'bold',
//                       }
//                     },
//                     {
//                       key: 'author',
//                       label: 'Author',
//                       _style: {
//                         backgroundColor: isDarkMode ? '#2D3748' : '#F7FAFC',
//                         color: isDarkMode ? 'white' : 'black',
//                         fontWeight: 'bold',
//                       }
//                     },
//                     {
//                       key: 'type',
//                       label: 'Type',
//                       _style: {
//                         backgroundColor: isDarkMode ? '#2D3748' : '#F7FAFC',
//                         color: isDarkMode ? 'white' : 'black',
//                         fontWeight: 'bold',
//                       }
//                     },
//                     {
//                       key: 'category',
//                       label: 'category',
//                       _style: {
//                         backgroundColor: isDarkMode ? '#2D3748' : '#F7FAFC',
//                         color: isDarkMode ? 'white' : 'black',
//                         fontWeight: 'bold',
//                       }
//                     },
//                     {
//                       key: 'status',
//                       label: 'status',
//                       _style: {
//                         backgroundColor: isDarkMode ? '#2D3748' : '#F7FAFC',
//                         color: isDarkMode ? 'white' : 'black',
//                         fontWeight: 'bold',
//                       }
//                     },
//                     ]}
//                   scopedColumns={{
//                     "#": (item: any) => (
//                       <td key={item.eip} style={{ backgroundColor: isDarkMode ? '#2D3748' : '#F7FAFC' }}>
//                         <Link href={`/${item.repo==='erc' ? "ercs/erc" : item.repo==='rip'  ? "rips/rip" : "eips/eip"}-${item.eip}`}>
//                           <Wrap>
//                             <WrapItem>
//                               <Badge colorScheme={getStatusColor(item.status)}>
//                                 {item["#"]}
//                               </Badge>
//                             </WrapItem>
//                           </Wrap>
//                         </Link>
//                       </td>
//                     ),
//                     eip: (item: any) => (
//                       <td key={item.eip} style={{ backgroundColor: isDarkMode ? '#2D3748' : '#F7FAFC' }}>
//                         <Link href={`/${item.repo==='erc' ? "ercs/erc" : item.repo==='rip' ? "rips/rip" : "eips/eip"}-${item.eip}`}>
//                           <Wrap>
//                             <WrapItem>
//                               <Badge colorScheme={getStatusColor(item.status)}>
//                                 {item.eip}
//                               </Badge>
//                             </WrapItem>
//                           </Wrap>
//                         </Link>
//                       </td>
//                     ),
//                     title: (item: any) => (
//                       <td
//                         key={item.eip}
//                         style={{ fontWeight: "bold", height: "100%",  backgroundColor: isDarkMode ? '#2D3748' : '#F7FAFC' }}
//                         className="hover:text-[#1c7ed6]"
//                       >
//                         <Link
//                           href={`/${cat === "ERC" || item.repo==='erc' ? "ercs/erc" : item.repo==='rip' ? "rips/rip" : "eips/eip"}-${item.eip}`}
//                           className={
//                             isDarkMode
//                               ? "hover:text-[#1c7ed6] text-[13px] text-white"
//                               : "hover:text-[#1c7ed6] text-[13px] text-black"
//                           }
//                         >
//                           {item.title}
//                         </Link>
//                       </td>
//                     ),
//                     author: (it: any) => (
//                       <td key={it.author} style={{ backgroundColor: isDarkMode ? '#2D3748' : '#F7FAFC' }}>
//                         <div>
//                           {factorAuthor(it.author).map(
//                             (item: any, index: any) => {
//                               let t = item[item.length - 1].substring(
//                                 1,
//                                 item[item.length - 1].length - 1
//                               );
//                               return (
//                                 <Wrap key={index}>
//                                   <WrapItem>
//                                     <Link
//                                       href={`${
//                                         item[item.length - 1].substring(
//                                           item[item.length - 1].length - 1
//                                         ) === ">"
//                                           ? "mailto:" + t
//                                           : "https://github.com/" + t.substring(1)
//                                       }`}
//                                       target="_blank"
//                                       className={
//                                         isDarkMode
//                                           ? "hover:text-[#1c7ed6] text-[13px] text-white"
//                                           : "hover:text-[#1c7ed6] text-[13px] text-black"
//                                       }
//                                     >
//                                       {item}
//                                     </Link>
//                                   </WrapItem>
//                                 </Wrap>
//                               );
//                             }
//                           )}
//                         </div>
//                       </td>
//                     ),
//                     type: (item: any) => (
//                       <td
//                         key={item.eip}
//                         className={isDarkMode ? "text-white" : "text-black"}
//                         style={{ backgroundColor: isDarkMode ? '#2D3748' : '#F7FAFC' }}
//                       >
//                         {item.type}
//                       </td>
//                     ),
//                     category: (item: any) => (
//                       <td
//                         key={item.eip}
//                         className={isDarkMode ? "text-white" : "text-black"}
//                         style={{ backgroundColor: isDarkMode ? '#2D3748' : '#F7FAFC' }}
//                       >
//                         {item.category}
//                       </td>
//                     ),
//                     status: (item: any) => (
//                       <td key={item.eip} style={{ backgroundColor: isDarkMode ? '#2D3748' : '#F7FAFC' }}>
//                         <Wrap>
//                           <WrapItem>
//                             <Badge colorScheme={getStatusColor(item.status)}>
//                               {item.status}
//                             </Badge>
//                           </WrapItem>
//                         </Wrap>
//                       </td>
//                     ),
//                   }}

//                 />
//               </>
//             </CCardBody>
//           </Box>
//         ) : (
//           <></>
//         )}
//       </>
//     );
//   };

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case "Meta":
//         return "blue";
//       case "Informational":
//         return "blue";
//       case "Core":
//         return "purple";
//       case "Networking":
//         return "orange";
//       case "Interface":
//         return "red";
//       default:
//         return "gray";
//     }
//   };

//   export default StatusTable;
import {
  Box,
  Text,
  useColorModeValue,
  Wrap,
  WrapItem,
  Badge,
  Link,
  HStack,
  Button,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { motion } from "framer-motion";

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

const StatusTable: React.FC<AreaCProps> = ({ cat, dataset, status }) => {
  const bg = useColorModeValue("#f6f6f7", "#171923");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredData = dataset
    .filter((item) => (cat === "All" || item.category === cat) && item.category === status)
    .sort((a, b) => parseInt(a.eip) - parseInt(b.eip));

  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);


  const getColorByType = (type: string): string => {
    const key = type.toLowerCase();
    if (key.includes("erc")) return "blue";
    if (key.includes("meta")) return "teal";
    if (key.includes("core")) return "purple";
    if (key.includes("interface")) return "orange";
    if (key.includes("networking")) return "yellow";
    if (key.includes("informational")) return "cyan";
    if (key.includes("standards") || key.includes("standards track")) return "green";
    if (key.includes("living")) return "pink";
    if (key.includes("withdrawn")) return "red";
    if (key.includes("stagnant")) return "gray";
    if (key.includes("lastcall") || key.includes("last call")) return "red";
    if (key.includes("review")) return "orange";
    if (key.includes("final")) return "green";
    if (key.includes("draft")) return "purple";
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


  return (
    <Box
      bg={bg}
      borderRadius="xl"
      p={4}
      mt={4}
      as={motion.div}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition="all 0.4s ease-in-out"
    >
      <Text fontSize="2xl" fontWeight="bold" color="blue.400" mb={4}>
        {status}
      </Text>

      <Wrap spacing={4}>
        {paginatedData.map((item, idx) => (
          <WrapItem flex="1 1 100%">
            <Box
              key={idx}
              p={4}
              w="100%"
              borderRadius="xl"
              borderWidth={1}
              borderColor={useColorModeValue("gray.200", "gray.700")}
              bg={useColorModeValue("white", "gray.800")}
              _hover={{ borderColor: "blue.400", boxShadow: "md" }}
            >
              <HStack spacing={2} wrap="wrap" mb={2}>
                <Badge colorScheme="blue" px={2} py={1} borderRadius="full">
                  eip-{item.eip}
                </Badge>
                <Badge colorScheme={getColorByType(item.type)} borderRadius="full" fontSize="2xs">
                  {item.type}
                </Badge>
                <Badge colorScheme={getColorByType(item.status)} variant="subtle" borderRadius="full" fontSize="2xs">
                  {item.status}
                </Badge>
              </HStack>

              <Text fontSize="md" fontWeight="semibold" mb={1}>
                <Link
                  href={`/${item.repo === 'erc' ? "ercs/erc" : item.repo === 'rip' ? "rips/rip" : "eips/eip"}-${item.eip}`}
                  _hover={{ textDecoration: "underline" }}
                >
                  #{item.eip}: {item.title}
                </Link>
              </Text>

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
            </Box>
          </WrapItem>
        ))}
      </Wrap>

      {/* Pagination */}
      <HStack justify="center" mt={4}>
        <Button
          size="sm"
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          isDisabled={currentPage === 1}
        >
          Prev
        </Button>
        <Text fontSize="sm">
          {currentPage} / {totalPages}
        </Text>
        <Button
          size="sm"
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          isDisabled={currentPage === totalPages}
        >
          Next
        </Button>
      </HStack>
    </Box>
  );

};

export default StatusTable;
