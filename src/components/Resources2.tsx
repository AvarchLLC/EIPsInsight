import React, { useState, useEffect } from "react";
import {useColorModeValue, Box, Tab, TabList, TabPanel, TabPanels, Tabs, Text, Image, Link, Flex } from "@chakra-ui/react";
import Header from "./Header";
import { SimpleGrid } from "@chakra-ui/react";


const ResourcesPage: React.FC = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const bg = useColorModeValue("#f6f6f7", "#171923");
  const bg2 = useColorModeValue("gray.50", "gray.700"); // Light mode: gray.50, Dark mode: gray.700
  const textColor2 = useColorModeValue("black", "white"); // Light mode: black, Dark mode: white

  const handleSelection = (hash:any) => {
    if (hash === "EIPsInsight") {
      setTabIndex(0);
    } else if (hash === "EIPs") {
      setTabIndex(1);
    } else if (hash === "PECTRA") {
      setTabIndex(2);
    } else if (hash === "RIPs") {
      setTabIndex(3);
    }
    window.location.hash = hash; // Update the hash in the URL
  };

  useEffect(() => {
    const hash = window.location.hash.slice(1); // Get the hash from the URL
    console.log("Current hash:", hash);

    // Match the hash to the corresponding tab index
    if (hash === "EIPsInsight") {
      setTabIndex(0);
    } else if (hash.toUpperCase() === "EIPs") {
      setTabIndex(1);
    } else if (hash.toUpperCase() === "PECTRA") {
      setTabIndex(2);
    } else if (hash.toUpperCase() === "RIPs") {
      setTabIndex(3);
    }
  }, []);


  

  const Card = ({ image, title, content, link }: { image: string; title: string; content: string; link: string }) => {
    return (
      <Flex
        direction={{ base: "column", md: "row" }}
        bg={bg2}
        p={5}
        borderRadius="lg"
        boxShadow="lg"
        mb={5}
        height={{ base: "300px", sm: "350px", md: "200px" }}
        align="center"
      >
        <Image
          src={image}
          alt={title}
          boxSize={{ base: "150px", md: "150px" }}
          objectFit="cover"
          borderRadius="lg"
          mr={{ md: 5 }}
        />
        <Box flex="1" overflow="hidden">
          <Text
            fontSize={{ base: "sm", md: "lg", lg: "xl" }}
            fontWeight="bold"
            color={textColor2}
            noOfLines={1}
            mb={1}
          >
            {title}
          </Text>
          <Text
            mt={2}
            fontSize={{ base: "sm", md: "md", lg: "lg" }}
            noOfLines={3} // Limit to 3 lines on all screen sizes
            textAlign="justify"
            color={textColor2}
            overflow="hidden" // Ensures text doesn't overflow
          >
            {content}
          </Text>
          <Link href={link} color="blue.400" isExternal>
            Read More
          </Link>
        </Box>
      </Flex>
    );
  };
  
  // export default Card;
  
  

 const EIPS= [
    {
        image: "resources1.jpg",
        title: "An overview of Account Abstraction in Ethereum blockchain",
        content: "An overview of account abstraction, EOA, Contract, EIP-86, EIP-2938, EIP-4337, sponsored transaction and more.",
        link: "https://etherworld.co/2021/10/06/an-overview-of-account-abstraction-in-ethereum-blockchain/"
    },
    {
        image: "resources2.jpg",
        title: "New Ethereum Proposal to Cap the Growth of Active Validators",
        content: "Need, Proposal, Churn Limit, Managing Validator Exits & Activations",
        link: "https://etherworld.co/2023/07/16/new-ethereum-proposal-to-cap-the-growth-of-active-validators/"
    },
    {
        image: "resources3.jpg",
        title: "Ethereum's Dencun upgrade moving towards Devnet 8",
        content: "Devnet 8 Specs, Challenges in Devnet 7, Geth-Related Bugs & c-kzg Library",
        link: "https://etherworld.co/2023/07/11/ethereums-dencun-upgrade-moving-towards-devnet-8/"
    },
    {
        image: "resources7.png",
        title: "Eip - 7516 : BLOBBASEFEE opcode",
        content: "EIP proposes BLOBBASEFEE opcode for smart contracts to manage blob data costs efficiently. It enables trustless accounting and blob gas futures with a gas cost of 2, aligning with conventions, ensuring seamless integration and minimal impact on backward compatibility.",
        link: "https://etherworld.co/2024/01/25/eip-7516-blobbasefee-opcode/"
    },
    {
        image: "resources9.jpg",
        title: "EIP - 7045 Increase Max Attestation Inclusion Slot",
        content: "EIP-7045 introduces a crucial Ethereum upgrade, extending attestation inclusion slots for improved security and efficiency. The article delves into its motivation, technical changes, implications, and impact on consensus and security.",
        link: "https://etherworld.co/2024/01/09/eip-7045/"
    },
    {
        image: "resources10.png",
        title: "EIP-1153 and Transient storage",
        content: "EIP-1153 introduces transient storage, revolutionizing Ethereum's data handling. It addresses gas inefficiencies, enhancing smart contract performance. Explore its impact on inter-frame communication and gas cost efficiency.",
        link: "https://etherworld.co/2024/01/08/eip-1153-and-transient-storage/"
    },
    {
        image: "resources12.png",
        title: "EIP-5656: MCOPY - An efficient EVM instruction",
        content: "EIP-5656 introduces MCOPY. Addressing gas cost challenges, MCOPY benefits, use cases, and impact, presenting a promising upgrade for Ethereum's ecosystem.",
        link: "https://etherworld.co/2023/11/15/eip-5656-mcopy-an-efficient-evm-instruction/"
    },
    {
        image: "resources15.jpg",
        title: "Transient Storage for Beginners",
        content: "EIP-1153: Need, Effects, Pros & Cons, Future Plans",
        link: "https://etherworld.co/2022/12/13/transient-storage-for-beginners/"
    }
]


const PECTRA= [
    {
        image: "pectra4.png",
        title: "EtherWorld Weekly — Edition 301",
        content: "EtherWorld Weekly Edition 301 kicks off the new year with Ethereum’s top 2024 updates, Vitalik’s insights, and upcoming blockchain events. Dive into client releases, governance standards, and the future of AI x crypto!",
        link: "https://etherworld.co/2025/01/05/etherworld-weekly-edition-301/"
    },
    {
        image: "pectra1.jpg",
        title: "Ethereum Developers Push Proposal to increase Gossip Limit",
        content: "Gossip Limit in Blockchain Networks, Current Setup, Reasons for 10 MiB Limit, Challenges, Proposal Objectives, Implementation & Alternatives.",
        link: "https://etherworld.co/2024/12/15/ethereum-developers-push-proposal-to-increase-gossip-limit/"
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
    }
]
const INSIGHT= [
  {
      image: "EipsInsightRecap.jpg",
      title: "EIPsInsight milestones 2024",
      content: "This review highlights the pivotal role played by the Analytics Scheduler, Reviewers Tracker, EIP Board, and other utilities, which together streamline workflows, promote accountability, and optimize the management of proposals.",
      link: "/milestones2024"
  },
  {
      image: "Blockchain_Future.png",
      title: "What is EIPsInsight?",
      content: "EIPsInsight is specialized in toolings designed to provide clear, visual insights into the activity of Ethereum Improvement Proposals (EIPs),  Ethereum Request for Comments (ERCs), Rollup Improvement Proposals (RIPs) over a specified period.",
      link: "/About"
  },
 
]


  const tabContent = [
    {
      label: "EIPsInsight",
      content: (
        <>
            <SimpleGrid 
                columns={{ base: 1, md: 2 }}  // 1 column on small screens, 2 columns on medium and larger screens
                spacing={4}  // Adjust the space between cards
            >
                {INSIGHT.map((eip, index) => (
                <div key={index}>
                    {Card({ 
                    image: eip.image, 
                    title: eip.title, 
                    content: eip.content, 
                    link: eip.link 
                    })}
                </div>
                ))}
            </SimpleGrid>
          </>
      ),
    },
    {
        label: "EIPs",
        content: (
            <>
            <SimpleGrid 
                columns={{ base: 1, md: 2 }}  // 1 column on small screens, 2 columns on medium and larger screens
                spacing={4}  // Adjust the space between cards
            >
                {EIPS.map((eip, index) => (
                <div key={index}>
                    {Card({ 
                    image: eip.image, 
                    title: eip.title, 
                    content: eip.content, 
                    link: eip.link 
                    })}
                </div>
                ))}
            </SimpleGrid>
          </>
        ),
      },
      {
        label: "PECTRA",
        content: (
            <>
            <SimpleGrid 
                columns={{ base: 1, md: 2 }}  // 1 column on small screens, 2 columns on medium and larger screens
                spacing={4}  // Adjust the space between cards
            >
                {PECTRA.map((pectra: { image: string; title: string; content: string; link: string }, index: number) => (
                <div key={index}>
                    {Card({ 
                    image: pectra.image, 
                    title: pectra.title, 
                    content: pectra.content, 
                    link: pectra.link 
                    })}
                </div>
                ))}
            </SimpleGrid>
          </>
          
        ),
      },
      
    {
      label: "RIPs",
      content: (
        <Box bg={bg} p={5} borderRadius="lg" boxShadow="lg">
  <Text fontSize={{ base: "sm", sm: "xs", md: "md" }} className="text-4xl text-blue-400 font-semibold text-left" textAlign="justify">
    What is a Rollup Improvement Proposal (RIP)?
  </Text>
  <Text fontSize={{ base: "sm", sm: "xs", md: "md" }} className="text-xl text-left text-justify" mt={4} textAlign="justify">
    A Rollup Improvement Proposal (RIP) is a formal document that outlines new features, processes, or optimizations for rollup solutions in the Ethereum ecosystem. RIPs act as specifications to improve rollups, enhance interoperability, and standardize development processes.
  </Text>
  <Text fontSize={{ base: "sm", sm: "xs", md: "md" }} className="text-xl text-left text-justify" mt={4} textAlign="justify">
    <Link  href="https://ethereum-magicians.org/t/about-the-rips-category/19805"
    isExternal
    color="blue.500"
    textDecoration="underline"
    _hover={{  color: "blue.700" }}>All RIPs are optional</Link>. RIPs are and will always remain optional standards for Rollups and participants in the larger EVM ecosystem.
  </Text>
  
  <Text fontSize={{ base: "sm", sm: "xs", md: "md" }} className="text-4xl font-semibold text-blue-400 text-left mt-10" textAlign="justify">
    Why are RIPs Important?
  </Text>
  <Text fontSize={{ base: "sm", sm: "xs", md: "md" }} className="text-xl text-left text-justify" mt={4} textAlign="justify">
    RIPs help coordinate technical improvements for rollups in a transparent, collaborative way. They:
  </Text>
  <ul className="list-disc list-inside space-y-2 text-xl text-left text-justify">
    <li>Propose <b>new features</b> and optimizations.</li>
    <li>Collect <b>community feedback</b> on rollup-related issues.</li>
    <li>Serve as a <b>historical record</b> of design decisions.</li>
    <li>Help rollups track progress, especially for multi-client implementations.</li>
  </ul>
  <Text fontSize={{ base: "sm", sm: "xs", md: "md" }} className="text-xl text-left text-justify" mt={4} textAlign="justify">
    By adopting RIPs, rollups can align on standards and ensure better <b>interoperability</b> across Layer 2 solutions. The goal of the RIP project is to standardize and provide high-quality documentation for Rollups in the Ethereum ecosystem.
  </Text>

  <Text fontSize={{ base: "sm", sm: "xs", md: "md" }} className="text-4xl font-semibold text-blue-400 text-left mt-10">
    What are the Different Types of RIPs?
  </Text>
  <Text fontSize={{ base: "sm", sm: "xs", md: "md" }} className="text-xl text-left text-justify" mt={4} textAlign="justify">
    <strong>Standards Track RIPs</strong> - Changes that impact most or all rollup implementations, including:
  </Text>
  <ul className="list-disc list-inside space-y-2 text-xl text-left text-justify">
    <li><b>Core</b>: Changes to network rules, block validity, EVM opcodes, cryptographic updates.</li>
    <li><b>RRC (Rollup Request for Comments)</b>: Application-level standards like token or wallet formats.</li>
    <li><b>Other</b>: Improvements relevant to core developer discussions.</li>
  </ul>
  <Text fontSize={{ base: "sm", sm: "xs", md: "md" }} className="text-xl text-left text-justify" mt={4} textAlign="justify">
    <strong>Meta RIPs</strong> - Proposals related to rollup processes, governance, or the RIP process itself. These are not technical but focus on <b>procedures, tools, or guidelines</b>.
  </Text>

  <Text fontSize={{ base: "sm", sm: "xs", md: "md" }} className="text-4xl font-semibold text-blue-400 text-left mt-10" textAlign="justify">
    What is the RIP Process?
  </Text>
  <Text fontSize={{ base: "sm", sm: "xs", md: "md" }} className="text-xl text-left text-justify" mt={4} textAlign="justify">
    The RIP process follows these steps:
  </Text>
  <ul className="list-disc list-inside space-y-2 text-xl text-left text-justify">
    <li><b>Idea Stage</b>: Share your proposal idea for initial feedback (e.g., Ethereum Magicians forum).</li>
    <li><b>Draft</b>: Submit a formal RIP using the template provided.</li>
    <li><b>Review</b>: Invite community discussion and peer review.</li>
    <li><b>Final</b>: Once accepted, the RIP becomes the standard and is ready for implementation.</li>
    <li><b>Stagnant</b>: RIPs inactive for 6+ months may be labeled as stagnant.</li>
    <li><b>Withdrawn</b>: Proposals that authors decide to discontinue.</li>
    <li><b>Living</b>: RIPs continually updated without reaching a final state.</li>
  </ul>
  <Text fontSize={{ base: "sm", sm: "xs", md: "md" }} className="text-xl text-left text-justify" mt={4} textAlign="justify">
    <b>Tip</b>: For Core RIPs, presenting your proposal during  <Link  href="https://github.com/ethereum/pm/issues"
    isExternal
    color="blue.500"
    textDecoration="underline"
    _hover={{  color: "blue.700" }}>Rollcall meetings</Link> is the best way to gather technical feedback and consensus from rollup core teams.
  </Text>

  <Text fontSize={{ base: "sm", sm: "xs", md: "md" }} className="text-4xl font-semibold text-blue-400 text-left mt-10" textAlign="justify">
    Who Can Submit a RIP?
  </Text>
  <Text fontSize={{ base: "sm", sm: "xs", md: "md" }} className="text-xl text-left text-justify" mt={4} textAlign="justify">
    Anyone! Whether you're a developer, researcher, or rollup enthusiast, you can submit an RIP. Before drafting:
  </Text>
  <ul className="list-disc list-inside space-y-2 text-xl text-left text-justify">
    <li>Discuss your idea on the <Link  href="https://ethereum-magicians.org/"
    isExternal
    color="blue.500"
    textDecoration="underline"
    _hover={{  color: "blue.700" }}>Ethereum Magicians Forum</Link>.</li>
    <li>Collaborate with rollup teams early to build consensus.</li>
  </ul>

  <Text fontSize={{ base: "sm", sm: "xs", md: "md" }} className="text-4xl font-semibold text-blue-400 text-left mt-10" textAlign="justify">
    What Makes a Successful RIP?
  </Text>
  <Text fontSize={{ base: "sm", sm: "xs", md: "md" }} className="text-xl text-left text-justify" mt={4} textAlign="justify">
    A strong RIP includes:
  </Text>
  <ul className="list-disc list-inside space-y-2 text-xl text-left text-justify">
    <li><b>Clear Specification</b>: Detailed syntax and semantics of the proposed change.</li>
    <li><b>Motivation</b>: Why the change is necessary.</li>
    <li><b>Rationale</b>: Design decisions and alternatives considered.</li>
    <li><b>Security Considerations</b>: Risks, mitigations, and guidance.</li>
    <li><b>Backwards Compatibility</b>: Notes on how the proposal impacts existing implementations.</li>
  </ul>

  <Text fontSize={{ base: "sm", sm: "xs", md: "md" }} className="text-4xl font-semibold text-blue-400 text-left mt-10" textAlign="justify">
    How Do I Format a RIP?
  </Text>
  <Text fontSize={{ base: "sm", sm: "xs", md: "md" }} className="text-xl text-left text-justify" mt={4} textAlign="justify">
    RIPs must follow a specific template and structure in Markdown format. Each RIP includes:
  </Text>
  <ul className="list-disc list-inside space-y-2 text-xl text-left text-justify">
    <li><b>Preamble</b>: Metadata such as RIP number, title, author(s), and status.</li>
    <li><b>Abstract</b>: A brief technical summary.</li>
    <li><b>Specification</b>: A detailed technical description of the proposal.</li>
    <li><b>Rationale</b>: Explanation of design choices.</li>
    <li><b>Security Considerations</b>: Assessment of potential risks.</li>
    <li><b>Test Cases (if applicable)</b>: Mandatory for consensus changes.</li>
    <li><b>Reference Implementation (optional)</b>: Code to aid understanding.</li>
  </ul>
  <Text fontSize={{ base: "sm", sm: "xs", md: "md" }} className="text-xl text-left text-justify" mt={4} textAlign="justify">
    Refer to the <Link  href="https://github.com/ethereum/RIPs/blob/master/rip-template.md"
    isExternal
    color="blue.500"
    textDecoration="underline"
    _hover={{  color: "blue.700" }}>RIP Template</Link> for guidelines.
  </Text>

  <Text fontSize={{ base: "sm", sm: "xs", md: "md" }} className="text-4xl font-semibold text-blue-400 text-left mt-10" textAlign="justify">
    Who Oversees the RIP Process?
  </Text>
  <Text fontSize={{ base: "sm", sm: "xs", md: "md" }} className="text-xl text-left text-justify" mt={4} textAlign="justify">
    RIP Editors ensure proposals are well-formatted and ready for review. They do not decide the merits of a proposal. Current RIP editors include:
  </Text>
  <ul className="list-disc list-inside space-y-2 text-xl text-left text-justify">
    <li><b>Ansgar Dietrichs</b></li>
    <li><b>Carl Beekhuizen</b></li>
    <li><b>Yoav Weiss</b></li>
    <li><b>Nicolas Consigny</b></li>
  </ul>

  <Text fontSize={{ base: "sm", sm: "xs", md: "md" }} className="text-4xl font-semibold text-blue-400 text-left mt-10" textAlign="justify">
    Where Can I Track RIPs and Rollup Progress?
  </Text>
  <ul className="list-disc list-inside space-y-2 text-xl text-left text-justify">
    <li><b>GitHub Repository</b>: <Link  href="https://github.com/ethereum/RIPs"
    isExternal
    color="blue.500"
    textDecoration="underline"
    _hover={{  color: "blue.700" }}>RIP Repository</Link></li>
    <li><b>Discussions</b>: 
    <Link  href="https://ethereum-magicians.org/"
    isExternal
    color="blue.500"
    textDecoration="underline"
    _hover={{  color: "blue.700" }}>
      Ethereum Magicians Forum</Link></li>
    <li><b>Rollup Status</b>: <Link  href="https://l2beat.com/scaling/summary"
    isExternal
    color="blue.500"
    textDecoration="underline"
    _hover={{  color: "blue.700" }}>
      L2BEAT</Link></li>
    <li><b>Comparison of Rollups</b>: <Link  href="https://www.rollup.codes/"
    isExternal
    color="blue.500"
    textDecoration="underline"
    _hover={{  color: "blue.700" }}>
      rollup.codes</Link></li>
  </ul>

  <Text fontSize={{ base: "sm", sm: "xs", md: "md" }} className="text-4xl font-semibold text-blue-400 text-left mt-10" textAlign="justify">
    What Happens After a RIP is Final?
  </Text>
  <Text fontSize={{ base: "sm", sm: "xs", md: "md" }} className="text-xl text-left text-justify" mt={4} textAlign="justify">
    Once an RIP is accepted and implemented by at least one rollup on their mainnet, it becomes a <b>Final RIP</b>. Care is taken to resolve any conflicts before deployment to avoid competing standards.
  </Text>

  <Text fontSize={{ base: "sm", sm: "xs", md: "md" }} className="text-4xl font-semibold text-blue-400 text-left mt-10" textAlign="justify">
    How Do I Stay Involved?
  </Text>
  <ul className="list-disc list-inside space-y-2 text-xl text-left text-justify">
    <li><b>Contribute</b>: Submit your RIP or provide feedback on existing proposals.</li>
    <li><b>Discuss</b>: Join community discussions on forums and GitHub.</li>
    <li><b>Engage</b>: Present your RIP at Rollcall meetings to build consensus.</li>
  </ul>

  <Text fontSize={{ base: "sm", sm: "xs", md: "md" }} className="text-4xl font-semibold text-blue-400 text-left mt-10"textAlign="justify">
    Where Can I Find More Information?
  </Text>
  <ul className="list-disc list-inside space-y-2 text-xl text-left text-justify">
    <li><b>RIP Template</b>: <Link  href="https://github.com/ethereum/RIPs/blob/master/rip-template.md"
    isExternal
    color="blue.500"
    textDecoration="underline"
    _hover={{  color: "blue.700" }}>Link to Template</Link></li>
    <li><b>RIP Discussions</b>: <Link  href="https://ethereum-magicians.org/"
    isExternal
    color="blue.500"
    textDecoration="underline"
    _hover={{  color: "blue.700" }}>
      Ethereum Magicians Forum</Link></li>
    <li><b>Rollup Specifications</b>: <Link  href="https://www.rollup.codes/"
    isExternal
    color="blue.500"
    textDecoration="underline"
    _hover={{  color: "blue.700" }}>
      rollup.codes</Link></li>
  </ul>

  <Text fontSize={{ base: "sm", sm: "xs", md: "md" }} className="text-xl text-left text-justify" mt={6} textAlign="justify">
    By collaborating through RIPs, we can drive innovation and ensure a shared, open-source approach to improving Ethereum rollup solutions.
  </Text>
</Box>

      ),
    },
  ];

  return (
    <Box
      paddingBottom={{ lg: "10", sm: "10", base: "10" }}
      paddingX={{ lg: "10", md: "5", sm: "5", base: "5" }}
      marginTop={{ lg: "10", md: "5", sm: "5", base: "5" }}
      className="flex flex-col space-x-6"
    >  <Box ml={5}>
      <Header title="Resources" subtitle="" />
      </Box>
      <Tabs isFitted variant="soft-rounded" index={tabIndex} // Control the active tab
      onChange={(key) => {
        // Update the tab index and hash when the tab is changed
        if (key === 0) handleSelection("EIPsInsight");
        if (key === 1) handleSelection("EIPs");
        if (key === 2) handleSelection("PECTRA");
        if (key === 3) handleSelection("RIPs");
      }}>
     <Box mt={2} borderRadius="10px 10px 0 0">
  <Flex
    justify="space-between"
    bg="gray.700"
    p={1}
    mb={1}
    borderRadius="md"
  >
    <TabList
      mb={1}
      display="flex"
      flexWrap="wrap" // Enable wrapping for tabs
      width="100%"
      gap={2} // Add spacing between tabs
    >
      {tabContent.map((tab, index) => (
        <Tab
          key={index}
          _selected={{
            bg: "gray.800",
            color: "white",
            borderColor: "lightblue",
            paddingY: 2,
          }}
          _hover={{
            bg: "gray.600",
          }}
          p={2}
          flex={{ base: "1 1 calc(50% - 1rem)", md: "1 1 calc(25% - 1rem)" }} // Responsive flex basis
          textAlign="center"
          borderRadius="md"
          boxShadow="sm"
          cursor="pointer"
          color="white"
          whiteSpace="normal" // Allow text wrapping
          wordBreak="break-word" // Handle long words
        >
          {tab.label}
        </Tab>
      ))}
    </TabList>
  </Flex>
</Box>


      <TabPanels>
        {tabContent.map((tab, index) => (
          <TabPanel key={index}>{tab.content}</TabPanel>
        ))}
      </TabPanels>
    </Tabs>
    </Box>
  );
};

export default ResourcesPage;
