import React from 'react';
import {
  Box,
  Heading,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { keyframes } from '@emotion/react';

interface AnimatedHeaderProps {
  title: string;
  description: string;
  emoji?: string;
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
  description, 
  emoji = "🚀" 
}) => {
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
      mb={6}
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
        animation={`${gradientShift} 15s ease infinite`}
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
        animation={`${pulse} 4s ease-in-out infinite`}
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
        animation={`${pulse} 5s ease-in-out infinite 1s`}
        zIndex={0}
      />
      
      {/* Content */}
      <Box
        position="relative"
        zIndex={1}
        p={{ base: 6, md: 10 }}
        bg={useColorModeValue('rgba(255, 255, 255, 0.9)', 'rgba(26, 32, 44, 0.9)')}
        backdropFilter="blur(10px)"
      >
        <Box
          animation={`${fadeInUp} 0.8s cubic-bezier(0.4, 0, 0.2, 1)`}
        >
          <Heading
            as="h1"
            size={{ base: 'xl', md: '2xl' }}
            color={textColor}
            fontWeight="black"
            letterSpacing="tight"
            mb={4}
            display="flex"
            alignItems="center"
            gap={3}
            flexWrap="wrap"
          >
            <Box
              as="span"
              display="inline-block"
              animation={`${float} 3s ease-in-out infinite`}
              fontSize={{ base: '3xl', md: '4xl' }}
              filter="drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))"
            >
              {emoji}
            </Box>
            <Box
              as="span"
              position="relative"
              bgGradient={useColorModeValue(
                'linear(to-r, #2b6cb0, #3182ce, #4299e1)',
                'linear(to-r, #4299e1, #63b3ed, #90cdf4)'
              )}
              bgClip="text"
              backgroundSize="200% auto"
              animation={`${shimmer} 3s linear infinite`}
              _after={{
                content: '""',
                position: 'absolute',
                bottom: '-4px',
                left: 0,
                right: 0,
                height: '3px',
                bgGradient: useColorModeValue(
                  'linear(to-r, #2b6cb0, #3182ce)',
                  'linear(to-r, #4299e1, #63b3ed)'
                ),
                borderRadius: 'full',
                transform: 'scaleX(0)',
                transformOrigin: 'left',
                transition: 'transform 0.3s ease',
              }}
              _hover={{
                _after: {
                  transform: 'scaleX(1)',
                },
              }}
            >
              {title}
            </Box>
          </Heading>
          
          <Text
            fontSize={{ base: 'md', md: 'lg' }}
            color={descriptionColor}
            lineHeight="tall"
            maxW="3xl"
            animation={`${fadeInUp} 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.15s both`}
            fontWeight="medium"
            opacity={0.9}
          >
            {description}
          </Text>
        </Box>
      </Box>
      
      {/* Bottom accent line with shimmer effect */}
      <Box
        position="relative"
        h="5px"
        bgGradient={bgGradient}
        backgroundSize="400% 400%"
        animation={`${gradientShift} 15s ease infinite`}
        overflow="hidden"
      >
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bgGradient="linear(to-r, transparent, white, transparent)"
          opacity={0.3}
          animation={`${shimmer} 2s linear infinite`}
        />
      </Box>
    </Box>
  );
};

export default AnimatedHeader;
