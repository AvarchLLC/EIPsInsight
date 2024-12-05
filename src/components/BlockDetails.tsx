import { Box, Text, HStack, Code, Link, Button, useColorModeValue, IconButton, Image } from '@chakra-ui/react';
import { CopyIcon } from '@chakra-ui/icons';

interface BlockDetailsProps {
  blockNumber: number;
  hash: string;
  miner: string;
  parentHash: string;
  gasLimit: string;
  gasUsed: string;
  difficulty: string;
  timestamp: number;
  transactions: string[];
}

const BlockDetails = ({
  blockNumber,
  hash,
  miner,
  parentHash,
  gasLimit,
  gasUsed,
  difficulty,
  timestamp,
  transactions
}: BlockDetailsProps) => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <Box
      p={8}
      borderWidth={1}
      borderRadius="lg"
      bg={useColorModeValue('gray.50', 'gray.700')}
      boxShadow="lg"
      width="100%"
      maxWidth="1200px"
      mx="auto"
      mt={8}
      borderColor={useColorModeValue('gray.200', 'gray.600')}
      mb={12}
    >
      <Text fontSize="3xl" fontWeight="bold" mb={6} textAlign="center" color={useColorModeValue('gray.800', 'gray.100')}>
        🧱 Block Details
      </Text>

      <HStack mt={4}>
        <Text fontWeight="bold" fontSize="xl" width="200px">🔗 Block Hash:</Text>
        <Link href={`https://etherscan.io/block/${hash}`} isExternal>
          <Code colorScheme="blue" fontSize="lg">{hash}</Code>
        </Link>
        <IconButton
          aria-label="Copy"
          icon={<CopyIcon />}
          onClick={() => copyToClipboard(hash)}
          size="sm"
          ml={2}
        />
      </HStack>

      <HStack mt={4}>
        <Text fontWeight="bold" fontSize="xl" width="200px">⛓️ Block Number:</Text>
        <Code fontSize="lg">{blockNumber}</Code>
      </HStack>

      <HStack mt={4}>
        <Text fontWeight="bold" fontSize="xl" width="200px">👷 Miner:</Text>
        <Link href={`https://etherscan.io/address/${miner}`} isExternal>
          <Code colorScheme="blue" fontSize="lg">{miner}</Code>
        </Link>
        <IconButton
          aria-label="Copy"
          icon={<CopyIcon />}
          onClick={() => copyToClipboard(miner)}
          size="sm"
          ml={2}
        />
      </HStack>

      <HStack mt={4}>
        <Text fontWeight="bold" fontSize="xl" width="200px">🔗 Parent Hash:</Text>
        <Code>{parentHash}</Code>
      </HStack>

      <HStack mt={4}>
        <Text fontWeight="bold" fontSize="xl" width="200px">⛽ Gas Limit:</Text>
        <Code>{gasLimit}</Code>
      </HStack>

      <HStack mt={4}>
        <Text fontWeight="bold" fontSize="xl" width="200px">💸 Gas Used:</Text>
        <Code>{gasUsed}</Code>
      </HStack>

      <HStack mt={4}>
        <Text fontWeight="bold" fontSize="xl" width="200px">💎 Difficulty:</Text>
        <Code>{difficulty}</Code>
      </HStack>

      <HStack mt={4}>
        <Text fontWeight="bold" fontSize="xl" width="200px">🕒 Timestamp:</Text>
        <Code>{new Date(timestamp * 1000).toLocaleString()}</Code>
      </HStack>

      <Box mt={6}>
        <Text fontWeight="bold" fontSize="xl">📝 Transactions:</Text>
        <Box
      mt={2}
      maxHeight="500px"
      overflowY="auto"
      border="1px solid"
      borderColor="gray.200"
      borderRadius="md"
      p={4}
    >
      {transactions.map((txHash, index) => (
        <HStack key={txHash} mt={2}>
          <Link href={`/explorer/Transaction/${txHash}`}>
            <Button variant="link" colorScheme="teal" size="sm">
              🏷️ Transaction {index + 1}: {txHash}
            </Button>
          </Link>
          <IconButton
            aria-label="Copy"
            icon={<CopyIcon />}
            onClick={() => copyToClipboard(txHash)}
            size="sm"
            ml={2}
          />
        </HStack>
      ))}
    </Box>
      </Box>
    </Box>
  );
};

export default BlockDetails;
