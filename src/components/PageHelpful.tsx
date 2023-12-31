import React, { useState } from "react";
import { Box, useColorModeValue, Text } from "@chakra-ui/react";

interface PageHelpfulProps {
  pageName: string;
}

const PageHelpful: React.FC<PageHelpfulProps> = ({ pageName }) => {
  const bg = useColorModeValue("#f6f6f7", "#171923");
  const border = useColorModeValue("#000000", "#ffffff");
  const [likeCount, setLikeCount] = useState(0);
  const [show, setShow] = useState(true);

  const handleLikeClick = async () => {
    try {
      const response = await fetch("/api/count/like", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pageName: "home", // Provide the page name or identifier
        }),
      });

      if (response.ok) {
        const likeData = await response.json();
        setLikeCount(likeData.likeCount);
        setShow(false);
      } else {
        console.error("Failed to like the page.");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  return (
    <>
      <Box
        bgColor={bg}
        className={show ? "rounded-lg" : "hidden"}
        border={"1px"}
        borderColor={border}
      >
        <div className={"px-20 my-4"}>
          <Text className={"font-bold text-2xl"}>Was this page helpful?</Text>

          <div className={"flex justify-between w-full"}>
            <button
              className={`px-8 py-2 border-[2px] border-[${border}] rounded-lg font-bold`}
              onClick={handleLikeClick}
            >
              Yes
            </button>
            <button
              className={`px-8 py-2 border-[2px] border-[${border}] rounded-lg font-bold`}
              onClick={() => setShow(false)}
            >
              No
            </button>
          </div>
        </div>
        <Text className={"text-center text-xl pb-2"}>
          {likeCount} visitors found this page helpful
        </Text>
      </Box>
    </>
  );
};

export default PageHelpful;
