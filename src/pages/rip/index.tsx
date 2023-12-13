import React from "react";
import AllLayout from "@/components/Layout";
import { Box, Text } from "@chakra-ui/react";
import OtherBox from "@/components/OtherStats";
import FlexBetween from "@/components/FlexBetween";
import Header from "@/components/Header";
import SearchBox from "@/components/SearchBox";
const RIP = () => {
  return (
    <>
      <AllLayout>
        <Box
          paddingBottom={{ lg: "10", sm: "10", base: "10" }}
          marginX={{ lg: "40", md: "2", sm: "2", base: "2" }}
          paddingX={{ lg: "10", md: "5", sm: "5", base: "5" }}
          marginTop={{ lg: "10", md: "5", sm: "5", base: "5" }}
        >
          <FlexBetween>
            <Header title={`Rolling Improvement Proposal`} subtitle="" />
          </FlexBetween>
          <Box className={"w-full pt-10"}>
            <SearchBox />
          </Box>
          <Text className="text-3xl text-center justify-center items-center pt-8">
            No Rolling Improvement Proposals have been merged yet
          </Text>
          <Box className="grid grid-cols-3 pt-8 gap-x-5">
            <Box bg={"#171923"} borderRadius={"0.55rem"}></Box>
            <Box bg={"#171923"} borderRadius={"0.55rem"}></Box>
            <OtherBox type="RIPs" />
          </Box>
        </Box>
      </AllLayout>
    </>
  );
};

export default RIP;
