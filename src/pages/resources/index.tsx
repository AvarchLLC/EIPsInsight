import React from 'react';
import AllLayout from "@/components/Layout";
import Resources from "@/components/Resource";
import FeaturedVideos from "@/components/FeaturedVideos";
import {useColorModeValue} from "@chakra-ui/react";

const Index = () => {
  const bg = useColorModeValue("#f6f6f7", "#171923");
    return (
        <AllLayout>
            <Resources title="Featured Videos" summary="by EtherWorld" link='https://www.youtube.com/watch?v=fwxkbUaa92w'/>
        </AllLayout>
    );
}
export default Index;