import React, { useEffect, useState } from 'react';
import { Box, useColorModeValue, Text, Input, SimpleGrid, Button, Flex,IconButton, Tooltip, Spinner,} from "@chakra-ui/react";
import { saveAs } from 'file-saver';
import AllLayout from './Layout';
import NextLink from 'next/link';
// import AuthorEIPCounter from './AuthorBoard';
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";

interface EIP {
  _id: string;
  eip: string;
  type: string;
  title:string;
  category: string;
  author: string;
  repo: string;
}

interface AuthorCount {
  name: string;
  count: number;
}

const Author: React.FC = () => {
  const [data, setData] = useState<EIP[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAuthor, setSelectedAuthor] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 25;

  const [authorCounts, setAuthorCounts] = useState<AuthorCount[]>([]);
  const [visibleCount, setVisibleCount] = useState(20);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/new/graphsv3`);
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
        filteredData = filteredData.filter(
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
  }, []);

  useEffect(() => {
    const authorMap: Record<string, number> = {};
  
    data.forEach((eip) => {
      const authors = eip.author.split(",").map((author) => author.trim());
      authors.forEach((author) => {
        if (author) {
          // Extract GitHub handle from the author's name if available
          const handleMatch = author.match(/\(@([a-zA-Z0-9-_]+)\)$/);
          const authorName = handleMatch ? handleMatch[1] : author; // Use the handle if matched, else fallback to name
  
          authorMap[authorName] = (authorMap[authorName] || 0) + 1;
        }
      });
    });
  
    const authorArray = Object.entries(authorMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  
    setAuthorCounts(authorArray);
  }, [data]);
  

  const handleExpand = () => {
    setVisibleCount((prev) => Math.min(prev + 20, authorCounts.length));
  };

  const handleCollapse = () => {
    setVisibleCount(20);
  };

  // Filter and paginate data
  const filteredData = data.filter(item =>
    !selectedAuthor || item.author.toLowerCase().includes(selectedAuthor.toLowerCase())
  );
  const totalPages = Math.ceil(filteredData.length / cardsPerPage);
  const paginatedData = filteredData.slice(
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

  const filteredAuthors = authorCounts.filter((author) =>
    author.name.toLowerCase().includes(selectedAuthor.toLowerCase())
  );
  
  
  const handleDownload = () => {
    if (!filteredData.length) {
      alert('No data to download.');
      return;
    }
  
    const csvData = jsonToCsv(filteredData);
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
            placeholder="Search Author"
            value={selectedAuthor}
            onChange={(e) => setSelectedAuthor(e.target.value)}
            size="lg"
            width="50%"
            borderRadius="full"
            boxShadow="md"
            bg={useColorModeValue('white', 'gray.800')}
            borderColor={useColorModeValue('gray.300', 'gray.600')}
            _focus={{
              borderColor: useColorModeValue('blue.400', 'blue.600'),
              boxShadow: '0 0 0 2px rgba(66, 153, 225, 0.6)',
            }}
          />
          {/* <Button colorScheme="blue" size="lg" borderRadius="full" onClick={handleDownload}>
            Download Data
          </Button> */}
        </Flex>
        </Box>
        <Box p={4}>

        

          {/* <AuthorEIPCounter eips={data}/> */}

        {isLoading ? (
          <Text textAlign="center">Loading...</Text>
        ) : (
          <>
          <Flex
      wrap="wrap"
    //   direction="column"
      alignItems="center"
      justifyContent="center"
      p={4}
      mb={2}
      borderRadius="lg"
      overflowX="auto"
    >
      {filteredAuthors.slice(0, visibleCount).map((author) => (
  <Box
    key={author.name}
    bg={selectedAuthor === author.name ? "blue.600" : "blue.500"}
    color="white"
    px={3}
    py={1}
    borderRadius="full"
    m={2} // Increased margin to create more spacing
    border="1px solid"
    borderColor="blue.500"
    whiteSpace="nowrap"
    transform={
      selectedAuthor === author.name ? "scale(1.1)" : "scale(1.0)"
    }
    transition="all 0.2s ease"
    _hover={{
      bg: "blue.400",
      transform: "scale(1.05)",
      cursor: "pointer",
    }}
    onClick={() => setSelectedAuthor(author.name)}
  >
    <Text fontSize="sm" fontWeight="bold">
      {author.name} ({author.count})
    </Text>
  </Box>
))}




      {visibleCount < authorCounts.length && (
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
    </Flex>

    <Box mt={8}>
                    {/* Download CSV section */}
                    <Box padding={4} bg="blue.50" borderRadius="md" marginBottom={8}>
                    <Text fontSize="lg"
                    marginBottom={2}
                    color={useColorModeValue("gray.800", "gray.200")}>
                        You can download the data here:
                      </Text>
                      <Button colorScheme="blue" onClick={handleDownload} disabled={isLoading}>
                        {isLoading ? <Spinner size="sm" /> : "Download CSV"}
                      </Button>
                    </Box>
                  </Box>

                  
            {/* Display Cards */}
            <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 5 }} spacing={6}>
              {paginatedData.map((item) => (
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
    border: "1px",
    borderColor: "#30A0E0",
  }}
  width="100%" // Adjust width based on container size
  padding="1rem"
  display="flex"
  flexDirection="column"
>
  {/* Repo-EIP Title Section */}
  <Text
    fontSize="2xl"
    fontWeight="extrabold"
    color={useColorModeValue('blue.500', 'blue.300')}
    mb={4}
  >
    {item.repo.toUpperCase()}-{item.eip}
  </Text>

  <Text
    fontSize="lg"
    fontWeight="bold"
    color={useColorModeValue('gray.700', 'gray.300')}
    isTruncated
    maxWidth="100%" // Ensure title is truncated if too long
    marginBottom="0.5rem"
  >
    {item.title} {/* Display title */}
  </Text>

  {/* Type Section */}
  <Text fontSize="md" color={useColorModeValue('gray.700', 'gray.300')} mb={1}>
    <b>Type:</b> {item.type}
  </Text>

  {/* Category Section */}
  <Text fontSize="md" color={useColorModeValue('gray.700', 'gray.300')} mb={1}>
    <b>Category:</b> {item.category}
  </Text>

  {/* Title Section */}

  {/* Authors Section */}
  <Text fontSize="sm" fontWeight="bold" color={useColorModeValue('gray.700', 'gray.300')} marginBottom="0.5rem">
  Authors:
</Text>
<Box
  display="flex"
  flexWrap="wrap"
  gap="0.5rem"
  marginBottom="1rem"
  maxWidth="100%"
>
  {(() => {
    // Split the authors string, clean up names, and trim each name
    const authors = item.author.split(",").map((author) =>
      author.replace(/<.*?>/g, "").trim() // Remove the <...> part
    );

    // Sort authors so selected ones appear first
    const sortedAuthors = authors.sort((a, b) => {
      const aIsSelected = !!(
        selectedAuthor &&
        a.toLowerCase().includes(selectedAuthor.toLowerCase())
      ); // Convert to boolean
      const bIsSelected = !!(
        selectedAuthor &&
        b.toLowerCase().includes(selectedAuthor.toLowerCase())
      ); // Convert to boolean
      return Number(bIsSelected) - Number(aIsSelected); // Perform arithmetic safely
    });

    // Render the first 4 authors
    return sortedAuthors.slice(0, 1).map((author, index) => {
      const authorName = author; // Use GitHub handle if available, else use author name
      const isSelected =
        selectedAuthor && authorName.toLowerCase().includes(selectedAuthor.toLowerCase());
    
      return (
        <Box
          key={`author-${index}`} // Use index as fallback for key
          bg={isSelected ? "blue.600" : "blue.500"}
          color="white"
          px={3}
          py={1}
          borderRadius="full"
          m={2} // Margin for spacing
          border="1px solid"
          borderColor="blue.500"
          whiteSpace="nowrap"
          transform={isSelected ? "scale(1.1)" : "scale(1.0)"}
          transition="all 0.2s ease"
          _hover={{
            bg: "blue.400",
            transform: "scale(1.05)",
            cursor: "pointer",
          }}
          onClick={() => setSelectedAuthor(authorName)} // Set selected author
        >
          <Text fontSize="sm" fontWeight="bold">
            {authorName} {/* Display author name */}
          </Text>
        </Box>
      );
    }).concat(
      sortedAuthors.length > 1 ? (
        <Box
          key="more-authors"
          // bg="blue.500"
          color={useColorModeValue('gray.700', 'gray.300')}
          // px={3}
          py={1}
          borderRadius="full"
          m={2} // Margin for spacing
          // border="1px solid"
          // borderColor="blue.500"
          whiteSpace="nowrap"
          transform="scale(1.0)"
          transition="all 0.2s ease"
          _hover={{
            bg: "blue.400",
            transform: "scale(1.05)",
            cursor: "pointer",
          }}
          onClick={() => {
            // Handle the click for the "more" action, like showing all authors
          }}
        >
          <Text fontSize="sm" fontWeight="bold">
            ...more {/* Display 'more' */}
          </Text>
        </Box>
      ) : []
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

export default Author;
