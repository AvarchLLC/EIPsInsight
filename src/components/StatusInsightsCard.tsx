import React from "react";
import { Box, Text, SimpleGrid, Flex, useColorModeValue, Icon, Divider } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { FiTrendingUp, FiClock, FiUsers, FiFileText } from "react-icons/fi";

interface InsightItem {
  label: string;
  value: string | number;
  icon?: any;
  colorScheme?: string;
}

interface StatusInsightsCardProps {
  insights: InsightItem[];
  title?: string;
}

const StatusInsightsCard: React.FC<StatusInsightsCardProps> = ({ insights, title = "Key Insights" }) => {
  const bg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.700", "gray.200");
  const labelColor = useColorModeValue("gray.600", "gray.400");

  return (
    <Box
      as={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 } as any}
      bg={bg}
      p={6}
      borderRadius="xl"
      border="1px solid"
      borderColor={borderColor}
      boxShadow="sm"
    >
      <Text fontSize="lg" fontWeight="bold" mb={6} color={textColor}>
        {title}
      </Text>
      
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
        {insights.map((insight, index) => (
          <Box key={index}>
            <Flex align="center" gap={3}>
              {insight.icon && (
                <Flex
                  bg={useColorModeValue(`${insight.colorScheme || 'blue'}.50`, `${insight.colorScheme || 'blue'}.900`)}
                  p={2}
                  borderRadius="md"
                >
                  <Icon
                    as={insight.icon}
                    boxSize={5}
                    color={useColorModeValue(`${insight.colorScheme || 'blue'}.500`, `${insight.colorScheme || 'blue'}.200`)}
                  />
                </Flex>
              )}
              <Box>
                <Text fontSize="xs" color={labelColor} fontWeight="medium" textTransform="uppercase" mb={1}>
                  {insight.label}
                </Text>
                <Text fontSize="xl" fontWeight="bold" color={textColor}>
                  {insight.value}
                </Text>
              </Box>
            </Flex>
            {index < insights.length - 1 && index % 2 === 1 && <Divider mt={6} />}
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default StatusInsightsCard;
