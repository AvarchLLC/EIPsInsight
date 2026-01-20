import React, { useState } from "react";
import { Box, Flex, Text, Badge, Image, useColorModeValue, Icon, CloseButton, usePrefersReducedMotion } from "@chakra-ui/react";
import { motion } from 'framer-motion';
import { keyframes } from "@emotion/react";
import { FiExternalLink, FiClock, FiShield, FiTrendingUp } from "react-icons/fi";
import { trackFeatureUsage } from "@/utils/analytics";

const etherWorldLogo = "https://etherworld.co/favicon.ico";

// Flashy animations for small ad
const sheen = keyframes`
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
`;

const flashyPulse = keyframes`
  0%, 100% { 
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.4);
  }
  50% { 
    transform: scale(1.02);
    box-shadow: 0 0 0 8px rgba(34, 197, 94, 0), 0 0 20px rgba(34, 197, 94, 0.3);
  }
`;

const MotionBox = motion(Box);

const CloseableAdCard: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  const handleClick = () => {
    trackFeatureUsage("ad_etherworld", "click");
    window.open("https://etherworld.co/", "_blank", "noopener,noreferrer");
  };

  // Use the requested solid stagnant colors for light/dark modes (no gradients).
  const primaryBg = useColorModeValue('#B8DBEF', '#213B61');
  const primaryBorder = useColorModeValue('#B8DBEF', '#213B61');
  const glowColor = useColorModeValue('rgba(184,219,239,0.75)', 'rgba(33,59,97,0.75)');
  const boxShadowVal = useColorModeValue(
    `0 10px 30px rgba(184,219,239,0.12), 0 0 80px rgba(184,219,239,0.28)`,
    `0 10px 30px rgba(33,59,97,0.12), 0 0 80px rgba(33,59,97,0.28)`
  );

  return (
      <MotionBox
      as="aside"
      role="complementary"
      aria-label="EtherWorld sponsor promotion"
      position="relative"
      overflow="visible" /* allow glow to escape */
      bg={primaryBg}
      borderRadius="lg"
      borderWidth="1px"
      borderColor={primaryBorder}
      p={1}
      w="100%"
      maxW="500px"
      minH="50px"
      mx="auto"
      cursor="pointer"
      onClick={handleClick}
      _hover={{
        transform: "translateY(-3px) scale(1.01)",
        boxShadow: useColorModeValue('0 8px 24px rgba(0,0,0,0.08)', '0 8px 24px rgba(0,0,0,0.4)'),
      }}
  boxShadow={boxShadowVal}
  sx={{ transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}
      tabIndex={0}
      onKeyDown={(e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
      _focusVisible={{
        outline: "3px solid",
        outlineColor: useColorModeValue("green.500", "green.400"),
        outlineOffset: "2px",
      }}
  initial={{ scale: 1 }}
  // Permanently reduced: no idle pulsing, keep only hover feedback
  animate={{ scale: 1 }}
  transition={{ duration: 0 }}
      style={{ willChange: 'transform' }}
    >
      {/* glow removed per request */}
      {/* Close Button */}
      <CloseButton
        position="absolute"
        right={2}
        top={2}
        size="sm"
        onClick={(e) => {
          e.stopPropagation();
          setIsVisible(false);
        }}
        aria-label="Close advertisement"
        zIndex={3}
        bg={useColorModeValue("white", "gray.800")}
        _hover={{
          bg: useColorModeValue("gray.100", "gray.700"),
        }}
      />

      {/* No sheen/gradient overlay — using solid stagnant color per theme */}

      {/* Ultra-Compact Information Dense Layout */}
      <Flex
        align="center"
        justify="flex-start"
        gap={2}
        h="100%"
        position="relative"
        zIndex={2}
        overflow="hidden"
        px={1}
      >
        {/* Left: Micro Logo + Brand */}
        <Flex align="center" gap={1.5} minW="fit-content" flexShrink={0}>
          <Image 
            src={etherWorldLogo} 
            alt="EtherWorld logo" 
            boxSize={{ base: "14px", md: "18px" }} 
            borderRadius="sm"
            fallback={
              <Box
                bg="green.500"
                color="white"
                fontSize="10px"
                fontWeight="bold"
                w={{ base: "14px", md: "18px" }}
                h={{ base: "14px", md: "18px" }}
                display="flex"
                alignItems="center"
                justifyContent="center"
                borderRadius="sm"
                >
                  EW
                </Box>
              }
            />
          <Text 
            fontSize={{ base: "xs", md: "sm" }}
            fontWeight="bold"
            color={useColorModeValue("gray.900", "white")}
            lineHeight="1"
          >
            EtherWorld
          </Text>
        </Flex>

        {/* Center: Dense Info Stack */}
        <Flex direction="column" flex={1} px={1.5} justify="center" overflow="hidden" position="relative" gap={0}>
          <Text 
            fontSize={{ base: "9px", md: "12px", lg: "11px" }}
            fontWeight="bold"
            color={useColorModeValue("gray.900", "white")}
            lineHeight="1.1"
            mb={0.5}
            textTransform="uppercase"
            letterSpacing="0.5px"
          >
            Global ETH News • ACD Updates • Security Alerts • Protocol Analysis
          </Text>
          <Flex align="center" gap={1} fontSize={{ base: "7px", md: "8px" }} color={useColorModeValue("gray.600", "gray.300")} flexWrap="nowrap">
            <Flex align="center" gap={0.5}>
              <Icon as={FiShield} boxSize={{ base: "6px", md: "8px" }} />
              <Text>Grant-Backed</Text>
            </Flex>
            <Text>•</Text>
            <Flex align="center" gap={0.5}>
              <Icon as={FiTrendingUp} boxSize={{ base: "6px", md: "8px" }} />
              <Text>Real-time</Text>
            </Flex>
            <Text>•</Text>
            <Text fontWeight="bold">15k+ Readers</Text>
            <Text>•</Text>
            <Flex align="center" gap={0.5}>
              <Icon as={FiClock} boxSize={{ base: "6px", md: "8px" }} />
              <Text>24/7</Text>
            </Flex>
            <Text>•</Text>
            <Text fontWeight="bold" color={useColorModeValue("green.700", "green.300")}>Premium Intel</Text>
          </Flex>
        </Flex>

        {/* Right: Compact CTA + Dense Badges */}
        <Flex direction="column" align="flex-end" gap={0.5} minW="fit-content" flexShrink={0}>
          <Flex gap={0.5}>
            <Badge 
              colorScheme="orange"
              variant="solid"
              fontSize={{ base: "6px", md: "7px" }}
              px={1}
              py={0.5}
              borderRadius="sm"
              textTransform="uppercase"
              fontWeight="bold"
            >
              LIVE
            </Badge>
            <Badge 
              colorScheme="red"
              variant="solid"
              fontSize={{ base: "6px", md: "7px" }}
              px={1}
              py={0.5}
              borderRadius="sm"
              textTransform="uppercase"
              fontWeight="bold"
            >
              HOT
            </Badge>
          </Flex>
          <Flex gap={1} fontSize={{ base: "6px", md: "7px" }} color={useColorModeValue("gray.600", "gray.400")} fontWeight="medium">
            <Text>📈 +2.5k</Text>
            <Text>•</Text>
            <Text>⭐ 4.9/5</Text>
          </Flex>
          <Box
            as="button"
            bg={useColorModeValue("green.600", "green.500")}
            color="white"
            px={1.5}
            py={0.5}
            borderRadius="md"
            fontSize={{ base: "2xs", md: "xs" }}
            fontWeight="bold"
            cursor="pointer"
            position="relative"
            overflow="visible"
            boxShadow="md"
            border="1px solid"
            borderColor={useColorModeValue("green.700", "green.400")}
            whiteSpace="nowrap"
            _hover={{
              transform: "scale(1.03)",
              bg: useColorModeValue("green.700", "green.600"),
              boxShadow: "lg",
            }}
            _focusVisible={{
              outline: "3px solid",
              outlineColor: useColorModeValue("green.500", "green.400"),
              outlineOffset: "2px",
            }}
            transition="all 0.2s ease"
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              handleClick();
            }}
          >
            <Flex align="center" gap={0.5}>
              <Text fontSize={{ base: "2xs", md: "xs" }} fontWeight="bold">READ</Text>
              <Icon as={FiExternalLink} boxSize={{ base: "8px", md: "10px" }} />
            </Flex>
          </Box>
        </Flex>
      </Flex>
    </MotionBox>
  );
};

export default CloseableAdCard;
