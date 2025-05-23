import React from "react";
import AllLayout from "@/components/Layout";
import Header from "@/components/Header";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import LoaderComponent from "@/components/Loader";
import TypeGraphs from "@/components/TypeGraphs";
import TypeGraphs3 from "@/components/TypeGraphs3";
import SearchBox from "@/components/SearchBox";
import {
  Box,
  Grid,
  Text,
  useColorModeValue,
  Link as LI,
  SimpleGrid,
  Select,
  GridItem,
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
import StatusGraph from "@/components/StatusGraph";

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
import EipTable from "@/components/EipTable";
import StatusGraphs from "@/components/StatusGraph";

const ALL_OPTIONS = ["Core", "Networking", "Interface", "Meta", "Informational"];
const Status_OPTIONS = ["Draft", "Review", "Last Call", "Living", "Final", "Stagnant", "Withdrawn"];


const Type = () => {
  const [data, setData] = useState<EIP[]>([]);
  const [data4, setData4] = useState<EIP[]>([]);
  const [data2, setData2] = useState<APIResponse>({ eip: [], erc: [], rip: [] });
  const [data3, setData3] = useState<Data>({ eip: [], erc: [], rip: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [selected, setSelected] = useState<"status" | "type">("type");
  const [selectedInner, setSelectedInner] = useState(ALL_OPTIONS[0]);
  const [selectedStatusInner, setSelectedStatusInner] = useState(Status_OPTIONS[0]);


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

          <Box
            paddingBottom={{ lg: "10", md: "10", sm: "10", base: "10" }}
            marginX={{ lg: "40", md: "2", sm: "2", base: "2" }}
            paddingX={{ lg: "10", md: "5", sm: "5", base: "5" }}
            marginTop={{ lg: "10", md: "5", sm: "5", base: "5" }}
          >
            {/* Header and Toggle Buttons */}
            <Flex
              direction={{ base: "column", md: "row" }}
              justify="space-between"
              align="center"
              wrap="wrap"
              gap={4}
            >
              <Header
                title={`Ethereum Improvement Proposal - [${data.length}]`}
                subtitle="Meta, Informational, Standard Track - Core, Interface, Networking."
              />

              {/* OtherBox Full Width */}
              <Box className="w-full mt-6">
                <OtherBox type="EIPs" />
              </Box>
              <ButtonGroup size="md" isAttached>
                <Button
                  colorScheme="blue"
                  variant={selected === "type" ? "solid" : "outline"}
                  onClick={() => setSelected("type")}
                  flex="1"
                >
                  Type
                </Button>
                <Button
                  colorScheme="blue"
                  variant={selected === "status" ? "solid" : "outline"}
                  onClick={() => setSelected("status")}
                  flex="1"
                >
                  Status
                </Button>
              </ButtonGroup>
            </Flex>
            <Box display={{ base: "block", md: "block", lg: "none" }} className={"w-full pt-10"}>
              <SearchBox />
            </Box>


            <Box className="w-full flex flex-col gap-5 pt-8" id="graphs">

              {/* AllChart - Full Width Below Donut */}
              <Box className="w-full overflow-hidden">
                <Box className="w-full h-full">
                  {selected === "status" ? (
                    <AllChart3 type="EIP" />
                  ) : (
                    <AllChart type="EIP" />
                  )}
                </Box>
              </Box>

              {/* Donut Chart - Full Width on Top */}
              <Box className="w-full  overflow-hidden">
                <Box className="w-full h-full">
                  {selected === "status" ? (
                    <EIPStatusDonut />
                  ) : (
                    <EIPTypeDonut />
                  )}
                </Box>
              </Box>
            </Box>



            <Box px={{ base: 4, md: 8 }} py={6} maxW="6xl" mx="auto">

              {/* Show heading AND dropdown ONLY when selected === 'type' */}
              {selected === "type" && (
                <>
                  <Text fontSize="2xl" fontWeight="bold" textAlign="center" color="blue.500">
                    Select Category or Type to View EIP Stats
                  </Text>

                  <Box display="flex" justifyContent="center" my={4}>
                    <Select
                      maxW="320px"
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
                  </Box>
                </>
              )}

              <Box pt={12}>
                {selected !== "status" && (
                  <SimpleGrid
                    columns={{ base: 1, md: 3 }}
                    spacing={6}
                    pt={12}
                    alignItems="stretch"
                  >
                    <GridItem colSpan={{ base: 1, md: 2 }}>
                      <Box
                        minH="100%"
                        h="full"
                        display="flex"
                        flexDirection="column"
                        borderRadius="xl"
                        bg="gray.50"
                        p={4}
                      >
                        <TypeGraphs selected={selectedInner} />
                      </Box>
                    </GridItem>
                    <GridItem colSpan={{ base: 1, md: 1 }}>
                      <Box
                        minH="100%"
                        h="full"
                        display="flex"
                        flexDirection="column"
                        borderRadius="xl"
                        bg="gray.50"
                        p={4}
                      >
                        <CatTable2 dataset={data4} cat="All" status={selectedInner} />
                      </Box>
                    </GridItem>
                  </SimpleGrid>
                )}
              </Box>
            </Box>




            <Box paddingBottom={{ lg: "5", md: "5", sm: "5", base: "5" }}>
              {selected === "status" && (
                <>
                  {/* AreaStatus Section */}
                  <Box paddingY="8">
                    <Text id="draftvsfinal" fontSize="3xl" fontWeight="bold" color="#A020F0">
                      Draft vs Final (Over the Years)
                    </Text>
                    <AreaStatus type="EIPs" />
                  </Box>

                  {/* Status-specific charts only shown when `selected === "status"` */}
                  <Box px={{ base: 4, md: 8 }} py={6} maxW="6xl" mx="auto">
                    {selected === "status" && (
                      <>
                        <Text fontSize="2xl" fontWeight="bold" textAlign="center" color="blue.500">
                          EIP Status Dashboard
                        </Text>

                        <Box display="flex" justifyContent="center" my={4}>
                          <Select
                            maxW="320px"
                            value={selectedStatusInner}
                            onChange={(e) => setSelectedStatusInner(e.target.value)}
                            borderColor="blue.400"
                            _hover={{ borderColor: "blue.500" }}
                            focusBorderColor="blue.500"
                          >
                            {["Draft", "Review", "Last Call", "Living", "Final", "Stagnant", "Withdrawn"].map((status) => (
                              <option key={status} value={status}>
                                {status} ({data.filter((item) => item.status === status).length})
                              </option>
                            ))}
                          </Select>
                        </Box>

                        <Box pt={8}>
                          <SimpleGrid
                            columns={{ base: 1, md: 3 }}
                            spacing={6}
                            alignItems="stretch"
                            width="100%"
                          >
                            {/* Chart takes 2/3 width on md+ screens */}
                            <GridItem colSpan={{ base: 1, md: 2 }}>
                              <Box
                                w="100%"
                                h="full"
                                display="flex"
                                flexDirection="column"
                                borderRadius="xl"
                                bg="gray.50"
                                p={4}
                              >
                                <StackedColumnChart
                                  status={selectedStatusInner}
                                  type="EIPs"
                                  dataset={data2}
                                  showDownloadButton={false}
                                />
                              </Box>
                            </GridItem>

                            {/* Table takes 1/3 width on md+ screens */}
                            <GridItem colSpan={{ base: 1, md: 1 }}>
                              <Box
                                h="full"
                                display="flex"
                                flexDirection="column"
                                borderRadius="xl"
                                bg="gray.50"
                                p={4}
                                width="100%"
                              >
                                <CatTable
                                  dataset={data4}
                                  cat="All"
                                  status={selectedStatusInner}
                                />
                              </Box>
                            </GridItem>
                          </SimpleGrid>
                        </Box>

                      </>
                    )}
                  </Box>



                </>
              )}
            </Box>

          </Box>

          <Box
            paddingBottom={{ lg: "10", sm: "10", base: "10" }}
            marginX={{ lg: "40", md: "2", sm: "2", base: "2" }}
            paddingX={{ lg: "10", md: "5", sm: "5", base: "5" }}
          // marginTop={{ lg: "2", md: "2", sm: "", base: "2" }}
          >
            {selected === "status" ? (
              <>
                <Box className="w-full mt-6">
                  <EipTable dataset={data4} cat="All" status="All" />
                </Box>
              </>
            ) : (
              <Box className="w-full mt-6">
                <EipTable dataset={data4} cat="All" status="All" />
              </Box>
            )}
            <Box
              bg={useColorModeValue("blue.50", "gray.700")} // Background color for the box
              color="black" // Text color
              borderRadius="md" // Rounded corners
              padding={4} // Padding inside the box
              marginTop={4} // Margin above the box
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
      )
      }
    </AllLayout >
  );
};

export default Type;