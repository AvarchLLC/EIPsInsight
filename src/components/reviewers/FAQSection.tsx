import React from 'react';
import {
  Box,
  Collapse,
  Flex,
  Heading,
  IconButton,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';

interface FAQSectionProps {
  show: boolean;
  toggleCollapse: () => void;
}

const FAQSection: React.FC<FAQSectionProps> = ({ show, toggleCollapse }) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const bgGradient = useColorModeValue(
    'linear(to-br, blue.50, purple.50)',
    'linear(to-br, gray.800, gray.900)'
  );
  const borderColor = useColorModeValue('blue.200', 'gray.600');
  const headingColor = useColorModeValue('blue.700', 'blue.300');
  const questionColor = useColorModeValue('gray.800', 'gray.100');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const accentBg = useColorModeValue('blue.50', 'gray.700');

  return (
    <Box
      bgGradient={bgGradient}
      borderRadius="lg"
      borderWidth="2px"
      borderColor={borderColor}
      p={4}
      mb={4}
      boxShadow="md"
      transition="all 0.3s"
      _hover={{ boxShadow: 'lg' }}
    >
      <Flex justify="space-between" align="center" mb={show ? 3 : 0} cursor="pointer" onClick={toggleCollapse}>
        <Heading
          as="h2"
          size="md"
          color={headingColor}
          fontWeight="bold"
          letterSpacing="tight"
          fontFamily="'Inter', sans-serif"
        >
          📚 Frequently Asked Questions
        </Heading>
        <IconButton
          onClick={toggleCollapse}
          icon={show ? <ChevronUpIcon boxSize={5} /> : <ChevronDownIcon boxSize={5} />}
          variant="ghost"
          colorScheme="blue"
          aria-label="Toggle FAQ"
          size="sm"
          _hover={{ transform: 'scale(1.1)' }}
          transition="transform 0.2s"
        />
      </Flex>

      <Collapse in={show} animateOpacity>
        <Box pt={3} px={1}>
          {/* Question 1 */}
          <Box mb={4} p={3} bg={accentBg} borderRadius="md" borderLeftWidth="3px" borderLeftColor="blue.500">
            <Heading 
              as="h3" 
              size="sm" 
              mb={2} 
              color={questionColor} 
              fontWeight="bold"
              fontFamily="'Inter', sans-serif"
            >
              💡 What does this tool do?
            </Heading>
            <Text fontSize="sm" color={textColor} lineHeight="1.6" fontFamily="'Inter', sans-serif">
              This tool provides a comprehensive overview of all EIP editor/reviewer reviews conducted to date.
              It displays the total number of reviews each month for each editor/reviewer, allowing you to easily
              track and analyze review activity across different months and editors.
            </Text>
          </Box>

          {/* Question 2 */}
          <Box mb={4} p={3} bg={accentBg} borderRadius="md" borderLeftWidth="3px" borderLeftColor="purple.500">
            <Heading 
              as="h3" 
              size="sm" 
              mb={2} 
              color={questionColor} 
              fontWeight="bold"
              fontFamily="'Inter', sans-serif"
            >
              📅 How can I view data for a specific Month?
            </Heading>
            <Text fontSize="sm" color={textColor} lineHeight="1.6" fontFamily="'Inter', sans-serif">
              To view data for a specific month, you can use the timeline scroll bar or click the View More button.
              From there, select the desired Year and Month using the dropdown menus, and the table and graph will
              automatically update to display data for that selected month.
            </Text>
          </Box>

          {/* Question 3 */}
          <Box mb={4} p={3} bg={accentBg} borderRadius="md" borderLeftWidth="3px" borderLeftColor="green.500">
            <Heading 
              as="h3" 
              size="sm" 
              mb={2} 
              color={questionColor} 
              fontWeight="bold"
              fontFamily="'Inter', sans-serif"
            >
              👤 How can I view data for a specific EIP Editor?
            </Heading>
            <Text fontSize="sm" color={textColor} lineHeight="1.6" fontFamily="'Inter', sans-serif">
              You can refine the data by selecting or deselecting specific editors from the checkbox list.
              This will filter the chart and table to show data only for the selected editors, enabling you to
              focus on individual contributions.
            </Text>
          </Box>

          {/* Question 4 */}
          <Box p={3} bg={accentBg} borderRadius="md" borderLeftWidth="3px" borderLeftColor="orange.500">
            <Heading 
              as="h3" 
              size="sm" 
              mb={2} 
              color={questionColor} 
              fontWeight="bold"
              fontFamily="'Inter', sans-serif"
            >
              ⚙️ How does this tool work?
            </Heading>
            <Text fontSize="sm" color={textColor} lineHeight="1.6" mb={2} fontFamily="'Inter', sans-serif">
              The tool will be going through all the reviews made by the editor/reviewer and update the database
              every 24 hours. This tool captures reviews only if the person is marked as a reviewer and has
              performed a review activity on the PR. If no review is made, it won't be counted, even if the
              person is listed as a reviewer.
            </Text>
            <Box 
              p={2} 
              bg={useColorModeValue('yellow.50', 'gray.600')} 
              borderRadius="sm"
              borderLeftWidth="2px"
              borderLeftColor="yellow.400"
            >
              <Text 
                fontSize="xs" 
                color={textColor} 
                lineHeight="1.5" 
                fontStyle="italic"
                fontFamily="'Inter', sans-serif"
              >
                📌 Note: The reviews made by the editor during their active time as an editor are considered for
                plotting the charts
              </Text>
            </Box>
          </Box>
        </Box>
      </Collapse>
    </Box>
  );
};

export default FAQSection;
