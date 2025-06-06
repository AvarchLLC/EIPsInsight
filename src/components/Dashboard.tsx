import { motion } from "framer-motion";
import {
  Box,
  Button,
  Text,
  useColorModeValue,
  useMediaQuery,
  useTheme,
  Stack,
  Tooltip,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState, useLayoutEffect } from "react";
import { DownloadIcon } from "@chakra-ui/icons";
import { BsArrowUpRight, BsGraphUp } from "react-icons/bs";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { mockEIP } from "@/data/eipdata";
import LoaderComponent from "./Loader";
import AllChart from "./AllChart2";
import ToolsSection from "./AvailableTools";
import TypeGraphs from "@/components/TypeGraphs2";
import {
  FiHome,
  FiTool,
  FiInfo,
  FiBarChart2,
  FiDatabase,
} from "react-icons/fi";
import { useSidebar } from "@/components/Sidebar/SideBarContext";
import DashboardCards from "./DashboardCards";
import SearchBox from "./SearchBox";
import BoyGirl from "./BoyGirl3";
import FeedbackWidget from "./FeedbackWidget";

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
  // const { setSections } = useSidebar();
  const [data, setData] = useState<APIResponse>({
    eip: [],
    erc: [],
    rip: [],
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showThumbs, setShowThumbs] = useState(false);

  const textColorLight = "#2C3E50";
  const textColorDark = "#F5F5F5";
  const bgGradientLight = "linear(to-r, #2980B9, #3498DB)";
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
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const allData: EIP[] = data?.eip?.concat(data?.erc?.concat(data?.rip)) || [];
  const uniqueStatuses = [...new Set(allData?.map((item) => item.status))];
  console.log(uniqueStatuses);
  const uniqueeip = allData?.filter((item) => item.status === "");
  console.log("unique eip1:", uniqueeip);
  const uniqueeip2 = allData?.filter((item) => item.status === " ");
  console.log("unique eip2:", uniqueeip2);

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
  }, [bg]);

  const monthName = new Date().toLocaleString([], {
    month: "long",
  });
  const year = new Date().getFullYear();

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
  return (
    <>
      <FeedbackWidget />
      <Box
        paddingBottom={{ lg: "10", sm: "10", base: "10" }}
        marginX={{ lg: "40", md: "2", sm: "2", base: "2" }}
        paddingX={{ lg: "10", md: "5", sm: "5", base: "5" }}
        marginTop={{ lg: "10", md: "5", sm: "5", base: "5" }}
      >
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
            transition={{ duration: 0.5 }}
          >
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Box
                id={"hero"}
                paddingTop={{ lg: "12", base: "6" }}
                paddingBottom={{ lg: "6", base: "6" }}
              >
                <div className="lg:block hidden">
                  <div className="flex justify-between">
                    <Box
                      borderRadius="md"
                      padding={4}
                      paddingLeft="6"
                      maxWidth="550px"
                    >
                      <Text
                        color={useColorModeValue(textColorLight, textColorDark)}
                        fontWeight={"bold"}
                        bgGradient={useColorModeValue(
                          bgGradientLight,
                          bgGradientDark
                        )}
                        bgClip="text"
                        fontSize={{
                          lg: "6xl",
                          md: "5xl",
                          sm: "3xl",
                          base: "xl",
                        }}
                      >
                        Ethereum <br /> Improvement <br /> Proposal <br />{" "}
                        Insight
                      </Text>
                    </Box>
                    <BoyGirl />
                  </div>
                  <Box
                    display={{ lg: "grid" }}
                    gridTemplateColumns={{ lg: "2fr 1fr" }}
                  >
                    <Stack direction={"column"}>
                      <Stack direction={"row"} spacing={"6"}>
                        <Box>
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
                              bgColor={"#30A0E0"}
                              _hover={{
                                bgColor: useColorModeValue(
                                  "#2B6CB0",
                                  "#4A5568"
                                ),
                                color: useColorModeValue("white", "#F5F5F5"),
                              }}
                            >
                              Dashboard
                            </Button>
                          </NextLink>
                        </Box>

                        <Box>
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
                              bgColor={"#30A0E0"}
                              _hover={{
                                bgColor: useColorModeValue(
                                  "#2B6CB0",
                                  "#4A5568"
                                ),
                                color: useColorModeValue("white", "#F5F5F5"),
                              }}
                            >
                              {monthName} {year} Insight
                            </Button>
                          </NextLink>
                        </Box>
                      </Stack>
                    </Stack>
                  </Box>
                  <br />
                  <br />
                  <br />
                  <Box
                    bg="rgba(0, 0, 0, 0.5)"
                    borderRadius="md"
                    padding={4}
                    boxShadow="md"
                  >
                    <AllChart type="Total" dataset={data} />
                  </Box>
                </div>

                <div className="lg:hidden block">
                  <Text
                    className="text-5xl text-center pb-5 sm:text-6xl md:text-7xl"
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
                    spacing={"6"}
                    paddingTop={"20"}
                    justifyContent={"center"}
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
                        href={`/insight/${year}/${getMonth(monthName)}`}
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
                          {monthName} {year} Insight
                        </Button>
                      </NextLink>
                    </Box>
                  </Stack>
                  <br />
                  <br />
                  <div id="all">
                    <AllChart type="Total" dataset={data} />
                  </div>
                </div>
              </Box>

              <Box
                className="py-8"
                display={{ base: "block", md: "block", lg: "none" }}
              >
                <Box
                  className="w-full lg:px-48 md:px-32 sm:px-24 px-20 py-5 rounded-[0.55rem] hover:border border-blue-500"
                  bgColor={bg}
                >
                  <SearchBox />
                </Box>
              </Box>
              <div id="ourtools">
                <ToolsSection />
              </div>

              <Box
                className="grid grid-cols-1 lg:grid-cols-2 pb-10 gap-8 lg:gap-8"
                bg="rgba(0, 0, 0, 0.5)"
                borderRadius="md"
                padding={5}
                boxShadow="md"
                marginTop={10}
              >
                <div className="col-span-full text-center" id="what">
                  <h1 className="text-5xl font-bold">
                    <span className="text-gray-200">What is</span>{" "}
                    <span className="text-blue-400">EIPsInsight</span>
                    <span className="text-gray-200">?</span>
                  </h1>
                </div>

                <div className="flex justify-center items-center">
                  <iframe
                    width="560"
                    height="315"
                    src="https://www.youtube.com/embed/AyidVR6X6J8?start=8"
                    title="YouTube video"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>

                <div className="flex justify-center items-center">
                  <div className="text-center max-w-xl space-y-6">
                    <p className="text-xl text-justify text-gray-200">
                      EIPsInsight is specialized in toolings designed to provide
                      clear, visual insights into the activity of Ethereum
                      Improvement Proposal (
                      <NextLink href="/eip">
                        <span className="text-blue-400">EIP</span>
                      </NextLink>
                      ), Ethereum Request for Comments (
                      <NextLink href="/erc">
                        <span className="text-blue-400">ERCs</span>
                      </NextLink>
                      ), and Rollup Improvement Proposals (
                      <NextLink href="/rip">
                        <span className="text-blue-400">RIPs</span>
                      </NextLink>
                      ), over a specified period. Data provided is used for
                      tracking the progress and workload distribution among
                      <NextLink href="/eips/eip-1">
                        <span className="text-blue-400"> EIP Editors</span>
                      </NextLink>
                      , ensuring transparency and efficiency in the proposal
                      review process.
                    </p>

                    <NextLink href="/resources">
                      <span className="text-blue-400 text-xl flex items-center space-x-2">
                        Learn More <BsArrowUpRight className="pt-1" size={25} />
                      </span>
                    </NextLink>
                  </div>
                </div>
              </Box>

              <br />
            </motion.div>
            <br />
            <Box paddingTop={8} paddingBottom={8}>
              <TypeGraphs />
            </Box>

            <DashboardCards />
          </motion.div>
        )}
      </Box>
    </>
  );
};

function getMonth(monthName: string): number {
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
      return 1;
  }
}

export default Dashboard;
