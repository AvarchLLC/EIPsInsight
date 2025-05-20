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
  repo:string;
  __v: number;
}

interface APIResponse {
    eip: EIP[];
    erc: EIP[];
    rip: EIP[];
  }

const EIPCatBoxGrid = () => {
  const [data, setData] = useState<APIResponse>({
    eip: [],
    erc: [],
    rip: [],
  });
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/new/all`);
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
  const allData: EIP[] = data?.eip?.concat(data?.erc?.concat(data?.rip)) || [];

  const MetaCount = new Set(
    allData?.filter((item) => item.type === "Meta")?.map((item) => item.eip)
  ).size;

  const InformationalCount = new Set(
    allData?.filter((item) => item.type === "Informational")?.map((item) => item.eip)
  ).size;

  const CoreCount =
    allData?.filter(
      (item) =>
        item.type === "Standards Track" && item.category === "Core"
    ).length || 0;

  const NetworkingCount = new Set(
    allData?.filter((item) => item.category === "Networking")?.map((item) => item.eip)
  ).size;

  const InterfaceCount = new Set(
    allData?.filter((item) => item.category === "Interface")?.map((item) => item.eip)
  ).size;

  const totalCount =
    MetaCount + InformationalCount + CoreCount + NetworkingCount + InterfaceCount;


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
          allData?.filter(
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
