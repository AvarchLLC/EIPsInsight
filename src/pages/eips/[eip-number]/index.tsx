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
  Popover,
  PopoverTrigger,
  PopoverArrow,
  PopoverContent,
  PopoverHeader,
  PopoverCloseButton,
  PopoverBody
} from "@chakra-ui/react";
import { Markdown } from "@/components/MarkdownEIP";
import Header from "@/components/Header2";
import LoaderComponent from "@/components/Loader";
import { InfoOutlineIcon } from "@chakra-ui/icons";

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
  const [Repo, setRepo] =useState("");
  const [data, setData] = useState<{ status: string; date: string }[]>([]);
  const [data2, setData2] = useState<{ type: string; date: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDataNotFound, setIsDataNotFound] = useState(false);
  const [show, setShow] = useState(false); // State to toggle visibility
  const toggleCollapse = () => setShow(!show);
  const [show2, setShow2] = useState(false); // State to toggle visibility
  const toggleCollapse2 = () => setShow2(!show2);

  const networkUpgrades: Record<string, number[]> = {
    Homestead: [2, 7, 8],
    "Spurious Dragon": [155, 160, 161, 170],
    "Tangerine Whistle": [150],
    Byzantium: [100, 140, 196, 197, 198, 211, 214, 649, 658],
    Petersburg: [145, 1014, 1052, 1234, 1283],
    Istanbul: [152, 1108, 1344, 1844, 2028, 2200],
    "Muir Glacier": [2384],
    Dencun: [1153, 4788, 4844, 5656, 6780, 7044, 7045, 7514, 7516],
    Pectra: [7691, 7623, 7840, 7702, 7685, 7549, 7251, 7002, 6110, 2935, 2537],
    Berlin: [2565, 2929, 2718, 2930],
    London: [1559, 3198, 3529, 3541, 3554],
    "Arrow Glacier": [4345],
    "Gray Glacier": [5133],
    Paris: [3675, 4399],
    Shapella: [3651, 3855, 3860, 4895, 6049],
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
          const repoPath = Repo.toLowerCase() === 'eip' ? 'eipshistory' : `${Repo.toLowerCase()}history`;
          const response = await fetch(`/api/new/${repoPath}/${eipNo}`);
        //   const response = await fetch(`/api/new/${Repo.toLowerCase()}history/${eipNo}`);
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
  }, [Repo, eipNo]);

  const getValid = async (num: string): Promise<string> => {
    const links = [
      {
        url: `https://raw.githubusercontent.com/ethereum/RIPs/master/RIPS/rip-${num}.md`,
        path: `rip`
      },
      {
        url: `https://raw.githubusercontent.com/ethereum/ERCs/master/ERCS/erc-${num}.md`,
        path: `erc`
      },
      {
        url: `https://raw.githubusercontent.com/ethereum/EIPs/master/EIPS/eip-${num}.md`,
        path: `eip`
      },
    ];
  
    for (const link of links) {
      try {
        const response = await fetch(link.url);
        if (response.ok) {
          
          return link.path;
        }
      } catch (error) {
        console.error(`Error checking link ${link.url}:`, error);
      }
    }
    return `/eips/eip-${num}`;
  };


  const fetchEIPData = useCallback(async () => {
    if (!eipNo) return;

    setIsLoading(true); // Set loading state at the beginning

    try {
      const getRepo = await getValid(eipNo);
      if (!getRepo) {
        setIsLoading(false);
        return; // Exit if no repo is returned
      }

      setRepo(getRepo);

      let _markdownFileURL = `https://raw.githubusercontent.com/ethereum/${getRepo.toUpperCase()}s/master/${getRepo.toUpperCase()}S/${getRepo}-${eipNo}.md`;
      console.log("final url:", _markdownFileURL);
      setMarkdownFileURL(_markdownFileURL);

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
    } catch (error) {
      console.error("Error fetching EIP data:", error);
      setIsDataNotFound(true);
    } finally {
      setIsLoading(false);
    }
  }, [eipNo]); // Make sure to include all dependencies here, [Repo, eipNo]);

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
            This EIP might not exist or could be an <Link color="blue.300" href={`/ercs/erc-${eipNo}`}>ERC</Link> or an <Link color="blue.300" href={`/rips/rip-${eipNo}`}>RIP</Link>. Please check again.
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
                title={`${Repo.toUpperCase()}- ${eipNo}`}
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
              <Box>
      {/* Collapse Button */}
       <Box bg={useColorModeValue('lightgray', 'darkgray')} p="5" borderRadius="md" mt="1">
            <Flex justify="space-between" align="center">
              {/* Heading on the Left */}
              <Heading size="md" color={"#30A0E0"}>
                Status Timeline

                <Popover>
                    <PopoverTrigger>
                    <IconButton
                            aria-label="More info"
                            icon={<InfoOutlineIcon />}
                            size="md"
                            colorScheme="blue"
                            variant="ghost"
                          />
                    </PopoverTrigger>
                    <PopoverContent>
                      <PopoverArrow />
                      <PopoverCloseButton />
                      <PopoverHeader>Instructions</PopoverHeader>
                      <PopoverBody>
                      The timeline tracks status changes using the merged date as the reference point.
                      </PopoverBody>
                    </PopoverContent>
                  </Popover>


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
// extractLastTypesDates

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
