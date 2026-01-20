import React from "react";
import { Box, Heading, Text, Button, Stack, useColorModeValue, useColorMode } from "@chakra-ui/react";

type Props = {
  title?: string;
  subtitle?: string;
  ctaHref?: string;
  ctaLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
};

export default function PlaceYourAdCard({
  title = "Want to advertise your project on EIPs Insight?",
  subtitle = "Reach Ethereum developers, researchers, and EIP authors. Place your ad on EIPs Insight and connect with the community.",
  ctaHref =
    "mailto:team@avarch.org?cc=ayush.avarch@gmail.com&subject=Advertising%20Inquiry%20-%20EIPs%20Insight%20-%20Ad%20Placement&body=Hello%20EIPs%20Insight%20Team,%0D%0A%0D%0AWe%20would%20like%20to%20place%20an%20advertisement%20on%20EIPs%20Insight.%0D%0A%0D%0AProject%20Name:%20%0D%0AWebsite:%20%0D%0ATarget%20Audience:%20%0D%0ACampaign%20Goals:%20%0D%0ABudget/Flight:%20%0D%0ATimeline:%20%0D%0APreferred%20Placement(s):%20[Analytics%20page,%20Homepage,%20Newsletter]%0D%0ACreatives%20Available:%20[Banner%20/%20Native%20/%20CTA]%0D%0A%0D%0APlease%20share%20available%20inventory,%20rates,%20and%20next%20steps.%0D%0A%0D%0ARegards,%0D%0A[Your%20Name]%0D%0A[Company]%0D%0A[Email]%0D%0A[Phone]",
  ctaLabel = "Place your ad",
  secondaryHref =
    "mailto:team@avarch.org?cc=ayush.avarch@gmail.com&subject=Media%20Kit%20Request%20-%20EIPs%20Insight&body=Hello%20Team,%0D%0A%0D%0APlease%20share%20your%20latest%20media%20kit%20and%20rate%20card%20for%20EIPs%20Insight.%0D%0A%0D%0ACompany:%20%0D%0AWebsite:%20%0D%0ACampaign%20Timeline:%20%0D%0A%0D%0ARegards,%0D%0A[Your%20Name]%0D%0A[Email]%0D%0A[Phone]",
  secondaryLabel = "Request media kit",
}: Props) {
  const cardBg = useColorModeValue("white", "gray.900");
  const border = useColorModeValue("gray.200", "gray.700");
  const accent = "#0ea5a4";

  const { colorMode } = useColorMode();

  // If dark theme is active, render a toned-down dark variant and skip the
  // bright, animated light card. This keeps the existing design exclusively
  // for light mode as requested.
  if (colorMode === "dark") {
    return (
      <Box
        position="relative"
        overflow="hidden"
        bg="linear-gradient(135deg, #020617 0%, #022c22 45%, #0f172a 100%)"
        border="1px solid"
        borderColor="gray.700"
        borderRadius="xl"
        px={{ base: 4, md: 6 }}
        py={{ base: 4, md: 6 }}
        transition="all 0.2s ease"
        boxShadow="0 18px 45px rgba(0,0,0,0.55)"
        _hover={{ transform: "translateY(-3px)", boxShadow: "0 22px 55px rgba(15,118,110,0.35)" }}
      >
        <Stack spacing={4} align="center" textAlign="center" position="relative" zIndex={1}>
          <Box position="relative">
            <Heading
              size={{ base: "sm", md: "md", lg: "lg" }}
              color="teal.200"
              fontWeight="extrabold"
              letterSpacing="wide"
            >
              📣 {title}
            </Heading>
          </Box>
          <Text
            fontSize={{ base: "sm", md: "md" }}
            color="gray.200"
            fontWeight="medium"
            maxW="600px"
          >
            {subtitle}
          </Text>
          <Stack direction={{ base: "column", sm: "row" }} spacing={3} pt={1}>
            <Button
              as="a"
              href={ctaHref}
              size="md"
              target="_blank"
              rel="noopener noreferrer"
              bg="linear-gradient(135deg,#0ea5e9,#0ea5a4)"
              color="white"
              fontWeight="bold"
              borderRadius="lg"
              boxShadow="0 8px 24px rgba(8,145,178,0.45)"
              _hover={{
                transform: "translateY(-1px)",
                boxShadow: "0 10px 30px rgba(8,145,178,0.6)",
              }}
              transition="all 0.2s ease"
            >
              🚀 {ctaLabel}
            </Button>
            <Button
              as="a"
              href={secondaryHref}
              variant="outline"
              size="md"
              target="_blank"
              rel="noopener noreferrer"
              borderWidth="1px"
              borderColor="gray.600"
              color="gray.200"
              fontWeight="semibold"
              borderRadius="lg"
              boxShadow="0 0 0 1px rgba(15,23,42,0.8)"
              _hover={{
                borderColor: "teal.300",
                color: "teal.200",
                boxShadow: "0 0 0 1px rgba(45,212,191,0.8)",
              }}
              transition="all 0.2s ease"
            >
              📋 {secondaryLabel}
            </Button>
          </Stack>
        </Stack>
      </Box>
    );
  }

  return (
    <Box
      position="relative"
      overflow="hidden"
      bg={cardBg}
      border="1px solid"
      borderColor={border}
      borderRadius="2xl"
      px={{ base: 4, md: 6 }}
      py={{ base: 4, md: 6 }}
      transition="all 0.25s ease"
      boxShadow={useColorModeValue(
        "0 14px 35px rgba(15,23,42,0.12)",
        "0 18px 45px rgba(0,0,0,0.55)"
      )}
      _hover={{
        transform: "translateY(-2px)",
        boxShadow: useColorModeValue(
          "0 18px 45px rgba(8,47,73,0.35)",
          "0 22px 55px rgba(15,118,110,0.4)"
        ),
      }}
    >
      <Stack spacing={4} align="center" textAlign="center" position="relative" zIndex={1}>
        <Box position="relative">
          <Heading 
            size={{ base: "sm", md: "md", lg: "lg" }} 
            color={accent}
            fontWeight="extrabold"
            letterSpacing="wide"
            lineHeight="1.3"
            wordBreak="break-word"
          >
            📣 {title}
          </Heading>
        </Box>
        <Text 
          fontSize={{ base: "sm", md: "md" }} 
          color={useColorModeValue("gray.700", "gray.300")}
          fontWeight="medium"
          lineHeight="1.4"
          maxW="600px"
        > 
          {subtitle}
        </Text>
        <Stack direction={{ base: "column", sm: "row" }} spacing={3} pt={2}>
          <Button 
            as="a" 
            href={ctaHref} 
            size="md"
            target="_blank" 
            rel="noopener noreferrer"
            bg="linear-gradient(45deg, #FF6B6B, #4ECDC4, #45B7D1)"
            backgroundSize="200% 200%"
            color="white"
            fontWeight="bold"
            borderRadius="lg"
            boxShadow="0 4px 15px rgba(0, 206, 209, 0.3)"
            _hover={{
              transform: "translateY(-2px)",
              boxShadow: "0 6px 20px rgba(0, 206, 209, 0.4)",
            }}
            transition="all 0.2s ease"
          >
            🚀 {ctaLabel}
          </Button>
          <Button 
            as="a" 
            href={secondaryHref} 
            variant="outline" 
            size="md"
            target="_blank" 
            rel="noopener noreferrer"
            borderWidth="2px"
            borderColor={accent}
            color={accent}
            fontWeight="bold"
            borderRadius="lg"
            boxShadow="0 0 10px rgba(0, 206, 209, 0.2)"
            _hover={{
              transform: "translateY(-2px)",
              borderColor: "#FF6B6B",
              color: "#FF6B6B",
              boxShadow: "0 4px 15px rgba(255, 107, 107, 0.3)",
            }}
            transition="all 0.2s ease"
          >
            📋 {secondaryLabel}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
