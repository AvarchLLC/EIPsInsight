import React, { useEffect, useState, useMemo } from "react";
import dynamic from "next/dynamic";
import {
  Box,
  Card,
  CardHeader,
  CardBody,
  Heading,
  Text,
  Menu,
  MenuButton,
  MenuList,
  Button,
  Stack,
  useColorModeValue,
  Flex,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Input,
  Link,
  Badge,
  HStack,
} from "@chakra-ui/react";
import { ChevronDownIcon, DownloadIcon, SearchIcon, ExternalLinkIcon } from "@chakra-ui/icons";
import CopyLink from "./CopyLink";
import Papa from "papaparse";

const ReactECharts = dynamic(() => import("echarts-for-react"), { ssr: false });

const REPOS = [
  { key: "eips", label: "EIPs" },
  { key: "ercs", label: "ERCs" },
  { key: "rips", label: "RIPs" },
  { key: "all", label: "All" },
];

// Graph 3: Process × Participants. type = "Process|Participants". Sum per month = Graph 1 Open.
const PROCESS_ORDER = ["PR DRAFT", "Typo", "NEW EIP", "Website", "EIP-1", "Tooling", "Status Change", "Other"];
const PARTICIPANTS_ORDER = ["Waiting on Editor", "Waiting on Author", "Stagnant", "Awaited", "Misc"];
const PARTICIPANTS_COLORS: Record<string, string> = {
  "Waiting on Editor": "#6366f1",
  "Waiting on Author": "#22c55e",
  Stagnant: "#f59e0b",
  Awaited: "#8b5cf6",
  Misc: "#64748b",
};
const PROCESS_COLORS: Record<string, string> = {
  "PR DRAFT": "#6366f1",
  Typo: "#22c55e",
  "NEW EIP": "#f59e0b",
  Website: "#0ea5e9",
  "EIP-1": "#ec4899",
  Tooling: "#14b8a6",
  "Status Change": "#ef4444",
  Other: "#64748b",
};

/** Normalize API category to Graph 2 Process values */
function normalizeCategoryToPrLabels(cat: string): string {
  const c = (cat || "").trim();
  if (/^PR\s*DRAFT$/i.test(c)) return "PR DRAFT";
  if (/^Typo$/i.test(c)) return "Typo";
  if (/^NEW\s*EIP$/i.test(c) || /^New\s*EIP$/i.test(c)) return "NEW EIP";
  if (/^Website$/i.test(c)) return "Website";
  if (/^EIP-?1$/i.test(c)) return "EIP-1";
  if (/^Tooling$/i.test(c)) return "Tooling";
  if (/^Status\s*Change$/i.test(c)) return "Status Change";
  if (/^Other$/i.test(c)) return "Other";
  return "Other";
}

/** Normalize API subcategory to Participants. Doc: AWAITED, Waiting on Editor, Waiting on Author, Stagnant, Misc. Graph 2 may store "Editor Review" from e-review label. */
function normalizeSubcategoryToPrLabels(sub: string): string {
  const s = (sub || "").trim();
  if (!s) return "Misc";
  if (/Waiting\s*on\s*Editor|Editor\s*Review/i.test(s)) return "Waiting on Editor";
  if (/Waiting\s*on\s*Author|Author\s*Review/i.test(s)) return "Waiting on Author";
  if (/Stagnant/i.test(s)) return "Stagnant";
  if (/AWAITED|awaited|draft|await/i.test(s) || s === "()" || s === "(draft)") return "Awaited";
  if (/Uncategorized|Misc/i.test(s)) return "Misc";
  return "Misc";
}

function formatMonthLabel(monthYear: string) {
  const [year, month] = monthYear.split("-");
  const date = new Date(Number(year), Number(month) - 1, 1);
  return date.toLocaleString("default", { month: "short", year: "numeric" });
}

function getCurrentMonthYear(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

/** Chart document shape. type = "Process|Participants" e.g. "PR DRAFT|Awaited", "Typo|Waiting on Editor". */
interface ChartDocument {
  _id: string;
  category: string;
  monthYear: string;
  type: string;
  count: number;
}

type AxisLayout = "processOnAxis" | "participantsOnAxis";

/** Table row from Graph 3 API (same as chart) — Process × Participants count. */
interface Graph3CountRow {
  Process: string;
  Participants: string;
  Count: number;
}

export default function CategorySubcategoryChart() {
  const cardBg = useColorModeValue("white", "#252529");
  const textColor = useColorModeValue("#2D3748", "#F7FAFC");
  const accentColor = useColorModeValue("#4299e1", "#63b3ed");
  const axisColor = useColorModeValue("#e2e8f0", "#4a5568");
  const splitLineColor = useColorModeValue("#f7fafc", "#2d3748");
  const tableBorderColor = useColorModeValue("gray.200", "whiteAlpha.200");
  const tableHeaderBg = useColorModeValue("gray.50", "whiteAlpha.50");
  const tableFilterBg = useColorModeValue("gray.50", "whiteAlpha.100");
  const tableInputBg = useColorModeValue("white", "whiteAlpha.200");
  const tableInputBorder = useColorModeValue("gray.200", "whiteAlpha.300");
  const tableRowHoverBg = useColorModeValue("gray.50", "whiteAlpha.50");
  const tableMutedColor = useColorModeValue("gray.600", "gray.400");

  const [repoKey, setRepoKey] = useState<"eips" | "ercs" | "rips" | "all">("eips");
  const [axisLayout, setAxisLayout] = useState<AxisLayout>("processOnAxis");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<ChartDocument[]>([]);
  const [selectedMonthYear, setSelectedMonthYear] = useState<string>(getCurrentMonthYear());
  const [downloading, setDownloading] = useState(false);
  const [filterProcess, setFilterProcess] = useState("");
  const [filterParticipants, setFilterParticipants] = useState("");
  const [tablePage, setTablePage] = useState(1);
  const [showTable, setShowTable] = useState(false);
  const [showDescription, setShowDescription] = useState(false);

  const TABLE_PAGE_SIZE = 15;

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    // Graph 3 API: open PRs by category × subcategory; type = "category|subcategory"; sum per month = Graph 1 Open.
    fetch(`/api/AnalyticsCharts/graph3/${repoKey}`, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(res.statusText);
        return res.json();
      })
      .then((json) => {
        const arr = Array.isArray(json?.data) ? json.data : [];
        setData(arr);
      })
      .catch((err) => {
        if ((err as Error).name !== "AbortError") {
          console.error("[CategorySubcategoryChart] fetch error", err);
          setData([]);
        }
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [repoKey]);

  const months = useMemo(() => {
    const set = new Set(data.map((d) => d.monthYear).filter(Boolean));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [data]);

  /** Table rows from Graph 3 API only (same data as chart) — Process × Participants counts for selected month. */
  const countTableRows = useMemo((): Graph3CountRow[] => {
    if (!selectedMonthYear || !/^\d{4}-\d{2}$/.test(selectedMonthYear)) return [];
    const monthData = data.filter((d) => d.monthYear === selectedMonthYear);
    const processParticipantCount = new Map<string, number>();
    monthData.forEach((d) => {
      if (!d.type) return;
      const pipe = d.type.indexOf("|");
      const rawProcess = pipe >= 0 ? d.type.slice(0, pipe).trim() : d.type.trim();
      const rawPart = pipe >= 0 ? d.type.slice(pipe + 1).trim() : "";
      const processVal = normalizeCategoryToPrLabels(rawProcess);
      const participantVal = normalizeSubcategoryToPrLabels(rawPart);
      const key = `${processVal}|${participantVal}`;
      processParticipantCount.set(key, (processParticipantCount.get(key) || 0) + (d.count || 0));
    });
    return Array.from(processParticipantCount.entries())
      .map(([key, count]) => {
        const [Process, Participants] = key.split("|");
        return { Process: Process || "—", Participants: Participants || "—", Count: count };
      })
      .sort((a, b) => (b.Count - a.Count) || (a.Process || "").localeCompare(b.Process || "") || (a.Participants || "").localeCompare(b.Participants || ""));
  }, [data, selectedMonthYear]);

  useEffect(() => {
    if (months.length === 0) return;
    const current = getCurrentMonthYear();
    if (months.includes(selectedMonthYear)) return;
    if (months.includes(current)) {
      setSelectedMonthYear(current);
    } else {
      setSelectedMonthYear(months[months.length - 1]);
    }
  }, [months, selectedMonthYear]);

  const chartData = useMemo(() => {
    const monthData = data.filter((d) => d.monthYear === selectedMonthYear);
    const processParticipantCount = new Map<string, number>();
    monthData.forEach((d) => {
      if (!d.type) return;
      const pipe = d.type.indexOf("|");
      const rawProcess = pipe >= 0 ? d.type.slice(0, pipe).trim() : d.type.trim();
      const rawPart = pipe >= 0 ? d.type.slice(pipe + 1).trim() : "";
      const processVal = normalizeCategoryToPrLabels(rawProcess);
      const participantVal = normalizeSubcategoryToPrLabels(rawPart);
      const key = `${processVal}|${participantVal}`;
      processParticipantCount.set(key, (processParticipantCount.get(key) || 0) + (d.count || 0));
    });

    const participantsSeen = new Set<string>();
    const processesSeen = new Set<string>();
    processParticipantCount.forEach((_, key) => {
      const [p, s] = key.split("|");
      if (p) processesSeen.add(p);
      if (s) participantsSeen.add(s);
    });
    const participantOrder = [
      ...PARTICIPANTS_ORDER.filter((s) => participantsSeen.has(s)),
      ...Array.from(participantsSeen).filter((s) => !PARTICIPANTS_ORDER.includes(s)).sort(),
    ];
    const processOrder = [
      ...PROCESS_ORDER.filter((p) => processesSeen.has(p)),
      ...Array.from(processesSeen).filter((p) => !PROCESS_ORDER.includes(p)).sort(),
    ];

    if (axisLayout === "processOnAxis") {
      const series = participantOrder.map((part) => {
        const color = PARTICIPANTS_COLORS[part] ?? "#8b5cf6";
        const values = processOrder.map((proc) => processParticipantCount.get(`${proc}|${part}`) ?? 0);
        return {
          name: part,
          type: "bar",
          stack: "total",
          data: values,
          itemStyle: { color },
          barMaxWidth: 28,
          emphasis: { itemStyle: { shadowBlur: 12, shadowColor: "rgba(0,0,0,0.2)" } },
          animationDelay: (dataIndex: number) => dataIndex * 40,
        };
      });
      return {
        axisLabels: processOrder,
        series,
        monthLabel: formatMonthLabel(selectedMonthYear),
        axisRole: "Process" as const,
        stackRole: "Participants" as const,
      };
    } else {
      const series = processOrder.map((proc) => {
        const color = PROCESS_COLORS[proc] ?? "#64748b";
        const values = participantOrder.map((part) => processParticipantCount.get(`${proc}|${part}`) ?? 0);
        return {
          name: proc,
          type: "bar",
          stack: "total",
          data: values,
          itemStyle: { color },
          barMaxWidth: 28,
          emphasis: { itemStyle: { shadowBlur: 12, shadowColor: "rgba(0,0,0,0.2)" } },
          animationDelay: (dataIndex: number) => dataIndex * 40,
        };
      });
      return {
        axisLabels: participantOrder,
        series,
        monthLabel: formatMonthLabel(selectedMonthYear),
        axisRole: "Participants" as const,
        stackRole: "Process" as const,
      };
    }
  }, [data, selectedMonthYear, axisLayout]);

  const option = useMemo(
    () => ({
      tooltip: {
        trigger: "axis",
        backgroundColor: "#fff",
        borderColor: "#e2e8f0",
        borderWidth: 1,
        padding: 12,
        textStyle: { color: "#1a202c", fontSize: 13 },
        confine: true,
        formatter(params: any) {
          const axisName = params[0]?.name ?? "";
          const axisRole = chartData.axisRole;
          const stackRole = chartData.stackRole;
          let total = 0;
          params.forEach((item: any) => {
            total += item.value;
          });
          let res = `<span style="font-weight:700">${axisName}</span> (${axisRole}) — ${chartData.monthLabel}<br/><span style="color:#718096;font-size:12px;">Total: <b>${total}</b> open PRs</span><br/>`;
          params
            .filter((item: any) => item.value && item.value !== 0)
            .forEach((item: any) => {
              res += `${item.marker} <span style="color:#1a202c">${item.seriesName}</span> (${stackRole}): <b>${item.value}</b><br/>`;
            });
          return res;
        },
      },
      legend: {
        data: chartData.series.map((s: any) => s.name),
        textStyle: { color: textColor, fontWeight: 600, fontSize: 12 },
        orient: "horizontal",
        top: 12,
        itemGap: 16,
      },
      grid: { left: 60, right: 50, top: 70, bottom: 80 },
      backgroundColor: cardBg,
      xAxis: [
        {
          type: "category",
          data: chartData.axisLabels,
          axisLabel: {
            color: textColor,
            fontWeight: 600,
            fontSize: 11,
            interval: 0,
            rotate: chartData.axisLabels.length > 8 ? 35 : 0,
            margin: 12,
          },
          axisLine: { lineStyle: { color: axisColor } },
          axisTick: { lineStyle: { color: axisColor } },
        },
      ],
      yAxis: [
        {
          type: "value",
          name: "Open PRs",
          nameTextStyle: { color: textColor, fontWeight: 600, fontSize: 12 },
          axisLabel: { color: textColor, fontWeight: 500 },
          axisLine: { lineStyle: { color: axisColor } },
          splitLine: { lineStyle: { color: splitLineColor, type: "dashed" } },
        },
      ],
      series: chartData.series,
      animation: true,
      animationDuration: 1000,
      animationEasing: "cubicOut",
      animationDelayUpdate: (idx: number) => idx * 30,
    }),
    [chartData, textColor, cardBg, axisColor, splitLineColor]
  );

  const repoLabel = REPOS.find((r) => r.key === repoKey)?.label ?? repoKey;
  const hasDataForMonth = chartData.series.some((s: any) => s.data.some((v: number) => v > 0));
  const noDataAtAll = months.length === 0;

  const filteredTableRows = useMemo(() => {
    let list = [...countTableRows];
    if (filterProcess.trim()) {
      const p = filterProcess.trim().toLowerCase();
      list = list.filter((r) => (r.Process ?? "").toLowerCase().includes(p));
    }
    if (filterParticipants.trim()) {
      const s = filterParticipants.trim().toLowerCase();
      list = list.filter((r) => (r.Participants ?? "").toLowerCase().includes(s));
    }
    return list;
  }, [countTableRows, filterProcess, filterParticipants]);

  const totalTablePages = Math.max(1, Math.ceil(filteredTableRows.length / TABLE_PAGE_SIZE));
  const paginatedTableRows = useMemo(
    () =>
      filteredTableRows.slice(
        (tablePage - 1) * TABLE_PAGE_SIZE,
        tablePage * TABLE_PAGE_SIZE
      ),
    [filteredTableRows, tablePage, TABLE_PAGE_SIZE]
  );

  useEffect(() => {
    setTablePage(1);
  }, [filterProcess, filterParticipants]);

  useEffect(() => {
    if (tablePage > totalTablePages && totalTablePages > 0) setTablePage(Math.max(1, totalTablePages));
  }, [tablePage, totalTablePages]);

  const processBadgeColor = (process: string) => PROCESS_COLORS[process] ?? "#64748b";
  const participantsBadgeColor = (part: string) => PARTICIPANTS_COLORS[part] ?? "#64748b";

  const downloadCSV = () => {
    setDownloading(true);
    try {
      const rows = filteredTableRows.length > 0
        ? filteredTableRows
        : [{ Process: "", Participants: "", Count: 0 }];
      const csv = Papa.unparse(rows);
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `graph3_process_participants_${repoKey}_${selectedMonthYear}.csv`;
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error("[CategorySubcategoryChart] CSV download error", e);
      alert(`CSV download failed: ${e instanceof Error ? e.message : "Unknown error"}`);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <Card bg={cardBg} color={textColor} mx="auto" mt={8} borderRadius="2xl" p={4}>
      <CardHeader>
        <Flex align="center" justify="space-between" wrap="wrap" gap={4}>
          <Heading size="md" color={accentColor} mb={2} id="CategorySubcategoryChart">
            Process × Participants (stacked)
            <CopyLink link="https://eipsinsight.com/Analytics#CategorySubcategoryChart" />
          </Heading>
          <Flex gap={2} wrap="wrap">
            <Menu>
              <MenuButton as={Button} rightIcon={<ChevronDownIcon />} variant="solid" colorScheme="purple" minW={100}>
                {repoLabel}
              </MenuButton>
              <MenuList minWidth="100px">
                <Stack>
                  {REPOS.map((repo) => (
                    <Button
                      key={repo.key}
                      variant="ghost"
                      size="sm"
                      justifyContent="flex-start"
                      colorScheme={repoKey === repo.key ? "blue" : undefined}
                      onClick={() => setRepoKey(repo.key as "eips" | "ercs" | "rips" | "all")}
                    >
                      {repo.label}
                    </Button>
                  ))}
                </Stack>
              </MenuList>
            </Menu>
            <Menu>
              <MenuButton
                as={Button}
                rightIcon={<ChevronDownIcon />}
                variant="outline"
                colorScheme={axisLayout === "processOnAxis" ? "blue" : "purple"}
                minW={180}
                isDisabled={noDataAtAll}
              >
                {axisLayout === "processOnAxis"
                  ? "X-axis: Process (stacked: Participants)"
                  : "X-axis: Participants (stacked: Process)"}
              </MenuButton>
              <MenuList minWidth="220px">
                <Stack p={2}>
                  <Button
                    size="sm"
                    variant={axisLayout === "processOnAxis" ? "solid" : "ghost"}
                    colorScheme="blue"
                    justifyContent="flex-start"
                    onClick={() => setAxisLayout("processOnAxis")}
                  >
                    X-axis: Process — stacked: Participants
                  </Button>
                  <Button
                    size="sm"
                    variant={axisLayout === "participantsOnAxis" ? "solid" : "ghost"}
                    colorScheme="purple"
                    justifyContent="flex-start"
                    onClick={() => setAxisLayout("participantsOnAxis")}
                  >
                    X-axis: Participants — stacked: Process
                  </Button>
                </Stack>
              </MenuList>
            </Menu>
            <Menu>
              <MenuButton
                as={Button}
                rightIcon={<ChevronDownIcon />}
                variant="outline"
                colorScheme="teal"
                minW={140}
                isDisabled={noDataAtAll}
              >
                {selectedMonthYear ? formatMonthLabel(selectedMonthYear) : "Month"}
              </MenuButton>
              <MenuList maxH="300px" overflowY="auto" minWidth="140px">
                <Stack>
                  {months.slice().reverse().map((m) => (
                    <Button
                      key={m}
                      variant="ghost"
                      size="sm"
                      justifyContent="flex-start"
                      colorScheme={selectedMonthYear === m ? "teal" : undefined}
                      onClick={() => setSelectedMonthYear(m)}
                    >
                      {formatMonthLabel(m)}
                    </Button>
                  ))}
                </Stack>
              </MenuList>
            </Menu>
            <Button
              leftIcon={<DownloadIcon />}
              colorScheme="blue"
              variant="solid"
              size="sm"
              onClick={downloadCSV}
              isLoading={downloading}
              isDisabled={noDataAtAll || !selectedMonthYear}
            >
              Download CSV
            </Button>
          </Flex>
        </Flex>
        <Flex align="center" gap={2} mt={2} flexWrap="wrap">
          <Button
            size="xs"
            variant="ghost"
            colorScheme="gray"
            onClick={() => setShowDescription((v) => !v)}
          >
            {showDescription ? "Hide description" : "Show description"}
          </Button>
          {showDescription && (
            <Box fontSize="sm" color={useColorModeValue("gray.600", "gray.400")}>
              Open PRs by process type and participant status. Choose <strong>Process</strong> or <strong>Participants</strong> on the X-axis (the other is stacked). Sum of segments = total open PRs for the month. <strong>Awaited</strong> = draft PRs when process is PR DRAFT and not stagnant. One month per view; legend above the chart.
            </Box>
          )}
        </Flex>
      </CardHeader>
      <CardBody>
        <Box minH="350px">
          {loading ? (
            <Text color={accentColor} fontWeight="bold" my={10} fontSize="xl">
              Loading...
            </Text>
          ) : noDataAtAll ? (
            <Text color="gray.500" py={12} fontWeight="bold" fontSize="lg">
              No open PRs by process/participants for this repo or period.
            </Text>
          ) : !hasDataForMonth ? (
            <Text color="gray.500" py={12} fontWeight="bold" fontSize="lg">
              No open PRs for {formatMonthLabel(selectedMonthYear)}. Try another month.
            </Text>
          ) : (
            <ReactECharts
              style={{ height: "400px", width: "100%" }}
              option={option}
              notMerge
              lazyUpdate
              theme={cardBg === "white" ? "light" : "dark"}
            />
          )}
        </Box>

        {/* Open PRs table — show/hide toggle, then clean table (only badges colorful) */}
        <Box mt={8} pt={6} borderTopWidth="1px" borderColor={tableBorderColor}>
          <Flex align="center" justify="space-between" wrap="wrap" gap={3} mb={showTable ? 4 : 0}>
            <Button
              size="sm"
              variant="outline"
              colorScheme="gray"
              onClick={() => setShowTable((v) => !v)}
              leftIcon={showTable ? undefined : <SearchIcon />}
            >
              {showTable ? "Hide table" : "Show table"}
            </Button>
          </Flex>

          {showTable && (
            <>
              <Flex align="center" justify="space-between" wrap="wrap" gap={3} mb={2}>
                <Heading size="sm" color={textColor} fontWeight="600">
                  Open PRs — {selectedMonthYear ? formatMonthLabel(selectedMonthYear) : "Month"}
                </Heading>
                <Menu>
                  <MenuButton
                    as={Button}
                    rightIcon={<ChevronDownIcon />}
                    variant="outline"
                    size="sm"
                    colorScheme="gray"
                    minW={140}
                  >
                    {selectedMonthYear ? formatMonthLabel(selectedMonthYear) : "Month"}
                  </MenuButton>
                  <MenuList maxH="300px" overflowY="auto" minWidth="140px">
                    <Stack>
                      {months.slice().reverse().map((m) => (
                        <Button
                          key={m}
                          variant="ghost"
                          size="sm"
                          justifyContent="flex-start"
                          colorScheme={selectedMonthYear === m ? "gray" : undefined}
                          onClick={() => setSelectedMonthYear(m)}
                        >
                          {formatMonthLabel(m)}
                        </Button>
                      ))}
                    </Stack>
                  </MenuList>
                </Menu>
              </Flex>
              <Text fontSize="xs" color={tableMutedColor} mb={3}>
                Table shows the same counts as the chart. For a per-PR list with links, use the EIP Board or Boards page.
              </Text>

              <TableContainer
                overflowX="auto"
                borderRadius="md"
                borderWidth="1px"
                borderColor={tableBorderColor}
                bg={cardBg}
              >
                <Table size="sm" variant="simple">
                  <Thead>
                    <Tr bg={tableHeaderBg}>
                      <Th w="48px" color={textColor} fontWeight="600">#</Th>
                      <Th color={textColor} fontWeight="600">Process</Th>
                      <Th color={textColor} fontWeight="600">Participants</Th>
                      <Th w="80px" color={textColor} fontWeight="600">Count</Th>
                      <Th w="90px" color={textColor} fontWeight="600">View PRs</Th>
                    </Tr>
                    <Tr bg={tableFilterBg}>
                      <Th px={2} />
                      <Th px={2}>
                        <Input
                          size="xs"
                          placeholder="Process"
                          value={filterProcess}
                          onChange={(e) => setFilterProcess(e.target.value)}
                          bg={tableInputBg}
                          borderColor={tableInputBorder}
                        />
                      </Th>
                      <Th px={2}>
                        <Input
                          size="xs"
                          placeholder="Participants"
                          value={filterParticipants}
                          onChange={(e) => setFilterParticipants(e.target.value)}
                          bg={tableInputBg}
                          borderColor={tableInputBorder}
                        />
                      </Th>
                      <Th px={2} />
                      <Th px={2} />
                    </Tr>
                  </Thead>
                  <Tbody>
                    {filteredTableRows.length === 0 ? (
                      <Tr>
                        <Td colSpan={5} py={8} textAlign="center" color="gray.500">
                          {countTableRows.length === 0
                            ? "No data for this month."
                            : "No rows match the current filters."}
                        </Td>
                      </Tr>
                    ) : (
                      paginatedTableRows.map((row, idx) => {
                        const sr = (tablePage - 1) * TABLE_PAGE_SIZE + idx + 1;
                        const processColor = processBadgeColor(row.Process);
                        const partColor = participantsBadgeColor(row.Participants);
                        const viewPrsUrl = `/eipboards?month=${selectedMonthYear}&process=${encodeURIComponent(row.Process)}&participants=${encodeURIComponent(row.Participants)}`;
                        return (
                          <Tr key={`${row.Process}-${row.Participants}-${sr}`} _hover={{ bg: tableRowHoverBg }}>
                            <Td fontWeight="semibold" color={tableMutedColor}>
                              {sr}
                            </Td>
                            <Td>
                              <Badge
                                bg={processColor}
                                color="white"
                                px={2}
                                py={0.5}
                                borderRadius="md"
                                fontSize="xs"
                                variant="solid"
                              >
                                {row.Process || "—"}
                              </Badge>
                            </Td>
                            <Td>
                              <Badge
                                bg={partColor}
                                color="white"
                                px={2}
                                py={0.5}
                                borderRadius="md"
                                fontSize="xs"
                                variant="solid"
                              >
                                {row.Participants || "—"}
                              </Badge>
                            </Td>
                            <Td fontWeight="700" color={textColor}>
                              {row.Count}
                            </Td>
                            <Td>
                              <Link
                                href={viewPrsUrl}
                                fontSize="sm"
                                display="inline-flex"
                                alignItems="center"
                                gap={1}
                                color={accentColor}
                              >
                                View PRs <ExternalLinkIcon mx="2px" />
                              </Link>
                            </Td>
                          </Tr>
                        );
                      })
                    )}
                  </Tbody>
                </Table>
              </TableContainer>

              {filteredTableRows.length > 0 && (
                <HStack mt={4} justify="space-between" wrap="wrap" gap={2}>
                  <Text fontSize="sm" color={tableMutedColor}>
                    Showing {(tablePage - 1) * TABLE_PAGE_SIZE + 1}–{Math.min(tablePage * TABLE_PAGE_SIZE, filteredTableRows.length)} of {filteredTableRows.length} rows
                  </Text>
                  <HStack gap={2}>
                    <Button
                      size="sm"
                      variant="outline"
                      colorScheme="gray"
                      isDisabled={tablePage <= 1}
                      onClick={() => setTablePage((p) => Math.max(1, p - 1))}
                    >
                      Previous
                    </Button>
                    <Text fontSize="sm" fontWeight="600" color={textColor}>
                      Page {tablePage} of {totalTablePages}
                    </Text>
                    <Button
                      size="sm"
                      variant="outline"
                      colorScheme="gray"
                      isDisabled={tablePage >= totalTablePages}
                      onClick={() => setTablePage((p) => Math.min(totalTablePages, p + 1))}
                    >
                      Next
                    </Button>
                  </HStack>
                </HStack>
              )}
            </>
          )}
        </Box>
      </CardBody>
    </Card>
  );
}
