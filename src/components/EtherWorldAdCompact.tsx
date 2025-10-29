import React from 'react';
import {
  Box,
  Text,
  Flex,
  Icon,
  useColorModeValue,
  Link,
  Badge,
} from '@chakra-ui/react';
import { FaGlobe, FaExternalLinkAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

const STAGNANT = '#BBE1F5';
const STAG_RGB = `187,225,245`;

const EtherWorldAdCompact: React.FC = () => {
  const bgColor = useColorModeValue('#EBF7FF', '#05232f');
  const borderColor = useColorModeValue(`rgba(${STAG_RGB},0.12)`, `rgba(${STAG_RGB},0.22)`);
  const textColor = useColorModeValue('#05314a', '#e6f6ff');
  const accentColor = useColorModeValue(STAGNANT, `rgba(${STAG_RGB},0.9)`);

  return (
    <MotionBox
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <Link
        href="https://etherworld.co"
        isExternal
        _hover={{ textDecoration: 'none' }}
        display="block"
      >
        <Box
          bg={bgColor}
          border="2px solid"
          borderColor={borderColor}
          borderRadius="xl"
          p={4}
          cursor="pointer"
          transition="all 0.3s ease"
          _hover={{
            transform: 'translateY(-2px)',
            boxShadow: `0 10px 30px rgba(${STAG_RGB},0.12), 0 0 24px rgba(${STAG_RGB},0.08)`,
            borderColor: accentColor,
          }}
          maxW="300px"
          position="relative"
          overflow="hidden"
          role="banner"
          aria-label="EtherWorld Partnership Advertisement"
        >
          {/* Background Pattern */}
          <Box
            position="absolute"
            top={0}
            right={0}
            w="60px"
            h="60px"
            opacity={0.1}
            background={`radial-gradient(circle, ${accentColor} 20%, transparent 20%)`}
            backgroundSize="8px 8px"
            pointerEvents="none"
          />
          
          <Flex direction="column" gap={2} position="relative" zIndex={1}>
            {/* Header with badge */}
            <Flex align="center" justify="space-between">
              <Flex align="center" gap={2}>
                <Icon 
                  as={FaGlobe} 
                  color={accentColor} 
                  boxSize={4}
                  aria-hidden="true"
                />
                <Text
                  fontSize="sm"
                  fontWeight="bold"
                  color={textColor}
                >
                  EtherWorld
                </Text>
              </Flex>
              <Badge 
                bg={useColorModeValue(`rgba(${STAG_RGB},0.12)`, 'transparent')}
                color={useColorModeValue(STAGNANT, '#cfefff')}
                size="sm" 
                fontSize="xs"
                variant={useColorModeValue('solid', 'outline')}
              >
                Partner
              </Badge>
            </Flex>

            {/* Main content */}
            <Text
              fontSize="xs"
              color={textColor}
              lineHeight="1.4"
              noOfLines={3}
            >
              Your gateway to Ethereum news, insights, and community updates
            </Text>

            {/* CTA */}
            <Flex align="center" justify="space-between" mt={1}>
              <Text
                fontSize="xs"
                fontWeight="semibold"
                color={accentColor}
              >
                Explore Now
              </Text>
              <Icon
                as={FaExternalLinkAlt}
                color={accentColor}
                boxSize={3}
                aria-hidden="true"
              />
            </Flex>
          </Flex>
        </Box>
      </Link>
    </MotionBox>
  );
};

export default EtherWorldAdCompact;
