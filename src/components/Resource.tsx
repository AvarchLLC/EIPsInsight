import React from 'react';
import Header from '@/components/Header';
import { Box, Button, IconButton, Link, useColorModeValue } from '@chakra-ui/react';
import { Youtube } from 'react-feather';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import LoaderComponent from '@/components/Loader';
import Table from '@/components/Tab';
import AwesomeSlider from 'react-awesome-slider';
import 'react-awesome-slider/dist/styles.css';
import Image from 'next/image';
import AllLayout from "@/components/Layout";
import {BsArrowRight} from 'react-icons/bs';
import resource1 from '@/../public/resources1.jpg';
import resource2 from '@/../public/resources2.jpg';
import resource3 from '@/../public/resources3.jpg';
import FeaturedVideos from "@/components/FeaturedVideos";
// import Swiper core and required modules
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import Banner from "@/components/NewsBanner";

import { Swiper, SwiperSlide } from 'swiper/react';

import Head from 'next/head';
import { FaYoutube } from 'react-icons/fa';

type FeaturedVideosProps = {
    title: string;
    summary: string;
    link: string;
};
const Resources: React.FC<FeaturedVideosProps> = () => {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulating a loading delay
        const timeout = setTimeout(() => {
            setIsLoading(false);
        }, 2000);

        // Cleanup function
        return () => clearTimeout(timeout);
    }, []);

    const handleImageClick = (link: any) => {
        // Perform the desired action when an image is clicked
        window.open(link, '_blank');
    };
    const bg = useColorModeValue("#f6f6f7", "#171923");
    return (
        <>
            <Head>
                <title>
                    Resources
                </title>
            </Head>
            {isLoading ? (
                // Check if the data is still loading
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
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Box
                        hideBelow={'lg'}
                        paddingBottom={{lg:'10', sm: '10',base: '10'}}
                        marginX={{lg:"40",md:'2', sm: '2', base: '2'}}
                        paddingX={{lg:"10",md:'5', sm:'5',base:'5'}}
                        marginTop={{lg:"10",md:'5', sm:'5',base:'5'}}
                    >
                        <Header title="Resources" subtitle="All the Resources" />
                        <Box className='col-span-12' paddingTop={8}>
                            <FeaturedVideos  title="Featured Videos" summary="by EtherWorld" link='https://www.youtube.com/watch?v=fwxkbUaa92w'/>
                        </Box>
                        <Box className="grid grid-cols-3"  paddingTop={8} gap={8}>
                            <Box  className='col-span-1 w-full flex justify-between rounded-3xl py-6 px-4 ease-in duration-200'
                                  bgColor={bg}
                                  borderRadius="0.55rem"
                                  overflow="clip"
                                  _hover={{
                                      border: "1px",
                                      borderColor: "#30A0E0",
                                  }}>
                                <div>
                                    <h2 className="text-2xl text-[#30A0E0] font-bold pt-3 pl-4">Resource Links</h2>
                                    <div className="justify-center">
                                        <Link href="https://etherworld.co/2021/10/06/an-overview-of-account-abstraction-in-ethereum-blockchain/" target="_blank">
                                            <Image
                                                src={resource1}
                                                width={200}
                                                height={300}
                                                alt="resource"
                                            />
                                        </Link>
                                        <Link href="https://etherworld.co/2021/10/06/an-overview-of-account-abstraction-in-ethereum-blockchain/" target="_blank">
                                            <Image
                                                src={resource2}
                                                width={200}
                                                height={300}
                                                alt="resource"/>
                                        </Link>
                                        <Link href="https://etherworld.co/2021/10/06/an-overview-of-account-abstraction-in-ethereum-blockchain/" target="_blank">
                                            <Image
                                                src={resource3}
                                                width={200}
                                                height={300}
                                                alt="resource"/>
                                        </Link>
                                    </div>
                                </div>
                            </Box>
                            <Box className='col-span-2 w-full flex justify-between rounded-3xl px-10 py-6 ease-in duration-200'
                                 borderRadius="0.55rem"
                                 bgColor={bg}
                                 overflow="clip"
                                 _hover={{
                                     border: "1px",
                                     borderColor: "#30A0E0",
                                 }}>
                                <div className="space-y-5 pt-3">
                                    <h2 className="text-2xl text-[#30A0E0] font-bold">What is Ethereum Improvement Proposal?</h2>
                                    <p className="text-lg">EIP stands for Ethereum Improvement Proposal. An EIP is a design document providing information to the Ethereum community, or describing a new feature for Ethereum or its processes or environment. The EIP should provide a concise technical specification of the feature and a rationale for the feature. The EIP author is responsible for building consensus within the community and documenting dissenting opinions.</p>
                                    <h2 className="text-2xl text-[#30A0E0] font-bold pt-5">Useful Resources</h2>
                                    <ul className="list-disc ml-6">
                                        <li className="underline"><Link href={'https://github.com/ethereum/EIPs'} target="_blank">EIPs Github</Link></li>
                                        <li className="underline"><Link href={'https://hacklg.io/@poojaranjan/EthereumImprovementProposalsInsight/'} target="_blank">EIPsInsight Hacklg</Link></li>
                                        <li className="underline"><Link href={'https://eips.ethereum.org/'} target="_blank">EIPS Insights</Link></li>
                                    </ul>
                                </div>
                            </Box>
                        </Box>
                    </Box>

                    <Box
                        display={{lg:"none", md: "block"}}
                        paddingBottom={{lg:'10', sm: '10',base: '10'}}
                        marginX={{lg:"40",md:'2', sm: '2', base: '2'}}
                        paddingX={{lg:"10",md:'5', sm:'5',base:'5'}}
                        marginTop={{lg:"10",md:'5', sm:'5',base:'5'}}
                    >

                        <Box className='col-span-12' paddingY={8}>
                            <FeaturedVideos  title="Featured Videos" summary="by EtherWorld" link='https://www.youtube.com/watch?v=fwxkbUaa92w'/>
                        </Box>

                        <Box
                            className='rounded-3xl py-6 px-4 ease-in duration-200'
                            borderRadius="0.55rem"
                            bgColor={bg}
                            overflow="clip"
                            _hover={{
                                border: "1px",
                                borderColor: "#30A0E0",
                            }}
                        >
                            <h2 className="text-xl text-[#30A0E0] font-bold pt-3">Resource Links</h2>
                            <ul className="pt-8 pb-5 space-y-10 mx-3">
                                <li className="flex justify-between space-x-8">
                                    <Image
                                        src={resource1}
                                        width={125}
                                        height={100}
                                        alt="resource"/>
                                    <Link href="https://etherworld.co/2021/10/06/an-overview-of-account-abstraction-in-ethereum-blockchain/" target="_blank">
                                        <div className="pt-4">
                                            <Button
                                                colorScheme="blue"
                                                rightIcon={<BsArrowRight />}
                                                variant="outline"
                                                fontSize={'12px'}
                                            >
                                                Go to Page
                                            </Button>
                                        </div>
                                    </Link>
                                </li>
                                <li className="flex justify-between space-x-8">
                                    <Image
                                        src={resource2}
                                        width={125}
                                        height={100}
                                        alt="resource"/>
                                    <Link href="https://etherworld.co/2021/10/06/an-overview-of-account-abstraction-in-ethereum-blockchain/" target="_blank">
                                        <div className="pt-4">
                                            <Button
                                                colorScheme="blue"
                                                rightIcon={<BsArrowRight />}
                                                variant="outline"
                                                fontSize={'12px'}
                                            >
                                                Go to Page
                                            </Button>
                                        </div>
                                    </Link>
                                </li>
                                <li className="flex justify-between space-x-8">
                                    <Image
                                        src={resource3}
                                        width={125}
                                        height={100}
                                        alt="resource"/>
                                    <Link href="https://etherworld.co/2021/10/06/an-overview-of-account-abstraction-in-ethereum-blockchain/" target="_blank">
                                        <div className="pt-4">
                                            <Button
                                                colorScheme="blue"
                                                rightIcon={<BsArrowRight />}
                                                variant="outline"
                                                fontSize={'12px'}
                                            >
                                                Go to Page
                                            </Button>
                                        </div>
                                    </Link>
                                </li>
                            </ul>
                        </Box>

                        <Box paddingTop={'8'}>
                            <Box className='rounded-3xl py-6 px-4 ease-in duration-200'
                                 borderRadius="0.55rem"
                                 bgColor={bg}
                                 overflow="clip"
                                 _hover={{
                                     border: "1px",
                                     borderColor: "#30A0E0",
                                 }}>
                                <div className="space-y-5 pt-3">
                                    <h2 className="text-xl text-[#30A0E0] font-bold">What is Ethereum Improvement Proposal?</h2>
                                    <p className="text-sm">EIP stands for Ethereum Improvement Proposal. An EIP is a design document providing information to the Ethereum community, or describing a new feature for Ethereum or its processes or environment. The EIP should provide a concise technical specification of the feature and a rationale for the feature. The EIP author is responsible for building consensus within the community and documenting dissenting opinions.</p>
                                    <h2 className="text-xl text-[#30A0E0] font-bold pt-5">Useful Resources</h2>
                                    <ul className="list-disc ml-6 text-sm">
                                        <li className="underline"><Link href={'https://github.com/ethereum/EIPs'} target="_blank">EIPs Github</Link></li>
                                        <li className="underline"><Link href={'https://hacklg.io/@poojaranjan/EthereumImprovementProposalsInsight/'} target="_blank">EIPsInsight Hacklg</Link></li>
                                        <li className="underline"><Link href={'https://eips.ethereum.org/'} target="_blank">eips.ethereum.org website</Link></li>
                                    </ul>
                                </div>
                            </Box>
                        </Box>
                    </Box>

                </motion.div>

            )}
        </>
    );
};



export default Resources;
