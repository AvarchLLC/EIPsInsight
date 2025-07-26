// import React, { useState, useEffect, useLayoutEffect } from "react";
// import AllLayout from "@/components/Layout";
// import {
//   Box,
//   Spinner,
//   useColorModeValue,
//   Wrap,
//   WrapItem,
//   Text,
//   List,
//   UnorderedList,
//   ListItem,
//   Heading,
//   Flex,
//   Image,
//   SimpleGrid,
//   Badge,
//   AspectRatio,
//   Grid
// } from "@chakra-ui/react";
// import SlotCountdown from "@/components/SlotCountdown";
// import NLink from "next/link";
// import CatTable from "@/components/CatTable";
// import Header from "@/components/Header";
// import SearchBox from "@/components/SearchBox";
// import { CCardBody, CSmartTable } from "@coreui/react-pro";
// import { motion } from "framer-motion";
// import PectraTable from "@/components/PectraTable";
// import { Table, Thead, Tbody, Tr, Th, Td, Link,TableContainer } from "@chakra-ui/react";
// import { Carousel } from 'react-responsive-carousel';
// import 'react-responsive-carousel/lib/styles/carousel.min.css';
// // import Image from "next/image";
// import NetworkUpgradesChart from "@/components/NetworkUpgradesChart";
// import NetworkUpgradesChart2 from "@/components/NetworkUpgradesChart2";
// import { FaSyncAlt } from "react-icons/fa";
// import { useRouter } from "next/router";
// // import Graph from "@/components/NetworkUpgradesGraph";
// import Graph from "@/components/EIP3DWrapper"
// import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
// import { IconButton } from '@chakra-ui/react';
// import { useRef } from 'react';
// import UpgradesTimeline from "@/components/UpgradesTimeline";
// import { Card } from "@/components/pectraCards";
// import StatusGraph from "@/components/Statuschangesgraph";


// const sepolia_key=process.env.NEXT_PUBLIC_SEPOLIA_API as string;




// const All = () => {
//   const [selected, setSelected] = useState("Meta");
//   const [isDarkMode, setIsDarkMode] = useState(false);
//   const bg = useColorModeValue("#f6f6f7", "#171923");
//   const optionArr = [
//     "Meta",
//     "Informational",
//     "Core",
//     "Networking",
//     "Interface",
//     "ERC",
//     "RIP",
//   ];
//   const [isLoading, setIsLoading] = useState(true);
//   useEffect(() => {
//     if (bg === "#f6f6f7") {
//       setIsDarkMode(false);
//     } else {
//       setIsDarkMode(true);
//     }
//   });

//   // const containerRef = useRef(null);

//   const containerRef = useRef<HTMLDivElement>(null);

//   const scrollLeft = () => {
//     if (containerRef.current) {
//       containerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
//     }
//   };

//   const scrollRight = () => {
//     if (containerRef.current) {
//       containerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
//     }
//   };


//   const factorAuthor = (data: any) => {
//     let list = data.split(",");
//     for (let i = 0; i < list.length; i++) {
//       list[i] = list[i].split(" ");
//     }
//     if (list[list.length - 1][list[list.length - 1].length - 1] === "al.") {
//       list.pop();
//     }
//     return list;
//   };

//   // const cardBg = useColorModeValue("white", "gray.800");
//   // const textColor = useColorModeValue("gray.700", "gray.200");
//   // const accentColor = useColorModeValue("blue.500", "blue.300");


//   //  const Card = ({ image, title, content, link, tag }: { image?: string; title: string; content: string; link: string; tag?: string }) => (
//   //     <Box
//   //       bg={cardBg}
//   //       p={5}
//   //       borderRadius="xl"
//   //       boxShadow="md"
//   //       height="100%"
//   //       transition="all 0.2s ease"
//   //       _hover={{
//   //         transform: "translateY(-5px)",
//   //         boxShadow: "lg",
//   //       }}
//   //     >
//   //       {image && (
//   //         <AspectRatio ratio={16 / 9} mb={4} borderRadius="lg" overflow="hidden">
//   //           <Image src={image} alt={title} objectFit="cover" />
//   //         </AspectRatio>
//   //       )}
//   //       {tag && (
//   //         <Badge colorScheme="blue" mb={2}>
//   //           {tag}
//   //         </Badge>
//   //       )}
//   //       <Heading fontSize={{ base: "lg", md: "xl" }} mb={2} noOfLines={2}>
//   //         {title}
//   //       </Heading>
//   //       <Text fontSize="md" color={textColor} noOfLines={3} mb={4}>
//   //         {content}
//   //       </Text>
//   //       <Link
//   //         href={link}
//   //         color={accentColor}
//   //         fontWeight="semibold"
//   //         isExternal={!link.startsWith('/')}
//   //         display="inline-flex"
//   //         alignItems="center"
//   //       >
//   //         Read more →
//   //       </Link>
//   //     </Box>
//   //   );






//   const PectraPosts= [
//     {
//       image: "pectraimg1.jpg",
//       title: "Holesky Testnet Support Ends in September",
//       content: "Holesky testnet support ends in September as Ethereum transitions to Hoodi for improved validator testing & Pectra upgrade readiness.",
//       link: "https://etherworld.co/2025/03/19/holesky-testnet-support-ends-in-september/"
//     },
//     {
//       image: "pectraimg3.jpg",
//       title: "New Ethereum Testnet ‘Hoodi’ Announced for Pectra Testing",
//       content: "Hoodi is Ethereum’s new testnet, designed to replace Holesky with a mainnet-like environment for testing Pectra, validator exits, & staking operations.",
//       link: "https://etherworld.co/2025/03/14/new-ethereum-testnet-hoodi-announced-for-pectra-testing/"
//     },
//     {
//       image: "pectraimg4.jpg",
//       title: "How Holesky Finally Reached Stability",
//       content: "A sneak peek at how the Ethereum community came together to fix Holesky after two weeks of chaos.",
//       link: "https://etherworld.co/2025/03/11/how-holesky-finally-reached-stability/"
//     },
//     {
//       image: "pectraimg5.png",
//       title: "Holesky and Hoodi Testnet Updates",
//       content: "The Pectra testnet activation revealed issues in clients with deposit contract configurations changes on Ethereum testnets. While Sepolia's recovery was straightforward and the network has since fully recovered, Holesky experienced extensive inactivity leaks as pa...",
//       link: "https://blog.ethereum.org/2025/03/18/hoodi-holesky"
//     },
//     {
//       image: "pectraimg6.jpg",
//       title: "Sepolia Pectra Incident Update",
//       content: "A sneak peek at how the Ethereum community came together to fix Holesky after two weeks of chaos.",
//       link: "At 7:29 UTC today, on epoch 222464, the Pectra network upgrade went live on the Sepolia testnet. Unfortunately, an issue with Sepolia's permissioned deposit contract prevented many execution layer clients from including transactions in blocks."
//     },
// ]

//   const pectraData = [

//     {
//         eip: "2537",
//         title: "Precompile for BLS12-381 curve operations",
//         author: "Alex Vlasov (@shamatar), Kelly Olson (@ineffectualproperty), Alex Stokes (@ralexstokes), Antonio Sanso (@asanso)",
//         link: "https://eipsinsight.com/eips/eip-2537",
//         type:"Standards Track",
//         category:"Core",
//         discussion:"https://ethereum-magicians.org/t/eip2537-bls12-precompile-discussion-thread/4187"
//       },
//       {
//         eip: "2935",
//         title: "Serve historical block hashes from state",
//         author: "Vitalik Buterin (@vbuterin), Tomasz Stanczak (@tkstanczak), Guillaume Ballet (@gballet), Gajinder Singh (@g11tech), Tanishq Jasoria (@tanishqjasoria), Ignacio Hagopian (@jsign), Jochem Brouwer (@jochem-brouwer)",
//         link: "https://eipsinsight.com/eips/eip-2935",
//         type:"Standards Track",
//         category:"Core",
//         discussion:"https://ethereum-magicians.org/t/eip-2935-save-historical-block-hashes-in-state/4565"
//       },
//       {
//         eip: "6110",
//         title: "Supply validator deposits on chain",
//         author: "Mikhail Kalinin (@mkalinin), Danny Ryan (@djrtwo), Peter Davies (@petertdavies)",
//         link: "https://eipsinsight.com/eips/eip-6110",
//         type:"Standards Track",
//         category:"Core",
//         discussion:"https://ethereum-magicians.org/t/eip-6110-supply-validator-deposits-on-chain/12072"
//       },
//       {
//         eip: "7002",
//         title: "Execution layer triggerable withdrawals",
//         author: "Danny Ryan (@djrtwo), Mikhail Kalinin (@mkalinin), Ansgar Dietrichs (@adietrichs), Hsiao-Wei Wang (@hwwhww), lightclient (@lightclient)",
//         link: "https://eipsinsight.com/eips/eip-7002",
//         type:"Standards Track",
//         category:"Core",
//         discussion:"https://ethereum-magicians.org/t/eip-7002-execution-layer-triggerable-exits/14195"
//       },
//       {
//         eip: "7251",
//         title: "Increase the MAX_EFFECTIVE_BALANCE",
//         author: "mike (@michaelneuder), Francesco (@fradamt), dapplion (@dapplion), Mikhail (@mkalinin), Aditya (@adiasg), Justin (@justindrake), lightclient (@lightclient)",
//         link: "https://eipsinsight.com/eips/eip-2251",
//         type:"Standards Track",
//         category:"Core",
//         discussion:"https://ethereum-magicians.org/t/eip-7251-increase-the-max-effective-balance/15982"
//       },
//       {
//         eip: "7549",
//         title: "Move committee index outside Attestation",
//         author: "dapplion (@dapplion)",
//         link: "https://eipsinsight.com/eips/eip-7549",
//         type:"Standards Track",
//         category:"Core",
//         discussion:"https://ethereum-magicians.org/t/eip-7549-move-committee-index-outside-attestation/16390"
//       },

//       {
//         eip: "7685",
//         title: "General purpose execution layer requests",
//         author: "lightclient (@lightclient)",
//         link: "https://eipsinsight.com/eips/eip-7685",
//         type:"Standards Track",
//         category:"Core",
//         discussion:"https://ethereum-magicians.org/t/eip-7685-general-purpose-execution-layer-requests/19668"
//       },
//       {
//         eip: "7702",
//         title: "Set EOA account code",
//         author: "Vitalik Buterin (@vbuterin), Sam Wilson (@SamWilsn), Ansgar Dietrichs (@adietrichs), Matt Garnett (@lightclient)",
//         link: "https://eipsinsight.com/eips/eip-7702",
//         type:"Standards Track",
//         category:"Core",
//         discussion:"https://ethereum-magicians.org/t/eip-set-eoa-account-code-for-one-transaction/19923"
//       },
//       {
//         eip: "7691",
//         title: "Blob throughput increase",
//         author: "Parithosh Jayanthi (@parithosh), Toni Wahrstätter (@nerolation), Sam Calder-Mason (@samcm), Andrew Davis (@savid), Ansgar Dietrichs (@adietrichs)",
//         link: "https://eipsinsight.com/eips/eip-7691",
//         type:"Standards Track",
//         category:"Core",
//         discussion:"https://ethereum-magicians.org/t/eip-7691-blob-throughput-increase/19694"
//       },
//       {
//         eip: "7623",
//         title: "Increase calldata cost",
//         author: "Toni Wahrstätter (@nerolation), Vitalik Buterin (@vbuterin)",
//         link: "https://eipsinsight.com/eips/eip-7623",
//         type:"Standards Track",
//         category:"Core",
//         discussion:"https://ethereum-magicians.org/t/eip-7623-increase-calldata-cost/18647"
//       },
//       {
//           eip: "7840",
//           title: "Add blob schedule to EL config files",
//           author: "lightclient (@lightclient)",
//           link: "https://eipsinsight.com/eips/eip-7840",
//           type:"Standards Track",
//         category:"Core",
//         discussion:"https://ethereum-magicians.org/t/add-blob-schedule-to-execution-client-configuration-files/22182"
//       },
//       //   {
//       //     eip: "3670",
//       //     title: "EOF - Code Validation",
//       //     author: "Alex Beregszaszi (@axic), Andrei Maiboroda (@gumb0), Paweł Bylica (@chfast)",
//       //     link: "https://eipsinsight.com/eips/eip-3670",
//       //     type:"Standards Track",
//       //   category:"Core",
//       //   discussion:"https://ethereum-magicians.org/t/eip-3670-eof-code-validation/6693"
//       // },
//       //   {
//       //     eip: "4200",
//       //     title: "EOF - Static relative jumps",
//       //     author: "Alex Beregszaszi (@axic), Andrei Maiboroda (@gumb0), Paweł Bylica (@chfast)",
//       //     link: "https://eipsinsight.com/eips/eip-4200",
//       //     type:"Standards Track",
//       //   category:"Core",
//       //   discussion:"https://ethereum-magicians.org/t/eip-3920-static-relative-jumps/7108"
//       // },
//       //   {
//       //     eip: "4750",
//       //     title: "EOF - Functions",
//       //     author: "Andrei Maiboroda (@gumb0), Alex Beregszaszi (@axic), Paweł Bylica (@chfast)",
//       //     link: "https://eipsinsight.com/eips/eip-4750",
//       //     type:"Standards Track",
//       //   category:"Core",
//       //   discussion:"https://ethereum-magicians.org/t/eip-4750-eof-functions/8195"
//       // },
//       //   {
//       //     eip: "5450",
//       //     title: "EOF - Stack Validation",
//       //     author: "Andrei Maiboroda (@gumb0), Paweł Bylica (@chfast), Alex Beregszaszi (@axic), Danno Ferrin (@shemnon)",
//       //     link: "https://eipsinsight.com/eips/eip-5450",
//       //     type:"Standards Track",
//       //   category:"Core",
//       //   discussion:"https://ethereum-magicians.org/t/eip-5450-eof-stack-validation/10410"
//       // },
//       //   {
//       //     eip: "6206",
//       //     title: "EOF - JUMPF and non-returning functions",
//       //     author: "Andrei Maiboroda (@gumb0), Alex Beregszaszi (@axic), Paweł Bylica (@chfast), Matt Garnett (@lightclient)",
//       //     link: "https://eipsinsight.com/eips/eip-6206",
//       //     type:"Standards Track",
//       //   category:"Core",
//       //   discussion:"https://ethereum-magicians.org/t/eip-4750-eof-functions/8195"
//       // },
//       //   {
//       //     eip: "7069",
//       //     title: "Revamped CALL instructions",
//       //     author: "Alex Beregszaszi (@axic), Paweł Bylica (@chfast), Danno Ferrin (@shemnon), Andrei Maiboroda (@gumb0), Charles Cooper (@charles-cooper)",
//       //     link: "https://eipsinsight.com/eips/eip-7069",
//       //     type:"Standards Track",
//       //   category:"Core",
//       //   discussion:"https://ethereum-magicians.org/t/eip-revamped-call-instructions/14432"
//       // },
//       //   {
//       //     eip: "7480",
//       //     title: "EOF - Data section access instructions",
//       //     author: "Andrei Maiboroda (@gumb0), Alex Beregszaszi (@axic), Paweł Bylica (@chfast)",
//       //     link: "https://eipsinsight.com/eips/eip-7480",
//       //     type:"Standards Track",
//       //   category:"Core",
//       //   discussion:"https://ethereum-magicians.org/t/eip-7480-eof-data-instructions/15414"
//       // },
//       //   {
//       //     eip: "7620",
//       //     title: "EOF Contract Creation",
//       //     author: "Alex Beregszaszi (@axic), Paweł Bylica (@chfast), Andrei Maiboroda (@gumb0), Piotr Dobaczewski (@pdobacz)",
//       //     link: "https://eipsinsight.com/eips/eip-7620",
//       //     type:"Standards Track",
//       //   category:"Core",
//       //   discussion:"https://ethereum-magicians.org/t/eip-7620-eof-contract-creation-instructions/18625"
//       // },
//       //   {
//       //     eip: "7698",
//       //     title: "EOF - Creation transaction",
//       //     author: "Piotr Dobaczewski (@pdobacz), Andrei Maiboroda (@gumb0), Paweł Bylica (@chfast), Alex Beregszaszi (@axic)",
//       //     link: "https://eipsinsight.com/eips/eip-7698",
//       //     type:"Standards Track",
//       //   category:"Core",
//       //   discussion:"https://ethereum-magicians.org/t/eip-7698-eof-creation-transaction/19784"
//       // },
//   ];



//   const router = useRouter();

//     const scrollToHash = () => {
//       const hash = window.location.hash;
//       if (hash) {
//         const element = document.getElementById(hash.slice(1));
//         if (element) {
//           element.scrollIntoView({ behavior: "smooth" });
//         }
//       }
//     };

//     useEffect(() => {
//       if (!isLoading) {
//         scrollToHash();
//       }
//     }, [isLoading]);

//     useLayoutEffect(() => {
//       router.events.on("routeChangeComplete", scrollToHash);
//       return () => {
//         router.events.off("routeChangeComplete", scrollToHash);
//       };
//     }, [router]);



//   return (
//     <>
//       <AllLayout>
//       <motion.div
//             initial={{ opacity: 0, y: -20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.8 }}
//           >
//         <Box
//           paddingBottom={{ lg: "10", sm: "10", base: "10" }}
//           marginX={{ lg: "20", md: "2", sm: "2", base: "2" }}
//           paddingX={{ lg: "5", md: "5", sm: "5", base: "5" }}
//           marginTop={{ lg: "10", md: "5", sm: "5", base: "5" }}
//         >
//        <Box>
//        <Text
//            as={motion.div}
//            initial={{ opacity: 0, y: -20 }}
//            animate={{ opacity: 1, y: 0 }}
//            transition={{ duration: 0.5 } as any}
//            fontSize={{base: "2xl",md:"4xl", lg: "6xl"}}
//            fontWeight={{ base: "extrabold", md: "bold", lg: "bold" }}
//            color="#30A0E0"
//           >
//             Ethereum Network Upgrades
//           </Text>

//         <br/>
//         {/* <br/> */}
//         {/* <SlotCountdown/>
//         <br/> */}
//         <Text
//           as={motion.div}
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5 } as any}
//           fontSize={{base: "2xl",md:"2xl", lg: "4xl"}}
//           fontWeight="bold"
//           color="#30A0E0"
//           mt={2}
//           id="pectra"
//         >
//           PECTRA
//         </Text>

//         <Box id="NetworkUpgrades" mt={2}>
//           <UpgradesTimeline/>
//         </Box>


//         <Flex
//            direction={{ base: "column", md: "row" }}
//            align="flex-start"
//            gap={{ base: 4, md: 6 }}
//            width="100%"
//            justify="space-between"
//            wrap="wrap" 
//         >
//           {/* Text Section */}
//           <Text
//             flex={{ base: "1 1 auto", md: "3" }} // Text takes 3/5 width on larger screens
//             fontSize={{ base: "md", md: "lg", lg: "2xl" }}
//             textAlign="justify"
//             lineHeight="1.6"

//           >
//             Ethereum developers are moving toward the next major network upgrade, Prague and Electra, 
//             collectively known as{" "}
//             <NLink href="https://eipsinsight.com/eips/eip-7600">
//               <Text as="span" color="blue.500" textDecor="underline">
//                 Pectra
//               </Text>
//             </NLink>. This upgrade will involve significant changes to both the{" "}
//             <NLink href="https://www.youtube.com/watch?v=nJ57mkttCH0">
//               <Text as="span" color="blue.500" textDecor="underline">
//                 Execution and Consensus layers
//               </Text>
//             </NLink>{" "} 
//             on the mainnet. Given the complexities of testing and the scope of changes, including 11{" "}
//             <NLink href="https://www.youtube.com/watch?v=AyidVR6X6J8">
//               <Text as="span" color="blue.500" textDecor="underline">
//                 Ethereum Improvement Proposals (EIPs)
//               </Text>
//             </NLink>, 
//             the developers recently decided to reduce the scope of the Pectra upgrade. Some EIPs have 
//             now been shifted to the upcoming{" "}
//             <NLink href="https://eipsinsight.com/eips/eip-7600">
//               <Text as="span" color="blue.500" textDecor="underline">
//                 Fusaka
//               </Text>
//             </NLink>(a combination of Fulu and Osaka) upgrade. Currently, the testing team is working on Pectra{" "}
//             <NLink href="https://notes.ethereum.org/@ethpandaops/pectra-devnet-6">
//               <Text as="span" color="blue.500" textDecor="underline">
//                 Devnet 6
//               </Text>
//             </NLink>.
//           </Text>

//           {/* Cards Section */}
//           {/* <Flex
//               flex={{ base: "1 1 auto", md: "1" }} // Cards take 2/5 width on larger screens
//               wrap="wrap" // Ensure cards can wrap onto new rows if needed
//               justify="flex-start" // Align cards to the left
//               gap={4} // Add spacing between cards
//               width="100%" // Ensure cards section takes up full width
//               maxHeight="300px" // Limit the height of the container
//               overflowY="auto" // Make the container vertically scrollable
//               overflowX="hidden" // Prevent horizontal scrolling
//               p={4} // Add padding for better spacing inside the scroll area
//               sx={{
//                 "&::-webkit-scrollbar": {
//                   width: "8px", // Width of the scrollbar
//                 },
//                 "&::-webkit-scrollbar-thumb": {
//                   background: "#3182ce", // Color of the scrollbar thumb
//                   borderRadius: "4px", // Rounded edges for the thumb
//                 },
//                 "&::-webkit-scrollbar-thumb:hover": {
//                   background: "#2b6cb0", // Darker color on hover
//                 },
//                 "&::-webkit-scrollbar-track": {
//                   background: "#edf2f7", // Light background for the track
//                 },
//               }}
//             >
//               {PectraPosts.map((pectra, index) => (
//                 <Card
//                   key={index}
//                   image={pectra.image}
//                   title={pectra.title}
//                   content={pectra.content}
//                   link={pectra.link}
//                 />
//               ))}
//             </Flex> */}



//           </Flex>

//           <Flex position="relative" width="100%" align="center">
//   {/* Left arrow with proper spacing */}
//   <IconButton
//     aria-label="Scroll left"
//     icon={<ChevronLeftIcon />}
//     position="absolute"
//     left={0}
//     zIndex={2}  // Higher z-index to ensure it's above content
//     onClick={scrollLeft}
//     bg="#30A0E0"
//     boxShadow="md"
//     _hover={{ bg: "gray.100" }}
//   />

//   {/* Cards container with hidden scrollbar */}
//   <Flex
//   ref={containerRef}
//   flex="1"
//   overflow="hidden"
//   py={4}
//   pl={6}  // Reduced left padding from 10 to 6 for left shift
//   pr={10}
//   _hover={{
//     overflowX: "auto",
//   }}
//   sx={{
//     scrollbarWidth: "none",
//     "&::-webkit-scrollbar": {
//       display: "none",
//     },
//     "& > div": {
//       paddingRight: "40px",
//     },
//   }}
// >
//   <Flex 
//     gap={6} 
//     flexWrap="nowrap"
//     ml={-2}  // Negative margin to pull content left
//   >
//     {PectraPosts.map((pectra, index) => (
//       <Box 
//         key={index}
//         flex="0 0 auto"
//         width={{ base: "280px", md: "320px" }}
//         // Adjusted margins for arrow clearance
//         ml={index === 0 ? 4 : 0}  // Increased from 2 to 4 to compensate for negative margin
//         mr={index === PectraPosts.length - 1 ? 2 : 0}
//       >
//         <Card
//           image={pectra.image}
//           title={pectra.title}
//           content={pectra.content}
//           link={pectra.link}
//         />
//       </Box>
//     ))}
//   </Flex>
// </Flex>

//   {/* Right arrow with proper spacing */}
//   <IconButton
//     aria-label="Scroll right"
//     icon={<ChevronRightIcon />}
//     position="absolute"
//     right={0}
//     zIndex={2}  // Higher z-index
//     onClick={scrollRight}
//     bg="#30A0E0"
//     boxShadow="md"
//     _hover={{ bg: "gray.100" }}
//   />
// </Flex>






// <Box
//   id="NetworkUpgradesChart"
//   mt={2}
//   mb={2}
//   px={{ base: 2, md: 4, lg: 6 }}
//   width="100%"
//   maxWidth="100vw"
//   overflowX="auto"
// >
//   <Text
//     fontSize={{ base: '2xl', md: '3xl', lg: '3xl' }}
//     fontWeight="bold"
//     color="#30A0E0"
//     mt={2}
//     textAlign="center"

//   >
//     Network Upgrades and EIPs Relationship Graph
//   </Text>
//   <br />
//   <Flex justifyContent="center" alignItems="center" width="100%">
//     <Box width="100%" maxWidth="100%" overflow="hidden">
//       <Graph />
//     </Box>
//   </Flex>
//   <br />
// </Box>


//         <Box id="NetworkUpgrades" mt={2}>
//           <NetworkUpgradesChart/>
//         </Box>
//         <br/>
//         <Box id="AuthorContributions">
//           <NetworkUpgradesChart2/>
//         </Box>


//       {/* <Grid
//       templateColumns={{ base: "1fr", md: "1fr 1fr" }} // Stack vertically on small screens
//       gap={6}
//       p={6}
//     >

//       <Box>
//         <Text
//           as={motion.div}
//           initial={{ opacity: 0, y: -10 }}
//           animate={{ opacity: 1, y: 0 }}
//           fontSize={{ base: "xl", md: "2xl", lg: "4xl" }}
//           fontWeight="bold"
//           color="#30A0E0"
//         >
//           Devnets & Testnets
//         </Text>

//         <TableContainer style={{ maxHeight: "400px", overflowY: "auto" }}>
//       <Table
//         variant="striped"
//         colorScheme="gray"
//         size="lg"
//         mt={4}
//         style={{
//           border: "1px solid black",
//           borderRadius: "md",
//           boxShadow: "md",
//           width: "100%",
//           tableLayout: "fixed", // Ensures consistent column width
//         }}
//       >
//         <Thead>
//           <Tr style={{ border: "1px solid black" }}>
//             <Th style={{ border: "1px solid black" }}>Date</Th>
//             <Th style={{ border: "1px solid black" }}>Devnet Spec</Th>
//           </Tr>
//         </Thead>
//         <Tbody>
//           {[
//             {
//               date: "November 2024",
//               specLink: "https://notes.ethereum.org/@ethpandaops/pectra-devnet-5",
//               specText: "Pectra Devnet 5 (Specs)",
//             },
//             {
//               date: "October 2024",
//               specLink: "https://notes.ethereum.org/@ethpandaops/pectra-devnet-4",
//               specText: "Pectra Devnet 4 (Specs)",
//             },
//             {
//               date: "August 2024",
//               specLink: "https://notes.ethereum.org/@ethpandaops/pectra-devnet-3",
//               specText: "Pectra Devnet 3 (Specs)",
//             },
//             {
//               date: "August 2024",
//               specLink: "https://github.com/ethereum/execution-spec-tests/releases/tag/pectra-devnet-3%40v1.0.0",
//               specText: "Tests Specs",
//             },
//             {
//               date: "July 2024",
//               specLink: "https://notes.ethereum.org/@ethpandaops/pectra-devnet-2",
//               specText: "Pectra Devnet 2 (Specs)",
//             },
//             {
//               date: "June 2024",
//               specLink: "https://notes.ethereum.org/@ethpandaops/pectra-devnet-1",
//               specText: "Pectra Devnet 1 (Specs)",
//             },
//             {
//               date: "May 2024",
//               specLink: "https://notes.ethereum.org/@ethpandaops/pectra-devnet-0",
//               specText: "Pectra Devnet 0 (Specs)",
//             },
//           ].map((item, index) => (
//             <Tr style={{ border: "1px solid black" }} key={index}>
//               <Td style={{ border: "1px solid black" }}>{item.date}</Td>
//               <Td style={{ border: "1px solid black" }}>
//                 <Link href={item.specLink} color="blue.500" textDecor="underline" isExternal>
//                   {item.specText}
//                 </Link>

//               </Td>
//             </Tr>
//           ))}
//         </Tbody>
//       </Table>
//     </TableContainer>


//   </Box>


//   <Box
//     border="2px solid" // Adds a solid border
//     borderColor="blue.500" // Border color
//     borderRadius="lg" // Rounded corners
//     display="flex"
//     justifyContent="center" // Centers the video horizontally
//     alignItems="center" // Centers the video vertically
//     width="100%" // Full width to fit the grid cell
//     height="100%" // Full height to fit the grid cell
//     padding="4" // Padding around the iframe
//     // backgroundColor="gray.800" // Background color for the box
//   >
//     <Box
//       position="relative"
//       width="100%"
//       height="0"
//       paddingBottom="56.25%" // Aspect ratio for a 16:9 video
//     >
//       <iframe
//         width="100%"
//         height="100%"
//         src="https://www.youtube.com/embed/videoseries?list=PL4cwHXAawZxqOHV_F40AJbzcl8b6tG8xw"
//         title="YouTube video"
//         frameBorder="0"
//         allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//         allowFullScreen
//         style={{
//           position: "absolute", // Keeps the video inside the box
//           top: 0,
//           left: 0,
//         }}
//       ></iframe>
//     </Box>
//   </Box>
// </Grid> */}


//         </Box>


//           {
//             <Box id="pectra-table" display={{ base: "none", md: "block" }}>
//               <PectraTable PectraData={pectraData}/>
//               <br/>
//               {/* <Text
//            as={motion.div}
//            initial={{ opacity: 0, y: -20 }}
//            animate={{ opacity: 1, y: 0 }}
//            transition={{ duration: 0.5 } as any}
//            fontSize={{base: "4xl",md:"4xl", lg: "6xl"}}
//            fontWeight="bold"
//            color="#30A0E0"
//           >
//             Related Videos
//           </Text> */}
//             </Box>
//           }
//         </Box>

//         {/* <Box display={{ base: "none", md: "block" }} className="w-3/4 mx-auto" id="carousel-section"> 

//         <Carousel 
//   showThumbs={false} 
//   autoPlay 
//   infiniteLoop 
//   showStatus={false} 
//   showIndicators={false} 
//   centerMode 
//   centerSlidePercentage={40}
//   renderArrowPrev={(onClickHandler, hasPrev, label) =>
//     hasPrev && (
//       <button
//         type="button"

//         onClick={onClickHandler}
//         title={label}
//         style={{
//           position: 'absolute',
//           zIndex: 2,
//           top: 'calc(50% - 15px)',
//           left: '0',
//           width: '30px',
//           height: '30px',
//           background: 'rgba(0, 0, 0, 0.5)',
//           border: 'none',
//           color: 'white',
//           fontSize: '20px',
//           cursor: 'pointer',
//           borderRadius: '50%',
//           display: 'flex',
//           justifyContent: 'center',
//           alignItems: 'center',
//           opacity: 1
//         }}
//       >
//         &#10094;
//       </button>
//     )
//   }
//   renderArrowNext={(onClickHandler, hasNext, label) =>
//     hasNext && (
//       <button
//         type="button"
//         onClick={onClickHandler}
//         title={label}
//         style={{
//           position: 'absolute',
//           zIndex: 2,
//           top: 'calc(50% - 15px)',
//           right: '0',
//           width: '30px',
//           height: '30px',
//           background: 'rgba(0, 0, 0, 0.5)',
//           border: 'none',
//           color: 'white',
//           fontSize: '20px',
//           cursor: 'pointer',
//           borderRadius: '50%',
//           display: 'flex',
//           justifyContent: 'center',
//           alignItems: 'center',
//           opacity: 1
//         }}
//       >
//         &#10095;
//       </button>
//     )
//   }
// >
//   <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '350px', margin: '0 10px' }}>
//     <a
//       href="https://www.youtube.com/watch?v=YuEA-jE2Z8c&list=PLZmWIkdMcWY5ymDvUCjRLjWGIpCsn8yV8&index=2&t=201s"
//       target="_blank"
//       style={{ textDecoration: 'none' }}
//     >
//       <iframe
//         style={{ width: '500px', height: '300px', border: 'none' }}
//         src="https://www.youtube.com/embed/YuEA-jE2Z8c"
//         title="Blog 1"
//         allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//         allowFullScreen
//       ></iframe>
//     </a>
//   </div>

//   <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '350px',  margin: '0 10px'}}>
//     <a
//       href="https://www.youtube.com/watch?v=pyfKM_hOKaM&list=PLZmWIkdMcWY4IsrNbjEO3qfREoV-OX4zF&index=22&t=218s"
//       target="_blank"
//       style={{ textDecoration: 'none' }}
//     >
//       <iframe
//         style={{ width: '500px', height: '300px', border: 'none' }}
//         src="https://www.youtube.com/embed/pyfKM_hOKaM"
//         title="Blog 2"
//         allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//         allowFullScreen
//       ></iframe>
//     </a>
//   </div>

//   <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '350px', margin: '0 10px'}}>
//     <a
//       href="https://www.youtube.com/playlist?list=PL4cwHXAawZxpnKFDl1KzGOKqwux5JaLlv"
//       target="_blank"
//       style={{ textDecoration: 'none' }}
//     >
//       <iframe
//         style={{ width: '500px', height: '300px', border: 'none' }}
//         src="https://www.youtube.com/embed/videoseries?list=PL4cwHXAawZxpnKFDl1KzGOKqwux5JaLlv"
//         title="Playlist 1"
//         allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//         allowFullScreen
//       ></iframe>
//     </a>
//   </div>

//   <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '350px', margin: '0 10px' }}>
//     <a
//       href="https://www.youtube.com/playlist?list=PL4cwHXAawZxpok0smGmq-dFGVHQzW84a2"
//       target="_blank"
//       style={{ textDecoration: 'none' }}
//     >
//       <iframe
//         style={{ width: '500px',  height: '300px', border: 'none' }}
//         src="https://www.youtube.com/embed/videoseries?list=PL4cwHXAawZxpok0smGmq-dFGVHQzW84a2"
//         title="Playlist 2"
//         allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//         allowFullScreen
//       ></iframe>
//     </a>
//   </div>

//   <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '350px', margin: '0 10px' }}>
//     <a
//       href="https://www.youtube.com/watch?v=nJ57mkttCH0"
//       target="_blank"
//       style={{ textDecoration: 'none' }}
//     >
//       <iframe
//         style={{ width: '500px', height: '300px', border: 'none' }}
//         src="https://www.youtube.com/embed/nJ57mkttCH0"
//         title="Video 1"
//         allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//         allowFullScreen
//       ></iframe>
//     </a>
//   </div>

//   <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '350px', margin: '0 10px' }}>
//     <a
//       href="https://youtu.be/0tEcFa9J5TM"
//       target="_blank"
//       style={{ textDecoration: 'none' }}
//     >
//       <iframe
//         style={{ width: '500px',  height: '300px', border: 'none' }}
//         src="https://www.youtube.com/embed/0tEcFa9J5TM"
//         title="Video 2"
//         allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//         allowFullScreen
//       ></iframe>
//     </a>
//   </div>

//   <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '350px', margin: '0 10px' }}>
//     <a
//       href="https://youtu.be/sIr6XX8yR8o"
//       target="_blank"
//       style={{ textDecoration: 'none' }}
//     >
//       <iframe
//         style={{ width: '500px',  height: '300px', border: 'none' }}
//         src="https://www.youtube.com/embed/sIr6XX8yR8o"
//         title="Video 3"
//         allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//         allowFullScreen
//       ></iframe>
//     </a>
//   </div>

//   <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '350px', margin: '0 10px' }}>
//     <a
//       href="https://youtu.be/B69btfxKVks"
//       target="_blank"
//       style={{ textDecoration: 'none' }}
//     >
//       <iframe
//         style={{ width: '500px',  height: '300px', border: 'none' }}
//         src="https://www.youtube.com/embed/B69btfxKVks"
//         title="Video 4"
//         allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//         allowFullScreen
//       ></iframe>
//     </a>
//   </div>
// </Carousel>


// <br/>

// </Box> */}

//         </motion.div>
//       </AllLayout>
//     </>
//   );
// };

// export default All;

'use client';
import React, { useState, useEffect, useLayoutEffect } from "react";
import AllLayout from "@/components/Layout";
import {
  Box,
  Spinner,
  useColorModeValue,
  Wrap,
  WrapItem,
  Text,
  List,
  UnorderedList,
  ListItem,
  Heading,
  Flex,
  Image,
  SimpleGrid,
  Badge,
  AspectRatio,
  Grid,
  GridItem
} from "@chakra-ui/react";
import SlotCountdown from "@/components/SlotCountdown";
import NLink from "next/link";
import CatTable from "@/components/CatTable";
import Header from "@/components/Header";
import SearchBox from "@/components/SearchBox";
import { CCardBody, CSmartTable } from "@coreui/react-pro";
import { motion } from "framer-motion";
import PectraTable from "@/components/PectraTable";
import { Table, Thead, Tbody, Tr, Th, Td, Link, TableContainer } from "@chakra-ui/react";
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import NetworkUpgradesChart from "@/components/NetworkUpgradesChart";
import NetworkUpgradesChart2 from "@/components/NetworkUpgradesChart2";
import { FaSyncAlt } from "react-icons/fa";
import { useRouter } from "next/router";
import Graph from "@/components/EIP3DWrapper"
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { IconButton } from '@chakra-ui/react';
import { useRef } from 'react';
import UpgradesTimeline from "@/components/UpgradesTimeline";
import { Card } from "@/components/pectraCards";
import StatusGraph from "@/components/Statuschangesgraph";
import { useSidebar } from '@/components/Sidebar/SideBarContext';
import { useScrollSpy } from "@/hooks/useScrollSpy";
import FeedbackWidget from "@/components/FeedbackWidget";

const sepolia_key = process.env.NEXT_PUBLIC_SEPOLIA_API as string;

const All = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const bg = useColorModeValue("#f6f6f7", "#171923");
  const [selectedOption, setSelectedOption] = useState<'pectra' | 'fusaka'>('fusaka');
  const { selectedUpgrade, setSelectedUpgrade } = useSidebar();
  // const selectedOption = selectedUpgrade;       // just alias so rest of code works
  // const setSelectedOption = setSelectedUpgrade;
  const optionArr = [
    "Meta",
    "Informational",
    "Core",
    "Networking",
    "Interface",
    "ERC",
    "RIP",
  ];
  const [isLoading, setIsLoading] = useState(true);
  const [isMediumOrLarger, setIsMediumOrLarger] = useState(false);
  const router = useRouter();
const { selected } = router.query;


// 🔄 Sync dropdown state with URL query param
useEffect(() => {
  if (selected === 'pectra' || selected === 'fusaka') {
    setSelectedOption(selected);
  }
}, [selected]);

// 🔼 Also update the URL when dropdown changes
const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  const value = e.target.value as 'pectra' | 'fusaka';
  setSelectedOption(value);
  router.push(`/upgrade?selected=${value}#${value}`, undefined, { shallow: true });
};


  useEffect(() => {
    const checkWidth = () => {
      setIsMediumOrLarger(window.innerWidth >= 768);
    };

    checkWidth(); // initial check
    window.addEventListener('resize', checkWidth);

    return () => {
      window.removeEventListener('resize', checkWidth);
    };
  }, []);


  useEffect(() => {
    if (bg === "#f6f6f7") {
      setIsDarkMode(false);
    } else {
      setIsDarkMode(true);
    }
  });

  const containerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  const factorAuthor = (data: any) => {
    let list = data.split(",");
    for (let i = 0; i < list?.length; i++) {
      list[i] = list[i].split(" ");
    }
    if (list[list?.length - 1][list[list?.length - 1]?.length - 1] === "al.") {
      list.pop();
    }
    return list;
  };


  const FusakaPosts = [
    {
      image: "fusakaimg6.jpg",
      title: "A Closer Look at What’s Coming in Fusaka Devnet 2",
      content: "Ethereum’s upcoming Fusaka upgrade is nearing its final testing phase with Devnet 2, a crucial pre-release environment that determines what features make it to mainnet. ",
      link: "https://etherworld.co/2025/06/09/a-closer-look-at-whats-coming-in-fusaka-devnet-2/",
    },
    {
      image: "fusakaimg1.jpg",
      title: "Ethereum Targets June 1 for Sepolia History Expiry",
      content: "Ethereum developers have tentatively scheduled June 1, 2025, as the date to begin public testing of history expiry on the Sepolia testnet",
      link: "https://etherworld.co/2025/05/13/ethereum-targets-june-1-for-sepolia-history-expiry/",
    },
    {
      image: "fusakaimg2.jpg",
      title: "Ethereum Fusaka Devnet 0 Coming Soon",
      content: "In the All Core Devs Testing (ACDT) call held on May 12, 2025, Ethereum developers reached a consensus to launch Devnet 0 as the initial testnet for the upcoming Fusaka upgrade.",
      link: "https://etherworld.co/2025/05/13/ethereum-fusaka-devnet-0-coming-soon/",
    },
    {
      image: "fusakaimg3.jpg",
      title: "Will Fusaka Be Ready in Time? Vitalik's 2025 Vision",
      content: "Ethereum’s future hinges on Fusaka’s readiness! Can it deliver the scalability Vitalik envisions by 2025, or will challenges persist?",
      link: "https://etherworld.co/2025/03/05/will-fusaka-be-ready-in-time-vitaliks-2025-vision/",
    },
    {
      image: "fusakaimg4.jpg",
      title: "Highlights of Ethereum's All Core Devs Meeting (ACDE) #205",
      content: "Pectra Updates, Fusaka Fork Updates, EOF Implementation & Testnet Progress, Max Blob Flag & Validator Node Requirements",
      link: "https://etherworld.co/2025/02/14/highlights-of-ethereums-all-core-devs-meeting-acde-205/",
    },
    {
      image: "fusakaimg5.jpg",
      title: "Glamsterdam: The Next Upgrade After Fusaka",
      content: "Glamsterdam merges the star Gloas with Amsterdam for Ethereum’s next upgrade. Explore its origins, naming traditions, and why Devconnect cities might shape future upgrade names.",
      link: "https://etherworld.co/2025/01/09/glamsterdam-the-next-upgrade-after-fusaka/",
    },
  ];
  const GlamsterdamPosts = [
    {
      image: "fusakaimg5.jpg",
      title: "Glamsterdam: The Next Upgrade After Fusaka",
      content: "Glamsterdam merges the star Gloas with Amsterdam for Ethereum’s next upgrade. Explore its origins, naming traditions, and why Devconnect cities might shape future upgrade names.",
      link: "https://etherworld.co/2025/01/09/glamsterdam-the-next-upgrade-after-fusaka/",
    },
    {

      image: "glamsterdamimg1.jpg",
      title: "Ethereum Gears Up for Glamsterdam with these Proposals",
      content: "As Ethereum moves closer to its next scheduled hard fork, Glamsterdam, the core developer community is actively evaluating a shortlist of high-impact Ethereum Improvement Proposals (EIPs) referred to as headliners. ",
      link: "https://etherworld.co/2025/06/10/ethereum-gears-up-for-glamsterdam-with-these-proposals/",
    },
  ];



  const PectraPosts = [
    {
      image: "pectraimg1.jpg",
      title: "Holesky Testnet Support Ends in September",
      content:
        "Holesky testnet support ends in September as Ethereum transitions to Hoodi for improved validator testing & Pectra upgrade readiness.",
      link: "https://etherworld.co/2025/03/19/holesky-testnet-support-ends-in-september/",
    },
    {
      image: "pectraimg3.jpg",
      title: "New Ethereum Testnet ‘Hoodi’ Announced for Pectra Testing",
      content:
        "Hoodi is Ethereum’s new testnet, designed to replace Holesky with a mainnet-like environment for testing Pectra, validator exits, & staking operations.",
      link: "https://etherworld.co/2025/03/14/new-ethereum-testnet-hoodi-announced-for-pectra-testing/",
    },
    {
      image: "pectraimg4.jpg",
      title: "How Holesky Finally Reached Stability",
      content:
        "A sneak peek at how the Ethereum community came together to fix Holesky after two weeks of chaos.",
      link: "https://etherworld.co/2025/03/11/how-holesky-finally-reached-stability/",
    },
    {
      image: "pectraimg5.png",
      title: "Holesky and Hoodi Testnet Updates",
      content:
        "The Pectra testnet activation revealed issues in clients with deposit contract configurations changes on Ethereum testnets. While Sepolia's recovery was straightforward and the network has since fully recovered, Holesky experienced extensive inactivity leaks as pa...",
      link: "https://blog.ethereum.org/2025/03/18/hoodi-holesky",
    },
    {
      image: "pectraimg6.jpg",
      title: "Sepolia Pectra Incident Update",
      content:
        "A sneak peek at how the Ethereum community came together to fix Holesky after two weeks of chaos.",
      link: "At 7:29 UTC today, on epoch 222464, the Pectra network upgrade went live on the Sepolia testnet. Unfortunately, an issue with Sepolia's permissioned deposit contract prevented many execution layer clients from including transactions in blocks.",
    },
  ]

  const pectraData = [
    {
      eip: "2537",
      title: "Precompile for BLS12-381 curve operations",
      author:
        "Alex Vlasov (@shamatar), Kelly Olson (@ineffectualproperty), Alex Stokes (@ralexstokes), Antonio Sanso (@asanso)",
      link: "https://eipsinsight.com/eips/eip-2537",
      type: "Standards Track",
      category: "Core",
      discussion:
        "https://ethereum-magicians.org/t/eip2537-bls12-precompile-discussion-thread/4187",
    },
    {
      eip: "2935",
      title: "Serve historical block hashes from state",
      author:
        "Vitalik Buterin (@vbuterin), Tomasz Stanczak (@tkstanczak), Guillaume Ballet (@gballet), Gajinder Singh (@g11tech), Tanishq Jasoria (@tanishqjasoria), Ignacio Hagopian (@jsign), Jochem Brouwer (@jochem-brouwer)",
      link: "https://eipsinsight.com/eips/eip-2935",
      type: "Standards Track",
      category: "Core",
      discussion:
        "https://ethereum-magicians.org/t/eip-2935-save-historical-block-hashes-in-state/4565",
    },
    {
      eip: "6110",
      title: "Supply validator deposits on chain",
      author:
        "Mikhail Kalinin (@mkalinin), Danny Ryan (@djrtwo), Peter Davies (@petertdavies)",
      link: "https://eipsinsight.com/eips/eip-6110",
      type: "Standards Track",
      category: "Core",
      discussion:
        "https://ethereum-magicians.org/t/eip-6110-supply-validator-deposits-on-chain/12072",
    },
    {
      eip: "7002",
      title: "Execution layer triggerable withdrawals",
      author:
        "Danny Ryan (@djrtwo), Mikhail Kalinin (@mkalinin), Ansgar Dietrichs (@adietrichs), Hsiao-Wei Wang (@hwwhww), lightclient (@lightclient)",
      link: "https://eipsinsight.com/eips/eip-7002",
      type: "Standards Track",
      category: "Core",
      discussion:
        "https://ethereum-magicians.org/t/eip-7002-execution-layer-triggerable-exits/14195",
    },
    {
      eip: "7251",
      title: "Increase the MAX_EFFECTIVE_BALANCE",
      author:
        "mike (@michaelneuder), Francesco (@fradamt), dapplion (@dapplion), Mikhail (@mkalinin), Aditya (@adiasg), Justin (@justindrake), lightclient (@lightclient)",
      link: "https://eipsinsight.com/eips/eip-2251",
      type: "Standards Track",
      category: "Core",
      discussion:
        "https://ethereum-magicians.org/t/eip-7251-increase-the-max-effective-balance/15982",
    },
    {
      eip: "7549",
      title: "Move committee index outside Attestation",
      author: "dapplion (@dapplion)",
      link: "https://eipsinsight.com/eips/eip-7549",
      type: "Standards Track",
      category: "Core",
      discussion:
        "https://ethereum-magicians.org/t/eip-7549-move-committee-index-outside-attestation/16390",
    },
    {
      eip: "7685",
      title: "General purpose execution layer requests",
      author: "lightclient (@lightclient)",
      link: "https://eipsinsight.com/eips/eip-7685",
      type: "Standards Track",
      category: "Core",
      discussion: "https://ethereum-magicians.org/t/eip-7685-general-purpose-execution-layer-requests/19668"
    },
    {
      eip: "7702",
      title: "Set EOA account code",
      author: "Vitalik Buterin (@vbuterin), Sam Wilson (@SamWilsn), Ansgar Dietrichs (@adietrichs), Matt Garnett (@lightclient)",
      link: "https://eipsinsight.com/eips/eip-7702",
      type: "Standards Track",
      category: "Core",
      discussion: "https://ethereum-magicians.org/t/eip-set-eoa-account-code-for-one-transaction/19923"
    },
    {
      eip: "7691",
      title: "Blob throughput increase",
      author: "Parithosh Jayanthi (@parithosh), Toni Wahrstätter (@nerolation), Sam Calder-Mason (@samcm), Andrew Davis (@savid), Ansgar Dietrichs (@adietrichs)",
      link: "https://eipsinsight.com/eips/eip-7691",
      type: "Standards Track",
      category: "Core",
      discussion: "https://ethereum-magicians.org/t/eip-7691-blob-throughput-increase/19694"
    },
    {
      eip: "7623",
      title: "Increase calldata cost",
      author: "Toni Wahrstätter (@nerolation), Vitalik Buterin (@vbuterin)",
      link: "https://eipsinsight.com/eips/eip-7623",
      type: "Standards Track",
      category: "Core",
      discussion: "https://ethereum-magicians.org/t/eip-7623-increase-calldata-cost/18647"
    },
    {
      eip: "7840",
      title: "Add blob schedule to EL config files",
      author: "lightclient (@lightclient)",
      link: "https://eipsinsight.com/eips/eip-7840",
      type: "Standards Track",
      category: "Core",
      discussion: "https://ethereum-magicians.org/t/add-blob-schedule-to-execution-client-configuration-files/22182"
    },
  ];

  const fusakaData = [
    {
      eip: "7723",
      title: "Network Upgrade Inclusion Stages",
      author: "Tim Beiko (@timbeiko)",
      link: "https://eipsinsight.com/eips/eip-7723",
      type: "Meta",
      category: "",
      discussion: "https://ethereum-magicians.org/t/eip-7723-network-upgrade-inclusion-stages/20281"
    },
    {
      eip: "7594",
      title: "PeerDAS - Peer Data Availability Sampling",
      author: "Danny Ryan (@djrtwo), Dankrad Feist (@dankrad), Francesco D'Amato (@fradamt), Hsiao-Wei Wang (@hwwhww)",
      link: "https://eipsinsight.com/eips/eip-7594",
      type: "Standards Track",
      category: "Networking",
      discussion: "https://ethereum-magicians.org/t/eip-7594-peerdas-peer-data-availability-sampling/18215"
    },
    {
      eip: "7823",
      title: "Set upper bounds for MODEXP",
      author: "Alex Beregszaszi (@axic), Radoslaw Zagorowicz (@rodiazet)",
      link: "https://eipsinsight.com/eips/eip-7823",
      type: "Standards Track",
      category: "Core",
      discussion: "https://ethereum-magicians.org/t/eip-7823-set-upper-bounds-for-modexp/21798"
    },
    {
      eip: "7825",
      title: "Transaction Gas Limit Cap",
      author: "Giulio Rebuffo (@Giulio2002)",
      link: "https://eipsinsight.com/eips/eip-7825",
      type: "Standards Track",
      category: "Core",
      discussion: "https://ethereum-magicians.org/t/eip-7825-transaction-gas-limit-cap/21848"
    },
    {
      eip: "7883",
      title: "ModExp Gas Cost Increase",
      author: "Marcin Sobczak (@marcindsobczak), Marek Moraczyński (@MarekM25), Marcos Maceo (@stdevMac)",
      link: "https://eipsinsight.com/eips/eip-7883",
      type: "Standards Track",
      category: "Core",
      discussion: "https://ethereum-magicians.org/t/eip-7883-modexp-gas-cost-increase/22841"
    },
    {
      eip: "7892",
      title: "Blob Parameter Only Hardforks",
      author: "Mark Mackey (@ethDreamer)",
      link: "https://eipsinsight.com/eips/eip-7892",
      type: "Informational",
      category: "",
      discussion: "https://ethereum-magicians.org/t/eip-7892-blob-parameter-only-hardforks/23018"
    },
    {
      eip: "7918",
      title: "Blob base fee bounded by execution cost",
      author: "Anders Elowsson (@anderselowsson), Ben Adams (@benaadams), Francesco D'Amato (@fradamt)",
      link: "https://eipsinsight.com/eips/eip-7918",
      type: "Standards Track",
      category: "Core",
      discussion: "https://ethereum-magicians.org/t/eip-blob-base-fee-bounded-by-price-of-blob-carrying-transaction/23271"
    },
    {
      eip: "7935",
      title: "Set default gas limit to XX0M",
      author: "Sophia Gold (@sophia-gold), Parithosh Jayanthi (@parithoshj), Toni Wahrstätter (@nerolation), Carl Beekhuizen (@CarlBeek), Ansgar Dietrichs (@adietrichs), Dankrad Feist (@dankrad), Alex Stokes (@ralexstokes), Josh Rudolph (@jrudolph), Giulio Rebuffo (@Giulio2002), Storm Slivkoff (@sslivkoff)",
      link: "https://eipsinsight.com/eips/eip-7935",
      type: "Informational",
      category: "",
      discussion: "https://ethereum-magicians.org/t/eip-7935-set-default-gas-limit-to-xx0m/23789"
    },
    {
      eip: "7642",
      title: "eth/69 - history expiry and simpler receipts",
      author: "Marius van der Wijden (@MariusVanDerWijden), Felix Lange <fjl@ethereum.org>, Ahmad Bitar (@smartprogrammer93) <smartprogrammer@windowslive.com>",
      link: "https://eipsinsight.com/eips/eip-7642",
      type: "Standards Track",
      category: "Networking",
      discussion: "https://ethereum-magicians.org/t/eth-70-drop-pre-merge-fields-from-eth-protocol/19005"
    },
    {
      eip: "7212",
      title: "Precompile for secp256r1 Curve Support",
      author: "Ulaş Erdoğan (@ulerdogan), Doğan Alpaslan (@doganalpaslan)",
      link: "https://eipsinsight.com/eips/eip-7212",
      type: "Standards Track",
      category: "Core",
      discussion: "https://ethereum-magicians.org/t/eip-7212-precompiled-for-secp256r1-curve-support/14789"
    },
    {
      eip: "5920",
      title: "PAY opcode",
      author: "Gavin John (@Pandapip1), Zainan Victor Zhou (@xinbenlv), Sam Wilson (@SamWilsn), Jochem Brouwer (@jochem-brouwer), Charles Cooper (@charles-cooper)",
      link: "https://eipsinsight.com/eips/eip-5920",
      type: "Standards Track",
      category: "Core",
      discussion: "https://ethereum-magicians.org/t/eip-5920-pay-opcode/11717"
    },
    {
      eip: "7907",
      title: "Meter Contract Code Size And Increase Limit",
      author: "Charles Cooper (@charles-cooper), Qi Zhou (@qizhou)",
      link: "https://eipsinsight.com/eips/eip-7907",
      type: "Standards Track",
      category: "Core",
      discussion: "https://ethereum-magicians.org/t/eip-remove-contract-size-limit/23156"
    },
    {
      eip: "7917",
      title: "Deterministic proposer lookahead",
      author: "Lin Oshitani (@linoscope) <lin@nethermind.io>, Justin Drake (@JustinDrake) <justin@ethereum.org>",
      link: "https://eipsinsight.com/eips/eip-7917",
      type: "Standards Track",
      category: "Core",
      discussion: "https://ethereum-magicians.org/t/eip-7917-deterministic-proposer-lookahead/23259"
    },
    {
      eip: "7934",
      title: "RLP Execution Block Size Limit",
      author: "Giulio Rebuffo (@Giulio2002), Ben Adams (@benaadams), Storm Slivkoff (@sslivkoff)",
      link: "https://eipsinsight.com/eips/eip-7934",
      type: "Standards Track",
      category: "Core",
      discussion: "https://ethereum-magicians.org/t/eip-7934-add-bytesize-limit-to-blocks/23589"
    }
  ];

  const scrollToHash = () => {
    const hash = window.location.hash;
    if (hash) {
      const element = document.getElementById(hash.slice(1));
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  useEffect(() => {
    if (!isLoading) {
      scrollToHash();
    }
  }, [isLoading]);

  useLayoutEffect(() => {
    router.events.on("routeChangeComplete", scrollToHash);
    return () => {
      router.events.off("routeChangeComplete", scrollToHash);
    };
  }, [router]);


  const currentPosts = selectedOption === 'pectra' ? PectraPosts.reverse() : FusakaPosts.reverse();
  const currentData = selectedOption === 'pectra' ? pectraData : fusakaData;
  const upgradeName = selectedOption === 'pectra' ? 'Pectra' : 'Fusaka';

  useScrollSpy([
    "pectra",
    "NetworkUpgradesChartp",
    "NetworkUpgrades",
    "AuthorContributions",
    "pectra-table",
  ]);

  useLayoutEffect(() => {
    router.events.on("routeChangeComplete", scrollToHash);
    return () => {
      router.events.off("routeChangeComplete", scrollToHash);
    };
  }, [router]);

  return (
    <>
      <FeedbackWidget />
      <AllLayout>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Box
            ml="4rem"
            mr="2rem"
            mt="2rem"
            mb="2rem"
            px="1rem"
          >
            <Box>
              <Text
                as={motion.div}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 } as any}
                fontSize={{ base: "2xl", md: "4xl", lg: "6xl" }}
                fontWeight={{ base: "extrabold", md: "bold", lg: "bold" }}
                color="#00CED1"
                id="pectrafusaka"
              >
                Ethereum Network Upgrades
              </Text>

              <br />
              <Box mt={4} mb={4}>
<select
  value={selectedOption}
  onChange={handleSelectChange}
  style={{
    padding: '10px',
    fontSize: '20px',
    borderRadius: '6px',
    border: '1px solid gray',
  }}
>
  <option value="fusaka">Fusaka</option>
  <option value="pectra">Pectra</option>
</select>

              </Box>

              <Box id="NetworkUpgrades" mt={2}>
                <UpgradesTimeline
                  selectedOption={selectedOption}
                  setSelectedOption={setSelectedOption}
                  pectraData={pectraData}
                  fusakaData={fusakaData}
                />
              </Box>

              <Flex
                direction={{ base: "column", md: "row" }}
                align="flex-start"
                gap={{ base: 4, md: 6 }}
                width="100%"
                justify="space-between"
                wrap="wrap"
              >
                <Text
                  flex={{ base: "1 1 auto", md: "3" }}
                  fontSize={{ base: "md", md: "lg", lg: "2xl" }}
                  textAlign="justify"
                  lineHeight="1.6"
                >
                  {selectedOption === 'pectra' ? (
                    <>
                      Ethereum developers are moving toward the next major network upgrade, Prague and Electra,
                      collectively known as{" "}
                      <NLink href="https://eipsinsight.com/eips/eip-7600">
                        <Text as="span" color="blue.500" textDecor="underline">
                          Pectra
                        </Text>
                      </NLink>. This upgrade will involve significant changes to both the{" "}
                      <NLink href="https://www.youtube.com/watch?v=nJ57mkttCH0">
                        <Text as="span" color="blue.500" textDecor="underline">
                          Execution and Consensus layers
                        </Text>
                      </NLink>{" "}
                      on the mainnet. Given the complexities of testing and the scope of changes, including 11{" "}
                      <NLink href="https://www.youtube.com/watch?v=AyidVR6X6J8">
                        <Text as="span" color="blue.500" textDecor="underline">
                          Ethereum Improvement Proposals (EIPs)
                        </Text>
                      </NLink>,
                      the developers recently decided to reduce the scope of the Pectra upgrade. Some EIPs have
                      now been shifted to the upcoming{" "}
                      <NLink href="https://eipsinsight.com/eips/eip-7607">
                        <Text as="span" color="blue.500" textDecor="underline">
                          Fusaka
                        </Text>
                      </NLink>(a combination of Fulu and Osaka) upgrade. Currently, the testing team is working on Pectra{" "}
                      <NLink href="https://notes.ethereum.org/@ethpandaops/pectra-devnet-6">
                        <Text as="span" color="blue.500" textDecor="underline">
                          Devnet 6
                        </Text>
                      </NLink>
                    </>
                  ) : (
                    <>
                      <NLink href="https://eipsinsight.com/eips/eip-7607">
                        <Text as="span" color="blue.500" textDecor="underline">
                          Fusaka
                        </Text>
                      </NLink> upgrade is Ethereum's next major network enhancement expected in late 2025, aiming to improve scalability, efficiency, and cryptographic performance. Key features include <NLink href="https://eipsinsight.com/eips/eip-7594">
                        <Text as="span" color="blue.500" textDecor="underline">
                          PeerDAS
                        </Text>
                      </NLink> (Peer Data Availability Sampling) to reduce bandwidth and enhance Layer 2 support, Blob Parameter Override (BPO) for dynamic data load testing, and ModExp precompiles (<NLink href="https://eipsinsight.com/eips/eip-7823">
                        <Text as="span" color="blue.500" textDecor="underline">
                          EIP-7823
                        </Text>
                      </NLink> & <NLink href="https://eipsinsight.com/eips/eip-7883">
                        <Text as="span" color="blue.500" textDecor="underline">
                          EIP-7883
                        </Text>
                      </NLink>) to speed up cryptographic operations like RSA & zk-SNARKs. Currently, testing is underway via
                      <NLink href="https://notes.ethereum.org/@ethpandaops/fusaka-devnet-0">
                        <Text as="span" color="blue.500" textDecor="underline">
                          Devnet 0
                        </Text>
                      </NLink>, validating these core components ahead of June's in-person dev meeting. Despite tight timelines and coordination challenges across teams, Fusaka is seen as essential for Ethereum's roadmap, setting the stage for the upcoming <NLink href="https://etherworld.co/2025/01/09/glamsterdam-the-next-upgrade-after-fusaka/">
                        <Text as="span" color="blue.500" textDecor="underline">
                          Glamsterdam
                        </Text>
                      </NLink> upgrade.</>
                  )}
                </Text>
              </Flex>

              {/* Blog Cards Section - Vertical Scroll with same width and responsive */}

              <Box
                maxHeight="450px"
                overflowY="auto"
                width="100%"
                padding="4"
                id="upgrade-blogs"
              >
                <Grid
                  // Responsive: 1 column on small screens, 3 columns on medium and up
                  templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }}
                  gap={6}
                >
                  {currentPosts?.map((post, index) => {
                    const isLastRow =
                      index >= currentPosts.length - (currentPosts.length % 3 || 3);

                    const lastRowCount = currentPosts.length % 3;
                    // Only apply colSpan logic on md and up, else always 1 on small screens
                    const colSpan =
                      lastRowCount === 2 && isLastRow && isMediumOrLarger ? 1.5 : 1;


                    return (
                      <GridItem
                        key={index}
                        colSpan={colSpan}
                        display="flex"
                        justifyContent="center"
                        alignItems="stretch"
                      >
                        <Box
                          width="100%"
                          height="100%"
                          borderWidth="1px"
                          borderRadius="md"
                          overflow="hidden"
                        >
                          <Card
                            image={post.image}
                            title={post.title}
                            content={post.content}
                            link={post.link}
                          />
                        </Box>
                      </GridItem>
                    );
                  })}
                </Grid>
              </Box>
              <Box
                id="upgrade-table"  // Consistent ID
                display={{ base: "none", md: "block" }}
              >
                {/* Content changes based on selection */}
                <PectraTable
                  PectraData={selectedOption === 'pectra' ? pectraData : fusakaData}
                  title={selectedOption === 'pectra' ? 'Pectra' : 'Fusaka'}
                />
                <br />
              </Box>


              {/* Network Upgrades Chart - Remains the same for both */}
              <Box
                id="NetworkUpgradesChartp"
                mt={2}
                mb={2}
                px={{ base: 2, md: 4, lg: 6 }}
                width="100%"
                maxWidth="100vw"
                overflowX="auto"
              >
                <Text
                  fontSize={{ base: '2xl', md: '3xl', lg: '3xl' }}
                  fontWeight="bold"
                  color="#00CED1"
                  mt={2}
                  textAlign="center"
                >
                  Network Upgrades and EIPs Relationship Graph
                </Text>
                <br />
                <Flex justifyContent="center" alignItems="center" width="100%">
                  <Box width="100%" maxWidth="100%" overflow="hidden">
                    <Graph />
                  </Box>
                </Flex>
                <br />
              </Box>

              <Box id="NetworkUpgradeschart" mt={2}>
                <NetworkUpgradesChart />
              </Box>
              <br />
              <Box id="AuthorContributions">
                <NetworkUpgradesChart2 />
              </Box>

              {/* Table Section */}
            </Box>
          </Box>
        </motion.div>
      </AllLayout >
    </>
  );
};

export default All;