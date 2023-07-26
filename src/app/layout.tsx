// app/providers.tsx
'use client'
import './globals.css'
import { Montserrat, DM_Sans, Inter } from 'next/font/google'
import { Providers } from './providers'
import { ColorModeScript } from '@chakra-ui/react';
import WithSubnavigation from '@/components/Nav';
import Nav from '@/components/Nav';
import LargeWithAppLinksAndSocial from '@/components/Footer';
import { Suspense } from 'react';
const mont = Inter({ subsets: ['latin'] })
import { motion, AnimatePresence } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = usePathname();
  return (
    <html lang="en">
      <AnimatePresence>
        
      <body  className={`${mont.className}`}>
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
        className="base-page-size"
      >
      {/* <ColorModeScript initialColorMode='light' /> */}
      <Providers>
        <WithSubnavigation/>

          {children}
        <LargeWithAppLinksAndSocial/>
        </Providers>
        </motion.div>
      </body>
      </AnimatePresence>
    </html>
  )
}