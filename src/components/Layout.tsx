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
    >
      <Head>
        <title>EIPs Insights</title>
        <link rel="icon" href="/eipFavicon.png" />
      </Head>
      <ColorModeScript initialColorMode="dark" />
      <Providers>
        <Navbar />

        {/* New Section with Highlighted Background and Emojis */}
        <Box 
          bg="skyblue" 
          color="white" 
          py={4} 
          textAlign="center"
          fontWeight="bold"
          fontSize="xl"
        >
          🚀 We have participated in the Gitcoin Octant Community Round 1! ❤️ Please support us here:{" "} 👉 
          <Link 
            href="https://explorer.gitcoin.co/#/round/10/66/40" 
            isExternal 
            textDecoration="underline"
            color="white"
          >
           Link
          </Link>
        </Box>

        {children}
        <LargeWithAppLinksAndSocial />
      </Providers>
    </motion.div>
  );
};

export default AllLayout;
