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
import { FiFileText, FiLayers, FiUsers, FiXCircle, FiInfo } from "react-icons/fi";

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

const Withdrawn = () => {
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

  const withdrawnData = useMemo(() => data.filter(item => item.status === "Withdrawn"), [data]);
  const categoryDistribution = useMemo(() => {
    const categories: { [key: string]: number } = {};
    withdrawnData.forEach(item => {
      categories[item.category] = (categories[item.category] || 0) + 1;
    });
    const total = withdrawnData.length;
    const colorMap: { [key: string]: string } = { Core: "blue", ERC: "purple", Networking: "green", Interface: "orange", Meta: "cyan", Informational: "pink" };
    return Object.entries(categories).map(([category, count]) => ({ category, count, percentage: (count / total) * 100, color: colorMap[category] || "gray" }));
  }, [withdrawnData]);
  const uniqueAuthors = useMemo(() => {
    const authors = new Set<string>();
    withdrawnData.forEach(item => item.author.split(",").forEach(author => authors.add(author.trim())));
    return authors.size;
  }, [withdrawnData]);

  const recentlyWithdrawn = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return withdrawnData.filter(item => {
      const year = new Date(item.created).getFullYear();
      return year === currentYear;
    }).length;
  }, [withdrawnData]);

  const faqs = [
    {
      question: "Why are EIPs withdrawn?",
      answer: "EIPs are withdrawn when the author decides to abandon the proposal, when it's superseded by another EIP, or when fundamental issues make it unviable. Withdrawal is a voluntary action by the author."
    },
    {
      question: "Can Withdrawn EIPs be revived?",
      answer: "Generally no. Withdrawn status is permanent. If you want to pursue a similar idea, you should create a new EIP that references the withdrawn one and addresses why the new approach is different."
    },
    {
      question: "What's the difference between Withdrawn and Stagnant?",
      answer: "Withdrawn EIPs are explicitly abandoned by their authors, while Stagnant EIPs simply became inactive. Stagnant EIPs can be revived, but Withdrawn ones cannot."
    },
    {
      question: "What metrics are shown for Withdrawn EIPs?",
      answer: "We track total withdrawn proposals, recently withdrawn this year, ERC withdrawals, category distribution, and original authors to understand abandonment patterns."
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
                title={`Withdrawn EIPs [ ${withdrawnData.length} ]`}
                subtitle="Withdrawn EIPs have been removed from consideration by the author or due to lack of support."
                description="These proposals have been officially withdrawn and are no longer being pursued."
              />
            </FlexBetween>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
              <AnalyticsStatCard label="Withdrawn EIPs" value={withdrawnData.length} icon={FiXCircle} colorScheme="red" helpText="Abandoned proposals" />
              <AnalyticsStatCard label="This Year" value={recentlyWithdrawn} icon={FiInfo} colorScheme="orange" helpText={`Withdrawn in ${new Date().getFullYear()}`} />
              <AnalyticsStatCard label="ERC Withdrawn" value={withdrawnData.filter(item => item.category === "ERC").length} icon={FiFileText} colorScheme="purple" helpText="App standards" />
              <AnalyticsStatCard label="Authors" value={uniqueAuthors} icon={FiUsers} colorScheme="gray" helpText="Original authors" />
            </SimpleGrid>
            <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={6} mb={8}>
              <CategoryDistributionChart data={categoryDistribution} title="Withdrawn by Category" />
              <StatusInsightsCard title="Withdrawal Insights" insights={[{ label: "Most Withdrawn", value: categoryDistribution[0]?.category || "N/A", icon: FiLayers, colorScheme: "blue" }, { label: "Core Withdrawn", value: withdrawnData.filter(item => item.category === "Core").length, icon: FiFileText, colorScheme: "red" }, { label: "Network Proposals", value: withdrawnData.filter(item => item.category === "Networking").length, icon: FiFileText, colorScheme: "orange" }, { label: "Categories", value: categoryDistribution.length, icon: FiLayers, colorScheme: "cyan" }]} />
            </Grid>
            <Box mb={6}><FAQSection title="About Withdrawn EIPs" faqs={faqs} /></Box>
            <Box mb={6}>{/* <CloseableAdCard /> */}</Box>
            <TableStatusByStatus status="Withdrawn" />
          </Box>
        </motion.div>
      )}
    </AllLayout>
  );
};

export default Withdrawn;
