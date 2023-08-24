import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Header from '@/components/Header';
import {Box, Grid, useColorModeValue, Text} from '@chakra-ui/react';
import CustomBox from '@/components/CustomBox';
import OtherBox from '@/components/OtherStats';
import { PieC } from '@/components/InPie';
import AllLayout from '@/components/Layout';
import { motion } from 'framer-motion';
import LoaderComponent from '@/components/Loader';
import AreaC from '@/components/AreaStatus';
import StackedColumnChart from '@/components/DraftBarChart';
import TableStatus from '@/components/TableS';
interface StatusChange {
    _id: string;
    count: number;
    statusChanges: {
        [key: string]: any; // Add index signature here
        _id: string;
        eip: string;
        fromStatus: string;
        toStatus: string;
        title: string;
        status: string;
        author: string;
        created: string;
        changeDate: string;
        type: string;
        category: string;
        discussion: string;
        deadline: string;
        requires: string;
        pr: number;
        changedDay: number;
        changedMonth: number;
        changedYear: number;
        createdMonth: number;
        createdYear: number;
        __v: number;
    }[];
}


const getStatus = (status: string) => {
    switch (status) {
        case "Draft":
            return "Draft";
        case "Final" || "Accepted" || "Superseded":
            return "Final";
        case "Last Call":
            return "Last Call";
        case "Withdrawn" || "Abandoned" || "Rejected":
            return "Withdrawn";
        case "Review":
            return "Review";
        case "Living" || "Active":
            return "Living";
        case "Stagnant":
            return "Stagnant";
        default:
            return "Final";
    }
};


function getMonthName(monthNumber: number): string {
    const date = new Date();
    date.setMonth(monthNumber - 1); // Subtract 1 since months are zero-mdd in JavaScript
    const monthName = date.toLocaleString('default', { month: 'long' });
    return monthName;
}

const Monthd = () => {
    const [data, setData] = useState<StatusChange[]>([]); // Set initial state as an empty array
    const path = usePathname();
    let year = '2024';
    let month = '6';
    let statusx = 'Final'

    if (path) {
        const pathParts = path.split('/');
       statusx = pathParts[2];
        month = pathParts[3].split('-')[0];
        year = pathParts[3].split('-')[1];
    }
    console.log(year,month)
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`/api/statusChanges/${year}/${month}`);
                const jsonData = await response.json();
                setData(jsonData);
                
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [year, month]);
    console.log(data)
  
    const [isLoading, setIsLoading] = useState(true);

    const finalData = data.find((item) => item._id === "Draft");
    const statusChangesOfData = finalData ? finalData.statusChanges : [];
   

    useEffect(() => {
        // Simulating a loading delay
        const timeout = setTimeout(() => {
            setIsLoading(false);
        }, 2000);

        // Cleanup function
        return () => clearTimeout(timeout);
    }, []);
    const bg = useColorModeValue("#f6f6f7", "#171923");

    return (
        <AllLayout>
            {isLoading ? ( // Check if the data is still loading
                // Show loader if data is loading
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    height="100vh"
                >
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        {/* Your loader component */}
                        <LoaderComponent />
                    </motion.div>
                </Box>
            ) : (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                >
                   <TableStatus cat={statusChangesOfData}/>
                </motion.div>
            )}
        </AllLayout>
    );
};

export default Monthd;
