import React from "react";
import AllLayout from "@/components/Layout";
import { Box, Button } from "@chakra-ui/react";
import FlexBetween from "@/components/FlexBetween";
import Header from "@/components/Header";
import { DownloadIcon } from "@chakra-ui/icons";
import Table from "@/components/Table";
import LineChart from "@/components/LineChart";
import TableStatus from "@/components/TableStatus";
import LineStatus from "@/components/LineStatus";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import LoaderComponent from "@/components/Loader";

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
const Meta = () => {
  const [isLoading, setIsLoading] = useState(true);

  const [data, setData] = useState<EIP[]>([]); // Set initial state as an empty array
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
          <Box className="ml-40 mr-40 pl-10 pr-10 mt-10 mb-20">
            <FlexBetween>
              <Header
                title={`Meta - [ ${
                  data.filter((item) => item.type === "Meta").length
                } ]`}
                subtitle="Meta EIPs describe changes to the EIP process, or other non optional changes."
              />
            </FlexBetween>
            <Box mt={2}>
              <p className="text-gray-500 italic">
                * EIP-1 is available both on EIP GitHub and ERC GitHub, so the count can be varied by 1.
              </p>
            </Box>
            <TableStatus cat="Meta" />
            {/* <LineStatus cat="Meta" /> */}
          </Box>
        </motion.div>
      )}
    </AllLayout>
  );
};

export default Meta;
