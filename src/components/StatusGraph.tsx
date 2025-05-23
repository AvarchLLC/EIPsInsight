import React, { useEffect, useState } from "react";
import {
    Box,
    Spinner,
    useColorModeValue,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import StatusColumnChart from "@/components/StatusColumnChart";
import DateTime from "./DateTime";

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

const StatusGraphs = ({ selected }: { selected: string }) => {
    const bg = useColorModeValue("#f6f6f7", "#171923");

    const [data, setData] = useState<EIP[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`/api/new/all`);
                const jsonData = await response.json();
                setData(jsonData.eip);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);



    if (isLoading) {
        return <Spinner mt={10} thickness="4px" size="xl" color="blue.400" />;
    }
    
    return (
        <Box
            bg={bg}
            w="full"
            p={4}
            borderRadius="lg"
            boxShadow="md"
            position="relative"
            as={motion.div}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition="all 0.5s ease-in-out"
        >
            <Box w="full" h={{ base: "300px", md: "400px" }}>
                <StatusColumnChart category={selected} type="EIPs" filterMode={"category"} />
            </Box>
            <Box mt={8}>
                <DateTime />
            </Box>
        </Box>

    );

};


export default StatusGraphs;
