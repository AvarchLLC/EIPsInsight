import React, { useState, useEffect } from "react";
import Header from "./Header";
import {
  useColorModeValue,
  Box,
  Button,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  Image,
  Link,
  Flex,
  SimpleGrid,
  Heading,
  Icon,
  Badge,
  useBreakpointValue,
  AspectRatio,
  Stack,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Grid,
  Center,
} from "@chakra-ui/react";
import {
  FaYoutube,
  FaNewspaper,
  FaBlog,
  FaQuestionCircle,
  FaTools,
} from "react-icons/fa";
import NextLink from "next/link";
import FeedbackWidget from "./FeedbackWidget";

const ResourcesPage: React.FC = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [recentBlogs, setRecentBlogs] = useState<any[]>([]);
  const [loadingBlogs, setLoadingBlogs] = useState(false);
  
  const bg = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.700", "gray.200");
  const accentColor = useColorModeValue("blue.500", "blue.300");
  const tabBg = useColorModeValue("white", "gray.700");
  const tabBorderColor = useColorModeValue("gray.200", "gray.600");

  const tabSize = useBreakpointValue({ base: "sm", md: "md" });
  const isMobile = useBreakpointValue({ base: true, md: false });

  // Fetch recent database blogs
  useEffect(() => {
    const fetchRecentBlogs = async () => {
      setLoadingBlogs(true);
      try {
        const response = await fetch('/api/admin/blogs');
        if (response.ok) {
          const data = await response.json();
          // Get published blogs only, sorted by date, limit to 6 most recent
          const publishedBlogs = data.blogs
            ?.filter((blog: any) => blog.published)
            ?.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
            ?.slice(0, 6) || [];
          setRecentBlogs(publishedBlogs);
        }
      } catch (error) {
        console.error('Failed to fetch recent blogs:', error);
      } finally {
        setLoadingBlogs(false);
      }
    };

    fetchRecentBlogs();
  }, []);

  const handleSelection = (hash: any) => {
    const upperHash = hash.toUpperCase();
    const tabs = ["FAQ", "BLOGS", "VIDEOS", "NEWS"];
    const index = tabs.indexOf(upperHash);
    if (index !== -1) {
      setTabIndex(index);
      window.location.hash = hash;
    }
  };

  useEffect(() => {
    const hash = window.location.hash.slice(1).toUpperCase();
    const tabs = ["FAQ", "BLOGS", "VIDEOS", "NEWS"];
    const index = tabs.indexOf(hash);
    if (index !== -1) setTabIndex(index);
  }, []);

  const Card = ({
    image,
    title,
    content,
    link,
    tag,
  }: {
    image?: string;
    title: string;
    content: string;
    link: string;
    tag?: string;
  }) => (
    <Link
        href={link}
        _hover={{ textDecoration: "none" }}
      >
    <Box
      bg={cardBg}
      p={5}
      borderRadius="xl"
      boxShadow="md"
      height="100%"
      transition="all 0.2s ease"
      _hover={{
        transform: "translateY(-5px)",
        boxShadow: "lg",
      }}
    >
      {image && (
        <AspectRatio ratio={16 / 9} mb={4} borderRadius="lg" overflow="hidden">
          <Image 
            src={image} 
            alt={title} 
            objectFit="cover"
            fallbackSrc="/blog-placeholder.png"
            onError={(e: any) => {
              e.target.style.display = 'none';
            }}
          />
        </AspectRatio>
      )}
      {tag && (
        <Badge colorScheme="blue" mb={2} fontSize="xs">
          {tag}
        </Badge>
      )}
      <Heading fontSize={{ base: "lg", md: "xl" }} mb={2} noOfLines={2}>
        {title}
      </Heading>
      <Text fontSize="md" color={textColor} noOfLines={3} mb={4}>
        {content}
      </Text>
      <Link
        href={link}
        color={accentColor}
        fontWeight="semibold"
        isExternal={!link.startsWith("/")}
        display="inline-flex"
        alignItems="center"
      >
        Read more →
      </Link>
    </Box>
    </Link>
  );

  const VideoCard = ({ url }: { url: string }) => {
    const embedUrl = url
      .replace("watch?v=", "embed/")
      .replace("youtu.be/", "youtube.com/embed/");

    return (
      <Box
        bg={cardBg}
        p={0}
        borderRadius="xl"
        boxShadow="md"
        overflow="hidden"
        transition="all 0.2s ease"
        _hover={{
          transform: "translateY(-3px)",
          boxShadow: "lg",
        }}
        width="100%"
      >
        <AspectRatio ratio={16 / 9}>
          <iframe
            width="100%"
            height="100%"
            src={embedUrl}
            title="EIPsInsight Video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </AspectRatio>
        <Box p={3}>
          <Link
            href={url
              .replace("embed/", "watch?v=")
              .replace("youtube.com/embed/", "youtu.be/")}
            color={accentColor}
            fontSize="sm"
            fontWeight="semibold"
            isExternal
            display="inline-flex"
            alignItems="center"
          >
            Watch on YouTube →
          </Link>
        </Box>
      </Box>
    );
  };

  const TOOLS = [
    {
      title: "Analytics",
      description: "Track and visualize EIP activity and trends",
      link: "/Analytics",
      icon: "📊",
    },
    {
      title: "Boards",
      description: "Manage and organize EIP proposals",
      link: "/boards",
      icon: "📋",
    },
    {
      title: "Editors & Reviewers Leaderboard",
      description: "See top contributors in the EIP ecosystem",
      link: "/Reviewers",
      icon: "🏆",
    },
    {
      title: "EIP Proposal Builder",
      description: "Create and format new EIP proposals easily",
      link: "/proposalbuilder",
      icon: "🛠️",
    },
    {
      title: "Search by Author",
      description: "Find EIPs by their authors",
      link: "/authors",
      icon: "🔍",
    },
    {
      title: "Search by EIP",
      description: "Quickly find specific EIPs",
      link: "/SearchEip",
      icon: "🔎",
    },
  ];

  const FAQs = [
    {
      title: "What is an Ethereum Improvement Proposal (EIP)?",
      content:
        "EIP stands for Ethereum Improvement Proposal. An EIP is a design document providing information to the Ethereum community,",
      link: "/FAQs/EIP",
      tag: "Beginner",
    },
    {
      title: "What is an Ethereum Request for Change (ERC)?",
      content:
        "The goal of Ethereum Request for Change (ERCs) is to standardize and provide high-quality documentation for the Ethereum application layer.",
      link: "/FAQs/ERC",
      tag: "Intermediate",
    },
    {
      title: "What is an Rollup Improvement Proposal (RIP)?",
      content:
        "A Rollup Improvement Proposal (RIP) is a formal document that outlines new features, processes, or optimizations for rollup solutions",
      link: "/FAQs/RIP",
      tag: "Advanced",
    },
    {
      title: "What is EIPsInsight?",
      content:
        "EIPsInsight is specialized in toolings designed to provide clear, visual insights into the activity of Ethereum Improvement Proposals (EIPs), Ethereum Request for Comments (ERCs), and Rollup Improvement Proposals (RIPs) over a specified period.",
      link: "/About",
      tag: "About",
    },
  ];

  const NEWS = [
    {
      image: "/news1.jpg",
      title: "The EIP Proposal Builder: Simplify, Streamline, Succeed",
      content:
        "Introducing the EIP Proposal Builder: Simplify the creation of Ethereum Improvement Proposals with ease.",
      link: "https://etherworld.co/2025/01/20/the-eip-proposal-builder-simplify-streamline-succeed/",
      tag: "New Feature",
    },
    {
      image: "/news2.jpg",
      title: "Unveiling the Analytics Tool on EIPsInsight",
      content:
        "Discover EIPsInsight Analytics – a tool designed to streamline project management with visualized GitHub data.",
      link: "https://etherworld.co/2025/01/07/unveiling-the-analytics-tool-on-eipsinsight/",
      tag: "Tool",
    },
    {
      image: "/news3.png",
      title:
        "Boosting EIP Contributions: Unleashing the Power of Editors Leaderboard",
      content:
        "The Editors Leaderboard and EIP Board streamline EIP reviews by tracking individual contributions.",
      link: "https://etherworld.co/2024/12/26/boosting-eip-contributions-unleashing-the-power-of-editors-leaderboard-and-eip-board/",
      tag: "Community",
    },
    {
      image: "/news4.jpg",
      title: "Introducing EIP-Board: Simplifying Pull Request Management",
      content:
        "EIP-Board simplifies Ethereum Improvement Proposal management by prioritizing pull requests.",
      link: "https://etherworld.co/2024/12/04/introducing-eip-board-simplifying-pull-request-management-for-eip-editors/",
      tag: "New Feature",
    },
    {
      image: "/news5.jpg",
      title: "Introducing 'Search by Author' Feature on EIPsInsight",
      content:
        "Tracking and exploring Ethereum proposals just got a whole lot easier.",
      link: "https://etherworld.co/2024/11/26/search-by-author-eipsinsight/",
      tag: "Feature",
    },
    {
      image: "/blog3.jpg",
      title: "ICYMI: New Features on EIPsInsight",
      content:
        "EIPsInsight introduces new features, including filters, reviewer tracking, Pectra countdown, and improved analytics.",
      link: "https://etherworld.co/2025/04/01/icymi-new-features-on-eipsinsight/",
      tag: "Update",
    },
    {
      image: "/EipsInsightRecap.jpg",
      title: "Eipsinsight milestones 2024",
      content:
        "This review highlights the pivotal role played by the Analytics Scheduler, Reviewers Tracker, EIP Board, and other utilities.",
      link: "/milestones2024",
      tag: "Year in Review",
    },
    {
      image: "/blog1.jpg",
      title: "ERC-7779: Understanding & Redefining Wallet Interoperability",
      content:
        "ERC-7779 revolutionizes Ethereum by enhancing wallet interoperability, simplifying user transitions.",
      link: "https://etherworld.co/2025/01/24/erc-7779-understanding-redefining-wallet-interoperability/",
      tag: "Technical",
    },
    {
      image: "/resources3.jpg",
      title: "Ethereum's Dencun upgrade moving towards Devnet 8",
      content:
        "Devnet 8 Specs, Challenges in Devnet 7, Geth-Related Bugs & c-kzg Library",
      link: "https://etherworld.co/2023/07/11/ethereums-dencun-upgrade-moving-towards-devnet-8/",
      tag: "Upgrade",
    },
    {
      image: "/resources7.png",
      title: "Eip - 7516 : BLOBBASEFEE opcode",
      content:
        "EIP proposes BLOBBASEFEE opcode for smart contracts to manage blob data costs efficiently.",
      link: "https://etherworld.co/2024/01/25/eip-7516-blobbasefee-opcode/",
      tag: "Technical",
    },
    {
      image: "/resources9.jpg",
      title: "EIP - 7045 Increase Max Attestation Inclusion Slot",
      content:
        "EIP-7045 introduces a crucial Ethereum upgrade, extending attestation inclusion slots for improved security.",
      link: "https://etherworld.co/2024/01/09/eip-7045/",
      tag: "Technical",
    },
  ];

  const BLOGS = [
    {
      image: "/Nody2.png",
      title: "EIP Proposal Builder and Validation Issues with Legacy EIPs",
      content: "The Proposal Builder simulates EIPW Lint to let authors import drafts and validate them against the latest linting rules before submission.",
      link: "Blogs/eip-proposal-builder-validation-legacy",
      tag: "Technical"
    },
    {
      image: "/nody.png",
      title: "EIPs @10: A Decade of Standardizing Ethereum",
      content: "A decade-long review of Ethereum Improvement Proposals (EIPs), detailing their impact on protocol upgrades, token standards, consensus changes and the evolution of Ethereum into a $400+ billion ecosystem. Covers major eras, landmark EIPs, and the pivotal role of open governance in Ethereum's growth.",
      link: "Blogs/eip-decade-overview",
      tag: "Decade Overview"
    },
    {
      image: "/EipsInsightRecap.jpg",
      title: "Eipsinsight milestones 2024",
      content: "This review highlights the pivotal role played by the Analytics Scheduler, Reviewers Tracker, EIP Board, and other utilities.",
      link: "/milestones2024",
      tag: "Year in Review"
    },
    {
      image: "/bpo-forks-eip-7892(2).jpg",
      title: "Blob Parameter Only (BPO) Forks (EIP-7892)",
      content: "Ethereum scales blob capacity with Blob Parameter Only (BPO) forks to support Layer 2 growth before Fusaka and PeerDAS, preserving decentralization.",
      link: "/Blogs/bpo-forks-eip-7892",
      tag: "Technical"
    },
    {
      image: "/EIP_blog1.png",
      title: "EIPsInsight Newsletter Issue #[01] | [02-07-2025]",
      content: "Bringing You the Latest in Ethereum Improvement Proposals",
      link: "/newsletter",
    },
   {
      image: "/ePBS-eip-7732.jpg",
      title: "Enshrined Proposer Builder Separation (ePBS) (EIP-7732)",
      content: "Understand Ethereum’s EIP-7732 upgrade with a breakdown of what ePBS is, why it’s needed, key architectural changes, its advantages, challenges, and how it compares to PBS.",
      link: "/Blogs/ePBS-EIP-7732",
      tag: "Technical"
    },
     {
      image: "/hiring-full-stack-developer.png",
      title: "Join EIPsInsight.com as a Full-Stack Developer (Remote)",
      content: "Join EIPsInsight.com as a remote Full-Stack Developer to build open source Ethereum tools using Next.js, TypeScript, & MongoDB.",
      link: "/Blogs/hiring-full-stack-developer",
      tag: "Hiring"
    },
      {
      image: "/Gas Limit Cap.jpg",
      title: "Importance of Transaction Gas Limit Cap (EIP-7825)",
      content: "EIP-7825 enforces a 30 million gas cap per transaction to thwart DoS attacks, curb state bloat, & bring predictable fees and node performance.",
      link: "/Blogs/gas-limit-cap-eip-7825",
      tag: "Technical"
    },
      {
      image: "/Importance of Block Size Limit (EIP-7934).jpg",
      title: "Importance of Block Size Limit (EIP-7934)",
      content: "Learn how EIP 7934’s 10 MiB RLP block size cap enhances Ethereum’s stability & security by preventing invisible forks, resource exhaustion, & denial of service attacks.",
      link: "/Blogs/block-size-limit-eip-7934",
      tag: "Technical"
    },
  ];

  const VIDEOS = [
    "https://www.youtube.com/embed/AyidVR6X6J8?start=8",
    "https://youtu.be/sIr6XX8yR8o?si=csIwXAls_fm7Hfcx",
    "https://youtu.be/dEgBVAzY6Eg?si=1CVqeBFXepeji-Ik",
    "https://www.youtube.com/watch?v=nJ57mkttCH0",
    "https://youtu.be/V75TPvK-K_s?si=KDQI5kP4y-2-9bka",
    "https://youtu.be/fwxkbUaa92w?si=uHze3y_--2JfYMjD",
    "https://www.youtube.com/embed/YuEA-jE2Z8c",
    "https://www.youtube.com/embed/videoseries?list=PL4cwHXAawZxpnKFDl1KzGOKqwux5JaLlv",
    "https://www.youtube.com/embed/videoseries?list=PL4cwHXAawZxpok0smGmq-dFGVHQzW84a2",
  ];

  const [currentVideoPage, setCurrentVideoPage] = useState(0);
  const videosPerPage = 4;

  const paginatedVideos = VIDEOS.slice(
    currentVideoPage * videosPerPage,
    (currentVideoPage + 1) * videosPerPage
  );

  const totalVideoPages = Math?.ceil(VIDEOS?.length / videosPerPage);

  const FAQContent = () => (
    <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={8}>
      <Box
        width="100%"
        position="relative"
        overflow="hidden"
        borderRadius="xl"
        boxShadow="md"
      >
        <AspectRatio ratio={9 / 10} maxH="600px">
          <video
            autoPlay
            loop
            muted
            playsInline
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              position: "absolute",
              top: 0,
              left: 0,
            }}
          >
            <source src="/single.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </AspectRatio>
      </Box>

      <Box>
        <Image
          src="/faq_resources4.png"
          alt="FAQ Illustration"
          borderRadius="xl"
          boxShadow="md"
          mb={6}
        />
        <Heading
          size="xl" // Increased from lg to xl
          mb={8}
          display="flex"
          alignItems="center"
          gap={3}
          fontSize={{ base: "2xl", md: "3xl" }}
        >
          <Icon as={FaQuestionCircle} color={accentColor} /> Frequently Asked
          Questions
        </Heading>
        <Accordion allowToggle>
          {FAQs?.map((item, index) => (
            <AccordionItem
              key={index}
              mb={4}
              borderWidth="1px"
              borderRadius="lg"
              overflow="hidden"
            >
              <AccordionButton
                bg={cardBg}
                _hover={{ bg: useColorModeValue("gray.100", "gray.700") }}
                p={4}
              >
                <Box flex="1" textAlign="left">
                  <Heading size="md">{item?.title}</Heading>
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel
                pb={4}
                bg={useColorModeValue("gray.50", "gray.700")}
              >
                <Text mb={3}>{item?.content}</Text>
                <NextLink href={item.link} passHref legacyBehavior>
                  <Link
                    color={accentColor}
                    fontWeight="semibold"
                    display="inline-flex"
                    alignItems="center"
                  >
                    Learn more →
                  </Link>
                </NextLink>
              </AccordionPanel>
            </AccordionItem>
          ))}
        </Accordion>
      </Box>
    </Grid>
  );

  const tabContent = [
    {
      label: "FAQ",
      icon: FaQuestionCircle,
      content: <FAQContent />,
    },
    {
      label: "Blogs",
      icon: FaBlog,
      content: (
        <Box>
          {/* Recent Database Blogs Section */}
          {recentBlogs.length > 0 && (
            <Box mb={10}>
              <Heading size="lg" mb={2} display="flex" alignItems="center" gap={2}>
                <Icon as={FaBlog} color={accentColor} /> Recent Blog Posts
              </Heading>
              <Text fontSize="sm" color={textColor} mb={4}>
                Latest updates from our database
              </Text>
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                {recentBlogs.map((blog) => (
                  <Card
                    key={blog.id}
                    image={blog.image || undefined}
                    title={blog.title}
                    content={blog.summary || blog.content?.substring(0, 150) + "..." || "No description available"}
                    link={`/Blogs/${blog.slug}`}
                    tag={blog.category || "Article"}
                  />
                ))}
              </SimpleGrid>
            </Box>
          )}

          {/* Static Blog Posts Section */}
          <Box>
            <Heading size="lg" mb={2} display="flex" alignItems="center" gap={2}>
              <Icon as={FaBlog} color={accentColor} /> Featured Articles
            </Heading>
            <Text fontSize="sm" color={textColor} mb={4}>
              In-depth guides and technical deep-dives
            </Text>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
              {BLOGS?.map((item, index) => (
                <Card key={index} {...item} />
              ))}
            </SimpleGrid>
          </Box>
        </Box>
      ),
    },
    {
      label: "Videos",
      icon: FaYoutube,
      content: (
        <Box>
          <Heading size="lg" mb={6} display="flex" alignItems="center" gap={2}>
            <Icon as={FaYoutube} color={accentColor} /> Video Tutorials & Guides
          </Heading>

          <SimpleGrid
            columns={{ base: 1, sm: 2 }}
            spacing={4}
            maxW="auto" // Constrain the maximum width
            mx="auto" // Center the grid
          >
            {paginatedVideos?.map((url, index) => (
              <VideoCard key={index} url={url} />
            ))}
          </SimpleGrid>
          {totalVideoPages > 1 && (
            <Flex justify="center" mt={6}>
              <Stack direction="row" spacing={2}>
                <Button
                  onClick={() =>
                    setCurrentVideoPage((prev) => Math.max(prev - 1, 0))
                  }
                  disabled={currentVideoPage === 0}
                  size="sm"
                  colorScheme="blue"
                  variant="outline"
                >
                  Previous
                </Button>
                {Array.from({ length: totalVideoPages })?.map((_, index) => (
                  <Button
                    key={index}
                    onClick={() => setCurrentVideoPage(index)}
                    colorScheme={currentVideoPage === index ? "blue" : "gray"}
                    size="sm"
                    variant={currentVideoPage === index ? "solid" : "outline"}
                  >
                    {index + 1}
                  </Button>
                ))}
                <Button
                  onClick={() =>
                    setCurrentVideoPage((prev) =>
                      Math.min(prev + 1, totalVideoPages - 1)
                    )
                  }
                  disabled={currentVideoPage === totalVideoPages - 1}
                  size="sm"
                  colorScheme="blue"
                  variant="outline"
                >
                  Next
                </Button>
              </Stack>
            </Flex>
          )}
        </Box>
      ),
    },
    {
      label: "News",
      icon: FaNewspaper,
      content: (
        <Box>
          <Heading size="lg" mb={6} display="flex" alignItems="center" gap={2}>
            <Icon as={FaNewspaper} color={accentColor} /> News & Announcements
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
            {NEWS?.map((item, index) => (
              <Card key={index} {...item} />
            ))}
          </SimpleGrid>
        </Box>
      ),
    },
  ];

  const ToolsSection = () => (
    <Box mt={8}>
      <Heading size="lg" mb={6} display="flex" alignItems="center" gap={2}>
        <Icon as={FaTools} color={accentColor} /> Tools
      </Heading>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
        {TOOLS?.map((tool, index) => (
          <Box
            key={index}
            bg={cardBg}
            p={6}
            borderRadius="xl"
            boxShadow="md"
            transition="all 0.2s ease"
            _hover={{
              transform: "translateY(-5px)",
              boxShadow: "lg",
            }}
          >
            <Flex align="center" mb={3}>
              <Text fontSize="2xl" mr={3}>
                {tool.icon}
              </Text>
              <Heading size="md">{tool.title}</Heading>
            </Flex>
            <Text mb={4} color={textColor}>
              {tool.description}
            </Text>
            <NextLink href={tool.link} passHref legacyBehavior>
              <Link
                color={accentColor}
                fontWeight="semibold"
                display="inline-flex"
                alignItems="center"
              >
                Open Tool →
              </Link>
            </NextLink>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
  return (
    <>
      <FeedbackWidget />
      <Box minH="100vh">
        <Box maxW="7xl" mx="auto" px={8}>
          {" "}
          {/* This centers content with padding */}
          <Header
            title="Resources"
            subtitle="Learn, explore, and stay updated with Ethereum improvements"
            description="Explore FAQs, blogs, videos, news, and tools to deepen your understanding of Ethereum Improvement Proposals."
          />
        </Box>
        <Box maxW="7xl" mx="auto" px={{ base: 4, md: 8 }} py={8}>
          <Center mb={8}>
            <Tabs
              index={tabIndex}
              onChange={setTabIndex}
              variant="unstyled"
              isFitted={isMobile}
            >
              <TabList
                display="flex"
                flexWrap="wrap"
                justifyContent="center"
                gap={2}
                bg="transparent"
              >
                {tabContent?.map((tab, index) => (
                  <Tab
                    key={index}
                    onClick={() => handleSelection(tab.label)}
                    fontSize={tabSize}
                    fontWeight="semibold"
                    bg={tabBg}
                    borderWidth="1px"
                    borderColor={
                      tabIndex === index ? accentColor : tabBorderColor
                    }
                    borderRadius="lg"
                    py={3}
                    px={2}
                    flex={1}
                    mx={0.5}
                    _selected={{
                      color: "black",
                      bg: accentColor,
                      boxShadow: "md",
                    }}
                    _hover={{
                      bg: useColorModeValue("gray.100", "gray.600"),
                    }}
                    transition="all 0.2s ease"
                    minW={{ base: "auto", md: "200px" }}
                    maxW={{ md: "250px" }}
                    color={tabIndex === index ? "white" : textColor}
                  >
                    <Stack
                      direction="row"
                      align="center"
                      justify="center"
                      spacing={2}
                    >
                      <Icon as={tab.icon} />
                      {!isMobile && <Text>{tab.label}</Text>}
                    </Stack>
                  </Tab>
                ))}
              </TabList>

              <TabPanels mt={8}>
                {tabContent?.map((tab, index) => (
                  <TabPanel key={index} px={0}>
                    {tab.content}
                    <ToolsSection />
                  </TabPanel>
                ))}
              </TabPanels>
            </Tabs>
          </Center>
        </Box>
      </Box>
    </>
  );
};

export default ResourcesPage;
