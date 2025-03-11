import { Box, Text, SimpleGrid, Icon, useColorModeValue } from '@chakra-ui/react';
import { FaEthereum, FaGasPump, FaFire, FaList, FaCube, FaClock, FaCoins, FaExchangeAlt } from 'react-icons/fa';
import { convertEthToUSD, convertGweiToUSD } from './ethereumService';

const BlockInfo = ({ title, data, ethPriceInUSD }: { title: string; data: any; ethPriceInUSD: number }) => {
  // Colors and shadows
  const textColor = useColorModeValue('white', 'white');
  const shadow = '10px 4px 10px rgba(159, 122, 234, 0.5)';
  const gridBg = useColorModeValue('rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)');
  const borderColor = useColorModeValue('whiteAlpha.300', 'whiteAlpha.300'); // Visible border color

  return (
    <Box
      p={5}
      shadow="xl"
      borderWidth="1px"
      borderRadius="lg"
      borderColor={"white"} // Visible border
    //   bg="blackAlpha.800" 
      backdropFilter="blur(10px)"
      m={20} // Margin of 5
    >
      <Text
        fontSize={25}
        fontWeight="bold"
        mb={6}
        color={textColor}
        textShadow="0 0 30px rgba(159, 122, 234, 0.8), 0 0 30px rgba(159, 122, 234, 0.8), 0 0 30px rgba(159, 122, 234, 0.8)"
        display="flex"
        alignItems="center"
      >
        <Icon as={FaCube} color={"white"} mr={2} /> {title}
      </Text>

      <SimpleGrid
        columns={2}
        spacing={6}
        p={4}
        borderColor={"white"}
        borderRadius="md"
        border="1px solid"
        // bg={gridBg} 
      >
        {/* Block Number */}
        <Box display="flex" alignItems="center" justifyContent="center">
          <Icon as={FaCube} color={"white"} mr={2} />
          <Text color={textColor} textShadow="0 0 30px rgba(159, 122, 234, 0.8), 0 0 30px rgba(159, 122, 234, 0.8), 0 0 30px rgba(159, 122, 234, 0.8)">
            Block Number: {Number(data.blockNumber)}
          </Text>
        </Box>

        {/* Epoch */}
        <Box display="flex" alignItems="center" justifyContent="center">
          <Icon as={FaClock} color={"white"} mr={2} />
          <Text color={textColor} textShadow="0 0 30px rgba(159, 122, 234, 0.8), 0 0 30px rgba(159, 122, 234, 0.8), 0 0 30px rgba(159, 122, 234, 0.8)">
            Epoch: {data.epochNumber}
          </Text>
        </Box>

        {/* Slot */}
        <Box display="flex" alignItems="center" justifyContent="center">
          <Icon as={FaClock} color={"white"} mr={2} />
          <Text color={textColor} textShadow="0 0 30px rgba(159, 122, 234, 0.8), 0 0 30px rgba(159, 122, 234, 0.8), 0 0 30px rgba(159, 122, 234, 0.8)">
            Slot: {data.slotInEpoch}
          </Text>
        </Box>

        {/* Base Fee */}
        <Box display="flex" alignItems="center" justifyContent="center">
          <Icon as={FaCoins} color={"white"} mr={2} />
          <Text color={textColor} textShadow="0 0 30px rgba(159, 122, 234, 0.8), 0 0 30px rgba(159, 122, 234, 0.8), 0 0 30px rgba(159, 122, 234, 0.8)">
            Base Fee: {data.baseFee} (${convertGweiToUSD(Number(data.baseFee.split(' ')[0]), ethPriceInUSD)})
          </Text>
        </Box>

        {/* Gas Used */}
        <Box display="flex" alignItems="center" justifyContent="center">
          <Icon as={FaGasPump} color={"white"} mr={2} />
          <Text color={textColor} textShadow="0 0 30px rgba(159, 122, 234, 0.8), 0 0 30px rgba(159, 122, 234, 0.8), 0 0 30px rgba(159, 122, 234, 0.8)">
            Gas Used: {data.gasUsed}
          </Text>
        </Box>

        {/* Gas Limit */}
        <Box display="flex" alignItems="center" justifyContent="center">
          <Icon as={FaGasPump} color={"white"} mr={2} />
          <Text color={textColor} textShadow="0 0 30px rgba(159, 122, 234, 0.8), 0 0 30px rgba(159, 122, 234, 0.8), 0 0 30px rgba(159, 122, 234, 0.8)">
            Gas Limit: {data.gasLimit}
          </Text>
        </Box>

        {/* Gas Burnt */}
        <Box display="flex" alignItems="center" justifyContent="center">
          <Icon as={FaFire} color={"white"} mr={2} />
          <Text color={textColor} textShadow="0 0 30px rgba(159, 122, 234, 0.8), 0 0 30px rgba(159, 122, 234, 0.8), 0 0 30px rgba(159, 122, 234, 0.8)">
            Gas Burnt: {data.gasBurnt} (${convertEthToUSD(Number(data.gasBurnt.split(' ')[0]), ethPriceInUSD)})
          </Text>
        </Box>

        {/* Transactions */}
        <Box display="flex" alignItems="center" justifyContent="center">
          <Icon as={FaList} color={"white"} mr={2} />
          <Text color={textColor} textShadow="0 0 30px rgba(159, 122, 234, 0.8), 0 0 30px rgba(159, 122, 234, 0.8), 0 0 30px rgba(159, 122, 234, 0.8)">
            Transactions: {data.transactions}
          </Text>
        </Box>
      </SimpleGrid>
    </Box>
  );
};

export default BlockInfo;