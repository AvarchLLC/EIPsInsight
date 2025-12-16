// import React from "react";
// import AllLayout from "@/components/Layout";
// import { Box, Button, useColorModeValue } from "@chakra-ui/react";
// import FlexBetween from "@/components/FlexBetween";
// import Header from "@/components/Header";
// import { DownloadIcon } from "@chakra-ui/icons";
// import Table from "@/components/Table";
// import LineChart from "@/components/LineChart";
// import TableStatus from "@/components/TableStatus";
// import LineStatus from "@/components/LineStatus";
// import { useEffect, useState } from "react";
// import { motion } from "framer-motion";
// import LoaderComponent from "@/components/Loader";
// import StatusColumnChart from "@/components/StatusColumnChart";

// import {TabList, Tabs } from "@chakra-ui/react";
// import Link from "next/link";

// const categories = [
//   { name: "Core", path: "/core" },
//   { name: "Networking", path: "/networking" },
//   { name: "Interface", path: "/interface" },
//   { name: "Meta", path: "/meta" },
//   { name: "Informational", path: "/informational" },
//   { name: "ERC", path: "/erc" },
// ];

// interface EIP {
//   _id: string;
//   eip: string;
//   title: string;
//   author: string;
//   status: string;
//   type: string;
//   category: string;
//   created: string;
//   discussion: string;
//   deadline: string;
//   requires: string;
//   unique_ID: number;
//   __v: number;
// }
// const Meta = () => {
//   const [isLoading, setIsLoading] = useState(true);
//   const bg = useColorModeValue("#f6f6f7", "#171923");

//   const [data, setData] = useState<EIP[]>([]); // Set initial state as an empty array
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await fetch(`/api/new/all`);
//         const jsonData = await response.json();
//         setData(jsonData.eip?.concat(jsonData.erc));
//         setIsLoading(false); // Set loader state to false after data is fetched
//       } catch (error) {
//         console.error("Error fetching data:", error);
//         setIsLoading(false); // Set loader state to false even if an error occurs
//       }
//     };

//     fetchData();
//   }, []);

//   useEffect(() => {
//     // Simulating a loading delay
//     const timeout = setTimeout(() => {
//       setIsLoading(false);
//     }, 2000);

//     // Cleanup function
//     return () => clearTimeout(timeout);
//   }, []);
//   return (
//     <AllLayout>
//       {isLoading ? ( // Check if the data is still loading
//         // Show loader if data is loading
//         <Box
//           display="flex"
//           justifyContent="center"
//           alignItems="center"
//           height="100vh"
//         >
//           <motion.div
//             initial={{ opacity: 0, y: -20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5 }}
//           >
//             {/* Your loader component */}
//             <LoaderComponent />
//           </motion.div>
//         </Box>
//       ) : (
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           exit={{ opacity: 0 }}
//           transition={{ duration: 0.5 }}
//         >
//           <Box className="ml-40 mr-40 pl-10 pr-10 mt-10 mb-20">
//           <Tabs isFitted variant="enclosed">
//               <TabList>
//                 {categories?.map((category) => (
//                   <Link key={category.name} href={category.path} passHref>
//                     <Tabs as="a">{category.name}</Tabs>
//                   </Link>
//                 ))}
//               </TabList>
//             </Tabs>
//             <FlexBetween>
//               <Header
//                 title={`Meta - [ ${
//                   data?.filter((item) => item.type === "Meta")?.length
//                 } ]`}
//                 subtitle="Meta EIPs describe changes to the EIP process, or other non optional changes."
//                 description="Meta EIPs are used for process changes, guidelines, or information relevant to the EIP process itself."
//               />
//             </FlexBetween>
//             <Box mt={2}>
//               <p className="text-gray-500 italic">
//                 * EIP-1 is available both on EIP GitHub and ERC GitHub, so the count can be varied by 1.
//               </p>
//             </Box>
//             <TableStatus cat="Meta" />
//             <Box
//                         marginTop={"2rem"}
//                         bg={bg}
//                         p="0.5rem"
//                         borderRadius="0.55rem"
//                         display="flex"
//                         flexDirection="column"
//                         justifyContent="center"
//                         alignItems="center"
//                         height={400}
//                         _hover={{
//                           border: "1px",
//                           borderColor: "#30A0E0",
//                         }}
//                         as={motion.div}
//                         initial={{ opacity: 0, y: -20 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         transition={{ duration: 0.5 } as any}
//                         className="hover: cursor-pointer ease-in duration-200"
//                       ><StatusColumnChart category={"Networking"} type={"EIPs"} /></Box>
//             {/* <LineStatus cat="Meta" /> */}
//           </Box>
//         </motion.div>
//       )}
//     </AllLayout>
//   );
// };

// export default Meta;

import React, { useEffect, useState, useMemo } from "react";
import CloseableAdCard from "@/components/CloseableAdCard";
import AllLayout from "@/components/Layout";
import {
  Box,
  useColorModeValue,
  SimpleGrid,
  Grid
} from "@chakra-ui/react";
import FlexBetween from "@/components/FlexBetween";
import Header from "@/components/Header";
import TableStatus from "@/components/TableStatus";
import StatusColumnChart from "@/components/StatusColumnChart";
import LoaderComponent from "@/components/Loader";
import { motion } from "framer-motion";
import StatusTabNavigation from "@/components/StatusTabNavigation";
import AnalyticsStatCard from "@/components/AnalyticsStatCard";
import CategoryDistributionChart from "@/components/CategoryDistributionChart";
import StatusInsightsCard from "@/components/StatusInsightsCard";
import FAQSection from "@/components/FAQSection";
import { FiFileText, FiCheckCircle, FiUsers, FiSettings, FiGitPullRequest } from "react-icons/fi";

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

const Meta = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<EIP[]>([]);
  const bg = useColorModeValue("#f6f6f7", "#171923");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/new/all`);
        const jsonData = await response.json();
        setData(jsonData.eip?.concat(jsonData.erc));
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const metaData = useMemo(() => data.filter(item => item.type === "Meta"), [data]);
  const statusDistribution = useMemo(() => {
    const statuses: { [key: string]: number } = {};
    metaData.forEach(item => {
      statuses[item.status] = (statuses[item.status] || 0) + 1;
    });
    const total = metaData.length;
    const colorMap: { [key: string]: string } = { Draft: "orange", Review: "cyan", "Last Call": "yellow", Final: "green", Stagnant: "gray", Withdrawn: "red", Living: "blue" };
    return Object.entries(statuses).map(([status, count]) => ({ category: status, count, percentage: (count / total) * 100, color: colorMap[status] || "gray" }));
  }, [metaData]);
  const uniqueAuthors = useMemo(() => {
    const authors = new Set<string>();
    metaData.forEach(item => item.author.split(",").forEach(author => authors.add(author.trim())));
    return authors.size;
  }, [metaData]);

  const withDiscussions = useMemo(() => {
    return metaData.filter(item => item.discussion && item.discussion.trim() !== "").length;
  }, [metaData]);

  const faqs = [
    {
      question: "What are Meta EIPs?",
      answer: "Meta EIPs describe changes to the EIP process itself, including guidelines, procedures, or information about how the EIP system works. They don't propose changes to Ethereum protocol or applications."
    },
    {
      question: "How are Meta EIPs different from other EIPs?",
      answer: "Meta EIPs are about the process, not the product. They govern how proposals are submitted, reviewed, and approved, rather than proposing technical changes to Ethereum."
    },
    {
      question: "Who should read Meta EIPs?",
      answer: "Anyone interested in contributing to Ethereum through the EIP process should read Meta EIPs. They explain the rules, best practices, and procedures for creating and advancing proposals."
    },
    {
      question: "What metrics are shown for Meta EIPs?",
      answer: "We track total Meta process documents, Final approved guidelines, Living evolving documents, contributors, status distribution, and proposals with active discussions."
    }
  ];

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
                title={`Meta [ ${metaData.length} ]`}
                subtitle="Meta EIPs describe changes to the EIP process, or other non-optional changes."
                description="Meta EIPs are used for process changes, guidelines, or information relevant to the EIP process itself."
              />
            </FlexBetween>
            <Box mt={2} mb={6}>
              <p className="text-gray-500 italic">
                * EIP-1 is available both on EIP GitHub and ERC GitHub, so the count can vary by 1.
              </p>
            </Box>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
              <AnalyticsStatCard label="Meta EIPs" value={metaData.length} icon={FiSettings} colorScheme="cyan" helpText="Process docs" />
              <AnalyticsStatCard label="Final" value={metaData.filter(item => item.status === "Final").length} icon={FiCheckCircle} colorScheme="green" helpText="Approved" />
              <AnalyticsStatCard label="Living" value={metaData.filter(item => item.status === "Living").length} icon={FiFileText} colorScheme="teal" helpText="Evolving docs" />
              <AnalyticsStatCard label="With Discussions" value={withDiscussions} icon={FiGitPullRequest} colorScheme="purple" helpText="Active input" />
            </SimpleGrid>
            <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={6} mb={8}>
              <CategoryDistributionChart data={statusDistribution} title="Meta EIPs by Status" />
              <StatusInsightsCard title="Process Standards Insights" insights={[{ label: "Top Status", value: statusDistribution[0]?.category || "N/A", icon: FiFileText, colorScheme: "cyan" }, { label: "Draft Meta", value: metaData.filter(item => item.status === "Draft").length, icon: FiFileText, colorScheme: "orange" }, { label: "Under Review", value: metaData.filter(item => item.status === "Review").length, icon: FiFileText, colorScheme: "blue" }, { label: "Contributors", value: uniqueAuthors, icon: FiUsers, colorScheme: "purple" }]} />
            </Grid>
            <Box mb={6}>
              <FAQSection title="About Meta EIPs" faqs={faqs} />
            </Box>
            <Box mb={6}>
              <CloseableAdCard />
            </Box>
            <TableStatus cat="Meta" />
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
              transition="all 0.3s"
            >
              <StatusColumnChart category={"Meta"} type={"EIPs"} />
            </Box>
          </Box>
        </motion.div>
      )}
    </AllLayout>
  );
};

export default Meta;
