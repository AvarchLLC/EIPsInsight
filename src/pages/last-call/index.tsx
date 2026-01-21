import React, { useEffect, useState, useMemo } from "react";
import CloseableAdCard from "@/components/CloseableAdCard";
import AllLayout from "@/components/Layout";
import { Box, useColorModeValue, SimpleGrid, Grid } from "@chakra-ui/react";
import FlexBetween from "@/components/FlexBetween";
import Header from "@/components/Header";
import { motion } from "framer-motion";
import LoaderComponent from "@/components/Loader";
import TableStatusByStatus from "@/components/TableStatusByStatus";
import StatusTabNavigation from "@/components/StatusTabNavigation";
import AnalyticsStatCard from "@/components/AnalyticsStatCard";
import CategoryDistributionChart from "@/components/CategoryDistributionChart";
import StatusInsightsCard from "@/components/StatusInsightsCard";
import FAQSection from "@/components/FAQSection";
import { FiFileText, FiLayers, FiUsers, FiAlertCircle, FiClock } from "react-icons/fi";

interface EIP {
  _id: string;
  eip: string;
  title: string;
  author: string;
  status: string;
  type: string;
  category: string;
  created: string;
  discussion: string;
  deadline: string;
  requires: string;
  unique_ID: number;
  __v: number;
}

const statuses = [
  { name: "Draft", path: "/draft" },
  { name: "Review", path: "/review" },
  { name: "Last Call", path: "/last-call" },
  { name: "Final", path: "/final" },
  { name: "Stagnant", path: "/stagnant" },
  { name: "Withdrawn", path: "/withdrawn" },
  { name: "Living", path: "/living" },
];

const LastCall = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<EIP[]>([]);
  const bg = useColorModeValue("#f6f6f7", "#171923");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/new/all`);
        const jsonData = await response.json();
        const allData = jsonData.eip?.concat(jsonData.erc?.concat(jsonData.rip)) || [];
        setData(allData);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const lastCallData = useMemo(() => data.filter(item => item.status === "Last Call"), [data]);
  const categoryDistribution = useMemo(() => {
    const categories: { [key: string]: number } = {};
    lastCallData.forEach(item => {
      categories[item.category] = (categories[item.category] || 0) + 1;
    });
    const total = lastCallData.length;
    const colorMap: { [key: string]: string } = { Core: "blue", ERC: "purple", Networking: "green", Interface: "orange", Meta: "cyan", Informational: "pink" };
    return Object.entries(categories).map(([category, count]) => ({ category, count, percentage: (count / total) * 100, color: colorMap[category] || "gray" }));
  }, [lastCallData]);
  const uniqueAuthors = useMemo(() => {
    const authors = new Set<string>();
    lastCallData.forEach(item => item.author.split(",").forEach(author => authors.add(author.trim())));
    return authors.size;
  }, [lastCallData]);

  const withDeadlines = useMemo(() => {
    return lastCallData.filter(item => item.deadline && item.deadline.trim() !== "").length;
  }, [lastCallData]);

  const faqs = [
    {
      question: "What is Last Call status?",
      answer: "Last Call is the final review period before an EIP becomes Final. It signals that the proposal is stable and ready for final community review, with a specific deadline for feedback."
    },
    {
      question: "How long is the Last Call period?",
      answer: "The Last Call period is typically 14 days, though it can be extended if significant issues are raised. The deadline date is specified in each EIP."
    },
    {
      question: "Can changes be made during Last Call?",
      answer: "Only minor editorial changes are allowed during Last Call. Substantive changes would require the EIP to return to Review status."
    },
    {
      question: "What metrics are shown for Last Call EIPs?",
      answer: "We track total proposals in Last Call, those with specified deadlines, Core protocol proposals, category distribution, and unique contributors."
    }
  ];

  return (
    <AllLayout>
      {isLoading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <LoaderComponent />
          </motion.div>
        </Box>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
          <Box px={{ base: 4, md: 8, lg: 16 }} py={{ base: 4, lg: 8 }} maxW="1600px" mx="auto">
            <StatusTabNavigation tabs={statuses} />
            <FlexBetween mb={8}>
              <Header
                title={`Last Call EIPs [ ${lastCallData.length} ]`}
                subtitle="Last Call EIPs are nearing finalization, with a short period for final community comments."
                description="These proposals are in the final review period before becoming final."
              />
            </FlexBetween>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
              <AnalyticsStatCard label="In Last Call" value={lastCallData.length} icon={FiAlertCircle} colorScheme="yellow" helpText="Final review" />
              <AnalyticsStatCard label="With Deadlines" value={withDeadlines} icon={FiClock} colorScheme="orange" helpText="Review ending soon" />
              <AnalyticsStatCard label="Core Proposals" value={lastCallData.filter(item => item.category === "Core").length} icon={FiFileText} colorScheme="blue" helpText="Protocol changes" />
              <AnalyticsStatCard label="Contributors" value={uniqueAuthors} icon={FiUsers} colorScheme="green" helpText="Authors" />
            </SimpleGrid>
            <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={6} mb={8}>
              <CategoryDistributionChart data={categoryDistribution} title="Last Call by Category" />
              <StatusInsightsCard title="Last Call Insights" insights={[{ label: "Top Category", value: categoryDistribution[0]?.category || "N/A", icon: FiLayers, colorScheme: "blue" }, { label: "ERC Proposals", value: lastCallData.filter(item => item.category === "ERC").length, icon: FiFileText, colorScheme: "purple" }, { label: "Network Changes", value: lastCallData.filter(item => item.category === "Networking").length, icon: FiFileText, colorScheme: "green" }, { label: "Categories", value: categoryDistribution.length, icon: FiLayers, colorScheme: "cyan" }]} />
            </Grid>
            <Box mb={6}><FAQSection title="About Last Call EIPs" faqs={faqs} /></Box>
            <Box mb={6}>{/* <CloseableAdCard /> */}</Box>
            <TableStatusByStatus status="Last Call" />
          </Box>
        </motion.div>
      )}
    </AllLayout>
  );
};

export default LastCall;
