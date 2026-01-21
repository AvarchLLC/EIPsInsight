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
import { FiFileText, FiLayers, FiUsers, FiPauseCircle, FiAlertTriangle } from "react-icons/fi";

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

const Stagnant = () => {
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

  const stagnantData = useMemo(() => data.filter(item => item.status === "Stagnant"), [data]);
  const categoryDistribution = useMemo(() => {
    const categories: { [key: string]: number } = {};
    stagnantData.forEach(item => {
      categories[item.category] = (categories[item.category] || 0) + 1;
    });
    const total = stagnantData.length;
    const colorMap: { [key: string]: string } = { Core: "blue", ERC: "purple", Networking: "green", Interface: "orange", Meta: "cyan", Informational: "pink" };
    return Object.entries(categories).map(([category, count]) => ({ category, count, percentage: (count / total) * 100, color: colorMap[category] || "gray" }));
  }, [stagnantData]);
  const uniqueAuthors = useMemo(() => {
    const authors = new Set<string>();
    stagnantData.forEach(item => item.author.split(",").forEach(author => authors.add(author.trim())));
    return authors.size;
  }, [stagnantData]);

  const potentialRevival = useMemo(() => {
    return stagnantData.filter(item => item.discussion && item.discussion.trim() !== "").length;
  }, [stagnantData]);

  const faqs = [
    {
      question: "Why do EIPs become Stagnant?",
      answer: "An EIP becomes Stagnant when it has been inactive for 6 months or more with no updates or progress. This typically happens when authors abandon proposals or when there's lack of interest from the community."
    },
    {
      question: "Can Stagnant EIPs be revived?",
      answer: "Yes! Stagnant EIPs can be moved back to Draft status if the author or a new champion resumes work on them. They need to be updated and actively maintained to move forward."
    },
    {
      question: "Should Stagnant EIPs be implemented?",
      answer: "No. Stagnant EIPs are inactive and should not be implemented. If you're interested in a stagnant proposal, consider becoming its champion and reviving it."
    },
    {
      question: "What metrics are shown for Stagnant EIPs?",
      answer: "We track total stagnant proposals, those with discussion links (potential for revival), ERC proposals affected, category distribution, and original authors."
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
                title={`Stagnant EIPs [ ${stagnantData.length} ]`}
                subtitle="Stagnant EIPs are inactive and have not progressed for a prolonged period."
                description="These proposals have not been updated or discussed recently and may need renewed attention."
              />
            </FlexBetween>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
              <AnalyticsStatCard label="Stagnant EIPs" value={stagnantData.length} icon={FiPauseCircle} colorScheme="gray" helpText="Inactive proposals" />
              <AnalyticsStatCard label="With Discussions" value={potentialRevival} icon={FiAlertTriangle} colorScheme="yellow" helpText="Revival potential" />
              <AnalyticsStatCard label="ERC Stagnant" value={stagnantData.filter(item => item.category === "ERC").length} icon={FiFileText} colorScheme="purple" helpText="App standards" />
              <AnalyticsStatCard label="Authors" value={uniqueAuthors} icon={FiUsers} colorScheme="orange" helpText="Original authors" />
            </SimpleGrid>
            <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={6} mb={8}>
              <CategoryDistributionChart data={categoryDistribution} title="Stagnant by Category" />
              <StatusInsightsCard title="Stagnant Insights" insights={[{ label: "Most Affected", value: categoryDistribution[0]?.category || "N/A", icon: FiLayers, colorScheme: "blue" }, { label: "Core Stagnant", value: stagnantData.filter(item => item.category === "Core").length, icon: FiFileText, colorScheme: "gray" }, { label: "Network Proposals", value: stagnantData.filter(item => item.category === "Networking").length, icon: FiFileText, colorScheme: "orange" }, { label: "Categories", value: categoryDistribution.length, icon: FiLayers, colorScheme: "cyan" }]} />
            </Grid>
            <Box mb={6}><FAQSection title="About Stagnant EIPs" faqs={faqs} /></Box>
            <Box mb={6}>{/* <CloseableAdCard /> */}</Box>
            <TableStatusByStatus status="Stagnant" />
          </Box>
        </motion.div>
      )}
    </AllLayout>
  );
};

export default Stagnant;
