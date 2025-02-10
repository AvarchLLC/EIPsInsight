"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import AllLayout from "@/components/Layout";
import NLink from "next/link";
import { motion } from "framer-motion";
import React from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import SearchBox from "@/components/SearchBox";
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
  IconButton,
  Heading,
  Button,
  useColorModeValue,
} from "@chakra-ui/react";
import { Markdown } from "@/components/MarkdownEIP";
import Header from "@/components/Header2";
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
  const ercNo = extractercNo(pathArray);
  const [markdownFileURL, setMarkdownFileURL] = useState<string>("");
  const [metadataJson, setMetadataJson] = useState<EipMetadataJson>();
  const [markdown, setMarkdown] = useState<string>("");
  const [data, setData] = useState<{ status: string; date: string }[]>([]);
  const [data2, setData2] = useState<{ type: string; date: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDataNotFound, setIsDataNotFound] = useState(false);
  const [show, setShow] = useState(false); // State to toggle visibility
  const toggleCollapse = () => setShow(!show);
  const [show2, setShow2] = useState(false); // State to toggle visibility
  const toggleCollapse2 = () => setShow2(!show2);
  
  useEffect(() => {
    if (ercNo) {
      const fetchData = async () => {
        try {
          const response = await fetch(`/api/new/erchistory/${ercNo}`);
          const jsonData = await response.json();
          const statusWithDates = extractLastStatusDates(jsonData);
          const typeWithDates = extractLastTypesDates(jsonData);
          setData(statusWithDates);
          setData2(typeWithDates);
          console.log(statusWithDates);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      fetchData();
    }
  }, [ercNo]);

  const fetchEIPData = useCallback(async () => {
    if (!ercNo) return;

    let _markdownFileURL = `https://raw.githubusercontent.com/ethereum/ERCs/master/ERCS/erc-${ercNo}.md`;

    if(ercNo==='1'){
      _markdownFileURL = `https://raw.githubusercontent.com/ethereum/ERCs/master/ERCS/eip-${ercNo}.md`;
    }

    setMarkdownFileURL(_markdownFileURL);

    try {
      const eipMarkdownRes = await fetch(_markdownFileURL).then((response) =>
        response.text()
      );

      const { metadata, markdown: _markdown } = extractMetadata(eipMarkdownRes);
      const metadataJson = convertMetadataToJson(metadata);

      // Check if necessary fields are missing
      if (!metadataJson?.author || !metadataJson?.created) {
        setIsDataNotFound(true);
      } else {
        setMetadataJson(metadataJson);
        setMarkdown(_markdown);
        setIsDataNotFound(false);
      }

      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching ERC data:", error);
    }
  }, [ercNo]);

  useEffect(() => {
    if (ercNo) {
      fetchEIPData();
    }
  }, [fetchEIPData, ercNo]);
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
            ERC Not Found
          </Heading>
          <Text color="gray.500" fontSize="xl" mb={6}>
            This ERC might not exist or could be an <Link color="blue.300" href={`/eips/eip-${ercNo}`}>EIP</Link> or <Link color="blue.300" href={`/rips/rip-${ercNo}`}>RIP</Link>. Please check again.
          </Text>
          <br/>
          <SearchBox/>
          <br/>
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
                title={`ERC- ${ercNo}`}
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
                  </Thead>
                </Table>
              </Box>
              <br />

              <Box bg={useColorModeValue('lightgray', 'darkgray')} p="5" borderRadius="md" mt="1">
                          <Flex justify="space-between" align="center">
                            {/* Heading on the Left */}
                            <Heading size="md" color={"#30A0E0"}>
                              Status Timeline
                            </Heading>
              
                            {/* Dropdown Button on the Right */}
                            <Box
                              bg="blue" // Gray background
                              borderRadius="md" // Rounded corners
                              padding={2} // Padding inside the box
                            >
                            <IconButton
                              onClick={toggleCollapse}
                              icon={show ? <ChevronUpIcon boxSize={8} color="white" /> : <ChevronDownIcon boxSize={8} color="white" />}
                              variant="ghost"
                              h="24px" // Smaller height
                              w="20px"
                              aria-label="Toggle Status Timeline"
                              _hover={{ bg: 'blue' }} // Background color on hover
                              _active={{ bg: 'blue' }} // Background color when active
                              _focus={{ boxShadow: 'none' }} // Remove focus outline
                            />
                            </Box>
                          </Flex>
              
                          {/* Status Timeline - This is shown only when `show` is true */}
                          {show && (
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.8 }}
                            >
                              <Flex w="100%" gap={6} align="center" flexWrap="wrap" mt="4">
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
                      </motion.div>
                    )}
                  </Box>
                  {data2.length > 1 && (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                          >
                            <Box bg={useColorModeValue('lightgray', 'darkgray')} p="5" borderRadius="md" mt="1">
                              {/* Heading on the Left */}
                              <Flex justify="space-between" align="center">
                                <Heading size="md" color={"#30A0E0"}>
                                  Type Timeline
                                </Heading>
                  
                                {/* Dropdown Button on the Right */}
                                 <Box
                                  bg="blue" // Gray background
                                  borderRadius="md" // Rounded corners
                                  padding={2} // Padding inside the box
                                >
                                <IconButton
                                  onClick={toggleCollapse2}
                                  icon={show2 ? <ChevronUpIcon boxSize={8} color="white" /> : <ChevronDownIcon boxSize={8} color="white" />}
                                  variant="ghost"
                                  h="24px" // Smaller height
                                  w="20px"
                                  aria-label="Toggle Type Timeline"
                                  _hover={{ bg: 'blue' }} // Background color on hover
                                  _active={{ bg: 'blue' }} // Background color when active
                                  _focus={{ boxShadow: 'none' }} // Remove focus outline
                                />
                                </Box>
                              </Flex>
                  
                              {/* Type Timeline - This is shown only when `show` is true */}
                              {show2 && (
                                <motion.div
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ duration: 0.8 }}
                                >
                                  <Flex w="100%" gap={6} align="center" flexWrap="wrap" mt="4">
                                    {data2
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
                                            {/* Type and Date */}
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
                                                  {item.type}
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
                                </motion.div>
                              )}
                            </Box>
                          </motion.div>
                        )}
              
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

const extractercNo = (data: any) => {
  return data[2]?.split("-")[1];
};

const extractLastStatusDates = (data: any) => {
  const statusDates: Record<string, string> = {};

  Object.keys(data).forEach((key) => {
    let laststatus = "";
    if (key !== "repo") {
      const { status, mergedDate } = data[key];
      if (status === "unknown") {
        return;
      }
      if (laststatus !== status) {
        statusDates[status] = mergedDate;
      }
      laststatus = status;
    }
  });

  return Object.keys(statusDates).map((status) => ({
    status,
    date: statusDates[status],
  }));
};

const extractLastTypesDates = (data: any) => {
  const typeDates: { type: string; date: string }[] = [];
  const standardTrackTypes = [
  "Standards Track",
  "Standard Track",
  "Standards Track (Core, Networking, Interface, ERC)",
  "Standard"
];
  let lasttype = "";
  const sortedData = Object.keys(data)
    .filter((key) => key !== "repo") 
    .sort((a, b) => new Date(data[a].mergedDate).getTime() - new Date(data[b].mergedDate).getTime());

  sortedData.forEach((key) => {
    let { type, mergedDate } = data[key];

    if (type === "unknown") {
      return;
    }
    if(standardTrackTypes.includes(type)){
      type="Standards Track"
    }

    if (lasttype !== type) {
      typeDates.push({ type, date: mergedDate });
    }

    lasttype = type;
  });

  return typeDates;
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
      if (key.trim() === "erc") {
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
