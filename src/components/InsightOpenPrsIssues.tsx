import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import {
  Box,
  useColorModeValue,
  Flex,
  Spinner,
  Link as LI
} from "@chakra-ui/react";
import DateTime from "@/components/DateTime";
import LoaderComponent from "@/components/Loader";
import { usePathname } from "next/navigation";

// Dynamic import for Ant Design's Column chart
// const Column = dynamic(() => import("@ant-design/plots").then(mod => mod.Column), { ssr: false });
const DualAxes = dynamic(() => import("@ant-design/plots").then(mod => mod.DualAxes), { ssr: false });
const Line = dynamic(() => import("@ant-design/plots").then(mod => mod.Line), { ssr: false });

// import { Line } from '@ant-design/plots';

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

const InsightsOpenPrsIssues: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'PRs' | 'Issues'>('PRs');
  const [selectedRepo, setSelectedRepo] = useState<string>('All');
  const [show, setShow] = useState(false);
  const bg = useColorModeValue("#f6f6f7", "#171923");

  const toggleCollapse = () => setShow(!show);
  const [selectedYear, setSelectedYear] = useState<string>('');
  // const [selectedMonth, setSelectedMonth] = useState(null);
  const [data, setData] = useState<{
    PRs: { [key: string]: { created: PR[], closed: PR[], merged: PR[], open:PR[], review:PR[] } };
    Issues: { [key: string]: { created: Issue[], closed: Issue[], open: Issue[] } };
  }>({ PRs: {}, Issues: {} });

  const [data2, setData2] = useState<{
    PRs: { [key: string]: { created: PR[], closed: PR[], merged: PR[], open:PR[], review:PR[] } };
    Issues: { [key: string]: { created: Issue[], closed: Issue[], open: Issue[] } };
  }>({ PRs: {}, Issues: {} });

  const [data3, setData3] = useState<{
    PRs: { [key: string]: { created: PR[], closed: PR[], merged: PR[], open:PR[], review:PR[] } };
    Issues: { [key: string]: { created: Issue[], closed: Issue[], open: Issue[] } };
  }>({ PRs: {}, Issues: {} });


  const [showCategory, setShowCategory] = useState<{ [key: string]: boolean }>({
    created: false,
    closed: false,
    merged: false,
    open:true,
    review:false
  });


  const path = usePathname();

  useEffect(() => {
    if (path) {
      const pathParts = path.split("/");
      const year = pathParts[2]; // Extract year from the path
  
      // Only fetch data if the year has changed
      if (year !== selectedYear) {
        setSelectedYear(year); 
        fetchData(year)// Update the selected year
      }
    }
  }, [path, selectedYear]);
  

// const PR_API_ENDPOINTS = ['/api/eipsprdetails', '/api/ercsprdetails', '/api/ripsprdetails'];

const fetchPRData = async (year: string) => {
  try {
    // Fetch EIPs PR data
    const eipsData = await fetch(PR_API_ENDPOINTS[0]).then(res => res.json());
    
    // Fetch EIPs review data
    const eipsRes = await fetch(API_ENDPOINTS.eips);
    const eipsReviewData = await eipsRes.json();
    
    // Transform and set data
    const eipsTransformed = transformPRData(eipsData, eipsReviewData, year);
    let transformedData: { [key: string]: { created: PR[], closed: PR[], merged: PR[], open: PR[], review: PR[] } } = {};
    const combineData = (source: any, target: any, ) => {
                Object.keys(source).forEach(key => {
                  // Check if the key contains the required year (assuming key format is "YYYY-someOtherData")
                  const yearString = key.split('-')[0]; // Assuming the key format is "YYYY-someOtherData"
                  
                  if (year === yearString) {
                    if (!target[key]) {
                      target[key] = { created: [], closed: [], merged: [], open: [], review: [] };
                    }
                    target[key].created.push(...source[key].created);
                    target[key].closed.push(...source[key].closed);
                    target[key].merged.push(...source[key].merged);
                    target[key].open.push(...source[key].open);
                    target[key].review.push(...source[key].review);
                  }
                });
              };
    combineData(eipsTransformed, transformedData);
    setData(prevData => ({
      ...prevData,
      PRs: transformedData,
    }));
  } catch (error) {
    console.error("Failed to fetch EIPs PR data:", error);
  }
};

const fetchPRData2 = async (year: string) => {
  try {
    // Fetch ERCs PR data
    const ercsData = await fetch(PR_API_ENDPOINTS[1]).then(res => res.json());
    
    // Fetch ERCs review data
    const ercsRes = await fetch(API_ENDPOINTS.ercs);
    const ercsReviewData = await ercsRes.json();
    // Transform and set data
    const ercsTransformed = transformPRData(ercsData, ercsReviewData, year);
    let transformedData: { [key: string]: { created: PR[], closed: PR[], merged: PR[], open: PR[], review: PR[] } } = {};
    const combineData = (source: any, target: any, ) => {
                Object.keys(source).forEach(key => {
                  // Check if the key contains the required year (assuming key format is "YYYY-someOtherData")
                  const yearString = key.split('-')[0]; // Assuming the key format is "YYYY-someOtherData"
                  
                  if (year === yearString) {
                    if (!target[key]) {
                      target[key] = { created: [], closed: [], merged: [], open: [], review: [] };
                    }
                    target[key].created.push(...source[key].created);
                    target[key].closed.push(...source[key].closed);
                    target[key].merged.push(...source[key].merged);
                    target[key].open.push(...source[key].open);
                    target[key].review.push(...source[key].review);
                  }
                });
              };
    combineData(ercsTransformed, transformedData);
    
    // Transform and set data
    // const transformedData = transformPRData(ercsData, ercsReviewData, year);
    setData2(prevData => ({
      ...prevData,
      PRs: transformedData,
    }));
  } catch (error) {
    console.error("Failed to fetch ERCs PR data:", error);
  }
};

const fetchPRData3 = async (year: string) => {
  try {
    // Fetch RIPs PR data
    const ripsData = await fetch(PR_API_ENDPOINTS[2]).then(res => res.json());
    
    // Fetch RIPs review data
    const ripsRes = await fetch(API_ENDPOINTS.rips);
    const ripsReviewData = await ripsRes.json();
    
    // Transform and set data
    const ripsTransformed = transformPRData(ripsData, ripsReviewData, year);
    let transformedData: { [key: string]: { created: PR[], closed: PR[], merged: PR[], open: PR[], review: PR[] } } = {};
    const combineData = (source: any, target: any, ) => {
                Object.keys(source).forEach(key => {
                  // Check if the key contains the required year (assuming key format is "YYYY-someOtherData")
                  const yearString = key.split('-')[0]; // Assuming the key format is "YYYY-someOtherData"
                  
                  if (year === yearString) {
                    if (!target[key]) {
                      target[key] = { created: [], closed: [], merged: [], open: [], review: [] };
                    }
                    target[key].created.push(...source[key].created);
                    target[key].closed.push(...source[key].closed);
                    target[key].merged.push(...source[key].merged);
                    target[key].open.push(...source[key].open);
                    target[key].review.push(...source[key].review);
                  }
                });
              };
    combineData(ripsTransformed, transformedData);

    setData3(prevData => ({
      ...prevData,
      PRs: transformedData,
    }));
  } catch (error) {
    console.error("Failed to fetch RIPs PR data:", error);
  }
};



  // const fetchPRData = async (year: string) => {
  //   try {
  //     // Fetch PR data from all three repositories: EIPs, ERCs, RIPs
  //     const [eipsData, ercsData, ripsData] = await Promise.all(
  //       PR_API_ENDPOINTS.map(endpoint => fetch(endpoint).then(res => res.json()))
  //     );
  
  //     // Fetch review data for each repository
  //     const [eipsRes, ercsRes, ripsRes] = await Promise.all([
  //       fetch(API_ENDPOINTS.eips),
  //       fetch(API_ENDPOINTS.ercs),
  //       fetch(API_ENDPOINTS.rips),
  //     ]);
  
  //     const eipsReviewData = await eipsRes.json();
  //     const ercsReviewData = await ercsRes.json();
  //     const ripsReviewData = await ripsRes.json();
  
  //     // Initialize combined review data
  //     let combinedReviewData: PR[] = [];
  
  //     // Transform data based on selected repository
  //     let transformedData: { [key: string]: { created: PR[], closed: PR[], merged: PR[], open: PR[], review: PR[] } } = {};
  
  //     if (selectedRepo === 'EIPs') {
  //       transformedData = transformPRData(eipsData, combinedReviewData, year);
  //     } else if (selectedRepo === 'ERCs') {
  //       transformedData = transformPRData(ercsData, combinedReviewData, year);
  //     } else if (selectedRepo === 'RIPs') {
  //       transformedData = transformPRData(ripsData, combinedReviewData, year);
  //     } else {
  //       // When all repositories are selected, combine their data
  //       const eipsTransformed = transformPRData(eipsData, combinedReviewData, year);
  //       const ercsTransformed = transformPRData(ercsData, combinedReviewData, year);
  //       const ripsTransformed = transformPRData(ripsData, combinedReviewData, year);
  
  //       const combineData = (source: any, target: any, ) => {
  //           Object.keys(source).forEach(key => {
  //             // Check if the key contains the required year (assuming key format is "YYYY-someOtherData")
  //             const yearString = key.split('-')[0]; // Assuming the key format is "YYYY-someOtherData"
              
  //             if (year === yearString) {
  //               if (!target[key]) {
  //                 target[key] = { created: [], closed: [], merged: [], open: [], review: [] };
  //               }
  //               target[key].created.push(...source[key].created);
  //               target[key].closed.push(...source[key].closed);
  //               target[key].merged.push(...source[key].merged);
  //               target[key].open.push(...source[key].open);
  //               target[key].review.push(...source[key].review);
  //             }
  //           });
  //         };
          
  
  //       // Combine EIPs, ERCs, and RIPs data into one
  //       combineData(eipsTransformed, transformedData);
  //       combineData(ercsTransformed, transformedData);
  //       combineData(ripsTransformed, transformedData);
  //     }
  
  //     // Update the state with transformed PR data
  //     setData(prevData => ({
  //       ...prevData,
  //       PRs: transformedData,
  //     }));
  //   } catch (error) {
  //     console.error("Failed to fetch PR data:", error);
  //   }
  // };
  
  
  // const fetchIssueData = async (year:string) => {
  //   try {
  //     // Fetch issue data from all three repositories: EIPs, ERCs, RIPs
  //     const [eipsData, ercsData, ripsData] = await Promise.all(
  //       ISSUE_API_ENDPOINTS.map(endpoint => fetch(endpoint).then(res => res.json()))
  //     );
  
  //     let transformedData: { [key: string]: { created: Issue[], closed: Issue[], open: Issue[] } } = {};
  
  //     // Selection logic for single repositories
  //     if (selectedRepo === 'EIPs') {
  //       transformedData = transformIssueData(eipsData,year);
  //     } else if (selectedRepo === 'ERCs') {
  //       transformedData = transformIssueData(ercsData,year);
  //     } else if (selectedRepo === 'RIPs') {
  //       transformedData = transformIssueData(ripsData,year);
  //     } else {
  //       // When all repos are selected, transform and combine the data
  //       const eipsTransformed = transformIssueData(eipsData,year);
  //       const ercsTransformed = transformIssueData(ercsData,year);
  //       const ripsTransformed = transformIssueData(ripsData,year);

        
  
  //       // Combine the transformed data for each month/year key
  //       const combineIssueData = (source: any, target: any) => {
  //           Object.keys(source).forEach(key => {
  //               // Check if the key contains the required year (assuming key format is "YYYY-someOtherData")
  //               const yearString = key.split('-')[0]; // Assuming the key format is "YYYY-someOtherData"
                
  //               if (year === yearString) {
  //                   if (!target[key]) {
  //                       target[key] = {
  //                         created: [],
  //                         closed: [],
  //                         open: [],
  //                       };
  //                     }
  //                     target[key].created.push(...source[key].created);
  //                     target[key].closed.push(...source[key].closed);
  //                     target[key].open.push(...source[key].open);
  //               }
  //             });
  //       };
  
  //       // Start with the transformed EIPs data and merge in ERCs and RIPs
  //       combineIssueData(eipsTransformed, transformedData);
  //       combineIssueData(ercsTransformed, transformedData);
  //       combineIssueData(ripsTransformed, transformedData);
  //     }
  
  //     // Update state with the combined data
  //     setData(prevData => ({
  //       ...prevData,
  //       Issues: transformedData,
  //     }));
  //   } catch (error) {
  //     console.error("Failed to fetch Issues data:", error);
  //   }
  // };

  // const ISSUE_API_ENDPOINTS = ['/api/eipsissuedetails', '/api/ercsissuedetails', '/api/ripsissuedetails'];

  const fetchIssueData = async (year: string) => {
    try {
      // Fetch EIPs issue data
      const eipsData = await fetch(ISSUE_API_ENDPOINTS[0]).then(res => res.json());
  
      // Transform and set data
      const eipsTransformed = transformIssueData(eipsData,year);
      let transformedData: { [key: string]: { created: Issue[], closed: Issue[], open: Issue[] } } = {};
      // Combine the transformed data for each month/year key
        const combineIssueData = (source: any, target: any) => {
            Object.keys(source).forEach(key => {
                // Check if the key contains the required year (assuming key format is "YYYY-someOtherData")
                const yearString = key.split('-')[0]; // Assuming the key format is "YYYY-someOtherData"
                
                if (year === yearString) {
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
                }
              });
        };
  
        // Start with the transformed EIPs data and merge in ERCs and RIPs
        combineIssueData(eipsTransformed, transformedData);


      setData(prevData => ({
        ...prevData,
        Issues: transformedData,
      }));
    } catch (error) {
      console.error("Failed to fetch EIPs issue data:", error);
    }
  };
  
  const fetchIssueData2 = async (year: string) => {
    try {
      // Fetch ERCs issue data
      const ercsData = await fetch(ISSUE_API_ENDPOINTS[1]).then(res => res.json());
  
      // Transform and set data
      const ercsTransformed = transformIssueData(ercsData,year);
      let transformedData: { [key: string]: { created: Issue[], closed: Issue[], open: Issue[] } } = {};
      // Combine the transformed data for each month/year key
        const combineIssueData = (source: any, target: any) => {
            Object.keys(source).forEach(key => {
                // Check if the key contains the required year (assuming key format is "YYYY-someOtherData")
                const yearString = key.split('-')[0]; // Assuming the key format is "YYYY-someOtherData"
                
                if (year === yearString) {
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
                }
              });
        };
  
        // Start with the transformed EIPs data and merge in ERCs and RIPs
        combineIssueData(ercsTransformed, transformedData);
      setData2(prevData => ({
        ...prevData,
        Issues: transformedData,
      }));
    } catch (error) {
      console.error("Failed to fetch ERCs issue data:", error);
    }
  };
  
  const fetchIssueData3 = async (year: string) => {
    try {
      // Fetch RIPs issue data
      const ripsData = await fetch(ISSUE_API_ENDPOINTS[2]).then(res => res.json());
  
     // Transform and set data
     const ripsTransformed = transformIssueData(ripsData,year);
     let transformedData: { [key: string]: { created: Issue[], closed: Issue[], open: Issue[] } } = {};
     // Combine the transformed data for each month/year key
       const combineIssueData = (source: any, target: any) => {
           Object.keys(source).forEach(key => {
               // Check if the key contains the required year (assuming key format is "YYYY-someOtherData")
               const yearString = key.split('-')[0]; // Assuming the key format is "YYYY-someOtherData"
               
               if (year === yearString) {
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
               }
             });
       };
 
       // Start with the transformed EIPs data and merge in ERCs and RIPs
       combineIssueData(ripsTransformed, transformedData);
      setData3(prevData => ({
        ...prevData,
        Issues: transformedData,
      }));
    } catch (error) {
      console.error("Failed to fetch RIPs issue data:", error);
    }
  };

  const fetchData = async (year:string) => {
    setLoading(true);
    await fetchPRData(year);
    await fetchPRData2(year);
    await fetchPRData3(year);
    
    await fetchIssueData(year);
    await fetchIssueData2(year);
    await fetchIssueData3(year);
    setLoading(false);
  };

  const transformPRData = (
    data: PR[], 
    reviewData: PR[], 
    Year:string
  ): { [key: string]: { created: PR[], closed: PR[], merged: PR[], open: PR[], review: PR[] } } => {
    
    const monthYearData: { [key: string]: { created: PR[], closed: PR[], merged: PR[], open: PR[], review: PR[] } } = {};
    const currentDate = new Date();
  
    const addIfNotExists = (arr: PR[], pr: PR) => {
      const isClosedThisMonth = pr.closed_at &&
        new Date(pr.closed_at).getFullYear() === currentDate.getFullYear() &&
        new Date(pr.closed_at).getMonth() === currentDate.getMonth();
  
      if (!isClosedThisMonth && !arr.some(existingPr => existingPr.prNumber === pr.prNumber)) {
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
      if(pr.prNumber===9011 || pr.prNumber===9010){
        console.log(pr.prNumber)
        console.log("created date: ",createdDate);
        console.log("open date: ", openDate);
        console.log("closed date: ", endDate);
      }
  

      while (openDate < endDate) {
        // Before incrementing, log the current state
        const currentYear = openDate.getFullYear();
        const currentMonth = String(openDate.getMonth() + 1).padStart(2, '0'); // Correctly format month
        
        const openKey = `${currentYear}-${currentMonth}`;
    
        // Debug log statements
        if (pr.prNumber === 9011) {
          console.log(currentMonth);
            console.log(`PR Number: ${pr.prNumber}`);
            console.log(`Created Date: ${pr.created_at}`);
            console.log(`Open Date: ${openDate}`);
            console.log(`Closed Date: ${pr.closed_at}`);
            console.log(`Generated Key: ${openKey}`); // Key generated before incrementing month
        }
    
        // Initialize monthYearData for the current month key if not already present
        if (!monthYearData[openKey]) {
            monthYearData[openKey] = { created: [], closed: [], merged: [], open: [], review: [] };
        }
    
        // Add the PR to the open array for this month
        addIfNotExists(monthYearData[openKey].open, pr);
    
        // Increment to the next month (update the date first, then create the key)
        openDate.setUTCMonth(openDate.getUTCMonth() + 1); // Move to the first day of the next month
        openDate.setUTCDate(1); // Set the date to the first of the new month
    }
          }
        // }
      }
    });
  
    return monthYearData;
  };
  

  const transformIssueData = (data: Issue[], year:string): { [key: string]: { created: Issue[], closed: Issue[], open:Issue[] } } => {
   
    const monthYearData: { [key: string]: { created: Issue[], closed: Issue[], open:Issue[] } } = {};
    
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
      // Before incrementing, log the current state
      const currentYear = openDate.getFullYear();
      const currentMonth = String(openDate.getMonth() + 1).padStart(2, '0'); // Correctly format month
      
      const openKey = `${currentYear}-${currentMonth}`;

      if (!monthYearData[openKey]) {
          monthYearData[openKey] = { created: [], closed: [], open: [] };
      }
  
      // Add the PR to the open array for this month
      addIfNotExists(monthYearData[openKey].open, issue);
  
      // Increment to the next month (update the date first, then create the key)
      openDate.setUTCMonth(openDate.getUTCMonth() + 1); // Move to the first day of the next month
      openDate.setUTCDate(1); // Set the date to the first of the new month
  }
    }
    // }
    }
  });
  
    return monthYearData;
  };

  const renderChart = () => {
    const dataToUse = data.PRs;
    const dataToUse2=  data.Issues;
    const dataToUse3 = data2.PRs;
    const dataToUse4=  data2.Issues;
    const dataToUse5 = data3.PRs;
    const dataToUse6=  data3.Issues;

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
    const transformedData2 = Object.keys(dataToUse2).flatMap(monthYear => {
        const items = dataToUse[monthYear];
        return [
            ...(showCategory.created ? [{ monthYear, type: 'Created', count: items.created.length }] : []),
            ...(activeTab === 'PRs' && showCategory.merged ? [{ monthYear, type: 'Merged', count: 'merged' in items ? -(items.merged?.length || 0) : 0 }] : []), // Negative count
            ...(showCategory.closed ? [{ monthYear, type: 'Closed', count: -(items.closed.length) }] : []), // Negative count
            // ...(activeTab === 'PRs' && showCategory.review ? [{ monthYear, type: 'Review', count: 'review' in items ? items.review?.length || 0 : 0 }] : []),
        ];
    });
    const transformedData3 = Object.keys(dataToUse3).flatMap(monthYear => {
      const items = dataToUse[monthYear];
      return [
          ...(showCategory.created ? [{ monthYear, type: 'Created', count: items.created.length }] : []),
          ...(activeTab === 'PRs' && showCategory.merged ? [{ monthYear, type: 'Merged', count: 'merged' in items ? -(items.merged?.length || 0) : 0 }] : []), // Negative count
          ...(showCategory.closed ? [{ monthYear, type: 'Closed', count: -(items.closed.length) }] : []), // Negative count
          // ...(activeTab === 'PRs' && showCategory.review ? [{ monthYear, type: 'Review', count: 'review' in items ? items.review?.length || 0 : 0 }] : []),
      ];
  });
  const transformedData4 = Object.keys(dataToUse4).flatMap(monthYear => {
      const items = dataToUse[monthYear];
      return [
          ...(showCategory.created ? [{ monthYear, type: 'Created', count: items.created.length }] : []),
          ...(activeTab === 'PRs' && showCategory.merged ? [{ monthYear, type: 'Merged', count: 'merged' in items ? -(items.merged?.length || 0) : 0 }] : []), // Negative count
          ...(showCategory.closed ? [{ monthYear, type: 'Closed', count: -(items.closed.length) }] : []), // Negative count
          // ...(activeTab === 'PRs' && showCategory.review ? [{ monthYear, type: 'Review', count: 'review' in items ? items.review?.length || 0 : 0 }] : []),
      ];
  });

  const transformedData5 = Object.keys(dataToUse5).flatMap(monthYear => {
    const items = dataToUse[monthYear];
    return [
        ...(showCategory.created ? [{ monthYear, type: 'Created', count: items.created.length }] : []),
        ...(activeTab === 'PRs' && showCategory.merged ? [{ monthYear, type: 'Merged', count: 'merged' in items ? -(items.merged?.length || 0) : 0 }] : []), // Negative count
        ...(showCategory.closed ? [{ monthYear, type: 'Closed', count: -(items.closed.length) }] : []), // Negative count
        // ...(activeTab === 'PRs' && showCategory.review ? [{ monthYear, type: 'Review', count: 'review' in items ? items.review?.length || 0 : 0 }] : []),
    ];
});
const transformedData6 = Object.keys(dataToUse6).flatMap(monthYear => {
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

    const mergedMax2 = Math.max(
        0, // Default to 0 if no data is available
        ...transformedData2
            .filter(data => data.type === 'Merged')
            .map(data => Math.abs(data.count))
    );
    
    const closedMax2 = Math.max(
        0, // Default to 0 if no data is available
        ...transformedData2
            .filter(data => data.type === 'Closed')
            .map(data => Math.abs(data.count))
    );
    
      // Get the minimum of merged and closed counts
      const getmin2 = Math.max(mergedMax2, closedMax2) || 0;

       // Find the maximum of absolute values for merged and closed
    const mergedMax3 = Math.max(
      0, // Default to 0 if no data is available
      ...transformedData3
          .filter(data => data.type === 'Merged')
          .map(data => Math.abs(data.count))
  );
  
  const closedMax3 = Math.max(
      0, // Default to 0 if no data is available
      ...transformedData3
          .filter(data => data.type === 'Closed')
          .map(data => Math.abs(data.count))
  );
  
    // Get the minimum of merged and closed counts
    const getmin3 = Math.max(mergedMax3, closedMax3) || 0;

    const mergedMax4 = Math.max(
        0, // Default to 0 if no data is available
        ...transformedData4
            .filter(data => data.type === 'Merged')
            .map(data => Math.abs(data.count))
    );
    
    const closedMax4 = Math.max(
        0, // Default to 0 if no data is available
        ...transformedData4
            .filter(data => data.type === 'Closed')
            .map(data => Math.abs(data.count))
    );
    
      // Get the minimum of merged and closed counts
      const getmin4 = Math.max(mergedMax4, closedMax4) || 0;

       // Find the maximum of absolute values for merged and closed
    const mergedMax5 = Math.max(
      0, // Default to 0 if no data is available
      ...transformedData5
          .filter(data => data.type === 'Merged')
          .map(data => Math.abs(data.count))
  );
  
  const closedMax5 = Math.max(
      0, // Default to 0 if no data is available
      ...transformedData5
          .filter(data => data.type === 'Closed')
          .map(data => Math.abs(data.count))
  );
  
    // Get the minimum of merged and closed counts
    const getmin5 = Math.max(mergedMax5, closedMax5) || 0;

    const mergedMax6 = Math.max(
        0, // Default to 0 if no data is available
        ...transformedData6
            .filter(data => data.type === 'Merged')
            .map(data => Math.abs(data.count))
    );
    
    const closedMax6 = Math.max(
        0, // Default to 0 if no data is available
        ...transformedData6
            .filter(data => data.type === 'Closed')
            .map(data => Math.abs(data.count))
    );
    
      // Get the minimum of merged and closed counts
      const getmin6 = Math.max(mergedMax6, closedMax6) || 0;

    // Prepare trend data for created category
    const trendData = showCategory.open
  ? Object.keys(dataToUse).map(monthYear => {
      const items = dataToUse[monthYear] || {}; // Ensure items is defined
      const items2 = dataToUse2[monthYear] || {}; // Ensure items2 is defined

      return {
        monthYear,
        Open: (items.open ? items.open.length : 0) + (items2.open ? items2.open.length : 0) + 
              Math.abs(getmin) + Math.abs(closedMax2),
      };
    })
  : [];

  const trendData2 = showCategory.open
  ? Object.keys(dataToUse).map(monthYear => {
      const items = dataToUse3[monthYear] || {}; // Ensure items is defined
      const items2 = dataToUse4[monthYear] || {}; // Ensure items2 is defined

      return {
        monthYear,
        Open: (items.open ? items.open.length : 0) + (items2.open ? items2.open.length : 0) + 
              Math.abs(getmin) + Math.abs(closedMax2),
      };
    })
  : [];

  const trendData3 = showCategory.open
  ? Object.keys(dataToUse).map(monthYear => {
      const items = dataToUse5[monthYear] || {}; // Ensure items is defined
      const items2 = dataToUse6[monthYear] || {}; // Ensure items2 is defined

      return {
        monthYear,
        Open: (items.open ? items.open.length : 0) + (items2.open ? items2.open.length : 0) + 
              Math.abs(getmin) + Math.abs(closedMax2),
      };
    })
  : [];



    // Determine y-axis min and max
    const yAxisMin = Math.min(-closedMax, -mergedMax);
    const yAxisMax = Math.max(0, Math.max(...trendData.map(data => data.Open)));

    // Sort data by monthYear in ascending order
    const sortedData = transformedData.sort((a, b) => a.monthYear.localeCompare(b.monthYear));
    const sortedTrendData = trendData.sort((a, b) => a.monthYear.localeCompare(b.monthYear));

    // Determine y-axis min and max
    const yAxisMin2 = Math.min(-closedMax2, -mergedMax2);
    const yAxisMax2 = Math.max(0, Math.max(...trendData2.map(data => data.Open)));

    // Sort data by monthYear in ascending order
    const sortedData2 = transformedData2.sort((a, b) => a.monthYear.localeCompare(b.monthYear));
    const sortedTrendData2 = trendData2.sort((a, b) => a.monthYear.localeCompare(b.monthYear));

    // Determine y-axis min and max
    const yAxisMin3 = Math.min(-closedMax3, -mergedMax3);
    const yAxisMax3 = Math.max(0, Math.max(...trendData3.map(data => data.Open)));

    // Sort data by monthYear in ascending order
    const sortedData3 = transformedData3.sort((a, b) => a.monthYear.localeCompare(b.monthYear));
    const sortedTrendData3 = trendData3.sort((a, b) => a.monthYear.localeCompare(b.monthYear));
// Assuming sortedTrendData, sortedTrendData2, sortedTrendData3 are your datasets
const combinedData = [
  ...sortedTrendData.map(item => ({ ...item, category: 'EIPs' })),
  ...sortedTrendData2.map(item => ({ ...item, category: 'ERCs' })),
  ...sortedTrendData3.map(item => ({ ...item, category: 'RIPs' })),
];


const config = {
    data: combinedData, // Use the combined data
    xField: 'monthYear', // x-axis field
    yField: 'Open', // y-axis field (the values to plot)
    seriesField: 'category', // Field to differentiate lines
    geometryOptions: [
      {
          geometry: 'line',
          smooth: true,
          lineStyle: {
              stroke: "#ff00ff", // Magenta color for Trend 1
              lineWidth: 2,
          },
          tooltip: {
              fields: ['monthYear', 'Open'],
              formatter: ({ monthYear, Open }: { monthYear: string; Open: number }) => ({
                  name: 'Open PRs & Issues (EIPs)',
                  value: `${Open}`,
              }),
          }
      },
      {
          geometry: 'line',
          smooth: true,
          lineStyle: {
              stroke: "#2196F3", // Blue color for Trend 2
              lineWidth: 2,
          },
          tooltip: {
              fields: ['monthYear', 'Open'],
              formatter: ({ monthYear, Open }: { monthYear: string; Open: number }) => ({
                  name: 'Open PRs & Issues (ERCs)',
                  value: `${Open}`,
              }),
          }
      },
      {
          geometry: 'line',
          smooth: true,
          lineStyle: {
              stroke: "#4caf50", // Green color for Trend 3
              lineWidth: 2,
          },
          tooltip: {
              fields: ['monthYear', 'Open'],
              formatter: ({ monthYear, Open }: { monthYear: string; Open: number }) => ({
                  name: 'Open PRs & Issues (RIPs)',
                  value: `${Open}`,
              }),
          }
      },
  ]
,  
  
    legend: { position: 'top-right' as const },
};

// Render the Line chart component with the configuration
return <Line {...config} />;

  }  



  return (
       
      <>
      <LI href="/Analytics">
        <Box padding={"1rem"} borderRadius={"0.55rem"}>
        {loading ? (
          <Flex 
          justifyContent="center" // Center horizontally
          alignItems="center" // Center vertically
          height="100%" // Ensure it takes the full height
          marginTop="10rem"
        >
          <Spinner size="lg" /> {/* Centered Spinner */}
        </Flex>
        ) : (
            renderChart()
          )}
        </Box>
      </LI>
      </>
   
  );
  
};

export default InsightsOpenPrsIssues;