import { Badge, Box, Link, Text, useColorModeValue, Flex } from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import { TableContainer } from "@chakra-ui/react";
import { CBadge, CCard, CCardBody, CCardFooter, CCardHeader, CSmartTable } from "@coreui/react-pro";
import FlexBetween from "./FlexBetween";

const formatDate = (date: string, month: number, year: string): string => {
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"
  ];


  return `${months[month + 1]} ${date}, ${year}`;
};

function getStatusDate(data: any, status: string) {
  const item = data.reverse().find((item: any) => getStatus(item.status) === status);
  return item ? formatDate(item.mergedDay, item.mergedMonth, item.mergedYear || 0) : "N/A";
}

interface EIP {
  _id: string;
  eip: string;
  title: string;
  author: string;
  status: string;
  type: string;
  category: string;
  created: string;
  discussion: string | undefined;
  deadline: string | undefined;
  requires: string | undefined;
  commitSha: string;
  commitDate: string;
  mergedDate: string;
  prNumber: number;
  closedDate: string;
  changes: number;
  insertions: number;
  deletions: number;
  mergedDay: number;
  mergedMonth: number;
  mergedYear: number;
  createdMonth: number;
  createdYear: number;
  previousdeadline: string | undefined;
  newdeadline: string | undefined;
  message: string;
  __v: number;
}

const getStatus = (status: string) => {
  switch (status) {
    case "Draft":
      return "Draft";
    case "Final":
    case "Accepted":
    case "Superseded":
      return "Final";
    case "Last Call":
      return "Last Call";
    case "Withdrawn":
    case "Abandoned":
    case "Rejected":
      return "Withdrawn";
    case "Review":
      return "Review";
    case "Living":
    case "Active":
      return "Living";
    case "Stagnant":
      return "Stagnant";
    default:
      return "Final";
  }
};



interface ProgProps {
  num: string; // Change the type of 'num' prop to number
}

const Prog: React.FC<ProgProps> = ({ num }) => {
  const bg = useColorModeValue("#f6f6f7", "#171923");
  const [data, setData] = useState<EIP[]>([]); // Update the type of 'data' state

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/eipshistory/${num}`);
        const jsonData = await response.json();
        setData(jsonData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [num]);



  console.log(data)


  return (
    <>
      <Flex>
        {/*<Flex alignItems="center" justifyContent="space-between" p="1rem" borderRadius="8px" position="relative" paddingTop={5}>*/}
        {/*    */}
        {/*</Flex>*/}
        <Box>
          {/*<Box bg={bg} width="100%" height="20px" position="absolute" top="50%" left="0" transform="translateY(-50%)" />*/}
          <Flex>
            <Box bg={"blue.500"} w="150px" h="70px" borderRadius="0.7rem" textAlign="center" lineHeight="70px" fontSize="22px" color="white" position="relative" fontWeight='semibold'>
              DRAFT
            </Box>
            <Box bg={bg} w="150px" h="50px" borderRadius="0.55rem" textAlign="center" lineHeight="50px" color="blue.500" position="relative" fontWeight='semibold'>
              {getStatusDate(data, "Draft")}
            </Box>
          </Flex>

          <Flex>
            <Box bg={"blue.500"} w="150px" h="70px" borderRadius="0.7rem" textAlign="center" lineHeight="70px" fontSize="22px" color="white" position="relative" fontWeight='semibold'>
              REVIEW
            </Box>
            <Box bg={bg} w="150px" h="50px" borderRadius="0.55rem" textAlign="center" lineHeight="50px" color="blue.500" position="relative" fontWeight='semibold'>
              {getStatusDate(data, "Review")}
            </Box>
          </Flex>

          <Flex>
            <Box bg={"blue.500"} w="150px" h="70px" borderRadius="0.7rem" textAlign="center" lineHeight="70px" fontSize="22px" color="white" position="relative" fontWeight='semibold'>
              LAST CALL
            </Box>
            <Box bg={bg} w="150px" h="50px" borderRadius="0.55rem" textAlign="center" lineHeight="50px" color="blue.500" position="relative" fontWeight='semibold'>
              {getStatusDate(data, "Last Call")}
            </Box>
          </Flex>

          <Flex>
            <Box bg={"blue.500"} w="150px" h="70px" borderRadius="0.7rem" textAlign="center" lineHeight="70px" fontSize="22px" color="white" position="relative" fontWeight='semibold'>
              FINAL
            </Box>
            <Box bg={bg} w="150px" h="50px" borderRadius="0.55rem" textAlign="center" lineHeight="50px" color="blue.500" position="relative" fontWeight='semibold'>
              {getStatusDate(data, "Final")}
            </Box>
          </Flex>
        </Box>
        {/*<Flex alignItems="center" justifyContent="space-between" p="1rem" borderRadius="8px" position="relative">*/}

        {/*    */}
        {/*</Flex>*/}

        <Box
          className={'justify-center items-center'}
        >




        </Box>
      </Flex>
    </>

  );
};

export default Prog;
