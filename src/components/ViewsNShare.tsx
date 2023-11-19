import React, { useEffect, useState } from "react";
import { BsFillShareFill } from "react-icons/bs";
import { Box, useColorModeValue } from "@chakra-ui/react";
import { BsTwitter } from "react-icons/bs";
import { AiFillEye } from "react-icons/ai";
import NextLink from "next/link";
import copy from "clipboard-copy";

interface ViewsShareProps {
  path: string;
}

const ViewsShare: React.FC<ViewsShareProps> = ({ path }) => {
  const shareLink = `https://eipsinsight.com${path}`;
  const handleCopyClick = () => {
    copy(shareLink)
      .then(() => {
        alert("Link copied to clipboard!");
      })
      .catch((error) => {
        console.error("Copy to clipboard failed:", error);
      });
  };

  const [viewCount, setViewCount] = useState(0);

  useEffect(() => {
    // Fetch the view count from the API route
    fetch("/api/viewCount")
      .then((response) => response.json())
      .then((data) => setViewCount(data.viewCount));
  }, []);

  const bg = useColorModeValue("#f6f6f7", "#171923");

  const twitterShareLink = `https://twitter.com/intent/tweet?url=${shareLink}`;
  return (
    <>
      <div className={"flex justify-center w-full"}>
        <Box className={"flex space-x-8 rounded-full px-8 py-4 my-3"} bg={bg}>
          <div className={"flex space-x-4"}>
            <AiFillEye size={25} />
            <span>9157</span>
          </div>
          <button onClick={handleCopyClick}>
            <div className={"hover:110 duration-200"}>
              <BsFillShareFill size={25} />
            </div>
          </button>
          <NextLink href={`${twitterShareLink}`}>
            <div className={"hover:110 duration-200"}>
              <BsTwitter size={25} />
            </div>
          </NextLink>
        </Box>
      </div>
    </>
  );
};

export default ViewsShare;
