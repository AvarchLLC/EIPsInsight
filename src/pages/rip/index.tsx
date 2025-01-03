import AllLayout from "@/components/Layout";
import { Box, Button, Grid, Text, useColorModeValue,IconButton, Flex , Collapse, Heading, useDisclosure, Link} from "@chakra-ui/react";
import FlexBetween from "@/components/FlexBetween";
import Header from "@/components/Header";
import { DownloadIcon } from "@chakra-ui/icons";
import TableStatus from "@/components/TableStatus";
import AreaStatus from "@/components/AreaStatus";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import LoaderComponent from "@/components/Loader";
import ERCGraph from "@/components/ERCGraph";
import NextLink from "next/link";
import StatusColumnChart from "@/components/StatusColumnChart";
import DateTime from "@/components/DateTime";
import SearchBox from "@/components/SearchBox";
import ERCCatBoxGrid from "@/components/ERCCatBoxGrid";
import RIPStatusDonut from "@/components/RIPStatusDonut";
import StackedColumnChart from "@/components/StackedBarChart";
import CBoxStatus from "@/components/CBoxStatus";
import AllChart from "@/components/AllChart";
import AreaC from "@/components/AreaC";
import RIPStatusGraph from "@/components/RIPStatusGraph";
import OtherBox from "@/components/OtherStats";
import { ChevronDownIcon } from "@chakra-ui/icons";
import {ChevronUpIcon } from "@chakra-ui/icons";
import RipCatTable from "@/components/RipCatTable";

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
  repo:string;
  unique_ID: number;
  __v: number;
}

interface APIResponse {
  eip: EIP[];
  erc: EIP[];
}

const RIP = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<EIP[]>([]); // Set initial state as an empty array
  const [data3, setData3] = useState<EIP[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/new/all`);
        console.log(response);
        const jsonData = await response.json();
        setData(jsonData.rip);
        const alldata=jsonData.eip.concat(jsonData.erc).concat(jsonData.rip);
        let filteredData2 = alldata
        .filter((item:any) => item.repo === 'rip');
        
        setData3(filteredData2);
        console.log("filtered data:",filteredData2)
        setIsLoading(false); // Set loader state to false after data is fetched
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false); // Set loader state to false even if an error occurs
      }
    };

    fetchData();
  }, []);

  const { isOpen: showDropdown, onToggle: toggleDropdown } = useDisclosure();
  const [show, setShow] = useState(false);
  const bg = useColorModeValue("#f6f6f7", "#171923");

  const toggleCollapse = () => setShow(!show);

  useEffect(() => {
    // Simulating a loading delay
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    // Cleanup function
    return () => clearTimeout(timeout);
  }, []);
  return (
    <AllLayout>
      {isLoading ? ( // Check if the data is still loading
        // Show loader if data is loading
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100vh"
        >
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Your loader component */}
            <LoaderComponent />
          </motion.div>
        </Box>
      ) : (
        <motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
  transition={{ duration: 0.5 }}
>
  <Box className="mx-4 sm:mx-10 md:mx-20 mt-10 mb-20">
    <FlexBetween>
      <Header
        title={`Rolling Improvement Proposal - [ ${data.length} ]`}
        subtitle="RIPs describe changes to the RIP process, or other non-optional changes."
      />
    </FlexBetween>
    <Box
      pl={4}
      mt={1}
      bg={useColorModeValue("blue.50", "gray.700")}
      borderRadius="md"
      pr="8px"
      // marginBottom={2}
    >
      <Flex justify="space-between" align="center">
        <Heading
          as="h3"
          size="lg"
          marginBottom={2}
          mt={1}
          color={useColorModeValue("#3182CE", "blue.300")}
        >
        RIPs FAQ
        </Heading>
        <Box
  bg="blue" // Gray background
  borderRadius="md" // Rounded corners
  padding={2} // Padding inside the box
>
  <IconButton
    onClick={toggleCollapse}
    icon={show ? <ChevronUpIcon boxSize={8} color="white" /> : <ChevronDownIcon boxSize={8} color="white" />}
    variant="ghost"
    mt={1}
     h="24px" // Smaller height
     w="20px"
    aria-label="Toggle Instructions"
    _hover={{ bg: 'blue' }} // Maintain background color on hover
    _active={{ bg: 'blue' }} // Maintain background color when active
    _focus={{ boxShadow: 'none' }} // Remove focus outline
    
  />
</Box>


      </Flex>

      <Collapse in={show}>
      <Heading
          as="h4"
          size="md"
          marginBottom={4}
          color={useColorModeValue("#3182CE", "blue.300")}
        >
          What is a Rollup Improvement Proposal (RIP)?
        </Heading>
        <Text
          fontSize="md"
          marginBottom={2}
          color={useColorModeValue("gray.800", "gray.200")}
          className="text-justify"
        >
          A Rollup Improvement Proposal (RIP) is a formal document that outlines new features, processes, or optimizations for rollup solutions in the Ethereum ecosystem. RIPs act as specifications to improve rollups, enhance interoperability, and standardize development processes.

         All RIPs are optional. RIPs are and will always remain optional standards for Rollups and participants in the larger EVM ecosystem.</Text>
        {/* <br/> */}
        <Heading
          as="h4"
          size="md"
          marginBottom={4}
          color={useColorModeValue("#3182CE", "blue.300")}
        >
         Why are RIPs Important?
        </Heading>
        <Text
          fontSize="md"
          marginBottom={2}
          color={useColorModeValue("gray.800", "gray.200")}
          className="text-justify"
        >
          A Rollup Improvement Proposal (RIP) is a formal document that outlines new features, processes, or optimizations for rollup solutions in the Ethereum ecosystem. RIPs act as specifications to improve rollups, enhance interoperability, and standardize development processes.

         All RIPs are optional. RIPs are and will always remain optional standards for Rollups and participants in the larger EVM ecosystem.</Text>
        {/* <br/> */}
        <Text fontSize="md" className="text-md text-left text-justify" mt={4} textAlign="justify">
            RIPs help coordinate technical improvements for rollups in a transparent, collaborative way. They:
          </Text>
          <ul className="list-disc list-inside space-y-2 text-md text-left text-justify">
            <li>Propose new features and optimizations.</li>
            <li>Collect community feedback on rollup-related issues.</li>
            <li>Serve as a historical record of design decisions.</li>
            <li>Help rollups track progress, especially for multi-client implementations.</li>
          </ul>
          
          <Box mt={2}>
          <Link 
            href="/resources#RIPs" 
            fontSize="md" 
            color="blue.500" 
            fontWeight="semibold" 
            _hover={{ textDecoration: 'underline' }}
          >
            Continue Reading {'>>'}
          </Link>
          </Box>
          <br/>
      </Collapse>

    </Box>

    <Box display={{ base: "block", md: "block", lg:"none" }} className="w-full pt-4">
      <SearchBox />
    </Box>

    <Box className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 pt-8 gap-5">
      <Box>
        <RIPStatusDonut />
      </Box>
      <Box>
        <AllChart type="RIP" />
      </Box>
      <Box className="h-fit">
        <OtherBox type="RIPs" />
      </Box>
    </Box>

    <Box paddingY={8}>
      <RIPStatusGraph />
    </Box>

    {/* <Box paddingY={8}>
    <RipCatTable dataset={data3} cat={"RIP"} status={"Living"} />
            <RipCatTable dataset={data3} cat={"RIP"} status={"Final"} />
            <RipCatTable dataset={data3} cat={"RIP"} status={"Last Call"} />
            <RipCatTable dataset={data3} cat={"RIP"} status={"Review"} />
            <RipCatTable dataset={data3} cat={"RIP"} status={"Draft"} />
            <RipCatTable dataset={data3} cat={"RIP"} status={"Withdrawn"} />
            <RipCatTable dataset={data3} cat={"RIP"} status={"Stagnant"} />
    </Box> */}
    
  </Box>
  
</motion.div>

      )}
    </AllLayout>
  );
};

export default RIP;
