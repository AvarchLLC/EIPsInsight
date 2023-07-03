'use client'
import BarChart from '@/components/BarChart';
import Dashboard from '@/components/Dashboard';
import StatBox from '@/components/StatBox';
import { EmailIcon } from '@chakra-ui/icons';
import { ColorModeScript, Button, useColorMode } from '@chakra-ui/react';


export default function Home() {
  const { toggleColorMode } = useColorMode()
  return (
    <div>
    <Dashboard/>
    </div>

  )
}