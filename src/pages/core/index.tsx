import React from 'react'
import AllLayout from '../all/AllLayout'
import { Box, Button } from '@chakra-ui/react'
import FlexBetween from '@/components/FlexBetween'
import Header from '@/components/Header'
import { DownloadIcon } from '@chakra-ui/icons'
import Table from '@/components/Table'
import LineChart from '@/components/LineChart'

const Core = () => {
  return (
    <AllLayout>
    <Box className="ml-40 mr-40 pl-10 pr-10 mt-10">
      <FlexBetween>
        <Header title="All EIPs" subtitle="Your Roadway to All" />
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
      <Table />
      <LineChart />
    </Box>
  </AllLayout>
  )
}

export default Core