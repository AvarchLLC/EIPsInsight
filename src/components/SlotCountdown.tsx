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
  holesky: {
    beaconApi: "https://ethereum-holesky-beacon-api.publicnode.com",
    rpc: "https://ethereum-holesky-rpc.publicnode.com",
    target: 5283840,        // Fusaka activation slot on Holesky (testnet)
    targetepoch: Math.floor(5283840 / 32),
    name: "Holesky",
  },
  sepolia: {
    beaconApi: "https://ethereum-sepolia-beacon-api.publicnode.com",
    rpc: "https://ethereum-sepolia-rpc.publicnode.com",
    target: 8724480,        // Fusaka activation slot on Sepolia (testnet)
    targetepoch: Math.floor(8724480 / 32),
    name: "Sepolia",
  },
  // If you also want Hoodi testnet:
  hoodi: {
    beaconApi: "<ho-beacon-api>",
    rpc: "<ho-rpc>",
    target: 1622016,        // Fusaka activation slot on Hoodi (testnet)
    targetepoch: Math.floor(1622016 / 32),
    name: "Hoodi",
  },
  mainnet: {
    beaconApi: "https://ethereum-beacon-api.publicnode.com",
    rpc: "https://ethereum-rpc.publicnode.com",
    target: Number.MAX_SAFE_INTEGER,  
    targetepoch: Number.MAX_SAFE_INTEGER,
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
    <VStack spacing={4}>
      {/* Simplified Progress Bar */}
      <Box width="100%">
        <Flex justify="space-between" mb={2}>
          <Text fontSize="xs" color={useColorModeValue("gray.500", "gray.400")}>
            Current Slot
          </Text>
          {networks[network].target !== Number.MAX_SAFE_INTEGER && (
            <Text fontSize="xs" color={useColorModeValue("gray.500", "gray.400")}>
              Target Slot
            </Text>
          )}
        </Flex>
        
        <Box
          bg={useColorModeValue("gray.200", "gray.600")}
          borderRadius="full"
          height="6px"
          position="relative"
        >
          {networks[network].target !== Number.MAX_SAFE_INTEGER && (
            <Box
              bg="linear-gradient(90deg, #3182CE, #00CED1)"
              height="100%"
              borderRadius="full"
              width={`${Math.min(95, (currentSlot / networks[network].target) * 100)}%`}
              transition="width 0.5s ease"
            />
          )}
        </Box>
      </Box>

      {/* Current Epoch Slots - Simplified Grid */}
      <Box>
        <Text fontSize="sm" fontWeight="semibold" mb={3} textAlign="center" color={useColorModeValue("gray.700", "gray.300")}>
          Current Epoch {currentEpoch} Progress
        </Text>
        
        <Flex wrap="wrap" justify="center" gap={1}>
          {slotsInEpoch.slice(0, 16).map((slot) => {
            const isProcessed = slot < currentSlot;
            const isCurrent = slot === currentSlot;
            
            return (
              <Tooltip key={slot} label={`Slot ${slot} ${isCurrent ? '(Current)' : isProcessed ? '(Processed)' : '(Pending)'}`}>
                <Box
                  w="24px"
                  h="24px"
                  borderRadius="md"
                  bg={
                    isCurrent
                      ? useColorModeValue("green.400", "green.500")
                      : isProcessed
                      ? useColorModeValue("blue.400", "blue.500")
                      : useColorModeValue("gray.300", "gray.600")
                  }
                  transition="all 0.2s"
                  _hover={{ transform: "scale(1.1)" }}
                  position="relative"
                  sx={isCurrent ? {
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      top: '-2px',
                      left: '-2px',
                      right: '-2px',
                      bottom: '-2px',
                      borderRadius: 'md',
                      border: '2px solid',
                      borderColor: 'green.300',
                      animation: 'pulse 2s infinite'
                    }
                  } : {}}
                />
              </Tooltip>
            );
          })}
        </Flex>
        
        <Flex wrap="wrap" justify="center" gap={1} mt={2}>
          {slotsInEpoch.slice(16).map((slot) => {
            const isProcessed = slot < currentSlot;
            const isCurrent = slot === currentSlot;
            
            return (
              <Tooltip key={slot} label={`Slot ${slot} ${isCurrent ? '(Current)' : isProcessed ? '(Processed)' : '(Pending)'}`}>
                <Box
                  w="24px"
                  h="24px"
                  borderRadius="md"
                  bg={
                    isCurrent
                      ? useColorModeValue("green.400", "green.500")
                      : isProcessed
                      ? useColorModeValue("blue.400", "blue.500")
                      : useColorModeValue("gray.300", "gray.600")
                  }
                  transition="all 0.2s"
                  _hover={{ transform: "scale(1.1)" }}
                  position="relative"
                  sx={isCurrent ? {
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      top: '-2px',
                      left: '-2px',
                      right: '-2px',
                      bottom: '-2px',
                      borderRadius: 'md',
                      border: '2px solid',
                      borderColor: 'green.300',
                      animation: 'pulse 2s infinite'
                    }
                  } : {}}
                />
              </Tooltip>
            );
          })}
        </Flex>
      </Box>

      {/* Legend */}
      <HStack spacing={4} justify="center" fontSize="xs">
        <HStack>
          <Box w="12px" h="12px" bg={useColorModeValue("blue.400", "blue.500")} borderRadius="sm" />
          <Text color={useColorModeValue("gray.600", "gray.400")}>Processed</Text>
        </HStack>
        <HStack>
          <Box w="12px" h="12px" bg={useColorModeValue("green.400", "green.500")} borderRadius="sm" />
          <Text color={useColorModeValue("gray.600", "gray.400")}>Current</Text>
        </HStack>
        <HStack>
          <Box w="12px" h="12px" bg={useColorModeValue("gray.300", "gray.600")} borderRadius="sm" />
          <Text color={useColorModeValue("gray.600", "gray.400")}>Pending</Text>
        </HStack>
      </HStack>
    </VStack>
  );

  const renderEpochsView = () => (
    <VStack spacing={4}>
      {/* Epoch Progress Bar */}
      <Box width="100%">
        <Flex justify="space-between" mb={2}>
          <Text fontSize="xs" color={useColorModeValue("gray.500", "gray.400")}>
            Current Epoch
          </Text>
          {networks[network].targetepoch !== Number.MAX_SAFE_INTEGER && (
            <Text fontSize="xs" color={useColorModeValue("gray.500", "gray.400")}>
              Target Epoch
            </Text>
          )}
        </Flex>
        
        <Box
          bg={useColorModeValue("gray.200", "gray.600")}
          borderRadius="full"
          height="6px"
          position="relative"
        >
          {networks[network].targetepoch !== Number.MAX_SAFE_INTEGER && (
            <Box
              bg="linear-gradient(90deg, #3182CE, #00CED1)"
              height="100%"
              borderRadius="full"
              width={`${Math.min(95, (currentEpoch / networks[network].targetepoch) * 100)}%`}
              transition="width 0.5s ease"
            />
          )}
        </Box>
      </Box>

      {/* Epoch Timeline */}
      <Box>
        <Text fontSize="sm" fontWeight="semibold" mb={3} textAlign="center" color={useColorModeValue("gray.700", "gray.300")}>
          Epoch Timeline
        </Text>
        
        <Flex justify="center" align="center" gap={3} wrap="wrap">
          {/* Current Epoch */}
          <Tooltip label={`Current Epoch: ${currentEpoch}`}>
            <Box
              w="50px"
              h="40px"
              borderRadius="lg"
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              bg={useColorModeValue("green.400", "green.500")}
              color="white"
              fontSize="xs"
              fontWeight="bold"
              position="relative"
              sx={{
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  top: '-2px',
                  left: '-2px',
                  right: '-2px',
                  bottom: '-2px',
                  borderRadius: 'lg',
                  border: '2px solid',
                  borderColor: 'green.300',
                  animation: 'pulse 2s infinite'
                }
              }}
            >
              <Text fontSize="9px">NOW</Text>
              <Text fontSize="sm">{currentEpoch}</Text>
            </Box>
          </Tooltip>

          {/* Arrow */}
          <Text color={useColorModeValue("gray.400", "gray.500")} fontSize="lg">→</Text>

          {/* Next few epochs */}
          {Array.from({ length: 5 }, (_, i) => currentEpoch + i + 1)?.map((epoch) => {
            const isTarget = epoch === networks[network].targetepoch;

            return (
              <Tooltip
                key={epoch}
                label={isTarget ? `FUSAKA Target Epoch: ${epoch}` : `Future Epoch: ${epoch}`}
              >
                <Box
                  w={isTarget ? "60px" : "50px"}
                  h="40px"
                  borderRadius="lg"
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                  bg={
                    isTarget
                      ? "linear-gradient(135deg, #FFD700, #FFA500)"
                      : useColorModeValue("blue.400", "blue.500")
                  }
                  color={isTarget ? "black" : "white"}
                  fontSize="xs"
                  fontWeight="bold"
                  transition="all 0.2s"
                  _hover={{ transform: "scale(1.05)" }}
                  sx={isTarget ? {
                    boxShadow: "0 0 15px rgba(255, 215, 0, 0.6)",
                    animation: "glow 2s infinite alternate"
                  } : {}}
                >
                  {isTarget ? (
                    <>
                      <Text fontSize="9px">TARGET</Text>
                      <Text fontSize="sm">{epoch}</Text>
                    </>
                  ) : (
                    <Text fontSize="sm">{epoch}</Text>
                  )}
                </Box>
              </Tooltip>
            );
          })}
        </Flex>
      </Box>

      {/* Legend */}
      <HStack spacing={4} justify="center" fontSize="xs">
        <HStack>
          <Box w="12px" h="12px" bg={useColorModeValue("green.400", "green.500")} borderRadius="sm" />
          <Text color={useColorModeValue("gray.600", "gray.400")}>Current</Text>
        </HStack>
        <HStack>
          <Box w="12px" h="12px" bg={useColorModeValue("blue.400", "blue.500")} borderRadius="sm" />
          <Text color={useColorModeValue("gray.600", "gray.400")}>Future</Text>
        </HStack>
        <HStack>
          <Box w="12px" h="12px" bg="linear-gradient(135deg, #FFD700, #FFA500)" borderRadius="sm" />
          <Text color={useColorModeValue("gray.600", "gray.400")}>Target</Text>
        </HStack>
      </HStack>
    </VStack>
  );

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Box
          bg={useColorModeValue("white", "gray.800")}
          borderRadius="xl"
          border="1px solid"
          borderColor={useColorModeValue("gray.200", "gray.700")}
          p={6}
          position="relative"
          overflow="hidden"
        >
          {/* Header Section */}
          <VStack spacing={4} mb={6}>
            <HStack justify="space-between" width="100%" align="center">
              <Text
                fontSize={{ base: "lg", md: "xl" }}
                fontWeight="bold"
                color="#00CED1"
                textAlign="left"
              >
                🚀 FUSAKA Upgrade Countdown
              </Text>
              
              <HStack spacing={2}>
                <Text fontSize="sm" color={useColorModeValue("gray.600", "gray.400")}>
                  View:
                </Text>
                <Select
                  value={viewMode}
                  onChange={(e) => setViewMode(e.target.value as "slots" | "epochs")}
                  size="sm"
                  width="100px"
                  bg={useColorModeValue("white", "gray.700")}
                  borderColor={useColorModeValue("gray.300", "gray.600")}
                >
                  <option value="epochs">Epochs</option>
                  <option value="slots">Slots</option>
                </Select>
              </HStack>
            </HStack>
            
            <Text
              fontSize="sm"
              color={useColorModeValue("gray.600", "gray.400")}
              textAlign="center"
            >
              Track progress to Ethereum's next upgrade on {networks[network].name}
            </Text>
          </VStack>

          {/* Network Selection */}
          <Box
            bg={useColorModeValue("gray.50", "gray.700")}
            borderRadius="lg"
            p={4}
            mb={6}
          >
            <Text
              fontSize="sm"
              fontWeight="semibold"
              color={useColorModeValue("gray.700", "gray.300")}
              mb={3}
              textAlign="center"
            >
              Select Network
            </Text>
            <HStack spacing={2} justify="center" wrap="wrap">
              <Button
                size="sm"
                variant={network === "holesky" ? "solid" : "outline"}
                colorScheme="blue"
                onClick={() => handleNetworkChange("holesky")}
                minW="80px"
              >
                Holesky
              </Button>
              <Button
                size="sm"
                variant={network === "sepolia" ? "solid" : "outline"}
                colorScheme="blue"
                onClick={() => handleNetworkChange("sepolia")}
                minW="80px"
              >
                Sepolia
              </Button>
              <Button
                size="sm"
                variant={network === "mainnet" ? "solid" : "outline"}
                colorScheme="blue"
                onClick={() => handleNetworkChange("mainnet")}
                minW="80px"
              >
                Mainnet
              </Button>
            </HStack>
          </Box>


          {loading ? (
            <Box textAlign="center" py={8}>
              <Spinner size="lg" color="blue.500" />
              <Text mt={4} color={useColorModeValue("gray.600", "gray.400")}>
                Loading network data...
              </Text>
            </Box>
          ) : (isUpgradeLive || slotsRemaining <= 0) ? (
            <Box
              bg={useColorModeValue("green.50", "green.900")}
              borderRadius="lg"
              border="2px solid"
              borderColor="green.400"
              p={6}
              textAlign="center"
            >
              <Text
                fontSize="xl"
                fontWeight="bold"
                color="green.500"
              >
                🎉 FUSAKA is live on {networks[network].name}! 🎉
              </Text>
            </Box>
          ) : (
            <VStack spacing={6}>
              {/* Countdown Stats */}
              {countdown && networks[network].target !== Number.MAX_SAFE_INTEGER && (
                <Box
                  bg={useColorModeValue("blue.50", "blue.900")}
                  borderRadius="lg"
                  border="1px solid"
                  borderColor={useColorModeValue("blue.200", "blue.700")}
                  p={4}
                  textAlign="center"
                  width="100%"
                >
                  <Text
                    fontSize="xs"
                    color={useColorModeValue("blue.600", "blue.300")}
                    mb={2}
                    fontWeight="semibold"
                    textTransform="uppercase"
                    letterSpacing="wide"
                  >
                    Time Remaining
                  </Text>
                  <Text
                    fontSize="2xl"
                    fontWeight="bold"
                    color={useColorModeValue("blue.700", "blue.400")}
                    fontFamily="mono"
                  >
                    {countdown}
                  </Text>
                  <Text
                    fontSize="sm"
                    color={useColorModeValue("blue.600", "blue.300")}
                    mt={2}
                  >
                    {viewMode === "slots" 
                      ? `${slotsRemaining.toLocaleString()} slots remaining`
                      : `${epochsRemaining.toLocaleString()} epochs remaining`}
                  </Text>
                </Box>
              )}

              {/* Current Status */}
              <Box
                bg={useColorModeValue("gray.50", "gray.700")}
                borderRadius="lg"
                p={4}
                width="100%"
                textAlign="center"
              >
                <Text
                  fontSize="sm"
                  color={useColorModeValue("gray.600", "gray.400")}
                  mb={2}
                >
                  Current Progress
                </Text>
                <Text
                  fontSize="lg"
                  fontWeight="semibold"
                  color={useColorModeValue("gray.800", "gray.200")}
                >
                  {viewMode === "slots" 
                    ? `Slot ${currentSlot.toLocaleString()} • Epoch ${currentEpoch.toLocaleString()}`
                    : `Epoch ${currentEpoch.toLocaleString()} • Slot ${currentSlot.toLocaleString()}`}
                </Text>
              </Box>

              {/* Progress Visualization */}
              <Box
                bg={useColorModeValue("white", "gray.800")}
                borderRadius="lg"
                border="1px solid"
                borderColor={useColorModeValue("gray.200", "gray.600")}
                p={4}
                width="100%"
              >
                {viewMode === "slots" ? renderSlotsView() : renderEpochsView()}
              </Box>

              {/* Footer Info */}
              <Box
                textAlign="center"
                color={useColorModeValue("gray.500", "gray.400")}
              >
                <Text fontSize="xs" mb={1}>
                  🔄 Updates in {timer} seconds
                </Text>
                <Text fontSize="xs">
                  {viewMode === "slots" 
                    ? "Slots update every 12 seconds"
                    : "Epochs update every 6.4 minutes"}
                </Text>
              </Box>
            </VStack>
          )}
        </Box>
      </motion.div>

      {/* Animations */}
      <style>
        {`
          @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.7; }
            100% { opacity: 1; }
          }

          @keyframes glow {
            0% { 
              box-shadow: 0 0 15px rgba(255, 215, 0, 0.6);
            }
            50% { 
              box-shadow: 0 0 25px rgba(255, 215, 0, 0.9);
            }
            100% { 
              box-shadow: 0 0 15px rgba(255, 215, 0, 0.6);
            }
          }

          @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }
        `}
      </style>
    </>
  );
};

export default SlotCountdown;