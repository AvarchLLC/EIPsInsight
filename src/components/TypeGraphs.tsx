
// import React, { useEffect, useState } from "react";
// import { Box, Grid, GridItem, Text, useColorModeValue } from "@chakra-ui/react";
// import { motion } from "framer-motion";
// import StatusColumnChart from "@/components/StatusColumnChart";
// import NextLink from "next/link";
// import DateTime from "./DateTime";

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
//   unique_ID: number;
//   __v: number;
// }

// const TypeGraphs = () => {
//   const bg = useColorModeValue("#f6f6f7", "#171923");

//   const [data, setData] = useState<EIP[]>([]);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await fetch(`/api/new/all`);
//         const jsonData = await response.json();
//         setData(jsonData.eip);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   if (isLoading) {
//     return <Text textAlign="center" mt={10}>Loading data...</Text>;
//   }

//   return (
//     <>
//       {/* Desktop and large screens */}
//       <Box display={{ base: "none", lg: "block" }}>
//         {/* Titles */}
//         <Grid templateColumns="repeat(3, 1fr)" gap={8}>
//           {["Core", "Networking", "Interface"].map((cat) => (
//             <NextLink key={cat} href={`/${cat.toLowerCase()}`} passHref>
//               <Text
//                 fontSize="3xl"
//                 fontWeight="bold"
//                 color="#30A0E0"
//                 cursor="pointer"
//                 _hover={{ textDecoration: "underline" }}
//               >
//                 {cat} - [{data.filter((item) => item.category === cat).length}]
//               </Text>
//             </NextLink>
//           ))}
//         </Grid>

//         {/* Category charts */}
//         <Grid templateColumns="repeat(3, 1fr)" gap={8} mt={6}>
//           {["Core", "Networking", "Interface"].map((cat) => (
//             <GridItem key={cat}>
//               <Box
//                 bg={bg}
//                 p="0.5rem"
//                 borderRadius="0.55rem"
//                 display="flex"
//                 flexDirection="column"
//                 justifyContent="center"
//                 alignItems="center"
//                 height={400}
//                 _hover={{ border: "1px", borderColor: "#30A0E0" }}
//                 as={motion.div}
//                 initial={{ opacity: 0, y: -20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition="all 0.5s ease-in-out"
//                 cursor="pointer"
//               >
//                 <StatusColumnChart category={cat} type={"EIPs"} />
//                 <Box w="full" mt={4}>
//                   <DateTime />
//                 </Box>
//               </Box>
//             </GridItem>
//           ))}
//         </Grid>

//         {/* Type titles */}
//         <Grid templateColumns="repeat(3, 1fr)" gap={8} pt={8}>
//           {["Meta", "Informational"].map((type) => (
//             <NextLink key={type} href={`/${type.toLowerCase()}`} passHref>
//               <Text
//                 fontSize="3xl"
//                 fontWeight="bold"
//                 color="#30A0E0"
//                 cursor="pointer"
//                 _hover={{ textDecoration: "underline" }}
//               >
//                 {type} - [{data.filter((item) => item.type === type).length}]
//               </Text>
//             </NextLink>
//           ))}
//           <Box /> {/* Filler for symmetry */}
//         </Grid>

//         {/* Meta and Informational side by side */}
//         <Grid templateColumns={{ base: "1fr", lg: "repeat(2, 1fr)" }} gap={8} mt={6}>
//           {/* Meta Box */}
//           <Box
//             bg={bg}
//             p="0.5rem"
//             borderRadius="0.55rem"
//             display="flex"
//             flexDirection="column"
//             justifyContent="center"
//             alignItems="center"
//             height={400}
//             _hover={{ border: "1px", borderColor: "#30A0E0" }}
//             as={motion.div}
//             initial={{ opacity: 0, y: -20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition="all 0.5s ease-in-out"
//             cursor="pointer"
//           >
//             <StatusColumnChart category="Meta" type="EIPs" />
//             <Box w="full" mt={4}>
//               <DateTime />
//             </Box>
//           </Box>

//           {/* Informational Box */}
//           <Box
//             bg={bg}
//             p="0.5rem"
//             borderRadius="0.55rem"
//             display="flex"
//             flexDirection="column"
//             justifyContent="center"
//             alignItems="center"
//             height={400}
//             _hover={{ border: "1px", borderColor: "#30A0E0" }}
//             as={motion.div}
//             initial={{ opacity: 0, y: -20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition="all 0.5s ease-in-out"
//             cursor="pointer"
//           >
//             <StatusColumnChart category="Informational" type="EIPs" />
//             <Box w="full" mt={4}>
//               <DateTime />
//             </Box>
//           </Box>
//         </Grid>

//       </Box>

//       {/* Mobile and small screens */}
//       <Box display={{ base: "block", lg: "none" }} px={4}>
//         {["Core", "Networking", "Interface", "Meta", "Informational"].map((catOrType) => (
//           <Box key={catOrType} mb={8}>
//             <NextLink href={`/${catOrType.toLowerCase()}`} passHref>
//               <Text
//                 fontSize="xl"
//                 fontWeight="bold"
//                 color="#30A0E0"
//                 cursor="pointer"
//                 _hover={{ textDecoration: "underline" }}
//               >
//                 {catOrType} - [
//                 {["Meta", "Informational"].includes(catOrType)
//                   ? data.filter((item) => item.type === catOrType).length
//                   : data.filter((item) => item.category === catOrType).length}
//                 ]
//               </Text>
//             </NextLink>

//             <Box
//               mt={4}
//               bg={bg}
//               p="0.5rem"
//               borderRadius="0.55rem"
//               display="flex"
//               flexDirection="column"
//               justifyContent="center"
//               alignItems="center"
//               height={400}
//               _hover={{ border: "1px", borderColor: "#30A0E0" }}
//               as={motion.div}
//               initial={{ opacity: 0, y: -20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition="all 0.5s ease-in-out"
//               cursor="pointer"
//             >
//               <StatusColumnChart category={catOrType} type={"EIPs"} />
//               <Box w="full" mt={4}>
//                 <DateTime />
//               </Box>
//             </Box>
//           </Box>
//         ))}
//       </Box>
//     </>
//   );
// };

// export default TypeGraphs;

import React, { useEffect, useState } from "react";
import {
  Box,
  Text,
  Select,
  Button,
  useColorModeValue,
  Spinner,
  VStack,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import StatusColumnChart from "@/components/StatusColumnChart";
import DateTime from "./DateTime";

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
  unique_ID: number;
  __v: number;
}


const TypeGraphs =  ({ selected }: { selected: string }) =>  {
  const bg = useColorModeValue("#f6f6f7", "#171923");

  const [data, setData] = useState<EIP[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/new/all`);
        const jsonData = await response.json();
        setData(jsonData.eip);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);



  if (isLoading) {
    return <Spinner mt={10} thickness="4px" size="xl" color="blue.400" />;
  }

  return (
     <Box
      bg={bg}
      w="full"
      p={4}
      borderRadius="lg"
      boxShadow="md"
      position="relative"
      as={motion.div}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition="all 0.5s ease-in-out"
    >
      <Box w="full" h={{ base: "300px", md: "400px" }}>
        <StatusColumnChart category={selected} type="EIPs" />
      </Box>
      <Box mt={8}>
        <DateTime />
      </Box>
    </Box>
  
  );

};

export default TypeGraphs;
