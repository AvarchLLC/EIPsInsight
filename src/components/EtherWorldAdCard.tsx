import React from "react";
import { Box, Flex, Text, Badge, Image, useColorModeValue, Stack, Icon, useColorMode } from "@chakra-ui/react";
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

const ctaGlow = keyframes`
  0%, 100% { 
    box-shadow: 0 0 10px rgba(34, 197, 94, 0.5), inset 0 0 0 1px rgba(255, 255, 255, 0.1);
  }
  50% { 
    box-shadow: 0 0 20px rgba(34, 197, 94, 0.8), 0 0 30px rgba(255, 255, 255, 0.3), inset 0 0 0 1px rgba(255, 255, 255, 0.3);
  }
`;

const textFlash = keyframes`
  0%, 100% { 
    text-shadow: 0 0 5px rgba(34, 197, 94, 0.3);
  }
  50% { 
    text-shadow: 0 0 10px rgba(34, 197, 94, 0.6), 0 0 20px rgba(34, 197, 94, 0.3);
  }
`;

const badgeBounce = keyframes`
  0%, 100% { 
    transform: scale(1) rotate(0deg);
  }
  50% { 
    transform: scale(1.1) rotate(2deg);
  }
`;

// Dark-mode subtle pulse and sheen
const darkPulse = keyframes`
  0%,100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(16,185,129,0.04); }
  50% { transform: scale(1.01); box-shadow: 0 0 30px 6px rgba(16,185,129,0.04); }
`;

const darkSheen = keyframes`
  0% { background-position: -150% center; }
  100% { background-position: 150% center; }
`;



interface SponsorBannerProps {
  logoSrc?: string;
  headline?: string;
  subheadline?: string;
  benefits?: string[];
  microProof?: string;
  ctaLabel?: string;
  ctaHref?: string;
  offerChip?: string;
  onClick?: () => void;
  variant?: 'compact' | 'default' | 'spacious';
}

const EtherWorldAdCard: React.FC<SponsorBannerProps> = ({
  logoSrc = etherWorldLogo,
  headline = "EtherWorld — Global Ethereum News & Intelligence",
  subheadline = "Daily news, ACD highlights, upgrade briefs, security notes, and policy/market coverage—source-linked.",
  benefits = ["News", "Global", "ACD highlights", "Upgrades", "Clients & tooling", "Security", "Policy & markets"],
  microProof = "Grant-backed - Community-trusted - Source-linked briefs",
  ctaLabel = "Explore EtherWorld",
  ctaHref = "https://etherworld.co/",
  offerChip = "Sponsored Content",
  variant = "default",
  onClick
}) => {
  const handleClick = () => {
    trackFeatureUsage("ad_etherworld", "click");
    if (onClick) {
      onClick();
    } else {
      window.open(ctaHref, "_blank", "noopener,noreferrer");
    }
  };

  const benefitIcons = [FiExternalLink, FiTrendingUp, FiClock, FiTrendingUp, FiExternalLink, FiShield, FiTrendingUp];

  // Respect site theme: render a restrained dark-mode variant and keep the
  // existing flashy/light design only for light mode.
  const { colorMode } = useColorMode();

  if (colorMode === "dark") {
    return (
      <Box
        as="aside"
        role="complementary"
        aria-label="EtherWorld sponsor promotion (dark)"
        position="relative"
        overflow="hidden"
        bg={"linear-gradient(270deg,#031617 0%, #052a28 25%, #063d36 50%, #0a5a48 75%, #0f6f58 100%)"}
        borderRadius="lg"
        borderWidth="1px"
        borderColor="gray.700"
        p={1}
        minH="48px"
        w="100%"
        maxW="900px"
        mx="auto"
        cursor="pointer"
        onClick={handleClick}
        boxShadow="inset 0 1px 0 rgba(255,255,255,0.02), 0 10px 22px rgba(2,6,23,0.6)"
        transition="transform 0.18s ease, box-shadow 0.18s ease"
        sx={{ animation: `${darkPulse} 3.5s ease-in-out infinite` }}
        _hover={{ transform: "translateY(-2px)", boxShadow: "0 14px 36px rgba(16,185,129,0.08)" }}
        tabIndex={0}
        onKeyDown={(e: React.KeyboardEvent) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleClick();
          }
        }}
      >
        {/* subtle animated sheen overlay for dark mode */}
        <Box
          position="absolute"
          top="0"
          left="0"
          right="0"
          bottom="0"
          backgroundImage="linear-gradient(90deg, transparent, rgba(255,255,255,0.02), transparent)"
          backgroundSize="200% 100%"
          sx={{ animation: `${darkSheen} 10s linear infinite`, opacity: 0.45 }}
          pointerEvents="none"
          zIndex={1}
        />

        {/* Ultra-Compact Information Dense Layout (dark) - mirror light content but darker tones */}
        <Flex
          align="center"
          justify="flex-start"
          gap={2}
          h="100%"
          position="relative"
          zIndex={2}
          overflow="hidden"
          px={0.5}
        >
          {/* Left: Micro Logo + Brand */}
          <Flex align="center" gap={1} minW="fit-content" flexShrink={0}>
            <Image
              src={logoSrc}
              alt="EtherWorld logo"
              boxSize="16px"
              borderRadius="sm"
              fallback={
                <Box
                  bg="#0ea5a4"
                  color="white"
                  fontSize="9px"
                  fontWeight="bold"
                  w="16px"
                  h="16px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  borderRadius="sm"
                >
                  EW
                </Box>
              }
            />
            <Text fontSize="sm" fontWeight="bold" color="white" lineHeight="1">
              EtherWorld
            </Text>
          </Flex>

          {/* Center: Dense Info Stack */}
          <Flex direction="column" flex={1} px={1.5} justify="center" overflow="hidden" position="relative" gap={0}>
            <Text
              fontSize="11px"
              fontWeight="bold"
              color="white"
              lineHeight="1.05"
              mb={0.25}
              textTransform="uppercase"
              letterSpacing="0.4px"
            >
              Global ETH News • ACD Updates • Security Alerts • Protocol Analysis
            </Text>
            <Flex align="center" gap={1} fontSize="8px" color="gray.300" flexWrap="nowrap">
              <Flex align="center" gap={0.5}>
                <Icon as={FiShield} boxSize="8px" color="gray.300" />
                <Text>Grant-Backed</Text>
              </Flex>
              <Text>•</Text>
              <Flex align="center" gap={0.5}>
                <Icon as={FiTrendingUp} boxSize="8px" color="gray.300" />
                <Text>Real-time</Text>
              </Flex>
              <Text>•</Text>
              <Text fontWeight="bold">15k+ Readers</Text>
              <Text>•</Text>
              <Flex align="center" gap={0.5}>
                <Icon as={FiClock} boxSize="8px" color="gray.300" />
                <Text>24/7</Text>
              </Flex>
              <Text>•</Text>
              <Text fontWeight="bold" color="#34d399">Premium Intel</Text>
            </Flex>
          </Flex>

          {/* Right: Compact CTA + Dense Badges */}
          <Flex direction="column" align="flex-end" gap={0.5} minW="fit-content" flexShrink={0}>
            <Flex gap={0.5}>
              <Badge
                colorScheme="orange"
                variant="solid"
                fontSize="7px"
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
                fontSize="7px"
                px={1}
                py={0.5}
                borderRadius="sm"
                textTransform="uppercase"
                fontWeight="bold"
              >
                HOT
              </Badge>
            </Flex>
            <Flex gap={1} fontSize="7px" color="gray.300" fontWeight="medium">
              <Text>📈 +2.5k</Text>
              <Text>•</Text>
              <Text>⭐ 4.9/5</Text>
            </Flex>
            <Box
              as="button"
              bg="#059669"
              color="white"
              px={1}
              py={0.4}
              borderRadius="md"
              fontSize="xs"
              fontWeight="bold"
              cursor="pointer"
              position="relative"
              overflow="visible"
              boxShadow="md"
              border="1px solid"
              borderColor="#047857"
              whiteSpace="nowrap"
              _hover={{ transform: "scale(1.03)", boxShadow: "lg" }}
              _focusVisible={{ outline: "3px solid", outlineColor: "#34d399", outlineOffset: "2px" }}
              transition="all 0.2s ease"
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                handleClick();
              }}
            >
              <Flex align="center" gap={0.5}>
                <Text fontSize="10px" fontWeight="bold">READ</Text>
                <Icon as={FiExternalLink} boxSize="9px" />
              </Flex>
            </Box>
          </Flex>
        </Flex>
      </Box>
    );
  }

  return (
    <Box
      as="aside"
      role="complementary"
      aria-label="EtherWorld sponsor promotion"
      position="relative"
      overflow="hidden"
      bg={useColorModeValue("green.50", "green.900")}
      borderRadius="lg"
      borderWidth="1px"
      borderColor={useColorModeValue("green.300", "green.600")}
      p={1}
      w="100%"
      maxW="900px"
      minH="50px"
      mx="auto"
      cursor="pointer"
      onClick={handleClick}
      backgroundImage={useColorModeValue(
        "linear-gradient(270deg, #F0FDF4 0%, #DCFCE7 20%, #BBF7D0 40%, #86EFAC 60%, #4ADE80 80%, #22C55E 100%)",
        "linear-gradient(270deg, #14532D 0%, #166534 20%, #15803D 40%, #16A34A 60%, #22C55E 80%, #10B981 100%)"
      )}
      backgroundSize="300% 300%"
      sx={{
        backgroundPosition: "0% 50%",
        animation: `${flashyPulse} 2.5s ease-in-out infinite, backgroundShift 4s ease-in-out infinite`,
        "@keyframes backgroundShift": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" }
        },
        "@media (prefers-reduced-motion: reduce)": {
          animation: "none",
        }
      }}
      _hover={{
        transform: "translateY(-3px) scale(1.01)",
        boxShadow: useColorModeValue(
          "0 10px 30px rgba(34, 197, 94, 0.4), 0 0 20px rgba(34, 197, 94, 0.2)",
          "0 10px 30px rgba(34, 197, 94, 0.5), 0 0 20px rgba(34, 197, 94, 0.3)"
        ),
      }}
      transition="all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
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
    >
      {/* Animated sheen effect */}
      <Box
        position="absolute"
        top="0"
        left="0"
        right="0"
        bottom="0"
        backgroundImage="linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)"
        backgroundSize="200% 100%"
        sx={{
          animation: `${sheen} 7s infinite linear`,
          "@media (prefers-reduced-motion: reduce)": {
            animation: "none",
          }
        }}
        pointerEvents="none"
        zIndex={1}
      />

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
            src={logoSrc} 
            alt="EtherWorld logo" 
            boxSize="18px" 
            borderRadius="sm"
            fallback={
              <Box
                bg="green.500"
                color="white"
                fontSize="10px"
                fontWeight="bold"
                w="18px"
                h="18px"
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
            fontSize="sm"
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
            fontSize="12px"
            fontWeight="bold"
            color={useColorModeValue("gray.900", "white")}
            lineHeight="1.1"
            mb={0.5}
            textTransform="uppercase"
            letterSpacing="0.5px"
          >
            Global ETH News • ACD Updates • Security Alerts • Protocol Analysis
          </Text>
          <Flex align="center" gap={1} fontSize="8px" color={useColorModeValue("gray.600", "gray.300")} flexWrap="nowrap">
            <Flex align="center" gap={0.5}>
              <Icon as={FiShield} boxSize="8px" />
              <Text>Grant-Backed</Text>
            </Flex>
            <Text>•</Text>
            <Flex align="center" gap={0.5}>
              <Icon as={FiTrendingUp} boxSize="8px" />
              <Text>Real-time</Text>
            </Flex>
            <Text>•</Text>
            <Text fontWeight="bold">15k+ Readers</Text>
            <Text>•</Text>
            <Flex align="center" gap={0.5}>
              <Icon as={FiClock} boxSize="8px" />
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
              fontSize="7px"
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
              fontSize="7px"
              px={1}
              py={0.5}
              borderRadius="sm"
              textTransform="uppercase"
              fontWeight="bold"
            >
              HOT
            </Badge>
          </Flex>
          <Flex gap={1} fontSize="7px" color={useColorModeValue("gray.600", "gray.400")} fontWeight="medium">
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
            fontSize="xs"
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
              <Text fontSize="xs" fontWeight="bold">READ</Text>
              <Icon as={FiExternalLink} boxSize="10px" />
            </Flex>
          </Box>
        </Flex>
      </Flex>
    </Box>
  );
};

export default EtherWorldAdCard;
