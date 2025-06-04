"use client";
import {
    Box,
    Text,
    useColorModeValue,
    Wrap,
    WrapItem,
    Badge,
    Link,
    Flex,
    Button,
    Spinner
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CCardBody, CSmartTable } from "@coreui/react-pro";
import axios from "axios";
import DateTime from "@/components/DateTime";

interface RIP {
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
interface RipTableProps {
    dataset: RIP[];  // Using your RIP interface
    cat: string;
    status: string;
}
import "@coreui/coreui/dist/css/coreui.min.css";

const RipTable: React.FC<RipTableProps> = ({ dataset, cat, status }) => {
    const [data, setData] = useState<RIP[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("/api/new/all");
                const jsonData = await response.json();
                setData(jsonData.rip);
                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching RIP data:", error);
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const bgColor = useColorModeValue("#f6f6f7", "#171923");

    useEffect(() => {
        if (bgColor === "#171923") {
            setIsDarkMode(true);
        }
    }, [bgColor]);

    const factorAuthor = (data: string): string[][] => {
        // First split by comma to get array of strings
        const authors: string[] = data.split(",").map(author => author.trim());

        // Then split each author into words (array of arrays)
        const result: string[][] = authors.map(author => {
            // Handle empty strings if any
            if (!author) return [];
            return author.split(" ");
        });

        // Remove the last entry if it ends with "al."
        if (result.length > 0) {
            const lastAuthor = result[result.length - 1];
            if (lastAuthor.length > 0 && lastAuthor[lastAuthor.length - 1] === "al.") {
                result.pop();
            }
        }

        return result;
    };

    const filteredData = data.map((item) => {
        const { eip, title, author, repo, type, category, status } = item;
        return {
            rip: eip,
            title,
            author,
            repo,
            type,
            category,
            status,
        };
    });

    const bg = useColorModeValue("#f6f6f7", "#171923");
    const textColor = useColorModeValue("gray.800", "white");

    const downloadData = () => {
        const header = "Repo,RIP,Title,Author,Status,Type,Category,Discussion,Created at,Deadline,Link\n";
        const csv = header + data.map(d => {
            const url = `https://eipsinsight.com/rips/rip-${d.eip}`;
            const deadline = d.deadline || "";
            return `"${d.repo}","${d.eip}","${d.title.replace(/"/g, '""')}","${d.author.replace(/"/g, '""')}","${d.status}","${d.type}","${d.category}","${d.discussion}","${d.created}","${deadline}","${url}"`;
        }).join("\n");

        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "rip_data.csv";
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleDownload = async () => {
        try {
            downloadData();
            await axios.post("/api/DownloadCounter");
        } catch (error) {
            console.error("Download counter error:", error);
        }
    };

    return (
        <Box
            bgColor={bg}
            mt={6}
            p="1rem 1.5rem"
            borderRadius="0.55rem"
            as={motion.div}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 } as any}
            className="ease-in duration-200"
        >
            <Flex justify="space-between" align="center" mb={4}>
                <Text fontSize="2xl" fontWeight="bold" color="#30A0E0">
                    RIP Status Table [{data.length}]
                </Text>
                <Button size="sm" colorScheme="blue" onClick={handleDownload}>
                    Download CSV
                </Button>
            </Flex>

            <CCardBody>
                {isLoading ? (
                    <Flex justify="center" align="center" minH="200px">
                        <Spinner size="xl" />
                    </Flex>
                ) : (
                    <Box maxH="500px" overflowY="auto" w="full">
                        <CSmartTable
                            items={filteredData.sort(
                                (a, b) => parseInt(a["rip"]) - parseInt(b["rip"])
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
                                    borderRadius: "0.55rem",
                                    minWidth: "100%",
                                },
                            }}
                            columns={[
                                {
                                    key: "rip",
                                    label: "RIP",
                                    _style: {
                                        backgroundColor: isDarkMode ? "#2D3748" : "#F7FAFC",
                                        color: isDarkMode ? "white" : "black",
                                        fontWeight: "bold",
                                    },
                                },
                                {
                                    key: "title",
                                    label: "Title",
                                    _style: {
                                        backgroundColor: isDarkMode ? "#2D3748" : "#F7FAFC",
                                        color: isDarkMode ? "white" : "black",
                                        fontWeight: "bold",
                                    },
                                },
                                {
                                    key: "author",
                                    label: "Author",
                                    _style: {
                                        backgroundColor: isDarkMode ? "#2D3748" : "#F7FAFC",
                                        color: isDarkMode ? "white" : "black",
                                        fontWeight: "bold",
                                    },
                                },
                                {
                                    key: "type",
                                    label: "Type",
                                    _style: {
                                        backgroundColor: isDarkMode ? "#2D3748" : "#F7FAFC",
                                        color: isDarkMode ? "white" : "black",
                                        fontWeight: "bold",
                                    },
                                },
                                {
                                    key: "category",
                                    label: "Category",
                                    _style: {
                                        backgroundColor: isDarkMode ? "#2D3748" : "#F7FAFC",
                                        color: isDarkMode ? "white" : "black",
                                        fontWeight: "bold",
                                    },
                                },
                                {
                                    key: "status",
                                    label: "Status",
                                    _style: {
                                        backgroundColor: isDarkMode ? "#2D3748" : "#F7FAFC",
                                        color: isDarkMode ? "white" : "black",
                                        fontWeight: "bold",
                                    },
                                },
                            ]}
                            scopedColumns={{
                                rip: (item: any) => (
                                    <td
                                        key={item.rip}
                                        style={{ backgroundColor: isDarkMode ? "#2D3748" : "#F7FAFC" }}
                                    >
                                        <Link href={`/rips/rip-${item.rip}`}>
                                            <Wrap>
                                                <WrapItem>
                                                    <Badge colorScheme={getStatusColor(item.status)}>
                                                        {item.rip}
                                                    </Badge>
                                                </WrapItem>
                                            </Wrap>
                                        </Link>
                                    </td>
                                ),
                                title: (item: any) => (
                                    <td
                                        key={item.rip}
                                        style={{
                                            fontWeight: "bold",
                                            height: "100%",
                                            backgroundColor: isDarkMode ? "#2D3748" : "#F7FAFC",
                                        }}
                                        className="hover:text-[#1c7ed6]"
                                    >
                                        <Link
                                            href={`/rips/rip-${item.rip}`}
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
                                    <td
                                        key={it.author}
                                        style={{ backgroundColor: isDarkMode ? "#2D3748" : "#F7FAFC" }}
                                    >
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
                                                                href={`${item[item.length - 1].substring(
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
                                        key={item.rip}
                                        className={isDarkMode ? "text-white" : "text-black"}
                                        style={{ backgroundColor: isDarkMode ? "#2D3748" : "#F7FAFC" }}
                                    >
                                        {item.type}
                                    </td>
                                ),
                                category: (item: any) => (
                                    <td
                                        key={item.rip}
                                        className={isDarkMode ? "text-white" : "text-black"}
                                        style={{ backgroundColor: isDarkMode ? "#2D3748" : "#F7FAFC" }}
                                    >
                                        {item.category}
                                    </td>
                                ),
                                status: (item: any) => (
                                    <td
                                        key={item.rip}
                                        style={{ backgroundColor: isDarkMode ? "#2D3748" : "#F7FAFC" }}
                                    >
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
                    </Box>
                )}
            </CCardBody>
            <Box mt={4}>
                <DateTime />
            </Box>
        </Box>
    );
};

const getStatusColor = (status: string) => {
    switch (status) {
        case "Final":
            return "green";
        case "Draft":
            return "yellow";
        case "Review":
            return "blue";
        case "Last Call":
            return "orange";
        case "Living":
            return "purple";
        case "Stagnant":
            return "gray";
        case "Withdrawn":
            return "red";
        default:
            return "gray";
    }
};

export default RipTable;