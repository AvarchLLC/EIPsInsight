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
import { FiFileText, FiLayers, FiUsers, FiRefreshCw, FiGitPullRequest } from "react-icons/fi";

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

const Living = () => {
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

  const livingData = useMemo(() => data.filter(item => item.status === "Living"), [data]);
  const categoryDistribution = useMemo(() => {
    const categories: { [key: string]: number } = {};
    livingData.forEach(item => {
      categories[item.category] = (categories[item.category] || 0) + 1;
    });
    const total = livingData.length;
    const colorMap: { [key: string]: string } = { Core: "blue", ERC: "purple", Networking: "green", Interface: "orange", Meta: "cyan", Informational: "pink" };
    return Object.entries(categories).map(([category, count]) => ({ category, count, percentage: (count / total) * 100, color: colorMap[category] || "gray" }));
  }, [livingData]);
  const uniqueAuthors = useMemo(() => {
    const authors = new Set<string>();
    livingData.forEach(item => item.author.split(",").forEach(author => authors.add(author.trim())));
    return authors.size;
  }, [livingData]);

  const withDiscussions = useMemo(() => {
    return livingData.filter(item => item.discussion && item.discussion.trim() !== "").length;
  }, [livingData]);

  const faqs = [
    {
      question: "What is a Living EIP?",
      answer: "A Living EIP is a document that is continually updated and never reaches Final status. These are typically process documents, guidelines, or lists that evolve with the Ethereum ecosystem."
    },
    {
      question: "How are Living EIPs different from Final EIPs?",
      answer: "Final EIPs are frozen specifications that don't change once approved. Living EIPs are meant to be dynamic documents that get updated regularly as standards and practices evolve."
    },
    {
      question: "Who can update Living EIPs?",
      answer: "Living EIPs are typically maintained by their authors or designated maintainers. Changes follow a similar review process as other EIPs to ensure quality and accuracy."
    },
    {
      question: "What metrics are shown for Living EIPs?",
      answer: "We track total living documents, category distribution, maintainers, Meta process standards (most common for Living status), and documents with active discussions."
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
                title={`Living EIPs [ ${livingData.length} ]`}
                subtitle="Living EIPs are continuously updated and reflect evolving standards or documentation."
                description="These proposals are maintained and updated as standards evolve over time."
              />
            </FlexBetween>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
              <AnalyticsStatCard label="Living Documents" value={livingData.length} icon={FiRefreshCw} colorScheme="teal" helpText="Active standards" />
              <AnalyticsStatCard label="Meta Living" value={livingData.filter(item => item.category === "Meta").length} icon={FiFileText} colorScheme="cyan" helpText="Process docs" />
              <AnalyticsStatCard label="With Discussions" value={withDiscussions} icon={FiGitPullRequest} colorScheme="purple" helpText="Active updates" />
              <AnalyticsStatCard label="Maintainers" value={uniqueAuthors} icon={FiUsers} colorScheme="green" helpText="Contributors" />
            </SimpleGrid>
            <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={6} mb={8}>
              <CategoryDistributionChart data={categoryDistribution} title="Living EIPs by Category" />
              <StatusInsightsCard title="Living Standards Insights" insights={[{ label: "Top Category", value: categoryDistribution[0]?.category || "N/A", icon: FiLayers, colorScheme: "blue" }, { label: "Core Living", value: livingData.filter(item => item.category === "Core").length, icon: FiFileText, colorScheme: "teal" }, { label: "Informational", value: livingData.filter(item => item.category === "Informational").length, icon: FiFileText, colorScheme: "purple" }, { label: "Categories", value: categoryDistribution.length, icon: FiLayers, colorScheme: "cyan" }]} />
            </Grid>
            <Box mb={6}><FAQSection title="About Living EIPs" faqs={faqs} /></Box>
            <Box mb={6}>{/* <CloseableAdCard /> */}</Box>
            <TableStatusByStatus status="Living" />
          </Box>
        </motion.div>
      )}
    </AllLayout>
  );
};

export default Living;
