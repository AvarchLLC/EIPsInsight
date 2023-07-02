import { Badge, Box, Link, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr, Wrap, WrapItem, useColorModeValue } from "@chakra-ui/react";

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
}

const CustomBox: React.FC<CustomBoxProps> = ({ data }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Living":
        return "green";
      case "Final":
        return "blue";
      case "Stagnant":
        return "gray";
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

  const bg = useColorModeValue("#f6f6f7", "#171923");
  const transformedData = data
    .filter(obj => obj._id === 'Final')
    .map(obj => ({ category: obj.statusChanges[0].category, number: obj.count }));

  console.log(transformedData);

  const numRows = data.length + 4;
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
        borderColor: "#10b981",
      }}
      maxH={maxHeight}
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
            {data.map((entry, index) => (
              <Tr key={index}>
                <Td minW="100px">
                  <Wrap>
                    <WrapItem>
                      <Badge colorScheme={getStatusColor(entry._id)}>{entry._id}</Badge>
                    </WrapItem>
                  </Wrap>
                </Td>
                <Td>
                  <Link
                    href={`/numbers-route-${index + 1}`}
                    className="text-emerald-400 hover:cursor-pointer font-semibold"
                  >
                    {entry.count}
                  </Link>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default CustomBox;
