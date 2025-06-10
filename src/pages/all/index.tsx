import React, { useState, useEffect } from "react";
import AllLayout from "@/components/Layout";
import {
  Box,
  Spinner,
  Text,
  Button,
  useColorModeValue,
  Badge,
  Wrap,
  WrapItem,
  Link,
  useColorMode,
} from "@chakra-ui/react";
import SearchBox from "@/components/SearchBox";
import { DownloadIcon } from "@chakra-ui/icons";
import { motion } from "framer-motion";
import { CSmartTable, CCardBody } from "@coreui/react-pro";
import "@coreui/coreui/dist/css/coreui.min.css";
import axios from "axios";

const MotionBox = motion(Box);
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

const All = () => {
  const [selected, setSelected] = useState("All");
  const [data, setData] = useState<EIP[]>([]);
  const [filteredData, setFilteredData] = useState<EIP[]>([]);
  const [loading, setLoading] = useState(true);

  const { colorMode } = useColorMode();
  const isDarkMode = colorMode === "dark";

  const bg = useColorModeValue("#f6f6f7", "#171923");
  const tableBg = useColorModeValue("#F7FAFC", "#2D3748");
  const textColor = useColorModeValue("black", "white");
  const categories = ["All", "EIP", "ERC", "RIP"];

  useEffect(() => {
    const applyTableTheme = () => {
      const table = document.querySelector(".table");
      if (!table) return;

      // Apply background and text color to table
      (table as HTMLElement).style.backgroundColor = tableBg;
      (table as HTMLElement).style.color = textColor;

      // Apply background and text color to all header and cell elements
      table.querySelectorAll("thead th, tbody td").forEach((cell) => {
        const el = cell as HTMLElement;
        el.style.backgroundColor = tableBg;
        el.style.color = textColor;
      });
    };

    // Delay to ensure table is mounted
    const timeout = setTimeout(() => applyTableTheme(), 0);

    return () => clearTimeout(timeout);
  }, [tableBg, textColor]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/new/all`);
        const jsonData = await response.json();
        const allData = [...jsonData.eip, ...jsonData.erc, ...jsonData.rip];
        setData(allData);
        setLoading(false);
      } catch (err) {
        console.error("Fetch error:", err);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (selected === "All") {
      setFilteredData(data);
    } else {
      const filtered = data.filter(
        (item) => item.repo.toLowerCase() === selected.toLowerCase()
      );
      setFilteredData(filtered);
    }
  }, [selected, data]);

  const handleDownload = () => {
    const exportData =
      selected === "All"
        ? data
        : data.filter((item) => item.repo === selected.toLowerCase());

    if (exportData.length === 0) return;

    const header =
      "GitHub-Repo,EIP,Title,Author,Status,Deadline,Type,Category,Discussion,Created at,Link\n";
    const csvContent =
      "data:text/csv;charset=utf-8," +
      header +
      exportData
        .map(
          ({
            repo,
            eip,
            title,
            author,
            discussion,
            status,
            deadline,
            type,
            category,
            created,
          }) => {
            const url =
              repo === "eip"
                ? `https://eipsinsight.com/eips/eip-${eip}`
                : repo === "erc"
                ? `https://eipsinsight.com/ercs/erc-${eip}`
                : `https://eipsinsight.com/rips/rip-${eip}`;
            return `"${repo}","${eip}","${(title || "").replace(
              /"/g,
              '""'
            )}","${(author || "").replace(/"/g, '""')}","${(
              status || ""
            ).replace(/"/g, '""')}","${(deadline || "-").replace(
              /"/g,
              '""'
            )}","${(type || "").replace(/"/g, '""')}","${(
              category || ""
            ).replace(/"/g, '""')}","${(discussion || "").replace(
              /"/g,
              '""'
            )}","${(created || "").replace(/"/g, '""')}","${url}"`;
          }
        )
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${selected}_eips.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const factorAuthor = (data: string): string[][] => {
    const authors = data.split(",").map((a) => a.trim().split(" "));
    if (
      authors.length &&
      authors[authors.length - 1][authors[authors.length - 1].length - 1] ===
        "al."
    ) {
      authors.pop(); // Remove "et al." if present
    }
    return authors;
  };

  const getStatusColor = (status: any) => {
    switch (status) {
      case "Meta":
      case "Informational":
        return "blue";
      case "Core":
        return "purple";
      case "Networking":
        return "orange";
      case "Interface":
        return "red";
      default:
        return "gray";
    }
  };

  return (
    <AllLayout>
      <Box
        px={{ base: 4, md: 10 }}
        mt={{ base: 5, md: 10 }}
        pb={10}
        mx={{ lg: "40", base: "2" }}
        id="All EIP ERC RIP"
      >
        {/* Filters */}
        <Box
          className="flex justify-between items-center flex-wrap gap-4"
          pb={6}
        >
          <Box display={{ base: "none", md: "flex" }} gap={4}>
            {categories.map((item) => (
              <Button
                key={item}
                variant={selected === item ? "solid" : "outline"}
                colorScheme={selected === item ? "blue" : "gray"}
                onClick={() => {
                  setSelected(item);
                  if (item !== "All") {
                    window.location.href = `/${item.toLowerCase()}`;
                  }
                }}
              >
                {item}
              </Button>
            ))}
          </Box>

          <Box display={{ base: "block", md: "none" }}>
            <select
              value={selected}
              onChange={(e) => {
                const value = e.target.value;
                setSelected(value);
                if (value !== "All") {
                  window.location.href = `/${value.toLowerCase()}`;
                }
              }}
              style={{
                padding: "8px",
                borderRadius: "4px",
                fontSize: "16px",
                width: "100%",
              }}
            >
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </Box>

          <Box flex={1}>
            <SearchBox />
          </Box>
        </Box>

        {/* Download Button */}
        <Box display="flex" justifyContent="flex-end" mb={4}>
          <Button
            bg="#40E0D0"
            color="white"
            _hover={{ bg: "#30c9c9" }}
            _active={{ bg: "#1fb8b8" }}
            onClick={async () => {
              handleDownload();
              await axios.post("/api/DownloadCounter");
            }}
          >
            <DownloadIcon mr={2} />
            Download CSV
          </Button>
        </Box>

        {/* Table */}
        {loading ? (
          <MotionBox
            mt={8}
            textAlign="center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.5,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          >
            <Spinner size="xl" color="blue.500" />
            <Text mt={4} fontSize="lg">
              Fetching data...
            </Text>
          </MotionBox>
        ) : (
          <Box bgColor={bg} borderRadius="md" p={4} overflowX="auto">
            <CCardBody style={{ backgroundColor: tableBg }}>
              <Box maxH="60vh" overflowY="auto">
                <CSmartTable
                  items={filteredData.sort(
                    (a, b) => parseInt(a["eip"]) - parseInt(b["eip"])
                  )}
                  clickableRows
                  columnFilter
                  columnSorter
                  pagination={false}
                  itemsPerPage={filteredData.length || 1000}
                  tableProps={{
                    hover: true,
                    responsive: true,
                    style: {
                      backgroundColor: tableBg,
                      color: textColor,
                      borderRadius: "0.55rem",
                      minWidth: "100%",
                    },
                  }}
                  columns={[
                    {
                      key: "repo",
                      label: "GitHub",
                      _style: {
                        backgroundColor: tableBg,
                        color: textColor,
                        width: "120px", // 🔧 Adjust this to your need
                        minWidth: "100px",
                        fontWeight: "bold",
                      },
                    },
                    {
                      key: "eip",
                      label: "EIP",
                      _style: {
                        backgroundColor: tableBg,
                        color: textColor,
                        fontWeight: "bold",
                      },
                    },
                    {
                      key: "title",
                      label: "Title",
                      _style: {
                        backgroundColor: tableBg,
                        color: textColor,
                        fontWeight: "bold",
                      },
                    },
                    {
                      key: "author",
                      label: "Author",
                      _style: {
                        backgroundColor: tableBg,
                        color: textColor,
                        fontWeight: "bold",
                      },
                    },
                    {
                      key: "type",
                      label: "Type",
                      _style: {
                        backgroundColor: tableBg,
                        color: textColor,
                        fontWeight: "bold",
                      },
                    },
                    {
                      key: "category",
                      label: "Category",
                      _style: {
                        backgroundColor: tableBg,
                        color: textColor,
                        fontWeight: "bold",
                      },
                    },
                    {
                      key: "status",
                      label: "Status",
                      _style: {
                        backgroundColor: tableBg,
                        color: textColor,
                        fontWeight: "bold",
                      },
                    },
                  ]}
                  scopedColumns={{
                    "#": (item: any) => (
                      <td key={item.eip} style={{ backgroundColor: tableBg }}>
                        <Link
                          href={`/${
                            item.repo === "erc"
                              ? "ercs/erc"
                              : item.repo === "rip"
                              ? "rips/rip"
                              : "eips/eip"
                          }-${item.eip}`}
                        >
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
                    eip: (item: { repo: string; eip: any; status: any }) => (
                      <td style={{ backgroundColor: tableBg }}>
                        <Wrap>
                          <WrapItem>
                            <Link
                              href={`/${
                                item.repo === "erc"
                                  ? "ercs/erc"
                                  : item.repo === "rip"
                                  ? "rips/rip"
                                  : "eips/eip"
                              }-${item.eip}`}
                            >
                              <Badge colorScheme={getStatusColor(item.status)}>
                                {`${item.repo.toUpperCase()}-${item.eip}`}
                              </Badge>
                            </Link>
                          </WrapItem>
                        </Wrap>
                      </td>
                    ),
                    title: (item: {
                      repo: string;
                      eip: any;
                      title:
                        | string
                        | number
                        | boolean
                        | React.ReactElement<
                            any,
                            string | React.JSXElementConstructor<any>
                          >
                        | Iterable<React.ReactNode>
                        | React.ReactPortal
                        | React.PromiseLikeOfReactNode
                        | null
                        | undefined;
                    }) => (
                      <td
                        style={{
                          fontWeight: "bold",
                          height: "100%",
                          backgroundColor: tableBg,
                          color: textColor,
                        }}
                      >
                        <Wrap>
                          <WrapItem>
                            <Link
                              href={`/${
                                item.repo === "erc"
                                  ? "ercs/erc"
                                  : item.repo === "rip"
                                  ? "rips/rip"
                                  : "eips/eip"
                              }-${item.eip}`}
                              fontSize="13px"
                              sx={{
                                color: `${textColor} !important`,
                                _hover: { color: "#1c7ed6 !important" },
                              }}
                            >
                              {item.title}
                            </Link>
                          </WrapItem>
                        </Wrap>
                      </td>
                    ),

                    author: (item: { author: string }) => (
                      <td
                        style={{ backgroundColor: tableBg, color: textColor }}
                      >
                        <div>
                          {factorAuthor(item.author).map(
                            (authorPart, index) => {
                              const lastToken =
                                authorPart[authorPart.length - 1];
                              const isEmail = lastToken.endsWith(">");
                              const clean = lastToken.substring(
                                1,
                                lastToken.length - 1
                              );

                              const link =
                                isEmail && clean.includes("@")
                                  ? `mailto:${clean}`
                                  : `https://github.com/${clean.replace(
                                      /^@/,
                                      ""
                                    )}`;

                              return (
                                <Wrap key={index}>
                                  <WrapItem>
                                    <Link
                                      href={link}
                                      target="_blank"
                                      fontSize="13px"
                                      sx={{
                                        color: `${textColor} !important`,
                                        _hover: { color: "#1c7ed6 !important" },
                                      }}
                                    >
                                      {authorPart.join(" ")}
                                    </Link>
                                  </WrapItem>
                                </Wrap>
                              );
                            }
                          )}
                        </div>
                      </td>
                    ),

                    type: (item: {
                      type:
                        | string
                        | number
                        | boolean
                        | React.ReactElement<
                            any,
                            string | React.JSXElementConstructor<any>
                          >
                        | Iterable<React.ReactNode>
                        | React.ReactPortal
                        | React.PromiseLikeOfReactNode
                        | null
                        | undefined;
                    }) => (
                      <td
                        style={{ backgroundColor: tableBg, color: textColor }}
                      >
                        {item.type}
                      </td>
                    ),
                    category: (item: {
                      category:
                        | string
                        | number
                        | boolean
                        | React.ReactElement<
                            any,
                            string | React.JSXElementConstructor<any>
                          >
                        | Iterable<React.ReactNode>
                        | React.ReactPortal
                        | React.PromiseLikeOfReactNode
                        | null
                        | undefined;
                    }) => (
                      <td
                        style={{ backgroundColor: tableBg, color: textColor }}
                      >
                        {item.category}
                      </td>
                    ),
                    status: (item: {
                      status:
                        | string
                        | number
                        | boolean
                        | React.ReactElement<
                            any,
                            string | React.JSXElementConstructor<any>
                          >
                        | Iterable<React.ReactNode>
                        | React.ReactPortal
                        | React.PromiseLikeOfReactNode
                        | null
                        | undefined;
                    }) => (
                      <td style={{ backgroundColor: tableBg }}>
                        <Badge colorScheme={getStatusColor(item.status)}>
                          {item.status}
                        </Badge>
                      </td>
                    ),
                    repo: (item: { repo: string }) => (
                      <td style={{ backgroundColor: tableBg }}>
                        <Badge colorScheme="cyan">
                          {item.repo.toUpperCase()}
                        </Badge>
                      </td>
                    ),
                  }}
                />
              </Box>
            </CCardBody>
          </Box>
        )}
      </Box>
    </AllLayout>
  );
};

export default All;
