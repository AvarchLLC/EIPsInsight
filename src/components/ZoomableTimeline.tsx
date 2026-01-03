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
    <Box position="relative">
      {/* Timeline Container */}
      <Box
        ref={containerRef}
        bg={bgColor}
        border="2px solid"
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
        _hover={{
          borderColor: useColorModeValue('blue.400', 'blue.500'),
          boxShadow: useColorModeValue('0 4px 12px rgba(0,0,0,0.1)', '0 4px 12px rgba(0,0,0,0.3)')
        }}
        transition="all 0.2s ease"
        boxShadow="sm"
      >
        {/* Zoom Controls - Overlaid on image */}
        <HStack 
          position="absolute" 
          top={3} 
          right={3} 
          spacing={1.5} 
          zIndex={10} 
          bg={useColorModeValue('rgba(255,255,255,0.95)', 'rgba(26,32,44,0.95)')}
          borderRadius="md" 
          p={1.5} 
          boxShadow="lg"
          backdropFilter="blur(10px)"
          border="1px solid"
          borderColor={useColorModeValue('gray.200', 'gray.600')}
        >
          <Tooltip label="Zoom In">
            <IconButton
              aria-label="Zoom in"
              icon={<AddIcon />}
              size="xs"
              onClick={handleZoomIn}
              isDisabled={scale >= 3}
              variant="ghost"
              colorScheme="blue"
            />
          </Tooltip>
          <Tooltip label="Zoom Out">
            <IconButton
              aria-label="Zoom out"
              icon={<MinusIcon />}
              size="xs"
              onClick={handleZoomOut}
              isDisabled={scale <= 0.5}
              variant="ghost"
              colorScheme="blue"
            />
          </Tooltip>
          <Tooltip label="Reset">
            <IconButton
              aria-label="Reset zoom"
              icon={<RepeatIcon />}
              size="xs"
              onClick={handleReset}
              variant="ghost"
              colorScheme="blue"
            />
          </Tooltip>
        </HStack>

        <Box
          position="absolute"
          top="50%"
          left="50%"
          transform={`translate(-50%, -50%) translate(${position.x}px, ${position.y}px) scale(${scale})`}
          transition={isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)'}
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
    </Box>
  );
};

export default ZoomableTimeline;
