import React from 'react'
import AllLayout from '../all/AllLayout'
import { Box, Button } from '@chakra-ui/react'
import FlexBetween from '@/components/FlexBetween'
import Header from '@/components/Header'
import { DownloadIcon } from '@chakra-ui/icons'
import Table from '@/components/Table'
import LineChart from '@/components/LineChart'
import TableStatus from '@/components/TableStatus'
import LineStatus from '@/components/LineStatus'
const Meta = () => {
  return (
    <AllLayout>
    <Box className="ml-40 mr-40 pl-10 pr-10 mt-10">
      <FlexBetween>
      <Header title="Category - Meta" subtitle="Meta EIPs describe changes to the EIP process, or other non optional changes." />
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
      <TableStatus cat='Meta'/>
      <LineStatus cat='Meta' />
    </Box>
  </AllLayout>
  )
}

export default Meta