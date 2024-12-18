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
  import React, { useEffect, useState, useMemo } from "react";
  import { motion } from "framer-motion";
  import { Spinner } from "@chakra-ui/react";
  import {
    Column,
    PaginationState,
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    ColumnDef,
    OnChangeFn,
    flexRender,
  } from "@tanstack/react-table";
  import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";
  import { CCardBody, CSmartTable } from "@coreui/react-pro";
  
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
    repo:string
    __v: number;
  }
  
  import "@coreui/coreui/dist/css/coreui.min.css";
  interface TabProps {
    cat: string;
  }
  
  interface TableProps {
    cat: string;
    status: string;
  }

  interface AreaCProps {
    dataset: EIP[];
    status:string;
    cat:string;
  }
  
  const RipCatTable: React.FC<AreaCProps> =  ({ cat, dataset, status }) => {
    const [data, setData] = useState<EIP[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDarkMode, setIsDarkMode] = useState(false);
    useEffect(() => {
      setInterval(() => {
        setIsLoading(false);
      }, 2000);
    });

    console.log(dataset);
  
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
          // const response = await fetch(`/api/new/all`);
          // const jsonData = await response.json();
          setData(dataset);
          setIsLoading(false); // Set isLoading to false after data is fetched
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
  
    const filteredData = dataset
      .filter((item) => item.repo === "rip" && item.status === status)
      .map((item) => {
        const { eip, title, author } = item;
        return {
          eip,
          title,
          author,
        };
      });
  
      console.log(filteredData);
  
    const bg = useColorModeValue("#f6f6f7", "#171923");
  
    return (
      <>
        {filteredData.length > 0 ? (
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
            className=" ease-in duration-200 z-0"
          >
            <CCardBody>
              <>
                <h2 className="text-blue-400 font-semibold text-4xl">
                  {" "}
                  {status}
                </h2>
                <CSmartTable
                items={filteredData.sort(
                  (a, b) => parseInt(a["eip"]) - parseInt(b["eip"])
                )}
                activePage={1}
                clickableRows
                columnFilter
                columnSorter
                itemsPerPage={5}
                pagination
                paginationProps={{
                  pages: Math.ceil(filteredData.length / 5), // Calculate the number of pages based on the items and items per page
                  style: {
                    display: 'flex',
                    flexWrap: 'wrap', // Allow pagination to wrap in smaller screens
                    justifyContent: 'center',
                    gap: '8px', // Space between pagination items
                    padding: '10px',
                  },
                }}
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
                  ]}
                scopedColumns={{
                  "#": (item: any) => (
                    <td key={item.eip} style={{ backgroundColor: isDarkMode ? '#2D3748' : '#F7FAFC' }}>
                      <Link href={`/${cat === "ERC" ? "ercs/erc" : cat === "RIP" ? "rips/rip" : "eips/eip"}-${item.eip}`}>
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
                      <Link href={`/${cat === "ERC" ? "ercs/erc" : cat === "RIP" ? "rips/rip" : "eips/eip"}-${item.eip}`}>
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
            </CCardBody>
          </Box>
        ) : (
          <></>
        )}
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
  
  export default RipCatTable;
  