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
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import Header from "@/components/Header";
import { DownloadIcon } from "@chakra-ui/icons";
import DashboardDonut from "@/components/DashboardDonut";
import {
  Anchor,
  BookOpen,
  Radio,
  Link,
  Clipboard,
  Briefcase,
} from "react-feather";
import { BsArrowUpRight, BsGraphUp } from "react-icons/bs";
import StackedColumnChart from "@/components/StackedBarChart";
import AreaC from "@/components/AreaC";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
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
import AllChart from "./AllChart";
import EIPS_dashboard_img from "../../public/EIPS_dashboard_img.png"
import ToolsSection from "./AvailableTools";

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
  const [data, setData] = useState<APIResponse>(); // Set initial state as an empty array
  const [isLoading, setIsLoading] = useState(true); // Loader state
  const [isDarkMode, setIsDarkMode] = useState(false);
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
  const allData: EIP[] = data?.eip.concat(data?.erc.concat(data?.rip)) || [];

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

  return (
    <>
      <Box
        paddingBottom={{ lg: "10", sm: "10", base: "10" }}
        marginX={{ lg: "40", md: "2", sm: "2", base: "2" }}
        paddingX={{ lg: "10", md: "5", sm: "5", base: "5" }}
        marginTop={{ lg: "10", md: "5", sm: "5", base: "5" }}
      >
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
                paddingTop={{ lg: "12", base: "6" }}
                paddingBottom={{ lg: "6", base: "6" }}
              >
                <div className="lg:block hidden">
                  <Box
                    display={{ lg: "grid" }}
                    gridTemplateColumns={{ lg: "2fr 1fr" }}
                  >
                    <Stack direction={"column"}>
                      <Text
                        color={"#30A0E0"}
                        fontWeight={"bold"}
                        fontSize={{
                          lg: "7xl",
                          md: "5xl",
                          sm: "3xl",
                          base: "xl",
                        }}
                      >
                        Ethereum <br /> Improvement <br /> Proposal <br />{" "}
                        Insights
                      </Text>
                      <Stack direction={"row"} spacing={"6"}>
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
                              rightIcon={<BsGraphUp />}
                            >
                              {monthName} {year} Insights
                            </Button>
                          </NextLink>
                        </Box>
                      </Stack>
                    </Stack>
                    <BoyGirl2/>
                    {/* <AllChart type="Total" /> */}
                  </Box>
                  <br/><br/><br/>
                  <AllChart type="Total" />
                </div>
                
                {/* <AllChart type="Total" /> */}
                
                <div className="lg:hidden block">
                  <Text
                    className="text-5xl text-center pb-5 sm:text-6xl md:text-7xl"
                    color={"#30A0E0"}
                    fontWeight={"bold"}
                  >
                    Ethereum <br /> Improvement <br /> Proposal <br /> Insights
                  </Text>
                  <Stack direction={"row"} spacing={"6"} paddingTop={"20"} justifyContent={"center"}>
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
                        >
                          {monthName} {year} Insights
                        </Button>
                      </NextLink>
                    </Box>
                  </Stack>
                  <br/><br/>
                  <AllChart type="Total" />
                </div>
              </Box>

              {/* <div className="py-8"> */}
                {/* <Box
                  className={
                    "w-full lg:px-48 md:px-32 sm:px-24 px-20 py-5 rounded-[0.55rem] hover:border border-blue-500"
                  }
                  bgColor={bg}
                > */}
                 <ToolsSection/>
                {/* </Box> */}
              {/* </div> */}

              <div className="py-8">
                <Box
                  className={
                    "w-full lg:px-48 md:px-32 sm:px-24 px-20 py-5 rounded-[0.55rem] hover:border border-blue-500"
                  }
                  bgColor={bg}
                >
                  <SearchBox />
                </Box>
              </div>

              {/* <Box className={"lg:grid grid-cols-2 hidden pb-20"}>
                <div className={"pl-8"}>
                  <BoyGirl />
                </div>

                <div className={" flex justify-center items-center"}>
                  <div className={"pt-24 space-y-6"}>
                    <h1 className={"text-5xl font-bold"}>
                      What is <span className="text-blue-400">an EIP</span>?
                    </h1>
                    <p className={"text-3xl max-w-xl"}>
                      EIP is a design document providing information to the
                      Ethereum community or describing a new feature or
                      improvement for the{" "}
                      <span className="text-blue-400">Ethereum blockchain</span>
                      .
                    </p>
                    <NextLink href={"/resources"}>
                      <span className="text-blue-400 text-xl flex space-x-5">
                        Learn More{" "}
                        <BsArrowUpRight className={"pt-2"} size={25} />
                      </span>
                    </NextLink>
                  </div>
                </div>
              </Box> */}

<Box className="grid grid-cols-1 lg:grid-cols-2 pb-20 gap-8 lg:gap-16">
  {/* Left Side - YouTube Video */}
  <div className="flex justify-center lg:justify-center items-center">
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

  {/* Right Side - EIPInsight Info */}
  <div className="flex justify-center items-center">
    <div className="text-center max-w-xl space-y-6">
      <h1 className="text-5xl font-bold">
        What is <span className="text-blue-400">EIPInsight</span>?
      </h1>
      <p className="text-xl text-justify">
        EIPsInsight is specialized in toolings designed to provide clear, visual insights into the activity of Ethereum Improvement Proposal (EIP), Ethereum Request for Comments (ERCs), and Rollup Improvement Proposals (RIPs) over a specified period. Data provided is used for tracking the progress and workload distribution among EIP Editors, ensuring transparency and efficiency in the proposal review process.
      </p>
      <NextLink href="/resources">
        <span className="text-blue-400 text-xl flex items-center space-x-2">
          Learn More <BsArrowUpRight className="pt-1" size={25} />
        </span>
      </NextLink>
    </div>
  </div>
</Box>





              <FlexBetween>
                <Box id={"1"}>
                  <Header
                    title="DASHBOARD"
                    subtitle="Welcome to the dashboard"
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
              </FlexBetween>
            </motion.div>

            <Box
              display="grid"
              gridTemplateColumns={{ lg: "repeat(2, 1fr)" }}
              gap={"6"}
              marginTop={"20px"}
            >
              
              <div className="grid grid-cols-2 gap-6">
  <div className="col-span-2">
    <StatBox
      title="Meta EIPs"
      value={new Set(allData.filter((item) => item.type === "Meta").map((item) => item.eip)).size}
      description="Meta EIPs describe changes to the EIP process, or other non-optional changes."
      icon={<Icon as={Briefcase} fontSize={{ base: "10", lg: "15" }} />}
      url="meta"
    />
  </div>

  <StatBox
    title="Core EIPs"
    value={data?.eip.filter(
      (item) =>
        item.type === "Standards Track" &&
        item.category === "Core"
    ).length ||0}
    description="Core EIPs describe changes to the Ethereum protocol."
    icon={<Icon as={Anchor} fontSize={{ lg: "15", sm: "10" }} />}
    url="core"
  />

  <StatBox
    title="ERCs"
    value={new Set(allData.filter((item) => item.category === "ERC").map((item) => item.eip)).size}
    description="ERCs describe application-level standards for the Ethereum ecosystem."
    icon={<Icon as={BookOpen} fontSize={{ lg: "15", sm: "10" }} />}
    url="erc"
  />

  <StatBox
    title="Networking EIPs"
    value={new Set(allData.filter((item) => item.category === "Networking").map((item) => item.eip)).size}
    description="Networking EIPs describe changes to the Ethereum network protocol."
    icon={<Icon as={Radio} fontSize={{ lg: "15", sm: "10" }} />}
    url="networking"
  />

  <StatBox
    title="Interface EIPs"
    value={new Set(allData.filter((item) => item.category === "Interface").map((item) => item.eip)).size}
    description="Interface EIPs describe changes to the Ethereum client API."
    icon={<Icon as={Link} fontSize={{ lg: "15", sm: "10" }} />}
    url="interface"
  />

  <StatBox
    title="Informational EIPs"
    value={new Set(allData.filter((item) => item.type === "Informational").map((item) => item.eip)).size}
    description="Informational EIPs describe other changes to the Ethereum ecosystem."
    icon={<Icon as={Clipboard} fontSize={{ base: "10", lg: "15" }} />}
    url="informational"
  />

  <StatBox
    title="RIPs"
    value={new Set(allData.filter((item) => item.repo === "rip").map((item) => item.eip)).size}
    description="RIPs describe changes to the RIP process, or other non-optional changes."
    icon={<Icon as={Briefcase} fontSize={{ base: "10", lg: "15" }} />}
    url="rip"
  />
</div>

              <Box
                as={motion.div}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 } as any}
                bgColor={bg}
                paddingY={{ lg: "2rem", sm: "2rem" }}
                paddingX={{ lg: "2rem", sm: "0.5rem" }}
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
                    marginRight="6"
                    paddingBottom={6}
                  >
                  {`Status - [${allData.length}]`}
                  </Text>
                </NextLink>
                <DashboardDonut />
              </Box>
            </Box>

          </motion.div>
        )}
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
