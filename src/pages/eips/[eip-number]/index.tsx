"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import AllLayout from "@/components/Layout";
import NLink from "next/link";
import { motion } from "framer-motion";
import React from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import SearchBox from "@/components/SearchBox";
import {
  Container,
  Box,
  Table,
  Thead,
  Tr,
  Th,
  Td,
  Link,
  HStack,
  Switch,
  Flex,
  Text,
  VStack,
  Spinner,
  IconButton,
  Heading,
  Button,
  useColorModeValue,
  Popover,
  PopoverTrigger,
  PopoverArrow,
  PopoverContent,
  PopoverHeader,
  PopoverCloseButton,
  PopoverBody
} from "@chakra-ui/react";
import { Markdown } from "@/components/MarkdownEIP";
import Header from "@/components/Header2";
import LoaderComponent from "@/components/Loader";
import { InfoOutlineIcon } from "@chakra-ui/icons";
import { EipAiSummary } from "@/components/EipAiSummary";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  TooltipProps,
} from "recharts";
import { ValueType, NameType } from "recharts/types/component/DefaultTooltipContent";

interface EipMetadataJson {
  eip: number;
  title: string;
  description: string;
  author: string[];
  "discussions-to": string;
  "last-call-deadline": string;
  status: string;
  type: string;
  category: string;
  created: string;
  requires: number[];
}

type Props = {
  eipNo: string;
  eipContent: string;
  metadataJson: any;
};
type EipData = {
  content: string;
  title: string;
  status: string;
  // add other fields as needed
};



const TestComponent = () => {
  const path = usePathname();
  const pathArray = path?.split("/") || [];
  const eipNo = extracteipno(pathArray);
  const [markdownFileURL, setMarkdownFileURL] = useState<string>("");
  const [metadataJson, setMetadataJson] = useState<EipMetadataJson>();
  const [markdown, setMarkdown] = useState<string>("");
  const [Repo, setRepo] = useState("");
  const [data, setData] = useState<{ status: string; date: string }[]>([]);
  const [data2, setData2] = useState<{ type: string; date: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDataNotFound, setIsDataNotFound] = useState(false);
  const [show, setShow] = useState(false); // State to toggle visibility
  const toggleCollapse = () => setShow(!show);
  const [show2, setShow2] = useState(false); // State to toggle visibility
  const toggleCollapse2 = () => setShow2(!show2);
  const [eipData, setEipData] = useState<EipData | null>(null);
  const [isChartView, setIsChartView] = useState(false);



  const networkUpgrades: Record<string, number[]> = {
    Homestead: [2, 7, 8],
    "Spurious Dragon": [155, 160, 161, 170],
    "Tangerine Whistle": [150],
    Byzantium: [100, 140, 196, 197, 198, 211, 214, 649, 658],
    Petersburg: [145, 1014, 1052, 1234, 1283],
    Istanbul: [152, 1108, 1344, 1844, 2028, 2200],
    "Muir Glacier": [2384],
    Dencun: [1153, 4788, 4844, 5656, 6780, 7044, 7045, 7514, 7516],
    Pectra: [7691, 7623, 7840, 7702, 7685, 7549, 7251, 7002, 6110, 2935, 2537, 7642],
    Berlin: [2565, 2929, 2718, 2930],
    London: [1559, 3198, 3529, 3541, 3554],
    "Arrow Glacier": [4345],
    "Gray Glacier": [5133],
    Paris: [3675, 4399],
    Shapella: [3651, 3855, 3860, 4895, 6049],
  };

interface UpgradeEntry {
  date: string;
  included: readonly string[];
  scheduled: readonly string[];
  declined: readonly string[];
  considered: readonly string[];
}

const getInclusionStage = (eipIdentifier: string): string => {
  // Normalize the EIP identifier
  const normalizedEip = eipIdentifier.startsWith('EIP-') 
    ? eipIdentifier 
    : `EIP-${eipIdentifier}`;

  // Improved status checker that properly checks all arrays
  const getStatus = (data: UpgradeEntry, eip: string): string | null => {
    if (data.included.includes(eip)) return 'Included';
    if (data.scheduled.includes(eip)) return 'SFI';
    if (data.considered.includes(eip)) return 'CFI';
    if (data.declined.includes(eip)) return 'DFI';
    return null;
  };

  // Get latest entries (using proper date sorting)
  const latestPectra = [...PectraData2].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  )[0];
  
  const latestFusaka = [...FusakaData].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  )[0];

  // Check all possible statuses
  const statuses: string[] = [];
  
  // Check Pectra status
  if (latestPectra.declined.includes(normalizedEip)) {
    statuses.push('Pectra-DFI');
  } else if (latestPectra.included.includes(normalizedEip)) {
    statuses.push('Pectra-Included');
  } else if (latestPectra.scheduled.includes(normalizedEip)) {
    statuses.push('Pectra-SFI');
  } else if (latestPectra.considered.includes(normalizedEip)) {
    statuses.push('Pectra-CFI');
  }

  // Check Fusaka status
  if (latestFusaka.declined.includes(normalizedEip)) {
    statuses.push('Fusaka-DFI');
  } else if (latestFusaka.included.includes(normalizedEip)) {
    statuses.push('Fusaka-Included');
  } else if (latestFusaka.scheduled.includes(normalizedEip)) {
    statuses.push('Fusaka-SFI');
  } else if (latestFusaka.considered.includes(normalizedEip)) {
    statuses.push('Fusaka-CFI');
  }

  console.log("statuses: ", statuses);

  return statuses.length > 0 
    ? statuses.join(', ') 
    : 'Not in upgrade consideration';
};


  const PectraData: readonly UpgradeEntry[] = [
    { date: '2024-03-21', included: [], scheduled: ['EIP-2537', 'EIP-6110', 'EIP-7002', 'EIP-7251', 'EIP-7549'], declined: [], considered: ['EIP-7547'] },
    { date: '2024-04-11', included: [], scheduled: ['EIP-2537', 'EIP-2935', 'EIP-3074', 'EIP-6110', 'EIP-7002', 'EIP-7251', 'EIP-7549'], declined: [], considered: ['EIP-663', 'EIP-3540', 'EIP-3670', 'EIP-4200', 'EIP-4750', 'EIP-5450', 'EIP-6206', 'EIP-7069', 'EIP-7480', 'EIP-7547', 'EIP-7620', 'EIP-7623'] },
    { date: '2024-04-26', included: [], scheduled: ['EIP-2537', 'EIP-2935', 'EIP-3074', 'EIP-6110', 'EIP-7002', 'EIP-7251', 'EIP-7549', 'EIP-7685'], declined: [], considered: ['EIP-663', 'EIP-3540', 'EIP-3670', 'EIP-4200', 'EIP-4750', 'EIP-5450', 'EIP-6206', 'EIP-7069', 'EIP-7212', 'EIP-7480', 'EIP-7547', 'EIP-7620', 'EIP-7623'] },
    { date: '2024-05-09', included: [], scheduled: ['EIP-2537', 'EIP-2935', 'EIP-3074', 'EIP-6110', 'EIP-7002', 'EIP-7251', 'EIP-7549', 'EIP-7685'], declined: [], considered: ['EIP-663', 'EIP-3540', 'EIP-3670', 'EIP-4200', 'EIP-4750', 'EIP-5450', 'EIP-6206', 'EIP-7069', 'EIP-7212', 'EIP-7480', 'EIP-7547', 'EIP-7620', 'EIP-7623', 'EIP-7692', 'EIP-7698'] },
    { date: '2024-05-29', included: [], scheduled: ['EIP-2537', 'EIP-2935', 'EIP-6110', 'EIP-7002', 'EIP-7251', 'EIP-7549', 'EIP-7685'], declined: [], considered: ['EIP-663', 'EIP-3540', 'EIP-3670', 'EIP-4200', 'EIP-4750', 'EIP-5450', 'EIP-6206', 'EIP-7069', 'EIP-7212', 'EIP-7480', 'EIP-7547', 'EIP-7620', 'EIP-7623', 'EIP-7692', 'EIP-7698', 'EIP-7702'] },
    { date: '2024-06-10', included: [], scheduled: ['EIP-663', 'EIP-2537', 'EIP-2935', 'EIP-3540', 'EIP-3670', 'EIP-4200', 'EIP-4750', 'EIP-5450', 'EIP-6110', 'EIP-6206', 'EIP-7002', 'EIP-7069', 'EIP-7251', 'EIP-7480', 'EIP-7549', 'EIP-7620', 'EIP-7685', 'EIP-7692', 'EIP-7698', 'EIP-7702'], declined: [], considered: ['EIP-7212', 'EIP-7547', 'EIP-7623'] },
    { date: '2024-06-17', included: [], scheduled: ['EIP-663', 'EIP-2537', 'EIP-2935', 'EIP-3540', 'EIP-3670', 'EIP-4200', 'EIP-4750', 'EIP-5450', 'EIP-6110', 'EIP-6206', 'EIP-7002', 'EIP-7069', 'EIP-7251', 'EIP-7480', 'EIP-7549', 'EIP-7594', 'EIP-7620', 'EIP-7685', 'EIP-7692', 'EIP-7698', 'EIP-7702'], declined: [], considered: ['EIP-7212', 'EIP-7547', 'EIP-7623'] },
    { date: '2024-08-21', included: [], scheduled: ['EIP-663', 'EIP-2537', 'EIP-2935', 'EIP-3540', 'EIP-3670', 'EIP-4200', 'EIP-4750', 'EIP-5450', 'EIP-6110', 'EIP-6206', 'EIP-7002', 'EIP-7069', 'EIP-7251', 'EIP-7480', 'EIP-7549', 'EIP-7594', 'EIP-7620', 'EIP-7685', 'EIP-7692', 'EIP-7698', 'EIP-7702'], declined: [], considered: ['EIP-7547', 'EIP-7623'] },
    { date: '2024-10-16', included: [], scheduled: ['EIP-2537', 'EIP-2935', 'EIP-6110', 'EIP-7002', 'EIP-7251', 'EIP-7549', 'EIP-7685', 'EIP-7702'], declined: [], considered: ['EIP-7623', 'EIP-7742', 'EIP-7762'] },
    { date: '2024-10-24', included: [], scheduled: ['EIP-2537', 'EIP-2935', 'EIP-6110', 'EIP-7002', 'EIP-7251', 'EIP-7549', 'EIP-7685', 'EIP-7702', 'EIP-7742'], declined: [], considered: ['EIP-7623', 'EIP-7762'] },
    { date: '2024-12-18', included: [], scheduled: ['EIP-2537', 'EIP-2935', 'EIP-6110', 'EIP-7002', 'EIP-7251', 'EIP-7549', 'EIP-7623', 'EIP-7685', 'EIP-7691', 'EIP-7702'], declined: [], considered: [] },
    { date: '2025-04-14', included: [], scheduled: ['EIP-2537', 'EIP-2935', 'EIP-6110', 'EIP-7002', 'EIP-7251', 'EIP-7549', 'EIP-7623', 'EIP-7685', 'EIP-7691', 'EIP-7702', 'EIP-7840'], declined: [], considered: [] },
    { date: '2025-05-06', included: [], scheduled: ['EIP-2537', 'EIP-2935', 'EIP-6110', 'EIP-7002', 'EIP-7251', 'EIP-7549', 'EIP-7623', 'EIP-7642', 'EIP-7685', 'EIP-7691', 'EIP-7702', 'EIP-7840'], declined: [], considered: [] },
  ] as const;

  const processedData = PectraData.map((entry, index, arr) => {
    const allPrevEIPs = new Set<string>();
    for (let i = 0; i < index; i++) {
      arr[i].scheduled.forEach((eip) => allPrevEIPs.add(eip));
      arr[i].considered.forEach((eip) => allPrevEIPs.add(eip));
    }

    const currentEIPs = new Set([
      ...entry.scheduled,
      ...entry.considered,
    ]);

    const declined = [...allPrevEIPs].filter((eip) => !currentEIPs.has(eip));

    return {
      ...entry,
      declined,
    };
  });

  const PectraData2 : readonly UpgradeEntry[] = processedData;

  const FusakaData: readonly UpgradeEntry[] = [
    { date: '2024-02-15', included: [], scheduled: [], declined: [], considered: ['EIP-4762', 'EIP-6800', 'EIP-6873', 'EIP-7545'] },
    { date: '2024-08-30', included: [], scheduled: [], declined: [], considered: ['EIP-4762', 'EIP-6800', 'EIP-6873', 'EIP-7545', 'EIP-7667'] },
    { date: '2025-03-27', included: [], scheduled: ['EIP-663', 'EIP-3540', 'EIP-3670', 'EIP-4200', 'EIP-4750', 'EIP-5450', 'EIP-6206', 'EIP-7069', 'EIP-7480', 'EIP-7594', 'EIP-7620', 'EIP-7692', 'EIP-7698', 'EIP-7873'], declined: [], considered: ['EIP-5920', 'EIP-7692', 'EIP-7761', 'EIP-7834', 'EIP-7880', 'EIP-7883'] },
    { date: '2025-03-27', included: [], scheduled: ['EIP-663', 'EIP-3540', 'EIP-3670', 'EIP-4200', 'EIP-4750', 'EIP-5450', 'EIP-6206', 'EIP-7069', 'EIP-7480', 'EIP-7594', 'EIP-7620', 'EIP-7692', 'EIP-7698'], declined: [], considered: [] },
    { date: '2025-04-14', included: [], scheduled: ['EIP-663', 'EIP-3540', 'EIP-3670', 'EIP-4200', 'EIP-4750', 'EIP-5450', 'EIP-6206', 'EIP-7069', 'EIP-7480', 'EIP-7594', 'EIP-7620', 'EIP-7642', 'EIP-7692', 'EIP-7698', 'EIP-7873'], declined: ['EIP-7666', 'EIP-7668', 'EIP-7783', 'EIP-7791', 'EIP-7793', 'EIP-7805', 'EIP-7819', 'EIP-7843', 'EIP-7889', 'EIP-7903', 'EIP-7919'], considered: ['EIP-5920', 'EIP-7692', 'EIP-7761', 'EIP-7762', 'EIP-7823', 'EIP-7825', 'EIP-7834', 'EIP-7880', 'EIP-7883', 'EIP-7892', 'EIP-7907', 'EIP-7918'] },
    { date: '2025-04-19', included: [], scheduled: ['EIP-663', 'EIP-3540', 'EIP-3670', 'EIP-4200', 'EIP-4750', 'EIP-5450', 'EIP-6206', 'EIP-7069', 'EIP-7480', 'EIP-7594', 'EIP-7620', 'EIP-7642', 'EIP-7692', 'EIP-7698', 'EIP-7873', 'EIP-7892'], declined: ['EIP-7666', 'EIP-7668', 'EIP-7688', 'EIP-7732', 'EIP-7783', 'EIP-7791', 'EIP-7793', 'EIP-7805', 'EIP-7819', 'EIP-7843', 'EIP-7889', 'EIP-7898', 'EIP-7903', 'EIP-7919'], considered: ['EIP-5920', 'EIP-7692', 'EIP-7761', 'EIP-7762', 'EIP-7823', 'EIP-7825', 'EIP-7834', 'EIP-7880', 'EIP-7883', 'EIP-7907', 'EIP-7917', 'EIP-7918'] },
    { date: '2025-04-28', included: [], scheduled: ['EIP-7594', 'EIP-7642', 'EIP-7892'], declined: ['EIP-663', 'EIP-3540', 'EIP-3670', 'EIP-4200', 'EIP-4750', 'EIP-5450', 'EIP-6206', 'EIP-7069', 'EIP-7480', 'EIP-7620', 'EIP-7666', 'EIP-7668', 'EIP-7688', 'EIP-7692', 'EIP-7698', 'EIP-7732', 'EIP-7761', 'EIP-7783', 'EIP-7791', 'EIP-7793', 'EIP-7805', 'EIP-7819', 'EIP-7834', 'EIP-7843', 'EIP-7873', 'EIP-7880', 'EIP-7889', 'EIP-7898', 'EIP-7903', 'EIP-7919'], considered: ['EIP-5920', 'EIP-7762', 'EIP-7823', 'EIP-7825', 'EIP-7883', 'EIP-7907', 'EIP-7917', 'EIP-7918'] },
    { date: '2025-05-05', included: [], scheduled: ['EIP-7594', 'EIP-7642', 'EIP-7892'], declined: ['EIP-663', 'EIP-3540', 'EIP-3670', 'EIP-4200', 'EIP-4750', 'EIP-5450', 'EIP-6206', 'EIP-7069', 'EIP-7480', 'EIP-7620', 'EIP-7666', 'EIP-7668', 'EIP-7688', 'EIP-7692', 'EIP-7698', 'EIP-7732', 'EIP-7761', 'EIP-7783', 'EIP-7791', 'EIP-7793', 'EIP-7805', 'EIP-7819', 'EIP-7834', 'EIP-7843', 'EIP-7873', 'EIP-7880', 'EIP-7889', 'EIP-7898', 'EIP-7903', 'EIP-7912', 'EIP-7919'], considered: ['EIP-5920', 'EIP-7762', 'EIP-7823', 'EIP-7825', 'EIP-7883', 'EIP-7907', 'EIP-7917', 'EIP-7918'] },
    { date: '2025-05-09', included: [], scheduled: ['EIP-7594', 'EIP-7642', 'EIP-7892', 'EIP-7935'], declined: ['EIP-663', 'EIP-3540', 'EIP-3670', 'EIP-4200', 'EIP-4750', 'EIP-5450', 'EIP-6206', 'EIP-7069', 'EIP-7480', 'EIP-7620', 'EIP-7666', 'EIP-7668', 'EIP-7688', 'EIP-7692', 'EIP-7698', 'EIP-7732', 'EIP-7761', 'EIP-7783', 'EIP-7791', 'EIP-7793', 'EIP-7805', 'EIP-7819', 'EIP-7834', 'EIP-7843', 'EIP-7873', 'EIP-7880', 'EIP-7889', 'EIP-7898', 'EIP-7903', 'EIP-7912', 'EIP-7919'], considered: ['EIP-5920', 'EIP-7762', 'EIP-7823', 'EIP-7825', 'EIP-7883', 'EIP-7907', 'EIP-7917', 'EIP-7918', 'EIP-7934'] },
    { date: '2025-05-13', included: [], scheduled: ['EIP-7594', 'EIP-7642', 'EIP-7823', 'EIP-7892', 'EIP-7935'], declined: ['EIP-663', 'EIP-3540', 'EIP-3670', 'EIP-4200', 'EIP-4750', 'EIP-5450', 'EIP-6206', 'EIP-7069', 'EIP-7480', 'EIP-7620', 'EIP-7666', 'EIP-7668', 'EIP-7688', 'EIP-7692', 'EIP-7698', 'EIP-7732', 'EIP-7761', 'EIP-7783', 'EIP-7791', 'EIP-7793', 'EIP-7805', 'EIP-7819', 'EIP-7834', 'EIP-7843', 'EIP-7873', 'EIP-7880', 'EIP-7889', 'EIP-7898', 'EIP-7903', 'EIP-7912', 'EIP-7919'], considered: ['EIP-5920', 'EIP-7762', 'EIP-7825', 'EIP-7907', 'EIP-7917', 'EIP-7918', 'EIP-7934'] },
    { date: '2025-05-21', included: [], scheduled: ['EIP-7594', 'EIP-7642', 'EIP-7823', 'EIP-7883', 'EIP-7892', 'EIP-7935'], declined: ['EIP-663', 'EIP-3540', 'EIP-3670', 'EIP-4200', 'EIP-4750', 'EIP-5450', 'EIP-6206', 'EIP-7069', 'EIP-7480', 'EIP-7620', 'EIP-7666', 'EIP-7668', 'EIP-7688', 'EIP-7692', 'EIP-7698', 'EIP-7732', 'EIP-7761', 'EIP-7783', 'EIP-7791', 'EIP-7793', 'EIP-7805', 'EIP-7819', 'EIP-7834', 'EIP-7843', 'EIP-7873', 'EIP-7880', 'EIP-7889', 'EIP-7898', 'EIP-7903', 'EIP-7912', 'EIP-7919'], considered: ['EIP-5920', 'EIP-7762', 'EIP-7825', 'EIP-7907', 'EIP-7917', 'EIP-7918', 'EIP-7934'] },
    { date: '2025-05-22', included: [], scheduled: ['EIP-7594', 'EIP-7642', 'EIP-7823', 'EIP-7825', 'EIP-7883', 'EIP-7892', 'EIP-7918', 'EIP-7935'], declined: ['EIP-663', 'EIP-3540', 'EIP-3670', 'EIP-4200', 'EIP-4750', 'EIP-5450', 'EIP-6206', 'EIP-7069', 'EIP-7480', 'EIP-7620', 'EIP-7666', 'EIP-7668', 'EIP-7688', 'EIP-7692', 'EIP-7698', 'EIP-7732', 'EIP-7761', 'EIP-7762', 'EIP-7783', 'EIP-7791', 'EIP-7793', 'EIP-7805', 'EIP-7819', 'EIP-7834', 'EIP-7843', 'EIP-7873', 'EIP-7880', 'EIP-7889', 'EIP-7898', 'EIP-7903', 'EIP-7912', 'EIP-7919'], considered: ['EIP-5920', 'EIP-7907', 'EIP-7917', 'EIP-7934'] }
] as const;


  const getNetworkUpgrades = (eipNo: number) => {
    console.log("eip:", eipNo);

    const matchedUpgrades = Object.entries(networkUpgrades)
      ?.filter(([_, eipNos]) => eipNos?.map(Number).includes(Number(eipNo)))
      ?.map(([upgradeName]) => upgradeName);

    const formattedUpgrades = matchedUpgrades.join(", ");
    console.log("Matched Network Upgrade Labels:", formattedUpgrades);

    return formattedUpgrades;
  };

  const networkUpgradeLabels = getNetworkUpgrades(eipNo);
  console.log("Matched Network Upgrade Labels:", networkUpgradeLabels);

  const bg = useColorModeValue("#f6f6f7", "#171923");

  useEffect(() => {
    if (eipNo) {
      const fetchData = async () => {
        try {
          const repoPath = Repo.toLowerCase() === 'eip' ? 'eipshistory' : `${Repo.toLowerCase()}history`;
          const response = await fetch(`/api/new/${repoPath}/${eipNo}`);
          //   const response = await fetch(`/api/new/${Repo.toLowerCase()}history/${eipNo}`);
          const jsonData = await response.json();
          const statusWithDates = extractLastStatusDates(jsonData);
          const typeWithDates = extractLastTypesDates(jsonData);
          setData(statusWithDates);
          console.log("status changes dates:",statusWithDates);
          setData2(typeWithDates);
          console.log(statusWithDates);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      fetchData();
    }
  }, [Repo, eipNo]);

  useEffect(() => {
    async function fetchEip() {
      const res = await fetch(`/api/eips/${eipNo}`);
      const data = await res.json();
      setEipData(data);
    }
    fetchEip();
  }, [eipNo]);

  const getValid = async (num: string): Promise<string> => {
    const links = [
      {
        url: `https://raw.githubusercontent.com/ethereum/RIPs/master/RIPS/rip-${num}.md`,
        path: `rip`
      },
      {
        url: `https://raw.githubusercontent.com/ethereum/ERCs/master/ERCS/erc-${num}.md`,
        path: `erc`
      },
      {
        url: `https://raw.githubusercontent.com/ethereum/EIPs/master/EIPS/eip-${num}.md`,
        path: `eip`
      },
    ];

    for (const link of links) {
      try {
        const response = await fetch(link.url);
        if (response.ok) {

          return link.path;
        }
      } catch (error) {
        console.error(`Error checking link ${link.url}:`, error);
      }
    }
    return `/eips/eip-${num}`;
  };


  const fetchEIPData = useCallback(async () => {
    if (!eipNo) return;

    setIsLoading(true); // Set loading state at the beginning

    try {
      const getRepo = await getValid(eipNo);
      if (!getRepo) {
        setIsLoading(false);
        return; // Exit if no repo is returned
      }

      setRepo(getRepo);

      let _markdownFileURL = `https://raw.githubusercontent.com/ethereum/${getRepo.toUpperCase()}s/master/${getRepo.toUpperCase()}S/${getRepo}-${eipNo}.md`;
      console.log("final url:", _markdownFileURL);
      setMarkdownFileURL(_markdownFileURL);

      const eipMarkdownRes = await fetch(_markdownFileURL).then((response) =>
        response.text()
      );

      const { metadata, markdown: _markdown } = extractMetadata(eipMarkdownRes);
      const metadataJson = convertMetadataToJson(metadata);

      if (!metadataJson?.author || !metadataJson?.created) {
        setIsDataNotFound(true);
      } else {
        setMetadataJson(metadataJson);
        setMarkdown(_markdown);
        setIsDataNotFound(false);
      }
    } catch (error) {
      console.error("Error fetching EIP data:", error);
      setIsDataNotFound(true);
    } finally {
      setIsLoading(false);
    }
  }, [eipNo]); // Make sure to include all dependencies here, [Repo, eipNo]);

  useEffect(() => {
    if (eipNo) {
      fetchEIPData();
    }
  }, [fetchEIPData, eipNo]);
  const statusOrder = [
    "Draft",
    "Review",
    "Last Call",
    "Final",
    "Stagnant",
    "Withdrawn",
     "Living",
  ];

  const boxBg = useColorModeValue("gray.100", "gray.700");
  const boxTextColor = useColorModeValue("gray.800", "gray.200");
  const statusColor = useColorModeValue("blue.600", "cyan.400");
  const dateColor = useColorModeValue("gray.600", "gray.300");
  const boxShadow = useColorModeValue("md", "dark-lg");

 const processedData3 = data
  .filter((item) => statusOrder.includes(item.status))
  .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  .map((item, index, array) => {
    const currentDate = new Date(item.date);
    const previousDate = index > 0 ? new Date(array[index - 1].date) : null;
    const daysBetween = previousDate
      ? Math.ceil((currentDate.getTime() - previousDate.getTime()) / (1000 * 3600 * 24))
      : null;

    return {
      date: currentDate.toISOString().split("T")[0],
      status: statusOrder.indexOf(item.status),
      statusLabel: item.status,
      daysBetween,
    };
  });

// ✅ Custom Tooltip content component with correct types
const CustomTooltip = ({
  active,
  payload,
}: TooltipProps<ValueType, NameType>): JSX.Element | null => {
  if (active && payload && payload.length) {
    const point = payload[0].payload;
    return (
      <div style={{ background: "white", border: "1px solid #ccc", padding: 10 }}>
        <p><strong>Status:</strong> {point.statusLabel}</p>
        <p><strong>Date:</strong> {point.date}</p>
        {point.daysBetween != null && (
          <p><strong>+{point.daysBetween} days</strong> since last status change</p>
        )}
      </div>
    );
  }
  return null;
};


  return (
    <>
      {isLoading ? (
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
            <LoaderComponent />
          </motion.div>
        </Box>
      ) : isDataNotFound ? (
        <AllLayout>
          <Box
            textAlign="center"
            py={6}
            px={6}
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            height="100vh"
          >
            <Heading size="lg" mb={4}>
              EIP Not Found
            </Heading>
            <Text color="gray.500" fontSize="xl" mb={6}>
              This EIP might not exist or could be an <Link color="blue.300" href={`/ercs/erc-${eipNo}`}>ERC</Link> or an <Link color="blue.300" href={`/rips/rip-${eipNo}`}>RIP</Link>. Please check again.
            </Text>
            <br />
            <SearchBox />
            <br />
            <Button
              colorScheme="blue"
              size="lg"
              onClick={() => (window.location.href = "/")}
            >
              Return to Home
            </Button>
          </Box>
        </AllLayout>
      ) : (
        <AllLayout>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Box
              paddingBottom={{ lg: "10", sm: "10", base: "10" }}
              marginX={{ lg: "40", md: "2", sm: "2", base: "2" }}
              paddingX={{ lg: "10", md: "5", sm: "5", base: "5" }}
              marginTop={{ lg: "10", md: "5", sm: "5", base: "5" }}
            >
              <Header
                title={`${Repo.toUpperCase()}- ${eipNo}`}
                subtitle={metadataJson?.title || ""}
              />
              <Box overflowX="auto">
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>Authors</Th>
                      <Td>{metadataJson?.author?.join(", ")}</Td>
                    </Tr>
                    <Tr>
                      <Th>Created</Th>
                      <Td>{metadataJson?.created}</Td>
                    </Tr>
                    {metadataJson?.["discussions-to"] && (
                      <Tr>
                        <Th>Discussion Link</Th>
                        <Td>
                          <Link
                            href={metadataJson["discussions-to"]}
                            color="blue.400"
                            isExternal
                          >
                            {metadataJson["discussions-to"]}
                          </Link>
                        </Td>
                      </Tr>
                    )}

                    {metadataJson?.requires &&
                      metadataJson.requires?.length > 0 && (
                        <Tr>
                          <Th>Requires</Th>
                          <Td>
                            <HStack>
                              {metadataJson.requires?.map((req, i) => (
                                <NLink key={i} href={`/eips/eip-${req}`}>
                                  <Text
                                    color="blue.400"
                                    _hover={{ textDecor: "underline" }}
                                  >
                                    {"EIP"}-{req}
                                  </Text>
                                </NLink>
                              ))}
                            </HStack>
                          </Td>
                        </Tr>
                      )}
                    {metadataJson?.status && (
                      <Tr>
                        <Th>Status</Th>
                        <Td>{metadataJson?.status}</Td>
                      </Tr>
                    )}
                    {metadataJson?.["last-call-deadline"] && (
                      <Tr>
                        <Th>Last Call Deadline</Th>
                        <Td>{metadataJson["last-call-deadline"]}</Td>
                      </Tr>
                    )}
                    {getInclusionStage(eipNo) !== 'Not in upgrade consideration' && (
                    <Tr>
                      <Th>Inclusion Stage</Th>
                      <Td>
                        {getInclusionStage(eipNo)}
                      </Td>
                    </Tr>
                    )}
                    {metadataJson?.type && (
                      <Tr>
                        <Th>Type</Th>
                        <Td>{metadataJson?.type}</Td>
                      </Tr>
                    )}
                    {metadataJson?.category && (
                      <Tr>
                        <Th>category</Th>
                        <Td>{metadataJson?.category}</Td>
                      </Tr>
                    )}
                    {networkUpgradeLabels && (
                      <Tr>
                        <Th>Network Upgrade</Th>
                        <Td>{networkUpgradeLabels}</Td>
                      </Tr>
                    )}
                  </Thead>
                </Table>
              </Box>
              {/* AI Summary */}

              <EipAiSummary eipNo={eipNo} content={markdown} />

              <br />
              <Box>
  {/* Collapse Button */}
  <Box bg={useColorModeValue('lightgray', 'darkgray')} p="5" borderRadius="md" mt="1">
    <Flex justify="space-between" align="center">
      {/* Heading on the Left */}
      <Heading id="timeline" size="md" color={"#30A0E0"}>
        Status Timeline
        <Popover>
          <PopoverTrigger>
            <IconButton
              aria-label="More info"
              icon={<InfoOutlineIcon />}
              size="md"
              colorScheme="blue"
              variant="ghost"
            />
          </PopoverTrigger>
          <PopoverContent>
            <PopoverArrow />
            <PopoverCloseButton />
            <PopoverHeader>Instructions</PopoverHeader>
            <PopoverBody>
              The timeline tracks status changes using the merged date as the reference point.
            </PopoverBody>
          </PopoverContent>
        </Popover>
      </Heading>

      {/* Dropdown Button on the Right */}
      <Box
        bg="blue" // Gray background
        borderRadius="md" // Rounded corners
        padding={2} // Padding inside the box
      >
        <IconButton
          onClick={toggleCollapse}
          icon={show ? <ChevronUpIcon boxSize={8} color="white" /> : <ChevronDownIcon boxSize={8} color="white" />}
          variant="ghost"
          h="24px" // Smaller height
          w="20px"
          aria-label="Toggle Status Timeline"
          _hover={{ bg: 'blue' }} // Background color on hover
          _active={{ bg: 'blue' }} // Background color when active
          _focus={{ boxShadow: 'none' }} // Remove focus outline
        />
      </Box>
    </Flex>
    
    {show && (
    <Flex align="center" mb={4}>
      <Text fontWeight="bold" mr={2}>Chart View</Text>
      <Switch isChecked={isChartView} onChange={() => setIsChartView(!isChartView)} />
    </Flex>
    )}


    {/* Status Timeline - This is shown only when `show` is true */}
    {show && (
      isChartView ? (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
    data={processedData3}
    margin={{ top: 20, right: 30, left: 40, bottom: 20 }}
  >
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="date" />
    <YAxis
      type="number"
      domain={[0, statusOrder.length - 1]}
      ticks={statusOrder.map((_, i) => i)}
      tickFormatter={(val) => statusOrder[val]}
    />
    <Tooltip content={<CustomTooltip />} />
    <Line
      type="monotone"
      dataKey="status"
      stroke="#3182CE"
      dot={{
        stroke: "#3182CE",
        strokeWidth: 2,
        r: 5,
      }}
    />
  </LineChart>
        </ResponsiveContainer>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Flex w="100%" gap={6} align="center" flexWrap="wrap" mt="4">
            {data
              .filter((item) => statusOrder.includes(item.status)) // Filter out any unexpected statuses
              .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()) // Sort by date
              .map((item, index, sortedData) => {
                const currentDate = new Date(item.date);
                const nextItem = sortedData[index + 1];
                const nextDate = nextItem ? new Date(nextItem.date) : null;

                // Calculate the day difference between current and next item
                const dayDifference = nextDate
                  ? Math.abs(Math.ceil((nextDate.getTime() - currentDate.getTime()) / (1000 * 3600 * 24)))
                  : null;

                return (
                  <React.Fragment key={index}>
                    {/* Status and Date */}
                    <VStack align="center" spacing={3} minW="120px" maxW="120px" mb={4}>
                      <Box
                        p="5"
                        bg={useColorModeValue("white", "gray.800")}
                        borderRadius="md"
                        boxShadow={useColorModeValue("md", "dark-lg")}
                        textAlign="center"
                        minH="80px"
                        display="flex"
                        flexDirection="column"
                        justifyContent="center"
                      >
                        <Text fontWeight="bold" color={statusColor}>
                          {item.status}
                        </Text>
                        <Text color={dateColor}>
                          {currentDate.toLocaleDateString("en-US", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </Text>
                      </Box>
                    </VStack>

                    {/* Arrow design and days difference */}
                    {nextItem && (
                      <VStack align="center" spacing={1}>
                        <Box
                          h="1px"
                          w="80px"
                          borderBottom="1px solid"
                          borderColor="gray.400"
                          position="relative"
                        >
                          {/* Arrow pointing forward */}
                          <Box
                            position="absolute"
                            right="-10px"
                            top="-4px"
                            borderTop="5px solid transparent"
                            borderBottom="5px solid transparent"
                            borderLeft="10px solid gray"
                          />
                        </Box>
                        <Text color="gray.500" fontSize="sm">
                          {dayDifference} days
                        </Text>
                      </VStack>
                    )}
                  </React.Fragment>
                );
              })}
          </Flex>
        </motion.div>
      )
    )}
  </Box>
</Box>
              <Container maxW="1200px" mx="auto">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <Markdown md={markdown} markdownFileURL={markdownFileURL} />
                  <br />
                </motion.div>
              </Container>
            </Box>
          </motion.div>
        </AllLayout>
      )}
    </>
  );
};

const extracteipno = (data: any) => {
  return data[2]?.split("-")[1];
};

const extractLastStatusDates = (data: any) => {
  const statusDates: { status: string; date: string }[] = [];
  let laststatus = "";
  const sortedData = Object.keys(data)
    ?.filter((key) => key !== "repo")
    .sort((a, b) => new Date(data[a].mergedDate).getTime() - new Date(data[b].mergedDate).getTime());

  sortedData?.forEach((key) => {
    const { status, mergedDate } = data[key];
    if (status === "unknown") {
      return;
    }
    if (laststatus !== status) {
      statusDates.push({ status, date: mergedDate });
    }

    laststatus = status;
  });

  return statusDates;
};
// extractLastTypesDates

const extractLastTypesDates = (data: any) => {
  const typeDates: { type: string; date: string }[] = [];
  const standardTrackTypes = [
    "Standards Track",
    "Standard Track",
    "Standards Track (Core, Networking, Interface, ERC)",
    "Standard"
  ];
  let lasttype = "";
  const sortedData = Object.keys(data)
    ?.filter((key) => key !== "repo")
    .sort((a, b) => new Date(data[a].mergedDate).getTime() - new Date(data[b].mergedDate).getTime());

  sortedData?.forEach((key) => {
    let { type, mergedDate } = data[key];

    if (type === "unknown") {
      return;
    }
    if (standardTrackTypes.includes(type)) {
      type = "Standards Track"
    }

    if (lasttype !== type) {
      typeDates.push({ type, date: mergedDate });
    }

    lasttype = type;
  });

  return typeDates;
};

// export const getStaticProps: GetStaticProps = async ({ params }) => {
//   const eipNo = params?.eipNo as string;

//   const rawUrl = `https://raw.githubusercontent.com/ethereum/EIPs/master/EIPS/eip-${eipNo}.md`;

//   let eipContent = "";
//   let metadataJson = null;

//   try {
//     const res = await fetch(rawUrl);
//     if (!res.ok) throw new Error("Failed to fetch EIP Markdown");
//     const content = await res.text();
//     eipContent = content;

//     // Optionally extract metadata block (YAML) if needed
//     const metadataMatch = content.match(/^---\n([\s\S]*?)\n---/);
//     if (metadataMatch) {
//       const yaml = await import("js-yaml");
//       metadataJson = yaml.load(metadataMatch[1]);
//     }
//   } catch (err) {
//     console.error(`Error fetching EIP ${eipNo}:`, err);
//   }

//   return {
//     props: {
//       eipNo,
//       eipContent,
//       metadataJson: metadataJson || {},
//     },
//   };
// };

// export const getStaticPaths: GetStaticPaths = async () => {
//   return {
//     paths: [], // Let Next.js build pages on-demand
//     fallback: "blocking",
//   };
// };


export const extractMetadata = (text: string) => {
  const regex = /(--|---)\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)/;
  const match = text.match(regex);

  if (match) {
    return {
      metadata: match[2],
      markdown: match[3],
    };
  } else {
    return {
      metadata: "",
      markdown: text,
    };
  }
};

export const convertMetadataToJson = (metadataText: string): EipMetadataJson => {
  const lines = metadataText.split("\n");
  const jsonObject: any = {};

  lines?.forEach((line) => {
    const [key, value] = line.split(/: (.+)/);
    if (key && value) {
      if (key.trim() === "eip") {
        jsonObject[key.trim()] = parseInt(value.trim());
      } else if (key.trim() === "requires") {
        jsonObject[key.trim()] = value.split(",")?.map((v) => parseInt(v));
      } else if (key.trim() === "author") {
        jsonObject[key.trim()] = value
          .split(",")
          ?.map((author: string) => author.trim());
      } else {
        jsonObject[key.trim()] = value.trim();
      }
    }
  });

  return jsonObject as EipMetadataJson;
};

export default TestComponent;