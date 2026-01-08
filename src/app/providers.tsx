'use client';

import React from 'react';
import { CacheProvider } from '@chakra-ui/next-js';
import { ChakraProvider, ColorModeScript, extendTheme, StyleFunctionProps } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthLocalStorageInitializer } from '@/components/AuthLocalStorageInitializer';

const theme = extendTheme({
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: false,
  },
  styles: {

    global: (props: StyleFunctionProps) => ({
      body: {
        bg: props.colorMode === 'light' ? '#ffffff' : '#000000',
        color: props.colorMode === 'dark' ? 'whiteAlpha.900' : 'gray.800',
      },
    }),
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <CacheProvider>
      <ChakraProvider theme={theme}>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <AuthLocalStorageInitializer />
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      </ChakraProvider>
    </CacheProvider>
  );
} 
