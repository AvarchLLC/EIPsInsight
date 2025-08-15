// Improved version of NetworkUpgradesChart with refined styling, fixed color mapping, and better rendering
import React, { useState, useRef, useEffect } from 'react';
import {
  Box, Button, Flex, Heading, HStack, IconButton, Text, VStack, Wrap, WrapItem,
  useColorModeValue
} from '@chakra-ui/react';
import { AddIcon, MinusIcon, RepeatIcon } from '@chakra-ui/icons';
import { AxisBottom, AxisLeft } from '@visx/axis';
import { scaleBand, scaleLinear } from '@visx/scale';
import { Group } from '@visx/group';
import { saveAs } from 'file-saver';
import CopyLink from './CopyLink'; // Ensure this component exists
import DateTime from "@/components/DateTime";

interface UpgradeData {
  date: string;
  upgrade: string;
  eips: string[];
  
}


const pastelColorMap: Record<string, string> = {
  "Pectra": "#e17055",            // Coral Orange (2025-05-07)
  "Dencun": "#0984e3",            // Vivid Blue (2024-03-13)
  "Shanghai": "#00b894",          // Emerald Green (2023-04-12)
  "Paris": "#e57373",             // Pastel Red (2022-09-15)
  "Bellatrix": "#ff7675",         // Light Red (2022-09-06)
  "Gray Glacier": "#6c5ce7",      // Bold Indigo (2022-06-30)
  "Arrow Glacier": "#ff4c4c",     // Bright Red (2021-12-09)
  "Altair": "#74b9ff",            // Sky Blue (2021-10-27)
  "London": "#fd79a8",            // Rose Pink (2021-08-05)
  "Berlin": "#ff6f00",            // Deep Orange (2021-04-15)
  "Muir Glacier": "#d63031",      // Crimson Red (2020-01-02)
  "Istanbul": "#e84393",          // Pink Magenta (2019-12-08)
  "Constantinople": "#00cec9",    // Teal Cyan (2019-02-28)
  "Petersburg": "#00e5ff",        // Electric Cyan (2019-02-28)
  "Byzantium": "#00b894",         // Emerald Green (2017-10-16)
  "Spurious Dragon": "#81ecec",   // Light Teal (2016-11-23)
  "Tangerine Whistle": "#fdcb6e", // Light Orange (2016-10-18)
  "DAO Fork": "#fab1a0",          // Light Peach (2016-07-20)
  "Homestead": "#a29bfe",         // Soft Violet (2016-03-14)
  "Frontier Thawing": "#55a3ff",  // Light Blue (2015-09-07)
  "Frontier": "#6c5ce7",          // Bold Indigo (2015-07-30)
};



// Original data set
const rawData = [
  // Pectra (Prague-Electra) — May 7, 2025
  { date: "2025-05-07", upgrade: "Pectra", eip: "EIP-2537" },
  { date: "2025-05-07", upgrade: "Pectra", eip: "EIP-2935" },
  { date: "2025-05-07", upgrade: "Pectra", eip: "EIP-6110" },
  { date: "2025-05-07", upgrade: "Pectra", eip: "EIP-7002" },
  { date: "2025-05-07", upgrade: "Pectra", eip: "EIP-7251" },
  { date: "2025-05-07", upgrade: "Pectra", eip: "EIP-7549" },
  { date: "2025-05-07", upgrade: "Pectra", eip: "EIP-7623" },
  { date: "2025-05-07", upgrade: "Pectra", eip: "EIP-7685" },
  { date: "2025-05-07", upgrade: "Pectra", eip: "EIP-7691" },
  { date: "2025-05-07", upgrade: "Pectra", eip: "EIP-7702" },
  { date: "2025-05-07", upgrade: "Pectra", eip: "EIP-7840" },

  // Dencun (Cancun-Deneb) — March 13, 2024
  { date: "2024-03-13", upgrade: "Dencun", eip: "EIP-1153" },
  { date: "2024-03-13", upgrade: "Dencun", eip: "EIP-4788" },
  { date: "2024-03-13", upgrade: "Dencun", eip: "EIP-4844" },
  { date: "2024-03-13", upgrade: "Dencun", eip: "EIP-5656" },
  { date: "2024-03-13", upgrade: "Dencun", eip: "EIP-6780" },
  { date: "2024-03-13", upgrade: "Dencun", eip: "EIP-7044" },
  { date: "2024-03-13", upgrade: "Dencun", eip: "EIP-7045" },
  { date: "2024-03-13", upgrade: "Dencun", eip: "EIP-7514" },
  { date: "2024-03-13", upgrade: "Dencun", eip: "EIP-7516" },

  // Shanghai/Capella ("Shapella") — April 12, 2023
  { date: "2023-04-12", upgrade: "Shanghai", eip: "EIP-3651" },
  { date: "2023-04-12", upgrade: "Shanghai", eip: "EIP-3855" },
  { date: "2023-04-12", upgrade: "Shanghai", eip: "EIP-3860" },
  { date: "2023-04-12", upgrade: "Shanghai", eip: "EIP-4895" },
  { date: "2023-04-12", upgrade: "Shanghai", eip: "EIP-6049" },

  // Paris (The Merge) — September 15, 2022
  { date: "2022-09-15", upgrade: "Paris", eip: "EIP-3675" },
  { date: "2022-09-15", upgrade: "Paris", eip: "EIP-4399" },

  // Bellatrix — September 6, 2022 [Consensus layer upgrade]
  // No EIPs directly, consensus-side upgrade for The Merge preparation

  // Gray Glacier — June 30, 2022
  { date: "2022-06-30", upgrade: "Gray Glacier", eip: "EIP-5133" },

  // Arrow Glacier — December 9, 2021
  { date: "2021-12-09", upgrade: "Arrow Glacier", eip: "EIP-4345" },

  // Altair — October 27, 2021 [Consensus layer upgrade]
  // No EIPs directly, consensus-side upgrade for Beacon Chain

  // London — August 5, 2021
  { date: "2021-08-05", upgrade: "London", eip: "EIP-1559" },
  { date: "2021-08-05", upgrade: "London", eip: "EIP-3198" },
  { date: "2021-08-05", upgrade: "London", eip: "EIP-3529" },
  { date: "2021-08-05", upgrade: "London", eip: "EIP-3541" },
  { date: "2021-08-05", upgrade: "London", eip: "EIP-3554" },

  // Berlin — April 15, 2021
  { date: "2021-04-15", upgrade: "Berlin", eip: "EIP-2565" },
  { date: "2021-04-15", upgrade: "Berlin", eip: "EIP-2929" },
  { date: "2021-04-15", upgrade: "Berlin", eip: "EIP-2718" },
  { date: "2021-04-15", upgrade: "Berlin", eip: "EIP-2930" },

  // Muir Glacier — January 2, 2020
  { date: "2020-01-02", upgrade: "Muir Glacier", eip: "EIP-2384" },

  // Istanbul — December 8, 2019
  { date: "2019-12-08", upgrade: "Istanbul", eip: "EIP-152" },
  { date: "2019-12-08", upgrade: "Istanbul", eip: "EIP-1108" },
  { date: "2019-12-08", upgrade: "Istanbul", eip: "EIP-1344" },
  { date: "2019-12-08", upgrade: "Istanbul", eip: "EIP-1884" },
  { date: "2019-12-08", upgrade: "Istanbul", eip: "EIP-2028" },
  { date: "2019-12-08", upgrade: "Istanbul", eip: "EIP-2200" },

  // Constantinople — February 28, 2019
  { date: "2019-02-28", upgrade: "Constantinople", eip: "EIP-145" },
  { date: "2019-02-28", upgrade: "Constantinople", eip: "EIP-1014" },
  { date: "2019-02-28", upgrade: "Constantinople", eip: "EIP-1052" },
  { date: "2019-02-28", upgrade: "Constantinople", eip: "EIP-1234" },
  // (Petersburg hard fork was simultaneous; repeat EIPs where relevant)
  { date: "2019-02-28", upgrade: "Petersburg", eip: "EIP-1283" },
  { date: "2019-02-28", upgrade: "Petersburg", eip: "EIP-145" },
  { date: "2019-02-28", upgrade: "Petersburg", eip: "EIP-1014" },
  { date: "2019-02-28", upgrade: "Petersburg", eip: "EIP-1052" },
  { date: "2019-02-28", upgrade: "Petersburg", eip: "EIP-1234" },

  // Byzantium — October 16, 2017
  { date: "2017-10-16", upgrade: "Byzantium", eip: "EIP-100" },
  { date: "2017-10-16", upgrade: "Byzantium", eip: "EIP-140" },
  { date: "2017-10-16", upgrade: "Byzantium", eip: "EIP-196" },
  { date: "2017-10-16", upgrade: "Byzantium", eip: "EIP-197" },
  { date: "2017-10-16", upgrade: "Byzantium", eip: "EIP-198" },
  { date: "2017-10-16", upgrade: "Byzantium", eip: "EIP-211" },
  { date: "2017-10-16", upgrade: "Byzantium", eip: "EIP-214" },
  { date: "2017-10-16", upgrade: "Byzantium", eip: "EIP-649" },
  { date: "2017-10-16", upgrade: "Byzantium", eip: "EIP-658" },

  // Homestead — March 14, 2016
  { date: "2016-03-14", upgrade: "Homestead", eip: "EIP-2" },
  { date: "2016-03-14", upgrade: "Homestead", eip: "EIP-7" },
  { date: "2016-03-14", upgrade: "Homestead", eip: "EIP-8" },

  // DAO Fork — July 20, 2016
  // No specific EIP, was an irregular state change to recover DAO funds

  // Tangerine Whistle — October 18, 2016
  { date: "2016-10-18", upgrade: "Tangerine Whistle", eip: "EIP-150" },

  // Spurious Dragon — November 23, 2016
  { date: "2016-11-23", upgrade: "Spurious Dragon", eip: "EIP-155" },
  { date: "2016-11-23", upgrade: "Spurious Dragon", eip: "EIP-160" },
  { date: "2016-11-23", upgrade: "Spurious Dragon", eip: "EIP-161" },
  { date: "2016-11-23", upgrade: "Spurious Dragon", eip: "EIP-170" },

  // Frontier Thawing — September 7, 2015
  // No specific EIP, lifted the 5,000 gas limit

  // Frontier — July 30, 2015
  // No EIPs, original Ethereum launch
];

// Group data by date-upgrade combination// Group data by date-upgrade combination (keeping duplicates)
const upgradeMap: Record<string, { date: string, upgrade: string, eips: string[] }> = {};
for (const { date, upgrade, eip } of rawData) {
  const baseKey = `${date}-${upgrade}`;
  let key = baseKey;
  let counter = 1;
  while (upgradeMap[key] && upgradeMap[key].eips.includes(eip.replace("EIP-", ""))) {
    key = `${baseKey}-${counter++}`;
  }
  if (!upgradeMap[key]) upgradeMap[key] = { date, upgrade, eips: [] };
  if (eip) upgradeMap[key].eips.push(eip.replace("EIP-", ""));
}

const upgradeRows = Object.values(upgradeMap).sort(
  (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
);

const uniqueUpgrades = [...new Set(upgradeRows.map(r => r.upgrade))];
const colorMap = uniqueUpgrades.reduce((map, upgrade) => {
  map[upgrade] = pastelColorMap[upgrade] || '#ccc';
  return map;
}, {} as Record<string, string>);

const NetworkUpgradesChart: React.FC = () => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const [hoveredData, setHoveredData] = useState<{ date: string; upgrade: string; eip: string } | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [dimensions, setDimensions] = useState({ width: 1200, height: 500 });
  const containerRef = useRef<HTMLDivElement>(null);

  const bg = useColorModeValue('gray.50', 'gray.800');
  const axisColor = useColorModeValue('#333', '#ccc');
  const tooltipBg = useColorModeValue('white', 'gray.700');

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const width = containerRef.current.clientWidth;
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

  const xScale = scaleBand({ domain: allDates, range: [margin.left, width - margin.right], padding: 0.3 });
  const yScale = scaleLinear({ domain: [0, maxEips + 1], range: [height - margin.bottom, margin.top] });

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
    setOffset((prev) => ({ x: prev.x - dx / zoomLevel, y: prev.y - dy / zoomLevel }));
  };

  const downloadReport = () => {
    const headers = ['Date', 'Network Upgrade', 'EIPs'];
    const rows = upgradeRows.map(row => [row.date, row.upgrade, row.eips.join(', ')]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    saveAs(blob, 'network_upgrade_timeline.csv');
  };

  return (
    <Box bg={bg} p={4} borderRadius="lg" boxShadow="lg" ref={containerRef} position="relative">
      <Flex justify="space-between" align="center" mb={4} wrap="wrap" gap={3}>
        <Heading size="md">Network Upgrade Timeline <CopyLink link="https://eipsinsight.com/upgrade#NetworkUpgrades" /></Heading>
        <HStack>
          <IconButton aria-label="Zoom In" icon={<AddIcon />} size="sm" onClick={() => setZoomLevel(z => Math.min(z * 1.2, 3))} />
          <IconButton aria-label="Zoom Out" icon={<MinusIcon />} size="sm" onClick={() => setZoomLevel(z => Math.max(z / 1.2, 0.5))} />
          <IconButton aria-label="Reset Zoom" icon={<RepeatIcon />} size="sm" onClick={resetZoom} />
          <Button size="sm" bg="teal.400" color="white" _hover={{ bg: 'teal.500' }} onClick={downloadReport}>Download CSV</Button>
        </HStack>
      </Flex>

      <VStack spacing={2} mb={-10}>
        {[0, 1].map(rowIndex => (
          <Wrap key={rowIndex} spacing={3} justify="center">
            {uniqueUpgrades
              .slice(rowIndex * Math.ceil(uniqueUpgrades.length / 2), (rowIndex + 1) * Math.ceil(uniqueUpgrades.length / 2))
              .map(upgrade => (
                <WrapItem key={upgrade}>
                  <Flex align="baseline" gap={2}>
                    <Box w="10px" h="10px" bg={colorMap[upgrade]} borderRadius="sm" flexShrink={0} />
                    <Text fontSize="sm">{upgrade}</Text>
                  </Flex>
                </WrapItem>
              ))}
          </Wrap>
        ))}
      </VStack>

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
            tickLabelProps={() => ({ fontSize: 10, textAnchor: 'middle', fill: axisColor })}
          />
          <AxisLeft
            left={margin.left}
            scale={yScale}
            tickLabelProps={() => ({ fontSize: 10, textAnchor: 'end', fill: axisColor })}
          />

          {upgradeRows.map(({ date, upgrade, eips }, i) => {
            const x = xScale(date);
            if (x == null) return null;
            return eips.map((eip, j) => {
              const y = yScale(j + 1);
              const hoverHandlers = {
                onMouseEnter: () => setHoveredData({ date, upgrade, eip }),
                onMouseLeave: () => setHoveredData(null)
              };
              return (
                <Group key={`${date}-${upgrade}-${eip}`}>
                  <rect
                    x={x}
                    y={y}
                    width={xScale.bandwidth()}
                    height={20}
                    fill={colorMap[upgrade]}
                    rx={4}
                    {...hoverHandlers}
                  />
                  <text
                    x={x + xScale.bandwidth() / 2}
                    y={y + 14}
                    textAnchor="middle"
                    fill="white"
                    fontSize={10}
                    fontWeight="bold"
                    style={{ pointerEvents: 'none' }}
                  >
                    {eip}
                  </text>
                </Group>
              );
            });
          })}
        </Group>
      </svg>

      {hoveredData && (
        <Box
          position="absolute"
          top={`${mousePos.y + 5}px`}
          left={`${mousePos.x + 5}px`}
          bg={tooltipBg}
          color={useColorModeValue('gray.800', 'white')}
          px={3}
          py={2}
          borderRadius="md"
          boxShadow="lg"
          fontSize="sm"
          zIndex={10}
        >
          <VStack align="start" spacing={0}>
            <Text fontWeight="bold">EIP: {hoveredData.eip}</Text>
            <Text>Upgrade: {hoveredData.upgrade}</Text>
            <Text>Date: {hoveredData.date}</Text>
          </VStack>
        </Box>
      )}
      <DateTime/>
    </Box>
  );
};

export default NetworkUpgradesChart;
