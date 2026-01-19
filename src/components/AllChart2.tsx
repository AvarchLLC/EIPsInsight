import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import {
  Box,
  useColorModeValue,
  Spinner,
  Text,
  Select,
  Flex,
  Link,
  Button,
} from "@chakra-ui/react";
import { useWindowSize } from "react-use";
import { motion } from "framer-motion";
import DateTime from "@/components/DateTime";
import Dashboard from "./Dashboard";
import NextLink from "next/link";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { CSVLink } from "react-csv";

const getCat = (cat: string) => {
  switch (cat) {
    case "Standards Track":
    case "Standard Track":
    case "Standards Track (Core, Networking, Interface, ERC)":
    case "Standard":
    case "Process":
    case "Core":
    case "core":
      return "Core";
    case "RIP":
      return "RIPs";
    case "ERC":
      return "ERCs";
    case "Networking":
      return "Networking";
    case "Interface":
      return "Interface";
    case "Meta":
      return "Meta";
    case "Informational":
      return "Informational";
    default:
      return "Core";
  }
};

const getStatus = (status: string) => {
  switch (status) {
    case "Draft":
      return "Draft";
    case "Final":
    case "Accepted":
    case "Superseded":
      return "Final";
    case "Last Call":
      return "Last Call";
    case "Withdrawn":
    case "Abandoned":
    case "Rejected":
      return "Withdrawn";
    case "Review":
      return "Review";
    case "Living":
    case "Active":
      return "Living";
    case "Stagnant":
      return "Stagnant";
    default:
      return "Final";
  }
};

// Data shape from /api/new/final-status-by-year
interface FinalStatusChange {
  eip: string;
  lastStatus: string;
  eipTitle: string;
  eipCategory: string;
}

interface FinalStatusYearBucket {
  year: number;
  statusChanges: FinalStatusChange[];
  repo: "eip" | "erc" | "rip";
}

// Enhanced color palette - vibrant and distinct
const categoryColors: Record<string, string> = {
  "Core": "rgb(59, 130, 246)", // Blue 500
  "ERCs": "rgb(168, 85, 247)", // Purple 500
  "RIPs": "rgb(236, 72, 153)", // Pink 500
  "Networking": "rgb(34, 197, 94)", // Green 500
  "Interface": "rgb(251, 146, 60)", // Orange 400
  "Meta": "rgb(139, 92, 246)", // Violet 500
  "Informational": "rgb(14, 165, 233)", // Sky 500
  "Draft": "rgb(156, 163, 175)", // Gray 400
  "Review": "rgb(59, 130, 246)", // Blue 500
  "Last Call": "rgb(251, 146, 60)", // Orange 400
  "Final": "rgb(34, 197, 94)", // Green 500
  "Living": "rgb(14, 165, 233)", // Sky 500
  "Stagnant": "rgb(239, 68, 68)", // Red 500
  "Withdrawn": "rgb(107, 114, 128)", // Gray 500
};

// Fallback colors array for dynamic assignment
const fallbackColors: string[] = [
  "rgb(59, 130, 246)", // Blue
  "rgb(168, 85, 247)", // Purple
  "rgb(236, 72, 153)", // Pink
  "rgb(34, 197, 94)", // Green
  "rgb(251, 146, 60)", // Orange
  "rgb(139, 92, 246)", // Violet
  "rgb(14, 165, 233)", // Sky
  "rgb(245, 158, 11)", // Amber
  "rgb(20, 184, 166)", // Teal
  "rgb(249, 115, 22)", // Orange 500
];

interface APIResponse {
  eip: FinalStatusYearBucket[];
  erc: FinalStatusYearBucket[];
  rip: FinalStatusYearBucket[];
}

interface ChartProps {
  type: string;
  dataset: any; // kept for backward compatibility, but ignored now
}

const AllChart: React.FC<ChartProps> = ({ type }) => {
  const [data, setData] = useState<APIResponse>({ eip: [], erc: [], rip: [] });
  const bg = useColorModeValue("#f6f6f7", "#171923");
  const [isLoading, setIsLoading] = useState(true);
  const [chart, setchart] = useState("category");
  const [csvData, setCsvData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/new/final-status-by-year");
        const jsonData: APIResponse = await response.json();
        setData(jsonData);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [type]);

  interface TransformedData {
    category: string;
    year: number;
    value: number;
  }

  interface TransformedData2 {
    status: string;
    year: number;
    value: number;
  }

  // Use final-status-by-year data (aggregated by changeDate/year) instead of created date
  const allBuckets: FinalStatusYearBucket[] = [
    ...(data?.eip || []),
    ...(data?.erc || []),
    ...(data?.rip || []),
  ];

  const transformedData = allBuckets.reduce<TransformedData[]>((acc, bucket) => {
    const year = bucket.year;

    bucket.statusChanges.forEach((sc) => {
      const baseCategory =
        bucket.repo === "rip" ? "RIPs" : getCat(sc.eipCategory || "");

      const existingEntry = acc.find(
        (entry) => entry.year === year && entry.category === baseCategory
      );

      if (existingEntry) {
        existingEntry.value += 1;
      } else {
        acc.push({
          category: baseCategory,
          year,
          value: 1,
        });
      }
    });

    return acc;
  }, []);

  const transformedData2 = allBuckets.reduce<TransformedData[]>((acc, bucket) => {
    const year = bucket.year;

    bucket.statusChanges.forEach((sc) => {
      const status = getStatus(sc.lastStatus);

      const existingEntry = acc.find(
        (entry) => entry.year === year && entry.category === status
      );

      if (existingEntry) {
        existingEntry.value += 1;
      } else {
        acc.push({
          category: status,
          year,
          value: 1,
        });
      }
    });

    return acc;
  }, []);

  // Prepare CSV data whenever API data changes
  React.useEffect(() => {
    const rows: any[] = [];
    let srNumber = 1;

    // Sort all buckets by year, then by repo, then by EIP number
    const sortedBuckets = [...allBuckets].sort((a, b) => {
      if (a.year !== b.year) return a.year - b.year;
      const repoOrder = { eip: 1, erc: 2, rip: 3 };
      if (repoOrder[a.repo] !== repoOrder[b.repo]) {
        return (repoOrder[a.repo] || 99) - (repoOrder[b.repo] || 99);
      }
      // Sort by EIP number within same year and repo
      const aEipNum = parseInt(a.statusChanges[0]?.eip.replace('EIP-', '') || '0');
      const bEipNum = parseInt(b.statusChanges[0]?.eip.replace('EIP-', '') || '0');
      return aEipNum - bEipNum;
    });

    sortedBuckets.forEach((bucket) => {
      const year = bucket.year;
      const repo = bucket.repo;

      // Sort statusChanges by EIP number
      const sortedStatusChanges = [...bucket.statusChanges].sort((a, b) => {
        const aNum = parseInt(a.eip.replace('EIP-', '') || '0');
        const bNum = parseInt(b.eip.replace('EIP-', '') || '0');
        return aNum - bNum;
      });

      sortedStatusChanges.forEach((sc) => {
        const eipNumber = sc.eip.replace('EIP-', '');
        const normalizedCategory = bucket.repo === "rip" ? "RIPs" : getCat(sc.eipCategory || "");
        const normalizedStatus = getStatus(sc.lastStatus);
        
        rows.push({
          "SR No.": srNumber++,
          Year: year,
          Repo: repo.toUpperCase(),
          EIP: sc.eip,
          "EIP Number": eipNumber,
          Title: sc.eipTitle || "N/A",
          Category: normalizedCategory,
          "Original Category": sc.eipCategory || "N/A",
          "Final Status": normalizedStatus,
          "Original Status": sc.lastStatus,
          "EIP Link": `https://eipsinsight.com/eips/eip-${eipNumber}`,
        });
      });
    });

    setCsvData(rows);
  }, [JSON.stringify(data)]);

  const Area = dynamic(
    () => import("@ant-design/plots").then((item) => item.Column),
    {
      ssr: false,
    }
  );

  const transformedData3 =
    chart === "status" ? transformedData2 : transformedData;

  const totalCount = transformedData3.reduce(
    (sum, item) => sum + (item?.value || 0),
    0
  );

  // Calculate year totals for tooltip
  const yearTotals = transformedData3.reduce((acc, item) => {
    if (!acc[item.year]) {
      acc[item.year] = 0;
    }
    acc[item.year] += item.value;
    return acc;
  }, {} as Record<number, number>);

  // Generate dynamic color function
  const getColorForCategory = (category: string, index: number) => {
    return categoryColors[category] || fallbackColors[index % fallbackColors.length];
  };

  // Get unique categories/statuses for color mapping
  const uniqueCategories = Array.from(new Set(transformedData3.map(d => d.category)));
  const colorMap = uniqueCategories.map((cat, idx) => getColorForCategory(cat, idx));

  // Get color mode values for tooltip and chart
  const tooltipBg = useColorModeValue('#ffffff', '#1a202c');
  const tooltipText = useColorModeValue('#2d3748', '#f7fafc');
  const tooltipBorder = useColorModeValue('#e2e8f0', '#4a5568');
  const tooltipItemBg = useColorModeValue('#f7fafc', '#2d3748');
  const tooltipMutedText = useColorModeValue('#718096', '#a0aec0');
  const crosshairColor = useColorModeValue('#30A0E0', '#63B3ED');
  const axisTextColor = useColorModeValue('#4a5568', '#cbd5e0');
  const gridColor = useColorModeValue('#e2e8f0', '#4a5568');
  const legendTextColor = useColorModeValue('#2d3748', '#e2e8f0');

  const config = {
    data: transformedData3,
    xField: "year",
    yField: "value",
    tooltip: {
      shared: true,
      showCrosshairs: true,
      crosshairs: {
        type: 'x' as const,
        line: {
          style: {
            stroke: crosshairColor,
            lineWidth: 1.5,
            lineDash: [4, 4],
            opacity: 0.8,
          },
        },
      },
      customContent: (title: string, items: any[]) => {
        if (!items || items.length === 0) return '';
        const year = items[0]?.data?.year || title;
        const yearTotal = yearTotals[year] || 0;
        
        let html = `<div style="padding: 12px; background: ${tooltipBg}; color: ${tooltipText}; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); min-width: 220px; border: 1px solid ${tooltipBorder};">`;
        html += `<div style="font-weight: 700; margin-bottom: 10px; padding-bottom: 6px; border-bottom: 2px solid ${tooltipBorder}; font-size: 14px; color: #30A0E0;">Year ${year} - Total: <strong>${yearTotal}</strong></div>`;
        
        items.forEach((item: any) => {
          const color = item.color || '#666';
          const category = item.name?.replace(` (${year})`, '') || item.data?.category || '';
          const value = item.value || item.data?.value || 0;
          const percentage = yearTotal > 0 ? ((value / yearTotal) * 100).toFixed(1) : '0';
          
          html += `<div style="display: flex; align-items: center; margin: 6px 0; padding: 6px 8px; border-radius: 6px; background: ${tooltipItemBg};">`;
          html += `<span style="display: inline-block; width: 14px; height: 14px; border-radius: 3px; background: ${color}; margin-right: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);"></span>`;
          html += `<span style="flex: 1; color: ${tooltipText}; font-weight: 500; font-size: 13px;">${category}:</span>`;
          html += `<span style="font-weight: 700; color: ${tooltipText}; margin-left: 8px; font-size: 13px;">${value}</span>`;
          html += `<span style="font-size: 11px; color: ${tooltipMutedText}; margin-left: 6px; font-weight: 500;">(${percentage}%)</span>`;
          html += `</div>`;
        });
        
        html += `</div>`;
        return html;
      },
      domStyles: {
        'g2-tooltip': {
          background: tooltipBg,
          color: tooltipText,
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          padding: '12px',
          border: `1px solid ${tooltipBorder}`,
        },
      },
    },
    interactions: [
      { type: "element-active" },
      { type: "element-selected" },
      { type: "brush" },
    ],
    statistic: {
      title: false as const,
      content: {
        style: {
          whiteSpace: "pre-wrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        },
      },
    },
    slider: {
      start: 0,
      end: 1,
      height: 24,
      trendCfg: {
        isArea: true,
      },
    },
    color: (datum: any) => {
      const category = datum.category;
      const index = uniqueCategories.indexOf(category);
      return getColorForCategory(category, index);
    },
    seriesField: "category",
    isStack: true,
    columnStyle: {
      radius: [4, 4, 0, 0],
    },
    legend: { 
      position: "top-right" as const,
      itemName: {
        style: {
          fill: legendTextColor,
          fontSize: 12,
          fontWeight: 500,
        },
      },
      marker: {
        style: {
          r: 6,
        },
      },
    },
    animation: {
      appear: {
        animation: 'wave-in',
        duration: 1000,
      },
      update: {
        animation: 'wave-in',
        duration: 500,
      },
    },
    xAxis: {
      label: {
        style: {
          fill: axisTextColor,
          fontSize: 11,
          fontWeight: 500,
        },
      },
      line: {
        style: {
          stroke: gridColor,
          lineWidth: 1,
        },
      },
      tickLine: {
        style: {
          stroke: gridColor,
        },
      },
    },
    yAxis: {
      label: {
        style: {
          fill: axisTextColor,
          fontSize: 11,
          fontWeight: 500,
        },
      },
      grid: {
        line: {
          style: {
            stroke: gridColor,
            lineDash: [4, 4],
            lineWidth: 1,
          },
        },
      },
      line: {
        style: {
          stroke: gridColor,
          lineWidth: 1,
        },
      },
    },
  };

return (
  <>
    {isLoading ? (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="200px"
      >
        <Spinner />
      </Box>
    ) : (
      <Box
        bgColor={bg}
        px={4}
        py={3}
        borderRadius="1rem"
        border="2px solid"
        borderColor={useColorModeValue("#30A0E0", "#4299E1")}
        boxShadow={useColorModeValue("0 4px 6px rgba(0,0,0,0.1)", "0 4px 6px rgba(0,0,0,0.3)")}
        transition="all 0.3s ease"
        _hover={{
          borderColor: useColorModeValue("#2B6CB0", "#63B3ED"),
          boxShadow: useColorModeValue("0 10px 25px rgba(48, 160, 224, 0.2)", "0 10px 25px rgba(0,0,0,0.4)"),
          transform: "translateY(-2px)",
        }}
        width="100%"
      >
        <Box
          as={motion.div}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          width="100%"
        >
          <Flex justify="space-between" align="center" mb={3} flexWrap="wrap">
            <Link href="/alltable">
              <Text
                fontSize="2xl"
                fontWeight="bold"
                color="#30A0E0"
                cursor="pointer"
                _hover={{ textDecoration: "underline" }}
              >
                {`All EIPs [${totalCount}]`}
              </Text>
            </Link>

            <Flex gap={2} mt={{ base: 2, md: 0 }} align="center">
              <CSVLink
                data={csvData}
                filename="eips_final_status_by_year.csv"
                headers={[
                  "SR No.",
                  "Year",
                  "Repo",
                  "EIP",
                  "EIP Number",
                  "Title",
                  "Category",
                  "Original Category",
                  "Final Status",
                  "Original Status",
                  "EIP Link"
                ]}
              >
                <Button
                  size="sm"
                  colorScheme="blue"
                  variant="solid"
                  _hover={{
                    transform: "translateY(-1px)",
                    boxShadow: "md",
                  }}
                  transition="all 0.2s"
                >
                  Download CSV
                </Button>
              </CSVLink>

              <Select
                variant="outline"
                value={chart}
                size="md"
                bg="#30A0E0"
                color="black"
                border="2px solid black"
                borderRadius="0.5rem"
                onChange={(e) => setchart(e.target.value)}
                _hover={{ borderColor: "black" }}
                width={{ base: "100%", md: "auto" }}
              >
                <option value="category">Category</option>
                <option value="status">Status</option>
              </Select>
            </Flex>
          </Flex>

          <Box width="100%" pt={1}>
            <Area {...config} />
          </Box>

          <Box mt={3}>
            <DateTime />
          </Box>
        </Box>
      </Box>
    )}
  </>
);

};

export default AllChart;
