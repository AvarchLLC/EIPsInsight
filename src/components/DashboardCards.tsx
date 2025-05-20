"use client";


import {
  Box,
  Grid,
  Text,
  Flex,
  Badge,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  useColorModeValue,
  Icon,
} from "@chakra-ui/react";
import EIPChartWrapper from "./EIPChart";
import { useEffect, useState } from "react";
import Link from "next/link";
import { FaBolt, FaChartBar, FaCodeBranch, FaNetworkWired } from "react-icons/fa";
import CopyLink from "./CopyLink";

// mock.ts
const topStats = [
  {
    label: "Active Proposals",
    value: "127",
    change: "+4.3% from last month",
    changeColor: "green.400",
  },
  {
    label: "Pull Requests",
    value: "53",
    change: "+12.5% from last month",
    changeColor: "green.400",
  },
  {
    label: "Recent Activity",
    value: "289",
    change: "+8.2% from last month",
    changeColor: "green.400",
  },
  {
    label: "Contributors",
    value: "1,204",
    change: "+2.1% from last month",
    changeColor: "green.400",
  },
];

const recentActivity = [
  {
    id: "eip-6551",
    title: "EIP-6551: Non-fungible Token Bound Accounts",
    type: "ERC",
    typeColor: "blue",
    author: "Jayden Windle",
    time: "2 hours ago",
  },
  {
    id: "eip-7625",
    title: "EIP-7625: Path-based NFT metadata resolution",
    type: "ERC",
    typeColor: "blue",
    author: "Levi Feldman",
    time: "5 hours ago",
  },
  {
    id: "eip-4844",
    title: "EIP-4844: Shard Blob Transactions",
    type: "Core",
    typeColor: "red",
    author: "Protolambda",
    time: "1 day ago",
  },
  {
    id: "eip-7503",
    title: "EIP-7503: Empty Account Witness Format",
    type: "Core",
    typeColor: "purple",
    author: "Alex Stokes",
    time: "2 days ago",
  },
];

interface EIP {
  _id: string;
  eip: string;
  title: string;
  author: string;
  status: string;
  type: string;
  category: string;
  created: Date;
  discussion: string;
  deadline: string;
  requires: string;
  repo: string;
  unique_ID: number;
  __v: number;
}

interface APIResponse {
  eip: EIP[];
  erc: EIP[];
  rip: EIP[];
}

// Color variants
const colors = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#6366f1", "#0ea5e9", "#7c3aed"];

// Card component
const StatCard = ({ title, value, icon, color, description, url }: any) => {
  return (
    <Box
      bg={useColorModeValue("white", "gray.800")}
      p={5}
      rounded="2xl"
      shadow="xl"
      borderLeft="8px solid"
      borderColor={color}
      transition="all 0.3s"
      _hover={{ transform: "scale(1.02)", shadow: "2xl" }}
    >
      <Link href={`/${url}`} >
        <Flex align="center" gap={3}>
          {icon && <Icon as={icon} boxSize={5} color={color} />}
          <Text fontSize="sm" color="gray.500">
            {title}
          </Text>
        </Flex>
        <Text fontSize="2xl" fontWeight="bold" mt={2}>
          {value}
        </Text>
        {/* Render description here */}
        {description && (
          <Text fontSize="sm" mt={1} color="gray.500">
            {description}
          </Text>
        )}
      </Link>
    </Box >
  );
};

const DashboardCards = () => {
  const cardBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("text-gray-700", "text-gray-200");
  const bgColor = useColorModeValue("bg-gray-100", "bg-gray-900");
  const subtitleColor = useColorModeValue("text-gray-600", "text-gray-400");

  const [data, setData] = useState<APIResponse>({ eip: [], erc: [], rip: [] });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/new/all");
        const jsonData = await response.json();
        setData(jsonData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const allData: EIP[] = data?.eip?.concat(data?.erc?.concat(data?.rip)) || [];
  const secondaryTextColor = useColorModeValue("gray.500", "gray.400");



  const statsByType = [
    {
      title: "Meta", description: "Meta EIPs describe changes to the EIP process, or other non-optional changes.", url: "meta", value: data?.eip?.filter(
        (item) =>
          item.type === "Standards Track" &&
          item.category === "Core"
      ).length || 0,

    },
    { title: "Core EIPs", description: "Core EIPs describe changes to the Ethereum protocol.", url: "core", value: 64 },
    {
      title: "ERCs", description: "ERCs describe application-level standards for the Ethereum ecosystem.", url: "erc", value: data?.erc?.filter(
        (item) =>
          item.type === "Standards Track" &&
          item.category === "ERC").length || 0
    },
    {
      title: "Networking", description: "Networking EIPs describe changes to the Ethereum network protocol.", url: "networking", value: data?.eip?.filter(
        (item) =>
          item.type === "Standards Track" &&
          item.category === "Networking").length || 0
    },
    {
      title: "Interface EIPs", description: "Interface EIPs describe changes to the Ethereum client API.", url: "interface", value: data?.eip?.filter(
        (item) =>
          item.type === "Standards Track" &&
          item.category === "Interface").length || 0
    },
    {
      title: "Informational EIPs", description: "Informational EIPs describe other changes to the Ethereum ecosystem.", url: "informational", value: data?.eip?.filter(
        (item) =>
          item.type === "Informational" &&
          item.category === "Core").length || 0
    },
    {
      title: "RIPs", description: "RIPs describe changes to the RIP process, or other non-optional changes.", url: "rip", value: data?.rip?.filter(
        (item) =>
          item.type === "Standards Track" &&
          item.category === "RIP").length || 0
    },
  ];

  const statsByStatus = [
    { title: "Living", description: "Living EIPs are continuously updated and reflect evolving standards or documentation.", url: "alltable", value: allData?.filter((item) => item.status === "Living").length },
    { title: "Final", description: "Final EIPs have been formally accepted and implemented as part of the Ethereum protocol.", url: "alltable", value: allData?.filter((item) => item.status === "Draft").length },
    { title: "Draft", description: "Draft EIPs are proposals still under initial consideration and open for feedback.", url: "alltable", value: allData?.filter((item) => item.status === "Draft").length },
    { title: "Review", description: "EIPs in the Review stage are being actively discussed and evaluated by the community.", url: "alltable", value: allData?.filter((item) => item.status === "Review").length },
    { title: "Last Call", description: "Last Call EIPs are nearing finalization, with a short period for final community comments.", url: "alltable", value: allData?.filter((item) => item.status === "Last Call").length },
    { title: "Stagnant", description: "Stagnant EIPs are inactive and have not progressed for a prolonged period.", url: "alltable", value: allData?.filter((item) => item.status === "Stagnant").length },
    { title: "Withdrawn", description: "Withdrawn EIPs have been removed from consideration by the author or due to lack of support.", url: "alltable", value: allData?.filter((item) => item.status === "Withdrawn").length },
  ];
  return (
    <div id='dashboard' className={`min-h-screen p-10 ${bgColor} ${textColor}`} >

      <Box px={{ base: 4, md: 8 }} py={6}>
        {/* Page Heading */}
        <Box mb={6}>
          <Text fontSize="4xl" fontWeight="extrabold">
            Dashboard
            <CopyLink
              link="https://eipsinsight.com//home#Dashboard"
              style={{ marginLeft: "10px", marginBottom: "3px" }}
            />
          </Text>
          <Text fontSize="md" color="gray.500">
            Overview of Ethereum Improvement Proposals activity
          </Text>
        </Box>

        {/* Stats Cards */}
        <Grid templateColumns={{ base: "1fr", md: "repeat(4, 1fr)" }} gap={6} mb={10}>
          {topStats?.map((stat, i) => (
            <Box key={i} bg={cardBg} p={6} borderRadius="xl" boxShadow="md">
              <Stat>
                <StatLabel color="gray.400">{stat.label}</StatLabel>
                <StatNumber fontSize="2xl">{stat.value}</StatNumber>
                <StatHelpText color={stat.changeColor}>{stat.change}</StatHelpText>
              </Stat>
            </Box>
          ))}
        </Grid>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-6">
          {statsByType.slice(0, 4)?.map((stat, idx) => (
            <StatCard
              key={`type-top-${idx}`}
              title={stat.title}
              value={stat.value}
              description={stat.description}
              url={stat.url}
              icon={[FaCodeBranch, FaChartBar, FaBolt, FaNetworkWired][idx % 4]}
              color={colors[idx % colors.length]}
            />
          ))}
        </div>

        {/* Second row - 3 cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-12">
          {statsByType.slice(4)?.map((stat, idx) => (
            <StatCard
              key={`type-bottom-${idx}`}
              title={stat.title}
              value={stat.value}
              description={stat.description}
              url={stat.url}
              icon={[FaCodeBranch, FaChartBar, FaBolt, FaNetworkWired][(idx + 4) % 4]}
              color={colors[(idx + 4) % colors.length]}
            />
          ))}
        </div>


        {/* Proposal Activity & Recent Activity */}
        <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={6}>
          {/* Proposal Activity */}
          <Box bg={cardBg} p={6} borderRadius="2xl" boxShadow="xl">
            <Text fontSize="lg" fontWeight="semibold" mb={4}>
              Proposal Activity
            </Text>
            <Box w="100%" h="350px">
              <EIPChartWrapper type="All" />
            </Box>
          </Box>

          {/* Recent Activity */}
          <Box bg={cardBg} p={6} borderRadius="2xl" boxShadow="xl">
            <Text fontSize="lg" fontWeight="semibold" mb={4}>
              Recent Activity
            </Text>
            <Flex direction="column" gap={4}>
              {recentActivity?.map((item, i) => (
                <Box key={i}>
                  <Text fontWeight="medium" fontSize="sm">
                    {item.id}{" "}
                    <Badge ml={2} colorScheme={item.typeColor}>
                      {item.type}
                    </Badge>
                  </Text>
                  <Text fontSize="sm">{item.title}</Text>
                  <Text fontSize="xs" color="gray.500">
                    By {item.author} • {item.time}
                  </Text>
                </Box>
              ))}
            </Flex>
          </Box>
        </Grid>
        <div className="pt-10">
          {/* First row - 4 StatCards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            {statsByStatus.slice(0, 4)?.map((stat, idx) => (
              <StatCard
                key={`status-top-${idx}`}
                title={stat.title}
                value={stat.value}
                description={stat.description}
                url={stat.url}
                icon={FaChartBar}
                color={colors[(idx + 3) % colors.length]}
              />
            ))}
          </div>

          {/* Second row - up to 3 StatCards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {statsByStatus.slice(4)?.map((stat, idx) => (
              <StatCard
                key={`status-bottom-${idx}`}
                title={stat.title}
                value={stat.value}
                description={stat.description}
                url={stat.url}
                icon={FaChartBar}
                color={colors[(idx + 7) % colors.length]}
              />
            ))}
          </div>
        </div>

      </Box>
    </div>
  );
};

export default DashboardCards;