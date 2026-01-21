import React, { useEffect, useState, useMemo } from "react";
import CloseableAdCard from "@/components/CloseableAdCard";
import AllLayout from "@/components/Layout";
import { Box, useColorModeValue, SimpleGrid, Grid } from "@chakra-ui/react";
import FlexBetween from "@/components/FlexBetween";
import Header from "@/components/Header";
import { motion } from "framer-motion";
import LoaderComponent from "@/components/Loader";
import TableStatus from "@/components/TableStatus";
import StatusColumnChart from "@/components/StatusColumnChart";
import StatusTabNavigation from "@/components/StatusTabNavigation";
import AnalyticsStatCard from "@/components/AnalyticsStatCard";
import CategoryDistributionChart from "@/components/CategoryDistributionChart";
import StatusInsightsCard from "@/components/StatusInsightsCard";
import FAQSection from "@/components/FAQSection";
import { FiFileText, FiCheckCircle, FiUsers, FiCpu, FiGitPullRequest } from "react-icons/fi";

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

const categories = [
  { name: "Core", path: "/core" },
  { name: "Networking", path: "/networking" },
  { name: "Interface", path: "/interface" },
  { name: "Meta", path: "/meta" },
  { name: "Informational", path: "/informational" },
  { name: "ERC", path: "/erc" },
];

const Core = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<EIP[]>([]);
  const bg = useColorModeValue("#f6f6f7", "#171923");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/new/all`);
        const jsonData = await response.json();
        setData(jsonData.eip);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const coreData = useMemo(() => data.filter(item => item.category === "Core"), [data]);
  const statusDistribution = useMemo(() => {
    const statuses: { [key: string]: number } = {};
    coreData.forEach(item => {
      statuses[item.status] = (statuses[item.status] || 0) + 1;
    });
    const total = coreData.length;
    const colorMap: { [key: string]: string } = { Draft: "orange", Review: "cyan", "Last Call": "yellow", Final: "green", Stagnant: "gray", Withdrawn: "red", Living: "blue" };
    return Object.entries(statuses).map(([status, count]) => ({ category: status, count, percentage: (count / total) * 100, color: colorMap[status] || "gray" }));
  }, [coreData]);
  const uniqueAuthors = useMemo(() => {
    const authors = new Set<string>();
    coreData.forEach(item => item.author.split(",").forEach(author => authors.add(author.trim())));
    return authors.size;
  }, [coreData]);

  const withDiscussions = useMemo(() => {
    return coreData.filter(item => item.discussion && item.discussion.trim() !== "").length;
  }, [coreData]);

  const faqs = [
    {
      question: "What are Core EIPs?",
      answer: "Core EIPs propose changes to the Ethereum protocol itself, including consensus rules, networking protocol, and core blockchain functionality. These are the most critical proposals affecting how Ethereum operates."
    },
    {
      question: "How do Core EIPs get implemented?",
      answer: "Core EIPs require implementation in Ethereum clients and network-wide coordination. They typically go through extensive testing on testnets before mainnet activation via hard forks."
    },
    {
      question: "Who decides which Core EIPs are accepted?",
      answer: "Core EIPs go through rigorous review by core developers and the community. Final acceptance happens through client implementation and network adoption, often coordinated by the Ethereum Foundation and core dev teams."
    },
    {
      question: "What metrics are shown for Core EIPs?",
      answer: "We track total Core proposals, Final implemented standards, contributors, active work (Draft/Review), status distribution, and proposals with community discussions."
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
            <StatusTabNavigation tabs={categories} />
            <FlexBetween mb={8}>
              <Header
                title={`Standard Tracks - Core [ ${coreData.length} ]`}
                subtitle="Core EIPs describe changes to the Ethereum protocol."
                description="These EIPs are essential for protocol upgrades and consensus changes."
              />
            </FlexBetween>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
              <AnalyticsStatCard label="Core EIPs" value={coreData.length} icon={FiCpu} colorScheme="blue" helpText="Protocol proposals" />
              <AnalyticsStatCard label="Final" value={coreData.filter(item => item.status === "Final").length} icon={FiCheckCircle} colorScheme="green" helpText="Implemented" />
              <AnalyticsStatCard label="With Discussions" value={withDiscussions} icon={FiGitPullRequest} colorScheme="cyan" helpText="Community engaged" />
              <AnalyticsStatCard label="Contributors" value={uniqueAuthors} icon={FiUsers} colorScheme="purple" helpText="Authors" />
            </SimpleGrid>
            <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={6} mb={8}>
              <CategoryDistributionChart data={statusDistribution} title="Core EIPs by Status" />
              <StatusInsightsCard title="Core Protocol Insights" insights={[{ label: "Top Status", value: statusDistribution[0]?.category || "N/A", icon: FiFileText, colorScheme: "blue" }, { label: "Draft Proposals", value: coreData.filter(item => item.status === "Draft").length, icon: FiFileText, colorScheme: "orange" }, { label: "Under Review", value: coreData.filter(item => item.status === "Review").length, icon: FiFileText, colorScheme: "cyan" }, { label: "In Progress", value: coreData.filter(item => item.status === "Draft" || item.status === "Review").length, icon: FiFileText, colorScheme: "purple" }]} />
            </Grid>
            <Box mb={6}>
              <FAQSection title="About Core EIPs" faqs={faqs} />
            </Box>
            <Box mb={6}>
              {/* <CloseableAdCard /> */}
            </Box>
            <TableStatus cat="Core" />
            <Box
              as={motion.div}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 } as any}
              mt={8}
              bg={useColorModeValue("white", "gray.800")}
              p={6}
              borderRadius="xl"
              border="1px solid"
              borderColor={useColorModeValue("gray.200", "gray.700")}
              boxShadow="sm"
              sx={{ transition: "all 0.3s" }}
              _hover={{
                boxShadow: "md",
                borderColor: "#30A0E0",
              }}
            >
              <StatusColumnChart category={"Core"} type={"EIPs"} />
            </Box>
          </Box>
        </motion.div>
      )}
    </AllLayout>
  );
};

export default Core;