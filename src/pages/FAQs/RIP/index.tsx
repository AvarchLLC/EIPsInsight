import { VStack } from "@chakra-ui/react";
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
          What is an Rollup Improvement Proposal (RIP)?
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
  src="/RIPsFAQ.png" 
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
            </Box>
            </Stack>

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

        
      </VStack>
    </Box>
    </AllLayout>
    </>
  );
};

export default EIPsInsightRecap;
