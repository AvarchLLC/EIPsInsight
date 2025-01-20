import React, { useState, useEffect, useLayoutEffect } from "react";
import AllLayout from "@/components/Layout";
import {
  Box,
  Text,
  HStack,
  VStack,
  useColorModeValue,
  Icon,
  Button,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { FaFlagCheckered } from "react-icons/fa";

const sepolia_key = process.env.NEXT_PUBLIC_SEPOLIA_API as string;

const All = () => {
  const [currentBlock, setCurrentBlock] = useState(0);
  const [targetBlock, setTargetBlock] = useState(0);
  const [timer, setTimer] = useState(20); // 10-second timer
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  const bg = useColorModeValue("gray.100", "gray.900");
  const blockBg = useColorModeValue("white", "gray.700");

  useEffect(() => {
    if (bg === "gray.100") {
      setIsDarkMode(false);
    } else {
      setIsDarkMode(true);
    }
  }, [bg]);

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

  // Fetch the current block number from Sepolia every 10 seconds
  useEffect(() => {
    const fetchBlockNumber = async () => {
      try {
        const response = await fetch(sepolia_key, {
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
        });
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
    }, 20000); // Fetch every 20 seconds

    // Countdown timer that resets every 10 seconds
    const countdownInterval = setInterval(() => {
      setTimer((prev) => (prev === 0 ? 20 : prev - 1)); // Countdown logic
    }, 1000);

    fetchBlockNumber(); // Fetch on initial load

    // Cleanup intervals on component unmount
    return () => {
      clearInterval(interval);
      clearInterval(countdownInterval);
    };
  }, []);

  return (
    <AllLayout>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Box
          textAlign="center"
          p={6}
          maxWidth="700px"
          mx="auto"
          mt={1}
          borderRadius="lg"
          boxShadow="xl"
          bg="gray.500"
          color="white"
          display={{ base: "none", md: "block" }}
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
            bg="gray.600"
            color="white"
            borderRadius="md"
            p={2}
            mb={4}
            fontSize="xs"
            fontWeight="normal"
          >
            <HStack align="center" spacing={3}>
              <Box
                p="5"
                borderRadius="md"
                boxShadow={useColorModeValue("md", "dark-lg")}
                textAlign="center"
                minH="80px"
                display="flex"
                flexDirection="column"
                justifyContent="center"
                bg={blockBg}
                color={"black"}
              >
                <VStack>
                <Text fontSize="xs" fontWeight="normal" color={"black"}>Previous</Text>
                <Text fontWeight="bold">{currentBlock - 1}</Text>
                </VStack>
              </Box>

              <Text>-----</Text>

              <Box
                p="5"
                borderRadius="md"
                boxShadow={useColorModeValue("md", "dark-lg")}
                textAlign="center"
                minH="80px"
                display="flex"
                flexDirection="column"
                justifyContent="center"
                bg={currentBlock === currentBlock ? "blue.500" : blockBg}
                color={currentBlock === currentBlock ? "white" : "black"}
              >
                <VStack>
                <Text fontSize="xs" fontWeight="normal" color={"white"}>Current</Text>
                <Text fontWeight="bold">{currentBlock}</Text>
                </VStack>
              </Box>

              <Text>-----</Text>

              <Box
                p="5"
                borderRadius="md"
                boxShadow={useColorModeValue("md", "dark-lg")}
                textAlign="center"
                minH="80px"
                display="flex"
                flexDirection="column"
                justifyContent="center"
                bg={ blockBg}
                color={"black"}
              >
                <VStack>
                <Text fontSize="xs" fontWeight="normal" color={"black"}>Next</Text>
                <Text fontWeight="bold">{currentBlock + 1}</Text>
                </VStack>
              </Box>

              

              <VStack>
                <Text fontWeight="bold" color="white">
                  {targetBlock - currentBlock} blocks away
                </Text>
                <Text>..............................</Text>
              </VStack>
              <Box
                p="5"
                borderRadius="md"
                boxShadow={useColorModeValue("md", "dark-lg")}
                textAlign="center"
                minH="80px"
                display="flex"
                flexDirection="column"  // Use column direction for vertical alignment
                alignItems="center"     // Center horizontally
                justifyContent="center" // Center vertically
                bg="green.500"
                color="white"
                >
                <Text fontSize="xs" fontWeight="normal" color="white" mb={1}>Target</Text>  {/* Add margin to space out text from number */}
                <HStack spacing={2}>
                    <Text fontWeight="bold">{targetBlock}</Text>  {/* Add margin to space out text from icon */}
                    <Icon as={FaFlagCheckered} color="white" />
                </HStack>
                </Box>



                    </HStack>

                
                </Box>

                <Text fontSize="sm" color="white" mb={4}>
                    Refreshes in {timer} seconds
                </Text>

                <Text fontSize="sm" color="gray.300">
                    * The scheduled block number is not announced yet, and this is an approximation.
                </Text>
           </Box>

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
            display={{ base: "block", md: "none" }}
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
      </motion.div>
    </AllLayout>
  );
};

export default All;
