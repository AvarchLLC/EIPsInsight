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
import { Box, Flex, Text, Image, useColorModeValue } from "@chakra-ui/react";

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
    link?: string; // if you added a clickable URL
  }[];
  direction?: "left" | "right";
  speed?: "fast" | "normal" | "slow";
  pauseOnHover?: boolean;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [start, setStart] = useState(false);

  // 🌗 Dynamic theming
  const cardBg = useColorModeValue("#F7FAFC", "#1A202C");
  const textColor = useColorModeValue("#2D3748", "#F5F5F5");

  useEffect(() => {
    if (containerRef.current && scrollerRef.current) {
      Array.from(scrollerRef.current.children).forEach((child) => {
        scrollerRef.current?.appendChild(child.cloneNode(true));
      });
      setStart(true);
    }
  }, [items]);

  const animationDirection = direction === "left" ? "normal" : "reverse";
  const animationDuration =
    speed === "fast" ? "20s" : speed === "normal" ? "40s" : "80s";

  return (
    <Box
      ref={containerRef}
      position="relative"
      overflow="hidden"
      w="100%"
      h="100%"
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
        animation={
          start
            ? `scroll ${animationDuration} linear infinite ${animationDirection}`
            : "none"
        }
        alignItems="center"
      >
        {[...items, ...items].map((it, i) => (
          <Box
            key={i}
            minW={{ base: "85vw", md: "50vw", lg: "35vw" }}
            mx={4}
            p={{ base: 3, md: 6 }}
            bg={cardBg}
            color={textColor}
            borderRadius="2xl"
            display="inline-flex"
            flexDirection="column"
            justifyContent="space-between"
            minH="200px"
            maxH={{ base: "280px", md: "320px" }}
            shadow="lg"
          >
            <Text
              fontSize={{ base: "sm", md: "md" }}
              noOfLines={4}
              mb={4}
            >
              {it.quote}
            </Text>

            <Flex align="center" mt="auto">
              <Image
                boxSize={{ base: "32px", md: "40px" }}
                src={it.avatar}
                alt={it.name}
                mr={3}
                borderRadius="full"
              />

              <Box>
                <Text fontWeight="bold" fontSize={{ base: "sm", md: "md" }}>
                  {it.name}
                </Text>
                <Text fontSize={{ base: "xs", md: "sm" }} color="gray.500">
                  {it.title}
                </Text>
              </Box>
            </Flex>
          </Box>
        ))}
      </Flex>
    </Box>
  );
};
