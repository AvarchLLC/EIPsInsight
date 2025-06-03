import React from "react";
import AllLayout from "@/components/Layout";
import { Box, Button } from "@chakra-ui/react";
import FlexBetween from "@/components/FlexBetween";
import Header from "@/components/Header";
import { DownloadIcon } from "@chakra-ui/icons";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import LoaderComponent from "@/components/Loader";
import { usePathname } from "next/navigation";
import TableStat from "@/components/TableStat";
const getStatus = (status: string) => {
  switch (status) {
    case "LastCall":
      return "Last Call";
    case "Last%20Call":
      return "Last Call";
    default:
      return status;
  }
};
const StatTab2 = () => {
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname()?.split("/");

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
      {isLoading ? (
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
            <LoaderComponent />
          </motion.div>
        </Box>
      ) : pathname && pathname?.length >= 3 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box className="ml-40 mr-40 pl-10 pr-10 mt-10 mb-20">
            <FlexBetween>
              <Header title={getStatus(pathname[3])} subtitle="" />
            </FlexBetween>
            <TableStat type={pathname[2]} cat={getStatus(pathname[3])} />
          </Box>
        </motion.div>
      ) : (
        <div>Invalid URL</div>
      )}
    </AllLayout>
  );
};

export default StatTab2;
