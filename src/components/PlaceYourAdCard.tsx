import React from "react";
import { Box, Heading, Text, Button, Stack, useColorModeValue } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";

// Moderately flashy animations
const borderShift = keyframes`
  0% { border-color: #00CED1; }
  33% { border-color: #FF6B6B; }
  66% { border-color: #4ECDC4; }
  100% { border-color: #00CED1; }
`;

const shimmer = keyframes`
  0% { background-position: -200% center; opacity: 0; }
  50% { opacity: 0.4; }
  100% { background-position: 200% center; opacity: 0; }
`;

const pulse = keyframes`
  0%, 100% { 
    box-shadow: 0 0 0 0 rgba(0, 206, 209, 0.4);
    transform: scale(1);
  }
  50% { 
    box-shadow: 0 0 0 8px rgba(0, 206, 209, 0);
    transform: scale(1.02);
  }
`;

const glow = keyframes`
  0%, 100% { 
    box-shadow: 0 0 10px rgba(0, 206, 209, 0.3);
  }
  50% { 
    box-shadow: 0 0 20px rgba(0, 206, 209, 0.6), 0 0 30px rgba(255, 107, 107, 0.3);
  }
`;

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
  const cardBg = useColorModeValue("white", "gray.800");
  const border = useColorModeValue("gray.200", "gray.700");
  const accent = "#00CED1";

  return (
    <Box
      position="relative"
      overflow="hidden"
      bg={cardBg}
      border="3px solid"
      borderColor={accent}
      borderRadius="xl"
      px={{ base: 4, md: 6 }}
      py={{ base: 4, md: 5 }}
      sx={{
        animation: `${borderShift} 3s ease-in-out infinite, ${pulse} 2.5s ease-in-out infinite, ${glow} 2s ease-in-out infinite`,
      }}
      transition="all 0.3s ease"
      _hover={{
        transform: "translateY(-5px) scale(1.02)",
        boxShadow: "0 8px 25px rgba(0, 206, 209, 0.4)",
      }}
    >

      
    
      {/* Moderate shimmer overlay */}
      <Box
        position="absolute"
        top="0"
        left="0"
        right="0"
        bottom="0"
        backgroundImage="linear-gradient(90deg, transparent, rgba(0, 206, 209, 0.2), rgba(255, 107, 107, 0.1), transparent)"
        backgroundSize="200% 100%"
        sx={{
          animation: `${shimmer} 3s infinite`,
        }}
        pointerEvents="none"
        zIndex={0}
      />
      
      <Stack spacing={3} align="center" textAlign="center" position="relative" zIndex={1}>
        <Box position="relative">
          <Heading 
            size={{ base: "sm", md: "md", lg: "lg" }} 
            color={accent}
            fontWeight="extrabold"
            textShadow="0 0 8px rgba(0, 206, 209, 0.3)"
            lineHeight="1.3"
            wordBreak="break-word"
          >
            💎 {title}
          </Heading>
        </Box>
        <Text 
          fontSize={{ base: "sm", md: "md" }} 
          color={useColorModeValue("gray.700", "gray.300")}
          fontWeight="semibold"
          textShadow="0 0 4px rgba(0, 206, 209, 0.2)"
          lineHeight="1.4"
          maxW="100%"
        > 
          ⚡ {subtitle}
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
            sx={{
              animation: `${shimmer} 2s infinite, ${glow} 2s ease-in-out infinite`,
            }}
            _hover={{
              transform: "translateY(-3px) scale(1.05)",
              boxShadow: "0 6px 20px rgba(0, 206, 209, 0.5)",
            }}
            transition="all 0.3s ease"
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
            sx={{
              animation: `${pulse} 3s ease-in-out infinite`,
            }}
            _hover={{
              transform: "translateY(-2px) scale(1.03)",
              borderColor: "#FF6B6B",
              color: "#FF6B6B",
              boxShadow: "0 4px 15px rgba(255, 107, 107, 0.3)",
            }}
            transition="all 0.3s ease"
          >
            📋 {secondaryLabel}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
