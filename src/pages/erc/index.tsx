import AllLayout from "@/components/Layout";
import { Box, Button, Grid, Text, useColorModeValue, Link as LI, } from "@chakra-ui/react";
import FlexBetween from "@/components/FlexBetween";
import Header from "@/components/Header";
import { DownloadIcon } from "@chakra-ui/icons";
import TableStatus from "@/components/TableStatus";
import AreaStatus from "@/components/AreaStatus";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import LoaderComponent from "@/components/Loader";
import ERCGraph from "@/components/ERCGraph";
import NextLink from "next/link";
import StatusColumnChart from "@/components/StatusColumnChart";
import DateTime from "@/components/DateTime";
import SearchBox from "@/components/SearchBox";
import ERCCatBoxGrid from "@/components/ERCCatBoxGrid";
import ERCStatusDonut from "@/components/ERCStatusDonut";
import ERCTypeDonut from "@/components/ERCTypeDonut";
import StackedColumnChart from "@/components/StackedBarChart2";
import CBoxStatus from "@/components/CBoxStatus3";
import AllChart from "@/components/AllChart";
import AllChart3 from "@/components/AllChart3";
import AreaC from "@/components/AreaC";
import ERCStatusGraph from "@/components/ERCStatusGraph";
import OtherBox from "@/components/OtherStats";
import { ButtonGroup, Flex} from "@chakra-ui/react";
import TypeGraphs from "@/components/TypeGraphs4";
import CatTable from "@/components/CatTable";
import CatTable2 from "@/components/CatTable2";

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
  repo:string;
  unique_ID: number;
  __v: number;
}

interface EIP3 {
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
}


interface EIP2 {
  status: string;
  eips: {
    status: string;
    month: number;
    year: number;
    date: string;
    count: number;
    category: string;
    eips:any[];
  }[];
}

interface APIResponse {
  eip: EIP2[];
  erc: EIP2[];
  rip: EIP2[];
}

interface EIPGroup {
  category: string;
  month: number;
  year: number;
  date: string;
  count: number;
  eips: EIP3[];
}

interface APIResponse2 {
  status: string;
  eips: EIPGroup[];
}

interface Data {
  eip: APIResponse2[];
  erc: APIResponse2[];
  rip: APIResponse2[];
}

const ERC = () => {
  const [data, setData] = useState<EIP[]>([]);
    const [data4, setData4] = useState<EIP[]>([]); 
    const [data2, setData2] = useState<APIResponse>({eip:[],erc:[],rip:[]});
    const [data3, setData3] = useState<Data>({eip:[],erc:[],rip:[]});
    const [isLoading, setIsLoading] = useState(true); 
    const [selected, setSelected] = useState<"status" | "type">("type");
  useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await fetch(`/api/new/all`);
          const jsonData = await response.json();
          setData(jsonData.erc);
          setData4(jsonData.erc);
          setIsLoading(false); 
        } catch (error) {
          console.error("Error fetching data:", error);
          setIsLoading(false); 
        }
      };
  
      fetchData();
    }, []);
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await fetch(`/api/new/graphsv2`);
          const jsonData = await response.json();
          setData2(jsonData);
          setData3(jsonData);
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
            paddingBottom={{ lg: "10", md: "10", sm: "10", base: "10" }}
            marginX={{ lg: "40", md: "2", sm: "2", base: "2" }}
            paddingX={{ lg: "10", md: "5", sm: "5", base: "5" }}
            marginTop={{ lg: "10", md: "5", sm: "5", base: "5" }}
          >

    <Flex
              direction={{ base: "column", md: "row" }} // Stack on smaller screens, horizontal on larger screens
              justify="space-between"
              align="center"
              wrap="wrap" // Enable wrapping for responsiveness
              gap={4} // Add spacing between wrapped elements
            >
              {/* Header Section */}
              <Header
        title={`Ethereum Request for Comment -      [ ${data.length} ]`}
        subtitle="ERCs describe application-level standard for the Ethereum ecosystem."
      />

              {/* Toggle Buttons */}
              <ButtonGroup size="md" isAttached>
                <Button
                  colorScheme="blue"
                  variant={selected === "type" ? "solid" : "outline"}
                  onClick={() => setSelected("type")}
                  flex="1" // Equal size buttons
                >
                  Type
                </Button>
                <Button
                  colorScheme="blue"
                  variant={selected === "status" ? "solid" : "outline"}
                  onClick={() => setSelected("status")}
                  flex="1" // Equal size buttons
                >
                  Status
                </Button>
              </ButtonGroup>
        </Flex>


    <Box display={{ base: "block", md: "block", lg:"none" }} className="w-full pt-4">
      <SearchBox />
    </Box>

    <Box className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 pt-8 gap-5">
      <Box>
      {selected === "status" ? (
            <ERCStatusDonut />
          ) : (
            <ERCTypeDonut />
          )}
      </Box>
      <Box>
      {selected === "status" ? (
            <AllChart3 type="ERC" />
          ) : (
            <AllChart type="ERC" />
          )}
      </Box>
      <Box className="h-fit">
        <OtherBox type="ERCs" />
      </Box>
    </Box>

    <Box paddingTop={8}>
          {selected === "status" ? (
           <></>
          ) : (
            <ERCStatusGraph />
          )}
    </Box>
    {selected === "status" && (
              <Box paddingY="8">
                <Text fontSize="3xl" fontWeight="bold" color="#A020F0">
                  Draft vs Final (Over the Years)
                </Text>
                <AreaStatus type="ERCs" />
              </Box>
    )}

{["Draft", "Review", "Last Call", "Final"].map((status) => (
          <Box key={status} className={"group relative flex flex-col gap-3"} paddingBottom={8}>
            {/* Label Section aligned to the left */}
            <Box className={"flex gap-3"}>
              <Text fontSize="3xl" fontWeight="bold" color="#30A0E0">
                {status} -{" "}
                <NextLink href={`/tableStatus/erc/${status}`}>
                  [{data.filter((item) => item.status === status).length}]
                </NextLink>
              </Text>
              <p className={"text-red-700"}>*</p>
              <p className={"hidden group-hover:block text-lg"}>Count as on date</p>
            </Box>
            
            
            {/* Scrollable Charts Grid */}
            <Box overflowX="auto">
              <Grid templateColumns={{ base: "1fr", sm: "1fr", lg: "repeat(2, 1fr)" }} gap={6}>
                <StackedColumnChart type={"ERCs"} status={status} dataset={data2} />
                <CBoxStatus status={status} type={"ERCs"} dataset={data3} />
              </Grid>
            </Box>
          </Box>
        ))}

   
  </Box>

  <Box
                  paddingBottom={{ lg: "10", sm: "10", base: "10" }}
                  marginX={{ lg: "40", md: "2", sm: "2", base: "2" }}
                  paddingX={{ lg: "10", md: "5", sm: "5", base: "5" }}
                  // marginTop={{ lg: "2", md: "2", sm: "", base: "2" }}
        >
             {selected === "status" ? (
          <>
            <CatTable dataset={data4} cat="All" status="Draft" />
            <CatTable dataset={data4} cat="All" status="Final" />
            <CatTable dataset={data4} cat="All" status="Review" />
            <CatTable dataset={data4} cat="All" status="Last Call" />
            <CatTable dataset={data4} cat="All" status="Living" />
            <CatTable dataset={data4} cat="All" status="Withdrawn" />
            <CatTable dataset={data4} cat="All" status="Stagnant" />
          </>
        ) : (
          <>
            <CatTable2 dataset={data4} cat="All" status="Meta" />
            <CatTable2 dataset={data4} cat="All" status="ERC" />
          </>
        )}
        <Box
          bg={useColorModeValue("blue.50", "gray.700")} // Background color for the box
          color="black" // Text color
          borderRadius="md" // Rounded corners
          padding={4} // Padding inside the box
          marginTop={4} // Margin above the box
        >
          <Text>
            Also checkout{' '}
            <LI href="/eip" color="blue" isExternal>
              EIPs
            </LI>{' '}
            and{' '}
            <LI href="/rip" color="blue" isExternal>
              RIPs
            </LI>.
          </Text>
        </Box>
        </Box>

</motion.div>

      )}
    </AllLayout>
  );
};

export default ERC;
