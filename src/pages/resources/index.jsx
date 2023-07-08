import React from 'react';
// import resourceImage from '../../../public/resourse.png'
import AllLayout from "@/components/Layout";
import Header from '@/components/Header';
import Link from 'next/link';
// import { Box } from '@chakra-ui/react';
import Image from 'next/image';
// Swiper JS module import 
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// import required modules
import { Pagination, Navigation } from 'swiper/modules';


const Resources = () => {



  return (
    <AllLayout>
      <div className="ml-40 mr-40 pl-10 pr-10 mt-10 mb-40">
        <Header title='Resources' subtitle='' />

        {/* adding slider  */}
        <div className='bg-[#F3F3F3] w-full mt-4 mb-6 p-6'>
          <>
            <Swiper
              slidesPerView={4}
              spaceBetween={20}
              loop={true}
              pagination={{
                clickable: true,
              }}
              navigation={true}
              modules={[Pagination, Navigation]}
              className="mySwiper"
            >
              <div className='flex justify-center items-center h-40'>
                <SwiperSlide className='ml-12'>
                  {/* <Image src={resourceImage} alt="." /> */}
                </SwiperSlide>
                {/* <SwiperSlide>
                  <Image src={resourceImage} alt="." />
                </SwiperSlide>
                <SwiperSlide>
                  <Image src={resourceImage} alt="." />
                </SwiperSlide>
                <SwiperSlide>
                  <Image src={resourceImage} alt="." /> */}
                {/* </SwiperSlide> */}
                <SwiperSlide>
                  {/* <Image src={resourceImage} alt="." /> */}
                </SwiperSlide>
                <SwiperSlide>
                  {/* <Image src={resourceImage} alt="." /> */}
                </SwiperSlide>
              </div>

            </Swiper>
          </>
        </div>

        {/* =============================== Resources Links ================================= */}

        <div className='flex flex-col lg:flex-row md-flex-row gap-4'>
          <div className='bg-[#F3F3F3] w-full md:w-full lg:w-2/5'>
            <h1 className='text-xl font-bold mx-3 mt-3 mb-4'>Resources Link</h1>
            <div className='flex flex-col gap-3'>
              <div className='flex gap-3 mx-3'>
                {/* <Image src={resourceImage} alt="." /> */}
                <Link href="." className='flex justify-center items-center'>Link will be here</Link>
              </div>
              <div className='flex gap-3 mx-3'>
                {/* <Image src={resourceImage} alt="." /> */}
                <Link href="." className='flex justify-center items-center'>Link will be here</Link>
              </div>
              <div className='flex gap-3 mx-3'>
                {/* <Image src={resourceImage} alt="." /> */}
                <Link href="." className='flex justify-center items-center'>Link will be here</Link>
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
                  <Link href="/">Link 1</Link>
                </li>
                <li>
                  <Link href="/">Link 2</Link>
                </li>
                <li>
                  <Link href="/">Link 3</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </AllLayout>
  )
};


export default Resources