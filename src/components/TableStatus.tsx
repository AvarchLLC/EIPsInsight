import {
  Box,
  Text,
  useColorModeValue,
  Wrap,
  WrapItem,
  Badge,
  Link,
  Button,
  Flex,
  Select,
} from "@chakra-ui/react";
import { CCardBody, CSmartTable } from "@coreui/react-pro";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Spinner, useColorMode } from "@chakra-ui/react";
import { Popover, PopoverContent, PopoverTrigger } from "@chakra-ui/react";
import axios from "axios";

const statusArr = [
  "Final",
  "Draft",
  "Review",
  "Last Call",
  "Stagnant",
  "Withdrawn",
  "Living",
];
const monthArr = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
];
const catArr = [
  "Core",
  "Networking",
  "Interface",
  "ERC",
  "Meta",
  "Informational",
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
  repo:string;
  unique_ID: number;
  __v: number;
}

import "@coreui/coreui/dist/css/coreui.min.css";
import LoaderComponent from "./Loader";
import { DownloadIcon } from "@chakra-ui/icons";
interface TabProps {
  cat: string;
}

async function fetchLastCreatedYearAndMonthFromAPI(
  eipNumber: number
): Promise<{ mergedYear: string; mergedMonth: string } | null> {
  try {
    const apiUrl = `/api/new/erchistory/${eipNumber}`;
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    if (Array.isArray(data) && data?.length > 0) {
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

const TableStat: React.FC<TabProps> = ({ cat }) => {
  const [data, setData] = useState<EIP[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { colorMode } = useColorMode();
  const [mergedData, setMergedData] = useState<
    { mergedYear: string; mergedMonth: string }[]
  >([]);
  const [selectedYearRange, setSelectedYearRange] = useState({
    start: "",
    end: "",
  });
  const [selectedMonthRange, setSelectedMonthRange] = useState({
    start: "",
    end: "",
  });
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const factorAuthor = (data: any) => {
    let list = data.split(",");
    for (let i = 0; i < list?.length; i++) {
      list[i] = list[i].split(" ");
    }
    if (list[list?.length - 1][list[list?.length - 1]?.length - 1] === "al.") {
      list.pop();
    }
    return list;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/new/all`);
        const jsonData = await response.json();
        if (cat === "ERC") {
          setData(jsonData.erc);
        } 
        else if( cat==="RIP"){
          setData(jsonData.rip);
        }
        else {
          setData(jsonData.eip?.concat(jsonData.erc?.concat(jsonData.rip)));
        }
        setIsLoading(false); // Set isLoading to false after data is fetched

        // Fetch merged years and months for each item
        const mergedDataPromises = jsonData.erc?.map((item: any) =>
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

  const bg = useColorModeValue("#f6f6f7", "#171923");
  
  useEffect(() => {
    if (bg === "#f6f6f7") {
      setIsDarkMode(false);
    } else {
      setIsDarkMode(true);
    }
  },[bg]);

  const filteredData = data
    ?.map((item: any) => {
      const { eip, title, author, status, type, category, mergedYear, mergedMonth, repo } = item;
      return {
        eip,
        title,
        author,
        status,
        type,
        repo,
        category,
        mergedYear,
        mergedMonth
      };
    })
    ?.filter((item: any) => item.category === cat);

    const filteredDataWithMergedYearsAndMonths = filteredData
  .sort((a, b) => {
    const eipA = parseInt(a.eip, 10); // Convert 'eip' field to a number
    const eipB = parseInt(b.eip, 10);
    return eipA - eipB; // Sort numerically based on the 'eip' field
  })
  ?.map((item, index) => ({
    "#": (index + 1).toString(), // Add the sr number after sorting
    ...item,
  }));

  
  console.log("filtered data:", filteredDataWithMergedYearsAndMonths);

  const DataForFilter = filteredDataWithMergedYearsAndMonths?.filter((item) => {
    const isYearInRange =
      (!selectedYearRange.start ||
        item.mergedYear >= selectedYearRange.start) &&
      (!selectedYearRange.end || item.mergedYear <= selectedYearRange.end);

    const isMonthInRange =
      (!selectedMonthRange.start ||
        item.mergedMonth >= selectedMonthRange.start) &&
      (!selectedMonthRange.end || item.mergedMonth <= selectedMonthRange.end);

    const isStatusMatch = !selectedStatus || item.status === selectedStatus;

    const isCategoryMatch =
      !selectedCategory || item.category === selectedCategory;
    return isYearInRange && isMonthInRange && isStatusMatch && isCategoryMatch;
  });

  const convertAndDownloadCSV = () => {
    if (DataForFilter && DataForFilter?.length > 0) {
      // Create CSV headers
      const headers =
        Object.keys(filteredDataWithMergedYearsAndMonths[0]).join(",") + "\n";

      // Convert data to CSV rows
      const csvRows = DataForFilter?.map((item) => {
        const values = Object.values(item)?.map((value) => {
          // Ensure values with commas are enclosed in double quotes
          if (typeof value === "string" && value.includes(",")) {
            return `"${value}"`;
          }
          return value;
        });

        return values.join(",");
      });

      // Combine headers and rows
      const csvContent = headers + csvRows.join("\n");

      // Trigger CSV download
      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      if (
        selectedCategory === "" &&
        selectedStatus === "" &&
        selectedYearRange.start === "" &&
        selectedYearRange.end === "" &&
        selectedMonthRange.start === "" &&
        selectedMonthRange.end === ""
      ) {
        a.download = `All_${cat}.csv`;
      } else {
        a.download = `${cat}_${selectedStatus}_${selectedCategory}_${selectedMonthRange.start}_${selectedMonthRange.end}_${selectedYearRange.start}_${selectedYearRange.end}.csv`;
      }
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    }
  };

  const currentYear = new Date().getFullYear();
  const startYear = 2015;
  const yearsArr = [];

  for (let year = startYear; year <= currentYear; year++) {
    yearsArr.push(year);
  }

  return (
    <>
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
            <>
            <Flex justifyContent="flex-end">
              <Popover trigger={"hover"} placement={"bottom-start"}>
                <PopoverTrigger>
                  <Box>
                    {/* <Flex justifyContent="flex-end"> */}
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
                    {/* </Flex> */}
                  </Box>
                </PopoverTrigger>
                <br/>
                <PopoverContent className={"px-4"}>
                  <div className={"space-y-10 py-4"}>
                    <Select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                    >
                      <option value="">Select Status</option>
                      {statusArr?.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </Select>

                    <Select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                      <option value="">Select Category</option>
                      {catArr?.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </Select>

                    <Select
                      value={selectedYearRange.start}
                      onChange={(e) =>
                        setSelectedYearRange({
                          ...selectedYearRange,
                          start: e.target.value,
                        })
                      }
                    >
                      <option value="">Start Year</option>
                      {yearsArr?.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </Select>

                    <Select
                      value={selectedYearRange.end}
                      onChange={(e) =>
                        setSelectedYearRange({
                          ...selectedYearRange,
                          end: e.target.value,
                        })
                      }
                    >
                      <option value="">End Year</option>
                      {yearsArr?.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </Select>

                    <Select
                      value={selectedMonthRange.start}
                      onChange={(e) =>
                        setSelectedMonthRange({
                          ...selectedMonthRange,
                          start: e.target.value,
                        })
                      }
                    >
                      <option value="">Start Month</option>
                      {monthArr?.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </Select>

                    <Select
                      value={selectedMonthRange.end}
                      onChange={(e) =>
                        setSelectedMonthRange({
                          ...selectedMonthRange,
                          end: e.target.value,
                        })
                      }
                    >
                      <option value="">End Month</option>
                      {monthArr?.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </Select>
                  </div>
                </PopoverContent>
              </Popover>
              </Flex>
              
              <CSmartTable
                items={filteredDataWithMergedYearsAndMonths.sort(
                  (a, b) => parseInt(a["eip"]) - parseInt(b["eip"])
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
                    overflow: "hidden",      // Ensure the border-radius is applied cleanly
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
                      borderTopRightRadius: "0.55rem",   
                    }
                  },]}
                scopedColumns={{
                  "#": (item: any) => (
                    <td key={item.eip} style={{ backgroundColor: isDarkMode ? '#2D3748' : '#F7FAFC' }}>
                      <Link href={`/${cat === "ERC"|| item.repo==='erc' ? "ercs/erc" : cat === "RIP" ? "rips/rip" : "eips/eip"}-${item.eip}`}>
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
                      <Link href={`/${cat === "ERC" || item.repo==='erc'? "ercs/erc" : cat === "RIP" ? "rips/rip" : "eips/eip"}-${item.eip}`}>
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
                      style={{ fontWeight: "bold", height: "100%",  backgroundColor: isDarkMode ? '#2D3748' : '#F7FAFC' }}
                      className="hover:text-[#1c7ed6]"
                    >
                      <Link
                        href={`/${cat === "ERC" || item.repo==='erc'? "ercs/erc" : cat === "RIP" ? "rips/rip" : "eips/eip"}-${item.eip}`}
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
                        {factorAuthor(it.author)?.map(
                          (item: any, index: any) => {
                            let t = item[item?.length - 1].substring(
                              1,
                              item[item?.length - 1]?.length - 1
                            );
                            return (
                              <Wrap key={index}>
                                <WrapItem>
                                  <Link
                                    href={`${
                                      item[item?.length - 1].substring(
                                        item[item?.length - 1]?.length - 1
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
                }}
                
              />
            </>
          )}
        </CCardBody>
      </Box>
    </>
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
