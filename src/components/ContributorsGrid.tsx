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
  Spacer,
  Stack,
  IconButton,
  Center,
  Tooltip,
  Divider,
} from '@chakra-ui/react';
import { FaGithub, FaTwitter, FaLinkedin } from 'react-icons/fa';

// Core contributors provided by the project maintainers (shown first)
const coreContributors = [
  {
    name: 'Pooja Ranjan',
    handle: 'poojaranjan',
    role: 'Founder',
    // local avatar if present, else GitHub avatar
    avatar: '/avatars/Pooja.jpg',
  github: 'https://github.com/poojaranjan',
  twitter: 'https://x.com/poojaranjan19',
    linkedin: 'https://www.linkedin.com/in/pooja-r-072899114/',
    bio: 'Building the Ethereum community. ECHInstitute | wiepteam | TeamAvarch | ether_world',
  },
  {
    name: 'Ayu Shetty',
    handle: 'AyuShetty',
    role: 'Outreach & Content',
    avatar: '/avatars/Ayush.jpg',
  github: 'https://github.com/AyuShetty',
  twitter: 'https://x.com/ayushettyeth',
    linkedin: 'https://www.linkedin.com/in/ayushetty',
    farcaster: 'https://farcaster.xyz/ayushshetty',
    bio: 'Product engineer — building eth.ed | TeamAvarch | Ether_World | EIPsInsight',
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
    bio: 'Breaking things (and fixing some) — Hackathon junkie, Web3 • Ethereum • Frontend',
  },
  {
    name: 'Yash Kamal Chaturvedi',
    handle: 'yashkamalchaturvedi',
    role: 'Operations',
    avatar: '/avatars/yash.jpg',
  github: 'https://github.com/yashkamalchaturvedi',
  twitter: 'https://x.com/YashKamalChatu1',
    linkedin: 'https://www.linkedin.com/in/yash-kamal-chaturvedi',
    bio: 'Operations — TeamAvarch, devops & growth',
  },
];

export default function ContributorsGrid() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selected, setSelected] = useState<any | null>(null);
  const cardBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.700", "gray.200");
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
    <Box mt={12}>
      <Heading as="h3" size="md" mb={6} textAlign="center" letterSpacing="wide" color={textColor}>
        Team
      </Heading>

      {/* Search removed as requested */}

      <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={{ base: 6, md: 8 }}>
        {itemsToRender.map((contrib: any, idx: number) => (
          <Box
            key={idx}
            bg={cardBg}
            borderRadius="16px"
            boxShadow={useColorModeValue('0 8px 30px rgba(2,6,23,0.06)', '0 10px 30px rgba(2,6,23,0.6)')}
            p={{ base: 4, md: 6 }}
            role="group"
            border={`1px solid ${glassBorder}`}
            transition="transform 220ms cubic-bezier(.2,.9,.2,1), box-shadow 220ms"
            _hover={{ transform: 'translateY(-6px)', boxShadow: useColorModeValue('0 18px 50px rgba(99,102,241,0.08)', '0 18px 50px rgba(6,8,15,0.7)') }}
          >
            <Stack direction={{ base: 'column' }} spacing={3} align="center">
              <Box textAlign="center">
                <Center>
                  <Avatar
                    src={contrib.avatar}
                    name={contrib.name}
                    size="xl"
                    cursor="pointer"
                    onClick={() => { setSelected(contrib); onOpen(); }}
                    boxShadow={`0 6px 20px rgba(99,102,241,0.12)`}
                    borderWidth="3px"
                    borderColor={useColorModeValue('white','gray.900')}
                    sx={{
                      transition: 'transform 220ms',
                    }}
                    _groupHover={{ transform: 'translateY(-4px) scale(1.02)' }}
                  />
                </Center>
                <Text mt={3} fontWeight="800" color={textColor} fontSize={{ base: 'lg', md: 'lg' }}>{contrib.name || '—'}</Text>
                <Text fontSize="sm" color={useColorModeValue('gray.500', 'gray.400')}>{contrib.role || 'Contributor'}</Text>
                {contrib.bio && (
                  <Text mt={2} fontSize="sm" color={useColorModeValue('gray.600','gray.300')} textAlign="center" maxW="xl">
                    {contrib.bio}
                  </Text>
                )}
              </Box>

              <Divider />

              <Flex w="100%" pt={1} align="center">
                <HStack spacing={2}>
                  {contrib.github && (
                    <Tooltip label="GitHub" hasArrow>
                      <IconButton
                        as="a"
                        href={contrib.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Github"
                        icon={<FaGithub />}
                        size="sm"
                        variant="ghost"
                        color={accent}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </Tooltip>
                  )}
                  {contrib.twitter && (
                    <Tooltip label="Twitter / X" hasArrow>
                      <IconButton
                        as="a"
                        href={contrib.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Twitter"
                        icon={<FaTwitter />}
                        size="sm"
                        variant="ghost"
                        color={accent}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </Tooltip>
                  )}
                  {contrib.linkedin && (
                    <Tooltip label="LinkedIn" hasArrow>
                      <IconButton
                        as="a"
                        href={contrib.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="LinkedIn"
                        icon={<FaLinkedin />}
                        size="sm"
                        variant="ghost"
                        color={accent}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </Tooltip>
                  )}
                </HStack>

                <Spacer />

                <HStack spacing={1}>
                  {contrib.farcaster && (
                    <Tooltip label="Farcaster" hasArrow>
                      <IconButton
                        as="a"
                        href={contrib.farcaster}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Farcaster"
                        icon={<Image src="/farcaster-logo.png" alt="Farcaster" boxSize="16px" />}
                        size="sm"
                        variant="ghost"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </Tooltip>
                  )}
                </HStack>
              </Flex>
            </Stack>
          </Box>
        ))}
      </SimpleGrid>

      {!loading && totalCount > visible && (
        <Box textAlign="center" mt={6}>
          <Button onClick={() => setVisible(v => v + 6)} colorScheme="blue">Load more</Button>
        </Box>
      )}

      {/* Contributor detail modal */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{selected?.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={4}>
              <Avatar src={selected?.avatar} name={selected?.name} size="2xl" />
              <Text fontWeight="bold">{selected?.role}</Text>
              <HStack spacing={4}>
                {selected?.github && (
                  <Link href={selected?.github} isExternal color={linkColor} aria-label="Selected GitHub" title="GitHub">
                    <FaGithub />
                  </Link>
                )}
                {selected?.twitter && (
                  <Link href={selected?.twitter} isExternal color={linkColor} aria-label="Selected Twitter" title="Twitter">
                    <FaTwitter />
                  </Link>
                )}
                {selected?.linkedin && (
                  <Link href={selected?.linkedin} isExternal color={linkColor} aria-label="Selected LinkedIn" title="LinkedIn">
                    <FaLinkedin />
                  </Link>
                )}
                {selected?.farcaster && (
                  <Link href={selected?.farcaster} isExternal aria-label="Selected Farcaster" title="Farcaster">
                    <Image src="/farcaster-logo.png" alt="Farcaster" boxSize="18px" objectFit="contain" />
                  </Link>
                )}
              </HStack>
              <Button onClick={onClose} colorScheme="blue">Close</Button>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}
