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
import { FiFileText, FiLayers, FiUsers, FiEye, FiGitPullRequest } from "react-icons/fi";

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

const Review = () => {
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

  const reviewData = useMemo(() => data.filter(item => item.status === "Review"), [data]);
  const categoryDistribution = useMemo(() => {
    const categories: { [key: string]: number } = {};
    reviewData.forEach(item => {
      categories[item.category] = (categories[item.category] || 0) + 1;
    });
    const total = reviewData.length;
    const colorMap: { [key: string]: string } = { Core: "blue", ERC: "purple", Networking: "green", Interface: "orange", Meta: "cyan", Informational: "pink" };
    return Object.entries(categories).map(([category, count]) => ({ category, count, percentage: (count / total) * 100, color: colorMap[category] || "gray" }));
  }, [reviewData]);
  const uniqueAuthors = useMemo(() => {
    const authors = new Set<string>();
    reviewData.forEach(item => item.author.split(",").forEach(author => authors.add(author.trim())));
    return authors.size;
  }, [reviewData]);

  const withDiscussions = useMemo(() => {
    return reviewData.filter(item => item.discussion && item.discussion.trim() !== "").length;
  }, [reviewData]);

  const faqs = [
    {
      question: "What does Review status mean?",
      answer: "Review status indicates that an EIP is ready for community and editor review. The proposal has been refined from Draft and is being actively evaluated for technical accuracy and completeness."
    },
    {
      question: "How is Review different from Draft?",
      answer: "Review EIPs have been refined and are considered ready for formal evaluation. Draft EIPs are still in initial development and may have incomplete specifications."
    },
    {
      question: "How long does the Review period last?",
      answer: "There's no fixed Review period. An EIP stays in Review until editors and the community are satisfied it's ready to move to Last Call, or it may return to Draft for further refinement."
    },
    {
      question: "What metrics are shown for Review EIPs?",
      answer: "We track total proposals under review, category distribution showing diversity, unique contributors, ERCs under review, and proposals with active discussions."
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
                title={`Review EIPs [ ${reviewData.length} ]`}
                subtitle="EIPs in the Review stage are being actively discussed and evaluated by the community."
                description="These proposals are under active consideration and may be refined based on feedback."
              />
            </FlexBetween>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
              <AnalyticsStatCard label="Under Review" value={reviewData.length} icon={FiEye} colorScheme="cyan" helpText="Active reviews" />
              <AnalyticsStatCard label="ERC Reviews" value={reviewData.filter(item => item.category === "ERC").length} icon={FiFileText} colorScheme="purple" helpText="App standards" />
              <AnalyticsStatCard label="With Discussions" value={withDiscussions} icon={FiGitPullRequest} colorScheme="orange" helpText="Community engaged" />
              <AnalyticsStatCard label="Contributors" value={uniqueAuthors} icon={FiUsers} colorScheme="green" helpText="Active authors" />
            </SimpleGrid>
            <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={6} mb={8}>
              <CategoryDistributionChart data={categoryDistribution} title="Review EIPs by Category" />
              <StatusInsightsCard title="Review Insights" insights={[{ label: "Top Category", value: categoryDistribution[0]?.category || "N/A", icon: FiLayers, colorScheme: "blue" }, { label: "Core Reviews", value: reviewData.filter(item => item.category === "Core").length, icon: FiFileText, colorScheme: "cyan" }, { label: "Networking", value: reviewData.filter(item => item.category === "Networking").length, icon: FiFileText, colorScheme: "green" }, { label: "Categories", value: categoryDistribution.length, icon: FiLayers, colorScheme: "purple" }]} />
            </Grid>
            <Box mb={6}><FAQSection title="About Review EIPs" faqs={faqs} /></Box>
            <Box mb={6}>{/* <CloseableAdCard /> */}</Box>
            <TableStatusByStatus status="Review" />
          </Box>
        </motion.div>
      )}
    </AllLayout>
  );
};

export default Review;
