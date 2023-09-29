import { Box, useColorModeValue, Wrap, WrapItem, Badge, Link } from "@chakra-ui/react";
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
  pr: string;
}

import '@coreui/coreui/dist/css/coreui.min.css';
import LoaderComponent from "./Loader";
interface TabProps {
    cat: any
  }


  const TableStatus: React.FC<TabProps> = ({cat})  => {
  const [isLoading, setIsLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);

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



  useEffect(()=> {
    if(bg === "#f6f6f7") {
      setIsDarkMode(false);
    } else {
        setIsDarkMode(true);
    }
  })

  
 
  const data = cat;
  const filteredData = data
  .map((item: any) => {
    const { eip, title, author, status, type, category, deadline } = item;
    return {
      eip,
      title,
      author,
      status,
      type,
      category,
      deadline
      
    };
  })
  console.log(filteredData)

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
          items={filteredData.sort((a : any, b: any) => parseInt(a.eip) - parseInt(b.eip))}
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
              deadline: (item: any) => {
                // Conditionally render the "deadline" column if the "status" is "Last Call"
                if (item.status === 'Last Call') {
                  return (
                    <td key={item.eip}>
                      <Wrap>
                        <WrapItem>
                          <Badge colorScheme={getStatusColor(item.status)}>{item.deadline}</Badge>
                        </WrapItem>
                      </Wrap>
                    </td>
                  );
                } else {
                  // Return null for other statuses to hide the column
                  return null;
                }
              },
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

export default TableStatus;
