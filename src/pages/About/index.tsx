import React, { useState } from "react";
import Head from "next/head";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContributorsGrid from "@/components/ContributorsGrid";
import FundingDetails from "@/components/FundingDetails";
import GrantList from "@/components/GrantList";
import Partners from "@/components/Partners";
import {
  Box,
  Container,
  Text,
  Link,
  Heading,
  SimpleGrid,
  useColorModeValue,
  Button,
  Collapse,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Stack
} from '@chakra-ui/react';
import { 
  FaUsers, 
  FaChartLine, 
  FaTools, 
  FaDatabase, 
  FaComments, 
  FaGraduationCap 
} from 'react-icons/fa';

export default function AboutPage() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [showFeaturesOverview, setShowFeaturesOverview] = useState(false);
  const textColor = useColorModeValue("gray.700", "gray.200");
  const headingColor = useColorModeValue("gray.800", "white");
  const linkColor = useColorModeValue("blue.500", "blue.300");
  const cardBg = useColorModeValue("white", "#2d3748");
  const glassHover = useColorModeValue("rgba(243, 244, 246, 0.8)", "rgba(55, 65, 81, 0.8)");

  const featuresList = [
    { icon: FaChartLine, title: 'Monthly Insight', desc: 'Follow the status change of proposals under different types and categories with beautiful charts and tables providing details.', color: '#30A0E0' },
    { icon: FaTools, title: 'Advanced Toolings', desc: 'Make use of different toolings such as "Editor Review Tracker" and "Issues and PRs Trackers" for comprehensive proposal management.', color: '#4FD1FF' },
    { icon: FaDatabase, title: 'Detailed EIP Database', desc: 'Explore our extensive database of EIPs, complete with detailed descriptions, statuses, and relevant discussions.', color: '#7B61FF' },
    { icon: FaComments, title: 'Expert Analysis', desc: 'Gain access to expert commentary and analysis on significant EIPs and their potential impacts on the Ethereum ecosystem.', color: '#FF6FD8' },
    { icon: FaUsers, title: 'Community Engagement', desc: 'Join our vibrant community of Ethereum enthusiasts, developers, and stakeholders in meaningful discussions.', color: '#2AC7FF' },
    { icon: FaGraduationCap, title: 'Educational Resources', desc: 'Comprehensive learning materials designed to help you understand the proposal process and technical details.', color: '#30A0E0' },
  ];

  return (
    <>
      <Head>
        <title>About — EIPs Insights</title>
        <meta name="description" content="EIPs Insights — analytics, tools and community for Ethereum Improvement Proposals, ERCs and RIPs." />
        <meta property="og:title" content="About — EIPs Insights" />
        <meta property="og:description" content="EIPs Insights — analytics, tools and community for Ethereum Improvement Proposals, ERCs and RIPs." />
        <meta property="og:image" content="/EIPsInsights.gif" />
        <link rel="icon" href="/eipFavicon.png" />
      </Head>

  {/* Render site Navbar for pages router so about page matches site header */}
  <Navbar />

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
        paddingBottom={{ base: 2, sm: 3, lg: 4 }}
        marginX={0}
        paddingX={{ base: 2, md: 3, lg: 4 }}
        /* Reduced top spacing so content sits closer under the site navbar */
        marginTop={{ base: 4, sm: 6, md: 8, lg: 0 }}
      >
        {/* Overview Section */}
  <Container maxW="7xl" py={6} id="overview">
            <Box
              className="section-container"
              bg={cardBg}
              p={{ base: 6, md: 8 }}
              pb={0}
              mb={-4}
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
              fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}
              fontWeight="700"
              className="gradient-text"
              mb={8}
              textAlign="left"
            >
              About EIPsInsight
            </Heading>

            <Text
              fontSize={{ base: "md", md: "lg" }}
              color={textColor}
              lineHeight="1.6"
              fontWeight="400"
            >
              EIPsInsight is specialized in toolings designed to provide clear, visual insights into the activity of{" "}
              <Link
                href="https://github.com/ethereum/EIPs"
                color={linkColor}
                isExternal
                fontWeight="semibold"
                _hover={{ textDecoration: 'none', color: headingColor }}
                transition="color 0.2s"
              >
                Ethereum Improvement Proposals (EIPs)
              </Link>,{" "}
              <Link
                href="https://github.com/ethereum/ERCs"
                color={linkColor}
                isExternal
                fontWeight="semibold"
                _hover={{ textDecoration: 'none', color: headingColor }}
                transition="color 0.2s"
              >
                Ethereum Request for Comments (ERCs)
              </Link>, and{" "}
              <Link
                href="https://github.com/ethereum/RIPs"
                color={linkColor}
                isExternal
                fontWeight="semibold"
                _hover={{ textDecoration: 'none', color: headingColor }}
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
                        <Heading as="h3" fontSize="lg" className="gradient-text" mb={2} fontWeight="600">{feature.title}</Heading>
                        <Text color={textColor} fontSize="sm" lineHeight="1.6" opacity={0.9}>{feature.desc}</Text>

                        {expanded === feature.title && (
                          <Box mt={3} p={3} bg={useColorModeValue('rgba(243, 244, 246, 0.8)', 'rgba(55, 65, 81, 0.8)')} borderRadius="md" borderLeft="3px solid" borderColor={feature.color}>
                            <Text fontSize="xs" color={textColor} fontStyle="italic" lineHeight="1.5">Explore detailed dashboards with charts, filters, and export options to analyze trends and insights.</Text>
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
  <Container maxW="7xl" py={1} id="team">
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
  <Container maxW="7xl" py={1} id="funding">
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
            {/* Funding heading removed as requested */}
            <FundingDetails />
            {/* Support / Contact buttons removed as requested */}
          </Box>
        </Container>

        {/* Grants (moved out of Funding) */}
  <Container maxW="7xl" py={1} id="grants">
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
              fontSize={{ base: "2xl", md: "3xl" }}
              className="gradient-text"
              mb={6}
              fontWeight="600"
              textAlign="left"
            >
              Grants
            </Heading>

            <GrantList />
          </Box>
        </Container>

  {/* Mission/join section removed - moved links into Funding support block */}

  {/* Partners Section */}
  <Partners />



        {/* CTA removed as requested */}
      </Box>

      {/* Footer */}
      <Footer />
    </>
  );
}
