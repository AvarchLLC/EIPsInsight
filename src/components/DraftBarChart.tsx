import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Flex, Button, Heading,Box, useColorModeValue, Spinner } from "@chakra-ui/react";
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

function getMonthName(month: number): string {
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
  return months[month - 1];
}

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

interface EIP {
  status: string;
  eips: {
    status: string;
    repo:string;
    month: number;
    year: number;
    date: string;
    count: number;
    category: string;
    eips:EIP2[];
  }[];
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
interface APIResponse {
  eip: EIP[];
  erc: EIP[];
  rip: EIP[];
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

  const transformedData = filteredData.flatMap((item) => {
    console.log(item); // Log each item
    return item.eips.map((eip) => ({
      category: getCat(eip.category),
      year: `${getMonthName(eip.month)} ${eip.year.toString()}`,
      value:removeDuplicatesFromEips(eip.eips).length
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
  
  categories.forEach((category) => {
    const hasCategory = transformedData.some((entry) => entry.category === category);
  
    if (!hasCategory) {
      transformedData.push({
        category: category,
        year: "2024", 
        value: 0,     
      });
    }
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
    isGroup: true,
    columnStyle: {
      radius: [20, 20, 0, 0],
    },
    areaStyle: { fillOpacity: 0.6 },
    slider: {
      start: 0,
      end: 1,
    },
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

  const downloadData = () => {
    // Filter data based on the selected status
    let filteredData = dataset.slice(1).concat(dataset[0]);

    console.log("new filtered data:",filteredData)

    
    // Transform the filtered data to get the necessary details
    const transformedData = filteredData.flatMap((item) => {
      return item.eips.flatMap((eipGroup) => {
        const category = getCat(eipGroup.category); // Assuming this function returns a string
        const year = eipGroup.date.split("-")[0]; // Extract year from date
        const uniqueEips = removeDuplicatesFromEips(eipGroup.eips); // Deduplicate EIPs if needed
        const repo =  eipGroup.repo;
        const month = eipGroup.month;

    
        return uniqueEips.map((uniqueEip) => ({
          category,
          year,
          month,
          eip: uniqueEip.eip, // EIP number
          author: uniqueEip.author, // Author of the EIP
          repo,
          discussion: uniqueEip.discussion, // Discussion link
          status: uniqueEip.status, // Status of the EIP
          created: uniqueEip.created, // Creation date
          deadline: uniqueEip.deadline === "undefined" ? "" : uniqueEip.deadline || "", // Deadline if exists, else empty
          type: uniqueEip.type, // Type of the EIP
          title: uniqueEip.title, // Title of the EIP
        }));
      });
    });
    


  if (!transformedData.length) {
      console.error("Transformed data is empty.");
      alert("No transformed data available for download.");
      return;
  }

  // Define the CSV header
  const header = " Year, Month, Repo, EIP, Title, Author, Status, deadline, Type, Category, Created at, Link\n";

  // Prepare the CSV content
  const csvContent =
      "data:text/csv;charset=utf-8," + 
      header +
      transformedData
          .map(({ year, month, repo, eip, title, author, discussion, status, type, category, created, deadline }) => {
              // Generate the correct URL based on the repo type
              const url = repo === "erc"
              ? `https://eipsinsight.com/ercs/erc-${eip}`
              : repo === "rip"
              ? `https://eipsinsight.com/rips/rip-${eip}`
              : `https://eipsinsight.com/eips/eip-${eip}`;
            
                      

              // Handle the 'deadline' field, use empty string if not available
              const deadlineValue = deadline ?? "";

              const baseFields = [
                year,
                month,
                repo,
                eip,
                title.replace(/"/g, '""'),
                author.replace(/"/g, '""'),
                status.replace(/"/g, '""'),
                type.replace(/"/g, '""'),
                category.replace(/"/g, '""'),
                created.replace(/"/g, '""'),
                url
            ];

            // Include deadline only if status is "Last Call"
            if (status === "Last Call") {
                baseFields.splice(7, 0, deadline ?? ""); // Insert deadline at the correct position
            }

            // Wrap fields in double quotes and join with commas
            return baseFields.map(field => `"${field}"`).join(",");
          })
          .join("\n");
  
    // Check the generated CSV content before download
    // console.log("CSV Content:", csvContent);
  
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
      downloadData();

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
