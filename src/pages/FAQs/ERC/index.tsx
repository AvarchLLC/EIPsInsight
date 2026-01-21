import { VStack } from "@chakra-ui/react";
import React, { useState, useEffect, useLayoutEffect } from "react";
import AllLayout from "@/components/Layout";
import CloseableAdCard from "@/components/CloseableAdCard";
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
  Grid,
  Stack,
  Image,
  Link
} from "@chakra-ui/react";
import NLink from "next/link";
const EIPsInsightRecap = () => {
    const bg = useColorModeValue("#f6f6f7", "#171923");
    const [isDarkMode, setIsDarkMode] = useState(false);
    useEffect(() => {
        if (bg === "#f6f6f7") {
          setIsDarkMode(false);
        } else {
          setIsDarkMode(true);
        }
      });

  return (
    <>
      <AllLayout>
    <Box 
    paddingBottom={{ lg: "10", sm: "10", base: "10" }}
    marginX={{ lg: "40", md: "2", sm: "2", base: "2" }}
    paddingX={{ lg: "10", md: "5", sm: "5", base: "5" }}
    marginTop={{ lg: "10", md: "5", sm: "5", base: "5" }}
    >
      <VStack spacing={6} align="start">
      <Text
        
           transition={{ duration: 0.5 } as any}
           fontSize={{base: "2xl",md:"4xl", lg: "6xl"}}
           fontWeight={{ base: "extrabold", md: "bold", lg: "bold" }}
           color="#30A0E0"
          >
          What is an Ethereum Request for Change (ERC)?
        </Text>

        <Stack 
            direction={{ base: "column", lg: "row" }} // Stack vertically on small screens, horizontally on large screens
            spacing={6} 
            align="center" // Align content in the center
            justify="center" // Center content horizontally and vertically
            >
            {/* Image Box */}
            <Box 
                display="flex" 
                justifyContent="center" 
                width={{ base: "100%", lg: "40%" }} // Image takes up 40% of the width on large screens
            >
               <Image 
  src="/ERCsFAQ.png" 
  alt="Image 1" 
  borderRadius="md" 
  width={{ base: "250px", md: "350px", lg: "100%" }}
  height="auto"
  objectFit="contain"
/>

            </Box>

            {/* Text */}
            <Box 
                width={{ base: "100%", lg: "60%" }} // Text takes up 60% of the width on large screens
                textAlign="justify"
            >     
            <Text fontSize={{ base: "sm", sm: "xs", md: "md" }} mt={4} textAlign="justify">
            The goal of Ethereum Request for Change (<Link href="/erc" color="blue.300" isExternal>ERCs</Link>) is to standardize and provide high-quality documentation for the Ethereum application layer. This repository tracks past and ongoing improvements application standards in the form of ERCs.
              </Text>
              <Text fontSize={{ base: "sm", sm: "xs", md: "md" }} mt={4} textAlign="justify">
                <Link  href="/ercs/erc-1"
                isExternal
                color="blue.500"
                textDecoration="underline"
                _hover={{  color: "blue.700" }}>ERC-1</Link> governs how ERCs are published.
              </Text>
            </Box>
            </Stack>

            {/* EtherWorld Advertisement */}
            <Box my={6} width="100%">
              {/* <CloseableAdCard /> */}
            </Box>

            <Text fontSize={{ base: "sm", sm: "xs", md: "md" }}  mt={4} textAlign="justify">
  The <Link href="/status">status page</Link> tracks and lists ERCs, which can be divided into the following categories:
</Text>
<ul >
  {/* <li>
    <b>
      <Link href="/core" className="text-blue-500 underline">Core EIPs</Link>
    </b> are improvements to the Ethereum consensus protocol.
  </li> */}
  {/* <li>
    <b>
      <Link href="/networking" className="text-blue-500 underline">Networking EIPs</Link>
    </b> specify the peer-to-peer networking layer of Ethereum.
  </li> */}
   <li>
    <b>
      <Link href="/interface" className="text-blue-500 underline">Interface ERCs</Link>
    </b> standardize interfaces to Ethereum, determining how users and applications interact with the blockchain.
  </li>
  {/*<li>
    <b>
      <Link href="/erc" className="text-blue-500 underline">ERCs</Link>
    </b> specify application layer standards, determining how applications running on Ethereum can interact with each other.
  </li> */}
  <li>
    <b>
      <Link href="/meta" className="text-blue-500 underline">Meta ERCs</Link>
    </b> are miscellaneous improvements that nonetheless require some sort of consensus.
  </li>
  <li>
    <b>
      <Link href="/informational" className="text-blue-500 underline">Informational ERCs</Link>
    </b> are non-standard improvements that do not require any form of consensus.
  </li>
</ul>
<Text fontSize={{ base: "sm", sm: "xs", md: "md" }}  mt={4} textAlign="justify">
  Before you write an ERC, ideas MUST be thoroughly discussed on <Link href="https://ethereum-magicians.org/" className="text-blue-500 underline">Ethereum Magicians</Link> or <Link href="https://ethresear.ch/t/read-this-before-posting/8" className="text-blue-500 underline">Ethereum Research</Link>. Once consensus is reached, thoroughly read and review 
  {" "}<Link href="/ercs/erc-1" className="text-blue-500 underline">
    ERC-1
  </Link>, which describes the ERC process.
</Text>

              

        
      </VStack>
    </Box>
    </AllLayout>
    </>
  );
};

export default EIPsInsightRecap;
