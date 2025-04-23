import React from 'react';
import {
  Box,
  Flex,
  Text,
  Tooltip,
  useColorModeValue,
  HStack,
} from '@chakra-ui/react';

const COLOR_SCHEME = {
  included: '#48BB78',   // green
  scheduled: '#4299E1',  // blue
  considered: '#F6AD55', // orange
  declined: '#F56565',   // red
};

interface EIPData {
  date: string;
  included: string[];
  scheduled: string[];
  declined: string[];
  considered: string[];
}

const TimelineChart: React.FC<{ data: EIPData[] }> = ({ data }) => {
  const bgColor = useColorModeValue('gray.50', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const tooltipBg = useColorModeValue('white', 'gray.700');
  const tooltipColor = useColorModeValue('gray.800', 'white');

  const cubeSize = 15;

  const maxCount = Math.max(
    ...data.map(
      d =>
        d.included.length +
        d.scheduled.length +
        d.considered.length +
        d.declined.length
    )
  );

  return (
    <Box width="100%" p={4}>
      {/* Legend */}
      <Flex justify="flex-end" mb={4}>
        <HStack spacing={4}>
          {Object.entries(COLOR_SCHEME).map(([status, color]) => (
            <Flex key={status} align="center">
              <Box w={4} h={4} bg={color} borderRadius="sm" mr={2} />
              <Text fontSize="sm" textTransform="capitalize">{status}</Text>
            </Flex>
          ))}
        </HStack>
      </Flex>

      {/* Chart Container */}
        <Box
        width="100%"
        overflowX="auto"
        border="1px solid"
        borderColor={borderColor}
        borderRadius="md"
        p={4}
        bg={bgColor}
        >
        <Flex align="flex-end" gap={8} wrap="nowrap">
            {data.map((item, index) => {
            const allEips = [
                ...item.included.map(eip => ({ eip, type: 'included' })),
                ...item.scheduled.map(eip => ({ eip, type: 'scheduled' })),
                ...item.considered.map(eip => ({ eip, type: 'considered' })),
                ...item.declined.map(eip => ({ eip, type: 'declined' })),
            ];

            return (
                <Flex key={index} direction="column" align="center" minW="60px">
                <Flex
                    direction="column-reverse"
                    gap={2}
                    minHeight={`${maxCount * (cubeSize + 4)}px`}
                >
                    {allEips.map((eipData, eipIndex) => (
                    <Tooltip
                        key={`${index}-${eipIndex}`}
                        label={
                        <Box>
                            <Text fontWeight="bold">{eipData.eip}</Text>
                            <Text textTransform="capitalize">{eipData.type}</Text>
                        </Box>
                        }
                        hasArrow
                        bg={tooltipBg}
                        color={tooltipColor}
                        borderRadius="md"
                        p={2}
                        boxShadow="md"
                    >
                        <Box
                        bg={COLOR_SCHEME[eipData.type as keyof typeof COLOR_SCHEME]}
                        w={`${cubeSize}px`}
                        h={`${cubeSize}px`}
                        borderRadius="md"
                        border="1px solid"
                        borderColor={useColorModeValue('whiteAlpha.600', 'blackAlpha.600')}
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        >
                        <Text fontSize="8px" color="white" fontWeight="bold" noOfLines={1}>
                            {eipData.eip.replace('EIP-', '')}
                        </Text>
                        </Box>
                    </Tooltip>
                    ))}
                </Flex>

                {/* Date label below column */}
                <Text fontSize="12px" mt={2} textAlign="center" whiteSpace="nowrap">
                    {item.date}
                </Text>
                </Flex>
            );
            })}
        </Flex>
        </Box>

    </Box>
  );
};

export default TimelineChart;
