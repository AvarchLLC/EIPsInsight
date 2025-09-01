import { Providers } from "@/app/providers";
import React from "react";
import LargeWithAppLinksAndSocial from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Box, ColorModeScript, Text, Link } from "@chakra-ui/react";
import { Rajdhani } from 'next/font/google';
import "../app/globals.css";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import Head from "next/head";
import Script from "next/script";
import FloatingContributionIcon from "./FloatingContributionIcon";
import UniversalFeedbackSystem from "./UniversalFeedbackSystem";
import { SessionProvider } from "next-auth/react";
import SessionWrapper from '@/components/SessionWrapper';
import { AuthLocalStorageInitializer } from "./AuthLocalStorageInitializer";

const mont = Rajdhani({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: "swap",
});const AllLayout = ({ children }: { children: React.ReactNode }) => {
  const router = usePathname();
  return (
    <SessionWrapper> 
    <motion.div
      key={router}
      initial="initialState"
      animate="animateState"
      exit="exitState"
      transition={{
        duration: 0.75,
      }}
      variants={{
        initialState: {
          opacity: 0,
          clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)",
        },
        animateState: {
          opacity: 1,
          clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)",
        },
        exitState: {
          clipPath: "polygon(50% 0, 50% 0, 50% 100%, 50% 100%)",
        },
      }}
      style={{}}
      {...{ className: `${mont.className} base-page-size` }}
    >
      <Head>
        <title>EIPs Insights</title>
        <link rel="icon" href="/eipFavicon.png" />
      </Head>


      <ColorModeScript initialColorMode="light" />
      <Providers>
     
        <AuthLocalStorageInitializer/>
        {children}
        {/* Universal Feedback Widget - appears on all pages */}
        <UniversalFeedbackSystem />
        <FloatingContributionIcon/>
        <LargeWithAppLinksAndSocial />
      </Providers>
    </motion.div>
    </SessionWrapper> 
  );
};

export default AllLayout;