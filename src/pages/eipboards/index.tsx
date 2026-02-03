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
import { ExternalLinkIcon, SearchIcon, DownloadIcon, ChevronLeftIcon, ChevronRightIcon, CopyIcon, CheckIcon } from "@chakra-ui/icons";
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
  { value: "Waiting on Editor", label: "⏳ Awaiting Editor" },
  { value: "Waiting on Author", label: "✍️ Awaiting Author" },
  { value: "Stagnant", label: "💤 Stagnant" },
  { value: "Awaited", label: "📬 Awaited" },
  { value: "Misc", label: "📦 Misc" },
];

/** Repo badge color when viewing "All" */
const REPO_BADGE_COLORS: Record<string, string> = {
  EIP: "purple",
  ERC: "blue",
  RIP: "orange",
};

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

/** Display wait time for table: "⏳ 18 days" or "⏳ 2 weeks" */
function formatWaitTimeDisplay(days: number | null): string {
  if (days == null) return "—";
  if (days >= 7) {
    const weeks = Math.floor(days / 7);
    return `⏳ ${weeks} week${weeks !== 1 ? "s" : ""}`;
  }
  return `⏳ ${days} day${days !== 1 ? "s" : ""}`;
}

/** Editor attention score: higher = more urgent. +10 if wait > 30d, +5 if Waiting on Editor, +3 if NEW EIP */
function getAttentionScore(
  waitDays: number | null,
  participantsNorm: string,
  processNorm: string
): number {
  let score = 0;
  if (waitDays != null && waitDays > 30) score += 10;
  else if (waitDays != null && waitDays > 14) score += 5;
  if (participantsNorm === "Waiting on Editor") score += 5;
  if (processNorm === "NEW EIP") score += 3;
  return score;
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
  const [waitPresetDays, setWaitPresetDays] = useState<[number, number] | null>(null);
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

  // EIP Editor aesthetic: slate/charcoal, purple + teal
  const bg = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");
  const subtle = useColorModeValue("gray.100", "gray.700");
  const headerBg = useColorModeValue("gray.50", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const hoverBg = useColorModeValue("gray.50", "whiteAlpha.50");
  const mutedColor = useColorModeValue("gray.600", "gray.400");
  const accent = "purple.500";
  const accent2 = "teal.400";

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

  const normalizedRows = useMemo(
    () =>
      rows.map((r) => {
        const ProcessNorm = normalizeProcess(r.Process);
        const ParticipantsNorm = normalizeParticipants(r.Participants);
        const waitDays = getWaitTimeDays(r.CreatedAt ?? "");
        const attentionScore = getAttentionScore(waitDays, ParticipantsNorm, ProcessNorm);
        return {
          ...r,
          ProcessNorm,
          ParticipantsNorm,
          waitDays,
          attentionScore,
        };
      }),
    [rows]
  );

  const categoriesInData = useMemo(() => {
    const set = new Set(normalizedRows.map((r) => r.ProcessNorm));
    return [...PROCESS_ORDER].concat([...set].filter((p) => !PROCESS_ORDER.includes(p)).sort());
  }, [normalizedRows]);

  const filteredRows = useMemo(() => {
    let list = normalizedRows;
    if (selectedSubcategory) {
      list = list.filter((r) => r.ParticipantsNorm === selectedSubcategory);
    }
    if (selectedCategories.length > 0) {
      list = list.filter((r) => selectedCategories.includes(r.ProcessNorm));
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
    if (waitPresetDays) {
      const [min, max] = waitPresetDays;
      list = list.filter((r) => r.waitDays != null && r.waitDays >= min && r.waitDays <= max);
    }
    return [...list].sort((a, b) => {
      if (b.attentionScore !== a.attentionScore) return b.attentionScore - a.attentionScore;
      const da = a.CreatedAt ? new Date(a.CreatedAt).getTime() : 0;
      const db = b.CreatedAt ? new Date(b.CreatedAt).getTime() : 0;
      return db - da;
    });
  }, [normalizedRows, selectedSubcategory, selectedCategories, searchQuery, waitPresetDays]);

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
      map.set(r.ProcessNorm, (map.get(r.ProcessNorm) ?? 0) + 1);
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

  const applyWaitPreset = (preset: "critical" | "backlog" | "fresh") => {
    if (preset === "critical") setWaitPresetDays([31, 9999]);
    else if (preset === "backlog") setWaitPresetDays([14, 30]);
    else setWaitPresetDays([0, 13]);
    setPage(1);
  };

  const downloadCSV = () => {
    const csvData = filteredRows.map((row) => ({
      Month: row.Month ?? formatMonthLabel(selectedMonth),
      Repo: row.Repo ?? "",
      Process: row.ProcessNorm,
      Participants: row.ParticipantsNorm,
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

  const copyLinkToFilters = () => {
    const params = new URLSearchParams();
    params.set("month", selectedMonth);
    if (selectedSubcategory) params.set("participants", selectedSubcategory);
    if (selectedCategories.length > 0 && selectedCategories.length < PROCESS_ORDER.length) {
      params.set("process", selectedCategories.map((p) => encodeURIComponent(p)).join(","));
    }
    const url = `${typeof window !== "undefined" ? window.location.origin : ""}/eipboards?${params.toString()}`;
    navigator.clipboard.writeText(url).then(() => {
      toast({ title: "Link copied to clipboard", status: "success", duration: 2000, isClosable: true });
    });
  };

  const copyAsMarkdown = () => {
    const byProcess = new Map<string, typeof filteredRows[0][]>();
    for (const row of filteredRows) {
      const process = row.ProcessNorm;
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
          <Spinner size="xl" color="purple.500" thickness="3px" />
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
      <Box padding={{ base: 1, md: 4 }} margin={{ base: 2, md: 4 }}>
        <VStack align="stretch" spacing={4}>
          <AnimatedHeader
            title="EIP / ERC / RIP Board"
            description="Open pull requests by type and status for the selected month. Filter by repo, process type, and participant status. Mission control for protocol changes."
            faqItems={[
              {
                question: "What does this page show?",
                answer: "This page lists open PRs for a chosen month, grouped by process type (e.g. Typo, NEW EIP, PR DRAFT) and participant status (e.g. Awaiting Editor, Awaited). You can switch between EIPs, ERCs, RIPs, or view All. The table and counts match the Analytics Process × Participants chart for that month."
              },
              {
                question: "How can I view data for a specific month?",
                answer: "Use the month dropdown (Layer 2) to select a month. The table and counts update to show open PRs at the end of that month. You can also land on this page with a link that includes the month (and filters) in the URL."
              },
              {
                question: "How can I filter the list?",
                answer: "Filter by Status (participant: Awaiting Editor, Awaiting Author, Stagnant, Awaited, Misc, or All), and by Process type using the chips. Use Quick presets (Critical / Backlog / Fresh) to filter by wait time. Use the search box to filter by title, author, or PR number."
              },
              {
                question: "How do I download or share the data?",
                answer: "Use Download CSV to export the currently filtered table. Use Copy as MD to copy a markdown list of PRs (grouped by process) to the clipboard. Use Copy link to copy the current filters to the clipboard. All respect your current filters and selected month."
              }
            ]}
          />

          {/* Layer A — Scope & Time (What am I looking at?) */}
          <Card bg={cardBg} borderWidth="1px" borderColor={borderColor} shadow="sm" borderRadius="lg" overflow="hidden">
            <CardBody py={4} px={5}>
              <Flex justify="space-between" align="center" flexWrap="wrap" gap={4}>
                <HStack spacing={2}>
                  <Text fontSize="xs" fontWeight="600" color={mutedColor}>Scope</Text>
                  {REPO_TABS.map((tab) => (
                    <Button
                      key={tab.key}
                      size="sm"
                      colorScheme={tab.key === activeTab ? "purple" : "gray"}
                      variant={tab.key === activeTab ? "solid" : "outline"}
                      onClick={() => setActiveTab(tab.key)}
                      fontWeight="600"
                    >
                      {tab.label}
                    </Button>
                  ))}
                </HStack>
                <HStack spacing={3}>
                  <Text fontSize="lg" fontWeight="800" color={accent}>
                    Open PRs for {formatMonthLabel(selectedMonth)}
                  </Text>
                  <Select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    maxW="140px"
                    size="sm"
                    fontWeight="600"
                  >
                    {availableMonths.length > 0
                      ? availableMonths.map((m) => (
                          <option key={m} value={m}>{formatMonthLabel(m)}</option>
                        ))
                      : <option value={selectedMonth}>{formatMonthLabel(selectedMonth)}</option>}
                  </Select>
                </HStack>
              </Flex>
            </CardBody>
          </Card>

          {/* Layer B — Priority Filters (How urgent is this?) */}
          <Card bg={cardBg} borderWidth="1px" borderColor={borderColor} shadow="sm" borderRadius="lg" overflow="hidden">
            <CardBody p={4}>
              <Text fontSize="xs" fontWeight="700" color={mutedColor} mb={3} letterSpacing="wider">
                PRIORITY FILTERS
              </Text>
              <Flex justify="space-between" align="center" flexWrap="wrap" gap={4}>
                <HStack>
                  <Text fontWeight="600" fontSize="sm">Status</Text>
                  <Select
                    value={selectedSubcategory}
                    onChange={(e) => { setSelectedSubcategory(e.target.value); setWaitPresetDays(null); setPage(1); }}
                    maxW="180px"
                    size="sm"
                  >
                    {SUBCATEGORY_OPTIONS.map((opt) => (
                      <option key={opt.value || "all"} value={opt.value}>{opt.label}</option>
                    ))}
                  </Select>
                </HStack>
                <HStack gap={2} flexWrap="wrap">
                  <Button size="sm" colorScheme="red" variant={waitPresetDays?.[0] === 31 ? "solid" : "outline"} onClick={() => applyWaitPreset("critical")}>
                    🔴 Critical (&gt;30d)
                  </Button>
                  <Button size="sm" colorScheme="orange" variant={waitPresetDays?.[0] === 14 ? "solid" : "outline"} onClick={() => applyWaitPreset("backlog")}>
                    🟡 Backlog (14–30d)
                  </Button>
                  <Button size="sm" colorScheme="green" variant={waitPresetDays?.[1] === 13 ? "solid" : "outline"} onClick={() => applyWaitPreset("fresh")}>
                    🟢 Fresh (&lt;14d)
                  </Button>
                  {waitPresetDays && (
                    <Button size="sm" variant="ghost" onClick={() => setWaitPresetDays(null)}>Clear preset</Button>
                  )}
                </HStack>
              </Flex>
            </CardBody>
          </Card>

          {/* Layer C — Content Filters (What type of work is this?) */}
          <Card bg={cardBg} borderWidth="1px" borderColor={borderColor} shadow="sm" borderRadius="lg" overflow="hidden">
            <CardBody p={4}>
              <Text fontSize="xs" fontWeight="700" color={mutedColor} mb={3} letterSpacing="wider">
                CONTENT FILTERS
              </Text>
              <Flex justify="space-between" align="center" flexWrap="wrap" gap={4} mb={2}>
                <InputGroup maxW="320px">
                  <InputLeftElement pointerEvents="none" height="100%">
                    <SearchIcon color="gray.400" />
                  </InputLeftElement>
                  <Input
                    placeholder="Search title, author, PR #"
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
                    size="sm"
                  />
                </InputGroup>
                <HStack spacing={2} flexWrap="wrap">
                  <Text fontWeight="700" fontSize="sm">Process type</Text>
                  <Text fontSize="sm" color={mutedColor}>•</Text>
                  <Badge colorScheme="purple" fontSize="sm" px={2} py={0.5}>
                    {totalFiltered} matching
                  </Badge>
                  <Button size="xs" variant="ghost" colorScheme="purple" onClick={selectAllCategories}>All</Button>
                  <Button size="xs" variant="ghost" onClick={clearCategories}>Clear</Button>
                </HStack>
              </Flex>
              <Wrap spacing={3} rowGap={3} justify="flex-start">
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
                            boxShadow={
                              isSelected
                                ? "0 0 0 2px var(--chakra-colors-purple-400), 0 0 10px rgba(128, 90, 213, 0.2)"
                                : undefined
                            }
                            onClick={() => toggleCategory(cat)}
                          >
                            <HStack spacing={1} display="inline-flex">
                              {isSelected && <CheckIcon boxSize={3} />}
                              <span>{cat} {count > 0 && `(${count})`}</span>
                            </HStack>
                          </Badge>
                        </WrapItem>
                      );
                    })}
              </Wrap>
            </CardBody>
          </Card>

          {/* Summary + Download */}
          <Flex justify="space-between" align="center" flexWrap="wrap" gap={3}>
            <HStack gap={2} flexWrap="wrap">
              <Text fontWeight="700" fontSize="lg">
                Showing{" "}
                <Badge colorScheme="purple" fontSize="md" px={2}>
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
            <HStack gap={2} flexWrap="wrap">
              <Button
                size="md"
                colorScheme="purple"
                variant="outline"
                onClick={copyLinkToFilters}
                title="Copy link to current filters"
              >
                Copy link
              </Button>
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
          <Card bg={cardBg} borderWidth="1px" borderColor={borderColor} shadow="sm" borderRadius="lg" overflow="hidden">
            <TableContainer>
              <Table size="md" variant="simple">
                <Thead bg={headerBg}>
                  <Tr>
                    <Th fontWeight="700">#</Th>
                    {activeTab === "all" && <Th fontWeight="700">Repo</Th>}
                    <Th fontWeight="700">🔥</Th>
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
                    const labels = row.Labels ? row.Labels.split("; ").filter(Boolean) : [];
                    const repoShort = row.Repo === "ERC PRs" ? "ERC" : row.Repo === "RIP PRs" ? "RIP" : "EIP";
                    const attentionLabel = row.attentionScore > 12 ? "High" : row.attentionScore > 6 ? "Medium" : "Low";
                    const attentionColor = row.attentionScore > 12 ? "red" : row.attentionScore > 6 ? "orange" : "green";
                    const titleTooltip = [row.Title ?? "", row.Repo ?? "", labels.join(", ")].filter(Boolean).join(" · ");
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
                            <Badge colorScheme={REPO_BADGE_COLORS[repoShort] ?? "gray"} fontSize="sm" px={2} py={0.5}>
                              {repoShort}
                            </Badge>
                          </Td>
                        )}
                        <Td>
                          <Badge colorScheme={attentionColor} fontSize="sm" px={2} py={0.5}>
                            {attentionLabel}
                          </Badge>
                        </Td>
                        <Td>
                          <Link href={row.PRLink ?? "#"} isExternal color="blue.500" fontWeight="600" display="inline-flex" alignItems="center" gap={1}>
                            <BiGitPullRequest /> #{row.PRNumber ?? "—"}
                          </Link>
                        </Td>
                        <Td maxW="320px" noOfLines={1} fontSize="md">
                          <Tooltip label={titleTooltip} placement="top" maxW="400px">
                            <span>{row.Title ?? "—"}</span>
                          </Tooltip>
                        </Td>
                        <Td whiteSpace="nowrap" fontSize="md">
                          {createdAt ? format(new Date(createdAt), "MMM d, yyyy") : "—"}
                        </Td>
                        <Td>
                          <Badge
                            colorScheme={row.waitDays != null && row.waitDays > 30 ? "red" : row.waitDays != null && row.waitDays > 14 ? "orange" : "green"}
                            fontSize="sm"
                            px={2}
                            py={0.5}
                          >
                            {formatWaitTimeDisplay(row.waitDays)}
                          </Badge>
                        </Td>
                        <Td>
                          <Badge colorScheme={PROCESS_COLORS[row.ProcessNorm] ?? "gray"} fontSize="sm" px={2} py={0.5}>
                            {row.ProcessNorm || "—"}
                          </Badge>
                        </Td>
                        <Td>
                          <Badge colorScheme={PARTICIPANT_COLORS[row.ParticipantsNorm] ?? "gray"} fontSize="sm" px={2} py={0.5}>
                            {row.ParticipantsNorm || "—"}
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
                            <Link href={row.PRLink ?? "#"} isExternal display="inline-flex" alignItems="center" fontWeight="600" color={accent2}>
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
                        colorScheme={pageNum === currentPage ? "purple" : "gray"}
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
