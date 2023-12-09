import AllLayout from "@/components/Layout";
import React, { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import {
  Badge,
  Box,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  Wrap,
  WrapItem,
  useColorModeValue,
} from "@chakra-ui/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { motion } from "framer-motion";
import Prog from "@/components/Prog";

interface EIP {
  _id: string;
  eip: string;
  title: string;
  author: string;
  status: string;
  type: string;
  category: string;
  created: string;
  discussion: string;
  deadline: string;
  requires: string;
  unique_ID: number;
  __v: number;
}

const getStatus = (status: string) => {
  switch (status) {
    case "Draft":
      return "Draft";
    case "Final" || "Accepted" || "Superseded":
      return "Final";
    case "Last Call":
      return "Last Call";
    case "Withdrawn" || "Abandoned" || "Rejected":
      return "Withdrawn";
    case "Review":
      return "Review";
    case "Living" || "Active":
      return "Living";
    case "Stagnant":
      return "Stagnant";
    default:
      return "Final";
  }
};

interface ContentData {
  content: string;
}

const EIPMD = () => {
  const [con, setcon] = useState<ContentData | undefined>(undefined);

  const pathname = usePathname();
  const pathnameParts = pathname ? pathname.split("/") : [];
  const part = pathnameParts[1] || "";
  const number = part.split("-")[1];
  const cat = part.split("-")[0];
  const [data, setData] = useState<EIP | null>(null); // Set initial state as null

  const bg = useColorModeValue("#f6f6f7", "#171923");

  const fetchContent = async () => {
    try {
      if (cat === "erc") {
        const response = await fetch(`/api/new/erccontent/${number}`);
        const jsonD = await response.json();
        setcon(jsonD);
      } else {
        const response = await fetch(`/api/new/eipcontent/${number}`);
        const jsonD = await response.json();
        setcon(jsonD);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (cat === "erc") {
          const response = await fetch(`/api/ercs/${number}`);
          const jsonData = await response.json();
          console.log(jsonData);
          setData(jsonData);
        } else {
          const response = await fetch(`/api/eips/${number}`);
          const jsonData = await response.json();
          setData(jsonData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
    fetchContent();
  }, [number]); // Add thirdPart as a dependency to re-fetch data when it changes
  const [currentIndex, setCurrentIndex] = useState(0);
  const authorRef = useRef<HTMLDivElement | null>(null);
  const authors = data?.author.split(",") || [];
  // @ts-ignore
  const handleScroll = (event: WheelEvent<HTMLDivElement>) => {
    const delta = Math.sign(event.deltaY);
    setCurrentIndex(
      (prevIndex) => (prevIndex + delta + authors.length) % authors.length
    );
  };

  const date = new Date(data?.created || "") || "";

  function getStatusColor(status: string) {
    switch (status) {
      case "Draft":
        return "#eab308";
      case "Final" || "Accepted" || "Superseded":
        return "#3b82f6";
      case "Last Call":
        return "#22c55e";
      case "Withdrawn" || "Abandoned" || "Rejected":
        return "#ef4444";
      case "Review":
        return "#eab308";
      case "Living" || "Active":
        return "#171923";
      case "Stagnant":
        return "#ef4444";
      default:
        return "#171923";
    }
  }

  return (
    <>
      <Box
        paddingBottom={{ lg: "10", sm: "10", base: "10" }}
        marginX={{ lg: "40", md: "2", sm: "2", base: "2" }}
        paddingX={{ lg: "10", md: "5", sm: "5", base: "5" }}
        marginTop={{ lg: "10", md: "5", sm: "5", base: "5" }}
      >
        <Box paddingBottom={8}>
          <Header
            title={`${data?.category === "ERC" ? "ERC" : "EIP"} - ${data?.eip}`}
            subtitle={`${data?.title}`}
          />
        </Box>

        <Box display={"grid"} gridTemplateColumns={"1fr 1fr"} gap={10}>
          <Box
            bg={bg}
            rounded={"0.55rem"}
            paddingX={8}
            paddingY={4}
            className={"overflow-y-auto max-h-[50rem]"}
          >
            <ReactMarkdown
              children={con?.content || ""}
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
              components={{
                h2: ({ node, ...props }) => (
                  <h2
                    style={{
                      fontSize: "17px",
                      fontWeight: "bold",
                      color: `#339af0`,
                      // borderBottom: `2px solid #339af0`,
                      borderLeft: `4px solid #339af0`,
                      display: "inline-block",
                    }}
                    className="my-3 px-2 rounded-sm"
                    {...props}
                  />
                ),
                h1: ({ node, ...props }) => (
                  <h2
                    style={{
                      fontSize: "22px",
                      fontWeight: "bold",
                      color: `#339af0`,
                      borderBottom: `2px solid #339af0`,
                      borderLeft: `4px solid #339af0`,
                      display: "inline-block",
                    }}
                    className="my-3 px-2 rounded-sm"
                    {...props}
                  />
                ),
                h3: ({ node, ...props }) => (
                  <h2
                    style={{
                      fontSize: "17px",
                      fontWeight: "bold",
                      color: `#339af0`,
                      // borderBottom: `2px solid #339af0`,
                      borderLeft: `4px solid #339af0`,
                      display: "inline-block",
                    }}
                    className="my-3 px-2 rounded-sm"
                  >
                    {props.children}
                  </h2>
                ),
              }}
            />
          </Box>

          <Box display={"grid"} gridTemplateColumns={"1fr 1fr"} gap={10}>
            <Box className={"space-y-6"}>
              <Box
                bg={bg}
                className={"px-8 py-4 rounded-xl border-[2px] border-white"}
              >
                <h2 className="text-lg font-semibold text-center">
                  {data?.type}
                </h2>
              </Box>
              <Box
                bg={bg}
                className={"px-8 py-4 rounded-xl border-[2px] border-white"}
              >
                <h2 className="text-lg font-semibold text-center">
                  {data?.category}
                </h2>
              </Box>
              <Box
                bg={bg}
                className={"px-8 py-4 rounded-xl border-[2px] border-white"}
              >
                <h2 className="text-lg font-semibold text-center flex justify-center w-full space-x-4">
                  <p>Created:</p>
                  <p>
                    {date.getDate()}-{getMonth(date.getMonth())}-
                    {date.getFullYear()}
                  </p>
                </h2>
              </Box>
              <Box
                bg={getStatusColor(data?.status || "")}
                className={`px-8 py-4 rounded-xl border-[2px] border-white`}
              >
                <h2 className="text-lg font-semibold text-center">
                  {data?.status}
                </h2>
              </Box>
            </Box>

            <Box className="mx-auto" onWheel={handleScroll}>
              <div
                ref={authorRef}
                className="w-80 h-80 overflow-y-auto border p-2 rounded-lg shadow-md"
              >
                {authors.map((author, index) => (
                  <div
                    key={index}
                    className="py-2 transform transition-transform"
                    style={{
                      transform: `translateY(${(index - currentIndex) * 16}px)`, // Adjust the spacing as needed
                    }}
                  >
                    <div className="p-2 rounded-lg h-80 flex justify-center items-center ">
                      <h2 className="text-lg font-semibold">{author}</h2>
                    </div>
                  </div>
                ))}
              </div>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};

function getMonth(month: number) {
  switch (month) {
    case 0:
      return "January";
    case 1:
      return "February";
    case 2:
      return "March";
    case 3:
      return "April";
    case 4:
      return "May";
    case 5:
      return "June";
    case 6:
      return "July";
    case 7:
      return "August";
    case 8:
      return "September";
    case 9:
      return "October";
    case 10:
      return "November";
    case 11:
      return "December";
  }
}
export default EIPMD;
