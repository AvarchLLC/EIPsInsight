import React, { useState, useRef, useEffect } from "react";
import Chart from "chart.js/auto";
import {
  Box,
  Button,
  Flex,
  Input,
  Spinner,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Link,
  Collapse,
  Icon,
} from "@chakra-ui/react";
import { ChevronDownIcon, ChevronRightIcon } from "@chakra-ui/icons";
import AllLayout from "@/components/Layout";

const GITHUB_API_URL = 'https://api.github.com/search/issues';
const REPOS = [
  { name: 'EIPs', repo: 'ethereum/EIPs' },
  { name: 'ERCs', repo: 'ethereum/ERCs' }
];

const GITHUB_API_KEY = process.env.NEXT_PUBLIC_ACCESS_TOKEN;

type PR = {
  number: number;
  title: string;
  html_url: string;
};

const GitHubPRTracker: React.FC = () => {
  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().slice(0, 10);
  
  const [startDate, setStartDate] = useState<string>(firstDayOfMonth);
  const [endDate, setEndDate] = useState<string>(today.toISOString().slice(0, 10));
  const [loading, setLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'PRs' | 'Issues'>('PRs');
  const [showDropdown, setShowDropdown] = useState<{ [key: string]: { created: boolean, closed: boolean } }>({});
  const [data, setData] = useState<{ [key: string]: { created: PR[], closed: PR[] } }>({});
  const chartRefs = useRef<{ [key: string]: HTMLCanvasElement | null }>({});
  const chartInstances = useRef<{ [key: string]: Chart | undefined }>({}); // Track chart instances

  useEffect(() => {
    fetchData(); // Fetch data on component mount
  }, []);

  const fetchAllData = async (repo: string, dateType: string, startDate: string, endDate: string): Promise<PR[]> => {
    let allData: PR[] = [];
    let page = 1;
    const perPage = 100;
    let query = `repo:${repo} is:${activeTab.toLowerCase().slice(0, -1)} ${dateType}:${startDate}..${endDate}`;
    if (dateType === 'closed') {
      query += ' is:closed';
    }

    while (true) {
      const response = await fetch(`${GITHUB_API_URL}?q=${encodeURIComponent(query)}&page=${page}&per_page=${perPage}`, {
        headers: {
          'Authorization': `token ${GITHUB_API_KEY}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error(`Error fetching ${activeTab} for ${repo}:`, errorData);
        throw new Error(`GitHub API returned status ${response.status}`);
      }

      const data = await response.json();
      allData = allData.concat(data.items || []);
      console.log(allData.length);

      if (data.items.length < perPage) {
        break;
      }

      page++;
    }

    return allData;
  };

  const fetchData = async () => {
    if (!startDate || !endDate) {
      alert('Please select both start and end dates.');
      return;
    }

    setLoading(true);

    const newData: { [key: string]: { created: PR[], closed: PR[] } } = {};

    for (const { name, repo } of REPOS) {
      try {
        const createdData = await fetchAllData(repo, 'created', startDate, endDate);
        const closedData = await fetchAllData(repo, 'closed', startDate, endDate);

        newData[name] = { created: createdData, closed: closedData };
      } catch (error) {
        console.error(`Failed to fetch ${activeTab} for ${repo}:`, error);
        alert(`Failed to fetch ${activeTab} for ${repo}. Please check the console for details.`);
      }
    }

    setData(newData);
    setLoading(false);

    for (const { name } of REPOS) {
      updateChart(name, newData[name]?.created.length || 0, newData[name]?.closed.length || 0);
    }
  };

  const updateChart = (repoName: string, createdCount: number, closedCount: number) => {
    const ctx = chartRefs.current[repoName]?.getContext('2d');
    if (ctx) {
      // Destroy the existing chart instance before creating a new one
      if (chartInstances.current[repoName]) {
        chartInstances.current[repoName]?.destroy();
      }

      chartInstances.current[repoName] = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Created', 'Closed'],
          datasets: [{
            label: `${repoName} ${activeTab}`,
            data: [createdCount, closedCount],
            backgroundColor: ['#36a2eb', '#ff6384']
          }]
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    }
  };

  const toggleDropdown = (repoName: string, section: 'created' | 'closed') => {
    setShowDropdown((prevState) => ({
      ...prevState,
      [repoName]: {
        created: section === 'created' ? !prevState[repoName]?.created : false,
        closed: section === 'closed' ? !prevState[repoName]?.closed : false,
      },
    }));
  };
  

  const renderTable = (repoName: string, section: 'created' | 'closed') => (
    <Table variant="striped" colorScheme="teal">
      <Thead>
        <Tr>
          <Th>#</Th>
          <Th>PR Number</Th>
          <Th>Title</Th>
        </Tr>
      </Thead>
      <Tbody>
        {data[repoName]?.[section]?.map((item, index) => (
          <Tr key={item.number}>
            <Td>{index + 1}</Td>
            <Td>
              <Link href={item.html_url} target="_blank">
                #{item.number}
              </Link>
            </Td>
            <Td>{item.title}</Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );

  return (
   < AllLayout>
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
        <Flex gap={4} align="center">
          <Input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <Input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
          <Button onClick={fetchData} disabled={loading}>
            {loading ? <Spinner size="sm" /> : `Fetch ${activeTab}`}
          </Button>
        </Flex>

        <Box mt={8} textAlign="center">
          {/* First Graph */}
          <Box display="flex" justifyContent="center" mt={8}>
            <Box width="50%">
              <canvas ref={(el) => (chartRefs.current['EIPs'] = el)} />
            </Box>
          </Box>

          <Flex justify="space-between" mt={4}>
            <Heading size="md">Created PRs: {data['EIPs']?.created.length || 0}</Heading>
            <Heading size="md">Closed PRs: {data['EIPs']?.closed.length || 0}</Heading>
          </Flex>
          <Flex justify="space-between" mt={4}>
            <Button onClick={() => toggleDropdown('EIPs', 'created')}>
              {showDropdown['EIPs']?.created ? <Icon as={ChevronDownIcon} /> : <Icon as={ChevronRightIcon} />}
              Show Created PRs
            </Button>
            <Button onClick={() => toggleDropdown('EIPs', 'closed')}>
              {showDropdown['EIPs']?.closed ? <Icon as={ChevronDownIcon} /> : <Icon as={ChevronRightIcon} />}
              Show Closed PRs
            </Button>
          </Flex>
          <Collapse in={showDropdown['EIPs']?.created}>{renderTable('EIPs', 'created')}</Collapse>
          <Collapse in={showDropdown['EIPs']?.closed}>{renderTable('EIPs', 'closed')}</Collapse>

          {/* Second Graph */}
          <Box display="flex" justifyContent="center" mt={8}>
            <Box width="50%">
              <canvas ref={(el) => (chartRefs.current['ERCs'] = el)} />
            </Box>
          </Box>

          <Flex justify="space-between" mt={4}>
            <Heading size="md">Created PRs: {data['ERCs']?.created.length || 0}</Heading>
            <Heading size="md">Closed PRs: {data['ERCs']?.closed.length || 0}</Heading>
          </Flex>
          <Flex justify="space-between" mt={4}>
            <Button onClick={() => toggleDropdown('ERCs', 'created')}>
              {showDropdown['ERCs']?.created ? <Icon as={ChevronDownIcon} /> : <Icon as={ChevronRightIcon} />}
              Show Created PRs
            </Button>
            <Button onClick={() => toggleDropdown('ERCs', 'closed')}>
              {showDropdown['ERCs']?.closed ? <Icon as={ChevronDownIcon} /> : <Icon as={ChevronRightIcon} />}
              Show Closed PRs
            </Button>
          </Flex>
          <Collapse in={showDropdown['ERCs']?.created}>{renderTable('ERCs', 'created')}</Collapse>
          <Collapse in={showDropdown['ERCs']?.closed}>{renderTable('ERCs', 'closed')}</Collapse>
        </Box>
      </Box>
    </AllLayout>
  );
};

export default GitHubPRTracker;
