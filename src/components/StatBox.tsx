import { Box, Text, useColorModeValue, useTheme } from "@chakra-ui/react";
import React from "react";
import FlexBetween from "./FlexBetween";

const StatBox = ({ title, value, icon, description }) => {
  const theme = useTheme();
  const bg = useColorModeValue("#f6f6f7", "#171923");
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
      overflow={"clip"}
      _hover={{
        border: "1px",
        borderColor: "#10b981",
      }}
      className="hover: cursor-pointer ease-in duration-200"
    >
      <FlexBetween>
        <Text fontWeight={"bold"}>{title}</Text>
        {icon}
      </FlexBetween>

      <Text fontWeight="600" color={"#10b981"}>
        {value}
      </Text>
      <FlexBetween gap="1rem">
        <Text fontSize="xs">{description}</Text>
      </FlexBetween>
    </Box>
  );
};

export default StatBox;
