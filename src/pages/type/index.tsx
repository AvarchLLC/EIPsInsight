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
import CBox from "@/components/CBox";
import Donut from "@/components/Donut";
import DonutType from "@/components/DonutType";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import LoaderComponent from "@/components/Loader";
import CatBox from "@/components/CatBox";
import {
  Anchor,
  BookOpen,
  Radio,
  Link,
  Clipboard,
  Briefcase,
} from "react-feather";
import TypeGraphs from "@/components/TypeGraphs";
import FlexBetween from "@/components/FlexBetween";
import StackedColumnChart from "@/components/StackedColumnChart";
import AreaC from "@/components/AreaStatus";
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
              hideBelow={'md'}
              paddingBottom={{md:'10', base: '10'}}
              marginX={{md:"40", base: '2'}}
              paddingX={{md:"10", base:'5'}}
              marginTop={{md:"10", base:'5'}}
          >
            <Header
              title="Type - Category"
              subtitle="Your Roadway to Type and Category"
            ></Header>
            <Grid templateColumns="1fr 2fr" gap={2} paddingTop={8}>
              <Text fontSize="3xl" fontWeight="bold" color="#10b981">
                All EIPs - {data.length}
              </Text>
              <Text fontSize="3xl" fontWeight="bold" color="#10b981">
                Standards Track -{" "}
                {data.filter((item) => item.type === "Standards Track").length}
              </Text>
            </Grid>

            <Box
              mt="20px"
              display="grid"
              gridTemplateColumns="repeat(12, 1fr)"
              gridAutoRows="160px"
              gap="20px"
            >


              <CatBox
                title="Meta"
                value={data.filter((item) => item.type === "Meta").length}
                icon={<Icon as={BookOpen} />}
                url="erc"
              />

              <CatBox
                title="Informational"
                value={
                  data.filter((item) => item.type === "Informational").length
                }
                icon={<Icon as={Radio} />}
                url="networking"
              />

              <CatBox
                title="Core"
                value={data.filter((item) => item.category === "Core").length}
                icon={<Icon as={Link} />}
                url="interface"
              />

              <CatBox
                title="ERCs"
                value={data.filter((item) => item.category === "ERC").length}
                icon={<Icon as={Clipboard} />}
                url="informational"
              />

              <CatBox
                title="Networking"
                value={
                  data.filter((item) => item.category === "Networking").length
                }
                icon={<Icon as={Briefcase} />}
                url="meta"
              />
              <CatBox
                    title="Interface"
                    value={data.filter((item) => item.category === "Interface").length}
                    icon={<Icon as={BookOpen} fontSize={{md:'15', base: '10'}}/>}
                    url="erc"
                />
            </Box>

            <Text
              fontSize="3xl"
              fontWeight="bold"
              color="#4267B2"
              paddingTop={8}
            >
              Standard Track
            </Text>
            <Grid templateColumns="repeat(2, 1fr)" gap={8} paddingBottom={8}>
              <CBox />
              <Donut />
            </Grid>
            <Grid templateColumns="repeat(2, 1fr)" gap={8}>
              <Box>
                <Text fontSize="3xl" fontWeight="bold" color="#4267B2">
                  Meta
                </Text>
                <DonutType type={"Meta"} />
              </Box>
              <Box>
                <Text fontSize="3xl" fontWeight="bold" color="#4267B2">
                  Informational
                </Text>
                <DonutType type={"Informational"} />
              </Box>
            </Grid>
          </Box>


          <Box
            display={{md:'none', base: 'block'}}
            paddingBottom={{md:'10', base: '10'}}
            marginX={{md:"40", base: '2'}}
            paddingX={{md:"10", base:'5'}}
            marginTop={{md:"10", base:'5'}}
          >
            <Header
                title="Type - Category"
                subtitle="Your Roadway to Type and Category"
            ></Header>

            <Box paddingTop={8}>
              <Text fontSize="xl" fontWeight="bold" color="#10b981">
                All EIPs - {data.length}
              </Text>
              <Box
                display="grid"
                gridTemplateColumns="repeat(6, 1fr)"
                paddingTop={'5'}
                gap="10px"
              >

<CatBox
                    title="Meta"
                    value={data.filter((item) => item.type === "Meta").length}
                    icon={<Icon as={BookOpen} fontSize={{md:'15', base: '10'}}/>}
                    url="erc"
                />

                <CatBox
                    title="Meta"
                    value={data.filter((item) => item.type === "Meta").length}
                    icon={<Icon as={BookOpen} fontSize={{md:'15', base: '10'}}/>}
                    url="erc"
                />

                <CatBox
                    title="Informational"
                    value={
                      data.filter((item) => item.type === "Informational").length
                    }
                    icon={<Icon as={Radio} fontSize={{md:'15', base: '10'}}/>}
                    url="networking"
                />
              </Box>
            </Box>

            <Box
              paddingTop={'8'}
            >
              <Text fontSize="xl" fontWeight="bold" color="#10b981">
                Standards Track -{" "}
                {data.filter((item) => item.type === "Standards Track").length}
              </Text>
              <Box
                  display="grid"
                  gridTemplateColumns="repeat(7, 1fr)"
                  paddingTop={'5'}
                  gap="10px"
              >
                <CatBox
                    title="Core"
                    value={data.filter((item) => item.category === "Core").length}
                    icon={<Icon as={Link} />}
                    url="interface"
                />

                <CatBox
                    title="ERCs"
                    value={data.filter((item) => item.category === "ERC").length}
                    icon={<Icon as={Clipboard} />}
                    url="informational"
                />

                <CatBox
                    title="Networking"
                    value={
                      data.filter((item) => item.category === "Networking").length
                    }
                    icon={<Icon as={Briefcase} />}
                    url="meta"
                />
                <CatBox
                    title="Interface"
                    value={data.filter((item) => item.category === "Interface").length}
                    icon={<Icon as={Clipboard} />}
                    url="interface"
                />
              </Box>

              <Box paddingTop={'8'}>
                <Text
                    fontSize="xl"
                    fontWeight="bold"
                    color="#4267B2"
                >
                  Standard Track
                </Text>
                <CBox />
                <Donut />
              </Box>

              <Box paddingTop={'8'}>
                <Text fontSize="xl" fontWeight="bold" color="#4267B2">
                  Meta
                </Text>
                <DonutType type={"Meta"} />
              </Box>
            </Box>

            <Box paddingTop={'8'}>
              <Text fontSize="xl" fontWeight="bold" color="#4267B2">
                Informational
              </Text>
              <DonutType type={"Informational"} />
            </Box>

          </Box>
          <TypeGraphs />
        </motion.div>
      )}
    </AllLayout>
  );
};

export default Type;
