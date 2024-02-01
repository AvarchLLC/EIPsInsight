import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  useColorModeValue,
  Text,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

interface StatusChange {
  _id: string;
  count: number;
  statusChanges: {
    [key: string]: any; // Add index signature here
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
    repo: string;
  }[];
  repo: string;
}

interface APIData {
  erc: StatusChange[];
  eip: StatusChange[];
  rip: StatusChange[];
}

export default function InsightSummary() {
  const [data, setData] = useState<StatusChange[]>([]);
  const bg = useColorModeValue("#f6f6f7", "#171923");
  const path = usePathname();

  let year = "";
  let month = "";

  if (path) {
    const pathParts = path.split("/");
    year = pathParts[2];
    month = pathParts[3];
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/new/statusChanges/${year}/${month}`);
        const jsonData = await response.json();
        setData(jsonData.eip.concat(jsonData.erc).concat(jsonData.rip));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [year, month]);

  //   const eipData = data?.map((item) => {
  //     const { count, _id, repo } = item;
  //     if (repo === "eip") {
  //       return {
  //         count,
  //         _id,
  //         repo: "EIP",
  //       };
  //     }
  //   });

  //   const ercData = data?.map((item) => {
  //     const { count, _id, repo } = item;
  //     if (repo === "erc") {
  //       return {
  //         count,
  //         _id,
  //         repo: "ERC",
  //       };
  //     }
  //   });
  //   const ripData = data?.map((item) => {
  //     const { count, _id, repo } = item;

  //     if (repo === "rip") {
  //       return {
  //         count,
  //         _id,
  //         repo: "RIP",
  //       };
  //     }
  //   });

  const statuses = [
    "Draft",
    "Review",
    "Last Call",
    "Living",
    "Final",
    "Stagnant",
    "Withdrawn",
  ];
  const tableData = statuses.map((status) => {
    const statusData = data.filter((item) => item._id === status);
    return {
      _id: status,
      eipCount: statusData.filter((item) => item.repo === "eip")[0]?.count || 0,
      ercCount: statusData.filter((item) => item.repo === "erc")[0]?.count || 0,
      ripCount: statusData.filter((item) => item.repo === "rip")[0]?.count || 0,
    };
  });

  return (
    <>
      <Text fontSize="3xl" fontWeight="bold" color="blue.400" paddingTop={8}>
        Summary
      </Text>
      <TableContainer bg={bg} padding={4} rounded={"xl"} marginTop={8}>
        <Table variant="simple" size="md" bg={bg} padding={8}>
          <TableCaption>eipsinsight.com</TableCaption>
          <Thead>
            <Tr>
              <Th>Status</Th>
              <Th>EIP</Th>
              <Th>ERC</Th>
              <Th>RIP</Th>
              <Th isNumeric>Total</Th>
            </Tr>
          </Thead>
          <Tbody>
            {tableData.map((item) => {
              return (
                <>
                  <Tr>
                    <Td>{item._id}</Td>
                    <Td>
                      <a
                        href={`/monthly/eip/${year}/${month}/${
                          item._id === "Last Call" ? "LastCall" : item._id
                        }`}
                      >
                        {item.eipCount}
                      </a>
                    </Td>
                    <Td>
                      <a
                        href={`/monthly/erc/${year}/${month}/${
                          item._id === "Last Call" ? "LastCall" : item._id
                        }`}
                      >
                        {item.ercCount}
                      </a>
                    </Td>
                    <Td>
                      <a
                        href={`/monthly/rip/${year}/${month}/${
                          item._id === "Last Call" ? "LastCall" : item._id
                        }`}
                      >
                        {item.ripCount}
                      </a>
                    </Td>
                    <Td isNumeric>
                      {item.eipCount + item.ercCount + item.ripCount}
                    </Td>
                  </Tr>
                </>
              );
            })}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
}
