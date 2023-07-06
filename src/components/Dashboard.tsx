import { motion } from 'framer-motion';
import { Box, Button, Heading, Icon, Text, useColorModeValue, useMediaQuery, useTheme, Link as LI } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import { DownloadIcon } from '@chakra-ui/icons';
import BarChart from '@/components/BarChart';
import { Anchor, BookOpen, Radio, Link, Clipboard, Briefcase } from 'react-feather';
import Table from '@/components/Table';
import AreaC from '@/components/AreaC';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import { mockEIP } from '@/data/eipdata';
import { usePathname } from 'next/navigation';
import FlexBetween from './FlexBetween';
import StatBox from './StatBox';

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
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/alleips`);
        console.log(response);
        const jsonData = await response.json();
        setData(jsonData);
      } catch (error) {
        console.error('Error fetching data:', error);
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
    <Box className="ml-40 mr-40 pl-10 pr-10 mt-10 pb-10" paddingBottom={'10'}>
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

            <Box>
              <Button
                colorScheme="green"
                variant="outline"
                fontSize={'14px'}
                fontWeight={'bold'}
                padding={'10px 20px'}
              >
                <DownloadIcon marginEnd={'1.5'} />
                Download Reports
              </Button>
            </Box>
          </FlexBetween>
        </motion.div>

        <Box
          mt="20px"
          display="grid"
          gridTemplateColumns="repeat(12, 1fr)"
          gridAutoRows="160px"
          gap="20px"
        >
          <StatBox
            title="Core EIPs"
            value={data.filter((item) => item.category === 'Core').length}
            description={'Core EIPs describe changes to the Ethereum protocol.'}
            icon={<Icon as={Anchor} />}
            url="core"
          />

          <StatBox
            title="ERCs"
            value={data.filter((item) => item.category === 'ERC').length}
            description={
              'ERCs describe application-level standards for the Ethereum ecosystem.'
            }
            icon={<Icon as={BookOpen} />}
            url="erc"
          />

          <StatBox
            title="Networking EIPs"
            value={data.filter((item) => item.category === 'Networking').length}
            description={
              'Networking EIPs describe changes to the Ethereum network protocol.'
            }
            icon={<Icon as={Radio} />}
            url="networking"
          />

          <Box
            as={motion.div}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 } as any}
            bgColor={bg}
            gridColumn="span 6"
            gridRow="span 2"
            p="1rem"
            borderRadius="0.55rem"
            _hover={{
              border: '1px',
              borderColor: '#10b981',
            }}
            className="hover: cursor-pointer ease-in duration-200"
          >
            <BarChart />
          </Box>

          <StatBox
            title="Interface EIPs"
            value={data.filter((item) => item.category === 'Interface').length}
            description={
              'Interface EIPs describe changes to the Ethereum client API.'
            }
            icon={<Icon as={Link} />}
            url="interface"
          />

          <StatBox
            title="Informational EIPs"
            value={data.filter((item) => item.type === 'Informational').length}
            description={
              'Informational EIPs describe other changes to the Ethereum ecosystem.'
            }
            icon={<Icon as={Clipboard} />}
            url="informational"
          />

          <StatBox
            title="Meta EIPs"
            value={data.filter((item) => item.type === 'Meta').length}
            description={
              'Meta EIPs describe changes to the EIP process, or other non-optional changes.'
            }
            icon={<Icon as={Briefcase} />}
            url="meta"
          />
        </Box>

        <AreaC />

        <Table />
      </motion.div>
    </Box>
  );
};

export default Dashboard;
