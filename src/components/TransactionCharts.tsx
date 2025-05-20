import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Box, Text, VStack, HStack, SimpleGrid, useColorModeValue } from '@chakra-ui/react';
import { keyframes } from '@chakra-ui/system';
import React from 'react';

interface TransactionChartsProps {
  transactions: Record<string, any[]>;
}

// Keyframes for shiny animation
const shinyAnimation = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

export const TransactionCharts: React.FC<TransactionChartsProps> = ({ transactions }) => {
  // Extract gas fees for each transaction type
  const gasFeesByType = Object.entries(transactions)?.reduce((acc, [type, txs]) => {
    if (type !== '4') {
      acc[type] = extractGasFees(txs);
    }
    return acc;
  }, {} as Record<string, number[]>);

  // Calculate gas fee stats for each transaction type
  const gasFeeStats = Object.entries(gasFeesByType)?.reduce((acc, [type, gasFees]) => {
    acc[type] = calculateGasFeeStats(gasFees);
    return acc;
  }, {} as Record<string, { avg: string; high: string; low: string }>);

  // Prepare data for the pie chart
  const data = Object.entries(transactions)
    ?.filter(([type]) => type !== '4' && type !== 'all')
    ?.map(([type, txs]) => ({
      name: `Type ${type}`,
      value: txs?.length,
      type,
    }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];

  // Chakra UI color mode values
  const boxBg = useColorModeValue('gray.100', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'white');

  // Shiny animation style
  const shinyStyle = {
    background: `linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.5), transparent)`,
    backgroundSize: '200% 100%',
    animation: `${shinyAnimation} 3s linear infinite`,
  };

  return (
    <Box>
      {/* Title */}

      <HStack spacing={8} align="start">
        {/* Pie Chart */}
        <Box flex={1}>
        <Text fontSize="2xl" fontWeight="bold" mb={6} textAlign="center" fontFamily="Poppins, sans-serif">
        Transaction Types and Gas Fees
        </Text> 
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
                animationDuration={1000}
                animationBegin={0}
              >
                {data?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS?.length]} />
                ))}
              </Pie>
              <Tooltip
                content={({ payload }) => {
                  if (payload && payload?.length > 0) {
                    const { name, value, type } = payload[0].payload;
                    const percentage = ((value / data?.reduce((sum, d) => sum + d.value, 0)) * 100).toFixed(2);
                    return (
                      <Box bg={boxBg} p={2} borderRadius="md" boxShadow="md">
                        <Text fontWeight="bold">{name}</Text>
                        <Text>{`${value} Txs (${percentage}% of Total)`}</Text>
                      </Box>
                    );
                  }
                  return null;
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </Box>

        {/* Gas Fee Stats */}
        <Box flex={1}>
          <VStack spacing={4} align="stretch">
            {/* "All" Box (Full Width) */}
            {gasFeeStats.all && (
              <Box
                bg={COLORS[4]}
                p={4}
                borderRadius="20px"
                boxShadow="0 4px 12px rgba(0, 119, 255, 0.3)"
                color="white"
                transition="transform 0.2s, box-shadow 0.2s"
                _hover={{ transform: 'scale(1.05)', boxShadow: '0 6px 16px rgba(0, 119, 255, 0.4)' }}
                position="relative"
                overflow="hidden"
                fontFamily="Poppins, sans-serif"
                display="flex" // Add flexbox to center contents
                flexDirection="column" // Stack children vertically
                alignItems="center" // Center horizontally
                justifyContent="center" // Center vertically
                textAlign="center" // Ensure text is centered
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
                <Text fontWeight="bold" fontSize="lg" mb={2}>
                  Overall
                </Text>
                <Text>Avg: {gasFeeStats.all.avg} Gwei</Text>
                <Text>High: {gasFeeStats.all.high} Gwei</Text>
                <Text>Low: {gasFeeStats.all.low} Gwei</Text>
              </Box>
            )}

            {/* Other Boxes (2x2 Grid) */}
            <SimpleGrid columns={2} spacing={4}>
              {Object.entries(gasFeeStats)
                ?.filter(([type]) => type !== 'all')
                ?.map(([type, stats], index) => (
                    <Box
                    key={type}
                    bg={COLORS[index % COLORS?.length]}
                    p={4}
                    borderRadius="20px"
                    boxShadow="0 4px 12px rgba(0, 119, 255, 0.3)"
                    color="white"
                    transition="transform 0.2s, box-shadow 0.2s"
                    _hover={{ transform: 'scale(1.05)', boxShadow: '0 6px 16px rgba(0, 119, 255, 0.4)' }}
                    position="relative"
                    overflow="hidden"
                    fontFamily="Poppins, sans-serif"
                    display="flex" // Add flexbox to center contents
                    flexDirection="column" // Stack children vertically
                    alignItems="center" // Center horizontally
                    justifyContent="center" // Center vertically
                    textAlign="center" // Ensure text is centered
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
                    <Text fontWeight="bold" fontSize="lg" mb={2}>
                      {`Type ${type}`}
                    </Text>
                    <Text>Avg: {stats.avg} Gwei</Text>
                    <Text>High: {stats.high} Gwei</Text>
                    <Text>Low: {stats.low} Gwei</Text>
                  </Box>
                ))}
            </SimpleGrid>
          </VStack>
        </Box>
      </HStack>
    </Box>
  );
};

// Utility function to extract gas fees
const extractGasFees = (transactions: any[]) => {
  return transactions?.map((tx) => Number(tx.gasPrice || tx.maxFeePerGas || 0));
};

// Utility function to calculate gas fee stats
const calculateGasFeeStats = (gasFees: number[]) => {
  if (!gasFees || gasFees?.length === 0) {
    return { avg: '~', high: '~', low: '~' };
  }

  const total = gasFees?.reduce((sum, fee) => sum + fee, 0);
  const avg = (total / gasFees?.length).toFixed(2);
  const high = Math.max(...gasFees).toFixed(2);
  const low = Math.min(...gasFees).toFixed(2);

  return { avg, high, low };
};