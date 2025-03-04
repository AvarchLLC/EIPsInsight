import { useState } from 'react';
import { Box, Text, Button, Flex, useColorModeValue } from '@chakra-ui/react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

type TransactionType = 'overall' | 'type1' | 'type2' | 'type3' | 'all';

const TransactionCountChart = ({ blocks }: { blocks: any[] }) => {
  const [transactionType, setTransactionType] = useState<TransactionType>('overall');
  const textColor = useColorModeValue('white', 'white');
  const buttonBg = useColorModeValue('rgba(159, 122, 234, 0.2)', 'rgba(159, 122, 234, 0.1)'); // Button background
  const activeButtonBg = useColorModeValue('rgba(159, 122, 234, 0.5)', 'rgba(159, 122, 234, 0.3)'); // Active button background
  const buttonHoverBg = useColorModeValue('rgba(159, 122, 234, 0.3)', 'rgba(159, 122, 234, 0.2)'); // Button hover background

  // Process data to count transactions per block
  const processData = () => {
    return blocks.map((block) => {
      const overall = block.transactions.length;
      const type1 = block.transactions.filter((tx: any) => tx.type === '0x1').length;
      const type2 = block.transactions.filter((tx: any) => tx.type === '0x2').length;
      const type3 = block.transactions.filter((tx: any) => tx.type === '0x3').length;

      return {
        time: new Date(Number(block.timestamp) * 1000).toLocaleTimeString(),
        overall,
        type1,
        type2,
        type3,
      };
    }).reverse();
  };

  const data = processData();

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
        Transactions vs Type
      </Text>
      <br/>
      <Flex mb={4} gap={2} wrap="wrap">
      <Flex mb={4} gap={4} wrap="wrap"> {/* Increased gap between buttons */}
  {(['overall', 'type1', 'type2', 'type3', 'all'] as TransactionType[]).map((type) => (
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
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke={useColorModeValue('whiteAlpha.300', 'whiteAlpha.300')} />
          <XAxis dataKey="time" stroke={textColor} />
          <YAxis stroke={textColor} />
          <Tooltip contentStyle={{ backgroundColor: 'blackAlpha.800', borderColor: 'whiteAlpha.300', borderRadius: 'md' }} />
          <Legend wrapperStyle={{ color: textColor }} />
          {transactionType === 'overall' && (
            <Line
              type="basis"
              dataKey="overall"
              stroke="#8884d8"
              strokeWidth={2}
              dot={false}
            />
          )}
          {transactionType === 'type1' && (
            <Line
              type="basis"
              dataKey="type1"
              stroke="#82ca9d"
              strokeWidth={2}
              dot={false}
            />
          )}
          {transactionType === 'type2' && (
            <Line
              type="basis"
              dataKey="type2"
              stroke="#ff7300"
              strokeWidth={2}
              dot={false}
            />
          )}
          {transactionType === 'type3' && (
            <Line
              type="basis"
              dataKey="type3"
              stroke="#ff0000"
              strokeWidth={2}
              dot={false}
            />
          )}
          {transactionType === 'all' && (
            <>
              <Line
                type="basis"
                dataKey="type1"
                stroke="#82ca9d"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="basis"
                dataKey="type2"
                stroke="#ff7300"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="basis"
                dataKey="type3"
                stroke="#ff0000"
                strokeWidth={2}
                dot={false}
              />
            </>
          )}
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default TransactionCountChart;