import FlexBetween from "@/components/FlexBetween";
import StatBox from "@/components/StatBox";
import {
  Box,
  Button,
  Heading,
  Icon,
  Text,
  useColorModeValue,
  useMediaQuery,
  useTheme,
  Link as LI
} from "@chakra-ui/react";
import React from "react";
import { mockEIP } from "@/data/eipdata";
import Header from "@/components/Header";
import { DownloadIcon } from "@chakra-ui/icons";
import BarChart from "@/components/BarChart";
import {
  Anchor,
  BookOpen,
  Radio,
  Link,
  Clipboard,
  Briefcase,
} from "react-feather";
import Table from "@/components/Table";
import AreaC from "@/components/AreaC";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import AllLayout from "@/components/Layout";
import Dashboard from "@/components/Dashboard"


const Dasboard = () => {
  const theme = useTheme();
  const isNonMediumScreens = useMediaQuery("(min-width: 1200px)");
  const data = mockEIP;
  const bg = useColorModeValue("#f6f6f7", "#171923");
  const text = useColorModeValue("white", "black");
  const router = useRouter()
  return (
    <AllLayout>
      <Dashboard/>
    </AllLayout>
  );
};

export default Dasboard;
