import { Providers } from "@/app/providers";
import React from "react";
import LargeWithAppLinksAndSocial from "@/components/Footer";
import { Box, ColorModeScript, Text, Link } from "@chakra-ui/react";
import { Inter, Poppins, Space_Grotesk } from "next/font/google";
import "../app/globals.css";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import Head from "next/head";
import Navbar from "./layout/Navbar";
import StarsCanvas from "./layout/StarCanvas";

// import Script from "next/script";

const mont = Space_Grotesk({ subsets: ["latin"], weight: "400" });
const AllLayout = ({ children }: { children: React.ReactNode }) => {
  const router = usePathname();
  return (
    <div className={`${mont.className} base-page-size relative`}>
      <Head>
        <title>EIPs Insights</title>
        <link rel="icon" href="/eipFavicon.png" />
      </Head>
      <ColorModeScript initialColorMode="dark" />
      <Providers>
        <StarsCanvas/>
        <Navbar />
        {children}
       
      </Providers>
    </div>
  );
};

export default AllLayout;