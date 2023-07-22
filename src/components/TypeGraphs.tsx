import React, {useState} from "react";
import {Box, Grid, Text, useColorModeValue} from "@chakra-ui/react";
import {motion} from "framer-motion";
import StackedColumnChart from "@/components/StackedColumnChart";
import AreaC from "@/components/AreaStatus";

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
    return (
        <>
            <Box
                hideBelow={'md'}
                paddingBottom={{md:'10', base: '10'}}
                marginX={{md:"40", base: '2'}}
                paddingX={{md:"10", base:'5'}}
                marginTop={{md:"10", base:'5'}}
            >
                <Grid templateColumns="1fr 2fr" gap={8} paddingTop={8}>
                    <Box>
                        <Text fontSize="3xl" fontWeight="bold" color="#4267B2">
                            Draft
                        </Text>

                    </Box>
                    <Box marginLeft={'38'} paddingLeft={'8'}>
                        <Text fontSize="3xl" fontWeight="bold" color="#4267B2">
                            Draft vs Final
                        </Text>

                    </Box>
                </Grid>
                <Grid templateColumns="2fr 3fr" gap={8}>
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
                        overflowX="auto"
                        _hover={{
                            border: "1px",
                            borderColor: "#10b981",
                        }}
                        as={motion.div}
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 } as any}
                        className="hover: cursor-pointer ease-in duration-200"
                    >

                        <StackedColumnChart status="Draft"/>


                    </Box>
                    <AreaC />
                </Grid>
                <Grid templateColumns="1fr 1fr 1fr" gap={8} paddingTop={8}>
                    <Text fontSize="3xl" fontWeight="bold" color="#10b981">
                        Review -{" "}
                        {data.filter((item) => item.status === "Review").length}
                    </Text>
                    <Text fontSize="3xl" fontWeight="bold" color="#10b981">
                        Stagnant -{" "}
                        {data.filter((item) => item.status === "Stagnant").length}
                    </Text>
                    <Text fontSize="3xl" fontWeight="bold" color="#10b981">
                        Living -{" "}
                        {data.filter((item) => item.status === "Living").length}
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
                            borderColor: "#10b981",
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
                            borderColor: "#10b981",
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
                            borderColor: "#10b981",
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
                    <Text fontSize="3xl" fontWeight="bold" color="#10b981">
                        Last Call -{" "}
                        {data.filter((item) => item.status === "Last Call").length}
                    </Text>
                    <Text fontSize="3xl" fontWeight="bold" color="#10b981">
                        Withdrawn -{" "}
                        {data.filter((item) => item.status === "Withdrawn").length}
                    </Text>
                    <Text fontSize="3xl" fontWeight="bold" color="#10b981">
                        Final - {data.filter((item) => item.status === "Final").length}
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
                            borderColor: "#10b981",
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
                            borderColor: "#10b981",
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
                            borderColor: "#10b981",
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
                display={{md:"none", base:"block"}}
                paddingBottom={{md:'10', base: '10'}}
                marginX={{md:"40", base: '2'}}
                paddingX={{md:"10", base:'5'}}
                marginTop={{md:"10", base:'5'}}
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
                        borderColor: "#10b981",
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

                <Text fontSize="xl" fontWeight="bold" color="#10b981" paddingTop={'8'}>
                    Review -{" "}
                    {data.filter((item) => item.status === "Review").length}
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
                        borderColor: "#10b981",
                    }}
                    as={motion.div}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 } as any}
                    className="hover: cursor-pointer ease-in duration-200"
                >
                    <StackedColumnChart status="Review" />
                </Box>

                <Text fontSize="xl" fontWeight="bold" color="#10b981" paddingTop={'8'}>
                    Stagnant -{" "}
                    {data.filter((item) => item.status === "Stagnant").length}
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
                        borderColor: "#10b981",
                    }}
                    as={motion.div}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 } as any}
                    className="hover: cursor-pointer ease-in duration-200"
                >
                    <StackedColumnChart status="Stagnant" />
                </Box>

                <Text fontSize="xl" fontWeight="bold" color="#10b981" paddingTop={'8'}>
                    Living -{" "}
                    {data.filter((item) => item.status === "Living").length}
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
                        borderColor: "#10b981",
                    }}
                    as={motion.div}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 } as any}
                    className="hover: cursor-pointer ease-in duration-200"
                >
                    <StackedColumnChart status="Living" />
                </Box>

                <Text fontSize="xl" fontWeight="bold" color="#10b981" paddingTop={'8'}>
                    Last Call -{" "}
                    {data.filter((item) => item.status === "Last Call").length}
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
                        borderColor: "#10b981",
                    }}
                    as={motion.div}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 } as any}
                    className="hover: cursor-pointer ease-in duration-200"
                >
                    <StackedColumnChart status="Last Call" />
                </Box>

                <Text fontSize="xl" fontWeight="bold" color="#10b981" paddingTop={'8'}>
                    Withdrawn -{" "}
                    {data.filter((item) => item.status === "Withdrawn").length}
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
                        borderColor: "#10b981",
                    }}
                    as={motion.div}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 } as any}
                    className="hover: cursor-pointer ease-in duration-200"
                >
                    <StackedColumnChart status="Withdrawn" />
                </Box>

                <Text fontSize="xl" fontWeight="bold" color="#10b981" paddingTop={'8'}>
                    Final - {data.filter((item) => item.status === "Final").length}
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
                        borderColor: "#10b981",
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