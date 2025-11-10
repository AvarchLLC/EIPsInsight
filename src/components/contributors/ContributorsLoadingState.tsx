import React from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Spinner,
  Progress,
  useColorModeValue,
} from '@chakra-ui/react';
import { keyframes } from '@emotion/react';
import { motion } from 'framer-motion';

// Wrap Chakra components with motion
const MotionBox = motion(Box);
const MotionText = motion(Text);
const MotionVStack = motion(VStack);

const pulseAnimation = keyframes`
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.1); opacity: 0.7; }
  100% { transform: scale(1); opacity: 1; }
`;

const ContributorsLoadingState: React.FC = () => {
  const bg = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');
  const mutedColor = useColorModeValue('gray.600', 'gray.400');

  return (
    <Box
      minH="60vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      bg={bg}
      borderRadius="xl"
      p={8}
    >
      <VStack spacing={8} textAlign="center">
        {/* Animated Loading Spinner */}
        <MotionBox
          animation={`${pulseAnimation} 2s ease-in-out infinite`}
        >
          <Spinner
            size="xl"
            color="blue.500"
            thickness="4px"
            speed="0.8s"
          />
        </MotionBox>

        {/* Loading Text */}
        <MotionVStack spacing={3}>
          <MotionText
            fontSize="2xl"
            fontWeight="bold"
            color="blue.500"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Loading Contributors Analytics
          </MotionText>

          <MotionText
            color={mutedColor}
            fontSize="md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Fetching contributor data and generating insights...
          </MotionText>
        </MotionVStack>

        {/* Loading Progress Bar */}
        <Box width="300px">
          <Progress
            size="lg"
            colorScheme="blue"
            isIndeterminate
            borderRadius="full"
            bg={cardBg}
          />
          <HStack justify="space-between" mt={2}>
            <Text fontSize="xs" color={mutedColor}>
              📊 Loading stats
            </Text>
            <Text fontSize="xs" color={mutedColor}>
              🏆 Preparing charts
            </Text>
            <Text fontSize="xs" color={mutedColor}>
              📈 Analyzing data
            </Text>
          </HStack>
        </Box>

        {/* Loading Steps Animation */}
        <HStack spacing={4}>
          {['Fetching', 'Processing', 'Rendering'].map((step, index) => (
            <MotionBox
              key={step}
              initial={{ opacity: 0.3, scale: 0.8 }}
              animate={{
                opacity: [0.3, 1, 0.3],
                scale: [0.8, 1, 0.8],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: index * 0.3,
              }}
              p={3}
              bg={cardBg}
              borderRadius="lg"
              border="2px solid"
              borderColor="blue.200"
            >
              <Text fontSize="sm" color={textColor} fontWeight="medium">
                {step}
              </Text>
            </MotionBox>
          ))}
        </HStack>

        {/* Fun Fact */}
        <MotionBox
          p={4}
          bg={cardBg}
          borderRadius="lg"
          borderLeft="4px solid"
          borderLeftColor="blue.500"
          maxWidth="400px"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <Text fontSize="sm" color={mutedColor} fontStyle="italic">
            💡 Did you know? Our analytics process multiple data points including commits, 
            code additions, deletions, and contributor activity patterns to give you 
            comprehensive insights.
          </Text>
        </MotionBox>
      </VStack>
    </Box>
  );
};

export default ContributorsLoadingState;
