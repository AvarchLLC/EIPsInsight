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
import { motion } from "framer-motion";
import Link from "next/link";

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
  const [selected, setSelected] = useState("Meta");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [data, setData] = useState<EIP[]>([]);
  const [data2, setData2] = useState<EIP[]>([]);
  const [data3, setData3] = useState<EIP[]>([]);
  const [loading, setLoading] = useState(false); 
  
  
  const optionArr = [
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

        setData2(filteredData);
  },[selected]);

  const handleDownload = () => {
    // Filter data based on the selected category
    let filteredData;
    if(selected!=='RIP'){
    filteredData = data
        .filter((item) => item.category === selected)
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
              <div className="space-x-12">
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
              </div>
              <div>
                <SearchBox />
              </div>
            </div>
          </Box>

          {!loading && (
                <Box mt={8}>
                    {/* Download CSV section */}
                    <Box padding={4} bg="blue.50" borderRadius="md" marginBottom={8}>
                        <Text fontSize="lg"
                            marginBottom={2}
                            color={useColorModeValue("gray.800", "gray.200")}>
                            You can download the data here:
                        </Text>
                        <Button 
                            colorScheme="blue" 
                            onClick={handleDownload} 
                            isLoading={loading} // Show loading spinner on button
                            loadingText="Downloading" // Optional loading text
                            isDisabled={loading} // Disable button when loading
                        >
                            Download CSV
                        </Button>
                    </Box>
                </Box>
            )}

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
