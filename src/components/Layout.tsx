import { Providers } from "@/app/providers";
import React from "react";
import LargeWithAppLinksAndSocial from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Box, ColorModeScript, Text, Link, Flex } from "@chakra-ui/react";
import { Rajdhani } from 'next/font/google';
import "../app/globals.css";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import Head from "next/head";
import Script from "next/script";
import FloatingContributionIcon from "./FloatingContributionIcon";
import BookmarkFloater from './BookmarkFloater';
import { SessionProvider } from "next-auth/react";
import SessionWrapper from '@/components/SessionWrapper';
import { AuthLocalStorageInitializer } from "./AuthLocalStorageInitializer";
import { BookmarkProvider } from './BookmarkContext';
import { Portal } from "@chakra-ui/react";
import Sidebar from "@/components/Sidebar/SideBar";
import { SidebarProvider, useSidebar } from "./Sidebar/SideBarContext";
import SidebarConfigLoader from "./Sidebar/SideBarConfigLoader";
import { sidebarConfig } from "./Sidebar/slidebarConfig";


const mont = Rajdhani({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});
const AllLayout = ({ children }: { children: React.ReactNode }) => {
  const { isCollapsed } = useSidebar();
  const pathname = usePathname();
const topLevelRoute = pathname === "/" ? "/" : `/${pathname?.split("/")?.[1]}`;
const shouldShowSidebar = !!sidebarConfig[topLevelRoute];
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
      className={`${mont.className} base-page-size`}
      
    >
      <Head>
        <title>EIPs Insights</title>
        <link rel="icon" href="/eipFavicon.png" />
      </Head>

      {/* Google Analytics */}
      <Script async src="https://www.googletagmanager.com/gtag/js?id=G-R36R5NJFTW"></Script>
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-R36R5NJFTW');
        `}
      </Script>

      <ColorModeScript initialColorMode="dark" />
      <Providers>
        <SidebarProvider>
        <BookmarkProvider>
          <SidebarConfigLoader />
        {shouldShowSidebar && (
          <Portal>
            <Box position="fixed" top="0" left="0" zIndex={100000}>
              <Sidebar />
            </Box>
          </Portal>
        )}
        <Navbar />

        {/* New Section with Highlighted Background and Emojis */}
        {/* <Box 
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
        </Box> */}
        <AuthLocalStorageInitializer/>
        {children}
        <Box position="fixed" bottom={4} right={4} zIndex={1000}>
  <FloatingContributionIcon />
</Box>

<Box position="fixed" bottom={{ base: 20, md: 4 }} right={{ base: 4, md: 20 }} zIndex={1000}>
  <BookmarkFloater />
</Box>


        <LargeWithAppLinksAndSocial />
        </BookmarkProvider>
        </SidebarProvider>
      </Providers>
    </motion.div>
    </SessionWrapper>
  );
};

export default AllLayout;