import {
    Box,
    Text,
    useColorModeValue,
    Wrap,
    WrapItem,
    Badge,
    Link,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

import { CCardBody, CSmartTable } from "@coreui/react-pro";

interface ERC {
    _id: string;
    eip: string;          // Changed from eip to erc
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

interface AreaCProps {
    dataset: ERC[];
    status: string;
    cat: string;
}

import "@coreui/coreui/dist/css/coreui.min.css";

const StatusTable: React.FC<AreaCProps> = ({ cat, dataset, status }) => {
    const [data, setData] = useState<ERC[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDarkMode, setIsDarkMode] = useState(false);


    useEffect(() => {
        setInterval(() => {
            setIsLoading(false);
        }, 2000);
    }, []);

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
                setData(dataset);
                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching data:", error);
                setIsLoading(false);
            }
        };
        fetchData();
    }, [dataset]);

    useEffect(() => {
        if (bg === "#f6f6f7") {
            setIsDarkMode(false);
        } else {
            setIsDarkMode(true);
        }
    }, []);

    // Map dataset to filtered data (keeping same keys but replacing eip with erc)
    const filteredData = dataset.map((item) => {
        const { eip, title, author, repo, type, category, status } = item;
        return {
            eip,
            title,
            author,
            repo,
            type,
            category,
            status,
        };
    });

    const bg = useColorModeValue("#f6f6f7", "#171923");

    return (
        <>
            {filteredData.length > 0 ? (
                <Box
                    bgColor={bg}
                    mt={2}
                    p="1rem"
                    borderRadius="0.55rem"
                    as={motion.div}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 } as any}
                    className="ease-in duration-200 z-0"
                >
                    <CCardBody>
                        <>
                            <h2 className="text-blue-400 font-semibold text-4xl">{status}</h2>
                            <Box maxH="400px" overflowY="auto" w="full">
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
                                            borderRadius: "0.55rem",
                                            minWidth: "100%",
                                        },
                                    }}
                                    columns={[
                                        {
                                            key: "eip",
                                            label: "ERC",
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
                                        "#": (item: any) => (
                                            <td key={item.eip} style={{ backgroundColor: isDarkMode ? '#2D3748' : '#F7FAFC' }}>
                                                <Link href={`/${item.repo === 'erc' ? "ercs/erc" : item.repo === 'rip' ? "rips/rip" : "eips/eip"}-${item.eip}`}>
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
                                        erc: (item: any) => (
                                            <td
                                                key={item.erc}
                                                style={{ backgroundColor: isDarkMode ? "#2D3748" : "#F7FAFC" }}
                                            >
                                                <Link href={`/ercs/erc-${item.erc}`}>
                                                    <Wrap>
                                                        <WrapItem>
                                                            <Badge colorScheme={getStatusColor(item.status)}>
                                                                {item.erc}
                                                            </Badge>
                                                        </WrapItem>
                                                    </Wrap>
                                                </Link>
                                            </td>
                                        ),
                                        title: (item: any) => (
                                            <td
                                                key={item.erc}
                                                style={{
                                                    fontWeight: "bold",
                                                    height: "100%",
                                                    backgroundColor: isDarkMode ? "#2D3748" : "#F7FAFC",
                                                }}
                                                className="hover:text-[#1c7ed6]"
                                            >
                                                <Link
                                                    href={`/ercs/erc-${item.erc}`}
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
                                                key={item.erc}
                                                className={isDarkMode ? "text-white" : "text-black"}
                                                style={{ backgroundColor: isDarkMode ? "#2D3748" : "#F7FAFC" }}
                                            >
                                                {item.type}
                                            </td>
                                        ),
                                        category: (item: any) => (
                                            <td
                                                key={item.erc}
                                                className={isDarkMode ? "text-white" : "text-black"}
                                                style={{ backgroundColor: isDarkMode ? "#2D3748" : "#F7FAFC" }}
                                            >
                                                {item.category}
                                            </td>
                                        ),
                                        status: (item: any) => (
                                            <td
                                                key={item.erc}
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
        case "Meta":
            return "blue";
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

export default StatusTable;
