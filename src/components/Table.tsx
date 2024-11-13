import {
  Box,
  Text,
  useColorModeValue,
  Wrap,
  WrapItem,
  Badge,
  Link,
  Button,
  Select,
} from "@chakra-ui/react";
import { CCardBody, CSmartTable } from "@coreui/react-pro";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Spinner } from "@chakra-ui/react";
import { Popover, PopoverContent, PopoverTrigger } from "@chakra-ui/react";

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
  unique_ID: number;
  __v: number;
  repo: string;
}

interface EIPData {
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
  commitSha: string;
  commitDate: string;
  mergedDate: string;
  prNumber: number;
  closedDate: string;
  changes: number;
  insertions: number;
  deletions: number | null;
  mergedDay: number;
  changedDay: number;
  mergedMonth: number;
  mergedYear: number;
  changedMonth: number;
  changedYear: number;
  createdMonth: number;
  createdYear: number;
  previousdeadline: string;
  newdeadline: string;
  message: string;
  repo:string;
  __v: number;
}
import "@coreui/coreui/dist/css/coreui.min.css";
import { DownloadIcon } from "@chakra-ui/icons";

interface TableProps {
  type: string;
}


const Table: React.FC<TableProps> = ({ type }) => {
  const [data, setData] = useState<EIP[]>([]);
  const [data2, setData2] = useState<EIPData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  // const [mergedData, setMergedData] = useState<
  //   { mergedYear: string; mergedMonth: string }[]
  // >([]);
  // const [changedData, setchangedData] = useState<
  //   { changedYear: string; changedMonth: string }[]
  // >([]);
  // const [dataForFilter, setDataForFilter] = useState<FilterDataProps[]>([]);
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
        if (type === "EIP") {
          setData(jsonData.eip);
        } else if (type === "ERC") {
          setData(jsonData.erc);
        } else if (type === "Total") {
          setData(jsonData.eip.concat(jsonData.erc.concat(jsonData.rip)));
        } else if (type === "RIP") {
          setData(jsonData.rip);
        }

        const response2 = await fetch(`/api/new/graphsv3`);
        const jsonData5 = await response2.json();

        // Function to filter only the first occurrence of each unique entry based on eip ID and changeDate
        function getEarliestEntries(data:any, key:any) {
          const uniqueEntries:any = {};

          data.forEach((entry:any) => {
            const entryKey = entry[key];
            
            // If this is the first time we see this `key` or if the current entry's date is earlier, store it
            if (!uniqueEntries[entryKey] || new Date(entry.changeDate) < new Date(uniqueEntries[entryKey].changeDate)) {
              uniqueEntries[entryKey] = entry;
            }
          });

          return Object.values(uniqueEntries);
        }

        let filteredData:any;

        if (type === "EIP") {
          filteredData = getEarliestEntries(jsonData5.eip, 'eip');
        } else if (type === "ERC") {
          filteredData = getEarliestEntries(jsonData5.erc, 'eip');
        } else if (type === "RIP") {
          filteredData = getEarliestEntries(jsonData5.rip, 'eip');
        } else if (type === "Total") {
          // Concatenate filtered data for all types
          filteredData = [
            ...getEarliestEntries(jsonData5.eip, 'eip'),
            ...getEarliestEntries(jsonData5.erc, 'eip'),
            ...getEarliestEntries(jsonData5.rip, 'eip'),
          ];
          filteredData = filteredData.filter((entry: EIPData, index: number, self: EIPData[]) =>
            entry.eip !== '1' || index === self.findIndex((e: EIPData) => e.eip === '1')
          );          
        }
        console.log(filteredData);

        setData2(filteredData);
        setIsLoading(false);

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

  const filteredData = data2.map((item: any) => {
    const { eip, title, author, status, type, category, repo, changedMonth, changedYear } = item;
    return {
      eip,
      title,
      author,
      status,
      type,
      category,
      changedMonth,
      changedYear,
      repo,
    };
  });
  const filteredDataWithMergedYearsAndMonths = filteredData;

  // console.log("filtered data:", filteredDataWithMergedYearsAndMonths)

  const DataForFilter = filteredDataWithMergedYearsAndMonths.filter((item) => {
    const isYearInRange =
      (!selectedYearRange.start ||
        item.changedYear >= selectedYearRange.start) &&
      (!selectedYearRange.end || item.changedYear <= selectedYearRange.end);

    const isMonthInRange =
      (!selectedMonthRange.start ||
        item.changedMonth >= selectedMonthRange.start) &&
      (!selectedMonthRange.end || item.changedMonth <= selectedMonthRange.end);

    const isStatusMatch = !selectedStatus || item.status === selectedStatus;

    const isCategoryMatch =
      !selectedCategory || item.category === selectedCategory;
    return isYearInRange && isMonthInRange && isStatusMatch && isCategoryMatch;
  });
  const bg = useColorModeValue("#f6f6f7", "#171923");

  const convertAndDownloadCSV = () => {
    if (DataForFilter && DataForFilter.length > 0) {
      // Create CSV headers
      const headers =
        Object.keys(filteredDataWithMergedYearsAndMonths[0]).join(",") + "\n";

      // Convert data to CSV rows
      const csvRows = DataForFilter.map((item) => {
        const values = Object.values(item).map((value) => {
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
        a.download = `All_${type.toUpperCase()}s.csv`;
      } else {
        a.download = `${type.toUpperCase()}_${selectedStatus}_${selectedCategory}_${
          selectedMonthRange.start
        }_${selectedMonthRange.end}_${selectedYearRange.start}_${
          selectedYearRange.end
        }.csv`;
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
              <Popover trigger={"hover"} placement={"bottom-start"}>
                <PopoverTrigger>
                  <Box>
                    <Button
                      colorScheme="blue"
                      variant="outline"
                      fontSize={"14px"}
                      fontWeight={"bold"}
                      padding={"10px 20px"}
                      onClick={convertAndDownloadCSV}
                    >
                      <DownloadIcon marginEnd={"1.5"} />
                      Download Reports
                    </Button>
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
                      {statusArr.map((status) => (
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
                      {catArr.map((item) => (
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
                      {yearsArr.map((item) => (
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
                      {yearsArr.map((item) => (
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
                      {monthArr.map((item) => (
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
                      {monthArr.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </Select>
                  </div>
                </PopoverContent>
              </Popover>

              <CSmartTable
                items={filteredDataWithMergedYearsAndMonths}
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
                      <Link href={`/${type === "ERC" ? "ercs/erc" : type === "RIP" ? "rips/rip" : "eips/eip"}-${item.eip}`}>
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
                      <Link href={`/${type === "ERC" ? "ercs/erc" : type === "RIP" ? "rips/rip" : "eips/eip"}-${item.eip}`}>
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
                        href={`/eips/eip-${item.eip}`}
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

export default Table;
