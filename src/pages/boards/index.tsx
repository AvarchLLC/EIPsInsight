import {
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Link as LI,
  Spinner,
  Text,
  Flex,
  Button,
  useColorMode,
  useColorModeValue,
  Collapse,
  IconButton,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import CloseableAdCard from "@/components/CloseableAdCard";
import AllLayout from "@/components/Layout";
import axios from "axios";
import { ChevronUpIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { DownloadIcon } from "@chakra-ui/icons";
import Comments from "@/components/comments";
import LabelFilter from "@/components/LabelFilter";
import LastUpdatedDateTime from "@/components/LastUpdatedDateTime";
import EipsLabelChart from "@/components/PrLabelsChart";
import { useScrollSpy } from "@/hooks/useScrollSpy";

// Helper function to extract PR number from URL
const extractPrNumber = (url: string) => {
  const prMatch = url.match(/\/pull\/(\d+)/);
  return prMatch ? prMatch[1] : "N/A";
};

const labelColors: { [key: string]: { color: string; description: string } } = {
  // General or Unlabeled
  unlabeled: { color: "gray.500", description: "No specific label applied." },
  "1272989785": {
    color: "gray.600",
    description: "No specific description available.",
  },

  // Review/Waiting Labels
  "a-review": {
    color: "yellow.500",
    description: "Waiting on author to review.",
  },
  "e-review": {
    color: "blue.400",
    description: "Waiting on editor to review.",
  },
  "e-consensus": {
    color: "orange.400",
    description: "Waiting on editor consensus.",
  },
  "w-response": {
    color: "yellow.600",
    description: "Waiting on author response.",
  },
  "w-ci": { color: "red.500", description: "Waiting on CI to pass." },
  "w-stale": { color: "gray.900", description: "Waiting on activity." },

  // Bug and Enhancements
  bug: { color: "red.600", description: "Fixes or reports a bug." },
  enhancement: {
    color: "green.500",
    description: "Adds new features or improvements.",
  },

  // Creation and Modification Labels
  "c-new": { color: "teal.500", description: "Creates a brand new proposal." },
  "c-status": {
    color: "blue.600",
    description: "Changes a proposal's status.",
  },
  "c-update": {
    color: "cyan.500",
    description: "Modifies an existing proposal.",
  },

  // Dependencies
  dependencies: {
    color: "purple.500",
    description: "Pull requests that update a dependency file.",
  },
  "e-blocked": {
    color: "red.700",
    description: "Requires another open PR to be merged.",
  },
  "e-blocking": {
    color: "pink.500",
    description: "Required to be merged by another open PR.",
  },
  "e-circular": {
    color: "orange.600",
    description: "Circular dependency requires manual merging.",
  },
  "w-dependency": {
    color: "orange.700",
    description: "This EIP depends on another EIP with a less stable status.",
  },

  // Status Labels
  "s-draft": { color: "purple.700", description: "This EIP is a Draft." },
  "s-final": { color: "green.600", description: "This EIP is Final." },
  "s-lastcall": {
    color: "orange.500",
    description: "This EIP is in Last Call.",
  },
  "s-review": { color: "blue.500", description: "This EIP is in Review." },
  "s-stagnant": { color: "gray.800", description: "This EIP is Stagnant." },
  "s-withdrawn": { color: "red.800", description: "This EIP is Withdrawn." },
  stagnant: { color: "gray.700", description: "Marked as stagnant." },
  stale: { color: "gray.600", description: "No recent activity." },

  // Topics/Types
  "t-core": {
    color: "blue.600",
    description: "Related to core functionality.",
  },
  "t-erc": { color: "teal.600", description: "Related to ERC standards." },
  "t-informational": {
    color: "cyan.600",
    description: "Provides informational guidance.",
  },
  "t-interface": {
    color: "purple.600",
    description: "Related to interface design.",
  },
  "t-meta": { color: "yellow.500", description: "Meta-related proposals." },
  "t-networking": {
    color: "green.700",
    description: "Networking-related proposals.",
  },
  "t-process": { color: "pink.600", description: "Relates to EIP process." },
  "t-security": { color: "red.600", description: "Relates to security." },

  // Miscellaneous
  "created-by-bot": { color: "gray.500", description: "Created by a bot." },
  "discussions-to": {
    color: "cyan.700",
    description: "Points to related discussions.",
  },
  "e-number": {
    color: "blue.700",
    description: "Waiting on EIP Number assignment.",
  },
  question: {
    color: "purple.700",
    description: "Denotes a question or inquiry.",
  },
  javascript: {
    color: "orange.600",
    description: "Pull requests that update Javascript code.",
  },
  ruby: {
    color: "red.600",
    description: "Pull requests that update Ruby code.",
  },

  // Repository-Specific Labels
  "r-ci": { color: "gray.400", description: "Relates to the CI." },
  "r-eips": {
    color: "cyan.500",
    description: "Relates to EIP formatting or repository.",
  },
  "r-other": {
    color: "gray.600",
    description: "Relates to other parts of the EIPs repository.",
  },
  "r-process": {
    color: "blue.500",
    description: "Relates to the EIP process.",
  },
  "r-website": {
    color: "green.600",
    description: "Relates to the EIPs website.",
  },
};

interface EIPData {
  _id: string;
  prNumber: string;
  prTitle: string;
  labels: string[];
  prCreatedDate: string;
  prLink: string;
  state: string;
}

const DashboardPage = () => {
  const [eipData, setEipData] = useState([]);
  const [ercData, setErcData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [activeTab, setActiveTab] = useState("EIPs"); // Default to 'EIPs'
  const [show, setShow] = useState(false);
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);

    useScrollSpy([
  "EIPsBOARD",
]);

  const toggleCollapse = () => setShow(!show);

  const handleLabelToggle = (label: string) => {
    setSelectedLabels((prev) =>
      prev.includes(label) ? prev?.filter((l) => l !== label) : [...prev, label]
    );
  };

  const filteredData = (data: EIPData[]) => {
    const filterAndSort = (items: EIPData[]) => {
      return items
        ?.filter((item) => {
          // Ignore items with state 'closed'
          if (item.state === "closed") return false;

          // Ignore items with both 'dependencies' and 'ruby' labels
          const hasDependencies = item.labels.includes("dependencies");
          const hasRuby = item.labels.includes("ruby");
          if (hasDependencies && hasRuby) return false;

          return true;
        })
        .sort((a, b) => {
          const aHasWithdrawn = a.labels.includes("s-withdrawn") ? 1 : 0;
          const bHasWithdrawn = b.labels.includes("s-withdrawn") ? 1 : 0;
          return aHasWithdrawn - bHasWithdrawn;
        });
    };

    if (selectedLabels?.length === 0) {
      return filterAndSort(data);
    }

    return filterAndSort(data)?.filter((item) =>
      item.labels.some((label) => selectedLabels.includes(label))
    );
  };

  // Fetch data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/FullBoards");
        setEipData(response.data.eips || []);
        setErcData(response.data.ercs || []);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setHasError(true);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const displayedData =
    activeTab === "EIPs" ? filteredData(eipData) : filteredData(ercData);

  // Extract unique labels for the filter
  const allLabels = Array.from(
    new Set([...eipData, ...ercData].flatMap((item: EIPData) => item.labels))
  );

  const handleDownload = () => {
    // Check the active tab and fetch the appropriate data
    const filteredData = displayedData;

    if (!filteredData || filteredData?.length === 0) {
      alert(`No data available for the selected month in ${activeTab}.`);
      return;
    }

    console.log(`Data for download in ${activeTab}:`, filteredData);

    // Pass the filtered data and active tab (EIPs or ERCs) to the CSV function
    downloadCSV(filteredData, activeTab);
  };

  const downloadCSV = (data: any, type: string) => {
    const csv = convertToCSV(data, type);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.setAttribute("hidden", "");
    a.setAttribute("href", url);
    a.setAttribute("download", `${type}-board-data.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const convertToCSV = (filteredData: any, type: string) => {
    const headers = [
      "Serial Number",
      "PR Number",
      "PR Title",
      "Labels",
      "Created Date",
      "URL",
    ];

    const escapeField = (val: any) => {
      if (val === null || val === undefined) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    const csvRows: string[] = [];
    csvRows.push(headers.map(escapeField).join(","));

    filteredData?.forEach((item: any, index: number) => {
      const rowValues = [
        index + 1,
        item.prNumber,
        item.prTitle,                // May contain commas → escaped
        (item.labels || []).join("; "), // Use semicolons inside field
        new Date(item.prCreatedDate).toLocaleDateString(),
        item.prLink,
      ];
      csvRows.push(rowValues.map(escapeField).join(","));
    });

    return csvRows.join("\r\n");
  };

  if (isLoading) {
    return (
      <AllLayout>
        <Box textAlign="center" mt="20">
          <Spinner size="xl" color="teal.500" />
        </Box>
      </AllLayout>
    );
  }

  if (hasError) {
    return (
      <AllLayout>
        <Box textAlign="center" mt="20">
          <Text fontSize="lg" color="red.500">
            Failed to load data.
          </Text>
        </Box>
      </AllLayout>
    );
  }

  // Determine which data to show based on the active tab
  // const displayedData = activeTab === 'EIPs' ? eipData : ercData;

  // useScrollSpy(["EIPsBOARD"]);

  return (
    <>
      <AllLayout>
        {/* Tab selection for EIPs and ERCs */}
        <Box padding={{ base: 1, md: 4 }} margin={{ base: 2, md: 4 }}>
          <Box
            pl={4}
            bg={useColorModeValue("blue.50", "gray.700")}
            borderRadius="md"
            pr="8px"
            marginBottom={2}
          >
            <Flex justify="space-between" align="center" padding={1}>
              <Heading
                as="h3"
                size="lg"
                marginBottom={2}
                color={useColorModeValue("#3182CE", "blue.300")}
              >
                EIP Board FAQ
              </Heading>
              <Box
                bg="blue" // Gray background
                borderRadius="md" // Rounded corners
                padding={2} // Padding inside the box
              >
                <IconButton
                  onClick={toggleCollapse}
                  icon={
                    show ? (
                      <ChevronUpIcon boxSize={8} color="white" />
                    ) : (
                      <ChevronDownIcon boxSize={8} color="white" />
                    )
                  }
                  variant="ghost"
                  h="24px" // Smaller height
                  w="20px"
                  aria-label="Toggle Instructions"
                  _hover={{ bg: "blue" }} // Maintain background color on hover
                  _active={{ bg: "blue" }} // Maintain background color when active
                  _focus={{ boxShadow: "none" }} // Remove focus outline
                />
              </Box>
            </Flex>

            <Collapse in={show}>
              <Heading
                as="h4"
                size="md"
                marginBottom={4}
                color={useColorModeValue("#3182CE", "blue.300")}
              >
                What is EIP Board?
              </Heading>
              <Text
                fontSize="md"
                marginBottom={2}
                color={useColorModeValue("gray.800", "gray.200")}
                className="text-justify"
              >
                The table below lists all Open Pull Requests (till date) in a
                order such that it uses oldest author interaction after the most
                recent editor response.
              </Text>

              <Heading
                as="h4"
                size="md"
                mb={4}
                color={useColorModeValue("#3182CE", "blue.300")}
              >
                How do label filters work?
              </Heading>
              <Text
                fontSize="md"
                mb={2}
                color={useColorModeValue("gray.800", "gray.200")}
                className="text-justify"
              >
                You can filter table data using label filters, and the same
                filters will apply to the downloaded reports.
              </Text>

              <Heading
                as="h4"
                size="md"
                mb={4}
                color={useColorModeValue("#3182CE", "blue.300")}
              >
                How is prioritization determined?
              </Heading>
              <Text
                fontSize="md"
                mb={2}
                color={useColorModeValue("gray.800", "gray.200")}
                className="text-justify"
              >
                PRs with the "s-withdrawn" label are given the lowest priority
                and moved to the bottom of the table. The remaining PRs are
                ranked based on the longest-waiting interaction time, with those
                having the oldest interaction appearing at the top.
              </Text>

              <Text
                fontSize="md"
                marginBottom={4}
                color={useColorModeValue("gray.800", "gray.200")}
                className="text-justify"
              >
                PS: This tool is based on a fork from{" "}
                <LI
                  href="https://github.com/gaudren/eip-board"
                  color="blue"
                  textDecoration="underline"
                  isExternal
                >
                  here
                </LI>
                .
              </Text>

              <Heading
                as="h4"
                size="md"
                marginBottom={4}
                color={useColorModeValue("#3182CE", "blue.300")}
              >
                Who would use this tool?
              </Heading>
              <Text
                fontSize="md"
                marginBottom={2}
                color={useColorModeValue("gray.800", "gray.200")}
                className="text-justify"
              >
                This tool is created to support EIP/ERC Editors to identify the
                longest waiting PRs for Editor's review. These PRs can also be
                discussed in{" "}
                <LI
                  href="https://www.youtube.com/watch?v=dwJrlAfM14E&list=PL4cwHXAawZxqnDHxOyuwMpyt5s8F8gdmO"
                  color="blue"
                  textDecoration="underline"
                  isExternal
                >
                  EIP Editing Office Hour
                </LI>{" "}
                and{" "}
                <LI
                  href="https://www.youtube.com/playlist?list=PL4cwHXAawZxpLrRIkDlBjDUUrGgF91pQw"
                  color="blue"
                  textDecoration="underline"
                  isExternal
                >
                  EIPIP Meetings
                </LI>{" "}
                in case it requires attention of more than one editor/reviewer.
              </Text>
            </Collapse>

            {/* {!show && (
        <Flex justify="center" align="center" marginTop={4}>
          <Text color={useColorModeValue("#3182CE", "blue.300")} cursor="pointer" onClick={toggleCollapse}>
            View Instructions
          </Text>
          <ChevronDownIcon color={useColorModeValue("#3182CE", "blue.300")} />
        </Flex>
      )} */}
          </Box>

          <Flex justify="center" mt={1}>
            <Button
              colorScheme="blue"
              onClick={() => setActiveTab("EIPs")}
              isActive={activeTab === "EIPs"}
              mr={4}
            >
              EIPs
            </Button>
            <Button
              colorScheme="blue"
              onClick={() => setActiveTab("ERCs")}
              isActive={activeTab === "ERCs"}
            >
              ERCs
            </Button>
          </Flex>

          {/* Heading based on active tab */}
          {/* <Box
          ml={2}
          mr={2}
          border="1px solid #e2e8f0"
          borderRadius="10px 10px 10px 10px"
          boxShadow="lg"
          bg="#171923" // Dark mode background
        > */}
          <Flex justify="space-between" align="center" p={4} id="EIPsBOARD">
            <Heading
              as="h2"
              size="lg"
              color={useColorModeValue("#3182CE", "blue.300")}
            >
              {activeTab} BOARD ({displayedData?.length})
            </Heading>
            <Button
              colorScheme="blue"
              variant="outline"
              fontSize={{ base: "0.6rem", md: "md" }}
              fontWeight={"bold"}
              padding={"8px 20px"}
              onClick={async () => {
                try {
                  // Trigger the CSV conversion and download
                  handleDownload();

                  // Trigger the API call
                  await axios.post("/api/DownloadCounter");
                } catch (error) {
                  console.error("Error triggering download counter:", error);
                }
              }}
            >
              <DownloadIcon marginEnd={"1.5"} />
              Download Reports
            </Button>
          </Flex>

          {/* EtherWorld Advertisement */}
          <Box my={6} mx={4}>
            <CloseableAdCard />
          </Box>

          {/* Scrollable Table */}
          <TableContainer
            minHeight="500px"
            overflowY="auto"
            overflowX="auto"
            borderWidth="1px"
            borderRadius="md"
            p={4}
            boxShadow="md"
            maxHeight="900px"
          >
            <Table
              variant="striped"
              colorScheme="gray"
              size="md"
              borderRadius="md"
              boxShadow="md"
              width="100%"
            >
              <Thead bg="#171923">
                <Tr>
                  <Th
                    textAlign="center"
                    borderTopLeftRadius="10px"
                    minWidth="6rem"
                    color="white"
                  >
                    Serial Number
                  </Th>
                  <Th textAlign="center" minWidth="10rem" color="white">
                    PR Number
                  </Th>
                  <Th textAlign="center" minWidth="10rem" color="white">
                    PR Date
                  </Th>
                  <Th textAlign="center" minWidth="10rem" color="white">
                    Labels
                    <LabelFilter
                      labels={allLabels}
                      selectedLabels={selectedLabels}
                      onLabelToggle={handleLabelToggle}
                    />
                  </Th>
                  <Th
                    textAlign="center"
                    borderTopRightRadius="10px"
                    minWidth="10rem"
                    color="white"
                  >
                    PR Link
                  </Th>
                </Tr>
              </Thead>

              <Tbody>
                {displayedData?.length === 0 ? (
                  <Tr>
                    <Td colSpan={3} textAlign="center" color="white">
                      No Data Available
                    </Td>
                  </Tr>
                ) : (
                  displayedData?.map((item: any, index: number) => (
                    <Tr key={item._id} height="40px">
                      {" "}
                      {/* Adjust row height */}
                      {/* Index */}
                      <Td textAlign="center">
                        <Box
                          bg="gray.600"
                          color="white"
                          borderRadius="md"
                          paddingX="8px"
                          paddingY="4px"
                          fontSize="md"
                          display="inline-block"
                        >
                          {index + 1}
                        </Box>
                      </Td>
                      {/* PR Number */}
                      <Td textAlign="center">
                        <Box
                          bg="gray.600"
                          color="white"
                          borderRadius="md"
                          paddingX="8px"
                          paddingY="4px"
                          fontSize="md"
                          display="inline-block"
                        >
                          {item.prNumber}
                        </Box>
                      </Td>
                      {/* PR Created Date */}
                      <Td textAlign="center">
                        <Box
                          bg="gray.600"
                          color="white"
                          borderRadius="md"
                          paddingX="8px"
                          paddingY="4px"
                          fontSize="md"
                          display="inline-block"
                        >
                          {new Date(item.prCreatedDate).toLocaleDateString()}
                        </Box>
                      </Td>
                      {/* Labels */}
                      <Td textAlign="center">
                        <Box
                          display="flex"
                          flexWrap="wrap"
                          gap="8px"
                          justifyContent="center"
                        >
                          {item.labels?.map((label: string, idx: number) => {
                            // Use the mapped color or a fallback color if the label is not in labelColors
                            const { color } = labelColors[
                              label.toLowerCase()
                            ] || { color: "gray.400" };

                            return (
                              <Box
                                key={idx}
                                bg={color}
                                color="white"
                                borderRadius="full"
                                paddingX="10px"
                                paddingY="4px"
                                fontSize="sm"
                              >
                                {label}
                              </Box>
                            );
                          })}
                        </Box>
                      </Td>
                      {/* View PR Button */}
                      <Td textAlign="center">
                        <button
                          style={{
                            backgroundColor: "#428bca",
                            color: "#ffffff",
                            border: "none",
                            padding: "6px 12px",
                            fontSize: "0.85rem",
                            cursor: "pointer",
                            borderRadius: "5px",
                          }}
                        >
                          <a
                            href={item.prLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: "#ffffff", textDecoration: "none" }}
                          >
                            View PR
                          </a>
                        </button>
                      </Td>
                    </Tr>
                  ))
                )}
              </Tbody>
            </Table>
          </TableContainer>
          <Box
            bg={useColorModeValue("blue.50", "gray.700")} // Background color for the box
            color="black" // Text color
            borderRadius="md" // Rounded corners
            padding={2} // Padding inside the box
            marginTop={2} // Margin above the box
          >
            <LastUpdatedDateTime name="Boards" />
          </Box>

          {/* </Box> */}

          <Box
            bg={useColorModeValue("blue.50", "gray.700")} // Background color for the box
            color="black" // Text color
            borderRadius="md" // Rounded corners
            padding={4} // Padding inside the box
            marginTop={4} // Margin above the box
          >
            <Text>
              For other details, check{" "}
              <LI href="/Analytics" color="blue" isExternal>
                PRs Analytics
              </LI>{" "}
              and{" "}
              <LI href="/Reviewers" color="blue" isExternal>
                Editors Leaderboard
              </LI>
              .
            </Text>
          </Box>

          <Box>
            <br />
            <hr></hr>
            <br />
            <Text fontSize="3xl" fontWeight="bold">
              Comments
            </Text>
            <Comments page={"boards"} />
          </Box>
        </Box>
      </AllLayout>
    </>
  );
};

export default DashboardPage;