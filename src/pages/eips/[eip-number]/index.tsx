"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import AllLayout from "@/components/Layout";
import NLink from "next/link";
import { motion } from "framer-motion";
import React from "react";
import {
  Container,
  Box,
  Table,
  Thead,
  Tr,
  Th,
  Td,
  Link,
  HStack,
  Flex,
  Text,
  VStack,
  Spinner,
  Heading,
  Button,
  useColorModeValue,
} from "@chakra-ui/react";
import { Markdown } from "@/components/MarkdownEIP";
import Header from "@/components/Header";
import LoaderComponent from "@/components/Loader";

interface EipMetadataJson {
  eip: number;
  title: string;
  description: string;
  author: string[];
  "discussions-to": string;
  "last-call-deadline":string;
  status: string;
  type: string;
  category: string;
  created: string;
  requires: number[];
}

const TestComponent = () => {
  const path = usePathname();
  const pathArray = path?.split("/") || [];
  const eipNo = extracteipno(pathArray);
  const [markdownFileURL, setMarkdownFileURL] = useState<string>("");
  const [metadataJson, setMetadataJson] = useState<EipMetadataJson>();
  const [markdown, setMarkdown] = useState<string>("");
  const [data, setData] = useState<{ status: string; date: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDataNotFound, setIsDataNotFound] = useState(false);

  const networkUpgrades: Record<string, number[]> = {
    Homestead: [2, 7, 8, 606],
    "Spurious Dragon": [155, 160, 161, 170, 7],
    "Tangerine Whistle": [150, 608],
    Byzantium: [100, 140, 196, 197, 198, 211, 214, 649, 658, 609],
    "DAO Fork": [779],
    Constantinople: [145, 1014, 1052, 1234, 1283, 1013],
    Istanbul: [152, 1108, 1344, 1884, 2028, 2200, 1679],
    Petersburg: [2726, 1283], 
    "Muir Glacier": [2384, 2387],
    "Backfill - Berlin to Shapella": [7568, 2070, 2982, 6122, 6953],
    Dencun: [1153, 4788, 4844, 5656, 6780, 7044, 7045, 7514, 7516, 7569],
    Pectra: [
      2537, 2935, 6110, 7002, 7251, 7549, 7685, 7702, 663, 3540, 3670, 4200,
      4750, 5450, 6206, 7069, 7480, 7620, 7698, 7600, 7692,
    ],
    "Ethereum ProgPoW": [1057, 1588],
    Osaka: [7607],
    "Beacon Chain Launch": [2982],
    Berlin: [2565, 2929, 2718, 2930, 2070],
    London: [1559, 3198, 3529, 3541, 3554],
    "Arrow Glacier": [4345],
    "Gray Glacier": [5133],
    Paris: [3675, 4399],
    Shapella: [6953, 6122],
    Shanghai: [3651, 3855, 3860, 4895, 6049],
  };
  
  const getNetworkUpgrades = (eipNo: number) => {
    console.log("eip:", eipNo);
  
    const matchedUpgrades = Object.entries(networkUpgrades)
      .filter(([_, eipNos]) => eipNos.map(Number).includes(Number(eipNo)))
      .map(([upgradeName]) => upgradeName);
  
    const formattedUpgrades = matchedUpgrades.join(", "); 
    console.log("Matched Network Upgrade Labels:", formattedUpgrades);
    
    return formattedUpgrades;
  };

  const networkUpgradeLabels = getNetworkUpgrades(eipNo);
  console.log("Matched Network Upgrade Labels:", networkUpgradeLabels); 

  const bg = useColorModeValue("#f6f6f7", "#171923");
  
  useEffect(() => {
    if (eipNo) {
      const fetchData = async () => {
        try {
          const response = await fetch(`/api/new/eipshistory/${eipNo}`);
          const jsonData = await response.json();
          const statusWithDates = extractLastStatusDates(jsonData);
          setData(statusWithDates);
          console.log(statusWithDates);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      fetchData();
    }
  }, [eipNo]);

  const fetchEIPData = useCallback(async () => {
    if (!eipNo) return;

    let _markdownFileURL = `https://raw.githubusercontent.com/ethereum/EIPs/master/EIPS/eip-${eipNo}.md`;
    setMarkdownFileURL(_markdownFileURL);

    try {
      const eipMarkdownRes = await fetch(_markdownFileURL).then((response) =>
        response.text()
      );

      const { metadata, markdown: _markdown } = extractMetadata(eipMarkdownRes);
      const metadataJson = convertMetadataToJson(metadata);

      
      if (!metadataJson?.author || !metadataJson?.created) {
        setIsDataNotFound(true);
      } else {
        setMetadataJson(metadataJson);
        setMarkdown(_markdown);
        setIsDataNotFound(false);
      }

      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching EIP data:", error);
    }
  }, [eipNo]);

  useEffect(() => {
    if (eipNo) {
      fetchEIPData();
    }
  }, [fetchEIPData, eipNo]);
  const statusOrder = [
    "Draft",
    "Review",
    "Living",
    "Stagnant",
    "Last Call",
    "Withdrawn",
    "Final",
  ];

  const boxBg = useColorModeValue("gray.100", "gray.700");
  const boxTextColor = useColorModeValue("gray.800", "gray.200");
  const statusColor = useColorModeValue("blue.600", "cyan.400");
  const dateColor = useColorModeValue("gray.600", "gray.300");
  const boxShadow = useColorModeValue("md", "dark-lg");


  return (
    <>
      {isLoading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100vh"
        >
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <LoaderComponent />
          </motion.div>
        </Box>
      ) : isDataNotFound ? (
        <AllLayout>
        <Box
          textAlign="center"
          py={6}
          px={6}
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          height="100vh"
        >
          <Heading size="lg" mb={4}>
            EIP Not Found
          </Heading>
          <Text color="gray.500" fontSize="xl" mb={6}>
            This EIP might not exist or could be an ERC or an RIP. Please check again.
          </Text>
          <Button
            colorScheme="blue"
            size="lg"
            onClick={() => (window.location.href = "/")}
          >
            Return to Home
          </Button>
        </Box>
        </AllLayout>
      ) : (
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
              <Header
                title={`EIP- ${eipNo}`}
                subtitle={metadataJson?.title || ""}
              />
              <Box overflowX="auto">
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>Authors</Th>
                      <Td>{metadataJson?.author?.join(", ")}</Td>
                    </Tr>
                    <Tr>
                      <Th>Created</Th>
                      <Td>{metadataJson?.created}</Td>
                    </Tr>
                    {metadataJson?.["discussions-to"] && (
                      <Tr>
                        <Th>Discussion Link</Th>
                        <Td>
                          <Link
                            href={metadataJson["discussions-to"]}
                            color="blue.400"
                            isExternal
                          >
                            {metadataJson["discussions-to"]}
                          </Link>
                        </Td>
                      </Tr>
                    )}

                    {metadataJson?.requires &&
                      metadataJson.requires.length > 0 && (
                        <Tr>
                          <Th>Requires</Th>
                          <Td>
                            <HStack>
                              {metadataJson.requires.map((req, i) => (
                                <NLink key={i} href={`/eips/eip-${req}`}>
                                  <Text
                                    color="blue.400"
                                    _hover={{ textDecor: "underline" }}
                                  >
                                    {"EIP"}-{req}
                                  </Text>
                                </NLink>
                              ))}
                            </HStack>
                          </Td>
                        </Tr>
                      )}
                    {metadataJson?.status && (
                      <Tr>
                        <Th>Status</Th>
                        <Td>{metadataJson?.status}</Td>
                      </Tr>
                    )}
                    {metadataJson?.["last-call-deadline"] && (
                      <Tr>
                        <Th>Last Call Deadline</Th>
                        <Td>{metadataJson["last-call-deadline"]}</Td>
                      </Tr>
                    )}
                    {metadataJson?.type && (
                      <Tr>
                        <Th>Type</Th>
                        <Td>{metadataJson?.type}</Td>
                      </Tr>
                    )}
                    {metadataJson?.category && (
                      <Tr>
                        <Th>category</Th>
                        <Td>{metadataJson?.category}</Td>
                      </Tr>
                    )}
                     {networkUpgradeLabels && (
                      <Tr>
                        <Th>Network Upgrade</Th>
                        <Td>{networkUpgradeLabels}</Td>
                      </Tr>
                    )}
                  </Thead>
                </Table>
              </Box>
              <br />
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <Box bg={useColorModeValue('lightgray', 'darkgray')} p="5" borderRadius="md" mt="10">
  <Heading size="md" mb="4" color={"#30A0E0"}>
    Status Timeline
  </Heading>

  {/* Use Flex with flexWrap="wrap" to create new lines when the content overflows */}
  <Flex w="100%" gap={6} align="center" flexWrap="wrap">
    {data
      .filter((item) => statusOrder.includes(item.status)) // Filter out any unexpected statuses
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()) // Sort by date
      .map((item, index, sortedData) => {
        const currentDate = new Date(item.date);
        const nextItem = sortedData[index + 1];
        const nextDate = nextItem ? new Date(nextItem.date) : null;

        // Calculate the day difference between current and next item
        const dayDifference = nextDate
          ? Math.abs(Math.ceil((nextDate.getTime() - currentDate.getTime()) / (1000 * 3600 * 24)))
          : null;

        return (
          <React.Fragment key={index}>
            {/* Status and Date */}
            <VStack align="center" spacing={3} minW="120px" maxW="120px" mb={4}>
              <Box
                p="5"
                bg={useColorModeValue("white", "gray.800")}
                borderRadius="md"
                boxShadow={useColorModeValue("md", "dark-lg")}
                textAlign="center"
                minH="80px"
                display="flex"
                flexDirection="column"
                justifyContent="center"
              >
                <Text fontWeight="bold" color={statusColor}>
                  {item.status}
                </Text>
                <Text color={dateColor}>
                  {currentDate.toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </Text>
              </Box>
            </VStack>

            {/* Arrow design and days difference */}
            {nextItem && (
              <VStack align="center" spacing={1}>
                <Box
                  h="1px"
                  w="80px"
                  borderBottom="1px solid"
                  borderColor="gray.400"
                  position="relative"
                >
                  {/* Arrow pointing forward */}
                  <Box
                    position="absolute"
                    right="-10px"
                    top="-4px"
                    borderTop="5px solid transparent"
                    borderBottom="5px solid transparent"
                    borderLeft="10px solid gray"
                  />
                </Box>
                <Text color="gray.500" fontSize="sm">
                  {dayDifference} days
                </Text>
              </VStack>
            )}
          </React.Fragment>
        );
      })}
  </Flex>
</Box>


              </motion.div>
              <Container maxW="1200px" mx="auto">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <Markdown md={markdown} markdownFileURL={markdownFileURL} />
                  <br />
                </motion.div>
              </Container>
            </Box>
          </motion.div>
        </AllLayout>
      )}
    </>
  );
};

const extracteipno = (data: any) => {
  return data[2]?.split("-")[1];
};

const extractLastStatusDates = (data: any) => {
  const statusDates: { status: string; date: string }[] = [];
  let laststatus = "";
  const sortedData = Object.keys(data)
    .filter((key) => key !== "repo") 
    .sort((a, b) => new Date(data[a].mergedDate).getTime() - new Date(data[b].mergedDate).getTime());

  sortedData.forEach((key) => {
    const { status, mergedDate } = data[key];
    if (status === "unknown") {
      return;
    }
    if (laststatus !== status) {
      statusDates.push({ status, date: mergedDate });
    }

    laststatus = status;
  });

  return statusDates;
};



export const extractMetadata = (text: string) => {
  const regex = /(--|---)\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)/;
  const match = text.match(regex);

  if (match) {
    return {
      metadata: match[2],
      markdown: match[3],
    };
  } else {
    return {
      metadata: "",
      markdown: text,
    };
  }
};

export const convertMetadataToJson = (metadataText: string): EipMetadataJson => {
  const lines = metadataText.split("\n");
  const jsonObject: any = {};

  lines.forEach((line) => {
    const [key, value] = line.split(/: (.+)/);
    if (key && value) {
      if (key.trim() === "eip") {
        jsonObject[key.trim()] = parseInt(value.trim());
      } else if (key.trim() === "requires") {
        jsonObject[key.trim()] = value.split(",").map((v) => parseInt(v));
      } else if (key.trim() === "author") {
        jsonObject[key.trim()] = value
          .split(",")
          .map((author: string) => author.trim());
      } else {
        jsonObject[key.trim()] = value.trim();
      }
    }
  });

  return jsonObject as EipMetadataJson;
};

export default TestComponent;
