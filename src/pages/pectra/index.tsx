import React, { useState, useEffect } from "react";
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
  Grid
} from "@chakra-ui/react";
import NLink from "next/link";
import CatTable from "@/components/CatTable";
import Header from "@/components/Header";
import SearchBox from "@/components/SearchBox";
import { CCardBody, CSmartTable } from "@coreui/react-pro";
import { motion } from "framer-motion";
import PectraTable from "@/components/PectraTable";
import { Table, Thead, Tbody, Tr, Th, Td, Link } from "@chakra-ui/react";
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import Image from "next/image";

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

  const pectraData = [
    {
      
      eip: "7600",
      title: "Hardfork Meta - Pectra",
      author: "Tim Beiko (@timbeiko)",
      link: "https://eipsinsight.com/eips/eip-7600",
      type: "Meta",
      category: "Meta",
      discussion: "https://ethereum-magicians.org/t/eip-7600-hardfork-meta-prague-electra/18205",
  },
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
        eip: "7594",
        title: "PeerDAS - Peer Data Availability Sampling",
        author: "Danny Ryan (@djrtwo), Dankrad Feist (@dankrad), Francesco D'Amato (@fradamt), Hsiao-Wei Wang (@hwwhww)",
        link: "https://eipsinsight.com/eips/eip-7594",
        type:"Standards Track",
        category:"Networking",
        discussion:"https://ethereum-magicians.org/t/eip-7594-peerdas-peer-data-availability-sampling/18215"
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
        eip: "7692",
        title: "EVM Object Format (EOFv1) Meta",
        author: "Alex Beregszaszi (@axic), Paweł Bylica (@chfast), Andrei Maiboroda (@gumb0), Piotr Dobaczewski (@pdobacz), Danno Ferrin (@shemnon)",
        link: "https://eipsinsight.com/eips/eip-7692",
        type:"Meta",
        category:"Meta",
        discussion:"https://ethereum-magicians.org/t/eip-7692-evm-object-format-eof-meta/19686"
      },
      // {
      //   eip: "663",
      //   title: "SWAPN, DUPN and EXCHANGE instructions",
      //   author: "Alex Beregszaszi (@axic), Charles Cooper (@charles-cooper), Danno Ferrin (@shemnon)",
      //   link: "https://eipsinsight.com/eips/eip-2537",
      //   type:"Standards Track",
      //   category:"Core",
      //   discussion:"https://ethereum-magicians.org/t/eip-663-unlimited-swap-and-dup-instructions/3346"
      // },
      // {
      //     eip: "3540",
      //     title: "EOF - EVM Object Format v1",
      //     author: "Alex Beregszaszi (@axic), Paweł Bylica (@chfast), Andrei Maiboroda (@gumb0), Matt Garnett (@lightclient)",
      //     link: "https://eipsinsight.com/eips/eip-3540",
      //     type:"Standards Track",
      //   category:"Core",
      //   discussion:"https://ethereum-magicians.org/t/evm-object-format-eof/5727"
      // },
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
          marginX={{ lg: "40", md: "2", sm: "2", base: "2" }}
          paddingX={{ lg: "10", md: "5", sm: "5", base: "5" }}
          marginTop={{ lg: "10", md: "5", sm: "5", base: "5" }}
        >
       <Box>
       <Text
           as={motion.div}
           initial={{ opacity: 0, y: -20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.5 } as any}
           fontSize={{base: "2xl",md:"2xl", lg: "6xl"}}
           fontWeight="bold"
           color="#30A0E0"
          >
            Pectra Upgrade
          </Text>
      <Text mb={4} fontSize="2xl" textAlign="justify">  {/* Justify text alignment */}
        The upcoming Pectra upgrade for Ethereum, expected in late 2024, will focus on improving EL-CL communication, staking design, and enhancing everyday transactions.

        At the recent interop meetup in Kenya, Ethereum developers made significant progress in implementing and refining key technical details for these improvements. They also launched&nbsp;
        <NLink href={`https://notes.ethereum.org/@ethpandaops/pectra-devnet-0`}>
          <Text as={"span"} color="blue.500" textDecor={"underline"}>
            Pectra Devnet - 0
          </Text>
        </NLink>.
        <NLink href={`https://eipsinsight.com/eips/eip-7600`}>
          <Text as={"span"} color="blue.500" textDecor={"underline"}>
         EIP-7600: Hardfork Meta
        </Text>
        </NLink>. - Pectra was created to provide an updated list of proposals for the Network Upgrade.&nbsp;
        <NLink href={`#carousel-section`}>
          <Text as={"span"} color="blue.500" textDecor={"underline"}>
           view more
          </Text>
        </NLink>.
      </Text>


      <Grid
  templateColumns={{ base: "1fr", md: "1fr 1fr" }} // Stack vertically on small screens
  gap={6}
  p={6}
>
  {/* Left Side - Motion Text and Table */}
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

    <Table
  variant="striped"
  colorScheme="blue"
  size="lg"
  mt={4}
  style={{ border: "1px solid black", borderRadius: "md", boxShadow: "md", width: "100%" }}
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
        date: "October 2024",
        specLink: "https://notes.ethereum.org/@ethpandaops/pectra-devnet-4",
        specText: "Pectra Devnet 4 (Specs)",
      },
      {
        date: "August 2024",
        specLink: "https://github.com/ethereum/execution-spec-tests/releases/tag/pectra-devnet-3%40v1.0.0",
        specText: "Tests for Devnet 3 (Specs)",
        additionalLink: "https://notes.ethereum.org/@ethpandaops/pectra-devnet-3",
        additionalText: "Pectra Devnet 3 (Specs)",
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
          {item.additionalLink && (
            <>
              ,{" "}
              <Link href={item.additionalLink} color="blue.500" textDecor="underline" isExternal>
                {item.additionalText}
              </Link>
            </>
          )}
        </Td>
      </Tr>
    ))}
  </Tbody>
</Table>

  </Box>

  {/* Right Side - YouTube Video */}
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
        src="https://www.youtube.com/embed/YuEA-jE2Z8c?start=201"
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
</Grid>


        </Box>


          {
            <Box>
              <PectraTable PectraData={pectraData}/>
            </Box>
          }
        </Box>
        <Box className="w-1/2 mx-auto" id="carousel-section"> {/* Width set to 50% of the screen */}
  <Carousel showThumbs={false} autoPlay infiniteLoop >
    <a
      href="https://www.youtube.com/watch?v=YuEA-jE2Z8c&list=PLZmWIkdMcWY5ymDvUCjRLjWGIpCsn8yV8&index=2&t=201s"
      target="_blank"
    >
      <iframe
        width="100%" // Set to fill the width of the Box
        height="350" // Set a specific height for the iframe
        src="https://www.youtube.com/embed/YuEA-jE2Z8c"
        title="Blog 1"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </a>
    <a
      href="https://www.youtube.com/watch?v=pyfKM_hOKaM&list=PLZmWIkdMcWY4IsrNbjEO3qfREoV-OX4zF&index=22&t=218s"
      target="_blank"
    >
      <iframe
        width="100%"
        height="350"
        src="https://www.youtube.com/embed/pyfKM_hOKaM"
        title="Blog 2"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </a>
    <a
      href="https://www.youtube.com/playlist?list=PL4cwHXAawZxqOHV_F40AJbzcl8b6tG8xw"
      target="_blank"
    >
      <iframe
        width="100%"
        height="350"
        src="https://www.youtube.com/embed/videoseries?list=PL4cwHXAawZxqOHV_F40AJbzcl8b6tG8xw"
        title="Blog 3"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </a>
  </Carousel>
</Box>

        </motion.div>
      </AllLayout>
    </>
  );
};

export default All;
