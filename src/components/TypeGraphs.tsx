import React, {useEffect, useState} from "react";
import {Box, Grid, Text, useColorModeValue} from "@chakra-ui/react";
import {motion} from "framer-motion";
import StackedColumnChart from "@/components/StackedColumnChart";
import StatusColumnChart from "@/components/StatusColumnChart";
import AreaC from "@/components/AreaStatus";
import NextLink from "next/link";
import StatusChart from "@/components/StatusColumnChart";
import DateTime from "./DateTime";
const getStatus = (status: string) => {
    switch (status) {
      case "Last Call":
        return "LastCall";
      default:
        return status;
    }
  };

interface StatusChartData{
    statusChanges:[
        {
            eip: string;
            lastStatus: string;
            eipTitle: string;
            eipCategory: string;
        }
    ];
    year: number;
}

interface EIP {
    _id: string;
    eip: string;
    title: string;
    author: string;
    status: string;
    type: string;
    category: string;
    created: string;
    discussion: string;
    deadline: string;
    requires: string;
    unique_ID: number;
    __v: number;
}

const TypeGraphs = () => {
    const bg = useColorModeValue("#f6f6f7", "#171923");

    const [data, setData] = useState<EIP[]>([]); // Set initial state as an empty array
    const [isLoading, setIsLoading] = useState(true); // Loader state
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`/api/alleips`);
                console.log(response);
                const jsonData = await response.json();
                setData(jsonData);
                setIsLoading(false); // Set loader state to false after data is fetched
            } catch (error) {
                console.error("Error fetching data:", error);
                setIsLoading(false); // Set loader state to false even if an error occurs
            }
        };

        fetchData();
    }, []);

    return (
        <>
            <Box
                hideBelow={'lg'}
                paddingBottom={{lg:'10', sm: '10',base: '10'}}
                marginX={{lg:"40",md:'2', sm: '2', base: '2'}}
                paddingX={{lg:"10",md:'5', sm:'5',base:'5'}}
                marginTop={{lg:"10",md:'5', sm:'5',base:'5'}}
            >
                <Grid templateColumns="1fr 1fr 1fr" gap={8} >
                    <NextLink href={'/core'}>
                        <Text fontSize="3xl" fontWeight="bold" color="#30A0E0">
                            Core - [{data.filter((item) => item.category === "Core").length}]
                        </Text>
                    </NextLink>
                    <NextLink href={'/networking'}>
                        <Text fontSize="3xl" fontWeight="bold" color="#30A0E0">
                            Networking - [{data.filter((item) => item.category === "Networking").length}]
                        </Text>
                    </NextLink>
                    <NextLink href={'/interface'}>
                        <Text fontSize="3xl" fontWeight="bold" color="#30A0E0">
                            Interface - [{data.filter((item) => item.category === "Interface").length}]
                        </Text>
                    </NextLink>
                </Grid>
                <Grid templateColumns="1fr 1fr 1fr" gap={8}>
                    <Box
                        marginTop={"2rem"}
                        bg={bg}
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
                        className="hover: cursor-pointer ease-in duration-200"
                    >
                        <StatusColumnChart category={'Core'} />
                        <Box className={'w-full'}>
                            <DateTime />
                        </Box>
                    </Box>
                    <Box
                        marginTop={"2rem"}
                        bg={bg}
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
                        className="hover: cursor-pointer ease-in duration-200"
                    >
                        <StatusColumnChart category={'Networking'} />
                        <Box className={'w-full'}>
                            <DateTime />
                        </Box>
                    </Box>
                    <Box
                        marginTop={"2rem"}
                        bg={bg}
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
                        className="hover: cursor-pointer ease-in duration-200"
                    >
                        <StatusColumnChart category={'Interface'} />
                        <Box className={'w-full'}>
                            <DateTime />
                        </Box>
                    </Box>
                </Grid>
                <Grid templateColumns="1fr 1fr 1fr" gap={8} paddingTop={8}>
                    <NextLink href={'/erc'}>
                        <Text fontSize="3xl" fontWeight="bold" color="#30A0E0">
                            ERC - [{data.filter((item) => item.category === "ERC").length}]
                        </Text>
                    </NextLink>
                    <NextLink href={'/meta'}>
                        <Text fontSize="3xl" fontWeight="bold" color="#30A0E0">
                            Meta - [{data.filter((item) => item.type === "Meta").length}]
                        </Text>
                    </NextLink>
                    <NextLink href={'/informational'}>
                        <Text fontSize="3xl" fontWeight="bold" color="#30A0E0">
                            Informational - [{data.filter((item) => item.type === "Informational").length}]
                        </Text>
                    </NextLink>
                </Grid>
                <Grid templateColumns="1fr 1fr 1fr" gap={8}>
                    <Box
                        marginTop={"2rem"}
                        bg={bg}
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
                        className="hover: cursor-pointer ease-in duration-200"
                    >
                        <StatusColumnChart category={'ERCs'} />
                        <Box className={'w-full'}>
                            <DateTime />
                        </Box>
                    </Box>

                    <Box
                        marginTop={"2rem"}
                        bg={bg}
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
                        className="hover: cursor-pointer ease-in duration-200"
                    >
                        <StatusColumnChart category={'Meta'} />
                        <Box className={'w-full'}>
                            <DateTime />
                        </Box>
                    </Box>

                    <Box
                        marginTop={"2rem"}
                        bg={bg}
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
                        className="hover: cursor-pointer ease-in duration-200"
                    >
                        <StatusColumnChart category={'Informational'} />
                        <Box className={'w-full'}>
                            <DateTime />
                        </Box>
                    </Box>
                </Grid>
            </Box>


            <Box
                display={{lg:"none", sm:"block"}}
                paddingBottom={{lg:'10', sm: '10',base: '10'}}
                marginX={{lg:"40",md:'2', sm: '2', base: '2'}}
                paddingX={{lg:"10",md:'5', sm:'5',base:'5'}}
                marginTop={{lg:"10",md:'5', sm:'5',base:'5'}}
            >
                <Text fontSize="xl" fontWeight="bold" color="#4267B2">
                    Draft
                </Text>

                <Box
                    marginTop={"2rem"}
                    paddingTop={'8'}
                    bg={bg}
                    p="0.5rem"
                    borderRadius="0.55rem"
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                    height={400}
                    overflowX="auto"
                    _hover={{
                        border: "1px",
                        borderColor: "#30A0E0",
                    }}
                    as={motion.div}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 } as any}
                    className="hover: cursor-pointer ease-in duration-200"
                >
                    <StackedColumnChart status="Draft"/>
                    <Box className={'w-full'}>
                        <DateTime />
                    </Box>
                </Box>

                <Text fontSize="xl" fontWeight="bold" color="#4267B2" paddingTop={'8'}>
                    Draft vs Final
                </Text>

                <AreaC/>

                <NextLink href={'/core'}>
                    <Text fontSize="xl" fontWeight="bold" color="#30A0E0">
                        Core - [{data.filter((item) => item.category === "Core").length}]
                    </Text>
                </NextLink>

                <Box
                    marginTop={"2rem"}
                    bg={bg}
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
                    className="hover: cursor-pointer ease-in duration-200"
                >
                    <StatusColumnChart category={'Core'} />
                    <Box className={'w-full'}>
                        <DateTime />
                    </Box>
                </Box>

                <NextLink href={'/networking'}>
                    <Text fontSize="xl" fontWeight="bold" color="#30A0E0">
                        Networking - [{data.filter((item) => item.category === "Networking").length}]
                    </Text>
                </NextLink>

                <Box
                    marginTop={"2rem"}
                    bg={bg}
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
                    className="hover: cursor-pointer ease-in duration-200"
                >
                    <StatusColumnChart category={'Networking'} />
                    <Box className={'w-full'}>
                        <DateTime />
                    </Box>
                </Box>

                <NextLink href={'/interface'}>
                    <Text fontSize="xl" fontWeight="bold" color="#30A0E0">
                        Interface - [{data.filter((item) => item.category === "Interface").length}]
                    </Text>
                </NextLink>

                <Box
                    marginTop={"2rem"}
                    bg={bg}
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
                    className="hover: cursor-pointer ease-in duration-200"
                >
                    <StatusColumnChart category={'Interface'} />
                    <Box className={'w-full'}>
                        <DateTime />
                    </Box>
                </Box>

                <NextLink href={'/erc'}>
                    <Text fontSize="xl" fontWeight="bold" color="#30A0E0">
                        ERC - [{data.filter((item) => item.category === "ERC").length}]
                    </Text>
                </NextLink>

                <Box
                    marginTop={"2rem"}
                    bg={bg}
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
                    className="hover: cursor-pointer ease-in duration-200"
                >
                    <StatusColumnChart category={'ERCs'} />
                    <Box className={'w-full'}>
                        <DateTime />
                    </Box>
                </Box>

                <NextLink href={'/meta'}>
                    <Text fontSize="xl" fontWeight="bold" color="#30A0E0">
                        Meta - [{data.filter((item) => item.type === "Meta").length}]
                    </Text>
                </NextLink>

                <Box
                    marginTop={"2rem"}
                    bg={bg}
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
                    className="hover: cursor-pointer ease-in duration-200"
                >
                    <StatusColumnChart category={'Meta'} />
                    <Box className={'w-full'}>
                        <DateTime />
                    </Box>
                </Box>

                <NextLink href={'/informational'}>
                    <Text fontSize="xl" fontWeight="bold" color="#30A0E0">
                        Informational - [{data.filter((item) => item.type === "Informational").length}]
                    </Text>
                </NextLink>

                <Box
                    marginTop={"2rem"}
                    bg={bg}
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
                    className="hover: cursor-pointer ease-in duration-200"
                >
                    <StatusColumnChart category={'Informational'} />
                    <Box className={'w-full'}>
                        <DateTime />
                    </Box>
                </Box>
            </Box>
        </>
    )
}

export default TypeGraphs;