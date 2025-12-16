import React from "react";
import { Box, Button, Flex, useColorModeValue } from "@chakra-ui/react";
import NextLink from "next/link";
import { useRouter } from "next/router";

interface TabItem {
  name: string;
  path: string;
}

interface StatusTabNavigationProps {
  tabs: TabItem[];
}

const StatusTabNavigation: React.FC<StatusTabNavigationProps> = ({ tabs }) => {
  const router = useRouter();
  const currentPath = router.pathname;

  const activeBg = useColorModeValue("#30A0E0", "#4299E1");
  const activeColor = "white";
  const inactiveBg = useColorModeValue("white", "gray.700");
  const inactiveColor = useColorModeValue("gray.700", "gray.200");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const hoverBg = useColorModeValue("gray.50", "gray.600");

  return (
    <Box
      mb={6}
      overflowX="auto"
      pb={2}
      sx={{
        "&::-webkit-scrollbar": {
          height: "6px",
        },
        "&::-webkit-scrollbar-track": {
          background: "transparent",
        },
        "&::-webkit-scrollbar-thumb": {
          background: useColorModeValue("#CBD5E0", "#4A5568"),
          borderRadius: "3px",
        },
      }}
    >
      <Flex
        gap={2}
        flexWrap={{ base: "nowrap", md: "wrap" }}
        minWidth={{ base: "max-content", md: "auto" }}
      >
        {tabs.map((tab) => {
          const isActive = currentPath === tab.path;
          return (
            <NextLink key={tab.name} href={tab.path} passHref>
              <Button
                as="a"
                size={{ base: "sm", md: "md" }}
                bg={isActive ? activeBg : inactiveBg}
                color={isActive ? activeColor : inactiveColor}
                border="1px solid"
                borderColor={isActive ? activeBg : borderColor}
                fontWeight={isActive ? "bold" : "medium"}
                _hover={{
                  bg: isActive ? activeBg : hoverBg,
                  transform: "translateY(-2px)",
                  boxShadow: "md",
                }}
                _active={{
                  transform: "translateY(0)",
                }}
                transition="all 0.2s"
                minW={{ base: "auto", md: "120px" }}
                whiteSpace="nowrap"
              >
                {tab.name}
              </Button>
            </NextLink>
          );
        })}
      </Flex>
    </Box>
  );
};

export default StatusTabNavigation;
