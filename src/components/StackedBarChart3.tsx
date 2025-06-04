import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Box, useColorModeValue, Spinner, Flex, Heading, Button } from "@chakra-ui/react";
import { useWindowSize } from "react-use";
import { motion } from "framer-motion";
import DateTime from "@/components/DateTime";
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
    case "ERC":
      return "ERCs";
    case "RIP":
      return "RIPs";
    case "Networking":
      return "Networking";
    case "Interface":
      return "Interface";
    case "Meta":
      return "Meta";
    case "Informational":
      return "Informational";
    case "RRC":
      return "RRCs";
    default:
      return "Core";
  }
};

interface AreaProps {
  data: MappedDataItem[];
  xField: string;
  yField: string;
  color: string[];
  seriesField: string;
  xAxis: {
    range: number[];
    tickCount: number;
  };
  areaStyle: {
    fillOpacity: number;
  };
  legend: {
    position: string;
  };
  smooth: boolean;
}

interface MappedDataItem {
  category: string;
  date: string;
  value: number;
}

interface EIP2 {
  _id: string;
  eip: string;
  title: string;
  author: string;
  status: string;
  type: string;
  category: string;
  created: string;
  discussion: string;
  deadline: string;
  requires: string;
  unique_ID: number;
  __v: number;
  repo: string;
}

interface EIP {
  status: string;
  eips: {
    status: string;
    month: number;
    year: number;
    date: string;
    count: number;
    category: string;
    eips: EIP2[];
  }[];
}

interface FormattedEIP {
  category: string;
  date: string;
  value: number;
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
const categoryBorder: string[] = [
  "rgba(255, 99, 132, 0.2)",
  "rgba(255, 159, 64, 0.2)",
  "rgba(255, 205, 86, 0.2)",
  "rgba(75, 192, 192, 0.2)",
  "rgba(54, 162, 235, 0.2)",
  "rgba(153, 102, 255, 0.2)",
  "rgba(255, 99, 255, 0.2)",
  "rgba(50, 205, 50, 0.2)",
  "rgba(255, 0, 0, 0.2)",
  "rgba(0, 128, 0, 0.2)",
];

interface AreaCProps {
  dataset: APIResponse;
  status: string;
  type: string;
}
interface APIResponse {
  eip: EIP[];
  erc: EIP[];
  rip: EIP[];
}

const StackedColumnChart: React.FC<AreaCProps> = ({ dataset, status, type }) => {
  const [data, setData] = useState<APIResponse>();
  const windowSize = useWindowSize();
  const bg = useColorModeValue("#f6f6f7", "#171923");
  const [isLoading, setIsLoading] = useState(true);
  const [fromYear, setFromYear] = useState<string>("");
  const [toYear, setToYear] = useState<string>("");

  console.log(dataset);
  console.log(status);
  console.log(type);

  const [typeData, setTypeData] = useState<EIP[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const jsonData = dataset;
        setData(jsonData);
        if (type === "EIPs" && jsonData.eip) {
          setTypeData(
            jsonData.eip?.filter((item: any) => item.category !== "ERCs")
          );
          console.log(jsonData.eip?.filter((item: any) => item.category !== "ERCs"));
        } else if (type === "ERCs" && jsonData.erc) {
          setTypeData(jsonData.erc);
        }
        else if (type === "RIPs" && jsonData.rip) {

          setTypeData(jsonData.rip);
          console.log(" test erc data:", jsonData.rip)
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [dataset]);

  useEffect(() => {
    if (type === "EIPs") {
      setTypeData(data?.eip || []);
    } else if (type === "ERCs") {
      setTypeData(data?.erc || []);
      console.log(" test erc data3:", data?.erc)
    } else if (type === "RIPs") {
      setTypeData(data?.rip || []);
      console.log(" test rip data2:", data?.rip)
    }
  });

  const [isChartReady, setIsChartReady] = useState(false);

  useEffect(() => {
    setIsChartReady(true);
  }, []);

  const filteredData = typeData?.filter((item) => item.status === status);
  console.log(data);
  console.log(typeData)
  console.log(filteredData)

  const transformedData = filteredData
    .flatMap((item) =>
      item.eips?.map((eip) => ({
        category: getCat(eip.category),
        year: eip.year.toString(),
        value: eip.count,
      }))
    )
  // .filter((item) => item.category !== "ERCs");
  console.log(transformedData);

  const Area = dynamic(
    () => import("@ant-design/plots").then((item) => item.Column),
    {
      ssr: false,
    }
  );

  const chartWidth = windowSize.width
    ? Math.min(windowSize.width * 0.6, 500)
    : "100%";
  const chartHeight = windowSize.height
    ? Math.min(windowSize.height * 0.6, 500)
    : "100%";

  const config = {
    data: transformedData,
    xField: "year",
    yField: "value",
    color: categoryColors,
    seriesField: "category",
    isStack: true,
    areaStyle: { fillOpacity: 0.6 },
    legend: { position: "top-right" as const },
    smooth: true,
    label: {
      position: "middle",
      style: {
        fill: "#FFFFFF",
        opacity: 0.6,
      },
    } as any,
  };

  const headingColor = useColorModeValue('black', 'white');
  const downloadData = () => {
    const filtered = filteredData.filter((item) =>
      item.eips.some((eipGroup) => {
        const year = eipGroup.year;
        const from = fromYear ? parseInt(fromYear) : -Infinity;
        const to = toYear ? parseInt(toYear) : Infinity;
        return year >= from && year <= to;
      })
    );

    const transformedData = filtered.flatMap((item) =>
      item.eips.flatMap((eipGroup) => {
        if (
          (fromYear && eipGroup.year < parseInt(fromYear)) ||
          (toYear && eipGroup.year > parseInt(toYear))
        )
          return [];

        return eipGroup.eips.map((eip) => ({
          month: eipGroup.month,
          year: eipGroup.year,
          category: eipGroup.category,
          eip: eip.eip,
          title: eip.title,
          status: eip.status,
          type: eip.type,
          discussion: eip.discussion,
          repo: eip.repo,
          author: eip.author,
          created: eip.created,
          deadline: eip.deadline || "",
        }));
      })
    );

    if (!transformedData.length) {
      alert("No data available for selected year range.");
      return;
    }

    // [continue with existing CSV generation logic...]
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
        <Box bgColor={bg} padding={"2rem"} borderRadius={"0.55rem"}>
          {/* Add Heading here */}
          <Heading size="md" color={headingColor} mb={4}>
            {type} {status === "All" ? "" : `- ${status}`} Over Time
          </Heading>
          <Flex gap={4} mb={4} align="center" wrap="wrap">
            <Box>
              <label style={{ color: headingColor }}>From Year: </label>
              <select
                value={fromYear}
                onChange={(e) => setFromYear(e.target.value)}
                style={{ padding: "0.5rem", borderRadius: "4px" }}
              >
                <option value="">All</option>
                {Array.from(new Set(transformedData.map(d => d.year)))
                  .sort()
                  .map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
              </select>
            </Box>

            <Box>
              <label style={{ color: headingColor }}>To Year: </label>
              <select
                value={toYear}
                onChange={(e) => setToYear(e.target.value)}
                style={{ padding: "0.5rem", borderRadius: "4px" }}
              >
                <option value="">All</option>
                {Array.from(new Set(transformedData.map(d => d.year)))
                  .sort()
                  .map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
              </select>
            </Box>

            <Button onClick={downloadData} colorScheme="blue">
              Download CSV
            </Button>
          </Flex>


          <Box overflowX="auto">
            <Area {...config} />
          </Box>

          <Box className={"w-full"} overflowX="auto">
            <DateTime />
          </Box>
        </Box>

      )}
    </>
  );
};

export default StackedColumnChart;
