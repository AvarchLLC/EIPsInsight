'use client';
import './globals.css';
import { Inter } from 'next/font/google';
import { Providers } from './providers';
import { Box, ColorModeScript, Flex } from '@chakra-ui/react';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import Script from 'next/script';
import ConsentBanner from '@/components/ConsenstBanner';
import FloatingContributionIcon from '@/components/FloatingContributionIcon';
import SessionWrapper from '@/components/SessionWrapper';
import Sidebar from '@/components/ui/SideBar';
import { useSidebar } from '@/components/ui/SideBarContext';


const Navbar = dynamic(() => import('@/components/Navbar'), { ssr: false });
const Footer = dynamic(() => import('@/components/Footer'), { ssr: false });

const mont = Inter({ subsets: ['latin'] });

export default function AllLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { isCollapsed } = useSidebar();

  return (
    <SessionWrapper>
    <html lang="en">
      {/* <head>
      
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-R36R5NJFTW"></script>
        <script>
          {`window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-R36R5NJFTW');
          `}
        </script>
      </head> */}
      <body className={`${mont.className}`}>
        <ColorModeScript initialColorMode="dark" />
        <AnimatePresence>
          <motion.div
            key={pathname}
            initial="initialState"
            animate="animateState"
            exit="exitState"
            transition={{ duration: 0.75 }}
            variants={{
              initialState: {
                opacity: 0,
                clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)',
              },
              animateState: {
                opacity: 1,
                clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)',
              },
              exitState: {
                clipPath: 'polygon(50% 0, 50% 0, 50% 100%, 50% 100%)',
              },
            }}
            className="base-page-size"
          >
            <Providers>
 <Flex>
          <Sidebar />
      <Box
        ml={isCollapsed ? '60px' : '200px'} // Dynamically adjust margin
        transition="margin 0.2s ease"
        p={4}
      >
            <Navbar />
            <Suspense>{children}</Suspense>
            <ConsentBanner />
            <FloatingContributionIcon />
            <Footer />
          </Box>
        </Flex>
            </Providers>
          </motion.div>
        </AnimatePresence>
      </body>
    </html>
    </SessionWrapper>
  );
}