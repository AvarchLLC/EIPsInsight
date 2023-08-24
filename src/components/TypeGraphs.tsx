import React, {useEffect, useState} from "react";
import {Box, Grid, Text, useColorModeValue} from "@chakra-ui/react";
import {motion} from "framer-motion";
import StackedColumnChart from "@/components/StackedColumnChart";
import AreaC from "@/components/AreaStatus";
import NextLink from "next/link";
const getStatus = (status: string) => {
    switch (status) {
      case "Last Call":
        return "LastCall";
      default:
        return status;
    }
  };
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

const TypeGraphs: React.FC = () => {
    const bg = useColorModeValue("#f6f6f7", "#171923");
    const [data, setData] = useState<EIP[]>([]);
    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await fetch(`/api/alleips`);
            const jsonData = await response.json();
            setData(jsonData);
          } catch (error) {
            console.error('Error fetching data:', error);
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
                {/*<Grid templateColumns="1fr 2fr" gap={8} paddingTop={8}>*/}
                {/*    <Box>*/}
                {/*        <Text fontSize="3xl" fontWeight="bold" color="#4267B2">*/}
                {/*            Draft*/}
                {/*        </Text>*/}

                {/*    </Box>*/}
                {/*    <Box marginLeft={'38'} paddingLeft={'8'}>*/}
                {/*        <Text fontSize="3xl" fontWeight="bold" color="#4267B2">*/}
                {/*            Draft vs Final*/}
                {/*        </Text>*/}

                {/*    </Box>*/}
                {/*</Grid>*/}
                {/*<Grid templateColumns="2fr 3fr" gap={8}>*/}
                {/*    <Box*/}
                {/*        marginTop={"2rem"}*/}
                {/*        bg={bg}*/}
                {/*        p="0.5rem"*/}
                {/*        borderRadius="0.55rem"*/}
                {/*        display="flex"*/}
                {/*        flexDirection="column"*/}
                {/*        justifyContent="center"*/}
                {/*        alignItems="center"*/}
                {/*        height={400}*/}
                {/*        overflowX="auto"*/}
                {/*        _hover={{*/}
                {/*            border: "1px",*/}
                {/*            borderColor: "#30A0E0",*/}
                {/*        }}*/}
                {/*        as={motion.div}*/}
                {/*        initial={{ opacity: 0, y: -20 }}*/}
                {/*        animate={{ opacity: 1, y: 0 }}*/}
                {/*        transition={{ duration: 0.5 } as any}*/}
                {/*        className="hover: cursor-pointer ease-in duration-200"*/}
                {/*    >*/}

                {/*        <StackedColumnChart status="Draft"/>*/}


                {/*    </Box>*/}
                {/*    <AreaC />*/}
                {/*</Grid>*/}
                <Grid templateColumns="1fr 1fr 1fr" gap={8} >
                    <Text fontSize="3xl" fontWeight="bold" color="#30A0E0">
                        Review - <NextLink href={`/tableStatus/Review`}> [ {data.filter((item) => item.status === 'Review').length} ]</NextLink>
                    </Text>
                    <Text fontSize="3xl" fontWeight="bold" color="#30A0E0">
                        Stagnant -<NextLink href={`/tableStatus/Stagnant`}> [ {data.filter((item) => item.status === 'Stagnant').length} ]</NextLink>
                    </Text>
                    <Text fontSize="3xl" fontWeight="bold" color="#30A0E0">
                        Living -<NextLink href={`/tableStatus/Living`}> [ {data.filter((item) => item.status === 'Living').length} ]</NextLink>
                    </Text>
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
                        <StackedColumnChart status="Review" />
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
                        <StackedColumnChart status="Stagnant" />
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
                        <StackedColumnChart status="Living" />
                    </Box>
                </Grid>
                <Grid templateColumns="1fr 1fr 1fr" gap={8} paddingTop={8}>
                    <Text fontSize="3xl" fontWeight="bold" color="#30A0E0">
                        Last Call -<NextLink href={`/tableStatus/LastCall`}> [ {data.filter((item) => item.status === 'Last Call').length} ] </NextLink>
                    </Text>
                    <Text fontSize="3xl" fontWeight="bold" color="#30A0E0">
                        Withdrawn -<NextLink href={`/tableStatus/Withdrawn`}> [ {data.filter((item) => item.status === 'Withdrawn').length} ] </NextLink>
                    </Text>
                    <Text fontSize="3xl" fontWeight="bold" color="#30A0E0">
                        Final -<NextLink href={`/tableStatus/Final`}> [ {data.filter((item) => item.status === 'Final').length} ] </NextLink>
                    </Text>
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
                        <StackedColumnChart status="Last Call" />
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
                        <StackedColumnChart status="Withdrawn" />
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
                        <StackedColumnChart status="Final" />
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
                </Box>

                <Text fontSize="xl" fontWeight="bold" color="#4267B2" paddingTop={'8'}>
                    Draft vs Final
                </Text>

                <AreaC/>

                <Text fontSize="xl" fontWeight="bold" color="#30A0E0" paddingTop={'8'}>
                    Review
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
                    <StackedColumnChart status="Review" />
                </Box>

                <Text fontSize="xl" fontWeight="bold" color="#30A0E0" paddingTop={'8'}>
                    Stagnant
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
                    <StackedColumnChart status="Stagnant" />
                </Box>

                <Text fontSize="xl" fontWeight="bold" color="#30A0E0" paddingTop={'8'}>
                    Living
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
                    <StackedColumnChart status="Living" />
                </Box>

                <Text fontSize="xl" fontWeight="bold" color="#30A0E0" paddingTop={'8'}>
                    Last Call
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
                    <StackedColumnChart status="Last Call" />
                </Box>

                <Text fontSize="xl" fontWeight="bold" color="#30A0E0" paddingTop={'8'}>
                    Withdrawn
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
                    <StackedColumnChart status="Withdrawn" />
                </Box>

                <Text fontSize="xl" fontWeight="bold" color="#30A0E0" paddingTop={'8'}>
                    Final
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
                    <StackedColumnChart status="Final" />
                </Box>
            </Box>
        </>
    )
}

export default TypeGraphs;