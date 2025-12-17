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

const statusArr = [
  "Final",
  "Draft",
  "Review",
  "Last Call",
  "Stagnant",
  "Withdrawn",
  "Living",
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
  repo: string;
  unique_ID: number;
  __v: number;
}

import "@coreui/coreui/dist/css/coreui.min.css";
import LoaderComponent from "./Loader";
import { DownloadIcon } from "@chakra-ui/icons";

interface TabProps {
  status: string;
}

const TableStatusByStatus: React.FC<TabProps> = ({ status }) => {
  const [data, setData] = useState<EIP[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { colorMode } = useColorMode();
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
        const allData = jsonData.eip?.concat(jsonData.erc?.concat(jsonData.rip)) || [];
        setData(allData);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
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
  }, [bg]);

  const filteredData = data
    ?.map((item: any, index: number) => {
      const { eip, title, author, status, type, category, repo } = item;
      return {
        "#": (index + 1).toString(),
        eip,
        title,
        author,
        status,
        type,
        repo,
        category,
      };
    })
    ?.filter((item: any) => item.status === status);

  const filteredDataSorted = filteredData.sort((a, b) => {
    const eipA = parseInt(a.eip, 10);
    const eipB = parseInt(b.eip, 10);
    return eipA - eipB;
  });

  const DataForFilter = filteredDataSorted?.filter((item) => {
    const isCategoryMatch = !selectedCategory || item.category === selectedCategory;
    return isCategoryMatch;
  });

  const convertAndDownloadCSV = () => {
    if (DataForFilter && DataForFilter?.length > 0) {
      const headers = Object.keys(DataForFilter[0]).join(",") + "\n";

      const csvRows = DataForFilter?.map((item) => {
        const values = Object.values(item)?.map((value) => {
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
      a.download = `${status}_${selectedCategory || "All"}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    }
  };

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
            maxHeight: "600px",
            overflowY: "auto",
            overflowX: "auto",
          }}
        >
          {isLoading ? (
            <Box display="flex" justifyContent="center" alignItems="center">
              <Spinner />
            </Box>
          ) : (
            <>
              <Flex justify="space-between" align="center" marginBottom="1rem" wrap="wrap" gap={4}>
                <Select
                  placeholder="Filter by Category"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  maxWidth="250px"
                >
                  {catArr?.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </Select>

                <Button
                  colorScheme="blue"
                  onClick={convertAndDownloadCSV}
                  variant="outline"
                  fontSize={{ lg: "14px", md: "12px", sm: "12px", base: "10px" }}
                  fontWeight="bold"
                  padding={{ lg: "10px 20px", md: "5px 10px", sm: "5px 10px", base: "5px 10px" }}
                >
                  <DownloadIcon marginEnd="1.5" />
                  Download CSV
                </Button>
              </Flex>

              <CSmartTable
                columns={[
                  {
                    label: "EIP",
                    key: "eip",
                    _style: { width: "8%" },
                  },
                  {
                    label: "Title",
                    key: "title",
                    _style: { width: "30%" },
                  },
                  "author",
                  "status",
                  "type",
                  {
                    label: "Category",
                    key: "category",
                    _style: { width: "12%" },
                  },
                  {
                    label: "Repo",
                    key: "repo",
                    _style: { width: "8%" },
                  },
                ]}
                items={DataForFilter}
                itemsPerPage={50}
                itemsPerPageSelect
                pagination
                columnFilter
                tableProps={{
                  hover: true,
                  responsive: true,
                  style: {
                    backgroundColor: isDarkMode ? "#1a202c" : "white",
                  },
                }}
                scopedColumns={{
                  eip: (item: any) => (
                    <td style={{ fontSize: "14px" }}>
                      <Link href={`/eips/eip-${item.eip}`} color="#1c7ed6">
                        <Badge colorScheme="blue">EIP-{item.eip}</Badge>
                      </Link>
                    </td>
                  ),
                  title: (item: any) => (
                    <td style={{ fontSize: "14px", fontWeight: "bold" }}>
                      <Link href={`/eips/eip-${item.eip}`} color="#1c7ed6">
                        {item.title}
                      </Link>
                    </td>
                  ),
                  author: (it: any) => {
                    return (
                      <td>
                        <Popover placement="left">
                          <PopoverTrigger>
                            <Button
                              size={"xs"}
                              variant="ghost"
                              colorScheme="blue"
                            >
                              Show
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent bg="#1c7ed6" color="white">
                            <Box padding={2}>
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
                                              ? "mailto:"
                                              : "https://github.com/"
                                          }${t}`}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          isExternal
                                          color="white"
                                        >
                                          {item?.slice(0, -1).join(" ")}
                                        </Link>
                                      </WrapItem>
                                    </Wrap>
                                  );
                                }
                              )}
                            </Box>
                          </PopoverContent>
                        </Popover>
                      </td>
                    );
                  },
                  status: (item: any) => (
                    <td>
                      <Badge
                        colorScheme={
                          item.status === "Living"
                            ? "blue"
                            : item.status === "Final"
                            ? "green"
                            : item.status === "Stagnant"
                            ? "purple"
                            : item.status === "Draft"
                            ? "orange"
                            : item.status === "Withdrawn"
                            ? "red"
                            : item.status === "Last Call"
                            ? "yellow"
                            : item.status === "Review"
                            ? "cyan"
                            : "gray"
                        }
                      >
                        {item.status}
                      </Badge>
                    </td>
                  ),
                  type: (item: any) => (
                    <td>
                      <Badge>{item.type}</Badge>
                    </td>
                  ),
                  category: (item: any) => (
                    <td>
                      <Badge>{item.category}</Badge>
                    </td>
                  ),
                  repo: (item: any) => (
                    <td>
                      <Badge colorScheme="gray">{item.repo.toUpperCase()}</Badge>
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

export default TableStatusByStatus;
