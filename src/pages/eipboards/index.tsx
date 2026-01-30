import React, { useEffect, useState, useMemo } from "react";
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
  Tag,
  TagLabel,
  VStack,
  Select,
  Checkbox,
  CheckboxGroup,
  Flex,
  Button,
  SimpleGrid,
  useToast,
  Input,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react";
import AllLayout from "@/components/Layout";
import { ExternalLinkIcon, SearchIcon } from "@chakra-ui/icons";
import { BiGitPullRequest } from "react-icons/bi";
import { format } from "date-fns";

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

/** Order and labels match stored category from PR collections (pranalyti). */
const PROCESS_ORDER = ["PR DRAFT", "Typo", "New EIP", "Website", "EIP-1", "Tooling", "Status Change", "Other"];

const REPO_TABS = [
  { key: "eips" as const, label: "EIPs" },
  { key: "ercs" as const, label: "ERCs" },
  { key: "rips" as const, label: "RIPs" },
  { key: "all" as const, label: "All (EIPs + ERCs + RIPs)" },
];

/** Subcategory (Participants) options; match stored subcategory from PR collections (pranalyti). */
const SUBCATEGORY_OPTIONS = [
  { value: "Waiting on Editor", label: "Waiting on Editor" },
  { value: "Waiting on Author", label: "Waiting on Author" },
  { value: "Stagnant", label: "Stagnant" },
  { value: "AWAITED", label: "Awaited" },
  { value: "Uncategorized", label: "Uncategorized" },
  { value: "Misc", label: "Misc" },
  { value: "", label: "All (Participants)" },
];

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
  if (days >= 7) return `${Math.floor(days / 7)} week${days >= 14 ? "s" : ""}`;
  return `${days} day${days !== 1 ? "s" : ""}`;
}

export default function EipBoardsPage() {
  const [rows, setRows] = useState<DetailsRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"eips" | "ercs" | "rips" | "all">("eips");
  const [selectedMonth, setSelectedMonth] = useState<string>(getCurrentMonthYear());
  const [availableMonths, setAvailableMonths] = useState<string[]>([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("Waiting on Editor");
  const [selectedCategories, setSelectedCategories] = useState<string[]>(PROCESS_ORDER);
  const [searchQuery, setSearchQuery] = useState("");
  const tableBg = useColorModeValue("white", "gray.800");
  const headerBg = useColorModeValue("gray.100", "gray.700");
  const filterBg = useColorModeValue("gray.50", "gray.800");
  const toast = useToast();

  const repoKey = activeTab;

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
    const url = `/api/AnalyticsCharts/category-subcategory/${repoKey}/details?month=${selectedMonth}`;
    fetch(url)
      .then((res) => (res.ok ? res.json() : []))
      .then((data: DetailsRow[]) => {
        setRows(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        setError(err?.message ?? "Failed to load data.");
        setRows([]);
      })
      .finally(() => setLoading(false));
  }, [repoKey, selectedMonth]);

  const categoriesInData = useMemo(() => {
    const set = new Set(rows.map((r) => r.Process ?? "Other"));
    return PROCESS_ORDER.filter((p) => set.has(p)).concat([...set].filter((p) => !PROCESS_ORDER.includes(p)).sort());
  }, [rows]);

  const filteredRows = useMemo(() => {
    let list = rows;
    if (selectedSubcategory) {
      list = list.filter(
        (r) => (r.Participants ?? "").toLowerCase() === selectedSubcategory.toLowerCase()
      );
    }
    if (selectedCategories.length > 0) {
      list = list.filter((r) => selectedCategories.includes(r.Process ?? "Other"));
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

  const totalInData = rows.length;
  const totalFiltered = filteredRows.length;
  const totalByCategory = useMemo(() => {
    const map = new Map<string, number>();
    for (const r of filteredRows) {
      const p = r.Process ?? "Other";
      map.set(p, (map.get(p) ?? 0) + 1);
    }
    return map;
  }, [filteredRows]);

  const handleSelectAllCategories = () => {
    setSelectedCategories([...categoriesInData]);
    toast({ title: "All categories selected", status: "info", duration: 2000, isClosable: true });
  };

  const handleClearCategories = () => {
    setSelectedCategories([]);
    toast({ title: "Categories cleared — select few to see PRs", status: "info", duration: 2000, isClosable: true });
  };

  const handleSelectFew = () => {
    setSelectedCategories(categoriesInData.slice(0, 2));
    toast({ title: "Select few applied", status: "info", duration: 2000, isClosable: true });
  };

  if (loading) {
    return (
      <AllLayout>
        <Box textAlign="center" py={20}>
          <Spinner size="xl" color="teal.500" />
          <Text mt={4}>Loading open PRs for {formatMonthLabel(selectedMonth)}…</Text>
        </Box>
      </AllLayout>
    );
  }

  if (error) {
    return (
      <AllLayout>
        <Box textAlign="center" py={20}>
          <Text color="red.500">{error}</Text>
        </Box>
      </AllLayout>
    );
  }

  return (
    <AllLayout>
      <Box p={{ base: 2, md: 6 }} maxW="1600px" mx="auto">
        <VStack align="stretch" spacing={6}>
          <Heading size="lg" color="teal.500">
            EIP/ERC/RIP Board — Process × Participants
          </Heading>
          <Text color="gray.500" fontSize="sm">
            Graph 3 open PRs for <strong>{formatMonthLabel(selectedMonth)}</strong>. Same data as Boards page. Filter by repo, Subcategory (Participants), and Category (Process).
          </Text>

          {/* Repo tabs + month selector (synced with boardsnew) */}
          <Flex direction={{ base: "column", md: "row" }} gap={4} align={{ base: "stretch", md: "center" }} flexWrap="wrap">
            <HStack spacing={2} flexWrap="wrap">
              {REPO_TABS.map((tab) => (
                <Button
                  key={tab.key}
                  size="sm"
                  colorScheme={tab.key === activeTab ? "teal" : "gray"}
                  variant={tab.key === activeTab ? "solid" : "outline"}
                  onClick={() => setActiveTab(tab.key)}
                >
                  {tab.label}
                </Button>
              ))}
            </HStack>
            <Select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              maxW="160px"
              bg={filterBg}
              borderColor={useColorModeValue("blue.200", "blue.600")}
            >
              {availableMonths.length > 0
                ? availableMonths.map((m) => (
                    <option key={m} value={m}>
                      {formatMonthLabel(m)}
                    </option>
                  ))
                : (
                    <option value={selectedMonth}>{formatMonthLabel(selectedMonth)}</option>
                  )}
            </Select>
          </Flex>

          {/* Subcategory dropdown + search */}
          <Flex direction={{ base: "column", md: "row" }} gap={4} align={{ base: "stretch", md: "center" }} flexWrap="wrap">
            <HStack>
              <Text fontWeight="semibold" whiteSpace="nowrap">
                Subcategory (Participants):
              </Text>
              <Select
                value={selectedSubcategory}
                onChange={(e) => setSelectedSubcategory(e.target.value)}
                maxW="220px"
                bg={filterBg}
                borderColor={useColorModeValue("blue.200", "blue.600")}
              >
                {SUBCATEGORY_OPTIONS.map((opt) => (
                  <option key={opt.value || "all"} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </Select>
            </HStack>
            <InputGroup maxW="280px">
              <InputLeftElement pointerEvents="none">
                <SearchIcon color="gray.400" />
              </InputLeftElement>
              <Input
                placeholder="Search title, author, PR #…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                bg={filterBg}
              />
            </InputGroup>
          </Flex>

          {/* Category filter: checkboxes + Select all / Select few / Clear */}
          <Box p={4} borderRadius="lg" bg={filterBg} borderWidth="1px">
            <Flex justify="space-between" align="center" mb={3} flexWrap="wrap" gap={2}>
              <Text fontWeight="semibold">Filter by Category (Process):</Text>
              <HStack spacing={2}>
                <Button size="sm" colorScheme="teal" variant="outline" onClick={handleSelectAllCategories}>
                  Select all
                </Button>
                <Button size="sm" colorScheme="blue" variant="outline" onClick={handleSelectFew}>
                  Select few
                </Button>
                <Button size="sm" variant="ghost" onClick={handleClearCategories}>
                  Clear
                </Button>
              </HStack>
            </Flex>
            <CheckboxGroup value={selectedCategories} onChange={(v) => setSelectedCategories(v as string[])}>
              <SimpleGrid columns={{ base: 2, sm: 3, md: 4, lg: 5 }} spacing={2}>
                {categoriesInData.map((cat) => (
                  <Checkbox key={cat} value={cat} size="sm">
                    {cat}
                    {totalByCategory.has(cat) && (
                      <Badge ml={1} colorScheme="blue" fontSize="xs">
                        {totalByCategory.get(cat)}
                      </Badge>
                    )}
                  </Checkbox>
                ))}
              </SimpleGrid>
            </CheckboxGroup>
          </Box>

          {/* Total count */}
          <Flex justify="space-between" align="center" flexWrap="wrap" gap={2}>
            <Text fontWeight="bold" fontSize="md">
              Total: <Badge colorScheme="teal" fontSize="md">{totalFiltered}</Badge> PR{totalFiltered !== 1 ? "s" : ""} shown
              {totalInData !== totalFiltered && (
                <Text as="span" fontWeight="normal" color="gray.500" fontSize="sm" ml={2}>
                  (of {totalInData} in {formatMonthLabel(selectedMonth)})
                </Text>
              )}
            </Text>
          </Flex>

          {/* Advanced table */}
          <TableContainer borderWidth="1px" borderRadius="lg" overflowX="auto" bg={tableBg}>
            <Table size="sm" variant="simple">
              <Thead bg={headerBg}>
                <Tr>
                  <Th>#</Th>
                  {activeTab === "all" && <Th>Repo</Th>}
                  <Th>PR #</Th>
                  <Th>Title</Th>
                  <Th>Created</Th>
                  <Th>Wait Time</Th>
                  <Th>Category</Th>
                  <Th>Subcategory</Th>
                  <Th>Labels</Th>
                  <Th>View PR</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredRows.map((row, idx) => {
                  const createdAt = row.CreatedAt ?? "";
                  const waitDays = getWaitTimeDays(createdAt);
                  const labels = row.Labels ? row.Labels.split("; ").filter(Boolean) : [];
                  const repoBadge = row.Repo === "ERC PRs" ? "ERC" : row.Repo === "RIP PRs" ? "RIP" : "EIP";
                  return (
                    <Tr key={`${row.PRNumber}-${row.Repo ?? ""}-${idx}`} _hover={{ bg: useColorModeValue("gray.50", "gray.700") }}>
                      <Td fontWeight="medium">{idx + 1}</Td>
                      {activeTab === "all" && (
                        <Td>
                          <Badge colorScheme="purple" fontSize="xs">
                            {repoBadge}
                          </Badge>
                        </Td>
                      )}
                      <Td>
                        <Link href={row.PRLink ?? "#"} isExternal color="blue.500" display="inline-flex" alignItems="center" gap={1}>
                          <BiGitPullRequest />
                          {row.PRNumber ?? "—"}
                        </Link>
                      </Td>
                      <Td maxW="300px" noOfLines={1} title={row.Title ?? ""}>
                        {row.Title ?? "—"}
                      </Td>
                      <Td whiteSpace="nowrap">
                        {createdAt ? format(new Date(createdAt), "MMM dd, yyyy") : "—"}
                      </Td>
                      <Td>
                        <Badge
                          colorScheme={waitDays != null && waitDays > 30 ? "red" : waitDays != null && waitDays > 14 ? "orange" : "green"}
                          fontSize="xs"
                        >
                          {formatWaitTime(waitDays)}
                        </Badge>
                      </Td>
                      <Td>
                        <Badge colorScheme="purple" fontSize="xs">
                          {row.Process ?? "—"}
                        </Badge>
                      </Td>
                      <Td>
                        <Badge colorScheme="blue" fontSize="xs">
                          {row.Participants ?? "—"}
                        </Badge>
                      </Td>
                      <Td maxW="220px">
                        <Wrap spacing={1}>
                          {labels.slice(0, 3).map((l, i) => (
                            <WrapItem key={i}>
                              <Tag size="sm" colorScheme="gray">
                                <TagLabel>{l}</TagLabel>
                              </Tag>
                            </WrapItem>
                          ))}
                          {labels.length > 3 && (
                            <WrapItem>
                              <Tag size="sm" colorScheme="gray">
                                <TagLabel>+{labels.length - 3}</TagLabel>
                              </Tag>
                            </WrapItem>
                          )}
                          {labels.length === 0 && <Text color="gray.400">—</Text>}
                        </Wrap>
                      </Td>
                      <Td>
                        <Link href={row.PRLink ?? "#"} isExternal color="blue.500" fontSize="sm" fontWeight="600">
                          View <ExternalLinkIcon mx="1px" />
                        </Link>
                      </Td>
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
          </TableContainer>

          {filteredRows.length === 0 && (
            <Text color="gray.500" py={8} textAlign="center">
              No PRs match the current filters. Try changing Subcategory or selecting more Categories.
            </Text>
          )}
        </VStack>
      </Box>
    </AllLayout>
  );
}
