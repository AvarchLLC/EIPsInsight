
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import ContributorsGrid from '@/components/ContributorsGrid';
import Footer from '@/components/Footer';
import FundingDetails from '@/components/FundingDetails';


import NLink from 'next/link';
import { FiHome, FiMenu, FiX } from 'react-icons/fi';
import { FaChartLine, FaTools, FaDatabase, FaUsers, FaGraduationCap, FaComments, FaQuestionCircle, FaHeart } from 'react-icons/fa';
import {
  Box,
  Container,
  Text,
  Stack,
  HStack,
  Image,
  Link,
  Heading,
  UnorderedList,
  ListItem,
  SimpleGrid,
  useColorModeValue,
  useColorMode,
  IconButton,
  Button,
  Collapse,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Tooltip
} from '@chakra-ui/react';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';

export default function AboutPage() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<string>('overview');
  const [showFeaturesOverview, setShowFeaturesOverview] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { toggleColorMode } = useColorMode();
  const textColor = useColorModeValue("gray.700", "gray.200");
  const headingColor = useColorModeValue("gray.800", "white");
  const mainHeadingColor = useColorModeValue("#30A0E0", "#4FD1FF");
  const linkColor = useColorModeValue("blue.500", "blue.300");
  const navLinkColor = useColorModeValue("gray.600", "gray.200");
  const navLinkHoverColor = useColorModeValue("gray.800", "white");
  const cardBg = useColorModeValue("white", "#2d3748");
  const navBg = useColorModeValue("rgba(249, 250, 251, 0.8)", "rgba(23, 25, 35, 0.8)");
  const glassBg = useColorModeValue("rgba(255, 255, 255, 0.05)", "rgba(26, 32, 44, 0.05)");
  const glassHover = useColorModeValue("rgba(243, 244, 246, 0.8)", "rgba(55, 65, 81, 0.8)");

  // Enhanced dark mode visibility
  const containerBorder = useColorModeValue('1px solid rgba(2,6,23,0.04)', '2px solid rgba(74,85,104,0.8)');
  const containerShadow = useColorModeValue('0 6px 18px rgba(2,6,23,0.03)', '0 10px 30px rgba(0,0,0,0.4)');
  const containerHoverShadow = useColorModeValue('0 8px 25px rgba(2,6,23,0.08)', '0 15px 40px rgba(0,0,0,0.6)');

  const sections = [
    { id: 'overview', label: 'Overview', icon: FiHome },
    { id: 'team', label: 'Team', icon: FaUsers },
    { id: 'funding', label: 'Funding', icon: FaHeart },
    { id: 'faq', label: 'FAQ', icon: FaQuestionCircle },
  ];

  const featuresList = [
    { icon: FaChartLine, title: 'Monthly Insight', desc: 'Follow the status change of proposals under different types and categories with beautiful charts and tables providing details.', color: '#30A0E0' },
    { icon: FaTools, title: 'Advanced Toolings', desc: 'Make use of different toolings such as "Editor Review Tracker" and "Issues and PRs Trackers" for comprehensive proposal management.', color: '#4FD1FF' },
    { icon: FaDatabase, title: 'Detailed EIP Database', desc: 'Explore our extensive database of EIPs, complete with detailed descriptions, statuses, and relevant discussions.', color: '#7B61FF' },
    { icon: FaComments, title: 'Expert Analysis', desc: 'Gain access to expert commentary and analysis on significant EIPs and their potential impacts on the Ethereum ecosystem.', color: '#FF6FD8' },
    { icon: FaUsers, title: 'Community Engagement', desc: 'Join our vibrant community of Ethereum enthusiasts, developers, and stakeholders in meaningful discussions.', color: '#2AC7FF' },
    { icon: FaGraduationCap, title: 'Educational Resources', desc: 'Comprehensive learning materials designed to help you understand the proposal process and technical details.', color: '#30A0E0' },
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSection(sectionId);
      setIsMenuOpen(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetBottom = offsetTop + element.offsetHeight;

          if (scrollPosition >= offsetTop && scrollPosition < offsetBottom) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections]);

  return (
    <>
      <Head>
        <title>About — EIPs Insight</title>
        <meta name="description" content="EIPs Insight — analytics, tools and community for Ethereum Improvement Proposals, ERCs and RIPs." />
        <meta property="og:title" content="About — EIPs Insight" />
        <meta property="og:description" content="EIPs Insight — analytics, tools and community for Ethereum Improvement Proposals, ERCs and RIPs." />
        <meta property="og:image" content="/EIPsInsightsDark.gif" />
      </Head>

      {/* Custom Navbar */}
      <Box
        className="navbar"
        position="fixed"
        top={0}
        left={0}
        right={0}
        zIndex={1000}
        bg={navBg}
        py={4}
        px={{ base: 4, md: 8 }}
      >
        <Container maxW="7xl">
          <HStack justify="space-between" align="center">
            {/* Logo */}
            <NLink href="/">
              <Text
                fontSize="xl"
                fontWeight="bold"
                className="gradient-text"
                cursor="pointer"
              >
                EIPsInsight
              </Text>
            </NLink>

            {/* Desktop Navigation */}
            <HStack spacing={6} display={{ base: 'none', md: 'flex' }}>
              {sections.map((section) => {
                const IconComponent = section.icon;
                return (
                  <Box
                    key={section.id}
                    className={`nav-link ${activeSection === section.id ? 'active' : ''}`}
                    cursor="pointer"
                    onClick={() => scrollToSection(section.id)}
                    py={2}
                    px={3}
                    borderRadius="md"
                    color={activeSection === section.id ? mainHeadingColor : navLinkColor}
                    _hover={{
                      color: navLinkHoverColor,
                      bg: glassHover
                    }}
                  >
                    <Text fontSize="sm" fontWeight="medium">
                      {section.label}
                    </Text>
                  </Box>
                );
              })}

              {/* Dark Mode Toggle */}
              <IconButton
                aria-label="Toggle color mode"
                icon={useColorModeValue(<MoonIcon />, <SunIcon />)}
                onClick={toggleColorMode}
                variant="ghost"
                size="sm"
                color={navLinkColor}
                _hover={{
                  bg: glassHover,
                  color: navLinkHoverColor
                }}
              />
            </HStack>

            {/* Mobile Controls */}
            <HStack spacing={3} display={{ base: 'flex', md: 'none' }}>
              {/* Dark Mode Toggle for Mobile */}
              <IconButton
                aria-label="Toggle color mode"
                icon={useColorModeValue(<MoonIcon />, <SunIcon />)}
                onClick={toggleColorMode}
                variant="ghost"
                size="sm"
                color={navLinkColor}
                _hover={{
                  bg: glassHover,
                  color: navLinkHoverColor
                }}
              />

              {/* Mobile Menu Button */}
              <Box
                cursor="pointer"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                color={navLinkColor}
                _hover={{ color: navLinkHoverColor }}
              >
                {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
              </Box>
            </HStack>
          </HStack>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <Box
              className="mobile-menu"
              position="absolute"
              top="100%"
              left={0}
              right={0}
              bg={navBg}
              borderRadius="md"
              mt={2}
              p={4}
              boxShadow="lg"
              display={{ base: 'block', md: 'none' }}
            >
              <Stack spacing={3}>
                {sections.map((section) => {
                  const IconComponent = section.icon;
                  return (
                    <Box
                      key={section.id}
                      className={`nav-link ${activeSection === section.id ? 'active' : ''}`}
                      cursor="pointer"
                      onClick={() => scrollToSection(section.id)}
                      py={3}
                      px={4}
                      borderRadius="md"
                      color={activeSection === section.id ? mainHeadingColor : navLinkColor}
                      _hover={{
                        color: navLinkHoverColor,
                        bg: glassHover
                      }}
                    >
                      <Text fontSize="md" fontWeight="medium">
                        {section.label}
                      </Text>
                    </Box>
                  );
                })}
              </Stack>
            </Box>
          )}
        </Container>
      </Box>

      <style jsx>{`
        body {
          background: linear-gradient(135deg, 
            rgba(48,160,224,0.03) 0%, 
            rgba(79,209,255,0.05) 25%, 
            rgba(123,97,255,0.03) 50%, 
            rgba(255,111,216,0.05) 75%, 
            rgba(42,199,255,0.03) 100%);
          min-height: 100vh;
        }

        .glass-card {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .glass-card:hover {
          background: rgba(255, 255, 255, 0.15);
          border: 1px solid rgba(48,160,224,0.3);
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(48,160,224,0.15);
        }

        .hero-section {
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(25px);
          -webkit-backdrop-filter: blur(25px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.1);
        }

        .feature-card {
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.15);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
          position: relative;
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .feature-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(48,160,224,0.1), transparent);
          transition: left 0.5s;
        }

        .feature-card:hover::before {
          left: 100%;
        }

        .feature-card:hover {
          background: rgba(255, 255, 255, 0.12);
          border: 1px solid rgba(48,160,224,0.3);
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(48,160,224,0.15);
        }

        .gradient-text {
          background: linear-gradient(135deg, #30A0E0 0%, #4FD1FF 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .section-divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(48,160,224,0.3), transparent);
          margin: 1rem 0;
        }

        @keyframes fadeInUp {
          from { 
            opacity: 0; 
            transform: translateY(30px);
          }
          to { 
            opacity: 1; 
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fadeInUp 0.6s ease-out forwards;
        }

        .cta-button {
          background: linear-gradient(135deg, #30A0E0 0%, #4FD1FF 100%);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          transition: all 0.3s ease;
          box-shadow: 0 8px 25px rgba(48,160,224,0.3);
        }

        .cta-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 35px rgba(48,160,224,0.4);
          background: linear-gradient(135deg, #2A8BC5 0%, #4FD1FF 100%);
        }

        .navbar {
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(229, 231, 235, 0.3);
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .dark .navbar {
          border-bottom: 1px solid rgba(55, 65, 81, 0.3);
        }

        .nav-link {
          transition: all 0.2s ease;
          position: relative;
          border-radius: 6px;
        }

        .nav-link:hover {
          background: rgba(243, 244, 246, 0.8);
        }

        .dark .nav-link:hover {
          background: rgba(55, 65, 81, 0.8);
        }

        .nav-link.active {
          color: #30A0E0;
          background: rgba(48,160,224,0.1);
        }

        .nav-link.active::after {
          content: '';
          position: absolute;
          bottom: -8px;
          left: 50%;
          transform: translateX(-50%);
          width: 4px;
          height: 4px;
          background: #30A0E0;
          border-radius: 50%;
        }

        .mobile-menu {
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(229, 231, 235, 0.3);
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .dark .mobile-menu {
          border: 1px solid rgba(55, 65, 81, 0.3);
        }

        .glass-accordion {
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.15);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        }

        .glass-accordion:hover {
          background: rgba(255, 255, 255, 0.12);
          border: 1px solid rgba(48,160,224,0.2);
        }

        .mission-card {
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(25px);
          -webkit-backdrop-filter: blur(25px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.1);
        }

        .section-container {
          transition: transform 180ms, box-shadow 180ms;
        }

        .section-container:hover {
          transform: translateY(-2px);
        }

        /* Enhanced dark mode visibility */
        [data-theme="dark"] .section-container,
        .chakra-ui-dark .section-container {
          background: #2d3748 !important;
          border: 2px solid #4a5568 !important;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5) !important;
        }

        [data-theme="dark"] .section-container:hover,
        .chakra-ui-dark .section-container:hover {
          background: #374151 !important;
          border: 2px solid #5a6570 !important;
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.7) !important;
        }
      `}</style>
      <Box
        paddingBottom={{ base: 4, sm: 6, lg: 8 }}
        marginX={0}
        paddingX={{ base: 4, md: 6, lg: 8 }}
        marginTop={{ base: 20, sm: 24, md: 28, lg: 32 }}
      >
        {/* Overview Section */}
        <Container maxW="7xl" py={4} id="overview">
          <Box
            className="section-container"
            bg={cardBg}
            p={{ base: 6, md: 8 }}
            borderRadius="xl"
            textAlign="left"
            border={useColorModeValue('1px solid rgba(2,6,23,0.04)', '1px solid rgba(255,255,255,0.04)')}
            boxShadow={useColorModeValue('0 6px 18px rgba(2,6,23,0.03)', '0 8px 24px rgba(2,6,23,0.6)')}
            style={{ backdropFilter: useColorModeValue('', 'saturate(180%) blur(6px)') }}
            _hover={{
              transform: 'translateY(-2px)',
              boxShadow: useColorModeValue('0 8px 25px rgba(2,6,23,0.08)', '0 12px 32px rgba(2,6,23,0.8)')
            }}
          >
            <Heading
              as="h1"
              fontSize={{ base: "2xl", md: "3xl", lg: "4xl" }}
              fontWeight="bold"
              className="gradient-text"
              mb={6}
              textAlign="left"
            >
              What is EIPsInsight?
            </Heading>

            <Text
              fontSize={{ base: "md", md: "lg", lg: "xl" }}
              color={textColor}
              lineHeight="tall"
              fontWeight="medium"
            >
              EIPsInsight is specialized in toolings designed to provide clear, visual insights into the activity of{" "}
              <Link
                href="https://github.com/ethereum/EIPs"
                color={linkColor}
                isExternal
                fontWeight="semibold"
                _hover={{ textDecoration: 'none', color: mainHeadingColor }}
                transition="color 0.2s"
              >
                Ethereum Improvement Proposals (EIPs)
              </Link>,{" "}
              <Link
                href="https://github.com/ethereum/ERCs"
                color={linkColor}
                isExternal
                fontWeight="semibold"
                _hover={{ textDecoration: 'none', color: mainHeadingColor }}
                transition="color 0.2s"
              >
                Ethereum Request for Comments (ERCs)
              </Link>, and{" "}
              <Link
                href="https://github.com/ethereum/RIPs"
                color={linkColor}
                isExternal
                fontWeight="semibold"
                _hover={{ textDecoration: 'none', color: mainHeadingColor }}
                transition="color 0.2s"
              >
                Rollup Improvement Proposals (RIPs)
              </Link>{" "}
              over a specified period. Data provided is used for tracking the progress and workload distribution among
              EIP Editors, ensuring transparency and efficiency in the proposal review process.
            </Text>
            {/* Read more toggle to show Key Features inline */}
            <Box mt={6}>
              <Button
                onClick={() => setShowFeaturesOverview(!showFeaturesOverview)}
                size="sm"
                colorScheme="blue"
                variant="ghost"
                className="cta-button"
              >
                {showFeaturesOverview ? 'Hide key features' : 'Read more'}
              </Button>

              <Collapse in={showFeaturesOverview} animateOpacity>
                <Box mt={4}>
                  <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                    {featuresList.map((feature, index) => (
                      <Box
                        key={feature.title}
                        className="section-container"
                        bg={cardBg}
                        p={4}
                        borderRadius="lg"
                        textAlign="left"
                        cursor="pointer"
                        onClick={() => setExpanded(expanded === feature.title ? null : feature.title)}
                        style={{ animationDelay: `${index * 0.05}s` }}
                        border={useColorModeValue('1px solid rgba(2,6,23,0.04)', '1px solid rgba(255,255,255,0.04)')}
                        boxShadow={useColorModeValue('0 6px 18px rgba(2,6,23,0.03)', '0 8px 24px rgba(2,6,23,0.6)')}
                        _hover={{ transform: 'translateY(-2px)', boxShadow: useColorModeValue('0 8px 25px rgba(2,6,23,0.08)', '0 12px 32px rgba(2,6,23,0.8)') }}
                        transition="transform 180ms, box-shadow 180ms"
                      >
                        <Box as={feature.icon} size="28px" color={feature.color} mb={2} />
                        <Heading as="h3" size="sm" color={headingColor} mb={1} fontWeight="bold">{feature.title}</Heading>
                        <Text color={textColor} fontSize="sm" lineHeight="tall" opacity={0.9}>{feature.desc}</Text>

                        {expanded === feature.title && (
                          <Box mt={3} p={3} bg={useColorModeValue('rgba(243, 244, 246, 0.8)', 'rgba(55, 65, 81, 0.8)')} borderRadius="md" borderLeft="3px solid" borderColor={feature.color}>
                            <Text fontSize="xs" color={textColor} fontStyle="italic">Explore detailed dashboards with charts, filters, and export options to analyze trends and insights.</Text>
                          </Box>
                        )}
                      </Box>
                    ))}
                  </SimpleGrid>
                </Box>
              </Collapse>
            </Box>
          </Box>
        </Container>

        {/* Contributors Section */}
        <Container maxW="7xl" py={4} id="team">
          <Box
            className="section-container"
            bg={cardBg}
            p={{ base: 6, md: 8 }}
            borderRadius="xl"
            border={useColorModeValue('1px solid rgba(2,6,23,0.04)', '1px solid rgba(255,255,255,0.04)')}
            boxShadow={useColorModeValue('0 6px 18px rgba(2,6,23,0.03)', '0 8px 24px rgba(2,6,23,0.6)')}
            style={{ backdropFilter: useColorModeValue('', 'saturate(180%) blur(6px)') }}
            _hover={{
              transform: 'translateY(-2px)',
              boxShadow: useColorModeValue('0 8px 25px rgba(2,6,23,0.08)', '0 12px 32px rgba(2,6,23,0.8)')
            }}
          >
            <ContributorsGrid />
          </Box>
        </Container>

        {/* Funding Section */}
        <Container maxW="7xl" py={4} id="funding">
          <Box
            className="section-container"
            bg={cardBg}
            p={{ base: 6, md: 8 }}
            borderRadius="xl"
            border={useColorModeValue('1px solid rgba(2,6,23,0.04)', '1px solid rgba(255,255,255,0.04)')}
            boxShadow={useColorModeValue('0 6px 18px rgba(2,6,23,0.03)', '0 8px 24px rgba(2,6,23,0.6)')}
            style={{ backdropFilter: useColorModeValue('', 'saturate(180%) blur(6px)') }}
            _hover={{
              transform: 'translateY(-2px)',
              boxShadow: useColorModeValue('0 8px 25px rgba(2,6,23,0.08)', '0 12px 32px rgba(2,6,23,0.8)')
            }}
          >
            <Heading
              as="h2"
              fontSize={{ base: "2xl", md: "3xl", lg: "4xl" }}
              bgGradient="linear(135deg, #30A0E0 0%, #4FD1FF 100%)"
              bgClip="text"
              color="transparent"
              mb={6}
              fontWeight="bold"
              textAlign="left"
            >
              Funding
            </Heading>
            <FundingDetails />
            {/* Support / Contact buttons removed as requested */}
          </Box>
        </Container>

        {/* Mission/join section removed - moved links into Funding support block */}

        {/* FAQ Section */}
        <Container maxW="7xl" py={4} id="faq">
          <Box
            className="section-container"
            bg={cardBg}
            p={{ base: 6, md: 8 }}
            borderRadius="xl"
            border={useColorModeValue('1px solid rgba(2,6,23,0.04)', '1px solid rgba(255,255,255,0.04)')}
            boxShadow={useColorModeValue('0 6px 18px rgba(2,6,23,0.03)', '0 8px 24px rgba(2,6,23,0.6)')}
            style={{ backdropFilter: useColorModeValue('', 'saturate(180%) blur(6px)') }}
            _hover={{
              transform: 'translateY(-2px)',
              boxShadow: useColorModeValue('0 8px 25px rgba(2,6,23,0.08)', '0 12px 32px rgba(2,6,23,0.8)')
            }}
          >
            <Heading
              as="h2"
              fontSize={{ base: "2xl", md: "3xl", lg: "4xl" }}
              className="gradient-text"
              mb={3}
              fontWeight="bold"
              textAlign="left"
            >
              Frequently Asked Questions
            </Heading>
            <Text
              fontSize={{ base: "sm", md: "md" }}
              color={textColor}
              opacity={0.8}
              mb={6}
            >
              Get answers to common questions about our platform and services
            </Text>

            <Stack spacing={4}>
              <Box
                className="section-container"
                bg={cardBg}
                borderRadius="xl"
                overflow="hidden"
                border={useColorModeValue('1px solid rgba(2,6,23,0.04)', '1px solid rgba(255,255,255,0.04)')}
                boxShadow={useColorModeValue('0 6px 18px rgba(2,6,23,0.03)', '0 8px 24px rgba(2,6,23,0.6)')}
                style={{ backdropFilter: useColorModeValue('', 'saturate(180%) blur(6px)') }}
                _hover={{
                  transform: 'translateY(-2px)',
                  boxShadow: useColorModeValue('0 8px 25px rgba(2,6,23,0.08)', '0 12px 32px rgba(2,6,23,0.8)')
                }}
              >
                <Accordion allowMultiple>
                  <AccordionItem border="none">
                    <AccordionButton
                      p={6}
                      transition="all 0.2s"
                      _hover={{ bg: glassHover }}
                    >
                      <Box flex="1" textAlign="left">
                        <Text fontWeight="semibold" fontSize="md">Where does the data come from?</Text>
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                    <AccordionPanel pb={6} px={6}>
                      <Text color={textColor} lineHeight="tall" fontSize="sm">
                        We aggregate public GitHub data from the official ethereum repos (EIPs, ERCs, RIPs) and normalize labels for consistent analytics.
                      </Text>
                    </AccordionPanel>
                  </AccordionItem>
                </Accordion>
              </Box>

              <Box
                className="section-container"
                bg={cardBg}
                borderRadius="xl"
                overflow="hidden"
                border={useColorModeValue('1px solid rgba(2,6,23,0.04)', '1px solid rgba(255,255,255,0.04)')}
                boxShadow={useColorModeValue('0 6px 18px rgba(2,6,23,0.03)', '0 8px 24px rgba(2,6,23,0.6)')}
                style={{ backdropFilter: useColorModeValue('', 'saturate(180%) blur(6px)') }}
                _hover={{
                  transform: 'translateY(-2px)',
                  boxShadow: useColorModeValue('0 8px 25px rgba(2,6,23,0.08)', '0 12px 32px rgba(2,6,23,0.8)')
                }}
              >
                <Accordion allowMultiple>
                  <AccordionItem border="none">
                    <AccordionButton
                      p={6}
                      transition="all 0.2s"
                      _hover={{ bg: glassHover }}
                    >
                      <Box flex="1" textAlign="left">
                        <Text fontWeight="semibold" fontSize="md">Can I contribute?</Text>
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                    <AccordionPanel pb={6} px={6}>
                      <Text color={textColor} lineHeight="tall" fontSize="sm">
                        Absolutely — check the repository on GitHub, open issues, PRs, or reach out to the maintainers listed in the team section.
                      </Text>
                    </AccordionPanel>
                  </AccordionItem>
                </Accordion>
              </Box>
            </Stack>
          </Box>
        </Container>

        {/* CTA removed as requested */}
      </Box>

      {/* Footer */}
      <Footer />
    </>
  );
}
