import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import {
  Box,
  Select,
  Button,
  Spinner,
  Table,
  Tbody,
  Th,
  Tr,
  Thead,
  TableContainer,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { useWindowSize } from "react-use";
import DateTime from "@/components/DateTime";
import { motion } from "framer-motion";

const getCat = (cat: string) => {
  switch (cat) {
    case "Standards Track":
    case "Standard Track":
    case "Standards Track (Core, Networking, Interface, ERC)":
    case "Standard":
    case "Process":
    case "Core":
    case "core":
      return "Core";
    case "RIP":
      return "RIPs";
    case "ERC":
      return "ERCs";
    case "Networking":
      return "Networking";
    case "Interface":
      return "Interface";
    case "Meta":
      return "Meta";
    case "Informational":
      return "Informational";
    default:
      return "Core";
  }
};

interface AreaCProps {
  dataset: EIP[];
  status:string;
}

interface EIP {
  status: string;
  eips: {
    status: string;
    year: number;
    count: number;
    category: string;
    eips: any[];
  }[];
}

const StackedColumnChart: React.FC<AreaCProps> = ({ dataset, status }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<EIP[]>([]);
  const windowSize = useWindowSize();
  const bg = useColorModeValue("#f6f6f7", "#171923");
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);

  const years = Array.from(new Array(currentYear - 2014), (_, index) => index + 2015).reverse();

  useEffect(() => {
    // const fetchData = async () => {
    //   try {
    //     const response = await fetch(`/api/new/graphsv2`);
    //     const jsonData = await response.json();
        setData(dataset);
        setIsLoading(false);
    //   } catch (error) {
    //     console.error("Error fetching data:", error);
    //   }
    // };

    // fetchData();
  }, []);

  let filteredData = dataset;

  const removeDuplicatesFromEips = (eips: any[]) => {
    const seen = new Set();
    return eips.filter((eip) => {
      const uniqueKey = `${eip.eip}-${eip.status}`; // Combine EIP number and status
      if (!seen.has(uniqueKey)) {
        seen.add(uniqueKey);
        return true;
      }
      return false;
    });
  };
  
  const transformedData = filteredData.flatMap((item) => {
    return item.eips
      .filter((eip) => eip.year === selectedYear)
      .map((eip) => ({
        category: getCat(eip.category),
        year: eip.year,
        value: eip.eips.length,  // Keep all duplicates (counting each EIP entry as-is)
      }));
  });
  

  const rows = transformedData.reduce((acc, curr) => {
    const existing = acc.find((item) => item.category === curr.category && item.year === curr.year);
    if (existing) {
      existing.value += curr.value;
    } else {
      acc.push({ category: curr.category, year: curr.year, value: curr.value });
    }
    return acc;
  }, [] as { category: string; year: number; value: number }[]);
  
  const allRows=["CORE", "META", "Informational","Networking","Interface","ERCs","RIPs"]

  allRows.forEach(category => {
    transformedData.forEach(data => {
      const existing = rows.find((row) => row.category.toLowerCase() === category.toLowerCase() && row.year === data.year);
      if (!existing) {
        rows.push({ category, year: data.year, value: 0 });
      }
    });
  });

  const total = rows.reduce((sum, row) => sum + row.value, 0);
  const numRows = rows.length + 15;
  const rowHeight = 40; // Assuming each row has a height of 40px
  const maxHeight = `${numRows * rowHeight}px`;


  const downloadCSV = () => {
    const csvRows = [
      ["EIP", "Title", "Author", "Status", "Change Date", "Created", "Type", "Category", "PR"], // Header
    ];
  
    // Function to escape quotes and wrap fields with commas in double quotes
    const escapeCSV = (value:string) => {
      if (typeof value === "string" && value.includes(",")) {
        return `"${value.replace(/"/g, '""')}"`; // Escape any existing double quotes
      }
      return value;
    };
  
    // Gather EIPs data for the selected year
    const yearEIPs = filteredData.flatMap((item) =>
      item.eips
        .filter((eip) => eip.year === selectedYear)
        .flatMap((eip) => eip.eips) // Assuming this contains the actual EIP objects
    );
  
    // Add EIPs data to csvRows
    yearEIPs.forEach((eip) => {
      csvRows.push([
        eip.eip,
        escapeCSV(eip.title),  // Escape title field
        escapeCSV(eip.author), // Escape author field
        eip.status,
        eip.changeDate,
        eip.created,
        eip.type,
        getCat(eip.category), // Use your existing category function
        eip.pr,
      ]);
    });
  
    // Create CSV content
    const csvString = csvRows.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvString], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
  
    // Create a link to download the CSV
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `eips_data_${selectedYear}.csv`); // File name
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  
  
  

  return (
    <>
      {isLoading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="200px">
          <Spinner />
        </Box>
      ) : (
        <Box
        bgColor={bg}
        // marginTop={"0.7rem"}
        p="1.5rem" // Uniform padding or use px/rem as needed
        pt="1.5rem"
        pb="1.5rem"
        borderRadius="0.55rem"
        overflowX="auto"
        _hover={{
          border: "1px",
          borderColor: "#30A0E0",
        }}
        maxH={maxHeight}
        as={motion.div}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 } as any}
        className="ease-in duration-200"
        >
          <Box className={"flex w-full gap-10"}>
            <Select
              variant="outline"
              placeholder="Select Year"
              value={selectedYear.toString()}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
              size="md"
            >
              {years.map((item) => (
                <option value={`${item}`} key={item}>
                  {item}
                </option>
              ))}
            </Select>

            <Button
          colorScheme="blue"
          variant="outline"
          fontSize={"14px"}
          fontWeight={"bold"}
          padding={"8px 20px"}
          onClick={downloadCSV} // Updated here
        >
          Download Reports
        </Button>

          </Box>
          <br/>

          <TableContainer>
            <Table variant="simple" minW="50%" maxH={"50%"} layout="fixed">
              <Thead>
                <Tr>
                  <Th minW="50px">Category</Th>
                  <Th minW="200px">Numbers</Th>
                  <Th minW="200px">Percentage</Th>
                </Tr>
              </Thead>
              <Tbody>
                {rows.map((row) => (
                  <Tr key={`${row.category}-${row.year}`}>
                    <Th>{`${row.category}`}</Th>
                    <Th>{row.value}</Th>
                    <Th>{((row.value / total) * 100).toFixed(2)}%</Th>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
          <Box className={"flex justify-center w-full text-center"}>
            <Text fontSize="xl" fontWeight="bold" color="#30A0E0" marginRight="6">
              Total: {total}
            </Text>
          </Box>
          <Box className={"w-full"}>
            <DateTime />
          </Box>
        </Box>
      )}
    </>
  );
};

export default StackedColumnChart;
