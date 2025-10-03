import React, { useState } from 'react';
import {
  Box,
  Text,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  useColorModeValue,
  Icon,
  Flex,
  Badge,
  VStack,
  HStack,
  Button,
  Collapse
} from '@chakra-ui/react';
import { 
  FaInfoCircle, 
  FaGasPump, 
  FaCoins, 
  FaFire, 
  FaCube, 
  FaExchangeAlt,
  FaQuestionCircle,
  FaChevronDown,
  FaChevronUp
} from 'react-icons/fa';

const ExplainerPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  const cardBg = useColorModeValue(
    'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.9) 100%)',
    'linear-gradient(135deg, rgba(26,32,44,0.95) 0%, rgba(45,55,72,0.9) 100%)'
  );
  const borderColor = useColorModeValue('blue.200', 'blue.600');
  const textColor = useColorModeValue('gray.800', 'gray.100');
  const subColor = useColorModeValue('gray.600', 'gray.400');
  const accentBg = useColorModeValue('blue.50', 'blue.900');

  const explanations = [
    {
      icon: FaCube,
      title: "What is a Block?",
      description: "Think of a block like a page in a ledger book. Every 12 seconds, a new page is created that contains all the transactions that happened during that time.",
      simple: "A block = A batch of transactions bundled together every ~12 seconds",
      color: "blue"
    },
    {
      icon: FaGasPump,
      title: "What is Gas?",
      description: "Gas is like the fuel fee you pay to use Ethereum. Simple transactions need less gas, complex smart contract interactions need more gas.",
      simple: "Gas = Transaction fee (like paying for postage to send a letter)",
      color: "orange"
    },
    {
      icon: FaCoins,
      title: "Base Fee vs Priority Fee",
      description: "Base Fee is the minimum cost set by the network. Priority Fee is an optional tip to make your transaction faster, like express shipping.",
      simple: "Base Fee = Standard shipping cost | Priority Fee = Express shipping tip",
      color: "green"
    },
    {
      icon: FaFire,
      title: "Why is ETH 'Burned'?",
      description: "When you pay the base fee, that ETH is permanently destroyed (burned). This helps control inflation and makes ETH more valuable over time.",
      simple: "Burned ETH = Money removed from circulation forever (reduces supply)",
      color: "red"
    },
    {
      icon: FaExchangeAlt,
      title: "Transaction Types",
      description: "Type 0 = Old transactions, Type 2 = Modern transactions with flexible fees, Type 1 = Rarely used access lists.",
      simple: "Type 0 = Old style | Type 2 = New flexible fees | Type 1 = Special access",
      color: "purple"
    }
  ];

  return (
    <Box
      bg={cardBg}
      backdropFilter="blur(12px)"
      border="1px solid"
      borderColor={borderColor}
      borderRadius="2xl"
      overflow="hidden"
      boxShadow={useColorModeValue(
        '0 4px 20px rgba(59, 130, 246, 0.1)',
        '0 4px 20px rgba(59, 130, 246, 0.2)'
      )}
      mb={6}
    >
      {/* Header */}
      <Flex
        px={6}
        py={4}
        bg="blue.500"
        color="white"
        align="center"
        justify="space-between"
        cursor="pointer"
        onClick={() => setIsOpen(!isOpen)}
        _hover={{ bg: 'blue.600' }}
        transition="all 0.2s"
      >
        <HStack spacing={3}>
          <Icon as={FaQuestionCircle} boxSize={6} />
          <VStack align="start" spacing={0}>
            <Text fontSize="lg" fontWeight="bold">
              🤔 New to Ethereum? Learn the Basics!
            </Text>
            <Text fontSize="sm" opacity={0.9}>
              Click to understand what all these numbers mean
            </Text>
          </VStack>
        </HStack>
        <Button
          size="sm"
          variant="ghost"
          color="white"
          _hover={{ bg: 'whiteAlpha.200' }}
          rightIcon={<Icon as={isOpen ? FaChevronUp : FaChevronDown} />}
        >
          {isOpen ? 'Hide' : 'Learn'}
        </Button>
      </Flex>

      {/* Content */}
      <Collapse in={isOpen} animateOpacity>
        <Box p={6}>
          <VStack spacing={4} align="stretch">
            {explanations.map((item, index) => (
              <Box
                key={index}
                bg={accentBg}
                borderRadius="lg"
                p={4}
                border="1px solid"
                borderColor={`${item.color}.200`}
              >
                <HStack spacing={3} mb={2}>
                  <Flex
                    w="40px"
                    h="40px"
                    bg={`${item.color}.500`}
                    borderRadius="lg"
                    align="center"
                    justify="center"
                  >
                    <Icon as={item.icon} color="white" boxSize={5} />
                  </Flex>
                  <Text fontSize="lg" fontWeight="bold" color={textColor}>
                    {item.title}
                  </Text>
                </HStack>
                
                <Text fontSize="sm" color={subColor} mb={2}>
                  {item.description}
                </Text>
                
                <Badge 
                  colorScheme={item.color} 
                  variant="subtle" 
                  fontSize="xs" 
                  px={3} 
                  py={1}
                  borderRadius="full"
                >
                  💡 {item.simple}
                </Badge>
              </Box>
            ))}
          </VStack>

          {/* Quick Reference */}
          <Box mt={6} p={4} bg={useColorModeValue('gray.50', 'gray.700')} borderRadius="lg">
            <Text fontSize="md" fontWeight="bold" color={textColor} mb={3}>
              📊 Quick Reference - What the Charts Show:
            </Text>
            <VStack align="start" spacing={2}>
              <Text fontSize="sm" color={subColor}>
                • <strong>Transaction Fee Chart:</strong> How much people are paying to use Ethereum
              </Text>
              <Text fontSize="sm" color={subColor}>
                • <strong>Transaction Count Chart:</strong> How busy the network is (more transactions = more activity)
              </Text>
              <Text fontSize="sm" color={subColor}>
                • <strong>Recent Transactions:</strong> Latest money transfers happening right now
              </Text>
              <Text fontSize="sm" color={subColor}>
                • <strong>Recent Blocks:</strong> Latest "pages" added to the Ethereum ledger
              </Text>
            </VStack>
          </Box>
        </Box>
      </Collapse>
    </Box>
  );
};

export default ExplainerPanel;