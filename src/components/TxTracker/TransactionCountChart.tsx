import { useState } from 'react';
import { Box, Text, Button, Flex, useColorModeValue } from '@chakra-ui/react';
import dynamic from 'next/dynamic';

// Dynamically import the Column chart to avoid SSR issues
const Column = dynamic(() => import('@ant-design/plots').then((mod) => mod.Column), { ssr: false });

// Add 'type0' to the TransactionType type
type TransactionType = 'overall' | 'type0' | 'type1' | 'type2' | 'type3' | 'type4' | 'all';

const TransactionCountChart = ({ blocks }: { blocks: any[] }) => {
  const [transactionType, setTransactionType] = useState<TransactionType>('all');
  const [sliderValue, setSliderValue] = useState(0.98); // State for controlling the slider value
  const textColor = useColorModeValue('white', 'white');
  const buttonBg = useColorModeValue('rgba(159, 122, 234, 0.2)', 'rgba(159, 122, 234, 0.1)'); // Button background
  const activeButtonBg = useColorModeValue('rgba(159, 122, 234, 0.5)', 'rgba(159, 122, 234, 0.3)'); // Active button background
  const buttonHoverBg = useColorModeValue('rgba(159, 122, 234, 0.3)', 'rgba(159, 122, 234, 0.2)'); // Button hover background

  // Process data to count transactions per block
  const processData = () => {
    console.log("block:", blocks[0]);
    return blocks
      ?.map((block) => ({
        time: new Date(block.timestamp).toLocaleTimeString(), // Convert timestamp to readable time
        blockNumber: block.blockNumber,
        overall: block.total, // Use the total field for overall transactions
        type0: block.type0, // Include type0
        type1: block.type1,
        type2: block.type2,
        type3: block.type3,
        type4: block.type4,
      }))
      .reverse(); // Reverse to show latest data first
  };

  const sortedData = processData();

  // Prepare data for stacked column chart when 'all' is selected
  const stackedData = sortedData.flatMap((block) => [
    { time: block.time, blockNumber: block.blockNumber, type: 'type0', value: block.type0 },
    { time: block.time, blockNumber: block.blockNumber, type: 'type1', value: block.type1 },
    { time: block.time, blockNumber: block.blockNumber, type: 'type2', value: block.type2 },
    { time: block.time, blockNumber: block.blockNumber, type: 'type3', value: block.type3 },
    { time: block.time, blockNumber: block.blockNumber, type: 'type4', value: block.type4 }
  ]);

  // Chart configuration for @ant-design/plots
  const chartConfig = {
    data: transactionType === 'all' ? stackedData : sortedData,
    xField: 'time',
    yField: transactionType === 'all' ? 'value' : transactionType,
    seriesField: transactionType === 'all' ? 'type' : undefined,
    isStack: transactionType === 'all', // Enable stacking for the 'all' tab
    color: transactionType === 'all' ? ['#FFD700', '#82ca9d', '#ff7300', '#ff0000','green'] : ['#8884d8'],
    columnStyle: {
      radius: [4, 4, 0, 0], // Rounded corners for columns
    },
    legend: { position: "top-right" as const },
    slider: {
      start: sliderValue, // Set the start value from the state
      end: 1, // End of the slider
      step: 0.01, // Define the step value for the slider
      min: 0, // Minimum value for the slider
      max: 1, // Maximum value for the slider
      onChange: (value: number) => {
        setSliderValue(value); // Update state when slider value changes
      },
      onAfterChange: (value: number) => {
        console.log('Slider moved to:', value); // Optional: Perform actions after sliding stops
      },
    },
    tooltip: {
      customContent: (title: string, items: any[]) => {
        const item = items?.[0];
        const blockNumber = item?.data?.blockNumber; // Get block number from data
        return (
          <Box bg="white" p={3} borderRadius="md" border="1px solid" borderColor="gray.200">
            <Text color="black">Time: {title}</Text>
            <Text color="black">Block: {blockNumber}</Text>
            {items?.map((item, index) => (
              <Text key={index} color="black">
                {item.name}: {item.value}
              </Text>
            ))}
          </Box>
        );
      },
    },
  };

  return (
    <Box
      p={5}
      shadow="xl"
      borderWidth="1px"
      borderRadius="lg"
      borderColor={useColorModeValue('whiteAlpha.300', 'whiteAlpha.300')} // Visible border
      bg="blackAlpha.800" // Dark background to make the border stand out
      backdropFilter="blur(10px)"
      m={20}
    >
      <Text
        fontSize={20}
        fontWeight="bold"
        mb={4}
        color={textColor}
        textShadow="0 0 30px rgba(159, 122, 234, 0.8), 0 0 30px rgba(159, 122, 234, 0.8), 0 0 30px rgba(159, 122, 234, 0.8)"
      >
        Transactions Trend
      </Text>
      <br />
      <Flex mb={4} gap={2} wrap="wrap">
        <Flex mb={4} gap={4} wrap="wrap">
          {(['all', 'type0', 'type1', 'type2', 'type3', 'type4', 'overall'] as TransactionType[])?.map((type) => (
            <Button
              key={type}
              onClick={() => setTransactionType(type)}
              bg={transactionType === type ? activeButtonBg : buttonBg}
              color={textColor}
              borderRadius="full" // Fully rounded corners for a pill-like shape
              _hover={{
                bg: buttonHoverBg,
                transform: 'scale(1.05)',
                transition: 'transform 0.2s ease-in-out',
              }}
              _active={{
                bg: activeButtonBg,
              }}
              textShadow="0 0 10px rgba(159, 122, 234, 0.8)"
              boxShadow="0 0 10px rgba(159, 122, 234, 0.5)"
              fontSize={15} // Increased font size
              px={6} // Horizontal padding for better spacing
              py={3} // Vertical padding for better spacing
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </Button>
          ))}
        </Flex>
      </Flex>
      <Box width="100%" height={300}>
        <Column {...chartConfig} />
      </Box>
    </Box>
  );
};

export default TransactionCountChart;