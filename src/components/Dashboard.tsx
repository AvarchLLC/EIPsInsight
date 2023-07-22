import { motion } from 'framer-motion';
import { Box, Button, Heading, Icon, Text, useColorModeValue, useMediaQuery, useTheme, Link as LI } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import { DownloadIcon } from '@chakra-ui/icons';
import BarChart from '@/components/BarChart';
import { Anchor, BookOpen, Radio, Link, Clipboard, Briefcase } from 'react-feather';

import AreaC from '@/components/AreaC';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import { mockEIP } from '@/data/eipdata';
import { usePathname } from 'next/navigation';
import FlexBetween from './FlexBetween';
import StatBox from './StatBox';
import LoaderComponent from './Loader';
import Table from './TableS';

interface EIP {
  _id: string;
  eip: string;
  title: string;
  author: string;
  status: string;
  type: string;
  category: string;
  created: string;
  discussion: string;
  deadline: string;
  requires: string;
  unique_ID: number;
  __v: number;
}

const Dashboard = () => {
  const [data, setData] = useState<EIP[]>([]); // Set initial state as an empty array
  const [isLoading, setIsLoading] = useState(true); // Loader state
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/alleips`);
        console.log(response);
        const jsonData = await response.json();
        setData(jsonData);
        setIsLoading(false); // Set loader state to false after data is fetched
      } catch (error) {
        console.error('Error fetching data:', error);
        setIsLoading(false); // Set loader state to false even if an error occurs
      }
    };

    fetchData();
  }, []);
  const theme = useTheme();
  const isNonMediumScreens = useMediaQuery('(min-width: 1200px)');
  const bg = useColorModeValue('#f6f6f7', '#171923');
  const text = useColorModeValue('white', 'black');
  const router = useRouter();
  return (
    <Box
        paddingBottom={{md:'10', base: '10'}}
        marginX={{md:"40", base: '2'}}
        paddingX={{md:"10", base:'5'}}
        marginTop={{md:"10", base:'5'}}
    >
      {isLoading ? ( // Check if the data is still loading
        // Show loader if data is loading
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100vh"
        >
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Your loader component */}
            <LoaderComponent />
          </motion.div>
        </Box>
      ) : (
        // Show dashboard content if data is loaded
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <FlexBetween>
              <Header title="DASHBOARD" subtitle="Welcome to the dashboard" />

              <Box

              >
                <Button
                  colorScheme="green"
                 variant="outline"
                  fontSize={{md:'14px', base:'10px'}}
                  fontWeight={'bold'}
                  padding={{md:'10px 20px', base:'5px 10px'}}
                >
                  <DownloadIcon marginEnd={'1.5'} />
                  Download Reports
                </Button>
              </Box>
            </FlexBetween>
          </motion.div>


          <Box
              display='grid'
              gridTemplateColumns={{md:'repeat(2, 1fr)'}}
              gap={'6'}
              marginTop={'20px'}
          >
            <div className="grid grid-cols-3 grid-rows-2 gap-6">
              <StatBox
                  title="Core EIPs"
                  value={data.filter((item) => item.category === 'Core').length}
                  description={'Core EIPs describe changes to the Ethereum protocol.'}
                  icon={<Icon as={Anchor} fontSize={{md:'15', base: '10'}}/>}
                  url="core"
              />

              <StatBox
                  title="ERCs"
                  value={data.filter((item) => item.category === 'ERC').length}
                  description={
                    'ERCs describe application-level standards for the Ethereum ecosystem.'
                  }
                  icon={<Icon as={BookOpen} fontSize={{md:'15', base: '10'}}/>}
                  url="erc"
              />

              <StatBox
                  title="Networking EIPs"
                  value={data.filter((item) => item.category === 'Networking').length}
                  description={
                    'Networking EIPs describe changes to the Ethereum network protocol.'
                  }
                  icon={<Icon as={Radio} fontSize={{md:'15', base: '10'}}/>}
                  url="networking"
              />

              <StatBox
                  title="Interface EIPs"
                  value={data.filter((item) => item.category === 'Interface').length}
                  description={
                    'Interface EIPs describe changes to the Ethereum client API.'
                  }
                  icon={<Icon as={Link} fontSize={{md:'15', base: '10'}}/>}
                  url="interface"
              />

              <StatBox
                  title="Informational EIPs"
                  value={data.filter((item) => item.type === 'Informational').length}
                  description={
                    'Informational EIPs describe other changes to the Ethereum ecosystem.'
                  }
                  icon={<Icon as={Clipboard} fontSize={{md:'15', base: '10'}}/>}
                  url="informational"
              />

              <StatBox
                  title="Meta EIPs"
                  value={data.filter((item) => item.type === 'Meta').length}
                  description={
                    'Meta EIPs describe changes to the EIP process, or other non-optional changes.'
                  }
                  icon={<Icon as={Briefcase} fontSize={{md:'15', base: '10'}}/>}
                  url="meta"
              />
            </div>
            <Box
                as={motion.div}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 } as any}
                bgColor={bg}
                paddingY={{md:'4rem', base:'2rem'}}
                paddingX={{md:'2rem', base:'0.5rem'}}
                borderRadius="0.55rem"
                _hover={{
                  border: '1px',
                  borderColor: '#10b981',
                }}
                className="hover: cursor-pointer ease-in duration-200"
            >
              <BarChart />
            </Box>
          </Box>
          <AreaC />

          <Table />
        </motion.div>
      )}
    </Box>
  );
};

export default Dashboard;
