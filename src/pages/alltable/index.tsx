import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Box, Button, Spinner } from "@chakra-ui/react";
import { DownloadIcon } from "@chakra-ui/icons";

import AllLayout from "@/components/Layout";
import FlexBetween from "@/components/FlexBetween";
import Header from "@/components/Header";
import Table from "@/components/Table";
import AreaC from "@/components/AreaC";
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

const AllTable = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<EIP[]>([]); // Set initial state as an empty array
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/new/all`);
        console.log(response);
        const jsonData = await response.json();
        setData(jsonData.eip.concat(jsonData.erc));
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
          <Box
            paddingBottom={{ md: "10", base: "10" }}
            marginX={{ md: "40", base: "2" }}
            paddingX={{ md: "10", base: "5" }}
            marginTop={{ md: "10", base: "5" }}
          >
            <FlexBetween>
              <Header
                title={`All EIPs & ERCs - [ ${data.length} ]`}
                subtitle=""
              />
            </FlexBetween>
            <Table type="Total" />
            {/* <AreaC type={"EIPs"} /> */}
          </Box>
        </motion.div>
      )}
    </AllLayout>
  );
};

export default AllTable;
