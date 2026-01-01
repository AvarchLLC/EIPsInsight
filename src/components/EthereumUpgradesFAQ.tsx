import React, { useState } from 'react';
import {
  Box,
  Heading,
  Text,
  SimpleGrid,
  VStack,
  HStack,
  useColorModeValue,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Icon,
  Collapse,
  Image,
} from '@chakra-ui/react';
import { FaNetworkWired, FaCode, FaRocket, FaLayerGroup, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { motion } from 'framer-motion';
import NetworkUpgradesChart from './NetworkUpgradesChart';

const MotionBox = motion(Box);

const EthereumUpgradesFAQ: React.FC = () => {
  const [isFlowchartOpen, setIsFlowchartOpen] = useState(false);
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'white');
  const subtextColor = useColorModeValue('gray.600', 'gray.400');
  const statBg = useColorModeValue('blue.50', 'gray.700');

  const stats = [
    {
      label: 'Total Network Upgrades',
      value: '25',
      helpText: 'Since Frontier Thawing (2015)',
      icon: FaRocket,
      color: 'blue.500',
    },
    {
      label: 'Execution Layer Upgrades',
      value: '19',
      helpText: 'Protocol & EVM changes',
      icon: FaCode,
      color: 'green.500',
    },
    {
      label: 'Consensus Layer Upgrades',
      value: '6',
      helpText: 'Beacon Chain upgrades',
      icon: FaLayerGroup,
      color: 'purple.500',
    },
    {
      label: 'Total Core EIPs',
      value: '77+',
      helpText: 'Implemented in upgrades',
      icon: FaNetworkWired,
      color: 'orange.500',
    },
  ];

  return (
    <Box
      bg={bgColor}
      borderRadius="xl"
      p={5}
      border="1px solid"
      borderColor={borderColor}
      boxShadow="md"
    >
      <VStack align="stretch" spacing={4}>
        {/* Header */}
        <Box>
          <Heading size="lg" color={textColor} mb={2} fontWeight="700">
            Ethereum Network Upgrades Overview
          </Heading>
          <Text fontSize="sm" color={subtextColor} lineHeight="1.6">
            Comprehensive information about Ethereum's evolution through coordinated protocol upgrades,
            from the first Homestead upgrade in 2016 to the upcoming Glamsterdam upgrade.
          </Text>
        </Box>

        {/* Stats Grid */}
        <SimpleGrid columns={{ base: 2, md: 4 }} spacing={3}>
          {stats.map((stat, index) => (
            <MotionBox
              key={stat.label}
              whileHover={{ y: -2, scale: 1.01 }}
              transition={{ duration: 0.2 } as any}
            >
              <Box
                bg={statBg}
                p={3}
                borderRadius="lg"
                border="1px solid"
                borderColor={borderColor}
                boxShadow="sm"
              >
                <Stat>
                  <HStack spacing={2} mb={2}>
                    <Icon as={stat.icon} boxSize={4} color={stat.color} />
                    <StatLabel fontSize="xs" fontWeight="600" color={subtextColor}>
                      {stat.label}
                    </StatLabel>
                  </HStack>
                  <StatNumber fontSize="2xl" fontWeight="bold" color={textColor}>
                    {stat.value}
                  </StatNumber>
                  <StatHelpText fontSize="2xs" color={subtextColor} mt={0.5}>
                    {stat.helpText}
                  </StatHelpText>
                </Stat>
              </Box>
            </MotionBox>
          ))}
        </SimpleGrid>

        {/* EIP Inclusion Process Flowchart */}
        <Box>
          <HStack spacing={2} mb={2}>
            <Icon as={FaNetworkWired} boxSize={4} color="teal.500" />
            <Text fontWeight="600" fontSize="md" color={textColor}>
              EIP Inclusion Process
            </Text>
            <Icon 
              as={isFlowchartOpen ? FaChevronUp : FaChevronDown} 
              boxSize={4} 
              color={subtextColor}
              cursor="pointer"
              onClick={() => setIsFlowchartOpen(!isFlowchartOpen)}
              _hover={{ color: textColor }}
            />
          </HStack>

          <Collapse in={isFlowchartOpen} animateOpacity>
            <Box
              p={3}
              bg={useColorModeValue('gray.50', 'gray.700')}
              borderRadius="md"
              border="1px solid"
              borderColor={borderColor}
              display="flex"
              justifyContent="center"
            >
              <Image
                src="/stages/eip-incl.png"
                alt="EIP Inclusion Process Flowchart"
                width="40%"
                height="auto"
                borderRadius="md"
                objectFit="contain"
                fallback={
                  <Box
                    width="40%"
                    minHeight="120px"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    borderRadius="md"
                    border="1px dashed"
                    borderColor={borderColor}
                    bg={useColorModeValue('white', 'gray.800')}
                  >
                    <Text fontSize="sm" color={subtextColor} textAlign="center">
                      EIP inclusion flowchart is currently unavailable.
                    </Text>
                  </Box>
                }
              />
            </Box>
          </Collapse>
        </Box>

        {/* Network Upgrades Chart */}
        <Box mt={4}>
          <NetworkUpgradesChart />
        </Box>
      </VStack>
    </Box>
  );
};

export default EthereumUpgradesFAQ;
