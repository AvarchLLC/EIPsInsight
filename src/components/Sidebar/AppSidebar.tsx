"use client";
import {
  FileText,
  Layers3,
  Wrench,
  BarChart,
  LayoutDashboard,
  BookOpen,
  Search,
  Settings,
  UserCircle2,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
} from "lucide-react";

import { IconButton, Tooltip } from "@chakra-ui/react";
import { Variants } from "framer-motion";
import {
  Box,
  VStack,
  HStack,
  Text,
  Icon,
  useColorModeValue,
  Divider,
  Flex,
} from "@chakra-ui/react";



import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useSidebarStore } from "@/stores/useSidebarStore";
import { children } from "cheerio/dist/commonjs/api/traversing";
import {
  FiBarChart2,
  FiDatabase,
  FiHome,
  FiInfo,
  FiTool,
} from "react-icons/fi";

import { chakra, shouldForwardProp } from "@chakra-ui/react";
import { isValidMotionProp } from "framer-motion";

// Extend chakra with motion.div
const MotionDiv = chakra(motion.div, {
  // allow motion props to be forwarded
  shouldForwardProp: (prop) =>
    isValidMotionProp(prop) || shouldForwardProp(prop),
});



interface UserData {
  id: string;
  name: string;
  email: string;
  image: string;
  tier: string;
  walletAddress?: string;
}


function generateYearlyInsights() {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth(); // 0-based
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const sectionAnchors = [
    { label: "Summary", id: "Summary" },
    { label: "Draft", id: "draft" },
    { label: "Review", id: "review" },
    { label: "Last Call", id: "lastcall" },
    { label: "Living", id: "living" },
    { label: "Final", id: "final" },
    { label: "Stagnant", id: "stagnant" },
    { label: "Withdrawn", id: "withdrawn" },
  ];

  const years = [];

  for (let y = currentYear; y >= currentYear - 10; y--) {
    const months = [];

    const endMonth = y === currentYear ? currentMonth : 11;

    for (let m = endMonth; m >= 0; m--) {
      months.push({
        label: monthNames[m],
        href: `/insight/${y}/${m + 1}`,
        children: sectionAnchors.map((section) => ({
          label: section.label,
          href: `/insight/${y}/${m + 1}#${section.id}`,
        })),
      });
    }

    years.push({
      label: String(y),
      children: months,
    });
  }

  return years;
}

const sidebarStructure = [
  {
    icon: BookOpen,
    label: "Home",
    href: "/",
    children: [
      { label: "All EIPs", href: "/#all", id: "all" },
      { label: "Our Tools", href: "/#ourtools", id: "ourtools" },
      { label: "What is EIPs Insights?", href: "/#what", id: "what" },
      {
        label: "EIP Status Changes by Year",
        href: "/#statuschanges",
        id: "statuschanges",
      },
      { label: "Dashboard", href: "/#dashboard", id: "dashboard" },
    ],
  },
  {
    icon: LayoutDashboard,
    label: "Upgrade",
    href: "/upgrade",
    children: [
      { label: "FUSAKA", href: "/upgrade#pectra" },
      { label: "PECTRA", href: "/upgrade#pectra" },
      {
        label: "Network Upgrades Graph",
        href: "/upgrade#NetworkUpgradesChartp",
      },
      { label: "Network Upgrades Graph", href: "/upgrade#NetworkUpgrades" },
      { label: "Author Contributions", href: "/upgrade#AuthorContributions" },
      { label: "Pectra Table", href: "/upgrade#pectra-table" },
    ],
  },
  {
    icon: Layers3,
    label: "All EIPs",
    children: [
      {
        label: "EIPs",
        href: "/eip",
        children: [
          { label: "Graphs", href: "/eip#graphs" },
          { label: "Draft vs Final", href: "/eip#draftvsfinal" },
          { label: "Core", href: "/eip#core" },
          { label: "Networking", href: "/eip#networking" },
          { label: "Interface", href: "/eip#interface" },
          { label: "Meta", href: "/eip#meta" },
          { label: "Informational", href: "/eip#informational" },
          { label: "Draft", href: "/eip#draft" },
          { label: "Review", href: "/eip#review" },
          { label: "Last Call", href: "/eip#lastcall" },
          { label: "Final", href: "/eip#final" },
          { label: "Stagnant", href: "/eip#stagnant" },
          { label: "Withdrawn", href: "/eip#withdrawn" },
          { label: "Living", href: "/eip#living" },
          { label: "Meta Table", href: "/eip#metatable" },
          { label: "Informational Table", href: "/eip#informationaltable" },
          { label: "Core Table", href: "/eip#coretable" },
          { label: "Networking Table", href: "/eip#networkingtable" },
          { label: "Interface Table", href: "/eip#interfacetable" },
        ],
      },
      {
        label: "ERCs",
        href: "/erc",
        children: [
          { label: "Graphs", href: "/erc#graphs" },
          { label: "ERC (Progress Over the Years)", href: "/erc#ercprogress" },
          { label: "Draft", href: "/erc#draft" },
          { label: "Review", href: "/erc#review" },
          { label: "Last Call", href: "/erc#lastcall" },
          { label: "Final", href: "/erc#final" },
          { label: "Stagnant", href: "/erc#stagnant" },
          { label: "Withdrawn", href: "/erc#withdrawn" },
          { label: "Living", href: "/erc#living" },
          { label: "Meta Table", href: "/erc#metatable" },
          { label: "ERC Table", href: "/erc#erctable" },
        ],
      },
      {
        label: "RIPs",
        href: "/rip",
        children: [
          { label: "Graphs", href: "/rip#graphs" },
          { label: "Draft vs Final", href: "/rip#draftvsfinal" },
          { label: "Draft", href: "/rip#draft" },
          { label: "Final", href: "/rip#final" },
          { label: "Living", href: "/rip#living" },
          { label: "Meta", href: "/rip#meta" },
          { label: "Informational", href: "/rip#informational" },
          { label: "Core", href: "/rip#core" },
          { label: "Networking", href: "/rip#networking" },
          { label: "Interface", href: "/rip#interface" },
          { label: "RIP", href: "/rip#rip" },
          { label: "RRC", href: "/rip#rrc" },
        ],
      },
    ],
  },
  {
    icon: Wrench,
    label: "Tools",
    children: [
      {
        label: "Analytics",
        href: "/Analytics",
        children: [
          { label: "Github PR Analytics", href: "/Analytics#GithubAnalytics" },
          { label: "EIPs Label Chart", href: "/Analytics#EIPsLabelChart" },
        ],
      },
      {
        label: "Boards",
        href: "/boards",
        children: [{ label: "EIPs BOARD", href: "/boards#EIPsBOARD" }],
      },
      {
        label: "Editors & Reviewers Leaderboard",
        href: "/Reviewers",
        children: [
          { label: "editors", href: "/Reviewers#editors" },
          { label: "Reviewers", href: "/Reviewers#Reviewers" },
          { label: "LeaderBoard", href: "/Reviewers#LeaderBoard" },
          { label: "Leaderboard FAQ", href: "/Reviewers#Leaderboard FAQ" },
          { label: "ActivityTimeline", href: "/Reviewers#ActivityTimeline" },
          { label: "PRs Reviewed", href: "/Reviewers#PRs Reviewed" },
          { label: "active editors", href: "/Reviewers#active editors" },
          { label: "comments", href: "/Reviewers#comments" },
        ],
      },
      {
        label: "EIP Proposal Builder",
        href: "/proposalbuilder",
        children: [
          {
            label: "EIP Builder",
            href: "/proposalbuilder#split#eip#new#EipTemplateEditor",
          },
        ],
      },
      {
        label: "Search By",
        children: [
          {
            label: "Author",
            href: "/authors",
            children: [
              { label: "Search Author", href: "/authors#Search Author" },
            ],
          },
          {
            label: "EIP",
            href: "/SearchEip",
            children: [{ label: "Search EIP", href: "/SearchEip#Search EIP" }],
          },
          {
            label: "EIP Title",
            href: "/SearchEipTitle",
            children: [
              {
                label: "Search EIP Title",
                href: "/SearchEipTitle#Search EIP Title",
              },
            ],
          },
          {
            label: "PR/ISSUE",
            href: "/SearchPRSandISSUES",
            children: [
              {
                label: "Search PR/ISSUE",
                href: "/SearchPRSandISSUES#Search PR/ISSUE",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    icon: BarChart,
    label: "Insights",
    children: generateYearlyInsights(),
  },
  { icon: BookOpen, label: "Resources", href: "/resources" },
];


export default function AppSidebar() {
  const { isCollapsed, toggleCollapse } = useSidebarStore();
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
    const [userData, setUserData] = useState<UserData | null>(null);

    const bottomItems = [
  // { icon: Search, label: "Search", href: "/search" },
  { icon: UserCircle2, label: "Profile", href: "/profile" },
  { icon: Settings, label: "Settings", href: "/" },
];

  const bg = useColorModeValue("gray.100", "gray.900");
  const borderColor = useColorModeValue("gray.300", "gray.700");

  const toggleExpand = (label: string) => {
    setExpandedItems((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <Box
      pos="fixed"
      top="0"
      left="0"
      h="100vh"
      zIndex="50"
      display="flex"
      flexDir="column"
      justifyContent="space-between"
      transition="width 0.3s"
      w={isCollapsed ? "3rem" : "16rem"}
      bg={bg}
      borderRight="1px solid"
      borderColor={borderColor}
      roundedRight="xl"
      overflowY="auto"
      py={4}
      sx={{ scrollbarWidth: "none", msOverflowStyle: "none", "&::-webkit-scrollbar": { display: "none" } }}
    >
      <Box px={2} mb={2}>
        <IconButton
          aria-label="Toggle Sidebar"
          icon={isCollapsed ? <ChevronRight /> : <ChevronLeft />}
          onClick={toggleCollapse}
          size="sm"
          variant="ghost"
          w="100%"
        />
      </Box>

      <VStack spacing={1} px={2} align="stretch" flex="1">
        {sidebarStructure.map((item) => (
          <SidebarItem
            key={item.label}
            item={item}
            expanded={!isCollapsed}
            expandedItems={expandedItems}
            toggleExpand={toggleExpand}
            depth={0}
            isCollapsed={isCollapsed}
          />
        ))}
      </VStack>

      <Divider borderColor={borderColor} my={2} />

      <VStack spacing={1} px={2} align="stretch">
        {bottomItems.map((item) => (
          <SidebarItem
            key={item.label}
            item={item}
            expanded={!isCollapsed}
            expandedItems={{}}
            toggleExpand={() => {}}
            depth={0}
            isCollapsed={isCollapsed}
          />
        ))}
      </VStack>
    </Box>
  );
}

export function SidebarItem({
  item,
  expanded,
  expandedItems,
  toggleExpand,
  depth = 0,
  isCollapsed,
}: {
  item: any;
  expanded: boolean;
  expandedItems: Record<string, boolean>;
  toggleExpand: (label: string) => void;
  depth?: number;
  isCollapsed?: boolean;
}) {
  const hasChildren = item.children && item.children.length > 0;
  const isExpanded = expandedItems[item.label];
  const activeSection = useSidebarStore((s) => s.activeSection);

  const textColor = useColorModeValue("gray.800", "whiteAlpha.900");
  const iconColor = useColorModeValue("gray.600", "gray.300");
  const hoverBg = useColorModeValue("gray.200", "gray.700");

  const isActive =
    (item.id && activeSection === item.id) ||
    item.href?.includes(`#${activeSection}`);

  const variants: Variants = {
    open: { opacity: 1, height: "auto", pointerEvents: "auto", transition: { duration: 0.3 } },
    isCollapsed: { opacity: 0, height: 0, pointerEvents: "none", transition: { duration: 0.2 } },
  };

  return (
    <Box>
      {/* Main clickable row */}
      <Tooltip label={isCollapsed ? item.label : ""} placement="right" hasArrow>
        <HStack
          spacing={3}
          px={3}
          py={2}
          bg={isActive ? useColorModeValue("blue.100", "blue.700") : "transparent"}
          fontWeight={isActive ? "bold" : "normal"}
          borderRadius="md"
          cursor={hasChildren || item.href ? "pointer" : "default"}
          onClick={() => hasChildren && toggleExpand(item.label)}
          _hover={{ bg: hoverBg }}
          justifyContent={expanded ? "flex-start" : "center"}
          color={textColor}
          userSelect="none"
          transition="all 0.2s"
        >
          {item.icon && (
            <Icon as={item.icon} boxSize={5} color={iconColor} flexShrink={0} />
          )}

          {expanded && (
            <>
              {item.href && !hasChildren ? (
                <Text
                  as="a"
                  onClick={(e) => {
                    const href = item.href;
                    if (!href) return;

                    const isHashLink = href.includes("#");
                    if (isHashLink) {
                      e.preventDefault();
                      const [path, hash] = href.split("#");

                      if (path && window.location.pathname !== path) {
                        window.location.href = href;
                        return;
                      }

                      const target = document.getElementById(hash);
                      if (target) {
                        target.scrollIntoView({ behavior: "smooth", block: "start" });
                        history.pushState(null, "", href);
                      }
                    } else {
                      window.location.href = href;
                    }
                  }}
                  cursor="pointer"
                  flex="1"
                  fontWeight="medium"
                  fontSize="sm"
                  _hover={{ textDecoration: "underline" }}
                >
                  {item.label}
                </Text>
              ) : (
                <Text flex="1" fontWeight="medium" fontSize="sm">
                  {item.label}
                </Text>
              )}

              {hasChildren && (
                <Icon
                  as={isExpanded ? ChevronDown : ChevronRight}
                  boxSize={4}
                  color={iconColor}
                />
              )}
            </>
          )}
        </HStack>
      </Tooltip>

      {/* Submenu Items */}
      {hasChildren && (
        <AnimatePresence initial={false}>
          {expanded && isExpanded && (
            <MotionDiv
              display="flex"
              flexDirection="column"
              pl={`${depth * 1.5}rem`}
              alignItems="stretch"
              gap={1.5}
              mt={1}
              initial="isCollapsed"
              animate="open"
              exit="isCollapsed"
              variants={variants}
              overflow="hidden"
              position="relative"
            >
              {/* Vertical Line */}
              <Box
                position="absolute"
                left="1rem"
                top="0"
                bottom="0"
                width="2px"
                bg={useColorModeValue("blue.400", "blue.300")}
                borderRadius="full"
                opacity={0.1}
                zIndex={-1}
              />

              {/* Subitems */}
              {item.children.map((child: any) => {
                const isChildActive =
                  child.id === activeSection ||
                  child.href?.includes(`#${activeSection}`);

                return (
                  <Box
                    key={child.label}
                    borderRadius="md"
                    px={3}
                    py={1.5}
                    fontSize="sm"
                    color={useColorModeValue(
                      isChildActive ? "blue.800" : "gray.800",
                      isChildActive ? "white" : "gray.200"
                    )}
                    bg={
                      isChildActive
                        ? useColorModeValue("blue.100", "blue.600")
                        : "transparent"
                    }
                    fontWeight={isChildActive ? "bold" : "normal"}
                    _hover={{
                      bg: useColorModeValue("blue.200", "blue.500"),
                    }}
                    transition="all 0.2s ease"
                    onClick={() => {
                      if (child.href) {
                        const [path, hash] = child.href.split("#");
                        if (path && window.location.pathname !== path) {
                          window.location.href = child.href;
                        } else if (hash) {
                          const el = document.getElementById(hash);
                          if (el) {
                            el.scrollIntoView({ behavior: "smooth" });
                            history.pushState(null, "", child.href);
                          }
                        }
                      }
                    }}
                    cursor="pointer"
                    position="relative"
                    zIndex={1}
                  >
                    {child.label}
                  </Box>
                );
              })}
            </MotionDiv>
          )}
        </AnimatePresence>
      )}
    </Box>
  );
}
