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
import { LineConfig } from '@ant-design/plots';
import axios from "axios";
import dayjs from "dayjs";
// import { Bar } from "@ant-design/charts";
// import { Line } from '@ant-design/charts';  // Import the Line chart component

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
  const [sliderValue2, setSliderValue2] = useState([0, 1]);
  const [sliderValue3, setSliderValue3] = useState<number>(0);
  const [sliderValue4, setSliderValue4] = useState<number>(0);
  const [Linechart, setLinechart] = useState<boolean>(false);
  const [loading4, setLoading4] = useState<boolean>(false);

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
    const currentYear = new Date().getFullYear();
    const currentMonth = String(new Date().getMonth() + 1).padStart(2, "0");

    // Set default values for start and end dates
    const startDate = `${selectedStartYear || "2015"}-${selectedStartMonth || "01"}`;
    const endDate = `${selectedEndYear || currentYear}-${selectedEndMonth || currentMonth}`;

    // Filter only if start or end date is provided
    if (startDate && endDate) {
        const filteredData = chart1data.filter((item) => {
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
    
    const filteredData =downloaddata;
  
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
    }));

    setCsvData(csv); 
 
};

const generateCSVData5 = () => {

  console.log("selected start:",selectedStartYear);
  console.log("selected start month:",selectedStartMonth);
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

    console.log("start date:", startDate);
    console.log("end date:",endDate);

    // Adjust end date to include the entire month
    endDate.setMonth(endDate.getMonth() + 1);
    endDate.setDate(0); // Last day of the month

    console.log("download data 5:", downloaddata)

    const filteredData = downloaddata.filter((pr) => {
      const reviewDate = pr.reviewDate ? new Date(pr.reviewDate) : null;
      const shouldIncludeReviewer = pr.reviewer && showReviewer[pr.reviewer];
      return (
        shouldIncludeReviewer &&
        reviewDate &&
        reviewDate >= startDate &&
        reviewDate <= endDate
      );
    });
    console.log("Filtered Data 5:", filteredData);

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
  // setLoading3(false);
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
    const filteredData = downloaddata.filter((pr) => {
      const reviewDate = pr.reviewDate ? new Date(pr.reviewDate) : null;
      return (
        reviewDate &&
        reviewDate >= startDate &&
        reviewDate <= endDate &&
        (reviewer ? pr.reviewer === reviewer : true) // Filter by reviewer if provided
      );
    });

    // Map the filtered data to CSV format
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
    }));

    setCsvData(csv);
  } else {
    // If no date range is selected, use all data and filter by reviewer if provided
    const filteredData = downloaddata.filter((pr) => 
      reviewer ? pr.reviewer === reviewer : true // Filter by reviewer if provided
    );

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
      // console.log(initialShowReviewer)
  
      setShowReviewer(initialShowReviewer);
     
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

  // console.log("Combined data from 2015 to 2024:", sortedYearlyData);
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

  // console.log("Year:", year, "Month:", month, "Sorted Data:", sortedMonthlyData);
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
            // onClick={(e:any) => {
            //   generateCSVData2();
            //   if (csvData.length === 0) {
            //     e.preventDefault(); 
            //     console.error("CSV data is empty or not generated correctly.");
            //   }
            // }}
            onClick={async () => {
              try {
                // Trigger the CSV conversion and download
                generateCSVData2();
          
                // Trigger the API call
                await axios.post("/api/DownloadCounter");
              } catch (error) {
                console.error("Error triggering download counter:", error);
              }
            }}
          >
            <Button fontSize={{ base: "0.6rem", md: "md" }}  colorScheme="blue">{loading3 ? <Spinner size="sm" /> : "Download CSV"}</Button>
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
            // onClick={(e:any) => {
            //   generateCSVData();
            //   if (csvData.length === 0) {
            //     e.preventDefault(); 
            //     console.error("CSV data is empty or not generated correctly.");
            //   }
            // }}
            onClick={async () => {
              try {
                // Trigger the CSV conversion and download
                generateCSVData();
          
                // Trigger the API call
                await axios.post("/api/DownloadCounter");
              } catch (error) {
                console.error("Error triggering download counter:", error);
              }
            }}
          >
            <Button colorScheme="blue" fontSize={{ base: "0.6rem", md: "md" }} >{loading3 ? <Spinner size="sm" /> : "Download CSV"}</Button>
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
  // console.log("data to use:",dataToUse)
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
  // console.log("filtered data:", filteredData);
  // Transform and group the filtered data based on your business logic
  const transformedData = transformAndGroupData(filteredData);
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

  // console.log("filtered data:", filteredData);

  // Transform and group the filtered data based on your business logic
  const transformedData = transformAndGroupData(filteredData);

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


const renderCharts3 = () => {
  const dataToUse = handleFilterData(); // Assuming 'data' is accessible in the scope
  const filteredData = dataToUse.filter(item =>
    Object.keys(showReviewer)
      .filter(reviewer => showReviewer[reviewer])
      .includes(item.reviewer)
  );

  const generateMonthYearRange = (start: string, end: string) => {
    const range = [];
    let current = dayjs(start);
    const endDate = dayjs(end);
  
    while (current.isBefore(endDate) || current.isSame(endDate)) {
      range.push(current.format("YYYY-MM"));
      current = current.add(1, "month");
    }
  
    return range;
  };
  
  const completeXAxisRange = generateMonthYearRange("2019-05", dayjs().format("YYYY-MM"));

  // Assign colors to reviewers
  const reviewers = Array.from(new Set(filteredData.map(item => item.reviewer)));
  const totalReviewers = reviewers.length;
  filteredData.forEach((item, index) => {
    if (!reviewerColorsMap[item.reviewer]) {
      reviewerColorsMap[item.reviewer] = `hsl(${(index * (360 / totalReviewers)) % 360}, 85%, 50%)`;
    }
  });
  // console.log(reviewerColorsMap)
const filledData = reviewers.flatMap((reviewer) => {
  const reviewerData = filteredData.filter((item) => item.reviewer === reviewer);
  const dataMap = new Map(reviewerData.map((item) => [item.monthYear, item]));

  return completeXAxisRange.map((monthYear) => ({
    monthYear,
    reviewer,
    count: dataMap.get(monthYear)?.count || 0, // Default to 0 if missing
  }));
});

// Generate chart configurations for each reviewer
const reviewerCharts = reviewers.map((reviewer) => {
  const reviewerData = filledData.filter((item) => item.reviewer === reviewer);

    const config = {
      data: reviewerData,
      xField: "monthYear",
      yField: "count",
      seriesField: "reviewer",
      geometryOptions: [
        {
          geometry: "line",
          smooth: true,
          lineStyle: {
            stroke: reviewerColorsMap[reviewer],
            lineWidth: 4,
          },
        },
      ],
      xAxis: { label: { rotate: -45 } }, // Rotate X-axis labels for better readability
      yAxis: {
        max: 110, // Set a fixed maximum value for the Y-axis
        min: 0, // Ensure the Y-axis always starts at 0
        label: {
          formatter: (text: string) => {
            const value = parseFloat(text);
            return !isNaN(value) ? value.toFixed(0) : text;
          },
        },
      },
      slider: {
        start: sliderValue2[0], // Start value for the slider
        end: sliderValue2[1], // End value for the slider
        step: 0.01, // Define the step value for the slider
        min: 0, // Minimum value for the slider
        max: 1, // Maximum value for the slider
        onChange: (value: [number, number]) => {
          setSliderValue2(value); // Update state when slider value changes
        },
        onAfterChange: (value: [number, number]) => {
          // console.log("Slider moved to:", value);
        },
      },
      legend: { position: 'top-right' as const },
    };

    return (
      <Box
  key={reviewer}
  bgColor={bg}
  padding="2rem"
  borderRadius="0.55rem"
  _hover={{
    border: "1px",
    borderColor: "#30A0E0",
  }}
  style={{ flex: "1 0 45%", minWidth: "300px", margin: "10px" }}
>
  {/* Reviewer Name and CSV Download Button */}
  <Flex justifyContent="space-between" alignItems="center" marginBottom="0.5rem">
  {/* Reviewer Info (Image and GitHub Handle Link) */}
  <Flex alignItems="center">
    <img
      src={`https://github.com/${reviewer}.png?size=24`}
      alt={`${reviewer}'s avatar`}
      style={{
        marginRight: "8px",
        width: "48px",
        height: "48px",
        borderRadius: "50%",
      }}
    />
    <a
      href={`https://github.com/${reviewer}`}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        fontWeight: "bold",
        fontSize: "1rem",
        textDecoration: "none",
        color: "black",
      }}
    >
      {reviewer}
    </a>
  </Flex>

  {/* CSV Download Button */}
  <CSVLink
    data={csvData.length ? csvData : []}
    filename={`${reviewer}_reviews_data.csv`}
    // onClick={(e: any) => {
    //   generateCSVData3(reviewer); // Pass the reviewer name to generateCSVData3
    //   if (csvData.length === 0) {
    //     e.preventDefault();
    //     console.error("CSV data is empty or not generated correctly.");
    //   }
    // }}
    onClick={async () => {
      try {
        // Trigger the CSV conversion and download
        generateCSVData3(reviewer);
  
        // Trigger the API call
        await axios.post("/api/DownloadCounter");
      } catch (error) {
        console.error("Error triggering download counter:", error);
      }
    }}
  >
    <Button colorScheme="blue" fontSize={{ base: "0.6rem", md: "md" }} >
      {loading3 ? <Spinner size="sm" /> : "Download CSV"}
    </Button>
  </CSVLink>
</Flex>


  {/* Chart Component */}
  {/* <Box className="w-full" style={{ textAlign: "center" }}>
    <h3>{reviewer}</h3>
  </Box> */}
  <Line {...config} />

  {/* DateTime Component */}
  <Box className="w-full" style={{ marginTop: "20px" }}>
    <DateTime />
  </Box>
</Box>

    );
  });

  // Render charts in a responsive grid layout
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-around",
        gap: "20px",
      }}
    >
      {reviewerCharts}
    </div>
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
    const filteredData = data;

        // console.log("filtered data:",filteredData);

    return (
        <Box mt={8} overflowX="auto" overflowY="auto" maxHeight="600px" border="2px solid #e2e8f0" borderRadius="10px 10px 10px 10px" boxShadow="lg">
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

    // Format the timeline data for easy access
    const timelineMap = timelines.reduce((map: any, reviewer: any) => {
      map[reviewer.reviewer] = {
        startDate: new Date(reviewer.startDate),
        endDate: reviewer.endDate ? new Date(reviewer.endDate) : null, // null means no end date
      };
      return map;
    }, {});

    // Step 3: Filter reviews based on timeline
    const filteredData = Object.keys(data).reduce((filtered: ReviewerData, reviewerName: string) => {
      if (!timelineMap[reviewerName]) return filtered; // Skip if no timeline info available

      const { startDate, endDate } = timelineMap[reviewerName];
      const reviews = data[reviewerName].filter((review: PRInfo) => {
        const reviewDate = new Date(review.reviewDate);
        return reviewDate >= startDate && (!endDate || reviewDate <= endDate); // Check if within timeline
      });

      if (reviews.length > 0) {
        filtered[reviewerName] = reviews; // Include only reviewers with valid reviews
      }
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
    console.log("eip data:",formattedData1)

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
  console.log("active data:",activeData);
  console.log("start:",startDate);
  console.log("end:",endDate)

  const filteredData:any = [];
  for (const reviewerName in activeData) {
    const reviews = activeData[reviewerName];
    reviews.forEach((pr: PRInfo) => {
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

  const convertTo24Hour = (time: string): string => {
    const [hours, minutes, period] = time.match(/(\d+):(\d+)\s?(AM|PM)/i)!.slice(1);
    let hh = parseInt(hours, 10);
    if (period.toUpperCase() === "PM" && hh !== 12) hh += 12;
    if (period.toUpperCase() === "AM" && hh === 12) hh = 0;
    return `${hh.toString().padStart(2, "0")}:${minutes}`;
  };

  const processedData = activityData.map((item: any) => ({
    ...item,
    timeIn24Hour: convertTo24Hour(item.formattedTime),
  }));

  processedData.sort((a: any, b: any) =>
    a.timeIn24Hour.localeCompare(b.timeIn24Hour)
  );

  const reviewers = [...new Set(processedData.map((item: any) => item.reviewer))];
  const reviewerColors: { [key: string]: string } = {};
  reviewers.forEach((reviewer, index) => {
    reviewerColors[reviewer as string] = generateDistinctColor(index, reviewers.length);
  });

  const scatterConfig = {
    data: processedData,
    xField: "timeIn24Hour",
    yField: "reviewer",
    colorField: "reviewer",
    size: 7,
    pointStyle: ({ reviewer }: any) => ({
      fill: reviewerColors[reviewer] || "#000",
      fillOpacity: 0.7,
      stroke: reviewerColors[reviewer] || "#000", // Match stroke to fill color
      lineWidth: 0.5, // Thinner border for better readability
    }),
    xAxis: {
      title: {
        text: "Time (24-hour format)",
      },
      tickCount: 9,
    },
    yAxis: {
      title: {
        text: "Reviewer",
      },
    },
    tooltip: {
      formatter: (datum: any) => ({
        name: "Reviewer",
        value: `${datum.reviewer} at ${datum.timeIn24Hour}`,
      }),
    },
    slider: {
      start: sliderValue3, // Set the start value from the state
      end: 1, // End of the slider
      step: 0.01, // Define the step value for the slider
      min: 0, // Minimum value for the slider
      max: 1, // Maximum value for the slider
      onChange: (value:any) => {
        setSliderValue3(value); // Update state when slider value changes
      },
      // Optionally handle when sliding stops
      onAfterChange: (value:any) => {
        // Perform any additional actions after the slider is changed
        // console.log('Slider moved to:', value);
      },
    },
  };
  

  return (
    <Box padding="1rem" overflowX="auto">
      {loading4 ? (
        <Flex justify="center" align="center" height="100vh">
        <Spinner size="xl" />
      </Flex>
    ) : (
      <div>
        <Scatter {...scatterConfig} />
      </div>
      )}
    </Box>
  );
};


const editorsSpecialityChart = () => {

  const processData1 = getYearlyData(eipdata);
  const yearlyChartData1 = formatChartData(processData1);
  const processData2 = getYearlyData(ercdata);
  const yearlyChartData2 = formatChartData(processData2);
  const processData3 = getYearlyData(ripdata);
  const yearlyChartData3 = formatChartData(processData3);
  console.log("new chart data:",yearlyChartData1)

  const targetReviewers = ["lightclient", "SamWilsn", "xinbenlv", "g11tech"];

  // Step 1: Filter the data to include only target reviewers
  const filteredEIPData = yearlyChartData1.filter((item) =>
    targetReviewers.includes(item.reviewer)
  );
  const filteredERCData = yearlyChartData2.filter((item) =>
    targetReviewers.includes(item.reviewer)
  );
  const filteredRIPData = yearlyChartData3.filter((item) =>
    targetReviewers.includes(item.reviewer)
  );
  console.log("filtered data spec:", filteredEIPData)
  console.log("eip data spec:", eipdata);

  // Step 2: Combine and format the data for the chart
  const chartData = [
    ...filteredEIPData.map((item) => ({
      reviewer: item.reviewer,
      repo: "EIPs",
      value: item.count,
    })),
    ...filteredERCData.map((item) => ({
      reviewer: item.reviewer,
      repo: "ERCs",
      value: item.count,
    })),
    ...filteredRIPData.map((item) => ({
      reviewer: item.reviewer,
      repo: "RIPs",
      value: item.count,
    })),
  ];

  console.log("chart data spec:", chartData)

  // Step 3: Define the Column chart configuration
  const columnConfig = {
    data: chartData,
    xField: 'reviewer',  // Reviewer names will be on the x-axis
    yField: 'value',     // The count of PRs for each repo category
    isGroup: true,       // Group the bars based on the repo categories
    seriesField: 'repo', // Use the repo field to differentiate between EIPs, ERCs, RIPs
    color: ['#1890FF', '#52C41A', '#FF4D4F'], // Colors for EIPs, ERCs, and RIPs
    yAxis: {
      title: {
        text: 'Number of PRs reviewed',
      },
    },
    tooltip: {
      formatter: (datum: any) => ({
        name: datum.reviewer,
        value: `${datum.repo}: ${datum.value} PRs`,
      }),
    },
    legend: { position: "top-right" as const },
  };

  return (
    <Box padding="1rem">
      {loading5 ? (
        <Flex justify="center" align="center" height="100vh">
          <Spinner size="xl" />
        </Flex>
      ) : (
        <Box height="400px">
          <Column {...columnConfig} />
        </Box>
      )}
    </Box>
  );
};



// Generate distinct colors for editors
const generateDistinctColor = (index: number, total: number) => {
  const hue = (index * (360 / total)) % 360; // Golden angle for better color distribution
  return `hsl(${hue}, 85%, 50%)`; // High saturation and medium brightness for vibrancy
};


  return (
    loading ? (
      <LoaderComponent />
    ) : (
      <AllLayout>
        
        <Box 
        padding={{ base: 1, md: 4 }}
        margin={{ base: 2, md: 4 }}
        >
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
        <br/>
        <Text
          fontSize="md"
          color={useColorModeValue("gray.800", "gray.200")}
          className="text-justify"
        >
          Note: The reviews made by the editor during their active time as an editor are considered for plotting the charts 
        </Text>
        <br/>
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
            bgColor={bg}
            // padding="2rem"
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
  {/* The part that is breaking start */}
  <Box className={"w-full"}>
    <Flex justifyContent="space-between" alignItems="center" marginBottom="0.5rem">
      <Heading size="md" color="black">
        {`PRs Reviewed (Monthly, since 2015)`}
      </Heading>
      <Flex alignItems="center">
        <CSVLink
          data={csvData.length ? csvData : []}
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
          data={csvData.length ? csvData : []}
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
                {Array.from({ length: 2024 - 2015 + 1 }, (_, i) => (2015 + i).toString()).map((year) => (
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
                ].map((month) => (
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
                {Array.from({ length: 2024 - 2015 + 1 }, (_, i) => (2015 + i).toString()).map((year) => (
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
                ].map((month) => (
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
                Emeritus Editors
                </Text>
              </MenuItem>

              
              <MenuItem onClick={selectActiveReviewers}>
                <Text as="span" fontWeight="bold" textDecoration="underline">
                  Active Editors
                </Text>
              </MenuItem>

              
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
        </Box>
        </Flex>
       
      </Box>
    )}

   
    {Linechart ? renderChart4() : renderChart()}
    <DateTime />
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

        
        <MenuItem onClick={selectAllReviewers}>
          <Text as="span" fontWeight="bold" textDecoration="underline">
          Emeritus Editors
          </Text>
        </MenuItem>

        
        <MenuItem onClick={selectActiveReviewers}>
          <Text as="span" fontWeight="bold" textDecoration="underline">
            Active Editors
          </Text>
        </MenuItem>

        
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
        // <HStack spacing={4}>
        <Box display={{ base: "none", md: "flex" }} justifyContent="center" gap="1rem">
          
            
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
        // </HStack>
      )}
       </HStack>
      </Flex>

      <Flex justify="center" mt={4}>
        
      <HStack spacing={4}>
         
       
        

      {showDropdown && (
        <HStack spacing={4}>
        <Box display={{ base: "flex", md: "none" }} justifyContent="center" gap="1rem">
          
            
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
      <br/>

      {selectedMonth && (
        <Box padding="0.5rem" borderRadius="0.55rem">
          <Box
            bgColor={bg}
            // padding="2rem"
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
                 
                  <Box padding={4} bg="blue.50" borderRadius="md" marginBottom={8}>
                    <Text fontSize="lg"
                      marginBottom={2}
                      color={useColorModeValue("gray.800", "gray.200")}>
                      You can download the data here:
                    </Text>
                    <CSVLink 
                      data={csvData.length ? csvData : []} 
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
                       <Button colorScheme="blue" fontSize={{ base: "0.6rem", md: "md" }} >{loading2 ? <Spinner size="sm" /> : "Download CSV"}</Button>
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
            <br/>
            <Box className="w-full">
              {renderCharts3()} 
            </Box>
            <br/>

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

            <Flex justifyContent="space-between" alignItems="center" marginBottom="0.5rem">
            <Heading
              as="h3"
              size="lg"
              marginBottom={2}
              marginTop={2}
              fontWeight="bold"
              color={useColorModeValue("#3182CE", "blue.300")}
            > Active Editors Timeline Scatterplot
            </Heading>
              <Flex alignItems="center">
                <Button
                  colorScheme="blue"
                  onClick={() => setShowFilters2(!showFilters2)}
                  leftIcon={showFilters ? <AiOutlineClose /> : <FiFilter />}
                  fontSize={{ base: "0.6rem", md: "md" }} 
                  mr="1rem"
                >
                  {showFilters2 ? "Hide Filters" : "Show Filters"}
                </Button>
              </Flex>
            </Flex>

            {showFilters2 && (
      <Box
        bg="blue.50"
        borderRadius="md"
        p={4}
        mt="1rem"
      >
        <Flex justifyContent="flex-start" flexDirection={{ base: "column", md: "row" }} gap="2rem" mb="1rem">
          
          <Box>
            <Heading size="sm" mb="0.5rem" color="black">Start Date</Heading>
            <Flex>
            <HStack spacing={4}>
            <Menu>
              <MenuButton as={Button} rightIcon={<ChevronDownIcon />} colorScheme="blue">
                {selectedStartYear2 ? `${selectedStartYear2}` : 'Select Year'}
              </MenuButton>
              <MenuList bg="white" color="black" borderColor="blue.500">
                {Array.from({ length: 2024 - 2015 + 1 }, (_, i) => (2015 + i).toString()).map((year) => (
                  <MenuItem key={year} onClick={() => setSelectedStartYear2(year)} bg="white" color="black">
                    {year}
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>

            <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />} colorScheme="blue">
              {selectedStartMonth2 ? `${selectedStartMonth2}` : 'Select Month'}
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
              ].map((month) => (
                <MenuItem
                  key={month.value}
                  onClick={() => setSelectedStartMonth2(month.value)}
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
              {/* Year Dropdown */}
              <Menu>
                <MenuButton as={Button} rightIcon={<ChevronDownIcon />} colorScheme="blue">
                  {selectedEndYear2 ? `${selectedEndYear2}` : 'Select Year'}
                </MenuButton>
                <MenuList bg="white" color="black" borderColor="blue.500">
                  {Array.from({ length: 2024 - 2015 + 1 }, (_, i) => (2015 + i).toString()).map((year) => (
                    <MenuItem
                      key={year}
                      onClick={() => setSelectedEndYear2(year)}
                      bg="white"
                      color="black"
                    >
                      {year}
                    </MenuItem>
                  ))}
                </MenuList>
              </Menu>

              {/* Month Dropdown */}
              <Menu>
                <MenuButton as={Button} rightIcon={<ChevronDownIcon />} colorScheme="blue">
                  {selectedEndMonth2 ? `${selectedEndMonth2}` : 'Select Month'}
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
                  ].map((month) => (
                    <MenuItem
                      key={month.value}
                      onClick={() => setSelectedEndMonth2(month.value)}
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
        </Box>
        </Flex>
      </Box>
    )}

               {editorsActivity()}
            </Box>
            </Box>
    <Box>

      <br/>
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
            <Heading
              as="h3"
              size="lg"
              marginBottom={2}
              marginTop={2}
              fontWeight="bold"
              color={useColorModeValue("#3182CE", "blue.300")}
            > Active Editors PR reviews in each Repository 
            </Heading>
              {editorsSpecialityChart()}
            </Box>
          </Box>
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
