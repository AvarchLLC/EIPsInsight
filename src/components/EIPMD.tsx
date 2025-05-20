"use client";
import React, { useEffect, useRef, useState, WheelEventHandler } from "react";
import { usePathname } from "next/navigation";
import { Box, useColorModeValue } from "@chakra-ui/react";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import Header from "@/components/Header";
import { motion } from "framer-motion";
import LoaderComponent from "./Loader";

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

export default function EIPMD() {
  let number = "";
  let cat = "";
  const path = usePathname();
  const pathArray = path?.split("/") || [];
  number = pathArray[1]?.split("-")[1] || "1";
  cat = pathArray[1]?.split("-")[0] || "eip";
  const [content, setContent] = useState("");
  const [data, setData] = useState<EIP>();
  const [repo, setRepo] = useState("eip");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      if (cat === "erc") {
        const res = await fetch(`/api/new/erccontent/${number}`);
        const resData = await res.json();
        setContent(resData._doc.content);
        setRepo(resData.repo);
      } else if (cat === "rip") {
        const res = await fetch(`/api/new/ripcontent/${number}`);
        const resData = await res.json();
        setContent(resData._doc.content);
        setRepo(resData.repo);
      } else {
        const res = await fetch(`/api/new/eipcontent/${number}`);
        const resData = await res.json();
        setContent(resData._doc.content);
        setRepo(resData.repo);
      }
    };
    const fetchEIP = async () => {
      if (cat === "erc") {
        const res = await fetch(`/api/ercs/${number}`);
        const resData = await res.json();
        setData(resData._doc);
        setIsLoading(false);
      } else if (cat === "rip") {
        const res = await fetch(`/api/rips/${number}`);
        const resData = await res.json();
        setData(resData._doc);
        setIsLoading(false);
      } else {
        const res = await fetch(`/api/eips/${number}`);
        const resData = await res.json();
        setData(resData._doc);
        setIsLoading(false);
      }
    };
    fetchContent();
    fetchEIP();
  }, [number]);

  const bg = useColorModeValue("#f6f6f7", "#171923");
  const createdDate = new Date(data?.created || "") || "";
  const deadlineDate = new Date(data?.deadline || "") || "";
  const [currentIndex, setCurrentIndex] = useState(0);
  const authorRef = useRef<HTMLDivElement | null>(null);
  const authors = data?.author.split(",") || [];
  // @ts-ignore
  const handleScroll = (event: WheelEvent<HTMLDivElement>) => {
    const delta = Math.sign(event.deltaY);
    setCurrentIndex(
      (prevIndex) => (prevIndex + delta + authors?.length) % authors?.length
    );
  };

  return isLoading ? (
    <>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Your loader component */}
          <LoaderComponent />
        </motion.div>
      </Box>
    </>
  ) : (
    <>
      <Box
        paddingBottom={{ lg: "10", sm: "10", base: "10" }}
        marginX={{ lg: "40", md: "2", sm: "2", base: "2" }}
        paddingX={{ lg: "10", md: "5", sm: "5", base: "5" }}
        marginTop={{ lg: "10", md: "5", sm: "5", base: "5" }}
      >
        <Header
          title={`${repo.toUpperCase()} - ${data?.eip}`}
          subtitle={data?.title || ""}
        />
        <Box className="grid grid-cols-2 pt-8">
          <Box
            bg={bg}
            rounded={"0.55rem"}
            paddingX={8}
            paddingY={4}
            className={"overflow-y-auto max-h-[50rem]"}
          >
            <ReactMarkdown
              children={content || ""}
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
              components={{
                h2: ({ node, ...props }) => (
                  <h2
                    style={{
                      fontSize: "2.5rem",
                      fontWeight: "bold",
                      color: `#339af0`,
                      // borderBottom: `2px solid #339af0`,

                      display: "inline-block",
                    }}
                    className="my-3 px-2 rounded-sm"
                    {...props}
                  />
                ),
                h1: ({ node, ...props }) => (
                  <h2
                    style={{
                      fontSize: "3rem",
                      fontWeight: "bold",
                      color: `#339af0`,
                      display: "inline-block",
                    }}
                    className="my-3 px-2 rounded-sm"
                    {...props}
                  />
                ),
                h3: ({ node, ...props }) => (
                  <h2
                    style={{
                      fontSize: "2rem",
                      fontWeight: "bold",
                      color: `#339af0`,
                      display: "inline-block",
                    }}
                    className="my-3 px-2 rounded-sm"
                  >
                    {props.children}
                  </h2>
                ),
                p: ({ node, ...props }) => (
                  <p
                    style={{
                      fontSize: "1.2rem",
                      display: "inline-block",
                    }}
                    className="my-3 px-2 rounded-sm"
                  >
                    {props.children}
                  </p>
                ),
              }}
            />
          </Box>

          <div className="flex flex-col space-y-8 w-full items-center">
            <Box className="mx-auto" onWheel={handleScroll}>
              <div
                ref={authorRef}
                className="w-full h-80 overflow-y-auto border p-2 rounded-lg shadow-md"
              >
                {authors?.map((author, index) => (
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

            <div>
              {data?.type !== "Meta" && data?.type !== "Living" ? (
                <div className="flex gap-5">
                  <Box
                    bg={bg}
                    className={
                      "px-8 py-4 rounded-xl border-[2px] border-white w-[20rem]"
                    }
                  >
                    <h2 className="text-lg font-semibold text-center">
                      {data?.type}
                    </h2>
                  </Box>
                  <Box
                    bg={bg}
                    className={
                      "px-8 py-4 rounded-xl border-[2px] border-white w-[20rem]"
                    }
                  >
                    <h2 className="text-lg font-semibold text-center">
                      {data?.category}
                    </h2>
                  </Box>
                </div>
              ) : null}
            </div>

            <div className="flex gap-5">
              <Box
                bg={getStatusColor(data?.status || "")}
                className={`px-8 py-4 rounded-xl border-[2px] border-white w-[20rem]`}
              >
                <h2 className="text-lg font-semibold text-center">
                  {data?.status}
                </h2>
              </Box>

              {data?.status !== "Last Call" && (
                <Box
                  bg={bg}
                  className={
                    "px-8 py-4 rounded-xl border-[2px] border-white w-[20rem]"
                  }
                >
                  <h2 className="text-lg font-semibold text-center flex justify-center w-full space-x-4">
                    <p>Created:</p>
                    <p>
                      {createdDate.getDate()}-{getMonth(createdDate.getMonth())}
                      -{createdDate.getFullYear()}
                    </p>
                  </h2>
                </Box>
              )}

              {data?.status === "Last Call" && (
                <Box
                  bg={bg}
                  className={
                    "px-8 py-4 rounded-xl border-[2px] border-white w-[20rem]"
                  }
                >
                  <h2 className="text-lg font-semibold text-center flex justify-center w-full space-x-4">
                    <p>Created:</p>
                    <p>
                      {deadlineDate.getDate()}-
                      {getMonth(deadlineDate.getMonth())}-
                      {deadlineDate.getFullYear()}
                    </p>
                  </h2>
                </Box>
              )}
            </div>

            <div>
              {data?.discussion && (
                <Box
                  bg={bg}
                  className={
                    "px-8 py-4 rounded-xl border-[2px] border-white w-[20rem]"
                  }
                >
                  <a href={data?.discussion} target="_blank">
                    <h2 className="text-lg font-semibold text-center">
                      Discussion Link
                    </h2>
                  </a>
                </Box>
              )}
            </div>
          </div>
        </Box>
      </Box>
    </>
  );
}



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

const getStatusColor = (status: string) => {
  switch (status) {
    case "Living":
      return "blue";
    case "Final":
      return "blue";
    case "Stagnant":
      return "purple";
    case "Draft":
      return "orange";
    case "Withdrawn":
      return "red";
    case "Last Call":
      return "yellow";
    default:
      return "gray";
  }
};