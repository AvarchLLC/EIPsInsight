'use client'
import DashboardDonut from '@/components/DashboardDonut';
import Dashboard from '@/components/Dashboard';
import StatBox from '@/components/StatBox';
import { EmailIcon } from '@chakra-ui/icons';
import { ColorModeScript, Button, useColorMode } from '@chakra-ui/react';
import {redirect} from "next/navigation";


redirect('/home');


export default function Home() {
  const { toggleColorMode } = useColorMode();
}