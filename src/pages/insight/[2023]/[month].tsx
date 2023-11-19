import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import { Box, Grid, useColorModeValue, Text } from "@chakra-ui/react";
import CustomBox from "@/components/CustomBox";
import OtherBox from "@/components/OtherStats";
import { PieC } from "@/components/InPie";
import AllLayout from "@/components/Layout";
import { motion } from "framer-motion";
import LoaderComponent from "@/components/Loader";
import EmptyInsight from "@/components/EmptyInsight";
import Banner from "@/components/NewsBanner";
import StackedColumnChart from "@/components/DraftBarChart";
interface StatusChange {
  _id: string;
  count: number;
  statusChanges: {
    [key: string]: any; // Add index signature here
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
  }[];
}

interface APIData {
  erc: StatusChange[];
  eip: StatusChange[];
}

const getStatus = (status: string) => {
  switch (status) {
    case "Draft":
      return "Draft";
    case "Final" || "Accepted" || "Superseded":
      return "Final";
    case "Last Call":
      return "Last Call";
    case "Withdrawn" || "Abandoned" || "Rejected":
      return "Withdrawn";
    case "Review":
      return "Review";
    case "Living" || "Active":
      return "Living";
    case "Stagnant":
      return "Stagnant";
    default:
      return "Final";
  }
};

function getMonthName(monthNumber: number): string {
  const date = new Date();
  date.setMonth(monthNumber - 1); // Subtract 1 since months are zero-mdd in JavaScript
  const monthName = date.toLocaleString("default", { month: "long" });
  return monthName;
}

const Month = () => {
  const [data, setData] = useState<APIData>(); // Set initial state as an empty array
  const [type, setType] = useState("EIPs"); // Set initial state as an empty array
  const path = usePathname();
  const [isResEmpty, setIsResEmpty] = useState(false);

  let year = "";
  let month = "";

  if (path) {
    const pathParts = path.split("/");
    year = pathParts[2];
    month = pathParts[3];
  }

  const [typeData, setTypeData] = useState<StatusChange[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/new/statusChanges/${year}/${month}`);
        const jsonData = await response.json();
        setData(jsonData);
        if (type === "EIPs" && jsonData.eip) {
          setTypeData(jsonData.eip);
        } else if (type === "ERCs" && jsonData.erc) {
          setTypeData(jsonData.erc);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [year, month]);

  useEffect(() => {
    if (typeData.length === 0) {
      setIsResEmpty(true);
    } else {
      setIsResEmpty(false);
    }
  });
  let total = 0;
  typeData.map((item) => {
    total = total + item.count;
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulating a loading delay
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    // Cleanup function
    return () => clearTimeout(timeout);
  }, []);
  const bg = useColorModeValue("#f6f6f7", "#171923");
  console.log(typeData);
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
      ) : !isResEmpty ? (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Box
              paddingBottom={{ lg: "10", sm: "10", base: "10" }}
              marginX={{ lg: "40", md: "2", sm: "2", base: "2" }}
              paddingX={{ lg: "10", md: "5", sm: "5", base: "5" }}
              marginTop={{ lg: "10", md: "5", sm: "5", base: "5" }}
            >
              <Header title={getMonthName(Number(month))} subtitle={year} />

              <Box className="flex space-x-12 w-full justify-center items-center text-xl font-semibold">
                <button
                  onClick={() => {
                    setTypeData(data?.eip || []);
                    setType("EIPs");
                  }}
                  className={
                    type === "EIPs" ? "underline underline-offset-4" : ""
                  }
                >
                  EIPs Insight
                </button>
                <button
                  onClick={() => {
                    setTypeData(data?.erc || []);
                    setType("ERCs");
                  }}
                  className={
                    type === "ERCs" ? "underline underline-offset-4" : ""
                  }
                >
                  ERCsInsight
                </button>
              </Box>
              <Grid
                className={"justify-center"}
                paddingBottom={"8"}
                gridTemplateColumns={{ lg: "2fr 2fr", md: "" }}
                gap={"8"}
                paddingY={"8"}
              >
                <Box>
                  <CustomBox
                    data={typeData}
                    per={total}
                    year={year}
                    month={month}
                  />
                </Box>
                <Box>
                  <OtherBox type={type} />
                </Box>
              </Grid>

              <Text
                fontSize="3xl"
                fontWeight="bold"
                color="blue.400"
                paddingTop={8}
              >
                Draft
              </Text>

              <Box paddingTop={"8"}>
                <StackedColumnChart type={type} status="Draft" />
              </Box>
              <Text
                fontSize="3xl"
                fontWeight="bold"
                color="blue.400"
                paddingTop={8}
              >
                Final
              </Text>
              <Box paddingY={"8"}>
                <StackedColumnChart type={type} status="Final" />
              </Box>

              <Grid templateColumns={{ lg: "1fr 1fr 1fr", md: "" }} gap={6}>
                <PieC
                  data={typeData}
                  status="Review"
                  year={year}
                  month={month}
                />
                <PieC
                  data={typeData}
                  status="Draft"
                  year={year}
                  month={month}
                />
                <PieC
                  data={typeData}
                  status="Last Call"
                  year={year}
                  month={month}
                />
              </Grid>
              <PieC data={typeData} status="Final" year={year} month={month} />
              <Grid templateColumns={{ lg: "1fr 1fr 1fr", md: "" }} gap={6}>
                <PieC
                  data={typeData}
                  status="Living"
                  year={year}
                  month={month}
                />
                <PieC
                  data={typeData}
                  status="Stagnant"
                  year={year}
                  month={month}
                />
                <PieC
                  data={typeData}
                  status="Withdrawn"
                  year={year}
                  month={month}
                />
              </Grid>
            </Box>
          </motion.div>
        </>
      ) : (
        <>
          <EmptyInsight />
        </>
      )}
    </AllLayout>
  );
};

export default Month;
