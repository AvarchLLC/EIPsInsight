  // import { motion } from "framer-motion";
  // import { Box, Text, useColorModeValue, Flex } from "@chakra-ui/react";
  // import React from "react";
  // import { usePathname } from "next/navigation";
  // import CopyLink from "./CopyLink";

  // interface HeaderProps {
  //   title: string;
  //   subtitle: React.ReactNode;
  //   description: React.ReactNode;
  //   sectionId?: string; // new optional prop for dynamic link
  // }

  // const Header: React.FC<HeaderProps> = ({ title, subtitle, description, sectionId }) => {
  //   const headingColorLight = "#2C7A7B";
  //   const headingColorDark = "#81E6D9";
  //   const headingBgGradientLight = "linear(to-r, #4FD1C5, #319795)";
  //   const headingBgGradientDark = "linear(to-r, #81E6D9, #4FD1C5)";

  //   const pathname = usePathname();

  //   const effectiveHeadingBgGradientLight =
  //     pathname === "home"
  //       ? headingBgGradientLight
  //       : "linear(to-r, #2C7A7B, #285E61)";

  //   // Create dynamic link if sectionId is provided
  //   const dynamicLink = sectionId ? `https://eipsinsight.com/#${sectionId}` : "";

  //   return (
  //     <Box id="Ethereum Improvement">
  //       <Flex alignItems="center">
  // <Text
  //   as={motion.div}
  //   initial={{ opacity: 0, y: -20 }}
  //   animate={{ opacity: 1, y: 0 }}
  //   fontSize={{ base: "40px", sm: "42px", md: "44px", lg: "48px", xl: "56px", "2xl": "64px" }}
  //   fontWeight="extrabold"
  //   color={useColorModeValue(headingColorLight, headingColorDark)}
  //   bgGradient={useColorModeValue(effectiveHeadingBgGradientLight, headingBgGradientDark)}
  //   bgClip="text"
  // >
  //   {title}
  // </Text>


  //         {/* Show dynamic CopyLink if sectionId is passed */}
  //         {sectionId && (
  //           <CopyLink
  //             link={dynamicLink}
  //             style={{ marginLeft: "10px", marginBottom: "3px" }}
  //           />
  //         )}
  //       </Flex>

  //       {/* Subtitle and Description in one line */}
  //       <Text
  //         as={motion.div}
  //         initial={{ opacity: 0, y: -20 }}
  //         animate={{ opacity: 1, y: 0 }}
  //         transition={{ duration: 0.5, delay: 0.2 } as any}
  //         mt={2}
  //         fontSize={{ base: "lg", md: "xl", lg: "2xl" }}
  //         fontWeight="medium"
  //         // color={useColorModeValue("black", "white")}
  //         whiteSpace="normal"
  //         className="text-[#40E0D0]"
  //       >
  //         <Text
  //           as="span"
  //           fontWeight="bold"
  //           fontSize={{ base: "xl", md: "2xl", lg: "3xl" }}
  //           className="text-[#48D1CC]"
  //         >
  //           {subtitle}
  //         </Text>{" "}
  //         - {description}
  //       </Text>
  //     </Box>
  //   );
  // };

  // export default Header;


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
    <Box id="Ethereum Improvement">
      <Flex alignItems="center">
        <Text
          as={motion.div}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          fontSize={{ base: "40px", sm: "42px", md: "44px", lg: "48px", xl: "56px", "2xl": "64px" }}
          fontWeight="extrabold"
          color={useColorModeValue(headingColorLight, headingColorDark)}
          bgGradient={useColorModeValue(effectiveHeadingBgGradientLight, headingBgGradientDark)}
          bgClip="text"
        >
          {title}
        </Text>

        {sectionId && (
          <CopyLink
            link={dynamicLink}
            style={{ marginLeft: "10px", marginBottom: "3px" }}
          />
        )}
      </Flex>

      <Text
        as={motion.div}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 } as any}
        mt={2}
        fontSize={{ base: "lg", md: "xl", lg: "2xl" }}
        fontWeight="medium"
        whiteSpace="normal"
      >
        <Text
          as="span"
          fontWeight="bold"
          fontSize={{ base: "xl", md: "2xl", lg: "3xl" }}
          color={subtitleColor}
        >
          {subtitle}
        </Text>{" "}
        -{" "}
        <Text as="span" color={descriptionColor}>
          {description}
        </Text>
      </Text>
    </Box>
  );
};

export default Header;
