import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Box, useColorModeValue, Spinner, Flex, Heading, Button } from "@chakra-ui/react";
import { useWindowSize } from "react-use";
import DateTime from "@/components/DateTime";
import { motion } from "framer-motion";
import axios from "axios";

const getCat = (cat: string) => {
  switch (cat) {
    case "Standards Track" ||
      "Standard Track" ||
      "Standards Track (Core, Networking, Interface, ERC)" ||
      "Standard" ||
      "Process" ||
      "Core" ||
      "core":
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



const categoryColors: string[] = [
  "rgb(255, 99, 132)",
  "rgb(255, 159, 64)",
  "rgb(255, 205, 86)",
  "rgb(75, 192, 192)",
  "rgb(54, 162, 235)",
  "rgb(153, 102, 255)",
  "rgb(255, 99, 255)",
  "rgb(50, 205, 50)",
  "rgb(255, 255,255)",
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
  dataset: EIP[];
  status:string;
}

const StackedColumnChart: React.FC<AreaCProps> = ({ dataset, status }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<EIP[]>([]);
  const windowSize = useWindowSize();
  const bg = useColorModeValue("#f6f6f7", "#171923");



  const [isChartReady, setIsChartReady] = useState(false);

  useEffect(() => {
    setData(dataset);
    setIsChartReady(true);
    setIsLoading(false);
  }, []);
  
  const removeDuplicatesFromEips = (eips: any[]) => {
    const seen = new Set();
    
    return eips.filter((eip) => {
      if (!seen.has(eip.eip)) {
        seen.add(eip.eip); // Track seen eip numbers
        return true;
      }
      return false; // Filter out duplicates
    });
  };
  
  let filteredData = dataset;
  console.log("filtered data:", filteredData);

  const transformedData = filteredData.flatMap((item) => {
    console.log(item); // Log each item
    return item.eips.map((eip) => ({
      category: getCat(eip.category),
      year: ` ${eip.year.toString()}`,
      value:removeDuplicatesFromEips(eip.eips).length,
      eips: removeDuplicatesFromEips(eip.eips)
    }));
  });
  
  const categories = [
    "Core",
    "Networking",
    "Interface",
    "Meta",
    "Informational",
    "ERCs",
    "RIPs",
  ];
  
  const uniqueYears = [...new Set(transformedData.map((entry) => entry.year))];

categories.forEach((category) => {
  uniqueYears.forEach((year) => {
    const hasCategoryForYear = transformedData.some(
      (entry) => entry.category === category && entry.year === year
    );

    if (!hasCategoryForYear) {
      transformedData.push({
        category: category,
        year: year,
        value: 0,
        eips:[]
      });
    }
  });
});

  

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  transformedData.sort((a, b) => {
    const [aMonth, aYear] = a.year.split(" ");
    const [bMonth, bYear] = b.year.split(" ");

    if (aYear !== bYear) {
      return parseInt(aYear, 10) - parseInt(bYear, 10);
    }
    return months.indexOf(aMonth) - months.indexOf(bMonth);
  });

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
    // columnStyle: {
    //   radius: [20, 20, 0, 0],
    // },
    areaStyle: { fillOpacity: 0.6 },
    // slider: {
    //   start: 0,
    //   end: 1,
    // },
    legend: { position: "top-right" as const },
    smooth: true,
    
  };

  const downloadData = () => {
    // Filter data based on the selected status
    let filteredData = dataset;
    
    // Transform the filtered data to get the necessary details
    const transformedData = filteredData.flatMap((item) => {
        return item.eips.flatMap((eip) => {
            const category = getCat(eip.category); // Assuming this function returns a string
            const year = eip.year.toString(); // Convert year to string
            const uniqueEips = removeDuplicatesFromEips(eip.eips); // Assuming this returns an array of EIPs
            return uniqueEips.map(({ eip }) => ({
                category,
                year,
                eip, // Individual EIP
            }));
        });
    });

    // Define the CSV header
    const header = "Category,Year,EIPs\n";
  
    // Prepare the CSV content
    const csvContent = "data:text/csv;charset=utf-8,"
        + header
        + transformedData.map(({ category, year, eip }) => {
            return `${category},${year},${eip}`; // Each EIP on a separate line
        }).join("\n");
  
    // Check the generated CSV content before download
    console.log("CSV Content:", csvContent);
  
    // Encode the CSV content for downloading
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${status}.csv`); // Name your CSV file here
    document.body.appendChild(link); // Required for Firefox
    link.click();
    document.body.removeChild(link);
};

const headingColor = useColorModeValue('black', 'white');
  
  

  return (
    <>
      {isLoading ? (
        <>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            className="h-full"
          >
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Your loader component */}
              <Spinner />
            </motion.div>
          </Box>
        </>
      ) : (
        <Box bgColor={bg} padding={"2rem"} borderRadius={"0.55rem"}>
          <Flex justifyContent="space-between" alignItems="center" marginBottom="0.5rem">
          <Heading size="md" color={headingColor}>
            {`${status}`}
          </Heading>
          {/* Assuming a download option exists for the yearly data as well */}
          <Button colorScheme="blue" onClick={async () => {
    try {
      // Trigger the CSV conversion and download
      downloadData;

      // Trigger the API call
      await axios.post("/api/DownloadCounter");
    } catch (error) {
      console.error("Error triggering download counter:", error);
    }
  }}>Download CSV</Button>
        </Flex>
          <Area {...config} />
          <Box className={"w-full"}>
            <DateTime />
          </Box>
        </Box>
      )}
    </>
  );
};

export default StackedColumnChart;
