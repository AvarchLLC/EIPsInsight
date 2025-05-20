import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import {
  Box,
  Card,
  CardFooter,
  CardHeader,
  Stack,
  StackDivider,
  Text,
  Divider,
  useColorModeValue,
} from "@chakra-ui/react";
import FlexBetween from "./FlexBetween";
import { motion } from "framer-motion";
import DateTime from "@/components/DateTime";

ChartJS.register(ArcElement, Tooltip, Legend);

interface CustomBoxProps {
  status: string;
  data: {
    _id: string;
    count: number;
    statusChanges: {
      [key: string]: any; // Add index signature here
      _id: string;
      eip: string;
      fromStatus: string;
      toStatus: string;
      title: string;
      status: string;
      author: string;
      created: string;
      changeDate: string;
      type: string;
      category: string;
      discussion: string;
      deadline: string;
      requires: string;
      pr: number;
      changedDay: number;
      changedMonth: number;
      changedYear: number;
      createdMonth: number;
      createdYear: number;
      __v: number;
    }[];
  }[];
}

export const PieC: React.FC<CustomBoxProps> = ({ data, status }) => {
  let tempData = {
    Core: 0,
    ERC: 0,
    Networking: 0,
    Interface: 0,
    Meta: 0,
    Informational: 0,
  };
  const transformedData: { [key: string]: number } = data?.reduce(
    (result: { [key: string]: number }, obj) => {
      if (obj._id === status) {
        obj.statusChanges.forEach((statusChange) => {
          result[statusChange.category] = obj.count;
          if (statusChange.status === "Draft") {
            console.log(statusChange);
          }
        });
      }
      return result;
    },
    {}
  );
  const bg = useColorModeValue("#f6f6f7", "#171923");
  const dataa = {
    labels: Object.keys(transformedData),
    datasets: [
      {
        label: "Number of EIPs",
        data: Object.values(transformedData),
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  if (data.length === 0) {
    return (
      <Box
        bgColor={bg}
        marginTop={"2rem"}
        p="0.5rem"
        borderRadius="0.35rem"
        overflowX="auto"
        _hover={{
          border: "1px",
          borderColor: "#30A0E0",
        }}
        className="hover: cursor-pointer ease-in duration-200"
      >
        <Text>Loading...</Text>
      </Box>
    );
  }

  if (
    Object.values(transformedData)?.reduce(
      (total, value) => total + value,
      0
    ) === 0
  ) {
    return (
      <Box
        bgColor={bg}
        marginTop={"2rem"}
        marginBottom={"2rem"}
        p="0.5rem"
        borderRadius="0.35rem"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        height={550}
        overflowX="auto"
        _hover={{
          border: "1px",
          borderColor: "#30A0E0",
        }}
        className="hover: cursor-pointer ease-in duration-200"
      >
        <Text
          textAlign="left"
          fontSize="lg"
          fontWeight="bold"
          color="#30A0E0"
          paddingTop="1rem"
        >
          {status} :{" "}
          {Object.values(transformedData)?.reduce(
            (total, value) => total + value,
            0
          )}
        </Text>
        <Divider mt="1rem" mb="1rem" />
      </Box>
    );
  }

  return (
    <Box
      bgColor={bg}
      marginTop={"2rem"}
      p="0.5rem"
      borderRadius="0.35rem"
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
      <Text
        textAlign="left"
        fontSize="lg"
        fontWeight="bold"
        color="#30A0E0"
        paddingTop="1rem"
      >
        {status} :{" "}
        {Object.values(transformedData)?.reduce(
          (total, value) => total + value,
          0
        )}
      </Text>
      <Divider mt="1rem" mb="1rem" />

      <Pie
        data={dataa}
        options={{
          plugins: {
            legend: {
              position: "right",
              display: true,
              labels: {
                usePointStyle: true,
                padding: 20,
              },
            },
          },
        }}
      />

      <Box className={"w-full"}>
        <DateTime />
      </Box>
    </Box>
  );
};
