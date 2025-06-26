import AllLayout from "@/components/Layout";
import { Box, Button, Grid, Text, useColorModeValue, Link as LI, GridItem, Select, SimpleGrid, Link, useToast, Heading, } from "@chakra-ui/react";
import FlexBetween from "@/components/FlexBetween";
import Header from "@/components/Header";
import { CopyIcon, DownloadIcon } from "@chakra-ui/icons";
import TableStatus from "@/components/TableStatus";
import AreaStatus from "@/components/AreaStatus";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import LoaderComponent from "@/components/Loader";
import ERCGraph from "@/components/ERCGraph";
import NextLink from "next/link";
import StatusColumnChart from "@/components/StatusColumnChart";
import DateTime from "@/components/DateTime";
import SearchBox from "@/components/SearchBox";
import ERCCatBoxGrid from "@/components/ERCCatBoxGrid";
import ERCStatusDonut from "@/components/ERCStatusDonut";
import ERCTypeDonut from "@/components/ERCTypeDonut";
import StackedColumnChart from "@/components/StackedBarChart2";
import CBoxStatus from "@/components/CBoxStatus3";
import AllChart from "@/components/AllChart";
import AllChart3 from "@/components/AllChart3";
import AreaC from "@/components/AreaC";
import ERCStatusGraph from "@/components/ERCStatusGraph";
import OtherBox from "@/components/OtherStats";
import { ButtonGroup, Flex } from "@chakra-ui/react";
import TypeGraphs from "@/components/TypeGraphs4";
import CatTable from "@/components/CatTable";
import CatTable2 from "@/components/CatTable2";
import FeedbackWidget from "@/components/FeedbackWidget";
import ErcTable from "@/components/ErcTable";
import { useRouter } from "next/router";
import ERCsPRChart from "@/components/Ercsprs";
import SubscriptionButton from "@/components/SubscribtionButton";

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

interface EIP3 {
  _id: string;
  eip: string;
  fromStatus: string;
  toStatus: string;
  title: string;
  status: string;
  author: string;
  created: string;
  changeDate: string;
  type: string;
  category: string;
  discussion: string;
  deadline: string;
  requires: string;
  pr: number;
  changedDay: number;
  changedMonth: number;
  changedYear: number;
  createdMonth: number;
  createdYear: number;
  __v: number;
}


interface EIP2 {
  status: string;
  eips: {
    status: string;
    month: number;
    year: number;
    date: string;
    count: number;
    category: string;
    eips: any[];
  }[];
}

interface APIResponse {
  eip: EIP2[];
  erc: EIP2[];
  rip: EIP2[];
}

interface EIPGroup {
  category: string;
  month: number;
  year: number;
  date: string;
  count: number;
  eips: EIP3[];
}

interface APIResponse2 {
  status: string;
  eips: EIPGroup[];
}

interface Data {
  eip: APIResponse2[];
  erc: APIResponse2[];
  rip: APIResponse2[];
}
const ALL_OPTIONS = ["Core", "Networking", "Interface", "Meta", "Informational"];
const Status_OPTIONS = ["Draft", "Review", "Last Call", "Living", "Final", "Stagnant", "Withdrawn"];



const ERC = () => {
  const [data, setData] = useState<EIP[]>([]);
  const [data4, setData4] = useState<EIP[]>([]);
  const [data2, setData2] = useState<APIResponse>({ eip: [], erc: [], rip: [] });
  const [data3, setData3] = useState<Data>({ eip: [], erc: [], rip: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [selected, setSelected] = useState<"status" | "category">("category");
  const [selectedStatusInner, setSelectedStatusInner] = useState(Status_OPTIONS[0]);
  const router = useRouter();
  const basePath = typeof window !== "undefined" ? window.location.origin : "";
  const toast = useToast();

  const handleCopyOverviewChart = () => {
    const url = `${window.location.origin}/erc?view=${selected}#charts`;
    navigator.clipboard.writeText(url);
    toast({
      title: "Link copied!",
      description: `Shared view for ${selected === "status" ? "Status Chart" : "category Chart"}`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const handleCopyERCStatusGraph = () => {
    const url = `${window.location.origin}/erc?view=category#erc-status-graph`;
    navigator.clipboard.writeText(url);
    toast({
      title: "Link copied!",
      description: "Shared view for ERC Status Graph",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const handleCopyStatusDetail = () => {
    const url = `${window.location.origin}/erc?view=status&status=${encodeURIComponent(selectedStatusInner)}#status-graphs`;
    navigator.clipboard.writeText(url);
    toast({
      title: "Link copied!",
      description: `Shared view for Status: ${selectedStatusInner}`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const handleCopyAreaChart = () => {
    const url = `${window.location.origin}/erc?view=status#draftvsfinal`;
    navigator.clipboard.writeText(url);
    toast({
      title: "Link copied!",
      description: "Shared Draft vs Final view",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };




  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/new/all`);
        const jsonData = await response.json();
        setData(jsonData.erc);
        setData4(jsonData.erc);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);
  useEffect(() => {
  const viewParam = router.query.view;
  if (viewParam === "status" || viewParam === "category") {
    setSelected(viewParam);
  }
}, [router.query.view]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/new/graphsv2`);
        const jsonData = await response.json();
        setData2(jsonData);
        setData3(jsonData);
        setIsLoading(false); // Set loader state to false after data is fetched
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false); // Set loader state to false even if an error occurs
      }
    };

    fetchData();
  }, []);
  const bg = useColorModeValue("#f6f6f7", "#171923");
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
          <Box
            ml="4rem"
            mr="2rem"
            mt="2rem"
            mb="2rem"
            px="1rem"
          >
            <Flex direction="column" gap={6}>
              {/* Header Section */}
              <Header
                title={`Ethereum Request for Comment - [ ${data.length} ]`}
                subtitle={
                  <Flex align="center" gap={2} flexWrap="wrap">
                    <Text>
                      The goal of Ethereum Request for Change (ERCs) is to standardize and provide high-quality documentation for the Ethereum application layer.
                    </Text>
                    <Button
                      size="sm"
                      colorScheme="blue"
                      variant="link"
                      as={Link}
                      href="/FAQs/ERC"
                    >
                      Learn More
                    </Button>
                  </Flex>
                }
                description={
                  <Text>
                    ERCs are standards for application-level interfaces and contract behaviors on Ethereum.
                  </Text>
                }
              />

              {/* Row: Subscription + Toggle Buttons */}
              <Flex
                direction={{ base: "column", md: "row" }}
                justify="space-between"
                align="center"
                wrap="wrap"
                gap={4}
              >
                {/* Subscription Button (left) */}
                <Box>
                  <SubscriptionButton type="ercs" id="all" />
                </Box>

                {/* Toggle Buttons (right) */}
                <ButtonGroup size="md" isAttached>
                  <Button
                    bg={selected === "category" ? "#40E0D0" : "white"}
                    color={selected === "category" ? "white" : "#40E0D0"}
                    borderColor="#40E0D0"
                    variant="outline"
                    onClick={() => {
                      setSelected("category");
                      router.push("?view=category", undefined, { shallow: true });
                    }}
                  >
                    Category
                  </Button>
                  <Button
                    bg={selected === "status" ? "#40E0D0" : "white"}
                    color={selected === "status" ? "white" : "#40E0D0"}
                    borderColor="#40E0D0"
                    variant="outline"
                    onClick={() => {
                      setSelected("status");
                      router.push("?view=status", undefined, { shallow: true });
                    }}
                  >
                    Status
                  </Button>
                </ButtonGroup>
              </Flex>

              {/* Full-width OtherBox below */}
              <Box id="githubstats" width="100%">
                <OtherBox type="ERCs" />
              </Box>
            </Flex>


            <Box display={{ base: "block", md: "block", lg: "none" }} className="w-full pt-4">
              <SearchBox />
            </Box>

            <Box className="w-full flex flex-col gap-5 pt-8" id="graphs">
              {/* Copy Link Button for Overview Chart */}
              <Flex justify="flex-end" mb={2}>
                <Button
                  onClick={handleCopyOverviewChart}
                  size="sm"
                  leftIcon={<CopyIcon />}
                  colorScheme="blue"
                  variant="ghost"
                >
                  Copy Link
                </Button>
              </Flex>

              {/* AllChart - Full Width Below Donut */}
              <Box className="w-full overflow-hidden" >
                <Box className="w-full h-full">
                  {selected === "status" ? (
                    <AllChart3 type="ERC" />
                  ) : (
                    <AllChart type="ERC" />
                  )}
                </Box>
              </Box>

              {/* Donut Chart - Full Width on Top */}
              <Box className="w-full overflow-hidden">
                <Box className="w-full h-full">
                  {selected === "status" ? (
                    <ERCStatusDonut />
                  ) : (
                    <ERCTypeDonut />
                  )}
                </Box>
              </Box>
            </Box>

            <Box paddingTop={8}>
              {selected !== "status" && (
                <>
                  <Flex justify="flex-end" mb={2} id="progress">
                    <Button
                      onClick={handleCopyERCStatusGraph}
                      size="sm"
                      leftIcon={<CopyIcon />}
                      colorScheme="blue"
                      variant="ghost"
                    >
                      Copy Link
                    </Button>
                  </Flex>
                  <ERCStatusGraph />
                </>
              )}
            </Box>


            {selected === "status" && (
              <Box paddingBottom={{ lg: "5", md: "5", sm: "5", base: "5" }} w="full">
                {/* Draft vs Final Chart */}
                <Box paddingY="8" id="draftvsfinal">
                  <Flex justify="space-between" align="center" mb={4}>
                    <Text
                      fontSize={{ base: "32px", sm: "32px", md: "34px", lg: "36px" }}
                      fontWeight="bold"
                      color="#40E0D0"
                    >
                      Draft vs Final (Over the Years)
                    </Text>
                    <Button
                      onClick={handleCopyAreaChart}
                      size="sm"
                      leftIcon={<CopyIcon />}
                      colorScheme="blue"
                      variant="ghost"
                    >
                      Copy Link
                    </Button>
                  </Flex>
                  <AreaStatus type="ERCs" />
                </Box>

                {/* Status Selection and Content */}
                <Box w="100%" px={0} py={6} id="statuses" maxW="100%" mx="auto">
                  <Heading
                    fontSize={{ base: "32px", md: "34px", lg: "36px" }}
                    fontWeight="bold"
                    color="#40E0D0"
                    mb={4}
                  >
                    Select Status to View ERC Dashboard
                  </Heading>

                  <Flex
                    mb={4}
                    gap={4}
                    wrap="wrap"
                    direction={{ base: "column", sm: "row" }}
                    align={{ base: "stretch", sm: "center" }}
                  >
                    <Select
                      maxW={{ base: "100%", sm: "320px" }}
                      value={selectedStatusInner}
                      onChange={(e) => setSelectedStatusInner(e.target.value)}
                      borderColor="blue.400"
                      _hover={{ borderColor: "blue.500" }}
                      focusBorderColor="blue.500"
                    >
                      {["Draft", "Review", "Last Call", "Final"].map((status) => (
                        <option key={status} value={status}>
                          {status} ({data.filter((item) => item.status === status).length})
                        </option>
                      ))}
                    </Select>

                    <Button
                      onClick={handleCopyStatusDetail}
                      size="sm"
                      leftIcon={<CopyIcon />}
                      colorScheme="blue"
                      variant="ghost"
                    >
                      Copy Link
                    </Button>
                  </Flex>

                  <Flex
                    direction={{ base: "column", md: "row" }}
                    gap={6}
                    w="100%"
                    wrap="wrap"
                    align="stretch" // ✅ Ensures children match in height
                  >
                    {/* Status Chart */}
                    <Box
                      flex={1}
                      bg="gray.50"
                      p={0} // ✅ Remove padding
                      borderRadius="xl"
                      overflowX="auto"
                      h="100%"
                    >
                      <Box h="100%">
                        <StackedColumnChart
                          status={selectedStatusInner}
                          type="ERCs"
                          dataset={data2}
                        />
                      </Box>
                    </Box>

                    {/* Status Table */}
                    <Box
                      flex={1}
                      bg="gray.50"
                      p={0} // ✅ Remove padding
                      borderRadius="xl"
                      overflowX="auto"
                      h="100%"
                    >
                      <Box h="100%">
                        <CatTable
                          dataset={data4}
                          cat="All"
                          status={selectedStatusInner}
                        />
                      </Box>
                    </Box>
                  </Flex>

                </Box>
              </Box>
            )}
          </Box>

          <Box id="ErcActivity">
            <ERCsPRChart />
          </Box>
          <Box
            ml="4rem"
            mr="2rem"
            mb="2rem"
          >
            <Box className="w-full mt-6" id="tables">
              <ErcTable dataset={data4} cat="All" status="All" />
            </Box>

            <Box
              bg={useColorModeValue("blue.50", "gray.700")}
              color="black"
              borderRadius="md"
              padding={4}
              marginTop={4}
            >
              <Text>
                Also checkout{' '}
                <LI href="/eip" color="blue" isExternal>
                  EIPs
                </LI>{' '}
                and{' '}
                <LI href="/rip" color="blue" isExternal>
                  RIPs
                </LI>.
              </Text>
            </Box>
          </Box>
        </motion.div>
      )}
    </AllLayout>
  );

};

export default ERC;

