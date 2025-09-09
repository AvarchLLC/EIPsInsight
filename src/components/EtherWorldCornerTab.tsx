import React, { useState } from 'react';
import {
  Box,
  Text,
  Flex,
  Icon,
  useColorModeValue,
  Link,
  VStack,
  HStack,
} from '@chakra-ui/react';
import { FaGlobe, FaExternalLinkAlt, FaChevronLeft } from 'react-icons/fa';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

const EtherWorldCornerTab: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('blue.200', 'blue.500');
  const textColor = useColorModeValue('gray.700', 'gray.200');
  const accentColor = useColorModeValue('blue.600', 'blue.300');
  const shadowColor = useColorModeValue('rgba(0,0,0,0.1)', 'rgba(0,0,0,0.3)');

  return (
    <MotionBox
      position="fixed"
      right={0}
      top="50%"
      transform="translateY(-50%)"
      zIndex={1000}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link
        href="https://etherworld.co"
        isExternal
        _hover={{ textDecoration: 'none' }}
      >
        <MotionBox
          bg={bgColor}
          borderTopLeftRadius="xl"
          borderBottomLeftRadius="xl"
          border="2px solid"
          borderColor={borderColor}
          borderRight="none"
          boxShadow={`-5px 0 20px ${shadowColor}`}
          overflow="hidden"
          cursor="pointer"
          animate={{
            x: isHovered ? 0 : 200,
            width: isHovered ? 280 : 60,
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
            duration: 0.3,
          }}
          _hover={{
            borderColor: accentColor,
          }}
        >
          {/* Tab Handle */}
          <Flex
            position="absolute"
            left={0}
            top={0}
            bottom={0}
            w="60px"
            align="center"
            justify="center"
            bg={accentColor}
            color="white"
            direction="column"
            gap={1}
          >
            <MotionBox
              animate={{ rotate: isHovered ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <Icon as={FaChevronLeft} boxSize={4} />
            </MotionBox>
            <Box
              w="2px"
              h="20px"
              bg="white"
              borderRadius="full"
              opacity={0.7}
            />
            <Icon as={FaGlobe} boxSize={4} />
          </Flex>

          {/* Expanded Content */}
          <Box ml="60px" p={4} minH="120px">
            <VStack spacing={3} align="stretch">
              <HStack spacing={2}>
                <Text
                  fontSize="lg"
                  fontWeight="bold"
                  color={textColor}
                  lineHeight="1.2"
                >
                  EtherWorld
                </Text>
                <Box
                  px={2}
                  py={1}
                  bg={accentColor}
                  color="white"
                  borderRadius="md"
                  fontSize="xs"
                  fontWeight="bold"
                >
                  Partner
                </Box>
              </HStack>

              <Text
                fontSize="sm"
                color={textColor}
                lineHeight="1.4"
                opacity={0.8}
              >
                Your gateway to Ethereum news, insights & community updates
              </Text>

              <HStack
                justify="space-between"
                pt={2}
                borderTop="1px solid"
                borderColor={useColorModeValue('gray.200', 'gray.600')}
              >
                <Text
                  fontSize="sm"
                  fontWeight="semibold"
                  color={accentColor}
                >
                  Visit Now
                </Text>
                <MotionBox
                  animate={{ x: isHovered ? 0 : -5 }}
                  transition={{ duration: 0.3 }}
                >
                  <Icon
                    as={FaExternalLinkAlt}
                    color={accentColor}
                    boxSize={3}
                  />
                </MotionBox>
              </HStack>
            </VStack>
          </Box>

          {/* Subtle background pattern */}
          <Box
            position="absolute"
            top={0}
            right={0}
            w="100px"
            h="100%"
            opacity={0.05}
            background={`repeating-linear-gradient(
              45deg,
              ${accentColor},
              ${accentColor} 2px,
              transparent 2px,
              transparent 10px
            )`}
          />
        </MotionBox>
      </Link>
    </MotionBox>
  );
};

export default EtherWorldCornerTab;
