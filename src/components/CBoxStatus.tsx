import React, { useEffect, useState } from 'react';
import { Badge, Box, Link, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr, Wrap, WrapItem, useColorModeValue } from "@chakra-ui/react";
import { motion } from 'framer-motion';
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
interface CBoxTypeProps {
    status: string;
  }

const CBoxStatus: React.FC<CBoxTypeProps> = ( { status } ) => {
  const [data, setData] = useState<EIP[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/alleips`);
        const jsonData = await response.json();
        setData(jsonData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const result: { [key: string]: number } = {};

  data.forEach(item => {
    if (item.type === "Standards Track" && item.status===status) {
      if (item.category === "Core") {
        result["Standard - Core"] = (result["Standard - Core"] || 0) + 1;
      } else if (item.category === "ERC") {
        result["Standard - ERC"] = (result["Standard - ERC"] || 0) + 1;
      } else if (item.category === "Networking") {
        result["Standard - Networking"] = (result["Standard - Networking"] || 0) + 1;
      } else if (item.category === "Interface") {
        result["Standard - Interface"] = (result["Standard - Interface"] || 0) + 1;
      }
    } else if (item.type === "Meta" && item.status===status) {
      result["Meta"] = (result["Meta"] || 0) + 1;
    } else if (item.type === "Informational" && item.status===status) {
      result["Informational"] = (result["Informational"] || 0) + 1;
    }
  });

  console.log(result)

  const numRows = data.length + 4;
  const rowHeight = 40; // Assuming each row has a height of 40px
  const maxHeight = `${numRows * rowHeight}px`;
  const rows = [];
  const standardTrackKeys = [];

  for (const key in result) {
    if (key.startsWith("Standard")) {
      standardTrackKeys.push(key);
    } else {
      rows.push(
        <Tr key={key}>
          <Td minW="100px">
            <Wrap>
              <WrapItem>
                <Badge colorScheme="pink">{key}</Badge>
              </WrapItem>
            </Wrap>
          </Td>
          <Td>
            <Link
              href={`/numbers-route`}
              className="text-emerald-400 hover:cursor-pointer font-semibold"
            >
              {result[key]}
            </Link>
          </Td>
        </Tr>
      );
    }
  }

  standardTrackKeys.sort();

  for (const key of standardTrackKeys) {
    rows.unshift(
      <Tr key={key}>
        <Td minW="100px">
          <Wrap>
            <WrapItem>
              <Badge colorScheme="blue">{key}</Badge>
            </WrapItem>
          </Wrap>
        </Td>
        <Td>
          <Link
            href={`/numbers-route`}
            className="text-emerald-400 hover:cursor-pointer font-semibold"
          >
            {result[key]}
          </Link>
        </Td>
      </Tr>
    );
  }

  const bg = useColorModeValue("#f6f6f7", "gray.700");

  return (
    <Box
      bgColor={bg}
      marginTop={"2rem"}
      p="1rem 1rem"
      borderRadius="0.55rem"
      overflowX="auto"
      _hover={{
        border: "1px",
        borderColor: "#10b981",
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
              <Th minW="50px">Type - Category</Th>
              <Th minW="200px">Numbers</Th>
            </Tr>
          </Thead>
          <Tbody>
            {rows}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default CBoxStatus;
