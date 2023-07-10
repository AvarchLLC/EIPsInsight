import imageOne from '../../../public/1.png'
import imageTwo from '../../../public/2.png'
import imageThree from "../../../public/3.png"
import imageFour from "../../../public/4.png"
import imageFive from "../../../public/5.jpg"
import imageSix from "../../../public/6.jpg"

import AllLayout from "@/components/Layout";
import Header from "@/components/Header";
import Link from "next/link";
// import { Box } from ‘@chakra-ui/react’;
import Image from "next/image";
// Swiper JS module import
import React from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

// import required modules
import { Pagination } from "swiper/modules";
import { Autoplay, Navigation } from "swiper/modules";

const Resources = () => {

    return (
        <AllLayout>
            <div className="ml-40 mr-40 pl-10 pr-10 mt-10 mb-40">
                <Header title='Resources' subtitle="" />
                <div className='flex justify-between'>
                    <h1 className='text-xl'>Get All You Need To Know</h1>
                    <Link className='px-4 py-2 border-2 border-green-600 bg-none' href='/'>Contact US</Link>
                </div>
                {/* adding slider  */}
                <div className='bg-[#F3F3F3] w-full mt-4 mb-6 p-6'>
                    <>
                        <Swiper
                            slidesPerView={3}
                            spaceBetween={20}
                            loop
                            pagination={{
                                dynamicBullets: true,
                            }}
                            navigation={true}
                            autoplay={{
                                delay: 1200
                            }}
                            modules={[Pagination, Navigation, Autoplay]}
                            className="mySwiper"
                        >
                            <div className='flex justify-center items-center h-40'>
                                <SwiperSlide className='ml-12'>
                                    <Link href="https://www.youtube.com/watch?v=sIr6XX8yR8o&list=PLZmWIkdMcWY6sdsjqgQQCcnDqw8lE0WWE&index=1&ab_channel=EtherWorld">
                                        <Image src={imageOne} alt="." />
                                    </Link>
                                </SwiperSlide>
                                <SwiperSlide className='ml-12'>
                                    <Link href="https://www.youtube.com/watch?v=dEgBVAzY6Eg&list=PLZmWIkdMcWY6sdsjqgQQCcnDqw8lE0WWE&index=2&ab_channel=EtherWorld">
                                        <Image src={imageTwo} alt="." />
                                    </Link>
                                </SwiperSlide>
                                <SwiperSlide className='ml-12'>
                                    <Link href="https://www.youtube.com/watch?v=pO8fmZd4Mjw&list=PLZmWIkdMcWY6sdsjqgQQCcnDqw8lE0WWE&index=3&ab_channel=EtherWorld">
                                        <Image src={imageThree} alt="." />
                                    </Link>
                                </SwiperSlide>
                                <SwiperSlide className='ml-12'>
                                    <Link href="https://www.youtube.com/watch?v=V75TPvK-K_s&list=PLZmWIkdMcWY6sdsjqgQQCcnDqw8lE0WWE&index=4&ab_channel=EtherWorld">
                                        <Image src={imageFour} alt="." />
                                    </Link>
                                </SwiperSlide>
                                <SwiperSlide className='ml-12'>
                                    <Link href="https://www.youtube.com/watch?v=fwxkbUaa92w&list=PLZmWIkdMcWY6sdsjqgQQCcnDqw8lE0WWE&index=5&ab_channel=EtherWorld">
                                        <Image src={imageFive} alt="." />
                                    </Link>
                                </SwiperSlide>
                                <SwiperSlide className='ml-12'>
                                    <Link href="https://www.youtube.com/watch?v=AyidVR6X6J8&list=PLZmWIkdMcWY6sdsjqgQQCcnDqw8lE0WWE&index=6&ab_channel=EtherWorld">
                                        <Image src={imageSix} alt="." />
                                    </Link>
                                </SwiperSlide>
                            </div>
                        </Swiper>
                    </>
                </div>

                {/* ============== Resources Links ================= */}

                <div className='flex flex-col lg:flex-row md-flex-row gap-4'>
                    <div className='bg-[#F3F3F3] w-full md:w-full lg:w-2/5 pb-4'>
                        <h1 className='text-xl font-bold mx-3 mt-3 mb-4'>Resources Link</h1>
                        <div className='flex flex-col gap-3'>
                            <div className='flex gap-3 mx-3'>
                                <Image className='h-10 w-20' src={imageOne} alt="." />
                                <Link className='flex justify-center items-center text-sky-600' href="https://www.youtube.com/watch?v=sIr6XX8yR8o&list=PLZmWIkdMcWY6sdsjqgQQCcnDqw8lE0WWE&index=1&ab_channel=EtherWorld"> EIPs & Standardization Process
                                </Link>
                            </div>
                            <div className='flex gap-3 mx-3'>
                                <Image className='h-10 w-20' src={imageTwo} alt="." />
                                <Link className='flex justify-center items-center text-sky-600' href="https://www.youtube.com/watch?v=dEgBVAzY6Eg&list=PLZmWIkdMcWY6sdsjqgQQCcnDqw8lE0WWE&index=2&ab_channel=EtherWorld"> Sign-In with Ethereum
                                </Link>
                            </div>
                            <div className='flex gap-3 mx-3'>
                                <Image className='h-10 w-20' src={imageThree} alt="." />
                                <Link className='flex justify-center items-center text-sky-600' href="https://www.youtube.com/watch?v=pO8fmZd4Mjw&list=PLZmWIkdMcWY6sdsjqgQQCcnDqw8lE0WWE&index=3&ab_channel=EtherWorld"> Non-Fungible Token Standard
                                </Link>
                            </div>
                            <div className='flex gap-3 mx-3'>
                                <Image className='h-10 w-20' src={imageFour} alt="." />
                                <Link className='flex justify-center items-center text-sky-600' href="https://www.youtube.com/watch?v=V75TPvK-K_s&list=PLZmWIkdMcWY6sdsjqgQQCcnDqw8lE0WWE&index=4&ab_channel=EtherWorld"> Fractional NFTs
                                </Link>
                            </div>
                            <div className='flex gap-3 mx-3'>
                                <Image className='h-10 w-20' src={imageFive} alt="." />
                                <Link className='flex justify-center items-center text-sky-600' href="https://www.youtube.com/watch?v=fwxkbUaa92w&list=PLZmWIkdMcWY6sdsjqgQQCcnDqw8lE0WWE&index=5&ab_channel=EtherWorld"> Token Standard
                                </Link>
                            </div>
                            <div className='flex gap-3 mx-3'>
                                <Image className='h-10 w-20' src={imageSix} alt="." />
                                <Link className='flex justify-center items-center text-sky-600' href="https://www.youtube.com/watch?v=AyidVR6X6J8&list=PLZmWIkdMcWY6sdsjqgQQCcnDqw8lE0WWE&index=6&ab_channel=EtherWorld"> EIPs & Standardization Process
                                </Link>
                            </div>

                        </div>
                    </div>
                    <div className='bg-[#F3F3F3] w-full md:w-full lg:w-3/5'>
                        <div>
                            <h2 className='font-bold m-3'>
                                What is Ethereum Improvement Proposals?
                            </h2>
                            <p className='mx-3 mb-3'>
                                EIP stands for Ethereum Improvement Proposal. An EIP is a design document providing information to the Ethereum community, or describing a new feature for Ethereum or its processes or environment. The EIP should provide a concise technical specification of the feature and a rationale for the feature. The EIP author is responsible for building consensus within the community and documenting dissenting opinions.
                            </p>
                        </div>
                        <div className='mx-3 mb-3 '>
                            <h2 className='font-bold'>Useful Resources.</h2>
                            <ul className='list-disc ml-4'>
                                <li>
                                    <Link className='text-sky-600' href="https://github.com/ethereum/EIPs">EIP's Github</Link>
                                </li>
                                <li>
                                    <Link className='text-sky-600' href="https://eips.ethereum.org/">EIP's Website</Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </AllLayout>
    )
}

export default Resources