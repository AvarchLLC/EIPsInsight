
import { Box, Link, Text, useColorModeValue, useTheme } from "@chakra-ui/react";
import React from "react";
import FlexBetween from "./FlexBetween";
import { motion } from 'framer-motion';

import NextLink from "next/link";
import { useRouter } from "next/navigation";

interface CatBoxProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  url: string;
  percent: number;
}


const CatBox: React.FC<CatBoxProps> = ({
  title,
  value,
  icon,
  url, percent,
}) => {
  const theme = useTheme();
  const bg = useColorModeValue("#f6f6f7", "#171923");
  const router = useRouter();
  const getBgColor = (title: string) => {
    switch (title) {
      case "Standard Tracks":
        return 'rgba(201, 203, 207, 0.2)';
      case "Core":
        return "rgba(255, 99, 132, 0.2)";
      case "ERCs":
        return 'rgba(75, 192, 192, 0.2)';
        case "Networking":
          return 'rgba(255, 159, 64, 0.2)';
      case "Interface":
        return "rgba(153, 102, 255, 0.2)";
      case "Meta":
        return "rgba(255, 99, 255, 0.2)";
      case "Informational":
        return "rgba(50, 205, 50, 0.2)";
      default:
        return 'rgba(201, 203, 207, 0.2)';
    }
  };

  const getColor = (title: string) => {
    switch (title) {
      case "Standard Tracks":
        return 'rgb(201, 203, 207)';
      case "Core":
        return "rgb(255, 99, 132)";
      case "ERCs":
        return 'rgb(75, 192, 192)';
      case "Networking":
          return 'rgb(255, 159, 64)';
      case "Interface":
        return "rgb(153, 102, 255)";
      case "Meta":
        return "rgb(255, 99, 255)";
      case "Informational":
        return "rgb(50, 205, 50)";
      default:
        return 'rgb(201, 203, 207)';
    }
  };


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
      bgColor={getBgColor(title)}
      overflow="clip"
      _hover={{
        border: "1px",
        borderColor: getColor(title),
      }}
      className="hover:cursor-pointer ease-in duration-200"
      as={motion.div}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 } as any}
    >
      <Link href={url}       textDecoration="none" _hover={{ textDecoration: "none" }}>
      <FlexBetween>
        <Text fontWeight="bold" fontSize={{lg:"lg", sm: "xs",md:"sm"}}>{title}</Text>
        {icon}
      </FlexBetween>

      <FlexBetween>
        <Text fontWeight="600" fontSize={{lg: "5xl", sm: "2xl",base:"2xl",md:"3xl"}} color="#30A0E0">
          {value}
        </Text>
        <Text fontWeight="600" fontSize={{lg: "3xl", sm: "xl",base:"lg",md:"2xl"}} color="#30A0E0">
            {percent}%
        </Text>
      </FlexBetween>
      </Link>
    </Box>


  );
};

export default CatBox;
