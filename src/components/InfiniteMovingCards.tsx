import { useEffect, useRef, useState } from "react";
import {
  Box,
  Flex,
  Text,
  Image,
  useColorModeValue,
  useBreakpointValue,
} from "@chakra-ui/react";
import "@fontsource/patrick-hand"; // Install via npm i @fontsource/patrick-hand
// Add these new imports

export const InfiniteMovingCards = ({
  items,
  direction = "left",
  speed = "fast",
  pauseOnHover = true,
}: {
  items: {
    quote: string;
    name: string;
    title: string;
    avatar: string;
    link?: string;
  }[];
  direction?: "left" | "right";
  speed?: "fast" | "normal" | "slow";
  pauseOnHover?: boolean;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [start, setStart] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const [translateX, setTranslateX] = useState(0);

  

  const animationDirection = direction === "left" ? "normal" : "reverse";
  const animationDuration =
    speed === "fast" ? "20s" : speed === "normal" ? "40s" : "80s";

  const cardWidth = useBreakpointValue({
    base: "80vw",
    sm: "60vw",
    md: "40vw",
    lg: "30vw",
  });

const bg = useColorModeValue("#fff9ec", "#121212");
const cardBg = useColorModeValue("#fff", "#1a1a1a");
const hoverBg = useColorModeValue("#ffe7b2", "#292929");
const borderColor = "#30A0E0"
const quoteColor = useColorModeValue("gray.800", "gray.100");
const titleColor = useColorModeValue("gray.600", "gray.400");

const buttonColors = {
  left: useColorModeValue("#ffefb3", "#504300"),
  leftHover: useColorModeValue("#ffe799", "#7c6402"),

  pause: useColorModeValue("#c8f7dc", "#1e3c2f"),
  pauseHover: useColorModeValue("#b3f1d0", "#2e5c48"),

  right: useColorModeValue("#d5e4ff", "#1a2d4f"),
  rightHover: useColorModeValue("#c1d6ff", "#254075"),
};

  useEffect(() => {
    if (containerRef.current && scrollerRef.current) {
      const children = Array.from(scrollerRef.current.children);
      children.forEach((child) => {
        scrollerRef.current?.appendChild(child.cloneNode(true));
      });
      setStart(true);
    }
  }, [items]);

  useEffect(() => {
  if (!isPaused) {
    const interval = setInterval(() => {
      setTranslateX((prev) => prev - 1);
    }, 40); // adjust speed here
    return () => clearInterval(interval);
  }
}, [isPaused]);

return (
  <Box
    ref={containerRef}
    position="relative"
    overflow="hidden"
    w="100%"
    py={8}
    backgroundImage="url('/paper-texture.png')"
    backgroundSize="cover"
    border={`3px solid ${borderColor}`}
    borderRadius="xl"
    backgroundColor={bg}
    pb={10}
  >
    {/* Scroller */}
    <Flex
      ref={scrollerRef}
      className="scroller"
      position="relative"
      h="100%"
      w="max-content"
      whiteSpace="nowrap"
      alignItems="center"
      fontFamily="'Patrick Hand', cursive"
      style={{
        transform: `translateX(${translateX}px)`,
        transition: isPaused ? "transform 0.3s ease" : "none",
      }}
    >
      {[...items, ...items].map((it, i) => {
        const cardContent = (
          <Box
            w={cardWidth}
            mx={4}
            p={6}
            bg={cardBg}
            border={`3px solid ${borderColor}`}
            borderRadius="xl"
            minH="220px"
            maxW="400px"
            fontFamily="'Patrick Hand', cursive"
            boxShadow={`5px 5px 0 ${borderColor}`}
            position="relative"
            transition="0.3s ease"
            transform="rotateZ(0deg)"
            _hover={{
              bg: hoverBg,
              transform: "rotateZ(-1.5deg) scale(1.03)",
              boxShadow: `7px 7px 0 ${borderColor}`,
            }}
          >
            <Box position="absolute" top={2} right={2} w="24px" h="24px" zIndex={1}>
              <svg
                width="100%"
                height="100%"
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10,90 Q50,-10 90,90"
                  stroke={borderColor}
                  strokeWidth="5"
                  fill="none"
                  strokeLinecap="round"
                />
              </svg>
            </Box>

            <Text fontSize="md" color={quoteColor} noOfLines={4} mb={4}>
              “{it.quote}”
            </Text>

            <Flex align="center" mt="auto">
              <Image
                boxSize="40px"
                src={it.avatar}
                alt={it.name}
                mr={3}
                borderRadius="full"
                border={`2px solid ${borderColor}`}
                bg="gray.100"
              />
              <Box>
                <Text fontWeight="bold" fontSize="md" color={quoteColor}>
                  {it.name}
                </Text>
                <Text fontSize="sm" color={titleColor}>
                  {it.title}
                </Text>
              </Box>
            </Flex>
          </Box>
        );

        return it.link ? (
          <a
            key={i}
            href={it.link}
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            {cardContent}
          </a>
        ) : (
          <Box key={i}>{cardContent}</Box>
        );
      })}
    </Flex>

    {/* Buttons Below */}
    <Flex justify="center" mt={10} gap={6}>
      <Box
        as="button"
        onClick={() => {
          setIsPaused(true);
          setTranslateX((prev) => prev + 300);
        }}
        px={6}
        py={3}
        border={`3px solid ${borderColor}`}
        borderRadius="xl"
        bg={buttonColors.left}
        _hover={{ bg: buttonColors.leftHover }}
        fontSize="lg"
        fontWeight={"bold"}
        boxShadow={`4px 4px 0 ${borderColor}`}
      >
        ⬅️ Left
      </Box>

      <Box
        as="button"
        onClick={() => setIsPaused((prev) => !prev)}
        px={6}
        py={3}
        border={`3px solid ${borderColor}`}
        borderRadius="xl"
        bg={buttonColors.pause}
        _hover={{ bg: buttonColors.pauseHover }}
        fontSize="lg"
        boxShadow={`4px 4px 0 ${borderColor}`}
        fontWeight={"bold"}
      >
        {isPaused ? "▶️ Resume" : "⏸️ Pause"}
      </Box>

      <Box
        as="button"
        onClick={() => {
          setIsPaused(true);
          setTranslateX((prev) => prev - 300);
        }}
        px={6}
        py={3}
        border={`3px solid ${borderColor}`}
        borderRadius="xl"
        bg={buttonColors.right}
        _hover={{ bg: buttonColors.rightHover }}
        fontSize="lg"
        fontWeight={"bold"}
        boxShadow={`4px 4px 0 ${borderColor}`}
      >
        ➡️ Right
      </Box>
    </Flex>
  </Box>
);
}