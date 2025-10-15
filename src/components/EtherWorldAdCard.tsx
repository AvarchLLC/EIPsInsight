import React from "react";
import { Box, Flex, Text, Badge, Image, useColorModeValue, Stack, Icon } from "@chakra-ui/react";
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
      p={2}
      w="100%"
      maxW="900px"
      h="60px"
      mx="auto"
      cursor="pointer"
      onClick={handleClick}
      backgroundImage={useColorModeValue(
        "linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 25%, #BBF7D0 50%, #86EFAC 75%, #4ADE80 100%)",
        "linear-gradient(135deg, #14532D 0%, #166534 25%, #15803D 50%, #16A34A 75%, #22C55E 100%)"
      )}
      backgroundSize="400% 400%"
      sx={{
        animation: `${flashyPulse} 2s ease-in-out infinite`,
        "@media (prefers-reduced-motion: reduce)": {
          animation: "none",
        }
      }}
      _hover={{
        transform: "translateY(-4px) scale(1.02)",
        boxShadow: useColorModeValue(
          "0 12px 35px rgba(34, 197, 94, 0.4), 0 0 20px rgba(34, 197, 94, 0.2)",
          "0 12px 35px rgba(34, 197, 94, 0.6), 0 0 20px rgba(34, 197, 94, 0.4)"
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
        justify="space-between"
        h="100%"
        position="relative"
        zIndex={2}
        overflow="hidden"
        px={2}
      >
        {/* Left: Micro Logo + Brand */}
        <Flex align="center" gap={3} minW="fit-content">
          <Image 
            src={logoSrc} 
            alt="EtherWorld logo" 
            boxSize="16px" 
            borderRadius="sm"
            fallback={
              <Box
                bg="green.500"
                color="white"
                fontSize="10px"
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
          <Text 
            fontSize="xs"
            fontWeight="bold"
            color={useColorModeValue("gray.900", "white")}
            lineHeight="1"
            sx={{
              animation: `${textFlash} 3s ease-in-out infinite`,
              "@media (prefers-reduced-motion: reduce)": {
                animation: "none",
              }
            }}
          >
            EtherWorld
          </Text>
        </Flex>

        {/* Center: Dense Info Stack */}
        <Flex direction="column" flex={1} px={4} justify="center" overflow="hidden">
          <Text 
            fontSize="12px"
            fontWeight="bold"
            color={useColorModeValue("gray.900", "white")}
            lineHeight="1"
            mb={0.5}
            textTransform="uppercase"
            letterSpacing="1px"
            sx={{
              animation: `${textFlash} 2.5s ease-in-out infinite`,
              "@media (prefers-reduced-motion: reduce)": {
                animation: "none",
              }
            }}
          >
            Global ETH News • ACD Updates • Security Alerts • Protocol Analysis • EIP Tracking • Hard Fork Coverage
          </Text>
          <Flex align="center" gap={0.5} fontSize="7px" color={useColorModeValue("gray.600", "gray.300")} justify="space-between" flexWrap="wrap">
            <Flex align="center" gap={0.5}>
              <Icon as={FiShield} boxSize="7px" />
              <Text>Grant-Backed</Text>
            </Flex>
            <Text>•</Text>
            <Flex align="center" gap={0.5}>
              <Icon as={FiTrendingUp} boxSize="7px" />
              <Text>Real-time</Text>
            </Flex>
            <Text>•</Text>
            <Text>15K+ Subs</Text>
            <Text>•</Text>
            <Text>Dev-Focused</Text>
            <Text>•</Text>
            <Flex align="center" gap={0.5}>
              <Icon as={FiClock} boxSize="7px" />
              <Text>24/7</Text>
            </Flex>
            <Text>•</Text>
            <Text fontWeight="bold">15k+ Readers</Text>
            <Text>•</Text>
            <Text>Zero Spam</Text>
            <Text>•</Text>
            <Text fontWeight="bold" color={useColorModeValue("green.700", "green.300")}>Premium Intel</Text>
          </Flex>
          
          {/* Scrolling ticker for more info density */}
          <Box 
            position="absolute" 
            bottom="0" 
            left="0" 
            right="0" 
            h="10px"
            overflow="hidden"
            opacity={0.7}
          >
            <Text
              fontSize="6px"
              fontWeight="medium"
              color={useColorModeValue("green.800", "green.200")}
              whiteSpace="nowrap"
              sx={{
                animation: `${sheen} 12s linear infinite`,
                "@media (prefers-reduced-motion: reduce)": {
                  animation: "none",
                }
              }}
            >
              🔥 LIVE: EIP-4844 Blobs • 📊 Real-time Analytics • 🚀 Pectra Updates • ⚡ Gas Price Tracker • 📈 Proposal Stats • 🔒 CVE Alerts • 💎 Dev Insights • 🏗️ Infrastructure • ⛏️ Mining Data • 🌐 L2 News • 📋 ERC Standards • 🔧 Tool Updates • 📚 Research • 💰 DeFi Impact • 🎯 Roadmap Progress
            </Text>
          </Box>
        </Flex>

        {/* Right: Compact CTA + Dense Badges */}
        <Flex direction="column" align="flex-end" gap={1} minW="120px" pr={2}>
          <Flex gap={1}>
            <Badge 
              colorScheme="orange"
              variant="solid"
              fontSize="6px"
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
              fontSize="6px"
              px={1}
              py={0.5}
              borderRadius="sm"
              textTransform="uppercase"
              fontWeight="bold"
            >
              HOT
            </Badge>
          </Flex>
          <Flex gap={1} fontSize="5px" color={useColorModeValue("gray.600", "gray.400")}>
            <Text>📈 +2.5k</Text>
            <Text>•</Text>
            <Text>🎯 Premium</Text>
            <Text>•</Text>
            <Text>⭐ 4.9/5</Text>
          </Flex>
          <Box
            as="button"
            bg={useColorModeValue("green.600", "green.500")}
            color="white"
            px={3}
            py={2}
            borderRadius="md"
            fontSize="sm"
            fontWeight="bold"
            cursor="pointer"
            position="relative"
            overflow="visible"
            boxShadow="md"
            border="1px solid"
            borderColor={useColorModeValue("green.700", "green.400")}
            sx={{
              animation: `${ctaGlow} 3s ease-in-out infinite`,
              "@media (prefers-reduced-motion: reduce)": {
                animation: "none",
              }
            }}
            _hover={{
              transform: "scale(1.08)",
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
            <Flex align="center" gap={1}>
              <Text fontSize="sm" fontWeight="bold">READ</Text>
              <Icon as={FiExternalLink} boxSize="12px" />
            </Flex>
          </Box>
        </Flex>
      </Flex>
    </Box>
  );
};

export default EtherWorldAdCard;
