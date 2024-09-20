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
import CBoxStatus from "@/components/CBoxStatus";
import Donut from "@/components/Donut";
import DonutStatus from "@/components/DonutStatus";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import LoaderComponent from "@/components/Loader";
import StackedColumnChart from "@/components/StackedBarChart";
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

const Status = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<EIP[]>([]);

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
            <AreaC type={"EIPs"} />

            <Text fontSize="3xl" fontWeight="bold" color="#30A0E0">
              Draft -{" "}
              <NextLink href={`/tableStatus/Draft`}>
                {" "}
                [ {data.filter((item) => item.status === "Draft").length} ]
              </NextLink>
            </Text>

            <Box>
              <StackedColumnChart type={"EIPs"} status="Draft" />
              <CBoxStatus status={"Draft"} type={"EIPs"} />
            </Box>

            <Text fontSize="3xl" fontWeight="bold" color="#30A0E0">
              Review -{" "}
              <NextLink href={`/tableStatus/Review`}>
                {" "}
                [ {data.filter((item) => item.status === "Review").length} ]
              </NextLink>
            </Text>

            <Box>
              <StackedColumnChart type={"EIPs"} status="Review" />
              <CBoxStatus status={"Review"} type={"EIPs"} />
            </Box>

            <Text fontSize="3xl" fontWeight="bold" color="#30A0E0">
              Last Call -
              <NextLink href={`/tableStatus/LastCall`}>
                {" "}
                [ {
                  data.filter((item) => item.status === "Last Call").length
                } ]{" "}
              </NextLink>
            </Text>

            <Box>
              <StackedColumnChart type={"EIPs"} status="Last Call" />
              <CBoxStatus status={"Last Call"} type={"EIPs"} />
            </Box>

            <Text fontSize="3xl" fontWeight="bold" color="#30A0E0">
              Living -
              <NextLink href={`/tableStatus/Living`}>
                {" "}
                [ {data.filter((item) => item.status === "Living").length} ]
              </NextLink>
            </Text>

            <Box>
              <StackedColumnChart type={"EIPs"} status="Living" />
              <CBoxStatus status={"Living"} type={"EIPs"} />
            </Box>

            <Text fontSize="3xl" fontWeight="bold" color="#30A0E0">
              Stagnant -
              <NextLink href={`/tableStatus/Stagnant`}>
                {" "}
                [ {
                  data.filter((item) => item.status === "Stagnant").length
                } ]{" "}
              </NextLink>
            </Text>

            <Box>
              <StackedColumnChart type={"EIPs"} status="Stagnant" />
              <CBoxStatus status={"Stagnant"} type={"EIPs"} />
            </Box>

            <Text fontSize="3xl" fontWeight="bold" color="#30A0E0">
              Withdrawn -
              <NextLink href={`/tableStatus/Withdrawn`}>
                {" "}
                [ {
                  data.filter((item) => item.status === "Withdrawn").length
                } ]{" "}
              </NextLink>
            </Text>

            <Box>
              <StackedColumnChart type={"EIPs"} status="Withdrawn" />
              <CBoxStatus status={"Withdrawn"} type={"EIPs"} />
            </Box>
          </Box>
        </motion.div>
      )}
    </AllLayout>
  );
};

export default Status;
