import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Box, Flex, Heading, useColorModeValue, Spinner, Link  } from "@chakra-ui/react";
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
  const [showReviewer, setShowReviewer] = useState<ShowReviewerType>({});
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all'>('all');
  const bg = useColorModeValue("#f6f6f7", "#171923");
  const path = usePathname();
  let year = "";
  let month = "";

//   if (path) {
//     const pathParts = path.split("/");
//     year = pathParts[2];
//     month = pathParts[3];
//     setSelectedYear(year);
//     setSelectedMonth(month);
//   }

  // Function to generate CSV data
  type PR = {
    prNumber: number;
    prTitle: string;
    reviewDate?: string;
    created_at?: string;
    closed_at?: string;
    merged_at?: string;
  };
  
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
  
  const fetchHelper = async (activeTab: string): Promise<any[]> => { // Return type can be adjusted as needed
    try {
      const endpoint = API_ENDPOINTS[activeTab as keyof typeof API_ENDPOINTS];
      const response = await fetch(endpoint);
      const responseData = await response.json();
  
      const newData = flattenResponse(responseData);
      return newData; // Return the flattened data
    } catch (error) {
      console.error("Failed to fetch review data:", error);
      return []; // Return an empty array on error
    }
  };
  
  const fetchData = async () => {
    setLoading(true);
    try {
      let combinedData: any[] = []; // Initialize an empty array for combined data
  
      if (activeTab !== 'all') {
        combinedData = await fetchHelper(activeTab); // Fetch data for the selected tab
      } else {
        // Fetch data for all tabs and combine the results
        const [eipsData, ercsData, ripsData] = await Promise.all([
          fetchHelper('eips'),
          fetchHelper('ercs'),
          fetchHelper('rips')
        ]);
        combinedData = [...eipsData, ...ercsData, ...ripsData]; // Combine the results
      }
  
      // Process the combined data
      const reviewers = Array.from(new Set(combinedData.map(review => review.reviewer)));
      const initialShowReviewer = reviewers.reduce(
        (acc, reviewer) => ({ ...acc, [reviewer]: true }),
        {}
      );
  
      setShowReviewer(initialShowReviewer); // Set reviewer visibility state
  
      const transformedData = transformData(combinedData, initialShowReviewer);
      setData(transformedData);
    } catch (error) {
      console.error("Error during data fetch:", error);
    } finally {
      setLoading(false); // Ensure loading state is set to false in all cases
    }
  };

  const transformData = (
    data: any[], 
    rev: { [key: string]: boolean } // Assuming `rev` is an object where keys are reviewer names
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
  
      if (!monthYearData[key][reviewer]) {
        monthYearData[key][reviewer] = { monthYear: key, reviewer, count: 0, prs: [] };
      }
  
      // Avoid counting duplicate records
      const isDuplicate = monthYearData[key][reviewer].prs.some(pr => pr.prNumber === review.prNumber);
      if (!isDuplicate) {
        monthYearData[key][reviewer].count += 1;
        monthYearData[key][reviewer].prs.push(review);
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
  prs: any[];
}

type GroupedData = {
  [monthYear: string]: {
    [reviewer: string]: ReviewData;
  };
};

interface PRData {
  monthYear: string;
  prs: { reviewer: string; prCount: number }[];
}

interface LeaderboardChartsProps {
  data: PRData[];
  selectedYear: string;
  selectedMonth: string;
  renderTable: (year: string, month: string) => JSX.Element;
}

const getYearlyData = (data: PRData[]) => {
  const yearlyData: Record<string, number> = data
    .filter(item => {
      // Extract the year from 'monthYear' and check if it falls between 2015 and 2024
      const itemYear = parseInt(item.monthYear.split('-')[0], 10);
      return itemYear >= 2015 && itemYear <= 2024;
    })
    .flatMap(item => item.prs)
    .reduce((acc, item) => {
      acc[item.reviewer] = (acc[item.reviewer] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

  // Sort the data by PR counts in decreasing order
  const sortedYearlyData = Object.entries(yearlyData)
    .sort(([, a], [, b]) => b - a) // Sort by count in decreasing order
    .reduce((acc, [reviewer, count]) => {
      acc[reviewer] = count;
      return acc;
    }, {} as Record<string, number>);

  console.log("Combined data from 2015 to 2024:", sortedYearlyData);
  return sortedYearlyData;
};


// Function to filter PR data for the selected month and year
const getMonthlyData = (data: PRData[], year: string|null, month: string) => {
  const monthlyData: Record<string, number> = data
    .filter(item => item.monthYear === `${year}-${month.padStart(2, '0')}`)
    .flatMap(item => item.prs)
    .reduce((acc, item) => {
      acc[item.reviewer] = (acc[item.reviewer] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const sortedMonthlyData = Object.entries(monthlyData)
    .sort(([, a], [, b]) => b - a) // Sort by count in decreasing order
    .reduce((acc, [reviewer, count]) => {
      acc[reviewer] = count;
      return acc;
    }, {} as Record<string, number>);

  console.log("Year 2024, month 10:", sortedMonthlyData);
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
          renderCharts(data, selectedYear, selectedMonth)
        )}
      </Box>
      </Link>
    </>
  );
   };

export default InsightsLeaderboard;
