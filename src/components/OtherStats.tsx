import {
  Box,
  Flex,
  Icon,
  Text,
  useColorModeValue,
  Button,
  SimpleGrid,
  Badge,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import {
  ArrowUpRight,
  ArrowDownRight,
  GitBranch,
  Star,
  Eye,
  AlertCircle,
} from 'lucide-react';
import axios from 'axios';

interface EIP {
  forksCount: number;
  forksPrev: number;
  watchlistCount: number;
  watchlistPrev: number;
  stars: number;
  starsPrev: number;
  openIssuesCount: number;
  openIssuesPrev: number;
}

interface Props {
  type: 'EIPs' | 'ERCs' | 'RIPs';
}

// const getChange = (current: number = 0, previous: number = 0) => {
//   if (previous === 0) {
//     return { text: '+0.0%', direction: 'increase' };
//   }
//   const change = ((current - previous) / previous) * 100;
//   return {
//     text: `${change >= 0 ? '+' : ''}${change.toFixed(1)}%`,
//     direction: change >= 0 ? 'increase' : 'decrease',
//   };
// };

const ChakraGithubStats: React.FC<Props> = ({ type }) => {
  const [EIPdata, setEIPData] = useState<EIP | null>(null);
  const [ERCdata, setERCData] = useState<EIP | null>(null);
  const [RIPdata, setRIPData] = useState<EIP | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const eip = await (await fetch('/api/EIPinfo')).json();
        const erc = await (await fetch('/api/ERCinfo')).json();
        const rip = await (await fetch('/api/RIPInfo')).json();

        setEIPData(eip);
        setERCData(erc);
        setRIPData(rip);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const data = type === 'EIPs' ? EIPdata : type === 'ERCs' ? ERCdata : RIPdata;

  // const downloadData = async () => {
  //   if (!data) return;
  //   const csvContent = [
  //     ['Type', 'Forks Count', 'Watchlist Count', 'Stars', 'Open Issues Count'],
  //     [type, data.forksCount, data.watchlistCount, data.stars, data.openIssuesCount],
  //   ]
  //     .map((row) => row.join(','))
  //     .join('\n');

  //   const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  //   const url = URL.createObjectURL(blob);
  //   const link = document.createElement('a');
  //   link.href = url;
  //   link.setAttribute('download', `${type}_stats_report.csv`);
  //   document.body.appendChild(link);
  //   link.click();
  //   document.body.removeChild(link);

  //   try {
  //     await axios.post('/api/DownloadCounter');
  //   } catch (err) {
  //     console.error('Failed to update download counter:', err);
  //   }
  // };

  if (!data) return null;

  const statCards = [
    {
      title: 'Forks',
      icon: GitBranch,
      value: data.forksCount,
      // change: getChange(data.forksCount, data.forksPrev),
    },
    {
      title: 'Watchlist',
      icon: Eye,
      value: data.watchlistCount,
      // change: getChange(data.watchlistCount, data.watchlistPrev),
    },
    {
      title: 'Stars',
      icon: Star,
      value: data.stars,
      // change: getChange(data.stars, data.starsPrev),
    },
    {
      title: 'Open Issues & PR',
      icon: AlertCircle,
      value: data.openIssuesCount,
      // change: getChange(data.openIssuesCount, data.openIssuesPrev),
    },
  ];

  return (
    <Box w="full" px={0} mb={6}>
      <Text fontSize="2xl" fontWeight="bold" color="#40E0D0" mb={4}>
        GitHub Stats – {type}
      </Text>


      <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={6}>
        {statCards.map(({ title, icon, value }) => (
          <Box
            key={title}
            bg={useColorModeValue('gray.100', 'gray.800')}
            p={{ base: 3, md: 4 }}
            borderRadius="lg"
            shadow="md"
            _hover={{ shadow: 'lg' }}
            minW={{ base: 'auto', md: '250px' }}
          >
            <Flex align="center" justify="space-between" flexWrap="wrap" gap={2}>
              <Box flex="1" minW="0">
                <Text
                  fontSize={{ base: "24px", md: "28px" }}
                  color="gray.500"
                  noOfLines={1}
                >
                  {title}
                </Text>
                <Text fontSize={{ base: "20px", md: "24px" }} fontWeight="bold" noOfLines={1}>
                  {value}
                </Text>
              </Box>
              <Icon as={icon} boxSize={{ base: 5, md: 6 }} color="gray.600" />
            </Flex>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );

};

export default ChakraGithubStats;
