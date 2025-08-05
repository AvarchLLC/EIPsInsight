import React, { useEffect, useState } from "react";
import { Box, Grid, Text, useColorModeValue } from "@chakra-ui/react";
import { motion } from "framer-motion";
import StackedColumnChart from "@/components/StackedColumnChart";
import StatusColumnChart from "@/components/StatusColumnChart2";
import AreaC from "@/components/AreaStatus";
import NextLink from "next/link";
import StatusChart from "@/components/StatusColumnChart";
import DateTime from "./DateTime";

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
  repo: string;
  __v: number;
}

interface APIResponse {
  eip: EIP[];
  erc: EIP[];
  rip: EIP[];
}

const TypeGraphs = () => {
  const bg = useColorModeValue("#f6f6f7", "#171923");

  const [data, setData] = useState<EIP[]>([]); // Set initial state as an empty array
  const [data2, setData2] = useState<APIResponse>({
    eip: [],
    erc: [],
    rip: [],
  });
  const [isLoading, setIsLoading] = useState(true); // Loader state
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/new/all`);
        console.log(response);
        const jsonData = await response.json();
        setData(jsonData.eip);
        setData2(jsonData);
        setIsLoading(false); // Set loader state to false after data is fetched
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false); // Set loader state to false even if an error occurs
      }
    };

    fetchData();
  }, []);

  const allData: EIP[] =
    data2?.eip?.concat(data2?.erc?.concat(data2?.rip)) || [];

  return (
    <>
      <Box
        // className="border border-red-700"
        overflow="hidden"
        mx="auto"
        p="0.5rem"
      >
        <Grid templateColumns={{ base: "1fr", md: "1fr 1fr 1fr" }} gap={6}>
          <NextLink href={"/core"}>
            <Text
              fontSize="3xl"
              fontWeight="bold"
              color="#30A0E0"
              isTruncated // if using Chakra UI
              maxWidth="100%"
              textOverflow="ellipsis"
              whiteSpace="nowrap"
            >
              Core - [
              {data?.filter(
                (item) =>
                  item.type === "Standards Track" && item.category === "Core"
              )?.length || 0}
              ]
            </Text>
          </NextLink>
          <NextLink href={"/networking"}>
            <Text
              fontSize="3xl"
              fontWeight="bold"
              color="#30A0E0"
              isTruncated // if using Chakra UI
              maxWidth="100%"
              textOverflow="ellipsis"
              whiteSpace="nowrap"
            >
              Networking - [
              {
                new Set(
                  allData
                    ?.filter((item) => item.category === "Networking")
                    ?.map((item) => item.eip)
                ).size
              }
              ]
            </Text>
          </NextLink>
          <NextLink href={"/interface"}>
            <Text
              fontSize="3xl"
              fontWeight="bold"
              color="#30A0E0"
              isTruncated // if using Chakra UI
              maxWidth="100%"
              textOverflow="ellipsis"
              whiteSpace="nowrap"
            >
              Interface - [
              {
                new Set(
                  allData
                    ?.filter((item) => item.category === "Interface")
                    ?.map((item) => item.eip)
                ).size
              }
              ]
            </Text>
          </NextLink>
        </Grid>
        <Grid templateColumns={{ base: "1fr", md: "1fr 1fr 1fr" }} gap={6} mt={4}>
          <Box
            bg={bg}
            p="0.5rem"
            borderRadius="0.55rem"
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            height={500}
            as={motion.div}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 } as any}
            className="hover: cursor-pointer ease-in duration-200"
          >
            <StatusColumnChart category={"Core"} type={"EIPs"} />
            <Box className={"w-full"}>
              <DateTime />
            </Box>
          </Box>
          <Box
            bg={bg}
            p="0.5rem"
            borderRadius="0.55rem"
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            height={500}
            as={motion.div}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 } as any}
            className="hover: cursor-pointer ease-in duration-200"
          >
            <StatusColumnChart category={"Networking"} type={"EIPs"} />
            <Box className={"w-full"}>
              <DateTime />
            </Box>
          </Box>
          <Box
            bg={bg}
            p="0.5rem"
            borderRadius="0.55rem"
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            height={500}
            as={motion.div}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 } as any}
            className="hover: cursor-pointer ease-in duration-200"
          >
            <StatusColumnChart category={"Interface"} type={"EIPs"} />
            <Box className={"w-full"}>
              <DateTime />
            </Box>
          </Box>
        </Grid>
        <Grid templateColumns={{ base: "1fr", md: "1fr 1fr 1fr" }} gap={6} mt={8}>
          {/*<NextLink href={'/erc'}>*/}
          {/*    <Text fontSize="3xl" fontWeight="bold" color="#30A0E0">*/}
          {/*        ERC - [{data?.filter((item) => item.category === "ERC")?.length}]*/}
          {/*    </Text>*/}
          {/*</NextLink>*/}
          <NextLink href={"/meta"}>
            <Text fontSize="3xl" fontWeight="bold" color="#30A0E0">
              Meta - [
              {
                new Set(
                  allData
                    ?.filter((item) => item.type === "Meta")
                    ?.map((item) => item.eip)
                ).size
              }
              ]
            </Text>
          </NextLink>
          <NextLink href={"/informational"}>
            <Text fontSize="3xl" fontWeight="bold" color="#30A0E0">
              Informational - [
              {
                new Set(
                  allData
                    ?.filter((item) => item.type === "Informational")
                    ?.map((item) => item.eip)
                ).size
              }
              ]
            </Text>
          </NextLink>
          <NextLink href={"/erc"}>
            <Text fontSize="3xl" fontWeight="bold" color="#30A0E0">
              ERC - [
              {
                new Set(
                  allData
                    ?.filter((item) => item.category === "ERC")
                    ?.map((item) => item.eip)
                ).size
              }
              ]
            </Text>
          </NextLink>
        </Grid>
        <Grid templateColumns={{ base: "1fr", md: "1fr 1fr 1fr" }} gap={6} mt={6}>
          <Box
            bg={bg}
            p="0.5rem"
            borderRadius="0.55rem"
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            height={500}
            as={motion.div}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 } as any}
            className="hover: cursor-pointer ease-in duration-200"
          >
            <StatusColumnChart category={"Meta"} type={"EIPs"} />
            <Box className={"w-full"}>
              <DateTime />
            </Box>
          </Box>

          <Box
            bg={bg}
            p="0.5rem"
            borderRadius="0.55rem"
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            height={500}
            as={motion.div}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 } as any}
            className="hover: cursor-pointer ease-in duration-200"
          >
            <StatusColumnChart category={"Informational"} type={"EIPs"} />
            <Box className={"w-full"}>
              <DateTime />
            </Box>
          </Box>

          <Box
            bg={bg}
            p="0.5rem"
            borderRadius="0.55rem"
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            height={500}
            as={motion.div}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 } as any}
            className="hover: cursor-pointer ease-in duration-200"
          >
            <StatusColumnChart category={"ERC"} type={"EIPs"} />
            <Box className={"w-full"}>
              <DateTime />
            </Box>
          </Box>
        </Grid>
      </Box>

      <Box>
      </Box>
    </>
  );
};

export default TypeGraphs;
