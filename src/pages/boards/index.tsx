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
    useColorModeValue,
    Collapse,
    IconButton,
  } from "@chakra-ui/react";
  import React, { useEffect, useState } from "react";
  import AllLayout from "@/components/Layout";
  import axios from "axios";
  import {ChevronUpIcon, ChevronDownIcon } from "@chakra-ui/icons";
  
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
        <Box  padding={8} mt={8} ml={8} mr={8} mb={1}>
        <Box
      padding={4}
      bg={useColorModeValue("blue.50", "gray.700")}
      borderRadius="md"
      marginBottom={8}
    >
      <Flex justify="space-between" align="center">
        <Heading
          as="h3"
          size="lg"
          marginBottom={4}
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
          icon={show ? <ChevronUpIcon /> : <ChevronDownIcon />}
          variant="ghost"
          aria-label="Toggle Instructions"
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
          The table below lists all Open Pull Requests (till date) in order of wait
          time (longest wait first).
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
        
        <Flex justify="center" mb={8}>
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
        <Box
          ml={2}
          mr={2}
          border="1px solid #e2e8f0"
          borderRadius="10px 10px 10px 10px"
          boxShadow="lg"
          bg="#171923" // Dark mode background
        >
          <Heading as="h2" size="lg" mt={4} mb={4} textAlign="center" color="#fff">
            {activeTab} BOARD ({activeTab === 'EIPs' ? eipData.length : ercData.length})
          </Heading>

  
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
  <Table variant="striped" colorScheme="gray" size="lg" mt={4} borderRadius="md" boxShadow="md" width="100%">
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
      <Tr key={item._id}>
        <Td textAlign="center">
          <Box
            bg="gray.600" // Box background color
            color="white" // Text color
            borderRadius="md" // Rounded corners
            paddingX={2} // Horizontal padding
            paddingY={1} // Vertical padding
            display="inline-block" // Ensures the box wraps tightly around the content
          >
            {index + 1}
          </Box>
        </Td>
        <Td textAlign="center">
          <Box
            bg="gray.600" // Box background color
            color="white" // Text color
            borderRadius="md" // Rounded corners
            paddingX={2} // Horizontal padding
            paddingY={1} // Vertical padding
            display="inline-block" // Ensures the box wraps tightly around the content
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
              padding: '10px 20px',
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


        </Box>
        <Box
  bg="gray.700" // Background color for the box
  color="white" // Text color
  borderRadius="md" // Rounded corners
  padding={4} // Padding inside the box
  marginTop={4} // Margin above the box
>
  <Text>
    For other details, check{' '}
    <LI href="/Analytics" color="blue.300" isExternal>
      PRs Analytics
    </LI>{' '}
    and{' '}
    <LI href="/Reviewers" color="blue.300" isExternal>
      Reviewers Tracker
    </LI>.
  </Text>
</Box>
        </Box>
      </AllLayout>
    );
  };
  
  export default DashboardPage;
  