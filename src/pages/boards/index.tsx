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
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
} from "@chakra-ui/react";
import React, { useEffect, useState, useMemo } from "react";
import AllLayout from "@/components/Layout";
import { ExternalLinkIcon, SearchIcon, DownloadIcon, ChevronUpIcon, ChevronDownIcon, CopyIcon, ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { BiGitPullRequest } from "react-icons/bi";
import { format } from "date-fns";
import axios from "axios";
import CloseableAdCard from "@/components/CloseableAdCard";
import LabelFilter from "@/components/LabelFilter";
import LastUpdatedDateTime from "@/components/LastUpdatedDateTime";
import Comments from "@/components/comments";
import AnimatedHeader from "@/components/AnimatedHeader";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  createColumnHelper,
  ColumnDef,
  SortingState,
} from "@tanstack/react-table";

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
  prNumber: string;
  prTitle: string;
  labels: string[];
  prCreatedDate: string;
  prLink: string;
  state: string;
}

const DashboardPage = () => {
  const [eipData, setEipData] = useState<BoardData[]>([]);
  const [ercData, setErcData] = useState<BoardData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [activeTab, setActiveTab] = useState("EIPs");
  const [show, setShow] = useState(false);
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 20,
  });

  // Labels available in the filter dropdown
  const filterLabels = [
    "w-ci", "c-new", "created-by-bot", "status-change", "typo-fix", "e-review"
  ];

  // Normalized display names for filter labels
  const labelDisplayNames: { [key: string]: string } = {
    "w-ci": "Waiting on CI",
    "c-new": "New Proposal",
    "created-by-bot": "Created by Bot",
    "status-change": "Status Change",
    "typo-fix": "Typo Fix",
    "e-review": "Editor Review"
  };

  // All labels that can be displayed in the table
  const allowedLabels = [
    "e-review", "e-consensus", "w-response", "w-ci", "w-stale", 
    "bug", "enhancement", "c-new", "c-update", "c-status", "s-draft", 
    "s-final", "s-lastcall", "s-review", "s-stagnant", "s-withdrawn",
    "created-by-bot", "status-change"
  ];


  const toggleCollapse = () => setShow(!show);

  const handleLabelToggle = (label: string) => {
    setSelectedLabels((prev) =>
      prev.includes(label) ? prev?.filter((l) => l !== label) : [...prev, label]
    );
  };

  const handleSelectAll = () => {
    setSelectedLabels(allLabels);
  };

  const handleRemoveAll = () => {
    setSelectedLabels([]);
  };

  // Auto-add labels based on title
  const addAutoLabels = (item: BoardData): string[] => {
    const autoLabels = [...item.labels];
    const titleLower = item.prTitle.toLowerCase();
    
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
    const currentData = activeTab === "EIPs" ? eipData : ercData;
    
    let filtered = currentData.filter(item => {
      // Ignore items with state 'closed'
      if (item.state === "closed") return false;

      // Ignore items with both 'dependencies' and 'ruby' labels
      const hasDependencies = item.labels.includes("dependencies");
      const hasRuby = item.labels.includes("ruby");
      if (hasDependencies && hasRuby) return false;
      
      // Remove PRs with 'a-review' label
      const itemLabels = addAutoLabels(item);
      if (itemLabels.some(label => label.toLowerCase() === 'a-review')) return false;
      
      // Filter out PRs starting with "CI" or "bump"
      const titleLower = item.prTitle.toLowerCase();
      if (titleLower.startsWith('ci') || titleLower.startsWith('bump')) return false;
      
      // Filter out bot-generated stagnant PRs (pattern: EIP-XXXX stagnant (date) or ERC-XXXX stagnant (date))
      // Keep author-generated stagnant PRs like "Update EIP-5003: Move to Stagnant"
      const botStagnantPattern = /^(EIP|ERC)-\d+\s+stagnant\s+\(/i;
      if (botStagnantPattern.test(item.prTitle)) return false;
      
      return true;
    });
    
    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(item => 
        item.prTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.prNumber.toString().includes(searchQuery)
      );
    }
    
    // Label filter
    if (selectedLabels.length > 0) {
      filtered = filtered.filter(item => {
        const itemLabels = addAutoLabels(item);
        return itemLabels.some(label => selectedLabels.includes(label));
      });
    }
    
    // Sort by s-withdrawn label (move to bottom)
    return filtered.sort((a, b) => {
      const aHasWithdrawn = a.labels.includes("s-withdrawn") ? 1 : 0;
      const bHasWithdrawn = b.labels.includes("s-withdrawn") ? 1 : 0;
      return aHasWithdrawn - bHasWithdrawn;
    });
  }, [eipData, ercData, activeTab, searchQuery, selectedLabels]);

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

  // Extract unique labels for the filter dropdown (only filterLabels)
  const allLabels = useMemo(() => {
    const labels = new Set<string>();
    [...eipData, ...ercData].forEach(item => {
      addAutoLabels(item).forEach(label => {
        if (filterLabels.includes(label.toLowerCase())) {
          labels.add(label);
        }
      });
    });
    return Array.from(labels).sort();
  }, [eipData, ercData, filterLabels]);

  const columnHelper = createColumnHelper<BoardData>();

  const columns = useMemo<ColumnDef<BoardData, any>[]>(
    () => [
      columnHelper.display({
        id: 'serial',
        header: '#',
        cell: (info) => (
          <Text fontSize="md" fontWeight="semibold" color="gray.600">
            {pagination.pageIndex * pagination.pageSize + info.row.index + 1}
          </Text>
        ),
        size: 60,
      }),
      columnHelper.accessor('prNumber', {
        header: 'PR #',
        cell: (info) => {
          const row = info.row.original;
          return (
            <Link href={row.prLink} isExternal _hover={{ textDecoration: 'none' }}>
              <HStack justify="center" spacing={1}>
                <Icon as={BiGitPullRequest} color="blue.500" boxSize={5} />
                <Text 
                  fontSize="md" 
                  fontWeight="bold" 
                  color="blue.500"
                  _hover={{
                    color: useColorModeValue("blue.800", "blue.100"),
                    textDecoration: "underline"
                  }}
                  transition="all 0.2s"
                  cursor="pointer"
                >
                  {info.getValue()}
                </Text>
              </HStack>
            </Link>
          );
        },
        size: 100,
      }),
      columnHelper.accessor('prTitle', {
        header: 'Title',
        cell: (info) => {
          const row = info.row.original;
          return (
            <Link href={row.prLink} isExternal _hover={{ textDecoration: 'none' }}>
              <Tooltip label={info.getValue()} placement="top" hasArrow>
                <Text
                  noOfLines={1}
                  fontWeight="medium"
                  fontSize="md"
                  color={useColorModeValue("blue.600", "blue.300")}
                  _hover={{
                    color: useColorModeValue("blue.800", "blue.100"),
                    textDecoration: "underline"
                  }}
                  transition="all 0.2s"
                  cursor="pointer"
                >
                  {info.getValue()}
                </Text>
              </Tooltip>
            </Link>
          );
        },
      }),
      columnHelper.accessor('prCreatedDate', {
        header: 'Created',
        cell: (info) => (
          <Text
            fontSize="sm"
            fontWeight="medium"
            color={useColorModeValue("gray.600", "gray.300")}
          >
            {format(new Date(info.getValue()), 'MMM dd, yyyy')}
          </Text>
        ),
        size: 120,
      }),
      columnHelper.accessor('labels', {
        header: 'Labels',
        cell: (info) => {
          const row = info.row.original;
          const itemLabels = addAutoLabels(row).filter(label =>
            allowedLabels.includes(label.toLowerCase())
          );
          return (
            <Wrap justify="center" spacing={1}>
              {itemLabels.length > 0 ? (
                itemLabels.slice(0, 3).map((label, idx) => {
                  const { color } = labelColors[label.toLowerCase()] || { color: "gray.400" };
                  return (
                    <WrapItem key={idx}>
                      <Tag
                        size="md"
                        bg={color}
                        color="white"
                        borderRadius="md"
                        fontWeight="semibold"
                        px={2}
                        py={1}
                      >
                        <TagLabel fontSize="sm">{label}</TagLabel>
                      </Tag>
                    </WrapItem>
                  );
                })
              ) : (
                <Text fontSize="sm" color="gray.400">-</Text>
              )}
              {itemLabels.length > 3 && (
                <Tooltip label={itemLabels.slice(3).join(', ')} placement="top">
                  <Tag size="md" bg="gray.500" color="white" borderRadius="md" px={2} py={1}>
                    <TagLabel fontSize="sm">+{itemLabels.length - 3}</TagLabel>
                  </Tag>
                </Tooltip>
              )}
            </Wrap>
          );
        },
        size: 280,
      }),
    ],
    [pagination.pageIndex, pagination.pageSize, allowedLabels]
  );

  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: false,
  });

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
      const titleLower = item.prTitle.toLowerCase();
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
      markdown += '### To `Final` \n';
      statusGroups['Final'].forEach(item => {
        markdown += `* [${item.prTitle} #${item.prNumber}](${item.prLink})\n`;
      });
      markdown += '\n';
    }

    if (statusGroups['Last Call'].length > 0) {
      markdown += '### To `Last Call` \n';
      statusGroups['Last Call'].forEach(item => {
        markdown += `* [${item.prTitle} #${item.prNumber}](${item.prLink})\n`;
      });
      markdown += '\n';
    }

    if (statusGroups['Review'].length > 0) {
      markdown += '### To `Review` \n';
      statusGroups['Review'].forEach(item => {
        markdown += `* [${item.prTitle} #${item.prNumber}](${item.prLink})\n`;
      });
      markdown += '\n';
    }

    if (statusGroups['Draft'].length > 0) {
      markdown += '### To `Draft` \n';
      statusGroups['Draft'].forEach(item => {
        markdown += `* [${item.prTitle} #${item.prNumber}](${item.prLink})\n`;
      });
      markdown += '\n';
    }

    if (statusGroups['Other'].length > 0) {
      markdown += '#### Other\n';
      statusGroups['Other'].forEach(item => {
        markdown += `* [${item.prTitle} #${item.prNumber}](${item.prLink})\n`;
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
        item.prNumber,
        item.prTitle,
        addAutoLabels(item).join("; "),
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
          {/* Animated Header with FAQ */}
          <AnimatedHeader
            title="EIP/ERC Board"
            emoji="📋"
            faqItems={[
              {
                question: "💡 What is EIP Board?",
                answer: "The table below lists all Open Pull Requests (till date) that are awaiting editor review."
              },
              {
                question: "🏷️ How do label filters work?",
                answer: "You can filter table data using label filters, and the same filters will apply to the downloaded reports."
              },
              {
                question: "📊 How is prioritization determined?",
                answer: "PRs with the 's-withdrawn' label are given the lowest priority and moved to the bottom of the table."
              },
              {
                question: "👥 Who would use this tool?",
                answer: "This tool is created to support EIP/ERC Editors to identify the longest waiting PRs for Editor's review. These PRs can also be discussed in EIP Editing Office Hour and EIPIP Meetings in case it requires attention of more than one editor/reviewer. Note: This tool is based on a fork from gaudren/eip-board."
              }
            ]}
          />

          {/* Tab Buttons and Search */}
          <Flex 
            direction={{ base: "column", md: "row" }}
            justify="space-between"
            align="center" 
            gap={4}
            my={6}
          >
            <HStack spacing={4}>
              <Button
                colorScheme="blue"
                onClick={() => setActiveTab("EIPs")}
                variant={activeTab === "EIPs" ? "solid" : "outline"}
                size="lg"
              >
                EIPs
              </Button>
              <Button
                colorScheme="blue"
                onClick={() => setActiveTab("ERCs")}
                variant={activeTab === "ERCs" ? "solid" : "outline"}
                size="lg"
              >
                ERCs
              </Button>
            </HStack>
            
            <Box flex="1" maxW={{ base: "100%", md: "600px" }}>
              <CloseableAdCard />
            </Box>

            {/* Search Bar */}
            <InputGroup maxW={{ base: "100%", md: "350px" }} minW="250px">
              <InputLeftElement pointerEvents="none">
                <SearchIcon color="gray.400" />
              </InputLeftElement>
              <Input
                placeholder="Search by title or PR#..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                bg={useColorModeValue("white", "gray.800")}
              />
            </InputGroup>
          </Flex>

          {/* Board Header with Filters */}
          <Box p={4} id="EIPsBOARD">
            <Flex justify="space-between" align="center" mb={4} flexWrap="wrap" gap={4}>
              <Heading
                as="h2"
                fontSize="36px"
                fontWeight="bold"
                color="#40E0D0"
              >
                📋 {activeTab} BOARD ({filteredData.length})
              </Heading>
              
              {/* Filters and Actions */}
              <HStack spacing={2} flexWrap="wrap">
                <LabelFilter
                  labels={allLabels}
                  selectedLabels={selectedLabels}
                  onLabelToggle={handleLabelToggle}
                  labelDisplayNames={labelDisplayNames}
                />
                <Menu>
                  <MenuButton
                    as={Button}
                    size="sm"
                    colorScheme="purple"
                    variant="outline"
                    rightIcon={<ChevronDownIcon />}
                  >
                    Label Actions
                  </MenuButton>
                  <MenuList>
                    <MenuItem
                      onClick={handleSelectAll}
                      isDisabled={selectedLabels.length === allLabels.length}
                      icon={<Icon as={BiGitPullRequest} />}
                    >
                      Select All Labels
                    </MenuItem>
                    <MenuItem
                      onClick={handleRemoveAll}
                      isDisabled={selectedLabels.length === 0}
                      color="red.500"
                    >
                      Clear All Labels
                    </MenuItem>
                  </MenuList>
                </Menu>
                
                <Button
                  colorScheme="teal"
                  variant="outline"
                  fontSize={{ base: "xs", md: "md" }}
                  fontWeight={"bold"}
                  leftIcon={<CopyIcon />}
                  onClick={handleCopyAsMarkdown}
                >
                  Copy as MD
                </Button>
                <Button
                  colorScheme="blue"
                  variant="outline"
                  fontSize={{ base: "xs", md: "md" }}
                  fontWeight={"bold"}
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
          </Box>

          {/* TanStack Table with Pagination */}
          <Box
            borderWidth="1px"
            borderRadius="md"
            boxShadow="lg"
            overflow="hidden"
            bg={useColorModeValue("white", "gray.800")}
          >
            <Box 
              overflowX="auto" 
              overflowY="auto" 
              maxH="calc(100vh - 400px)"
              position="relative"
            >
              <Table variant="simple" size="md" width="100%">
                <Thead 
                  bg={useColorModeValue("blue.600", "gray.700")}
                  position="sticky"
                  top={0}
                  zIndex={10}
                  boxShadow="md"
                >
                  {table.getHeaderGroups().map((headerGroup) => (
                    <Tr key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <Th
                          key={header.id}
                          color="white"
                          fontSize="sm"
                          fontWeight="bold"
                          textTransform="uppercase"
                          py={4}
                          textAlign={header.id === 'title' ? 'left' : 'center'}
                          bg={useColorModeValue("blue.600", "gray.700")}
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </Th>
                      ))}
                    </Tr>
                  ))}
                </Thead>
                <Tbody>
                  {table.getRowModel().rows.length === 0 ? (
                  <Tr>
                    <Td colSpan={6} textAlign="center" py={8}>
                      <VStack spacing={2}>
                        <Icon as={BiGitPullRequest} boxSize={12} color="gray.400" />
                        <Text color="gray.500" fontSize="lg">No PRs found</Text>
                      </VStack>
                    </Td>
                  </Tr>
                ) : (
                    table.getRowModel().rows.map((row) => {
                      const item = row.original;
                      return (
                        <Tr
                          key={row.id}
                          bg={item.labels.includes("s-withdrawn") ? useColorModeValue("red.50", "red.900") : undefined}
                          opacity={item.labels.includes("s-withdrawn") ? 0.7 : 1}
                          _hover={{
                            bg: useColorModeValue("blue.50", "gray.700"),
                            transition: "all 0.2s"
                          }}
                        >
                          {row.getVisibleCells().map((cell) => (
                            <Td
                              key={cell.id}
                              py={3}
                              textAlign={cell.column.id === 'prTitle' ? 'left' : 'center'}
                            >
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </Td>
                          ))}
                        </Tr>
                      );
                    })
                  )}
                </Tbody>
              </Table>
            </Box>
            
            {/* Pagination Controls */}
            <Flex
              justify="space-between"
              align="center"
              p={4}
              borderTopWidth="1px"
              borderColor={useColorModeValue("gray.200", "gray.600")}
              flexWrap="wrap"
              gap={4}
            >
              <HStack spacing={2}>
                <Button
                  size="sm"
                  onClick={() => table.setPageIndex(0)}
                  isDisabled={!table.getCanPreviousPage()}
                  leftIcon={<ChevronLeftIcon />}
                >
                  First
                </Button>
                <Button
                  size="sm"
                  onClick={() => table.previousPage()}
                  isDisabled={!table.getCanPreviousPage()}
                >
                  Previous
                </Button>
                <Button
                  size="sm"
                  onClick={() => table.nextPage()}
                  isDisabled={!table.getCanNextPage()}
                >
                  Next
                </Button>
                <Button
                  size="sm"
                  onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                  isDisabled={!table.getCanNextPage()}
                  rightIcon={<ChevronRightIcon />}
                >
                  Last
                </Button>
              </HStack>
              
              <HStack spacing={2}>
                <Text fontSize="sm" color={useColorModeValue("gray.600", "gray.400")}>
                  Go to page:
                </Text>
                <Input
                  type="number"
                  min={1}
                  max={table.getPageCount()}
                  defaultValue={table.getState().pagination.pageIndex + 1}
                  onChange={(e) => {
                    const page = e.target.value ? Number(e.target.value) - 1 : 0;
                    table.setPageIndex(page);
                  }}
                  w="70px"
                  size="sm"
                />
              </HStack>
            </Flex>
            
            {/* Page Info and Footer */}
            <Flex
              justify="space-between"
              align="center"
              px={4}
              py={2}
              borderTopWidth="1px"
              borderColor={useColorModeValue("gray.200", "gray.600")}
              bg={useColorModeValue("gray.50", "gray.900")}
              flexWrap="wrap"
              gap={2}
            >
              <Text fontSize="sm" color={useColorModeValue("gray.600", "gray.400")}>
                Page {table.getState().pagination.pageIndex + 1} of{' '}
                {table.getPageCount()} ({filteredData.length} total PRs)
              </Text>
              
              <HStack spacing={4}>
                <Box fontSize="sm">
                  <LastUpdatedDateTime name="Boards" />
                </Box>
              </HStack>
            </Flex>
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
            <Text fontSize="36px" fontWeight="bold" color="#40E0D0">
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
