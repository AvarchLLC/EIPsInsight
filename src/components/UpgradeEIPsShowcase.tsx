import React, { useState } from 'react';
import {
  Box,
  Heading,
  Text,
  SimpleGrid,
  Badge,
  VStack,
  HStack,
  useColorModeValue,
  Flex,
  Icon,
  Tooltip,
  Button,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { ExternalLinkIcon, ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';

interface EIPData {
  eip: string;
  title: string;
  author: string;
  link: string;
  type: string;
  category: string;
  discussion: string;
}

interface UpgradeEIPsShowcaseProps {
  upgradeName: string;
  upgradeDate: string;
  eips: EIPData[];
  upgradeColor: string;
  sectionTitle?: string;
  showInitialRows?: number;
}

const MotionBox = motion(Box);

const UpgradeEIPsShowcase: React.FC<UpgradeEIPsShowcaseProps> = ({
  upgradeName,
  upgradeDate,
  eips,
  upgradeColor,
  sectionTitle,
  showInitialRows = 2,
}) => {
  const router = useRouter();
  const [hoveredEip, setHoveredEip] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);

  const bgCard = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.800', 'white');
  const subtextColor = useColorModeValue('gray.600', 'gray.400');

  const getCategoryColor = (category: string, type: string) => {
    if (category === 'Core') return 'green';
    if (category === 'Networking') return 'blue';
    if (category === 'Interface') return 'purple';
    if (type === 'Informational') return 'orange';
    if (type === 'Meta') return 'cyan';
    return 'gray';
  };

  const coreEIPs = eips.filter(eip => eip.category === 'Core');
  const otherEIPs = eips.filter(eip => eip.category !== 'Core');

  const handleEIPClick = (eipNumber: string) => {
    router.push(`/eips/eip-${eipNumber}`);
  };

  // Calculate visible items based on showAll state
  const cardsPerRow = 3;
  const initialVisibleCount = showInitialRows * cardsPerRow;
  const visibleCoreEIPs = showAll ? coreEIPs : coreEIPs.slice(0, Math.min(initialVisibleCount, coreEIPs.length));
  const visibleOtherEIPs = showAll ? otherEIPs : otherEIPs.slice(0, Math.max(0, initialVisibleCount - coreEIPs.length));
  const hasMoreItems = (coreEIPs.length + otherEIPs.length) > initialVisibleCount;

  const EIPCard = ({ eip }: { eip: EIPData }) => (
    <MotionBox
      bg={bgCard}
      borderRadius="lg"
      p={3}
      border="1px solid"
      borderColor={hoveredEip === eip.eip ? upgradeColor : borderColor}
      cursor="pointer"
      onClick={() => handleEIPClick(eip.eip)}
      onMouseEnter={() => setHoveredEip(eip.eip)}
      onMouseLeave={() => setHoveredEip(null)}
      whileHover={{ y: -2, scale: 1.01 }}
      transition={{ duration: 0.2 } as any}
      boxShadow={hoveredEip === eip.eip ? 'md' : 'sm'}
      position="relative"
      overflow="hidden"
    >
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        height="3px"
        bg={upgradeColor}
        opacity={hoveredEip === eip.eip ? 1 : 0.3}
      />
      
      <VStack align="stretch" spacing={2} mt={1}>
        <Flex justify="space-between" align="flex-start">
          <HStack spacing={2}>
            <Badge
              colorScheme={getCategoryColor(eip.category, eip.type)}
              fontSize="xs"
              px={2}
              py={0.5}
              borderRadius="full"
              fontWeight="600"
            >
              EIP-{eip.eip}
            </Badge>
            {eip.category && (
              <Badge
                variant="subtle"
                colorScheme={getCategoryColor(eip.category, eip.type)}
                fontSize="2xs"
                px={1.5}
                py={0.5}
                borderRadius="full"
              >
                {eip.category}
              </Badge>
            )}
          </HStack>
          <Icon as={ExternalLinkIcon} color={subtextColor} boxSize={3} />
        </Flex>

        <Box>
          <Text
            fontSize="sm"
            fontWeight="bold"
            color={textColor}
            lineHeight="1.3"
            noOfLines={2}
          >
            {eip.title}
          </Text>
        </Box>

        <Text fontSize="2xs" color={subtextColor} noOfLines={1}>
          {eip.author.split(',')[0]}
          {eip.author.split(',').length > 1 && ' et al.'}
        </Text>

        {eip.type && eip.type !== 'Standards Track' && (
          <Badge
            variant="outline"
            colorScheme={getCategoryColor(eip.category, eip.type)}
            fontSize="xs"
            alignSelf="flex-start"
          >
            {eip.type}
          </Badge>
        )}
      </VStack>
    </MotionBox>
  );

  return (
    <Box>
      <VStack align="stretch" spacing={8}>
        <Box>
          <Flex align="center" gap={4} mb={2}>
            <Heading
              size="lg"
              bgGradient={`linear(to-r, ${upgradeColor}, ${upgradeColor}80)`}
              bgClip="text"
              fontWeight="700"
            >
              {sectionTitle || `${upgradeName} Network Upgrade`}
            </Heading>
            <Badge
              colorScheme="green"
              fontSize="sm"
              px={3}
              py={1}
              borderRadius="full"
            >
              {new Date(upgradeDate).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </Badge>
          </Flex>
          <Text fontSize="sm" color={subtextColor}>
            Complete list of Ethereum Improvement Proposals {sectionTitle ? sectionTitle.toLowerCase() : 'included in this upgrade'}
          </Text>
        </Box>

        {visibleCoreEIPs.length > 0 && (
          <Box>
            <Flex align="center" gap={3} mb={4}>
              <Heading size="md" color={textColor}>
                Core EIPs
              </Heading>
              <Badge colorScheme="green" fontSize="md" px={3} py={1} borderRadius="full">
                {coreEIPs.length}
              </Badge>
            </Flex>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={3}>
              {visibleCoreEIPs.map((eip) => (
                <EIPCard key={eip.eip} eip={eip} />
              ))}
            </SimpleGrid>
          </Box>
        )}

        {visibleOtherEIPs.length > 0 && (
          <Box>
            <Flex align="center" gap={3} mb={4}>
              <Heading size="md" color={textColor}>
                Other EIPs
              </Heading>
              <Badge colorScheme="blue" fontSize="md" px={3} py={1} borderRadius="full">
                {otherEIPs.length}
              </Badge>
              <Text fontSize="xs" color={subtextColor} fontStyle="italic">
                (Networking, Interface, Informational, Meta)
              </Text>
            </Flex>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={3}>
              {visibleOtherEIPs.map((eip) => (
                <EIPCard key={eip.eip} eip={eip} />
              ))}
            </SimpleGrid>
          </Box>
        )}

        {hasMoreItems && (
          <Flex justify="center" mt={4}>
            <Button
              onClick={() => setShowAll(!showAll)}
              colorScheme="teal"
              variant="outline"
              size="md"
              rightIcon={showAll ? <ChevronUpIcon /> : <ChevronDownIcon />}
            >
              {showAll ? 'Show Less' : 'Show More'}
            </Button>
          </Flex>
        )}

        <Box
          bg={useColorModeValue('gray.50', 'gray.800')}
          p={4}
          borderRadius="lg"
          border="1px solid"
          borderColor={borderColor}
        >
          <HStack spacing={4} fontSize="sm" color={subtextColor} justify="center">
            <Text>
              <strong>{coreEIPs.length}</strong> Core EIPs
            </Text>
            <Text>•</Text>
            <Text>
              <strong>{otherEIPs.length}</strong> Other EIPs
            </Text>
            <Text>•</Text>
            <Text>
              <strong>{eips.length}</strong> Total
            </Text>
          </HStack>
        </Box>
      </VStack>
    </Box>
  );
};

export default UpgradeEIPsShowcase;
