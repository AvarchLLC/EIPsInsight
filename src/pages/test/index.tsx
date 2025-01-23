import React, { useState, useEffect } from "react";
import AllLayout from "@/components/Layout";
import {
  Box,
  Text,
  HStack,
  VStack,
  useColorModeValue,
  Tooltip,
} from "@chakra-ui/react";
import { motion } from "framer-motion";

const All = () => {
  const [currentSlot, setCurrentSlot] = useState(0);
  const [currentEpoch, setCurrentEpoch] = useState(0);
  const [currentBlock, setCurrentBlock] = useState(0);
  const [timer, setTimer] = useState(13); // 13-second timer

  // Fetch the current slot, epoch, and block number
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch the latest block header to get the current slot
        const beaconResponse = await fetch(
          "https://ethereum-sepolia-beacon-api.publicnode.com/eth/v1/beacon/headers/head"
        );
        const beaconData = await beaconResponse.json();
        const slot = parseInt(beaconData.data.header.message.slot);

        // Calculate the epoch from the slot (1 epoch = 32 slots)
        const epoch = Math.floor(slot / 32);

        // Fetch the current block number from the execution layer
        const executionResponse = await fetch(
          "https://ethereum-sepolia-rpc.publicnode.com",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              jsonrpc: "2.0",
              method: "eth_blockNumber",
              params: [],
              id: 1,
            }),
          }
        );
        const executionData = await executionResponse.json();
        const blockNumber = parseInt(executionData.result, 16);

        setCurrentSlot(slot);
        setCurrentEpoch(epoch);
        setCurrentBlock(blockNumber);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const interval = setInterval(() => {
      fetchData();
      setTimer(13); // Reset the timer to 13 seconds after each fetch
    }, 13000); // Fetch every 13 seconds

    // Countdown timer that resets every second
    const countdownInterval = setInterval(() => {
      setTimer((prev) => (prev === 0 ? 13 : prev - 1)); // Countdown logic
    }, 1000);

    fetchData(); // Fetch on initial load

    // Cleanup intervals on component unmount
    return () => {
      clearInterval(interval);
      clearInterval(countdownInterval);
    };
  }, []);

  // Calculate the slots in the current epoch
  const startSlot = currentEpoch * 32;
  const endSlot = startSlot + 32;
  const slotsInEpoch = Array.from({ length: 32 }, (_, i) => startSlot + i);

  // Split the slots into two rows
  const firstRowSlots = slotsInEpoch.slice(0, 18);
  const secondRowSlots = slotsInEpoch.slice(18);

  // Calculate the slots remaining until the target
  const slotsRemaining = 999999999 - currentSlot; // Placeholder for target slot

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
          maxWidth="1200px"
          mx="auto"
          mt={1}
          borderRadius="lg"
          boxShadow="xl"
          bg="gray.500"
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

          {/* Epoch Progress Visualization */}
          <Box
            as={motion.div}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            bg="gray.600"
            color="white"
            borderRadius="md"
            p={4}
            mb={4}
            fontSize="xs"
            fontWeight="normal"
          >
            {/* First Row: 19 Boxes */}
            <HStack spacing={1} wrap="wrap" justify="center" mb={2}>
              {firstRowSlots.map((slot) => {
                const isProcessed = slot < currentSlot;
                const isCurrent = slot === currentSlot;

                return (
                  <Tooltip
                    key={slot}
                    label={`Epoch: ${currentEpoch}, Block: ${currentBlock}`}
                    isDisabled={!isProcessed}
                  >
                    <Box
                      w={{ base: "45px", md: "55px" }} // Revert to previous box size
                      h={{ base: "45px", md: "55px" }} // Revert to previous box size
                      borderRadius="md"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      bg={
                        isCurrent
                          ? "blue.500"
                          : isProcessed
                          ? "green.500"
                          : "gray.500"
                      }
                      color="white"
                      fontSize={{ base: "10px", md: "9px" }} // Smaller numbers
                      fontWeight="bold"
                      animation={isCurrent ? "blink 1s infinite" : "none"}
                      _hover={{
                        transform: "scale(1.1)",
                        transition: "transform 0.2s",
                      }}
                    >
                      {slot}
                    </Box>
                  </Tooltip>
                );
              })}
            </HStack>

            {/* Second Row: 13 Boxes + Text + Golden Box */}
            <HStack spacing={1} wrap="wrap" justify="center">
              {secondRowSlots.map((slot) => {
                const isProcessed = slot < currentSlot;
                const isCurrent = slot === currentSlot;

                return (
                  <Tooltip
                    key={slot}
                    label={`Epoch: ${currentEpoch}, Block: ${currentBlock}`}
                    isDisabled={!isProcessed}
                  >
                    <Box
                      w={{ base: "45px", md: "55px" }} // Revert to previous box size
                      h={{ base: "45px", md: "55px" }} // Revert to previous box size
                      borderRadius="md"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      bg={
                        isCurrent
                          ? "blue.500"
                          : isProcessed
                          ? "green.500"
                          : "gray.500"
                      }
                      color="white"
                      fontSize={{ base: "10px", md: "9px" }} // Smaller numbers
                      fontWeight="bold"
                      animation={isCurrent ? "blink 1s infinite" : "none"}
                      _hover={{
                        transform: "scale(1.1)",
                        transition: "transform 0.2s",
                      }}
                    >
                      {slot}
                    </Box>
                  </Tooltip>
                );
              })}

              {/* Vertical Stacked Text */}
              <VStack spacing={0} align="center" justify="center" ml={2}>
                <Text fontSize="xs" fontWeight="bold" color="white">
                  {slotsRemaining} slots away
                </Text>
                <Text fontSize="xs" color="white">
                  ..................
                </Text>
              </VStack>

              {/* Golden Box */}
              <Tooltip
                label={`Target Epoch: 999999999, Target Block: 999999999, Target Slot: 999999999`}
              >
                <Box
                  w={{ base: "45px", md: "55px" }} // Revert to previous box size
                  h={{ base: "45px", md: "55px" }} // Revert to previous box size
                  borderRadius="md"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  bg="gold"
                  color="white"
                  fontSize={{ base: "10px", md: "9px" }} // Smaller numbers
                  fontWeight="bold"
                  _hover={{
                    transform: "scale(1.1)",
                    transition: "transform 0.2s",
                  }}
                >
                  PECTRA
                </Box>
              </Tooltip>
            </HStack>
          </Box>

          {/* Additional Info */}
          <Text fontSize="sm" color="white" mb={4}>
            Refreshes in {timer} seconds
          </Text>
          <Text fontSize="sm" color="gray.300">
            * The slot, epoch, and block numbers are updated every 13 seconds.
          </Text>
        </Box>
      </motion.div>

      {/* Blinking Animation */}
      <style>
        {`
          @keyframes blink {
            0% { opacity: 1; }
            50% { opacity: 0.5; }
            100% { opacity: 1; }
          }
        `}
      </style>
    </AllLayout>
  );
};

export default All;