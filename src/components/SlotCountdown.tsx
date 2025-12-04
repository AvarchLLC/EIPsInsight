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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Stack,
  Divider,
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
  FaTwitter,
  FaShare,
  FaCheckCircle,
  FaRocket,
} from "react-icons/fa";
import DateTime from "./DateTime";
import confetti from "canvas-confetti";

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
    "Fusaka follows this year's Pectra upgrade, representing a major step forward in Ethereum's scaling roadmap that improves L1 performance, increases blob throughput, and enhances user experience. The Fusaka network upgrade is scheduled to activate on the Ethereum mainnet at slot 13,164,544 (December 3, 2025, 21:49:11 UTC). Fusaka also introduces Blob Parameter Only (BPO) forks to safely scale blob throughput after PeerDAS activation.",
  features: [
    "PeerDAS: Peer Data Availability Sampling for efficient data verification (EIP-7594)",
    "Gas Limit Increase: Raising default gas limit to 60M (EIP-7935)",
    "BPO Forks: Safely scale blob throughput to 10/15 (BPO1) and 14/21 (BPO2)",
    "ModExp Optimization: Accurate pricing for cryptographic operations (EIP-7883 & EIP-7823)",
    "Transaction Gas Limit Cap: Protocol-level cap of 16.7M gas (EIP-7825)",
    "secp256r1 Precompile: Native support for modern secure hardware (EIP-7951)"
  ],
  schedule: {
    holesky: "October 1, 2025 - 08:48 UTC ✅ MERGED",
    sepolia: "October 14, 2025 - 07:36 UTC ✅ MERGED",
    hoodi: "October 28, 2025 - 18:53 UTC ✅ MERGED",
    mainnet: "December 3, 2025 - 21:49:11 UTC 🚀",
  },
  readMore: {
    label: "Read more about FUSAKA",
    href:
      "https://eipsinsight.com/upgrade/fusaka",
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
  const [viewMode, setViewMode] = useState<"slots" | "epochs">("slots");
  const [showInfo, setShowInfo] = useState<boolean>(false);
  const [mergedNetworks, setMergedNetworks] = useState<Set<string>>(new Set());
  const [showFeatures, setShowFeatures] = useState<boolean>(false);
  const [celebrationSeen, setCelebrationSeen] = useState<boolean>(() => {
    return localStorage.getItem('fusaka-celebration-seen') === 'true';
  });
  const { isOpen: isCelebrationOpen, onOpen: onCelebrationOpen, onClose: onCelebrationClose } = useDisclosure();

  const accent = getAccent(network, useColorModeValue(true, false));

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Confetti celebration function
  const triggerConfetti = () => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      
      // Shoot confetti from left side
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      // Shoot confetti from right side
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
  };

  // Twitter share function with direct image sharing
  const shareOnTwitter = async () => {
    const baseUrl = "https://eipsinsight.com";
    const networkUrl = `${baseUrl}/upgrade?selected=fusaka#fusaka`;
    
    const text = network === 'mainnet' 
      ? `🚀 FUSAKA is now live on Ethereum Mainnet! 
PeerDAS activated, 60M gas limit, BPO forks incoming!
The future of Ethereum scaling is here! 🎉

📊 Track all EIPs: ${networkUrl}

#FUSAKA #Ethereum #PeerDAS #EIPsInsight`
      : `✅ FUSAKA successfully merged on ${networks[network].name}! 
Testing complete, ready for mainnet! 🎯

📊 Track all EIPs: ${networkUrl}

#FUSAKA #Ethereum #${network.charAt(0).toUpperCase() + network.slice(1)} #EIPsInsight`;
    
    // Generate custom image with confetti
    const imageUrl = await generateShareImage();
    
    if (imageUrl) {
      // Convert image to base64 for Twitter sharing
      try {
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const reader = new FileReader();
        
        reader.onloadend = async () => {
          const base64data = reader.result;
          
          // Create a more comprehensive share experience
          const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(networkUrl)}`;
          
          // Open Twitter with pre-filled content
          window.open(twitterUrl, '_blank');
          
          // Show notification about the image
          setTimeout(() => {
            console.log('📸 Celebration image ready! Upload it to your Twitter post for maximum impact!');
          }, 1000);
        };
        
        reader.readAsDataURL(blob);
      } catch (error) {
        console.error('Error preparing image for sharing:', error);
        // Fallback to just text sharing
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(networkUrl)}`;
        window.open(twitterUrl, '_blank');
      }
    } else {
      // Fallback if image generation fails
      const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(networkUrl)}`;
      window.open(twitterUrl, '_blank');
    }
  };

  // Generate custom share image with confetti
  const generateShareImage = async () => {
    try {
      // Create canvas element
      const canvas = document.createElement('canvas');
      canvas.width = 1200;
      canvas.height = 630;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) return null;
      
      // Professional dark blue gradient background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, '#0f172a');  // Dark blue-black
      gradient.addColorStop(0.3, '#1e293b'); // Medium dark blue
      gradient.addColorStop(0.7, '#334155'); // Lighter blue
      gradient.addColorStop(1, '#475569');   // Gray-blue
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Add subtle grid pattern for tech feel
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.lineWidth = 1;
      for (let i = 0; i < canvas.width; i += 30) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
      }
      for (let i = 0; i < canvas.height; i += 30) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
      }
      
      // Add decorative circles in background
      ctx.fillStyle = 'rgba(59, 130, 246, 0.1)'; // Blue with opacity
      ctx.beginPath();
      ctx.arc(150, 150, 100, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.fillStyle = 'rgba(139, 92, 246, 0.1)'; // Purple with opacity
      ctx.beginPath();
      ctx.arc(canvas.width - 150, canvas.height - 150, 120, 0, Math.PI * 2);
      ctx.fill();
      
      // Add confetti effect - more vibrant and visible
      const confettiColors = [
        '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16',
        '#22c55e', '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9',
        '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef',
        '#ec4899', '#f43f5e'
      ];
      
      for (let i = 0; i < 80; i++) {
        ctx.fillStyle = confettiColors[Math.floor(Math.random() * confettiColors.length)];
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const width = Math.random() * 12 + 6;
        const height = Math.random() * 6 + 3;
        const opacity = Math.random() * 0.8 + 0.2;
        ctx.globalAlpha = opacity;
        
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(Math.random() * Math.PI * 2);
        ctx.fillRect(-width/2, -height/2, width, height);
        ctx.restore();
      }
      
      ctx.globalAlpha = 1; // Reset opacity
      
      // Main title with strong shadow for visibility
      ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
      ctx.shadowBlur = 20;
      ctx.shadowOffsetX = 4;
      ctx.shadowOffsetY = 4;
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 100px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      const mainText = network === 'mainnet' ? 'FUSAKA IS LIVE!' : 'FUSAKA MERGED!';
      ctx.fillText(mainText, canvas.width / 2, canvas.height / 2 - 60);
      
      // Reset shadow for other elements
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      
      // Subtitle with good contrast
      ctx.font = '40px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
      ctx.fillStyle = '#e2e8f0';
      const subtitle = network === 'mainnet' 
        ? 'Ethereum Mainnet Upgrade Successful' 
        : `${networks[network].name} Testnet Success`;
      ctx.fillText(subtitle, canvas.width / 2, canvas.height / 2 + 30);
      
      // Network badge with gradient and border
      const badgeX = canvas.width / 2 - 120;
      const badgeY = canvas.height / 2 + 70;
      const badgeWidth = 240;
      const badgeHeight = 60;
      
      // Badge background gradient
      const badgeGradient = ctx.createLinearGradient(badgeX, badgeY, badgeX + badgeWidth, badgeY + badgeHeight);
      if (network === 'mainnet') {
        badgeGradient.addColorStop(0, '#3b82f6');
        badgeGradient.addColorStop(1, '#1d4ed8');
      } else {
        badgeGradient.addColorStop(0, '#10b981');
        badgeGradient.addColorStop(1, '#047857');
      }
      
      ctx.fillStyle = badgeGradient;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 2;
      
      // Rounded rectangle for badge
      const radius = 30;
      ctx.beginPath();
      ctx.moveTo(badgeX + radius, badgeY);
      ctx.lineTo(badgeX + badgeWidth - radius, badgeY);
      ctx.quadraticCurveTo(badgeX + badgeWidth, badgeY, badgeX + badgeWidth, badgeY + radius);
      ctx.lineTo(badgeX + badgeWidth, badgeY + badgeHeight - radius);
      ctx.quadraticCurveTo(badgeX + badgeWidth, badgeY + badgeHeight, badgeX + badgeWidth - radius, badgeY + badgeHeight);
      ctx.lineTo(badgeX + radius, badgeY + badgeHeight);
      ctx.quadraticCurveTo(badgeX, badgeY + badgeHeight, badgeX, badgeY + badgeHeight - radius);
      ctx.lineTo(badgeX, badgeY + radius);
      ctx.quadraticCurveTo(badgeX, badgeY, badgeX + radius, badgeY);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      
      // Network text
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 28px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
      const networkText = network === 'mainnet' ? 'MAINNET' : networks[network].name.toUpperCase();
      ctx.fillText(networkText, canvas.width / 2, badgeY + badgeHeight / 2 + 5);
      
      // EIPs Insight branding section - enhanced
      const brandingY = canvas.height - 100;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
      ctx.fillRect(50, brandingY, canvas.width - 100, 80);
      
      // Add subtle border to branding box
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.3)';
      ctx.lineWidth = 1;
      ctx.strokeRect(50, brandingY, canvas.width - 100, 80);
      
      // EIPs Insight text
      ctx.fillStyle = '#1e293b';
      ctx.font = 'bold 32px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
      ctx.fillText('📊 EIPs Insight', canvas.width / 2 - 180, brandingY + 35);
      
      ctx.font = '24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
      ctx.fillText('Track all Ethereum EIPs', canvas.width / 2 - 180, brandingY + 65);
      
      ctx.fillStyle = '#3b82f6';
      ctx.font = 'bold 26px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
      ctx.fillText('eipsinsight.com', canvas.width / 2 + 80, brandingY + 50);
      
      // Add timestamp
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.font = '14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
      const timestamp = new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
      ctx.fillText(timestamp, canvas.width / 2, canvas.height - 20);
      
      // Convert to blob
      return new Promise<string | null>((resolve) => {
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            resolve(url);
          } else {
            resolve(null);
          }
        }, 'image/png');
      });
    } catch (error) {
      console.error('Error generating share image:', error);
      return null;
    }
  };

  // Download image helper
  const downloadShareImage = async () => {
    const imageUrl = await generateShareImage();
    if (imageUrl) {
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = `fusaka-${network}-celebration.png`;
      link.click();
      URL.revokeObjectURL(imageUrl);
    }
  };

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

      // Check if upgrade just went live and trigger celebration
      if (target !== 999999999 && slot >= target && !mergedNetworks.has(network)) {
        setIsUpgradeLive(true);
        setCountdown("");
        setMergedNetworks(prev => new Set(prev).add(network));
        
        // Trigger confetti celebration
        triggerConfetti();
        
        // Open celebration modal for mainnet once, unless already seen and closed
        if (network === 'mainnet' && !celebrationSeen) {
          setTimeout(() => onCelebrationOpen(), 500);
        }
        
        if (countdownIntervalRef.current)
          clearInterval(countdownIntervalRef.current);
        return;
      } else if (target !== 999999999 && slot < target) {
        setIsUpgradeLive(false);
      }

      if (target !== 999999999 && !isUpgradeLive) {
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

  const handleCelebrationClose = () => {
    setCelebrationSeen(true);
    localStorage.setItem('fusaka-celebration-seen', 'true');
    onCelebrationClose();
  };

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
          <HStack spacing={2} wrap="wrap" justify="center" px={2}>
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
                    w="85px"
                    h="85px"
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
                    fontSize="15px"
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
          
          <HStack spacing={2} wrap="wrap" justify="center" px={2}>
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
                    w="85px"
                    h="85px"
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
                    fontSize="15px"
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
                    w="85px"
                    h="85px"
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
          <HStack spacing={2} wrap="wrap" justify="center">
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
                    w="85px"
                    h="85px"
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
                    fontSize="15px"
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
          
          <HStack spacing={2} wrap="wrap" justify="center">
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
                    w="85px"
                    h="85px"
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
                    fontSize="15px"
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
                    w="85px"
                    h="85px"
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
          <option value="slots">Slots</option>
          <option value="epochs">Epochs</option>
        </Select>
      </Flex>

      {/* NETWORK SELECTION */}
      <Box>
        <Text fontSize="sm" fontWeight="medium" color={useColorModeValue("gray.600", "gray.400")} mb={2} textAlign="center">
          Select Network to Track
        </Text>
        <HStack spacing={3} justify="center" wrap="wrap">
          {Object.keys(networks).map((net) => (
            <Button
              key={net}
              colorScheme={network === net ? (net === "mainnet" ? "blue" : net === "hoodi" ? "orange" : net === "sepolia" ? "purple" : "blue") : "gray"}
              onClick={() => handleNetworkChange(net)}
              variant={network === net ? "solid" : "outline"}
              size="sm"
              _hover={{ transform: "translateY(-1px)", shadow: "md" }}
              transition="all 0.2s"
              position="relative"
              overflow="hidden"
            >
              {net.charAt(0).toUpperCase() + net.slice(1)}
              {(net === "holesky" || net === "sepolia" || net === "hoodi") && (
                <Badge ml={1} colorScheme="green" fontSize="9px" variant="solid">
                  ✅ MERGED
                </Badge>
              )}
              {net === "mainnet" && <Badge ml={1} colorScheme="blue" fontSize="9px" variant="solid">DEC 3</Badge>}
              {mergedNetworks.has(net) && (
                <Box
                  position="absolute"
                  top="-2px"
                  right="-2px"
                  width="4px"
                  height="4px"
                  bg="green.400"
                  borderRadius="full"
                  animation="pulse 2s infinite"
                />
              )}
            </Button>
          ))}
        </HStack>

        {/* Twitter Share Button - Show when any network is merged, but only show for mainnet AFTER merge */}
        {(mergedNetworks.size > 0 && network !== 'mainnet') || (mergedNetworks.has('mainnet') && network === 'mainnet') ? (
          <Box mt={6} mb={4}>
            <VStack spacing={4}>
              <button
                onClick={shareOnTwitter}
                className="group relative overflow-hidden bg-gradient-to-br from-[#1DA1F2] to-[#1a8cd8] text-white font-bold text-lg px-8 py-4 rounded-2xl min-w-[300px] h-16 shadow-lg hover:shadow-2xl transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-[1.02] active:translate-y-0 active:scale-[1.01] border-2 border-white/20 flex items-center justify-center gap-2 before:absolute before:top-0 before:left-[-100%] before:w-full before:h-full before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:transition-all before:duration-500 hover:before:left-[100%]"
              >
                <FaTwitter className="w-5 h-5" />
                <span>Share on Twitter</span>
                <span className="text-xl">✨</span>
                <span className="text-lg">🎉</span>
              </button>
            </VStack>
          </Box>
        ) : null}
      </Box>

      {/* COUNTDOWN STATUS - ONE LINE */}
      {loading ? (
        <VStack spacing={3} py={6}>
          <Spinner size="lg" color={accent} />
          <Text color={useColorModeValue("gray.600", "gray.400")} fontSize="sm">
            Loading {networks[network].name} network data...
          </Text>
        </VStack>
      ) : /* CELEBRATION CONTENT - INLINE */
      (isUpgradeLive || slotsRemaining <= 0) ? (
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
          
          <button
            onClick={triggerConfetti}
            className="group relative overflow-hidden bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white font-bold text-lg px-8 py-4 rounded-2xl min-w-[300px] h-16 shadow-lg hover:shadow-2xl transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-[1.02] active:translate-y-0 active:scale-[1.01] border-2 border-white/20 flex items-center justify-center gap-2 before:absolute before:top-0 before:left-[-100%] before:w-full before:h-full before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:transition-all before:duration-500 hover:before:left-[100%]"
          >
            <FaRocket className="w-5 h-5" />
            <span>Trigger Celebration</span>
            <span className="text-xl">🎊</span>
            <span className="text-lg">🎉</span>
          </button>
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
