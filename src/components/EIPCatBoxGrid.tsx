import CatBox from "@/components/CatBox";
import { Box, Icon, Text, useColorModeValue } from "@chakra-ui/react";
import { BookOpen, Briefcase, Link, Radio } from "react-feather";
import React, { useEffect, useState } from "react";

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

const EIPCatBoxGrid = () => {
  const [data, setData] = useState<EIP[]>([]); // Set initial state as an empty array
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/new/alleips`);
        console.log(response);
        const jsonData = await response.json();
        setData(jsonData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);
  const bg = useColorModeValue("#f6f6f7", "#171923");

  const MetaCount = data.filter((item) => item.type === "Meta").length;
  const InformationalCount: any = data.filter(
    (item) => item.type === "Informational"
  ).length;
  const CoreCount = data.filter((item) => item.category === "Core").length;
  const NetworkingCount = data.filter(
    (item) => item.category === "Networking"
  ).length;
  const InterfaceCount = data.filter(
    (item) => item.category === "Interface"
  ).length;
  const totalCount = data.filter((item) => item.category !== "ERC").length;

  return (
    <>
      <Box
        display={"grid"}
        gridTemplateColumns={"repeat(4,1fr)"}
        gap={8}
        bgColor={bg}
        className={"p-4 rounded-lg mt-8"}
      >
        <CatBox
          title="Meta"
          value={MetaCount}
          icon={<Icon as={BookOpen} />}
          url="meta"
          percent={Math.round((MetaCount / totalCount) * 100)}
        />

        <CatBox
          title="Informational"
          value={InformationalCount}
          icon={<Icon as={Radio} />}
          url="informational"
          percent={Math.round((InformationalCount / totalCount) * 100)}
        />
      </Box>

      <Text fontSize="3xl" fontWeight="bold" color="#30A0E0" paddingY={8}>
        Standards Track -{" "}
        {
          data.filter(
            (item) => item.type === "Standards Track" && item.category !== "ERC"
          ).length
        }
      </Text>

      <Box
        display={"grid"}
        gridTemplateColumns={{ md: "repeat(6,1fr)", base: "repeat(4,1fr)" }}
        gap={8}
        bgColor={bg}
        className={"p-4 rounded-lg"}
      >
        <CatBox
          title="Core"
          value={CoreCount}
          icon={<Icon as={Link} />}
          url="core"
          percent={Math.round((CoreCount / totalCount) * 100)}
        />
        <CatBox
          title="Networking"
          value={NetworkingCount}
          icon={<Icon as={Briefcase} />}
          url="networking"
          percent={Math.round((NetworkingCount / totalCount) * 100)}
        />
        <CatBox
          title="Interface"
          value={InterfaceCount}
          icon={<Icon as={BookOpen} />}
          url="interface"
          percent={Math.round((InterfaceCount / totalCount) * 100)}
        />
      </Box>
    </>
  );
};

export default EIPCatBoxGrid;
