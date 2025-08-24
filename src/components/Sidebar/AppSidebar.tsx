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
import { signOut } from 'next-auth/react';
import { usePathname, useSearchParams } from 'next/navigation';
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

import { useEffect, useState, useRef } from "react";
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
import {
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useToast,
} from "@chakra-ui/react";
import { useRouter } from "next/router";



import { chakra, shouldForwardProp } from "@chakra-ui/react";
import { isValidMotionProp } from "framer-motion";
import { Rajdhani } from "next/font/google";
import { useUserStore } from "@/stores/userStore";

// Extend chakra with motion.div
const MotionDiv = chakra(motion.div, {
  // allow motion props to be forwarded
  shouldForwardProp: (prop) =>
    isValidMotionProp(prop) || shouldForwardProp(prop),
});



const mont = Rajdhani({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
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
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  const sectionAnchors = [
    { label: "Summary", id: "draft-vs-final" },
    { label: "Draft", id: "Draft" },
    { label: "Review", id: "Review" },
    { label: "Last Call", id: "LastCall" },
    { label: "Living", id: "Living" },
    { label: "Final", id: "Final" },
    { label: "Stagnant", id: "Stagnant" },
    { label: "Withdrawn", id: "Withdrawn" },
  ];

  const years = [];

  for (let y = currentYear; y >= currentYear - 10; y--) {
    const months = [];

    const endMonth = y === currentYear ? currentMonth : 11;

    for (let m = endMonth; m >= 0; m--) {
      months.push({
        label: monthNames[m],
        href: `/insight/${y}/${m + 1}`,
        id: `insight-${y}-${m + 1}`, // optional: consistent ID
        children: sectionAnchors.map((section) => ({
          label: section.label,
          href: `/insight/${y}/${m + 1}#${section.id}`,
          id: section.id,
        })),
      });
    }

    years.push({
      label: String(y),
      id: `year-${y}`,
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
      { label: "Trending EIPs", href: "/#trending", id: "trending" },
      { label: "What is EIPs Insights?", href: "/#what", id: "what" },
      {
        label: "EIP Status Changes by Year",
        href: "/#statuschanges",
        id: "statuschanges",
      },
      { label: "Dashboard", href: "/#dashboard", id: "dashboard" },
      { label: "Latest Updates", href: "/#latest-updates", id: "latest-updates" },
    ],
  },
  {
    icon: LayoutDashboard,
    label: "Upgrade",
    href: "/upgrade",
    id: "upgrade-section",
    children: [
      {
        label: "Upgrade Details",
        children: [
          { label: "PECTRA", id: "pectra", href: "/upgrade?selected=pectra#pectra" },
          { label: "FUSAKA", id: "fusaka", href: "/upgrade?selected=fusaka#fusaka" },
          { label: "GLAMSTERDAM", id: "glamsterdam", href: "/upgrade?selected=glamsterdam#glamsterdam" },
        ],
      },
      { label: "Network Upgrades Graph", id: "NetworkUpgrades", href: "/upgrade#NetworkUpgrades" },
      { label: "Upgrade Blogs", id: "upgrade-blogs", href: "/upgrade#upgrade-blogs" },
      { label: "Upgrade Table", id: "upgrade-table", href: "/upgrade#upgrade-table" },
      {
        label: "Network Upgrades and EIPs Relationship Graph",
        id: "NetworkUpgradesChartp",
        href: "/upgrade#NetworkUpgradesChartp",
      },
      { label: "Network Upgrades Chart", id: "NetworkUpgradeschart", href: "/upgrade#NetworkUpgradeschart" },
      { label: "Author Contributions", id: "AuthorContributions", href: "/upgrade#AuthorContributions" },

    ],
  },
  {
    icon: Layers3,
    label: "Standards",
    children: [
      {
        label: "All",
        href: "/all",
        children: [{ label: "All EIP ERC RIP", href: "/all#All EIP ERC RIP" }],
      },
      {
        label: "EIPs",
        href: "/eip?view=type",
        children: [
          { label: "Overview", href: "/eip#ethereum-improvement" },
          { label: "GitHub Stats", href: "/eip#githubstats" },
          {
            label: "Category View", href: "/eip?view=category", children: [
              { label: "Category Graphs", href: "/eip?view=category#charts" },
              { label: "Category View", href: "/eip?view=category#categories" }

            ]
          },
          {
            label: "Status View", href: "/eip?view=status", children: [
              { label: "Status Graphs", href: "/eip?view=status#charts" },
              { label: "Draft vs Final", href: "/eip?view=status#draftvsfinal" },
              { label: "Category View", href: "/eip?view=status#statuses" }

            ]
          },
          { label: "All EIPs Table", href: "/eip#tables" }
        ]
      },
      {
        label: "ERCs",
        href: "/erc?view=category",
        children: [
          { label: "Overview", href: "/erc#ethereum-improvement" },
          { label: "GitHub Stats", href: "/erc#githubstats" },

          {
            label: "Category View",
            href: "/erc?view=category",
            children: [
              { label: "Category Graphs", href: "/erc?view=category#graphs" },
              { label: "ERC Progress ", href: "/erc?view=category#progress" },
            ],
          },

          {
            label: "Status View",
            href: "/erc?view=status",
            children: [
              { label: "Status Graphs", href: "/erc?view=status#graphs" },
              { label: "Draft vs Final", href: "/erc?view=status#draftvsfinal" },
              { label: "Category View", href: "/erc?view=status#statuses" },
            ],
          },

          { label: "All ERCs Table", href: "/erc#tables" },
        ],
      },
      {
        label: "RIPs",
        href: "/rip?view=category",
        children: [
          { label: "Overview", href: "/rip#ethereum-improvement" },
          { label: "GitHub Stats", href: "/rip#githubstats" },

          {
            label: "Category View",
            href: "/rip?view=category",
            children: [
              { label: "Category Graphs", href: "/rip?view=category#charts" },
              { label: "Category View", href: "/rip?view=category#rip-status-graph" }, // if you add id
            ],
          },

          {
            label: "Status View",
            href: "/rip?view=status",
            children: [
              { label: "Status Graphs", href: "/rip?view=status#charts" },
              { label: "Draft vs Final", href: "/rip?view=status#draftvsfinal" },
              { label: "Status View", href: "/rip?view=status#statuses" }
            ],
          },

          { label: "All RIPs Table", href: "/rip#status-tables" },
        ],
      }

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
          { label: "PR Labels Distribution", href: "/Analytics#PrLabelsChart" },
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
        label: "Transaction Tracker",
        href: "/txtracker",
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
  const activeSection = useSidebarStore((s) => s.activeSection);
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const [userData, setUserData] = useState<UserData | null>(null);
  const { user, setUser, clearUser } = useUserStore();
  const [flyoutMenu, setFlyoutMenu] = useState<{
    isOpen: boolean;
    item: any;
    position: { x: number; y: number };
  }>({ isOpen: false, item: null, position: { x: 0, y: 0 } });
  const flyoutRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const bottomItems = [
    // { icon: Search, label: "Search", href: "/search" },
    // { icon: UserCircle2, label: "Profile", href: "/profile" },
    { icon: Settings, label: "Settings", href: "/" },
  ];

  const bg = useColorModeValue("gray.100", "gray.900");
  const borderColor = useColorModeValue("gray.300", "gray.700");

  const toggleExpand = (label: string) => {
    setExpandedItems((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  useEffect(() => {
    const expandParents = (items: any[], activeId: string, path: string[] = []): string[] | null => {
      for (const item of items) {
        const itemHash = item.href?.split("#")[1] || item.id;
        if (itemHash === activeId) return path;
        if (item.children) {
          const result = expandParents(item.children, activeId, [...path, item.label]);
          if (result) return result;
        }
      }
      return null;
    };

    if (activeSection) {
      const activePath = expandParents(sidebarStructure, activeSection);
      if (activePath) {
        setExpandedItems((prev) => {
          const updated = { ...prev };
          activePath.forEach((label) => {
            updated[label] = true;
          });
          return updated;
        });
      }
    }
  }, [activeSection]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUserData(JSON.parse(storedUser));
    }
  }, []);

  const toast = useToast();
  const router = useRouter();

  // Add click handler for sidebar expansion/collapse toggle
  const handleSidebarClick = (e: React.MouseEvent) => {
    // Don't toggle if clicking on an interactive element
    const target = e.target as HTMLElement;
    const isInteractiveElement = target.closest('button, a, [role="button"], [tabindex]');
    
    if (!isInteractiveElement) {
      // Toggle between collapsed and expanded states
      toggleCollapse();
    }
  };

  // Handle flyout menu
  const handleFlyoutClick = (item: any, event: React.MouseEvent) => {
    if (!isCollapsed || !item.children?.length) return;
    
    event.stopPropagation();
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    
    setFlyoutMenu({
      isOpen: !flyoutMenu.isOpen || flyoutMenu.item?.label !== item.label,
      item: item,
      position: { x: rect.right + 8, y: rect.top }
    });
  };

  // Close flyout when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        flyoutRef.current && 
        !flyoutRef.current.contains(event.target as Node) &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        setFlyoutMenu({ isOpen: false, item: null, position: { x: 0, y: 0 } });
      }
    };

    if (flyoutMenu.isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [flyoutMenu.isOpen]);

  // Close flyout when sidebar expands
  useEffect(() => {
    if (!isCollapsed) {
      setFlyoutMenu({ isOpen: false, item: null, position: { x: 0, y: 0 } });
    }
  }, [isCollapsed]);

  const handleRefresh = async () => {
    if (!user) return;

    try {
      const response = await fetch('/api/GetUserStatus');
      const data = await response.json();

      const updatedUser = {
        ...user,
        tier: data.tier || user.tier || 'Free',
      };

      setUser(updatedUser);
      toast({
        title: 'Status refreshed',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Refresh failed',
        description: 'Could not fetch latest status',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleLogout = async () => {
    try {
      clearUser();
      await signOut({ redirect: false });

      toast({
        title: 'Logged out successfully',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });

      setTimeout(() => router.push('/signin'), 500);
    } catch (error) {
      toast({
        title: 'Logout failed',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };


  return (
    <>
      <Box
        ref={sidebarRef}
        pos="fixed"
        top="0"
        left="0"
        h="100vh"
        zIndex="50"
        display="flex"
        flexDir="column"
        justifyContent="space-between"
        transition="all 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
        w={isCollapsed ? "3.5rem" : "17rem"}
        bg={bg}
        borderRight="1px solid"
        borderColor={borderColor}
        roundedRight="xl"
        overflowY="auto"
        overflowX="hidden"
        py={4}
        onClick={handleSidebarClick}
        cursor={isCollapsed ? "pointer" : "default"}
        boxShadow="md"
      backdropFilter="blur(10px)"
      sx={{
        scrollbarWidth: "none",
        msOverflowStyle: "none",
        "&::-webkit-scrollbar": { display: "none" },
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: useColorModeValue(
            "linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.98) 100%)",
            "linear-gradient(180deg, rgba(23,25,35,0.95) 0%, rgba(23,25,35,0.98) 100%)"
          ),
          zIndex: -1,
          borderRadius: "inherit",
        },
      }}
      className={`${mont.className} base-page-size`}
    >
      {/* Collapse/Expand Button */}
      <Box px={2} mb={4}>
        <IconButton
          aria-label="Toggle Sidebar"
          icon={isCollapsed ? <ChevronRight /> : <ChevronLeft />}
          onClick={(e) => {
            e.stopPropagation(); // Prevent sidebar click handler
            toggleCollapse();
          }}
          size="sm"
          variant="ghost"
          w="100%"
          h="2.5rem"
          borderRadius="lg"
          transition="all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
          _hover={{ 
            bg: useColorModeValue("blue.50", "blue.900"),
            transform: "scale(1.05)",
            boxShadow: "md"
          }}
          _active={{ 
            transform: "scale(0.95)",
            bg: useColorModeValue("blue.100", "blue.800")
          }}
          color={useColorModeValue("blue.600", "blue.300")}
        />
      </Box>

      {/* Main Items */}
      <VStack 
        spacing={2} 
        px={2} 
        align="stretch" 
        flex="1" 
        overflowY="auto"
        css={{
          '&::-webkit-scrollbar': {
            width: '4px',
          },
          '&::-webkit-scrollbar-track': {
            width: '6px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: useColorModeValue('rgba(0,0,0,0.1)', 'rgba(255,255,255,0.1)'),
            borderRadius: '24px',
          },
        }}
      >
        {sidebarStructure.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ 
              delay: index * 0.05,
              duration: 0.3,
              ease: [0.4, 0, 0.2, 1]
            }}
          >
            <SidebarItem
              item={item}
              expanded={!isCollapsed}
              expandedItems={expandedItems}
              toggleExpand={toggleExpand}
              depth={0}
              isCollapsed={isCollapsed}
              onFlyoutClick={handleFlyoutClick}
            />
          </motion.div>
        ))}
      </VStack>

      <Divider borderColor={borderColor} my={2} />

      {/* Bottom Items */}
      <VStack spacing={2} px={2} align="stretch">
        {bottomItems.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              delay: 0.3 + index * 0.1,
              duration: 0.3,
              ease: [0.4, 0, 0.2, 1]
            }}
          >
            <SidebarItem
              item={item}
              expanded={!isCollapsed}
              expandedItems={expandedItems}
              toggleExpand={toggleExpand}
              depth={0}
              isCollapsed={isCollapsed}
              onFlyoutClick={handleFlyoutClick}
            />
          </motion.div>
        ))}
      </VStack>

      <Box mt={4} px={isCollapsed ? 1 : 4} transition="all 0.3s ease">
        {!isCollapsed ? (
  <Menu placement="top" isLazy>
    <MenuButton
      as={HStack}
      spacing={3}
      align="center"
      px={3}
      py={3}
      w="full"
      _hover={{ 
        bg: useColorModeValue("gray.100", "gray.700"),
        transform: "translateY(-1px)",
        boxShadow: "sm"
      }}
      borderRadius="xl"
      transition="all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
      justify="flex-start"
      cursor="pointer"
      border="1px solid"
      borderColor={useColorModeValue("gray.200", "gray.600")}
    >
      <Avatar
        size="sm"
        name={userData?.name}
        src={userData?.image || undefined}
        transition="all 0.2s"
        _hover={{ transform: "scale(1.1)" }}
      />
      <Box flex="1" textAlign="left">
        <Text fontSize="sm" fontWeight="semibold" noOfLines={1}>
          {userData?.name || "Profile"}
        </Text>
        <Text fontSize="xs" color={useColorModeValue("gray.500", "gray.400")} noOfLines={1}>
          {userData?.tier || "Free Tier"}
        </Text>
      </Box>
      <Box as={ChevronDown} size="16px" opacity={0.7} />
    </MenuButton>

    <MenuList zIndex={1000} borderRadius="xl" border="1px solid" borderColor={useColorModeValue("gray.200", "gray.600")}>
      <MenuItem 
        onClick={() => router.push("/profile")}
        borderRadius="lg"
        _hover={{ bg: useColorModeValue("blue.50", "blue.900") }}
      >
        👤 Profile
      </MenuItem>
      <MenuItem 
        onClick={handleRefresh}
        borderRadius="lg"
        _hover={{ bg: useColorModeValue("green.50", "green.900") }}
      >
        🔄 Refresh Status
      </MenuItem>
      <MenuDivider />
      <MenuItem 
        onClick={handleLogout}
        borderRadius="lg"
        _hover={{ bg: useColorModeValue("red.50", "red.900") }}
      >
        🚪 Logout
      </MenuItem>
    </MenuList>
  </Menu>
) : (
  <Tooltip label={userData?.name || "Profile"} placement="right" hasArrow>
    <Box
      px={2}
      py={2}
      w="full"
      display="flex"
      justifyContent="center"
      _hover={{ 
        bg: useColorModeValue("gray.100", "gray.700"),
        transform: "scale(1.05)"
      }}
      borderRadius="xl"
      transition="all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
      cursor="pointer"
      onClick={() => router.push("/profile")}
      border="1px solid transparent"
      _active={{ transform: "scale(0.95)" }}
    >
      <Avatar
        size="sm"
        name={userData?.name}
        src={userData?.image || undefined}
        transition="all 0.2s"
        _hover={{ boxShadow: "lg" }}
      />
    </Box>
  </Tooltip>
        )}
      </Box>

    </Box>

    {/* Flyout Menu */}
    <AnimatePresence>
      {flyoutMenu.isOpen && flyoutMenu.item && (
        <Box
          ref={flyoutRef}
          position="fixed"
          left={`${flyoutMenu.position.x}px`}
          top={`${flyoutMenu.position.y}px`}
          zIndex="60"
          as={motion.div}
          initial={{ opacity: 0, scale: 0.95, x: -10 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          exit={{ opacity: 0, scale: 0.95, x: -10 }}
          transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] } as any}
        >
          <FlyoutMenu 
            item={flyoutMenu.item} 
            onClose={() => setFlyoutMenu({ isOpen: false, item: null, position: { x: 0, y: 0 } })}
          />
        </Box>
      )}
    </AnimatePresence>
  </>

  );
}

export function SidebarItem({
  item,
  expanded, // Top-level sidebar expanded state
  expandedItems,
  toggleExpand,
  depth = 0,
  isCollapsed,
  onFlyoutClick,
}: {
  item: any;
  expanded: boolean;
  expandedItems: Record<string, boolean>;
  toggleExpand: (label: string) => void;
  depth?: number;
  isCollapsed?: boolean;
  onFlyoutClick?: (item: any, event: React.MouseEvent) => void;
}) {
  const hasChildren = item.children && item.children.length > 0;
  const isExpanded = expandedItems[item.label];
  const activeSection = useSidebarStore((s) => s.activeSection);
  const [isItemHovered, setIsItemHovered] = useState(false);
  const [showFlyout, setShowFlyout] = useState(false);
  const flyoutRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  const textColor = useColorModeValue("gray.700", "whiteAlpha.900");
  const iconColor = useColorModeValue("gray.600", "gray.300");
  const hoverBg = useColorModeValue("gray.100", "gray.700");
  const activeBg = useColorModeValue("blue.50", "blue.900");
  const activeTextColor = useColorModeValue("blue.700", "blue.200");
  const borderColor = useColorModeValue("gray.300", "gray.700");

  const getHrefHash = (href: string) => {
    const parts = href.split("#");
    return parts.length > 1 ? parts[1] : null;
  };

  const itemHash = item.href ? getHrefHash(item.href) : item.id || null;
  const isLeafNode = !item.children || item.children.length === 0;
  const isActive = isLeafNode && itemHash === activeSection;

  const router = useRouter();


  const variants: Variants = {
    open: {
      opacity: 1,
      height: "auto",
      pointerEvents: "auto",
      transition: { 
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1],
        staggerChildren: 0.05,
        delayChildren: 0.1
      },
    },
    isCollapsed: {
      opacity: 0,
      height: 0,
      pointerEvents: "none",
      transition: { 
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1]
      },
    },
  };

  const childVariants: Variants = {
    open: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
    },
    isCollapsed: {
      opacity: 0,
      x: -10,
      transition: { duration: 0.2 }
    }
  };

  const handleNavigation = (e: React.MouseEvent, href: string) => {
    const isHashLink = href.includes("#");
    if (!isHashLink) return;

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
  };

  // Navigation helper function
  const navigateToItem = (item: any) => {
    if (!item.href) return;

    const [path, hash] = item.href.split("#");
    const isSamePage = window.location.pathname === path;

    if (isSamePage && hash) {
      const target = document.getElementById(hash);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        history.pushState(null, "", item.href);
      }
    } else if (!hash) {
      router.push(item.href);
    } else {
      router.push(item.href);
    }
  };

  const shouldShowChildren = expanded && isExpanded;
  return (
    <Box>
      {/* Main clickable row */}
      <Tooltip 
        label={isCollapsed ? item.label : ""} 
        placement="right" 
        hasArrow
        bg={useColorModeValue("gray.800", "gray.200")}
        color={useColorModeValue("white", "gray.800")}
        fontSize="sm"
        borderRadius="md"
        openDelay={300}
      >
        <HStack
          spacing={3}
          px={depth > 0 ? 2 : 3}
          py={2.5}
          mx={1}
          bg={
            isActive 
              ? activeBg
              : isItemHovered 
                ? hoverBg 
                : "transparent"
          }
          fontWeight={isActive ? "semibold" : "medium"}
          borderRadius="xl"
          cursor={hasChildren || item.href ? "pointer" : "default"}
          onClick={(e) => {
            e.stopPropagation(); // Prevent sidebar expansion on item click
            
            // If collapsed and has children, show flyout menu
            if (isCollapsed && hasChildren && onFlyoutClick) {
              onFlyoutClick(item, e);
            }
            // If collapsed and has href, navigate directly
            else if (isCollapsed && item.href) {
              navigateToItem(item);
            } 
            // If expanded and has children, toggle expansion
            else if (hasChildren) {
              toggleExpand(item.label);
            }
            // If expanded and has href but no children, navigate
            else if (item.href) {
              navigateToItem(item);
            }
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              // Same logic as onClick for keyboard accessibility
              if (isCollapsed && hasChildren && onFlyoutClick) {
                onFlyoutClick(item, e as any);
              } else if (isCollapsed && item.href) {
                navigateToItem(item);
              } else if (hasChildren) {
                toggleExpand(item.label);
              } else if (item.href) {
                navigateToItem(item);
              }
            }
          }}
          tabIndex={0}
          role="button"
          aria-label={isCollapsed ? `${item.label}${hasChildren ? ' (has submenu)' : ''}` : undefined}
          onMouseEnter={() => setIsItemHovered(true)}
          onMouseLeave={() => setIsItemHovered(false)}
          _hover={{ 
            transform: "translateX(2px)",
            boxShadow: isActive ? "lg" : "sm"
          }}
          _active={{ 
            transform: "scale(0.98)" 
          }}
          justifyContent={expanded ? "flex-start" : "center"}
          color={isActive ? activeTextColor : textColor}
          userSelect="none"
          transition="all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
          position="relative"
          border="1px solid transparent"
          _before={isActive ? {
            content: '""',
            position: "absolute",
            left: "-4px",
            top: "50%",
            transform: "translateY(-50%)",
            width: "3px",
            height: "60%",
            bg: useColorModeValue("blue.500", "blue.300"),
            borderRadius: "full",
          } : {}}
        >
          {item.icon && (
            <Icon 
              as={item.icon} 
              boxSize={5} 
              color={isActive ? activeTextColor : iconColor} 
              flexShrink={0}
              transition="all 0.2s"
              transform={isItemHovered ? "scale(1.1)" : "scale(1)"}
            />
          )}

          {expanded && (
            <>
              {item.href ? (
                <Text
                  as="a"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent parent click handler
                    navigateToItem(item);
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
                  color={isActive ? activeTextColor : iconColor}
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent parent click handler
                    toggleExpand(item.label);
                  }}
                  transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                  transform={`rotate(${isExpanded ? '0deg' : '0deg'})`}
                  _hover={{ 
                    transform: `scale(1.2) rotate(${isExpanded ? '0deg' : '0deg'})`,
                    color: useColorModeValue("blue.600", "blue.300")
                  }}
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
              pl={`${depth * 1.5 + 1}rem`}
              alignItems="stretch"
              gap={1}
              mt={2}
              initial="isCollapsed"
              animate="open"
              exit="isCollapsed"
              variants={variants}
              overflow="hidden"
              position="relative"
            >
              <Box
                position="absolute"
                left={`${depth * 1.5 + 0.8}rem`}
                top="0"
                bottom="0"
                width="2px"
                bg={useColorModeValue("blue.200", "blue.700")}
                borderRadius="full"
                opacity={0.6}
                zIndex={0}
              />
              {item.children.map((child: any, index: number) => (
                <MotionDiv
                  key={child.label}
                  variants={childVariants}
                  custom={index}
                >
                  <SidebarItem
                    item={child}
                    expanded={expanded}
                    expandedItems={expandedItems}
                    toggleExpand={toggleExpand}
                    depth={depth + 1}
                    isCollapsed={isCollapsed}
                    onFlyoutClick={onFlyoutClick}
                  />
                </MotionDiv>
              ))}
            </MotionDiv>
          )}
        </AnimatePresence>
      )}
    </Box>
  );
}

// Flyout Menu Component
function FlyoutMenu({ item, onClose }: { item: any; onClose: () => void }) {
  const bg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const hoverBg = useColorModeValue("gray.50", "gray.700");
  
  const router = useRouter();

  const navigateToItem = (item: any) => {
    if (!item.href) return;
    onClose(); // Close flyout when navigating

    const [path, hash] = item.href.split("#");
    const isSamePage = window.location.pathname === path;

    if (isSamePage && hash) {
      const target = document.getElementById(hash);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        history.pushState(null, "", item.href);
      }
    } else {
      router.push(item.href);
    }
  };

  const renderFlyoutItem = (child: any, depth = 0) => (
    <Box
      key={child.label}
      pl={depth * 4}
      py={2}
      px={3}
      cursor="pointer"
      borderRadius="md"
      transition="all 0.2s"
      _hover={{ bg: hoverBg }}
      onClick={() => {
        if (child.href) {
          navigateToItem(child);
        }
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          if (child.href) {
            navigateToItem(child);
          }
        }
      }}
      tabIndex={0}
      role="menuitem"
    >
      <HStack spacing={2}>
        {child.icon && <Icon as={child.icon} boxSize={4} />}
        <Text fontSize="sm" fontWeight={child.children?.length ? "semibold" : "normal"}>
          {child.label}
        </Text>
      </HStack>
      
      {child.children?.map((grandchild: any) => (
        <Box key={grandchild.label} ml={4} mt={1}>
          {renderFlyoutItem(grandchild, depth + 1)}
        </Box>
      ))}
    </Box>
  );

  return (
    <Box
      bg={bg}
      border="1px solid"
      borderColor={borderColor}
      borderRadius="xl"
      boxShadow="xl"
      py={2}
      minW="200px"
      maxW="300px"
      maxH="400px"
      overflowY="auto"
      css={{
        '&::-webkit-scrollbar': {
          width: '4px',
        },
        '&::-webkit-scrollbar-track': {
          width: '6px',
        },
        '&::-webkit-scrollbar-thumb': {
          background: useColorModeValue('rgba(0,0,0,0.1)', 'rgba(255,255,255,0.1)'),
          borderRadius: '24px',
        },
      }}
      role="menu"
      aria-label={`${item.label} submenu`}
    >
      <Box px={3} py={2} borderBottom="1px solid" borderColor={borderColor}>
        <Text fontSize="sm" fontWeight="bold" color={useColorModeValue("gray.700", "gray.300")}>
          {item.label}
        </Text>
      </Box>
      
      <Box py={1}>
        {item.children?.map((child: any) => renderFlyoutItem(child))}
      </Box>
    </Box>
  );
}
