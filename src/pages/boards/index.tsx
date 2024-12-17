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
    Flex,
    Button,
    useColorMode,
    useColorModeValue,
    Collapse,
    IconButton,
  } from "@chakra-ui/react";
  import React, { useEffect, useState } from "react";
  import AllLayout from "@/components/Layout";
  import axios from "axios";
  import {ChevronUpIcon, ChevronDownIcon } from "@chakra-ui/icons";
  import { DownloadIcon } from "@chakra-ui/icons";
  import Comments from "@/components/comments";
  
  // Helper function to extract PR number from URL
  const extractPrNumber = (url: string) => {
    const prMatch = url.match(/\/pull\/(\d+)/);
    return prMatch ? prMatch[1] : "N/A";
  };
  
  const DashboardPage = () => {
    const [eipData, setEipData] = useState([]);
    const [ercData, setErcData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [activeTab, setActiveTab] = useState('EIPs'); // Default to 'EIPs'
    const [show, setShow] = useState(false);

    const toggleCollapse = () => setShow(!show);
  
    // Fetch data from the API
    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await axios.get("/api/all_board");
          setEipData(response.data.eips || []);
          setErcData(response.data.ercs || []);
          setIsLoading(false);
        } catch (error) {
          console.error("Error fetching data:", error);
          setHasError(true);
          setIsLoading(false);
        }
      };
  
      fetchData();
    }, []);

    const handleDownload = () => {
      
      // Check the active tab and fetch the appropriate data
      const filteredData = activeTab === 'EIPs' ? eipData : ercData;
    
      if (!filteredData || filteredData.length === 0) {
        alert(`No data available for the selected month in ${activeTab}.`);
        return;
      }
    
      console.log(`Data for download in ${activeTab}:`, filteredData);
    
      // Pass the filtered data and active tab (EIPs or ERCs) to the CSV function
      downloadCSV(filteredData, activeTab);
    };

    const downloadCSV = (data: any, type: string) => {
      const csv = convertToCSV(data, type);
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
    
      const a = document.createElement('a');
      a.setAttribute('hidden', '');
      a.setAttribute('href', url);
      a.setAttribute('download', `${type}-board-data.csv`);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    };



    const convertToCSV = (filteredData: any, type: string) => { 
      const csvRows = [];
    
      // Define the headers for the CSV: Serial Number, PR Number, URL
      const headers = ['Serial Number', 'PR Number', 'URL'];
    
      // Add headers to CSV rows
      csvRows.push(headers.join(','));
    
      // Combine arrays for EIPs or ERCs
      const items = [
        ...(Array.isArray(filteredData) ? filteredData : [])
      ];
    
      // Add data to CSV rows
      items.forEach((item: any, index: number) => {
        const prNumber = extractPrNumber(item.url); // Extract the PR number from the URL
        const row = [
          index + 1,          // Serial Number
          prNumber,           // PR Number
          item.url            // URL
        ].join(',');
    
        csvRows.push(row);
      });
    
      return csvRows.join('\n');
    };
    
  
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
  
    // Determine which data to show based on the active tab
    const displayedData = activeTab === 'EIPs' ? eipData : ercData;
  
    return (
      <AllLayout>
        {/* Tab selection for EIPs and ERCs */}
        <Box  padding={{ base: 1, md: 4 }}
        margin={{ base: 2, md: 4 }}>
        <Box
      pl={4}
      bg={useColorModeValue("blue.50", "gray.700")}
      borderRadius="md"
      pr="8px"
      marginBottom={2}
    >
      <Flex justify="space-between" align="center"padding={1}>
        <Heading
          as="h3"
          size="lg"
          marginBottom={2}
          color={useColorModeValue("#3182CE", "blue.300")}
        >
        EIP Board FAQ
        </Heading>
        <Box
  bg="blue" // Gray background
  borderRadius="md" // Rounded corners
  padding={2} // Padding inside the box
>
<IconButton
    onClick={toggleCollapse}
    icon={show ? <ChevronUpIcon boxSize={8} color="white" /> : <ChevronDownIcon boxSize={8} color="white" />}
    variant="ghost"
     h="24px" // Smaller height
     w="20px"
    aria-label="Toggle Instructions"
    _hover={{ bg: 'blue' }} // Maintain background color on hover
    _active={{ bg: 'blue' }} // Maintain background color when active
    _focus={{ boxShadow: 'none' }} // Remove focus outline
    
  />
</Box>
      </Flex>

      <Collapse in={show}>
      <Heading
          as="h4"
          size="md"
          marginBottom={4}
          color={useColorModeValue("#3182CE", "blue.300")}
        >
          What is EIP Board?
        </Heading>
        <Text
          fontSize="md"
          marginBottom={2}
          color={useColorModeValue("gray.800", "gray.200")}
          className="text-justify"
        >
          The table below lists all Open Pull Requests (till date) in a order such that it uses oldest author interaction after the most recent editor response.
        </Text>
        <Text
          fontSize="md"
          marginBottom={4}
          color={useColorModeValue("gray.800", "gray.200")}
          className="text-justify"
        >
          PS: This tool is based on a fork from{" "}
          <LI
            href="https://github.com/gaudren/eip-board"
            color="blue"
            textDecoration="underline"
            isExternal
          >
            here
          </LI>
          .
        </Text>

        <Heading
          as="h4"
          size="md"
          marginBottom={4}
          color={useColorModeValue("#3182CE", "blue.300")}
        >
          Who would use this tool?
        </Heading>
        <Text
          fontSize="md"
          marginBottom={2}
          color={useColorModeValue("gray.800", "gray.200")}
          className="text-justify"
        >
          This tool is created to support EIP/ERC Editors to identify the
          longest waiting PRs for Editor's review. These PRs can also be
          discussed in{" "}
          <LI
            href="https://www.youtube.com/watch?v=dwJrlAfM14E&list=PL4cwHXAawZxqnDHxOyuwMpyt5s8F8gdmO"
            color="blue"
            textDecoration="underline"
            isExternal
          >
            EIP Editing Office Hour
          </LI>{" "}
          and{" "}
          <LI
            href="https://www.youtube.com/playlist?list=PL4cwHXAawZxpLrRIkDlBjDUUrGgF91pQw"
            color="blue"
            textDecoration="underline"
            isExternal
          >
            EIPIP Meetings
          </LI>{" "}
          in case it requires attention of more than one editor/reviewer.
        </Text>
      </Collapse>

      {/* {!show && (
        <Flex justify="center" align="center" marginTop={4}>
          <Text color={useColorModeValue("#3182CE", "blue.300")} cursor="pointer" onClick={toggleCollapse}>
            View Instructions
          </Text>
          <ChevronDownIcon color={useColorModeValue("#3182CE", "blue.300")} />
        </Flex>
      )} */}
    </Box>
        
        <Flex justify="center" mt={1}>
          <Button
            colorScheme="blue"
            onClick={() => setActiveTab('EIPs')}
            isActive={activeTab === 'EIPs'}
            mr={4}
          >
            EIPs
          </Button>
          <Button
            colorScheme="blue"
            onClick={() => setActiveTab('ERCs')}
            isActive={activeTab === 'ERCs'}
          >
            ERCs
          </Button>
        </Flex>
  
        {/* Heading based on active tab */}
        {/* <Box
          ml={2}
          mr={2}
          border="1px solid #e2e8f0"
          borderRadius="10px 10px 10px 10px"
          boxShadow="lg"
          bg="#171923" // Dark mode background
        > */}
           <Flex justify="space-between" align="center" p={4}>
        <Heading as="h2" size="lg" color={useColorModeValue("#3182CE", "blue.300")}>
          {activeTab} BOARD ({activeTab === 'EIPs' ? eipData.length : ercData.length})
        </Heading>
        <Button
          colorScheme="blue"
          variant="outline"
          fontSize={{ base: "0.6rem", md: "md" }} 
          fontWeight={"bold"}
          padding={"8px 20px"}
          onClick={async () => {
            try {
              // Trigger the CSV conversion and download
              handleDownload();
        
              // Trigger the API call
              await axios.post("/api/DownloadCounter");
            } catch (error) {
              console.error("Error triggering download counter:", error);
            }
          }}
        >
          <DownloadIcon marginEnd={"1.5"} />
          Download Reports
        </Button>
      </Flex>

  
          {/* Scrollable Table */}
          <TableContainer
  minHeight="500px"
  overflowY="auto"
  overflowX="auto"
  borderWidth="1px"
  borderRadius="md"
  p={4}
  boxShadow="md"
  maxHeight="900px"
>
  <Table variant="striped" colorScheme="gray" size="md" borderRadius="md" boxShadow="md" width="100%">
    <Thead bg="#171923">
      <Tr>
        <Th textAlign="center" borderTopLeftRadius="10px" minWidth="6rem" color="white">
          Serial Number
        </Th>
        <Th textAlign="center" minWidth="10rem" color="white">
          PR Number
        </Th>
        <Th textAlign="center" borderTopRightRadius="10px" minWidth="10rem" color="white">
          PR Link
        </Th>
      </Tr>
    </Thead>

    <Tbody>
      {displayedData.length === 0 ? (
        <Tr>
          <Td colSpan={3} textAlign="center" color="white">
            No Data Available
          </Td>
        </Tr>
      ) : (
        displayedData.map((item: any, index: number) => (
          <Tr key={item._id} height="40px"> {/* Adjust row height */}
            <Td textAlign="center">
              <Box
                bg="gray.600"
                color="white"
                borderRadius="md"
                paddingX="8px" // Smaller horizontal padding
                paddingY="4px" // Smaller vertical padding
                fontSize="md" // Adjust text size
                display="inline-block"
              >
                {index + 1}
              </Box>
            </Td>
            <Td textAlign="center">
              <Box
                bg="gray.600"
                color="white"
                borderRadius="md"
                paddingX="8px"
                paddingY="4px"
                fontSize="md"
                display="inline-block"
              >
                {extractPrNumber(item.url)}
              </Box>
            </Td>
            <Td textAlign="center">
              <button
                style={{
                  backgroundColor: '#428bca',
                  color: '#ffffff',
                  border: 'none',
                  padding: '4px 8px', // Smaller padding
                  fontSize: '0.85rem', // Smaller font size
                  cursor: 'pointer',
                  borderRadius: '5px',
                }}
              >
                <a href={item.url} target="_blank" rel="noopener noreferrer" style={{ color: '#ffffff', textDecoration: 'none' }}>
                  View PR
                </a>
              </button>
            </Td>
          </Tr>
        ))
      )}
    </Tbody>
  </Table>
</TableContainer>




        {/* </Box> */}

        

        <Box
          bg={useColorModeValue("blue.50", "gray.700")} // Background color for the box
          color="black" // Text color
          borderRadius="md" // Rounded corners
          padding={4} // Padding inside the box
          marginTop={4} // Margin above the box
        >
          <Text>
            For other details, check{' '}
            <LI href="/Analytics" color="blue" isExternal>
              PRs Analytics
            </LI>{' '}
            and{' '}
            <LI href="/Reviewers" color="blue" isExternal>
              Editors Leaderboard
            </LI>.
          </Text>
        </Box>
       
        <Box>
          <br/>
        <hr></hr>
        <br/>
        <Text fontSize="3xl" fontWeight="bold">Comments</Text>
          <Comments page={"boards"}/>
        </Box>
      </Box>
              </AllLayout>
    );
  };
  
  export default DashboardPage;
  