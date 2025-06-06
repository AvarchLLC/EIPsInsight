// // // // "use client";

// // // // import React, { useState, useCallback } from "react";
// // // // import dynamic from "next/dynamic";
// // // // import { Box, useColorModeValue, Flex, Heading, Button, Spinner } from "@chakra-ui/react";
// // // // import axios from "axios";
// // // // import CopyLink from "./CopyLink";

// // // // const Column = dynamic(() => import("@ant-design/plots").then((mod) => mod.Column), {
// // // //   ssr: false,
// // // // }) as unknown as React.FC<any>;


// // // // interface UpgradeData {
// // // //   date: string;
// // // //   upgrade: string;
// // // //   count: number;
// // // //   label: string;
// // // // }

// // // // interface UpgradeData2 {
// // // //   date: string;
// // // //   upgrade: string;
// // // //   eip: string;
// // // // }

// // // // // Original data set
// // // // const rawData = [
// // // //   { date: "2021-12-09", upgrade: "Arrow Glacier", eip: "EIP-4345" },
// // // //   { date: "2021-04-15", upgrade: "Berlin", eip: "EIP-2565" },
// // // //   { date: "2021-04-15", upgrade: "Berlin", eip: "EIP-2929" },
// // // //   { date: "2021-04-15", upgrade: "Berlin", eip: "EIP-2718" },
// // // //   { date: "2021-04-15", upgrade: "Berlin", eip: "EIP-2930" },
// // // //   { date: "2017-10-16", upgrade: "Byzantium", eip: "EIP-100" },
// // // //   { date: "2017-10-16", upgrade: "Byzantium", eip: "EIP-140" },
// // // //   { date: "2017-10-16", upgrade: "Byzantium", eip: "EIP-196" },
// // // //   { date: "2017-10-16", upgrade: "Byzantium", eip: "EIP-197" },
// // // //   { date: "2017-10-16", upgrade: "Byzantium", eip: "EIP-198" },
// // // //   { date: "2017-10-16", upgrade: "Byzantium", eip: "EIP-211" },
// // // //   { date: "2017-10-16", upgrade: "Byzantium", eip: "EIP-214" },
// // // //   { date: "2017-10-16", upgrade: "Byzantium", eip: "EIP-649" },
// // // //   { date: "2017-10-16", upgrade: "Byzantium", eip: "EIP-658" },
// // // //   { date: "2024-03-13", upgrade: "Dencun", eip: "EIP-1153" },
// // // //   { date: "2024-03-13", upgrade: "Dencun", eip: "EIP-4788" },
// // // //   { date: "2024-03-13", upgrade: "Dencun", eip: "EIP-4844" },
// // // //   { date: "2024-03-13", upgrade: "Dencun", eip: "EIP-5656" },
// // // //   { date: "2024-03-13", upgrade: "Dencun", eip: "EIP-6780" },
// // // //   { date: "2024-03-13", upgrade: "Dencun", eip: "EIP-7044" },
// // // //   { date: "2024-03-13", upgrade: "Dencun", eip: "EIP-7045" },
// // // //   { date: "2024-03-13", upgrade: "Dencun", eip: "EIP-7514" },
// // // //   { date: "2024-03-13", upgrade: "Dencun", eip: "EIP-7516" },
// // // //   { date: "2019-02-28", upgrade: "Constantinople", eip: "EIP-145" },
// // // //   { date: "2019-02-28", upgrade: "Constantinople", eip: "EIP-1014" },
// // // //   { date: "2019-02-28", upgrade: "Constantinople", eip: "EIP-1052" },
// // // //   { date: "2019-02-28", upgrade: "Constantinople", eip: "EIP-1234" },
// // // //   { date: "2019-02-28", upgrade: "Petersburg", eip: "EIP-1283" },
// // // //   { date: "2022-06-30", upgrade: "Gray Glacier", eip: "EIP-5133" },
// // // //   { date: "2016-03-14", upgrade: "Homestead", eip: "EIP-2" },
// // // //   { date: "2016-03-14", upgrade: "Homestead", eip: "EIP-7" },
// // // //   { date: "2016-03-14", upgrade: "Homestead", eip: "EIP-8" },
// // // //   { date: "2019-12-07", upgrade: "Istanbul", eip: "EIP-152" },
// // // //   { date: "2019-12-07", upgrade: "Istanbul", eip: "EIP-1108" },
// // // //   { date: "2019-12-07", upgrade: "Istanbul", eip: "EIP-1344" },
// // // //   { date: "2019-12-07", upgrade: "Istanbul", eip: "EIP-1884" },
// // // //   { date: "2019-12-07", upgrade: "Istanbul", eip: "EIP-2028" },
// // // //   { date: "2019-12-07", upgrade: "Istanbul", eip: "EIP-2200" },
// // // //   { date: "2021-08-05", upgrade: "London", eip: "EIP-1559" },
// // // //   { date: "2021-08-05", upgrade: "London", eip: "EIP-3198" },
// // // //   { date: "2021-08-05", upgrade: "London", eip: "EIP-3529" },
// // // //   { date: "2021-08-05", upgrade: "London", eip: "EIP-3541" },
// // // //   { date: "2021-08-05", upgrade: "London", eip: "EIP-3554" },
// // // //   { date: "2020-01-02", upgrade: "Muir Glacier", eip: "EIP-2384" },
// // // //   { date: "2019-02-28", upgrade: "Petersburg", eip: "EIP-145" },
// // // //   { date: "2019-02-28", upgrade: "Petersburg", eip: "EIP-1014" },
// // // //   { date: "2019-02-28", upgrade: "Petersburg", eip: "EIP-1052" },
// // // //   { date: "2019-02-28", upgrade: "Petersburg", eip: "EIP-1234" },
// // // //   { date: "2023-04-12", upgrade: "Shapella", eip: "EIP-3651" },
// // // //   { date: "2023-04-12", upgrade: "Shapella", eip: "EIP-3855" },
// // // //   { date: "2023-04-12", upgrade: "Shapella", eip: "EIP-3860" },
// // // //   { date: "2023-04-12", upgrade: "Shapella", eip: "EIP-4895" },
// // // //   { date: "2023-04-12", upgrade: "Shapella", eip: "EIP-6049" },
// // // //   { date: "2016-11-22", upgrade: "Spurious Dragon", eip: "EIP-155" },
// // // //   { date: "2016-11-22", upgrade: "Spurious Dragon", eip: "EIP-160" },
// // // //   { date: "2016-11-22", upgrade: "Spurious Dragon", eip: "EIP-161" },
// // // //   { date: "2016-11-22", upgrade: "Spurious Dragon", eip: "EIP-170" },
// // // //   { date: "2016-10-18", upgrade: "Tangerine Whistle", eip: "EIP-150" },
// // // //   { date: "2022-09-15", upgrade: "The Merge", eip: "EIP-4399" },
// // // //   { date: "2022-09-15", upgrade: "The Merge", eip: "EIP-3675" },
// // // //   { date: "2015-09-07", upgrade: "Frontier Thawing", eip: "" },
// // // //   { date: "2015-07-30", upgrade: "Frontier", eip: "" },
// // // //   { date: "2021-10-21", upgrade: "Altair", eip: "" },
// // // // ];
// // // // // Group and transform the data
// // // // const upgradeMap: Record<string, { date: string; upgrade: string; eips: string[] }> = {};
// // // // for (const { date, upgrade, eip } of rawData) {
// // // //   const key = `${date}-${upgrade}`;
// // // //   if (!upgradeMap[key]) {
// // // //     upgradeMap[key] = { date, upgrade, eips: [] };
// // // //   }
// // // //   if (eip) {
// // // //     upgradeMap[key].eips.push(eip.replace("EIP-", ""));
// // // //   }
// // // // }

// // // // const transformedData: UpgradeData[] = Object.values(upgradeMap).map(({ date, upgrade, eips }) => ({
// // // //   date,
// // // //   upgrade,
// // // //   count: eips.length,
// // // //   label: eips.join(", "),
// // // // })).sort((a, b) => {
// // // //   if (a.date === "TBD") return 1;
// // // //   if (b.date === "TBD") return -1;
// // // //   return new Date(a.date).getTime() - new Date(b.date).getTime();
// // // // });

// // // // function getContrastColor(hexColor: string) {
// // // //   // Convert hex to RGB
// // // //   const r = parseInt(hexColor.substr(1, 2), 16);
// // // //   const g = parseInt(hexColor.substr(3, 2), 16);
// // // //   const b = parseInt(hexColor.substr(5, 2), 16);

// // // //   // Calculate luminance
// // // //   const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

// // // //   // Return dark or light text based on background brightness
// // // //   return luminance > 0.5 ? '#000000' : '#ffffff';
// // // // }

// // // // const generateDistinctColor = (index: number, total: number) => {
// // // //   const hue = (index * (360 / total)) % 360;
// // // //   const saturation = 85 - (index % 2) * 15;
// // // //   const lightness = 60 - (index % 3) * 10;
// // // //   return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
// // // // };

// // // // const uniqueUpgrades = [...new Set(transformedData.map((data) => data.upgrade))];
// // // // const colorMap = uniqueUpgrades.reduce((map, upgrade, index) => {
// // // //   map[upgrade] = generateDistinctColor(index, uniqueUpgrades.length);
// // // //   return map;
// // // // }, {} as Record<string, string>);

// // // // const NetworkUpgradesChart = React.memo(() => {
// // // //   const bg = useColorModeValue("#f6f6f7", "#171923");
// // // //   const headingColor = useColorModeValue("black", "white");
// // // //   const [isLoading, setIsLoading] = useState(false);

// // // //   const downloadData = useCallback(async () => {
// // // //     setIsLoading(true);
// // // //     const header = "Date,Network Upgrade,EIP Link,Requires,Type, Category,GITHUB\n";

// // // //     try {
// // // //       const csvContent =
// // // //         "data:text/csv;charset=utf-8," +
// // // //         header +
// // // //         (
// // // //           await Promise.all(
// // // //             rawData.map(async ({ date, upgrade, eip }) => {
// // // //               const eipNo = eip.replace("EIP-", "");
// // // //               const url = `https://raw.githubusercontent.com/ethereum/EIPs/master/EIPS/eip-${eipNo}.md`;

// // // //               try {
// // // //                 const response = await fetch(url);
// // // //                 if (!response.ok) throw new Error(`Failed to fetch EIP-${eipNo}`);
// // // //                 const eipData = await response.text();

// // // //                 const requiresMatch = eipData.match(/requires:\s*(.+)/);
// // // //                 let requires = requiresMatch ? requiresMatch[1].trim() : "None";
// // // //                 const TypeMatch = eipData.match(/type:\s*(.+)/);
// // // //                 let Type = TypeMatch?.[1]?.trim() ?? "None";
// // // //                 const CategoryMatch = eipData.match(/category:\s*(.+)/);
// // // //                 let Category = CategoryMatch ? CategoryMatch[1].trim() : "-";
// // // //                 if (requires.includes(",")) {
// // // //                   requires = `"${requires}"`;
// // // //                 }

// // // //                 return `${date},${upgrade},https://eipsinsight.com/eips/eip-${eipNo},${requires},${Type}, ${Category}, EIPs`;
// // // //               } catch (error) {
// // // //                 console.error(`Error fetching data for EIP-${eipNo}:`, error);
// // // //                 return `${date},${upgrade},-,-,-,-,-`;
// // // //               }
// // // //             })
// // // //           )
// // // //         ).join("\n");

// // // //       const encodedUri = encodeURI(csvContent);
// // // //       const link = document.createElement("a");
// // // //       link.setAttribute("href", encodedUri);
// // // //       link.setAttribute("download", "network_upgrades.csv");
// // // //       document.body.appendChild(link);
// // // //       link.click();
// // // //     } catch (error) {
// // // //       console.error("Error downloading data:", error);
// // // //     } finally {
// // // //       setIsLoading(false);
// // // //     }
// // // //   }, []);

// // // //   const config = {
// // // //     data: transformedData,
// // // //     xField: "date",
// // // //     yField: "count",
// // // //     seriesField: "upgrade",
// // // //     color: (datum: { upgrade?: string }) => colorMap[datum.upgrade as string] || "#ccc",
// // // //     isStack: true,
// // // //     label: {
// // // //       position: "middle" as const,
// // // //       layout: [
// // // //         { type: "interval-adjust-position" },
// // // //         { type: "interval-hide-overlap" },
// // // //         { type: "adjust-color" }, // This will adjust text color if background is too dark
// // // //       ],
// // // //       content: (origin: UpgradeData) => {
// // // //         const eips = origin.label.split(", ");
// // // //         return eips
// // // //           .map((eip) => `${eip}`) // Format as EIP-XXXX
// // // //           .join("\n");
// // // //       },
// // // //       style: (datum: any) => {
// // // //         const upgradeColor = colorMap[datum.upgrade] || "#ccc";
// // // //         return {
// // // //           fill: getContrastColor(upgradeColor), // Helper function to choose white or black text
// // // //           fontSize: 10,
// // // //           fontWeight: "bold",
// // // //           background: {
// // // //             padding: [4,6],
// // // //             style: {
// // // //               fill: upgradeColor,
// // // //               radius: 4,
// // // //             },
// // // //           },
// // // //         };
// // // //       },
// // // //       // Add animation to labels
// // // //       // Add this to your config object
// // // //       animation: {
// // // //         appear: {
// // // //           duration: 1000,
// // // //           easing: 'easeQuadOut',
// // // //         },
// // // //         update: {
// // // //           duration: 300,
// // // //           easing: 'easeQuadInOut',
// // // //         },
// // // //       },
// // // // },
// // // // legend: { position: "top-right" as const },
// // // // tooltip: {
// // // //   customItems: (items: any[]) =>
// // // //     items.map((item) => ({
// // // //       ...item,
// // // //       name: item.data.upgrade,
// // // //       value: `EIPs: ${item.data.label}`,
// // // //     })),
// // // // },
// // // //   };

// // // //   return (
// // // //     <Box bg={bg} p={4} borderRadius="lg" boxShadow="lg">
// // // //       <Flex justifyContent="space-between" alignItems="center" marginBottom="0.5rem">
// // // //         <Heading size="md" color={headingColor}>
// // // //           Network Upgrades <CopyLink link={`https://eipsinsight.com/pectra#NetworkUpgrades`} />
// // // //         </Heading>
// // // //         <Button
// // // //           colorScheme="blue"
// // // //           fontSize={{ base: "0.6rem", md: "md" }}
// // // //           onClick={async () => {
// // // //             try {
// // // //               downloadData();
// // // //               await axios.post("/api/DownloadCounter");
// // // //             } catch (error) {
// // // //               console.error("Error triggering download counter:", error);
// // // //             }
// // // //           }}
// // // //           isDisabled={isLoading}
// // // //         >
// // // //           {isLoading ? <Spinner size="sm" /> : "Download CSV"}
// // // //         </Button>
// // // //       </Flex>
// // // //       <Column {...config} />
// // // //     </Box>
// // // //   );
// // // // });

// // // // export default NetworkUpgradesChart;


// // // import React, { useState, useRef } from 'react';
// // // import { scaleLinear, scaleBand } from '@visx/scale';
// // // import { Group } from '@visx/group';
// // // import { AxisLeft, AxisBottom } from '@visx/axis';
// // // import {
// // //   Box, Button, Flex, HStack, IconButton, Heading, Text,
// // //   useColorModeValue
// // // } from '@chakra-ui/react';
// // // import { AddIcon, MinusIcon, RepeatIcon } from '@chakra-ui/icons';
// // // import { saveAs } from 'file-saver';
// // // import CopyLink from './CopyLink';

// // // interface UpgradeData {
// // //   date: string;
// // //   upgrade: string;
// // //   eips: string[];
// // // }

// // // // Original data set
// // // const rawData = [
// // //   { date: "2021-12-09", upgrade: "Arrow Glacier", eip: "EIP-4345" },
// // //   { date: "2021-04-15", upgrade: "Berlin", eip: "EIP-2565" },
// // //   { date: "2021-04-15", upgrade: "Berlin", eip: "EIP-2929" },
// // //   { date: "2021-04-15", upgrade: "Berlin", eip: "EIP-2718" },
// // //   { date: "2021-04-15", upgrade: "Berlin", eip: "EIP-2930" },
// // //   { date: "2017-10-16", upgrade: "Byzantium", eip: "EIP-100" },
// // //   { date: "2017-10-16", upgrade: "Byzantium", eip: "EIP-140" },
// // //   { date: "2017-10-16", upgrade: "Byzantium", eip: "EIP-196" },
// // //   { date: "2017-10-16", upgrade: "Byzantium", eip: "EIP-197" },
// // //   { date: "2017-10-16", upgrade: "Byzantium", eip: "EIP-198" },
// // //   { date: "2017-10-16", upgrade: "Byzantium", eip: "EIP-211" },
// // //   { date: "2017-10-16", upgrade: "Byzantium", eip: "EIP-214" },
// // //   { date: "2017-10-16", upgrade: "Byzantium", eip: "EIP-649" },
// // //   { date: "2017-10-16", upgrade: "Byzantium", eip: "EIP-658" },
// // //   { date: "2024-03-13", upgrade: "Dencun", eip: "EIP-1153" },
// // //   { date: "2024-03-13", upgrade: "Dencun", eip: "EIP-4788" },
// // //   { date: "2024-03-13", upgrade: "Dencun", eip: "EIP-4844" },
// // //   { date: "2024-03-13", upgrade: "Dencun", eip: "EIP-5656" },
// // //   { date: "2024-03-13", upgrade: "Dencun", eip: "EIP-6780" },
// // //   { date: "2024-03-13", upgrade: "Dencun", eip: "EIP-7044" },
// // //   { date: "2024-03-13", upgrade: "Dencun", eip: "EIP-7045" },
// // //   { date: "2024-03-13", upgrade: "Dencun", eip: "EIP-7514" },
// // //   { date: "2024-03-13", upgrade: "Dencun", eip: "EIP-7516" },
// // //   { date: "2019-02-28", upgrade: "Constantinople", eip: "EIP-145" },
// // //   { date: "2019-02-28", upgrade: "Constantinople", eip: "EIP-1014" },
// // //   { date: "2019-02-28", upgrade: "Constantinople", eip: "EIP-1052" },
// // //   { date: "2019-02-28", upgrade: "Constantinople", eip: "EIP-1234" },
// // //   { date: "2019-02-28", upgrade: "Petersburg", eip: "EIP-1283" },
// // //   { date: "2019-02-28", upgrade: "Petersburg", eip: "EIP-145" },
// // //   { date: "2019-02-28", upgrade: "Petersburg", eip: "EIP-1014" },
// // //   { date: "2019-02-28", upgrade: "Petersburg", eip: "EIP-1052" },
// // //   { date: "2019-02-28", upgrade: "Petersburg", eip: "EIP-1234" },
// // //   { date: "2022-06-30", upgrade: "Gray Glacier", eip: "EIP-5133" },
// // //   { date: "2016-03-14", upgrade: "Homestead", eip: "EIP-2" },
// // //   { date: "2016-03-14", upgrade: "Homestead", eip: "EIP-7" },
// // //   { date: "2016-03-14", upgrade: "Homestead", eip: "EIP-8" },
// // //   { date: "2019-12-07", upgrade: "Istanbul", eip: "EIP-152" },
// // //   { date: "2019-12-07", upgrade: "Istanbul", eip: "EIP-1108" },
// // //   { date: "2019-12-07", upgrade: "Istanbul", eip: "EIP-1344" },
// // //   { date: "2019-12-07", upgrade: "Istanbul", eip: "EIP-1884" },
// // //   { date: "2019-12-07", upgrade: "Istanbul", eip: "EIP-2028" },
// // //   { date: "2019-12-07", upgrade: "Istanbul", eip: "EIP-2200" },
// // //   { date: "2021-08-05", upgrade: "London", eip: "EIP-1559" },
// // //   { date: "2021-08-05", upgrade: "London", eip: "EIP-3198" },
// // //   { date: "2021-08-05", upgrade: "London", eip: "EIP-3529" },
// // //   { date: "2021-08-05", upgrade: "London", eip: "EIP-3541" },
// // //   { date: "2021-08-05", upgrade: "London", eip: "EIP-3554" },
// // //   { date: "2020-01-02", upgrade: "Muir Glacier", eip: "EIP-2384" },

// // //   { date: "2023-04-12", upgrade: "Shapella", eip: "EIP-3651" },
// // //   { date: "2023-04-12", upgrade: "Shapella", eip: "EIP-3855" },
// // //   { date: "2023-04-12", upgrade: "Shapella", eip: "EIP-3860" },
// // //   { date: "2023-04-12", upgrade: "Shapella", eip: "EIP-4895" },
// // //   { date: "2023-04-12", upgrade: "Shapella", eip: "EIP-6049" },
// // //   { date: "2016-11-22", upgrade: "Spurious Dragon", eip: "EIP-155" },
// // //   { date: "2016-11-22", upgrade: "Spurious Dragon", eip: "EIP-160" },
// // //   { date: "2016-11-22", upgrade: "Spurious Dragon", eip: "EIP-161" },
// // //   { date: "2016-11-22", upgrade: "Spurious Dragon", eip: "EIP-170" },
// // //   { date: "2016-10-18", upgrade: "Tangerine Whistle", eip: "EIP-150" },
// // //   { date: "2022-09-15", upgrade: "The Merge", eip: "EIP-4399" },
// // //   { date: "2022-09-15", upgrade: "The Merge", eip: "EIP-3675" },
// // //   { date: "2015-09-07", upgrade: "Frontier Thawing", eip: "" },
// // //   { date: "2015-07-30", upgrade: "Frontier", eip: "" },
// // //   { date: "2021-10-21", upgrade: "Altair", eip: "" },
// // // ];

// // // const upgradeMap: Record<string, UpgradeData> = {};
// // // for (const { date, upgrade, eip } of rawData) {
// // //   if (!eip) continue;
// // //   const key = `${date}-${upgrade}`;
// // //   if (!upgradeMap[key]) {
// // //     upgradeMap[key] = { date, upgrade, eips: [] };
// // //   }
// // //   upgradeMap[key].eips.push(eip.replace("EIP-", ""));
// // // }

// // // const upgradeRows: UpgradeData[] = Object.values(upgradeMap).sort((a, b) =>
// // //   new Date(a.date).getTime() - new Date(b.date).getTime()
// // // );

// // // const generateDistinctColor = (index: number, total: number) => {
// // //   const hue = (index * (360 / total)) % 360;
// // //   const saturation = 85 - (index % 2) * 15;
// // //   const lightness = 60 - (index % 3) * 10;
// // //   return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
// // // };

// // // const uniqueUpgrades = [...new Set(upgradeRows.map(row => row.upgrade))];
// // // const colorMap = uniqueUpgrades.reduce((map, upgrade, index) => {
// // //   map[upgrade] = generateDistinctColor(index, uniqueUpgrades.length);
// // //   return map;
// // // }, {} as Record<string, string>);

// // // const NetworkUpgradesChart: React.FC = () => {
// // //   const [zoomLevel, setZoomLevel] = useState(1);
// // //   const [offset, setOffset] = useState({ x: 0, y: 0 });
// // //   const [isDragging, setIsDragging] = useState(false);
// // //   const dragStart = useRef({ x: 0, y: 0 });

// // //   const bg = useColorModeValue('gray.100', 'gray.700');
// // //   const axisColor = useColorModeValue('#333', '#ccc');

// // //   const allDates = Array.from(new Set(upgradeRows.map(r => r.date))).sort();
// // //   const yMax = Math.max(...upgradeRows.map(r => r.eips.length));

// // //   const margin = { top: 40, right: 20, bottom: 60, left: 100 };
// // //   const width = 1200;
// // //   const height = 500;

// // //   const xScale = scaleBand({
// // //     domain: allDates,
// // //     range: [margin.left, width - margin.right],
// // //     padding: 0.3
// // //   });

// // //   const yScale = scaleLinear({
// // //     domain: [0, yMax + 1],
// // //     range: [height - margin.bottom, margin.top]
// // //   });

// // //   const resetZoom = () => {
// // //     setZoomLevel(1);
// // //     setOffset({ x: 0, y: 0 });
// // //   };

// // //   const handleMouseDown = (e: React.MouseEvent) => {
// // //     setIsDragging(true);
// // //     dragStart.current = { x: e.clientX, y: e.clientY };
// // //   };

// // //   const handleMouseUp = () => setIsDragging(false);

// // //   const handleMouseMove = (e: React.MouseEvent) => {
// // //     if (!isDragging) return;
// // //     const dx = e.clientX - dragStart.current.x;
// // //     const dy = e.clientY - dragStart.current.y;
// // //     dragStart.current = { x: e.clientX, y: e.clientY };
// // //     setOffset((prev) => ({
// // //       x: prev.x - dx / zoomLevel,
// // //       y: prev.y - dy / zoomLevel,
// // //     }));
// // //   };

// // //   const downloadReport = () => {
// // //     const headers = ['Date', 'Network Upgrade', 'EIPs'];
// // //     const rows = upgradeRows.map(row => ({
// // //       date: row.date,
// // //       upgrade: row.upgrade,
// // //       eips: row.eips.join(', ')
// // //     }));

// // //     const csv = [
// // //       headers,
// // //       ...rows.map(r => [r.date, r.upgrade, `"${r.eips}"`])
// // //     ].map(r => r.join(',')).join('\n');

// // //     const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
// // //     saveAs(blob, 'network_upgrade_timeline.csv');
// // //   };

// // //   return (
// // //     <Box bg={bg} p={4} borderRadius="lg" boxShadow="lg" w="full">
// // //       <Flex justify="space-between" align="center" mb={4} flexWrap="wrap" gap={3}>
// // //         <Heading size="md">Network Upgrade Timeline <CopyLink link={`https://eipsinsight.com/upgrade#NetworkUpgrades`} /> </Heading>
// // //         <HStack>
// // //           <IconButton aria-label="Zoom In" icon={<AddIcon />} size="sm" onClick={() => setZoomLevel(z => Math.min(z * 1.2, 3))} />
// // //           <IconButton aria-label="Zoom Out" icon={<MinusIcon />} size="sm" onClick={() => setZoomLevel(z => Math.max(z / 1.2, 0.5))} />
// // //           <IconButton aria-label="Reset Zoom" icon={<RepeatIcon />} size="sm" onClick={resetZoom} />
// // //           <Button size="sm" colorScheme="blue" onClick={downloadReport}>Download CSV</Button>
// // //         </HStack>
// // //       </Flex>

// // // {/* Color Legend */}
// // // <Flex mt={4} gap={6} flexWrap="wrap" justify="center" align="center">
// // //   {uniqueUpgrades.map(upgrade => (
// // //     <Flex key={upgrade} align="center" gap={2}>
// // //       <Box w="10px" h="8px" borderRadius="full" bg={colorMap[upgrade]} />
// // //       <Text as="span" fontSize="sm" fontWeight="medium" lineHeight="normal">{upgrade}</Text>
// // //     </Flex>
// // //   ))}
// // // </Flex>

// // //       <svg
// // //         width="100%"
// // //         height="500px"
// // //         viewBox={`${offset.x} ${offset.y} ${width / zoomLevel} ${height / zoomLevel}`}
// // //         onMouseDown={handleMouseDown}
// // //         onMouseMove={handleMouseMove}
// // //         onMouseUp={handleMouseUp}
// // //         onMouseLeave={handleMouseUp}
// // //       >
// // //         <Group>
// // //           <AxisBottom
// // //             top={height - margin.bottom}
// // //             scale={xScale}
// // //             tickLabelProps={() => ({
// // //               fontSize: 11,
// // //               textAnchor: 'middle',
// // //               fill: axisColor,
// // //             })}
// // //           />
// // //           <AxisLeft
// // //             left={margin.left}
// // //             scale={yScale}
// // //             tickLabelProps={() => ({
// // //               fontSize: 11,
// // //               textAnchor: 'end',
// // //               fill: axisColor,
// // //             })}
// // //           />

// // //           {upgradeRows.map((row) => {
// // //             const x = xScale(row.date);
// // //             if (x == null) return null;
// // //             return row.eips.map((eip, index) => {
// // //               const y = yScale(index + 1);
// // //               return (
// // //                 <Group key={`${row.date}-${eip}`}>
// // //                   <rect
// // //                     x={x}
// // //                     y={y}
// // //                     width={xScale.bandwidth()}
// // //                     height={20}
// // //                     fill={colorMap[row.upgrade]}
// // //                     rx={4}
// // //                   />
// // //                   <text
// // //                     x={x + xScale.bandwidth() / 2}
// // //                     y={y + 14}
// // //                     textAnchor="middle"
// // //                     fill="white"
// // //                     fontSize={10}
// // //                     fontWeight="bold"
// // //                   >
// // //                     {eip}
// // //                   </text>
// // //                 </Group>
// // //               );
// // //             });
// // //           })}
// // //         </Group>
// // //       </svg>
// // //     </Box>
// // //   );
// // // };

// // // export default NetworkUpgradesChart;


// // import React, { useState, useRef } from 'react';
// // import { scaleLinear, scaleBand } from '@visx/scale';
// // import { Group } from '@visx/group';
// // import { AxisLeft, AxisBottom } from '@visx/axis';
// // import {
// //   Box, Button, Flex, HStack, IconButton, Heading, Text,
// //   useColorModeValue, Tooltip, useDisclosure
// // } from '@chakra-ui/react';
// // import { AddIcon, MinusIcon, RepeatIcon } from '@chakra-ui/icons';
// // import { saveAs } from 'file-saver';
// // import CopyLink from './CopyLink';
// // import CustomTooltip from "@/components/CustomTooltip";

// // interface UpgradeData {
// //   date: string;
// //   upgrade: string;
// //   eips: string[];
// // }
// // // Original data set
// // const rawData = [
// //   { date: "2021-12-09", upgrade: "Arrow Glacier", eip: "EIP-4345" },
// //   { date: "2021-04-15", upgrade: "Berlin", eip: "EIP-2565" },
// //   { date: "2021-04-15", upgrade: "Berlin", eip: "EIP-2929" },
// //   { date: "2021-04-15", upgrade: "Berlin", eip: "EIP-2718" },
// //   { date: "2021-04-15", upgrade: "Berlin", eip: "EIP-2930" },
// //   { date: "2017-10-16", upgrade: "Byzantium", eip: "EIP-100" },
// //   { date: "2017-10-16", upgrade: "Byzantium", eip: "EIP-140" },
// //   { date: "2017-10-16", upgrade: "Byzantium", eip: "EIP-196" },
// //   { date: "2017-10-16", upgrade: "Byzantium", eip: "EIP-197" },
// //   { date: "2017-10-16", upgrade: "Byzantium", eip: "EIP-198" },
// //   { date: "2017-10-16", upgrade: "Byzantium", eip: "EIP-211" },
// //   { date: "2017-10-16", upgrade: "Byzantium", eip: "EIP-214" },
// //   { date: "2017-10-16", upgrade: "Byzantium", eip: "EIP-649" },
// //   { date: "2017-10-16", upgrade: "Byzantium", eip: "EIP-658" },
// //   { date: "2024-03-13", upgrade: "Dencun", eip: "EIP-1153" },
// //   { date: "2024-03-13", upgrade: "Dencun", eip: "EIP-4788" },
// //   { date: "2024-03-13", upgrade: "Dencun", eip: "EIP-4844" },
// //   { date: "2024-03-13", upgrade: "Dencun", eip: "EIP-5656" },
// //   { date: "2024-03-13", upgrade: "Dencun", eip: "EIP-6780" },
// //   { date: "2024-03-13", upgrade: "Dencun", eip: "EIP-7044" },
// //   { date: "2024-03-13", upgrade: "Dencun", eip: "EIP-7045" },
// //   { date: "2024-03-13", upgrade: "Dencun", eip: "EIP-7514" },
// //   { date: "2024-03-13", upgrade: "Dencun", eip: "EIP-7516" },
// //   { date: "2019-02-28", upgrade: "Constantinople", eip: "EIP-145" },
// //   { date: "2019-02-28", upgrade: "Constantinople", eip: "EIP-1014" },
// //   { date: "2019-02-28", upgrade: "Constantinople", eip: "EIP-1052" },
// //   { date: "2019-02-28", upgrade: "Constantinople", eip: "EIP-1234" },
// //   { date: "2019-02-28", upgrade: "Petersburg", eip: "EIP-1283" },
// //   { date: "2019-02-28", upgrade: "Petersburg", eip: "EIP-145" },
// //   { date: "2019-02-28", upgrade: "Petersburg", eip: "EIP-1014" },
// //   { date: "2019-02-28", upgrade: "Petersburg", eip: "EIP-1052" },
// //   { date: "2019-02-28", upgrade: "Petersburg", eip: "EIP-1234" },
// //   { date: "2022-06-30", upgrade: "Gray Glacier", eip: "EIP-5133" },
// //   { date: "2016-03-14", upgrade: "Homestead", eip: "EIP-2" },
// //   { date: "2016-03-14", upgrade: "Homestead", eip: "EIP-7" },
// //   { date: "2016-03-14", upgrade: "Homestead", eip: "EIP-8" },
// //   { date: "2019-12-07", upgrade: "Istanbul", eip: "EIP-152" },
// //   { date: "2019-12-07", upgrade: "Istanbul", eip: "EIP-1108" },
// //   { date: "2019-12-07", upgrade: "Istanbul", eip: "EIP-1344" },
// //   { date: "2019-12-07", upgrade: "Istanbul", eip: "EIP-1884" },
// //   { date: "2019-12-07", upgrade: "Istanbul", eip: "EIP-2028" },
// //   { date: "2019-12-07", upgrade: "Istanbul", eip: "EIP-2200" },
// //   { date: "2021-08-05", upgrade: "London", eip: "EIP-1559" },
// //   { date: "2021-08-05", upgrade: "London", eip: "EIP-3198" },
// //   { date: "2021-08-05", upgrade: "London", eip: "EIP-3529" },
// //   { date: "2021-08-05", upgrade: "London", eip: "EIP-3541" },
// //   { date: "2021-08-05", upgrade: "London", eip: "EIP-3554" },
// //   { date: "2020-01-02", upgrade: "Muir Glacier", eip: "EIP-2384" },

// //   { date: "2023-04-12", upgrade: "Shapella", eip: "EIP-3651" },
// //   { date: "2023-04-12", upgrade: "Shapella", eip: "EIP-3855" },
// //   { date: "2023-04-12", upgrade: "Shapella", eip: "EIP-3860" },
// //   { date: "2023-04-12", upgrade: "Shapella", eip: "EIP-4895" },
// //   { date: "2023-04-12", upgrade: "Shapella", eip: "EIP-6049" },
// //   { date: "2016-11-22", upgrade: "Spurious Dragon", eip: "EIP-155" },
// //   { date: "2016-11-22", upgrade: "Spurious Dragon", eip: "EIP-160" },
// //   { date: "2016-11-22", upgrade: "Spurious Dragon", eip: "EIP-161" },
// //   { date: "2016-11-22", upgrade: "Spurious Dragon", eip: "EIP-170" },
// //   { date: "2016-10-18", upgrade: "Tangerine Whistle", eip: "EIP-150" },
// //   { date: "2022-09-15", upgrade: "The Merge", eip: "EIP-4399" },
// //   { date: "2022-09-15", upgrade: "The Merge", eip: "EIP-3675" },
// //   { date: "2015-09-07", upgrade: "Frontier Thawing", eip: "" },
// //   { date: "2015-07-30", upgrade: "Frontier", eip: "" },
// //   { date: "2021-10-21", upgrade: "Altair", eip: "" },
// // ];


// // const upgradeMap: Record<string, UpgradeData> = {};
// // for (const { date, upgrade, eip } of rawData) {
// //   const key = `${date}-${upgrade}`;
// //   if (!upgradeMap[key]) {
// //     upgradeMap[key] = { date, upgrade, eips: [] };
// //   }
// //   if (eip) {
// //     upgradeMap[key].eips.push(eip.replace("EIP-", ""));
// //   }
// // }

// // const upgradeRows: UpgradeData[] = Object.values(upgradeMap).sort((a, b) =>
// //   new Date(a.date).getTime() - new Date(b.date).getTime()
// // );

// // const generateDistinctColor = (index: number, total: number) => {
// //   const hue = (index * (360 / total)) % 360;
// //   const saturation = 85 - (index % 2) * 15;
// //   const lightness = 60 - (index % 3) * 10;
// //   return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
// // };

// // const uniqueUpgrades = [...new Set(upgradeRows.map(row => row.upgrade))];
// // const colorMap = uniqueUpgrades.reduce((map, upgrade, index) => {
// //   map[upgrade] = generateDistinctColor(index, uniqueUpgrades.length);
// //   return map;
// // }, {} as Record<string, string>);

// // const NetworkUpgradesChart: React.FC = () => {
// //   const [zoomLevel, setZoomLevel] = useState(1);
// //   const [offset, setOffset] = useState({ x: 0, y: 0 });
// //   const [isDragging, setIsDragging] = useState(false);
// //   const dragStart = useRef({ x: 0, y: 0 });
// //   const [hoveredData, setHoveredData] = useState<{ eip: string, upgrade: string, date: string } | null>(null);
// //   const [mousePos, setMousePos] = useState({ x: 0, y: 0 });


// //   const bg = useColorModeValue('gray.100', 'gray.700');
// //   const axisColor = useColorModeValue('#333', '#ccc');

// //   const allDates = Array.from(new Set(upgradeRows.map(r => r.date))).sort();
// //   const maxEips = Math.max(...upgradeRows.map(r => r.eips.length || 1));

// //   const margin = { top: 60, right: 20, bottom: 60, left: 100 };
// //   const width = 1200;
// //   const height = 500;

// //   const xScale = scaleBand({
// //     domain: allDates,
// //     range: [margin.left, width - margin.right],
// //     padding: 0.3
// //   });

// //   const yScale = scaleLinear({
// //     domain: [0, maxEips + 1],
// //     range: [height - margin.bottom, margin.top]
// //   });

// //   const resetZoom = () => {
// //     setZoomLevel(1);
// //     setOffset({ x: 0, y: 0 });
// //   };

// //   const handleMouseDown = (e: React.MouseEvent) => {
// //     setIsDragging(true);
// //     dragStart.current = { x: e.clientX, y: e.clientY };
// //   };

// //   const handleMouseUp = () => setIsDragging(false);

// //   // const handleMouseMove = (e: React.MouseEvent) => {
// //   //   if (!isDragging) return;
// //   //   const dx = e.clientX - dragStart.current.x;
// //   //   const dy = e.clientY - dragStart.current.y;
// //   //   dragStart.current = { x: e.clientX, y: e.clientY };
// //   //   setOffset((prev) => ({
// //   //     x: prev.x - dx / zoomLevel,
// //   //     y: prev.y - dy / zoomLevel,
// //   //   }));
// //   // };

// //   const downloadReport = () => {
// //     const headers = ['Date', 'Network Upgrade', 'EIPs'];
// //     const rows = upgradeRows.map(row => ({
// //       date: row.date,
// //       upgrade: row.upgrade,
// //       eips: row.eips.join(', ')
// //     }));

// //     const csv = [
// //       headers,
// //       ...rows.map(r => [r.date, r.upgrade, `"${r.eips}"`])
// //     ].map(r => r.join(',')).join('\n');

// //     const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
// //     saveAs(blob, 'network_upgrade_timeline.csv');
// //   };

// //   return (
// //     <Box bg={bg} p={1} borderRadius="lg" boxShadow="lg" w="full">
// //       <Flex justify="space-between" align="center" mb={4} flexWrap="wrap" gap={3}>
// //         <Heading size="md">Network Upgrade Timeline <CopyLink link={`https://eipsinsight.com/upgrade#NetworkUpgrades`} /> </Heading>
// //         <HStack>
// //           <IconButton aria-label="Zoom In" icon={<AddIcon />} size="sm" onClick={() => setZoomLevel(z => Math.min(z * 1.2, 3))} />
// //           <IconButton aria-label="Zoom Out" icon={<MinusIcon />} size="sm" onClick={() => setZoomLevel(z => Math.max(z / 1.2, 0.5))} />
// //           <IconButton aria-label="Reset Zoom" icon={<RepeatIcon />} size="sm" onClick={resetZoom} />
// //           <Button size="sm" colorScheme="blue" onClick={downloadReport}>Download CSV</Button>
// //         </HStack>
// //       </Flex>

// //       {/* Color Legend */}
// //       <Flex mt={2} gap={6} flexWrap="wrap" justify="center" align="center">
// //         {uniqueUpgrades.map(upgrade => (
// //           <Flex key={upgrade} align="center" gap={2}>
// //             <Box w="10px" h="8px" borderRadius="full" bg={colorMap[upgrade]} />
// //             <Text as="span" fontSize="sm" fontWeight="medium" lineHeight="normal">{upgrade}</Text>
// //           </Flex>
// //         ))}
// //       </Flex>

// //       <svg
// //         width="100%"
// //         height="auto"
// //         viewBox={`${offset.x} ${offset.y} ${width / zoomLevel} ${height / zoomLevel}`}
// //         onMouseDown={handleMouseDown}
// //         onMouseMove={(e) => {
// //           const rect = e.currentTarget.getBoundingClientRect();
// //           setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
// //         }} onMouseUp={handleMouseUp}
// //         onMouseLeave={handleMouseUp}
// //       >
// //         <Group>
// //           <AxisBottom
// //             top={height - margin.bottom}
// //             scale={xScale}
// //             tickValues={allDates} // <-- force all tick values
// //             tickFormat={(d) => d} // optional: format date if needed
// //             tickLabelProps={() => ({
// //               fontSize: 11,
// //               textAnchor: 'middle',
// //               fill: axisColor,
// //               angle: -45, // optional: rotate to fit more
// //               dy: 10,
// //             })}
// //           />

// //           <AxisLeft
// //             left={margin.left}
// //             scale={yScale}
// //             tickLabelProps={() => ({ fontSize: 11, textAnchor: 'end', fill: axisColor })}
// //           />

// //           {upgradeRows.map((row) => {
// //             const x = xScale(row.date);
// //             if (x == null) return null;
// //             return row.eips.length > 0 ? row.eips.map((eip, index) => {
// //               const y = yScale(index + 1);
// //               return (
// //                 <Group key={`${row.date}-${row.upgrade}-${eip}`}>
// //                   <rect
// //                     x={x}
// //                     y={y}
// //                     width={xScale.bandwidth()}
// //                     height={20}
// //                     fill={colorMap[row.upgrade]}
// //                     rx={4}
// //                     onMouseEnter={() => setHoveredData({ eip, upgrade: row.upgrade, date: row.date })}
// //                     onMouseLeave={() => setHoveredData(null)}
// //                   />

// //                   <text
// //                     x={x + xScale.bandwidth() / 2}
// //                     y={y + 14}
// //                     textAnchor="middle"
// //                     fill="white"
// //                     fontSize={10}
// //                     fontWeight="bold"
// //                   >
// //                     {eip}
// //                   </text>
// //                 </Group>
// //               );
// //             }) : (
// //               <Group key={`${row.date}-${row.upgrade}-none`}>
// //                 <rect
// //                   x={x}
// //                   y={yScale(1)}
// //                   width={xScale.bandwidth()}
// //                   height={20}
// //                   fill={colorMap[row.upgrade]}
// //                   rx={4}
// //                 />
// //                 <text
// //                   x={x + xScale.bandwidth() / 2}
// //                   y={yScale(1) + 14}
// //                   textAnchor="middle"
// //                   fill="white"
// //                   fontSize={10}
// //                   fontWeight="bold"
// //                 >
// //                   No EIP
// //                 </text>
// //               </Group>
// //             );
// //           })}
// //         </Group>
// //       </svg>
// //       {hoveredData && (
// //         <Box
// //           position="absolute"
// //           top={mousePos.y + 10}
// //           left={mousePos.x + 10}
// //           bg="gray.800"
// //           color="white"
// //           px={2}
// //           py={1}
// //           borderRadius="md"
// //           fontSize="sm"
// //           pointerEvents="none"
// //           zIndex={10}
// //         >
// //           <Text><strong>EIP:</strong> {hoveredData.eip}</Text>
// //           <Text><strong>Upgrade:</strong> {hoveredData.upgrade}</Text>
// //           <Text><strong>Date:</strong> {hoveredData.date}</Text>
// //         </Box>
// //       )}

// //     </Box>
// //   );
// // };

// // export default NetworkUpgradesChart;


// import React, { useState, useRef, useEffect } from 'react';
// import { scaleLinear, scaleBand } from '@visx/scale';
// import { Group } from '@visx/group';
// import { AxisLeft, AxisBottom } from '@visx/axis';
// import {
//   Box, Button, Flex, HStack, IconButton, Heading, Text,
//   useColorModeValue, Tooltip, useDisclosure, VStack
// } from '@chakra-ui/react';
// import { AddIcon, MinusIcon, RepeatIcon } from '@chakra-ui/icons';
// import { saveAs } from 'file-saver';
// import CopyLink from './CopyLink';
// import CustomTooltip from "@/components/CustomTooltip";

// interface UpgradeData {
//   date: string;
//   upgrade: string;
//   eips: string[];
// }

// // Original data set
// const rawData = [
//   { date: "2021-12-09", upgrade: "Arrow Glacier", eip: "EIP-4345" },
//   { date: "2021-04-15", upgrade: "Berlin", eip: "EIP-2565" },
//   { date: "2021-04-15", upgrade: "Berlin", eip: "EIP-2929" },
//   { date: "2021-04-15", upgrade: "Berlin", eip: "EIP-2718" },
//   { date: "2021-04-15", upgrade: "Berlin", eip: "EIP-2930" },
//   { date: "2017-10-16", upgrade: "Byzantium", eip: "EIP-100" },
//   { date: "2017-10-16", upgrade: "Byzantium", eip: "EIP-140" },
//   { date: "2017-10-16", upgrade: "Byzantium", eip: "EIP-196" },
//   { date: "2017-10-16", upgrade: "Byzantium", eip: "EIP-197" },
//   { date: "2017-10-16", upgrade: "Byzantium", eip: "EIP-198" },
//   { date: "2017-10-16", upgrade: "Byzantium", eip: "EIP-211" },
//   { date: "2017-10-16", upgrade: "Byzantium", eip: "EIP-214" },
//   { date: "2017-10-16", upgrade: "Byzantium", eip: "EIP-649" },
//   { date: "2017-10-16", upgrade: "Byzantium", eip: "EIP-658" },
//   { date: "2024-03-13", upgrade: "Dencun", eip: "EIP-1153" },
//   { date: "2024-03-13", upgrade: "Dencun", eip: "EIP-4788" },
//   { date: "2024-03-13", upgrade: "Dencun", eip: "EIP-4844" },
//   { date: "2024-03-13", upgrade: "Dencun", eip: "EIP-5656" },
//   { date: "2024-03-13", upgrade: "Dencun", eip: "EIP-6780" },
//   { date: "2024-03-13", upgrade: "Dencun", eip: "EIP-7044" },
//   { date: "2024-03-13", upgrade: "Dencun", eip: "EIP-7045" },
//   { date: "2024-03-13", upgrade: "Dencun", eip: "EIP-7514" },
//   { date: "2024-03-13", upgrade: "Dencun", eip: "EIP-7516" },
//   { date: "2019-02-28", upgrade: "Constantinople", eip: "EIP-145" },
//   { date: "2019-02-28", upgrade: "Constantinople", eip: "EIP-1014" },
//   { date: "2019-02-28", upgrade: "Constantinople", eip: "EIP-1052" },
//   { date: "2019-02-28", upgrade: "Constantinople", eip: "EIP-1234" },
//   { date: "2019-02-28", upgrade: "Petersburg", eip: "EIP-1283" },
//   { date: "2019-02-28", upgrade: "Petersburg", eip: "EIP-145" },
//   { date: "2019-02-28", upgrade: "Petersburg", eip: "EIP-1014" },
//   { date: "2019-02-28", upgrade: "Petersburg", eip: "EIP-1052" },
//   { date: "2019-02-28", upgrade: "Petersburg", eip: "EIP-1234" },
//   { date: "2022-06-30", upgrade: "Gray Glacier", eip: "EIP-5133" },
//   { date: "2016-03-14", upgrade: "Homestead", eip: "EIP-2" },
//   { date: "2016-03-14", upgrade: "Homestead", eip: "EIP-7" },
//   { date: "2016-03-14", upgrade: "Homestead", eip: "EIP-8" },
//   { date: "2019-12-07", upgrade: "Istanbul", eip: "EIP-152" },
//   { date: "2019-12-07", upgrade: "Istanbul", eip: "EIP-1108" },
//   { date: "2019-12-07", upgrade: "Istanbul", eip: "EIP-1344" },
//   { date: "2019-12-07", upgrade: "Istanbul", eip: "EIP-1884" },
//   { date: "2019-12-07", upgrade: "Istanbul", eip: "EIP-2028" },
//   { date: "2019-12-07", upgrade: "Istanbul", eip: "EIP-2200" },
//   { date: "2021-08-05", upgrade: "London", eip: "EIP-1559" },
//   { date: "2021-08-05", upgrade: "London", eip: "EIP-3198" },
//   { date: "2021-08-05", upgrade: "London", eip: "EIP-3529" },
//   { date: "2021-08-05", upgrade: "London", eip: "EIP-3541" },
//   { date: "2021-08-05", upgrade: "London", eip: "EIP-3554" },
//   { date: "2020-01-02", upgrade: "Muir Glacier", eip: "EIP-2384" },
//   { date: "2015-09-07", upgrade: "Frontier Thawing", eip: "" },
//   { date: "2015-07-30", upgrade: "Frontier", eip: "" },
//   { date: "2021-10-21", upgrade: "Altair", eip: "" },
// ];

// // Group data by date-upgrade combination
// const upgradeMap: Record<string, UpgradeData> = {};
// for (const { date, upgrade, eip } of rawData) {
//   const key = `${date}-${upgrade}`;
//   if (!upgradeMap[key]) {
//     upgradeMap[key] = { date, upgrade, eips: [] };
//   }
//   if (eip) {
//     upgradeMap[key].eips.push(eip.replace("EIP-", ""));
//   }
// }

// const upgradeRows: UpgradeData[] = Object.values(upgradeMap).sort((a, b) =>
//   new Date(a.date).getTime() - new Date(b.date).getTime()
// );

// const generateDistinctColor = (index: number, total: number) => {
//   const hue = (index * (360 / total)) % 360;
//   const saturation = 85 - (index % 2) * 15;
//   const lightness = 60 - (index % 3) * 10;
//   return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
// };

// const uniqueUpgrades = [...new Set(upgradeRows.map(row => row.upgrade))];
// const colorMap = uniqueUpgrades.reduce((map, upgrade, index) => {
//   map[upgrade] = generateDistinctColor(index, uniqueUpgrades.length);
//   return map;
// }, {} as Record<string, string>);

// const NetworkUpgradesChart: React.FC = () => {
//   const [zoomLevel, setZoomLevel] = useState(1);
//   const [offset, setOffset] = useState({ x: 0, y: 0 });
//   const [isDragging, setIsDragging] = useState(false);
//   const dragStart = useRef({ x: 0, y: 0 });
//   const [hoveredData, setHoveredData] = useState<{ eip: string, upgrade: string, date: string } | null>(null);
//   const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
//   const [dimensions, setDimensions] = useState({ width: 1200, height: 500 });
//   const containerRef = useRef<HTMLDivElement>(null);

//   const bg = useColorModeValue('gray.100', 'gray.700');
//   const axisColor = useColorModeValue('#333', '#ccc');
//   const tooltipBg = useColorModeValue('white', 'gray.800');

//   // Calculate chart dimensions based on container size
//   useEffect(() => {
//     const updateDimensions = () => {
//       if (containerRef.current) {
//         const width = containerRef.current.clientWidth;
//         // Calculate height based on number of EIPs
//         const maxEips = Math.max(...upgradeRows.map(r => r.eips.length || 1));
//         const height = Math.max(400, maxEips * 35 + 150);
//         setDimensions({ width, height });
//       }
//     };

//     updateDimensions();
//     window.addEventListener('resize', updateDimensions);
//     return () => window.removeEventListener('resize', updateDimensions);
//   }, []);

//   const allDates = Array.from(new Set(upgradeRows.map(r => r.date))).sort();
//   const maxEips = Math.max(...upgradeRows.map(r => r.eips.length || 1));

//   const margin = { top: 60, right: 20, bottom: 60, left: 100 };
//   const { width, height } = dimensions;

//   const xScale = scaleBand({
//     domain: allDates,
//     range: [margin.left, width - margin.right],
//     padding: 0.3
//   });

//   const yScale = scaleLinear({
//     domain: [0, maxEips + 1],
//     range: [height - margin.bottom, margin.top]
//   });

//   const resetZoom = () => {
//     setZoomLevel(1);
//     setOffset({ x: 0, y: 0 });
//   };

//   const handleMouseDown = (e: React.MouseEvent) => {
//     setIsDragging(true);
//     dragStart.current = { x: e.clientX, y: e.clientY };
//   };

//   const handleMouseUp = () => setIsDragging(false);

//   const handleMouseMove = (e: React.MouseEvent) => {
//     const rect = e.currentTarget.getBoundingClientRect();
//     setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });

//     if (!isDragging) return;
//     const dx = e.clientX - dragStart.current.x;
//     const dy = e.clientY - dragStart.current.y;
//     dragStart.current = { x: e.clientX, y: e.clientY };
//     setOffset((prev) => ({
//       x: prev.x - dx / zoomLevel,
//       y: prev.y - dy / zoomLevel,
//     }));
//   };

//   const downloadReport = () => {
//     const headers = ['Date', 'Network Upgrade', 'EIPs'];
//     const rows = upgradeRows.map(row => ({
//       date: row.date,
//       upgrade: row.upgrade,
//       eips: row.eips.join(', ')
//     }));

//     const csv = [
//       headers,
//       ...rows.map(r => [r.date, r.upgrade, `"${r.eips}"`])
//     ].map(r => r.join(',')).join('\n');

//     const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
//     saveAs(blob, 'network_upgrade_timeline.csv');
//   };

//   return (
//     <Box 
//       bg={bg} 
//       p={4} 
//       borderRadius="lg" 
//       boxShadow="lg" 
//       w="full"
//       ref={containerRef}
//       position="relative"
//     >
//       <Flex justify="space-between" align="center" mb={4} flexWrap="wrap" gap={3}>
//         <Heading size="md">Network Upgrade Timeline <CopyLink link={`https://eipsinsight.com/upgrade#NetworkUpgrades`} /> </Heading>
//         <HStack>
//           <IconButton aria-label="Zoom In" icon={<AddIcon />} size="sm" onClick={() => setZoomLevel(z => Math.min(z * 1.2, 3))} />
//           <IconButton aria-label="Zoom Out" icon={<MinusIcon />} size="sm" onClick={() => setZoomLevel(z => Math.max(z / 1.2, 0.5))} />
//           <IconButton aria-label="Reset Zoom" icon={<RepeatIcon />} size="sm" onClick={resetZoom} />
//           <Button size="sm" colorScheme="blue" onClick={downloadReport}>Download CSV</Button>
//         </HStack>
//       </Flex>

//       {/* Scrollable Color Legend */}
//       <Box overflowX="auto" py={2} mb={4} w="full">
//         <Flex gap={4} wrap="nowrap" minW="max-content">
//           {uniqueUpgrades.map(upgrade => (
//             <Tooltip key={upgrade} label={upgrade} placement="top" hasArrow>
//               <Flex align="center" gap={2} flexShrink={0}>
//                 <Box w="12px" h="12px" borderRadius="sm" bg={colorMap[upgrade]} />
//                 <Text as="span" fontSize="sm" fontWeight="medium" lineHeight="normal">
//                   {upgrade}
//                 </Text>
//               </Flex>
//             </Tooltip>
//           ))}
//         </Flex>
//       </Box>

//       <svg
//         width="100%"
//         height={height}
//         viewBox={`${offset.x} ${offset.y} ${width / zoomLevel} ${height / zoomLevel}`}
//         onMouseDown={handleMouseDown}
//         onMouseMove={handleMouseMove}
//         onMouseUp={handleMouseUp}
//         onMouseLeave={handleMouseUp}
//       >
//         <Group>
//           <AxisBottom
//             top={height - margin.bottom}
//             scale={xScale}
//             tickValues={allDates}
//             tickFormat={(d) => d}
//             tickLabelProps={() => ({
//               fontSize: 11,
//               textAnchor: 'middle',
//               fill: axisColor,
//               dy: 10,
//             })}
//           />

//           <AxisLeft
//             left={margin.left}
//             scale={yScale}
//             numTicks={maxEips}
//             tickLabelProps={() => ({ fontSize: 11, textAnchor: 'end', fill: axisColor })}
//           />

//           {upgradeRows.map((row) => {
//             const x = xScale(row.date);
//             if (x == null) return null;

//             return row.eips.length > 0 ? row.eips.map((eip, index) => {
//               const y = yScale(index + 1);
//               return (
//                 <Group key={`${row.date}-${row.upgrade}-${eip}`}>
//                   <rect
//                     x={x}
//                     y={y}
//                     width={xScale.bandwidth()}
//                     height={20}
//                     fill={colorMap[row.upgrade]}
//                     rx={4}
//                     onMouseEnter={() => setHoveredData({ eip, upgrade: row.upgrade, date: row.date })}
//                     onMouseLeave={() => setHoveredData(null)}
//                   />

//                   <text
//                     x={x + xScale.bandwidth() / 2}
//                     y={y + 14}
//                     textAnchor="middle"
//                     fill="white"
//                     fontSize={10}
//                     fontWeight="bold"
//                     pointerEvents="none"
//                   >
//                     {eip}
//                   </text>
//                 </Group>
//               );
//             }) : (
//               <Group key={`${row.date}-${row.upgrade}-none`}>
//                 <rect
//                   x={x}
//                   y={yScale(1)}
//                   width={xScale.bandwidth()}
//                   height={20}
//                   fill={colorMap[row.upgrade]}
//                   rx={4}
//                   onMouseEnter={() => setHoveredData({ eip: "No EIP", upgrade: row.upgrade, date: row.date })}
//                   onMouseLeave={() => setHoveredData(null)}
//                 />
//                 <text
//                   x={x + xScale.bandwidth() / 2}
//                   y={yScale(1) + 14}
//                   textAnchor="middle"
//                   fill="white"
//                   fontSize={10}
//                   fontWeight="bold"
//                   pointerEvents="none"
//                 >
//                   No EIP
//                 </text>
//               </Group>
//             );
//           })}
//         </Group>
//       </svg>

//       {/* Hover Tooltip */}
//       {hoveredData && (
//         <Box
//           position="absolute"
//           top={`${mousePos.y + 10}px`}
//           left={`${mousePos.x + 10}px`}
//           bg={tooltipBg}
//           color={useColorModeValue('gray.800', 'white')}
//           px={3}
//           py={2}
//           borderRadius="md"
//           boxShadow="lg"
//           fontSize="sm"
//           pointerEvents="none"
//           zIndex={10}
//           borderWidth="1px"
//           borderColor={useColorModeValue('gray.200', 'gray.600')}
//         >
//           <VStack align="start" spacing={0}>
//             <Text fontWeight="bold">EIP: {hoveredData.eip}</Text>
//             <Text>Upgrade: {hoveredData.upgrade}</Text>
//             <Text>Date: {hoveredData.date}</Text>
//           </VStack>
//         </Box>
//       )}
//     </Box>
//   );
// };

// export default NetworkUpgradesChart;

import React, { useState, useRef, useEffect } from 'react';
import { scaleLinear, scaleBand } from '@visx/scale';
import { Group } from '@visx/group';
import { AxisLeft, AxisBottom } from '@visx/axis';
import {
  Box, Button, Flex, HStack, IconButton, Heading, Text,
  useColorModeValue, Tooltip, VStack, Wrap, WrapItem
} from '@chakra-ui/react';
import { AddIcon, MinusIcon, RepeatIcon } from '@chakra-ui/icons';
import { saveAs } from 'file-saver';
import CopyLink from './CopyLink';

interface UpgradeData {
  date: string;
  upgrade: string;
  eips: string[];
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
  { date: "2019-02-28", upgrade: "Petersburg", eip: "EIP-1283" },
  { date: "2019-02-28", upgrade: "Petersburg", eip: "EIP-145" },
  { date: "2019-02-28", upgrade: "Petersburg", eip: "EIP-1014" },
  { date: "2019-02-28", upgrade: "Petersburg", eip: "EIP-1052" },
  { date: "2019-02-28", upgrade: "Petersburg", eip: "EIP-1234" },
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
  { date: "2015-09-07", upgrade: "Frontier Thawing", eip: "" },
  { date: "2015-07-30", upgrade: "Frontier", eip: "" },
  { date: "2021-10-21", upgrade: "Altair", eip: "" },
  { date: "2025-07-05", upgrade: "Pectra", eip: "2537" },
  { date: "2025-07-05", upgrade: "Pectra", eip: "2935" },
  { date: "2025-07-05", upgrade: "Pectra", eip: "6110" },
  { date: "2025-07-05", upgrade: "Pectra", eip: "7002" },
  { date: "2025-07-05", upgrade: "Pectra", eip: "7251" },
  { date: "2025-07-05", upgrade: "Pectra", eip: "7549" },
  { date: "2025-07-05", upgrade: "Pectra", eip: "7685" },
  { date: "2025-07-05", upgrade: "Pectra", eip: "7702" },
  { date: "2025-07-05", upgrade: "Pectra", eip: "7691" },
  { date: "2025-07-05", upgrade: "Pectra", eip: "7623" },
  { date: "2025-07-05", upgrade: "Pectra", eip: "7840" },
];
// Group data by date-upgrade combination// Group data by date-upgrade combination (keeping duplicates)
const upgradeMap: Record<string, UpgradeData> = {};
for (const { date, upgrade, eip } of rawData) {
  // Create a unique key that combines date, upgrade, and index to allow duplicates
  const baseKey = `${date}-${upgrade}`;
  let key = baseKey;
  let counter = 1;

  // Find a unique key by appending a counter if needed
  while (upgradeMap[key] && upgradeMap[key].eips.includes(eip.replace("EIP-", ""))) {
    key = `${baseKey}-${counter++}`;
  }

  if (!upgradeMap[key]) {
    upgradeMap[key] = { date, upgrade, eips: [] };
  }

  // Add EIP to the upgrade if it exists
  if (eip) {
    upgradeMap[key].eips.push(eip.replace("EIP-", ""));
  }
}
const upgradeRows: UpgradeData[] = Object.values(upgradeMap).sort((a, b) =>
  new Date(a.date).getTime() - new Date(b.date).getTime()
);
const generateDistinctColor = (index: number, total: number) => {
  const hue = (index * (360 / total)) % 360;
  const saturation = 85 - (index % 2) * 15;
  const lightness = 60 - (index % 3) * 10;
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

const uniqueUpgrades = [...new Set(upgradeRows.map(row => row.upgrade))];
const colorMap = uniqueUpgrades.reduce((map, upgrade, index) => {
  map[upgrade] = generateDistinctColor(index, uniqueUpgrades.length);
  return map;
}, {} as Record<string, string>);

const NetworkUpgradesChart: React.FC = () => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const [hoveredData, setHoveredData] = useState<{ eip: string, upgrade: string, date: string } | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [dimensions, setDimensions] = useState({ width: 1200, height: 500 });
  const containerRef = useRef<HTMLDivElement>(null);

  const bg = useColorModeValue('gray.100', 'gray.700');
  const axisColor = useColorModeValue('#333', '#ccc');
  const tooltipBg = useColorModeValue('white', 'gray.800');

  // Calculate chart dimensions based on container size
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const width = containerRef.current.clientWidth;
        // Calculate height based on number of EIPs
        const maxEips = Math.max(...upgradeRows.map(r => r.eips.length || 1));
        const height = Math.max(400, maxEips * 35 + 150);
        setDimensions({ width, height });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const allDates = Array.from(new Set(upgradeRows.map(r => r.date))).sort();
  const maxEips = Math.max(...upgradeRows.map(r => r.eips.length || 1));

  const margin = { top: 60, right: 20, bottom: 60, left: 100 };
  const { width, height } = dimensions;

  const xScale = scaleBand({
    domain: allDates,
    range: [margin.left, width - margin.right],
    padding: 0.3
  });

  const yScale = scaleLinear({
    domain: [0, maxEips + 1],
    range: [height - margin.bottom, margin.top]
  });

  const resetZoom = () => {
    setZoomLevel(1);
    setOffset({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });

    if (!isDragging) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    dragStart.current = { x: e.clientX, y: e.clientY };
    setOffset((prev) => ({
      x: prev.x - dx / zoomLevel,
      y: prev.y - dy / zoomLevel,
    }));
  };

  const downloadReport = () => {
    const headers = ['Date', 'Network Upgrade', 'EIPs'];
    const rows = upgradeRows.map(row => ({
      date: row.date,
      upgrade: row.upgrade,
      eips: row.eips.join(', ')
    }));

    const csv = [
      headers,
      ...rows.map(r => [r.date, r.upgrade, `"${r.eips}"`])
    ].map(r => r.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    saveAs(blob, 'network_upgrade_timeline.csv');
  };
  const groupedUpgrades: Record<string, UpgradeData[]> = {};
  upgradeRows.forEach(row => {
    const key = row.date;
    if (!groupedUpgrades[key]) {
      groupedUpgrades[key] = [];
    }
    groupedUpgrades[key].push(row);
  });

  return (
    <Box
      bg={bg}
      p={4}
      borderRadius="lg"
      boxShadow="lg"
      w="full"
      ref={containerRef}
      position="relative"
    >
      <Flex justify="space-between" align="center" mb={4} flexWrap="wrap" gap={3}>
        <Heading size="md">Network Upgrade Timeline <CopyLink link={`https://eipsinsight.com/upgrade#NetworkUpgrades`} /> </Heading>
        <HStack>
          <IconButton aria-label="Zoom In" icon={<AddIcon />} size="sm" onClick={() => setZoomLevel(z => Math.min(z * 1.2, 3))} />
          <IconButton aria-label="Zoom Out" icon={<MinusIcon />} size="sm" onClick={() => setZoomLevel(z => Math.max(z / 1.2, 0.5))} />
          <IconButton aria-label="Reset Zoom" icon={<RepeatIcon />} size="sm" onClick={resetZoom} />
          <Button size="sm" bg="#40E0D0"
            color="white"
            _hover={{ bg: "#30c9c9" }}
            _active={{ bg: "#1fb8b8" }} onClick={downloadReport}>Download CSV</Button>
        </HStack>
      </Flex>

      {/* Wrapped Color Legend */}
      <Wrap spacing={3} justify="center" mb={4} maxW="full">
        {uniqueUpgrades.map(upgrade => (
          <WrapItem key={upgrade}>
            <Flex align="center" gap={2}>
              <Box w="10px" h="10px" borderRadius="sm" bg={colorMap[upgrade]} />
              <Text as="span" fontSize="sm" fontWeight="medium" lineHeight="normal">
                {upgrade}
              </Text>
            </Flex>
          </WrapItem>
        ))}
      </Wrap>

      <svg
        width="100%"
        height={height}
        viewBox={`${offset.x} ${offset.y} ${width / zoomLevel} ${height / zoomLevel}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <Group>
          <AxisBottom
            top={height - margin.bottom}
            scale={xScale}
            tickValues={allDates}
            tickFormat={(d) => d}
            tickLabelProps={() => ({
              fontSize: 11,
              textAnchor: 'middle',
              fill: axisColor,
              dy: 10,
            })}
          />

          <AxisLeft
            left={margin.left}
            scale={yScale}
            numTicks={maxEips}
            tickLabelProps={() => ({ fontSize: 11, textAnchor: 'end', fill: axisColor })}
          />

       // Then in the rendering:
          {Object.entries(groupedUpgrades).map(([date, upgrades]) => {
            const x = xScale(date);
            if (x == null) return null;

            // Sort upgrades: Petersburg first, then Constantinople
            const sortedUpgrades = [...upgrades].sort((a, b) =>
              a.upgrade === "Petersburg" ? -1 : 1
            );

            let eipCounter = 0;

            return sortedUpgrades.map((row) => {
              return row.eips.length > 0 ? row.eips.map((eip) => {
                eipCounter++;
                const y = yScale(eipCounter);
                return (
                  <Group key={`${date}-${row.upgrade}-${eip}`}>
                    <rect
                      x={x}
                      y={y}
                      width={xScale.bandwidth()}
                      height={20}
                      fill={colorMap[row.upgrade]}
                      rx={4}
                      onMouseEnter={() => setHoveredData({ eip, upgrade: row.upgrade, date })}
                      onMouseLeave={() => setHoveredData(null)}
                    />
                    <text
                      x={x + xScale.bandwidth() / 2}
                      y={y + 14}
                      textAnchor="middle"
                      fill="white"
                      fontSize={10}
                      fontWeight="bold"
                      pointerEvents="none"
                    >
                      {eip}
                    </text>
                  </Group>
                );
              }) : (
                // Handle no EIP case
                <Group key={`${date}-${row.upgrade}-none`}>
                  <rect
                    x={x}
                    y={yScale(++eipCounter)}
                    width={xScale.bandwidth()}
                    height={20}
                    fill={colorMap[row.upgrade]}
                    rx={4}
                    onMouseEnter={() => setHoveredData({ eip: "No EIP", upgrade: row.upgrade, date })}
                    onMouseLeave={() => setHoveredData(null)}
                  />
                  <text
                    x={x + xScale.bandwidth() / 2}
                    y={yScale(eipCounter) + 14}
                    textAnchor="middle"
                    fill="white"
                    fontSize={10}
                    fontWeight="bold"
                    pointerEvents="none"
                  >
                    No EIP
                  </text>
                </Group>
              );
            });
          })}
        </Group>
      </svg>

      {/* Hover Tooltip */}
      {hoveredData && (
        <Box
          position="absolute"
          top={`${mousePos.y + 10}px`}
          left={`${mousePos.x + 10}px`}
          bg={tooltipBg}
          color={useColorModeValue('gray.800', 'white')}
          px={3}
          py={2}
          borderRadius="md"
          boxShadow="lg"
          fontSize="sm"
          pointerEvents="none"
          zIndex={10}
          borderWidth="1px"
          borderColor={useColorModeValue('gray.200', 'gray.600')}
        >
          <VStack align="start" spacing={0}>
            <Text fontWeight="bold">EIP: {hoveredData.eip}</Text>
            <Text>Upgrade: {hoveredData.upgrade}</Text>
            <Text>Date: {hoveredData.date}</Text>
          </VStack>
        </Box>
      )}
    </Box>
  );
};

export default NetworkUpgradesChart;