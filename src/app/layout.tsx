'use client';

import './globals.css';
import { Rajdhani } from 'next/font/google';
import { Providers } from './providers';
import { Box, ColorModeScript, Flex } from '@chakra-ui/react';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import ConsentBanner from '@/components/ConsenstBanner';
import FloatingContributionIcon from '@/components/FloatingContributionIcon';
import SessionWrapper from '@/components/SessionWrapper';
import { SidebarProvider } from '@/components/Sidebar/SideBarContext';
import { useSidebarStore } from '@/stores/useSidebarStore';

const Navbar = dynamic(() => import('@/components/Navbar'), { ssr: false });
const Footer = dynamic(() => import('@/components/Footer'), { ssr: false });

const mont = Rajdhani({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});


export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <html lang="en" className={mont.className}>
      <body>
        <ColorModeScript initialColorMode="dark" />
        <SessionWrapper>
          <AnimatePresence>
            <motion.div
              key={pathname}
              initial="initialState"
              animate="animateState"
              exit="exitState"
              transition={{ duration: 0.75 }}
              variants={{
                initialState: { opacity: 0, clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)' },
                animateState: { opacity: 1, clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)' },
                exitState: { clipPath: 'polygon(50% 0, 50% 0, 50% 100%, 50% 100%)' },
              }}
              style={{ width: '100%', height: '100%' }}
            >
              <Providers>
                <SidebarProvider>
                  <ClientContent>{children}</ClientContent>
                </SidebarProvider>
              </Providers>
            </motion.div>
          </AnimatePresence>
        </SessionWrapper>
      </body>
    </html>
  );
}

function ClientContent({ children }: { children: React.ReactNode }) {
  const isCollapsed = useSidebarStore((s) => s.isCollapsed);

  return (
    <Flex>
      <Box
        ml={isCollapsed ? "3rem" : "16rem"}
        transition="margin-left 0.3s ease"
        p={4}
      >
        <Suspense fallback={<div>Loading...</div>}>
          {children}
        </Suspense>
      </Box>
    </Flex>
  );
}

