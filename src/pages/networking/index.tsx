import React, { useEffect, useState, useMemo } from "react";
import CloseableAdCard from "@/components/CloseableAdCard";
import AllLayout from "@/components/Layout";
import { Box, useColorModeValue, SimpleGrid, Grid } from "@chakra-ui/react";
import FlexBetween from "@/components/FlexBetween";
import Header from "@/components/Header";
import TableStatus from "@/components/TableStatus";
import { motion } from "framer-motion";
import LoaderComponent from "@/components/Loader";
import StatusColumnChart from "@/components/StatusColumnChart";
import StatusTabNavigation from "@/components/StatusTabNavigation";
import AnalyticsStatCard from "@/components/AnalyticsStatCard";
import CategoryDistributionChart from "@/components/CategoryDistributionChart";
import StatusInsightsCard from "@/components/StatusInsightsCard";
import FAQSection from "@/components/FAQSection";
import { FiFileText, FiCheckCircle, FiUsers, FiWifi, FiGitPullRequest } from "react-icons/fi";
import { DownloadIcon } from "@chakra-ui/icons";
import Table from "@/components/Table";
import LineChart from "@/components/LineChart";
import LineStatus from "@/components/LineStatus";
import AreaStatus from "@/components/AreaStatus";
import Link from "next/link";

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

const Networking = () => {
  const [isLoading, setIsLoading] = useState(true);
  const bg = useColorModeValue("#f6f6f7", "#171923");
  const [data, setData] = useState<EIP[]>([]);
  
  const networkingData = useMemo(() => data.filter(item => item.category === "Networking"), [data]);
  const statusDistribution = useMemo(() => {
    const statuses: { [key: string]: number } = {};
    networkingData.forEach(item => {
      statuses[item.status] = (statuses[item.status] || 0) + 1;
    });
    const total = networkingData.length;
    const colorMap: { [key: string]: string } = { Draft: "orange", Review: "cyan", "Last Call": "yellow", Final: "green", Stagnant: "gray", Withdrawn: "red", Living: "blue" };
    return Object.entries(statuses).map(([status, count]) => ({ category: status, count, percentage: (count / total) * 100, color: colorMap[status] || "gray" }));
  }, [networkingData]);
  const uniqueAuthors = useMemo(() => {
    const authors = new Set<string>();
    networkingData.forEach(item => item.author.split(",").forEach(author => authors.add(author.trim())));
    return authors.size;
  }, [networkingData]);

  const withDiscussions = useMemo(() => {
    return networkingData.filter(item => item.discussion && item.discussion.trim() !== "").length;
  }, [networkingData]);

  const faqs = [
    {
      question: "What are Networking EIPs?",
      answer: "Networking EIPs propose changes to the Ethereum network protocol, including peer-to-peer communication, node discovery, data propagation, and other networking layer improvements."
    },
    {
      question: "How do Networking EIPs differ from Core EIPs?",
      answer: "While Core EIPs change consensus rules and blockchain functionality, Networking EIPs focus on how nodes communicate with each other. Networking changes can often be implemented without hard forks."
    },
    {
      question: "Why are Networking EIPs important?",
      answer: "Networking improvements can enhance performance, security, and scalability of the Ethereum network without changing core protocol rules. They're crucial for network health and efficiency."
    },
    {
      question: "What metrics are shown for Networking EIPs?",
      answer: "We track total networking proposals, Final implemented standards, contributors, active development (Draft/Review), status distribution, and community engagement through discussions."
    }
  ];

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

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <AllLayout>
      {isLoading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100vh"
        >
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <LoaderComponent />
          </motion.div>
        </Box>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box px={{ base: 4, md: 8, lg: 16 }} py={{ base: 4, lg: 8 }} maxW="1600px" mx="auto">
            <StatusTabNavigation tabs={categories} />
            <FlexBetween mb={8}>
              <Header
                title={`Standard Tracks - Networking [ ${networkingData.length} ]`}
                subtitle="Networking EIPs describe changes to the Ethereum network protocol."
                description="This section lists all Networking EIPs, which propose changes to the Ethereum network protocol."
              />
            </FlexBetween>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
              <AnalyticsStatCard label="Networking EIPs" value={networkingData.length} icon={FiWifi} colorScheme="green" helpText="Network proposals" />
              <AnalyticsStatCard label="Final" value={networkingData.filter(item => item.status === "Final").length} icon={FiCheckCircle} colorScheme="teal" helpText="Implemented" />
              <AnalyticsStatCard label="With Discussions" value={withDiscussions} icon={FiGitPullRequest} colorScheme="cyan" helpText="Community input" />
              <AnalyticsStatCard label="Authors" value={uniqueAuthors} icon={FiUsers} colorScheme="purple" helpText="Contributors" />
            </SimpleGrid>
            <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={6} mb={8}>
              <CategoryDistributionChart data={statusDistribution} title="Networking EIPs by Status" />
              <StatusInsightsCard title="Network Protocol Insights" insights={[{ label: "Top Status", value: statusDistribution[0]?.category || "N/A", icon: FiFileText, colorScheme: "green" }, { label: "Draft Proposals", value: networkingData.filter(item => item.status === "Draft").length, icon: FiFileText, colorScheme: "orange" }, { label: "Under Review", value: networkingData.filter(item => item.status === "Review").length, icon: FiFileText, colorScheme: "cyan" }, { label: "Active", value: networkingData.filter(item => item.status === "Draft" || item.status === "Review").length, icon: FiFileText, colorScheme: "purple" }]} />
            </Grid>
            <Box mb={6}>
              <FAQSection title="About Networking EIPs" faqs={faqs} />
            </Box>
            <Box mb={6}>
              <CloseableAdCard />
            </Box>
            <TableStatus cat="Networking" />
            <Box
              as={motion.div}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              mt={8}
              bg={useColorModeValue("white", "gray.800")}
              p={6}
              borderRadius="xl"
              border="1px solid"
              borderColor={useColorModeValue("gray.200", "gray.700")}
              boxShadow="sm"
              _hover={{
                boxShadow: "md",
                borderColor: "#30A0E0",
              }}
                            sx={{ transition: "all 0.3s" }}
            >
              <StatusColumnChart category={"Networking"} type={"EIPs"} />
            </Box>
          </Box>
        </motion.div>
      )}
    </AllLayout>
  );
};

export default Networking;