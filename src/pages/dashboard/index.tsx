import FlexBetween from "@/components/FlexBetween";
import StatBox from "@/components/StatBox";
import CloseableAdCard from "@/components/CloseableAdCard";
import PlaceYourAdCard from "@/components/PlaceYourAdCard";
import {
    Box,
    Button,
    Heading,
    Icon,
    Text,
    useColorModeValue,
    useMediaQuery,
    useTheme,
    Link as LI
} from "@chakra-ui/react";
import React from "react";
import { mockEIP } from "@/data/eipdata";
import { useRouter } from "next/navigation";
import AllLayout from "@/components/Layout";
import Dashboard from "@/components/Dashboard"
import Head from "next/head"

const Dasboard = () => {
    const theme = useTheme();
    const isNonMediumScreens = useMediaQuery("(min-width: 1200px)");
    const data = mockEIP;
    const bg = useColorModeValue("#f6f6f7", "#171923");
    const text = useColorModeValue("white", "black");
    const router = useRouter()
    return (
        <AllLayout>
            <Head>
                <title>
                    Home
                </title>
            </Head>
            
            {/* EtherWorld Advertisement */}
            <Box my={6} width="100%">
                {/* <CloseableAdCard /> */}
            </Box>
            <Dashboard/>
            {/* Advertise With Us (moved lower for spacing) */}
            <Box my={12} width="100%">
                {/*<PlaceYourAdCard /> */}
            </Box>

        </AllLayout>
    );
};

export default Dasboard;
