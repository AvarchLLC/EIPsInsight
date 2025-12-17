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
import { FiFileText, FiLayers, FiUsers, FiClock, FiGitPullRequest } from "react-icons/fi";

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

const Draft = () => {
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

  const draftData = useMemo(() => data.filter(item => item.status === "Draft"), [data]);

  const categoryDistribution = useMemo(() => {
    const categories: { [key: string]: number } = {};
    draftData.forEach(item => {
      categories[item.category] = (categories[item.category] || 0) + 1;
    });
    
    const total = draftData.length;
    const colorMap: { [key: string]: string } = {
      Core: "blue",
      ERC: "purple",
      Networking: "green",
      Interface: "orange",
      Meta: "cyan",
      Informational: "pink"
    };

    return Object.entries(categories).map(([category, count]) => ({
      category,
      count,
      percentage: (count / total) * 100,
      color: colorMap[category] || "gray"
    }));
  }, [draftData]);

  const uniqueAuthors = useMemo(() => {
    const authors = new Set<string>();
    draftData.forEach(item => {
      const authorList = item.author.split(",");
      authorList.forEach(author => authors.add(author.trim()));
    });
    return authors.size;
  }, [draftData]);

  const recentDrafts = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return draftData.filter(item => {
      const year = new Date(item.created).getFullYear();
      return year === currentYear;
    }).length;
  }, [draftData]);

  const withDiscussions = useMemo(() => {
    return draftData.filter(item => item.discussion && item.discussion.trim() !== "").length;
  }, [draftData]);

  const faqs = [
    {
      question: "What is a Draft EIP?",
      answer: "A Draft EIP is a proposal in its initial stage, open for community feedback and refinement. It represents the starting point for all EIP proposals before they move through the review process."
    },
    {
      question: "How long does an EIP stay in Draft status?",
      answer: "There's no fixed timeline. An EIP remains in Draft status until the author feels it's ready for Review, or until it becomes Stagnant due to inactivity (typically 6+ months without updates)."
    },
    {
      question: "Can Draft EIPs be implemented?",
      answer: "While Draft EIPs can be experimented with, they should not be considered stable or final. Implementations should wait for at least Review or Final status for production use."
    },
    {
      question: "What metrics are shown for Draft EIPs?",
      answer: "We track total drafts, category distribution, unique authors, EIPs created this year, and drafts with active community discussions to show engagement levels."
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
                title={`Draft EIPs [ ${draftData.length} ]`}
                subtitle="Draft EIPs are proposals still under initial consideration and open for feedback."
                description="These proposals are in the early stages and may undergo significant changes."
              />
            </FlexBetween>

            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
              <AnalyticsStatCard
                label="Total Drafts"
                value={draftData.length}
                icon={FiFileText}
                colorScheme="orange"
                helpText="Active proposals"
              />
              <AnalyticsStatCard
                label="Created This Year"
                value={recentDrafts}
                icon={FiClock}
                colorScheme="purple"
                helpText={`New in ${new Date().getFullYear()}`}
              />
              <AnalyticsStatCard
                label="With Discussions"
                value={withDiscussions}
                icon={FiGitPullRequest}
                colorScheme="cyan"
                helpText="Community engaged"
              />
              <AnalyticsStatCard
                label="Contributors"
                value={uniqueAuthors}
                icon={FiUsers}
                colorScheme="green"
                helpText="Unique authors"
              />
            </SimpleGrid>

            <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={6} mb={8}>
              <CategoryDistributionChart
                data={categoryDistribution}
                title="Distribution by Category"
              />
              <StatusInsightsCard
                title="Draft Insights"
                insights={[
                  {
                    label: "Top Category",
                    value: categoryDistribution[0]?.category || "N/A",
                    icon: FiLayers,
                    colorScheme: "blue"
                  },
                  {
                    label: "ERC Drafts",
                    value: draftData.filter(item => item.category === "ERC").length,
                    icon: FiFileText,
                    colorScheme: "purple"
                  },
                  {
                    label: "Core Drafts",
                    value: draftData.filter(item => item.category === "Core").length,
                    icon: FiFileText,
                    colorScheme: "orange"
                  },
                  {
                    label: "Categories",
                    value: categoryDistribution.length,
                    icon: FiLayers,
                    colorScheme: "cyan"
                  }
                ]}
              />
            </Grid>
            
            <Box mb={6}>
              <FAQSection title="About Draft EIPs" faqs={faqs} />
            </Box>
            <Box mb={6}>
              <CloseableAdCard />
            </Box>
            
            <TableStatusByStatus status="Draft" />
          </Box>
        </motion.div>
      )}
    </AllLayout>
  );
};

export default Draft;
