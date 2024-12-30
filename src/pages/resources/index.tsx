import React from "react";
import AllLayout from "@/components/Layout";
import Resources from "@/components/Resources2";
import FeaturedVideos from "@/components/FeaturedVideos";
import { useColorModeValue } from "@chakra-ui/react";

const Index = () => {
  const bg = useColorModeValue("#f6f6f7", "#171923");
  return (
    <AllLayout>
      <Resources />
    </AllLayout>
  );
};
export default Index;
