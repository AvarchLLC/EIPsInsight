// app/providers.tsx
'use client';
// blue, Editors Leaderboard, pink, black
import { CacheProvider } from '@chakra-ui/next-js';
import { ChakraProvider, ColorModeScript, extendTheme, StyleFunctionProps } from '@chakra-ui/react';
import { usePathname } from 'next/navigation';
import SessionWrapper from '@/components/SessionWrapper';
import { AuthLocalStorageInitializer } from '@/components/AuthLocalStorageInitializer';

const theme = extendTheme({
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: false,
  },
  styles: {
    global: (props: StyleFunctionProps) => {
      const pathname = usePathname(); // Get the current path
      const isHomePage = true;

      // Determine the background based on pathname and color mode
      const background = isHomePage
        ? (props.colorMode === 'light'
          // ? 'linear-gradient(90deg, #2bc0e4, #eaecc6, #89fffd)' // Sky blue to violet gradient
          ? 'linear-gradient(90deg, gray.50, gray.900)' // Sky blue to violet gradient
            : 'linear-gradient(90deg,rgba(10, 25, 47, 1),rgba(128, 128, 128, 1), rgba(0, 0, 0, 1))') // Dark gradient
        : undefined;

      return {
        body: {
          bg: background,
          backgroundSize: isHomePage ? '400% 400%' : undefined, // Apply background size only for home page
          animation: isHomePage ? 'gradient-animation 15s ease infinite' : undefined, // Apply animation only for home page
          color: props.colorMode === 'dark' ? 'whiteAlpha.900' : 'gray.800',
        },
        '@keyframes gradient-animation': {
          '0%': {
            backgroundPosition: '0% 50%',
          },
          '50%': {
            backgroundPosition: '100% 50%',
          },
          '100%': {
            backgroundPosition: '0% 50%',
          },
        },
      };
    },
  },
});

export function Providers({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  return (
    // <AuthLocalStorageInitializer>
    // {/* <SessionWrapper> */}
      <CacheProvider>
        <ChakraProvider theme={theme}>
          <ColorModeScript initialColorMode={theme.config.initialColorMode} />
          <AuthLocalStorageInitializer /> 
          {children}
        </ChakraProvider>
      </CacheProvider>
    // {/* </SessionWrapper> */}
    // </AuthLocalStorageInitializer>
  );
}
