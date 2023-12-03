import React, { useState } from "react";
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
import Header from "@/components/Header";
import CustomBox from "@/components/CustomBox";
import StackedColumnChart from "@/components/DraftBarChart";
import { PieC } from "@/components/InPie";
import OtherBox from "@/components/OtherStats";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import DateTime from "@/components/DateTime";
import NextLink from "next/link";

function getMonthName(monthNumber: number): string {
  const date = new Date();
  date.setMonth(monthNumber - 1); // Subtract 1 since months are zero-mdd in JavaScript
  const monthName = date.toLocaleString("default", { month: "long" });
  return monthName;
}

const EmptyInsight = () => {
  const path = usePathname();
  let year = "";
  let month = "";
  if (path) {
    const pathParts = path.split("/");
    year = pathParts[2];
    month = pathParts[3];
  }
  const prevMonth = Number(month) - 1;
  const prevMonthName = getMonthName(prevMonth);
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
  const bg = useColorModeValue("#f6f6f7", "#171923");
  const maxHeight = "285px";
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box
          paddingBottom={{ lg: "10", sm: "10", base: "10" }}
          marginX={{ lg: "40", md: "2", sm: "2", base: "2" }}
          paddingX={{ lg: "10", md: "5", sm: "5", base: "5" }}
          marginTop={{ lg: "10", md: "5", sm: "5", base: "5" }}
        >
          <Header title={getMonthName(Number(month))} subtitle={year} />

          <Box paddingY={8}>
            <p className={"text-2xl"}>
              There is no data available for this month. Would you like to see{" "}
              <NextLink href={`/insight/${year}/${prevMonth}`}>
                <span className={"text-blue-400 font-bold"}>
                  {prevMonthName} {year}
                </span>
              </NextLink>{" "}
              insights?
            </p>
          </Box>

          <Box className={"grid grid-cols-2 gap-10 h-full"}>
            <Box
              bgColor={bg}
              marginTop={"2rem"}
              p="1rem 1rem"
              borderRadius="0.55rem"
              overflowX="auto"
              overflowY={"hidden"}
              _hover={{
                border: "1px",
                borderColor: "#30A0E0",
              }}
              maxH={maxHeight}
              as={motion.div}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 } as any}
              className="hover: cursor-pointer ease-in duration-200"
            >
              <TableContainer>
                <Table variant="simple" minW="50%" maxH={"50%"} layout="fixed">
                  <Thead>
                    <Tr>
                      <Th minW="50px">Status</Th>
                      <Th minW="200px">Numbers</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    <Tr>
                      <Td minW="100px">
                        <Wrap>
                          <WrapItem>
                            <Badge colorScheme={getStatusColor("Draft")}>
                              Draft
                            </Badge>
                          </WrapItem>
                        </Wrap>
                      </Td>
                      <Td>
                        <Link
                          href={`/`}
                          className="text-blue-400 hover:cursor-pointer font-semibold"
                        >
                          0
                        </Link>
                      </Td>
                    </Tr>

                    <Tr>
                      <Td minW="100px">
                        <Wrap>
                          <WrapItem>
                            <Badge colorScheme={getStatusColor("Review")}>
                              Review
                            </Badge>
                          </WrapItem>
                        </Wrap>
                      </Td>
                      <Td>
                        <Link
                          href={`/`}
                          className="text-blue-400 hover:cursor-pointer font-semibold"
                        >
                          0
                        </Link>
                      </Td>
                    </Tr>

                    <Tr>
                      <Td minW="100px">
                        <Wrap>
                          <WrapItem>
                            <Badge colorScheme={getStatusColor("Last Call")}>
                              Last Call
                            </Badge>
                          </WrapItem>
                        </Wrap>
                      </Td>
                      <Td>
                        <Link
                          href={`/`}
                          className="text-blue-400 hover:cursor-pointer font-semibold"
                        >
                          0
                        </Link>
                      </Td>
                    </Tr>

                    <Tr>
                      <Td minW="100px">
                        <Wrap>
                          <WrapItem>
                            <Badge colorScheme={getStatusColor("Final")}>
                              Final
                            </Badge>
                          </WrapItem>
                        </Wrap>
                      </Td>
                      <Td>
                        <Link
                          href={`/`}
                          className="text-blue-400 hover:cursor-pointer font-semibold"
                        >
                          0
                        </Link>
                      </Td>
                    </Tr>

                    <Tr>
                      <Td minW="100px">
                        <Wrap>
                          <WrapItem>
                            <Badge colorScheme={getStatusColor("Last Call")}>
                              Stagnant
                            </Badge>
                          </WrapItem>
                        </Wrap>
                      </Td>
                      <Td>
                        <Link
                          href={`/`}
                          className="text-blue-400 hover:cursor-pointer font-semibold"
                        >
                          0
                        </Link>
                      </Td>
                    </Tr>
                  </Tbody>
                </Table>
              </TableContainer>
              <Box className={"w-full"}>
                <DateTime />
              </Box>
            </Box>
            <OtherBox type={"EIPs"} />
          </Box>

          <Text
            fontSize="3xl"
            fontWeight="bold"
            color="blue.400"
            paddingTop={8}
          >
            Draft
          </Text>
          <Box paddingTop={"8"}>
            <StackedColumnChart status="Draft" />
          </Box>
          <Text
            fontSize="3xl"
            fontWeight="bold"
            color="blue.400"
            paddingTop={8}
          >
            Final
          </Text>
          <Box paddingY={"8"}>
            <StackedColumnChart status="Final" />
          </Box>
        </Box>
      </motion.div>
    </>
  );
};

export default EmptyInsight;
