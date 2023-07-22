import React from 'react';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

// Import Swiper styles
import 'swiper/css';
import {Box, Button, IconButton, Link, useColorModeValue} from "@chakra-ui/react";
import AwesomeSlider from "react-awesome-slider";
import {Youtube} from "react-feather";

type FeaturedVideosProps = {
    title: string;
    summary: string;
    link: string;
};
const handleImageClick = (link: any) => {
    // Perform the desired action when an image is clicked
    window.open(link, '_blank');
};

const FeaturedVideos: React.FC<FeaturedVideosProps> = ({title, summary, link}: FeaturedVideosProps) => {
    const bg = useColorModeValue("#f6f6f7", "#171923");

    return(
        <Box className='w-full flex items-center justify-between rounded-3xl p-6 md:p-12 md:hover:cursor-pointer ease-in duration-200'
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
                    <h2 className='my-2 w-full text-left text-2xl md:text-6xl font-bold text-emerald-500 hover:underline-offset-1'>{title}</h2>
                </Link>
                <p className='my-2 font-medium text-sm md:text-xl'>{summary}</p>

                <div className='mt-2 flex items-center'>
                    <Link href={link} target="_blank">
                        <Button
                            colorScheme="red"
                            variant="outline"
                            fontSize={{md:'12px', base:'9px'}}
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

export default FeaturedVideos;