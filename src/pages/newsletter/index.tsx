import { VStack } from "@chakra-ui/react";
import React, { useState, useEffect, useLayoutEffect } from "react";
import CloseableAdCard from "@/components/CloseableAdCard";
import PlaceYourAdCard from "@/components/PlaceYourAdCard";
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
  Grid,
  Stack,
  Image,
  Link
} from "@chakra-ui/react";
import NLink from "next/link";
const EIPsInsightRecap = () => {
    const bg = useColorModeValue("#f6f6f7", "#171923");
    const textColor = useColorModeValue("gray.700", "gray.200");
    const headingColor = useColorModeValue("#30A0E0", "#4FD1FF");
    const linkColor = useColorModeValue("blue.500", "blue.300");
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
          EIPsInsight Newsletter Issue #[01] | [02-07-2025]
        </Text>
        <Text
        
           transition={{ duration: 0.5 } as any}
           fontSize={{base: "xl",md:"xl", lg: "xl"}}
           fontWeight={{ base: "extrabold", md: "bold", lg: "bold" }}
           color="#30A0E0"
          >
          Bringing You the Latest in Ethereum Improvement Proposals
        </Text>

        {/* EtherWorld Advertisement */}
        <Box w="100%" my={6}>
          <CloseableAdCard />
        </Box>
        {/* Advertise With Us (moved lower for spacing) */}
        

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
  src="/EIP_blog1.png" 
  alt="Image 1" 
  borderRadius="md" 
  width={{ base: "250px", md: "350px", lg: "100%" }}
  height="auto"
  objectFit="contain"
/>

            </Box>

            {/* Text */}
            <Box width={{ base: "100%", lg: "60%" }} textAlign="justify">
            <Text fontSize={{ base: "xl", sm: "xl", md: "xl" }} textAlign="justify">
                ðŸ”¹ <Text as="span" fontWeight="bold" color={textColor}>Featured EIP of the Week:</Text> <br />
            </Text>
            <br/>
                <Text as="span" fontWeight="bold" color={textColor}>
                  <Link color={linkColor} href="/eips/eip-7702">EIP-7702 </Link>: Set EOA Account Code
                </Text> <br />
                <br/>
                <Text as="span" fontWeight="bold" color={textColor}>Author(s):</Text> 
                <Link color={linkColor} href="https://x.com/vitalikbuterin" isExternal>Vitalik Buterin (@vbuterin)</Link>, 
                <Link color={linkColor} href="https://x.com/_samwilsn_" isExternal>Sam Wilson (@SamWilsn)</Link>, 
                <Link color="blue.300" href="https://x.com/adietrichs" isExternal>Ansgar Dietrichs (@adietrichs)</Link>, 
                <Link color="blue.300"href="https://x.com/lightclients" isExternal>lightclient (@lightclient)</Link> <br />
                <br/>
                <b>Status:</b> Review <br />
               
           
            </Box>
            </Stack>

        {/* Advertise With Us (placed after hero section) */}
        <Box w="100%" my={12}>
          <PlaceYourAdCard />
        </Box>





            <Box width={{ base: "100%"}} textAlign="justify">

            <Text fontSize={{ base: "md", sm: "md", md: "xl" }}  mt={4} textAlign="justify">
            
                
                ðŸ“Œ <b>Brief Summary:</b> 
                EIP-7702 allows 
                <Link color="blue.300"href="https://youtu.be/RlC0vTKzL2w?si=YGmheazLHakmxfky" isExternal>externally owned accounts (EOAs)</Link> 
                to temporarily execute smart contract code for a single transaction. 
                This improves Ethereum usability by enabling transaction batching, gas fee sponsorship, and permission-based access control. 
                It achieves this by introducing a new transaction type that assigns executable code to EOAs dynamically. 
                This change enhances security, efficiency, and forward compatibility with future 
                <Link color="blue.300"href="https://etherworld.co/2021/10/06/an-overview-of-account-abstraction-in-ethereum-blockchain/" isExternal>account abstraction</Link> 
                {" "}improvements. <br />
                
                ðŸ”— <b>
                <Link color="blue.300"href="https://eipsinsight.com/eips/eip-7702" isExternal>Read the Full EIP</Link>
                </b>
            </Text>
  <Text fontSize={{ base: "md", sm: "md", md: "xl" } } mt={4}>
    ðŸ“¢ <b>Latest EIP Updates</b> <br />
    Stay informed with the most recent developments in Ethereum Improvement Proposals:
  </Text>
  <UnorderedList>
    <ListItem>
      <Link color="blue.300"href="https://eipsinsight.com/eips/eip-7727" isExternal>
        EIP-7727: EVM Transaction Bundles
      </Link>{" "}
      has moved to <i>Stagnant</i> Status.
    </ListItem>
  </UnorderedList>
  <Text fontSize={{ base: "sm", sm: "md", md: "xl" }}  mt={2}>
    ðŸ”— <Link color="blue.300"href="https://eipsinsight.com/eips/" isExternal>Explore All EIPs</Link>
  </Text>

  <Text fontSize={{ base: "sm", sm: "md", md: "xl" }} mt={6}  fontWeight="bold">ðŸ› ï¸ Community Discussions & Proposals</Text>
  <Text fontSize={{ base: "sm", sm: "md", md: "xl" }}  mt={2}>
    Get involved in the latest debates and contributions:
  </Text>

  <Text fontSize={{ base: "sm", sm: "md", md: "xl" }}   mt={2}>
    <b>Hot Discussions:</b> 
    <Link color="blue.300"href="https://ethereum-magicians.org/t/pectra-retrospective/22637" isExternal>
      Pectra Retrospective
    </Link>{" "}
    - A coordination thread to reflect on Pectra & improve the AllCoreDevs (ACD) process before moving to Fusaka planning.
  </Text>

  <Text fontSize={{ base: "sm", sm: "md", md: "xl" }}   mt={4}><b>Call for Review:</b></Text>
  <UnorderedList>
    <ListItem>
      <Link fontSize={{ base: "sm", sm: "md", md: "xl" }} color="blue.300"href="https://github.com/ethcatherders/EIPIP/issues/376" isExternal>
        Call for Input: Allow Links to Blockchain Commons
      </Link>
    </ListItem>
    <ListItem>
      <Link  fontSize={{ base: "sm", sm: "md", md: "xl" }} color="blue.300"href="https://github.com/ethcatherders/EIPIP/issues/374" isExternal>
        Call for Input: Forcibly withdraw EIP-7675
      </Link>
    </ListItem>
    <ListItem>
      <Link fontSize={{ base: "sm", sm: "md", md: "xl" }} color="blue.300"href="https://github.com/ethcatherders/EIPIP/issues/373" isExternal>
        Call for Input: Define "Meta" as only relating to processes
      </Link>
    </ListItem>
  </UnorderedList>

  <Text fontSize={{ base: "sm", sm: "md", md: "xl" }}   mt={4}><b>Upcoming Dev Meetings:</b></Text>
  <UnorderedList>
    <ListItem>
      <Link fontSize={{ base: "sm", sm: "md", md: "xl" }} color="blue.300"href="https://github.com/ethereum/pm/issues/1278" isExternal>
        eth_simulate Implementers' Meeting - Feb 10, 2025 @ 12:00 UTC
      </Link>
    </ListItem>
    <ListItem>
      <Link fontSize={{ base: "sm", sm: "md", md: "xl" }} color="blue.300"href="https://github.com/ethereum/pm/issues/1263" isExternal>
        Stateless Implementers Call #30 - Feb 10, 15:00 UTC
      </Link>
    </ListItem>
    <ListItem>
      <Link fontSize={{ base: "sm", sm: "md", md: "xl" }} color="blue.300"href="https://github.com/ethereum/pm/issues/1216" isExternal>
        RollCall #10 - Feb 12, 2025, 14:00 UTC
      </Link>
    </ListItem>
    <ListItem>
      <Link fontSize={{ base: "sm", sm: "md", md: "xl" }} color="blue.300"href="https://github.com/ethereum/pm/issues/1274" isExternal>
        EVM Resource Pricing Breakout #2 - Feb 12th @ 16:00 UTC
      </Link>
    </ListItem>
    <ListItem>
      <Link fontSize={{ base: "sm", sm: "md", md: "xl" }} color="blue.300"href="https://github.com/ethereum/pm/issues/1279" isExternal>
        L2 Interop Working Group - Call #3 - Feb 13th @ 16:00 UTC
      </Link>
    </ListItem>
    <ListItem>
      <Link fontSize={{ base: "sm", sm: "md", md: "xl" }} color="blue.300"href="https://github.com/ethereum/pm/issues/1271" isExternal>
        Execution Layer Meeting 205 - Feb 13, 2025 @ 14:00 UTC
      </Link>
    </ListItem>
  </UnorderedList>

  <Text  fontSize={{ base: "sm", sm: "md", md: "xl" }}   mt={6} fontWeight="bold">ðŸ“… Upcoming Ethereum Events</Text>
  <UnorderedList>
    <ListItem>
      <Link fontSize={{ base: "sm", sm: "md", md: "xl" }} color="blue.300"href="https://ethoxford.io/" isExternal>ETH Oxford hackathon</Link> - Feb 7-9
    </ListItem>
    <ListItem>
      <Link fontSize={{ base: "sm", sm: "md", md: "xl" }} color="blue.300"href="https://eth-iopia.xyz/" isExternal>ETHiopia conference & hackathon</Link> - Feb 10-16
    </ListItem>
    <ListItem>
      <Link fontSize={{ base: "sm", sm: "md", md: "xl" }} color="blue.300"href="https://www.ethdenver.com/" isExternal>ETHDenver</Link> - Feb 23 â€“ Mar 2
    </ListItem>
    <ListItem>
      <Link fontSize={{ base: "sm", sm: "md", md: "xl" }} color="blue.300"href="https://www.ethpondy.xyz/" isExternal>ETH Pondy (Puducherry) hackathon</Link> - Mar 28-30
    </ListItem>
    <ListItem>
      <Link fontSize={{ base: "sm", sm: "md", md: "xl" }} color="blue.300"href="https://ethbucharest.ro/" isExternal>ETH Bucharest hackathon & conference</Link> - Apr 2-5
    </ListItem>
  </UnorderedList>

  <Text fontSize={{ base: "sm", sm: "md", md: "xl" }}   mt={6} fontWeight="bold">ðŸ“° Latest Blockchain News</Text>
  <UnorderedList>
    <ListItem fontSize={{ base: "sm", sm: "md", md: "xl" }}>
      <b>Highlights of Ethereum's All Core Devs Meeting (ACDC) #150</b> - Key discussions on Pectra, PeerDAS, Testnet, and security measures. 
      <Link color="blue.300"href="https://etherworld.co/2025/02/03/india-to-change-crypto-strategy-as-global-trends-shift/" isExternal> [EtherWorld.co]</Link>
    </ListItem>
    <ListItem fontSize={{ base: "sm", sm: "md", md: "xl" }}>
      <b>India to Change Crypto Strategy as Global Trends Shift</b> - Regulatory discussions intensify as global crypto adoption grows. 
      <Link color="blue.300"href="https://etherworld.co/2025/02/03/india-to-change-crypto-strategy-as-global-trends-shift/" isExternal> [EtherWorld.co]</Link>
    </ListItem>
    <ListItem fontSize={{ base: "sm", sm: "md", md: "xl" }}>
      <b>Brazil's Crypto Surge</b> - 90% of transactions tied to stablecoins. 
      <Link color="blue.300"href="https://www.reuters.com/technology/brazils-galipolo-sees-surge-crypto-use-says-90-flow-tied-stablecoins-2025-02-06/" isExternal> [Reuters.com]</Link>
    </ListItem>
    <ListItem fontSize={{ base: "sm", sm: "md", md: "xl" }}>
      <b>BlackRock's Bitcoin ETP in Europe</b> - Investment firm launching Bitcoin ETP in Switzerland. 
      <Link color="blue.300"href="https://www.reuters.com/technology/blackrock-prepares-launch-bitcoin-exchange-traded-product-europe-source-says-2025-02-05/" isExternal> [Reuters.com]</Link>
    </ListItem>
    <ListItem fontSize={{ base: "sm", sm: "md", md: "xl" }}>
      <b>EU's MiCA Implementation</b> - Crypto exchanges expand as MiCA regulations take effect. 
      <Link color="blue.300"href="https://www.fnlondon.com/articles/crypto-exchanges-eye-eu-expansion-uk-plays-a-catch-up-game-f012b451" isExternal> [Reuters.com]</Link>
    </ListItem>
  </UnorderedList>

  <Text mt={6} fontSize={{ base: "sm", sm: "md", md: "xl" }}>
    ðŸ”— <b>Follow us on Twitter:</b> 
    <Link color="blue.300"href="https://x.com/TeamAvarch" isExternal> EIPsInsight</Link> for the latest EIP Updates.
  </Text>

  <Text fontSize={{ base: "sm", sm: "md", md: "xl" }}    mt={4}>Thank you for being part of the Ethereum community! Stay tuned for next weekâ€™s insights.</Text>
  <br/>
  <br/>
  <Text fontSize={{ base: "sm", sm: "md", md: "xl" }}   fontWeight="bold">Regards, <br /> EIPsInsight Team</Text>
</Box>

        
      </VStack>
    </Box>
    </AllLayout>
    </>
  );
};

export default EIPsInsightRecap;
