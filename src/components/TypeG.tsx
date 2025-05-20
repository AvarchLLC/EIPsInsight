import React, { useState } from "react";
import { Box, Grid, Text, useColorModeValue } from "@chakra-ui/react";
import { motion } from "framer-motion";

import TypeGraphs from "@/components/STypeCharts";
import AreaC from "@/components/AreaStatus";
import StackedColumnChart from "@/components/MTypeCharts";

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

const TypeG: React.FC = () => {
  const bg = useColorModeValue("#f6f6f7", "#171923");
  const [data, setData] = useState<EIP[]>([]);
  return (
    <>
      <Box
        hideBelow={"lg"}
        paddingBottom={{ lg: "10", sm: "10", base: "10" }}
        marginX={{ lg: "40", md: "2", sm: "2", base: "2" }}
        paddingX={{ lg: "10", md: "5", sm: "5", base: "5" }}
        marginTop={{ lg: "10", md: "5", sm: "5", base: "5" }}
      >
        <Grid templateColumns="1fr 1fr 1fr" gap={8}>
          <Text fontSize="3xl" fontWeight="bold" color="#30A0E0">
            Core
          </Text>
          <Text fontSize="3xl" fontWeight="bold" color="#30A0E0">
            ERC
          </Text>
          <Text fontSize="3xl" fontWeight="bold" color="#30A0E0">
            Networking
          </Text>
        </Grid>
        <Grid templateColumns="1fr 1fr 1fr" gap={8}>
          <Box
            marginTop={"2rem"}
            bg={bg}
            p="0.5rem"
            borderRadius="0.55rem"
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            height={400}
            _hover={{
              border: "1px",
              borderColor: "#30A0E0",
            }}
            as={motion.div}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 } as any}
            className="hover: cursor-pointer ease-in duration-200"
          >
            <TypeGraphs status="Core" />
          </Box>
          <Box
            marginTop={"2rem"}
            bg={bg}
            p="0.5rem"
            borderRadius="0.55rem"
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            height={400}
            _hover={{
              border: "1px",
              borderColor: "#30A0E0",
            }}
            as={motion.div}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 } as any}
            className="hover: cursor-pointer ease-in duration-200"
          >
            <TypeGraphs status="ERC" />
          </Box>
          <Box
            marginTop={"2rem"}
            bg={bg}
            p="0.5rem"
            borderRadius="0.55rem"
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            height={400}
            _hover={{
              border: "1px",
              borderColor: "#30A0E0",
            }}
            as={motion.div}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 } as any}
            className="hover: cursor-pointer ease-in duration-200"
          >
            <TypeGraphs status="Networking" />
          </Box>
        </Grid>
        <Grid templateColumns="1fr 1fr 1fr" gap={8} paddingTop={8}>
          <Text fontSize="3xl" fontWeight="bold" color="#30A0E0">
            Interface
          </Text>
          <Text fontSize="3xl" fontWeight="bold" color="#30A0E0">
            Meta
          </Text>
          <Text fontSize="3xl" fontWeight="bold" color="#30A0E0">
            Informational
          </Text>
        </Grid>
        <Grid templateColumns="1fr 1fr 1fr" gap={8}>
          <Box
            marginTop={"2rem"}
            bg={bg}
            p="0.5rem"
            borderRadius="0.55rem"
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            height={400}
            _hover={{
              border: "1px",
              borderColor: "#30A0E0",
            }}
            as={motion.div}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 } as any}
            className="hover: cursor-pointer ease-in duration-200"
          >
            <TypeGraphs status="Interface" />
          </Box>

          <Box
            marginTop={"2rem"}
            bg={bg}
            p="0.5rem"
            borderRadius="0.55rem"
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            height={400}
            _hover={{
              border: "1px",
              borderColor: "#30A0E0",
            }}
            as={motion.div}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 } as any}
            className="hover: cursor-pointer ease-in duration-200"
          >
            <StackedColumnChart status="Meta" />
          </Box>

          <Box
            marginTop={"2rem"}
            bg={bg}
            p="0.5rem"
            borderRadius="0.55rem"
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            height={400}
            _hover={{
              border: "1px",
              borderColor: "#30A0E0",
            }}
            as={motion.div}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 } as any}
            className="hover: cursor-pointer ease-in duration-200"
          >
            <StackedColumnChart status="Informational" />
          </Box>
        </Grid>
      </Box>

      <Box
        display={{ lg: "none", sm: "block" }}
        paddingBottom={{ lg: "10", sm: "10", base: "10" }}
        marginX={{ lg: "40", md: "2", sm: "2", base: "2" }}
        paddingX={{ lg: "10", md: "5", sm: "5", base: "5" }}
        marginTop={{ lg: "10", md: "5", sm: "5", base: "5" }}
      >
        <Text fontSize="xl" fontWeight="bold" color="#4267B2">
          Draft - [ {data?.filter((item) => item.status === "Draft").length} ]
        </Text>

        <Box
          marginTop={"2rem"}
          paddingTop={"8"}
          bg={bg}
          p="0.5rem"
          borderRadius="0.55rem"
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          height={400}
          overflowX="auto"
          _hover={{
            border: "1px",
            borderColor: "#30A0E0",
          }}
          as={motion.div}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 } as any}
          className="hover: cursor-pointer ease-in duration-200"
        >
          <TypeGraphs status="Draft" />
        </Box>

        <Text fontSize="xl" fontWeight="bold" color="#4267B2" paddingTop={"8"}>
          Draft vs Final
        </Text>

        <AreaC type={"EIPs"} />

        <Text fontSize="xl" fontWeight="bold" color="#30A0E0" paddingTop={"8"}>
          Review - [ {data?.filter((item) => item.status === "Review").length} ]
        </Text>

        <Box
          marginTop={"2rem"}
          paddingTop={"8"}
          bg={bg}
          p="0.5rem"
          borderRadius="0.55rem"
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          height={400}
          _hover={{
            border: "1px",
            borderColor: "#30A0E0",
          }}
          as={motion.div}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 } as any}
          className="hover: cursor-pointer ease-in duration-200"
        >
          <TypeGraphs status="Review" />
        </Box>

        <Text fontSize="xl" fontWeight="bold" color="#30A0E0" paddingTop={"8"}>
          Stagnant - [{" "}
          {data?.filter((item) => item.status === "Stagnant").length} ]
        </Text>

        <Box
          marginTop={"2rem"}
          paddingTop={"8"}
          bg={bg}
          p="0.5rem"
          borderRadius="0.55rem"
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          height={400}
          _hover={{
            border: "1px",
            borderColor: "#30A0E0",
          }}
          as={motion.div}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 } as any}
          className="hover: cursor-pointer ease-in duration-200"
        >
          <TypeGraphs status="Stagnant" />
        </Box>

        <Text fontSize="xl" fontWeight="bold" color="#30A0E0" paddingTop={"8"}>
          Living - [ {data?.filter((item) => item.status === "Living").length} ]
        </Text>

        <Box
          marginTop={"2rem"}
          paddingTop={"8"}
          bg={bg}
          p="0.5rem"
          borderRadius="0.55rem"
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          height={400}
          _hover={{
            border: "1px",
            borderColor: "#30A0E0",
          }}
          as={motion.div}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 } as any}
          className="hover: cursor-pointer ease-in duration-200"
        >
          <TypeGraphs status="Living" />
        </Box>

        <Text fontSize="xl" fontWeight="bold" color="#30A0E0" paddingTop={"8"}>
          Last Call - [{" "}
          {data?.filter((item) => item.status === "Last Call").length} ]
        </Text>

        <Box
          marginTop={"2rem"}
          paddingTop={"8"}
          bg={bg}
          p="0.5rem"
          borderRadius="0.55rem"
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          height={400}
          _hover={{
            border: "1px",
            borderColor: "#30A0E0",
          }}
          as={motion.div}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 } as any}
          className="hover: cursor-pointer ease-in duration-200"
        >
          <TypeGraphs status="Last Call" />
        </Box>

        <Text fontSize="xl" fontWeight="bold" color="#30A0E0" paddingTop={"8"}>
          Withdrawn - [{" "}
          {data?.filter((item) => item.status === "Withdrawn").length} ]
        </Text>

        <Box
          marginTop={"2rem"}
          paddingTop={"8"}
          bg={bg}
          p="0.5rem"
          borderRadius="0.55rem"
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          height={400}
          _hover={{
            border: "1px",
            borderColor: "#30A0E0",
          }}
          as={motion.div}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 } as any}
          className="hover: cursor-pointer ease-in duration-200"
        >
          <TypeGraphs status="Withdrawn" />
        </Box>

        <Text fontSize="xl" fontWeight="bold" color="#30A0E0" paddingTop={"8"}>
          Final - [ {data?.filter((item) => item.status === "Final").length} ]
        </Text>

        <Box
          marginTop={"2rem"}
          paddingTop={"8"}
          bg={bg}
          p="0.5rem"
          borderRadius="0.55rem"
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          height={400}
          _hover={{
            border: "1px",
            borderColor: "#30A0E0",
          }}
          as={motion.div}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 } as any}
          className="hover: cursor-pointer ease-in duration-200"
        >
          <TypeGraphs status="Final" />
        </Box>
      </Box>
    </>
  );
};

export default TypeG;
