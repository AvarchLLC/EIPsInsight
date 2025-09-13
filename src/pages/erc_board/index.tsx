import {
    Box,
    Heading,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
    Link as LI,
    Spinner,
    Text,
  } from "@chakra-ui/react";
  import React, { useEffect, useState } from "react";
  import AllLayout from "@/components/Layout";
  import axios from "axios";
  import EtherWorldAdCard from "@/components/EtherWorldAdCard";
  
  // Helper function to extract PR number from URL
  const extractPrNumber = (url: string) => {
    const prMatch = url.match(/\/pull\/(\d+)/);
    return prMatch ? prMatch[1] : "N/A";
  };
  
  const DashboardPage = () => {
    const [eipData, setEipData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
  
    // Fetch data from the API
    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await axios.get("/api/all_board");
          setEipData(response.data.ercs || []);
          setIsLoading(false);
        } catch (error) {
          console.error("Error fetching data:", error);
          setHasError(true);
          setIsLoading(false);
        }
      };
  
      fetchData();
    }, []);
  
    if (isLoading) {
      return (
        <AllLayout>
          <Box textAlign="center" mt="20">
            <Spinner size="xl" color="teal.500" />
          </Box>
        </AllLayout>
      );
    }
  
    if (hasError) {
      return (
        <AllLayout>
          <Box textAlign="center" mt="20">
            <Text fontSize="lg" color="red.500">
              Failed to load data.
            </Text>
          </Box>
        </AllLayout>
      );
    }
  
    return (
      <AllLayout>
        {/* EIP Board Heading */}
        <Box
          ml={2}
          mr={2}
          border="1px solid #e2e8f0"
          borderRadius="10px 10px 10px 10px"
          boxShadow="lg"
          bg="#171923" // Dark mode background
        >
          <Heading as="h2" size="lg" mt={4}mb={4} textAlign="center" color={"#fff"}>
            ERC BOARD
          </Heading>
          
          {/* EtherWorld Advertisement */}
          <Box my={6} width="100%">
            <EtherWorldAdCard />
          </Box>
  
          {/* Scrollable Table */}
          <TableContainer
            minHeight="500px"
            overflowY="auto"
            overflowX="auto"
            borderWidth="1px"
            borderRadius="md"
            bg="#1A202C" // Dark mode table background
            p={4}
            boxShadow="md"
            maxHeight="900px"
          >
            <Table variant="striped" colorScheme="blue" size="lg">
              <Thead bg="#2D3748">
                <Tr>
                  <Th style={{ color: "#fff", textAlign: "center" }}>
                    Serial Number
                  </Th>
                  <Th style={{ color: "#fff", textAlign: "center" }}>
                    PR Number
                  </Th>
                  <Th style={{ color: "#fff", textAlign: "center" }}>
                    PR Link
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {eipData?.map((item: any, index: number) => (
                  <Tr
                    key={item._id}
                    style={{
                      backgroundColor: index % 2 === 0 ? "#2D3748" : "#1A202C", // Alternating row colors
                      color: "#fff",
                    }}
                  >
                    <Td style={{ textAlign: "center", color: "#fff" }}>
                      {index + 1}
                    </Td>
                    <Td style={{ textAlign: "center", color: "#fff" }}>
                      {extractPrNumber(item.url)}
                    </Td>
                    <Td style={{ textAlign: "center" }}>
                      <LI
                        href={item.url}
                        isExternal
                        style={{ color: "teal" }}
                      >
                        {item.url}
                      </LI>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </Box>
      </AllLayout>
    );
  };
  
  export default DashboardPage;
  