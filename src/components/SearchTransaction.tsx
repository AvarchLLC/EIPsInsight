import { useState } from 'react';
import { useRouter } from 'next/router';
import { Flex, Input, Button, useColorModeValue } from '@chakra-ui/react';

const TransactionSearch = () => {
  const [selectedTransaction, setSelectedTransaction] = useState<string>('');
  const router = useRouter();

  const handleSearch = () => {
    if (selectedTransaction.trim()) {
      // Redirect to the transaction details page with the entered hash
      router.push(`/explorer/Transaction/${selectedTransaction}`);
    }
  };

  return (
    <Flex justifyContent="center" mt={3} alignItems="center" gap={4}>
      <Input
        placeholder="Search Transaction by Hash"
        value={selectedTransaction}
        onChange={(e) => setSelectedTransaction(e.target.value)}
        size="lg"
        width="50%"
        borderRadius="full"
        boxShadow="md"
        bg={useColorModeValue('white', 'gray.800')}
        borderColor={useColorModeValue('gray.300', 'gray.600')}
        _focus={{
          borderColor: useColorModeValue('blue.400', 'blue.600'),
          boxShadow: '0 0 0 2px rgba(66, 153, 225, 0.6)',
        }}
      />
      <Button
        colorScheme="blue"
        size="lg"
        borderRadius="full"
        onClick={handleSearch}
      >
        Search
      </Button>
    </Flex>
  );
};

export default TransactionSearch;
