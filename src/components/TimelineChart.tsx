import React, { useState, useRef } from 'react';
import { Group } from '@visx/group';
import { scaleLinear } from '@visx/scale';
import {
  Box, Button, Flex, HStack,
  IconButton, Heading, useColorModeValue, Text
} from '@chakra-ui/react';
import { AddIcon, MinusIcon, RepeatIcon } from '@chakra-ui/icons';
import { saveAs } from 'file-saver';
import Link from "next/link";
import DateTime from './DateTime';

// Add 'proposed' to StatusType
type StatusType = 'included' | 'scheduled' | 'declined' | 'considered' | 'proposed';

interface EIPData {
  date: string;
  included: string[];
  scheduled: string[];
  declined: string[];
  considered: string[];
  proposed: string[]; // Added field
}


const COLOR_SCHEME: Record<StatusType, string> = {
  included: '#48BB78',
  scheduled: '#4299E1',
  considered: '#F6AD55',
  declined: '#F56565',
  proposed: '#9F7AEA', // Purple-ish for 'proposed'
};

const LEGEND_LABELS: Record<StatusType, string> = {
  included: 'INCLUDED',
  scheduled: 'SFI',
  considered: 'CFI',
  declined: 'DFI',
  proposed: 'PFI', // Proposed-for-inclusion
};

// Map dates to upgrade names based on Ethereum upgrade timeline
const getUpgradeNameForDate = (date: string): string => {
  const dateObj = new Date(date);
  // Homestead: 2016-03-14
  if (dateObj <= new Date('2016-09-01')) return 'Homestead';
  // Tangerine Whistle & Spurious Dragon: 2016
  if (dateObj <= new Date('2017-09-01')) return 'Spurious Dragon';
  // Byzantium: 2017-10-16
  if (dateObj <= new Date('2019-01-01')) return 'Byzantium';
  // Petersburg: 2019-02-28
  if (dateObj <= new Date('2019-11-01')) return 'Petersburg';
  // Istanbul: 2019-12-08
  if (dateObj <= new Date('2020-07-01')) return 'Istanbul';
  // Muir Glacier & Berlin: 2020-2021
  if (dateObj <= new Date('2021-07-01')) return 'Berlin';
  // London: 2021-08-05
  if (dateObj <= new Date('2021-11-01')) return 'London';
  // Arrow Glacier & Gray Glacier: 2021-2022
  if (dateObj <= new Date('2022-08-01')) return 'Gray Glacier';
  // Paris (The Merge): 2022-09-15
  if (dateObj <= new Date('2023-03-01')) return 'Paris';
  // Shanghai: 2023-04-12
  if (dateObj <= new Date('2024-02-01')) return 'Shanghai';
  // Dencun: 2024-03-13
  if (dateObj <= new Date('2025-01-01')) return 'Dencun';
  // Pectra: 2024-2025
  if (dateObj <= new Date('2025-08-01')) return 'Pectra';
  // Fusaka: 2025+
  return 'Fusaka';
};


interface Props {
  data: EIPData[];
  selectedOption: 'pectra' | 'fusaka' | 'glamsterdam'; // Updated to include glamsterdam
}

const cubeSize = 24;
const blockHeight = cubeSize;
const blockWidth = cubeSize * 2;
const padding = 2;
const rowHeight = cubeSize + 12;

const TimelineVisxChart: React.FC<Props> = ({ data, selectedOption }) => {
  const [scrollIndex, setScrollIndex] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  // Add `date` to hoveredEip!
  const [hoveredEip, setHoveredEip] = useState<{
  eip: string;
  type: StatusType;
  date: string;
  statusCounts: {
    included: number;
    scheduled: number;
    considered: number;
    declined: number;
    proposed?: number; // Optional for proposed
  };
} | null>(null);

  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const dragStart = useRef({ x: 0, y: 0 });

  const dataToRender = Array.isArray(data) ? data : [];
  const maxVisibleRows = 15;
  const visibleData = [...dataToRender].reverse().slice(scrollIndex, scrollIndex + maxVisibleRows);

const MIN_ITEMS_DISPLAYED = 7; // Tune this!
const maxItems = Math.max(
  MIN_ITEMS_DISPLAYED,
  ...dataToRender.map(
    (d) =>
      (d.included?.length || 0) +
      (d.scheduled?.length || 0) +
      (d.considered?.length || 0) +
      (d.declined?.length || 0) +
      (d.proposed?.length || 0)
  )
);


  const blockSpacing = 6;
  const xScale = scaleLinear({
    domain: [0, maxItems],
    range: [0, maxItems * (blockWidth + blockSpacing)],
  });
  const chartWidth = xScale(maxItems) + 200;

  const chartPaddingBottom = 40; // or adjust
  const chartHeight = visibleData.length * rowHeight + chartPaddingBottom;

  const resetZoom = () => {
    setZoomLevel(1);
    setOffset({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => setIsDragging(false);

  const changeStatus = (status: string) => {
    if (status.toLowerCase() === 'included') return 'INCLUDED'
    if (status.toLowerCase() === 'scheduled') return 'SFI'
    if (status.toLowerCase() === 'considered') return 'CFI'
    if (status.toLowerCase() === 'declined') return 'DFI'
    if (status.toLowerCase() === 'proposed') return 'PFI' // For proposed
    return status;
  }

  const handleMouseMove = (e: React.MouseEvent) => {
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
    const rows = [...dataToRender].reverse().map((d) => ({
      date: d.date,
      included: d.included?.join(', ') || '-',
      considered: d.considered?.join(', ') || '-',
      declined: d.declined?.join(', ') || '-',
      scheduled: d.scheduled?.join(', ') || '-',
    }));

    const headers = ['ChangeDate', 'Included', 'Considered', 'Declined', 'Scheduled', 'Proposed'];

    const csv = [
      headers,
      ...rows.map((r) => [r.date, `"${r.included}"`, `"${r.considered}"`, `"${r.declined}"`, `"${r.scheduled}"`])
    ].map((r) => r.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    saveAs(blob, `${selectedOption}_network_upgrade.csv`);
  };

  const bg = useColorModeValue('gray.100', 'gray.700');
  const headingColor = useColorModeValue('gray.700', 'gray.100');

const linkHref =
  selectedOption === "pectra"
    ? "/eips/eip-7600"
    : selectedOption === "fusaka"
      ? "/eips/eip-7607"
      : selectedOption === "glamsterdam"
        ? "/eips/eip-7773"
        : "#";


  return (
    <Box bg={bg} p={4} borderRadius="lg" boxShadow="lg">
      <Flex justify="space-between" align="center" flexWrap="wrap" gap={3}>
        <Heading size="md" color={headingColor}>
          Network Upgrade Inclusion Stages
        </Heading>
        <HStack>
          <IconButton aria-label="Zoom In" icon={<AddIcon />} size="sm" onClick={() => setZoomLevel(z => z * 1.2)} />
          <IconButton aria-label="Zoom Out" icon={<MinusIcon />} size="sm" onClick={() => setZoomLevel(z => z / 1.2)} />
          <IconButton aria-label="Reset Zoom" icon={<RepeatIcon />} size="sm" onClick={resetZoom} />
          <Button size="sm" bg="#40E0D0"
            color="white"
            _hover={{ bg: "#30c9c9" }}
            _active={{ bg: "#1fb8b8" }} onClick={downloadReport}>Download CSV</Button>
        </HStack>
      </Flex>
      {/* Horizontal Legend */}
      <Flex mt={4} gap={6} flexWrap="wrap" justify="center" align="center">
        {(Object.entries(COLOR_SCHEME) as [StatusType, string][]).map(([status, color]) => (
          <Flex key={status} align="center" gap={2}>
            <Box w="12px" h="12px" borderRadius="full" bg={color} />
            <Box as="span" fontSize="sm" fontWeight="medium" lineHeight="normal">
              {LEGEND_LABELS[status]}
            </Box>
          </Flex>
        ))}
      </Flex>
      <Flex direction="row">
        <svg
          viewBox={`${offset.x} ${offset.y} ${chartWidth / zoomLevel} ${chartHeight / zoomLevel}`}
          preserveAspectRatio="xMinYMin meet"
          style={{ width: '100%', height: 'auto', borderRadius: '8px' }}

          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <Group top={padding} left={padding}>
            {visibleData.map((item, rowIndex) => {
              const allEips: { eip: string; type: StatusType }[] = [
                ...(item.included ?? []).map((eip) => ({ eip, type: 'included' as const })),
                ...(item.scheduled ?? []).map((eip) => ({ eip, type: 'scheduled' as const })),
                ...(item.considered ?? []).map((eip) => ({ eip, type: 'considered' as const })),
                ...(item.declined ?? []).map((eip) => ({ eip, type: 'declined' as const })),
                ...(item.proposed ?? []).map((eip) => ({ eip, type: 'proposed' as const })),
              ];

              return (
                <Group key={rowIndex} top={rowIndex * rowHeight}>
                  <Group left={0}>
                    {allEips.map((d, i) => {
                      const eipNum = d.eip.replace(/EIP-/, '');
                      return (
                        <a key={i} href={`/eips/eip-${eipNum}`} target="_blank" rel="noopener noreferrer">
                          <g
onMouseEnter={(e) => {
  setHoveredEip({
    ...d,
    date: item.date,
    statusCounts: {
      included: item.included?.length || 0,
      scheduled: item.scheduled?.length || 0,
      considered: item.considered?.length || 0,
      declined: item.declined?.length || 0,
      proposed: item.proposed?.length || 0, // Optional for proposed
    },
  });
  setTooltipPos({ x: e.clientX, y: e.clientY });
}}

                            onMouseLeave={() => setHoveredEip(null)}
                          >
                            <rect
                              x={xScale(i)}
                              y={0}
                              width={blockWidth}
                              height={blockHeight}
                              rx={4}
                              fill={COLOR_SCHEME[d.type]}
                              stroke="white"
                            />
                            <text
                              x={xScale(i) + blockWidth / 2}
                              y={blockHeight / 1.5}
                              fontSize={16}
                              textAnchor="middle"
                              fill="white"
                              vectorEffect="non-scaling-stroke"
                            >
                              {eipNum}
                            </text>
                          </g>
                        </a>
                      );
                    })}
                  </Group>
                </Group>
              );
            })}
            {/* X-Axis Labels: Upgrade Names */}
            {visibleData.map((item, rowIndex) => {
              const upgradeName = getUpgradeNameForDate(item.date);
              const yPos = (rowIndex * rowHeight) + blockHeight + 30;
              return (
                <g key={`xlabel-${rowIndex}`}>
                  <text
                    x={-10}
                    y={yPos}
                    fontSize={10}
                    fontWeight="600"
                    fill="#40E0D0"
                    textAnchor="end"
                    vectorEffect="non-scaling-stroke"
                    style={{ cursor: 'pointer' }}
                  >
                    {upgradeName}
                  </text>
                  <title>{item.date}</title>
                </g>
              );
            })}
            {/* Upgrade Name at Bottom */}

          </Group>
        </svg>
      </Flex>

      {/* Tooltip */}
{hoveredEip && (
  <Box
    position="fixed"
    left={tooltipPos.x + 10}
    top={tooltipPos.y + 10}
    zIndex={999}
    bg="gray.800"
    color="white"
    px={4}
    py={3}
    borderRadius="md"
    fontSize="md"
    fontWeight="normal"
    pointerEvents="none"
    boxShadow="lg"
    maxW="260px"
    minW="185px"
  >
    <Text fontSize="lg" fontWeight="bold">{hoveredEip.eip}</Text>
    <Text>
      Status: <b>{changeStatus(hoveredEip.type)}</b>
    </Text>
    <Text>Date: {hoveredEip.date}</Text>
    <Box mt={2}>
      <Text fontWeight="bold" mb={1}>EIP Counts for this date:</Text>
      <Text fontSize="sm" color="green.200">
        INCLUDED: {hoveredEip.statusCounts.included}
      </Text>
      <Text fontSize="sm" color="blue.200">
        SFI: {hoveredEip.statusCounts.scheduled}
      </Text>
      <Text fontSize="sm" color="orange.200">
        CFI: {hoveredEip.statusCounts.considered}
      </Text>
      <Text fontSize="sm" color="red.200">
        DFI: {hoveredEip.statusCounts.declined}
      </Text>
      {hoveredEip.statusCounts.proposed !== undefined && (
        <Text fontSize="sm" color="purple.200">
          PFI: {hoveredEip.statusCounts.proposed}
        </Text>
      )}
    </Box>
  </Box>
)}



      <DateTime />
    </Box>
  );
};

export default TimelineVisxChart;
