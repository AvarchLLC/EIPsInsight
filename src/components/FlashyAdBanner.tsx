import React, { useState, useEffect } from "react";
import { Box, Flex, Text, Button, useColorModeValue, CloseButton } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { FiStar, FiZap, FiTrendingUp } from "react-icons/fi";
import { trackFeatureUsage } from "@/utils/analytics";

// Ultra flashy animations
const neonPulse = keyframes`
  0%, 100% {
    box-shadow: 
      0 0 5px rgba(255, 0, 128, 0.5),
      0 0 10px rgba(255, 0, 128, 0.5),
      0 0 20px rgba(255, 0, 128, 0.3),
      inset 0 0 10px rgba(255, 0, 128, 0.2);
  }
  50% {
    box-shadow: 
      0 0 10px rgba(255, 0, 128, 1),
      0 0 20px rgba(255, 0, 128, 0.8),
      0 0 40px rgba(255, 0, 128, 0.6),
      0 0 60px rgba(255, 0, 128, 0.4),
      inset 0 0 20px rgba(255, 0, 128, 0.5);
  }
`;

const rainbowShift = keyframes`
  0% { background-position: 0% 50%; }
  25% { background-position: 50% 50%; }
  50% { background-position: 100% 50%; }
  75% { background-position: 50% 50%; }
  100% { background-position: 0% 50%; }
`;

const blink = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
`;

const bounce = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
`;

const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const shimmerWave = keyframes`
  0% { 
    background-position: -200% center;
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% { 
    background-position: 200% center;
    opacity: 0;
  }
`;

const scaleUp = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
`;

interface FlashyAdBannerProps {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  dismissible?: boolean;
  variant?: "neon" | "rainbow" | "gradient" | "pulse";
}

export default function FlashyAdBanner({
  title = "🎉 Limited Time Offer! 50% OFF Premium Features",
  subtitle = "Join thousands of developers using EIPs Insight Pro",
  ctaText = "Get Started Now",
  ctaLink = "#",
  dismissible = true,
  variant = "neon"
}: FlashyAdBannerProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [iconRotate, setIconRotate] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIconRotate(prev => !prev);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleDismiss = () => {
    trackFeatureUsage(`ad_banner_${variant}`, "dismiss");
    setIsVisible(false);
  };

  const handleCtaClick = () => {
    trackFeatureUsage(`ad_banner_${variant}`, "click");
  };

  if (!isVisible) return null;

  const getVariantStyles = () => {
    switch (variant) {
      case "neon":
        return {
          bg: useColorModeValue(
            "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            "linear-gradient(135deg, #1a202c 0%, #2d3748 100%)"
          ),
          border: "2px solid",
          borderColor: "#ff0080",
          sx: {
            animation: `${neonPulse} 2s ease-in-out infinite`,
          },
        };
      case "rainbow":
        return {
          bgGradient: "linear-gradient(270deg, #ff0080, #ff8c00, #40e0d0, #9370db, #00ced1, #ff0080)",
          backgroundSize: "400% 400%",
          sx: {
            animation: `${rainbowShift} 5s ease infinite`,
          },
        };
      case "gradient":
        return {
          bgGradient: useColorModeValue(
            "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
            "linear-gradient(135deg, #4e54c8 0%, #8f94fb 100%)"
          ),
        };
      case "pulse":
        return {
          bg: useColorModeValue("#3182ce", "#2c5282"),
          sx: {
            animation: `${scaleUp} 2s ease-in-out infinite`,
          },
        };
      default:
        return {};
    }
  };

  return (
    <Box
      position="relative"
      overflow="hidden"
      {...getVariantStyles()}
      borderRadius="xl"
      p={4}
      mb={4}
      boxShadow="2xl"
    >
      {/* Animated shimmer overlay */}
      <Box
        position="absolute"
        top="0"
        left="0"
        right="0"
        bottom="0"
        backgroundImage="linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)"
        backgroundSize="200% 100%"
        sx={{
          animation: `${shimmerWave} 3s infinite`,
        }}
        pointerEvents="none"
        zIndex={1}
      />

      <Flex
        direction={{ base: "column", md: "row" }}
        align="center"
        justify="space-between"
        gap={4}
        position="relative"
        zIndex={2}
      >
        {/* Left side - Icons and text */}
        <Flex align="center" gap={4} flex={1}>
          {/* Animated icons */}
          <Flex gap={2}>
            <Box
              sx={{
                animation: `${bounce} 1.5s ease-in-out infinite`,
              }}
              color="yellow.300"
            >
              <FiStar size={24} />
            </Box>
            <Box
              sx={{
                animation: `${blink} 1s ease-in-out infinite`,
              }}
              color="yellow.200"
            >
              <FiZap size={24} />
            </Box>
            <Box
              sx={{
                animation: iconRotate ? `${rotate} 1s linear` : "none",
              }}
              color="yellow.400"
            >
              <FiTrendingUp size={24} />
            </Box>
          </Flex>

          {/* Text content */}
          <Box>
            <Text
              fontSize={{ base: "md", md: "lg" }}
              fontWeight="extrabold"
              color="white"
              textShadow="0 2px 4px rgba(0,0,0,0.3)"
              mb={1}
            >
              {title}
            </Text>
            <Text
              fontSize={{ base: "xs", md: "sm" }}
              color="whiteAlpha.900"
              fontWeight="medium"
            >
              {subtitle}
            </Text>
          </Box>
        </Flex>

        {/* Right side - CTA and close */}
        <Flex align="center" gap={3}>
          <Button
            as="a"
            href={ctaLink}
            onClick={handleCtaClick}
            size={{ base: "sm", md: "md" }}
            colorScheme="yellow"
            color="gray.800"
            fontWeight="bold"
            px={6}
            boxShadow="0 0 20px rgba(255, 255, 0, 0.5)"
            sx={{
              animation: `${blink} 2s ease-in-out infinite`,
            }}
            _hover={{
              transform: "scale(1.15)",
              boxShadow: "0 0 30px rgba(255, 255, 0, 0.8)",
            }}
            transition="all 0.3s ease"
            target="_blank"
            rel="noopener noreferrer"
          >
            ⚡ {ctaText} ⚡
          </Button>

          {dismissible && (
            <CloseButton
              color="white"
              size="sm"
              onClick={handleDismiss}
              _hover={{
                bg: "whiteAlpha.300",
              }}
            />
          )}
        </Flex>
      </Flex>

      {/* Bottom attention line */}
      <Box
        position="absolute"
        bottom="0"
        left="0"
        right="0"
        height="4px"
        bgGradient="linear-gradient(90deg, transparent, yellow.400, transparent)"
        sx={{
          animation: `${shimmerWave} 2s infinite`,
        }}
      />
    </Box>
  );
}
