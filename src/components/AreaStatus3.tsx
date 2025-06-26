import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import {
  Flex,
  Heading,
  Button,
  Box,
  useColorModeValue,
  Spinner,
  ButtonGroup,
} from "@chakra-ui/react";
import { useWindowSize } from "react-use";
import DateTime from "@/components/DateTime";
import { motion } from "framer-motion";
import axios from "axios";

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

interface EIP {
  status: string;
  eips: {
    status: string;
    month: number;
    year: number;
    date: string;
    count: number;
    category: string;
    eips: any[];
  }[];
}

function getMonthName(month: number): string {
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  return months[month - 1];
}

const StackedColumnChart: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<EIP[]>([]);
  const [viewMode, setViewMode] = useState<"status" | "category">("status");

  const windowSize = useWindowSize();
  const bg = useColorModeValue("#f6f6f7", "#171923");

  const status1 = "Draft";
  const status2 = "Final";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/new/graphsv2`);
        const jsonData = await response.json();
        setData(jsonData.eip?.concat(jsonData.erc?.concat(jsonData.rip)));
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const removeDuplicatesFromEips = (eips: any[]) => {
    const seen = new Set();
    return eips?.filter((eip) => {
      if (!seen.has(eip.eip)) {
        seen.add(eip.eip);
        return true;
      }
      return false;
    });
  };

  const getTransformedData = () => {
    const filteredData = data?.filter(
      (item) => item.status === status1 || item.status === status2
    );
    return filteredData.flatMap((item) => {
      return item.eips?.map((eip) => ({
        status: item.status,
        category: getCat(eip.category),
        year: `${getMonthName(eip.month)} ${eip.year}`,
        value: removeDuplicatesFromEips(eip.eips)?.length,
      }));
    });
  };

  const transformedData = getTransformedData();

  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];

  const sortedData = [...transformedData].sort((a, b) => {
    const [aMonth, aYear] = a.year.split(" ");
    const [bMonth, bYear] = b.year.split(" ");
    return (
      parseInt(aYear, 10) - parseInt(bYear, 10) ||
      months.indexOf(aMonth) - months.indexOf(bMonth)
    );
  });

  const getChartData = () => {
    if (viewMode === "status") {
      const result: { [key: string]: any } = {};
      for (const item of sortedData) {
        const key = `${item.status}-${item.year}`;
        if (result[key]) {
          result[key].value += item.value;
        } else {
          result[key] = {
            status: item.status,
            year: item.year,
            value: item.value,
          };
        }
      }
      return Object.values(result);
    } else {
      return sortedData.map((item) => ({
        year: item.year,
        status: item.status,
        category: item.category,
        value: item.value,
      }));
    }
  };

  const chartData = getChartData();

  const config = {
  data: chartData,
  xField: "year",
  yField: "value",
  seriesField: viewMode === "category" ? "category" : "status",
  groupField: viewMode === "category" ? "status" : undefined,
  isGroup: viewMode === "category",
  isStack: viewMode === "category",
  slider: { start: 0, end: 1 },
  legend: { position: "top-right" as const },
  tooltip:
  viewMode === "category"
    ? {
        customContent: (title: string, items: any[]) => {
          if (!items || items.length === 0) return "";

          const statusCounts: Record<string, number> = {};
          const categoryStatusCounts: Record<string, number> = {};
          const colorMap: Record<string, string> = {};

          items.forEach((item: any) => {
            const { status, category, value } = item.data;
            statusCounts[status] = (statusCounts[status] || 0) + value;
            const key = `${category} (${status})`;
            categoryStatusCounts[key] = (categoryStatusCounts[key] || 0) + value;
            colorMap[key] = item.color;
          });

          return `
            <div style="padding: 8px 12px; font-size: 14px">
              <div style="font-weight: 600; margin-bottom: 6px;">${title}</div>
              <div style="margin-bottom: 8px;">
                ${Object.entries(statusCounts)
                  .map(([status, count]) => `<div><strong>${status}</strong>: ${count}</div>`)
                  .join("")}
              </div>
              <div>
                ${Object.entries(categoryStatusCounts)
                  .map(
                    ([key, count]) => `
                  <div style="display:flex;align-items:center;margin-top:2px">
                    <span style="width:8px;height:8px;border-radius:50%;background:${colorMap[key]};display:inline-block;margin-right:6px;"></span>
                    ${key}: ${count}
                  </div>
                `
                  )
                  .join("")}
              </div>
            </div>
          `;
        },
      }
    : {
        shared: true,
    },
};


  const downloadData = () => {
    const filteredData = data?.filter(
      (item) => item.status === status1 || item.status === status2
    );
    const transformedData = filteredData.flatMap((item) =>
      item.eips.flatMap((eip) => {
        const category = getCat(eip.category);
        const year = eip.year.toString();
        const month = getMonthName(eip.month);
        const uniqueEips = removeDuplicatesFromEips(eip.eips);
        return uniqueEips?.map(({ eip }) => ({
          status: item.status,
          category,
          year,
          month,
          eip,
        }));
      })
    );

    const header = "Status,Category,Year,Month,EIP\n";
    const csvContent =
      "data:text/csv;charset=utf-8," +
      header +
      transformedData
        .map(({ status, category, year, month, eip }) =>
          `${status},${category},${year},${month},${eip}`
        )
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `DraftvsFinal.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const Column = dynamic(() => import("@ant-design/plots").then((item) => item.Column), { ssr: false });
  const Line = dynamic(() => import("@ant-design/plots").then((item) => item.Line), { ssr: false });


  const headingColor = useColorModeValue("black", "white");

  return (
    <>
      {isLoading ? (
        <Box display="flex" justifyContent="center" alignItems="center" className="h-full">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Spinner />
          </motion.div>
        </Box>
      ) : (
        <Box bgColor={bg} padding={"2rem"} borderRadius={"0.55rem"}>
          <Flex justifyContent="space-between" alignItems="center" marginBottom="0.5rem" wrap="wrap" gap="1rem">
            <ButtonGroup size="sm" isAttached variant="outline">
              <Button
                colorScheme={viewMode === "status" ? "blue" : undefined}
                onClick={() => setViewMode("status")}
              >
                Status View
              </Button>
              <Button
                colorScheme={viewMode === "category" ? "blue" : undefined}
                onClick={() => setViewMode("category")}
              >
                Category View
              </Button>
            </ButtonGroup>
            <Button
              colorScheme="blue"
              onClick={async () => {
                try {
                  downloadData();
                  await axios.post("/api/DownloadCounter");
                } catch (error) {
                  console.error("Error triggering download counter:", error);
                }
              }}
            >
              Download CSV
            </Button>
          </Flex>
          {viewMode === "status" ? <Line {...config} /> : <Column {...config} />}
          <Box className="w-full">
            <DateTime />
          </Box>
        </Box>
      )}
    </>
  );
};

export default StackedColumnChart;
