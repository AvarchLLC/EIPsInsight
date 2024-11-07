import React from "react";
import dynamic from "next/dynamic";
import { Box, useColorModeValue, Flex, Heading, Button } from "@chakra-ui/react";

const Column = dynamic(() => import("@ant-design/plots").then(mod => mod.Column), { ssr: false });

// Define the data structure for each entry
interface UpgradeData {
  date: string;
  upgrade: string;
  count: number;
}

interface UpgradeData2 {
    date: string;
    upgrade: string;
    eip: string;
  }

// Original data set
const rawData = [
    { date: "2021-12-09", upgrade: "Arrow Glacier", eip: "EIP-4345" },
    { date: "2021-04-15", upgrade: "Berlin", eip: "EIP-2565" },
    { date: "2021-04-15", upgrade: "Berlin", eip: "EIP-2929" },
    { date: "2021-04-15", upgrade: "Berlin", eip: "EIP-2718" },
    { date: "2021-04-15", upgrade: "Berlin", eip: "EIP-2930" },
    { date: "2017-10-16", upgrade: "Byzantium", eip: "EIP-100" },
    { date: "2017-10-16", upgrade: "Byzantium", eip: "EIP-140" },
    { date: "2017-10-16", upgrade: "Byzantium", eip: "EIP-196" },
    { date: "2017-10-16", upgrade: "Byzantium", eip: "EIP-197" },
    { date: "2017-10-16", upgrade: "Byzantium", eip: "EIP-198" },
    { date: "2017-10-16", upgrade: "Byzantium", eip: "EIP-211" },
    { date: "2017-10-16", upgrade: "Byzantium", eip: "EIP-214" },
    { date: "2017-10-16", upgrade: "Byzantium", eip: "EIP-649" },
    { date: "2017-10-16", upgrade: "Byzantium", eip: "EIP-658" },
    { date: "2024-03-13", upgrade: "Dencun", eip: "EIP-1153" },
    { date: "2024-03-13", upgrade: "Dencun", eip: "EIP-4788" },
    { date: "2024-03-13", upgrade: "Dencun", eip: "EIP-4844" },
    { date: "2024-03-13", upgrade: "Dencun", eip: "EIP-5656" },
    { date: "2024-03-13", upgrade: "Dencun", eip: "EIP-6780" },
    { date: "2024-03-13", upgrade: "Dencun", eip: "EIP-7044" },
    { date: "2024-03-13", upgrade: "Dencun", eip: "EIP-7045" },
    { date: "2024-03-13", upgrade: "Dencun", eip: "EIP-7514" },
    { date: "2024-03-13", upgrade: "Dencun", eip: "EIP-7516" },
    { date: "2019-02-28", upgrade: "Constantinople", eip: "EIP-145" },
    { date: "2019-02-28", upgrade: "Constantinople", eip: "EIP-1014" },
    { date: "2019-02-28", upgrade: "Constantinople", eip: "EIP-1052" },
    { date: "2019-02-28", upgrade: "Constantinople", eip: "EIP-1234" },
    { date: "2019-02-28", upgrade: "Constantinople", eip: "EIP-1283" },
    { date: "2022-06-30", upgrade: "Gray Glacier", eip: "EIP-5133" },
    { date: "2016-03-14", upgrade: "Homestead", eip: "EIP-2" },
    { date: "2016-03-14", upgrade: "Homestead", eip: "EIP-7" },
    { date: "2016-03-14", upgrade: "Homestead", eip: "EIP-8" },
    { date: "2019-12-07", upgrade: "Istanbul", eip: "EIP-152" },
    { date: "2019-12-07", upgrade: "Istanbul", eip: "EIP-1108" },
    { date: "2019-12-07", upgrade: "Istanbul", eip: "EIP-1344" },
    { date: "2019-12-07", upgrade: "Istanbul", eip: "EIP-1884" },
    { date: "2019-12-07", upgrade: "Istanbul", eip: "EIP-2028" },
    { date: "2019-12-07", upgrade: "Istanbul", eip: "EIP-2200" },
    { date: "2021-08-05", upgrade: "London", eip: "EIP-1559" },
    { date: "2021-08-05", upgrade: "London", eip: "EIP-3198" },
    { date: "2021-08-05", upgrade: "London", eip: "EIP-3529" },
    { date: "2021-08-05", upgrade: "London", eip: "EIP-3541" },
    { date: "2021-08-05", upgrade: "London", eip: "EIP-3554" },
    { date: "2020-01-02", upgrade: "Muir Glacier", eip: "EIP-2384" },
    { date: "2019-02-28", upgrade: "Petersburg", eip: "EIP-145" },
    { date: "2019-02-28", upgrade: "Petersburg", eip: "EIP-1014" },
    { date: "2019-02-28", upgrade: "Petersburg", eip: "EIP-1052" },
    { date: "2019-02-28", upgrade: "Petersburg", eip: "EIP-1234" },
    { date: "2023-04-12", upgrade: "Shapella", eip: "EIP-3651" },
    { date: "2023-04-12", upgrade: "Shapella", eip: "EIP-3855" },
    { date: "2023-04-12", upgrade: "Shapella", eip: "EIP-3860" },
    { date: "2023-04-12", upgrade: "Shapella", eip: "EIP-4895" },
    { date: "2023-04-12", upgrade: "Shapella", eip: "EIP-6049" },
    { date: "2016-11-22", upgrade: "Spurious Dragon", eip: "EIP-155" },
    { date: "2016-11-22", upgrade: "Spurious Dragon", eip: "EIP-160" },
    { date: "2016-11-22", upgrade: "Spurious Dragon", eip: "EIP-161" },
    { date: "2016-11-22", upgrade: "Spurious Dragon", eip: "EIP-170" },
    { date: "2016-10-18", upgrade: "Tangerine Whistle", eip: "EIP-150" },
    { date: "2022-09-15", upgrade: "The Merge", eip: "EIP-4895" },
    { date: "2022-09-15", upgrade: "The Merge", eip: "EIP-6049" },
    { date: "2015-09-07", upgrade: "Frontier Thawing", eip: "" },
    { date: "2015-07-30", upgrade: "Frontier", eip: "" },
    { date: "2021-10-21", upgrade: "Altair", eip: "" },
  ];

// Transform data for charting and sort by date, ensuring TBD upgrades are last
const transformedData: UpgradeData[] = Object.values(
  rawData.reduce((acc, { date, upgrade }) => {
    const key = `${date}-${upgrade}`;
    if (!acc[key]) {
      acc[key] = { date, upgrade, count: 0 };
    }
    if (["Altair", "Frontier", "Frontier Thawing"].includes(upgrade)) {
      acc[key].count = 0;
    } else {
      acc[key].count += 1;
    }
    return acc;
  }, {} as Record<string, UpgradeData>)
).sort((a, b) => {
  if (a.date === "TBD") return 1;
  if (b.date === "TBD") return -1;
  return new Date(a.date).getTime() - new Date(b.date).getTime();
});

const downloadData = () => {
    const header = "Date,Network Upgrade,EIP link\n";
    const csvContent = "data:text/csv;charset=utf-8,"+header
      + rawData.map(({ date, upgrade, eip }) => `${date},${upgrade},https://eipsinsight.com/eips/eip-${eip.replace('EIP-', '')}`).join("\n");

  
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "network_upgrades.csv"); // Name your CSV file here
    document.body.appendChild(link); // Required for FF
    link.click();
    document.body.removeChild(link);
  };

// Function to generate distinct colors
const generateDistinctColor = (index: number, total: number) => {
  const hue = (index * (360 / total)) % 360;
  const saturation = 85 - (index % 2) * 15; // Alternates between 85% and 70%
  const lightness = 60 - (index % 3) * 10; // Alternates between 60%, 50%, and 40%
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};


// Map to store colors for each unique upgrade
const uniqueUpgrades = [...new Set(transformedData.map(data => data.upgrade))];
const colorMap = uniqueUpgrades.reduce((map, upgrade, index) => {
  map[upgrade] = generateDistinctColor(index, uniqueUpgrades.length);
  return map;
}, {} as Record<string, string>);

const NetworkUpgradesChart = () => {
  const bg = useColorModeValue("#f6f6f7", "#171923");

  // Chart configuration
  const config = {
    data: transformedData,
    xField: "date",
    yField: "count",
    seriesField: "upgrade",
    color: (datum: { upgrade?: string }) => colorMap[datum.upgrade as string] || "#ccc",
    isStack: true,
    // columnStyle: {
    //   radius: [10, 10, 0, 0],
    // },
    label: {
      position: "middle" as "middle",
      style: {
        fill: "#ffffff",
        opacity: 0.6,
      },
    },
    legend: { position: "top-right" as const },
    tooltip: {
      customItems: (items: any[]) =>
        items.map(item => ({
          ...item,
          name: item.data.upgrade,
          value: `Count: ${item.data.count}`,
        })),
    },
  };

  const headingColor = useColorModeValue('black', 'white');

  return (
    <Box bg={bg} p={4} borderRadius="lg" boxShadow="lg">
         <Flex justifyContent="space-between" alignItems="center" marginBottom="0.5rem">
         <Heading size="md" color={headingColor}>
            {`Network Upgrades`}
          </Heading>
          {/* Assuming a download option exists for the yearly data as well */}
          <Button colorScheme="blue" onClick={downloadData}>Download CSV</Button>
        </Flex>
      <Column {...config} />
    </Box>
  );
};

export default NetworkUpgradesChart;
