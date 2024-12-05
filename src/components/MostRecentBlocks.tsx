import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Text, Table, Tbody, Td, Th, Thead, Tr, Spinner, useBreakpointValue } from '@chakra-ui/react';
import NextLink from 'next/link';

const RecentBlocks: React.FC = () => {
  const [blocks, setBlocks] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const tableSize = useBreakpointValue({ base: 'sm', md: 'md' });

  // Format miner's address as "xxxx....xxxx"
  const formatMinerAddress = (miner: string) => {
    if (miner.length === 42) {
      return `${miner.slice(0, 8)}....${miner.slice(-8)}`;
    }
    return miner;
  };

  useEffect(() => {
    const fetchBlocks = async () => {
      try {
        const response = await axios.get('/api/blockchain/recent/blocks');
        setBlocks(response.data.data.reverse());
      } catch (err) {
        setError('Failed to fetch recent blocks');
      } finally {
        setLoading(false);
      }
    };

    fetchBlocks();

    // Setup SSE connection to listen for live blocks
    const eventSource = new EventSource('/api/blockchain/live/blocks');

    eventSource.onmessage = (event) => {
      const newBlock = JSON.parse(event.data);

      // Check if the block number already exists in the blocks list
      setBlocks((prevBlocks) => {
        if (prevBlocks.some(block => block.blockNumber === newBlock.blockNumber)) {
          return prevBlocks; // Don't add if the block number already exists
        }

        // Add the new block and remove the oldest if there are already 10 blocks
        const updatedBlocks = [...prevBlocks, newBlock];
        if (updatedBlocks.length > 10) {
          updatedBlocks.shift(); // Remove the oldest block
        }
        return updatedBlocks;
      });
    };

    eventSource.onerror = () => {
      setError('Error receiving live updates');
      eventSource.close();
    };

    return () => {
      eventSource.close(); // Clean up the SSE connection when the component unmounts
    };
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" mt={8} mb={8}>
        <Spinner size="xl" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" mt={8} mb={8}>
        <Text color="red.500">{error}</Text>
      </Box>
    );
    
  }

  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      p={6}
      bg="white"
      boxShadow="lg"
      _dark={{ bg: 'gray.800', borderColor: 'gray.700' }}
      mb={6}
    >
      <Text fontSize="2xl" fontWeight="bold" mb={4} color="blue.500">
        🟦 Most Recent Blocks
      </Text>
      <Table variant="striped" colorScheme="blue" size={tableSize}>
        <Thead>
          <Tr>
            <Th>Block</Th>
            <Th>Miner</Th>
            <Th>Block Reward</Th>
          </Tr>
        </Thead>
        <Tbody>
        {blocks.map((block) => (
          <Tr key={block.blockNumber}>
            <Td>
              <NextLink href={`/explorer/Block/${block.blockNumber}`} passHref>
              <Text as="a" color="blue.500" fontWeight="bold">{block.blockNumber}</Text>
              </NextLink>
            </Td>
            <Td>{formatMinerAddress(block.miner)}</Td>
            <Td>{block.blockReward}</Td>
          </Tr>
        ))}
      </Tbody>
      </Table>
    </Box>
  );
};

export default RecentBlocks;
