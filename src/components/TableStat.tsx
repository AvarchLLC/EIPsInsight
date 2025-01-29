import {
  Box,
  Text,
  useColorModeValue,
  Wrap,
  WrapItem,
  Badge,
  Link,
  Button,
} from "@chakra-ui/react";
import { CCardBody, CSmartTable } from "@coreui/react-pro";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Spinner } from "@chakra-ui/react";
import axios from "axios";

const statusArr = [
  "Final",
  "Draft",
  "Review",
  "Last_Call",
  "Stagnant",
  "Withdrawn",
  "Living",
];

interface EIP {
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
  repo: string;
  __v: number;
}

import "@coreui/coreui/dist/css/coreui.min.css";
import LoaderComponent from "./Loader";
import { DownloadIcon } from "@chakra-ui/icons";
interface TabProps {
  cat: string;
  type: string;
}

async function fetchLastCreatedYearAndMonthFromAPI(
  eipNumber: number
): Promise<{ mergedYear: string; mergedMonth: string } | null> {
  try {
    const apiUrl = `/api/eipshistory/${eipNumber}`;
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    if (Array.isArray(data) && data.length > 0) {
      const lastElement = data[0];
      const lastElementCreatedYear = lastElement.mergedYear;
      const lastElementCreatedMonth = lastElement.mergedMonth;
      return {
        mergedYear: lastElementCreatedYear,
        mergedMonth: lastElementCreatedMonth,
      };
    } else {
      throw new Error("No data found or data format is invalid.");
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}

const TableStat: React.FC<TabProps> = ({ cat, type }) => {
  const [data, setData] = useState<EIP[]>([]); 
  const [isLoading, setIsLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mergedData, setMergedData] = useState<
    { mergedYear: string; mergedMonth: string }[]
  >([]);

  const factorAuthor = (data: any) => {
    let list = data.split(",");
    for (let i = 0; i < list.length; i++) {
      list[i] = list[i].split(" ");
    }
    if (list[list.length - 1][list[list.length - 1].length - 1] === "al.") {
      list.pop();
    }
    return list;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/new/all`);
        const jsonData = await response.json();
        if (type === "erc") {
          setData(jsonData.erc);
        } else if (type === "eip") {
          setData(jsonData.eip);
        } else {
          setData(jsonData.rip);
        }
        setIsLoading(false); // Set isLoading to false after data is fetched

        // Fetch merged years and months for each item
        const mergedDataPromises = jsonData.map((item: any) =>
          fetchLastCreatedYearAndMonthFromAPI(item.eip)
        );

        // Wait for all promises to resolve
        const mergedDataValues = await Promise.all(mergedDataPromises);
        setMergedData(mergedDataValues);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false); // Set isLoading to false if there's an error
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (bg === "#f6f6f7") {
      setIsDarkMode(false);
    } else {
      setIsDarkMode(true);
    }
  });

  const filteredData = data
    .map((item: any) => {
      const { eip, title, author, status, type, category,repo,deadline } = item;
      return {
        eip,
        title,
        author,
        status,
        type,
        category,
        repo,
        deadline,
      };
    })
    .filter((item: any) => item.status === cat);

  const filteredDataWithMergedYearsAndMonths = filteredData.map(
    (item, index) => ({
      "#": (index + 1).toString(), // Add the sr number
      ...item,
      mergedYear: mergedData[index]?.mergedYear || "", // Replace '' with a default value if needed
      mergedMonth: mergedData[index]?.mergedMonth || "", // Replace '' with a default value if needed
    })
  );

  const bg = useColorModeValue("#f6f6f7", "#171923");

  const convertAndDownloadCSV = () => {
    if (
      filteredDataWithMergedYearsAndMonths &&
      filteredDataWithMergedYearsAndMonths.length > 0
    ) {
      // Create CSV headers
      const headers =
        Object.keys(filteredDataWithMergedYearsAndMonths[0]).join(",") + "\n";

      // Convert data to CSV rows
      const csvRows = filteredDataWithMergedYearsAndMonths.map((item) =>
        Object.values(item)
          .map((value) =>
            typeof value === "string" && value.includes(",")
              ? `"${value}"`
              : value
          )
          .join(",")
      );

      // Combine headers and rows
      const csvContent = headers + csvRows.join("\n");

      // Trigger CSV download
      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = `${cat}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    }
  };

  return (
    <Box
      bgColor={bg}
      marginTop={"12"}
      p="1rem 1rem"
      borderRadius="0.55rem"
      _hover={{
        border: "1px",
        borderColor: "#30A0E0",
      }}
      as={motion.div}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 } as any}
      className=" ease-in duration-200"
    >
      <Box>
        <Button
          colorScheme="blue"
          variant="outline"
          fontSize={"14px"}
          fontWeight={"bold"}
          padding={"10px 20px"}
          onClick={async () => {
            try {
              // Trigger the CSV conversion and download
              convertAndDownloadCSV();
        
              // Trigger the API call
              await axios.post("/api/DownloadCounter");
            } catch (error) {
              console.error("Error triggering download counter:", error);
            }
          }}
        >
          <DownloadIcon marginEnd={"1.5"} />
          Download Reports
        </Button>
      </Box>
      <br/>

      <CCardBody
        style={{
          fontSize: "13px",
        }}
        className="scrollbarDesign"
      >
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
          <CSmartTable
  items={filteredDataWithMergedYearsAndMonths.sort(
    (a, b) => parseInt(a["#"]) - parseInt(b["#"])
  )}
  activePage={1}
  clickableRows
  columnFilter
  columnSorter
  itemsPerPage={5}
  pagination
  tableProps={{
    hover: true,
    responsive: true,
    style: {
      borderRadius: "0.55rem", // Add rounded corners
      overflow: "hidden", // Ensure the border-radius is applied cleanly
    },
  }}
  columns={[
    {
      key: '#',
      label: '#',
      _style: {
        backgroundColor: isDarkMode ? '#2D3748' : '#F7FAFC',
        color: isDarkMode ? 'white' : 'black',
        fontWeight: 'bold',
        padding: '12px',
        borderTopLeftRadius: "0.55rem",
      }
    },
    {
      key: 'eip',
      label: 'EIP',
      _style: {
        backgroundColor: isDarkMode ? '#2D3748' : '#F7FAFC',
        color: isDarkMode ? 'white' : 'black',
        fontWeight: 'bold',
      }
    },
    {
      key: 'title',
      label: 'Title',
      _style: {
        backgroundColor: isDarkMode ? '#2D3748' : '#F7FAFC',
        color: isDarkMode ? 'white' : 'black',
        fontWeight: 'bold',
      }
    },
    {
      key: 'author',
      label: 'Author',
      _style: {
        backgroundColor: isDarkMode ? '#2D3748' : '#F7FAFC',
        color: isDarkMode ? 'white' : 'black',
        fontWeight: 'bold',
      }
    },
    {
      key: 'type',
      label: 'Type',
      _style: {
        backgroundColor: isDarkMode ? '#2D3748' : '#F7FAFC',
        color: isDarkMode ? 'white' : 'black',
        fontWeight: 'bold',
      }
    },
    {
      key: 'category',
      label: 'Category',
      _style: {
        backgroundColor: isDarkMode ? '#2D3748' : '#F7FAFC',
        color: isDarkMode ? 'white' : 'black',
        fontWeight: 'bold',
      }
    },
    {
      key: 'status',
      label: 'Status',
      _style: {
        backgroundColor: isDarkMode ? '#2D3748' : '#F7FAFC',
        color: isDarkMode ? 'white' : 'black',
        fontWeight: 'bold',
        padding: '12px',
        borderTopRightRadius: cat === "Last Call" ? "0" : "0.55rem", // Adjust border radius
      }
    },
    ...(cat === "Last Call" ? [ // Conditionally add the deadline column
      {
        key: 'deadline',
        label: 'Deadline',
        _style: {
          backgroundColor: isDarkMode ? '#2D3748' : '#F7FAFC',
          color: isDarkMode ? 'white' : 'black',
          fontWeight: 'bold',
          padding: '12px',
          borderTopRightRadius: "0.55rem", // Add border radius to the last column
        }
      }
    ] : [])
  ]}
  scopedColumns={{
    "#": (item: any) => (
      <td key={item.eip} style={{ backgroundColor: isDarkMode ? '#2D3748' : '#F7FAFC' }}>
        <Link href={`/${item.repo === "erc" ? "ercs/erc" : item.repo === "rip" ? "rips/rip" : "eips/eip"}-${item.eip}`}>
          <Wrap>
            <WrapItem>
              <Badge colorScheme={getStatusColor(item.status)}>
                {item["#"]}
              </Badge>
            </WrapItem>
          </Wrap>
        </Link>
      </td>
    ),
    eip: (item: any) => (
      <td key={item.eip} style={{ backgroundColor: isDarkMode ? '#2D3748' : '#F7FAFC' }}>
        <Link href={`/${item.repo === "erc" ? "ercs/erc" : item.repo === "rip" ? "rips/rip" : "eips/eip"}-${item.eip}`}>
          <Wrap>
            <WrapItem>
              <Badge colorScheme={getStatusColor(item.status)}>
                {item.eip}
              </Badge>
            </WrapItem>
          </Wrap>
        </Link>
      </td>
    ),
    title: (item: any) => (
      <td
        key={item.eip}
        style={{ fontWeight: "bold", height: "100%", backgroundColor: isDarkMode ? '#2D3748' : '#F7FAFC' }}
        className="hover:text-[#1c7ed6]"
      >
        <Link
          href={`/${item.repo === "erc" ? "ercs/erc" : item.repo === "rip" ? "rips/rip" : "eips/eip"}-${item.eip}`}
          className={
            isDarkMode
              ? "hover:text-[#1c7ed6] text-[13px] text-white"
              : "hover:text-[#1c7ed6] text-[13px] text-black"
          }
        >
          {item.title}
        </Link>
      </td>
    ),
    author: (it: any) => (
      <td key={it.author} style={{ backgroundColor: isDarkMode ? '#2D3748' : '#F7FAFC' }}>
        <div>
          {factorAuthor(it.author).map(
            (item: any, index: any) => {
              let t = item[item.length - 1].substring(
                1,
                item[item.length - 1].length - 1
              );
              return (
                <Wrap key={index}>
                  <WrapItem>
                    <Link
                      href={`${
                        item[item.length - 1].substring(
                          item[item.length - 1].length - 1
                        ) === ">"
                          ? "mailto:" + t
                          : "https://github.com/" + t.substring(1)
                      }`}
                      target="_blank"
                      className={
                        isDarkMode
                          ? "hover:text-[#1c7ed6] text-[13px] text-white"
                          : "hover:text-[#1c7ed6] text-[13px] text-black"
                      }
                    >
                      {item}
                    </Link>
                  </WrapItem>
                </Wrap>
              );
            }
          )}
        </div>
      </td>
    ),
    type: (item: any) => (
      <td
        key={item.eip}
        className={isDarkMode ? "text-white" : "text-black"}
        style={{ backgroundColor: isDarkMode ? '#2D3748' : '#F7FAFC' }}
      >
        {item.type}
      </td>
    ),
    category: (item: any) => (
      <td
        key={item.eip}
        className={isDarkMode ? "text-white" : "text-black"}
        style={{ backgroundColor: isDarkMode ? '#2D3748' : '#F7FAFC' }}
      >
        {item.category}
      </td>
    ),
    status: (item: any) => (
      <td key={item.eip} style={{ backgroundColor: isDarkMode ? '#2D3748' : '#F7FAFC' }}>
        <Wrap>
          <WrapItem>
            <Badge colorScheme={getStatusColor(item.status)}>
              {item.status}
            </Badge>
          </WrapItem>
        </Wrap>
      </td>
    ),
    ...(cat === "Last Call" ? { // Conditionally add the deadline column renderer
      deadline: (item: any) => (
        <td key={item.eip} style={{ backgroundColor: isDarkMode ? '#2D3748' : '#F7FAFC' }}>
          <div className={isDarkMode ? "text-white" : "text-black"}>
            {item.deadline || "N/A"}
          </div>
        </td>
      )
    } : {})
  }}
/>
        )}
      </CCardBody>
    </Box>
  );
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "Living":
      return "blue";
    case "Final":
      return "blue";
    case "Stagnant":
      return "purple";
    case "Draft":
      return "orange";
    case "Withdrawn":
      return "red";
    case "Last Call":
      return "yellow";
    default:
      return "gray";
  }
};

export default TableStat;
