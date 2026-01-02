import React, { useState, useEffect } from "react";
import AllLayout from "@/components/Layout";
import CloseableAdCard from "@/components/CloseableAdCard";
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
  Badge,
  AspectRatio,
  Grid,
  GridItem,
  Select,
  VStack
} from "@chakra-ui/react";
import SlotCountdown from "@/components/SlotCountdown";
import NLink from "next/link";
import CatTable from "@/components/CatTable";
import Header from "@/components/Header";
import SearchBox from "@/components/SearchBox";
import { CCardBody, CSmartTable } from "@coreui/react-pro";
import { motion } from "framer-motion";
import PectraTable from "@/components/PectraTable";
import { Table, Thead, Tbody, Tr, Th, Td, Link, TableContainer } from "@chakra-ui/react";
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import NetworkUpgradesChart from "@/components/NetworkUpgradesChart";
import NetworkUpgradesChart2 from "@/components/NetworkUpgradesChart2";
import { FaSyncAlt } from "react-icons/fa";
import { useRouter } from "next/router";
import Graph from "@/components/EIP3DWrapper"
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { IconButton } from '@chakra-ui/react';
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
import EthereumUpgradesFAQ from "@/components/EthereumUpgradesFAQ";


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
      image: "fusakaimg5.jpg",
      title: "Glamsterdam: The Next Upgrade After Fusaka",
      content: "Glamsterdam merges the star Gloas with Amsterdam for Ethereum’s next upgrade. Explore its origins, naming traditions, and why Devconnect cities might shape future upgrade names.",
      link: "https://etherworld.co/2025/01/09/glamsterdam-the-next-upgrade-after-fusaka/",
    },
    {

      image: "glamsterdamimg1.jpg",
      title: "Ethereum Gears Up for Glamsterdam with these Proposals",
      content: "As Ethereum moves closer to its next scheduled hard fork, Glamsterdam, the core developer community is actively evaluating a shortlist of high-impact Ethereum Improvement Proposals (EIPs) referred to as headliners. ",
      link: "https://etherworld.co/2025/06/10/ethereum-gears-up-for-glamsterdam-with-these-proposals/",
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
const glamsterdamData = [
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
    eip: "7805",
    title: "Fork-choice enforced Inclusion Lists (FOCIL)",
    author: "Thomas Thiery (@soispoke), Vitalik Buterin (@vbuterin), Mike Neuder (@michaelneuder), Justin Drake (@justindrake), Francesco D'Amato (@fradamt)",
    link: "https://eipsinsight.com/eips/eip-7805",
    type: "Standards Track",
    category: "Core",
    discussion: "https://ethereum-magicians.org/t/eip-7805-fork-choice-enforced-inclusion-lists-focil/21208"
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
    eip: "8024",
    title: "Backward compatible SWAPN, DUPN, EXCHANGE",
    author: "Francisco Giordano (@frangio), Charles Cooper (@charles-cooper), Alex Beregszaszi (@axic)",
    link: "https://eipsinsight.com/eips/eip-8024",
    type: "Standards Track",
    category: "Core",
    discussion: "https://ethereum-magicians.org/t/eip-8024-backward-compatible-swapn-dupn-exchange/25486"
  },
  {
    eip: "8045",
    title: "Exclude slashed validators from proposing",
    author: "Francesco D'Amato (@fradamt), Barnabas Busa (@barnabasbusa)",
    link: "https://eipsinsight.com/eips/eip-8045",
    type: "Standards Track",
    category: "Core",
    discussion: "https://ethereum-magicians.org/t/eip-8045-exclude-slashed-validators-from-proposing/25850"
  }
];

// PFI (PFI) EIPs for Glamsterdam
const glamsterdamProposedData = [
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
    eip: "2926",
    title: "Chunk-based code merkelization",
    author: "Alexey Akhunov (@AlexeyAkhunov), Sina Mahmoodi (@s1na)",
    link: "https://eipsinsight.com/eips/eip-2926",
    type: "Standards Track",
    category: "Core",
    discussion: "https://ethereum-magicians.org/t/eip-2926-chunk-based-code-merkleization/4555"
  },
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
    eip: "7668",
    title: "Remove bloom filters",
    author: "Vitalik Buterin (@vbuterin)",
    link: "https://eipsinsight.com/eips/eip-7668",
    type: "Standards Track",
    category: "Core",
    discussion: "https://ethereum-magicians.org/t/eip-7653-remove-bloom-filters/19447"
  },
  {
    eip: "7686",
    title: "Linear EVM memory limits",
    author: "Sam Wilson (@SamWilsn)",
    link: "https://eipsinsight.com/eips/eip-7686",
    type: "Standards Track",
    category: "Core",
    discussion: "https://ethereum-magicians.org/t/eip-7686-linear-evm-memory-limits/19695"
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
    eip: "7745",
    title: "Trustless log index",
    author: "Péter Garamvölgyi (@chfast), Matt Garnett (@lightclient)",
    link: "https://eipsinsight.com/eips/eip-7745",
    type: "Standards Track",
    category: "Core",
    discussion: "https://ethereum-magicians.org/t/eip-7745-two-dimensional-log-filter-data-structure/21313"
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
    eip: "7904",
    title: "General Repricing",
    author: "Jacek Glen (@JacekGlen), Lukasz Glen (@lukasz-glen), Maria Silva (@misilva73)",
    link: "https://eipsinsight.com/eips/eip-7904",
    type: "Standards Track",
    category: "Core",
    discussion: "https://ethereum-magicians.org/t/gas-cost-repricing-to-reflect-computational-complexity/23067"
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
    eip: "7923",
    title: "Linear, Page-Based Memory Costing",
    author: "lightclient (@lightclient)",
    link: "https://eipsinsight.com/eips/eip-7923",
    type: "Standards Track",
    category: "Core",
    discussion: "https://ethereum-magicians.org/t/eip-7923-increase-blob-throughput-during-surge/23351"
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
    author: "Charles Cooper (@charles-cooper), Ben Adams (@benaadams), Maria Silva (@misilva73), Jochem Brouwer (@jochem-brouwer)",
    link: "https://eipsinsight.com/eips/eip-7971",
    type: "Standards Track",
    category: "Core",
    discussion: "https://ethereum-magicians.org/t/add-eip-hard-limit-and-cost-reduction-for-transient-storage-allocation/24542"
  },
  {
    eip: "7973",
    title: "Warm Account Write Metering",
    author: "Pascal Caversaccio (@pcaversaccio)",
    link: "https://eipsinsight.com/eips/eip-7973",
    type: "Standards Track",
    category: "Core",
    discussion: "https://ethereum-magicians.org/t/eip-7973-prevent-overwriting-existing-storage-keys-in-the-same-transaction/24571"
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
    eip: "8032",
    title: "Size-Based Storage Gas Pricing",
    author: "Guillaume Ballet (@gballet), Ignacio Hagopian (@jsign), Gottfried Herold (@GottfriedHerold), Jamie Lokier (@jlokier)",
    link: "https://eipsinsight.com/eips/eip-8032",
    type: "Standards Track",
    category: "Core",
    discussion: "https://ethereum-magicians.org/t/eip-8032-verkle-state-transition-mechanics/25542"
  },
  {
    eip: "8037",
    title: "State Creation Gas Cost Increase",
    author: "Mikhail Kalinin (@mkalinin), Francesco D'Amato (@fradamt), Aditya Asgaonkar (@adiasg)",
    link: "https://eipsinsight.com/eips/eip-8037",
    type: "Standards Track",
    category: "Core",
    discussion: "https://ethereum-magicians.org/t/uncouple-execution-payload-from-beacon-block/23029"
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
    eip: "8051",
    title: "Precompile for ML-DSA signature verification",
    author: "lightclient (@lightclient)",
    link: "https://eipsinsight.com/eips/eip-8051",
    type: "Standards Track",
    category: "Core",
    discussion: "https://ethereum-magicians.org/t/eip-8051-precompile-for-ml-dsa/25800"
  },
  {
    eip: "8058",
    title: "Contract Bytecode Deduplication Discount",
    author: "Danno Ferrin (@shemnon)",
    link: "https://eipsinsight.com/eips/eip-8058",
    type: "Standards Track",
    category: "Core",
    discussion: "https://ethereum-magicians.org/t/eip-8058-restrict-initcode-to-2-24/25947"
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
    author: "Raúl Kripalani (@raulk), Bosul Mun (@healthykim), Francesco D'Amato (@fradamt), Csaba Kiraly (@cskiraly), Felix Lange (@fjl), Marios Ioannou (@mariosioannou-create), Alex Stokes (@ralexstokes)",
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
    "pectra",
    "fusaka",
    "glamsterdam",
    "hegota",
    "NetworkUpgradesChart",
    "upgrade-blogs",
    "NetworkUpgrades",
    "dfi",
    "upgrade-table",
    "NetworkUpgradesChartp",
    "AuthorContributions",
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
      <Box px={{ base: 3, md: 5, lg: 8 }} py={{ base: 3, md: 4, lg: 6 }}>
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
          {/* Container 0: FAQ Section */}
          <Box
            bg={useColorModeValue("white", "gray.800")}
            borderRadius={{ base: "lg", md: "xl" }}
            boxShadow="sm"
            border="1px solid"
            borderColor={useColorModeValue("gray.200", "gray.700")}
            mb={{ base: 4, md: 6, lg: 8 }}
            px={{ base: 3, sm: 4, md: 6 }}
            py={{ base: 4, sm: 6, md: 8 }}
          >
            <EthereumUpgradesFAQ />
          </Box>

          {/* Container 1: Page Header + Selector + Countdown */}
          <Box
            bg={useColorModeValue("white", "gray.800")}
            borderRadius={{ base: "lg", md: "xl" }}
            boxShadow="sm"
            border="1px solid"
            borderColor={useColorModeValue("gray.200", "gray.700")}
            mb={{ base: 4, md: 6, lg: 8 }}
            px={{ base: 3, sm: 4, md: 6 }}
            py={{ base: 4, sm: 6, md: 8 }}
          >
            <Text
              as={motion.div}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 } as any}
              fontSize={{ base: "xl", sm: "2xl", md: "3xl", lg: "4xl" }}
              fontWeight="bold"
              color="#00CED1"
              id="pectrafusaka"
              textAlign="center"
              mb={{ base: 4, md: 6 }}
            >
              Ethereum Network Upgrades
            </Text>
            
            <Box mb={{ base: 3, md: 4 }}>
              <select
                value={selectedOption}
                onChange={handleSelectChange}
                style={{
                  width: '100%',
                  maxWidth: '300px',
                  padding: '10px 16px',
                  fontSize: '16px',
                  borderRadius: '8px',
                  border: '1px solid gray',
                }}
              >
                <option value="glamsterdam">Glamsterdam</option>
                <option value="hegota">Hegotá</option>
                <option value="fusaka">Fusaka</option>
                <option value="pectra">Pectra</option>
              </select>
            </Box>

            {/* Horizontal Upgrade Timeline */}
            <Box mb={{ base: 4, md: 6, lg: 8 }}>
              <HorizontalUpgradeTimeline
                selectedUpgrade={selectedOption}
                onUpgradeClick={(upgrade) => {
                  setSelectedOption(upgrade);
                  router.push(`/upgrade/${upgrade}`);
                }}
              />
            </Box>
            
            {/* FUSAKA Countdown - Only show when Fusaka is selected */}
            {selectedOption === 'fusaka' && (
              <Box>
                <SlotCountdown />
              </Box>
            )}
            
            {/* Network Upgrade Timeline (UpgradesTimeline) */}
            {selectedOption !== 'hegota' && (
              <Box id="NetworkUpgrades" mt={{ base: 4, md: 6, lg: 8 }}>
                <UpgradesTimeline
                  selectedOption={selectedOption}
                  setSelectedOption={setSelectedOption}
                  pectraData={pectraData}
                  fusakaData={fusakaData}
                />
              </Box>
            )}
          </Box>
          


          {/* Container 3: Description */}
          <Box
            bg={useColorModeValue("white", "gray.800")}
            borderRadius={{ base: "lg", md: "xl" }}
            boxShadow="sm"
            border="1px solid"
            borderColor={useColorModeValue("gray.200", "gray.700")}
            transition="background-color .15s ease, border-color .15s ease"
            mb={{ base: 4, md: 6, lg: 8 }}
            px={{ base: 3, sm: 4, md: 6 }}
            py={{ base: 4, sm: 6, md: 8 }}
          >
            <Flex
              direction={{ base: "column", md: "row" }}
              align="flex-start"
              gap={{ base: 6, md: 8 }}
              width="100%"
              wrap="wrap"
            >
              <Box flex="1">
                {selectedOption === 'pectra' ? (
                  <Text fontSize={{ base: "sm", md: "md", lg: "lg" }} lineHeight={{ base: "1.6", md: "1.75" }} textAlign="justify">
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
                  <Text fontSize={{ base: "sm", md: "md", lg: "lg" }} lineHeight={{ base: "1.6", md: "1.75" }} textAlign="justify">
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
                  <Box>
                    <VStack spacing={4} align="stretch">
                      <Badge colorScheme="orange" fontSize="md" px={3} py={1} alignSelf="flex-start" borderRadius="full">
                        Early Planning Stage
                      </Badge>
                      <Text fontSize={{ base: "sm", md: "md", lg: "lg" }} lineHeight={{ base: "1.6", md: "1.75" }} textAlign="justify">
                        <NLink href="https://eipsinsight.com/eips/eip-8081">
                          <Text as="span" color="blue.500" textDecor="underline" fontWeight="bold">
                            Hegotá
                          </Text>
                        </NLink>{" "}is in early planning. The headliner proposal window will open soon. Check back for updates as the upgrade planning process begins.
                      </Text>
                      <Text fontSize={{ base: "xs", md: "sm" }} color={useColorModeValue("gray.600", "gray.400")} lineHeight={{ base: "1.6", md: "1.75" }} textAlign="justify">
                        Future network upgrade currently in early planning stages. Named after the combination of{" "}
                        <Text as="span" fontWeight="semibold">"Heze"</Text> (consensus layer upgrade, named after a star) and{" "}
                        <Text as="span" fontWeight="semibold">"Bogotá"</Text> (execution layer upgrade, named after a Devcon location).
                      </Text>
                    </VStack>
                  </Box>
                ) : (
                  <Text fontSize={{ base: "sm", md: "md", lg: "lg" }} lineHeight={{ base: "1.6", md: "1.75" }} textAlign="justify">
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
            </Flex>
            
            {/* Network Upgrade Inclusion Stages Chart (FUSAKA) */}

          </Box>

          {/* Container: EIP Showcase Section */}
          {selectedOption !== 'hegota' && (
            <Box
              bg={useColorModeValue("white", "gray.800")}
              borderRadius={{ base: "lg", md: "xl" }}
              boxShadow="sm"
              border="1px solid"
              borderColor={useColorModeValue("gray.200", "gray.700")}
              mb={{ base: 4, md: 6, lg: 8 }}
              px={{ base: 3, sm: 4, md: 6 }}
              py={{ base: 4, sm: 6, md: 8 }}
            >
              {selectedOption === 'glamsterdam' ? (
                <VStack spacing={12} align="stretch">
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

          {/* Container 4: Blog Cards Section */}
          {selectedOption !== 'hegota' && currentPosts.length > 0 && (
            <Box
              bg={useColorModeValue("white", "gray.800")}
              borderRadius={{ base: "lg", md: "xl" }}
              boxShadow="sm"
              border="1px solid"
              borderColor={useColorModeValue("gray.200", "gray.700")}
              mb={{ base: 4, md: 6, lg: 8 }}
              px={{ base: 3, sm: 4, md: 6 }}
              py={{ base: 4, sm: 6, md: 8 }}
            >
            <Box maxH={{ base: "600px", md: "450px" }} overflowY="auto" width="100%" id="upgrade-blogs">
              <Grid
                templateColumns={{ base: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }}
                gap={{ base: 4, md: 6 }}
              >
                {currentPosts?.map((post, index) => {
                  const isLastRow =
                    index >= currentPosts.length - (currentPosts.length % 3 || 3);
                  const lastRowCount = currentPosts.length % 3;
                  const colSpan =
                    lastRowCount === 2 && isLastRow && isMediumOrLarger ? 1.5 : 1;

                  return (
                    <GridItem
                      key={index}
                      colSpan={colSpan}
                      display="flex"
                      justifyContent="center"
                      alignItems="stretch"
                    >
                      <Box
                        width="100%"
                        borderWidth="1px"
                        borderRadius="lg"
                        overflow="hidden"
                        shadow="md"
                      >
                        <Card
                          image={post.image}
                          title={post.title}
                          content={post.content}
                          link={post.link}
                        />
                      </Box>
                    </GridItem>
                  );
                })}
              </Grid>
            </Box>
            </Box>
          )}

          {/* Container 5: Upgrade Table + Declined EIPs */}
          {selectedOption !== 'hegota' && (
            <Box
              bg={useColorModeValue("white", "gray.800")}
              borderRadius={{ base: "lg", md: "xl" }}
              boxShadow="sm"
              border="1px solid"
              borderColor={useColorModeValue("gray.200", "gray.700")}
              mb={{ base: 4, md: 6, lg: 8 }}
              px={{ base: 3, sm: 4, md: 6 }}
              py={{ base: 4, sm: 6, md: 8 }}
            >

            {(selectedOption === 'fusaka' || selectedOption === 'glamsterdam') && (
              <Box>
                <Text
                  fontSize={{ base: 'xl', md: '2xl', lg: '3xl' }}
                  fontWeight="bold"
                  color="#00CED1"
                  textAlign="left"
                  mb={{ base: 4, md: 6 }}
                >
                  Declined for Inclusion
                </Text>
                <DeclinedEIPListPage
                  selectedUpgrade={selectedOption}
                />
              </Box>
            )}


            </Box>
          )}

          {/* EtherWorld Advertisement */}
          {selectedOption !== 'hegota' && (
            <Box my={{ base: 4, md: 6 }}>
              <CloseableAdCard />
            </Box>
          )}

          {/* Container 6: Author Contributions */}
          <Box
            bg={useColorModeValue('white', 'gray.800')}
            borderRadius={{ base: "lg", md: "xl" }}
            boxShadow="sm"
            border="1px solid"
            borderColor={useColorModeValue('gray.200', 'gray.700')}
            mb={{ base: 4, md: 6, lg: 8 }}
            px={{ base: 3, sm: 4, md: 6 }}
            py={{ base: 4, sm: 6, md: 8 }}
          >
            <Box id="AuthorContributions">
              <NetworkUpgradesChart2 />
            </Box>
          </Box>

          {/* Container 7: Network Upgrades and EIPs Relationship Graph */}
          <Box
            bg={useColorModeValue('white', 'gray.800')}
            borderRadius={{ base: "lg", md: "xl" }}
            boxShadow="sm"
            border="1px solid"
            borderColor={useColorModeValue('gray.200', 'gray.700')}
            mb={{ base: 4, md: 6, lg: 8 }}
            px={{ base: 3, sm: 4, md: 6 }}
            py={{ base: 4, sm: 6, md: 8 }}
          >
            <Box mb={{ base: 4, md: 6 }}>
              <Text
                fontSize={{ base: 'xl', md: '2xl', lg: '3xl' }}
                fontWeight="bold"
                color="#00CED1"
                textAlign="left"
                id="NetworkUpgradesChartp"
              >
                Network Upgrades and EIPs Relationship Graph
              </Text>
            </Box>
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

        {/* Place Your Ad Card - No Container */}
        <Box my={{ base: 4, md: 6, lg: 8 }}>
          <PlaceYourAdCard />
        </Box>
      </Box>
    </AllLayout>
  </>
);
};

export default All;
