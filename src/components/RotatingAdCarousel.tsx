import React, { useState, useEffect } from "react";
import { Box, Flex, Text, Button, useColorModeValue, IconButton, usePrefersReducedMotion } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { FiChevronLeft, FiChevronRight, FiExternalLink } from "react-icons/fi";
import { trackFeatureUsage } from "@/utils/analytics";

// Flashy transition animations
const slideInRight = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const slideOutLeft = keyframes`
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(-100%);
    opacity: 0;
  }
`;

const glow = keyframes`
  0%, 100% {
    box-shadow: 0 0 10px rgba(0, 206, 209, 0.5), 0 0 20px rgba(0, 206, 209, 0.3);
  }
  50% {
    box-shadow: 0 0 30px rgba(0, 206, 209, 0.8), 0 0 50px rgba(0, 206, 209, 0.5);
  }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`;

const shimmer = keyframes`
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
`;

export interface AdItem {
  id: string;
  title: string;
  description: string;
  ctaText: string;
  link: string;
  bgGradient: string;
  emoji?: string;
}

interface RotatingAdCarouselProps {
  ads?: AdItem[];
  autoRotate?: boolean;
  rotateInterval?: number; // in milliseconds
}

const defaultAds: AdItem[] = [
  {
    id: "1",
    title: "Supercharge Your EIP Workflow",
    description: "Get real-time notifications, advanced analytics, and more!",
    ctaText: "Learn More",
    link: "#",
    bgGradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    emoji: "🚀"
  },
  {
    id: "2",
    title: "Advertise Your Blockchain Project",
    description: "Reach thousands of Ethereum developers and researchers",
    ctaText: "Get Started",
    link: "mailto:team@avarch.org",
    bgGradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    emoji: "💎"
  },
  {
    id: "3",
    title: "EIP Analytics Dashboard Pro",
    description: "Deep insights into proposal trends and network upgrades",
    ctaText: "Explore Now",
    link: "#",
    bgGradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    emoji: "📊"
  },
  {
    id: "4",
    title: "Join Our Developer Community",
    description: "Connect with EIP authors and blockchain innovators",
    ctaText: "Join Now",
    link: "#",
    bgGradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
    emoji: "🌟"
  }
];

export default function RotatingAdCarousel({
  ads = defaultAds,
  autoRotate = true,
  rotateInterval = 5000
}: RotatingAdCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  // Permanently reduced: no auto-rotation by default
  const autoRotateEnabled = false;

  useEffect(() => {
    if (!autoRotateEnabled) return;

    const interval = setInterval(() => {
      handleNext();
    }, rotateInterval);

    return () => clearInterval(interval);
  }, [currentIndex, autoRotateEnabled, rotateInterval]);

  const handleNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    trackFeatureUsage("ad_carousel", "next");
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % ads.length);
      setIsAnimating(false);
    }, 500);
  };

  const handlePrev = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    trackFeatureUsage("ad_carousel", "previous");
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + ads.length) % ads.length);
      setIsAnimating(false);
    }, 500);
  };

  const handleAdClick = (adId: string) => {
    trackFeatureUsage("ad_carousel", `click_${adId}`);
  };

  const currentAd = ads[currentIndex];

  return (
    <Box
      position="relative"
      overflow="hidden"
      borderRadius="xl"
      w="100%"
      bgGradient={currentAd.bgGradient}
      // Permanently reduced: static card, no glow animation
      transition="all 0.3s ease"
      p={6}
    >
      {/* Shimmer effect overlay */}
      <Box
        position="absolute"
        top="0"
        left="0"
        right="0"
        bottom="0"
        backgroundImage="linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)"
        backgroundSize="200% 100%"
        // Permanently reduced: no shimmer overlay
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
        {/* Navigation - Left */}
        <IconButton
          aria-label="Previous ad"
          icon={<FiChevronLeft />}
          onClick={handlePrev}
          position={{ base: "relative", md: "absolute" }}
          left={{ md: "-50px" }}
          colorScheme="whiteAlpha"
          variant="ghost"
          color="white"
          fontSize="2xl"
          _hover={{
            bg: "whiteAlpha.300",
            transform: "scale(1.2)",
          }}
          transition="all 0.2s"
        />

        {/* Ad Content */}
        <Box
          flex={1}
          textAlign="center"
          sx={{
            animation: isAnimating ? `${slideInRight} 0.5s ease-out` : "none",
          }}
        >
          <Text
            fontSize={{ base: "3xl", md: "5xl" }}
            mb={2}
            // Permanently reduced: no pulsing emoji
          >
            {currentAd.emoji}
          </Text>
          <Text
            fontSize={{ base: "xl", md: "2xl" }}
            fontWeight="extrabold"
            color="white"
            mb={2}
            textShadow="0 2px 10px rgba(0,0,0,0.3)"
          >
            {currentAd.title}
          </Text>
          <Text
            fontSize={{ base: "sm", md: "md" }}
            color="whiteAlpha.900"
            mb={4}
            fontWeight="medium"
          >
            {currentAd.description}
          </Text>
          <Button
            as="a"
            href={currentAd.link}
            onClick={() => handleAdClick(currentAd.id)}
            size={{ base: "md", md: "lg" }}
            colorScheme="whiteAlpha"
            bg="white"
            color="gray.800"
            fontWeight="bold"
            rightIcon={<FiExternalLink />}
            boxShadow="0 0 20px rgba(255, 255, 255, 0.5)"
            _hover={{
              transform: "scale(1.1)",
              boxShadow: "0 0 30px rgba(255, 255, 255, 0.8)",
            }}
            transition="all 0.3s ease"
            target="_blank"
            rel="noopener noreferrer"
          >
            {currentAd.ctaText}
          </Button>
        </Box>

        {/* Navigation - Right */}
        <IconButton
          aria-label="Next ad"
          icon={<FiChevronRight />}
          onClick={handleNext}
          position={{ base: "relative", md: "absolute" }}
          right={{ md: "-50px" }}
          colorScheme="whiteAlpha"
          variant="ghost"
          color="white"
          fontSize="2xl"
          _hover={{
            bg: "whiteAlpha.300",
            transform: "scale(1.2)",
          }}
          transition="all 0.2s"
        />
      </Flex>

      {/* Dot indicators */}
      <Flex
        justify="center"
        gap={2}
        mt={4}
        position="relative"
        zIndex={2}
      >
        {ads.map((_, index) => (
          <Box
            key={index}
            w={index === currentIndex ? "8px" : "6px"}
            h={index === currentIndex ? "8px" : "6px"}
            borderRadius="full"
            bg={index === currentIndex ? "white" : "whiteAlpha.500"}
            cursor="pointer"
            onClick={() => {
              setCurrentIndex(index);
            }}
            transition="all 0.3s ease"
            _hover={{
              bg: "white",
              transform: "scale(1.2)",
            }}
          />
        ))}
      </Flex>
    </Box>
  );
}
