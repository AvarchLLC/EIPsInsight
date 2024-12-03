import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import { 
  Box, 
  Grid, 
  useColorModeValue, 
  Text, 
  Heading, 
  useDisclosure,
  IconButton,
  Flex,
  Collapse,
} from "@chakra-ui/react";

import AllLayout from "@/components/Layout";
import { motion } from "framer-motion";
import LoaderComponent from "@/components/Loader";

import StackedColumnChart from "@/components/DraftBarChart";
import NextLink from "next/link";

import {ChevronUpIcon, ChevronDownIcon } from "@chakra-ui/icons";

import InsightsAllStats from "@/components/InsitghtAllstats";

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
    repo: string;
  }[];
}

interface APIData {
  erc: StatusChange[];
  eip: StatusChange[];
  rip: StatusChange[];
}

interface MappedDataItem {
  category: string;
  date: string;
  value: number;
}

interface EIP {
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

function getMonthName(monthNumber: number): string {
  const date = new Date();
  date.setMonth(monthNumber - 1); // Subtract 1 since months are zero-mdd in JavaScript
  const monthName = date.toLocaleString("default", { month: "long" });
  return monthName;
}

const Month = () => {
  const [data, setData] = useState<EIP[]>([]);
  const path = usePathname();

  const { isOpen: showDropdown, onToggle: toggleDropdown } = useDisclosure();
  const [show, setShow] = useState(false);

  const toggleCollapse = () => setShow(!show);

  let year = "";
  let month = "";

  if (path) {
    const pathParts = path.split("/");
    year = pathParts[2];
    month = pathParts[3];
  }

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulating a loading delay
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    // Cleanup function
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/new/graphsv2`);
        const jsonData = await response.json();
        console.log("rip data:",jsonData.rip);
        setData(jsonData.eip.concat(jsonData.erc.concat(jsonData.rip)));
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  let filteredData1 = data.filter((item) => item.status === "Draft");
  let filteredData2 = data.filter((item) => item.status === "Review");
  let filteredData3 = data.filter((item) => item.status === "Last Call");
  let filteredData4 = data.filter((item) => item.status === "Living");
  let filteredData5 = data.filter((item) => item.status === "Final");
  let filteredData6 = data.filter((item) => item.status === "Stagnant");
  let filteredData7 = data.filter((item) => item.status === "Withdrawn");


  const bg = useColorModeValue("#f6f6f7", "#171923");
  const prevMonth = Number(month) - 1;
  const prevMonthName = getMonthName(prevMonth);

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
            <LoaderComponent />
          </motion.div>
        </Box>
      ) : (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Box
              paddingBottom={{ lg: "5", sm: "5", base: "5" }}
              marginX={{ lg: "40", md: "2", sm: "2", base: "2" }}
              paddingX={{ lg: "10", md: "5", sm: "5", base: "5" }}
              marginTop={{ lg: "10", md: "5", sm: "5", base: "5" }}
            >
              <NextLink href={`/insight/${year}/${month}`}>
                <Header title={getMonthName(Number(month))} subtitle={year} />
              </NextLink>
              <br/>
              <Box
      pl={4}
      bg={useColorModeValue("blue.50", "gray.700")}
      borderRadius="md"
      pr="8px"
      pt="3px"
      marginBottom={5}
    >

    <Flex justify="space-between" align="center">
        <Heading
          as="h3"
          size="lg"
          marginBottom={4}
          color={useColorModeValue("#3182CE", "blue.300")}
        >
          EIPS Insight FAQ
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
    <Text
      fontSize="md"
      marginBottom={2}
      color={useColorModeValue("gray.800", "gray.200")}
    >
      <strong>Insight Summary:</strong> The numbers shown in the table represent the status changes or new drafts that appeared during a specific month. For a detailed view of this data, simply click on the numbers.
    </Text>

    <Text
      fontSize="md"
      marginBottom={2}
      color={useColorModeValue("gray.800", "gray.200")}
    >
      <strong>Graph Breakdown:</strong> Each graph focuses on a specific status, such as "Draft" or "Final." Within each status, the columns show the data divided by individual categories, giving you a clear breakdown of how many EIPs from each category transitioned to that status.
      </Text>
      </Collapse>
  </Box>

<InsightsAllStats/>



              {/* Defining the stats table here */}
              {/* <InsightStats/> */}

              <Text
                fontSize="3xl"
                fontWeight="bold"
                color="blue.400"
                paddingTop={8}
              >
                Draft
              </Text>

              <Box paddingTop={"8"}>
                <StackedColumnChart dataset={filteredData1} status="Draft" />
              </Box>
              <Text
                fontSize="3xl"
                fontWeight="bold"
                color="blue.400"
                paddingTop={8}
              >
                Review
              </Text>
              <Box paddingY={"8"}>
                <StackedColumnChart dataset={filteredData2} status="Review"/>
              </Box>

              <Text
                fontSize="3xl"
                fontWeight="bold"
                color="blue.400"
                paddingTop={8}
              >
                Last Call
              </Text>
              <Box paddingY={"8"}>
                <StackedColumnChart dataset={filteredData3} status="Last Call"/>
              </Box>

              <Text
                fontSize="3xl"
                fontWeight="bold"
                color="blue.400"
                paddingTop={8}
              >
                Living
              </Text>
              <Box paddingY={"8"}>
                <StackedColumnChart dataset={filteredData4} status="Living"/>
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
                <StackedColumnChart dataset={filteredData5} status="Final"/>
              </Box>

              <Text
                fontSize="3xl"
                fontWeight="bold"
                color="blue.400"
                paddingTop={8}
              >
                Stagnant
              </Text>
              <Box paddingY={"8"}>
                <StackedColumnChart dataset={filteredData6} status="Stagnant"/>
              </Box>

              <Text
                fontSize="3xl"
                fontWeight="bold"
                color="blue.400"
                paddingTop={8}
              >
                Withdrawn
              </Text>
              <Box paddingY={"8"}>
                <StackedColumnChart dataset={filteredData7} status="Withdrawn"/>
              </Box>
            </Box>
           
          </motion.div>
        </>
      )}

    </AllLayout>
  );
};

export default Month;
