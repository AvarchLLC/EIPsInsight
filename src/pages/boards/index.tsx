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
  Link,
  Spinner,
  Text,
  Flex,
  Button,
  useColorModeValue,
  Badge,
  Input,
  Select,
  HStack,
  VStack,
  Icon,
  Tooltip,
  Tag,
  TagLabel,
  Wrap,
  WrapItem,
  InputGroup,
  InputLeftElement,
  IconButton,
  Collapse,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState, useMemo } from "react";
import AllLayout from "@/components/Layout";
import { ExternalLinkIcon, SearchIcon, DownloadIcon, ChevronUpIcon, ChevronDownIcon, CopyIcon } from "@chakra-ui/icons";
import { BiGitPullRequest } from "react-icons/bi";
import { format } from "date-fns";
import axios from "axios";
import EtherWorldAdCard from "@/components/EtherWorldAdCard";
import LabelFilter from "@/components/LabelFilter";
import LastUpdatedDateTime from "@/components/LastUpdatedDateTime";
import Comments from "@/components/comments";

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
  
  // Auto-generated labels
  "typo-fix": {
    color: "purple.400",
    description: "Fixes typos in the document.",
  },
  "status-change": {
    color: "cyan.600",
    description: "Changes the status of an EIP/ERC.",
  },
};

interface BoardData {
  _id: string;
  number: number;
  title: string;
  url: string;
  author: string;
  created_at: string;
  waiting_since: string;
  wait_duration_hours: number;
  priority_score: number;
  is_withdrawn: boolean;
  labels: string[];
  events_count: number;
  commits_count: number;
  comments_count: number;
  review_count: number;
  last_updated: string;
  last_editor_interaction: string | null;
  last_author_interaction: string | null;
  type: 'EIP' | 'ERC';
}

const DashboardPage = () => {
  const [boardData, setBoardData] = useState<BoardData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [activeTab, setActiveTab] = useState("EIPs");
  const [show, setShow] = useState(false);
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");


  const toggleCollapse = () => setShow(!show);

  const handleLabelToggle = (label: string) => {
    setSelectedLabels((prev) =>
      prev.includes(label) ? prev?.filter((l) => l !== label) : [...prev, label]
    );
  };

  // Auto-add labels based on title
  const addAutoLabels = (item: BoardData): string[] => {
    const autoLabels = [...item.labels];
    const titleLower = item.title.toLowerCase();
    
    // Add "typo fix" label if title contains "typo"
    if (titleLower.includes('typo') && !autoLabels.includes('typo-fix')) {
      autoLabels.push('typo-fix');
    }
    
    // Add "status-change" label if title contains "move to"
    if (titleLower.includes('move to') && !autoLabels.includes('status-change')) {
      autoLabels.push('status-change');
    }
    
    return autoLabels;
  };

  const filteredData = useMemo(() => {
    let filtered = boardData.filter(item => item.type === activeTab.slice(0, 3).toUpperCase());
    
    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.number.toString().includes(searchQuery)
      );
    }
    
    // Label filter
    if (selectedLabels.length > 0) {
      filtered = filtered.filter(item => {
        const itemLabels = addAutoLabels(item);
        return itemLabels.some(label => selectedLabels.includes(label));
      });
    }
    
    // Sort by priority score (higher = more urgent)
    return filtered.sort((a, b) => b.priority_score - a.priority_score);
  }, [boardData, activeTab, searchQuery, selectedLabels]);

  // Fetch data from the new API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/boards");
        if (response.data.success) {
          setBoardData(response.data.data || []);
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setHasError(true);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Extract unique labels including auto-generated ones
  const allLabels = useMemo(() => {
    const labels = new Set<string>();
    boardData.forEach(item => {
      addAutoLabels(item).forEach(label => labels.add(label));
    });
    return Array.from(labels).sort();
  }, [boardData]);

  const handleDownload = () => {
    if (!filteredData || filteredData.length === 0) {
      alert(`No data available in ${activeTab}.`);
      return;
    }
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

  const toast = useToast();

  const handleCopyAsMarkdown = () => {
    if (!filteredData || filteredData.length === 0) {
      toast({
        title: "No data available",
        description: `No PRs found in ${activeTab}.`,
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Group PRs by status change type
    const statusGroups: { [key: string]: BoardData[] } = {
      'Final': [],
      'Last Call': [],
      'Review': [],
      'Draft': [],
      'Other': []
    };

    filteredData.forEach(item => {
      const titleLower = item.title.toLowerCase();
      if (titleLower.includes('move to final')) {
        statusGroups['Final'].push(item);
      } else if (titleLower.includes('move to last call')) {
        statusGroups['Last Call'].push(item);
      } else if (titleLower.includes('move to review')) {
        statusGroups['Review'].push(item);
      } else if (titleLower.includes('move to draft') || titleLower.includes('add erc') || titleLower.includes('add eip')) {
        statusGroups['Draft'].push(item);
      } else {
        statusGroups['Other'].push(item);
      }
    });

    // Build markdown string
    let markdown = '';

    // Add each section if it has items
    if (statusGroups['Final'].length > 0) {
      markdown += '#### To `Final`\n';
      statusGroups['Final'].forEach(item => {
        markdown += `* [${item.title} ${item.type}s#${item.number}](${item.url})\n`;
      });
      markdown += '\n';
    }

    if (statusGroups['Last Call'].length > 0) {
      markdown += '#### To `Last Call`\n';
      statusGroups['Last Call'].forEach(item => {
        markdown += `* [${item.title} ${item.type}s#${item.number}](${item.url})\n`;
      });
      markdown += '\n';
    }

    if (statusGroups['Review'].length > 0) {
      markdown += '#### To `Review`\n';
      statusGroups['Review'].forEach(item => {
        markdown += `* [${item.title} ${item.type}s#${item.number}](${item.url})\n`;
      });
      markdown += '\n';
    }

    if (statusGroups['Draft'].length > 0) {
      markdown += '#### To `Draft`\n';
      statusGroups['Draft'].forEach(item => {
        markdown += `* [${item.title} ${item.type}s#${item.number}](${item.url})\n`;
      });
      markdown += '\n';
    }

    if (statusGroups['Other'].length > 0) {
      markdown += '#### Other\n';
      statusGroups['Other'].forEach(item => {
        markdown += `* [${item.title} ${item.type}s#${item.number}](${item.url})\n`;
      });
      markdown += '\n';
    }

    // Copy to clipboard
    navigator.clipboard.writeText(markdown).then(() => {
      toast({
        title: "Copied to clipboard!",
        description: `${filteredData.length} PRs copied as markdown.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    }).catch(err => {
      console.error('Failed to copy:', err);
      toast({
        title: "Failed to copy",
        description: "Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    });
  };

  const convertToCSV = (data: BoardData[], type: string) => {
    const headers = [
      "Serial Number",
      "PR Number",
      "PR Title",
      "Author",
      "Wait Duration (hours)",
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

    data.forEach((item, index) => {
      const rowValues = [
        index + 1,
        item.number,
        item.title,
        item.author,
        item.wait_duration_hours.toFixed(1),
        addAutoLabels(item).join("; "),
        new Date(item.created_at).toLocaleDateString(),
        item.url,
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
            bgGradient={useColorModeValue(
              'linear(to-br, blue.50, purple.50)',
              'linear(to-br, gray.800, gray.900)'
            )}
            borderRadius="lg"
            borderWidth="2px"
            borderColor={useColorModeValue('blue.200', 'gray.600')}
            p={4}
            mb={4}
            boxShadow="md"
            transition="all 0.3s"
            _hover={{ boxShadow: 'lg' }}
          >
            <Flex justify="space-between" align="center" mb={show ? 3 : 0} cursor="pointer" onClick={toggleCollapse}>
              <Heading
                as="h2"
                size="md"
                color={useColorModeValue('blue.700', 'blue.300')}
                fontWeight="bold"
                letterSpacing="tight"
                fontFamily="'Inter', sans-serif"
              >
                📚 EIP Board FAQ
              </Heading>
              <IconButton
                onClick={toggleCollapse}
                icon={show ? <ChevronUpIcon boxSize={5} /> : <ChevronDownIcon boxSize={5} />}
                variant="ghost"
                colorScheme="blue"
                aria-label="Toggle FAQ"
                size="sm"
                _hover={{ transform: 'scale(1.1)' }}
                transition="transform 0.2s"
              />
            </Flex>

            <Collapse in={show} animateOpacity>
            <Box pt={3} px={1}>
              {/* Question 1 */}
              <Box mb={4} p={3} bg={useColorModeValue('blue.50', 'gray.700')} borderRadius="md" borderLeftWidth="3px" borderLeftColor="blue.500">
                <Heading 
                  as="h3" 
                  size="sm" 
                  mb={2} 
                  color={useColorModeValue('gray.800', 'gray.100')} 
                  fontWeight="bold"
                  fontFamily="'Inter', sans-serif"
                >
                  💡 What is EIP Board?
                </Heading>
                <Text fontSize="sm" color={useColorModeValue('gray.600', 'gray.300')} lineHeight="1.6" fontFamily="'Inter', sans-serif">
                  The table below lists all Open Pull Requests (till date) in a
                  order such that it uses oldest author interaction after the most
                  recent editor response.
                </Text>
              </Box>

              {/* Question 2 */}
              <Box mb={4} p={3} bg={useColorModeValue('blue.50', 'gray.700')} borderRadius="md" borderLeftWidth="3px" borderLeftColor="purple.500">
                <Heading 
                  as="h3" 
                  size="sm" 
                  mb={2} 
                  color={useColorModeValue('gray.800', 'gray.100')} 
                  fontWeight="bold"
                  fontFamily="'Inter', sans-serif"
                >
                  🏷️ How do label filters work?
                </Heading>
                <Text fontSize="sm" color={useColorModeValue('gray.600', 'gray.300')} lineHeight="1.6" fontFamily="'Inter', sans-serif">
                  You can filter table data using label filters, and the same
                  filters will apply to the downloaded reports.
                </Text>
              </Box>

              {/* Question 3 */}
              <Box mb={4} p={3} bg={useColorModeValue('blue.50', 'gray.700')} borderRadius="md" borderLeftWidth="3px" borderLeftColor="green.500">
                <Heading 
                  as="h3" 
                  size="sm" 
                  mb={2} 
                  color={useColorModeValue('gray.800', 'gray.100')} 
                  fontWeight="bold"
                  fontFamily="'Inter', sans-serif"
                >
                  📊 How is prioritization determined?
                </Heading>
                <Text fontSize="sm" color={useColorModeValue('gray.600', 'gray.300')} lineHeight="1.6" fontFamily="'Inter', sans-serif">
                  PRs with the "s-withdrawn" label are given the lowest priority
                  and moved to the bottom of the table. The remaining PRs are
                  ranked based on the longest-waiting interaction time, with those
                  having the oldest interaction appearing at the top.
                </Text>
              </Box>

              {/* Question 4 */}
              <Box mb={4} p={3} bg={useColorModeValue('blue.50', 'gray.700')} borderRadius="md" borderLeftWidth="3px" borderLeftColor="orange.500">
                <Heading 
                  as="h3" 
                  size="sm" 
                  mb={2} 
                  color={useColorModeValue('gray.800', 'gray.100')} 
                  fontWeight="bold"
                  fontFamily="'Inter', sans-serif"
                >
                  👥 Who would use this tool?
                </Heading>
                <Text fontSize="sm" color={useColorModeValue('gray.600', 'gray.300')} lineHeight="1.6" mb={2} fontFamily="'Inter', sans-serif">
                  This tool is created to support EIP/ERC Editors to identify the
                  longest waiting PRs for Editor's review. These PRs can also be
                  discussed in{" "}
                  <Link
                    href="https://www.youtube.com/watch?v=dwJrlAfM14E&list=PL4cwHXAawZxqnDHxOyuwMpyt5s8F8gdmO"
                    color="blue.500"
                    textDecoration="underline"
                    isExternal
                  >
                    EIP Editing Office Hour
                  </Link>{" "}

                  and{" "}

                  <Link
                    href="https://www.youtube.com/playlist?list=PL4cwHXAawZxpLrRIkDlBjDUUrGgF91pQw"
                    color="blue.500"
                    textDecoration="underline"
                    isExternal
                  >
                    EIPIP Meetings
                  </Link>{" "}

                  in case it requires attention of more than one editor/reviewer.
                </Text>
                <Box 
                  p={2} 
                  bg={useColorModeValue('yellow.50', 'gray.600')} 
                  borderRadius="sm"
                  borderLeftWidth="2px"
                  borderLeftColor="yellow.400"
                >
                  <Text 
                    fontSize="xs" 
                    color={useColorModeValue('gray.600', 'gray.300')} 
                    lineHeight="1.5" 
                    fontStyle="italic"
                    fontFamily="'Inter', sans-serif"
                  >
                    📌 Note: This tool is based on a fork from{" "}

                    <Link
                      href="https://github.com/gaudren/eip-board"
                      color="blue.500"
                      textDecoration="underline"
                      isExternal
                    >
                      here
                    </Link>
                    .
                  </Text>
                </Box>
              </Box>
            </Box>
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
          <Box p={4} id="EIPsBOARD">
            <Flex justify="space-between" align="center" mb={4} flexWrap="wrap" gap={4}>
              <Heading
                as="h2"
                size="lg"
                color={useColorModeValue("#3182CE", "blue.300")}
              >
                📋 {activeTab} BOARD ({filteredData.length})
              </Heading>
              <HStack spacing={2}>
                <Button
                  colorScheme="teal"
                  variant="outline"
                  fontSize={{ base: "0.6rem", md: "md" }}
                  fontWeight={"bold"}
                  padding={"8px 20px"}
                  leftIcon={<CopyIcon />}
                  onClick={handleCopyAsMarkdown}
                >
                  Copy as MD
                </Button>
                <Button
                  colorScheme="blue"
                  variant="outline"
                  fontSize={{ base: "0.6rem", md: "md" }}
                  fontWeight={"bold"}
                  padding={"8px 20px"}
                  leftIcon={<DownloadIcon />}
                  onClick={async () => {
                    try {
                      handleDownload();
                      await axios.post("/api/DownloadCounter");
                    } catch (error) {
                      console.error("Error triggering download counter:", error);
                    }
                  }}
                >
                  Download Reports
                </Button>
              </HStack>
            </Flex>
            
            {/* Search Bar */}
            <InputGroup mb={4} maxW="400px">
              <InputLeftElement pointerEvents="none">
                <SearchIcon color="gray.400" />
              </InputLeftElement>
              <Input
                placeholder="Search by title, author, or PR number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                bg={useColorModeValue("white", "gray.800")}
              />
            </InputGroup>
          </Box>

          {/* EtherWorld Advertisement */}
          <Box my={6} mx={4}>
            <EtherWorldAdCard />
          </Box>

          {/* Scrollable Table */}
          <TableContainer
            minHeight="500px"
            overflowY="auto"
            borderWidth="1px"
            borderRadius="md"
            p={4}
            boxShadow="md"
            maxHeight="900px"
          >
            <Table
              variant="simple"
              size="md"
              borderRadius="lg"
              overflow="hidden"
              width="100%"
              bg={useColorModeValue("white", "gray.800")}
            >
              <Thead 
                bg={useColorModeValue("blue.600", "gray.700")}
                position="sticky"
                top={0}
                zIndex={1}
              >
                <Tr>
                  <Th 
                    textAlign="center" 
                    color="white" 
                    width="60px"
                    fontSize="sm"
                    fontWeight="bold"
                    textTransform="uppercase"
                    letterSpacing="wider"
                  >
                    #
                  </Th>
                  <Th 
                    textAlign="center" 
                    color="white" 
                    width="110px"
                    fontSize="sm"
                    fontWeight="bold"
                    textTransform="uppercase"
                    letterSpacing="wider"
                  >
                    PR Number
                  </Th>
                  <Th 
                    textAlign="left" 
                    color="white" 
                    width="auto"
                    fontSize="sm"
                    fontWeight="bold"
                    textTransform="uppercase"
                    letterSpacing="wider"
                  >
                    Title
                  </Th>
                  <Th 
                    textAlign="center" 
                    color="white" 
                    width="140px"
                    fontSize="sm"
                    fontWeight="bold"
                    textTransform="uppercase"
                    letterSpacing="wider"
                  >
                    Wait Duration
                  </Th>
                  <Th 
                    textAlign="center" 
                    color="white" 
                    width="220px"
                    fontSize="sm"
                    fontWeight="bold"
                    textTransform="uppercase"
                    letterSpacing="wider"
                  >
                    Labels
                    <LabelFilter
                      labels={allLabels}
                      selectedLabels={selectedLabels}
                      onLabelToggle={handleLabelToggle}
                    />
                  </Th>
                  <Th 
                    textAlign="center" 
                    color="white" 
                    width="130px"
                    fontSize="sm"
                    fontWeight="bold"
                    textTransform="uppercase"
                    letterSpacing="wider"
                  >
                    Created Date
                  </Th>
                  <Th 
                    textAlign="center" 
                    color="white" 
                    width="110px"
                    fontSize="sm"
                    fontWeight="bold"
                    textTransform="uppercase"
                    letterSpacing="wider"
                  >
                    Link
                  </Th>
                </Tr>
              </Thead>

              <Tbody>
                {filteredData.length === 0 ? (
                  <Tr>
                    <Td colSpan={7} textAlign="center" py={8}>
                      <VStack spacing={2}>
                        <Icon as={BiGitPullRequest} boxSize={12} color="gray.400" />
                        <Text color="gray.500" fontSize="lg">No PRs found</Text>
                      </VStack>
                    </Td>
                  </Tr>
                ) : (
                  filteredData.map((item, index) => {
                    const itemLabels = addAutoLabels(item);
                    const waitDays = Math.floor(item.wait_duration_hours / 24);
                    const waitHours = Math.floor(item.wait_duration_hours % 24);
                    
                    return (
                      <Tr 
                        key={item._id}
                        bg={item.is_withdrawn ? useColorModeValue("red.50", "red.900") : undefined}
                        opacity={item.is_withdrawn ? 0.7 : 1}
                        _hover={{ 
                          bg: useColorModeValue("blue.50", "gray.700"),
                          transform: "scale(1.001)",
                          transition: "all 0.2s"
                        }}
                      >
                        {/* Serial Number */}
                        <Td textAlign="center">
                          <Badge 
                            colorScheme="gray" 
                            fontSize="sm" 
                            px={3} 
                            py={1}
                            borderRadius="full"
                            fontWeight="bold"
                          >
                            {index + 1}
                          </Badge>
                        </Td>
                        
                        {/* PR Number */}
                        <Td textAlign="center">
                          <HStack justify="center" spacing={2}>
                            <Icon as={BiGitPullRequest} color="blue.500" boxSize={5} />
                            <Badge 
                              colorScheme="blue" 
                              fontSize="sm" 
                              px={3} 
                              py={1}
                              borderRadius="full"
                              fontWeight="bold"
                            >
                              #{item.number}
                            </Badge>
                          </HStack>
                        </Td>
                        
                        {/* Title */}
                        <Td>
                          <Tooltip label={item.title} placement="top" hasArrow>
                            <Text 
                              noOfLines={2} 
                              fontWeight="medium"
                              fontSize="sm"
                              color={useColorModeValue("gray.700", "gray.200")}
                              _hover={{ color: useColorModeValue("blue.600", "blue.300") }}
                              transition="color 0.2s"
                            >
                              {item.title}
                            </Text>
                          </Tooltip>
                        </Td>
                        
                        {/* Wait Duration */}
                        <Td textAlign="center">
                          <VStack spacing={1}>
                            <Badge 
                              colorScheme={
                                waitDays > 30 ? "red" : 
                                waitDays > 14 ? "orange" : 
                                waitDays > 7 ? "yellow" : "green"
                              }
                              fontSize="sm"
                              px={3}
                              py={1}
                              borderRadius="full"
                              fontWeight="bold"
                            >
                              {waitDays}d {waitHours}h
                            </Badge>
                            <Text fontSize="xs" color="gray.500" fontWeight="medium">
                              {item.wait_duration_hours.toFixed(0)}h total
                            </Text>
                          </VStack>
                        </Td>
                        
                        {/* Labels */}
                        <Td>
                          <Wrap justify="center" spacing={1}>
                            {itemLabels.map((label, idx) => {
                              const { color } = labelColors[label.toLowerCase()] || { color: "gray.400" };
                              return (
                                <WrapItem key={idx}>
                                  <Tag
                                    size="sm"
                                    bg={color}
                                    color="white"
                                    borderRadius="full"
                                    fontWeight="semibold"
                                    px={2}
                                  >
                                    <TagLabel fontSize="xs">{label}</TagLabel>
                                  </Tag>
                                </WrapItem>
                              );
                            })}
                          </Wrap>
                        </Td>
                        
                        {/* Created Date */}
                        <Td textAlign="center">
                          <VStack spacing={0}>
                            <Text 
                              fontSize="sm" 
                              fontWeight="semibold"
                              color={useColorModeValue("gray.700", "gray.200")}
                            >
                              {format(new Date(item.created_at), 'MMM dd, yyyy')}
                            </Text>
                            <Text fontSize="xs" color="gray.500">
                              {format(new Date(item.created_at), 'HH:mm')}
                            </Text>
                          </VStack>
                        </Td>
                        
                        {/* Link */}
                        <Td textAlign="center">
                          <Button
                            as={Link}
                            href={item.url}
                            isExternal
                            size="sm"
                            colorScheme="blue"
                            rightIcon={<ExternalLinkIcon />}
                            fontWeight="semibold"
                            _hover={{ transform: "translateY(-2px)", boxShadow: "md" }}
                            transition="all 0.2s"
                          >
                            View
                          </Button>
                        </Td>
                      </Tr>
                    );
                  })
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
              <Link href="/Analytics" color="blue" isExternal>
                PRs Analytics
              </Link>{" "}
              and{" "}
              <Link href="/Reviewers" color="blue" isExternal>
                Editors Leaderboard
              </Link>
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
