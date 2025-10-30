import React, { useState, useEffect, useRef } from "react";
import { Box, Flex, Text, Badge, Image, useColorModeValue, Stack, Icon, useColorMode, CloseButton } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { FiExternalLink, FiClock, FiShield, FiTrendingUp } from "react-icons/fi";
import { trackFeatureUsage } from "@/utils/analytics";

const etherWorldLogo = "https://etherworld.co/favicon.ico";

// Brand / stagnant color used for EtherWorld ad (stagnant)
// Updated for dark-mode: use solid, stagnant brand color #1A365D
const STAGNANT = "#1A365D";
const STAG_RGB = `26,54,93`;
const CLOSED_KEY = 'etherworld_ad_closed_v1';

// Flashy animations for small ad
const sheen = keyframes`
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
`;

const flashyPulse = keyframes`
  0%, 100% { 
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(46,140,202,0.4);
  }
  50% { 
    transform: scale(1.02);
    box-shadow: 0 0 0 8px rgba(46,140,202,0), 0 0 20px rgba(46,140,202,0.3);
  }
`;

const ctaGlow = keyframes`
  0%, 100% { 
    box-shadow: 0 0 10px rgba(46,140,202,0.5), inset 0 0 0 1px rgba(255, 255, 255, 0.1);
  }
  50% { 
    box-shadow: 0 0 20px rgba(46,140,202,0.8), 0 0 30px rgba(255, 255, 255, 0.3), inset 0 0 0 1px rgba(255, 255, 255, 0.3);
  }
`;

const textFlash = keyframes`
  0%, 100% { 
    text-shadow: 0 0 5px rgba(46,140,202,0.3);
  }
  50% { 
    text-shadow: 0 0 10px rgba(46,140,202,0.6), 0 0 20px rgba(46,140,202,0.3);
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
  0%,100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(46,140,202,0.04); }
  50% { transform: scale(1.01); box-shadow: 0 0 30px 6px rgba(46,140,202,0.04); }
`;

const darkSheen = keyframes`
  0% { background-position: -150% center; }
  100% { background-position: 150% center; }
`;

const darkGlow = keyframes`
  0% { opacity: 0.45; transform: scale(1); }
  50% { opacity: 0.9; transform: scale(1.03); }
  100% { opacity: 0.45; transform: scale(1); }
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
  requestAdHref?: string;
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
  requestAdHref = "https://etherworld.co/advertise",
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
  const [visible, setVisible] = useState(true);
  const [hovered, setHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [isClosing, setIsClosing] = useState(false);

  // Close button behavior: regular click closes the ad; Shift+Click opens the request-an-ad page.
  const handleCloseButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    // If user Shift+Clicks the close button, open the request-ad page in a new tab
    if (e.shiftKey) {
      try {
        trackFeatureUsage("ad_etherworld", "request_ad");
      } catch (err) {}
      try {
        window.open(requestAdHref, "_blank", "noopener,noreferrer");
      } catch (err) {}
      return;
    }
    // Default behavior: hide for the session
    try { sessionStorage.setItem(CLOSED_KEY, '1'); } catch (err) {}
    setIsClosing(true);
    setTimeout(() => setVisible(false), 240);
  };

  

  // Check sessionStorage on client mount: if the ad was closed earlier this session, keep it hidden
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const closed = sessionStorage.getItem(CLOSED_KEY);
      if (closed) setVisible(false);
    } catch (e) {
      // ignore sessionStorage errors
    }
  }, []);

  // Hide for current page view only — reappears on refresh (state reset)
  if (!visible) return null;

  

  if (colorMode === "dark") {
    return (
      <Box
        as="aside"
        role="complementary"
        aria-label="EtherWorld sponsor promotion (dark)"
        position="relative"
        overflow="visible"
        ref={cardRef}
        bg={STAGNANT}
        borderRadius="lg"
        borderWidth="1px"
        borderColor={`rgba(${STAG_RGB},0.18)`}
        p={2}
        minH="56px"
        w="100%"
        maxW="880px"
        mx="auto"
        onClick={handleClick}
        boxShadow={`inset 0 1px 0 rgba(255,255,255,0.02), 0 12px 30px rgba(${STAG_RGB},0.12)`}
        sx={{ animation: `${darkPulse} 3.5s ease-in-out infinite` }}
        _hover={{ transform: "translateY(-2px)", boxShadow: "0 14px 36px rgba(16,185,129,0.08)" }}
        opacity={isClosing ? 0 : 1}
        transition="opacity 220ms ease, transform 0.18s ease, box-shadow 0.18s ease"
        tabIndex={0}
        onKeyDown={(e: React.KeyboardEvent) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleClick();
          }
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocus={() => setHovered(true)}
        onBlur={() => setHovered(false)}
      >
        {/* Background glow overlay + subtle sheen (dark mode) - mirror light mode glow but tuned for dark */}
        <Box
          position="absolute"
          top="-10%"
          left="-10%"
          right="-10%"
          bottom="-10%"
          pointerEvents="none"
          zIndex={0}
          sx={{
            background: `radial-gradient(circle at 20% 30%, rgba(${STAG_RGB},0.12), transparent 12%), radial-gradient(circle at 80% 70%, rgba(${STAG_RGB},0.08), transparent 18%)`,
            filter: "blur(14px)",
            opacity: 0.9,
          }}
        />

        {/* subtle animated sheen effect for dark mode */}
        <Box
          position="absolute"
          top="0"
          left="0"
          right="0"
          bottom="0"
          backgroundImage="linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.04), transparent)"
          backgroundSize="200% 100%"
          sx={{
            animation: `${darkSheen} 10s linear infinite`,
            "@media (prefers-reduced-motion: reduce)": {
              animation: "none",
            }
          }}
          pointerEvents="none"
          zIndex={1}
        />

        {/* Main Flex Layout: Left (logo/text), Center (headline/desc), Right (READ/Close) */}
        <Flex
          align="center"
          justify="space-between"
          gap={4}
          h="100%"
          position="relative"
          zIndex={2}
          overflow="visible"
          px={2}
        >
          {/* Left: Micro Logo + Brand */}
          <Flex align="center" gap={2} minW="fit-content" flexShrink={0}>
            <Image
              src={logoSrc}
              alt="EtherWorld logo"
              boxSize="32px"
              borderRadius="full"
              borderWidth="1px"
              borderColor="rgba(255,255,255,0.08)"
              boxShadow="sm"
              fallback={
                <Box
                  bg={STAGNANT}
                  color="white"
                  fontSize="13px"
                  fontWeight="bold"
                  w="32px"
                  h="32px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  borderRadius="full"
                >
                  EW
                </Box>
              }
            />
            <Text fontSize="md" fontWeight="bold" color="white" lineHeight="1" display="flex" alignItems="center" justifyContent="center">
              EtherWorld
            </Text>
          </Flex>

          {/* Center: Dense Info Stack */}
          <Flex direction="column" flex={1} px={2} justify="center" align="center" overflow="hidden" position="relative" gap={1}>
            <Text
              fontSize="12px"
              fontWeight="bold"
              color="white"
              lineHeight="1.2"
              mb={0.5}
              textTransform="uppercase"
              letterSpacing="0.5px"
              textAlign="center"
            >
              Global ETH News • ACD Updates • Security Alerts • Protocol Analysis
            </Text>
            <Flex align="center" gap={1.5} fontSize="8px" color="gray.300" flexWrap="nowrap" justify="center">
              <Flex align="center" gap={0.5}>
                <Icon as={FiShield} boxSize="8px" color="gray.300" />
                <Text>Grant-Backed</Text>
              </Flex>
              <Text>•</Text>
              <Flex align="center" gap={0.5}>
                <Icon as={FiTrendingUp} boxSize="9px" color="gray.300" />
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
              <Text fontWeight="bold" color={STAGNANT}>Premium Intel</Text>
            </Flex>
          </Flex>

          {/* Right: READ button and Close button spaced apart */}
          <Flex align="center" gap={3} minW="fit-content" flexShrink={0}>
            <Box
              bg="green.500"
              color="white"
              px={2.5}
              py={1}
              borderRadius="md"
              fontSize="12px"
              fontWeight="bold"
              cursor="pointer"
              position="relative"
              overflow="visible"
              boxShadow={`0 6px 18px rgba(${STAG_RGB},0.12)`}
              border="1px solid"
              borderColor="green.600"
              whiteSpace="nowrap"
              alignSelf="center"
              mb={0}
              role="button"
              tabIndex={0}
              _hover={{ transform: "scale(1.04)", boxShadow: "lg", bg: 'green.600' }}
              _focusVisible={{ outline: "3px solid", outlineColor: `rgba(${STAG_RGB},0.6)`, outlineOffset: "2px" }}
              transition="all 0.2s ease"
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                handleClick();
              }}
              onKeyDown={(e: React.KeyboardEvent) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleClick();
                }
              }}
            >
              <Flex align="center" gap={1}>
                <Text fontSize="12px" fontWeight="bold">READ</Text>
                <Icon as={FiExternalLink} boxSize="12px" />
              </Flex>
            </Box>
            {/* Modern Close Button */}
            <CloseButton
              aria-label="Close ad (Shift+Click to request an ad)"
              title="Close ad (Shift+Click to request an ad)"
              size="md"
              bg="gray.800"
              color="red.300"
              borderRadius="full"
              boxShadow="sm"
              borderWidth="1px"
              borderColor="gray.700"
              transition="all 0.18s ease"
              _hover={{
                bg: "red.700",
                color: "white",
                boxShadow: "md",
                transform: "scale(1.08)",
              }}
              _active={{
                bg: "red.800",
                color: "white",
              }}
              _focusVisible={{
                outline: "2px solid",
                outlineColor: "red.300",
                outlineOffset: "2px",
              }}
              onClick={handleCloseButtonClick}
            />
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
        overflow="visible"
        ref={cardRef}
        bg={useColorModeValue("#BBE1F5", "linear-gradient(270deg,#071827 0%, #083045 40%, #0b4a66 100%)")}
        borderRadius="lg"
        borderWidth="1px"
        p={2}
        minH="56px"
        opacity={isClosing ? 0 : 1}
        w="100%"
        maxW="880px"
        mx="auto"
        cursor="pointer"
        onClick={handleClick}
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
            `0 14px 36px rgba(${STAG_RGB},0.18), 0 0 30px rgba(${STAG_RGB},0.12)`,
            `0 14px 36px rgba(${STAG_RGB},0.22), 0 0 36px rgba(${STAG_RGB},0.18)`
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
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocus={() => setHovered(true)}
        onBlur={() => setHovered(false)}
      >
        {/* Background glow overlay + animated sheen effect */}
        <Box
          position="absolute"
          top="-10%"
          left="-10%"
          right="-10%"
          bottom="-10%"
          pointerEvents="none"
          zIndex={0}
          sx={{
            background: `radial-gradient(circle at 20% 30%, rgba(${STAG_RGB},0.12), transparent 12%), radial-gradient(circle at 80% 70%, rgba(${STAG_RGB},0.08), transparent 18%)`,
            filter: "blur(14px)",
            opacity: 0.95,
          }}
        />

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

        {/* Main Flex Layout: Left (logo/text), Center (headline/desc), Right (READ/Close) */}
        <Flex
          align="center"
          justify="space-between"
          gap={4}
          h="100%"
          position="relative"
          zIndex={2}
          overflow="visible"
          px={2}
        >
          {/* Left: Micro Logo + Brand */}
          <Flex align="center" gap={2} minW="fit-content" flexShrink={0}>
            <Image
              src={logoSrc}
              alt="EtherWorld logo"
              boxSize="32px"
              borderRadius="full"
              fallback={
                <Box
                  bg="green.500"
                  color="white"
                  fontSize="13px"
                  fontWeight="bold"
                  w="32px"
                  h="32px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  borderRadius="full"
                >
                  EW
                </Box>
              }
            />
            <Text
              fontSize="md"
              fontWeight="bold"
              color={useColorModeValue("gray.900", "white")}
              lineHeight="1"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              EtherWorld
            </Text>
          </Flex>

          {/* Center: Dense Info Stack */}
          <Flex direction="column" flex={1} px={2} justify="center" align="center" overflow="hidden" position="relative" gap={1}>
            <Text
              fontSize="12px"
              fontWeight="bold"
              color={useColorModeValue("gray.900", "white")}
              lineHeight="1.2"
              mb={0.5}
              textTransform="uppercase"
              letterSpacing="0.5px"
              textAlign="center"
            >
              Global ETH News • ACD Updates • Security Alerts • Protocol Analysis
            </Text>
            <Flex align="center" gap={1.5} fontSize="8px" color={useColorModeValue("gray.600", "gray.300")} flexWrap="nowrap" justify="center">
              <Flex align="center" gap={0.5}>
                <Icon as={FiShield} boxSize="8px" />
                <Text>Grant-Backed</Text>
              </Flex>
              <Text>•</Text>
              <Flex align="center" gap={0.5}>
                <Icon as={FiTrendingUp} boxSize="9px" />
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

          {/* Right: READ button and Close button spaced apart */}
          <Flex align="center" gap={3} minW="fit-content" flexShrink={0}>
            <Box
              bg={useColorModeValue("green.600", "green.500")}
              color="white"
              px={2.5}
              py={1}
              borderRadius="md"
              fontSize="12px"
              fontWeight="bold"
              cursor="pointer"
              position="relative"
              overflow="visible"
              boxShadow="md"
              border="1px solid"
              borderColor={useColorModeValue("green.700", "green.400")}
              whiteSpace="nowrap"
              alignSelf="center"
              mb={0}
              role="button"
              tabIndex={0}
              _hover={{
                transform: "scale(1.04)",
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
              onKeyDown={(e: React.KeyboardEvent) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleClick();
                }
              }}
            >
              <Flex align="center" gap={1}>
                <Text fontSize="12px" fontWeight="bold">READ</Text>
                <Icon as={FiExternalLink} boxSize="12px" />
              </Flex>
            </Box>
            {/* Modern Close Button */}
            <CloseButton
              aria-label="Close ad (Shift+Click to request an ad)"
              title="Close ad (Shift+Click to request an ad)"
              size="md"
              bg={useColorModeValue("white", "gray.700")}
              color={useColorModeValue("red.500", "red.300")}
              borderRadius="full"
              boxShadow="sm"
              borderWidth="1px"
              borderColor={useColorModeValue("gray.200", "gray.600")}
              transition="all 0.18s ease"
              _hover={{
                bg: useColorModeValue("red.50", "red.700"),
                color: useColorModeValue("red.600", "white"),
                boxShadow: "md",
                transform: "scale(1.08)",
              }}
              _active={{
                bg: useColorModeValue("red.100", "red.800"),
                color: useColorModeValue("red.700", "white"),
              }}
              _focusVisible={{
                outline: "2px solid",
                outlineColor: useColorModeValue("red.400", "red.300"),
                outlineOffset: "2px",
              }}
              onClick={handleCloseButtonClick}
            />
          </Flex>
        </Flex>
      </Box>
    );
};

export default EtherWorldAdCard;
