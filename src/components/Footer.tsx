import { ReactNode } from "react";
import {
  Box,
  Container,
  Stack,
  SimpleGrid,
  Text,
  Link,
  VisuallyHidden,
  chakra,
  useColorModeValue,
  Button,
  Flex,
} from "@chakra-ui/react";
import { FaTwitter, FaYoutube, FaInstagram } from "react-icons/fa";
import NextLink from "next/link";
import { BsGithub, BsDiscord, BsTwitter, BsInstagram, BsYoutube, BsLinkedin, BsNewspaper } from 'react-icons/bs'

const ListHeader = ({ children }: { children: ReactNode }) => {
  return (
    <Text fontWeight={"500"} fontSize={"lg"} mb={2}>
      {children}
    </Text>
  );
};

const SocialButton = ({
  children,
  label,
  href,
}: {
  children: ReactNode,
  label: string,
  href: string,
}) => {
  return (
    <chakra.button
      bg={useColorModeValue("blackAlpha.100", "whiteAlpha.100")}
      rounded={"full"}
      w={8}
      h={8}
      cursor={"pointer"}
      as={"a"}
      href={href}
      display={"inline-flex"}
      alignItems={"center"}
      justifyContent={"center"}
      transition={"background 0.3s ease"}
      _hover={{
        bg: useColorModeValue("blackAlpha.200", "whiteAlpha.200"),
      }}
    >
      <VisuallyHidden>{label}</VisuallyHidden>
      {children}
    </chakra.button>
  );
};

export default function LargeWithAppLinksAndSocial() {

  const monthName = new Date().toLocaleString([], {
    month: 'long',
  });
  const year = new Date().getFullYear();

  return (


    <>
      <Box
        bg={useColorModeValue("gray.50", "gray.900")}
        color={useColorModeValue("gray.700", "gray.200")}
        px={{ base: 6, md: 14 }}
        py={8}
      >
        <Container maxW="7xl">
          <SimpleGrid
            columns={{ base: 1, md: 3 }}
            spacing={{ base: 8, md: 8 }}
            alignItems="flex-start"
          >
            {/* EIPs Insight Section */}
            <Box>
              <Stack spacing={5} h="100%" justify="space-between">
                <Box>
                  <Text fontSize="xl" fontWeight="bold" color={useColorModeValue("gray.800", "white")} mb={4}>
                    EIPs Insight
                  </Text>
                  
                  <Text fontSize="md" color={useColorModeValue("gray.600", "gray.300")} mb={4}>
                    Build With <Box as="span" color="blue.500">💙</Box> by{" "}
                    <NextLink href="https://avarch.org" target="_blank">
                      <Box as="span" color="blue.500" _hover={{ textDecoration: "underline" }} cursor="pointer">
                        Avarch
                      </Box>
                    </NextLink>
                  </Text>
                  
                  <Flex align="center" gap={3} mb={4}>
                    <Text fontSize="md" fontWeight="semibold">Join us:</Text>
                    <Flex gap={3}>
                      <NextLink href="https://github.com/AvarchLLC/EIPsInsight" target="_blank">
                        <Box _hover={{ transform: "scale(1.1)" }} transition="transform 0.2s" cursor="pointer">
                          <BsGithub size={20} />
                        </Box>
                      </NextLink>
                      <NextLink href="https://discord.gg/tUXgfV822C" target="_blank">
                        <Box _hover={{ transform: "scale(1.1)" }} transition="transform 0.2s" cursor="pointer">
                          <BsDiscord size={20} />
                        </Box>
                      </NextLink>
                    </Flex>
                  </Flex>
                </Box>
                
                <Flex justify="flex-end">
                  <Text fontSize="sm" color="gray.500">v3.0.0</Text>
                </Flex>
              </Stack>
            </Box>

            {/* Links Section */}
            <Box>
              <Stack spacing={4}>
                <Text fontSize="xl" fontWeight="bold" textDecoration="underline" textUnderlineOffset="4px">
                  Links
                </Text>
                
                <SimpleGrid columns={2} spacing={4} spacingY={3}>
                  <Box>
                    <NextLink href="/all">
                      <Text 
                        _hover={{ color: useColorModeValue("blue.600", "blue.300"), transform: "translateX(2px)" }} 
                        cursor="pointer"
                        transition="all 0.2s ease"
                        fontSize="sm"
                        fontWeight="medium"
                      >
                        All
                      </Text>
                    </NextLink>
                  </Box>
                  
                  <Box>
                    <NextLink href="/status">
                      <Text 
                        _hover={{ color: useColorModeValue("blue.600", "blue.300"), transform: "translateX(2px)" }} 
                        cursor="pointer"
                        transition="all 0.2s ease"
                        fontSize="sm"
                        fontWeight="medium"
                      >
                        Status
                      </Text>
                    </NextLink>
                  </Box>
                  
                  <Box>
                    <NextLink href={`/insight/${year}/${getMonth(monthName)}`}>
                      <Text 
                        _hover={{ color: useColorModeValue("blue.600", "blue.300"), transform: "translateX(2px)" }} 
                        cursor="pointer"
                        transition="all 0.2s ease"
                        fontSize="sm"
                        fontWeight="medium"
                        lineHeight="1.3"
                      >
                        {monthName} {year} Insights
                      </Text>
                    </NextLink>
                  </Box>
                  
                  <Box>
                    <NextLink href="/About">
                      <Text 
                        _hover={{ color: useColorModeValue("blue.600", "blue.300"), transform: "translateX(2px)" }} 
                        cursor="pointer"
                        transition="all 0.2s ease"
                        fontSize="sm"
                        fontWeight="medium"
                      >
                        About Us
                      </Text>
                    </NextLink>
                  </Box>
                  
                  <Box>
                    <NextLink href="/resources">
                      <Text 
                        _hover={{ color: useColorModeValue("blue.600", "blue.300"), transform: "translateX(2px)" }} 
                        cursor="pointer"
                        transition="all 0.2s ease"
                        fontSize="sm"
                        fontWeight="medium"
                      >
                        Resources
                      </Text>
                    </NextLink>
                  </Box>
                  
                  <Box>
                    <NextLink href="https://github.com/AvarchLLC/EIPsInsight/issues">
                      <Text 
                        _hover={{ color: useColorModeValue("blue.600", "blue.300"), transform: "translateX(2px)" }} 
                        cursor="pointer"
                        transition="all 0.2s ease"
                        fontSize="sm"
                        fontWeight="medium"
                        lineHeight="1.3"
                      >
                        Found a bug?
                      </Text>
                    </NextLink>
                  </Box>
                  
                  <Box>
                    <NextLink href="/donate">
                      <Text
                        _hover={{ color: useColorModeValue("blue.600", "blue.300"), transform: "translateX(2px)" }}
                        cursor="pointer"
                        transition="all 0.2s ease"
                        fontSize="sm"
                        fontWeight="medium"
                      >
                        Donate
                      </Text>
                    </NextLink>
                  </Box>
                  
                  <Box>
                    <NextLink href="/Feedback" target="_blank">
                      <Text 
                        _hover={{ color: useColorModeValue("blue.600", "blue.300"), transform: "translateX(2px)" }} 
                        cursor="pointer"
                        transition="all 0.2s ease"
                        fontSize="sm"
                        fontWeight="medium"
                      >
                        Feedback
                      </Text>
                    </NextLink>
                  </Box>
                </SimpleGrid>
              </Stack>
            </Box>

            {/* Follow Us Section */}
            <Box>
              <Stack spacing={4}>
                <Text fontSize="xl" fontWeight="bold">Follow Us</Text>

                <SimpleGrid columns={2} spacing={4}>
                  <NextLink href="https://twitter.com/TeamAvarch" target="_blank">
                    <Flex align="center" gap={2} _hover={{ transform: "translateX(2px)" }} transition="transform 0.2s" cursor="pointer">
                      <BsTwitter size={18} />
                      <Text fontSize="sm">Twitter</Text>
                    </Flex>
                  </NextLink>
                  
                  <NextLink href="https://www.youtube.com/channel/UCnceAY-vAQsO8TgGAj5SGFA" target="_blank">
                    <Flex align="center" gap={2} _hover={{ transform: "translateX(2px)" }} transition="transform 0.2s" cursor="pointer">
                      <BsYoutube size={18} />
                      <Text fontSize="sm">YouTube</Text>
                    </Flex>
                  </NextLink>
                  
                  <NextLink href="https://www.linkedin.com/company/avarch-llc/" target="_blank">
                    <Flex align="center" gap={2} _hover={{ transform: "translateX(2px)" }} transition="transform 0.2s" cursor="pointer">
                      <BsLinkedin size={18} />
                      <Text fontSize="sm">LinkedIn</Text>
                    </Flex>
                  </NextLink>
                  
                  <NextLink href="https://etherworld.co/tag/eipsinsight/" target="_blank">
                    <Flex align="center" gap={2} _hover={{ transform: "translateX(2px)" }} transition="transform 0.2s" cursor="pointer">
                      <BsNewspaper size={18} />
                      <Text fontSize="sm">EtherWorld</Text>
                    </Flex>
                  </NextLink>
                </SimpleGrid>

                <NextLink href="https://buy.stripe.com/test_7sI7sXdHu9SL8JG001" target="_blank">
                  <Button 
                    variant="outline" 
                    colorScheme="blue" 
                    size="sm"
                    w="full"
                    mt={4}
                    _hover={{ 
                      bg: useColorModeValue("blue.50", "blue.900"),
                      transform: "translateY(-1px)" 
                    }}
                    transition="all 0.2s ease"
                  >
                    Support Us
                  </Button>
                </NextLink>
              </Stack>
            </Box>
          </SimpleGrid>
        </Container>
      </Box>
    </>
  );
}

function getMonth(monthName: any) {
  switch (monthName) {
    case "January":
      return 1;
    case "February":
      return 2;
    case "March":
      return 3;
    case 'April':
      return 4;
    case 'May':
      return 5;
    case 'June':
      return 6;
    case 'July':
      return 7;
    case 'August':
      return 8;
    case 'September':
      return 9;
    case 'October':
      return 10;
    case 'November':
      return 11;
    case 'December':
      return 12;
    default:
      return '1';

  }
}
