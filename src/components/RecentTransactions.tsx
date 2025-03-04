import { Box, Text, Table, Thead, Tbody, Tr, Th, Td, useColorModeValue, Icon } from '@chakra-ui/react';
import { convertEthToUSD, convertGweiToUSD } from "./ethereumService";
import { FaList } from 'react-icons/fa';

const RecentTransactions = ({ transactions, ethPriceInUSD }: { transactions: any[]; ethPriceInUSD: number }) => {
  if (!transactions || transactions.length === 0) return null;

  // Colors and shadows
  const textColor = useColorModeValue('white', 'white');
  const borderColor = useColorModeValue('whiteAlpha.300', 'whiteAlpha.300'); // Visible border color
  const tableHeaderBg = useColorModeValue('rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)');
  const tableRowBg = useColorModeValue('rgba(255, 255, 255, 0.05)', 'rgba(255, 255, 255, 0.02)');
  const valueBg = 'green.500'; // Green background for value
  const gasBg = 'yellow.500'; // Yellow background for gas

  return (
    <Box
      p={5}
      shadow="xl"
      borderWidth="1px"
      borderRadius="lg"
      borderColor={borderColor} // Visible border
    //   bg="blackAlpha.800" 
      backdropFilter="blur(10px)"
      width="100%" // Take full width
      m={20} // Margin of 5
    >
       
      <Text
        fontSize={25}
        fontWeight="bold"
        mb={6}
        color={textColor}
        textShadow="0 0 30px rgba(159, 122, 234, 0.8), 0 0 30px rgba(159, 122, 234, 0.8), 0 0 30px rgba(159, 122, 234, 0.8)"
      >
        <Icon as={FaList} color={"white"} mr={2} /> Recent Transactions
      </Text>
      <br/>

      <Table variant="simple" colorScheme="whiteAlpha" width="100%">
        <Thead bg={tableHeaderBg}>
          <Tr>
            <Th color={textColor} textAlign="center">Hash</Th>
            <Th color={textColor} textAlign="center">Value</Th>
            <Th color={textColor} textAlign="center">Gas</Th>
          </Tr>
        </Thead>
        <Tbody>
          {transactions.map((tx, index) => (
            <Tr key={index} bg={tableRowBg} _hover={{ bg: 'rgba(255, 255, 255, 0.1)' }}>
              <Td color={textColor} textAlign="center" textShadow="0 0 30px rgba(159, 122, 234, 0.8), 0 0 30px rgba(159, 122, 234, 0.8), 0 0 30px rgba(159, 122, 234, 0.8)">
                {tx.hash.slice(0, 10)}...
              </Td>
              <Td textAlign="center">
                <Box
                  bg={valueBg}
                  borderRadius="md"
                  p={2}
                  display="inline-block"
                >
                  <Text color="white" textShadow="0 0 30px rgba(122, 234, 208, 0.8), 0 0 30px rgba(122, 234, 208, 0.8), 0 0 30px rgba(122, 234, 208, 0.8)">
                    {tx.value} ETH (${convertEthToUSD(Number(tx.value), ethPriceInUSD)})
                  </Text>
                </Box>
              </Td>
              <Td textAlign="center">
                <Box
                  bg={gasBg}
                  borderRadius="md"
                  p={2}
                  display="inline-block"
                >
                  <Text  color="white" textShadow="0 0 30px rgba(255, 179, 72, 0.8), 0 0 30px rgba(255, 179, 72, 0.8), 0 0 30px rgba(255, 179, 72, 0.8)">
                    {tx.gas} Gwei (${convertGweiToUSD(Number(tx.gas), ethPriceInUSD)})
                  </Text>
                </Box>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default RecentTransactions;