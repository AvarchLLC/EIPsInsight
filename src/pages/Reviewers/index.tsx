import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Box, Flex, Spinner, Select,Heading, IconButton, Collapse, Checkbox, HStack, Button, Menu, MenuButton, MenuList, MenuItem, Table, Thead, Tbody, Tr, Th, Td, Text, useColorModeValue  } from "@chakra-ui/react";
import AllLayout from "@/components/Layout";
import LoaderComponent from "@/components/Loader";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { CSVLink } from "react-csv";
import {ChevronUpIcon } from "@chakra-ui/icons";
import DateTime from "@/components/DateTime";
import { motion } from "framer-motion";
import Comments from "@/components/comments";
import { FiFilter } from 'react-icons/fi';
import { AiOutlineClose } from 'react-icons/ai';
// import { Bar } from "@ant-design/charts";
// import { Line } from '@ant-design/charts';  // Import the Line chart component

// Dynamic import for Ant Design's Column chart
const Column = dynamic(() => import("@ant-design/plots").then(mod => mod.Column), { ssr: false });
const Bar = dynamic(() => import("@ant-design/plots").then(mod => mod.Bar), { ssr: false });


const API_ENDPOINTS = {
  eips: '/api/editorsprseips',
  ercs: '/api/editorsprsercs',
  rips: '/api/editorsprsrips'
};

type ShowReviewerType = { [key: string]: boolean }; 

const ReviewTracker = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<any[]>([]);
  const [chart1data, setchart1Data] = useState<any[]>([]);
  const [downloaddata, setdownloadData] = useState<any[]>([]);
  // const [showReviewer, setShowReviewer] = useState<{ [key: string]: boolean }>({});
  const [showReviewer, setShowReviewer] = useState<ShowReviewerType>({});
  const [reviewers, setReviewers] = useState<string[]>([]);
  const [reviewerData, setReviewerData] = useState<any[]>([]);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [selectedStartYear, setSelectedStartYear] = useState<string | null>(null);
  const [selectedStartMonth, setSelectedStartMonth] = useState<string | null>(null);
  const [selectedEndYear, setSelectedEndYear] = useState<string | null>(null);
  const [selectedEndMonth, setSelectedEndMonth] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'eips' | 'ercs' | 'rips' |'all'>('all');
  const [csvData, setCsvData] = useState<any[]>([]); // State for storing CSV data
  const [show, setShow] = useState(false);
  const bg = useColorModeValue("#f6f6f7", "#171923");
  const [sliderValue, setSliderValue] = useState<number>(0);

  const years = Array.from({ length: 2024 - 2015 + 1 }, (_, i) => (2015 + i).toString());
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
    if (selectedStartYear && selectedStartMonth && selectedEndYear && selectedEndMonth) {
      const startDate = `${selectedStartYear}-${selectedStartMonth}`;
      const endDate = `${selectedEndYear}-${selectedEndMonth}`;

      const filteredData = chart1data.filter((item) => {
        const itemDate = item.monthYear; // Assuming monthYear is in "YYYY-MM" format
        return itemDate >= startDate && itemDate <= endDate;
      });

      console.log('Filtered Data:', filteredData);
      return filteredData;
    }
    return chart1data; // Return all data if no filters are applied
  };

  const toggleCollapse = () => setShow(!show);

  const fetchReviewers = async (): Promise<string[]> => {
    try {
      const response = await fetch(
        "https://raw.githubusercontent.com/ethereum/EIPs/master/config/eip-editors.yml"
      );
      const text = await response.text();
  
      // Match unique reviewers using a regex to handle YAML structure
      const matches = text.match(/-\s(\w+)/g);
      const reviewers = matches ? Array.from(new Set(matches.map((m) => m.slice(2)))) : [];
  
      return reviewers;
    } catch (error) {
      console.error("Error fetching reviewers:", error);
      return [];
    }
  };

  

  useEffect(() => {
    fetchReviewers().then((uniqueReviewers) => {
      setReviewers(uniqueReviewers);
      const initialShowReviewer = uniqueReviewers.reduce(
        (acc, reviewer) => ({ ...acc, [reviewer]: false }),
        {} as ShowReviewerType
      );
      setShowReviewer(initialShowReviewer);
    });
  }, []);

  const selectAllReviewers = () => {
    const updatedReviewers = Object.keys(showReviewer).reduce(
      (acc, reviewer) => ({ ...acc, [reviewer]: true }),
      {} as ShowReviewerType
    );
    setShowReviewer(updatedReviewers);
  };

  // Function to deselect all reviewers
  const deselectAllReviewers = () => {
    const updatedReviewers = Object.keys(showReviewer).reduce(
      (acc, reviewer) => ({ ...acc, [reviewer]: false }),
      {} as ShowReviewerType
    );
    setShowReviewer(updatedReviewers);
  };

  // Function to select only the active reviewers from the list
  const selectActiveReviewers = () => {
    const updatedReviewers = Object.keys(showReviewer).reduce((acc, reviewer) => {
      acc[reviewer] = reviewers.includes(reviewer);
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

  const generateCSVData = () => {
    if (!selectedYear || !selectedMonth) {
      console.error('Year and Month must be selected to generate CSV');
      return;
    }

    console.log(data)
  
    const filteredData = data
  
    const csv = data.map((pr: PR) => ({
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

  const generateCSVData2 = () => {
    console.log("downloadable data:", downloaddata);
    setLoading3(true);

    console.log(selectedStartMonth);
    console.log(selectedEndMonth);
    console.log(selectedEndYear);
    console.log(selectedStartYear);
  
    if (selectedStartYear && selectedStartMonth && selectedEndYear && selectedEndMonth) {
      // Construct start and end dates in ISO format
      const startDate = new Date(`${selectedStartYear}-${selectedStartMonth}-01T00:00:00Z`);
      const endDate = new Date(
        `${selectedEndYear}-${selectedEndMonth}-01T00:00:00Z`
      );
  
      // Adjust end date to include the entire month
      endDate.setMonth(endDate.getMonth() + 1);
      endDate.setDate(0); // Last day of the month
  
      const filteredData = downloaddata.filter((pr) => {
        const reviewDate = pr.reviewDate ? new Date(pr.reviewDate) : null;
        return reviewDate && reviewDate >= startDate && reviewDate <= endDate;
      });
  
      console.log("Filtered Data (Review Date):", filteredData);
  
      const csv = filteredData.map((pr: PR) => ({
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
    setLoading3(false);
  }
  else{
    const filteredData =downloaddata
  
    const csv = filteredData.map((pr: PR) => ({
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
  }
  
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
      reviews.map(review => ({ ...review, reviewer }))
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
      // const reviewers = Array.from(new Set(formattedData.map(review => review.reviewer)));

      // console.log("reviewers:",reviewers);
      const githubHandles = ["axic", "gcolvin", "lightclient", "SamWilsn", "xinbenlv", "g11tech", "cdetrio", "Pandapip1", "Souptacular", "wanderer", "MicahZoltu",];

      
      // // Create the initial state for showing reviewers (set all to true by default)
      const initialShowReviewer = githubHandles.reduce(
        (acc, reviewer) => ({ ...acc, [reviewer]: true }), 
        {}
      );
      console.log(initialShowReviewer)
  
      setShowReviewer(initialShowReviewer);
     
      setchart1Data(formattedData);
    } catch (error) {
      console.error("Error during data fetch:", error);
    } finally {
      setLoading(false); // Ensure loading state is set to false in all cases
    }
  };
  
  

  const transformData = (
    data: any[], 
    rev: { [key: string]: boolean },
    formattedData:any[]
  ): any[] => {
    const monthYearData: {
      [key: string]: { 
        [reviewer: string]: { 
          monthYear: string, 
          reviewer: string, 
          count: number, 
          prs: any[] 
        } 
      } 
    } = {};
  
    data.forEach(review => {
      const reviewDate = new Date(review.reviewDate || review.created_at || review.closed_at || review.merged_at);
      
      if (isNaN(reviewDate.getTime())) {
        console.error("Invalid date format for review:", review);
        return;
      }
    
      const key = `${reviewDate.getFullYear()}-${String(reviewDate.getMonth() + 1).padStart(2, '0')}`;
      const reviewer = review.reviewer;
    
      if (!monthYearData[key]) {
        monthYearData[key] = {};
      }
    
      // Check if the reviewer is present in reviewerData
      const reviewerInfo = formattedData.find(r => r.reviewer === reviewer);
      
      if (reviewerInfo) {
        // Check if reviewDate is within the timeline for the reviewer
        const startDate = new Date(reviewerInfo.startDate);
        const endDate = reviewerInfo.endDate ? new Date(reviewerInfo.endDate) : new Date(); // Consider current date if endDate is null
    
        if (reviewDate >= startDate && reviewDate <= endDate) {
          // Proceed to add the review to monthYearData
          if (!monthYearData[key][reviewer]) {
            monthYearData[key][reviewer] = { monthYear: key, reviewer, count: 0, prs: [] };
          }
    
          // Avoid counting duplicate records
          const isDuplicate = monthYearData[key][reviewer].prs.some(pr => pr.prNumber === review.prNumber);
          if (!isDuplicate) {
            monthYearData[key][reviewer].count += 1;
            monthYearData[key][reviewer].prs.push(review);
          }
        }
      } else {
        // If the reviewer is not in reviewerData, continue the process below
        // (You can handle the logic for reviewers not found in reviewerData if needed)
        if (!monthYearData[key][reviewer]) {
          monthYearData[key][reviewer] = { monthYear: key, reviewer, count: 0, prs: [] };
        }
    
        // Avoid counting duplicate records
        const isDuplicate = monthYearData[key][reviewer].prs.some(pr => pr.prNumber === review.prNumber);
        if (!isDuplicate) {
          monthYearData[key][reviewer].count += 1;
          monthYearData[key][reviewer].prs.push(review);
        }
      }
    });
    
  
    const result = Object.entries(monthYearData).flatMap(([monthYear, reviewers]) => 
      Object.values(reviewers).filter((item: { reviewer: string }) => rev[item.reviewer])
    );
  
    return result;
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

// interface LeaderboardChartsProps {
//   data: PRData[];
//   selectedYear: string;
//   selectedMonth: string;
//   renderTable: (year: string, month: string) => JSX.Element;
// }

const getYearlyData = (data: PRData[]) => {
  // Initialize an accumulator to hold yearly data
  const yearlyData: Record<string, number> = data
    .filter(item => {
      // Extract the year from 'monthYear' and check if it falls between 2015 and 2024
      const itemYear = parseInt(item.monthYear.split('-')[0], 10);
      return itemYear >= 2015 && itemYear <= 2024;
    })
    .reduce((acc, item) => {
      // Only count if the reviewer is shown
      if (showReviewer[item.reviewer]) {
        acc[item.reviewer] = (acc[item.reviewer] || 0) + item.count;  // Accumulate the count for each reviewer
      }
      return acc;
    }, {} as Record<string, number>);

  // Sort the data by reviewer count in decreasing order
  const sortedYearlyData = Object.entries(yearlyData)
    .sort(([, a], [, b]) => b - a)  // Sort by count in decreasing order
    .reduce((acc, [reviewer, count]) => {
      acc[reviewer] = count;
      return acc;
    }, {} as Record<string, number>);

  console.log("Combined data from 2015 to 2024:", sortedYearlyData);
  return sortedYearlyData;
};


// Function to filter PR data for the selected month and year
const getMonthlyData = (data: PRData[], year: string | null, month: string) => {
  const monthlyData: Record<string, number> = data
    .filter(item => item.monthYear === `${year}-${month.padStart(2, '0')}`)  // Filter by year and month
    .reduce((acc, item) => {
      // Only count if the reviewer is shown
      if (showReviewer[item.reviewer]) {
        acc[item.reviewer] = (acc[item.reviewer] || 0) + item.count;  // Accumulate the count
      }
      return acc;
    }, {} as Record<string, number>);

  // Sort reviewers by count in decreasing order
  const sortedMonthlyData = Object.entries(monthlyData)
    .sort(([, a], [, b]) => b - a)  // Sort by count in decreasing order
    .reduce((acc, [reviewer, count]) => {
      acc[reviewer] = count;
      return acc;
    }, {} as Record<string, number>);

  console.log("Year:", year, "Month:", month, "Sorted Data:", sortedMonthlyData);
  return sortedMonthlyData;
};

// Function to format data into chart-friendly format
const formatChartData = (rawData: Record<string, number>) => {
  return Object.entries(rawData).map(([reviewer, count]) => ({
    reviewer,
    count,
  }));
};

// Function to configure the Bar chart
// Initialize a global or shared map for reviewer colors
const reviewerColorsMap: Record<string, string> = {};

const getBarChartConfig = (chartData: { reviewer: string; count: number }[]) => {
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
    yAxis: {
      label: {
        formatter: (reviewer: string) => reviewer, // Display reviewer names on Y-axis
      },
    },
    annotations: chartData.map((datum) => ({
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




// // Function to render Leaderboard Charts
const renderCharts = (data: PRData[], selectedYear: string | null, selectedMonth: string | null) => {
  const yearlyData = getYearlyData(data);
  const yearlyChartData = formatChartData(yearlyData);

  return( 
  <Box padding="2rem">
 
    <Flex direction={{ base: "column", md: "row" }} justifyContent="center">
      {/* Yearly Leaderboard Chart */}
      <Box width={{ base: "100%", md: "45%" }} padding="1rem">
        <Flex justifyContent="space-between" alignItems="center" marginBottom="0.5rem">
          <Heading size="md" color="black">
            {`Editors Leaderboard`}
          </Heading>
          {/* Assuming a download option exists for the yearly data as well */}
          <CSVLink 
            data={csvData.length ? csvData : []} 
            filename={`reviews_data.csv`} 
            onClick={(e:any) => {
              generateCSVData2();
              if (csvData.length === 0) {
                e.preventDefault(); 
                console.error("CSV data is empty or not generated correctly.");
              }
            }}
          >
            <Button colorScheme="blue">{loading3 ? <Spinner size="sm" /> : "Download CSV"}</Button>
          </CSVLink>
        </Flex>
        <br/>
        <Bar {...getBarChartConfig(yearlyChartData)} />
      </Box>
    </Flex>
  
</Box>
)
};


const renderCharts2 = (data: PRData[], selectedYear: string | null, selectedMonth: string | null) => {
  
  
  let monthlyChartData: any; // Declare monthlyChartData
  if (selectedMonth != null) {
    const monthlyData = getMonthlyData(data, selectedYear, selectedMonth);
    monthlyChartData = formatChartData(monthlyData); // Assign to the declared variable
  }

  // const yearlyChartData = formatChartData(yearlyData);

  return( 
  <Box padding="2rem">
  {selectedYear && selectedMonth && monthlyChartData && ( // Check if monthlyChartData is defined
    <Flex direction={{ base: "column", md: "row" }} justifyContent="center">
    {/* Yearly Leaderboard Chart */}
    <Box width={{ base: "100%", md: "45%" }} padding="1rem">
      <Flex justifyContent="space-between" alignItems="center" marginBottom="0.5rem">
        <Heading size="md" color="black">
            {`Editors Leaderboard (Monthly)`}
          </Heading>
          <CSVLink 
            data={csvData.length ? csvData : []} 
            filename={`reviews_${selectedYear}_${selectedMonth}.csv`} 
            onClick={(e:any) => {
              generateCSVData();
              if (csvData.length === 0) {
                e.preventDefault(); 
                console.error("CSV data is empty or not generated correctly.");
              }
            }}
          >
            <Button colorScheme="blue">{loading3 ? <Spinner size="sm" /> : "Download CSV"}</Button>
          </CSVLink>
        </Flex>
        <br/>
        <Bar {...getBarChartConfig(monthlyChartData)} />
      </Box>
    </Flex>
  )}
  
</Box>
)
};


const transformAndGroupData = (data: any[]): ReviewData[] => {
  const groupedData: GroupedData = data.reduce((acc, item) => {
    const { monthYear, reviewer, count } = item;
    
    if (!acc[monthYear]) {
      acc[monthYear] = {};
    }
    
    if (!acc[monthYear][reviewer]) {
      acc[monthYear][reviewer] = { monthYear, reviewer, count: 0 };
    }
    
    acc[monthYear][reviewer].count += count;
    // acc[monthYear][reviewer].prs = [...acc[monthYear][reviewer].prs];
    
    return acc;
  }, {} as GroupedData);

  return Object.entries(groupedData).flatMap(([monthYear, reviewers]) =>
    Object.values(reviewers) // TypeScript should now infer this correctly
  );
};

type ReviewDatum = {
  monthYear: string;
  count: number;
  reviewer: string;
};

const renderChart = () => {
  const dataToUse = handleFilterData(); // Assuming 'data' is accessible in the scope
  console.log("data to use:",dataToUse)
  const filteredData = dataToUse.filter(item =>
    Object.keys(showReviewer) // Get the list of reviewers from showReviewer
      .filter(reviewer => showReviewer[reviewer]) // Only include checked reviewers
      .includes(item.reviewer) // Check if the item reviewer is in the list of checked reviewers
  );

  const generateDistinctColor = (index: number, total: number) => {
    const hue = (index * (360 / total)) % 360;  // Golden angle for better color distribution
    return `hsl(${hue}, 85%, 50%)`; // High saturation and medium brightness for vibrancy
  };

  // Assign colors if not already assigned
  const reviewers = Array.from(new Set(filteredData.map(item => item.reviewer)));
  const totalReviewers = reviewers.length;
  filteredData.forEach((item, index) => {
    if (!reviewerColorsMap[item.reviewer]) {
      // Assign a new color only if the reviewer doesn't already have one
      reviewerColorsMap[item.reviewer] = generateDistinctColor(Object.keys(reviewerColorsMap).length, totalReviewers);
    }
  });
  console.log("filtered data:", filteredData);
  // Transform and group the filtered data based on your business logic
  const transformedData = transformAndGroupData(filteredData);
  console.log(transformedData);

  // Sort the transformed data by monthYear
  const sortedData = transformedData.sort((a, b) => a.monthYear.localeCompare(b.monthYear));

  console.log("sorted data:", sortedData);

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
        console.log('Slider moved to:', value);
      },
    },
    legend: { position: "top-right" as const }, // Legend position
    smooth: true, // Smooth transition
  };

  // Render the Column chart with the provided config
  return <Column {...config} />;
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

        console.log("result:",result[0].PRs);

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

      console.log("Combined PRs:", combinedPRs);

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
    console.log(data);
    const filteredData = data;

        console.log("filtered data:",filteredData);

    return (
        <Box mt={8} overflowX="auto" overflowY="auto" maxHeight="600px" border="2px solid #e2e8f0" borderRadius="10px 10px 10px 10px" boxShadow="lg">
            <Table >
                <Thead p="8px" bg="black">
                    <Tr>
                        <Th p="8px" color="white" textAlign="center" verticalAlign="middle"  borderTopLeftRadius="10px">
                            PR Number
                        </Th>
                        <Th p="8px" color="white" textAlign="center" verticalAlign="middle" >
                            Title
                        </Th>
                        <Th p="8px" color="white" textAlign="center" verticalAlign="middle" >
                            Reviewed By
                        </Th>
                        <Th p="8px" color="white" textAlign="center" verticalAlign="middle" >
                            Review Date
                        </Th>
                        <Th p="8px" color="white" textAlign="center" verticalAlign="middle" >
                            Created Date
                        </Th>
                        <Th p="8px" color="white" textAlign="center" verticalAlign="middle" >
                            Closed Date
                        </Th>
                        <Th p="8px" color="white" textAlign="center" verticalAlign="middle" >
                            Merged Date
                        </Th>
                        <Th p="8px" color="white" textAlign="center" verticalAlign="middle" >
                            Status
                        </Th>
                        <Th p="8px" color="white" textAlign="center" verticalAlign="middle"  borderTopRightRadius="10px">
                            Link
                        </Th>
                    </Tr>
                </Thead>
                </Table>
                <Table variant="striped" colorScheme="gray" >
                <Tbody>
                    {filteredData.map((pr, index) => {
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
                                    <Button
                                        as="a"
                                        href={`/PR/${pr.repo}/${pr.prNumber}`}
                                        target="_blank"
                                        colorScheme="blue"
                                        variant="solid"
                                    >
                                        Pull Request
                                    </Button>
                                </Td>
                            </Tr>
                        );
                    })}
                </Tbody>
            </Table>
        </Box>
    );
};


  return (
    loading ? (
      <LoaderComponent />
    ) : (
      <AllLayout>
        {/* <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            > */}
        <Box padding={8} margin={8}>
          <Heading
            size="xl"
            marginBottom={10}
            textAlign="center" style={{ color: '#42a5f5', fontSize: '2.5rem', fontWeight: 'bold', }} > Editors Leaderboard</Heading>


<Box
      pl={4}
      bg={useColorModeValue("blue.50", "gray.700")}
      borderRadius="md"
      pr="8px"
      marginBottom={2}
    >
      <Flex justify="space-between" align="center">
        <Heading
          as="h3"
          size="lg"
          marginBottom={4}
          color={useColorModeValue("#3182CE", "blue.300")}
        > Editors Leaderboard FAQ
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
    h="24px" // Smaller height
     w="20px"
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
          This tool provides a comprehensive overview of all EIP editor reviews conducted to date. 
          It displays the total number of reviews each month for each editor, allowing you to easily track and analyze review activity across different months and editors.
        </Text>

        <Heading
          as="h4"
          size="md"
          marginBottom={4}
          color={useColorModeValue("#3182CE", "blue.300")}
        >
          How can I view data for a specific Month?
        </Heading>
        <Text
          fontSize="md"
          marginBottom={2}
          color={useColorModeValue("gray.800", "gray.200")}
          className="text-justify"
        >
          To view data for a specific month, you can use the timeline scroll bar or click the View More button. 
          From there, select the desired Year and Month using the dropdown menus, and the table and graph will automatically update to display data for that selected month.
        </Text>

        <Heading
          as="h4"
          size="md"
          marginBottom={4}
          color={useColorModeValue("#3182CE", "blue.300")}
        >
          How can I view data for a specific EIP Editor?
        </Heading>
        <Text
          fontSize="md"
          color={useColorModeValue("gray.800", "gray.200")}
          className="text-justify"
        >
          You can refine the data by selecting or deselecting specific editors from the checkbox list. 
          This will filter the chart and table to show data only for the selected editors, enabling you to focus on individual contributions.
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


      {/* <Flex justify="center" mb={8}>
      <Button colorScheme="blue" onClick={() => setActiveTab('all')} isActive={activeTab === 'all'}>
          ALL
        </Button>
        <Button colorScheme="blue" onClick={() => setActiveTab('eips')} isActive={activeTab === 'eips'} ml={4}>
          EIPs
        </Button>
        <Button colorScheme="blue" onClick={() => setActiveTab('ercs')} isActive={activeTab === 'ercs'} ml={4}>
          ERCs
        </Button>
        <Button colorScheme="blue" onClick={() => setActiveTab('rips')} isActive={activeTab === 'rips'} ml={4}>
          RIPs
        </Button>
      </Flex> */}
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
      {/* Option for all */}
      <MenuItem onClick={() => setActiveTab('all')}>
        ALL
      </MenuItem>

      {/* Option for EIPs */}
      <MenuItem onClick={() => setActiveTab('eips')}>
        EIPs
      </MenuItem>

      {/* Option for ERCs */}
      <MenuItem onClick={() => setActiveTab('ercs')}>
        ERCs
      </MenuItem>

      {/* Option for RIPs */}
      <MenuItem onClick={() => setActiveTab('rips')}>
        RIPs
      </MenuItem>
    </MenuList>
  </Menu>
</Flex>

     
        <Box padding="2rem" borderRadius="0.55rem">
          <Box
            bgColor={bg}
            padding="2rem"
            borderRadius="0.55rem"
            _hover={{
              border: "1px",
              borderColor: "#30A0E0",
            }}
          >

        
            
            <Box className="w-full">
              {renderCharts(chart1data, selectedYear, selectedMonth)}
              <DateTime />
            </Box>
          </Box>
          <br />
          <br />
        </Box>
 

        <Box
  bgColor={bg}
  padding="2rem"
  borderRadius="0.55rem"
  _hover={{
    border: "1px",
    borderColor: "#30A0E0",
  }}
>
  <Box className={"w-full"}>
    <Flex justifyContent="space-between" alignItems="center" marginBottom="0.5rem">
      <Heading size="md" color="black">
        {`PRs Reviewed (Monthly, since 2015)`}
      </Heading>
      <Flex alignItems="center">
        <CSVLink
          data={csvData.length ? csvData : []}
          filename={`reviews_data_since_2015.csv`}
          onClick={(e: any) => {
            generateCSVData2();
            if (csvData.length === 0) {
              e.preventDefault();
              console.error("CSV data is empty or not generated correctly.");
            }
          }}
        >
          <Button colorScheme="blue" mr="1rem">
            {loading3 ? <Spinner size="sm" /> : "Download CSV"}
          </Button>
        </CSVLink>
        <Button
          colorScheme="blue"
          onClick={() => setShowFilters(!showFilters)}
          leftIcon={showFilters ? <AiOutlineClose /> : <FiFilter />}
        >
          {showFilters ? "Hide Filters" : "Show Filters"}
        </Button>
      </Flex>
    </Flex>

    {/* Filters Section */}
    {showFilters && (
      <Box
        bg="blue.50"
        borderRadius="md"
        p={4}
        mt="1rem"
      >
        <Flex justifyContent="flex-start" gap="2rem" mb="1rem">
          {/* Start Date Filters */}
          <Box>
            <Heading size="sm" mb="0.5rem" color="black">Start Date</Heading>
            <Flex>
              <Select
                placeholder="Year"
                value={selectedStartYear || ''}
                onChange={(e) => setSelectedStartYear(e.target.value)}
                mr="1rem"
                bg="white"
                color="black"
              >
                {Array.from({ length: 2024 - 2015 + 1 }, (_, i) => (2015 + i).toString()).map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </Select>
              <Select
                placeholder="Month"
                value={selectedStartMonth || ''}
                onChange={(e) => setSelectedStartMonth(e.target.value)}
                bg="white"
                color="black"
              >
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
                ].map((month) => (
                  <option key={month.value} value={month.value}>
                    {month.name}
                  </option>
                ))}
              </Select>
            </Flex>
          </Box>

          {/* End Date Filters */}
          <Box>
            <Heading size="sm" mb="0.5rem" color="black">End Date</Heading>
            <Flex>
              <Select
                placeholder="Year"
                value={selectedEndYear || ''}
                onChange={(e) => setSelectedEndYear(e.target.value)}
                mr="1rem"
                bg="white"
                color="black"
              >
                {Array.from({ length: 2024 - 2015 + 1 }, (_, i) => (2015 + i).toString()).map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </Select>
              <Select
                placeholder="Month"
                value={selectedEndMonth || ''}
                onChange={(e) => setSelectedEndMonth(e.target.value)}
                bg="white"
                color="black"
              >
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
                ].map((month) => (
                  <option key={month.value} value={month.value}>
                    {month.name}
                  </option>
                ))}
              </Select>
            </Flex>
          </Box>
        </Flex>
        {/* <Button colorScheme="blue" onClick={renderChart}>
          Apply Filters
        </Button> */}
      </Box>
    )}

    {/* Chart Rendering */}
    {renderChart()}
    <DateTime />
  </Box>
</Box>



          
      <Box>
      <Text color="gray.500" fontStyle="italic" textAlign="center">
          *Please note: The data is refreshed every 24 hours to ensure accuracy and up-to-date information*
        </Text>
      </Box>
      
      <br/>
     
      <Flex justify="center">
      <HStack spacing={4}>
         {/* Reviewer Selection */}
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
        {/* Deselect all reviewers */}
        <MenuItem onClick={deselectAllReviewers}>
          <Text as="span" fontWeight="bold" textDecoration="underline">
            Remove All
          </Text>
        </MenuItem>

        {/* Select all reviewers */}
        <MenuItem onClick={selectAllReviewers}>
          <Text as="span" fontWeight="bold" textDecoration="underline">
          Emeritus Editors
          </Text>
        </MenuItem>

        {/* Select only active reviewers */}
        <MenuItem onClick={selectActiveReviewers}>
          <Text as="span" fontWeight="bold" textDecoration="underline">
            Active Editors
          </Text>
        </MenuItem>

        {/* Render each reviewer with a checkbox */}
        {Object.keys(showReviewer).map((reviewer) => (
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
        <HStack spacing={4}>
        <Box display="flex" justifyContent="center" gap="1rem">
          
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
                      setSelectedMonth(null); 
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
        </Box>
        </HStack>
      )}
       </HStack>
      </Flex>

      {selectedMonth && (
        <Box padding="2rem" borderRadius="0.55rem">
          <Box
            bgColor={bg}
            padding="2rem"
            borderRadius="0.55rem"
            _hover={{
              border: "1px",
              borderColor: "#30A0E0",
            }}
          >
            <Box className="w-full">
              {renderCharts2(chart1data, selectedYear, selectedMonth)}
              <DateTime />
            </Box>
          </Box>
        </Box>
      )}

      {showDropdown && ( 
        <>
      
            {selectedYear && selectedMonth && (
                <Box mt={8}>
                  {/* Download CSV section */}
                  <Box padding={4} bg="blue.50" borderRadius="md" marginBottom={8}>
                    <Text fontSize="lg"
                      marginBottom={2}
                      color={useColorModeValue("gray.800", "gray.200")}>
                      You can download the data here:
                    </Text>
                    <CSVLink 
                      data={csvData.length ? csvData : []} 
                      filename={`reviews_${selectedYear}_${selectedMonth}.csv`} 
                      onClick={(e:any) => {
                        generateCSVData();
                        if (csvData.length === 0) {
                          e.preventDefault(); 
                          console.error("CSV data is empty or not generated correctly.");
                        }
                      }}
                    >
                       <Button colorScheme="blue">{loading2 ? <Spinner size="sm" /> : "Download CSV"}</Button>
                    </CSVLink>
                  </Box>
                </Box>
            )}

            {selectedYear && selectedMonth && (
              <Box mt={8}>
                {renderTable(selectedYear, selectedMonth, showReviewer)}
              </Box>
            )}
    </>
    )}
    <Box>
          <br/>
        <hr></hr>
        <br/>
        <Text fontSize="3xl" fontWeight="bold">Comments</Text>
          <Comments page={"Reviewers"}/>
        </Box>
    </Box>
    {/* </motion.div> */}
  </AllLayout>
)
); };





export default ReviewTracker;
