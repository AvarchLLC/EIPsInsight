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
  
  // Custom Labels
  "custom:bump": {
    color: "gray.500",
    description: "Dependency bump PR.",
  },
  "custom:ci": {
    color: "orange.500",
    description: "CI/workflow related changes.",
  },
  "custom:website": {
    color: "teal.500",
    description: "Website or documentation changes.",
  },
  "custom:typo": {
    color: "purple.400",
    description: "Typo or grammar fixes.",
  },
  "custom:needs-editor-review": {
    color: "blue.500",
    description: "Needs editor review.",
  },
  "custom:needs-author-review": {
    color: "yellow.500",
    description: "Needs author review.",
  },
  
  // Review Status
  "needs-editor-review": {
    color: "blue.500",
    description: "Waiting for editor review.",
  },
  "needs-author-review": {
    color: "yellow.500",
    description: "Waiting for author response.",
  },
};

interface BoardData {
  _id: string;
  prNumber: number;
  title: string;
  prUrl: string;
  author: string;
  createdAt: string;
  updatedAt: string;
  waitingSince: string;
  waitTime: string;
  reviewStatus: 'needs-editor-review' | 'needs-author-review';
  actualLabels: string[];
  customLabels: string[];
  allLabels: string[];
  draft: boolean;
  additions: number;
  deletions: number;
  changedFiles: number;
  type: 'EIP' | 'ERC' | 'RIP';
}

const DashboardPage = () => {
  const [boardData, setBoardData] = useState<BoardData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [activeTab, setActiveTab] = useState("EIPs");
  const [selectedFilter, setSelectedFilter] = useState<string>("needs-editor-review"); // Review status filter
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]); // Multi-select label filter
  const [searchQuery, setSearchQuery] = useState("");
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 20,
  });

  // Review status options for the main dropdown
  const filterOptions = [
    { value: "needs-editor-review", label: "Needs Editor Review" },
    { value: "needs-author-review", label: "Needs Author Review" },
  ];

  // Label filter options (separate multi-select)
  const labelFilterOptions = [
    // Topic Labels
    { value: "t-core", label: "Core" },
    { value: "t-erc", label: "ERC" },
    { value: "t-networking", label: "Networking" },
    { value: "t-interface", label: "Interface" },
    // Status Labels
    { value: "s-draft", label: "Draft" },
    { value: "s-review", label: "Review" },
    { value: "s-lastcall", label: "Last Call" },
    { value: "s-final", label: "Final" },
    { value: "s-stagnant", label: "Stagnant" },
    // Creation/Modification Labels
    { value: "c-new", label: "New" },
    { value: "c-update", label: "Update" },
    { value: "c-status", label: "Status Change" },
    // Editor Labels
    { value: "e-review", label: "Editor Review" },
    { value: "e-consensus", label: "Editor Consensus" },
    // Waiting Labels
    { value: "w-ci", label: "Waiting CI" },
    { value: "w-response", label: "Waiting Response" },
    // Custom Labels
    { value: "custom:bump", label: "Bump" },
    { value: "custom:ci", label: "CI/Workflow" },
    { value: "custom:website", label: "Website/Docs" },
    { value: "custom:typo", label: "Typo Fix" },
  ];

  // All labels that can be displayed in the table
  const allowedLabels = [
    "t-core", "t-erc", "t-networking", "t-interface",
    "s-draft", "s-review", "s-lastcall", "s-final", "s-stagnant",
    "c-new", "c-update", "c-status",
    "e-review", "e-consensus",
    "w-ci", "w-response",
    "custom:bump", "custom:ci", "custom:website", "custom:typo",
    "custom:needs-editor-review", "custom:needs-author-review",
    "needs-editor-review", "needs-author-review",
  ];


  const handleFilterChange = (filterValue: string) => {
    setSelectedFilter(filterValue);
    setPagination({ pageIndex: 0, pageSize: 20 }); // Reset pagination on filter change
  };

  const handleLabelToggle = (label: string) => {
    setSelectedLabels((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
    );
  };

  const handleSelectAllLabels = () => {
    setSelectedLabels(labelFilterOptions.map(opt => opt.value));
  };

  const handleClearLabels = () => {
    setSelectedLabels([]);
  };

  // Parse wait time string to hours for sorting
  const parseWaitTime = (waitTime: string): number => {
    const match = waitTime.match(/(\d+)\s*(day|hour|minute)s?/);
    if (!match) return 0;
    const value = parseInt(match[1]);
    const unit = match[2];
    if (unit === 'day') return value * 24;
    if (unit === 'hour') return value;
    if (unit === 'minute') return value / 60;
    return 0;
  };

  const filteredData = useMemo(() => {
    let filtered = boardData.filter(item => {
      // Filter by type (EIP, ERC, or RIP)
      const typeMatch = activeTab === "EIPs" ? "EIP" : 
                        activeTab === "ERCs" ? "ERC" : "RIP";
      if (item.type !== typeMatch) return false;
      
      return true;
    });
    
    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.prNumber.toString().includes(searchQuery)
      );
    }
    
    // Apply review status filter
    if (selectedFilter) {
      filtered = filtered.filter(item => item.reviewStatus === selectedFilter);
    }
    
    // Apply label filters (if any selected)
    if (selectedLabels.length > 0) {
      filtered = filtered.filter(item => 
        selectedLabels.some(label => item.allLabels?.includes(label))
      );
    }
    
    // Sort by wait time (longer wait = higher priority)
    return filtered.sort((a, b) => {
      const aWaitHours = parseWaitTime(a.waitTime);
      const bWaitHours = parseWaitTime(b.waitTime);
      return bWaitHours - aWaitHours;
    });
  }, [boardData, activeTab, searchQuery, selectedFilter, selectedLabels]);

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

  // Extract unique labels for the filter dropdown
  const allLabels = useMemo(() => {
    const labels = new Set<string>();
    boardData.forEach(item => {
      item.allLabels?.forEach(label => {
        labels.add(label);
      });
    });
    return Array.from(labels).sort();
  }, [boardData]);

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
            <Link href={row.prUrl} isExternal _hover={{ textDecoration: 'none' }}>
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
      columnHelper.accessor('title', {
        header: 'Title',
        cell: (info) => {
          const row = info.row.original;
          return (
            <Link href={row.prUrl} isExternal _hover={{ textDecoration: 'none' }}>
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
      columnHelper.accessor('createdAt', {
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
      columnHelper.accessor('waitTime', {
        header: 'Wait Time',
        cell: (info) => {
          const waitTime = info.getValue();
          const daysMatch = waitTime.match(/(\d+)\s*days?/);
          const waitDays = daysMatch ? parseInt(daysMatch[1]) : 0;
          return (
            <Badge
              colorScheme={
                waitDays > 30 ? "red" :
                waitDays > 14 ? "orange" :
                waitDays > 7 ? "yellow" : "green"
              }
              fontSize="sm"
              px={3}
              py={1}
              borderRadius="md"
              fontWeight="bold"
            >
              {waitTime}
            </Badge>
          );
        },
        size: 120,
      }),
      columnHelper.accessor('allLabels', {
        header: 'Labels',
        cell: (info) => {
          const itemLabels = info.getValue()?.filter((label: string) =>
            allowedLabels.includes(label)
          ) || [];
          return (
            <Wrap justify="center" spacing={1}>
              {itemLabels.length > 0 ? (
                itemLabels.slice(0, 3).map((label: string, idx: number) => {
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
      markdown += '### To `Final` \n';
      statusGroups['Final'].forEach(item => {
        markdown += `* [${item.title} #${item.prNumber}](${item.prUrl})\n`;
      });
      markdown += '\n';
    }

    if (statusGroups['Last Call'].length > 0) {
      markdown += '### To `Last Call` \n';
      statusGroups['Last Call'].forEach(item => {
        markdown += `* [${item.title} #${item.prNumber}](${item.prUrl})\n`;
      });
      markdown += '\n';
    }

    if (statusGroups['Review'].length > 0) {
      markdown += '### To `Review` \n';
      statusGroups['Review'].forEach(item => {
        markdown += `* [${item.title} #${item.prNumber}](${item.prUrl})\n`;
      });
      markdown += '\n';
    }

    if (statusGroups['Draft'].length > 0) {
      markdown += '### To `Draft` \n';
      statusGroups['Draft'].forEach(item => {
        markdown += `* [${item.title} #${item.prNumber}](${item.prUrl})\n`;
      });
      markdown += '\n';
    }

    if (statusGroups['Other'].length > 0) {
      markdown += '#### Other\n';
      statusGroups['Other'].forEach(item => {
        markdown += `* [${item.title} #${item.prNumber}](${item.prUrl})\n`;
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
      "Review Status",
      "Wait Time",
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
        item.title,
        item.author,
        item.reviewStatus === "needs-editor-review" ? "Editor Review" : "Author Review",
        item.waitTime,
        item.allLabels?.join("; ") || "",
        new Date(item.createdAt).toLocaleDateString(),
        item.prUrl,
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
            description="Prioritized view of all open pull requests sorted by longest-waiting interaction time. Filter by labels, search by title or PR number, and download detailed reports."
            faqItems={[
              {
                question: "What is the EIP Board?",
                answer: "The table below lists all Open Pull Requests (till date) in an order such that it uses oldest author interaction after the most recent editor response."
              },
              {
                question: "How do label filters work?",
                answer: "You can filter table data using label filters, and the same filters will apply to the downloaded reports."
              },
              {
                question: "How is prioritization determined?",
                answer: "PRs with the 's-withdrawn' label are given the lowest priority and moved to the bottom of the table. The remaining PRs are ranked based on the longest-waiting interaction time, with those having the oldest interaction appearing at the top."
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
              <Button
                colorScheme="blue"
                onClick={() => setActiveTab("RIPs")}
                variant={activeTab === "RIPs" ? "solid" : "outline"}
                size="lg"
              >
                RIPs
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
                placeholder="Search by title, author, or PR#..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                bg={useColorModeValue("white", "gray.800")}
              />
            </InputGroup>
          </Flex>

          {/* Board Header with Filter and Actions */}
          <Box p={4} id="EIPsBOARD">
            <Flex 
              justify="space-between" 
              align="center" 
              mb={4} 
              flexWrap="wrap" 
              gap={4}
              p={4}
              borderRadius="lg"
              boxShadow="md"
            >
              {/* Left: Board Title with Count */}
              <Heading
                as="h2"
                fontSize="36px"
                fontWeight="bold"
                color="#40E0D0"
                minW="200px"
              >
                📋 {activeTab} BOARD ({filteredData.length})
              </Heading>
              
              {/* Center: Review Status Dropdown & Label Filter Menu */}
              <HStack spacing={3} minW="300px">
                <Select
                  value={selectedFilter}
                  onChange={(e) => handleFilterChange(e.target.value)}
                  bg={useColorModeValue("blue.50", "gray.700")}
                  borderColor={useColorModeValue("blue.300", "blue.500")}
                  fontWeight="semibold"
                  color={useColorModeValue("blue.700", "blue.200")}
                  _hover={{ borderColor: useColorModeValue("blue.400", "blue.400") }}
                  maxW="250px"
                >
                  {filterOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
                
                {/* Label Filter Dropdown */}
                <Menu closeOnSelect={false}>
                  <MenuButton
                    as={Button}
                    rightIcon={<ChevronDownIcon />}
                    bg={useColorModeValue("blue.50", "gray.700")}
                    borderWidth="1px"
                    borderColor={useColorModeValue("blue.300", "blue.500")}
                    fontWeight="semibold"
                    color={useColorModeValue("blue.700", "blue.200")}
                    _hover={{ 
                      bg: useColorModeValue("blue.100", "gray.600"),
                      borderColor: useColorModeValue("blue.400", "blue.400")
                    }}
                    minW="150px"
                  >
                    {selectedLabels.length > 0 ? (
                      <HStack spacing={2}>
                        <Text>Labels</Text>
                        <Badge colorScheme="blue" borderRadius="full" fontSize="xs">
                          {selectedLabels.length}
                        </Badge>
                      </HStack>
                    ) : (
                      "Labels"
                    )}
                  </MenuButton>
                  <MenuList maxH="400px" overflowY="auto">
                    <MenuItem
                      icon={<Icon as={BiGitPullRequest} />}
                      onClick={handleSelectAllLabels}
                      fontWeight="semibold"
                    >
                      Select All Labels
                    </MenuItem>
                    <MenuItem
                      onClick={handleClearLabels}
                      isDisabled={selectedLabels.length === 0}
                      color="red.500"
                      fontWeight="semibold"
                    >
                      Clear All Labels
                    </MenuItem>
                    <MenuDivider />
                    {labelFilterOptions.map((option) => (
                      <MenuItem
                        key={option.value}
                        onClick={() => handleLabelToggle(option.value)}
                        bg={selectedLabels.includes(option.value) ? useColorModeValue("blue.50", "blue.900") : undefined}
                        _hover={{ bg: useColorModeValue("gray.100", "gray.700") }}
                      >
                        <HStack justify="space-between" w="100%">
                          <Text>{option.label}</Text>
                          {selectedLabels.includes(option.value) && (
                            <Icon as={BiGitPullRequest} color="blue.500" />
                          )}
                        </HStack>
                      </MenuItem>
                    ))}
                  </MenuList>
                </Menu>
              </HStack>
              
              {/* Right: Export Actions */}
              <HStack spacing={2} flexWrap="wrap">
                <Button
                  colorScheme="teal"
                  variant="solid"
                  size="md"
                  fontWeight="bold"
                  leftIcon={<CopyIcon />}
                  onClick={handleCopyAsMarkdown}
                  _hover={{ transform: "translateY(-2px)", boxShadow: "lg" }}
                  transition="all 0.2s"
                >
                  Copy as MD
                </Button>
                <Button
                  colorScheme="blue"
                  variant="solid"
                  size="md"
                  fontWeight="bold"
                  leftIcon={<DownloadIcon />}
                  onClick={async () => {
                    try {
                      handleDownload();
                      await axios.post("/api/DownloadCounter");
                    } catch (error) {
                      console.error("Error triggering download counter:", error);
                    }
                  }}
                  _hover={{ transform: "translateY(-2px)", boxShadow: "lg" }}
                  transition="all 0.2s"
                >
                  Download CSV
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
                      const isWithdrawn = item.allLabels?.includes('s-withdrawn') || false;
                      return (
                        <Tr
                          key={row.id}
                          bg={isWithdrawn ? useColorModeValue("red.50", "red.900") : undefined}
                          opacity={isWithdrawn ? 0.7 : 1}
                          _hover={{
                            bg: useColorModeValue("blue.50", "gray.700"),
                            transition: "all 0.2s"
                          }}
                        >
                          {row.getVisibleCells().map((cell) => (
                            <Td
                              key={cell.id}
                              py={3}
                              textAlign={cell.column.id === 'title' ? 'left' : 'center'}
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