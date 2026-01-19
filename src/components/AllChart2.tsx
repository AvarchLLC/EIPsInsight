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

const categoryColors: string[] = [
  "rgb(255, 99, 132)", //meta
  "rgb(255, 159, 64)", //core
  "rgb(255, 205, 86)", //interface
  "rgb(75, 192, 192)", //networking
  "rgb(54, 162, 235)", //informational
  "rgb(153, 102, 255)", //ercs
  "rgb(255, 99, 255)", //rips
  "rgb(50, 205, 50)",
  "rgb(255, 0, 0)",
  "rgb(0, 128, 0)",
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

    allBuckets.forEach((bucket) => {
      const year = bucket.year;
      const repo = bucket.repo;

      bucket.statusChanges.forEach((sc) => {
        rows.push({
          Year: year,
          Repo: repo.toUpperCase(),
          EIP: sc.eip,
          Title: sc.eipTitle,
          Category: sc.eipCategory,
          Final_Status: sc.lastStatus,
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

  const config = {
    data: transformedData3,
    xField: "year",
    yField: "value",
    tooltip: {
      formatter: (datum: any) => {
        return {
          name: `${datum.category} (${datum.year})`,
          value: datum.value,
        };
      },
    },
    interactions: [{ type: "element-selected" }, { type: "element-active" }],
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
    },
    color: categoryColors,
    seriesField: "category",
    isStack: true,
    areaStyle: { fillOpacity: 0.6 },
    legend: { position: "top-right" as const },
    smooth: true,
    // label: {
    //   position: "middle",
    //   style: {
    //     fill: "#FFFFFF",
    //     opacity: 0.6,
    //   },
    // } as any,
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
        border="3px solid"
        borderColor="#30A0E0"
        boxShadow="lg"
        transition="all 0.3s"
        _hover={{
          borderColor: "#30A0E0",
          boxShadow: "xl",
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
              >
                <Button
                  size="sm"
                  colorScheme="blue"
                  variant="solid"
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
