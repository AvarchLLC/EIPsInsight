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
  Divider,
  HStack
} from '@chakra-ui/react';
import { FaTwitter, FaLinkedin, FaGlobe, FaExternalLinkAlt } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import Header from './Header';

const TwitterTimeline: React.FC = () => {
  const scrollbarBg = useColorModeValue('gray.100', 'gray.700');
  const scrollbarColor = useColorModeValue('gray.300', 'gray.500');
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const headingColor = useColorModeValue('gray.800', 'white');

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
    <Container maxW="7xl" py={12}>
      <VStack spacing={8} align="stretch">
        {/* Enhanced Header */}
        <Box textAlign="center">
          <Heading
            size="xl"
            color={headingColor}
            mb={3}
            bgGradient="linear(to-r, blue.400, purple.500)"
            bgClip="text"
          >
            Latest Updates
          </Heading>
          <Text fontSize="lg" color={textColor} maxW="2xl" mx="auto">
            Stay connected with our latest insights on EIPs, ERCs, and Ethereum development
          </Text>
          <Divider mt={6} />
        </Box>

        {/* Enhanced Two-column layout */}
        <Grid 
          templateColumns={{ base: "1fr", lg: "2fr 1fr" }} 
          gap={{ base: 8, lg: 12 }}
          alignItems="start"
        >
          {/* Left Column: Twitter Timeline */}
          <Box>
            <Flex align="center" mb={6}>
              <Icon as={FaXTwitter} color="gray.600" mr={3} />
              <Heading size="md" color={headingColor}>
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
                css={{
                  '&::-webkit-scrollbar': {
                    width: '6px',
                  },
                  '&::-webkit-scrollbar-track': {
                    background: 'transparent',
                  },
                  '&::-webkit-scrollbar-thumb': {
                    background: scrollbarColor,
                    borderRadius: '3px',
                  },
                  '&::-webkit-scrollbar-thumb:hover': {
                    background: useColorModeValue('gray.400', 'gray.400'),
                  },
                }}
              >
        {/* Tweet 1: Protocol PBS */}
        <Box mb={6} position="relative">
          <blockquote 
            className="twitter-tweet" 
            data-theme={useColorModeValue('light', 'dark')}
          >
            <p lang="en" dir="ltr">
              Protocol PBS (e.g., EIP-7732 direction) should be…
            </p>
            &mdash; EIPsInsight (@TeamAvarch) 
            <a href="https://twitter.com/TeamAvarch/status/1958176494360183210?ref_src=twsrc%5Etfw">
              August 20, 2025
            </a>
          </blockquote>
        </Box>

        {/* Tweet 2: This Week's EIP/ERC Activity */}
        <Box mb={6} position="relative">
          <blockquote 
            className="twitter-tweet" 
            data-theme={useColorModeValue('light', 'dark')}
          >
            <p lang="en" dir="ltr">
              This Week's EIP/ERC Activity (Aug 19, 2025)<br /><br />
              Drafts:<br />
              ☞ EIP-7999: Unified Multidimensional Fee Market
              <a href="https://t.co/wZ3Pr2nhwy">https://t.co/wZ3Pr2nhwy</a><br />
              ☞ EIP-7979: Call and Return Opcodes for the EVM
              <a href="https://t.co/RMhowKwGu5">https://t.co/RMhowKwGu5</a><br />
              ☞ ERC-8004: Trustless Agents
              <a href="https://t.co/f4NmLMdZ4f">https://t.co/f4NmLMdZ4f</a><br />
              ☞ ERC-7955: Permissionless… 
              <a href="https://t.co/DZXwE8pyDd">pic.twitter.com/DZXwE8pyDd</a>
            </p>
            &mdash; EIPsInsight (@TeamAvarch) 
            <a href="https://twitter.com/TeamAvarch/status/1957806815523000816?ref_src=twsrc%5Etfw">
              August 19, 2025
            </a>
          </blockquote>
        </Box>

        {/* Tweet 3: Why EIP‑7951 */}
        <Box mb={6} position="relative">
          <blockquote 
            className="twitter-tweet" 
            data-theme={useColorModeValue('light', 'dark')}
          >
            <p lang="en" dir="ltr">
              Why EIP‑7951 (secp256r1 precompile) from Fusaka:<br /><br />
              EIP‑7951: adding a precompile for the secp256r1 (aka P‑256) elliptic curve. 
              It meaningfully improves interoperability with Web2 security, unlocks new wallet UX, 
              and reduces gas costs for a very common signature scheme that's… 
              <a href="https://t.co/wCjeVJzvHJ">pic.twitter.com/wCjeVJzvHJ</a>
            </p>
            &mdash; EIPsInsight (@TeamAvarch) 
            <a href="https://twitter.com/TeamAvarch/status/1957518120870113470?ref_src=twsrc%5Etfw">
              August 18, 2025
            </a>
          </blockquote>
        </Box>

        {/* Tweet 4: EIPs Insight August 2025 */}
        <Box mb={6} position="relative">
          <blockquote 
            className="twitter-tweet" 
            data-theme={useColorModeValue('light', 'dark')}
          >
            <p lang="en" dir="ltr">
              EIPs Insight (August 2025 – p1)<br /><br />
              35 PRs merged<br /><br />
              ▫️EIPs merged: 24<br />
              ▫️ERCs merged: 10<br />
              ▫️RIPs merged: 1<br /><br />
              Ethereum devs continue to push with steady throughput on standards. 
              Great momentum this August!!! 
              <a href="https://twitter.com/hashtag/EIPsInsight?src=hash&amp;ref_src=twsrc%5Etfw">#EIPsInsight</a> 
              <a href="https://twitter.com/hashtag/Ethereum?src=hash&amp;ref_src=twsrc%5Etfw">#Ethereum</a> 
              <a href="https://twitter.com/hashtag/Report?src=hash&amp;ref_src=twsrc%5Etfw">#Report</a> 
              <a href="https://twitter.com/hashtag/EIPs?src=hash&amp;ref_src=twsrc%5Etfw">#EIPs</a> 
              <a href="https://twitter.com/hashtag/ERCs?src=hash&amp;ref_src=twsrc%5Etfw">#ERCs</a> 
              <a href="https://twitter.com/hashtag/RIPs?src=hash&amp;ref_src=twsrc%5Etfw">#RIPs</a> 
              <a href="https://t.co/xQ6b9QN1GI">pic.twitter.com/xQ6b9QN1GI</a>
            </p>
            &mdash; EIPsInsight (@TeamAvarch) 
            <a href="https://twitter.com/TeamAvarch/status/1956324851784065507?ref_src=twsrc%5Etfw">
              August 15, 2025
            </a>
          </blockquote>
        </Box>

        {/* Tweet 5: EIP-7935 Gas Limit */}
        <Box mb={6} position="relative">
          <blockquote 
            className="twitter-tweet" 
            data-theme={useColorModeValue('light', 'dark')}
          >
            <p lang="en" dir="ltr">
              EIP-7935 (Fusaka): Raise Ethereum's default block gas limit so blocks fit more txs 
              and boost L1 throughput, coordinated via client defaults after testing a safe target.<br /><br />
              The image shows: current baseline 36M gas/block → testing performance → 
              devs coordinate on a higher "XX0M"… 
              <a href="https://t.co/oJ6mnK3Xsg">pic.twitter.com/oJ6mnK3Xsg</a>
            </p>
            &mdash; EIPsInsight (@TeamAvarch) 
            <a href="https://twitter.com/TeamAvarch/status/1955999141785690119?ref_src=twsrc%5Etfw">
              August 14, 2025
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
            <Heading size="md" color={headingColor}>
              Connect With Us
            </Heading>
            <Badge ml={2} colorScheme="green" variant="subtle">
              Social
            </Badge>
          </Flex>
          
          <VStack spacing={4} align="stretch">
            {socialLinks.map((social, index) => (
              <Link
                key={index}
                href={social.url}
                isExternal
                textDecoration="none"
                _hover={{ transform: 'translateY(-2px)', textDecoration: 'none' }}
                transition="all 0.3s ease"
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
                          >
                            {social.name}
                          </Text>
                          <Text 
                            fontSize="sm" 
                            color={textColor}
                            fontWeight="medium"
                          >
                            {social.platform}
                          </Text>
                        </Box>
                      </HStack>
                      <Text 
                        fontSize="xs" 
                        color={textColor}
                        fontStyle="italic"
                      >
                        {social.description}
                      </Text>
                    </Box>
                    <Icon 
                      as={FaExternalLinkAlt} 
                      color={textColor} 
                      fontSize="sm"
                      opacity={0.6}
                    />
                  </Flex>
                </Box>
              </Link>
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
            textAlign="center"
          >
            <Text fontSize="sm" color={textColor} mb={2}>
              📢 Stay updated with the latest in Ethereum development
            </Text>
            <Text fontSize="xs" color={textColor} opacity={0.8}>
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
