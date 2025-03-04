import { Box, Text, useColorModeValue } from "@chakra-ui/react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,  } from "recharts";
import { convertEthToUSD } from "./ethereumService";

const TransactionFeeChart = ({ data, totalBurntLastHour, ethPriceInUSD }: { data: any[]; totalBurntLastHour: string; ethPriceInUSD: number }) => {
  if (!data || data.length === 0) return null;

  // Sort data in increasing timestamp order
  const sortedData = [...data].sort((a, b) => a.time - b.time).reverse();
  const textColor = useColorModeValue('white', 'white');

  return (
    <Box p={5} shadow="md" borderWidth="1px" borderRadius="md" m={20}>
      <Text
        fontSize={20}
        fontWeight="bold"
        mb={4}
        color={textColor}
        textShadow="0 0 30px rgba(159, 122, 234, 0.8), 0 0 30px rgba(159, 122, 234, 0.8), 0 0 30px rgba(159, 122, 234, 0.8)"
      >
      Base GWei vs Time (Total gas burnt in Last 1 Hour: {totalBurntLastHour} ETH (${convertEthToUSD(Number(totalBurntLastHour), ethPriceInUSD)}))
      </Text>
      <br/>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={sortedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Legend />
          {/* Add shaded area under the curve */}
          <Area type="basis" dataKey="fee" stroke="#8884d8" fill="rgba(136, 132, 216, 0.3)" strokeWidth={2} dot={false} />
        </AreaChart>
      </ResponsiveContainer>
    </Box>
  );
};



export default TransactionFeeChart;
