import {
  Badge,
  Box,
  Link,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  Wrap,
  WrapItem,
  useColorModeValue,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import DateTime from "@/components/DateTime";
import React from "react";
import { type } from "os";

interface CustomBoxProps {
  data: {
    _id: string;
    count: number;
    statusChanges: {
      _id: string;
      eip: string;
      fromStatus: string;
      toStatus: string;
      title: string;
      status: string;
      author: string;
      created: string;
      changeDate: string;
      type: string;
      category: string;
      discussion: string;
      deadline: string;
      requires: string;
      pr: number;
      changedDay: number;
      changedMonth: number;
      changedYear: number;
      createdMonth: number;
      createdYear: number;
      __v: number;
    }[];
  }[];
  per: number;
  year: string;
  month: string;
  type: string;
}
const customStatusOrder = [
  "Draft",
  "Review",
  "Last Call",
  "Final",
  "Living",
  "Stagnant",
  "Withdrawn",
];

const sortByCustomOrder = (a: any, b: any) => {
  const statusA = customStatusOrder.indexOf(a._id);
  const statusB = customStatusOrder.indexOf(b._id);
  return statusA - statusB;
};

const CustomBox: React.FC<CustomBoxProps> = ({
  data,
  per,
  year,
  month,
  type,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Living":
        return "blue";
      case "Final":
        return "blue";
      case "Stagnant":
        return "gray";
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

  const getStatus = (status: string) => {
    switch (status) {
      case "Last Call":
        return "LastCall";
      default:
        return status;
    }
  };

  const bg = useColorModeValue("#f6f6f7", "#171923");
  const transformedData = data
    ?.filter((obj) => obj._id === "Final")
    ?.map((obj) => ({
      category: obj.statusChanges[0].category,
      number: obj.count,
    }));

  console.log(data);

  // const numRows = data?.length + 5;
  // const rowHeight = 40; // Assuming each row has a height of 40px
  // const maxHeight = `${numRows * rowHeight}px`;

  return (
    <Box
      bgColor={bg}
      p="1rem 1rem"
      borderRadius="0.55rem"
      overflowX="auto"
      _hover={{
        border: "1px",
        borderColor: "#30A0E0",
      }}
      // maxH={maxHeight}
      as={motion.div}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 } as any}
      className="hover: cursor-pointer ease-in duration-200 overflow-y-hidden h-full"
    >
      <TableContainer>
        <Table variant="simple" minW="50%" maxH={"50%"} layout="fixed">
          <Thead>
            <Tr>
              <Th minW="50px">Status</Th>
              <Th minW="200px">Numbers</Th>
              <Th minW={"200px"}>Percentage</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data.sort(sortByCustomOrder)?.map((entry, index) => (
              <Tr key={index}>
                <Td minW="100px">
                  <Wrap>
                    <WrapItem>
                      <Badge colorScheme={getStatusColor(entry._id)}>
                        {entry._id}
                      </Badge>
                    </WrapItem>
                  </Wrap>
                </Td>
                <Td>
                  <Link
                    href={`/monthly/${
                      type === "EIPs"
                        ? "eip"
                        : type === "ERCs"
                        ? "erc"
                        : type === "RIPs"
                        ? "rip"
                        : "eip"
                    }/${year}/${month}/${getStatus(entry._id)}`}
                    className="text-blue-400 hover:cursor-pointer font-semibold"
                  >
                    {entry.count}
                  </Link>
                </Td>
                <Td className={"text-blue-400"}>
                  {((entry.count / per) * 100).toFixed(2)}%
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
      <Box className={"w-full"}>
        <DateTime />
      </Box>
    </Box>
  );
};

export default CustomBox;
