import { Providers } from "@/app/providers";
import React from "react";
import LargeWithAppLinksAndSocial from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Box, ColorModeScript, Text, Link } from "@chakra-ui/react";
import { Inter } from "next/font/google";
import "../app/globals.css";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import Head from "next/head";
import Script from 'next/script';

const mont = Inter({ subsets: ["latin"] });
const AllLayout = ({ children }: { children: React.ReactNode }) => {
  const router = usePathname();
  return (
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
      className={`${mont.className} base-page-size`}
      style={{ width: "100%", margin: "0", padding: "0" }}
    >
      <Head>
        <title>EIPs Insights</title>
        <link rel="icon" href="/eipFavicon.png" />
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-N59QCDB9WN"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
        >
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-N59QCDB9WN', { anonymize_ip: true });
            gtag('consent', 'default', {
              ad_storage: 'denied',
              analytics_storage: 'denied',
            });
          `}
        </Script>
      </Head>
      <ColorModeScript initialColorMode="dark" />
      <Providers>
        <Navbar />
        <Box
  width="100%"
  px={{ base: "0", md: "4", lg: "8" }} // Responsive padding
  py={{ base: "0", md: "6" }}
  overflowX="hidden"
>
        {children}
        </Box>
        <LargeWithAppLinksAndSocial />
      </Providers>
    </motion.div>
  );
};

export default AllLayout;
