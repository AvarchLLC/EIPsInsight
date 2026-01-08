import React from "react";
import {
  Box,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useColorModeValue,
} from "@chakra-ui/react";
// import { getStatusColorScheme } from "@chakra-ui/alert/dist/alert-context";
import NextLink from "next/link";
import { useAllEipsData } from "@/hooks/useAllEipsData";

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

interface TableItems {
  status: string;
  count: number;
  per: number;
}

const StatusBox = () => {
  const { data: allEipsData } = useAllEipsData();
  const data = allEipsData?.eip ?? [];

  // Add a fallback for empty data to avoid runtime errors
  const safeData = data || [];

  const draftCount = safeData?.filter(
    (item) => item.category !== "ERC" && item.status === "Draft"
  )?.length;
  const reviewCount = safeData?.filter(
    (item) => item.category !== "ERC" && item.status === "Review"
  )?.length;
  const lastCallCount = safeData?.filter(
    (item) => item.category !== "ERC" && item.status === "Last Call"
  )?.length;
  const livingCount = safeData?.filter(
    (item) => item.category !== "ERC" && item.status === "Living"
  )?.length;
  const finalCount = safeData?.filter(
    (item) => item.category !== "ERC" && item.status === "Final"
  )?.length;
  const stagnantCount = safeData?.filter(
    (item) => item.category !== "ERC" && item.status === "Stagnant"
  )?.length;
  const withdrawnCount = safeData?.filter(
    (item) => item.category !== "ERC" && item.status === "Withdrawn"
  )?.length;

  const totalCount =
    draftCount +
    reviewCount +
    lastCallCount +
    livingCount +
    finalCount +
    stagnantCount +
    withdrawnCount;

  console.log("total count:", totalCount);

  const tableItems: Array<TableItems> = [
    {
      status: "Draft",
      count: draftCount,
      per: totalCount === 0 ? 0 : Math.round((draftCount / totalCount) * 100),
    },
    {
      status: "Review",
      count: reviewCount,
      per: totalCount === 0 ? 0 : Math.round((reviewCount / totalCount) * 100),
    },
    {
      status: "Last Call",
      count: lastCallCount,
      per:
        totalCount === 0 ? 0 : Math.round((lastCallCount / totalCount) * 100),
    },
    {
      status: "Living",
      count: livingCount,
      per: totalCount === 0 ? 0 : Math.round((livingCount / totalCount) * 100),
    },
    {
      status: "Final",
      count: finalCount,
      per: totalCount === 0 ? 0 : Math.round((finalCount / totalCount) * 100),
    },
    {
      status: "Stagnant",
      count: stagnantCount,
      per:
        totalCount === 0 ? 0 : Math.round((stagnantCount / totalCount) * 100),
    },
    {
      status: "Withdrawn",
      count: withdrawnCount,
      per:
        totalCount === 0 ? 0 : Math.round((withdrawnCount / totalCount) * 100),
    },
  ];

  const bg = useColorModeValue("#f6f6f7", "#171923");

  return (
    <Box
      borderRadius={"0.55rem"}
      className={"hover:border hover:border-blue-400 duration-200 px-6 py-4"}
      bgColor={bg}
    >
      <TableContainer>
        <Table variant={"simple"} size={"md"}>
          <Thead>
            <Tr>
              <Th>Status</Th>
              <Th>Numbers</Th>
              <Th>Percentage</Th>
            </Tr>
          </Thead>
          <Tbody>
            {tableItems?.map((item, index) => (
              <Tr key={index}>
                <Td>
                  <NextLink href={`/tableStatus/${item.status}`}>
                    {item.status}
                  </NextLink>
                </Td>
                <Td>
                  <NextLink href={`/tableStatus/${item.status}`}>
                    {item.count}
                  </NextLink>
                </Td>
                <Td>
                  <NextLink href={`/tableStatus/${item.status}`}>
                    {item.per}%
                  </NextLink>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default StatusBox;
