import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import AllLayout from '@/components/Layout';
import { Box, Text, HStack, Code, useColorModeValue, Button } from '@chakra-ui/react';
import LoaderComponent from '@/components/Loader';
import BlockDetails from '@/components/BlockDetails'; // Import the BlockDetails component

const BlockPage = () => {
  const { query } = useRouter();
  const [block, setBlock] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlock = async () => {
      if (query.id) {
        try {
          setLoading(true);
          const response = await axios.get(`/api/blockchain/search/block/${query.id}`);
          setBlock(response.data.data);
        } catch (err) {
          setError('Failed to fetch block details');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchBlock();
  }, [query.id]);

  if (loading) {
    return <LoaderComponent />;
  }

  if (error) {
    return <Text color="red.500">{error}</Text>;
  }

  return (
    <AllLayout>
      {block && (
        <Box>
          {/* <Text fontSize="2xl" fontWeight="bold">Block Details</Text> */}

          <BlockDetails
            blockNumber={block.number}
            hash={block.hash}
            miner={block.miner}
            parentHash={block.parentHash}
            gasLimit={block.gasLimit}
            gasUsed={block.gasUsed}
            difficulty={block.difficulty}
            timestamp={block.timestamp}
            transactions={block.transactions}
          />
        </Box>
      )}
    </AllLayout>
  );
};

export default BlockPage;
