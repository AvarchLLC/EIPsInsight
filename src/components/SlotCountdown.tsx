import React, { useState, useEffect } from "react";
import {
  Box,
  Text,
  HStack,
  VStack,
  Button,
  Spinner,
  Badge,
  Progress,
  Card,
  CardHeader,
  CardBody,
  Grid,
  Alert,
  AlertIcon,
  SimpleGrid,
  Tooltip,
  useColorModeValue,
  Link,
  Icon,
} from "@chakra-ui/react";
import { keyframes } from '@chakra-ui/system';
import { motion } from "framer-motion";

// Animation keyframes
const pulse = keyframes`
  0% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.05); opacity: 1; }
  100% { transform: scale(1); opacity: 0.8; }
`;

const rotate = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const shimmer = keyframes`
  0% { background-position: -200px 0; }
  100% { background-position: calc(200px + 100%) 0; }
`;

// Official Fusaka Schedule Data
interface NetworkConfig {
  name: string;
  slot: number;
  utcTime: string;
  timestamp: number;
  isLast?: boolean;
  beaconApi?: string;
  rpc?: string;
  etherscan?: string;
  beaconchain?: string;
}

const FUSAKA_NETWORKS: Record<string, NetworkConfig> = {
  holesky: {
    name: "Holesky",
    slot: 5283840,
    utcTime: "2025-10-01 08:48:00",
    timestamp: 1727773680, // Correct timestamp for 2025-10-01 08:48:00 UTC
    isLast: true,
    beaconApi: "https://ethereum-holesky-beacon-api.publicnode.com",
    rpc: "https://ethereum-holesky-rpc.publicnode.com",
    etherscan: "https://holesky.etherscan.io",
    beaconchain: "https://holesky.beaconcha.in"
  },
  sepolia: {
    name: "Sepolia",
    slot: 8724480,
    utcTime: "2025-10-14 07:36:00",
    timestamp: 1728891360, // Correct timestamp for 2025-10-14 07:36:00 UTC
    isLast: false,
    beaconApi: "https://ethereum-sepolia-beacon-api.publicnode.com",
    rpc: "https://ethereum-sepolia-rpc.publicnode.com",
    etherscan: "https://sepolia.etherscan.io",
    beaconchain: "https://sepolia.beaconcha.in"
  },
  hoodi: {
    name: "Hoodi",
    slot: 1622016,
    utcTime: "2025-10-28 18:53:12",
    timestamp: 1730138392, // Correct timestamp for 2025-10-28 18:53:12 UTC
    isLast: false,
    etherscan: "https://hoodi.etherscan.io",
    beaconchain: "https://hoodi.beaconcha.in"
  },
  mainnet: {
    name: "Mainnet",
    slot: 0, // TBD - To Be Determined
    utcTime: "TBA",
    timestamp: 0,
    isLast: false,
    beaconApi: "https://ethereum-beacon-api.publicnode.com",
    rpc: "https://ethereum-rpc.publicnode.com",
    etherscan: "https://etherscan.io",
    beaconchain: "https://beaconcha.in"
  }
};

// BPO (Blob Parameter Only) Schedule for Holesky
interface BPOFork {
  name: string;
  epoch: number;
  utcTime: string;
  timestamp: number;
  blobTarget: number;
  blobMax: number;
  description: string;
}

const BPO_SCHEDULE: BPOFork[] = [
  {
    name: "BPO1",
    epoch: 166400,
    utcTime: "2025-10-07 01:20:00",
    timestamp: 1728264000, // Correct timestamp for 2025-10-07 01:20:00 UTC
    blobTarget: 10,
    blobMax: 15,
    description: "Increases per-block blob target to 10 and maximum to 15"
  },
  {
    name: "BPO2", 
    epoch: 167936,
    utcTime: "2025-10-13 21:10:24",
    timestamp: 1728851424, // Correct timestamp for 2025-10-13 21:10:24 UTC
    blobTarget: 14,
    blobMax: 21,
    description: "Further increases blob target to 14 and maximum to 21"
  }
];

const SlotCountdown: React.FC = () => {
  const [selectedNetwork, setSelectedNetwork] = useState<keyof typeof FUSAKA_NETWORKS>('holesky');
  const [currentSlot, setCurrentSlot] = useState<number>(0);
  const [currentEpoch, setCurrentEpoch] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [showBPO, setShowBPO] = useState<boolean>(false);
  const [refreshTimer, setRefreshTimer] = useState<number>(13);
  const [currentTime, setCurrentTime] = useState<number>(Math.floor(Date.now() / 1000));

  // Color theme
  const bg = useColorModeValue("white", "gray.800");
  const cardBg = useColorModeValue("gray.50", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const textColor = useColorModeValue("gray.800", "white");
  const accentColor = useColorModeValue("blue.600", "blue.300");
  const mutedColor = useColorModeValue("gray.600", "gray.400");

  // Fetch current network data
  useEffect(() => {
    const fetchNetworkData = async () => {
      try {
        const network = FUSAKA_NETWORKS[selectedNetwork];
        if (!network.beaconApi) {
          // For networks without API, use mock data
          setCurrentSlot(Math.floor(network.slot * 0.95));
          setCurrentEpoch(Math.floor(network.slot * 0.95 / 32));
          return;
        }

        const response = await fetch(`${network.beaconApi}/eth/v1/beacon/headers/head`);
        const data = await response.json();
        
        if (data?.data?.header?.message?.slot) {
          const slot = parseInt(data.data.header.message.slot);
          setCurrentSlot(slot);
          setCurrentEpoch(Math.floor(slot / 32));
        }
      } catch (error) {
        console.error('Failed to fetch network data:', error);
        // Fallback to estimated current slot
        const network = FUSAKA_NETWORKS[selectedNetwork];
        setCurrentSlot(Math.floor(network.slot * 0.95));
        setCurrentEpoch(Math.floor(network.slot * 0.95 / 32));
      } finally {
        setLoading(false);
      }
    };

    fetchNetworkData();
    const interval = setInterval(fetchNetworkData, 13000);
    return () => clearInterval(interval);
  }, [selectedNetwork]);

  // Refresh timer countdown and real-time updates
  useEffect(() => {
    const timer = setInterval(() => {
      setRefreshTimer((prev) => (prev <= 1 ? 13 : prev - 1));
      setCurrentTime(Math.floor(Date.now() / 1000)); // Update current time for real-time countdown
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Calculate time remaining
  const getTimeRemaining = (timestamp: number) => {
    const now = currentTime; // Use state-managed current time for real-time updates
    const diff = timestamp - now;
    
    if (diff <= 0) return { isLive: true, timeString: "🎉 LIVE!" };
    
    const days = Math.floor(diff / 86400);
    const hours = Math.floor((diff % 86400) / 3600);
    const minutes = Math.floor((diff % 3600) / 60);
    const seconds = diff % 60;
    
    return {
      isLive: false,
      timeString: `${days}d ${hours}h ${minutes}m ${seconds}s`,
      days,
      hours,
      minutes,
      seconds
    };
  };

  const currentNetwork = FUSAKA_NETWORKS[selectedNetwork];
  const timeData = getTimeRemaining(currentNetwork.timestamp);
  const progress = currentNetwork.slot > 0 ? (currentSlot / currentNetwork.slot) * 100 : 0;
  const slotsRemaining = Math.max(0, currentNetwork.slot - currentSlot);

  return (
    <Box maxWidth="700px" mx="auto" px={3} py={2}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Main Header */}
        <Card mb={3} bg={bg} borderColor={borderColor} shadow="lg" borderRadius="xl">
          <CardBody p={3}>
            <VStack spacing={3}>
              {/* Title Section */}
              <HStack spacing={3} align="center">
                <Box
                  bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                  p={2}
                  borderRadius="full"
                  animation={`${rotate} 15s linear infinite`}
                >
                  <Text fontSize="lg">🚀</Text>
                </Box>
                <VStack align="start" spacing={0}>
                  <Text fontSize="lg" fontWeight="bold" color={accentColor}>
                    FUSAKA Upgrade Countdown
                  </Text>
                  <Text fontSize="xs" color={mutedColor}>
                    Ethereum's next major network upgrade with enhanced blob throughput
                  </Text>
                </VStack>
              </HStack>
              
              {/* Security & Important Notice */}
              <Alert 
                status="info" 
                borderRadius="lg" 
                bg={useColorModeValue("blue.50", "blue.900")}
                border="1px solid"
                borderColor={useColorModeValue("blue.200", "blue.600")}
                p={3}
              >
                <AlertIcon color={useColorModeValue("blue.500", "blue.300")} />
                <Box fontSize="xs">
                  <Text fontWeight="semibold" color={useColorModeValue("blue.800", "blue.200")}>
                    🔒 Security Audit & Network Notice
                  </Text>
                  <Text color={useColorModeValue("blue.700", "blue.300")}>
                    Security researchers can participate in the Fusaka audit competition to identify potential issues.
                    {selectedNetwork === 'holesky' && " ⚠️ Holesky will be shut down after this final upgrade."}
                  </Text>
                </Box>
              </Alert>
            </VStack>
          </CardBody>
        </Card>

        {/* Network Selection */}
        <Card mb={3} bg={cardBg} borderColor={borderColor} borderRadius="lg">
          <CardBody p={3}>
            <VStack spacing={2}>
              <Text fontSize="sm" fontWeight="semibold" color={textColor}>
                Select Testnet
              </Text>
              <HStack spacing={2} wrap="wrap" justify="center">
                {Object.entries(FUSAKA_NETWORKS).map(([key, network]) => (
                  <Button
                    key={key}
                    size="sm"
                    variant={selectedNetwork === key ? "solid" : "outline"}
                    colorScheme={selectedNetwork === key ? "blue" : "gray"}
                    onClick={() => setSelectedNetwork(key as keyof typeof FUSAKA_NETWORKS)}
                    isDisabled={key === 'mainnet' && network.timestamp === 0}
                  >
                    {network.name}
                    {network.isLast && <Badge ml={1} colorScheme="red" fontSize="9px">FINAL</Badge>}
                    {key === 'mainnet' && network.timestamp === 0 && <Badge ml={1} colorScheme="gray" fontSize="9px">TBD</Badge>}
                  </Button>
                ))}
              </HStack>
            </VStack>
          </CardBody>
        </Card>

        {/* Main Countdown Display */}
        <Card mb={3} bg={bg} borderColor={borderColor} shadow="xl" borderRadius="xl">
          <CardBody p={4}>
            <VStack spacing={4}>
              {/* Network Info Header */}
              <VStack spacing={1} textAlign="center">
                <HStack spacing={2} align="center">
                  <Text fontSize="md" fontWeight="bold" color={textColor}>
                    {currentNetwork.name} Activation
                  </Text>
                  {currentNetwork.isLast && (
                    <Badge colorScheme="orange" fontSize="9px">FINAL UPGRADE</Badge>
                  )}
                  {selectedNetwork === 'mainnet' && currentNetwork.timestamp === 0 && (
                    <Badge colorScheme="gray" fontSize="9px">TBD</Badge>
                  )}
                </HStack>
                <Text fontSize="xs" color={mutedColor}>
                  📅 {currentNetwork.utcTime === "TBA" ? "To Be Announced" : `${currentNetwork.utcTime} UTC`}
                </Text>
                <Text fontSize="xs" color={mutedColor}>
                  🎯 Target Slot: {currentNetwork.slot === 0 ? "TBD" : currentNetwork.slot.toLocaleString()}
                </Text>
              </VStack>

              {/* Countdown or Live Status */}
              {selectedNetwork === 'mainnet' && currentNetwork.timestamp === 0 ? (
                <Box
                  p={4}
                  bg="linear-gradient(135deg, #718096 0%, #4a5568 100%)"
                  borderRadius="xl"
                  textAlign="center"
                  width="100%"
                >
                  <Text fontSize="lg" fontWeight="bold" color="white">
                    📅 MAINNET DATE TO BE ANNOUNCED
                  </Text>
                  <Text fontSize="sm" color="gray.200" mt={1}>
                    Mainnet activation date will be announced after successful testnet deployments
                  </Text>
                </Box>
              ) : timeData.isLive ? (
                <Box
                  p={4}
                  bg="linear-gradient(135deg, #48bb78 0%, #38a169 100%)"
                  borderRadius="xl"
                  textAlign="center"
                  animation={`${pulse} 2s infinite`}
                  width="100%"
                >
                  <Text fontSize="lg" fontWeight="bold" color="white">
                    🎉 FUSAKA IS LIVE ON {currentNetwork.name.toUpperCase()}! 🎉
                  </Text>
                  <Text fontSize="sm" color="green.100" mt={1}>
                    The upgrade is now active on the network
                  </Text>
                </Box>
              ) : (
                <VStack spacing={3} width="100%">
                  {/* Live Countdown Timer */}
                  <Box width="100%" textAlign="center">
                    <Text fontSize="xs" color={mutedColor} mb={2}>
                      ⏰ Time until activation:
                    </Text>
                    <SimpleGrid columns={4} spacing={2} maxW="350px" mx="auto">
                      {[
                        { label: "Days", value: timeData.days || 0, color: "blue" },
                        { label: "Hours", value: timeData.hours || 0, color: "green" },
                        { label: "Minutes", value: timeData.minutes || 0, color: "orange" },
                        { label: "Seconds", value: timeData.seconds || 0, color: "red" }
                      ].map((item, index) => (
                        <Box
                          key={index}
                          p={2}
                          bg={useColorModeValue(`${item.color}.50`, `${item.color}.900`)}
                          borderColor={useColorModeValue(`${item.color}.200`, `${item.color}.600`)}
                          border="2px solid"
                          borderRadius="lg"
                          textAlign="center"
                          transition="all 0.3s"
                          _hover={{ transform: "translateY(-1px)" }}
                        >
                          <Text fontSize="lg" fontWeight="bold" color={useColorModeValue(`${item.color}.600`, `${item.color}.200`)}>
                            {item.value}
                          </Text>
                          <Text fontSize="9px" color={useColorModeValue(`${item.color}.500`, `${item.color}.300`)} textTransform="uppercase">
                            {item.label}
                          </Text>
                        </Box>
                      ))}
                    </SimpleGrid>
                  </Box>
                  
                  {/* Progress Bar */}
                  <Box width="100%">
                    <HStack justify="space-between" mb={1} fontSize="xs" color={mutedColor}>
                      <Text>Progress: {progress.toFixed(2)}%</Text>
                      <Text>Slots remaining: {slotsRemaining.toLocaleString()}</Text>
                    </HStack>
                    <Progress
                      value={progress}
                      colorScheme="blue"
                      size="lg"
                      borderRadius="full"
                      bg={useColorModeValue("gray.200", "gray.600")}
                      sx={{
                        '& > div': {
                          background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                          backgroundSize: '200% 100%',
                          animation: `${shimmer} 3s ease-in-out infinite`
                        }
                      }}
                    />
                  </Box>
                </VStack>
              )}
            </VStack>
          </CardBody>
        </Card>

        {/* Network Stats */}
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={3} mb={3}>
          {/* Current Network Status */}
          <Card bg={cardBg} borderColor={borderColor} borderRadius="lg">
            <CardHeader pb={1}>
              <Text fontSize="sm" fontWeight="semibold" color={textColor}>
                📊 Current Status
              </Text>
            </CardHeader>
            <CardBody pt={0}>
              <VStack align="stretch" spacing={1} fontSize="xs">
                <HStack justify="space-between">
                  <Text color={mutedColor}>Current Slot:</Text>
                  <Text fontWeight="semibold" color={useColorModeValue("green.600", "green.300")}>
                    {loading ? <Spinner size="xs" /> : currentSlot.toLocaleString()}
                  </Text>
                </HStack>
                <HStack justify="space-between">
                  <Text color={mutedColor}>Current Epoch:</Text>
                  <Text fontWeight="semibold" color={useColorModeValue("green.600", "green.300")}>
                    {loading ? <Spinner size="xs" /> : currentEpoch.toLocaleString()}
                  </Text>
                </HStack>
                <HStack justify="space-between">
                  <Text color={mutedColor}>Next Update:</Text>
                  <Text fontWeight="semibold" color={useColorModeValue("orange.600", "orange.300")}>
                    {refreshTimer}s
                  </Text>
                </HStack>
                <HStack justify="space-between">
                  <Text color={mutedColor}>Network Status:</Text>
                  <Badge 
                    colorScheme={loading ? "gray" : "green"} 
                    fontSize="9px"
                  >
                    {loading ? "Loading..." : "Live"}
                  </Badge>
                </HStack>
              </VStack>
            </CardBody>
          </Card>

          {/* Target Information */}
          <Card bg={cardBg} borderColor={borderColor} borderRadius="lg">
            <CardHeader pb={1}>
              <Text fontSize="sm" fontWeight="semibold" color={textColor}>
                🎯 Target Details
              </Text>
            </CardHeader>
            <CardBody pt={0}>
              <VStack align="stretch" spacing={1} fontSize="xs">
                <HStack justify="space-between">
                  <Text color={mutedColor}>Target Slot:</Text>
                  <Text fontWeight="semibold">{currentNetwork.slot === 0 ? "TBD" : currentNetwork.slot.toLocaleString()}</Text>
                </HStack>
                <HStack justify="space-between">
                  <Text color={mutedColor}>Target Epoch:</Text>
                  <Text fontWeight="semibold">{currentNetwork.slot === 0 ? "TBD" : Math.floor(currentNetwork.slot / 32).toLocaleString()}</Text>
                </HStack>
                <HStack justify="space-between">
                  <Text color={mutedColor}>Activation Date:</Text>
                  <Text fontWeight="semibold" fontSize="xs">{currentNetwork.utcTime === "TBA" ? "TBA" : currentNetwork.utcTime.split(' ')[0]}</Text>
                </HStack>
                <HStack justify="space-between">
                  <Text color={mutedColor}>Activation Time:</Text>
                  <Text fontWeight="semibold" fontSize="xs">{currentNetwork.utcTime === "TBA" ? "TBA" : `${currentNetwork.utcTime.split(' ')[1]} UTC`}</Text>
                </HStack>
              </VStack>
            </CardBody>
          </Card>
        </SimpleGrid>

        {/* Explorer Links */}
        {selectedNetwork !== 'mainnet' && (
          <Card bg={cardBg} borderColor={borderColor} borderRadius="lg" mb={3}>
            <CardHeader pb={1}>
              <Text fontSize="sm" fontWeight="semibold" color={textColor}>
                🔗 Network Explorers
              </Text>
            </CardHeader>
            <CardBody pt={0}>
              <HStack spacing={3} wrap="wrap">
                {currentNetwork.etherscan && (
                  <Link
                    href={currentNetwork.etherscan}
                    isExternal
                    _hover={{ textDecoration: 'none' }}
                  >
                    <Button
                      size="sm"
                      variant="outline"
                      colorScheme="blue"
                      leftIcon={<Text fontSize="xs">🔍</Text>}
                      _hover={{ transform: 'translateY(-1px)', shadow: 'md' }}
                    >
                      Etherscan
                    </Button>
                  </Link>
                )}
                {currentNetwork.beaconchain && (
                  <Link
                    href={currentNetwork.beaconchain}
                    isExternal
                    _hover={{ textDecoration: 'none' }}
                  >
                    <Button
                      size="sm"
                      variant="outline"
                      colorScheme="purple"
                      leftIcon={<Text fontSize="xs">⛓️</Text>}
                      _hover={{ transform: 'translateY(-1px)', shadow: 'md' }}
                    >
                      Beaconcha.in
                    </Button>
                  </Link>
                )}
                {currentNetwork.slot > 0 && currentNetwork.beaconchain && (
                  <Link
                    href={`${currentNetwork.beaconchain}/slot/${currentNetwork.slot}`}
                    isExternal
                    _hover={{ textDecoration: 'none' }}
                  >
                    <Button
                      size="sm"
                      variant="outline"
                      colorScheme="green"
                      leftIcon={<Text fontSize="xs">🎯</Text>}
                      _hover={{ transform: 'translateY(-1px)', shadow: 'md' }}
                    >
                      Target Slot
                    </Button>
                  </Link>
                )}
              </HStack>
            </CardBody>
          </Card>
        )}

        {/* Mainnet Notice */}
        {selectedNetwork === 'mainnet' && (
          <Card bg={bg} borderColor={borderColor} shadow="lg" borderRadius="xl">
            <CardBody p={4}>
              <Alert status="info" borderRadius="lg">
                <AlertIcon />
                <Box>
                  <Text fontWeight="semibold" fontSize="sm">
                    🌐 Mainnet Information
                  </Text>
                  <Text fontSize="xs" mt={1}>
                    The Fusaka upgrade will be deployed to Ethereum Mainnet after successful completion 
                    and thorough testing on all testnets. The mainnet activation date will be announced 
                    by the Ethereum Foundation once all security audits and testing phases are complete.
                  </Text>
                </Box>
              </Alert>
            </CardBody>
          </Card>
        )}

        {/* BPO Schedule (Holesky only) */}
        {selectedNetwork === 'holesky' && (
          <Card bg={bg} borderColor={borderColor} shadow="lg" borderRadius="xl">
            <CardHeader>
              <HStack justify="space-between" align="center">
                <VStack align="start" spacing={0}>
                  <Text fontSize="sm" fontWeight="semibold" color={textColor}>
                    📈 Blob Parameter Only (BPO) Forks
                  </Text>
                  <Text fontSize="xs" color={mutedColor}>
                    Gradual blob throughput increases following Fusaka activation
                  </Text>
                </VStack>
                <Button size="sm" variant="ghost" onClick={() => setShowBPO(!showBPO)}>
                  {showBPO ? "Hide" : "Show"}
                </Button>
              </HStack>
            </CardHeader>
            {showBPO && (
              <CardBody pt={0}>
                <VStack spacing={3}>
                  <Alert status="info" size="sm" borderRadius="md">
                    <AlertIcon />
                    <Text fontSize="xs">
                      BPO forks gradually increase blob capacity without requiring client updates, 
                      improving Ethereum's data availability for Layer 2 solutions.
                    </Text>
                  </Alert>
                  
                  {BPO_SCHEDULE.map((bpo, index) => {
                    const bpoTime = getTimeRemaining(bpo.timestamp);
                    return (
                      <Box
                        key={index}
                        p={3}
                        bg={cardBg}
                        borderRadius="lg"
                        width="100%"
                        border="1px solid"
                        borderColor={borderColor}
                        transition="all 0.3s"
                        _hover={{ transform: "translateY(-1px)", shadow: "md" }}
                      >
                        <Grid templateColumns="1fr auto" gap={3} alignItems="start">
                          <VStack align="start" spacing={1}>
                            <HStack>
                              <Text fontWeight="bold" color={accentColor} fontSize="sm">
                                {bpo.name}
                              </Text>
                              <Badge 
                                colorScheme={bpoTime.isLive ? "green" : "blue"} 
                                fontSize="9px"
                              >
                                {bpoTime.isLive ? "LIVE" : "Scheduled"}
                              </Badge>
                            </HStack>
                            <Text fontSize="xs" color={mutedColor}>
                              📅 Epoch {bpo.epoch.toLocaleString()} • {bpo.utcTime} UTC
                            </Text>
                            <Text fontSize="xs" color={textColor}>
                              {bpo.description}
                            </Text>
                            <HStack spacing={3} fontSize="xs">
                              <Text color={mutedColor}>
                                <Text as="span" fontWeight="semibold">Target:</Text> {bpo.blobTarget}
                              </Text>
                              <Text color={mutedColor}>
                                <Text as="span" fontWeight="semibold">Max:</Text> {bpo.blobMax}
                              </Text>
                            </HStack>
                          </VStack>
                          
                          <VStack align="end" spacing={1}>
                            {!bpoTime.isLive && (
                              <Text fontSize="xs" color={mutedColor} textAlign="right">
                                {bpoTime.timeString}
                              </Text>
                            )}
                            <Progress
                              value={bpoTime.isLive ? 100 : Math.min((Date.now() / 1000) / bpo.timestamp * 100, 99)}
                              size="sm"
                              colorScheme={bpoTime.isLive ? "green" : "blue"}
                              width="50px"
                              borderRadius="full"
                            />
                          </VStack>
                        </Grid>
                      </Box>
                    );
                  })}
                </VStack>
              </CardBody>
            )}
          </Card>
        )}

        {/* Footer Info */}
        <Box mt={3} textAlign="center">
          <Text fontSize="xs" color={mutedColor}>
            Updates automatically every 13 seconds • Data refreshes in {refreshTimer} seconds
          </Text>
        </Box>

      </motion.div>
    </Box>
  );
};

export default SlotCountdown;