import React from "react";
import EtherWorldAdCard from "@/components/EtherWorldAdCard";
import PlaceYourAdCard from "@/components/PlaceYourAdCard";
import AllLayout from "@/components/Layout";
import Resources from "@/components/Resources3";
import FeaturedVideos from "@/components/FeaturedVideos";
import { useColorModeValue, Box } from "@chakra-ui/react";

const Index = () => {
  const bg = useColorModeValue("#f6f6f7", "#171923");
  return (
    <AllLayout>
      <Resources />
      
      {/* EtherWorld Advertisement */}
      <Box my={6} mx={{ lg: "40", md: "2", sm: "2", base: "2" }} px={{ lg: "10", md: "5", sm: "5", base: "5" }}>
        <EtherWorldAdCard />
      </Box>
      {/* Advertise With Us (subtle placement) */}
      <Box my={6} mx={{ lg: "40", md: "2", sm: "2", base: "2" }} px={{ lg: "10", md: "5", sm: "5", base: "5" }}>
        <PlaceYourAdCard />
      </Box>
    </AllLayout>
  );
};
export default Index;
