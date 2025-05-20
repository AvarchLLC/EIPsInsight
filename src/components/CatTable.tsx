import {
  Box,
  Text,
  useColorModeValue,
  Wrap,
  WrapItem,
  Badge,
  Link,

} from "@chakra-ui/react";
import React, { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { DownloadIcon } from "@chakra-ui/icons";
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
  repo:string;
  unique_ID: number;
  __v: number;
}

interface AreaCProps {
  dataset: EIP[];
  status:string;
  cat:string;
}

import "@coreui/coreui/dist/css/coreui.min.css";
interface TabProps {
  cat: string;
}

interface TableProps {
  cat: string;
  // repo:string;
  status: string;
}

const CatTable: React.FC<AreaCProps> =  ({ cat, dataset, status }) => {
  const [data, setData] = useState<EIP[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  useEffect(() => {
    setInterval(() => {
      setIsLoading(false);
    }, 2000);
  });
  
  console.log(dataset);
  console.log(status);
  console.log(cat);

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
        console.log("dataset:",dataset)
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
    ?.filter((item) => (cat === "All" || item.category === cat) && item.status === status)
    ?.map((item) => {
      const { eip, title, author, repo, type, category, status, deadline } = item;
      return {
        eip,
        title,
        author,
        repo,
        type,
        category,
        status,
        deadline,
      };
    });

    console.log(" test filtered data:",filteredData);

  const bg = useColorModeValue("#f6f6f7", "#171923");

  return (
    <>
      {filteredData.length > 0 ? (
        <Box
          bgColor={bg}
          marginTop={"2"}
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
                    key: 'repo',
                    label: 'Repo',
                    _style: {
                      backgroundColor: isDarkMode ? '#2D3748' : '#F7FAFC',
                      color: isDarkMode ? 'white' : 'black',
                      fontWeight: 'bold',
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
                    label: 'category',
                    _style: {
                      backgroundColor: isDarkMode ? '#2D3748' : '#F7FAFC',
                      color: isDarkMode ? 'white' : 'black',
                      fontWeight: 'bold',
                    }
                  },
                  {
                    key: 'status',
                    label: 'status',
                    _style: {
                      backgroundColor: isDarkMode ? '#2D3748' : '#F7FAFC',
                      color: isDarkMode ? 'white' : 'black',
                      fontWeight: 'bold',
                    }
                  },
                  ...(status === "Last Call" ? [ // Conditionally add the deadline column
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
                  repo: (item: any) => (
                    <td key={item.repo} style={{ backgroundColor: isDarkMode ? '#2D3748' : '#F7FAFC' }}>
                      <Link href={`/${cat === "ERC" || item.repo==='erc' ? "ercs/erc" : item.repo==='rip'? "rips/rip" : "eips/eip"}-${item.eip}`}>
                        <Wrap>
                          <WrapItem>
                            <Badge colorScheme={getStatusColor(item.status)}>
                              {item.repo}
                            </Badge>
                          </WrapItem>
                        </Wrap>
                      </Link>
                    </td>
                  ),
                  eip: (item: any) => (
                    <td key={item.eip} style={{ backgroundColor: isDarkMode ? '#2D3748' : '#F7FAFC' }}>
                      <Link href={`/${cat === "ERC" || item.repo==='erc' ? "ercs/erc" : item.repo==='rip' ? "rips/rip" : "eips/eip"}-${item.eip}`}>
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
                        href={`/${cat === "ERC" || item.repo==='erc' ? "ercs/erc" : item.repo==='rip' ? "rips/rip" : "eips/eip"}-${item.eip}`}
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
                  ...(status === "Last Call" ? { // Conditionally add the deadline column renderer
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

export default CatTable;
