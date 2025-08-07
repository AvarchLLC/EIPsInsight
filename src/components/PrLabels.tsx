import React, { useEffect, useState, useMemo } from "react";
import dynamic from "next/dynamic";
import {
  Box, Card, CardHeader, CardBody, Heading, Text, Stack, Button, Checkbox,
  CheckboxGroup, Menu, MenuButton, MenuList, useColorModeValue, Flex, Badge, HStack, Divider
} from "@chakra-ui/react";
import { ChevronDownIcon, DownloadIcon } from "@chakra-ui/icons";
import Papa from "papaparse";

// ECharts only loads on client
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
  { value: "Other Labels", label: "Other Labels", color: "#9ca3af" },
];

const REPOS = [
  { key: "eip", label: "EIP PRs", api: "/pr-stats" },
  { key: "erc", label: "ERC PRs", api: "/ercpr-stats" },
];

// Aggregated API data shape
interface AggregatedLabelCount {
  monthYear: string;
  label: string;
  count: number;
  labelType: string; // "customLabels" or "githubLabels"
}

export default function PRAnalyticsCard() {
  const cardBg = useColorModeValue("white", "#252529");
  const textColor = useColorModeValue("#2D3748", "#F7FAFC");
  const accentColor = useColorModeValue("#4299e1", "#63b3ed");
  const badgeText = useColorModeValue("white", "#171923");

  const [repoKey, setRepoKey] = useState<"eip" | "erc">("eip");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<AggregatedLabelCount[]>([]);

  const customLabelsForRepo = useMemo<LabelSpec[]>(
    () => (repoKey === "eip" ? CUSTOM_LABELS_EIP : CUSTOM_LABELS_ERC),
    [repoKey]
  );

  // Label selection for filtering
  const [selectedCustomLabels, setSelectedCustomLabels] = useState<string[]>(
    customLabelsForRepo.map((l) => l.value)
  );
  const [selectedWorkflowLabels, setSelectedWorkflowLabels] = useState<string[]>(
    WORKFLOW_LABELS.map((l) => l.value)
  );

  // Reset selected custom labels when repo changes
  useEffect(() => {
    setSelectedCustomLabels(customLabelsForRepo.map((l) => l.value));
  }, [customLabelsForRepo]);

  // Fetch aggregated data from API
  useEffect(() => {
    setLoading(true);
    const repoObj = REPOS.find((r) => r.key === repoKey)!;
    fetch(repoObj.api)
      .then((res) => res.json())
      .then((raw: AggregatedLabelCount[]) => {
        setData(raw);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [repoKey]);

  // Filter data by selected labels (custom and workflow)
  const filteredData = useMemo(() => 
    data.filter((item) => 
      (item.labelType === "customLabels"
        ? selectedCustomLabels.includes(item.label)
        : selectedWorkflowLabels.includes(item.label))
    )
  , [data, selectedCustomLabels, selectedWorkflowLabels]);

  // Extract months sorted ascending
  const months = useMemo(() => {
    const monthSet = new Set(filteredData.map(d => d.monthYear));
    return Array.from(monthSet).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
  }, [filteredData]);

  // Aggregate data into chart series grouped by labels
  const chartData = useMemo(() => {
    // Labels for series to include
    const allLabels = [
      ...customLabelsForRepo.map(l => ({ ...l, labelType: 'customLabels' })),
      ...WORKFLOW_LABELS.map(l => ({ ...l, labelType: 'githubLabels' }))
    ];

    return {
      months,
      series: allLabels.map(({ value, label, color, labelType }) => ({
        name: label,
        type: "bar",
        stack: labelType,
        data: months.map(month => {
          const found = filteredData.find(d => d.monthYear === month && d.label === value && d.labelType === labelType);
          return found ? found.count : 0;
        }),
        itemStyle: { color }
      }))
    };
  }, [months, filteredData, customLabelsForRepo]);

  // Chart option for ECharts
  const option = useMemo(() => ({
    tooltip: {
      trigger: "axis",
      backgroundColor: "#fff",
      borderColor: "#cfd8dc",
      textStyle: { color: "#1a202c" },
      formatter: function (params: any) {
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
      data: chartData.series.map(s => s.name),
      textStyle: { color: textColor, fontWeight: 700, fontSize: 14 },
      orient: 'horizontal',
      bottom: 20,
      scrollDataIndex: 0,
      type: 'scroll'
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
  }), [chartData, textColor, cardBg]);

  console.log(chartData)

  // CSV download helper (optional)
  const downloadCSV = () => {
    const csvData = filteredData.map(({ monthYear, label, count, labelType }) => ({
      Month: monthYear,
      Label: label,
      LabelType: labelType,
      Count: count
    }));
    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${repoKey}_pr_label_counts.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Select / Clear All functions for filters
  const selectAllCustom = () => setSelectedCustomLabels(customLabelsForRepo.map(l => l.value));
  const clearAllCustom = () => setSelectedCustomLabels([]);
  const selectAllWorkflow = () => setSelectedWorkflowLabels(WORKFLOW_LABELS.map(l => l.value));
  const clearAllWorkflow = () => setSelectedWorkflowLabels([]);

  return (
    <Card bg={cardBg} color={textColor} mx="auto" mt={8} borderRadius="2xl" p={4}>
      <CardHeader>
        <Flex align="center" justify="space-between" wrap="wrap" gap={4}>
          <Heading size="md" color={accentColor} mb={2}>
            {REPOS.find(r => r.key === repoKey)?.label} Distribution
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
              <CheckboxGroup value={selectedCustomLabels} onChange={(v: string[]) => setSelectedCustomLabels(v)}>
                <Stack pl={2} pr={2} gap={1}>
                  {customLabelsForRepo.map(lbl => (
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
              <CheckboxGroup value={selectedWorkflowLabels} onChange={(v: string[]) => setSelectedWorkflowLabels(v)}>
                <Stack pl={2} pr={2} gap={1}>
                  {WORKFLOW_LABELS.map(lbl => (
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
          Showing <b>{filteredData.length}</b> label counts / <b>{data.length}</b> total entries
        </Text>
      </CardBody>
      {/* Add your DateTime component if needed */}
    </Card>
  );
}
