'use client';

import { Providers } from "@/app/providers";
import React from "react";
import LargeWithAppLinksAndSocial from "@/components/Footer";
import Navbar from "@/components/Navbar";
import {
  Box,
  ColorModeScript,
  Flex,
} from "@chakra-ui/react";
import { Inter } from "next/font/google";
import "../app/globals.css";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import Head from "next/head";
import Script from "next/script";
import FloatingContributionIcon from "./FloatingContributionIcon";
import BookmarkFloater from "./BookmarkFloater";
import SessionWrapper from "@/components/SessionWrapper";
import { AuthLocalStorageInitializer } from "./AuthLocalStorageInitializer";
import { BookmarkProvider } from "./BookmarkContext";
import Sidebar from "@/components/Sidebar/SideBar";
import { SidebarProvider, useSidebar } from "./Sidebar/SideBarContext";
import SidebarConfigLoader from "./Sidebar/SideBarConfigLoader";
import { sidebarConfig } from "./Sidebar/slidebarConfig";

const mont = Inter({ subsets: ["latin"] });
const AllLayout = ({ children }: { children: React.ReactNode }) => {
  const router = usePathname();

  return (
    <SessionWrapper>
      <motion.div
        key={router}
        initial="initialState"
        animate="animateState"
        exit="exitState"
        transition={{ duration: 0.75 }}
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
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-R36R5NJFTW"
        />
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
          <BookmarkProvider>
            <SidebarProvider>
              <InnerLayout>{children}</InnerLayout>
            </SidebarProvider>
          </BookmarkProvider>
        </Providers>
      </motion.div>
    </SessionWrapper>
  );
};



const InnerLayout = ({ children }: { children: React.ReactNode }) => {
  const { isCollapsed } = useSidebar();
  const pathname = usePathname();

  // Extract top-level path like 'eips' from '/eips/123'
const topLevelRoute = pathname?.split("/")?.[1];
const shouldShowSidebar = topLevelRoute && !!sidebarConfig[`/${topLevelRoute}`];


  return (
    <Flex direction="row" minH="100vh">
      <SidebarConfigLoader />
      {shouldShowSidebar && <Sidebar />}

      <Box
        flex="1"
        ml={{
          base: 0,
          md: shouldShowSidebar ? (isCollapsed ? "60px" : "200px") : 0,
        }}
        transition="margin 0.2s ease"
      >
        <Navbar />
        <AuthLocalStorageInitializer />
        {children}

        <Box position="fixed" bottom={4} right={4} zIndex={1000}>
          <FloatingContributionIcon />
        </Box>

        <Box
          position="fixed"
          bottom={{ base: 20, md: 4 }}
          right={{ base: 4, md: 20 }}
          zIndex={1000}
        >
          <BookmarkFloater />
        </Box>

        <LargeWithAppLinksAndSocial />
      </Box>
    </Flex>
  );
};


export default AllLayout;
