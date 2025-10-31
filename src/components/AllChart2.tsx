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
} from "@chakra-ui/react";
import { useWindowSize } from "react-use";
import { motion } from "framer-motion";
import DateTime from "@/components/DateTime";
import Dashboard from "./Dashboard";
import NextLink from "next/link";
import { ChevronDownIcon } from "@chakra-ui/icons";

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

interface EIP {
  _id: string;
  eip: string;
  title: string;
  author: string;
  status: string;
  type: string;
  category: string;
  created: Date;
  discussion: string;
  deadline: string;
  requires: string;
  repo: string;
  unique_ID: number;
  __v: number;
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
  eip: EIP[];
  erc: EIP[];
  rip: EIP[];
}

interface ChartProps {
  type: string;
  dataset: APIResponse;
}

const AllChart: React.FC<ChartProps> = ({ type, dataset }) => {
  const [data, setData] = useState<EIP[]>([]);
  const bg = useColorModeValue("#f6f6f7", "#171923");
  const [isLoading, setIsLoading] = useState(true);
  const [chart, setchart] = useState("category");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const eips = dataset?.eip ?? [];
        const ercs = dataset?.erc ?? [];
        const rips = dataset?.rip ?? [];

        if (type === "EIP") {
          setData(eips);
        } else if (type === "ERC") {
          setData(ercs);
        } else if (type === "RIP") {
          setData(rips);
        } else if (type === "Total") {
          setData([...eips, ...ercs, ...rips]);
        } else {
          setData([...eips, ...ercs, ...rips]);
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setData([]);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [type, dataset]);

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

  const transformedData = (data ?? []).reduce<TransformedData[]>((acc, item) => {
    const year = new Date(item.created).getFullYear();
    const category = item.repo === "rip" ? "RIPs" : getCat(item.category);

    // Check if a record for the same category and year already exists
    const existingEntry = acc.find(
      (entry) => entry.year === year && entry.category === category
    );

    if (existingEntry) {
      // If it exists, increment the value
      existingEntry.value += 1;
    } else {
      // Otherwise, create a new entry
      acc.push({
        category: category,
        year: year,
        value: 1,
      });
    }

    return acc;
  }, []);

  const transformedData2 = (data ?? []).reduce<TransformedData[]>((acc, item) => {
    const year = new Date(item.created).getFullYear();
    const status = getStatus(item.status);

    // Check if a record for the same category and year already exists
    const existingEntry = acc.find(
      (entry) => entry.year === year && entry.category === status
    );

    if (existingEntry) {
      // If it exists, increment the value
      existingEntry.value += 1;
    } else {
      // Otherwise, create a new entry
      acc.push({
        category: status,
        year: year,
        value: 1,
      });
    }

    return acc;
  }, []);

  const Area = dynamic(
    () => import("@ant-design/plots").then((item) => item.Column),
    {
      ssr: false,
    }
  );

  const transformedData3 =
    chart === "status" ? transformedData2 : transformedData;

  console.log(transformedData3);

  const config = {
    data: transformedData3,
    xField: "year",
    yField: "value",
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
                {type === "Total"
                  ? `All EIPs [${data.length}]`
                  : `${type} - [${data.length}]`}
              </Text>
            </Link>

            <Select
              variant="outline"
              value={chart}
              mt={{ base: 2, md: 0 }}
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
