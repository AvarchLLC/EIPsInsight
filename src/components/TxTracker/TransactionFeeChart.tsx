import {
  Box,
  Flex,
  Text,
  Button,
  useColorModeValue,
  Collapse,
  IconButton,
  Heading,
  Tooltip as ChakraTooltip,
  Divider,
} from "@chakra-ui/react";
import React, { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { ChevronUpIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { convertGweiToUSD } from "./ethereumService";
import { MdTimeline } from "react-icons/md";

// Lazy load plot
const Line = dynamic(() => import("@ant-design/plots").then(m => m.Line), { ssr: false });

type DataType = "fee" | "priorityFee" | "gasUsed" | "gasBurnt";

interface TxMetricPoint {
  time: string;         // time label (HH:MM:SS or similar)
  block?: number;       // optional block number
  fee?: number;         // base fee gwei
  priorityFee?: number; // priority fee gwei
  gasUsed?: number;     // gas units
  gasBurnt?: number;    // ETH or gwei? (Assuming gwei-like; adapt if needed)
}

interface TransactionFeeChartProps {
  data: TxMetricPoint[];   // base fee
  data1: TxMetricPoint[];  // priority fee
  data2: TxMetricPoint[];  // gas used
  data3: TxMetricPoint[];  // gas burnt (gwei or convert outside if different)
  ethPriceInUSD: number;
}

const METRIC_META: Record<DataType, { label: string; color: string; unit: string; usd: boolean }> = {
  fee:         { label: "Base Fee",      color: "#6366F1", unit: "gwei", usd: true },
  priorityFee: { label: "Priority Fee",  color: "#10B981", unit: "gwei", usd: true },
  gasUsed:     { label: "Gas Used",      color: "#F59E0B", unit: "gas",  usd: false },
  gasBurnt:    { label: "Gas Burnt",     color: "#EF4444", unit: "gwei", usd: true }, // adjust if already ETH
};

const numberFmt = (n: any, max = 4) =>
  isFinite(Number(n))
    ? Intl.NumberFormat("en-US", { maximumFractionDigits: max }).format(Number(n))
    : n;

/**
 * Normalizes and merges metric arrays by time+block (so slider works uniformly).
 * Assumes each dataset may have overlapping or distinct time stamps.
 */
function mergeSeries(a: TxMetricPoint[], b: TxMetricPoint[], c: TxMetricPoint[], d: TxMetricPoint[]) {
  const map = new Map<string, TxMetricPoint>();
  const add = (arr: TxMetricPoint[], keyField: keyof TxMetricPoint) => {
    for (const p of arr || []) {
      const key = `${p.time}|${p.block ?? ""}`;
      if (!map.has(key)) {
        map.set(key, { time: p.time, block: p.block });
      }
      const existing = map.get(key)!;
      if (keyField === "fee") existing.fee = p.fee;
      else if (keyField === "priorityFee") existing.priorityFee = p.priorityFee;
      else if (keyField === "gasUsed") existing.gasUsed = p.gasUsed;
      else if (keyField === "gasBurnt") existing.gasBurnt = p.gasBurnt;
      // Copy other known numeric fields if present
      if (p.fee !== undefined) existing.fee = p.fee;
      if (p.priorityFee !== undefined) existing.priorityFee = p.priorityFee;
      if (p.gasUsed !== undefined) existing.gasUsed = p.gasUsed;
      if (p.gasBurnt !== undefined) existing.gasBurnt = p.gasBurnt;
    }
  };
  add(a, "fee");
  add(b, "priorityFee");
  add(c, "gasUsed");
  add(d, "gasBurnt");
  return Array.from(map.values());
}

const TransactionFeeChart = ({
  data,
  data1,
  data2,
  data3,
  ethPriceInUSD
}: TransactionFeeChartProps) => {
  // Guard
  if (!data?.length && !data1?.length && !data2?.length && !data3?.length) return null;

  const [metric, setMetric] = useState<DataType>("fee");
  const [sliderStart, setSliderStart] = useState(0.9);
  const [showFAQ, setShowFAQ] = useState(false);

  const cardBg = useColorModeValue(
    "linear-gradient(135deg, rgba(255,255,255,0.78) 0%, rgba(245,247,250,0.55) 100%)",
    "linear-gradient(135deg, rgba(31,36,46,0.85) 0%, rgba(21,26,36,0.78) 100%)"
  );
  const headerGradient = useColorModeValue(
    "linear-gradient(90deg,#4f46e5,#6366f1)",
    "linear-gradient(90deg,#4338ca,#6366f1)"
  );
  const borderColor = useColorModeValue("blackAlpha.200", "whiteAlpha.200");
  const btnBg = useColorModeValue("whiteAlpha.600", "whiteAlpha.200");
  const btnHover = useColorModeValue("whiteAlpha.700", "whiteAlpha.300");
  const btnActive = useColorModeValue("purple.600", "purple.500");
  const textPrimary = useColorModeValue("gray.800", "gray.100");
  const subColor = useColorModeValue("gray.600", "gray.400");

  // Merge and sort (oldest→newest) with performance optimization
  const merged = useMemo(
    () => {
      const mergedData = mergeSeries(data || [], data1 || [], data2 || [], data3 || [])
        .filter(p => p.time && typeof p.time === 'string') // ensure valid
        .sort((a, b) => a.time.localeCompare(b.time));
      
      // Limit data points to prevent performance issues
      const maxPoints = 100;
      if (mergedData.length > maxPoints) {
        const step = Math.ceil(mergedData.length / maxPoints);
        return mergedData.filter((_, index) => index % step === 0);
      }
      
      return mergedData;
    },
    [data, data1, data2, data3]
  );

  const meta = METRIC_META[metric];

  // Chart config with performance optimizations
  const chartConfig: any = useMemo(() => {
    const validData = merged.filter(p => {
      const value = (p as any)[metric];
      return typeof value === 'number' && isFinite(value) && !isNaN(value);
    });

    return {
      data: validData,
      xField: "time",
      yField: metric,
      color: meta.color,
      smooth: false, // Disable smoothing for better performance
      connectNulls: false,
      animation: false, // Disable animations for better performance
      lineStyle: {
        stroke: meta.color,
        lineWidth: 2,
        opacity: 0.9
      },
      point: {
        size: 0,
        shape: "circle",
        style: { fill: meta.color }
      },
      slider: validData.length > 30 ? {
        start: sliderStart,
        end: 1,
        height: 18,
        trendCfg: { isArea: false }, // Disable area for better performance
        handlerStyle: { fill: meta.color, stroke: meta.color },
        onChange: (cfg: any) => setSliderStart(cfg.start)
      } : undefined,
    tooltip: {
      showTitle: true,
      shared: false,
      customContent: (title: string, items: any[]) => {
        if (!items?.length) return "";
        const d = items[0].data;
        const val = d?.[metric];
        const usdVal =
          meta.usd && typeof val === "number"
            ? convertGweiToUSD(val, ethPriceInUSD)
            : undefined;
        return `
          <div style="padding:10px 12px;font-size:12px;">
            <div style="font-weight:600;margin-bottom:4px;">${meta.label}</div>
            <div style="opacity:0.7;margin-bottom:4px;">Time: ${title}</div>
            ${
              d?.block
                ? `<div style="margin-bottom:4px;">Block: <strong>${d.block}</strong></div>`
                : ""
            }
            <div>
              Value: <strong>${numberFmt(val)}</strong> ${meta.unit}${
                usdVal ? ` <span style="color:#6366F1;">(~$${numberFmt(usdVal, 2)})</span>` : ""
              }
            </div>
          </div>
        `;
      }
    },
    yAxis: {
      label: {
        style: { fill: useColorModeValue("#374151", "#cbd5e1"), fontSize: 11 }
      },
      grid: { line: { style: { stroke: "rgba(100,116,139,0.15)", lineDash: [4,4] } } }
    },
    xAxis: {
      label: {
        autoHide: true,
        style: { fill: useColorModeValue("#374151", "#cbd5e1"), fontSize: 11 }
      },
      line: { style: { stroke: "rgba(100,116,139,0.35)" } }
    }
    };
  }, [merged, metric, meta, sliderStart, ethPriceInUSD]);

  const FAQ = (
    <Collapse in={showFAQ} animateOpacity>
      <Box
        mt={4}
        border="1px solid"
        borderColor={borderColor}
        borderRadius="lg"
        p={5}
        bg={useColorModeValue("whiteAlpha.800", "whiteAlpha.100")}
        backdropFilter="blur(6px)"
      >
        <Heading as="h4" size="sm" mb={3} color={textPrimary}>
          How is total gas cost calculated?
        </Heading>
        <Text fontSize="sm" color={subColor} mb={4}>
          Total Gas Cost = (Base Fee + Priority Fee) * Gas Limit.
          Example: (10 gwei + 2 gwei) * 21,000 = 252,000 gwei = 0.000252 ETH.
        </Text>

        <Heading as="h4" size="sm" mb={3} color={textPrimary}>
          Why do some transactions cost more?
        </Heading>
        <Text fontSize="sm" color={subColor}>
          Higher complexity (contract calls), congestion (base fee spikes), and larger tips for
          faster inclusion raise total cost.
        </Text>
      </Box>
    </Collapse>
  );

  return (
    <Box
      mt={10}
      border="1px solid"
      borderColor={borderColor}
      borderRadius="2xl"
      bg={cardBg}
      backdropFilter="blur(14px)"
      boxShadow={useColorModeValue(
        "0 4px 18px -2px rgba(99,102,241,0.25)",
        "0 4px 22px -4px rgba(99,102,241,0.35)"
      )}
      overflow="hidden"
      w="100%"
      mx="auto"
    >
      {/* Header */}
      <Flex
        px={{ base: 5, md: 8 }}
        py={5}
        bg={headerGradient}
        color="white"
        align="center"
        gap={4}
        flexWrap="wrap"
      >
        <Flex
          w="50px"
          h="50px"
          borderRadius="xl"
          bg="whiteAlpha.300"
          align="center"
          justify="center"
        >
          <MdTimeline size={28} />
        </Flex>
        <Box flex="1 1 auto" minW="220px">
          <Text fontSize={{ base: "lg", md: "xl" }} fontWeight="bold">
            Transaction Fee Metrics
          </Text>
          <Text fontSize="xs" opacity={0.85}>
            Live trends: base, priority, gas used & burnt
          </Text>
        </Box>
        <Flex gap={2} flexWrap="wrap">
          {(Object.keys(METRIC_META) as DataType[]).map(t => {
            const m = METRIC_META[t];
            const active = metric === t;
            return (
              <ChakraTooltip key={t} label={m.label} hasArrow>
                <Button
                  size="sm"
                  onClick={() => setMetric(t)}
                  bg={active ? btnActive : btnBg}
                  color={active ? "white" : textPrimary}
                  fontSize="xs"
                  fontWeight="semibold"
                  px={4}
                  borderRadius="full"
                  _hover={{ bg: active ? btnActive : btnHover }}
                  transition="0.18s"
                  boxShadow={
                    active
                      ? "0 0 0 1px rgba(255,255,255,0.25), 0 0 0 3px rgba(99,102,241,0.35)"
                      : "none"
                  }
                >
                  {m.label}
                </Button>
              </ChakraTooltip>
            );
          })}
          <IconButton
            aria-label="Toggle FAQ"
            size="sm"
            onClick={() => setShowFAQ(s => !s)}
            bg="whiteAlpha.300"
            _hover={{ bg: "whiteAlpha.400" }}
            icon={showFAQ ? <ChevronUpIcon /> : <ChevronDownIcon />}
            borderRadius="full"
          />
        </Flex>
      </Flex>

      {/* Metric Title */}
      <Box px={{ base: 5, md: 8 }} pt={6} pb={2}>
        <Text
          fontSize="md"
          fontWeight="semibold"
          color={textPrimary}
          display="inline-flex"
          alignItems="center"
          gap={2}
        >
          {METRIC_META[metric].label} Trend
          <Box
            as="span"
            w="10px"
            h="10px"
            borderRadius="md"
            bg={METRIC_META[metric].color}
            boxShadow={`0 0 0 2px ${METRIC_META[metric].color}55`}
          />
        </Text>
        <Text fontSize="xs" color={subColor} mt={1}>
          Values plotted oldest → newest (adjust with slider if available).
        </Text>
      </Box>

      {/* Chart */}
      <Box px={{ base: 5, md: 8 }} py={4} w="100%" h={{ base: 320, md: 360 }}>
        <Line {...chartConfig} />
      </Box>

      <Divider opacity={0.4} />

      {/* FAQ */}
      <Box px={{ base: 5, md: 8 }} pb={8} pt={2}>
        {FAQ}
      </Box>
    </Box>
  );
};

export default React.memo(TransactionFeeChart);