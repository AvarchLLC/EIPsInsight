// // import { useEffect, useRef, useState } from "react";
// // import { Box, Flex, Text, Image } from "@chakra-ui/react";

// // export const InfiniteMovingCards = ({
// //   items,
// //   direction = "left",
// //   speed = "fast",
// //   pauseOnHover = true,
// // }: {
// //   items: { quote: string; name: string; title: string }[];
// //   direction?: "left" | "right";
// //   speed?: "fast" | "normal" | "slow";
// //   pauseOnHover?: boolean;
// // }) => {
// //   const containerRef = useRef<HTMLDivElement>(null);
// //   const scrollerRef = useRef<HTMLDivElement>(null);
// //   const [start, setStart] = useState(false);

// //   useEffect(() => {
// //     if (containerRef.current && scrollerRef.current) {
// //       // Clone items for seamless looping
// //       Array.from(scrollerRef.current.children).forEach((child) => {
// //         scrollerRef.current?.appendChild(child.cloneNode(true));
// //       });

// //       setStart(true);
// //     }
// //   }, [items]);

// //   // Set CSS variables
// //   const animationDirection = direction === "left" ? "normal" : "reverse";
// //   const animationDuration =
// //     speed === "fast" ? "20s" : speed === "normal" ? "40s" : "80s";

// //   return (
// //     <Box
// //       ref={containerRef}
// //       position="relative"
// //       overflow="hidden"
// //       w="100%"
// //       h="100%"
// //       _hover={
// //         pauseOnHover ? { "& .scroller": { animationPlayState: "paused" } } : {}
// //       }
// //     >
// //       <Flex
// //         ref={scrollerRef}
// //         className="scroller"
// //         position="absolute"
// //         top={0}
// //         left={0}
// //         h="100%"
// //         w="max-content"
// //         whiteSpace="nowrap"
// //         animation={
// //           start
// //             ? `scroll ${animationDuration} linear infinite ${animationDirection}`
// //             : "none"
// //         }
// //       >
// //         {[...items, ...items].map((it, i) => (
// //           <Box
// //             key={i}
// //             minW={{ base: "90vw", md: "60vw" }}
// //             mx={4}
// //             p={{ base: 4, md: 8 }}
// //             bgGradient="linear(to-r, #04071D, #0C0E23)"
// //             borderRadius="2xl"
// //             display="inline-flex"
// //             flexDirection="column"
// //             justifyContent="space-between"
// //             h="80%"
// //           >
// //             <Text
// //               overflow="hidden"
// //               textOverflow="ellipsis"
// //               display="-webkit-box"
// //               sx={{
// //                 WebkitLineClamp: 4,
// //                 WebkitBoxOrient: "vertical",
// //               }}
// //             >
// //               {it.quote}
// //             </Text>

// //             <Flex align="center" mt={4}>
// //               <Image boxSize="40px" src="/profile.svg" alt="profile" mr={4} />
// //               <Box>
// //                 <Text fontWeight="bold">{it.name}</Text>
// //                 <Text fontSize="sm" color="gray.400">
// //                   {it.title}
// //                 </Text>
// //               </Box>
// //             </Flex>
// //           </Box>
// //         ))}
// //       </Flex>
// //     </Box>
// //   );
// // };

// import { useEffect, useRef, useState } from "react";
// import { Box, Flex, Text, Image } from "@chakra-ui/react";

// export const InfiniteMovingCards = ({
//   items,
//   direction = "left",
//   speed = "fast",
//   pauseOnHover = true,
// }: {
//   items: { quote: string; name: string; title: string }[];
//   direction?: "left" | "right";
//   speed?: "fast" | "normal" | "slow";
//   pauseOnHover?: boolean;
// }) => {
//   const containerRef = useRef<HTMLDivElement>(null);
//   const scrollerRef = useRef<HTMLDivElement>(null);
//   const [start, setStart] = useState(false);

//   useEffect(() => {
//     if (containerRef.current && scrollerRef.current) {
//       Array.from(scrollerRef.current.children).forEach((child) => {
//         scrollerRef.current?.appendChild(child.cloneNode(true));
//       });
//       setStart(true);
//     }
//   }, [items]);

//   const animationDirection = direction === "left" ? "normal" : "reverse";
//   const animationDuration =
//     speed === "fast" ? "20s" : speed === "normal" ? "40s" : "80s";

//   return (
//     <Box
//       ref={containerRef}
//       position="relative"
//       overflow="hidden"
//       w="100%"
//       h="100%"
//       _hover={
//         pauseOnHover ? { "& .scroller": { animationPlayState: "paused" } } : {}
//       }
//     >
//       <Flex
//         ref={scrollerRef}
//         className="scroller"
//         position="absolute"
//         top={0}
//         left={0}
//         h="100%"
//         w="max-content"
//         whiteSpace="nowrap"
//         animation={
//           start
//             ? `scroll ${animationDuration} linear infinite ${animationDirection}`
//             : "none"
//         }
//         alignItems="center" // Vertically center cards
//       >
//         {[...items, ...items].map((it, i) => (
//           <Box
//             key={i}
//             minW={{ base: "85vw", md: "50vw", lg: "35vw" }}
//             mx={4}
//             p={{ base: 3, md: 6 }}
//             bgGradient="linear(to-r, #04071D, #0C0E23)"
//             borderRadius="2xl"
//             display="inline-flex"
//             flexDirection="column"
//             justifyContent="space-between"
//             minH="200px" // Minimum height
//             maxH={{ base: "280px", md: "320px" }} // Responsive max height
//           >
//             <Text
//               fontSize={{ base: "sm", md: "md" }}
//               noOfLines={4} // Show max 4 lines
//               mb={4}
//             >
//               {it.quote}
//             </Text>

//             <Flex align="center" mt="auto">
//               {" "}
//               <Image
//                 boxSize={{ base: "32px", md: "40px" }}
//                 src="/profile.svg"
//                 alt="profile"
//                 mr={3}
//               />
//               <Box>
//                 <Text fontWeight="bold" fontSize={{ base: "sm", md: "md" }}>
//                   {it.name}
//                 </Text>
//                 <Text fontSize={{ base: "xs", md: "sm" }} color="gray.400">
//                   {it.title}
//                 </Text>
//               </Box>
//             </Flex>
//           </Box>
//         ))}
//       </Flex>
//     </Box>
//   );
// };
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

  const animationDirection = direction === "left" ? "normal" : "reverse";
  const animationDuration =
    speed === "fast" ? "20s" : speed === "normal" ? "40s" : "80s";

  const cardWidth = useBreakpointValue({
    base: "80vw",
    sm: "60vw",
    md: "40vw",
    lg: "30vw",
  });

  const cardBg = useColorModeValue("#fff", "#1a1a1a");
  const hoverBg = useColorModeValue("#ffe7b2", "#292929");
  const borderColor = useColorModeValue("black", "#f1f1f1");
  const quoteColor = useColorModeValue("gray.800", "gray.100");
  const titleColor = useColorModeValue("gray.600", "gray.400");

  useEffect(() => {
    if (containerRef.current && scrollerRef.current) {
      const children = Array.from(scrollerRef.current.children);
      children.forEach((child) => {
        scrollerRef.current?.appendChild(child.cloneNode(true));
      });
      setStart(true);
    }
  }, [items]);

  return (
    <Box
      ref={containerRef}
      position="relative"
      overflow="hidden"
      w="100%"
      h="100%"
      py={8}
      backgroundImage="url('/paper-texture.png')" // Add a pencil-paper texture
      backgroundSize="cover"
      _hover={
        pauseOnHover ? { "& .scroller": { animationPlayState: "paused" } } : {}
      }
    >
      <Flex
        ref={scrollerRef}
        className="scroller"
        position="absolute"
        top={0}
        left={0}
        h="100%"
        w="max-content"
        whiteSpace="nowrap"
        alignItems="center"
        animation={
          start
            ? `scroll ${animationDuration} linear infinite ${animationDirection}`
            : "none"
        }
      >
        {[...items, ...items].map((it, i) => (
          <Box
            key={i}
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
            {/* Hand-drawn SVG Corner */}
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
        ))}
      </Flex>

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </Box>
  );
};
