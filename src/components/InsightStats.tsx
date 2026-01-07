import React, { useEffect, useState } from 'react';
import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  useColorModeValue,
  Text,
} from "@chakra-ui/react";
import { usePathname } from "next/navigation";

type InsightStatCounts = {
  open: number;
  created: number;
  closed: number;
  merged: number;
};

type InsightStatsPayload = {
  key: string;
  prs: Record<string, Record<string, InsightStatCounts>>;
  issues: Record<string, Record<string, InsightStatCounts>>;
};

export default function InsightStats() {
  const bg = useColorModeValue("#f6f6f7", "#171923");
  let year = "";
  let month = "";
  const path = usePathname();
  if (path) {
    const pathParts = path.split("/");
    year = pathParts[2];
    month = pathParts[3];
  }

  const formattedMonth = month ? month.padStart(2, "0") : "";
  const key = year && formattedMonth ? `${year}-${formattedMonth}` : "";

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
    if (!key) {
      return;
    }
    fetchInsightStats();
  }, [key]);

  const fetchInsightStats = async () => {
    try {
      const response = await fetch(`/api/insight-stats?year=${year}&month=${formattedMonth}`);
      const payload = (await response.json()) as InsightStatsPayload;
      const currentKey = payload.key ?? key;
      const prStats = {
        EIPs: payload.prs?.EIPs?.[currentKey],
        ERCs: payload.prs?.ERCs?.[currentKey],
        RIPs: payload.prs?.RIPs?.[currentKey],
      };
      const issueStats = {
        EIPs: payload.issues?.EIPs?.[currentKey],
        ERCs: payload.issues?.ERCs?.[currentKey],
        RIPs: payload.issues?.RIPs?.[currentKey],
      };

      setPrData({
        EIPs: {
          open: prStats.EIPs?.open ?? 0,
          created: prStats.EIPs?.created ?? 0,
          closed: prStats.EIPs?.closed ?? 0,
          merged: prStats.EIPs?.merged ?? 0,
        },
        ERCs: {
          open: prStats.ERCs?.open ?? 0,
          created: prStats.ERCs?.created ?? 0,
          closed: prStats.ERCs?.closed ?? 0,
          merged: prStats.ERCs?.merged ?? 0,
        },
        RIPs: {
          open: prStats.RIPs?.open ?? 0,
          created: prStats.RIPs?.created ?? 0,
          closed: prStats.RIPs?.closed ?? 0,
          merged: prStats.RIPs?.merged ?? 0,
        },
      });

      setIssueData({
        EIPs: {
          open: issueStats.EIPs?.open ?? 0,
          created: issueStats.EIPs?.created ?? 0,
          closed: issueStats.EIPs?.closed ?? 0,
        },
        ERCs: {
          open: issueStats.ERCs?.open ?? 0,
          created: issueStats.ERCs?.created ?? 0,
          closed: issueStats.ERCs?.closed ?? 0,
        },
        RIPs: {
          open: issueStats.RIPs?.open ?? 0,
          created: issueStats.RIPs?.created ?? 0,
          closed: issueStats.RIPs?.closed ?? 0,
        },
      });
    } catch (error) {
      console.error('Error fetching insight stats:', error);
    }
  };

  return (
    <>
    <TableContainer bg={bg} padding={4} rounded={"xl"} marginTop={8}>
  <Table variant="simple" size="md" bg={bg} padding={8}>
    <TableCaption>eipsinsight.com</TableCaption>
    <Thead>
      <Tr>
        <Th>Status</Th>
        <Th>EIPs</Th>
        <Th>ERCs</Th>
        <Th>RIPs</Th>
      </Tr>
    </Thead>
    <Tbody>
      <Tr>
        <Td>Created PRs</Td>
        <Td>{prData.EIPs.created}</Td>
        <Td>{prData.ERCs.created}</Td>
        <Td>{prData.RIPs.created}</Td>
      </Tr>
      <Tr>
        <Td>Open PRs</Td>
        <Td>{prData.EIPs.open}</Td>
        <Td>{prData.ERCs.open}</Td>
        <Td>{prData.RIPs.open}</Td>
      </Tr>
      <Tr>
        <Td>Closed PRs</Td>
        <Td>{prData.EIPs.closed}</Td>
        <Td>{prData.ERCs.closed}</Td>
        <Td>{prData.RIPs.closed}</Td>
      </Tr>
      <Tr>
        <Td>Merged PRs</Td>
        <Td>{prData.EIPs.merged}</Td>
        <Td>{prData.ERCs.merged}</Td>
        <Td>{prData.RIPs.merged}</Td>
      </Tr>
      <Tr>
        <Td>Created Issues</Td>
        <Td>{issueData.EIPs.created}</Td>
        <Td>{issueData.ERCs.created}</Td>
        <Td>{issueData.RIPs.created}</Td>
      </Tr>
      <Tr>
        <Td>Open Issues</Td>
        <Td>{issueData.EIPs.open}</Td>
        <Td>{issueData.ERCs.open}</Td>
        <Td>{issueData.RIPs.open}</Td>
      </Tr>
      <Tr>
        <Td>Closed Issues</Td>
        <Td>{issueData.EIPs.closed}</Td>
        <Td>{issueData.ERCs.closed}</Td>
        <Td>{issueData.RIPs.closed}</Td>
      </Tr>
    </Tbody>
  </Table>
</TableContainer>
 </>
  );
}
