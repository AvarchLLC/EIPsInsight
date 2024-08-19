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
  VStack,
  Spinner,
  Heading,
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
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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

      setMetadataJson(convertMetadataToJson(metadata));
      setMarkdown(_markdown);
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

  // Status order definition
  const statusOrder = [
    "Draft",
    "Review",
    "Living",
    "Stagnant",
    "Last Call",
    "Withdrawn",
    "Final",
  ];

  // Define color schemes for light and dark mode
  const boxBg = useColorModeValue("gray.100", "gray.700");
  const boxTextColor = useColorModeValue("gray.800", "gray.200");
  const statusColor = useColorModeValue("blue.600", "cyan.400");
  const dateColor = useColorModeValue("gray.600", "gray.300");
  const boxShadow = useColorModeValue("md", "dark-lg");

  return (
    <>
      {isLoading ? ( // Show loader while data is loading
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
              <Header title={`EIP- ${eipNo}`} subtitle={metadataJson?.title || ""} />
              <Box overflowX={"auto"}>
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>Authors</Th>
                      <Td>
                        {metadataJson?.author && (
                          <Box
                            maxH="10rem"
                            overflowY={"auto"}
                            p="2px"
                            sx={{
                              "::-webkit-scrollbar": {
                                w: "10px",
                              },
                              "::-webkit-scrollbar-track ": {
                                bg: "gray.400",
                                rounded: "md",
                              },
                              "::-webkit-scrollbar-thumb": {
                                bg: "gray.500",
                                rounded: "md",
                              },
                            }}
                          >
                            {metadataJson.author.join(", ")}
                          </Box>
                        )}
                      </Td>
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
                            color={"blue.400"}
                            isExternal
                          >
                            {metadataJson["discussions-to"]}
                          </Link>
                        </Td>
                      </Tr>
                    )}

                    {metadataJson?.requires && metadataJson.requires.length > 0 && (
                      <Tr>
                        <Th>Requires</Th>
                        <Td>
                          <HStack>
                            {metadataJson.requires.map((req, i) => (
                              <NLink key={i} href={`/eips/eip-${req}`}>
                                <Text
                                  color={"blue.400"}
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
                    {metadataJson?.type && (
                      <Tr>
                        <Th>Type</Th>
                        <Td>{metadataJson?.type}</Td>
                      </Tr>
                    )}
                    {metadataJson?.category && (
                      <Tr>
                        <Th>Category</Th>
                        <Td>{metadataJson?.category}</Td>
                      </Tr>
                    )}
                    {/* {metadataJson?.title?.includes("Hardfork Meta") && (
                      <Tr>
                        <Th>Network upgrade</Th>
                        <Td>
                          {metadataJson?.title
                            .split("Hardfork Meta:")[1]
                            ?.trim()
                            .replace(/"$/, "")}
                        </Td>
                      </Tr>
                    )} */}
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
                  <Heading
                    size="md"
                    mb="4"
                    color={"#30A0E0"}
                  >
                    Status Timeline
                  </Heading>
                  <HStack w="100%" spacing={6} align="center">
                    {data
                      .filter((item) => statusOrder.includes(item.status)) // Filter out any unexpected statuses
                      .sort((a, b) => statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status))
                      .map((item, index, sortedData) => {
                        const currentDate = new Date(item.date);
                        const nextItem = sortedData[index + 1];
                        const nextDate = nextItem ? new Date(nextItem.date) : null;

                        // Calculate positive day difference
                        const dayDifference = nextDate
                          ? Math.abs(Math.ceil((nextDate.getTime() - currentDate.getTime()) / (1000 * 3600 * 24)))
                          : null;

                        return (
                          <React.Fragment key={index}>
                            <VStack align="center">
                              {/* Status and Date */}
                              <Box
                                p="5"
                                bg={useColorModeValue("white", "gray.800")}
                                borderRadius="md"
                                boxShadow={useColorModeValue("md", "dark-lg")}
                                textAlign="center"
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

                            {/* Dotted line and days difference */}
                            {nextItem && (
                              <VStack align="center">
                                <Box h="1px" w="80px" borderBottom="1px dashed" borderColor="gray.400" />
                                <Text color="gray.500" fontSize="sm">
                                  {dayDifference} days
                                </Text>
                                <Box h="1px" w="80px" borderBottom="1px dashed" borderColor="gray.400" />
                              </VStack>
                            )}
                          </React.Fragment>
                        );
                      })}
                  </HStack>



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

// Extract last status dates function remains unchanged
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

const extracteipno=(data:any)=>{
 return data[2]?.split("-")[1];
}

// Helper functions to extract and convert metadata remain unchanged
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
