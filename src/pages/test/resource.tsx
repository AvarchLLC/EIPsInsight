import React from 'react';
import AllLayout from "@/components/Layout";
import Header from '@/components/Header';
import { Box, Button, IconButton, Image, Link, useColorModeValue } from '@chakra-ui/react';
import { Youtube } from 'react-feather';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import LoaderComponent from '@/components/Loader';
import Table from '@/components/Tab';
import AwesomeSlider from 'react-awesome-slider';
import 'react-awesome-slider/dist/styles.css';
// import Swiper core and required modules
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';

import { Swiper, SwiperSlide } from 'swiper/react';
type FeaturedVideosProps = {
  title: string;
  summary: string;
  link: string;
};
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

// Import Swiper styles
import 'swiper/css';
import Head from 'next/head';
import { FaYoutube } from 'react-icons/fa';

const handleImageClick = (link: any) => {
  // Perform the desired action when an image is clicked
  window.open(link, '_blank');
};

const FeaturedVideos = ({title, summary, link}: FeaturedVideosProps) => {
  const bg = useColorModeValue("#f6f6f7", "#171923");

  return(
    <Box className='w-full flex items-center justify-between rounded-3xl p-12 hover:cursor-pointer ease-in duration-200'
    borderRadius="0.55rem"
    bgColor={bg}
    overflow="clip"
    _hover={{
      border: "1px",
      borderColor: "#10b981",
    }}>
      <div
      className='w-1/2 cursor-pointer overflow-hidden rounded-lg '>
                          <AwesomeSlider>
                    <div
                      data-src="https://img.youtube.com/vi/pyfKM_hOKaM/maxresdefault.jpg"
                      onClick={() =>
                        handleImageClick('https://www.youtube.com/watch?v=pyfKM_hOKaM')
                      }
                    />
                    <div
                      data-src="https://img.youtube.com/vi/AyidVR6X6J8/maxresdefault.jpg"
                      onClick={() =>
                        handleImageClick('https://www.youtube.com/watch?v=AyidVR6X6J8')
                      }
                    />
                    <div
                      data-src="https://img.youtube.com/vi/fwxkbUaa92w/maxresdefault.jpg"
                      onClick={() =>
                        handleImageClick('https://www.youtube.com/watch?v=fwxkbUaa92w')
                      }
                    />
                    <div
                      data-src="https://img.youtube.com/vi/sIr6XX8yR8o/maxresdefault.jpg"
                      onClick={() =>
                        handleImageClick('https://www.youtube.com/watch?v=sIr6XX8yR8o')
                      }
                    />
                  </AwesomeSlider>
      </div>

      <div className='w-1/2 flex flex-col items-start justify-between pl-10'>
        
        <Link href={link} target="_blank">
          <h2 className='my-2 w-full text-left text-6xl font-bold text-emerald-500 hover:underline-offset-1'>{title}</h2>
        </Link>
        <p className='my-2 font-medium text-xl'>{summary}</p>

        <div className='mt-2 flex items-center'>
          <Link href={link} target="_blank">
          <Button
                  colorScheme="red"
                 variant="outline"
                  fontSize={'12px'}
                  fontWeight={'bold'}
                  
                >
                  <IconButton aria-label="yt" as={Youtube} marginEnd={'1.5'} color={"#FF0000"} size={"10"} />
                  
                  Visit Channel
                </Button>
          </Link>
        </div>
      </div>
    </Box>
  )
}

const Resources = () => {
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
  
  return (
    <AllLayout>
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
          <Box className="ml-40 mr-40 pl-10 pr-10 mt-10 mb-20">
            <Header title="Resources" subtitle="All the Resources" />
              <Box className='col-span-12' paddingTop={8}>
              <FeaturedVideos  title="Featured Videos" summary="by EtherWorld" link='https://www.youtube.com/watch?v=fwxkbUaa92w'/>
              </Box>
              <Box display="flex"  paddingTop={8} gap={8}>
              <Box flexBasis="1/3"  className='w-full flex items-center justify-between rounded-3xl p-12 hover:cursor-pointer ease-in duration-200'
    borderRadius="0.55rem"
    
    overflow="clip"
    _hover={{
      border: "1px",
      borderColor: "#10b981",
    }}>
              asd
                </Box>
              <Box flexBasis="2/3" className='w-full flex items-center justify-between rounded-3xl p-12 hover:cursor-pointer ease-in duration-200'
    borderRadius="0.55rem"
    
    overflow="clip"
    _hover={{
      border: "1px",
      borderColor: "#10b981",
    }}>
              asd
              </Box>
              </Box>
              
          </Box>
          
        </motion.div>

      )}
    </AllLayout>
  );
};



export default Resources;
