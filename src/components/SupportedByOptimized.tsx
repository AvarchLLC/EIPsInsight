import React from 'react';
import {
  Box,
  Text,
  Image,
  useColorModeValue,
  Link,
  Button,
  Icon,
} from '@chakra-ui/react';
import { FiHeart } from 'react-icons/fi';
import Header from './Header';
import {
  useGifHover,
  useInfiniteScroll,
  useResponsiveCardSize,
  usePrefersReducedMotion,
} from '@/hooks/useSupportedByGallery';

// Supporter data
const supportersData = [
  {
    id: 'etherworld',
    name: 'EtherWorld',
    staticUrl: '/EtherWorld-gif.gif#static',
    gifUrl: '/EtherWorld-gif.gif',
    url: 'https://etherworld.co/',
  },
  {
    id: 'esp',
    name: 'Ethereum Foundation ESP',
    staticUrl: '/ESP-gif.gif#static',
    gifUrl: '/ESP-gif.gif',
    url: 'https://esp.ethereum.foundation/',
  },
  {
    id: 'gitcoin',
    name: 'Gitcoin',
    staticUrl: '/Gitcoin-gif.gif#static',
    gifUrl: '/Gitcoin-gif.gif',
    url: 'https://gitcoin.co/',
  },
  {
    id: 'ech',
    name: 'Ethereum Cat Herders',
    staticUrl: '/ECH-gif.gif#static',
    gifUrl: '/ECH-gif.gif',
    url: 'https://www.ethereumcatherders.com/',
  },
];

// Individual supporter card component
const SupporterCard = ({ 
  supporter, 
  onHoverChange 
}: { 
  supporter: typeof supportersData[0]; 
  onHoverChange: (isHovered: boolean) => void;
}) => {
  const {
    isHovered,
    showGif,
    canvasRef,
    imgRef,
    handleMouseEnter,
    handleMouseLeave,
    getCurrentGifSrc,
  } = useGifHover(supporter.staticUrl, supporter.gifUrl);

  const cardSize = useResponsiveCardSize();
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const bgColor = useColorModeValue('white', 'gray.800');

  const onMouseEnter = () => {
    handleMouseEnter();
    onHoverChange(true);
  };

  const onMouseLeave = () => {
    handleMouseLeave();
    onHoverChange(false);
  };

  return (
    <Box
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      cursor="pointer"
      position="relative"
      mx={4}
      flexShrink={0}
      transition="all 0.3s ease"
      _hover={{
        transform: 'scale(1.05)',
      }}
    >
      <Link
        href={supporter.url}
        isExternal
        _hover={{ textDecoration: 'none' }}
        onClick={(e) => e.stopPropagation()}
      >
        <Box
          bg={bgColor}
          borderRadius="xl"
          border="2px solid"
          borderColor={borderColor}
          overflow="hidden"
          boxShadow={isHovered ? '2xl' : 'md'}
          transition="all 0.3s ease"
          position="relative"
          width={{ base: "200px", md: "240px", lg: "280px" }}
          height="auto"
        >
          {/* Canvas for static frame */}
          <canvas
            ref={canvasRef}
            style={{
              display: showGif ? 'none' : 'block',
              width: '100%',
              height: 'auto',
              objectFit: 'contain',
            }}
          />
          
          {/* GIF image - shown when hovering */}
          {showGif && (
            <Image
              ref={imgRef}
              src={getCurrentGifSrc()}
              alt={supporter.name}
              width="100%"
              height="auto"
              objectFit="contain"
              draggable={false}
              loading="eager"
            />
          )}
          
          {/* Hover indicator overlay */}
          <Box
            position="absolute"
            bottom="0"
            left="0"
            right="0"
            bg="blackAlpha.700"
            py={2}
            px={3}
            opacity={isHovered ? 1 : 0}
            transition="opacity 0.3s ease"
          >
            <Text
              fontSize="sm"
              fontWeight="600"
              color="white"
              textAlign="center"
            >
              {supporter.name}
            </Text>
          </Box>
        </Box>
      </Link>
    </Box>
  );
};

export default function SupportedByOptimized() {
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderCol = useColorModeValue('gray.200', 'gray.700');
  
  const { isPaused, handleHoverChange } = useInfiniteScroll();
  const prefersReducedMotion = usePrefersReducedMotion();
  
  // Duplicate the array to create seamless infinite scroll
  const duplicatedSupporters = [...supportersData, ...supportersData, ...supportersData];

  // Disable animation if user prefers reduced motion
  const animationDuration = prefersReducedMotion ? '0s' : '40s';

  return (
    <Box
      as="section"
      id="supported-by"
      bg={cardBg}
      borderRadius="xl"
      boxShadow="sm"
      border="1px solid"
      borderColor={borderCol}
      p={{ base: 6, md: 8 }}
      mb={8}
      position="relative"
      overflow="hidden"
    >
      {/* Background Gradient Accent */}
      <Box
        position="absolute"
        top="0"
        left="0"
        right="0"
        height="4px"
        bgGradient="linear(90deg, #667eea 0%, #764ba2 50%, #0fdb8b 100%)"
        opacity={0.8}
      />

      {/* Header */}
      <Header
        title="Supported by"
        subtitle=""
        description=""
        sectionId="supported-by"
      />

      {/* Continuous Scrolling Gallery Container */}
      <Box
        mt={6}
        position="relative"
        overflow="hidden"
        width="100%"
        py={4}
      >
        {/* Scrolling Track */}
        <Box
          display="flex"
          alignItems="center"
          width="max-content"
          sx={{
            animation: isPaused || prefersReducedMotion ? 'none' : `scroll ${animationDuration} linear infinite`,
            '@keyframes scroll': {
              '0%': {
                transform: 'translateX(0)',
              },
              '100%': {
                transform: 'translateX(-33.333%)',
              },
            },
          }}
        >
          {duplicatedSupporters.map((supporter, index) => (
            <SupporterCard
              key={`${supporter.id}-${index}`}
              supporter={supporter}
              onHoverChange={handleHoverChange}
            />
          ))}
        </Box>

        {/* Gradient Overlays for Fade Effect */}
        <Box
          position="absolute"
          top="0"
          left="0"
          bottom="0"
          width="80px"
          bgGradient={`linear(to-r, ${cardBg}, transparent)`}
          pointerEvents="none"
          zIndex={1}
        />
        <Box
          position="absolute"
          top="0"
          right="0"
          bottom="0"
          width="80px"
          bgGradient={`linear(to-l, ${cardBg}, transparent)`}
          pointerEvents="none"
          zIndex={1}
        />
      </Box>

      {/* Support CTA */}
      <Box mt={8} textAlign="center">
        <Link href="/donate" _hover={{ textDecoration: 'none' }}>
          <Button
            size="lg"
            colorScheme="blue"
            bgGradient="linear(135deg, #667eea 0%, #764ba2 100%)"
            color="white"
            _hover={{
              bgGradient: 'linear(135deg, #5568d3 0%, #6a3f92 100%)',
              transform: 'translateY(-2px)',
              boxShadow: 'xl',
            }}
            _active={{
              transform: 'translateY(0)',
            }}
            transition="all 0.2s"
            leftIcon={<Icon as={FiHeart} />}
            borderRadius="xl"
            px={8}
            py={6}
            fontWeight="700"
            fontSize="md"
          >
            Support Our Mission
          </Button>
        </Link>
        <Text
          mt={3}
          fontSize="sm"
          color={useColorModeValue('gray.600', 'gray.400')}
        >
          Help us maintain this free and open-source platform
        </Text>
      </Box>
    </Box>
  );
}
