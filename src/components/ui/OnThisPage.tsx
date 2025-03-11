import { Box, Heading, List, ListItem, Link } from "@chakra-ui/react";
import React, { useState, useEffect } from "react";

const OnThisPage = () => {
  const [headings, setHeadings] = useState<{ id: string; text: string }[]>([]);

  useEffect(() => {
    const contentSection = document.querySelector("#title");
    if (!contentSection) return;

    const headingElements = Array.from(contentSection.querySelectorAll("h2, h3"));

    const newHeadings = headingElements.map((heading) => {
      const text = heading.textContent?.trim() || "";
      const id = text.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
      heading.setAttribute("id", id);
      return { id, text };
    });

    setHeadings(newHeadings);
  }, []);

  return (
    <Box
      as="aside"
      p={4}
      bg="gray.100"
      borderRadius="lg"
      position="fixed"
      right="20px"
      top="80px"
      width="250px"
      maxHeight="80vh"
      overflowY="auto"
      boxShadow="md"
      zIndex="10"
      display={{ base: "none", lg: "block" }} // Hide on mobile
    >
      <Heading as="h3" size="md" mb={2}>
        On this page
      </Heading>
      <List spacing={2}>
        {headings.map(({ id, text }) => (
          <ListItem key={id}>
            <Link href={`#${id}`} color="blue.600" _hover={{ textDecoration: "underline" }}>
              {text}
            </Link>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default OnThisPage;
