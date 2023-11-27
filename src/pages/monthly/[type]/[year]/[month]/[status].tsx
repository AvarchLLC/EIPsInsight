import React from "react";
import AllLayout from "@/components/Layout";
import { Box, Button } from "@chakra-ui/react";
import FlexBetween from "@/components/FlexBetween";
import Header from "@/components/Header";
import { DownloadIcon } from "@chakra-ui/icons";
import TableCatStat from "@/components/TableCatStat";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import LoaderComponent from "@/components/Loader";
import { usePathname } from "next/navigation";
import InsightTable from "@/components/InsightTable";

const getStatus = (status: string) => {
  switch (status) {
    case "LastCall":
      return "Last Call";
    default:
      return status;
  }
};

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

interface StatusChange {
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
}

const Insi = () => {
  const [isLoading, setIsLoading] = useState(true);
  const path = usePathname();
  const [isResEmpty, setIsResEmpty] = useState(false);
  const [data, setData] = useState<StatusChange[]>([]); // Set initial state as an empty array

  let type = "";
  let year = "";
  let month = "";
  let status = "";

  if (path) {
    const pathParts = path.split("/");
    type = pathParts[2];
    year = pathParts[3];
    month = pathParts[4];
    status = pathParts[5];
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/new/statusChanges/${year}/${month}`);
        const jsonData = await response.json();
        if (type === "erc") {
          setData(jsonData.erc);
        } else if (type === "eip") {
          setData(jsonData.eip);
        } else {
          setData(jsonData.eip);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [year, month]);

  useEffect(() => {
    if (data.length === 0) {
      setIsResEmpty(true);
    } else {
      setIsResEmpty(false);
    }
  });

  return (
    <AllLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box className="ml-40 mr-40 pl-10 pr-10 mt-10 mb-20">
          <FlexBetween>
            <Header
              title={`${monthNames[Number(month) - 1]} - ${year}`}
              subtitle={getStatus(status)}
            />
          </FlexBetween>
          <InsightTable type={type} year={year} month={month} status={status} />
        </Box>
      </motion.div>
    </AllLayout>
  );
};

export default Insi;
