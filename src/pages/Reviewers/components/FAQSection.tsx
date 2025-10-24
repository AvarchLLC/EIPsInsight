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
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const headingColor = useColorModeValue('blue.600', 'blue.300');
  const textColor = useColorModeValue('gray.700', 'gray.200');

  return (
    <Box
      bg={bgColor}
      borderRadius="lg"
      borderWidth="1px"
      borderColor={borderColor}
      p={6}
      mb={8}
      boxShadow="sm"
      transition="all 0.3s"
      _hover={{ boxShadow: 'md' }}
    >
      <Flex justify="space-between" align="center" mb={show ? 4 : 0}>
        <Heading
          as="h3"
          size="lg"
          color={headingColor}
          fontWeight="semibold"
        >
          Editors & Reviewers Leaderboard FAQ
        </Heading>
        <IconButton
          onClick={toggleCollapse}
          icon={show ? <ChevronUpIcon boxSize={6} /> : <ChevronDownIcon boxSize={6} />}
          variant="ghost"
          colorScheme="blue"
          aria-label="Toggle FAQ"
          size="lg"
        />
      </Flex>

      <Collapse in={show} animateOpacity>
        <Box pt={4}>
          {/* Question 1 */}
          <Box mb={6}>
            <Heading as="h4" size="md" mb={2} color={headingColor} fontWeight="medium">
              What does this tool do?
            </Heading>
            <Text fontSize="md" color={textColor} lineHeight="1.7">
              This tool provides a comprehensive overview of all EIP editor/reviewer reviews conducted to date.
              It displays the total number of reviews each month for each editor/reviewer, allowing you to easily
              track and analyze review activity across different months and editors.
            </Text>
          </Box>

          {/* Question 2 */}
          <Box mb={6}>
            <Heading as="h4" size="md" mb={2} color={headingColor} fontWeight="medium">
              How can I view data for a specific Month?
            </Heading>
            <Text fontSize="md" color={textColor} lineHeight="1.7">
              To view data for a specific month, you can use the timeline scroll bar or click the View More button.
              From there, select the desired Year and Month using the dropdown menus, and the table and graph will
              automatically update to display data for that selected month.
            </Text>
          </Box>

          {/* Question 3 */}
          <Box mb={6}>
            <Heading as="h4" size="md" mb={2} color={headingColor} fontWeight="medium">
              How can I view data for a specific EIP Editor?
            </Heading>
            <Text fontSize="md" color={textColor} lineHeight="1.7">
              You can refine the data by selecting or deselecting specific editors from the checkbox list.
              This will filter the chart and table to show data only for the selected editors, enabling you to
              focus on individual contributions.
            </Text>
          </Box>

          {/* Question 4 */}
          <Box>
            <Heading as="h4" size="md" mb={2} color={headingColor} fontWeight="medium">
              How does this tool work?
            </Heading>
            <Text fontSize="md" color={textColor} lineHeight="1.7" mb={2}>
              The tool will be going through all the reviews made by the editor/reviewer and update the database
              every 24 hours. This tool captures reviews only if the person is marked as a reviewer and has
              performed a review activity on the PR. If no review is made, it won't be counted, even if the
              person is listed as a reviewer.
            </Text>
            <Text fontSize="md" color={textColor} lineHeight="1.7" fontStyle="italic">
              Note: The reviews made by the editor during their active time as an editor are considered for
              plotting the charts
            </Text>
          </Box>
        </Box>
      </Collapse>
    </Box>
  );
};

export default FAQSection;
