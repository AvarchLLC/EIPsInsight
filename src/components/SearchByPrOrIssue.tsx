import React, { useEffect, useState } from 'react';
import { Box, useColorModeValue, Text, Input, SimpleGrid, Button, Flex,IconButton, Tooltip, Spinner, Avatar, Menu, MenuItem, MenuList, MenuButton} from "@chakra-ui/react";
import { saveAs } from 'file-saver';
import NextLink from 'next/link';
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import axios from 'axios';



interface AuthorProps {
  defaultQuery: string;
}

interface PRItem {
    prNumber: number;
    prTitle: string;
    repo:string;
}
  
interface IssueItem {
    issueNumber: number;
    issueTitle: string;
    repo:string;
}

interface CombinedItem {
    Number: number;
    Title: string;
    Type: "PR" | "issue";
    Repo: string;
  }
  

const SearchByEip: React.FC<AuthorProps> = ({ defaultQuery }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItem, setselectedItem] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [combinedData, setCombinedData] = useState<CombinedItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const cardsPerPage = 25;

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedItem]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prResponse, issueResponse] = await Promise.all([
          fetch(`/api/allprs`),
          fetch(`/api/allissues`),
        ]);

        const prData: PRItem[] = await prResponse.json();
        const issueData: IssueItem[] = await issueResponse.json();

        // Combine PR and Issue data
        const combined = [
          ...prData?.map((pr) => ({
            Number: pr.prNumber,
            Title: pr.prTitle,
            Type: "PR" as const,
            Repo: pr.repo,
          })),
          ...issueData?.map((issue) => ({
            Number: issue.issueNumber,
            Title: issue.issueTitle,
            Type: "issue" as const,
            Repo: issue.repo,
          })),
        ];

        setCombinedData(combined);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);


  const filteredData2 = searchTerm
    ? combinedData?.filter((item) =>
        item.Number.toString().includes(searchTerm.trim())
      )
    : combinedData;
    const totalPages = Math.ceil(combinedData?.length / cardsPerPage);
 

  const jsonToCsv = (data: CombinedItem[]): string => { 
    const csvRows: string[] = [];
    const headers = ['REPO', 'Title', 'NUMBER', 'LINK'];
   
    csvRows.push(headers.join(','));
  
  
    data?.forEach((item: CombinedItem) => {
      const row = [
        `${item.Repo}`, 
        `"${item.Number}"`,
        `"${item.Title}"`, 
       `https://eipsinsight.com/${item.Type}/${item.Repo}/${item.Number}`
      ];
      csvRows.push(row.join(','));
    });
  
    return csvRows.join('\n');
  };
  
  
  const paginatedData = filteredData2.slice(
    (currentPage - 1) * cardsPerPage,
    currentPage * cardsPerPage
  );
  console.log("paginated data:", paginatedData);
  
  const handleDownload = () => {
    if (!paginatedData?.length) {
      alert('No data to download.');
      return;
    }
  
    const csvData = jsonToCsv(filteredData2);
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'PRandIssues_data.csv');
  };

  const bg = useColorModeValue('#f7fafc', '#171923');
  const cardBg = useColorModeValue('white', 'gray.700');
  const border = useColorModeValue('gray.300', 'gray.600');




  return (
    <>
      <Box p={5} maxW="1200px" mx="auto">
        
        <Flex justifyContent="center" mt={3} alignItems="center" gap={4}>
          <Input
            placeholder="Search PR/ISSUE number"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="lg"
            width={{ base: '80%', md: '50%' }}
            borderRadius="full"
            boxShadow="md"
            bg={useColorModeValue('white', 'gray.800')}
            borderColor={useColorModeValue('gray.300', 'gray.600')}
            _focus={{
              borderColor: useColorModeValue('blue.400', 'blue.600'),
              boxShadow: '0 0 0 2px rgba(66, 153, 225, 0.6)',
            }}
          />
          <Menu>
      <MenuButton
        as={Button}
        rightIcon={<ChevronDownIcon />}
        colorScheme="blue"
        size="md"
        width="200px"
      >
        PR/ISSUE
      </MenuButton>
      <MenuList>
      <MenuItem onClick={() => window.location.href = '/SearchEip'}>
      EIP
        </MenuItem>
        <MenuItem onClick={() => window.location.href = '/authors'}>
        Authors
        </MenuItem>
        <MenuItem onClick={() => window.location.href = '/SearchEipTitle'}>
          Title
        </MenuItem>
      </MenuList>
    </Menu>
        </Flex>
        </Box>
        <Box p={4}>

        

          {/* <AuthorEIPCounter eips={data}/> */}

        {isLoading ? (
          <Text textAlign="center">Loading...</Text>
        ) : (
          <>
            
            <Box
  display="flex"
  justifyContent="flex-end" // Align items to the start (left)
  alignItems="center"
  mb={4}
  ml={2}
  gap={4}
>
<Button colorScheme="blue" onClick={async () => {
                      try {
                        // Trigger the CSV conversion and download
                        handleDownload()

                        // Trigger the API call
                        await axios.post("/api/DownloadCounter");
                      } catch (error) {
                        console.error("Error triggering download counter:", error);
                      }
                    }} disabled={isLoading}>
                        {isLoading ? <Spinner size="sm" /> : "Download CSV"}
                      </Button>
 
</Box>

                  
            {/* Display Cards */}
            <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 5 }} spacing={6}>
              {paginatedData?.map((item) => (
                <NextLink
                  href={`/${item.Type === "PR" ? `/PR/${item.Repo}/${item.Number}` :`/issue/${item.Repo}/${item.Number}`}`}
                  target="_blank"
                  passHref
                >
                  {/* <a target="_blank" rel="noopener noreferrer">  */}
                  <Box
  bg={bg}
  paddingX="1rem"
  paddingY="1rem"
  borderRadius="0.75rem"
  boxShadow="lg"
  _hover={{
    transform: "scale(1.05)",
    outline: "2px solid #30A0E0",
    outlineOffset: "-2px",
    transition: "transform 0.2s ease, outline 0.2s ease",
  }}
  transition="transform 0.2s ease, outline 0.2s ease"
  width="100%"
  display="flex"
  flexDirection="column"
  minHeight="200px"
  justifyContent="space-between"
>
  {/* Repo-EIP Title Section */}
  <Text
    fontSize="2xl"
    fontWeight="extrabold"
    color={useColorModeValue("blue.600", "blue.300")}
    mb={2}
    wordBreak="break-word"
  >
    {item.Type.toUpperCase()}-{item.Number}
  </Text>

  {/* Title Section */}
  <Text
    fontSize="md"
    fontWeight="semibold"
    color={useColorModeValue("gray.800", "gray.300")}
    noOfLines={3} // Allow wrapping into 3 lines
    marginBottom="0.75rem"
    lineHeight="1.4"
  >
    {item.Title}
  </Text>

  {/* Repo Section */}
  <Text fontSize="sm" color={useColorModeValue("gray.700", "gray.400")} mb={1}>
    <b>Repo:</b> {item.Repo}
  </Text>
</Box>



                 
                </NextLink>
              ))}
            </SimpleGrid>

            {/* Pagination */}
            <Box mt={8} display="flex" justifyContent="center" alignItems="center" gap={4}>
              <Button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <Text>
                Page {currentPage} of {totalPages}
              </Text>
              <Button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </Box>
          </>
        )}
      </Box>
    </>
  );
};

export default SearchByEip;
