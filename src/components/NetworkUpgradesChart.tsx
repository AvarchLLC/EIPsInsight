// Improved version of NetworkUpgradesChart with refined styling, fixed color mapping, and better rendering
import React, { useState, useRef, useEffect } from 'react';
import {
  Box, Button, Flex, Heading, HStack, IconButton, Text, VStack, Wrap, WrapItem,
  useColorModeValue,
  Badge,
  Collapse
} from '@chakra-ui/react';
import { AddIcon, MinusIcon, RepeatIcon, ChevronDownIcon, ChevronUpIcon, InfoIcon } from '@chakra-ui/icons';
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
  layer?: 'execution' | 'consensus';
  description?: string;
}

const upgradeDescriptions: Record<string, string> = {
  "Fusaka": "Fulu-Osaka: PeerDAS for blob scaling, gas limit increase to 60M",
  "Osaka": "Consensus layer: Future scaling improvements",
  "Pectra": "Prague-Electra: Account abstraction (EIP-7702), validator improvements",
  "Electra": "Consensus layer: Validator consolidation & staking enhancements",
  "Dencun": "Cancun-Deneb: Proto-danksharding (EIP-4844) for L2 scaling",
  "Deneb": "Consensus layer: Blob infrastructure support",
  "Shanghai": "Execution layer: Staking withdrawals enabled",
  "Capella": "Consensus layer: Validator exit & withdrawal support",
  "Paris": "The Merge: Transition to Proof of Stake",
  "Bellatrix": "Consensus layer: Merge preparation",
  "Gray Glacier": "Difficulty bomb delay",
  "Arrow Glacier": "Difficulty bomb delay",
  "Altair": "First Beacon Chain upgrade: Sync committees",
  "London": "EIP-1559 fee market reform",
  "Berlin": "Gas cost optimizations",
  "Muir Glacier": "Difficulty bomb delay",
  "Istanbul": "Privacy & interoperability improvements",
  "Constantinople": "EVM improvements & efficiency",
  "Petersburg": "Constantinople hotfix",
  "Byzantium": "Privacy & security enhancements",
  "Spurious Dragon": "DoS attack mitigation",
  "Tangerine Whistle": "DoS attack response",
  "DAO Fork": "Irregular state change to recover DAO funds",
  "Homestead": "First planned protocol upgrade",
};

const professionalColorMap: Record<string, string> = {
  "Fusaka": "#10B981",            // Emerald 500 (2025-12-03)
  "Osaka": "#10B981",             // Emerald 500 (Consensus layer)
  "Pectra": "#DC2626",            // Red 600 (2025-05-07)
  "Electra": "#DC2626",           // Red 600 (Consensus layer)
  "Dencun": "#2563EB",            // Blue 600 (2024-03-13)
  "Deneb": "#2563EB",             // Blue 600 (Consensus layer)
  "Shanghai": "#059669",          // Emerald 600 (2023-04-12)
  "Capella": "#059669",           // Emerald 600 (Consensus layer)
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
};



// Grouped data structure - each upgrade has its EIPs in an array
const rawData: UpgradeData[] = [
  // Fusaka (Fulu-Osaka) — December 3, 2025 (Execution layer)
  { 
    date: "2025-12-03", 
    upgrade: "Fusaka", 
    layer: "execution",
    eips: ["EIP-7594", "EIP-7823", "EIP-7825", "EIP-7883", "EIP-7917", "EIP-7918", "EIP-7934", "EIP-7939", "EIP-7951"]
  },

  // // Osaka — December 3, 2025 (Consensus layer)
  // { date: "2025-12-03", upgrade: "Osaka", layer: "consensus", eips: ["CONSENSUS"] },

  // Pectra (Prague-Electra) — May 7, 2025 (Execution layer)
  { 
    date: "2025-05-07", 
    upgrade: "Pectra", 
    layer: "execution",
    eips: ["EIP-2537", "EIP-2935", "EIP-6110", "EIP-7002", "EIP-7251", "EIP-7549", "EIP-7623", "EIP-7685", "EIP-7691", "EIP-7702", "EIP-7840"]
  },

  // Electra — May 7, 2025 (Consensus layer)
  // { date: "2025-05-07", upgrade: "Electra", layer: "consensus", eips: ["CONSENSUS"] },

  // Dencun (Cancun-Deneb) — March 13, 2024 (Execution layer)
  { 
    date: "2024-03-13", 
    upgrade: "Dencun", 
    layer: "execution",
    eips: ["EIP-1153", "EIP-4788", "EIP-4844", "EIP-5656", "EIP-6780", "EIP-7044", "EIP-7045", "EIP-7514", "EIP-7516"]
  },

  // Deneb — March 13, 2024 (Consensus layer)
  // { date: "2024-03-13", upgrade: "Deneb", layer: "consensus", eips: ["CONSENSUS"] },

  // Shanghai — April 12, 2023 (Execution layer)
  { 
    date: "2023-04-12", 
    upgrade: "Shanghai", 
    layer: "execution",
    eips: ["EIP-3651", "EIP-3855", "EIP-3860", "EIP-4895", "EIP-6049"]
  },

  // Capella — April 12, 2023 (Consensus layer)
  { date: "2023-04-12", upgrade: "Capella", layer: "consensus", eips: ["CONSENSUS"] },

  // Paris (The Merge) — September 15, 2022 (Execution layer)
  { date: "2022-09-15", upgrade: "Paris", layer: "execution", eips: ["EIP-3675", "EIP-4399"] },

  // Bellatrix — September 6, 2022 (Consensus layer)
  { date: "2022-09-06", upgrade: "Bellatrix", layer: "consensus", eips: ["CONSENSUS"] },

  // Gray Glacier — June 30, 2022 (Execution layer)
  { date: "2022-06-30", upgrade: "Gray Glacier", layer: "execution", eips: ["EIP-5133"] },

  // Arrow Glacier — December 9, 2021 (Execution layer)
  { date: "2021-12-09", upgrade: "Arrow Glacier", layer: "execution", eips: ["EIP-4345"] },

  // Altair — October 27, 2021 (Consensus layer)
  { date: "2021-10-27", upgrade: "Altair", layer: "consensus", eips: ["CONSENSUS"] },

  // London — August 5, 2021 (Execution layer)
  { 
    date: "2021-08-05", 
    upgrade: "London", 
    layer: "execution",
    eips: ["EIP-1559", "EIP-3198", "EIP-3529", "EIP-3541", "EIP-3554"]
  },

  // Berlin — April 15, 2021 (Execution layer)
  { 
    date: "2021-04-15", 
    upgrade: "Berlin", 
    layer: "execution",
    eips: ["EIP-2565", "EIP-2929", "EIP-2718", "EIP-2930"]
  },

  // Muir Glacier — January 2, 2020 (Execution layer)
  { date: "2020-01-02", upgrade: "Muir Glacier", layer: "execution", eips: ["EIP-2384"] },

  // Istanbul — December 8, 2019 (Execution layer)
  { 
    date: "2019-12-08", 
    upgrade: "Istanbul", 
    layer: "execution",
    eips: ["EIP-152", "EIP-1108", "EIP-1344", "EIP-1884", "EIP-2028", "EIP-2200"]
  },

  // Petersburg — February 28, 2019 (Execution layer)
  { 
    date: "2019-02-28", 
    upgrade: "Petersburg", 
    layer: "execution",
    eips: ["EIP-1283", "EIP-145", "EIP-1014", "EIP-1052"]
  },

  // Constantinople — February 28, 2019 (Execution layer)
  { 
    date: "2019-02-28", 
    upgrade: "Constantinople", 
    layer: "execution",
    eips: ["EIP-145", "EIP-1014", "EIP-1052", "EIP-1234"]
  },

  // Byzantium — October 16, 2017 (Execution layer)
  { 
    date: "2017-10-16", 
    upgrade: "Byzantium", 
    layer: "execution",
    eips: ["EIP-100", "EIP-140", "EIP-196", "EIP-197", "EIP-198", "EIP-211", "EIP-214", "EIP-649", "EIP-658"]
  },

  // Spurious Dragon — November 23, 2016 (Execution layer)
  { 
    date: "2016-11-23", 
    upgrade: "Spurious Dragon", 
    layer: "execution",
    eips: ["EIP-155", "EIP-160", "EIP-161", "EIP-170"]
  },

  // Tangerine Whistle — October 18, 2016 (Execution layer)
  { date: "2016-10-18", upgrade: "Tangerine Whistle", layer: "execution", eips: ["EIP-150"] },

  // DAO Fork — July 20, 2016 (Irregular state change)
  { date: "2016-07-20", upgrade: "DAO Fork", layer: "execution", eips: ["NO-EIP"] },

  // Homestead — March 14, 2016 (Execution layer)
  { date: "2016-03-14", upgrade: "Homestead", layer: "execution", eips: ["EIP-2", "EIP-7", "EIP-8"] },
];

// Process and format EIP display names
const upgradeRows = rawData
  .map(item => ({
    ...item,
    eips: item.eips.map(eip => 
      eip === "NO-EIP" || eip === "CONSENSUS" ? eip : eip.replace("EIP-", "")
    )
  }))
  .filter(row => row.eips.length > 0) // Only include upgrades that have actual EIPs
  .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

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
  const [showLayerInfo, setShowLayerInfo] = useState(false);
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

          {/* Collapsible Info Section */}
          <Box mt={4}>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowLayerInfo(!showLayerInfo)}
              rightIcon={showLayerInfo ? <ChevronUpIcon /> : <ChevronDownIcon />}
              leftIcon={<InfoIcon />}
              colorScheme="blue"
              fontWeight="500"
            >
              {showLayerInfo ? 'Hide' : 'Show'} Layer Information
            </Button>
            
            <Collapse in={showLayerInfo} animateOpacity>
              <Box
                mt={3}
                p={5}
                bg={useColorModeValue('blue.50', 'gray.700')}
                borderRadius="lg"
                border="1px solid"
                borderColor={useColorModeValue('blue.200', 'blue.600')}
                boxShadow="sm"
              >
                <VStack align="start" spacing={4}>
                  <Box>
                    <Heading size="sm" mb={2} color={useColorModeValue('gray.900', 'white')}>
                      Understanding Layer Badges
                    </Heading>
                    <Text fontSize="sm" color={useColorModeValue('gray.600', 'gray.300')} lineHeight="1.7">
                      Network upgrades are categorized by the layer of the Ethereum protocol they modify:
                    </Text>
                  </Box>

                  <HStack spacing={8} flexWrap="wrap">
                    <Box>
                      <HStack mb={2}>
                        <Badge colorScheme="teal" fontSize="sm" px={2} py={1}>⚙️ Execution Layer</Badge>
                      </HStack>
                      <Text fontSize="sm" color={useColorModeValue('gray.600', 'gray.300')} maxW="400px" lineHeight="1.7">
                        Protocol changes implemented through Ethereum Improvement Proposals (EIPs). These affect transaction execution, gas mechanics, smart contracts, and the Ethereum Virtual Machine (EVM).
                      </Text>
                      <Text fontSize="xs" color={useColorModeValue('gray.500', 'gray.400')} mt={1} fontStyle="italic">
                        Examples: London (EIP-1559), Shanghai (EIP-3651, EIP-3855)
                      </Text>
                    </Box>

                    <Box>
                      <HStack mb={2}>
                        <Badge colorScheme="purple" fontSize="sm" px={2} py={1}>⛓️ Consensus Layer</Badge>
                      </HStack>
                      <Text fontSize="sm" color={useColorModeValue('gray.600', 'gray.300')} maxW="400px" lineHeight="1.7">
                        Beacon Chain upgrades that don't have formal EIP numbers. These affect proof-of-stake consensus, validators, attestations, and the beacon chain protocol.
                      </Text>
                      <Text fontSize="xs" color={useColorModeValue('gray.500', 'gray.400')} mt={1} fontStyle="italic">
                        Examples: Altair (sync committees), Capella (withdrawals), Deneb (Proto-Danksharding)
                      </Text>
                    </Box>
                  </HStack>

                  <Box 
                    bg={useColorModeValue('yellow.50', 'gray.600')} 
                    p={3} 
                    borderRadius="md"
                    border="1px solid"
                    borderColor={useColorModeValue('yellow.200', 'yellow.700')}
                  >
                    <Text fontSize="xs" color={useColorModeValue('gray.700', 'gray.200')} lineHeight="1.6">
                      <strong>Note:</strong> Some network upgrades like Shanghai and Cancun contain changes to both layers, coordinated at the same activation time. The badge indicates the primary layer affected by each specific EIP or upgrade component.
                    </Text>
                  </Box>
                </VStack>
              </Box>
            </Collapse>
          </Box>
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
            overflowX="auto" 
            overflowY="hidden"
          >
          <svg
        width={width}
        height={height}
        viewBox={`${offset.x} ${offset.y} ${width / zoomLevel} ${height / zoomLevel}`}
        style={{ 
          width: `${width}px`, 
          height: `${height}px`,
          minWidth: `${width}px`,
          display: 'block'
        }}
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
              // Show upgrade names instead of dates
              return dateToUpgradeMap[date as string] || date as string;
            }}
            tickLabelProps={(value, index) => ({ 
              fontSize: 10, 
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
                    fill={colorMap[upgrade]}
                    rx={2}
                    style={{ 
                      cursor: 'pointer',
                      opacity: hoveredData?.eip === eip ? 1 : 0.9
                    }}
                    {...hoverHandlers}
                  />
                  <text
                    x={x + xScale.bandwidth() / 2}
                    y={y + 13}
                    textAnchor="middle"
                    fill="#FFFFFF"
                    fontSize={9}
                    fontWeight="600"
                    style={{ 
                      pointerEvents: 'none',
                      fontFamily: 'system-ui, -apple-system, sans-serif',
                      textShadow: '0 1px 2px rgba(0,0,0,0.2)'
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
          top={`${Math.min(mousePos.y + 15, height - 180)}px`}
          left={`${Math.min(mousePos.x + 15, width - 320)}px`}
          bg={useColorModeValue('white', 'gray.800')}
          color={useColorModeValue('gray.800', 'white')}
          px={6}
          py={5}
          borderRadius="xl"
          boxShadow={useColorModeValue('0 10px 40px rgba(0,0,0,0.2)', '0 10px 40px rgba(0,0,0,0.6)')}
          zIndex={20}
          border="2px solid"
          borderColor={colorMap[hoveredData.upgrade]}
          pointerEvents="none"
          minW="280px"
          maxW="320px"
        >
          <VStack align="start" spacing={3} width="100%">
            <HStack spacing={2} align="center" wrap="wrap">
              <Box
                bg={hoveredData.eip === "CONSENSUS" ? "purple.500" : hoveredData.eip === "NO-EIP" ? "orange.500" : "teal.500"}
                color="white"
                px={3}
                py={1}
                borderRadius="full"
                fontSize="sm"
                fontWeight="bold"
              >
                {hoveredData.eip === "CONSENSUS" ? "🔗 Consensus" : hoveredData.eip === "NO-EIP" ? "⚠️ Irregular" : `EIP-${hoveredData.eip}`}
              </Box>
              {upgradeRows.find(r => r.upgrade === hoveredData.upgrade)?.layer && (
                <Badge
                  colorScheme={upgradeRows.find(r => r.upgrade === hoveredData.upgrade)?.layer === "consensus" ? "purple" : "blue"}
                  fontSize="xs"
                  px={2}
                  py={0.5}
                  borderRadius="md"
                >
                  {upgradeRows.find(r => r.upgrade === hoveredData.upgrade)?.layer === "consensus" ? "⛓️ Consensus" : "⚙️ Execution"}
                </Badge>
              )}
            </HStack>
            
            <Box>
              <Text 
                fontSize="lg" 
                fontWeight="bold" 
                color={useColorModeValue('gray.900', 'white')}
                lineHeight="1.3"
              >
                {hoveredData.upgrade}
              </Text>
              {upgradeDescriptions[hoveredData.upgrade] && (
                <Text 
                  fontSize="sm" 
                  color={useColorModeValue('gray.600', 'gray.300')}
                  mt={2}
                  lineHeight="1.5"
                >
                  {upgradeDescriptions[hoveredData.upgrade]}
                </Text>
              )}
              <Text 
                fontSize="xs" 
                color={useColorModeValue('gray.500', 'gray.400')}
                mt={2}
                fontWeight="600"
              >
                📅 {new Date(hoveredData.date).toLocaleDateString('en-US', { 
                  month: 'long', 
                  day: 'numeric',
                  year: 'numeric' 
                })}
              </Text>
            </Box>

            {hoveredData.eip !== "CONSENSUS" && hoveredData.eip !== "NO-EIP" && (
              <Box
                w="100%"
                pt={2}
                borderTop="1px solid"
                borderColor={useColorModeValue('gray.200', 'gray.600')}
              >
                <Text 
                  fontSize="xs" 
                  color={useColorModeValue('blue.600', 'blue.400')}
                  fontWeight="medium"
                >
                  💡 Click to view EIP details
                </Text>
              </Box>
            )}
          </VStack>
        </Box>
      )}
          </Box>

          {/* Network Legend Sidebar */}
          
        </Flex>
        
        {/* DateTime Component - Outside scrollable area */}
        <Box mt={4}>
          <DateTime/>
        </Box>
      </Box>
    </Box>
  );
};

export default NetworkUpgradesChart;
