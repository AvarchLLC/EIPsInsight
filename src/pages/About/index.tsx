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
import { FiHome } from "react-icons/fi";
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
        id="what"
           transition={{ duration: 0.5 } as any}
           fontSize={{base: "2xl",md:"4xl", lg: "6xl"}}
           fontWeight={{ base: "extrabold", md: "bold", lg: "bold" }}
           color="#30A0E0"
          >
          What is EIPsInsight?
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
                src="Blockchain_Future.png" 
                alt="Image 1" 
                borderRadius="md" 
                width={{ base: "250px", md: "350px", lg: "100%" }} // Image width is set to 100% on large screens
                height="auto" // Maintain aspect ratio
                // border="2px solid blue" 
                objectFit="contain" // Ensure image is contained within the box without distortion
                />
            </Box>

            {/* Text */}
            <Box 
                width={{ base: "100%", lg: "60%" }} // Text takes up 60% of the width on large screens
                textAlign="justify"
            >     
            <Text fontSize={{base: "md",md:"xl", lg: "xl"}} textAlign="justify">
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
                    <Text fontSize={{base: "md",md:"xl", lg: "xl"}} textAlign="justify">
                        EIPsInsight is a tooling platform dedicated to providing in-depth analysis, up-to-date information, and
                        comprehensive insights on Ethereum Standards. Our mission is to empower editors, developers, stakeholders,
                        and the broader Ethereum community with the knowledge and tools necessary to understand and engage with
                        the ongoing evolution of the Ethereum Standards.
                      </Text>
            </Box>
            </Stack>

            <Heading as="h2" size="lg" textAlign="justify">
                      Key Features
                    </Heading>
                    <Text fontSize={{base: "md",md:"xl", lg: "xl"}} textAlign="justify">
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
                    </Text>
    
    
                    <Text fontSize={{base: "md",md:"xl", lg: "xl"}} textAlign="justify">
                         At EIPsInsight, we believe in the power of open-source collaboration and the continuous improvement of the
                            Ethereum network.{" "}
                            <Link href="https://x.com/TeamAvarch" color="blue.400" isExternal className="underline">
                              Join us
                            </Link>{" "}
                            in exploring the future of Ethereum, one proposal at a time.
                    </Text>


        
      </VStack>
    </Box>
    </AllLayout>
    </>
  );
};

export default EIPsInsightRecap;
