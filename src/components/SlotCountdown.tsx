import React, { useState, useEffect, useRef } from "react";
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
  Icon,
  Collapse,
  useColorModeValue,
  chakra,
} from "@chakra-ui/react";
import { keyframes } from "@chakra-ui/system";
import { motion } from "framer-motion";
import {
  FaNetworkWired,
  FaClock,
  FaInfoCircle,
  FaChevronDown,
  FaChevronUp,
  FaBook,
} from "react-icons/fa";
import DateTime from "./DateTime";

interface NetworkConfig {
  beaconApi: string;
  rpc: string;
  target: number;
  targetepoch: number;
  name: string;
}

const networks: Record<string, NetworkConfig> = {
  holesky: {
    beaconApi: "https://ethereum-holesky-beacon-api.publicnode.com",
    rpc: "https://ethereum-holesky-rpc.publicnode.com",
    target: 5283840,
    targetepoch: Math.floor(5283840 / 32),
    name: "Holesky",
  },
  sepolia: {
    beaconApi: "https://ethereum-sepolia-beacon-api.publicnode.com",
    rpc: "https://ethereum-sepolia-rpc.publicnode.com",
    target: 8724480,
    targetepoch: Math.floor(8724480 / 32),
    name: "Sepolia",
  },
  // Use real endpoints here!
  hoodi: {
    beaconApi: "https://ethereum-hoodi-beacon-api.publicnode.com",
    rpc: "https://ethereum-hoodi-rpc.publicnode.com",
    target: 1622016,
    targetepoch: Math.floor(1622016 / 32),
    name: "Hoodi",
  },
  mainnet: {
    beaconApi: "https://ethereum-beacon-api.publicnode.com",
    rpc: "https://ethereum-rpc.publicnode.com",
    // Fusaka activation
    target: 13164544,
    targetepoch: Math.floor(13164544 / 32), // 411454
    name: "Mainnet",
  },
};

const FUSAKA_INFO = {
  title: "FUSAKA Network Upgrade",
  description:
    "Ethereum's major hard fork focused on improving scalability, efficiency, and security through PeerDAS and increased capacity.",
  features: [
    "PeerDAS: Peer Data Availability Sampling for efficient data verification",
    "Block gas limit increased from 30M to 150M units",
    "Doubled blob capacity through BPO (Blob Parameter Only) forks",
    "Reduced network congestion and lower transaction fees for L2 rollups",
  ],
  schedule: {
    holesky: "October 1, 2025 - 08:48 UTC",
    sepolia: "October 14, 2025 - 07:36 UTC",
    hoodi: "October 28, 2025 - 18:53 UTC",
    mainnet: "December 4, 2025 - 05:49:11 UTC",
  },
  readMore: {
    label: "Read more about FUSAKA",
    href:
      "https://etherworld.co/2025/10/01/bpo-forks-explained-how-fusaka-gradually-scales-blob-capacity/",
  },
};

const celebrateAnimation = keyframes`
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.15); opacity: 0.8; }
  100% { transform: scale(1); opacity: 1; }
`;

const getAccent = (network: string, light: boolean) => {
  if (network === "holesky") return light ? "blue.600" : "blue.300";
  if (network === "sepolia") return light ? "purple.600" : "purple.300";
  if (network === "hoodi") return light ? "orange.600" : "orange.300";
  if (network === "mainnet") return light ? "blue.700" : "blue.400";
  return light ? "gray.700" : "gray.200";
};

const SlotCountdown: React.FC = () => {
  const [currentSlot, setCurrentSlot] = useState<number>(0);
  const [currentEpoch, setCurrentEpoch] = useState<number>(0);
  const [currentBlock, setCurrentBlock] = useState<number>(0);
  const [timer, setTimer] = useState<number>(13);
  const [network, setNetwork] = useState<keyof typeof networks>("mainnet");
  const [loading, setLoading] = useState<boolean>(true);
  const [countdown, setCountdown] = useState<string>("");
  const [isUpgradeLive, setIsUpgradeLive] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<"slots" | "epochs">("epochs");
  const [showInfo, setShowInfo] = useState<boolean>(false);

  const accent = getAccent(network, useColorModeValue(true, false));

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchData = async () => {
    try {
      const { beaconApi, rpc, target } = networks[network];
      if (!beaconApi || !rpc)
        throw new Error("Beacon/RPC URL not configured for this network.");
      const beaconResponse = await fetch(
        `${beaconApi}/eth/v1/beacon/headers/head`
      );
      const beaconData = await beaconResponse.json();
      const slot: number = parseInt(beaconData.data.header.message.slot);
      const epoch: number = Math.floor(slot / 32);

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

      if (target !== 999999999 && slot >= target) {
        setIsUpgradeLive(true);
        setCountdown("");
        if (countdownIntervalRef.current)
          clearInterval(countdownIntervalRef.current);
        return;
      } else {
        setIsUpgradeLive(false);
      }

      if (target !== 999999999 && !isUpgradeLive) {
        let slotsRemaining: number = target - slot;
        let totalSecondsRemaining: number = slotsRemaining * 12;

        if (countdownIntervalRef.current)
          clearInterval(countdownIntervalRef.current);

        countdownIntervalRef.current = setInterval(() => {
          if (totalSecondsRemaining <= 0) {
            clearInterval(countdownIntervalRef.current!);
            setCountdown("0D 0H 0M 0S");
            return;
          }
          totalSecondsRemaining -= 1;
          const days: number = Math.floor(totalSecondsRemaining / (3600 * 24));
          const hours: number = Math.floor(
            (totalSecondsRemaining % (3600 * 24)) / 3600
          );
          const minutes: number = Math.floor(
            (totalSecondsRemaining % 3600) / 60
          );
          const seconds: number = Math.floor(totalSecondsRemaining % 60);
          setCountdown(
            `${days}D ${hours}H ${minutes}M ${seconds}S`
          );
        }, 1000);
      } else {
        setCountdown("");
        if (countdownIntervalRef.current)
          clearInterval(countdownIntervalRef.current);
      }
    } catch (error) {
      setCountdown("Data unavailable");
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      fetchData();
      setTimer(13);
    }, 13000);

    const localTimerInterval = setInterval(() => {
      setTimer((prev) => (prev === 0 ? 13 : prev - 1));
    }, 1000);

    fetchData();

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      clearInterval(localTimerInterval);
      if (countdownIntervalRef.current)
        clearInterval(countdownIntervalRef.current);
    };
    // eslint-disable-next-line
  }, [network]);

  const handleNetworkChange = (newNetwork: keyof typeof networks) => {
    setNetwork(newNetwork);
    setLoading(true);
  };

  const slotsRemaining = networks[network].target - currentSlot;
  const epochsRemaining = networks[network].targetepoch - currentEpoch;

  // --- Slots/Epochs Visualizer ---
  const renderSlotsView = () => {
    const startSlot = currentEpoch * 32;
    const slotsInEpoch = Array.from({ length: 32 }, (_, i) => startSlot + i);
    const firstRowSlots = slotsInEpoch.slice(0, 16);
    const secondRowSlots = slotsInEpoch.slice(16);

    return (
      <VStack spacing={3} align="center">
        <Text fontSize="xs" fontWeight="medium" color={useColorModeValue("gray.600", "gray.400")}>
          Epoch {currentEpoch} • 32 Slots • Current Slot: {currentSlot}
        </Text>
        
        <VStack spacing={2}>
          <HStack spacing={1.5} wrap="wrap" justify="center">
            {firstRowSlots.map((slot) => {
              const isProcessed = slot < currentSlot;
              const isCurrent = slot === currentSlot;
              const epochOfSlot = Math.floor(slot / 32);
              const blockOfSlot = currentBlock - (currentSlot - slot);
              return (
                <Tooltip
                  key={slot}
                  label={
                    isProcessed
                      ? `✅ Processed Slot: ${slot}\n📊 Epoch: ${epochOfSlot}\n📦 Block: ${blockOfSlot.toLocaleString()}\n🌐 Network: ${networks[network].name}`
                      : isCurrent
                      ? `📍 Current Slot: ${slot}\n📊 Epoch: ${epochOfSlot}\n📦 Current Block: ${blockOfSlot.toLocaleString()}\n🌐 Network: ${networks[network].name}\n⏱️ Next slot in ~${13 - timer}s`
                      : `🔮 Future Slot: ${slot}\n📊 Epoch: ${epochOfSlot}\n📅 Est. Time: ${new Date(Date.now() + ((slot - currentSlot) * 12 * 1000)).toLocaleString()}\n📦 Est. Block: ${(currentBlock + (slot - currentSlot)).toLocaleString()}`
                  }
                  hasArrow
                  placement="top"
                  bg={useColorModeValue("gray.800", "gray.200")}
                  color={useColorModeValue("white", "gray.800")}
                  fontSize="xs"
                  whiteSpace="pre-line"
                >
                  <Box
                    w="55px"
                    h="55px"
                    borderRadius="md"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    bg={
                      isCurrent
                        ? useColorModeValue("blue.500", "blue.400")
                        : isProcessed
                        ? useColorModeValue("green.500", "green.400")
                        : useColorModeValue("gray.200", "gray.600")
                    }
                    color={
                      isCurrent || isProcessed
                        ? "white"
                        : useColorModeValue("gray.600", "gray.300")
                    }
                    fontSize="12px"
                    fontWeight="bold"
                    animation={isCurrent ? "blink 1.5s infinite" : "none"}
                    border="2px solid"
                    borderColor={
                      isCurrent
                        ? useColorModeValue("blue.700", "blue.200")
                        : "transparent"
                    }
                    _hover={{
                      transform: "translateY(-1px)",
                      shadow: "sm",
                      transition: "all 0.2s",
                    }}
                  >
                    {slot}
                  </Box>
                </Tooltip>
              );
            })}
          </HStack>
          
          <HStack spacing={1.5} wrap="wrap" justify="center">
            {secondRowSlots.map((slot) => {
              const isProcessed = slot < currentSlot;
              const isCurrent = slot === currentSlot;
              const epochOfSlot = Math.floor(slot / 32);
              const blockOfSlot = currentBlock - (currentSlot - slot);
              return (
                <Tooltip
                  key={slot}
                  label={
                    isProcessed
                      ? `✅ Processed Slot: ${slot}\n📊 Epoch: ${epochOfSlot}\n📦 Block: ${blockOfSlot.toLocaleString()}\n🌐 Network: ${networks[network].name}`
                      : isCurrent
                      ? `📍 Current Slot: ${slot}\n📊 Epoch: ${epochOfSlot}\n📦 Current Block: ${blockOfSlot.toLocaleString()}\n🌐 Network: ${networks[network].name}\n⏱️ Next slot in ~${13 - timer}s`
                      : `🔮 Future Slot: ${slot}\n📊 Epoch: ${epochOfSlot}\n📅 Est. Time: ${new Date(Date.now() + ((slot - currentSlot) * 12 * 1000)).toLocaleString()}\n📦 Est. Block: ${(currentBlock + (slot - currentSlot)).toLocaleString()}`
                  }
                  hasArrow
                  placement="top"
                  bg={useColorModeValue("gray.800", "gray.200")}
                  color={useColorModeValue("white", "gray.800")}
                  fontSize="xs"
                  whiteSpace="pre-line"
                >
                  <Box
                    w="55px"
                    h="55px"
                    borderRadius="md"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    bg={
                      isCurrent
                        ? useColorModeValue("blue.500", "blue.400")
                        : isProcessed
                        ? useColorModeValue("green.500", "green.400")
                        : useColorModeValue("gray.200", "gray.600")
                    }
                    color={
                      isCurrent || isProcessed
                        ? "white"
                        : useColorModeValue("gray.600", "gray.300")
                    }
                    fontSize="12px"
                    fontWeight="bold"
                    animation={isCurrent ? "blink 1.5s infinite" : "none"}
                    border="2px solid"
                    borderColor={
                      isCurrent
                        ? useColorModeValue("blue.700", "blue.200")
                        : "transparent"
                    }
                    _hover={{
                      transform: "translateY(-1px)",
                      shadow: "sm",
                      transition: "all 0.2s",
                    }}
                  >
                    {slot}
                  </Box>
                </Tooltip>
              );
            })}
            
            {networks[network].target !== Number.MAX_SAFE_INTEGER && (
              <>
                <Box mx={2}>
                  <Text fontSize="xs" color={useColorModeValue("gray.500", "gray.400")}>
                    ···
                  </Text>
                </Box>
                
                <Tooltip
                  label={`🎯 FUSAKA Target Slot: ${networks[network].target.toLocaleString()}\n📅 Scheduled: ${FUSAKA_INFO.schedule[network as keyof typeof FUSAKA_INFO.schedule]}\n📊 Target Epoch: ${networks[network].targetepoch.toLocaleString()}\n⏰ Estimated Block: ${(networks[network].target + (currentBlock - currentSlot)).toLocaleString()}\n🚀 Network: ${networks[network].name}\n⏳ Slots remaining: ${(networks[network].target - currentSlot).toLocaleString()}`}
                  hasArrow
                  placement="top"
                  bg={useColorModeValue("gray.800", "gray.200")}
                  color={useColorModeValue("white", "gray.800")}
                  fontSize="xs"
                  whiteSpace="pre-line"
                >
                  <Box
                    w="55px"
                    h="55px"
                    borderRadius="md"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    bg={useColorModeValue("orange.400", "orange.500")}
                    color="white"
                    fontSize="10px"
                    fontWeight="bold"
                    border="2px solid"
                    borderColor={useColorModeValue("orange.600", "orange.300")}
                    _hover={{
                      transform: "translateY(-1px)",
                      shadow: "sm",
                      transition: "all 0.2s",
                    }}
                  >
                    FUSAKA
                  </Box>
                </Tooltip>
              </>
            )}
          </HStack>
        </VStack>
      </VStack>
    );
  };

  const renderEpochsView = () => {
    const epochsToShow = 16; // Reduced to make room for target
    const epochs = Array.from({ length: epochsToShow }, (_, i) => currentEpoch + i);
    
    return (
      <VStack spacing={3} align="center">
        <Text fontSize="xs" fontWeight="medium" color={useColorModeValue("gray.600", "gray.400")}>
          Epochs Timeline • Current: {currentEpoch} • Slot: {currentSlot}
        </Text>
        
        <VStack spacing={2}>
          <HStack spacing={1.5} wrap="wrap" justify="center">
            {epochs.slice(0, 8).map((epoch) => {
              const isCurrent = epoch === currentEpoch;
              const isTarget = epoch === networks[network].targetepoch;
              const isPast = epoch < currentEpoch;
              
              const formatTooltip = (epoch: number, isCurrent: boolean, isTarget: boolean) => {
                const lines = [];
                
                if (isTarget) {
                  lines.push(`🎯 FUSAKA Target Epoch: ${epoch}`);
                  lines.push(`📅 Scheduled: ${FUSAKA_INFO.schedule[network as keyof typeof FUSAKA_INFO.schedule]}`);
                  lines.push(`🔢 Target Slot: ${networks[network].target.toLocaleString()}`);
                  lines.push(`⏰ Estimated Block: ${(networks[network].target + (currentBlock - currentSlot)).toLocaleString()}`);
                  lines.push(`🚀 Network: ${networks[network].name}`);
                } else if (isCurrent) {
                  lines.push(`📍 Current Epoch: ${epoch}`);
                  lines.push(`🔢 Current Slot: ${currentSlot.toLocaleString()}`);
                  lines.push(`📦 Current Block: ${currentBlock.toLocaleString()}`);
                  lines.push(`🌐 Network: ${networks[network].name}`);
                  lines.push(`⏱️ Next slot in ~${13 - timer}s`);
                } else if (isPast) {
                  lines.push(`✅ Completed Epoch: ${epoch}`);
                  lines.push(`📦 Estimated Block: ${(currentBlock - ((currentSlot - (epoch * 32)) * 1)).toLocaleString()}`);
                } else {
                  lines.push(`🔮 Future Epoch: ${epoch}`);
                  lines.push(`📅 Est. Start: ${new Date(Date.now() + ((epoch - currentEpoch) * 32 * 12 * 1000)).toLocaleString()}`);
                  lines.push(`📦 Est. Block: ${(currentBlock + ((epoch - currentEpoch) * 32)).toLocaleString()}`);
                }
                
                return lines.join('\n');
              };
              
              return (
                <Tooltip
                  key={epoch}
                  label={formatTooltip(epoch, isCurrent, isTarget)}
                  hasArrow
                  placement="top"
                  bg={useColorModeValue("gray.800", "gray.200")}
                  color={useColorModeValue("white", "gray.800")}
                  fontSize="xs"
                  whiteSpace="pre-line"
                >
                  <Box
                    w="55px"
                    h="55px"
                    borderRadius="md"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    bg={
                      isTarget
                        ? useColorModeValue("orange.400", "orange.500")
                        : isCurrent
                        ? useColorModeValue("blue.500", "blue.400")
                        : isPast
                        ? useColorModeValue("green.500", "green.400")
                        : useColorModeValue("gray.200", "gray.600")
                    }
                    color={
                      isTarget || isCurrent || isPast
                        ? "white"
                        : useColorModeValue("gray.600", "gray.300")
                    }
                    fontSize="12px"
                    fontWeight="bold"
                    animation={isCurrent ? "blink 1.5s infinite" : "none"}
                    border="2px solid"
                    borderColor={
                      isCurrent
                        ? useColorModeValue("blue.700", "blue.200")
                        : isTarget
                        ? useColorModeValue("orange.600", "orange.300")
                        : "transparent"
                    }
                    _hover={{
                      transform: "translateY(-1px)",
                      shadow: "sm",
                      transition: "all 0.2s",
                    }}
                  >
                    {epoch}
                  </Box>
                </Tooltip>
              );
            })}
            
          </HStack>
          
          <HStack spacing={1.5} wrap="wrap" justify="center">
            {epochs.slice(8).map((epoch) => {
              const isCurrent = epoch === currentEpoch;
              const isTarget = epoch === networks[network].targetepoch;
              const isPast = epoch < currentEpoch;
              
              const formatTooltip = (epoch: number, isCurrent: boolean, isTarget: boolean) => {
                const lines = [];
                
                if (isTarget) {
                  lines.push(`🎯 FUSAKA Target Epoch: ${epoch}`);
                  lines.push(`📅 Scheduled: ${FUSAKA_INFO.schedule[network as keyof typeof FUSAKA_INFO.schedule]}`);
                  lines.push(`🔢 Target Slot: ${networks[network].target.toLocaleString()}`);
                  lines.push(`⏰ Estimated Block: ${(networks[network].target + (currentBlock - currentSlot)).toLocaleString()}`);
                  lines.push(`🚀 Network: ${networks[network].name}`);
                } else if (isCurrent) {
                  lines.push(`📍 Current Epoch: ${epoch}`);
                  lines.push(`🔢 Current Slot: ${currentSlot.toLocaleString()}`);
                  lines.push(`📦 Current Block: ${currentBlock.toLocaleString()}`);
                  lines.push(`🌐 Network: ${networks[network].name}`);
                  lines.push(`⏱️ Next slot in ~${13 - timer}s`);
                } else if (isPast) {
                  lines.push(`✅ Completed Epoch: ${epoch}`);
                  lines.push(`📦 Estimated Block: ${(currentBlock - ((currentSlot - (epoch * 32)) * 1)).toLocaleString()}`);
                } else {
                  lines.push(`🔮 Future Epoch: ${epoch}`);
                  lines.push(`📅 Est. Start: ${new Date(Date.now() + ((epoch - currentEpoch) * 32 * 12 * 1000)).toLocaleString()}`);
                  lines.push(`📦 Est. Block: ${(currentBlock + ((epoch - currentEpoch) * 32)).toLocaleString()}`);
                }
                
                return lines.join('\n');
              };
              
              return (
                <Tooltip
                  key={epoch}
                  label={formatTooltip(epoch, isCurrent, isTarget)}
                  hasArrow
                  placement="top"
                  bg={useColorModeValue("gray.800", "gray.200")}
                  color={useColorModeValue("white", "gray.800")}
                  fontSize="xs"
                  whiteSpace="pre-line"
                >
                  <Box
                    w="55px"
                    h="55px"
                    borderRadius="md"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    bg={
                      isTarget
                        ? useColorModeValue("orange.400", "orange.500")
                        : isCurrent
                        ? useColorModeValue("blue.500", "blue.400")
                        : isPast
                        ? useColorModeValue("green.500", "green.400")
                        : useColorModeValue("gray.200", "gray.600")
                    }
                    color={
                      isTarget || isCurrent || isPast
                        ? "white"
                        : useColorModeValue("gray.600", "gray.300")
                    }
                    fontSize="12px"
                    fontWeight="bold"
                    animation={isCurrent ? "blink 1.5s infinite" : "none"}
                    border="2px solid"
                    borderColor={
                      isCurrent
                        ? useColorModeValue("blue.700", "blue.200")
                        : isTarget
                        ? useColorModeValue("orange.600", "orange.300")
                        : "transparent"
                    }
                    _hover={{
                      transform: "translateY(-1px)",
                      shadow: "sm",
                      transition: "all 0.2s",
                    }}
                  >
                    {epoch}
                  </Box>
                </Tooltip>
              );
            })}
            
            {/* Add target epoch at the end if it's not already visible and network has a target */}
            {networks[network].target !== Number.MAX_SAFE_INTEGER && 
             networks[network].targetepoch > currentEpoch + 15 && (
              <>
                <Box mx={2}>
                  <Text fontSize="xs" color={useColorModeValue("gray.500", "gray.400")}>
                    ···
                  </Text>
                </Box>
                
                <Tooltip
                  label={`🎯 FUSAKA Target Epoch: ${networks[network].targetepoch}\n📅 Scheduled: ${FUSAKA_INFO.schedule[network as keyof typeof FUSAKA_INFO.schedule]}\n🔢 Target Slot: ${networks[network].target.toLocaleString()}\n⏰ Estimated Block: ${(networks[network].target + (currentBlock - currentSlot)).toLocaleString()}\n🚀 Network: ${networks[network].name}\n⏳ Epochs remaining: ${(networks[network].targetepoch - currentEpoch).toLocaleString()}`}
                  hasArrow
                  placement="top"
                  bg={useColorModeValue("gray.800", "gray.200")}
                  color={useColorModeValue("white", "gray.800")}
                  fontSize="xs"
                  whiteSpace="pre-line"
                >
                  <Box
                    w="55px"
                    h="55px"
                    borderRadius="md"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    bg={useColorModeValue("orange.400", "orange.500")}
                    color="white"
                    fontSize="10px"
                    fontWeight="bold"
                    border="2px solid"
                    borderColor={useColorModeValue("orange.600", "orange.300")}
                    _hover={{
                      transform: "translateY(-1px)",
                      shadow: "sm",
                      transition: "all 0.2s",
                    }}
                  >
                    FUSAKA
                  </Box>
                </Tooltip>
              </>
            )}
          </HStack>
        </VStack>
      </VStack>
    );
  };

  // --- Main Unified Layout ---
  return (
    <VStack spacing={5} align="stretch" w="full">
      {/* HEADER WITH COLLAPSIBLE INFO */}
      <Box 
        bg={useColorModeValue("gray.50", "gray.900")} 
        p={4} 
        borderRadius="lg"
        border="1px solid"
        borderColor={useColorModeValue("gray.200", "gray.700")}
      >
        <Flex justify="space-between" align="center" mb={showInfo ? 3 : 0}>
          <HStack spacing={3}>
            <Icon as={FaInfoCircle} color={useColorModeValue("blue.600", "blue.300")} boxSize={5} />
            <Text fontSize="md" fontWeight="bold" color={useColorModeValue("gray.800", "white")}>
              FUSAKA Network Upgrade
            </Text>
            <Badge colorScheme="purple" variant="subtle" fontSize="xs">Info</Badge>
          </HStack>
          <Button
            size="sm"
            variant="ghost"
            color={useColorModeValue("blue.600", "blue.200")}
            onClick={() => setShowInfo((prev) => !prev)}
            rightIcon={showInfo ? <FaChevronUp /> : <FaChevronDown />}
            _hover={{ bg: useColorModeValue("blue.100", "blue.800") }}
          >
            {showInfo ? "Hide" : "More"}
          </Button>
        </Flex>
        
        <Collapse in={showInfo} animateOpacity>
          <Box pt={2}>
            <Text fontSize="sm" color={useColorModeValue("gray.700", "gray.300")} mb={3}>
              {FUSAKA_INFO.description}
            </Text>
            <HStack spacing={6} align="start" flexWrap="wrap">
              <VStack align="start" spacing={2} minW="180px">
                <Text fontWeight="semibold" fontSize="sm" color={useColorModeValue("gray.800", "gray.200")}>
                  Key Features:
                </Text>
                <VStack align="start" spacing={0.5} fontSize="sm" color={useColorModeValue("gray.600", "gray.400")}>
                  {FUSAKA_INFO.features.map((f, i) => (
                    <Text key={i}>• {f}</Text>
                  ))}
                </VStack>
              </VStack>
              
              <VStack align="start" spacing={2} minW="180px">
                <Text fontWeight="semibold" fontSize="sm" color={useColorModeValue("gray.800", "gray.200")}>
                  Activation Schedule:
                </Text>
                <VStack align="start" spacing={0.5} fontSize="sm" color={useColorModeValue("gray.600", "gray.400")}>
                  {Object.entries(FUSAKA_INFO.schedule).map(([net, date]) => (
                    <Text key={net}>
                      <Text as="span" fontWeight="medium" color={useColorModeValue("gray.700", "gray.300")}>
                        {net.charAt(0).toUpperCase() + net.slice(1)}:
                      </Text>{" "}
                      {date}
                    </Text>
                  ))}
                </VStack>
              </VStack>
            </HStack>
            
            <Button
              as="a"
              href={FUSAKA_INFO.readMore.href}
              target="_blank"
              rel="noopener noreferrer"
              leftIcon={<FaBook />}
              colorScheme="blue"
              size="sm"
              variant="outline"
              mt={3}
            >
              {FUSAKA_INFO.readMore.label}
            </Button>
          </Box>
        </Collapse>
      </Box>

      {/* LIVE COUNTDOWN HEADER */}
      <Flex align="center" justify="space-between" flexWrap="wrap" gap={3}>
        <HStack spacing={3}>
          <Icon as={FaNetworkWired} boxSize={5} color={accent} />
          <Text fontSize={{ base: "lg", md: "xl" }} fontWeight="bold" color={useColorModeValue("gray.800", "white")}>
            Live Countdown — {networks[network].name} Network
          </Text>
          <Badge colorScheme={network === "mainnet" ? "blue" : "green"} fontSize="xs" px={2}>
            {network === "mainnet" ? "MAINNET" : "TESTNET"}
          </Badge>
        </HStack>
        <Select
          value={viewMode}
          onChange={(e) => setViewMode(e.target.value as "slots" | "epochs")}
          bg={useColorModeValue("white", "gray.700")}
          borderColor={useColorModeValue("gray.300", "gray.600")}
          width="120px"
          size="sm"
        >
          <option value="epochs">Epochs</option>
          <option value="slots">Slots</option>
        </Select>
      </Flex>

      {/* NETWORK SELECTION */}
      <Box>
        <Text fontSize="sm" fontWeight="medium" color={useColorModeValue("gray.600", "gray.400")} mb={2} textAlign="center">
          Select Network to Track
        </Text>
        <HStack spacing={2} justify="center" flexWrap="wrap">
          {(["holesky", "sepolia", "hoodi", "mainnet"] as (keyof typeof networks)[]).map((net) => (
            <Button
              key={net}
              colorScheme={network === net ? (net === "mainnet" ? "blue" : net === "hoodi" ? "orange" : net === "sepolia" ? "purple" : "blue") : "gray"}
              onClick={() => handleNetworkChange(net)}
              variant={network === net ? "solid" : "outline"}
              size="sm"
              _hover={{ transform: "translateY(-1px)", shadow: "md" }}
              transition="all 0.2s"
            >
              {net.charAt(0).toUpperCase() + net.slice(1)}
              {net === "holesky" && <Badge ml={1} colorScheme="orange" fontSize="9px" variant="subtle">FINAL</Badge>}
              {net === "mainnet" && <Badge ml={1} colorScheme="blue" fontSize="9px" variant="subtle">DEC 4</Badge>}
            </Button>
          ))}
        </HStack>
      </Box>

      {/* COUNTDOWN STATUS - ONE LINE */}
      {loading ? (
        <VStack spacing={3} py={6}>
          <Spinner size="lg" color={accent} />
          <Text color={useColorModeValue("gray.600", "gray.400")} fontSize="sm">
            Loading {networks[network].name} network data...
          </Text>
        </VStack>
      ) : isUpgradeLive || slotsRemaining <= 0 ? (
        <VStack spacing={4}>
          <Text
            fontSize="xl"
            fontWeight="bold"
            color="green.700"
            animation={`${celebrateAnimation} 1s infinite`}
          >
            FUSAKA IS LIVE ON {networks[network].name.toUpperCase()}!
          </Text>
          <Text color="green.600" fontSize="sm">
            The upgrade is now active on the {networks[network].name} network
          </Text>
          <Badge colorScheme="green" px={3} py={1} fontSize="sm">
            Successfully Activated
          </Badge>
        </VStack>
      ) : (
        <VStack spacing={4}>
          {/* SINGLE LINE STATUS */}
          <HStack justify="center" spacing={4} flexWrap="wrap" py={2}>
            <HStack spacing={2}>
              <Icon as={FaClock} color={useColorModeValue("blue.600", "blue.300")} />
              <Text fontSize="md" fontWeight="bold" color={useColorModeValue("gray.800", "white")}>
                {countdown || "Calculating..."}
              </Text>
            </HStack>
            <Text fontSize="sm" color={useColorModeValue("gray.600", "gray.400")}>
              until FUSAKA on {networks[network].name}
            </Text>
            <Text fontSize="sm" color={useColorModeValue("gray.600", "gray.400")}>•</Text>
            <Text fontSize="sm" color={useColorModeValue("gray.600", "gray.400")}>
              {slotsRemaining.toLocaleString()} slots
            </Text>
            <Text fontSize="sm" color={useColorModeValue("gray.600", "gray.400")}>•</Text>
            <Text fontSize="sm" color={useColorModeValue("gray.600", "gray.400")}>
              {epochsRemaining.toLocaleString()} epochs
            </Text>
          </HStack>

          {/* SLOTS/EPOCHS VISUALIZATION */}
          <Box width="100%" bg={useColorModeValue("gray.50", "gray.800")} p={4} borderRadius="md" border="1px solid" borderColor={useColorModeValue("gray.200", "gray.700")}>
            {viewMode === "slots" ? renderSlotsView() : renderEpochsView()}
          </Box>
        </VStack>
      )}

      {/* FOOTER INFO */}
      <HStack justify="center" spacing={4} py={2}>
        <HStack spacing={2}>
          <Icon as={FaClock} boxSize={3} color={useColorModeValue("gray.500", "gray.400")} />
          <Text fontSize="sm" color={useColorModeValue("gray.500", "gray.400")}>
            Auto-refresh in {timer}s
          </Text>
        </HStack>
      </HStack>

      <DateTime />
      
      <style>
        {`
          @keyframes blink {
            0% { opacity: 1; }
            50% { opacity: 0.6; }
            100% { opacity: 1; }
          }
        `}
      </style>
    </VStack>
  );
};

export default SlotCountdown;
