import React, { useState, useEffect, useLayoutEffect } from "react";
import CloseableAdCard from "@/components/CloseableAdCard";
import PlaceYourAdCard from "@/components/PlaceYourAdCard";
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
  useColorModeValue,
} from "@chakra-ui/react";
import { DownloadIcon } from "@chakra-ui/icons";
import DateTime from "@/components/DateTime";
import LoaderComponent from "@/components/Loader";
import AllLayout from "@/components/Layout";
import { ChevronUpIcon } from "@chakra-ui/icons";
import axios from "axios";
import Comments from "@/components/comments";
import { useRouter } from "next/router";
import LastUpdatedDateTime from "@/components/LastUpdatedDateTime";
import EipsLabelChart from "@/components/PrLabelsChart";
import CopyLink from "@/components/CopyLink";
import FeedbackWidget from "@/components/FeedbackWidget";
import { useScrollSpy } from "@/hooks/useScrollSpy";
import ERCsPRChart from "@/components/Ercsprs";
import PRAnalyticsCard from "@/components/PrLabels";
import AnimatedHeader from "@/components/AnimatedHeader";

// Dynamic import for Ant Design's Column chart
// const Column = dynamic(() => import("@ant-design/plots").then(mod => mod.Column), { ssr: false });
const DualAxes = dynamic(
  () => import("@ant-design/plots").then((mod) => mod.DualAxes),
  { ssr: false }
);

type PR = {
  repo: string;
  prNumber: number;
  key: string;
  tag: string;
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
  repo: string;
  key: string;
  tag: string;
  IssueNumber: number;
  IssueTitle: string;
  state: string;
  created_at: Date;
  closed_at: Date | null;
};

interface ChartDataItem {
  _id: string;
  category: string;
  monthYear: string;
  type: "Created" | "Merged" | "Closed" | "Open" | "Review";
  count: number;
  eips: number;
  ercs: number;
  rips: number;
}
const GitHubPRTracker: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [loading2, setLoading2] = useState<boolean>(false);
  const [loading3, setLoading3] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"PRs" | "Issues">("PRs");
  const [selectedRepo, setSelectedRepo] = useState<string>("EIPs");
  const { isOpen: showDropdown, onToggle: toggleDropdown } = useDisclosure();
  const [show, setShow] = useState(false);
  const bg = useColorModeValue("#f6f6f7", "#171923");
``
  const toggleCollapse = () => setShow(!show);
  // const [selectedYear, setSelectedYear] = useState(null);
  // const [selectedMonth, setSelectedMonth] = useState(null);
  const [data, setData] = useState<{
    PRs: {
      [key: string]: {
        created: PR[];
        closed: PR[];
        merged: PR[];
        open: PR[];
        review: PR[];
      };
    };
    Issues: {
      [key: string]: { created: Issue[]; closed: Issue[]; open: Issue[] };
    };
  }>({ PRs: {}, Issues: {} });

  const [downloaddata, setdownloadData] = useState<{
    PRs: {
      [key: string]: {
        created: PR[];
        closed: PR[];
        merged: PR[];
        open: PR[];
        review: PR[];
      };
    };
    Issues: {
      [key: string]: { created: Issue[]; closed: Issue[]; open: Issue[] };
    };
  }>({ PRs: {}, Issues: {} });

  const [chartdata, setchartData] = useState<ChartDataItem[] | undefined>([]);
  // const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [showCategory, setShowCategory] = useState<{ [key: string]: boolean }>({
    created: true,
    closed: true,
    merged: true,
    open: true,
    review: true,
  });


  const fetchEndpoint = () => {
    const baseUrl = "/api/AnalyticsCharts";
    const tabPath = activeTab === "PRs" ? "prs" : "issues";
    const repoPath = selectedRepo.toLowerCase();
    const endpoint = `${baseUrl}/${tabPath}/${repoPath}`;

    return endpoint;
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (selectedRepo === "All") {
          // For "All", fetch data from individual repos and aggregate
          const [eipsResponse, ercsResponse, ripsResponse] = await Promise.all([
            axios.get(`/api/AnalyticsCharts/${activeTab === "PRs" ? "prs" : "issues"}/eips`),
            axios.get(`/api/AnalyticsCharts/${activeTab === "PRs" ? "prs" : "issues"}/ercs`),
            axios.get(`/api/AnalyticsCharts/${activeTab === "PRs" ? "prs" : "issues"}/rips`)
          ]);
          
          const eipsData = eipsResponse.data.data || [];
          const ercsData = ercsResponse.data.data || [];
          const ripsData = ripsResponse.data.data || [];
          
          console.log("EIPs data sample:", eipsData.slice(0, 2));
          console.log("ERCs data sample:", ercsData.slice(0, 2));
          console.log("RIPs data sample:", ripsData.slice(0, 2));
          
          // Aggregate the data by monthYear and type
          const aggregatedData: { [key: string]: any } = {};
          
          // Process EIPs data
          eipsData.forEach((item: any) => {
            const key = `${item.monthYear}-${item.type}`;
            if (!aggregatedData[key]) {
              aggregatedData[key] = {
                _id: key,
                category: "all",
                monthYear: item.monthYear,
                type: item.type,
                count: 0,
                eips: 0,
                ercs: 0,
                rips: 0
              };
            }
            aggregatedData[key].count += item.count || 0;
            aggregatedData[key].eips += item.count || 0; // For EIPs repo, count goes to eips
          });
          
          // Process ERCs data
          ercsData.forEach((item: any) => {
            const key = `${item.monthYear}-${item.type}`;
            if (!aggregatedData[key]) {
              aggregatedData[key] = {
                _id: key,
                category: "all",
                monthYear: item.monthYear,
                type: item.type,
                count: 0,
                eips: 0,
                ercs: 0,
                rips: 0
              };
            }
            aggregatedData[key].count += item.count || 0;
            aggregatedData[key].ercs += item.count || 0; // For ERCs repo, count goes to ercs
          });
          
          // Process RIPs data
          ripsData.forEach((item: any) => {
            const key = `${item.monthYear}-${item.type}`;
            if (!aggregatedData[key]) {
              aggregatedData[key] = {
                _id: key,
                category: "all",
                monthYear: item.monthYear,
                type: item.type,
                count: 0,
                eips: 0,
                ercs: 0,
                rips: 0
              };
            }
            aggregatedData[key].count += item.count || 0;
            aggregatedData[key].rips += item.count || 0; // For RIPs repo, count goes to rips
          });
          
          const chartData = Object.values(aggregatedData);
          console.log("Aggregated data sample:", chartData.slice(0, 3));
          console.log("Aggregated data total length:", chartData.length);
          
          setchartData(chartData);
        } else {
          // For individual repos, use the existing endpoint
          const endpoint = fetchEndpoint();
          const response = await axios.get(endpoint);
          
          const chartData = response.data.data || response.data;
          console.log("API Response sample:", chartData?.slice(0, 3));
          console.log("API Response total length:", chartData?.length);
          
          setchartData(chartData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeTab, selectedRepo]);

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleCategoryClick = (category: string) => {
    setSelectedCategory((prev) => (prev === category ? null : category)); // Toggle selection
    setShowCategory({
      created: category === "created",
      open: category === "open",
      closed: category === "closed",
      merged: category === "merged",
      // review: category === 'review' // Uncomment if review category is enabled
    });
  };

  const getYears = () => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 10 }, (_, i) => currentYear - i);
  };

  const getMonths = () => [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedYear || !selectedMonth) return; // Ensure year and month are selected

      setLoading2(true);

      // Format the key to 'yyyy-mm' format
      const key = `${selectedYear}-${String(
        getMonths().indexOf(selectedMonth) + 1
      ).padStart(2, "0")}`;

      // Define the API endpoint based on activeTab ('PRs' or 'Issues')
      const endpoint =
        activeTab === "PRs"
          ? `/api/AnalyticsData/prs/${selectedRepo.toLowerCase()}/${key}`
          : `/api/AnalyticsData/issues/${selectedRepo.toLowerCase()}/${key}`;

      try {
        const response = await fetch(endpoint);
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const result = await response.json();
        // console.log(result)

        const formattedData = result?.reduce(
          (acc: any, item: any) => {
            const { monthYear, value } = item; // Access 'value' directly from the item
            const { created, closed, merged, open, review } = value; // Destructure 'created', 'closed', etc. from 'value'

            // Structure the data based on the tab (PRs or Issues)
            if (activeTab === "PRs") {
              if (!acc.PRs[monthYear]) {
                acc.PRs[monthYear] = {
                  created: [],
                  closed: [],
                  merged: [],
                  open: [],
                  review: [],
                };
              }
              acc.PRs[monthYear].created = created || [];
              acc.PRs[monthYear].closed = closed || [];
              acc.PRs[monthYear].merged = merged || [];
              acc.PRs[monthYear].open = open || [];
              acc.PRs[monthYear].review = review || [];
            } else if (activeTab === "Issues") {
              if (!acc.Issues[monthYear]) {
                acc.Issues[monthYear] = { created: [], closed: [], open: [] };
              }
              acc.Issues[monthYear].created = created || [];
              acc.Issues[monthYear].closed = closed || [];
              acc.Issues[monthYear].open = open || [];
            }
            return acc;
          },
          { PRs: {}, Issues: {} }
        );

        // Set the fetched and formatted data
        setData(formattedData);
        // console.log(formattedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading2(false); // Reset loading state after fetching
      }
    };

    fetchData(); // Invoke the fetch function
  }, [selectedRepo, selectedYear, selectedMonth, activeTab]);

  useEffect(() => {
    const fetchData2 = async () => {
      setLoading3(true);
      const endpoint =
        activeTab === "PRs"
          ? `/api/AnalyticsData/prs/${selectedRepo.toLowerCase()}`
          : `/api/AnalyticsData/issues/${selectedRepo.toLowerCase()}`;

      try {
        const response = await fetch(endpoint);
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const result = await response.json();
        // console.log(result);

        // Reduce the data by combining entries with the same monthYear
        const formattedData = result?.reduce(
          (acc: any, item: any) => {
            const { monthYear, value } = item; // Access 'value' directly from the item
            const {
              created = [],
              closed = [],
              merged = [],
              open = [],
              review = [],
            } = value; // Destructure with defaults

            if (activeTab === "PRs") {
              if (!acc.PRs[monthYear]) {
                acc.PRs[monthYear] = {
                  created: [],
                  closed: [],
                  merged: [],
                  open: [],
                  review: [],
                };
              }
              acc.PRs[monthYear].created.push(...created);
              acc.PRs[monthYear].closed.push(...closed);
              acc.PRs[monthYear].merged.push(...merged);
              acc.PRs[monthYear].open.push(...open);
              acc.PRs[monthYear].review.push(...review);
            } else if (activeTab === "Issues") {
              if (!acc.Issues[monthYear]) {
                acc.Issues[monthYear] = { created: [], closed: [], open: [] };
              }
              acc.Issues[monthYear].created.push(...created);
              acc.Issues[monthYear].closed.push(...closed);
              acc.Issues[monthYear].open.push(...open);
            }
            return acc;
          },
          { PRs: {}, Issues: {} }
        );

        // Set the fetched and formatted data
        setdownloadData(formattedData);
        // console.log(formattedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading3(false); // Reset loading state after fetching
      }
    };

    fetchData2();
  }, [activeTab, selectedRepo]);

  const renderTable = (year: string, month: string, type: "PRs" | "Issues") => {
    // Data based on type (PRs or Issues)
    const dataToUse = type === "PRs" ? data.PRs : data.Issues;

    // Format the month-year key for data lookup
    const key = `${year}-${String(getMonths().indexOf(month) + 1).padStart(
      2,
      "0"
    )}`;

    // Default data structure for PRs or Issues
    const items =
      dataToUse[key] ||
      (type === "PRs"
        ? {
            created: [] as PR[],
            closed: [] as PR[],
            merged: [] as PR[],
            open: [] as PR[],
          }
        : {
            created: [] as Issue[],
            closed: [] as Issue[],
            open: [] as Issue[],
          });

    const createdCount = items.created?.length;
    const closedCount = items.closed?.length;
    const openCount = items.open?.length;

    // Conditionally calculate for PR-specific categories
    const mergedCount =
      type === "PRs" ? (items as { merged: PR[] }).merged?.length : 0;

    return (
      <Box
        mt={2}
        border="1px solid #e2e8f0"
        borderRadius="10px 10px 0 0"
        boxShadow="lg"
      >
        {/* Total Count Display */}
        <Box
          bg={useColorModeValue("blue.50", "gray.700")}
          p={3}
          mb={3}
          borderRadius="md"
          textAlign="center"
        >
          <Text
            fontSize="18px"
            fontWeight="medium"
            color={useColorModeValue("blue.700", "blue.300")}
          >
            Total Filtered Count:{" "}
            {loading2 ? <Spinner size="sm" /> : (
              (showCategory.created ? createdCount : 0) +
              (showCategory.open ? openCount : 0) +
              (showCategory.closed ? closedCount : 0) +
              (showCategory.merged && type === "PRs" ? mergedCount : 0)
            )}
          </Text>
          <Text
            fontSize="xs"
            color={useColorModeValue("gray.600", "gray.400")}
            mt={1}
          >
            (Based on selected category filters below - Click categories to toggle)
          </Text>
        </Box>

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
            border={
              selectedCategory === "created" ? "2px solid lightblue" : "none"
            } // Highlight when selected
            onClick={() => handleCategoryClick("created")}
            cursor="pointer"
          >
            Created ({loading2 ? <Spinner size="sm" /> : createdCount})
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
            border={
              selectedCategory === "open" ? "2px solid lightblue" : "none"
            }
            onClick={() => handleCategoryClick("open")}
            cursor="pointer"
          >
            Open ({loading2 ? <Spinner size="sm" /> : openCount})
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
            border={
              selectedCategory === "closed" ? "2px solid lightblue" : "none"
            }
            onClick={() => handleCategoryClick("closed")}
            cursor="pointer"
          >
            Closed ({loading2 ? <Spinner size="sm" /> : closedCount})
          </Box>

          {type === "PRs" && (
            <Box
              textAlign="center"
              p={2}
              flex="1 1 150px"
              bg="gray.800"
              color="white"
              borderRadius="md"
              boxShadow="sm"
              m={2}
              border={
                selectedCategory === "merged" ? "2px solid lightblue" : "none"
              }
              onClick={() => handleCategoryClick("merged")}
              cursor="pointer"
            >
              Merged ({loading2 ? <Spinner size="sm" /> : mergedCount})
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
                  p="8px"
                >
                  Number
                </Th>
                <Th
                  color="white"
                  textAlign="center"
                  minWidth="20rem"
                  whiteSpace="normal" // Allow wrapping
                  overflow="hidden" // Prevent overflow
                  textOverflow="ellipsis" // Add ellipsis for overflowed text
                  p="8px"
                >
                  Title
                </Th>
                <Th color="white" textAlign="center" minWidth="6rem" p="8px">
                  State
                </Th>
                <Th color="white" textAlign="center" minWidth="6rem" p="8px">
                  Created At
                </Th>
                <Th color="white" textAlign="center" minWidth="6rem" p="8px">
                  Closed At
                </Th>
                {type === "PRs" && (
                  <Th color="white" textAlign="center" minWidth="6rem" p="8px">
                    Merged At
                  </Th>
                )}
                <Th color="white" textAlign="center" minWidth="10rem" p="8px">
                  Link
                </Th>
              </Tr>
            </Thead>

            <Tbody>
              {items.created?.length === 0 &&
              items.closed?.length === 0 &&
              items.open?.length === 0 &&
              (type === "PRs"
                ? "merged" in items && items.merged?.length === 0
                : true) ? (
                <Tr>
                  <Td colSpan={type === "PRs" ? 8 : 6} textAlign="center">
                    No Data Available
                  </Td>
                </Tr>
              ) : (
                <>
                  {/* Render Created Items */}
                  {showCategory.created &&
                    items.created?.map((item: PR | Issue) => (
                      <Tr
                        key={`created-${
                          type === "PRs"
                            ? (item as PR).prNumber
                            : (item as Issue).IssueNumber
                        }`}
                        borderWidth="1px"
                        borderColor="gray.200"
                      >
                        <Td p="8px" textAlign="center" verticalAlign="middle">
                          {type === "PRs"
                            ? (item as PR).prNumber
                            : (item as Issue).IssueNumber}
                        </Td>
                        <Td
                          p="8px"
                          style={{ wordWrap: "break-word", maxWidth: "200px" }}
                        >
                          {type === "PRs"
                            ? (item as PR).prTitle
                            : (item as Issue).IssueTitle}
                        </Td>
                        <Td p="8px" textAlign="center" verticalAlign="middle">
                          Created
                        </Td>
                        <Td p="8px" textAlign="center" verticalAlign="middle">
                          {item.created_at
                            ? new Date(item.created_at).toLocaleDateString()
                            : "-"}
                        </Td>
                        <Td p="8px" textAlign="center" verticalAlign="middle">
                          {item.closed_at
                            ? new Date(item.closed_at).toLocaleDateString()
                            : "-"}
                        </Td>
                        {type === "PRs" && (
                          <Td textAlign="center" verticalAlign="middle">
                            {(item as PR).merged_at
                              ? new Date(
                                  (item as PR).merged_at!
                                ).toLocaleDateString()
                              : "-"}
                          </Td>
                        )}
                        <Td p="8px">
                          <button
                            style={{
                              backgroundColor: "#428bca",
                              color: "#ffffff",
                              border: "none",
                              padding: "10px 20px",
                              cursor: "pointer",
                              borderRadius: "5px",
                            }}
                          >
                            <a
                              href={
                                type === "PRs"
                                  ? `/PR/${(item as PR).repo}/${
                                      (item as PR).prNumber
                                    }`
                                  : `/issue/${(item as Issue).repo}/${
                                      (item as Issue).IssueNumber
                                    }`
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {type === "PRs" ? "Pull Request" : "Issue"}
                            </a>
                          </button>
                        </Td>
                      </Tr>
                    ))}

                  {/* Render Closed Items */}
                  {showCategory.closed &&
                    items.closed?.map((item: PR | Issue) => (
                      <Tr
                        key={`closed-${
                          type === "PRs"
                            ? (item as PR).prNumber
                            : (item as Issue).IssueNumber
                        }`}
                        borderWidth="1px"
                        borderColor="gray.200"
                      >
                        <Td p="8px" textAlign="center" verticalAlign="middle">
                          {type === "PRs"
                            ? (item as PR).prNumber
                            : (item as Issue).IssueNumber}
                        </Td>
                        <Td
                          p="8px"
                          textAlign="center"
                          verticalAlign="middle"
                          whiteSpace="normal"
                          overflow="hidden"
                          textOverflow="ellipsis"
                        >
                          {type === "PRs"
                            ? (item as PR).prTitle
                            : (item as Issue).IssueTitle}
                        </Td>
                        <Td p="8px" textAlign="center" verticalAlign="middle">
                          Closed
                        </Td>
                        <Td p="8px" textAlign="center" verticalAlign="middle">
                          {item.created_at
                            ? new Date(item.created_at).toLocaleDateString()
                            : "-"}
                        </Td>
                        <Td p="8px" textAlign="center" verticalAlign="middle">
                          {item.closed_at
                            ? new Date(item.closed_at).toLocaleDateString()
                            : "-"}
                        </Td>
                        {type === "PRs" && (
                          <Td p="8px" textAlign="center" verticalAlign="middle">
                            {(item as PR).merged_at
                              ? new Date(
                                  (item as PR).merged_at!
                                ).toLocaleDateString()
                              : "-"}
                          </Td>
                        )}
                        <Td p="8px">
                          <button
                            style={{
                              backgroundColor: "#428bca",
                              color: "#ffffff",
                              border: "none",
                              padding: "10px 20px",
                              cursor: "pointer",
                              borderRadius: "5px",
                            }}
                          >
                            <a
                              href={
                                type === "PRs"
                                  ? `/PR/${(item as PR).repo}/${
                                      (item as PR).prNumber
                                    }`
                                  : `/issue/${(item as Issue).repo}/${
                                      (item as Issue).IssueNumber
                                    }`
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {type === "PRs" ? "Pull Request" : "Issue"}
                            </a>
                          </button>
                        </Td>
                      </Tr>
                    ))}

                  {/* Render Merged Items (only for PRs) */}
                  {showCategory.merged &&
                    type === "PRs" &&
                    (items as { merged: PR[] }).merged?.map((item: PR) => (
                      <Tr
                        key={`merged-${item.prNumber}`}
                        borderWidth="1px"
                        borderColor="gray.200"
                      >
                        <Td p="8px" textAlign="center" verticalAlign="middle">
                          {item.prNumber}
                        </Td>
                        <Td
                          p="8px"
                          textAlign="center"
                          verticalAlign="middle"
                          whiteSpace="normal"
                          overflow="hidden"
                          textOverflow="ellipsis"
                        >
                          {item.prTitle}
                        </Td>
                        <Td p="8px" textAlign="center" verticalAlign="middle">
                          Merged
                        </Td>
                        <Td p="8px" textAlign="center" verticalAlign="middle">
                          {item.created_at
                            ? new Date(item.created_at).toLocaleDateString()
                            : "-"}
                        </Td>
                        <Td p="8px" textAlign="center" verticalAlign="middle">
                          {item.closed_at
                            ? new Date(item.closed_at).toLocaleDateString()
                            : "-"}
                        </Td>
                        <Td p="8px" textAlign="center" verticalAlign="middle">
                          {item.merged_at
                            ? new Date(item.merged_at!).toLocaleDateString()
                            : "-"}
                        </Td>
                        <Td p="8px">
                          <button
                            style={{
                              backgroundColor: "#428bca",
                              color: "#ffffff",
                              border: "none",
                              padding: "10px 20px",
                              cursor: "pointer",
                              borderRadius: "5px",
                            }}
                          >
                            <a
                              href={`/PR/${(item as PR).repo}/${item.prNumber}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {type === "PRs" ? "Pull Request" : "Issue"}
                            </a>
                          </button>
                        </Td>
                      </Tr>
                    ))}

                  {/* Render Open Items */}
                  {showCategory.open &&
                    items.open?.map((item: PR | Issue) => (
                      <Tr
                        key={`open-${
                          type === "PRs"
                            ? (item as PR).prNumber
                            : (item as Issue).IssueNumber
                        }`}
                        borderWidth="1px"
                        borderColor="gray.200"
                      >
                        <Td p="8px" textAlign="center" verticalAlign="middle">
                          {type === "PRs"
                            ? (item as PR).prNumber
                            : (item as Issue).IssueNumber}
                        </Td>
                        <Td
                          p="8px"
                          textAlign="center"
                          verticalAlign="middle"
                          whiteSpace="normal"
                          overflow="hidden"
                          textOverflow="ellipsis"
                        >
                          {type === "PRs"
                            ? (item as PR).prTitle
                            : (item as Issue).IssueTitle}
                        </Td>
                        <Td p="8px" textAlign="center" verticalAlign="middle">
                          Open
                        </Td>
                        <Td p="8px" textAlign="center" verticalAlign="middle">
                          {item.created_at
                            ? new Date(item.created_at).toLocaleDateString()
                            : "-"}
                        </Td>
                        <Td p="8px" textAlign="center" verticalAlign="middle">
                          {item.closed_at
                            ? new Date(item.closed_at).toLocaleDateString()
                            : "-"}
                        </Td>
                        {type === "PRs" && (
                          <Td p="8px" textAlign="center" verticalAlign="middle">
                            {(item as PR).merged_at
                              ? new Date(
                                  (item as PR).merged_at!
                                ).toLocaleDateString()
                              : "-"}
                          </Td>
                        )}
                        <Td p="8px">
                          <button
                            style={{
                              backgroundColor: "#428bca",
                              color: "#ffffff",
                              border: "none",
                              padding: "10px 20px",
                              cursor: "pointer",
                              borderRadius: "5px",
                            }}
                          >
                            <a
                              href={
                                type === "PRs"
                                  ? `/PR/${(item as PR).repo}/${
                                      (item as PR).prNumber
                                    }`
                                  : `/issue/${(item as Issue).repo}/${
                                      (item as Issue).IssueNumber
                                    }`
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {type === "PRs" ? "Pull Request" : "Issue"}
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

  const convertToCSV = (filteredData: any, type: "PRs" | "Issues") => {
    const csvRows = [];

    const headers =
      type === "PRs"
        ? ["Number", "Title", "Created At", "Closed At", "Merged At", "Link"]
        : ["Number", "Title", "Created At", "Closed At", "Link"];

    // Add headers to CSV rows
    csvRows.push(headers.join(","));

    // console.log("filteredData",filteredData)
    // Combine created and closed for PRs and Issues
    const items =
      type === "PRs"
        ? [
            ...(Array.isArray(filteredData.reviewed) && showCategory.review
              ? filteredData.reviewed
              : []),
            ...(Array.isArray(filteredData.created) && showCategory.created
              ? filteredData.created
              : []),
            ...(Array.isArray(filteredData.closed) && showCategory.closed
              ? filteredData.closed
              : []),
            ...(Array.isArray(filteredData.merged) && showCategory.merged
              ? filteredData.merged
              : []),
            ...(Array.isArray(filteredData.open) && showCategory.open
              ? filteredData.open
              : []),
            // ...(Array.isArray(filteredData.review) && showCategory.review ? filteredData.review : [])
          ]
        : [
            ...(Array.isArray(filteredData.created) && showCategory.created
              ? filteredData.created
              : []),
            ...(Array.isArray(filteredData.closed) && showCategory.closed
              ? filteredData.closed
              : []),
            ...(Array.isArray(filteredData.open) && showCategory.open
              ? filteredData.open
              : []),
          ];

    // Add data to CSV rows
    items?.forEach((item: PR | Issue) => {
      const row =
        type === "PRs"
          ? [
              (item as PR).prNumber,
              `"${(item as PR).prTitle}"`, // Wrap title in quotes
              new Date(item.created_at).toLocaleDateString(),
              item.closed_at
                ? new Date(item.closed_at).toLocaleDateString()
                : "-",
              (item as PR).merged_at
                ? new Date((item as PR).merged_at!).toLocaleDateString()
                : "-",
              `https://github.com/ethereum/${selectedRepo}/${
                type === "PRs" ? "pull" : "issues"
              }/${(item as PR).prNumber}`,
            ].join(",")
          : [
              (item as Issue).IssueNumber,
              `"${(item as Issue).IssueTitle}"`, // Wrap title in quotes
              new Date(item.created_at).toLocaleDateString(),
              item.closed_at
                ? new Date(item.closed_at).toLocaleDateString()
                : "-",
              `https://github.com/ethereum/${selectedRepo}/issues/${
                (item as Issue).IssueNumber
              }`,
            ].join(",");

      csvRows.push(row);
    });

    return csvRows.join("\n");
  };

  const convertToCSV2 = (filteredData: any, type: "PRs" | "Issues") => {
    const csvRows = [];

    // Add `Key` and `Tag` headers to the existing ones
    const headers =
      type === "PRs"
        ? [
            "Key",
            "Tag",
            "Number",
            "Title",
            "Created At",
            "Closed At",
            "Merged At",
            "Link",
          ]
        : ["Key", "Tag", "Number", "Title", "Created At", "Closed At", "Link"];

    // Add headers to CSV rows
    csvRows.push(headers.join(","));

    // console.log("filteredData", filteredData);

    // Combine created and closed arrays for PRs and Issues
    const items =
      type === "PRs"
        ? [
            ...(Array.isArray(filteredData.reviewed) && showCategory.review
              ? filteredData.reviewed
              : []),
            ...(Array.isArray(filteredData.created) && showCategory.created
              ? filteredData.created
              : []),
            ...(Array.isArray(filteredData.closed) && showCategory.closed
              ? filteredData.closed
              : []),
            ...(Array.isArray(filteredData.merged) && showCategory.merged
              ? filteredData.merged
              : []),
            ...(Array.isArray(filteredData.open) && showCategory.open
              ? filteredData.open
              : []),
          ]
        : [
            ...(Array.isArray(filteredData.created) && showCategory.created
              ? filteredData.created
              : []),
            ...(Array.isArray(filteredData.closed) && showCategory.closed
              ? filteredData.closed
              : []),
            ...(Array.isArray(filteredData.open) && showCategory.open
              ? filteredData.open
              : []),
          ];

    // console.log(items);

    // Add data to CSV rows
    items?.forEach((item: PR | (Issue & { key: string; tag: string })) => {
      const row =
        type === "PRs"
          ? [
              item.key, // Add `key`
              item.tag, // Add `tag`
              (item as PR).prNumber,
              `"${(item as PR).prTitle}"`, // Wrap title in quotes
              new Date(item.created_at).toLocaleDateString(),
              item.closed_at
                ? new Date(item.closed_at).toLocaleDateString()
                : "-",
              (item as PR).merged_at
                ? new Date((item as PR).merged_at!).toLocaleDateString()
                : "-",
              `https://github.com/ethereum/${(item as PR).repo}/${
                type === "PRs" ? "pull" : "issues"
              }/${(item as PR).prNumber}`,
            ].join(",")
          : [
              item.key, // Add `key`
              item.tag, // Add `tag`
              (item as Issue).IssueNumber,
              `"${(item as Issue).IssueTitle}"`, // Wrap title in quotes
              new Date(item.created_at).toLocaleDateString(),
              item.closed_at
                ? new Date(item.closed_at).toLocaleDateString()
                : "-",
              `https://github.com/ethereum/${(item as Issue).repo}/issues/${
                (item as Issue).IssueNumber
              }`,
            ].join(",");

      csvRows.push(row);
    });

    return csvRows.join("\n");
  };

  const handleDownload = () => {
    if (!selectedYear || !selectedMonth) {
      alert("Please select a year and month.");
      return;
    }

    const key = `${selectedYear}-${String(
      getMonths().indexOf(selectedMonth) + 1
    ).padStart(2, "0")}`;
    const filteredData = activeTab === "PRs" ? data.PRs[key] : data.Issues[key];

    if (
      !filteredData ||
      (filteredData.created?.length === 0 && filteredData.closed?.length === 0)
    ) {
      alert("No data available for the selected month.");
      return;
    }

    // console.log("review data:",filteredData);

    // Combine arrays and pass them to the CSV function - ONLY include selected categories
    const combinedData =
      activeTab === "PRs"
        ? {
            created: showCategory.created ? filteredData.created : [],
            closed: showCategory.closed ? filteredData.closed : [],
            merged: showCategory.merged && "merged" in filteredData ? filteredData.merged : [],
            reviewed: showCategory.review && "review" in filteredData ? filteredData.review : [],
            open: showCategory.open ? filteredData.open : [],
          }
        : {
            created: showCategory.created ? filteredData.created : [],
            closed: showCategory.closed ? filteredData.closed : [],
            open: showCategory.open ? filteredData.open : [],
          };

    downloadCSV(combinedData, activeTab);
  };

  const handleDownload2 = () => {
    // Check if at least one category is selected
    const hasSelectedCategory = Object.values(showCategory).some(v => v);
    if (!hasSelectedCategory) {
      alert("Please select at least one category (Created, Open, Closed, Merged) to download.");
      return;
    }

    // Initialize combined data arrays for PRs and Issues separately
    const combinedPRData = {
      created: [] as Array<PR & { key: string; tag: string }>,
      closed: [] as Array<PR & { key: string; tag: string }>,
      merged: [] as Array<PR & { key: string; tag: string }>,
      reviewed: [] as Array<PR & { key: string; tag: string }>,
      open: [] as Array<PR & { key: string; tag: string }>,
    };

    const combinedIssueData = {
      created: [] as Array<Issue & { key: string; tag: string }>,
      closed: [] as Array<Issue & { key: string; tag: string }>,
      open: [] as Array<Issue & { key: string; tag: string }>,
    };

    // Determine if we're handling PRs or Issues
    const allData =
      activeTab === "PRs" ? downloaddata.PRs : downloaddata.Issues;

    // Check if data is loaded
    if (!allData || Object.keys(allData).length === 0) {
      alert("Data is still loading. Please wait a moment and try again.");
      return;
    }

    console.log("Download data keys:", Object.keys(allData).length);

    // Iterate over all keys in the selected dataset (PRs or Issues)
    Object.keys(allData)?.forEach((key) => {
      const currentData = allData[key];

      if (activeTab === "PRs") {
        // Add each record with 'key' and 'tag' to combinedPRData - ONLY if category is selected
        if (showCategory.created) {
          combinedPRData.created.push(
            ...(currentData as { created: PR[] }).created?.map((item) => ({
              ...item,
              key,
              tag: "created",
            }))
          );
        }
        if (showCategory.closed) {
          combinedPRData.closed.push(
            ...(currentData as { closed: PR[] }).closed?.map((item) => ({
              ...item,
              key,
              tag: "closed",
            }))
          );
        }
        if (showCategory.open) {
          combinedPRData.open.push(
            ...(currentData as { open: PR[] }).open?.map((item) => ({
              ...item,
              key,
              tag: "open",
            }))
          );
        }
        if (showCategory.merged) {
          combinedPRData.merged.push(
            ...((currentData as { merged: PR[] }).merged || [])?.map((item) => ({
              ...item,
              key,
              tag: "merged",
            }))
          );
        }
        if (showCategory.review) {
          combinedPRData.reviewed.push(
            ...((currentData as { review: PR[] }).review || [])?.map((item) => ({
              ...item,
              key,
              tag: "reviewed",
            }))
          );
        }
      } else {
        // Add each record with 'key' and 'tag' to combinedIssueData - ONLY if category is selected
        if (showCategory.created) {
          combinedIssueData.created.push(
            ...(currentData as { created: Issue[] }).created?.map((item) => ({
              ...item,
              key,
              tag: "created",
            }))
          );
        }
        if (showCategory.closed) {
          combinedIssueData.closed.push(
            ...(currentData as { closed: Issue[] }).closed?.map((item) => ({
              ...item,
              key,
              tag: "closed",
            }))
          );
        }
        if (showCategory.open) {
          combinedIssueData.open.push(
            ...(currentData as { open: Issue[] }).open?.map((item) => ({
              ...item,
              key,
              tag: "open",
            }))
          );
        }
      }
    });

    // Check if there's data to download based on selected categories
    const totalRecords = activeTab === "PRs"
      ? combinedPRData.created.length +
        combinedPRData.closed.length +
        combinedPRData.open.length +
        combinedPRData.merged.length +
        combinedPRData.reviewed.length
      : combinedIssueData.created.length +
        combinedIssueData.closed.length +
        combinedIssueData.open.length;

    console.log("Total records to download:", totalRecords);
    console.log("Selected categories:", Object.entries(showCategory).filter(([_, v]) => v).map(([k, _]) => k));

    if (totalRecords === 0) {
      const selectedCategories = Object.entries(showCategory)
        .filter(([_, isActive]) => isActive)
        .map(([category, _]) => category)
        .join(', ');
      alert(`No data available for the selected categories (${selectedCategories}). The repository might not have any ${activeTab.toLowerCase()} in these categories, or the data is still loading.`);
      return;
    }

    console.log("Combined data with keys and tags:", activeTab === 'PRs' ? combinedPRData : combinedIssueData);

    // Pass the appropriate combined data to the CSV download function
    downloadCSV2(
      activeTab === "PRs" ? combinedPRData : combinedIssueData,
      activeTab
    );
  };

  const downloadCSV = (data: any, type: "PRs" | "Issues") => {
    const csv = convertToCSV(data, type);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.setAttribute("hidden", "");
    a.setAttribute("href", url);
    a.setAttribute("download", `${type}-${selectedYear}-${selectedMonth}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const downloadCSV2 = (data: any, type: "PRs" | "Issues") => {
    const csv = convertToCSV2(data, type);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    // Generate filename with active categories
    const activeCategories = Object.entries(showCategory)
      .filter(([_, isActive]) => isActive)
      .map(([category, _]) => category)
      .join('_');

    const a = document.createElement("a");
    a.setAttribute("hidden", "");
    a.setAttribute("href", url);
    a.setAttribute("download", `${selectedRepo}_${type}_${activeCategories}_since_2015.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const renderChart = () => {
    // Log chart data to understand structure
    console.log("chart data sample:", chartdata?.slice(0, 3));
    console.log("chart data total length:", chartdata?.length);

    // Create a lookup map for original data to preserve eips/ercs/rips breakdown
    const originalDataLookup = Array.isArray(chartdata) 
      ? chartdata.reduce<{ [key: string]: any }>((acc, item) => {
          const key = `${item.monthYear}-${item.type}`;
          acc[key] = {
            eips: item.eips || 0,
            ercs: item.ercs || 0, 
            rips: item.rips || 0,
            count: item.count || 0
          };
          return acc;
        }, {})
      : {};

    console.log("Original data lookup sample:", Object.keys(originalDataLookup).slice(0, 5));

    const transformedData = Array.isArray(chartdata) // Check if chartdata is an array
      ? chartdata?.reduce<{
          [key: string]: { [key: string]: number };
        }>((acc, { monthYear, type, count, eips, ercs, rips }) => {
          if (showCategory[type.toLowerCase()]) {
            // Ensure the category is selected
            if (!acc[monthYear]) {
              acc[monthYear] = {};
            }
            // Update the count for the current type
            acc[monthYear][type] = (acc[monthYear][type] || 0) + count;

            if (selectedRepo === "All") {
              acc[monthYear][`${type}-eips`] =
                (acc[monthYear][`${type}-eips`] || 0) + (eips || 0);
              acc[monthYear][`${type}-ercs`] =
                (acc[monthYear][`${type}-ercs`] || 0) + (ercs || 0);
              acc[monthYear][`${type}-rips`] =
                (acc[monthYear][`${type}-rips`] || 0) + (rips || 0);
            }
          }

          return acc;
        }, {})
      : {}; // If chartdata is not an array, return an empty object

    console.log("transformed data:", transformedData);

    const finalTransformedData = Object.keys(transformedData || {}).flatMap(
      (monthYear) => {
        const entry = transformedData![monthYear]; // Ensure that entry exists and is properly typed
        return [
          ...(showCategory.created
            ? [{ monthYear, type: "Created", count: entry.Created || 0 }]
            : []),
          ...(showCategory.merged
            ? [{ monthYear, type: "Merged", count: entry.Merged ? -Math.abs(entry.Merged) : 0 }] // Make merged negative
            : []),
          ...(showCategory.closed
            ? [{ monthYear, type: "Closed", count: entry.Closed ? -Math.abs(entry.Closed) : 0 }] // Make closed negative
            : []),
        ];
      }
    );

    // console.log(finalTransformedData);

    // Find the maximum of absolute values for merged and closed
    const mergedMax = Math.max(
      0, // Default to 0 if no data is available
      ...finalTransformedData
        ?.filter((data) => data.type === "Merged")
        ?.map((data) => Math.abs(data.count))
    );

    const closedMax = Math.max(
      0, // Default to 0 if no data is available
      ...finalTransformedData
        ?.filter((data) => data.type === "Closed")
        ?.map((data) => Math.abs(data.count))
    );

    // Get the minimum of merged and closed counts
    const getmin = Math.max(mergedMax, closedMax) || 0;

    const trendData = showCategory.open
      ? Object.keys(transformedData || {})?.map((monthYear) => {
          const entry = transformedData![monthYear]; // Ensure that entry exists and is properly typed

          // Calculate the Open value based on transformedData and showCategory
          const openCount = entry.Open || 0;

          return {
            monthYear,
            Open:
              openCount +
              (activeTab === "PRs" ? Math.abs(getmin) : Math.abs(closedMax)),
          };
        })
      : [];

    // Determine y-axis min and max
    const yAxisMin = Math.min(-closedMax, -mergedMax);
    // const yAxisMax = Math.max(0, Math.max(...trendData?.map(data => data.Open)));
    const yAxisMax = Math.max(
      0, // Default to 0 if no data is available
      ...trendData?.map((data) => Math.abs(data.Open)) // Use Open instead of type
    );

    // console.log(yAxisMax);

    // Sort data by monthYear in ascending order
    const sortedData = finalTransformedData.sort((a, b) =>
      a.monthYear.localeCompare(b.monthYear)
    );
    const sortedTrendData = trendData.sort((a, b) =>
      a.monthYear.localeCompare(b.monthYear)
    );

    // Check if sortedTrendData has the correct structure
    // console.log(sortedTrendData);

    // Dual axes configuration
    const config = {
      data: [sortedData, sortedTrendData],
      xField: "monthYear",
      yField: ["count", "Open"],
      xAxis: {
        label: {
          autoRotate: false,
          autoHide: true,
          autoEllipsis: true,
          style: {
            fontSize: 10,
          },
          formatter: (text: string, item: any, index: number) => {
            // Show every 3rd label to prevent overlap
            const totalLabels = sortedData.length;
            const step = totalLabels > 50 ? 6 : totalLabels > 30 ? 4 : totalLabels > 20 ? 3 : 2;
            return index % step === 0 ? text : '';
          },
        },
        tickLine: {
          style: {
            lineWidth: 1,
            stroke: '#e8e8e8',
          },
        },
        line: {
          style: {
            lineWidth: 1,
            stroke: '#e8e8e8',
          },
        },
      },
      geometryOptions: [
        {
          geometry: "column", // Bar chart for categories
          isStack: true,
          seriesField: "type",
          columnStyle: {
            radius: [0, 0, 0, 0],
          },
          tooltip: {
            fields: ["type", "count", "monthYear"], // Include monthYear to access the transformed data
            formatter: ({
              type,
              count,
              monthYear,
            }: {
              type: string;
              count: number;
              monthYear: string;
            }) => {
              const name = type; // Tooltip name remains the type (e.g., Created, Merged, etc.)
              let value;

              if (selectedRepo === "All") {
                // For "All" repo, find the matching item for this month/type
                const matchingItem = chartdata?.find(item => 
                  item.monthYear === monthYear && item.type === type
                );
                
                if (matchingItem && (matchingItem.eips || matchingItem.ercs || matchingItem.rips)) {
                  const eips = Number(matchingItem.eips) || 0;
                  const ercs = Number(matchingItem.ercs) || 0;
                  const rips = Number(matchingItem.rips) || 0;
                  
                  value = `${Math.abs(count)} (eips: ${eips}, ercs: ${ercs}, rips: ${rips})`;
                } else {
                  // If no breakdown available, just show the count
                  value = `${Math.abs(count)}`;
                }
              } else {
                // For non-"All" repos, just display the absolute count
                value = `${Math.abs(count)}`;
              }

              return {
                name,
                value,
              };
            },
          },
          color: (datum: any) => {
            switch (datum.type) {
              case "Closed":
                return "#ff4d4d"; // Soft red
              case "Merged":
                return "#4caf50"; // Balanced green
              case "Created":
                return "#2196f3"; // Medium blue
              default:
                return "defaultColor";
            }
          },
        },
        {
          geometry: "line", // Line chart for trend (Open)
          smooth: true,
          lineStyle: {
            stroke: "#ff00ff", // Magenta line color
            lineWidth: 2,
          },
          // tooltip: {
          //   fields: ['monthYear', 'Open'], // Change to use 'Open'
          //   formatter: ({ monthYear, Open }: { monthYear: string; Open: number }) => ({
          //     name: 'Open',
          //     value: `${Open - getmin}`, // Adjust hover display for line chart
          //   }),
          // },
          tooltip: {
            fields: ["Open", "monthYear"], // Include monthYear to access the transformed data
            formatter: ({
              monthYear,
              Open,
            }: {
              monthYear: string;
              Open: number;
            }) => {
              const name = "Open"; // Tooltip name remains the type (e.g., Created, Merged, etc.)
              let value;

              if (selectedRepo === "All") {
                // For "All" repo, find the matching item for Open
                const matchingItem = chartdata?.find(item => 
                  item.monthYear === monthYear && item.type === "Open"
                );
                
                if (matchingItem && (matchingItem.eips || matchingItem.ercs || matchingItem.rips)) {
                  const eips = Number(matchingItem.eips) || 0;
                  const ercs = Number(matchingItem.ercs) || 0;
                  const rips = Number(matchingItem.rips) || 0;
                  
                  value = `${Open - getmin} (eips: ${eips}, ercs: ${ercs}, rips: ${rips})`;
                } else {
                  // If no breakdown available, just show the count
                  value = `${Open - getmin}`;
                }
              } else {
                // For non-"All" repos, just display the absolute count
                value = `${Open - getmin}`;
              }

              return {
                name,
                value,
              };
            },
          },
          color: "#ff00ff",
        },
      ],
      yAxis: [
        {
          min: -300,
          max: yAxisMax,
          label: { formatter: () => "" },
        },
        {
          min: -300,
          max: yAxisMax,
          label: { formatter: () => "" },
        }
      ],
      slider: {
        start: 0,
        end: 1,
      },
      legend: { position: "top-right" as const },
    };

    return <DualAxes {...config} />;
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
      scrollToHash();
    }
  }, [loading]);

  useLayoutEffect(() => {
    router.events.on("routeChangeComplete", scrollToHash);
    return () => {
      router.events.off("routeChangeComplete", scrollToHash);
    };
  }, [router]);

  useScrollSpy([
  "GithubAnalytics",
  "PrLabelsChart",
  "EIPsLabelChart",
]);


  return loading ? (
    <LoaderComponent />
  ) : (
    <>
      <FeedbackWidget />
      <AllLayout>
        <Box padding={{ base: 3, md: 6 }} margin={{ base: 2, md: 3 }}>
          {/* Animated Header with FAQ */}
          <AnimatedHeader
            title="PR Analytics"
            emoji="📊"
            faqItems={[
              {
                question: "💡 What does this tool do?",
                answer: "This tool aims to automate the process of tracking PRs and issues in GitHub repositories, providing visualizations and reports to streamline project management. The default view utilizes the timeline to observe trends in the number of Created, Closed, Merged, and Open PRs/Issues at the end of each month."
              },
              {
                question: "📅 How can I view data for a specific month?",
                answer: "To focus on a specific month, click the View More button and choose the desired Year and Month from the dropdown menus. The table and graph will then update to display data exclusively for that selected month."
              },
              {
                question: "🎨 How to customize the chart?",
                answer: "To customize the chart, you can adjust the timeline scroll bar to display data for a specific month/year. Additionally, you can tailor the graph by selecting or deselecting checkboxes for Created, Closed, Merged, and Open PRs/Issues, allowing you to focus on the trends that are most relevant to you."
              },
              {
                question: "📥 How to download reports?",
                answer: "After selecting your preferred data using the View More option, you can download reports based on the filtered data for further analysis or record-keeping. Simply click the download button to export the data in your chosen format."
              }
            ]}
          />

          {/* Tabs and Advertisement in same row */}
          <Flex 
            direction={{ base: "column", md: "row" }} 
            justify="space-between" 
            align="center" 
            mb={4} 
            gap={4}
            my={5}
          >
            {/* EIPs/ERCs Tabs - Left side */}
            <Flex justify={{ base: "center", md: "flex-start" }} gap={4} flex="1">
              <Button
                colorScheme="blue"
                onClick={() => setActiveTab("PRs")}
                isActive={activeTab === "PRs"}
                variant={activeTab === "PRs" ? "solid" : "outline"}
                fontWeight="semibold"
                px={8}
                _hover={{ transform: "translateY(-2px)", boxShadow: "md" }}
                transition="all 0.2s"
              >
                PRs
              </Button>
              <Button
                colorScheme="blue"
                onClick={() => setActiveTab("Issues")}
                isActive={activeTab === "Issues"}
                variant={activeTab === "Issues" ? "solid" : "outline"}
                fontWeight="semibold"
                px={8}
                _hover={{ transform: "translateY(-2px)", boxShadow: "md" }}
                transition="all 0.2s"
              >
                Issues
              </Button>
            </Flex>

            {/* Advertisement - Right side */}
            <Box flex={{ base: "1", md: "0 0 auto" }} w={{ base: "100%", md: "auto" }}>
              <CloseableAdCard />
            </Box>
          </Flex>

          <Box
            bgColor={bg}
            padding={{ base: "1rem", md: "1.5rem" }}
            borderRadius="lg"
            boxShadow="lg"
            borderWidth="1px"
            borderColor={useColorModeValue('gray.200', 'gray.600')}
            transition="all 0.3s"
            _hover={{
              boxShadow: "xl",
              transform: "translateY(-2px)",
            }}
          >
            <Box id="GithubAnalytics" borderRadius={"lg"} bg={useColorModeValue('white', 'gray.800')} p={{ base: 3, md: 4 }}>
              <Flex
                justifyContent="space-between"
                alignItems="center"
                marginBottom="0.5rem"
              >
                <Heading fontSize="36px" fontWeight="bold" color="#40E0D0">
                  {`Github PR Analytics (Monthly, since 2015)`}
                  <CopyLink
                    link={`https://eipsinsight.com//Analytics#GithubAnalytics`}
                  />
                </Heading>
                {/* Download all data button */}
                <Button
                  colorScheme="blue"
                  variant="solid"
                  leftIcon={loading3 ? undefined : <DownloadIcon />}
                  onClick={async () => {
                    try {
                      // Trigger the CSV conversion and download
                      handleDownload2();

                      // Trigger the API call
                      await axios.post("/api/DownloadCounter");
                    } catch (error) {
                      console.error(
                        "Error triggering download counter:",
                        error
                      );
                    }
                  }}
                  disabled={loading3}
                  fontSize={{ base: "0.6rem", md: "md" }}
                  _hover={{ transform: "translateY(-2px)", boxShadow: "md" }}
                  transition="all 0.2s"
                  title={loading3 ? "Loading data..." : "Download all historical data with selected category filters"}
                >
                  {loading3 ? (
                    <>
                      <Spinner size="sm" mr={2} /> Loading...
                    </>
                  ) : (
                    "Download All Data (CSV)"
                  )}
                </Button>
              </Flex>
              <Flex justify="center" mb={8}>
                <Menu>
                  <MenuButton
                    as={Button}
                    rightIcon={<ChevronDownIcon />}
                    colorScheme="blue"
                    size="md"
                    width="200px"
                    fontWeight="semibold"
                    _hover={{ transform: "translateY(-2px)", boxShadow: "md" }}
                    transition="all 0.2s"
                  >
                    {selectedRepo || "Select an option"}
                  </MenuButton>

                  <MenuList maxHeight="200px" overflowY="auto">
                    {/* Option for All */}
                    <MenuItem onClick={() => setSelectedRepo("All")}>
                      All
                    </MenuItem>

                    {/* Option for EIPs */}
                    <MenuItem onClick={() => setSelectedRepo("EIPs")}>
                      EIPs
                    </MenuItem>

                    {/* Option for ERCs */}
                    <MenuItem onClick={() => setSelectedRepo("ERCs")}>
                      ERCs
                    </MenuItem>

                    {/* Option for RIPs */}
                    <MenuItem onClick={() => setSelectedRepo("RIPs")}>
                      RIPs
                    </MenuItem>
                  </MenuList>
                </Menu>
              </Flex>

              {renderChart()}
              <Box className={"w-full"}>
                <LastUpdatedDateTime name="AnalyticsScheduler" />
              </Box>
              <Box mt={2}>
                <Text color="gray.500" fontStyle="italic" textAlign="center">
                  *Note: The data is updated daily at 15:00 UTC to maintain
                  accuracy and provide the most current information.*
                </Text>
                <Text color="gray.500" fontStyle="italic" textAlign="center">
                  *Note: The data related to the number of PRs might vary when
                  compared to official github repository due to factors like
                  deleted PRs.*
                </Text>
              </Box>
              <br />

              <Flex justify="center" ml={3} mb={8} flexWrap="wrap" gap={2}>
                <Checkbox
                  isChecked={showCategory.created}
                  onChange={() =>
                    setShowCategory((prev) => ({
                      ...prev,
                      created: !prev.created,
                    }))
                  }
                  colorScheme="blue"
                  mr={3}
                  fontSize={{ base: "xs", md: "sm" }}
                  fontWeight="medium"
                >
                  {activeTab === "PRs" ? "Created PRs" : "Created Issues"}
                </Checkbox>

                <Checkbox
                  isChecked={showCategory.open}
                  onChange={() =>
                    setShowCategory((prev) => ({ ...prev, open: !prev.open }))
                  }
                  colorScheme="purple"
                  mr={3}
                  fontSize={{ base: "xs", md: "sm" }}
                  fontWeight="medium"
                >
                  Open PRs
                </Checkbox>

                <Checkbox
                  isChecked={showCategory.closed}
                  onChange={() =>
                    setShowCategory((prev) => ({
                      ...prev,
                      closed: !prev.closed,
                    }))
                  }
                  colorScheme="red"
                  mr={3}
                  fontSize={{ base: "xs", md: "sm" }}
                  fontWeight="medium"
                >
                  {activeTab === "PRs" ? "Closed PRs" : "Closed Issues"}
                </Checkbox>
                {activeTab === "PRs" && (
                  <Checkbox
                    isChecked={showCategory.merged}
                    onChange={() =>
                      setShowCategory((prev) => ({
                        ...prev,
                        merged: !prev.merged,
                      }))
                    }
                    colorScheme="green"
                    mr={3}
                    fontSize={{ base: "xs", md: "sm" }}
                    fontWeight="medium"
                  >
                    Merged PRs
                  </Checkbox>
                )}
              </Flex>
              <Box
                bg={useColorModeValue("blue.50", "gray.700")}
                p={3}
                borderRadius="md"
                textAlign="center"
                mt={4}
              >
                <Text fontSize="sm" color={useColorModeValue("blue.700", "blue.300")} fontWeight="medium">
                  💡 Tip: The checkboxes above control both the chart display and CSV downloads
                </Text>
              </Box>
            </Box>
          </Box>

          <br />

          
          <Box mt={2} id="EIPsLabelChart">
            <PRAnalyticsCard/>
          </Box>

                    <Box my={12}>
            <PlaceYourAdCard />
          </Box>

  <br />
          <Flex justify="center" mb={8}>
            <Button 
              colorScheme="blue" 
              onClick={toggleDropdown}
              size="lg"
              fontWeight="semibold"
              px={8}
              _hover={{ transform: "translateY(-2px)", boxShadow: "md" }}
              transition="all 0.2s"
            >
              {showDropdown ? "Hide" : "View More"}
            </Button>
          </Flex>

          {showDropdown && (
            <Box mb={8} display="flex" justifyContent="center">
              <HStack spacing={4}>
                <Menu>
                  <MenuButton
                    as={Button}
                    rightIcon={<ChevronDownIcon />}
                    colorScheme="blue"
                  >
                    {selectedYear ? `Year: ${selectedYear}` : "Select Year"}
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
                    {selectedMonth ? `Month: ${selectedMonth}` : "Select Month"}
                  </MenuButton>
                  <MenuList>
                    {selectedYear &&
                      getMonths()?.map((month, index) => (
                        <MenuItem
                          key={index}
                          onClick={() => setSelectedMonth(month)}
                        >
                          {month}
                        </MenuItem>
                      ))}
                  </MenuList>
                </Menu>
              </HStack>
            </Box>
          )}

          {selectedYear && selectedMonth && (
            <Box mt={8} display="flex" justifyContent="flex-end" flexDirection="column" alignItems="flex-end" gap={2}>
              <Text fontSize="sm" color={useColorModeValue("gray.600", "gray.400")}>
                Download filtered data for {selectedMonth} {selectedYear}
              </Text>
              <Button
                colorScheme="blue"
                onClick={async () => {
                  try {
                    // Trigger the CSV conversion and download
                    handleDownload();

                    // Trigger the API call
                    await axios.post("/api/DownloadCounter");
                  } catch (error) {
                    console.error("Error triggering download counter:", error);
                  }
                }}
                disabled={loading2}
                leftIcon={<DownloadIcon />}
              >
                {loading2 ? <Spinner size="sm" /> : `Download ${selectedMonth} ${selectedYear} CSV`}
              </Button>
            </Box>
          )}
          {showDropdown && (
            <>
              {selectedYear && selectedMonth && (
                <Box mt={2}>
                  {renderTable(selectedYear, selectedMonth, activeTab)}
                </Box>
              )}
            </>
          )}

          <Box mt={2} id="EIPsLabelChart">
            <EipsLabelChart />
          </Box>


          <Box>
            <br />
            <hr></hr>
            <br />
            <Text fontSize="36px" fontWeight="bold" color="#40E0D0">
              Comments
            </Text>
            <Comments page={"Analytics"} />
          </Box>
        </Box>
      </AllLayout>
    </>
  );
};

export default GitHubPRTracker;
