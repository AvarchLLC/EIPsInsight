import React, { useEffect, useRef } from "react";
import Header from "./Header";
import { Box, useColorModeValue, Text } from "@chakra-ui/react";
import Image from "next/image";
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

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

      <Box className="grid grid-cols-1 md:grid-cols-3 gap-x-8">
  <Box
    className="flex flex-col p-6 col-span-3 space-y-6"
    bg={bg}
    borderRadius={"0.55rem"}
  >
    <Text className="text-4xl text-blue-400 font-semibold text-left">
      What is EIPsInsight?
    </Text>
    <Text className="text-xl text-left text-justify">
      EIPsInsight is specialized in toolings designed to provide clear, visual insights into the activity of 
      <a href="https://github.com/ethereum/EIPs" className="underline" target="_blank" style={{ color: "lightblue" }}> Ethereum Improvement Proposal (EIP)</a>, 
      <a href="https://github.com/ethereum/ERCs" className="underline" target="_blank" style={{ color: "lightblue" }}> Ethereum Request for Comments (ERCs)</a>, and 
      <a href="https://github.com/ethereum/RIPs" className="underline" target="_blank" style={{ color: "lightblue" }}> Rollup Improvement Proposals (RIPs)</a> over a specified period. 
      Data provided is used for tracking the progress and workload distribution among EIP Editors, ensuring transparency and efficiency in the proposal review process.
    </Text>

    <Text className="text-xl text-left text-justify">
      EIPsInsight is a tooling platform dedicated to providing in-depth analysis, up-to-date information, and comprehensive insights on Ethereum Standards. Our mission is to empower editors, developers, stakeholders, and the broader Ethereum community with the knowledge and tools necessary to understand and engage with the ongoing evolution of the Ethereum Standards. 
    </Text>

    {/* Carousel for blogs */}
    <Box className="mt-6">
  <Text className="text-4xl text-blue-400 font-semibold text-left mb-4">
    Featured Blogs
  </Text>
  <Box className="w-3/4 mx-auto"> {/* Width set to 75% of the screen */}
  <Carousel showThumbs={false} autoPlay infiniteLoop>
  <a
    href="https://etherworld.co/2021/10/06/an-overview-of-account-abstraction-in-ethereum-blockchain/"
    target="_blank"
  >
    <Image
      src="/resources1.jpg"
      alt="Blog 1"
      layout="responsive"
      width={100}
      height={50}
    />
  </a>
  <a
    href="https://etherworld.co/2023/07/16/new-ethereum-proposal-to-cap-the-growth-of-active-validators/"
    target="_blank"
  >
    <Image
      src="/resources2.jpg"
      alt="Blog 2"
      layout="responsive"
      width={100}
      height={50}
    />
  </a>
  <a
    href="https://etherworld.co/2023/07/11/ethereums-dencun-upgrade-moving-towards-devnet-8/"
    target="_blank"
  >
    <Image
      src="/resources3.jpg"
      alt="Blog 3"
      layout="responsive"
      width={100}
      height={50}
    />
  </a>
  <a
    href="https://etherworld.co/2024/01/25/eip-7516-blobbasefee-opcode/"
    target="_blank"
  >
    <Image
      src="/resources7.png" // Replace with the appropriate image source
      alt="Blog 7"
      layout="responsive"
      width={100}
      height={50}
    />
  </a>
  <a
    href="https://etherworld.co/2024/01/09/eip-7045/"
    target="_blank"
  >
    <Image
      src="/resources9.jpg" // Replace with the appropriate image source
      alt="Blog 9"
      layout="responsive"
      width={100}
      height={50}
    />
  </a>
  <a
    href="https://etherworld.co/2024/01/08/eip-1153-and-transient-storage/"
    target="_blank"
  >
    <Image
      src="/resources10.png" // Replace with the appropriate image source
      alt="Blog 10"
      layout="responsive"
      width={100}
      height={50}
    />
  </a>
  <a
    href="https://etherworld.co/2023/11/15/eip-5656-mcopy-an-efficient-evm-instruction/"
    target="_blank"
  >
    <Image
      src="/resources12.png" // Replace with the appropriate image source
      alt="Blog 10"
      layout="responsive"
      width={100}
      height={50}
    />
  </a>
  {/* <a
    href="https://etherworld.co/2023/11/13/eip-4844-explored-the-future-of-shard-blob-transactions-in-ethereum/"
    target="_blank"
  >
    <Image
      src="/resources13.jpg" // Replace with the appropriate image source
      alt="Blog 10"
      layout="responsive"
      width={100}
      height={50}
    />
  </a> */}
  <a
    href="https://etherworld.co/2023/01/06/eip-721-non-fungible-token-standard/"
    target="_blank"
  >
    <Image
      src="/resources14.png" // Replace with the appropriate image source
      alt="Blog 10"
      layout="responsive"
      width={100}
      height={50}
    />
  </a>
  <a
    href="https://etherworld.co/2022/12/13/transient-storage-for-beginners/"
    target="_blank"
  >
    <Image
      src="/resources15.jpg" // Replace with the appropriate image source
      alt="Blog 10"
      layout="responsive"
      width={100}
      height={50}
    />
  </a>
 
</Carousel>

  </Box>
</Box>


    <Text className="text-4xl font-semibold text-blue-400 text-left mt-10">
      Key Features:
    </Text>
    <ul className="list-disc list-inside space-y-2 text-xl text-left text-justify">
      <li>
        <strong>Monthly Insight:</strong> Follow the status change of proposals under different types and categories with beautiful charts and tables providing details.
      </li>
      <li>
        <strong>Toolings:</strong> Make use of different toolings such as "Editor Review Tracker" and "Issues and PRs Trackers" which will provide the proposals added, reviewed and moved to various statuses by EIP Editors. These will be helpful for tracking the progress and workload distribution among EIP Editors, ensuring transparency and efficiency in the proposal review process.
      </li>
      <li>
        <strong>Detailed EIP Database:</strong> Explore our extensive database of EIPs, complete with detailed descriptions, statuses, and relevant discussions. Whether you're looking for historical proposals or the latest advancements, our database is your go-to resource.
      </li>
      <li>
        <strong>Expert Analysis:</strong> Gain access to expert commentary and analysis on significant EIPs, their potential impacts, and the broader implications for the Ethereum ecosystem. Our team of experienced analysts and contributors ensure you have the most accurate and relevant insights.
      </li>
      <li>
        <strong>Community Engagement:</strong> Join the conversation with our vibrant community of Ethereum enthusiasts, developers, and stakeholders. Participate in forums, provide feedback on proposals, and stay connected with the latest developments in the Ethereum space.
      </li>
      <li>
        <strong>Educational Resources:</strong> New to EIPs? Our educational resources are designed to help you understand the proposal process, the technical details, and the importance of various EIPs. From beginners to seasoned developers, there's something for everyone.
      </li>
      <li>
        <strong>Regular Updates:</strong> Stay informed with our regular updates and newsletters. Get the latest news, changes, and discussions surrounding EIPs delivered straight to your inbox.
      </li>
    </ul>

    <Text className="text-xl text-left mt-6 text-justify">
      At EIPsInsight, we believe in the power of open-source collaboration and the continuous improvement of the Ethereum network.  
      <a href="https://x.com/TeamAvarch" className="underline" target="_blank" style={{ color: "lightblue" }}>Join us</a> in exploring the future of Ethereum, one proposal at a time.
    </Text>
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
