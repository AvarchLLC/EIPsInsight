import React, { useState, useEffect } from "react";
import AllLayout from "@/components/Layout";
import CloseableAdCard from "@/components/CloseableAdCard";
import AdHeader from "@/components/AdHeader";
import CopyLink from "@/components/CopyLink";
import {
  Box,
  Spinner,
  useColorModeValue,
  Text,
  List,
  UnorderedList,
  ListItem,
  Heading,
  Flex,
  Image,
  SimpleGrid,
  Badge,
  AspectRatio,
  Grid,
  GridItem,
  Select,
  VStack,
  HStack,
  Icon,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText
} from "@chakra-ui/react";
import { FaProjectDiagram } from 'react-icons/fa';
import ZoomableTimeline from "@/components/ZoomableTimeline";
import SlotCountdown from "@/components/SlotCountdown";
import NLink from "next/link";
import { motion } from "framer-motion";
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Carousel } from 'react-responsive-carousel';
import NetworkUpgradesChart from "@/components/NetworkUpgradesChart";
import NetworkUpgradesChart2 from "@/components/NetworkUpgradesChart2";
import { FaSyncAlt, FaNetworkWired, FaCode, FaRocket, FaLayerGroup } from "react-icons/fa";
import { useRouter } from "next/router";
import Graph from "@/components/EIP3DWrapper"
import { useRef } from 'react';
import UpgradesTimeline from "@/components/UpgradesTimeline";
import { Card } from "@/components/pectraCards";
import StatusGraph from "@/components/Statuschangesgraph";
import { useSidebar } from '@/components/Sidebar/SideBarContext';
import { useScrollSpy } from "@/hooks/useScrollSpy";
import DeclinedEIPListPage from "@/components/DeclinedCardsPage";
import PlaceYourAdCard from "@/components/PlaceYourAdCard";
import UpgradeEIPsShowcase from "@/components/UpgradeEIPsShowcase";
import HorizontalUpgradeTimeline from "@/components/HorizontalUpgradeTimeline";
import { Rajdhani } from "next/font/google";

const mont = Rajdhani({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

// Import glamsterDamData from UpgradesTimeline (we'll need to extract it or access it differently)
// For now, let's define the glamsterDamData here since it's not exported from UpgradesTimeline
const glamsterDamData = [
  {
    date: '2024-09-28',
    included: [],
    scheduled: [],
    declined: [],
    considered: ['EIP-4762', 'EIP-6800', 'EIP-6873', 'EIP-7545', 'EIP-7667'],
    proposed: []
  },
  {
    date: '2025-06-09',
    included: [],
    scheduled: [],
    declined: [],
    considered: ['EIP-4762', 'EIP-6800', 'EIP-6873', 'EIP-7545', 'EIP-7667'],
    proposed: ['EIP-7793', 'EIP-7843']
  },
  {
    date: '2025-06-10',
    included: [],
    scheduled: [],
    declined: [],
    considered: ['EIP-4762', 'EIP-6800', 'EIP-6873', 'EIP-7545', 'EIP-7667'],
    proposed: ['EIP-7793', 'EIP-7843', 'EIP-7919']
  },
  {
    date: '2025-07-04',
    included: [],
    scheduled: [],
    declined: [],
    considered: [],
    proposed : ['EIP-6873', 'EIP-7667', 'EIP-7793', 'EIP-7843', 'EIP-7919']
  },
  {
    date: '2025-07-25',
    included: [],
    scheduled: [],
    declined: [],
    considered: ['EIP-7732', 'EIP-7782', 'EIP-7805'],
    proposed: ['EIP-6873', 'EIP-7667', 'EIP-7793', 'EIP-7819', 'EIP-7843', 'EIP-7919']
  },
  {
    date: '2025-07-31',
    included: [],
    scheduled: [],
    declined: [],
    considered: ['EIP-7732', 'EIP-7782', 'EIP-7805', 'EIP-7928'],
    proposed: ['EIP-6873', 'EIP-7667', 'EIP-7793', 'EIP-7819', 'EIP-7843', 'EIP-7919']  
  },
  {
    date: '2025-08-11',
    included: [],
    scheduled: [],
    declined: [],
    considered: ['EIP-7732', 'EIP-7782', 'EIP-7805', 'EIP-7928'],
    proposed: ['EIP-6873', 'EIP-7667', 'EIP-7793', 'EIP-7819', 'EIP-7843', 'EIP-7919', 'EIP-5920', 'EIP-7791', 'EIP-7903', 'EIP-7907', 'EIP-7923' ]  
  },
  {
    date: '2025-08-14',
    included: [],
    scheduled: ['EIP-7732',  'EIP-7928'],
    declined: ['EIP-7782'],
    considered: [ 'EIP-7805'],
    proposed: [
      'EIP-2926',
      'EIP-6873',
      'EIP-7667',
      'EIP-7793',
      'EIP-7819',
      'EIP-7843',
      'EIP-7919',
      'EIP-5920',
      'EIP-7791',
      'EIP-7903',
      'EIP-7907',
      'EIP-7923',
      'EIP-7997'
    ]
  },
  {
    date: '2025-08-27',
    included: [],
    scheduled: ['EIP-7732',  'EIP-7928'],
    declined: ['EIP-7782'],
    considered: [ 'EIP-7805'],
    proposed: [
      'EIP-2926',
      'EIP-6873',
      'EIP-7667',
      'EIP-7793',
      'EIP-7819',
      'EIP-7843',
      'EIP-7919',
      'EIP-5920',
      'EIP-7791',
      'EIP-7903',
      'EIP-7907',
      'EIP-7923',
      'EIP-7932',
      'EIP-7979',
      'EIP-7980',
      'EIP-7981',
      'EIP-7997',
      'EIP-7999'
    ]
  },
  {
    date: '2025-09-04',
    included: [],
    scheduled: ['EIP-7732',  'EIP-7928'],
    declined: ['EIP-7782'],
    considered: [ 'EIP-7805'],
    proposed: [
      'EIP-2926',
      'EIP-6873',
      'EIP-7667',
      'EIP-7793',
      'EIP-7819',
      'EIP-7843',
      'EIP-7919',
      'EIP-5920',
      'EIP-7791',
      'EIP-7903',
      'EIP-7907',
      'EIP-7923',
      'EIP-7932',
      'EIP-7979',
      'EIP-7980',
      'EIP-7981',
      'EIP-7997',
      'EIP-7999',
      'EIP-7778',
      'EIP-7976',
      'EIP-7688',
    ]
  },
  {
    date: '2025-09-12',
    included: [],
    scheduled: ['EIP-7732',  'EIP-7928'],
    declined: ['EIP-7782'],
    considered: [ 'EIP-7805'],
    proposed: [
      'EIP-2926',
      'EIP-6873',
      'EIP-7667',
      'EIP-7793',
      'EIP-7819',
      'EIP-7843',
      'EIP-7919',
      'EIP-5920',
      'EIP-7791',
      'EIP-7903',
      'EIP-7907',
      'EIP-7923',
      'EIP-7932',
      'EIP-7979',
      'EIP-7980',
      'EIP-7981',
      'EIP-7997',
      'EIP-7999',
      'EIP-7778',
      'EIP-7976',
      'EIP-7688',
      'EIP-2780',
    ]
  },
  {
    date: '2025-09-24',
    included: [],
    scheduled: ['EIP-7732',  'EIP-7928'],
    declined: ['EIP-7782'],
    considered: [ 'EIP-7805'],
    proposed: [
      'EIP-2926',
      'EIP-6873',
      'EIP-7667',
      'EIP-7793',
      'EIP-7819',
      'EIP-7843',
      'EIP-7919',
      'EIP-5920',
      'EIP-7791',
      'EIP-7903',
      'EIP-7907',
      'EIP-7923',
      'EIP-7932',
      'EIP-7979',
      'EIP-7980',
      'EIP-7981',
      'EIP-7997',
      'EIP-7999',
      'EIP-7778',
      'EIP-7976',
      'EIP-7688',
      'EIP-2780',
      'EIP-7610'
    ]
  },
  {
    date: '2025-10-15',
    included: [],
    scheduled: ['EIP-7732',  'EIP-7928'],
    declined: ['EIP-7692','EIP-7782','EIP-7886','EIP-7919','EIP-7937','EIP-7942'],
    considered: [ 'EIP-7805'],
    proposed: [
      'EIP-2926',
      'EIP-6873',
      'EIP-7667',
      'EIP-7793',
      'EIP-7819',
      'EIP-7843',
      'EIP-6466',
      'EIP-5920',
      'EIP-7791',
      'EIP-7903',
      'EIP-7907',
      'EIP-7923',
      'EIP-7932',
      'EIP-7979',
      'EIP-8030',
      'EIP-7981',
      'EIP-7997',
      'EIP-7999',
      'EIP-7778',
      'EIP-7976',
      'EIP-7688',
      'EIP-2780',
      'EIP-7610',
      'EIP-7668',
      'EIP-8032',
    ]
  },
  {
    date: '2025-10-16',
    included: [],
    scheduled: ['EIP-7732',  'EIP-7928'],
    declined: ['EIP-7692','EIP-7782','EIP-7886','EIP-7919','EIP-7937','EIP-7942'],
    considered: [ 'EIP-7805'],
    proposed: [
      'EIP-2926',
      'EIP-6873',
      'EIP-7667',
      'EIP-7793',
      'EIP-7819',
      'EIP-7843',
      'EIP-6466',
      'EIP-5920',
      'EIP-7791',
      'EIP-7903',
      'EIP-7907',
      'EIP-7923',
      'EIP-7932',
      'EIP-7979',
      'EIP-8030',
      'EIP-7981',
      'EIP-7997',
      'EIP-7999',
      'EIP-7778',
      'EIP-7976',
      'EIP-7688',
      'EIP-2780',
      'EIP-7610',
      'EIP-7668',
      'EIP-7904',
      'EIP-8011',
      'EIP-8037',
      'EIP-8038',
      'EIP-8032',
    ]
  },
  {
    date: '2025-10-21',
    included: [],
    scheduled: ['EIP-7732', 'EIP-7928'],
    declined: ['EIP-7692', 'EIP-7782', 'EIP-7886', 'EIP-7919', 'EIP-7937', 'EIP-7942'],
    considered: ['EIP-7805'],
    proposed: [
      'EIP-2780',
      'EIP-2926',
      'EIP-5920',
      'EIP-6466',
      'EIP-6873',
      'EIP-7610',
      'EIP-7667',
      'EIP-7668',
      'EIP-7688',
      'EIP-7778',
      'EIP-7791',
      'EIP-7793',
      'EIP-7819',
      'EIP-7843',
      'EIP-7903',
      'EIP-7904',
      'EIP-7907',
      'EIP-7923',
      'EIP-7932',
      'EIP-7976',
      'EIP-7979',
      'EIP-7981',
      'EIP-7997',
      'EIP-7999',
      'EIP-8011',
      'EIP-8030',
      'EIP-8032',
      'EIP-8037',
      'EIP-8038'
    ]
  },
  {
    date: '2025-10-23',
    included: [],
    scheduled: ['EIP-7732', 'EIP-7928'],
    declined: ['EIP-7692', 'EIP-7782', 'EIP-7886', 'EIP-7919', 'EIP-7937', 'EIP-7942'],
    considered: ['EIP-7805'],
    proposed: [
      'EIP-2780',
      'EIP-2926',
      'EIP-5920',
      'EIP-6466',
      'EIP-6873',
      'EIP-7610',
      'EIP-7667',
      'EIP-7668',
      'EIP-7688',
      'EIP-7778',
      'EIP-7791',
      'EIP-7793',
      'EIP-7819',
      'EIP-7843',
      'EIP-7903',
      'EIP-7904',
      'EIP-7907',
      'EIP-7923',
      'EIP-7932',
      'EIP-7976',
      'EIP-7979',
      'EIP-7981',
      'EIP-7997',
      'EIP-7999',
      'EIP-8011',
      'EIP-8030',
      'EIP-8032',
      'EIP-8037',
      'EIP-8038',
      'EIP-8045'
    ]
  },
  {
    date: '2025-10-29',
    included: [],
    scheduled: ['EIP-7732', 'EIP-7928'],
    declined: ['EIP-7692', 'EIP-7782', 'EIP-7886', 'EIP-7919', 'EIP-7937', 'EIP-7942'],
    considered: ['EIP-7805'],
    proposed: [
      'EIP-2780',
      'EIP-2926',
      'EIP-5920',
      'EIP-6466',
      'EIP-6873',
      'EIP-7610',
      'EIP-7667',
      'EIP-7668',
      'EIP-7688',
      'EIP-7708',
      'EIP-7778',
      'EIP-7791',
      'EIP-7793',
      'EIP-7819',
      'EIP-7843',
      'EIP-7872',
      'EIP-7903',
      'EIP-7904',
      'EIP-7907',
      'EIP-7923',
      'EIP-7932',
      'EIP-7949',
      'EIP-7973',
      'EIP-7976',
      'EIP-7979',
      'EIP-7981',
      'EIP-7997',
      'EIP-8011',
      'EIP-8024',
      'EIP-8030',
      'EIP-8032',
      'EIP-8037',
      'EIP-8038',
      'EIP-8045',
      'EIP-8057',
      'EIP-8061'
    ]
  },
  {
    date: '2025-10-30',
    included: [],
    scheduled: ['EIP-7732', 'EIP-7928'],
    declined: ['EIP-7692', 'EIP-7782', 'EIP-7886', 'EIP-7919', 'EIP-7937', 'EIP-7942'],
    considered: ['EIP-7805'],
    proposed: [
      'EIP-2780',
      'EIP-2926',
      'EIP-5920',
      'EIP-6466',
      'EIP-6873',
      'EIP-7610',
      'EIP-7667',
      'EIP-7668',
      'EIP-7688',
      'EIP-7708',
      'EIP-7745',
      'EIP-7778',
      'EIP-7791',
      'EIP-7793',
      'EIP-7819',
      'EIP-7843',
      'EIP-7872',
      'EIP-7903',
      'EIP-7904',
      'EIP-7907',
      'EIP-7923',
      'EIP-7932',
      'EIP-7949',
      'EIP-7973',
      'EIP-7976',
      'EIP-7979',
      'EIP-7981',
      'EIP-7997',
      'EIP-8011',
      'EIP-8024',
      'EIP-8030',
      'EIP-8032',
      'EIP-8037',
      'EIP-8038',
      'EIP-8045',
      'EIP-8057',
      'EIP-8061'
    ]
  },
  {
    date: '2025-11-2',
    included: [],
    scheduled: ['EIP-7732', 'EIP-7928'],
    declined: ['EIP-7692', 'EIP-7782', 'EIP-7886', 'EIP-7919', 'EIP-7937', 'EIP-7942'],
    considered: ['EIP-7805'],
    proposed: [
      'EIP-2780',
      'EIP-2926',
      'EIP-5920',
      'EIP-6466',
      'EIP-6873',
      'EIP-7610',
      'EIP-7667',
      'EIP-7668',
      'EIP-7688',
      'EIP-7708',
      'EIP-7745',
      'EIP-7778',
      'EIP-7791',
      'EIP-7793',
      'EIP-7819',
      'EIP-7843',
      'EIP-7872',
      'EIP-7903',
      'EIP-7904',
      'EIP-7907',
      'EIP-7923',
      'EIP-7932',
      'EIP-7949',
      'EIP-7973',
      'EIP-7976',
      'EIP-7979',
      'EIP-7981',
      'EIP-7997',
      'EIP-8011',
      'EIP-8024',
      'EIP-8030',
      'EIP-8032',
      'EIP-8037',
      'EIP-8038',
      'EIP-8045',
      'EIP-8057',
      'EIP-8058',
      'EIP-8061'
    ]
  },
  {
    date: '2025-10-30',
    included: [],
    scheduled: ['EIP-7732', 'EIP-7928'],
    declined: ['EIP-7692', 'EIP-7782', 'EIP-7886', 'EIP-7919', 'EIP-7937', 'EIP-7942'],
    considered: ['EIP-7805'],
    proposed: [
      'EIP-2780',
      'EIP-2926',
      'EIP-5920',
      'EIP-6466',
      'EIP-6873',
      'EIP-7610',
      'EIP-7667',
      'EIP-7668',
      'EIP-7688',
      'EIP-7708',
      'EIP-7745',
      'EIP-7778',
      'EIP-7791',
      'EIP-7793',
      'EIP-7819',
      'EIP-7843',
      'EIP-7872',
      'EIP-7903',
      'EIP-7904',
      'EIP-7907',
      'EIP-7923',
      'EIP-7932',
      'EIP-7949',
      'EIP-7973',
      'EIP-7976',
      'EIP-7979',
      'EIP-7971',
      'EIP-7981',
      'EIP-7997',
      'EIP-8011',
      'EIP-8024',
      'EIP-8030',
      'EIP-8032',
      'EIP-8037',
      'EIP-8038',
      'EIP-8045',
      'EIP-8053',
      'EIP-8059',
      'EIP-8057',
      'EIP-8061'
    ]
  },
  {
    date: '2025-11-11',
    included: [],
    scheduled: ['EIP-7732', 'EIP-7928'],
    declined: ['EIP-7692', 'EIP-7782', 'EIP-7886', 'EIP-7919', 'EIP-7937', 'EIP-7942'],
    considered: ['EIP-7805'],
    proposed: [
      'EIP-2780',
      'EIP-2926',
      'EIP-5920',
      'EIP-6466',
      'EIP-7610',
      'EIP-7668',
      'EIP-7686',
      'EIP-7688',
      'EIP-7708',
      'EIP-7745',
      'EIP-7778',
      'EIP-7791',
      'EIP-7793',
      'EIP-7819',
      'EIP-7843',
      'EIP-7872',
      'EIP-7903',
      'EIP-7904',
      'EIP-7907',
      'EIP-7923',
      'EIP-7932',
      'EIP-7949',
      'EIP-7971',
      'EIP-7973',
      'EIP-7976',
      'EIP-7979',
      'EIP-7981',
      'EIP-7997',
      'EIP-8011',
      'EIP-8024',
      'EIP-8030',
      'EIP-8032',
      'EIP-8037',
      'EIP-8038',
      'EIP-8045',
      'EIP-8053',
      'EIP-8057',
      'EIP-8058',
      'EIP-8061',
      'EIP-8062',
      'EIP-8068',
      'EIP-8071'
    ]
  },
  {
    date: '2025-11-13',
    included: [],
    scheduled: ['EIP-7732', 'EIP-7928'],
    declined: ['EIP-7692', 'EIP-7782', 'EIP-7886', 'EIP-7919', 'EIP-7937', 'EIP-7942'],
    considered: ['EIP-7805'],
    proposed: [
      'EIP-2780',
      'EIP-2926',
      'EIP-5920',
      'EIP-6466',
      'EIP-7610',
      'EIP-7668',
      'EIP-7686',
      'EIP-7688',
      'EIP-7708',
      'EIP-7745',
      'EIP-7778',
      'EIP-7791',
      'EIP-7793',
      'EIP-7819',
      'EIP-7843',
      'EIP-7872',
      'EIP-7903',
      'EIP-7904',
      'EIP-7907',
      'EIP-7923',
      'EIP-7932',
      'EIP-7949',
      'EIP-7971',
      'EIP-7973',
      'EIP-7976',
      'EIP-7979',
      'EIP-7981',
      'EIP-7997',
      'EIP-8011',
      'EIP-8013',
      'EIP-8024',
      'EIP-8030',
      'EIP-8032',
      'EIP-8037',
      'EIP-8038',
      'EIP-8045',
      'EIP-8053',
      'EIP-8057',
      'EIP-8058',
      'EIP-8061',
      'EIP-8062',
      'EIP-8068',
      'EIP-8070',
      'EIP-8071'
    ]
  },
  {
    date: '2025-11-26',
    included: [],
    scheduled: ['EIP-7732', 'EIP-7928'],
    declined: ['EIP-7692', 'EIP-7782', 'EIP-7886', 'EIP-7919', 'EIP-7937', 'EIP-7942'],
    considered: ['EIP-7805'],
    proposed: [
      'EIP-2780',
      'EIP-2926',
      'EIP-5920',
      'EIP-6404',
      'EIP-6466',
      'EIP-7610',
      'EIP-7668',
      'EIP-7686',
      'EIP-7688',
      'EIP-7708',
      'EIP-7745',
      'EIP-7778',
      'EIP-7791',
      'EIP-7793',
      'EIP-7819',
      'EIP-7843',
      'EIP-7872',
      'EIP-7903',
      'EIP-7904',
      'EIP-7907',
      'EIP-7923',
      'EIP-7932',
      'EIP-7949',
      'EIP-7971',
      'EIP-7973',
      'EIP-7976',
      'EIP-7979',
      'EIP-7981',
      'EIP-7997',
      'EIP-8011',
      'EIP-8013',
      'EIP-8024',
      'EIP-8030',
      'EIP-8032',
      'EIP-8037',
      'EIP-8038',
      'EIP-8045',
      'EIP-8053',
      'EIP-8057',
      'EIP-8058',
      'EIP-8061',
      'EIP-8062',
      'EIP-8068',
      'EIP-8070',
      'EIP-8071',
      'EIP-8080',
    ]
  },
  {
    date: '2025-11-26',
    included: [],
    scheduled: ['EIP-7732', 'EIP-7928'],
    declined: ['EIP-7692', 'EIP-7782', 'EIP-7886', 'EIP-7919', 'EIP-7937', 'EIP-7942', 'EIP-8068'],
    considered: ['EIP-7805'],
    proposed: [
      'EIP-2780',
      'EIP-2926',
      'EIP-5920',
      'EIP-6404',
      'EIP-6466',
      'EIP-7610',
      'EIP-7668',
      'EIP-7686',
      'EIP-7688',
      'EIP-7708',
      'EIP-7745',
      'EIP-7778',
      'EIP-7791',
      'EIP-7793',
      'EIP-7819',
      'EIP-7843',
      'EIP-7872',
      'EIP-7903',
      'EIP-7904',
      'EIP-7907',
      'EIP-7923',
      'EIP-7932',
      'EIP-7949',
      'EIP-7971',
      'EIP-7973',
      'EIP-7976',
      'EIP-7979',
      'EIP-7981',
      'EIP-7997',
      'EIP-8011',
      'EIP-8013',
      'EIP-8024',
      'EIP-8030',
      'EIP-8032',
      'EIP-8037',
      'EIP-8038',
      'EIP-8045',
      'EIP-8053',
      'EIP-8057',
      'EIP-8058',
      'EIP-8061',
      'EIP-8062',
      'EIP-8070',
      'EIP-8071',
      'EIP-8080',
    ]
  },
  {
  date: '2025-12-4',
  included: [],
  scheduled: ['EIP-7732', 'EIP-7928'],
  declined: ['EIP-7692', 'EIP-7782', 'EIP-7886', 'EIP-7919', 'EIP-7937', 'EIP-7942','EIP-8062', 'EIP-8068','EIP-8071'],
  considered: ['EIP-7805', 'EIP-8045'],
  proposed: [
    'EIP-2780',
    'EIP-2926',
    'EIP-5920',
    'EIP-7610',
    'EIP-7668',
    'EIP-7686',
    'EIP-7688',
    'EIP-7745',
    'EIP-7793',
    'EIP-7872',
    'EIP-7903',
    'EIP-7904',
    'EIP-7907',
    'EIP-7923',
    'EIP-7949',
    'EIP-7971',
    'EIP-7973',
    'EIP-7976',
    'EIP-7981',
    'EIP-7997',
    'EIP-8032',
    'EIP-8037',
    'EIP-8038',
    'EIP-8051',
    'EIP-8058',
    'EIP-8061',
    'EIP-8070',
    'EIP-8080',
  ]
},
{
  date: '2025-12-18',
  included: [],
  scheduled: ['EIP-7732', 'EIP-7928'],
  declined: ['EIP-6404', 'EIP-6466','EIP-7619','EIP-7692',  'EIP-7782', 'EIP-7791', 'EIP-7819','EIP-7886', 'EIP-7919','EIP-7932', 'EIP-7937', 'EIP-7942','EIP-7979','EIP-8011','EIP-8013','EIP-8030', 'EIP-8053','EIP-8057','EIP-8059','EIP-8062', 'EIP-8068','EIP-8071'],
  considered: ['EIP-7708', 'EIP-7778', 'EIP-7805', 'EIP-7843','EIP-8024', 'EIP-8045'],
  proposed: [
    'EIP-2780',
    'EIP-2926',
    'EIP-5920',
    'EIP-7610',
    'EIP-7668',
    'EIP-7686',
    'EIP-7688',
    'EIP-7745',
    'EIP-7793',
    'EIP-7872',
    'EIP-7903',
    'EIP-7904',
    'EIP-7907',
    'EIP-7923',
    'EIP-7949',
    'EIP-7971',
    'EIP-7973',
    'EIP-7976',
    'EIP-7981',
    'EIP-7997',
    'EIP-8032',
    'EIP-8037',
    'EIP-8038',
    'EIP-8051',
    'EIP-8058',
    'EIP-8061',
    'EIP-8070',
    'EIP-8080',
  ]
},
{
  date: '2025-12-19',
  included: [],
  scheduled: ['EIP-7732', 'EIP-7928'],
  declined: ['EIP-6404', 'EIP-6466','EIP-7619','EIP-7692',  'EIP-7782', 'EIP-7791', 'EIP-7819','EIP-7886', 'EIP-7919','EIP-7932', 'EIP-7937', 'EIP-7942','EIP-7979','EIP-8011','EIP-8013','EIP-8030', 'EIP-8053','EIP-8057','EIP-8059','EIP-8062', 'EIP-8068','EIP-8071'],
  considered: ['EIP-7708', 'EIP-7778', 'EIP-7805', 'EIP-7843','EIP-8024', 'EIP-8045'],
  proposed: [
    'EIP-2780',
    'EIP-2926',
    'EIP-5920',
    'EIP-7610',
    'EIP-7668',
    'EIP-7686',
    'EIP-7688',
    'EIP-7745',
    'EIP-7793',
    'EIP-7872',
    'EIP-7903',
    'EIP-7904',
    'EIP-7907',
    'EIP-7923',
    'EIP-7949',
    'EIP-7971',
    'EIP-7973',
    'EIP-7976',
    'EIP-7981',
    'EIP-7997',
    'EIP-8032',
    'EIP-8037',
    'EIP-8038',
    'EIP-8051',
    'EIP-8058',
    'EIP-8061',
    'EIP-8070',
    'EIP-8080',
  ]
},
{
  date: '2026-01-03',
  included: [],
  scheduled: ['EIP-7732', 'EIP-7928'],
  declined: ['EIP-2926', 'EIP-6404', 'EIP-6466', 'EIP-7619', 'EIP-7686', 'EIP-7692', 'EIP-7782', 'EIP-7791', 'EIP-7819', 'EIP-7886', 'EIP-7919', 'EIP-7923', 'EIP-7932', 'EIP-7937', 'EIP-7942', 'EIP-7973', 'EIP-7979', 'EIP-8011', 'EIP-8013'],
  considered: ['EIP-2780', 'EIP-7708', 'EIP-7778', 'EIP-7805', 'EIP-7843', 'EIP-7904', 'EIP-7976', 'EIP-7981', 'EIP-8024', 'EIP-8038', 'EIP-8045'],
  proposed: [
    'EIP-2780',
    'EIP-2926',
    'EIP-5920',
    'EIP-7610',
    'EIP-7668',
    'EIP-7688',
    'EIP-7745',
    'EIP-7793',
    'EIP-7872',
    'EIP-7903',
    'EIP-7904',
    'EIP-7907',
    'EIP-7949',
    'EIP-7971',
    'EIP-7973',
    'EIP-7976',
    'EIP-7981',
    'EIP-7997',
    'EIP-8032',
    'EIP-8037',
    'EIP-8038',
    'EIP-8051',
    'EIP-8058',
    'EIP-8061',
    'EIP-8070',
    'EIP-8080',
  ]
}
];

// Function to get recent glamsterdamData entry and fetch additional EIP data
const getRecentGlamsterdamDataWithProposedEIPs = async (glamsterDamData: any[]) => {
  // Get the most recent entry (last one) from glamsterDamData
  const recentEntry = glamsterDamData[glamsterDamData.length - 1];
  
  if (!recentEntry || !recentEntry.proposed || recentEntry.proposed.length === 0) {
    return recentEntry;
  }

  // Fetch additional data for each proposed EIP from the API
  const proposedEIPsData = await Promise.all(
    recentEntry.proposed.map(async (eipNumber: string) => {
      try {
        // Extract just the number from EIP-XXXX format
        const number = eipNumber.replace('EIP-', '');
        const response = await fetch(`/api/eips/${number}`);
        if (response.ok) {
          const eipData = await response.json();
          // Access the actual EIP data from the _doc field
          const docData = eipData._doc || eipData;
          return {
            eip: number,
            title: docData.title || '',
            author: docData.author || '',
            type: docData.type || '',
            category: docData.category || '',
            status: docData.status || '',
            created: docData.created || '',
            discussion: docData.discussion || ''
          };
        } else {
          console.warn(`Failed to fetch EIP ${number}: ${response.status} ${response.statusText}`);
        }
      } catch (error) {
        console.error(`Error fetching data for ${eipNumber}:`, error);
      }
      
      // Return fallback data if API call fails
      return {
        eip: eipNumber.replace('EIP-', ''),
        title: '',
        author: '',
        type: '',
        category: '',
        status: '',
        created: '',
        discussion: ''
      };
    })
  );

  // Return the recent entry with enhanced proposed EIPs data
  return {
    ...recentEntry,
    proposed: proposedEIPsData
  };
};

const sepolia_key = process.env.NEXT_PUBLIC_SEPOLIA_API as string;

// Upgrade color mapping for consistent theming
const upgradeColors: Record<string, string> = {
  'pectra': '#DC2626',
  'fusaka': '#10B981',
  'glamsterdam': '#8B5CF6',
  'hegota': '#F59E0B'
};

const upgradeDates: Record<string, string> = {
  'pectra': '2025-05-07',
  'fusaka': '2025-12-03',
  'glamsterdam': '2026-06-01',
  'hegota': 'TBD'
};

// Type for a Declined EIP entry
interface DeclinedEIP {
  id: string;
  title: string;
  description: string;
  eipsLink: string;
  discussionLink: string;
}

// Data
const declinedEIPs: DeclinedEIP[] = [
  {
    id: "EIP-663",
    title: "EIP-663: SWAPN, DUPN and EXCHANGE instructions",
    description: "Introduce additional instructions for manipulating the stack which allow accessing the stack at higher depths",
    eipsLink: "https://eips.ethereum.org/EIPS/eip-663",
    discussionLink: "https://ethereum-magicians.org/t/eip-663-swapn-dupn-and-exchange-instructions/3346",
  },
  {
    id: "EIP-3540",
    title: "EIP-3540: EOF - EVM Object Format v1",
    description: "EOF is an extensible and versioned container format for EVM bytecode with a once-off validation at deploy time.",
    eipsLink: "https://eips.ethereum.org/EIPS/eip-3540",
    discussionLink: "https://ethereum-magicians.org/t/evm-object-format-eof/5727",
  },
  {
    id: "EIP-3670",
    title: "EIP-3670: EOF - Code Validation",
    description: "Validate EOF bytecode for correctness at the time of deployment.",
    eipsLink: "https://eips.ethereum.org/EIPS/eip-3670",
    discussionLink: "https://ethereum-magicians.org/t/eip-3670-eof-code-validation/6693",
  },
  {
    id: "EIP-4200",
    title: "EIP-4200: EOF - Static relative jumps",
    description: "RJUMP, RJUMPI and RJUMPV instructions with a signed immediate encoding the jump destination",
    eipsLink: "https://eips.ethereum.org/EIPS/eip-4200",
    discussionLink: "https://ethereum-magicians.org/t/eip-4200-eof-static-relative-jumps/7108",
  },
  {
    id: "EIP-4750",
    title: "EIP-4750: EOF - Functions",
    description: "Individual sections for functions with `CALLF` and `RETF` instructions",
    eipsLink: "https://eips.ethereum.org/EIPS/eip-4750",
    discussionLink: "https://ethereum-magicians.org/t/eip-4750-eof-functions/8195",
  },
  {
    id: "EIP-5450",
    title: "EIP-5450: EOF - Stack Validation",
    description: "Deploy-time validation of stack usage for EOF functions.",
    eipsLink: "https://eips.ethereum.org/EIPS/eip-5450",
    discussionLink: "https://ethereum-magicians.org/t/eip-5450-eof-stack-validation/10410",
  },
  {
    id: "EIP-5920",
    title: "EIP-5920: PAY opcode",
    description: "Introduces a new opcode, PAY, to send ether to an address without calling any of its functions",
    eipsLink: "https://eips.ethereum.org/EIPS/eip-5920",
    discussionLink: "https://ethereum-magicians.org/t/eip-5920-pay-opcode/11717",
  },
  {
    id: "EIP-6206",
    title: "EIP-6206: EOF - JUMPF and non-returning functions",
    description: "Introduces instruction for chaining function calls.",
    eipsLink: "https://eips.ethereum.org/EIPS/eip-6206",
    discussionLink: "https://ethereum-magicians.org/t/eip-4750-eof-functions/8195",
  },
  {
    id: "EIP-7069",
    title: "EIP-7069: Revamped CALL instructions",
    description: "Introduce EXTCALL, EXTDELEGATECALL and EXTSTATICCALL with simplified semantics",
    eipsLink: "https://eips.ethereum.org/EIPS/eip-7069",
    discussionLink: "https://ethereum-magicians.org/t/eip-7069-revamped-call-instructions/14432",
  },
  {
    id: "EIP-7480",
    title: "EIP-7480: EOF - Data section access instructions",
    description: "Instructions to read data section of EOF container",
    eipsLink: "https://eips.ethereum.org/EIPS/eip-7480",
    discussionLink: "https://ethereum-magicians.org/t/eip-7480-eof-data-section-access-instructions/15414",
  },
  {
    id: "EIP-7620",
    title: "EIP-7620: EOF Contract Creation",
    description: "Introduce `EOFCREATE` and `RETURNCODE` instructions",
    eipsLink: "https://eips.ethereum.org/EIPS/eip-7620",
    discussionLink: "https://ethereum-magicians.org/t/eip-7620-eof-contract-creation/18590",
  },
  {
    id: "EIP-7666",
    title: "EIP-7666: EVM-ify the identity precompile",
    description: "Remove the identity precompile, and put into place a piece of EVM code that has equivalent functionality",
    eipsLink: "https://eips.ethereum.org/EIPS/eip-7666",
    discussionLink: "https://ethereum-magicians.org/t/eip-7561-evm-ify-the-identity-precompile/19445",
  },
  {
    id: "EIP-7668",
    title: "EIP-7668: Remove bloom filters",
    description: "Remove bloom filters from the execution block",
    eipsLink: "https://eips.ethereum.org/EIPS/eip-7668",
    discussionLink: "https://ethereum-magicians.org/t/eip-7653-remove-bloom-filters/19447",
  },
  {
    id: "EIP-7688",
    title: "EIP-7688: Forward compatible consensus data structures",
    description: "Transition consensus SSZ data structures to ProgressiveContainer",
    eipsLink: "https://eips.ethereum.org/EIPS/eip-7688",
    discussionLink: "https://ethereum-magicians.org/t/eip-7688-forward-compatible-consensus-data-structures/19673",
  },
  {
    id: "EIP-7692",
    title: "EIP-7692: EVM Object Format (EOFv1) Meta",
    description: "Meta EIP listing the EIPs belonging to the EVM Object Format (EOF) proposal in its first version, enabling code versioning and paving the way for RISC-V execution environments.",
    eipsLink: "https://eips.ethereum.org/EIPS/eip-7692",
    discussionLink: "https://ethereum-magicians.org/t/glamsterdam-headliner-proposal-eof/21271",
  },
  {
    id: "EIP-7698",
    title: "EIP-7698: EOF - Creation transaction",
    description: "Deploy EOF contracts using creation transactions",
    eipsLink: "https://eips.ethereum.org/EIPS/eip-7698",
    discussionLink: "https://ethereum-magicians.org/t/eip-7698-eof-creation-transaction/19784",
  },
  {
    id: "EIP-7732",
    title: "EIP-7732: enshrined Proposer-Builder separation (ePBS)",
    description: "Enshrines proposer-builder separation at the protocol level to improve MEV resistance and block production efficiency.",
    eipsLink: "https://eips.ethereum.org/EIPS/eip-7732",
    discussionLink: "https://ethereum-magicians.org/t/eip-7732-enshrined-proposer-builder-separation-epbs/20329",
  },
  {
    id: "EIP-7761",
    title: "EIP-7761: EXTCODETYPE instruction",
    description: "Add EXTCODETYPE instruction to EOF to address common uses of EXTCODE* instructions",
    eipsLink: "https://eips.ethereum.org/EIPS/eip-7761",
    discussionLink: "https://ethereum-magicians.org/t/eip-7761-is-contract-instruction/20936",
  },
  {
    id: "EIP-7762",
    title: "EIP-7762: Increase MIN_BASE_FEE_PER_BLOB_GAS",
    description: "Adjust the MIN_BASE_FEE_PER_BLOB_GAS to speed up price discovery on blob space",
    eipsLink: "https://eips.ethereum.org/EIPS/eip-7762",
    discussionLink: "https://ethereum-magicians.org/t/eip-7762-increase-min-base-fee-per-blob-gas/20949",
  },
  {
    id: "EIP-7783",
    title: "EIP-7783: Add Controlled Gas Limit Increase Strategy",
    description: "Adds a controlled gas limit increase strategy.",
    eipsLink: "https://eips.ethereum.org/EIPS/eip-7783",
    discussionLink: "https://ethereum-magicians.org/t/eip-7783-add-controlled-gas-limit-increase-strategy/21282",
  },
  {
    id: "EIP-7791",
    title: "EIP-7791: GAS2ETH opcode",
    description: "Introduces a new opcode, `GAS2ETH`, to convert gas to ETH",
    eipsLink: "https://eips.ethereum.org/EIPS/eip-7791",
    discussionLink: "https://ethereum-magicians.org/t/eip-7791-gas2eth-opcode/21418",
  },
  {
    id: "EIP-7793",
    title: "EIP-7793: Conditional Transactions",
    description: "Transactions that only executes at a specific index and slot.",
    eipsLink: "https://eips.ethereum.org/EIPS/eip-7793",
    discussionLink: "https://ethereum-magicians.org/t/eip-7793-asserttxindex-opcode/21513",
  },
  {
    id: "EIP-7805",
    title: "EIP-7805: Fork-Choice Inclusion Lists (FOCIL)",
    description: "Fork-Choice enforced Inclusion Lists improve improve censorship resistance by enable multiple proposer to force-include transactions in Ethereum blocks.",
    eipsLink: "https://eips.ethereum.org/EIPS/eip-7805",
    discussionLink: "https://ethereum-magicians.org/t/eip-7805-committee-based-fork-choice-enforced-inclusion-lists-focil/21578",
  },
  {
    id: "EIP-7819",
    title: "EIP-7819: SETDELEGATE instruction",
    description: "Introduce a new instruction allowing contracts to create clones using EIP-7702 delegation designations",
    eipsLink: "https://eips.ethereum.org/EIPS/eip-7819",
    discussionLink: "https://ethereum-magicians.org/t/eip-7819-create-delegate/21763",
  },
  {
    id: "EIP-7834",
    title: "EIP-7834: Separate Metadata Section for EOF",
    description: "Introduce a new separate metadata section to the EOF",
    eipsLink: "https://eips.ethereum.org/EIPS/eip-7834",
    discussionLink: "https://ethereum-magicians.org/t/eip-7834-separate-metadata-section-for-eof/22138",
  },
  {
    id: "EIP-7843",
    title: "EIP-7843: SLOTNUM opcode",
    description: "Opcode to get the current slot number.",
    eipsLink: "https://eips.ethereum.org/EIPS/eip-7843",
    discussionLink: "https://ethereum-magicians.org/t/eip-7843-slotnum-opcode/22234",
  },
  {
    id: "EIP-7873",
    title: "EIP-7873: EOF - TXCREATE and InitcodeTransaction type",
    description: "Adds a `TXCREATE` instruction to EOF and an accompanying transaction type allowing to create EOF contracts from transaction data",
    eipsLink: "https://eips.ethereum.org/EIPS/eip-7873",
    discussionLink: "https://ethereum-magicians.org/t/eip-7873-eof-txcreate-instruction-and-initcodetransaction-type/22765",
  },
  {
    id: "EIP-7880",
    title: "EIP-7880: EOF - EXTCODEADDRESS instruction",
    description: "Add EXTCODEADDRESS instruction to EOF to address code delegation use cases",
    eipsLink: "https://eips.ethereum.org/EIPS/eip-7880",
    discussionLink: "https://ethereum-magicians.org/t/eip-7880-eof-extcodeaddress-instruction/22845",
  },
  {
    id: "EIP-7889",
    title: "EIP-7889: Emit log on revert",
    description: "Top level reverts emit a log with revert message",
    eipsLink: "https://eips.ethereum.org/EIPS/eip-7889",
    discussionLink: "https://ethereum-magicians.org/t/eip-7889-emit-log-on-revert/22918",
  },
  {
    id: "EIP-7898",
    title: "EIP-7898: Uncouple execution payload from beacon block",
    description: "Separates the execution payload from beacon block to independently transmit them",
    eipsLink: "https://eips.ethereum.org/EIPS/eip-7898",
    discussionLink: "https://ethereum-magicians.org/t/uncouple-execution-payload-from-beacon-block/23029",
  },
  {
    id: "EIP-7903",
    title: "EIP-7903: Remove Initcode Size Limit",
    description: "Removes the initcode size limit introduced in EIP-3860",
    eipsLink: "https://eips.ethereum.org/EIPS/eip-7903",
    discussionLink: "https://ethereum-magicians.org/t/remove-initcode-size-limit/23066",
  },
  {
    id: "EIP-7907",
    title: "EIP-7907: Meter Contract Code Size And Increase Limit",
    description: "Increases the contract code size limit introduced in EIP-170 and adds a gas metering to code loading",
    eipsLink: "https://eips.ethereum.org/EIPS/eip-7907",
    discussionLink: "https://ethereum-magicians.org/t/eip-remove-contract-size-limit/23156",
  },
  {
    id: "EIP-7912",
    title: "EIP-7912: Pragmatic stack manipulation tools",
    description: "Add additional SWAP and DUP operations for deeper stack access",
    eipsLink: "https://eips.ethereum.org/EIPS/eip-7912",
    discussionLink: "https://ethereum-magicians.org/t/eip-7912-pragmatic-expansion-of-stack-manipulation-tools/23826",
  },
  {
    id: "EIP-7919",
    title: "EIP-7919: Pureth - Provable RPC responses",
    description: "Enables provable RPC responses to eliminate trust requirements in data access and improve decentralization.",
    eipsLink: "",
    discussionLink: "",
  },
];


interface AllProps {
  initialUpgrade?: string;
}

const All = ({ initialUpgrade }: AllProps) => {
  // Homepage-style theme values
  
  // Use exact same pattern as Dashboard component
  const textColor = useColorModeValue("gray.800", "gray.200");
  const linkColor = useColorModeValue("blue.600", "blue.300");
  const bg = useColorModeValue("#f6f6f7", "#171923");
  
  // Note: avoid logging color mode on server to prevent noisy SSR logs
  
  // Set loading to false after component mounts (like Dashboard does)
  useEffect(() => {
    setIsLoading(false);
  }, []);
  
  const [selectedOption, setSelectedOption] = useState<'pectra' | 'fusaka' | 'glamsterdam' | 'hegota'>(initialUpgrade as any || 'glamsterdam');
  const { selectedUpgrade, setSelectedUpgrade } = useSidebar();
  const [recentGlamsterdamData, setRecentGlamsterdamData] = useState<any>(null);
  const [isLoadingGlamsterdamData, setIsLoadingGlamsterdamData] = useState(false);
  const [glamsterdamEipCategory, setGlamsterdamEipCategory] = useState<'scheduled' | 'considered'>('scheduled');
  // const selectedOption = selectedUpgrade;       // just alias so rest of code works
  // const setSelectedOption = setSelectedUpgrade;
  const optionArr = [
    "Meta",
    "Informational",
    "Core",
    "Networking",
    "Interface",
    "ERC",
    "RIP",
  ];
  const [isLoading, setIsLoading] = useState(true);
  const [isMediumOrLarger, setIsMediumOrLarger] = useState(false);
  const router = useRouter();

// Update the URL when dropdown changes
const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  const value = e.target.value as 'pectra' | 'fusaka' | 'glamsterdam' | 'hegota';
  setSelectedOption(value);
  router.push(`/upgrade/${value}`);
};


  useEffect(() => {
    const checkWidth = () => {
      setIsMediumOrLarger(window.innerWidth >= 768);
    };

    checkWidth(); // initial check
    window.addEventListener('resize', checkWidth);

    return () => {
      window.removeEventListener('resize', checkWidth);
    };
  }, []);

  // Fetch recent glamsterdam data with proposed EIPs from API
  useEffect(() => {
    const fetchRecentGlamsterdamData = async () => {
      console.log('Starting to fetch recent glamsterdam data...');
      setIsLoadingGlamsterdamData(true);
      try {
        const data = await getRecentGlamsterdamDataWithProposedEIPs(glamsterDamData);
        console.log('Fetched recent glamsterdam data:', data);
        setRecentGlamsterdamData(data);
      } catch (error) {
        console.error('Error fetching recent glamsterdam data:', error);
        // Set fallback data to ensure table still shows
        setRecentGlamsterdamData(glamsterDamData[glamsterDamData.length - 1]);
      } finally {
        setIsLoadingGlamsterdamData(false);
      }
    };

    fetchRecentGlamsterdamData();
  }, []);


  // (No-op) bg is consumed directly via useColorModeValue in render

  const containerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  const factorAuthor = (data: any) => {
    let list = data.split(",");
    for (let i = 0; i < list?.length; i++) {
      list[i] = list[i].split(" ");
    }
    if (list[list?.length - 1][list[list?.length - 1]?.length - 1] === "al.") {
      list.pop();
    }
    return list;
  };


  const FusakaPosts = [
    {
      image: "fusakaimg6.jpg",
      title: "A Closer Look at What’s Coming in Fusaka Devnet 2",
      content: "Ethereum’s upcoming Fusaka upgrade is nearing its final testing phase with Devnet 2, a crucial pre-release environment that determines what features make it to mainnet. ",
      link: "https://etherworld.co/2025/06/09/a-closer-look-at-whats-coming-in-fusaka-devnet-2/",
    },
    {
      image: "fusakaimg1.jpg",
      title: "Ethereum Targets June 1 for Sepolia History Expiry",
      content: "Ethereum developers have tentatively scheduled June 1, 2025, as the date to begin public testing of history expiry on the Sepolia testnet",
      link: "https://etherworld.co/2025/05/13/ethereum-targets-june-1-for-sepolia-history-expiry/",
    },
    {
      image: "fusakaimg2.jpg",
      title: "Ethereum Fusaka Devnet 0 Coming Soon",
      content: "In the All Core Devs Testing (ACDT) call held on May 12, 2025, Ethereum developers reached a consensus to launch Devnet 0 as the initial testnet for the upcoming Fusaka upgrade.",
      link: "https://etherworld.co/2025/05/13/ethereum-fusaka-devnet-0-coming-soon/",
    },
    {
      image: "fusakaimg3.jpg",
      title: "Will Fusaka Be Ready in Time? Vitalik's 2025 Vision",
      content: "Ethereum’s future hinges on Fusaka’s readiness! Can it deliver the scalability Vitalik envisions by 2025, or will challenges persist?",
      link: "https://etherworld.co/2025/03/05/will-fusaka-be-ready-in-time-vitaliks-2025-vision/",
    },
    {
      image: "fusakaimg4.jpg",
      title: "Highlights of Ethereum's All Core Devs Meeting (ACDE) #205",
      content: "Pectra Updates, Fusaka Fork Updates, EOF Implementation & Testnet Progress, Max Blob Flag & Validator Node Requirements",
      link: "https://etherworld.co/2025/02/14/highlights-of-ethereums-all-core-devs-meeting-acde-205/",
    },
    {
      image: "fusakaimg5.jpg",
      title: "Glamsterdam: The Next Upgrade After Fusaka",
      content: "Glamsterdam merges the star Gloas with Amsterdam for Ethereum’s next upgrade. Explore its origins, naming traditions, and why Devconnect cities might shape future upgrade names.",
      link: "https://etherworld.co/2025/01/09/glamsterdam-the-next-upgrade-after-fusaka/",
    },
  ];
  const GlamsterdamPosts = [
    {
      image: "https://etherworld.co/content/images/size/w2000/2025/01/ewew_11zon--5-.jpg",
      title: "Glamsterdam: The Next Upgrade After Fusaka",
      content: "Glamsterdam merges the star Gloas with Amsterdam for Ethereum’s next upgrade. Explore its origins, naming traditions, and why Devconnect cities might shape future upgrade names.",
      link: "https://etherworld.co/2025/01/09/glamsterdam-the-next-upgrade-after-fusaka/",
    },
    {

      image: "https://etherworld.co/content/images/size/w2000/2025/06/EW-Thumbnails--1-.jpg",
      title: "Ethereum Gears Up for Glamsterdam with these Proposals",
      content: "As Ethereum moves closer to its next scheduled hard fork, Glamsterdam, the core developer community is actively evaluating a shortlist of high-impact Ethereum Improvement Proposals (EIPs) referred to as headliners. ",
      link: "https://etherworld.co/2025/06/10/ethereum-gears-up-for-glamsterdam-with-these-proposals/",
    },
    {
      image: "https://etherworld.co/content/images/size/w2000/2025/07/EW-Thumbnails.jpg",
      title: "All you need to know about Ethereum Glamsterdam Upgrade",
      content: "Curated resources by EtherWorld for Glamsterdam Upgrade",
      link: "https://etherworld.co/all-you-need-to-know-about-ethereum-glamsterdam-upgrade/",
    },
    {
      image: "https://etherworld.co/content/images/size/w2000/2025/07/EW-Thumbnails--1--1.jpg",
      title: "Glamsterdam Timeline Extended for In-Depth EIP Review",
      content: "Explore how Ethereum's Glamsterdam fork timeline was extended with ACDE review sessions, strengthened PFI processes & proposal tracking.",
      link: "https://etherworld.co/glamsterdam-timeline-extended-for-in-depth-eip-review/",
    },
    {
      image: "https://etherworld.co/content/images/size/w2000/2025/07/EW-Thumbnails--3--1.jpg",
      title: "Ethereum Devs Narrow Down Glamsterdam Headliner EIPs",
      content: "Shortlisted Consensus-Layer Headliners, Divergent Viewpoints in Discussion, Feedback & Voting Timeline",
      link: "https://etherworld.co/ethereum-devs-narrow-down-glamsterdam-headliner-eips/",
    },
    {
      image: "https://etherworld.co/content/images/size/w2000/2025/07/EW-Thumbnails--2--2.jpg",
      title: "Ethereum Sets Sights on Glamsterdam Post-Fusaka Rollout",
      content: "Ethereum's core devs have outlined a detailed roadmap from headliner selection to testnet audits to launch the Glamsterdam in H1 2026 following the Fusaka.",
      link: "https://etherworld.co/ethereum-sets-sights-on-glamsterdam-post-fusaka-rollout/",
    },
    {
      image: "https://etherworld.co/content/images/size/w2000/2025/08/EW-Thumbnails--3-.jpg",
      title: "EIP-7732 (ePBS) Selected as Glamsterdam Headliner",
      content: "Ethereum selects EIP-7732 (ePBS) as Glamsterdam's consensus layer headliner, advancing censorship resistance, decentralization, & trustless block building.",
      link: "https://etherworld.co/eip-7732-epbs-selected-as-glamsterdam-headliner/",
    },
    {
      image: "https://etherworld.co/content/images/size/w2000/2025/08/EW-Thumbnails-6.jpg",
      title: "Glamsterdam Headliners Finalized",
      content: "Ethereum developers at ACDE #218 selected ePBS (EIP-7732) & BAL (EIP-7928) as Glamsterdam headliners, defining the upgrade's core roadmap.",
      link: "https://etherworld.co/glamsterdam-headliners-finalised/",
    },
    {
      image: "https://etherworld.co/content/images/size/w2000/2025/09/EW-Thumbnails--1-.jpg",
      title: "Expected EIPs in Glamsterdam Upgrade (Execution Layer)",
      content: "Glamsterdam upgrade brings key Execution Layer EIPs that boost Ethereum's scalability, developer experience, security & user usability.",
      link: "https://etherworld.co/expected-eips-in-glamsterdam-upgrade-execution-layer/",
    },
    {
      image: "https://etherworld.co/content/images/size/w2000/2025/09/EW-Thumbnails--12-.jpg",
      title: "Glamsterdam Roadmap: Why ePBS & BAL Testing Won't Be Rushed",
      content: "Ethereum's Glamsterdam upgrade debates focus on staged rollout of ePBS & BALs, prioritizing sequential testing to reduce risks & ensure smooth client development.",
      link: "https://etherworld.co/glamsterdam-roadmap-why-epbs-bal-testing-wont-be-rushed/",
    },
    {
      image: "https://etherworld.co/content/images/size/w2000/2025/09/EW-Thumbnails--5--1.jpg",
      title: "BALs Ready, ePBS Next: Glamsterdam Devnet-0 on Horizon",
      content: "Ethereum's Glamsterdam upgrade advances with BALs set for Devnet-0 & ePBS moving forward with new specs, prioritizing careful testing over rushed deployment.",
      link: "https://etherworld.co/bals-ready-epbs-next-glamsterdam-devnet-0-on-horizon/",
    },
    {
      image: "https://etherworld.co/content/images/size/w2000/2025/10/EW-Thumbnails-2.jpg",
      title: "Ethereum Governance Sets Course for Glamsterdam EIP Selection",
      content: "Ethereum developers prepare for Glamsterdam's EIP selection phase, emphasizing modular governance, client autonomy & community participation ahead of Oct 23.",
      link: "https://etherworld.co/ethereum-governance-sets-course-for-glamsterdam-eip-selection/",
    },
    {
      image: "https://etherworld.co/content/images/size/w2000/2025/10/EW-Thumbnails--2--1.jpg",
      title: "Glamsterdam Prep Begins: 10 Repricing EIPs Take Spotlight",
      content: "Ethereum developers introduce 10 major repricing EIPs under EIP-8007 to optimize compute, memory, & storage costs for the upcoming Glamsterdam upgrade, ensuring efficient scalability & fair gas pricing.",
      link: "https://etherworld.co/glamsterdam-prep-begins-10-repricing-eips-take-spotlight/",
    },
    {
      image: "https://etherworld.co/content/images/size/w2000/2025/10/EW-Thumbnails-4.jpg",
      title: "ePBS + Trustless Payments Locked for Glamsterdam V1",
      content: "Ethereum locks Trustless Payments with ePBS for Glamsterdam V1, ensuring transparent on-chain settlements & reduced reliance on off-chain relays.",
      link: "https://etherworld.co/epbs-trustless-payments-locked-for-glamsterdam-v1/",
    },
    {
      image: "https://etherworld.co/content/images/size/w2000/2025/10/EW-Thumbnails--4--2.jpg",
      title: "Glamsterdam EIP Review Begins Ahead of Devcon",
      content: "Ethereum developers begin the Glamsterdam upgrade planning phase, launching the non-headliner EIP process & a two-week review of 31 proposals ahead of Devcon week.",
      link: "https://etherworld.co/glamsterdam-eip-review-begins-ahead-of-devcon/",
    },
    {
      image: "https://etherworld.co/content/images/size/w2000/2025/11/EW-Thumbnails--3--1.jpg",
      title: "Glamsterdam at Crossroads: What's In, What's Out & What's Still Uncertain",
      content: "Glamsterdam's scope narrows as devs finalize inclusions, defer complex EIPs, and brace for a decisive ePBS breakout on December 5.",
      link: "https://etherworld.co/glamsterdam-at-crossroads-whats-in-whats-out-whats-still-uncertain/",
    },
  ];



  const PectraPosts = [
    {
      image: "pectraimg1.jpg",
      title: "Holesky Testnet Support Ends in September",
      content:
        "Holesky testnet support ends in September as Ethereum transitions to Hoodi for improved validator testing & Pectra upgrade readiness.",
      link: "https://etherworld.co/2025/03/19/holesky-testnet-support-ends-in-september/",
    },
    {
      image: "pectraimg3.jpg",
      title: "New Ethereum Testnet ‘Hoodi’ Announced for Pectra Testing",
      content:
        "Hoodi is Ethereum’s new testnet, designed to replace Holesky with a mainnet-like environment for testing Pectra, validator exits, & staking operations.",
      link: "https://etherworld.co/2025/03/14/new-ethereum-testnet-hoodi-announced-for-pectra-testing/",
    },
    {
      image: "pectraimg4.jpg",
      title: "How Holesky Finally Reached Stability",
      content:
        "A sneak peek at how the Ethereum community came together to fix Holesky after two weeks of chaos.",
      link: "https://etherworld.co/2025/03/11/how-holesky-finally-reached-stability/",
    },
    {
      image: "pectraimg5.png",
      title: "Holesky and Hoodi Testnet Updates",
      content:
        "The Pectra testnet activation revealed issues in clients with deposit contract configurations changes on Ethereum testnets. While Sepolia's recovery was straightforward and the network has since fully recovered, Holesky experienced extensive inactivity leaks as pa...",
      link: "https://blog.ethereum.org/2025/03/18/hoodi-holesky",
    },
    {
      image: "pectraimg6.jpg",
      title: "Sepolia Pectra Incident Update",
      content:
        "A sneak peek at how the Ethereum community came together to fix Holesky after two weeks of chaos.",
      link: "At 7:29 UTC today, on epoch 222464, the Pectra network upgrade went live on the Sepolia testnet. Unfortunately, an issue with Sepolia's permissioned deposit contract prevented many execution layer clients from including transactions in blocks.",
    },
  ]

  const pectraData = [
    {
      eip: "2537",
      title: "Precompile for BLS12-381 curve operations",
      author:
        "Alex Vlasov (@shamatar), Kelly Olson (@ineffectualproperty), Alex Stokes (@ralexstokes), Antonio Sanso (@asanso)",
      link: "https://eipsinsight.com/eips/eip-2537",
      type: "Standards Track",
      category: "Core",
      discussion:
        "https://ethereum-magicians.org/t/eip2537-bls12-precompile-discussion-thread/4187",
    },
    {
      eip: "2935",
      title: "Serve historical block hashes from state",
      author:
        "Vitalik Buterin (@vbuterin), Tomasz Stanczak (@tkstanczak), Guillaume Ballet (@gballet), Gajinder Singh (@g11tech), Tanishq Jasoria (@tanishqjasoria), Ignacio Hagopian (@jsign), Jochem Brouwer (@jochem-brouwer)",
      link: "https://eipsinsight.com/eips/eip-2935",
      type: "Standards Track",
      category: "Core",
      discussion:
        "https://ethereum-magicians.org/t/eip-2935-save-historical-block-hashes-in-state/4565",
    },
    {
      eip: "6110",
      title: "Supply validator deposits on chain",
      author:
        "Mikhail Kalinin (@mkalinin), Danny Ryan (@djrtwo), Peter Davies (@petertdavies)",
      link: "https://eipsinsight.com/eips/eip-6110",
      type: "Standards Track",
      category: "Core",
      discussion:
        "https://ethereum-magicians.org/t/eip-6110-supply-validator-deposits-on-chain/12072",
    },
    {
      eip: "7002",
      title: "Execution layer triggerable withdrawals",
      author:
        "Danny Ryan (@djrtwo), Mikhail Kalinin (@mkalinin), Ansgar Dietrichs (@adietrichs), Hsiao-Wei Wang (@hwwhww), lightclient (@lightclient)",
      link: "https://eipsinsight.com/eips/eip-7002",
      type: "Standards Track",
      category: "Core",
      discussion:
        "https://ethereum-magicians.org/t/eip-7002-execution-layer-triggerable-exits/14195",
    },
    {
      eip: "7251",
      title: "Increase the MAX_EFFECTIVE_BALANCE",
      author:
        "mike (@michaelneuder), Francesco (@fradamt), dapplion (@dapplion), Mikhail (@mkalinin), Aditya (@adiasg), Justin (@justindrake), lightclient (@lightclient)",
      link: "https://eipsinsight.com/eips/eip-2251",
      type: "Standards Track",
      category: "Core",
      discussion:
        "https://ethereum-magicians.org/t/eip-7251-increase-the-max-effective-balance/15982",
    },
    {
      eip: "7549",
      title: "Move committee index outside Attestation",
      author: "dapplion (@dapplion)",
      link: "https://eipsinsight.com/eips/eip-7549",
      type: "Standards Track",
      category: "Core",
      discussion:
        "https://ethereum-magicians.org/t/eip-7549-move-committee-index-outside-attestation/16390",
    },
    {
      eip: "7685",
      title: "General purpose execution layer requests",
      author: "lightclient (@lightclient)",
      link: "https://eipsinsight.com/eips/eip-7685",
      type: "Standards Track",
      category: "Core",
      discussion: "https://ethereum-magicians.org/t/eip-7685-general-purpose-execution-layer-requests/19668"
    },
    {
      eip: "7702",
      title: "Set EOA account code",
      author: "Vitalik Buterin (@vbuterin), Sam Wilson (@SamWilsn), Ansgar Dietrichs (@adietrichs), Matt Garnett (@lightclient)",
      link: "https://eipsinsight.com/eips/eip-7702",
      type: "Standards Track",
      category: "Core",
      discussion: "https://ethereum-magicians.org/t/eip-set-eoa-account-code-for-one-transaction/19923"
    },
    {
      eip: "7691",
      title: "Blob throughput increase",
      author: "Parithosh Jayanthi (@parithosh), Toni Wahrstätter (@nerolation), Sam Calder-Mason (@samcm), Andrew Davis (@savid), Ansgar Dietrichs (@adietrichs)",
      link: "https://eipsinsight.com/eips/eip-7691",
      type: "Standards Track",
      category: "Core",
      discussion: "https://ethereum-magicians.org/t/eip-7691-blob-throughput-increase/19694"
    },
        {
      eip: "7642",
      title: "eth/69 - history expiry and simpler receipts",
      author: "Marius van der Wijden (@MariusVanDerWijden), Felix Lange <fjl@ethereum.org>, Ahmad Bitar (@smartprogrammer93) <smartprogrammer@windowslive.com>",
      link: "https://eipsinsight.com/eips/eip-7642",
      type: "Standards Track",
      category: "Networking",
      discussion: "https://ethereum-magicians.org/t/eth-70-drop-pre-merge-fields-from-eth-protocol/19005"
    },
    {
      eip: "7623",
      title: "Increase calldata cost",
      author: "Toni Wahrstätter (@nerolation), Vitalik Buterin (@vbuterin)",
      link: "https://eipsinsight.com/eips/eip-7623",
      type: "Standards Track",
      category: "Core",
      discussion: "https://ethereum-magicians.org/t/eip-7623-increase-calldata-cost/18647"
    },
    {
      eip: "7840",
      title: "Add blob schedule to EL config files",
      author: "lightclient (@lightclient)",
      link: "https://eipsinsight.com/eips/eip-7840",
      type: "Informational",
      category: "Informational",
      discussion: "https://ethereum-magicians.org/t/add-blob-schedule-to-execution-client-configuration-files/22182"
    },
  ];

// SFI (Scheduled for Inclusion) EIPs for Glamsterdam
const glamsterdamScheduledData = [
  {
    eip: "7732",
    title: "Enshrined Proposer-Builder Separation (ePBS)",
    author: "Terence (@terencechain), Potuz (@potuz), Mike Neuder (@michaelneuder), Francesco D'Amato (@fradamt)",
    link: "https://eipsinsight.com/eips/eip-7732",
    type: "Standards Track",
    category: "Core",
    discussion: "https://ethereum-magicians.org/t/eip-7732-enshrined-proposer-builder-separation-epbs/20207"
  },
  {
    eip: "7928",
    title: "Increase blob throughput",
    author: "Toni Wahrstätter (@nerolation)",
    link: "https://eipsinsight.com/eips/eip-7928",
    type: "Standards Track",
    category: "Core",
    discussion: "https://ethereum-magicians.org/t/eip-7928-increase-blob-throughput/23523"
  }
];

// CFI (Considered for Inclusion) EIPs for Glamsterdam
// CFI (Considered for Inclusion) EIPs for Glamsterdam
const glamsterdamData = [
  {
    eip: "2780",
    title: "Reduce intrinsic transaction gas",
    author: "Matt Garnett (@lightclient), Uri Klarman (@uriklarman), Ben Adams (@benaadams)",
    link: "https://eipsinsight.com/eips/eip-2780",
    type: "Standards Track",
    category: "Core",
    discussion: "https://ethereum-magicians.org/t/eip-2780-reduce-intrinsic-cost-of-transactions/4413"
  },
  {
    eip: "7688",
    title: "Forward compatible consensus data structures",
    author: "Etan Kissling (@ekissling), Consensus Layer Developers",
    link: "https://eipsinsight.com/eips/eip-7688",
    type: "Standards Track",
    category: "Core",
    discussion: "https://ethereum-magicians.org/t/eip-7688-forward-compatible-consensus-data-structures/22215"
  },
  {
    eip: "7708",
    title: "ETH transfers emit a log",
    author: "Vitalik Buterin (@vbuterin), Peter Davies (@petertdavies)",
    link: "https://eipsinsight.com/eips/eip-7708",
    type: "Standards Track",
    category: "Core",
    discussion: "https://ethereum-magicians.org/t/eip-7708-eth-transfers-emit-a-log/20034"
  },
  {
    eip: "7778",
    title: "Block Gas Accounting without Refunds",
    author: "Ben Adams (@benaadams), Toni Wahrstätter (@nerolation)",
    link: "https://eipsinsight.com/eips/eip-7778",
    type: "Standards Track",
    category: "Core",
    discussion: "https://ethereum-magicians.org/t/eip-7778-prevent-block-gas-smuggling/21234"
  },
  {
    eip: "7843",
    title: "SLOTNUM opcode",
    author: "Marc Harvey-Hill (@Marchhill)",
    link: "https://eipsinsight.com/eips/eip-7843",
    type: "Standards Track",
    category: "Core",
    discussion: "https://ethereum-magicians.org/t/eip-7843-slotnum-opcode/22234"
  },
  {
    eip: "7904",
    title: "General Repricing",
    author: "Jacek Glen (@JacekGlen), Lukasz Glen (@lukasz-glen), Maria Silva (@misilva73)",
    link: "https://eipsinsight.com/eips/eip-7904",
    type: "Standards Track",
    category: "Core",
    discussion: "https://ethereum-magicians.org/t/gas-cost-repricing-to-reflect-computational-complexity/23067"
  },
  {
    eip: "7976",
    title: "Increase Calldata Floor Cost",
    author: "Toni Wahrstätter (@nerolation)",
    link: "https://eipsinsight.com/eips/eip-7976",
    type: "Standards Track",
    category: "Core",
    discussion: "https://ethereum-magicians.org/t/eip-7976-further-increase-calldata-cost/24597"
  },
  {
    eip: "7981",
    title: "Increase Access List Cost",
    author: "Toni Wahrstätter (@nerolation)",
    link: "https://eipsinsight.com/eips/eip-7981",
    type: "Standards Track",
    category: "Core",
    discussion: "https://ethereum-magicians.org/t/eip-7981-increase-access-list-cost/24680"
  },
  {
    eip: "7997",
    title: "Deterministic Factory Predeploy",
    author: "Danno Ferrin (@shemnon)",
    link: "https://eipsinsight.com/eips/eip-7997",
    type: "Standards Track",
    category: "Core",
    discussion: "https://ethereum-magicians.org/t/eip-7997-disallow-create-and-create2-to-deploy-empty-initcode/25021"
  },
  {
    eip: "8024",
    title: "Backward compatible SWAPN, DUPN, EXCHANGE",
    author: "Francisco Giordano (@frangio), Charles Cooper (@charles-cooper), Alex Beregszaszi (@axic)",
    link: "https://eipsinsight.com/eips/eip-8024",
    type: "Standards Track",
    category: "Core",
    discussion: "https://ethereum-magicians.org/t/eip-8024-backward-compatible-swapn-dupn-exchange/25486"
  },
  {
    eip: "8038",
    title: "State-access gas cost increase",
    author: "Maria Silva (@misilva73), Wei Han Ng (@weiihann), Ansgar Dietrichs (@adietrichs)",
    link: "https://eipsinsight.com/eips/eip-8038",
    type: "Standards Track",
    category: "Core",
    discussion: "https://ethereum-magicians.org/t/eip-8038-state-access-gas-cost-update/25693"
  },
  {
    eip: "8045",
    title: "Exclude slashed validators from proposing",
    author: "Francesco D'Amato (@fradamt), Barnabas Busa (@barnabasbusa)",
    link: "https://eipsinsight.com/eips/eip-8045",
    type: "Standards Track",
    category: "Core",
    discussion: "https://ethereum-magicians.org/t/eip-8045-exclude-slashed-validators-from-proposing/25850"
  },
  {
    eip: "8061",
    title: "Increase exit and consolidation churn",
    author: "Francesco D'Amato (@fradamt), Anders Elowsson (@anderselowsson)",
    link: "https://eipsinsight.com/eips/eip-8061",
    type: "Standards Track",
    category: "Core",
    discussion: "https://ethereum-magicians.org/t/eip-8061-increase-churn-limits/25991"
  },
  {
    eip: "8070",
    title: "Sparse Blobpool",
    author: "Raúl Kripalani (@raulk), Bosul Mun (@healthykim), Francesco D'Amato (@fradamt)",
    link: "https://eipsinsight.com/eips/eip-8070",
    type: "Standards Track",
    category: "Networking",
    discussion: "https://ethereum-magicians.org/t/eip-8070-sparse-blobpool/26023"
  },
  {
    eip: "8080",
    title: "Let exits use the consolidation queue",
    author: "Francesco D'Amato (@fradamt)",
    link: "https://eipsinsight.com/eips/eip-8080",
    type: "Standards Track",
    category: "Core",
    discussion: "https://ethereum-magicians.org/t/eip-8080-let-exits-use-the-consolidation-queue/26552"
  }
];

// PFI (Proposed for Inclusion) EIPs for Glamsterdam
// PFI (Proposed for Inclusion) EIPs for Glamsterdam
const glamsterdamProposedData = [
  {
    eip: "5920",
    title: "PAY opcode",
    author: "Gavin John (@Pandapip1), Zainan Victor Zhou (@xinbenlv)",
    link: "https://eipsinsight.com/eips/eip-5920",
    type: "Standards Track",
    category: "Core",
    discussion: "https://ethereum-magicians.org/t/eip-5920-pay-opcode/11717"
  },
  {
    eip: "7610",
    title: "Revert creation in case of non-empty storage",
    author: "Andrei Maiboroda (@gumb0)",
    link: "https://eipsinsight.com/eips/eip-7610",
    type: "Standards Track",
    category: "Core",
    discussion: "https://ethereum-magicians.org/t/eip-7610-revert-creation-in-case-of-non-empty-storage/18938"
  },
  {
    eip: "7793",
    title: "Conditional Transactions",
    author: "lightclient (@lightclient)",
    link: "https://eipsinsight.com/eips/eip-7793",
    type: "Standards Track",
    category: "Core",
    discussion: "https://ethereum-magicians.org/t/eip-7793-eip-7702-lifetime-extension/22244"
  },
  {
    eip: "7872",
    title: "Max blob flag for local builders",
    author: "Vitalik Buterin (@vbuterin)",
    link: "https://eipsinsight.com/eips/eip-7872",
    type: "Standards Track",
    category: "Core",
    discussion: "https://ethereum-magicians.org/t/eip-7872-separate-gas-for-call-data/22755"
  },
  {
    eip: "7903",
    title: "Remove Initcode Size Limit",
    author: "Charles Cooper (@charles-cooper)",
    link: "https://eipsinsight.com/eips/eip-7903",
    type: "Standards Track",
    category: "Core",
    discussion: "https://ethereum-magicians.org/t/remove-initcode-size-limit/23066"
  },
  {
    eip: "7907",
    title: "Meter Contract Code Size And Increase Limit",
    author: "Jacek Glen (@JacekGlen)",
    link: "https://eipsinsight.com/eips/eip-7907",
    type: "Standards Track",
    category: "Core",
    discussion: "https://ethereum-magicians.org/t/eip-remove-contract-size-limit/23156"
  },
  {
    eip: "7949",
    title: "Schema for genesis.json files",
    author: "Ulaş Erdoğan (@ulerdogan), Doğan Alpaslan (@doganalpaslan)",
    link: "https://eipsinsight.com/eips/eip-7949",
    type: "Standards Track",
    category: "Core",
    discussion: "https://ethereum-magicians.org/t/eip-7949-precompiled-for-secp256r1-curve-support/23890"
  },
  {
    eip: "7971",
    title: "Hard Limits for Transient Storage",
    author: "Charles Cooper (@charles-cooper), Ben Adams (@benaadams)",
    link: "https://eipsinsight.com/eips/eip-7971",
    type: "Standards Track",
    category: "Core",
    discussion: "https://ethereum-magicians.org/t/add-eip-hard-limit-and-cost-reduction-for-transient-storage-allocation/24542"
  },
  {
    eip: "8032",
    title: "Size-Based Storage Gas Pricing",
    author: "Guillaume Ballet (@gballet), Ignacio Hagopian (@jsign)",
    link: "https://eipsinsight.com/eips/eip-8032",
    type: "Standards Track",
    category: "Core",
    discussion: "https://ethereum-magicians.org/t/eip-8032-verkle-state-transition-mechanics/25542"
  },
  {
    eip: "8037",
    title: "State Creation Gas Cost Increase",
    author: "Mikhail Kalinin (@mkalinin), Francesco D'Amato (@fradamt)",
    link: "https://eipsinsight.com/eips/eip-8037",
    type: "Standards Track",
    category: "Core",
    discussion: "https://ethereum-magicians.org/t/uncouple-execution-payload-from-beacon-block/23029"
  },
  {
    eip: "8051",
    title: "Precompile for ML-DSA signature verification",
    author: "lightclient (@lightclient)",
    link: "https://eipsinsight.com/eips/eip-8051",
    type: "Standards Track",
    category: "Core",
    discussion: "https://ethereum-magicians.org/t/eip-8051-precompile-for-ml-dsa/25800"
  }
];


  const fusakaData = [
    {
      eip: "7594",
      title: "PeerDAS - Peer Data Availability Sampling",
      author: "Danny Ryan (@djrtwo), Dankrad Feist (@dankrad), Francesco D'Amato (@fradamt), Hsiao-Wei Wang (@hwwhww)",
      link: "https://eipsinsight.com/eips/eip-7594",
      type: "Standards Track",
      category: "Core",
      discussion: "https://ethereum-magicians.org/t/eip-7594-peerdas-peer-data-availability-sampling/18215"
    },
    {
      eip: "7823",
      title: "Set upper bounds for MODEXP",
      author: "Alex Beregszaszi (@axic), Radoslaw Zagorowicz (@rodiazet)",
      link: "https://eipsinsight.com/eips/eip-7823",
      type: "Standards Track",
      category: "Core",
      discussion: "https://ethereum-magicians.org/t/eip-7823-set-upper-bounds-for-modexp/21798"
    },
    {
      eip: "7825",
      title: "Transaction Gas Limit Cap",
      author: "Giulio Rebuffo (@Giulio2002)",
      link: "https://eipsinsight.com/eips/eip-7825",
      type: "Standards Track",
      category: "Core",
      discussion: "https://ethereum-magicians.org/t/eip-7825-transaction-gas-limit-cap/21848"
    },
    {
      eip: "7883",
      title: "ModExp Gas Cost Increase",
      author: "Marcin Sobczak (@marcindsobczak), Marek Moraczyński (@MarekM25), Marcos Maceo (@stdevMac)",
      link: "https://eipsinsight.com/eips/eip-7883",
      type: "Standards Track",
      category: "Core",
      discussion: "https://ethereum-magicians.org/t/eip-7883-modexp-gas-cost-increase/22841"
    },
    {
      eip: "7917",
      title: "Deterministic proposer lookahead",
      author: "Lin Oshitani (@linoscope), Justin Drake (@JustinDrake)",
      link: "https://eipsinsight.com/eips/eip-7917",
      type: "Standards Track",
      category: "Core",
      discussion: "https://ethereum-magicians.org/t/eip-7917-deterministic-proposer-lookahead/23259"
    },
    {
      eip: "7918",
      title: "Blob base fee bounded by execution cost",
      author: "Anders Elowsson (@anderselowsson), Ben Adams (@benaadams), Francesco D'Amato (@fradamt)",
      link: "https://eipsinsight.com/eips/eip-7918",
      type: "Standards Track",
      category: "Core",
      discussion: "https://ethereum-magicians.org/t/eip-blob-base-fee-bounded-by-price-of-blob-carrying-transaction/23271"
    },
    {
      eip: "7934",
      title: "RLP Execution Block Size Limit",
      author: "Giulio Rebuffo (@Giulio2002), Ben Adams (@benaadams), Storm Slivkoff (@sslivkoff)",
      link: "https://eipsinsight.com/eips/eip-7934",
      type: "Standards Track",
      category: "Core",
      discussion: "https://ethereum-magicians.org/t/eip-7934-add-bytesize-limit-to-blocks/23589"
    },
    {
      eip: "7939",
      title: "Count leading zeros (CLZ) opcode",
      author: "Charles Cooper (@charles-cooper)",
      link: "https://eipsinsight.com/eips/eip-7939",
      type: "Standards Track",
      category: "Core",
      discussion: "https://ethereum-magicians.org/t/eip-7939-clz-count-leading-zeros-opcode/23605"
    },
    {
      eip: "7951",
      title: "Precompile for secp256r1 Curve Support",
      author: "Ulaş Erdoğan (@ulerdogan), Doğan Alpaslan (@doganalpaslan)",
      link: "https://eipsinsight.com/eips/eip-7951",
      type: "Standards Track",
      category: "Core",
      discussion: "https://ethereum-magicians.org/t/eip-7951-precompiled-for-secp256r1-curve-support/23890"
    },
    {
      eip: "7892",
      title: "Blob Parameter Only Hardforks",
      author: "Mark Mackey (@ethDreamer)",
      link: "https://eipsinsight.com/eips/eip-7892",
      type: "Informational",
      category: "",
      discussion: "https://ethereum-magicians.org/t/eip-7892-blob-parameter-only-hardforks/23018"
    },
    {
      eip: "7642",
      title: "eth/69 - Drop pre-merge fields",
      author: "Marius van der Wijden (@MariusVanDerWijden), Felix Lange, Ahmad Bitar (@smartprogrammer93)",
      link: "https://eipsinsight.com/eips/eip-7642",
      type: "Standards Track",
      category: "Networking",
      discussion: "https://ethereum-magicians.org/t/eth-70-drop-pre-merge-fields-from-eth-protocol/19005"
    },
    {
      eip: "7910",
      title: "eth_config JSON-RPC Method",
      author: "lightclient (@lightclient)",
      link: "https://eipsinsight.com/eips/eip-7910",
      type: "Standards Track",
      category: "Interface",
      discussion: "https://ethereum-magicians.org/t/eip-7910-eth-config-json-rpc-method/23149"
    },
    {
      eip: "7935",
      title: "Set default gas limit to 60M",
      author: "Sophia Gold (@sophia-gold), Parithosh Jayanthi (@parithoshj), Toni Wahrstätter (@nerolation), Carl Beekhuizen (@CarlBeek), Ansgar Dietrichs (@adietrichs), Dankrad Feist (@dankrad), Alex Stokes (@ralexstokes), Josh Rudolph (@jrudolph), Giulio Rebuffo (@Giulio2002), Storm Slivkoff (@sslivkoff)",
      link: "https://eipsinsight.com/eips/eip-7935",
      type: "Informational",
      category: "",
      discussion: "https://ethereum-magicians.org/t/eip-7935-set-default-gas-limit-to-xx0m/23789"
    }
  ];

  const hegotaData = [
    {
      eip: "8081",
      title: "Hardfork Meta - Hegotá Upgrade",
      author: "Tim Beiko (@timbeiko), Alex Stokes (@ralexstokes)",
      link: "https://eipsinsight.com/eips/eip-8081",
      type: "Meta",
      category: "",
      discussion: "https://ethereum-magicians.org/t/eip-8081-heka-bogota-network-upgrade-meta-thread/26876"
    }
  ];

  

  const scrollToHash = () => {
    const hash = window.location.hash;
    if (hash) {
      const element = document.getElementById(hash.slice(1));
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  useEffect(() => {
    if (!isLoading) {
      scrollToHash();
    }
  }, [isLoading]);

  useEffect(() => {
    router.events.on("routeChangeComplete", scrollToHash);
    return () => {
      router.events.off("routeChangeComplete", scrollToHash);
    };
  }, [router]);


  const currentPosts = selectedOption === 'pectra' ? PectraPosts : selectedOption === 'fusaka' ? FusakaPosts : selectedOption === 'hegota' ? [] : GlamsterdamPosts;
  const currentData = selectedOption === 'pectra' ? pectraData : selectedOption === 'fusaka' ? fusakaData : selectedOption === 'hegota' ? hegotaData : glamsterdamData;
  const upgradeName = selectedOption === 'pectra' ? "Pectra" : selectedOption === 'fusaka' ? "Fusaka" : selectedOption === 'hegota' ? "Hegotá" : "Glamsterdam";

  useScrollSpy([
    "upgrade-overview",
    "upgrade-timeline",
    "network-stats",
    "horizontal-timeline",
    "upgrade-chart",
    "select-upgrade",
    "pectra",
    "fusaka",
    "glamsterdam",
    "hegota",
    "NetworkUpgrades",
    "upgrade-description",
    "upgrade-blogs",
    "eip-status",
    "declined-eips",
    "AuthorContributions",
    "NetworkUpgradesChartp",
  ]);

  useEffect(() => {
    router.events.on("routeChangeComplete", scrollToHash);
    return () => {
      router.events.off("routeChangeComplete", scrollToHash);
    };
  }, [router]);
return (
  <>
    <AllLayout>
      <Box className={`${mont.className}`} px={{ base: 3, md: 5, lg: 8 }} py={{ base: 3, md: 4, lg: 6 }}>
        {isLoading ? (
          <Flex justify="center" align="center" minH="70vh">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Spinner size="xl" />
            </motion.div>
          </Flex>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
          {/* AdHeader */}
          <AdHeader
            title="Ethereum Network Upgrades"
            emoji="⚡"
            headingLevel="h3"
          />

          {/* Timeline Section */}
          <Box
            id="upgrade-timeline"
            bg={useColorModeValue("white", "gray.800")}
            borderRadius="xl"
            boxShadow="sm"
            border="1px solid"
            borderColor={useColorModeValue("gray.200", "gray.700")}
            mb={5}
            p={4}
          >
            <VStack align="stretch" spacing={3}>
              {/* <HStack spacing={2}>
                <Icon as={FaProjectDiagram} boxSize={4} color="blue.500" />
                <Heading 
                  size="lg"
                  color={useColorModeValue("gray.800", "white")}
                  fontWeight="700"
                  
                >
                  Ethereum Network Upgrade Timeline
                </Heading>
              </HStack>
              <Text 
                fontSize="md" 
                color={useColorModeValue("gray.600", "gray.400")}
                lineHeight="1.5"
                
              >
                Comprehensive timeline of Ethereum network upgrades and their associated EIP implementations
              </Text> */}
              <Box>
                <ZoomableTimeline 
                  svgPath="/stages/ethupgradetimeline.png" 
                  alt="Ethereum Upgrade Timeline"
                />
              </Box>
            </VStack>
          </Box>

          {/* Stats Cards & Flowchart Section */}
<Grid
  id="network-stats"
  templateColumns={{ base: '1fr', lg: '1fr 1fr' }}
  gap={5}
  mb={5}
  alignItems="stretch"   // ⭐ KEY LINE
>

            {/* Left: Stats Cards */}
            <GridItem display="flex">
              <VStack spacing={4} w="100%">
                <Box
                  as={motion.div}
                  whileHover={{ y: -4, scale: 1.02 }}
                  transition={{ duration: 0.2 } as any}
                  bg={useColorModeValue('white', 'gray.800')}
                  p={4}
                  borderRadius="xl"
                  border="2px solid"
                  borderColor={useColorModeValue('gray.200', 'gray.700')}
                  boxShadow="md"
                  _hover={{
                    borderColor: 'blue.500',
                    boxShadow: 'xl'
                  }}
                  w="100%"
                >
                  <Stat>
                    <HStack spacing={2} mb={2}>
                      <Icon as={FaRocket} boxSize={5} color="blue.500" />
                      <StatLabel fontSize="18px" fontWeight="medium" color={useColorModeValue('gray.600', 'gray.400')} >
                        Total Network Upgrades
                      </StatLabel>
                    </HStack>
                    <StatNumber fontSize="3xl" fontWeight="bold" color={useColorModeValue('gray.800', 'white')} >
                      21
                    </StatNumber>
                    <StatHelpText fontSize="sm" color={useColorModeValue('gray.500', 'gray.500')} mt={1} >
                      Since Frontier Thawing (2015)
                    </StatHelpText>
                  </Stat>
                </Box>

                <SimpleGrid columns={2} spacing={4} w="100%">
                  <Box
                    as={motion.div}
                    whileHover={{ y: -4, scale: 1.02 }}
                    transition={{ duration: 0.2 } as any}
                    bg={useColorModeValue('white', 'gray.800')}
                    p={4}
                    borderRadius="xl"
                    border="2px solid"
                    borderColor={useColorModeValue('gray.200', 'gray.700')}
                    boxShadow="md"
                    _hover={{
                      borderColor: 'green.500',
                      boxShadow: 'xl'
                    }}
                  >
                    <Stat>
                      <HStack spacing={2} mb={2}>
                        <Icon as={FaCode} boxSize={5} color="green.500" />
                        <StatLabel fontSize="18px" fontWeight="medium" color={useColorModeValue('gray.600', 'gray.400')} >
                          Execution Layer
                        </StatLabel>
                      </HStack>
                      <StatNumber fontSize="3xl" fontWeight="bold" color={useColorModeValue('gray.800', 'white')} >
                        19
                      </StatNumber>
                      <StatHelpText fontSize="sm" color={useColorModeValue('gray.500', 'gray.500')} mt={1} >
                        Protocol & EVM
                      </StatHelpText>
                    </Stat>
                  </Box>

                  <Box
                    as={motion.div}
                    whileHover={{ y: -4, scale: 1.02 }}
                    transition={{ duration: 0.2 } as any}
                    bg={useColorModeValue('white', 'gray.800')}
                    p={4}
                    borderRadius="xl"
                    border="2px solid"
                    borderColor={useColorModeValue('gray.200', 'gray.700')}
                    boxShadow="md"
                    _hover={{
                      borderColor: 'purple.500',
                      boxShadow: 'xl'
                    }}
                  >
                    <Stat>
                      <HStack spacing={2} mb={2}>
                        <Icon as={FaLayerGroup} boxSize={5} color="purple.500" />
                        <StatLabel fontSize="18px" fontWeight="medium" color={useColorModeValue('gray.600', 'gray.400')} >
                          Consensus Layer
                        </StatLabel>
                      </HStack>
                      <StatNumber fontSize="3xl" fontWeight="bold" color={useColorModeValue('gray.800', 'white')} >
                        6
                      </StatNumber>
                      <StatHelpText fontSize="sm" color={useColorModeValue('gray.500', 'gray.500')} mt={1} >
                        Beacon Chain
                      </StatHelpText>
                    </Stat>
                  </Box>
                </SimpleGrid>

                <Box
                  as={motion.div}
                  whileHover={{ y: -4, scale: 1.02 }}
                  transition={{ duration: 0.2 } as any}
                  bg={useColorModeValue('white', 'gray.800')}
                  p={4}
                  borderRadius="xl"
                  border="2px solid"
                  borderColor={useColorModeValue('gray.200', 'gray.700')}
                  boxShadow="md"
                  _hover={{
                    borderColor: 'orange.500',
                    boxShadow: 'xl'
                  }}
                  w="100%"
                >
                  <Stat>
                    <HStack spacing={2} mb={2}>
                      <Icon as={FaNetworkWired} boxSize={5} color="orange.500" />
                      <StatLabel fontSize="18px" fontWeight="medium" color={useColorModeValue('gray.600', 'gray.400')} >
                        Total Core EIPs
                      </StatLabel>
                    </HStack>
                    <StatNumber fontSize="3xl" fontWeight="bold" color={useColorModeValue('gray.800', 'white')} >
                      62
                    </StatNumber>
                    <StatHelpText fontSize="sm" color={useColorModeValue('gray.500', 'gray.500')} mt={1} >
                      Implemented in upgrades
                    </StatHelpText>
                  </Stat>
                </Box>
              </VStack>
            </GridItem>

            {/* Right: EIP Inclusion Flowchart (Zoomable controls like ZoomableTimeline) */}
            <GridItem display={{ base: 'none', lg: 'block' }}>
              <ZoomableTimeline
                svgPath="/stages/eip-incl.png"
                alt="EIP Inclusion Process Flowchart"
              />
            </GridItem>


            {/* Mobile: EIP Inclusion Flowchart */}
            <GridItem display={{ base: 'block', lg: 'none' }} colSpan={1}>
              <Box
                bg={useColorModeValue('gray.50', 'gray.900')}
                borderRadius="xl"
                overflow="hidden"
                border="2px solid"
                borderColor={useColorModeValue('gray.200', 'gray.700')}
                boxShadow="md"
                display="flex"
                alignItems="center"
                justifyContent="center"
                p={4}
                minH="300px"
              >
                <Image
                  src="/stages/eip-incl.png"
                  alt="EIP Inclusion Process Flowchart"
                  maxW="100%"
                  h="auto"
                  objectFit="contain"
                  borderRadius="lg"
                />
              </Box>
            </GridItem>
          </Grid>

          {/* Horizontal Upgrade Timeline */}
          <Box
            id="horizontal-timeline"
            pt={4}
            pb={4}
            mb={5}
          >
            <HorizontalUpgradeTimeline
              selectedUpgrade={selectedOption}
              onUpgradeClick={(upgrade) => {
                setSelectedOption(upgrade);
                router.push(`/upgrade/${upgrade}`);
              }}
            />
          </Box>

          {/* Network Upgrades Overview Chart */}
          <Box
            id="upgrade-chart"
            pt={4}
            pb={4}
            mb={5}
          >
            <NetworkUpgradesChart />
          </Box>

          {/* Upgrade Selector Section */}
          <Box
            id="select-upgrade"
            p={4}
            mb={5}
          >
            <Flex alignItems="center" mb={4}>
              <Heading fontSize="28px" fontWeight="semibold" color="#48D1CC" mr={2}>Select Network Upgrade</Heading>
              <CopyLink link={`${typeof window !== 'undefined' ? window.location.origin : ''}/upgrade#select-upgrade`} />
            </Flex>
            
            <Flex 
              direction={{ base: 'column', lg: 'row' }} 
              gap={4}
              align={{ base: 'stretch', lg: 'flex-start' }}
              justify="space-between"
            >
              <Box flex={{ base: '1', lg: '0 0 auto' }}>
                <Select
                  value={selectedOption}
                  onChange={handleSelectChange}
                  size="md"
                  maxW="300px"
                  borderRadius="md"
                >
                  <option value="hegota">Hegotá</option>
                  <option value="glamsterdam">Glamsterdam</option>
                  <option value="fusaka">Fusaka</option>
                  <option value="pectra">Pectra</option>
                </Select>
              </Box>
              
            </Flex>
            
            {/* FUSAKA Countdown - Only show when Fusaka is selected */}
            {/* {selectedOption === 'fusaka' && (
              <Box mt={4}>
                <SlotCountdown />
              </Box>
            )} */}
          </Box>

          {/* Network Upgrade Inclusion Stages */}
          {selectedOption !== 'hegota' && (
            <Box
              bg={useColorModeValue("white", "gray.800")}
              borderRadius="xl"
              boxShadow="sm"
              border="1px solid"
              borderColor={useColorModeValue("gray.200", "gray.700")}
              p={4}
              mb={5}
              id="NetworkUpgrades"
            >
              <Flex alignItems="center" mb={4}>
                <Heading fontSize="36px" fontWeight="bold" color="#40E0D0" mr={2}>Network Upgrade Inclusion Stages</Heading>
                <CopyLink link={`${typeof window !== 'undefined' ? window.location.origin : ''}/upgrade#NetworkUpgrades`} />
              </Flex>
              <UpgradesTimeline
                selectedOption={selectedOption}
                setSelectedOption={setSelectedOption}
                pectraData={pectraData}
                fusakaData={fusakaData}
              />
            </Box>
          )}
          


          {/* Upgrade Description Section */}
          <Box
            id="upgrade-description"
            bg={useColorModeValue("white", "gray.800")}
            borderRadius="xl"
            boxShadow="sm"
            border="1px solid"
            borderColor={useColorModeValue("gray.200", "gray.700")}
            p={4}
            mb={5}
          >
            <Flex alignItems="center" mb={4}>
              <Heading fontSize="36px" fontWeight="bold" color="#40E0D0" mr={2}>About {selectedOption === 'pectra' ? 'Pectra' : selectedOption === 'fusaka' ? 'Fusaka' : selectedOption === 'hegota' ? 'Hegotá' : 'Glamsterdam'}</Heading>
              <CopyLink link={`${typeof window !== 'undefined' ? window.location.origin : ''}/upgrade#upgrade-description`} />
            </Flex>
            {selectedOption === 'pectra' ? (
              <Text fontSize="md" lineHeight="1.75" textAlign="justify" >
                Ethereum developers are moving toward the next major network upgrade, Prague and Electra,
                collectively known as{" "}
                <NLink href="https://eipsinsight.com/eips/eip-7600">
                  <Text as="span" color="blue.500" textDecor="underline">
                    Pectra
                  </Text>
                </NLink>. This upgrade will involve significant changes to the{" "}
                <NLink href="https://www.youtube.com/watch?v=nJ57mkttCH0">
                  <Text as="span" color="blue.500" textDecor="underline">
                    Execution and Consensus layers
                  </Text>
                </NLink>{" "}on the mainnet. Due to the complexity of testing and scope involving 11{" "}
                <NLink href="https://www.youtube.com/watch?v=AyidVR6X6J8">
                  <Text as="span" color="blue.500" textDecor="underline">
                    Ethereum Improvement Proposals (EIPs)
                  </Text>
                </NLink>, some EIPs were deferred to{" "}
                <NLink href="https://eipsinsight.com/eips/eip-7607">
                  <Text as="span" color="blue.500" textDecor="underline">
                    Fusaka
                  </Text>
                </NLink>. Testing is ongoing on{" "}
                <NLink href="https://notes.ethereum.org/@ethpandaops/pectra-devnet-6">
                  <Text as="span" color="blue.500" textDecor="underline">
                    Devnet 6
                  </Text>
                </NLink>.
              </Text>
            ) : selectedOption === 'fusaka' ? (
              <Text fontSize="md" lineHeight="1.75" textAlign="justify" >
                <NLink href="https://eipsinsight.com/upgrade/fusaka">
                  <Text as="span" color="blue.500" textDecor="underline">
                    Fusaka
                  </Text>
                </NLink>{" "}follows the Pectra upgrade, focusing on scaling and efficiency. Its headlining feature is{" "}
                <NLink href="https://eipsinsight.com/eips/eip-7594">
                  <Text as="span" color="blue.500" textDecor="underline">
                    PeerDAS
                  </Text>
                </NLink>{" "}(Peer Data Availability Sampling), enabling significant blob throughput scaling. Fusaka also raises the L1 gas limit to 60M and introduces "Blob Parameter Only" (BPO) forks to safely scale blob capacity. Scheduled for Mainnet activation at slot <Text as="span" fontWeight="bold">13,164,544</Text> (Dec 3, 2025), it includes optimizations for L1 performance and UX improvements.
              </Text>
            ) : selectedOption === 'hegota' ? (
              <VStack spacing={4} align="stretch">
                <Badge colorScheme="orange" fontSize="md" px={3} py={1} alignSelf="flex-start" borderRadius="full" >
                  Early Planning Stage
                </Badge>
                <Text fontSize="md" lineHeight="1.75" textAlign="justify" >
                  <NLink href="https://eipsinsight.com/eips/eip-8081">
                    <Text as="span" color="blue.500" textDecor="underline" fontWeight="bold">
                      Hegotá
                    </Text>
                  </NLink>{" "}is in early planning. The headliner proposal window will open soon. Check back for updates as the upgrade planning process begins.
                </Text>
                <Text fontSize="xs" color={useColorModeValue("gray.600", "gray.400")} lineHeight="1.75" textAlign="justify">
                  Future network upgrade currently in early planning stages. Named after the combination of{" "}
                  <Text as="span" fontWeight="semibold">"Heze"</Text> (consensus layer upgrade, named after a star) and{" "}
                  <Text as="span" fontWeight="semibold">"Bogotá"</Text> (execution layer upgrade, named after a Devcon location).
                </Text>
              </VStack>
            ) : (
              <Text fontSize="md" lineHeight="1.75" textAlign="justify" >
                Ethereum developers are now preparing for the next major network upgrade, known as{" "}
                <NLink href="/eips/eip-7773">
                  <Text as="span" color="blue.500" textDecor="underline">
                    Glamsterdam
                  </Text>
                </NLink>. This upgrade will introduce key changes to both the{" "}
                <NLink href="https://www.youtube.com/watch?v=nJ57mkttCH0">
                  <Text as="span" color="blue.500" textDecor="underline">
                    Execution and Consensus layers
                  </Text>
                </NLink>{" "}on mainnet. The name combines{" "}
                <Text as="span" fontWeight="bold">
                  Amsterdam
                </Text>{" "}(execution layer, from the previous Devconnect location) and{" "}
                <Text as="span" fontWeight="bold">
                  Gloas
                </Text>{" "}(consensus layer, named after a star), highlighting its focus on both core protocol areas. The headliner feature for Glamsterdam is still being decided, with several{" "}
                <NLink href="https://github.com/ethereum/EIPs/pulls?q=is%3Apr+is%3Aopen+milestone%3A%22Glamsterdam%22">
                  <Text as="span" color="blue.500" textDecor="underline">
                    Ethereum Improvement Proposals (EIPs)
                  </Text>
                </NLink>{" "}under review and active community discussions ongoing.
              </Text>
            )}
          </Box>

                   {/* Compact Blogs Section */}
          {selectedOption !== 'hegota' && currentPosts.length > 0 && (
            <Box
              bg={useColorModeValue("white", "gray.800")}
              borderRadius="xl"
              boxShadow="sm"
              border="1px solid"
              borderColor={useColorModeValue("gray.200", "gray.700")}
              p={4}
              mb={5}
              id="upgrade-blogs"
            >
              <Flex alignItems="center" mb={4}>
                <Heading fontSize="36px" fontWeight="bold" color="#40E0D0" mr={2}>Related Articles</Heading>
                <CopyLink link={`${typeof window !== 'undefined' ? window.location.origin : ''}/upgrade#upgrade-blogs`} />
              </Flex>
              <Box w="100%" position="relative">
                <Carousel
                  showArrows={true}
                  showStatus={false}
                  showThumbs={false}
                  infiniteLoop={false}
                  autoPlay={false}
                  swipeable={true}
                  emulateTouch={true}
                  centerMode={false}
                  showIndicators={false}
                  transitionTime={500}
                  renderArrowPrev={(clickHandler, hasPrev) => (
                    <button
                      onClick={clickHandler}
                      disabled={!hasPrev}
                      className="absolute z-10 p-2 transition-all -translate-y-1/2 rounded-full shadow-lg -left-3 top-1/2 bg-white/90 dark:bg-gray-700/90 hover:bg-white dark:hover:bg-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                  )}
                  renderArrowNext={(clickHandler, hasNext) => (
                    <button
                      onClick={clickHandler}
                      disabled={!hasNext}
                      className="absolute z-10 p-2 transition-all -translate-y-1/2 rounded-full shadow-lg -right-3 top-1/2 bg-white/90 dark:bg-gray-700/90 hover:bg-white dark:hover:bg-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                  )}
                >
                  {Array.from({ length: Math.max(1, currentPosts.length - 3) }).map((_, slideIndex) => (
                    <Box key={slideIndex} px={2}>
                      <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} spacing={3}>
                        {[0, 1, 2, 3].map((offset) => {
                          const postIndex = slideIndex + offset;
                          if (postIndex >= currentPosts.length) return null;
                          const post = currentPosts[postIndex];
                          return (
                            <Box
                              key={postIndex}
                              as="a"
                              href={post.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              borderRadius="lg"
                              overflow="hidden"
                              boxShadow="sm"
                              border="1px solid"
                              borderColor={useColorModeValue("gray.200", "gray.700")}
                              _hover={{
                                boxShadow: "md",
                                transform: "translateY(-2px)",
                                transition: "all 0.2s"
                              }}
                              cursor="pointer"
                              h="100%"
                              display="flex"
                              flexDirection="column"
                            >
                              <AspectRatio ratio={16/9} w="100%">
                                <Image 
                                  src={post.image.startsWith('http') ? post.image : `/${post.image}`}
                                  alt={post.title}
                                  objectFit="cover"
                                />
                              </AspectRatio>
                              <Box p={2.5} flex="1">
                                <Text fontSize="sm" fontWeight="semibold" noOfLines={2} lineHeight="1.3">
                                  {post.title}
                                </Text>
                              </Box>
                            </Box>
                          );
                        })}
                      </SimpleGrid>
                    </Box>
                  ))}
                </Carousel>
              </Box>
            </Box>
          )}

          {/* EIP Status Cards Section (SFI/CFI/PFI/DFI) */}
          {selectedOption !== 'hegota' && (
            <Box
              id="eip-status"
              bg={useColorModeValue("white", "gray.800")}
              borderRadius="xl"
              boxShadow="sm"
              border="1px solid"
              borderColor={useColorModeValue("gray.200", "gray.700")}
              p={4}
              mb={5}
            >
              <Flex alignItems="center" mb={4}>
                <Heading fontSize="36px" fontWeight="bold" color="#40E0D0" mr={2}>EIP Status Overview</Heading>
                <CopyLink link={`${typeof window !== 'undefined' ? window.location.origin : ''}/upgrade#eip-status`} />
              </Flex>
              {selectedOption === 'glamsterdam' ? (
                <VStack spacing={6} align="stretch">
                  {/* SFI Section */}
                  <UpgradeEIPsShowcase
                    upgradeName={upgradeName}
                    upgradeDate={upgradeDates[selectedOption]}
                    eips={glamsterdamScheduledData}
                    upgradeColor={upgradeColors[selectedOption]}
                    sectionTitle="Glamsterdam (SFI)"
                  />
                  
                  {/* CFI Section */}
                  <UpgradeEIPsShowcase
                    upgradeName={upgradeName}
                    upgradeDate={upgradeDates[selectedOption]}
                    eips={currentData}
                    upgradeColor={upgradeColors[selectedOption]}
                    sectionTitle="Glamsterdam (CFI)"
                  />
                  
                  {/* PFI Section */}
                  <UpgradeEIPsShowcase
                    upgradeName={upgradeName}
                    upgradeDate={upgradeDates[selectedOption]}
                    eips={glamsterdamProposedData}
                    upgradeColor={upgradeColors[selectedOption]}
                    sectionTitle="Glamsterdam (PFI)"
                  />
                </VStack>
              ) : (
                <UpgradeEIPsShowcase
                  upgradeName={upgradeName}
                  upgradeDate={upgradeDates[selectedOption]}
                  eips={currentData}
                  upgradeColor={upgradeColors[selectedOption]}
                />
              )}
            </Box>
          )}

 

          {/* Declined for Inclusion Section */}
          {selectedOption !== 'hegota' && (selectedOption === 'fusaka' || selectedOption === 'glamsterdam') && (
            <Box
              id="declined-eips"
              bg={useColorModeValue("white", "gray.800")}
              borderRadius="xl"
              boxShadow="sm"
              border="1px solid"
              borderColor={useColorModeValue("gray.200", "gray.700")}
              p={4}
              mb={5}
            >
              <Flex alignItems="center" mb={4}>
                <Heading fontSize="36px" fontWeight="bold" color="#40E0D0" mr={2}>Declined for Inclusion</Heading>
                <CopyLink link={`${typeof window !== 'undefined' ? window.location.origin : ''}/upgrade#declined-eips`} />
              </Flex>
              <DeclinedEIPListPage selectedUpgrade={selectedOption} />
            </Box>
          )}


          {/* Author Contributions Graph */}
          <Box
            bg={useColorModeValue('white', 'gray.800')}
            borderRadius="xl"
            boxShadow="sm"
            border="1px solid"
            borderColor={useColorModeValue('gray.200', 'gray.700')}
            p={4}
            mb={5}
            id="AuthorContributions"
          >
            <NetworkUpgradesChart2 />
          </Box>

          {/* Network Upgrades and EIPs Relationship Graph */}
          <Box
            bg={useColorModeValue('white', 'gray.800')}
            borderRadius="xl"
            boxShadow="sm"
            border="1px solid"
            borderColor={useColorModeValue('gray.200', 'gray.700')}
            p={4}
            mb={5}
          >
            <Flex alignItems="center" mb={4} id="NetworkUpgradesChartp">
              <Heading fontSize="36px" fontWeight="bold" color="#40E0D0" mr={2}>
                Network Upgrades and EIPs Relationship Graph
              </Heading>
              <CopyLink link={`${typeof window !== 'undefined' ? window.location.origin : ''}/upgrade#NetworkUpgradesChartp`} />
            </Flex>
            <Box 
              width="100%" 
              position="relative"
              minH={{ base: "400px", md: "500px", lg: "550px" }}
              overflow="hidden"
            >
              <Graph />
            </Box>
          </Box>

          </motion.div>
        )}

        {/* Place Your Ad Card */}
        <Box mb={5}>
          <PlaceYourAdCard />
        </Box>
      </Box>
    </AllLayout>
  </>
);
};

export default All;
