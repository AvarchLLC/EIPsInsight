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
    // Fetch the most recent transactions from the API
    const fetchTransactions = async () => {
      try {
        const response = await axios.get('/api/blockchain/recent/transactions');
        setTransactions(response.data.data.reverse()); // Reverse to show newest first
      } catch (err) {
        setError('Failed to fetch transactions');
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();

    // Setup SSE connection to listen for live transactions
    const eventSource = new EventSource('/api/blockchain/live/transactions');

    eventSource.onmessage = (event) => {
      const newTransaction = JSON.parse(event.data);

      setTransactions((prevTransactions) => {
        if (prevTransactions.some(tx => tx.hash === newTransaction.hash)) {
          return prevTransactions; // Avoid duplicates
        }

        const updatedTransactions = [newTransaction, ...prevTransactions];
        if (updatedTransactions.length > 10) {
          updatedTransactions.pop(); // Maintain limit of 10 transactions
        }
        return updatedTransactions;
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

  const formatHash = (hash: string | undefined) => {
    if (!hash) return 'N/A';
    return `${hash.slice(0, 8)}...`;
  };
  
  const formatAddress = (address: string | undefined) => {
    if (!address) return 'N/A';
    return `${address.slice(0, 8)}...${address.slice(-8)}`;
  };
  
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
            <Th>From</Th>
            <Th>To</Th>
            <Th>Amount (ETH)</Th>
          </Tr>
        </Thead>
        <Tbody>
          {transactions.filter((tx) => tx.hash).map((tx, index) => (
            <Tr key={tx.hash || index}>
              <Td>
                <NextLink href={`/explorer/Transaction/${tx.hash}`} passHref>
                  <Text as="a" color="blue.500" fontWeight="bold">
                    {formatHash(tx.hash)}
                  </Text>
                </NextLink>
              </Td>
              <Td>{formatAddress(tx.from)}</Td>
              <Td>{formatAddress(tx.to)}</Td>
              <Td>{tx.value}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default RecentTransactions;
