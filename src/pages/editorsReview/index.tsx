import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Box, Flex, Heading, Checkbox, HStack, Button, Menu, MenuButton, MenuList, MenuItem, Table, Thead, Tbody, Tr, Th, Td, Text  } from "@chakra-ui/react";
import AllLayout from "@/components/Layout";
import LoaderComponent from "@/components/Loader";
import { ChevronDownIcon } from "@chakra-ui/icons";


// Dynamic import for Ant Design's Column chart
const Column = dynamic(() => import("@ant-design/plots").then(mod => mod.Column), { ssr: false });

const API_ENDPOINTS = {
  eips: '/api/editorsprseips',
  ercs: '/api/editorsprsercs'
};

const ReviewTracker = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<any[]>([]);
  const [showReviewer, setShowReviewer] = useState<{ [key: string]: boolean }>({});
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'eips' | 'ercs'>('eips'); // Added active tab state

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
  
      const flattenResponse = (response: any) => {
        return Object.entries(response).flatMap(([reviewer, reviews]: [string, any[]]) =>
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
  

  const transformData = (data: any[], rev: any[]): any[] => {
    const monthYearData: { [key: string]: { [reviewer: string]: { monthYear: string, reviewer: string, count: number, prs: any[] } } } = {};

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
        monthYearData[key][reviewer] = { monthYear: key, reviewer: reviewer, count: 0, prs: [] };
      }

      // Avoid counting duplicate records
      const isDuplicate = monthYearData[key][reviewer].prs.some(pr => pr.prNumber === review.prNumber);
      if (!isDuplicate) {
        monthYearData[key][reviewer].count += 1;
        monthYearData[key][reviewer].prs.push(review);
      }
    });

    const result = Object.entries(monthYearData).flatMap(([monthYear, reviewers]) =>
      Object.values(reviewers).filter(item => rev[item.reviewer])
    );

    return result;
  };

  const transformAndGroupData = (data: any[]) => {
    const groupedData = data.reduce((acc, item) => {
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
    }, {} as { [key: string]: { [reviewer: string]: { monthYear: string, reviewer: string, count: number, prs: any[] } } });

    return Object.entries(groupedData).flatMap(([monthYear, reviewers]) =>
      Object.values(reviewers)
    );
  };

  const renderChart = () => {
    const dataToUse = data;
    const transformedData = transformAndGroupData(dataToUse);
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
      <Box mt={8}>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>PR Number</Th>
              <Th>Title</Th>
              <Th>Reviewed By</Th>
              <Th>Review Date</Th>
              <Th>Created Date</Th>
              <Th>Closed Date</Th>
              <Th>Merged Date</Th>
              <Th>Status</Th>
              <Th>Link</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredData.map(pr => {
              const status = pr.merged_at
                ? 'Merged'
                : pr.closed_at
                ? 'Closed'
                : 'Open';

              return (
                <Tr key={pr.prNumber}>
                  <Td>{pr.prNumber}</Td>
                  <Td>{pr.prTitle}</Td>
                  <Td>{pr.reviewer}</Td>
                  <Td>{pr.reviewDate ? new Date(pr.reviewDate).toLocaleDateString() : '-'}</Td>
                  <Td>{pr.created_at ? new Date(pr.created_at).toLocaleDateString() : '-'}</Td>
                  <Td>{pr.closed_at ? new Date(pr.closed_at).toLocaleDateString() : '-'}</Td>
                  <Td>{pr.merged_at ? new Date(pr.merged_at).toLocaleDateString() : '-'}</Td>
                  <Td>{status}</Td>
                  <Td>
                  <Td><button style={{
                      backgroundColor: '#428bca',
                      color: '#ffffff',
                      border: 'none',
                      padding: '10px 20px',
                      cursor: 'pointer',
                      borderRadius: '5px',
                    }}>
                      <a href={`https://github.com/ethereum/${activeTab}/pull/${pr.prNumber}`} target="_blank">Pull Request</a>
                    </button></Td>
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
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
            textAlign="center" style={{ color: '#42a5f5', fontSize: '2.5rem', fontWeight: 'bold', }} > Reviews Tracker</Heading>

<Flex justify="center" mb={8}>
        <Button colorScheme="blue" onClick={() => setActiveTab('eips')} isActive={activeTab === 'eips'}>
          EIPs
        </Button>
        <Button colorScheme="blue" onClick={() => setActiveTab('ercs')} isActive={activeTab === 'ercs'} ml={4}>
          ERCs
        </Button>
      </Flex>

      <Box>{renderChart()}</Box>

      <Box mt={2}>
        <Text color="gray.500" fontStyle="italic" textAlign="center">
          *Note: Reviews can be tracked only if the editor has commented in the conversation.*
        </Text>
      </Box>
      <br/>

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
                      setSelectedMonth(null); // Reset month when a new year is selected
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
                isDisabled={!selectedYear} // Disable if no year is selected
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

            {/* Reviewer Selection */}
            <Menu>
              <MenuButton
                as={Button}
                rightIcon={<ChevronDownIcon />}
                colorScheme="blue"
                isDisabled={!selectedMonth} // Disable if no month is selected
              >
                Reviewers
              </MenuButton>
              <MenuList>
                {Object.keys(showReviewer).map(reviewer => (
                  <MenuItem key={reviewer}>
                    <Checkbox
                      isChecked={showReviewer[reviewer]}
                      onChange={(e) => setShowReviewer({
                        ...showReviewer,
                        [reviewer]: e.target.checked,
                      })}
                    >
                      {reviewer}
                    </Checkbox>
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
          </HStack>
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
