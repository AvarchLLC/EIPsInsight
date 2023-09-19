import React, {useEffect, useState} from 'react';
import {Box, Icon, useColorModeValue} from "@chakra-ui/react";
import {BookOpen} from "react-feather";
import CatBox from "@/components/CatBox";

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

const ERCCatBoxGrid = () => {
    const [data, setData] = useState<EIP[]>([]); // Set initial state as an empty array
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`/api/alleips`);
                console.log(response);
                const jsonData = await response.json();
                setData(jsonData);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);
    const bg = useColorModeValue("#f6f6f7", "#171923");

    const draftCount = data.filter(item => item.category==='ERC' && item.status === "Draft").length;
    const reviewCount = data.filter(item =>item.category==='ERC' &&item.status === "Review").length;
    const lastCallCount = data.filter(item =>item.category==='ERC' && item.status === "Last Call").length;
    const livingCount = data.filter(item =>item.category==='ERC' && item.status === "Living").length;
    const finalCount = data.filter(item =>item.category==='ERC' && item.status === "Final").length;
    const stagnantCount = data.filter(item =>item.category==='ERC' && item.status === "Stagnant").length;
    const withdrawnCount = data.filter(item =>item.category==='ERC' && item.status === "Withdrawn").length;
    const totalCount = data.filter(item =>item.category==='ERC').length;
    return (
        <Box display={'grid'} gridTemplateColumns={{lg:'repeat(14,1fr)',md:'repeat(8,1fr)',base:'repeat(4,1fr)'}} gap={6}>
            <CatBox
                title="Draft"
                value={draftCount}
                icon={null}
                url=""
                percent={Math.round((draftCount/totalCount)*100)}
            />
            <CatBox
                title="Review"
                value={reviewCount}
                icon={null}
                url=""
                percent={Math.round((reviewCount/totalCount)*100)}
            />
            <CatBox
                title="Last Call"
                value={lastCallCount}
                icon={null}
                url=""
                percent={Math.round((lastCallCount/totalCount)*100)}
            />
            <CatBox
                title="Living"
                value={livingCount}
                icon={null}
                url=""
                percent={Math.round((livingCount/totalCount)*100)}
            />
            <CatBox
                title="Final"
                value={finalCount}
                icon={null}
                url=""
                percent={Math.round((finalCount/totalCount)*100)}
            />
            <CatBox
                title="Stagnant"
                value={stagnantCount}
                icon={null}
                url=""
                percent={Math.round((stagnantCount/totalCount)*100)}
            />
            <CatBox
                title="Withdrawn"
                value={withdrawnCount}
                icon={null}
                url=""
                percent={Math.round((withdrawnCount/totalCount)*100)}
            />
        </Box>
    );
};

export default ERCCatBoxGrid;