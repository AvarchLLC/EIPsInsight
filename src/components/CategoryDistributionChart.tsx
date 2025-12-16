import React from "react";
import { Box, Text, Flex, useColorModeValue, Progress, Badge } from "@chakra-ui/react";
import { motion } from "framer-motion";

interface CategoryData {
  category: string;
  count: number;
  percentage: number;
  color: string;
}

interface CategoryDistributionChartProps {
  data: CategoryData[];
  title?: string;
}

const CategoryDistributionChart: React.FC<CategoryDistributionChartProps> = ({ data, title = "Distribution by Category" }) => {
  const bg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.700", "gray.200");

  const sortedData = [...data].sort((a, b) => b.count - a.count);

  return (
    <Box
      as={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 } as any}
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
      
      <Box>
        {sortedData.map((item, index) => (
          <Box
            key={item.category}
            mb={4}
            as={motion.div}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 } as any}
          >
            <Flex justify="space-between" align="center" mb={2}>
              <Flex align="center" gap={2}>
                <Badge colorScheme={item.color} fontSize="xs" px={2}>
                  {item.category}
                </Badge>
                <Text fontSize="sm" color="gray.500">
                  {item.count} EIPs
                </Text>
              </Flex>
              <Text fontSize="sm" fontWeight="semibold" color={textColor}>
                {item.percentage.toFixed(1)}%
              </Text>
            </Flex>
            <Progress
              value={item.percentage}
              size="sm"
              colorScheme={item.color}
              borderRadius="full"
              bg={useColorModeValue("gray.100", "gray.700")}
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default CategoryDistributionChart;
