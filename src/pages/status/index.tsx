import React from "react";
import AllLayout from "@/components/Layout";
import Header from "@/components/Header";
import {
  Box,
  Grid,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Text,
} from "@chakra-ui/react";
import CBoxStatus from "@/components/CBoxStatus2";
import Donut from "@/components/Donut";
import DonutStatus from "@/components/DonutStatus";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import LoaderComponent from "@/components/Loader";
// import StackedColumnChart from "@/components/StackedBarChart";
import StackedColumnChart from "@/components/DraftBarChart2";
import { PieC } from "@/components/InPie";
import AreaStatus from "@/components/AreaStatus";
import Banner from "@/components/NewsBanner";
import NextLink from "next/link";
import AreaC from "@/components/AreaC";

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

interface APIResponse {
  eip: EIP[];
  erc: EIP[];
  rip: EIP[];
}

const Status = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<EIP[]>([]);

  const [data2, setData2] = useState<APIResponse>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/new/all`);
        const jsonData = await response.json();
        setData2(jsonData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const allData: EIP[] = data2?.eip.concat(data2?.erc.concat(data2?.rip)) || [];

  const dat = [
    {
      status: "Draft",
      value: allData.filter((item) => item.status === "Draft").length,
    },
    {
      status: "Review",
      value: allData.filter((item) => item.status === "Review").length,
    },
    {
      status: "Last Call",
      value: allData.filter((item) => item.status === "Last Call").length,
    },
    {
      status: "Living",
      value: allData.filter((item) => item.status === "Living").length,
    },
    {
      status: "Stagnant",
      value: allData.filter((item) => item.status === "Stagnant").length,
    },
    {
      status: "Withdrawn",
      value: allData.filter((item) => item.status === "Withdrawn").length,
    },
    {
      status: "Final",
      value: allData.filter((item) => item.status === "Final").length,
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/new/alleips`);
        const jsonData = await response.json();
        setData(jsonData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

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
           display={{ lg: "block", md: "block", sm: "block", base: "block" }}
            paddingBottom={{ lg: "10", sm: "10", base: "10" }}
            marginX={{ lg: "40", md: "2", sm: "2", base: "2" }}
            paddingX={{ lg: "10", md: "5", sm: "5", base: "5" }}
            marginTop={{ lg: "10", md: "5", sm: "5", base: "5" }}
          >
            <Header title="Status" subtitle="Your Roadway to Status"></Header>

            <Text
              fontSize="xl"
              fontWeight="bold"
              color="#A020F0"
              paddingTop={"8"}
            >
              Draft vs Final
            </Text>

            <AreaStatus type={"EIPs"} />
            <br/>
            {/* <AreaC type={"EIPs"} /> */}

            <Text fontSize="3xl" fontWeight="bold" color="#30A0E0">
              Draft -{" "}
              <NextLink href={`/tableStatus/Draft`}>
                {" "}
                [ {allData.filter((item) => item.status === "Draft").length} ]
              </NextLink>
            </Text>

            <Box>
              {/* <StackedColumnChart type={"EIPs"} status="Draft" /> */}
              <Box paddingTop={"8"}>
                <StackedColumnChart status="Draft" />
              </Box>
              <CBoxStatus status={"Draft"} />
            </Box>
              
            <br/>
            <Text fontSize="3xl" fontWeight="bold" color="#30A0E0">
              Review -{" "}
              <NextLink href={`/tableStatus/Review`}>
                {" "}
                [ {allData.filter((item) => item.status === "Review").length} ]
              </NextLink>
            </Text>

            <Box>
              {/* <StackedColumnChart type={"EIPs"} status="Review" /> */}
              <Box paddingY={"8"}>
                <StackedColumnChart status="Review" />
              </Box>
              <CBoxStatus status={"Review"}/>
            </Box>
            
            <br/>
            <Text fontSize="3xl" fontWeight="bold" color="#30A0E0">
              Last Call -
              <NextLink href={`/tableStatus/LastCall`}>
                {" "}
                [ {allData.filter((item) => item.status ===  "Last Call").length
                } ]{" "}
              </NextLink>
            </Text>

            <Box>
              {/* <StackedColumnChart type={"EIPs"} status="Last Call" /> */}
              <Box paddingY={"8"}>
                <StackedColumnChart status="Last Call" />
              </Box>
              <CBoxStatus status={"Last Call"} />
            </Box>
            
            <br/>
            <Text fontSize="3xl" fontWeight="bold" color="#30A0E0">
              Living -
              <NextLink href={`/tableStatus/Living`}>
                {" "}
                [ {allData.filter((item) => item.status === "Living").length} ]
              </NextLink>
            </Text>

            <Box>
              {/* <StackedColumnChart type={"EIPs"} status="Living" /> */}
              <Box paddingY={"8"}>
                <StackedColumnChart status="Living" />
              </Box>
              <CBoxStatus status={"Living"} />
            </Box>
            
            <br/>
            <Text fontSize="3xl" fontWeight="bold" color="#30A0E0">
              Final -
              <NextLink href={`/tableStatus/Final`}>
                {" "}
                [ {allData.filter((item) => item.status === "Final").length
                } ]{" "}
              </NextLink>
            </Text>

            <Box>
              {/* <StackedColumnChart type={"EIPs"} status="Stagnant" /> */}
              <Box paddingY={"8"}>
                <StackedColumnChart status="Final" />
              </Box>
              <CBoxStatus status={"Final"}/>
            </Box>

            
            <br/>
            <Text fontSize="3xl" fontWeight="bold" color="#30A0E0">
              Stagnant -
              <NextLink href={`/tableStatus/Stagnant`}>
                {" "}
                [ {allData.filter((item) => item.status === "Stagnant").length
                } ]{" "}
              </NextLink>
            </Text>

            <Box>
              {/* <StackedColumnChart type={"EIPs"} status="Stagnant" /> */}
              <Box paddingY={"8"}>
                <StackedColumnChart status="Stagnant" />
              </Box>
              <CBoxStatus status={"Stagnant"}/>
            </Box>
            
            <br/>
            <Text fontSize="3xl" fontWeight="bold" color="#30A0E0">
              Withdrawn -
              <NextLink href={`/tableStatus/Withdrawn`}>
                {" "}
                [ {allData.filter((item) => item.status ===  "Withdrawn").length
                } ]{" "}
              </NextLink>
            </Text>

            <Box>
              {/* <StackedColumnChart type={"EIPs"} status="Withdrawn" /> */}
              <Box paddingY={"8"}>
                <StackedColumnChart status="Withdrawn" />
              </Box>
              <CBoxStatus status={"Withdrawn"} />
            </Box>
          </Box>
        </motion.div>
      )}
    </AllLayout>
  );
};

export default Status;
