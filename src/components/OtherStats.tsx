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
  Flex,
  Button,
  Wrap,
  WrapItem,
  useColorModeValue,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import DateTime from "@/components/DateTime";
import { type } from "os";

interface EIP {
  forksCount: number;
  watchlistCount: number;
  stars: number;
  openIssuesCount: number;
}

interface Props {
  type: string;
} 

const OtherBox: React.FC<Props> = ({ type }) => {
  const [EIPdata, setEIPData] = useState<EIP>({
    forksCount: 0,
    watchlistCount: 0,
    stars: 0,
    openIssuesCount: 0,
  });
  const [ERCdata, setERCData] = useState<EIP>({
    forksCount: 0,
    watchlistCount: 0,
    stars: 0,
    openIssuesCount: 0,
  });
  const [RIPdata, setRIPData] = useState<EIP>({
    forksCount: 0,
    watchlistCount: 0,
    stars: 0,
    openIssuesCount: 0,
  });

  const bg = useColorModeValue("#f6f6f7", "#171923");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/EIPinfo`);
        const jsonData = await response.json();
        setEIPData(jsonData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/ERCinfo`);
        const jsonData = await response.json();
        setERCData(jsonData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/RIPInfo`);
        const jsonData = await response.json();
        setRIPData(jsonData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <Box
      bgColor={bg}
      p="1rem"
      minHeight="605px"
      borderRadius="0.55rem"
      _hover={{
        border: "1px",
        borderColor: "#30A0E0",
      }}
      className="hover:cursor-pointer ease-in duration-200 overflow-y-hidden h-[32.5rem]"
      // display="flex"
      // justifyContent="center"
      // alignItems="center"
    >
      <Box width="100%" maxWidth="800px">
      <Flex justifyContent="flex-end" marginBottom="1rem">
    <Button
      colorScheme="blue"
      onClick={() => {
        const csvContent = [
          ["Type", "Forks Count", "Watchlist Count", "Stars", "Open Issues Count"], // Headers
          type === "EIPs"
            ? ["EIPs", EIPdata.forksCount, EIPdata.watchlistCount, EIPdata.stars, EIPdata.openIssuesCount]
            : type === "ERCs"
            ? ["ERCs", ERCdata.forksCount, ERCdata.watchlistCount, ERCdata.stars, ERCdata.openIssuesCount]
            : ["RIPs", RIPdata.forksCount, RIPdata.watchlistCount, RIPdata.stars, RIPdata.openIssuesCount],
        ]
          .map((row) => row.join(","))
          .join("\n");

        // Create a Blob and trigger download
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${type}_stats_report.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }}
    >
      Download CSV
    </Button>
  </Flex>
  <Box
  //  display="flex"
  //     justifyContent="center"
  //     alignItems="center"
      >
        <TableContainer>
          <Table variant="simple" minW="50%" layout="fixed">
            <Thead>
              <Tr>
                <Th minW="50px">Github Stats</Th>
                <Th minW="200px">Numbers</Th>
              </Tr>
            </Thead>
            <Tbody>
              <Tr key="forks">
                <Td minW="100px">
                  <Wrap>
                    <WrapItem>
                      <Badge colorScheme="orange">Forks</Badge>
                    </WrapItem>
                  </Wrap>
                </Td>
                <Td>
                  <Text
                    // href={`https://github.com/ethereum/EIPs`}
                    className="text-blue-400 hover:cursor-pointer font-semibold"
                  >
                    {type === "EIPs"
                      ? EIPdata.forksCount
                      : type === "ERCs"
                      ? ERCdata.forksCount
                      : type === "RIPs"
                      ? RIPdata.forksCount
                      : EIPdata.forksCount}
                  </Text>
                </Td>
              </Tr>
              <Tr key="watchlist">
                <Td minW="100px">
                  <Wrap>
                    <WrapItem>
                      <Badge colorScheme="orange">Watchlist</Badge>
                    </WrapItem>
                  </Wrap>
                </Td>
                <Td>
                  <Text
                    // href={`https://github.com/ethereum/EIPs`}
                    className="text-blue-400 hover:cursor-pointer font-semibold"
                  >
                    {type === "EIPs"
                      ? EIPdata.watchlistCount
                      : type === "ERCs"
                      ? ERCdata.watchlistCount
                      : type === "RIPs"
                      ? RIPdata.watchlistCount
                      : EIPdata.watchlistCount}
                  </Text>
                </Td>
              </Tr>
              <Tr key="stars">
                <Td minW="100px">
                  <Wrap>
                    <WrapItem>
                      <Badge colorScheme="orange">Stars</Badge>
                    </WrapItem>
                  </Wrap>
                </Td>
                <Td>
                  <Text
                    // href={`https://github.com/ethereum/EIPs`}
                    className="text-blue-400 hover:cursor-pointer font-semibold"
                  >
                    {type === "EIPs"
                      ? EIPdata.stars
                      : type === "ERCs"
                      ? ERCdata.stars
                      : type === "RIPs"
                      ? RIPdata.stars
                      : EIPdata.stars}
                  </Text>
                </Td>
              </Tr>
              <Tr key="openissues">
                <Td minW="100px">
                  <Wrap>
                    <WrapItem>
                      <Badge colorScheme="orange">Open Issues & PR</Badge>
                    </WrapItem>
                  </Wrap>
                </Td>
                <Td>
                  <Text
                    // href={`https://github.com/ethereum/EIPs`}
                    className="text-blue-400 hover:cursor-pointer font-semibold"
                  >
                    {type === "EIPs"
                      ? EIPdata.openIssuesCount
                      : type === "ERCs"
                      ? ERCdata.openIssuesCount
                      : type === "RIPs"
                      ? RIPdata.openIssuesCount
                      : EIPdata.openIssuesCount}
                  </Text>
                </Td>
              </Tr>
            </Tbody>
          </Table>
        </TableContainer>
        </Box>
        <Box className="w-full" mt="1rem">
          <DateTime />
        </Box>
      </Box>
    </Box>
  );
  
};

export default OtherBox;
