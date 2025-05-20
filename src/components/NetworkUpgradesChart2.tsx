import React, { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { Box, useColorModeValue, Flex, Heading, Button } from "@chakra-ui/react";
import axios from "axios";
import CopyLink from "./CopyLink";
const Column = dynamic(() => import("@ant-design/plots").then(mod => mod.Column), { ssr: false });

// Define the data structure for each entry
interface AuthorData {
  name: string;
  contributionCount: number;
  eips: string[];
}


// Original data set
const rawData = [
    { upgrade: "Arrow Glacier", eip: "EIP-4345", authors: ["Tim Beiko", "James Hancock", "Thomas Jay Rush"] },
    { upgrade: "Berlin", eip: "EIP-2565", authors: ["Kelly Olson", "Sean Gulley", "Simon Peffers", "Justin Drake", "Dankrad Feist"] },
    { upgrade: "Berlin", eip: "EIP-2929", authors: ["Vitalik Buterin", "Martin Holst Swende"] },
    { upgrade: "Berlin", eip: "EIP-2718", authors: ["Micah Zoltu"] },
    { upgrade: "Berlin", eip: "EIP-2930", authors: ["Vitalik Buterin", "Martin Holst Swende"] },
    { upgrade: "Byzantium", eip: "EIP-100", authors: ["Vitalik Buterin"] },
    { upgrade: "Byzantium", eip: "EIP-140", authors: ["Alex Beregszaszi", "Nikolai Mushegian"] },
    { upgrade: "Byzantium", eip: "EIP-196", authors: ["Christian Reitwiessner"] },
    { upgrade: "Byzantium", eip: "EIP-197", authors: ["Vitalik Buterin", "Christian Reitwiessner"] },
    { upgrade: "Byzantium", eip: "EIP-198", authors: ["Vitalik Buterin"] },
    { upgrade: "Byzantium", eip: "EIP-211", authors: ["Christian Reitwiessner"] },
    { upgrade: "Byzantium", eip: "EIP-214", authors: ["Vitalik Buterin", "Christian Reitwiessner"] },
    { upgrade: "Byzantium", eip: "EIP-649", authors: ["Afri Schoedon", "Vitalik Buterin"] },
    { upgrade: "Byzantium", eip: "EIP-658", authors: ["Nick Johnson"] },
    { upgrade: "Dencun", eip: "EIP-1153", authors: ["Alexey Akhunov", "Moody Salem"] },
    { upgrade: "Dencun", eip: "EIP-4788", authors: ["Alex Stokes", "Ansgar Dietrichs", "Danny Ryan", "Martin Holst Swende", "lightclient"] },
    { upgrade: "Dencun", eip: "EIP-4844", authors: ["Vitalik Buterin", "Dankrad Feist", "Diederik Loerakker", "George Kadianakis", "Matt Garnett", "Mofi Taiwo", "Ansgar Dietrichs"] },
    { upgrade: "Dencun", eip: "EIP-5656", authors: ["Alex Beregszaszi", "Paul Dworzanski", "Jared Wasinger", "Casey Detrio", "Paweł Bylica", "Charles Cooper"] },
    { upgrade: "Dencun", eip: "EIP-6780", authors: ["Guillaume Ballet", "Vitalik Buterin", "Dankrad Feist"] },
    { upgrade: "Dencun", eip: "EIP-7044", authors: ["Lion"] },
    { upgrade: "Dencun", eip: "EIP-7045", authors: ["Danny Ryan"] },
    { upgrade: "Dencun", eip: "EIP-7514", authors: ["dapplion","Tim Beiko" ] },
    { upgrade: "Dencun", eip: "EIP-7516", authors: ["Carl Beekhuizen"] },
    { upgrade: "Constantinople", eip: "EIP-145", authors: ["Alex Beregszaszi", "Paweł Bylica"] },
    { upgrade: "Constantinople", eip: "EIP-1014", authors: ["Vitalik Buterin"] },
    { upgrade: "Constantinople", eip: "EIP-1052", authors: ["Nick Johnson", "Paweł Bylica"] },
    { upgrade: "Constantinople", eip: "EIP-1234", authors: ["Afri Schoedon"] },
    { upgrade: "Constantinople", eip: "EIP-1283", authors: ["Wei Tang"] },
    { upgrade: "Gray Glacier", eip: "EIP-5133", authors: ["Tomasz Kajetan Stanczak", "Eric Marti Haynes", "Josh Klopfenstein", "Abhimanyu Nag"] },
    { upgrade: "Homestead", eip: "EIP-2", authors: ["Vitalik Buterin"] },
    { upgrade: "Homestead", eip: "EIP-7", authors: ["Vitalik Buterin"] },
    { upgrade: "Homestead", eip: "EIP-8", authors: ["Felix Lange"] },
    { upgrade: "Istanbul", eip: "EIP-152", authors: ["Tjaden Hess", "Matt Luongo", "Piotr Dyraga", "James Hancock"] },
    { upgrade: "Istanbul", eip: "EIP-1108", authors: ["Antonio Salazar Cardozo", "Zachary Williamson"] },
    { upgrade: "Istanbul", eip: "EIP-1344", authors: ["Richard Meissner", "Bryant Eisenbach"] },
    { upgrade: "Istanbul", eip: "EIP-1884", authors: ["Martin Holst Swende"] },
    { upgrade: "Istanbul", eip: "EIP-2028", authors: ["Alexey Akhunov", "Eli Ben Sasson", "Tom Brand", "Louis Guthmann", "Avihu Levy"] },
    { upgrade: "Istanbul", eip: "EIP-2200", authors: ["Wei Tang"] },
    { upgrade: "London", eip: "EIP-1559", authors: ["Vitalik Buterin", "Eric Conner", "Rick Dudley", "Matthew Slipper", "Ian Norden", "Abdelhamid Bakhta"] },
    { upgrade: "London", eip: "EIP-3198", authors: ["Abdelhamid Bakhta", "Vitalik Buterin"] },
    { upgrade: "London", eip: "EIP-3529", authors: ["Martin Holst Swende", "Vitalik Buterin"] },
    { upgrade: "London", eip: "EIP-3541", authors: ["Alex Beregszaszi", "Paweł Bylica", "Andrei Maiboroda", "Alexey Akhunov", "Christian Reitwiessner", "Martin Holst Swende"] },
    { upgrade: "London", eip: "EIP-3554", authors: ["James Hancock"] },
    { upgrade: "Muir Glacier", eip: "EIP-2384", authors: ["Eric Conner"] },
    { upgrade: "The Merge", eip: "EIP-3675", authors: ["Mikhail Kalinin", "Danny Ryan", "Vitalik Buterin"] },
    { upgrade: "The Merge", eip: "EIP-4399", authors: ["Mikhail Kalinin", "Danny Ryan"] },
    { upgrade: "Petersburg", eip: "EIP-145", authors: ["Alex Beregszaszi", "Paweł Bylica"] },
    { upgrade: "Petersburg", eip: "EIP-1014", authors: ["Vitalik Buterin"] },
    { upgrade: "Petersburg", eip: "EIP-1052", authors: ["Nick Johnson", "Paweł Bylica"] },
    { upgrade: "Petersburg", eip: "EIP-1234", authors: ["Afri Schoedon"] },
    { upgrade: "Shapella", eip: "EIP-3651", authors: ["William Morriss"] },
    { upgrade: "Shapella", eip: "EIP-3855", authors: ["Alex Beregszaszi", "Hugo De la cruz", "Paweł Bylica"] },
    { upgrade: "Shapella", eip: "EIP-3860", authors: ["Martin Holst Swende", "Paweł Bylica", "Alex Beregszaszi", "Andrei Maiboroda"] },
    { upgrade: "Shapella", eip: "EIP-4895", authors: ["Alex Stokes", "Danny Ryan"] },
    { upgrade: "Shapella", eip: "EIP-6049", authors: ["William Entriken"] },
    { upgrade: "Spurious Dragon", eip: "EIP-155", authors: ["Vitalik Buterin"] },
    { upgrade: "Spurious Dragon", eip: "EIP-160", authors: ["Vitalik Buterin"] },
    { upgrade: "Spurious Dragon", eip: "EIP-161", authors: ["Gavin Wood"] },
    { upgrade: "Spurious Dragon", eip: "EIP-170", authors: ["Vitalik Buterin"] },
    { upgrade: "Tangerine Whistle", eip: "EIP-150", authors: ["Vitalik Buterin"] }
];

const authorContributions: Record<string, AuthorData> = {};

rawData.forEach(({ eip, authors }) => {
  authors.forEach(author => {
    if (!authorContributions[author]) {
      authorContributions[author] = { name: author, contributionCount: 0, eips: [] };
    }
    authorContributions[author].contributionCount += 1;
    authorContributions[author].eips.push(eip);
  });
});

const transformedData = Object.values(authorContributions).sort((a, b) => a.name.localeCompare(b.name));

const downloadData = () => {
  const header = "Author,Contribution Count,EIP\n";
  const csvContent = "data:text/csv;charset=utf-8," +
    header +
    transformedData?.map(({ name, contributionCount, eips }) =>
      eips?.map((eip, index) => 
        `${index === 0 ? name : ''},${index === 0 ? contributionCount : ''},https://eipsinsight.com/eips/eip-${eip.replace('EIP-', '')}`
      ).join("\n")
    ).join("\n");

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "author_contributions.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};


// Color generator function for consistency
const generateDistinctColor = (index: number, total: number) => {
  const hue = (index * (360 / total)) % 360;
  return `hsl(${hue}, 70%, 50%)`;
};

const colorMap = transformedData?.reduce((map, author, index) => {
  map[author.name] = generateDistinctColor(index, transformedData.length);
  return map;
}, {} as Record<string, string>);

const AuthorContributionsChart = React.memo(() => {
  const bg = useColorModeValue("#f6f6f7", "#171923");

  // Chart configuration
  const config = {
    data: transformedData,
    xField: "name",
    yField: "contributionCount",
    seriesField: "name",
    color: (datum: { name?: string }) => colorMap[datum.name as string] || "#ccc",   
    columnStyle: {
      radius: [10, 10, 0, 0],
    },
    label: {
      position: "middle" as "middle",
      style: {
        fill: "#ffffff",
        opacity: 0.8,
      },
    },
    xAxis: {
      label: null, // Hide labels on the x-axis
    },
    legend: { 
      position: "top-right" as const 
    },
    tooltip: {
      customItems: (items: any[]) =>
        items?.map(item => ({
          ...item,
          name: item.data.name,
          value: `Contributions: ${item.data.contributionCount}`,
        })),
    },
  };
  

  return (
    <Box bg={bg} p={5} borderRadius="lg">
      <Flex justifyContent="space-between" alignItems="center" mb={4}>
        <Heading size="md">Author Contributions  <CopyLink link={`https://eipsinsight.com//pectra#AuthorContributions`} /></Heading>
        <Button 
        fontSize={{ base: "0.6rem", md: "md" }}
        onClick={async () => {
            try {
              // Trigger the CSV conversion and download
              downloadData();
        
              // Trigger the API call
              await axios.post("/api/DownloadCounter");
            } catch (error) {
              console.error("Error triggering download counter:", error);
            }
          }} 
          colorScheme="blue">
          Download CSV
        </Button>
      </Flex>
      <Column {...config} />
    </Box>
  );
});

export default AuthorContributionsChart;