import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Box, Flex, Heading, useColorModeValue, Spinner, Link, Button, Text  } from "@chakra-ui/react";
import { CSVLink } from "react-csv";
import LoaderComponent from "@/components/Loader";
import DateTime from "@/components/DateTime";
import { usePathname } from "next/navigation";

// Dynamic import for Ant Design's Column chart
const Column = dynamic(() => import("@ant-design/plots").then(mod => mod.Column), { ssr: false });
const Bar = dynamic(() => import("@ant-design/plots").then(mod => mod.Bar), { ssr: false });


const API_ENDPOINTS = {
  eips: '/api/editorsprseips',
  ercs: '/api/editorsprsercs',
  rips: '/api/editorsprsrips'
};

type ShowReviewerType = { [key: string]: boolean }; 

const InsightsLeaderboard = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<any[]>([]);
  const [chart1data, setchart1Data] = useState<any[]>([]);
  const [downloaddata, setdownloadData] = useState<any[]>([]);
  const [showReviewer, setShowReviewer] = useState<ShowReviewerType>({});
  const [reviewers, setReviewers] = useState<string[]>([]);
  const [reviewerData, setReviewerData] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [selectedStartYear, setSelectedStartYear] = useState<string | null>(null);
  const [selectedStartMonth, setSelectedStartMonth] = useState<string | null>(null);
  const [selectedEndYear, setSelectedEndYear] = useState<string | null>(null);
  const [selectedEndMonth, setSelectedEndMonth] = useState<string | null>(null);
  const [csvData, setCsvData] = useState<any[]>([]); // State for storing CSV data
  const [show, setShow] = useState(false);
  const bg = useColorModeValue("#f6f6f7", "#171923");
  const [sliderValue, setSliderValue] = useState<number>(0);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all'>('all');
  const path = usePathname();
  const [loading3,setLoading3]=useState<boolean>(false);

  
  useEffect(() => {
    if (path) {
      const pathParts = path.split("/");
      const year = pathParts[2];
      const month = pathParts[3];

      if (year !== selectedYear || month !== selectedMonth) {
        setSelectedYear(year);
        setSelectedMonth(month);
      }
    }
  }, [path, selectedYear, selectedMonth]);

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

  const fetchData = async () => {
    setLoading(true);
    try {

      const endpoint =`/api/ReviewersCharts/chart/${activeTab.toLowerCase()}`

      const response = await fetch(endpoint); // Replace with your API endpoint
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const formattedData: { monthYear: string; reviewer: string; count: number }[] = await response.json();
      console.log(formattedData);
    
      // Extract unique reviewers from the formattedData
      const reviewers = Array.from(new Set(formattedData.map(review => review.reviewer)));
      
      // Create the initial state for showing reviewers (set all to true by default)
      const initialShowReviewer = reviewers.reduce(
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

  useEffect(() => {
    fetchData();
    resetReviewerList(); // Reset reviewers when switching tabs
  }, [activeTab]); // Fetch data and reset reviewers when the active tab changes
  
  const resetReviewerList = () => {
    setShowReviewer({}); // Clear previous reviewers list when switching tabs
  };
  


// Define types for clarity
interface ReviewData {
  monthYear: string;
  reviewer: string;
  count: number;
  prs: any[];
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

interface LeaderboardChartsProps {
  data: PRData[];
  selectedYear: string;
  selectedMonth: string;
  renderTable: (year: string, month: string) => JSX.Element;
}




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
      barWidthRatio: 0.3, // Reduced bar width ratio for better fitting in a small chart
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
        position: { count: datum.count, reviewer: datum.reviewer }, // Correct position
        html: `
          <div style="text-align: center;">
            <img src="https://github.com/${datum.reviewer}.png?size=24" 
                 style="margin-left:1px; width: 24px; height: 24px; border-radius: 50%;" />
          </div>
        `,
        offsetY: -12, // Adjust vertical position to place above the bar
      })),
    };
  };
  
  interface MonthlyChartData {
    reviewer: string;
    count: number; // Change this based on your actual data structure
}
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


const renderCharts = (data: PRData[], selectedYear: string | null, selectedMonth: string | null) => {
    let monthlyChartData: MonthlyChartData[] | undefined;

    if (selectedMonth != null) {
        const monthlyData = getMonthlyData(data, selectedYear, selectedMonth);
        monthlyChartData = formatChartData(monthlyData);
    }

    const generateDistinctColor = (index: number, total: number) => {
        const hue = (index * (360 / total)) % 360; // Golden angle for better color distribution
        return `hsl(${hue}, 85%, 50%)`; // High saturation and medium brightness for vibrancy
    };

    // Declare the colors map
    // const reviewerColorsMap: { [key: string]: string } = {}; 

    if (monthlyChartData) {
        // Assign colors if not already assigned
        const reviewers = Array.from(new Set(monthlyChartData.map(item => item.reviewer)));
        const totalReviewers = reviewers.length;

        monthlyChartData.forEach((item: MonthlyChartData, index: number) => {
            if (!reviewerColorsMap[item.reviewer]) {
                // Assign a new color only if the reviewer doesn't already have one
                reviewerColorsMap[item.reviewer] = generateDistinctColor(Object.keys(reviewerColorsMap).length, totalReviewers);
            }
        });
    }

    return (
        <Box maxHeight="150px" padding="0.5rem">
            {selectedYear && selectedMonth && monthlyChartData && (
                <Flex direction={{ base: "column", md: "row" }} justifyContent="center">
                    {/* Monthly Leaderboard Chart */}
                    <Box width={{ base: "100%", md: "100%" }} minHeight="250px" paddingTop={10}>
                    <Flex 
  justifyContent="center" // Center items horizontally
  alignItems="center" // Align items vertically
  marginBottom="0.5rem" 
  gap={4} // Add some space between the items
>
  <Text
    color="#30A0E0"
    fontSize="2xl"
    fontWeight="bold"
    textAlign="center"
    marginBottom="0.5rem"
  >
    {`Open PRs and Issues (${selectedYear})`}
  </Text>

  {/* Download button next to the text */}
  <CSVLink 
    data={csvData.length ? csvData : []} 
    filename={`reviews_data.csv`} 
    onClick={(e: any) => {
      generateCSVData2();
      if (csvData.length === 0) {
        e.preventDefault(); 
        console.error("CSV data is empty or not generated correctly.");
      }
    }}
  >
    <Button colorScheme="blue">
      {loading3 ? <Spinner size="sm" /> : "Download CSV"}
    </Button>
  </CSVLink>
</Flex>

        <br/>
                        <Bar {...getBarChartConfig(monthlyChartData)} />
                    </Box>
                </Flex>
            )}
        </Box>
    );
};

  
  return (
    <> <Link href="/Reviewers">
      <Box className="w-full" minHeight="300px" > {/* Set min height for responsive scaling */}
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
          renderCharts(chart1data, selectedYear, selectedMonth)
        )}
      </Box>
      </Link>
    </>
  );
   };

export default InsightsLeaderboard;
