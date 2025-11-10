import React from 'react';
import {
  Box,
  VStack,
  useColorModeValue,
  Container,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';

interface ModernContainerProps {
  children: React.ReactNode;
  maxW?: string;
  spacing?: number;
  withGradient?: boolean;
}

const MotionBox = motion(Box);

const ModernContainer: React.FC<ModernContainerProps> = ({
  children,
  maxW = "100%",
  spacing = 8,
  withGradient = false
}) => {
  const bg = useColorModeValue('gray.50', 'gray.900');
  const containerBg = useColorModeValue('white', 'gray.800');
  
  return (
    <Box
      minH="100vh"
      bg={withGradient ? 
        useColorModeValue(
          'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          'linear-gradient(135deg, #2d3748 0%, #1a202c 100%)'
        ) : bg
      }
      position="relative"
    >
      {/* Background Pattern */}
      {withGradient && (
        <Box
          position="absolute"
          top="0"
          left="0"
          right="0"
          bottom="0"
          opacity={0.1}
          bgImage="radial-gradient(circle at 25px 25px, rgba(255,255,255,0.3) 2px, transparent 0)"
          bgSize="50px 50px"
          pointerEvents="none"
        />
      )}
      
      <Container
        maxW="1400px"
        py={8}
        position="relative"
        zIndex={1}
      >
        <VStack spacing={spacing} align="stretch" w="full">
          {children}
        </VStack>
      </Container>
    </Box>
  );
};

export default ModernContainer;