import { motion } from 'framer-motion';
import { Box, Text, useColorModeValue, Link, HStack, IconButton, Tooltip } from '@chakra-ui/react';
import { FiCode, FiBookmark } from 'react-icons/fi';
import React from 'react';
import { usePathname } from 'next/navigation';
import { useBookmarks } from './BookmarkContext';

interface HeaderProps {
  title: string;
  subtitle: string;
}

const Header: React.FC<HeaderProps> = ({ title, subtitle }) => {
  const { toggleBookmark, isBookmarked } = useBookmarks();
  
  const headingColorLight = "#333";
  const headingColorDark = "#F5F5F5";
  const headingBgGradientLight = "linear(to-r, #30A0E0, #ffffff)";
  const headingBgGradientDark = "linear(to-r, #30A0E0, #F5F5F5)";

  const pathname = usePathname();
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  const effectiveHeadingBgGradientLight =
    pathname === "/home"
      ? headingBgGradientLight
      : "linear-gradient(to right, #007BB8, #003B5C)";

  const getCommitLink = () => {
    if (title.startsWith("EIP-")) {
      const eipNo = title.split("EIP-")[1];
      return `https://github.com/ethereum/EIPs/commits/master/EIPS/eip-${eipNo.trim()}.md`;
    } else if (title.startsWith("ERC-")) {
      const eipNo = title.split("ERC-")[1];
      return `https://github.com/ethereum/ERCs/commits/master/ERCS/erc-${eipNo.trim()}.md`;
    } else if (title.startsWith("RIP-")) {
      const eipNo = title.split("RIP-")[1];
      return `https://github.com/ethereum/RIPs/commits/master/RIPS/rip-${eipNo.trim()}.md`;
    }
    return null;
  };

  const commitLink = getCommitLink();

  const handleBookmarkClick = () => {
    toggleBookmark(currentUrl, `${title} - ${subtitle}`);
  };

  const bookmarkState = isBookmarked(currentUrl);

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
        <HStack>
          {commitLink && (
            <Tooltip label="View Commit History">
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
            </Tooltip>
          )}
          <Tooltip label={bookmarkState ? "Remove bookmark" : "Add bookmark"}>
            <Box
              position="relative"
              borderRadius="md"
              bg={bookmarkState ? useColorModeValue(headingColorLight, headingColorDark) : "transparent"}
              p={1}
            >
              <IconButton
                aria-label={bookmarkState ? "Remove bookmark" : "Add bookmark"}
                icon={<FiBookmark size={32} />}
                size="lg"
                onClick={handleBookmarkClick}
                color={bookmarkState ? "white" : useColorModeValue(headingColorLight, headingColorDark)}
                variant="ghost"
                position="relative"
                zIndex={1}
                _hover={{
                  bg: "transparent"
                }}
              />
              {bookmarkState && (
                <Box
                  position="absolute"
                  top={0}
                  left={0}
                  right={0}
                  bottom={0}
                  bgGradient={useColorModeValue(effectiveHeadingBgGradientLight, headingBgGradientDark)}
                  borderRadius="md"
                  opacity={0.8}
                />
              )}
            </Box>
          </Tooltip>
        </HStack>
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