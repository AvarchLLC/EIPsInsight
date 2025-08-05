import React, { useEffect, useState, useMemo } from "react";
import dynamic from "next/dynamic";
import Papa from "papaparse";
import {
  Box, Card, CardHeader, CardBody, Heading, Text, Stack, Button, Checkbox,
  CheckboxGroup, Menu, MenuButton, MenuList, useColorModeValue, Flex, Badge
} from "@chakra-ui/react";
import { ChevronDownIcon, DownloadIcon } from "@chakra-ui/icons";

// Dynamic import for SSR safety with Next.js
const ReactECharts = dynamic(() => import("echarts-for-react"), { ssr: false });

const LABELS = [
  { value: "EIP update", label: "EIP update", color: "rgba(66, 153, 225, 0.53)" },           // blue.500
  { value: "Typo fix", label: "Typo fix", color: "rgba(72, 187, 120, 0.45)" },               // green.400
  { value: "Status Change", label: "Status Change", color: "rgba(237, 100, 166, 0.38)" },    // pink.400
  { value: "a-review", label: "Author Review", color: "rgba(255, 200, 73, 0.44)" },          // yellow.300
  { value: "e-review", label: "Editor Review", color: "rgba(191, 219, 254, 0.67)" },         // blue.200 (pale)
  { value: "created by Bot", label: "Created by Bot", color: "rgba(68, 51, 122, 0.37)" },    // purple.700
  { value: "Misc", label: "Miscellaneous", color: "rgba(160, 174, 192, 0.24)" },             // gray.400
];


// Helper: month-year ("2025-08-03" => "Aug 2025")
function toMonthYear(dateStr: string | undefined) {
  if (!dateStr) return "Unknown";
  const date = new Date(dateStr);
  return date.toLocaleString("default", { month: "short", year: "numeric" });
}

export default function PRAnalyticsCard() {
  const cardBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.700", "gray.200");
  const accentColor = useColorModeValue("blue.500", "blue.300");

  const [data, setData] = useState<any[]>([]);
  const [selectedLabels, setSelectedLabels] = useState<string[]>(LABELS.map(l => l.value));

  useEffect(() => {
    fetch("/api/openprs")
      .then(res => res.json())
      .then(raw => {
        // Augment: guarantee all needed labels, reassign missing core to Misc
        setData(
raw.map((pr: any) => {
  let newLabels: string[] = pr.labels || [];
  // Add "created by Bot" label if author is a known bot or label exists
  if (pr.author && typeof pr.author === "string" && pr.author.toLowerCase().includes("bot")) {
    if (!newLabels.includes("created by Bot")) newLabels.push("created by Bot");
  }
  // Move unknown labels to Misc if not matched
  const knownSet = LABELS.map(l => l.value);
  const hasKnown = newLabels.some((l: string) => knownSet.includes(l));
  if (!hasKnown) newLabels.push("Misc");
  return { ...pr, labels: newLabels };
})

        );
      });
  }, []);

  // Filtered Data
  const filteredData = useMemo(
    () =>
      data.filter(
        (pr) => pr.labels.some((l: string) => selectedLabels.includes(l))
      ),
    [data, selectedLabels]
  );

  // Chart preparation (now by month-year)
  const chartData = useMemo(() => {
    const results: Record<string, Record<string, number>> = {};
    for (const pr of filteredData) {
      const month = toMonthYear(pr.createdAt);
      if (!results[month]) results[month] = {};
      for (const label of pr.labels) {
        if (selectedLabels.includes(label)) {
          results[month][label] = (results[month][label] || 0) + 1;
        }
      }
    }
    const months = Object.keys(results).sort(
      (a, b) => new Date(a).getTime() - new Date(b).getTime()
    );
    return {
      months,
      series: LABELS.map(l => ({
        name: l.label,
        type: "bar",
        stack: "total",
        data: months.map(m => results[m]?.[l.value] ?? 0),
        emphasis: { focus: "series" },
        itemStyle: { color: l.color }
      }))
    };
  }, [filteredData, selectedLabels]);

  const option = useMemo(() => ({
    tooltip: { trigger: "axis" },
    legend: {
      data: LABELS.map(l => l.label),
      textStyle: { color: textColor, fontWeight: "bold" },
    },
    toolbox: { feature: { saveAsImage: {} } },
    xAxis: [{
      type: "category",
      data: chartData.months,
      axisLabel: { color: textColor, fontWeight: 600, fontSize: 13 },
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
        start: 50,
        end: 100,
        bottom: 12
      }
    ],
    grid: { left: 50, right: 30, top: 60, bottom: 80 }
  }), [chartData, textColor, cardBg]);

  // CSV export
  const downloadCSV = () => {
    const csv = Papa.unparse(filteredData);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "filtered_prs.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card bg={cardBg} color={textColor} boxShadow="2xl" maxW="1200px" mx="auto" mt={8} borderRadius="2xl" p={4}>
      <CardHeader>
        <Flex align="center" justify="space-between" wrap="wrap">
          <Heading size="md" color={accentColor} mb={2}>
            Ethereum EIPs PR Analytics
          </Heading>
          <Button leftIcon={<DownloadIcon />} colorScheme="blue" onClick={downloadCSV} variant="solid" size="sm" borderRadius="md">
            Download CSV
          </Button>
        </Flex>
      </CardHeader>
      <CardBody>
        <Flex gap={4} wrap="wrap" mb={4} align="center">
          {/* Improved dropdown filter with padding */}
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />} variant="outline" colorScheme="blue" borderRadius="md">
              Filter by Labels
            </MenuButton>
            <MenuList minWidth="260px" px={2} py={2}>
              <CheckboxGroup value={selectedLabels} onChange={v => setSelectedLabels(v as string[])}>
                <Stack pl={2} pr={2}>
                  {LABELS.map(lbl => (
                    <Checkbox key={lbl.value} value={lbl.value} py={2} px={2}>
                      <Badge
                        mr={2}
                        fontSize="sm"
                        bg={lbl.color}
                        color={lbl.value === "Misc" ? "blackAlpha.800" : "teal.900"}
                        borderRadius="base"
                        px={2} py={1}
                        variant="subtle"
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
        <Box>
          <ReactECharts
            style={{ height: "480px", width: "100%" }}
            option={option}
            notMerge
            lazyUpdate
            theme={useColorModeValue("light", "dark")}
          />
        </Box>
        <Text color={textColor} fontSize="md" mt={4}>
          Showing <b>{filteredData.length}</b> PRs / <b>{data.length}</b> total (open only)
        </Text>
      </CardBody>
    </Card>
  );
}
