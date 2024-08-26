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
  Heading
} from "@chakra-ui/react";
import NLink from "next/link";
import CatTable from "@/components/CatTable";
import Header from "@/components/Header";
import SearchBox from "@/components/SearchBox";
import { CCardBody, CSmartTable } from "@coreui/react-pro";
import { motion } from "framer-motion";
import PectraTable from "@/components/PectraTable";

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
      {
        eip: "663",
        title: "SWAPN, DUPN and EXCHANGE instructions",
        author: "Alex Beregszaszi (@axic), Charles Cooper (@charles-cooper), Danno Ferrin (@shemnon)",
        link: "https://eipsinsight.com/eips/eip-2537",
        type:"Standards Track",
        category:"Core",
        discussion:"https://ethereum-magicians.org/t/eip-663-unlimited-swap-and-dup-instructions/3346"
      },
      {
          eip: "3540",
          title: "EOF - EVM Object Format v1",
          author: "Alex Beregszaszi (@axic), Paweł Bylica (@chfast), Andrei Maiboroda (@gumb0), Matt Garnett (@lightclient)",
          link: "https://eipsinsight.com/eips/eip-3540",
          type:"Standards Track",
        category:"Core",
        discussion:"https://ethereum-magicians.org/t/evm-object-format-eof/5727"
      },
        {
          eip: "3670",
          title: "EOF - Code Validation",
          author: "Alex Beregszaszi (@axic), Andrei Maiboroda (@gumb0), Paweł Bylica (@chfast)",
          link: "https://eipsinsight.com/eips/eip-3670",
          type:"Standards Track",
        category:"Core",
        discussion:"https://ethereum-magicians.org/t/eip-3670-eof-code-validation/6693"
      },
        {
          eip: "4200",
          title: "EOF - Static relative jumps",
          author: "Alex Beregszaszi (@axic), Andrei Maiboroda (@gumb0), Paweł Bylica (@chfast)",
          link: "https://eipsinsight.com/eips/eip-4200",
          type:"Standards Track",
        category:"Core",
        discussion:"https://ethereum-magicians.org/t/eip-3920-static-relative-jumps/7108"
      },
        {
          eip: "4750",
          title: "EOF - Functions",
          author: "Andrei Maiboroda (@gumb0), Alex Beregszaszi (@axic), Paweł Bylica (@chfast)",
          link: "https://eipsinsight.com/eips/eip-4750",
          type:"Standards Track",
        category:"Core",
        discussion:"https://ethereum-magicians.org/t/eip-4750-eof-functions/8195"
      },
        {
          eip: "5450",
          title: "EOF - Stack Validation",
          author: "Andrei Maiboroda (@gumb0), Paweł Bylica (@chfast), Alex Beregszaszi (@axic), Danno Ferrin (@shemnon)",
          link: "https://eipsinsight.com/eips/eip-5450",
          type:"Standards Track",
        category:"Core",
        discussion:"https://ethereum-magicians.org/t/eip-5450-eof-stack-validation/10410"
      },
        {
          eip: "6206",
          title: "EOF - JUMPF and non-returning functions",
          author: "Andrei Maiboroda (@gumb0), Alex Beregszaszi (@axic), Paweł Bylica (@chfast), Matt Garnett (@lightclient)",
          link: "https://eipsinsight.com/eips/eip-6206",
          type:"Standards Track",
        category:"Core",
        discussion:"https://ethereum-magicians.org/t/eip-4750-eof-functions/8195"
      },
        {
          eip: "7069",
          title: "Revamped CALL instructions",
          author: "Alex Beregszaszi (@axic), Paweł Bylica (@chfast), Danno Ferrin (@shemnon), Andrei Maiboroda (@gumb0), Charles Cooper (@charles-cooper)",
          link: "https://eipsinsight.com/eips/eip-7069",
          type:"Standards Track",
        category:"Core",
        discussion:"https://ethereum-magicians.org/t/eip-revamped-call-instructions/14432"
      },
        {
          eip: "7480",
          title: "EOF - Data section access instructions",
          author: "Andrei Maiboroda (@gumb0), Alex Beregszaszi (@axic), Paweł Bylica (@chfast)",
          link: "https://eipsinsight.com/eips/eip-7480",
          type:"Standards Track",
        category:"Core",
        discussion:"https://ethereum-magicians.org/t/eip-7480-eof-data-instructions/15414"
      },
        {
          eip: "7620",
          title: "EOF Contract Creation",
          author: "Alex Beregszaszi (@axic), Paweł Bylica (@chfast), Andrei Maiboroda (@gumb0), Piotr Dobaczewski (@pdobacz)",
          link: "https://eipsinsight.com/eips/eip-7620",
          type:"Standards Track",
        category:"Core",
        discussion:"https://ethereum-magicians.org/t/eip-7620-eof-contract-creation-instructions/18625"
      },
        {
          eip: "7698",
          title: "EOF - Creation transaction",
          author: "Piotr Dobaczewski (@pdobacz), Andrei Maiboroda (@gumb0), Paweł Bylica (@chfast), Alex Beregszaszi (@axic)",
          link: "https://eipsinsight.com/eips/eip-7698",
          type:"Standards Track",
        category:"Core",
        discussion:"https://ethereum-magicians.org/t/eip-7698-eof-creation-transaction/19784"
      },
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

        EIP-7600: Hardfork Meta - Pectra was created to provide an updated list of proposals for the Network Upgrade. You can read about them&nbsp;
        <NLink href={`https://eipsinsight.com/pectra`}>
          <Text as={"span"} color="blue.500" textDecor={"underline"}>
            here
          </Text>
        </NLink>.
      </Text>


          <Text
           as={motion.div}
           initial={{ opacity: 0, y: -20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.5 } as any}
           fontSize={{base: "xl",md:"2xl", lg: "4xl"}}
           fontWeight="bold"
           color="#30A0E0"
          >
            Devnets & Testnets
          </Text>

          <UnorderedList spacing={3} pl={8}>
          <ListItem>
    <Text fontSize="2xl">
      August 2024: Tests for Devnet 3 (
      <NLink href=" https://github.com/ethereum/execution-spec-tests/releases/tag/pectra-devnet-3%40v1.0.0">
        <Text as="span" color="blue.500" textDecor="underline">
          Specs
        </Text>
      </NLink>
      )
    </Text>
  </ListItem>
          <ListItem>
    <Text fontSize="2xl">
      August 2024: Launched Pectra Devnet 3 (
      <NLink href="https://notes.ethereum.org/@ethpandaops/pectra-devnet-3">
        <Text as="span" color="blue.500" textDecor="underline">
          Specs
        </Text>
      </NLink>
      )
    </Text>
  </ListItem>
  <ListItem>
    <Text fontSize="2xl">
      July 2024: Launched Pectra Devnet 2 (
      <NLink href="https://notes.ethereum.org/@ethpandaops/pectra-devnet-2">
        <Text as="span" color="blue.500" textDecor="underline">
          Specs
        </Text>
      </NLink>
      )
    </Text>
  </ListItem>
  <ListItem>
    <Text fontSize="2xl">
      June 2024: Launched Pectra Devnet 1 (
      <NLink href="https://notes.ethereum.org/@ethpandaops/pectra-devnet-1">
        <Text as="span" color="blue.500" textDecor="underline">
          Specs
        </Text>
      </NLink>
      )
    </Text>
  </ListItem>
  <ListItem>
    <Text fontSize="2xl">
      May 2024: Launched Pectra Devnet 0 (
      <NLink href="https://notes.ethereum.org/@ethpandaops/pectra-devnet-0">
        <Text as="span" color="blue.500" textDecor="underline">
          Specs
        </Text>
      </NLink>
      )
    </Text>
  </ListItem>
</UnorderedList>


        </Box>


          {
            <Box>
              <PectraTable PectraData={pectraData}/>
            </Box>
          }
        </Box>
        </motion.div>
      </AllLayout>
    </>
  );
};

export default All;
