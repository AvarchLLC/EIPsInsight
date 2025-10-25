import React, { useState, useEffect, useLayoutEffect } from 'react';
import dynamic from 'next/dynamic';
import {
  Box, Flex, Spinner, Select, Heading, IconButton, Collapse, Checkbox, HStack,
  Button, Menu, MenuButton, MenuList, MenuItem, Table, Thead, Tbody, Tr, Th, Td, Text, useColorModeValue,
  Tooltip, Link, VStack, Badge, Avatar, Grid
} from '@chakra-ui/react';
import { ChevronDownIcon, ChevronUpIcon, DownloadIcon } from '@chakra-ui/icons';
import { FiFilter } from 'react-icons/fi';
import { AiOutlineClose } from 'react-icons/ai';
import axios from 'axios';
import dayjs from 'dayjs';
import { CSVLink } from 'react-csv';
import AllLayout from '@/components/Layout';
import LoaderComponent from '@/components/Loader';
import DateTime from '@/components/DateTime';
import Comments from '@/components/comments';
import CopyLink from '@/components/CopyLink';
import LastUpdatedDateTime from '@/components/LastUpdatedDateTime';
import EtherWorldAdCard from '@/components/EtherWorldAdCard';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';

// Import new components
import FAQSection from '../../components/reviewers/FAQSection';
import LeaderboardGrid from '../../components/reviewers/LeaderboardGrid';
import ReviewActivityTimeline from '../../components/reviewers/ReviewActivityTimeline';
import ActiveEditorsChart from '../../components/reviewers/ActiveEditorsChart';
import ReviewerCard from '../../components/reviewers/ReviewerCard';
import EditorRepoGrid from '../../components/reviewers/EditorRepoGrid';
import * as helpers from '../../utils/helpers';


// Dynamic import for Ant Design's Column chart
const Column = dynamic(() => import("@ant-design/plots").then(mod => mod.Column), { ssr: false });
const Bar = dynamic(() => import("@ant-design/plots").then(mod => mod.Bar), { ssr: false });
const Line = dynamic(() => import("@ant-design/plots").then(mod => mod.Line), { ssr: false });
const Scatter = dynamic(() => import("@ant-design/plots").then(mod => mod.Scatter), { ssr: false });



const API_ENDPOINTS = {
  eips: '/api/editorsprseips',
  ercs: '/api/editorsprsercs',
  rips: '/api/editorsprsrips'
};

const active_endpoints={
  eips: '/api/activeeditorsprseips',
  ercs: '/api/activeeditorsprsercs',
  rips: '/api/activeeditorsprsrips',
  all: '/api/activeeditorsprsall'
}

type ShowReviewerType = { [key: string]: boolean }; 

const ReviewTracker = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<any[]>([]);
  const [chart1data, setchart1Data] = useState<any[]>([]);
  const [eipdata, seteipData] = useState<any[]>([]);
  const [ercdata, setercData] = useState<any[]>([]);
  const [ripdata, setripData] = useState<any[]>([]);
  const [downloaddata, setdownloadData] = useState<any[]>([]);
  // const [showReviewer, setShowReviewer] = useState<{ [key: string]: boolean }>({});
  const [showReviewer, setShowReviewer] = useState<ShowReviewerType>({});
  const [reviewers, setReviewers] = useState<string[]>([]);
  const [editors, seteditors] = useState<string[]>([]);
  const [reviewerData, setReviewerData] = useState<any[]>([]);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [showFilters2, setShowFilters2] = useState<boolean>(false);
  const [selectedStartYear, setSelectedStartYear] = useState<string | null>(null);
  const [selectedStartMonth, setSelectedStartMonth] = useState<string | null>(null);
  const [selectedEndYear, setSelectedEndYear] = useState<string | null>(null);
  const [selectedEndMonth, setSelectedEndMonth] = useState<string | null>(null);
  const [selectedStartYear2, setSelectedStartYear2] = useState<string>("2015");
  const [selectedStartMonth2, setSelectedStartMonth2] = useState<string>("01");
  const [selectedEndYear2, setSelectedEndYear2] = useState<string>(new Date().getFullYear().toString());
  const [selectedEndMonth2, setSelectedEndMonth2] = useState<string>(
    String(new Date().getMonth() + 1).padStart(2, "0")
  );
  const [activeTab, setActiveTab] = useState<'eips' | 'ercs' | 'rips' |'all'>('all');
  const [csvData, setCsvData] = useState<any[]>([]); // State for storing CSV data
  const [show, setShow] = useState(false);
  const bg = useColorModeValue("#f6f6f7", "#171923");
  const [sliderValue, setSliderValue] = useState<number>(0);
  const [sliderValue2, setSliderValue2] = useState<[number, number]>([0, 1]);
  const [sliderValue3, setSliderValue3] = useState<number>(0);
  const [sliderValue4, setSliderValue4] = useState<number>(0);
  const [Linechart, setLinechart] = useState<boolean>(true);
  const [loading4, setLoading4] = useState<boolean>(false);
  const [expandedCards, setExpandedCards] = useState<{ [key: string]: boolean }>({});

  const years = Array.from({ length: 2025 - 2015 + 1 }, (_, i) => (2025 - i).toString());
  const months = [
    { name: 'Jan', value: '01' },
    { name: 'Feb', value: '02' },
    { name: 'Mar', value: '03' },
    { name: 'Apr', value: '04' },
    { name: 'May', value: '05' },
    { name: 'Jun', value: '06' },
    { name: 'Jul', value: '07' },
    { name: 'Aug', value: '08' },
    { name: 'Sep', value: '09' },
    { name: 'Oct', value: '10' },
    { name: 'Nov', value: '11' },
    { name: 'Dec', value: '12' },
  ];

  const handleFilterData = () => {
    const currentYear = new Date().getFullYear();
    const currentMonth = String(new Date().getMonth() + 1).padStart(2, "0");

    // Set default values for start and end dates
    const startDate = `${selectedStartYear || "2015"}-${selectedStartMonth || "01"}`;
    const endDate = `${selectedEndYear || currentYear}-${selectedEndMonth || currentMonth}`;

    // Filter only if start or end date is provided
    if (startDate && endDate) {
        const filteredData = chart1data?.filter((item) => {
            const itemDate = item.monthYear; // Assuming monthYear is in "YYYY-MM" format
            return itemDate >= startDate && itemDate <= endDate;
        });

        // console.log("Filtered Data:", filteredData);
        return filteredData;
    }

    // Return all data if no filters are applied
    return chart1data;
};


  const toggleCollapse = () => setShow(!show);

  const [showThumbs, setShowThumbs] = useState(false);

  const fetchReviewers = async (): Promise<string[]> => {
    try {
      const response = await fetch(
        "https://raw.githubusercontent.com/ethereum/EIPs/master/config/eip-editors.yml"
      );
      const text = await response.text();
  
      // Match unique reviewers using a regex to handle YAML structure
      const matches = text.match(/-\s(\w+)/g);
      const reviewers = matches ? Array.from(new Set(matches?.map((m) => m.slice(2)))) : [];
      const additionalReviewers = ["nalepae","SkandaBhat","advaita-saha","jochem-brouwer","Marchhill","bomanaps","daniellehrner","CarlBeek","nconsigny","yoavw", "adietrichs"];

      // Merge the two arrays and ensure uniqueness
      const updatedReviewers = Array.from(new Set([...reviewers, ...additionalReviewers]));

      console.log("updated reviewers:", updatedReviewers);

      return updatedReviewers;
    } catch (error) {
      console.error("Error fetching reviewers:", error);
      return [];
    }
  };

  

  useEffect(() => {
    fetchReviewers().then((uniqueReviewers) => {
      setReviewers(uniqueReviewers);
      const initialShowReviewer = uniqueReviewers?.reduce(
        (acc, reviewer) => ({ ...acc, [reviewer]: false }),
        {} as ShowReviewerType
      );
      setShowReviewer(initialShowReviewer);
    });
  }, []);

  const selectAllReviewers = () => {
    const updatedReviewers = Object.keys(showReviewer)?.reduce(
      (acc, reviewer) => ({ ...acc, [reviewer]: true }),
      {} as ShowReviewerType
    );
    setShowReviewer(updatedReviewers);
  };

  // Function to deselect all reviewers
  const deselectAllReviewers = () => {
    const updatedReviewers = Object.keys(showReviewer)?.reduce(
      (acc, reviewer) => ({ ...acc, [reviewer]: false }),
      {} as ShowReviewerType
    );
    setShowReviewer(updatedReviewers);
  };

  // Function to select only the active reviewers from the list selectEmeritusReviewers
  const selectActiveReviewers = () => {
    const reviewers3=[ "lightclient", "SamWilsn", "xinbenlv", "g11tech","CarlBeek","nconsigny","yoavw", "adietrichs"];
    const updatedReviewers = Object.keys(showReviewer)?.reduce((acc, reviewer) => {
      acc[reviewer] = reviewers3.includes(reviewer);
      return acc;
    }, {} as ShowReviewerType);
  
    setShowReviewer(updatedReviewers);
  };

  const selectEmeritusReviewers = () => {
    const reviewers3=["axic", "gcolvin", "lightclient", "SamWilsn", "xinbenlv", "g11tech", "cdetrio", "Pandapip1", "Souptacular", "wanderer", "MicahZoltu"];
    const updatedReviewers = Object.keys(showReviewer)?.reduce((acc, reviewer) => {
      acc[reviewer] = reviewers3.includes(reviewer);
      return acc;
    }, {} as ShowReviewerType);
  
    setShowReviewer(updatedReviewers);
  };

  const selectReviewers = () => {
    const reviewers2= ["nalepae","SkandaBhat","advaita-saha","jochem-brouwer","Marchhill","bomanaps","daniellehrner"]
    const updatedReviewers = Object.keys(showReviewer)?.reduce((acc, reviewer) => {
      acc[reviewer] = reviewers2.includes(reviewer);
      return acc;
    }, {} as ShowReviewerType);
  
    setShowReviewer(updatedReviewers);
  };
  
  


  // Function to generate CSV data
  type PR = {
    repo:string;
    prNumber: number;
    reviewer:string;
    prTitle: string;
    reviewDate?: string;
    created_at?: string;
    closed_at?: string;
    merged_at?: string;
  };

  interface ColorsMap {
    [key: string]: string;
  }


  




  useEffect(() => {
    const fetchAndSetReviewers = async () => {
      const reviewersList = await fetchReviewers();
      seteditors(reviewersList); // Set the fetched reviewers list
      setLoading(false); // Set loading to false once data is fetched
    };

    fetchAndSetReviewers();
  }, []);
  
  
  

  const generateCSVData = () => {
    if (!selectedYear || !selectedMonth) {
      console.error('Year and Month must be selected to generate CSV');
      return;
    }

    // console.log(data)
  
    const filteredData = data
  
    const csv = data?.map((pr: PR) => ({
        Repo: pr.repo,
        PR_Number: pr.prNumber,
        Title: pr.prTitle,
        Reviewer: pr.reviewer,
        Review_Date: pr.reviewDate ? new Date(pr.reviewDate).toLocaleDateString() : '-',
        Created_Date: pr.created_at ? new Date(pr.created_at).toLocaleDateString() : '-',
        Closed_Date: pr.closed_at ? new Date(pr.closed_at).toLocaleDateString() : '-',
        Merged_Date: pr.merged_at ? new Date(pr.merged_at).toLocaleDateString() : '-',
        Status: pr.merged_at ? 'Merged' : pr.closed_at ? 'Closed' : 'Open',
        Link: `https://github.com/ethereum/${pr.repo}/pull/${pr.prNumber}`,
      }))
    ;
  
    setCsvData(csv); 
  };

  const reviewersList = ["nalepae", "SkandaBhat", "advaita-saha", "jochem-brouwer", "Marchhill", "bomanaps","daniellehrner"];

  const generateCSVData11 = () => {
    if (!selectedYear || !selectedMonth) {
      console.error('Year and Month must be selected to generate CSV');
      return;
    }

    // console.log(data)
  
    const filteredData = data?.filter((pr: PR) => reviewersList.includes(pr.reviewer));
  
    const csv = filteredData?.map((pr: PR) => ({
        Repo: pr.repo,
        PR_Number: pr.prNumber,
        Title: pr.prTitle,
        Reviewer: pr.reviewer,
        Review_Date: pr.reviewDate ? new Date(pr.reviewDate).toLocaleDateString() : '-',
        Created_Date: pr.created_at ? new Date(pr.created_at).toLocaleDateString() : '-',
        Closed_Date: pr.closed_at ? new Date(pr.closed_at).toLocaleDateString() : '-',
        Merged_Date: pr.merged_at ? new Date(pr.merged_at).toLocaleDateString() : '-',
        Status: pr.merged_at ? 'Merged' : pr.closed_at ? 'Closed' : 'Open',
        Link: `https://github.com/ethereum/${pr.repo}/pull/${pr.prNumber}`,
      }))
    ;
  
    setCsvData(csv); 
  };

  const generateCSVData12 = () => {
    if (!selectedYear || !selectedMonth) {
      console.error('Year and Month must be selected to generate CSV');
      return;
    }

    // console.log(data)
  
    const filteredData = data?.filter((pr: PR) => !reviewersList.includes(pr.reviewer));
  
    const csv = filteredData?.map((pr: PR) => ({
        Repo: pr.repo,
        PR_Number: pr.prNumber,
        Title: pr.prTitle,
        Reviewer: pr.reviewer,
        Review_Date: pr.reviewDate ? new Date(pr.reviewDate).toLocaleDateString() : '-',
        Created_Date: pr.created_at ? new Date(pr.created_at).toLocaleDateString() : '-',
        Closed_Date: pr.closed_at ? new Date(pr.closed_at).toLocaleDateString() : '-',
        Merged_Date: pr.merged_at ? new Date(pr.merged_at).toLocaleDateString() : '-',
        Status: pr.merged_at ? 'Merged' : pr.closed_at ? 'Closed' : 'Open',
        Link: `https://github.com/ethereum/${pr.repo}/pull/${pr.prNumber}`,
      }))
    ;
  
    setCsvData(csv); 
  };

 


const generateCSVData9 = () => {
  // Filter data for reviewers only
  const filteredData = downloaddata?.filter((pr: PR) => reviewersList.includes(pr.reviewer));

  const csv = filteredData?.map((pr: PR) => ({
    Repo: pr.repo,
    PR_Number: pr.prNumber,
    Title: pr.prTitle,
    Reviewer: pr.reviewer,
    Review_Date: pr.reviewDate ? new Date(pr.reviewDate).toLocaleDateString() : '-',
    Created_Date: pr.created_at ? new Date(pr.created_at).toLocaleDateString() : '-',
    Closed_Date: pr.closed_at ? new Date(pr.closed_at).toLocaleDateString() : '-',
    Merged_Date: pr.merged_at ? new Date(pr.merged_at).toLocaleDateString() : '-',
    Status: pr.merged_at ? 'Merged' : pr.closed_at ? 'Closed' : 'Open',
    Link: `https://github.com/ethereum/${pr.repo}/pull/${pr.prNumber}`,
  }));

  setCsvData(csv); // Set the CSV data for reviewers
};

const generateCSVData10 = () => {
  // Filter data for editors only (exclude reviewers)
  const filteredData = downloaddata?.filter((pr: PR) => !reviewersList.includes(pr.reviewer));

  const csv = filteredData?.map((pr: PR) => ({
    Repo: pr.repo,
    PR_Number: pr.prNumber,
    Title: pr.prTitle,
    Reviewer: pr.reviewer,
    Review_Date: pr.reviewDate ? new Date(pr.reviewDate).toLocaleDateString() : '-',
    Created_Date: pr.created_at ? new Date(pr.created_at).toLocaleDateString() : '-',
    Closed_Date: pr.closed_at ? new Date(pr.closed_at).toLocaleDateString() : '-',
    Merged_Date: pr.merged_at ? new Date(pr.merged_at).toLocaleDateString() : '-',
    Status: pr.merged_at ? 'Merged' : pr.closed_at ? 'Closed' : 'Open',
    Link: `https://github.com/ethereum/${pr.repo}/pull/${pr.prNumber}`,
  }));

  setCsvData(csv); // Set the CSV data for editors
};

const generateCSVData5 = () => {

  // console.log("selected start:",selectedStartYear);
  // console.log("selected start month:",selectedStartMonth);
  const currentYear = new Date().getFullYear();
    const currentMonth = String(new Date().getMonth() + 1).padStart(2, "0");
  const startYear = selectedStartYear || "2015";
  const startMonth=selectedStartMonth || "01";
  const endYear = selectedEndYear || currentYear;
  const endMonth =selectedEndMonth || currentMonth;

  if (startYear && startMonth && endYear && endMonth) {
    // Construct start and end dates in ISO format
    const startDate = new Date(`${startYear}-${startMonth}-01T00:00:00Z`);
    const endDate = new Date(
      `${endYear}-${endMonth}-01T00:00:00Z`
    );

    // console.log("start date:", startDate);
    // console.log("end date:",endDate);

    // Adjust end date to include the entire month
    endDate.setMonth(endDate.getMonth() + 1);
    endDate.setDate(0); // Last day of the month

    // console.log("download data 5:", downloaddata)

    const filteredData = downloaddata?.filter((pr) => {
      const reviewDate = pr.reviewDate ? new Date(pr.reviewDate) : null;
      const shouldIncludeReviewer = pr.reviewer && showReviewer[pr.reviewer];
      return (
        shouldIncludeReviewer &&
        reviewDate &&
        reviewDate >= startDate &&
        reviewDate <= endDate
      );
    });
    // console.log("Filtered Data 5:", filteredData);

    const csv = filteredData?.map((pr: PR) => ({
      Repo: pr.repo,
      PR_Number: pr.prNumber,
      Title: pr.prTitle,
      Reviewer: pr.reviewer,
      Review_Date: pr.reviewDate ? new Date(pr.reviewDate).toLocaleDateString() : '-',
      Created_Date: pr.created_at ? new Date(pr.created_at).toLocaleDateString() : '-',
      Closed_Date: pr.closed_at ? new Date(pr.closed_at).toLocaleDateString() : '-',
      Merged_Date: pr.merged_at ? new Date(pr.merged_at).toLocaleDateString() : '-',
      Status: pr.merged_at ? 'Merged' : pr.closed_at ? 'Closed' : 'Open',
      Link: `https://github.com/ethereum/${pr.repo}/pull/${pr.prNumber}`,
    }))
  ;

    setCsvData(csv);
  // setLoading3(false);
}
else{
  const filteredData =downloaddata

  const csv = filteredData?.map((pr: PR) => ({
    PR_Number: pr.prNumber,
    Title: pr.prTitle,
    Reviewer: pr.reviewer,
    Review_Date: pr.reviewDate ? new Date(pr.reviewDate).toLocaleDateString() : '-',
    Created_Date: pr.created_at ? new Date(pr.created_at).toLocaleDateString() : '-',
    Closed_Date: pr.closed_at ? new Date(pr.closed_at).toLocaleDateString() : '-',
    Merged_Date: pr.merged_at ? new Date(pr.merged_at).toLocaleDateString() : '-',
    Status: pr.merged_at ? 'Merged' : pr.closed_at ? 'Closed' : 'Open',
    Link: `https://github.com/ethereum/${pr.repo}/pull/${pr.prNumber}`,
  }));

  setCsvData(csv); 
}

};

const generateCSVData3 = (reviewer: string) => {
  // setLoading3(true);

  // Construct the start and end dates if the year and month are selected
  if (selectedStartYear && selectedStartMonth && selectedEndYear && selectedEndMonth) {
    const startDate = new Date(`${selectedStartYear}-${selectedStartMonth}-01T00:00:00Z`);
    const endDate = new Date(`${selectedEndYear}-${selectedEndMonth}-01T00:00:00Z`);

    // Adjust end date to include the entire month
    endDate.setMonth(endDate.getMonth() + 1);
    endDate.setDate(0); // Last day of the month

    // Filter the data based on review date and reviewer
    const filteredData = downloaddata?.filter((pr) => {
      const reviewDate = pr.reviewDate ? new Date(pr.reviewDate) : null;
      return (
        reviewDate &&
        reviewDate >= startDate &&
        reviewDate <= endDate &&
        (reviewer ? pr.reviewer === reviewer : true) // Filter by reviewer if provided
      );
    });

    // Map the filtered data to CSV format
    const csv = filteredData?.map((pr: PR) => ({
      Repo: pr.repo,
      PR_Number: pr.prNumber,
      Title: pr.prTitle,
      Reviewer: pr.reviewer,
      Review_Date: pr.reviewDate ? new Date(pr.reviewDate).toLocaleDateString() : '-',
      Created_Date: pr.created_at ? new Date(pr.created_at).toLocaleDateString() : '-',
      Closed_Date: pr.closed_at ? new Date(pr.closed_at).toLocaleDateString() : '-',
      Merged_Date: pr.merged_at ? new Date(pr.merged_at).toLocaleDateString() : '-',
      Status: pr.merged_at ? 'Merged' : pr.closed_at ? 'Closed' : 'Open',
      Link: `https://github.com/ethereum/${pr.repo}/pull/${pr.prNumber}`,
    }));

    setCsvData(csv);
  } else {
    // If no date range is selected, use all data and filter by reviewer if provided
    const filteredData = downloaddata?.filter((pr) => 
      reviewer ? pr.reviewer === reviewer : true // Filter by reviewer if provided
    );

    const csv = filteredData?.map((pr: PR) => ({
      PR_Number: pr.prNumber,
      Title: pr.prTitle,
      Reviewer: pr.reviewer,
      Review_Date: pr.reviewDate ? new Date(pr.reviewDate).toLocaleDateString() : '-',
      Created_Date: pr.created_at ? new Date(pr.created_at).toLocaleDateString() : '-',
      Closed_Date: pr.closed_at ? new Date(pr.closed_at).toLocaleDateString() : '-',
      Merged_Date: pr.merged_at ? new Date(pr.merged_at).toLocaleDateString() : '-',
      Status: pr.merged_at ? 'Merged' : pr.closed_at ? 'Closed' : 'Open',
      Link: `https://github.com/ethereum/${pr.repo}/pull/${pr.prNumber}`,
    }));

    setCsvData(csv);
  }

  // setLoading3(false);
};


  useEffect(() => {
    fetchData();
    resetReviewerList(); // Reset reviewers when switching tabs
  }, [activeTab]); // Fetch data and reset reviewers when the active tab changes
  
  const resetReviewerList = () => {
    setShowReviewer({}); // Clear previous reviewers list when switching tabs
  };
  
  const flattenResponse = (response: Record<string, any[]>) => {
    return Object.entries(response).flatMap(([reviewer, reviews]) =>
      reviews?.map(review => ({ ...review, reviewer }))
    );
  };
  
  
  
  
  const fetchData = async () => {
    setLoading(true);
    try {

      const endpoint =`/api/ReviewersCharts/chart/${activeTab.toLowerCase()}`

      const response = await fetch(endpoint); // Replace with your API endpoint
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const formattedData: { monthYear: string; reviewer: string; count: number }[] = await response.json();
      // console.log(formattedData);
    
      // Extract unique reviewers from the formattedData
      // const reviewers = Array.from(new Set(formattedData?.map(review => review.reviewer)));

      // console.log("reviewers:",reviewers);
      // const githubHandles = await fetchReviewers();
      const githubHandles = ["axic", "gcolvin", "lightclient", "SamWilsn", "xinbenlv", "g11tech", "cdetrio", "Pandapip1", "Souptacular", "wanderer", "MicahZoltu","nalepae","SkandaBhat","advaita-saha","jochem-brouwer","Marchhill","bomanaps","daniellehrner","CarlBeek","nconsigny","yoavw", "adietrichs"];
      const githubHandles2 = await fetchReviewers();
      // console.log("active:",activereviewers);
      
      // // Create the initial state for showing reviewers (set all to true by default)
      const initialShowReviewer = githubHandles?.reduce(
        (acc, reviewer) => ({ ...acc, [reviewer]: true }), 
        {}
      );
      const updatedReviewers = Object.keys(initialShowReviewer)?.reduce((acc, reviewer) => {
        acc[reviewer] = githubHandles2.includes(reviewer);
        return acc;
      }, {} as ShowReviewerType);
    
      setShowReviewer(updatedReviewers);
      console.log("initial reviewers:",initialShowReviewer)
  
      // setShowReviewer(initialShowReviewer);

      

      // selectActiveReviewers();

      
      
      // const activereviewers = await fetchReviewers();
      // console.log("active:",activereviewers);

     
      setchart1Data(formattedData);
    } catch (error) {
      console.error("Error during data fetch:", error);
    } finally {
      setLoading(false); // Ensure loading state is set to false in all cases
    }
  };
  
  

  
  

// Define types for clarity
interface ReviewData {
  monthYear: string;
  reviewer: string;
  count: number;
  PRs: any[];
}

type GroupedData = {
  [monthYear: string]: {
    [reviewer: string]: ReviewData;
  };
};

interface PRData {
  monthYear: string;
  reviewer: string; 
  count: number ;
}



// getYearlyData moved to helpers


// Function to filter PR data for the selected month and year
const getMonthlyData = (data: PRData[], year: string | null, month: string) => {
  const monthlyData: Record<string, number> = data
    ?.filter(item => item.monthYear === `${year}-${month.padStart(2, '0')}`)  // Filter by year and month
    ?.reduce((acc, item) => {
      // Only count if the reviewer is shown
      if (showReviewer[item.reviewer]) {
        acc[item.reviewer] = (acc[item.reviewer] || 0) + item.count;  // Accumulate the count
      }
      return acc;
    }, {} as Record<string, number>);

  // Sort reviewers by count in decreasing order
  const sortedMonthlyData = Object.entries(monthlyData)
    .sort(([, a], [, b]) => b - a)  // Sort by count in decreasing order
    ?.reduce((acc, [reviewer, count]) => {
      acc[reviewer] = count;
      return acc;
    }, {} as Record<string, number>);

  // console.log("Year:", year, "Month:", month, "Sorted Data:", sortedMonthlyData);
  return sortedMonthlyData;
};

// formatChartData moved to helpers

// Function to configure the Bar chart
// Initialize a global or shared map for reviewer colors
const reviewerColorsMap: Record<string, string> = {};

// Define consistent colors for top contributors (highly contrasting)
const topContributorColors: Record<string, string> = {
  'lightclient': '#FF6B6B',      // Bright red
  'SamWilsn': '#4ECDC4',         // Teal
  'xinbenlv': '#FFD93D',         // Yellow
  'g11tech': '#6C5CE7',          // Purple
  'Pandapip1': '#00D2FF',        // Cyan
  'axic': '#FF8C42',             // Orange
  'MicahZoltu': '#A8E6CF',       // Mint green
};

const getBarChartConfig = (chartData: { reviewer: string; count: number }[]) => {
  // Calculate max value for consistent scaling
  const maxCount = Math.max(...chartData.map(d => d.count));
  const maxScale = Math.ceil(maxCount / 500) * 500; // Round up to nearest 500

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
    xAxis: {
      min: 0,
      max: maxScale,
      tickInterval: 500, // 500-unit intervals
    },
    yAxis: {
      label: {
        formatter: (reviewer: string) => reviewer, // Display reviewer names on Y-axis
      },
    },
    annotations: chartData?.map((datum) => ({
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

const getBarChartConfig2 = (chartData: { reviewer: string; count: number }[]) => {
  // Calculate max value for consistent scaling
  const maxCount = Math.max(...chartData.map(d => d.count));
  const maxScale = Math.ceil(maxCount / 500) * 500; // Round up to nearest 500

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
    xAxis: {
      min: 0,
      max: maxScale,
      tickInterval: 500, // 500-unit intervals
    },
    yAxis: {
      label: {
        formatter: (reviewer: string) => reviewer, // Display reviewer names on Y-axis
      },
    },
    annotations: chartData?.map((datum) => ({
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




const renderCharts = (data: PRData[], selectedYear: string | null, selectedMonth: string | null) => {
  // List of reviewers (others are editors)
  const reviewersList = helpers.REVIEWERS_LIST;

  // Get yearly data and format it
  const yearlyData = helpers.getYearlyData(data, showReviewer);
  const yearlyChartData = helpers.formatChartData(yearlyData);

  // Separate data into reviewers and editors
  const reviewersData = yearlyChartData?.filter((item: any) => reviewersList.includes(item.reviewer));
  const editorsData = yearlyChartData?.filter((item: any) => !reviewersList.includes(item.reviewer));

  return (
    <Box padding={{ base: "1rem", md: "2rem" }}>
      <Flex direction={{ base: "column", md: "row" }} justifyContent="center" gap={{ base: "1rem", md: "2rem" }}>
        {/* Editors Leaderboard Grid */}
        <Box width={{ base: "100%", md: "48%" }}>
          <LeaderboardGrid
            title="Editors - All-Time Contributions"
            data={editorsData}
            csvData={csvData}
            csvFilename="editors_yearly_data.csv"
            onDownloadCSV={async () => {
              try {
                generateCSVData10();
                await axios.post("/api/DownloadCounter");
              } catch (error) {
                console.error("Error triggering download counter:", error);
              }
            }}
            loading={loading3}
            copyLink="https://eipsinsight.com/Editors#Leaderboard"
            barChartConfig={getBarChartConfig(editorsData)}
            isReviewer={false}
          />
          <Box mt={2}>
            <LastUpdatedDateTime name="EditorsTool" />
          </Box>
        </Box>

        {/* Reviewers Leaderboard Grid */}
        <Box width={{ base: "100%", md: "48%" }}>
          <LeaderboardGrid
            title="Reviewers - All-Time Contributions"
            data={reviewersData}
            csvData={csvData}
            csvFilename="reviewers_yearly_data.csv"
            onDownloadCSV={async () => {
              try {
                generateCSVData9();
                await axios.post("/api/DownloadCounter");
              } catch (error) {
                console.error("Error triggering download counter:", error);
              }
            }}
            loading={loading3}
            copyLink="https://eipsinsight.com/Reviewers#Leaderboard"
            barChartConfig={getBarChartConfig2(reviewersData)}
            isReviewer={true}
          />
          <Box mt={2}>
            <LastUpdatedDateTime name="EditorsTool" />
          </Box>
        </Box>
      </Flex>
    </Box>
  );
};


const renderCharts2 = (data: PRData[], selectedYear: string | null, selectedMonth: string | null) => {
  // List of reviewers (others are editors)
  const reviewersList = ["nalepae", "SkandaBhat", "advaita-saha", "jochem-brouwer", "Marchhill","bomanaps", "daniellehrner"];

  let monthlyChartData: any; // Declare monthlyChartData
  if (selectedMonth != null) {
    const monthlyData = getMonthlyData(data, selectedYear, selectedMonth);
    monthlyChartData = helpers.formatChartData(monthlyData); // Assign to the declared variable
  }
  console.log("chartdata1: ", monthlyChartData);

  // Separate data into reviewers and editors
  const reviewersData = monthlyChartData?.filter((item: any) => reviewersList.includes(item.reviewer));
  const editorsData = monthlyChartData?.filter((item: any) => !reviewersList.includes(item.reviewer));

  return (
    <Box padding="2rem">
      {selectedYear && selectedMonth && monthlyChartData && ( // Check if monthlyChartData is defined
        <Flex direction={{ base: "column", md: "row" }} justifyContent="center" gap="2rem">
          {/* Editors Chart */}
          <Box width={{ base: "100%", md: "45%" }} padding="1rem">
            <Flex justifyContent="space-between" alignItems="center" marginBottom="0.5rem">

              <Heading size="md" color="black">
                {`Editors - Monthly Review Activity`}
              </Heading>
              <CSVLink
                data={csvData?.length ? csvData : []}
                filename={`editors_${selectedYear}_${selectedMonth}.csv`}
                onClick={async () => {
                  try {
                    generateCSVData12();
                    await axios.post("/api/DownloadCounter");
                  } catch (error) {
                    console.error("Error triggering download counter:", error);
                  }
                }}
              >
                <Button colorScheme="blue" fontSize={{ base: "0.6rem", md: "md" }}>
                  {loading3 ? <Spinner size="sm" /> : "Download CSV"}
                </Button>
              </CSVLink>
            </Flex>
            <br />
            <Bar {...getBarChartConfig(editorsData)} />
          </Box>
          {/* Reviewers Chart */}
          <Box width={{ base: "100%", md: "45%" }} padding="1rem">
            <Flex justifyContent="space-between" alignItems="center" marginBottom="0.5rem">
              <Heading size="md" color="black">
                {`Contributors - Monthly Review Activity`}
              </Heading>
              <CSVLink
                data={csvData?.length ? csvData : []} 
                filename={`reviewers_${selectedYear}_${selectedMonth}.csv`}
                onClick={async () => {
                  try {
                    generateCSVData11();
                    await axios.post("/api/DownloadCounter");
                  } catch (error) {
                    console.error("Error triggering download counter:", error);
                  }
                }}
              >
                <Button colorScheme="blue" fontSize={{ base: "0.6rem", md: "md" }}>
                  {loading3 ? <Spinner size="sm" /> : "Download CSV"}
                </Button>
              </CSVLink>
            </Flex>
            <br />
            <Bar {...getBarChartConfig(reviewersData)} />
          </Box>

          
        </Flex>
      )}
    </Box>
  );
};


// transformAndGroupData moved to helpers

type ReviewDatum = {
  monthYear: string;
  count: number;
  reviewer: string;
};

const renderChart = () => {
  const dataToUse = handleFilterData(); // Assuming 'data' is accessible in the scope
  // console.log("data to use:",dataToUse)
  const filteredData = dataToUse?.filter(item =>
    Object.keys(showReviewer) // Get the list of reviewers from showReviewer
      ?.filter(reviewer => showReviewer[reviewer]) // Only include checked reviewers
      .includes(item.reviewer) // Check if the item reviewer is in the list of checked reviewers
  );

  const generateDistinctColor = (index: number, total: number) => {
    const hue = (index * (360 / total)) % 360;  // Golden angle for better color distribution
    return `hsl(${hue}, 85%, 50%)`; // High saturation and medium brightness for vibrancy
  };

  // Assign colors if not already assigned
  const reviewers = Array.from(new Set(filteredData?.map(item => item.reviewer)));
  const totalReviewers = reviewers?.length;
  filteredData?.forEach((item, index) => {
    if (!reviewerColorsMap[item.reviewer]) {
      // Use predefined color for top contributors, otherwise generate distinct color
      if (topContributorColors[item.reviewer]) {
        reviewerColorsMap[item.reviewer] = topContributorColors[item.reviewer];
      } else {
        reviewerColorsMap[item.reviewer] = generateDistinctColor(Object.keys(reviewerColorsMap)?.length, totalReviewers);
      }
    }
  });
  // console.log("filtered data:", filteredData);
  // Transform and group the filtered data based on your business logic
  const transformedData = helpers.transformAndGroupData(filteredData);
  // console.log(transformedData);

  // Sort the transformed data by monthYear
  const sortedData = transformedData.sort((a, b) => a.monthYear.localeCompare(b.monthYear));

  // console.log("sorted data:", sortedData);

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
      start: sliderValue, // Set the start value from the state
      end: 1, // End of the slider
      step: 0.01, // Define the step value for the slider
      min: 0, // Minimum value for the slider
      max: 1, // Maximum value for the slider
      onChange: (value:any) => {
        setSliderValue(value); // Update state when slider value changes
      },
      // Optionally handle when sliding stops
      onAfterChange: (value:any) => {
        // Perform any additional actions after the slider is changed
        // console.log('Slider moved to:', value);
      },
    },
    legend: { position: "top-right" as const }, // Legend position
    smooth: true, // Smooth transition
  };

  // Render the Column chart with the provided config
  return <Column {...config} />;
};


const renderChart4 = () => {
  const dataToUse = handleFilterData(); // Assuming 'data' is accessible in the scope
  // console.log("data to use:", dataToUse);

  const filteredData = dataToUse?.filter(item =>
    Object.keys(showReviewer) // Get the list of reviewers from showReviewer
      ?.filter(reviewer => showReviewer[reviewer]) // Only include checked reviewers
      .includes(item.reviewer) // Check if the item reviewer is in the list of checked reviewers
  );

  const generateDistinctColor = (index: number, total: number) => {
    const hue = (index * (360 / total)) % 360;  // Golden angle for better color distribution
    return `hsl(${hue}, 85%, 50%)`; // High saturation and medium brightness for vibrancy
  };

  // Assign colors if not already assigned
  const reviewers = Array.from(new Set(filteredData?.map(item => item.reviewer)));
  const totalReviewers = reviewers?.length;
  filteredData?.forEach((item, index) => {
    if (!reviewerColorsMap[item.reviewer]) {
      // Use predefined color for top contributors, otherwise generate distinct color
      if (topContributorColors[item.reviewer]) {
        reviewerColorsMap[item.reviewer] = topContributorColors[item.reviewer];
      } else {
        reviewerColorsMap[item.reviewer] = generateDistinctColor(Object.keys(reviewerColorsMap)?.length, totalReviewers);
      }
    }
  });

  // console.log("filtered data:", filteredData);

  // Transform and group the filtered data based on your business logic
  const transformedData = helpers.transformAndGroupData(filteredData);

  // Sort the transformed data by monthYear
  const sortedData = transformedData.sort((a, b) => a.monthYear.localeCompare(b.monthYear));

  // console.log("sorted data:", sortedData);

  // Chart configuration for Line Chart
  const config = {
    data: sortedData as ReviewDatum[], // Ensure sortedData matches the expected type
    xField: "monthYear", // X-axis field
    yField: "count", // Y-axis field
    seriesField: "reviewer", // Field for series grouping
    color: (datum: any) => reviewerColorsMap[(datum as ReviewDatum).reviewer], // Typecast datum to ReviewDatum
    lineStyle: {
      lineWidth: 2, // Line width
    },
    slider: {
      start: sliderValue, // Set the start value from the state
      end: 1, // End of the slider
      step: 0.01, // Define the step value for the slider
      min: 0, // Minimum value for the slider
      max: 1, // Maximum value for the slider
      onChange: (value: any) => {
        setSliderValue(value); // Update state when slider value changes
      },
      // Optionally handle when sliding stops
      onAfterChange: (value: any) => {
        // console.log("Slider moved to:", value);
      },
    },
    legend: { position: "top-right" as const }, // Legend position
  };

  // Render the Line chart with the provided config
  return <Line {...config} />;
};


const renderCharts3 = (reviewsdata: PRData[]) => {
  const dataToUse = handleFilterData();
  const filteredData = dataToUse?.filter(item =>
    Object.keys(showReviewer)
      ?.filter(reviewer => showReviewer[reviewer])
      .includes(item.reviewer)
  );

  const yearlyData = helpers.getYearlyData(reviewsdata, showReviewer);
  const yearlyChartData = helpers.formatChartData(yearlyData);
  const reviewersList = helpers.REVIEWERS_LIST;

  const completeXAxisRange = helpers.generateMonthYearRange("2019-05", dayjs().format("YYYY-MM"));

  // Assign colors to reviewers
  const reviewers = Array.from(new Set(filteredData?.map(item => item.reviewer)));
  const totalReviewers = reviewers?.length;
  filteredData?.forEach((item, index) => {
    if (!reviewerColorsMap[item.reviewer]) {
      if (topContributorColors[item.reviewer]) {
        reviewerColorsMap[item.reviewer] = topContributorColors[item.reviewer];
      } else {
        reviewerColorsMap[item.reviewer] = `hsl(${(index * (360 / totalReviewers)) % 360}, 85%, 50%)`;
      }
    }
  });

  const filledData = reviewers.flatMap((reviewer) => {
    const reviewerData = filteredData?.filter((item) => item.reviewer === reviewer);
    const dataMap = new Map(reviewerData?.map((item) => [item.monthYear, item]));

    return completeXAxisRange?.map((monthYear) => ({
      monthYear,
      reviewer,
      count: dataMap.get(monthYear)?.count || 0,
    }));
  });

  const editorsData = filledData?.filter(item => !reviewersList.includes(item.reviewer));
  const reviewersData = filledData?.filter(item => reviewersList.includes(item.reviewer));

  const getReviewerCount = (name: string) => {
    const reviewerData = yearlyChartData.find((r) => r.reviewer === name);
    return reviewerData ? reviewerData.count : 0;
  };

  const editorCharts = Array.from(new Set(editorsData?.map(item => item.reviewer)))?.map(reviewer => (
    <ReviewerCard
      key={reviewer}
      reviewer={reviewer}
      count={getReviewerCount(reviewer)}
      data={editorsData?.filter(item => item.reviewer === reviewer)}
      isExpanded={expandedCards[reviewer] || false}
      onToggle={() => setExpandedCards(prev => ({ ...prev, [reviewer]: !prev[reviewer] }))}
      csvData={csvData}
      onGenerateCSV={generateCSVData3}
      loading={loading3}
      reviewerColor={reviewerColorsMap[reviewer]}
      sliderValue={sliderValue2}
      setSliderValue={setSliderValue2}
    />
  ));

  const reviewerCharts = Array.from(new Set(reviewersData?.map(item => item.reviewer)))?.map(reviewer => (
    <ReviewerCard
      key={reviewer}
      reviewer={reviewer}
      count={getReviewerCount(reviewer)}
      data={reviewersData?.filter(item => item.reviewer === reviewer)}
      isExpanded={expandedCards[reviewer] || false}
      onToggle={() => setExpandedCards(prev => ({ ...prev, [reviewer]: !prev[reviewer] }))}
      csvData={csvData}
      onGenerateCSV={generateCSVData3}
      loading={loading3}
      reviewerColor={reviewerColorsMap[reviewer]}
      sliderValue={sliderValue2}
      setSliderValue={setSliderValue2}
    />
  ));

  return (
    <Box>
      <section id="editors">
        <Heading
          as="h3"
          size="lg"
          mb={4}
          fontWeight="bold"
          color={useColorModeValue("#3182CE", "blue.300")}
        >
          Editors
        </Heading>
      </section>
      <Grid
        templateColumns={{ base: "1fr", lg: "repeat(2, 1fr)" }}
        gap={4}
        mb={8}
      >
        {editorCharts}
      </Grid>

      <section id="Reviewers">
        <Heading
          as="h3"
          size="lg"
          mb={4}
          mt={6}
          fontWeight="bold"
          color={useColorModeValue("#3182CE", "blue.300")}
        >
          Reviewers
        </Heading>
      </section>
      <Grid
        templateColumns={{ base: "1fr", lg: "repeat(2, 1fr)" }}
        gap={4}
      >
        {reviewerCharts}
      </Grid>
    </Box>
  );
};


  const toggleDropdown = () => setShowDropdown(prev => !prev);

  const getYears = () => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 10 }, (_, i) => currentYear - i);
  };

  const getMonths = () => [
    '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'
  ];
  

  const [loading2,setLoading2]=useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedYear || !selectedMonth) return; // Ensure year and month are selected

      setLoading2(true);

      // Format the key to 'yyyy-mm' format
      const key = `${selectedYear}-${selectedMonth}`;

      // Define the API endpoint based on activeTab ('PRs' or 'Issues')
      const endpoint =`/api/ReviewersCharts/data/${activeTab.toLowerCase()}/${key}`
        

      try {
        const response = await fetch(endpoint);
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const result = await response.json();
        // console.log(result)

        // console.log("result:",result[0].PRs);

        setData(result[0].PRs)
        // console.log(formattedData); 
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading2(false); // Reset loading state after fetching
      }
    };

    fetchData(); // Invoke the fetch function

  }, [selectedYear, selectedMonth, activeTab]);

  const [loading3,setLoading3]=useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
     
      setLoading3(true);
      // Define the API endpoint based on activeTab ('PRs' or 'Issues')
      const endpoint =`/api/ReviewersCharts/data/${activeTab.toLowerCase()}`
        

      try {
        const response = await fetch(endpoint);
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const result = await response.json();
        // console.log(result)

        const combinedPRs = (result as ReviewData[]).flatMap((item) => item.PRs || []);

      // console.log("Combined PRs:", combinedPRs);

      // Set the combined PRs as download data
      
      setdownloadData(combinedPRs);
        // console.log(formattedData); 
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading3(false); // Reset loading state after fetching
      }
    };

    fetchData(); // Invoke the fetch function

  }, [activeTab]);
  

  const renderTable = (year: string, month: string, reviewerFilter: any) => {
    // console.log(data);
    const filteredData = data?.filter(item => showReviewer[item.reviewer]);;

        console.log("filtered data:",filteredData);
        console.log("show reviewers:", showReviewer);

    return (
        <Box mt={2} overflowX="auto" overflowY="auto" maxHeight="600px" border="2px solid #e2e8f0" borderRadius="10px 10px 10px 10px" boxShadow="lg">
            <Table >
                <Thead p="8px" bg="black">
                    
                    <Tr>
                            <Th 
                              color="white" 
                              textAlign="center" 
                              borderTopLeftRadius="10px" 
                              minWidth="6rem"
                              p="8px"
                            >
                              PR Number
                            </Th>
                            <Th 
                              color="white" 
                              textAlign="center" 
                              minWidth="11rem"
                              whiteSpace="normal" // Allow wrapping
                              overflow="hidden"   // Prevent overflow
                              textOverflow="ellipsis" // Add ellipsis for overflowed text
                              p="8px"
                            >
                              Title
                            </Th>
                            <Th 
                              color="white" 
                              textAlign="center" 
                              minWidth="6rem" 
                              p="8px"
                              
                            >
                              Reviewed by
                            </Th>
                            <Th 
                              color="white" 
                              textAlign="center" 
                              minWidth="6rem" 
                              p="8px"
                              
                            >
                              Review Date
                            </Th>
                            
                            <Th 
                              color="white" 
                              textAlign="center" 
                              minWidth="6rem" 
                              p="8px"
                            >
                              Created Date
                            </Th>
                            <Th 
                              color="white" 
                              textAlign="center" 
                              minWidth="6rem" 
                              p="8px"
                              
                            >
                              Closed Date
                            </Th>
                            <Th 
                              color="white" 
                              textAlign="center" 
                              minWidth="6rem" 
                              p="8px"
                              
                            >
                              Merged Date
                            </Th>
                            <Th 
                              color="white" 
                              textAlign="center" 
                              minWidth="6rem" 
                              p="8px"
                            >
                              Status
                            </Th>
                            <Th 
                              color="white" 
                              textAlign="center" 
                              minWidth="10rem"
                              p="8px"
                            >
                              Link
                            </Th>
                          </Tr>
                </Thead>
                </Table>
                <Table variant="striped" colorScheme="gray" >
                <Tbody>
                    {filteredData?.map((pr, index) => {
                        const status = pr.merged_at
                            ? 'Merged'
                            : pr.closed_at
                                ? 'Closed'
                                : 'Open';

                        return (
                            <Tr p="8px" key={pr.prNumber}> {/* Set border for rows */}
                                <Td p="8px" textAlign="center" verticalAlign="middle"  width="100px">
                                    {pr.prNumber}
                                </Td>
                                <Td p="8px" textAlign="center" verticalAlign="middle"  style={{ wordWrap: 'break-word', maxWidth: '200px' }}>
                                    {pr.prTitle}
                                </Td>
                                <Td p="8px" textAlign="center" verticalAlign="middle" >
                                    {pr.reviewer}
                                </Td>
                                <Td p="8px" textAlign="center" verticalAlign="middle" >
                                    {pr.reviewDate ? new Date(pr.reviewDate).toLocaleDateString() : '-'}
                                </Td>
                                <Td p="8px" textAlign="center" verticalAlign="middle" >
                                    {pr.created_at ? new Date(pr.created_at).toLocaleDateString() : '-'}
                                </Td>
                                <Td p="8px" textAlign="center" verticalAlign="middle" >
                                    {pr.closed_at ? new Date(pr.closed_at).toLocaleDateString() : '-'}
                                </Td>
                                <Td p="8px" textAlign="center" verticalAlign="middle" >
                                    {pr.merged_at ? new Date(pr.merged_at).toLocaleDateString() : '-'}
                                </Td>
                                <Td p="8px" textAlign="center" verticalAlign="middle" >
                                    {status}
                                </Td>
                                <Td p="8px" textAlign="center" verticalAlign="middle">
                                  <Link href={`/PR/${pr.repo}/${pr.prNumber}`} target="_blank" rel="noopener noreferrer">
                                    <Button
                                        as="a"
                                        
                                      
                                        rel="noopener noreferrer"
                                        colorScheme="blue"
                                        variant="solid"
                                    >
                                        Pull Request
                                    </Button>
                                    </Link>
                                </Td>
                            </Tr>
                        );
                    })}
                </Tbody>
            </Table>
        </Box>
    );
};

interface PRInfo {
  prNumber: number;
  prTitle: string;
  created_at?: string;
  closed_at?: string;
  merged_at?: string;
  reviewDate: string;
  reviewComment?: string;
  repo: string;
}

interface ReviewerData {
  [reviewerName: string]: PRInfo[];
}

const [activeData, setActiveData] = useState<ReviewerData>({});

const fetchData4 = async () => {
  setLoading4(true);
  try {
    // Step 1: Fetch active tab data
    const response = await fetch(active_endpoints[activeTab]);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    // Step 2: Fetch reviewer timelines
    const timelineResponse = await fetch('/api/editorsActivity');
    if (!timelineResponse.ok) {
      throw new Error('Failed to fetch timelines!');
    }
    const timelines = await timelineResponse.json();
    
    const allTimelines = timelines;

    // Format the timeline data for easy access
    const timelineMap = allTimelines?.reduce((map: any, reviewer: any) => {
      map[reviewer.reviewer] = {
        startDate: new Date(reviewer.startDate),
        endDate: reviewer.endDate ? new Date(reviewer.endDate) : null, // null means no end date
      };
      return map;
    }, {});

    console.log("timeline map:",timelineMap);
    console.log("data before:", data);

    // Step 3: Filter reviews based on timeline
    const filteredData = Object.keys(data)?.reduce((filtered: ReviewerData, reviewerName: string) => {
      if (!timelineMap[reviewerName]) return filtered; // Skip if no timeline info available

      const { startDate, endDate } = timelineMap[reviewerName];
      const reviews = data[reviewerName]?.filter((review: PRInfo) => {
        const reviewDate = new Date(review.reviewDate);
        return reviewDate >= startDate && (!endDate || reviewDate <= endDate); // Check if within timeline
      });

      if (reviews?.length > 0) {
        filtered[reviewerName] = reviews; // Include only reviewers with valid reviews
      }

      console.log("filtered data:",filtered);
      return filtered;
    }, {});

    console.log('Filtered scatterplot data:', filteredData);
    setActiveData(filteredData); // Update state with filtered data
  } catch (err) {
    console.error(err);
  } finally {
    setLoading4(false);
  }
};



// Fetch data whenever activeTab changes
useEffect(() => {
  fetchData4();
}, [activeTab]);

const [loading5,setLoading5]=useState<boolean>(false);

const fetchDataspeciality = async () => {
  setLoading5(true);
  try {

    const endpoint1 =`/api/ReviewersCharts/chart/eips`
    const endpoint2 =`/api/ReviewersCharts/chart/ercs`
    const endpoint3 =`/api/ReviewersCharts/chart/rips`

    const response1 = await fetch(endpoint1); // Replace with your API endpoint
    const response2 = await fetch(endpoint2); 
    const response3 = await fetch(endpoint3); 
    if (!response1.ok) {
      throw new Error('Network response was not ok');
    }
    if (!response2.ok) {
      throw new Error('Network response was not ok');
    }
    if (!response3.ok) {
      throw new Error('Network response was not ok');
    }
    const formattedData1: { monthYear: string; reviewer: string; count: number }[] = await response1.json();
    const formattedData2: { monthYear: string; reviewer: string; count: number }[] = await response2.json();
    const formattedData3: { monthYear: string; reviewer: string; count: number }[] = await response3.json();
    // console.log("eip data:",formattedData1)

    seteipData(formattedData1);
    setercData(formattedData2);
    setripData(formattedData3);
  } catch (error) {
    console.error("Error during data fetch:", error);
  } finally {
    setLoading5(false); // Ensure loading state is set to false in all cases
  }
};

useEffect(()=>{
  fetchDataspeciality();
},[]);

const handleFilterData2 = () => {
  const startDate = `${selectedStartYear2}-${selectedStartMonth2}`;
  const endDate = `${selectedEndYear2}-${selectedEndMonth2}`;
  // console.log("active data:",activeData);
  // console.log("start:",startDate);
  // console.log("end:",endDate)

  const filteredData:any = [];
  for (const reviewerName in activeData) {
    const reviews = activeData[reviewerName];
    reviews?.forEach((pr: PRInfo) => {
      const reviewDate = new Date(pr.reviewDate);
      const reviewMonthYear = `${reviewDate.getFullYear()}-${String(reviewDate.getMonth() + 1).padStart(2, "0")}`;

      if (reviewMonthYear >= startDate && reviewMonthYear <= endDate) {
        filteredData.push({
          reviewer: reviewerName,
          reviewDate: pr.reviewDate,
          formattedTime: reviewDate.toLocaleString("en-US", {
            hour: "numeric",
            minute: "numeric",
            hour12: true,
          }),
        });
      }
    });
  }
  return filteredData;
};

const editorsActivity = () => {
  const activityData: any = handleFilterData2();

  const processedData = activityData?.map((item: any) => ({
    ...item,
    timeIn24Hour: helpers.convertTo24Hour(item.formattedTime),
  }));

  processedData.sort((a: any, b: any) =>
    a.timeIn24Hour.localeCompare(b.timeIn24Hour)
  );

  const reviewers = [...new Set(processedData?.map((item: any) => item.reviewer))];
  const reviewerColors: { [key: string]: string } = {};
  reviewers?.forEach((reviewer, index) => {
    if (topContributorColors[reviewer as string]) {
      reviewerColors[reviewer as string] = topContributorColors[reviewer as string];
    } else {
      reviewerColors[reviewer as string] = generateDistinctColor(index, reviewers?.length);
    }
  });

  return (
    <ReviewActivityTimeline
      activityData={processedData}
      loading={loading4}
      showFilters={showFilters2}
      setShowFilters={setShowFilters2}
      selectedStartYear={selectedStartYear2}
      selectedStartMonth={selectedStartMonth2}
      selectedEndYear={selectedEndYear2}
      selectedEndMonth={selectedEndMonth2}
      setSelectedStartYear={setSelectedStartYear2}
      setSelectedStartMonth={setSelectedStartMonth2}
      setSelectedEndYear={setSelectedEndYear2}
      setSelectedEndMonth={setSelectedEndMonth2}
      reviewerColors={reviewerColors}
    />
  );
};


const editorsSpecialityChart = () => {
  const processData1 = helpers.getYearlyData(eipdata, showReviewer);
  const yearlyChartData1 = helpers.formatChartData(processData1);
  const processData2 = helpers.getYearlyData(ercdata, showReviewer);
  const yearlyChartData2 = helpers.formatChartData(processData2);
  const processData3 = helpers.getYearlyData(ripdata, showReviewer);
  const yearlyChartData3 = helpers.formatChartData(processData3);

  const targetReviewers = [
    "lightclient", "SamWilsn", "xinbenlv", "g11tech", "nalepae", "SkandaBhat",
    "advaita-saha", "jochem-brouwer", "Marchhill", "bomanaps", "daniellehrner",
    "CarlBeek", "nconsigny", "yoavw", "adietrichs"
  ];

  const filteredEIPData = yearlyChartData1?.filter((item) => targetReviewers.includes(item.reviewer));
  const filteredERCData = yearlyChartData2?.filter((item) => targetReviewers.includes(item.reviewer));
  const filteredRIPData = yearlyChartData3?.filter((item) => targetReviewers.includes(item.reviewer));

  const chartData = [
    ...filteredEIPData?.map((item) => ({ reviewer: item.reviewer, repo: "EIPs", value: item.count })),
    ...filteredERCData?.map((item) => ({ reviewer: item.reviewer, repo: "ERCs", value: item.count })),
    ...filteredRIPData?.map((item) => ({ reviewer: item.reviewer, repo: "RIPs", value: item.count })),
  ];

  const reviewers = [...new Set(chartData.map(item => item.reviewer))];
  const reviewerColors: { [key: string]: string } = {};
  reviewers.forEach((reviewer, index) => {
    if (topContributorColors[reviewer]) {
      reviewerColors[reviewer] = topContributorColors[reviewer];
    } else {
      reviewerColors[reviewer] = generateDistinctColor(index, reviewers.length);
    }
  });

  return (
    <ActiveEditorsChart
      chartData={chartData}
      loading={loading5}
      reviewerColors={reviewerColors}
    />
  );
};

const renderEditorRepoGrid = () => {
  const reviewersList = helpers.REVIEWERS_LIST;
  
  // Prepare time-series data for each reviewer
  const reviewerTimeSeriesMap: { [key: string]: any[] } = {};
  
  // Process EIP data
  eipdata.forEach(item => {
    if (showReviewer[item.reviewer]) {
      if (!reviewerTimeSeriesMap[item.reviewer]) {
        reviewerTimeSeriesMap[item.reviewer] = [];
      }
      reviewerTimeSeriesMap[item.reviewer].push({
        monthYear: item.monthYear,
        repo: 'EIPs',
        count: item.count,
      });
    }
  });
  
  // Process ERC data
  ercdata.forEach(item => {
    if (showReviewer[item.reviewer]) {
      if (!reviewerTimeSeriesMap[item.reviewer]) {
        reviewerTimeSeriesMap[item.reviewer] = [];
      }
      reviewerTimeSeriesMap[item.reviewer].push({
        monthYear: item.monthYear,
        repo: 'ERCs',
        count: item.count,
      });
    }
  });
  
  // Process RIP data
  ripdata.forEach(item => {
    if (showReviewer[item.reviewer]) {
      if (!reviewerTimeSeriesMap[item.reviewer]) {
        reviewerTimeSeriesMap[item.reviewer] = [];
      }
      reviewerTimeSeriesMap[item.reviewer].push({
        monthYear: item.monthYear,
        repo: 'RIPs',
        count: item.count,
      });
    }
  });

  // Calculate totals and prepare final data
  const allData = Object.entries(reviewerTimeSeriesMap).map(([reviewer, timeSeriesData]) => {
    const eipsTotal = timeSeriesData.filter(d => d.repo === 'EIPs').reduce((sum, d) => sum + d.count, 0);
    const ercsTotal = timeSeriesData.filter(d => d.repo === 'ERCs').reduce((sum, d) => sum + d.count, 0);
    const ripsTotal = timeSeriesData.filter(d => d.repo === 'RIPs').reduce((sum, d) => sum + d.count, 0);
    
    return {
      reviewer,
      eips: eipsTotal,
      ercs: ercsTotal,
      rips: ripsTotal,
      total: eipsTotal + ercsTotal + ripsTotal,
      timeSeriesData: timeSeriesData.sort((a, b) => a.monthYear.localeCompare(b.monthYear)),
    };
  }).sort((a, b) => b.total - a.total);

  const editorsData = allData.filter(item => !reviewersList.includes(item.reviewer));
  const reviewersData = allData.filter(item => reviewersList.includes(item.reviewer));

  return <EditorRepoGrid editorsData={editorsData} reviewersData={reviewersData} />;
};

// Generate distinct colors for editors
const generateDistinctColor = (index: number, total: number) => {
  const hue = (index * (360 / total)) % 360; // Golden angle for better color distribution
  return `hsl(${hue}, 85%, 50%)`; // High saturation and medium brightness for vibrancy
};

const router = useRouter();

  const scrollToHash = () => {
    const hash = window.location.hash;
    if (hash) {
      const element = document.getElementById(hash.slice(1));
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  useEffect(() => {
    if (!loading) {
      const timeout = setTimeout(() => {
        scrollToHash();
      }, 1000); // 1 second delay
  
      return () => clearTimeout(timeout); // Cleanup timeout on unmount
    }
  }, [loading]);
  

  useLayoutEffect(() => {
    router.events.on("routeChangeComplete", scrollToHash);
    return () => {
      router.events.off("routeChangeComplete", scrollToHash);
    };
  }, [router]);

  // Scroll to the feedback section at the bottom of the page
  const scrollToFeedbackSection = () => {
    const feedbackSection = document.getElementById("comments"); // Ensure the case matches the HTML
    if (feedbackSection) {
      feedbackSection.scrollIntoView({ behavior: "smooth" });
    }
  };

// Handle thumbs up/down feedback
const handleFeedbackClick = (type: 'positive' | 'negative') => {
  const message =
    type === 'positive'
      ? 'Thank you for your positive feedback!'
      : 'Thank you for your feedback!';
  alert(message);
};


  return (
    <AllLayout>
      <Box>
        {/* Rest of the component */}
        <Flex
          direction={{ base: "column", md: "row" }}
          gap={{ base: 4, md: 8 }}
          p={{ base: 4, md: 8 }}
        >
          {/* Sidebar and other content */}
          {/* ... */}
        </Flex>
      
      <Box p={4}>
        <section id = "LeaderBoard">
          
      <Heading
        size="xl"
        marginBottom={10}
        textAlign="center"
        color={useColorModeValue('blue.600', 'blue.300')}
        fontWeight="bold"
      >
        Editors & Reviewers Leaderboard
      </Heading>
      
      {/* EtherWorld Advertisement */}
      <Box my={6} width="100%">
        <EtherWorldAdCard />
      </Box>
      
      </section>


      <section id="Leaderboard FAQ">
        <FAQSection show={show} toggleCollapse={toggleCollapse} />
      </section>


     
      <Flex justify="center" >
  <Menu>
    <MenuButton
      as={Button}
      rightIcon={<ChevronDownIcon />}
      colorScheme="blue"
      size="md"
      width="200px"
    >
      {activeTab ? activeTab.toUpperCase() : "Select an option"}
    </MenuButton>

    <MenuList maxHeight="200px" overflowY="auto">
     
      <MenuItem onClick={() => {
        setActiveTab('all');
      }}>
        ALL
      </MenuItem>

     
      <MenuItem onClick={() => {
        setActiveTab('eips');
      }}>
        EIPs
      </MenuItem>

      
      <MenuItem onClick={() => {
        setActiveTab('ercs');
      }}>
        ERCs
      </MenuItem>

     
      <MenuItem onClick={() => {
        setActiveTab('rips');
      }}>
        RIPs
      </MenuItem>
    </MenuList>
  </Menu>
</Flex>

     
        <Box padding="0.5rem" borderRadius="0.55rem">
          <Box
            // bgColor={bg}
            // padding="2rem"
            borderRadius="0.55rem"
            // _hover={{
            //   border: "1px",
            //   borderColor: "#30A0E0",
            // }}
          >

        
            
            <Box id="Leaderboard" className="w-full">
              {renderCharts(chart1data, selectedYear, selectedMonth)}
              
            </Box>
          </Box>
          {/* <br /> */}
          {/* <br /> */}
        </Box>

        {/* <br/> */}

            <section id="ActivityTimeline">
              {editorsActivity()}
            </section>
 

        <Box
  bgColor={bg}
  padding="2rem"
  borderRadius="0.55rem"
  mt={2}
  // _hover={{
  //   border: "1px",
  //   borderColor: "#30A0E0",
  // }}
>
  {/* The part that is breaking start */}
  <Box id="Monthly" className={"w-full"}>
    <Flex justifyContent="space-between" alignItems="center" marginBottom="0.5rem">
      <section id = "PRs Reviewed" >
      <Heading 
        size="lg" 
        fontWeight="bold"
        color={useColorModeValue("#3182CE", "blue.300")}
      >
        {`PRs Reviewed (Monthly, since 2015)`}<CopyLink link={`https://eipsinsight.com/Reviewers#Monthly`} />
      </Heading>
      </section>
      <Flex alignItems="center">
        <CSVLink
          data={csvData?.length ? csvData : []}
          filename={`reviews_data_since_2015.csv`}
          
          onClick={async () => {
            try {
             
              generateCSVData5();
        
             
              await axios.post("/api/DownloadCounter");
            } catch (error) {
              console.error("Error triggering download counter:", error);
            }
          }}
        >
          <Button colorScheme="blue" mr="1rem" fontSize={{ base: "0.6rem", md: "md" }} display={{ base: "none", md: "flex" }}>
            {loading3 ? <Spinner size="sm" /> : "Download CSV"}
          </Button>
        </CSVLink>
        <Button
          colorScheme="blue"
          onClick={() => setLinechart(!Linechart)}
          mr="1rem"
          display={{ base: "none", md: "flex" }}
        >
          {Linechart ? "Column Chart" : "Line Chart"}
        </Button>
        <Button
          colorScheme="blue"
          onClick={() => setShowFilters(!showFilters)}
          leftIcon={showFilters ? <AiOutlineClose /> : <FiFilter />}
          fontSize={{ base: "0.6rem", md: "md" }} 
          display={{ base: "none", md: "flex" }}
        >
          {showFilters ? "Hide Filters" : "Show Filters"}
        </Button>
      </Flex>
    </Flex>
    
    <Flex alignItems="center">

      <CSVLink
          data={csvData?.length ? csvData : []}
          filename={`reviews_data_since_2015.csv`}
          
          onClick={async () => {
            try {
             
              generateCSVData5();
              await axios.post("/api/DownloadCounter");
            } catch (error) {
              console.error("Error triggering download counter:", error);
            }
          }}
        >
          <Button colorScheme="blue" mr="1rem" fontSize={{ base: "0.6rem", md: "md" }} display={{ base: "flex", md: "none" }}>
            {loading3 ? <Spinner size="sm" /> : "Download CSV"}
          </Button>
        </CSVLink>
        
        <Button
          colorScheme="blue"
          onClick={() => setLinechart(!Linechart)}
          mr="1rem"
          display={{ base: "flex", md: "none" }}
          fontSize={{ base: "0.6rem", md: "md" }}
        >
          {Linechart ? "Column Chart" : "Line Chart"}
        </Button>
        <Button
          colorScheme="blue"
          onClick={() => setShowFilters(!showFilters)}
          leftIcon={showFilters ? <AiOutlineClose /> : <FiFilter />}
          fontSize={{ base: "0.6rem", md: "md" }} 
          display={{ base: "flex", md: "none" }}
        >
          {showFilters ? "Hide Filters" : "Show Filters"}
        </Button>
      </Flex>
    
    {showFilters && (
      <Box
        bg="blue.50"
        borderRadius="md"
        p={4}
        mt="1rem"
      >
        <Flex flexDirection={{ base: "column", md: "row" }} justifyContent="flex-start" gap="2rem" mb="1rem">
          
        <Box>
          <Heading size="sm" mb="0.5rem" color="black">Start Date</Heading>
          <Flex>
          <HStack spacing={4}>
            {/* Year Dropdown for Start Date */}
            <Menu>
              <MenuButton as={Button} rightIcon={<ChevronDownIcon />} colorScheme="blue">
                {selectedStartYear ? `${selectedStartYear}` : 'Year'}
              </MenuButton>
              <MenuList bg="white" color="black" borderColor="blue.500">
                {Array.from({ length: 2025 - 2015 + 1 }, (_, i) => (2025 - i).toString())?.map((year) => (
                  <MenuItem
                    key={year}
                    onClick={() => setSelectedStartYear(year)}
                    bg="white"
                    color="black"
                  >
                    {year}
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>

            {/* Month Dropdown for Start Date */}
            <Menu>
              <MenuButton as={Button} rightIcon={<ChevronDownIcon />} colorScheme="blue">
                {selectedStartMonth ? `${selectedStartMonth}` : 'Month'}
              </MenuButton>
              <MenuList bg="white" color="black" borderColor="blue.500">
                {[
                  { name: 'Jan', value: '01' },
                  { name: 'Feb', value: '02' },
                  { name: 'Mar', value: '03' },
                  { name: 'Apr', value: '04' },
                  { name: 'May', value: '05' },
                  { name: 'Jun', value: '06' },
                  { name: 'Jul', value: '07' },
                  { name: 'Aug', value: '08' },
                  { name: 'Sep', value: '09' },
                  { name: 'Oct', value: '10' },
                  { name: 'Nov', value: '11' },
                  { name: 'Dec', value: '12' },
                ]?.map((month) => (
                  <MenuItem
                    key={month.value}
                    onClick={() => setSelectedStartMonth(month.value)}
                    bg="white"
                    color="black"
                  >
                    {month.name}
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
            </HStack>
          </Flex>
        </Box>

        <Box>
          <Heading size="sm" mb="0.5rem" color="black">End Date</Heading>
          <Flex>
          <HStack spacing={4}>
            {/* Year Dropdown for End Date */}
            <Menu>
              <MenuButton as={Button} rightIcon={<ChevronDownIcon />} colorScheme="blue">
                {selectedEndYear ? `${selectedEndYear}` : 'Year'}
              </MenuButton>
              <MenuList bg="white" color="black" borderColor="blue.500">
                {Array.from({ length: 2025 - 2015 + 1 }, (_, i) => (2025 - i).toString())?.map((year) => (
                  <MenuItem
                    key={year}
                    onClick={() => setSelectedEndYear(year)}
                    bg="white"
                    color="black"
                  >
                    {year}
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>

            {/* Month Dropdown for End Date */}
            <Menu>
              <MenuButton as={Button} rightIcon={<ChevronDownIcon />} colorScheme="blue">
                {selectedEndMonth ? `${selectedEndMonth}` : 'Month'}
              </MenuButton>
              <MenuList bg="white" color="black" borderColor="blue.500">
                {[
                  { name: 'Jan', value: '01' },
                  { name: 'Feb', value: '02' },
                  { name: 'Mar', value: '03' },
                  { name: 'Apr', value: '04' },
                  { name: 'May', value: '05' },
                  { name: 'Jun', value: '06' },
                  { name: 'Jul', value: '07' },
                  { name: 'Aug', value: '08' },
                  { name: 'Sep', value: '09' },
                  { name: 'Oct', value: '10' },
                  { name: 'Nov', value: '11' },
                  { name: 'Dec', value: '12' },
                ]?.map((month) => (
                  <MenuItem
                    key={month.value}
                    onClick={() => setSelectedEndMonth(month.value)}
                    bg="white"
                    color="black"
                  >
                    {month.name}
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
            </HStack>
          </Flex>
        </Box>

                  <Box>
          <Heading size="sm" mb="0.5rem" color="black">Select Reviewer</Heading>
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

            <MenuList maxHeight="200px" overflowY="auto">
             
              <MenuItem onClick={deselectAllReviewers}>
                <Text as="span" fontWeight="bold" textDecoration="underline">
                  Remove All
                </Text>
              </MenuItem>

              <MenuItem onClick={selectAllReviewers}>
                <Text as="span" fontWeight="bold" textDecoration="underline">
                Select All
                </Text>
              </MenuItem>

              
              <MenuItem onClick={selectActiveReviewers}>
                <Text as="span" fontWeight="bold" textDecoration="underline">
                  Select Active
                </Text>
              </MenuItem>

              <MenuItem onClick={selectEmeritusReviewers}>
                <Text as="span" fontWeight="bold" textDecoration="underline">
                  Select Emeritus
                </Text>
              </MenuItem>

              <MenuItem onClick={selectReviewers}>
                <Text as="span" fontWeight="bold" textDecoration="underline">
                Select Reviewers
                </Text>
              </MenuItem>

              
              {Object.keys(showReviewer)?.map((reviewer) => (
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
        </Box>
        </Flex>
       
      </Box>
    )}

   
    {Linechart ? renderChart4() : renderChart()}
    <LastUpdatedDateTime  name="EditorsTool"/>
  </Box>


  {/* the part that is breaking the plot */}
</Box>



          
      <Box>
      <Text color="gray.500" fontStyle="italic" textAlign="center">
          *Please note: The data is refreshed every 24 hours to ensure accuracy and up-to-date information*
        </Text>
      </Box>
      
      <br/>
     
      <Flex justify="center">
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

      <MenuList maxHeight="200px" overflowY="auto">
        
        <MenuItem onClick={deselectAllReviewers}>
          <Text as="span" fontWeight="bold" textDecoration="underline">
            Remove All
          </Text>
        </MenuItem>

        
        <MenuItem onClick={selectActiveReviewers}>
          <Text as="span" fontWeight="bold" textDecoration="underline">
          Active Editors
          </Text>
        </MenuItem>

        
        <MenuItem onClick={selectAllReviewers}>
          <Text as="span" fontWeight="bold" textDecoration="underline">
            Select All
          </Text>
        </MenuItem>

        
        {Object.keys(showReviewer)?.map((reviewer) => (
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
       
        <br/>

      {showDropdown && (
        // <HStack spacing={4}>
        <Box display={{ base: "none", md: "flex" }} justifyContent="center" gap="1rem">
          
            
            <Menu>
              <MenuButton as={Button} rightIcon={<ChevronDownIcon />} colorScheme="blue">
                {selectedYear ? `Year: ${selectedYear}` : 'Select Year'}
              </MenuButton>
              <MenuList>
                {getYears()?.map((year) => (
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
                {selectedYear && getMonths()?.map((month, index) => (
                  <MenuItem key={index} onClick={() => setSelectedMonth(month)}>
                    {month}
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
        </Box>
        // </HStack>
      )}
       </HStack>
      </Flex>

      <Flex justify="center" mt={2}>
        
      <HStack spacing={4}>
         
       
        

      {showDropdown && (
        <HStack spacing={4}>
        <Box display={{ base: "flex", md: "none" }} justifyContent="center" gap="1rem">
          
            
            <Menu>
              <MenuButton as={Button} rightIcon={<ChevronDownIcon />} colorScheme="blue">
                {selectedYear ? `Year: ${selectedYear}` : 'Select Year'}
              </MenuButton>
              <MenuList>
                {getYears()?.map((year) => (
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
                {selectedYear && getMonths()?.map((month, index) => (
                  <MenuItem key={index} onClick={() => setSelectedMonth(month)}>
                    {month}
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
        </Box>
        </HStack>
      )}
       </HStack>
      </Flex>
      <br/>

      {selectedMonth && (
        <Box padding="0.5rem" borderRadius="0.55rem">
          <Box
            bgColor={bg}
            // padding="2rem"
            borderRadius="0.55rem"
            // _hover={{
            //   border: "1px",
            //   borderColor: "#30A0E0",
            // }}
          >
            <Box className="w-full">
              {renderCharts2(chart1data, selectedYear, selectedMonth)}
              <LastUpdatedDateTime  name="EditorsTool"/>
            </Box>
          </Box>
        </Box>
      )}

      {showDropdown && ( 
        <>
      
            {selectedYear && selectedMonth && (
                <Box mt={4} display="flex" justifyContent="flex-end">
                <CSVLink
                  data={csvData?.length ? csvData : []}
                  filename={`reviews_${selectedYear}_${selectedMonth}.csv`}
                  onClick={async () => {
                    try {
                      generateCSVData();
                      await axios.post("/api/DownloadCounter");
                    } catch (error) {
                      console.error("Error triggering download counter:", error);
                    }
                  }}
                >
                  <Button
                    colorScheme="blue"
                    fontSize={{ base: "0.6rem", md: "md" }}
                   
                  >  <DownloadIcon marginEnd={"1.5"} />
                    {loading2 ? <Spinner size="sm" /> : "Download CSV"}
                  </Button>
                </CSVLink>
              </Box>
              
            )}

            {selectedYear && selectedMonth && (
              <Box>
                {renderTable(selectedYear, selectedMonth, showReviewer)}
              </Box>
            )}

    </>
    )}
            <br/>
            
      {/* Active Editors PR Reviews - Moved up */}
      <section id="active editors">
        <Box id="Speciality" className="w-full">
          {editorsSpecialityChart()}
        </Box>
      </section>
      <br/>
      
      {/* Individual Editor/Reviewer Repository Distribution */}
      <Box className="w-full" mt={8}>
        {renderEditorRepoGrid()}
      </Box>
            
    <Box>
          <br/>
        <hr></hr>
        <br/>
        <section id="comments">
        <Text fontSize="3xl" fontWeight="bold">Comments</Text></section>
          <Comments page={"Reviewers"}/>
          
        </Box>
        </Box>
      </Box>
    </AllLayout>
  );
};



export default ReviewTracker;
