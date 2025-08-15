import { Box, Text, Table, Thead, Tbody, Tr, Th, Td, useColorModeValue, Icon } from '@chakra-ui/react';
import { convertEthToUSD, convertGweiToUSD } from './ethereumService';
import { FaCube } from 'react-icons/fa';
import Web3 from 'web3';

const RecentBlocks = ({ blocks, ethPriceInUSD }: { blocks: any[]; ethPriceInUSD: number }) => {
  if (!blocks || blocks?.length === 0) return null;

  // Colors and shadows
  const textColor = useColorModeValue('white', 'white');
  const borderColor = useColorModeValue('whiteAlpha.300', 'whiteAlpha.300'); // Visible border color
  const tableHeaderBg = useColorModeValue('rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)');
  const tableRowBg = useColorModeValue('rgba(255, 255, 255, 0.05)', 'rgba(255, 255, 255, 0.02)');
  const baseFeeBg = 'yellow.500'; // Yellow background for base fee
  const burnedEthBg = 'red.500'; // Red background for burned ETH

  return (
    <Box
      p={5}
      shadow="xl"
      borderWidth="1px"
      borderRadius="lg"
      borderColor={borderColor} // Visible border
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
          <Icon as={FaCube} color={"white"} mr={2} /> Recent Blocks
      </Text>
      <br/>

      <Table variant="simple" colorScheme="whiteAlpha" width="100%">
        <Thead bg={tableHeaderBg}>
          <Tr>
            <Th color={textColor} textAlign="center">Number</Th>
            <Th color={textColor} textAlign="center">Gas Target</Th>
            <Th color={textColor} textAlign="center">Gas Used</Th>
            {/* <Th color={textColor} textAlign="center">Reward</Th> */}
            <Th color={textColor} textAlign="center">Txs</Th>
            <Th color={textColor} textAlign="center">Time</Th>
            <Th color={textColor} textAlign="center">Base Fee</Th>
            <Th color={textColor} textAlign="center">Burned ETH</Th>
          </Tr>
        </Thead>
        <Tbody>
          {blocks?.map((block, index) => {
            const gasTarget = Number(block?.gasLimit);
            const gasUsed = Number(block?.gasUsed);
            const reward = block?.rewards ? block?.rewards : 'N/A'; // Rewards are not directly available in block data
            const txs = block.transactions?.length;
            const age = new Date(Number(block?.timestamp) * 1000).toLocaleTimeString();
            const baseFee = block?.baseFeePerGas ? `${Number(Web3.utils?.fromWei(block.baseFeePerGas, 'gwei')).toFixed(2)} Gwei` : 'N/A';
            const burnedETH = block?.baseFeePerGas ? `${Web3.utils?.fromWei((BigInt(block.gasUsed) * BigInt(block.baseFeePerGas))?.toString(), 'ether')} ETH` : 'N/A';

            return (
              <Tr key={index} bg={tableRowBg} _hover={{ bg: 'rgba(255, 255, 255, 0.1)' }}>
                <Td color={textColor} textAlign="center">{Number(block.number)}</Td>
                <Td color={textColor} textAlign="center">{gasTarget}</Td>
                <Td color={textColor} textAlign="center">{gasUsed}</Td>
                {/* <Td color={textColor} textAlign="center">{reward}</Td> */}
                <Td color={textColor} textAlign="center">{txs}</Td>
                <Td color={textColor} textAlign="center">{age}</Td>
                <Td textAlign="center">
                  <Box
                    bg={baseFeeBg}
                    borderRadius="md"
                    p={2}
                    display="inline-block"
                  >
                    <Text color="white" textShadow="0 0 30px rgba(68, 54, 228, 0.8), 0 0 30px rgba(68, 54, 228, 0.8), 0 0 30px rgba(68, 54, 228, 0.8)">
                      {baseFee} (${convertGweiToUSD(Number(baseFee.split(' ')[0]), ethPriceInUSD)})
                    </Text>
                  </Box>
                </Td>
                <Td textAlign="center">
                  <Box
                    bg={burnedEthBg}
                    borderRadius="md"
                    p={2}
                    display="inline-block"
                  >
                    <Text color="white" textShadow="0 0 30px rgba(233, 19, 168, 0.8), 0 0 30px rgba(233, 19, 168, 0.8), 0 0 30px rgba(233, 19, 168, 0.8)">
                      {burnedETH} (${convertEthToUSD(Number(burnedETH.split(' ')[0]), ethPriceInUSD)})
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

export default RecentBlocks;