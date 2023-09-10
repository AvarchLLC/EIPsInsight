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
} from "@chakra-ui/react";
import { FaTwitter, FaYoutube, FaInstagram } from "react-icons/fa";
import NextLink from "next/link";
import {BsGithub,BsDiscord, BsTwitter, BsInstagram, BsYoutube, BsLinkedin, BsNewspaper} from 'react-icons/bs'

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
    // <Box
    //   bg={useColorModeValue("gray.50", "gray.900")}
    //   color={useColorModeValue("gray.700", "gray.200")}
    // >
    //   <Box
    //     borderTopWidth={1}
    //     borderStyle={"solid"}
    //     borderColor={useColorModeValue("gray.200", "gray.700")}
    //   >
    //     <Container
    //       as={Stack}
    //       maxW={"6xl"}
    //       py={4}
    //       direction={'row'}
    //       spacing={4}
    //       justify={{ base: "space-between" }}
    //       align={{ md: "center" }}
    //     >
    //       <Text paddingTop={{base:"1",md:"0"}}>
    //         Build With <span> 💙 </span> by&nbsp; <NextLink href={'https://avarch.org/index.html#0'} target={'_blank'}>Avarch</NextLink>
    //       </Text>
    //       <Stack direction={"row"} spacing={6}>
    //         <SocialButton label={"Twitter"} href={"https://twitter.com/ether_world"} >
    //           <FaTwitter />
    //         </SocialButton>
    //         <SocialButton label={"YouTube"} href={"https://www.youtube.com/channel/UCnceAY-vAQsO8TgGAj5SGFA"}>
    //           <FaYoutube />
    //         </SocialButton>
    //         <SocialButton label={"Instagram"} href={"https://www.instagram.com/etherworld.co/?hl=en"}>
    //           <FaInstagram />
    //         </SocialButton>
    //       </Stack>
    //     </Container>
    //   </Box>
    // </Box>



      <>
        <Box
          bg={useColorModeValue("gray.50", "gray.900")}
          color={useColorModeValue("gray.700", "gray.200")}
          paddingX={14}
          paddingY={8}
        >
          <div className={'lg:flex md:flex block justify-evenly lg:space-x-16 md:space-x-16 space-y-5 lg:space-y-0 md:space-y-0'}>
            <Stack
                direction={"column"}
            >
              <h1 className={'font-bold text-2xl'}>EIPs Insights</h1>
              <h2 className={'text-xl'}>Build With <span> 💙 </span> by&nbsp; <NextLink href={'https://avarch.org'} target={'_blank'}>Avarch</NextLink></h2>
              <div className={'flex space-x-5'}>
                <Text className={'text-lg font-bold'}>Join us: </Text>
                <NextLink href={'https://github.com/Avarch-org/EIPUI'} target={'_blank'}><BsGithub  size={25} className={'hover:scale-125 duration-200'}/></NextLink>
                <NextLink href={'https://discord.gg/tUXgfV822C'} target={'_blank'}><BsDiscord size={25} className={'hover:scale-125 duration-200'}/></NextLink>
              </div>
            </Stack>

            <Stack
                direction={"column"}
            >
              <p className={'text-xl underline underline-offset-4 font-bold'}>Links</p>
              <NextLink href={'/all'}>All</NextLink>
              <NextLink href={'/type'}>Type</NextLink>
              <NextLink href={'/status'}>Status</NextLink>
              <NextLink href={`/insight/${year}/${getMonth(monthName)}`}>{monthName} {year} Insights</NextLink>
              <NextLink href={'/resources'}>Resources</NextLink>
            </Stack>

            <Stack
                direction={'column'}
                className={'space-y-5'}
            >
              <Text className={'text-xl font-bold'}>Follow Us</Text>

              <div className={'flex space-x-10'}>
                <NextLink href={'https://twitter.com/ether_world'} target={'_blank'}><BsTwitter size={25} className={'hover:scale-125 duration-200'}/></NextLink>
                <NextLink href={'https://www.instagram.com/etherworld.co/?hl=en'} target={'_blank'}><BsInstagram size={25} className={'hover:scale-125 duration-200'}/></NextLink>
                <NextLink href={'https://www.youtube.com/channel/UCnceAY-vAQsO8TgGAj5SGFA'} target={'_blank'}><BsYoutube size={25} className={'hover:scale-125 duration-200'}/></NextLink>
                <NextLink href={'https://www.linkedin.com/company/avarch-llc/'} target={'_blank'}><BsLinkedin size={25} className={'hover:scale-125 duration-200'}/></NextLink>
                <NextLink href={'https://etherworld.co'} target={'_blank'}><BsNewspaper size={25} className={'hover:scale-125 duration-200'}/></NextLink>
              </div>

              <NextLink href={'https://builder.gitcoin.co/#/chains/1/registry/0x03506eD3f57892C85DB20C36846e9c808aFe9ef4/projects/738'} target={'_blank'}>
                <Box className={'justify-center flex w-full'}>
                  <Button variant={"outline"} colorScheme={'blue'}>
                    Support Us
                  </Button>
                </Box>
              </NextLink>
            </Stack>
          </div>

          <div className={'w-full flex justify-end'}>
            <Text className={'text-gray-500'}>v2.0.0</Text>
          </div>
        </Box>
      </>
  );
}

function getMonth(monthName:any){
  switch(monthName){
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
