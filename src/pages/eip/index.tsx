import React from "react";
import AllLayout from "@/components/Layout";
import Header from "@/components/Header";
import {
  Box,
  Grid,
  Icon,
  Text,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import LoaderComponent from "@/components/Loader";
import TypeG from "@/components/TypeGraphs";
import FlexBetween from "@/components/FlexBetween";
import AreaC from "@/components/AreaStatus";
import SearchBox from "@/components/SearchBox";
import StatusBox from "@/components/StatusBox";
import EIPCatBoxGrid from "@/components/EIPCatBoxGrid";
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

const getCat= (cat: string) => {
  switch (cat) {
      case "standard - networking":
          return "networking";
      case "standard - interface":
          return "interface";
      case "standard - erc":
          return "Interface";
          case "standard - core":
            return "core";
      case "Meta":
          return "meta";
      case "Informational":
          return "informational";
      default:
          return "core"
  }
}

const Type = () => {
  const [data, setData] = useState<EIP[]>([]); // Set initial state as an empty array
  const [isLoading, setIsLoading] = useState(true); // Loader state
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/alleips`);
        console.log(response);
        const jsonData = await response.json();
        setData(jsonData);
        setIsLoading(false); // Set loader state to false after data is fetched
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false); // Set loader state to false even if an error occurs
      }
    };

    fetchData();
  }, []);
  const bg = useColorModeValue("#f6f6f7", "#171923");

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
                  hideBelow={'lg'}
                  paddingBottom={{lg:'10', sm: '10',base: '10'}}
                  marginX={{lg:"40",md:'2', sm: '2', base: '2'}}
                  paddingX={{lg:"10",md:'5', sm:'5',base:'5'}}
                  marginTop={{lg:"10",md:'5', sm:'5',base:'5'}}
              >
                <FlexBetween>
                    <Header
                        title={`Ethereum Improvement Proposal - [${data.filter((item) => item.category !== 'ERC' ).length}]`}
                        subtitle="Meta, Informational, Standard Track - Core, Interface, Networking." />
                </FlexBetween>
                  <Box className={'w-full pt-10'}>
                      <SearchBox />
                  </Box>
                <Box paddingTop={'8'}>
                    <EIPCatBoxGrid />
                </Box>
                  <Box paddingTop={8}>
                      <StatusBox />
                  </Box>
              </Box>





              <Box
                  display={{lg:'none', sm: 'block'}}
                  paddingBottom={{lg:'10', sm: '10',base: '10'}}
                  marginX={{lg:"40",md:'2', sm: '2', base: '2'}}
                  paddingX={{lg:"10",md:'5', sm:'5',base:'5'}}
                  marginTop={{lg:"10",md:'5', sm:'5',base:'5'}}
              >
                <Header
                    title={`Ethereum Improvement Proposal - [${data.filter((item) => item.category !== 'ERC' ).length}]`}
                    subtitle="Meta, Informational, Standard Track - Core, Interface, Networking."
                ></Header>

                  <Box className={'w-full pt-10'}>
                      <SearchBox />
                  </Box>

                <Box >
                  <EIPCatBoxGrid />

                  <Box paddingTop={'8'}>
                      <Box paddingTop={8}>
                          <StatusBox />
                      </Box>
                    <Text
                        fontSize="xl"
                        fontWeight="bold"
                        color="#4267B2"
                        paddingTop={'8'}
                    >
                      Draft vs Final
                    </Text>
                      <AreaC />
                  </Box>
                </Box>
              </Box>
              <TypeG/>
            </motion.div>
        )}
      </AllLayout>
  );
};

export default Type;