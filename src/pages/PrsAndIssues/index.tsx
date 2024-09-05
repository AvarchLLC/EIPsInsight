import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  Spinner,
  Heading,
  Select,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Checkbox,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useDisclosure,
  IconButton,
  HStack
} from "@chakra-ui/react";
import LoaderComponent from "@/components/Loader";
import AllLayout from "@/components/Layout";

const getYears = () => {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: currentYear - 2019 }, (_, i) => currentYear - i); // Assuming you want data from 2020 onwards
};

const getMonths = (year) => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth(); // 0-indexed (0 = January, 11 = December)
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  return year === currentYear ? months.slice(0, currentMonth + 1) : months;
};

// Dynamic import for Ant Design's Column chart
const Column = dynamic(() => import("@ant-design/plots").then(mod => mod.Column), { ssr: false });

const PR_API_ENDPOINTS = ['/api/eipsprdetails', '/api/ercsprdetails'];
const ISSUE_API_ENDPOINTS = ['/api/eipsissuedetails', '/api/ercsissuedetails'];

type PR = {
  prNumber: number;
  prTitle: string;
  created_at: Date;
  closed_at: Date | null;
  merged_at: Date | null;
};

type Issue = {
  IssueNumber: number;
  IssueTitle: string;
  state: string;
  created_at: Date;
  closed_at: Date | null;
};

const GitHubPRTracker: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'PRs' | 'Issues'>('PRs');
  const [selectedRepo, setSelectedRepo] = useState<string>('EIPs');
  const { isOpen: showDropdown, onToggle: toggleDropdown } = useDisclosure();
  // const [selectedYear, setSelectedYear] = useState(null);
  // const [selectedMonth, setSelectedMonth] = useState(null);
  const [data, setData] = useState<{
    PRs: { [key: string]: { created: PR[], closed: PR[], merged: PR[] } };
    Issues: { [key: string]: { created: Issue[], closed: Issue[] } };
  }>({ PRs: {}, Issues: {} });

  // const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [showCategory, setShowCategory] = useState<{ [key: string]: boolean }>({
    created: true,
    closed: true,
    merged: true,
  });

  useEffect(() => {
    fetchData();
  }, [activeTab, selectedRepo]);

  const fetchPRData = async () => {
    try {
      const [eipsData, ercsData] = await Promise.all(
        PR_API_ENDPOINTS.map(endpoint => fetch(endpoint).then(res => res.json()))
      );

      const selectedData = selectedRepo === 'EIPs' ? eipsData : ercsData;
      const transformedData = transformPRData(selectedData);

      setData(prevData => ({
        ...prevData,
        PRs: transformedData
      }));
    } catch (error) {
      console.error("Failed to fetch PR data:", error);
    }
  };

  const fetchIssueData = async () => {
    try {
      const [eipsData, ercsData] = await Promise.all(
        ISSUE_API_ENDPOINTS.map(endpoint => fetch(endpoint).then(res => res.json()))
      );

      const selectedData = selectedRepo === 'EIPs' ? eipsData : ercsData;
      const transformedData = transformIssueData(selectedData);

      setData(prevData => ({
        ...prevData,
        Issues: transformedData
      }));
    } catch (error) {
      console.error("Failed to fetch Issues data:", error);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    if (activeTab === 'PRs') {
      await fetchPRData();
    } else if (activeTab === 'Issues') {
      await fetchIssueData();
    }
    setLoading(false);
  };

  const transformPRData = (data: PR[]): { [key: string]: { created: PR[], closed: PR[], merged: PR[] } } => {
    const monthYearData: { [key: string]: { created: PR[], closed: PR[], merged: PR[] } } = {};

    data.forEach(pr => {
      const createdDate = pr.created_at ? new Date(pr.created_at) : null;
      const closedDate = pr.closed_at ? new Date(pr.closed_at) : null;
      const mergedDate = pr.merged_at ? new Date(pr.merged_at) : null;

      if (createdDate) {
        const key = `${createdDate.getFullYear()}-${String(createdDate.getMonth() + 1).padStart(2, '0')}`;
        if (!monthYearData[key]) monthYearData[key] = { created: [], closed: [], merged: [] };
        monthYearData[key].created.push(pr);
      }

      if (closedDate && !mergedDate) {
        const key = `${closedDate.getFullYear()}-${String(closedDate.getMonth() + 1).padStart(2, '0')}`;
        if (!monthYearData[key]) monthYearData[key] = { created: [], closed: [], merged: [] };
        monthYearData[key].closed.push(pr);
      }

      if (mergedDate) {
        const key = `${mergedDate.getFullYear()}-${String(mergedDate.getMonth() + 1).padStart(2, '0')}`;
        if (!monthYearData[key]) monthYearData[key] = { created: [], closed: [], merged: [] };
        monthYearData[key].merged.push(pr);
      }
    });

    return monthYearData;
  };

  const transformIssueData = (data: Issue[]): { [key: string]: { created: Issue[], closed: Issue[] } } => {
    const monthYearData: { [key: string]: { created: Issue[], closed: Issue[] } } = {};

    data.forEach(issue => {
      const createdDate = new Date(issue.created_at);
      const key = `${createdDate.getFullYear()}-${String(createdDate.getMonth() + 1).padStart(2, '0')}`;
      if (!monthYearData[key]) monthYearData[key] = { created: [], closed: [] };
      monthYearData[key].created.push(issue);

      if (issue.closed_at) {
        const closedDate = new Date(issue.closed_at);
        const closedKey = `${closedDate.getFullYear()}-${String(closedDate.getMonth() + 1).padStart(2, '0')}`;
        if (!monthYearData[closedKey]) monthYearData[closedKey] = { created: [], closed: [] };
        monthYearData[closedKey].closed.push(issue);
      }
    });

    return monthYearData;
  };

  const getYears = () => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 10 }, (_, i) => currentYear - i);
  };

  const getMonths = () => [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const renderTable = (year: string, month: string, type: 'PRs' | 'Issues') => {
    const dataToUse = type === 'PRs' ? data.PRs : data.Issues;
    const key = `${year}-${String(getMonths().indexOf(month) + 1).padStart(2, '0')}`;
    const items = dataToUse[key] || (type === 'PRs' ? { created: [], closed: [], merged: [] } : { created: [], closed: [] });
  
    return (
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Number</Th>
            <Th>Title</Th>
            {type === 'PRs' ? (
              <>
                <Th>State</Th>
                <Th>Created At</Th>
                <Th>Closed At</Th>
                <Th>Merged At</Th>
              </>
            ) : (
              <>
                <Th>State</Th>
                <Th>Created Date</Th>
                <Th>Closed Date</Th>
              </>
            )}
            <Th>Link</Th>
          </Tr>
        </Thead>
        <Tbody>
          {items.created.length === 0 && items.closed.length === 0 && (type === 'PRs' && items.merged.length === 0) ? (
            <Tr>
              <Td colSpan={type === 'PRs' ? 6 : 5} textAlign="center">No Data Available</Td>
            </Tr>
          ) : (
            <>
              {/* Render Created Items */}
              {showCategory.created && items.created.map((item) => (
                <Tr key={`created-${item.prNumber || item.IssueNumber}`}>
                  <Td>{item.prNumber || item.IssueNumber}</Td>
                  <Td>{item.prTitle || item.IssueTitle}</Td>
                  {type === 'PRs' ? (
                    <>
                      <Td>Created</Td>
                      <Td>{item.created_at ? new Date(item.created_at).toLocaleDateString() : '-'}</Td>
                      <Td>{item.closed_at ? new Date(item.closed_at).toLocaleDateString() : '-'}</Td>
                      <Td>{item.merged_at ? new Date(item.merged_at).toLocaleDateString() : '-'}</Td>
                      <Td><button style={{
                      backgroundColor: '#428bca',
                      color: '#ffffff',
                      border: 'none',
                      padding: '10px 20px',
                      cursor: 'pointer',
                      borderRadius: '5px',
                    }}>
                      <a href={`https://github.com/ethereum/${selectedRepo}/pull/${item.prNumber||item.IssueNumber}`} target="_blank">Pull Request</a>
                    </button></Td>
                    </>
                  ) : (
                    <>
                      <Td>{item.state}</Td>
                      <Td>{item.created_at ? new Date(item.created_at).toLocaleDateString() : '-'}</Td>
                      <Td>{item.closed_at ? new Date(item.closed_at).toLocaleDateString() : '-'}</Td>
                      <Td><button style={{
                      backgroundColor: '#428bca',
                      color: '#ffffff',
                      border: 'none',
                      padding: '10px 20px',
                      cursor: 'pointer',
                      borderRadius: '5px',
                    }}>
                      <a href={`https://github.com/ethereum/${selectedRepo}/issue/${item.prNumber||item.IssueNumber}`} target="_blank">Issue</a>
                    </button></Td>
                    </>
                  )}
                </Tr>
              ))}
  
              {/* Render Closed Items */}
              {showCategory.closed && items.closed.map((item) => (
                <Tr key={`closed-${item.prNumber || item.IssueNumber}`}>
                  <Td>{item.prNumber || item.IssueNumber}</Td>
                  <Td>{item.prTitle || item.IssueTitle}</Td>
                  {type === 'PRs' ? (
                    <>
                      <Td>Closed</Td>
                      <Td>{item.created_at ? new Date(item.created_at).toLocaleDateString() : '-'}</Td>
                      <Td>{item.closed_at ? new Date(item.closed_at).toLocaleDateString() : '-'}</Td>
                      <Td>{item.merged_at ? new Date(item.merged_at).toLocaleDateString() : '-'}</Td>
                      <Td><button style={{
                      backgroundColor: '#428bca',
                      color: '#ffffff',
                      border: 'none',
                      padding: '10px 20px',
                      cursor: 'pointer',
                      borderRadius: '5px',
                    }}>
                      <a href={`https://github.com/ethereum/${selectedRepo}/pull/${item.prNumber||item.IssueNumber}`} target="_blank">Pull Request</a>
                    </button></Td>
                    </>
                  ) : (
                    <>
                      <Td>{item.state}</Td>
                      <Td>{item.created_at ? new Date(item.created_at).toLocaleDateString() : '-'}</Td>
                      <Td>{item.closed_at ? new Date(item.closed_at).toLocaleDateString() : '-'}</Td>
                      <Td><button style={{
                      backgroundColor: '#428bca',
                      color: '#ffffff',
                      border: 'none',
                      padding: '10px 20px',
                      cursor: 'pointer',
                      borderRadius: '5px',
                    }}>
                      <a href={`https://github.com/ethereum/${selectedRepo}/issue/${item.prNumber||item.IssueNumber}`} target="_blank">Issue</a>
                    </button></Td>
                    </>
                  )}
                </Tr>
              ))}
  
              {/* Render Merged Items (only for PRs) */}
              {showCategory.merged && type === 'PRs' && items.merged.map((item) => (
                <Tr key={`merged-${item.prNumber || item.IssueNumber}`}>
                  <Td>{item.prNumber || '-'}</Td>
                  <Td>{item.prTitle || '-'}</Td>
                  <Td>Merged</Td>
                  <Td>{item.created_at ? new Date(item.created_at).toLocaleDateString() : '-'}</Td>
                  <Td>{item.closed_at ? new Date(item.closed_at).toLocaleDateString() : '-'}</Td>
                  <Td>{item.merged_at ? new Date(item.merged_at).toLocaleDateString() : '-'}</Td>
                  <Td><button style={{
                      backgroundColor: '#428bca',
                      color: '#ffffff',
                      border: 'none',
                      padding: '10px 20px',
                      cursor: 'pointer',
                      borderRadius: '5px',
                    }}>
                      <a href={`https://github.com/ethereum/${selectedRepo}/pull/${item.prNumber||item.IssueNumber}`} target="_blank">Pull Request</a>
                    </button></Td>
                </Tr>
              ))}
            </>
          )}
        </Tbody>
      </Table>
    );
  };
  
  

  const renderChart = () => {
    const dataToUse = activeTab === 'PRs' ? data.PRs : data.Issues;

    // Transform data for chart rendering
    const transformedData = Object.keys(dataToUse).flatMap(monthYear => {
      const items = dataToUse[monthYear];
      return [
        ...(showCategory.created ? [{ monthYear, type: 'Created', count: items.created.length }] : []),
        ...(activeTab === 'PRs' && showCategory.merged ? [{ monthYear, type: 'Merged', count: items.merged?.length || 0 }] : []),
        ...(showCategory.closed ? [{ monthYear, type: 'Closed', count: items.closed.length }] : [])
      ];
    });

    // Sort data by monthYear in ascending order
    const sortedData = transformedData.sort((a, b) => a.monthYear.localeCompare(b.monthYear));

    const config = {
      data: sortedData,
      xField: "monthYear",
      yField: "count",
      colorField: "type",
      seriesField: "type",
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

  return (
    loading ? (
      <LoaderComponent />
    ) : (
      <AllLayout>
        <Box paddingLeft={20} paddingRight={20} marginTop={20} marginBottom={10}>
          <Heading
            size="xl"
            marginTop={30}
            marginBottom={10}
            textAlign="center"
            style={{
              color: '#42a5f5',
              fontSize: '2.5rem',
              fontWeight: 'bold',
            }}
          >
            EIPs and ERCs PRs & Issues
          </Heading>
          <Flex gap={4} justify="center" mt={4} mb={8}>
            <Button
              onClick={() => setActiveTab('PRs')}
              bg={activeTab === 'PRs' ? 'blue.500' : 'gray.300'}
              color={activeTab === 'PRs' ? 'white' : 'black'}
            >
              PRs
            </Button>
            <Button
              onClick={() => setActiveTab('Issues')}
              bg={activeTab === 'Issues' ? 'blue.500' : 'gray.300'}
              color={activeTab === 'Issues' ? 'white' : 'black'}
            >
              Issues
            </Button>
          </Flex>
          <Flex justify="center" mb={8}>
            <Select
              value={selectedRepo}
              onChange={(e) => setSelectedRepo(e.target.value)}
              width="200px"
            >
              <option value="EIPs">EIPs</option>
              <option value="ERCs">ERCs</option>
            </Select>
          </Flex>
        </Box>
        <Box>{renderChart()}</Box>
  
        <Flex justify="center" mb={8}>
          <Checkbox
            isChecked={showCategory.created}
            onChange={() => setShowCategory((prev) => ({ ...prev, created: !prev.created }))}
            mr={4}
          >
            Show Created PRs/Issues
          </Checkbox>
          <Checkbox
            isChecked={showCategory.closed}
            onChange={() => setShowCategory((prev) => ({ ...prev, closed: !prev.closed }))}
            mr={4}
          >
            Show Closed PRs/Issues
          </Checkbox>
          {activeTab === 'PRs' && (
            <Checkbox
              isChecked={showCategory.merged}
              onChange={() => setShowCategory((prev) => ({ ...prev, merged: !prev.merged }))}
              mr={4}
            >
              Show Merged PRs
            </Checkbox>
          )}
        </Flex>
  
        <Box>
          {/* View More Button */}
          <Flex justify="center" mb={8}>
            <Button colorScheme="blue" onClick={toggleDropdown}>
              {showDropdown ? 'Hide' : 'View More'}
            </Button>
          </Flex>
  
          {/* Dropdowns for Year and Month Selection */}
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
                          setSelectedYear(year.toString());
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
              </HStack>
            </Box>
          )}
        </Box>
  
        {selectedYear && selectedMonth && (
          <Box mt={8}>
            {renderTable(selectedYear, selectedMonth, activeTab)}
          </Box>
        )}
      </AllLayout>
    )
  );  
};

export default GitHubPRTracker;

