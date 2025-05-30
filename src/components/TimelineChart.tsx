// import React, { useState, useRef } from 'react';
// import { Group } from '@visx/group';
// import { scaleLinear } from '@visx/scale';
// import {
//   Box, Menu, MenuButton, MenuList, MenuItem, Button, Flex, HStack, Tooltip,
//   Slider, SliderTrack, SliderFilledTrack, SliderThumb, IconButton, Heading, useColorModeValue
// } from '@chakra-ui/react';
// import { AddIcon, MinusIcon, RepeatIcon, ChevronDownIcon } from '@chakra-ui/icons';
// import { saveAs } from 'file-saver';

// type StatusType = 'included' | 'scheduled' | 'declined' | 'considered';

// interface EIPData {
//   date: string;
//   included: string[];
//   scheduled: string[];
//   declined: string[];
//   considered: string[];
// }

// const COLOR_SCHEME: Record<StatusType, string> = {
//   included: '#48BB78',
//   scheduled: '#4299E1',
//   considered: '#F6AD55',
//   declined: '#F56565',
// };
// interface Props {
//   data: any[]; // processedData or processedData2
//   selectedOption: 'pectra' | 'fusaka';
// }
// const cubeSize = 20;
// const padding = 10;
// const rowHeight = cubeSize + 12;
// const blockHeight = cubeSize;

// const TimelineVisxChart: React.FC<Props> = ({ data, selectedOption }) => {
//   // Use data according to selected option (optional)
//   const [scrollIndex, setScrollIndex] = useState(0);
//   const [zoomLevel, setZoomLevel] = useState(1);
//   const [offset, setOffset] = useState({ x: 0, y: 0 });
//   const [isDragging, setIsDragging] = useState(false);
//   const dragStart = useRef({ x: 0, y: 0 });
//   const dataToRender = Array.isArray(data) ? data : [];

//   const maxItems = dataToRender.length === 0
//     ? 0
//     : Math.max(
//       ...dataToRender.map(
//         (d) =>
//           (d.included?.length || 0) +
//           (d.scheduled?.length || 0) +
//           (d.considered?.length || 0) +
//           (d.declined?.length || 0)
//       )
//     );


//   const maxVisibleRows = 15;
//   const visibleData = dataToRender.slice(scrollIndex, scrollIndex + maxVisibleRows);
//   const blockWidth = cubeSize * 2;
//   const blockSpacing = 6;
//   const xScale = scaleLinear({
//     domain: [0, maxItems],
//     range: [0, maxItems * (blockWidth + blockSpacing)],
//   });
//   const chartWidth = xScale(maxItems) + 200;
//   const chartHeight = visibleData?.length * rowHeight + 80;

//   const handleMouseDown = (e: React.MouseEvent) => {
//     setIsDragging(true);
//     dragStart.current = { x: e.clientX, y: e.clientY };
//   };

//   const handleMouseUp = () => setIsDragging(false);

//   const handleMouseMove = (e: React.MouseEvent) => {
//     if (!isDragging) return;
//     const dx = e.clientX - dragStart.current.x;
//     const dy = e.clientY - dragStart.current.y;
//     dragStart.current = { x: e.clientX, y: e.clientY };
//     setOffset((prev) => ({
//       x: prev.x - dx / zoomLevel,
//       y: prev.y - dy / zoomLevel,
//     }));
//   };

//   const resetZoom = () => {
//     setZoomLevel(1);
//     setOffset({ x: 0, y: 0 });
//   };

//   const downloadReport = () => {
//     const rows = dataToRender?.map((d) => ({
//       date: d.date,
//       included: d.included?.length ? d.included.join(', ') : '-',
//       considered: d.considered?.length ? d.considered.join(', ') : '-',
//       declined: d.declined?.length ? d.declined.join(', ') : '-',
//       scheduled: d.scheduled?.length ? d.scheduled.join(', ') : '-',
//     }));

//     const headers = ['ChangeDate', 'Included', 'Considered', 'Declined', 'Scheduled'];

//     const csv = [
//       headers,
//       ...rows?.map((row) => [
//         row.date,
//         `"${row.included}"`,
//         `"${row.considered}"`,
//         `"${row.declined}"`,
//         `"${row.scheduled}"`
//       ])
//     ]
//       ?.map((r) => r.join(','))
//       .join('\n');

//     const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
//     saveAs(blob, `${selectedOption}_network_upgrade.csv`);
//   };


//   const bg = useColorModeValue('gray.100', 'gray.700');
//   const headingColor = useColorModeValue('gray.700', 'gray.100');

//   const [hoveredRow, setHoveredRow] = useState<number | null>(null);
//   const [statusCounts, setStatusCounts] = useState<Record<StatusType, number>>({
//     included: 0,
//     scheduled: 0,
//     considered: 0,
//     declined: 0
//   });

//   return (
//     <Box bg={bg} p={4} borderRadius="lg" boxShadow="lg">
//       <Flex
//         justifyContent="space-between"
//         alignItems="center"
//         mb={4}
//         flexDirection={{ base: "column", md: "row" }} // Stack vertically on mobile
//         gap={{ base: 3, md: 0 }} // Add gap when stacked
//       >
//         {/* Heading - full width when stacked */}
//         <Heading
//           size="md"
//           color={headingColor}
//           mb={{ base: 2, md: 0 }} // Add bottom margin when stacked
//           textAlign={{ base: "center", md: "left" }} // Center on mobile
//         >
//           {`Network Upgrade Inclusion Stages (${selectedOption.toUpperCase()})`}
//         </Heading>

//         {/* Controls - will wrap on small screens */}
//         <Flex
//           gap={3}
//           align="center"
//           flexWrap="wrap" // Allow items to wrap
//           justifyContent={{ base: "center", md: "flex-end" }} // Center on mobile
//           width={{ base: "100%", md: "auto" }} // Full width on mobile
//         >
//           {/* Zoom controls - will stay together */}
//           <HStack spacing={1} flexShrink={0}>
//             <Tooltip label="Zoom In" aria-label="Zoom In">
//               <IconButton
//                 colorScheme="blue"
//                 aria-label="Zoom In"
//                 icon={<AddIcon />}
//                 size="sm"
//                 onClick={() => setZoomLevel(z => z * 1.2)}
//               />
//             </Tooltip>

//             <Tooltip label="Zoom Out" aria-label="Zoom Out">
//               <IconButton
//                 colorScheme="blue"
//                 aria-label="Zoom Out"
//                 icon={<MinusIcon />}
//                 size="sm"
//                 onClick={() => setZoomLevel(z => z / 1.2)}
//               />
//             </Tooltip>

//             <Tooltip label="Reset" aria-label="Reset">
//               <IconButton
//                 colorScheme="blue"
//                 aria-label="Reset"
//                 icon={<RepeatIcon />}
//                 size="sm"
//                 onClick={resetZoom}
//               />
//             </Tooltip>
//           </HStack>


//           {/* Download button - will wrap below on very small screens */}
//           <Button
//             colorScheme="blue"
//             fontSize={{ base: "0.6rem", md: "md" }}
//             size="sm" // Smaller on mobile
//             onClick={downloadReport}
//           >
//             Download CSV
//           </Button>
//         </Flex>
//       </Flex>

//       {/* Chart with vertical scroll */}
//       <Flex direction="row">

//         <svg
//           width="100%"
//           height={chartHeight}
//           viewBox={`${offset.x} ${offset.y} ${chartWidth / zoomLevel} ${chartHeight / zoomLevel}`}
//           onMouseDown={handleMouseDown}
//           onMouseMove={handleMouseMove}
//           onMouseUp={handleMouseUp}
//           onMouseLeave={handleMouseUp}
//           style={{ border: '1px solid lightgray', borderRadius: '8px', cursor: isDragging ? 'grabbing' : 'grab' }}
//         >
//           {/* Background and other elements if any */}

//           {/* Main chart content */}
//           <Group top={padding} left={padding}>
//             {visibleData.map((item, rowIndex) => {
//               const allEips: { eip: string; type: StatusType }[] = [
//                 ...(item.included ?? []).map((eip: any) => ({ eip, type: 'included' as const })),
//                 ...(item.scheduled ?? []).map((eip: any) => ({ eip, type: 'scheduled' as const })),
//                 ...(item.considered ?? []).map((eip: any) => ({ eip, type: 'considered' as const })),
//                 ...(item.declined ?? []).map((eip: any) => ({ eip, type: 'declined' as const })),
//               ];


//               return (
//                 <Group
//                   key={`row-${rowIndex}`}
//                   top={rowIndex * rowHeight}
//                   onMouseEnter={() => {
//                     setHoveredRow(rowIndex);
//                     setStatusCounts({
//                       included: item.included?.length,
//                       scheduled: item.scheduled?.length,
//                       considered: item.considered?.length,
//                       declined: item.declined?.length
//                     });
//                   }}
//                   onMouseLeave={() => setHoveredRow(null)}
//                 >
//                   {/* Date label */}
//                   <text x={0} y={blockHeight / 1.5} fontSize={12} fontWeight="bold" fill="gray">
//                     {item.date}
//                   </text>

//                   {/* EIP Blocks */}
//                   <Group left={80}>
//                     {allEips?.map((d, i) => {
//                       const eipNum = d.eip.replace(/EIP-/, '');
//                       return (
//                         <a
//                           key={`${rowIndex}-${i}`}
//                           href={`/eips/eip-${eipNum}`}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                         >
//                           <g>
//                             <rect
//                               x={xScale(i)}
//                               y={0}
//                               width={blockWidth}
//                               height={blockHeight}
//                               rx={4}
//                               fill={COLOR_SCHEME[d.type]}
//                               stroke="white"
//                             />
//                             <text
//                               x={xScale(i) + blockWidth / 2}
//                               y={blockHeight / 1.5}
//                               fontSize={9}
//                               textAnchor="middle"
//                               fill="white"
//                             >
//                               {eipNum}
//                             </text>
//                           </g>
//                         </a>
//                       );
//                     })}
//                   </Group>
//                 </Group>
//               );
//             })}
//           </Group>

//           {/* Status Count Tooltip - rendered separately to ensure it's above everything */}
//           {hoveredRow !== null && (
//             <Group
//               top={hoveredRow * rowHeight + blockHeight + 10}
//               left={padding + 80} // Match the left padding of the main content
//             >
//               {Object.entries(statusCounts)?.map(([status, count], idx) => (
//                 <Group key={status} left={idx * 100}>
//                   <rect
//                     width={90}
//                     height={20}
//                     fill="#ffffff"
//                     rx={4}
//                     stroke="#ddd"
//                     strokeWidth={1}
//                   />
//                   <text
//                     x={45}
//                     y={15}
//                     fontSize={12}
//                     textAnchor="middle"
//                     fill={COLOR_SCHEME[status as StatusType]}
//                     fontWeight="bold"
//                   >
//                     {`${status}: ${count}`}
//                   </text>
//                 </Group>
//               ))}
//             </Group>
//           )}

//           {/* Legend - bottom right */}
//           <Group top={chartHeight - padding - Object.entries(COLOR_SCHEME)?.length * 20} left={chartWidth - 200}>
//             {Object.entries(COLOR_SCHEME)?.map(([status, color], idx) => (
//               <Group key={status} top={idx * 20}>
//                 <rect width={10} height={10} fill={color} rx={2} />n
//                 <text x={16} y={10} fontSize={15} fill="gray">{status}</text>
//               </Group>
//             ))}
//           </Group>
//         </svg>
//       </Flex>
//     </Box>
//   );
// };

// export default TimelineVisxChart;


import React, { useState, useRef } from 'react';
import { Group } from '@visx/group';
import { scaleLinear } from '@visx/scale';
import { AxisBottom } from '@visx/axis';
import {
  Box, Button, Flex, HStack, Tooltip,
  IconButton, Heading, useColorModeValue, Text
} from '@chakra-ui/react';
import { AddIcon, MinusIcon, RepeatIcon } from '@chakra-ui/icons';
import { saveAs } from 'file-saver';

type StatusType = 'included' | 'scheduled' | 'declined' | 'considered';

interface EIPData {
  date: string;
  included: string[];
  scheduled: string[];
  declined: string[];
  considered: string[];
}

const COLOR_SCHEME: Record<StatusType, string> = {
  included: '#48BB78',
  scheduled: '#4299E1',
  considered: '#F6AD55',
  declined: '#F56565',
};

interface Props {
  data: EIPData[];
  selectedOption: 'pectra' | 'fusaka';
}

const cubeSize = 20;
const padding = 10;
const rowHeight = cubeSize + 12;
const blockHeight = cubeSize;

const TimelineVisxChart: React.FC<Props> = ({ data, selectedOption }) => {
  const [scrollIndex, setScrollIndex] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [hoveredEip, setHoveredEip] = useState<{ eip: string; type: StatusType } | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const dragStart = useRef({ x: 0, y: 0 });

  const dataToRender = Array.isArray(data) ? data : [];
  const maxVisibleRows = 15;
  const visibleData = dataToRender.slice(scrollIndex, scrollIndex + maxVisibleRows);

  const maxItems = Math.max(
    ...dataToRender.map(
      (d) =>
        (d.included?.length || 0) +
        (d.scheduled?.length || 0) +
        (d.considered?.length || 0) +
        (d.declined?.length || 0)
    )
  );

  const blockWidth = cubeSize * 2;
  const blockSpacing = 6;
  const xScale = scaleLinear({
    domain: [0, maxItems],
    range: [0, maxItems * (blockWidth + blockSpacing)],
  });

  const chartWidth = xScale(maxItems) + 200;
  const chartHeight = visibleData.length * rowHeight + 100;

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
    const rows = dataToRender.map((d) => ({
      date: d.date,
      included: d.included?.join(', ') || '-',
      considered: d.considered?.join(', ') || '-',
      declined: d.declined?.join(', ') || '-',
      scheduled: d.scheduled?.join(', ') || '-',
    }));

    const headers = ['ChangeDate', 'Included', 'Considered', 'Declined', 'Scheduled'];

    const csv = [
      headers,
      ...rows.map((r) => [r.date, `"${r.included}"`, `"${r.considered}"`, `"${r.declined}"`, `"${r.scheduled}"`])
    ].map((r) => r.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    saveAs(blob, `${selectedOption}_network_upgrade.csv`);
  };

  const bg = useColorModeValue('gray.100', 'gray.700');
  const headingColor = useColorModeValue('gray.700', 'gray.100');

  return (
    <Box bg={bg} p={4} borderRadius="lg" boxShadow="lg">
      <Flex justify="space-between" align="center" mb={4} flexWrap="wrap" gap={3}>
        <Heading size="md" color={headingColor}>
          {`Network Upgrade Inclusion Stages (${selectedOption.toUpperCase()})`}
        </Heading>
        <HStack>
          <IconButton aria-label="Zoom In" icon={<AddIcon />} size="sm" onClick={() => setZoomLevel(z => z * 1.2)} />
          <IconButton aria-label="Zoom Out" icon={<MinusIcon />} size="sm" onClick={() => setZoomLevel(z => z / 1.2)} />
          <IconButton aria-label="Reset Zoom" icon={<RepeatIcon />} size="sm" onClick={resetZoom} />
          <Button size="sm" colorScheme="blue" onClick={downloadReport}>Download CSV</Button>
        </HStack>
      </Flex>

      <Flex direction="row">
        <svg
          viewBox={`${offset.x} ${offset.y} ${chartWidth / zoomLevel} ${chartHeight / zoomLevel}`}
          preserveAspectRatio="xMinYMin meet"
          style={{ width: '100%', height: 'auto', maxHeight: '80vh', border: '1px solid lightgray', borderRadius: '8px', cursor: isDragging ? 'grabbing' : 'grab' }}

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
              ];

              return (
                <Group key={rowIndex} top={rowIndex * rowHeight}>
                  <text
                    x={0}
                    y={blockHeight / 1.5}
                    fontSize={12}
                    fontWeight="bold"
                    fill="gray"
                    vectorEffect="non-scaling-stroke"
                    style={{ transform: `scale(${1 / zoomLevel})`, transformOrigin: 'left center' }}
                  >
                    {item.date}
                  </text>

                  <Group left={80}>
                    {allEips.map((d, i) => {
                      const eipNum = d.eip.replace(/EIP-/, '');
                      return (
                        <a key={i} href={`/eips/eip-${eipNum}`} target="_blank" rel="noopener noreferrer">
                          <g
                            onMouseEnter={(e) => {
                              setHoveredEip(d);
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
                              fontSize={12}
                              textAnchor="middle"
                              fill="white"
                              vectorEffect="non-scaling-stroke"
                              style={{ transform: `scale(${1 / zoomLevel})`, transformOrigin: 'center' }}
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
          </Group>

          {/* X-axis */}
          <Group top={chartHeight - 30} left={padding + 80}>
            <AxisBottom
              top={0}
              scale={xScale}
              stroke="#000"
              tickStroke="#000"
              tickLabelProps={() => ({
                fontSize: 10,
                fill: '#000',
                textAnchor: 'middle',
              })}
            />
          </Group>
        </svg>
      </Flex>

      {/* Horizontal Legend */}
      <Flex mt={4} gap={6} flexWrap="wrap" justify="center" align="center">
        {(Object.entries(COLOR_SCHEME) as [StatusType, string][]).map(([status, color]) => (
          <Flex key={status} align="center" gap={2}>
            <Box w="12px" h="12px" borderRadius="full" bg={color} />
            <Box as="span" fontSize="sm" fontWeight="medium" lineHeight="normal">
              {status}
            </Box>
          </Flex>
        ))}
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
          fontSize="lg"
          fontWeight="bold"
          pointerEvents="none"
          boxShadow="lg"
        >
          <Text fontSize="lg">EIP: {hoveredEip.eip}</Text>
          <Text>Status: {hoveredEip.type}</Text>
        </Box>
      )}
    </Box>
  );
};

export default TimelineVisxChart;
