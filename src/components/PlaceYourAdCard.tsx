import React from "react";
import { Box, Heading, Text, Button, Stack, useColorModeValue } from "@chakra-ui/react";

type Props = {
  title?: string;
  subtitle?: string;
  ctaHref?: string;
  ctaLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
};

export default function PlaceYourAdCard({
  title = "Are you a blockchain project implementing an EIP?",
  subtitle = "Reach Ethereum developers, researchers, and EIP authors. Place your ad with EIPs Insight.",
  ctaHref =
    "mailto:team@avarch.org?cc=ayush.avarch@gmail.com&subject=Advertising%20Inquiry%20-%20EIPs%20Insight%20-%20EIP%20Implementation%20Campaign&body=Hello%20EIPs%20Insight%20Team,%0D%0A%0D%0AWe%20would%20like%20to%20place%20an%20advertisement%20for%20our%20blockchain%20project%20implementing%20the%20following%20EIP(s):%20[EIP%20numbers/titles].%0D%0A%0D%0AProject%20Name:%20%0D%0AWebsite:%20%0D%0AEIP(s):%20%0D%0ATarget%20Audience:%20%0D%0ACampaign%20Goals:%20%0D%0ABudget/Flight:%20%0D%0ATimeline:%20%0D%0APreferred%20Placement(s):%20[Upgrade%20page,%20Homepage,%20Newsletter]%0D%0ACreatives%20Available:%20[Banner%20/%20Native%20/%20CTA]%0D%0A%0D%0APlease%20share%20available%20inventory,%20rates,%20and%20next%20steps.%0D%0A%0D%0ARegards,%0D%0A[Your%20Name]%0D%0A[Company]%0D%0A[Email]%0D%0A[Phone]",
  ctaLabel = "Place your ad",
  secondaryHref =
    "mailto:team@avarch.org?cc=ayush.avarch@gmail.com&subject=Media%20Kit%20Request%20-%20EIPs%20Insight&body=Hello%20Team,%0D%0A%0D%0APlease%20share%20your%20latest%20media%20kit%20and%20rate%20card%20for%20EIPs%20Insight.%0D%0A%0D%0ACompany:%20%0D%0AWebsite:%20%0D%0ACampaign%20Timeline:%20%0D%0A%0D%0ARegards,%0D%0A[Your%20Name]%0D%0A[Email]%0D%0A[Phone]",
  secondaryLabel = "Request media kit",
}: Props) {
  const cardBg = useColorModeValue("white", "gray.800");
  const border = useColorModeValue("gray.200", "gray.700");
  const accent = "#00CED1";

  return (
    <Box
      bg={cardBg}
      border="1px solid"
      borderColor={border}
      borderRadius="xl"
      boxShadow="sm"
      px={{ base: 4, md: 6 }}
      py={{ base: 5, md: 6 }}
      transition="background-color .15s ease, border-color .15s ease"
    >
      <Stack spacing={3} align={{ base: "flex-start", md: "center" }} textAlign={{ base: "left", md: "center" }}>
        <Heading size={{ base: "md", md: "lg" }} color={accent}>
          {title}
        </Heading>
        <Text fontSize={{ base: "sm", md: "md" }} color={useColorModeValue("gray.700", "gray.300")}> 
          {subtitle}
        </Text>
        <Stack direction={{ base: "column", sm: "row" }} spacing={3} pt={1}>
          <Button as="a" href={ctaHref} colorScheme="teal" variant="solid" size="sm" target="_blank" rel="noopener noreferrer">
            {ctaLabel}
          </Button>
          <Button as="a" href={secondaryHref} variant="outline" size="sm" target="_blank" rel="noopener noreferrer">
            {secondaryLabel}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
