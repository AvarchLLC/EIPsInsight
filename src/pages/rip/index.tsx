import AllLayout from "@/components/Layout";
import { Box, Button, Grid, Text, useColorModeValue, IconButton, Flex, Collapse, Heading, useDisclosure, Link as LI, ButtonGroup, GridItem, Select, SimpleGrid, Link, useToast } from "@chakra-ui/react";
import FlexBetween from "@/components/FlexBetween";
import Header from "@/components/Header";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import LoaderComponent from "@/components/Loader";
import SearchBox from "@/components/SearchBox";
import RIPStatusDonut from "@/components/RIPStatusDonut";
import RIPTypeDonut from "@/components/RIPTypeDonut";
import StackedColumnChart from "@/components/StackedBarChart3";
import CBoxStatus from "@/components/CBoxStatus4";
import AllChart from "@/components/AllChart";
import AllChart3 from "@/components/AllChart3";
import AreaC from "@/components/AreaC";
import RIPStatusGraph from "@/components/RIPStatusGraph";
import OtherBox from "@/components/OtherStats";
import { ChevronDownIcon, CopyIcon } from "@chakra-ui/icons";
import { ChevronUpIcon } from "@chakra-ui/icons";
import RipCatTable from "@/components/RipCatTable";
import AreaStatus from "@/components/AreaStatus";
import CatTable from "@/components/CatTable";
import CatTable2 from "@/components/CatTable2";
import NextLink from "next/link";
import RipTable from "@/components/RipTable";
import { useRouter } from "next/router";

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
const Status_OPTIONS = ["Draft", "Review", "Last Call", "Living", "Final", "Stagnant", "Withdrawn"];


const RIP = () => {
  const [data, setData] = useState<EIP[]>([]);
  const [data4, setData4] = useState<EIP[]>([]);
  const [data2, setData2] = useState<APIResponse>({ eip: [], erc: [], rip: [] });
  const [data3, setData3] = useState<Data>({ eip: [], erc: [], rip: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [selected, setSelected] = useState<"status" | "type">("type");
  const [selectedStatusInner, setSelectedStatusInner] = useState(Status_OPTIONS[0]);
  const router = useRouter();
  const basePath = typeof window !== "undefined" ? window.location.origin : "";
  const toast = useToast();
  const handleCopyOverviewChart = () => {
    const url = `${window.location.origin}/rip?view=${selected}#charts`;
    navigator.clipboard.writeText(url);
    toast({
      title: "Link copied!",
      description: `Shared view for ${selected === "status" ? "Status Chart" : "Type Chart"}`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const handleCopyStatusDetail = () => {
    const url = `${window.location.origin}/rip?view=status&status=${encodeURIComponent(selectedStatusInner)}#status-graphs`;
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
    const url = `${window.location.origin}/rip?view=status#draftvsfinal`;
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
        console.log(response);
        let jsonData = await response.json();
        jsonData.rip?.forEach((item: EIP) => {
          if (item.eip === "7859") {
            item.status = "Draft"; // Update the status
          }
        });
        setData(jsonData.rip);
        setData4(jsonData.rip);

        setIsLoading(false); // Set loader state to false after data is fetched
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false); // Set loader state to false even if an error occurs
      }
    };

    fetchData();
  }, []);




  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/new/graphsv2`);
        let jsonData = await response.json();
        setData2(jsonData);
        console.log("check data:", jsonData);
        setData3(jsonData);
        setIsLoading(false); // Set loader state to false after data is fetched
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false); // Set loader state to false even if an error occurs
      }
    };

    fetchData();
  }, []);

  const { isOpen: showDropdown, onToggle: toggleDropdown } = useDisclosure();

  const [show, setShow] = useState(false);

  const bg = useColorModeValue("#f6f6f7", "#171923");

  useEffect(() => {
    // Simulating a loading delay
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    // Cleanup function
    return () => clearTimeout(timeout);
  }, []);

  const toggleCollapse = () => setShow(!show);


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

            <Flex
              direction={{ base: "column", md: "row" }} // Stack on smaller screens, horizontal on larger screens
              justify="space-between"
              align="center"
              wrap="wrap" // Enable wrapping for responsiveness
              gap={4} // Add spacing between wrapped elements
            >
              {/* Header Section */}
              <Header
                title={`Rollup Improvement Proposal - [ ${data.length} ]`}
                subtitle={
                  <Flex align="center" gap={2} flexWrap="wrap">
                    <Text>
                      A Rollup Improvement Proposal (RIP) is a formal document that outlines new features, processes, or optimizations for rollup solutions in the Ethereum ecosystem.                    </Text>
                    <Button
                      size="sm"
                      colorScheme="blue"
                      variant="link"
                      as={Link}
                      href="/FAQs/RIP"
                    >
                      Learn More
                    </Button>
                  </Flex>
                }
              />

              {/* OtherBox Full Width */}
              <Box className="w-full mt-6">
                <OtherBox type="RIPs" />
              </Box>

              {/* Toggle Buttons */}
              <ButtonGroup size="md" isAttached>
                <Button
                  colorScheme="blue"
                  variant={selected === "type" ? "solid" : "outline"}
                  onClick={() => {
                    setSelected("type");
                    router.push("?view=type", undefined, { shallow: true });
                  }}
                >
                  Type
                </Button>
                <Button
                  colorScheme="blue"
                  variant={selected === "status" ? "solid" : "outline"}
                  onClick={() => {
                    setSelected("status");
                    router.push("?view=status", undefined, { shallow: true });
                  }}
                >
                  Status
                </Button>
              </ButtonGroup>
            </Flex>
            <br />
            <Box
              pl={4}
              mt={1}
              bg={useColorModeValue("blue.50", "gray.700")}
              borderRadius="md"
              pr="8px"
            // marginBottom={2}
            >
              <Flex justify="space-between" align="center">
                <Heading
                  as="h3"
                  size="lg"
                  marginBottom={2}
                  mt={1}
                  color={useColorModeValue("#3182CE", "blue.300")}
                >
                  RIPs FAQ
                </Heading>
                <Box
                  bg="blue" // Gray background
                  borderRadius="md" // Rounded corners
                  padding={2} // Padding inside the box
                >
                  <IconButton
                    onClick={toggleCollapse}
                    icon={show ? <ChevronUpIcon boxSize={8} color="white" /> : <ChevronDownIcon boxSize={8} color="white" />}
                    variant="ghost"
                    mt={1}
                    h="24px" // Smaller height
                    w="20px"
                    aria-label="Toggle Instructions"
                    _hover={{ bg: 'blue' }} // Maintain background color on hover
                    _active={{ bg: 'blue' }} // Maintain background color when active
                    _focus={{ boxShadow: 'none' }} // Remove focus outline

                  />
                </Box>


              </Flex>

              <Collapse in={show}>
                <Heading
                  as="h4"
                  size="md"
                  marginBottom={4}
                  color={useColorModeValue("#3182CE", "blue.300")}
                >
                  What is a Rollup Improvement Proposal (RIP)?
                </Heading>
                <Text
                  fontSize="md"
                  marginBottom={2}
                  color={useColorModeValue("gray.800", "gray.200")}
                  className="text-justify"
                >
                  A Rollup Improvement Proposal (RIP) is a formal document that outlines new features, processes, or optimizations for rollup solutions in the Ethereum ecosystem. RIPs act as specifications to improve rollups, enhance interoperability, and standardize development processes.

                  All RIPs are optional. RIPs are and will always remain optional standards for Rollups and participants in the larger EVM ecosystem.</Text>
                {/* <br/> */}
                <Heading
                  as="h4"
                  size="md"
                  marginBottom={4}
                  color={useColorModeValue("#3182CE", "blue.300")}
                >
                  Why are RIPs Important?
                </Heading>
                <Text
                  fontSize="md"
                  marginBottom={2}
                  color={useColorModeValue("gray.800", "gray.200")}
                  className="text-justify"
                >
                  A Rollup Improvement Proposal (RIP) is a formal document that outlines new features, processes, or optimizations for rollup solutions in the Ethereum ecosystem. RIPs act as specifications to improve rollups, enhance interoperability, and standardize development processes.

                  All RIPs are optional. RIPs are and will always remain optional standards for Rollups and participants in the larger EVM ecosystem.</Text>
                {/* <br/> */}
                <Text fontSize="md" className="text-md text-left text-justify" mt={4} textAlign="justify">
                  RIPs help coordinate technical improvements for rollups in a transparent, collaborative way. They:
                </Text>
                <ul className="list-disc list-inside space-y-2 text-md text-left text-justify">
                  <li>Propose new features and optimizations.</li>
                  <li>Collect community feedback on rollup-related issues.</li>
                  <li>Serve as a historical record of design decisions.</li>
                  <li>Help rollups track progress, especially for multi-client implementations.</li>
                </ul>

                <Box mt={2}>
                  <LI
                    href="/FAQs/RIP"
                    fontSize="md"
                    color="blue.500"
                    fontWeight="semibold"
                    _hover={{ textDecoration: 'underline' }}
                  >
                    Continue Reading {'>>'}
                  </LI>
                </Box>
                <br />
              </Collapse>

            </Box>

            <Box display={{ base: "block", md: "block", lg: "none" }} className="w-full pt-4">
              <SearchBox />
            </Box>

            <Box className="w-full flex flex-col gap-5 pt-8" id="graphs">
              <Box id="charts" className="w-full overflow-hidden">
                <Box display="flex" justifyContent="space-between" alignItems="center" px={4} pb={2}>
                  <Text fontSize="xl" fontWeight="bold">
                    {selected === "status" ? "Status Chart" : "Type Chart"}
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
                    <AllChart3 type="RIP" />
                  ) : (
                    <AllChart type="RIP" />
                  )}
                </Box>
              </Box>

              {/* Donut Chart - Full Width on Top */}
              <Box className="w-full  overflow-hidden">
                <Box className="w-full h-full">
                  {selected === "status" ? (
                    <RIPStatusDonut />
                  ) : (
                    <RIPTypeDonut />
                  )}
                </Box>
              </Box>
            </Box>

            {/* <Box paddingTop={8}>
          {selected === "status" ? (
           <></>
          ) : (
            <RIPStatusGraph />
          )}
    </Box> */}
            <br />

            {selected === "status" && (
              <Box paddingY="8" id="draftvsfinal">
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Text fontSize="3xl" fontWeight="bold" color="#A020F0">
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
                </Box>
                <AreaStatus type="RIPs" />
              </Box>
            )}

            <Box px={{ base: 4, md: 8 }} py={6} maxW="6xl" mx="auto" id="status-graphs">
              {selected === "status" && (
                <>
                  {/* Header and Dropdown to select status */}
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                    <Text fontSize="2xl" fontWeight="bold" textAlign="center" color="blue.500">
                      Select RIP Status to View Stats
                    </Text>
                    <Button
                      onClick={handleCopyStatusDetail}
                      size="sm"
                      leftIcon={<CopyIcon />}
                      colorScheme="blue"
                      variant="ghost"
                    >
                      Copy Link
                    </Button>
                  </Box>

                  <Box display="flex" justifyContent="center" mb={6}>
                    <Select
                      maxW="320px"
                      value={selectedStatusInner}
                      onChange={(e) => setSelectedStatusInner(e.target.value)}
                      borderColor="blue.400"
                      _hover={{ borderColor: "blue.500" }}
                      focusBorderColor="blue.500"
                    >
                      {["Draft", "Living", "Final"].map((status) => (
                        <option key={status} value={status}>
                          {status} ({data.filter((item) => item.status === status).length})
                        </option>
                      ))}
                    </Select>
                  </Box>

                  {/* Grid with StackedColumnChart and CatTable */}
                  <Box pt={8}>
                    <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} alignItems="stretch">
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
                          <StackedColumnChart
                            type="RIPs"
                            status={selectedStatusInner}
                            dataset={data2}
                          />
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

            {selected === "status" ? (
              <Box className="w-full mt-6" id="status-tables">
                <RipTable dataset={data4} cat="All" status="All" />
              </Box>
            ) : (
              <Box className="w-full mt-6" id="type-tables">
                <RipTable dataset={data4} cat="All" status="All" />
              </Box>
            )}

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
                <LI href="/erc" color="blue" isExternal>
                  ERCs
                </LI>.
              </Text>
            </Box>
            {/* </Box> */}

          </Box>

        </motion.div>

      )}
    </AllLayout>
  );
};

export default RIP;
