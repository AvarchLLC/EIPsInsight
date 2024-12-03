import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Text, Table, Tbody, Td, Th, Thead, Tr, Spinner, useBreakpointValue } from '@chakra-ui/react';

const RecentBlocks: React.FC = () => {
  const [blocks, setBlocks] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const tableSize = useBreakpointValue({ base: 'sm', md: 'md' });

  useEffect(() => {
    const fetchBlocks = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/blockchain/recent/Blocks');
        setBlocks(response.data.data);
      } catch (err) {
        setError('Failed to fetch recent blocks');
      } finally {
        setLoading(false);
      }
    };

    fetchBlocks();
  }, []);

  if (loading) {
    return <Spinner size="xl" />;
  }

  if (error) {
    return <Text color="red.500">{error}</Text>;
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
            <Th>Block Hash</Th>
            <Th>TXNs</Th>
          </Tr>
        </Thead>
        <Tbody>
          {blocks.map((block) => (
            <Tr key={block.hash}>
                <Td>{block.number}</Td>
              <Td isTruncated maxWidth="200px">
                {block.hash.length > 50 ? `${block.hash.slice(0, 50)}...` : block.hash}
              </Td>
              <Td>{block.transactions.length}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default RecentBlocks;
