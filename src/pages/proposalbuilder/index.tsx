import React, { useState, useEffect, useLayoutEffect } from "react";
import AllLayout from "@/components/Layout";
import {
  Box,
  Spinner,
  useColorModeValue,
  Wrap,
  WrapItem,
  Text,
  List,
  UnorderedList,
  ListItem,
  Heading,
  Flex,
  Image,
  SimpleGrid,
  Grid
} from "@chakra-ui/react";
import NLink from "next/link";
import EipTemplateEditor from "@/components/eiptemplate";
import { motion } from "framer-motion";
import { useScrollSpy } from "@/hooks/useScrollSpy";
import ProposalEditor from "@/components/Edtor/ProposalEditor";


const All = () => {

useScrollSpy([
  "split#eip#new#EipTemplateEditor", // optional: use a more stable ID if available in DOM
]);



  return (
    <>
      <AllLayout>
      <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
        <Box
        paddingBottom={{ lg: "10", sm: "10", base: "10" }}
        marginX={{ lg: "10", md: "2", sm: "2", base: "2" }}
        paddingX={{ lg: "10", md: "5", sm: "5", base: "5" }}
        marginTop={{ lg: "10", md: "5", sm: "5", base: "5" }}
        >
          <ProposalEditor/>
        </Box>
        </motion.div>
      </AllLayout>
    </>
  );
};

export default All;
