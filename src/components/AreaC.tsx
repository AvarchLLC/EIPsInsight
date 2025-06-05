import {
  Box,
  Text,
  useColorModeValue,
  Select,
  Spinner,
  Button,
  Flex,
  Heading
} from "@chakra-ui/react";
import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import LoaderComponent from "./Loader";
import DateTime from "@/components/DateTime";
import NextLink from "next/link";
import axios from "axios";

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
  legend: any; // Adjust the type based on the actual props required by the library
  smooth: boolean;
}


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

const Area = dynamic(
  (): any => import("@ant-design/plots").then((item) => item.Area),
  {
    ssr: false,
  }
) as React.ComponentType<AreaProps>;

interface MappedDataItem {
  category: string;
  date: string;
  value: number;
}

interface GrpahsProps {
  eip: EIP[];
  erc: EIP[];
  rip: EIP[];
}

interface EIP {
  status: string;
  eips: {
    category: string;
    month: number;
    year: number;
    date: string;
    count: number;
    eips: EIP2[];
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

function getMonthName(month: number): string {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return months[month - 1];
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
  type: string;
}

const AreaC: React.FC<AreaCProps> = ({ type }) => {
  const [data, setData] = useState<GrpahsProps>(); // Set initial state as an empty array
  const [selectedStatus, setSelectedStatus] = useState("Draft"); // Set default select option as 'Final'
  const [isChartReady, setIsChartReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Add isLoading state

  const [data2, setData2] = useState<EIP2[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/new/all`);
        const jsonData = await response.json();
        if (type === "EIPs") {
          setData2(jsonData.eip);
        } else if (type === "ERCs") {
          setData2(jsonData.erc);
        } else if (type === "RIPs") {
          setData(jsonData.rip);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const [typeData, setTypeData] = useState<EIP[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/new/graphsv2`);
        const jsonData = await response.json();
        setData(jsonData);
        if (type === "EIPs" && jsonData.eip) {
          setTypeData(jsonData.eip);
        } else if (type === "ERCs" && jsonData.erc) {
          setTypeData(jsonData.erc);
        } else if (type === "RIPs" && jsonData.erc) {
          setTypeData(jsonData.rip);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (type === "EIPs") {
      setTypeData(data?.eip || []);
    } else if (type === "ERCs") {
      setTypeData(data?.erc || []);
    } else if (type === "RIPs") {
      setTypeData(data?.rip || []);
    }
  });

  useEffect(() => {
    setIsLoading(true); // Set isLoading to true before rendering chart
    setTimeout(() => {
      setIsLoading(false); // Set isLoading to false after a small delay (simulating chart rendering)
    }, 1000);
  }, [selectedStatus]);

  useEffect(() => {
    setIsChartReady(true);
  }, []); // Trigger initial render

  useEffect(() => {
    setIsChartReady(false); // Set chart ready state to false before re-rendering
    setTimeout(() => {
      setIsChartReady(true); // Trigger chart re-render after a small delay
    }, 100);
  }, [selectedStatus]);

  const handleChangeStatus = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStatus(event.target.value);
  };

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const formattedData = typeData
    ?.reduce((acc: FormattedEIP[], item: EIP) => {
      if (item.status === selectedStatus) {
        const formattedEIPs: FormattedEIP[] = item.eips?.map((eip) => ({
          category: getCat(eip.category),
          date: `${getMonthName(eip.month)} ${eip.year}`,
          value: eip.count,
        }));
        acc.push(...formattedEIPs);
      }
      return acc;
    }, [])
    .sort((a: any, b: any) => {
      const [aMonth, aYear] = a.date.split(" ");
      const [bMonth, bYear] = b.date.split(" ");

      if (aYear !== bYear) {
        return parseInt(aYear, 10) - parseInt(bYear, 10);
      }
      return months.indexOf(aMonth) - months.indexOf(bMonth);
    });

  let filteredData = formattedData?.filter(
    (item: any) => item.category !== "ERCs"
  );
  if (type === "ERCs") {
    filteredData = formattedData;
  } else if (type === "EIPs") {
    filteredData = formattedData?.filter(
      (item: any) => item.category !== "ERCs"
    );
  }

  const config = {
    data: filteredData,
    xField: "date",
    yField: "value",
    color: categoryColors,
    seriesField: "category",
    xAxis: {
      range: [0, 1],
      tickCount: 5,
    },
    areaStyle: { fillOpacity: 0.6 },
    legend: { position: "top-right" },
    smooth: true,
    slider: {
      start: 0,
      end: 1,
    },
  };

  const removeDuplicatesFromEips = (eips: EIP2[]) => {
    const seen = new Set();
    
    return eips?.filter((eip) => {
      if (!seen.has(eip.eip)) {
        seen.add(eip.eip); // Track seen eip numbers
        return true;
      }
      return false; // Filter out duplicates
    });
  };

  const bg = useColorModeValue("#f6f6f7", "#171923");

  const downloadData = () => {
    // Filter data based on the selected status
    const filteredData = typeData?.filter((item) => item.status === selectedStatus);

    if (!filteredData?.length) {
        console.error("No data available for the selected status.");
        alert("No data available for download.");
        return;
    }

    // Transform the filtered data to get the necessary details
    const transformedData = filteredData.flatMap((item) => {
      return item.eips.flatMap((eipGroup) => {
        const category = getCat(eipGroup.category); // Assuming this function returns a string
        const year = eipGroup.year.toString(); // Convert year to string
        const uniqueEips = removeDuplicatesFromEips(eipGroup.eips); // Assuming this returns an array of EIPs

            return uniqueEips?.map((eip) => ({
                category,
                year,
                eip: eip.eip, // EIP number
                author: eip.author, // Author of the EIP
                repo: eip.repo, // Repo type (e.g., "eip", "erc", "rip")
                discussion: eip.discussion, // Discussion link
                status: eip.status, // Status of the EIP
                created: eip.created, // Creation date
                deadline: eip.deadline || "", // Deadline if exists, else empty
                type: eip.type, // Type of the EIP
                title: eip.title, // Title of the EIP
            }));
        });
    });

    if (!transformedData?.length) {
        console.error("Transformed data is empty.");
        alert("No transformed data available for download.");
        return;
    }

    // Define the CSV header
    const header = "Repo, EIP, Title, Author, Status, Type, Category, Discussion, Created at, Deadline, Link\n";

    // Prepare the CSV content
    const csvContent =
        "data:text/csv;charset=utf-8," + 
        header +
        transformedData
            ?.map(({ repo, eip, title, author, discussion, status, type, category, created, deadline }) => {
                // Generate the correct URL based on the repo type
                const url =
                    category === "ERC"
                        ? `https://eipsinsight.com/ercs/erc-${eip}`
                        : `https://eipsinsight.com/eips/eip-${eip}`;
                        


          // Handle the 'deadline' field, use empty string if not available
          const deadlineValue = deadline || "";

          // Wrap fields in double quotes to handle commas
          return `"${repo}","${eip}","${title.replace(/"/g, '""')}","${author.replace(/"/g, '""')}","${status.replace(/"/g, '""')}","${type.replace(/"/g, '""')}","${category.replace(/"/g, '""')}","${discussion.replace(/"/g, '""')}","${created.replace(/"/g, '""')}","${deadlineValue.replace(/"/g, '""')}","${url}"`;
        })
        .join("\n");

    // Check the generated CSV content before download
    console.log("CSV Content Preview:", csvContent);

    // Encode the CSV content for downloading
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${selectedStatus}.csv`); // Name your CSV file here
    document.body.appendChild(link); // Required for Firefox
    link.click();
    document.body.removeChild(link);
  };


  const headingColor = useColorModeValue('black', 'white');

  return (
    <Box
      bgColor={bg}
      marginTop="6"
      paddingEnd="6"
      p="1rem 1rem"
      borderRadius="0.55rem"
      overflowX="auto"
      _hover={{
        border: "1px",
        borderColor: "#30A0E0",
      }}
      className=" ease-in duration-200"
    >
      <NextLink
        href={`/tableStatus/${type === "EIPs" ? "eip" : type === "ERCs" ? "erc" : "rip"
          }/${selectedStatus}`}
      >
        <Text fontSize="xl" fontWeight="bold" color="#30A0E0" marginRight="6">
          {`Status: ${selectedStatus} - [${
            data2?.filter((item) => item.status === selectedStatus)?.length
          }] `}
        </Text>
      </NextLink>
      <Select
        variant="outline"
        placeholder="Select Option"
        value={selectedStatus}
        onChange={handleChangeStatus}
        className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
        size="sm" // Set the select size to small
      >
        <option value="Final">Final</option>
        <option value="Review">Review</option>
        <option value="Last Call">Last Call</option>
        <option value="Stagnant">Stagnant</option>
        <option value="Draft">Draft</option>
        <option value="Living">Living</option>
      </Select>
      <Box>
        {isLoading ? (
          // Show loading spinner while chart is rendering
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="200px"
          >
            <Spinner />
          </Box>
        ) : (
          // Show chart when it's ready
          <>
            <br />
            <Flex justifyContent="space-between" alignItems="center" marginBottom="0.5rem">
              <Heading size="md" color={headingColor}>
                {`${selectedStatus}`}
              </Heading>
              {/* Assuming a download option exists for the yearly data as well */}
              <Button bg="#40E0D0"
                color="white"
                _hover={{ bg: "#30c9c9" }}
                _active={{ bg: "#1fb8b8" }} onClick={async () => {
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
          </>
        )}
      </Box>
    </Box>
  );
};

export default AreaC;
