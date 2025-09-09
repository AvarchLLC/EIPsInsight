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

const EtherWorldAdCompact: React.FC = () => {
  const bgColor = useColorModeValue('blue.50', 'blue.900');
  const borderColor = useColorModeValue('blue.200', 'blue.600');
  const textColor = useColorModeValue('blue.800', 'blue.100');
  const accentColor = useColorModeValue('blue.600', 'blue.300');
  const badgeColor = useColorModeValue('blue.500', 'blue.400');

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
            boxShadow: 'xl',
            borderColor: accentColor,
          }}
          maxW="300px"
          position="relative"
          overflow="hidden"
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
          />
          
          <Flex direction="column" gap={2} position="relative" zIndex={1}>
            {/* Header with badge */}
            <Flex align="center" justify="space-between">
              <Flex align="center" gap={2}>
                <Icon as={FaGlobe} color={accentColor} boxSize={4} />
                <Text
                  fontSize="sm"
                  fontWeight="bold"
                  color={textColor}
                >
                  EtherWorld
                </Text>
              </Flex>
              <Badge colorScheme="blue" size="sm" fontSize="xs">
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
              />
            </Flex>
          </Flex>
        </Box>
      </Link>
    </MotionBox>
  );
};

export default EtherWorldAdCompact;
