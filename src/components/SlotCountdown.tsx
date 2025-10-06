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
    <VStack spacing={3}>
      {/* Progress Bar */}
      <Box width="100%">
        <Flex justify="space-between" mb={2} fontSize="xs" opacity={0.8}>
          <Text>Current Slot: {currentSlot.toLocaleString()}</Text>
          {networks[network].target !== Number.MAX_SAFE_INTEGER && (
            <Text>Target: {networks[network].target.toLocaleString()}</Text>
          )}
        </Flex>
        
        <Box bg="gray.600" borderRadius="full" height="4px" position="relative">
          {networks[network].target !== Number.MAX_SAFE_INTEGER && (
            <Box
              bg="linear-gradient(90deg, #4FD1C7, #81E6D9)"
              height="100%"
              borderRadius="full"
              width={`${Math.min(95, (currentSlot / networks[network].target) * 100)}%`}
              transition="width 0.5s ease"
            />
          )}
        </Box>
      </Box>

      {/* Compact Slot Grid */}
      <Box>
        <Text fontSize="xs" fontWeight="medium" mb={2} textAlign="center" opacity={0.9}>
          Current Epoch Slots ({currentEpoch})
        </Text>
        
        <Flex wrap="wrap" gap={1} justify="center" maxW="600px">
          {slotsInEpoch.slice(0, 16).map((slot) => {
            const isProcessed = slot < currentSlot;
            const isCurrent = slot === currentSlot;

            return (
              <Tooltip
                key={slot}
                label={`Slot ${slot} ${isCurrent ? '(Current)' : isProcessed ? '(Processed)' : '(Future)'}`}
              >
                <Box
                  w="32px"
                  h="32px"
                  borderRadius="md"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  bg={
                    isCurrent
                      ? "green.400"
                      : isProcessed
                      ? "blue.500"
                      : "gray.500"
                  }
                  color="white"
                  fontSize="9px"
                  fontWeight="bold"
                  transition="all 0.2s"
                  _hover={{ transform: "scale(1.1)" }}
                  animation={isCurrent ? "pulse 2s infinite" : "none"}
                  position="relative"
                >
                  {slot % 32}
                  {isCurrent && (
                    <Box
                      position="absolute"
                      top="-1px"
                      right="-1px"
                      w="8px"
                      h="8px"
                      borderRadius="full"
                      bg="yellow.400"
                    />
                  )}
                </Box>
              </Tooltip>
            );
          })}
          
          {/* Arrow and Target */}
          <Flex align="center" mx={3}>
            <Text color="gray.300" fontSize="lg">→</Text>
          </Flex>
          
          <Tooltip label={`FUSAKA Target: Slot ${networks[network].target}`}>
            <Box
              w="40px"
              h="32px"
              borderRadius="md"
              display="flex"
              alignItems="center"
              justifyContent="center"
              bg="linear-gradient(135deg, #FFD700, #FFA500)"
              color="black"
              fontSize="8px"
              fontWeight="bold"
              transition="all 0.2s"
              _hover={{ transform: "scale(1.1)" }}
              boxShadow="0 0 10px rgba(255, 215, 0, 0.5)"
            >
              FUSAKA
            </Box>
          </Tooltip>
        </Flex>
        
        {/* Legend */}
        <HStack spacing={4} justify="center" mt={3} fontSize="xs">
          <HStack>
            <Box w="12px" h="12px" bg="blue.500" borderRadius="sm" />
            <Text>Processed</Text>
          </HStack>
          <HStack>
            <Box w="12px" h="12px" bg="green.400" borderRadius="sm" />
            <Text>Current</Text>
          </HStack>
          <HStack>
            <Box w="12px" h="12px" bg="gray.500" borderRadius="sm" />
            <Text>Future</Text>
          </HStack>
          <HStack>
            <Box w="12px" h="12px" bg="linear-gradient(135deg, #FFD700, #FFA500)" borderRadius="sm" />
            <Text>Target</Text>
          </HStack>
        </HStack>
      </Box>
    </VStack>
  );

  const renderEpochsView = () => (
    <VStack spacing={3}>
      {/* Progress Bar */}
      <Box width="100%">
        <Flex justify="space-between" mb={2} fontSize="xs" opacity={0.8}>
          <Text>Current Epoch: {currentEpoch.toLocaleString()}</Text>
          {networks[network].targetepoch !== Number.MAX_SAFE_INTEGER && (
            <Text>Target: {networks[network].targetepoch.toLocaleString()}</Text>
          )}
        </Flex>
        
        <Box bg="gray.600" borderRadius="full" height="4px" position="relative">
          {networks[network].targetepoch !== Number.MAX_SAFE_INTEGER && (
            <Box
              bg="linear-gradient(90deg, #4299E1, #63B3ED)"
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
        <Text fontSize="xs" fontWeight="medium" mb={2} textAlign="center" opacity={0.9}>
          Epoch Timeline
        </Text>
        
        <Flex justify="center" align="center" gap={2} wrap="wrap">
          {/* Current Epoch */}
          <Tooltip label={`Current Epoch: ${currentEpoch} (Slot: ${currentSlot})`}>
            <Box
              w="50px"
              h="36px"
              borderRadius="lg"
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              bg="green.400"
              color="white"
              fontSize="xs"
              fontWeight="bold"
              animation="pulse 2s infinite"
              position="relative"
            >
              <Text fontSize="8px">NOW</Text>
              <Text fontSize="sm">{currentEpoch}</Text>
              <Box
                position="absolute"
                top="-1px"
                right="-1px"
                w="8px"
                h="8px"
                borderRadius="full"
                bg="yellow.400"
              />
            </Box>
          </Tooltip>

          {/* Arrow */}
          <Text color="gray.300" fontSize="lg" mx={1}>→</Text>

          {/* Next few epochs */}
          {Array.from({ length: 4 }, (_, i) => currentEpoch + i + 1).map((epoch) => {
            const isTarget = epoch === networks[network].targetepoch;

            return (
              <Tooltip
                key={epoch}
                label={isTarget ? `FUSAKA Target Epoch: ${epoch}` : `Future Epoch: ${epoch}`}
              >
                <Box
                  w={isTarget ? "60px" : "50px"}
                  h="36px"
                  borderRadius="lg"
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                  bg={
                    isTarget
                      ? "linear-gradient(135deg, #FFD700, #FFA500)"
                      : "blue.400"
                  }
                  color={isTarget ? "black" : "white"}
                  fontSize="xs"
                  fontWeight="bold"
                  transition="all 0.2s"
                  _hover={{ transform: "scale(1.05)" }}
                  boxShadow={isTarget ? "0 0 15px rgba(255, 215, 0, 0.6)" : "none"}
                >
                  {isTarget ? (
                    <>
                      <Text fontSize="8px">FUSAKA</Text>
                      <Text fontSize="sm">{epoch}</Text>
                    </>
                  ) : (
                    <Text fontSize="sm">{epoch}</Text>
                  )}
                </Box>
              </Tooltip>
            );
          })}

          {/* If target is far away, show dots and target */}
          {networks[network].targetepoch !== Number.MAX_SAFE_INTEGER && 
           networks[network].targetepoch > currentEpoch + 5 && (
            <>
              <Text color="gray.400" mx={1}>...</Text>
              
              <Tooltip label={`FUSAKA Target Epoch: ${networks[network].targetepoch}`}>
                <Box
                  w="60px"
                  h="36px"
                  borderRadius="lg"
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                  bg="linear-gradient(135deg, #FFD700, #FFA500)"
                  color="black"
                  fontSize="xs"
                  fontWeight="bold"
                  transition="all 0.2s"
                  _hover={{ transform: "scale(1.05)" }}
                  boxShadow="0 0 15px rgba(255, 215, 0, 0.6)"
                >
                  <Text fontSize="8px">FUSAKA</Text>
                  <Text fontSize="sm">{networks[network].targetepoch}</Text>
                </Box>
              </Tooltip>
            </>
          )}
        </Flex>
        
        {/* Legend */}
        <HStack spacing={4} justify="center" mt={3} fontSize="xs">
          <HStack>
            <Box w="12px" h="12px" bg="green.400" borderRadius="sm" />
            <Text>Current</Text>
          </HStack>
          <HStack>
            <Box w="12px" h="12px" bg="blue.400" borderRadius="sm" />
            <Text>Future</Text>
          </HStack>
          <HStack>
            <Box w="12px" h="12px" bg="linear-gradient(135deg, #FFD700, #FFA500)" borderRadius="sm" />
            <Text>Target</Text>
          </HStack>
        </HStack>
      </Box>
    </VStack>
  );

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Box
          maxWidth="1200px"
          mx="auto"
          mt={4}
          borderRadius="xl"
          bg={useColorModeValue("white", "gray.800")}
          border="1px solid"
          borderColor={useColorModeValue("gray.200", "gray.600")}
          overflow="hidden"
        >
          {/* Header Section */}
          <Box
            bg={useColorModeValue("blue.50", "blue.900")}
            p={4}
            borderBottom="1px solid"
            borderColor={useColorModeValue("gray.200", "gray.600")}
          >
            <Flex justify="space-between" align="center" wrap="wrap" gap={3}>
              <VStack align="start" spacing={1}>
                <Text
                  fontSize="xl"
                  fontWeight="bold"
                  color={useColorModeValue("blue.800", "blue.200")}
                >
                  🚀 FUSAKA Upgrade Countdown
                </Text>
                <Text
                  fontSize="sm"
                  color={useColorModeValue("gray.600", "gray.300")}
                >
                  Real-time tracking for Ethereum's next major upgrade
                </Text>
              </VStack>
              
              <HStack spacing={2}>
                <Text fontSize="xs" color={useColorModeValue("gray.500", "gray.400")}>
                  View:
                </Text>
                <Select
                  value={viewMode}
                  onChange={(e) => setViewMode(e.target.value as "slots" | "epochs")}
                  size="sm"
                  width="100px"
                  bg={useColorModeValue("white", "gray.700")}
                  borderColor={useColorModeValue("gray.300", "gray.500")}
                >
                  <option value="epochs">Epochs</option>
                  <option value="slots">Slots</option>
                </Select>
              </HStack>
            </Flex>
          </Box>

          {/* Network Selection & Stats */}
          <Box p={4} bg={useColorModeValue("gray.50", "gray.750")}>
            <Flex justify="space-between" align="center" wrap="wrap" gap={4}>
              {/* Network Buttons */}
              <HStack spacing={2}>
                <Text fontSize="sm" fontWeight="medium" color={useColorModeValue("gray.700", "gray.300")}>
                  Network:
                </Text>
                {Object.entries(networks).map(([key, config]) => (
                  <Button
                    key={key}
                    size="sm"
                    variant={network === key ? "solid" : "outline"}
                    colorScheme={network === key ? "blue" : "gray"}
                    onClick={() => handleNetworkChange(key as keyof typeof networks)}
                    minW="80px"
                  >
                    {config.name}
                  </Button>
                ))}
              </HStack>

              {/* Current Stats */}
              <HStack spacing={4} fontSize="sm">
                <Box textAlign="center">
                  <Text fontSize="xs" color={useColorModeValue("gray.500", "gray.400")}>
                    Current {viewMode === "slots" ? "Slot" : "Epoch"}
                  </Text>
                  <Text fontWeight="bold" color={useColorModeValue("blue.600", "blue.300")}>
                    {viewMode === "slots" ? currentSlot.toLocaleString() : currentEpoch.toLocaleString()}
                  </Text>
                </Box>
                
                <Box textAlign="center">
                  <Text fontSize="xs" color={useColorModeValue("gray.500", "gray.400")}>
                    Block Number
                  </Text>
                  <Text fontWeight="bold" color={useColorModeValue("green.600", "green.300")}>
                    {currentBlock.toLocaleString()}
                  </Text>
                </Box>
                
                <Box textAlign="center">
                  <Text fontSize="xs" color={useColorModeValue("gray.500", "gray.400")}>
                    Next Update
                  </Text>
                  <Text fontWeight="bold" color={useColorModeValue("orange.600", "orange.300")}>
                    {timer}s
                  </Text>
                </Box>
              </HStack>
            </Flex>
          </Box>


          {/* Main Content */}
          <Box p={6}>
            {loading ? (
              <Flex justify="center" align="center" minH="200px">
                <VStack spacing={3}>
                  <Spinner size="xl" color="blue.500" />
                  <Text color={useColorModeValue("gray.600", "gray.400")}>
                    Loading {networks[network].name} data...
                  </Text>
                </VStack>
              </Flex>
            ) : (isUpgradeLive || slotsRemaining <= 0) ? (
              <Box
                textAlign="center"
                p={8}
                bg={useColorModeValue("green.50", "green.900")}
                borderRadius="lg"
                border="2px solid"
                borderColor={useColorModeValue("green.200", "green.600")}
              >
                <Text
                  fontSize="2xl"
                  fontWeight="bold"
                  color={useColorModeValue("green.800", "green.200")}
                  animation={`${celebrateAnimation} 1s infinite`}
                  mb={2}
                >
                  🎉 FUSAKA is Live! 🎉
                </Text>
                <Text fontSize="lg" color={useColorModeValue("green.600", "green.300")}>
                  The upgrade is now active on {networks[network].name}
                </Text>
              </Box>
            ) : (
              <VStack spacing={6}>
                {/* Countdown Display */}
                {networks[network].target !== Number.MAX_SAFE_INTEGER && (
                  <Box
                    textAlign="center"
                    p={4}
                    bg={useColorModeValue("orange.50", "orange.900")}
                    borderRadius="lg"
                    border="1px solid"
                    borderColor={useColorModeValue("orange.200", "orange.600")}
                    width="100%"
                  >
                    <Text fontSize="sm" color={useColorModeValue("orange.600", "orange.300")} mb={2}>
                      Time until FUSAKA activation:
                    </Text>
                    <Text fontSize="2xl" fontWeight="bold" color={useColorModeValue("orange.800", "orange.200")}>
                      {countdown || "Calculating..."}
                    </Text>
                    <Text fontSize="sm" color={useColorModeValue("gray.600", "gray.400")} mt={1}>
                      {viewMode === "slots" 
                        ? `${slotsRemaining.toLocaleString()} slots remaining` 
                        : `${epochsRemaining.toLocaleString()} epochs remaining`}
                    </Text>
                  </Box>
                )}

                {/* Progress Visualization */}
                <Box
                  width="100%"
                  bg={useColorModeValue("gray.800", "gray.700")}
                  borderRadius="lg"
                  p={4}
                  color="white"
                >
                  <Flex justify="space-between" align="center" mb={3}>
                    <Text fontSize="sm" fontWeight="medium">
                      {viewMode === "slots" ? "Slot Progress" : "Epoch Progress"} 
                      <Text as="span" ml={2} fontSize="xs" opacity={0.8}>
                        ({networks[network].name})
                      </Text>
                    </Text>
                    <Text fontSize="xs" opacity={0.7}>
                      Updates every {viewMode === "slots" ? "12 seconds" : "6.4 minutes"}
                    </Text>
                  </Flex>
                  
                  {viewMode === "slots" ? renderSlotsView() : renderEpochsView()}
                </Box>

                {/* Info Cards */}
                <Flex gap={4} wrap="wrap" width="100%" justify="center">
                  <Box
                    bg={useColorModeValue("blue.50", "blue.900")}
                    p={3}
                    borderRadius="md"
                    textAlign="center"
                    minW="120px"
                  >
                    <Text fontSize="xs" color={useColorModeValue("blue.600", "blue.300")}>
                      Current Position
                    </Text>
                    <Text fontSize="lg" fontWeight="bold" color={useColorModeValue("blue.800", "blue.200")}>
                      {viewMode === "slots" ? currentSlot : currentEpoch}
                    </Text>
                  </Box>
                  
                  <Box
                    bg={useColorModeValue("yellow.50", "yellow.900")}
                    p={3}
                    borderRadius="md"
                    textAlign="center"
                    minW="120px"
                  >
                    <Text fontSize="xs" color={useColorModeValue("yellow.600", "yellow.300")}>
                      Target Position
                    </Text>
                    <Text fontSize="lg" fontWeight="bold" color={useColorModeValue("yellow.800", "yellow.200")}>
                      {networks[network].target !== Number.MAX_SAFE_INTEGER 
                        ? (viewMode === "slots" ? networks[network].target : networks[network].targetepoch)
                        : "TBA"}
                    </Text>
                  </Box>
                  
                  <Box
                    bg={useColorModeValue("purple.50", "purple.900")}
                    p={3}
                    borderRadius="md"
                    textAlign="center"
                    minW="120px"
                  >
                    <Text fontSize="xs" color={useColorModeValue("purple.600", "purple.300")}>
                      Progress
                    </Text>
                    <Text fontSize="lg" fontWeight="bold" color={useColorModeValue("purple.800", "purple.200")}>
                      {networks[network].target !== Number.MAX_SAFE_INTEGER
                        ? `${((viewMode === "slots" ? currentSlot / networks[network].target : currentEpoch / networks[network].targetepoch) * 100).toFixed(1)}%`
                        : "0%"}
                    </Text>
                  </Box>
                </Flex>
              </VStack>
            )}
          </Box>
        </Box>
      </motion.div>

      {/* Animations */}
      <style>
        {`
          @keyframes pulse {
            0% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.8; transform: scale(1.02); }
            100% { opacity: 1; transform: scale(1); }
          }

          @keyframes glow {
            0% { box-shadow: 0 0 5px rgba(255, 215, 0, 0.5); }
            50% { box-shadow: 0 0 20px rgba(255, 215, 0, 0.8); }
            100% { box-shadow: 0 0 5px rgba(255, 215, 0, 0.5); }
          }
        `}
      </style>
    </>
  );
};

export default SlotCountdown;