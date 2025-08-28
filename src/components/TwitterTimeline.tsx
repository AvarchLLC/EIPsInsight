'use client';

import React, { useEffect } from 'react';
import { 
  Box, 
  useColorModeValue, 
  Grid, 
  VStack, 
  Link, 
  Text, 
  Flex,
  Icon,
  Badge,
  Heading,
  Container,
  HStack,
  IconButton,
  useToast
} from '@chakra-ui/react';
import { FaTwitter, FaLinkedin, FaGlobe, FaExternalLinkAlt } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { CopyIcon } from '@chakra-ui/icons';
import Header from './Header';
import NextLink from 'next/link';

const TwitterTimeline: React.FC = () => {
  const scrollbarBg = useColorModeValue('gray.100', 'gray.700');
  const scrollbarColor = useColorModeValue('gray.300', 'gray.500');
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const headingColor = useColorModeValue('gray.800', 'white');
  const toast = useToast();

  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url).then(() => {
      toast({
        title: "Link copied!",
        description: "Link has been copied to clipboard",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    }).catch(() => {
      toast({
        title: "Copy failed",
        description: "Failed to copy link to clipboard",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    });
  };

  const socialLinks = [
    {
      name: 'EIPsInsight',
      platform: 'LinkedIn',
      url: 'https://www.linkedin.com/company/eipsinsight',
      color: '#0077B5',
      icon: FaLinkedin,
      description: 'Professional network'
    },
    {
      name: 'EtherWorld',
      platform: 'LinkedIn', 
      url: 'https://www.linkedin.com/company/etherworld',
      color: '#0077B5',
      icon: FaLinkedin,
      description: 'Company updates'
    },
    {
      name: 'EtherWorld',
      platform: 'X (Twitter)',
      url: 'https://x.com/ether_world',
      color: '#000000',
      icon: FaXTwitter,
      description: 'Latest tweets'
    },
    {
      name: 'EtherWorld',
      platform: 'Website',
      url: 'https://etherworld.co/',
      color: '#4A90E2',
      icon: FaGlobe,
      description: 'Official website'
    },
    {
      name: 'BlockAction',
      platform: 'X (Twitter)',
      url: 'https://x.com/blockaction_io', 
      color: '#000000',
      icon: FaXTwitter,
      description: 'Blockchain insights'
    }
  ];

  useEffect(() => {
    // Load Twitter widget script
    const script = document.createElement('script');
    script.src = 'https://platform.twitter.com/widgets.js';
    script.async = true;
    script.charset = 'utf-8';
    document.body.appendChild(script);

    return () => {
      // Cleanup script if component unmounts
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return (
    <Container maxW="100vw" px={0} pt={6}>
      <VStack spacing={8} align="stretch" w="100%">
        {/* Standard Header with Link */}
        <Header
          title="Latest Updates"
          subtitle="Stay Connected"
          description="Stay connected with our latest insights on EIPs, ERCs and Ethereum development"
          sectionId="latest-updates"
        />

        {/* Enhanced Two-column layout */}
        <Grid
          templateColumns={{ base: "1fr", lg: "2fr 1fr" }}
          gap={{ base: 8, lg: 12 }}
          alignItems="start"
          w="100%"
        >
          {/* Left Column: Twitter Timeline */}
          <Box>
            <Flex align="center" mb={6}>
              <Icon as={FaXTwitter} color="gray.600" mr={3} />
              <Heading size="md" color={headingColor} textAlign="left">
                Latest Tweets
              </Heading>
              <Badge ml={2} colorScheme="blue" variant="subtle">
                Live Feed
              </Badge>
            </Flex>
            
            {/* Enhanced scrollable container */}
            <Box
              bg={cardBg}
              borderRadius="xl"
              border="1px solid"
              borderColor={borderColor}
              shadow="lg"
              overflow="hidden"
            >
              <Box
                maxH="700px"
                overflowY="auto"
                p={6}
                display="flex"
                flexDirection="column"
                alignItems="center"
                css={{
                  '&::-webkit-scrollbar': {
                    width: '8px',
                  },
                  '&::-webkit-scrollbar-track': {
                    background: useColorModeValue('rgba(0,0,0,0.05)', 'rgba(255,255,255,0.05)'),
                    borderRadius: '4px',
                  },
                  '&::-webkit-scrollbar-thumb': {
                    background: scrollbarColor,
                    borderRadius: '4px',
                    '&:hover': {
                      background: useColorModeValue('gray.400', 'gray.400'),
                    }
                  },
                }}
              >
        {/* Tweet 1: EIP-7702 Programmable EOAs */}
        <Box mb={6} position="relative" width="100%" maxW="550px">
          <blockquote 
            className="twitter-tweet" 
            data-theme={useColorModeValue('light', 'dark')}
            style={{ margin: '0 auto' }}
          >
            <p lang="en" dir="ltr">
              EIP‑7702: Programmable EOAs<br /><br />
              It lets a regular EOA temporarily act like a smart account via a special transaction, so the same address can batch actions, use sponsored gas, and apply scoped permissions without migrating wallets.
              <a href="https://t.co/V5ME7RgfP1">https://t.co/V5ME7RgfP1</a><br /><br />
              Unlocks: batch actions… 
              <a href="https://t.co/7un7ejdCKq">pic.twitter.com/7un7ejdCKq</a>
            </p>
            &mdash; EIPsInsight (@TeamAvarch) 
            <a href="https://twitter.com/TeamAvarch/status/1961136200544391362?ref_src=twsrc%5Etfw">
              August 28, 2025
            </a>
          </blockquote>
        </Box>

        {/* Tweet 2: EIP-7702 UX Features */}
        <Box mb={6} position="relative" width="100%" maxW="550px">
          <blockquote 
            className="twitter-tweet" 
            data-theme={useColorModeValue('light', 'dark')}
            style={{ margin: '0 auto' }}
          >
            <p lang="en" dir="ltr">
              After recent incidents, should EIP-7702 UX features ship sooner or wait for more hardening?
            </p>
            &mdash; EIPsInsight (@TeamAvarch) 
            <a href="https://twitter.com/TeamAvarch/status/1960763160333529494?ref_src=twsrc%5Etfw">
              August 27, 2025
            </a>
          </blockquote>
        </Box>

        {/* Tweet 3: This Week's EIP/ERC Activity (Aug 26) */}
        <Box mb={6} position="relative" width="100%" maxW="550px">
          <blockquote 
            className="twitter-tweet" 
            data-theme={useColorModeValue('light', 'dark')}
            style={{ margin: '0 auto' }}
          >
            <p lang="en" dir="ltr">
              This Week's EIP/ERC Activity (Aug 19, 2025) <br /><br />
              Last Call:<br />
              ☞ EIP-7786: Cross-Chain Messaging Gateway<br />
              Last Call Deadline: 2025-08-19
              <a href="https://t.co/3QGiTeW4BH">https://t.co/3QGiTeW4BH</a><br />
              ☞ EIP-7858: Expirable NFTs and SBTs<br />
              Last Call Deadline: 2025-08-31
              <a href="https://t.co/ht3SEOuLky">https://t.co/ht3SEOuLky</a><br /><br />
              Drafts:<br />
              ☞ EIP-7997:… 
              <a href="https://t.co/5N1BkfU3O2">pic.twitter.com/5N1BkfU3O2</a>
            </p>
            &mdash; EIPsInsight (@TeamAvarch) 
            <a href="https://twitter.com/TeamAvarch/status/1960340209725235302?ref_src=twsrc%5Etfw">
              August 26, 2025
            </a>
          </blockquote>
        </Box>

        {/* Tweet 4: Nody Observability */}
        <Box mb={6} position="relative" width="100%" maxW="550px">
          <blockquote 
            className="twitter-tweet" 
            data-theme={useColorModeValue('light', 'dark')}
            style={{ margin: '0 auto' }}
          >
            <p lang="en" dir="ltr">
              Blame is easy. Observability is better. Nody picks the right button. 
              <a href="https://twitter.com/hashtag/EIPsInsight?src=hash&amp;ref_src=twsrc%5Etfw">#EIPsInsight</a> 
              <a href="https://twitter.com/hashtag/Monitoring?src=hash&amp;ref_src=twsrc%5Etfw">#Monitoring</a> 
              <a href="https://twitter.com/hashtag/Web3?src=hash&amp;ref_src=twsrc%5Etfw">#Web3</a> 
              <a href="https://t.co/8XAxhnznN7">pic.twitter.com/8XAxhnznN7</a>
            </p>
            &mdash; EIPsInsight (@TeamAvarch) 
            <a href="https://twitter.com/TeamAvarch/status/1958753245855457626?ref_src=twsrc%5Etfw">
              August 22, 2025
            </a>
          </blockquote>
        </Box>

        {/* Tweet 5: EIP-7934 RLP Execution Block Size Limit */}
        <Box mb={6} position="relative" width="100%" maxW="550px">
          <blockquote 
            className="twitter-tweet" 
            data-theme={useColorModeValue('light', 'dark')}
            style={{ margin: '0 auto' }}
          >
            <p lang="en" dir="ltr">
              🚧 EIP‑7934 (Fusaka): RLP Execution Block Size Limit<br /><br />
              As Ethereum raises capacity, 7934 adds a byte‑size ceiling for the whole block (with margin) so bigger blocks still propagate fast and stay DoS‑resistant.<br />
              It's the guardrail that complements EIP‑7935's higher gas limit and… 
              <a href="https://t.co/dz49AK7pnN">pic.twitter.com/dz49AK7pnN</a>
            </p>
            &mdash; EIPsInsight (@TeamAvarch) 
            <a href="https://twitter.com/TeamAvarch/status/1958553227118686225?ref_src=twsrc%5Etfw">
              August 21, 2025
            </a>
          </blockquote>
        </Box>
              </Box>
            </Box>
          </Box>
        
        {/* Right Column: Enhanced Social Media Cards */}
        <Box>
          <Flex align="center" mb={6}>
            <Icon as={FaGlobe} color="gray.600" mr={3} />
            <Heading size="md" color={headingColor} textAlign="left">
              Connect With Us
            </Heading>
            <Badge ml={2} colorScheme="green" variant="subtle">
              Social
            </Badge>
          </Flex>
          
          <VStack spacing={4} align="stretch">
            {socialLinks.map((social, index) => (
              <Box key={index}>
                <Link
                  href={social.url}
                  isExternal
                  textDecoration="none"
                  _hover={{ textDecoration: 'none' }}
                >
                  <Box
                    p={5}
                    bg={cardBg}
                    border="2px solid"
                    borderColor={borderColor}
                    borderRadius="xl"
                    shadow="md"
                    _hover={{ 
                      shadow: 'xl', 
                      borderColor: social.color,
                      bg: useColorModeValue('gray.50', 'gray.750')
                    }}
                    transition="all 0.3s ease"
                    position="relative"
                    overflow="hidden"
                  >
                    {/* Background gradient accent */}
                    <Box
                      position="absolute"
                      top="0"
                      right="0"
                      w="60px"
                      h="60px"
                      bg={`linear-gradient(135deg, ${social.color}20, transparent)`}
                      borderRadius="0 0 0 60px"
                    />
                    
                    <Flex justify="space-between" align="center">
                      <Box flex="1">
                        <HStack spacing={3} mb={2}>
                          <Icon 
                            as={social.icon} 
                            color={social.color} 
                            fontSize="xl"
                          />
                          <Box>
                            <Text 
                              fontSize="md" 
                              fontWeight="bold" 
                              color={headingColor}
                              lineHeight="1.2"
                              textAlign="left"
                            >
                              {social.name}
                            </Text>
                            <Text 
                              fontSize="sm" 
                              color={textColor}
                              fontWeight="medium"
                              textAlign="left"
                            >
                              {social.platform}
                            </Text>
                          </Box>
                        </HStack>
                        <Text 
                          fontSize="xs" 
                          color={textColor}
                          fontStyle="italic"
                          textAlign="left"
                        >
                          {social.description}
                        </Text>
                      </Box>
                      <VStack spacing={2}>
                        <IconButton
                          size="sm"
                          colorScheme="teal"
                          aria-label="Copy link"
                          icon={<CopyIcon />}
                          onClick={(e) => {
                            e.preventDefault();
                            handleCopyLink(social.url);
                          }}
                        />
                        <Icon 
                          as={FaExternalLinkAlt} 
                          color={textColor} 
                          fontSize="sm"
                          opacity={0.6}
                        />
                      </VStack>
                    </Flex>
                  </Box>
                </Link>
              </Box>
            ))}
          </VStack>
          
          {/* Additional call-to-action */}
          <Box
            mt={6}
            p={4}
            bg={useColorModeValue('blue.50', 'blue.900')}
            borderRadius="lg"
            border="1px solid"
            borderColor={useColorModeValue('blue.200', 'blue.700')}
            textAlign="left"
          >
            <Text fontSize="sm" color={textColor} mb={2} textAlign="left">
              📢 Stay updated with the latest in Ethereum development
            </Text>
            <Text fontSize="xs" color={textColor} opacity={0.8} textAlign="left">
              Follow us for EIP updates, technical insights, and community news
            </Text>
          </Box>
        </Box>
        </Grid>
      </VStack>
    </Container>
  );
};

export default TwitterTimeline;
