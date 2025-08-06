import React, { useEffect, useState, useMemo } from "react";
import dynamic from "next/dynamic";
import Papa from "papaparse";
import {
  Box, Card, CardHeader, CardBody, Heading, Text, Stack, Button, Checkbox,
  CheckboxGroup, Menu, MenuButton, MenuList, useColorModeValue, Flex, Badge, HStack, Divider
} from "@chakra-ui/react";
import { ChevronDownIcon, DownloadIcon } from "@chakra-ui/icons";
import DateTime from "./DateTime";

// ECharts only loads on client
const ReactECharts = dynamic(() => import("echarts-for-react"), { ssr: false });

// Label definitions (type-safe)
type LabelSpec = { value: string; label: string; color: string; };

const CUSTOM_LABELS_EIP: LabelSpec[] = [
  { value: "EIP Update", label: "EIP Update", color: "#2563eb" },        // blue-600
  { value: "Typo Fix", label: "Typo Fix", color: "#16a34a" },            // green-600
  { value: "Status Change", label: "Status Change", color: "#ea580c" },  // orange-600
  { value: "Created By Bot", label: "Created By Bot", color: "#a21caf" },// purple-700
  { value: "New EIP", label: "New EIP", color: "#facc15" },              // yellow-400
  { value: "Misc", label: "Miscellaneous", color: "#64748b" },           // slate-500
];

const CUSTOM_LABELS_ERC: LabelSpec[] = [
  { value: "ERC Update", label: "ERC Update", color: "#0ea5e9" },        // sky-500
  { value: "Typo Fix", label: "Typo Fix", color: "#22c55e" },            // green-500
  { value: "Status Change", label: "Status Change", color: "#e11d48" },  // rose-600
  { value: "Created By Bot", label: "Created By Bot", color: "#a16207" },// amber-700
  { value: "New ERC", label: "New ERC", color: "#8b5cf6" },              // violet-500
  { value: "Misc", label: "Miscellaneous", color: "#334155" },           // slate-700
];

const WORKFLOW_LABELS: LabelSpec[] = [
  { value: "a-review", label: "Author Review", color: "#14b8a6" },       // teal-500
  { value: "e-review", label: "Editor Review", color: "#f43f5e" },       // rose-500
  { value: "discuss", label: "Discuss", color: "#fbbf24" },              // yellow-400
  { value: "on-hold", label: "On Hold", color: "#0d9488" },              // teal-700
  { value: "final-call", label: "Final Call", color: "#6366f1" },        // indigo-500
  { value: "Other Labels", label: "Other Labels", color: "#9ca3af" },    // gray-400
];


const REPOS = [
  { key: "eip", label: "EIP PRs", api: "/api/eipopenprs" },
  { key: "erc", label: "ERC PRs", api: "/api/ercopenprs" }
];

interface PRData {
  customLabels: string[];
  githubLabels: string[];
  createdAt: string;
  [key: string]: any;
}

function toMonthYear(dateStr: string | undefined) {
  if (!dateStr) return "Unknown";
  const date = new Date(dateStr);
  return date.toLocaleString("default", { month: "short", year: "numeric" });
}

export default function PRAnalyticsCard() {
  const cardBg = useColorModeValue("white", "#252529");
  const textColor = useColorModeValue("#2D3748", "#F7FAFC");
  const accentColor = useColorModeValue("#4299e1", "#63b3ed");
  const badgeText = useColorModeValue("white", "#171923");

  // Repo state and label arrays
  const [repoKey, setRepoKey] = useState<"eip" | "erc">("eip");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<PRData[]>([]);

  // Choose correct label spec per repo
  const customLabelsForRepo = useMemo<LabelSpec[]>(
    () => (repoKey === "eip" ? CUSTOM_LABELS_EIP : CUSTOM_LABELS_ERC),
    [repoKey]
  );

  // Filter state for each label set
  const [selectedCustomLabels, setSelectedCustomLabels] = useState<string[]>(customLabelsForRepo.map((l: LabelSpec) => l.value));
  useEffect(() => {
    setSelectedCustomLabels(customLabelsForRepo.map((l: LabelSpec) => l.value));
  }, [customLabelsForRepo]);
  const [selectedWorkflowLabels, setSelectedWorkflowLabels] = useState<string[]>(WORKFLOW_LABELS.map((l: LabelSpec) => l.value));

  // Data fetch & "Other Labels" partition
  useEffect(() => {
    setLoading(true);
    const repoObj = REPOS.find(r => r.key === repoKey)!;
    fetch(repoObj.api)
      .then(res => res.json())
      .then((raw: any[]) => {
        const workflowLabelSet = new Set(WORKFLOW_LABELS.map((l: LabelSpec) => l.value));
        setData(raw.map((pr: any) => {
          const customLabels: string[] = Array.isArray(pr.customLabels) ? pr.customLabels : [];
          const githubLabels: string[] = Array.isArray(pr.githubLabels) ? pr.githubLabels : [];
          const workflowKnown = githubLabels.filter((l: string) => workflowLabelSet.has(l));
          const workflowOther = githubLabels.filter((l: string) => !workflowLabelSet.has(l));
          const workflowLabelsForUi = [...workflowKnown, ...(workflowOther.length ? ["Other Labels"] : [])];
          return {
            ...pr,
            customLabels,
            githubLabels: workflowLabelsForUi,
            _rawOtherWorkflowLabels: workflowOther,
          };
        }));
        setLoading(false);
      });
  }, [repoKey]);

  // Filter by both custom and workflow labels
  const filteredData = useMemo<PRData[]>(
    () =>
      data.filter((pr: PRData) =>
        pr.customLabels.some((l: string) => selectedCustomLabels.includes(l)) &&
        pr.githubLabels.some((l: string) => selectedWorkflowLabels.includes(l))
      ),
    [data, selectedCustomLabels, selectedWorkflowLabels]
  );

  // Chart grouping by custom label, stacked
  const chartData = useMemo(() => {
    const results: Record<string, Record<string, number>> = {};
    for (const pr of filteredData) {
      const month = toMonthYear(pr.createdAt);
      if (!results[month]) results[month] = {};
      for (const label of pr.customLabels as string[]) {
        if (selectedCustomLabels.includes(label)) {
          results[month][label] = (results[month][label] || 0) + 1;
        }
      }
    }
    const months = Object.keys(results).sort(
      (a, b) => new Date(a).getTime() - new Date(b).getTime()
    );
    return {
      months,
      series: customLabelsForRepo.map((l: LabelSpec) => ({
        name: l.label,
        type: "bar",
        stack: "total",
        data: months.map((m: string) => results[m]?.[l.value] ?? 0),
        itemStyle: { color: l.color }
      }))
    };
  }, [filteredData, selectedCustomLabels, customLabelsForRepo]);

  // ECharts options
  const option = useMemo(() => ({
tooltip: {
  trigger: "axis",
  backgroundColor: "#fff",
  borderColor: "#cfd8dc",
  textStyle: { color: "#1a202c" },
  formatter: function (params: any) {
    // params is an array, each with .seriesName, .value, .marker
    // We'll show date, then total, then each stack
    let total = 0;
    params.forEach((item: any) => { total += item.value; });
    let res = `<span style="font-weight:700">${params[0].name}</span><br/><span style="color:#718096;font-size:13px;">Total: <b>${total}</b></span><br/>`;
    params.forEach((item: any) => {
      res += `${item.marker} <span style="color:#1a202c">${item.seriesName}</span>: <b>${item.value}</b><br/>`;
    });
    return res;
  }
},

    legend: {
      data: customLabelsForRepo.map((l: LabelSpec) => l.label),
      textStyle: { color: textColor, fontWeight: 700, fontSize: 14 }
    },
    backgroundColor: cardBg,
    xAxis: [{
      type: "category",
      data: chartData.months,
      axisLabel: {
        color: textColor,
        fontWeight: 600,
        fontSize: 10,
        interval: 0,
        rotate: 0
      }
    }],
    yAxis: [{
      type: "value",
      name: "PR Count",
      axisLabel: { color: textColor }
    }],
    series: chartData.series,
    dataZoom: [
      {
        type: "slider",
        show: true,
        xAxisIndex: [0],
        start: Math.max(0, 100 - 10 * chartData.months.length),
        end: 100,
        bottom: 12,
        height: 30
      }
    ],
    grid: { left: 60, right: 30, top: 60, bottom: 80 }
  }), [chartData, textColor, cardBg, customLabelsForRepo]);

  // CSV download
  const downloadCSV = () => {
    const csv = Papa.unparse(filteredData);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${repoKey}_filtered_prs.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Select/clear all helpers
  const selectAllCustom = () => setSelectedCustomLabels(customLabelsForRepo.map((l: LabelSpec) => l.value));
  const clearAllCustom = () => setSelectedCustomLabels([]);
  const selectAllWorkflow = () => setSelectedWorkflowLabels(WORKFLOW_LABELS.map((l: LabelSpec) => l.value));
  const clearAllWorkflow = () => setSelectedWorkflowLabels([]);

  return (
    <Card bg={cardBg} color={textColor} mx="auto" mt={8} borderRadius="2xl" p={4}>
      <CardHeader>
        <Flex align="center" justify="space-between" wrap="wrap" gap={4}>
          <Heading size="md" color={accentColor} mb={2}>
            {REPOS.find(r => r.key === repoKey)?.label} PR Distribution
          </Heading>
          <Flex gap={3} align="center">
            <Menu>
              <MenuButton as={Button} rightIcon={<ChevronDownIcon />} variant="solid" colorScheme="purple" minW={140}>
                {REPOS.find(r => r.key === repoKey)?.label}
              </MenuButton>
              <MenuList minWidth="140px">
                <Stack>
                  {REPOS.map(repo =>
                    <Button
                      key={repo.key}
                      variant="ghost"
                      size="sm"
                      justifyContent="flex-start"
                      colorScheme={repoKey === repo.key ? "blue" : undefined}
                      onClick={() => setRepoKey(repo.key as "eip" | "erc")}
                    >
                      {repo.label}
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
          {/* Custom Label Filters */}
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />} variant="outline" colorScheme="blue" borderRadius="md" minW={180}>
              Filter by Custom Labels
            </MenuButton>
            <MenuList minWidth="280px" px={2} py={2}>
              <HStack mb={2} gap={2}>
                <Button size="xs" colorScheme="teal" onClick={selectAllCustom}>Select All</Button>
                <Button size="xs" colorScheme="red" variant="outline" onClick={clearAllCustom}>Clear All</Button>
              </HStack>
              <CheckboxGroup value={selectedCustomLabels} onChange={(v: string[] | any) => setSelectedCustomLabels(v)}>
                <Stack pl={2} pr={2} gap={1}>
                  {customLabelsForRepo.map((lbl: LabelSpec) => (
                    <Checkbox key={lbl.value} value={lbl.value} py={1.5} px={2} colorScheme="blue" iconColor={badgeText}>
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
          {/* Workflow Label Filters */}
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />} variant="outline" colorScheme="pink" borderRadius="md" minW={180}>
              Filter by Workflow Labels
            </MenuButton>
            <MenuList minWidth="280px" px={2} py={2}>
              <HStack mb={2} gap={2}>
                <Button size="xs" colorScheme="purple" onClick={selectAllWorkflow}>Select All</Button>
                <Button size="xs" colorScheme="red" variant="outline" onClick={clearAllWorkflow}>Clear All</Button>
              </HStack>
              <CheckboxGroup value={selectedWorkflowLabels} onChange={(v: string[] | any) => setSelectedWorkflowLabels(v)}>
                <Stack pl={2} pr={2} gap={1}>
                  {WORKFLOW_LABELS.map((lbl: LabelSpec) => (
                    <Checkbox key={lbl.value} value={lbl.value} py={1.5} px={2} colorScheme="purple" iconColor={badgeText}>
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
        <Divider my={3} />
        <Box>
          {loading
            ? <Text color={accentColor} fontWeight="bold" my={10} fontSize="xl">Loading...</Text>
            : <ReactECharts
                style={{ height: "460px", width: "100%" }}
                option={option}
                notMerge
                lazyUpdate
                theme={useColorModeValue("light", "dark")}
              />
          }
        </Box>
        <Text color={textColor} fontSize="md" mt={4}>
          Showing <b>{filteredData.length}</b> PRs / <b>{data.length}</b> total (open only)
        </Text>
      </CardBody>
      <DateTime/>
    </Card>
  );
}
