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
      platform: 'X (Twitter)',
      url: 'https://x.com/EIPsInsight',
      color: '#000000',
      icon: FaXTwitter,
      description: 'Latest insights'
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
      name: 'TeamAvarch',
      platform: 'X (Twitter)',
      url: 'https://x.com/TeamAvarch', 
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
            {/* Tweet: EIP-7934 Block Size Cap - Sept 22, 2025 */}
            <Box mb={6} position="relative" width="100%" maxW="550px">
              <blockquote
                className="twitter-tweet"
                data-theme={useColorModeValue('light', 'dark')}
                style={{ margin: '0 auto' }}
              >
                <p lang="en" dir="ltr">
                  EIP-7934: Why it matters<br /><br />
                  By putting a hard cap on the byte size of Ethereum blocks, EIP-7934 protects the network against oversized blocks that could slow down propagation, cause invisible forks, or open denial-of-service risks. As Ethereum raises gas limits and scales… <a href="https://t.co/IzWHbn1l1V">pic.twitter.com/IzWHbn1l1V</a>
                </p>
                &mdash; EIPsInsight (@EIPsInsight)
                <a href="https://twitter.com/EIPsInsight/status/1970181819040776675?ref_src=twsrc%5Etfw">
                  September 22, 2025
                </a>
              </blockquote>
            </Box>

            {/* Tweet: Data Clarity with Nody - Sept 19, 2025 */}
            <Box mb={6} position="relative" width="100%" maxW="550px">
              <blockquote
                className="twitter-tweet"
                data-theme={useColorModeValue('light', 'dark')}
                style={{ margin: '0 auto' }}
              >
                <p lang="en" dir="ltr">
                  The secret to stress-free reviews? Data clarity with <a href="https://t.co/mXCeU990gC">https://t.co/mXCeU990gC</a>. Chill like Nody, track every move.
                  <a href="https://twitter.com/hashtag/EIPsInsight?src=hash&amp;ref_src=twsrc%5Etfw">#EIPsInsight</a> <a href="https://twitter.com/hashtag/Ethereum?src=hash&amp;ref_src=twsrc%5Etfw">#Ethereum</a> <a href="https://twitter.com/hashtag/DevTools?src=hash&amp;ref_src=twsrc%5Etfw">#DevTools</a> <a href="https://twitter.com/hashtag/Dashboard?src=hash&amp;ref_src=twsrc%5Etfw">#Dashboard</a> <a href="https://twitter.com/hashtag/DataClarity?src=hash&amp;ref_src=twsrc%5Etfw">#DataClarity</a> <a href="https://t.co/PXXCRVqnMw">pic.twitter.com/PXXCRVqnMw</a>
                </p>
                &mdash; EIPsInsight (@EIPsInsight)
                <a href="https://twitter.com/EIPsInsight/status/1969025204090237361?ref_src=twsrc%5Etfw">
                  September 19, 2025
                </a>
              </blockquote>
            </Box>

            {/* Tweet 0: EIP‑7918 Blob Base Fee Bound - Latest */}
            <Box mb={6} position="relative" width="100%" maxW="550px">
              <blockquote
                className="twitter-tweet"
                data-theme={useColorModeValue('light', 'dark')}
                style={{ margin: '0 auto' }}
              >
                <p lang="en" dir="ltr">
                  Why EIP‑7918?: Blob Base Fee Bound (FUSAKA -SFI)<br /><br />
                  👉It sets a fair, predictable range for data “blob” fees relative to execution gas, protecting L2 rollups and regular users from fee spikes and manipulation.
                  <a href="https://t.co/PX9cnZTPxm">https://t.co/PX9cnZTPxm</a><br /><br />
                  👉It fits well after prior visual explainers… <a href="https://t.co/qHGqImCv9U">pic.twitter.com/qHGqImCv9U</a>
                </p>
                &mdash; EIPsInsight (@EIPsInsight)
                <a href="https://twitter.com/EIPsInsight/status/1968715808537985210?ref_src=twsrc%5Etfw">
                  September 18, 2025
                </a>
              </blockquote>
            </Box>

              {/* Tweet 0: Glamsterdam headliners - Latest */}
              <Box mb={6} position="relative" width="100%" maxW="550px">
                <blockquote
                  className="twitter-tweet"
                  data-theme={useColorModeValue('light', 'dark')}
                  style={{ margin: '0 auto' }}
                >
                  <p lang="en" dir="ltr">
                    Glamsterdam&apos;s confirmed headliners: which will impact Ethereum more?
                  </p>
                  &mdash; EIPsInsight (@EIPsInsight)
                  <a href="https://twitter.com/EIPsInsight/status/1968322991407935945?ref_src=twsrc%5Etfw">
                    September 17, 2025
                  </a>
                </blockquote>
              </Box>

              {/* Tweet 1: Data > Drama - Latest */}
              <Box mb={6} position="relative" width="100%" maxW="550px">
                <blockquote
                  className="twitter-tweet"
                  data-theme={useColorModeValue('light', 'dark')}
                  style={{ margin: '0 auto' }}
                >
                  <p lang="en" dir="ltr">
                    From “more repos” to “better correlations.” Exit to EIPsInsight. Data &gt; drama.
                    <a href="https://t.co/mXCeU99y6a">https://t.co/mXCeU99y6a</a>
                    <a href="https://twitter.com/hashtag/EIPsInsight?src=hash&amp;ref_src=twsrc%5Etfw">#EIPsInsight</a> 
                    <a href="https://twitter.com/hashtag/Ethereum?src=hash&amp;ref_src=twsrc%5Etfw">#Ethereum</a> 
                    <a href="https://twitter.com/hashtag/DevTools?src=hash&amp;ref_src=twsrc%5Etfw">#DevTools</a> 
                    <a href="https://twitter.com/hashtag/DataOps?src=hash&amp;ref_src=twsrc%5Etfw">#DataOps</a> 
                    <a href="https://twitter.com/hashtag/Observability?src=hash&amp;ref_src=twsrc%5Etfw">#Observability</a> 
                    <a href="https://twitter.com/hashtag/meme?src=hash&amp;ref_src=twsrc%5Etfw">#meme</a> 
                    <a href="https://t.co/2WNK3QoIty">pic.twitter.com/2WNK3QoIty</a>
                  </p>
                  &mdash; EIPsInsight (@EIPsInsight)
                  <a href="https://twitter.com/EIPsInsight/status/1966577788900856045?ref_src=twsrc%5Etfw">
                    September 12, 2025
                  </a>
                </blockquote>
              </Box>

        {/* Tweet 1: Milestone 2 completed - Latest */}
        <Box mb={6} position="relative" width="100%" maxW="550px">
          <blockquote
            className="twitter-tweet"
            data-theme={useColorModeValue('light', 'dark')}
            style={{ margin: '0 auto' }}
          >
            <p lang="en" dir="ltr">
              Milestone 2 completed!✅<br /><br />
              EIPsInsight, supported by a grant from <a href="https://twitter.com/EF_ESP?ref_src=twsrc%5Etfw">@EF_ESP</a>, now delivers:<br /><br />
              ☞ EIP Submission Trends Dashboard <br />
              ☞ Trending EIPs Module<br />
              ☞ Proposal Builder Enhancements <br />
              ☞ EIP Status Notification Bot <br /><br />
              🔗<a href="https://t.co/DeoJ5ILGQJ">https://t.co/DeoJ5ILGQJ</a><br /><br />
              Building open tools for transparent… 
              <a href="https://t.co/Huo0jzE0w8">pic.twitter.com/Huo0jzE0w8</a>
            </p>
            &mdash; EIPsInsight (@EIPsInsight)
            <a href="https://twitter.com/EIPsInsight/status/1965126348252250180?ref_src=twsrc%5Etfw">
              September 8, 2025
            </a>
          </blockquote>
        </Box>

        {/* Tweet 2: EIP-7892 Blob-Parameter-Only Hardforks */}
        <Box mb={6} position="relative" width="100%" maxW="550px">
          <blockquote
            className="twitter-tweet"
            data-theme={useColorModeValue('light', 'dark')}
            style={{ margin: '0 auto' }}
          >
            <p lang="en" dir="ltr">
              EIP‑7892: Blob‑Parameter‑Only Hardforks (Included for Fusaka)<br /><br />
              It’s timely, operationally important and pairs well with recent blob/fee topics by enabling quick, low‑risk tweaks to blob capacity without a full feature fork.<br /><br />
              Why EIP‑7892<br />
              ☞ Creates a special "parameter‑only" fork… 
              <a href="https://t.co/LXlgiBnF3F">pic.twitter.com/LXlgiBnF3F</a>
            </p>
            &mdash; EIPsInsight (@EIPsInsight)
            <a href="https://twitter.com/EIPsInsight/status/1965068884291342713?ref_src=twsrc%5Etfw">
              September 8, 2025
            </a>
          </blockquote>
        </Box>

        {/* Tweet 3: EIP-7939 Count Leading Zeros */}
        <Box mb={6} position="relative" width="100%" maxW="550px">
          <blockquote 
            className="twitter-tweet" 
            data-theme={useColorModeValue('light', 'dark')}
            style={{ margin: '0 auto' }}
          >
            <p lang="en" dir="ltr">
              EIP‑7939: Count Leading Zeros<br /><br />
              EIP‑7939 adds a tiny built‑in tool to Ethereum called CLZ that counts how many zero bits are at the start of a number when written in binary. Think of it like a quick "how big is this number?" helper.
              <a href="https://t.co/yFHJTaNsF6">https://t.co/yFHJTaNsF6</a><br /><br />
              Today, smart contracts… 
              <a href="https://t.co/R99y2F1eTR">pic.twitter.com/R99y2F1eTR</a>
            </p>
            &mdash; EIPsInsight (@EIPsInsight) 
            <a href="https://twitter.com/EIPsInsight/status/1963550043040088510?ref_src=twsrc%5Etfw">
              September 4, 2025
            </a>
          </blockquote>
        </Box>

        {/* Tweet 4: EIP-7928 Block Access List (BAL) - Glamsterdam */}
        <Box mb={6} position="relative" width="100%" maxW="550px">
          <blockquote 
            className="twitter-tweet" 
            data-theme={useColorModeValue('light', 'dark')}
            style={{ margin: '0 auto' }}
          >
            <p lang="en" dir="ltr">
              Block Access List (EIP‑7928) is being actively worked on for Glamsterdam. What's the biggest win if BAL ships? <br /><br />
              1. Lower MEV risk <br />
              2. Faster block building <br />
              3. Cheaper access checks <br />
              4. Not sure/need info
              <a href="https://twitter.com/hashtag/Glamsterdam?src=hash&amp;ref_src=twsrc%5Etfw">#Glamsterdam</a> 
              <a href="https://twitter.com/hashtag/EIP7928?src=hash&amp;ref_src=twsrc%5Etfw">#EIP7928</a> 
              <a href="https://twitter.com/hashtag/BAL?src=hash&amp;ref_src=twsrc%5Etfw">#BAL</a> 
              <a href="https://t.co/rbIYi7pEsg">pic.twitter.com/rbIYi7pEsg</a>
            </p>
            &mdash; EIPsInsight (@EIPsInsight) 
            <a href="https://twitter.com/EIPsInsight/status/1963145344453075155?ref_src=twsrc%5Etfw">
              September 3, 2025
            </a>
          </blockquote>
        </Box>

        {/* Tweet 3: EIP-7918 stabilizing blob fees for rollups */}
        <Box mb={6} position="relative" width="100%" maxW="550px">
          <blockquote 
            className="twitter-tweet" 
            data-theme={useColorModeValue('light', 'dark')}
            style={{ margin: '0 auto' }}
          >
            <p lang="en" dir="ltr">
              EIP-7918: stabilizing blob fees for rollups.<br /><br />
              By setting a fee floor tied to L1 gas, it prevents "too-cheap" blobspace, reduces volatility, and makes L2 costs more predictable.
              <a href="https://t.co/PX9cnZTPxm">https://t.co/PX9cnZTPxm</a><br /><br />
              Part of the Fusaka upgrade, it aligns blob pricing with execution demand,… 
              <a href="https://t.co/D289Hjpq2Y">pic.twitter.com/D289Hjpq2Y</a>
            </p>
            &mdash; EIPsInsight (@TeamAvarch) 
            <a href="https://twitter.com/TeamAvarch/status/1962569184459792435?ref_src=twsrc%5Etfw">
              September 1, 2025
            </a>
          </blockquote>
        </Box>

        {/* Tweet 4: Editors Leaderboard */}
        <Box mb={6} position="relative" width="100%" maxW="550px">
          <blockquote 
            className="twitter-tweet" 
            data-theme={useColorModeValue('light', 'dark')}
            style={{ margin: '0 auto' }}
          >
            <p lang="en" dir="ltr">
              🏆 Editors Leaderboard<br /><br />
              1. <a href="https://twitter.com/g11tech?ref_src=twsrc%5Etfw">@g11tech</a> – 51<br />
              2. <a href="https://twitter.com/_SamWilsn_?ref_src=twsrc%5Etfw">@_SamWilsn_</a> – 21<br />
              3. <a href="https://twitter.com/lightclients?ref_src=twsrc%5Etfw">@lightclients</a> – 8<br />
              4. <a href="https://twitter.com/xinbenlv?ref_src=twsrc%5Etfw">@xinbenlv</a> - 4<br />
              5. <a href="https://twitter.com/nconsigny?ref_src=twsrc%5Etfw">@nconsigny</a> – 1<br /><br />
              🔍 Reviewers Leaderboard <br /><br />
              1. <a href="https://twitter.com/JochemBrouwer96?ref_src=twsrc%5Etfw">@JochemBrouwer96</a> - 4<br />
              2. <a href="https://twitter.com/naps_thelma?ref_src=twsrc%5Etfw">@naps_thelma</a> - 2<br />
              3. Marchhill - 1<br /><br />
              📎 Source: <a href="https://t.co/7c6gFdamO1">https://t.co/7c6gFdamO1</a> 
              <a href="https://t.co/j7RrHkI5UK">pic.twitter.com/j7RrHkI5UK</a>
            </p>
            &mdash; EIPsInsight (@TeamAvarch) 
            <a href="https://twitter.com/TeamAvarch/status/1962382873572598064?ref_src=twsrc%5Etfw">
              September 1, 2025
            </a>
          </blockquote>
        </Box>

        {/* Tweet 5: Scheduled Insights - Don't let old habits hold you back */}
        <Box mb={6} position="relative" width="100%" maxW="550px">
          <blockquote 
            className="twitter-tweet" 
            data-theme={useColorModeValue('light', 'dark')}
            style={{ margin: '0 auto' }}
          >
            <p lang="en" dir="ltr">
              Don't let old habits hold you back. Switch to scheduled insights and see your workflow soar. <br /><br />
              Visit <a href="https://t.co/mXCeU990gC">https://t.co/mXCeU990gC</a>
              <a href="https://twitter.com/hashtag/EIPsInsight?src=hash&amp;ref_src=twsrc%5Etfw">#EIPsInsight</a> 
              <a href="https://twitter.com/hashtag/Efficiency?src=hash&amp;ref_src=twsrc%5Etfw">#Efficiency</a> 
              <a href="https://twitter.com/hashtag/MemeFriday?src=hash&amp;ref_src=twsrc%5Etfw">#MemeFriday</a> 
              <a href="https://t.co/AIHhJXqTge">pic.twitter.com/AIHhJXqTge</a>
            </p>
            &mdash; EIPsInsight (@TeamAvarch) 
            <a href="https://twitter.com/TeamAvarch/status/1961405069284270189?ref_src=twsrc%5Etfw">
              August 29, 2025
            </a>
          </blockquote>
        </Box>

        {/* Tweet 6: New Blog: EIP Proposal Builder and Validation Issues */}
        <Box mb={6} position="relative" width="100%" maxW="550px">
          <blockquote 
            className="twitter-tweet" 
            data-theme={useColorModeValue('light', 'dark')}
            style={{ margin: '0 auto' }}
          >
            <p lang="en" dir="ltr">
              New on the blog: EIP Proposal Builder and Validation Issues with Legacy EIPs
              <a href="https://t.co/bk3ooSCZ6u">https://t.co/bk3ooSCZ6u</a> 
              <a href="https://t.co/1jdFJVbv7c">pic.twitter.com/1jdFJVbv7c</a>
            </p>
            &mdash; EIPsInsight (@TeamAvarch) 
            <a href="https://twitter.com/TeamAvarch/status/1961139312080392361?ref_src=twsrc%5Etfw">
              August 28, 2025
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
