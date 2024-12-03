import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import TransactionDetails from '@/components/TransactionDetails';
import AllLayout from '@/components/Layout';
import { Box, Text, HStack, Code, IconButton, Link, useColorModeValue, Image } from '@chakra-ui/react';
import LoaderComponent from '@/components/Loader';

const TransactionPage = () => {
  const { query } = useRouter();
  const [transaction, setTransaction] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransaction = async () => {
      if (query.id) {
        try {
          setLoading(true);
          const response = await axios.get(`/api/blockchain/search/transaction/${query.id}`);
          setTransaction(response.data.data);
        } catch (err) {
          setError('Failed to fetch transaction details');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchTransaction();
  }, [query.id]);

  if (loading) {
    return <LoaderComponent/>;
  }

  if (error) {
    return <Text color="red.500">{error}</Text>;
  }

  return (
    <AllLayout>
      {transaction && (
        <TransactionDetails
          hash={transaction.hash}
          from={transaction.from}
          to={transaction.to}
          value={transaction.value}
          blockNumber={transaction.blockNumber}
          gasLimit={transaction.gasLimit}
          gasPrice={transaction.gasPrice}
          nonce={transaction.nonce}
          signature={transaction.signature}
        />
      )}
    </AllLayout>
  );
};

export default TransactionPage;
