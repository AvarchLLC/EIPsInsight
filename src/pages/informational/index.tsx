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
import { FiFileText, FiCheckCircle, FiUsers, FiInfo, FiActivity, FiMessageSquare } from "react-icons/fi";

interface EIP {
  _id: string;
  eip: string;
  title: string;
  author: string;
  status: string;
  type: string;
  category: string;
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

const Info = () => {
  const [isLoading, setIsLoading] = useState(true);
  const bg = useColorModeValue("#f6f6f7", "#171923");
  const [data, setData] = useState<EIP[]>([]);
  
  const infoData = useMemo(() => data.filter(item => item.type === "Informational"), [data]);
  const statusDistribution = useMemo(() => {
    const statuses: { [key: string]: number } = {};
    infoData.forEach(item => {
      statuses[item.status] = (statuses[item.status] || 0) + 1;
    });
    const total = infoData.length;
    const colorMap: { [key: string]: string } = { Draft: "orange", Review: "cyan", "Last Call": "yellow", Final: "green", Stagnant: "gray", Withdrawn: "red", Living: "blue" };
    return Object.entries(statuses).map(([status, count]) => ({ category: status, count, percentage: (count / total) * 100, color: colorMap[status] || "gray" }));
  }, [infoData]);
  const uniqueAuthors = useMemo(() => {
    const authors = new Set<string>();
    infoData.forEach(item => item.author.split(",").forEach(author => authors.add(author.trim())));
    return authors.size;
  }, [infoData]);
  
  const livingCount = useMemo(() => infoData.filter(item => item.status === "Living").length, [infoData]);
  const withDiscussion = useMemo(() => infoData.filter(item => item.discussion && item.discussion.trim() !== "").length, [infoData]);
  
  const faqs = [
    {
      question: "What are Informational EIPs?",
      answer: "Informational EIPs provide general guidelines or information to the Ethereum community but do not propose a new feature. They may describe an Ethereum design issue or provide general guidelines or information, but do not propose a new feature."
    },
    {
      question: "How are they different from Standards Track EIPs?",
      answer: "Unlike Standards Track EIPs, Informational EIPs do not require community consensus or describe a new feature implementation. They are purely informative and don't affect the Ethereum protocol directly."
    },
    {
      question: "What does 'Living' status mean?",
      answer: "Living status indicates documents that are continually updated and never reach a Final state. These are maintained over time as best practices or guidelines evolve."
    },
    {
      question: "What metrics are shown on this page?",
      answer: "We track total Informational EIPs, Final (published) documents, Living documents that are actively maintained, documents with community discussions, unique contributors, and documents in Draft/Review stages."
    }
  ]; // Set initial state as an empty array
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/new/all`);
        console.log(response);
        const jsonData = await response.json();
        setData(jsonData.eip);
        setIsLoading(false); // Set loader state to false after data is fetched
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false); // Set loader state to false even if an error occurs
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Simulating a loading delay
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    // Cleanup function
    return () => clearTimeout(timeout);
  }, []);
  return (
    <AllLayout>
      {isLoading ? ( // Check if the data is still loading
        // Show loader if data is loading
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
            {/* Your loader component */}
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
                title={`Informational [ ${infoData.length} ]`}
                subtitle="Informational EIPs describe other changes to the Ethereum ecosystem."
                description="Informational EIPs provide general guidelines or information to the Ethereum community but do not propose a new feature."
              />
            </FlexBetween>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
              <AnalyticsStatCard label="Total Informational" value={infoData.length} icon={FiInfo} colorScheme="pink" helpText="All documents" />
              <AnalyticsStatCard label="Published" value={infoData.filter(item => item.status === "Final").length} icon={FiCheckCircle} colorScheme="green" helpText="Final status" />
              <AnalyticsStatCard label="Living Docs" value={livingCount} icon={FiActivity} colorScheme="blue" helpText="Active guides" />
              <AnalyticsStatCard label="With Discussions" value={withDiscussion} icon={FiMessageSquare} colorScheme="cyan" helpText="Community input" />
            </SimpleGrid>
            <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={6} mb={8}>
              <CategoryDistributionChart data={statusDistribution} title="Informational EIPs by Status" />
              <StatusInsightsCard title="Documentation Insights" insights={[{ label: "Most Common Status", value: statusDistribution[0]?.category || "N/A", icon: FiFileText, colorScheme: "pink" }, { label: "Draft Docs", value: infoData.filter(item => item.status === "Draft").length, icon: FiFileText, colorScheme: "orange" }, { label: "Under Review", value: infoData.filter(item => item.status === "Review").length, icon: FiFileText, colorScheme: "cyan" }, { label: "Contributors", value: uniqueAuthors, icon: FiUsers, colorScheme: "purple" }]} />
            </Grid>
            <Box mb={6}>
              <FAQSection title="About Informational EIPs" faqs={faqs} />
            </Box>
            <Box mb={6}>
              {/* <CloseableAdCard /> */}
            </Box>
            <TableStatus cat="Informational" />
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
              _hover={{
                boxShadow: "md",
                borderColor: "#30A0E0",
              }}
            >
              <StatusColumnChart category={"Informational"} type={"EIPs"} />
            </Box>
          </Box>

        </motion.div>
      )}
    </AllLayout>
  );
};

export default Info;
