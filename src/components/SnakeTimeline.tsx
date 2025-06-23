// // import React, { useEffect, useRef, useState } from "react";
// // import { Box, Flex, Text, VStack, useColorModeValue } from "@chakra-ui/react";

// // interface TimelineItem {
// //   status: string;
// //   date: string;
// // }

// // interface ResponsiveSnakeTimelineProps {
// //   data: TimelineItem[];
// //   statusColor?: string;
// //   dateColor?: string;
// // }

// // export const ResponsiveSnakeTimeline: React.FC<ResponsiveSnakeTimelineProps> = ({
// //   data,
// //   statusColor = "blue.500",
// //   dateColor = "gray.500",
// // }) => {
// //   const containerRef = useRef<HTMLDivElement>(null);
// //   const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
// //   const [rows, setRows] = useState<number[][]>([]);
// //   itemRefs.current = [];
// //   console.log("🐍 Snake Timeline received data:", data);


// //   useEffect(() => {
// //     const raf = requestAnimationFrame(() => {
// //       if (!containerRef.current) return;

// //       const rowMap = new Map<number, number[]>();

// //       itemRefs.current.forEach((el, index) => {
// //         if (!el) return;
// //         const top = el.offsetTop;
// //         if (!rowMap.has(top)) rowMap.set(top, []);
// //         rowMap.get(top)?.push(index);
// //       });

// //       const groupedRows = Array.from(rowMap.values());
// //       setRows(groupedRows);
// //       console.log("🧩 Grouped Rows:", groupedRows);

// //     });

// //     return () => cancelAnimationFrame(raf);
// //   }, [data]);

// //   return (
// //     <Flex ref={containerRef} wrap="wrap" gap={4} align="start" w="100%">
// //       <Box bg="green.100" p={2}>✅ Timeline is rendering</Box>
// //       {rows.map((row, rowIndex) => {
// //         const isReversed = rowIndex % 2 === 1;
// //         const rowItems = isReversed ? [...row].reverse() : row;

// //         return rowItems.map((index, i) => {
// //           const item = data[index];
// //           const currentDate = new Date(item.date);
// //           const nextItem = data[rowItems[i + 1]];
// //           const nextDate = nextItem ? new Date(nextItem.date) : null;
// //           const dayDifference = nextDate
// //             ? Math.abs(
// //               Math.ceil(
// //                 (nextDate.getTime() - currentDate.getTime()) / (1000 * 3600 * 24)
// //               )
// //             )
// //             : null;

// //           return (
// //             <React.Fragment key={index}>
// //               <VStack
// //                 ref={(el) => (itemRefs.current[index] = el)}
// //                 align="center"
// //                 spacing={3}
// //                 minW="120px"
// //                 maxW="120px"
// //                 mb={4}
// //               >
// //                 <Box
// //                   p="5"
// //                   bg={useColorModeValue("white", "gray.800")}
// //                   borderRadius="md"
// //                   boxShadow={useColorModeValue("md", "dark-lg")}
// //                   textAlign="center"
// //                   minH="80px"
// //                   display="flex"
// //                   flexDirection="column"
// //                   justifyContent="center"
// //                 >
// //                   <Text fontWeight="bold" color={statusColor}>
// //                     {item.status}
// //                   </Text>
// //                   <Text color={dateColor}>
// //                     {currentDate.toLocaleDateString("en-US", {
// //                       day: "numeric",
// //                       month: "long",
// //                       year: "numeric",
// //                     })}
// //                   </Text>
// //                 </Box>
// //               </VStack>

// //               {i !== rowItems.length - 1 && (
// //                 <VStack align="center" spacing={1}>
// //                   <Box
// //                     h="1px"
// //                     w="80px"
// //                     borderBottom="1px solid"
// //                     borderColor="gray.400"
// //                     position="relative"
// //                   >
// //                     <Box
// //                       position="absolute"
// //                       top="-4px"
// //                       right="-10px"
// //                       borderTop="5px solid transparent"
// //                       borderBottom="5px solid transparent"
// //                       borderLeft="10px solid gray"
// //                       transform={isReversed ? "rotate(180deg)" : "none"}
// //                     />
// //                   </Box>
// //                   {dayDifference && (
// //                     <Text color="gray.500" fontSize="sm">
// //                       {dayDifference} days
// //                     </Text>
// //                   )}
// //                 </VStack>
// //               )}
// //               {rows.length === 0 && (
// //                 <Box bg="red.100" p={4}>⚠️ No rows generated</Box>
// //               )}

// //             </React.Fragment>
// //           );
// //         });
// //       })}
// //     </Flex>
// //   );
// // };


// import React, { useEffect, useRef, useState } from "react";
// import { Box, Flex, Text, VStack, useColorModeValue } from "@chakra-ui/react";

// interface TimelineItem {
//   status: string;
//   date: string;
// }

// interface ResponsiveSnakeTimelineProps {
//   data: TimelineItem[];
//   statusColor?: string;
//   dateColor?: string;
// }

// export const ResponsiveSnakeTimeline: React.FC<ResponsiveSnakeTimelineProps> = ({
//   data,
//   statusColor = "blue.500",
//   dateColor = "gray.500",
// }) => {
//   const containerRef = useRef<HTMLDivElement>(null);
//   const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
//   const [rows, setRows] = useState<number[][]>([]);

//   // clear old refs
//   itemRefs.current = [];

//   useEffect(() => {
//     const timeout = setTimeout(() => {
//       const rowMap = new Map<number, number[]>();

//       itemRefs.current.forEach((el, index) => {
//         if (!el) return;
//         const top = el.offsetTop;
//         if (!rowMap.has(top)) rowMap.set(top, []);
//         rowMap.get(top)?.push(index);
//       });

//       const groupedRows = Array.from(rowMap.values());
//       setRows(groupedRows);
//       console.log("✅ Grouped Rows (after timeout):", groupedRows);
//     }, 0); // allow layout to complete

//     return () => clearTimeout(timeout);
//   }, [data]);


//   return (
//     <Flex ref={containerRef} wrap="wrap" gap={4} align="start" w="100%">
//       {rows.length === 0 && (
//         <Box bg="yellow.100" p={4}>
//           🟡 Timeline layout not detected yet
//         </Box>
//       )}

//       {rows.map((row, rowIndex) => {
//         const isReversed = rowIndex % 2 === 1;
//         const rowItems = isReversed ? [...row].reverse() : row;

//         return rowItems.map((index, i) => {
//           const item = data[index];
//           const currentDate = new Date(item.date);
//           const nextItem = data[rowItems[i + 1]];
//           const nextDate = nextItem ? new Date(nextItem.date) : null;
//           const dayDifference = nextDate
//             ? Math.abs(
//               Math.ceil(
//                 (nextDate.getTime() - currentDate.getTime()) / (1000 * 3600 * 24)
//               )
//             )
//             : null;

//           return (
//             <React.Fragment key={index}>
//               <VStack
//                 ref={(el) => (itemRefs.current[index] = el)}
//                 align="center"
//                 spacing={3}
//                 minW="120px"
//                 maxW="120px"
//                 mb={4}
//               >
//                 <Box
//                   p="5"
//                   bg={useColorModeValue("white", "gray.800")}
//                   borderRadius="md"
//                   boxShadow={useColorModeValue("md", "dark-lg")}
//                   textAlign="center"
//                   minH="80px"
//                   display="flex"
//                   flexDirection="column"
//                   justifyContent="center"
//                 >
//                   <Text fontWeight="bold" color={statusColor}>
//                     {item.status}
//                   </Text>
//                   <Text color={dateColor}>
//                     {currentDate.toLocaleDateString("en-US", {
//                       day: "numeric",
//                       month: "long",
//                       year: "numeric",
//                     })}
//                   </Text>
//                 </Box>
//               </VStack>

//               {i !== rowItems.length - 1 && (
//                 <VStack align="center" spacing={1}>
//                   <Box
//                     h="1px"
//                     w="80px"
//                     borderBottom="1px solid"
//                     borderColor="gray.400"
//                     position="relative"
//                   >
//                     <Box
//                       position="absolute"
//                       top="-4px"
//                       right="-10px"
//                       borderTop="5px solid transparent"
//                       borderBottom="5px solid transparent"
//                       borderLeft="10px solid gray"
//                       transform={isReversed ? "rotate(180deg)" : "none"}
//                     />
//                   </Box>
//                   {dayDifference && (
//                     <Text color="gray.500" fontSize="sm">
//                       {dayDifference} days
//                     </Text>
//                   )}
//                 </VStack>
//               )}
//             </React.Fragment>
//           );
//         });
//       })}
//     </Flex>
//   );
// };

// import React, { useEffect, useRef, useState } from "react";
// import { Box, Flex, Text, VStack, useColorModeValue } from "@chakra-ui/react";

// interface TimelineItem {
//   status: string;
//   date: string;
// }

// interface ResponsiveSnakeTimelineProps {
//   data: TimelineItem[];
//   statusColor?: string;
//   dateColor?: string;
// }

// export const ResponsiveSnakeTimeline: React.FC<ResponsiveSnakeTimelineProps> = ({
//   data,
//   statusColor = "blue.500",
//   dateColor = "gray.500",
// }) => {
//   const containerRef = useRef<HTMLDivElement>(null);
//   const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
//   const [rows, setRows] = useState<number[][] | null>(null);

//   useEffect(() => {
//     if (data.length === 0) {
//       setRows([]);
//       return;
//     }

//     const updateLayout = () => {
//       const rowMap = new Map<number, number[]>();

//       itemRefs.current.forEach((el, index) => {
//         if (!el) return;
//         const rect = el.getBoundingClientRect();
//         const top = Math.round(rect.top);

//         if (!rowMap.has(top)) rowMap.set(top, []);
//         rowMap.get(top)?.push(index);
//       });

//       const groupedRows = Array.from(rowMap.values());
//       setRows(groupedRows);
//     };

//     // Initial measurement
//     updateLayout();

//     // Optional: Handle window resize
//     const resizeObserver = new ResizeObserver(updateLayout);
//     if (containerRef.current) {
//       resizeObserver.observe(containerRef.current);
//     }

//     return () => {
//       resizeObserver.disconnect();
//     };
//   }, [data]);

//   if (rows === null) {
//     // Measurement phase
//     return (
//       <Flex ref={containerRef} wrap="wrap" gap={4} align="start" w="100%" opacity={0}>
//         {data.map((item, index) => (
//           <VStack
//             key={index}
//             ref={(el) => (itemRefs.current[index] = el)}
//             align="center"
//             spacing={3}
//             minW="120px"
//             maxW="120px"
//             mb={4}
//           >
//             <Box
//               p="5"
//               bg={useColorModeValue("white", "gray.800")}
//               borderRadius="md"
//               boxShadow={useColorModeValue("md", "dark-lg")}
//               textAlign="center"
//               minH="80px"
//               display="flex"
//               flexDirection="column"
//               justifyContent="center"
//             >
//               <Text fontWeight="bold" color={statusColor}>
//                 {item.status}
//               </Text>
//               <Text color={dateColor}>
//                 {new Date(item.date).toLocaleDateString("en-US", {
//                   day: "numeric",
//                   month: "long",
//                   year: "numeric",
//                 })}
//               </Text>
//             </Box>
//           </VStack>
//         ))}
//       </Flex>
//     );
//   }

//   if (rows.length === 0) {
//     return (
//       <Box bg="yellow.100" p={4}>
//         🟡 Timeline layout not detected yet
//       </Box>
//     );
//   }

//   return (
//     <Flex ref={containerRef} wrap="wrap" gap={4} align="start" w="100%">
//       {rows.map((row, rowIndex) => {
//         const isReversed = rowIndex % 2 === 1;
//         const rowItems = isReversed ? [...row].reverse() : row;

//         return rowItems.map((index, i) => {
//           const item = data[index];
//           const currentDate = new Date(item.date);
//           const nextItem = data[rowItems[i + 1]];
//           const nextDate = nextItem ? new Date(nextItem.date) : null;
//           const dayDifference = nextDate
//             ? Math.abs(
//               Math.ceil(
//                 (nextDate.getTime() - currentDate.getTime()) / (1000 * 3600 * 24)
//               )
//             )
//             : null;
//           return (
//             <React.Fragment key={index}>
//               <VStack
//                 ref={(el) => (itemRefs.current[index] = el)}
//                 align="center"
//                 spacing={3}
//                 minW="120px"
//                 maxW="120px"
//                 mb={4}
//               >
//                 <Box
//                   p="5"
//                   bg={useColorModeValue("white", "gray.800")}
//                   borderRadius="md"
//                   boxShadow={useColorModeValue("md", "dark-lg")}
//                   textAlign="center"
//                   minH="80px"
//                   display="flex"
//                   flexDirection="column"
//                   justifyContent="center"
//                 >
//                   <Text fontWeight="bold" color={statusColor}>
//                     {item.status}
//                   </Text>
//                   <Text color={dateColor}>
//                     {currentDate.toLocaleDateString("en-US", {
//                       day: "numeric",
//                       month: "long",
//                       year: "numeric",
//                     })}
//                   </Text>
//                 </Box>
//               </VStack>

//               {i !== rowItems.length - 1 && (
//                 <VStack align="center" spacing={1}>
//                   <Box
//                     h="1px"
//                     w="80px"
//                     borderBottom="1px solid"
//                     borderColor="gray.400"
//                     position="relative"
//                   >
//                     <Box
//                       position="absolute"
//                       top="-4px"
//                       right="-10px"
//                       borderTop="5px solid transparent"
//                       borderBottom="5px solid transparent"
//                       borderLeft="10px solid gray"
//                       transform={isReversed ? "rotate(180deg)" : "none"}
//                     />
//                   </Box>
//                   {dayDifference && (
//                     <Text color="gray.500" fontSize="sm">
//                       {dayDifference} days
//                     </Text>
//                   )}
//                 </VStack>
//               )}
//             </React.Fragment>
//           );
//         });
//       })}
//     </Flex>
//   );
// };

import React, { useEffect, useRef, useState } from "react";
import { Box, Flex, Text, VStack, useColorModeValue } from "@chakra-ui/react";

interface TimelineItem {
  status: string;
  date: string;
}

interface ResponsiveSnakeTimelineProps {
  data: TimelineItem[];
  statusColor?: string;
  dateColor?: string;
}

export const ResponsiveSnakeTimeline: React.FC<ResponsiveSnakeTimelineProps> = ({
  data,
  statusColor = "blue.500",
  dateColor = "gray.500",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [rows, setRows] = useState<number[][]>([]);

  const groupItemsByRow = () => {
    if (!containerRef.current) return;

    const containerTop = containerRef.current.getBoundingClientRect().top;
    const rowMap = new Map<number, number[]>();

    itemRefs.current.forEach((el, index) => {
      if (!el) return;
      const top = Math.round(el.getBoundingClientRect().top - containerTop);
      const bucket = Math.round(top / 10) * 10;
      if (!rowMap.has(bucket)) rowMap.set(bucket, []);
      rowMap.get(bucket)!.push(index);
    });

    setRows(Array.from(rowMap.values()));
  };

  useEffect(() => {
    const timeout = setTimeout(groupItemsByRow, 100);
    window.addEventListener("resize", groupItemsByRow);
    return () => {
      clearTimeout(timeout);
      window.removeEventListener("resize", groupItemsByRow);
    };
  }, [data]);

  return (
    <Box ref={containerRef} w="100%">
      {/* Initial invisible render to measure layout */}
      <Flex wrap="wrap" gap={4} visibility="hidden" position="absolute" pointerEvents="none">
        {data.map((item, index) => (
          <VStack
            key={`ghost-${index}`}
            ref={(el) => (itemRefs.current[index] = el)}
            minW="120px"
            maxW="120px"
          >
            <Box minH="80px" />
          </VStack>
        ))}
      </Flex>

      {/* Render actual timeline */}
      {rows.map((row, rowIndex) => {
        const isReversed = rowIndex % 2 === 1;
        const rowItems = isReversed ? [...row].reverse() : row;

        return (
          <Flex key={rowIndex} direction="row" gap={4} wrap="nowrap" mb={4} justify="flex-start">
            {rowItems.map((index, i) => {
              const item = data[index];
              const currentDate = new Date(item.date);
              const nextIndex = rowItems[i + 1];
              const nextItem = nextIndex !== undefined ? data[nextIndex] : null;
              const nextDate = nextItem ? new Date(nextItem.date) : null;
              const dayDifference = nextDate
                ? Math.ceil((nextDate.getTime() - currentDate.getTime()) / (1000 * 3600 * 24))
                : null;

              return (
                <Flex
                  key={index}
                  direction={isReversed ? "row-reverse" : "row"}
                  align="center"
                  gap={2}
                  wrap="nowrap"
                >
                  <VStack spacing={3} minW="120px" maxW="120px">
                    <Box
                      p="5"
                      bg={useColorModeValue("white", "gray.800")}
                      borderRadius="md"
                      boxShadow={useColorModeValue("md", "dark-lg")}
                      textAlign="center"
                      minH="80px"
                      display="flex"
                      flexDirection="column"
                      justifyContent="center"
                    >
                      <Text fontWeight="bold" color={statusColor}>
                        {item.status}
                      </Text>
                      <Text color={dateColor}>
                        {currentDate.toLocaleDateString("en-US", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </Text>
                    </Box>
                  </VStack>

                  {nextItem && (
                    <VStack align="center" spacing={1}>
                      <Box
                        h="1px"
                        w="80px"
                        borderBottom="1px solid"
                        borderColor="gray.400"
                        position="relative"
                      >
                        <Box
                          position="absolute"
                          top="-4px"
                          transform={`translateY(4px) ${isReversed ? "rotate(180deg)" : ""}`}
                          left={isReversed ? "-10px" : undefined}
                          right={isReversed ? undefined : "-10px"}
                          borderTop="5px solid transparent"
                          borderBottom="5px solid transparent"
                          borderLeft="10px solid gray"
                        />
                      </Box>
                      {dayDifference && (
                        <Text fontSize="sm" color="gray.500">
                          {dayDifference} days
                        </Text>
                      )}
                    </VStack>
                  )}
                </Flex>
              );
            })}
          </Flex>
        );
      })}
    </Box>
  );
};
