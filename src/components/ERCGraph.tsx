import React from 'react';
import {motion} from "framer-motion";
import StatusColumnChart from "@/components/StatusColumnChart";
import {Box, useColorModeValue} from "@chakra-ui/react";
import DateTime from "@/components/DateTime";

const ERCGraph =() => {
    const bg = useColorModeValue("#f6f6f7", "#171923");
    return(
        <>
            <Box
                bg={bg}
                marginTop={"1.5rem"}
                borderRadius="0.55rem"
            >
                <Box

                    p="0.5rem"
                    borderRadius="0.55rem"
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                    height={400}
                    _hover={{
                        border: "1px",
                        borderColor: "#30A0E0",
                    }}
                    as={motion.div}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 } as any}
                    className="hover:cursor-pointer ease-in duration-200 overflow-y-hidden"
                >
                    <StatusColumnChart category={'ERCs'}/>
                </Box>
                <Box className={'w-full'}>
                    <DateTime />
                </Box>
            </Box>
        </>
    )
}

export default ERCGraph;