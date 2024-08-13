import React, { useState, useRef } from "react";
import Chart from "chart.js/auto";
import DateTime from "@/components/DateTime";
import {
  Box,
  Button,
  Flex,
  Input,
  Spinner,
  Heading,
  List,
  ListItem,
  Link,
} from "@chakra-ui/react";
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
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [prs, setPrs] = useState<{ [key: string]: { created: PR[], closed: PR[] } }>({});
  const chartRefs = useRef<{ [key: string]: HTMLCanvasElement | null }>({});

  const fetchAllPRs = async (repo: string, dateType: string, startDate: string, endDate: string): Promise<PR[]> => {
    let allPRs: PR[] = [];
    let page = 1;
    let perPage = 100;
    let query = `repo:${repo} is:pr ${dateType}:${startDate}..${endDate}`;
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
        console.error(`Error fetching PRs for ${repo}:`, errorData);
        throw new Error(`GitHub API returned status ${response.status}`);
      }

      const data = await response.json();
      allPRs = allPRs.concat(data.items || []);

      if (data.items.length < perPage) {
        break;
      }

      page++;
    }

    return allPRs;
  };

  const fetchPRs = async () => {
    if (!startDate || !endDate) {
      alert('Please select both start and end dates.');
      return;
    }

    setLoading(true);

    const newPrs: { [key: string]: { created: PR[], closed: PR[] } } = {};
    
    for (const { name, repo } of REPOS) {
      try {
        const createdPRs = await fetchAllPRs(repo, 'created', startDate, endDate);
        const closedPRs = await fetchAllPRs(repo, 'closed', startDate, endDate);

        newPrs[name] = { created: createdPRs, closed: closedPRs };
      } catch (error) {
        console.error(`Failed to fetch PRs for ${repo}:`, error);
        alert(`Failed to fetch PRs for ${repo}. Please check the console for details.`);
      }
    }

    setPrs(newPrs);
    setLoading(false);

    for (const { name } of REPOS) {
      updateChart(name, newPrs[name]?.created.length || 0, newPrs[name]?.closed.length || 0);
      updateUI(name, 'created', newPrs[name]?.created || []);
      updateUI(name, 'closed', newPrs[name]?.closed || []);
    }
  };

  const updateChart = (repoName: string, createdCount: number, closedCount: number) => {
    const ctx = chartRefs.current[repoName]?.getContext('2d');
    if (ctx) {
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Created', 'Closed'],
          datasets: [{
            label: `${repoName} PRs`,
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

  const updateUI = (repoName: string, type: string, prs: PR[]) => {
    const countElement = document.getElementById(`${repoName}-${type}-count`);
    const listElement = document.getElementById(`${repoName}-${type}-list`);

    if (countElement) {
      countElement.textContent = `(${prs.length})`;
    }

    if (listElement) {
      listElement.innerHTML = '';

      prs.forEach(pr => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `<a href="${pr.html_url}" target="_blank">#${pr.number} - ${pr.title}</a>`;
        listElement.appendChild(listItem);
      });
    }
  };
  return (
    <AllLayout>
      <Box paddingLeft={20} paddingRight={20} marginTop={20} marginBottom={10}>
  <Heading
    size="xl"
    marginTop={30}
    marginBottom={10}
    textAlign="center"
    style={{
      color: '#42a5f5', // Color matching the heading in the image
      fontSize: '2.5rem', // Adjust size if necessary to match the image
      fontWeight: 'bold' // Assuming bold weight based on the image
    }}
  >
    EIPs and ERCs Open & Closed PRs
  </Heading>
  <Heading as="label" htmlFor="monthFilter" size="md">
  How to Use:
</Heading>
<ol>
  <li>Filter by date to get the open and closed PRs for EIPs and ERCs.</li>
</ol>
</Box>
      <Box minHeight="100vh" padding={20}>
  <Flex gap={4} direction="row" alignItems="center">
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
    <Button onClick={fetchPRs} disabled={loading}>
      {loading ? <Spinner size="sm" /> : 'Fetch PRs'}
    </Button>
  </Flex>
  {/* {loading && <Spinner size="sm" />} */}
  <Flex direction="column" mt={8}>
    <Flex gap={4} direction="row" mb={8}>
      {REPOS.map(({ name }) => (
        <Box key={name} flex="1">
          <Heading size="md" textTransform="uppercase" marginBottom={4}>
            {name} PRs
          </Heading>
          <Heading size="md" textTransform="uppercase" marginBottom={4}>
            
          </Heading>
          <canvas ref={(el) => (chartRefs.current[name] = el)} id={`${name}-chart`} />
          <Box>
            <DateTime />
          </Box>
        </Box>
      ))}
    </Flex>
    <Flex gap={4} direction="row">
      {REPOS.map(({ name }) => (
        <Box key={name} flex="1">
          <Box>
            <Heading size="sm">Created PRs <span id={`${name}-created-count`}></span></Heading>
            <List id={`${name}-created-list`}></List>
          </Box>
          <Box mt={4}>
            <Heading size="sm">Closed PRs <span id={`${name}-closed-count`}></span></Heading>
            <List id={`${name}-closed-list`}></List>
          </Box>
        </Box>
      ))}
    </Flex>
  </Flex>
</Box>

    </AllLayout>
  );
};

export default GitHubPRTracker;
