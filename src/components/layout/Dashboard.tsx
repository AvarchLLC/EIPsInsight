import { Providers } from "@/app/providers";
import React from "react";
import LargeWithAppLinksAndSocial from "@/components/Footer";
import { Box, ColorModeScript, Text, Link } from "@chakra-ui/react";
import { Inter, Poppins } from "next/font/google";
import "../../app/globals.css";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import Head from "next/head";
// import Script from "next/script";

const Dashboard2 = () => {
  const router = usePathname();
  return (
    <>
      <Head>
        <title>EIPs Insights</title>
        <link rel="icon" href="/eipFavicon.png" />
      </Head>
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          className="w-full h-full object-cover"
          style={{ minHeight: '1080px' }}
        >
          <source src="/assets/vid.mp4" type="video/mp4" />
        </video>
        
      </div>
      <div className="absolute right-0 top-0 w-1/2 pt-40">
        <motion.div
          className="absolute w-full h-full bg-[#3c59da] rounded-full"
          style={{ filter: 'blur(400px)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        />
        <motion.img
          src="/assets/hero.png"
          alt="Floating Hero"
          className="relative"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, ease: "easeInOut", repeat: Infinity }}
        />
      </div>
      <div className="absolute left-10 top-1/4 text-white pt-60 px-10 z-10">
        <motion.h1
          className="text-7xl font-extrabold"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Tracking <span className="text-blue-500">Progress</span>
          <br />
          Shaping <span className="text-blue-500">Ethereum</span>
        </motion.h1>
        <div className="mt-10 flex flex-row gap-4">
          <motion.button
            className="px-6 py-3 bg-blue-500 border font-bold border-blue-500 rounded-full text-white backdrop-blur-md"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            Explore EIPS
          </motion.button>
          <motion.button
            className="px-6 py-3 bg-blue-500/30 font-bold border border-blue-500 rounded-full text-white backdrop-blur-md"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            Tools
          </motion.button>
        </div>
      </div>

      <div className="w-full h-auto flex flex-col items-center justify-center bg-[#0F172A] py-20">
        <motion.div
          className="text-[30px] text-white font-medium mt-[10px] text-center mb-[15px]"
        >
          PROJECTS
        </motion.div>
        <motion.div
          className="cursive text-[20px] text-gray-200 mb-10 mt-[10px] text-center"
        >
          Things I{"'"}ve enjoyed working on
        </motion.div>
      </div>
    </>
  );
};

export default Dashboard2;