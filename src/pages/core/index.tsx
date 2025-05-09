import React, { useEffect, useState } from "react";
import AllLayout from "@/components/Layout";
import { Box, Tabs, TabList, Tab, useColorModeValue } from "@chakra-ui/react";
import FlexBetween from "@/components/FlexBetween";
import Header from "@/components/Header";
import { motion } from "framer-motion";
import LoaderComponent from "@/components/Loader";
import TableStatus from "@/components/TableStatus";
import Link from "next/link";
import StatusColumnChart from "@/components/StatusColumnChart";

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

const categories = [
  { name: "Core", path: "/core" },
  { name: "Networking", path: "/networking" },
  { name: "Interface", path: "/interface" },
  { name: "Meta", path: "/meta" },
  { name: "Informational", path: "/informational" },
  { name: "ERC", path: "/erc" },
];

const Core = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<EIP[]>([]);
  const bg = useColorModeValue("#f6f6f7", "#171923");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/new/all`);
        const jsonData = await response.json();
        setData(jsonData.eip);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <AllLayout>
      {isLoading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <LoaderComponent />
          </motion.div>
        </Box>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
          <Box className="ml-40 mr-40 pl-10 pr-10 mt-10 mb-20">
            {/* Navigation Tabs with Links */}
            <Tabs isFitted variant="enclosed">
              <TabList>
                {categories.map((category) => (
                  <Link key={category.name} href={category.path} passHref>
                    <Tab as="a">{category.name}</Tab>
                  </Link>
                ))}
              </TabList>
            </Tabs>

            {/* Content Section for Core */}
            <FlexBetween>
              <Header
                title={`Standard Tracks - Core [ ${
                  data.filter((item) => item.category === "Core").length
                } ]`}
                subtitle="Core EIPs describe changes to the Ethereum protocol."
              />
            </FlexBetween>
            <TableStatus cat="Core" />
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
                      ><StatusColumnChart category={"Core"} type={"EIPs"} /></Box>
            
          </Box>
        </motion.div>
      )}
    </AllLayout>
  );
};

export default Core;