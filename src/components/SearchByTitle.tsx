import React, { useEffect, useState } from 'react';
import { Box, useColorModeValue, Text, Input, SimpleGrid, Button, Flex,IconButton, Tooltip, Spinner, Avatar, Menu, MenuItem, MenuButton, MenuList} from "@chakra-ui/react";
import { saveAs } from 'file-saver';
import AllLayout from './Layout';
import NextLink from 'next/link';
// import AuthorEIPCounter from './AuthorBoard';
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import { SearchIcon } from "@chakra-ui/icons";
import axios from 'axios';

interface EIP {
  _id: string;
  eip: string;
  type: string;
  title:string;
  category: string;
  status:string;
  author: string;
  repo: string;
}

interface AuthorCount {
  name: string;
  count: number;
}

interface AuthorProps {
  defaultQuery: string;
}

const SearchByTitle: React.FC<AuthorProps> = ({ defaultQuery }) => {
  const [data, setData] = useState<EIP[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAuthor, setSelectedAuthor] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [filterVisible, setFilterVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const cardsPerPage = 25;

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedAuthor]);

  const [authorCounts, setAuthorCounts] = useState<AuthorCount[]>([]);
  const [visibleCount, setVisibleCount] = useState(5);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/new/graphsv4`);
        const jsonData = await response.json();

        const getEarliestEntries = (data: any[], key: string) => {
          const uniqueEntries: Record<string, any> = {};
          data.forEach(entry => {
            const entryKey = entry[key];
            if (!uniqueEntries[entryKey] || new Date(entry.changeDate) > new Date(uniqueEntries[entryKey].changeDate)) {
              uniqueEntries[entryKey] = entry;
            }
          });
          return Object.values(uniqueEntries);
        };

        let filteredData = [
          ...getEarliestEntries(jsonData.eip, 'eip'),
          ...getEarliestEntries(jsonData.erc, 'eip'),
          ...getEarliestEntries(jsonData.rip, 'eip'),
        ];
        filteredData = filteredData?.filter(
          (entry: EIP, index: number, self: EIP[]) =>
            entry.eip !== '1' || index === self.findIndex((e: EIP) => e.eip === '1')
        );

        setData(filteredData);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      }
    };

    fetchData();
    setSelectedAuthor(defaultQuery)

  }, []);

  useEffect(() => {
    const authorMap: Record<string, number> = {};
  
    data.forEach((eip) => {
      const authors = eip.author.split(",")?.map((author) => author.trim());
      authors.forEach((author) => {
        if (author) {
          // Match GitHub handle in the format: Vitalik Buterin (@vbuterin)
          const handleMatch = author.match(/(.+?)\s\(@([a-zA-Z0-9-_]+)\)$/);
          
          if (handleMatch) {
            // Add counts for the full name and the GitHub handle
            const fullName = handleMatch[1].trim(); // Extract full name
            const handle = handleMatch[2].trim();  // Extract handle
        
            authorMap[fullName] = (authorMap[fullName] || 0) + 1;
            authorMap[`@${handle}`] = (authorMap[`@${handle}`] || 0) + 1;
          } else {
            // Match email address in the format: Vitalik Buterin <vitalik.buterin@ethereum.org>
            const emailMatch = author.match(/(.+?)\s<.+?>$/);
        
            if (emailMatch) {
              const fullName = emailMatch[1].trim(); // Ignore email part, extract only the name
              authorMap[fullName] = (authorMap[fullName] || 0) + 1;
            } else {
              // If no special format is found, count the entire string as the author's name
              authorMap[author] = (authorMap[author] || 0) + 1;
            }
          }
        }
        
      });
    });
  
    const authorArray = Object.entries(authorMap)
      ?.map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  
    setAuthorCounts(authorArray);
  }, [data]);
  

  const handleExpand = () => {
    setVisibleCount((prev) => Math.min(prev + 5, authorCounts.length));
  };

  const handleCollapse = () => {
    setVisibleCount(5);
  };

  // Filter and paginate data
  const filteredData = data?.filter(item =>
    !selectedAuthor || item.author.toLowerCase().includes(selectedAuthor.toLowerCase())
  );
  
  const filteredData2 = searchTerm
    ? filteredData?.filter((item) =>
        item.title.toLowerCase().trim().includes(searchTerm.toLowerCase().trim())
      )
    : filteredData;
    const totalPages = Math.ceil(filteredData2.length / cardsPerPage);
  const paginatedData = filteredData2.slice(
    (currentPage - 1) * cardsPerPage,
    currentPage * cardsPerPage
  );
  console.log("paginated data:", paginatedData);

  const jsonToCsv = (data: EIP[]): string => { 
    const csvRows: string[] = [];
    const headers = ['EIP', 'Title', 'Author', 'Type', 'Category', 'Repo'];
    
    // Add headers to the CSV
    csvRows.push(headers.join(','));
  
    // Add data rows
    data.forEach((item: EIP) => {
      const row = [
        `EIP-${item.eip}`, // EIP ID
        `"${item.title}"`, // Title (quoted to handle commas)
        `"${item.author}"`, // Author(s) (quoted to handle commas)
        item.type, // Type
        item.category, // Category
        item.repo.toUpperCase() // Repo in uppercase
      ];
      csvRows.push(row.join(','));
    });
  
    return csvRows.join('\n');
  };

  const filteredAuthors = authorCounts?.filter((author) =>
    author.name.toLowerCase().includes(selectedAuthor.toLowerCase())
  );
  
  
  // const paginatedData = filteredData2.slice(
  //   (currentPage - 1) * cardsPerPage,
  //   currentPage * cardsPerPage
  // );
  // console.log("paginated data:", paginatedData);
  
  const handleDownload = () => {
    if (!paginatedData.length) {
      alert('No data to download.');
      return;
    }
  
    const csvData = jsonToCsv(paginatedData);
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'Author_data.csv');
  };

  const bg = useColorModeValue('#f7fafc', '#171923');
  const cardBg = useColorModeValue('white', 'gray.700');
  const border = useColorModeValue('gray.300', 'gray.600');




  return (
    <>
      <Box p={5} maxW="1200px" mx="auto">
        {/* Search Bar & Download Button */}
        <Flex justifyContent="center" mt={3} alignItems="center" gap={4}>
          <Input
            placeholder="Search EIP Title"
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
                  width="200px" // Fixed width
                >
                  Title
                </MenuButton>
                <MenuList>
                  <MenuItem onClick={() => window.location.href = '/SearchEip'}>
                  Authors
                  </MenuItem>
                  <MenuItem onClick={() => window.location.href = '/SearchEipTitle'}>
                    EIP
                  </MenuItem>
                  <MenuItem onClick={() => window.location.href = '/SearchPRSandISSUES'}>
                          PR/ISSUE
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
          {/* <Flex
      wrap="wrap"
      alignItems="center"
      justifyContent="center"
      p={4}
      mb={2}
      borderRadius="lg"
      overflowX="auto"
    > */}
      {/* {filteredAuthors.slice(0, visibleCount)?.map((author) => (
  <Box
  key={author.name}
  bg={selectedAuthor === author.name ? "blue.600" : "blue.500"}
  color="white"
  px={2} // Reduced padding
  py={1} // Reduced padding
  borderRadius="full"
  m={1} // Reduced margin
  border="1px solid"
  borderColor="blue.500"
  whiteSpace="nowrap"
  transform={selectedAuthor === author.name ? "scale(1.1)" : "scale(1.0)"}
  transition="all 0.2s ease"
  _hover={{
    bg: "blue.400",
    transform: "scale(1.05)",
    cursor: "pointer",
  }}
  onClick={() => setSelectedAuthor(author.name)}
  display="flex"
  alignItems="center"
>
  <Avatar
    size="sm"
    src={author.name.startsWith('@') ? `https://github.com/${author.name.slice(1)}.png` : ''}
    bg={author.name.startsWith('@') ? undefined : 'black'}
  />
  <Text fontSize="xs" fontWeight="bold" ml={1} mr={1}>
    {author.name} ({author.count})
  </Text>
</Box>

))} */}




      {/* {visibleCount < authorCounts.length && (
        <Tooltip label="Expand" fontSize="md">
          <IconButton
          icon={<ChevronDownIcon fontWeight="bold" />}
          aria-label="View More"
          onClick={handleExpand}
          variant="ghost"
          bg="blue.500"
          color="white"
          ml={2}
          fontSize="xl"
          borderRadius="full" // Corrected the property for rounded circle
          w="40px" // Added fixed width
          h="40px" // Added fixed height
          _hover={{ bg: "blue.400", transform: "scale(1.1)" }} // Adjusted hover behavior
        />

        </Tooltip>
      )}

      {visibleCount > 20 && (
        <Tooltip label="Collapse" fontSize="md">
          <IconButton
            icon={<ChevronUpIcon fontWeight="bold" />}
            aria-label="View More"
          onClick={handleCollapse}
          variant="ghost"
          bg="blue.500"
          color="white"
          ml={2}
          fontSize="xl"
          borderRadius="full" // Corrected the property for rounded circle
          w="40px" // Added fixed width
          h="40px" // Added fixed height
          _hover={{ bg: "blue.400", transform: "scale(1.1)" }} // Adjusted hover behavior
        />
        </Tooltip>
      )}
    </Flex> */}

                  {/* <Box mt={8}>
                   
                    <Box padding={4} bg="blue.50" borderRadius="md" marginBottom={8}>
                    <Text fontSize="lg"
                    marginBottom={2}
                    color="black">
                        You can download the data here:
                      </Text>
                      <Button colorScheme="blue" 
                      onClick={async () => {
                        try {
                          
                          handleDownload();
                    
                        
                          await axios.post("/api/DownloadCounter");
                        } catch (error) {
                          console.error("Error triggering download counter:", error);
                        }
                      }} 
                      disabled={isLoading}>
                        {isLoading ? <Spinner size="sm" /> : "Download CSV"}
                      </Button>
                    </Box>
                  </Box> */}
            
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
                  key={item._id}
                  href={`/${item.repo === "erc" ? "ercs/erc" : item.repo === "rip" ? "rips/rip" : "eips/eip"}-${item.eip}`}
                  target="_blank"
                  passHref
                >
                  {/* <a target="_blank" rel="noopener noreferrer">  */}
                  <Box
  bg={bg}
  paddingX="0.5rem"
  borderRadius="0.55rem"
  _hover={{
    transform: "scale(1.05)",
    outline: "2px solid #30A0E0",
    outlineOffset: "-2px",
    transition: "transform 0.2s ease, outline 0.2s ease",
  }}
  transition="transform 0.2s ease, outline 0.2s ease"
  width="100%"
  padding="1rem"
  display="flex"
  flexDirection="column"
  minHeight="300px" // Fixed height for uniformity
  justifyContent="space-between" // Align items evenly
>
  {/* Repo-EIP Title Section */}
  <Text
    fontSize="xl"
    fontWeight="extrabold"
    color={useColorModeValue('blue.500', 'blue.300')}
    mb={3}
    wordBreak="break-word"
  >
    {item.repo.toUpperCase()}-{item.eip}
  </Text>

  {/* Title Section */}
  <Text
    fontSize="sm"
    fontWeight="bold"
    color={useColorModeValue('gray.700', 'gray.300')}
    isTruncated
    maxWidth="100%"
    marginBottom="0.5rem"
  >
    {item.title}
  </Text>

  {/* Type Section */}
  <Text fontSize="sm" color={useColorModeValue('gray.700', 'gray.300')} mb={1}>
    <b>Type:</b> {item.type}
  </Text>

  {/* Category Section */}
  <Text fontSize="sm" color={useColorModeValue('gray.700', 'gray.300')} mb={1}>
    <b>Category:</b> {item.category}
  </Text>
  <Text fontSize="sm" color={useColorModeValue('gray.700', 'gray.300')} mb={1}>
    <b>Status:</b> {item.status}
  </Text>

  {/* Authors Section */}
  <Text
    fontSize="xs"
    fontWeight="bold"
    color={useColorModeValue('gray.700', 'gray.300')}
    marginBottom="0.5rem"
  >
    Authors:
  </Text>
  <Box
  display="flex"
  alignItems="center"
  gap="0.5rem"
  marginBottom="1rem"
  maxWidth="100%"
>
  {(() => {
    const authors = item.author.split(",")?.map((author) =>
      author.replace(/<.*?>/g, "").trim()
    );

    const sortedAuthors = authors.sort((a, b) => {
      const aIsSelected = !!(
        selectedAuthor &&
        a.toLowerCase().includes(selectedAuthor.toLowerCase())
      );
      const bIsSelected = !!(
        selectedAuthor &&
        b.toLowerCase().includes(selectedAuthor.toLowerCase())
      );
      return Number(bIsSelected) - Number(aIsSelected);
    });

    // Show only the first author with ...more if applicable
    const firstAuthor = sortedAuthors[0];
    const hasMoreAuthors = sortedAuthors.length > 1;

    return (
      <Box
        display="flex"
        alignItems="center"
        gap="0.5rem"
        maxWidth="100%"
        bg="blue.500"
        color="white"
        px={2}
        py={1}
        borderRadius="full"
        border="1px solid"
        borderColor="blue.500"
        wordBreak="break-word" // Allow wrapping
        whiteSpace="normal"    // Ensure text can wrap
        overflow="hidden"      // Prevent overflow
        flexWrap="nowrap"      // Prevent splitting of content
        transition="all 0.2s ease"
        _hover={{
          bg: "blue.400",
          transform: "scale(1.05)",
          cursor: "pointer",
        }}
        onClick={() => setSelectedAuthor(firstAuthor)} // Set selected author
      >
        <Avatar
          size="xs"
          src={
            firstAuthor.includes("@") && firstAuthor.includes(")")
              ? `https://github.com/${firstAuthor.slice(
                  firstAuthor.indexOf("@") + 1,
                  firstAuthor.indexOf(")")
                )}.png`
              : ""
          }
          bg={
            firstAuthor.includes("@") && firstAuthor.includes(")")
              ? undefined
              : "black"
          }
        />
        <Box
          display="flex"
          alignItems="center"
          gap="0.25rem"
          flexWrap="wrap"  // Allow wrapping of the text
        >
          <Text fontSize="xs" fontWeight="bold" isTruncated>
            {firstAuthor}
          </Text>
          {hasMoreAuthors && (
            <Text fontSize="xs" fontWeight="bold" ml={1} whiteSpace="nowrap">
              ...more
            </Text>
          )}
        </Box>
      </Box>
    );
  })()}
</Box>

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

export default SearchByTitle;
