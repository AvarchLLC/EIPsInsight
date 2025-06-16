import React from "react";
import AllLayout from "@/components/Layout";
// import Header from "@/components/Header";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import LoaderComponent from "@/components/Loader";
import TypeGraphs from "@/components/TypeGraphs";
import TypeGraphs3 from "@/components/TypeGraphs3";
import SearchBox from "@/components/SearchBox";
import { useRouter } from "next/router";
import { CopyIcon } from "@chakra-ui/icons";
import {
  Box,
  Grid,
  Text,
  useColorModeValue,
  Link as LI,
  SimpleGrid,
  Select,
  GridItem,
  Link,
  useToast,
} from "@chakra-ui/react";
import CBoxStatus from "@/components/CBoxStatus";
import StackedColumnChart from "@/components/StackedBarChart";
import AreaStatus from "@/components/AreaStatus";
import NextLink from "next/link";
import EIPStatusDonut from "@/components/EIPStatusDonut";
import EIPTypeDonut from "@/components/EIPTypeDonut";
import AllChart from "@/components/AllChart";
import AllChart3 from "@/components/AllChart3";
import { Button, Heading, ButtonGroup, Flex } from "@chakra-ui/react";
import CatTable from "@/components/CatTable";
import CatTable2 from "@/components/CatTable2";

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

import OtherBox from "@/components/OtherStats";
import FeedbackWidget from "@/components/FeedbackWidget";
import EipTable from "@/components/EipTable";
import { useScrollSpy } from "@/hooks/useScrollSpy";
<<<<<<< dev
import SubscriptionButton from '@/components/SubscribtionButton';
=======
import Header from "@/components/Header";
import { SubscribeForm } from '@/components/SubscriptionForm';

>>>>>>> dev

const ALL_OPTIONS = ["Core", "Networking", "Interface", "Meta", "Informational"];
const Status_OPTIONS = ["Draft", "Review", "Last Call", "Living", "Final", "Stagnant", "Withdrawn"];


const Type = () => {
  const [data, setData] = useState<EIP[]>([]);
  const [data4, setData4] = useState<EIP[]>([]);
  const [data2, setData2] = useState<APIResponse>({
    eip: [],
    erc: [],
    rip: [],
  });
  const [data3, setData3] = useState<Data>({ eip: [], erc: [], rip: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [selected, setSelected] = useState<"status" | "category">("category");
  const [selectedInner, setSelectedInner] = useState(ALL_OPTIONS[0]);
  const [selectedStatusInner, setSelectedStatusInner] = useState(Status_OPTIONS[0]);
  const [selectedEIP, setSelectedEIP] = useState<string>('all');
  const router = useRouter();
  const basePath = typeof window !== "undefined" ? window.location.origin : "";
  const toast = useToast();
  useScrollSpy([
    "graphs",
    "draftvsfinal",
    "core",
    "networking",
    "interface",
    "meta",
    "informational",
    "draft",
    "review",
    "lastcall",
    "final",
    "stagnant",
    "withdrawn",
    "living",
    "metatable",
    "informationaltable",
    "coretable",
    "networkingtable",
    "interfacetable",
  ]);


  const handleCopyOverviewChart = () => {
    const url = `${window.location.origin}/eip?view=${selected}${selected === 'category' ? '&filter=Core' : ''}#${selected}-graphs`;
    navigator.clipboard.writeText(url);
    toast({
      title: "Link copied!",
      description: `Shared view for ${selected === "status" ? "Status Chart" : "category Chart"}`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  }; const handleCopyTypeDetail = () => {
    const url = `${window.location.origin}/eip?view=category&filter=${encodeURIComponent(selectedInner)}#category-graphs`;
    navigator.clipboard.writeText(url);
    toast({
      title: "Link copied!",
      description: `Shared view for category: ${selectedInner}`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const handleCopyStatusDetail = () => {
    const url = `${window.location.origin}/eip?view=status&status=${encodeURIComponent(selectedStatusInner)}#status-graphs`;
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
    const url = `${window.location.origin}/eip?view=status#draftvsfinal`;
    navigator.clipboard.writeText(url);
    toast({
      title: "Link copied!",
      description: "Shared Draft vs Final view",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };


  const [isVisible, setIsVisible] = useState(false);
  let timeout: string | number | NodeJS.Timeout | undefined;

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => setIsVisible(false), 1000); // Hide after 1s of no scroll
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timeout);
    };
  }, []);
  useEffect(() => {
    setSelectedInner(ALL_OPTIONS[0]);
  }, [selected]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/new/all`);
        const jsonData = await response.json();
        setData(jsonData.eip);
        setData4(jsonData.eip);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (router.query.view === "status") {
      setSelected("status");
    } else {
      // default or if view === "type"
      setSelected("category");
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

            <Flex
              direction={{ base: "column", md: "row" }}
              justify="space-between"
              align="center"
              wrap="wrap"
              gap={4}
            >
              <Header
                title={`Ethereum Improvement Proposal - [${data.length}]`}
                subtitle={"Overview"}
                description={
                  <Flex align="center" gap={2} flexWrap="wrap">
                    <Text>
                      EIP stands for Ethereum Improvement Proposal. An EIP is a design document providing information to the Ethereum community, or describing a new feature
                    </Text>
                    <Button
                      size="sm"
                      colorScheme="blue"
                      variant="link"
                      as={Link}
                      href="/FAQs/EIP"
                    >
                      Learn More
                    </Button>
                  </Flex>
                }
              />
              <div className="flex items-center mb-4">
                <SubscriptionButton type="eips" id="all" />
              </div>


              <Box id="githubstats">
                <OtherBox type="EIPs" />
              </Box>
              <br></br>

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


            <Box display={{ base: "block", md: "block", lg: "none" }} className={"w-full pt-10"}>
              <SearchBox />
            </Box>

            <Box className="w-full flex flex-col gap-5 pt-8" id="chart type">
              <Box id="charts" className="w-full overflow-hidden">
                <Box display="flex" justifyContent="space-between" alignItems="center" px={0} pb={2}>
                  <Text fontSize={{ base: "32px", sm: "32px", md: "34px", lg: "36px" }} fontWeight="bold">
                    {selected === "status" ? "Distribution over the year(Based on status)" : "Distribution over the year(Based on category)"}
                  </Text>
                  <Button
                    onClick={handleCopyOverviewChart}
                    size="sm"
                    leftIcon={<CopyIcon />}
                    colorScheme="blue"
                    variant="ghost"
                  >
                    Copy Link
                  </Button>
                </Box>
                <Box className="w-full h-full">
                  {selected === "status" ? (
                    <AllChart3 type="EIP" />
                  ) : (
                    <AllChart type="EIP" />
                  )}
                </Box>
              </Box>

              <Box className="w-full overflow-hidden">
                <Box className="w-full h-full">
                  {selected === "status" ? (
                    <EIPStatusDonut />
                  ) : (
                    <EIPTypeDonut />
                  )}
                </Box>
              </Box>
            </Box>

<<<<<<< dev
            <Box w="100%" id="categories">

              {selected === "category" && (
=======
            <Box px={{ base: 4, md: 8 }} py={6} maxW="6xl" mx="auto" id="View EIP Stats">
              {selected === "type" && (
>>>>>>> dev
                <>
                  <Heading
                    fontSize={{ base: "32px", sm: "34px", md: "36px" }}
                    fontWeight="bold"
                    color="#40E0D0"
                    mb={4}
                  >
                    Select Category to View EIP Dashboard
                    <Button
                      onClick={handleCopyTypeDetail}
                      size="md"
                      leftIcon={<CopyIcon />}
                      colorScheme="blue"
                      variant="ghost"
                      ml={2}
                    />
                  </Heading>

                  <Flex mb={4} gap={4} wrap="wrap">
                    <Select
                      maxW={{ base: "100%", md: "320px" }}  // Responsive width
                      value={selectedInner}
                      onChange={(e) => setSelectedInner(e.target.value)}
                      borderColor="blue.400"
                      _hover={{ borderColor: "blue.500" }}
                      focusBorderColor="blue.500"
                    >
                      {ALL_OPTIONS.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </Select>
                  </Flex>

                  <Flex direction={{ base: "column", md: "row" }} gap={6} w="full" align="stretch">
                    <Box
                      flex={1}
                      minH={{ base: "400px", md: "500px" }}
                      display="flex"
                      flexDirection="column"
                      bg="gray.50"
                      borderRadius="xl"
                    >
                      <TypeGraphs selected={selectedInner} />
                    </Box>

                    <Box
                      flex={1}
                      minH={{ base: "400px", md: "500px" }}
                      display="flex"
                      flexDirection="column"
                      bg="gray.50"
                      borderRadius="xl"
                    >
                      <CatTable2 dataset={data4} cat="All" status={selectedInner} />
                    </Box>
                  </Flex>





                </>
              )}
            </Box>




            <Box paddingBottom={{ lg: "5", md: "5", sm: "5", base: "5" }} >
              {selected === "status" && (
                <>
                  <Box paddingY="8">
                    <Flex justify="space-between" align="center" mb={4} id="draftvsfinal">
                      <Text fontSize={{ base: "32px", sm: "32px", md: "34px", lg: "36px" }} fontWeight="bold" color="#40E0D0">
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
                    <AreaStatus type="EIPs" />
                  </Box>

                  <Box w="100%" px={0} py={2} id="statuses" maxW="100%" mx="auto">
                    <Heading
                      fontSize={{ base: "32px", md: "34px", lg: "36px" }}
                      fontWeight="bold"
                      color="#40E0D0"
                      mb={4}
                    >
                      Select Status to View EIP Dashboard
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
                        {Status_OPTIONS.map((status) => (
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
                      align="stretch" // ✅ makes children match height
                    >
                      <Box
                        flex={1}
                        bg="gray.50"
                        p={0}                  // ✅ removed padding
                        borderRadius="xl"
                        overflowX="auto"
                        h="100%"               // ✅ allow height match
                      >
                        <Box h="100%">
                          <StackedColumnChart
                            status={selectedStatusInner}
                            type="EIPs"
                            dataset={data2}
                          />
                        </Box>
                      </Box>

                      <Box
                        flex={1}
                        bg="gray.50"
                        p={0}
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
                </>
              )}
            </Box>

          </Box>

          <Box
            ml="4rem"
            mr="2rem"
            mb="2rem"
          >

            <Box className="w-full mt-6" id="tables">
              <EipTable dataset={data4} cat="All" status="All" />
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
                <LI href="/erc" color="blue" isExternal>
                  ERCs
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

export default Type;
