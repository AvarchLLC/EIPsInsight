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

const statusArr = [
  "Final",
  "Draft",
  "Review",
  "Last_Call",
  "Stagnant",
  "Withdrawn",
  "Living",
];

interface StatusChange {
  _id: string;
  eip: string;
  fromStatus: string;
  toStatus: string;
  title: string;
  status: string;
  author: string;
  created: string;
  changeDate: string;
  type: string;
  category: string;
  discussion: string;
  deadline: string;
  requires: string;
  pr: number;
  changedDay: number;
  changedMonth: number;
  changedYear: number;
  createdMonth: number;
  createdYear: number;
  __v: number;
}

interface DataObject {
  _id: string;
  count: number;
  statusChanges: StatusChange[];
}

import "@coreui/coreui/dist/css/coreui.min.css";
import LoaderComponent from "./Loader";
import { DownloadIcon } from "@chakra-ui/icons";
interface TabProps {
  month: string;
  year: string;
  status: string;
  Tabletype: string;
}
const getStatus = (status: string) => {
  switch (status) {
    case "LastCall":
      return "Last Call";
    default:
      return status;
  }
};

interface FilteredDataItem {
  sr: number;
  eip: string;
  title: string;
  author: string;
  status: string;
  type: string;
  category: string;
  deadline?: string;
  created?: string;
  changeDate?: string;
  commitLink?: string;
}

const InsightTable: React.FC<TabProps> = ({
  month,
  year,
  status,
  Tabletype,
}) => {
  const [data, setData] = useState<DataObject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [filteredData, setFilteredData] = useState<FilteredDataItem[]>([]);

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
        const response = await fetch(`/api/new/statusChanges/${year}/${month}`);
        const jsonData = await response.json();
        if (Tabletype === "erc") {
          setData(jsonData.erc);
        } else if (Tabletype === "eip") {
          setData(jsonData.eip);
        } else if (Tabletype === "rip") {
          setData(jsonData.rip);
        } else if (Tabletype === "all") {
          setData(jsonData.eip.concat(jsonData.erc).concat(jsonData.rip));
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [year, month]);

  useEffect(() => {
    if (bg === "#f6f6f7") {
      setIsDarkMode(false);
    } else {
      setIsDarkMode(true);
    }
  });

  const finalObject = data.find((item) => item._id === getStatus(status));
  const finalStatusChanges = finalObject ? finalObject.statusChanges : [];

  useEffect(() => {
    const finalObject = data.find((item) => item._id === getStatus(status));
    const finalStatusChanges = finalObject ? finalObject.statusChanges : [];

    // Define a variable for the filtered data
    let newData: FilteredDataItem[] = [];

    if (status === "LastCall") {
      let srNo = 1; // Initialize the serial number

      newData = finalStatusChanges.map((item: StatusChange) => {
        const { eip, title, author, status, type, category, deadline } = item;
        const commitLink = `https://github.com/ethereum/${
          Tabletype === "eip" ? "EIPs" : Tabletype === "erc" ? "ERCs" : "RIPs"
        }/commits/master/${
          Tabletype === "eip" ? "EIPS" : Tabletype === "erc" ? "ERCS" : "RIPS"
        }/${Tabletype}-${eip}.md`;

        return {
          sr: srNo++, // Add the serial number and increment it
          eip,
          title,
          author,
          status,
          type,
          category,
          deadline,
          commitLink,
        };
      });
    } else if (status === "Draft") {
      let srNo = 1; // Initialize the serial number

      newData = finalStatusChanges.map((item: StatusChange) => {
        const { eip, title, author, status, type, category, created } = item;
        const commitLink = `https://github.com/ethereum/${
          Tabletype === "eip" ? "EIPs" : Tabletype === "erc" ? "ERCs" : "RIPs"
        }/commits/master/${
          Tabletype === "eip" ? "EIPS" : Tabletype === "erc" ? "ERCS" : "RIPS"
        }/${Tabletype}-${eip}.md`;

        return {
          sr: srNo++, // Add the serial number and increment it
          eip,
          title,
          author,
          status,
          type,
          category,
          created,
          commitLink,
        };
      });
    } else if (status === "Final") {
      let srNo = 1; // Initialize the serial number

      newData = finalStatusChanges.map((item: StatusChange) => {
        const {
          eip,
          title,
          author,
          status,
          type,
          category,
          created,
          changeDate,
        } = item;
        const commitLink = `https://github.com/ethereum/${
          Tabletype === "eip" ? "EIPs" : Tabletype === "erc" ? "ERCs" : "RIPs"
        }/commits/master/${
          Tabletype === "eip" ? "EIPS" : Tabletype === "erc" ? "ERCS" : "RIPS"
        }/${Tabletype}-${eip}.md`;

        return {
          sr: srNo++, // Add the serial number and increment it
          eip,
          title,
          author,
          status,
          type,
          category,
          created,
          changeDate,
          commitLink,
        };
      });
    } else {
      let srNo = 1; // Initialize the serial number

      newData = finalStatusChanges.map((item: StatusChange) => {
        const { eip, title, author, status, type, category } = item;
        const commitLink = `https://github.com/ethereum/${
          Tabletype === "eip" ? "EIPs" : Tabletype === "erc" ? "ERCs" : "RIPs"
        }/commits/master/${
          Tabletype === "eip" ? "EIPS" : Tabletype === "erc" ? "ERCS" : "RIPS"
        }/${Tabletype}-${eip}.md`;

        return {
          sr: srNo++, // Add the serial number and increment it
          eip,
          title,
          author,
          status,
          type,
          category,
          commitLink,
        };
      });
    }

    // Update the state with the new data
    setFilteredData(newData);
  }, [data, status]);

  const bg = useColorModeValue("#f6f6f7", "#171923");

  const convertAndDownloadCSV = () => {
    if (filteredData && filteredData.length > 0) {
      const headers = Object.keys(filteredData[0]);
      // headers.push("Commit Link");
      headers.push(`${Tabletype.toUpperCase()} Link`);
      const csvRows = filteredData.map((item) => {
        const values = Object.values(item);
        // const commitLink = `https://github.com/ethereum/${
        //   Tabletype === "eip" ? "EIPs" : Tabletype === "erc" ? "ERCs" : "RIPs"
        // }/commits/master/${
        //   Tabletype === "eip" ? "EIPS" : Tabletype === "erc" ? "ERCS" : "RIPS"
        // }/${Tabletype}-${item.eip}.md`;
        const eipLink = `https://github.com/ethereum/${
          Tabletype === "eip" ? "EIPs" : Tabletype === "erc" ? "ERCs" : "RIPs"
        }/blob/master/${
          Tabletype === "eip" ? "EIPS" : Tabletype === "erc" ? "ERCS" : "RIPS"
        }/${Tabletype}-${item.eip}.md`;
        // values.push(commitLink);
        values.push(eipLink);
        return values
          .map((value) =>
            typeof value === "string" && value.includes(",")
              ? `"${value}"`
              : value
          )
          .join(",");
      });

      // Combine headers and rows
      const csvContent = headers.join(",") + "\n" + csvRows.join("\n");

      // Trigger CSV download
      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = `${status}_${month}_${year}.csv`;
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
            <LoaderComponent />
          </Box>
        ) : (
          <>
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
            <CSmartTable
              items={filteredData.sort((a, b) => a.sr - b.sr)}
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
                    key: 'sr',
                    label: 'sr',
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
                  },
                  {
                    key: 'commitLink',
                    label: 'commitLink',
                    _style: {
                      backgroundColor: isDarkMode ? '#2D3748' : '#F7FAFC',
                      color: isDarkMode ? 'white' : 'black',
                      fontWeight: 'bold',
                      padding: '12px',                                     
                      borderTopRightRadius: "0.55rem",   
                    }
                  },
                  ]}
              scopedColumns={{
                sr: (item: any) => (
                  <td key={item.eip} style={{ backgroundColor: isDarkMode ? '#2D3748' : '#F7FAFC' }}>
                    <Link href={`/${Tabletype}s/${Tabletype}-${item.eip}`}>
                      <Wrap>
                        <WrapItem>
                          <Badge colorScheme={getStatusColor(item.status)}>
                            {item.sr}
                          </Badge>
                        </WrapItem>
                      </Wrap>
                    </Link>
                  </td>
                ),
                eip: (item: any) => (
                  <td key={item.eip} style={{ backgroundColor: isDarkMode ? '#2D3748' : '#F7FAFC' }}>
                    <Link href={`/${Tabletype}s/${Tabletype}-${item.eip}`}>
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
                      href={`/${Tabletype}s/${Tabletype}-${item.eip}`}
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
                      {factorAuthor(it.author).map((item: any, index: any) => {
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
                      })}
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
                commitLink: (item: any) => (
                  <td key={item.eip} style={{ backgroundColor: isDarkMode ? '#2D3748' : '#F7FAFC' }}>
                    <Link href={item.commitLink} target="_blank">
                      <Button className="bg-blue-400">Commit</Button>
                    </Link>
                  </td>
                ),
                
              }}
            />
          </>
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

export default InsightTable;
