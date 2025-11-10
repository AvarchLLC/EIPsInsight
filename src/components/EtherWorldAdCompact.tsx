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
  // Use the requested stagnant solid colors for light/dark mode
  const bgColor = useColorModeValue('#B8DBEF', '#213B61');
  const borderColor = bgColor; // solid border same as background (stagnant)
  const textColor = useColorModeValue('#05314a', '#e6f6ff');
  const accentColor = bgColor;

  return (
    <MotionBox
      initial={{ opacity: 0, x: 20, scale: 0.995 }}
      animate={{ opacity: 1, x: 0, scale: [1, 1.04, 1] }}
      transition={{ duration: 2, delay: 0.15, repeat: Infinity, repeatType: 'loop', ease: 'easeInOut' }}
      style={{ willChange: 'transform', overflow: 'visible' }}
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
          boxShadow={`0 6px 20px rgba(${STAG_RGB},0.12)`}
          _hover={{
            transform: 'translateY(-2px)',
            boxShadow: `0 14px 40px rgba(${STAG_RGB},0.18)`,
            borderColor: accentColor,
          }}
          maxW="300px"
          position="relative"
          overflow="visible" /* allow glow to be visible outside the card */
          role="banner"
          aria-label="EtherWorld Partnership Advertisement"
        >
          {/* Pulse only: no colored glow per request */}

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
