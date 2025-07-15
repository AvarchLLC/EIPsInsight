'use client';
import {
  Box,
  Link,
  Text,
  useColorModeValue,
  useTheme,
} from "@chakra-ui/react";
import React from "react";
import FlexBetween from "./FlexBetween";
import { motion } from "framer-motion";
import NextLink from "next/link";

interface StatBoxProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description: string;
  url: string;
}

const StatBox: React.FC<StatBoxProps> = ({
  title,
  value,
  icon,
  description,
  url,
}) => {
  const bg = useColorModeValue("#f6f6f7", "#1a202c"); // light / dark
  const borderColor = useColorModeValue("gray.300", "#2d3748");
  const textColor = useColorModeValue("gray.800", "gray.200");
  const descColor = useColorModeValue("gray.600", "gray.400");
  const valueColor = useColorModeValue("#1e88e5", "#30A0E0"); // lighter blue for light mode

  return (
    <Box
      borderRadius="lg"
      bg={bg}
      p={4}
      boxShadow="md"
      border="1px solid"
      borderColor="transparent"
      _hover={{
        borderColor: "#30A0E0",
        boxShadow: "lg",
        cursor: "pointer",
      }}
    >
      <Link
        href={url}
        as={NextLink}
        textDecoration="none"
        _hover={{ textDecoration: "none" }}
      >
        <FlexBetween mb={2}>
          <Text
            fontWeight="bold"
            fontSize={{ base: "sm", md: "md", lg: "lg" }}
            color={textColor}
          >
            {title}
          </Text>
          {icon}
        </FlexBetween>

        <Text
          fontWeight="bold"
          fontSize={{ base: "xl", md: "2xl" }}
          color={valueColor}
        >
          {value}
        </Text>

        <Text
          fontSize={{ base: "xs", md: "sm" }}
          color={descColor}
          mt={2}
        >
          {description}
        </Text>
      </Link>
    </Box>
  );
};

export default StatBox;
