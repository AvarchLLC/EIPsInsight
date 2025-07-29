// // // 'use client';
// // // import './globals.css';
// // // import { Rajdhani } from 'next/font/google';
// // // import { Providers } from './providers';
// // // import { Box, ColorModeScript, Flex } from '@chakra-ui/react';
// // // import dynamic from 'next/dynamic';
// // // import { Suspense } from 'react';
// // // import { motion, AnimatePresence } from 'framer-motion';
// // // import { usePathname } from 'next/navigation';
// // // import Script from 'next/script';
// // // import ConsentBanner from '@/components/ConsenstBanner';
// // // import FloatingContributionIcon from '@/components/FloatingContributionIcon';
// // // import SessionWrapper from '@/components/SessionWrapper';
// // // import Sidebar from '@/components/Sidebar/SideBar';
// // // import { useSidebar } from '@/components/Sidebar/SideBarContext';


// // // const Navbar = dynamic(() => import('@/components/Navbar'), { ssr: false });
// // // const Footer = dynamic(() => import('@/components/Footer'), { ssr: false });

// // // const mont = Rajdhani({
// // //   subsets: ['latin'],
// // //   weight: ['400', '500', '600', '700'],
// // // });

// // // export default function AllLayout({
// // //   children,
// // // }: {
// // //   children: React.ReactNode;
// // // }) {
// // //   const pathname = usePathname();
// // //   const { isCollapsed } = useSidebar();

// // //   return (
// // //     <SessionWrapper>
// // //       <html lang="en">
// // //         {/* <head>
      
// // //         <script async src="https://www.googletagmanager.com/gtag/js?id=G-R36R5NJFTW"></script>
// // //         <script>
// // //           {`window.dataLayer = window.dataLayer || [];
// // //           function gtag(){dataLayer.push(arguments);}
// // //           gtag('js', new Date());

// // //           gtag('config', 'G-R36R5NJFTW');
// // //           `}
// // //         </script>
// // //       </head> */}
// // //         <body className={`${mont.className}`}>
// // //           <ColorModeScript initialColorMode="dark" />
// // //           <AnimatePresence>
// // //             <motion.div
// // //               key={pathname}
// // //               initial="initialState"
// // //               animate="animateState"
// // //               exit="exitState"
// // //               transition={{ duration: 0.75 }}
// // //               variants={{
// // //                 initialState: {
// // //                   opacity: 0,
// // //                   clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)',
// // //                 },
// // //                 animateState: {
// // //                   opacity: 1,
// // //                   clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)',
// // //                 },
// // //                 exitState: {
// // //                   clipPath: 'polygon(50% 0, 50% 0, 50% 100%, 50% 100%)',
// // //                 },
// // //               }}
// // //               className="base-page-size"
// // //             >
// // //               <Providers>
// // //                 <Flex>
// // //                   <Sidebar />
// // //                   <Box
// // //                     ml={isCollapsed ? '60px' : '200px'} // Dynamically adjust margin
// // //                     transition="margin 0.2s ease"
// // //                     p={4}
// // //                   >
// // //                     <Navbar />
// // //                     <Suspense>{children}</Suspense>
// // //                     <ConsentBanner />
// // //                     <FloatingContributionIcon />
// // //                     <Footer />
// // //                   </Box>
// // //                 </Flex>
// // //               </Providers>
// // //             </motion.div>
// // //           </AnimatePresence>
// // //         </body>
// // //       </html>
// // //     </SessionWrapper>
// // //   );
// // // }

// // // 'use client';

// // // import './globals.css';
// // // import { Rajdhani } from 'next/font/google';
// // // import { Providers } from './providers';
// // // import { Box, ColorModeScript, Flex } from '@chakra-ui/react';
// // // import dynamic from 'next/dynamic';
// // // import { Suspense } from 'react';
// // // import { motion, AnimatePresence } from 'framer-motion';
// // // import { usePathname } from 'next/navigation';
// // // import ConsentBanner from '@/components/ConsenstBanner';
// // // import FloatingContributionIcon from '@/components/FloatingContributionIcon';
// // // import SessionWrapper from '@/components/SessionWrapper';
// // // import Sidebar from '@/components/Sidebar/SideBar';
// // // import { SidebarProvider, useSidebar } from '@/components/Sidebar/SideBarContext';

// // // const Navbar = dynamic(() => import('@/components/Navbar'), { ssr: false });
// // // const Footer = dynamic(() => import('@/components/Footer'), { ssr: false });

// // // const mont = Rajdhani({
// // //   subsets: ['latin'],
// // //   weight: ['400', '500', '600', '700'],
// // // });

// // // export default function Layout({ children }: { children: React.ReactNode }) {
// // //   return (
// // //     <SidebarProvider>
// // //       <SessionWrapper>
// // //         <InnerLayout>{children}</InnerLayout>
// // //       </SessionWrapper>
// // //     </SidebarProvider>
// // //   );
// // // }

// // // function InnerLayout({ children }: { children: React.ReactNode }) {
// // //   const pathname = usePathname();
// // //   const { isCollapsed } = useSidebar();

// // //   return (
// // //     <body className={mont.className}>
// // //       <ColorModeScript initialColorMode="dark" />
// // //       <AnimatePresence>
// // //         <motion.div
// // //           key={pathname}
// // //           initial="initialState"
// // //           animate="animateState"
// // //           exit="exitState"
// // //           transition={{ duration: 0.75 }}
// // //           variants={{
// // //             initialState: {
// // //               opacity: 0,
// // //               clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)',
// // //             },
// // //             animateState: {
// // //               opacity: 1,
// // //               clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)',
// // //             },
// // //             exitState: {
// // //               clipPath: 'polygon(50% 0, 50% 0, 50% 100%, 50% 100%)',
// // //             },
// // //           }}
// // //           className="base-page-size"
// // //         >
// // //           <Providers>
// // //             <Flex>
// // //               <Sidebar />
// // //               <Box
// // //                 ml={isCollapsed ? '60px' : '200px'}
// // //                 transition="margin 0.2s ease"
// // //                 p={4}
// // //               >
// // //                 <Navbar />
// // //                 <Suspense>{children}</Suspense>
// // //                 <ConsentBanner />
// // //                 <FloatingContributionIcon />
// // //                 <Footer />
// // //               </Box>
// // //             </Flex>
// // //           </Providers>
// // //         </motion.div>
// // //       </AnimatePresence>
// // //     </body>
// // //   );
// // // }

// // 'use client';

// // import './globals.css';
// // import { Rajdhani } from 'next/font/google';
// // import { Providers } from './providers';
// // import { Box, ColorModeScript, Flex } from '@chakra-ui/react';
// // import dynamic from 'next/dynamic';
// // import { Suspense } from 'react';
// // import { motion, AnimatePresence } from 'framer-motion';
// // import { usePathname } from 'next/navigation';
// // import ConsentBanner from '@/components/ConsenstBanner';
// // import FloatingContributionIcon from '@/components/FloatingContributionIcon';
// // import SessionWrapper from '@/components/SessionWrapper';
// // import { SidebarProvider, useSidebar } from '@/components/Sidebar/SideBarContext'; // Import only the provider

// // const Navbar = dynamic(() => import('@/components/Navbar'), { ssr: false });
// // const Footer = dynamic(() => import('@/components/Footer'), { ssr: false });
// // const Sidebar = dynamic(() => import('@/components/Sidebar/SideBar'), { ssr: false }); // Dynamic import

// // const mont = Rajdhani({
// //   subsets: ['latin'],
// //   weight: ['400', '500', '600', '700'],
// // });

// // export default function Layout({ children }: { children: React.ReactNode }) {
// //   return (
// //     <SessionWrapper>
// //       <SidebarProvider>
// //         <InnerLayout>{children}</InnerLayout>
// //       </SidebarProvider>
// //     </SessionWrapper>
// //   );
// // }

// // function InnerLayout({ children }: { children: React.ReactNode }) {
// //   const pathname = usePathname();
  
// //   // Moved the useSidebar hook down to where it's actually needed
// //   return (
// //     <body className={mont.className}>
// //       <ColorModeScript initialColorMode="dark" />
// //       <AnimatePresence>
// //         <motion.div
// //           key={pathname}
// //           initial="initialState"
// //           animate="animateState"
// //           exit="exitState"
// //           transition={{ duration: 0.75 }}
// //           variants={{
// //             initialState: {
// //               opacity: 0,
// //               clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)',
// //             },
// //             animateState: {
// //               opacity: 1,
// //               clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)',
// //             },
// //             exitState: {
// //               clipPath: 'polygon(50% 0, 50% 0, 50% 100%, 50% 100%)',
// //             },
// //           }}
// //           className="base-page-size"
// //         >
// //           <Providers>
// //             <ClientLayout>{children}</ClientLayout>
// //           </Providers>
// //         </motion.div>
// //       </AnimatePresence>
// //     </body>
// //   );
// // }

// // // This client-only component will use the sidebar context
// // function ClientLayout({ children }: { children: React.ReactNode }) {
// //   const { isCollapsed } = useSidebar();
// //   const pathname = usePathname();

// //   return (
// //     <Flex>
// //       <Sidebar />
// //       <Box
// //         ml={isCollapsed ? '60px' : '200px'}
// //         transition="margin 0.2s ease"
// //         p={4}
// //       >
// //         <Navbar />
// //         <Suspense fallback={<div>Loading...</div>}>
// //           {children}
// //         </Suspense>
// //         <ConsentBanner />
// //         <FloatingContributionIcon />
// //         <Footer />
// //       </Box>
// //     </Flex>
// //   );
// // }

// 'use client';

// import './globals.css';
// import { Rajdhani } from 'next/font/google';
// import { Providers } from './providers';
// import { Box, ColorModeScript, Flex } from '@chakra-ui/react';
// import dynamic from 'next/dynamic';
// import { Suspense } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { usePathname } from 'next/navigation';
// import ConsentBanner from '@/components/ConsenstBanner';
// import FloatingContributionIcon from '@/components/FloatingContributionIcon';
// import SessionWrapper from '@/components/SessionWrapper';
// import { SidebarProvider, useSidebar } from '@/components/Sidebar/SideBarContext';

// const Navbar = dynamic(() => import('@/components/Navbar'), { ssr: false });
// const Footer = dynamic(() => import('@/components/Footer'), { ssr: false });
// const Sidebar = dynamic(() => import('@/components/Sidebar/SideBar'), { ssr: false });

// const mont = Rajdhani({
//   subsets: ['latin'],
//   weight: ['400', '500', '600', '700'],
// });

// export default function Layout({ children }: { children: React.ReactNode }) {
//   return (
//     <SessionWrapper>
//       <SidebarProvider>
//         <RootLayout>{children}</RootLayout>
//       </SidebarProvider>
//     </SessionWrapper>
//   );
// }

// function RootLayout({ children }: { children: React.ReactNode }) {
//   const pathname = usePathname();
  
//   return (
//     <body className={mont.className}>
//       <ColorModeScript initialColorMode="dark" />
//       <AnimatePresence>
//         <motion.div
//           key={pathname}
//           initial="initialState"
//           animate="animateState"
//           exit="exitState"
//           transition={{ duration: 0.75 }}
//           variants={{
//             initialState: {
//               opacity: 0,
//               clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)',
//             },
//             animateState: {
//               opacity: 1,
//               clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)',
//             },
//             exitState: {
//               clipPath: 'polygon(50% 0, 50% 0, 50% 100%, 50% 100%)',
//             },
//           }}
//           className="base-page-size"
//         >
//           <Providers>
//             <ClientContent>{children}</ClientContent>
//           </Providers>
//         </motion.div>
//       </AnimatePresence>
//     </body>
//   );
// }

// function ClientContent({ children }: { children: React.ReactNode }) {
//   const { isCollapsed } = useSidebar();

//   return (
//     <Flex>
//       <Sidebar />
//       <Box
//         ml={isCollapsed ? '60px' : '200px'}
//         transition="margin 0.2s ease"
//         p={4}
//       >
//         <Navbar />
//         <Suspense fallback={<div>Loading...</div>}>
//           {children}
//         </Suspense>
//         <ConsentBanner />
//         <FloatingContributionIcon />
//         <Footer />
//       </Box>
//     </Flex>
//   );
// }

'use client';

import './globals.css';
// import './blogs.css';
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
import { SidebarProvider, useSidebar } from '@/components/Sidebar/SideBarContext';
import { useSidebarStore } from '@/stores/useSidebarStore';
import AppSidebar from '@/components/Sidebar/AppSidebar';

const Navbar = dynamic(() => import('@/components/Navbar'), { ssr: false });
const Footer = dynamic(() => import('@/components/Footer'), { ssr: false });
const Sidebar = dynamic(() => import('@/components/Sidebar/SideBar'), { ssr: false });

const mont = Rajdhani({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SessionWrapper>
      <RootLayout>{children}</RootLayout>
    </SessionWrapper>
  );
}

function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  return (
    <body className={mont.className}>
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
          style={{ width: '100%', height: '100%' }}
        >
          <Providers>
            <SidebarProvider>
              <ClientContent>{children}</ClientContent>
            </SidebarProvider>
          </Providers>
        </motion.div>
      </AnimatePresence>
    </body>
  );
}

function ClientContent({ children }: { children: React.ReactNode }) {
  const isCollapsed = useSidebarStore((s) => s.isCollapsed);

  return (
    <Flex>
      {/* <AppSidebar /> */}
 <Box
        ml={isCollapsed ? "3rem" : "16rem"} // This creates space for the sidebar
        transition="margin-left 0.3s ease"
        p={4}
      >
        {/* <Navbar /> */}
        <Suspense fallback={<div>Loading...</div>}>
          {children}
        </Suspense>
        {/* <ConsentBanner />
        <FloatingContributionIcon /> */}
        {/* <Footer /> */}
      </Box>
    </Flex>
  );
}