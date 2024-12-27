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
  Grid
} from "@chakra-ui/react";
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
import Image from "next/image";
import NetworkUpgradesChart from "@/components/NetworkUpgradesChart";
import NetworkUpgradesChart2 from "@/components/NetworkUpgradesChart2";
import { FaSyncAlt } from "react-icons/fa";
import { useRouter } from "next/router";


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

  const pectraData = [
  //   {
      
  //     eip: "7600",
  //     title: "Hardfork Meta - Pectra",
  //     author: "Tim Beiko (@timbeiko)",
  //     link: "https://eipsinsight.com/eips/eip-7600",
  //     type: "Meta",
  //     category: "Meta",
  //     discussion: "https://ethereum-magicians.org/t/eip-7600-hardfork-meta-prague-electra/18205",
  // },
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
      // {
      //   eip: "7594",
      //   title: "PeerDAS - Peer Data Availability Sampling",
      //   author: "Danny Ryan (@djrtwo), Dankrad Feist (@dankrad), Francesco D'Amato (@fradamt), Hsiao-Wei Wang (@hwwhww)",
      //   link: "https://eipsinsight.com/eips/eip-7594",
      //   type:"Standards Track",
      //   category:"Networking",
      //   discussion:"https://ethereum-magicians.org/t/eip-7594-peerdas-peer-data-availability-sampling/18215"
      // },
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
        eip: "7742",
        title: "Uncouple blob count between CL and EL",
        author: "Alex Stokes (@ralexstokes)",
        link: "https://eipsinsight.com/eips/eip-7742",
        type:"Standards Track",
        category:"Core",
        discussion:"https://ethereum-magicians.org/t/eip-7742-uncouple-blob-count-between-cl-and-el/20550"
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
          eip: "7762",
          title: "Increase MIN_BASE_FEE_PER_BLOB_GAS",
          author: "Max Resnick (@MaxResnick)",
          link: "https://eipsinsight.com/eips/eip-7762",
          type:"Standards Track",
        category:"Core",
        discussion:"https://ethereum-magicians.org/t/eip-7762-increase-min-base-fee-per-blob-gas/20949"
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

  // console.log("sepolia key:",sepolia_key);
  const calculateTargetBlock = (currentBlock: number) => {
    const targetDate = new Date("2025-02-15T00:00:00Z");
    const currentDate = new Date();
    
    // Calculate the time difference in seconds
    const secondsDifference = (targetDate.getTime() - currentDate.getTime()) / 1000;
    
    // Average block time in seconds (12 seconds per block)
    const averageBlockTime = 12;
    
    // Calculate the target block number
    const targetBlock = currentBlock + Math.floor(secondsDifference / averageBlockTime);
    
    return targetBlock;
  };

  const [targetBlock, setTargetBlock] = useState(0);
  const [currentBlock, setCurrentBlock] = useState(0);
  const [timer, setTimer] = useState(20); // 10-second timer
  

  // Fetch the current block number from Sepolia every 10 seconds
  useEffect(() => {
    const fetchBlockNumber = async () => {
      try {
        const response = await fetch(
          sepolia_key,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              method: "eth_blockNumber",
              params: [],
              id: 1,
              jsonrpc: "2.0",
            }),
          }
        );
        const data = await response.json();
        const blockNumber = parseInt(data.result, 16);
        setCurrentBlock(blockNumber);

        // Calculate the target block based on current block number
        const calculatedTargetBlock = calculateTargetBlock(blockNumber);
        setTargetBlock(calculatedTargetBlock);
      } catch (error) {
        console.error("Error fetching block number:", error);
      }
    };

    const interval = setInterval(() => {
      fetchBlockNumber();
      setTimer(20); // Reset the timer to 10 seconds after each fetch
    }, 20000); // Fetch every 10 seconds

    // Countdown timer that resets every 10 seconds
    const countdownInterval = setInterval(() => {
      setTimer((prev) => (prev === 0 ? 20 : prev - 1)); // Countdown logic
    }, 1000);

    // Initial fetch
    fetchBlockNumber(); // Fetch on initial load
    // Cleanup intervals on component unmount
    return () => {
      clearInterval(interval);
      clearInterval(countdownInterval);
    };
  }, []);

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
           fontSize={{base: "2xl",md:"4xl", lg: "6xl"}}
           fontWeight={{ base: "extrabold", md: "bold", lg: "bold" }}
           color="#30A0E0"
          >
            Ethereum Network Upgrades
          </Text>
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

{/* <Box
  textAlign="center"
  p={6}
  maxWidth="700px"
  mx="auto"
  mt={1}
  borderRadius="lg"
  boxShadow="xl"
  bg="blue.500"
  color="white"
>
  <Text
    as={motion.div}
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    fontSize={{ base: "2xl", md: "2xl", lg: "2xl" }}
    fontWeight="bold"
    color="white"
    mb={4}
  >
    PECTRA Upgrade (Sepolia)
  </Text>

  
    <Box
    as={motion.div}
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    bg="blue.600"
    color="white"
    borderRadius="md"
    p={2}
    mb={4}
    fontSize="xs"
    fontWeight="normal"
  >
    <Text
    fontSize="4xl"
    fontWeight="bold"
    color="white"
    mb={4}
    as={motion.div}
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    // transition={{ duration: 1 }}
  >
    {targetBlock - currentBlock} blocks away
    </Text>
    </Box>
  
  
  <Text
    fontSize="sm"
    color="white"
    mb={4}
    as={motion.div}
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
  >
    Refreshes in {timer} seconds
    </Text>

  <Text fontSize="sm" color="gray.300">
    * The scheduled block number is not announced yet, and this is an approximation.
  </Text>
</Box> */}
<br/>

          <Text mb={4} fontSize={{base: "md",md:"2xl", lg: "2xl"}} textAlign="justify">  {/* Justify text alignment */}
  Ethereum developers are moving toward the next major network upgrade, Prague and Electra, 
  collectively known as{" "}
  <NLink href={`https://eipsinsight.com/eips/eip-7600`}>
      <Text as={"span"} color="blue.500" textDecor={"underline"}>
        Pectra
      </Text>
  </NLink>. This upgrade will involve significant changes to both the{" "}
  <NLink href={`https://www.youtube.com/watch?v=nJ57mkttCH0`}>
      <Text as={"span"} color="blue.500" textDecor={"underline"}>
        Execution and Consensus layers
      </Text>
  </NLink>{" "}
  on the mainnet. Given the complexities 
  of testing and the scope of changes, including 11{" "}
  <NLink href={`https://www.youtube.com/watch?v=AyidVR6X6J8`}>
      <Text as={"span"} color="blue.500" textDecor={"underline"}>
        Ethereum Improvement Proposals (EIPs)
      </Text>
  </NLink>, 
  the developers recently decided to reduce the scope of the Pectra upgrade. Some EIPs have 
  now been shifted to the upcoming{" "}
  <NLink href={`https://eipsinsight.com/eips/eip-7600`}>
      <Text as={"span"} color="blue.500" textDecor={"underline"}>
        Fusaka
      </Text>
  </NLink>(a combination of Fulu and Osaka) upgrade. 
  Currently, the testing team is working on Pectra {" "}
  <NLink href={`https://notes.ethereum.org/@ethpandaops/pectra-devnet-5`}>
      <Text as={"span"} color="blue.500" textDecor={"underline"}>
  Devnet 5
      </Text>
  </NLink>
   {" "}and has finalized the specifications for Devnet 4. Specs 
  and other details can be followed below.{" "}
  <NLink href={`#carousel-section`}>
      <Text as={"span"} color="blue.500" textDecor={"underline"}>
        View more
      </Text>
  </NLink>.
</Text>

<Box id="NetworkUpgrades">
  <NetworkUpgradesChart/>
</Box>
<br/>
<Box id="AuthorContributions">
  <NetworkUpgradesChart2/>
</Box>


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
</Grid>


        </Box>


          {
            <Box display={{ base: "none", md: "block" }}>
              <PectraTable PectraData={pectraData}/>
              <br/>
              <Text
           as={motion.div}
           initial={{ opacity: 0, y: -20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.5 } as any}
           fontSize={{base: "4xl",md:"4xl", lg: "6xl"}}
           fontWeight="bold"
           color="#30A0E0"
          >
            Related Videos
          </Text>
            </Box>
          }
        </Box>
       
        <Box display={{ base: "none", md: "block" }} className="w-3/4 mx-auto" id="carousel-section"> {/* Width set to 50% of the screen */}
        
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

</Box>

        </motion.div>
      </AllLayout>
    </>
  );
};

export default All;
