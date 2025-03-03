import React from "react";
import { VStack, Box, Text, Heading, Stack, Image, Link, UnorderedList, ListItem } from "@chakra-ui/react";
import AllLayout from "@/components/Layout";
import OnThisPage from "@/components/ui/OnThisPage";

const EIPsInsightRecap = () => {
  return (
    <AllLayout>
      <Stack direction={{ base: "column", lg: "row" }} spacing={6} align="start" mt={10} px={5}>
        <OnThisPage /> {/* Add this component here */}

        <Box
          flex="1"
          id="title"
          paddingBottom={{ lg: "10", sm: "10", base: "10" }}
          marginX={{ lg: "40", md: "2", sm: "2", base: "2" }}
          paddingX={{ lg: "10", md: "5", sm: "5", base: "5" }}
          marginTop={{ lg: "10", md: "5", sm: "5", base: "5" }}
        >
          <VStack spacing={6} align="start">
            <Heading fontSize={{ base: "2xl", md: "4xl", lg: "6xl" }}>What is EIPsInsight?</Heading>
            <Stack direction={{ base: "column", lg: "row" }} spacing={6} align="center">
              <Box width={{ base: "100%", lg: "40%" }}>
                <Image
                  src="Blockchain_Future.png"
                  alt="Image 1"
                  borderRadius="md"
                  width="100%"
                  objectFit="contain"
                />
              </Box>
              <Box width={{ base: "100%", lg: "60%" }} textAlign="justify">
                <Text fontSize="xl">
                  EIPsInsight provides visual insights into{" "}
                  <Link href="https://github.com/ethereum/EIPs" color="blue.400" isExternal>
                    Ethereum Improvement Proposals (EIPs)
                  </Link>
                  ,{" "}
                  <Link href="https://github.com/ethereum/ERCs" color="blue.400" isExternal>
                    Ethereum Request for Comments (ERCs)
                  </Link>
                  , and{" "}
                  <Link href="https://github.com/ethereum/RIPs" color="blue.400" isExternal>
                    Rollup Improvement Proposals (RIPs)
                  </Link>
                  .
                </Text>
              </Box>
            </Stack>

            <Heading as="h2" size="lg">Key Features</Heading>
            <UnorderedList spacing={3} fontSize={{ base: "md", md: "xl", lg: "xl" }}>
              <ListItem><strong>Monthly Insight:</strong> Track proposal status changes with detailed charts and tables.</ListItem>
              <ListItem><strong>Toolings:</strong> Features like "Editor Review Tracker" help monitor proposal progress and editor workload.</ListItem>
              <ListItem><strong>Detailed EIP Database:</strong> Access a comprehensive repository of EIPs, including descriptions and statuses.</ListItem>
              <ListItem><strong>Expert Analysis:</strong> Insights from analysts on impactful EIPs and their Ethereum ecosystem effects.</ListItem>
              <ListItem><strong>Community Engagement:</strong> Connect with Ethereum developers and stakeholders via discussions and feedback.</ListItem>
              <ListItem><strong>Educational Resources:</strong> Learn about the EIP process with beginner-friendly guides.</ListItem>
              <ListItem><strong>Regular Updates:</strong> Stay informed with newsletters and proposal changes.</ListItem>
            </UnorderedList>

            <Text fontSize={{ base: "md", md: "xl", lg: "xl" }}>
              At EIPsInsight, we believe in the power of open-source collaboration.{" "}
              <Link href="https://x.com/TeamAvarch" color="blue.400" isExternal>
                Join us
              </Link>{" "}
              in shaping Ethereum’s future, one proposal at a time.
            </Text>
          </VStack>
        </Box>
      </Stack>
    </AllLayout>
  );
};

export default EIPsInsightRecap;
