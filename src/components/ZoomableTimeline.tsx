import React, { useState, useRef } from 'react';
import {
  Box,
  HStack,
  IconButton,
  useColorModeValue,
  Tooltip,
  VStack,
} from '@chakra-ui/react';
import { AddIcon, MinusIcon, RepeatIcon } from '@chakra-ui/icons';

interface ZoomableTimelineProps {
  svgPath: string;
  alt?: string;
}

const ZoomableTimeline: React.FC<ZoomableTimelineProps> = ({ svgPath, alt = 'Timeline' }) => {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.25, 0.5));
  };

  const handleReset = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && scale > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setScale(prev => Math.max(0.5, Math.min(3, prev + delta)));
  };

  return (
    <VStack spacing={3} align="stretch">
      {/* Zoom Controls */}
      <HStack justify="flex-end" spacing={2}>
        <Tooltip label="Zoom In">
          <IconButton
            aria-label="Zoom in"
            icon={<AddIcon />}
            size="sm"
            onClick={handleZoomIn}
            isDisabled={scale >= 3}
          />
        </Tooltip>
        <Tooltip label="Zoom Out">
          <IconButton
            aria-label="Zoom out"
            icon={<MinusIcon />}
            size="sm"
            onClick={handleZoomOut}
            isDisabled={scale <= 0.5}
          />
        </Tooltip>
        <Tooltip label="Reset">
          <IconButton
            aria-label="Reset zoom"
            icon={<RepeatIcon />}
            size="sm"
            onClick={handleReset}
          />
        </Tooltip>
      </HStack>

      {/* Timeline Container */}
      <Box
        ref={containerRef}
        bg={bgColor}
        border="1px solid"
        borderColor={borderColor}
        borderRadius="lg"
        overflow="hidden"
        position="relative"
        width="100%"
        height={{ base: '400px', md: '500px', lg: '600px' }}
        cursor={scale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default'}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      >
        <Box
          position="absolute"
          top="50%"
          left="50%"
          transform={`translate(-50%, -50%) translate(${position.x}px, ${position.y}px) scale(${scale})`}
          transition={isDragging ? 'none' : 'transform 0.2s ease-out'}
          width="100%"
          maxWidth="100%"
        >
          <img
            src={svgPath}
            alt={alt}
            style={{
              width: '100%',
              height: 'auto',
              display: 'block',
              userSelect: 'none',
              pointerEvents: 'none',
            }}
            draggable={false}
          />
        </Box>
      </Box>
    </VStack>
  );
};

export default ZoomableTimeline;
