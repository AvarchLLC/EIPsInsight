import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Box, Flex, Heading, Checkbox, HStack, Button, Menu, MenuButton, MenuList, MenuItem, Table, Thead, Tbody, Tr, Th, Td, Text, useColorModeValue  } from "@chakra-ui/react";
import AllLayout from "@/components/Layout";
import LoaderComponent from "@/components/Loader";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { CSVLink } from "react-csv";

// Dynamic import for Ant Design's Column chart
const Column = dynamic(() => import("@ant-design/plots").then(mod => mod.Column), { ssr: false });

const API_ENDPOINTS = {
  eips: '/api/editorsprseips',
  ercs: '/api/editorsprsercs',
  rips: '/api/editorsprsrips'
};

type ShowReviewerType = { [key: string]: boolean }; 

const ReviewTracker = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<any[]>([]);
  const [showReviewer, setShowReviewer] = useState<{ [key: string]: boolean }>({});
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'eips' | 'ercs' | 'rips'>('eips');
  const [csvData, setCsvData] = useState<any[]>([]); // State for storing CSV data

  // Function to generate CSV data
  type PR = {
    prNumber: number;
    prTitle: string;
    reviewDate?: string;
    created_at?: string;
    closed_at?: string;
    merged_at?: string;
  };

  const generateCSVData = () => {
    if (!selectedYear || !selectedMonth) {
      console.error('Year and Month must be selected to generate CSV');
      return;
    }
  
    const filteredData = data
      .filter(item => item.monthYear === `${selectedYear}-${selectedMonth}`)
      .filter(item => showReviewer[item.reviewer]);
  
    const csv = filteredData.flatMap(item =>
      item.prs.map((pr: PR) => ({
        PR_Number: pr.prNumber,
        Title: pr.prTitle,
        Reviewer: item.reviewer,
        Review_Date: pr.reviewDate ? new Date(pr.reviewDate).toLocaleDateString() : '-',
        Created_Date: pr.created_at ? new Date(pr.created_at).toLocaleDateString() : '-',
        Closed_Date: pr.closed_at ? new Date(pr.closed_at).toLocaleDateString() : '-',
        Merged_Date: pr.merged_at ? new Date(pr.merged_at).toLocaleDateString() : '-',
        Status: pr.merged_at ? 'Merged' : pr.closed_at ? 'Closed' : 'Open',
        Link: `https://github.com/ethereum/${activeTab}/pull/${pr.prNumber}`,
      }))
    );
  
    setCsvData(csv); // Update the state with the generated CSV data
  };

  useEffect(() => {
    fetchData();
    resetReviewerList(); // Reset reviewers when switching tabs
  }, [activeTab]); // Fetch data and reset reviewers when the active tab changes
  
  const resetReviewerList = () => {
    setShowReviewer({}); // Clear previous reviewers list when switching tabs
  };
  
  const fetchData = async () => {
    setLoading(true);
    try {
      const endpoint = API_ENDPOINTS[activeTab];
      const response = await fetch(endpoint);
      const responseData = await response.json();
  
      const flattenResponse = (response: Record<string, any[]>) => {
        return Object.entries(response).flatMap(([reviewer, reviews]) =>
          reviews.map(review => ({ ...review, reviewer }))
        );
      };
      
  
      const newData = flattenResponse(responseData);
      const reviewers = Array.from(new Set(newData.map(review => review.reviewer)));
      const initialShowReviewer = reviewers.reduce(
        (acc, reviewer) => ({ ...acc, [reviewer]: true }),
        {}
      );
      
      setShowReviewer(initialShowReviewer); // Set reviewer list after fetching data
  
      const transformedData = transformData(newData, initialShowReviewer);
      setData(transformedData);
    } catch (error) {
      console.error("Failed to fetch review data:", error);
    }
    setLoading(false);
  };
  

  const transformData = (
    data: any[], 
    rev: { [key: string]: boolean } // Assuming `rev` is an object where keys are reviewer names
  ): any[] => {
    const monthYearData: {
      [key: string]: { 
        [reviewer: string]: { 
          monthYear: string, 
          reviewer: string, 
          count: number, 
          prs: any[] 
        } 
      } 
    } = {};
  
    data.forEach(review => {
      const reviewDate = new Date(review.reviewDate || review.created_at || review.closed_at || review.merged_at);
      if (isNaN(reviewDate.getTime())) {
        console.error("Invalid date format for review:", review);
        return;
      }
  
      const key = `${reviewDate.getFullYear()}-${String(reviewDate.getMonth() + 1).padStart(2, '0')}`;
      const reviewer = review.reviewer;
  
      if (!monthYearData[key]) {
        monthYearData[key] = {};
      }
  
      if (!monthYearData[key][reviewer]) {
        monthYearData[key][reviewer] = { monthYear: key, reviewer, count: 0, prs: [] };
      }
  
      // Avoid counting duplicate records
      const isDuplicate = monthYearData[key][reviewer].prs.some(pr => pr.prNumber === review.prNumber);
      if (!isDuplicate) {
        monthYearData[key][reviewer].count += 1;
        monthYearData[key][reviewer].prs.push(review);
      }
    });
  
    const result = Object.entries(monthYearData).flatMap(([monthYear, reviewers]) => 
      Object.values(reviewers).filter((item: { reviewer: string }) => rev[item.reviewer])
    );
  
    return result;
  };
  

// Define types for clarity
interface ReviewData {
  monthYear: string;
  reviewer: string;
  count: number;
  prs: any[];
}

type GroupedData = {
  [monthYear: string]: {
    [reviewer: string]: ReviewData;
  };
};

const transformAndGroupData = (data: any[]): ReviewData[] => {
  const groupedData: GroupedData = data.reduce((acc, item) => {
    const { monthYear, reviewer, count, prs } = item;
    
    if (!acc[monthYear]) {
      acc[monthYear] = {};
    }
    
    if (!acc[monthYear][reviewer]) {
      acc[monthYear][reviewer] = { monthYear, reviewer, count: 0, prs: [] };
    }
    
    acc[monthYear][reviewer].count += count;
    acc[monthYear][reviewer].prs = [...acc[monthYear][reviewer].prs, ...prs];
    
    return acc;
  }, {} as GroupedData);

  return Object.entries(groupedData).flatMap(([monthYear, reviewers]) =>
    Object.values(reviewers) // TypeScript should now infer this correctly
  );
};

  
  

  const renderChart = () => {
    const dataToUse = data;
    const filteredData = dataToUse.filter(item =>
      Object.keys(showReviewer)
        .filter(reviewer => showReviewer[reviewer]) // Only checked reviewers
        .includes(item.reviewer) // Assuming 'reviewer' is a key in your data
    );
  
    // Transform and sort the filtered data
    const transformedData = transformAndGroupData(filteredData);
    const sortedData = transformedData.sort((a, b) => a.monthYear.localeCompare(b.monthYear));

    const config = {
      data: sortedData,
      xField: "monthYear",
      yField: "count",
      colorField: "reviewer",
      seriesField: "reviewer",
      isGroup: true,
      columnStyle: {
        radius: [20, 20, 0, 0],
      },
      slider: {
        start: 0,
        end: 1,
      },
      legend: { position: "top-right" as const },
      smooth: true,
      label: {
        position: "middle" as const,
        style: {
          fill: "#FFFFFF",
          opacity: 0.6,
        },
      },
    };

    return <Column {...config} />;
  };

  const toggleDropdown = () => setShowDropdown(prev => !prev);

  const getYears = () => {
    const years = Array.from(new Set(data.map(item => item.monthYear.split('-')[0])));
    return years.sort((a, b) => b.localeCompare(a));
  };

  const getMonths = (year: string) => {
    const months = Array.from(new Set(data.filter(item => item.monthYear.startsWith(year)).map(item => item.monthYear.split('-')[1])));
    return months.sort((a, b) => parseInt(a) - parseInt(b));
  };

  const renderTable = (year: string, month: string, reviewerFilter: any) => {
    const filteredData = data
      .filter(item => item.monthYear === `${year}-${month}`)
      .filter(item => reviewerFilter[item.reviewer])
      .flatMap(item => item.prs)
      .reduce((acc: any[], pr) => {
        if (!acc.some(existingPr => existingPr.prNumber === pr.prNumber)) {
          acc.push(pr);
        }
        return acc;
      }, []);

    return (
      <Box mt={8} border="1px solid #e2e8f0" borderRadius="10px 10px 0 0" boxShadow="lg">
        <Table variant="striped" colorScheme="blue">
          <Thead bg="#2D3748">
            <Tr>
              <Th color="white" textAlign="center" borderTopLeftRadius="10px">PR Number</Th>
              <Th color="white" textAlign="center">Title</Th>
              <Th color="white" textAlign="center">Reviewed By</Th>
              <Th color="white" textAlign="center">Review Date</Th>
              <Th color="white" textAlign="center">Created Date</Th>
              <Th color="white" textAlign="center">Closed Date</Th>
              <Th color="white" textAlign="center">Merged Date</Th>
              <Th color="white" textAlign="center">Status</Th>
              <Th color="white" textAlign="center" borderTopRightRadius="10px">Link</Th>
            </Tr>
          </Thead>
        </Table>

        <Box overflowY="auto" maxHeight="400px" borderBottomRadius="0" borderTopWidth="1px" borderTopColor="gray.200">
          <Table variant="striped" colorScheme="blue">
            <Tbody>
              {filteredData.map(pr => {
                const status = pr.merged_at
                  ? 'Merged'
                  : pr.closed_at
                  ? 'Closed'
                  : 'Open';

                return (
                  <Tr key={pr.prNumber}>
                    <Td textAlign="center">{pr.prNumber}</Td>
                    <Td textAlign="center">{pr.prTitle}</Td>
                    <Td textAlign="center">{pr.reviewer}</Td>
                    <Td textAlign="center">{pr.reviewDate ? new Date(pr.reviewDate).toLocaleDateString() : '-'}</Td>
                    <Td textAlign="center">{pr.created_at ? new Date(pr.created_at).toLocaleDateString() : '-'}</Td>
                    <Td textAlign="center">{pr.closed_at ? new Date(pr.closed_at).toLocaleDateString() : '-'}</Td>
                    <Td textAlign="center">{pr.merged_at ? new Date(pr.merged_at).toLocaleDateString() : '-'}</Td>
                    <Td textAlign="center">{status}</Td>
                    <Td textAlign="center">
                      <Button
                        as="a"
                        href={`https://github.com/ethereum/${activeTab}/pull/${pr.prNumber}`}
                        target="_blank"
                        colorScheme="blue"
                        variant="solid"
                      >
                        Pull Request
                      </Button>
                    </Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </Box>
      </Box>
    );
  };

  return (
    loading ? (
      <LoaderComponent />
    ) : (
      <AllLayout>
        <Box padding={8} margin={8}>
          <Heading
            size="xl"
            marginBottom={10}
            textAlign="center" style={{ color: '#42a5f5', fontSize: '2.5rem', fontWeight: 'bold', }} > Reviewers Tracker</Heading>


      <Box
        padding={4}
        bg={useColorModeValue("blue.50", "gray.700")}
        borderRadius="md"
        marginBottom={8}
      >
        <Heading
          as="h3"
          size="lg"
          marginBottom={4}
          color={useColorModeValue("#3182CE", "blue.300")}
        >
          How to Use the Reviewers Tracker?
        </Heading>
        <Text
          fontSize="md"
          marginBottom={2}
          color={useColorModeValue("gray.800", "gray.200")}
        >
          <strong>Default View:</strong> Initially, the graph displays all the data about monthly pull requests (PRs)
          reviewed by every reviewer. This gives you a comprehensive overview of the reviews for all months and reviewers.
        </Text>
        <Text
          fontSize="md"
          marginBottom={2}
          color={useColorModeValue("gray.800", "gray.200")}
        >
          <strong>Viewing Data for a Specific Month:</strong> To focus on data from a particular month, click on the
          "View More" button. Then, select the desired year and month using the dropdown menus. The table and graph will
          update to show only the data for that specific month.
        </Text>
        <Text
          fontSize="md"
          color={useColorModeValue("gray.800", "gray.200")}
        >
          <strong>Filtering by Reviewers:</strong> You can further refine the data by selecting or unselecting specific
          reviewers from the checkbox list. This will filter the chart and table to display data only for the chosen
          reviewers, allowing you to focus on individual contributions.
        </Text>
      </Box>


      <Flex justify="center" mb={8}>
        <Button colorScheme="blue" onClick={() => setActiveTab('eips')} isActive={activeTab === 'eips'}>
          EIPs
        </Button>
        <Button colorScheme="blue" onClick={() => setActiveTab('ercs')} isActive={activeTab === 'ercs'} ml={4}>
          ERCs
        </Button>
        <Button colorScheme="blue" onClick={() => setActiveTab('rips')} isActive={activeTab === 'rips'} ml={4}>
          RIPs
        </Button>
      </Flex>

      <Box>{renderChart()}</Box>
      <Box mt={2}>
      <Text color="gray.500" fontStyle="italic" textAlign="center">
          *Please note: The data is refreshed every 24 hours to ensure accuracy and up-to-date information*
        </Text>
        </Box>
      
      <br/>
      <Flex justify="center" mb={8}>
         {/* Reviewer Selection */}
         <Menu closeOnSelect={false}>
  <MenuButton
    as={Button}
    rightIcon={<ChevronDownIcon />}
    colorScheme="blue"
  >
    Reviewers
  </MenuButton>

  {/* Make MenuList scrollable after 6 items */}
  <MenuList maxHeight="200px" overflowY="auto">
    <MenuItem
      onClick={() => {
        const updatedReviewers = Object.keys(showReviewer).reduce((acc: ShowReviewerType, reviewer: string) => {
          acc[reviewer] = false;
          return acc;
        }, {} as ShowReviewerType); 
        setShowReviewer(updatedReviewers);
      }}
    >
      <Text as="span" fontWeight="bold" textDecoration="underline">
        Remove All
      </Text>
    </MenuItem>

    {Object.keys(showReviewer).map((reviewer: string) => (
      <MenuItem key={reviewer}>
        <Checkbox
          isChecked={showReviewer[reviewer]}
          onChange={(e) =>
            setShowReviewer({
              ...showReviewer,
              [reviewer]: e.target.checked,
            })
          }
        >
          {reviewer}
        </Checkbox>
      </MenuItem>
    ))}
  </MenuList>
</Menu>
<br/>

      </Flex>

      <Flex justify="center" mb={8}>
        <Button colorScheme="blue" onClick={toggleDropdown}>
          {showDropdown ? 'Hide' : 'View More'}
        </Button>
      </Flex>

      {showDropdown && (
        <Box mb={8} display="flex" justifyContent="center">
          <HStack spacing={4}>
            {/* Year Selection */}
            <Menu>
              <MenuButton as={Button} rightIcon={<ChevronDownIcon />} colorScheme="blue">
                {selectedYear ? `Year: ${selectedYear}` : 'Select Year'}
              </MenuButton>
              <MenuList>
                {getYears().map((year) => (
                  <MenuItem
                    key={year}
                    onClick={() => {
                      setSelectedYear(year);
                      setSelectedMonth(null); 
                    }}
                  >
                    {year}
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>

            {/* Month Selection */}
            <Menu>
              <MenuButton
                as={Button}
                rightIcon={<ChevronDownIcon />}
                colorScheme="blue"
                isDisabled={!selectedYear} 
              >
                {selectedMonth ? `Month: ${selectedMonth}` : 'Select Month'}
              </MenuButton>
              <MenuList>
                {selectedYear && getMonths(selectedYear).map((month, index) => (
                  <MenuItem key={index} onClick={() => setSelectedMonth(month)}>
                    {month}
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>


          </HStack>
        </Box>
      )}
      {selectedYear && selectedMonth && (
          <Box mt={8}>
            {/* Download CSV section */}
            <Box padding={4} bg="blue.50" borderRadius="md" marginBottom={8}>
              <Text fontSize="lg"
    marginBottom={2}
    color={useColorModeValue("gray.800", "gray.200")}>
                You can download the data here:
              </Text>
              <CSVLink 
                data={csvData.length ? csvData : []} 
                filename={`reviews_${selectedYear}_${selectedMonth}.csv`} 
                onClick={(e:any) => {
                  generateCSVData();
                  if (csvData.length === 0) {
                    e.preventDefault(); 
                    console.error("CSV data is empty or not generated correctly.");
                  }
                }}
              >
                <Button colorScheme="blue">Download CSV</Button>
              </CSVLink>
            </Box>
          </Box>
      )}

      {selectedYear && selectedMonth && (
        <Box mt={8}>
          {renderTable(selectedYear, selectedMonth, showReviewer)}
        </Box>
      )}
    </Box>
  </AllLayout>
)
); };





export default ReviewTracker;
