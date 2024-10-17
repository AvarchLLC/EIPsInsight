import React, { useEffect, useState } from 'react';
import { Table, Thead, Tbody, Tr, Th, Td } from '@chakra-ui/react';
import { usePathname } from "next/navigation";

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

const PR_API_ENDPOINTS = ['/api/eipsprdetails', '/api/ercsprdetails', '/api/ripsprdetails'];
const ISSUE_API_ENDPOINTS = ['/api/eipsissuedetails', '/api/ercsissuedetails', '/api/ripsissuedetails'];

export default function InsightStats() {
  let year = "";
  let month = "";
  const path = usePathname();
  if (path) {
    const pathParts = path.split("/");
    year = pathParts[2];
    month = pathParts[3];
  }

  const key = `${year}-${month}`; // Combine year and month for the key

  const [prData, setPrData] = useState({
    EIPs: { open: 0, created: 0, closed: 0, merged: 0 },
    ERCs: { open: 0, created: 0, closed: 0, merged: 0 },
    RIPs: { open: 0, created: 0, closed: 0, merged: 0 },
  });
  const [issueData, setIssueData] = useState({
    EIPs: { open: 0, created: 0, closed: 0 },
    ERCs: { open: 0, created: 0, closed: 0 },
    RIPs: { open: 0, created: 0, closed: 0 },
  });

  useEffect(() => {
    fetchPRData();
    fetchIssueData();
  }, [key]);

  const fetchPRData = async () => {
    try {
        const prResults = await Promise.all(
            PR_API_ENDPOINTS.map(endpoint => fetch(endpoint).then(res => res.json()))
          ) as PR[][]; // Define as PR[][] to allow for any number of returned arrays
    
          const [eipsPRs, ercsPRs, ripsPRs] = prResults;

      const transformedEipsData = transformPRData(eipsPRs, key);
      const transformedErcsData = transformPRData(ercsPRs, key);
      const transformedRipsData = transformPRData(ripsPRs, key);

      setPrData({
        EIPs: {
          open: transformedEipsData.PRs.open.length,
          created: transformedEipsData.PRs.created.length,
          closed: transformedEipsData.PRs.closed.length,
          merged: transformedEipsData.PRs.merged.length,
        },
        ERCs: {
          open: transformedErcsData.PRs.open.length,
          created: transformedErcsData.PRs.created.length,
          closed: transformedErcsData.PRs.closed.length,
          merged: transformedErcsData.PRs.merged.length,
        },
        RIPs: {
          open: transformedRipsData.PRs.open.length,
          created: transformedRipsData.PRs.created.length,
          closed: transformedRipsData.PRs.closed.length,
          merged: transformedRipsData.PRs.merged.length,
        },
      });
    } catch (error) {
      console.error('Error fetching PR data:', error);
    }
  };

  const fetchIssueData = async () => {
    try {
        const issueResults = await Promise.all(
            ISSUE_API_ENDPOINTS.map(endpoint => fetch(endpoint).then(res => res.json()))
          ) as Issue[][]; // Define as Issue[][] to allow for any number of returned arrays
    
      const [eipsIssues, ercsIssues, ripsIssues] = issueResults;
      const transformedEipsIssue = transformIssueData(eipsIssues, key);
      const transformedErcsIssue = transformIssueData(ercsIssues, key);
      const transformedRipsIssue = transformIssueData(ripsIssues, key);

      setIssueData({
        EIPs: {
          open: transformedEipsIssue.Issues.open.length,
          created: transformedEipsIssue.Issues.created.length,
          closed: transformedEipsIssue.Issues.closed.length,
        },
        ERCs: {
          open: transformedErcsIssue.Issues.open.length,
          created: transformedErcsIssue.Issues.created.length,
          closed: transformedErcsIssue.Issues.closed.length,
        },
        RIPs: {
          open: transformedRipsIssue.Issues.open.length,
          created: transformedRipsIssue.Issues.created.length,
          closed: transformedRipsIssue.Issues.closed.length,
        },
      });
    } catch (error) {
      console.error('Error fetching issue data:', error);
    }
  };

  const transformPRData = (data: PR[], key: string) => {
    const monthYearData = { PRs: { created: [] as PR[], closed: [] as PR[], merged: [] as PR[], open: [] as PR[] } };

    data.forEach(pr => {
      const createdDate = pr.created_at ? new Date(pr.created_at) : null;
      const closedDate = pr.closed_at ? new Date(pr.closed_at) : null;
      const mergedDate = pr.merged_at ? new Date(pr.merged_at) : null;
      const createdKey = createdDate ? `${createdDate.getUTCFullYear()}-${String(createdDate.getUTCMonth() + 1).padStart(2, '0')}` : '';
      const closedKey = closedDate ? `${closedDate.getUTCFullYear()}-${String(closedDate.getUTCMonth() + 1).padStart(2, '0')}` : '';
      const mergedKey = mergedDate ? `${mergedDate.getUTCFullYear()}-${String(mergedDate.getUTCMonth() + 1).padStart(2, '0')}` : '';

      if (createdKey === key) monthYearData.PRs.created.push(pr);
      if (closedKey === key) monthYearData.PRs.closed.push(pr);
      if (mergedKey === key) monthYearData.PRs.merged.push(pr);
    });

    return monthYearData;
  };

  const transformIssueData = (data: Issue[], key: string) => {
    const monthYearData = { Issues: { created: [] as Issue[], closed: [] as Issue[], open: [] as Issue[] } };

    data.forEach(issue => {
      const createdDate = new Date(issue.created_at);
      const closedDate = issue.closed_at ? new Date(issue.closed_at) : null;
      const createdKey = `${createdDate.getUTCFullYear()}-${String(createdDate.getUTCMonth() + 1).padStart(2, '0')}`;
      const closedKey = closedDate ? `${closedDate.getUTCFullYear()}-${String(closedDate.getUTCMonth() + 1).padStart(2, '0')}` : '';

      if (createdKey === key) monthYearData.Issues.created.push(issue);
      if (closedKey === key) monthYearData.Issues.closed.push(issue);

      // Add open issues logic as required based on your criteria
    });

    return monthYearData;
  };

  return (
    <Table variant="striped" colorScheme="blue" size="lg">
      <Thead>
        <Tr>
          <Th>Category</Th>
          <Th>Open</Th>
          <Th>Created</Th>
          <Th>Closed</Th>
          <Th>Merged</Th>
        </Tr>
      </Thead>
      <Tbody>
        <Tr>
          <Td>EIPs</Td>
          <Td>{prData.EIPs.open}</Td>
          <Td>{prData.EIPs.created}</Td>
          <Td>{prData.EIPs.closed}</Td>
          <Td>{prData.EIPs.merged}</Td>
        </Tr>
        <Tr>
          <Td>ERCs</Td>
          <Td>{prData.ERCs.open}</Td>
          <Td>{prData.ERCs.created}</Td>
          <Td>{prData.ERCs.closed}</Td>
          <Td>{prData.ERCs.merged}</Td>
        </Tr>
        <Tr>
          <Td>RIPs</Td>
          <Td>{prData.RIPs.open}</Td>
          <Td>{prData.RIPs.created}</Td>
          <Td>{prData.RIPs.closed}</Td>
          <Td>{prData.RIPs.merged}</Td>
        </Tr>
      </Tbody>
    </Table>
  );
}
