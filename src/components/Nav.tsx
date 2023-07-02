'use client'


import {
  Box,
  Flex,
  Text,
  IconButton,
  Button,
  Stack,
  Collapse,
  Icon,
  Link,
  Popover,
  PopoverTrigger,
  PopoverContent,
  useColorModeValue,
  useBreakpointValue,
  useDisclosure,
  Switch,
  VStack,
  useColorMode,
  Heading,
  Spacer,
} from "@chakra-ui/react";
import {
  HamburgerIcon,
  CloseIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  SunIcon,
  MoonIcon,
} from "@chakra-ui/icons";
import Logo from "./Logo";
import { GitHub } from "react-feather";
import NextLink from "next/link"
import { useState } from "react";
export default function WithSubnavigation() {
  const { isOpen, onToggle } = useDisclosure();
  const { toggleColorMode } = useColorMode();
  

  return (
    <Box>
      <Flex
        bg={useColorModeValue("white", "gray.800")}
        color={useColorModeValue("gray.600", "white")}
        minH={"60px"}
        py={{ base: 2 }}
        px={{ base: 4 }}
        borderBottom={1}
        borderStyle={"solid"}
        borderColor={useColorModeValue("gray.200", "gray.900")}
        align={"center"}
        justifyContent={"space-between"} // Add this line
        className="ml-40 mr-40 "
      >
        <Flex
          flex={{ base: 1, md: "auto" }}
          ml={{ base: -2 }}
          display={{ base: "flex", md: "none" }}
        >
          <IconButton
            onClick={onToggle}
            icon={
              isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />
            }
            variant={"ghost"}
            aria-label={"Toggle Navigation"}
          />
        </Flex>
        <Flex flex={{ base: 1 }} justify={{ base: "center", md: "start" }}>
        
          <Logo />
          <NextLink href='/' passHref>
          <Text
            textAlign={useBreakpointValue({ base: "center", md: "left" })}
            color={useColorModeValue("gray.800", "white")}
            ml={4}
            mt={3.5}
            className="font-bold hover:opacity-25 cursor-pointer ease-in duration-150"
          >
            EIPs Insights
          </Text>
          </NextLink>

          <Spacer />
          <Flex display={{ base: "none", md: "flex" }} ml={10}>
            <DesktopNav />
            <Stack
              flex={{ base: 1, md: 0 }}
              justify={"flex-end"}
              direction={"row"}
              spacing={6}
              mr={6}
              pr={4}
            >
              <NextLink href='https://github.com/Avarch-org/EIPUI' passHref>
              <IconButton
              aria-label="github"
              variant={"outline"}
                              colorScheme="green"
                              size="lg"
                              icon={<GitHub/>}
                              />
                              </NextLink>
              <IconButton
                aria-label="Mode Change"
                variant="outline"
                colorScheme="green"
                size="lg"
                icon={useColorModeValue(<MoonIcon />, <SunIcon />)}
                onClick={toggleColorMode}
                
              />
            </Stack>
          </Flex>
        </Flex>
      </Flex>

      <Collapse in={isOpen} animateOpacity>
        <MobileNav />
      </Collapse>
    </Box>
  );
}

const DesktopNav = () => {
  const linkColor = useColorModeValue("gray.600", "gray.200");
  const linkHoverColor = useColorModeValue("gray.800", "white");
  const popoverContentBgColor = useColorModeValue("white", "gray.800");
  const { toggleColorMode } = useColorMode();

  return (
    <Stack direction={"row"} spacing={5} mr={6} mt={3}>
      {NAV_ITEMS.map((navItem) => (
        <Box key={navItem.label}>
          <Popover trigger={"hover"} placement={"bottom-start"}>
            <PopoverTrigger>
              <Link
                p={2}
                href={navItem.href ?? "#"}
                fontSize={"sm"}
                fontWeight={500}
                color={linkColor}
                _hover={{
                  textDecoration: "none",
                  color: linkHoverColor,
                }}
                className="font-bold hover:text-emerald-400 cursor-pointer ease-in duration-300"
              >
                {navItem.label}
              </Link>
            </PopoverTrigger>

            {navItem.children && navItem.label === "Insight" && (
              <PopoverContent
                border={0}
                boxShadow={"xl"}
                bg={popoverContentBgColor}
                p={4}
                rounded={"xl"}
                minW={"sm"}
              >
                <Stack direction={"column"} spacing={2}>
                  {navItem.children.map((child) => (
                    <DesktopSubNav key={child.label} {...child} />
                  ))}
                </Stack>
              </PopoverContent>
            )}
            {navItem.children && navItem.label !== "Insight" && (
              <PopoverContent
                border={0}
                boxShadow={"xl"}
                bg={popoverContentBgColor}
                p={4}
                rounded={"xl"}
                minW={"sm"}
              >
                <Stack direction={"row"} spacing={5} ml={6} pl={4}>
                  {navItem.children.map((child) => (
                    <DesktopSubNav key={child.label} {...child} />
                  ))}
                </Stack>
              </PopoverContent>
            )}
          </Popover>
        </Box>
      ))}
    </Stack>
  );
};

const DesktopSubNav = ({ label, href, subLabel, children }: NavItem) => {
  const [isOpen, setIsOpen] = useState(false);
  const handleToggle = () => setIsOpen(!isOpen);

  return (
    <Box>
      <Link
        role={"group"}
        display={"block"}
        p={2}
        rounded={"md"}
        onClick={handleToggle}
        _hover={{ bg: useColorModeValue("pink.50", "gray.900") }}
      >
        <VStack spacing={1} align="start">
          <Text
            transition={"all .3s ease"}
            _groupHover={{ color: "pink.400" }}
            fontWeight={500}
          >
            {label}
          </Text>
          <Text fontSize={"sm"}>{subLabel}</Text>
        </VStack>
      </Link>
      
      <Collapse in={isOpen} animateOpacity style={{ marginTop: "0!important" }}>
        <Stack
          mt={2}
          pl={4}
          borderLeft={1}
          borderStyle={"solid"}
          borderColor={useColorModeValue("gray.200", "gray.700")}
          align={"start"}
        >
          {children &&
            children.map((subNavItem) => (
              <Link key={subNavItem.label} py={2} href={subNavItem.href}                 _hover={{
                  textDecoration: "none",
                  color: "pink.400",
                }}>
                {subNavItem.label}
              </Link>
            ))}
        </Stack>
      </Collapse>
    </Box>
  );
};



const MobileNav = () => {
  return (
    <Stack
      bg={useColorModeValue("white", "gray.800")}
      p={4}
      display={{ md: "none" }}
    >
      {NAV_ITEMS.map((navItem) => (
        <MobileNavItem key={navItem.label} {...navItem} />
      ))}
    </Stack>
  );
};

const MobileNavItem = ({ label, children, href }: NavItem) => {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <Stack spacing={4} onClick={children && onToggle}>
      <Flex
        py={2}
        as={Link}
        href={href ?? "#"}
        justify={"space-between"}
        align={"center"}
        _hover={{
          textDecoration: "none",
        }}
      >
        <Text
          fontWeight={600}
          color={useColorModeValue("gray.600", "gray.200")}
        >
          {label}
        </Text>
        {children && (
          <Icon
            as={ChevronDownIcon}
            transition={"all .25s ease-in-out"}
            transform={isOpen ? "rotate(180deg)" : ""}
            w={6}
            h={6}
          />
        )}
      </Flex>

      <Collapse in={isOpen} animateOpacity style={{ marginTop: "0!important" }}>
        <Stack
          mt={2}
          pl={4}
          borderLeft={1}
          borderStyle={"solid"}
          borderColor={useColorModeValue("gray.200", "gray.700")}
          align={"start"}
        >
          {children &&
            children.map((child) => (
              <Link key={child.label} py={2} href={child.href}>
                {child.label}
              </Link>
            ))}
        </Stack>
      </Collapse>
    </Stack>
  );
};

interface NavItem {
  label: string;
  subLabel?: string;
  children?: Array<NavItem>;
  href?: string;
}

function getMonthsTillCurrentYear(): NavItem[] {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const months: NavItem[] = [];
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

  for (let i = 0; i <= currentMonth; i++) {
    months.push({
      label: monthNames[i],
      subLabel: "January-December",
      href: `/insight/${currentYear}/${i+1}`,
    });
  }

  return months;
}


function getMonthsTillYear(year: number): NavItem[] {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const months: NavItem[] = [];
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

  let startMonth = 0;
  if (currentYear === year) {
    startMonth = currentMonth;
  }

  for (let i = startMonth; i < 12; i++) {
    months.push({
      label: monthNames[i],
      subLabel: `${monthNames[startMonth]}-${monthNames[11]}`,
      href: `/insight/${year}/${i+1}`,
    });
  }

  return months;
}




const NAV_ITEMS: Array<NavItem> = [
  {
    label: "All",
    href: "/all",
  },
  {
    label: "Type",
    href: "/type",
  },
  {
    label: "Status",
    href: "/status",
  },
  {
    label: "Insight",
    children: [
      {
        label: "2023",
        children: getMonthsTillCurrentYear(),
      },
      {
        label: "2022",
        children: getMonthsTillYear(2022),
      },
      {
        label: "2021",
        children: getMonthsTillYear(2022),
      },
      {
        label: "2020",
        children: getMonthsTillYear(2022),
      },
      {
        label: "2019",
        children: getMonthsTillYear(2022),
      },
      {
        label: "2018",
        children: getMonthsTillYear(2022),
      },
      {
        label: "2017",
        children: getMonthsTillYear(2022),
      },
    ],
  },
  {
    label: "Resources",
    href: "/resources",
  },
];
