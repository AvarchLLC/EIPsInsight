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

  const numRows = 4 + 4;
  const rowHeight = 40; // Assuming each row has a height of 40px
  const maxHeight = `${numRows * rowHeight}px`;

  return (
    <Box
      bgColor={bg}
      marginTop={"2rem"}
      p="1rem 1rem"
      borderRadius="0.55rem"
      overflowX="auto"
      _hover={{
        border: "1px",
        borderColor: "#30A0E0",
      }}
      maxH={maxHeight}
      as={motion.div}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 } as any}
      className="hover: cursor-pointer ease-in duration-200 overflow-y-hidden"
    >
      <TableContainer>
        <Table variant="simple" minW="50%" maxH={"50%"} layout="fixed">
          <Thead>
            <Tr>
              <Th minW="50px">Other Stats</Th>
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
                <Link
                  href={`https://github.com/ethereum/EIPs`}
                  className="text-blue-400 hover:cursor-pointer font-semibold"
                >
                  {type === "EIPs" ? EIPdata.forksCount : ERCdata.forksCount}
                </Link>
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
                <Link
                  href={`https://github.com/ethereum/EIPs`}
                  className="text-blue-400 hover:cursor-pointer font-semibold"
                >
                  {type === "EIPs"
                    ? EIPdata.watchlistCount
                    : ERCdata.watchlistCount}
                </Link>
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
                <Link
                  href={`https://github.com/ethereum/EIPs`}
                  className="text-blue-400 hover:cursor-pointer font-semibold"
                >
                  {type === "EIPs" ? EIPdata.stars : ERCdata.stars}
                </Link>
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
                <Link
                  href={`https://github.com/ethereum/EIPs`}
                  className="text-blue-400 hover:cursor-pointer font-semibold"
                >
                  {type === "EIPs"
                    ? EIPdata.openIssuesCount
                    : ERCdata.openIssuesCount}
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
  );
};

export default OtherBox;
