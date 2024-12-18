import React, { useState, useEffect } from "react";
import AllLayout from "@/components/Layout";
import {
  Box,
  Spinner,
  useColorModeValue,
  Text, 
  Button,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import CatTable from "@/components/CatTable";
import RipCatTable from "@/components/RipCatTable";
import SearchBox from "@/components/SearchBox";
import { CCardBody, CSmartTable } from "@coreui/react-pro";
// import { motion } from "framer-motion";
import Link from "next/link";
import axios from "axios";

import { motion } from "framer-motion";

const MotionBox = motion(Box);

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

const All = () => {
  const [selected, setSelected] = useState("All");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [data, setData] = useState<EIP[]>([]);
  const [data2, setData2] = useState<EIP[]>([]);
  const [data3, setData3] = useState<EIP[]>([]);
  const [loading, setLoading] = useState(false); 
  
  
  const optionArr = [
    "All",
    "Meta",
    "Informational",
    "Core",
    "Networking",
    "Interface",
    "ERC",
    "RIP",
  ];
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    if (bg === "#f6f6f7") {
      setIsDarkMode(false);
    } else {
      setIsDarkMode(true);
    }
  },);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/new/all`);
        const jsonData = await response.json();
        setData(jsonData.eip.concat(jsonData.erc).concat(jsonData.rip));
        const alldata=jsonData.eip.concat(jsonData.erc).concat(jsonData.rip);
        let filteredData = alldata
        .filter((item:any) => item.category === selected);
        if(selected==="All"){
          filteredData=alldata;
        }

        setData2(filteredData);

        let filteredData2 = alldata
        .filter((item:any) => item.repo === 'rip');

        setData3(filteredData2);

        setLoading(false);
        setIsLoading(false); // Set isLoading to false after data is fetched
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false); // Set isLoading to false if there's an error
      }
    };
    fetchData();
  }, []);

  useEffect(()=>{
        let filteredData = data
        .filter((item:any) => item.category === selected);
        if(selected==="All"){
          filteredData=data;
        }
        console.log("main data:", filteredData);

        setData2(filteredData);
  },[selected]);

  const handleDownload = () => {
    // Filter data based on the selected category
    let filteredData;
    if(selected!=='RIP'){
    filteredData = data
        .filter((item) => (selected==="All"||item.category === selected))
        .map((item) => {
            const { eip, title, author, repo } = item;
            return { eip, title, author, repo };
        });
      }
    else{
    filteredData=data
    .filter((item) => item.repo === 'rip')
        .map((item) => {
            const { eip, title, author, repo } = item;
            return { eip, title, author, repo };
        });
    }

    // Check if there's any data to download
    if (filteredData.length === 0) {
        console.log("No data available for download.");
        return; // Exit if no data is present
    }

    // Define the CSV header
    const header = "EIP,Title,Author,Repo\n";

    // Prepare the CSV content
    const csvContent = "data:text/csv;charset=utf-8,"
        + header
        + filteredData.map(({ eip, title, author, repo }) => {
            // Wrap title and author in double quotes to handle commas
            return `${eip},"${title.replace(/"/g, '""')}","${author.replace(/"/g, '""')}","${repo}"`;
        }).join("\n");
  
    // Check the generated CSV content before download
    console.log("CSV Content:", csvContent);

    // Encode the CSV content for downloading
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${selected}.csv`); // Name your CSV file here
    document.body.appendChild(link); // Required for Firefox
    link.click();
    document.body.removeChild(link);
};




  const bg = useColorModeValue("#f6f6f7", "#171923");



  
  return (
    <>
      <AllLayout>
        <Box
          paddingBottom={{ lg: "10", sm: "10", base: "10" }}
          marginX={{ lg: "40", md: "2", sm: "2", base: "2" }}
          paddingX={{ lg: "10", md: "5", sm: "5", base: "5" }}
          marginTop={{ lg: "10", md: "5", sm: "5", base: "5" }}
        >
          <Box className="flex space-x-12 w-full justify-center items-center text-xl font-semibold py-8">
            <div className="flex justify-between w-full">
            <Box>
              {/* For larger screens, render buttons */}
              <Box display={{ base: "none", md: "flex" }} className="space-x-6">
                {optionArr.map((item, key) => (
                  <button
                    onClick={() => {
                      setSelected(item);
                    }}
                    className={
                      selected === item ? "underline underline-offset-4" : ""
                    }
                    key={key}
                  >
                    {item}
                  </button>
                ))}
              </Box>

              {/* For smaller screens, render a dropdown */}
              <Box display={{ base: "block", md: "none" }}>
                <select
                  value={selected}
                  onChange={(e) => setSelected(e.target.value)}
                  style={{
                    padding: "8px",
                    borderRadius: "4px",
                    borderColor: "gray",
                    fontSize: "16px",
                  }}
                >
                  {optionArr.map((item, key) => (
                    <option value={item} key={key}>
                      {item}
                    </option>
                  ))}
                </select>
              </Box>
            </Box>

              <Box display={{ base: "none", md: "block" }} className="w-full max-w-md">
                <SearchBox />
              </Box>
            </div>
          </Box>
          <Box display={{ base: "block", md: "none" }} className="w-full max-w-md">
                <SearchBox />
            </Box>

          <>
      {loading ? (
        <MotionBox
          mt={8}
          textAlign="center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            repeatType: "reverse", // Pulsating effect
          }}
        >
          <Spinner size="xl" color="blue.500" />
          <Text
            mt={4}
            fontSize="lg"
            color={useColorModeValue("gray.700", "gray.300")}
          >
            Fetching data...
          </Text>
        </MotionBox>
      ) : (
        <Box mt={8}>
          {/* Download CSV section */}
          <Box padding={4} bg="blue.50" borderRadius="md" marginBottom={8}>
            <Text
              fontSize="lg"
              marginBottom={2}
              color={useColorModeValue("gray.800", "gray.200")}
            >
              You can download the data here:
            </Text>
            <Button
              colorScheme="blue"
              onClick={async () => {
                try {
                  // Trigger the CSV conversion and download
                  handleDownload();
            
                  // Trigger the API call
                  await axios.post("/api/DownloadCounter");
                } catch (error) {
                  console.error("Error triggering download counter:", error);
                }
              }}
              isLoading={loading} // Show loading spinner on button
              loadingText="Downloading" // Optional loading text
              isDisabled={loading} // Disable button when loading
            >
              Download CSV
            </Button>
          </Box>
        </Box>
      )}
    </>

          {selected === "RIP" ? (
            <Box>
            <RipCatTable dataset={data3} cat={selected} status={"Living"} />
            <RipCatTable dataset={data3} cat={selected} status={"Final"} />
            <RipCatTable dataset={data3} cat={selected} status={"Last Call"} />
            <RipCatTable dataset={data3} cat={selected} status={"Review"} />
            <RipCatTable dataset={data3} cat={selected} status={"Draft"} />
            <RipCatTable dataset={data3} cat={selected} status={"Withdrawn"} />
            <RipCatTable dataset={data3} cat={selected} status={"Stagnant"} />
          </Box>
          ) : (
            <Box>
              {!loading && (selected === "Meta" || selected === "All") && (
                <Box mt={2} color="gray.500" fontStyle="italic">
                  * EIP-1 is available both on EIP GitHub and ERC GitHub, so the count can vary by 1.
                </Box>
              )}
              <CatTable dataset={data2} cat={selected} status={"Living"} />
              <CatTable dataset={data2} cat={selected} status={"Final"} />
              <CatTable dataset={data2} cat={selected} status={"Last Call"} />
              <CatTable dataset={data2} cat={selected} status={"Review"} />
              <CatTable dataset={data2} cat={selected} status={"Draft"} />
              <CatTable dataset={data2} cat={selected} status={"Withdrawn"} />
              <CatTable dataset={data2} cat={selected} status={"Stagnant"} />
            </Box>
          )}
        </Box>
      </AllLayout>
    </>
  );
};

export default All;
