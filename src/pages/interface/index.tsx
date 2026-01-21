import React, { useEffect, useState, useMemo } from "react";
import CloseableAdCard from "@/components/CloseableAdCard";
import AllLayout from "@/components/Layout";
import { Box, useColorModeValue, SimpleGrid, Grid } from "@chakra-ui/react";
import FlexBetween from "@/components/FlexBetween";
import Header from "@/components/Header";
import TableStatus from "@/components/TableStatus";
import { motion } from "framer-motion";
import LoaderComponent from "@/components/Loader";
import StatusTabNavigation from "@/components/StatusTabNavigation";
import AnalyticsStatCard from "@/components/AnalyticsStatCard";
import CategoryDistributionChart from "@/components/CategoryDistributionChart";
import StatusInsightsCard from "@/components/StatusInsightsCard";
import FAQSection from "@/components/FAQSection";
import { FiFileText, FiCheckCircle, FiUsers, FiLink, FiGitPullRequest } from "react-icons/fi";

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

const Interface = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<EIP[]>([]);
  const bg = useColorModeValue("#f6f6f7", "#171923");

  const interfaceData = useMemo(() => data.filter((item) => item.category === "Interface"), [data]);
  const statusDistribution = useMemo(() => {
    const statuses: { [key: string]: number } = {};
    interfaceData.forEach((item) => {
      statuses[item.status] = (statuses[item.status] || 0) + 1;
    });
    const total = interfaceData.length;
    const colorMap: { [key: string]: string } = {
      Draft: "orange",
      Review: "cyan",
      "Last Call": "yellow",
      Final: "green",
      Stagnant: "gray",
      Withdrawn: "red",
      Living: "blue",
    };
    return Object.entries(statuses).map(([status, count]) => ({
      category: status,
      count,
      percentage: (count / total) * 100,
      color: colorMap[status] || "gray",
    }));
  }, [interfaceData]);
  const uniqueAuthors = useMemo(() => {
    const authors = new Set<string>();
    interfaceData.forEach((item) =>
      item.author.split(",").forEach((author) => authors.add(author.trim()))
    );
    return authors.size;
  }, [interfaceData]);

  const withDiscussions = useMemo(() => {
    return interfaceData.filter(item => item.discussion && item.discussion.trim() !== "").length;
  }, [interfaceData]);

  const faqs = [
    {
      question: "What are Interface EIPs?",
      answer: "Interface EIPs specify standards for client APIs and how Ethereum clients interact with external components. They define JSON-RPC methods, web3 APIs, and other client interface specifications."
    },
    {
      question: "How do Interface EIPs affect developers?",
      answer: "Interface EIPs directly impact how developers build applications on Ethereum. They standardize APIs that wallets, dApps, and tools use to interact with Ethereum nodes."
    },
    {
      question: "Do Interface EIPs require hard forks?",
      answer: "No. Interface EIPs only change how clients expose functionality, not the protocol itself. Clients can implement these independently without network-wide coordination."
    },
    {
      question: "What metrics are shown for Interface EIPs?",
      answer: "We track total Interface proposals, Final API standards, contributors, active development work, status distribution, and proposals with community discussions."
    }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/new/all`);
        console.log(response);
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
                title={`Standard Tracks - Interface [ ${interfaceData.length} ]`}
                subtitle="Interface EIPs describe changes to the Ethereum client API."
                description="Interface EIPs specify standards for client APIs and how Ethereum clients interact with external components."
              />
            </FlexBetween>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
              <AnalyticsStatCard
                label="Interface EIPs"
                value={interfaceData.length}
                icon={FiLink}
                colorScheme="orange"
                helpText="API standards"
              />
              <AnalyticsStatCard
                label="Final"
                value={interfaceData.filter((item) => item.status === "Final").length}
                icon={FiCheckCircle}
                colorScheme="green"
                helpText="Implemented"
              />
              <AnalyticsStatCard
                label="With Discussions"
                value={withDiscussions}
                icon={FiGitPullRequest}
                colorScheme="cyan"
                helpText="Community input"
              />
              <AnalyticsStatCard
                label="Authors"
                value={uniqueAuthors}
                icon={FiUsers}
                colorScheme="purple"
                helpText="Contributors"
              />
            </SimpleGrid>
            <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={6} mb={8}>
              <CategoryDistributionChart
                data={statusDistribution}
                title="Interface EIPs by Status"
              />
              <StatusInsightsCard
                title="API Standards Insights"
                insights={[
                  {
                    label: "Top Status",
                    value: statusDistribution[0]?.category || "N/A",
                    icon: FiFileText,
                    colorScheme: "orange",
                  },
                  {
                    label: "Draft APIs",
                    value: interfaceData.filter((item) => item.status === "Draft").length,
                    icon: FiFileText,
                    colorScheme: "orange",
                  },
                  {
                    label: "Under Review",
                    value: interfaceData.filter((item) => item.status === "Review").length,
                    icon: FiFileText,
                    colorScheme: "cyan",
                  },
                  {
                    label: "Active",
                    value: interfaceData.filter((item) => item.status === "Draft" || item.status === "Review").length,
                    icon: FiFileText,
                    colorScheme: "purple",
                  },
                ]}
              />
            </Grid>
            <Box mb={6}>
              <FAQSection title="About Interface EIPs" faqs={faqs} />
            </Box>
            <Box mb={6}>
              {/* <CloseableAdCard /> */}
            </Box>
            <TableStatus cat="Interface" />
          </Box>
        </motion.div>
      )}
    </AllLayout>
  );
};

export default Interface;