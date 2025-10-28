import React, { useEffect, useState, useMemo } from "react";
import dynamic from "next/dynamic";
import {
  Box, Card, CardHeader, CardBody, Heading, Text, Stack, Button, Checkbox,
  CheckboxGroup, Menu, MenuButton, MenuList, useColorModeValue, Flex, Badge, HStack, Divider
} from "@chakra-ui/react";
import { ChevronDownIcon, DownloadIcon } from "@chakra-ui/icons";
import Papa from "papaparse";
import CopyLink from "./CopyLink";

const ReactECharts = dynamic(() => import("echarts-for-react"), { ssr: false });

type LabelSpec = { value: string; label: string; color: string };

const CUSTOM_LABELS_EIP: LabelSpec[] = [
  { value: "EIP Update", label: "EIP Update", color: "#2563eb" },
  { value: "Typo Fix", label: "Typo Fix", color: "#16a34a" },
  { value: "Status Change", label: "Status Change", color: "#ea580c" },
  { value: "Created By Bot", label: "Created By Bot", color: "#a21caf" },
  { value: "New EIP", label: "New EIP", color: "#facc15" },
  { value: "Misc", label: "Miscellaneous", color: "#64748b" },
];
const CUSTOM_LABELS_ERC: LabelSpec[] = [
  { value: "ERC Update", label: "ERC Update", color: "#0ea5e9" },
  { value: "Typo Fix", label: "Typo Fix", color: "#22c55e" },
  { value: "Status Change", label: "Status Change", color: "#e11d48" },
  { value: "Created By Bot", label: "Created By Bot", color: "#a16207" },
  { value: "New ERC", label: "New ERC", color: "#8b5cf6" },
  { value: "Misc", label: "Miscellaneous", color: "#334155" },
];
const WORKFLOW_LABELS: LabelSpec[] = [
  { value: "a-review", label: "Author Review", color: "#14b8a6" },
  { value: "e-review", label: "Editor Review", color: "#f43f5e" },
  { value: "discuss", label: "Discuss", color: "#fbbf24" },
  { value: "on-hold", label: "On Hold", color: "#0d9488" },
  { value: "final-call", label: "Final Call", color: "#6366f1" },
  { value: "s-draft", label: "Draft", color: "#3b82f6" },
  { value: "s-final", label: "Final", color: "#10b981" },
  { value: "s-review", label: "Review", color: "#8b5cf6" },
  { value: "s-stagnant", label: "Stagnant", color: "#6b7280" },
  { value: "s-withdrawn", label: "Withdrawn", color: "#ef4444" },
  { value: "s-lastcall", label: "Last Call", color: "#eab308" },
  { value: "c-new", label: "New", color: "#22c55e" },
  { value: "c-update", label: "Update", color: "#2563eb" },
  { value: "c-status", label: "Status Change", color: "#d97706" },
  { value: "bug", label: "Bug", color: "#dc2626" },
  { value: "enhancement", label: "Enhancement", color: "#16a34a" },
  { value: "question", label: "Question", color: "#0891b2" },
  { value: "dependencies", label: "Dependencies", color: "#a855f7" },
  { value: "r-website", label: "Website", color: "#3b82f6" },
  { value: "r-process", label: "Process", color: "#f59e0b" },
  { value: "r-other", label: "Other Resource", color: "#9ca3af" },
  { value: "r-eips", label: "EIPs Resource", color: "#1d4ed8" },
  { value: "r-ci", label: "CI Resource", color: "#9333ea" },
  { value: "created-by-bot", label: "Bot", color: "#64748b" },
  { value: "1272989785", label: "Bot", color: "#64748b" },
  { value: "javascript", label: "JavaScript", color: "#facc15" },
  { value: "ruby", label: "Ruby", color: "#e11d48" },
  { value: "discussions-to", label: "Discussions", color: "#0ea5e9" },

  // Newly added missing ones
  { value: "misc", label: "Misc", color: "#94a3b8" },          // slate-400
  { value: "stale", label: "Stale", color: "#737373" },        // neutral-500
  { value: "w-response", label: "Waiting Response", color: "#06b6d4" }, // cyan-500
  { value: "e-consensus", label: "Editor Consensus", color: "#f87171" }, // red-400
  { value: "t-process", label: "Process Task", color: "#d946ef" }, // fuchsia-500
  { value: "w-stale", label: "Waiting (Stale)", color: "#9ca3af" }, // gray-400
  { value: "w-ci", label: "Waiting CI", color: "#22d3ee" },    // cyan-400

  { value: "Other Labels", label: "Other Labels", color: "#9ca3af" }
];


const CUSTOM_LABELS_RIP: LabelSpec[] = [
  { value: "Update", label: "Update", color: "#3b82f6" },
  { value: "Typo Fix", label: "Typo Fix", color: "#10b981" },
  { value: "New RIP", label: "New RIP", color: "#f59e42" },
  { value: "Created By Bot", label: "Created By Bot", color: "#a21caf" },
  { value: "Misc", label: "Miscellaneous", color: "#6b7280" },
];

// Unified labels for the 'All' view (overlapping labels grouped)
const CUSTOM_LABELS_ALL: LabelSpec[] = [
  { value: "Update", label: "Update", color: "#3b82f6" },
  { value: "Typo Fix", label: "Typo Fix", color: "#22c55e" },
  { value: "Status Change", label: "Status Change", color: "#ea580c" },
  { value: "Created By Bot", label: "Created By Bot", color: "#a21caf" },
  { value: "New", label: "New", color: "#f59e42" },
  { value: "Misc", label: "Miscellaneous", color: "#64748b" },
];

const REPOS = [
  { key: "all", label: "All Open PRs", api: "" },
  { key: "eip", label: "EIP Open PRs", api: "/api/pr-stats" },
  { key: "erc", label: "ERC Open PRs", api: "/api/ercpr-stats" },
  { key: "rip", label: "RIP Open PRs", api: "/api/rippr-stats" },
];

interface AggregatedLabelCount {
  monthYear: string;
  label: string;
  count: number;
  labelType: string;
  prNumbers: number[]; // <-- new
}


function formatMonthLabel(monthYear: string) {
  const [year, month] = monthYear.split("-");
  const date = new Date(Number(year), Number(month) - 1, 1);
  return date.toLocaleString("default", { month: "short", year: "numeric" });
}

export default function PRAnalyticsCard() {
  const cardBg = useColorModeValue("white", "#252529");
  const textColor = useColorModeValue("#2D3748", "#F7FAFC");
  const accentColor = useColorModeValue("#4299e1", "#63b3ed");
  const badgeText = useColorModeValue("white", "#171923");

  const [repoKey, setRepoKey] = useState<"all" | "eip" | "erc" | "rip">("eip");
  const [labelSet, setLabelSet] = useState<"customLabels" | "githubLabels">("customLabels");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<AggregatedLabelCount[]>([]);

  // Select correct label spec
  const labelSpecs: LabelSpec[] = useMemo(() => {
    if (labelSet === "customLabels") {
      if (repoKey === "all") return CUSTOM_LABELS_ALL;
      return repoKey === "eip"
        ? CUSTOM_LABELS_EIP
        : repoKey === "erc"
        ? CUSTOM_LABELS_ERC
        : CUSTOM_LABELS_RIP;
    } else {
      return WORKFLOW_LABELS;
    }
  }, [repoKey, labelSet]);

  // Filter state setup
  const [selectedLabels, setSelectedLabels] = useState<string[]>(labelSpecs.map(l => l.value));
  useEffect(() => setSelectedLabels(labelSpecs.map(l => l.value)), [labelSpecs]);

  // Normalize custom labels for 'all' view
  const normalizeCustomLabel = (repo: string, label: string): string => {
    // Map to overlapping categories
    const l = label.toLowerCase();
    if (/(^|\s)typo(\s|$)/.test(l)) return "Typo Fix";
    if (/status\s*change/i.test(label)) return "Status Change";
    if (/created\s*by\s*bot/i.test(label)) return "Created By Bot";
    if (/new\s*(eip|erc|rip)/i.test(label)) return "New";
    if (/update/i.test(label)) return "Update";
    return "Misc";
  };

  // Normalize GitHub workflow labels to grouped buckets (for 'all' view and CSV)
  const normalizeGithubLabel = (label: string): string => {
    const l = (label || "").toLowerCase();
    if (l === "a-review") return "Author Review";
    if (l === "e-review") return "Editor Review";
    if (l === "discuss") return "Discuss";
    if (l === "on-hold") return "On Hold";
    if (l === "final-call") return "Final Call";
    // If already friendly wording, keep it
    if (["author review","editor review","discuss","on hold","final call"].includes(l)) {
      return label;
    }
    return "Other Labels";
  };

  const workflowLabelValues = new Set(WORKFLOW_LABELS.map(l => l.value));

  // Fetch API
  useEffect(() => {
    setLoading(true);
    const controller = new AbortController();

    const fetchSingle = async (api: string) => {
      const res = await fetch(`${api}?labelType=${labelSet}`, { signal: controller.signal });
      if (!res.ok) throw new Error(`${api} -> ${res.status}`);
      const json = await res.json();
      return Array.isArray(json) ? (json as AggregatedLabelCount[]) : [];
    };

    const fetchDetails = async (repo: string) => {
      const qs = new URLSearchParams({ repo, mode: "detail", labelType: labelSet }).toString();
      const res = await fetch(`/api/pr-details?${qs}`, { signal: controller.signal });
      if (!res.ok) throw new Error(`/api/pr-details (${repo}) -> ${res.status}`);
      const json = await res.json();
      return Array.isArray(json) ? json : [];
    };

  const aggregateDetails = (rows: any[]): AggregatedLabelCount[] => {
      const acc = new Map<string, AggregatedLabelCount>();
      for (const pr of rows) {
        const monthYear: string = pr.MonthKey || (pr.CreatedAt ? new Date(pr.CreatedAt).toISOString().slice(0, 7) : "");
        if (!monthYear) continue;
        let label: string = pr.Label || "";
    if (labelSet === "customLabels") label = normalizeCustomLabel(pr.Repo || "", label);
        const key = `${monthYear}__${label}`;
        const curr = acc.get(key) || { monthYear, label, count: 0, labelType: labelSet, prNumbers: [] };
        curr.count += 1;
        if (pr.PRNumber) curr.prNumbers = [...curr.prNumbers, pr.PRNumber];
        acc.set(key, curr);
      }
      return Array.from(acc.values());
    };

    const run = async () => {
      try {
        if (repoKey !== "all") {
          const repoObj = REPOS.find(r => r.key === repoKey)!;
          const arr = await fetchSingle(repoObj.api);
          setData(arr);
        } else {
          // Fetch detailed rows for all repos and aggregate client-side
          const [eipD, ercD, ripD] = await Promise.allSettled([
            fetchDetails("eip"),
            fetchDetails("erc"),
            fetchDetails("rip"),
          ]);
          const toRows = (r: PromiseSettledResult<any[]>) => (r.status === "fulfilled" ? r.value : []);
          const combinedRows = [...toRows(eipD), ...toRows(ercD), ...toRows(ripD)];
          const aggregated = aggregateDetails(combinedRows);
          setData(aggregated);
        }
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          // eslint-disable-next-line no-console
          console.error("[PRAnalytics] fetch error", err);
          setData([]);
        }
      } finally {
        setLoading(false);
      }
    };

    run();
    return () => controller.abort();
  }, [repoKey, labelSet]);

  // Build filtered dataset and chart options
  const filteredData = useMemo(() => {
    const arr = Array.isArray(data) ? data : [];
    return arr.filter(item => selectedLabels.includes(item.label));
  }, [data, selectedLabels]);

  const months = useMemo(() => {
    const monthSet = new Set(filteredData.map(d => d.monthYear));
    return Array.from(monthSet).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
  }, [filteredData]);

  const chartData = useMemo(() => ({
    months,
    displayMonths: months.map(formatMonthLabel),
    series: labelSpecs.map(({ value, label, color }) => ({
      name: label,
      type: "bar",
      stack: "total",
      data: months.map(month => {
        const found = filteredData.find(d => d.monthYear === month && d.label === value);
        return found ? found.count : 0;
      }),
      itemStyle: { color },
      barMaxWidth: 40
    }))
  }), [months, filteredData, labelSpecs]);

  // Calculate total count for current month
  const latestMonth = months.length > 0 ? months[months.length - 1] : null;
  const currentMonthTotal = useMemo(() => {
    if (!latestMonth) return 0;
    return filteredData
      .filter(d => d.monthYear === latestMonth)
      .reduce((sum, d) => sum + d.count, 0);
  }, [filteredData, latestMonth]);

  const defaultZoomStart = chartData.displayMonths.length > 18
    ? (100 * (chartData.displayMonths.length - 18) / chartData.displayMonths.length)
    : 0;

  const option = useMemo(() => ({
    tooltip: {
      trigger: "axis",
      backgroundColor: "#fff",
      borderColor: "#cfd8dc",
      textStyle: { color: "#1a202c" },
      confine: true,
     formatter(params: any) {
      let total = 0;
      params.forEach((item: any) => { total += item.value; });
      let res = `<span style="font-weight:700">${params[0].name}</span><br/><span style="color:#718096;font-size:13px;">Total: <b>${total}</b></span><br/>`;
      params
        .filter((item: any) => item.value && item.value !== 0) // Only show if value is non-zero
        .forEach((item: any) => {
          res += `${item.marker} <span style="color:#1a202c">${item.seriesName}</span>: <b>${item.value}</b><br/>`;
        });
      return res;
    }
    },
    legend: {
      data: chartData.series.map((s: any) => s.name),
      textStyle: { color: textColor, fontWeight: 700, fontSize: 14 },
      type: 'scroll',
      orient: 'horizontal',
      top: 20,
      scrollDataIndex: 0,
    },
    backgroundColor: cardBg,
    xAxis: [{
      type: "category",
      data: chartData.displayMonths,
      axisLabel: {
        color: textColor,
        fontWeight: 600,
        fontSize: 11,
        interval: 'auto', // Auto-calculate interval to prevent overlap
        rotate: 0,
        margin: 12,
        hideOverlap: true
      },
      axisLine: {
        lineStyle: { color: useColorModeValue('#e2e8f0', '#4a5568') }
      },
      axisTick: {
        lineStyle: { color: useColorModeValue('#e2e8f0', '#4a5568') }
      }
    }],
    yAxis: [{
      type: "value",
      name: "Open PRs",
      nameTextStyle: {
        color: textColor,
        fontWeight: 600,
        fontSize: 13
      },
      axisLabel: { 
        color: textColor,
        fontWeight: 500
      },
      axisLine: {
        lineStyle: { color: useColorModeValue('#e2e8f0', '#4a5568') }
      },
      splitLine: {
        lineStyle: { 
          color: useColorModeValue('#f7fafc', '#2d3748'),
          type: 'dashed'
        }
      }
    }],
    series: chartData.series,
    dataZoom: [
      {
        type: "slider",
        show: true,
        xAxisIndex: [0],
        start: defaultZoomStart,
        end: 100,
        bottom: 12,
        height: 30,
      },
    ],
    grid: { left: 70, right: 40, top: 90, bottom: 70 },
    animationDuration: 800,
    animationEasing: 'cubicOut'
  }), [chartData, textColor, cardBg, defaultZoomStart]);

  // CSV download
  const downloadCSV = async () => {
    setLoading(true);

    const buildParams = (repo: string) => new URLSearchParams({
      repo,
      mode: "detail",
      labelType: labelSet,
    }).toString();

    const fetchRows = async (repo: string) => {
      const url = `/api/pr-details?${buildParams(repo)}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Failed to fetch PR details (${repo}): ${res.status}`);
      const rows = await res.json();
      return Array.isArray(rows) ? rows : [];
    };

    try {
      let combined: any[] = [];
      if (repoKey === "all") {
        const [eip, erc, rip] = await Promise.allSettled([
          fetchRows("eip"),
          fetchRows("erc"),
          fetchRows("rip"),
        ]);
        const toArr = (r: PromiseSettledResult<any[]>) => (r.status === "fulfilled" ? r.value : []);
        combined = [...toArr(eip), ...toArr(erc), ...toArr(rip)];
      } else {
        const repo = repoKey;
        const rows = await fetchRows(repo);
        combined = rows;
      }

      // Get current/latest month key from filteredData
      const latestMonthKey = months.length > 0 ? months[months.length - 1] : null;

      // Filter only PRs from the latest month and apply selected label filter
      const filteredRows = combined
        .map((pr: any) => {
          // Normalize the label to match what's shown in the graph
          let normalizedLabel = pr.Label || "";
          if (labelSet === "customLabels") {
            normalizedLabel = normalizeCustomLabel(pr.Repo || repoKey, pr.Label || "");
          } else if (labelSet === "githubLabels") {
            normalizedLabel = normalizeGithubLabel(pr.Label || "");
          }
          
          // Store the normalized label in the PR object for later use
          return {
            ...pr,
            DisplayLabel: normalizedLabel
          };
        })
        .filter((pr: any) => {
          const mk = pr.MonthKey || (pr.CreatedAt ? new Date(pr.CreatedAt).toISOString().slice(0, 7) : "");
          if (mk !== latestMonthKey) return false;

          // Check if this normalized label is in the selected labels
          const passesFilter = selectedLabels.includes(pr.DisplayLabel);

          return passesFilter;
        });

      const repoLabel = (rk: typeof repoKey) => (REPOS.find(r => r.key === rk)?.label || rk);

      const csvData = filteredRows.map((pr: any) => {
        // Use the same label that's shown in the graph (DisplayLabel)
        const graphLabel = pr.DisplayLabel || "Misc";

        return {
          Month: pr.Month || formatMonthLabel(pr.MonthKey),
          MonthKey: pr.MonthKey,
          Label: graphLabel, // Show the same label as displayed in the graph
          Repo: pr.Repo || (repoKey === "all" ? undefined : repoKey),
          PRNumber: pr.PRNumber,
          PRLink: pr.PRLink,
          Author: pr.Author,
          Title: pr.Title,
          CreatedAt: pr.CreatedAt ? new Date(pr.CreatedAt).toISOString() : "",
        };
      });

      const csv = Papa.unparse(csvData);
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
      const urlObj = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = urlObj;
      a.download = `${repoKey}_${labelSet}_current_month_prs.csv`;
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      URL.revokeObjectURL(urlObj);
    } catch (err) {
      console.error("Download CSV error", err);
    } finally {
      setLoading(false);
    }
  };





  const selectAll = () => setSelectedLabels(labelSpecs.map(l => l.value));
  const clearAll = () => setSelectedLabels([]);

  // Label set switch drop-down
  const labelSetOptions = [
    { key: "customLabels", label: "Custom Labels" },
    { key: "githubLabels", label: "GitHub Labels" }
  ];

  return (
    <Card bg={cardBg} color={textColor} mx="auto" mt={8} borderRadius="2xl" p={4}>
      <CardHeader>
        <Flex align="center" justify="space-between" wrap="wrap" gap={4}>
          <Heading size="md" color={accentColor} mb={2} id="PrLabelsChart">
            {REPOS.find(r => r.key === repoKey)?.label} &mdash; {labelSetOptions.find(o => o.key === labelSet)?.label} Distribution
            <CopyLink link={`https://eipsinsight.com//Analytics#PrLabelsChart`} />
          </Heading>
          <Flex gap={3} align="center">
            <Menu>
              <MenuButton as={Button} rightIcon={<ChevronDownIcon />} variant="solid" colorScheme="purple" minW={140}>
                {REPOS.find(r => r.key === repoKey)?.label}
              </MenuButton>
              <MenuList minWidth="140px">
                <Stack>
                  {REPOS.map(repo => (
                    <Button
                      key={repo.key}
                      variant="ghost"
                      size="sm"
                      justifyContent="flex-start"
                      colorScheme={repoKey === repo.key ? "blue" : undefined}
                      onClick={() => setRepoKey(repo.key as "all" | "eip" | "erc" | "rip")}
                    >
                      {repo.label}
                    </Button>
                  ))}
                </Stack>
              </MenuList>
            </Menu>
            <Menu>
              <MenuButton as={Button} rightIcon={<ChevronDownIcon />} variant="outline" colorScheme="teal" minW={160}>
                {labelSetOptions.find(o => o.key === labelSet)?.label}
              </MenuButton>
              <MenuList minWidth="160px">
                <Stack>
                  {labelSetOptions.map(opt =>
                    <Button
                      key={opt.key}
                      variant="ghost"
                      size="sm"
                      justifyContent="flex-start"
                      colorScheme={labelSet === opt.key ? "teal" : undefined}
                      onClick={() => setLabelSet(opt.key as "customLabels" | "githubLabels")}
                    >
                      {opt.label}
                    </Button>
                  )}
                </Stack>
              </MenuList>
            </Menu>
            <Button leftIcon={<DownloadIcon />} colorScheme="blue" onClick={downloadCSV} variant="solid" size="sm" borderRadius="md">
              Download CSV
            </Button>
          </Flex>
        </Flex>
      </CardHeader>
      <CardBody>
        <Flex gap={4} wrap="wrap" mb={4} align="center">
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />} variant="outline" colorScheme="blue" borderRadius="md" minW={180}>
              Filter by {labelSetOptions.find(o => o.key === labelSet)?.label}
            </MenuButton>
            <MenuList minWidth="280px" px={2} py={2}>
              <HStack mb={2} gap={2}>
                <Button size="xs" colorScheme="teal" onClick={selectAll}>Select All</Button>
                <Button size="xs" colorScheme="red" variant="outline" onClick={clearAll}>Clear All</Button>
              </HStack>
              <CheckboxGroup value={selectedLabels} onChange={(v: string[]) => setSelectedLabels(v)}>
                <Stack pl={2} pr={2} gap={1}>
                  {labelSpecs.map(lbl => (
                    <Checkbox key={lbl.value} value={lbl.value} py={1.5} px={2} colorScheme={labelSet === "customLabels" ? "blue" : "purple"} iconColor={badgeText}>
                      <Badge
                        mr={2}
                        fontSize="sm"
                        bg={lbl.color}
                        color={badgeText}
                        borderRadius="base"
                        px={2} py={1}
                        fontWeight={600}
                        variant="solid"
                      >
                        {lbl.label}
                      </Badge>
                    </Checkbox>
                  ))}
                </Stack>
              </CheckboxGroup>
            </MenuList>
          </Menu>
        </Flex>
        <Box 
          bg={useColorModeValue('blue.50', 'gray.700')} 
          p={3} 
          borderRadius="md" 
          mb={3}
          textAlign="center"
        >
          <Text fontSize="lg" fontWeight="bold" color={useColorModeValue('blue.700', 'blue.300')}>
            {latestMonth
              ? <>Current Month ({formatMonthLabel(latestMonth)}) Total Open PRs: <Text as="span" color={accentColor}>{currentMonthTotal}</Text></>
              : <>No data available</>
            }
          </Text>
          <Text fontSize="xs" color={useColorModeValue('gray.600', 'gray.400')} mt={1}>
            (Based on {selectedLabels.length} selected label{selectedLabels.length !== 1 ? 's' : ''} - This is what will be downloaded)
          </Text>
        </Box>
        <Divider my={3} />
        <Box minH="350px">
          {loading ? (
            <Text color={accentColor} fontWeight="bold" my={10} fontSize="xl">Loading...</Text>
          ) : chartData.months.length === 0 ? (
            <Text color="gray.500" py={12} fontWeight="bold" fontSize="lg">
              No PR label data found for this filter or period.
            </Text>
          ) : (
            <ReactECharts style={{ height: "460px", width: "100%" }} option={option} notMerge lazyUpdate theme={useColorModeValue("light", "dark")} />
          )}
        </Box>
      </CardBody>
    </Card>
  );
}