import React, { useState, useEffect } from "react";
import CloseableAdCard from "@/components/CloseableAdCard";
import Table from "@/components/Table";
import { Box } from "@chakra-ui/react";
import Header from "@/components/Header";
import AllLayout from "@/components/Layout";

const EIPTable = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/new/all`);
        const jsonData = await response.json();
        setData(jsonData.eip);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  });
  return (
    <>
      <AllLayout>
        <Box
          paddingBottom={{ lg: "10", sm: "10", base: "10" }}
          marginX={{ lg: "40", md: "2", sm: "2", base: "2" }}
          paddingX={{ lg: "10", md: "5", sm: "5", base: "5" }}
          marginTop={{ lg: "10", md: "5", sm: "5", base: "5" }}
        >
          <Header title={`EIP - [${data?.length}]`} subtitle="" description="" />
          
          {/* EtherWorld Advertisement */}
          <Box my={6}>
            {/* <CloseableAdCard /> */}
          </Box>
          
          <Table type="EIP" />
        </Box>
      </AllLayout>
    </>
  );
};

export default EIPTable;
