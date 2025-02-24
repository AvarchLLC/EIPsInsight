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
  Grid
} from "@chakra-ui/react";
import SlotCountdown from "@/components/SlotCountdown";
import NLink from "next/link";
import CatTable from "@/components/CatTable";
import Header from "@/components/Header";
import SearchBox from "@/components/SearchBox";
import { CCardBody, CSmartTable } from "@coreui/react-pro";
import { motion } from "framer-motion";
import PectraTable from "@/components/PectraTable";
import { Table, Thead, Tbody, Tr, Th, Td, Link,TableContainer } from "@chakra-ui/react";
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
// import Image from "next/image";
import NetworkUpgradesChart from "@/components/NetworkUpgradesChart";
import NetworkUpgradesChart2 from "@/components/NetworkUpgradesChart2";
import { FaSyncAlt } from "react-icons/fa";
import { useRouter } from "next/router";
import Graph from "@/components/NetworkUpgradesGraph";


const sepolia_key=process.env.NEXT_PUBLIC_SEPOLIA_API as string;


const All = () => {
  const [selected, setSelected] = useState("Meta");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const bg = useColorModeValue("#f6f6f7", "#171923");
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
  useEffect(() => {
    if (bg === "#f6f6f7") {
      setIsDarkMode(false);
    } else {
      setIsDarkMode(true);
    }
  });

  const factorAuthor = (data: any) => {
    let list = data.split(",");
    for (let i = 0; i < list.length; i++) {
      list[i] = list[i].split(" ");
    }
    if (list[list.length - 1][list[list.length - 1].length - 1] === "al.") {
      list.pop();
    }
    return list;
  };

  // import { Flex, Image, Box, Text, Link, useColorModeValue } from "@chakra-ui/react";

  const Card = ({
    image,
    title,
    content,
    link,
  }: {
    image: string;
    title: string;
    content: string;
    link: string;
  }) => {
    const bg = useColorModeValue("gray.50", "gray.700"); // Light mode: gray.50, Dark mode: gray.700
    const textColor = useColorModeValue("black", "white"); // Light mode: black, Dark mode: white
  
    return (
      <Flex
        direction="row"
        bg={bg}
        p={3}
        borderRadius="md"
        boxShadow="md"
        width="100%"
        minWidth="280px" // Prevent cards from shrinking too much
        maxWidth="400px" // Limit card width
        height="auto" // Allow flexible height for content
        align="center"
        justify="flex-start"
        mb={4}
      >
        <Image
          src={image}
          alt={title}
          boxSize="80px"
          objectFit="cover"
          borderRadius="md"
          mr={4}
        />
        <Box>
          <Text
            fontSize="sm"
            fontWeight="bold"
            noOfLines={1}
            mb={1}
            color={textColor} // Dynamically set text color
          >
            {title}
          </Text>
          <Link href={link} color="blue.400" fontSize="xs" isExternal>
            Read More
          </Link>
        </Box>
      </Flex>
    );
  };
  
  
  
  
  
  

  const PectraPosts= [
    {
      image: "pectra5.jpg",
      title: "Highlights of Ethereum's All Core Devs Meeting (ACDE) #204",
      content: "Pectra Devnet 5 & 6 Updates, Mainnet Timeline, Geth Bug, System Contract Audits, Retrospective, Fusaka Planning, Hardware Requirements, EIP 7823, ACD Bot",
      link: "https://etherworld.co/2025/01/30/highlights-of-ethereums-all-core-devs-meeting-acde-204/"
  },
  {
    image: "pectra6.jpg",
    title: "Highlights of Ethereum's All Core Devs Meeting (ACDC) #149",
    content: "Devnet 5 Updates, Devnet 6 Preparation, Pectra Testnet Forks Blob Scaling & Hard Fork Coordination",
    link: "https://etherworld.co/2025/01/23/highlights-of-ethereums-all-core-devs-meeting-acdc-149/"
},
{
  image: "pectra7.jpg",
  title: "Highlights of Ethereum's All Core Devs Meeting (ACDE) #203",
  content: "Pectra Devnet 5 Launch, Pectra Spec Updates & Pectra Testing Timeline",
  link: "https://etherworld.co/2025/01/17/highlights-of-ethereums-all-core-devs-meeting-acde-203/"
},
{
  image: "pectra8.jpg",
  title: "Glamsterdam: The Next Upgrade After Fusaka",
  content: "Glamsterdam - merges the star Gloas with Amsterdam for Ethereum’s next upgrade. Explore its origins, naming traditions, and why Devconnect cities might shape future upgrade names.",
  link: "https://etherworld.co/2025/01/09/glamsterdam-the-next-upgrade-after-fusaka/"
},
{
  image: "pectra10.jpg",
  title: "Highlights of Ethereum's All Core Devs Meeting #148",
  content: "Pectra Testing Updates, Merged PRs, Hardware Requirements for Validator & Post Pectra Ethereum",
  link: "https://etherworld.co/2025/01/09/highlights-of-ethereums-all-core-devs-consenus-meeting-148/"
},

    {
      image: "pectra2.jpg",
      title: "Ethereum Launches Mekong Testnet: A Guide",
      content: "Ethereum’s Mekong testnet offers developers and stakers a sandbox to explore the Pectra upgrade’s UX and staking changes, shaping the upcoming mainnet deployment.",
      link: "https://etherworld.co/2024/11/08/mekong-testnet/"
  },
  {
      image: "pectra3.jpg",
      title: "Consensus-layer Call 144: EIPs, Pectra, and Blob Scaling",
      content: "Ethereum developers discussed key updates on Pectra, EIPs 7742 and 7782, and strategies for scaling blobs, focusing on network performance, PeerDAS, and upcoming changes for the Pectra hard fork.",
      link: "https://etherworld.co/2024/10/17/consensus-layer-call-144/"
  },
    {
        image: "pectra1.jpg",
        title: "Ethereum Developers Push Proposal to increase Gossip Limit",
        content: "Gossip Limit in Blockchain Networks, Current Setup, Reasons for 10 MiB Limit, Challenges, Proposal Objectives, Implementation & Alternatives.",
        link: "https://etherworld.co/2024/12/15/ethereum-developers-push-proposal-to-increase-gossip-limit/"
    },
]

  const pectraData = [

    {
        eip: "2537",
        title: "Precompile for BLS12-381 curve operations",
        author: "Alex Vlasov (@shamatar), Kelly Olson (@ineffectualproperty), Alex Stokes (@ralexstokes), Antonio Sanso (@asanso)",
        link: "https://eipsinsight.com/eips/eip-2537",
        type:"Standards Track",
        category:"Core",
        discussion:"https://ethereum-magicians.org/t/eip2537-bls12-precompile-discussion-thread/4187"
      },
      {
        eip: "2935",
        title: "Serve historical block hashes from state",
        author: "Vitalik Buterin (@vbuterin), Tomasz Stanczak (@tkstanczak), Guillaume Ballet (@gballet), Gajinder Singh (@g11tech), Tanishq Jasoria (@tanishqjasoria), Ignacio Hagopian (@jsign), Jochem Brouwer (@jochem-brouwer)",
        link: "https://eipsinsight.com/eips/eip-2935",
        type:"Standards Track",
        category:"Core",
        discussion:"https://ethereum-magicians.org/t/eip-2935-save-historical-block-hashes-in-state/4565"
      },
      {
        eip: "6110",
        title: "Supply validator deposits on chain",
        author: "Mikhail Kalinin (@mkalinin), Danny Ryan (@djrtwo), Peter Davies (@petertdavies)",
        link: "https://eipsinsight.com/eips/eip-6110",
        type:"Standards Track",
        category:"Core",
        discussion:"https://ethereum-magicians.org/t/eip-6110-supply-validator-deposits-on-chain/12072"
      },
      {
        eip: "7002",
        title: "Execution layer triggerable withdrawals",
        author: "Danny Ryan (@djrtwo), Mikhail Kalinin (@mkalinin), Ansgar Dietrichs (@adietrichs), Hsiao-Wei Wang (@hwwhww), lightclient (@lightclient)",
        link: "https://eipsinsight.com/eips/eip-7002",
        type:"Standards Track",
        category:"Core",
        discussion:"https://ethereum-magicians.org/t/eip-7002-execution-layer-triggerable-exits/14195"
      },
      {
        eip: "7251",
        title: "Increase the MAX_EFFECTIVE_BALANCE",
        author: "mike (@michaelneuder), Francesco (@fradamt), dapplion (@dapplion), Mikhail (@mkalinin), Aditya (@adiasg), Justin (@justindrake), lightclient (@lightclient)",
        link: "https://eipsinsight.com/eips/eip-2251",
        type:"Standards Track",
        category:"Core",
        discussion:"https://ethereum-magicians.org/t/eip-7251-increase-the-max-effective-balance/15982"
      },
      {
        eip: "7549",
        title: "Move committee index outside Attestation",
        author: "dapplion (@dapplion)",
        link: "https://eipsinsight.com/eips/eip-7549",
        type:"Standards Track",
        category:"Core",
        discussion:"https://ethereum-magicians.org/t/eip-7549-move-committee-index-outside-attestation/16390"
      },
      
      {
        eip: "7685",
        title: "General purpose execution layer requests",
        author: "lightclient (@lightclient)",
        link: "https://eipsinsight.com/eips/eip-7685",
        type:"Standards Track",
        category:"Core",
        discussion:"https://ethereum-magicians.org/t/eip-7685-general-purpose-execution-layer-requests/19668"
      },
      {
        eip: "7702",
        title: "Set EOA account code",
        author: "Vitalik Buterin (@vbuterin), Sam Wilson (@SamWilsn), Ansgar Dietrichs (@adietrichs), Matt Garnett (@lightclient)",
        link: "https://eipsinsight.com/eips/eip-7702",
        type:"Standards Track",
        category:"Core",
        discussion:"https://ethereum-magicians.org/t/eip-set-eoa-account-code-for-one-transaction/19923"
      },
      {
        eip: "7691",
        title: "Blob throughput increase",
        author: "Parithosh Jayanthi (@parithosh), Toni Wahrstätter (@nerolation), Sam Calder-Mason (@samcm), Andrew Davis (@savid), Ansgar Dietrichs (@adietrichs)",
        link: "https://eipsinsight.com/eips/eip-7691",
        type:"Standards Track",
        category:"Core",
        discussion:"https://ethereum-magicians.org/t/eip-7691-blob-throughput-increase/19694"
      },
      {
        eip: "7623",
        title: "Increase calldata cost",
        author: "Toni Wahrstätter (@nerolation), Vitalik Buterin (@vbuterin)",
        link: "https://eipsinsight.com/eips/eip-7623",
        type:"Standards Track",
        category:"Core",
        discussion:"https://ethereum-magicians.org/t/eip-7623-increase-calldata-cost/18647"
      },
      {
          eip: "7840",
          title: "Add blob schedule to EL config files",
          author: "lightclient (@lightclient)",
          link: "https://eipsinsight.com/eips/eip-7840",
          type:"Standards Track",
        category:"Core",
        discussion:"https://ethereum-magicians.org/t/add-blob-schedule-to-execution-client-configuration-files/22182"
      },
      //   {
      //     eip: "3670",
      //     title: "EOF - Code Validation",
      //     author: "Alex Beregszaszi (@axic), Andrei Maiboroda (@gumb0), Paweł Bylica (@chfast)",
      //     link: "https://eipsinsight.com/eips/eip-3670",
      //     type:"Standards Track",
      //   category:"Core",
      //   discussion:"https://ethereum-magicians.org/t/eip-3670-eof-code-validation/6693"
      // },
      //   {
      //     eip: "4200",
      //     title: "EOF - Static relative jumps",
      //     author: "Alex Beregszaszi (@axic), Andrei Maiboroda (@gumb0), Paweł Bylica (@chfast)",
      //     link: "https://eipsinsight.com/eips/eip-4200",
      //     type:"Standards Track",
      //   category:"Core",
      //   discussion:"https://ethereum-magicians.org/t/eip-3920-static-relative-jumps/7108"
      // },
      //   {
      //     eip: "4750",
      //     title: "EOF - Functions",
      //     author: "Andrei Maiboroda (@gumb0), Alex Beregszaszi (@axic), Paweł Bylica (@chfast)",
      //     link: "https://eipsinsight.com/eips/eip-4750",
      //     type:"Standards Track",
      //   category:"Core",
      //   discussion:"https://ethereum-magicians.org/t/eip-4750-eof-functions/8195"
      // },
      //   {
      //     eip: "5450",
      //     title: "EOF - Stack Validation",
      //     author: "Andrei Maiboroda (@gumb0), Paweł Bylica (@chfast), Alex Beregszaszi (@axic), Danno Ferrin (@shemnon)",
      //     link: "https://eipsinsight.com/eips/eip-5450",
      //     type:"Standards Track",
      //   category:"Core",
      //   discussion:"https://ethereum-magicians.org/t/eip-5450-eof-stack-validation/10410"
      // },
      //   {
      //     eip: "6206",
      //     title: "EOF - JUMPF and non-returning functions",
      //     author: "Andrei Maiboroda (@gumb0), Alex Beregszaszi (@axic), Paweł Bylica (@chfast), Matt Garnett (@lightclient)",
      //     link: "https://eipsinsight.com/eips/eip-6206",
      //     type:"Standards Track",
      //   category:"Core",
      //   discussion:"https://ethereum-magicians.org/t/eip-4750-eof-functions/8195"
      // },
      //   {
      //     eip: "7069",
      //     title: "Revamped CALL instructions",
      //     author: "Alex Beregszaszi (@axic), Paweł Bylica (@chfast), Danno Ferrin (@shemnon), Andrei Maiboroda (@gumb0), Charles Cooper (@charles-cooper)",
      //     link: "https://eipsinsight.com/eips/eip-7069",
      //     type:"Standards Track",
      //   category:"Core",
      //   discussion:"https://ethereum-magicians.org/t/eip-revamped-call-instructions/14432"
      // },
      //   {
      //     eip: "7480",
      //     title: "EOF - Data section access instructions",
      //     author: "Andrei Maiboroda (@gumb0), Alex Beregszaszi (@axic), Paweł Bylica (@chfast)",
      //     link: "https://eipsinsight.com/eips/eip-7480",
      //     type:"Standards Track",
      //   category:"Core",
      //   discussion:"https://ethereum-magicians.org/t/eip-7480-eof-data-instructions/15414"
      // },
      //   {
      //     eip: "7620",
      //     title: "EOF Contract Creation",
      //     author: "Alex Beregszaszi (@axic), Paweł Bylica (@chfast), Andrei Maiboroda (@gumb0), Piotr Dobaczewski (@pdobacz)",
      //     link: "https://eipsinsight.com/eips/eip-7620",
      //     type:"Standards Track",
      //   category:"Core",
      //   discussion:"https://ethereum-magicians.org/t/eip-7620-eof-contract-creation-instructions/18625"
      // },
      //   {
      //     eip: "7698",
      //     title: "EOF - Creation transaction",
      //     author: "Piotr Dobaczewski (@pdobacz), Andrei Maiboroda (@gumb0), Paweł Bylica (@chfast), Alex Beregszaszi (@axic)",
      //     link: "https://eipsinsight.com/eips/eip-7698",
      //     type:"Standards Track",
      //   category:"Core",
      //   discussion:"https://ethereum-magicians.org/t/eip-7698-eof-creation-transaction/19784"
      // },
  ];

 

  const router = useRouter();
  
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



  return (
    <>
      <AllLayout>
      <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
        <Box
          paddingBottom={{ lg: "10", sm: "10", base: "10" }}
          marginX={{ lg: "10", md: "2", sm: "2", base: "2" }}
          paddingX={{ lg: "5", md: "5", sm: "5", base: "5" }}
          marginTop={{ lg: "10", md: "5", sm: "5", base: "5" }}
        >
       <Box>
       <Text
           as={motion.div}
           initial={{ opacity: 0, y: -20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.5 } as any}
           fontSize={{base: "2xl",md:"4xl", lg: "6xl"}}
           fontWeight={{ base: "extrabold", md: "bold", lg: "bold" }}
           color="#30A0E0"
          >
            Ethereum Network Upgrades
          </Text>

        <br/>
        {/* <br/> */}
        <SlotCountdown/>
        <br/>
        <Text
          as={motion.div}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 } as any}
          fontSize={{base: "2xl",md:"2xl", lg: "2xl"}}
          fontWeight="bold"
          color="#30A0E0"
          mt={2}
        >
          PECTRA
        </Text>

        <Flex
           direction={{ base: "column", md: "row" }}
           align="flex-start"
           gap={{ base: 4, md: 6 }}
           width="100%"
           justify="space-between"
           wrap="wrap" 
        >
          {/* Text Section */}
          <Text
            flex={{ base: "1 1 auto", md: "3" }} // Text takes 3/5 width on larger screens
            fontSize={{ base: "md", md: "lg", lg: "2xl" }}
            textAlign="justify"
            lineHeight="1.6"
            maxWidth="1200px" // Limit text width for better readability
          >
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
            <NLink href="https://eipsinsight.com/eips/eip-7600">
              <Text as="span" color="blue.500" textDecor="underline">
                Fusaka
              </Text>
            </NLink>(a combination of Fulu and Osaka) upgrade. Currently, the testing team is working on Pectra{" "}
            <NLink href="https://notes.ethereum.org/@ethpandaops/pectra-devnet-5">
              <Text as="span" color="blue.500" textDecor="underline">
                Devnet 5
              </Text>
            </NLink>{" "} 
            and has finalized the specifications for Devnet 4. Specs and other details can be followed below.{" "}
            <NLink href="#carousel-section">
              <Text as="span" color="blue.500" textDecor="underline">
                View more
              </Text>
            </NLink>.
          </Text>

          {/* Cards Section */}
          <Flex
  flex={{ base: "1 1 auto", md: "1" }} // Cards take 2/5 width on larger screens
  wrap="wrap" // Ensure cards can wrap onto new rows if needed
  justify="flex-start" // Align cards to the left
  gap={4} // Add spacing between cards
  width="100%" // Ensure cards section takes up full width
  maxHeight="300px" // Limit the height of the container
  overflowY="auto" // Make the container vertically scrollable
  overflowX="hidden" // Prevent horizontal scrolling
  p={4} // Add padding for better spacing inside the scroll area
  sx={{
    "&::-webkit-scrollbar": {
      width: "8px", // Width of the scrollbar
    },
    "&::-webkit-scrollbar-thumb": {
      background: "#3182ce", // Color of the scrollbar thumb
      borderRadius: "4px", // Rounded edges for the thumb
    },
    "&::-webkit-scrollbar-thumb:hover": {
      background: "#2b6cb0", // Darker color on hover
    },
    "&::-webkit-scrollbar-track": {
      background: "#edf2f7", // Light background for the track
    },
  }}
>
  {PectraPosts.map((pectra, index) => (
    <Card
      key={index}
      image={pectra.image}
      title={pectra.title}
      content={pectra.content}
      link={pectra.link}
    />
  ))}
</Flex>

        </Flex>
        





        <Box id="NetworkUpgradesChart" mt={2} mb={2}>
          <Text
                  fontSize={{ base: '2xl', md: '3xl', lg: '3xl' }}
                  fontWeight="bold"
                  color="#30A0E0"
                  mt={2}
                >
                  Network Upgrades and EIPs Relationship Graph
                </Text>
                <br/>
          <Flex justifyContent="center" alignItems="center">
            <Image
              src="/Pectra_Relations.jpg"
              alt="Image 1"
              borderRadius="md"
              width={{ base: "250px", md: "350px", lg: "500px" }}
              height="auto"
              objectFit="contain"
            />
          </Flex>
          <br/>
        </Box>



        <Box id="NetworkUpgrades" mt={2}>
          <NetworkUpgradesChart/>
        </Box>
        <br/>
        <Box id="AuthorContributions">
          <NetworkUpgradesChart2/>
        </Box>


      {/* <Grid
      templateColumns={{ base: "1fr", md: "1fr 1fr" }} // Stack vertically on small screens
      gap={6}
      p={6}
    >
     
      <Box>
        <Text
          as={motion.div}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          fontSize={{ base: "xl", md: "2xl", lg: "4xl" }}
          fontWeight="bold"
          color="#30A0E0"
        >
          Devnets & Testnets
        </Text>

        <TableContainer style={{ maxHeight: "400px", overflowY: "auto" }}>
      <Table
        variant="striped"
        colorScheme="gray"
        size="lg"
        mt={4}
        style={{
          border: "1px solid black",
          borderRadius: "md",
          boxShadow: "md",
          width: "100%",
          tableLayout: "fixed", // Ensures consistent column width
        }}
      >
        <Thead>
          <Tr style={{ border: "1px solid black" }}>
            <Th style={{ border: "1px solid black" }}>Date</Th>
            <Th style={{ border: "1px solid black" }}>Devnet Spec</Th>
          </Tr>
        </Thead>
        <Tbody>
          {[
            {
              date: "November 2024",
              specLink: "https://notes.ethereum.org/@ethpandaops/pectra-devnet-5",
              specText: "Pectra Devnet 5 (Specs)",
            },
            {
              date: "October 2024",
              specLink: "https://notes.ethereum.org/@ethpandaops/pectra-devnet-4",
              specText: "Pectra Devnet 4 (Specs)",
            },
            {
              date: "August 2024",
              specLink: "https://notes.ethereum.org/@ethpandaops/pectra-devnet-3",
              specText: "Pectra Devnet 3 (Specs)",
            },
            {
              date: "August 2024",
              specLink: "https://github.com/ethereum/execution-spec-tests/releases/tag/pectra-devnet-3%40v1.0.0",
              specText: "Tests Specs",
            },
            {
              date: "July 2024",
              specLink: "https://notes.ethereum.org/@ethpandaops/pectra-devnet-2",
              specText: "Pectra Devnet 2 (Specs)",
            },
            {
              date: "June 2024",
              specLink: "https://notes.ethereum.org/@ethpandaops/pectra-devnet-1",
              specText: "Pectra Devnet 1 (Specs)",
            },
            {
              date: "May 2024",
              specLink: "https://notes.ethereum.org/@ethpandaops/pectra-devnet-0",
              specText: "Pectra Devnet 0 (Specs)",
            },
          ].map((item, index) => (
            <Tr style={{ border: "1px solid black" }} key={index}>
              <Td style={{ border: "1px solid black" }}>{item.date}</Td>
              <Td style={{ border: "1px solid black" }}>
                <Link href={item.specLink} color="blue.500" textDecor="underline" isExternal>
                  {item.specText}
                </Link>
              
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>


  </Box>


  <Box
    border="2px solid" // Adds a solid border
    borderColor="blue.500" // Border color
    borderRadius="lg" // Rounded corners
    display="flex"
    justifyContent="center" // Centers the video horizontally
    alignItems="center" // Centers the video vertically
    width="100%" // Full width to fit the grid cell
    height="100%" // Full height to fit the grid cell
    padding="4" // Padding around the iframe
    // backgroundColor="gray.800" // Background color for the box
  >
    <Box
      position="relative"
      width="100%"
      height="0"
      paddingBottom="56.25%" // Aspect ratio for a 16:9 video
    >
      <iframe
        width="100%"
        height="100%"
        src="https://www.youtube.com/embed/videoseries?list=PL4cwHXAawZxqOHV_F40AJbzcl8b6tG8xw"
        title="YouTube video"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        style={{
          position: "absolute", // Keeps the video inside the box
          top: 0,
          left: 0,
        }}
      ></iframe>
    </Box>
  </Box>
</Grid> */}


        </Box>


          {
            <Box display={{ base: "none", md: "block" }}>
              <PectraTable PectraData={pectraData}/>
              <br/>
              {/* <Text
           as={motion.div}
           initial={{ opacity: 0, y: -20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.5 } as any}
           fontSize={{base: "4xl",md:"4xl", lg: "6xl"}}
           fontWeight="bold"
           color="#30A0E0"
          >
            Related Videos
          </Text> */}
            </Box>
          }
        </Box>
       
        {/* <Box display={{ base: "none", md: "block" }} className="w-3/4 mx-auto" id="carousel-section"> 
        
        <Carousel 
  showThumbs={false} 
  autoPlay 
  infiniteLoop 
  showStatus={false} 
  showIndicators={false} 
  centerMode 
  centerSlidePercentage={40}
  renderArrowPrev={(onClickHandler, hasPrev, label) =>
    hasPrev && (
      <button
        type="button"
        
        onClick={onClickHandler}
        title={label}
        style={{
          position: 'absolute',
          zIndex: 2,
          top: 'calc(50% - 15px)',
          left: '0',
          width: '30px',
          height: '30px',
          background: 'rgba(0, 0, 0, 0.5)',
          border: 'none',
          color: 'white',
          fontSize: '20px',
          cursor: 'pointer',
          borderRadius: '50%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          opacity: 1
        }}
      >
        &#10094;
      </button>
    )
  }
  renderArrowNext={(onClickHandler, hasNext, label) =>
    hasNext && (
      <button
        type="button"
        onClick={onClickHandler}
        title={label}
        style={{
          position: 'absolute',
          zIndex: 2,
          top: 'calc(50% - 15px)',
          right: '0',
          width: '30px',
          height: '30px',
          background: 'rgba(0, 0, 0, 0.5)',
          border: 'none',
          color: 'white',
          fontSize: '20px',
          cursor: 'pointer',
          borderRadius: '50%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          opacity: 1
        }}
      >
        &#10095;
      </button>
    )
  }
>
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '350px', margin: '0 10px' }}>
    <a
      href="https://www.youtube.com/watch?v=YuEA-jE2Z8c&list=PLZmWIkdMcWY5ymDvUCjRLjWGIpCsn8yV8&index=2&t=201s"
      target="_blank"
      style={{ textDecoration: 'none' }}
    >
      <iframe
        style={{ width: '500px', height: '300px', border: 'none' }}
        src="https://www.youtube.com/embed/YuEA-jE2Z8c"
        title="Blog 1"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </a>
  </div>

  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '350px',  margin: '0 10px'}}>
    <a
      href="https://www.youtube.com/watch?v=pyfKM_hOKaM&list=PLZmWIkdMcWY4IsrNbjEO3qfREoV-OX4zF&index=22&t=218s"
      target="_blank"
      style={{ textDecoration: 'none' }}
    >
      <iframe
        style={{ width: '500px', height: '300px', border: 'none' }}
        src="https://www.youtube.com/embed/pyfKM_hOKaM"
        title="Blog 2"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </a>
  </div>

  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '350px', margin: '0 10px'}}>
    <a
      href="https://www.youtube.com/playlist?list=PL4cwHXAawZxpnKFDl1KzGOKqwux5JaLlv"
      target="_blank"
      style={{ textDecoration: 'none' }}
    >
      <iframe
        style={{ width: '500px', height: '300px', border: 'none' }}
        src="https://www.youtube.com/embed/videoseries?list=PL4cwHXAawZxpnKFDl1KzGOKqwux5JaLlv"
        title="Playlist 1"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </a>
  </div>

  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '350px', margin: '0 10px' }}>
    <a
      href="https://www.youtube.com/playlist?list=PL4cwHXAawZxpok0smGmq-dFGVHQzW84a2"
      target="_blank"
      style={{ textDecoration: 'none' }}
    >
      <iframe
        style={{ width: '500px',  height: '300px', border: 'none' }}
        src="https://www.youtube.com/embed/videoseries?list=PL4cwHXAawZxpok0smGmq-dFGVHQzW84a2"
        title="Playlist 2"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </a>
  </div>

  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '350px', margin: '0 10px' }}>
    <a
      href="https://www.youtube.com/watch?v=nJ57mkttCH0"
      target="_blank"
      style={{ textDecoration: 'none' }}
    >
      <iframe
        style={{ width: '500px', height: '300px', border: 'none' }}
        src="https://www.youtube.com/embed/nJ57mkttCH0"
        title="Video 1"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </a>
  </div>

  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '350px', margin: '0 10px' }}>
    <a
      href="https://youtu.be/0tEcFa9J5TM"
      target="_blank"
      style={{ textDecoration: 'none' }}
    >
      <iframe
        style={{ width: '500px',  height: '300px', border: 'none' }}
        src="https://www.youtube.com/embed/0tEcFa9J5TM"
        title="Video 2"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </a>
  </div>

  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '350px', margin: '0 10px' }}>
    <a
      href="https://youtu.be/sIr6XX8yR8o"
      target="_blank"
      style={{ textDecoration: 'none' }}
    >
      <iframe
        style={{ width: '500px',  height: '300px', border: 'none' }}
        src="https://www.youtube.com/embed/sIr6XX8yR8o"
        title="Video 3"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </a>
  </div>

  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '350px', margin: '0 10px' }}>
    <a
      href="https://youtu.be/B69btfxKVks"
      target="_blank"
      style={{ textDecoration: 'none' }}
    >
      <iframe
        style={{ width: '500px',  height: '300px', border: 'none' }}
        src="https://www.youtube.com/embed/B69btfxKVks"
        title="Video 4"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </a>
  </div>
</Carousel>


<br/>

</Box> */}

        </motion.div>
      </AllLayout>
    </>
  );
};

export default All;
