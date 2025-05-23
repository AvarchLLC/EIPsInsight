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
} from "@chakra-ui/react";
import CBoxStatus from "@/components/CBoxStatus";
import StackedColumnChart from "@/components/StackedBarChart";
import AreaStatus from "@/components/AreaStatus";
import NextLink from "next/link";
import EIPStatusDonut from "@/components/EIPStatusDonut";
import EIPTypeDonut from "@/components/EIPTypeDonut";
import AllChart from "@/components/AllChart";
import AllChart3 from "@/components/AllChart3";
import { Button, Heading, ButtonGroup, Flex} from "@chakra-ui/react";
import CatTable from "@/components/CatTable";
import CatTable2 from "@/components/CatTable2";
import StatusGraph from "@/components/Statuschangesgraph";

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
  repo:string;
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
    eips:any[];
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



const Type = () => {
  const [data, setData] = useState<EIP[]>([]);
  const [data4, setData4] = useState<EIP[]>([]); 
  const [data2, setData2] = useState<APIResponse>({eip:[],erc:[],rip:[]});
  const [data3, setData3] = useState<Data>({eip:[],erc:[],rip:[]});
  const [isLoading, setIsLoading] = useState(true); 
  const [selected, setSelected] = useState<"status" | "type">("type");

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
        <Flex
              direction={{ base: "column", md: "row" }} // Stack on smaller screens, horizontal on larger screens
              justify="space-between"
              align="center"
              wrap="wrap" // Enable wrapping for responsiveness
              gap={4} // Add spacing between wrapped elements
            >
              {/* Header Section */}
              <Header
              title={`Ethereum Improvement Proposal - [${data.length}]`}
              subtitle="Meta, Informational, Standard Track - Core, Interface, Networking."
              />

              {/* Toggle Buttons */}
              <ButtonGroup size="md" isAttached>
                <Button
                  colorScheme="blue"
                  variant={selected === "type" ? "solid" : "outline"}
                  onClick={() => setSelected("type")}
                  flex="1" // Equal size buttons
                >
                  Type
                </Button>
                <Button
                  colorScheme="blue"
                  variant={selected === "status" ? "solid" : "outline"}
                  onClick={() => setSelected("status")}
                  flex="1" // Equal size buttons
                >
                  Status
                </Button>
              </ButtonGroup>
        </Flex>

          <Box display={{ base: "block", md: "block", lg:"none" }} className={"w-full pt-10"}>
            <SearchBox />
          </Box>

          <Box className="grid grid-cols-1 lg:grid-cols-3 pt-8 gap-5" id="graphs">
          <Box className="h-fit">
          {selected === "status" ? (
            <EIPStatusDonut />
          ) : (
            <EIPTypeDonut />
          )}
            {/* <EIPStatusDonut /> */}
          </Box>
          <Box className="h-fit">
          {selected === "status" ? (
            <AllChart3 type="EIP" />
          ) : (
            <AllChart type="EIP" />
          )}
          </Box>
          <Box className="h-fit">
            <OtherBox type="EIPs" />
          </Box>
      </Box>


          <Box paddingTop={8}>
          {selected === "status" ? (
           <></>
          ) : (
            <TypeGraphs/>
          )}
          </Box>

          {/* <Box
            id="StatusTimeline"
            mt={2}
            mb={2}
            px={{ base: 2, md: 4, lg: 6 }}
            width="100%"
            maxWidth="100vw"
            overflowX="auto"
          >
            <Text
              fontSize={{ base: '2xl', md: '3xl', lg: '3xl' }}
              fontWeight="bold"
              color="#30A0E0"
              mt={2}
              textAlign="center"
            >
              EIPs Status Timelines
            </Text>
            <br />
            <Flex justifyContent="center" alignItems="center" width="100%">
              <Box width="100%" maxWidth="100%" overflow="hidden">
                <StatusGraph/>
              </Box>
            </Flex>
            <br />
          </Box> */}

          <Box paddingBottom={{ lg: "5", md: "5", sm: "5", base: "5" }}>
            {/* <AreaC type={"EIPs"} /> */}

            {selected === "status" && (
              <Box paddingY="8">
                <Text id="draftvsfinal" fontSize="3xl" fontWeight="bold" color="#A020F0">
                  Draft vs Final (Over the Years)
                </Text>
                <AreaStatus type="EIPs" />
              </Box>
            )}

            {["Draft", "Review", "Last Call", "Living", "Final", "Stagnant", "Withdrawn"].map((status) => (
          <Box key={status} className={"group relative flex flex-col gap-3"} paddingBottom={8}>
            {/* Label Section aligned to the left */}
            <Box className={"flex gap-3"}>
              <Text  id={`${status.toLowerCase().replace(/\s+/g, '') }`} fontSize="3xl" fontWeight="bold" color="#30A0E0">
                {status} -{" "}
                <NextLink href={`/tableStatus/eip/${status}`}>
                  [{data.filter((item) => item.status === status).length}]
                </NextLink>
              </Text>
              <p className={"text-red-700"}>*</p>
              <p className={"hidden group-hover:block text-lg"}>Count as on date</p>
            </Box>
            
            
            {/* Scrollable Charts Grid */}
            <Box overflowX="auto">
              <Grid templateColumns={{ base: "1fr", sm: "1fr", lg: "repeat(2, 1fr)" }} gap={6}>
                <StackedColumnChart type={"EIPs"} status={status} dataset={data2} />
                <CBoxStatus status={status} type={"EIPs"} dataset={data3} />
              </Grid>
            </Box>
          </Box>
        ))}

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
            <CatTable dataset={data4} cat="All" status="Draft" />
            <CatTable dataset={data4} cat="All" status="Final" />
            <CatTable dataset={data4} cat="All" status="Review" />
            <CatTable dataset={data4} cat="All" status="Last Call" />
            <CatTable dataset={data4} cat="All" status="Living" />
            <CatTable dataset={data4} cat="All" status="Withdrawn" />
            <CatTable dataset={data4} cat="All" status="Stagnant" />
          </>
        ) : (
          <>
{["Meta", "Informational", "Core", "Networking", "Interface"].map((status) => (
  <div key={status} id={`${status.toLowerCase()}table`}>
    <CatTable2 dataset={data4} cat="All" status={status} />
  </div>
))}
          </>
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
      )}
    </AllLayout>
  );
};

export default Type;