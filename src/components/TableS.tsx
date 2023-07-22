/* eslint-disable react-hooks/rules-of-hooks */
import { Box, Text, useColorModeValue, Wrap, WrapItem, Badge, Link } from "@chakra-ui/react";
import { CBadge, CButton, CCard, CCardBody, CCardFooter, CCardHeader, CCollapse, CSmartTable } from '@coreui/react-pro'
import React, { useEffect, useState } from 'react'
import FlexBetween from './FlexBetween'
import { motion } from "framer-motion";
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

import '@coreui/coreui/dist/css/coreui.min.css';
const Table = () => {
  const [data, setData] = useState<EIP[]>([]);



  const factorAuthor = (data: any) => {
    //
    let list = data.split(',')
    //
    for (let i = 0; i < list.length; i++) {
      list[i] = list[i].split(' ')
    }
    //
    if (list[list.length - 1][list[list.length - 1].length - 1] === 'al.') {
      list.pop()
    }
    return list
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/alleips`);
        const jsonData = await response.json();
        setData(jsonData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);
  

  const filteredData = data.map((item : any) => {
    const {
      eip,
      title,
      author,
      status,
      type,
      category,
    } = item;
    return {
      eip,
      title,
      author,
      status,
      type,
      category,
    };
  });

  const bg = useColorModeValue("#f6f6f7", "#171923");
  return (

    <Box className="coreui-styled-components mt-10 card-container">
<CCardBody
          style={{

            fontSize: '13px',
          }}
          className="scrollbarDesign"
        >
   <CSmartTable
    items={filteredData}
    activePage={1}
    clickableRows
    columnFilter
    columnSorter
    itemsPerPage={7}
    pagination
    tableProps={{
      // borderless: true,
      // striped: true,
      hover: true,
      responsive: true,
    }}
    scopedColumns={{
      eip: (item : any) => (
  
          
          <td style={{}}>
            <Link href={`/EIPS/${item.number}`}>
                    <Wrap>
                      <WrapItem>
                        <Badge colorScheme={getStatusColor(item.status)}>{item.eip}</Badge>
                      </WrapItem>
                    </Wrap>
                    </Link>
        </td>
      
      ),
      title: (item : any) => (
        <td
          style={{
            // borderBottomWidth: item.id % 2 !== 0 ? '1px' : '',
            // borderColor: item.id % 2 !== 0 ? `${getBadgeColor(item.status)}` : '',


            fontWeight: 'bold',
            height: '100%',
          }}
          className="hover:text-[#1c7ed6]"
        >
          <Link href={`/EIPS/${item.eip}`} className="hover:text-[#1c7ed6] text-[13px]">
            {item.title}
          </Link>
        </td>
      ),

      author: (it : any) => (
        <td>
          <div>
            {factorAuthor(it.author).map((item :any, index :any) => {
              let t = item[item.length - 1].substring(1, item[item.length - 1].length - 1)

              return (
                <Wrap>
                <WrapItem>
                  <Badge colorScheme={"linkedin"}>{t}</Badge>
                </WrapItem>
              </Wrap>
              )
            })}
          </div>
        </td>
      ),

      type: (item : any) => (
        <td style={{}}>
                    <Wrap>
                      <WrapItem>
                        <Badge colorScheme={getStatusColor(item.status)}>{item.type}</Badge>
                      </WrapItem>
                    </Wrap>
        </td>
      ),

      category: (item : any) => (
        <td style={{}}>
                    <Wrap>
                      <WrapItem>
                        <Badge colorScheme={getStatusColor(item.status)}>{item.category}</Badge>
                      </WrapItem>
                    </Wrap>
        </td>
      ),
      status: (item : any) => (
        <td style={{}}>
                    <Wrap>
                      <WrapItem>
                        <Badge colorScheme={getStatusColor(item.status)}>{item.status}</Badge>
                      </WrapItem>
                    </Wrap>
        </td>
      ),
    }}
  />
  </CCardBody>
  </Box>
  )
}

const getStatusColor = (status :any) => {
  switch (status) {
    case "Living":
      return "green";
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
export default Table;