import { motion } from 'framer-motion';
import { Box, Text, useColorModeValue, Flex } from '@chakra-ui/react';
import React from 'react';
import { usePathname } from 'next/navigation'; // Import usePathname from next/navigation
import CopyLink from './CopyLink';

interface HeaderProps {
  title: string;
  subtitle: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ title, subtitle }) => {
  // Turquoise color scheme
  const headingColorLight = "#2C7A7B"; // Dark turquoise
  const headingColorDark = "#81E6D9"; // Light turquoise

  // Turquoise gradients
  const headingBgGradientLight = "linear(to-r, #4FD1C5, #319795)";
  const headingBgGradientDark = "linear(to-r, #81E6D9, #4FD1C5)";

  const pathname = usePathname();

  const effectiveHeadingBgGradientLight =
    pathname === "/home"
      ? headingBgGradientLight
      : "linear(to-r, #2C7A7B, #285E61)"; // Darker turquoise gradient for non-home

  return (
    <Box>
      <Flex alignItems="center">
        <Text
          as={motion.div}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 } as any}
          fontSize={{ base: "40px", sm: "42px", md: "44px", lg: "48px" }}
          fontWeight="bold"
          color={useColorModeValue(headingColorLight, headingColorDark)}
          bgGradient={useColorModeValue(effectiveHeadingBgGradientLight, headingBgGradientDark)}
          bgClip="text"
        >
          {title}
        </Text>
        {title === "DASHBOARD" && (
          <CopyLink
            link="https://eipsinsight.com//home#Dashboard"
            style={{ marginLeft: "10px", marginBottom: "3px" }}
          />
        )}
      </Flex>
      <Text
        as={motion.div}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 } as any}
        fontSize={{ base: "24px", sm: "24px", md: "26px", lg: "28px" }}
        color={useColorModeValue("black", "white")}
      >
        {subtitle}
      </Text>
    </Box>
  );
};
export default Header;
