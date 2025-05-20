// import React, { useEffect, useState } from "react";
// import { Box, Grid, Text, useColorModeValue } from "@chakra-ui/react";
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

//   const [data, setData] = useState<EIP[]>([]); // Set initial state as an empty array
//   const [isLoading, setIsLoading] = useState(true); // Loader state
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await fetch(`/api/new/all`);
//         console.log(response);
//         const jsonData = await response.json();
//         setData(jsonData.eip);
//         setIsLoading(false); // Set loader state to false after data is fetched
//       } catch (error) {
//         console.error("Error fetching data:", error);
//         setIsLoading(false); // Set loader state to false even if an error occurs
//       }
//     };

//     fetchData();
//   }, []);

//   return (
//     <>
//       <Box hideBelow={"lg"}>
//         <Grid templateColumns="1fr 1fr 1fr" gap={8}>
//           <NextLink href={"/core"}>
//             <Text fontSize="3xl" fontWeight="bold" color="#30A0E0">
//               Core - [{data.filter((item) => item.category === "Core").length}]
//             </Text>
//           </NextLink>
//           <NextLink href={"/networking"}>
//             <Text fontSize="3xl" fontWeight="bold" color="#30A0E0">
//               Networking - [
//               {data.filter((item) => item.category === "Networking").length}]
//             </Text>
//           </NextLink>
//           <NextLink href={"/interface"}>
//             <Text fontSize="3xl" fontWeight="bold" color="#30A0E0">
//               Interface - [
//               {data.filter((item) => item.category === "Interface").length}]
//             </Text>
//           </NextLink>
//         </Grid>
//         <Grid templateColumns="1fr 1fr 1fr" gap={8}>
//           <Box
//             marginTop={"2rem"}
//             bg={bg}
//             p="0.5rem"
//             borderRadius="0.55rem"
//             display="flex"
//             flexDirection="column"
//             justifyContent="center"
//             alignItems="center"
//             height={400}
//             _hover={{
//               border: "1px",
//               borderColor: "#30A0E0",
//             }}
//             as={motion.div}
//             initial={{ opacity: 0, y: -20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5 } as any}
//             className="hover: cursor-pointer ease-in duration-200"
//           >
//             <StatusColumnChart category={"Core"} type={"EIPs"} />
//             <Box className={"w-full"}>
//               <DateTime />
//             </Box>
//           </Box>
//           <Box
//             marginTop={"2rem"}
//             bg={bg}
//             p="0.5rem"
//             borderRadius="0.55rem"
//             display="flex"
//             flexDirection="column"
//             justifyContent="center"
//             alignItems="center"
//             height={400}
//             _hover={{
//               border: "1px",
//               borderColor: "#30A0E0",
//             }}
//             as={motion.div}
//             initial={{ opacity: 0, y: -20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5 } as any}
//             className="hover: cursor-pointer ease-in duration-200"
//           >
//             <StatusColumnChart category={"Networking"} type={"EIPs"} />
//             <Box className={"w-full"}>
//               <DateTime />
//             </Box>
//           </Box>
//           <Box
//             marginTop={"2rem"}
//             bg={bg}
//             p="0.5rem"
//             borderRadius="0.55rem"
//             display="flex"
//             flexDirection="column"
//             justifyContent="center"
//             alignItems="center"
//             height={400}
//             _hover={{
//               border: "1px",
//               borderColor: "#30A0E0",
//             }}
//             as={motion.div}
//             initial={{ opacity: 0, y: -20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5 } as any}
//             className="hover: cursor-pointer ease-in duration-200"
//           >
//             <StatusColumnChart category={"Interface"} type={"EIPs"} />
//             <Box className={"w-full"}>
//               <DateTime />
//             </Box>
//           </Box>
//         </Grid>
//         <Grid templateColumns="1fr 1fr 1fr" gap={8} paddingTop={8}>
//           {/*<NextLink href={'/erc'}>*/}
//           {/*    <Text fontSize="3xl" fontWeight="bold" color="#30A0E0">*/}
//           {/*        ERC - [{data.filter((item) => item.category === "ERC").length}]*/}
//           {/*    </Text>*/}
//           {/*</NextLink>*/}
//           <NextLink href={"/meta"}>
//             <Text fontSize="3xl" fontWeight="bold" color="#30A0E0">
//               Meta - [{data.filter((item) => item.type === "Meta").length}]
//             </Text>
//           </NextLink>
//           <NextLink href={"/informational"}>
//             <Text fontSize="3xl" fontWeight="bold" color="#30A0E0">
//               Informational - [
//               {data.filter((item) => item.type === "Informational").length}]
//             </Text>
//           </NextLink>
//         </Grid>
//         <Grid templateColumns="1fr 1fr 1fr" gap={8}>
//           {/*<Box*/}
//           {/*    marginTop={"2rem"}*/}
//           {/*    bg={bg}*/}
//           {/*    p="0.5rem"*/}
//           {/*    borderRadius="0.55rem"*/}
//           {/*    display="flex"*/}
//           {/*    flexDirection="column"*/}
//           {/*    justifyContent="center"*/}
//           {/*    alignItems="center"*/}
//           {/*    height={400}*/}
//           {/*    _hover={{*/}
//           {/*        border: "1px",*/}
//           {/*        borderColor: "#30A0E0",*/}
//           {/*    }}*/}
//           {/*    as={motion.div}*/}
//           {/*    initial={{ opacity: 0, y: -20 }}*/}
//           {/*    animate={{ opacity: 1, y: 0 }}*/}
//           {/*    transition={{ duration: 0.5 } as any}*/}
//           {/*    className="hover: cursor-pointer ease-in duration-200"*/}
//           {/*>*/}
//           {/*    <StatusColumnChart category={'ERCs'} />*/}
//           {/*    <Box className={'w-full'}>*/}
//           {/*        <DateTime />*/}
//           {/*    </Box>*/}
//           {/*</Box>*/}

//           <Box
//             marginTop={"2rem"}
//             bg={bg}
//             p="0.5rem"
//             borderRadius="0.55rem"
//             display="flex"
//             flexDirection="column"
//             justifyContent="center"
//             alignItems="center"
//             height={400}
//             _hover={{
//               border: "1px",
//               borderColor: "#30A0E0",
//             }}
//             as={motion.div}
//             initial={{ opacity: 0, y: -20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5 } as any}
//             className="hover: cursor-pointer ease-in duration-200"
//           >
//             <StatusColumnChart category={"Meta"} type={"EIPs"} />
//             <Box className={"w-full"}>
//               <DateTime />
//             </Box>
//           </Box>

//           <Box
//             marginTop={"2rem"}
//             bg={bg}
//             p="0.5rem"
//             borderRadius="0.55rem"
//             display="flex"
//             flexDirection="column"
//             justifyContent="center"
//             alignItems="center"
//             height={400}
//             _hover={{
//               border: "1px",
//               borderColor: "#30A0E0",
//             }}
//             as={motion.div}
//             initial={{ opacity: 0, y: -20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5 } as any}
//             className="hover: cursor-pointer ease-in duration-200"
//           >
//             <StatusColumnChart category={"Informational"} type={"EIPs"} />
//             <Box className={"w-full"}>
//               <DateTime />
//             </Box>
//           </Box>
//         </Grid>
//       </Box>

//       <Box display={{ lg: "none", sm: "block" }}>
//         {/* <Text fontSize="xl" fontWeight="bold" color="#4267B2">
//           Draft
//         </Text>

//         <Box
//           marginTop={"2rem"}
//           paddingTop={"8"}
//           bg={bg}
//           p="0.5rem"
//           borderRadius="0.55rem"
//           display="flex"
//           flexDirection="column"
//           justifyContent="center"
//           alignItems="center"
//           height={400}
//           overflowX="auto"
//           _hover={{
//             border: "1px",
//             borderColor: "#30A0E0",
//           }}
//           as={motion.div}
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5 } as any}
//           className="hover: cursor-pointer ease-in duration-200"
//         >
//           <StackedColumnChart status="Draft" />
//           <Box className={"w-full"}>
//             <DateTime />
//           </Box> */}
//         {/* </Box> */}

//         {/* <Text fontSize="xl" fontWeight="bold" color="#4267B2" paddingTop={"8"}>
//           Draft vs Final
//         </Text>

//         <AreaC type={"EIPs"} /> */}

//         <NextLink href={"/core"}>
//           <Text fontSize="xl" fontWeight="bold" color="#30A0E0">
//             Core - [{data.filter((item) => item.category === "Core").length}]
//           </Text>
//         </NextLink>

//         <Box
//           marginTop={"2rem"}
//           bg={bg}
//           p="0.5rem"
//           borderRadius="0.55rem"
//           display="flex"
//           flexDirection="column"
//           justifyContent="center"
//           alignItems="center"
//           height={400}
//           _hover={{
//             border: "1px",
//             borderColor: "#30A0E0",
//           }}
//           as={motion.div}
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5 } as any}
//           className="hover: cursor-pointer ease-in duration-200"
//         >
//           <StatusColumnChart category={"Core"} type={"EIPs"} />
//           <Box className={"w-full"}>
//             <DateTime />
//           </Box>
//         </Box>

//         <NextLink href={"/networking"}>
//           <Text fontSize="xl" fontWeight="bold" color="#30A0E0">
//             Networking - [
//             {data.filter((item) => item.category === "Networking").length}]
//           </Text>
//         </NextLink>

//         <Box
//           marginTop={"2rem"}
//           bg={bg}
//           p="0.5rem"
//           borderRadius="0.55rem"
//           display="flex"
//           flexDirection="column"
//           justifyContent="center"
//           alignItems="center"
//           height={400}
//           _hover={{
//             border: "1px",
//             borderColor: "#30A0E0",
//           }}
//           as={motion.div}
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5 } as any}
//           className="hover: cursor-pointer ease-in duration-200"
//         >
//           <StatusColumnChart category={"Networking"} type={"EIPs"} />
//           <Box className={"w-full"}>
//             <DateTime />
//           </Box>
//         </Box>

//         <NextLink href={"/interface"}>
//           <Text fontSize="xl" fontWeight="bold" color="#30A0E0">
//             Interface - [
//             {data.filter((item) => item.category === "Interface").length}]
//           </Text>
//         </NextLink>

//         <Box
//           marginTop={"2rem"}
//           bg={bg}
//           p="0.5rem"
//           borderRadius="0.55rem"
//           display="flex"
//           flexDirection="column"
//           justifyContent="center"
//           alignItems="center"
//           height={400}
//           _hover={{
//             border: "1px",
//             borderColor: "#30A0E0",
//           }}
//           as={motion.div}
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5 } as any}
//           className="hover: cursor-pointer ease-in duration-200"
//         >
//           <StatusColumnChart category={"Interface"} type={"EIPs"} />
//           <Box className={"w-full"}>
//             <DateTime />
//           </Box>
//         </Box>

//         {/* <NextLink href={"/erc"}>
//           <Text fontSize="xl" fontWeight="bold" color="#30A0E0">
//             ERC - [{data.filter((item) => item.category === "ERC").length}]
//           </Text>
//         </NextLink>

//         <Box
//           marginTop={"2rem"}
//           bg={bg}
//           p="0.5rem"
//           borderRadius="0.55rem"
//           display="flex"
//           flexDirection="column"
//           justifyContent="center"
//           alignItems="center"
//           height={400}
//           _hover={{
//             border: "1px",
//             borderColor: "#30A0E0",
//           }}
//           as={motion.div}
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5 } as any}
//           className="hover: cursor-pointer ease-in duration-200"
//         >
//           <StatusColumnChart category={"ERCs"} type={"EIPs"} />
//           <Box className={"w-full"}>
//             <DateTime />
//           </Box>
//         </Box> */}

//         <NextLink href={"/meta"}>
//           <Text fontSize="xl" fontWeight="bold" color="#30A0E0">
//             Meta - [{data.filter((item) => item.type === "Meta").length}]
//           </Text>
//         </NextLink>

//         <Box
//           marginTop={"2rem"}
//           bg={bg}
//           p="0.5rem"
//           borderRadius="0.55rem"
//           display="flex"
//           flexDirection="column"
//           justifyContent="center"
//           alignItems="center"
//           height={400}
//           _hover={{
//             border: "1px",
//             borderColor: "#30A0E0",
//           }}
//           as={motion.div}
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5 } as any}
//           className="hover: cursor-pointer ease-in duration-200"
//         >
//           <StatusColumnChart category={"Meta"} type={"EIPs"} />
//           <Box className={"w-full"}>
//             <DateTime />
//           </Box>
//         </Box>

//         <NextLink href={"/informational"}>
//           <Text fontSize="xl" fontWeight="bold" color="#30A0E0">
//             Informational - [
//             {data.filter((item) => item.type === "Informational").length}]
//           </Text>
//         </NextLink>

//         <Box
//           marginTop={"2rem"}
//           bg={bg}
//           p="0.5rem"
//           borderRadius="0.55rem"
//           display="flex"
//           flexDirection="column"
//           justifyContent="center"
//           alignItems="center"
//           height={400}
//           _hover={{
//             border: "1px",
//             borderColor: "#30A0E0",
//           }}
//           as={motion.div}
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5 } as any}
//           className="hover: cursor-pointer ease-in duration-200"
//         >
//           <StatusColumnChart category={"Informational"} type={"EIPs"} />
//           <Box className={"w-full"}>
//             <DateTime />
//           </Box>
//         </Box>
//       </Box>
//     </>
//   );
// };

// export default TypeGraphs;

import React, { useEffect, useState } from "react";
import { Box, Grid, Text, useColorModeValue } from "@chakra-ui/react";
import { motion } from "framer-motion";
import StatusColumnChart from "@/components/StatusColumnChart";
import NextLink from "next/link";
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

const TypeGraphs = () => {
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
    return <Text textAlign="center" mt={10}>Loading data...</Text>;
  }

  return (
    <>
      {/* Desktop and large screens */}
      <Box display={{ base: "none", lg: "block" }}>
        <Grid templateColumns="repeat(3, 1fr)" gap={8}>
          <NextLink href={"/core"} passHref>
            <Text
              fontSize="3xl"
              fontWeight="bold"
              color="#30A0E0"
              cursor="pointer"
              _hover={{ textDecoration: "underline" }}
            >
              Core - [{data.filter((item) => item.category === "Core").length}]
            </Text>
          </NextLink>
          <NextLink href={"/networking"} passHref>
            <Text
              fontSize="3xl"
              fontWeight="bold"
              color="#30A0E0"
              cursor="pointer"
              _hover={{ textDecoration: "underline" }}
            >
              Networking - [{data.filter((item) => item.category === "Networking").length}]
            </Text>
          </NextLink>
          <NextLink href={"/interface"} passHref>
            <Text
              fontSize="3xl"
              fontWeight="bold"
              color="#30A0E0"
              cursor="pointer"
              _hover={{ textDecoration: "underline" }}
            >
              Interface - [{data.filter((item) => item.category === "Interface").length}]
            </Text>
          </NextLink>
        </Grid>

        <Grid templateColumns="repeat(3, 1fr)" gap={8} mt={6}>
          {["Core", "Networking", "Interface"].map((cat) => (
            <Box
              key={cat}
              bg={bg}
              p="0.5rem"
              borderRadius="0.55rem"
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              height={400}
              _hover={{ border: "1px", borderColor: "#30A0E0" }}
              as={motion.div}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition="all 0.5s ease-in-out"
              cursor="pointer"
              className="hover: cursor-pointer ease-in duration-200"
            >
              <StatusColumnChart category={cat} type={"EIPs"} />
              <Box w="full" mt={4}>
                <DateTime />
              </Box>
            </Box>
          ))}
        </Grid>

        <Grid templateColumns="repeat(3, 1fr)" gap={8} pt={8}>
          <NextLink href={"/meta"} passHref>
            <Text
              fontSize="3xl"
              fontWeight="bold"
              color="#30A0E0"
              cursor="pointer"
              _hover={{ textDecoration: "underline" }}
            >
              Meta - [{data.filter((item) => item.type === "Meta").length}]
            </Text>
          </NextLink>
          <NextLink href={"/informational"} passHref>
            <Text
              fontSize="3xl"
              fontWeight="bold"
              color="#30A0E0"
              cursor="pointer"
              _hover={{ textDecoration: "underline" }}
            >
              Informational - [{data.filter((item) => item.type === "Informational").length}]
            </Text>
          </NextLink>
          {/* Empty box for layout symmetry */}
          <Box />
        </Grid>

        <Grid templateColumns="repeat(3, 1fr)" gap={8} mt={6}>
          {["Meta", "Informational"].map((type) => (
            <Box
              key={type}
              bg={bg}
              p="0.5rem"
              borderRadius="0.55rem"
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              height={400}
              _hover={{ border: "1px", borderColor: "#30A0E0" }}
              as={motion.div}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition="all 0.5s ease-in-out"
              cursor="pointer"
              className="hover: cursor-pointer ease-in duration-200"
            >
              <StatusColumnChart category={type} type={"EIPs"} />
              <Box w="full" mt={4}>
                <DateTime />
              </Box>
            </Box>
          ))}
        </Grid>
      </Box>

      {/* Mobile and small screens */}
      <Box display={{ base: "block", lg: "none" }} px={4}>
        {["Core", "Networking", "Interface", "Meta", "Informational"].map((catOrType) => (
          <Box key={catOrType} mb={8}>
            <NextLink
              href={
                catOrType === "Meta" || catOrType === "Informational"
                  ? `/${catOrType.toLowerCase()}`
                  : `/${catOrType.toLowerCase()}`
              }
              passHref
            >
              <Text
                fontSize="xl"
                fontWeight="bold"
                color="#30A0E0"
                cursor="pointer"
                _hover={{ textDecoration: "underline" }}
              >
                {catOrType} - [
                {catOrType === "Meta" || catOrType === "Informational"
                  ? data.filter((item) => item.type === catOrType).length
                  : data.filter((item) => item.category === catOrType).length}
                ]
              </Text>
            </NextLink>

            <Box
              mt={4}
              bg={bg}
              p="0.5rem"
              borderRadius="0.55rem"
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              height={400}
              _hover={{ border: "1px", borderColor: "#30A0E0" }}
              as={motion.div}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition="all 0.5s ease-in-out"
              cursor="pointer"
            >
              <StatusColumnChart
                category={catOrType}
                type={"EIPs"}
              />
              <Box w="full" mt={4}>
                <DateTime />
              </Box>
            </Box>
          </Box>
        ))}
      </Box>
    </>
  );
};

export default TypeGraphs;
