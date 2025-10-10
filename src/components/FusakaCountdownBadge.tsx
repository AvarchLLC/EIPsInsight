import React, { useState, useEffect } from "react";
import {
  Box,
  Text,
  Badge,
  HStack,
  VStack,
  useColorModeValue,
  Tooltip,
} from "@chakra-ui/react";
import { keyframes } from '@chakra-ui/system';
import { motion } from "framer-motion";
import { useRouter } from 'next/router';

// Animation keyframes
const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const glow = keyframes`
  0% { box-shadow: 0 0 5px rgba(102, 126, 234, 0.5); }
  50% { box-shadow: 0 0 20px rgba(102, 126, 234, 0.8); }
  100% { box-shadow: 0 0 5px rgba(102, 126, 234, 0.5); }
`;

interface FusakaCountdownBadgeProps {
  variant?: 'compact' | 'detailed';
  showIcon?: boolean;
  clickable?: boolean;
}

// Official Fusaka Networks (subset for badge)
const FUSAKA_NETWORKS = {
  holesky: {
    name: "Holesky",
    timestamp: 1727773680, // 2025-10-01 08:48:00 UTC
    isNext: true,
  },
  sepolia: {
    name: "Sepolia", 
    timestamp: 1728891360, // 2025-10-14 07:36:00 UTC
    isNext: false,
  }
};

const FusakaCountdownBadge: React.FC<FusakaCountdownBadgeProps> = ({
  variant = 'compact',
  showIcon = true,
  clickable = true
}) => {
  const [currentTime, setCurrentTime] = useState<number>(Math.floor(Date.now() / 1000));
  const router = useRouter();

  // Color theme
  const bg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("blue.200", "blue.600");
  const textColor = useColorModeValue("gray.800", "white");
  const accentColor = useColorModeValue("blue.600", "blue.300");
  const mutedColor = useColorModeValue("gray.600", "gray.400");

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Math.floor(Date.now() / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Get next upcoming network
  const getNextNetwork = () => {
    const now = currentTime;
    
    // Find the next upcoming activation
    for (const [key, network] of Object.entries(FUSAKA_NETWORKS)) {
      if (network.timestamp > now) {
        return { key, ...network };
      }
    }
    
    // If all are passed, return the last one as "completed"
    return { key: 'holesky', ...FUSAKA_NETWORKS.holesky, isCompleted: true };
  };

  // Calculate time remaining
  const getTimeRemaining = (timestamp: number) => {
    const now = currentTime;
    const diff = timestamp - now;
    
    if (diff <= 0) return { isLive: true, timeString: "LIVE!" };
    
    const days = Math.floor(diff / 86400);
    const hours = Math.floor((diff % 86400) / 3600);
    const minutes = Math.floor((diff % 3600) / 60);
    
    if (days > 0) return { isLive: false, timeString: `${days}d`, days, hours, minutes };
    if (hours > 0) return { isLive: false, timeString: `${hours}h`, days, hours, minutes };
    return { isLive: false, timeString: `${minutes}m`, days, hours, minutes };
  };

  const nextNetwork = getNextNetwork();
  const { isLive, timeString, days = 0, hours = 0, minutes = 0 } = getTimeRemaining(nextNetwork.timestamp);
  const timeData = { isLive, timeString, days, hours, minutes };

  const handleClick = () => {
    if (clickable) {
      router.push('/upgrade');
    }
  };

  if (variant === 'compact') {
    return (
      <Tooltip 
        label={`Click to view FUSAKA upgrade details for ${nextNetwork.name}`} 
        placement="top"
        isDisabled={!clickable}
      >
        <motion.div
          whileHover={clickable ? { scale: 1.05 } : {}}
          whileTap={clickable ? { scale: 0.95 } : {}}
          transition={{ duration: 0.2 }}
        >
          <Badge
            variant="outline"
            colorScheme={timeData.isLive ? "yellow" : "yellow"}
            p={2}
            borderRadius="lg"
            cursor={clickable ? "pointer" : "default"}
            onClick={handleClick}
            bg={bg}
            borderColor={borderColor}
            border="2px solid"
            animation={timeData.isLive ? `${pulse} 2s infinite` : `${glow} 3s infinite`}
            _hover={clickable ? { 
              transform: 'translateY(-1px)',
              shadow: 'lg',
              borderColor: useColorModeValue("yellow.300", "yellow.500")
            } : {}}
            transition="all 0.3s"
          >
            <HStack spacing={1}>
              {showIcon && <Text fontSize="xs">🦓</Text>}
              <Text fontSize="xs" fontWeight="bold">
                {timeData.isLive ? 'Fusaka countdown' : `Fusaka in ${timeData.timeString}`}
              </Text>
            </HStack>
          </Badge>
        </motion.div>
      </Tooltip>
    );
  }

  // Detailed variant
  return (
    <Tooltip 
      label={`Click to view FUSAKA upgrade details`} 
      placement="top"
      isDisabled={!clickable}
    >
      <motion.div
        whileHover={clickable ? { scale: 1.02 } : {}}
        whileTap={clickable ? { scale: 0.98 } : {}}
        transition={{ duration: 0.2 }}
      >
        <Box
          p={3}
          bg={bg}
          borderColor={borderColor}
          border="2px solid"
          borderRadius="xl"
          cursor={clickable ? "pointer" : "default"}
          onClick={handleClick}
          animation={timeData.isLive ? `${pulse} 2s infinite` : `${glow} 3s infinite`}
          _hover={clickable ? { 
            transform: 'translateY(-2px)',
            shadow: 'xl',
            borderColor: useColorModeValue("blue.300", "blue.500")
          } : {}}
          transition="all 0.3s"
          maxW="200px"
        >
          <VStack spacing={2}>
            <HStack spacing={2}>
              {showIcon && (
                <Box
                  bg="linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)"
                  p={1}
                  borderRadius="full"
                  animation={`${pulse} 3s infinite`}
                >
                  <Text fontSize="sm">🦓</Text>
                </Box>
              )}
              <VStack spacing={0} align="start">
                <Text fontSize="sm" fontWeight="bold" color={accentColor}>
                  FUSAKA Upgrade
                </Text>
                <Text fontSize="xs" color={mutedColor}>
                  {nextNetwork.name} Testnet
                </Text>
              </VStack>
            </HStack>
            
            <Box textAlign="center">
              {timeData.isLive ? (
                <Badge colorScheme="yellow" fontSize="xs" p={1}>
                  🦓 Countdown Active!
                </Badge>
              ) : (
                <VStack spacing={1}>
                  <Text fontSize="lg" fontWeight="bold" color={accentColor}>
                    {timeData.timeString}
                  </Text>
                  <Text fontSize="xs" color={mutedColor}>
                    {timeData.days > 0 && `${timeData.days} days`}
                    {timeData.days > 0 && timeData.hours > 0 && ', '}
                    {timeData.hours > 0 && `${timeData.hours}h`}
                    {timeData.minutes > 0 && timeData.days === 0 && `, ${timeData.minutes}m`}
                  </Text>
                </VStack>
              )}
            </Box>

            <Badge colorScheme="yellow" fontSize="9px" variant="subtle">
              Click for details
            </Badge>
          </VStack>
        </Box>
      </motion.div>
    </Tooltip>
  );
};

export default FusakaCountdownBadge;