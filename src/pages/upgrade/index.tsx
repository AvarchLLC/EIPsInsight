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
      eip: "7642",
      title: "eth/69 - history expiry and simpler receipts",
      author: "Marius van der Wijden (@MariusVanDerWijden), Felix Lange <fjl@ethereum.org>, Ahmad Bitar (@smartprogrammer93) <smartprogrammer@windowslive.com>",
      link: "https://eipsinsight.com/eips/eip-7642",
      type: "Standards Track",
      category: "Networking",
      discussion: "https://ethereum-magicians.org/t/eth-70-drop-pre-merge-fields-from-eth-protocol/19005"
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
    "fusaka",
    "NetworkUpgradesChart",
    "upgrade-blogs",
    "NetworkUpgrades",
    "upgrade-table",
    "NetworkUpgradesChartp",
    "AuthorContributions",
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
        <Box px={{ base: "1rem", md: "4rem" }} py="2rem">
          <Box>
            <Text
              as={motion.div}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 } as any}
              fontSize={{ base: "2xl", md: "4xl", lg: "5xl" }}
              fontWeight="bold"
              color="#00CED1"
              id="pectrafusaka"
              mb={4}
            >
              Ethereum Network Upgrades
            </Text>

            <Box my={4}>
              <select
                value={selectedOption}
                onChange={handleSelectChange}
                style={{
                  padding: '10px 16px',
                  fontSize: '16px',
                  borderRadius: '8px',
                  border: '1px solid gray',
                }}
              >
                <option value="fusaka">Fusaka</option>
                <option value="pectra">Pectra</option>
              </select>
            </Box>

            <Box id="NetworkUpgrades" my={6}>
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
              gap={{ base: 6, md: 8 }}
              width="100%"
              wrap="wrap"
              my={4}
            >
              <Text
                flex="1"
                fontSize={{ base: "md", md: "lg", lg: "xl" }}
                lineHeight="1.75"
                textAlign="justify"
              >
                {selectedOption === 'pectra' ? (
                  <>
                    Ethereum developers are moving toward the next major network upgrade, Prague and Electra,
                    collectively known as{" "}
                    <NLink href="https://eipsinsight.com/eips/eip-7600">
                      <Text as="span" color="blue.500" textDecor="underline">
                        Pectra
                      </Text>
                    </NLink>. This upgrade will involve significant changes to the{" "}
                    <NLink href="https://www.youtube.com/watch?v=nJ57mkttCH0">
                      <Text as="span" color="blue.500" textDecor="underline">
                        Execution and Consensus layers
                      </Text>
                    </NLink>{" "}on the mainnet. Due to the complexity of testing and scope involving 11{" "}
                    <NLink href="https://www.youtube.com/watch?v=AyidVR6X6J8">
                      <Text as="span" color="blue.500" textDecor="underline">
                        Ethereum Improvement Proposals (EIPs)
                      </Text>
                    </NLink>, some EIPs were deferred to{" "}
                    <NLink href="https://eipsinsight.com/eips/eip-7607">
                      <Text as="span" color="blue.500" textDecor="underline">
                        Fusaka
                      </Text>
                    </NLink>. Testing is ongoing on{" "}
                    <NLink href="https://notes.ethereum.org/@ethpandaops/pectra-devnet-6">
                      <Text as="span" color="blue.500" textDecor="underline">
                        Devnet 6
                      </Text>
                    </NLink>.
                  </>
                ) : (
                  <>
                    <NLink href="https://eipsinsight.com/eips/eip-7607">
                      <Text as="span" color="blue.500" textDecor="underline">
                        Fusaka
                      </Text>
                    </NLink> is Ethereum's upcoming upgrade expected in late 2025. It focuses on scalability, efficiency, and cryptographic improvements. It introduces <NLink href="https://eipsinsight.com/eips/eip-7594">
                      <Text as="span" color="blue.500" textDecor="underline">
                        PeerDAS
                      </Text>
                    </NLink>, BPO, and ModExp precompiles (
                    <NLink href="https://eipsinsight.com/eips/eip-7823">
                      <Text as="span" color="blue.500" textDecor="underline">
                        EIP-7823
                      </Text>
                    </NLink> & <NLink href="https://eipsinsight.com/eips/eip-7883">
                      <Text as="span" color="blue.500" textDecor="underline">
                        EIP-7883
                      </Text>
                    </NLink>). Testing is ongoing with{" "}
                    <NLink href="https://notes.ethereum.org/@ethpandaops/fusaka-devnet-0">
                      <Text as="span" color="blue.500" textDecor="underline">
                        Devnet 0
                      </Text>
                    </NLink>. It will pave the way for the{" "}
                    <NLink href="https://etherworld.co/2025/01/09/glamsterdam-the-next-upgrade-after-fusaka/">
                      <Text as="span" color="blue.500" textDecor="underline">
                        Glamsterdam
                      </Text>
                    </NLink> upgrade.
                  </>
                )}
              </Text>
            </Flex>

            {/* Blog Cards Section */}
            <Box maxH="450px" overflowY="auto" width="100%" py={4} id="upgrade-blogs">
              <Grid
                templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }}
                gap={6}
              >
                {currentPosts?.map((post, index) => {
                  const isLastRow =
                    index >= currentPosts.length - (currentPosts.length % 3 || 3);
                  const lastRowCount = currentPosts.length % 3;
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
                        borderWidth="1px"
                        borderRadius="lg"
                        overflow="hidden"
                        shadow="md"
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

            {/* Upgrade Table */}
            <Box id="upgrade-table" mt={6} display={{ base: "none", md: "block" }}>
              <PectraTable
                PectraData={selectedOption === 'pectra' ? pectraData : fusakaData}
                title={selectedOption === 'pectra' ? 'Pectra' : 'Fusaka'}
              />
            </Box>

            {/* Charts */}
            <Box id="NetworkUpgradeschart" my={6}>
              <NetworkUpgradesChart />
            </Box>

            <Box id="AuthorContributions" my={6}>
              <NetworkUpgradesChart2 />
            </Box>

            <Box
              id="NetworkUpgradesChartp"
              mt={8}
              px={{ base: 2, md: 6 }}
              width="100%"
              overflowX="auto"
            >
              <Text
                fontSize={{ base: '2xl', md: '3xl' }}
                fontWeight="bold"
                color="#00CED1"
                textAlign="left"
                mb={4}
              >
                Network Upgrades and EIPs Relationship Graph
              </Text>
              <Flex justifyContent="center" alignItems="center" width="100%">
                <Box width="100%" overflow="hidden">
                  <Graph />
                </Box>
              </Flex>
            </Box>
          </Box>
        </Box>
      </motion.div>
    </AllLayout>
  </>
);
};

export default All;