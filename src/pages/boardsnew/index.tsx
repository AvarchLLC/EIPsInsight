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
  Checkbox,
  CheckboxGroup,
  SimpleGrid,
} from "@chakra-ui/react";
import React, { useEffect, useState, useMemo } from "react";
import AllLayout from "@/components/Layout";
import { ExternalLinkIcon, SearchIcon, DownloadIcon, ChevronUpIcon, ChevronDownIcon, CopyIcon, ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { BiGitPullRequest } from "react-icons/bi";
import { format } from "date-fns";
import axios from "axios";
import CloseableAdCard from "@/components/CloseableAdCard";
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

/** Board row — mapped from /api/AnalyticsCharts/category-subcategory/[name]/details (same as Graph 3 table). */
interface BoardRow {
  index: number;
  number: number;
  title: string;
  author: string;
  createdAt: string;
  waitTimeDays: number | null;
  category: string;
  subcategory: string;
  labels: string[];
  prUrl: string;
  specType: string;
}

const PROCESS_ORDER = ["PR DRAFT", "Typo", "NEW EIP", "Website", "EIP-1", "Tooling", "Status Change", "Other"];

const SUBCATEGORY_OPTIONS = [
  { value: "", label: "All (Participants)" },
  { value: "Waiting on Editor", label: "Waiting on Editor" },
  { value: "Waiting on Author", label: "Waiting on Author" },
  { value: "Stagnant", label: "Stagnant" },
  { value: "Awaited", label: "Awaited" },
  { value: "Misc", label: "Misc" },
];

/** Row shape from /api/AnalyticsCharts/category-subcategory/[name]/details — same as Graph 3 table. */
interface DetailsRow {
  MonthKey?: string;
  Month?: string;
  Repo?: string;
  Process?: string;
  Participants?: string;
  PRNumber?: number;
  PRId?: number;
  PRLink?: string;
  Title?: string;
  Author?: string;
  State?: string;
  CreatedAt?: string;
  ClosedAt?: string;
  Labels?: string;
  GitHubRepo?: string;
}

function getCurrentMonthYear(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function formatMonthLabel(monthYear: string): string {
  if (!/^\d{4}-\d{2}$/.test(monthYear)) return monthYear;
  const [y, m] = monthYear.split("-").map(Number);
  return new Date(y, m - 1, 1).toLocaleString("default", { month: "short", year: "numeric" });
}

function detailsRowToBoardRow(row: DetailsRow, index: number): BoardRow {
  const createdAt = row.CreatedAt ?? "";
  const waitTimeDays =
    createdAt
      ? Math.floor((Date.now() - new Date(createdAt).getTime()) / (24 * 60 * 60 * 1000))
      : null;
  const specType =
    row.Repo === "ERC PRs" ? "ERC" : row.Repo === "RIP PRs" ? "RIP" : "EIP";
  return {
    index: index + 1,
    number: row.PRNumber ?? 0,
    title: row.Title ?? "",
    author: row.Author ?? "",
    createdAt,
    waitTimeDays,
    category: row.Process ?? "",
    subcategory: row.Participants ?? "",
    labels: row.Labels ? row.Labels.split("; ").filter(Boolean) : [],
    prUrl: row.PRLink ?? "",
    specType,
  };
}


const DashboardPage = () => {
  const [boardData, setBoardData] = useState<BoardRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"EIPs" | "ERCs" | "RIPs" | "All">("EIPs");
  const [selectedMonth, setSelectedMonth] = useState<string>(getCurrentMonthYear());
  const [availableMonths, setAvailableMonths] = useState<string[]>([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("Waiting on Editor");
  const [selectedCategories, setSelectedCategories] = useState<string[]>(PROCESS_ORDER);
  const [sort, setSort] = useState<"waitTime" | "created">("waitTime");
  const [searchQuery, setSearchQuery] = useState("");
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 20,
  });

  const repoKey = activeTab === "EIPs" ? "eips" : activeTab === "ERCs" ? "ercs" : activeTab === "RIPs" ? "rips" : "all";

  // Fetch available months from Graph 3 API (same source as Graph 3 chart).
  useEffect(() => {
    const controller = new AbortController();
    fetch(`/api/AnalyticsCharts/graph3/${repoKey}`, { signal: controller.signal })
      .then((res) => (res.ok ? res.json() : { data: [] }))
      .then((json: { data?: { monthYear?: string }[] }) => {
        const data = Array.isArray(json?.data) ? json.data : [];
        const monthStrings = data.map((d) => d.monthYear).filter((m): m is string => !!m);
        const months: string[] = [...new Set(monthStrings)].sort((a, b) => b.localeCompare(a));
        setAvailableMonths(months);
        if (months.length > 0 && !months.includes(selectedMonth)) {
          const current = getCurrentMonthYear();
          setSelectedMonth(months.includes(current) ? current : months[0]);
        }
      })
      .catch(() => setAvailableMonths([]));
    return () => controller.abort();
  }, [repoKey]);

  // Fetch all open PRs for selected month from details API — same as Graph 3 table.
  useEffect(() => {
    if (!selectedMonth || !/^\d{4}-\d{2}$/.test(selectedMonth)) {
      setBoardData([]);
      setIsLoading(false);
      return;
    }
    const controller = new AbortController();
    setIsLoading(true);
    setHasError(false);
    setErrorMessage("");
    const url = `/api/AnalyticsCharts/category-subcategory/${repoKey}/details?month=${selectedMonth}&source=snapshot`;
    fetch(url, { signal: controller.signal })
      .then((res) => (res.ok ? res.json() : []))
      .then((raw: DetailsRow[]) => {
        const rows = Array.isArray(raw) ? raw.map((r, i) => detailsRowToBoardRow(r, i)) : [];
        setBoardData(rows);
      })
      .catch((err) => {
        if (err?.name !== "AbortError") {
          setErrorMessage(err?.message ?? "Failed to load board data.");
          setHasError(true);
          setBoardData([]);
        }
      })
      .finally(() => setIsLoading(false));
    return () => controller.abort();
  }, [repoKey, selectedMonth]);

  // Categories present in data (ordered like eipboards)
  const categoriesInData = useMemo(() => {
    const set = new Set(boardData.map((r) => r.category || "Other"));
    return PROCESS_ORDER.filter((p) => set.has(p)).concat(
      [...set].filter((p) => !PROCESS_ORDER.includes(p)).sort()
    );
  }, [boardData]);

  // Filter by subcategory (Participants), category (Process), search; then sort. Client-side so we have full Graph 3 set.
  const filteredData = useMemo(() => {
    let list = boardData;
    if (selectedSubcategory) {
      list = list.filter(
        (r) =>
          r.subcategory.toLowerCase() === selectedSubcategory.toLowerCase() ||
          (selectedSubcategory === "Awaited" && r.subcategory === "Awaited") ||
          (selectedSubcategory === "Uncategorized" && r.subcategory === "Misc")
      );
    }
    if (selectedCategories.length > 0) {
      list = list.filter((r) => selectedCategories.includes(r.category || "Other"));
    }
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.author.toLowerCase().includes(q) ||
          String(item.number).includes(q)
      );
    }
    const sorted = [...list];
    if (sort === "created") {
      sorted.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    } else {
      sorted.sort((a, b) => (b.waitTimeDays ?? -1) - (a.waitTimeDays ?? -1));
    }
    return sorted.map((r, i) => ({ ...r, index: i + 1 }));
  }, [boardData, selectedSubcategory, selectedCategories, searchQuery, sort]);

  const totalByCategory = useMemo(() => {
    const map = new Map<string, number>();
    for (const r of filteredData) {
      const p = r.category || "Other";
      map.set(p, (map.get(p) ?? 0) + 1);
    }
    return map;
  }, [filteredData]);

  const columnHelper = createColumnHelper<BoardRow>();

  const formatWaitTime = (days: number | null) => {
    if (days == null) return "—";
    if (days >= 7) return `${Math.floor(days / 7)} week${days >= 14 ? "s" : ""}`;
    return `${days} day${days !== 1 ? "s" : ""}`;
  };

  const columns = useMemo<ColumnDef<BoardRow, any>[]>(
    () => [
      columnHelper.accessor('index', {
        header: '#',
        cell: (info) => (
          <Text fontSize="md" fontWeight="semibold" color="gray.600">
            {info.getValue()}
          </Text>
        ),
        size: 60,
      }),
      columnHelper.accessor('number', {
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
      ...(activeTab === "All"
        ? [
            columnHelper.accessor('specType', {
              header: 'Repo',
              cell: (info) => (
                <Badge colorScheme="purple" fontSize="xs" px={2} py={0.5}>
                  {info.getValue()}
                </Badge>
              ),
              size: 70,
            }),
          ]
        : []),
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
            {info.getValue() ? format(new Date(info.getValue()), 'MMM dd, yyyy') : '—'}
          </Text>
        ),
        size: 120,
      }),
      columnHelper.accessor('waitTimeDays', {
        header: 'Wait Time',
        cell: (info) => {
          const days = info.getValue();
          const display = formatWaitTime(days);
          const waitDays = days ?? 0;
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
              {display}
            </Badge>
          );
        },
        size: 120,
      }),
      columnHelper.accessor('category', {
        header: 'Process',
        cell: (info) => (
          <Text fontSize="sm" fontWeight="medium">
            {info.getValue() || '—'}
          </Text>
        ),
        size: 120,
      }),
      columnHelper.display({
        id: 'viewPr',
        header: 'View PR',
        cell: (info) => {
          const row = info.row.original;
          return (
            <Link href={row.prUrl} isExternal color="blue.500" fontWeight="600" fontSize="sm">
              View <ExternalLinkIcon mx="2px" />
            </Link>
          );
        },
        size: 90,
      }),
    ],
    [activeTab]
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

  const downloadCSV = (data: BoardRow[], type: string) => {
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

    const statusGroups: { [key: string]: BoardRow[] } = {
      'Final': [],
      'Last Call': [],
      'Review': [],
      'Draft': [],
      'Other': []
    };

    filteredData.forEach(item => {
      const titleLower = item.title.toLowerCase();
      if (titleLower.includes('move to final')) statusGroups['Final'].push(item);
      else if (titleLower.includes('move to last call')) statusGroups['Last Call'].push(item);
      else if (titleLower.includes('move to review')) statusGroups['Review'].push(item);
      else if (titleLower.includes('move to draft') || titleLower.includes('add erc') || titleLower.includes('add eip')) statusGroups['Draft'].push(item);
      else statusGroups['Other'].push(item);
    });

    let markdown = '';
    if (statusGroups['Final'].length > 0) {
      markdown += '### To `Final` \n';
      statusGroups['Final'].forEach(item => { markdown += `* [${item.title} #${item.number}](${item.prUrl})\n`; });
      markdown += '\n';
    }
    if (statusGroups['Last Call'].length > 0) {
      markdown += '### To `Last Call` \n';
      statusGroups['Last Call'].forEach(item => { markdown += `* [${item.title} #${item.number}](${item.prUrl})\n`; });
      markdown += '\n';
    }
    if (statusGroups['Review'].length > 0) {
      markdown += '### To `Review` \n';
      statusGroups['Review'].forEach(item => { markdown += `* [${item.title} #${item.number}](${item.prUrl})\n`; });
      markdown += '\n';
    }
    if (statusGroups['Draft'].length > 0) {
      markdown += '### To `Draft` \n';
      statusGroups['Draft'].forEach(item => { markdown += `* [${item.title} #${item.number}](${item.prUrl})\n`; });
      markdown += '\n';
    }
    if (statusGroups['Other'].length > 0) {
      markdown += '#### Other\n';
      statusGroups['Other'].forEach(item => { markdown += `* [${item.title} #${item.number}](${item.prUrl})\n`; });
      markdown += '\n';
    }

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

  const convertToCSV = (data: BoardRow[], type: string) => {
    const headers = [
      "#",
      "PR Number",
      "Title",
      "Author",
      "Created",
      "Wait Time (days)",
      "Process",
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
        item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "",
        item.waitTimeDays != null ? item.waitTimeDays : "",
        item.category || "",
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
        <Box textAlign="center" mt="20" px={4}>
          <Text fontSize="lg" color="red.500" mb={2}>
            Failed to load board data.
          </Text>
          {errorMessage && (
            <Text fontSize="sm" color="gray.600" maxW="xl" mx="auto">
              {errorMessage}
            </Text>
          )}
          <Text fontSize="sm" color="gray.500" mt={2}>
            Check the console for details. Ensure OPENPRS_MONGODB_URI is set and the board API is available.
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
            <HStack spacing={4} flexWrap="wrap">
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
              <Button
                colorScheme="teal"
                onClick={() => setActiveTab("All")}
                variant={activeTab === "All" ? "solid" : "outline"}
                size="lg"
              >
                All (EIPs + ERCs + RIPs)
              </Button>
            </HStack>
            
            <Box flex="1" maxW={{ base: "100%", md: "600px" }}>
              {/* <CloseableAdCard /> */}
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
              <VStack align="start" spacing={0}>
                <Heading
                  as="h2"
                  fontSize="36px"
                  fontWeight="bold"
                  color="#40E0D0"
                  minW="200px"
                >
                  📋 {activeTab} BOARD ({filteredData.length})
                </Heading>
                <Text fontSize="xs" color="gray.500" mt={1}>
                  Same data as Graph 3 table. Pick month, then filter by Participants (subcategory) or Process.
                </Text>
              </VStack>

              {/* Month (same as Graph 3); Subcategory (Participants); Sort */}
              <HStack spacing={3} minW="300px" flexWrap="wrap">
                <Select
                  value={selectedMonth}
                  onChange={(e) => {
                    setSelectedMonth(e.target.value);
                    setPagination({ pageIndex: 0, pageSize: 20 });
                  }}
                  bg={useColorModeValue("blue.50", "gray.700")}
                  borderColor={useColorModeValue("blue.300", "blue.500")}
                  fontWeight="semibold"
                  maxW="140px"
                  title="Month — same as Graph 3"
                >
                  {availableMonths.length > 0 ? (
                    availableMonths.map((m) => (
                      <option key={m} value={m}>
                        {formatMonthLabel(m)}
                      </option>
                    ))
                  ) : (
                    <option value={selectedMonth}>{formatMonthLabel(selectedMonth)}</option>
                  )}
                </Select>
                <Select
                  value={selectedSubcategory}
                  onChange={(e) => {
                    setSelectedSubcategory(e.target.value);
                    setPagination({ pageIndex: 0, pageSize: 20 });
                  }}
                  bg={useColorModeValue("blue.50", "gray.700")}
                  borderColor={useColorModeValue("blue.300", "blue.500")}
                  fontWeight="semibold"
                  color={useColorModeValue("blue.700", "blue.200")}
                  _hover={{ borderColor: useColorModeValue("blue.400", "blue.400") }}
                  maxW="220px"
                >
                  {SUBCATEGORY_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
                <Select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as "waitTime" | "created")}
                  bg={useColorModeValue("blue.50", "gray.700")}
                  borderColor={useColorModeValue("blue.300", "blue.500")}
                  fontWeight="semibold"
                  maxW="140px"
                >
                  <option value="waitTime">Longest wait first</option>
                  <option value="created">Oldest first</option>
                </Select>
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

            {/* Process (Category) checkboxes — same as eipboards */}
            <Box p={4} borderRadius="lg" bg={useColorModeValue("gray.50", "gray.800")} borderWidth="1px" mt={4}>
              <Flex justify="space-between" align="center" mb={3} flexWrap="wrap" gap={2}>
                <Text fontWeight="semibold">Filter by Category (Process):</Text>
                <HStack spacing={2}>
                  <Button
                    size="sm"
                    colorScheme="teal"
                    variant="outline"
                    onClick={() => {
                      setSelectedCategories([...categoriesInData]);
                      setPagination({ pageIndex: 0, pageSize: 20 });
                    }}
                  >
                    Select all
                  </Button>
                  <Button
                    size="sm"
                    colorScheme="blue"
                    variant="outline"
                    onClick={() => {
                      setSelectedCategories(categoriesInData.slice(0, 2));
                      setPagination({ pageIndex: 0, pageSize: 20 });
                    }}
                  >
                    Select few
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setSelectedCategories([]);
                      setPagination({ pageIndex: 0, pageSize: 20 });
                    }}
                  >
                    Clear
                  </Button>
                </HStack>
              </Flex>
              <CheckboxGroup
                value={selectedCategories}
                onChange={(v) => {
                  setSelectedCategories(v as string[]);
                  setPagination({ pageIndex: 0, pageSize: 20 });
                }}
              >
                <SimpleGrid columns={{ base: 2, sm: 3, md: 4, lg: 5 }} spacing={2}>
                  {categoriesInData.map((cat) => (
                    <Flex key={cat} align="center" gap={1}>
                      <Checkbox value={cat} size="sm" />
                      <Text as="span" fontSize="sm">{cat}</Text>
                      {totalByCategory.has(cat) && (
                        <Badge ml={1} colorScheme="blue" fontSize="xs">
                          {totalByCategory.get(cat)}
                        </Badge>
                      )}
                    </Flex>
                  ))}
                </SimpleGrid>
              </CheckboxGroup>
            </Box>
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
                    <Td colSpan={8} textAlign="center" py={8}>
                      <VStack spacing={2}>
                        <Icon as={BiGitPullRequest} boxSize={12} color="gray.400" />
                        <Text color="gray.500" fontSize="lg">No PRs found</Text>
                      </VStack>
                    </Td>
                  </Tr>
                ) : (
                    table.getRowModel().rows.map((row) => (
                        <Tr
                          key={row.id}
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
                    ))
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
            {/* <br />
            <hr></hr>
            <br />
            <Text fontSize="3xl" fontWeight="bold">
              Comments
            </Text> */}
            {/* <Comments page={"boards"} /> */}
          </Box>
        </Box>
      </AllLayout>
    </>
  );
};

export default DashboardPage;