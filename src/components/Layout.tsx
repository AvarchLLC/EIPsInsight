import { Providers } from '@/app/providers'
import React from 'react'
import LargeWithAppLinksAndSocial from '@/components/Footer'
import WithSubnavigation from '@/components/Nav'
import { Box, ColorModeScript } from '@chakra-ui/react'
import { Montserrat } from 'next/font/google'
import '../app/globals.css'

const mont = Montserrat({ subsets: ['latin'] })
const AllLayout = ({
  children,
}: {
  children: React.ReactNode
}) => {
  return (
    <div className={`${mont.className}`}>
    <ColorModeScript initialColorMode='light' />
    <Providers>
      <WithSubnavigation/>
      
        {children}
      <LargeWithAppLinksAndSocial/>
      </Providers>
    </div>
  )
}

export default AllLayout