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

// Graph 2: Process (same open PRs as Graph 1 Open; sum of counts = Graph 1 Open per month)
const PROCESS_LABELS: LabelSpec[] = [
  { value: "PR DRAFT", label: "PR DRAFT", color: "#94a3b8" },      // neutral grey → work-in-progress, not alarming
  { value: "Typo", label: "Typo", color: "#22c55e" },               // green → minor, harmless fixes
  { value: "NEW EIP", label: "NEW EIP", color: "#0ea5e9" },         // blue → fresh, official, structured
  { value: "Website", label: "Website", color: "#38bdf8" },         // lighter blue → web/UX vibe
  { value: "EIP-1", label: "EIP-1", color: "#8b5cf6" },             // violet → special / foundational
  { value: "Tooling", label: "Tooling", color: "#14b8a6" },         // teal → engineering / infra feel
  { value: "Status Change", label: "Status Change", color: "#f97316" }, // orange → action / transition
  { value: "Other", label: "Other", color: "#64748b" },             // muted slate → miscellaneous
];

// Graph 2: Participants (subcategory); Awaited = draft PRs when Process is PR DRAFT and not stagnant; empty/unknown → Misc
const PARTICIPANTS_LABELS: LabelSpec[] = [
  { value: "Waiting on Editor", label: "Waiting on Editor", color: "#facc15" }, // yellow → paused, pending review
  { value: "Waiting on Author", label: "Waiting on Author", color: "#22c55e" }, // green → ball is with author, normal state
  { value: "Stagnant", label: "Stagnant", color: "#ef4444" },                   // red → actually concerning
  { value: "Awaited", label: "Awaited", color: "#8b5cf6" },                     // purple → anticipated / queued
  { value: "Misc", label: "Misc", color: "#94a3b8" },                           // neutral grey → unknown bucket
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

// Graph 2 Process: PR DRAFT | Typo | NEW EIP | Website | EIP-1 | Tooling | Status Change | Other
function labelsToProcess(labelsStr: string, repo: string, isPrDraft?: boolean): string {
  const labels = labelsStr.split(";").map((l) => l.trim()).filter(Boolean);
  if (isPrDraft === true || labels.some((l) => l === "PR DRAFT")) return "PR DRAFT";
  if (labels.some((l) => /^Typo Fix$/i.test(l))) return "Typo";
  if (labels.some((l) => /^Status Change$/i.test(l))) return "Status Change";
  if (labels.some((l) => /^New EIP$/i.test(l))) return "NEW EIP";
  if (labels.some((l) => /^New ERC$/i.test(l))) return "NEW EIP";
  if (labels.some((l) => /^New RIP$/i.test(l))) return "NEW EIP";
  if (labels.some((l) => /website|r-website/i.test(l))) return "Website";
  if (labels.some((l) => /eip-?1|EIP-?1/i.test(l))) return "EIP-1";
  if (labels.some((l) => /tooling|r-ci|r-process/i.test(l))) return "Tooling";
  return "Other";
}
// Graph 2 Participants: match backend deriveSubcategory (boards) so chart fallback and CSV derivation align
function labelsToParticipants(labelsStr: string, _process: string, isPrDraft?: boolean): string {
  const labels = labelsStr.split(";").map((l) => (l || "").trim()).filter(Boolean);
  const lower = labels.map((l) => l.toLowerCase());
  // Waiting on Editor: same variants as backend (e-review, e-consensus, needs-editor-review, editor+review)
  if (lower.some((l) => l === "e-review" || l === "editor review")) return "Waiting on Editor";
  if (lower.some((l) => l === "needs-editor-review" || l === "custom:needs-editor-review" || l === "e-consensus")) return "Waiting on Editor";
  if (lower.some((l) => l && l.includes("editor") && l.includes("review"))) return "Waiting on Editor";
  if (lower.some((l) => l === "a-review" || l === "author review")) return "Waiting on Author";
  if (lower.some((l) => l === "s-stagnant" || l === "stagnant")) return "Stagnant";
  // Awaited: draft (same as backend — no stagnant check so counts match)
  if (isPrDraft === true || labels.some((l) => l === "PR DRAFT")) return "Awaited";
  return "Misc";
}

/** Normalize Graph 2a API type (category) to display: e.g. "New EIP" → "NEW EIP". Chart doc: category "eips"|"ercs"|"rips"|"all", type = category name. */
function normalizeProcessTypeFromApi(type: string): string {
  const t = (type || "").trim();
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

/** Normalize Graph 2b API type (subcategory) to display: e.g. "AWAITED" → "Awaited". Chart doc type = subcategory name. */
function normalizeParticipantsTypeFromApi(type: string): string {
  const t = (type || "").trim();
  if (/^AWAITED$/i.test(t)) return "Awaited";
  if (/Waiting\s*on\s*Editor/i.test(t)) return "Waiting on Editor";
  if (/Waiting\s*on\s*Author/i.test(t)) return "Waiting on Author";
  if (/Stagnant/i.test(t)) return "Stagnant";
  if (/Uncategorized|Misc/i.test(t)) return "Misc";
  return t || "Misc";
}

export default function PRAnalyticsCard() {
  const cardBg = useColorModeValue("white", "#252529");
  const textColor = useColorModeValue("#2D3748", "#F7FAFC");
  const accentColor = useColorModeValue("#4299e1", "#63b3ed");
  const badgeText = useColorModeValue("white", "#171923");
  const axisColor = useColorModeValue("#e2e8f0", "#4a5568");
  const splitLineColor = useColorModeValue("#f7fafc", "#2d3748");

  const [repoKey, setRepoKey] = useState<"all" | "eip" | "erc" | "rip">("eip");
  const [labelSet, setLabelSet] = useState<"process" | "participants">("process");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<AggregatedLabelCount[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string>(''); // For CSV download
  const [tableMonthTotal, setTableMonthTotal] = useState<number | null>(null); // From details API; matches eipboards (activity month)

  // Graph 2: Process or Participants (same open PRs as Graph 1 Open; sum = Graph 1 Open per month)
  const labelSpecs: LabelSpec[] = useMemo(() => {
    return labelSet === "process" ? PROCESS_LABELS : PARTICIPANTS_LABELS;
  }, [labelSet]);

  // Filter state setup
  const [selectedLabels, setSelectedLabels] = useState<string[]>(labelSpecs.map(l => l.value));
  useEffect(() => setSelectedLabels(labelSpecs.map(l => l.value)), [labelSpecs]);

  // Categorize PR based on ALL its labels (matching API aggregation logic)
  const categorizePRByLabels = (allLabelsStr: string, repo: string): string => {
    // Parse all labels from the semicolon-separated string
    const allLabels = allLabelsStr.split(";").map(l => l.trim()).filter(l => l);
    
    // Apply priority-based categorization matching the API logic
    if (repo.toLowerCase() === "erc prs" || repo === "erc") {
      if (allLabels.includes("Typo Fix")) return "Typo Fix";
      if (allLabels.includes("Status Change")) return "Status Change";
      if (allLabels.includes("ERC Update")) return "ERC Update";
      if (allLabels.includes("Created By Bot")) return "Created By Bot";
      if (allLabels.includes("New ERC")) return "New ERC";
    } else if (repo.toLowerCase() === "rip prs" || repo === "rip") {
      if (allLabels.includes("Typo Fix")) return "Typo Fix";
      if (allLabels.includes("Update")) return "Update";
      if (allLabels.includes("New RIP")) return "New RIP";
      if (allLabels.includes("Created By Bot")) return "Created By Bot";
    } else {
      // EIP or default
      if (allLabels.includes("Typo Fix")) return "Typo Fix";
      if (allLabels.includes("Status Change")) return "Status Change";
      if (allLabels.includes("EIP Update")) return "EIP Update";
      if (allLabels.includes("Created By Bot")) return "Created By Bot";
      if (allLabels.includes("New EIP")) return "New EIP";
    }
    return "Misc";
  };

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

  // Map repo key to Graph 2 API name (eips, ercs, rips, all)
  const graph2ApiName = repoKey === "eip" ? "eips" : repoKey === "erc" ? "ercs" : repoKey === "rip" ? "rips" : "all";

  // Fetch API: prefer Graph 2 chart API (same open PR set as Graph 1); fallback to pr-details + client aggregate
  useEffect(() => {
    setLoading(true);
    const controller = new AbortController();

    const fetchDetails = async (repo: string) => {
      const qs = new URLSearchParams({ repo, mode: "detail", labelType: "customLabels" }).toString();
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

        const process = (labelSet === "process" && pr.Category) ? pr.Category : labelsToProcess(pr.Labels || "", pr.Repo || "", pr.Draft);
        const label = labelSet === "process"
          ? process
          : (pr.Subcategory != null && pr.Subcategory !== "" ? pr.Subcategory : labelsToParticipants(pr.Labels || "", process, pr.Draft));

        const key = `${monthYear}__${label}`;
        const curr = acc.get(key) || { monthYear, label, count: 0, labelType: labelSet, prNumbers: [] };
        curr.count += 1;
        if (pr.PRNumber) curr.prNumbers = [...curr.prNumbers, pr.PRNumber];
        acc.set(key, curr);
      }
      return Array.from(acc.values());
    };

    const view = labelSet === "process" ? "category" : "subcategory";

    const run = async () => {
      try {
        // Prefer Graph 2 API (pre-aggregated chart data; sum = Graph 1 Open per month)
        const graph2Res = await fetch(
          `/api/AnalyticsCharts/graph2/${graph2ApiName}?view=${view}`,
          { signal: controller.signal }
        );
        if (graph2Res.ok) {
          const json = await graph2Res.json();
          // Graph 2a = category (Process), Graph 2b = subcategory (Participants). Chart doc: _id, category, monthYear, type, count.
          const arr = labelSet === "process" ? (json?.data?.category ?? []) : (json?.data?.subcategory ?? []);
          if (Array.isArray(arr) && arr.length > 0) {
            const aggregated: AggregatedLabelCount[] = arr.map((d: { monthYear?: string; type?: string; count?: number }) => ({
              monthYear: d.monthYear ?? "",
              label: labelSet === "process" ? normalizeProcessTypeFromApi(d.type ?? "") : normalizeParticipantsTypeFromApi(d.type ?? ""),
              count: typeof d.count === "number" ? d.count : 0,
              labelType: labelSet,
              prNumbers: [],
            }));
            setData(aggregated);
            return;
          }
        }
        // Fallback: pr-details + client-side aggregate
        const reposToFetch = repoKey === "all" ? ["eip", "erc", "rip"] : [repoKey];
        const results = await Promise.allSettled(
          reposToFetch.map((r) => fetchDetails(r))
        );
        const toRows = (r: PromiseSettledResult<any[]>) => (r.status === "fulfilled" ? r.value : []);
        const combinedRows = results.flatMap(toRows);
        setData(aggregateDetails(combinedRows));
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
  }, [repoKey, labelSet, graph2ApiName]);

  // Fetch table total for selected month (details API = activity month) so we can show the number that matches eipboards
  useEffect(() => {
    if (!selectedMonth || !/^\d{4}-\d{2}$/.test(selectedMonth)) {
      setTableMonthTotal(null);
      return;
    }
    const ac = new AbortController();
    fetch(`/api/AnalyticsCharts/category-subcategory/${graph2ApiName}/details?month=${selectedMonth}&source=snapshot`, { signal: ac.signal })
      .then((res) => (res.ok ? res.json() : []))
      .then((rows: any[]) => {
        const arr = Array.isArray(rows) ? rows : [];
        const filtered = arr.filter((row: any) => {
          const processNorm = normalizeProcessTypeFromApi(row.Process ?? "Other");
          const participantsNorm = normalizeParticipantsTypeFromApi(row.Participants ?? "Misc");
          const actualLabel = labelSet === "process" ? processNorm : participantsNorm;
          return selectedLabels.includes(actualLabel);
        });
        setTableMonthTotal(filtered.length);
      })
      .catch(() => setTableMonthTotal(null));
    return () => ac.abort();
  }, [selectedMonth, graph2ApiName, labelSet, selectedLabels]);

  // Build filtered dataset and chart options
  const filteredData = useMemo(() => {
    const arr = Array.isArray(data) ? data : [];
    return arr.filter(item => selectedLabels.includes(item.label));
  }, [data, selectedLabels]);

  const months = useMemo(() => {
    const monthSet = new Set(filteredData.map(d => d.monthYear));
    return Array.from(monthSet).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
  }, [filteredData]);

  // Set selected month to latest month when months change
  useEffect(() => {
    if (months.length > 0 && !selectedMonth) {
      setSelectedMonth(months[months.length - 1]);
    }
  }, [months, selectedMonth]);

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
      itemStyle: { color, barBorderRadius: [4, 4, 0, 0] },
      barMaxWidth: 40,
      emphasis: { itemStyle: { shadowBlur: 12, shadowColor: "rgba(0,0,0,0.2)" } },
      animationDelay: (dataIndex: number) => dataIndex * 25,
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
      axisLine: { lineStyle: { color: axisColor } },
      axisTick: { lineStyle: { color: axisColor } }
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
      axisLine: { lineStyle: { color: axisColor } },
      splitLine: {
        lineStyle: { color: splitLineColor, type: 'dashed' }
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
    animation: true,
    animationDuration: 1000,
    animationEasing: "cubicOut",
    animationDelayUpdate: (idx: number) => idx * 20,
  }), [chartData, textColor, cardBg, defaultZoomStart, axisColor, splitLineColor]);

  // CSV download: use category-subcategory details API (same as Board/Graph 3 table) so counts match that source
  const downloadCSV = async () => {
    setLoading(true);

    const downloadMonthKey = selectedMonth || (months.length > 0 ? months[months.length - 1] : null);
    if (!downloadMonthKey) {
      setLoading(false);
      return;
    }

    try {
      const detailsUrl = `/api/AnalyticsCharts/category-subcategory/${graph2ApiName}/details?month=${downloadMonthKey}&source=snapshot`;
      const res = await fetch(detailsUrl);
      if (!res.ok) throw new Error(`Failed to fetch details: ${res.status}`);
      const rows: any[] = await res.json();
      const combined = Array.isArray(rows) ? rows : [];

      // Details API returns Process, Participants (from stored category/subcategory). Normalize to match chart & selectedLabels
      const filteredRows = combined
        .map((row: any) => {
          const processNorm = normalizeProcessTypeFromApi(row.Process ?? "Other");
          const participantsNorm = normalizeParticipantsTypeFromApi(row.Participants ?? "Misc");
          const actualLabel = labelSet === "process" ? processNorm : participantsNorm;
          return { ...row, ActualLabel: actualLabel };
        })
        .filter((row: any) => selectedLabels.includes(row.ActualLabel));

      const csvData = filteredRows.map((row: any) => ({
        Month: row.Month ?? formatMonthLabel(row.MonthKey),
        MonthKey: row.MonthKey,
        Label: row.ActualLabel,
        Repo: row.Repo ?? (repoKey === "all" ? undefined : repoKey),
        PRNumber: row.PRNumber,
        PRLink: row.PRLink,
        Author: row.Author ?? "",
        Title: row.Title ?? "",
        CreatedAt: row.CreatedAt ? new Date(row.CreatedAt).toISOString() : "",
      }));

      const csv = Papa.unparse(csvData);
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
      const urlObj = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = urlObj;
      a.download = `${repoKey}_${labelSet}_${downloadMonthKey}_prs.csv`;
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

  // Graph 2: toggle Process (category) or Participants (subcategory); same open PRs, sum = Graph 1 Open
  const labelSetOptions = [
    { key: "process", label: "Process" },
    { key: "participants", label: "Participants" }
  ];

  return (
    <Card bg={cardBg} color={textColor} mx="auto" mt={8} borderRadius="2xl" p={4}>
      <CardHeader>
        <Flex align="center" justify="space-between" wrap="wrap" gap={4}>
          <Heading size="md" color={accentColor} mb={2} id="PrLabelsChart">
           {REPOS.find(r => r.key === repoKey)?.label} &mdash; {labelSetOptions.find(o => o.key === labelSet)?.label}
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
                      onClick={() => setLabelSet(opt.key as "process" | "participants")}
                    >
                      {opt.label}
                    </Button>
                  )}
                </Stack>
              </MenuList>
            </Menu>
            <Menu>
              <MenuButton as={Button} rightIcon={<ChevronDownIcon />} variant="outline" colorScheme="green" minW={160}>
                {selectedMonth ? formatMonthLabel(selectedMonth) : 'Select Month'}
              </MenuButton>
              <MenuList maxHeight="300px" overflowY="auto" minWidth="160px">
                <Stack>
                  {months.slice().reverse().map(month => (
                    <Button
                      key={month}
                      variant="ghost"
                      size="sm"
                      justifyContent="flex-start"
                      colorScheme={selectedMonth === month ? "green" : undefined}
                      onClick={() => setSelectedMonth(month)}
                    >
                      {formatMonthLabel(month)}
                    </Button>
                  ))}
                </Stack>
              </MenuList>
            </Menu>
            <Button leftIcon={<DownloadIcon />} colorScheme="blue" onClick={downloadCSV} variant="solid" size="sm" borderRadius="md" isDisabled={!selectedMonth}>
              Download CSV
            </Button>
          </Flex>
        </Flex>
        <Text fontSize="sm" color={useColorModeValue("gray.600", "gray.400")} mt={2}>
          Same open PRs as Graph 1 Open. Toggle <strong>Process</strong> (category) or <strong>Participants</strong> (subcategory); sum of counts = Graph 1 Open per month. <strong>Awaited</strong> = draft PRs when Process is PR DRAFT and not stagnant.
        </Text>
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
                    <Checkbox key={lbl.value} value={lbl.value} py={1.5} px={2} colorScheme={labelSet === "process" ? "blue" : "purple"} iconColor={badgeText}>
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
              ? <>Chart total ({formatMonthLabel(latestMonth)}): <Text as="span" color={accentColor}>{currentMonthTotal}</Text></>
              : <>No data available</>
            }
          </Text>
          {selectedMonth && tableMonthTotal != null && (
            <Text fontSize="md" fontWeight="semibold" color={useColorModeValue('green.700', 'green.300')} mt={2}>
              Table total for {formatMonthLabel(selectedMonth)} (matches eipboards): <Text as="span" color={accentColor}>{tableMonthTotal}</Text>
            </Text>
          )}
          <Text fontSize="xs" color={useColorModeValue('gray.600', 'gray.400')} mt={2}>
            Chart, table (eipboards), and CSV all use the same <strong>snapshot</strong> data (hourly pre-aggregation). Counts match.
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