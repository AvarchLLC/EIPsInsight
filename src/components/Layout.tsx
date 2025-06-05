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
import BookmarkFloater from "./BookmarkFloater";
import { SessionProvider } from "next-auth/react";
import SessionWrapper from "@/components/SessionWrapper";
import { AuthLocalStorageInitializer } from "./AuthLocalStorageInitializer";
import { BookmarkProvider } from "./BookmarkContext";
import { Portal } from "@chakra-ui/react";
import { SidebarProvider, useSidebar } from "./Sidebar/SideBarContext";
import SidebarConfigLoader from "./Sidebar/SideBarConfigLoader";
import { sidebarConfig } from "./Sidebar/slidebarConfig";
import Sidebar from "./Sidebar/SideBar";

const mont = Rajdhani({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

const AllLayout = ({ children }: { children: React.ReactNode }) => {
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
        transition={{ duration: 0.75 }}
        variants={{
          initialState: { opacity: 0, clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)" },
          animateState: { opacity: 1, clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)" },
          exitState: { clipPath: "polygon(50% 0, 50% 0, 50% 100%, 50% 100%)" },
        }}
        className={`${mont.className} base-page-size`}
      >
        <Head>
          <title>EIPs Insights</title>
          <link rel="icon" href="/eipFavicon.png" />
        </Head>

        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-R36R5NJFTW" />
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
              <LayoutWithSidebar shouldShowSidebar={shouldShowSidebar}>
                {children}
              </LayoutWithSidebar>
            </BookmarkProvider>
          </SidebarProvider>
        </Providers>
      </motion.div>
    </SessionWrapper>
  );
};

const LayoutWithSidebar = ({
  children,
  shouldShowSidebar,
}: {
  children: React.ReactNode;
  shouldShowSidebar: boolean;
}) => {
  const { isCollapsed } = useSidebar(); // ✅ NOW SAFE, inside SidebarProvider

  return (
    <>
      {shouldShowSidebar && (
        <Portal>
          <Box position="fixed" top="0" left="0" zIndex={100000}>
            <Sidebar/>
          </Box>
        </Portal>
      )}

      <Navbar />
      <AuthLocalStorageInitializer />
      {children}

      <Box position="fixed" bottom={4} right={4} zIndex={1000}>
        <FloatingContributionIcon />
      </Box>
      <Box position="fixed" bottom={{ base: 20, md: 4 }} right={{ base: 4, md: 20 }} zIndex={1000}>
        <BookmarkFloater />
      </Box>

      <LargeWithAppLinksAndSocial />
    </>
  );
};

export default AllLayout;
