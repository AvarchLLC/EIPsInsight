import { Box, Text, useTheme } from "@chakra-ui/react";
import React from "react";

const Header = ({ title, subtitle }) => {
  const theme = useTheme();
  return (
    <Box>
      <Text fontSize="3xl" fontWeight={"bold"} color={"#10b981"}>
        {title}
      </Text>
      <Text fontSize="xl" className="">
        {subtitle}
      </Text>
    </Box>
  );
};

export default Header;
