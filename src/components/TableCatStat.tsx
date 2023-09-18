import { Box, Text, useColorModeValue, Wrap, WrapItem, Badge, Link } from "@chakra-ui/react";
import { CCardBody, CSmartTable } from '@coreui/react-pro';
import React, { useEffect, useState } from 'react';
import { motion } from "framer-motion";
import { Spinner } from "@chakra-ui/react";

const statusArr = ['Final', 'Draft', 'Review', 'Last_Call', 'Stagnant', 'Withdrawn', 'Living']

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
}

async function fetchLastCreatedYearAndMonthFromAPI(eipNumber: number): Promise<{ mergedYear: string, mergedMonth: string } | null> {
  try {
    const apiUrl = `/api/eipshistory/${eipNumber}`;
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    if (Array.isArray(data) && data.length > 0) {
      const lastElement = data[0];
      const lastElementCreatedYear = lastElement.mergedYear;
      const lastElementCreatedMonth = lastElement.mergedMonth;
      return { mergedYear: lastElementCreatedYear, mergedMonth: lastElementCreatedMonth };
    } else {
      throw new Error('No data found or data format is invalid.');
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}

import '@coreui/coreui/dist/css/coreui.min.css';
import LoaderComponent from "./Loader";
import DateTime from "./DateTime";
interface TabProps {
    cat: string;
    status :string;
  }


const TableCatStat: React.FC<TabProps> = ({cat, status})  => {
  const [data, setData] = useState<EIP[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mergedData, setMergedData] = useState<{ mergedYear: string, mergedMonth: string }[]>([]);


  const factorAuthor = (data: any) => {
    let list = data.split(',');
    for (let i = 0; i < list.length; i++) {
      list[i] = list[i].split(' ');
    }
    if (list[list.length - 1][list[list.length - 1].length - 1] === 'al.') {
      list.pop();
    }
    return list;
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/alleips`);
        const jsonData = await response.json();
        setData(jsonData);
        setIsLoading(false); // Set isLoading to false after data is fetched

        // Fetch merged years and months for each item
        const mergedDataPromises = jsonData.map((item: any) =>
          fetchLastCreatedYearAndMonthFromAPI(item.eip)
        );

        // Wait for all promises to resolve
        const mergedDataValues = await Promise.all(mergedDataPromises);
        setMergedData(mergedDataValues);
      } catch (error) {
        console.error('Error fetching data:', error);
        setIsLoading(false); // Set isLoading to false if there's an error
      }
    };
    fetchData();
  }, []);


  useEffect(()=> {
    if(bg === "#f6f6f7") {
      setIsDarkMode(false);
    } else {
        setIsDarkMode(true);
    }
  })

  const filteredData = data
  .map((item: any) => {
    const { eip, title, author, status, type, category} = item;
    return {
      eip,
      title,
      author,
      status,
      type,
      category,
    };
  })
  .filter((item: any) => item.category === cat && item.status === status );
  const filteredDataWithMergedYearsAndMonths = filteredData.map((item, index) => ({
    ...item,
    mergedYear: mergedData[index]?.mergedYear || '', // Replace '' with a default value if needed
    mergedMonth: mergedData[index]?.mergedMonth || '', // Replace '' with a default value if needed
  }));
  const bg = useColorModeValue("#f6f6f7", "#171923");

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
          fontSize: '13px',
        }}
        className="scrollbarDesign"
      >
        {isLoading ? ( // Show loader while data is loading
          <Box display="flex" justifyContent="center" alignItems="center" height="200px">
           <Spinner/>
          </Box>
        ) : (
          <CSmartTable
          items={filteredDataWithMergedYearsAndMonths .sort(
            (a, b) => parseInt(a.eip) - parseInt(b.eip)
          )}
            activePage={1}
            clickableRows
            columnFilter
            columnSorter
            itemsPerPage={7}
            pagination
            tableProps={{
              hover: true,
              responsive: true,
            }}
            scopedColumns={{
              eip: (item: any) => (
                  <td key={item.eip}>
                    <Link href={`/EIPS/${item.eip}`}>
                      <Wrap>
                        <WrapItem>
                          <Badge colorScheme={getStatusColor(item.status)}>{item.eip}</Badge>
                        </WrapItem>
                      </Wrap>
                    </Link>
                  </td>
              ),
              title: (item: any) => (
                  <td key={item.eip} style={{ fontWeight: 'bold', height: '100%' }} className="hover:text-[#1c7ed6]">
                    <Link href={`/EIPS/${item.eip}`} className={isDarkMode? "hover:text-[#1c7ed6] text-[13px] text-white" : "hover:text-[#1c7ed6] text-[13px] text-black"}>
                      {item.title}
                    </Link>
                  </td>
              ),
              author: (it: any) => (
                  <td key={it.author}>
                    <div>
                      {factorAuthor(it.author).map((item: any, index: any) => {
                        let t = item[item.length - 1].substring(1, item[item.length - 1].length - 1);
                        return (
                            <Wrap key={index}>
                              <WrapItem>
                              <Link href={`${
                          item[item.length - 1].substring(item[item.length - 1].length - 1) ===
                          '>'
                            ? 'mailto:' + t
                            : 'https://github.com/' + t.substring(1)
                        }`} target="_blank" className={isDarkMode? "hover:text-[#1c7ed6] text-[13px] text-white" : "hover:text-[#1c7ed6] text-[13px] text-black"}>
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
                  <td key={item.eip} className={isDarkMode ? "text-white" : "text-black"}>
                    {item.type}
                  </td>
              ),
              category: (item: any) => (
                  <td key={item.eip} className={isDarkMode ? "text-white" : "text-black"}>
                    {item.category}
                  </td>
              ),
              status: (item: any) => (
                  <td key={item.eip}>
                    <Wrap>
                      <WrapItem>
                        <Badge colorScheme={getStatusColor(item.status)}>{item.status}</Badge>
                      </WrapItem>
                    </Wrap>
                  </td>
              ),
              mergedYear: (item: any) => (
                <td key={item.eip}>
                  <Wrap>
                    <WrapItem>
                    <Badge colorScheme={getStatusColor(item.status)}> {item.mergedYear}</Badge>
                  </WrapItem>
                  </Wrap>
                </td>
              ),
              mergedMonth: (item: any) => (
                <td key={item.eip}>
                  <Wrap>
                    <WrapItem>
                    <Badge colorScheme={getStatusColor(item.status)}> {item.mergedMonth}</Badge>
                  </WrapItem>
                  </Wrap>
                </td>
              ),
            }}
          />
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
      return "orange"
    case "Withdrawn":
      return "red"
    case "Last Call":
      return "yellow"
    default:
      return "gray";
  }
};

export default TableCatStat;
