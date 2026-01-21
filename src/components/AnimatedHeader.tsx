import React, { useState } from 'react';
import {
  Box,
  Heading,
  Text,
  useColorModeValue,
  Collapse,
  IconButton,
  Flex,
  VStack,
  Divider,
} from '@chakra-ui/react';
import { InfoIcon, ChevronUpIcon } from '@chakra-ui/icons';

interface FAQItem {
  question: string;
  answer: string;
}

interface AnimatedHeaderProps {
  title: string;
  description: string;
  faqItems?: FAQItem[];
  compact?: boolean;
}

const AnimatedHeader: React.FC<AnimatedHeaderProps> = ({ 
  title,
  description,
  faqItems,
  compact = false,
}) => {
  const [showInfo, setShowInfo] = useState(false);
  
  // Theme colors
  const titleColor = useColorModeValue('#2b6cb0', '#4FD1FF');
  const subtitleColor = useColorModeValue('gray.600', 'gray.400');
  const borderColor = useColorModeValue('blue.100', 'blue.900');
  const buttonBg = useColorModeValue('white', 'whiteAlpha.50');
  const buttonBgHover = useColorModeValue('blue.50', 'blue.900');
  const buttonBorder = useColorModeValue('blue.200', 'blue.700');
  const buttonColor = useColorModeValue('#30A0E0', '#4FD1FF');
  const faqBg = useColorModeValue('blue.50', 'whiteAlpha.50');
  const faqBorder = useColorModeValue('blue.100', 'blue.800');
  const questionColor = useColorModeValue('#2b6cb0', '#4FD1FF');
  const answerColor = useColorModeValue('gray.700', 'gray.300');

  return (
    <Box 
      as="header" 
      w="full" 
      mb={{ base: 4, md: 5 }}
      pb={{ base: 3, md: 3 }}
      borderBottomWidth="1px"
      borderBottomColor={borderColor}
    >
      {/* Main Header */}
      <Flex 
        justify="space-between" 
        align="flex-start" 
        gap={4}
      >
        <Box flex={1}>
          {/* Title */}
          <Heading
            as="h1"
            fontSize={{ base: '3xl', md: compact ? '4xl' : '5xl' }}
            fontWeight="extrabold"
            letterSpacing="tight"
            color={titleColor}
            mb={2}
            lineHeight="1.2"
          >
            {title}
          </Heading>

          {/* Description */}
          <Text
            fontSize={{ base: 'xs', md: 'sm' }}
            color={subtitleColor}
            maxW="4xl"
            lineHeight="1.5"
          >
            {description}
          </Text>
        </Box>

        {/* Info Toggle Button */}
        {faqItems && faqItems.length > 0 && (
          <Box pt={0.5}>
            <IconButton
              icon={showInfo ? <ChevronUpIcon boxSize={4.5} /> : <InfoIcon boxSize={4} />}
              onClick={() => setShowInfo(!showInfo)}
              size="sm"
              variant="outline"
              aria-label={showInfo ? 'Hide information' : 'Show information'}
              bg={buttonBg}
              borderColor={buttonBorder}
              color={buttonColor}
              _hover={{
                bg: buttonBgHover,
                borderColor: buttonBorder,
                color: buttonColor,
                shadow: 'sm',
              }}
              _active={{
                bg: buttonBgHover,
              }}
              transition="all 0.2s ease"
            />
          </Box>
        )}
      </Flex>

      {/* Collapsible FAQ Section */}
      {faqItems && faqItems.length > 0 && (
        <Collapse in={showInfo} animateOpacity>
          <Box
            mt={3}
            p={{ base: 3, md: 4 }}
            bg={faqBg}
            borderRadius="md"
            borderWidth="1px"
            borderColor={faqBorder}
          >
            <VStack align="stretch" spacing={3} divider={<Divider borderColor={faqBorder} />}>
              {faqItems.map((item, index) => (
                <Box key={index}>
                  <Text
                    fontWeight="semibold"
                    color={questionColor}
                    mb={1.5}
                    fontSize="sm"
                  >
                    {item.question}
                  </Text>
                  <Text
                    fontSize="sm"
                    color={answerColor}
                    lineHeight="1.6"
                  >
                    {item.answer}
                  </Text>
                </Box>
              ))}
            </VStack>
          </Box>
        </Collapse>
      )}
    </Box>
  );
};

export default AnimatedHeader;
