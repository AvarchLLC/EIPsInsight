'use client'
import BarChart from '@/components/BarChart';
import StatBox from '@/components/StatBox';
import Dasboard from '@/pages/dashboard';
import { LoadingProgressProvider, useLoadingProgress } from '@/components/Loading';
import { EmailIcon } from '@chakra-ui/icons';
import { ColorModeScript, Button, useColorMode } from '@chakra-ui/react';


export default function Home() {
  const { toggleColorMode } = useColorMode()
  return (
    <div>
      <LoadingProgressProvider>
      {/* <BarChart/> */}
    <Dasboard/>
    </LoadingProgressProvider>
    </div>
    // <div>
      
    // <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={toggleColorMode}>Click me</button>
    // Hello</div>
  )
}