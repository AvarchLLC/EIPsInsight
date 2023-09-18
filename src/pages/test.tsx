async function fetchLastCreatedYearFromAPI(eipNumber: number): Promise<number | null> {
    try {
      const apiUrl = `/api/eipshistory/${eipNumber}`;
      const response = await fetch(apiUrl);
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      
      if (Array.isArray(data) && data.length > 0) {
        const lastElement = data[0];
        const lastElementCreatedYear = lastElement.mergedMonth;
        return lastElementCreatedYear;
      } else {
        throw new Error("No data found or data format is invalid.");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  }

  import React from "react";
  import AllLayout from "@/components/Layout";
  import Header from "@/components/Header";
  import {
    Box,
    useColorMode,
    useColorModeValue,
  } from "@chakra-ui/react";
  import { useEffect, useState } from "react";
  import { motion } from "framer-motion";
  import LoaderComponent from "@/components/Loader";

  
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
  const eipNumber = 1;
  let dat= '2'
fetchLastCreatedYearFromAPI(eipNumber)
  .then((mergedDate) => {
    if (mergedDate !== null) {
      dat = mergedDate.toString();
    } else {
      console.log("No data found or data format is invalid.");
    }
  })
  .catch((error) => {
    console.error("Error:", error);
  });
  
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
               {dat}
              </motion.div>
          )}
        </AllLayout>
    );
  };
  export default Type;

