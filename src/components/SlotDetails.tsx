import { Box, Text, VStack, useColorModeValue } from '@chakra-ui/react';
import React from 'react';
import { keyframes } from '@chakra-ui/system';

interface SlotDetailsProps {
  epochNumber: number;
  slotInEpoch: string;
  validator: string;
  blockNumber: number;
  transactions: number;
  size: string;
  gasUsed: string;
  gasLimit: string;
  baseFee: string;
  gasBurnt: string;
}

// Keyframes for shiny animation
const shinyAnimation = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

export const SlotDetails: React.FC<SlotDetailsProps> = ({
  epochNumber,
  slotInEpoch,
  validator,
  blockNumber,
  transactions,
  size,
  gasUsed,
  gasLimit,
  baseFee,
  gasBurnt,
}) => {
  // Chakra UI color mode values
  const boxBg = 'linear-gradient(145deg, #1e3c72, #2a5298)'; // Techno blue gradient
  const textColor = 'white'; // White text
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  // Shiny animation style
  const shinyStyle = {
    background: `linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.5), transparent)`,
    backgroundSize: '200% 100%',
    animation: `${shinyAnimation} 3s linear infinite`,
  };

  return (
    <Box
      p={6}
      borderRadius="20px" // Rounded corners
      borderWidth="1px"
      borderColor={borderColor}
      bg={boxBg}
      boxShadow="lg"
      transition="transform 0.2s, box-shadow 0.2s"
      _hover={{
        transform: 'translateY(-4px)',
        boxShadow: 'xl',
      }}
      position="relative"
      overflow="hidden"
    >
      {/* Shiny overlay */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        style={shinyStyle}
      />

      {/* Content */}
      <VStack align="center" spacing={4} color={textColor}>
        {/* Centered Title */}
        <Text fontSize="2xl" fontWeight="bold" textAlign="center">
          Slot Details
        </Text>

        {/* Details - One per row */}
        <VStack align="start" spacing={3} width="100%">
          <Box>
            <Text fontWeight="semibold" fontSize="lg">Epoch Number: {epochNumber}</Text>
            {/* <Text fontSize="lg">{epochNumber}</Text> */}
          </Box>
          <Box>
            <Text fontWeight="semibold" fontSize="lg">Slot in Epoch: {slotInEpoch}</Text>
            {/* <Text fontSize="lg"></Text> */}
          </Box>
          <Box>
            <Text fontWeight="semibold" fontSize="lg">Validator: {validator}</Text>
            {/* <Text fontSize="lg">{validator}</Text> */}
          </Box>
          <Box>
            <Text fontWeight="semibold" fontSize="lg">Block Number: {blockNumber}</Text>
            {/* <Text fontSize="lg">{blockNumber}</Text> */}
          </Box>
          <Box>
            <Text fontWeight="semibold" fontSize="lg">Transactions: {transactions}</Text>
            {/* <Text fontSize="lg">{transactions}</Text> */}
          </Box>
          <Box>
            <Text fontWeight="semibold" fontSize="lg">Size: {size}</Text>
            {/* <Text fontSize="lg">{size}</Text> */}
          </Box>
          <Box>
            <Text fontWeight="semibold" fontSize="lg">Gas Used: {gasUsed} / {gasLimit}</Text>
            {/* <Text fontSize="lg">{gasUsed} / {gasLimit}</Text> */}
          </Box>
          <Box>
            <Text fontWeight="semibold" fontSize="lg">Base Fee: {baseFee}</Text>
            {/* <Text fontSize="lg">{baseFee}</Text> */}
          </Box>
          <Box>
            <Text fontWeight="semibold" fontSize="lg">Gas Burnt: {gasBurnt}</Text>
            {/* <Text fontSize="lg">{gasBurnt}</Text> */}
          </Box>
        </VStack>
      </VStack>
    </Box>
  );
};