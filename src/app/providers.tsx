// app/providers.tsx
'use client'

import { CacheProvider } from '@chakra-ui/next-js';
import {ChakraProvider, ColorModeScript} from '@chakra-ui/react';
import { extendTheme } from "@chakra-ui/react";


const theme = extendTheme({
    config: {
        initialColorMode: "light",
    },
});

export function Providers({ 
    children 
  }: { 
  children: React.ReactNode 
  }) {
  return (
    <CacheProvider>
      <ChakraProvider theme={theme}>
          <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        {children}
      </ChakraProvider>
    </CacheProvider>
  )
}