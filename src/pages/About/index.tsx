
import React, { useState } from 'react';
import Head from 'next/head';
import AboutFunding from '@/components/AboutFunding';
import ContributorsGrid from '@/components/ContributorsGrid';
import EtherWorldAdCard from '@/components/EtherWorldAdCard';
import AllLayout from '@/components/Layout';
import NLink from 'next/link';
import { FiHome } from 'react-icons/fi';
import { FaChartLine, FaTools, FaDatabase, FaUsers, FaGraduationCap, FaComments } from 'react-icons/fa';
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
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Tooltip
} from '@chakra-ui/react';
 
export default function AboutPage() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const textColor = useColorModeValue("gray.700", "gray.200");
  const headingColor = useColorModeValue("gray.800", "white");
  const mainHeadingColor = useColorModeValue("#30A0E0", "#4FD1FF");
  const linkColor = useColorModeValue("blue.500", "blue.300");
  const cardBg = useColorModeValue("white", "gray.800");

  return (
    <AllLayout>
      <Head>
        <title>About — EIPs Insight</title>
        <meta name="description" content="EIPs Insight — analytics, tools and community for Ethereum Improvement Proposals, ERCs and RIPs." />
        <meta property="og:title" content="About — EIPs Insight" />
        <meta property="og:description" content="EIPs Insight — analytics, tools and community for Ethereum Improvement Proposals, ERCs and RIPs." />
        <meta property="og:image" content="/EIPsInsightsDark.gif" />
      </Head>
 
      <style jsx>{`
        .feature-card {
          animation: fadeInUp 420ms ease forwards;
          opacity: 0;
          transform-origin: center;
          will-change: transform, box-shadow, opacity;
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(8px) scale(0.995); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        .feature-card:hover {
          transform: translateY(-10px) rotateX(4deg) rotateY(2deg) scale(1.01);
        }

        .feature-icon {
          transition: transform 220ms ease, filter 220ms ease;
        }

        .feature-card:hover .feature-icon {
          transform: translateY(-3px) scale(1.12);
          filter: drop-shadow(0 6px 18px rgba(48,160,224,0.18));
        }

        .feature-card::before {
          content: '';
          pointer-events: none;
          position: absolute;
          inset: 0;
          border-radius: 8px;
          transition: box-shadow 220ms ease, opacity 220ms ease;
          box-shadow: 0 0 0 rgba(0,0,0,0);
        }

        .feature-card:hover::before {
          box-shadow: 0 10px 30px rgba(2,6,23,0.18), 0 0 36px rgba(48,160,224,0.08);
        }

        /* animated gradient underline for the main heading */
        .animated-underline {
          display: inline-block;
          position: relative;
        }
        .animated-underline::after {
          content: '';
          position: absolute;
          left: 0;
          right: 0;
          bottom: -10px;
          height: 6px;
          border-radius: 6px;
          background: linear-gradient(90deg,#2AC7FF,#7B61FF,#FF6FD8);
          transform: translateX(-8%);
          animation: slideGradient 3.6s linear infinite;
          opacity: 0.9;
        }
        @keyframes slideGradient { from { transform: translateX(-8%); } to { transform: translateX(8%); } }
      `}</style>
      <Box
        paddingBottom={{ base: 4, sm: 6, lg: 8 }}
        marginX={0}
        paddingX={{ base: 4, md: 8, lg: 12 }}
        marginTop={{ base: 0, sm: 2, md: 4, lg: 4 }}
      >
        {/* Combined hero + ad container */}
        <Container maxW="7xl" py={2}>
          <Box bg={cardBg} p={{ base: 4, md: 6 }} borderRadius="xl" border={useColorModeValue('1px solid rgba(2,6,23,0.04)','1px solid rgba(255,255,255,0.04)')} boxShadow="sm">
            <Box my={0}>
              <Text
                id="what"
                fontSize={{ base: "2xl", md: "4xl", lg: "6xl" }}
                fontWeight={{ base: "extrabold", md: "bold", lg: "bold" }}
                color={mainHeadingColor}
                textAlign={{ base: "center", md: "left" }}
              >
                What is EIPsInsight?
              </Text>
            </Box>

            <Stack
              direction={{ base: "column", lg: "row" }}
              spacing={8}
              align={{ base: "center", lg: "start" }}
              justify="start"
              flexWrap="wrap"
              mt={4}
            >
            {/* Image Box */}
            <Box
              display="flex"
              justifyContent={{ base: "center", lg: "start" }}
              width={{ base: "100%", md: "40%", lg: "32%" }}
              minW={{ lg: '220px' }}
              overflow="hidden"
              borderRadius="md"
              transition="transform 200ms ease"
              _hover={{ transform: 'scale(1.03)' }}
            >
              <Image
                src="Blockchain_Future.png"
                alt="EIPsInsight Platform"
                borderRadius="md"
                width={{ base: "220px", md: "300px", lg: "100%" }}
                height="auto"
                objectFit="contain"
                transition="transform 240ms ease"
              />
            </Box>

            {/* Text */}
            <Box
              width={{ base: "100%", md: "50%", lg: "55%" }}
              textAlign="justify"
              pl={{ lg: 6 }}
            >
              <Text fontSize={{ base: "md", md: "xl", lg: "xl" }} textAlign="justify" color={textColor}>
                EIPsInsight is specialized in toolings designed to provide clear, visual insights into the activity of{" "}
                <Link href="https://github.com/ethereum/EIPs" color={linkColor} isExternal className="underline">
                  Ethereum Improvement Proposals (EIPs)
                </Link>,{" "}
                <Link href="https://github.com/ethereum/ERCs" color={linkColor} isExternal className="underline">
                  Ethereum Request for Comments (ERCs)
                </Link>, and{" "}
                <Link href="https://github.com/ethereum/RIPs" color={linkColor} isExternal className="underline">
                  Rollup Improvement Proposals (RIPs)
                </Link>{" "}
                over a specified period. Data provided is used for tracking the progress and workload distribution among
                EIP Editors, ensuring transparency and efficiency in the proposal review process.
              </Text>
              <Text fontSize={{ base: "md", md: "xl", lg: "xl" }} textAlign="justify" color={textColor} mt={4}>
                EIPsInsight is a tooling platform dedicated to providing in-depth analysis, up-to-date information, and
                comprehensive insights on Ethereum Standards. Our mission is to empower editors, developers, stakeholders,
                and the broader Ethereum community with the knowledge and tools necessary to understand and engage with
                the ongoing evolution of the Ethereum Standards.
              </Text>
            </Box>
          </Stack>

            <Box mt={6}>
              <EtherWorldAdCard />
            </Box>
          </Box>
        </Container>

        {/* Key Features Section container */}
        <Container maxW="7xl" py={4}>
          <Box bg={cardBg} p={{ base: 4, md: 6 }} borderRadius="xl" border={useColorModeValue('1px solid rgba(2,6,23,0.04)','1px solid rgba(255,255,255,0.04)')} boxShadow="sm">
            <Box my={2}>
              <Heading as="h2" size="lg" color={headingColor} mb={6}>
                Key Features
              </Heading>

              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
              {[
                { icon: FaChartLine, title: 'Monthly Insight', desc: 'Follow the status change of proposals under different types and categories with beautiful charts and tables providing details.' },
                { icon: FaTools, title: 'Toolings', desc: 'Make use of different toolings such as "Editor Review Tracker" and "Issues and PRs Trackers" which will provide the proposals added, reviewed and moved to various statuses by EIP Editors. These will be helpful for tracking the progress and workload distribution among EIP Editors, ensuring transparency and efficiency in the proposal review process.' },
                { icon: FaDatabase, title: 'Detailed EIP Database', desc: 'Explore our extensive database of EIPs, complete with detailed descriptions, statuses, and relevant discussions. Whether you\'re looking for historical proposals or the latest advancements, our database is your go-to resource.' },
                { icon: FaComments, title: 'Expert Analysis', desc: 'Gain access to expert commentary and analysis on significant EIPs, their potential impacts, and the broader implications for the Ethereum ecosystem. Our team of experienced analysts and contributors ensure you have the most accurate and relevant insights.' },
                { icon: FaUsers, title: 'Community Engagement', desc: 'Join the conversation with our vibrant community of Ethereum enthusiasts, developers, and stakeholders. Participate in forums, provide feedback on proposals, and stay connected with the latest developments in the Ethereum space.' },
                { icon: FaGraduationCap, title: 'Educational Resources', desc: 'New to EIPs? Our educational resources are designed to help you understand the proposal process, the technical details, and the importance of various EIPs. From beginners to seasoned developers, there\'s something for everyone.' },
                { icon: FaChartLine, title: 'Regular Updates', desc: 'Stay informed with our regular updates and newsletters. Get the latest news, changes, and discussions surrounding EIPs delivered straight to your inbox.' },
              ].map((f) => (
                <Box
                  key={f.title}
                  as="button"
                  role="button"
                  tabIndex={0}
                  bg={cardBg}
                  p={{ base: 4, md: 5 }}
                  borderRadius="lg"
                  boxShadow="sm"
                  _hover={{ transform: 'translateY(-6px)', boxShadow: 'lg', bg: useColorModeValue('gray.50','gray.700') }}
                  _focus={{ outline: 'none', boxShadow: 'outline' }}
                  transition="all 200ms ease"
                  textAlign="left"
                  onClick={() => setExpanded(expanded === f.title ? null : f.title)}
                  onKeyDown={(e: React.KeyboardEvent) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setExpanded(expanded === f.title ? null : f.title); } }}
                  aria-expanded={expanded === f.title}
                >
                  <HStack align="start" spacing={4}>
                    <Tooltip label={`${f.title}`} aria-label={`${f.title} tooltip`}>
                      <Box
                        as={f.icon}
                        size="24px"
                        color={mainHeadingColor}
                        style={{ fontSize: 22, transition: 'transform 200ms' }}
                        _hover={{ transform: 'scale(1.08) translateY(-2px)' }}
                      />
                    </Tooltip>
                    <Box>
                      <Text fontWeight="700" color={textColor} mb={1}>{f.title}</Text>
                      <Text color={textColor} fontSize="sm" lineHeight="tall">{f.desc}</Text>
                      {expanded === f.title && (
                        <Text mt={3} color={textColor} fontSize="sm">
                          Explore a detailed dashboard for this feature — charts, filters, and export options make it easy to analyze trends.
                        </Text>
                      )}
                    </Box>
                  </HStack>
                </Box>
              ))}
            </SimpleGrid>
          </Box>
        </Box>
        </Container>

        {/* Closing + Funding + FAQ + Team container */}
        <Container maxW="7xl" py={4}>
          <Box bg={cardBg} p={{ base: 4, md: 6 }} borderRadius="xl" border={useColorModeValue('1px solid rgba(2,6,23,0.04)','1px solid rgba(255,255,255,0.04)')} boxShadow="sm">
            <Box my={2}>
              <Text fontSize={{ base: "md", md: "xl", lg: "xl" }} textAlign="justify" color={textColor}>
                At EIPsInsight, we believe in the power of open-source collaboration and the continuous improvement of the
                Ethereum network.{" "}
                <Link href="https://x.com/TeamAvarch" color={linkColor} isExternal className="underline">
                  Join us
                </Link>{" "}
                in exploring the future of Ethereum, one proposal at a time.
              </Text>
            </Box>

            <Box my={4}>
              <AboutFunding />
            </Box>

            {/* Frequently asked questions */}
            <Box my={4}>
              <Heading as="h3" size="md" mb={4} color={headingColor}>
                Frequently asked
              </Heading>
              <Accordion allowMultiple>
                <AccordionItem>
                  <AccordionButton>
                    <Box flex="1" textAlign="left">Where does the data come from?</Box>
                    <AccordionIcon />
                  </AccordionButton>
                  <AccordionPanel pb={4} color={textColor}>
                    We aggregate public GitHub data from the official ethereum repos (EIPs, ERCs, RIPs) and normalize labels for consistent analytics.
                  </AccordionPanel>
                </AccordionItem>
                <AccordionItem>
                  <AccordionButton>
                    <Box flex="1" textAlign="left">Can I contribute?</Box>
                    <AccordionIcon />
                  </AccordionButton>
                  <AccordionPanel pb={4} color={textColor}>
                    Absolutely — check the repository on GitHub, open issues, PRs, or reach out to the maintainers listed in the team section.
                  </AccordionPanel>
                </AccordionItem>
              </Accordion>
            </Box>

            <Box my={4}>
              <ContributorsGrid />
            </Box>

            {/* Go to Dashboard Button */}
            <Box display="flex" justifyContent="center" w="100%" mt={8}>
              <NLink href="/">
                <Box
                  display="flex"
                  alignItems="center"
                  bg="#30A0E0"
                  color="white"
                  padding="10px 20px"
                  borderRadius="8px"
                  fontWeight="bold"
                  cursor="pointer"
                  _hover={{ bg: "#2A8BC5" }}
                  _active={{ bg: "#1F6F99" }}
                  transition="background-color 0.3s"
                >
                  <FiHome style={{ marginRight: '8px' }} />
                  Go to Dashboard
                </Box>
              </NLink>
            </Box>
          </Box>
        </Container>
      </Box>
    </AllLayout>
  );
}
