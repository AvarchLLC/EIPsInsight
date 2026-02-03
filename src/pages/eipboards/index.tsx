import React, { useEffect, useState, useMemo, useRef } from "react";
import { useRouter } from "next/router";
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
  useColorModeValue,
  Badge,
  HStack,
  Wrap,
  WrapItem,
  VStack,
  Select,
  Flex,
  Button,
  useToast,
  Input,
  InputGroup,
  InputLeftElement,
  IconButton,
  Tooltip,
  Card,
  CardBody,
  CardHeader,
  SimpleGrid,
  Divider,
} from "@chakra-ui/react";
import AllLayout from "@/components/Layout";
import AnimatedHeader from "@/components/AnimatedHeader";
import { ExternalLinkIcon, SearchIcon, DownloadIcon, ChevronLeftIcon, ChevronRightIcon, CopyIcon } from "@chakra-ui/icons";
import { BiGitPullRequest } from "react-icons/bi";
import { format } from "date-fns";
import Papa from "papaparse";

/** Row from /api/AnalyticsCharts/category-subcategory/[name]/details (Graph 3 table). */
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

function normalizeProcess(p: string | undefined): string {
  const t = (p ?? "").trim();
  if (/^New\s*EIP$/i.test(t)) return "NEW EIP";
  if (/^PR\s*DRAFT$/i.test(t)) return "PR DRAFT";
  if (t === "Typo") return "Typo";
  if (t === "Website") return "Website";
  if (/^EIP-?1$/i.test(t)) return "EIP-1";
  if (t === "Tooling") return "Tooling";
  if (/^Status\s*Change$/i.test(t)) return "Status Change";
  if (t === "Other") return "Other";
  return t || "Other";
}

function normalizeParticipants(s: string | undefined): string {
  const t = (s ?? "").trim();
  if (!t) return "Misc";
  if (/^AWAITED$/i.test(t)) return "Awaited";
  if (/Waiting\s*on\s*Editor/i.test(t)) return "Waiting on Editor";
  if (/Waiting\s*on\s*Author/i.test(t)) return "Waiting on Author";
  if (/Stagnant/i.test(t)) return "Stagnant";
  if (/Uncategorized|Misc/i.test(t)) return "Misc";
  return t || "Misc";
}

const PROCESS_ORDER = ["PR DRAFT", "Typo", "NEW EIP", "Website", "EIP-1", "Tooling", "Status Change", "Other"];
const PROCESS_COLORS: Record<string, string> = {
  "PR DRAFT": "purple",
  Typo: "green",
  "NEW EIP": "orange",
  Website: "cyan",
  "EIP-1": "pink",
  Tooling: "teal",
  "Status Change": "red",
  Other: "gray",
};
const PARTICIPANT_COLORS: Record<string, string> = {
  "Waiting on Editor": "blue",
  "Waiting on Author": "green",
  Stagnant: "orange",
  Awaited: "purple",
  Misc: "gray",
};

const REPO_TABS = [
  { key: "eips" as const, label: "EIPs" },
  { key: "ercs" as const, label: "ERCs" },
  { key: "rips" as const, label: "RIPs" },
  { key: "all" as const, label: "All" },
];

const SUBCATEGORY_OPTIONS = [
  { value: "", label: "All" },
  { value: "Waiting on Editor", label: "Waiting for Editor" },
  { value: "Waiting on Author", label: "Waiting for Author" },
  { value: "Stagnant", label: "Stagnant" },
  { value: "Awaited", label: "Awaited" },
  { value: "Misc", label: "Misc" },
];

const PAGE_SIZES = [10, 25, 50, 100];

function getCurrentMonthYear(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function formatMonthLabel(monthYear: string): string {
  if (!/^\d{4}-\d{2}$/.test(monthYear)) return monthYear;
  const [y, m] = monthYear.split("-").map(Number);
  return new Date(y, m - 1, 1).toLocaleString("default", { month: "short", year: "numeric" });
}

function getWaitTimeDays(createdAt: string): number | null {
  if (!createdAt) return null;
  return Math.floor((Date.now() - new Date(createdAt).getTime()) / (24 * 60 * 60 * 1000));
}

function formatWaitTime(days: number | null): string {
  if (days == null) return "—";
  if (days >= 7) return `${Math.floor(days / 7)}w`;
  return `${days}d`;
}

const VALID_PROCESS = new Set(PROCESS_ORDER);
const VALID_PARTICIPANTS = new Set([
  "Waiting on Editor",
  "Waiting on Author",
  "Stagnant",
  "Awaited",
  "Misc",
]);

export default function EipBoardsPage() {
  const router = useRouter();
  const [rows, setRows] = useState<DetailsRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"eips" | "ercs" | "rips" | "all">("eips");
  const [selectedMonth, setSelectedMonth] = useState<string>(getCurrentMonthYear());
  const [availableMonths, setAvailableMonths] = useState<string[]>([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("Waiting on Editor");
  const [selectedCategories, setSelectedCategories] = useState<string[]>(PROCESS_ORDER);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const skipNextUrlUpdate = useRef(false);

  const toast = useToast();
  const repoKey = activeTab;

  // Read ?month= &process= &participants= from URL (e.g. from Analytics / Graph 3 "View PRs" link)
  useEffect(() => {
    if (!router.isReady) return;
    const q = router.query as Record<string, string | string[] | undefined>;
    const month = typeof q.month === "string" ? q.month.trim() : "";
    const processParam = typeof q.process === "string" ? q.process : Array.isArray(q.process) ? q.process[0] : "";
    const participantsParam = typeof q.participants === "string" ? q.participants : Array.isArray(q.participants) ? q.participants[0] : "";
    if (month && /^\d{4}-\d{2}$/.test(month)) {
      setSelectedMonth(month);
    }
    if (participantsParam) {
      const decoded = decodeURIComponent(participantsParam);
      if (VALID_PARTICIPANTS.has(decoded)) setSelectedSubcategory(decoded);
    }
    if (processParam) {
      const processes = processParam.split(",").map((p) => normalizeProcess(decodeURIComponent(p.trim())));
      const valid = processes.filter((p) => VALID_PROCESS.has(p));
      if (valid.length > 0) setSelectedCategories(valid);
    }
    skipNextUrlUpdate.current = true;
  }, [router.isReady, router.query.month, router.query.process, router.query.participants]);

  // Keep URL in sync with filters so link is shareable
  useEffect(() => {
    if (!router.isReady) return;
    if (skipNextUrlUpdate.current) {
      skipNextUrlUpdate.current = false;
      return;
    }
    const params = new URLSearchParams();
    params.set("month", selectedMonth);
    if (selectedSubcategory) params.set("participants", selectedSubcategory);
    if (selectedCategories.length > 0 && selectedCategories.length < PROCESS_ORDER.length) {
      params.set("process", selectedCategories.map((p) => encodeURIComponent(p)).join(","));
    }
    const queryString = params.toString();
    const newUrl = queryString ? `/eipboards?${queryString}` : "/eipboards";
    if (router.asPath !== newUrl) {
      router.replace(newUrl, undefined, { shallow: true });
    }
  }, [selectedMonth, selectedSubcategory, selectedCategories, router.isReady]);

  const cardBg = useColorModeValue("white", "gray.800");
  const headerBg = useColorModeValue("gray.50", "gray.700");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.200");
  const hoverBg = useColorModeValue("gray.50", "whiteAlpha.50");
  const mutedColor = useColorModeValue("gray.600", "gray.400");
  const accent = useColorModeValue("teal.600", "teal.400");

  useEffect(() => {
    const controller = new AbortController();
    fetch(`/api/AnalyticsCharts/graph3/${repoKey}`, { signal: controller.signal })
      .then((res) => (res.ok ? res.json() : { data: [] }))
      .then((json: { data?: { monthYear?: string }[] }) => {
        const data = Array.isArray(json?.data) ? json.data : [];
        const monthStrings = data.map((d) => d.monthYear).filter((m): m is string => !!m);
        const months = [...new Set(monthStrings)].sort((a, b) => b.localeCompare(a));
        setAvailableMonths(months);
        if (months.length > 0 && !months.includes(selectedMonth)) {
          const current = getCurrentMonthYear();
          setSelectedMonth(months.includes(current) ? current : months[0]);
        }
      })
      .catch(() => setAvailableMonths([]));
    return () => controller.abort();
  }, [repoKey]);

  useEffect(() => {
    if (!selectedMonth || !/^\d{4}-\d{2}$/.test(selectedMonth)) {
      setRows([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    const url = `/api/AnalyticsCharts/category-subcategory/${repoKey}/details?month=${selectedMonth}&source=snapshot`;
    fetch(url)
      .then((res) => (res.ok ? res.json() : []))
      .then((data: DetailsRow[]) => {
        setRows(Array.isArray(data) ? data : []);
        setPage(1);
      })
      .catch((err) => {
        setError(err?.message ?? "Failed to load data.");
        setRows([]);
      })
      .finally(() => setLoading(false));
  }, [repoKey, selectedMonth]);

  const categoriesInData = useMemo(() => {
    const set = new Set(rows.map((r) => normalizeProcess(r.Process)));
    return [...PROCESS_ORDER].concat([...set].filter((p) => !PROCESS_ORDER.includes(p)).sort());
  }, [rows]);

  const filteredRows = useMemo(() => {
    let list = rows;
    if (selectedSubcategory) {
      list = list.filter((r) => normalizeParticipants(r.Participants) === selectedSubcategory);
    }
    if (selectedCategories.length > 0) {
      list = list.filter((r) => selectedCategories.includes(normalizeProcess(r.Process)));
    }
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter(
        (r) =>
          (r.Title ?? "").toLowerCase().includes(q) ||
          (r.Author ?? "").toLowerCase().includes(q) ||
          String(r.PRNumber ?? "").includes(q)
      );
    }
    return [...list].sort((a, b) => {
      const da = a.CreatedAt ? new Date(a.CreatedAt).getTime() : 0;
      const db = b.CreatedAt ? new Date(b.CreatedAt).getTime() : 0;
      return da - db;
    });
  }, [rows, selectedSubcategory, selectedCategories, searchQuery]);

  const totalFiltered = filteredRows.length;
  const totalPages = Math.max(1, Math.ceil(totalFiltered / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredRows.slice(start, start + pageSize);
  }, [filteredRows, currentPage, pageSize]);

  const totalByCategory = useMemo(() => {
    const map = new Map<string, number>();
    for (const r of filteredRows) {
      const p = normalizeProcess(r.Process);
      map.set(p, (map.get(p) ?? 0) + 1);
    }
    return map;
  }, [filteredRows]);

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
    setPage(1);
  };

  const selectAllCategories = () => {
    setSelectedCategories([...categoriesInData]);
    setPage(1);
  };

  const clearCategories = () => {
    setSelectedCategories([]);
    setPage(1);
  };

  const downloadCSV = () => {
    const csvData = filteredRows.map((row) => ({
      Month: row.Month ?? formatMonthLabel(selectedMonth),
      Repo: row.Repo ?? "",
      Process: normalizeProcess(row.Process),
      Participants: normalizeParticipants(row.Participants),
      PRNumber: row.PRNumber ?? "",
      PRLink: row.PRLink ?? "",
      Title: row.Title ?? "",
      Author: row.Author ?? "",
      CreatedAt: row.CreatedAt ? new Date(row.CreatedAt).toISOString() : "",
      Labels: row.Labels ?? "",
    }));
    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `eipboards_${activeTab}_${selectedMonth}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "CSV downloaded", status: "success", duration: 2000, isClosable: true });
  };

  const copyAsMarkdown = () => {
    const byProcess = new Map<string, DetailsRow[]>();
    for (const row of filteredRows) {
      const process = normalizeProcess(row.Process);
      if (!byProcess.has(process)) byProcess.set(process, []);
      byProcess.get(process)!.push(row);
    }
    let markdown = "";
    const order = PROCESS_ORDER.concat([...byProcess.keys()].filter((p) => !PROCESS_ORDER.includes(p)));
    for (const process of order) {
      const items = byProcess.get(process);
      if (!items?.length) continue;
      markdown += `### ${process}\n`;
      items.forEach((row) => {
        const title = (row.Title ?? "").replace(/\]/g, "\\]"); // escape ] so markdown link doesn't break
        markdown += `* [${title} #${row.PRNumber ?? ""}](${row.PRLink ?? ""})\n`;
      });
      markdown += "\n";
    }
    navigator.clipboard
      .writeText(markdown.trim())
      .then(() => {
        toast({
          title: "Copied to clipboard",
          description: `${filteredRows.length} PRs copied as markdown.`,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      })
      .catch(() => {
        toast({
          title: "Failed to copy",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      });
  };

  if (loading && rows.length === 0) {
    return (
      <AllLayout>
        <Box py={20} textAlign="center">
          <Spinner size="xl" color={accent} thickness="3px" />
          <Text mt={4} fontSize="lg" color={mutedColor}>
            Loading open PRs for {formatMonthLabel(selectedMonth)}…
          </Text>
        </Box>
      </AllLayout>
    );
  }

  if (error) {
    return (
      <AllLayout>
        <Box py={20} textAlign="center">
          <Text fontSize="lg" color="red.500">{error}</Text>
        </Box>
      </AllLayout>
    );
  }

  return (
    <AllLayout>
      <Box p={{ base: 4, md: 8 }} maxW="1600px" mx="auto">
        <VStack align="stretch" spacing={6}>
          {/* Animated Header with FAQ */}
          <AnimatedHeader
            title="EIP/ERC/RIP Board"
            description="View and manage all open pull requests awaiting editor review across EIPs and ERCs. Filter by labels, search by title or PR number, and download detailed reports."
            faqItems={[
              {
                question: "What is the EIP Board?",
                answer: "The table below lists all Open Pull Requests (till date) that are awaiting editor review. It provides a comprehensive overview of pending proposals and their current status."
              },
              {
                question: "How do label filters work?",
                answer: "You can filter table data using label filters to focus on specific types of PRs. The same filters will apply to the downloaded reports, ensuring consistency in your analysis."
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

          {/* Repo + Month + Participants + Search */}
          <Card bg={cardBg} borderWidth="1px" borderColor={borderColor} shadow="sm" borderRadius="xl" overflow="hidden">
            <CardBody p={{ base: 4, md: 5 }}>
              <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                <Flex flexWrap="wrap" gap={3} align="center">
                  {REPO_TABS.map((tab) => (
                    <Button
                      key={tab.key}
                      size="md"
                      colorScheme={tab.key === activeTab ? "teal" : "gray"}
                      variant={tab.key === activeTab ? "solid" : "outline"}
                      onClick={() => setActiveTab(tab.key)}
                      fontWeight="600"
                    >
                      {tab.label}
                    </Button>
                  ))}
                  <Select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    maxW="180px"
                    size="md"
                    fontWeight="600"
                  >
                    {availableMonths.length > 0
                      ? availableMonths.map((m) => (
                          <option key={m} value={m}>{formatMonthLabel(m)}</option>
                        ))
                      : <option value={selectedMonth}>{formatMonthLabel(selectedMonth)}</option>}
                  </Select>
                </Flex>
                <Flex flexWrap="wrap" gap={3} align="center">
                  <HStack>
                    <Text fontWeight="600" color={mutedColor}>Status</Text>
                    <Select
                      value={selectedSubcategory}
                      onChange={(e) => { setSelectedSubcategory(e.target.value); setPage(1); }}
                      maxW="160px"
                      size="md"
                    >
                      {SUBCATEGORY_OPTIONS.map((opt) => (
                        <option key={opt.value || "all"} value={opt.value}>{opt.label}</option>
                      ))}
                    </Select>
                  </HStack>
                  <InputGroup maxW="280px">
                    <InputLeftElement pointerEvents="none" height="100%">
                      <SearchIcon color="gray.400" />
                    </InputLeftElement>
                    <Input
                      placeholder="Search title, author, PR #"
                      value={searchQuery}
                      onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
                      size="md"
                    />
                  </InputGroup>
                </Flex>
              </SimpleGrid>

              <Divider my={4} borderColor={borderColor} />

              {/* Process filter chips */}
              <Box>
                <Flex align="center" gap={2} mb={3} flexWrap="wrap">
                  <Text fontWeight="600" fontSize="md">Process type</Text>
                  <Badge colorScheme="teal" fontSize="md" px={2} py={0.5}>{totalFiltered}</Badge>
                  <Button size="xs" variant="ghost" colorScheme="teal" onClick={selectAllCategories}>
                    All
                  </Button>
                  <Button size="xs" variant="ghost" onClick={clearCategories}>
                    Clear
                  </Button>
                </Flex>
                <Wrap spacing={2}>
                  {categoriesInData.map((cat) => {
                    const count = totalByCategory.get(cat) ?? 0;
                    const isSelected = selectedCategories.includes(cat);
                    return (
                      <WrapItem key={cat}>
                        <Badge
                          as="button"
                          colorScheme={PROCESS_COLORS[cat] ?? "gray"}
                          variant={isSelected ? "solid" : "outline"}
                          fontSize="md"
                          px={3}
                          py={1.5}
                          borderRadius="full"
                          cursor="pointer"
                          _hover={{ opacity: 0.9 }}
                          onClick={() => toggleCategory(cat)}
                        >
                          {cat} {count > 0 && `(${count})`}
                        </Badge>
                      </WrapItem>
                    );
                  })}
                </Wrap>
              </Box>
            </CardBody>
          </Card>

          {/* Summary + Download */}
          <Flex justify="space-between" align="center" flexWrap="wrap" gap={3}>
            <HStack gap={2} flexWrap="wrap">
              <Text fontWeight="700" fontSize="lg">
                Showing{" "}
                <Badge colorScheme="teal" fontSize="md" px={2}>
                  {totalFiltered === 0 ? 0 : (currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, totalFiltered)}
                </Badge>
                {" "}of {totalFiltered} PRs
              </Text>
              <Select
                value={pageSize}
                onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
                maxW="100px"
                size="sm"
              >
                {PAGE_SIZES.map((n) => (
                  <option key={n} value={n}>{n} per page</option>
                ))}
              </Select>
            </HStack>
            <HStack gap={2}>
              <Button
                leftIcon={<CopyIcon />}
                size="md"
                colorScheme="teal"
                variant="outline"
                onClick={copyAsMarkdown}
                isDisabled={totalFiltered === 0}
              >
                Copy as MD
              </Button>
              <Button
                leftIcon={<DownloadIcon />}
                size="md"
                colorScheme="teal"
                variant="outline"
                onClick={downloadCSV}
                isDisabled={totalFiltered === 0}
              >
                Download CSV
              </Button>
            </HStack>
          </Flex>

          {/* Table */}
          <Card bg={cardBg} borderWidth="1px" borderColor={borderColor} shadow="sm" borderRadius="xl" overflow="hidden">
            <TableContainer>
              <Table size="md" variant="simple">
                <Thead bg={headerBg}>
                  <Tr>
                    <Th fontWeight="700">#</Th>
                    {activeTab === "all" && <Th fontWeight="700">Repo</Th>}
                    <Th fontWeight="700">PR</Th>
                    <Th fontWeight="700">Title</Th>
                    <Th fontWeight="700">Created</Th>
                    <Th fontWeight="700">Wait</Th>
                    <Th fontWeight="700">Process</Th>
                    <Th fontWeight="700">Status</Th>
                    <Th fontWeight="700">Labels</Th>
                    <Th fontWeight="700">Link</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {paginatedRows.map((row, idx) => {
                    const createdAt = row.CreatedAt ?? "";
                    const waitDays = getWaitTimeDays(createdAt);
                    const labels = row.Labels ? row.Labels.split("; ").filter(Boolean) : [];
                    const repoShort = row.Repo === "ERC PRs" ? "ERC" : row.Repo === "RIP PRs" ? "RIP" : "EIP";
                    const processNorm = normalizeProcess(row.Process);
                    const participantsNorm = normalizeParticipants(row.Participants);
                    return (
                      <Tr
                        key={`${row.PRNumber}-${row.Repo ?? ""}-${idx}`}
                        _hover={{ bg: hoverBg }}
                        borderBottomWidth="1px"
                        borderColor={borderColor}
                      >
                        <Td fontWeight="600">{(currentPage - 1) * pageSize + idx + 1}</Td>
                        {activeTab === "all" && (
                          <Td>
                            <Badge colorScheme="purple" fontSize="sm" px={2} py={0.5}>
                              {repoShort}
                            </Badge>
                          </Td>
                        )}
                        <Td>
                          <Link href={row.PRLink ?? "#"} isExternal color="blue.500" fontWeight="600" display="inline-flex" alignItems="center" gap={1}>
                            <BiGitPullRequest /> #{row.PRNumber ?? "—"}
                          </Link>
                        </Td>
                        <Td maxW="320px" noOfLines={1} title={row.Title ?? ""} fontSize="md">
                          {row.Title ?? "—"}
                        </Td>
                        <Td whiteSpace="nowrap" fontSize="md">
                          {createdAt ? format(new Date(createdAt), "MMM d, yyyy") : "—"}
                        </Td>
                        <Td>
                          <Badge
                            colorScheme={waitDays != null && waitDays > 30 ? "red" : waitDays != null && waitDays > 14 ? "orange" : "green"}
                            fontSize="sm"
                            px={2}
                            py={0.5}
                          >
                            {formatWaitTime(waitDays)}
                          </Badge>
                        </Td>
                        <Td>
                          <Badge colorScheme={PROCESS_COLORS[processNorm] ?? "gray"} fontSize="sm" px={2} py={0.5}>
                            {processNorm || "—"}
                          </Badge>
                        </Td>
                        <Td>
                          <Badge colorScheme={PARTICIPANT_COLORS[participantsNorm] ?? "gray"} fontSize="sm" px={2} py={0.5}>
                            {participantsNorm || "—"}
                          </Badge>
                        </Td>
                        <Td maxW="200px">
                          <Wrap spacing={1}>
                            {labels.slice(0, 3).map((l, i) => (
                              <WrapItem key={i}>
                                <Badge colorScheme="gray" fontSize="xs" px={1.5} py={0}>
                                  {l}
                                </Badge>
                              </WrapItem>
                            ))}
                            {labels.length > 3 && (
                              <WrapItem>
                                <Badge colorScheme="gray" fontSize="xs">+{labels.length - 3}</Badge>
                              </WrapItem>
                            )}
                            {labels.length === 0 && <Text color={mutedColor}>—</Text>}
                          </Wrap>
                        </Td>
                        <Td>
                          <Tooltip label="Open PR on GitHub">
                            <Link href={row.PRLink ?? "#"} isExternal display="inline-flex" alignItems="center" fontWeight="600" color="teal.500">
                              Open <ExternalLinkIcon ml={1} />
                            </Link>
                          </Tooltip>
                        </Td>
                      </Tr>
                    );
                  })}
                </Tbody>
              </Table>
            </TableContainer>

            {filteredRows.length === 0 && (
              <Box py={12} textAlign="center">
                <Text fontSize="lg" color={mutedColor}>
                  No PRs match the current filters. Try changing status or selecting more process types.
                </Text>
              </Box>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <Flex justify="space-between" align="center" px={4} py={4} borderTopWidth="1px" borderColor={borderColor} bg={headerBg} flexWrap="wrap" gap={3}>
                <Text fontWeight="600" fontSize="md">
                  Page {currentPage} of {totalPages}
                </Text>
                <HStack gap={1}>
                  <IconButton
                    aria-label="Previous page"
                    icon={<ChevronLeftIcon />}
                    size="md"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    isDisabled={currentPage <= 1}
                  />
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum: number;
                    if (totalPages <= 5) pageNum = i + 1;
                    else if (currentPage <= 3) pageNum = i + 1;
                    else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
                    else pageNum = currentPage - 2 + i;
                    return (
                      <Button
                        key={pageNum}
                        size="md"
                        colorScheme={pageNum === currentPage ? "teal" : "gray"}
                        variant={pageNum === currentPage ? "solid" : "outline"}
                        onClick={() => setPage(pageNum)}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                  <IconButton
                    aria-label="Next page"
                    icon={<ChevronRightIcon />}
                    size="md"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    isDisabled={currentPage >= totalPages}
                  />
                </HStack>
              </Flex>
            )}
          </Card>
        </VStack>
      </Box>
    </AllLayout>
  );
}
