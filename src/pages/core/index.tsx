import React from 'react'
import AllLayout from "@/components/Layout";
import { Box, Button } from '@chakra-ui/react'
import FlexBetween from '@/components/FlexBetween'
import Header from '@/components/Header'
import { DownloadIcon } from '@chakra-ui/icons'
import Table from '@/components/Table'
import LineChart from '@/components/LineChart'
import TableStatus from '@/components/TableStatus'
import LineStatus from '@/components/LineStatus'

const Core = () => {
  return (
    <AllLayout>
    <Box className="ml-40 mr-40 pl-10 pr-10 mt-10">
      <FlexBetween>
        <Header title="Category - Core" subtitle="Core EIPs describe changes to the Ethereum protocol." />
      </FlexBetween>
      <TableStatus cat='Core'/>
      <LineStatus cat='Core'/>
    </Box>
  </AllLayout>
  )
}

export default Core