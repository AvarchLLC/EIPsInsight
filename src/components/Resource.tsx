import React, { useEffect, useRef } from "react";
import Header from "./Header";
import { Box, useColorModeValue, Text } from "@chakra-ui/react";
import Image from "next/image";

const cards = [
  {
    image: "/1.png",
    href: "https://youtu.be/sIr6XX8yR8o?si=csIwXAls_fm7Hfcx",
  },
  {
    image: "/2.png",
    href: "https://youtu.be/dEgBVAzY6Eg?si=1CVqeBFXepeji-Ik",
  },
  {
    image: "/3.png",
    href: "https://youtu.be/dEgBVAzY6Eg?s3=1CVqeBFXepeji-Ik",
  },
  {
    image: "/4.png",
    href: "https://youtu.be/V75TPvK-K_s?si=KDQI5kP4y-2-9bka",
  },
  {
    image: "/5.jpg",
    href: "https://youtu.be/fwxkbUaa92w?si=uHze3y_--2JfYMjD",
  },
  {
    image: "/6.jpg",
    href: "https://youtu.be/AyidVR6X6J8?si=ON9pLB9NNr7M-ruW",
  },
];

const Resource = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const handleScroll = (event: React.WheelEvent) => {
    const container = containerRef.current;

    if (container) {
      container.scrollLeft += event.deltaY * 10000; // Adjust the factor as needed
    }
  };

  const bg = useColorModeValue("#f6f6f7", "#171923");

  return (
    <Box
      paddingBottom={{ lg: "10", sm: "10", base: "10" }}
      marginX={{ lg: "40", md: "2", sm: "2", base: "2" }}
      paddingX={{ lg: "10", md: "5", sm: "5", base: "5" }}
      marginTop={{ lg: "10", md: "5", sm: "5", base: "5" }}
      className="flex flex-col space-x-6"
    >
      <Header title="Resources" subtitle="" />

      <Box className="grid grid-cols-3 gap-x-8">
        <Box
          className="flex flex-col p-6 col-span-2 space-y-6"
          bg={bg}
          borderRadius={"0.55rem"}
        >
          <Text className="text-4xl text-blue-400 font-semibold">
            What is Ethereum Improvement Proposal?
          </Text>
          <Text className="text-xl">
            EIP stands for Ethereum Improvement Proposal. An EIP is a design
            document providing information to the Ethereum community, or
            describing a new feature for Ethereum or its processes or
            environment. The EIP should provide a concise technical
            specification of the feature and a rationale for the feature. The
            EIP author is responsible for building consensus within the
            community and documenting dissenting opinions.
          </Text>

          <Text className="text-4xl font-semibold text-blue-400">
            Useful Links
          </Text>
          <div className="flex flex-col space-y-2">
            <a
              href="https://github.com/ethereum/eips"
              className="text-xl underline underline-offset-2"
              target="_blank"
            >
              EIPs Github
            </a>

            <a
              href="https://github.com/ethereum/ercs"
              className="text-xl underline underline-offset-2"
              target="_blank"
            >
              ERCs Github
            </a>

            <a
              href="https://github.com/ethereum/rips"
              className="text-xl underline underline-offset-2"
              target="_blank"
            >
              RIPs Github
            </a>
          </div>
        </Box>

        <Box bg={bg} className="p-6 h-[26rem]" borderRadius={"0.55rem"}>
          <Text className="text-4xl text-blue-400 font-semibold">
            Relavant Blogs
          </Text>
          <Box className="flex flex-col gap-y-5 pt-56 justify-center items-center overflow-y-scroll h-[22rem] ">
            <a
              href="https://etherworld.co/2021/10/06/an-overview-of-account-abstraction-in-ethereum-blockchain/"
              target="_blank"
            >
              <Image src="/resources1.jpg" alt="R1" width={300} height={100} />
            </a>

            <a
              href="https://etherworld.co/2023/07/16/new-ethereum-proposal-to-cap-the-growth-of-active-validators/"
              target="_blank"
            >
              <Image src="/resources2.jpg" alt="R1" width={300} height={100} />
            </a>

            <a
              href="https://etherworld.co/2023/07/11/ethereums-dencun-upgrade-moving-towards-devnet-8/"
              target="_blank"
            >
              <Image src="/resources3.jpg" alt="R1" width={300} height={100} />
            </a>
          </Box>
        </Box>
      </Box>

      <Box className="flex w-full justify-center items-center">
        <Box className="flex flex-col">
          <Text className="text-4xl py-6 text-blue-400 font-bold">
            Featured Videos
          </Text>
          <Box
            ref={containerRef}
            className="flex overflow-x-auto py-4 px-6 h-[20rem]"
            onWheel={handleScroll}
            style={{ scrollBehavior: "smooth", overflow: "hidden" }}
            bg={bg}
            borderRadius={"0.55rem"}
          >
            {cards.map((item, index) => (
              <a
                href={item.href}
                target="_blank"
                key={index}
                className="flex-shrink-0 mr-4"
              >
                <Image src={item.image} height={500} width={500} alt="Blah" />
              </a>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Resource;
