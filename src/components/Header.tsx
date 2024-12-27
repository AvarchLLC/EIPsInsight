import { motion } from 'framer-motion';
import { Box, Text, useColorModeValue, Flex } from '@chakra-ui/react';
import React from 'react';
import { usePathname } from 'next/navigation'; // Import usePathname from next/navigation
import CopyLink from './CopyLink';

interface HeaderProps {
  title: string;
  subtitle: string;
}

const Header: React.FC<HeaderProps> = ({ title, subtitle }) => {
  // Define colors and gradients for light and dark modes
  const headingColorLight = "#333"; // Dark color for light mode
  const headingColorDark = "#F5F5F5"; // Light color for dark mode

  const headingBgGradientLight = "linear(to-r, #30A0E0, #ffffff)";  // Updated light mode gradient
  const headingBgGradientDark = "linear(to-r, #30A0E0, #F5F5F5)"; // Dark mode gradient

  // Use usePathname to get the current pathname
  const pathname = usePathname(); // Get current path

  // Determine which gradient to use for light mode based on the current pathname
  const effectiveHeadingBgGradientLight =
    pathname === "/home"
      ? headingBgGradientLight
      : "linear-gradient(to right, #007BB8, #003B5C)"; // Use dark gradient if not on /home

  return (
    <Box>
      <Flex alignItems="center">
        <Text
          as={motion.div}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 } as any}
          fontSize={{ base: "2xl", md: "2xl", lg: "6xl" }}
          fontWeight="bold"
          color={useColorModeValue(headingColorLight, headingColorDark)} // Dynamic color
          bgGradient={useColorModeValue(effectiveHeadingBgGradientLight, headingBgGradientDark)} // Dynamic gradient
          bgClip="text" // Clip gradient to text
        >
          {title}
        </Text>
        {title === "DASHBOARD" && (
          <CopyLink
            link="https://eipsinsight.com//home#Dashboard"
            style={{ marginLeft: "10px", marginBottom: "3px" }} // Add margin for better spacing
          />
        )}
      </Flex>
      <Text
        as={motion.div}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 } as any}
        fontSize={{ base: "lg", md: 'lg', lg: "2xl" }}
        color={useColorModeValue(headingColorLight, headingColorDark)} // Dynamic color for subtitle
      >
        {subtitle}
      </Text>
    </Box>
  );
};

export default Header;
