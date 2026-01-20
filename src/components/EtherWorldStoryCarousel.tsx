import React, { useState, useEffect } from 'react';
import {
  Box,
  Text,
  Flex,
  Icon,
  useColorModeValue,
  Link,
  HStack,
  VStack,
  IconButton,
  Image,
  Circle,
  usePrefersReducedMotion,
} from '@chakra-ui/react';
import { 
  FaChevronLeft,
  FaChevronRight,
  FaPlay,
  FaPause,
  FaEthereum,
  FaNewspaper,
  FaUsers,
  FaRocket,
  FaGlobe,
  FaExternalLinkAlt
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const MotionBox = motion(Box);
const MotionFlex = motion(Flex);

interface StoryScene {
  id: number;
  title: string;
  description: string;
  icon: any;
  bgColor: string;
  accentColor: string;
  animation: string;
  adType: string;
}

const storyScenes: StoryScene[] = [
  {
    id: 1,
    title: "EtherWorld",
    description: "Your Gateway to Ethereum News & Community",
    icon: FaGlobe,
    bgColor: "linear(45deg, blue.500, purple.600)",
    accentColor: "cyan.200",
    animation: "fadeIn",
    adType: "main"
  },
  {
    id: 2,
    title: "Ad 2: Breaking News",
    description: "Real-time Ethereum updates and market insights",
    icon: FaNewspaper,
    bgColor: "linear(45deg, green.500, teal.500)",
    accentColor: "emerald.200",
    animation: "slideUp",
    adType: "news"
  },
  {
    id: 3,
    title: "Ad 3: DeFi Hub",
    description: "Explore the latest in decentralized finance",
    icon: FaEthereum,
    bgColor: "linear(45deg, purple.500, pink.500)",
    accentColor: "pink.200",
    animation: "bounce",
    adType: "defi"
  },
  {
    id: 4,
    title: "Ad 4: Community",
    description: "Join thousands of Ethereum enthusiasts",
    icon: FaUsers,
    bgColor: "linear(45deg, orange.500, red.500)",
    accentColor: "orange.200",
    animation: "rotate",
    adType: "community"
  },
  {
    id: 5,
    title: "Ad 5: Innovation",
    description: "Discover cutting-edge Web3 projects",
    icon: FaRocket,
    bgColor: "linear(45deg, indigo.500, blue.500)",
    accentColor: "blue.200",
    animation: "fadeIn",
    adType: "innovation"
  }
];

const EtherWorldStoryCarousel: React.FC = () => {
  const [currentScene, setCurrentScene] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false); // reduced: no autoplay by default
  const [direction, setDirection] = useState(1);
  const prefersReducedMotion = usePrefersReducedMotion();

  const bgBase = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.700', 'gray.200');

  useEffect(() => {
    if (!isPlaying || prefersReducedMotion) return;

    const timer = setInterval(() => {
      setDirection(1);
      setCurrentScene((prev) => (prev + 1) % storyScenes.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [isPlaying, prefersReducedMotion]);

  const nextScene = () => {
    setDirection(1);
    setCurrentScene((prev) => (prev + 1) % storyScenes.length);
  };

  const prevScene = () => {
    setDirection(-1);
    setCurrentScene((prev) => (prev - 1 + storyScenes.length) % storyScenes.length);
  };

  const goToScene = (index: number) => {
    setDirection(index > currentScene ? 1 : -1);
    setCurrentScene(index);
  };

  const current = storyScenes[currentScene];

  const getAnimation = (animationType: string) => {
    switch (animationType) {
      case 'fadeIn':
        return {
          scale: [0.8, 1.1, 1],
          opacity: [0, 0.5, 1],
          rotate: [0, 5, 0]
        };
      case 'slideUp':
        return {
          y: [50, -10, 0],
          opacity: [0, 1, 1],
          scale: [0.9, 1.1, 1]
        };
      case 'bounce':
        return {
          y: [0, -20, 0, -10, 0],
          scale: [1, 1.2, 1, 1.1, 1],
          rotate: [0, 10, -10, 5, 0]
        };
      case 'rotate':
        return {
          rotate: [0, 360, 720],
          scale: [1, 0.8, 1.2, 1],
          opacity: [0.5, 1, 1, 1]
        };
      default:
        return { scale: [0.9, 1] };
    }
  };

  return (
    <MotionBox
      initial={prefersReducedMotion ? undefined : { opacity: 0, y: 50 }}
      animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
      transition={prefersReducedMotion ? undefined : { duration: 0.6 }}
      mb={6}
    >
      <Box
        bg={bgBase}
        borderRadius="xl"
        overflow="hidden"
        boxShadow="0 8px 20px rgba(0,0,0,0.1)"
        border="1px solid"
        borderColor={useColorModeValue('gray.200', 'gray.600')}
        position="relative"
        height="90px"
      >
        <AnimatePresence mode="wait">
          <MotionBox
            key={currentScene}
            initial={
              prefersReducedMotion
                ? undefined
                : {
                    x: direction > 0 ? 300 : -300,
                    opacity: 0,
                    scale: 0.8,
                  }
            }
            animate={
              prefersReducedMotion
                ? { opacity: 1, x: 0, scale: 1 }
                : {
                    x: 0,
                    opacity: 1,
                    scale: 1,
                  }
            }
            exit={
              prefersReducedMotion
                ? undefined
                : {
                    x: direction > 0 ? -300 : 300,
                    opacity: 0,
                    scale: 0.8,
                  }
            }
            transition={
              prefersReducedMotion
                ? { duration: 0.2 }
                : {
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                  }
            }
            position="absolute"
            top={0}
            left={0}
            right={0}
            bottom={0}
          >
            <Flex
              bgGradient={current.bgColor}
              h="full"
              align="center"
              justify="space-between"
              px={4}
              position="relative"
              overflow="hidden"
            >
              {/* Simplified background elements */}
              <Box
                position="absolute"
                top={0}
                left={0}
                right={0}
                bottom={0}
                opacity={0.08}
              >
                {[...Array(3)].map((_, i) => (
                  <MotionBox
                    key={i}
                    position="absolute"
                    w="20px"
                    h="20px"
                    borderRadius="full"
                    bg="white"
                    initial={{
                      x: Math.random() * 300,
                      y: Math.random() * 60,
                      scale: 0.3
                    }}
                    animate={{
                      x: Math.random() * 300,
                      y: Math.random() * 60,
                      opacity: [0.3, 0.5, 0.3]
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      delay: i * 0.8
                    }}
                  />
                ))}
              </Box>

              {/* Content */}
              <HStack spacing={3} flex={1} color="white" zIndex={2}>
                <MotionBox
                  animate={getAnimation(current.animation)}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                >
                  <Circle size="35px" bg={current.accentColor} color="gray.800">
                    <Icon as={current.icon} boxSize={4} />
                  </Circle>
                </MotionBox>
                
                <VStack align="start" spacing={0}>
                  <Text fontSize="md" fontWeight="bold" letterSpacing="wide">
                    {current.title}
                  </Text>
                  <Text fontSize="xs" opacity={0.9} maxW="250px" noOfLines={1}>
                    {current.description}
                  </Text>
                </VStack>
              </HStack>

              {/* CTA Section */}
              <HStack spacing={2} zIndex={2}>
                <Link href="https://etherworld.co" isExternal>
                  <MotionBox
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Flex
                      bg="white"
                      color="gray.800"
                      px={3}
                      py={1.5}
                      borderRadius="full"
                      align="center"
                      gap={1}
                      fontWeight="bold"
                      cursor="pointer"
                      _hover={{ bg: "gray.100" }}
                      transition="all 0.2s"
                      fontSize="xs"
                    >
                      <Text>Visit</Text>
                      <Icon as={FaExternalLinkAlt} boxSize={2.5} />
                    </Flex>
                  </MotionBox>
                </Link>
              </HStack>
            </Flex>
          </MotionBox>
        </AnimatePresence>

        {/* Navigation Controls */}
        <HStack
          position="absolute"
          bottom={1}
          right={2}
          spacing={1}
          zIndex={10}
        >
          {/* Scene Indicators */}
          {storyScenes.map((_, index) => (
            <MotionBox
              key={index}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            >
              <Circle
                size="6px"
                bg={index === currentScene ? "white" : "whiteAlpha.400"}
                cursor="pointer"
                onClick={() => goToScene(index)}
                transition="all 0.2s"
              />
            </MotionBox>
          ))}
        </HStack>
      </Box>
    </MotionBox>
  );
};

export default EtherWorldStoryCarousel;
