import { Box, Text, useColorModeValue, useTheme, Wrap, WrapItem, Badge } from "@chakra-ui/react";
import React, { useState } from "react";
import {
  Table as Tb,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
} from "@chakra-ui/react";
import ReactPaginate from "react-paginate";
import { mockEIP } from "@/data/eipdata";
import FlexBetween from "./FlexBetween";

const Table = () => {
  const data = mockEIP;
  const theme = useTheme();
  const bg = useColorModeValue("#f6f6f7", "#171923");
  
  const [filteredData, setFilteredData] = useState([]);

  const itemsPerPage = 10; // Number of items to display per page
  const pageSize = 10;
const totalPages = Math.ceil(filteredData.length / pageSize);
const [currentPage, setCurrentPage] = useState(1);

  const [searchTerm, setSearchTerm] = useState(""); // State for the search term
  const pageCount = Math.ceil(data.length / itemsPerPage);

  const handlePageChange = (selected: { selected: number }) => {
    setCurrentPage(selected.selected);
  };

  const startIndex = currentPage * itemsPerPage;
  const endIndex = (currentPage + 1) * itemsPerPage;
  const currentItems = data.slice(startIndex, endIndex);

  // Filter the data based on the search term
  const filteredItems = currentItems.filter((item) =>
    Object.values(item).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Handle the search term change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
  
    const filtered = data.filter((item) => {
      // Customize the condition based on your search logic
      const { eip, title, author, type, category, status } = item;
      return (
        eip.toString().includes(term) ||
        title.toLowerCase().includes(term) ||
        author.toLowerCase().includes(term) ||
        type.toLowerCase().includes(term) ||
        category.toLowerCase().includes(term) ||
        status.toLowerCase().includes(term)
      );
    });
    const [filteredData, setFilteredData] = useState<
  {
    _id: string;
    eip: number;
    title: string;
    author: string;
    status: string;
    type: string;
    category: string;
    created: string;
    requires: number[];
    last_call_deadline: string;
  }[]
>([]);
  
    setFilteredData(filtered);
  };
  const tableData = searchTerm ? filteredData : data;

  

  return (
    <Box
      bgColor={bg}
      marginTop={"12"}
      p="1rem 1rem"
      borderRadius="0.55rem"
      overflowX="auto"
      _hover={{
        border: "1px",
        borderColor: "#10b981",
      }}
      className="hover: cursor-pointer ease-in duration-200"
    >
            <FlexBetween>
        <Text fontSize="xl" fontWeight={"bold"} color={"#10b981"}>
          {`Search an EIP : ${mockEIP.length}`}
        </Text>
      </FlexBetween>
      <TableContainer>
        <Tb variant="simple" minW="100%" layout="fixed">
          <TableCaption>Data Grid</TableCaption>
          <Thead>
            <Tr>
              <Th minW="50px">EIP</Th>
              <Th minW="200px">Title</Th>
              <Th minW="200px">Author</Th>
              <Th minW="100px">Type</Th>
              <Th minW="100px">Category</Th>
              <Th minW="100px">Status</Th>
            </Tr>
            <Tr>
  <Th>
    <input
      type="text"
      value={searchTerm}
      onChange={handleSearchChange}
      placeholder="Search EIP"
      className="px-2 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </Th>
  <Th>
    <input
      type="text"
      value={searchTerm}
      onChange={handleSearchChange}
      placeholder="Search Title"
      className="px-2 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </Th>
  <Th>
    <input
      type="text"
      value={searchTerm}
      onChange={handleSearchChange}
      placeholder="Search Author"
      className="px-2 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </Th>
  <Th>
    <input
      type="text"
      value={searchTerm}
      onChange={handleSearchChange}
      placeholder="Search Type"
      className="px-2 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </Th>
  <Th>
    <input
      type="text"
      value={searchTerm}
      onChange={handleSearchChange}
      placeholder="Search Category"
      className="px-2 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </Th>
  <Th>
    <input
      type="text"
      value={searchTerm}
      onChange={handleSearchChange}
      placeholder="Search Status"
      className="px-2 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </Th>
</Tr>
          </Thead>
          <Tbody>
            {tableData.slice((currentPage - 1) * pageSize, currentPage * pageSize).map((item) => (
              <Tr key={item._id}>
                <Td minW="50px" overflow="hidden" whiteSpace="nowrap" textOverflow="ellipsis">
                  {item.eip}
                </Td>
                <Td minW="200px" overflow="hidden" whiteSpace="nowrap" textOverflow="ellipsis">
                  {item.title}
                </Td>
                <Td minW="200px" overflow="hidden" whiteSpace="nowrap" textOverflow="ellipsis">
                  {item.author}
                </Td>
                <Td minW="100px" overflow="hidden" whiteSpace="nowrap" textOverflow="ellipsis">
                  {item.type}
                </Td>
                <Td minW="100px" overflow="hidden" whiteSpace="nowrap" textOverflow="ellipsis">
                  {item.category}
                </Td>
                <Td minW="100px">
                  <Wrap>
                    <WrapItem>
                      <Badge colorScheme={getStatusColor(item.status)}>
                        {item.status}
                      </Badge>
                    </WrapItem>
                  </Wrap>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Tb>
      </TableContainer>

      <Box display="flex" justifyContent="center" mt="4">
        <ReactPaginate
          previousLabel={"Previous"}
          nextLabel={"Next"}
          breakLabel={"..."}
          pageCount={pageCount}
          onPageChange={handlePageChange}
          containerClassName={"pagination flex justify-center"}
          pageClassName={"px-2"}
          previousClassName={"px-2"}
          nextClassName={"px-2"}
          breakClassName={"px-2"}
          activeClassName={"active"}
          previousLinkClassName={"border rounded px-3 py-1 bg-green-400"}
          nextLinkClassName={"border rounded px-3 py-1 bg-green-400"}
          breakLinkClassName={"border rounded px-3 py-1 bg-green-400"}
          pageLinkClassName={"border rounded px-3 py-1 bg-green-400"}
          disabledClassName={"text-black-300"}
        />
      </Box>
    </Box>
  );
};

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

export default Table;