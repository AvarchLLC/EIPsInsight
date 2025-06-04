import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Box, useColorModeValue, Spinner, Text, Select, Flex, Link } from "@chakra-ui/react";
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
  "rgb(255, 99, 132)",
  "rgb(255, 159, 64)",
  "rgb(255, 205, 86)",
  "rgb(75, 192, 192)",
  "rgb(54, 162, 235)",
  "rgb(153, 102, 255)",
  "rgb(255, 99, 255)",
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
        if (type === "EIP") {
          setData(dataset.eip);
        } else if (type === "ERC") {
          setData(dataset.erc);
        } else if (type === "RIP") {
          setData(dataset.rip);
        } else if (type === "Total") {
          setData(dataset.eip?.concat(dataset.erc?.concat(dataset.rip)));
        } else {
          setData(dataset.eip?.concat(dataset.erc?.concat(dataset.rip)));
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

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

  const transformedData = data.reduce<TransformedData[]>((acc, item) => {
    const year = new Date(item.created).getFullYear();
    const category = item.repo === 'rip' ? 'RIPs' : getCat(item.category);

    // Check if a record for the same category and year already exists
    const existingEntry = acc.find((entry) => entry.year === year && entry.category === category);

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

  const transformedData2 = data?.reduce<TransformedData[]>((acc, item) => {
    const year = new Date(item.created).getFullYear();
    const status = getStatus(item.status);

    // Check if a record for the same category and year already exists
    const existingEntry = acc.find((entry) => entry.year === year && entry.category === status);

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

  const transformedData3 = chart === "status" ? transformedData2 : transformedData;

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
      {isLoading ? ( // Show loader while data is loading
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="200px"
        >
          <Spinner />
        </Box>
      ) : (
        <>
          <Box
            bgColor={bg}
            paddingX="0.5rem"
            borderRadius="0.55rem"
            _hover={{
              border: "1px",
              borderColor: "#30A0E0",
            }}
          >

            <Box
              width={"100%"}       // Make the container full width
              minWidth={"100px"}  // Set a minimum width
              height={400}
              overflowX="auto"     // Enable horizontal scrolling if necessary
              overflowY="hidden"
              as={motion.div}
              padding={"2 rem"}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            // transition={{ duration: 0.5 }}
            >
              <Flex justify="space-between" align="center">
                {/* Label and Dropdown in the same row */}
                <Box>
                  <Link href="/alltable">
                    <Text
                      fontSize="2xl"
                      fontWeight="bold"
                      color="#30A0E0"
                      cursor="pointer" // Optional: To indicate it's clickable
                      _hover={{ textDecoration: 'underline' }} // Optional: Adds hover effect
                    >
                      {type === 'Total' ? `All EIPs [${data.length}]` : `${type} - [${data.length}]`}
                    </Text>
                  </Link>
                </Box>

                {/* Dropdown aligned to the right */}
                <Box>
                  {/* <Select
  value={chart}
  onChange={(e) => setchart(e.target.value)}
  mt={1}
  mb={4}
  width="auto"
  backgroundColor="#30A0E0"
  color="black"
  _focus={{
    borderColor: "#30A0E0",
    outline: "none",
  }}
  border="1px solid #30A0E0"
  icon={<ChevronDownIcon />}  // Explicitly using a Chevron icon for better visibility
  // _icon={{
  //   color: "white",  // Make sure the arrow color matches the theme
  // }}
> */}

                  <Select
                    variant="outline"
                    // placeholder="Select Year"
                    value={chart}
                    mt={1}
                    // mb={2}
                    backgroundColor="#30A0E0"
                    color="black"
                    onChange={(e) => setchart(e.target.value)}
                    className="border border-gray-300 rounded px-7 py-2 focus:outline-none focus:border-blue-500"
                    size="md"
                  >
                    <option value="category">Category</option>
                    <option value="status">Status</option>
                  </Select>
                </Box>
              </Flex>
              <Area {...config} />
              <Box className={"w-full"}>
                <DateTime />
              </Box>
            </Box>

          </Box>
        </>
      )}
    </>
  );
};

export default AllChart;
