import { motion } from 'framer-motion';
import { Box, Text, useColorModeValue, Link, HStack, IconButton } from '@chakra-ui/react';
import { FiCode } from 'react-icons/fi'; // Import an icon for the symbol button
import React from 'react';
import { usePathname } from 'next/navigation';

interface HeaderProps {
  title: string;
  subtitle: string;
}

const Header: React.FC<HeaderProps> = ({ title, subtitle }) => {
  const headingColorLight = "#333";
  const headingColorDark = "#F5F5F5";

  const headingBgGradientLight = "linear(to-r, #30A0E0, #ffffff)";
  const headingBgGradientDark = "linear(to-r, #30A0E0, #F5F5F5)";

  const pathname = usePathname();

  const effectiveHeadingBgGradientLight =
    pathname === "/home"
      ? headingBgGradientLight
      : "linear-gradient(to right, #007BB8, #003B5C)";

  const getCommitLink = () => {
    if (title.startsWith("EIP-")) {
      const eipNo = title.split("EIP-")[1];
      return `https://github.com/ethereum/EIPs/commits/master/EIPS/eip-${eipNo}.md`;
    } else if (title.startsWith("ERC-")) {
      const eipNo = title.split("ERC-")[1];
      return `https://github.com/ethereum/ERCs/commits/master/ERCS/erc-${eipNo}.md`;
    } else if (title.startsWith("RIP-")) {
      const eipNo = title.split("RIP-")[1];
      return `https://github.com/ethereum/RIPs/commits/master/RIPS/rip-${eipNo}.md`;
    }
    return null;
  };

  const commitLink = getCommitLink();

  return (
    <Box>
      <HStack spacing={4} alignItems="center">
        <Text
          as={motion.div}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 } as any}
          fontSize={{ base: "2xl", md: "2xl", lg: "6xl" }}
          fontWeight="bold"
          color={useColorModeValue(headingColorLight, headingColorDark)}
          bgGradient={useColorModeValue(effectiveHeadingBgGradientLight, headingBgGradientDark)}
          bgClip="text"
        >
          {title}
        </Text>
        {commitLink && (
          <IconButton
            as={Link}
            href={commitLink}
            isExternal
            aria-label="View Commit History"
            icon={<FiCode size={32} />}
            size="lg"
            color={useColorModeValue(headingColorLight, headingColorDark)}
            variant="ghost"
          />
        )}
      </HStack>
      <Text
        as={motion.div}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 } as any}
        fontSize={{ base: "lg", md: "lg", lg: "2xl" }}
        color={useColorModeValue(headingColorLight, headingColorDark)}
      >
        {subtitle}
      </Text>
    </Box>
  );
};

export default Header;
