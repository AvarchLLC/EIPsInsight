import React, { useEffect, useState, useMemo } from "react";
import dynamic from "next/dynamic";
import {
  Box, Card, CardHeader, CardBody, Heading, Text, Stack, Button, Checkbox,
  CheckboxGroup, Menu, MenuButton, MenuList, useColorModeValue, Flex, Badge, HStack, Divider
} from "@chakra-ui/react";
import { ChevronDownIcon, DownloadIcon } from "@chakra-ui/icons";
import Papa from "papaparse";

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
  { key: "eip", label: "EIP PRs", api: "/api/pr-stats" },
  { key: "erc", label: "ERC PRs", api: "/api/ercpr-stats" },
];

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
  const [labelSet, setLabelSet] = useState<"customLabels" | "githubLabels">("customLabels");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<AggregatedLabelCount[]>([]);

  // Select correct label spec
  const labelSpecs: LabelSpec[] = useMemo(() => {
    if (labelSet === "customLabels") {
      return repoKey === "eip" ? CUSTOM_LABELS_EIP : CUSTOM_LABELS_ERC;
    } else {
      return WORKFLOW_LABELS;
    }
  }, [repoKey, labelSet]);

  // Filter state setup
  const [selectedLabels, setSelectedLabels] = useState<string[]>(labelSpecs.map(l => l.value));
  useEffect(() => {
    setSelectedLabels(labelSpecs.map(l => l.value));
  }, [labelSpecs]);

  // Fetch API
  useEffect(() => {
    setLoading(true);
    const repoObj = REPOS.find(r => r.key === repoKey)!;
    fetch(repoObj.api)
      .then(res => res.json())
      .then((raw: AggregatedLabelCount[]) => {
        setData(raw);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [repoKey]);

  // Only show one labelType at a time – filter accordingly
  const filteredData = useMemo(() =>
    data.filter(item =>
      item.labelType === labelSet && selectedLabels.includes(item.label)
    ), [data, labelSet, selectedLabels]
  );

  const months = useMemo(() => {
    const monthSet = new Set(filteredData.map(d => d.monthYear));
    return Array.from(monthSet).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
  }, [filteredData]);

  const chartData = useMemo(() => ({
    months,
    series: labelSpecs.map(({ value, label, color }) => ({
      name: label,
      type: "bar",
      stack: "total",
      data: months.map(month => {
        const found = filteredData.find(d => d.monthYear === month && d.label === value);
        return found ? found.count : 0;
      }),
      itemStyle: { color }
    }))
  }), [months, filteredData, labelSpecs]);

  const option = useMemo(() => ({
    tooltip: {
      trigger: "axis",
      backgroundColor: "#fff",
      borderColor: "#cfd8dc",
      textStyle: { color: "#1a202c" },
      formatter(params: any) {
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
      type: 'scroll',
      orient: 'horizontal',
      bottom: 20,
      scrollDataIndex: 0,
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

  const downloadCSV = () => {
    const csvData = filteredData.map(({ monthYear, label, count }) => ({
      Month: monthYear,
      Label: label,
      Count: count,
      Set: labelSet,
    }));
    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${repoKey}_${labelSet}_pr_label_counts.csv`;
    a.click();
    URL.revokeObjectURL(url);
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
          <Heading size="md" color={accentColor} mb={2}>
            {REPOS.find(r => r.key === repoKey)?.label} &mdash; {labelSetOptions.find(o => o.key === labelSet)?.label} Distribution
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
                      onClick={() => setRepoKey(repo.key as "eip" | "erc")}
                    >
                      {repo.label}
                    </Button>
                  ))}
                </Stack>
              </MenuList>
            </Menu>
            {/* Label set switch */}
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
        <Text color={accentColor} fontSize="sm" mb={2}>
          Showing <b>{filteredData.length}</b> label count entries across <b>{months.length}</b> time periods with {` `}
          <b>{selectedLabels.length}</b> {labelSet === "customLabels" ? "custom" : "workflow"} labels.
        </Text>
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
        <Text color={textColor} fontSize="md" mt={4}>
          Showing <b>{filteredData.length}</b> label counts / <b>{data.length}</b> total entries
        </Text>
      </CardBody>
    </Card>
  );
}
