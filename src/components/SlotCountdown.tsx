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
  Card,
  CardBody,
  Icon,
  Collapse,
  useColorModeValue,
  chakra
} from "@chakra-ui/react";
import { keyframes } from '@chakra-ui/system';
import { motion } from "framer-motion";
import {
  FaRocket,
  FaNetworkWired,
  FaClock,
  FaInfoCircle,
  FaChevronDown,
  FaChevronUp,
  FaBook
} from 'react-icons/fa';
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
  // NOTE: placeholder - replace if you get Hoodi endpoint!
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
    target: Number.MAX_SAFE_INTEGER,
    targetepoch: Number.MAX_SAFE_INTEGER,
    name: "Mainnet",
  },
};

const FUSAKA_INFO = {
  title: "FUSAKA Network Upgrade",
  description: "Ethereum's next major upgrade focusing on enhanced blob throughput and network efficiency.",
  features: [
    "Increased blob capacity for Layer 2 scaling",
    "Improved data availability for rollups",
    "Network optimization and efficiency improvements",
    "Enhanced security and validator performance"
  ],
  schedule: {
    holesky: "October 1, 2025 - 08:48 UTC",
    sepolia: "October 14, 2025 - 07:36 UTC",
    hoodi: "October 28, 2025 - 18:53 UTC",
    mainnet: "To be announced after testnet completion"
  },
  readMore: {
    label: "Read more about FUSAKA",
    href: "https://etherworld.co/2025/10/01/bpo-forks-explained-how-fusaka-gradually-scales-blob-capacity/"
  }
};

const celebrateAnimation = keyframes`
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.2); opacity: 0.8; }
  100% { transform: scale(1); opacity: 1; }
`;

const getAccent = (network: string, light: boolean) => {
  if (network === 'holesky') return light ? 'blue.600' : 'blue.300';
  if (network === 'sepolia') return light ? 'purple.600' : 'purple.300';
  if (network === 'hoodi') return light ? 'orange.600' : 'orange.300';
  return light ? 'gray.700' : 'gray.200';
}

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
      if (!beaconApi || !rpc) throw new Error("Beacon/RPC URL not configured for this network.");

      const beaconResponse = await fetch(`${beaconApi}/eth/v1/beacon/headers/head`);
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
        if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
        return;
      } else {
        setIsUpgradeLive(false);
      }

      if (target !== 999999999 && !isUpgradeLive) {
        let slotsRemaining: number = target - slot;
        let totalSecondsRemaining: number = slotsRemaining * 12;

        if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);

        countdownIntervalRef.current = setInterval(() => {
          if (totalSecondsRemaining <= 0) {
            clearInterval(countdownIntervalRef.current!);
            setCountdown("0D 0H 0M 0S");
            return;
          }
          totalSecondsRemaining -= 1;
          const days: number = Math.floor(totalSecondsRemaining / (3600 * 24));
          const hours: number = Math.floor((totalSecondsRemaining % (3600 * 24)) / 3600);
          const minutes: number = Math.floor((totalSecondsRemaining % 3600) / 60);
          const seconds: number = Math.floor(totalSecondsRemaining % 60);
          setCountdown(`${days}D ${hours}H ${minutes}M ${seconds}S`);
        }, 1000);
      } else {
        setCountdown("");
        if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
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
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    };
    // eslint-disable-next-line
  }, [network]);

  const handleNetworkChange = (newNetwork: keyof typeof networks) => {
    setNetwork(newNetwork);
    setLoading(true);
  };

  const slotsRemaining = networks[network].target - currentSlot;
  const epochsRemaining = networks[network].targetepoch - currentEpoch;

  // --- Visual Components ---
  const InfoCard = ({ children }: { children: React.ReactNode }) => (
    <Box
      maxWidth="670px"
      mx="auto"
      borderRadius="xl"
      boxShadow="2xl"
      bg={useColorModeValue("gray.50", "gray.800")}
      p={4}
      mt={2}
      mb={2}
      border="1.5px solid"
      borderColor={useColorModeValue("gray.200", "gray.700")}
      color={accent}
    >
      {children}
    </Box>
  );

  const StatusCard = (props: { bg: string, borderColor: string, icon: React.ReactNode, title: string, subtitle: string, badgeLabel?: string, badgeColor?: string, animate?: string }) => (
    <Card bg={props.bg} border="2px solid" borderColor={props.borderColor} mx="auto" my={4} maxW="700px" borderRadius="lg" p={0}>
      <CardBody textAlign="center" px={{ base: 4, md: 8 }} py={6}>
        <VStack spacing={3}>
          <Flex align="center" justify="center">
            <chakra.span fontSize="2xl" mr={3}>{props.icon}</chakra.span>
            <Text fontSize="2xl" fontWeight="bold" color={accent} animation={props.animate}>{props.title}</Text>
          </Flex>
          <Text fontSize="md" color={useColorModeValue("gray.700", "gray.200")}>{props.subtitle}</Text>
          {props.badgeLabel &&
            <Badge colorScheme={props.badgeColor || "green"} fontSize="0.9em" px={2} py={1} borderRadius="sm">
              {props.badgeLabel}
            </Badge>
          }
        </VStack>
      </CardBody>
    </Card>
  );

  // --- Slots/Epochs View ---
  const renderSlotsView = () => {
    const startSlot = currentEpoch * 32;
    const slotsInEpoch = Array.from({ length: 32 }, (_, i) => startSlot + i);
    const firstRowSlots = slotsInEpoch.slice(0, 20);
    const secondRowSlots = slotsInEpoch.slice(20);

    return (
      <>
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
          <Tooltip
            label={`Target Slot: ${networks[network].target}, Date: ${FUSAKA_INFO.schedule[network as keyof typeof FUSAKA_INFO.schedule]}`}
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
  };

  const renderEpochsView = () => (
    <HStack spacing={1} wrap="wrap" justify="center">
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
      <Tooltip
        label={`Target epoch: ${networks[network].target}, Date: ${FUSAKA_INFO.schedule[network as keyof typeof FUSAKA_INFO.schedule]}`}
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

  // --- Render ---
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Info/Upgrade Card */}
        <InfoCard>
          <Flex align="center" justify="space-between">
            <HStack spacing={2}>
              <Icon as={FaInfoCircle} color={accent} />
              <Text fontWeight="bold" color={accent}>FUSAKA Network Upgrade</Text>
              <Badge colorScheme="purple" variant="subtle" fontSize="9px">Info</Badge>
            </HStack>
            <Button
              onClick={() => setShowInfo((prev) => !prev)}
              size="sm"
              variant="ghost"
              color={accent}
              rightIcon={showInfo ? <FaChevronUp /> : <FaChevronDown />}
              aria-label={showInfo ? "Hide info" : "Show info"}
              _hover={{ bg: useColorModeValue("gray.200", "gray.600") }}
            >
              {showInfo ? "Hide" : "More"}
            </Button>
          </Flex>
          <Collapse in={showInfo} animateOpacity>
            <Box mt={3} mb={2} px={2} color={useColorModeValue(accent, "gray.200")}>
              <Text fontWeight="bold" fontSize="md">{FUSAKA_INFO.title}</Text>
              <Text fontSize="sm" mb={2}>{FUSAKA_INFO.description}</Text>
              <Text fontWeight="semibold" fontSize="sm" mb={1}>Key Features:</Text>
              <ul style={{ marginLeft: 18, marginBottom: 8 }}>
                {FUSAKA_INFO.features.map((f, i) => (
                  <li key={i} style={{ fontSize: 13, marginBottom:2 }}>{f}</li>
                ))}
              </ul>
              <Text fontWeight="semibold" fontSize="sm" mb={1}>Activation Schedule:</Text>
              <ul style={{ marginLeft: 18, marginBottom: 8 }}>
                {Object.entries(FUSAKA_INFO.schedule).map(([net, date]) => (
                  <li key={net} style={{ fontSize: 13 }}>
                    <b>{net.charAt(0).toUpperCase() + net.slice(1)}:</b> {date}
                  </li>
                ))}
              </ul>
              <Button
                as="a"
                href={FUSAKA_INFO.readMore.href}
                target="_blank"
                leftIcon={<FaBook />}
                colorScheme="blue"
                mt={1}
                size="sm"
                variant="outline"
                fontWeight="semibold"
              >
                {FUSAKA_INFO.readMore.label}
              </Button>
            </Box>
          </Collapse>
        </InfoCard>

        {/* Top Heading/Controls */}
        <Box
          textAlign="center"
          p={5}
          maxWidth="970px"
          mx="auto"
          mt={1}
          borderRadius="lg"
          boxShadow="md"
          bg={useColorModeValue("white", "gray.800")}
          color={accent}
        >
          <Flex
            alignItems="center"
            justify="space-between"
            flexDirection={{ base: "column", md: "row" }}
            gap={2}
          >
            <HStack justify="center" spacing={2}>
              <Icon as={FaNetworkWired} color={accent}/>
              <Text
                as={motion.div}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                fontSize={{ base: "xl", md: "2xl", lg: "2xl" }}
                fontWeight="bold"
                color={accent}
                whiteSpace="nowrap"
              >
                Live Countdown – {networks[network].name} Network
              </Text>
              <Badge colorScheme={network === 'mainnet' ? 'gray' : 'green'} variant="solid">
                {network === 'mainnet' ? 'TBD' : 'TESTNET'}
              </Badge>
            </HStack>
            <Select
              value={viewMode}
              onChange={(e) => setViewMode(e.target.value as "slots" | "epochs")}
              maxW="180px"
              bg={useColorModeValue("gray.100", "gray.700")}
              color={accent}
              size="sm"
            >
              <option value="epochs">Epoch</option>
              <option value="slots">Slot</option>
            </Select>
          </Flex>
        </Box>

        {/* Network Toggle Buttons */}
        <HStack spacing={4} justify="center" py={3}>
          <Button
            colorScheme={network === "holesky" ? "blue" : "gray"}
            onClick={() => handleNetworkChange("holesky")}
            leftIcon={<span role="img" aria-label="flask">🧪</span>}
            variant={network === "holesky" ? "solid" : "outline"}
            size="sm"
          >
            Holesky
            <Badge ml={2} colorScheme="orange" fontSize="9px">FINAL</Badge>
          </Button>
          <Button
            colorScheme={network === "sepolia" ? "purple" : "gray"}
            onClick={() => handleNetworkChange("sepolia")}
            leftIcon={<span role="img" aria-label="flask">🧪</span>}
            variant={network === "sepolia" ? "solid" : "outline"}
            size="sm"
          >
            Sepolia
          </Button>
          <Button
            colorScheme={network === "hoodi" ? "orange" : "gray"}
            onClick={() => handleNetworkChange("hoodi")}
            leftIcon={<span role="img" aria-label="flask">🧪</span>}
            variant={network === "hoodi" ? "solid" : "outline"}
            size="sm"
          >
            Hoodi
            <Badge ml={2} colorScheme="gray" fontSize="9px">?</Badge>
          </Button>
          <Button
            colorScheme={network === "mainnet" ? "gray" : "gray"}
            onClick={() => handleNetworkChange("mainnet")}
            leftIcon={<span role="img" aria-label="globe">🌐</span>}
            variant={network === "mainnet" ? "solid" : "outline"}
            size="sm"
            isDisabled={true}
          >
            Mainnet
            <Badge ml={2} colorScheme="gray" fontSize="9px">TBD</Badge>
          </Button>
        </HStack>
        {/* Status Area */}
        {loading
          ? <VStack spacing={4} py={8}><Spinner size="xl" color={accent} /><Text color={accent}>Loading {networks[network].name} data...</Text></VStack>
          : network === "mainnet"
            ? <StatusCard
                bg={useColorModeValue("gray.50", "gray.700")}
                borderColor={useColorModeValue("gray.200", "gray.600")}
                icon={<FaInfoCircle />}
                title="Mainnet Date To Be Announced"
                subtitle="The FUSAKA upgrade will be deployed to Ethereum Mainnet after successful testnet upgrades. Watch here for date announcements!"
                badgeLabel="Follow testnet progress"
                badgeColor="blue"
              />
          : (isUpgradeLive || slotsRemaining <= 0)
            ? <StatusCard
                bg={useColorModeValue("green.50", "green.800")}
                borderColor={useColorModeValue("green.200", "green.400")}
                icon="🎉"
                title={`FUSAKA is live on ${networks[network].name.toUpperCase()}!`}
                subtitle={`The upgrade is now active and finalized on ${networks[network].name}.`}
                badgeLabel="Activated"
                badgeColor="green"
                animate={`${celebrateAnimation} 0.85s infinite`}
              />
        :
        <>
          <Box mb={4} bg={useColorModeValue("white", "gray.900")} p={4} borderRadius="md">
            <HStack justify="center" spacing={4}>
              <Flex align="center">
                <Icon as={FaClock} color={accent} mr={1}/>
                <Text fontSize="lg" fontWeight="bold" color={accent}>
                  {countdown || "Calculating..."}
                </Text>
              </Flex>
              <Text fontSize="sm" color={accent}>
                until FUSAKA on {networks[network].name}
              </Text>
              <Text fontSize="sm" color="gray.400">•</Text>
              <Text fontSize="sm" color={accent}>
                {slotsRemaining.toLocaleString()} slots ({epochsRemaining.toLocaleString()} epochs) away
              </Text>
            </HStack>
          </Box>
          <Box
            as={motion.div}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            bg={useColorModeValue("gray.50", "gray.800")}
            color={accent}
            borderRadius="md"
            p={4}
            mb={4}
            border="1px solid"
            borderColor={useColorModeValue("gray.200", "gray.700")}
          >
            {viewMode === "slots" ? renderSlotsView() : renderEpochsView()}
          </Box>
          <HStack justify="center" spacing={4} fontSize="xs" color={useColorModeValue("gray.500", "gray.400")}>
            <HStack spacing={1}>
              <Icon as={FaClock} boxSize={3} />
              <Text>Auto-refresh in {timer}s</Text>
            </HStack>
          </HStack>
        </>
        }
        <DateTime/>
      </motion.div>
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
