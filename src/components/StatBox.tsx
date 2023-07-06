'use client'
import { Box, Link, Text, useColorModeValue, useTheme } from "@chakra-ui/react";
import React from "react";
import FlexBetween from "./FlexBetween";
import { motion } from 'framer-motion';

import NextLink from "next/link";
import { useRouter } from "next/navigation";

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
  const theme = useTheme();
  const bg = useColorModeValue("#f6f6f7", "#171923");
  const router = useRouter();


  return (

    <Box
    
      gridColumn="span 2"
      gridRow="span 1"
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      p="1.25rem 1rem"
      flex="1 1 100%"
      borderRadius="0.55rem"
      bgColor={bg}
      overflow="clip"
      _hover={{
        border: "1px",
        borderColor: "#10b981",
      }}
      className="hover:cursor-pointer ease-in duration-200"
      as={motion.div}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 } as any}
    >
      <Link href={url}       textDecoration="none" _hover={{ textDecoration: "none" }}>
      <FlexBetween>
        <Text fontWeight="bold">{title}</Text>
        {icon}
      </FlexBetween>

      <Text fontWeight="600" color="#10b981">
        {value}
      </Text>
      <FlexBetween gap="1rem">
        <Text fontSize="xs">{description}</Text>
      </FlexBetween>
      </Link>
    </Box>


  );
};

export default StatBox;
