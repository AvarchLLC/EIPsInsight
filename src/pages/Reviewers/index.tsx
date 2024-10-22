import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Box, Flex, Heading, IconButton, Collapse, Checkbox, HStack, Button, Menu, MenuButton, MenuList, MenuItem, Table, Thead, Tbody, Tr, Th, Td, Text, useColorModeValue  } from "@chakra-ui/react";
import AllLayout from "@/components/Layout";
import LoaderComponent from "@/components/Loader";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { CSVLink } from "react-csv";
import {ChevronUpIcon } from "@chakra-ui/icons";
import DateTime from "@/components/DateTime";
// import { Bar } from "@ant-design/charts";
// import { Line } from '@ant-design/charts';  // Import the Line chart component

// Dynamic import for Ant Design's Column chart
const Column = dynamic(() => import("@ant-design/plots").then(mod => mod.Column), { ssr: false });
const Bar = dynamic(() => import("@ant-design/plots").then(mod => mod.Bar), { ssr: false });


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
  const [show, setShow] = useState(false);

  const toggleCollapse = () => setShow(!show);

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

interface PRData {
  monthYear: string;
  prs: { reviewer: string; prCount: number }[];
}

interface LeaderboardChartsProps {
  data: PRData[];
  selectedYear: string;
  selectedMonth: string;
  renderTable: (year: string, month: string) => JSX.Element;
}

const getYearlyData = (data: PRData[]) => {
  const yearlyData: Record<string, number> = data
    .filter(item => {
      // Extract the year from 'monthYear' and check if it falls between 2015 and 2024
      const itemYear = parseInt(item.monthYear.split('-')[0], 10);
      return itemYear >= 2015 && itemYear <= 2024;
    })
    .flatMap(item => item.prs)
    .reduce((acc, item) => {
      acc[item.reviewer] = (acc[item.reviewer] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

  // Sort the data by PR counts in decreasing order
  const sortedYearlyData = Object.entries(yearlyData)
    .sort(([, a], [, b]) => b - a) // Sort by count in decreasing order
    .reduce((acc, [reviewer, count]) => {
      acc[reviewer] = count;
      return acc;
    }, {} as Record<string, number>);

  console.log("Combined data from 2015 to 2024:", sortedYearlyData);
  return sortedYearlyData;
};


// Function to filter PR data for the selected month and year
const getMonthlyData = (data: PRData[], year: string, month: string) => {
  const monthlyData: Record<string, number> = data
    .filter(item => item.monthYear === `${year}-${month.padStart(2, '0')}`)
    .flatMap(item => item.prs)
    .reduce((acc, item) => {
      acc[item.reviewer] = (acc[item.reviewer] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const sortedMonthlyData = Object.entries(monthlyData)
    .sort(([, a], [, b]) => b - a) // Sort by count in decreasing order
    .reduce((acc, [reviewer, count]) => {
      acc[reviewer] = count;
      return acc;
    }, {} as Record<string, number>);

  console.log("Year 2024, month 10:", sortedMonthlyData);
  return sortedMonthlyData;
};

// Function to format data into chart-friendly format
const formatChartData = (rawData: Record<string, number>) => {
  return Object.entries(rawData).map(([reviewer, count]) => ({
    reviewer,
    count,
  }));
};

// Function to configure the Bar chart
// Initialize a global or shared map for reviewer colors
const reviewerColorsMap: Record<string, string> = {};

const getBarChartConfig = (chartData: { reviewer: string; count: number }[]) => {
  return {
    data: chartData,
    xField: "count",
    yField: "reviewer",
    color: (datum: any) => reviewerColorsMap[(datum as { reviewer: string }).reviewer],
    barWidthRatio: 0.8,
    label: {
      position: "middle" as const,
      style: { fill: "#FFFFFF", opacity: 0.7 },
    },
    yAxis: {
      label: {
        formatter: (reviewer: string) => reviewer, // Display reviewer names on Y-axis
      },
    },
    annotations: chartData.map((datum) => ({
      type: 'html',
      position: { count: datum.count, reviewer: datum.reviewer }, // Correcting position
      html: `
        <div style="text-align: center;">
          <img src="https://github.com/${datum.reviewer}.png?size=24" 
               style="margin-left:1px; width: 24px; height: 24px; border-radius: 50%;" />
        </div>
      `,
      offsetY: -12, // Adjust the vertical position to place above the bar
    })),
  };
};




// // Function to render Leaderboard Charts
const renderCharts = (data: PRData[], selectedYear: string, selectedMonth: string) => {
  const yearlyData = getYearlyData(data);
  const monthlyData = getMonthlyData(data, selectedYear, selectedMonth);

  const yearlyChartData = formatChartData(yearlyData);
  const monthlyChartData = formatChartData(monthlyData);

  return (
    <Box padding="2rem">
      <Flex direction={{ base: "column", md: "row" }} justifyContent="space-between">
        {/* Yearly Leaderboard Chart */}
        <Box width={{ base: "100%", md: "45%" }} padding="1rem">
          <Heading size="md" marginBottom="0.5rem">
          {`${activeTab.toLocaleUpperCase()} Overall Leaderboard`}
          </Heading>
          <Bar {...getBarChartConfig(yearlyChartData)} />
        </Box>

        {/* Monthly Leaderboard Chart */}
        <Box width={{ base: "100%", md: "45%" }} padding="1rem">
          <Heading size="md" marginBottom="0.5rem">
            {`${activeTab.toLocaleUpperCase()} Leaderboard for ${selectedMonth.padStart(2, '0')}-${selectedYear}`}
          </Heading>
          <Bar {...getBarChartConfig(monthlyChartData)} />
        </Box>
      </Flex>
    </Box>
  );
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

type ReviewDatum = {
  monthYear: string;
  count: number;
  reviewer: string;
};

const renderChart = () => {
  const dataToUse = data; // Assuming 'data' is accessible in the scope
  const filteredData = dataToUse.filter(item =>
    Object.keys(showReviewer) // Get the list of reviewers from showReviewer
      .filter(reviewer => showReviewer[reviewer]) // Only include checked reviewers
      .includes(item.reviewer) // Check if the item reviewer is in the list of checked reviewers
  );

  const generateDistinctColor = (index: number, total: number) => {
    const hue = (index * (360 / total)) % 360;  // Golden angle for better color distribution
    return `hsl(${hue}, 85%, 50%)`; // High saturation and medium brightness for vibrancy
  };

  // Assign colors if not already assigned
  const reviewers = Array.from(new Set(filteredData.map(item => item.reviewer)));
  const totalReviewers = reviewers.length;
  filteredData.forEach((item, index) => {
    if (!reviewerColorsMap[item.reviewer]) {
      // Assign a new color only if the reviewer doesn't already have one
      reviewerColorsMap[item.reviewer] = generateDistinctColor(Object.keys(reviewerColorsMap).length, totalReviewers);
    }
  });

  // Transform and group the filtered data based on your business logic
  const transformedData = transformAndGroupData(filteredData);

  // Sort the transformed data by monthYear
  const sortedData = transformedData.sort((a, b) => a.monthYear.localeCompare(b.monthYear));

  // Chart configuration
  const config = {
    data: sortedData as ReviewDatum[], // Ensure sortedData matches the expected type
    xField: "monthYear", // X-axis field
    yField: "count", // Y-axis field
    color: (datum: any) => reviewerColorsMap[(datum as ReviewDatum).reviewer], // Typecast datum to ReviewDatum
    seriesField: "reviewer", // Field for series grouping
    isGroup: true, // Grouping behavior
    columnStyle: {
      radius: [20, 20, 0, 0], // Rounded corners
    },
    slider: {
      start: 0, // Start of the slider
      end: 1, // End of the slider
    },
    legend: { position: "top-right" as const }, // Legend position
    smooth: true, // Smooth transition
  };

  // Render the Column chart with the provided config
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
        <Box mt={8} overflowX="auto" overflowY="auto" maxHeight="600px" border="2px solid #e2e8f0" borderRadius="10px 10px 10px 10px" boxShadow="lg">
            <Table variant="striped" colorScheme="blue" >
                <Thead bg="#2D3748">
                    <Tr>
                        <Th color="white" textAlign="center" verticalAlign="middle"  borderTopLeftRadius="10px">
                            PR Number
                        </Th>
                        <Th color="white" textAlign="center" verticalAlign="middle" >
                            Title
                        </Th>
                        <Th color="white" textAlign="center" verticalAlign="middle" >
                            Reviewed By
                        </Th>
                        <Th color="white" textAlign="center" verticalAlign="middle" >
                            Review Date
                        </Th>
                        <Th color="white" textAlign="center" verticalAlign="middle" >
                            Created Date
                        </Th>
                        <Th color="white" textAlign="center" verticalAlign="middle" >
                            Closed Date
                        </Th>
                        <Th color="white" textAlign="center" verticalAlign="middle" >
                            Merged Date
                        </Th>
                        <Th color="white" textAlign="center" verticalAlign="middle" >
                            Status
                        </Th>
                        <Th color="white" textAlign="center" verticalAlign="middle"  borderTopRightRadius="10px">
                            Link
                        </Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {filteredData.map((pr, index) => {
                        const status = pr.merged_at
                            ? 'Merged'
                            : pr.closed_at
                                ? 'Closed'
                                : 'Open';

                        return (
                            <Tr key={pr.prNumber}> {/* Set border for rows */}
                                <Td textAlign="center" verticalAlign="middle"  width="100px">
                                    {pr.prNumber}
                                </Td>
                                <Td textAlign="center" verticalAlign="middle"  style={{ wordWrap: 'break-word', maxWidth: '200px' }}>
                                    {pr.prTitle}
                                </Td>
                                <Td textAlign="center" verticalAlign="middle" >
                                    {pr.reviewer}
                                </Td>
                                <Td textAlign="center" verticalAlign="middle" >
                                    {pr.reviewDate ? new Date(pr.reviewDate).toLocaleDateString() : '-'}
                                </Td>
                                <Td textAlign="center" verticalAlign="middle" >
                                    {pr.created_at ? new Date(pr.created_at).toLocaleDateString() : '-'}
                                </Td>
                                <Td textAlign="center" verticalAlign="middle" >
                                    {pr.closed_at ? new Date(pr.closed_at).toLocaleDateString() : '-'}
                                </Td>
                                <Td textAlign="center" verticalAlign="middle" >
                                    {pr.merged_at ? new Date(pr.merged_at).toLocaleDateString() : '-'}
                                </Td>
                                <Td textAlign="center" verticalAlign="middle" >
                                    {status}
                                </Td>
                                <Td textAlign="center" verticalAlign="middle">
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
            textAlign="center" style={{ color: '#42a5f5', fontSize: '2.5rem', fontWeight: 'bold', }} > Editors Tracker</Heading>


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
        > Editors Tracker FAQ
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
          What does this tool do?
        </Heading>
        <Text
          fontSize="md"
          marginBottom={2}
          color={useColorModeValue("gray.800", "gray.200")}
          className="text-justify"
        >
          This tool provides a comprehensive overview of all EIP editor reviews
          conducted to date. It displays the total number of reviews each month
          for each editor, allowing you to easily track and analyze review
          activity across different months and editors.
        </Text>

        <Heading
          as="h4"
          size="md"
          marginBottom={4}
          color={useColorModeValue("#3182CE", "blue.300")}
        >
          How can I view data for a specific Month?
        </Heading>
        <Text
          fontSize="md"
          marginBottom={2}
          color={useColorModeValue("gray.800", "gray.200")}
          className="text-justify"
        >
          To view data for a specific month, you can use the timeline scroll bar
          or click the View More button. From there, select the desired Year and
          Month using the dropdown menus, and the table and graph will
          automatically update to display data for that selected month.
        </Text>

        <Heading
          as="h4"
          size="md"
          marginBottom={4}
          color={useColorModeValue("#3182CE", "blue.300")}
        >
          How can I view data for a specific EIP Editor?
        </Heading>
        <Text
          fontSize="md"
          color={useColorModeValue("gray.800", "gray.200")}
          className="text-justify"
        >
          You can refine the data by selecting or deselecting specific editors
          from the checkbox list. This will filter the chart and table to show
          data only for the selected editors, enabling you to focus on
          individual contributions.
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

      <Box padding={"2rem"} borderRadius={"0.55rem"}>
            {renderChart()}
            <Box className={"w-full"}>
              <DateTime />
            </Box>
          </Box>
      <Box>
      <Text color="gray.500" fontStyle="italic" textAlign="center">
          *Please note: The data is refreshed every 24 hours to ensure accuracy and up-to-date information*
        </Text>
      </Box>
      
      <br/>
      <Flex justify="center" mb={8}>
         {/* Reviewer Selection */}
         <HStack spacing={4}>
         <Menu closeOnSelect={false}>
          <MenuButton
            as={Button}
            rightIcon={<ChevronDownIcon />}
            colorScheme="blue"
            size="md" 
            width="150px"
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
            <MenuItem
              onClick={() => {
                const updatedReviewers = Object.keys(showReviewer).reduce((acc: ShowReviewerType, reviewer: string) => {
                  acc[reviewer] = true;
                  return acc;
                }, {} as ShowReviewerType); 
                setShowReviewer(updatedReviewers);
              }}
            >
              <Text as="span" fontWeight="bold" textDecoration="underline">
                Select All
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

        <Button size="md" width="150px" colorScheme="blue" onClick={toggleDropdown}>
          {showDropdown ? 'Hide' : 'View More'}
        </Button>
        </HStack>
        <br/>
         
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
          {renderCharts(data, selectedYear, selectedMonth)}
          {renderTable(selectedYear, selectedMonth, showReviewer)}
        </Box>
      )}
    </Box>
  </AllLayout>
)
); };





export default ReviewTracker;
