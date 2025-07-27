import { Box, Button, Heading, Text, useColorModeValue, VStack } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const MotionPath = motion.path;
const MotionBox = motion(Box);

export default function NotFoundPage() {
  const textColor = useColorModeValue('gray.800', 'white');
  const bgGradient = useColorModeValue('linear(to-r, purple.300, pink.400)', 'linear(to-r, purple.400, pink.600)');

  return (
    <Box position="relative" minH="100vh" bg={useColorModeValue('white', 'black')} overflow="hidden">
      {/* Animated SVG Background */}
      <Box position="absolute" inset="0" display="flex" justifyContent="center" alignItems="center" overflow="hidden">
        <svg
          className="blur-3xl"
          width="1000"
          height="1000"
          viewBox="0 0 1000 1000"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ position: 'absolute', opacity: 0.3, filter: 'blur(64px)' }}
        >
          <MotionPath
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 3, ease: 'easeInOut', repeat: Infinity, repeatType: 'reverse' }}
            d="M321.5,255.5Q325,461,525,420Q725,379,720,580Q715,781,512.5,776Q310,771,245,621Q180,471,216.5,363.5Q253,256,321.5,255.5Z"
            fill="url(#grad)"
          />
          <defs>
            <radialGradient id="grad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#A855F7" />
              <stop offset="100%" stopColor="#6B21A8" />
            </radialGradient>
          </defs>
        </svg>
      </Box>

      {/* Page Content */}
      <VStack
        position="relative"
        zIndex="1"
        spacing={6}
        textAlign="center"
        justify="center"
        align="center"
        px={4}
        py={24}
      >
        <Heading
          as="h1"
          fontSize={['6xl', '9xl']}
          fontWeight="extrabold"
          bgGradient={bgGradient}
          bgClip="text"
        >
          404
        </Heading>
        <Text fontSize={['md', 'xl']} color={textColor}>
          Oops! The page you're looking for doesn't exist.
        </Text>
        <MotionBox
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <Link href="/" passHref>
            <Button
              as="a"
              colorScheme="purple"
              size="lg"
              px={6}
              borderRadius="full"
              bg="purple.600"
              _hover={{ bg: 'purple.700' }}
              shadow="lg"
              backdropFilter="blur(8px)"
              border="1px solid rgba(255, 255, 255, 0.2)"
            >
              Go Home
            </Button>
          </Link>
        </MotionBox>
      </VStack>
    </Box>
  );
}
