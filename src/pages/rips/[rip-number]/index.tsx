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
  Text,
  Flex,
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
  const RIPNo = extractRIPNo(pathArray);
  const [markdownFileURL, setMarkdownFileURL] = useState<string>("");
  const [metadataJson, setMetadataJson] = useState<EipMetadataJson>();
  const [markdown, setMarkdown] = useState<string>("");
  const [data, setData] = useState<{ status: string; date: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDataNotFound, setIsDataNotFound] = useState(false);
  
  useEffect(() => {
    if (RIPNo) {
      const fetchData = async () => {
        try {
          const response = await fetch(`/api/new/riphistory/${RIPNo}`);
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
  }, [RIPNo]);

  const fetchEIPData = useCallback(async () => {
    if (!RIPNo) return;

    let _markdownFileURL = `https://raw.githubusercontent.com/ethereum/RIPs/master/RIPS/rip-${RIPNo}.md`;
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
  }, [RIPNo]);

  useEffect(() => {
    if (RIPNo) {
      fetchEIPData();
    }
  }, [fetchEIPData, RIPNo]);
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
            RIP Not Found
          </Heading>
          <Text color="gray.500" fontSize="xl" mb={6}>
            This RIP might not exist or could be an EIP or ERC. Please check again.
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
                title={`RIP- ${RIPNo}`}
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

const extractRIPNo = (data: any) => {
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
      if (key.trim() === "rip") {
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
