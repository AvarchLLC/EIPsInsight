import { motion } from "framer-motion";
import {
  Box,
  Button,
  Heading,
  Icon,
  Text,
  useColorModeValue,
  useMediaQuery,
  useTheme,
  Link as LI,
  Stack,
  useToast,
  Flex
} from "@chakra-ui/react";
// import React, { useEffect, useState } from "react";
import React, { useEffect, useState, useLayoutEffect } from "react";
import Header from "@/components/Header";
import { DownloadIcon } from "@chakra-ui/icons";
import DashboardDonut2 from "@/components/DashboardDonut2";
import DashboardDonut from "@/components/DashboardDonut";
// import { useRouter } from "next/router";
import {
  Anchor,
  BookOpen,
  Radio,
  Link,
  Clipboard,
  Briefcase
} from "react-feather";
import { BsArrowUpRight, BsGraphUp } from "react-icons/bs";
import StackedColumnChart from "@/components/StackedBarChart";
import AreaC from "@/components/AreaC";
import NextLink from "next/link";
// import { useRouter } from "next/navigation";
import { useRouter } from "next/router";
import { mockEIP } from "@/data/eipdata";
import { usePathname } from "next/navigation";
import FlexBetween from "./FlexBetween";
import StatBox from "./StatBox";
import LoaderComponent from "./Loader";
import Table from "./Table";
import Banner from "@/components/NewsBanner";
import SearchBox from "@/components/SearchBox";
import BoyGirl from "@/components/BoyGirl";
import BoyGirl2 from "@/components/BoyGirl2";
import BoyGirl3 from "@/components/BoyGirl3";
import AllChart from "./AllChart2";
import EIPS_dashboard_img from "../../public/EIPS_dashboard_img.png";
import ToolsSection from "./AvailableTools";
import TypeGraphs from "@/components/TypeGraphs2";
import CopyLink from "./CopyLink";
import TrendingEips from "./TrendingEips";
import {
  FiMenu,
  FiHome,
  FiSettings,
  FiBarChart2,
  FiTool,
  FiInfo,
  FiDatabase,
  FiHeart,
} from "react-icons/fi";

import { useSidebar } from "@/components/Sidebar/SideBarContext";

import DashboardCards from "./DashboardCards";
import FeedbackWidget from "./FeedbackWidget";
import { Clients } from "./Clients";
import { useScrollSpy } from "@/hooks/useScrollSpy";
import TwitterTimeline from "./TwitterTimeline";
import CloseableAdCard from "./CloseableAdCard";
import FAQ from "./FAQ";
import FusakaCountdownBadge from "./FusakaCountdownBadge";
import SupportedBy from "./SupportedBy";
import WhatIsEIPsInsightDropdown from "./WhatIsEIPsInsightDropdown";


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

const Dashboard = () => {
  const { setSections } = useSidebar();
  const [data, setData] = useState<APIResponse>({
    eip: [],
    erc: [],
    rip: [],
  });

  const [isLoading, setIsLoading] = useState(true); // Loader state
  const [isDarkMode, setIsDarkMode] = useState(false);

  const textColorLight = "#2C3E50"; // Darker color for better visibility in light mode
  const textColorDark = "#F5F5F5"; // Light color for dark mode
  const bgGradientLight = "linear(to-r, #2980B9, #3498DB)"; // Clear gradient for better visibility in light mode
  const bgGradientDark = "linear(to-r, #30A0E0, #F5F5F5)";
  const toast = useToast();
  // useEffect(() => {
  //   setSections([
  //     { label: 'All EIPs', icon: FiHome, id: 'all' },
  //     { label: 'Our Tools', icon: FiTool, id: 'ourtools' },
  //     { label: 'What is EIPs Insights?', icon: FiInfo, id: 'what' },
  //     { label: 'EIP Status Changes by Year', icon: FiBarChart2, id: 'statuschanges' },
  //     { label: 'Dashboard', icon: FiDatabase, id: 'dashboard' },
  //   ]);
  // }, []);

  const scrollToFeedbackSection = () => {
    const element = document.getElementById("feedback");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/new/all`);
        console.log(response);
        const jsonData = await response.json();
        setData(jsonData);
        setIsLoading(false); // Set loader state to false after data is fetched
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false); // Set loader state to false even if an error occurs
      }
    };

    fetchData();
  }, []);
  const allData: EIP[] = data?.eip?.concat(data?.erc?.concat(data?.rip)) || [];
  const uniqueStatuses = [...new Set(allData.map((item) => item.status))];
  console.log(uniqueStatuses);
  const uniqueeip = allData.filter((item) => item.status === "");
  console.log("unique eip1:", uniqueeip);
  const uniqueeip2 = allData.filter((item) => item.status === " ");
  console.log("unique eip2:", uniqueeip2);
  // Unique EIP count (deduplicated by EIP identifier) to keep dashboard totals consistent
  const uniqueEipCount = new Set(allData.map((item) => item.eip)).size;
const textColor = useColorModeValue("gray.800", "gray.200");
const linkColor = useColorModeValue("blue.600", "blue.300");

  const theme = useTheme();
  const isNonMediumScreens = useMediaQuery("(min-width: 1200px)");
  const bg = useColorModeValue("#f6f6f7", "#171923");
  const text = useColorModeValue("white", "black");
  const router = useRouter();
  useEffect(() => {
    if (bg === "#f6f6f7") {
      setIsDarkMode(false);
    } else {
      setIsDarkMode(true);
    }
  });

  const monthName = new Date().toLocaleString([], {
    month: "long",
  });
  const year = new Date().getFullYear();

  // const router = useRouter();

  const scrollToHash = () => {
    const hash = window.location.hash;
    if (hash) {
      const element = document.getElementById(hash.slice(1));
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  useEffect(() => {
    if (!isLoading) {
      scrollToHash();
    }
  }, [isLoading]);

  useLayoutEffect(() => {
    router.events.on("routeChangeComplete", scrollToHash);
    return () => {
      router.events.off("routeChangeComplete", scrollToHash);
    };
  }, [router]);

  //  const [showThumbs, setShowThumbs] = useState(false);

  const submitFeedback = async (type: "like" | "dislike") => {
    try {
      const res = await fetch("/api/Feedback/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type }),
      });

      if (!res.headers.get("content-type")?.includes("application/json")) {
        throw new Error("Unexpected response format");
      }

      const data = await res.json();

      if (res.ok) {
        toast({
          title: "Thanks for your feedback!",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        throw new Error(data.message || "Something went wrong");
      }
    } catch (err: any) {
      toast({
        title: "Error submitting feedback",
        description: err?.message || "Unknown error",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  useScrollSpy([
    "all",
    "ourtools",
    "trending",
    "what-is-eipsinsight",
    "statuschanges",
    "dashboard",
    "latest-updates",
  ]);


  useEffect(() => {
    if (window.location.hash) {
      const id = window.location.hash.replace("#", "");
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 300); // delay ensures DOM is ready
    }
  }, []);

  return (
    <>
      <FeedbackWidget />
      
  <Box px={{ base: 2, md: 4, lg: 6 }} py={{ base: 2, md: 3, lg: 4 }}>
    {isLoading ? (
      <Flex justify="center" align="center" minH="70vh">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <LoaderComponent />
        </motion.div>
      </Flex>
    ) : (
          // Show dashboard content if data is loaded
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Box
                id={"hero"}
                pt={{ base: 3, lg: 4 }} 
                pb={{ base: 4, lg: 6 }}
                bg={useColorModeValue("white", "gray.800")}
                borderRadius="xl"
                boxShadow="sm"
                border="1px solid"
                borderColor={useColorModeValue("gray.200", "gray.700")}
                mb={4}
                px={4}
              >
                <div className="lg:block hidden">
                  {/* Enhanced Hero Section with Background */}
                  <Box
                    className="relative overflow-hidden"
                    bgGradient={useColorModeValue(
                      "linear(135deg, rgba(79, 209, 197, 0.1) 0%, rgba(48, 160, 224, 0.05) 50%, rgba(66, 153, 225, 0.1) 100%)",
                      "linear(135deg, rgba(26, 32, 44, 0.8) 0%, rgba(45, 55, 72, 0.6) 50%, rgba(26, 32, 44, 0.9) 100%)"
                    )}
                    borderRadius="2xl"
                    p={{ base: 6, lg: 8 }}
                    border="1px solid"
                    borderColor={useColorModeValue("rgba(79, 209, 197, 0.2)", "rgba(79, 209, 197, 0.1)")}
                    boxShadow={useColorModeValue(
                      "0 20px 40px -12px rgba(79, 209, 197, 0.15)",
                      "0 20px 40px -12px rgba(0, 0, 0, 0.3)"
                    )}
                    _hover={{
                      transform: "translateY(-2px)",
                      boxShadow: useColorModeValue(
                        "0 25px 50px -12px rgba(79, 209, 197, 0.25)",
                        "0 25px 50px -12px rgba(0, 0, 0, 0.4)"
                      ),
                    }}
                    transition="all 0.3s ease"
                  >
                    {/* Decorative Background Elements */}
                    <Box
                      position="absolute"
                      top="10px"
                      right="10px"
                      width="100px"
                      height="100px"
                      borderRadius="full"
                      bg={useColorModeValue("rgba(79, 209, 197, 0.05)", "rgba(79, 209, 197, 0.03)")}
                      filter="blur(20px)"
                      pointerEvents="none"
                    />
                    <Box
                      position="absolute"
                      bottom="20px"
                      left="20px"
                      width="60px"
                      height="60px"
                      borderRadius="full"
                      bg={useColorModeValue("rgba(48, 160, 224, 0.08)", "rgba(48, 160, 224, 0.05)")}
                      filter="blur(15px)"
                      pointerEvents="none"
                    />

                    <Box
                      display={{ lg: "grid" }}
                      gridTemplateColumns={{ lg: "1.5fr 1fr" }}
                      gap={{ lg: 8 }}
                      alignItems="center"
                      position="relative"
                      zIndex={1}
                    >
                      <Stack direction={"column"} spacing={4}>
                        <Text
                            as={motion.div}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 } as any}
                            fontWeight={"extrabold"}
                            bgGradient={useColorModeValue(
                              "linear(to-r, #2D7B7B, #319795, #4FD1C5, #30A0E0)",
                              "linear(to-r, #4FD1C5, #81E6D9, #38B2AC, #4299E1)"
                            )}
                            bgClip="text"
                            sx={{ WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
                            fontSize={{
                              lg: "6xl",
                              md: "5xl",
                              sm: "4xl",
                              base: "2xl",
                            }}
                            lineHeight="1.1"
                            mb={4}
                            letterSpacing="-0.02em"
                          >
                            Ethereum <br /> Improvement <br /> Proposal <br /> Insight
                          </Text>
                          
                          {/* Enhanced Description */}
                          <Text
                            as={motion.div}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 } as any}
                            color={useColorModeValue("gray.700", "gray.200")}
                            fontSize={{ lg: "xl", md: "lg", base: "md" }}
                            lineHeight="1.6"
                            maxWidth="500px"
                            fontWeight="medium"
                          >
                            Track proposal progress, explore EIP insights, and stay updated with the latest{" "}
                            <Text as="span" color={useColorModeValue("#30A0E0", "#4FD1C5")} fontWeight="semibold">
                              Ethereum improvements
                            </Text>
                            .
                          </Text>

                        {/* Enhanced Button Row */}
                        <Box 
                          as={motion.div}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.8, delay: 0.6 } as any}
                          id="button-row-container" 
                          maxWidth="700px"
                        >
                          <Stack direction={"row"} spacing={"4"} flexWrap="nowrap" alignItems="center" mb={3}>
                          <Box
                            as={motion.div}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ type: "spring", stiffness: 400, damping: 17 } as any}
                          >
                            <NextLink href={"/home#1"}>
                              <Button
                                color="#F5F5F5"
                                variant={"outline"}
                                fontSize={{
                                  lg: "14px",
                                  md: "12px",
                                  sm: "12px",
                                  base: "10px",
                                }}
                                fontWeight={"bold"}
                                padding={{
                                  lg: "10px 20px",
                                  md: "5px 10px",
                                  sm: "5px 10px",
                                  base: "5px 10px",
                                }}
                                rightIcon={<BsArrowUpRight />}
                                bgGradient="linear(to-r, #30A0E0, #4299E1)"
                                _hover={{
                                  bgGradient: "linear(to-r, #2B6CB0, #3182CE)",
                                  transform: "translateY(-1px)",
                                  boxShadow: "0 8px 25px -8px rgba(48, 160, 224, 0.5)",
                                }}
                                boxShadow="0 4px 12px -4px rgba(48, 160, 224, 0.3)"
                                borderRadius="lg"
                                transition="all 0.2s ease"
                              >
                                Dashboard
                              </Button>
                            </NextLink>
                          </Box>

                          <Box
                            as={motion.div}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ type: "spring", stiffness: 400, damping: 17 } as any}
                          >
                            <NextLink
                              href={`/insight/${year}/${getMonth(monthName)}`}
                            >
                              <Button
                                color="#F5F5F5"
                                variant={"outline"}
                                fontSize={{
                                  lg: "14px",
                                  md: "10px",
                                  sm: "12px",
                                  base: "10px",
                                }}
                                fontWeight={"bold"}
                                padding={{
                                  lg: "10px 20px",
                                  md: "5px 10px",
                                  sm: "5px 10px",
                                  base: "5px 10px",
                                }}
                                rightIcon={<BsGraphUp />}
                                bgGradient="linear(to-r, #30A0E0, #4299E1)"
                                _hover={{
                                  bgGradient: "linear(to-r, #2B6CB0, #3182CE)",
                                  transform: "translateY(-1px)",
                                  boxShadow: "0 8px 25px -8px rgba(48, 160, 224, 0.5)",
                                }}
                                boxShadow="0 4px 12px -4px rgba(48, 160, 224, 0.3)"
                                borderRadius="lg"
                                transition="all 0.2s ease"
                              >
                                {monthName} {year} Insight
                              </Button>
                            </NextLink>
                          </Box>

                          <Box
                            as={motion.div}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ type: "spring", stiffness: 400, damping: 17 } as any}
                          >
                            <NextLink href={"/all"}>
                              <Button
                                color="#F5F5F5"
                                variant={"outline"}
                                fontSize={{
                                  lg: "14px",
                                  md: "12px",
                                  sm: "12px",
                                  base: "10px",
                                }}
                                fontWeight={"bold"}
                                padding={{
                                  lg: "10px 20px",
                                  md: "5px 10px",
                                  sm: "5px 10px",
                                  base: "5px 10px",
                                }}
                                rightIcon={ <BookOpen/> }
                                bgGradient="linear(to-r, #30A0E0, #4299E1)"
                                _hover={{
                                  bgGradient: "linear(to-r, #2B6CB0, #3182CE)",
                                  transform: "translateY(-1px)",
                                  boxShadow: "0 8px 25px -8px rgba(48, 160, 224, 0.5)",
                                }}
                                boxShadow="0 4px 12px -4px rgba(48, 160, 224, 0.3)"
                                borderRadius="lg"
                                transition="all 0.2s ease"
                              >
                                Explore EIPs
                              </Button>
                            </NextLink>
                          </Box>

                          {/* Fusaka Countdown Badge - Enhanced */}
                          {/* <Box
                            as={motion.div}
                            whileHover={{ scale: 1.02 }}
                            transition={{ type: "spring", stiffness: 400, damping: 17 } as any}
                          >
                            <FusakaCountdownBadge variant="compact" />
                          </Box> */}
                        </Stack>

                        {/* Enhanced Dropdown */}
                        <Box 
                          as={motion.div}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.8, delay: 0.8 } as any}
                          maxWidth="700px"
                        >
                          <WhatIsEIPsInsightDropdown />
                        </Box>
                      </Box>
                    </Stack>
                    
                    {/* Right column - centered image */}
                    <Box display="flex" justifyContent="center" alignItems="center">
                      <Box
                        position="relative"
                        _hover={{ transform: "scale(1.02)" }}
                        transition="transform 0.3s ease"
                      >
                        <BoyGirl3 />
                      </Box>
                    </Box>
                    </Box>
                  </Box>
                  


                  <Box
                    borderRadius="md"
                    id="all"
                    mt={{ base: 2, lg: 3 }}
                  >
                    <div className="py-2">
                      {/* Header with Ad in clean horizontal line */}
                      <Flex
                        align="center"
                        justify="space-between"
                        flexWrap="wrap"
                        gap={4}
                        mb={4}
                        w="100%"
                        px={{ base: 4, md: 6, lg: 8 }}
                      >
                        {/* Header content - takes 50-60% width */}
                        <Box 
                          flex={{ base: "1 1 100%", lg: "1 1 50%" }}
                          minW={{ base: "100%", lg: "300px" }}
                          maxW={{ base: "100%", lg: "60%" }}
                        >
                          <Header
                            title="All Categories and Status"
                            subtitle="Overview"
                            description="A high-level overview of Ethereum Standards by categories, and status."
                            sectionId="all"
                          />
                        </Box>
                        
                        {/* Advertisement card - takes 40-50% width */}
                        <Box
                          flex={{ base: "1 1 100%", lg: "1 1 40%" }}
                          w={{ base: "100%", lg: "auto" }}
                          maxW={{ base: "100%", lg: "45%" }}
                          minW={{ base: "100%", lg: "280px" }}
                        >
                          {/* <CloseableAdCard /> */}
                        </Box>
                      </Flex>
                      
                      <AllChart type="Total" dataset={data} />
                    </div>
                  </Box>
                </div>

                {/* <AllChart type="Total" /> */}

                <div className="lg:hidden block">
                  <Text
                    className="text-5xl text-center pb-2 sm:text-6xl md:text-7xl"
                    fontWeight={"bold"}
                    color={useColorModeValue(textColorLight, textColorDark)}
                    bgGradient={useColorModeValue(
                      bgGradientLight,
                      bgGradientDark
                    )}
                    bgClip="text"
                  >
                    Ethereum <br /> Improvement <br /> Proposals <br /> Insight
                  </Text>
                  <Stack
                    direction={"row"}
                    spacing={"3"}
                    paddingTop={"10"}
                    justifyContent={"center"}
                    flexWrap="wrap"
                  >
                    <Box>
                      <NextLink href={"/home#1"}>
                        <Button
                          colorScheme="white"
                          variant={"outline"}
                          fontSize={{
                            lg: "14px",
                            md: "12px",
                            sm: "12px",
                            base: "10px",
                          }}
                          fontWeight={"bold"}
                          padding={{
                            lg: "10px 20px",
                            md: "5px 10px",
                            sm: "5px 10px",
                            base: "5px 10px",
                          }}
                          rightIcon={<BsArrowUpRight />}
                          bgColor={"#30A0E0"}
                          _hover={{
                            bgColor: useColorModeValue("#2B6CB0", "#4A5568"),
                            color: useColorModeValue("white", "#F5F5F5"),
                          }}
                        >
                          Dashboard
                        </Button>
                      </NextLink>
                    </Box>

                    <Box>
                      <NextLink
                        href={`/all`}
                      >
                        <Button
                          colorScheme="blue"
                          variant={"outline"}
                          fontSize={{
                            lg: "14px",
                            md: "12px",
                            sm: "12px",
                            base: "10px",
                          }}
                          fontWeight={"bold"}
                          padding={{
                            lg: "10px 20px",
                            md: "5px 10px",
                            sm: "5px 10px",
                            base: "5px 10px",
                          }}
                          _hover={{
                            bgColor: useColorModeValue("#2B6CB0", "#4A5568"),
                            color: useColorModeValue("white", "#F5F5F5"),
                          }}
                        >
                            Explore EIPs
                        </Button>
                      </NextLink>
                    </Box>



                  </Stack>
                  
                  {/* Fusaka Countdown Badge - Mobile */}
                  {/* <Box mt={6} display="flex" justifyContent="center">
                    <FusakaCountdownBadge variant="detailed" />
                  </Box> */}
                  
                  <div className="mt-6">
                    <AllChart type="Total" dataset={data} />
                  </div>
                </div>
              </Box>

              {/* Stats Grid Section - Removed, now integrated in dropdown */}

              <Box
                className="py-2"
                display={{ base: "block", md: "block", lg: "none" }}
              >
                <Box
                  className="w-full lg:px-48 md:px-32 sm:px-24 px-20 py-2 rounded-[0.55rem] hover:border border-blue-500"
                  bgColor={bg}
                >
                  <SearchBox />
                </Box>
              </Box>
              
              {/* Tools Section */}
              <Box
                mt={6}
                bg={useColorModeValue("white", "gray.800")}
                borderRadius="xl"
                boxShadow="sm"
                border="1px solid"
                borderColor={useColorModeValue("gray.200", "gray.700")}
                p={4}
                mb={4}
              >
                <ToolsSection />
              </Box>
              



            </motion.div>
            
            {/* Supported By Section */}
            <SupportedBy />
            
            {/* Status Changes Section */}
            <Box 
              py={4} 
              id="statuschanges"
              bg={useColorModeValue("white", "gray.800")}
              borderRadius="xl"
              boxShadow="sm"
              border="1px solid"
              borderColor={useColorModeValue("gray.200", "gray.700")}
              mb={4}
              px={4}
            >
              <Box>
                <Header
                  title="EIP Status Changes by Year"
                  subtitle="Overview"
                  description="Insights of EIPs"
                  sectionId="statuschanges"
                />
              </Box>
              <Box paddingTop={3} paddingBottom={3}>
                <TypeGraphs />
              </Box>
            </Box>
            
            {/* Trending EIPs Section */}
            <Box
              bg={useColorModeValue("white", "gray.800")}
              borderRadius="xl"
              boxShadow="sm"
              border="1px solid"
              borderColor={useColorModeValue("gray.200", "gray.700")}
              p={4}
              mb={4}
            >
              <Clients />
            </Box>

            {/* Dashboard Section */}
            <Box 
              id="dashboard" 
              sx={{ scrollMarginTop: "100px" }}
              bg={useColorModeValue("white", "gray.800")}
              borderRadius="xl"
              boxShadow="sm"
              border="1px solid"
              borderColor={useColorModeValue("gray.200", "gray.700")}
              p={4}
              mb={4}
            >
              <Box
                // bg="rgba(0, 0, 0, 0.5)"
                borderRadius="md" // Rounded corners
                // padding={6} // Padding around the text
                // boxShadow="md"
                // className="border border-red-700"
                maxWidth="100%"
                overflow="hidden"
                mx="auto"
              >
                  <Box>
                    <Header
                      title="Dashboard"
                      subtitle="Welcome to Dashboard"
                      description="A high-level overview of Ethereum Standards by type, status, and lifecycle progress.
"
                      sectionId="dashboard"
                    />
                  </Box>

                  <Box>
                    {/*<Button*/}
                    {/*    colorScheme="blue"*/}
                    {/*    variant="outline"*/}
                    {/*    fontSize={{lg:'14px',md:'12px', sm:'12px',base:'10px'}}*/}
                    {/*    fontWeight={'bold'}*/}
                    {/*    padding={{lg:'10px 20px',md:'5px 10px', sm:'5px 10px',base:'5px 10px'}}*/}
                    {/*>*/}
                    {/*  <DownloadIcon marginEnd={'1.5'} />*/}
                    {/*  Download Reports*/}
                    {/*</Button>*/}
                  </Box>
               

                <Box
                  display="grid"
                  gridTemplateColumns={{ lg: "repeat(2, 1fr)" }}
                  gap={"3"}
                  marginTop={"2px"}
                >
                  <div className="grid grid-cols-2 gap-3">
                    <div className="col-span-2">
                      <StatBox
                        title="Meta EIPs"
                        value={
                          new Set(
                            allData
                              .filter((item) => item.type === "Meta")
                              .map((item) => item.eip)
                          ).size
                        }
                        description="Meta EIPs describe changes to the EIP process, or other non-optional changes."
                        icon={
                          <Icon
                            as={Briefcase}
                            fontSize={{ base: "10", lg: "15" }}
                          />
                        }
                        url="meta"
                      />
                    </div>

                    <StatBox
                      title="Core EIPs"
                      value={
                        data?.eip?.filter(
                          (item) =>
                            item.type === "Standards Track" &&
                            item.category === "Core"
                        ).length || 0
                      }
                      description="Core EIPs describe changes to the Ethereum protocol."
                      icon={
                        <Icon as={Anchor} fontSize={{ lg: "15", sm: "10" }} />
                      }
                      url="core"
                    />

                    <StatBox
                      title="ERCs"
                      value={
                        new Set(
                          allData
                            .filter((item) => item.category === "ERC")
                            .map((item) => item.eip)
                        ).size
                      }
                      description="ERCs describe application-level standards for the Ethereum ecosystem."
                      icon={
                        <Icon as={BookOpen} fontSize={{ lg: "15", sm: "10" }} />
                      }
                      url="erc"
                    />

                    <StatBox
                      title="Networking EIPs"
                      value={
                        new Set(
                          allData
                            .filter((item) => item.category === "Networking")
                            .map((item) => item.eip)
                        ).size
                      }
                      description="Networking EIPs describe changes to the Ethereum network protocol."
                      icon={
                        <Icon as={Radio} fontSize={{ lg: "15", sm: "10" }} />
                      }
                      url="networking"
                    />

                    <StatBox
                      title="Interface EIPs"
                      value={
                        new Set(
                          allData
                            .filter((item) => item.category === "Interface")
                            .map((item) => item.eip)
                        ).size
                      }
                      description="Interface EIPs describe changes to the Ethereum client API."
                      icon={
                        <Icon as={Link} fontSize={{ lg: "15", sm: "10" }} />
                      }
                      url="interface"
                    />

                    <StatBox
                      title="Informational EIPs"
                      value={
                        new Set(
                          allData
                            .filter((item) => item.type === "Informational")
                            .map((item) => item.eip)
                        ).size
                      }
                      description="Informational EIPs describe other changes to the Ethereum ecosystem."
                      icon={
                        <Icon
                          as={Clipboard}
                          fontSize={{ base: "10", lg: "15" }}
                        />
                      }
                      url="informational"
                    />

                    <StatBox
                      title="RIPs"
                      value={
                        new Set(
                          allData
                            .filter((item) => item.repo === "rip")
                            .map((item) => item.eip)
                        ).size
                      }
                      description="RIPs describe changes to the RIP process, or other non-optional changes."
                      icon={
                        <Icon
                          as={Briefcase}
                          fontSize={{ base: "10", lg: "15" }}
                        />
                      }
                      url="rip"
                    />
                  </div>

                  <Box
                    as={motion.div}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 } as any}
                    bgColor={bg}
                    paddingY={{ lg: "1rem", sm: "1rem" }}
                    paddingX={{ lg: "1.5rem", sm: "0.5rem" }}
                    borderRadius="0.55rem"
                    _hover={{
                      border: "1px",
                      borderColor: "#30A0E0",
                    }}
                    className="hover: cursor-pointer ease-in duration-200"
                  >
                    <NextLink href="/all">
                      <Text
                        fontSize="2xl"
                        fontWeight="bold"
                        color="#30A0E0"
                        marginTop="4"
                        marginRight="6"
                        paddingBottom={6}
                        padding={2}
                      >
                      {`Category - [${uniqueEipCount}]`}
                      </Text>
                    </NextLink>
                    <DashboardDonut2 dataset={data} />
                  </Box>
                </Box>

                <Box
                  display="grid"
                  gridTemplateColumns={{ lg: "repeat(2, 1fr)" }}
                  gap={"4"}
                  marginTop={"6px"}
                >
                  <Box
                    as={motion.div}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 } as any}
                    bgColor={bg}
                    paddingY={{ lg: "1rem", sm: "1rem" }}
                    paddingX={{ lg: "2rem", sm: "0.5rem" }}
                    borderRadius="0.55rem"
                    _hover={{
                      border: "1px",
                      borderColor: "#30A0E0",
                    }}
                    className="hover: cursor-pointer ease-in duration-200"
                  >
                    <NextLink href="/status">
                      <Text
                        fontSize="2xl"
                        fontWeight="bold"
                        color="#30A0E0"
                        marginTop="4"
                        marginRight="6"
                        paddingBottom={6}
                        padding={2}
                      >
                        {`Status - [${uniqueEipCount}]`}
                      </Text>
                    </NextLink>
                    <DashboardDonut dataset={data} />
                  </Box>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <StatBox
                        title="Draft"
                        value={
                          allData.filter((item) => item.status === "Draft")
                            .length
                        }
                        description="Draft EIPs are proposals still under initial consideration and open for feedback."
                        icon={
                          <Icon
                            as={Briefcase}
                            fontSize={{ base: "10", lg: "15" }}
                          />
                        }
                        url="draft"
                      />
                    </div>

                    <StatBox
                      title="Review"
                      value={
                        allData.filter((item) => item.status === "Review")
                          .length
                      }
                      description="EIPs in the Review stage are being actively discussed and evaluated by the community."
                      icon={
                        <Icon as={Anchor} fontSize={{ lg: "15", sm: "10" }} />
                      }
                      url="review"
                    />

                    <StatBox
                      title="Last Call"
                      value={
                        allData.filter((item) => item.status === "Last Call")
                          .length
                      }
                      description="Last Call EIPs are nearing finalization, with a short period for final community comments."
                      icon={
                        <Icon as={BookOpen} fontSize={{ lg: "15", sm: "10" }} />
                      }
                      url="last-call"
                    />

                    <StatBox
                      title="Final"
                      value={
                        allData.filter((item) => item.status === "Final").length
                      }
                      description="Final EIPs have been formally accepted and implemented as part of the Ethereum protocol."
                      icon={
                        <Icon as={Radio} fontSize={{ lg: "15", sm: "10" }} />
                      }
                      url="final"
                    />

                    <StatBox
                      title="Withdrawn"
                      value={
                        allData.filter((item) => item.status === "Withdrawn")
                          .length
                      }
                      description="Withdrawn EIPs have been removed from consideration by the author or due to lack of support."
                      icon={
                        <Icon as={Link} fontSize={{ lg: "15", sm: "10" }} />
                      }
                      url="withdrawn"
                    />

                    <StatBox
                      title="Stagnant"
                      value={
                        allData.filter((item) => item.status === "Stagnant")
                          .length
                      }
                      description="Stagnant EIPs are inactive and have not progressed for a prolonged period."
                      icon={
                        <Icon
                          as={Clipboard}
                          fontSize={{ base: "10", lg: "15" }}
                        />
                      }
                      url="stagnant"
                    />

                    <StatBox
                      title="Living"
                      value={
                        allData.filter((item) => item.status === "Living")
                          .length
                      }
                      description="Living EIPs are continuously updated and reflect evolving standards or documentation."
                      icon={
                        <Icon
                          as={Briefcase}
                          fontSize={{ base: "10", lg: "15" }}
                        />
                      }
                      url="living"
                    />
                  </div>
                </Box>
              </Box>
            </Box>
            
            {/* Latest Updates Section */}
            <Box 
              id="latest-updates"
              bg={useColorModeValue("white", "gray.800")}
              borderRadius="xl"
              boxShadow="sm"
              border="1px solid"
              borderColor={useColorModeValue("gray.200", "gray.700")}
              p={4}
              mb={4}
            >
              <TwitterTimeline />
            </Box>
            
          </motion.div>
        )}

        {/* FAQ Section */}
        <FAQ />
      </Box>
    </>
  );
};

function getMonth(monthName: any) {
  switch (monthName) {
    case "January":
      return 1;
    case "February":
      return 2;
    case "March":
      return 3;
    case "April":
      return 4;
    case "May":
      return 5;
    case "June":
      return 6;
    case "July":
      return 7;
    case "August":
      return 8;
    case "September":
      return 9;
    case "October":
      return 10;
    case "November":
      return 11;
    case "December":
      return 12;
    default:
      return "1";
  }
}

export default Dashboard;
