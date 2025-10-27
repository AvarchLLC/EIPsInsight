 import { motion } from "framer-motion";
import { Box, Text, useColorModeValue, Flex } from "@chakra-ui/react";
import React from "react";
import { usePathname } from "next/navigation";
import CopyLink from "./CopyLink";

interface HeaderProps {
  title: string;
  subtitle: React.ReactNode;
  description: React.ReactNode;
  sectionId?: string;
}

const Header: React.FC<HeaderProps> = ({ title, subtitle, description, sectionId }) => {
  const headingColorLight = "#2C7A7B";
  const headingColorDark = "#81E6D9";
  const headingBgGradientLight = "linear(to-r, #4FD1C5, #319795)";
  const headingBgGradientDark = "linear(to-r, #81E6D9, #4FD1C5)";

  const pathname = usePathname();

  const effectiveHeadingBgGradientLight =
    pathname === "home"
      ? headingBgGradientLight
      : "linear(to-r, #2C7A7B, #285E61)";

  const dynamicLink = sectionId ? `https://eipsinsight.com/#${sectionId}` : "";

  const subtitleColor = useColorModeValue("#27696b", "#81E6D9"); // darker teal shade
  const descriptionColor = useColorModeValue("black", "white");

  return (
    <Box id="Ethereum Improvement" mb={{ base: 6, lg: 8 }}>
      <Flex alignItems="center" mb={4}>
        <Text
          as={motion.div}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          fontSize={{ base: "2xl", sm: "3xl", md: "4xl", lg: "5xl", xl: "6xl" }}
          fontWeight="extrabold"
          color={useColorModeValue(headingColorLight, headingColorDark)}
          bgGradient={useColorModeValue(effectiveHeadingBgGradientLight, headingBgGradientDark)}
          bgClip="text"
          lineHeight="1.1"
          letterSpacing="-0.02em"
        >
          {title}
        </Text>

        {sectionId && (
          <CopyLink
            link={dynamicLink}
            style={{ marginLeft: "12px", marginBottom: "4px" }}
          />
        )}
      </Flex>

      <Box
        as={motion.div}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 } as any}
      >
        <Text
          fontSize={{ base: "lg", md: "xl", lg: "2xl" }}
          fontWeight="bold"
          color={subtitleColor}
          mb={2}
        >
          {subtitle}
        </Text>
        
        <Text 
          fontSize={{ base: "md", md: "lg", lg: "xl" }}
          color={descriptionColor}
          lineHeight="1.6"
          maxWidth="800px"
          opacity={0.9}
        >
          {description}
        </Text>
      </Box>
    </Box>
  );
};

export default Header;
