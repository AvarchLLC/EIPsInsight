import React from 'react';
import {
  Box,
  Text,
  Stack,
  useColorModeValue,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Flex,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import CopyLink from './CopyLink';

const MotionBox = motion(Box);

const FAQ: React.FC = () => {
  const bg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.700", "gray.200");
  const glassHover = useColorModeValue('rgba(243, 244, 246, 0.8)', 'rgba(55, 65, 81, 0.8)');

  const faqData = [
    {
      question: "Where does the data come from?",
      answer: "We aggregate public GitHub data from the official Ethereum repositories (EIPs, ERCs, RIPs), partner repositories, and community submissions. We fetch commits, PRs, and proposal files using GitHub's API, normalize labels and timestamps into monthly buckets, and persist processed records in MongoDB. Public API endpoints (for example, /api/stats and PR snapshot APIs) expose the aggregated metrics; when the database is unavailable the UI shows a friendly fallback."
    },
    {
      question: "How can I contribute?",
      answer: "We welcome contributions from developers, researchers, and community members at all skill levels. You can contribute by opening issues or pull requests in our GitHub repository at github.com/AvarchLLC/EIPsInsight. Start with smaller tasks like documentation fixes, typo corrections, UI improvements, or feature suggestions. For larger changes such as new analytics features, API enhancements, or architectural modifications, please open an issue first to discuss scope, design approach, and implementation details with our maintainers. We also appreciate feedback on data accuracy, user experience suggestions, and reports of any inconsistencies you notice in our charts or dashboards."
    },
    {
      question: "What do the labels and statuses mean?",
      answer: "EIPsInsight uses two types of label systems for comprehensive analysis. 'CustomLabels' are our normalized categories designed for analytics clarity, including labels like 'e-review' (editorial review), 'e-consensus' (awaiting consensus), 'a-review' (author review), 'stagnant' (inactive proposals), and 'miscellaneous' for edge cases. 'GitHubLabels' represent the raw workflow labels from the official repositories. EIP statuses follow the standard lifecycle: Draft (initial submission), Review (community feedback phase), Last Call (final review period), Final (accepted and implemented), Stagnant (inactive for 6+ months), and Withdrawn (author-cancelled). Our visualizations map these statuses to color-coded charts and provide detailed tooltips explaining each stage of the proposal lifecycle."
    },
    {
      question: "How do I report a bug or request a feature?",
      answer: "To report bugs or request new features, please visit our GitHub repository at github.com/AvarchLLC/EIPsInsight and create a detailed issue. For bug reports, include specific reproduction steps, screenshots or screen recordings, your browser/device information, expected vs actual behavior, and any console errors you encounter. For feature requests, describe your use case clearly, explain how the feature would benefit the Ethereum community, provide mockups or examples if applicable, and specify any particular data sources or API integrations needed. Our maintainers actively triage issues, typically responding within 48-72 hours with questions, suggestions, or implementation timelines. Priority is given to issues affecting data accuracy, accessibility improvements, and features that enhance community understanding of EIP processes."
    }
  ];

  return (
    <>
      <style jsx>{`
        .gradient-text {
          background: linear-gradient(135deg, #30A0E0 0%, #4FD1FF 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>
      <Box 
        id="faq"
        bg={useColorModeValue("white", "gray.800")}
        borderRadius="xl"
        boxShadow="sm"
        border="1px solid"
        borderColor={useColorModeValue("gray.200", "gray.700")}
        p={4}
        mb={4}
      >
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <Box mb={{ base: 4, lg: 6 }}>
            {/* Header - matching Homepage section style */}
            <Flex alignItems="center" mb={3} gap={3} direction="row" textAlign="left">
              <Text
                as={motion.div}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                fontSize={{ base: "2xl", sm: "3xl", md: "4xl", lg: "4xl", xl: "5xl" }}
                fontWeight="extrabold"
                color={useColorModeValue("#2C7A7B", "#81E6D9")}
                bgGradient={useColorModeValue("linear(to-r, #4FD1C5, #319795)", "linear(to-r, #81E6D9, #4FD1C5)")}
                bgClip="text"
                lineHeight="1.1"
                letterSpacing="-0.02em"
              >
                Frequently Asked Questions
              </Text>
              <Box alignSelf="center">
                <CopyLink link="https://eipsinsight.com/#faq" />
              </Box>
            </Flex>
            <Text
              fontSize={{ base: "sm", md: "md", lg: "lg" }}
              color={textColor}
              lineHeight="1.5"
              maxWidth="600px"
              opacity={0.9}
            >
              Get answers to common questions about our platform and services
            </Text>
          </Box>

            {/* FAQ Items */}
            <Accordion allowMultiple>
              <Stack spacing={2}>
                {faqData.map((faq, index) => (
                  <AccordionItem
                    key={index}
                    border="1px solid"
                    borderColor={useColorModeValue("gray.200", "gray.600")}
                    borderRadius="md"
                    overflow="hidden"
                    bg={bg}
                    _hover={{
                      borderColor: useColorModeValue("blue.300", "blue.400"),
                      transform: "translateY(-1px)",
                      boxShadow: useColorModeValue(
                        "0 4px 12px rgba(59, 130, 246, 0.1)",
                        "0 4px 12px rgba(59, 130, 246, 0.2)"
                      )
                    }}
                    transition="all 0.2s ease"
                  >
                    <AccordionButton
                      p={4}
                      _hover={{ bg: glassHover }}
                      transition="all 0.2s"
                    >
                      <Box flex="1" textAlign="left">
                        <Text fontWeight="600" fontSize="md">
                          {faq.question}
                        </Text>
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                    <AccordionPanel pb={4} px={4}>
                      <Text 
                        color={textColor} 
                        lineHeight="1.6" 
                        fontSize="sm"
                      >
                        {faq.answer}
                      </Text>
                    </AccordionPanel>
                  </AccordionItem>
                ))}
              </Stack>
            </Accordion>
        </MotionBox>
      </Box>
    </>
  );
};

export default FAQ;