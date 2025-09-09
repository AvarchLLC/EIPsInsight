import React, { useState } from 'react';
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
} from '@chakra-ui/react';
import { FaGlobe, FaExternalLinkAlt, FaTimes, FaNewspaper, FaRocket } from 'react-icons/fa';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);
const MotionFlex = motion(Flex);

const EtherWorldTopBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  const bgGradient = useColorModeValue(
    'linear(to-r, blue.500, purple.600, blue.700)',
    'linear(to-r, blue.600, purple.700, blue.800)'
  );
  const textColor = 'white';
  const accentColor = useColorModeValue('yellow.300', 'yellow.200');

  if (!isVisible) return null;

  return (
    <MotionBox
      position="fixed"
      top={0}
      left={0}
      right={0}
      zIndex={999999}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.5 }}
    >
      <Box
        bgGradient={bgGradient}
        color={textColor}
        py={{ base: 3, md: 4 }}
        px={{ base: 4, md: 6 }}
        position="relative"
        overflow="hidden"
      >
        {/* Animated background pattern */}
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          opacity={0.1}
          background="repeating-linear-gradient(45deg, transparent, transparent 10px, white 10px, white 12px)"
        />

        <Flex
          maxW="1200px"
          mx="auto"
          align="center"
          justify="space-between"
          position="relative"
          zIndex={1}
        >
          {/* Left side - Branding */}
          <HStack spacing={4}>
            <MotionBox
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              <Icon as={FaGlobe} boxSize={{ base: 6, md: 8 }} color={accentColor} />
            </MotionBox>
            
            <VStack spacing={0} align="start">
              <HStack spacing={2}>
                <Text
                  fontSize={{ base: "lg", md: "xl" }}
                  fontWeight="bold"
                  letterSpacing="wide"
                >
                  EtherWorld
                </Text>
                <Badge
                  bg={accentColor}
                  color="black"
                  px={2}
                  py={1}
                  borderRadius="full"
                  fontSize="xs"
                  fontWeight="bold"
                >
                  Official Partner
                </Badge>
              </HStack>
              <Text
                fontSize={{ base: "sm", md: "md" }}
                opacity={0.9}
                display={{ base: "none", md: "block" }}
              >
                Your Gateway to Ethereum News & Insights
              </Text>
            </VStack>
          </HStack>

          {/* Center - Key Features (hidden on mobile) */}
          <HStack
            spacing={6}
            display={{ base: "none", lg: "flex" }}
          >
            <HStack spacing={2}>
              <Icon as={FaNewspaper} boxSize={5} color={accentColor} />
              <Text fontSize="sm" fontWeight="medium">Latest News</Text>
            </HStack>
            <HStack spacing={2}>
              <Icon as={FaRocket} boxSize={5} color={accentColor} />
              <Text fontSize="sm" fontWeight="medium">DeFi Analysis</Text>
            </HStack>
          </HStack>

          {/* Right side - CTA */}
          <HStack spacing={3}>
            <Link href="https://etherworld.co" isExternal>
              <MotionBox
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  bg={accentColor}
                  color="black"
                  size={{ base: "sm", md: "md" }}
                  fontWeight="bold"
                  rightIcon={<FaExternalLinkAlt />}
                  _hover={{
                    bg: useColorModeValue('yellow.200', 'yellow.100'),
                    transform: 'translateY(-1px)',
                  }}
                  _active={{
                    transform: 'translateY(0px)',
                  }}
                  transition="all 0.2s"
                >
                  Explore Now
                </Button>
              </MotionBox>
            </Link>
            
            <IconButton
              aria-label="Close banner"
              icon={<FaTimes />}
              size="sm"
              variant="ghost"
              color="white"
              _hover={{ bg: 'whiteAlpha.200' }}
              onClick={() => setIsVisible(false)}
            />
          </HStack>
        </Flex>

        {/* Floating particles effect */}
        {[...Array(3)].map((_, i) => (
          <MotionBox
            key={i}
            position="absolute"
            w="4px"
            h="4px"
            bg={accentColor}
            borderRadius="full"
            initial={{ 
              x: Math.random() * 1200, 
              y: 60,
              opacity: 0 
            }}
            animate={{ 
              y: -20,
              opacity: [0, 1, 0],
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              delay: i * 1,
            }}
          />
        ))}
      </Box>
    </MotionBox>
  );
};

export default EtherWorldTopBanner;
