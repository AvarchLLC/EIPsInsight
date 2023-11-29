import React from "react";
import AllLayout from "@/components/Layout";
import { Box } from "@chakra-ui/react";
import OtherBox from "@/components/OtherStats";
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
          <OtherBox type="RIPs" />
        </Box>
      </AllLayout>
    </>
  );
};

export default RIP;
