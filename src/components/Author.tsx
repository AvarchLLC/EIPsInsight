import React, { useEffect, useState } from 'react';
import { Box, useColorModeValue, Text, Input, SimpleGrid, Button, Flex } from "@chakra-ui/react";
import { saveAs } from 'file-saver';
import AllLayout from './Layout';
import NextLink from 'next/link';

interface EIP {
  _id: string;
  eip: string;
  type: string;
  title:string;
  category: string;
  author: string;
  repo: string;
}

const Author: React.FC = () => {
  const [data, setData] = useState<EIP[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAuthor, setSelectedAuthor] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 25;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/new/graphsv3`);
        const jsonData = await response.json();

        const getEarliestEntries = (data: any[], key: string) => {
          const uniqueEntries: Record<string, any> = {};
          data.forEach(entry => {
            const entryKey = entry[key];
            if (!uniqueEntries[entryKey] || new Date(entry.changeDate) < new Date(uniqueEntries[entryKey].changeDate)) {
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

  // Filter and paginate data
  const filteredData = data.filter(item =>
    !selectedAuthor || item.author.toLowerCase().includes(selectedAuthor.toLowerCase())
  );
  const totalPages = Math.ceil(filteredData.length / cardsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * cardsPerPage,
    currentPage * cardsPerPage
  );

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
        <Flex justifyContent="center" mb={8} alignItems="center" gap={4}>
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
          <Button colorScheme="blue" size="lg" borderRadius="full" onClick={handleDownload}>
            Download Data
          </Button>
        </Flex>
        </Box>
        <Box p={4}>

        {isLoading ? (
          <Text textAlign="center">Loading...</Text>
        ) : (
          <>
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
                    as="a"
                    borderWidth="1px"
                    borderRadius="lg"
                    bg={cardBg}
                    borderColor="blue.100"
                    p={6}
                    shadow="lg"
                    transition="transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out"
                    _hover={{ transform: 'scale(1.05)', shadow: 'xl' }}
                    display="flex"
                    flexDirection="column"
                  >
                    {/* EIP Heading */}
                    <Text fontSize="2xl" fontWeight="extrabold" color="blue.600" mb={4}>
                    {item.repo.toUpperCase()}-{item.eip}
                    </Text>
                    {/* Type */}
                    <Text fontSize="md"  color={useColorModeValue('gray.700', 'gray.300')} mb={1}>
                      <b>Type:</b>{item.type}
                    </Text>
                    {/* <Text fontSize="md" color={useColorModeValue('gray.600', 'gray.400')} mb={3}>
                      {item.type}
                    </Text> */}
                    {/* Category */}
                    <Text fontSize="md" color={useColorModeValue('gray.700', 'gray.300')} mb={1}>
                      <b>Category:</b>{item.category}
                    </Text>
                    {/* <Text fontSize="md" color={useColorModeValue('gray.600', 'gray.400')}>
                      {item.category}
                    </Text> */}
                  </Box>
                   {/* </a> */}
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
