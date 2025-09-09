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

const EtherWorldInlineBanner: React.FC = () => {
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
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      mb={6}
    >
      <Box
        bgGradient={bgGradient}
        color={textColor}
        py={{ base: 3, md: 3.5 }}
        px={{ base: 4, md: 6 }}
        position="relative"
        overflow="hidden"
        borderRadius="xl"
        boxShadow="0 8px 32px rgba(0,0,0,0.3)"
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
          align="center"
          justify="space-between"
          position="relative"
          zIndex={1}
          gap={4}
        >
          {/* Left side - Branding */}
          <HStack spacing={3} flex={1}>
            <MotionBox
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              <Icon as={FaGlobe} boxSize={{ base: 6, md: 7 }} color={accentColor} />
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
                  py={0.5}
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
                fontWeight="medium"
                lineHeight="1.2"
              >
                Your Gateway to Ethereum News & Community Insights
              </Text>
            </VStack>
          </HStack>

          {/* Center - Key Features (hidden on mobile) */}
          <VStack
            spacing={1}
            display={{ base: "none", lg: "flex" }}
            align="center"
          >
            <HStack spacing={2}>
              <Icon as={FaNewspaper} boxSize={4} color={accentColor} />
              <Text fontSize="xs" fontWeight="medium">Latest News</Text>
            </HStack>
            <HStack spacing={2}>
              <Icon as={FaRocket} boxSize={4} color={accentColor} />
              <Text fontSize="xs" fontWeight="medium">DeFi Analysis</Text>
            </HStack>
          </VStack>

          {/* Right side - CTA */}
          <HStack spacing={2}>
            <Link href="https://etherworld.co" isExternal>
              <MotionBox
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  bg={accentColor}
                  color="black"
                  size="md"
                  fontWeight="bold"
                  rightIcon={<FaExternalLinkAlt />}
                  _hover={{
                    bg: useColorModeValue('yellow.200', 'yellow.100'),
                    transform: 'translateY(-1px)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                  }}
                  _active={{
                    transform: 'translateY(0px)',
                  }}
                  transition="all 0.2s"
                  px={4}
                  fontSize="sm"
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
              x: Math.random() * 600, 
              y: 50,
              opacity: 0 
            }}
            animate={{ 
              y: -10,
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

export default EtherWorldInlineBanner;
