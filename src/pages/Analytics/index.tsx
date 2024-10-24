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
  Collapse,
  useColorModeValue
} from "@chakra-ui/react";
import DateTime from "@/components/DateTime";
import LoaderComponent from "@/components/Loader";
import AllLayout from "@/components/Layout";
import {ChevronUpIcon } from "@chakra-ui/icons";


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
  repo:string;
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
  repo:string;
  IssueNumber: number;
  IssueTitle: string;
  state: string;
  created_at: Date;
  closed_at: Date | null;
};

const GitHubPRTracker: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'PRs' | 'Issues'>('PRs');
  const [selectedRepo, setSelectedRepo] = useState<string>('All');
  const { isOpen: showDropdown, onToggle: toggleDropdown } = useDisclosure();
  const [show, setShow] = useState(false);
  const bg = useColorModeValue("#f6f6f7", "#171923");

  const toggleCollapse = () => setShow(!show);
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
      // Fetch PR data from all three repositories: EIPs, ERCs, RIPs
      const [eipsData, ercsData, ripsData] = await Promise.all(
        PR_API_ENDPOINTS.map(endpoint => fetch(endpoint).then(res => res.json()))
      );
  
      // Fetch review data for each repository
      const [eipsRes, ercsRes, ripsRes] = await Promise.all([
        fetch(API_ENDPOINTS.eips),
        fetch(API_ENDPOINTS.ercs),
        fetch(API_ENDPOINTS.rips),
      ]);
  
      const eipsReviewData = await eipsRes.json();
      const ercsReviewData = await ercsRes.json();
      const ripsReviewData = await ripsRes.json();
  
      // Ensure review data is an object
      let combinedReviewData: PR[] = [];
  
      let transformedData: { [key: string]: { created: PR[], closed: PR[], merged: PR[], open: PR[], review: PR[] } } = {};
  
      // Selection logic for single repositories
      if (selectedRepo === 'EIPs') {
        transformedData = transformPRData(eipsData, combinedReviewData);
      } else if (selectedRepo === 'ERCs') {
        transformedData = transformPRData(ercsData, combinedReviewData);
      } else if (selectedRepo === 'RIPs') {
        transformedData = transformPRData(ripsData, combinedReviewData);
        
      } else {
        // When all repos are selected, transform and combine the data
  
        const eipsTransformed = transformPRData(eipsData, combinedReviewData);
        const ercsTransformed = transformPRData(ercsData, combinedReviewData);
        const ripsTransformed = transformPRData(ripsData, combinedReviewData);
        console.log(ripsTransformed);
  
        // Combine the transformed data for each month/year key
        const combineData = (source: any, target: any) => {
          Object.keys(source).forEach(key => {
            if (!target[key]) {
              target[key] = {
                created: [],
                closed: [],
                merged: [],
                open: [],
                review: []
              };
            }
            target[key].created.push(...source[key].created);
            target[key].closed.push(...source[key].closed);
            target[key].merged.push(...source[key].merged);
            target[key].open.push(...source[key].open);
            target[key].review.push(...source[key].review);
          });
        };
  
        // Start with the transformed EIPs data and merge in ERCs and RIPs
        combineData(eipsTransformed, transformedData);
        combineData(ercsTransformed, transformedData);
        combineData(ripsTransformed, transformedData);
      }

      // console.log(transformedData);
  
      // Update state with the combined data
      setData(prevData => ({
        ...prevData,
        PRs: transformedData,
      }));
    } catch (error) {
      console.error("Failed to fetch PR data:", error);
    }
  };
  


  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(prev => prev === category ? null : category); // Toggle selection
    setShowCategory({
      created: category === 'created',
      open: category === 'open',
      closed: category === 'closed',
      merged: category === 'merged',
      // review: category === 'review' // Uncomment if review category is enabled
    });
  };

  const fetchIssueData = async () => {
    try {
      // Fetch issue data from all three repositories: EIPs, ERCs, RIPs
      const [eipsData, ercsData, ripsData] = await Promise.all(
        ISSUE_API_ENDPOINTS.map(endpoint => fetch(endpoint).then(res => res.json()))
      );
  
      let transformedData: { [key: string]: { created: Issue[], closed: Issue[], open: Issue[] } } = {};
  
      // Selection logic for single repositories
      if (selectedRepo === 'EIPs') {
        transformedData = transformIssueData(eipsData);
      } else if (selectedRepo === 'ERCs') {
        transformedData = transformIssueData(ercsData);
      } else if (selectedRepo === 'RIPs') {
        transformedData = transformIssueData(ripsData);
      } else {
        // When all repos are selected, transform and combine the data
        const eipsTransformed = transformIssueData(eipsData);
        const ercsTransformed = transformIssueData(ercsData);
        const ripsTransformed = transformIssueData(ripsData);

        
  
        // Combine the transformed data for each month/year key
        const combineIssueData = (source: any, target: any) => {
          Object.keys(source).forEach(key => {
            if (!target[key]) {
              target[key] = {
                created: [],
                closed: [],
                open: [],
              };
            }
            target[key].created.push(...source[key].created);
            target[key].closed.push(...source[key].closed);
            target[key].open.push(...source[key].open);
          });
        };
  
        // Start with the transformed EIPs data and merge in ERCs and RIPs
        combineIssueData(eipsTransformed, transformedData);
        combineIssueData(ercsTransformed, transformedData);
        combineIssueData(ripsTransformed, transformedData);
      }
  
      // Update state with the combined data
      setData(prevData => ({
        ...prevData,
        Issues: transformedData,
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

    const processedPRs = new Set();

    data.forEach(pr => {
      if (!processedPRs.has(pr.prNumber)) {
      const createdDate = pr.created_at ? new Date(pr.created_at) : null;
      const closedDate = pr.closed_at ? new Date(pr.closed_at) : null;
      const mergedDate = pr.merged_at ? new Date(pr.merged_at) : null;
      
      processedPRs.add(pr.prNumber);

      // if(pr.prNumber===639 || pr.prNumber===664){
      //   console.log(pr.prNumber)
      //   console.log("created date: ",createdDate);
      //   console.log("Closed date: ", closedDate);
      //   console.log("Merged date: ", mergedDate);
      // }
  
      // Handle created date
      if (createdDate) {
          const key = `${createdDate.getUTCFullYear()}-${String(createdDate.getUTCMonth() + 1).padStart(2, '0')}`;
          if (!monthYearData[key]) monthYearData[key] = { created: [], closed: [], merged: [], open: [], review: [] };
          addReview(monthYearData[key].created, pr);
      }
  
      // Handle closed date (only if not merged)
      if (closedDate && !mergedDate) {
          const key = `${closedDate.getUTCFullYear()}-${String(closedDate.getUTCMonth() + 1).padStart(2, '0')}`;
          if (!monthYearData[key]) monthYearData[key] = { created: [], closed: [], merged: [], open: [], review: [] };
          addReview(monthYearData[key].closed, pr);
      }
  
      // Handle merged date
      if (mergedDate) {
          const key = `${mergedDate.getUTCFullYear()}-${String(mergedDate.getUTCMonth() + 1).padStart(2, '0')}`;
          if (!monthYearData[key]) monthYearData[key] = { created: [], closed: [], merged: [], open: [], review: [] };
          addReview(monthYearData[key].merged, pr);
      }
  
      // Handle open PRs
      if (createdDate) {
        let createdDateObj = new Date(createdDate);
        let createdYear = createdDateObj.getUTCFullYear();
        let createdMonth = createdDateObj.getUTCMonth(); // 0-indexed month
    
              // Initialize endDate based on closedDate or currentDate
      let endDate;
      if (closedDate) {
          let closedDateObj = new Date(closedDate);
          endDate = new Date(closedDateObj.getUTCFullYear(), closedDateObj.getUTCMonth() + 1, 1); // Set to the 1st of the month after closing
      } else {
          endDate = new Date(currentDate.getUTCFullYear(), currentDate.getUTCMonth() + 1, 1); // Set to the 1st of the next month
      }

      // Initialize openDate starting from the created date
      let openDate = new Date(createdYear, createdMonth, 1);

      while (openDate < endDate) {
          const openKey = `${openDate.getUTCFullYear()}-${String(openDate.getUTCMonth() + 1).padStart(2, '0')}`;
          // Initialize monthYearData for the current month key if not already present
          if (!monthYearData[openKey]) {
              monthYearData[openKey] = { created: [], closed: [], merged: [], open: [], review: [] };
          }
          // Add the PR to the open array for this month
          addIfNotExists(monthYearData[openKey].open, pr);

          // Increment to the next month
          openDate.setUTCMonth(openDate.getUTCMonth() + 1); // Move to the first day of the next month

      }

    }
  }
    
  });
  
  // Process reviews
  reviewData.forEach(pr => {
      const reviewDate = pr.reviewDate ? new Date(pr.reviewDate) : null;
  
      if (reviewDate) {
          const reviewKey = `${reviewDate.getUTCFullYear()}-${String(reviewDate.getUTCMonth() + 1).padStart(2, '0')}`;
          if (!monthYearData[reviewKey]) {
              monthYearData[reviewKey] = { created: [], closed: [], merged: [], open: [], review: [] };
          }
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
    const processedIssues = new Set();

    data.forEach(issue => {
      if (!processedIssues.has(issue.IssueNumber)) {
        
        processedIssues.add(issue.IssueNumber);
      const createdDate = new Date(issue.created_at);
      const closedDate = issue.closed_at ? new Date(issue.closed_at) : null;
      if(issue.IssueNumber==8978 || issue.IssueNumber===8982){
        console.log("issue: ",issue.IssueNumber)
        console.log("created date: ",createdDate);
        console.log(issue);
        
      }
      const createdKey = `${createdDate.getUTCFullYear()}-${String(createdDate.getUTCMonth() + 1).padStart(2, '0')}`;
      
      if (!monthYearData[createdKey]) {
          monthYearData[createdKey] = { created: [], closed: [], open: [] };
      }
      monthYearData[createdKey].created.push(issue);
  
      if (issue.closed_at) {
          const closedDate = new Date(issue.closed_at);
          const closedKey = `${closedDate.getUTCFullYear()}-${String(closedDate.getUTCMonth() + 1).padStart(2, '0')}`;
          
          if (!monthYearData[closedKey]) {
              monthYearData[closedKey] = { created: [], closed: [], open: [] };
          }
          monthYearData[closedKey].closed.push(issue);
      }
  
      // Set openDate to the creation date and endDate to the 1st of the closed month or current month
      // let openDate = new Date(createdDate);
      // let createdConstant = new Date(createdDate); // Store the creation date separately
      // let endDate = issue.closed_at 
      //     ? new Date(new Date(issue.closed_at).getUTCFullYear(), new Date(issue.closed_at).getUTCMonth(), 1) 
      //     : new Date(currentDate.getUTCFullYear(), currentDate.getUTCMonth() + 1, 1); // Include the current month
      
      // // Loop through each month the issue was open
      // while (openDate <= endDate) { // Open until the start of the closed month or current month
      //     const openKey = `${openDate.getUTCFullYear()}-${String(openDate.getUTCMonth() + 1).padStart(2, '0')}`;
      
      //     if (!monthYearData[openKey]) {
      //         monthYearData[openKey] = { created: [], closed: [], open: [] };
      //     }
      
      //     // Check if the issue was still open on the 1st of the month
      //     const firstOfMonth = new Date(openDate.getUTCFullYear(), openDate.getUTCMonth(), 1);
          
      //     // Skip if the openDate corresponds to the created month
      //     if (!(openDate.getUTCFullYear() === createdConstant.getUTCFullYear() && openDate.getUTCMonth() === createdConstant.getUTCMonth())) {
      //         if (firstOfMonth <= openDate && (!issue.closed_at || firstOfMonth < new Date(issue.closed_at))) {
      //             // Add to open only if it's still open on the first of that month
      //             addIfNotExists(monthYearData[openKey].open, issue);
      //         }
      //     }
      
      //     // Move to the next month
      //     openDate = incrementMonth(openDate);
      // }

      if (createdDate) {
        let createdDateObj = new Date(createdDate);
        let createdYear = createdDateObj.getUTCFullYear();
        let createdMonth = createdDateObj.getUTCMonth(); // 0-indexed month
    
              // Initialize endDate based on closedDate or currentDate
      let endDate;
      if (closedDate) {
          let closedDateObj = new Date(closedDate);
          endDate = new Date(closedDateObj.getUTCFullYear(), closedDateObj.getUTCMonth() + 1, 1); // Set to the 1st of the month after closing
      } else {
          endDate = new Date(currentDate.getUTCFullYear(), currentDate.getUTCMonth() + 1, 1); // Set to the 1st of the next month
      }

      // Initialize openDate starting from the created date
      let openDate = new Date(createdYear, createdMonth, 1);

      while (openDate < endDate) {
          const openKey = `${openDate.getUTCFullYear()}-${String(openDate.getUTCMonth() + 1).padStart(2, '0')}`;
          // Initialize monthYearData for the current month key if not already present
          if (!monthYearData[openKey]) {
              monthYearData[openKey] = { created: [], closed: [], open: [] };
          }
          // Add the PR to the open array for this month
          addIfNotExists(monthYearData[openKey].open, issue);

          // Increment to the next month
          openDate.setUTCMonth(openDate.getUTCMonth() + 1); // Move to the first day of the next month

      }

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
  

      const createdCount = items.created.length;
  const closedCount = items.closed.length;
  const openCount = items.open.length;

  // Conditionally calculate for PR-specific categories
  const mergedCount = type === 'PRs' ? (items as { merged: PR[] }).merged.length : 0;
  const reviewCount = type === 'PRs' ? (items as { review: PR[] }).review.length : 0;


    return (
      <Box mt={8} border="1px solid #e2e8f0" borderRadius="10px 10px 0 0" boxShadow="lg">
      <Flex
      wrap="wrap"
      justify="space-around"
      bg="gray.700" // Darker background for dark mode
      p={4}
      mb={4}
      borderRadius="md"
      boxShadow="md"
    >
      <Box
        textAlign="center"
        p={2}
        flex="1 1 150px"
        bg="gray.800" // Dark background
        color="white" // Visible text color for dark mode
        borderRadius="md"
        boxShadow="sm"
        m={2} // Add margin for space between boxes
        border={selectedCategory === 'created' ? '2px solid lightblue' : 'none'} // Highlight when selected
        onClick={() => handleCategoryClick('created')}
        cursor="pointer"
      >
        Created ({createdCount})
      </Box>

      <Box
        textAlign="center"
        p={2}
        flex="1 1 150px"
        bg="gray.800"
        color="white"
        borderRadius="md"
        boxShadow="sm"
        m={2}
        border={selectedCategory === 'open' ? '2px solid lightblue' : 'none'}
        onClick={() => handleCategoryClick('open')}
        cursor="pointer"
      >
        Open ({openCount})
      </Box>

      <Box
        textAlign="center"
        p={2}
        flex="1 1 150px"
        bg="gray.800"
        color="white"
        borderRadius="md"
        boxShadow="sm"
        m={2}
        border={selectedCategory === 'closed' ? '2px solid lightblue' : 'none'}
        onClick={() => handleCategoryClick('closed')}
        cursor="pointer"
      >
        Closed ({closedCount})
      </Box>

      {type === 'PRs' && (
        <Box
          textAlign="center"
          p={2}
          flex="1 1 150px"
          bg="gray.800"
          color="white"
          borderRadius="md"
          boxShadow="sm"
          m={2}
          border={selectedCategory === 'merged' ? '2px solid lightblue' : 'none'}
          onClick={() => handleCategoryClick('merged')}
          cursor="pointer"
        >
          Merged ({mergedCount})
        </Box>
      )}
    </Flex>
    <Box 
  overflowY="auto" 
  maxHeight="700px" 
  borderBottomRadius="0" 
  borderTopWidth="1px" 
  borderTopColor="gray.200"
>
  <Table variant="striped" colorScheme="gray">
    <Thead bg="#2D3748">
      <Tr>
        <Th 
          color="white" 
          textAlign="center" 
          borderTopLeftRadius="10px" 
          minWidth="6rem"
        >
          Number
        </Th>
        <Th 
          color="white" 
          textAlign="center" 
          minWidth="20rem"
          whiteSpace="normal" // Allow wrapping
          overflow="hidden"   // Prevent overflow
          textOverflow="ellipsis" // Add ellipsis for overflowed text
        >
          Title
        </Th>
        <Th 
          color="white" 
          textAlign="center" 
          minWidth="6rem" 
        >
          State
        </Th>
        <Th 
          color="white" 
          textAlign="center" 
          minWidth="6rem" 
        >
          Created At
        </Th>
        <Th 
          color="white" 
          textAlign="center" 
          minWidth="6rem" 
          
        >
          Closed At
        </Th>
        {type === 'PRs' && (
          <Th 
            color="white" 
            textAlign="center" 
            minWidth="6rem" 
          >
            Merged At
          </Th>
        )}
        <Th 
          color="white" 
          textAlign="center" 
          minWidth="10rem"
        >
          Link
        </Th>
      </Tr>
    </Thead>
  

  
    <Tbody>
      {items.created.length === 0 && items.closed.length === 0 && (type === 'PRs' ? ('merged' in items && items.merged.length === 0) : true) ? (
        <Tr>
          <Td colSpan={type === 'PRs' ? 6 : 5} textAlign="center">No Data Available</Td>
        </Tr>
      ) : (
        <>
          {/* Render Created Items */}
          {showCategory.created && items.created.map((item: PR | Issue) => (
            <Tr key={`created-${type === 'PRs' ? (item as PR).prNumber : (item as Issue).IssueNumber}`} borderWidth="1px" borderColor="gray.200">
              <Td textAlign="center" verticalAlign="middle">{type === 'PRs' ? (item as PR).prNumber : (item as Issue).IssueNumber}</Td>
              <Td style={{ wordWrap: 'break-word', maxWidth: '200px' }}>{type === 'PRs' ? (item as PR).prTitle : (item as Issue).IssueTitle}</Td>
              <Td textAlign="center" verticalAlign="middle">Created</Td>
              <Td textAlign="center" verticalAlign="middle">{item.created_at ? new Date(item.created_at).toLocaleDateString() : '-'}</Td>
              <Td textAlign="center" verticalAlign="middle">{item.closed_at ? new Date(item.closed_at).toLocaleDateString() : '-'}</Td>
              {type === 'PRs' && <Td textAlign="center" verticalAlign="middle">{(item as PR).merged_at ? new Date((item as PR).merged_at!).toLocaleDateString() : '-'}</Td>}
              <Td>
                <button style={{
                  backgroundColor: '#428bca',
                  color: '#ffffff',
                  border: 'none',
                  padding: '10px 20px',
                  cursor: 'pointer',
                  borderRadius: '5px',
                }}>
                  <a 
                    href={`https://github.com/ethereum/${(item as PR).repo}/${type === 'PRs' ? 'pull' : 'issues'}/${type === 'PRs' ? (item as PR).prNumber : (item as Issue).IssueNumber}`} 
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {type === 'PRs' ? 'Pull Request' : 'Issue'}
                  </a>
                </button>
              </Td>
            </Tr>
          ))}

          {/* Render Closed Items */}
          {showCategory.closed && items.closed.map((item: PR | Issue) => (
            <Tr key={`closed-${type === 'PRs' ? (item as PR).prNumber : (item as Issue).IssueNumber}`} borderWidth="1px" borderColor="gray.200">
              <Td textAlign="center" verticalAlign="middle">{type === 'PRs' ? (item as PR).prNumber : (item as Issue).IssueNumber}</Td>
              <Td textAlign="center" verticalAlign="middle" whiteSpace="normal" overflow="hidden" textOverflow="ellipsis">{type === 'PRs' ? (item as PR).prTitle : (item as Issue).IssueTitle}</Td>
              <Td textAlign="center" verticalAlign="middle">Closed</Td>
              <Td textAlign="center" verticalAlign="middle">{item.created_at ? new Date(item.created_at).toLocaleDateString() : '-'}</Td>
              <Td textAlign="center" verticalAlign="middle">{item.closed_at ? new Date(item.closed_at).toLocaleDateString() : '-'}</Td>
              {type === 'PRs' && <Td textAlign="center" verticalAlign="middle">{(item as PR).merged_at ? new Date((item as PR).merged_at!).toLocaleDateString() : '-'}</Td>}
              <Td>
                <button style={{
                  backgroundColor: '#428bca',
                  color: '#ffffff',
                  border: 'none',
                  padding: '10px 20px',
                  cursor: 'pointer',
                  borderRadius: '5px',
                }}>
                  <a 
                    href={`https://github.com/ethereum/${selectedRepo}/${type === 'PRs' ? 'pull' : 'issues'}/${type === 'PRs' ? (item as PR).prNumber : (item as Issue).IssueNumber}`} 
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {type === 'PRs' ? 'Pull Request' : 'Issue'}
                  </a>
                </button>
              </Td>
            </Tr>
          ))}

          {/* Render Merged Items (only for PRs) */}
          {showCategory.merged && type === 'PRs' && (items as { merged: PR[] }).merged.map((item: PR) => (
            <Tr key={`merged-${item.prNumber}`} borderWidth="1px" borderColor="gray.200">
              <Td textAlign="center" verticalAlign="middle">{item.prNumber}</Td>
              <Td textAlign="center" verticalAlign="middle" whiteSpace="normal" overflow="hidden" textOverflow="ellipsis">{item.prTitle}</Td>
              <Td textAlign="center" verticalAlign="middle">Merged</Td>
              <Td textAlign="center" verticalAlign="middle">{item.created_at ? new Date(item.created_at).toLocaleDateString() : '-'}</Td>
              <Td textAlign="center" verticalAlign="middle">{item.closed_at ? new Date(item.closed_at).toLocaleDateString() : '-'}</Td>
              <Td textAlign="center" verticalAlign="middle">{item.merged_at ? new Date(item.merged_at!).toLocaleDateString() : '-'}</Td>
              <Td>
                <button style={{
                  backgroundColor: '#428bca',
                  color: '#ffffff',
                  border: 'none',
                  padding: '10px 20px',
                  cursor: 'pointer',
                  borderRadius: '5px',
                }}>
                  <a 
                    href={`https://github.com/ethereum/${(item as PR).repo}/pull/${item.prNumber}`} 
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {type === 'PRs' ? 'Pull Request' : 'Issue'}
                  </a>
                </button>
              </Td>
            </Tr>
          ))}

          {/* Render Open Items */}
          {showCategory.open && items.open.map((item: PR | Issue) => (
            <Tr key={`open-${type === 'PRs' ? (item as PR).prNumber : (item as Issue).IssueNumber}`} borderWidth="1px" borderColor="gray.200">
              <Td textAlign="center" verticalAlign="middle">{type === 'PRs' ? (item as PR).prNumber : (item as Issue).IssueNumber}</Td>
              <Td textAlign="center" verticalAlign="middle" whiteSpace="normal" overflow="hidden" textOverflow="ellipsis">{type === 'PRs' ? (item as PR).prTitle : (item as Issue).IssueTitle}</Td>
              <Td textAlign="center" verticalAlign="middle">Open</Td>
              <Td textAlign="center" verticalAlign="middle">{item.created_at ? new Date(item.created_at).toLocaleDateString() : '-'}</Td>
              <Td textAlign="center" verticalAlign="middle">{item.closed_at ? new Date(item.closed_at).toLocaleDateString() : '-'}</Td>
              {type === 'PRs' && <Td textAlign="center" verticalAlign="middle">{(item as PR).merged_at ? new Date((item as PR).merged_at!).toLocaleDateString() : '-'}</Td>}
              <Td>
                <button style={{
                  backgroundColor: '#428bca',
                  color: '#ffffff',
                  border: 'none',
                  padding: '10px 20px',
                  cursor: 'pointer',
                  borderRadius: '5px',
                }}>
                  <a 
                    href={`https://github.com/ethereum/${(item as PR).repo}/${type === 'PRs' ? 'pull' : 'issues'}/${type === 'PRs' ? (item as PR).prNumber : (item as Issue).IssueNumber}`} 
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {type === 'PRs' ? 'Pull Request' : 'Issue'}
                  </a>
                </button>
              </Td>
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
      ? ['Number', 'Title',  'Created At', 'Closed At', 'Merged At', 'Link']
      : ['Number', 'Title', 'Created At', 'Closed At', 'Link'];
  
    // Add headers to CSV rows
    csvRows.push(headers.join(','));
     
    console.log("filteredData",filteredData)
    // Combine created and closed arrays for PRs and Issues
    const items = type === 'PRs'
  ? [
    ...(Array.isArray(filteredData.reviewed) && showCategory.review ? filteredData.reviewed : []),
      ...(Array.isArray(filteredData.created) && showCategory.created ? filteredData.created : []),
      ...(Array.isArray(filteredData.closed) && showCategory.closed ? filteredData.closed : []),
      ...(Array.isArray(filteredData.merged) && showCategory.merged ? filteredData.merged : []),
      ...(Array.isArray(filteredData.open) && showCategory.open ? filteredData.open : []),
      // ...(Array.isArray(filteredData.review) && showCategory.review ? filteredData.review : [])
    ]
  : [
      ...(Array.isArray(filteredData.created) && showCategory.created ? filteredData.created : []),
      ...(Array.isArray(filteredData.closed) && showCategory.closed ? filteredData.closed : []),
      ...(Array.isArray(filteredData.open) && showCategory.open ? filteredData.open : [])
    ];
    
    console.log(items);

  
    // Add data to CSV rows
    items.forEach((item: PR | Issue) => {
      const row = type === 'PRs'
        ? [
            (item as PR).prNumber,
            `"${(item as PR).prTitle}"`,  // Wrap title in quotes
            new Date(item.created_at).toLocaleDateString(),
            item.closed_at ? new Date(item.closed_at).toLocaleDateString() : '-',
            (item as PR).merged_at ? new Date((item as PR).merged_at!).toLocaleDateString() : '-',
            `https://github.com/ethereum/${selectedRepo}/${type === 'PRs' ? 'pull' : 'issues'}/${(item as PR).prNumber}`
          ].join(',')
        : [
            (item as Issue).IssueNumber,
            `"${(item as Issue).IssueTitle}"`,  // Wrap title in quotes
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

    console.log("review data:",filteredData);
  
    // Combine arrays and pass them to the CSV function
    const combinedData = activeTab === 'PRs'
      ? {
          created: filteredData.created,
          closed: filteredData.closed,
          merged: 'merged' in filteredData ? filteredData.merged : [],
          reviewed: 'review' in filteredData ? filteredData.review:[],
          open:filteredData.open,
        }
      : {
          created: filteredData.created,
          closed: filteredData.closed,
          open:filteredData.open,
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
            ...(showCategory.created ? [{ monthYear, type: 'Created', count: items.created.length }] : []),
            ...(activeTab === 'PRs' && showCategory.merged ? [{ monthYear, type: 'Merged', count: 'merged' in items ? -(items.merged?.length || 0) : 0 }] : []), // Negative count
            ...(showCategory.closed ? [{ monthYear, type: 'Closed', count: -(items.closed.length) }] : []), // Negative count
            // ...(activeTab === 'PRs' && showCategory.review ? [{ monthYear, type: 'Review', count: 'review' in items ? items.review?.length || 0 : 0 }] : []),
        ];
    });

    // Find the maximum of absolute values for merged and closed
    const mergedMax = Math.max(
      0, // Default to 0 if no data is available
      ...transformedData
          .filter(data => data.type === 'Merged')
          .map(data => Math.abs(data.count))
  );
  
  const closedMax = Math.max(
      0, // Default to 0 if no data is available
      ...transformedData
          .filter(data => data.type === 'Closed')
          .map(data => Math.abs(data.count))
  );
  
    // Get the minimum of merged and closed counts
    const getmin = Math.max(mergedMax, closedMax) || 0;

    // Prepare trend data for created category
    const trendData = showCategory.open
        ? Object.keys(dataToUse).map(monthYear => {
            const items = dataToUse[monthYear]; // Move this line here
            return {
                monthYear,
                Open: items.open.length + (activeTab === 'PRs' ? Math.abs(getmin) : Math.abs(closedMax)),
            };
        })
        : [];

    // Determine y-axis min and max
    const yAxisMin = Math.min(-closedMax, -mergedMax);
    const yAxisMax = Math.max(0, Math.max(...trendData.map(data => data.Open)));

    // Sort data by monthYear in ascending order
    const sortedData = transformedData.sort((a, b) => a.monthYear.localeCompare(b.monthYear));
    const sortedTrendData = trendData.sort((a, b) => a.monthYear.localeCompare(b.monthYear));

    // Dual axes configuration
    const config = {
        data: [sortedData, sortedTrendData], // Provide both bar and trend data
        xField: 'monthYear',
        yField: ['count', 'Open'], // Use dual axes: one for bars and one for the line
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
              color: (datum: any) => {
                switch (datum.type) {
                    case 'Closed':
                        return '#ff4d4d'; // Soft red
                    case 'Merged':
                        return '#4caf50'; // Balanced green
                    case 'Created':
                        return '#2196f3'; // Medium blue
                    default:
                        return 'defaultColor';
                }
            }
              
            },
            {
                geometry: 'line', // Line chart for trend (Created)
                smooth: true,
                lineStyle: {
                    stroke: "#ff00ff", // Magenta line color
                    lineWidth: 2,
                },
                tooltip: {
                  fields: ['monthYear', 'Open'],
                  formatter: ({ monthYear, Open }: { monthYear: string; Open: number }) => ({
                      name: 'Open',
                      value: `${Open - getmin}`, // Adjust hover display for line chart
                  }),
              },
              color: '#ff00ff',
               
            },
        ],
        yAxis: [
            {
                min: yAxisMin, // Set min for bar chart y-axis
                max: 0, // Set max based on negative values
                label: {
                  formatter: () => '', // Completely hide labels
              },
              grid: {
                  line: { style: { stroke: 'transparent' } }, // Hide grid lines
              },
            },
            {
                min:  yAxisMin, // Start from 0 for the trend line
                max: yAxisMax, // Set max for trend line y-axis
                label: {
                  formatter: () => '', // Completely hide labels
              },
               
              grid: {
                  line: { style: { stroke: 'transparent' } }, // Hide grid lines
              },
                
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
            Analytics
          </Heading>

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
        >
         Analytics FAQ
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
          This tool aims to automate the process of tracking PRs and issues in
          GitHub repositories, providing visualizations and reports to
          streamline project management. The default view utilizes the timeline
          to observe trends in the number of Created, Closed, Merged, and Open
          PRs/Issues at the end of each month.
        </Text>

        <Heading
          as="h4"
          size="md"
          marginBottom={4}
          color={useColorModeValue("#3182CE", "blue.300")}
        >
          How can I view data for a specific month?
        </Heading>
        <Text
          fontSize="md"
          marginBottom={2}
          color={useColorModeValue("gray.800", "gray.200")}
          className="text-justify"
        >
          To focus on a specific month, click the View More button and choose
          the desired Year and Month from the dropdown menus. The table and
          graph will then update to display data exclusively for that selected
          month.
        </Text>

        <Heading
          as="h4"
          size="md"
          marginBottom={4}
          color={useColorModeValue("#3182CE", "blue.300")}
        >
          How to customize the chart?
        </Heading>
        <Text
          fontSize="md"
          marginBottom={2}
          color={useColorModeValue("gray.800", "gray.200")}
          className="text-justify"
        >
          To customize the chart, you can adjust the timeline scroll bar to
          display data for a specific month/year. Additionally, you can tailor
          the graph by selecting or deselecting checkboxes for Created, Closed,
          Merged, and Open PRs/Issues, allowing you to focus on the trends that
          are most relevant to you.
        </Text>

        <Heading
          as="h4"
          size="md"
          marginBottom={4}
          color={useColorModeValue("#3182CE", "blue.300")}
        >
          How to download reports?
        </Heading>
        <Text
          fontSize="md"
          color={useColorModeValue("gray.800", "gray.200")}
          className="text-justify"
        >
          After selecting your preferred data using the View More option, you
          can download reports based on the filtered data for further analysis
          or record-keeping. Simply click the download button to export the
          data in your chosen format.
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
              <option value="All">All</option>
              <option value="EIPs">EIPs</option>
              <option value="ERCs">ERCs</option>
              <option value="RIPs">RIPs</option>
            </Select>
          </Flex>
          <Box
            bgColor={bg}
            padding="2rem"
            borderRadius="0.55rem"
            _hover={{
              border: "1px",
              borderColor: "#30A0E0",
            }}
          >
          <Box padding={"2rem"} borderRadius={"0.55rem"}>
            {renderChart()}
            <Box className={"w-full"}>
              <DateTime />
            </Box>
          </Box>
          </Box>

          <Box mt={2}>
        <Text color="gray.500" fontStyle="italic" textAlign="center">
          *Note: The data is updated daily at 15:00 UTC to maintain accuracy and provide the most current information.*
        </Text>
        <Text color="gray.500" fontStyle="italic" textAlign="center">
          *Note: The data related to the number of PRs might vary when compared to official github repository due to factors like deleted PRs.*
        </Text>
      </Box>
      <br/>
         
          <Flex justify="center" mb={8}>
  <Checkbox
    isChecked={showCategory.created}
    onChange={() => setShowCategory(prev => ({ ...prev, created: !prev.created }))}
    mr={4}
  >
    {activeTab === 'PRs' ? 'Created PRs' : 'Created Issues'}
  </Checkbox>
  
    <Checkbox
      isChecked={showCategory.open}
      onChange={() => setShowCategory(prev => ({ ...prev, open: !prev.open }))}
      mr={4}
    >
      Open PRs
    </Checkbox>
  
  <Checkbox
    isChecked={showCategory.closed}
    onChange={() => setShowCategory(prev => ({ ...prev, closed: !prev.closed }))}
    mr={4}
  >
    {activeTab === 'PRs' ? 'Closed PRs' : 'Closed Issues'}
  </Checkbox>
  {activeTab === 'PRs' && (
    <Checkbox
      isChecked={showCategory.merged}
      onChange={() => setShowCategory(prev => ({ ...prev, merged: !prev.merged }))}
      mr={4}
    >
      Merged PRs
    </Checkbox>
  )}
  {/* {activeTab === 'PRs' && (
    <Checkbox
      isChecked={showCategory.review}
      onChange={() => setShowCategory(prev => ({ ...prev, review: !prev.review }))}
      mr={4}
    >
      Show Reviewed PRs
    </Checkbox>
  )} */}
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
               {showDropdown && ( 
                <>
          
                  {selectedYear && selectedMonth && (
                    <Box mt={8}>
                      {renderTable(selectedYear, selectedMonth, activeTab)}
                    </Box>
                  )}
                </>
                )}
        </Box>
      </AllLayout>
    )
  );
  
};

export default GitHubPRTracker;