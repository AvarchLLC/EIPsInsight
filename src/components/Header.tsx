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
  center?: boolean; // when true, center-align heading, subtitle and description
}

const Header: React.FC<HeaderProps> = ({ title, subtitle, description, sectionId, center = false }) => {
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
    <Box id="Ethereum Improvement" mb={{ base: 4, lg: 6 }}>
      <Flex alignItems={center ? 'center' : 'center'} mb={3} gap={3} direction={center ? 'column' : 'row'} textAlign={center ? 'center' : 'left'}>
        <Text
          as={motion.div}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          fontSize={{ base: "2xl", sm: "3xl", md: "4xl", lg: "4xl", xl: "5xl" }}
          fontWeight="extrabold"
          color={useColorModeValue(headingColorLight, headingColorDark)}
          bgGradient={useColorModeValue(effectiveHeadingBgGradientLight, headingBgGradientDark)}
          bgClip="text"
          lineHeight="1.1"
          letterSpacing="-0.02em"
        >
          {title}
        </Text>
        {sectionId && !center && (
          // keep copy button vertically centered next to the large heading when not centering
          <Box alignSelf="center">
            <CopyLink link={dynamicLink} />
          </Box>
        )}
        {sectionId && center && (
          // when centering, show copy button beneath the title
          <Box mt={2}>
            <CopyLink link={dynamicLink} />
          </Box>
        )}
      </Flex>

      <Box
        as={motion.div}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 } as any}
      >
        <Text
          fontSize={{ base: "md", md: "lg", lg: "xl" }}
          fontWeight="bold"
          color={subtitleColor}
          mb={2}
        >
          {subtitle}
        </Text>
        
        <Text 
          fontSize={{ base: "sm", md: "md", lg: "lg" }}
          color={descriptionColor}
          lineHeight="1.5"
          maxWidth="600px"
          opacity={0.9}
          mt={1}
        >
          {description}
        </Text>
      </Box>
    </Box>
  );
};

export default Header;
