import React, { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  SimpleGrid,
  Avatar,
  Text,
  VStack,
  Link,
  useColorModeValue,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  HStack,
  Image,
  Flex,
  Stack,
  IconButton,
  Badge,
  Icon,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FaGithub, FaTwitter, FaLinkedin, FaUsers } from 'react-icons/fa';

const MotionBox = motion(Box);

// Core contributors provided by the project maintainers (shown first)
const coreContributors = [
  {
    name: 'Pooja Ranjan',
    handle: 'poojaranjan',
    role: 'Founder',
    avatar: '/avatars/Pooja.jpg',
    github: 'https://github.com/poojaranjan',
    twitter: 'https://x.com/poojaranjan19',
    linkedin: 'https://www.linkedin.com/in/pooja-r-072899114/',
    farcaster: 'https://farcaster.xyz/poojaranjan19',
    bio: 'Building Ethereum community | ECH Institute | EtherWorld | EIPsInsight | Herder-in-Chief',
    duration: 'Jun 2022 - Present · 3+ yrs',
    expertise: ['Data Analytics', 'Governance', 'Community'],
    highlights: [
      'Built the first comprehensive EIP tracking platform',
      'Provides insights on proposal statuses & governance trends',
      'Serves developers, researchers & Ethereum community'
    ]
  },
    {
    name: 'Yash Kamal Chaturvedi',
    handle: 'yashkamalchaturvedi',
    role: 'Operations Lead',
    avatar: '/avatars/yash.jpg',
    github: 'https://github.com/yashkamalchaturvedi',
    twitter: 'https://x.com/YashKamalChatu1',
    linkedin: 'https://www.linkedin.com/in/yash-kamal-chaturvedi',
    bio: 'Making things work when they shouldn\'t — Operations at Avarch | Growth & DevOps | Coffee enthusiast',
    duration: 'Dec 2024 - Present · 1+ yr',
    expertise: ['Operations', 'Growth', 'B2B Lead Gen'],
    highlights: [
      'Manages operational workflows and team coordination',
      'Drives growth through strategic outreach initiatives',
      'Handles technical content and social media presence'
    ]
  },
  {
    name: 'Dhanush Naik',
    handle: 'dhanushlnaik',
    role: 'Full Stack Engineer',
    avatar: '/avatars/Dhanush.jpg',
    github: 'https://github.com/dhanushlnaik',
    twitter: 'https://x.com/iamdhanushlnaik',
    linkedin: 'https://www.linkedin.com/in/dhanushlnaik/',
    farcaster: 'https://farcaster.xyz/dhanushlnaik',
    bio: 'Breaking things (and actually fixing them) — Full-stack wizard behind EIPsInsight | Hackathon addict',
    duration: 'Nov 2023 - Present · 2+ yrs',
    expertise: ['Next.js', 'MongoDB', 'Full-Stack'],
    highlights: [
      'Developed frontend & backend with Next.js, Node.js, MongoDB',
      'Implemented custom scheduler for GitHub EIP data extraction',
      'Rebuilt platform with modern glassmorphism UI design'
    ]
  },
  {
    name: 'Ayush Shetty',
    handle: 'AyuShetty',
    role: 'Product Engineer',
    avatar: '/avatars/Ayush.jpg',
    github: 'https://github.com/AyuShetty',
    twitter: 'https://x.com/ayushettyeth',
    linkedin: 'https://www.linkedin.com/in/ayushetty',
    farcaster: 'https://farcaster.xyz/ayushshetty',
    bio: 'Product engineer — building eth.ed | TeamAvarch | EtherWorld | EIPsInsight',
    duration: 'Mar 2023 - Present · 2+ yrs',
    expertise: ['Product Design', 'Marketing', 'Web3'],
    highlights: [
      'Manages product engineering and development workflow',
      'Drives community engagement and outreach initiatives',
      'Collaborates on UX improvements and feature planning'
    ]
  }
];

export default function ContributorsGrid() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selected, setSelected] = useState<any | null>(null);
  const cardBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.700", "gray.200");
  const headingColor = useColorModeValue("gray.900", "white");
  const linkColor = useColorModeValue("blue.500", "blue.300");
  const socialBg = useColorModeValue('purple.50', 'purple.700');
  const socialColor = useColorModeValue('purple.700', 'white');
  const socialBorder = useColorModeValue('purple.400', 'purple.300');
  const accent = useColorModeValue('#6B46C1', '#9F7AEA');
  const glassBorder = useColorModeValue('rgba(16,24,40,0.06)', 'rgba(255,255,255,0.04)');

  const [contributorsList, setContributorsList] = useState<any[]>([]);
  const [query, setQuery] = useState('');
  const [visible, setVisible] = useState(6);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetch('/api/allcontributors')
      .then((r) => r.ok ? r.json() : Promise.reject(r))
      .then((data) => {
        if (!mounted) return;
        // support different response shapes
        const list = Array.isArray(data) ? data : (data?.contributors || []);
        setContributorsList(list);
      })
      .catch((err) => {
        console.error('Failed to fetch contributors', err);
      })
      .finally(() => { if (mounted) setLoading(false); });

    return () => { mounted = false; };
  }, []);

  // prepare items to render and total count (filter out empty records)
  const computeItems = () => {
    // Merge core contributors first, then the fetched list, dedupe by name/twitter/github
    const merged = [...coreContributors, ...(contributorsList || [])];
    const deduped = merged.filter((v, i, arr) => {
      const key = ((v.github || v.twitter || v.name) || '').toString().toLowerCase();
      return arr.findIndex(x => (((x.github || x.twitter || x.name) || '').toString().toLowerCase()) === key) === i;
    });

    const filtered = deduped.filter((c: any) => {
      const q = query.toLowerCase();
      return (c.name || '').toLowerCase().includes(q) || ((c.github || c.twitter || '') + '').toLowerCase().includes(q);
    })
    // drop truly empty records (no name and no socials and no avatar and no bio)
    .filter((c: any) => {
      if (!c) return false;
      return !!(c.name || c.github || c.twitter || c.linkedin || c.farcaster || c.avatar || c.bio);
    });

    const total = filtered.length;
    const items = filtered.slice(0, visible);
    return { items, total };
  };

  const { items: itemsToRender, total: totalCount } = loading
    ? { items: Array.from({ length: 6 }, (_, i) => ({ placeholder: true, id: i })), total: 0 }
    : computeItems();

  return (
    <Box
      bg={cardBg}
      p={{ base: 6, md: 8 }}
      borderRadius="xl"
      borderWidth="1px"
      borderColor={useColorModeValue('gray.200', 'gray.700')}
      boxShadow={useColorModeValue('md', 'lg')}
      position="relative"
      overflow="hidden"
    >
      <Box
        position="absolute"
        top="-20px"
        right="-20px"
        opacity={0.05}
        transform="rotate(-15deg)"
      >
        <Icon as={FaUsers} boxSize="200px" />
      </Box>
      
      <HStack spacing={3} mb={6} position="relative">
        <Icon as={FaUsers} boxSize={8} color={accent} />
        <Heading 
          as="h2" 
          fontSize={{ base: "2xl", md: "3xl" }} 
          textAlign="left" 
          fontWeight="700" 
          color={headingColor}
        >
          Our Team
        </Heading>
      </HStack>

      <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={6}>
        {itemsToRender.map((contrib: any, idx: number) => (
          <MotionBox
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05, duration: 0.3 }}
            whileHover={{ y: -8, scale: 1.02 }}
            bg={useColorModeValue('white', 'gray.700')}
            borderRadius="xl"
            boxShadow={useColorModeValue('md', 'lg')}
            p={6}
            role="group"
            borderWidth="1px"
            borderColor={useColorModeValue('gray.200', 'gray.600')}
            position="relative"
            overflow="hidden"
            cursor="pointer"
            _hover={{ 
              boxShadow: useColorModeValue('xl', '2xl'), 
              borderColor: accent,
            }}
          >
            <Box
              position="absolute"
              top="0"
              left="0"
              w="full"
              h="2px"
              bg={accent}
              transform="scaleX(0)"
              transformOrigin="left"
              transition="transform 0.3s ease"
              _groupHover={{ transform: 'scaleX(1)' }}
            />
            <VStack spacing={3} align="stretch" w="full">
              <VStack spacing={3}>
                <Box position="relative">
                  <Avatar
                    src={contrib.avatar}
                    name={contrib.name}
                    size="2xl"
                    cursor="pointer"
                    onClick={() => { setSelected(contrib); onOpen(); }}
                    borderWidth="3px"
                    borderColor={accent}
                    transition="all 0.3s ease"
                    _groupHover={{ 
                      transform: 'scale(1.1) rotate(5deg)',
                      boxShadow: `0 10px 30px ${accent}40`
                    }}
                  />
                  <Box
                    position="absolute"
                    bottom="0"
                    right="0"
                    bg={accent}
                    borderRadius="full"
                    p={1}
                  >
                    <Badge 
                      colorScheme="green" 
                      variant="solid" 
                      fontSize="0.6em"
                      borderRadius="full"
                    >
                      Active
                    </Badge>
                  </Box>
                </Box>
                
                <VStack spacing={1}>
                  <Text 
                    fontWeight="800" 
                    color={textColor} 
                    fontSize="lg" 
                    textAlign="center"
                    letterSpacing="tight"
                  >
                    {contrib.name || '—'}
                  </Text>
                  {contrib.role && (
                    <Badge 
                      colorScheme="purple" 
                      variant="subtle"
                      fontSize="xs"
                      px={3}
                      py={1}
                      borderRadius="full"
                    >
                      {contrib.role}
                    </Badge>
                  )}
                  {contrib.duration && (
                    <Text 
                      fontSize="2xs" 
                      color={useColorModeValue('gray.500', 'gray.400')}
                      fontWeight="500"
                    >
                      {contrib.duration}
                    </Text>
                  )}
                </VStack>
              </VStack>

              {contrib.bio && (
                <Text 
                  fontSize="xs" 
                  color={textColor}
                  textAlign="center"
                  lineHeight="short"
                  noOfLines={3}
                  px={2}
                >
                  {contrib.bio}
                </Text>
              )}

              {contrib.expertise && (
                <HStack spacing={1} justify="center" flexWrap="wrap">
                  {contrib.expertise.map((skill : string) => (
                    <Badge 
                      key={skill}
                      size="sm"
                      colorScheme="blue"
                      variant="outline"
                      fontSize="2xs"
                    >
                      {skill}
                    </Badge>
                  ))}
                </HStack>
              )}

              <HStack spacing={3} pt={2} justify="center">
                {contrib.github && (
                  <IconButton
                    as="a"
                    href={contrib.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Github"
                    icon={<FaGithub />}
                    size="sm"
                    variant="ghost"
                    colorScheme="purple"
                    onClick={(e) => e.stopPropagation()}
                    transition="all 0.2s"
                    _hover={{ transform: 'translateY(-2px)' }}
                  />
                )}
                {contrib.twitter && (
                  <IconButton
                    as="a"
                    href={contrib.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Twitter"
                    icon={<FaTwitter />}
                    size="sm"
                    variant="ghost"
                    colorScheme="purple"
                    onClick={(e) => e.stopPropagation()}
                    transition="all 0.2s"
                    _hover={{ transform: 'translateY(-2px)' }}
                  />
                )}
                {contrib.linkedin && (
                  <IconButton
                    as="a"
                    href={contrib.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn"
                    icon={<FaLinkedin />}
                    size="sm"
                    variant="ghost"
                    colorScheme="purple"
                    onClick={(e) => e.stopPropagation()}
                    transition="all 0.2s"
                    _hover={{ transform: 'translateY(-2px)' }}
                  />
                )}
                {contrib.farcaster && (
                  <IconButton
                    as="a"
                    href={contrib.farcaster}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Farcaster"
                    icon={<Image src="/farcaster-logo.png" alt="Farcaster" boxSize="16px" />}
                    size="sm"
                    variant="ghost"
                    colorScheme="purple"
                    onClick={(e) => e.stopPropagation()}
                    transition="all 0.2s"
                    _hover={{ transform: 'translateY(-2px)' }}
                  />
                )}
              </HStack>
            </VStack>
          </MotionBox>
        ))}
      </SimpleGrid>

      {!loading && totalCount > visible && (
        <Box textAlign="center" mt={8}>
          <Button 
            onClick={() => setVisible(v => v + 6)} 
            size="md" 
            colorScheme="purple"
            variant="outline"
            _hover={{ transform: 'scale(1.05)' }}
            transition="all 0.2s"
          >
            Load More Team Members
          </Button>
        </Box>
      )}

      {/* Contributor detail modal */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered size="xl">
        <ModalOverlay backdropFilter="blur(10px)" />
        <ModalContent bg={cardBg} borderRadius="2xl">
          <ModalHeader>
            <VStack spacing={2} align="start">
              <Text fontSize="2xl" fontWeight="800" color={headingColor}>
                {selected?.name}
              </Text>
              {selected?.role && (
                <Badge colorScheme="purple" fontSize="sm" px={3} py={1}>
                  {selected?.role}
                </Badge>
              )}
            </VStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={6} align="stretch">
              <HStack spacing={6}>
                <Avatar 
                  src={selected?.avatar} 
                  name={selected?.name} 
                  size="2xl"
                  borderWidth="3px"
                  borderColor={accent}
                />
                <VStack align="start" flex={1} spacing={2}>
                  {selected?.duration && (
                    <Text fontSize="sm" color={useColorModeValue('gray.600', 'gray.400')}>
                      {selected?.duration}
                    </Text>
                  )}
                  {selected?.bio && (
                    <Text fontSize="sm" color={textColor} lineHeight="tall">
                      {selected?.bio}
                    </Text>
                  )}
                </VStack>
              </HStack>

              {selected?.expertise && (
                <VStack align="start" spacing={2}>
                  <Text fontSize="sm" fontWeight="700" color={headingColor}>
                    Expertise
                  </Text>
                  <HStack spacing={2} flexWrap="wrap">
                    {selected?.expertise.map((skill : string) => (
                      <Badge key={skill} colorScheme="blue" variant="subtle">
                        {skill}
                      </Badge>
                    ))}
                  </HStack>
                </VStack>
              )}

              {selected?.highlights && selected.highlights.length > 0 && (
                <VStack align="start" spacing={3}>
                  <Text fontSize="sm" fontWeight="700" color={headingColor}>
                    Key Contributions
                  </Text>
                  <VStack align="start" spacing={2} pl={2}>
                    {selected.highlights.map((highlight: string, idx: number) => (
                      <HStack key={idx} align="start" spacing={2}>
                        <Text color={accent} fontSize="lg">•</Text>
                        <Text fontSize="sm" color={textColor}>
                          {highlight}
                        </Text>
                      </HStack>
                    ))}
                  </VStack>
                </VStack>
              )}

              <HStack spacing={4} justify="center" pt={4}>
                {selected?.github && (
                  <IconButton
                    as="a"
                    href={selected?.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="GitHub"
                    icon={<FaGithub />}
                    colorScheme="purple"
                    variant="ghost"
                    size="lg"
                  />
                )}
                {selected?.twitter && (
                  <IconButton
                    as="a"
                    href={selected?.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Twitter"
                    icon={<FaTwitter />}
                    colorScheme="purple"
                    variant="ghost"
                    size="lg"
                  />
                )}
                {selected?.linkedin && (
                  <IconButton
                    as="a"
                    href={selected?.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn"
                    icon={<FaLinkedin />}
                    colorScheme="purple"
                    variant="ghost"
                    size="lg"
                  />
                )}
                {selected?.farcaster && (
                  <IconButton
                    as="a"
                    href={selected?.farcaster}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Farcaster"
                    icon={<Image src="/farcaster-logo.png" alt="Farcaster" boxSize="20px" />}
                    colorScheme="purple"
                    variant="ghost"
                    size="lg"
                  />
                )}
              </HStack>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}
