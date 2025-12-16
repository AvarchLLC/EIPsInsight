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
import { FiFileText, FiLayers, FiUsers, FiCheckCircle, FiAward } from "react-icons/fi";

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

const Final = () => {
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

  const finalData = useMemo(() => data.filter(item => item.status === "Final"), [data]);

  const categoryDistribution = useMemo(() => {
    const categories: { [key: string]: number } = {};
    finalData.forEach(item => {
      categories[item.category] = (categories[item.category] || 0) + 1;
    });
    
    const total = finalData.length;
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
  }, [finalData]);

  const uniqueAuthors = useMemo(() => {
    const authors = new Set<string>();
    finalData.forEach(item => {
      const authorList = item.author.split(",");
      authorList.forEach(author => authors.add(author.trim()));
    });
    return authors.size;
  }, [finalData]);

  const recentFinal = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return finalData.filter(item => {
      const year = new Date(item.created).getFullYear();
      return year === currentYear;
    }).length;
  }, [finalData]);

  const faqs = [
    {
      question: "What does Final status mean?",
      answer: "Final status indicates that an EIP has been accepted and is considered a standard. It represents a completed proposal that has undergone full community review and editor approval."
    },
    {
      question: "Can Final EIPs be changed?",
      answer: "Final EIPs should not have substantive changes. Only minor corrections or clarifications are allowed. Significant changes require a new EIP."
    },
    {
      question: "Are all Final EIPs implemented?",
      answer: "Final status means the specification is complete and accepted, but implementation status varies. Core EIPs typically need network-wide implementation, while ERCs may have varying adoption."
    },
    {
      question: "What metrics are shown for Final EIPs?",
      answer: "We track total final standards, ERC application standards, category distribution, unique contributors, and standards finalized this year."
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
                title={`Final EIPs [ ${finalData.length} ]`}
                subtitle="Final EIPs have been formally accepted and implemented as part of the Ethereum protocol."
                description="These proposals have completed the full review process and are now part of Ethereum standards."
              />
            </FlexBetween>

            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
              <AnalyticsStatCard
                label="Final Standards"
                value={finalData.length}
                icon={FiCheckCircle}
                colorScheme="green"
                helpText="Accepted proposals"
              />
              <AnalyticsStatCard
                label="ERC Standards"
                value={finalData.filter(item => item.category === "ERC").length}
                icon={FiFileText}
                colorScheme="purple"
                helpText="Application standards"
              />
              <AnalyticsStatCard
                label="Finalized This Year"
                value={recentFinal}
                icon={FiAward}
                colorScheme="cyan"
                helpText={`New in ${new Date().getFullYear()}`}
              />
              <AnalyticsStatCard
                label="Contributors"
                value={uniqueAuthors}
                icon={FiUsers}
                colorScheme="blue"
                helpText="Unique authors"
              />
            </SimpleGrid>

            <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={6} mb={8}>
              <CategoryDistributionChart
                data={categoryDistribution}
                title="Final EIPs by Category"
              />
              <StatusInsightsCard
                title="Final Standards Insights"
                insights={[
                  {
                    label: "Top Category",
                    value: categoryDistribution[0]?.category || "N/A",
                    icon: FiLayers,
                    colorScheme: "blue"
                  },
                  {
                    label: "Core Standards",
                    value: finalData.filter(item => item.category === "Core").length,
                    icon: FiFileText,
                    colorScheme: "green"
                  },
                  {
                    label: "Network Standards",
                    value: finalData.filter(item => item.category === "Networking").length,
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
              <FAQSection title="About Final EIPs" faqs={faqs} />
            </Box>
            <Box mb={6}>
              <CloseableAdCard />
            </Box>
            
            <TableStatusByStatus status="Final" />
          </Box>
        </motion.div>
      )}
    </AllLayout>
  );
};

export default Final;
