import { Box, Flex } from '@chakra-ui/react';
import { SlotDetails } from '@/components/SlotDetails';
import { TransactionCharts } from '@/components/TransactionCharts';
import { TransactionTabs } from '@/components/TransactionTabs';
import { useEffect, useState } from 'react';
import { getBlockWithTransactions, getGasBurnt, getBlockDetails } from '@/components/Ethereum';
import Web3 from 'web3';

const web3 = new Web3('https://ethereum-rpc.publicnode.com');

interface TransactionTypeCount {
  type0: number;
  type1: number;
  type2: number;
  type3: number;
  type4: number;
}

export default function Home() {
  const [block, setBlock] = useState<Awaited<ReturnType<typeof getBlockWithTransactions>> | null>(null);
  const [gasBurnt, setGasBurnt] = useState<string>('0');
  const [transactionTypeCount, setTransactionTypeCount] = useState<TransactionTypeCount>({
    type0: 0,
    type1: 0,
    type2: 0,
    type3: 0,
    type4: 0,
  });
  const [blockDetails, setBlockDetails] = useState<any>(null);

  const [transactionsByType, setTransactionsByType] = useState<Record<string, any[]>>({
    all: [],
    0: [],
    1: [],
    2: [],
    3: [],
    4: [],
  });



  useEffect(() => {
    const fetchBlock = async () => {
      const latestBlock = await getBlockWithTransactions('latest');
      if (!latestBlock) {
        console.error('Failed to fetch block');
        return;
      }

      setBlock(latestBlock);

      const fetchBlockDetails = async () => {
        const details = await getBlockDetails(Number(latestBlock.number)); // Replace with your block number
        console.log("details:",details.blockNumber);
        setBlockDetails(details);
      };

      fetchBlockDetails();

      // Calculate gas burnt
      const gasBurnt = getGasBurnt(latestBlock);
      setGasBurnt(web3.utils.fromWei(gasBurnt.toString(), 'ether'));

      // Categorize transactions by type
      const counts: TransactionTypeCount = {
        type0: 0,
        type1: 0,
        type2: 0,
        type3: 0,
        type4: 0,
      };

      const transactions: Record<string, any[]> = { 
        all: [], 
        0: [], 
        1: [], 
        2: [], 
        3: [], 
        4: [] 
      };


      console.log(latestBlock);

    if (latestBlock.transactions) {
        for (const transaction of latestBlock.transactions) {
          let txData;
          if (typeof transaction === 'string') {
            txData = await web3.eth.getTransaction(transaction);
          } else {
            txData = transaction;
          }
  
          if (txData) {
            transactions.all.push(txData);
  
            switch (String(txData.type)) {
              case "0":
                transactions[0].push(txData);
                counts.type0++;
                break;
              case "1":
                transactions[1].push(txData);
                counts.type1++;
                break;
              case "2":
                transactions[2].push(txData);
                counts.type2++;
                break;
              case "3":
                transactions[3].push(txData);
                counts.type3++;
                break;
              case "4":
                transactions[4].push(txData);
                counts.type4++;
                break;
            }
          }
        }
      }
  
      console.log(counts);
      setTransactionTypeCount(counts);
      setTransactionsByType(transactions);
    };
  
    fetchBlock();
    const interval = setInterval(fetchBlock, 15000);
  
    return () => clearInterval(interval);
  }, []);

  if (!block || !blockDetails) {
    return <Box>Loading...</Box>;
  }

  return (
    <Flex>
      <Box width="20%" p={5}>
      <SlotDetails
      epochNumber={blockDetails.epochNumber}
      slotInEpoch={blockDetails.slotInEpoch}
      validator={blockDetails.validator}
      blockNumber={Number(blockDetails.blockNumber)}
      transactions={blockDetails.transactions}
      size={blockDetails.size}
      gasUsed={blockDetails.gasUsed}
      gasLimit={blockDetails.gasLimit}
      baseFee={blockDetails.baseFee}
      gasBurnt={blockDetails.gasBurnt}
    />
      </Box>
      <Box width="80%" p={5}>
        <TransactionCharts transactions={transactionsByType} />
        <TransactionTabs transactions={transactionsByType} />
      </Box>
    </Flex>
  );
}