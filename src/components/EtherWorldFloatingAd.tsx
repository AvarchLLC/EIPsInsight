import React, { useState, useEffect } from 'react';
import {
  Box,
  Text,
  Flex,
  Icon,
  useColorModeValue,
  Link,
  Badge,
  VStack,
  HStack,
  IconButton,
  Tooltip,
} from '@chakra-ui/react';
import { FaGlobe, FaExternalLinkAlt, FaTimes, FaRocket, FaNewspaper } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const MotionBox = motion(Box);

const EtherWorldFloatingAd: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('blue.200', 'blue.500');
  const textColor = useColorModeValue('gray.700', 'gray.200');
  const accentColor = useColorModeValue('blue.600', 'blue.300');
  const shadowColor = useColorModeValue('rgba(0,0,0,0.1)', 'rgba(255,255,255,0.1)');

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <MotionBox
        position="fixed"
        right={4}
        top="50%"
        transform="translateY(-50%)"
        zIndex={1000}
        initial={{ x: 400, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 400, opacity: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Box
          bg={bgColor}
          border="2px solid"
          borderColor={borderColor}
          borderRadius="2xl"
          p={4}
          maxW="280px"
          boxShadow={`0 10px 25px ${shadowColor}`}
          backdropFilter="blur(10px)"
          position="relative"
          overflow="hidden"
          _hover={{
            transform: 'scale(1.02)',
            boxShadow: `0 15px 35px ${shadowColor}`,
          }}
          transition="all 0.3s ease"
        >
          {/* Animated background gradient */}
          <Box
            position="absolute"
            top={0}
            left={0}
            right={0}
            bottom={0}
            bgGradient="linear(45deg, blue.50, purple.50, blue.50)"
            opacity={0.3}
            _dark={{
              bgGradient: "linear(45deg, blue.900, purple.900, blue.900)",
            }}
          />
          
          {/* Close button */}
          <IconButton
            aria-label="Close ad"
            icon={<FaTimes />}
            size="xs"
            position="absolute"
            top={2}
            right={2}
            variant="ghost"
            colorScheme="gray"
            onClick={() => setIsVisible(false)}
            zIndex={2}
          />

          <VStack spacing={3} position="relative" zIndex={1} align="stretch">
            {/* Header with animated icon */}
            <HStack justify="space-between" align="center">
              <HStack spacing={2}>
                <MotionBox
                  animate={{ rotate: isHovered ? 360 : 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <Icon as={FaGlobe} color={accentColor} boxSize={5} />
                </MotionBox>
                <Text fontSize="md" fontWeight="bold" color={textColor}>
                  EtherWorld
                </Text>
              </HStack>
              <Badge
                colorScheme="blue"
                variant="solid"
                borderRadius="full"
                px={2}
                py={1}
                fontSize="xs"
              >
                Partner
              </Badge>
            </HStack>

            {/* Main content with icons */}
            <VStack spacing={2} align="stretch">
              <HStack spacing={2}>
                <Icon as={FaNewspaper} color={accentColor} boxSize={4} />
                <Text fontSize="sm" color={textColor} fontWeight="medium">
                  Latest Ethereum News
                </Text>
              </HStack>
              
              <HStack spacing={2}>
                <Icon as={FaRocket} color={accentColor} boxSize={4} />
                <Text fontSize="sm" color={textColor} fontWeight="medium">
                  Community Insights
                </Text>
              </HStack>
            </VStack>

            {/* CTA Button */}
            <Link
              href="https://etherworld.co"
              isExternal
              _hover={{ textDecoration: 'none' }}
            >
              <MotionBox
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Flex
                  bg={accentColor}
                  color="white"
                  p={3}
                  borderRadius="xl"
                  align="center"
                  justify="space-between"
                  cursor="pointer"
                  _hover={{
                    bg: useColorModeValue('blue.700', 'blue.400'),
                  }}
                  transition="all 0.2s"
                >
                  <Text fontSize="sm" fontWeight="semibold">
                    Explore Now
                  </Text>
                  <Icon as={FaExternalLinkAlt} boxSize={3} />
                </Flex>
              </MotionBox>
            </Link>
          </VStack>

          {/* Floating particles effect */}
          {isHovered && (
            <>
              {[...Array(3)].map((_, i) => (
                <MotionBox
                  key={i}
                  position="absolute"
                  w="4px"
                  h="4px"
                  bg={accentColor}
                  borderRadius="full"
                  initial={{ 
                    x: Math.random() * 200, 
                    y: Math.random() * 150,
                    opacity: 0 
                  }}
                  animate={{ 
                    y: -20,
                    opacity: [0, 1, 0],
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.3,
                  }}
                />
              ))}
            </>
          )}
        </Box>
      </MotionBox>
    </AnimatePresence>
  );
};

export default EtherWorldFloatingAd;
