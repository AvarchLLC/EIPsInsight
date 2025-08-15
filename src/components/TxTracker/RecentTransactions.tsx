import { Box, Text, Table, Thead, Tbody, Tr, Th, Td, useColorModeValue, Icon, Tooltip, useToast } from '@chakra-ui/react';
import { convertEthToUSD, convertGweiToUSD } from "./ethereumService";
import { FaList, FaCopy } from 'react-icons/fa';

const RecentTransactions = ({ transactions, ethPriceInUSD, timestamp }: { transactions: any[]; ethPriceInUSD: number; timestamp: number }) => {
  if (!transactions || transactions?.length === 0) return null;

  const toast = useToast(); // For showing toast notifications

  const hexToDecimal = (hex: any) => {
    return parseInt(hex, 16);
  };

  const weiToEth = (weiValue: any) => {
    return weiValue / 1e18; // 1 ETH = 10^18 wei
  };

  // const copyToClipboard = (text: string) => {
  //   navigator.clipboard.writeText(text);
  //   toast({
  //     title: 'Copied to clipboard',
  //     status: 'success',
  //     duration: 2000,
  //     isClosable: true,
  //   });
  // };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)?.then(() => {
      toast({
        title: "copied!",
        description: "The hash has been copied to your clipboard.",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    }).catch(() => {
      toast({
        title: "Failed to copy!",
        description: "There was an issue copying the hash.",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    });
  };

  // Calculate age based on timestamp
  const calculateAge = (timestamp: number) => {
    const now = Math.floor(Date.now() / 1000); // Current time in seconds
    const diff = now - timestamp; // Difference in seconds

    if (diff < 60) {
      return `${diff} seconds ago`;
    } else if (diff < 3600) {
      return `${Math.floor(diff / 60)} minutes ago`;
    } else if (diff < 86400) {
      return `${Math.floor(diff / 3600)} hours ago`;
    } else {
      return `${Math.floor(diff / 86400)} days ago`;
    }
  };

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
      backdropFilter="blur(10px)"
      width="100%" // Take full width
      m={5} // Adjusted margin
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
      <br />

      <Table variant="simple" colorScheme="whiteAlpha" width="100%">
        <Thead bg={tableHeaderBg}>
          <Tr>
            <Th color={textColor} textAlign="center">Hash</Th>
            <Th color={textColor} textAlign="center">From</Th>
            <Th color={textColor} textAlign="center">To</Th>
            <Th color={textColor} textAlign="center">Age</Th>
            <Th color={textColor} textAlign="center">Value</Th>
            <Th color={textColor} textAlign="center">Gas</Th>
          </Tr>
        </Thead>
        <Tbody>
          {transactions?.map((tx, index) => {
            const valueInWei = hexToDecimal(tx.value); // Convert hex to decimal wei
            const valueInEth = weiToEth(valueInWei); // Convert wei to ETH
            const age = calculateAge(timestamp); // Calculate age using the provided timestamp

            return (
              <Tr key={index} bg={tableRowBg} _hover={{ bg: 'rgba(255, 255, 255, 0.1)' }}>
                <Td color={textColor} textAlign="center" textShadow="0 0 30px rgba(159, 122, 234, 0.8), 0 0 30px rgba(159, 122, 234, 0.8), 0 0 30px rgba(159, 122, 234, 0.8)">
                  <Tooltip label="Copy to clipboard" aria-label="Copy to clipboard">
                    <Box display="flex" alignItems="center" justifyContent="center">
                      <Text>{tx.hash.slice(0, 10)}...</Text>
                      <Icon as={FaCopy} ml={2} cursor="pointer" onClick={()=>copyToClipboard(tx.hash)} />
                    </Box>
                  </Tooltip>
                </Td>
                <Td color={textColor} textAlign="center">
                  <Tooltip label="Copy to clipboard" aria-label="Copy to clipboard">
                    <Box display="flex" alignItems="center" justifyContent="center">
                      <Text>{tx.from.slice(0, 10)}...</Text>
                      <Icon as={FaCopy} ml={2} cursor="pointer" onClick={() => copyToClipboard(tx.from)} />
                    </Box>
                  </Tooltip>
                </Td>
                <Td color={textColor} textAlign="center">
                  <Tooltip label="Copy to clipboard" aria-label="Copy to clipboard">
                    <Box display="flex" alignItems="center" justifyContent="center">
                      <Text>{tx.to.slice(0, 10)}...</Text>
                      <Icon as={FaCopy} ml={2} cursor="pointer" onClick={() => copyToClipboard(tx.to)} />
                    </Box>
                  </Tooltip>
                </Td>
                <Td color={textColor} textAlign="center">{age}</Td>
                <Td textAlign="center">
                  <Box
                    bg={valueBg}
                    borderRadius="md"
                    p={2}
                    display="inline-block"
                  >
                    <Text color="white" textShadow="0 0 30px rgba(122, 234, 208, 0.8), 0 0 30px rgba(122, 234, 208, 0.8), 0 0 30px rgba(122, 234, 208, 0.8)">
                      {valueInEth.toFixed(6)} ETH (${convertEthToUSD(valueInEth, ethPriceInUSD)})
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
                    <Text color="white" textShadow="0 0 30px rgba(255, 179, 72, 0.8), 0 0 30px rgba(255, 179, 72, 0.8), 0 0 30px rgba(255, 179, 72, 0.8)">
                      {hexToDecimal(tx.gas)} Gwei (${convertGweiToUSD(hexToDecimal(tx.gas), ethPriceInUSD)})
                    </Text>
                  </Box>
                </Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </Box>
  );
};

export default RecentTransactions;