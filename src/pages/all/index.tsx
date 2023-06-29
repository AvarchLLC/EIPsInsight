import React, { useState, useEffect } from "react";
import AllLayout from "./AllLayout";
import RootLayout from "@/app/layout";
import { Box, Button, Spinner } from "@chakra-ui/react";
import FlexBetween from "@/components/FlexBetween";
import Header from "@/components/Header";
import Table from "@/components/Table";
import { DownloadIcon } from "@chakra-ui/icons";
import LineChart from "@/components/LineChart";

const All = () => {
  const [isLoading, setIsLoading] = useState(true);

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
      <Box className="ml-40 mr-40 pl-10 pr-10 mt-10">
        <FlexBetween>
          <Header title="All EIPs" subtitle="Your Roadway to All" />
          <Box>
            <Button
              colorScheme="green"
              variant="outline"
              fontSize={"14px"}
              fontWeight={"bold"}
              padding={"10px 20px"}
            >
              <DownloadIcon marginEnd={"1.5"} />
              Download Reports
            </Button>
          </Box>
        </FlexBetween>
        <Table />

        {isLoading ? (
          // Show loading spinner while the content is being loaded
          <Box display="flex" justifyContent="center" alignItems="center" height="200px">
            <Spinner size="xl" color="green.500" />
          </Box>
        ) : (
          // Show the LineChart component when loading is complete
          <LineChart />
        )}
      </Box>
    </AllLayout>
  );
};

export default All;
