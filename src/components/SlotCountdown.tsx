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
  Badge,
  Alert,
  AlertIcon,
  Card,
  CardBody,
  CardHeader,
  Icon,
} from "@chakra-ui/react";
import { keyframes } from '@chakra-ui/system';
import { motion } from "framer-motion";
import { useColorModeValue } from "@chakra-ui/react";
import { FaRocket, FaNetworkWired, FaClock, FaInfoCircle } from 'react-icons/fa';

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

// FUSAKA upgrade information
const FUSAKA_INFO = {
  title: "FUSAKA Network Upgrade",
  description: "Ethereum's next major upgrade focusing on enhanced blob throughput and network efficiency",
  features: [
    "📈 Increased blob capacity for Layer 2 scaling",
    "⚡ Improved data availability for rollups", 
    "🔧 Network optimization and efficiency improvements",
    "🛡️ Enhanced security and validator performance"
  ],
  schedule: {
    holesky: "October 1, 2025 - 08:48 UTC",
    sepolia: "October 14, 2025 - 07:36 UTC", 
    hoodi: "October 28, 2025 - 18:53 UTC",
    mainnet: "To be announced after testnet completion"
  }
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
        {firstRowSlots?.map((slot) => {
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
        {secondRowSlots?.map((slot) => {
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
          FUSAKA
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
      {Array.from({ length: 17 }, (_, i) => currentEpoch + i + 1)?.map((epoch) => {
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
        FUSAKA
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
        {/* Info Header Card */}
        <Card maxWidth="1370px" mx="auto" mb={4} bg={useColorModeValue("blue.50", "blue.900")} borderColor={useColorModeValue("blue.200", "blue.600")} border="2px solid">
          <CardHeader pb={2}>
            <HStack spacing={3} justify="center" align="center">
              <Icon as={FaRocket} color={useColorModeValue("blue.600", "blue.300")} boxSize={6} />
              <VStack spacing={0} align="center">
                <Text fontSize="xl" fontWeight="bold" color={useColorModeValue("blue.800", "blue.200")}>
                  {FUSAKA_INFO.title}
                </Text>
                <Text fontSize="sm" color={useColorModeValue("blue.600", "blue.300")}>
                  {FUSAKA_INFO.description}
                </Text>
              </VStack>
              <Icon as={FaRocket} color={useColorModeValue("blue.600", "blue.300")} boxSize={6} />
            </HStack>
          </CardHeader>
          <CardBody pt={0}>
            <VStack spacing={3}>
              {/* Features */}
              <HStack spacing={4} wrap="wrap" justify="center">
                {FUSAKA_INFO.features.map((feature, index) => (
                  <Badge 
                    key={index} 
                    colorScheme="blue" 
                    variant="subtle" 
                    p={2} 
                    borderRadius="md"
                    fontSize="xs"
                  >
                    {feature}
                  </Badge>
                ))}
              </HStack>
              
              {/* Schedule Info */}
              <Alert status="info" borderRadius="md" bg={useColorModeValue("blue.100", "blue.800")}>
                <AlertIcon color={useColorModeValue("blue.600", "blue.300")} />
                <VStack align="start" spacing={1} fontSize="xs">
                  <Text fontWeight="bold" color={useColorModeValue("blue.800", "blue.200")}>
                    📅 Activation Schedule
                  </Text>
                  <HStack spacing={4} wrap="wrap">
                    <Text>🧪 Holesky: {FUSAKA_INFO.schedule.holesky}</Text>
                    <Text>🧪 Sepolia: {FUSAKA_INFO.schedule.sepolia}</Text>
                    <Text>🌐 Mainnet: {FUSAKA_INFO.schedule.mainnet}</Text>
                  </HStack>
                </VStack>
              </Alert>
            </VStack>
          </CardBody>
        </Card>

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
    <HStack justify="center" spacing={2}>
      <Icon as={FaNetworkWired} color={useColorModeValue("blue.600", "blue.300")} />
      <Text
        as={motion.div}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        fontSize={{ base: "xl", md: "2xl", lg: "2xl" }} // Smaller on mobile
        fontWeight="bold"
        color={useColorModeValue("black", "white")}
        whiteSpace="nowrap"
      >
        Live Countdown - {networks[network].name} Network
      </Text>
      <Badge 
        colorScheme={network === 'mainnet' ? 'gray' : 'green'} 
        variant="solid"
      >
        {network === 'mainnet' ? 'TBD' : 'TESTNET'}
      </Badge>
    </HStack>
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
          <VStack spacing={3} mb={6}>
            <HStack spacing={2} align="center">
              <Icon as={FaNetworkWired} color={useColorModeValue("gray.600", "gray.400")} />
              <Text fontSize="sm" fontWeight="semibold" color={useColorModeValue("gray.700", "gray.300")}>
                Select Network to Track
              </Text>
            </HStack>
            <HStack spacing={4} justify="center">
              <Button
                colorScheme={network === "holesky" ? "blue" : "gray"}
                onClick={() => handleNetworkChange("holesky")}
                leftIcon={<Text fontSize="xs">🧪</Text>}
                variant={network === "holesky" ? "solid" : "outline"}
                size="sm"
              >
                Holesky
                <Badge ml={2} colorScheme="orange" fontSize="9px">FINAL</Badge>
              </Button>
              <Button
                colorScheme={network === "sepolia" ? "blue" : "gray"}
                onClick={() => handleNetworkChange("sepolia")}
                leftIcon={<Text fontSize="xs">🧪</Text>}
                variant={network === "sepolia" ? "solid" : "outline"}
                size="sm"
              >
                Sepolia
              </Button>
              <Button
                colorScheme={network === "hoodi" ? "blue" : "gray"}
                onClick={() => handleNetworkChange("hoodi")}
                leftIcon={<Text fontSize="xs">🧪</Text>}
                variant={network === "hoodi" ? "solid" : "outline"}
                size="sm"
              >
                Hoodi
              </Button>
              <Button
                colorScheme={network === "mainnet" ? "blue" : "gray"}
                onClick={() => handleNetworkChange("mainnet")}
                leftIcon={<Text fontSize="xs">🌐</Text>}
                variant={network === "mainnet" ? "solid" : "outline"}
                size="sm"
                isDisabled={true}
              >
                Mainnet
                <Badge ml={2} colorScheme="gray" fontSize="9px">TBD</Badge>
              </Button>
            </HStack>
          </VStack>


          {(loading) ? (
            <VStack spacing={4}>
              <Spinner size="xl" color="blue.500" />
              <Text color={useColorModeValue("gray.600", "gray.400")}>
                Loading {networks[network].name} network data...
              </Text>
            </VStack>
          ) : network === "mainnet" ? (
            <Card bg={useColorModeValue("gray.50", "gray.700")} border="2px solid" borderColor={useColorModeValue("gray.200", "gray.600")}>
              <CardBody textAlign="center" p={6}>
                <VStack spacing={3}>
                  <Icon as={FaInfoCircle} boxSize={8} color={useColorModeValue("gray.600", "gray.400")} />
                  <Text fontSize="xl" fontWeight="bold" color={useColorModeValue("gray.800", "gray.200")}>
                    Mainnet Date To Be Announced
                  </Text>
                  <Text fontSize="sm" color={useColorModeValue("gray.600", "gray.400")}>
                    The FUSAKA upgrade will be deployed to Ethereum Mainnet after successful testing and completion on all testnets. 
                    The activation date will be announced by the Ethereum Foundation.
                  </Text>
                  <Badge colorScheme="blue" variant="subtle" p={2}>
                    Follow testnet progress above to track readiness
                  </Badge>
                </VStack>
              </CardBody>
            </Card>
          ) : (isUpgradeLive || slotsRemaining<=0) ? (
            <Card bg="green.50" border="2px solid" borderColor="green.200">
              <CardBody textAlign="center" p={6}>
                <Text
                  fontSize="2xl"
                  fontWeight="bold"
                  color="green.700"
                  animation={`${celebrateAnimation} 1s infinite`}
                >
                  🎉 FUSAKA IS LIVE ON {networks[network].name.toUpperCase()}! 🎉
                </Text>
                <Text fontSize="md" color="green.600" mt={2}>
                  The upgrade is now active on the {networks[network].name} network
                </Text>
                <Badge colorScheme="green" mt={3} p={2}>
                  ✅ Successfully Activated
                </Badge>
              </CardBody>
            </Card>
          ) : (
            <>
              {/* Countdown Status */}
              <Card mb={4} bg={useColorModeValue("blue.50", "blue.900")} border="2px solid" borderColor={useColorModeValue("blue.200", "blue.600")}>
                <CardBody textAlign="center" p={4}>
                  <HStack justify="center" spacing={3} mb={2}>
                    <Icon as={FaClock} color={useColorModeValue("blue.600", "blue.300")} />
                    <Text fontSize="lg" fontWeight="bold" color={useColorModeValue("blue.800", "blue.200")}>
                      {countdown || "Calculating..."}
                    </Text>
                  </HStack>
                  <Text fontSize="sm" color={useColorModeValue("blue.600", "blue.300")}>
                    Until FUSAKA activation on {networks[network].name}
                  </Text>
                  <HStack justify="center" spacing={6} mt={3} fontSize="xs">
                    <VStack spacing={0}>
                      <Text color={useColorModeValue("blue.500", "blue.400")}>Slots Remaining</Text>
                      <Text fontWeight="bold" color={useColorModeValue("blue.700", "blue.200")}>
                        {slotsRemaining.toLocaleString()}
                      </Text>
                    </VStack>
                    <VStack spacing={0}>
                      <Text color={useColorModeValue("blue.500", "blue.400")}>Epochs Remaining</Text>
                      <Text fontWeight="bold" color={useColorModeValue("blue.700", "blue.200")}>
                        {epochsRemaining.toLocaleString()}
                      </Text>
                    </VStack>
                  </HStack>
                </CardBody>
              </Card>

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
              <VStack spacing={2}>
                <HStack spacing={2} align="center">
                  <Icon as={FaClock} color={useColorModeValue("gray.600", "gray.400")} boxSize={3} />
                  <Text fontSize="sm" color={useColorModeValue("gray.600", "gray.400")}>
                    Auto-refresh in {timer} seconds
                  </Text>
                </HStack>
                <Text fontSize="xs" color={useColorModeValue("gray.500", "gray.500")}>
                  {viewMode === "slots" 
                    ? "📊 Slot view: Each box represents a 12-second slot on the beacon chain"
                    : "📊 Epoch view: Each box represents a 6.4-minute epoch (32 slots)"}
                </Text>
                <Badge colorScheme="purple" variant="subtle" fontSize="9px">
                  Live data from {networks[network].name} beacon chain
                </Badge>
              </VStack>
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