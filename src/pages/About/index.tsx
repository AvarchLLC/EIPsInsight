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
import { FiHome } from "react-icons/fi";

const AboutPage = () => {
  const bg = useColorModeValue("#f6f6f7", "#171923");
  const cardBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.700", "gray.200");
  const headingColor = useColorModeValue("gray.800", "white");
  const mainHeadingColor = useColorModeValue("#30A0E0", "#4FD1FF");
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
              id="what"
              transition={{ duration: 0.5 } as any}
              fontSize={{ base: "2xl", md: "4xl", lg: "6xl" }}
              fontWeight={{ base: "extrabold", md: "bold", lg: "bold" }}
              color={mainHeadingColor}
            >
              What is EIPsInsight?
            </Text>

            <Stack 
              direction={{ base: "column", lg: "row" }}
              spacing={6} 
              align="center"
              justify="center"
            >
              {/* Image Box */}
              <Box 
                display="flex" 
                justifyContent="center" 
                width={{ base: "100%", lg: "40%" }}
              >
                <Image 
                  src="Blockchain_Future.png" 
                  alt="EIPsInsight Platform" 
                  borderRadius="md" 
                  width={{ base: "250px", md: "350px", lg: "100%" }}
                  height="auto"
                  objectFit="contain"
                />
              </Box>

              {/* Text */}
              <Box 
                width={{ base: "100%", lg: "60%" }}
                textAlign="justify"
              >     
                <Text fontSize={{ base: "md", md: "xl", lg: "xl" }} textAlign="justify" color={textColor}>
                  EIPsInsight is specialized in toolings designed to provide clear, visual insights into the activity of{" "}
                  <Link href="https://github.com/ethereum/EIPs" color={linkColor} isExternal className="underline">
                    Ethereum Improvement Proposals (EIPs)
                  </Link>,{" "}
                  <Link href="https://github.com/ethereum/ERCs" color={linkColor} isExternal className="underline">
                    Ethereum Request for Comments (ERCs)
                  </Link>, and{" "}
                  <Link href="https://github.com/ethereum/RIPs" color={linkColor} isExternal className="underline">
                    Rollup Improvement Proposals (RIPs)
                  </Link>{" "}
                  over a specified period. Data provided is used for tracking the progress and workload distribution among
                  EIP Editors, ensuring transparency and efficiency in the proposal review process.
                </Text>
                <Text fontSize={{ base: "md", md: "xl", lg: "xl" }} textAlign="justify" color={textColor} mt={4}>
                  EIPsInsight is a tooling platform dedicated to providing in-depth analysis, up-to-date information, and
                  comprehensive insights on Ethereum Standards. Our mission is to empower editors, developers, stakeholders,
                  and the broader Ethereum community with the knowledge and tools necessary to understand and engage with
                  the ongoing evolution of the Ethereum Standards.
                </Text>
              </Box>
            </Stack>

            {/* EtherWorld Advertisement */}
            <Box my={6} width="100%">
              <CloseableAdCard />
            </Box>

            <Heading as="h2" size="lg" textAlign="justify" color={headingColor}>
              Key Features
            </Heading>
            
            <Box 
              bg={cardBg}
              p={6}
              borderRadius="xl"
              boxShadow="md"
              width="100%"
            >
              <UnorderedList 
                fontSize={{ base: "md", sm: "md", md: "xl" }} 
                spacing={4}
                color={textColor}
              >
                <ListItem>
                  <Text as="span" fontWeight="bold" color={textColor}>Monthly Insight:</Text> Follow the status change of proposals under different types and
                  categories with beautiful charts and tables providing details.
                </ListItem>
                <ListItem>
                  <Text as="span" fontWeight="bold" color={textColor}>Toolings:</Text> Make use of different toolings such as "Editor Review Tracker" and "Issues
                  and PRs Trackers" which will provide the proposals added, reviewed and moved to various statuses by EIP
                  Editors. These will be helpful for tracking the progress and workload distribution among EIP Editors,
                  ensuring transparency and efficiency in the proposal review process.
                </ListItem>
                <ListItem>
                  <Text as="span" fontWeight="bold" color={textColor}>Detailed EIP Database:</Text> Explore our extensive database of EIPs, complete with detailed
                  descriptions, statuses, and relevant discussions. Whether you're looking for historical proposals or the
                  latest advancements, our database is your go-to resource.
                </ListItem>
                <ListItem>
                  <Text as="span" fontWeight="bold" color={textColor}>Expert Analysis:</Text> Gain access to expert commentary and analysis on significant EIPs,
                  their potential impacts, and the broader implications for the Ethereum ecosystem. Our team of
                  experienced analysts and contributors ensure you have the most accurate and relevant insights.
                </ListItem>
                <ListItem>
                  <Text as="span" fontWeight="bold" color={textColor}>Community Engagement:</Text> Join the conversation with our vibrant community of Ethereum
                  enthusiasts, developers, and stakeholders. Participate in forums, provide feedback on proposals, and
                  stay connected with the latest developments in the Ethereum space.
                </ListItem>
                <ListItem>
                  <Text as="span" fontWeight="bold" color={textColor}>Educational Resources:</Text> New to EIPs? Our educational resources are designed to help you
                  understand the proposal process, the technical details, and the importance of various EIPs. From
                  beginners to seasoned developers, there's something for everyone.
                </ListItem>
                <ListItem>
                  <Text as="span" fontWeight="bold" color={textColor}>Regular Updates:</Text> Stay informed with our regular updates and newsletters. Get the latest
                  news, changes, and discussions surrounding EIPs delivered straight to your inbox.
                </ListItem>
              </UnorderedList>
            </Box>

            <Text fontSize={{ base: "md", md: "xl", lg: "xl" }} textAlign="justify" color={textColor}>
              At EIPsInsight, we believe in the power of open-source collaboration and the continuous improvement of the
              Ethereum network.{" "}
              <Link href="https://x.com/TeamAvarch" color={linkColor} isExternal className="underline">
                Join us
              </Link>{" "}
              in exploring the future of Ethereum, one proposal at a time.
            </Text>

            <Box display="flex" justifyContent="center" w="100%">
              <NLink href="/">
                <Box
                  display="flex"
                  alignItems="center"
                  bg="#30A0E0"
                  color="white"
                  padding="10px 20px"
                  borderRadius="8px"
                  fontWeight="bold"
                  cursor="pointer"
                  _hover={{ bg: "#2A8BC5" }}
                  _active={{ bg: "#1F6F99" }}
                  transition="background-color 0.3s"
                >
                  <FiHome style={{ marginRight: '8px' }} />
                  Go to Dashboard
                </Box>
              </NLink>
            </Box>

          </VStack>
        </Box>
      </AllLayout>
    </>
  );
};

export default AboutPage;
