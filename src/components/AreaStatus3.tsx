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
  Select,
  HStack,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import { useWindowSize } from "react-use";
import DateTime from "@/components/DateTime";
import { motion } from "framer-motion";
import axios from "axios";
import { InfoOutlineIcon } from "@chakra-ui/icons";

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
  const [startYear, setStartYear] = useState<number>(2015);
  const [startMonth, setStartMonth] = useState<number>(1);
  const [endYear, setEndYear] = useState<number>(new Date().getFullYear());
  const [endMonth, setEndMonth] = useState<number>(new Date().getMonth() + 1);
  const [allYears, setAllYears] = useState<number[]>([]);

  const windowSize = useWindowSize();
  const bg = useColorModeValue("#f6f6f7", "#171923");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const headingColor = useColorModeValue("gray.800", "white");

  const status1 = "Draft";
  const status2 = "Final";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/new/graphsv2`);
        const jsonData = await response.json();
        const combinedData = jsonData.eip?.concat(jsonData.erc?.concat(jsonData.rip));
        setData(combinedData);
        
        // Extract all unique years from the data
        const years = new Set<number>();
        combinedData?.forEach((item: EIP) => {
          item.eips?.forEach((eip) => {
            years.add(eip.year);
          });
        });
        const sortedYears = Array.from(years).sort((a, b) => a - b);
        setAllYears(sortedYears);
        
        // Set default start and end years based on data
        if (sortedYears.length > 0) {
          setStartYear(sortedYears[0]);
          setEndYear(sortedYears[sortedYears.length - 1]);
        }
        
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
      return item.eips?.filter(eip => {
        // Filter based on selected date range
        const eipDate = new Date(eip.year, eip.month - 1);
        const startDate = new Date(startYear, startMonth - 1);
        const endDate = new Date(endYear, endMonth - 1);
        return eipDate >= startDate && eipDate <= endDate;
      }).map((eip) => ({
        status: item.status,
        category: getCat(eip.category),
        year: `${getMonthName(eip.month)} ${eip.year}`,
        value: removeDuplicatesFromEips(eip.eips)?.length,
        rawMonth: eip.month,
        rawYear: eip.year,
      }));
    });
  };

  const transformedData = getTransformedData();

  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];

  const sortedData = [...transformedData].sort((a, b) => {
    if (a.rawYear !== b.rawYear) {
      return a.rawYear - b.rawYear;
    }
    return a.rawMonth - b.rawMonth;
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
//     label: {
//   content: (data: any) => `${data.status}`,
//   position: "top",
//   style: {
//     fill: "#000", // Use "#fff" if in dark mode
//     fontWeight: 600,
//     fontSize: 12,
//   },
// },

    tooltip:
      viewMode === "category"
        ? {
          customContent: (title: string, items: any[]) => {
  if (!items || items.length === 0) return "";

  const grouped: Record<string, { category: string; value: number; color: string }[]> = {};

  items.forEach((item: any) => {
    const { status, category, value } = item.data;
    if (!grouped[status]) grouped[status] = [];
    grouped[status].push({ category, value, color: item.color });
  });

  return `
    <div style="padding: 8px 12px; font-size: 14px">
      <div style="font-weight: 600; margin-bottom: 6px;">${title}</div>
      ${Object.entries(grouped)
        .map(([status, entries]) => {
          const total = entries.reduce((sum, e) => sum + e.value, 0);
          return `
            <div style="margin-top: 8px;">
              <div><strong>${status}</strong>: ${total}</div>
              ${entries
                .map(
                  (e) => `
                <div style="display:flex;align-items:center;margin-left:10px;margin-top:2px">
                  <span style="width:8px;height:8px;border-radius:50%;background:${e.color};display:inline-block;margin-right:6px;"></span>
                  ${e.category}: ${e.value}
                </div>
              `
                )
                .join("")}
            </div>
          `;
        })
        .join("")}
    </div>
  `;
}
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

  const handleStartYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const year = parseInt(e.target.value);
    setStartYear(year);
    
    // If start year becomes greater than end year, update end year
    if (year > endYear) {
      setEndYear(year);
    }
    
    // If same year and start month > end month, update end month
    if (year === endYear && startMonth > endMonth) {
      setEndMonth(startMonth);
    }
  };

  const handleEndYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const year = parseInt(e.target.value);
    setEndYear(year);
    
    // If end year becomes less than start year, update start year
    if (year < startYear) {
      setStartYear(year);
    }
    
    // If same year and end month < start month, update start month
    if (year === startYear && endMonth < startMonth) {
      setStartMonth(endMonth);
    }
  };

  const handleStartMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const month = parseInt(e.target.value);
    setStartMonth(month);
    
    // If same year and start month > end month, update end month
    if (startYear === endYear && month > endMonth) {
      setEndMonth(month);
    }
  };

  const handleEndMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const month = parseInt(e.target.value);
    setEndMonth(month);
    
    // If same year and end month < start month, update start month
    if (startYear === endYear && month < startMonth) {
      setStartMonth(month);
    }
  };

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
        <Box bgColor={bg} padding={"2rem"} borderRadius={"0.55rem"} border="1px solid" borderColor={borderColor}>
          <Flex justifyContent="space-between" alignItems="center" marginBottom="1rem" wrap="wrap" gap="1rem">
            <Box>
              
              <HStack spacing={4} mt={2} wrap="wrap">
                <Box>
                  <Text fontSize="sm" mb={1}>Start Date</Text>
                  <HStack>
                    <Select 
                      value={startMonth} 
                      onChange={handleStartMonthChange}
                      size="sm"
                      width="100px"
                    >
                      {months.map((_, index) => (
                        <option key={index + 1} value={index + 1}>
                          {months[index]}
                        </option>
                      ))}
                    </Select>
                    <Select 
                      value={startYear} 
                      onChange={handleStartYearChange}
                      size="sm"
                      width="90px"
                    >
                      {allYears.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </Select>
                  </HStack>
                </Box>
                
                <Box>
                  <Text fontSize="sm" mb={1}>End Date</Text>
                  <HStack>
                    <Select 
                      value={endMonth} 
                      onChange={handleEndMonthChange}
                      size="sm"
                      width="100px"
                    >
                      {months.map((_, index) => (
                        <option key={index + 1} value={index + 1}>
                          {months[index]}
                        </option>
                      ))}
                    </Select>
                    <Select 
                      value={endYear} 
                      onChange={handleEndYearChange}
                      size="sm"
                      width="90px"
                    >
                      {allYears.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </Select>
                  </HStack>
                </Box>
              </HStack>
            </Box>
            
            <Flex direction="row" gap={2}>
              <ButtonGroup size="sm" isAttached variant="outline">
                <Button
                  colorScheme="blue"
                  variant={viewMode === "status" ? "solid" : "outline"}
                  onClick={() => setViewMode("status")}
                >
                  Status View
                </Button>
                <Button
                  colorScheme="blue"
                  variant={viewMode === "category" ? "solid" : "outline"}
                  onClick={() => setViewMode("category")}
                >
                  Category View
                </Button>
              </ButtonGroup>

              
              <Button
                colorScheme="blue"
                size="sm"
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
          </Flex>
          
          {chartData.length > 0 ? (
            viewMode === "status" ? <Line {...config} /> : <Column {...config} />
          ) : (
            <Box textAlign="center" py={10}>
              <Text>No data available for the selected date range.</Text>
            </Box>
          )}
          
          <Box className="w-full" mt={4}>
            <DateTime />
          </Box>
        </Box>
      )}
    </>
  );
};

export default StackedColumnChart;