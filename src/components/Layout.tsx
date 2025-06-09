"use client";
import { Providers } from "@/app/providers";
import React, { useEffect, useState } from "react";
import LargeWithAppLinksAndSocial from "@/components/Footer";
import Navbar from "@/components/Navbar";
import {
  Box,
  ColorModeScript,
  useBreakpointValue,
  Portal,
} from "@chakra-ui/react";
import { Rajdhani } from "next/font/google";
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
import SidebarConfigLoader from "./Sidebar/SideBarConfigLoader";
import { sidebarConfig } from "./Sidebar/slidebarConfig";
import { useSidebarStore } from "@/stores/useSidebarStore";
import AppSidebar from "./Sidebar/AppSidebar";

const mont = Rajdhani({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const AllLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const topLevelRoute =
    pathname === "/" ? "/" : `/${pathname?.split("/")?.[1]}`;
  const shouldShowSidebar = !!sidebarConfig[topLevelRoute];
  const router = usePathname();
  const { isCollapsed } = useSidebarStore();

  const [isMobile, setIsMobile] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    if (window.location.hash) {
      const id = window.location.hash.replace("#", "");
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 300); // delay ensures DOM is ready
    }
  }, []);

  useEffect(() => {
    // This ensures hydration is complete before rendering
    setIsHydrated(true);
    const mobile = window.matchMedia("(max-width: 768px)");
    setIsMobile(mobile.matches);

    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mobile.addEventListener("change", handler);
    return () => mobile.removeEventListener("change", handler);
  }, []);

  if (!isHydrated) return null;

  const sidebarVisible = shouldShowSidebar && !isMobile;
  const sidebarWidth = sidebarVisible ? (isCollapsed ? "3rem" : "16rem") : "0";

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
            <SidebarConfigLoader />

            {/* SIDEBAR */}
            {sidebarVisible && (
              <Portal>
                <Box
                  position="fixed"
                  top="0"
                  left="0"
                  zIndex={100000}
                  transition="width 0.2s ease"
                >
                  <AppSidebar />
                </Box>
              </Portal>
            )}

            {/* NAVBAR + CONTENT */}
            <Box
              ml={sidebarWidth}
              transition="margin 0.3s ease"
              // className="border border-red-800"
              w={{ base: "100%", md: "auto" }} // 👈 100% only on mobile
              maxW={{ base: "100vw", md: "none" }} // 👈 prevent overflow only on mobile
              overflowX={{ base: "hidden", md: "visible" }} // 👈 only restrict horizontal scroll on mobile
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
          </BookmarkProvider>
        </Providers>
      </motion.div>
    </SessionWrapper>
  );
};

export default AllLayout;
