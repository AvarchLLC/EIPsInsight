import React, { useState } from "react";
import { usePathname } from "next/navigation";
import {
  Box,
  Collapse,
  Flex,
  IconButton,
  Link,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Spacer,
  Stack,
  Text,
  useBreakpointValue,
  useColorMode,
  useColorModeValue,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { CloseIcon, HamburgerIcon, MoonIcon, SunIcon } from "@chakra-ui/icons";
import NextLink from "next/link";
import { GitHub } from "react-feather";
import Logo from "@/components/Logo";

interface NavItem {
  label: string;
  subLabel?: string;
  children?: Array<NavItem>;
  href?: string;
}

const Navbar: React.FC = () => {
  const NAV_ITEMS: Array<NavItem> = [
    {
      label: "All",
      href: `/all`,
    },
    {
      label: "EIP",
      href: `/eip`,
    },
    {
      label: "ERC",
      href: `/erc`,
    },
    {
      label: "RIP",
      href: `/rip`,
    },
    {
      label: "Tools",
      children: [
        {
          label: "Open and Close Prs",
          href: `/openClosePr`,
        },
        {
          label: "Editors Review",
          href: `/editorsReview`,
        },
      ],
    },
    {
      label: "Insight",
      children: [
        {
          label: "2024",
          children: getMonthsTillCurrentYear(),
        },
        {
          label: "2023",
          children: getMonthsTillYear(2023),
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
        {
          label: "2016",
          children: getMonthsTillYear(2016),
        },
        {
          label: "2015",
          children: getMonthsTillYear(2015),
        },
      ],
    },
    {
      label: "More",
      children: [
        // {
        //     label: "Authors",
        //     href: `/authors`
        // },
        {
          label: "Resources",
          href: `/resources`,
        },
      ],
    },
  ];

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
        href: `/insight/${currentYear}/${i + 1}`,
      });
    }

    return months.reverse();
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

    for (let i = 11; i >= startMonth; i--) {
      months.push({
        label: monthNames[i],
        subLabel: `${monthNames[startMonth]}-${monthNames[11]}`,
        href: `/insight/${year}/${i + 1}`,
      });
    }
    return months;
  }

  const { isOpen, onToggle } = useDisclosure();
  const { toggleColorMode } = useColorMode();
  const linkColor = useColorModeValue("gray.600", "gray.200");
  const linkHoverColor = useColorModeValue("gray.800", "white");
  const popoverContentBgColor = useColorModeValue("white", "gray.800");

  return (
    <>
      <Box
        bg={useColorModeValue("gray.50", "gray.900")}
        color={useColorModeValue("gray.700", "gray.200")}
        position="sticky"
        top={0}
        zIndex="sticky"
      >
        <Box className={"lg:block md:hidden sm:hidden hidden"}>
          <Flex
            minH={"60px"}
            py={{ base: 2 }}
            px={{ base: 4 }}
            borderBottom={1}
            borderStyle={"solid"}
            borderColor={useColorModeValue("gray.200", "gray.900")}
            align={"center"}
            justifyContent={"space-between"} // Add this line
            className="lg:mx-40 md:mx-20 sm:mx-10 mx-10"
          >
            <Box className={"flex"}>
              <Logo />
              <NextLink href={`/home`} passHref>
                <Text
                  textAlign={useBreakpointValue({ base: "center", md: "left" })}
                  color={useColorModeValue("gray.800", "white")}
                  ml={4}
                  mt={5}
                  className="font-bold hover:opacity-25 cursor-pointer ease-in duration-150"
                >
                  EIPs Insights
                </Text>
              </NextLink>
            </Box>

            <Spacer />

            <div className={"flex space-x-8 font-bold"}>
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
                        className="font-bold hover:text-blue-400 cursor-pointer ease-in duration-300"
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
                        className={"overflow-y-auto"}
                        maxH={"900px"}
                      >
                        <Stack direction={"column"} spacing={2}>
                          {navItem.children.map((child) => (
                            <DesktopSubNav key={child.label} {...child} />
                          ))}
                        </Stack>
                      </PopoverContent>
                    )}

                    {navItem.children && navItem.label === "More" && (
                      <PopoverContent
                        border={0}
                        boxShadow={"xl"}
                        bg={popoverContentBgColor}
                        p={4}
                        rounded={"xl"}
                        minW={"sm"}
                        className={"overflow-y-auto"}
                        maxH={"900px"}
                      >
                        <Stack direction={"column"} spacing={2}>
                          {navItem.children.map((child) => (
                            <Box
                              _hover={{
                                bg: useColorModeValue("pink.50", "gray.900"),
                              }}
                              p={2}
                              rounded={"md"}
                              role={"group"}
                            >
                              <Text
                                transition={"all .3s ease"}
                                _groupHover={{ color: "pink.400" }}
                                fontWeight={500}
                              >
                                <NextLink href={`${child.href}`}>
                                  {child.label}
                                </NextLink>
                              </Text>
                            </Box>
                          ))}
                        </Stack>
                      </PopoverContent>
                    )}

                    {navItem.children && navItem.label === "Tools" && (
                      <PopoverContent
                        border={0}
                        boxShadow={"xl"}
                        bg={popoverContentBgColor}
                        p={4}
                        rounded={"xl"}
                        minW={"sm"}
                        className={"overflow-y-auto"}
                        maxH={"900px"}
                      >
                        <Stack direction={"column"} spacing={2}>
                          {navItem.children.map((child) => (
                            <Box
                              _hover={{
                                bg: useColorModeValue("pink.50", "gray.900"),
                              }}
                              p={2}
                              rounded={"md"}
                              role={"group"}
                            >
                              <Text
                                transition={"all .3s ease"}
                                _groupHover={{ color: "pink.400" }}
                                fontWeight={500}
                              >
                                <NextLink href={`${child.href}`}>
                                  {child.label}
                                </NextLink>
                              </Text>
                            </Box>
                          ))}
                        </Stack>
                      </PopoverContent>
                    )}

                    {navItem.children &&
                      navItem.label !== "Insight" &&
                      navItem.label !== "More" &&
                      navItem.label !== "Tools" && (
                        <PopoverContent
                          border={0}
                          boxShadow={"xl"}
                          bg={popoverContentBgColor}
                          p={4}
                          rounded={"xl"}
                          minW={"sm"}
                          className={"overflow-y-auto"}
                          maxH={"800px"}
                        >
                          <Stack direction={"row"} spacing={5} ml={6} pl={4}>
                            {navItem.children.map((child) => (
                              <>
                                <DesktopSubNav key={child.label} {...child} />
                                <p>hello</p>
                              </>
                            ))}
                          </Stack>
                        </PopoverContent>
                      )}
                  </Popover>
                </Box>
              ))}
            </div>

            <Flex ml={10}>
              <Stack
                flex={{ base: 1, md: 0 }}
                justify={"flex-end"}
                direction={"row"}
                spacing={6}
                mr={6}
                pr={4}
              >
                <NextLink href="https://github.com/Avarch-org/EIPUI" passHref>
                  <IconButton
                    aria-label="github"
                    variant={"outline"}
                    colorScheme="blue"
                    size="lg"
                    icon={<GitHub />}
                  />
                </NextLink>
                <IconButton
                  aria-label="Mode Change"
                  variant="outline"
                  colorScheme="blue"
                  size="lg"
                  icon={useColorModeValue(<MoonIcon />, <SunIcon />)}
                  onClick={toggleColorMode}
                />
              </Stack>
            </Flex>
          </Flex>
        </Box>

        <Box className={"lg:hidden md:block sm:block block"}>
          <Flex
            minH={"60px"}
            py={{ base: 2 }}
            borderBottom={1}
            borderStyle={"solid"}
            borderColor={useColorModeValue("gray.200", "gray.900")}
            align={"center"}
            justifyContent={"space-evenly"}
            className={"mx-10"}
          >
            <Flex flex={{ base: 1, md: "auto" }} ml={{ base: -2 }}>
              <IconButton
                onClick={onToggle}
                icon={
                  isOpen ? (
                    <CloseIcon w={5} h={5} />
                  ) : (
                    <HamburgerIcon w={8} h={8} />
                  )
                }
                variant={"ghost"}
                aria-label={"Toggle Navigation"}
              />
            </Flex>

            <Box className={"flex"}>
              <Logo />
              <NextLink href={`/dashboard`} passHref>
                <Text
                  textAlign={useBreakpointValue({ base: "center", md: "left" })}
                  color={useColorModeValue("gray.800", "white")}
                  ml={4}
                  mt={3.5}
                  className="font-bold hover:opacity-25 cursor-pointer ease-in duration-150 pt-1"
                >
                  EIPs <br /> Insights
                </Text>
              </NextLink>
            </Box>

            <Box>
              <Flex ml={10}>
                <Stack
                  flex={{ base: 1, md: 0 }}
                  justify={"flex-end"}
                  direction={"row"}
                  spacing={3}
                >
                  <NextLink href="https://github.com/Avarch-org/EIPUI" passHref>
                    <IconButton
                      aria-label="github"
                      variant={"outline"}
                      colorScheme="blue"
                      size="md"
                      icon={<GitHub />}
                    />
                  </NextLink>
                  <IconButton
                    aria-label="Mode Change"
                    variant="outline"
                    colorScheme="blue"
                    size="md"
                    icon={useColorModeValue(<MoonIcon />, <SunIcon />)}
                    onClick={toggleColorMode}
                  />
                </Stack>
              </Flex>
            </Box>
          </Flex>
          <div className="lg:hidden md:block sm:block block">
            {isOpen ? (
              <>
                <div className="flex flex-col relative  border rounded-[0.55rem] my-3 mx-4 space-y-4 py-3 text-lg">
                  {NAV_ITEMS.map((navItem) => (
                    <Box key={navItem.label} className={"flex flex-col"}>
                      <Popover trigger={"click"} placement={"bottom-start"}>
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
                            className="font-bold hover:text-blue-400 cursor-pointer ease-in duration-300 mx-10 border-b "
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
                            minW={"xs"}
                            className={"overflow-y-auto"}
                            maxH={"600px"}
                          >
                            <Stack direction={"column"} spacing={2}>
                              {navItem.children.map((child) => (
                                <DesktopSubNav key={child.label} {...child} />
                              ))}
                            </Stack>
                          </PopoverContent>
                        )}

                        {navItem.children && navItem.label === "More" && (
                          <PopoverContent
                            border={0}
                            boxShadow={"xl"}
                            bg={popoverContentBgColor}
                            p={4}
                            rounded={"xl"}
                            minW={"sm"}
                            className={"overflow-y-auto"}
                            maxH={"900px"}
                          >
                            <Stack direction={"column"} spacing={2}>
                              {navItem.children.map((child) => (
                                <Box
                                  _hover={{
                                    bg: useColorModeValue(
                                      "pink.50",
                                      "gray.900"
                                    ),
                                  }}
                                  p={2}
                                  rounded={"md"}
                                  role={"group"}
                                >
                                  <Text
                                    transition={"all .3s ease"}
                                    _groupHover={{ color: "pink.400" }}
                                    fontWeight={500}
                                  >
                                    <NextLink href={`${child.href}`}>
                                      {child.label}
                                    </NextLink>
                                  </Text>
                                </Box>
                              ))}
                            </Stack>
                          </PopoverContent>
                        )}

                        {navItem.children &&
                          navItem.label !== "Insight" &&
                          navItem.label !== "More" && (
                            <PopoverContent
                              border={0}
                              boxShadow={"xl"}
                              bg={popoverContentBgColor}
                              p={4}
                              rounded={"xl"}
                              minW={"xs"}
                              className={"overflow-y-auto"}
                              maxH={"600px"}
                            >
                              <Stack
                                direction={"column"}
                                spacing={5}
                                ml={6}
                                pl={4}
                              >
                                {navItem.children.map((child) => (
                                  <DesktopSubNav key={child.label} {...child} />
                                ))}
                              </Stack>
                            </PopoverContent>
                          )}
                      </Popover>
                    </Box>
                  ))}
                </div>
              </>
            ) : (
              <></>
            )}
          </div>
        </Box>
      </Box>
    </>
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
              <Link
                key={subNavItem.label}
                py={2}
                href={subNavItem.href}
                _hover={{
                  textDecoration: "none",
                  color: "pink.400",
                }}
              >
                {subNavItem.label}
              </Link>
            ))}
        </Stack>
      </Collapse>
    </Box>
  );
};

export default Navbar;
