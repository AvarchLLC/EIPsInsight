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
  Badge,
  Button,
  Progress,
  Tooltip,
} from '@chakra-ui/react';
import { 
  FaGlobe, 
  FaExternalLinkAlt, 
  FaTimes, 
  FaRocket, 
  FaMagic,
  FaGem,
  FaFire,
  FaHeart,
  FaStar,
  FaGamepad
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const MotionBox = motion(Box);
const MotionFlex = motion(Flex);

const EtherWorldCreativeAd: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [currentMode, setCurrentMode] = useState<'minimal' | 'hover' | 'interactive' | 'celebration'>('minimal');
  const [interactionCount, setInteractionCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number}>>([]);

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('purple.200', 'purple.500');
  const accentColor = useColorModeValue('purple.600', 'purple.300');
  const gradientBg = useColorModeValue(
    'linear(45deg, purple.400, pink.400, blue.400, purple.400)',
    'linear(45deg, purple.600, pink.600, blue.600, purple.600)'
  );

  useEffect(() => {
    if (currentMode === 'celebration') {
      const timer = setTimeout(() => setCurrentMode('interactive'), 3000);
      return () => clearTimeout(timer);
    }
  }, [currentMode]);

  const handleInteraction = () => {
    setInteractionCount(prev => prev + 1);
    if (interactionCount >= 2) {
      setCurrentMode('celebration');
    } else {
      setCurrentMode('interactive');
    }
    
    // Create explosion effect
    const newParticles = Array.from({length: 8}, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 300,
      y: Math.random() * 100
    }));
    setParticles(newParticles);
    setTimeout(() => setParticles([]), 2000);
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    handleInteraction();
  };

  if (!isVisible) return null;

  return (
    <MotionBox
      initial={{ scale: 0.8, opacity: 0, rotateY: -180 }}
      animate={{ scale: 1, opacity: 1, rotateY: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20, duration: 1 }}
      mb={6}
      perspective="1000px"
    >
      <AnimatePresence mode="wait">
        {currentMode === 'minimal' && (
          <MotionBox
            key="minimal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            onMouseEnter={() => setCurrentMode('hover')}
            cursor="pointer"
            onClick={handleInteraction}
          >
            <Flex
              bg={bgColor}
              border="2px solid"
              borderColor={borderColor}
              borderRadius="2xl"
              p={4}
              align="center"
              justify="space-between"
              _hover={{
                borderColor: accentColor,
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
              }}
              transition="all 0.3s ease"
              position="relative"
              overflow="hidden"
            >
              <HStack spacing={3}>
                <MotionBox
                  animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Icon as={FaGem} color={accentColor} boxSize={6} />
                </MotionBox>
                <Text fontSize="lg" fontWeight="bold">
                  Discover EtherWorld ✨
                </Text>
              </HStack>
              <Text fontSize="sm" opacity={0.7}>
                Click to explore →
              </Text>
            </Flex>
          </MotionBox>
        )}

        {currentMode === 'hover' && (
          <MotionBox
            key="hover"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onMouseLeave={() => setCurrentMode('minimal')}
            onClick={handleInteraction}
          >
            <Box
              bgGradient={gradientBg}
              borderRadius="2xl"
              p={5}
              position="relative"
              overflow="hidden"
              cursor="pointer"
              _hover={{ transform: 'scale(1.02)' }}
              transition="all 0.3s ease"
            >
              <Box
                position="absolute"
                top={0}
                left={0}
                right={0}
                bottom={0}
                bg="white"
                opacity={0.1}
                backgroundImage="radial-gradient(circle at 20% 50%, white 2px, transparent 2px)"
                backgroundSize="20px 20px"
              />
              
              <Flex align="center" justify="space-between" color="white" position="relative" zIndex={1}>
                <HStack spacing={4}>
                  <MotionBox
                    animate={{ 
                      rotate: [0, 360],
                      scale: [1, 1.3, 1],
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <Icon as={FaRocket} boxSize={8} />
                  </MotionBox>
                  <VStack align="start" spacing={1}>
                    <Text fontSize="xl" fontWeight="bold">
                      EtherWorld Premium
                    </Text>
                    <Text fontSize="sm" opacity={0.9}>
                      Join the Ethereum Revolution
                    </Text>
                  </VStack>
                </HStack>
                <Text fontSize="lg" fontWeight="bold">
                  🚀 Launch!
                </Text>
              </Flex>
            </Box>
          </MotionBox>
        )}

        {currentMode === 'interactive' && (
          <MotionBox
            key="interactive"
            initial={{ opacity: 0, rotateX: -90 }}
            animate={{ opacity: 1, rotateX: 0 }}
            exit={{ opacity: 0, rotateX: 90 }}
            style={{ transformStyle: "preserve-3d" }}
          >
            <Box
              bg={bgColor}
              border="3px solid"
              borderColor={accentColor}
              borderRadius="3xl"
              p={6}
              position="relative"
              overflow="hidden"
              boxShadow="0 20px 40px rgba(0,0,0,0.2)"
            >
              {/* Particle explosion effect */}
              {particles.map(particle => (
                <MotionBox
                  key={particle.id}
                  position="absolute"
                  w="8px"
                  h="8px"
                  bg={accentColor}
                  borderRadius="full"
                  initial={{ x: particle.x, y: particle.y, scale: 0 }}
                  animate={{ 
                    x: particle.x + (Math.random() - 0.5) * 200,
                    y: particle.y - Math.random() * 100,
                    scale: [0, 1, 0],
                    rotate: 360
                  }}
                  transition={{ duration: 2 }}
                />
              ))}

              <VStack spacing={4}>
                <HStack justify="space-between" w="full">
                  <HStack spacing={3}>
                    <MotionBox
                      animate={{ 
                        rotateY: 360,
                        scale: [1, 1.2, 1]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Icon as={FaMagic} color={accentColor} boxSize={8} />
                    </MotionBox>
                    <VStack align="start" spacing={0}>
                      <Text fontSize="xl" fontWeight="bold">
                        EtherWorld Universe
                      </Text>
                      <HStack spacing={1}>
                        <Badge colorScheme="purple" variant="solid">Magic</Badge>
                        <Badge colorScheme="pink" variant="solid">Partner</Badge>
                      </HStack>
                    </VStack>
                  </HStack>
                  
                  <IconButton
                    aria-label="Close"
                    icon={<FaTimes />}
                    size="sm"
                    variant="ghost"
                    onClick={() => setIsVisible(false)}
                  />
                </HStack>

                <Progress 
                  value={(interactionCount / 3) * 100} 
                  colorScheme="purple" 
                  w="full" 
                  borderRadius="full"
                  bg="gray.200"
                  size="sm"
                />

                <HStack spacing={4} w="full">
                  <Tooltip label="Like this magic!">
                    <MotionBox
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <IconButton
                        aria-label="Like"
                        icon={<FaHeart />}
                        colorScheme={isLiked ? "red" : "gray"}
                        variant={isLiked ? "solid" : "outline"}
                        onClick={handleLike}
                      />
                    </MotionBox>
                  </Tooltip>

                  <Link href="https://etherworld.co" isExternal flex={1}>
                    <MotionBox
                      whileHover={{ scale: 1.05, rotateZ: 2 }}
                      whileTap={{ scale: 0.95 }}
                      w="full"
                    >
                      <Button
                        bgGradient="linear(to-r, purple.500, pink.500)"
                        color="white"
                        size="lg"
                        w="full"
                        rightIcon={<FaExternalLinkAlt />}
                        _hover={{
                          bgGradient: "linear(to-r, purple.600, pink.600)",
                        }}
                        fontWeight="bold"
                      >
                        Enter the Magic Portal ✨
                      </Button>
                    </MotionBox>
                  </Link>

                  <Tooltip label="More interactions!">
                    <MotionBox
                      whileHover={{ scale: 1.2, rotate: 360 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <IconButton
                        aria-label="Interact"
                        icon={<FaGamepad />}
                        colorScheme="purple"
                        variant="outline"
                        onClick={handleInteraction}
                      />
                    </MotionBox>
                  </Tooltip>
                </HStack>
              </VStack>
            </Box>
          </MotionBox>
        )}

        {currentMode === 'celebration' && (
          <MotionBox
            key="celebration"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
          >
            <Box
              bgGradient="linear(45deg, gold, orange.400, gold)"
              borderRadius="3xl"
              p={6}
              position="relative"
              overflow="hidden"
              boxShadow="0 0 50px rgba(255,215,0,0.5)"
            >
              {/* Celebration particles */}
              {[...Array(20)].map((_, i) => (
                <MotionBox
                  key={i}
                  position="absolute"
                  initial={{ 
                    x: Math.random() * 400,
                    y: Math.random() * 150,
                    scale: 0
                  }}
                  animate={{ 
                    y: -50,
                    scale: [0, 1, 0],
                    rotate: 360
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.1
                  }}
                >
                  <Icon 
                    as={[FaStar, FaGem, FaFire][i % 3]} 
                    color="white" 
                    boxSize={4} 
                  />
                </MotionBox>
              ))}

              <VStack spacing={4} color="white" position="relative" zIndex={1}>
                <MotionBox
                  animate={{ 
                    scale: [1, 1.3, 1],
                    rotate: [0, 360, 0]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Icon as={FaStar} boxSize={12} />
                </MotionBox>
                
                <Text fontSize="2xl" fontWeight="bold" textAlign="center">
                  🎉 Congratulations! 🎉
                </Text>
                
                <Text fontSize="lg" textAlign="center">
                  You've unlocked the EtherWorld Magic Portal!
                </Text>

                <Link href="https://etherworld.co" isExternal>
                  <MotionBox
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Button
                      bg="white"
                      color="gold"
                      size="lg"
                      rightIcon={<FaRocket />}
                      fontWeight="bold"
                      _hover={{ bg: "gray.100" }}
                    >
                      Claim Your Reward! 🏆
                    </Button>
                  </MotionBox>
                </Link>
              </VStack>
            </Box>
          </MotionBox>
        )}
      </AnimatePresence>
    </MotionBox>
  );
};

export default EtherWorldCreativeAd;
