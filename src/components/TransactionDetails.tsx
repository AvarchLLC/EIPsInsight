import { Box, Text, Table, Thead, Tbody, Tr, Th, Td, Code, IconButton, Link, useColorModeValue, Image } from '@chakra-ui/react';
import { CopyIcon } from '@chakra-ui/icons';

interface TransactionDetailsProps {
  hash: string;
  from: string;
  to: string;
  value: string;
  blockNumber: string;
  gasLimit: string;
  gasPrice: string;
  nonce: string;
  signature: {
    r: string;
    s: string;
    v: string;
  };
}

const TransactionDetails = ({
  hash,
  from,
  to,
  value,
  blockNumber,
  gasLimit,
  gasPrice,
  nonce,
  signature
}: TransactionDetailsProps) => {
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
        🧐 Transaction Details
      </Text>

      <Table variant="simple" colorScheme="blue" size="lg">
        <Thead>
          <Tr>
            <Th fontSize="xl">Attribute</Th>
            <Th fontSize="xl">Details</Th>
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Td fontSize="lg">🔗 Transaction Hash</Td>
            <Td>
              <Link href={`https://etherscan.io/tx/${hash}`} isExternal>
                <Code colorScheme="blue" fontSize="lg">{hash}</Code>
              </Link>
              <IconButton
                aria-label="Copy"
                icon={<CopyIcon />}
                onClick={() => copyToClipboard(hash)}
                size="sm"
                ml={2}
              />
            </Td>
          </Tr>

          <Tr>
            <Td fontSize="lg">⛓️ Block Number</Td>
            <Td fontSize="lg">{blockNumber}</Td>
          </Tr>

          <Tr>
            <Td fontSize="lg">👤 From</Td>
            <Td fontSize="lg">
              <Link href={`https://etherscan.io/address/${from}`} isExternal>
                <Code colorScheme="blue" fontSize="lg">{from}</Code>
              </Link>
              <IconButton
                aria-label="Copy"
                icon={<CopyIcon />}
                onClick={() => copyToClipboard(from)}
                size="sm"
                ml={2}
              />
            </Td>
          </Tr>

          <Tr>
            <Td fontSize="lg">🏠 To</Td>
            <Td fontSize="lg">
              <Link href={`https://etherscan.io/address/${to}`} isExternal>
                <Code colorScheme="blue" fontSize="lg">{to}</Code>
              </Link>
              <IconButton
                aria-label="Copy"
                icon={<CopyIcon />}
                onClick={() => copyToClipboard(to)}
                size="sm"
                ml={2}
              />
            </Td>
          </Tr>

          <Tr>
            <Td fontSize="lg">💰 Value</Td>
            <Td fontSize="lg">
              {value}{' '}
              <Image
                src="/ethereum-logo.svg"
                alt="Ethereum Logo"
                boxSize="16px"
                display="inline-block"
                verticalAlign="middle"
              />
            </Td>
          </Tr>

          <Tr>
            <Td fontSize="lg">⛽ Gas Limit</Td>
            <Td fontSize="lg">{gasLimit}</Td>
          </Tr>

          <Tr>
            <Td fontSize="lg">💸 Gas Price</Td>
            <Td fontSize="lg">{gasPrice} Wei</Td>
          </Tr>

          <Tr>
            <Td fontSize="lg">🔢 Nonce</Td>
            <Td fontSize="lg">{nonce}</Td>
          </Tr>

          {/* Signature Section as a Heading */}
          <Tr>
            <Td colSpan={2}>
              <Text fontSize="2xl" fontWeight="semibold" color={useColorModeValue('gray.800', 'gray.100')}>
                🖊️ Signature
              </Text>
            </Td>
          </Tr>
          <Tr>
            <Td fontSize="lg">R</Td>
            <Td fontSize="lg">
              <Code colorScheme="green" fontSize="lg">{signature.r}</Code>
              <IconButton
                aria-label="Copy"
                icon={<CopyIcon />}
                onClick={() => copyToClipboard(signature.r)}
                size="sm"
                ml={2}
              />
            </Td>
          </Tr>

          <Tr>
            <Td fontSize="lg">S</Td>
            <Td fontSize="lg">
              <Code colorScheme="green" fontSize="lg">{signature.s}</Code>
              <IconButton
                aria-label="Copy"
                icon={<CopyIcon />}
                onClick={() => copyToClipboard(signature.s)}
                size="sm"
                ml={2}
              />
            </Td>
          </Tr>

          <Tr>
            <Td fontSize="lg">V</Td>
            <Td fontSize="lg">
              <Code colorScheme="green" fontSize="lg">{signature.v}</Code>
            </Td>
          </Tr>
        </Tbody>
      </Table>
    </Box>
  );
};

export default TransactionDetails;
