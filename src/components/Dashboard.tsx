import { motion } from 'framer-motion';
import { Box, Button, Heading, Icon, Text, useColorModeValue, useMediaQuery, useTheme, Link as LI,Stack } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import { DownloadIcon } from '@chakra-ui/icons';
import BarChart from '@/components/BarChart';
import { Anchor, BookOpen, Radio, Link, Clipboard, Briefcase } from 'react-feather';
import {BsArrowUpRight, BsGraphUp} from 'react-icons/bs';
import StackedColumnChart from "@/components/StackedBarChart";

import AreaC from '@/components/AreaC';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import { mockEIP } from '@/data/eipdata';
import { usePathname } from 'next/navigation';
import FlexBetween from './FlexBetween';
import StatBox from './StatBox';
import LoaderComponent from './Loader';
import Table from './Table';
import Banner from "@/components/NewsBanner";
import SearchBox from "@/components/SearchBox";

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
  const [isDarkMode, setIsDarkMode] = useState(false);
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
  console.log(data);




  const theme = useTheme();
  const isNonMediumScreens = useMediaQuery('(min-width: 1200px)');
  const bg = useColorModeValue('#f6f6f7', '#171923');
  const text = useColorModeValue('white', 'black');
  const router = useRouter();
  useEffect(() => {
    if(bg === '#f6f6f7'){
      setIsDarkMode(false);
    }
    else{
      setIsDarkMode(true);
    }
        })


  const monthName = new Date().toLocaleString([], {
    month: 'long',
  });
  const year = new Date().getFullYear();

  return (
    <>
      <Box
          paddingBottom={{lg:'10', sm: '10',base: '10'}}
          marginX={{lg:"40",md:'2', sm: '2', base: '2'}}
          paddingX={{lg:"10",md:'5', sm:'5',base:'5'}}
          marginTop={{lg:"10",md:'5', sm:'5',base:'5'}}
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

                <Box
                    id={'hero'}
                    paddingTop={{lg:'12',base:'6'}}
                    paddingBottom={{lg:'24',base:'32'}}
                >
                  <div className="lg:block hidden">
                    <Box
                        display={{lg:'grid'}}
                        gridTemplateColumns={{lg:'2fr 1fr'}}
                    >
                      <Stack direction={'column'}>
                        <Text color={'#30A0E0'} fontWeight={'bold'} fontSize={{lg:'7xl',md:'5xl',sm:'3xl',base:'xl'}}>
                          Ethereum <br/> Improvement <br/> Proposal <br/> Insights
                        </Text>
                        <Stack direction={'row'} spacing={'6'}>
                          <Box

                          >
                            <NextLink href={'/dashboard#1'}>
                              <Button
                                  colorScheme="blue"
                                  variant={'outline'}
                                  fontSize={{lg:'14px',md:'12px', sm:'12px',base:'10px'}}
                                  fontWeight={'bold'}
                                  padding={{lg:'10px 20px',md:'5px 10px', sm:'5px 10px',base:'5px 10px'}}
                                  rightIcon={<BsArrowUpRight />}
                                  bgColor={'#30A0E0'}
                              >
                                Dashboard
                              </Button>
                            </NextLink>
                          </Box>

                          <Box

                          >
                            <NextLink href={`/insight/${year}/${getMonth(monthName)}`}>
                              <Button
                                  colorScheme="blue"
                                  variant={'outline'}
                                  fontSize={{lg:'14px',md:'12px', sm:'12px',base:'10px'}}
                                  fontWeight={'bold'}
                                  padding={{lg:'10px 20px',md:'5px 10px', sm:'5px 10px',base:'5px 10px'}}
                                  rightIcon={<BsGraphUp />}
                              >
                                {monthName} {year} Insights
                              </Button>
                            </NextLink>
                          </Box>
                        </Stack>
                      </Stack>
                      <Box
                          bgColor={bg}
                          borderRadius={'0.55rem'}
                          padding={{lg:'2rem',md:'1rem',sm:'0.5rem'}}
                          className={!isDarkMode ? 'custom-shadow-black' : 'custom-shadow'}
                      >
                        <NextLink href={'/all'}>
                          <Text fontSize="2xl" fontWeight="bold" color="#30A0E0" marginRight="6"  >
                            {`Total EIPs - ${data.length}`}
                          </Text>
                        </NextLink>
                        <StackedColumnChart status={'Final'}/>
                      </Box>
                    </Box>
                  </div>
                  <div className="lg:hidden block">
                    <Text className='text-5xl text-center pb-5 sm:text-6xl md:text-7xl' color={'#30A0E0'} fontWeight={'bold'}>Ethereum <br/> Improvement <br/> Proposal <br/> Insights</Text>
                    <Box
                        bgColor={bg}
                        borderRadius={'0.55rem'}
                        padding={{lg:'2rem',md:'1rem',sm:'0.5rem'}}
                        className={'custom-shadow'}
                    >
                      <NextLink href={'/all'}>
                        <Text fontSize="2xl" fontWeight="bold" color="#30A0E0" marginX="6" paddingTop={6}  >
                          {`Total EIPs - ${data.length}`}
                        </Text>
                      </NextLink>
                      <StackedColumnChart status={'Final'}/>
                    </Box>

                    <Stack direction={'row'} spacing={'6'} paddingTop={'20'}>
                      <Box

                      >
                        <NextLink href={'/dashboard#1'}>
                          <Button
                              colorScheme="blue"
                              variant={'outline'}
                              fontSize={{lg:'14px',md:'12px', sm:'12px',base:'10px'}}
                              fontWeight={'bold'}
                              padding={{lg:'10px 20px',md:'5px 10px', sm:'5px 10px',base:'5px 10px'}}
                              rightIcon={<BsArrowUpRight />}
                              bgColor={'#30A0E0'}
                          >
                            Dashboard
                          </Button>
                        </NextLink>
                      </Box>

                      <Box

                      >
                        <NextLink href={`/insight/${year}/${getMonth(monthName)}`}>
                          <Button
                              colorScheme="blue"
                              variant={'outline'}
                              fontSize={{lg:'14px',md:'12px', sm:'12px',base:'10px'}}
                              fontWeight={'bold'}
                              padding={{lg:'10px 20px',md:'5px 10px', sm:'5px 10px',base:'5px 10px'}}
                          >
                            {monthName} {year} Insights
                          </Button>
                        </NextLink>
                      </Box>
                    </Stack>

                  </div>
                </Box>

                <div className="py-8">
                  <Box className={'w-full lg:px-48 md:px-32 sm:px-24 px-20 py-5 rounded-[0.55rem] hover:border border-blue-500'} bgColor={bg} >
                    <SearchBox />
                  </Box>
                </div>

                <FlexBetween

                >
                  <Box
                    id={'1'}
                  >
                    <Header title="DASHBOARD" subtitle="Welcome to the dashboard" />
                  </Box>

                  <Box

                  >
                    <Button
                        colorScheme="blue"
                        variant="outline"
                        fontSize={{lg:'14px',md:'12px', sm:'12px',base:'10px'}}
                        fontWeight={'bold'}
                        padding={{lg:'10px 20px',md:'5px 10px', sm:'5px 10px',base:'5px 10px'}}
                    >
                      <DownloadIcon marginEnd={'1.5'} />
                      Download Reports
                    </Button>
                  </Box>
                </FlexBetween>
              </motion.div>


              <Box
                  display='grid'
                  gridTemplateColumns={{lg:'repeat(2, 1fr)'}}
                  gap={'6'}
                  marginTop={'20px'}
              >
                <div className="grid grid-cols-3 grid-rows-2 gap-6">
                  <StatBox
                      title="Core EIPs"
                      value={data.filter((item) => item.category === 'Core').length}
                      description={'Core EIPs describe changes to the Ethereum protocol.'}
                      icon={<Icon as={Anchor} fontSize={{lg:'15', sm: '10'}}/>}
                      url="core"
                  />

                  <StatBox
                      title="ERCs"
                      value={data.filter((item) => item.category === 'ERC').length}
                      description={
                        'ERCs describe application-level standards for the Ethereum ecosystem.'
                      }
                      icon={<Icon as={BookOpen} fontSize={{lg:'15', sm: '10'}}/>}
                      url="erc"
                  />

                  <StatBox
                      title="Networking EIPs"
                      value={data.filter((item) => item.category === 'Networking').length}
                      description={
                        'Networking EIPs describe changes to the Ethereum network protocol.'
                      }
                      icon={<Icon as={Radio} fontSize={{lg:'15', sm: '10'}}/>}
                      url="networking"
                  />

                  <StatBox
                      title="Interface EIPs"
                      value={data.filter((item) => item.category === 'Interface').length}
                      description={
                        'Interface EIPs describe changes to the Ethereum client API.'
                      }
                      icon={<Icon as={Link} fontSize={{lg:'15', sm: '10'}}/>}
                      url="interface"
                  />

                  <StatBox
                      title="Informational EIPs"
                      value={data.filter((item) => item.type === 'Informational').length}
                      description={
                        'Informational EIPs describe other changes to the Ethereum ecosystem.'
                      }
                      icon={<Icon as={Clipboard} fontSize={{lg:'15', sm: '10'}}/>}
                      url="informational"
                  />

                  <StatBox
                      title="Meta EIPs"
                      value={data.filter((item) => item.type === 'Meta').length}
                      description={
                        'Meta EIPs describe changes to the EIP process, or other non-optional changes.'
                      }
                      icon={<Icon as={Briefcase} fontSize={{lg:'15', sm: '10'}}/>}
                      url="meta"
                  />
                </div>
                <Box
                    as={motion.div}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 } as any}
                    bgColor={bg}
                    paddingY={{lg:'2rem', sm:'2rem'}}
                    paddingX={{lg:'2rem', sm:'0.5rem'}}
                    borderRadius="0.55rem"
                    _hover={{
                      border: '1px',
                      borderColor: '#30A0E0',
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
    </>
  );
};

function getMonth(monthName:any){
  switch(monthName){
    case "January":
      return 1;
    case "February":
      return 2;
    case "March":
      return 3;
    case 'April':
      return 4;
    case 'May':
      return 5;
    case 'June':
      return 6;
    case 'July':
      return 7;
    case 'August':
      return 8;
    case 'September':
      return 9;
    case 'October':
      return 10;
    case 'November':
      return 11;
    case 'December':
      return 12;
    default:
      return '1';

  }
}

export default Dashboard;
