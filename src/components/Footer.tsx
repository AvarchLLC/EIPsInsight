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
} from "@chakra-ui/react";
import { FaTwitter, FaYoutube, FaInstagram } from "react-icons/fa";
import NextLink from "next/link";

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
  return (
    <Box
      bg={useColorModeValue("gray.50", "gray.900")}
      color={useColorModeValue("gray.700", "gray.200")}
    >
      <Box
        borderTopWidth={1}
        borderStyle={"solid"}
        borderColor={useColorModeValue("gray.200", "gray.700")}
      >
        <Container
          as={Stack}
          maxW={"6xl"}
          py={4}
          direction={'row'}
          spacing={4}
          justify={{ base: "space-between" }}
          align={{ md: "center" }}
        >
          <Text paddingTop={{base:"1",md:"0"}}>
            Build With <span> 💙 </span> by&nbsp; <NextLink href={'https://avarch.org/index.html#0'} target={'_blank'}>Avarch</NextLink>
          </Text>
          <Stack direction={"row"} spacing={6}>
            <SocialButton label={"Twitter"} href={"https://twitter.com/ether_world"} >
              <FaTwitter />
            </SocialButton>
            <SocialButton label={"YouTube"} href={"https://www.youtube.com/channel/UCnceAY-vAQsO8TgGAj5SGFA"}>
              <FaYoutube />
            </SocialButton>
            <SocialButton label={"Instagram"} href={"https://www.instagram.com/etherworld.co/?hl=en"}>
              <FaInstagram />
            </SocialButton>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}
