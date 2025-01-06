import React, { useState, useEffect, useLayoutEffect } from "react";
import AllLayout from "@/components/Layout";
import {
  Box,
  Spinner,
  useColorModeValue,
  Wrap,
  WrapItem,
  Text,
  List,
  UnorderedList,
  ListItem,
  Heading,
  Flex,
  Image,
  SimpleGrid,
  Grid
} from "@chakra-ui/react";
import NLink from "next/link";
import CatTable from "@/components/CatTable";
import Header from "@/components/Header";
import SearchBox from "@/components/SearchBox";
import { CCardBody, CSmartTable } from "@coreui/react-pro";
import { motion } from "framer-motion";
import PectraTable from "@/components/PectraTable";
import { Table, Thead, Tbody, Tr, Th, Td, Link,TableContainer } from "@chakra-ui/react";
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
// import Image from "next/image";
import NetworkUpgradesChart from "@/components/NetworkUpgradesChart";
import NetworkUpgradesChart2 from "@/components/NetworkUpgradesChart2";
import { FaSyncAlt } from "react-icons/fa";
import { useRouter } from "next/router";


const sepolia_key=process.env.NEXT_PUBLIC_SEPOLIA_API as string;


const All = () => {
  const [selected, setSelected] = useState("Meta");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const bg = useColorModeValue("#f6f6f7", "#171923");
  const optionArr = [
    "Meta",
    "Informational",
    "Core",
    "Networking",
    "Interface",
    "ERC",
    "RIP",
  ];
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    if (bg === "#f6f6f7") {
      setIsDarkMode(false);
    } else {
      setIsDarkMode(true);
    }
  });


  
  

  
  // console.log("sepolia key:",sepolia_key);
  const calculateTargetBlock = (currentBlock: number) => {
    const targetDate = new Date("2025-02-15T00:00:00Z");
    const currentDate = new Date();
    
    // Calculate the time difference in seconds
    const secondsDifference = (targetDate.getTime() - currentDate.getTime()) / 1000;
    
    // Average block time in seconds (12 seconds per block)
    const averageBlockTime = 12;
    
    // Calculate the target block number
    const targetBlock = currentBlock + Math.floor(secondsDifference / averageBlockTime);
    
    return targetBlock;
  };

  const [targetBlock, setTargetBlock] = useState(0);
  const [currentBlock, setCurrentBlock] = useState(0);
  const [timer, setTimer] = useState(20); // 10-second timer
  

  // Fetch the current block number from Sepolia every 10 seconds
  useEffect(() => {
    const fetchBlockNumber = async () => {
      try {
        const response = await fetch(
          sepolia_key,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              method: "eth_blockNumber",
              params: [],
              id: 1,
              jsonrpc: "2.0",
            }),
          }
        );
        const data = await response.json();
        const blockNumber = parseInt(data.result, 16);
        setCurrentBlock(blockNumber);

        // Calculate the target block based on current block number
        const calculatedTargetBlock = calculateTargetBlock(blockNumber);
        setTargetBlock(calculatedTargetBlock);
      } catch (error) {
        console.error("Error fetching block number:", error);
      }
    };

    const interval = setInterval(() => {
      fetchBlockNumber();
      setTimer(20); // Reset the timer to 10 seconds after each fetch
    }, 20000); // Fetch every 10 seconds

    // Countdown timer that resets every 10 seconds
    const countdownInterval = setInterval(() => {
      setTimer((prev) => (prev === 0 ? 20 : prev - 1)); // Countdown logic
    }, 1000);

    // Initial fetch
    fetchBlockNumber(); // Fetch on initial load
    // Cleanup intervals on component unmount
    return () => {
      clearInterval(interval);
      clearInterval(countdownInterval);
    };
  }, []);

  const router = useRouter();
  
    const scrollToHash = () => {
      const hash = window.location.hash;
      if (hash) {
        const element = document.getElementById(hash.slice(1));
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }
    };
  
    useEffect(() => {
      if (!isLoading) {
        scrollToHash();
      }
    }, [isLoading]);
  
    useLayoutEffect(() => {
      router.events.on("routeChangeComplete", scrollToHash);
      return () => {
        router.events.off("routeChangeComplete", scrollToHash);
      };
    }, [router]);



  return (
    <>
      <AllLayout>
      <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
        <Box
          paddingBottom={{ lg: "10", sm: "10", base: "10" }}
          marginX={{ lg: "40", md: "2", sm: "2", base: "2" }}
          paddingX={{ lg: "10", md: "5", sm: "5", base: "5" }}
          marginTop={{ lg: "10", md: "5", sm: "5", base: "5" }}
        >
       <Box>
      
       <Box
  textAlign="center"
  p={6}
  maxWidth="700px"
  mx="auto"
  mt={1}
  borderRadius="lg"
  boxShadow="xl"
  bg="blue.500"
  color="white"
>
  <Text
    as={motion.div}
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    fontSize={{ base: "2xl", md: "2xl", lg: "2xl" }}
    fontWeight="bold"
    color="white"
    mb={4}
  >
    PECTRA Upgrade (Sepolia)
  </Text>

  
    <Box
    as={motion.div}
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    bg="blue.600"
    color="white"
    borderRadius="md"
    p={2}
    mb={4}
    fontSize="xs"
    fontWeight="normal"
  >
    <Text
    fontSize="4xl"
    fontWeight="bold"
    color="white"
    mb={4}
    as={motion.div}
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    // transition={{ duration: 1 }}
  >
    {targetBlock - currentBlock} blocks away
    </Text>
    </Box>
  
  
  <Text
    fontSize="sm"
    color="white"
    mb={4}
    as={motion.div}
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
  >
    Refreshes in {timer} seconds
    </Text>

  <Text fontSize="sm" color="gray.300">
    * The scheduled block number is not announced yet, and this is an approximation.
  </Text>
</Box>
{/* <br/> */}
        <br/>

       


        </Box>


         
        </Box>
       
      

        </motion.div>
      </AllLayout>
    </>
  );
};

export default All;
