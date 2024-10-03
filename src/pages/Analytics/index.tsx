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
  Text,
  useDisclosure,
  IconButton,
  HStack,
  useColorModeValue
} from "@chakra-ui/react";
import LoaderComponent from "@/components/Loader";
import AllLayout from "@/components/Layout";


// Dynamic import for Ant Design's Column chart
// const Column = dynamic(() => import("@ant-design/plots").then(mod => mod.Column), { ssr: false });
const DualAxes = dynamic(() => import("@ant-design/plots").then(mod => mod.DualAxes), { ssr: false });

const PR_API_ENDPOINTS = ['/api/eipsprdetails', '/api/ercsprdetails','/api/ripsprdetails'];
const ISSUE_API_ENDPOINTS = ['/api/eipsissuedetails', '/api/ercsissuedetails', '/api/ripsissuedetails'];
const API_ENDPOINTS = {
  eips: '/api/editorsprseips',
  ercs: '/api/editorsprsercs',
  rips: '/api/editorsprsrips'
}

type PR = {
  prNumber: number;
  prTitle: string;
  created_at: Date;
  closed_at: Date | null;
  merged_at: Date | null;
  reviewDate: Date | null;
};

interface ReviewerData {
  [reviewer: string]: PR[];
}


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
    PRs: { [key: string]: { created: PR[], closed: PR[], merged: PR[], open:PR[], review:PR[] } };
    Issues: { [key: string]: { created: Issue[], closed: Issue[], open: Issue[] } };
  }>({ PRs: {}, Issues: {} });

  // const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [showCategory, setShowCategory] = useState<{ [key: string]: boolean }>({
    created: true,
    closed: true,
    merged: true,
    open:true,
    review:true
  });

  useEffect(() => {
    fetchData();
  }, [activeTab, selectedRepo]);

  const fetchPRData = async () => {
    try {
      const [eipsData, ercsData,ripsData] = await Promise.all(
        PR_API_ENDPOINTS.map(endpoint => fetch(endpoint).then(res => res.json()))
      );

      // Fetch data from all three repositories: EIPs, ERCs, RIPs
      const [eipsRes, ercsRes, ripsRes] = await Promise.all([
        fetch(API_ENDPOINTS.eips),
        fetch(API_ENDPOINTS.ercs),
        fetch(API_ENDPOINTS.rips), // Add the RIPs fetch here
      ]);

      const eipsReviewData = await eipsRes.json();
      const ercsReviewData = await ercsRes.json();
      const ripsReviewData = await ripsRes.json(); // Parse RIPs response

      // Determine which data to use based on selectedRepo
      let selectedData;
      let selectedReviewData;
      if (selectedRepo === 'EIPs') {
        selectedData = eipsData;
        selectedReviewData = eipsReviewData;
      } else if (selectedRepo === 'ERCs') {
        selectedData = ercsData;
        selectedReviewData = ercsReviewData;
      } else if (selectedRepo === 'RIPs') {
        selectedData = ripsData; // Assuming ripsData is available
        selectedReviewData = ripsReviewData;
      }

      let combinedReviewData: PR[] = [];

      // Process review data based on the selected repository
      if (selectedRepo === 'EIPs') {
        // Processing for EIPs review data
        Object.values(eipsReviewData as ReviewerData).forEach((reviewerArray: PR[]) => {
          combinedReviewData.push(...reviewerArray);
        });
      } else if (selectedRepo === 'ERCs') {
        // Processing for ERCs review data
        Object.values(ercsReviewData as ReviewerData).forEach((reviewerArray: PR[]) => {
          combinedReviewData.push(...reviewerArray);
        });
      } else if (selectedRepo === 'RIPs') {
        // Processing for RIPs review data
        Object.values(ripsReviewData as ReviewerData).forEach((reviewerArray: PR[]) => {
          combinedReviewData.push(...reviewerArray);
        });
      }

 
      // Transform the PR and review data
      let transformedData = transformPRData(selectedData,combinedReviewData);


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
      const [eipsData, ercsData, ripsData] = await Promise.all(
        ISSUE_API_ENDPOINTS.map(endpoint => fetch(endpoint).then(res => res.json()))
      );

      let selectedData;
    if (selectedRepo === 'EIPs') {
      selectedData = eipsData;
    } else if (selectedRepo === 'ERCs') {
      selectedData = ercsData;
    } else if (selectedRepo === 'RIPs') {
      selectedData = ripsData;
    }

    // Transform the selected data
    const transformedData = transformIssueData(selectedData);
    console.log(transformedData);
      console.log(transformedData);
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

  const transformPRData = (data: PR[], reviewData:PR[]): { [key: string]: { created: PR[], closed: PR[], merged: PR[], open:PR[], review:PR[] } } => {
    const monthYearData: { [key: string]: { created: PR[], closed: PR[], merged: PR[] ,open:[], review:[]} } = {};
    const incrementMonth = (date: Date) => {
      const newDate = new Date(date);
      newDate.setMonth(newDate.getMonth() + 1);
      newDate.setDate(1); // Reset to the first day of the next month
      newDate.setHours(0, 0, 0, 0);
      return newDate;
    };
    const currentDate = new Date();

    const addIfNotExists = (arr: PR[], pr: PR) => {
   
      // Check if the PR has a closing date, and if it is in the current month and year
      const isClosedThisMonth = pr.closed_at &&
        new Date(pr.closed_at).getFullYear() === currentDate.getFullYear() &&
        new Date(pr.closed_at).getMonth() === currentDate.getMonth();
        if (!isClosedThisMonth && !arr.some(existingPr => existingPr.prNumber === pr.prNumber)) {
          arr.push(pr);
        }
    };
    const addReview= (arr: PR[], pr: PR) => {
      if (!arr.some(existingPr => existingPr.prNumber === pr.prNumber)) {
        arr.push(pr);
      }
    };

  

    data.forEach(pr => {

      
      const createdDate = pr.created_at ? new Date(pr.created_at) : null;
      const closedDate = pr.closed_at ? new Date(pr.closed_at) : null;
      const mergedDate = pr.merged_at ? new Date(pr.merged_at) : null;

      if (createdDate) {
        const key = `${createdDate.getFullYear()}-${String(createdDate.getMonth() + 1).padStart(2, '0')}`;
        if (!monthYearData[key]) monthYearData[key] = { created: [], closed: [], merged: [], open:[], review:[] };
        // monthYearData[key].created.push(pr);
        addReview(monthYearData[key].created, pr);
      }

      if (closedDate && !mergedDate) {
        const key = `${closedDate.getFullYear()}-${String(closedDate.getMonth() + 1).padStart(2, '0')}`;
        if (!monthYearData[key]) monthYearData[key] = { created: [], closed: [], merged: [], open:[], review:[] };
        // monthYearData[key].closed.push(pr);
        addReview(monthYearData[key].closed, pr);
      }

      if (mergedDate) {
        const key = `${mergedDate.getFullYear()}-${String(mergedDate.getMonth() + 1).padStart(2, '0')}`;
        if (!monthYearData[key]) monthYearData[key] = { created: [], closed: [], merged: [], open:[], review:[] };
        // monthYearData[key].merged.push(pr);
        addReview(monthYearData[key].merged, pr);
      }

      if (createdDate) {
        let openDate = new Date(createdDate); // Start from the creation date
        let endDate = closedDate ? new Date(closedDate) : currentDate; // End at the close date or current date
 
        // Exclude from "open" in the month it was closed
        if (closedDate && openDate.toISOString().slice(0, 7) === closedDate.toISOString().slice(0, 7)) {
          return; // Skip further processing for PRs closed in the same month
        }
 
        while (openDate <= endDate) {
          const openKey = `${openDate.getFullYear()}-${String(openDate.getMonth() + 1).padStart(2, '0')}`;
          if(pr.prNumber==8914){
            console.log("open key for 8914:",openKey)
            console.log(openDate)
            console.log("end date:",endDate)
          }
          if (!monthYearData[openKey]) monthYearData[openKey] = { created: [], closed: [], merged: [], open: [], review:[]};
 
          // Add to "open" if not yet closed, avoiding duplicates
          addIfNotExists(monthYearData[openKey].open, pr);
 
          // Increment month
          openDate = incrementMonth(openDate);
          if(pr.prNumber==8914){
            console.log(openDate)
          }
        }
      }
    });
    reviewData.forEach(pr=>{
      const reviewDate = pr.reviewDate ? new Date(pr.reviewDate) : null;
 
      if (reviewDate) {
        const reviewKey = `${reviewDate.getFullYear()}-${String(reviewDate.getMonth() + 1).padStart(2, '0')}`;
        if (!monthYearData[reviewKey]) monthYearData[reviewKey] = { created: [], closed: [], merged: [], open: [], review:[] };
        addReview(monthYearData[reviewKey].review, pr);
      }
    });
 
    return monthYearData;
  };

  const transformIssueData = (data: Issue[]): { [key: string]: { created: Issue[], closed: Issue[], open:Issue[] } } => {
    const monthYearData: { [key: string]: { created: Issue[], closed: Issue[], open:Issue[] } } = {};
    
    const incrementMonth = (date: Date) => {
      const newDate = new Date(date);
      newDate.setMonth(newDate.getMonth() + 1);
      newDate.setDate(1); // Reset to the first day of the next month
      newDate.setHours(0, 0, 0, 0);
      return newDate;
    };
    const currentDate = new Date();

    const addIfNotExists = (arr: Issue[], pr: Issue) => {
   
      // Check if the PR has a closing date, and if it is in the current month and year
      const isClosedThisMonth = pr.closed_at &&
        new Date(pr.closed_at).getFullYear() === currentDate.getFullYear() &&
        new Date(pr.closed_at).getMonth() === currentDate.getMonth();
        if (!isClosedThisMonth && !arr.some(existingPr => existingPr.IssueNumber === pr.IssueNumber)) {
          arr.push(pr);
        }
    };

    data.forEach(issue => {
      const createdDate = new Date(issue.created_at);
      const key = `${createdDate.getFullYear()}-${String(createdDate.getMonth() + 1).padStart(2, '0')}`;
      if (!monthYearData[key]) monthYearData[key] = { created: [], closed: [], open:[] };
      monthYearData[key].created.push(issue);

      if (issue.closed_at) {
        const closedDate = new Date(issue.closed_at);
        const closedKey = `${closedDate.getFullYear()}-${String(closedDate.getMonth() + 1).padStart(2, '0')}`;
        if (!monthYearData[closedKey]) monthYearData[closedKey] = { created: [], closed: [], open:[] };
        monthYearData[closedKey].closed.push(issue);
      }

      if (createdDate) {
        let openDate = new Date(createdDate); // Start from the creation date
        let endDate = issue.closed_at ? new Date(issue.closed_at) : currentDate; // End at the close date or current date
    
        // Check if closed_at is a valid date object
        if (issue.closed_at && !isNaN(new Date(issue.closed_at).getTime())) {
            // Exclude from "open" in the month it was closed
            if (openDate.toISOString().slice(0, 7) === new Date(issue.closed_at).toISOString().slice(0, 7)) {
                return; // Skip further processing for PRs closed in the same month
            }
        }
    
        while (openDate <= endDate) {
            const openKey = `${openDate.getFullYear()}-${String(openDate.getMonth() + 1).padStart(2, '0')}`;
            
            if (!monthYearData[openKey]) monthYearData[openKey] = { created: [], closed: [], open: [] };
    
            // Add to "open" if not yet closed, avoiding duplicates
            addIfNotExists(monthYearData[openKey].open, issue);
    
            // Increment month
            openDate = incrementMonth(openDate);
        }
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
    // Data based on type (PRs or Issues)
    const dataToUse = type === 'PRs' ? data.PRs : data.Issues;
    
    // Format the month-year key for data lookup
    const key = `${year}-${String(getMonths().indexOf(month) + 1).padStart(2, '0')}`;
  
    // Default data structure for PRs or Issues
    const items = dataToUse[key] || (type === 'PRs'
      ? { created: [] as PR[], closed: [] as PR[], merged: [] as PR[] }
      : { created: [] as Issue[], closed: [] as Issue[] });
  
    return (
      <Box mt={8} border="1px solid #e2e8f0" borderRadius="10px 10px 0 0" boxShadow="lg">
        <Table variant="striped" colorScheme="blue">
        <Thead bg="#2D3748">
          <Tr>
            <Th color="white" textAlign="center" borderTopLeftRadius="10px">Number</Th>
            <Th color="white" textAlign="center">Title</Th>
            {type === 'PRs' ? (
              <>
                <Th color="white" textAlign="center">State</Th>
                <Th color="white" textAlign="center">Created At</Th>
                <Th color="white" textAlign="center">Closed At</Th>
                <Th color="white" textAlign="center">Merged At</Th>
              </>
            ) : (
              <>
                <Th color="white" textAlign="center">State</Th>
                <Th color="white" textAlign="center">Created At</Th>
                <Th color="white" textAlign="center">Closed At</Th>
              </>
            )}
            <Th color="white" textAlign="center" borderTopRightRadius="10px">Link</Th>
          </Tr>
        </Thead>
        </Table>

        <Box overflowY="auto" maxHeight="400px" borderBottomRadius="0" borderTopWidth="1px" borderTopColor="gray.200">
        <Table variant="striped" colorScheme="blue">
        <Tbody>
        {items.created.length === 0 && items.closed.length === 0 && (type === 'PRs' ? ('merged' in items && items.merged.length === 0) : true) ? (
            <Tr>
              <Td colSpan={type === 'PRs' ? 6 : 5} textAlign="center">No Data Available</Td>
            </Tr>
          ) : (
            <>
              {/* Render Created Items */}
              {showCategory.created && items.created.map((item: PR | Issue) => (
                <Tr key={`created-${type === 'PRs' ? (item as PR).prNumber : (item as Issue).IssueNumber}`}>
                  <Td>{type === 'PRs' ? (item as PR).prNumber : (item as Issue).IssueNumber}</Td>
                  <Td>{type === 'PRs' ? (item as PR).prTitle : (item as Issue).IssueTitle}</Td>
                  <Td>Created</Td>
                  <Td>{item.created_at ? new Date(item.created_at).toLocaleDateString() : '-'}</Td>
                  <Td>{item.closed_at ? new Date(item.closed_at).toLocaleDateString() : '-'}</Td>
                  {type === 'PRs' && <Td>{(item as PR).merged_at ? new Date((item as PR).merged_at!).toLocaleDateString() : '-'}</Td>}
                  <Td><button style={{
                      backgroundColor: '#428bca',
                      color: '#ffffff',
                      border: 'none',
                      padding: '10px 20px',
                      cursor: 'pointer',
                      borderRadius: '5px',
                    }}>
                    <a href={`https://github.com/ethereum/${selectedRepo}/${type === 'PRs' ? 'pull' : 'issues'}/${type === 'PRs' ? (item as PR).prNumber : (item as Issue).IssueNumber}`} target="_blank">
                      {type === 'PRs' ? 'Pull Request' : 'Issue'}
                    </a>
                    </button></Td>
                </Tr>
              ))}
  
              {/* Render Closed Items */}
              {showCategory.closed && items.closed.map((item: PR | Issue) => (
                <Tr key={`closed-${type === 'PRs' ? (item as PR).prNumber : (item as Issue).IssueNumber}`}>
                  <Td>{type === 'PRs' ? (item as PR).prNumber : (item as Issue).IssueNumber}</Td>
                  <Td>{type === 'PRs' ? (item as PR).prTitle : (item as Issue).IssueTitle}</Td>
                  <Td>Closed</Td>
                  <Td>{item.created_at ? new Date(item.created_at).toLocaleDateString() : '-'}</Td>
                  <Td>{item.closed_at ? new Date(item.closed_at).toLocaleDateString() : '-'}</Td>
                  {type === 'PRs' && <Td>{(item as PR).merged_at ? new Date((item as PR).merged_at!).toLocaleDateString() : '-'}</Td>}
                  <Td><button style={{
                      backgroundColor: '#428bca',
                      color: '#ffffff',
                      border: 'none',
                      padding: '10px 20px',
                      cursor: 'pointer',
                      borderRadius: '5px',
                    }}>
                    <a href={`https://github.com/ethereum/${selectedRepo}/${type === 'PRs' ? 'pull' : 'issues'}/${type === 'PRs' ? (item as PR).prNumber : (item as Issue).IssueNumber}`} target="_blank">
                      {type === 'PRs' ? 'Pull Request' : 'Issue'}
                    </a>
                    </button></Td>
                </Tr>
              ))}
  
              {/* Render Merged Items (only for PRs) */}
              {showCategory.merged && type === 'PRs' && (items as { merged: PR[] }).merged.map((item: PR) => (
                <Tr key={`merged-${item.prNumber}`}>
                  <Td>{item.prNumber}</Td>
                  <Td>{item.prTitle}</Td>
                  <Td>Merged</Td>
                  <Td>{item.created_at ? new Date(item.created_at).toLocaleDateString() : '-'}</Td>
                  <Td>{item.closed_at ? new Date(item.closed_at).toLocaleDateString() : '-'}</Td>
                  <Td>{item.merged_at ? new Date(item.merged_at!).toLocaleDateString() : '-'}</Td>
                  
                  <Td><button style={{
                      backgroundColor: '#428bca',
                      color: '#ffffff',
                      border: 'none',
                      padding: '10px 20px',
                      cursor: 'pointer',
                      borderRadius: '5px',
                    }}>
                    <a href={`https://github.com/ethereum/${selectedRepo}/pull/${item.prNumber}`} target="_blank">
                      {type === 'PRs' ? 'Pull Request' : 'Issue'}
                    </a>
                    </button></Td>
                </Tr>
              ))}

{showCategory.open && items.open.map((item: PR | Issue) => (
                <Tr key={`open-${type === 'PRs' ? (item as PR).prNumber : (item as Issue).IssueNumber}`}>
                  <Td>{type === 'PRs' ? (item as PR).prNumber : (item as Issue).IssueNumber}</Td>
                  <Td>{type === 'PRs' ? (item as PR).prTitle : (item as Issue).IssueTitle}</Td>
                  <Td>Open</Td>
                  <Td>{item.created_at ? new Date(item.created_at).toLocaleDateString() : '-'}</Td>
                  <Td>{item.closed_at ? new Date(item.closed_at).toLocaleDateString() : '-'}</Td>
                  {type === 'PRs' && <Td>{(item as PR).merged_at ? new Date((item as PR).merged_at!).toLocaleDateString() : '-'}</Td>}
                  <Td><button style={{
                      backgroundColor: '#428bca',
                      color: '#ffffff',
                      border: 'none',
                      padding: '10px 20px',
                      cursor: 'pointer',
                      borderRadius: '5px',
                    }}>
                    <a href={`https://github.com/ethereum/${selectedRepo}/${type === 'PRs' ? 'pull' : 'issues'}/${type === 'PRs' ? (item as PR).prNumber : (item as Issue).IssueNumber}`} target="_blank">
                      {type === 'PRs' ? 'Pull Request' : 'Issue'}
                    </a>
                    </button></Td>
                </Tr>
              ))}

{showCategory.review && type === 'PRs' && (items as { review: PR[] }).review.map((item: PR) => (
                <Tr key={`open-${item.prNumber}`}>
                  <Td>{item.prNumber}</Td>
                  <Td>{item.prTitle}</Td>
                  <Td>reviewed</Td>
                  <Td>{item.created_at ? new Date(item.created_at).toLocaleDateString() : '-'}</Td>
                  <Td>{item.closed_at ? new Date(item.closed_at).toLocaleDateString() : '-'}</Td>
                  <Td>{item.merged_at ? new Date(item.merged_at!).toLocaleDateString() : '-'}</Td>
                  
                  <Td><button style={{
                      backgroundColor: '#428bca',
                      color: '#ffffff',
                      border: 'none',
                      padding: '10px 20px',
                      cursor: 'pointer',
                      borderRadius: '5px',
                    }}>
                    <a href={`https://github.com/ethereum/${selectedRepo}/pull/${item.prNumber}`} target="_blank">
                      {type === 'PRs' ? 'Pull Request' : 'Issue'}
                    </a>
                    </button></Td>
                </Tr>
              ))}
            </>
          )}
        </Tbody>
        </Table>
        </Box>
      </Box>
    );
  };
  
  
  
  const convertToCSV = (filteredData: any, type: 'PRs' | 'Issues') => {
    const csvRows = [];
  
    const headers = type === 'PRs'
      ? ['Number', 'Title', 'State', 'Created At', 'Closed At', 'Merged At', 'Link']
      : ['Number', 'Title', 'State', 'Created At', 'Closed At', 'Link'];
  
    // Add headers to CSV rows
    csvRows.push(headers.join(','));
  
    // Combine created and closed arrays for PRs and Issues
    const items = type === 'PRs'
      ? [...filteredData.created, ...filteredData.closed, ...filteredData.merged]
      : [...filteredData.created, ...filteredData.closed];
  
    // Add data to CSV rows
    items.forEach((item: PR | Issue) => {
      const row = type === 'PRs'
        ? [
            (item as PR).prNumber,
            (item as PR).prTitle,
            item.closed_at ? 'Closed' : 'Created',
            new Date(item.created_at).toLocaleDateString(),
            item.closed_at ? new Date(item.closed_at).toLocaleDateString() : '-',
            (item as PR).merged_at ? new Date((item as PR).merged_at!).toLocaleDateString() : '-',
            `https://github.com/ethereum/${selectedRepo}/${type === 'PRs' ? 'pull' : 'issues'}/${(item as PR).prNumber}`
          ].join(',')
        : [
            (item as Issue).IssueNumber,
            (item as Issue).IssueTitle,
            item.closed_at ? 'Closed' : 'Created',
            new Date(item.created_at).toLocaleDateString(),
            item.closed_at ? new Date(item.closed_at).toLocaleDateString() : '-',
            `https://github.com/ethereum/${selectedRepo}/issues/${(item as Issue).IssueNumber}`
          ].join(',');
  
      csvRows.push(row);
    });
  
    return csvRows.join('\n');
  };
  
  const handleDownload = () => {
    if (!selectedYear || !selectedMonth) {
      alert('Please select a year and month.');
      return;
    }
  
    const key = `${selectedYear}-${String(getMonths().indexOf(selectedMonth) + 1).padStart(2, '0')}`;
    const filteredData = activeTab === 'PRs' ? data.PRs[key] : data.Issues[key];
  
    if (!filteredData || (filteredData.created.length === 0 && filteredData.closed.length === 0)) {
      alert('No data available for the selected month.');
      return;
    }
  
    // Combine arrays and pass them to the CSV function
    const combinedData = activeTab === 'PRs'
      ? {
          created: filteredData.created,
          closed: filteredData.closed,
          merged: 'merged' in filteredData ? filteredData.merged : [],
        }
      : {
          created: filteredData.created,
          closed: filteredData.closed
        };
  
    downloadCSV(combinedData, activeTab);
  };
  
  
  const downloadCSV = (data: any, type: 'PRs' | 'Issues') => {
    const csv = convertToCSV(data, type);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
  
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `${type}-${selectedYear}-${selectedMonth}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };
  
  

  const renderChart = () => {
    const dataToUse = activeTab === 'PRs' ? data.PRs : data.Issues;

    // Transform data for chart rendering
    const transformedData = Object.keys(dataToUse).flatMap(monthYear => {
        const items = dataToUse[monthYear];
        return [
            ...(showCategory.open ? [{ monthYear, type: 'Open', count: items.open.length }] : []),
            ...(activeTab === 'PRs' && showCategory.merged ? [{ monthYear, type: 'Merged', count: 'merged' in items ? -(items.merged?.length || 0) : 0 }] : []), // Negative count
            ...(showCategory.closed ? [{ monthYear, type: 'Closed', count: -(items.closed.length) }] : []), // Negative count
            ...(activeTab === 'PRs' && showCategory.review ? [{ monthYear, type: 'Review', count: 'review' in items ? items.review?.length || 0 : 0 }] : []),
        ];
    });

    // Find the maximum of absolute values for merged and closed
    const mergedMax = Math.max(
        ...transformedData
            .filter(data => data.type === 'Merged')
            .map(data => Math.abs(data.count))
    );
    const closedMax = Math.max(
        ...transformedData
            .filter(data => data.type === 'Closed')
            .map(data => Math.abs(data.count))
    );

    // Get the minimum of merged and closed counts
    const getmin = Math.max(mergedMax, closedMax) || 0;

    // Prepare trend data for created category
    const trendData = showCategory.created
        ? Object.keys(dataToUse).map(monthYear => {
            const items = dataToUse[monthYear]; // Move this line here
            return {
                monthYear,
                Created: items.created.length + Math.abs(getmin),
            };
        })
        : [];

    // Determine y-axis min and max
    const yAxisMin = Math.min(-closedMax, -mergedMax);
    const yAxisMax = Math.max(0, Math.max(...trendData.map(data => data.Created)));

    // Sort data by monthYear in ascending order
    const sortedData = transformedData.sort((a, b) => a.monthYear.localeCompare(b.monthYear));
    const sortedTrendData = trendData.sort((a, b) => a.monthYear.localeCompare(b.monthYear));

    // Dual axes configuration
    const config = {
        data: [sortedData, sortedTrendData], // Provide both bar and trend data
        xField: 'monthYear',
        yField: ['count', 'Created'], // Use dual axes: one for bars and one for the line
        geometryOptions: [
            {
                geometry: 'column', // Bar chart for categories
                isStack: true,
                seriesField: 'type',
                columnStyle: {
                    radius: [0, 0, 0, 0],
                },
                tooltip: {
                  fields: ['type', 'count'],
                  formatter: ({ type, count }: { type: string; count: number }) => ({
                      name: type,
                      value: `${Math.abs(count)}`, // Adjust hover display for bar chart
                  }),
              },
                
            },
            {
                geometry: 'line', // Line chart for trend (Created)
                smooth: true,
                lineStyle: {
                    stroke: "#ff00ff", // Magenta line color
                    lineWidth: 2,
                },
                tooltip: {
                  fields: ['monthYear', 'Created'],
                  formatter: ({ monthYear, Created }: { monthYear: string; Created: number }) => ({
                      name: 'Created',
                      value: `${Created - getmin}`, // Adjust hover display for line chart
                  }),
              },
               
            },
        ],
        yAxis: [
            {
                min: yAxisMin, // Set min for bar chart y-axis
                max: 0, // Set max based on negative values
            },
            {
                min:  yAxisMin, // Start from 0 for the trend line
                max: yAxisMax, // Set max for trend line y-axis
                
            },
        ],
        slider: {
            start: 0,
            end: 1,
        },
        legend: { position: 'top-right' as const },
    };

    return <DualAxes {...config} />;
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
            textAlign="center"
            style={{ color: '#42a5f5', fontSize: '2.5rem', fontWeight: 'bold' }}
          >
            GitHub Analytics
          </Heading>

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
    How to Use the GitHub Analytics Tool?
  </Heading>
  <Text
  fontSize="md"
  marginBottom={2}
  color={useColorModeValue("gray.800", "gray.200")}
>
  <strong>Visualizing Trends:</strong> Use the timeline to visualize trends in the number of open, reviewed, created, closed, and merged pull requests (PRs) each month. Created PRs are those that have been newly opened. Closed PRs are those that have been closed but not merged, while merged PRs are those that have been both closed and merged. Open PRs represent the number of PRs that were still open during that month, while reviewed PRs are those that were reviewed in that month.
</Text>

<Text
  fontSize="md"
  marginBottom={2}
  color={useColorModeValue("gray.800", "gray.200")}
>
  <strong>Viewing Data for a Specific Month:</strong> To focus on a particular month, click the "View More" button. Then, select the desired year and month using the dropdown menus. The table and graph will update to show only the data for that specific month.
</Text>
<Text
  fontSize="md"
  marginBottom={2}
  color={useColorModeValue("gray.800", "gray.200")}
>
  <strong>Customizing the Graph:</strong> You can choose to display specific data in the graph by selecting or deselecting checkboxes for created, closed, and merged PRs. This allows you to focus on the trends that matter most to you.
</Text>
<Text
  fontSize="md"
  color={useColorModeValue("gray.800", "gray.200")}
>
  <strong>Downloading Reports:</strong> Once you've selected your preferred data using "View More," you can download reports based on the filtered data for further analysis or record-keeping.
</Text>

</Box>
  
          <Flex justify="center" mb={8}>
            <Button
              colorScheme="blue"
              onClick={() => setActiveTab('PRs')}
              isActive={activeTab === 'PRs'}
              mr={4}
            >
              PRs
            </Button>
            <Button
              colorScheme="blue"
              onClick={() => setActiveTab('Issues')}
              isActive={activeTab === 'Issues'}
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
              <option value="RIPs">RIPs</option>
            </Select>
          </Flex>
  
          <Box>{renderChart()}</Box>

          <Box mt={2}>
        <Text color="gray.500" fontStyle="italic" textAlign="center">
          *Note: The data is refreshed every 24 hours to ensure accuracy and up-to-date information*
        </Text>
      </Box>
         
          <Flex justify="center" mb={8}>
  <Checkbox
    isChecked={showCategory.created}
    onChange={() => setShowCategory(prev => ({ ...prev, created: !prev.created }))}
    mr={4}
  >
    {activeTab === 'PRs' ? 'Show Created PRs' : 'Show Created Issues'}
  </Checkbox>
  
    <Checkbox
      isChecked={showCategory.open}
      onChange={() => setShowCategory(prev => ({ ...prev, open: !prev.open }))}
      mr={4}
    >
      Show Open PRs
    </Checkbox>
  
  <Checkbox
    isChecked={showCategory.closed}
    onChange={() => setShowCategory(prev => ({ ...prev, closed: !prev.closed }))}
    mr={4}
  >
    {activeTab === 'PRs' ? 'Show Closed PRs' : 'Show Closed Issues'}
  </Checkbox>
  {activeTab === 'PRs' && (
    <Checkbox
      isChecked={showCategory.merged}
      onChange={() => setShowCategory(prev => ({ ...prev, merged: !prev.merged }))}
      mr={4}
    >
      Show Merged PRs
    </Checkbox>
  )}
  {activeTab === 'PRs' && (
    <Checkbox
      isChecked={showCategory.review}
      onChange={() => setShowCategory(prev => ({ ...prev, review: !prev.review }))}
      mr={4}
    >
      Show Reviewed PRs
    </Checkbox>
  )}
</Flex>

  
          <Flex justify="center" mb={8}>
            <Button colorScheme="blue" onClick={toggleDropdown}>
              {showDropdown ? 'Hide' : 'View More'}
            </Button>
          </Flex>
  
          {showDropdown && (
            <Box mb={8} display="flex" justifyContent="center">
              <HStack spacing={4}>
                <Menu>
                  <MenuButton as={Button} rightIcon={<ChevronDownIcon />} colorScheme="blue">
                    {selectedYear ? `Year: ${selectedYear}` : 'Select Year'}
                  </MenuButton>
                  <MenuList>
                    {getYears().map(year => (
                      <MenuItem
                        key={year}
                        onClick={() => {
                          setSelectedYear(year.toString());
                          setSelectedMonth(null);
                        }}
                      >
                        {year}
                      </MenuItem>
                    ))}
                  </MenuList>
                </Menu>
  
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
                    {selectedYear && getMonths().map((month, index) => (
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
                      <Button colorScheme="blue" onClick={handleDownload}>Download CSV</Button>
                    </Box>
                  </Box>
              )}
  
          {selectedYear && selectedMonth && (
            <Box mt={8}>
              {renderTable(selectedYear, selectedMonth, activeTab)}
            </Box>
          )}
        </Box>
      </AllLayout>
    )
  );
  
};

export default GitHubPRTracker;