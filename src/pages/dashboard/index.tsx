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
import { mockEIP } from "../../data/eipdata";
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


const Dasboard = () => {
  const theme = useTheme();
  const isNonMediumScreens = useMediaQuery("(min-width: 1200px)");
  const data = mockEIP;
  const bg = useColorModeValue("#f6f6f7", "#171923");
  const text = useColorModeValue("white", "black");
  const router = useRouter()
  return (
    <Box className="ml-40 mr-40 pl-10 pr-10 mt-10 pb-10" paddingBottom={"10"}>
      <FlexBetween>
        <Header title="DASHBOARD" subtitle="Welcome to the dashboard" />

        <Box>
          <Button
            colorScheme="green"
            variant="outline"
            fontSize={"14px"}
            fontWeight={"bold"}
            padding={"10px 20px"}
          >
            <DownloadIcon marginEnd={"1.5"} />
            Download Reports
          </Button>
        </Box>
      </FlexBetween>

      <Box
        mt="20px"
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="160px"
        gap="20px"
      >
        
        <StatBox
          title="Core EIPs"
          value={data.filter((item) => item.category === "Core").length}
          description={"Core EIPs describe changes \nto the Ethereum protocol."}
          icon={<Icon as={Anchor} />}
          url="core"
        />

        <StatBox
          title="ERCs"
          value={data.filter((item) => item.category === "ERC").length}
          description={
            "ERCs describe application-level standards for tthe Ethereum ecosystem."
          }
          icon={<Icon as={BookOpen} />}
          url="erc"
         
        />
        <StatBox
          title="Networking EIPs"
          value={data.filter((item) => item.category === "Networking").length}
          description={
            "Networking EIPs describe changes to the Ethereum network protocol."
          }
          icon={<Icon as={Radio} />}
          url="networking"
         
        />

        <Box
          bgColor={bg}
          gridColumn="span 6"
          gridRow="span 2"
          p="1rem"
          borderRadius="0.55rem"
          _hover={{
            border: "1px",
            borderColor: "#10b981",
          }}
          className="hover: cursor-pointer ease-in duration-200"
        >
          <BarChart />
        </Box>
        <StatBox
          title="Interface EIPs"
          value={data.filter((item) => item.category === "Interface").length}
          description={
            "Interface EIPs describe changes to the Ethereum client API."
          }
          icon={<Icon as={Link} />}
          url="interface"
         
        />
        <StatBox
          title="Informational EIPs"
          value={
            data.filter((item) => item.category === "Informational").length
          }
          description={
            "Informational EIPs describe other changes to the Ethereum ecosystem."
          }
          icon={<Icon as={Clipboard} />}
          url="informational"
         
        />
        <StatBox
          title="Meta EIPs"
          value={data.filter((item) => item.category === "Meta").length}
          description={
            "Meta EIPs describe changes to the EIP process, or other non optional changes."
          }
          icon={<Icon as={Briefcase} />}
          url="meta"
         
        />
      </Box>
      <Table />
        <AreaC/>

    </Box>
  );
};

export default Dasboard;
