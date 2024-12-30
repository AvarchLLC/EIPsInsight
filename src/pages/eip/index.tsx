import React from "react";
import AllLayout from "@/components/Layout";
import Header from "@/components/Header";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import LoaderComponent from "@/components/Loader";
import TypeGraphs from "@/components/TypeGraphs";
import FlexBetween from "@/components/FlexBetween";
import SearchBox from "@/components/SearchBox";
import StatusBox from "@/components/StatusBox";
import EIPCatBoxGrid from "@/components/EIPCatBoxGrid";
import Table from "@/components/Table";
import {
  Box,
  Grid,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import CBoxStatus from "@/components/CBoxStatus";
import StackedColumnChart from "@/components/StackedBarChart";
import AreaStatus from "@/components/AreaStatus";
import NextLink from "next/link";
import AreaC from "@/components/AreaC";
import EIPStatusDonut from "@/components/EIPStatusDonut";
import AllChart from "@/components/AllChart";

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

const getCat = (cat: string) => {
  switch (cat) {
    case "standard - networking":
      return "networking";
    case "standard - interface":
      return "interface";
    case "standard - erc":
      return "Interface";
    case "standard - core":
      return "core";
    case "Meta":
      return "meta";
    case "Informational":
      return "informational";
    default:
      return "core";
  }
};

const Type = () => {
  const [data, setData] = useState<EIP[]>([]); // Set initial state as an empty array
  const [data2, setData2] = useState<APIResponse>({eip:[],erc:[],rip:[]});
  const [data3, setData3] = useState<Data>({eip:[],erc:[],rip:[]});
  const [isLoading, setIsLoading] = useState(true); // Loader state
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/new/all`);
        const jsonData = await response.json();
        setData(jsonData.eip);
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
  <FlexBetween>
    <Header
      title={`Ethereum Improvement Proposal - [${data.length}]`}
      subtitle="Meta, Informational, Standard Track - Core, Interface, Networking."
    />
  </FlexBetween>

  <Box display={{ base: "block", md: "block", lg:"none" }} className={"w-full pt-10"}>
    <SearchBox />
  </Box>

  <Box className="grid grid-cols-1 lg:grid-cols-3 pt-8 gap-5">
  <Box>
    <EIPStatusDonut />
  </Box>
  <Box>
    <AllChart type="EIP" />
  </Box>
  <Box className="h-fit">
    <OtherBox type="EIPs" />
  </Box>
</Box>


  <Box paddingTop={8}>
    <TypeGraphs />
  </Box>

  <Box paddingBottom={{ lg: "10", md: "10", sm: "10", base: "10" }}>
    <AreaC type={"EIPs"} />

    <Box paddingY={"8"}>
      <Text fontSize="3xl" fontWeight="bold" color="#A020F0">
        Draft vs Final
      </Text>
      <AreaStatus type={"EIPs"} />
    </Box>

    {["Draft", "Review", "Last Call", "Living", "Final", "Stagnant", "Withdrawn"].map((status) => (
  <Box key={status} className={"group relative flex flex-col gap-3"} paddingBottom={8}>
    {/* Label Section aligned to the left */}
    <Box className={"flex gap-3"}>
      <Text fontSize="3xl" fontWeight="bold" color="#30A0E0">
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


          {/* <Box
            display={{ lg: "none", sm: "block" }}
            paddingBottom={{ lg: "10", sm: "10", base: "10" }}
            marginX={{ lg: "40", md: "2", sm: "2", base: "2" }}
            paddingX={{ lg: "10", md: "5", sm: "5", base: "5" }}
            marginTop={{ lg: "10", md: "5", sm: "5", base: "5" }}
          >
            <Header
              title={`Ethereum Improvement Proposal - [${
                data.filter((item) => item.category !== "ERC").length
              }]`}
              subtitle="Meta, Informational, Standard Track - Core, Interface, Networking."
            ></Header>

            <Box className={"w-full pt-10"}>
              <SearchBox />
            </Box>

            <Box>
              <EIPCatBoxGrid />

              <Box paddingTop={"8"}>
                <Box paddingTop={8}>
                  <StatusBox />
                </Box>
                <Text
                  fontSize="xl"
                  fontWeight="bold"
                  color="#4267B2"
                  paddingTop={"8"}
                >
                  Draft vs Final
                </Text>
                <AreaC type={"EIPs"} />
              </Box>
            </Box>
          </Box> */}
        </motion.div>
      )}
    </AllLayout>
  );
};

export default Type;
