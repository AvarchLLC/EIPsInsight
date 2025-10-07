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
import { useRouter } from 'next/router';
import CopyLink from './CopyLink'; // Ensure this component exists
import DateTime from "@/components/DateTime";

interface UpgradeData {
  date: string;
  upgrade: string;
  eips: string[];
  
}


const professionalColorMap: Record<string, string> = {
  "Pectra": "#DC2626",            // Red 600 (2025-05-07)
  "Dencun": "#2563EB",            // Blue 600 (2024-03-13)
  "Shanghai": "#059669",          // Emerald 600 (2023-04-12)
  "Paris": "#7C3AED",             // Violet 600 (2022-09-15)
  "Bellatrix": "#EA580C",         // Orange 600 (2022-09-06)
  "Gray Glacier": "#4F46E5",      // Indigo 600 (2022-06-30)
  "Arrow Glacier": "#BE123C",     // Rose 700 (2021-12-09)
  "Altair": "#0284C7",            // Sky 600 (2021-10-27)
  "London": "#C026D3",            // Fuchsia 600 (2021-08-05)
  "Berlin": "#D97706",            // Amber 600 (2021-04-15)
  "Muir Glacier": "#B91C1C",      // Red 700 (2020-01-02)
  "Istanbul": "#BE185D",          // Pink 700 (2019-12-08)
  "Constantinople": "#0891B2",    // Cyan 600 (2019-02-28)
  "Petersburg": "#0D9487",        // Teal 600 (2019-02-28)
  "Byzantium": "#047857",         // Emerald 700 (2017-10-16)
  "Spurious Dragon": "#0F766E",   // Teal 700 (2016-11-23)
  "Tangerine Whistle": "#CA8A04", // Yellow 600 (2016-10-18)
  "DAO Fork": "#C2410C",          // Orange 700 (2016-07-20)
  "Homestead": "#7C2D12",         // Orange 800 (2016-03-14)
  "Frontier Thawing": "#1E40AF",  // Blue 800 (2015-09-07)
  "Frontier": "#1E3A8A",          // Blue 900 (2015-07-30)
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
  { date: "2015-09-07", upgrade: "Frontier Thawing", eip: "Gas Limit" },

  // Frontier — July 30, 2015
  { date: "2015-07-30", upgrade: "Frontier", eip: "Genesis" },
  
  // DAO Fork — July 20, 2016 (adding this properly)
  { date: "2016-07-20", upgrade: "DAO Fork", eip: "State Change" },
  
  // Bellatrix — September 6, 2022 (Consensus layer)
  { date: "2022-09-06", upgrade: "Bellatrix", eip: "Consensus" },
  
  // Altair — October 27, 2021 (Consensus layer)
  { date: "2021-10-27", upgrade: "Altair", eip: "Beacon Chain" },
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
  map[upgrade] = professionalColorMap[upgrade] || '#6B7280';
  return map;
}, {} as Record<string, string>);

const NetworkUpgradesChart: React.FC = () => {
  const router = useRouter();
  const [zoomLevel, setZoomLevel] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const [hoveredData, setHoveredData] = useState<{ date: string; upgrade: string; eip: string } | null>(null);
  const [hoveredNetwork, setHoveredNetwork] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [dimensions, setDimensions] = useState({ width: 1400, height: 500 });
  const containerRef = useRef<HTMLDivElement>(null);

  const bg = useColorModeValue('gray.50', 'gray.800');
  const axisColor = useColorModeValue('#333', '#ccc');
  const tooltipBg = useColorModeValue('white', 'gray.700');

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        // Ensure minimum width to accommodate all dates - increased spacing
        const minWidth = Math.max(2800, allDates.length * 140);
        const width = Math.max(containerRef.current.clientWidth, minWidth);
        console.log('Chart dimensions:', { minWidth, width, totalDates: allDates.length });
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
  const margin = { top: 60, right: 40, bottom: 140, left: 100 };
  const { width, height } = dimensions;

  // Create mapping from dates to upgrade names for x-axis labels
  // Handle multiple upgrades on same date by combining them
  const dateToUpgradeMap = upgradeRows.reduce((acc, row) => {
    if (!acc[row.date]) {
      acc[row.date] = row.upgrade;
    } else if (!acc[row.date].includes(row.upgrade)) {
      // If multiple upgrades on same date, combine them
      acc[row.date] = `${acc[row.date]} / ${row.upgrade}`;
    }
    return acc;
  }, {} as Record<string, string>);

  const xScale = scaleBand({ domain: allDates, range: [margin.left, width - margin.right], padding: 0.1 });
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
    const newMousePos = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    setMousePos(newMousePos);
    
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

  const handleEipClick = (eip: string) => {
    // Extract the EIP number from the EIP string (e.g., "EIP-1559" -> "1559", "3554" -> "3554")
    const eipNumber = eip.replace('EIP-', '').replace('EIP', '');
    // Navigate to the EIP detail page
    router.push(`/eips/eip-${eipNumber}`);
  };

  return (
    <Box 
      bg={useColorModeValue('white', 'gray.900')} 
      borderRadius="2xl" 
      boxShadow={useColorModeValue('0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)', '0 20px 25px -5px rgba(0, 0, 0, 0.25), 0 10px 10px -5px rgba(0, 0, 0, 0.1)')}
      ref={containerRef} 
      position="relative" 
      overflowX="auto" 
      overflowY="hidden" 
      minWidth="100%" 
      width="100%"
      border="1px solid"
      borderColor={useColorModeValue('gray.200', 'gray.700')}
    >
      {/* Outer Container */}
      <Box p={8}>
        {/* Header Section */}
        <Box 
          mb={8} 
          pb={6} 
          borderBottom="1px solid" 
          borderColor={useColorModeValue('gray.200', 'gray.700')}
        >
          <Flex justify="space-between" align="center" wrap="wrap" gap={4}>
            <Box>
              <Heading size="xl" color={useColorModeValue('gray.900', 'white')} mb={3} fontWeight="600" letterSpacing="-0.025em">
                Ethereum Network Upgrade Timeline <CopyLink link="https://eipsinsight.com/upgrade#NetworkUpgrades" />
              </Heading>
              <Text fontSize="lg" color={useColorModeValue('gray.600', 'gray.400')} fontWeight="400" lineHeight="1.6">
                Comprehensive timeline of Ethereum network upgrades and their associated EIP implementations
              </Text>
            </Box>
            <HStack spacing={4}>
              <Box bg={useColorModeValue('white', 'gray.700')} p={2} borderRadius="lg" boxShadow="sm" border="1px solid" borderColor={useColorModeValue('gray.200', 'gray.600')}>
                <HStack spacing={2}>
                  <IconButton aria-label="Zoom In" icon={<AddIcon />} size="sm" onClick={() => setZoomLevel(z => Math.min(z * 1.2, 3))} variant="ghost" colorScheme="gray" />
                  <IconButton aria-label="Zoom Out" icon={<MinusIcon />} size="sm" onClick={() => setZoomLevel(z => Math.max(z / 1.2, 0.5))} variant="ghost" colorScheme="gray" />
                  <IconButton aria-label="Reset Zoom" icon={<RepeatIcon />} size="sm" onClick={resetZoom} variant="ghost" colorScheme="gray" />
                </HStack>
              </Box>
              <Button 
                size="md" 
                bg={useColorModeValue('blue.600', 'blue.500')}
                color="white"
                onClick={downloadReport}
                fontWeight="500"
                px={6}
                _hover={{ bg: useColorModeValue('blue.700', 'blue.600'), transform: 'translateY(-1px)' }}
                _active={{ transform: 'translateY(0)' }}
                boxShadow="sm"
              >
                Export Data
              </Button>
            </HStack>
          </Flex>
        </Box>

        {/* Main Content Area */}
        <Flex gap={8} align="flex-start">
          {/* Chart Container */}
          <Box 
            bg={useColorModeValue('gray.50', 'gray.800')} 
            borderRadius="xl" 
            p={6} 
            position="relative"
            border="1px solid"
            borderColor={useColorModeValue('gray.200', 'gray.600')}
            boxShadow={useColorModeValue('inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)', 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.2)')}
            flex="1"
          >
          <svg
        width={width}
        height={height}
        viewBox={`${offset.x} ${offset.y} ${width / zoomLevel} ${height / zoomLevel}`}
        style={{ width: `${width}px`, height: `${height}px` }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={(e) => {
          handleMouseUp();
          setHoveredData(null);
        }}
      >
        <Group>
          <AxisBottom
            top={height - margin.bottom + 20}
            scale={xScale}
            tickFormat={(date) => {
              // Only show dates, not upgrade names
              return new Date(date as string).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
            }}
            tickLabelProps={(value, index) => ({ 
              fontSize: 12, 
              textAnchor: 'middle', 
              fill: useColorModeValue('#374151', '#9CA3AF'), 
              fontWeight: '600',
              dy: '0.33em',
              fontFamily: 'system-ui, -apple-system, sans-serif'
            })}
            numTicks={allDates.length}
          />
          
          {/* Add floating date badges for each upgrade */}
          {allDates.map((date) => {
            const x = xScale(date);
            const upgradeName = dateToUpgradeMap[date];
            if (x == null) return null;
            
            return (
              <g key={`date-badge-${date}`}>
                <rect
                  x={x + xScale.bandwidth() / 2 - 35}
                  y={height - margin.bottom + 75}
                  width={70}
                  height={16}
                  fill={useColorModeValue('white', '#1A202C')}
                  stroke={useColorModeValue('#E2E8F0', '#4A5568')}
                  strokeWidth={0.5}
                  rx={4}
                  opacity={0.95}
                  style={{ cursor: 'pointer' }}
                />
                <text
                  x={x + xScale.bandwidth() / 2}
                  y={height - margin.bottom + 85}
                  textAnchor="middle"
                  fontSize="8"
                  fill={useColorModeValue('#4A5568', '#CBD5E0')}
                  fontWeight="600"
                  style={{ cursor: 'pointer' }}
                >
                  {new Date(date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                </text>
              </g>
            );
          })}
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
                onMouseEnter: (e: React.MouseEvent) => {
                  e.stopPropagation();
                  setHoveredData({ date, upgrade, eip });
                },
                onMouseLeave: (e: React.MouseEvent) => {
                  e.stopPropagation();
                  setHoveredData(null);
                },
                onClick: (e: React.MouseEvent) => {
                  e.stopPropagation();
                  handleEipClick(eip);
                }
              };
              return (
                <Group key={`${date}-${upgrade}-${eip}-${j}`}>
                  <rect
                    x={x}
                    y={y}
                    width={xScale.bandwidth()}
                    height={18}
                    fill={hoveredNetwork === upgrade ? colorMap[upgrade] : `${colorMap[upgrade]}E6`}
                    rx={2}
                    style={{ 
                      cursor: 'pointer',
                      filter: hoveredNetwork === upgrade ? `drop-shadow(0px 2px 8px ${colorMap[upgrade]}40)` : 'none',
                      transition: 'all 0.3s ease-out',
                      stroke: hoveredNetwork === upgrade ? colorMap[upgrade] : 'none',
                      strokeWidth: hoveredNetwork === upgrade ? 1 : 0
                    }}
                    {...hoverHandlers}
                  />
                  <text
                    x={x + xScale.bandwidth() / 2}
                    y={y + 13}
                    textAnchor="middle"
                    fill={hoveredNetwork === upgrade ? "white" : "#FFFFFF"}
                    fontSize={9}
                    fontWeight="600"
                    style={{ 
                      pointerEvents: 'none',
                      fontFamily: 'system-ui, -apple-system, sans-serif',
                      textShadow: hoveredNetwork === upgrade ? '0 1px 2px rgba(0,0,0,0.3)' : '0 1px 2px rgba(0,0,0,0.2)',
                      transition: 'all 0.3s ease-out'
                    }}
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
          top={`${Math.min(mousePos.y + 10, height - 160)}px`}
          left={`${Math.min(mousePos.x + 10, width - 200)}px`}
          bg={tooltipBg}
          color={useColorModeValue('gray.800', 'white')}
          px={4}
          py={3}
          borderRadius="lg"
          boxShadow="lg"
          fontSize="sm"
          zIndex={20}
          border="1px solid"
          borderColor={useColorModeValue('gray.200', 'gray.600')}
          width="180px"
          pointerEvents="none"
        >
          <VStack align="start" spacing={2} width="100%">
            <Box>
              <Text fontSize="sm" fontWeight="bold" color="teal.400">
                EIP: {hoveredData.eip}
              </Text>
              <Text fontSize="xs" color={useColorModeValue('gray.500', 'gray.400')} fontStyle="italic">
                Click to view details →
              </Text>
            </Box>
            <Text fontSize="sm" fontWeight="semibold" color={useColorModeValue('gray.700', 'gray.200')}>
              {hoveredData.upgrade}
            </Text>
            
            <Box 
              width="100%" 
              p={2} 
              bg={useColorModeValue('blue.50', 'blue.900')} 
              borderRadius="md" 
              border="1px solid" 
              borderColor={useColorModeValue('blue.200', 'blue.600')}
            >
              <Text fontSize="xs" fontWeight="bold" color={useColorModeValue('blue.600', 'blue.300')} mb={1}>
                📅 LAUNCH DATE
              </Text>
              <Text fontSize="xs" fontWeight="bold" color={useColorModeValue('blue.800', 'blue.100')} mb={1}>
                {new Date(hoveredData.date).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </Text>
              <Text fontSize="xs" color={useColorModeValue('gray.600', 'gray.400')}>
                {Math.floor((new Date().getTime() - new Date(hoveredData.date).getTime()) / (1000 * 60 * 60 * 24 * 365.25))} years ago
              </Text>
            </Box>
          </VStack>
        </Box>
      )}
          <DateTime/>
          </Box>

          {/* Network Legend Sidebar */}
          
        </Flex>
      </Box>
    </Box>
  );
};

export default NetworkUpgradesChart;
