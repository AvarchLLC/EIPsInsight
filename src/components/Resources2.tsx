import React, { useState, useEffect } from "react";
import {useColorModeValue, Box, Tab, TabList, TabPanel, TabPanels, Tabs, Text, Image, Link, Flex } from "@chakra-ui/react";
import Header from "./Header";
import { SimpleGrid } from "@chakra-ui/react";


const ResourcesPage: React.FC = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const bg = useColorModeValue("#f6f6f7", "#171923");

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
    } else if (hash === "EIPs") {
      setTabIndex(1);
    } else if (hash === "PECTRA") {
      setTabIndex(2);
    } else if (hash === "RIPs") {
      setTabIndex(3);
    }
  }, []);


  

  const Card = ({ image, title, content, link }: { image: string; title: string; content: string; link: string }) => (
    <Flex
      direction={{ base: "column", md: "row" }}
      bg={bg}
      p={5}
      borderRadius="lg"
      boxShadow="lg"
      mb={5}
      height={{ base: "300px", sm: "350px", md: "200px" }}
    align="flex-start" // Aligns content to the top
    
    >
      <Image
        src={image}
        alt={title}
        boxSize={{ base: "100%", md: "150px" }}
        objectFit="cover"
        borderRadius="lg"
        mr={{ md: 5 }}
      />
      <Box>
      <Text
        fontSize={{ base: "sm", md: "lg", lg: "xl" }} // Adjust font size for title
        fontWeight="bold" textAlign="justify"
      >
          {title}
        </Text>
        <Text
        mt={2}
        fontSize={{ base: "sm", sm: "xs", md: "md" }} // Adjust font size for content
        display={{ base: "none", md: "none",lg:"block" }} // Hide content on sm screens
        // noOfLines={3}
        textAlign="justify"
      >
          {content}
        </Text>
        <Link href={link} color="blue.400" isExternal>
          Read More
        </Link>
      </Box>
    </Flex>
  );
  

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

  const tabContent = [
    {
      label: "EIPsInsight",
      content: (
        <Box>
          {/* Cards */}
          <Flex
            direction={{ base: "column", md: "row" }}
            bg={bg}
            p={5}
            borderRadius="lg"
            boxShadow="lg"
            mb={5}
          >
            <Image
              src="EipsInsightRecap.jpg"
              alt="EipsInsight"
              boxSize={{ base: "100%", md: "150px" }}
              objectFit="cover"
              borderRadius="lg"
              mr={{ md: 5 }}
            />
            <Box>
              <Text fontSize="2xl" fontWeight="bold" textAlign="justify">
                Eipsinsight milestones 2024
              </Text>
              <Text mt={2} fontSize={{ base: "sm", sm: "xs", md: "md" }} textAlign="justify">
                As the Ethereum Improvement Proposals (EIPs) play an important role in shaping Ethereum's future, tools
                like EIPs Insight offer valuable analytics and tracking solutions to enhance transparency and
                efficiency. This review highlights the pivotal role played by the Analytics Scheduler, Reviewers
                Tracker, EIP Board, and other utilities, which together streamline workflows, promote accountability,
                and optimize the management of proposals.
              </Text>
              <Link
                href="https://etherworld.co/2024/12/30/eips-insight-recap-2024-milestones/"
                color="blue.400"
                isExternal
              >
                Read More
              </Link>
            </Box>
          </Flex>

          {/* Below Content */}
          <Box bg={bg} p={5} borderRadius="lg" boxShadow="lg">
  <Text 
    fontSize={{ base: "sm", sm: "xs", md: "xl" }} 
    fontWeight="semibold" 
    color="blue.400" 
    textAlign="justify"
  >
    What is EIPsInsight?
  </Text>

  <Text 
    fontSize={{ base: "sm", sm: "xs", md: "xl" }} 
    mt={4} 
    textAlign="justify"
  >
    EIPsInsight is specialized in toolings designed to provide clear, visual insights into the activity of{" "}
    <Link href="https://github.com/ethereum/EIPs" color="blue.400" isExternal className="underline">
      Ethereum Improvement Proposals (EIPs)
    </Link>,{" "}
    <Link href="https://github.com/ethereum/ERCs" color="blue.400" isExternal className="underline">
      Ethereum Request for Comments (ERCs)
    </Link>, and{" "}
    <Link href="https://github.com/ethereum/RIPs" color="blue.400" isExternal className="underline">
      Rollup Improvement Proposals (RIPs)
    </Link>{" "}
    over a specified period. Data provided is used for tracking the progress and workload distribution among
    EIP Editors, ensuring transparency and efficiency in the proposal review process.
  </Text>

  <Text 
    fontSize={{ base: "sm", sm: "xs", md: "xl" }} 
    mt={4} 
    textAlign="justify"
  >
    EIPsInsight is a tooling platform dedicated to providing in-depth analysis, up-to-date information, and
    comprehensive insights on Ethereum Standards. Our mission is to empower editors, developers, stakeholders,
    and the broader Ethereum community with the knowledge and tools necessary to understand and engage with
    the ongoing evolution of the Ethereum Standards.
  </Text>

  <Text 
    fontSize={{ base: "sm", sm: "xs", md: "xl" }} 
    fontWeight="semibold" 
    color="blue.400" 
    textAlign="justify" 
    mt={10}
  >
    Key Features:
  </Text>

  <ul className="list-disc list-inside space-y-2 text-left text-justify">
    <li>
      <strong>Monthly Insight:</strong> Follow the status change of proposals under different types and
      categories with beautiful charts and tables providing details.
    </li>
    <li>
      <strong>Toolings:</strong> Make use of different toolings such as "Editor Review Tracker" and "Issues
      and PRs Trackers" which will provide the proposals added, reviewed and moved to various statuses by EIP
      Editors. These will be helpful for tracking the progress and workload distribution among EIP Editors,
      ensuring transparency and efficiency in the proposal review process.
    </li>
    <li>
      <strong>Detailed EIP Database:</strong> Explore our extensive database of EIPs, complete with detailed
      descriptions, statuses, and relevant discussions. Whether you're looking for historical proposals or the
      latest advancements, our database is your go-to resource.
    </li>
    <li>
      <strong>Expert Analysis:</strong> Gain access to expert commentary and analysis on significant EIPs,
      their potential impacts, and the broader implications for the Ethereum ecosystem. Our team of
      experienced analysts and contributors ensure you have the most accurate and relevant insights.
    </li>
    <li>
      <strong>Community Engagement:</strong> Join the conversation with our vibrant community of Ethereum
      enthusiasts, developers, and stakeholders. Participate in forums, provide feedback on proposals, and
      stay connected with the latest developments in the Ethereum space.
    </li>
    <li>
      <strong>Educational Resources:</strong> New to EIPs? Our educational resources are designed to help you
      understand the proposal process, the technical details, and the importance of various EIPs. From
      beginners to seasoned developers, there's something for everyone.
    </li>
    <li>
      <strong>Regular Updates:</strong> Stay informed with our regular updates and newsletters. Get the latest
      news, changes, and discussions surrounding EIPs delivered straight to your inbox.
    </li>
  </ul>

  <Text 
    fontSize={{ base: "sm", sm: "xs", md: "xl" }} 
    mt={6} 
    textAlign="justify"
  >
    At EIPsInsight, we believe in the power of open-source collaboration and the continuous improvement of the
    Ethereum network.{" "}
    <Link href="https://x.com/TeamAvarch" color="blue.400" isExternal className="underline">
      Join us
    </Link>{" "}
    in exploring the future of Ethereum, one proposal at a time.
  </Text>
</Box>

        </Box>
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
    All RIPs are optional. RIPs are and will always remain optional standards for Rollups and participants in the larger EVM ecosystem.
  </Text>
  
  <Text fontSize={{ base: "sm", sm: "xs", md: "md" }} className="text-4xl font-semibold text-blue-400 text-left mt-10" textAlign="justify">
    Why are RIPs Important?
  </Text>
  <Text fontSize={{ base: "sm", sm: "xs", md: "md" }} className="text-xl text-left text-justify" mt={4} textAlign="justify">
    RIPs help coordinate technical improvements for rollups in a transparent, collaborative way. They:
  </Text>
  <ul className="list-disc list-inside space-y-2 text-xl text-left text-justify">
    <li>Propose new features and optimizations.</li>
    <li>Collect community feedback on rollup-related issues.</li>
    <li>Serve as a historical record of design decisions.</li>
    <li>Help rollups track progress, especially for multi-client implementations.</li>
  </ul>
  <Text fontSize={{ base: "sm", sm: "xs", md: "md" }} className="text-xl text-left text-justify" mt={4} textAlign="justify">
    By adopting RIPs, rollups can align on standards and ensure better interoperability across Layer 2 solutions. The goal of the RIP project is to standardize and provide high-quality documentation for Rollups in the Ethereum ecosystem.
  </Text>

  <Text fontSize={{ base: "sm", sm: "xs", md: "md" }} className="text-4xl font-semibold text-blue-400 text-left mt-10">
    What are the Different Types of RIPs?
  </Text>
  <Text fontSize={{ base: "sm", sm: "xs", md: "md" }} className="text-xl text-left text-justify" mt={4} textAlign="justify">
    <strong>Standards Track RIPs</strong> - Changes that impact most or all rollup implementations, including:
  </Text>
  <ul className="list-disc list-inside space-y-2 text-xl text-left text-justify">
    <li>Core: Changes to network rules, block validity, EVM opcodes, cryptographic updates.</li>
    <li>RRC (Rollup Request for Comments): Application-level standards like token or wallet formats.</li>
    <li>Other: Improvements relevant to core developer discussions.</li>
  </ul>
  <Text fontSize={{ base: "sm", sm: "xs", md: "md" }} className="text-xl text-left text-justify" mt={4} textAlign="justify">
    <strong>Meta RIPs</strong> - Proposals related to rollup processes, governance, or the RIP process itself. These are not technical but focus on procedures, tools, or guidelines.
  </Text>

  <Text fontSize={{ base: "sm", sm: "xs", md: "md" }} className="text-4xl font-semibold text-blue-400 text-left mt-10" textAlign="justify">
    What is the RIP Process?
  </Text>
  <Text fontSize={{ base: "sm", sm: "xs", md: "md" }} className="text-xl text-left text-justify" mt={4} textAlign="justify">
    The RIP process follows these steps:
  </Text>
  <ul className="list-disc list-inside space-y-2 text-xl text-left text-justify">
    <li>Idea Stage: Share your proposal idea for initial feedback (e.g., Ethereum Magicians forum).</li>
    <li>Draft: Submit a formal RIP using the template provided.</li>
    <li>Review: Invite community discussion and peer review.</li>
    <li>Final: Once accepted, the RIP becomes the standard and is ready for implementation.</li>
    <li>Stagnant: RIPs inactive for 6+ months may be labeled as stagnant.</li>
    <li>Withdrawn: Proposals that authors decide to discontinue.</li>
    <li>Living: RIPs continually updated without reaching a final state.</li>
  </ul>
  <Text fontSize={{ base: "sm", sm: "xs", md: "md" }} className="text-xl text-left text-justify" mt={4} textAlign="justify">
    Tip: For Core RIPs, presenting your proposal during Rollcall meetings is the best way to gather technical feedback and consensus from rollup core teams.
  </Text>

  <Text fontSize={{ base: "sm", sm: "xs", md: "md" }} className="text-4xl font-semibold text-blue-400 text-left mt-10" textAlign="justify">
    Who Can Submit a RIP?
  </Text>
  <Text fontSize={{ base: "sm", sm: "xs", md: "md" }} className="text-xl text-left text-justify" mt={4} textAlign="justify">
    Anyone! Whether you're a developer, researcher, or rollup enthusiast, you can submit an RIP. Before drafting:
  </Text>
  <ul className="list-disc list-inside space-y-2 text-xl text-left text-justify">
    <li>Discuss your idea on the Ethereum Magicians Forum.</li>
    <li>Collaborate with rollup teams early to build consensus.</li>
  </ul>

  <Text fontSize={{ base: "sm", sm: "xs", md: "md" }} className="text-4xl font-semibold text-blue-400 text-left mt-10" textAlign="justify">
    What Makes a Successful RIP?
  </Text>
  <Text fontSize={{ base: "sm", sm: "xs", md: "md" }} className="text-xl text-left text-justify" mt={4} textAlign="justify">
    A strong RIP includes:
  </Text>
  <ul className="list-disc list-inside space-y-2 text-xl text-left text-justify">
    <li>Clear Specification: Detailed syntax and semantics of the proposed change.</li>
    <li>Motivation: Why the change is necessary.</li>
    <li>Rationale: Design decisions and alternatives considered.</li>
    <li>Security Considerations: Risks, mitigations, and guidance.</li>
    <li>Backwards Compatibility: Notes on how the proposal impacts existing implementations.</li>
  </ul>

  <Text fontSize={{ base: "sm", sm: "xs", md: "md" }} className="text-4xl font-semibold text-blue-400 text-left mt-10" textAlign="justify">
    How Do I Format a RIP?
  </Text>
  <Text fontSize={{ base: "sm", sm: "xs", md: "md" }} className="text-xl text-left text-justify" mt={4} textAlign="justify">
    RIPs must follow a specific template and structure in Markdown format. Each RIP includes:
  </Text>
  <ul className="list-disc list-inside space-y-2 text-xl text-left text-justify">
    <li>Preamble: Metadata such as RIP number, title, author(s), and status.</li>
    <li>Abstract: A brief technical summary.</li>
    <li>Specification: A detailed technical description of the proposal.</li>
    <li>Rationale: Explanation of design choices.</li>
    <li>Security Considerations: Assessment of potential risks.</li>
    <li>Test Cases (if applicable): Mandatory for consensus changes.</li>
    <li>Reference Implementation (optional): Code to aid understanding.</li>
  </ul>
  <Text fontSize={{ base: "sm", sm: "xs", md: "md" }} className="text-xl text-left text-justify" mt={4} textAlign="justify">
    Refer to the RIP Template for guidelines.
  </Text>

  <Text fontSize={{ base: "sm", sm: "xs", md: "md" }} className="text-4xl font-semibold text-blue-400 text-left mt-10" textAlign="justify">
    Who Oversees the RIP Process?
  </Text>
  <Text fontSize={{ base: "sm", sm: "xs", md: "md" }} className="text-xl text-left text-justify" mt={4} textAlign="justify">
    RIP Editors ensure proposals are well-formatted and ready for review. They do not decide the merits of a proposal. Current RIP editors include:
  </Text>
  <ul className="list-disc list-inside space-y-2 text-xl text-left text-justify">
    <li>Ansgar Dietrichs</li>
    <li>Carl Beekhuizen</li>
    <li>Yoav Weiss</li>
    <li>Nicolas Consigny</li>
  </ul>

  <Text fontSize={{ base: "sm", sm: "xs", md: "md" }} className="text-4xl font-semibold text-blue-400 text-left mt-10" textAlign="justify">
    Where Can I Track RIPs and Rollup Progress?
  </Text>
  <ul className="list-disc list-inside space-y-2 text-xl text-left text-justify">
    <li>GitHub Repository: RIP Repository</li>
    <li>Discussions: Ethereum Magicians Forum</li>
    <li>Rollup Status: L2BEAT</li>
    <li>Comparison of Rollups: rollup.codes</li>
  </ul>

  <Text fontSize={{ base: "sm", sm: "xs", md: "md" }} className="text-4xl font-semibold text-blue-400 text-left mt-10" textAlign="justify">
    What Happens After a RIP is Final?
  </Text>
  <Text fontSize={{ base: "sm", sm: "xs", md: "md" }} className="text-xl text-left text-justify" mt={4} textAlign="justify">
    Once an RIP is accepted and implemented by at least one rollup on their mainnet, it becomes a Final RIP. Care is taken to resolve any conflicts before deployment to avoid competing standards.
  </Text>

  <Text fontSize={{ base: "sm", sm: "xs", md: "md" }} className="text-4xl font-semibold text-blue-400 text-left mt-10" textAlign="justify">
    How Do I Stay Involved?
  </Text>
  <ul className="list-disc list-inside space-y-2 text-xl text-left text-justify">
    <li>Contribute: Submit your RIP or provide feedback on existing proposals.</li>
    <li>Discuss: Join community discussions on forums and GitHub.</li>
    <li>Engage: Present your RIP at Rollcall meetings to build consensus.</li>
  </ul>

  <Text fontSize={{ base: "sm", sm: "xs", md: "md" }} className="text-4xl font-semibold text-blue-400 text-left mt-10"textAlign="justify">
    Where Can I Find More Information?
  </Text>
  <ul className="list-disc list-inside space-y-2 text-xl text-left text-justify">
    <li>RIP Template: Link to Template</li>
    <li>RIP Discussions: Ethereum Magicians Forum</li>
    <li>Rollup Specifications: rollup.codes</li>
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
      <Box mt={2}  borderRadius="10px 10px 0 0" >
        <Flex
          justify="space-between" // Distribute the space between tabs
          bg="gray.700" // Darker background for dark mode
          p={1}
          mb={1}
          borderRadius="md"
        //   boxShadow="md"
        >
          <TabList mb={1} display="flex" width="100%">
            {tabContent.map((tab, index) => (
              <Tab
                key={index}
                _selected={{
                  bg: "gray.800", // Darker background for selected tab
                  color: "white", // Text color for selected tab
                  borderColor: "lightblue", // Highlight border color for selected tab
                  paddingY: 2, // Reduce the top and bottom padding
                }}
                _hover={{
                  bg: "gray.600", // Hover effect for tabs
                }}
                p={2}
                flex="1 1 150px" // Allow tabs to grow and take up available space
                textAlign="center"
                m={2}
                borderRadius="md"
                boxShadow="sm"
                cursor="pointer"
                color="white" // Always white text
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
