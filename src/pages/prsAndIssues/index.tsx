import React, { useEffect, useState } from "react";
import {
  Select,
  Heading,
  Box,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
} from "@chakra-ui/react";
import AllLayout from "@/components/Layout";

const token = process.env.NEXT_PUBLIC_ACCESS_TOKEN;
const REPO_OWNER = "ethereum";
const REPO_NAME = "EIPs";

const headers = {
  Authorization: `token ${token}`,
  Accept: "application/vnd.github.v3+json",
};

const fetchGitHubData = async (endpoint: string) => {
  const response = await fetch(
    `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/${endpoint}`,
    {
      headers,
    }
  );
  if (!response.ok) {
    throw new Error(`Error fetching ${endpoint}: ${response.statusText}`);
  }
  return response.json();
};

type User = {
  login: string;
  avatar_url: string;
  html_url: string;
};

type PR = {
  number: number;
  title: string;
  user: User;
  merged_at: string;
  closed_at: string;
  html_url: string;
};

type Issue = {
  number: number;
  title: string;
  user: User;
  closed_at: string;
  html_url: string;
};

const getPRsAndIssues = async () => {
  const prs = await fetchGitHubData(
    `pulls?state=closed&per_page=100&sort=updated&direction=desc`
  );
  const issues = await fetchGitHubData(
    `issues?state=closed&per_page=100&sort=updated&direction=desc&filter=all&labels=bug`
  );

  return { prData: prs, issueData: issues };
};

const PRsAndIssues = () => {
  const [prData, setPrData] = useState<PR[]>([]);
  const [issueData, setIssueData] = useState<Issue[]>([]);
  const [filterMonth, setFilterMonth] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { prData, issueData } = await getPRsAndIssues();
        setPrData(prData);
        setIssueData(issueData);
      } catch (error) {
        console.error("Error updating data:", error);
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 24 * 60 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, []);

  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterMonth(event.target.value);
  };

  const filterByMonth = (date: string) => {
    if (!filterMonth) return true;
    const itemDate = new Date(date);
    const [year, month] = filterMonth.split("-");
    return (
      itemDate.getFullYear() === parseInt(year) &&
      itemDate.getMonth() + 1 === parseInt(month)
    );
  };

  const createItem = (item: PR | Issue, type: string) => (
    <Card key={item.number} mb={4}>
      <CardHeader>
        <Heading size="md">{`${type} #${item.number}: ${item.title}`}</Heading>
      </CardHeader>
      <CardBody>
        <p>Author: {item.user.login}</p>
        <p>
          {type === "PR" ? "Merged at" : "Closed at"}:{" "}
          {new Date(item.merged_at || item.closed_at).toLocaleString()}
        </p>
      </CardBody>
      <CardFooter>
        <a href={item.html_url} target="_blank" rel="noopener noreferrer">
          View on GitHub
        </a>
      </CardFooter>
    </Card>
  );

  return (
    <AllLayout>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        gap="24px"
      >
        <div className="container" style={{ margin: "20px 0 20px 0" }}>
          <Heading>EIPs GitHub PRs and Issues</Heading>
          <div className="filter">
            <Heading as="label" htmlFor="monthFilter" size={"md"}>
              Filter by month:{" "}
            </Heading>
            <Select
              id="monthFilter"
              placeholder="Select option"
              onChange={handleFilterChange}
            >
              <option value="">All</option>
              {/* Generate options dynamically */}
              {Array.from({ length: 12 }, (_, i) => {
                const now = new Date();
                const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
                const year = date.getFullYear();
                const month = (date.getMonth() + 1).toString().padStart(2, "0");
                return (
                  <option key={i} value={`${year}-${month}`}>
                    {`${year}-${month}`}
                  </option>
                );
              })}
            </Select>
          </div>
          <div id="content">
            {prData
              .filter((pr) => filterByMonth(pr.merged_at))
              .map((pr) => createItem(pr, "PR"))}
            {issueData
              .filter((issue) => filterByMonth(issue.closed_at))
              .map((issue) => createItem(issue, "Issue"))}
          </div>
        </div>
      </Box>
    </AllLayout>
  );
};

export default PRsAndIssues;
