import React, { useState, useEffect, useRef } from "react";
import AllLayout from "@/components/Layout";
import {
  Box,
  Text,
  HStack,
  VStack,
  Flex,
  Tooltip,
  Button,
  Spinner,
  Select,
} from "@chakra-ui/react";
import { keyframes } from '@chakra-ui/system';
import { motion } from "framer-motion";
import { useColorModeValue } from "@chakra-ui/react";

// Define the structure of a network
interface NetworkConfig {
  beaconApi: string;
  rpc: string;
  target: number;
  targetepoch:number;
  name: string;
}

// Define the available networks
const networks: Record<string, NetworkConfig> = {
  sepolia: {
    beaconApi: "https://ethereum-sepolia-beacon-api.publicnode.com",
    rpc: "https://ethereum-sepolia-rpc.publicnode.com",
    target: 7118848,
    targetepoch: 222464,
    name: "Sepolia",
  },
  holesky: {
    beaconApi: "https://ethereum-holesky-beacon-api.publicnode.com",
    rpc: "https://ethereum-holesky-rpc.publicnode.com",
    target: 3710976,
    targetepoch: 115968,
    name: "Holesky",
  },
  mainnet: {
    beaconApi: "https://ethereum-beacon-api.publicnode.com",
    rpc: "https://ethereum-rpc.publicnode.com",
    target: 11649024,
    targetepoch: 364032,
    name: "Mainnet",
  },
};

// Keyframes for celebratory animation
const celebrateAnimation = keyframes`
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.2); opacity: 0.8; }
  100% { transform: scale(1); opacity: 1; }
`;

const SlotCountdown: React.FC = () => {
  const [currentSlot, setCurrentSlot] = useState<number>(0);
  const [currentEpoch, setCurrentEpoch] = useState<number>(0);
  const [currentBlock, setCurrentBlock] = useState<number>(0);
  const [timer, setTimer] = useState<number>(13); // 13-second timer
  const [network, setNetwork] = useState<keyof typeof networks>("mainnet"); // Default network
  const [loading, setLoading] = useState<boolean>(true); // Show loader only on first load
  const [countdown, setCountdown] = useState<string>(""); // Countdown for days, hours, minutes
  const [isUpgradeLive, setIsUpgradeLive] = useState<boolean>(false); // Track if the upgrade is live
  const [viewMode, setViewMode] = useState<"slots" | "epochs">("epochs"); // Default to epochs view

  const countdownInterval = useRef<NodeJS.Timeout | null>(null); // Store interval reference

  const fetchData = async () => {
    try {
      const { beaconApi, rpc, target } = networks[network];

      // Fetch the latest block header to get the current slot
      const beaconResponse = await fetch(`${beaconApi}/eth/v1/beacon/headers/head`);
      const beaconData = await beaconResponse.json();
      const slot: number = parseInt(beaconData.data.header.message.slot);

      // Calculate the epoch from the slot (1 epoch = 32 slots)
      const epoch: number = Math.floor(slot / 32);

      // Fetch the current block number from the execution layer
      const executionResponse = await fetch(rpc, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          method: "eth_blockNumber",
          params: [],
          id: 1,
        }),
      });

      const executionData = await executionResponse.json();
      const blockNumber: number = parseInt(executionData.result, 16);

      setCurrentSlot(slot);
      setCurrentEpoch(epoch);
      setCurrentBlock(blockNumber);

      // Check if the upgrade is live
      if (target !== 999999999 && slot >= target) {
        setIsUpgradeLive(true);
        setCountdown("");
        return;
      } else {
        setIsUpgradeLive(false);
      }

      // Countdown logic with live updates
      if (target !== 999999999 && !isUpgradeLive) {
        let slotsRemaining: number = target - slot;
        let totalSecondsRemaining: number = slotsRemaining * 12; // 12 seconds per slot

        // Clear previous interval if it exists
        if (countdownInterval.current) {
          clearInterval(countdownInterval.current);
        }

        countdownInterval.current = setInterval(() => {
          if (totalSecondsRemaining <= 0) {
            clearInterval(countdownInterval.current!);
            setCountdown("0D 0H 0M 0S");
            return;
          }

          totalSecondsRemaining -= 1; // Decrement every second
          const days: number = Math.floor(totalSecondsRemaining / (3600 * 24));
          const hours: number = Math.floor((totalSecondsRemaining % (3600 * 24)) / 3600);
          const minutes: number = Math.floor((totalSecondsRemaining % 3600) / 60);
          const seconds: number = Math.floor(totalSecondsRemaining % 60);

          setCountdown(`${days}D ${hours}H ${minutes}M ${seconds}S`);
        }, 1000);
      } else {
        setCountdown("");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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
  }, [network]);

  const handleNetworkChange = (newNetwork: keyof typeof networks) => {
    setNetwork(newNetwork);
    setLoading(true); // Show loader when switching networks
  };

  // Calculate the slots in the current epoch
  const startSlot = currentEpoch * 32;
  const slotsInEpoch = Array.from({ length: 32 }, (_, i) => startSlot + i);

  // Split the slots into two rows
  const firstRowSlots = slotsInEpoch.slice(0, 20);
  const secondRowSlots = slotsInEpoch.slice(20);

  // Calculate the slots remaining until the target
  const slotsRemaining = networks[network].target - currentSlot;
  const epochsRemaining = networks[network].targetepoch - currentEpoch;

  const renderSlotsView = () => (
    <>
      {/* First Row: 18 Boxes */}
      <HStack spacing={1} wrap="wrap" justify="center" mb={2}>
        {firstRowSlots.map((slot) => {
          const isProcessed = slot < currentSlot;
          const isCurrent = slot === currentSlot;
          const epochOfSlot = Math.floor(slot / 32);
          const blockOfSlot = currentBlock - (currentSlot - slot);
  
          return (
            <Tooltip
              key={slot}
              label={isProcessed ? `Epoch: ${epochOfSlot}, Block: ${blockOfSlot}` : undefined}
              hasArrow
              placement="top"
              bg="gray.700"
              color="white"
            >
              <Box
                w={{ base: "45px", md: "55px" }}
                h={{ base: "45px", md: "55px" }}
                borderRadius="md"
                display="flex"
                alignItems="center"
                justifyContent="center"
                bg={
                  isCurrent
                    ? "teal.500"
                    : isProcessed
                    ? "purple.500"
                    : "blue.500"
                }
                color="white"
                fontSize={{ base: "10px", md: "9px" }}
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
  
      {/* Second Row: 14 Boxes + Text + Golden Box */}
      <HStack spacing={1} wrap="wrap" justify="center">
        {secondRowSlots.map((slot) => {
          const isProcessed = slot < currentSlot;
          const isCurrent = slot === currentSlot;
          const epochOfSlot = Math.floor(slot / 32);
          const blockOfSlot = currentBlock - (currentSlot - slot);
  
          return (
            <Tooltip
              key={slot}
              label={isProcessed ? `Epoch: ${epochOfSlot}, Block: ${blockOfSlot}` : undefined}
              hasArrow
              placement="top"
              bg="gray.700"
              color="white"
            >
              <Box
                w={{ base: "45px", md: "55px" }}
                h={{ base: "45px", md: "55px" }}
                borderRadius="md"
                display="flex"
                alignItems="center"
                justifyContent="center"
                bg={
                  isCurrent
                    ? "green.500"
                    : isProcessed
                    ? "purple.500"
                    : "blue.500"
                }
                color="white"
                fontSize={{ base: "10px", md: "9px" }}
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
        <VStack spacing={0} align="center" justify="center" ml={2} pt={2} pb={2}>
          {networks[network].target !== 999999999 ? (
            <>
              <Text fontSize="xs" fontWeight="bold" color="white">
                {slotsRemaining} slots away
              </Text>
              <Text fontSize="xs" color="white">
                .................
              </Text>
              <Text fontSize="s" fontWeight="bold" color="white">
                {countdown}
              </Text>
            </>
          ) : (
            <Text fontSize="xs" fontWeight="bold" color="white">
              Not announced yet!
            </Text>
          )}
        </VStack>
  
        {/* Golden Box */}
        <Tooltip
        label={`Target Slot: ${networks[network].target}, Date: May 07, 2025 (10:05:11 UTC)`}
        hasArrow
        placement="top"
        bg="gray.700"
        color="white"
      >
        <Box
          w={{ base: "45px", md: "55px" }}
          h={{ base: "45px", md: "55px" }}
          borderRadius="md"
          display="flex"
          alignItems="center"
          justifyContent="center"
          bg="gold"
          color="black"
          fontSize={{ base: "10px", md: "9px" }}
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
    </>
  );

  const renderEpochsView = () => (
    <HStack spacing={1} wrap="wrap" justify="center">
      {/* Current Epoch */}
      <Tooltip
        label={`Epoch: ${currentEpoch}, Current Slot: ${currentSlot}`}
        hasArrow
        placement="top"
        bg="gray.700"
        color="white"
      >
        <Box
          w={{ base: "45px", md: "55px" }}
          h={{ base: "45px", md: "55px" }}
          borderRadius="md"
          display="flex"
          alignItems="center"
          justifyContent="center"
          bg="teal.500"
          color="white"
          fontSize={{ base: "10px", md: "9px" }}
          fontWeight="bold"
          animation="blink 1s infinite"
        >
          {currentEpoch}
        </Box>
      </Tooltip>

      {/* Future Epochs */}
      {Array.from({ length: 17 }, (_, i) => currentEpoch + i + 1).map((epoch) => {
        const isTarget = epoch === networks[network].targetepoch;
        const isFuture = epoch > currentEpoch;
        const isCurrent = epoch === currentEpoch;

        return (
          <Tooltip
          key={epoch}
          label={isCurrent ? `Epoch: ${currentEpoch}, Current Slot: ${currentSlot}` : undefined}
          hasArrow
          placement="top"
          bg="gray.700"
          color="white"
        >
          <Box
            key={epoch}
            w={{ base: "45px", md: "55px" }}
            h={{ base: "45px", md: "55px" }}
            borderRadius="md"
            display="flex"
            alignItems="center"
            justifyContent="center"
            bg={
              isTarget
                ? "gold"
                : isFuture
                ? "blue.500"
                : "purple.500"
            }
            color="white"
            fontSize={{ base: "10px", md: "9px" }}
            fontWeight="bold"
            _hover={{
              transform: "scale(1.1)",
              transition: "transform 0.2s",
            }}
          >
            {epoch}
          </Box>
          </Tooltip>
        );
      })}

      {/* Countdown Text */}
      <VStack spacing={0} align="center" justify="center" ml={2} pt={2} pb={2}>
        {networks[network].targetepoch !== 999999999 ? (
          <>
            <Text fontSize="xs" fontWeight="bold" color="white">
              {epochsRemaining} epochs away
            </Text>
            <Text fontSize="xs" color="white">
              ........................
            </Text>
            <Text fontSize="s" fontWeight="bold" color="white">
              {countdown}
            </Text>
          </>
        ) : (
          <Text fontSize="xs" fontWeight="bold" color="white">
            Not announced yet!
          </Text>
        )}
      </VStack>

      {/* Target Epoch Box */}
      <Tooltip
        label={`Target epoch: ${networks[network].targetepoch}, Date: May 07, 2025 (10:05:11 UTC)`}
        hasArrow
        placement="top"
        bg="gray.700"
        color="white"
      >
      <Box
        w={{ base: "45px", md: "55px" }}
        h={{ base: "45px", md: "55px" }}
        borderRadius="md"
        display="flex"
        alignItems="center"
        justifyContent="center"
        bg="gold"
        color="black"
        fontSize={{ base: "10px", md: "9px" }}
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
  );

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Box
          textAlign="center"
          p={6}
          maxWidth="1370px"
          mx="auto"
          mt={1}
          borderRadius="lg"
          boxShadow="xl"
          bg={useColorModeValue("white","gray.800")}
          color="white"
        >
         <Flex
  position="relative"
  width="full"
  mb={4}
  alignItems="center"
  flexDirection={{ base: "column", md: "row" }} // Stack on mobile
  gap={{ base: 3, md: 0 }} // Add gap when stacked
>
  {/* Centered Heading - full width when stacked */}
  <Box
    position={{ base: "static", md: "absolute" }} // Normal flow on mobile
    left={{ md: "50%" }}
    transform={{ md: "translateX(-50%)" }}
    width={{ base: "100%", md: "auto" }}
    textAlign={{ base: "center", md: "left" }}
  >
    <Text
      as={motion.div}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      fontSize={{ base: "xl", md: "2xl", lg: "2xl" }} // Smaller on mobile
      fontWeight="bold"
      color={useColorModeValue("black", "white")}
      whiteSpace="nowrap"
    >
      PECTRA Upgrade ({networks[network].name})
    </Text>
  </Box>

  {/* Right-aligned Dropdown - full width when stacked */}
  <Box 
    ml={{ md: "auto" }} // Only auto margin on desktop
    width={{ base: "100%", md: "auto" }} // Full width on mobile
    textAlign={{ base: "center", md: "right" }} // Center on mobile
  >
    <Select
      value={viewMode}
      onChange={(e) => setViewMode(e.target.value as "slots" | "epochs")}
      width={{ base: "100%", md: "150px" }} // Full width on mobile
      maxWidth={{ base: "200px", md: "150px" }} // Constrain width
      bg={useColorModeValue("white", "gray.700")}
      color={useColorModeValue("black", "white")}
      mx="auto" // Center on mobile
    >
      <option value="epochs">Epoch</option>
      <option value="slots">Slot</option>
    </Select>
  </Box>
</Flex>

          {/* Network Toggle Buttons */}
          <HStack spacing={4} justify="center" mb={4}>
            <Button
              colorScheme={network === "holesky" ? "blue" : "gray"}
              onClick={() => handleNetworkChange("holesky")}
            >
              Holesky
            </Button>
            <Button
              colorScheme={network === "sepolia" ? "blue" : "gray"}
              onClick={() => handleNetworkChange("sepolia")}
            >
              Sepolia
            </Button>
            <Button
              colorScheme={network === "mainnet" ? "blue" : "gray"}
              onClick={() => handleNetworkChange("mainnet")}
            >
              Mainnet
            </Button>
          </HStack>


          {(loading) ? (
            <Spinner size="xl" color="blue.500" />
          ) : (isUpgradeLive || slotsRemaining<=0) ? (
            <Text
              fontSize="2xl"
              fontWeight="bold"
              color={useColorModeValue("black","white")}
              animation={`${celebrateAnimation} 1s infinite`}
            >
              🎉 🎉 The upgrade is now live on the Ethereum {networks[network].name} testnet! 🎉 🎉
            </Text>
          ) : (
            <>
              {/* Progress Visualization */}
              <Box
                as={motion.div}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                bg="gray.700"
                color="white"
                borderRadius="md"
                p={4}
                mb={4}
                fontSize="xs"
                fontWeight="normal"
              >
                {viewMode === "slots" ? renderSlotsView() : renderEpochsView()}
              </Box>

              {/* Additional Info */}
              <Text fontSize="sm" color={useColorModeValue("black","white")} mb={4}>
                Refreshes in {timer} seconds
              </Text>
              <Text fontSize="sm" color={useColorModeValue("black","white")}>
                {viewMode === "slots" 
                  ? "* The slot numbers are updated every 12 seconds."
                  : "* The epoch numbers are updated every 6.4 minutes (1 epoch)."}
              </Text>
            </>
          )}
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
    </>
  );
};

export default SlotCountdown;