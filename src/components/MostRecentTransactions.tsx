import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Text, Table, Tbody, Td, Th, Thead, Tr, Spinner, useBreakpointValue } from '@chakra-ui/react';
import NextLink from 'next/link';

const RecentTransactions: React.FC = () => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const tableSize = useBreakpointValue({ base: 'sm', md: 'md' });

  useEffect(() => {
    // Fetch most recent transactions from the API
    const fetchTransactions = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/blockchain/recent/Transactions');
        setTransactions(response.data.data);
      } catch (err) {
        setError('Failed to fetch transactions');
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
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
        💸 Most Recent Transactions
      </Text>
      <Table variant="striped" colorScheme="blue" size={tableSize}>
        <Thead>
          <Tr>
            <Th>Transaction Hash</Th>
          </Tr>
        </Thead>
        <Tbody>
          {transactions.map((txHash, index) => (
            <Tr key={index}>
              <Td isTruncated maxWidth="300px">
                <NextLink href={`/explorer/Transaction/${txHash}`} passHref>
                  <Text as="a" color="blue.500" fontWeight="bold">
                    {txHash.length > 50 ? `${txHash.slice(0, 50)}...` : txHash}
                  </Text>
                </NextLink>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default RecentTransactions;
