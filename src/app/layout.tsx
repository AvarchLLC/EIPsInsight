// app/providers.tsx
'use client'
import './globals.css'
import { Montserrat } from 'next/font/google'
import { Providers } from './providers'
import { ColorModeScript } from '@chakra-ui/react';
import WithSubnavigation from '@/components/Nav';
import Nav from '@/components/Nav';
import LargeWithAppLinksAndSocial from '@/components/Footer';
const mont = Montserrat({ subsets: ['latin'] })


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body  className={`${mont.className}`}>
      <ColorModeScript initialColorMode='light' />
      <Providers>
        <WithSubnavigation/>
          {children}
        <LargeWithAppLinksAndSocial/>
        </Providers>
      </body>
    </html>
  )
}