import React, { useState } from 'react';
import {
  Box,
  Heading,
  Text,
  useColorModeValue,
  Collapse,
  IconButton,
  Flex,
  VStack,
  usePrefersReducedMotion,
} from '@chakra-ui/react';
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import { keyframes } from '@emotion/react';

interface FAQItem {
  question: string;
  answer: string;
}

interface AnimatedHeaderProps {
  title: string;
  emoji?: string;
  faqItems?: FAQItem[];
  compact?: boolean;
}

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const gradientShift = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

const float = keyframes`
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-10px) rotate(5deg);
  }
`;

const shimmer = keyframes`
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
`;

const pulse = keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
`;

const AnimatedHeader: React.FC<AnimatedHeaderProps> = ({ 
  title, 
  emoji = "🚀",
  faqItems,
  compact = false,
}) => {
  const [showFAQ, setShowFAQ] = useState(false);
  
  const bgGradient = useColorModeValue(
    'linear(135deg, #3182ce 0%, #2c5282 25%, #2b6cb0 50%, #4299e1 75%, #63b3ed 100%)',
    'linear(135deg, #1a365d 0%, #2c5282 25%, #2b6cb0 50%, #3182ce 75%, #4299e1 100%)'
  );
  
  const textColor = useColorModeValue('gray.800', 'white');
  const descriptionColor = useColorModeValue('gray.600', 'gray.300');
  const borderColor = useColorModeValue('blue.200', 'blue.700');
  const glowColor = useColorModeValue('rgba(49, 130, 206, 0.4)', 'rgba(66, 153, 225, 0.3)');

  return (
    <Box
      position="relative"
      overflow="hidden"
      borderRadius="2xl"
      mb={compact ? 3 : 6}
      borderWidth="2px"
      borderColor={borderColor}
      boxShadow={`0 20px 60px -15px ${glowColor}, 0 0 0 1px ${borderColor}`}
      transition="all 0.3s ease"
      _hover={{
        transform: 'translateY(-2px)',
        boxShadow: `0 25px 70px -15px ${glowColor}, 0 0 0 2px ${borderColor}`,
      }}
    >
      {/* Animated gradient background */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        bgGradient={bgGradient}
        backgroundSize="400% 400%"
        // Reduced: static subtle gradient, no animation
        opacity={useColorModeValue(0.15, 0.25)}
        zIndex={0}
      />

      {/* Floating orbs */}
      <Box
        position="absolute"
        top="-50px"
        right="-50px"
        w="200px"
        h="200px"
        borderRadius="full"
        bgGradient="radial(circle, blue.500, transparent)"
        opacity={0.3}
        filter="blur(40px)"
        // Reduced: static glow, no pulsing
        zIndex={0}
      />
      <Box
        position="absolute"
        bottom="-30px"
        left="-30px"
        w="150px"
        h="150px"
        borderRadius="full"
        bgGradient="radial(circle, cyan.400, transparent)"
        opacity={0.3}
        filter="blur(40px)"
        // Reduced: static glow, no pulsing
        zIndex={0}
      />
      
      {/* Content */}
      <Box
        position="relative"
        zIndex={1}
        bg={useColorModeValue('rgba(255, 255, 255, 0.9)', 'rgba(26, 32, 44, 0.9)')}
        backdropFilter="blur(10px)"
      >
        <Flex
          justify="space-between"
          align="center"
          p={{ base: 4, md: 5 }}
          cursor={faqItems ? "pointer" : "default"}
          onClick={() => faqItems && setShowFAQ(!showFAQ)}
        // Reduced: no entrance animation
        >
          <Flex align="center" gap={3}>
            <Box
              as="span"
              display="inline-block"
              // Reduced: no floating animation
              fontSize={{ base: '2xl', md: '3xl' }}
              filter="drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))"
            >
              {emoji}
            </Box>
            <Heading
              as="h1"
              size={{ base: 'lg', md: 'xl' }}
              color={textColor}
              fontWeight="black"
              letterSpacing="tight"
              bgGradient={useColorModeValue(
                'linear(to-r, #2b6cb0, #3182ce, #4299e1)',
                'linear(to-r, #4299e1, #63b3ed, #90cdf4)'
              )}
              bgClip="text"
              backgroundSize="200% auto"
              // Reduced: static gradient text, no shimmer
            >
              {title}
            </Heading>
          </Flex>
          
          {faqItems && (
            <IconButton
              icon={showFAQ ? <ChevronUpIcon boxSize={6} /> : <ChevronDownIcon boxSize={6} />}
              variant="ghost"
              colorScheme="blue"
              aria-label="Toggle FAQ"
              size="md"
              _hover={{ transform: 'scale(1.1)' }}
              transition="transform 0.2s"
            />
          )}
        </Flex>

        {faqItems && (
          <Collapse in={showFAQ} animateOpacity>
            <VStack
              align="stretch"
              spacing={3}
              px={{ base: 4, md: 5 }}
              pb={{ base: 4, md: 5 }}
              pt={2}
            >
              {faqItems.map((item, index) => (
                <Box
                  key={index}
                  p={3}
                  bg={useColorModeValue('blue.50', 'gray.700')}
                  borderRadius="md"
                  borderLeft="3px solid"
                  borderColor={useColorModeValue('blue.400', 'blue.500')}
                >
                  <Text
                    fontWeight="bold"
                    color={useColorModeValue('blue.700', 'blue.300')}
                    mb={1}
                    fontSize="sm"
                  >
                    {item.question}
                  </Text>
                  <Text
                    fontSize="sm"
                    color={descriptionColor}
                    lineHeight="tall"
                  >
                    {item.answer}
                  </Text>
                </Box>
              ))}
            </VStack>
          </Collapse>
        )}
      </Box>
      

 
    </Box>
  );
};

export default AnimatedHeader;
