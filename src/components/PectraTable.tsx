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
  import { DownloadIcon } from "@chakra-ui/icons";
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
  import { Popover, PopoverContent, PopoverTrigger } from "@chakra-ui/react";
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
    eip: string;
    title: string;
    author: string;
  }
  
  import "@coreui/coreui/dist/css/coreui.min.css";
  interface TabProps {
    cat: string;
  }
  
  interface TableProps {
   PectraData:EIP[]
  }

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
    "Meta",
  ];
  
  
  const PectraTable: React.FC<TableProps> = ({ PectraData }) => {
    const [data, setData] = useState<EIP[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDarkMode, setIsDarkMode] = useState(false);
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
    const yearsArr = [];

    useEffect(() => {
      setInterval(() => {
        setIsLoading(false);
      }, 2000);
    });
  
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

  const convertAndDownloadCSV = () => {
    if (PectraData && PectraData.length > 0) {
      const headers = Object.keys(PectraData[0]).join(",") + "\n";
      const csvRows = PectraData.map((item) => {
        const values = Object.values(item).map((value) => {
          if (typeof value === "string" && value.includes(",")) {
            return `"${value}"`;
          }
          return value;
        });
        return values.join(",");
      });

      const csvContent = headers + csvRows.join("\n");

      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = `Pectra.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    }
  };
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await fetch(`/api/new/all`);
          const jsonData = await response.json();
          setData(jsonData.eip.concat(jsonData.erc));
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
  

    const filteredData=PectraData
  
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
              <div className="flex justify-between items-center">
                <h2 className="text-blue-400 font-semibold text-4xl">
                  {" "}
                  {`Pectra - [${filteredData.length}]`}
                </h2>
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
              </div>
                <CSmartTable
                  items={filteredData}
                  activePage={1}
                  // clickableRows
                  // columnSorter
                  columnFilter
                  itemsPerPage={5}
                  pagination
                  tableProps={{
                    hover: true,
                    responsive: true,
                  }}
                  scopedColumns={{
                    eip: (item: any) => (
                      <td
                        key={item.eip}
                        style={{ fontWeight: "bold", height: "100%" }}
                        className="hover:text-[#1c7ed6]"
                      >
                        <Link
                          href={`/eips/eip}-${item.eip}`}
                          className={
                            isDarkMode
                              ? "hover:text-[#1c7ed6] text-[13px] text-white"
                              : "hover:text-[#1c7ed6] text-[13px] text-black"
                          }
                        >
                          {item.eip}
                        </Link>
                      </td>
                    ),
                    title: (item: any) => (
                      <td
                        key={item.eip}
                        style={{ fontWeight: "bold", height: "100%" }}
                        className="hover:text-[#1c7ed6]"
                      >
                        <Link
                          href={`/eips/eip}-${item.eip}`}
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
                      <td key={it.author}>
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
  
  
  export default PectraTable;
  
